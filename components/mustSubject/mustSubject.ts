const Joi = require('@hapi/joi');
import { errorMessage } from '../../common/error';

const MustSubjectSchema = Joi.object({
    mustSubId: Joi.string().required().error((errors: Error[]) => errorMessage('mustSubId', errors)),
    mustSubName: Joi.string().required().error((errors: Error[]) => errorMessage('mustSubName', errors)),
    subId: Joi.string().required().error((errors: Error[]) => errorMessage('subId', errors)),
});

export default MustSubjectSchema;