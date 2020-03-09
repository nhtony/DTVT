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

    async create(subjectId: string, name: string, number: string, status: number) {
        return await sql.db.query(`INSERT INTO MON_HOC (MA_MON_HOC,TEN_MON_HOC,SO_TIN_CHI,TRANG_THAI) VALUES ('${subjectId}','${name}','${number}','${status})'`);
    }

    async update(subjectId: string, name: string, number: string) {
        return await sql.db.query(`UPDATE MON_HOC SET  TEN_MON_HOC = '${name}',SO_TIN_CHI = '${number}' WHERE MA_MON_HOC = '${subjectId}'`);
    }
    async updateStatus(subjectId: string, status: number) {
        return await sql.db.query(`UPDATE MON_HOC SET TRANG_THAI = '${status}' WHERE MA_MON_HOC = '${subjectId}'`);
    }

    async delete(id: string) {
        return await sql.db.query(`DELETE FROM MON_HOC WHERE MA_MON_HOC = '${id}' `);
    }
}
export default LectureService;