import request from '@/common/request';
import Environment from '@/common/environment';
import * as axios from 'axios';
import { getToken } from '@/common/auth.js';

const version = Environment.VERSION;

const VCAMID = '93aed0a82f284c9884c1956121db809f';
const DD = '{Web}_{YH-EXTERNAL}_{97557807-1149-4004-8e92-91c344539ded}';

const baseUrl = Environment.BASE_URL;

export const getStreamInfo = params => {
  return request({
    url: `${version}/beseye/stream/info`,
    method: 'get',
    params
  });
};

export const getBeseyeAccessToken = params => {
  return request({
    url: `${version}/beseye/token`,
    method: 'get',
    params
  });
};

export const getBeseyeDeviceList = data => {
  return request({
    url: `${version}/beseye/device/list`,
    method: 'post',
    data
  });
};

export const addBeseyeDevice = data => {
  return request({
    url: `${version}/beseye/device/add`,
    method: 'post',
    data
  });
};
export const updateBeseyeDevice = data => {
  return request({
    url: `${version}/beseye/device/update`,
    method: 'post',
    data
  });
};

export const deleteBeseyeDevice = data => {
  return request({
    url: `${version}/beseye/device/delete`,
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

export const getBeseyeUserList = params => {
  return request({
    url: `${version}/beseye/account/list`,
    method: 'post',
    params
  })
}

export const deleteBeseyeUser = data => {
  return request({
    url: `${version}/beseye/account/delete`,
    method: 'post',
    data
  });
}

export const beseyeAccountAuthorize = data => {
  return request({
    url: `${version}/beseye/account/authorize`,
    method: 'post',
    data
  })
}

export const getAvailableBeseyeDevice = params => {
  return request({
    url: `${version}/beseye/device/unused/list`,
    method: 'get',
    params
  })
}

export const addBeseyeChannel = data => {
  return request({
    url: `${version}/beseye/device/channel/add`,
    method: 'post',
    data
  });
}

export const deleteBeseyeChannel = data => {
  return request({
    url: `${version}/beseye/device/channel/delete`,
    method: 'post',
    data
  });
}
