import request from '@/common/request';

import Environment from '@/common/environment';
const version = Environment.VERSION;

export const creadNewFlow = data => {
  return request({
    url: `${version}/workflow/add`,
    method: 'post',
    data
  });
};

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
export const bindWorkflow = data => {
  return request({
    url: `${version}/workflow/bind`,
    method: 'post',
    data
  });
};

export const unbindWorkflow = data => {
  return request({
    url: `${version}/workflow/unbind`,
    method: 'post',
    data
  });
};

export const workflowItems = data => {
  return request({
    url: `${version}/workflow/simple/info/list`,
    method: 'get',
    data
  });
};

// 簽核管理 -- 我已提交
export const workflowInstanceMine = data => {
  return request({
    url: `${version}/workflow/instance/mine`,
    method: 'post',
    data
  });
};

export const GetlistWorkflowTaskByType = data => {
  return request({
    url: `${version}/workflow/task/list`,
    method: 'post',
    data
  });
};

// 簽核管理 -- 確認總結
export const SubmitWorkflow = data =>{
  return request({
    url: `${version}/workflow/submit`,
    method: 'post',
    data
  });
};

export const CancelWorkflow = data => {
  return request({
    url: `${version}/workflow/cancel`,
    method: 'post',
    data
  });
};

export const GetTaskInfo = data => {
  return request({
    url: `${version}/workflow/task/info?inspectReportId=${data}&type=0`,
    method: 'get',
    data
  });
};

export const taskSummit = data => {
  return request({
    url: `${version}/workflow/task/submit`,
    method: 'post',
    data
  });
};

