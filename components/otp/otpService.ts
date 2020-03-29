import { Service } from "../../DI/ServiceDecorator";
import {DAL} from '../../database/DAL';

@Service()
class OTPService extends DAL {

    constructor(){
        super();
        const POOL_NAME = 'otp';
        this.createConnectionPool(POOL_NAME);
    }

    async update(code: string, email: string, ms: string) {
        return await this.pool.query(`UPDATE OTP SET CODE='${code}',EMAIL='${email}' WHERE MA_SO='${ms}' IF @@ROWCOUNT=0 INSERT INTO OTP (MA_SO,CODE,EMAIL) VALUES ('${ms}','${code}','${email}')`);
    }

    async find(otp: string, ms: string) {
        return await this.pool.query(`SELECT EMAIL FROM OTP WHERE CODE='${otp}' AND MA_SO=${ms}`);
    }

    async delete(otp: string) {
        return await this.pool.query(`DELETE
        FROM OTP WHERE CODE = '${otp}'`);
    }

}

export default OTPService;