import StudentDAL from './studentsDAL';
import { connectDB } from '../../database/connect';

class StudentService implements StudentDAL {

    pool: any;

    constructor() {
        let getConnectionPool = async () => {
            this.pool = await connectDB();
            console.log("TCL: StudentService -> getConnectionPool ->  this.pool",  this.pool)
            
        };
        getConnectionPool();
    }

    async findAll() {
        return await this.pool.query('SELECT * FROM SINH_VIEN');
    }

    async findById(id: string) {
        return await this.pool.query(`SELECT * FROM SINH_VIEN WHERE MA_SINH_VIEN = '${id}'`);
    }

    async updateEmailById(email:string,id:string){
     return await this.pool.query(`UPDATE SINH_VIEN SET EMAIL = '${email}'  WHERE MA_SINH_VIEN = '${id}'`);
    }
}

export default new StudentService();