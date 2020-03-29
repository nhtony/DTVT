import ILecture from './lecturesBase';
import { Service } from "../../DI/ServiceDecorator";
import {DAL} from '../../database/DAL';

@Service()
class LectureService  extends DAL implements ILecture {

    constructor(){
        super();
        const POOL_NAME = 'lecture';
        this.createConnectionPool(POOL_NAME);
    }

    async findAll() {
        return await this.pool.query('SELECT * FROM GIANG_VIEN');
    }

    async findById(id: string) {
        return await this.pool.query(`SELECT * FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async findEmailById(id: string) {
        return await this.pool.query(`SELECT EMAIL FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async create(id: string, firstname: string, lastname: string, email: string, phone: string, address: string, khoaId: string) {
        return await this.pool.query(`INSERT INTO GIANG_VIEN (MA_GIANG_VIEN,HO_GIANG_VIEN,TEN_GIANG_VIEN,EMAIL,DIEN_THOAI,DIA_CHI,MA_KHOA)
        OUTPUT INSERTED.MA_GIANG_VIEN AS id,
               INSERTED.HO_GIANG_VIEN AS firstName,
               INSERTED.TEN_GIANG_VIEN AS lastName,
               INSERTED.EMAIL AS email,
               INSERTED.DIEN_THOAI AS phone,
               INSERTED.EMAIL AS address,
               INSERTED.EMAIL AS makhoa
        VALUES ('${id}','${firstname}','${lastname}','${email}','${phone}','${address}','${khoaId}')`);
    }

    async update(id: string, firstname: string, lastname: string, email: string, phone: string, address: string, khoaId: string) {
        return await this.pool.query(`UPDATE GIANG_VIEN SET HO_GIANG_VIEN = '${firstname}',
        TEN_GIANG_VIEN = '${lastname}', 
        EMAIL='${email}',
        DIEN_THOAI = '${phone}',
        DIA_CHI='${address}',
        MA_KHOA='${khoaId}'
        OUTPUT INSERTED.MA_GIANG_VIEN AS id,
               INSERTED.HO_GIANG_VIEN AS firstName,
               INSERTED.TEN_GIANG_VIEN AS lastName,
               INSERTED.EMAIL AS email,
               INSERTED.DIEN_THOAI AS phone,
               INSERTED.DIA_CHI AS address,
               INSERTED.EMAIL AS makhoa 
        WHERE MA_GIANG_VIEN = '${id}'`);
    }

    async delete(id: string) {
        return await this.pool.query(`DELETE FROM GIANG_VIEN
        WHERE MA_GIANG_VIEN = '${id}' `);
    }
}
export default LectureService;