import request from '@/common/request';
import Environment from '@/common/environment';
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
