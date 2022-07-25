import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export const addMysterioPerson = data => {
  return request({
    url: `${version}/mystery/setting/add`,
    method: 'post',
    data
  });
};

export const getMysterioList = data => {
  return request({
    url: `${version}/mystery/setting/list`,
    method: 'get',
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