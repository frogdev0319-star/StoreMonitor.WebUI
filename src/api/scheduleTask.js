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