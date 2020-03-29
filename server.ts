import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware'
import routes from './routes';
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
  server: 'localhost\\' + process.env.DB_SERVER,
  database: process.env.DB_NAME
}

sql.connect(configDB)
  .then((pool: any) => {
    sql.db = pool;
  })
  .then(() => {
    const router = express();
    const { PORT = 5000 } = process.env;
    const server = http.createServer(router);
    server.listen(PORT, () =>
      console.log(`Server is running http://localhost:${PORT}...`)
    );
    applyMiddleware(middleware, router);
    applyRoutes(routes, router);
    // applyMiddleware(errorHandlers, router);
  }).catch((err: any) => {
    console.log("TCL: err", err)
  })
