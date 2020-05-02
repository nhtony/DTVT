import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";
const NAME = 'MON_HOC_VIEN_THONG';

@Service()
class TelecomunicationService extends CRUD {

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

    async createTele(obj: any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateTele(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async delete(subjectId: string) {
        return await this.pool.query(`DELETE FROM MON_HOC_VIEN_THONG WHERE MA_MON_HOC = '${subjectId}'`);
    }

    async join(pageNumber: Number = 1, rowPerPage: Number = 12) {
        if(!pageNumber) pageNumber = 1;
        if(!rowPerPage) rowPerPage = 12;
        return await this.pool.query(`
        SELECT 
            s.MA_MON_HOC AS id,
            s.TEN_MON_HOC AS name,
            s.SO_TIN_CHI AS number,
            e.HOC_KY AS semester,
            cn.TEN_CHUYEN_NGANH AS major,
            l.TEN_LOAI_MON AS type
        FROM MON_HOC_VIEN_THONG e
        JOIN MON_HOC s ON s.MA_MON_HOC = e.MA_MON_HOC
        JOIN CHUYEN_NGANH cn ON cn.MA_CHUYEN_NGANH = e.MA_CHUYEN_NGANH
        JOIN LOAI_MON l ON l.MA_LOAI_MON = e.MA_LOAI_MON
        WHERE MA_NGANH = '1' OR MA_NGANH = '2'
        ORDER BY l.TEN_LOAI_MON
        OFFSET (${pageNumber} - 1) * ${rowPerPage} ROWS
        FETCH NEXT ${rowPerPage} ROWS ONLY;
        `);
    }

    async count(){
        return await this.pool.query('SELECT COUNT(*) AS total FROM MON_HOC_VIEN_THONG');
    }
}
export default TelecomunicationService;