
const mariadb = require('mariadb');
/// <reference path="./classifier" />
let count = 0;

class Database {

    /**
     * @param {import('./classifier').CustomClassifier|import('./numbersmodel').NumbersClassifier} classifier
     * @returns {Promise<Array<{modelkey:string,modelvalue:string}>>}
     */
    async getWeights(classifier) {
        const table = this.toDBName(classifier);
        try {
            /**@type {Array} */
            const rows = await sqlquery(`SELECT * FROM ${table}`);
            return rows.filter(row => row.modelkey !== 'name' && row.modelkey !== 'timestamp');
        } catch(e) {
            if(e.code === 'ER_NO_SUCH_TABLE') {
                console.error('table doesnt exist');
                return [];
            }
            throw e;
        }
    }
    /**
     *
     * @param {import('./classifier').CustomClassifier|import('./numbersmodel').NumbersClassifier} classifier
     */
    toDBName(classifier) {
        if(!classifier.name) {
            throw 'missing classifier name';
        }
        return 'knn_classfier_weights_' + classifier.name;
    }

    /**
     *
    * @param {import('./classifier').CustomClassifier|import('./numbersmodel').NumbersClassifier} classifier
    */
    async save(classifier) {
        const tableName = this.toDBName(classifier);

        await query(async pool => {
            const connection = await pool.getConnection();
            try {
                await connection.query(`LOCK TABLE ${tableName} WRITE`);
            } catch(e) {
                if(e.code === 'ER_NO_SUCH_TABLE') {
                    await connection.query(`CREATE TABLE \`${tableName}\` (
                        \`modelkey\` VARCHAR(50) NOT NULL DEFAULT 'null',
                        \`modelvalue\` LONGTEXT NULL,
                        PRIMARY KEY (\`modelkey\`)
                    )
                    COLLATE='latin1_swedish_ci'
                    ENGINE=InnoDB
                    ;`);
                    await connection.query(`LOCK TABLE ${tableName} WRITE`);
                }
            }
            console.log('locked table');
            await connection.query(`DELETE FROM \`${tableName}\``);

            let dataset = await classifier.getClassifierDataset();
            let sql = `INSERT INTO ${tableName} ( modelkey,modelvalue) VALUES `;
            let params = [];

            let index = 1;
            for(let key of Object.keys(dataset)) {
                if(key !== 'timestamp' && key !== 'name') {
                    sql += ' ( ? , ? ) ,';

                    let data = dataset[key];
                    if(data.dataSync) {
                        data = data.dataSync();
                    }
                    params.push(key);
                    params.push(JSON.stringify(Array.from(data)));
                }
                index++;
                if(index % 2 === 0) {
                    console.log(`saving keys ${params[0]}`);
                    await connection.query(sql.substring(0, sql.length - 2), params);
                    sql = `INSERT INTO ${tableName} ( modelkey,modelvalue) VALUES `;
                    params = [];
                    index = 1;
                }
            }
            if(params.length > 0) {
                await connection.query(sql.substring(0, sql.length - 2), params);
            }

            await this.setMetaAttributes(connection, classifier);
            await connection.query('UNLOCK TABLES');
            console.log('UNLOCKed table');
            await connection.commit();
            connection.release();
            await connection.end();
            console.log('released');
        });

    }

    async getTags() {

        const tagsResponse = await query(c => c.query('SELECT * FROM kissanime_tags ORDER BY tag_id'));

        const tags = [];

        for(let tag of tagsResponse) {
            tags.push(tag);
        }
        return tags;
    }

    async test() {
        return sqlquery('INSERT INTO `test` ( b ) VALUES ( 234 )');
    }

    /**
     *
     * @param {{
     *   tags:Array<string>,
     *   chosen:boolean,
     *   image:Array<number>
     * }} example
     * @param {import('./classifier').CustomClassifier} classifier
     */
    async addExample(example, classifier) {
        await query(async pool => {
            const connection = await pool.getConnection();
            const imageResponse = await connection.query('INSERT INTO kissanime_images (imagedata) VALUES (?)', [JSON.stringify(example.image)]);
            const imageId = imageResponse.insertId;

            for(let tag of example.tags) {
                let tagId = await addTag(connection, tag, classifier);
                const tagImageResponse = await connection.query('INSERT INTO kissanime_images_tag (image,tag,correct) VALUES (?,?,?)', [imageId, tagId, example.chosen]);
            }
        });
    }

    async getTagCount() {

        const tagCouint = await sqlquery(`
        SELECT COUNT(*) AS ct
        FROM kissanime_images_tag
        JOIN kissanime_tags ON kissanime_images_tag.tag = kissanime_tags.tag_id
        WHERE kissanime_images_tag.correct =1
        `);

        return tagCouint[0].ct;
    }

