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
      path:'*',
      redirect: '/'
    },
    {
      path:'/',
      name:'AuthRedirect',
      hidden:true,
      component:AuthRedirect
    },
    {
      path: '/home',
      name: 'overview',
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
          name:'overview',
          component:resolve=>require(['@/views/allscan/AllScan'],resolve),
          meta:{
            requireAuth: true,
          }
        }
      ]
    },
    {
      path: '/home',
      name:'patrolManage',
      component:Home,
      iconCls:'iconfont icon-menu-xundian',
      styles:'font-size:22px',
      leaf:false,  //多个子节点
      hidden: false,
      children:[
        {
          path:'/reinspection',
          name:'remotePatrol',
          component:resolve=>require(['@/views/patrolShop/ReInspection'],resolve),
          meta:{
            requireAuth: true,
            keepAlive:true,
          },
          isReadOnly:false,
        },
        {
          path:'/reinspection',
          name:'remotePatrol',
          component:resolve=>require(['@/views/patrolShop/ConfirmAddSum'],resolve),
          hidden:true,
          meta:{
            keepAlive:true
          },
          children:[
            {
              path:'/reinspect/confirmrein',
              name:'confirmSum',
              component:resolve=>require(['@/views/patrolShop/ConfirmAddSum'],resolve),
            }
          ]
        },
        {
          path:'/reinspection',
          name:'remotePatrol',
          component:resolve=>require(['@/views/patrolShop/ReInspectDealPage'],resolve),
          hidden:true,
          children:[
            {
              path:'/reinspect/submit',
              name:'submitEvent',
              component:resolve=>require(['@/views/patrolShop/ReInspectDealPage'],resolve),
            }
          ]
        },
        {
          path:'/storemonitor',
          name:'storeMonitor',
          component:resolve=>require(['@/views/patrolShop/StoreMonitor'],resolve),
          meta:{
            requireAuth: true,
            keepAlive:true,
          },
          isReadOnly:false,
        },
        {
          path:'/storemonitor',
          name:'storeMonitor',
          component:resolve=>require(['@/views/patrolShop/StoreSuccessPage'],resolve),
          hidden:true,
          children:[
            {
              path:'/storemonitor/submit',
              name:'storeSubEvent',
              component:resolve=>require(['@/views/patrolShop/StoreSuccessPage'],resolve),
            }
          ]
        },
        {
          path:'/report',
          name:'reports',
          component:resolve=>require(['@/views/patrolShop/InspectReportList'],resolve),
          meta:{
            requireAuth: true,
            keepAlive:true,
            isBack: false
          },
          isReadOnly:false,
        },
        {
          path:'/report',
          name:'reports',
          component:resolve=>require(['@/views/patrolShop/InspectReport'],resolve),
          hidden:true,
          children:[
            {
              path:'/reportdetails',
              name:'reportDetails',
              component:resolve=>require(['@/views/patrolShop/InspectReport'],resolve),
            }
          ]
        },
      ]
    },
    {
      path: '/home',
      name:'eventManage',
      component:Home,
      iconCls:'iconfont icon-shijian',
      styles:'font-size:22px',
      leaf:true,
      isReadOnly:false,
      hidden: false,
      children:[
        {
          path:'/event',
          name:'eventManage',
          component:resolve=>require(['@/views/event/EventManage'],resolve),
          meta:{
            keepAlive:true,  //the component is't to be cache.
            requireAuth: true,
            isBack: false,
          }
        },
        {
          path:'/event',
          name:'eventManage',
          component:resolve=>require(['@/views/event/details/RateManage'],resolve),
          meta:{
            requireAuth: false,
          },
          children:[
            {
              path:'/rate',
              name:'eventDetails',
              component:resolve=>require(['@/views/event/details/RateManage'],resolve),

            }
          ]
        },
      ]
    },
    {
      path: '/home',
      name:'statistics',
      component:Home,
      iconCls:'iconfont icon-tongjifenxi',
      styles:'font-size:22px',
      leaf:true,
      isReadOnly:true,
      hidden: false,
      children:[
        {
          path:'/statistical',
          name:'statistics',
          component:resolve=>require(['@/views/statistical/StatisticalAnaly'],resolve),
          meta:{
            requireAuth: true,
          }
        }
      ]
    },
    {
      path: '/home',
      name:'dataCenter',
      component:Home,
      iconCls:'iconfont icon-menu-shujuzhongxin',
      styles:'font-size:22px',
      leaf:true,
      isReadOnly:true,
      hidden: false,
      children:[
        {
          path:'/datacenter',
          name:'dataCenter',
          component:resolve=>require(['@/views/datacenter/DataCenter'],resolve),
          meta:{
            requireAuth: true,
          }
        }
      ]
    },
    {
      path: '/home',
      name:'systemSetting',
      iconCls:'iconfont icon-button',
      styles:'font-size:22px',
      component:Home,
      leaf:false,
      hidden: false,
      children:[
        {
          path:'/routeinspection',
          name:'inspectSetting',
          component:resolve=>require(['@/views/setting/routeInspection/RouteInspection'],resolve),
          hidden:false,
          meta:{
            requireAuth: true,
            keepAlive:false,
          }
        },
        {
          path:'/routeinspection',
          name:'inspectSetting',
          component:resolve=>require(['@/views/setting/routeInspection/AddRuteInspect'],resolve),
          hidden:true,
          meta:{
            requireAuth: true,
          },
          children:[
            {
              path:'/addroute',
              name:'itemSetting',
              component:resolve=>require(['@/views/setting/routeInspection/AddRuteInspect'],resolve)
            }
          ]
        },
        {
          path:'/routeinspection',
          name:'inspectSetting',
          component:resolve=>require(['@/views/setting/routeInspection/BindRuteInspect'],resolve),
          hidden:true,
          meta:{
            requireAuth: true,
          },
          children:[
            {
              path:'/bindroute',
              name:'bindStore',
              component:resolve=>require(['@/views/setting/routeInspection/BindRuteInspect'],resolve)
            }
          ]
        },
        {
          path:'/device',
          name:'deviceManage',
          component:resolve=>require(['@/views/setting/device/DeviceSetMge'],resolve),
          meta:{
            requireAuth: true,
          },
        },
        {
          path:'/storemanage',
          name:'storeManage',
          component:resolve=>require(['@/views/setting/store/StoreManage'],resolve),
          hidden:false,
          meta:{
            keepAlive:false,  //the component is't to be cache.
            requireAuth:true
          }
        },
        {
          path:'/storemanage',
          name:'storeManage',
          component:resolve=>require(['@/views/setting/store/EditStoreVue'],resolve),
          hidden:true,
          meta:{
            requireAuth:true
          },
          children:[
            {
              path:'/storedetail',
              name:'storeDetail',
              component:resolve=>require(['@/views/setting/store/EditStoreVue'],resolve)
            }
          ]
        },
        {
          path:'/schedule',
          name:'scheduleManage',
          isReadOnly:false,
          component: resolve=>require(['@/views/setting/schedule/ScheduleManage'],resolve),
          hidden:false,
          threeChild : true,
          meta:{
            keepAlive:true,  //the component is't to be cache.
            requireAuth:true
          },
          children:[
            {
              path:'/pointCheck',
              name:'pointCheck',
              component:resolve=>require(['@/views/setting/schedule/PointCheckSchedule'],resolve)
            },
            // {
            //   path:'/lpsSechedule',
            //   name:'lpsSechedule',
            //   component:resolve=>require(['@/components/EzvizVideo'],resolve)
            // },
            {
              path:'/patrolSechedule',
              name:'patrolSechedule',
              component:resolve=>require(['@/views/setting/schedule/PatrolSechedule'],resolve)
            },
          ]
        },
        {
          path:'/other',
          name:'otherSetting',
          isReadOnly:true,
          component:resolve=>require(['@/views/patrolShop/ConfirmAddSum'],resolve),
        }
      ]
    }
  ]
})
