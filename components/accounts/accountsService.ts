
const sql = require('mssql');
import IAccount from './accountsBase';
class AccountService implements IAccount {

    async findAll() {
        return await sql.db.query('SELECT * FROM ACCOUNT');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT ACCOUNT_ID,QUYEN,STATUS,PASSWORD FROM ACCOUNT WHERE ACCOUNT_ID = '${id}'`);
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

    async updateStatusById(id: string, status: string) {
        let stt:number = 0;
        if(status === 'enable') stt = 1;
        else if(status === 'disable') stt= 0;
        return await sql.db.query(`UPDATE ACCOUNT SET STATUS = '${stt}' WHERE MA_SINH_VIEN = '${id}' OR MA_GIANG_VIEN = '${id}'`);
    };

    async updatePassword(id: string, password: string) {
        return await sql.db.query(`UPDATE ACCOUNT SET PASSWORD = '${password}' WHERE MA_SINH_VIEN = '${id}' OR MA_GIANG_VIEN = '${id}'`);
    }
}

export default AccountService;