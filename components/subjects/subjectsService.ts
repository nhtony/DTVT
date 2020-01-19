const sql = require('mssql');
import ISubject from './subjectsBase';
import { Service } from "../../DI/ServiceDecorator";

@Service()
class LectureService implements ISubject {

    async findAll() {
        return await sql.db.query('SELECT * FROM MON_HOC');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT * FROM MON_HOC WHERE MA_MON_HOC = '${id}'`);
    }

    async create(subjectId: string, name: string, number: string, required: number, majorId: string) {
        return await sql.db.query(`INSERT INTO MON_HOC (MA_MON_HOC,TEN_MON_HOC,SO_TIN_CHI,TIEN_QUYET,MA_NGANH) VALUES ('${subjectId}','${name}','${number}','${required}','${majorId}')`);
    }

    async update(subjectId: string, name: string, number: string, required: number, majorId: string) {
        return await sql.db.query(`UPDATE MON_HOC SET  TEN_MON_HOC = '${name}',SO_TIN_CHI = '${number}',TIEN_QUYET = '${required}', MA_NGANH='${majorId}' WHERE MA_MON_HOC = '${subjectId}'`);
    }

    async delete(id: string) {
        return await sql.db.query(`DELETE FROM MON_HOC WHERE MA_MON_HOC = '${id}' `);
    }
}
export default LectureService;