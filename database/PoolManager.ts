const { ConnectionPool } = require('mssql');

const dotenv = require('dotenv');
dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'localhost',
    database: process.env.DB_NAME
}

export const POOLS: { [index: string]: any } = {};

export class PoolManager {
    
    static createPool(name: string) {
        POOLS[name] = (new ConnectionPool(config));
        return POOLS[name].connect();
    }
    static closePool(name: any) {
        if (Object.prototype.hasOwnProperty.call(POOLS, name)) {
            const pool = POOLS[name];
            delete POOLS[name];
            return pool.close()
        } 
    }
}







