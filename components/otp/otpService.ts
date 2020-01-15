
const sql = require('mssql');
class OTPService {

    async update(code: string, email: string, ms: string) {
        return await sql.db.query(`UPDATE OTP SET CODE='${code}',EMAIL='${email}' WHERE MA_SO='${ms}' IF @@ROWCOUNT=0 INSERT INTO OTP (MA_SO,CODE,EMAIL) VALUES ('${ms}','${code}','${email}')`);
    }

    async find(otp: string, ms: string) {
        return await sql.db.query(`SELECT EMAIL FROM OTP WHERE CODE='${otp}' AND MA_SO=${ms}`);
    }

    async delete(otp: string) {
        return await sql.db.query(`DELETE
        FROM OTP WHERE CODE = '${otp}'`);
    }

}

export default OTPService;