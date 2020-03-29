import ISubject from './subjectsBase';
import { Service } from "../../DI/ServiceDecorator";
import {DAL} from '../../database/DAL';

@Service()
class SubjectService extends DAL  implements ISubject {

    constructor(){
        super();
        const POOL_NAME = 'subject';
        this.createConnectionPool(POOL_NAME);
    }

    async findAll() {
        return await this.pool.query('SELECT * FROM MON_HOC');
    }

    async findById(id: string) {
        return await this.pool.query(`SELECT * FROM MON_HOC WHERE MA_MON_HOC = '${id}'`);
    }

    async create(subjectId: string, name: string, number: string, status: number) {
        return await this.pool.query(`INSERT INTO MON_HOC (MA_MON_HOC,TEN_MON_HOC,SO_TIN_CHI,TRANG_THAI) VALUES ('${subjectId}','${name}','${number}','${status})'`);
    }

    async update(subjectId: string, name: string, number: string) {
        return await this.pool.query(`UPDATE MON_HOC SET  TEN_MON_HOC = '${name}',SO_TIN_CHI = '${number}' WHERE MA_MON_HOC = '${subjectId}'`);
    }
    async updateStatus(subjectId: string, status: number) {
        return await this.pool.query(`UPDATE MON_HOC SET TRANG_THAI = '${status}' WHERE MA_MON_HOC = '${subjectId}'`);
    }

    async delete(id: string) {
        return await this.pool.query(`DELETE FROM MON_HOC WHERE MA_MON_HOC = '${id}' `);
    }
}
export default SubjectService;