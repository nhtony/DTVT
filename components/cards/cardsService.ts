const sql = require('mssql');
import ICards from './cardsBase';
import { Service } from "../../DI/ServiceDecorator";
@Service()
class LectureService implements ICards {
    async findAll() {
        return await sql.db.query('SELECT * FROM CARDS');
    }

    async findById(id: number) {
        return await sql.db.query(`SELECT * FROM CARDS WHERE ID = '${id}'`);
    }

    async create(title: string, label: string, description: string, laneId: number) {
        return await sql.db.query(`INSERT INTO CARDS (TITLE,LABEL,DESCRIPTION,LANE_ID) VALUES ('${title}','${label}','${description}','${laneId}') `);
    }

    async update(id: number, title: string, label: string, description: string) {
        return await sql.db.query(`UPDATE CARDS SET TITLE = '${title}',LABEL = '${label}', DESCRIPTION='${description}' WHERE ID = '${id}'`);
    }

    async delete(id: number) {
        return await sql.db.query(`DELETE FROM CARDS WHERE ID = '${id}'`);
    }
}
export default LectureService;