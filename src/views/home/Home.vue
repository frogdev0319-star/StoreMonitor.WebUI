<template>
  <div>
    <el-row class="container">
      <div class="header">
        <div
          :class="logoClass"
          class="logo-content">
          <img id="imgLogo" :src="collapsed ? miniImgSrc:imgSrc" alt="logo" @click="routerHome" >
          <div v-if="!collapsed" class="meta">{{ $t(`route.meta`) }}</div>
          <img
            :src=" collapsed ? arrowRightIcon : arrowLeftIcon "
            class="img-collapsed"
            @click="clickCollapse" >
        </div>
        <div>
          <el-breadcrumb separator="|" class="breadcrumb-inner">
            <el-breadcrumb-item
              v-for="(item, index) in breadList"
              v-if="index !== 0"
              :key="item.path"
              :to="{ path: item.path }"
              class="breadcrumb-item"
            >
              <span
                v-if="item.name!='remotePatrol'"
                :class="
                  index!=breadList.length-1
                    ? 'bold-breadcrumb-span'
                  : 'normal-breadcrumb-span'">
                {{ $t(`route.${item.name}`) }} </span>
                
                
              <span
                @click="backPage"
                v-if="item.name=='remotePatrol'"
                  :class="
                    showIgnoreItem
                      ? 'bold-breadcrumb-span'
                      : 'normal-breadcrumb-span'
                  "
                >
                {{ $t(`route.${item.name}`)}}</span>
              <span v-if="item.name=='remotePatrol' && showIgnoreItem && breadList.length==2"
                :class="'normal-breadcrumb-span'" >
                {{" | " + $t("remotePatrol.clickToContent")}}</span>

            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <div v-if="$route.path ==='/reportdetails'"
              style="background-color: transparent; color: #fff; border: none; position:absolute;top:15px;right:24px">
            <el-dropdown 
              style="display:flex; flex-direction: row-reverse; align-items: center;color: #fff;cursor: pointer;">
              <div class="button-area">
                <img :src="exportPdf" class="icon-excel" />
                <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
              </div>
              <el-dropdown-menu slot="dropdown" class="dropdown">
                <el-dropdown-item
                  class="dropdown-item"
                  style="width: calc(140/1920*100vw); padding-left: calc(20/1920*100vw);font-size:calc(14/1920*100vw);"
                  @click.native="handleDownload"
                >{{ $t('remotePatrol.exportPDF') }}</el-dropdown-item>
                <el-dropdown-item
                  class="dropdown-item"
                  style=" width: calc(140/1920*100vw); padding-left: calc(20/1920*100vw); font-size:calc(14/1920*100vw);"
                  @click.native="handleDownloadExcel"
                  >{{ $t('remotePatrol.exportExcel') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-button
            v-else-if="$route.path === '/patrolPersonStat'
              || $route.path === '/patrolCompareStat'
              || $route.path ==='/eventStat'
                || $route.path === '/patrolItem'
              || $route.path ==='/patrolEvaluation'"
            style="background-color: transparent; color: #fff; border: none; position:absolute;top:6px;right:24px"
            @click="handleDownload"
          >
          
          <div class="button-area" >
            <img :src="exportPdf" class="icon-excel" />
            <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
          </div>
            <!--<div>
              <img :src="exportPdf" class="icon-excel">
              <i class="iconfont icon-pdf export" />
              <span>{{ $t("remotePatrol.InspectionDetail") }}</span>
            </div>-->
          </el-button>
        </div>
      </div>

      <el-col
        :span="24"
        :style="
          $route.path === '/device' ||
          $route.path === '/storemanage' ||
          $route.path === '/event' ||
          $route.path === '/reinspection' ||
          $route.path === '/storemonitor/submit' ||
          $route.path === '/datacenter'
            ? { height: varyWindowHeight - 68 + 'px' }
            : { height: 'auto' }
        "
        class="main"
      >
        <!-- <div
          v-if="isMobile && !collapsed"
          class="drawer-bg"
          @click="handleClickOutside"
        /> -->
        <aside
          class="sider"
          :class="collapsed?'sider-collapsed':'sider-expand'"
        >
          <div v-if="!collapsed" class="brand-dev">
            <!-- <p class="brand-id">{{$t('route.brandId')}}<span style="font-family:'Noto Sans'">{{accountId}}</span></p> -->
            <el-select
              ref="fieldSelect"
              class="store-select"
              v-model="accountId"
              :disabled="brandDisabled"
              placeholder=""
              popper-class="brandSelect"
              @change="changeAccount">
              <el-option
                v-for="(item,index) in brandList"
                :key="index"
                :label="item.name"
                :value="item.accountId"
              />
            </el-select>
            <hr class="hr-horizontal">
          </div>
          <el-scrollbar
            ref="scroll"
            id="el-menuscrollbar"
            wrap-class="el-scrollbar__wrap"
          >
            <el-menu
              id="nav-menu"
              :default-active="activePath"
              :collapse="collapsed"
              :unique-opened="true"
              :collapse-transition="false"
              router
              @open="handleopen"
              @select="handleselect"
              :style="collapsed?{'margin-top':'calc(60/1920*100vw)'}:{}"
            >
              <div v-for="(item, index) in routerList" :key="index">
                <el-menu-item
                  v-if="item.leaf && item.children.length > 0"
                  :key="index"
                  :index="item.children[0].path"
                  :disabled="item.isReadOnly"
                  :style="{'paddingLeft':'calc(30/1920*100vw) !important','height': 'calc(66/1920*100vw)','lineHeight': 'calc(66/1920*100vw)'}"
                >
                  <img class="menu_img" :src="($route.name=='auth')? `./../static/img/menu/${index}.png`:`./static/img/menu/${index}.png`" />
                  <img class="menu_img-active" :src="($route.name=='auth')? `./../static/img/menu/${index}-active.png`:`./static/img/menu/${index}-active.png`" />
                  <span class="span1">{{collapsed ? "" : $t(`route.${item.children[0].name}`)}}</span>
                </el-menu-item>

                <!--multi nodes -->
                <el-submenu
                  v-if="!item.leaf"
                  :key="index"
                  :index="index+''"
                  :style="{}">
                  <template slot="title">
                    <img class="menu_img" :src="($route.name=='auth')? `./../static/img/menu/${index}.png`:`./static/img/menu/${index}.png`"/>
                    <img class="menu_img-active" :src="($route.name=='auth')? `./../static/img/menu/${index}-active.png`:`./static/img/menu/${index}-active.png`"/>
                    <span class="span2">{{collapsed ? "" : $t(`route.${item.name}`) }}</span>
                  </template>
                  <div v-for="child in item.children" :key="child.path">
                    <el-menu-item
                      v-if="!child.hidden && !child.threeChild"
                      :id="lang === 'en' ? 'en-childSubItem' : 'childSubItem'"
                      :style="{}"
                      :index="child.path"
                      :disabled="child.isReadOnly">
                      <div class="item-icon"></div>
                      <span  class="span3">{{ $t(`route.${child.name}`) }}</span>
                    </el-menu-item>
                    <el-submenu
                      v-else-if="!child.hidden && child.threeChild"
                      class="child-submenu"
                      :class="lang === 'en' ? 'three-child el-submenu-group' : 'zh-three-child'"
                      :style="{}"
                      :index="child.path"
                      :disabled="child.isReadOnly"
                      :key="child.path">
                      <template slot="title">
                        <div class="item-icon"></div>
                        <span  class="span4" :style="collapsed?{'margin-left':'0px'} : {'margin-left':'15px'}">{{ $t(`route.${child.name}`) }}</span>
                      </template>
                      <div v-for="grandChild in child.children" :key="grandChild.path">
                        <el-menu-item
                          v-if="!grandChild.hidden"
                          :style="varyWindowWidth<1366?{'padding-right':'0px'}:{}"
                          :index="grandChild.path"
                          :disabled="grandChild.isReadOnly"

                          class="submenu-item">
                          <template>
                            <span class="span5" style="margin-left: 30px">{{ $t(`route.${grandChild.name}`) }}</span>
                          </template>
                        </el-menu-item>
                      </div>
                    </el-submenu>
                  </div>
                </el-submenu>
              </div>
            </el-menu>
          </el-scrollbar>
          <div class="spacer"></div>
          <div class="headUrl-content flex-center">
            <el-dropdown class="el-user-drop" style="display:flex; flex-direction: row-reverse; align-items: center">
              <span v-if="!collapsed" class="username">
                {{ userName }}
                <i class="el-icon-arrow-down el-icon--right"/>
              </span>
              <div class="headImg" :style="collapsed?{}:{'margin-right':'calc(16/1920*100vw)'}">{{iconName}}</div>
              <el-dropdown-menu slot="dropdown" class="dropdown">
                <el-dropdown-item
                  v-if="hasMystery"
                  class="dropdown-item"
                  style="width: calc(140/1920*100vw); padding-left: calc(20/1920*100vw);font-size:calc(14/1920*100vw);"
                  @click.native="changeMimicMode">{{showMimicMode? $t('route.generalMode'):$t('route.mimicMode') }}</el-dropdown-item>
                <el-dropdown-item
                  :disabeled="true"
                  class="dropdown-item"
                  style="width: calc(140/1920*100vw); padding-left: calc(20/1920*100vw);font-size:calc(14/1920*100vw);"
                  @click.native="changePWD"
                >{{ $t('route.changePWD') }}
                </el-dropdown-item>
                <el-dropdown-item
                  class="dropdown-item"
                  style=" width: calc(140/1920*100vw); padding-left: calc(20/1920*100vw); font-size:calc(14/1920*100vw);"
                  @click.native="fedlogout">{{ $t('route.logOut') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </aside>
        <section :class="secClass">
          <el-col
            v-if="!showHeader"
            :class="wrapperAll ? 'content-wrapper-all' : 'content-wrapper'"
            :style="[
              showBorder ? { 'border-width': '0.5px' } : {},
              $route.path === '/reinspection' || $route.path === '/storemonitor' || $route.path === '/report'
                ? {
                    background:
                      '#f7f9fa url(./static/img/reinspection_bg.png) no-repeat 100% 0',
                  }
                : { 'background-color': '#f4f5f9' },
            ]"
          >
            <keep-alive :max="1">
              <router-view  :show-ignore="showIgnoreItem" v-on:listenerChild="listenerChild" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <router-view  :show-ignore="showIgnoreItem" v-on:listenerChild="listenerChild"  v-if="!$route.meta.keepAlive" />
          </el-col>
          <el-col v-else class="wrapper-header">
            <keep-alive :max="1">
              <router-view  :show-ignore="showIgnoreItem" v-on:listenerChild="listenerChild" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <router-view  :show-ignore="showIgnoreItem" v-on:listenerChild="listenerChild" v-if="!$route.meta.keepAlive" />
          </el-col>
          <el-col :sapn="24" class="footercontent">
            <footer class="footerInfo">
              <p style="text-align: left">
                v3.0.4.1
                 &copy; {{ getFullYear }} Advantech Intelligent City
                Services Co., Ltd. (AiCS) All Rights Reserved.
              </p>
            </footer>
          </el-col>
        </section>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import PubSub from 'pubsub-js';
import Database from '@/common/Database';
import util from '@/common/util.js';
import PermissionHelper from '../../api/PermissionHelper';
export default {
  name: "Home",
  data() {
    return {
      showTag: false,
      exportPdf: require('../../../static/img/export-pdf.png'),
      imgSrc: require("../../../static/img/logo.svg"),
      miniImgSrc: require("../../../static/img/logo_title-mini.png"),
      arrowRightIcon: require("../../../static/img/arrow-right.png"),
      arrowLeftIcon: require("../../../static/img/arrow-left.png"),
      userName: "Admin",
      iconName:"",
      headUrl: "",
      breadList: [],
      collapsed: this.$store.getters.collapsed,
      templateOptions: [],
      curTemplateIndex: 0,
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      route: this.$route,
      path: [
        "/routeinspection",
        "/storedetail",
        "/rate",
        "/storemonitor",
        "/schedule",
        "/reinspection",
        "/bindroute",
      ],
      wapper: false,
      curBrand: "",
      brandList: [],
      accountId: "",
      roleId: 0,
      lang: this.$i18n.locale,
      title: "",
      isMobile: false,
      brandDisabled: false,
      showIgnoreItem:false,
      showMimicMode:false,
      hasMystery:false
    };
  },

  computed: {
    getFullYear() {
      const date = new Date();
      const y = date.getFullYear();
      return y;
    },

    classObj() {
      return {
        "aside-collapse-width": this.collapsed,
        "aside-width": !this.collapsed,
        mobile: this.isMobile,
      };
    },

    secClass() {
      return {
        "sec-collapsed": this.collapsed,
        "sec-uncoll": !this.collapsed,
        "mobile-sec": this.isMobile,
      };
    },

    logoClass() {
      return {
        "logo-collapse-width": this.collapsed,
        "logo-width": !this.collapsed,
        "logo-mobile": this.isMobile,
      };
    },

    routerList() {
      //console.log("get routerList:",this.$store.getters.mimicMode);
      const routes = this.$store.state.user.routes
        .slice(1, this.$store.state.user.routes.length)
        .filter((route) => !route.hidden);
      console.log("get routerList > routes :",routes);
      return routes;
    },

    groupHeight() {
      return (this.varyWindowWidth * 70) / 1920;
    },

    wrapperAll() {
      let flag = true;
      this.path.forEach((item) => {
        flag = flag && this.$route.path !== item;
      });
      if (this.$route.path === "/storemonitor/submit" && this.wapper === true) {
        flag = true;
      }
      return flag;
    },

    showBorder() {
      const showBorderPathArr = [
        "/reinspection",
        "/storemonitor",
        "/rate",
        "/reinspect/confirmrein",
      ];
      return !showBorderPathArr.includes(this.$route.path);
    },

    showHeader() {
      const showBorderPathArr = [
        // "/report",
        "/patrolOverview",
        "/eventOverview",
        "/patrolEvaluation",
        "/patrolItem",
        "/supervisorStat",
        "/eventStat",
        "/storedetail",
        "/storemanage",
        "/bindroute",
        "/checkInStatistics",
        "/patrolCompareStat",
        "/patrolPersonStat",
      ];
      return showBorderPathArr.includes(this.$route.path);
    },

    curPath() {
      return this.route.path;
    },

    activePath() {
      let path = this.$route.path;
      // console.log("activePath:",path);
      // console.log("active rout name:",this.$route.name);
      const pathMapArr = [
        {
          curPath: ["/reinspect/confirmrein", "/reinspect/submit"],
          activePath: "/reinspection",
        },
        { curPath: ["/storemonitor/submit"], activePath: "/storemonitor" },
        { curPath: ["/reportdetails"], activePath: "/report" },
        { curPath: ["/rate"], activePath: "/event" },
        {
          curPath: ["/bindroute", "/addroute", "/setroute"],
          activePath: "/routeinspection",
        },
        { curPath: ["/storedetail"], activePath: "/storemanage" },
        { curPath: ["/ezvizeDeviceSetting"], activePath: "/ezvizDevice" },
        { curPath: ["/beseyeDeviceSetting"], activePath: "/beseyeAccount" },
        //   { curPath: ["/skywatchDeviceSetting"], activePath: "/skywatchAccount" },
        { curPath: ["/titleSetting"], activePath: "/title" },

        { curPath: ["/workflows/createWorkflow"], activePath: "/workflows" },
        { curPath: ["/workflows/workflowDetail"], activePath: "/workflows" },

        { curPath: ["/createWorkflow/createWorkflownode"], activePath: "/createWorkflow" },
        { curPath: ["/createWorkflow/createEditWorkflownode"], activePath: "/createWorkflow" },

        { curPath: ["/workflowDetail/workflownode"], activePath: "/workflowDetail" },


        { curPath: ["/audit/auditDetail"], activePath: "/audit" },
        { curPath: ["/audit/auditDetail/auditReportdetails"], activePath: "/auditDetail" },

        { curPath: ["/waitaudit/waitAuditDetail"], activePath: "/waitaudit" },
        { curPath: ["/audit/waitAuditDetail/waitAuditReportdetails"], activePath: "/waitAuditDetail" },
        { curPath: ["/audit/waitAuditDetail/handlingReportdetails"], activePath: "/handlingReportdetails" },

        
        { curPath: ["/transcriptnotify/transcriptnotifyAuditDetail"], activePath: "/transcriptnotify" },
        { curPath: ["/transcriptnotify/transcriptnotifyAuditDetail/transcriptnotifyReportdetails"], activePath: "/transcriptnotifyAuditDetail" },
        

        { curPath: ["/auditHandling"], activePath: "/waitaudit" },
        { curPath: ["/audit/auditHandling/reportdetails"], activePath: "/auditHandling" },
        //神秘客
        { curPath: ["/mysterioSetting"], activePath: "/mysterio" },

      ];
      const pathMAP = pathMapArr.find((item) => item.curPath.includes(path));
      if (pathMAP) {
        path = pathMAP.activePath;
        this.setBrandListDisabled(true);
      } else if(this.showMimicMode){
        this.setBrandListDisabled(true);
      }else {
        this.setBrandListDisabled(false);
      }
      return path;
    },

    cachePath(el) {
      return this.$store.state.cachePath;
    },

    ...mapGetters(["token", "name", "availabePathList","mimicMode","isMystery"]),
  },

  watch: {
    curBrand(val) {
      if (val.length === 0) {
        this.curBrand = this.accountId;
      }
    },

    curPath(val) {
      if (this.path.indexOf(val)) {
        this.wrapperAll = false;
      }
    },

    curTemplateIndex() {
      this.$store.dispatch("setCurTemplateIndex", this.curTemplateIndex);
    },
    "$store.getters.curTemplateIndex": function () {
      this.curTemplateIndex = this.$store.getters.curTemplateIndex;
    },
    "$store.getters.templateOptions": function () {
      this.templateOptions = this.$store.getters.templateOptions;
    },
    $route() {
      this.getBread();
    },
    mimicMode(){
      this.showMimicMode = this.$store.getters.mimicMode;
      
    },
    isMystery(){
      this.hasMystery = this.$store.getters.isMystery;
      console.log("hasMystery:",this.hasMystery);
    }
  },
  created() {
    const self = this;
    this.headUrl = "./static/img/admin.png";
    PubSub.subscribe("change-color", (event, data) => {
      self.showTag = data.showTag;
    });
    PubSub.subscribe("success-page", (event, data) => {
      if (data.changeStyle) {
        self.wapper = true; 
        
      }
    });
    
    window.addEventListener("resize", this.$_isMobile);
    self.$_isMobile();
    this.getBrandList();
    this.updateTitle();
  },

  mounted() {
    if (this.$refs.fieldSelect !== undefined) {
      this.$nextTick(() => {
        this.$refs.fieldSelect.$refs.scrollbar.$el.classList.add(
          "scroll-opacity"
        );
      });
    }
    this.$store.dispatch("GetIsMysteryMode");
    this.showMimicMode = this.$store.getters.ShowMimicMode;
    this.hasMystery = this.$store.getters.isMystery;
  },

  methods: {
    changeMimicMode(){
      var mode = !this.showMimicMode;
      this.showMimicMode = !this.showMimicMode;
      PermissionHelper.setShowMimicMode(this.showMimicMode);
      this.$store.dispatch('setMimicMode', mode);
      this.changeRoutes();
    },
    listenerChild(reply) {
      //console.log("listenerChil="+reply)
      this.showIgnoreItem = reply;
    },
    backPage(){
      this.showIgnoreItem  =false;
    },
    handleDownload() {
      // console.log(document.getElementById("downloadPdf"))
      // console.log(document.getElementById("downloadPdf").click)
      document.getElementById("downloadPdf").click();
    },
    handleDownloadExcel() {
      // console.log(document.getElementById("downloadPdf"))
      // console.log(document.getElementById("downloadPdf").click)
      document.getElementById("downloadExcel").click();
    },
    setBrandListDisabled(booleanFlag) {
      this.brandDisabled = booleanFlag;
    },

    handleClickOutside() {
      this.collapsed = true;
    },

    clickCollapse() {
      this.$store.dispatch("setCollapsed", !this.collapsed);
      this.collapsed = !this.collapsed;
    },

    handleopen(index) {
      setTimeout(() => {
        const height = this.$refs.scroll.wrap.scrollHeight;
        this.$nextTick(() => {
          this.$refs.scroll.wrap.scrollTop = height;
        });
      }, 300);
    },

    routerHome() {
      const url = sessionStorage.getItem("LoginURL");
      Database.destoryDB();
      window.location.href = url + "/homepage";
    },

    handleselect(key, keyPath) {
      if (this.isMobile) {
        this.collapsed = true;
      }
    },

    getBread() {
      this.breadList = [];
      const currentRoute = this.$route.fullPath;
      
      let matched = [];
      matched = this.$route.matched.filter((x) => x.name);
      matched.length === 2 &&
        this.setSecondLevelNavbarBread(matched, currentRoute);
      matched.length > 2 &&
        matched[0].name === "systemSetting" &&
        this.setSystemNavbarBread(matched, currentRoute);
      this.breadList = matched;

      // console.log('breadList ------>> ', this.breadList);
    },

    setScheduleBread(matched, currentRoute) {
      const routeNameAndPathMaps = [
        { path: ["/pointCheck"], name: "checkSchedule" },
        { path: ["/patrolSechedule"], name: "patrolSecheduleManage" },
      ];
      const pathAndNameMap = routeNameAndPathMaps.find((item) =>
        item.path.includes(currentRoute)
      );
      pathAndNameMap && (matched[2].name = pathAndNameMap.name);
      matched.splice(1, 1);
    },

    setSystemNavbarBread(matched, currentRoute) {
      const matchedParentName = matched[1].name;
      const inspectSettingNameArr = [
        "inspectSetting",
        "inspectingSettingOfInspectList",
        "inspectingSettingOfDevice",
        "inspectingSettingOfSchedule",
        "insepctionReportSetting",
      ];
      const deviceSettingNameArr = [
        "deviceManage",
        "ezvizDeviceMgt",
        "beseyeDeviceMgt",
      //  "skywatchDeviceMgt",
      ];
      if (inspectSettingNameArr.includes(matchedParentName)) {
        this.setInspectionSettingBread(matched, currentRoute);
      } else if (deviceSettingNameArr.includes(matchedParentName)) {
        this.setDeviceBread(matched, currentRoute);
      }
    },

    setFirstBread(matched, str) {
      matched[2].name = str;
      matched.splice(1, 1);
    },

    setSecondBread(matched, str, path) {
      matched[1].name = str;
      matched[1].path = path;
    
    },

    setInspectionSettingBread(matched, currentRoute) {
      switch (currentRoute) {
        case "/routeinspection": {
          this.setFirstBread(matched, "inspectingSettingOfInspectList");
          break;
        }
        case "/storemanage": {
          this.setFirstBread(matched, "inspectingSettingOfDevice");
          break;
        }
        case "/patrolSchedule": {
          this.setFirstBread(matched, "inspectingSettingOfSchedule");
          break;
        }
        case "/insepctionReportSetting": {
          this.setFirstBread(matched, "inspectingSettingOfReport");
          break;
        }
        case "/bindroute":
        case "/addroute":
        case "/setroute": {
          this.setSecondBread(
            matched,
            "inspectingSettingOfInspectList",
            "/routeinspection"
          );
          break;
        }
        case "/storedetail": {
          this.setSecondBread(
            matched,
            "inspectingSettingOfDevice",
            "/storemanage"
          );
          break;
        }
        default: {
          break;
        }
      }
    },

    setDeviceBread(matched, currentRoute) {
      switch (currentRoute) {
        case "/dashDevice": {
          this.setFirstBread(matched, "dashDeviceMgt");
          break;
        }
        case "/ezvizDevice": {
          this.setFirstBread(matched, "ezvizDeviceMgt");
          break;
        }
        case "/beseyeAccount": {
          this.setFirstBread(matched, "beseyeDeviceMgt");
          break;
        }
        case "/ezvizeDeviceSetting": {
          this.setSecondBread(matched, "ezvizDeviceMgt", "/ezvizDevice");
          break;
        }
        case "/beseyeDeviceSetting": {
          this.setSecondBread(matched, "beseyeDeviceMgt", "/beseyeAccount");
          break;
        }
        /*
        case "/skywatchAccount": {
          this.setFirstBread(matched, "skywatchDeviceMgt");
          break;
        }
        case "/skywatchDeviceSetting": {
          this.setSecondBread(matched, "skywatchDeviceMgt", "/skywatchAccount");
          break;
        }
        */
        default: {
          break;
        }
      }
    },

    setSecondLevelNavbarBread(matched, currentRoute) {
      const pathAndBreadMaps = [
        {
          paths: ["/storedetail"],
          parentBread: { path: "/storemanage", name: "storeManage" },
        },
        {
          paths: ["/titleSetting"],
          parentBread: { path: "/title", name: "titleManage" },
        },
        {
          paths: ["/workflowDetail"],
          parentBread: { path: "/workFlows", name: "workflowManage" },
        },
        {
          paths: ["/createWorkflow"],
          parentBread: { path: "/workFlows", name: "workflowManage" },
        },

        {
          paths: ["/createWorkflownode"],
          parentBread: { path: "/createWorkflow", name: "createWorkflow" },
        },
        {
          paths: ["/createEditWorkflownode"],
          parentBread: { path: "/createWorkflow", name: "createWorkflow" },
        },
        {
          paths: ["/workflownode"],
          parentBread: { path: "/workflowDetail", name: "workflowDetail" },
        },



        {
          paths: ["/auditDetail"],
          parentBread: { path: "/audit", name: "SendAuditManage" },
        },
        {
          paths: ["/auditReportdetails"],
          parentBread: { path: "/auditDetail", name: "reportdetailsAuditDetail" },
        },

        {
          paths: ["/waitAuditDetail"],
          parentBread: { path: "/waitaudit", name: "WaitAuditManage" },
        },

        {
          paths: ["/waitAuditReportdetails"],
          parentBread: { path: "/waitAuditDetail", name: "reportdetailsAuditHandling" },
        },

        {
          paths: ["/handingReportdetails"],
          parentBread: { path: "/auditHandling", name: "reportdetailsAuditHandling" },
        },

        {
          paths: ["/transcriptnotifyAuditDetail"],
          parentBread: { path: "/transcriptnotify", name: "TranscriptNotify" },
        },

        {
          paths: ["/transcriptnotifyReportdetails"],
          parentBread: { path: "/transcriptnotifyAuditDetail", name: "reportdetailsAuditTranscriptnotify" },
        },




        // {
        //   paths: ["/waitaudit/auditDetail"],
        //   parentBread: { path: "/waitaudit", name: "WaitAuditManage" },
        // },


        
        // {
        //   paths: ["/transcriptnotify/auditDetail"],
        //   parentBread: { path: "/transcriptnotify", name: "TranscriptNotify" },
        // },
        




        {
          paths: ["/auditHandling"],
          parentBread: { path: "/waitaudit", name: "WaitAuditManage" },
        },
        {
          paths: ["/audit/auditDetail/reportdetails"],
          parentBread: { path: "/auditDetail", name: "reportdetailsAuditDetail" },
        },
        {
          paths: ["/audit/auditHandling/reportdetails"],
          parentBread: { path: "/auditHandling", name: "reportdetailsAuditHandling" },
        },


        {
          paths: ["/addroute", "/setroute", "/bindroute"],
          parentBread: { path: "/routeinspection", name: "inspectSetting" },
        },
        {
          paths: ["/rate"],
          parentBread: { path: "/event", name: "eventManage" },
        },
        {
          paths: ["/reportdetails"],
          parentBread: { path: "/report", name: "reports" },
        },
        {
          paths: ["/storemonitor/submit"],
          parentBread: { path: "/storemonitor", name: "storeMonitor" },
        },
        {
          paths: ["/reinspect/confirmrein", "/reinspect/submit"],
          parentBread: { path: "/reinspection", name: "remotePatrol" },
        },
        //神秘客
        {
          paths: ["/mysterioSetting"],
          parentBread: { path: "/mysterio", name: "MysterioManage" },
        },

      ];
      const pathAndBreadMap = pathAndBreadMaps.find((map) =>
        map.paths.includes(currentRoute)
      );
      pathAndBreadMap && matched.splice(1, 0, pathAndBreadMap.parentBread);
    },

    getWindowSize() {
      let docEl = document.documentElement,
        resizeEvt =
          "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function () {
          if (docEl.clientWidth > 1450) {
            docEl.style.fontSize = 16;
          } else {
            docEl.style.fontSize = docEl.clientWidth / 90 + "px";
          }
        };
      window.addEventListener(resizeEvt, recalc, false);
      document.addEventListener("DOMContentLoaded", recalc, false);
    },

    fedlogout() {
      Database.destoryDB();
      const url = sessionStorage.getItem("LoginURL");
      let nowHref = window.location.href;
      if(!nowHref.includes("http://localhost:8088/"))
        window.location.href = url;
      else this.$router.push({ name: 'Login'})

    },
    changePWD(){
      const url = sessionStorage.getItem("LoginURL")+"/changepwd";
      window.location.href = url;
    },
    logOut() {
      const self = this;
      self.$store.dispatch("logout").then(() => {});
    },
    async getBrandList() {
      await this.changeRoutes();
      // console.log("Get Brand List");
      this.brandList = JSON.parse(sessionStorage.getItem("brandList"));
      // console.log(this.brandList);
      const idIndex = this.brandList
        .map((item) => item.accountId)
        .indexOf(this.accountId);
      idIndex !== -1 &&
        sessionStorage.setItem("accountName", this.brandList[idIndex].name);
      sessionStorage.setItem("accountId", this.accountId);
      this.getBread();
    },

    changeAccount(accountId) {
      const self = this;
      const idIndex = this.brandList
        .map((item) => item.accountId)
        .indexOf(accountId);
      let data = null;
      if(idIndex !== -1)
        data = this.brandList[idIndex].srp.find(item=>item.type == "Custom_Inspection");
      // console.log("Change Account")
      // console.log(this.brandList[idIndex])


      if(!data || !data.enable){
        this.accountId = this.orgAccountId
        util.notify(self.$t('route.noInspectionAccessRights'), 'warning', 3000);
        return ;
      }

      const params = {
        accountId: accountId,
      };
      // console.log("Change Account:",this.orgAccountId,this.accountId)
      self.$store.dispatch("changeAccount", params).then((res) => {
        if (res.errCode === 0) {
          sessionStorage.setItem("accountName", this.brandList[idIndex].name);
          sessionStorage.setItem("accountId", this.accountId);
          self.changeRoutes();
          self.$route.meta.keepAlive = false;
          self.$store.dispatch("GetIsMysteryMode");
        }
        else{
          this.accountId = this.orgAccountId
          util.notify(self.$t('route.accountTerminated'), 'warning', 3000);
        }
      });
      
    },

    async changeRoutes() {
      // console.log("Change Routes");
      const self = this;
      const result = await self.$store.dispatch("GetUserAuthorities");
      
      if (result.errCode === 0) {
        await self.$store.dispatch("generateRoutes");
        self.getUserName(result.data);
        const availablePathesList = this.availabePathList;
        if (availablePathesList.includes("/noRight")) {
          this.$router.push("/noRight");
        } else if (!availablePathesList.includes(this.$route.path)) {
          this.$router.push(availablePathesList[0]);
        } else {
          // console.log(this.$route.path);
          this.$router.push(this.$route.path);
        }
      }
    },

    getUserName(result) {
      const self = this;
      self.userName =
        result.userName.length > 10
          ? result.userName.substr(0, 10) + "..."
          : result.userName;
      self.orgAccountId = result.accountId;
      self.accountId = result.accountId;
      var un = result.userName.split(' ');
      self.iconName = (un.lenght>1)? un[0].substr(0, 1)+un[1].substr(0, 1) : un[0].substr(0, 1);
      const accountId = result.accountId.toLowerCase();
      localStorage.setItem("oss_bucket", accountId);
    },

    updateTitle() {
      document.title = this.$t("route.meta");
    },

    $_isMobile() {
      const { body } = document;
      const rect = body.getBoundingClientRect();
      if (rect.width - 1 < 1366) {
        this.collapsed = true;
      }
      this.isMobile = rect.width - 1 < 1366;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-menu--collapse {
  width: unset;
}
.brand-id{
    font-size: 12px;
    font-family: "Roboto", sans-serif, "微软雅黑";
    line-height: 12px;
    padding-left: 0;
    width: calc(52/1920*100vw + 40px);
    margin-bottom: 8px;
    font-weight: normal;
    color: #a5a5a5;
    padding-top: 0vw;
    white-space: nowrap;
    span{
      font-size: 12px !important;
      margin-left:0px !important;
    }

}
.store-select {
  /deep/ .el-input__inner {
    border: none;
    padding-left: 0;
    padding-bottom: 0.625vw;
    font-size: calc(22/1920*100vw);
    background-color: #FFF;
    color: #484848;
    height: calc(40/1920*100vw);
  }
    /deep/
    .el-select__caret{
      color:#1375bc !important;
      font-weight: bold !important;
    }

}
.sider-collapsed {
  width: calc(90/1920*100vw);
}
.sider-expand {
  width: calc(280/1920*100vw);
}
.brand-dev {
  width: calc(236/1920*100vw);
  margin-left: calc(32/1920*100vw);
  margin-right: auto;
  margin-bottom: calc(50/1920*100vw);
  margin-top: calc(90/1920*100vw);
}
.item-icon {
  margin-left: 0px !important;
  display:inline-block;
  height:5px;
  width: 5px;
  border-radius:50%;
  background-color:#a5a5a5;
  // margin-right: calc(12 / 1920 * 100vw);
}
.sider {
  transition: width .3s;
  position: fixed;
  display: flex;
  height: calc(100vh - 62/1920*100vw);
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);

  .is-active {
    .span4 {
      // color:#006ab7 !important;
    }
  }
  span {
    
    color:#a5a5a5;
    margin-left: 15px;
    @media screen and (max-width:1367px) { 
      font-size: 10px;
    }
    @media screen and(min-width: 1367px){
      font-size: 14px;
    }
  }

  /deep/ .el-menu--collapse {
    i {
      display: none;
    }
  }
  /deep/ .el-menu {
    border-right: none;
    font-size: 14px;
    // overflow-y: auto;
    // overflow-x: hidden;

  }
  /deep/ .el-menu-item {
    text-align: left;
    height: 2.1875vw;
    line-height: 2.1875vw;
    padding-left: calc(40/1920*100vw) !important;
    .menu_img {
      height: 1.35417vw;
      width: 1.35417vw;
      display: inline-block;
    }
    .menu_img-active {
      display: none;
    }
    &.is-active {
      background-color: #f2f9fe;
      .item-icon {
        background-color:#006ab7;
      }
      span {
        color: #006ab7;
      }
      .menu_img {
        display: none;
      }
      .menu_img-active {
        display: inline-block;
        height: 1.35417vw;
        width: 1.35417vw;
      }
    }
    &:hover {
      .item-icon {
        background-color:#006ab7;
      }
      .menu_img {
        display: none;
      }
      .menu_img-active {
        display: inline-block;
        height: 1.35417vw;
        width: 1.35417vw;
      }
      background-color: #f2f9fe;
      span {
        color: #006ab7;
      }
    }

  }
  /deep/ .el-submenu {
    text-align: left;
    .menu_img {
      height: 1.35417vw;
      width: 1.35417vw;
      display: inline-block;
    }
    .menu_img-active {
      display: none;
    }
    span {
      color:#a5a5a5;
    }
    ul {
        span {
          font-size: calc(12 / 1920 * 100vw);
        }
      }
      .el-submenu__title {
        padding-left: calc(30/1920*100vw) !important;
      }
    &.is-opened {
      background-color: #e4f3fd;
      .el-submenu__title {
        padding-left: calc(30/1920*100vw) !important;
        .span2 {
          color: #006ab7;
        }
      }
      .menu_img {
        display: none;
      }
      .menu_img-active {
        height: 1.35417vw;
        width: 1.35417vw;
        display: inline-block;
      }
      ul {
        span {
          font-size: calc(12 / 1920 * 100vw);
        }
        background-color: #f2f9fe;
      }
    }
    &.is-active {
      background-color: #e4f3fd;
      .el-submenu__title {
        padding-left: calc(30/1920*100vw) !important;
        height: calc(66/1920*100vw);
        line-height: calc(66/1920*100vw);
        .span2 {
          color: #006ab7;
        }
      }
      .menu_img {
        display: none;
      }
      .menu_img-active {
        height: 1.35417vw;
        width: 1.35417vw;
        display: inline-block;
      }
      ul {
        span {
          font-size: calc(12 / 1920 * 100vw);
        }
        background-color: #f2f9fe;
      }
    }

    .child-submenu {
      .el-submenu__title {
        padding-left: calc(40/1920*100vw) !important;
        height: 2.1875vw;
        line-height: 2.1875vw;
        &:hover {
          .item-icon {
              background-color: #006ab7;
          }
          .span4 {
            color: #006ab7 !important;
          }
        }
      }
      &.is-opened {
      .el-submenu__title {
          padding-left: calc(40/1920*100vw) !important;
          .span4 {
            color: #006ab7;
          }
          .item-icon {
              background-color: #006ab7;
          }
        }
      }
    }
    .el-submenu__title {
      padding-left: calc(40/1920*100vw);
      padding-right: calc(30/1920*100vw);
      //padding: 0 calc(30 / 1920 * 100vw);
      //margin-left: 10px;
      height: calc(66/1920*100vw);
      line-height: calc(66/1920*100vw);
      i {
        right: 32px;
      }

      &:hover {
        background-color: #e4f3fd !important;
        .span2 {
          color: #006ab7 !important;
        }
        .menu_img {
          display: none;
        }
        .menu_img-active {
          display: inline-block;
          height: 1.35417vw;
          width: 1.35417vw;
        }
      }
    }
    .submenu-item{
      padding-left: calc(40/1920*100vw) !important;
    }
  }

}
.el-menu--vertical .el-menu--popup .el-menu-item {
    &.is-active {
      background-color: #f2f9fe;
      .item-icon {
        background-color:#006ab7;
      }
      span {
        color: #006ab7;
      }
    }
    &:hover {
      background-color: #e4f3fd !important;
      span {
        color: #006ab7 !important;
      }
    }
  }
  .el-menu--vertical .el-menu--popup .el-submenu{
    .el-submenu__title {
      &:hover {
        background-color: #e4f3fd !important;
        span {
          color: #006ab7 !important;
        }
      }
    }
    /deep/
    .el-submenu__title {
      &:hover {
          background-color: #e4f3fd !important;
      }
    }
  }
  .el-popper {
    /deep/
    .el-dropdown-menu__item{
      &:hover {
        background-color: #e4f3fd !important;
        color: #006ab7 !important;
      }
      &:focus {
        background-color: #e4f3fd !important;
        color: #006ab7 !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
$border: #393b4c;
$collapseWidth: 5.5%;
//rem(val)
@function rem($val) {
  @return $val/16 + rem;
}
@function checkRem($val) {
  @if ($val==auto) {
    @return auto;
  } @else if($val==0) {
    @return 0;
  } @else {
    @return rem($val);
  }
}
@mixin point($poi, $val) {
  #{$poi}: checkRem($val);
}
@mixin borderColor {
  // & {
  //   :after {
  //     position: absolute;
  //     bottom: 0;
  //     left: 0;
  //     width: 100%;
  //     height: 0.55px;
  //     background-color: #a9a9a9;
  //     content: " ";
  //     display: block;
  //     transform: scaley(0.1);
  //   }
  // }
}
* {
  margin: 0px;
}
.report-input {
  /deep/ .el-input__inner {
    background-color: rgba(255, 255, 255, 0.2);
    height: 36px;
    color: #fff;
    border: none;
  }
}
.navIcon {
  display: inline-block;
  font-size: calc(32 / 1920 * 100vw);
  color: #fff;
  margin-right: calc(36 / 1920 * 100vw);
}
.en-navIcon {
  display: inline-block;
  font-size: calc(32 / 1920 * 100vw);
  color: #fff;
  margin-right: calc(36 / 1920 * 100vw);
}
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-x:hidden;
  .header {
    width: 100%;
    z-index: 999;
    display: flex;
    position: fixed;
    background-color: #1375bc;
    min-width: 1000px;
    .logo-width {
      #imgLogo {
        width: calc(153 / 1920 * 100vw);
      }
      width: calc(280 / 1920 * 100vw);
    }
    .logo-collapse-width {
      width: calc(90 / 1920 * 100vw);
    }
    .logo-collapse-width.logo-mobile {
      width: calc(90 / 1920 * 100vw);
      img {
        // display: none;
      }
    }
    .logo-width.logo-mobile {
      width: calc(280 / 1920 * 100vw);
    }
    .logo {
      height: calc(80 / 1920 * 100vw);
      line-height: calc(80 / 1920 * 100vw);
    }
    .logo-content {
      background-color: #ffffff;
      @include borderColor;
      cursor: pointer;
      position: relative;
      #imgLogo {
        position: absolute;
        left: calc(32/1920*100vw);
        top: calc(38/1920*100vw);
      }
      .sys-name {
        font-weight: bold;
        color: #f6f9fe;
        font-size: calc(24 / 1920 * 100vw);
      }
    }
    .logo-collapse-width #imgLogo {
      position: absolute;
      height: 1.66667vw;
      width: 1.66667vw;

      left: calc(28/1920*100vw);
      top: calc(43/1920*100vw);
    }
    .el-traggle-content {
      height: 100%;
      width: 28px;
      border-right: 1px solid #e3e9f4;
      background-color: #fff;
      position: relative;
      .icon-outdent,
      .icon-indent {
        font-size: 24px;
        cursor: pointer;
        color: #7d8cad;
      }
    }
    .breadcrumb-inner {
      float: left;
      .breadcrumb-item {
        min-height: calc(62/1920*100vw);
        height: calc(62/1920*100vw);
        line-height: calc(62/1920*100vw);
        font-size: 16px;
        &:first-child {
          margin-left: 30px;
        }
        .bold-breadcrumb-span {
          font-weight: normal;
          opacity: 0.6;
          color: #ffffff;
        }
        .normal-breadcrumb-span {
          font-weight: normal;
          color: #ffffff;
        }
      }
    }

  }

  .img-collapsed {
    position: absolute;
    right:0;
    top: calc(15/1920*100vw);
    width: calc(31/1920*100vw);
    height: calc(31/1920*100vw);
  }
  .meta {
    position: absolute;
    left: calc(32/1920*100vw);
    top: calc(75/1920*100vw);
    font-size: calc(15/1920*100vw);
    font-weight: bold;
  }
  .main {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(62/1920*100vw);
    height: calc(100vh - 62/1920*100vw)!important;
    bottom: 0px;
    background-color: #f4f5f9;
    .drawer-bg {
      background: #fff;
      opacity: 0;
      width: 100%;
      top: 0;
      height: 100%;
      position: fixed;
      z-index: 1;
    }
    .brand-panel {
      background-color: #ffffff;
      text-align: left;
      padding: 20px 0px 20px 0px;
      margin-left: 32px;
      margin-right: 32px;
      margin-bottom: 30px;
      border-bottom: 1px solid $border;
      .brand-label {
        display: block;
        color: #484848;
        font-size: calc(16 / 1920 * 100vw);
      }
      .brand-list {
        color: #484848;
        width: 100%;
        text-align: center;
        min-width: 180px;
      }
      /deep/ .el-input--suffix .el-input__inner {
        padding-left: 0;
      }

    }
    .collapsed-brand-panel {
      height: 40px;
      border-bottom: 1px solid $border;
    }
    .brand-title {
      background-color: #ffffff;
      .item-content {
        background-color: #ffffff;
        .item-details {
          height: 45px;
          line-height: 45px;
          span {
            color: #fff;
            margin-left: 60px;
            font-size: 16px;
          }
        }
      }
      .brand-name {
        @include point(font-size, 18);
        color: #fff !important;
      }
    }
    .en-icon-content {
      float: left;
      margin-right: calc(48 / 1920 * 100vw);
      width: 10px;
      position: relative;
      height: 100%;
      font-size: calc(20 / 1920 * 100vw);
      transform: scale(0.5);
      color: #a0a4ad;
    }
    .tag-icon {
      width: 10px;
      height: 10px;
      background-color: white;
      border-radius: 50%;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      position: absolute;
      top: 50%;
      margin-top: -3px;
    }
    .content-wrapper-all {
      height: 100%;
      padding: 30px calc(30 / 1920 * 100vw);
      width: 100%;
      //@include point(margin-right,50);

      min-height: calc(100vh - 80px - 45px);
    }
    .content-wrapper {
      height: auto;
      padding: 30px calc(30 / 1920 * 100vw);
      width: 100%;
      min-height: calc(100vh - 80px - 45px);
      //@include point(margin-right,50);
    }
    .wrapper-header {
      height: auto;
      padding-bottom: 30px;
      // background-color: #f4f5f9;
      background-image: linear-gradient(#f7f9fa, #f7f9fa 100%);
      background-size: 100% calc(100% - 115px);
      background-repeat: no-repeat;
      background-position: center bottom;
      min-height: calc(100vh - 80px - 45px);
    }
    .footercontent {
      padding: 0px 0 30px calc(60 / 1920 * 100vw);
      font-size: 14px;
      background-color: #f4f5f9;
      color: #444;
    }
  }
  .headUrl-content {
      float: right;
      color: #fff;
      position: relative;
      overflow: hidden;
      display: inline-flex;
      justify-content: flex-start;
      align-items: end;
      padding: 0.9375vw 1.66667vw 1.25vw 1.66667vw;
      height: 4.6875vw;
      .el-user-drop {
        .username {
          font-weight: normal;
          color: #006ab7;
          margin-left: 0;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          i {
            color: #006ab7;;
            font-weight: bold;
            margin-left: 6px;
            cursor: pointer;
            display: none;
          }
        }
        .headImg {
          display: inline-block;
          position: relative;
          line-height: 2.5vw;
          height: 2.5vw;
          width: 2.5vw;
          cursor: pointer;
          border-radius: 50%;
          background: #2c90d9;
          color: #fff;
          text-align: center;
          font-size: 18px;
        }
        .dropdown {
          margin-top: 0px;
          .dropdown-item {
            width: 120px !important;
            padding-left: 20px !important;
          }
        }
      }
    }
  .aside-width {
    width: calc(350/1920*100vw);
    min-width: 290px;
    background-color: #ffffff;
    margin-top: -0.5px;
    transition: width 0.1s;
    /*overflow: scroll;*/
  }
  .aside-width.mobile {
    position: fixed;
    z-index: 1000;
    width: calc(350 / 1920 * 100vw);
    min-width: 290px;
  }
  .aside-collapse-width {
    width: calc(100 / 1920 * 100vw);
    overflow: hidden !important;
    background-color: #ffffff;
    transition: width 0.1s;
  }
  .aside-collapse-width.mobile {
    transform: translate(calc(-290px), 0);
  }
  .sec-collapsed {

    margin-left: calc(90 / 1920 * 100vw);
    width: calc(100% - 90 / 1920 * 100vw);
    height: auto;
  }
  .mobile-sec {
    margin-left: calc(90 / 1920 * 100vw);
    //min-width: 1000px;
    //width: 100%;
  }
  .sec-uncoll {
    margin-left: calc(280/1920*100vw);
    height: auto;;
    width: calc(100% - 280/1920*100vw);
    min-width: calc(1000px - 280/1920*100vw);
    @media screen and (max-width: 1590px) {
      margin-left: calc(280/1920*100vw);
      width: calc(100% - 280/1920*100vw);
    }
  }
  .sec-uncoll.mobile-sec {
    margin-left: calc(280 / 1920 * 100vw);
    width: 100%;
  }
  .menu li {
    margin-left: 80px;
    text-align: center;
  }
}
.el-collapse-item__content {
  padding-bottom: 0px !important;
}
.el-submenu__icon-arrow {
  margin-right: calc(30 / 1920 * 100vw) !important;
  color: #fff !important;
}
.el-select-dropdown__item {
  background-color: #fff;
  color: #484848;
  font-size: calc(24 / 1920 * 100vw) !important;
  font-family: "NotoSansCJKtc", "Microsoft YaHei", "Microsoft JhengHei", SimHei,
    Arial;
}
.options {
  padding-left: calc(20/1920*100vw);
  font-size: calc(24 / 1920 * 100vw) !important;
  font-family: "NotoSansCJKtc", "Microsoft YaHei", "Microsoft JhengHei", SimHei,
    Arial;
  height: 60px;
  line-height: 60px;
  color: #484848;
}
#el-menuscrollbar {
  height: calc(100% - 225px);
}
.aside-collapse-width #el-menuscrollbar {
  height: calc(100% - 40px);
}
/deep/ #el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
/deep/ #el-menuscrollbar .el-scrollbar__wrap .el-scrollbar__bar.is-horizontal {
  display: none !important;
}
</style>
<style  lang="scss">
.el-select-dropdown
  .scroll-opacity.el-scrollbar
  .el-scrollbar__bar.is-vertical {
  opacity: 1;
}
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #e3e9f4;
}
.el-table .cell {
  word-break: break-word;
  text-overflow: clip;
}
.el-message__content,
.el-button,
.el-time-panel__btn,
.el-time-panel,
.el-popper,
.el-range-input {
  font-family: NotoSansCJKtc, "Microsoft YaHei";
}
</style>

