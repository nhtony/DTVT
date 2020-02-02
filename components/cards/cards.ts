const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const cardsSchema = Joi.object({
    cardId: Joi.number().error((errors: Error[]) => errorMessage('cardId', errors)),
    title: Joi.string().required().error((errors: Error[]) => errorMessage('Title', errors)),
    label: Joi.string().required().error((errors: Error[]) => errorMessage('Label', errors)),
    description: Joi.string().required().error((errors: Error[]) => errorMessage('Description', errors)),
    laneId: Joi.number().required().error((errors: Error[]) => errorMessage('laneId', errors))
});

export default cardsSchema;