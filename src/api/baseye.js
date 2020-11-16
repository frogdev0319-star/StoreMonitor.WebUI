import request from '@/common/request'
import Environment from '@/common/environment'
import * as axios from "axios";
import {getToken} from "@/common/auth.js";

const version = Environment.VERSION;

const VCAMID = "93aed0a82f284c9884c1956121db809f"
const DD = "{Web}_{YH-EXTERNAL}_{97557807-1149-4004-8e92-91c344539ded}";

let baseUrl = Environment.BASE_URL;

export const getStreamInfo = params=>{
  return request({
    url:`${version}/beseye/stream/info`,
    method:'get',
    params
  })
}
export const getBeseyeAccessToken = params =>{
  return request({
    url:`${version}/beseye/token`,
    method:'get',
    params
  })
}
const instance = axios.create({
  baseURL: 'http://104.199.172.143/api/',
  timeout: 10000,
  headers: {
    "Accept":"application/json",
  }
})
export const getStreamInfoFromTW = params =>{
  return instance({
    url:`beseye/streamInfo`,
    method:'get',
    params
  })
}

export const getBeseyeList = data =>{
  return request({
    url: `${version}/beseye/device/list`,
    method:'post',
    data
  })
}

export const addBeseyeDevice = data=>{
  return request({
    url: `${version}/beseye/device/add`,
    method:'post',
    data
  })
}
export const updateBeseyeDevice = data =>{
  return request({
    url: `${version}/beseye/device/update`,
    method:'post',
    data
  })
}
export const deleteBeseyeDevice = params =>{
  return request({
    url: `${version}/beseye/device/delete`,
    method:'post',
    params
  })
}
