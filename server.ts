import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware'
import routes from './routes';


process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

const router = express();
const { PORT = 5000 } = process.env;
const server = http.createServer(router);
server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);
applyMiddleware(middleware, router);
applyRoutes(routes, router);


