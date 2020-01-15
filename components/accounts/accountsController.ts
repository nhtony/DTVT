import { Request, Response } from "express";
import AccountService from './accountsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
import { accountSchema, accountPasswordSchema } from './account';
import { appendLeadingZeroes } from '../../common';
import { signToken } from '../../common';

const bcrypt = require('bcryptjs');

class AccountsController {

    private accountService: AccountService;
    private lectureService: LectureService;
    private studentService: StudentService;

    constructor(_accountService = new AccountService(), _lectureService = new LectureService(), _studentService = new StudentService()) {
        this.lectureService = _lectureService;
        this.accountService = _accountService;
        this.studentService = _studentService;
    }

    getAccounts = async (req: Request, res: Response) => {
        try {
            const data = await this.accountService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            res.status(500).send();
        }
    }

    getAccountByID = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await this.accountService.findById(id);
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

            let { password, role, id } = req.body;

            //Role là chuỗi, đoạn này chống nhập role không hợp lệ
            const roles = ['student', 'lecture', 'admin'];
            const isAllow = roles.includes(role);
            if (!isAllow) return res.status(400).send({ message: "Please enter exact role" });

            if(!type) role = 'student'; // Bắt buộc student luôn là quyền student

            //Tìm ngày sinh đúng với id
            const birthDB = await this.getBirth(req, res, type);
            if (!birthDB) return res.status(400).send({ message: "Please enter exact ID" });

            //Check account đã tồn tại chưa
            const existedAccount = await this.accountService.findById(id);
            if (existedAccount.recordset.length) return res.status(400).send({ message: "ID already registed" });

            //Check ngày sinh có hợp lệ?
            const isBirthValid = await this.checkBirth(req, res, birthDB, type);
            if (isBirthValid) return res.status(400).send({ message: "Can not access!" });

            //Hash password
            const hashPassword = await bcrypt.hash(password, 12);

            //Thêm sinh viên/ giảng viên xuống DB
            const newAccount = type ?
                await this.accountService.createWithIdLecture(hashPassword, role, id) :
                await this.accountService.createWithIdStudent(hashPassword, role, id)

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
            const existedAccount = await this.accountService.findById(id);
            if (!existedAccount.recordset.length) return res.status(400).send({ massage: 'Account not exist !' });
            const activedAccount = isActive ? await this.accountService.updateStatusById(id, 'enable') : await this.accountService.updateStatusById(id, 'disable');
            if (activedAccount.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Successful!' });
        } catch (error) {
            console.log("TCL: AccountsController -> activeAccount -> error", error)
            res.status(500).send(error);
        }
    }

    setStudentRole = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const existedAccount = await this.accountService.findById(id);
            if (!existedAccount.recordset.length) return res.status(400).send({ massage: 'Account not exist !' });
            const updateRole = await this.studentService.updateRoleById(1, id);
            if (updateRole.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Successful!' });
        } catch (error) {
            console.log("TCL: AccountsController -> setStudentRole -> error", error)
            res.status(500).send(error);
        }
    }

    login = (type: boolean) => async (req: Request, res: Response) => {
        try {
            const { id, password } = req.body;

            const existedAccount = await this.accountService.findById(id);

            if (!existedAccount.recordset.length) return res.status(401).send({ message: 'Email or password is incorrect!' });

            const { PASSWORD, ACCOUNT_ID, QUYEN, STATUS } = existedAccount.recordset[0];

            if (STATUS !== 1) return res.status(401).send({ message: 'Account has not actived' });

            const isCorrect = await bcrypt.compare(password, PASSWORD); 

            if (!isCorrect) return res.status(401).send({ message: 'Email or password is incorrect!' });

            const inforAccount = type ? await this.lectureService.findById(ACCOUNT_ID) : await this.studentService.findById(ACCOUNT_ID);

            if (!inforAccount.recordset.length) return res.status(401).send({ message: 'please switch API' });

            const { HO_SINH_VIEN, TEN_SINH_VIEN, EMAIL, NGAY_SINH, MaLop, HO_GIANG_VIEN, TEN_GIANG_VIEN } = inforAccount.recordset[0];

            const NAME = type ? HO_GIANG_VIEN + ' ' + TEN_GIANG_VIEN : HO_SINH_VIEN + ' ' + TEN_SINH_VIEN;

            const profile = {
                name: NAME,
                email: EMAIL,
                birth: NGAY_SINH || null,
                classId: MaLop || null
            }
            // tao token
            const token = signToken({ accountId: ACCOUNT_ID, role: QUYEN, status: STATUS });
            res.status(200).send({ data: { token, profile } });
        } catch (error) {
            console.log("TCL: AccountsController -> login -> error", error)
            res.status(200).send({ massage: 'Login fail' });
        }
    }

    resetPassword = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = accountPasswordSchema.validate(req.body, { abortEarly: false });
            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const { id, currentPassword, newPassword } = req.body;

            const existedAccount = await this.accountService.findById(id);
          
            if (existedAccount.recordset.length === 0) return res.status(400).send({ massage: 'Permision Deny!' });

            const { PASSWORD } = existedAccount.recordset[0];

            const isCorrect = await bcrypt.compare(currentPassword, PASSWORD);

            if (!isCorrect) return res.status(401).send({ message: 'Password is incorrect!' });

            const newHashPassword = await bcrypt.hash(newPassword, 12);

            const updatedPassword = await this.accountService.updatePassword(id, newHashPassword);
            
            if (updatedPassword.rowsAffected.length === 0) return res.status(500).send({ massage: 'Update fail!' });

            return res.status(500).send({ massage: 'Update successfully!' });

        } catch (error) {
            console.log("TCL: AccountsController -> resetPassword -> error", error)
            res.status(500).send({ massage: 'Update fail!' });
        }
    }

    private getBirth = async (req: Request, res: Response, type: boolean) => {
        let result = null;
        if (type) {
            result = await this.lectureService.findById(req.body.id);
            return result.recordset.length;
        }
        else {
            result = await this.studentService.findBirthById(req.body.id);
            if (result.recordset.length) return result.recordset[0].NGAY_SINH;
        }
    }

    private checkBirth = async (req: Request, res: Response, birthDB: Date, type: boolean) => {
        if (type) return false;
        const formatted_date: string = birthDB.getFullYear() + "-" + appendLeadingZeroes(birthDB.getMonth() + 1) + "-" + appendLeadingZeroes(birthDB.getDate());
        return formatted_date !== req.body.birth;
    }
}

export default new AccountsController();

