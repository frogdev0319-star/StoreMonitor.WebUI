import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;
// const version='v1.0';
export const getDashServerInfo = () => {
  return request({
    url: `${version}/device/dash/info`,
    method: 'get'
  });
};

export const addDashServer = data => {
  return request({
    url: `${version}/device/dash/add`,
    method: 'post',
    data
  });
};

export const upateDashServer = data => {
  return request({
    url: `${version}/device/dash/update`,
    method: 'post',
    data
  });
};

export const getNVRList = data => {
  return request({
    url: `${version}/device/nvr/list`,
    method: 'post',
    data
  });
};

export const addNVR = data => {
  return request({
    url: `${version}/device/nvr/add`,
    method: 'post',
    data
  });
};

export const deleteNVR = data => {
  return request({
    url: `${version}/device/nvr/delete`,
    method: 'post',
    data
  });
};

export const getDeviceList = params => {
  return request({
    url: `${version}/device/list`,
    method: 'get',
    params
  });
};

export const addDevice = data => {
  return request({
    url: `${version}/device/add`,
    method: 'post',
    data
  });
};

export const deleteDevice = data => {
  return request({
    url: `${version}/device/delete`,
    method: 'post',
    data
  });
};

export const updateDevice = data => {
  return request({
    url: `${version}/device/update`,
    method: 'post',
    data
  });
};

export const updateNVR = data => {
  return request({
    url: `${version}/device/nvr/update`,
    method: 'post',
    data
  });
};

export const attachImageToDevice = data => {
  return request({
    url: `${version}/device/attach/image`,
    method: 'post',
    data
  });
};
