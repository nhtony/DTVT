import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware'
import routes from './routes';
// import errorHandlers from "./middleware/errorHandlers";
const dotenv = require('dotenv');
const sql = require('mssql');

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

dotenv.config();

const configDB = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: 'localhost\\MSSQLSERVERHAO',
  database: process.env.DB_NAME
}

sql.connect(configDB)
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
// applyMiddleware(errorHandlers, router);

const { PORT = 5000 } = process.env;
const server = http.createServer(router);



