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

export function getUserInfo(){
    return request({
        url:'/user/list',
        method:'get'
    })
}

export function isLoginIn(){
    return request({
        url:'/islogin',
        method:'post'
    })
}
