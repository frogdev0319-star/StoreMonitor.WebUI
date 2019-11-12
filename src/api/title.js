import request from '@/common/request'
import Environment from '@/common/environment'
const version = Environment.VERSION;

export const addUserTitle=data=>{
  return request({
    url:`${version}/auth/title/add`,
    method:'post',
    data
  })
}

export const getUserTitleList=data=>{
  return request({
    url:`${version}/auth/title/list`,
    method:'get',
    data
  })
}
export const getRoleInfo=data=>{
  return request({
    url:`${version}/auth/role/list`,
    method:'get',
    data
  })
}
export const deleteTitle=data=>{
  return request({
    url:`${version}/auth/title/delete`,
    method:'post',
    data
  })
}

export const updateUserTitle=data=>{
  return request({
    url:`${version}/auth/title/update`,
    method:'post',
    data
  })
}
