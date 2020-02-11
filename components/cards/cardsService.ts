const sql = require('mssql');
import ICards from './cardsBase';
import { Service } from "../../DI/ServiceDecorator";
@Service()
class LectureService implements ICards {
    async findAll() {
        return await sql.db.query('SELECT * FROM CARDS');
    }

    async findById(id: string) {
        return await sql.db.query(`SELECT * FROM CARDS WHERE CARD_ID = '${id}'`);
    }

    async create(cardId: string, title: string, label: string, description: string, laneId: number) {
        return await sql.db.query(`
        INSERT INTO CARDS (CARD_ID,TITLE,LABEL,DESCRIPTION,LANE_ID) 
        VALUES ('${cardId}','${title}','${label}','${description}','${laneId}') `);
    }

    async update(cardId: string, laneId: number) {
        return await sql.db.query(`UPDATE CARDS SET LANE_ID = '${laneId}' WHERE CARD_ID = '${cardId}'`);
    }

    async delete(id: string) {
        return await sql.db.query(`DELETE FROM CARDS WHERE CARD_ID = '${id}'`);
    }
}
export default LectureService;