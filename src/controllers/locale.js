const geoip = require('geoip-lite');

const localeService = require('../services/locale');

const getLocation = (ip) => {
  const geo = geoip.lookup(ip) || {};

  if (geo.region) {
    geo.state = geo.region;
  }

  return geo;
};

const getAllCitiesByState = async ({ state } = {}) => {
  const { data } = await localeService.api.get(`localidades/estados/${state}/municipios`);
  return data || [];
};

module.exports = {
  getLocation,
  getAllCitiesByState
}
