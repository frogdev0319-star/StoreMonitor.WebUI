import axios from 'axios'
import qs from 'qs'

let base="https://api-sserver-wise-paas.wise-paas.com.cn/api/v1.0/";
const base_dev1="https://api-sserver-wise-paas-testnew.wise-paas.com.cn";
let itempath='/api/v1.0'
let base1="/api/api/v1.0/"
const API_PROXY = 'https://bird.ioliu.cn/v1/?url='
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// get the device list
export const getDeviceList=params=>{
    return axios.post(`${process.env.API_HOST}${itempath}/device/list`,params); 
};
//get the group list.
export const getCategorys=()=>{
    return axios.get(`${process.env.API_HOST}${itempath}/group/list`);
};
//获取二级分类
export const getSubCategory=(params)=>{
    console.log("get2cate");
    console.log(params);
    // return axios.get(`${base}/`,{params:params}).then(res=>res.data);
}
//根据分类筛选设备
export const getDeviceListByCategory=(params)=>{
    console.log("sel");
    console.log(params);
    //return axios.get(`${base}/`,{params:params}).then(res=>res.data);
}
//根据关键字查找
export const getDeviceListByKeywords=(params)=>{
    console.log("key");
    console.log(params);
     return axios.post(`${process.env.API_HOST}${itempath}/device/list`,params);
}
//获取电源状态范围
export const getPowerscope=(params)=>{
    return axios.get(`${process.env.API_HOST}${itempath}/power/scope`,{params:params}).then(res=>res.data);
}
//设置设备电源状态
export const doAction=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/power/action`,params).then(res=>res.data);
}
//获取外设信息
export const getExpandsInfo=(params)=>{
    return axios.get(`${process.env.API_HOST}${itempath}/data/realtime`,{params:params}).then(res=>res.data);
}
// 获取历史数据
export const getHistoryData=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/data/history`,params).then(res=>res.data);
}
//获取未分配设备数量
export const getUnassignDevice=()=>{
    return axios.get(`${process.env.API_HOST}${itempath}/device/unassign`).then(res=>res.data);
}
//获取异常设备信息
export const getExceptDeviceInfo=(params)=>{
    return axios.get(`${process.env.API_HOST}${itempath}/stats/realtime`,{params:params}).then(res=>res.data);
}
//get the event type list
export const getEventTypeList=()=>{
    return axios.get(`${process.env.API_HOST}${itempath}/event/type/list`).then(res=>res.data);
}
//get the event list
export const getEventList=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/event/list`,params).then(res=>res.data);
}
//get the state
export const getState=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/event/comment/list`,params).then(res=>res.data);
}
export const addComment=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/event/comment/add`,params).then(res=>res.data);
}

//start report

export const startReport=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/data/start_report`,params).then(res=>res.data);
}

//profile
export const getProFileList=()=>{
    return axios.get(`${process.env.API_HOST}${itempath}/profile/list`).then(res=>res.data);
}
export const addProFile=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/profile/add`,params).then(res=>res.data);
}
export const editProFile=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/profile/edit`,params).then(res=>res.data);
}
export const deleteProFile=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/profile/delete`,params).then(res=>res.data);
}
export const applyProFile=(params)=>{
    return axios.post(`${process.env.API_HOST}${itempath}/profile/apply`,params).then(res=>res.data);
}
export const getBindingList=()=>{
    return axios.post(`${process.env.API_HOST}${itempath}/profile/binding`).then(res=>res.data);
}