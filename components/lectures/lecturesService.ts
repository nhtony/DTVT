const sql = require('mssql');
class LectureService  {

    async findAll() {
        return await sql.db.query('SELECT * FROM GIANG_VIEN');
    }

    async findById(id:string) {
        return await sql.db.query(`SELECT * FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async findBirthById(id:string) {
        return await sql.db.query(`SELECT NGAY_SINH FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}'`);
    }

}
export default new LectureService();