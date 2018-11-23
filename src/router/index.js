import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Home from '@/views/home/Home'

import TestOne from '@/views/allscan/TestOne'
import TestTwo from '@/views/allscan/TestTwo'
import AllScan from '@/views/allscan/AllScan'

import StoreMonitor from '@/views/patrolShop/StoreMonitor'
import ReInspection from '@/views/patrolShop/ReInspection'

import EventManage from '@/views/event/EventManage'
import RateManage from '@/views/event/details/RateManage'
import RateDetail from '@/views/event/details/RateDetail'

import StatisticalAnaly from '@/views/statistical/StatisticalAnaly'
import DataCenter from '@/views/datacenter/DataCenter'
import SystemSetting from '@/views/setting/SystemSetting'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '总览',
      redirect:'/allscan',
      component: Home,
      iconCls:'iconfont icon-zonglan',
      leaf:true, //没有子节点
      children:[
        {
          path:'/allscan',
          name:'总览',
          component:AllScan,
          children:[
             {
                path:'/one',
                name:'页面一',
                component:TestOne
             },
             {
              path:'/two',
              name:'页面二',
              component:TestTwo
           }
          ]
        }
      ]
    },
    {
      path:'/',
      name:'巡店管理',
      component:Home,
      iconCls:'iconfont icon-zonglan',
      leaf:false,  //多个子节点
      children:[
        {
          path:'/stroemonitor',
          name:'门店监控',
          component:StoreMonitor
        },
        {
          path:'/reinspection',
          name:'远程巡检',
          component:ReInspection
        }
      ]
    },
    {
      path:'/',
      name:'事件管理',
      component:Home,
      iconCls:'icon iconfont icon-yichangshijianliebiaocopy',
      leaf:true,
      children:[
        {
          path:'/event',
          name:'事件管理',
          component:EventManage,
        },
        {
          path:'/event',
          name:'事件管理',
          component:RateManage,
          children:[
            {
              path:'/rate',
              name:'新增事件管理',
              component:RateManage
            }
          ]
        },
        {
          path:'/rate',
          name:'异常进度',
          component:RateDetail,
          children:[
            {
              path:'/details',
              name:'异常进度',
              component:RateDetail
            }
          ]
        }
      ]
    },
    {
      path:'/',
      name:'统计分析',
      component:Home,
      iconCls:'iconfont icon-tongjifenxi',
      leaf:true,
      children:[
        {
          path:'/statistical',
          name:'统计分析',
          component:StatisticalAnaly
        }
      ]
    },
    {
      path:'/',
      name:'数据中心',
      component:Home,
      iconCls:'iconfont icon-tongjifenxi',
      leaf:true,
      children:[
        {
          path:'/datacenter',
          name:'数据中心',
          component:DataCenter
        }
      ]
    },
    {
      path:'/',
      name:'系统设定',
      iconCls:'iconfont icon-tongjifenxi',
      component:Home,
      leaf:false,
      children:[
        {
          path:'/system1',
          name:'门店管理'
        },
        {
          path:'/system2',
          name:'设备管理'
        },
        {
          path:'/system3',
          name:'巡检配置'
        },
        {
          path:'/system4',
          name:'排程配置'
        },
        {
          path:'/other',
          name:'其他设置'
        }
      ]
    }
  ]
})
