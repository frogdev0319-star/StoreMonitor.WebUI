import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const getWorkflowList = data => {
  return request({
    url: `${version}/workflow/list`,
    method: 'post',
    data
  });
};

export const disableWorkflow = data => {
  return request({
    url: `${version}/workflow/disable`,
    method: 'post',
    data
  });
};

export const enableWorkflow = data => {
  return request({
    url: `${version}/workflow/enable`,
    method: 'post',
    data
  });
};

export const getWorkflowInfo = params => {
    console.log(params)
  return request({
    url: `${version}/workflow/info`,
    method: 'get',
    params
  });
};