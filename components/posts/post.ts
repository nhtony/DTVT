const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const postSchema = Joi.object({
    postContent: Joi.string().required().error((errors: Error[]) => errorMessage('content', errors)),
    postType: Joi.number().error((errors: Error[]) => errorMessage('post type', errors)),
    destination: Joi.string().error((errors: Error[]) => errorMessage('destination', errors))
});

export default postSchema;