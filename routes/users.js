const express = require('express');
const passport = require('passport');
require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/log-in', passport.authenticate('local', {
  failureMessage: true,
}), (req, res) => {
  jwt.sign({ user: req.user }, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      res.send(err);
    }
    res.json({ token });
  });
});

router.post('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      return res.send('Logged out');
    });
  });
});

module.exports = router;
