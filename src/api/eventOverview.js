import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export const getEventStatsOverview = data => {
  return request({
    url: `${version}/statistics/event/overview`,
    method: 'post',
    data
  });
};

export const getEventStatsRankInfo = data => {
  return request({
    url: `${version}/statistics/event/rank`,
    method: 'post',
    data
  });
};

export const getEventStatsOverStore = data => {
  return request({
    url: `${version}/statistics/event/store`,
    method: 'post',
    data
  });
};

export const getEventStatsOverStoreV2 = data => {
  return request({
    url: `v2.0/statistics/event/store`,
    method: 'post',
    data
  });
};

export const getEventStatsOverWithGroup = data => {
  return request({
    url: `v1.0/statistics/event/group`,
    method: 'post',
    data
  });
};
