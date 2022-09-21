import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export const addMysterioPerson = data => {
  return request({
    url: `${version}/mystery/member/add`,
    method: 'post',
    data
  });
};

export const getMysterioMemberList = data => {
  return request({
    url: `${version}/mystery/member/list`,
    method: 'post',
    data
  });
};

export const removeMysterioPerson = data => {
  return request({
    url: `${version}/mystery/member/remove`,
    method: 'post',
    data
  });
};

export const isMysteryMode = data => {
  return request({
    url: `${version}/mystery/isMysteryMode`,
    method: 'get',
    data
  });
};

export const addMysterySetting = data => {
  return request({
    url: `${version}/mystery/setting/add`,
    method: 'post',
    data
  });
};

export const removeMysterySetting = data => {
  return request({
    url: `${version}/mystery/setting/remove`,
    method: 'post',
    data
  });
};

export const getMysterySetting = data => {
  return request({
    url: `${version}/mystery/setting/list`,
    method: 'post',
    data
  });
};

export const batchAddMysterySetting = data => {
  return request({
    url: `${version}/mystery/setting/batchAdd`,
    method: 'post',
    data
  });
};

export const ListMysteryModeStoreInfo = data => {
  return request({
    url: `${version}/mystery/store/list`,
    method: 'get',
    data
  });
};