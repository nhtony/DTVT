const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const SelectedSubjectSchema = Joi.object({
    subjectId: Joi.string().required().error((errors: Error[]) => errorMessage('subjectId', errors)),
    studentId: Joi.string().required().error((errors: Error[]) => errorMessage('studentId', errors)),
    createdAt: Joi.date().required().error((errors: Error[]) => errorMessage('createdAt', errors))
});

export default SelectedSubjectSchema;