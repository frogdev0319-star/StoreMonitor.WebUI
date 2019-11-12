import request from '@/common/request'
import axios from 'axios'
import {Message} from "element-ui";
import i18n from '@/lang'

import Environment from '@/common/environment'
const version = Environment.VERSION;

export const getEzvizList=data=>{
  return request({
    url:`${version}/ezviz/device/list`,
    method:'post',
    data
  })
}
export const getEzvizChannelList =params=>{
  return request({
    url:`${version}/ezviz/device/channel/list`,
    method:'get',
    params
  })
}
export const addEzivzDevice =data=>{
  return request({
    url:`${version}/ezviz/device/add`,
    method:'post',
    data
  })
}
export const updateEzvizDevice=data=>{
  return request({
    url:`${version}/ezviz/device/update`,
    method:'post',
    data
  })
}
export const deleteEzivzDevice=data=>{
  return request({
    url:`${version}/ezviz/device/delete`,
    method:'post',
    data
  })
}
export const  getEzvizAccessToken=params=>{
  return request({
    url:`${version}/ezviz/token`,
    method:'get',
    params
  })
}

export const getEzvizAccountList=data=> {
  return request({
    url: `${version}/ezviz/account/list`,
    method: 'post',
    data
  })
}

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const instance = axios.create({
  baseURL: 'https://open.ys7.com/api/',
  timeout: 1000,
  withCredentials: false, // 默认的
  headers: {
    "Accept":"application/json",
    "Content-Type": "application/x-www-form-urlencoded"
  }
})
function getMsg() {
  let lang = i18n.locale;
  let msg = '';
  if(lang == 'zh'){
    msg = '无效的设备，请联系管理员';
  }
  else if(lang == 'en'){
    msg = 'Invalid device, please contact administrator';
  }
  else if(lang == 'zhtw'){
    msg = '無效的設備，請聯繫管理員';
  }
  else{
    msg = '无效的设备，请联系管理员';
  }
  return msg;
}
export async function getIsEncrypt(data){
  let ret=null;
  console.log(data)
  await instance({
    method: 'post',
    url: '/lapp/device/info',
    data: data,
  }).then(res=>{
    console.log(res)
    let data = res.data;
    if(data.code !== '200'){
      let msg = getMsg();
      Message({
        message: msg,
        type:'error',
        duration:5*1000
      })
    }
    else{
      ret = data.data.isEncrypt; //是否加密字段
    }
  }).catch((err) => {
    let msg = getMsg();
    Message({
      message: msg,
      type:'error',
      duration:5*1000
    })
  })
  return ret;
}
function getUpdatePasswordMsg(code){
  let lang = i18n.locale;
  let msg = '';
  switch (code) {
    case 10001:{
      switch (lang) {
        case 'zh':{
          msg = '参数错误';
          break;
        }
        case 'zhtw':{
          msg = '參數錯誤';
          break;
        }
        case 'en':{
          msg = 'Parameter error';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 10002:{
      switch (lang) {
        case 'zh':{
          msg = 'AccessToken异常或过期';
          break;
        }
        case 'zhtw':{
          msg = 'AccessToken異常或過期';
          break;
        }
        case 'en':{
          msg = 'AccessToken is abnormal or expired';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 10005:{
      switch (lang) {
        case 'zh':{
          msg = 'AppKey异常';
          break;
        }
        case 'zhtw':{
          msg = 'AppKey異常';
          break;
        }
        case 'en':{
          msg = 'AppKey exception';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 20002:{
      switch (lang) {
        case 'zh':{
          msg = '设备不存在';
          break;
        }
        case 'zhtw':{
          msg = '設備不存在';
          break;
        }
        case 'en':{
          msg = 'Device does not exist';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 20006:{
      switch (lang) {
        case 'zh':{
          msg = '网络异常';
          break;
        }
        case 'zhtw':{
          msg = '網絡異常';
          break;
        }
        case 'en':{
          msg = 'Network anomaly';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 20007:{
      switch (lang) {
        case 'zh':{
          msg = '设备不在线';
          break;
        }
        case 'zhtw':{
          msg = '設備不在線';
          break;
        }
        case 'en':{
          msg = 'Device is not online';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 20008:{
      switch (lang) {
        case 'zh':{
          msg = '设备响应超时';
          break;
        }
        case 'zhtw':{
          msg = '設備響應超時';
          break;
        }
        case 'en':{
          msg = 'Device response timeout';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 20010:{
      switch (lang) {
        case 'zh':{
          msg = '旧密码错误';
          break;
        }
        case 'zhtw':{
          msg = '舊密碼錯誤';
          break;
        }
        case 'en':{
          msg = 'Old password error';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 20018:{
      switch (lang) {
        case 'zh':{
          msg = '该用户不拥有该设备';
          break;
        }
        case 'zhtw':{
          msg = '該用戶不擁有該設備';
          break;
        }
        case 'en':{
          msg = 'This user does not own the device';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    case 60020:{
      switch (lang) {
        case 'zh':{
          msg = '该设备不支持修改密码';
          break;
        }
        case 'zhtw':{
          msg = '該設備不支持修改密碼';
          break;
        }
        case 'en':{
          msg = 'The device does not support change passwords';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
    default:{
      switch (lang) {
        case 'zh':{
          msg = '未知的错误';
          break;
        }
        case 'zhtw':{
          msg = '未知的錯誤';
          break;
        }
        case 'en':{
          msg = 'Unknown error';
          break;
        }
        default:{
          break;
        }
      }
      break;
    }
  }
}
/**
 * 设备加密，前台输入验证码，调用ezviz接口，查看验证码是否正确
 * @param data
 */
export async function updateDevicePassword(data){
  let ret = false;
  console.log(data)
  await instance({
    method: 'post',
    url: '/lapp/device/password/update',
    data: data,
  }).then(res=>{
    console.log(res)
    let data = res.data;
    let code = res.code;
    let msgCode = getUpdatePasswordMsg(code)
    if(data.code !== '200'){
      Message({
        message: msgCode,
        type:'error',
        duration:5*1000
      })
    }
    else{
      ret = true; //密码正确
    }
  }).catch((err) => {
    console.log(err);
    let msg = getMsg();
    Message({
      message: msg,
      type:'error',
      duration:5*1000
    })
  })
  return ret;
}

export async function getAccessToken(data){
  let ret=null;
  console.log(data)
  await instance({
    method: 'post',
    url: '/lapp/token/get',
    data: data,
  }).then(res=>{
    console.log(res)
    let data = res.data;
    ret =  res;
  }).catch((err) => {
  })
  return ret;
}

export const addEzvizAccount =data=>{
  return request({
    url:`${version}/ezviz/account/add`,
    method:'post',
    data
  })
}
export const updateEzvizAccount=data=>{
  return request({
    url:`${version}/ezviz/account/update`,
    method:'post',
    data
  })
}
export const deleteEzvizAccount=params=>{
  return request({
    url:`${version}/ezviz/account/delete`,
    method:'post',
    params
  })
}
