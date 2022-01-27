const ErrorResponse = require('./ErrorResponse');
const { CRUD } = require('../helpers/constants');

const handleMongoErrors = (error) => {
  let response = ErrorResponse.defaultMsg();
  switch(error.code) {
    case 11000:
      response = ErrorResponse.customMsg(CRUD.DUPLICATE_ITEM);
      break;
    default:
      break;
  }
  return response;
};

const handleValidationErrors = (error) => {
  let invalidFields = error.errors;
  if (!Array.isArray(error.errors)) {
    const invalidFieldsNames = Object.getOwnPropertyNames(error.errors);
    invalidFields = invalidFieldsNames.reduce(
      (prev, field) => ([...prev, error.errors[field].properties.message]),
      []
    );
  }
  return ErrorResponse.customMsg(CRUD.INVALID_REQUEST, invalidFields)
};

const handleErrors = (error) => {
  switch(error.name) {
    case 'MongoError':
      return handleMongoErrors(error);
    case 'ValidationError':
      return handleValidationErrors(error);
    default:
      break;
  }
};

module.exports = handleErrors;
