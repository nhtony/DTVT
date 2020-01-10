
import OTPController from './otpController';

const otpRoutes = {
    sendOTP: {
        path: "/otp/send",
        method: "post",
        handler: [OTPController.sendOTP,OTPController.saveOTP]
    },
    verifyOTP: {
        path: "/otp/verify",
        method: "post",
        handler: [OTPController.verifyOTP,OTPController.activeAccount,OTPController.deleteOTP]
    }
};

const otpAPIs = Object.values(otpRoutes);
export default otpAPIs;