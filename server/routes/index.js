var express = require('express');
var router = express.Router();
var axios = require('axios')
var sha1 = require('sha1');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: '法棍阅读'});
});

/* GET user center page. */
router.get('/wx', function (req, res, next) {
  var q = req.query;
  var token = 'ttp123';
  var signature = q.signature; //微信加密签名
  var nonce = q.nonce; //随机数
  var timestamp = q.timestamp; //时间戳
  var echostr = q.echostr; //随机字符串
  /*
   1）将token、timestamp、nonce三个参数进行字典序排序
   2）将三个参数字符串拼接成一个字符串进行sha1加密
   3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
   */
  var str = [token, timestamp, nonce].sort().join('');
  var sha = sha1(str);
  if (req.method == 'GET') {

    if (sha == signature) {
      res.send(echostr + '')
    } else {
      res.send('err');
    }
  }
  else if (req.method == 'POST') {
    if (sha != signature) {
      return;
    }
    next();
  }
});

router.get('/accessToken', function (req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.send(access_token);
});

var access_token = {}
setInterval(function(){
  getAccessToken()
}, 7200000)

function getAccessToken() {
  axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe073c9d18b45b0ca&secret=fb227feb464e48179ea5da749df202cd')
    .then(function (response) {
      access_token = response.data.access_token;
      console.log('access_token=' + access_token);
    })
    .catch(function (error) {
      console.log(error);
    });
}

getAccessToken()

module.exports = router;
