const sql = require('mssql');
import { Service } from "../../DI/ServiceDecorator";
import IPost from './postsBase';
@Service()
class PostService implements IPost {
    async createPost(accountId: string, postContent: string) {
        return await sql.db.query(`
        INSERT INTO POST (ACCOUNT_ID, POST_CONTENT) 
        OUTPUT INSERTED.POST_ID AS postId,
               INSERTED.ACCOUNT_ID AS accountId
        VALUES ('${accountId}', N'${postContent}')`);
    }

    async updatePost(postId: number, postContent: string) {
        return await sql.db.query(`UPDATE POST SET POST_CONTENT = '${postContent}' WHERE POST_ID = '${postId}'`);
    }

    async deletePost(postId: number) {
        return await sql.db.query(`DELETE FROM POST WHERE POST_ID = '${postId}'`);
    }

    async createMultiImgs(values: Array<string[]>) {
        return await sql.db.query(`INSERT INTO POST_IMAGE (IMAGE_URL, POST_ID) VALUES (${values.join('),(')})`);
    }

    async joinImgs() { // left join có thể có post -> imageUrl: null
        return await sql.db.query(`
        SELECT
            p.POST_ID AS postId,
            i.IMAGE_ID AS imageId,
            i.IMAGE_URL AS imageUrl
        FROM POST p
        LEFT JOIN POST_IMAGE i ON i.POST_ID = p.POST_ID
        `)
    }

    async joinLikes() {
        return await sql.db.query(`
        SELECT
            p.POST_ID AS postId,
            l.LIKE_ID AS likeId,
            l.ACCOUNT_ID AS accountId,
            l.FULL_NAME AS accountName
        FROM POST p
        LEFT JOIN POST_LIKE l ON l.POST_ID = p.POST_ID
        `)
    }

    async joinLecture() {
        return await sql.db.query(`
        SELECT 
            p.POST_ID AS id, 
            p.POST_CONTENT AS postContent,
            p.CREATED_AT AS createdAt,
            g.HO_GIANG_VIEN AS firstName,
            g.TEN_GIANG_VIEN AS lastName
        FROM POST p
        LEFT JOIN GIANG_VIEN g ON g.MA_GIANG_VIEN = p.ACCOUNT_ID
        `)
    }

    async createInteract(table: string, postId: string, accountId: string, fullName: string) {
        return await sql.db.query(`
        INSERT INTO ${table} (POST_ID, ACCOUNT_ID, FULL_NAME)
        VALUES ('${postId}', '${accountId}', N'${fullName}')
        `)
    }

    async deleteInteract(table: string, postId: string, accountId: string) {
        return await sql.db.query(`
        DELETE FROM ${table} 
        WHERE POST_ID = '${postId}'
        AND ACCOUNT_ID = '${accountId}'
        `)
    }
}

export default PostService;