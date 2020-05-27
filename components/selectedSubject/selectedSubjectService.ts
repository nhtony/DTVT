import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'MON_DUOC_CHON';

@Service()
class SelectedSubjectService extends CRUD {

    constructor() {
        super();
        this.createConnectionPool(NAME);
    }

    async findBy(id: string) {
        return await this.pool.query(`SELECT SUBJECT_ID AS subjectId, STUDENT_ID as studentId 
        FROM MON_DUOC_CHON
        WHERE ID = ${id}`);
    }

    async create(obj: any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateSubject(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async delete(subjectId: String, studentId: String) {
        return await this.pool.query(`DELETE FROM MON_DUOC_CHON WHERE SUBJECT_ID = '${subjectId}' AND STUDENT_ID = '${studentId}'`);
    }

    async join(id: String) { 
        return await this.pool.query(`
        SELECT 
            sm.SUBJECT_ID AS subjectId,
            s.TEN_MON_HOC AS name,
            s.SO_TIN_CHI AS number
        FROM MON_DUOC_CHON sm
        JOIN MON_HOC s ON s.MA_MON_HOC = sm.SUBJECT_ID
        WHERE sm.STUDENT_ID ='${id}'
        `);
    }
}

export default SelectedSubjectService;