const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const electronicSchema = Joi.object({
    id: Joi.string().required().error((errors: Error[]) => errorMessage('id', errors)),
    name:Joi.string().required().error((errors: Error[]) => errorMessage('name', errors)),
    number: Joi.number().required().error((errors: Error[]) => errorMessage('number', errors)),
    industry: Joi.number().required().error((errors: Error[]) => errorMessage('groupMajorId', errors)),
    major: Joi.number().required().error((errors: Error[]) => errorMessage('majorId', errors)),
    specialized: Joi.string().required().error((errors: Error[]) => errorMessage('specMajorId', errors)),
    type: Joi.string().required().error((errors: Error[]) => errorMessage('Type', errors)),
    semester: Joi.number().required().error((errors: Error[]) => errorMessage('semester', errors))
});

export default electronicSchema;