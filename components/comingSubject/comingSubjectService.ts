import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'MON_HOC_SAP_MO';

@Service()
class ComingSubjectService extends CRUD {

    constructor() {
        super();
        this.createConnectionPool(NAME);
    }

    async findBy(id: string) {
        return await this.pool.query(`SELECT SEMESTER AS semester, SCHOOL_YEAR as schoolYear 
        FROM MON_HOC_SAP_MO
        WHERE SUBJECT_ID = ${id}`);
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

    async delete(id: Number) { 
        return await this.pool.query(`DELETE FROM MON_HOC_SAP_MO WHERE WILL_OPEN_ID = '${id}'`);
    }

    async join(majorId?: any, pageNumber?: Number, rowPerPage?: Number) {
        const pagination = (pageNumber && rowPerPage) ? `ORDER BY sm.SUBJECT_ID
        OFFSET (${pageNumber} - 1) * ${rowPerPage} ROWS FETCH NEXT ${rowPerPage} ROWS ONLY` : '';
        return await this.pool.query(`
        SELECT 
            sm.WILL_OPEN_ID AS openID,
            sm.SUBJECT_ID AS id,
            s.TEN_MON_HOC AS name,
            sm.SEMESTER AS semester,
            sm.SCHOOL_YEAR AS yearSchool
        FROM MON_HOC_SAP_MO sm
        JOIN MON_HOC s ON s.MA_MON_HOC = sm.SUBJECT_ID
        ${pagination}
        `);
    }

    async count() {
        return await this.pool.query('SELECT COUNT(*) AS total FROM MON_HOC_SAP_MO;');
    }

}

export default ComingSubjectService;