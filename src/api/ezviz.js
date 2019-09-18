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
    if(data.code !== '200'){
      Message({
        message: data.msg,
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
