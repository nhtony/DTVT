const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';
const studentShema = Joi.object({
    id: Joi.number().required().error((errors: Error[]) => errorMessage('MSGV', errors)),
    firstname: Joi.string().required().error((errors: Error[]) => errorMessage('Firstname', errors)),
    lastname: Joi.string().required().error((errors: Error[]) => errorMessage('Lastname', errors)),
    birth: Joi.date().required().error((errors: Error[]) => errorMessage('Birthday', errors)),
    phone: Joi.string().valid('').optional().error((errors: Error[]) => errorMessage('Phone', errors)),
    email: Joi.string().valid('').optional().email().error((errors: Error[]) => errorMessage('Email', errors)),
    classId: Joi.string().required().error((errors: Error[]) => errorMessage('Class ID', errors)),
    groupId: Joi.string().valid('').optional().error((errors: Error[]) => errorMessage('Group ID', errors))
});

export default studentShema;