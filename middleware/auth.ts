const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
import AccountService from '../components/accounts/accountsService';

let nextReq = {
    id: '',
    role: ''
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const tokenStr = req.get('Authorization');
    if (!tokenStr) return res.status(400).send({ message: "No token provider!" });
    const token = tokenStr.split(' ')[1];
    try {
        //get token from request's header
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const existedAccount = await AccountService.findById(decodedToken.accountId);

        if (existedAccount.recordset.length) return res.status(401).send({ message: "Permission Deny!" });

        nextReq.id = decodedToken.accountId;
        nextReq.role = decodedToken.role;
        next();

    } catch (error) {
        console.log("TCL: authenticate -> error", error)
        res.status(401).send({ message: "Permission Deny!", data: error });
    }
}

export const authorize = (accessRoles: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let canAccess = false;
        switch (accessRoles) {
            case 'student':
                canAccess = true;
                break;
            case 'lecture':
                canAccess = true;
                break;
            case 'admin':
                canAccess = true;
                break;
            default:
                break;
        }
        if (!canAccess) return res.status(401).send({ message: "Permission Deny!" });
        next();
    }
}