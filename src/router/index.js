import Vue from 'vue';
import Router from 'vue-router';
import LoginForm from '@/views/login/LoginForm';
import AuthRedirect from '@/views/login/AuthRedirect';
import PermissionHelper from '../api/PermissionHelper';
import Home from '@/views/home/Home';

Vue.use(Router);
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: LoginForm,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/',
    name: 'AuthRedirect',
    hidden: true,
    component: AuthRedirect
  }
];

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: process.env.NODE_ENV === 'development' ? '' : '/storemonitor_ui/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

export const navbarRoute = {
  getOverviewRoute() {
    const overviewRoute = {
      path: '/home',
      name: 'overview',
      component: Home,
      hidden: false,
      iconCls: 'iconfont icon-zonglan',
      styles: 'font-size:22px',
      leaf: false,
      isReadOnly: false,
      children: []
    };
    PermissionHelper.enableRemoteOverview() && overviewRoute.children.push({
      path: '/patrolOverview',
      name: 'patrolOverview',
      component: resolve => require(['@/views/overview/PatrolOverview'], resolve)
    });
    PermissionHelper.enableEventOverview() && overviewRoute.children.push({
      path: '/eventOverview',
      name: 'eventOverview',
      component: resolve => require(['@/views/overview/EventOverview'], resolve)
    });
    return overviewRoute;
  },

  getPatrolRoute() {
    const patrolRoute = {
      path: '/home',
      name: 'patrolManage',
      component: Home,
      iconCls: 'iconfont icon-menu-xundian',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    PermissionHelper.enableRemoteInspect() && patrolRoute.children.push(
      {
        path: '/reinspection',
        name: 'remotePatrol',
        component: resolve => require(['@/views/patrolShop/ReInspection'], resolve),
        meta: {
          requireAuth: true
        },
        isReadOnly: false
      },
      {
        path: '/reinspect/confirmrein',
        name: 'confirmSum',
        hidden: true,
        component: resolve => require(['@/views/patrolShop/ConfirmAddSum'], resolve)
      },
      {
        path: '/reinspect/submit',
        name: 'submitEvent',
        hidden: true,
        component: resolve => require(['@/views/patrolShop/ReInspectDealPage'], resolve)
      }
    );
    PermissionHelper.enableStoreMonitor() && patrolRoute.children.push(
      {
        path: '/storemonitor',
        name: 'storeMonitor',
        component: resolve => require(['@/views/patrolShop/StoreMonitor'], resolve),
        meta: {
          requireAuth: true,
          keepAlive: true
        },
        isReadOnly: false
      },
      {
        path: '/storemonitor/submit',
        name: 'storeSubEvent',
        hidden: true,
        component: resolve => require(['@/views/patrolShop/StoreSuccessPage'], resolve)
      }
    );
    PermissionHelper.enableInspectReport() && patrolRoute.children.push(
      {
        path: '/report',
        name: 'reports',
        component: resolve => require(['@/views/patrolShop/InspectReportList'], resolve),
        meta: {
          requireAuth: true,
          keepAlive: true
        },
        isReadOnly: false
      },
      {
        path: '/reportdetails',
        name: 'reportDetails',
        hidden: true,
        component: resolve => require(['@/views/patrolShop/InspectReport'], resolve)
      }
    );
    return patrolRoute;
  },

  getEventRoute() {
    const eventRoute = {
      path: '/home',
      name: 'eventManage',
      component: Home,
      iconCls: 'iconfont icon-shijian',
      styles: 'font-size:22px',
      leaf: true,
      isReadOnly: false,
      hidden: false,
      children: []
    };
    (PermissionHelper.enableEventHandle() || PermissionHelper.enableEventClose() ||
      PermissionHelper.enableEventAdd() || PermissionHelper.enableEventReturn()) &&
      eventRoute.children.push(
        {
          path: '/event',
          name: 'eventManage',
          component: resolve => require(['@/views/event/EventManage'], resolve),
          meta: {
            keepAlive: true, // the component is't to be cache.
            requireAuth: true
          }
        },
        {
          path: '/rate',
          name: 'eventDetails',
          hidden: true,
          component: resolve => require(['@/views/event/details/RateManage'], resolve)
        }
      );
    return eventRoute;
  },

  getStatisticalRoute() {
    const statisticsRoute = {
      path: '/home',
      name: 'statistics',
      component: Home,
      iconCls: 'iconfont icon-tongjifenxi',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    PermissionHelper.enablePatrolEvaStatistics() && statisticsRoute.children.push(
      {
        path: '/patrolEvaluation',
        name: 'patrolAppraisalStat',
        component: resolve => require(['@/views/statistical/PatrolEvaluationStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
          keepAlive: false
        }
      }
    );
    PermissionHelper.enableInspectStatistics() && statisticsRoute.children.push(
      {
        path: '/patrolItem',
        name: 'patrolItemsStat',
        component: resolve => require(['@/views/statistical/InspectItemStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
          keepAlive: false
        }
      }
    );

    PermissionHelper.enableSupervisionEffStatistics() && statisticsRoute.children.push(
      {
        path: '/supervisorStat',
        name: 'supervisorStat',
        component: resolve => require(['@/views/statistical/SupervisorStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
          keepAlive: false
        }
      }
    );

    PermissionHelper.enableEventStatistics() && statisticsRoute.children.push(
      {
        path: '/eventStat',
        name: 'eventStat',
        component: resolve => require(['@/views/statistical/EventStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
          keepAlive: false
        }
      }
    );
    return statisticsRoute;
  },

  getSystemSettingRoute() {
    const systemSettingRoute = {
      path: '/home',
      name: 'systemSetting',
      iconCls: 'iconfont icon-button',
      styles: 'font-size:22px',
      component: Home,
      leaf: false,
      hidden: false,
      children: []
    };
    PermissionHelper.enablePatrolSetting() && systemSettingRoute.children.push(
      {
        path: '/routeinspection',
        name: 'inspectSetting',
        component: resolve => require(['@/views/setting/routeInspection/RouteInspection'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
          keepAlive: false
        }
      },
      {
        path: '/addroute',
        name: 'itemSetting',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/AddRuteInspect'], resolve)
      },
      {
        path: '/setroute',
        name: 'setRule',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/SetRuleInspect'], resolve)
      },
      {
        path: '/bindroute',
        name: 'bindStore',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/BindRuteInspect'], resolve)
      }
    );
    PermissionHelper.enableDeviceSetting() && systemSettingRoute.children.push(
      {
        path: '/device',
        name: 'deviceManage',
        hidden: false,
        threeChild: true,
        component: resolve => require(['@/views/setting/device/DevicesMgmt'], resolve),
        meta: {
          requireAuth: true
        },
        children: [
          {
            path: '/dashDevice',
            name: 'dashDevice',
            component: resolve => require(['@/views/setting/device/NvrDeviceMgmt'], resolve)
          },
          {
            path: '/ezvizDevice',
            name: 'ezvizDevice',
            component: resolve => require(['@/views/setting/device/EzvizAccount'], resolve)
          },
          {
            path: '/beseyeAccount',
            name: 'beseyeAccount',
            // hidden: true,
            component: resolve => require(['@/views/setting/device/BeseyeAccount'], resolve)
          },
          {
            path: '/ezvizeDeviceSetting',
            name: 'deviceSetting',
            component: resolve => require(['@/views/setting/device/EzvizDeviceMgmt'], resolve),
            hidden: true
          },
          {
            path: '/beseyeDeviceSetting',
            name: 'beseyeDeviceSetting',
            component: resolve => require(['@/views/setting/device/BeseyeDeviceMgmt'], resolve),
            hidden: true
          },
          {
            path: '/beseye/authorize',
            name: 'auth',
            component: resolve => require(['@/views/setting/device/Authorize'], resolve),
            hidden: true
          }
        ]
      },
    );
    PermissionHelper.enableStoreSetting() && systemSettingRoute.children.push(
      {
        path: '/storemanage',
        name: 'storeManage',
        component: resolve => require(['@/views/setting/store/StoreManage'], resolve),
        hidden: false,
        meta: {
          keepAlive: false,
          requireAuth: true
        }
      },
      {
        path: '/storedetail',
        name: 'storeDetail',
        component: resolve => require(['@/views/setting/store/EditStoreVue'], resolve),
        hidden: true
      }
    );
    PermissionHelper.enableScheduleSetting() && systemSettingRoute.children.push(
      {
        path: '/schedule',
        name: 'scheduleManage',
        isReadOnly: false,
        component: resolve => require(['@/views/setting/schedule/ScheduleManage'], resolve),
        hidden: false,
        threeChild: true,
        meta: {
          keepAlive: true, // the component is't to be cache.
          requireAuth: true
        },
        children: [
          {
            path: '/pointCheck',
            name: 'pointCheck',
            component: resolve => require(['@/views/setting/schedule/PointCheckSchedule'], resolve),
            isReadOnly: true
          },
          {
            path: '/patrolSechedule',
            name: 'patrolSechedule',
            component: resolve => require(['@/views/setting/schedule/PatrolSechedule'], resolve)
          }
        ]
      },
    );
    PermissionHelper.enableTitleSetting() && systemSettingRoute.children.push(
      {
        path: '/title',
        name: 'titleManage',
        isReadOnly: false,
        component: resolve => require(['@/views/setting/title/TitleManage'], resolve),
        hidden: false,
        meta: {
          keepAlive: false, // the component is't to be cache.
          requireAuth: true
        }
      },
      {
        path: '/titleSetting',
        name: 'titleSetting',
        component: resolve => require(['@/views/setting/title/TitleSetting'], resolve),
        hidden: true
      }
    );
    return systemSettingRoute;
  }
};
