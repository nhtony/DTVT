import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'ACCOUNT';

@Service()
class AccountService extends CRUD {

    constructor() {
        super();
        this.createConnectionPool(NAME);
    }

    async findAll(...select: any) {
        this.createQueryBuilder(NAME);
        this.select(select);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async findBy(where: any, ...select: any) {
        this.createQueryBuilder(NAME);
        this.select(select);
        this.where(where);
        const sql = this.getQuery(); 
        return await this.pool.query(sql);
    }

    async create(obj:any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateAccount(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateStatusById(id: string, status: string) {
        let stt: number = 0;
        if (status === 'enable') stt = 1;
        else if (status === 'disable') stt = 0;
        return await this.pool.query(`UPDATE ACCOUNT SET STATUS = ${stt} WHERE ACCOUNT_ID = '${id}'`);
    };
}

export default AccountService;