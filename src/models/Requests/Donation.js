const yup = require('yup');

const Create = yup.object().shape({
  email: yup.string('email must be a string'),
  amount: yup.number().required('amount is required'),
  paymentMethod: yup.string('paymentMethod must be a string').required('paymentMethod is required'),
});

const Update = yup.object().shape({
  email: yup.string('email must be a string'),
  amount: yup.number(),
  paymentMethod: yup.string('paymentMethod must be a string'),
  confirmed: yup.bool('confirmed must be a boolean'),
  feedback: yup.mixed(),
});

const Rate = yup.object().shape({
  confirmed: yup.bool('confirmed must be a boolean'),
  experience: yup.number('experience must be a number'),
});

module.exports = {
  Create,
  Update,
  Rate
};
