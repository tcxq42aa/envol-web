/**
 * Created by charles on 2017/10/1.
 */
var express = require('express');
var router = express.Router();
var axios = require('axios')
var config = require('../config/app.config');

router.post('/user/subscribe', function (req, res, next){
  axios.post(config.serverHost + '/api/user/subscribe', req.body).then((response)=>{
    console.log(response.data)
    res.send(response.data)
  }).catch(function (error) {
    console.log(error);
    res.send(error)
  });
})

router.put('/user/bind', function (req, res, next){
  axios.put(config.serverHost + '/api/user/bind?mobilePhone=' + req.query.mobilePhone + '&openId=' + req.session.userInfo.openid).then((response)=>{
    console.log(response.data)
    res.send(response.data)
  }).catch(function (error) {
    console.log({status: error.response.status, data: error.response.data});
    res.send({status: error.response.status, data: error.response.data})
  });
})

module.exports = router;
