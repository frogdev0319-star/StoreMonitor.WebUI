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

export const getNodeList = data => {
  return request({
    url: `${version}/workflow/info?processDefinitionKey=${data}`,
    method: 'get',
    data
  });
};

export const duplicateRow = data => {
  console.log('data!!! :>> ', data);
  return request({
    url: `${version}/workflow/duplicate`,
    method: 'post',
    data
  });
};

export const deleteRow = data => {
  console.log('data!!! :>> ', data);
  return request({
    url: `${version}/workflow/delete`,
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
  return request({
    url: `${version}/workflow/info`,
    method: 'get',
    params
  });
};

export const updateWorkflow = data => {
  return request({
    url: `${version}/workflow/update`,
    method: 'post',
    data
  });
};