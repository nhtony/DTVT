import IMustSubject from './mustSubjectBase';
import { Service } from "../../DI/ServiceDecorator";
const sql = require('mssql');

@Service()
class MustSubjectService implements IMustSubject {

    async findAll() {
        return await sql.db.query('SELECT * FROM MON_TIEN_QUYET');
    }

    async findById(mustSubId: string) {
        return await sql.db.query(`SELECT * FROM MON_TIEN_QUYET WHERE MA_MON_TQ = '${mustSubId}'`);
    }

    async create(mustSubId: string, mustSubName: string, subId: string) {
        return await sql.db.query(`INSERT INTO MON_TIEN_QUYET (MA_MON_TQ,TEN_MON_TQ,MA_MON_HOC)
        OUTPUT INSERTED.MA_MON_TQ AS mustSubId,
               INSERTED.TEN_MON_TQ AS mustSubName,
               INSERTED.MA_MON_HOC AS subId
        VALUES ('${mustSubId}','${mustSubName}','${subId}')`);
    }

    async update(mustSubId: string, mustSubName: string, subId: string) {
        return await sql.db.query(`UPDATE MON_TIEN_QUYET SET TEN_MON_TQ = '${mustSubName}', 
        MA_MON_HOC = '${subId}'
        WHERE MA_MON_TQ = '${mustSubId}'`);
    }

    async delete(subjectId: string) {
        return await sql.db.query(`DELETE FROM MON_TIEN_QUYET WHERE MA_MON_HOC = '${subjectId}'`);
    }

}
export default MustSubjectService;