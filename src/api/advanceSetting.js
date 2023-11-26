import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const advancedFetch = data => {
  return request({
    url: `${version}/system/advanced/fetch/content`,
    method: 'post',
    data
  });
};
export const advancedUpdate = data => {
  return request({
    url: `${version}/system/advanced/update/content`,
    method: 'post',
    data
  });
};


export const sendImmediateEvent = data => {
  return request({
    url: `${version}/instant/notify/event/send`,
    method: 'post',
    data
  });
};



export const getImmediateEventTable = data => {
  return request({
    url: `${version}/instant/notify/event/fetch`,
    method: 'post',
    data
  });
};
export const getImmediateTaskTable = data => {
  return request({
    url: `${version}/instant/notify/task/fetch`,
    method: 'post',
    data
  });
};