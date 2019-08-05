import request from '@/common/request'
const version='v1.0';

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
