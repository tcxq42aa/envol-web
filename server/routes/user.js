/**
 * Created by charles on 2017/10/1.
 */
var express = require('express');
var router = express.Router();
var axios = require('axios')
var config = require('../config/app.' + (process.env.NODE_ENV || 'prod') + '.config');
var wx = require('../service/wx');
var getAccessToken = require('../routes/index').getAccessToken;

router.post('/:semesterId/reservation', function (req, res, next){
  axios.post(config.serverHost + '/api/userSemester/' + req.params.semesterId + '/reservation?mobilePhone=' + req.query.mobilePhone + '&openId=' + req.session.userInfo.openid).then((response)=>{
    console.log('success', response.status)
    // wx.sendAppointmentMsg(getAccessToken(), req.session.userInfo)
    res.send({status: response.status})
  }).catch(function (error) {
    var status = error.response.status;
    var message = '';
    console.log('error', {status: error.response.status, data: error.response.data});
    if(status == 404) {
      message = '该课程还未开始预约～';
    }
    if(status == 403) {
      message = '当前有一个正在学习中的课程';
    }
    if(status == 417) {
      message = '预约失败啦～';
    }
    res.send({status: status, message: message})
  });
})

module.exports = router;
