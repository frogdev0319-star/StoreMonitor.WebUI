<template>
  <div>
    <el-row class="container">
      <div class="header">
        <div :class="logoClass" class="logo-content">
          <img id="imgLogo" :src="imgSrc" alt="logo" @click="routerHome">
        </div>
        <div class="el-traggle-content">
          <img :src="collapsed ? arrowRightIcon: arrowLeftIcon" @click="clickCollapse" width="28px">
        </div>
        <div>
          <el-breadcrumb separator="|" class="breadcrumb-inner" >
            <el-breadcrumb-item
              v-for="(item,index) in breadList"
              v-if="index !== 0"
              :key="item.path"
              :to="{ path:item.path}"
              class="breadcrumb-item" >
              <span :class="breadList.length > 2 && index === 1 ? 'normal-breadcrumb-span': 'bold-breadcrumb-span'">
                {{ $t(`route.${item.name}`) }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      
      <el-col
        :span="24"
        :style="($route.path === '/device' || $route.path === '/storemanage' || $route.path === '/event'
          || $route.path === '/reinspection' || $route.path === '/storemonitor/submit' || $route.path === '/datacenter')?
        {'height':(varyWindowHeight-68)+'px'}:{'height':'auto'}"
        class="main">
        <div v-if="isMobile && !collapsed" class="drawer-bg" @click="handleClickOutside" />
        <aside :class="classObj" class="aside-menu">
          <div v-if="!collapsed" class="brand-panel">
            <el-select
              ref="fieldSelect"
              v-model="accountId"
              :disabled="brandDisabled"
              placeholder=""
              popper-class="brandSelect"
              class="brand-list"
              @change="changeAccount">
              <el-option
                v-for="(item,index) in brandList"
                :key="index"
                :label="item.name"
                :value="item.accountId"
                class="options"/>
            </el-select>
          </div>
          <div v-else class="collapsed-brand-panel"/>
          <el-scrollbar id="el-menuscrollbar" ref="scroll">
            <el-menu
              id="nav-menu"
              :default-active="activePath"
              :collapse="collapsed"
              :unique-opened="true"
              :collapse-transition="false"
              class="el-menu-vertical-demo"
              text-color="#eee"
              background-color="#ffffff"
              router
              style="border:0px;"
              @open="handleopen"
              @select="handleselect">
              <template v-for="(item,index) in routerList">
                <template v-if="!item.hidden">
                  <!--one node-->
                  <el-menu-item
                    v-if="item.leaf && item.children.length > 0"
                    :id="lang === 'en'? 'en-groupSubItem': 'groupSubItem'"
                    :key="index"
                    :index="item.children[0].path"
                    :disabled="item.isReadOnly"
                    class="submenu-item"
                    style="text-align:left;">
                    <i
                      v-if="lang === 'en'"
                      :class="item.iconCls"
                      :style="collapsed ? {'margin-left':'0'}:{}"
                      class="en-navIcon"/>
                    <i v-else :class="item.iconCls" :style="collapsed ? {'margin-left' : '0'}:{}" class="navIcon"/>
                    <span>{{ collapsed ? '': $t(`route.${item.children[0].name}`) }}</span>
                  </el-menu-item>
                                      
                  <!--multi nodes -->
                  <el-submenu
                    v-if="!item.leaf"
                    :key="index"
                    :index="index+''"
                    :style="groupHeight+'px'"
                    class="el-submenu-content"
                    style="text-align:left;">
                    <template slot="title">
                      <i
                        v-if="lang === 'en'"
                        :class="item.iconCls"
                        :style="collapsed ? {'margin-left':'0'} : {}"
                        class="en-navIcon"/>
                      <i v-else :class="item.iconCls" :style="collapsed ? {'margin-left':'0'} : {}" class="navIcon"/>
                      <span :class="lang === 'en' ? 'en-el-submenu-group' : 'el-submenu-group'">
                        {{ $t(`route.${item.name}`) }}</span>
                    </template>
                    <el-menu-item
                      v-for="child in item.children"
                      v-if="!child.hidden && !child.threeChild"
                      :id="lang === 'en' ? 'en-childSubItem' : 'childSubItem'"
                      :style="groupHeight+'px'"
                      :index="child.path"
                      :disabled="child.isReadOnly"
                      :key="child.path"
                      class="submenu-item"
                      style="padding-left: 30px;color:#a0a4ad;">
                      <template slot="title">
                        <i class="iconfont icon-yuandian icon-content"/>
                        <span >{{ $t(`route.${child.name}`) }}</span>
                        <div
                          v-if="child.name === 'storeManage' && showTag"
                          style="display:inline-block; width:8px;height:8px;background-color:#a5a5a5;border-radius:50%;margin-left:10px;"/>
                      </template>
                    </el-menu-item>
                    <el-submenu
                      v-else-if="!child.hidden && child.threeChild"
                      :class="lang === 'en' ? 'three-child el-submenu-group' : 'zh-three-child'"
                      :style="varyWindowWidth < 1366 ? {'padding-right':'0px'} : {}"
                      :index="child.path"
                      :disabled="child.isReadOnly"
                      :key="child.path"
                      style="padding-left: 0px">
                      <template slot="title">
                        <i class="iconfont icon-yuandian icon-content"/>
                        <span
                          :class="lang === 'en' ? 'en-el-submenu-group' : 'el-submenu-group'"
                          :id="lang === 'en' ? 'en-childSubItem' : 'childSubItem'"
                          class="third-title">
                          {{ $t(`route.${child.name}`) }}</span>
                      </template>
                      <el-menu-item
                        v-for="grandChild in child.children"
                        v-if="!grandChild.hidden"
                        :style="varyWindowWidth<1366?{'padding-right':'0px'}:{}"
                        :index="grandChild.path"
                        :disabled="grandChild.isReadOnly"
                        :key="grandChild.path"
                        class="submenu-item">
                        <template>
                          <span
                            :class="lang === 'en' ? 'third-child-span' : 'zh-third-child-span'">
                            {{ $t(`route.${grandChild.name}`) }}</span>
                        </template>
                      </el-menu-item>
                    </el-submenu>
                  </el-submenu>
                  <div  :key="index" class="bottomline"/>
                </template>
              </template>

            </el-menu>
          </el-scrollbar>
          
        <div class="headUrl-content flex-center" style="justify-content: center; padding: 20px">
          <!-- <div class="system-name">{{ $t('route.mgt') }}</div> -->
          <el-dropdown class="el-user-drop" style="display:flex; flex-direction: row-reverse; align-items: center">
            <span class="username">
              {{ userName }}
              <i class="el-icon-arrow-down el-icon--right"/>
            </span>
            <img :src="headUrl" alt="" class="headImg" style="margin-right: 16px">
            <el-dropdown-menu slot="dropdown" class="dropdown">
              <el-dropdown-item
                :disabeled="true"
                class="dropdown-item"
                style="width:120px;
              padding-left:20px">{{ $t('route.my') }}</el-dropdown-item>
              <el-dropdown-item
                class="dropdown-item"
                style=" width:120px;
              padding-left:20px;"
                @click.native="fedlogout">{{ $t('route.logOut') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        </aside>
        <section :class="secClass">
          <el-col
            v-if="!showHeader"
            :class="wrapperAll ? 'content-wrapper-all' : 'content-wrapper'"
            :style="[showBorder ? {'border-width':'0.5px'} : {}, $route.path === '/reinspection' ? {'background': '#f7f9fa url(../../static/img/reinspection_bg.png) no-repeat 100% 0'}: {'background-color': '#f4f5f9'}]">
            <keep-alive :max = "1">
              <router-view v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"/>
          </el-col>
          <el-col v-else class="wrapper-header">
            <keep-alive :max = "1">
              <router-view v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"/>
          </el-col>
          <el-col :sapn="24" class="footercontent">
            <footer class="footerInfo">
              <p style="text-align:left;">v3.0.0.3 &copy; {{ getFullYear }} Advantech Intelligent City Services Co., Ltd. (AiCS) All Rights Reserved.</p>
            </footer>
          </el-col>
        </section>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import PubSub from 'pubsub-js';
import Database from '@/common/Database';

export default {
  name: 'Home',

  data() {
    return {
      showTag: false,
      imgSrc: require('../../../static/img/logo_title.png'),
      arrowRightIcon: require('../../../static/img/arrow-right.png'),
      arrowLeftIcon: require('../../../static/img/arrow-left.png'),
      userName: 'Admin',
      headUrl: '',
      breadList: [],
      collapsed: this.$store.getters.collapsed,
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      route: this.$route,
      path: ['/routeinspection', '/storedetail', '/rate', '/storemonitor', '/schedule', '/reinspection', '/bindroute'],
      wapper: false,
      curBrand: '',
      brandList: [],
      accountId: '',
      roleId: 0,
      lang: this.$i18n.locale,
      title: '',
      isMobile: false,
      brandDisabled: false
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
        'aside-collapse-width': this.collapsed,
        'aside-width': !this.collapsed,
        'mobile': this.isMobile
      };
    },

    secClass() {
      return {
        'sec-collapsed': this.collapsed,
        'sec-uncoll': !this.collapsed,
        'mobile-sec': this.isMobile
      };
    },

    logoClass() {
      return {
        'logo-collapse-width': this.collapsed,
        'logo-width': !this.collapsed,
        'logo-mobile': this.isMobile
      };
    },

    routerList() {
      const routes = this.$store.state.user.routes.slice(1, this.$store.state.user.routes.length);
      return routes;
    },

    groupHeight() {
      return (this.varyWindowWidth * 70) / 1920;
    },

    wrapperAll() {
      let flag = true;
      this.path.forEach(item => {
        flag = flag && (this.$route.path !== item);
      });
      if ((this.$route.path === '/storemonitor/submit') && this.wapper === true) {
        flag = true;
      }
      return flag;
    },

    showBorder() {
      const showBorderPathArr = ['/reinspection', '/storemonitor', '/rate', '/reinspect/confirmrein'];
      return !showBorderPathArr.includes(this.$route.path);
    },

    showHeader() {
      const showBorderPathArr = ['/report', '/patrolOverview', '/eventOverview', '/patrolEvaluation',
        '/patrolItem', '/supervisorStat', '/eventStat', '/storedetail', '/storemanage', '/bindroute', '/checkInStatistics','/patrolCompareStat',
        '/patrolPersonStat'];
      return showBorderPathArr.includes(this.$route.path);
    },

    curPath() {
      return this.route.path;
    },

    activePath() {
      let path = this.$route.path;
      const pathMapArr = [
        { curPath: ['/reinspect/confirmrein', '/reinspect/submit'], activePath: '/reinspection' },
        { curPath: ['/storemonitor/submit'], activePath: '/storemonitor' },
        { curPath: ['/reportdetails'], activePath: '/report' },
        { curPath: ['/rate'], activePath: '/event' },
        { curPath: ['/bindroute', '/addroute', '/setroute'], activePath: '/routeinspection' },
        { curPath: ['/storedetail'], activePath: '/storemanage' },
        { curPath: ['/ezvizeDeviceSetting'], activePath: '/ezvizDevice' },
        { curPath: ['/beseyeDeviceSetting'], activePath: '/beseyeAccount' },
        { curPath: ['/skywatchDeviceSetting'], activePath: '/skywatchAccount' },
        { curPath: ['/titleSetting'], activePath: '/title' }
      ];
      const pathMAP = pathMapArr.find(item => item.curPath.includes(path));
      if (pathMAP) {
        path = pathMAP.activePath;
        this.setBrandListDisabled(true);
      } else {
        this.setBrandListDisabled(false);
      }
      return path;
    },

    cachePath(el) {
      return this.$store.state.cachePath;
    },

    ...mapGetters([
      'token',
      'name',
      'availabePathList'
    ])
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

    $route() {
      this.getBread();
    }
  },
  created() {
    const self = this;
    this.headUrl = './static/img/admin.png';
    PubSub.subscribe('change-color', (event, data) => {
      self.showTag = data.showTag;
    });
    PubSub.subscribe('success-page', (event, data) => {
      if (data.changeStyle) {
        self.wapper = true;
      }
    });
    window.addEventListener('resize', this.$_isMobile);
    self.$_isMobile();
    this.getBrandList();
    this.updateTitle();
  },

  mounted() {
    if (this.$refs.fieldSelect !== undefined) {
      this.$nextTick(() => {
        this.$refs.fieldSelect.$refs.scrollbar.$el.classList.add(
          'scroll-opacity'
        );
      });
    }
  },

  methods: {
    setBrandListDisabled(booleanFlag) {
      this.brandDisabled = booleanFlag;
    },

    handleClickOutside() {
      this.collapsed = true;
    },

    clickCollapse() {
      this.$store.dispatch('setCollapsed', !this.collapsed)
      this.collapsed = !this.collapsed;
    },

    handleopen(index) {
      setTimeout(() => {
        const height = this.$refs.scroll.wrap.scrollHeight;
        this.$nextTick(() => {
          this.$refs.scroll.wrap.scrollTop = height;
        })
      },300);
    },

    routerHome() {
      const url = sessionStorage.getItem('LoginURL');
      Database.destoryDB();
      window.location.href = url + '/homepage';
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
      matched = this.$route.matched.filter(x => x.name);
      matched.length === 2 && this.setSecondLevelNavbarBread(matched, currentRoute);
      matched.length > 2 && matched[0].name === 'systemSetting' && this.setSystemNavbarBread(matched, currentRoute);
      this.breadList = matched;
    },

    setScheduleBread(matched, currentRoute) {
      const routeNameAndPathMaps = [
        { path: ['/pointCheck'], name: 'checkSchedule' },
        { path: ['/patrolSechedule'], name: 'patrolSecheduleManage' }
      ];
      const pathAndNameMap = routeNameAndPathMaps.find(item => item.path.includes(currentRoute));
      pathAndNameMap && (matched[2].name = pathAndNameMap.name);
      matched.splice(1, 1);
    },

    setSystemNavbarBread(matched, currentRoute) {
      const matchedParentName = matched[1].name;
      const inspectSettingNameArr = ['inspectSetting', 'inspectingSettingOfInspectList',
        'inspectingSettingOfDevice', 'inspectingSettingOfSchedule', 'insepctionReportSetting'];
      const deviceSettingNameArr = ['deviceManage', 'ezvizDeviceMgt', 'beseyeDeviceMgt', 'skywatchDeviceMgt'];
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
        case '/routeinspection': {
          this.setFirstBread(matched, 'inspectingSettingOfInspectList');
          break;
        }
        case '/storemanage': {
          this.setFirstBread(matched, 'inspectingSettingOfDevice');
          break;
        }
        case '/patrolSchedule': {
          this.setFirstBread(matched, 'inspectingSettingOfSchedule');
          break;
        }
        case '/insepctionReportSetting': {
          this.setFirstBread(matched, 'inspectingSettingOfReport');
          break;
        }
        case '/bindroute':
        case '/addroute':
        case '/setroute': {
          this.setSecondBread(matched, 'inspectingSettingOfInspectList', '/routeinspection');
          break;
        }
        case '/storedetail': {
          this.setSecondBread(matched, 'inspectingSettingOfDevice', '/storemanage');
          break;
        }
        default: {
          break;
        }
      }
    },

    setDeviceBread(matched, currentRoute) {
      switch (currentRoute) {
        case '/dashDevice': {
          this.setFirstBread(matched, 'dashDeviceMgt');
          break;
        }
        case '/ezvizDevice': {
          this.setFirstBread(matched, 'ezvizDeviceMgt');
          break;
        }
        case '/beseyeAccount': {
          this.setFirstBread(matched, 'beseyeDeviceMgt');
          break;
        }
        case '/ezvizeDeviceSetting': {
          this.setSecondBread(matched, 'ezvizDeviceMgt', '/ezvizDevice');
          break;
        }
        case '/beseyeDeviceSetting': {
          this.setSecondBread(matched, 'beseyeDeviceMgt', '/beseyeAccount');
          break;
        }
        case '/skywatchAccount': {
          this.setFirstBread(matched, 'skywatchDeviceMgt');
          break;
        }
        case '/skywatchDeviceSetting': {
          this.setSecondBread(matched, 'skywatchDeviceMgt', '/skywatchAccount');
          break;
        }
        default: {
          break;
        }
      }
    },

    setSecondLevelNavbarBread(matched, currentRoute) {
      const pathAndBreadMaps = [
        { paths: ['/storedetail'], parentBread: { path: '/storemanage', name: 'storeManage' }},
        { paths: ['/titleSetting'], parentBread: { path: '/title', name: 'titleManage' }},
        { paths: ['/addroute', '/setroute', '/bindroute'],
          parentBread: { path: '/routeinspection', name: 'inspectSetting' }},
        { paths: ['/rate'], parentBread: { path: '/event', name: 'eventManage' }},
        { paths: ['/reportdetails'], parentBread: { path: '/report', name: 'reports' }},
        { paths: ['/storemonitor/submit'], parentBread: { path: '/storemonitor', name: 'storeMonitor' }},
        { paths: ['/reinspect/confirmrein', '/reinspect/submit'],
          parentBread: { path: '/reinspection', name: 'remotePatrol' }}
      ];
      const pathAndBreadMap = pathAndBreadMaps.find(map => map.paths.includes(currentRoute));
      pathAndBreadMap && matched.splice(1, 0, pathAndBreadMap.parentBread);
    },

    getWindowSize() {
      let docEl = document.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
          if (docEl.clientWidth > 1450) {
            docEl.style.fontSize = 16;
          } else {
            docEl.style.fontSize = (docEl.clientWidth / 90) + 'px';
          }
        };
      window.addEventListener(resizeEvt, recalc, false);
      document.addEventListener('DOMContentLoaded', recalc, false);
    },

    fedlogout() {
      Database.destoryDB();
      const url = sessionStorage.getItem('LoginURL');
      window.location.href = url;
    },

    logOut() {
      const self = this;
      self.$store.dispatch('logout').then(() => {
      });
    },
    async getBrandList() {
      await this.changeRoutes();
      console.log("Get Brand List")
      this.brandList = JSON.parse(sessionStorage.getItem('brandList'));
      console.log(this.brandList)
      const idIndex = this.brandList.map(item => item.accountId).indexOf(this.accountId);
      idIndex !== -1 && sessionStorage.setItem('accountName', this.brandList[idIndex].name);
      sessionStorage.setItem('accountId', this.accountId);
      this.getBread();
    },

    changeAccount(accountId) {
      const self = this;
      const idIndex = this.brandList.map(item => item.accountId).indexOf(accountId);
      idIndex !== -1 && sessionStorage.setItem('accountName', this.brandList[idIndex].name);
      sessionStorage.setItem('accountId', this.accountId);
      const params = {
        accountId: accountId
      };
      self.$store.dispatch('changeAccount', params).then((res) => {
        if (res.errCode === 0) {
          self.changeRoutes();
          self.$route.meta.keepAlive = false;
        }
      });
    },

    async changeRoutes() {
      console.log("Change Routes")
      const self = this;
      const result = await self.$store.dispatch('GetUserAuthorities');
      if (result.errCode === 0) {
        await self.$store.dispatch('generateRoutes');
        self.getUserName(result.data);
        const availablePathesList = this.availabePathList;
        if (availablePathesList.includes('/noRight')) {
          this.$router.push('/noRight');
        } else if (!availablePathesList.includes(this.$route.path)) {
          this.$router.push(availablePathesList[0]);
        } else {
          console.log(this.$route.path)
          this.$router.push(this.$route.path);
        }
      }
    },

    getUserName(result) {
      const self = this;
      self.userName = result.userName.length > 10 ? result.userName.substr(0, 10) + '...' : result.userName;
      self.accountId = result.accountId;
      const accountId = result.accountId.toLowerCase();
      localStorage.setItem('oss_bucket', accountId);
    },

    updateTitle() {
      document.title = this.$t('route.meta');
    },

    $_isMobile() {
      const { body } = document;
      const rect = body.getBoundingClientRect();
      if (rect.width - 1 < 1280) {
        this.collapsed = true;
      }
      this.isMobile = rect.width - 1 < 1280;
    }

  }
};
</script>
<style lang="scss" scoped>
  $border: #393b4c;
  $collapseWidth:5.5%;
  //rem(val)
  @function rem($val){
    @return $val/16+rem;
  }
  @function checkRem($val){
    @if($val==auto){@return auto;}
    @else if($val==0){@return 0;}
    @else{@return rem($val);}
  }
  @mixin point($poi,$val){
    #{$poi}:checkRem($val);
  }
  @mixin borderColor{
    &{
      :after{
        position:absolute;
        bottom:0;
        left:0;
        width:100%;
        height:0.55px;
        background-color:#A9A9A9;
        content:' ';
        display:block;
        transform:scaley(0.1);
      }
    }
  }
  *{
    margin: 0px;
  }
  .navIcon{
    display:inline-block;
    font-size: calc(32/1920*100vw);
    color:#fff;
    margin-right: calc(36/1920*100vw);
  }
  .en-navIcon{
    display:inline-block;
    font-size: calc(32/1920*100vw);
    color:#fff;
    margin-right: calc(36/1920*100vw);
  }
  .container{
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height:100%;
    padding:0;
    .header{
      width: 100%;
      z-index:999;
      position:fixed;
      background-color:#fff;
      height: 80px;
      background-color: #1375bc;
      line-height: 80px;
      box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
      min-width: 1000px ;
      .logo-width{
        width:calc(318/1920*100vw);
        min-width: 258px;
      }
      .logo-collapse-width{
        width:$collapseWidth;
        width: calc(68/1920*100vw);
      }
      .logo-collapse-width.logo-mobile{
        width: 0;
        img{
          display: none;
        }
      }
      .logo-width.logo-mobile{
        width:calc(318/1920*100vw);
        min-width: 258px;
      }
      .logo{
        height: calc(80/1920*100vw);
        line-height: calc(80/1920*100vw);
      }
      .logo-content{
        height: 100%;
        border-bottom: 0px solid  $border;
        background-color:#ffffff;
        @include borderColor;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        float: left;
        #imgLogo{
          width: calc(158/1920*100vw);
          height: calc(24/1920*100vw);
          min-width: 158px;
          min-height: 24px;
        }
        .sys-name{
          font-weight: bold;
          color: #f6f9fe;
          font-size: calc(24/1920*100vw);
        }
      }
      .logo-collapse-width #imgLogo{
        width: calc(54/1920*100vw);
        height: calc(16/1920*100vw);
        min-width: calc(54/1920*100vw);
        min-height: 14px;
      }
      .el-traggle-content{
        height: 100%;
        width: 28px;
        float: left;
        border-right: 1px solid #e3e9f4;
        background-color:#fff;
        position: relative;
        .icon-outdent, .icon-indent{
          font-size: 24px;
          cursor: pointer;
          color: #7d8cad;
        }
      }
      .breadcrumb-inner{
        float:left;
        .breadcrumb-item{
          height: 80px;
          line-height: 80px;
          font-size: 16px;
          &:first-child{
            margin-left: 30px;
          }
          .bold-breadcrumb-span{
            font-weight: normal;
            opacity: 0.6;
            color: #ffffff;
          }
          .normal-breadcrumb-span{
            font-weight: normal;
            color: #ffffff;
          }
        }
      }
      .headUrl-content{
        height: 100%;
        float: right;
        color: #fff;
        position: relative;
        overflow: hidden;
        margin-right: calc(33/1920*100vw);
        display: inline-flex;
        justify-content: flex-end;
        /*width: 320px;*/
        .system-name{
          font-size: 14px;
          margin-right: calc(20/1920*100vw);
          color:#4b5262;
          float: left;
        }
        .bell-content{
          @include point(width,60);
          @include point(height,60);
          border-left:1px solid rgba(255,255,255,0.2);
          border-right:1px solid rgba(255,255,255,0.2);
          position: relative;
          float: left;
          cursor: pointer;
          &:hover{
            background-color: #F3F3F3;
          }
          .el-icon-bell{
            font-size: 25px;
            vertical-align:middle;
            color:#4b5262;
          }
          .item{
            position:absolute;
            top: -5px;
            @include point(left,35);
          }
        }
        .el-user-drop{
          .username{
            font-weight: bold;
            color: #006ab7;
            margin: auto 10px;
            max-width: 90px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            cursor: pointer;
            i{
              color:#a5a5a5;
              font-weight: bold;
              margin-left:6px;
              cursor:pointer;
            }
          }
          .headImg{
            position: relative;
            top: 10px;
            margin-left: 10px;
            cursor: pointer;
          }
          .dropdown{
            margin-top:0px;
            .dropdown-item{
              width:120px !important;
              padding-left:20px !important;
            }
          }
        }
      }
    }

    .main{
      display: flex;
      position: absolute;
      top: 80px;
      bottom:0px;
      background-color: #f4f5f9;
      .drawer-bg{
        background: #fff;
        opacity: 0;
        width: 100%;
        top: 0;
        height: 100%;
        position: fixed;
        z-index: 1;
      }
      .aside-menu{
        height: calc(100vh - 80px);
      }
      .brand-panel{
        background-color: #ffffff;
        text-align: left;
        padding: 20px 0px 20px 0px;
        margin-left:32px;
        margin-right:32px;
        margin-bottom:30px;
        border-bottom: 1px solid $border;
        // border-top: 1px solid #393b4c;
        .brand-label{
          display: block;
          color: #484848;
          font-size: calc(16/1920*100vw);
        }
        .brand-list{
          color:#484848;
          width: 100%;
          text-align: center;
          min-width: 180px;
        }
        >>> .el-input--suffix .el-input__inner{
          padding-left: 0;
        }
      }
      .collapsed-brand-panel{
        height: 40px;
        border-bottom: 1px solid $border;
      }
      .brand-title{
        background-color: #ffffff;
        .item-content{
          background-color: #ffffff;
          .item-details{
            height: 45px;
            line-height: 45px;
            span{
              color: #fff;
              margin-left: 60px;
              font-size: 16px;
            }
          }
        }
        .brand-name{
          @include point(font-size,18);
          color: #fff !important;
        }
      }
      .icon-content{
        float:left;
        margin-right: calc(48/1920*100vw);
        width: 10px;
        position: relative;
        height: 100%;
        font-size: calc(20/1920*100vw);
        transform: scale(0.5);
        color: #a0a4ad;
      }
      .en-icon-content{
        float:left;
        margin-right: calc(48/1920*100vw);
        width: 10px;
        position: relative;
        height: 100%;
        font-size: calc(20/1920*100vw);
        transform: scale(0.5);
        color: #a0a4ad;
      }
      .tag-icon{
        width: 10px;
        height: 10px;
        background-color:white;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        position: absolute;
        top: 50%;
        margin-top: -3px;
      }
      aside{
        height:100%;
        float:left;
        position: fixed;
        .el-submenu-content{
          position: relative;
          //border-bottom: 1px solid $border;
          /*height: calc(70/1920*100vw);*/
          /*line-height: calc(70/1920*100vw);*/
          &:hover{
            background-color:#e4f3fd !important;
          }
        }
        .el-submenu-group{
          @include point(margin-left,0);
          //font-size: 16px;b
        }
        .en-el-submenu-group{
          @include point(margin-left,0);
        }

        .el-submenu-group.el-menu-item .bottomline,
        .en-el-submenu-group.el-menu-item .bottomline{
            height:1px;
            width:calc(100vw-32);
            margin-left:16px;
            margin-right:16px;
            border-bottom: 1px solid #a5a5a5;
            
        }
        
        #en-groupSubItem.el-menu-item,
        #groupSubItem.el-menu-item
        {
          background-color: #ffffff;
          color: #a5a5a5;
          i{
            color: #a5a5a5;
          }
        }
        #groupSubItem.el-menu-item:hover{
          background-color: #e4f3fd !important;
          color: #a5a5a5 !important;
          span{
            color:#1375bc;
          }
          i{
            color:#1375bc;
          }
        }
        #groupSubItem.el-menu-item.is-active{
          background-color: #e4f3fd !important;
          color: #a5a5a5 !important;
           span{
            color:#1375bc;
          }
          i{
            color:#1375bc;
          }
        }
        #en-groupSubItem.el-menu-item:hover{
          background-color: #e4f3fd !important;
          color: #a5a5a5 !important;
          span{
            color:#1375bc;
          }
          i{
            color:#1375bc;
          }
        }
        #en-groupSubItem.el-menu-item.is-active{
          background-color: #e4f3fd !important;
          color: #a5a5a5 !important;
           span{
            color:#1375bc;
          }
          i{
            color:#1375bc;
          }
        }
        &.aside-width #en-groupSubItem.el-menu-item{
          padding-left: calc(50/1920*100vw) !important;
        }

        .el-submenu-group{
          @include point(margin-left,0);
        }
        #groupSubItem.el-menu-item{
          background: #ffffff;
          color: #a5a5a5;
        }
        #groupSubItem.el-menu-item:hover{
          background-color: #e4f3fd !important;
          color: #a5a5a5;
        }
        #groupSubItem.el-menu-item.is-active{
          background-color: #e4f3fd !important;
          color: #a5a5a5;
        }
        &.aside-width #groupSubItem.el-menu-item{
          padding-left: calc(50/1920*100vw) !important;
        }

        .en-el-submenu-group{
          font-size: calc(16/1920*100vw);
          span{
            font-size: calc(14/1920*100vw);
          }
          @media screen and (max-width: 1680px){
            font-size: 14px;
          }
        }
        .el-submenu-group {
          font-size: calc(16/1920*100vw);
          @media screen and (max-width: 1680px){
            font-size: 14px;
          }
          span {
            font-size: calc(14/1920*100vw);
            @media screen and (max-width: 1645px){
              font-size: 12px;
            }
          }
        }
        #groupSubItem.submenu-item{
          height: 70px;
          line-height: 70px;
          .el-menu-item.is-active{
            background-color: #e4f3fd !important;
          }
          span{
            font-size: calc(16/1920*100vw);
            color: #a5a5a5;
            @media screen and (max-width: 1680px){
              font-size: 14px;
            }
          }
        }

        #groupSubItem.submenu-item.el-menu-item.is-active{
          background-color: #e4f3fd !important;
            span{
            color:#006ab7;
          }
          i{
            color:#006ab7;
          }
        }
        #groupSubItem.submenu-item.hover{
          background-color: #e4f3fd !important;
          span{
            color:#006ab7;
          }
          i{
            color:#006ab7;
          }
        }
        #en-groupSubItem.submenu-item{
          height: 70px;
          line-height: 70px;
          span{
            font-size: calc(16/1920*100vw);
            color: #a5a5a5;
            @media screen and (max-width: 1680px){
              font-size: 14px
            }
          }
        }
        /*
        #en-childSubItem.third-title{
          font-size: calc(14/1920*100vw) ;
          color: #a0a4ad!important;
          @media screen and (max-width: 1645px){
            font-size: 12px;
          }
        }
        #childSubItem.third-title{
          font-size: calc(14/1920*100vw) ;
          color: #a0a4ad!important;
          @media screen and (max-width: 1645px){
            font-size: 12px;
          }
        }
        */
        .three-child >>> .el-submenu__title {
          padding-left: calc(60/1920*100vw) !important;
          text-align: left;
          position: relative;
          min-width: auto !important;
          height: 60px;
          line-height: 60px;
        }
        .three-child .el-submenu__title:hover{
          background-color: #f2f9fe !important;
          color:#fff !important;
          span{
            color:#a5a5a5!important;
          }
        }
        .three-child >>> .el-menu{
          text-align: left !important;
        }
        .zh-third-title{
          font-size: 14px !important;
          color: #a0a4ad!important;
        }
        .zh-three-child >>> .el-submenu__title {
          padding-left: calc(60/1920*100vw) !important;
          text-align: left;
          position: relative;
          min-width: auto !important;
          height: 60px;
          line-height: 60px;
          /*@media screen and (min-width: 1280px){*/
          /*padding-left: 26px !important;*/
          /*}*/
          /*@media screen and (max-width: 1280px){*/
          /*padding-left: 25px !important;*/
          /*}*/
        }
        .zh-three-child >>> .el-menu{
          text-align: left !important;
        }
        #childSubItem.submenu-item{
          position: relative;
          min-width: auto !important;
          padding-left:calc(60/1920*100vw) !important;
          border-bottom: 0px;
          background-color: #f2f9fe !important;
          color:#a5a5a5 !important;
          span{
            color:#a5a5a5 !important;
          }
          &:hover{
            background-color: #f2f9fe !important;
          } i{
            color:#00000000!important;
          }
        }
        #childSubItem.submenu-item:hover{
           i{
            color:#006ab7!important;;
          }
          span{
            color:#006ab7!important;;
          }
        }
         #childSubItem.submenu-item.is-active{
           span{
            color:#006ab7!important;;
          }
           span{
            color:#006ab7!important;;
          }
        }


        #en-childSubItem.submenu-item{
          position: relative;
          min-width: auto !important;
          padding-left: calc(60/1920*100vw) !important;
           color:#a5a5a5 !important;
          span{
              color:#a5a5a5 !important;
            font-size: calc(14/1920*100vw);
            @media screen and (max-width: 1645px){
              font-size: 12px;
            }
          }
          i{
            color:#00000000;
          }
        }
         #en-childSubItem.submenu-item:hover{
           i{
            color:#006ab7!important;;
          }
            span{
            color:#006ab7!important;;
          }
        }
         #en-childSubItem.submenu-item.is-active{
           i{
            color:#006ab7!important;;
           }
             span{
            color:#006ab7!important;;
          }
        }
        

      }
      .content-wrapper-all{
        height: auto;
        padding: 30px calc(30/1920*100vw);
        /*border: solid #e3e9f4;*/
        /*border-width: 0;*/
        width:100%;
        //@include point(margin-right,50);
        
        min-height: calc(100vh - 80px - 45px);
      }
      .content-wrapper{
        height: auto;
        padding: 30px calc(30/1920*100vw);
        /*border-width: 0;*/
        width: 100%;
        min-height: calc(100vh - 80px - 45px);
        //@include point(margin-right,50);
      }
      // .wrapper-all-header{
      //     height: 93%;
      //     border:1px solid #e3e9f4;
      //     width:auto;
      // }
      .wrapper-header{
        height: auto;
        // border:1px solid #e3e9f4;
        // width: 96.5%;
        padding-bottom: 30px;
        // background-color: #f4f5f9;
        background-image: linear-gradient(#f7f9fa, #f7f9fa 100%);
        background-size: 100% calc(100% - 115px);
        background-repeat: no-repeat;
        background-position: center bottom;
        min-height: calc(100vh - 80px - 45px);
      }
      .footercontent{
        padding:0px 0 30px calc(60 / 1920 * 100vw);
        font-size:14px;
        background-color: #f4f5f9;
        color: #444;
      }
    }
    .zh-third-child-span {
      font-size: calc(14/1920*100vw);
      padding-left: calc(90/1920*100vw);
      @media screen and (max-width: 1645px){
        font-size: 12px;
      }
    }
    .third-child-span{
      font-size: calc(14/1920*100vw);
      padding-left: calc(90/1920*100vw);
      @media screen and (max-width: 1645px){
        font-size: 12px;
      }
    }
    /*    .el-submenu:hover{
          background-color:#a5a5a5 !important;
          .tag-icon{
            background-color: #a5a5a5 !important;
          }
        }*/
    .el-menu-item:hover{
      background-color: #f2f9fe !important;
      color:#a5a5a5 !important;
      .icon-content{
        color: #a5a5a5 !important;
      }
    }
    .el-menu-item.is-active{
      background-color: #f2f9fe !important;
      color:#a5a5a5 !important;
      .icon-content{
        color: #a5a5a5 !important;
      }
    }
    .el-submenu.is-active .el-submenu__title{
      background-color:#ffffff !important;
    }
    .aside-width{
      width:calc(350/1920*100vw);
      min-width: 290px;
      background-color: #ffffff;
      margin-top: -0.5px;
      transition: width .1s;
      /*overflow: scroll;*/
    }
    .aside-width.mobile{
      position: fixed;
      z-index: 1000;
      width:calc(350/1920*100vw);
      min-width: 290px;
    }
    .aside-collapse-width{
      width:$collapseWidth;
      width:calc(100/1920*100vw);
      overflow: hidden !important;
      background-color: #ffffff;
      transition: width .1s;
    }
    .aside-collapse-width.mobile{
      transform: translate(calc(-290px), 0);
    }
    .sec-collapsed{
      margin-left:calc(100/1920*100vw);
      width:95.5%;
      height: auto;
      min-width:calc(1000px - calc(100/1920*100vw));
    }
    .mobile-sec{
      margin-left:0;
      min-width:1000px;
      width: 100%;
    }
    .sec-uncoll{
      margin-left:calc(350/1920*100vw);
      height: auto;
      width:calc(100% - calc(350/1920*100vw));
      min-width:calc(1000px - 290px);
      @media screen and (max-width: 1590px){
        margin-left: 290px;
        width:calc(100% - 290px);
      }
    }
    .sec-uncoll.mobile-sec{
      margin-left:0;
      width: 100%;
    }
    .menu li{
      margin-left: 80px;
      text-align: center;
    }
  }
  .el-collapse-item__content{
    padding-bottom: 0px !important;
  }
  .el-submenu__icon-arrow{
    margin-right:calc(30/1920*100vw) !important;
    color: #fff !important;
  }
  .el-select-dropdown__item{
    background-color:#fff;
    color: #484848;
    font-size: calc(24/1920*100vw) !important;
    font-family: 'NotoSansCJKtc','Microsoft YaHei','Microsoft JhengHei',SimHei,Arial;
  }
  .options{
    padding-left: 20px;
    font-size: calc(24/1920*100vw) !important;
    font-family:'NotoSansCJKtc', 'Microsoft YaHei','Microsoft JhengHei',SimHei,Arial;
    height: 60px;
    line-height: 60px;
    color: #484848;
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background-color:#f2f9fe !important;
    color: #484848 !important;
  }
  .el-select-dropdown__item.selected{
    background-color:#f2f9fe!important;
    color: #484848 !important;
  }
  #el-menuscrollbar{
    height: calc(100% - 225px);
  }
  .aside-collapse-width #el-menuscrollbar{
    height: calc(100% - 40px);
  }
  >>> #el-menuscrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  >>> #el-menuscrollbar .el-scrollbar__wrap .el-scrollbar__bar.is-horizontal{
    display: none !important;
  }
