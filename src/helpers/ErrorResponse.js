const defaultMsg = () => {
  return {
    code: 'UNKNOWN_ERROR',
    status: 500,
  }
};

const customMsg = (code, details={}, status) => {
  return { code, details, status };
};

module.exports = {
  defaultMsg,
  customMsg
}
