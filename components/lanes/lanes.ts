const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const lanesSchema = Joi.object({
    laneId: Joi.number().error((errors: Error[]) => errorMessage('laneId', errors)),
    title: Joi.string().required().error((errors: Error[]) => errorMessage('Title', errors)),
    label: Joi.string().required().error((errors: Error[]) => errorMessage('Label', errors))
});

export default lanesSchema;