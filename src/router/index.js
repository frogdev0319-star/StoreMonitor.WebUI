import Vue from 'vue';
import Router from 'vue-router';
import LoginForm from '@/views/login/LoginForm';
import AuthRedirect from '@/views/login/AuthRedirect';
import Home from '@/views/home/Home';
import PermissionHelper from '@/api/PermissionHelper';
import util from '../common/util';
import store from '@/store';

Vue.use(Router);
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}
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
    path: '/:token/:userId/:ezvizAppKey/:ezvizProtocol/:lang/:deviceAuth',
    redirect: '/',
    hidden: true
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

let primaryPathesList = [];

export const navbarRoute = {
  getOverviewRoute() {
    primaryPathesList = [];
    const overviewRoute = {
      id:0,
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
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableRemoteOverview() && overviewRoute.children.push({
      path: '/patrolOverview',
      name: 'patrolOverview',
      component: resolve => require(['@/views/overview/PatrolOverview'], resolve),
      meta: {
        // keepAlive: true
      },
    }) && primaryPathesList.push('/patrolOverview');

    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableEventOverview() && overviewRoute.children.push({
      path: '/eventOverview',
      name: 'eventOverview',
      component: resolve => require(['@/views/overview/EventOverview'], resolve),
      meta: {
        // keepAlive: true
      },
    }) && primaryPathesList.push('/eventOverview');
    return overviewRoute;
  },


  // 巡店管理
  getPatrolRoute() {
    console.log("PermissionHelper.enableInspectReport()",PermissionHelper.enableInspectReport());
    const patrolRoute = {
      id:1,
      path: '/home',
      name: 'patrolManage',
      component: Home,
      iconCls: 'iconfont icon-menu-xundian',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    // !PermissionHelper.advancedMode && (PermissionHelper.enableMimicMode || PermissionHelper.enableRemoteInspect()) && patrolRoute.children.push(
    //   {
    //     path: '/reinspection',
    //     name: 'remotePatrol',
    //     hidden: true,
    //     component: resolve => require(['@/views/patrolShop/ReInspection'], resolve),
    //     meta: {
    //       requireAuth: true,
    //       keepAlive: false
    //     },
    //     isReadOnly: false
    //   },
    //   {
    //     path: '/reinspect/confirmrein',
    //     name: 'confirmSum',
    //     hidden: true,
    //     component: resolve => require(['@/views/patrolShop/ConfirmAddSum'], resolve)
    //   },
    //   {
    //     path: '/reinspect/submit',
    //     name: 'submitEvent',
    //     hidden: true,
    //     component: resolve => require(['@/views/patrolShop/ReInspectDealPage'], resolve)
    //   }
    // ) && primaryPathesList.push('/reinspection', '/reinspect/confirmrein', '/reinspect/submit');
    // !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableStoreMonitor() && patrolRoute.children.push(
    //   {
    //     path: '/storemonitor',
    //     name: 'storeMonitor',
    //     hidden: true,
    //     component: resolve => require(['@/views/patrolShop/StoreMonitor'], resolve),
    //     meta: {
    //       requireAuth: true,
    //       keepAlive: true
    //     },
    //     isReadOnly: false
    //   },
    //   {
    //     path: '/storemonitor/submit',
    //     name: 'storeSubEvent',
    //     hidden: true,
    //     component: resolve => require(['@/views/patrolShop/StoreSuccessPage'], resolve)
    //   }
    // ) && primaryPathesList.push('/storemonitor', '/storemonitor/submit');
    !PermissionHelper.advancedMode && (PermissionHelper.enableMimicMode || PermissionHelper.enableInspectReport()) && patrolRoute.children.push(
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
    ) && primaryPathesList.push('/report', '/reportdetails');
    return patrolRoute;
  },

  // 事件管理
  getEventRoute() { 
    const eventRoute = {
      id:2,
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
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && eventRoute.children.push(
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
        component: resolve => require(['@/views/event/details/RateManage'], resolve),
        meta: {
          keepAlive: true, 
        }
      }
    ) && primaryPathesList.push('/event', '/rate');
    return eventRoute;
  },

  // 下載管理
  getDownloadManagement(){
    const downloadManagemenRoute = {
      id:9,
      path: '/home',
      name: 'downloadManagement',
      component: Home,
      iconCls: 'iconfont icon-shijian',
      styles: 'font-size:22px',
      leaf: true,
      isReadOnly: false,
      hidden: false,
      children: []
    };
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && downloadManagemenRoute.children.push(
      {
        path: '/downloadManagement',
        name: 'downloadManagement',
        component: resolve => require(['@/views/downloadManagement/DownloadManagement'], resolve),
        meta: {
          // keepAlive: true, // the component is't to be cache.
          requireAuth: true
        }
      },
    ) && primaryPathesList.push('/downloadManagement');
    return downloadManagemenRoute;

  },

  // 報告與事件
  getReportAndEvent(){
    const reportAndEventRoute = {
      id: 8,
      path: '/home',
      name: 'reportAndEvent',
      component: Home,
      iconCls: 'iconfont icon-shijian',
      styles: 'font-size:22px',
      leaf: false,
      isReadOnly: false,
      hidden: false,
      children: []
    };
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && reportAndEventRoute.children.push(
      {
        path: '/deleteReport',
        name: 'deleteReport',
        component: resolve => require(['@/views/reportAndEvnets/deleteReport'], resolve),
        meta: {
          keepAlive: true, 
          requireAuth: true
        }
      },
      {
        path: '/closeEvents',
        name: 'closeEvents',
        component: resolve => require(['@/views/reportAndEvnets/closeEvents'], resolve),
        meta: {
          keepAlive: true, 
          requireAuth: true
        }
      },
      {
        path: '/operationRecord',
        name: 'operationRecord',
        component: resolve => require(['@/views/reportAndEvnets/operationRecord'], resolve),
        meta: {
          keepAlive: true, 
          requireAuth: true
        }
      },
      {
        path: '/needDeleteReport',
        name: 'needDeleteReport',
        component: resolve => require(['@/views/patrolShop/InspectReport'], resolve),
        hidden: true,
        meta: {
          keepAlive: true, 
          requireAuth: true
        }
      },
      {
        path: '/needUpdateEvent',
        name: 'needUpdateEvent',
        component: resolve => require(['@/views/event/details/RateManage'], resolve),
        hidden: true,
        meta: {
          keepAlive: true, 
          requireAuth: true
        }
      },
      
    ) && primaryPathesList.push('/deleteReport', '/closeEvents', '/operationRecord', '/needDeleteReport', '/needUpdateEvent');
    return reportAndEventRoute;
  },




  // 簽核管理
  getAuditRoute() {
    const auditRoute = {
      id:4,
      path: '/home',
      name: 'AuditManage',
      component: Home,
      iconCls: 'iconfont icon-shijian',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    !PermissionHelper.advancedMode && (PermissionHelper.enableMimicMode || PermissionHelper.enableSendAudit()) && auditRoute.children.push(
      {
        path: '/audit',
        name: 'SendAuditManage',
        component: resolve => require(['@/views/audit/SendAuditManage'], resolve),
        meta: {
          keepAlive: true, // the component is't to be cache.
          requireAuth: true
        },
        isReadOnly: false
      },
      {
        path: '/auditDetail',
        name: 'auditDetail',
        hidden: true,
        component: resolve => require(['@/views/audit/details/AuditDetail'], resolve)
      },
      {
        path: '/auditReportdetails',
        name: 'auditReportdetails',
        hidden: true,
        meta: {
          keepAlive: false
        },
        component: resolve => require(['@/views/patrolShop/InspectReport'], resolve)
      }
    ) && primaryPathesList.push('/audit', '/auditDetail','/auditReportdetails');

    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableWaitAudit() && auditRoute.children.push(
      {
        path: '/waitaudit',
        name: 'WaitAuditManage',
        component: resolve => require(['@/views/audit/WaitAuditManage'], resolve),
        meta: {
          requireAuth: true,
          keepAlive: true
        },
        isReadOnly: false
      },
      {
        path: '/auditHandling',
        name: 'auditHandling',
        hidden: true,
        component: resolve => require(['@/views/audit/details/AuditHandling'], resolve)
      },
      {
        path: '/waitAuditDetail',
        name: 'WaitAuditDetail',
        hidden: true,
        component: resolve => require(['@/views/audit/details/AuditDetail'], resolve)
      },
      {
        path: '/waitAuditReportdetails',
        name: 'WaitAuditReportdetails',
        hidden: true,
        meta: {
          keepAlive: false
        },
        component: resolve => require(['@/views/patrolShop/InspectReport'], resolve)
      },
      {
        path: '/handlingReportdetails',
        name: 'handlingReportdetails',
        hidden: true,
        meta: {
          keepAlive: false
        },
        component: resolve => require(['@/views/patrolShop/InspectReport'], resolve)
      }
    ) && primaryPathesList.push('/waitaudit', '/auditHandling','/waitAuditDetail','/waitAuditReportdetails','/handingReportdetails');
    
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableTranscriptNotify() && auditRoute.children.push(
      {
        path: '/transcriptnotify',
        name: 'TranscriptNotify',
        component: resolve => require(['@/views/audit/TranscriptNotify'], resolve),
        meta: {
          requireAuth: true,
          keepAlive: true
        },
        isReadOnly: false
      },
      {
        path: '/transcriptnotifyAuditDetail',
        name: 'TranscriptnotifyDetail',
        hidden: true,
        component: resolve => require(['@/views/audit/details/AuditDetail'], resolve)
      },
      {
        path: '/transcriptnotifyReportdetails',
        name: 'transcriptnotifyReportdetails',
        hidden: true,
        meta: {
          keepAlive: false
        },
        component: resolve => require(['@/views/patrolShop/InspectReport'], resolve)
      }
    ) && primaryPathesList.push('/transcriptnotify','/transcriptnotifyAuditDetail','/transcriptnotifyReportdetails');
    return auditRoute;
  },

  // 統計分析
  getStatisticalRoute() {
    const statisticsRoute = {
      id:3,
      path: '/home',
      name: 'statistics',
      component: Home,
      iconCls: 'iconfont icon-tongjifenxi',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enablePatrolEvaStatistics() && statisticsRoute.children.push(
      {
        path: '/patrolEvaluation',
        name: 'patrolAppraisalStat',
        component: resolve => require(['@/views/statistical/PatrolEvaluationStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
          
        }
      }
    ) && primaryPathesList.push('/patrolEvaluation');
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableInspectStatistics() && statisticsRoute.children.push(
      {
        path: '/patrolItem',
        name: 'patrolItemsStat',
        component: resolve => require(['@/views/statistical/InspectItemStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/patrolItem_old',
        name: 'patrolItemsStat',
        component: resolve => require(['@/views/statistical/InspectItemStatistics_old'], resolve),
        hidden: true,
    
      }
    ) && primaryPathesList.push('/patrolItem','/patrolItem_old');
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableSupervisionEffStatistics() && statisticsRoute.children.push(
      {
        path: '/patrolPersonStat',
        name: 'patrolPersonStat',
        component: resolve => require(['@/views/statistical/PatrolPersonStat'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
        }
      }
    ) && primaryPathesList.push('/patrolPersonStat');
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableEventStatistics() && statisticsRoute.children.push(
      {
        path: '/eventStat',
        name: 'eventStat',
        component: resolve => require(['@/views/statistical/EventStatistics'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
        }
      }
    ) && primaryPathesList.push('/eventStat');
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableAppraisalCompareStatistics() && statisticsRoute.children.push(
      {
        path: '/patrolCompareStat',
        name: 'patrolCompareStat',
        component: resolve => require(['@/views/statistical/PatrolCompareStat'], resolve),
        hidden: false,
        meta: {
          requireAuth: true,
        }
      }
    ) && primaryPathesList.push('/patrolCompareStat');
    /*
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
    ) && primaryPathesList.push('/supervisorStat');
     */
    // PermissionHelper.enableCheckinStatistics() && statisticsRoute.children.push(
    //   {
    //     path: '/checkInStatistics',
    //     name: 'checkInStatistics',
    //     component: resolve => require(['@/views/statistical/CheckInStatistics'], resolve),
    //     hidden: false,
    //     meta: {
    //       requireAuth: true,
    //       keepAlive: false
    //     }
    //   }
    // ) && primaryPathesList.push('/checkInStatistics');
    return statisticsRoute;
  },


  // 巡檢排程
  getInceptionSchedule(){
    const schduleRoute = {
      id: 5,
      path: '/home',
      name: 'InceptionSchedule',
      component: Home,
      iconCls: 'iconfont icon-shijian',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableScheduleSetting2() && schduleRoute.children.push(
      {

        path: '/scheduleSetting',
        name: 'ScheduleSetting',
        component: resolve => require(['@/views/schedule/ScheduleSetting'], resolve),
        meta: {
          keepAlive: true, 
          requireAuth: true
        },
        isReadOnly: false
      } ,
      {
        path: '/personalSchedule',
        name: 'PersonalSchedule',
        hidden: true,
        component: resolve => require(['@/views/schedule/details/personalSchedule'], resolve)
      },
      {
        path: '/scheduleDetailCreate',
        name: 'CreateSchedule',
        hidden: true,
        meta: {
          keepAlive: false
        },
        component: resolve => require(['@/views/schedule/details/scheduleDetail'], resolve)
      },
      {
        path: '/scheduleDetailModify',
        name: 'ModifySchedule',
        hidden: true,
        meta: {
          keepAlive: false
        },
        component: resolve => require(['@/views/schedule/details/scheduleDetail'], resolve)
      }

    ) && primaryPathesList.push('/scheduleSetting', '/personalSchedule','/scheduleDetailCreate','/scheduleDetailModify');
    
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableScheduleHistroy() && schduleRoute.children.push(
      {
        path: '/scheduleHistory',
        name: 'ScheduleHistory',
        component: resolve => require(['@/views/schedule/ScheduleHistory'], resolve),
        meta: {
          // keepAlive: true, // the component is't to be cache.
          requireAuth: true
        },
        isReadOnly: false
      }
    ) && primaryPathesList.push('/scheduleHistory');
    return schduleRoute;
  },

  // 系統設定
  getSystemSettingRoute() {
    const systemSettingRoute = {
      id:6,
      path: '/home',
      name: 'systemSetting',
      iconCls: 'iconfont icon-button',
      styles: 'font-size:22px',
      component: Home,
      leaf: false,
      hidden: false,
      children: []
    };

    // ==== 2024 sprint1 關閉遠端巡檢 ====
    // const deviceRoutes = this.getDeviceRoutes();
    // // console.log(deviceRoutes)
    // !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableDeviceSetting() && deviceRoutes.length > 0 && systemSettingRoute.children.push(
    //   {
    //     path: '/device',
    //     name: 'deviceManage',
    //     hidden: false,
    //     threeChild: true,
    //     component: resolve => require(['@/views/setting/device/DevicesMgmt'], resolve),
    //     meta: {
    //       requireAuth: true
    //     },
    //     children: deviceRoutes
    //   }) && primaryPathesList.push('/device');

    const inspectionRoute = {
      path: '/inspectionSetting',
      name: 'inspectSetting',
      isReadOnly: false,
      component: resolve => require(['@/views/setting/schedule/InspectionSetting'], resolve),
      hidden: false,
      threeChild: true,
      meta: {
        keepAlive: false,
        requireAuth: true
      },
      children: []
    };

    // 通用設定
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableGeneralSetting() && systemSettingRoute.children.push(
      {
        path: '/generalSetting',
        name: 'generalSetting',
        isReadOnly: false,
        component: resolve => require(['@/views/setting/generalSetting/GeneralSetting'], resolve),
        hidden: false,
        meta: {
          keepAlive: false, 
          requireAuth: true
        }
      },
    ) && primaryPathesList.push('/generalSetting');

    
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enablePatrolSetting() && inspectionRoute.children.push(
      {
        path: '/routeinspection',
        name: 'inspectListSetting',
        component: resolve => require(['@/views/setting/routeInspection/RouteInspection'], resolve),
        meta: {
          keepAlive: false, 
        },
        hidden: false
      },
      {
        path: '/addroute',
        name: 'itemSetting',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/AddRuteInspect'], resolve),
        meta: {
          keepAlive: false, 
        },
      },
      {
        path: '/setroute',
        name: 'setRule',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/SetRuleInspect'], resolve),
        meta: {
          keepAlive: false, 
        },
      },
      {
        path: '/bindroute',
        name: 'bindStore',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/BindRuteInspect'], resolve),
      },
      {
        path: '/createinspect',
        name: 'createInspect',
        hidden: true,
        component: resolve => require(['@/views/setting/routeInspection/CreateInspect'], resolve),
      },

      

    ) && primaryPathesList.push('/routeinspection', '/addroute', '/setroute', '/bindroute', '/createinspect');

    /*!PermissionHelper.enableMimicMode && PermissionHelper.enableScheduleSetting() && inspectionRoute.children.push({
      path: '/patrolSchedule',
      name: 'scheduleManage',
      isReadOnly: false,
      component: resolve => require(['@/views/setting/schedule/PatrolSechedule'], resolve),
      hidden: true,
      meta: {
        keepAlive: false, // the component is't to be cache.
        requireAuth: true
      }
    }) && primaryPathesList.push('/patrolSchedule');*/

    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableReportSetting() &&
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
    }) && primaryPathesList.push('/insepctionReportSetting');

    inspectionRoute.children.length > 0 && systemSettingRoute.children.push(inspectionRoute);

    // 職務管理
    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableTitleSetting() && systemSettingRoute.children.push(
      {
        path: '/title',
        name: 'titleManage',
        isReadOnly: false,
        component: resolve => require(['@/views/setting/title/TitleManage'], resolve),
        hidden: false,
        meta: {
          keepAlive: false, 
          requireAuth: true
        }
      },
      {
        path: '/titleSetting',
        name: 'titleSetting',
        component: resolve => require(['@/views/setting/title/TitleSetting'], resolve),
        hidden: true
      }
    ) && primaryPathesList.push('/title', '/titleSetting');

    !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && PermissionHelper.enableWorkflowSetting() && systemSettingRoute.children.push(
      {
        path: '/workflows',
        name: 'workflowManage',
        isReadOnly: false,
        component: resolve => require(['@/views/setting/workflow/List'], resolve),
        hidden: false,
        meta: {
          keepAlive: false, 
          requireAuth: true
        }
      },
      {
        path: '/createWorkflow',
        name: 'createWorkflow',
        component: resolve => require(['@/views/setting/workflow/CreateWorkflow'], resolve),
        meta: {
          requireAuth: true
        },
        hidden: true,
      },
      {
        path: '/workflowDetail',
        name: 'workflowDetail',
        component: resolve => require(['@/views/setting/workflow/Detail'], resolve),
        hidden: true,
      },
      {
        path: '/createWorkflownode',
        name: 'createNodeSetting',
        component: resolve => require(['@/views/setting/workflow/NodeSetting'], resolve),
        hidden: true,
      },
      {
        path: '/createEditWorkflownode',
        name: 'createEditNodeSetting',
        component: resolve => require(['@/views/setting/workflow/NodeSetting'], resolve),
        hidden: true,
      },
      {
        path: '/workflownode',
        name: 'nodeSetting',
        component: resolve => require(['@/views/setting/workflow/NodeSetting'], resolve),
        hidden: true,
      }

    ) && primaryPathesList.push('/workflows', '/workflowDetail', '/createWorkflownode', '/workflownode', '/createWorkflow','/createEditWorkflownode');

    (store.getters.roleId==1) && !PermissionHelper.advancedMode && !PermissionHelper.enableMimicMode && systemSettingRoute.children.push(
      {
        path: '/mysterio',
        name: 'MysterioManage',
        isReadOnly: false,
        component: resolve => require(['@/views/setting/mysterio/MysterioManage'], resolve),
        hidden: false,
        meta: {
          keepAlive: false,
          requireAuth: true
        }
      },
      {
        path: '/mysterioSetting',
        name: 'MysterioSetting',
        component: resolve => require(['@/views/setting/mysterio/MysterioSetting'], resolve),
        hidden: true,
      },
    ) && primaryPathesList.push('/mysterio', '/mysterioSetting');
    return systemSettingRoute;
  },


  //進階設定
  getAdvanceSetting(){
    const advanceSettingRoute = {
      id: 7,
      path: '/home',
      name: 'Safety',
      component: Home,
      iconCls: 'iconfont icon-button',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    PermissionHelper.advancedMode && advanceSettingRoute.children.push(
      {
        path: '/waterMark',
        name: 'WaterMark',
        component: resolve => require(['@/views/advanceSetting/safety/WaterMark'], resolve),
        meta: {
          keepAlive: true, // the component is't to be cache.
          requireAuth: true
        },
        isReadOnly: false
      } ,
      {
        path: '/dataSecurity',
        name: 'DataSecurity',
        component: resolve => require(['@/views/advanceSetting/safety/DataSecurity'], resolve),
        meta: {
          keepAlive: true, // the component is't to be cache.
          requireAuth: true
        },
        isReadOnly: false
      } ,
    ) && primaryPathesList.push('/waterMark', '/dataSecurity');
    return advanceSettingRoute;

  },

  //即時推播
  getInstantPush(){
    const instantPushRoute = {
      id: 8,
      path: '/home',
      name: 'InstantPush',
      component: Home,
      iconCls: 'iconfont icon-button',
      styles: 'font-size:22px',
      leaf: false,
      hidden: false,
      children: []
    };
    PermissionHelper.advancedMode && instantPushRoute.children.push(
      {
        path: '/send',
        name: 'Send',
        component: resolve => require(['@/views/advanceSetting/broadcast/Send'], resolve),
        meta: {
          keepAlive: true, 
          requireAuth: true
        },
        isReadOnly: false
      } ,
      {
        path: '/sendingRecord',
        name: 'SendingRecord',
        component: resolve => require(['@/views/advanceSetting/broadcast/SendingRecord'], resolve),
        meta: {
          keepAlive: true, 
          requireAuth: true
        },
        isReadOnly: false
      } ,
      
    ) && primaryPathesList.push('/send', '/sendingRecord');
    return instantPushRoute;

  },




  getDeviceRoutes() {
    const deviceRoutes = [];
    util.getVideoAuthority(1) && deviceRoutes.push({
      path: '/dashDevice',
      name: 'dashDevice',
      component: resolve => require(['@/views/setting/device/Dash/NvrDeviceMgmt'], resolve)
    }) && primaryPathesList.push('/dashDevice');

    // ==== 2024 sprint1 關閉遠端巡檢 ====
    // !PermissionHelper.advancedMode && util.getVideoAuthority(2) && deviceRoutes.push(
    //   {
    //     path: '/ezvizDevice',
    //     name: 'ezvizDevice',
    //     component: resolve => require(['@/views/setting/device/Ezviz/EzvizAccount'], resolve)
    //   },
    //   {
    //     path: '/ezvizeDeviceSetting',
    //     name: 'deviceSetting',
    //     component: resolve => require(['@/views/setting/device/Ezviz/EzvizDeviceMgmt'], resolve),
    //     hidden: true
    //   }
    // ) && primaryPathesList.push('/ezvizDevice', '/ezvizeDeviceSetting');

    // !PermissionHelper.advancedMode && util.getVideoAuthority(3) && deviceRoutes.push(
    //   {
    //     path: '/beseyeAccount',
    //     name: 'beseyeAccount',
    //     component: resolve => require(['@/views/setting/device/Beseye/BeseyeAccount'], resolve)
    //   },
    //   {
    //     path: '/beseyeDeviceSetting',
    //     name: 'beseyeDeviceSetting',
    //     component: resolve => require(['@/views/setting/device/Beseye/BeseyeDeviceMgmt'], resolve),
    //     hidden: true
    //   },
    //   {
    //     path: '/beseye/authorize',
    //     name: 'auth',
    //     component: resolve => require(['@/views/setting/device/Beseye/Authorize'], resolve),
    //     hidden: true
    //   }
    // ) && primaryPathesList.push('/beseyeAccount', '/beseyeDeviceSetting', '/beseye/authorize');

    
    /*
    util.getVideoAuthority(4) && deviceRoutes.push(
      {
        path: '/skywatchAccount',
        name: 'skywatchAccount',
        component: resolve => require(['@/views/setting/device/Skywatch/SkywatchAccount'], resolve)
      },
      {
        path: '/skywatchDeviceSetting',
        name: 'skywatchDeviceSetting',
        component: resolve => require(['@/views/setting/device/Skywatch/SkywatchDeviceMgmt'], resolve),
        hidden: true
      }
    ) && primaryPathesList.push('/skywatchAccount', '/skywatchDeviceSetting');
    */
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
    primaryPathesList.push('/noRight');
    return errorRoute;
  },

  getAvailablePath() {
    return [...new Set(primaryPathesList)];
  }
};
