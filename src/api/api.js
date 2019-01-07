import axios from 'axios'
import qs from 'qs'
import axiosFile from 'axios'
import Nape from '@/api/ApiPath'

//let base='http://'+window.location.host;
//let base ="http://172.21.84.62:8085";
let base ='http://172.21.81.206:8085';
let itempath='/storemonitor/api/v1.0'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
export const getBaseURL=()=>{
    let baseUrl='http://'+window.location.host;
    return baseUrl;
}
// get the device list
axiosFile.defaults.headers.post['Content-Type']='multipart/form-data';
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
    return axios.get(`${base}${itempath}/inspect/checkout`,{params,params});
}
export const deleteInspectGroup=params=>{
    return axios.post(`${base}${itempath}/inspect/group/delete`,params);
}
export const deleteInspectItem=params=>{
    return axios.post(`${base}${itempath}/inspect/item/delete`,params);
}
export const deleteInspect=async (params1,params2)=>{
    const item=await axios.post(`${base}${itempath}/inspect/item/delete`,params1);
    const group=await axios.post(`${base}${itempath}/inspect/group/delete`,params2);
    return [item,group]
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
export const getTemplate=()=>{
    return axios.get(`${base}${itempath}/inspect/template`);
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
export const getDeviceByStore=params=>{
    return axios.get(`${base}${itempath}/device/list`,{'params': params});
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
export const deleteNVRandChannel=async (params1,params2)=>{
    const item=await axios.post(`${base}${itempath}/device/delete`,params1);
    const group=await axios.post(`${base}${itempath}/device/nvr/delete`,params2);
    return [item,group]
}

export const addNVRandChannel=(params1,params2)=>{
    return axios.all([
        axios.post(`${base}${itempath}/device/nvr/add`,params1),
        axios.post(`${base}${itempath}/device/add`,params2)
    ]);
}

//事件管理api
export const getEventList=(params)=>{
    return axios.post(`${base}${itempath}/event/list`,params);
}
export const addEvent=params=>{
    return axios.post(`${base}${itempath}/event/add`,params);
}
export const addComment=params=>{
    return axios.post(`${base}${itempath}/event/comment/add`,params);
}
export const getCommentList=params=>{
    return axios.post(`${base}${itempath}/event/comment/list`,params);
}


export const loginByUser=params=>{
    return axios.post(`${base}${itempath}/login`,params);
}