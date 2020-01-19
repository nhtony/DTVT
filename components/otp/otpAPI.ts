
import OTPController from './otpController';
import { Injector } from '../../DI/Injector';

const otpController = Injector.resolve<OTPController>(OTPController);

const otpRoutes = {
    sendOTP: {
        path: "/otp/send",
        method: "post",
        handler: [otpController.sendOTP,otpController.saveOTP]
    },
    verifyOTP: {
        path: "/otp/verify",
        method: "post",
        handler: [otpController.verifyOTP,otpController.activeAccount,otpController.deleteOTP]
    }
};

const otpAPIs = Object.values(otpRoutes);
export default otpAPIs;