
// START - escapeStringRegexp
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports.escapeStringRegexp = (str) => {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};
// END - escapeStringRegexp

// START - escapeStringRegexp
module.exports.filterObject = (object, filter) => {
  return filter.reduce((prev, curr) => {
    if (object[curr] !== undefined)
      prev[curr] = object[curr];
    return prev;
  }, {});
};
// END - escapeStringRegexp
