import request from '@/common/request';
import Environment from '@/common/environment';
import { getToken } from '@/common/auth.js';

const version = Environment.VERSION;

export const getSkywatchAccountList = params => {
  return request({
    url: `${version}/skywatch/account/list`,
    method: 'post',
    params
  })
};

export const deleteSkywatchAccount = data => {
  return request({
    url: `${version}/skywatch/account/delete`,
    method: 'post',
    data
  });
};

export const skywatchAccountAuthorize = params => {
  return request({
    url: `${version}/skywatch`,
    method: 'get',
    params
  })
};



export const getSkywatchDeviceList = data => {
  return request({
    url: `${version}/skywatch/device/list`,
    method: 'post',
    data
  });
};

export const getAvailableSkywatchDevice = params => {
  return request({
    url: `${version}/skywatch/device/unused/list`,
    method: 'get',
    params
  })
};

export const deleteSkywatchDevice = data => {
  return request({
    url: `${version}/skywatch/device/delete`,
    method: 'post',
    data
  });
};

export const deleteSkywatchChannel = data => {
  return request({
    url: `${version}/skywatch/device/channel/delete`,
    method: 'post',
    data
  });
};


export const addSkywatchDevice = data => {
  return request({
    url: `${version}/skywatch/device/add`,
    method: 'post',
    data
  });
};

export const addSkywatchChannel = data => {
  return request({
    url: `${version}/skywatch/device/channel/add`,
    method: 'post',
    data
  });
};


export const getBeseyeAccessToken = params => {
  return request({
    url: `${version}/beseye/token`,
    method: 'get',
    params
  });
};


export const updateBeseyeDevice = data => {
  return request({
    url: `${version}/beseye/device/update`,
    method: 'post',
    data
  });
};


export const getPlaylistInfo = params => {
  return request({
    url: `${version}/beseye/playlist`,
    method: 'get',
    params
  });
};




export const updateBeseyeChannel = data => {
  return request({
    url: `${version}/beseye/device/channel/update`,
    method: 'post',
    data
  });
}