    /**
     * @returns {Promise<{maxId:number,highestId:number,data:Array<{imagedata:string,tags:Array<import('./classifier').Tag>,image_id:number}>}>}
     * @throws {"no more"}
     */
    async getExamples(minImageID = -1) {
        if(minImageID === undefined || minImageID === null) {
            throw new Error('minimageid wrong');
        }
        const highestResult = await selectQuery(`SELECT MAX(kissanime_images.image_id) as highest FROM kissanime_images`);
        const highestId = highestResult[0].highest;
        /**
        * @type {Array<{image_id:number,imagedata:string,tags:Array<string>}>}
        */
        const images = await selectQuery(`SELECT kissanime_images.image_id,kissanime_images.imagedata
        FROM kissanime_images
        WHERE kissanime_images.image_id > ?
        ORDER BY kissanime_images.image_id ASC
        LIMIT 30`, [minImageID]
        );

        let maxId = -1;
        images.forEach(element => {
            if(element.image_id > maxId) {
                maxId = element.image_id;
            }
        });

        if(images.length === 0) {
            throw 'no more';
        }

        const tags = await selectQuery(
            `SELECT kissanime_images_tag.image,kissanime_tags.tag_id,kissanime_tags.tag_name
        FROM kissanime_images_tag
        JOIN kissanime_tags ON kissanime_tags.tag_id=kissanime_images_tag.tag
        WHERE kissanime_images_tag.image IN (${images.map(i => '?')
                .join(',')})
    `, images.map(img => img.image_id));

        const imagesWithTags = images.map(img => ({ imagedata: img.imagedata, image_id: img.image_id, tags: [] }));

        tags.forEach(tag => {
            const imageRef = imagesWithTags.find(image => tag.image === image.image_id);
            imageRef.tags.push(tag);
        });

        return { maxId, data: imagesWithTags.filter(img => img.tags.length), highestId };

    }
    /**
     *
     * @param {*} connection
     * @param {import('./classifier').CustomClassifier|import('./numbersmodel').NumbersClassifier} classifier
     */
    async setMetaAttributes(connection, classifier) {

        const tableName = this.toDBName(classifier);

        let sql = `INSERT INTO ${tableName} ( modelkey,modelvalue) VALUES ( ? , ? ) , ( ? , ? )`;
        const params = [
            'timestamp', new Date().toISOString(),
            'name', classifier.name
        ];
        await connection.query(sql, params);
    }

}

/**
 * @template T
 * @param {(con:import('mariadb').Pool)=>T} callback
 * @returns {Promise<T>}
 */
async function query(callback) {
    try {
        const db = process.env.DB_NAME;
        const port = +process.env.DB_PORT;
        const user = process.env.DB_USER;
        const url = process.env.DB_URL;
        const password = process.env.DB_PASSWORD;
        const pool = mariadb.createPool({ host: url, user, connectionLimit: 5, password, port, database: db });
        const connection = await pool.getConnection();
        console.log(count++);
        const result = await callback(pool);
        await connection.end();
        await pool.end();
        return result;
    } catch(e) {
        console.error(e);
        throw new Error(e);
    }

}

/**
 * @template T
 * @param {String} queryString
 * @param {Array<any>} [params]
 * @param {String} [db]
 * @returns {Promise<any>}
 */
async function sqlquery(queryString, params = [], db = 'knnAnimeTest') {
    return query(connection => connection.query(queryString, params));
}
/**
 * @template T
 * @param {String} queryString
 * @param {Array<any>} [params]
 * @returns {Promise<Array<T>>}
 */
async function selectQuery(queryString, params = []) {
    return query(connection => connection.query(queryString, params));
}

/**
 * @typedef {Array & {
 *      meta:any
 * }} SelectResponse
 *
 */

/**
 *
 * @param {string} tag
 * @param {import('./classifier').CustomClassifier} classifier
 */
async function addTag(connection, tag, classifier) {
    return new Promise(async res => {
        connection.query('INSERT INTO kissanime_tags (tag_name) VALUES (?)', [tag], classifier.name)
            .then(tagResponse => {
                classifier.tags.push({
                    tag_id: tagResponse.insertId,
                    tag_name: tag
                });
                res(tagResponse.insertId);
            })
            .catch(async e => {
                if(e.errno === 1062) {
                    const selectResponse = await connection.query('SELECT tag_id FROM kissanime_tags WHERE tag_name = ?', [tag]);
                    res(selectResponse[0].tag_id);
                } else {
                    throw e;
                }
            });
    });
}

module.exports = new Database();/* {
    ,:
};*/