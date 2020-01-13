const jwt = require('jsonwebtoken');

export const generateOTP = () => {
    const digits = '0123456789';
    const otpLength = 6;
    let otp = '';
    for (let i = 1; i <= otpLength; i++) {
        let index = Math.floor(Math.random() * (digits.length));
        otp = otp + digits[index];
    }
    return otp;
}

export const appendLeadingZeroes = (n: number) => {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}

export const errorMessage = (title: string, errors: any[]) => {
    errors.forEach(error => {
        switch (error.code) {
            case "string.base":
                error.message = `${title} must be a string!`;
                break;
            case "date.base":
                error.message = `${title} must be a date!`;
                break;
            case "string.empty":
                error.message = `${title} should not be empty!`;
                break;
            case "string.max":
                error.message = `${title} must be less than or equal to 10 characters!`;
                break;
            case "string.min":
                error.message = `${title} must be greater than or equal to 8 characters!`;
                break;
            default:
                break;
        }
    });
    return errors;
}

export const signToken = (payload:any) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED_ID });
    return token
}