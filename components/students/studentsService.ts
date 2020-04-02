import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'SINH_VIEN';

@Service()
class StudentService extends CRUD{
    constructor(){
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

    async createStudent(obj: any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateStudent(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }
    
    async delete(id: string) {
        return await this.pool.query(`DELETE FROM SINH_VIEN
        WHERE MA_SINH_VIEN = '${id}' `);
    }
}

export default StudentService;