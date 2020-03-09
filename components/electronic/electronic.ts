const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const electronicSchema = Joi.object({
    subjectId: Joi.string().required().error((errors: Error[]) => errorMessage('subjectId', errors)),
    groupMajorId: Joi.string().required().error((errors: Error[]) => errorMessage('groupMajorId', errors)),
    majorId: Joi.string().required().error((errors: Error[]) => errorMessage('majorId', errors)),
    specMajorId: Joi.string().required().error((errors: Error[]) => errorMessage('specMajorId', errors))
});

export default electronicSchema;