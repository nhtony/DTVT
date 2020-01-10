const Joi = require('@hapi/joi');

const accountSchema = Joi.object({
    password: Joi.string().required().min(8).error((errors: Error[]) => customErrorMsg('Password', errors)),
    id: Joi.string().required().error((errors: Error[]) => customErrorMsg('MSGV', errors)),
    role: Joi.array().required().error((errors: Error[]) => customErrorMsg('Role', errors)),
    birth: Joi.date().required().error((errors: Error[]) => customErrorMsg('Birthday', errors)),
})

const customErrorMsg = (title: string, errors: any[]) => {
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

export default accountSchema