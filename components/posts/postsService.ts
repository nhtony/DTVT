import { Service } from "../../DI/ServiceDecorator";
import IPost from './postsBase';
import CRUD from "../../base/CRUD";

const NAME = 'POST';

@Service()
class PostService extends CRUD implements IPost {

    constructor(){
        super();
        this.createConnectionPool(NAME);
    }

   async createPost(accountId: string, numImg: number, postContent: string, postType: number) {
        return await this.pool.query(`
        INSERT INTO POST (ACCOUNT_ID, COUNT_IMAGES, POST_CONTENT, TYPE_ID) 
            OUTPUT INSERTED.POST_ID AS postId, 
                   SYSUTCDATETIME() AS createdAt,
                   INSERTED.COUNT_IMAGES AS numImgs
            VALUES ('${accountId}', '${numImg}', N'${postContent}', ${postType})
        `)
    }

    async updatePost(postId: number, postContent: string) {
        return await this.pool.query(`UPDATE POST SET POST_CONTENT = '${postContent}' WHERE POST_ID = '${postId}'`);
    }

    async deletePost(postId: number, haveImgs: boolean, haveInteract: boolean, table: string) {
        return await this.pool.query(`
        ${haveImgs ? `DELETE FROM POST_IMAGE OUTPUT DELETED.IMAGE_URL AS imgUrl WHERE POST_ID = '${postId}'` : ''}
        ${haveInteract ? `DELETE FROM POST_LIKE WHERE POST_ID = '${postId}'` : ''}
        ${table ? `DELETE FROM POST_${table}_JUNCTION WHERE POST_ID = '${postId}'` : ''}
        DELETE FROM POST WHERE POST_ID = '${postId}'
        `);
    }

    async saveFiles(values: Array<string[]>) {
        return await this.pool.query(`INSERT INTO POST_IMAGE (IMAGE_URL, POST_ID) VALUES (${values.join('),(')})`);
    }

    async createDestination(values: Array<string[]>, table: string) {
        return await this.pool.query(`INSERT INTO POST_${table}_JUNCTION (POST_ID, ${table}_ID) VALUES (${values.join('),(')})`)
    }

    async firstImgs() {
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
        return await this.pool.query(`
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

    async getPosts(queryDiff: string[], startIndex: number, limit: number) {
        return await this.pool.query(`
        SELECT 
            p.POST_ID AS id, 
            p.POST_CONTENT AS postContent,
            p.CREATED_AT AS createdAt,
            p.COUNT_IMAGES AS numImgs,
            p.TYPE_ID AS postType,
            ac.HO_GIANG_VIEN AS firstName, 
            ac.TEN_GIANG_VIEN AS lastName
        ${queryDiff[0]}
        AND p.ACCOUNT_ID = ac.MA_GIANG_VIEN
        UNION SELECT 
            p.POST_ID AS id, 
            p.POST_CONTENT AS postContent,
            p.CREATED_AT AS createdAt,
            p.COUNT_IMAGES AS numImgs,
            p.TYPE_ID AS postType,
            ac.HO_SINH_VIEN AS firstName, 
            ac.TEN_SINH_VIEN AS lastName
        ${queryDiff[1]}
        AND p.ACCOUNT_ID = ac.MA_SINH_VIEN
        ORDER BY createdAt DESC
        OFFSET ${startIndex} ROWS
        FETCH NEXT ${limit} ROWS ONLY
        `)
    }

    async checkWhoById(postId: string) {
        return await this.pool.query(`
        SELECT
            ac.QUYEN AS role
        FROM POST p
            INNER JOIN ACCOUNT ac 
                ON ac.ACCOUNT_ID = p.ACCOUNT_ID 
        WHERE p.POST_ID = '${postId}'
        `)
    }
    
    async firstImgOnePost(postId: string) {
        return await this.pool.query(`
        SELECT TOP 1 
            IMAGE_ID AS id, 
            IMAGE_URL AS imageUrl
        FROM POST_IMAGE
        WHERE POST_ID = '${postId}'
        `)
    }

    async getPostDetail(postId: string, who: string) {
        return await this.pool.query(`
        SELECT
            p.POST_ID AS id, 
            p.POST_CONTENT AS postContent,
            p.CREATED_AT AS createdAt,
            p.COUNT_IMAGES AS numImgs,
            p.TYPE_ID AS postType,
            ac.HO_${who} AS firstName, 
            ac.TEN_${who} AS lastName,
            COUNT(pl.LIKE_ID) AS numInteract
        FROM POST p
            INNER JOIN ${who} ac
                ON ac.MA_${who} = p.ACCOUNT_ID
            LEFT JOIN POST_LIKE pl
                ON pl.POST_ID = p.POST_ID
        WHERE p.POST_ID = '${postId}'
        GROUP BY
            p.POST_ID, 
            p.POST_CONTENT,
            p.CREATED_AT,
            p.COUNT_IMAGES,
            p.TYPE_ID,
            ac.HO_${who},
            ac.TEN_${who}
        `)
    }

    async checkIsLiked(postId: string, accountId: string) {
        return await this.pool.query(`
        SELECT *
        FROM POST_LIKE
        WHERE ACCOUNT_ID = '${accountId}' AND POST_ID = '${postId}'
        `)
    }
    
    async createInteract(postId: string, accountId: string) {
        return await this.pool.query(`
        INSERT INTO POST_LIKE (POST_ID, ACCOUNT_ID)
        VALUES ('${postId}', '${accountId}')
        `)
    }

    async getInteractById(postId: string, accountId: string) {
        return await this.pool.query(`SELECT * FROM POST_LIKE WHERE POST_ID = '${postId}' AND ACCOUNT_ID = '${accountId}'`)
    }

    async deleteInteract(postId: string, accountId: string) {
        return await this.pool.query(`
        DELETE FROM POST_LIKE 
        WHERE POST_ID = '${postId}'
            AND ACCOUNT_ID = '${accountId}'
        `)
    }

    async countInteract() {
        return await this.pool.query(`
        SELECT POST_ID AS postId, COUNT(*) AS numInteract
        FROM POST_LIKE
        GROUP BY POST_ID
        `)
    }
}

export default PostService;