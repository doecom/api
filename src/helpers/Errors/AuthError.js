module.exports = class AuthError extends Error {
  constructor(code, status) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
    this.status = status;
  }
};
