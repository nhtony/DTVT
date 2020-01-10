
const sql = require('mssql');
class AccountService  {

    async findAll() {
        return await sql.db.query('SELECT * FROM ACCOUNT');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT ACCOUNT_ID,STATUS FROM ACCOUNT WHERE ACCOUNT_ID = '${id}'`);
    }

    async findByIdLecture(id: string) {
        return await sql.db.query(`SELECT ACCOUNT_ID,STATUS FROM ACCOUNT WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async findByIdStudent(id: string) {
        return await sql.db.query(`SELECT ACCOUNT_ID,STATUS FROM ACCOUNT WHERE MA_SINH_VIEN = '${id}'`);
    }

    async createWithIdLecture(hashPassword: string, role: string, id: string) {
        return await sql.db.query(`INSERT INTO ACCOUNT (PASSWORD,QUYEN,MA_GIANG_VIEN,ACCOUNT_ID) VALUES ('${hashPassword}','${role}','${id}','${id}')`);
    }

    async createWithIdStudent(hashPassword: string, role: string, id: string) {
        return await sql.db.query(`INSERT INTO ACCOUNT (PASSWORD,QUYEN,MA_SINH_VIEN,ACCOUNT_ID) VALUES ('${hashPassword}','${role}','${id}','${id}')`);
    }

    async updateStatus(id: string) {
        return await sql.db.query(`UPDATE ACCOUNT SET STATUS = '1' WHERE MA_SINH_VIEN = '${id}' OR MA_GIANG_VIEN = '${id}'`);
    }
}

export default new AccountService();