<style lang="scss">
.paper {
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
}
.shadow-light {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
.flex {
  display: flex;
}
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-center {
  display: flex;
  align-items: center;
}
.block {
  display: block;
}
.fullWidth {
  width: 100%;
}
.padding-sm {
  padding: calc(16/1920*100vw);
}
.padding-bottom-sm {
  padding-bottom: calc(16/1920*100vw);
}
.padding-vertical-sm {
  padding: calc(16/1920*100vw) 0;
}
.padding-right {
  padding-right: calc(20/1920*100vw);
}
.padding-vertical {
  padding: calc(20/1920*100vw) 0;
}
.padding-horizontal-sm {
  padding: 0 calc(16/1920*100vw);
}
.padding-horizontal {
  padding: 0 calc(20/1920*100vw);
}
.padding {
  padding: calc(20/1920*100vw);
}
.margin-horizontal-sm {
  margin: 0 calc(16/1920*100vw);
}
.margin-bottom-top-sm {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
.margin-bottom-mini {
  margin-bottom: 5px;
}
.margin-bottom-sm {
  margin-bottom: calc(16/1920*100vw);
}
.margin-right-md {
  margin-right: calc(20/1920*100vw);
}
.margin-top-md {
  margin-top: calc(20/1920*100vw);
}
.margin-bottom-md {
  margin-bottom: calc(20/1920*100vw);
}
.margin-left-md {
  margin-left: calc(20/1920*100vw);
}
.margin-md {
  margin: calc(20/1920*100vw);
}
.font-size-sm {
  font-size: calc(12/1920*100vw);
}
.font-size-md {
  font-size: calc(15/1920*100vw);
}
.spacer {
  flex: 1;
}
.text-left {
  text-align: left;
}
.el-date-table td.current:not(.disabled) span {
  background-color: rgb(0, 106, 183);
}
.el-time-panel__btn.confirm {
  color: rgb(0, 106, 183);
}
.storevue-datepicker {
  i {display: none;}
  width: calc(150/1920*100vw) !important;
  .el-input__inner {
    @media screen and (max-width:1367px) { 
      width: calc(160/1920*100vw);
    }
    @media screen and(min-width: 1367px){
      width: calc(150/1920*100vw);
    }
    height: calc(36/1920*100vw);
    
    color: #484848;
    font-size: calc(15/1920*100vw);
    border-color: #e6e6e6;
    padding-left: calc(52/1920*100vw);
    padding-right: calc(15/1920*100vw);
    background: url("~@/../static/img/calender.svg") no-repeat;
    background-position: center left calc(16/1920*100vw);
  }
}
.storevue-timepicker {
  i {display: none;}
  width: calc(150/1920*100vw) !important;
  .el-input__inner {
    height: calc(36/1920*100vw);
    width: calc(150/1920*100vw);
    color: #484848;
    font-size: calc(15/1920*100vw);
    border-color: #e6e6e6;
    padding-left: calc(52/1920*100vw);
    padding-right: calc(15/1920*100vw);
    background: url("~@/../static/img/timepicker.svg") no-repeat;
    background-position: center left calc(16/1920*100vw);
  }
}
.hr-vertical {
  margin: 0;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  border-width: 0;
  border-style: solid;
  border-color: rgba(117, 117, 117, 0.2);
  border-bottom-width: 0;
  height: auto;
  border-right-width: thin;
  -webkit-align-self: stretch;
  -ms-flex-item-align: stretch;
  align-self: stretch;
}
.hr-horizontal {
  margin: 0;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  border-width: 0;
  border-style: solid;
  border-color: rgba(117, 117, 117, 0.2);
  border-bottom-width: thin;
}
.child-space {
  &:not(:first-child) {
    margin-left: calc(20/1920*100vw);
  }
}
/*.el-dialog__headerbtn {
  display: none;
}*/
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
.button-area .icon-excel{
  height: calc(24/1920*100vw);
  width: calc(24/1920*100vw);
  margin-right: calc(8/1920*100vw);
}

</style>
