import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const fetchLog = data => {
  return request({
    url: `${version}/system/advanced/log/fetch`,
    method: 'post',
    data
  });
};