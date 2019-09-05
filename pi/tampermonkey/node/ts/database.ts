//const mariadb = require('mariadb');
import { createPool, Pool } from 'mariadb';
import { Classifier, Example } from '../classifier';
let count = 0;

export class DataBase {

    async query<T>(callback: (pool: Pool) => T): Promise<T> {

        const db = 'knnAnimeTest';
        let dHost = 'times_maria_1:3306';
        dHost = 'localhost';
        const pool = createPool({ host: dHost, user: 'tpscript', connectionLimit: 5, password: '123', port: 13306, database: db });
        const connection = await pool.getConnection();
        console.log(count++);
        const result = await callback(pool);
        await connection.end();
        await pool.end();
        return result;
    }

    async  sqlquery<T>(queryString: string, params: Array<any> = [], db = 'knnAnimeTest'): Promise<any> {
        return this.query(connection => connection.query(queryString, params));
    }
    async  selectQuery<T>(queryString: string, params: Array<any> = [], db = 'knnAnimeTest'): Promise<Array<any>> {
        return this.query(connection => connection.query(queryString, params));
    }

    async getExamples(): Promise<any> {
        const response = await this.selectQuery(`SELECT kissanime_tags.*,kissanime_images.imagedata
            FROM kissanime_images_tag
            JOIN kissanime_tags ON kissanime_tags.tag_id=kissanime_images_tag.tag
            JOIN kissanime_images ON kissanime_images_tag.image=kissanime_images.image_id
            WHERE kissanime_images_tag.correct= 1`);
        debugger;
    }

    async getWeights(name: string): Promise<Array<{ modelkey: string, modelvalue: string }>> {
        /**@type {Array} */
        const rows = await this.sqlquery(`SELECT * FROM ${name}`);
        return rows.filter(row => row.modelkey !== 'name' && row.modelkey !== 'timestamp');
    }

    async addExample(example: Example, classifier: Classifier) {

        await this.query(async pool => {
            const connection = await pool.getConnection();
            const imageResponse = await connection.query('INSERT INTO kissanime_images (imagedata) VALUES (?)', [JSON.stringify(example.image)]);
            const imageId = imageResponse.insertId;

            for (let tag of example.tags) {
                let tagId = await this.addTag(connection, tag, classifier);
                const tagImageResponse = await connection.query('INSERT INTO kissanime_images_tag (image,tag,correct) VALUES (?,?,?)', [imageId, tagId, example.chosen]);
            }
        });
    }

    async addTag(connection, tag: string, classifier: Classifier) {
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
                    if (e.errno === 1062) {
                        const selectResponse = await connection.query('SELECT tag_id FROM kissanime_tags WHERE tag_name = ?', [tag]);
                        res(selectResponse[0].tag_id);
                    } else {
                        throw e;
                    }
                });
        });
    }

    async save(classifier: Classifier) {
        this.query(async pool => {
            const connection = await pool.getConnection();
            await connection.query('LOCK TABLE ' + 'knnAnime' + ' WRITE');
            await connection.query('DELETE FROM ' + 'knnAnime');

            let dataset = classifier.knnClassifier.getClassifierDataset();
            let sql = 'INSERT INTO ' + 'knnAnime' + ' ( modelkey,modelvalue) VALUES ( ? , ? ) , ( ? , ? ) , ';
            const params = [
                'timestamp', new Date().toISOString(),
                'name', 'knnAnime'
            ];
            Object.keys(dataset)
                .forEach((key) => {
                    if (key !== 'timestamp' && key !== 'name') {
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
    async  getTags(dbName?: string) {

        const tagsResponse = await this.query(c => c.query('SELECT * FROM kissanime_tags ORDER BY tag_id'));

        const tags = [];

        for (let tag of tagsResponse) {
            tags.push(tag);
        }
        return tags;
    }

    async test() {
        return this.sqlquery('INSERT INTO `test` ( b ) VALUES ( 234 )');

    }
}
