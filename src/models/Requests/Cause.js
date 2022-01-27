const yup = require('yup');

const Create = yup.object().shape({
  name: yup.string('title must be a string').required('title is required'),
  avatar: yup.string().url('avatar must be a url').required('avatar is required'),
  title: yup.string('title must be a string'),
  image: yup.string().url('image must be a url').required('image is required'),
  city: yup.string('city must be a string'),
  state: yup.string('state must be a string'),
  description: yup.string('description must be a string'),
  paymentUrl: yup.string().url('paymentUrl must be a url').required('paymentUrl is required'),
  banners: yup.array().of(yup.string('banner must be a string').nullable()),
});

const Update = yup.object().shape({
  name: yup.string('title must be a string'),
  avatar: yup.string().url('avatar must be a url'),
  title: yup.string('title must be a string'),
  image: yup.string().url('image must be a url'),
  city: yup.string('city must be a string'),
  state: yup.string('state must be a string'),
  description: yup.string('description must be a string'),
  paymentUrl: yup.string().url('paymentUrl must be a url'),
  banners: yup.array().of(yup.string('banner must be a string').nullable()),
});

module.exports = {
  Create,
  Update
};
