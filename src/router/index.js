import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/Home'
import Login from '@/views/login/Login'
import LoginForm from '@/views/login/LoginForm'
import AuthRedirect from '@/views/login/AuthRedirect'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'/login',
      name:'Login',
      hidden: true,
      component:LoginForm,
      meta:{
        requireAuth: false,
      }
    },
    {
      path:'/',
      name:'AuthRedirect',
      hidden:true,
      component:AuthRedirect
    },
    {
      path: '/home',
      name: '总览',
      redirect:'/reinspection',
      component: Home,
      hidden: false,
      iconCls:'iconfont icon-zonglan',
      styles:'font-size:22px',
      leaf:true, //没有子节点
      isReadOnly:true,
      children:[
        {
          path:'/allscan',
          name:'总览',
          component:resolve=>require(['@/views/allscan/AllScan'],resolve),
          meta:{
            requireAuth: true,
          }
        }
      ]
    },
    {
      path: '/home',
      name:'巡店管理',
      component:Home,
      iconCls:'iconfont icon-menu-xundian',
      styles:'font-size:22px',
      leaf:false,  //多个子节点
      hidden: false,
      children:[
        {
          path:'/reinspection',
          name:'远程巡检',
          component:resolve=>require(['@/views/patrolShop/ReInspection'],resolve),
          meta:{
            requireAuth: true,
            keepAlive:true,
          },
          isReadOnly:false,
        },
        {
          path:'/reinspection',
          name:'远程巡检',
          component:resolve=>require(['@/views/patrolShop/ReInspectDealPage'],resolve),
          hidden:true,
          children:[
            {
              path:'/reinspect/submit',
              name:'巡检提交事件',
              component:resolve=>require(['@/views/patrolShop/ReInspectDealPage'],resolve),
            }
          ]
        },
        {
          path:'/storemonitor',
          name:'门店监控',
          component:resolve=>require(['@/views/patrolShop/StoreMonitor'],resolve),
          meta:{
            requireAuth: true,
            keepAlive:true,
          },
          isReadOnly:false,
        },
        {
          path:'/storemonitor',
          name:'门店监控',
          component:resolve=>require(['@/views/patrolShop/StoreSuccessPage'],resolve),
          hidden:true,
          children:[
            {
              path:'/storemonitor/submit',
              name:'提交事件',
              component:resolve=>require(['@/views/patrolShop/StoreSuccessPage'],resolve),
            }
          ]
        },
      ]
    },
    {
      path: '/home',
      name:'事件管理',
      component:Home,
      iconCls:'iconfont icon-shijian',
      styles:'font-size:22px',
      leaf:true,
      isReadOnly:false,
      hidden: false,
      children:[
        {
          path:'/event',
          name:'事件管理',
          component:resolve=>require(['@/views/event/EventManage'],resolve),
          meta:{
            keepAlive:true,  //the component is't to be cache.
            requireAuth: true,
          }
        },
        {
          path:'/event',
          name:'事件管理',
          component:resolve=>require(['@/views/event/details/RateManage'],resolve),
          meta:{
            requireAuth: false,
          },
          children:[
            {
              path:'/rate',
              name:'事件详情',
              component:resolve=>require(['@/views/event/details/RateManage'],resolve),
              
            }
          ]
        },
       
      ]
    },
    {
      path: '/home',
      name:'统计分析',
      component:Home,
      iconCls:'iconfont icon-tongjifenxi',
      styles:'font-size:22px',
      leaf:true,
      isReadOnly:true,
      hidden: false,
      children:[
        {
          path:'/statistical',
          name:'统计分析',
          component:resolve=>require(['@/views/statistical/StatisticalAnaly'],resolve),
          meta:{
            requireAuth: true,
          }
        }
      ]
    },
    {
      path: '/home',
      name:'数据中心',
      component:Home,
      iconCls:'iconfont icon-menu-shujuzhongxin',
      styles:'font-size:22px',
      leaf:true,
      isReadOnly:false,
      hidden: false,
      children:[
        {
          path:'/datacenter',
          name:'数据中心',
          component:resolve=>require(['@/views/datacenter/DataCenter'],resolve),
          meta:{
            requireAuth: true,
          }
        }
      ]
    },
    {
      path: '/home',
      name:'系统设定',
      iconCls:'iconfont icon-button',
      styles:'font-size:22px',
      component:Home,
      leaf:false,
      hidden: false,
      children:[
        {
          path:'/routeinspection',
          name:'巡检配置',
          component:resolve=>require(['@/views/setting/routeInspection/RouteInspection'],resolve),
          hidden:false,
          meta:{
            requireAuth: true,
            keepAlive:false,
          }
        },
        {
          path:'/routeinspection',
          name:'巡检配置',
          component:resolve=>require(['@/views/setting/routeInspection/AddRuteInspect'],resolve),
          hidden:true,
          meta:{
            requireAuth: true,
          },
          children:[
            {
              path:'/addroute',
              name:'巡检项设置',
              component:resolve=>require(['@/views/setting/routeInspection/AddRuteInspect'],resolve)
            }
          ]
        },
        {
          path:'/routeinspection',
          name:'巡检配置',
          component:resolve=>require(['@/views/setting/routeInspection/BindRuteInspect'],resolve),
          hidden:true,
          meta:{
            requireAuth: true,
          },
          children:[
            {
              path:'/bindroute',
              name:'门店绑定',
              component:resolve=>require(['@/views/setting/routeInspection/BindRuteInspect'],resolve)
            }
          ]
        },
        {
          path:'/device',
          name:'设备管理',
          component:resolve=>require(['@/views/setting/device/DeviceSetMge'],resolve),
          meta:{
            requireAuth: true,
          },
        },
        {
          path:'/storemanage',
          name:'门店管理',
          component:resolve=>require(['@/views/setting/store/StoreManage'],resolve),
          hidden:false,
          meta:{
            keepAlive:false,  //the component is't to be cache.
            requireAuth:true
          }
        },
        {
          path:'/storemanage',
          name:'门店管理',
          component:resolve=>require(['@/views/setting/store/EditStoreVue'],resolve),
          hidden:true,
          meta:{
            requireAuth:true
          },
          children:[
            {
              path:'/storedetail',
              name:'门店详情',
              component:resolve=>require(['@/views/setting/store/EditStoreVue'],resolve)
            }
          ]
        },
        {
          path:'/schedule',
          name:'排程配置',
          isReadOnly:false,
          component:resolve=>require(['@/views/setting/schedule/ScheduleManage'],resolve),
          hidden:false,
          meta:{
            requireAuth:true
          },
        },
        {
          path:'/other',
          name:'其他设置',
          isReadOnly:true,
          component:resolve=>require(['@/views/patrolShop/ReInspectDealPage'],resolve),
        }
      ]
    }
  ]
})
