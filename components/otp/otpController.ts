import { Request, Response, NextFunction } from "express";
import OTPService from './otpService';
import AccountService from '../accounts/accountsService';
import StudentService from '../students/studentsService';
import { sendEmail } from '../../services/mailer';
import {generateOTP} from '../../common/index';

class OTPController {

    private nextReq = {
        code: '',
        email: '',
        id: '',
        expirationTime: 5000
    };

    sendOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, id } = req.body;

            const existedAccount = await AccountService.findById(id);

            const { ACCOUNT_ID, STATUS } = existedAccount.recordset[0] || {};

            if (!ACCOUNT_ID) return res.status(400).send({ message: "Account not found" });

            if (STATUS === 1) return res.status(400).send({ message: "Account is actived" });

            const otp = generateOTP();

            const sentEmail = await sendEmail(email, otp);

            if (!sentEmail) return res.status(500).send({ massage: "Fail to send mail!" });

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
            const updateOTP = await OTPService.update(this.nextReq.code, this.nextReq.email, this.nextReq.id);
            if (!updateOTP.rowsAffected.length) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send(
                {
                    massage: 'Success!',
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
            const result = await OTPService.find(otp, id);

            if (!result.recordset.length) return res.status(500).send({ massage: "OTP was expired" });

            const { EMAIL } = result.recordset[0];

            const newEmail = await StudentService.updateEmailById(EMAIL, id);

            if (!newEmail.rowsAffected.length) return res.status(500).send({ massage: 'Fail!' });

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
            const actived = await AccountService.updateStatus(this.nextReq.id);
            if (!actived.rowsAffected.length) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Success!' });
        } catch (error) {
            console.log("TCL: module.exports.activeAccount -> error", error);
        }
    }

    deleteOTP = async (req: Request, res: Response) => {
        try {
            const deletedOTP = await OTPService.delete(this.nextReq.code);
            if (!deletedOTP.rowsAffected.length) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Success!' });
        } catch (error) {
            console.log("TCL: module.exports.deleteOTP -> error", error)
            res.status(500).send();
        }
    }

    private autoDeleteOTP = () => {
        setTimeout(async () => {
            try {
                const deletedOTP = await OTPService.delete(this.nextReq.code);
                if (deletedOTP.rowsAffected.length) {
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

export default new OTPController();

