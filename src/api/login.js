import request from '@/common/request'
import {serviceLogout} from '@/common/request'
import Environment from '@/common/environment'
const version = Environment.VERSION;

//const version='v1.0';
//account RESTful
export function loginByUsername(data){
    return request({
        url:`${version}/login`,
        method:'post',
        data
    })
}

export function logout(){
    return serviceLogout({
        url:`${version}/logout`,
        method:'post'
    })
}

export const getUserInfo=params=>{
    return request({
        url:`${version}/user/list`,
        method:'get',
        params
    })
}

export const getAccountList=()=>{
    return request({
        url:`${version}/user/account/list`,
        method:'get'
    })
}
export function isLoginIn(){
    return request({
        url:`${version}/islogin`,
        method:'post'
    })
}

export const changeAccount=params=>{
    return request({
        url:`${version}/user/change/account`,
        method:'post',
        params
    })
}
