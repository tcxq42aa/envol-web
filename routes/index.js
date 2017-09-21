var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'ENVOL'});
});

/* GET user center page. */
router.get('/uc', function (req, res, next) {
  res.render('uc', {title: 'ENVOL'});
});

/* GET help page. */
router.get('/help', function (req, res, next) {
  res.render('help', {title: 'ENVOL'});
});

/* GET setting page. */
router.get('/setting', function (req, res, next) {
  res.render('setting', {title: 'ENVOL'});
});

/* GET teacher page. */
router.get('/teacher', function (req, res, next) {
  res.render('teacher', {title: 'ENVOL'});
});

module.exports = router;
