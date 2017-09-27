var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: '法棍阅读'});
});

/* GET plan page. */
router.get('/plan', function (req, res, next) {
  res.render('plan', {title: '法棍阅读'});
});

/* GET user center page. */
router.get('/uc', function (req, res, next) {
  res.render('uc', {title: '法棍阅读'});
});

/* GET help page. */
router.get('/help', function (req, res, next) {
  res.render('help', {title: '法棍阅读'});
});

/* GET setting page. */
router.get('/setting', function (req, res, next) {
  res.render('setting', {title: '法棍阅读'});
});

/* GET teacher page. */
router.get('/teacher', function (req, res, next) {
  res.render('teacher', {title: '法棍阅读'});
});

module.exports = router;
