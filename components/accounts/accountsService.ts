import {Service} from "../../DI/ServiceDecorator";
import IAccount from './accountsBase';
import {DAL} from '../../database/DAL';



@Service()
class AccountService  extends DAL  implements IAccount {

    constructor(){
        super();
        const POOL_NAME = 'account';
        this.createConnectionPool(POOL_NAME);
    }

    async findAll() {
        return await this.pool.query('SELECT * FROM ACCOUNT');
    }

    async findById(id: string) {
        return await this.pool.query(`SELECT ACCOUNT_ID,QUYEN,STATUS,PASSWORD,MA_SINH_VIEN,MA_GIANG_VIEN FROM ACCOUNT WHERE ACCOUNT_ID = '${id}'`);
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

    async updateStatusById(id: string, status: string) {
        let stt:number = 0;
        if(status === 'enable') stt = 1;
        else if(status === 'disable') stt= 0;
        return await this.pool.query(`UPDATE ACCOUNT SET STATUS = '${stt}' WHERE MA_SINH_VIEN = '${id}' OR MA_GIANG_VIEN = '${id}'`);
    };

    async updatePassword(id: string, password: string) {
        return await this.pool.query(`UPDATE ACCOUNT SET PASSWORD = '${password}' WHERE MA_SINH_VIEN = '${id}' OR MA_GIANG_VIEN = '${id}'`);
    }
}

export default AccountService;