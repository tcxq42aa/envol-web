var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: '法棍阅读'});
});

router.get('/index', function (req, res, next) {
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

module.exports = router;
