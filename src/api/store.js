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

export const getFavoriteList=params=>{
    return request({
        url:'/store/favorite/list',
        method:'get',
        params
    })
}

export const addFavoriteStore=data=>{
    return request({
        url:'/favorite/add',
        method:'post',
        data
    }) 
}

export const deleteFavoriteStore=data=>{
    return request({
        url:'/favorite/delete',
        method:'post',
        data
    }) 
}