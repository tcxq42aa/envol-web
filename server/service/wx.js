/**
 * Created by charles on 2017/10/4.
 */
var axios = require('axios')
var config = require('../config/app.config');

const sendTemplateMsg = (access_token, openid, templateId, data, url)=>{
  var payload = {
    touser: openid,
    template_id: templateId,
    data: data
  }
  return axios.post(config.wxHost + 'message/template/send?access_token=' + access_token, payload)
}

const sendAppointmentMsg = (access_token, userinfo)=>{
  let data = {
    "first": {
      "value":"您的预约我们已收到，现正处理正式预约单据，请耐心等候。",
      "color":"#173177"
    },
    "keyword1":{
      "value":userinfo.nickname,
      "color":"#173177"
    },
    "keyword2": {
      "value":Date.now(),
      "color":"#173177"
    },
    "remark": {
      "value":"感谢您的预约。",
      "color":"#173177"
    }
  }
  return sendTemplateMsg(access_token, userinfo.openid, 'VYoezlNQ-HRRAUzibbEMRrZ7N11lMy52fHgks3rpdXU', data)
}

module.exports = {
  sendAppointmentMsg: sendAppointmentMsg
};
