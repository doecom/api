module.exports = class CustomError extends Error {
  constructor(code, status) {
    super(code);
    this.name = 'CustomError';
    this.code = code;
    this.status = status;
  }
};
