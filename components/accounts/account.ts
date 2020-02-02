const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';
const accountSchema = Joi.object({
    password: Joi.string().required().min(8).error((errors: Error[]) => errorMessage('Password', errors)),
    id: Joi.string().required().error((errors: Error[]) => errorMessage('MSGV', errors)),
    role: Joi.string().required().error((errors: Error[]) => errorMessage('Role', errors)),
    birth: Joi.date().required().error((errors: Error[]) => errorMessage('Birthday', errors)),
});

const accountPasswordSchema = Joi.object({
    id: Joi.string().required().error((errors: Error[]) => errorMessage('MSGV', errors)),
    currentPassword: Joi.string().required().min(8).error((errors: Error[]) => errorMessage('Password', errors)),
    newPassword: Joi.string().required().min(8).error((errors: Error[]) => errorMessage('Password', errors))
})

export  { accountSchema, accountPasswordSchema };