import request from '@/common/request';
import Environment from '@/common/environment';
const version = Environment.VERSION;

export const getInspectStatsOverview = params => {
  return request({
    url: `${version}/statistics/inspect/report/overview`,
    method: 'get',
    params
  });
};

export const getInspectStatsOverStore = params => {
  return request({
    url: `${version}/statistics/inspect/store`,
    method: 'get',
    params
  });
};

export const getInspectStatsItemOverview = params => {
  return request({
    url: `${version}/statistics/inspect/item/overview`,
    method: 'post',
    params
  });
};

export const getInspectStatsItemOverviewRegion = data => {
  return request({
    url: `${version}/statistics/inspect/item/region`,
    method: 'post',
    data
  });
};

export const GetInspectStatsOverPerson = data => {
  return request({
    url: `${version}/statistics/inspect/report/person`,
    method: 'post',
    data
  });
};

export const getInspectStatsOverviewWithRegion = params => {
  return request({
    url: `${version}/statistics/inspect/report/region/overview`,
    method: 'post',
    params
  });
};

export const getInspectStatsOverRegion = data => {
  return request({
    url: `${version}/statistics/inspect/report/region`,
    method: 'post',
    data
  });
};

export const getInspectStatsOverviewWithRegionV2 = data => {
  return request({
    url: `v2.0/statistics/inspect/report/region/overview`,
    method: 'post',
    data
  });
};

export const getInspectStatsItemOverviewV2 = data => {
  return request({
    url: `v2.0/statistics/inspect/item/overview`,
    method: 'post',
    data
  });
};

export const getInspectStatsOverPersonV2 = data => {
  return request({
    url: `v2.0/statistics/inspect/report/person`,
    method: 'post',
    data
  });
};

export const getInspectScheduleOverview = data => {
  return request({
    url: `${version}/inspect/schedule/list`,
    method: 'post',
    data
  });
};
