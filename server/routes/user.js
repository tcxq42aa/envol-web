/**
 * Created by charles on 2017/10/1.
 */
var express = require('express');
var router = express.Router();
var axios = require('axios')
var config = require('../config/app.config');
var wx = require('../service/wx');
var getAccessToken = require('../routes/index').getAccessToken;

router.post('/:semesterId/reservation', function (req, res, next){
  axios.post(config.serverHost + '/api/userSemester/' + req.params.semesterId + '/reservation?mobilePhone=' + req.query.mobilePhone + '&openId=' + req.session.userInfo.openid).then((response)=>{
    console.log('success', response.status)
    wx.sendAppointmentMsg(getAccessToken(), req.session.userInfo)
    res.send({code: 1})
  }).catch(function (error) {
    console.log('error', {status: error.response.status, data: error.response.data});
    res.send({code: 0})
  });
})

module.exports = router;
