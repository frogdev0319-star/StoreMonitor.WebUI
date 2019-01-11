import request from '@/common/request'
export const getEventList=data=>{
    return request({
        url:'/event/list',
        method:'post',
        data
    })
}
export const addEvent=data=>{
    return request({
        url:'/event/add',
        method:'post',
        data
    })
}
export const addComment=data=>{
    return request({
        url:'/event/comment/add',
        method:'post',
        data
    })
}
export const getCommentList=data=>{
    return request({
        url:'/event/comment/list',
        method:'post',
        data
    })
}
export const getEventCount=data=>{
    return request({
        url:'/event/count',
        method:'post',
        data
    })
}