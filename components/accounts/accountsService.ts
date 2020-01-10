import AccountDAL from './accountsDAL';
import { connectDB } from '../../database/connect';

class AccountService implements AccountDAL {

    pool: any;

    constructor() {
        let getConnectionPool = async () => {
            this.pool = await connectDB();
            console.log("TCL: AccountService -> getConnectionPool -> this.pool", this.pool);
        };
        getConnectionPool();
    }

    async findAll() {
        return await this.pool.query('SELECT * FROM ACCOUNT');
    }

    async findById(id: string) {
        return await this.pool.query(`SELECT ACCOUNT_ID,STATUS FROM ACCOUNT WHERE ACCOUNT_ID = '${id}'`);
    }

    async findByIdLecture(id: string) {
        return await this.pool.query(`SELECT ACCOUNT_ID,STATUS FROM ACCOUNT WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async findByIdStudent(id: string) {
        return await this.pool.query(`SELECT ACCOUNT_ID,STATUS FROM ACCOUNT WHERE MA_SINH_VIEN = '${id}'`);
    }

    async createWithIdLecture(hashPassword: string, role: string, id: string) {
        return await this.pool.query(`INSERT INTO ACCOUNT (PASSWORD,QUYEN,MA_GIANG_VIEN,ACCOUNT_ID) VALUES ('${hashPassword}','${role}','${id}','${id}')`);
    }

    async createWithIdStudent(hashPassword: string, role: string, id: string) {
        return await this.pool.query(`INSERT INTO ACCOUNT (PASSWORD,QUYEN,MA_SINH_VIEN,ACCOUNT_ID) VALUES ('${hashPassword}','${role}','${id}','${id}')`);
    }

    async updateStatus(id: string) {
        return await this.pool.query(`UPDATE ACCOUNT SET STATUS = '1' WHERE MA_SINH_VIEN = '${id}' OR MA_GIANG_VIEN = '${id}'`);
    }
}

export default new AccountService();