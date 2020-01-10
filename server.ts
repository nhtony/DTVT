import http from "http";
import express from "express";
import {applyMiddleware,applyRoutes} from './utils';
import middleware from './middleware'
import routes from './routes';

const router = express();
applyMiddleware(middleware,router);
applyRoutes(routes, router);

const {PORT = 5000} = process.env;
const server =  http.createServer(router);

server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);

