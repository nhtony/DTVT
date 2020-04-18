import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import AccountService from '../accounts/accountsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
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

    loginAdmin = async (req: Request, res: Response) => {
        try {
            const { id, password } = req.body;

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(401).send({ message: 'Email or password is incorrect!' });

            const { PASSWORD, ACCOUNT_ID, QUYEN, STATUS } = existedAccount.recordset[0];

            if (QUYEN !== "admin") return res.status(401).send({ message: 'Access denied!' });

            if (STATUS !== 1) return res.status(401).send({ message: 'Account has not actived' });

            const isCorrect = await bcrypt.compare(password, PASSWORD);

            if (!isCorrect) return res.status(401).send({ message: 'Email or password is incorrect!' });

            const token = signToken({ accountId: ACCOUNT_ID, role: QUYEN, status: STATUS }, "1h");
            res.status(200).send({ token });
        } catch (error) {
            console.log("AccountsController -> loginAdmin -> error", error);
            res.status(500).send({ message: 'Login fail' });
        }
    }

}

export default AccountsController;

