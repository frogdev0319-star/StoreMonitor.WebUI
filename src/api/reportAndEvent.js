import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const fetchLog = data => {
  return request({
    url: `${version}/system/advanced/log/fetch`,
    method: 'post',
    data
  });
};

export const handleEventStatus = data => {
  return request({
    url: `${version}/system/advanced/event/update`,
    method: 'post',
    data
  });
};


export const deleteReport = data => {
  return request({
    url: `${version}/system/advanced/report/delete`,
    method: 'post',
    data
  });
};