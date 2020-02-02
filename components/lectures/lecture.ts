const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';
const lectureSchema = Joi.object({
    id: Joi.number().required().error((errors: Error[]) => errorMessage('MSGV', errors)),
    firstname: Joi.string().required().error((errors: Error[]) => errorMessage('Firstname', errors)),
    lastname: Joi.string().required().error((errors: Error[]) => errorMessage('Lastname', errors)),
    email: Joi.string().required().email().error((errors: Error[]) => errorMessage('Email', errors)),
    phone: Joi.string().required().error((errors: Error[]) => errorMessage('Phone', errors)),
    address: Joi.string().valid('').optional().error((errors: Error[]) => errorMessage('Address', errors)),
    makhoa: Joi.number().required().error((errors: Error[]) => errorMessage('Makhoa', errors)),
});

export default lectureSchema;