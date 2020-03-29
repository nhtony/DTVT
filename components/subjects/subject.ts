const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const subjectShema = Joi.object({
    subjectId: Joi.string().required().error((errors: Error[]) => errorMessage('Subject ID', errors)),
    subjectName: Joi.string().required().error((errors: Error[]) => errorMessage('Subject Name', errors)),
    subjectNumber: Joi.string().required().error((errors: Error[]) => errorMessage('Subject Number', errors)),
    status: Joi.number().required().error((errors: Error[]) => errorMessage('Subject Required', errors)),

});

export default subjectShema;