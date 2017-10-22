/**
 * Created by charles on 2017/10/1.
 */
var express = require('express');
var router = express.Router();
var axios = require('axios')
var config = require('../config/app.config');
var wx = require('../service/wx');
var getAccessToken = require('../routes/index').getAccessToken;

router.post('/userSemester/:semesterId/reservation', function (req, res, next){
  axios.post(config.serverHost + '/userSemester/' + req.params.semesterId + '/reservation?mobilePhone=' + req.query.mobilePhone + '&openid=' + req.session.userInfo.openid).then((response)=>{
    console.log('success', response.data)
    wx.sendAppointmentMsg(getAccessToken(), req.session.userInfo)
    res.send(response.data)
  }).catch(function (error) {
    console.log('error', {status: error.response.status, data: error.response.data});
    res.status(error.response.status).send(error.response.data)
  });
})

module.exports = router;
