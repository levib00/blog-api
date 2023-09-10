module.exports = function (req, res, next) {
  res.clearCookie('connect.sid', {
    path: '/',
    signed: true,
    secure: true,
    httpOnly: false,
  });
  next();
};
