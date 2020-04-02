import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'MON_TIEN_QUYET';

@Service()
class MustSubjectService extends CRUD {
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

    async createMustSubject(obj: any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        console.log(sql);
        return await this.pool.query(sql);
    }

    async updateMustSubject(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async delete(mustSubId: string) {
        return await this.pool.query(`DELETE FROM MON_TIEN_QUYET WHERE MA_MON_TQ = '${mustSubId}'`);
    }

}
export default MustSubjectService;