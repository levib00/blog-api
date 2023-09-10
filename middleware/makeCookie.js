module.exports = function (req, res, next) {
  res.cookie('connect.sid', req.sessionID, {
    path: '/',
    signed: true,
    secure: true,
    httpOnly: false,
  });
  next();
};
