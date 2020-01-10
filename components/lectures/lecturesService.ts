import LectureDAL from './lecturesDAL';
import {connectDB} from '../../database/connect';

class LectureService implements LectureDAL {

    pool:any;

    constructor() {
        let getConnectionPool = async () => {
            this.pool = await connectDB();
            console.log("TCL: LectureService -> getConnectionPool -> this.pool", this.pool)
        };
        getConnectionPool();
    }


    async findAll() {
        return await this.pool.query('SELECT * FROM GIANG_VIEN');
    }

    async findById(id:string) {
        return await this.pool.query(`SELECT * FROM GIANG_VIEN WHERE MA_GIANG_VIEN = '${id}'`);
    }

}
export default new LectureService();