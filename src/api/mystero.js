import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export const addMysterioPerson = data => {
  return request({
    url: `${version}/auth/title/add`,
    method: 'post',
    data
  });
};

export const getMysterioList = data => {
  return request({
    url: `${version}/auth/title/list`,
    method: 'get',
    data
  });
};