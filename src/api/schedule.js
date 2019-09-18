import request from '@/common/request'
import Environment from '@/common/environment'
const version = Environment.VERSION;
//const version='v1.0';
export const getScheduleBindList=params=>{
  return request({
    url:`${version}/schedule/bind/list`,
    method:'get',
    params
  })
}

export const addNewSchedule=data=>{
  return request({
    url:`${version}/schedule/add`,
    method:'post',
    data
  })
}

export const getScheduleListService=params=>{
  return request({
    url:`${version}/schedule/list`,
    method:'get',
    params
  })
}

export const bindScheduleAndStore=data=>{
  return request({
    url:`${version}/schedule/bind`,
    method:'post',
    data
  })
}

export const unbindScheduleAndStore=data=>{
  return request({
    url:`${version}/schedule/unbind`,
    method:'post',
    data
  })
}

export const updateSchedule=data=>{
  return request({
    url:`${version}/schedule/update`,
    method:'post',
    data
  })
}

export const deleteScheduleService=data=>{
  return request({
    url:`${version}/schedule/delete`,
    method:'post',
    data
  })
}
