const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const CommingSubjectSchema = Joi.object({
    subjectId: Joi.string().required().error((errors: Error[]) => errorMessage('subjectId', errors)),
    semester: Joi.number().required().error((errors: Error[]) => errorMessage('semester', errors)),
    schoolYear: Joi.string().required().error((errors: Error[]) => errorMessage('shoolYear', errors))
});

export default CommingSubjectSchema;