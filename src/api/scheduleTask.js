import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export const getSchedulePersonList = data => {
    return request({
      url: `${version}/report/schedule/person/list`,
      method: 'post',
      data
    });
  };

  export const getPersonTaskList = data => {
    return request({
      url: `${version}/report/schedule/person/task/list`,
      method: 'post',
      data
    });
  };

  export const CopySchedulePersonSchedule = data => {
    return request({
      url: `${version}/report/schedule/person/task/duplicate`,
      method: 'post',
      data
    });
  };

  export const getScheduleTaskHistory = data => {
    return request({
      url: `${version}/report/schedule/record/list`,
      method: 'post',
      data
    });
  };

  export const deletePersonTaskList = data => {
    return request({
      url: `${version}/report/schedule/person/task/deleteGroup`,
      method: 'post',
      data
    });
  };

  export const exportScheduleTaskHistory = data => {
    return request({
      url: `${version}/report/schedule/record/list/export`,
      method: 'post',
      data
    });
  };