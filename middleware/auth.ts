const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
import AccountService from '../components/accounts/accountsService';

const accountService = new AccountService();

interface IReq {
    id: string;
    role: string;
    status: number;
    classId: string;
    iat: Date;
    exp: Date;
    get: Function;
}

export const authenticate = async (req: IReq, res: Response, next: NextFunction) => {
    const tokenStr = req.get('Authorization');
    
    if (!tokenStr) return res.status(400).send({ message: "No token provider!" });
    const token = tokenStr.split(' ')[1];
    try {
        //get token from request's header
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const existedAccount = await accountService.findBy({ACCOUNT_ID:decodedToken.accountId});

        if (!existedAccount.recordset.length) return res.status(401).send({ message: "Permission Deny!" });

        req.id = decodedToken.accountId;
        req.role = decodedToken.role;
        req.status = decodedToken.status;
        req.classId = decodedToken.classId;
        req.iat = decodedToken.iat;
        req.exp = decodedToken.exp;
        
        next();

    } catch (error) {
        console.log("TCL: authenticate -> error", error)
        res.status(401).send({ message: "Permission Deny!", data: error });
    }
}

export const authorize = (accessRoles: string[]) => {
    return async (req: IReq, res: Response, next: NextFunction) => { 
        if (req.status === 1) {
            const canAccess = accessRoles.includes(req.role); 
            if (!canAccess) return res.status(401).send({ message: "Permission Deny!" });
            next();
        }
        else {
            return res.status(401).send({ message: "authorize: account not active!" });
        }
    }
}
