const sql = require('mssql');

const config = {
    user: 'honhathao',
    password: '123456',
    server: 'localhost\\MSSQLSERVERHAO',
    database: 'KLTNDB',
}

export const connectDB = async () => {
    return await sql.connect(config);
}

