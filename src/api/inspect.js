import request from '@/common/request'
import {serviceAxios} from '@/common/request'
let base ="http://172.21.84.62:8085";
let itempath='/storemonitor/api/v1.0'
const version='v1.0';
const version2='v2.0';
//巡检项模块api
export const getInspectGroupList=params=>{
    return request({
        url:`${version}/inspect/group/list`,
        method:'get',
        params
    })
};
export const getInspectItemList=params=>{
    return request({
        url:`${version}/inspect/item/list`,
        method:'get',
        params
    })
}
export const getInspectBindList=data=>{
    return request({
        url:`${version}/inspect/item/bind/list`,
        method:'post',
        data
    })
}
export const addInspectGroup=data=>{
    return request({
        url:`${version}/inspect/group/add`,
        method:'post',
        data
    })
}
export const addInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/add`,
        method:'post',
        data
    })
}
export const applyItemInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/apply`,
        method:'post',
        data
    })
}
export const UnapplyInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/unapply`,
        method:'post',
        data
    })
}

export const bindInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/bind`,
        method:'post',
        data
    })
} 
export const checkOutInspectItem=params=>{
    return request({
        url:`${version}/inspect/checkout`,
        method:'get',
        params
    })
}
export const deleteInspectGroup=data=>{
    return request({
        url:`${version}/inspect/group/delete`,
        method:'post',
        data
    })
}
export const deleteInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/delete`,
        method:'post',
        data
    })
}
export const deleteInspect=async (params1,params2)=>{
    const item=await request({url:`${base}${itempath}/inspect/item/delete`,method:'post',data:params1});
    const group=await request({url:`${base}${itempath}/inspect/group/delete`,method:'post',data:params2});
    return [item,group]
}

export const submitInspectItem=data=>{
    return request({
        url:`${version}/inspect/submit`,
        method:'post',
        data
    })
}
export const unbindInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/ubind`,
        method:'post',
        data
    })
}
export const updateInspectGroup=data=>{
    return request({
        url:`${version}/inspect/group/update`,
        method:'post',
        data
    })
}
export const updateInspectItem=data=>{
    return request({
        url:`${version}/inspect/item/update`,
        method:'post',
        data
    })
}
export const downLoadTemplate=()=>{
    return serviceAxios({
        url:`${version}/inspect/template`,
        method:'get'
    })
}
export const getInspectBindCount=data=>{
    return request({
        url:`${version}/inspect/item/unbind/count`,
        method:'post',
        data
    })
}
export const getInspectReportList=data=>{
    return request({
        url:`${version}/inspect/report/list`,
        method:'post',
        data
    })
}

export const getInspectReportInfo=data=>{
    return request({
        url:`${version2}/inspect/report/info`,
        method:'post',
        data
    })
}
export const submitInspectItem1=data=>{
    return request({
        url:`${version2}/inspect/submit`,
        method:'post',
        data
    })
}
