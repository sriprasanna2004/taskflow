const { errorResponse } = require('../utils/response');

/**
 * Joi validation middleware factory
 * @param {Object} schema - Joi schema
 * @param {string} source - 'body' | 'query' | 'params'
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(', ');
      return errorResponse(res, 400, message);
    }

    req[source] = value; // replace with sanitised value
    next();
  };
};

module.exports = { validate };
