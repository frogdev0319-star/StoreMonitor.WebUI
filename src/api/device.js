import request from '@/common/request'

export const getDashServerInfo=()=>{
    return request({
        url:'/device/dash/info',
        method:'get'
    })
}
export const addDashServer=data=>{
    return request({
        url:'/device/dash/add',
        method:'post',
        data
    })
}

export const upateDashServer=data=>{
    return request({
        url:'/device/dash/update',
        method:'post',
        data
    })
}

export const getNVRList=data=>{
    return request({
        url:'/device/nvr/list',
        method:'post',
        data
    })
}
export const addNVR=data=>{
    return request({
        url:'/device/nvr/add',
        method:'post',
        data
    })
}
export const deleteNVR=data=>{
    return request({
        url:'/device/nvr/delete',
        method:'post',
        data
    })
}

export const getDeviceList=params=>{
    return request({
        url:'/device/list',
        method:'get',
        params
    })
}
export const addDevice=data=>{
    return request({
        url:'/device/add',
        method:'post',
        data
    })
}
export const deleteDevice=data=>{
    return request({
        url:'/device/delete',
        method:'post',
        data
    })
}
export const updateDevice=data=>{
    return request({
        url:'/device/update',
        method:'post',
        data
    })
}