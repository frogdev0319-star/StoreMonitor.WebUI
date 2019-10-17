import request from '@/common/request'
import Environment from '@/common/environment'
const version = Environment.VERSION;

export const getEventStatsOverview=params=>{
  return request({
    url:`${version}/statistics/event/overview`,
    method:'get',
    params
  })
}
export const getEventStatsRankInfo=data=>{
  return request({
    url:`${version}/statistics/event/rank`,
    method:'post',
    data
  })
}
export const getEventStatsOverStore=data=>{
  return request({
    url:`${version}/statistics/event/store`,
    method:'post',
    data
  })
}
