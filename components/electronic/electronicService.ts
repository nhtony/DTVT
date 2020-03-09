import IElectronic from './electronicBase';
import { Service } from "../../DI/ServiceDecorator";
const sql = require('mssql');

@Service()
class ElectronicService implements IElectronic {

    async findAll() {
        return await sql.db.query('SELECT MA_MON_HOC AS subjectId,TEN_MON_HOC AS name,SO_TIN_CHI AS number,HOC_KY AS semester FROM MON_HOC_DIEN_TU');
    }

    async findById(subjectId: string) {
        return await sql.db.query(`SELECT * FROM MON_HOC_DIEN_TU WHERE LANE_ID = '${subjectId}'`);
    }


    async create(subjectId: string, groupMajorId: string, majorId: string, specMajorId: string) {
        return await sql.db.query(`INSERT INTO MON_HOC_DIEN_TU (MA_MON_HOC,MA_NHOM_NGANH,MA_NGANH,MA_CHUYEN_NGANH)
        OUTPUT INSERTED.MA_MON_HOC AS subjectId,
               INSERTED.MA_NHOM_NGANH AS groupMajorId,
               INSERTED.MA_NGANH AS majorId,
               INSERTED.MA_CHUYEN_NGANH AS specMajorId
        VALUES ('${subjectId}','${groupMajorId}','${majorId}','${specMajorId}')`);
    }

    async update(subjectId: string, groupMajorId: string, majorId: string, specMajorId: string) {
        return await sql.db.query(`UPDATE MON_HOC_DIEN_TU SET MA_NHOM_NGANH = '${groupMajorId}', 
            MA_NGANH='${majorId}', 
            MA_CHUYEN_NGANH='${specMajorId}' 
        WHERE MA_MON_HOC = '${subjectId}'`);
    }

    async updateSubjectType(id: string, subjectType: string) {
        return await sql.db.query(`UPDATE MON_HOC_DIEN_TU SET LOAI_MON='${subjectType}' 
        OUTPUT INSERTED.MA_MON_HOC AS subjectId,
               INSERTED.LOAI_MON AS subjectType
        WHERE MA_MON_HOC = '${id}'`);
    }

    async updateSemester(id: string, semester: string) {
        return await sql.db.query(`UPDATE MON_HOC_DIEN_TU SET HOC_KY='${semester}' 
        OUTPUT INSERTED.MA_MON_HOC AS subjectId,
               INSERTED.HOC_KY AS semester
        WHERE MA_MON_HOC = '${id}'`);
    }

    async delete(subjectId: string) {
        return await sql.db.query(`DELETE FROM MON_HOC_DIEN_TU WHERE MA_MON_HOC = '${subjectId}'`);
    }

    async join(majorId?: string) {
        const conditonQuery = majorId ? `WHERE MA_NGANH = '${majorId}' OR MA_NGANH = '2'` : '';
        return await sql.db.query(`
        SELECT 
            s.MA_MON_HOC AS subjectId,
            s.TEN_MON_HOC AS name,
            s.SO_TIN_CHI AS number,
            e.HOC_KY AS semester,
            cn.TEN_CHUYEN_NGANH AS major,
            l.TEN_LOAI_MON AS subjectType
        FROM MON_HOC_DIEN_TU e
        JOIN MON_HOC s ON s.MA_MON_HOC = e.MA_MON_HOC
        JOIN CHUYEN_NGANH cn ON cn.MA_CHUYEN_NGANH = e.MA_CHUYEN_NGANH
        JOIN LOAI_MON l ON l.MA_LOAI_MON = e.MA_LOAI_MON
        ${conditonQuery}
        `);
    }
}
export default ElectronicService;