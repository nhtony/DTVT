const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const postSchema = Joi.object({
    postContent: Joi.string().required().error((errors: Error[]) => errorMessage('content', errors)),
    destination: Joi.string().error((errors: Error[]) => errorMessage('destination', errors))
});

export default postSchema;