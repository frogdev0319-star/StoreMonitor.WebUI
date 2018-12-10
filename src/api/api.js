import axios from 'axios'
import qs from 'qs'

import Nape from '@/api/ApiPath'

let base="http://172.21.81.160:8085/storemonitor/";
let itempath='api/v1.0/'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// get the device list

export const getNapeList=()=>{
    return axios.get(Nape.getNapeList,{},(res)=>{
        console.log('接收到数据了吗?');
        console.log(res);
    })
}
export const getGroupList=()=>{
    return axios.get(Nape.getNapeList).then(res=>res.data);
}
export const getStoreList1=()=>{
    return axios.get(Nape.getStoreList).then(res=>res.data);
}

//巡检项模块api
export const getInspectGroupList=params=>{
    return axios.get(`${base}${itempath}/inspect/group/list`,params); 
};
export const getInspectItemList=params=>{
    return axios.get(`${base}${itempath}/inspect/item/list`,params); 
}
export const getInspectBindList=params=>{
    return axios.post(`${base}${itempath}/inspect/item/bind/list`,params); 
}
export const addInspectGroup=params=>{
    return axios.post(`${base}${itempath}/inspect/group/add`,params); 
}
export const addInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/add`,params); 
}
export const applyItemInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/apply`,params);
}
export const bindInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/bind`,params);
} 
export const checkOutInspectItem=params=>{
    return axios.get(`${base}${itempath}/inspect/checkout`,params);
}
export const deleteInspectGroup=params=>{
    return axios.post(`${base}${itempath}/inspect/group/delete`,params);
}
export const deleteInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/delete`,params);
}
export const submitInspectItem=params=>{
    return axios.get(`${base}${itempath}/inspect/submit`,params);
}
export const unbindInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/ubind`,params);
}
export const updateInspectGroup=params=>{
    return axios.post(`${base}${itempath}/inspect/group/update`,params);
}
export const updateInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/update`,params);
}

//门店管理模块api

export const getStoreList=params=>{
    return axios.post(`${base}${itempath}/store/list`,params);
}

//设备管理模块api

export const getDashServerInfo=()=>{
    return axios.get(`${base}${itempath}/device/dash/info`);
}
export const addDashServer=params=>{
    return axios.post(`${base}${itempath}/device/dash/add`,params);
}

export const upateDashServer=params=>{
    return axios.post(`${base}${itempath}/device/dash/update`,params);
}
export const getNVRList=params=>{
    return axios.post(`${base}${itempath}/device/nvr/list`,params);
}
export const addNVR=params=>{
    return axios.post(`${base}${itempath}/device/nvr/add`,params);
}
export const deleteNVR=params=>{
    return axios.post(`${base}${itempath}/device/nvr/delete`,params);
}

export const getDeviceList=()=>{
    return axios.get(`${base}${itempath}/device/list`);
}
export const addDevice=params=>{
    return axios.post(`${base}${itempath}/device/add`,params);
}
export const deleteDevice=params=>{
    return axios.post(`${base}${itempath}/device/delete`,params);
}
export const updateDevice=params=>{
    return axios.post(`${base}${itempath}/device/update`,params);
}
export const deleteNVRandChannel=(params1,params2)=>{
    return axios.all([
        axios.post(`${base}${itempath}/device/delete`,params1),
        axios.post(`${base}${itempath}/device/nvr/delete`,params2)
    ]);
}
export const addNVRandChannel=(params1,params2)=>{
    return axios.all([
        axios.post(`${base}${itempath}/device/nvr/add`,params1),
        axios.post(`${base}${itempath}/device/add`,params2)
    ]);
}