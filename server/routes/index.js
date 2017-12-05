var express = require('express');
var router = express.Router();
var axios = require('axios')
var crypto = require('crypto');
var sha1 = require('sha1');
var querystring = require('querystring');
var config = require('../config/app.config');

/* GET home page. */
router.get(/^\/(land|index|plan|planDetail|uc|test|practice|practiceShare|read|appointment|enroll|testLand|testShare|paid|badge|wordList|handout|mailBox)?$/, function (req, res, next) {
  var redirectUrl = 'http://www.envol.vip' + req.path;
  if(querystring.stringify(req.query)) {
    redirectUrl += '?' + querystring.stringify(req.query);
  }

  if(!req.session.userInfo) {
    if(!req.query.code){
      var url = encodeURIComponent(redirectUrl)
      res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe073c9d18b45b0ca&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo#wechat_redirect')
      return;
    }
    var code = req.query.code;
    axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appid}&secret=${config.secret}&code=${code}&grant_type=authorization_code`).then(function(response){
      if(response.data.errcode) {
        console.log(response.data)
        res.render('invalid', {errcode: response.data.errcode});
        return
      }
      var access_token = response.data.access_token;
      var openid = response.data.openid;
      axios.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN').then(function(resp){
        if(resp.data.errcode) {
          console.log(resp.data)
          res.render('invalid', {errcode: resp.data.errcode});
          return
        }
        req.session.userInfo = resp.data;
        req.session.save();
        //
        axios.post(config.serverHost + 'api/user/subscribe', querystring.stringify(resp.data)).then((resp2)=>{
          console.log(resp2.data)
        }).catch(function (error) {
          console.log(error);
        });
        res.render('index', {title: '法棍阅读', userInfo: JSON.stringify(req.session.userInfo)});
      })
    })
  } else {
    console.log('openid=' + req.session.userInfo.openid)
    res.render(process.env.NODE_ENV == 'dev' ? 'index-dev' : 'index', {title: '法棍阅读', userInfo: JSON.stringify(req.session.userInfo || {})});
  }

});
/* GET user center page. */
router.all('/wx', function (req, res, next) {
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

router.get('/api/wx/signature', function(req, res, next){
  var q = req.query;
  var noncestr = 'ttp123';
  var jsapi_ticket = global.jsapi_ticket;
  var timestamp = Date.now();
  var url = q.url;
  var str = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  var signature = sha1(str);
  res.send({
    url: url,
    timestamp: timestamp,
    nonceStr: noncestr,
    signature: signature
  })
});

router.get('/accessToken', function (req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.send(global.access_token);
});
router.get('/api/accessToken', function (req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.send(encrypt(global.access_token));
});
router.get('/jsapiTicket', function (req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.send(global.jsapi_ticket);
});

setInterval(function(){
  getAccessToken(getJsapiTicket)
}, 7000000)

function getAccessToken(cb) {
  if(process.env.NODE_ENV=='dev') {
    axios.get('http://www.envol.vip/accessToken').then((res)=>{
      global.access_token = res.data;
      console.log('access_token=' + global.access_token);
      cb()
    });
  } else {
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`)
      .then(function (response) {
        global.access_token = response.data.access_token;
        console.log('access_token=' + global.access_token);
        cb()
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
function getJsapiTicket() {
  axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + global.access_token + '&type=jsapi')
    .then(function (response) {
      global.jsapi_ticket = response.data.ticket;
      console.log('jsapi_ticket=' + global.jsapi_ticket);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function encrypt(source) {
  var secret = 'jnl188**';
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(source, 'utf8', 'hex');//编码方式从utf-8转为hex;
  enc += cipher.final('hex');//编码方式从转为hex;
  //
  // var decipher = crypto.createDecipher('aes192', secret);
  // var dec = decipher.update(enc, 'hex', 'utf8');//编码方式从hex转为utf-8;
  // dec += decipher.final('utf8');//编码方式从utf-8;
  // console.log(dec);

  return enc;
}

getAccessToken(getJsapiTicket)

module.exports = router;
module.exports = {
  router,
  getAccessToken: ()=>{
    return global.access_token
  }
};
