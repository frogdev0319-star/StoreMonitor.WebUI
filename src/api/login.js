import request from '@/common/request'
import {serviceLogout} from '@/common/request'
//account RESTful 
export function loginByUsername(data){
    return request({
        url:'/login',
        method:'post',
        data
    })
}

export function logout(){
    return serviceLogout({
        url:'/logout',
        method:'post'
    })
}

export const getUserInfo=params=>{
    return request({
        url:'/user/list',
        method:'get',
        params
    })
}

export const getAccountList=()=>{
    return request({
        url:'/user/account/list',
        method:'get'
    })
}
export function isLoginIn(){
    return request({
        url:'/islogin',
        method:'post'
    })
}

export const changeAccount=params=>{
    return request({
        url:'/user/change/account',
        method:'post',
        params
    })
}