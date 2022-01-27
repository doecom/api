const axios = require('axios');

const { SERVICE_IBGE_API_URL } = process.env;

const api = axios.create({
  baseURL: SERVICE_IBGE_API_URL
});

module.exports = {
  api
};
