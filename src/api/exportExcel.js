import request from '@/common/request';
import { serviceAxios,serviceRpt } from '@/common/request';
const base = 'http://172.21.84.62:8085';
const itempath = '/storemonitor/api/v1.0';

import Environment from '@/common/environment';
const version = Environment.VERSION;
const version3 = 'v3.0';


export const getDownloadList = data => {
  return request({
    url: `v1.0/download/request/list`,
    method: 'post',
    data
  });
};


// [1001]
export const exportEntireJson = data => {
  return request({
    url: `v1.0/download/request/report/export/entire/json`,
    method: 'post',
    data
  });
};

// [1002]
export const exportReportList = data => {
  return request({
    url: `v1.0/download/request/report/list`,
    method: 'post',
    data
  });
};

// [1003]
export const exportEntireJsonUnit = data => {
  return request({
    url: `v1.0/download/request/report/export/entire/json/unit`,
    method: 'post',
    data
  });
};

// [2001 - 2005]
export const exportEventList = data => {
  return request({
    url: `v1.0/download/request/event/list`,
    method: 'post',
    data
  });
};

// [3001 - 3003]
export const exportStatisticsReport = data => {
  return request({
    url: `v1.0/download/request/statistics/inspect/report/group/overview`,
    method: 'post',
    data
  });
};

// [4001]
export const exportStatisticsInspectItemOverview = data => {
  return request({
    url: `v1.0/download/request/statistics/inspect/item/group/overview`,
    method: 'post',
    data
  });
};

// [5001]
export const exportStatisticsPerson = data => {
  return request({
    url: `v1.0/download/request/statistics/inspect/report/person`,
    method: 'post',
    data
  });
};
// [5002]
export const exportStatisticsReportList = data => {
  return request({
    url: `v1.0/download/request/statistics/inspect/report/list`,
    method: 'post',
    data
  });
};
// [5003]
export const exportStatisticsEventComment= data => {
  return request({
    url: `v1.0/download/request/statistics/event/list/comment`,
    method: 'post',
    data
  });
};


// [6001]
export const exportStatisticsEventGroup= data => {
  return request({
    url: `v1.0/download/request/statistics/event/group`,
    method: 'post',
    data
  });
};
// [6002]
export const exportStatisticsInspectOverview= data => {
  return request({
    url: `v1.0/download/request/statistics/inspect/item/overview`,
    method: 'post',
    data
  });
};
// [6003]
export const exportStatisticsInspectStore= data => {
  return request({
    url: `v1.0//download/request/statistics/inspect/item/store`,
    method: 'post',
    data
  });
};


// [7003]
export const exportScheduleRecord= data => {
  return request({
    url: `v1.0/download/request/schedule/record/list/export`,
    method: 'post',
    data
  });
};
