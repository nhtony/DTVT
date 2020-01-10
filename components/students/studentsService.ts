
const sql = require('mssql');

class StudentService {

    async findAll() {
        return await sql.db.query('SELECT * FROM SINH_VIEN');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT * FROM SINH_VIEN WHERE MA_SINH_VIEN = '${id}'`);
    }

    async findBirthById(id: string) {
        return await sql.db.query(`SELECT * FROM SINH_VIEN WHERE MA_SINH_VIEN = '${id}'`);
    }

    async updateEmailById(email: string, id: string) {
        return await sql.db.query(`UPDATE SINH_VIEN SET EMAIL = '${email}'  WHERE MA_SINH_VIEN = '${id}'`);
    }
}

export default new StudentService();