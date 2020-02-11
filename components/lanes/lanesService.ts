import ILanes from './lanesBase';
import { Service } from "../../DI/ServiceDecorator";
const sql = require('mssql');

@Service()
class LanesService implements ILanes {
    async findAll() {
        return await sql.db.query('SELECT LANE_ID AS id,TITLE AS title FROM LANES');
    }

    async findById(id: number) {
        return await sql.db.query(`SELECT * FROM LANES WHERE LANE_ID = '${id}'`);
    }

    async create(title: string) {
        return await sql.db.query(`INSERT LANES (TITLE) OUTPUT INSERTED.LANE_ID AS id, INSERTED.TITLE AS title VALUES ('${title}')`);
    }

    async update(id: number, title: string) {
        return await sql.db.query(`UPDATE LANES SET TITLE = '${title}' OUTPUT INSERTED.LANE_ID AS id, INSERTED.TITLE AS title WHERE LANE_ID = '${id}'`);
    }

    async delete(id: number) {
        return await sql.db.query(`DELETE FROM LANES 
         WHERE LANE_ID = '${id}'`);
    }

    async join() {
        return await sql.db.query(`
        SELECT 
            l.LANE_ID AS laneId,
            c.CARD_ID as id,
            c.TITLE AS title,
            c.LABEL AS label,
            c.DESCRIPTION AS description
        FROM LANES l
        LEFT JOIN CARDS c ON c.LANE_ID = l.LANE_ID
        `);
    }
}
export default LanesService;