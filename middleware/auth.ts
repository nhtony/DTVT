const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
import AccountService from '../components/accounts/accountsService';

let nextReq = {
    id: '',
    role: '',
    status: null
};

const accountService = new AccountService();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const tokenStr = req.get('Authorization');
    if (!tokenStr) return res.status(400).send({ message: "No token provider!" });
    const token = tokenStr.split(' ')[1];
    try {
        //get token from request's header
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const existedAccount = await accountService.findById(decodedToken.accountId);
       
        if (!existedAccount.recordset.length) return res.status(401).send({ message: "Permission Deny!" });

        nextReq.id = decodedToken.accountId;
        nextReq.role = decodedToken.role;
        nextReq.status = decodedToken.status;

        next();

    } catch (error) {
        console.log("TCL: authenticate -> error", error)
        res.status(401).send({ message: "Permission Deny!", data: error });
    }
}

export const authorize = (accessRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (nextReq.status === 1) {
            const canAccess = accessRoles.includes(nextReq.role);
            if (!canAccess) return res.status(401).send({ message: "Permission Deny!" });
            next();
        }
        else {
            return res.status(401).send({ message: "Account is not active!" });
        }
    }
}