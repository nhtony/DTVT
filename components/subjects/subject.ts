const Joi = require('@hapi/joi');
import { errorMessage } from '../../common';

const subjectShema = Joi.object({
    subjectId: Joi.string().required().error((errors: Error[]) => errorMessage('Subject ID', errors)),
    subjectName: Joi.string().required().error((errors: Error[]) => errorMessage('Subject Name', errors)),
    subjectNumber: Joi.string().required().error((errors: Error[]) => errorMessage('Subject Number', errors)),
    subjectRequired: Joi.number().required().error((errors: Error[]) => errorMessage('Subject Required', errors)),
    majorID: Joi.string().required().error((errors: Error[]) => errorMessage('Major ID', errors)),
});

export default subjectShema;