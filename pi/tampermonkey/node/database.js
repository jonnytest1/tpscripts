const mariadb = require('mariadb');

/**
 * @template T
 * @param {(con:import('mariadb').PoolConnection)=>T} callback
 * @returns {Promise<T>}
 */
async function query(callback) {

    const db = 'knnAnimeTest';
    let dHost = 'times_maria_1:3306';
    dHost = 'localhost';
    const pool = mariadb.createPool({ host: dHost, user: 'tpscript', connectionLimit: 5, password: '123', port: 13306, database: db });
    const connection = await pool.getConnection();
    const result = await callback(connection);
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
    let dHost = 'times_maria_1:3306';
    dHost = 'localhost';
    const pool = mariadb.createPool({ host: dHost, user: 'tpscript', connectionLimit: 5, password: '123', port: 13306, database: db });
    const connection = await pool.getConnection();
    const result = await connection.query(queryString, params);
    await connection.end();
    await pool.end();
    return result;
}
/**
 * @typedef {Array & {
 *      meta:any
 * }} SelectResponse
 *
 */

/**
 *
 * @param {string} sql
 * @param {Array<any>} [params]
 * @returns {Promise<SelectResponse>}
 */
async function select(sql, params = []) {
    return query(c => c.query('SELECT ' + sql, params));
}

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
 *
 * @param {{
 *   tags:Array<string>,
 *   chosen:boolean,
 *   image:Array<number>
 * }} example
 * @param {import('./classifier').CustomClassifier} classifier
 */
async function addExample(example, classifier) {
    const imageResponse = await sqlquery('INSERT INTO kissanime_images (imagedata) VALUES (?)', [JSON.stringify(example.image)], classifier.name);
    const imageId = imageResponse.insertId;

    for(let tag of example.tags) {
        let tagId = await addTag(tag, classifier);
        const tagImageResponse = await sqlquery('INSERT INTO kissanime_images_tag (image,tag,correct) VALUES (?,?,?)', [imageId, tagId, example.chosen], classifier.name);
    }

}
/**
 *
 * @param {string} tag
 * @param {import('./classifier').CustomClassifier} classifier
 */
async function addTag(tag, classifier) {
    return new Promise(async res => {
        sqlquery('INSERT INTO kissanime_tags (tag_name) VALUES (?)', [tag], classifier.name)
            .then(tagResponse => {
                classifier.tags.push({
                    tag_id: tagResponse.insertId,
                    tag_name: tag
                });
                res(tagResponse.insertId);
            })
            .catch(async e => {
                if(e.errno === 1062) {
                    const selectResponse = await sqlquery('SELECT tag_id FROM kissanime_tags WHERE tag_name = ?', [tag], classifier.name);
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

    await sqlquery('LOCK TABLE ' + 'knnAnime' + ' WRITE');
    await sqlquery('DELETE FROM ' + 'knnAnime');

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
    await sqlquery(sql.substring(0, sql.length - 2), params);
    await sqlquery('UNLOCK TABLES');
}

async function getTags(dbName) {

    const tagsResponse = await query(c => c.query('SELECT * FROM kissanime_tags ORDER BY tag_id'));

    const tags = [];

    for(let tag of tagsResponse) {
        tags.push(tag);
    }
    return tags;
}

module.exports = {
    getWeights, addExample, getTags, save
};