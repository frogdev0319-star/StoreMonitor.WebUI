import request from '@/common/request'
export const getStoreList=data=>{
    return request({
        url:'/store/list',
        method:'post',
        data
    })
}