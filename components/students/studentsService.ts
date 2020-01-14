
const sql = require('mssql');
import IStudent from './studentsBase';
class StudentService implements IStudent {

    async findAll() {
        return await sql.db.query('SELECT * FROM SINH_VIEN');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT * FROM SINH_VIEN WHERE MA_SINH_VIEN = '${id}'`);
    }

    async findBirthById(id: string) {
        return await sql.db.query(`SELECT NGAY_SINH FROM SINH_VIEN WHERE MA_SINH_VIEN = '${id}'`);
    }

    async create(id: string, firstname: string, lastname: string, birth: Date, email: string, phone: string, classId: string, groupId: string) {
        return await sql.db.query(`INSERT INTO SINH_VIEN (MA_SINH_VIEN,HO_SINH_VIEN,TEN_SINH_VIEN,NGAY_SINH,EMAIL,SDT,MaLop,MaNhom) VALUES ('${id}','${firstname}','${lastname}','${birth}','${email}','${phone}','${classId}','${groupId}')`);
    }

    async update(id: string, firstname: string, lastname: string, birth: Date, email: string, phone: string, classId: string, groupId: string) {

        return await sql.db.query(`UPDATE SINH_VIEN SET HO_SINH_VIEN = '${firstname}',TEN_SINH_VIEN = '${lastname}',NGAY_SINH = '${birth}',EMAIL='${email}',SDT = '${phone}',MaLop='${classId}',MaNhom='${groupId}' WHERE MA_SINH_VIEN = '${id}'`);
    }

    async updateEmailById(email: string, id: string) {
        return await sql.db.query(`UPDATE SINH_VIEN SET EMAIL = '${email}'  WHERE MA_SINH_VIEN = '${id}'`);
    }

    async updateRoleById(lead: number, id: string) {
        return await sql.db.query(`UPDATE SINH_VIEN SET LEAD = '${lead}'  WHERE MA_SINH_VIEN = '${id}'`);
    }

    async delete(id: string) {
        return await sql.db.query(`DELETE FROM SINH_VIEN WHERE MA_SINH_VIEN = '${id}' `);
    }


}

export default StudentService;