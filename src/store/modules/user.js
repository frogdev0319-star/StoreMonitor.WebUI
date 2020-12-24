import { loginByUsername, logout, getUserInfo, changeAccount, getUserAuthorities } from '@/api/login';
import { getDashServerInfo } from '@/api/device';
import { getToken, setToken, removeToken, getCookie, setCookie } from '@/common/auth';
import PermissionHelper from '../../api/PermissionHelper';
import Home from '@/views/home/Home';
import router, { resetRouter, constantRoutes } from '@/router';

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    dashurl: sessionStorage.getItem('DASH_URL'),
    cancel: null,
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    accountChanged: 0,
    accountId: '',
    cachePath: [''],
    isEzviz: getCookie('isEzviz') ? JSON.parse(getCookie('isEzviz')) : false,
    authorities: [],
    routes: [],
    addRoutes: [],
    PatrolHistory: null,
    InspectHistory: null,
    PatrolComment: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },

    SET_TOKEN: (state, token) => {
      state.token = token;
    },

    SET_DASHURL: (state, dashurl) => {
      state.dashurl = dashurl;
    },

    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },

    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },

    SET_STATUS: (state, status) => {
      state.status = status;
    },

    SET_NAME: (state, name) => {
      state.name = name;
    },

    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },

    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },

    Account_Changed: (state, accountChanged) => {
      state.accountChanged = accountChanged;
    },

    SET_ACCOUNTID: (state, accountId) => {
      state.accountId = accountId;
    },

    newCachePath(state, msg) {
      state.cachePath = msg;
    },

    SET_ISEZVIZ: (state, isEzviz) => {
      state.isEzviz = isEzviz;
    },
    SET_AUTHORITY: (state, authorities) => {
      state.authorities = authorities;
    },

    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },

    SET_PatrolHistory: (state, PatrolHistory) => {
      state.PatrolHistory = PatrolHistory;
    },

    SET_InspectHistory: (state, InspectHistory) => {
      state.InspectHistory = InspectHistory;
    },

    SET_PatrolComment: (state, PatrolComment) => {
      state.PatrolComment = PatrolComment;
    }

  },
  actions: {
    setPatrolHistory({ commit }, PatrolHistory) {
      commit('SET_PatrolHistory', PatrolHistory);
    },

    setPatrolComment({ commit }, PatrolComment) {
      commit('SET_PatrolComment', PatrolComment);
    },

    setInspectHistory({ commit }, InspectHistory) {
      commit('SET_InspectHistory', InspectHistory);
    },

    GetDash({ commit }) {
      return new Promise((resolve, reject) => {
        getDashServerInfo().then(res => {
          console.log(res);
          if (res.data) {
            const dash = res.data;
            let dataPort = '';
            let url = '';
            if (dash.url.indexOf('https') != -1) {
              dataPort = dash.httpsCmdPort;
            } else {
              dataPort = dash.httpCmdPort;
            }
            url = dash.url + ':' + dataPort;
            commit('SET_DASHURL', url);
            sessionStorage.setItem('DASH_URL', url);
          }
          resolve(res);
        });
      });
    },

    changeAccount({ commit }, params) {
      return new Promise((resolve, reject) => {
        changeAccount(params).then(res => {
          if (res.errCode == 0) {
            commit('Account_Changed', ++user.state.accountChanged);
            // commit('SET_ACCOUNTID',params.)
            const accountId = params.accountId.toLowerCase();
            localStorage.setItem('oss_bucket', accountId);
            commit('SET_ACCOUNTID', accountId);
            if (res.data.ezvizProtocol) {
              commit('SET_ISEZVIZ', true);
              setCookie('isEzviz', true);
            } else {
              commit('SET_ISEZVIZ', false);
              setCookie('isEzviz', false);
            }
          } else {
            commit('Account_Changed', 0);
          }
          resolve(res);
        });
      });
    },

    LoginByUser({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const params = {
        'email': username,
        'password': userInfo.password
      };
      return new Promise((resolve, reject) => {
        loginByUsername(params).then(res => {
          console.log(res);
          const data = res.data;
          if (res.data) {
            commit('SET_TOKEN', data.token);
            setToken(data.token);
          }
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resetRouter();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resetRouter();
        resolve();
      });
    },

    GetUserAuthorities({ commit }) {
      return new Promise((resolve,reject) => {
        getUserAuthorities().then((res) => {
          commit('SET_AUTHORITY', res.data.authorities);
          commit('SET_ROLES', [res.data.roleId]);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resolve();
      });
    },

    generateRoutes({ commit }) {
      return new Promise(resolve => {
        const accessedRoutes = [];
        console.log(user.state.authorities);
        PermissionHelper.setData(user.state.authorities);

        const route1 = {
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
        PermissionHelper.enableRemoteOverview() && route1.children.push({
          path: '/patrolOverview',
          name: 'patrolOverview',
          component: resolve => require(['@/views/overview/PatrolOverview'], resolve)
        });
        PermissionHelper.enableEventOverview() && route1.children.push({
          path: '/eventOverview',
          name: 'eventOverview',
          component: resolve => require(['@/views/overview/EventOverview'], resolve)
        });
        if (route1.children.length > 0) {
          route1.redirect = route1.children[0].path;
          accessedRoutes.push(route1);
        }

        const route2 = {
          path: '/home',
          name: 'patrolManage',
          component: Home,
          iconCls: 'iconfont icon-menu-xundian',
          styles: 'font-size:22px',
          leaf: false,
          hidden: false,
          children: []
        };
        PermissionHelper.enableRemoteInspect() && route2.children.push(
          {
            path: '/reinspection',
            name: 'remotePatrol',
            component: resolve => require(['@/views/patrolShop/ReInspection'], resolve),
            meta: {
              requireAuth: true
              // keepAlive:true,
            },
            isReadOnly: false
          },
          {
            path: '/reinspection',
            name: 'remotePatrol',
            component: resolve => require(['@/views/patrolShop/ConfirmAddSum'], resolve),
            hidden: true,
            meta: {
              // keepAlive:true
            },
            children: [
              {
                path: '/reinspect/confirmrein',
                name: 'confirmSum',
                component: resolve => require(['@/views/patrolShop/ConfirmAddSum'], resolve)
              }
            ]
          },
          {
            path: '/reinspection',
            name: 'remotePatrol',
            component: resolve => require(['@/views/patrolShop/ReInspectDealPage'], resolve),
            hidden: true,
            children: [
              {
                path: '/reinspect/submit',
                name: 'submitEvent',
                component: resolve => require(['@/views/patrolShop/ReInspectDealPage'], resolve)
              }
            ]
          },
        );
        PermissionHelper.enableStoreMonitor() && route2.children.push(
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
            path: '/storemonitor',
            name: 'storeMonitor',
            component: resolve => require(['@/views/patrolShop/StoreSuccessPage'], resolve),
            hidden: true,
            children: [
              {
                path: '/storemonitor/submit',
                name: 'storeSubEvent',
                component: resolve => require(['@/views/patrolShop/StoreSuccessPage'], resolve)
              }
            ]
          }
        );
        PermissionHelper.enableInspectReport() && route2.children.push(
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
            path: '/report',
            name: 'reports',
            component: resolve => require(['@/views/patrolShop/InspectReport'], resolve),
            hidden: true,
            children: [
              {
                path: '/reportdetails',
                name: 'reportDetails',
                component: resolve => require(['@/views/patrolShop/InspectReport'], resolve)
              }
            ]
          },
        );
        accessedRoutes.length === 0 ? route2.redirect = route2.children[0].path : '';
        accessedRoutes.push(route2);

        const route3 = {
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
          route3.children.push(
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
              path: '/event',
              name: 'eventManage',
              component: resolve => require(['@/views/event/details/RateManage'], resolve),
              meta: {
                requireAuth: false
              },
              children: [
                {
                  path: '/rate',
                  name: 'eventDetails',
                  component: resolve => require(['@/views/event/details/RateManage'], resolve)

                }
              ]
            },
          );
        accessedRoutes.push(route3);

        const route4 = {
          path: '/home',
          name: 'statistics',
          component: Home,
          iconCls: 'iconfont icon-tongjifenxi',
          styles: 'font-size:22px',
          leaf: false,
          hidden: false,
          children: []
        };
        PermissionHelper.enablePatrolEvaStatistics() && route4.children.push(
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
        PermissionHelper.enableInspectStatistics() && route4.children.push(
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

        PermissionHelper.enableSupervisionEffStatistics() && route4.children.push(
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

        PermissionHelper.enableEventStatistics() && route4.children.push(
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

        route4.children.length > 0 ? accessedRoutes.push(route4) : '';

        const route5 = {
          path: '/home',
          name: 'systemSetting',
          iconCls: 'iconfont icon-button',
          styles: 'font-size:22px',
          component: Home,
          leaf: false,
          hidden: false,
          children: []
        };
        PermissionHelper.enablePatrolSetting() && route5.children.push(
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
            path: '/routeinspection',
            name: 'inspectSetting',
            component: resolve => require(['@/views/setting/routeInspection/AddRuteInspect'], resolve),
            hidden: true,
            meta: {
              requireAuth: true
            },
            children: [
              {
                path: '/addroute',
                name: 'itemSetting',
                component: resolve => require(['@/views/setting/routeInspection/AddRuteInspect'], resolve)
              }
            ]
          },
          {
            path: '/routeinspection',
            name: 'inspectSetting',
            component: resolve => require(['@/views/setting/routeInspection/SetRuleInspect'], resolve),
            hidden: true,
            meta: {
              requireAuth: true
            },
            children: [
              {
                path: '/setroute',
                name: 'setRule',
                component: resolve => require(['@/views/setting/routeInspection/SetRuleInspect'], resolve)
              }
            ]
          },
          {
            path: '/routeinspection',
            name: 'inspectSetting',
            component: resolve => require(['@/views/setting/routeInspection/BindRuteInspect'], resolve),
            hidden: true,
            meta: {
              requireAuth: true
            },
            children: [
              {
                path: '/bindroute',
                name: 'bindStore',
                component: resolve => require(['@/views/setting/routeInspection/BindRuteInspect'], resolve)
              }
            ]
          }
        );
        PermissionHelper.enableDeviceSetting() && route5.children.push(
          {
            path: '/device',
            name: 'deviceManage',
            component: resolve => require(['@/views/setting/device/DeviceSetMge'], resolve),
            meta: {
              requireAuth: true
            }
          },
        );
        PermissionHelper.enableStoreSetting() && route5.children.push(
          {
            path: '/storemanage',
            name: 'storeManage',
            component: resolve => require(['@/views/setting/store/StoreManage'], resolve),
            hidden: false,
            meta: {
              keepAlive: false, // the component is't to be cache.
              requireAuth: true
            }
          },
          {
            path: '/storemanage',
            name: 'storeManage',
            component: resolve => require(['@/views/setting/store/EditStoreVue'], resolve),
            hidden: true,
            meta: {
              requireAuth: true
            },
            children: [
              {
                path: '/storedetail',
                name: 'storeDetail',
                component: resolve => require(['@/views/setting/store/EditStoreVue'], resolve)
              }
            ]
          }
        );
        PermissionHelper.enableScheduleSetting() && route5.children.push(
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
              // {
              //   path:'/lpsSechedule',
              //   name:'lpsSechedule',
              //   component:resolve=>require(['@/views/setting/schedule/LpsSechedule'],resolve)
              // },
              {
                path: '/patrolSechedule',
                name: 'patrolSechedule',
                component: resolve => require(['@/views/setting/schedule/PatrolSechedule'], resolve)
              }
            ]
          },
        );
        PermissionHelper.enableTitleSetting() && route5.children.push(
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
            path: '/title',
            name: 'titleManage',
            component: resolve => require(['@/views/setting/title/TitleSetting'], resolve),
            hidden: true,
            meta: {
              requireAuth: true
            },
            children: [
              {
                path: '/titleSetting',
                name: 'titleSetting',
                component: resolve => require(['@/views/setting/title/TitleSetting'], resolve)
              }
            ]
          },
        );
        route5.children.length > 0 ? accessedRoutes.push(route5) : '';
        accessedRoutes.push({
          'path': '*',
          'redirect': '/',
          'hidden': true
        });
        commit('SET_ROUTES', accessedRoutes);
        resolve(accessedRoutes);
      });
    },

    changeRoutes({ commit, dispatch }) {
      return new Promise(async resolve => {
        const result = await dispatch('GetUserAuthorities');
        resetRouter();
        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('generateRoutes');
        // dynamically add accessible routes
        router.addRoutes(accessRoutes);
        resolve();
      });
    }
  }
};

export default user;

