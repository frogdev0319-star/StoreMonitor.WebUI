import request from '@/common/request';
import { serviceAxios,serviceRpt } from '@/common/request';
const base = 'http://172.21.84.62:8085';
const itempath = '/storemonitor/api/v1.0';

import Environment from '@/common/environment';
const version = Environment.VERSION;
const version3 = 'v3.0';

export const getInspectGroupList = params => {
  return request({
    url: `${version}/inspect/group/list`,
    method: 'get',
    params
  });
};
export const getInspectItemList = params => {
  return request({
    url: `${version}/inspect/item/list`,
    method: 'get',
    params
  });
};
export const getInspectBindList = data => {
  return request({
    url: `${version}/inspect/store/bind/list`,
    method: 'post',
    data
  });
};

export const updateGroupWeight = data => {
  return request({
    url: `v1.0/inspect/group/updateWeight`,
    method: 'post',
    data
  });
};

export const addInspectGroup = data => {
  return request({
    url: `${version}/inspect/group/add`,
    method: 'post',
    data
  });
};

export const addInspectItem = data => {
  return request({
    url: `${version}/inspect/item/add`,
    method: 'post',
    data
  });
};

export const bindInspectItem = data => {
  return request({
    url: `${version}/inspect/item/bind`,
    method: 'post',
    data
  });
};

export const bindInspectItemV2 = data => {
  return request({
    url: `v2.0/inspect/item/bind`,
    method: 'post',
    data
  });
};

export const checkOutInspectItem = params => {
  return request({
    url: `${version}/inspect/checkout`,
    method: 'get',
    params
  });
};

export const checkOutInspectItemV3 = params => {
  return request({
    url: `v3.0/inspect/checkout`,
    method: 'get',
    params
  });
};

export const unbindInspectItemV2 = data => {
  return request({
    url: `v2.0/inspect/item/unbind`,
    method: 'post',
    data
  });
};

export const deleteInspectGroup = data => {
  return request({
    url: `${version}/inspect/group/delete`,
    method: 'post',
    data
  });
};

export const deleteInspectItem = data => {
  return request({
    url: `${version}/inspect/item/delete`,
    method: 'post',
    data
  });
};

export const deleteInspect = async(params1, params2) => {
  const item = await request({ url: `${base}${itempath}/inspect/item/delete`, method: 'post', data: params1 });
  const group = await request({ url: `${base}${itempath}/inspect/group/delete`, method: 'post', data: params2 });
  return [item, group];
};

export const submitInspectItem = data => {
  return request({
    url: `${version}/inspect/submit`,
    method: 'post',
    data
  });
};

export const unbindInspectItem = data => {
  return request({
    url: `${version}/inspect/item/ubind`,
    method: 'post',
    data
  });
};

export const updateInspectGroup = data => {
  return request({
    url: `${version}/inspect/group/update`,
    method: 'post',
    data
  });
};

export const updateInspectItem = data => {
  return request({
    url: `${version}/inspect/item/update`,
    method: 'post',
    data
  });
};

export const downLoadTemplate = () => {
  return serviceAxios({
    url: `${version}/inspect/template`,
    method: 'get'
  });
};

export const getInspectBindCount = data => {
  return request({
    url: `${version}/inspect/item/unbind/count`,
    method: 'post',
    data
  });
};

export const getInspectReportList = data => {
  return request({
    url: `${version}/inspect/report/list`,
    method: 'post',
    data
  });
};

export const getInspectReportInfo = data => {
  return request({
    url: `v5.0/inspect/report/info`,
    method: 'post',
    data
  });
};

export const submitInspectItem1 = data => {
  return request({
    url: `${version3}/inspect/submit`,
    method: 'post',
    data
  });
};

export const getInspectReportDetail = params => {
  return request({
    url: `v2.0/inspect/report/detail`,
    method: 'post',
    params
  });
};

export const BindInspectGroup = data => {
  return request({
    url: `${version}/inspect/group/bind`,
    method: 'post',
    data
  });
};

export const UnbindInspectGroupAndTitle = data => {
  return request({
    url: `${version}/inspect/group/unbind`,
    method: 'post',
    data
  });
};

export const GetInspectTagList = params => {
  return request({
    url: `${version}/inspect/tag/list`,
    method: 'get',
    params
  });
};
export const GetInspectTagListAll = params => {
  return request({
    url: `${version}/inspect/tag/listAll`,
    method: 'get',
    params
  });
};





export const GetMysteryInspectTagList = params => {
  return request({
    url: `${version}/mystery/inspect/tag/list`,
    method: 'get',
    params
  });
};

export const GetInspectGroupBindList = data => {
  return request({
    url: `${version}/inspect/group/bind/list`,
    method: 'post',
    data
  });
};

export const UpdateInspectGroupTag = data => {
  return request({
    url: `${version}/inspect/tag/update`,
    method: 'post',
    data
  });
};

export const UpdateInspectRuleSettings = data => {
  return request({
    url: `${version}/inspect/rule/update`,
    method: 'post',
    data
  });
};
export const GetInspectRuleSettings = params => {
  return request({
    url: `${version}/inspect/rules`,
    method: 'get',
    params
  });
};

export const bindInspectWithStore = data => {
  return request({
    url: `${version}/inspect/store/apply`,
    method: 'post',
    data
  });
}

export const getNotInspectStoresByPerson = data => {
  return request({
    url: `v1.0/statistics/inspect/store`,
    method: 'post',
    data
  });
};

export const downLoadInspectReportEntireDetail = data => {
  return serviceRpt({
    url: `${version}/inspect/report/export/entire/json`,
    method: 'post',
    data
  });
};

export const getAllReportIds = data => {
  return serviceRpt({
    url: `${version}/inspect/report/list/allReportIds`,
    method: 'post',
    data
  });
};




export const getInspectStatus = params => {
  return request({
    url: `${version}/general/setting/get`,
    method: 'get',
    params
  });
};


export const updateInspectStatus = data => {
  return request({
    // url: `${version}/general/setting/inspect/status/name/update`,
    url: `${version}/general/setting/update`,
    method: 'post',
    data
  });
}



