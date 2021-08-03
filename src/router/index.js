import Vue from 'vue';
import Router from 'vue-router';
import LoginForm from '@/views/login/LoginForm';
import AuthRedirect from '@/views/login/AuthRedirect';
import Home from '@/views/home/Home';
import PermissionHelper from '@/api/PermissionHelper';
import util from '../common/util';

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
        meta: {
          keepAlive: false
        },
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

    // PermissionHelper.enableCheckinStatistics() &&
    statisticsRoute.children.push(
      {
        path: '/checkInStatistics',
        name: 'checkInStatistics',
        component: resolve => require(['@/views/statistical/CheckInStatistics'], resolve),
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

    const deviceRoutes = this.getDeviceRoutes();
    PermissionHelper.enableDeviceSetting() && deviceRoutes.length > 0 && systemSettingRoute.children.push({
        path: '/device',
        name: 'deviceManage',
        hidden: false,
        threeChild: true,
        component: resolve => require(['@/views/setting/device/DevicesMgmt'], resolve),
        meta: {
          requireAuth: true
        },
        children: deviceRoutes
      });

    const inspectionRoute = {
      path: '/inspectionSetting',
      name: 'inspectSetting',
      isReadOnly: false,
      component: resolve => require(['@/views/setting/schedule/InspectionSetting'], resolve),
      hidden: false,
      threeChild: true,
      meta: {
        keepAlive: true,
        requireAuth: true
      },
      children: []
    };

    PermissionHelper.enablePatrolSetting() && inspectionRoute.children.push(
      {
        path: '/routeinspection',
        name: 'inspectListSetting',
        component: resolve => require(['@/views/setting/routeInspection/RouteInspection'], resolve),
        hidden: false
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

    PermissionHelper.enableStoreSetting() && inspectionRoute.children.push(
      {
        path: '/storemanage',
        name: 'storeManage',
        component: resolve => require(['@/views/setting/store/StoreManage'], resolve)
      },
      {
        path: '/storedetail',
        name: 'storeDetail',
        component: resolve => require(['@/views/setting/store/EditStoreVue'], resolve),
        hidden: true
      }
    );
    PermissionHelper.enableScheduleSetting() && inspectionRoute.children.push({
      path: '/patrolSchedule',
      name: 'scheduleManage',
      isReadOnly: false,
      component: resolve => require(['@/views/setting/schedule/PatrolSechedule'], resolve),
      hidden: false,
      meta: {
        keepAlive: false, // the component is't to be cache.
        requireAuth: true
      }
    });

    PermissionHelper.enableReportSetting() &&
    inspectionRoute.children.push({
      path: '/insepctionReportSetting',
      name: 'insepctionReportSetting',
      isReadOnly: false,
      component: resolve => require(['@/views/setting/report/ReportSetting'], resolve),
      hidden: false,
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    });

    inspectionRoute.children.length > 0 && systemSettingRoute.children.push(inspectionRoute);
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
  },

  getDeviceRoutes(){
    const deviceRoutes = [];
    util.getVideoAuthority(1) && deviceRoutes.push({
      path: '/dashDevice',
      name: 'dashDevice',
      component: resolve => require(['@/views/setting/device/NvrDeviceMgmt'], resolve)
    });

    util.getVideoAuthority(2) && deviceRoutes.push({
        path: '/ezvizDevice',
        name: 'ezvizDevice',
        component: resolve => require(['@/views/setting/device/EzvizAccount'], resolve)
      },
      {
        path: '/ezvizeDeviceSetting',
        name: 'deviceSetting',
        component: resolve => require(['@/views/setting/device/EzvizDeviceMgmt'], resolve),
        hidden: true
      });
    util.getVideoAuthority(3) && deviceRoutes.push({
        path: '/beseyeAccount',
        name: 'beseyeAccount',
        component: resolve => require(['@/views/setting/device/BeseyeAccount'], resolve)
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
      });
    return deviceRoutes;
  },

  getErrorRoute() {
    const errorRoute = {
      path: '/home',
      name: 'overview',
      component: Home,
      hidden: true,
      iconCls: 'iconfont icon-zonglan',
      styles: 'font-size:22px',
      leaf: true,
      isReadOnly: false,
      children: [{
        path: '/noRight',
        name: 'noRight',
        component: resolve => require(['@/views/overview/NoRight'], resolve)
      }]
    };

    return errorRoute;
  }
};
