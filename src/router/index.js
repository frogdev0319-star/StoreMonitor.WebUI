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

//巡检配置
import RouteInspection from '@/views/setting/routeInspection/RouteInspection'
import AddRuteInspect from '@/views/setting/routeInspection/AddRuteInspect'
import BindRuteInspect from '@/views/setting/routeInspection/BindRuteInspect'

//设备管理
import DeviceSetMge from '@/views/setting/device/DeviceSetMge'

//门店管理
import StoreManage from '@/views/setting/store/StoreManage'
import EditStoreVue from '@/views/setting/store/EditStoreVue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '总览',
      redirect:'/allscan',
      component: Home,
      iconCls:'iconfont icon-zonglan',
      styles:'font-size:25px',
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
      iconCls:'iconfont icon-menu-xundian',
      styles:'font-size:22px',
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
      iconCls:'iconfont icon-shijian',
      styles:'font-size:22px',
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
      styles:'font-size:25px',
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
      iconCls:'iconfont icon-menu-shujuzhongxin',
      styles:'font-size:20px',
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
      iconCls:'iconfont icon-button',
      styles:'font-size:24px',
      component:Home,
      leaf:false,
      children:[
        {
          path:'/routeinspection',
          name:'巡检配置',
          component:RouteInspection,
          hidden:false,
        },
        {
          path:'/routeinspection',
          name:'巡检配置',
          component:AddRuteInspect,
          hidden:true,
          children:[
            {
              path:'/addroute',
              name:'巡检项设置',
              component:AddRuteInspect
            }
          ]
        },
        {
          path:'/routeinspection',
          name:'巡检配置',
          component:BindRuteInspect,
          hidden:true,
          children:[
            {
              path:'/bindroute',
              name:'门店绑定',
              component:BindRuteInspect
            }
          ]
        },
        {
          path:'/device',
          name:'设备管理',
          component:DeviceSetMge
        },
        {
          path:'/storemanage',
          name:'门店管理',
          component:StoreManage,
          hidden:false
        },
        {
          path:'/system4',
          name:'排程配置',
          component:AddRuteInspect
        },
        {
          path:'/other',
          name:'其他设置'
        }
      ]
    }
  ]
})
