import request from '@/common/request'

export function loginByUsername(data){
    return request({
        url:'/login',
        method:'post',
        data
    })
}

export function logout(){
    return request({
        url:'/logout',
        method:'post'
    })
}

export function getUserInfo(token){
    return request({
        url:'/user/info',
        method:'get',
        params:{token}
    })
}