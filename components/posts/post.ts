const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const postSchema = Joi.object({
    postContent: Joi.string().error((errors: Error[]) => errorMessage('content', errors))
});

export default postSchema;