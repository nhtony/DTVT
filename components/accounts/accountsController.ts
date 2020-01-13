import { Request, Response } from "express";
import AccountService from './accountsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
import accountSchema from './account';
import { appendLeadingZeroes } from '../../common';
import { signToken } from '../../common';

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

    getAccountByID = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await AccountService.findById(id);
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

            const { password, role, id } = req.body;

            //Tìm ngày sinh đúng với id
            const birthDB = await this.getBirth(req, res, type);
            if (!birthDB) return res.status(400).send({ message: "Please enter exact ID" });

            //Check account đã tồn tại chưa
            const existedAccount = await AccountService.findById(id);
            if (existedAccount.recordset.length) return res.status(400).send({ message: "ID already registed" });

            //Check ngày sinh có hợp lệ?
            const isBirthValid = await this.checkBirth(req, res, birthDB);
            if (isBirthValid) return res.status(400).send({ message: "Can not access!" });

            //Hash password
            const hashPassword = await bcrypt.hash(password, 12);

            //Thêm sinh viên/ giảng viên xuống DB
            const newAccount = type ?
                await AccountService.createWithIdLecture(hashPassword, role, id) :
                await AccountService.createWithIdStudent(hashPassword, role, id)

            if (newAccount.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Successful!' });

        } catch (error) {
            console.log("TCL: module.exports.createAccount -> error", error)
            res.status(500).send(error);
        }
    }

    activeAccount = (isActive: boolean) => async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const existedAccount = await AccountService.findById(id);
            if (!existedAccount.recordset.length) return res.status(400).send({ massage: 'Account not exist !' });
            const activedAccount = isActive ? await AccountService.updateStatusById(id, 'enable') : await AccountService.updateStatusById(id, 'disable')
            if (activedAccount.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Successful!' });
        } catch (error) {
            console.log("TCL: AccountsController -> activeAccount -> error", error)
            res.status(500).send(error);
        }
    }

    login = (type: boolean) => async (req: Request, res: Response) => {
        try {
            const { id, password } = req.body;

            const existedAccount = await AccountService.findById(id);

            if (!existedAccount.recordset.length) return res.status(401).send({ message: 'Email or password is incorrect!' });
            // so sanh password
            const { PASSWORD, ACCOUNT_ID, QUYEN, STATUS } = existedAccount.recordset[0];

            if (STATUS !== 1) return res.status(401).send({ message: 'Account has not actived' });

            const isCorrect = await bcrypt.compare(password, PASSWORD);

            if (!isCorrect) return res.status(401).send({ message: 'Email or password is incorrect!' });

            const inforAccount = type ? await LectureService.findById(ACCOUNT_ID) : await StudentService.findById(ACCOUNT_ID);

            const { HO_SINH_VIEN, TEN_SINH_VIEN, EMAIL, NGAY_SINH, MaLop } = inforAccount.recordset[0];

            const profile = {
                name: HO_SINH_VIEN + ' ' + TEN_SINH_VIEN,
                email: EMAIL,
                birth: NGAY_SINH,
                classId: MaLop
            }
            // tao token
            const token = signToken({ accountId: ACCOUNT_ID, role: QUYEN });
            res.status(200).send({ data: { token, profile } });
        } catch (error) {
            console.log("TCL: AccountsController -> login -> error", error)
            res.status(200).send({ massage: 'Login fail' });
        }
    }

    private getBirth = async (req: Request, res: Response, type: boolean) => {
        const result = type ? await LectureService.findBirthById(req.body.id) : await StudentService.findBirthById(req.body.id);
        if (result.recordset.length) return result.recordset[0].NGAY_SINH;
        else return null;
    }

    private checkBirth = async (req: Request, res: Response, birthDB: Date) => {
        const formatted_date: string = birthDB.getFullYear() + "-" + appendLeadingZeroes(birthDB.getMonth() + 1) + "-" + appendLeadingZeroes(birthDB.getDate());
        return formatted_date !== req.body.birth;
    }
}

export default new AccountsController();

