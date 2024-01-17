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

