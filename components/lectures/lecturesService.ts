const sql = require('mssql');
import ILecture from './lecturesBase';
class LectureService implements ILecture {

    async findAll() {
        return await sql.db.query('SELECT * FROM GIANG_VIEN');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT * FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}'`);
    }


    async create(id: string, firstname: string, lastname: string, email: string, phone: string, address: string, khoaId: string) {
        return await sql.db.query(`INSERT INTO GIANG_VIEN (MA_GIANG_VIEN,HO_GIANG_VIEN,TEN_GIANG_VIEN,EMAIL,DIEN_THOAI,DIA_CHI,MA_KHOA) VALUES ('${id}','${firstname}','${lastname}','${email}','${phone}','${address}','${khoaId}')`);
    }

    async update(id: string, firstname: string, lastname: string, email: string, phone: string, address: string, khoaId: string) {
        return await sql.db.query(`UPDATE GIANG_VIEN SET HO_GIANG_VIEN = '${firstname}',TEN_GIANG_VIEN = '${lastname}', EMAIL='${email}',DIEN_THOAI = '${phone}',DIA_CHI='${address}',MA_KHOA='${khoaId}' WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async delete(id: string) {
        return await sql.db.query(`DELETE FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}' `);
    }
}
export default  LectureService;