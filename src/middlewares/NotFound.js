module.exports = (req, res, next) =>
  res.status(404).json({error: {message: 'Sorry cant find that!', code: "NOT_FOUND"}});
