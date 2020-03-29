import IMustSubject from './mustSubjectBase';
import { Service } from "../../DI/ServiceDecorator";
import {DAL} from '../../database/DAL';

@Service()
class MustSubjectService extends DAL implements IMustSubject {

    constructor(){
        super();
        const POOL_NAME = 'mustsubject';
        this.createConnectionPool(POOL_NAME);
    }
    async findAll() {
        return await this.pool.query('SELECT * FROM MON_TIEN_QUYET');
    }

    async findById(mustSubId: string) {
        return await this.pool.query(`SELECT * FROM MON_TIEN_QUYET WHERE MA_MON_TQ = '${mustSubId}'`);
    }

    async findBySubjectId(subId: string) {
        return await this.pool.query(`SELECT MA_MON_TQ as id,TEN_MON_TQ as name FROM MON_TIEN_QUYET WHERE MA_MON_HOC = '${subId}'`);
    }

    async create(mustSubId: string, mustSubName: string, subId: string) {
        return await this.pool.query(`INSERT INTO MON_TIEN_QUYET (MA_MON_TQ,TEN_MON_TQ,MA_MON_HOC)
        OUTPUT INSERTED.MA_MON_TQ AS mustSubId,
               INSERTED.TEN_MON_TQ AS mustSubName,
               INSERTED.MA_MON_HOC AS subId
        VALUES ('${mustSubId}','${mustSubName}','${subId}')`);
    }

    async update(mustSubId: string, mustSubName: string, subId: string) {
        return await this.pool.query(`UPDATE MON_TIEN_QUYET SET TEN_MON_TQ = '${mustSubName}', 
        MA_MON_HOC = '${subId}'
        WHERE MA_MON_TQ = '${mustSubId}'`);
    }

    async delete(mustSubId: string) {
        return await this.pool.query(`DELETE FROM MON_TIEN_QUYET WHERE MA_MON_TQ = '${mustSubId}'`);
    }

}
export default MustSubjectService;