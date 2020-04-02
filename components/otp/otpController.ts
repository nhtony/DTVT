import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import OTPService from './otpService';
import AccountService from '../accounts/accountsService';
import StudentService from '../students/studentsService';
import { sendEmail } from '../../services/mailer';
import { generateOTP, maskEmail } from '../../common/service';
import { check } from "../../common/error";
import { signToken } from '../../common/auth';

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

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: "Account not found" });

            const { STATUS, MA_SINH_VIEN } = existedAccount.recordset[0] || {};

            if (STATUS === 1) return res.status(400).send({ message: "Account is actived" });

            if (MA_SINH_VIEN) { // Nếu MSV có tồn tại trong account thì kiểm trong trong bảng sv đã có email chưa
                const studentEmail = await this.studentService.findBy({EMAIL:email});
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
            res.status(500).send("Thất bại");
        }
    }

    sendOtpForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.body

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: "Account not found" });

            const { STATUS, MA_SINH_VIEN } = existedAccount.recordset[0] || {};

            if (STATUS !== 1) return res.status(401).send({ message: 'Account has not actived' });

            const studentEmail = await this.studentService.findBy({ MA_SINH_VIEN }, 'EMAIL');

            const { EMAIL } = studentEmail.recordset[0] || {};

            const otp = generateOTP();

            const sentEmail = await sendEmail(EMAIL, otp);

            if (!sentEmail) return res.status(500).send({ message: "Fail to send mail!" });

            const updateOTP = await this.otpService.update(otp, EMAIL, MA_SINH_VIEN);

            if (check(updateOTP, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            const maskEmailOptions = {
                maskWith: "*",
                unmaskedStartCharacters: 3,
                maskedEndCharacters: 8,
            };

            res.status(200).send({
                id: MA_SINH_VIEN,
                expirationTime: this.nextReq.expirationTime,
                email: maskEmail(EMAIL, maskEmailOptions)
            });

            this.autoDeleteOTP();
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
                    expirationTime: this.nextReq.expirationTime // có gì ông xử lí conflict dùm tui nha này tui sửa ở Front-end rồi á là không cần key data nữa
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

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });

            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: 'ID is not correct' });

            const { STATUS } = existedAccount.recordset[0];
            if (STATUS === 1) return res.status(400).send({ message: "Account is actived" });

            const existedOTP = await this.otpService.find(otp, id);
            if (!check(existedOTP, 'EXISTED')) return res.status(500).send({ message: "OTP was expired" });

            const { EMAIL } = existedOTP.recordset[0];

            const newEmail = await this.studentService.updateStudent({ EMAIL }, { MA_SINH_VIEN: id });

            if (check(newEmail, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            this.nextReq.code = otp;
            this.nextReq.id = id;
            next();

        } catch (error) {
            console.log("TCL: module.exports.verifyOTP -> error", error)
            res.status(500).send();
        }
    }

    loginResetPassword = async (req: Request, res: Response) => {
        try {
            const { otp, id } = req.body;

            const existedAccount = await this.accountService.findBy({ ACCOUNT_ID: id });
            if (!check(existedAccount, 'EXISTED')) return res.status(400).send({ message: 'ID is not correct' });

            const { ACCOUNT_ID, QUYEN, STATUS } = existedAccount.recordset[0];
            if (STATUS !== 1) return res.status(401).send({ message: 'Account has not actived' });

            const existedOTP = await this.otpService.find(otp, id);
            if (!check(existedOTP, 'EXISTED')) return res.status(500).send({ message: "OTP was expired" });

            const token = signToken({ accountId: ACCOUNT_ID, role: QUYEN, status: STATUS }, "30s");

            res.status(200).send({ token });
        } catch (error) {
            console.log("TCL: OTPController -> loginResetPassword -> error", error)
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

