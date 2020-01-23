import { Request, Response, NextFunction, Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";

export const handleBodyRequestParsing = (router: Router) => {
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
}

export const handleAccesControl = (router: Router) => {
    router.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    })
}

export const handleCompression = (router: Router) => {
    router.use(compression());
};

export const handleCors = (router: Router) =>
    router.use(cors({ credentials: true, origin: true }));
