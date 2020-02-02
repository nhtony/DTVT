import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import OTPService from './otpService';
import AccountService from '../accounts/accountsService';
import StudentService from '../students/studentsService';
import { sendEmail } from '../../services/mailer';
import { generateOTP } from '../../common/service';
import { check } from "../../common/error";

@Controller()
class OTPController {

    private nextReq = {
        code: '',
        email: '',
        id: '',
        expirationTime: 300000
    };

    constructor(
        protected accountService: AccountService,
        protected studentService: StudentService,
        protected otpService: OTPService) { }

    sendOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, id } = req.body

            const existedAccount = await this.accountService.findById(id);

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: "Account not found" });

            const { STATUS, MA_SINH_VIEN } = existedAccount.recordset[0] || {};

            if (STATUS === 1) return res.status(400).send({ message: "Account is actived" });

            if (MA_SINH_VIEN) { // Nếu MSV có tồn tại trong account thì kiểm trong trong bảng sv đã có email chưa
                const studentEmail = await this.studentService.findEmail(email);
                if (check(studentEmail, 'EXISTED')) return res.status(400).send({ message: "Email is actived" });
            } // Không cần check email tại giảng viên

            const otp = generateOTP();

            const sentEmail = await sendEmail(email, otp);

            if (!sentEmail) return res.status(500).send({ message: "Fail to send mail!" });

            this.nextReq.code = otp;
            this.nextReq.email = email;
            this.nextReq.id = id;

            next();

        } catch (error) {
            console.log("TCL: module.exports.sendEmail -> error", error);
            res.status(500).send();
        }
    }

    saveOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateOTP = await this.otpService.update(this.nextReq.code, this.nextReq.email, this.nextReq.id);
            if (check(updateOTP, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send(
                {
                    message: 'Success!',
                    data: { expirationTime: this.nextReq.expirationTime }
                });
            this.autoDeleteOTP();
        } catch (error) {
            console.log("TCL: module.exports.saveOTP -> error", error);
            res.status(500).send();
        }
    }

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { otp, id } = req.body;

            const existedAccount = await this.accountService.findById(id);

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: 'ID is not correct' });

            const { STATUS } = existedAccount.recordset[0];
            if (STATUS === 1) return res.status(400).send({ message: "Account is actived" });

            const existedOTP = await this.otpService.find(otp, id);
            if (!check(existedOTP, 'EXISTED')) return res.status(500).send({ message: "OTP was expired" });

            const { EMAIL } = existedOTP.recordset[0];

            const newEmail = await this.studentService.updateEmailById(EMAIL, id);
            if (check(newEmail, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            this.nextReq.code = otp;
            this.nextReq.id = id;
            next();

        } catch (error) {
            console.log("TCL: module.exports.verifyOTP -> error", error)
            res.status(500).send();
        }
    }

    activeAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const actived = await this.accountService.updateStatusById(this.nextReq.id, 'enable');
            if (check(actived, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            next();
        } catch (error) {
            console.log("TCL: module.exports.activeAccount -> error", error);
        }
    }

    deleteOTP = async (req: Request, res: Response) => {
        try {
            const deletedOTP = await this.otpService.delete(this.nextReq.code);
            if (check(deletedOTP, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!' });
        } catch (error) {
            console.log("TCL: module.exports.deleteOTP -> error", error)
            res.status(500).send();
        }
    }

    private autoDeleteOTP = () => {
        setTimeout(async () => {
            try {
                const deletedOTP = await this.otpService.delete(this.nextReq.code);
                if (!check(deletedOTP, 'NOT_DELETED')) {
                    console.log('deleted OTP');
                    return;
                }
            } catch (error) {
                console.log("TCL: OTPController -> privateautoDeleteOTP -> error", error);
                return;
            }
        }, this.nextReq.expirationTime);
    }
}

export default OTPController;

