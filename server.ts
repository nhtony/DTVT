import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware'
import routes from './routes';

const dotenv = require('dotenv');
dotenv.config();

const sql = require('mssql');

const config = {
  user: 'honhathao',
  password: '123456',
  server: 'localhost\\MSSQLSERVERHAO',
  database: 'KLTNDB',
}

sql.connect(config)
  .then((pool: any) => {
    sql.db = pool;
  })
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server is running http://localhost:${PORT}...`)
    );
  })

const router = express();

applyMiddleware(middleware, router);
applyRoutes(routes, router);

const { PORT = 5000 } = process.env;
const server = http.createServer(router);



