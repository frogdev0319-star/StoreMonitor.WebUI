import request from '@/common/request'
export const getStoreList=data=>{
    return request({
        url:'/store/list',
        method:'post',
        data
    })
}

export const updateStoreInfo=data=>{
    return request({
        url:'/store/update',
        method:'post',
        data
    })
}