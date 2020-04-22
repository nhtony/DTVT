import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import AccountService from './accountsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
import { accountSchema, accountPasswordSchema } from './account';
import { appendLeadingZeroes } from '../../common/service';
import { signToken } from '../../common/auth';
import { check } from '../../common/error';

const bcrypt = require('bcryptjs');
@Controller()
class AccountsController {

    constructor(
        protected accountService: AccountService,
        protected lectureService: LectureService,
        protected studentService: StudentService
    ) { }

    getAccounts = async (req: Request, res: Response) => {
        try {
            const data = await this.accountService.findAll('ACCOUNT_ID', 'STATUS');
            res.status(200).send(data);
        } catch (error) {
            console.log("TCL: AccountsController -> getAccounts -> error", error)
            res.status(500).send();
        }
    }

    getAccountByID = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await this.accountService.findBy({
                ACCOUNT_ID: id
            });
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

            // //Role là chuỗi, đoạn này chống nhập role không hợp lệ
            const roles = ['student', 'lecture', 'admin'];
            const isAllow = roles.includes(role);
            if (!isAllow) return res.status(400).send({ message: "Please enter exact role" });

            if (!type) role = 'student'; // Bắt buộc student luôn là quyền student

            // //Tìm ngày sinh đúng với id
            const birthDB = await this.getBirth(req, res, type);
            if (!birthDB) return res.status(400).send({ message: "Please enter exact ID" });

            // //Check account đã tồn tại chưa
            const existedAccount = await this.accountService.findBy(id);

            if (check(existedAccount, 'EXISTED')) return res.status(400).send({ message: "ID already registed" });

            // //Check ngày sinh có hợp lệ?
            const isBirthValid = await this.checkBirth(req, res, birthDB, type);
            if (isBirthValid) return res.status(400).send({ message: "Can not access!" });

            // //Hash password
            const hashPassword = await bcrypt.hash(password, 12);

            // //Thêm sinh viên/ giảng viên xuống DB
            const newAccount = type ? await this.accountService.create({
                PASSWORD: hashPassword,
                QUYEN: role,
                ACCOUNT_ID: id
            }) : await this.accountService.create({
                PASSWORD: hashPassword,
                QUYEN: role,
                ACCOUNT_ID: id
            })

            if (check(newAccount, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!', id });

        } catch (error) {
            console.log("TCL: module.exports.createAccount -> error", error)
            res.status(500).send(error);
        }
    }

    activeAccount = (isActive: boolean) => async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });
            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: 'Account not exist !' });

            const activedAccount = isActive ? await this.accountService.updateStatusById(id, 'enable') : await this.accountService.updateStatusById(id, 'disable');

            if (check(activedAccount, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Successful!', id });

        } catch (error) {
            console.log("TCL: AccountsController -> activeAccount -> error", error)
            res.status(500).send(error);
        }
    }

    setStudentRole = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });
            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: 'Account not exist !' });

            const updateRole = await this.studentService.updateStudent({ LEAD: 1 }, { MA_SINH_VIEN: id });
            if (check(updateRole, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!' });

        } catch (error) {
            console.log("TCL: AccountsController -> setStudentRole -> error", error)
            res.status(500).send(error);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { id, password } = req.body;

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(401).send({ message: 'Email or password is incorrect!' });

            const { PASSWORD, ACCOUNT_ID, QUYEN, STATUS } = existedAccount.recordset[0];

            if (STATUS !== 1) return res.status(401).send({ message: 'Account has not actived' });

            const isCorrect = await bcrypt.compare(password, PASSWORD);

            if (!isCorrect) return res.status(401).send({ message: 'Email or password is incorrect!' });

            let classId = null;

            if (QUYEN === "student") {
                const result = await this.studentService.findBy({ MA_SINH_VIEN: id }, 'MaLop');
                classId = result.recordset[0].MaLop;
            }

            const token = signToken({ accountId: ACCOUNT_ID, role: QUYEN, status: STATUS, classId }, "1d");
            res.status(200).send({ token });
        } catch (error) {
            console.log("TCL: AccountsController -> login -> error", error)
            res.status(500).send({ message: 'Login fail' });
        }
    }

    getCredential = async (req: any, res: Response) => {
        try {
            const { id, role, classId, iat, exp } = req;

            const checkWho: { [index: string]: boolean } = { lecture: true, student: false }

            const data = checkWho[role] ? await this.lectureService.findBy({ MA_GIANG_VIEN: id }) : await this.studentService.findBy({ MA_SINH_VIEN: id });

            const { MA_GIANG_VIEN, MA_SINH_VIEN, HO_GIANG_VIEN, HO_SINH_VIEN, TEN_GIANG_VIEN, TEN_SINH_VIEN, EMAIL } = data.recordset[0];

            const credential = {
                accountId: checkWho[role] ? MA_GIANG_VIEN : MA_SINH_VIEN,
                firstName: checkWho[role] ? HO_GIANG_VIEN : HO_SINH_VIEN,
                lastName: checkWho[role] ? TEN_GIANG_VIEN : TEN_SINH_VIEN,
                email: EMAIL,
                role,
                classId
            }

            res.status(200).send(credential);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    changePassword = async (req: Request, res: Response) => {
        try {
            //Validation
            const validResult = accountPasswordSchema.validate(req.body, { abortEarly: false });
            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const { id, currentPassword, newPassword } = req.body;

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: 'Permision Deny!' });

            const { PASSWORD } = existedAccount.recordset[0];

            const isCorrect = await bcrypt.compare(currentPassword, PASSWORD);

            if (!isCorrect) return res.status(401).send({ message: 'Password is incorrect!' });

            const newHashPassword = await bcrypt.hash(newPassword, 12);

            const updatedPassword = await this.accountService.updateAccount({ PASSWORD: newHashPassword }, { ACCOUNT_ID: id });

            if (check(updatedPassword, 'NOT_CHANGED')) return res.status(500).send({ message: 'Update fail!' });

            return res.status(500).send({ message: 'Update successfully!' });

        } catch (error) {
            console.log("TCL: AccountsController -> changePassword -> error", error)
            res.status(500).send({ message: 'Update fail!' });
        }
    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { id, newPassword } = req.body;

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: "Account not found" });

            const newHashPassword = await bcrypt.hash(newPassword, 12);

            const updatedPassword = await this.accountService.updateAccount({ PASSWORD: newHashPassword }, { ACCOUNT_ID: id });

            if (check(updatedPassword, 'NOT_CHANGED')) return res.status(500).send({ message: 'Update fail!' });

            res.status(200).send({ message: 'Success!' });
        } catch (error) {
            console.log("TCL: AccountsController -> resetPassword -> error", error)
            res.status(500).send({ message: 'Reset fail!' });
        }
    }

    private getBirth = async (req: Request, res: Response, type: boolean) => {
        let result = null;
        if (type) {
            result = await this.lectureService.findBy({ MA_GIANG_VIEN: req.body.id });
            return result.recordset.length;
        }
        else {
            result = await this.studentService.findBy({ MA_SINH_VIEN: req.body.id }, 'NGAY_SINH');
            if (result.recordset.length) return result.recordset[0];
        }
    }

    private checkBirth = async (req: Request, res: Response, birthDB: Date, type: boolean) => {
        if (type) return false;
        const formatted_date: string = birthDB.getFullYear() + "-" + appendLeadingZeroes(birthDB.getMonth() + 1) + "-" + appendLeadingZeroes(birthDB.getDate());
        return formatted_date !== req.body.birth;
    }
}

export default AccountsController;

