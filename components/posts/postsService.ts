const sql = require('mssql');
import { Service } from "../../DI/ServiceDecorator";
import IPost from './postsBase';
import {DAL} from '../../database/DAL';

@Service()

class PostService extends DAL implements IPost {

    constructor(){
        super();
        const POOL_NAME = 'post';
        this.createConnectionPool(POOL_NAME);
    }

   async createPost(accountId: string, numImg: number, postContent: string) {
        return await this.pool.query(`
        INSERT INTO POST (ACCOUNT_ID, COUNT_IMAGES, POST_CONTENT) 
            OUTPUT INSERTED.POST_ID AS postId, SYSUTCDATETIME() AS createdAt
            VALUES ('${accountId}', '${numImg}', N'${postContent}')
        `)
    }

    async updatePost(postId: number, postContent: string) {
        return await this.pool.query(`UPDATE POST SET POST_CONTENT = '${postContent}' WHERE POST_ID = '${postId}'`);
    }


    async deletePost(postId: number, haveImgs: boolean, haveInteract: boolean) {
        return await this.pool.query(`
        ${haveImgs ? `DELETE FROM POST_IMAGE OUTPUT DELETED.IMAGE_URL AS imgUrl WHERE POST_ID = '${postId}'` : ''}
        ${haveInteract ? `DELETE FROM POST_LIKE WHERE POST_ID = '${postId}'` : ''}
        DELETE FROM POST WHERE POST_ID = '${postId}'
        `);
    }

    async createMultiImgs(values: Array<string[]>) {
        return await this.pool.query(`INSERT INTO POST_IMAGE (IMAGE_URL, POST_ID) VALUES (${values.join('),(')})`);
    }


    async joinImgs() { // left join có thể có post -> imageUrl: null
        return await this.pool.query(`
         SELECT
            p.POST_ID AS postId,
            i.IMAGE_ID AS imageId,
            i.IMAGE_URL AS imageUrl
        FROM POST p
            OUTER APPLY (
                SELECT TOP 1 i.IMAGE_ID, i.IMAGE_URL
                FROM POST_IMAGE i
                WHERE i.POST_ID = p.POST_ID
            ) i
        `)
    }

    async getImgs(postId: string) {
        return await sql.db.query(`
        WITH img AS (
            SELECT IMAGE_ID, IMAGE_URL, ROW_NUMBER() OVER (ORDER BY IMAGE_ID) numRow
            FROM POST_IMAGE
            WHERE POST_ID = '${postId}'
        )
        SELECT IMAGE_ID AS imageId, IMAGE_URL AS imageUrl
        FROM img
        WHERE numRow > 1
        `)
    }

    async joinLikes() {
        return await this.pool.query(`
        SELECT
            p.POST_ID AS postId,
            l.ACCOUNT_ID AS accountId
        FROM POST p
            LEFT JOIN POST_LIKE l 
                ON l.POST_ID = p.POST_ID
        `)
    }

    async getPosts(startIndex: number, limit: number) {
        return await sql.db.query(`
        SELECT 
            p.POST_ID AS id, 
            p.POST_CONTENT AS postContent,
            p.CREATED_AT AS createdAt,
            p.COUNT_IMAGES AS numImgs,
            g.HO_GIANG_VIEN AS firstName,
            g.TEN_GIANG_VIEN AS lastName
        FROM POST p
            LEFT JOIN GIANG_VIEN g 
                ON g.MA_GIANG_VIEN = p.ACCOUNT_ID
        ORDER BY createdAt DESC
        OFFSET ${startIndex} ROWS
        FETCH NEXT ${limit} ROWS ONLY
        `)
    }
    
    async createInteract(postId: string, accountId: string, fullName: string) {
        return await sql.db.query(`
        INSERT INTO POST_LIKE (POST_ID, ACCOUNT_ID, FULL_NAME)
        VALUES ('${postId}', '${accountId}', N'${fullName}')
        `)
    }

    async deleteInteract(postId: string, accountId: string) {
        return await sql.db.query(`
        DELETE FROM POST_LIKE 
        WHERE POST_ID = '${postId}'
            AND ACCOUNT_ID = '${accountId}'
        `)
    }

    async countInteract() {
        return await sql.db.query(`
        SELECT POST_ID AS postId, COUNT(*) AS numInteract
        FROM POST_LIKE
        GROUP BY POST_ID
        `)
    }

    async getInteracts(postId: string) {
        return await sql.db.query(`SELECT LIKE_ID AS likeId, FULL_NAME AS accountName FROM POST_LIKE WHERE POST_ID = '${postId}' `)
    }
}

export default PostService;