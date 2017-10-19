/**
 * Created by charles on 2017/10/1.
 */
var express = require('express');
var router = express.Router();
var axios = require('axios')
var config = require('../config/app.config');
var wx = require('../service/wx');
var getAccessToken = require('../routes/index').getAccessToken;

router.put('/user/bind', function (req, res, next){
  console.log('PUT ' + config.serverHost + '/api/user/bind?mobilePhone=' + req.query.mobilePhone + '&openId=' + req.session.userInfo.openid)
  axios.put(config.serverHost + '/api/user/bind?mobilePhone=' + req.query.mobilePhone + '&openid=' + req.session.userInfo.openid).then((response)=>{
    console.log(response.data)
    wx.sendAppointmentMsg(getAccessToken(), req.session.userInfo)
    res.send(response.data)
  }).catch(function (error) {
    console.log({status: error.response.status, data: error.response.data});
    res.status(error.response.status).send(error.response.data)
  });
})

module.exports = router;
