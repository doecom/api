const yup = require('yup');

module.exports = yup.object().shape({
  title: yup.string().required('title is required'),
  receiver: yup.string().required('receiver is required'),
  type: yup.string().required('type is required').oneOf(['SUCCESS', 'INFO', 'WARNING', 'DANGER']),
  message: yup.string(),
});
