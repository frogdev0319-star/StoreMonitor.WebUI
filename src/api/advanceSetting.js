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


export const sendImmediateBroadcast = data => {
  return request({
    url: `${version}/instant/notify/broadcast/send`,
    method: 'post',
    data
  });
};
export const sendImmediateTask = data => {
  return request({
    url: `${version}/instant/notify/task/send`,
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


export const getImmediateBroadcastTable = data => {
  return request({
    url: `${version}/instant/notify/broadcast/fetch`,
    method: 'post',
    data
  });
};
export const getImmediateBroadcastReadStatus = data => {
  return request({
    url: `${version}/instant/notify/broadcast/read/status`,
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
export const getImmediateTaskReadStatus = data => {
  return request({
    url: `${version}/instant/notify/task/read/status`,
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
export const getImmediateEventReadStatus = data => {
  return request({
    url: `${version}/instant/notify/event/read/status`,
    method: 'post',
    data
  });
};



