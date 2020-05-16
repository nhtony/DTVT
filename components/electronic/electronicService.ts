import { Service } from "../../DI/ServiceDecorator";
import CRUD from "../../base/CRUD";

const NAME = 'MON_HOC_DIEN_TU';

@Service()
class ElectronicService extends CRUD {
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

    async findOne(id: string) {
        return await this.pool.query(`
        SELECT 
            s.MA_MON_HOC AS id,
            s.TEN_MON_HOC AS name,
            s.SO_TIN_CHI AS number,
            e.HOC_KY AS semester,
            n.MA_NGANH AS major,
            nn.MA_NHOM_NGANH AS industry,
            l.MA_LOAI_MON AS type
        FROM MON_HOC_DIEN_TU e
        JOIN MON_HOC s ON s.MA_MON_HOC = e.MA_MON_HOC
        JOIN NGANH n ON n.MA_NGANH = e.MA_NGANH
        JOIN NHOM_NGANH nn ON nn.MA_NHOM_NGANH = nn.MA_NHOM_NGANH 
        JOIN LOAI_MON l ON l.MA_LOAI_MON = e.MA_LOAI_MON 
        WHERE s.MA_MON_HOC = '${id}'`);
    }

    async createElectro(obj: any) {
        this.createQueryBuilder(NAME);
        this.insert(obj);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async updateElectro(obj: any, where: any) {
        this.createQueryBuilder(NAME);
        this.update(obj);
        this.where(where);
        const sql = this.getQuery();
        return await this.pool.query(sql);
    }

    async delete(id: string) {
        return await this.pool.query(`DELETE FROM MON_HOC_DIEN_TU WHERE MA_MON_HOC = '${id}'`);
    }

    async join(majorId?: any, pageNumber?: Number, rowPerPage?: Number) {
        const conditonQuery = majorId ? `WHERE MA_NGANH = '${majorId}' OR MA_NGANH = '2'` : '';
        const pagination = (pageNumber && rowPerPage) ? `ORDER BY l.TEN_LOAI_MON
        OFFSET (${pageNumber} - 1) * ${rowPerPage} ROWS FETCH NEXT ${rowPerPage} ROWS ONLY` : '';
        return await this.pool.query(`
        SELECT 
            s.MA_MON_HOC AS id,
            s.TEN_MON_HOC AS name,
            s.SO_TIN_CHI AS number,
            e.HOC_KY AS semester,
            cn.TEN_CHUYEN_NGANH AS major,
            l.TEN_LOAI_MON AS type
        FROM MON_HOC_DIEN_TU e
        JOIN MON_HOC s ON s.MA_MON_HOC = e.MA_MON_HOC
        JOIN CHUYEN_NGANH cn ON cn.MA_CHUYEN_NGANH = e.MA_CHUYEN_NGANH
        JOIN LOAI_MON l ON l.MA_LOAI_MON = e.MA_LOAI_MON
        ${conditonQuery}
        ${pagination}
        `);
    }

    async count() {
        return await this.pool.query('SELECT COUNT(*) AS total FROM MON_HOC_DIEN_TU;');
    }
}
export default ElectronicService;