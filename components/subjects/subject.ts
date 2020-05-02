const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const subjectShema = Joi.object({
    id: Joi.string().required().error((errors: Error[]) => errorMessage('ID', errors)),
    name: Joi.string().required().error((errors: Error[]) => errorMessage('Name', errors)),
    number: Joi.number().required().error((errors: Error[]) => errorMessage('Number', errors))
});

export default subjectShema;