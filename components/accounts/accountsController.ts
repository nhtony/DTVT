import { Request, Response, NextFunction } from "express";
import AccountService from './accountsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
import accountSchema from './account';

const bcrypt = require('bcryptjs');
class AccountsController {

    getAccounts = async (req: Request, res: Response) => {
        try {
            const data = await AccountService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            res.status(500).send();
        }
    }

    getAccountByID = (type: boolean) => async (req: Request, res: Response) => {

        try {
            const { id } = req.params;
            const data = type ? await AccountService.findByIdLecture(id) : await AccountService.findByIdStudent(id);
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: module.exports.getAccountByUserName -> error", error)
            res.status(500).send();
        }
    }

    createAccount = (type: boolean) => async (req: Request, res: Response) => {

        /**
         * type = true => giảng viên
         * type = false => sinh viên 
         *  */
        try {

            //Validation
            const validResult = accountSchema.validate(req.body, { abortEarly: false });
            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const { password, role, id, birth } = req.body;
            console.log("TCL: AccountsController -> createAccount -> birth", birth)

            // Check ID có hợp lệ không
            const result = type ? await LectureService.findBirthById(id) : await StudentService.findBirthById(id);

            if (!result.recordset.length) return res.status(400).send({ message: "Please enter your ID exactly!" });

            const { NGAY_SINH } = result.recordset[0];
            
            console.log("TCL: AccountsController -> createAccount -> NGAY_SINH", NGAY_SINH)
           
            const formatted_date:string = NGAY_SINH.getFullYear() + "-" + appendLeadingZeroes(NGAY_SINH.getMonth() + 1) + "-" + appendLeadingZeroes(NGAY_SINH.getDate());
            
            if (!type) {
                if (formatted_date !== birth) return res.status(400).send({ message: "Can not access!" });
            }

            //Check account đã tồn tại chưa
            const existedAccount = await AccountService.findById(id);

            if (existedAccount.recordset.length) return res.status(400).send({ message: "ID already registed" });

            //Hash password
            const hashPassword = await bcrypt.hash(password, 12);

            //Thêm sinh viên/ giảng viên xuống DB
            const newAccount = type ?
                await AccountService.createWithIdLecture(hashPassword, role[0], id) :
                await AccountService.createWithIdStudent(hashPassword, role[0], id)

            if (newAccount.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Successful!' });

        } catch (error) {
            console.log("TCL: module.exports.createAccount -> error", error)
            res.status(500).send(error);
        }
    }
}

export default new AccountsController();

function appendLeadingZeroes(n: number) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}