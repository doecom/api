module.exports = class RequestError extends Error {
  constructor(code, status) {
    super(code);
    this.name = 'RequestError';
    this.code = code;
    this.status = status;
  }
};