</style>
<style>
  .brand-list .el-input__inner{
    background-color: #ffffff !important;
    color: #484848;
    text-align: left;
    font-weight: bold !important;
    background-color: transparent;
    border: none !important;
    font-size: calc(24/1920*100vw);
  }
  @media screen  and (max-width: 1280px){
    .brand-list .el-input__inner{
      font-size: 13px;
    }
  }
  .brand-list .is-disabled .el-input__inner{
    background-color: #ffffff !important;
  }

  .brand-list .el-input__icon{
    color: #484848 !important;
    font-size: 16px !important;
    font-weight: bold !important;
    line-height: calc(30/1920*100vw);
  }
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-y: auto;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color:#FEE4E7 !important;
  }
  .brand-title .el-collapse-item__header{
    background-color: #ffffff;
    color: #fff;
    padding-left: 60px;
    font-weight: bold;
    border: 0;
  }
  .brand-title .el-collapse-item__arrow{
    font-size: 16px !important;
    margin-right: 35px !important;
    color: #fff !important;
  }
  /*更改左侧菜单箭头方向*/
  .el-submenu>.el-submenu__title .el-submenu__icon-arrow{
    -webkit-transform: rotateZ(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotateZ(-90deg);
    font-size: 16px;
    right:30px;
    color: #fff;
  }
  .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
    -webkit-transform: rotateZ(0deg);
    -ms-transform: rotate(0deg);
    transform: rotateZ(0deg);
    font-size: 16px;
    right:30px;
    color: #fff;
  }
  .el-submenu__title{
    height: 70px;
    line-height: 70px;
    padding-left: calc(50/1920*100vw) !important;
    padding-right: 0 !important;
    background-color: #ffffff !important;
    color: #a5a5a5!important;
    border-bottom:0px;
    /*border-bottom: 1px solid  #393b4c;*/
  }

  .bottomline{
            height:0px;
            width:calc(100vw-32);
            margin-left:16px;
            margin-right:16px;
            border-bottom: 1px solid #a5a5a5;
            background-color:#e4f3fd !important;
            
        }
  .el-submenu__title:hover{
    background-color:  #e4f3fd!important;
    color:#006ab7;
  }

  .el-submenu-content{
    background-color:  #e4f3fd !important;
  }

  .el-submenu-content.el-submenu{
    background-color:  #FFFFFF !important;
    color:#a5a5a5;
  }
  .el-submenu-content.el-submenu i{
    color:#a5a5a5;
  }
  .el-submenu-content.el-submenu:hover > .el-submenu__title{
    background-color:  #e4f3fd !important;
    color:#006ab7;
  }
  .el-submenu-content.el-submenu:hover span{
    color:#006ab7;
  }
  .el-submenu-content.el-submenu:hover i{
    color:#006ab7;
  }

  .el-submenu-content.el-submenu.is-active.is-opened > .el-submenu__title{
    background-color:  #e4f3fd !important;
    color:#006ab7;
  }
  .el-submenu-content.el-submenu.is-active.is-opened span{
    color:#006ab7;
  }
  .el-submenu-content.el-submenu.is-active.is-opened i{
    color:#006ab7;
  }
  .el-submenu .el-menu-item{
    height: 60px;
    line-height: 60px;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title{
    background: #fff;
    color: #a0a4ad !important;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title:hover{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title:hover .icon-content{
    color: #006ab7 !important;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title:hover span{
    color: #006ab7 !important;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title.is-active{
    background-color: #f2f9fe !important;
    color:#006ab7 !important ;
  }

  .el-menu--collapse{
    width: calc(100/1920*100vw);
  }
  .el-menu--collapse .el-submenu__title{
    padding: 0 calc(34/1920*100vw) !important ;
  }

  .container .main aside.aside-collapse-width  #en-groupSubItem.el-menu-item{
    padding-left: calc(34/1920*100vw) !important;
  }
  .container .main aside.aside-collapse-width  #groupSubItem.el-menu-item{
    padding-left: calc(34/1920*100vw) !important;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item{
    padding-left: 30px !important;
    padding-right: 50px !important;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start .icon-content{
    margin-right: 48px;
    float: left;
    position: relative;
    height: 100%;
    font-size: calc(20/1920*100vw);
    transform: scale(0.5);
  }
  .el-menu--popup-right-start{
    padding: 0;
    margin-left: 10px
  }
  .el-menu--popup .el-menu-item{
    height: 60px;
    line-height: 60px;
    font-size: calc(14/1920*100vw);
  }
  @media screen and (max-width: 1645px){
    .el-menu--popup .el-menu-item{
      font-size: 12px;
    }
  }
  .el-submenu.is-active .el-submenu__title{
    border-bottom-color: #393b4c !important;
  }
  .el-submenu__title{
    border-bottom: 0px solid #a5a5a5;
    background-color: #ffffff !important;
  }
  .submenu-item{
    border-bottom:none;
  }
  .el-menu .submenu-item:last-child{
    border-bottom: none;
  }
  .el-menu--popup .three-child .el-submenu__title{
    height: 60px;
    line-height: 60px;
    padding-left: 30px !important;
    font-size: calc(14/1920*100vw);
  }
  .three-child .el-menu-item.submenu-item{
    color: #a0a4ad !important;
  }
  .three-child .el-menu--popup .el-menu-item.submenu-item{
    padding-left: calc(30/1920*100vw) !important;
    padding-right: calc(50/1920*100vw);
    color: #a0a4ad !important;
  }
  .three-child .el-menu .el-menu-item:last-child{
    border-bottom: 1px solid #393b4c;
  }
  .three-child .el-menu--popup .el-menu-item.submenu-item:hover{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .three-child .el-menu--popup .el-menu-item.submenu-item.is-active{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item:hover{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item:hover .icon-content{
    color: #a5a5a5;
  }

  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item.is-active{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item.is-active .icon-content{
    color: #a5a5a5;
  }

  .container .three-child.el-submenu:hover{
    background-color: #f2f9fe !important;
  }
  .container .three-child.el-submenu .el-submenu__title:hover span{
    color: #a5a5a5 !important;
  }
  .container .three-child.el-submenu .el-submenu__title:hover .icon-content{
    color: #a5a5a5;
  }
  /*.el-scrollbar__wrap{*/
  /*margin-right: 0 !important;*/
  /*}*/
  .three-child .el-submenu__title .el-submenu__icon-arrow{
    display: none;
  }
    .brandSelect.el-popper {
    margin-top: 5px;
    background-color: #fff;
    border: 1px solid #2c3048;
    box-shadow: 5px 5px 5px rgba(34,37,56,0.2);;
  }
  .brandSelect.el-popper[x-placement^="bottom"] {
    margin-top: 5px;
    background-color: #fff;
    border: 1px solid #2c3048;
    box-shadow: 5px 5px 5px rgba(34,37,56,0.2);;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow{
    display: none;
  }
  .el-select .el-input--medium .el-input__inner{
    height: 35px;
    font-size: 13px;
    text-align: left;
    border: none;
    background-color: #f7f9fa;
    color:#2b2b2b;
    border-radius: 0px;
  }
  .el-select .el-input--medium .el-input__suffix{
    top:5px;
  }
  >>> .input-class.el-input--medium .el-input__inner{
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: none;
    border-right: none;
    color: #2b2b2b;
    background: transparent !important;
    padding: 0 10px;
    font-size: 15px;
    min-width: 55px;
    min-height: 28px;
  }
  >>> .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 15px;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    min-height: 28px;
    min-width: 85px;
  }

  >>> .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
    line-height: calc(36/1920*100vw);
    height: calc(36/1920*100vw);
    min-height: 28px;
    color: #2c90d9;
  }
  .el-select.el-select--medium{
    /* color: #2b2b2b;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw); */
    /* background: transparent; */
    border: none !important;
    width: 100%;
    border-radius: 3px;
  }
  /*中文*/
  #groupSubItem.el-menu-item:hover{
    background-color: #e4f3fd !important;
    color: #a5a5a5 !important;
  }
  #groupSubItem.el-menu-item.is-active{
    background-color: #e4f3fd !important;
    color: #fff !important;
  }

  .el-submenu.zh-three-child .el-submenu__title{
    background: #222385;
    color: #fff;
    border-bottom: 1px solid #393b4c;
  }
  .el-submenu.zh-three-child .el-submenu__title:hover
  {
    background-color: #f2f9fe !important;
    color:#006ab7 !important;
  }
  .el-submenu.zh-three-child .el-submenu__title:hover span
  {
    color:#006ab7 !important;
  }
  .el-submenu.zh-three-child .el-submenu__title.is-active{
    background-color: #f2f9fe !important;
    color:#006ab7 !important ;
  }
  .el-submenu.is-active.zh-three-child > .el-submenu__title .icon-content,.el-submenu.is-active.zh-three-child > .el-submenu__title span{
    color:#006ab7 !important ;
  }
  .el-submenu.is-active.three-child > .el-submenu__title .icon-content,.el-submenu.is-active.three-child > .el-submenu__title span{
    color:#006ab7 !important ;
  }
  .el-menu--popup .zh-three-child .el-submenu__title{
    height: 60px;
    line-height: 60px;
    padding-left: 30px !important;
    color: #a0a4ad !important
  }
  .el-menu--popup .el-menu-item submenu-item{
    height: 60px;
    line-height: 60px;
    padding-left: 30px !important;
    color: #a0a4ad !important
  }
  .el-menu--popup .zh-three-child .el-submenu__title span{
    color: #a0a4ad;
    font-size: calc(14/1920*100vw);
  }
  @media screen and (max-width: 1645px){
    .el-menu--popup .zh-three-child .el-submenu__title span{
      font-size: 12px;
    }
  }
  .el-menu--popup .zh-three-child .el-submenu__title:hover span{
    color: #a5a5a5;
  }
  .el-menu--popup .zh-three-child .el-submenu__title.is-active span{
    color: #a5a5a5;
  }
  .el-menu--popup .zh-three-child .el-submenu__title:hover .icon-content{
    color: #a5a5a5;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item:hover{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item:hover .icon-content{
    color: #a5a5a5 !important;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item.is-active{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item.is-active .icon-content{
    color: #a5a5a5 !important;
  }
  .zh-three-child .el-menu-item.submenu-item{
    color: #a0a4ad !important;
  }
  .zh-three-child .el-menu--popup .el-menu-item.submenu-item
  {
    padding-left: calc(30/1920*100vw) !important;
    padding-right: calc(50/1920*100vw);
    color: #a0a4ad !important;
  }
  .zh-three-child .el-menu .el-menu-item:last-child
  {
    border-bottom: 1px solid #393b4c;
  }
  .zh-three-child .el-menu--popup .el-menu-item.submenu-item:hover{
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  .zh-three-child .el-menu--popup .el-menu-item.submenu-item.is-active
  {
    background-color: #f2f9fe !important;
    color:#a5a5a5 !important ;
  }
  /*  .container .zh-three-child.el-submenu:hover{
      background-color: #f2f9fe !important;
      color: #a5a5a5;

    }
    .container .zh-three-child.el-submenu:hover .icon-content{
      color: #a5a5a5;
    }*/
  .container .zh-three-child.el-submenu .el-submenu__title:hover span {
    color: #a5a5a5;
  }
  .container .zh-three-child.el-submenu .el-submenu__title:hover  .icon-content{
    color: #a5a5a5;
  }
  .zh-three-child .el-submenu__title .el-submenu__icon-arrow{
    display: none;
  }
  .el-submenu.zh-three-child .el-menu-item.submenu-item:hover .zh-third-child-span{
    color: #a5a5a5 !important;
  }
  .el-submenu.is-active.zh-three-child .el-menu-item.submenu-item.is-active .zh-third-child-span{
    color: #a5a5a5 !important;
  }
  .el-button [class*="el-icon-"] + span{
    margin-left: 0px !important;
  }
  .brand-list.el-select .el-input .el-select__caret{
    -webkit-transform: rotateZ(90deg);
    -ms-transform: rotate(90deg);
    transform: rotateZ(90deg);
  }
  .brand-list.el-select .el-input .el-select__caret.is-reverse{
    -webkit-transform: rotateZ(180deg);
    -ms-transform: rotate(180deg);
    transform: rotateZ(180deg);
  }
  .el-submenu-content.el-submenu.is-active > .el-submenu__title{
    background-color: #e4f3fd !important;
    color:#444;
  }
  .el-dialog__headerbtn .el-dialog__close{
    font-size: calc(20/1920*100vw);
  }
  .el-dialog__title{
    font-size: calc(14/1920*100vw);
  }

  .el-tabs__item{
    color: #7d8cad;
  }
  .el-table__row{
    height: calc(60/1920*100vw);
  }
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 4px;
    cursor: pointer;
  }

  ::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
  }
  .el-scrollbar .el-scrollbar__wrap{
    margin-bottom: -4px  !important;
    margin-right: -4px !important;
  }
  .el-input__inner{
    font-family:NotoSansCJKtc, Arial, 'Microsoft YaHei','Microsoft JhengHei',SimHei;
  }
  .el-select-dropdown__item{
    font-family: NotoSansCJKtc, Arial, 'Microsoft YaHei','Microsoft JhengHei',SimHei;
  }
  /**
  add style to schedule setting
   */
  li[class*="three-child"] .el-menu.el-menu--inline::before{
    display: table;
    content: "";
    position: absolute;
    height: calc(100% - 60px);
    top: 30px;
    left: calc(90/1920*100vw);
    border-left: 1px solid #9a9ea7;
    z-index: 1;
  }
  li[class*="three-child"] .el-menu--inline li::before{
    content: '';
    position: absolute;
    width: calc(40/1920*100vw);
    border-bottom: 1px solid #9a9ea7;
    left: calc(90/1920*100vw);
    top: 50%;
  }
  li[class*="three-child"].is-active .el-menu--inline li.is-active::before{
    border-bottom: 1px solid #a5a5a5;
  }
  li[class*="three-child"] .el-menu--inline .el-menu-item:hover::before{
    border-bottom: 1px solid #a5a5a5;
  }
  .el-submenu .el-menu-item:first-child{
    margin-top: 0px;
    border-top: 0;
  }
  li[class*="three-child"] .el-menu-item:first-child{
    margin-top: 0px;
    border-top: 0;
  }
  li[class*="three-child"] .el-menu--inline li:last-child:first-child::before,
  li[class*="three-child"].is-active .el-menu--inline li:last-child:first-child.is-active::before,
  li[class*="three-child"] .el-menu--inline .el-menu-item:last-child:first-child:hover::before{
    border-bottom: none;
  }
</style>
<style  lang="scss">
  .el-select-dropdown .scroll-opacity.el-scrollbar .el-scrollbar__bar.is-vertical {
    opacity: 1;
  }
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #e3e9f4;
  }
  .el-table .cell{
    word-break: break-word;
  }
  .el-message__content, .el-button, .el-time-panel__btn, .el-time-panel, .el-popper, .el-range-input{
    font-family: NotoSansCJKtc, 'Microsoft YaHei';
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
  .padding {
    padding: 20px
  }
  .margin-bottom-top-sm {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .margin-bottom-sm {
    margin-bottom: 10px
  }
  .margin-right-md {
    margin-right: 20px
  }
  .margin-bottom-md {
    margin-bottom: 20px
  }
  .font-size-sm {
    font-size: 12px;
  }
  .font-size-md {
    font-size: 15px;
  }
  .spacer {
    flex: 1
  }
  .hr-vertical {    
    margin: 0;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    border-width: 0;
    border-style: solid;
    border-color: #e6e6e6;
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
    border-color: #e6e6e6;
    border-bottom-width: thin;
  }
  .child-space {
    &:not(:first-child){
      margin-left: 20px;
    }
  }
  .el-button--primary {
    background-color: #c60957;
    border-color: #c60957;
    &:hover {
      background-color: #ae0048;
      border-color: #ae0048;
    }
  }
  .el-dialog__headerbtn {
    display: none;
  }
</style>