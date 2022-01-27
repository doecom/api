const ErrorResponse = require('../helpers/ErrorResponse');
const CrudErrors = require('../helpers/CrudErrors');

const { NODE_ENV } = process.env;

const HandleAppErrors = ({ status, code, details={} }) => {
  return { status, code, details };
};

const knownErrors = {
  MongoError: CrudErrors,
  ValidationError: CrudErrors,
  AuthError: HandleAppErrors,
  RequestError: HandleAppErrors,
  CustomError: HandleAppErrors
};

module.exports = (err, _, res, next) => {
  if (NODE_ENV !== 'production') {
    console.log('>> Debug:', err);
  }

  next();

  const knownError = knownErrors[err.name];
  if (knownError) {
    const { status, code, details } = knownError(err);
    res.status(status || 200).json({ error: { code, details }});
  } else {
    const { status, code, details } = ErrorResponse.defaultMsg();
    res.status(status).json({ error: { code, details }});
  }

}
