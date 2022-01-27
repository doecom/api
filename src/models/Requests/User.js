const yup = require('yup');

module.exports = yup.object().shape({
  name: yup.string().required('name is required'),
  picture: yup.string().url('picture must be a valid url'),
  email: yup.string().required('email is required'),
  phoneNumber: yup.string(),
  city: yup.string(),
  state: yup.string(),
  password: yup.string().required('password is required'),
  roles: yup.array().of(yup.string()).strict().typeError('roles must be an array of strings'),
  language: yup.string()
});
