import request from '@/common/request'
import Environment from '@/common/environment'
const version = Environment.VERSION;
//const version='v1.0';
export const getStoreList=data=>{
    return request({
        url:`${version}/store/list`,
        method:'post',
        data
    })
}

export const getBriefStoreList=data=>{
    return request({
        url:`${version}/store/brief/list`,
        method:'get',
        data
    })
}

export const GetTagList=data=>{
    return request({
        url:`${version}/tag/list`,
        method:'get',
        data
    })
}

export const updateStoreInfo=data=>{
    return request({
        url:`${version}/store/update`,
        method:'post',
        data
    })
}

export const getFavoriteList=params=>{
    return request({
        url:`${version}/store/favorite/list`,
        method:'get',
        params
    })
}

export const addFavoriteStore=data=>{
    return request({
        url:`${version}/favorite/add`,
        method:'post',
        data
    })
}

export const deleteFavoriteStore=data=>{
    return request({
        url:`${version}/favorite/delete`,
        method:'post',
        data
    })
}

export const getVideoAuthority=()=>{
  return request({
    url: `${version}/auth/video`,
    method: 'get'
  })
}
