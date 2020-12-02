import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const getEventList = data => {
  return request({
    url: `${version}/event/list`,
    method: 'post',
    data
  });
};

export const addEvent = data => {
  return request({
    url: `${version}/event/add`,
    method: 'post',
    data
  });
};

export const addComment = data => {
  return request({
    url: `${version}/event/comment/add`,
    method: 'post',
    data
  });
};

export const getCommentList = data => {
  return request({
    url: `${version}/event/comment/list`,
    method: 'post',
    data
  });
};

export const getEventCount = data => {
  return request({
    url: `${version}/event/count`,
    method: 'post',
    data
  });
};

export const getStorageInfo = params => {
  return request({
    url: `${version}/storage/info`,
    method: 'get',
    params
  });
};

export const GetEventCountByStatus = data => {
  return request({
    url: `${version}/event/count/status`,
    method: 'post',
    data
  });
};
