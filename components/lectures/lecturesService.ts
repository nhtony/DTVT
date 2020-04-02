import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'GIANG_VIEN';

@Service()
class LectureService extends CRUD {

    constructor(){
        super();
        this.createConnectionPool(NAME);
    }

    async findAll(...select: any) {
        this.createQueryBuilder(NAME);
        this.select(select);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async findBy(where: any, ...select: any) {
        this.createQueryBuilder(NAME);
        this.select(select);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async createLecture(obj: any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateLecture(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async delete(id: string) {
        return await this.pool.query(`DELETE FROM GIANG_VIEN
        WHERE MA_GIANG_VIEN = '${id}' `);
    }
}
export default LectureService;