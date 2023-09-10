const express = require('express');
const passport = require('passport');
require('cookie-parser');
const makeCookie = require('../middleware/makeCookie');
const deleteCookie = require('../middleware/deleteCookie');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.IsAuthenticated);

router.post('/log-in', makeCookie, passport.authenticate('local', {
  failureMessage: true,
}), (req, res) => {
  res.send('Cookie created');
});

router.post('/log-out', deleteCookie, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  });
});

module.exports = router;
