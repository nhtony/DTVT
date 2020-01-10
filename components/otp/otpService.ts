import OTPDAL from './otpDAL';
import { connectDB } from '../../database/connect';

class OTPService implements OTPDAL {

    pool: any;

    constructor() {
        let getConnectionPool = async () => {
            this.pool = await connectDB();
            console.log("TCL: AccountService -> getConnectionPool -> this.pool", this.pool);
        };
        getConnectionPool();
    }

    async update(code: string, email: string, ms: string) {
        return await this.pool.query(`UPDATE OTP SET CODE='${code}',EMAIL='${email}' WHERE MA_SO='${ms}' IF @@ROWCOUNT=0 INSERT INTO OTP (MA_SO,CODE,EMAIL) VALUES ('${ms}','${code}','${email}')`);
    }

    async find(otp: string, ms: string) {
        return await this.pool.query(`SELECT EMAIL FROM OTP WHERE CODE='${otp}' AND MA_SO=${ms}`);
    }

    async delete(otp:string){
        return await this.pool.query(`DELETE
        FROM OTP WHERE CODE = '${otp}'`);
    }

}

export default new OTPService();