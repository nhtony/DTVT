const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const telecomunicationSchema = Joi.object({
    id: Joi.string().required().error((errors: Error[]) => errorMessage('id', errors)),
    groupMajorId: Joi.string().required().error((errors: Error[]) => errorMessage('groupMajorId', errors)),
    majorId: Joi.string().required().error((errors: Error[]) => errorMessage('majorId', errors)),
    specMajorId: Joi.string().required().error((errors: Error[]) => errorMessage('specMajorId', errors)),
    semester: Joi.string().required().error((errors: Error[]) => errorMessage('semester', errors))
});

export default telecomunicationSchema;