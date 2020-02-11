const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const lanesSchema = Joi.object({
    id: Joi.number().error((errors: Error[]) => errorMessage('laneId', errors)),
    title: Joi.string().required().error((errors: Error[]) => errorMessage('Title', errors)),
});

export default lanesSchema;