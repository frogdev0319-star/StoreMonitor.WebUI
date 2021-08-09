import request from '@/common/request';
import Environment from '@/common/environment';
import { serviceAxios } from '../common/request';
const version = Environment.VERSION;

export const getBrifCheckinList = (data) => {
  return request({
    url: `${version}/checkin/list/brief`,
    method: 'post',
    data
  });
};

export const getCheckinList = (data) => {
  return request({
    url: `${version}/checkin/list`,
    method: 'post',
    data
  });
};

export const getCheckinReport = (data) => {
  return serviceAxios({
    url: `${version}/checkin/report`,
    method: 'post',
    data
  });
};
