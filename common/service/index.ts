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
