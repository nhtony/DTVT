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

export const maskEmail = (email: string, options: any) => {
    let maskedEmail = null;

    const indexOfAt = email.indexOf('@');
    let maskLengthBeforeAtTheRate = indexOfAt - options.unmaskedStartCharacters;
    let unmaskLengthAfterAtTheRate = email.length - indexOfAt - options.maskedEndCharacters - 1;

    if (!maskedEmail) {
        maskedEmail = email.substr(0, options.unmaskedStartCharacters) + `${options.maskWith}`.repeat(maskLengthBeforeAtTheRate)
            + '@' + email.substr(indexOfAt + 1, unmaskLengthAfterAtTheRate) + `${options.maskWith}`.repeat(options.maskedEndCharacters);
    }
    return maskedEmail;
}