const mariadb = require('mariadb');
let count = 0;
/**
 * @template T
 * @param {(con:import('mariadb').Pool)=>T} callback
 * @returns {Promise<T>}
 */
async function query(callback) {

    const db = 'knnAnimeTest';
    let dHost = 'times_maria_1:3306';
    dHost = 'localhost';
    const pool = mariadb.createPool({ host: dHost, user: 'tpscript', connectionLimit: 5, password: '123', port: 13306, database: db });
    const connection = await pool.getConnection();
    console.log(count++);
    const result = await callback(pool);
    await connection.end();
    await pool.end();
    return result;
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
 * @param {String} [db]
 * @returns {Promise<Array<T>>}
 */
async function selectQuery(queryString, params = [], db = 'knnAnimeTest') {
    return query(connection => connection.query(queryString, params));
}

/**
 * @typedef {Array & {
 *      meta:any
 * }} SelectResponse
 *
 */

/**
 * @param {string} name
 * @returns {Promise<Array<{modelkey:string,modelvalue:string}>>}
 */
async function getWeights(name) {
    /**@type {Array} */
    const rows = await sqlquery(`SELECT * FROM ${name}`);
    return rows.filter(row => row.modelkey !== 'name' && row.modelkey !== 'timestamp');
}

/**
 * @returns {Promise<Array<{imagedata:Array<number>,tag_id:number,tag_name:string}>>}
 */
async function getExamples() {
    return selectQuery(`
    SELECT kissanime_tags.tag_id,kissanime_tags.tag_name ,kissanime_images.imagedata
    FROM kissanime_images_tag
    JOIN kissanime_tags ON kissanime_tags.tag_id=kissanime_images_tag.tag
    JOIN kissanime_images ON kissanime_images_tag.image=kissanime_images.image_id
    WHERE kissanime_images_tag.correct= 1`);
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
async function addExample(example, classifier) {

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
/**
 *
* @param {import('./classifier').CustomClassifier} classifier
 */
async function save(classifier) {
    query(async pool => {
        const connection = await pool.getConnection();
        await connection.query('LOCK TABLE ' + 'knnAnime' + ' WRITE');
        await connection.query('DELETE FROM ' + 'knnAnime');

        let dataset = classifier.getClassifierDataset();
        let sql = 'INSERT INTO ' + 'knnAnime' + ' ( modelkey,modelvalue) VALUES ( ? , ? ) , ( ? , ? ) , ';
        const params = [
            'timestamp', new Date().toISOString(),
            'name', 'knnAnime'
        ];
        Object.keys(dataset)
            .forEach((key) => {
                if(key !== 'timestamp' && key !== 'name') {
                    sql += ' ( ? , ? ) ,';
                    let data = dataset[key].dataSync();
                    params.push(key);
                    params.push(JSON.stringify(Array.from(data)));
                }
            });
        await connection.query(sql.substring(0, sql.length - 2), params);
        await connection.query('UNLOCK TABLES');

        await connection.commit();
        connection.release();
        connection.end();
    });

}

async function getTags(dbName) {

    const tagsResponse = await query(c => c.query('SELECT * FROM kissanime_tags ORDER BY tag_id'));

    const tags = [];

    for(let tag of tagsResponse) {
        tags.push(tag);
    }
    return tags;
}

async function test() {
    return sqlquery('INSERT INTO `test` ( b ) VALUES ( 234 )');

}
module.exports = {
    getWeights, addExample, getTags, save, test, getExamples
};