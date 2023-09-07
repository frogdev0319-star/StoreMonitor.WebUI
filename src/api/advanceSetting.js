import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const advancedFetch = data => {
  return request({
    url: `${version}/system/advanced/fetch/content`,
    method: 'post',
    data
  });
};
export const advancedUpdate = data => {
  return request({
    url: `${version}/system/advanced/update/content`,
    method: 'post',
    data
  });
};
