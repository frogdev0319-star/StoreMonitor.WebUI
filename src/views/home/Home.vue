<template>
  <div>
    <el-row class="container">
      <el-col class="header">
        <el-col :span="10" class="logo-content" :class="collapsed?'logo-collapse-width':'logo-width'">
          <img :src="imgSrc" alt="logo" id="imgLogo" @click="routerHome">
          <span class="sys-name" v-if="!collapsed" @click="routerHome">{{generateRoute('title')}}</span>
          <!--<span class="sys-name" v-if="!collapsed" @click="routerHome">{{$t('navbar.title')}}</span>-->
        </el-col>
        <el-col :span="1" class="el-traggle-content">
          <i class="iconfont icon-indent" @click="clickCollapse" v-if="collapsed"></i>
          <i class="iconfont icon-outdent" @click="clickCollapse" v-else></i>
        </el-col>
        <el-col :span="10">
          <el-breadcrumb separator="|" class="breadcrumb-inner" >
            <el-breadcrumb-item
              v-for="(item,index) in breadList"
              :key="item.path" class="breadcrumb-item" :to="{ path:item.path}"
              v-if="index!=0" >
              <span  :style="breadList.length>2&&index==1?{'color':'#7d8cad','font-weight':'normal'}:{'font-weight':'bold','color':'#182752'}">{{ generateRoute(item.name) }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="5" class="headUrl-content">
          <div class="bell-content">
            <i class="el-icon-bell"></i>
            <el-badge is-dot class="item"></el-badge>
          </div>
          <el-dropdown class="el-user-drop" >
                        <span class="username" style="cursor:pointer;">{{userName}}<i class="el-icon-arrow-down el-icon--right"
                                                                                      style="margin-left:6px;cursor:pointer;"></i></span>
            <img :src="headUrl" alt="头像" class="headImg" style="cursor:pointer;">
            <el-dropdown-menu slot="dropdown" class="dropdown" style="margin-top:0px;">
              <el-dropdown-item style="width:120px;padding-left:20px" :disabeled=true>{{generateRoute('my')}}</el-dropdown-item>
              <el-dropdown-item style="width:120px;padding-left:20px" @click.native="fedlogout">{{generateRoute('logOut')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
      <el-col class="main" :span="24"
              :style="($route.path=='/device'||$route.path=='/storemanage'||$route.path=='/event'||$route.path=='/reinspection'||$route.path=='/storemonitor/submit'||$route.path=='/datacenter')?
            {'height':(varyWindowHeight-68)+'px'}:{'height':'auto'}">
        <aside :class="collapsed?'aside-collapse-width':'aside-width'">
          <div class="brand-panel" v-if="!collapsed">
            <span class="brand-label">{{generateRoute('brand')}}</span>
            <el-select v-model="accountId" :placeholder="generateRoute('select')"   popper-class='brandSelect' class="brand-list" @change='changeAccount' :disabled="brandDisabled">
              <el-option
                class="options"
                v-for="(item,index) in brandList" :key="index"
                :label="item.name"
                :value="item.accountId">
              </el-option>
            </el-select>
          </div>
          <div v-else class="collapsed-brand-panel"></div>
          <el-scrollbar style="height:100%;" id="el-menuscrollbar">
          <el-menu :default-active="activePath"
                   class="el-menu-vertical-demo"
                   text-color="#eee"
                   background-color="#222538"
                   @open="handleopen" @close="handleclose" @select="handleselect"
                   router :collapse="collapsed" :unique-opened="true"
                   id="nav-menu"
                   :collapse-transition="false" style="border:0px;min-height:800px;">
            <template v-for="(item,index) in routerList">
              <template v-if="!item.hidden">
                <!--只有一个节点-->
                <el-menu-item  v-if="item.leaf&&item.children.length>0" :id="lang=='en'? 'en-groupSubItem': 'groupSubItem'" class="submenu-item"
                               :key="index"  :index="item.children[0].path"
                               :disabled="item.isReadOnly"
                               style="text-align:left;">
                  <i v-if="lang=='en'" :class="item.iconCls" class="en-navIcon" :style="collapsed?{'margin-left':'0'}:{}"></i>
                  <i v-else :class="item.iconCls" class="navIcon" :style="collapsed?{'margin-left':'0'}:{}"></i>
                  <span>{{collapsed?'': generateRoute(item.children[0].name)}}</span>
                </el-menu-item>
                <!--多级节点 :disabled="item.name=='巡店管理'"-->
                <el-submenu class="el-submenu-content" :key="index" :index="index+''"
                            v-if="!item.leaf" style="text-align:left;" :style="groupHeight+'px'">
                  <template slot="title">
                    <i v-if="lang=='en'" :class="item.iconCls" class="en-navIcon" :style="collapsed?{'margin-left':'0'}:{}"></i>
                    <i v-else :class="item.iconCls" class="navIcon" :style="collapsed?{'margin-left':'0'}:{}"></i>
                    <span :class="lang=='en'? 'en-el-submenu-group':'el-submenu-group'">{{generateRoute(item.name)}}</span>
                  </template>
                  <el-menu-item :id="lang=='en'?'en-childSubItem':'childSubItem'" class="submenu-item" :style="groupHeight+'px'"
                                v-for="child in item.children" :index="child.path"  :disabled="child.isReadOnly"
                                :key="child.path" v-if="!child.hidden && !child.threeChild" style="padding-left: 30px;color:#a0a4ad;">
                    <template slot="title">
                      <!--<div :class="lang=='en' ? 'en-icon-content': 'icon-content'">-->
                      <!--<div class="tag-icon"></div>-->
                      <!--</div>-->
                      <i class="iconfont icon-yuandian icon-content"></i>
                      <span >{{generateRoute(child.name)}}</span>
                      <div v-if="child.name=='storeManage'&&showTag"
                           style="display:inline-block; width:8px;height:8px;background-color:#f31d65;border-radius:50%;margin-left:10px;"></div>
                    </template>
                  </el-menu-item>
                  <el-submenu  :class="lang== 'en' ? 'three-child el-submenu-group' : 'zh-three-child'" :style="varyWindowWidth<1366?{'padding-right':'0px'}:{}"
                               :index="child.path"  :disabled="child.isReadOnly"
                               :key="child.path" v-else-if="!child.hidden && child.threeChild" style="padding-left: 0px">
                    <template slot="title">
                      <i class="iconfont icon-yuandian icon-content"></i>
                      <span :class="lang=='en'? 'en-el-submenu-group':'el-submenu-group'" :id="lang=='en'?'en-childSubItem':'childSubItem'" class="third-title">{{generateRoute(child.name)}}</span>
                    </template>
                    <el-menu-item class="submenu-item" :style="varyWindowWidth<1366?{'padding-right':'0px'}:{}"
                                  v-for="grandChild in child.children" :index="grandChild.path"  :disabled="grandChild.isReadOnly"
                                  :key="grandChild.path" >
                      <template>
                        <span :class="lang=='en' ? 'third-child-span' : 'zh-third-child-span'">{{generateRoute(grandChild.name)}}</span>
                      </template>
                    </el-menu-item>
                  </el-submenu>
                </el-submenu>
              </template>
            </template>

          </el-menu>
          </el-scrollbar>
        </aside>

        <section :class="collapsed?'sec-collapsed':'sec-uncoll'">
          <el-col :class="wrapperAll
                    ?'content-wrapper-all':'content-wrapper'" :style="showBorder?{'border-width':'0.5px'}:{}" v-if="!showHeader">
            <keep-alive :max="1">
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <!-- <keep-alive :include="cachePath">
                <router-view></router-view>
            </keep-alive>
            <router-view></router-view> -->
          </el-col>
          <el-col class='wrapper-header' v-else>
            <keep-alive  :max="1">
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <!-- <keep-alive :include="cachePath">
                <router-view></router-view>
            </keep-alive> -->
          </el-col>
          <el-col :sapn='24' class="footercontent">
            <footer class="footerInfo">
              <p style="text-align:left;">Version 1.0.1&copy; 2018-2019 Storeviu Corp. All rights reserved</p>
            </footer>
          </el-col>

        </section>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import RateManage from '../event/details/RateManage'
  import {mapGetters,mapMutations,mapActions} from 'vuex';
  import {getUserInfo,getAccountList} from '@/api/login'
  import PubSub from 'pubsub-js';
  import {getCookie} from '@/common/auth';
  import { generateRoute } from '@/api/i18n'
  import PermissionHelper from "../../api/PermissionHelper";
  export default {

    name:"Home",
    data(){
      return{
        showTag:false,
        imgSrc:require('../../../static/img/logo.png'),
        userName:'Admin',
        headUrl:'',
        breadList:[],
        collapsed:false,
        varyWindowWidth:window.innerWidth,
        varyWindowHeight:window.innerHeight,
        // routerList:this.$router.options.routes.slice(1,this.$router.options.routes.length),
        //wrapperAll:true,
        route:this.$route,
        path:['/routeinspection','/storedetail','/rate','/storemonitor','/schedule','/reinspection','/bindroute'],
        wapper:false,
        curBrand:'',
        brandList:[],
        accountId:'',
        roleId:0,
        lang: this.$i18n.locale,
        title: ''
      }
    },
    computed:{
      routerList(){
        console.log(this.$store.state.user.routes)
        return this.$store.state.user.routes.slice(2,this.$store.state.user.routes.length);
      },
      groupHeight(){
        return (this.varyWindowWidth*70)/1920;
      },
      wrapperAll(){
        let flag=true;
        this.path.forEach(item=>{
          flag=flag&&(this.$route.path!=item);
        })
        if((this.$route.path=='/storemonitor/submit')&&this.wapper==true){
          flag=true;
        }
        return flag;
      },
      showBorder(){
        if((this.$route.path!='/reinspection'&&this.$route.path!='/storemonitor'&&this.$route.path!='/rate'&&this.$route.path!='/reinspect/confirmrein')){
          return true;
        }
      },
      showHeader(){
        let flag=false;
        if((this.$route.path=='/report' || this.$route.path == '/patrolOverview' || this.$route.path == '/eventOverview')){
          flag= true;
        }
        return flag;
      },
      curPath(){
        return this.route.path
      },
      activePath(){
        console.log(this.$route.path)
        let path = this.$route.path;
        switch (path) {
          case '/reinspect/confirmrein':
          case '/reinspect/submit':{
            path = '/reinspection';
            break;
          }
          case '/storemonitor/submit':{
            path = '/storemonitor';
            break;
          }
          case '/reportdetails':{
            path = '/report';
            break;
          }
          case '/rate':{
            path = '/event';
            break;
          }
          case '/bindroute' :
          case '/addroute':
          {
            path = '/routeinspection';
            break;
          }
          case '/storedetail':{
            path = '/storemanage';
            break;
          }
          case '/titleSetting': {
            path = '/title';
            break;
          }
          default:{
            break;
          }
        }
        return path;
      },
      cachePath(el){
        return this.$store.state.cachePath;
      },
      ...mapGetters([
        'token',
        'name'
      ]),
      brandDisabled(){
        console.log(this.$route.matched);
        let disabled = true;
        if(this.$route.matched.length == 2){
          disabled = false
        }
        else if(this.$route.matched.length == 3){
          if(this.$route.matched[1].path == '/schedule'){
            disabled = false;
          }
        }
        return disabled;
      }
    },
    watch:{
      curBrand(val,oldval){
        if(val.length==0){
          this.curBrand=this.accountId;
        }
      },
      curPath(val){
        console.log(val);
        if(this.path.indexOf(val)){
          this.wrapperAll=false;
        }
      },
      $route(){
        this.getBread();
      }
    },
    methods:{
      generateRoute,
      clickCollapse(){
        this.collapsed=!this.collapsed;
      },
      handleopen(index) {
        console.log('handleopen');
        switch(Number(index)){
          case 1:
            document.getElementsByClassName('el-submenu__title')[0].style.backgroundColor='#f31d65';
            document.getElementsByClassName('el-submenu__title')[1].style.backgroundColor='#222538';break;
          case 5:
            document.getElementsByClassName('el-submenu__title')[1].style.backgroundColor='#f31d65';
            document.getElementsByClassName('el-submenu__title')[0].style.backgroundColor='#222538';break;
          default: console.log('this is not a group');break;
        }
      },
      routerHome(){
        let self=this;
        let url=sessionStorage.getItem('LoginURL');
        window.location.href=url+'/homepage';
      },
      handleclose(index) {
        console.log('handleclose');
      },
      handleselect(key, keyPath){
        console.log(key);
      },
      selectItem(item,index){
        console.log(item);
        console.log(index);
      },
      CheckDOC(){
        let url="../../../static/webapp/index.html";
        window.open(url, '_blank');
      },
      getBread(){
        this.breadList=[];
        //this.breadList=this.$route.matched;
        let currentRoute = this.$route.fullPath; //当前路由
        let matched = this.$route.matched.filter(x=>x.name);
        console.log(matched)
        if(matched.length > 2 && matched[1].name == 'scheduleManage'){
          //巡检设置
          if(matched[2].tempName == undefined){
            matched[2].tempName = `${this.$t('route.scheduleManage')}${this.$t('route.leftBracket')}${this.$t('route.'+ matched[2].name)}${this.$t('route.rightBracket')}`
            matched[2].name = matched[2].tempName
          }
          else{
            matched[2].name = matched[2].tempName
          }
          matched.splice(1,1);
        }
        else{

        }
        // if(currentRoute == '/pointCheck'){
        //   //point check
        //   matched.unshift(`${this.$t('route.scheduleManage')}${this.$t('route.leftBracket')}${this.$t('route.pointCheck')}${this.$t('route.rightBracket')}`)
        //   matched.unshift('schedule')
        // }
        // else if(currentRoute == '/lpsSechedule'){
        //   //lps schedule
        //   matched.unshift(`${this.$t('route.scheduleManage')}${this.$t('route.leftBracket')}${this.$t('route.lpsSechedule')}${this.$t('route.rightBracket')}`)
        //   matched.unshift('schedule')
        // }
        // else if(currentRoute == '/patrolSechedule'){
        //   // patrol schedule
        //   matched.unshift(`${this.$t('route.scheduleManage')}${this.$t('route.leftBracket')}${this.$t('route.patrolSechedule')}${this.$t('route.rightBracket')}`)
        //   matched.unshift('schedule')
        // }
        // else{
        //
        // }
        //matched=this.$route.matched.filter(x=>x.name);
        const first=matched[1];
        this.breadList=matched;
      },
      getWindowSize(){
        let docEl=document.documentElement,
          resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
          recalc = function() {
            //设置根字体大小
            if(docEl.clientWidth>1450){
              docEl.style.fontSize =16;
            }
            else{
              docEl.style.fontSize = (docEl.clientWidth/90)+'px';
            }
          };
        //绑定浏览器缩放与加载时间
        window.addEventListener(resizeEvt, recalc, false);
        document.addEventListener('DOMContentLoaded', recalc, false);
      },
      fedlogout(){
        let self=this;
        //self.$router.push('/login');
        //window.location.href='https://portals.storeviu.com';
        let url=sessionStorage.getItem('LoginURL');
        window.location.href=url;
      },
      logOut(){
        let self=this;
        self.$store.dispatch('logout').then(()=>{
        })
      },
      getAccountList(){
        let self=this;
        getAccountList().then(res=>{
          let data=res.data;
          if(res.errCode==0){
            self.brandList=data;
            console.log(self.brandList)
            //self.curBrand=self.accountId;
          }
        })
      },
      changeAccount(accountId){   //改account后存储
        let self=this;
        let params={
          accountId:accountId
        };
        self.$store.dispatch('changeAccount',params).then((res)=>{
          console.log(res);
          if(res.errCode==0){
            self.changeRoutes();
            self.$route.meta.keepAlive=false;
            self.getUserName();
          }
        });
      },
      changeRoutes(){
        let self = this;
        self.$store.dispatch('GetUserAuthorities').then((result)=>{
          if(result.errCode==0){
            self.$store.dispatch('generateRoutes')
          }
        })
      },
      getUserName(){
        let self=this;
        let userId=getCookie('UserId');
        getUserInfo().then(res=>{
          console.log(res);
          self.personList=res.data;
          res.data.forEach(item=>{
            if(item.userId==userId){
              self.userName=item.userName.length>10?item.userName.substr(0,10)+'...':item.userName;
              self.accountId=item.accountId;
              let accountId=item.accountId.toLowerCase();
              localStorage.setItem('oss_bucket',accountId);  //初始进来存储
              self.roleId=item.roleId;
            }
          })
        })
      },
      updateTitle(){
        document.title = this.$t('route.meta')
      }
    },
    created(){
      let self=this;
      this.headUrl='./static/img/admin.png';
      console.log(this.$route.matched);
      this.getBread();
      console.log(this.$route.query);
      let params=self.$route.query;
      PubSub.subscribe('change-color',(event,data)=>{
        self.showTag=data.showTag;
      })
      PubSub.subscribe('success-page',(event,data)=>{
        if(data.changeStyle){ //当前为提交失败页面
          self.wapper=true;
        }
      })
    },
    mounted(){
      this.getUserName();
      this.getAccountList();
      this.updateTitle();
      console.log(this.$router.options.routes)
    },
  }
</script>
<style lang="scss" scoped>
  $border: #393b4c;
  *{
    font-family: 'Microsoft YaHei','Microsoft JhengHei',SimHei,Arial;
  }
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
    padding:0px;
    border: 0;
    font-family:Arial, Microsoft YaHei;
  }
  .navIcon{
    display:inline-block;
    font-size: 32px;
    color:#fff;
    margin-right: calc(36/1920*100vw);
  }
  .en-navIcon{
    display:inline-block;
    font-size: 32px;
    color:#fff;
    margin-right: calc(36/1920*100vw);
    /*<!--@media screen  and(min-width:1366px){-->*/
    /*<!--@include point(margin-left,25);-->*/
    /*<!--@include point(width,45);-->*/
    /*<!--}-->*/
    /*<!--@media screen  and(max-width:1366px){-->*/
    /*<!--@include point(margin-left,0);-->*/
    /*<!--@include point(width,35);-->*/
    /*<!--}-->*/
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
      height: calc(80/1920*100vw);
      line-height: calc(80/1920*100vw);
      box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
      .logo-width{
        width:calc(330/1920*100vw);
      }
      .logo-collapse-width{
        width:$collapseWidth;
        width: calc(100/1920*100vw);
      }
      .logo{
        height: calc(80/1920*100vw);
        line-height: calc(80/1920*100vw);
      }
      .logo-content{
        height: 100%;
        height: calc(80/1920*100vw);
        line-height: calc(80/1920*100vw);
        border-bottom: 1px solid  $border;
        background-color:#222538;
        @include borderColor;
        cursor: pointer;
        #imgLogo{
          position: relative;
          top: calc(15/1920*100vw);
          height: calc(43/1920*100vw);
          max-height: calc(43/1920*100vw);
          margin-right: calc(24/1920*100vw);
        }
        .sys-name{
          font-weight: bold;
          color: #f6f9fe;
          font-size: calc(24/1920*100vw);
        }
      }
      .logo-collapse-width #imgLogo{
        margin: 0 auto;
      }
      .el-traggle-content{
        height: 100%;
        border-right: 1px solid #e3e9f4;
        position: relative;
        .icon-outdent, .icon-indent{
          font-size: calc(24/1920*100vw);
          cursor: pointer;
          color: #7d8cad;
        }
      }
      .breadcrumb-inner{
        float:left;
        .breadcrumb-item{
          @include point(height,60);
          @include point(line-height,60);
          &:first-child{
            @include point(margin-left,20);
          }
        }
        @media screen  and(min-width:1366px){
          font-size: 16px;
        }
        @media screen  and(max-width:1366px){
          @include point(font-size,16);
        }
      }
      .headUrl-content{
        height: 100%;
        float: right;
        color: #fff;
        position: relative;
        overflow: hidden;
        width: 320px;
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
          margin-right: 20px;
          .username{
            color:#4b5262;
            margin: auto 10px;
            max-width: 90px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            i{
              color:#f31d65;
              font-weight: bold;
            }
          }
          .headImg{
            position: relative;
            top: 10px;
            margin-left: 10px;
          }
        }
      }
    }

    .main{
      display: flex;
      position: absolute;
      @include point(top,60);
      bottom:0px;
      background-color: #f4f5f9;
      .brand-panel{
        background-color: #222538;
        text-align: left;
        padding: calc(30/1920*100vw) calc(40/1920*100vw) calc(30/1920*100vw) calc(50/1920*100vw);
        border-bottom: 1px solid $border;
        .brand-label{
          display: block;
          color: #a0a4ad;
          margin-left: calc(2/1920*100vw);
          font-size: calc(16/1920*100vw);
          margin-bottom: calc(15/1920*100vw);
        }
        .brand-list{
          width: calc(240/1920*100vw);
          text-align: center;
          margin-left: calc(2/1920*100vw);
        }
        /deep/ .el-input--suffix .el-input__inner{
          padding-left: 0;
        }
      }
      .collapsed-brand-panel{
        height: calc(40/1920*100vw);
        border-bottom: 1px solid $border;
      }
      .brand-title{
        background-color: #222538;
        .item-content{
          background-color: #222538;
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
            background-color:#f31d65 !important;
          }
        }
        .el-submenu-group{
          @include point(margin-left,0);
          //font-size: 16px;
        }
        .en-el-submenu-group{
          @include point(margin-left,0);
        }
        #en-groupSubItem.el-menu-item,
        #groupSubItem.el-menu-item
        {
          background: #222538;
          color: #fff;
          border-bottom: 1px solid $border;
        }
        #en-groupSubItem.el-menu-item:hover{
          background-color: #f31d65 !important;
          color: #fff !important;
        }
        #en-groupSubItem.el-menu-item.is-active{
          background-color: #f31d65 !important;
          color: #fff !important;
        }
        #en-groupSubItem.el-menu-item{
          padding-left: calc(50/1920*100vw) !important;
        }

        .el-submenu-group{
          @include point(margin-left,0);
        }
        #groupSubItem.el-menu-item{
          background: #222538;
          color: #fff;
        }
        #groupSubItem.el-menu-item:hover{
          background-color: #f31d65 !important;
          color: #fff;
        }
        #groupSubItem.el-menu-item.is-active{
          background-color: #f31d65 !important;
          color: #fff;
        }
        #groupSubItem.el-menu-item{
          padding-left: calc(50/1920*100vw) !important;
        }

        .en-el-submenu-group{
          font-size: calc(16/1920*100vw);
          span{
            font-size: calc(14/1920*100vw);
          }
        }
        .el-submenu-group {
          font-size: 16px;
          span {
            font-size: 14px;
          }
          .third-child-span{
            font-size: calc(14/1920*100vw);
          }
        }
        #groupSubItem.submenu-item{
          height: 70px;
          line-height: 70px;
          .el-menu-item.is-active{
            background-color: #f31d65 !important;
          }
          span{
            font-size: 16px;
          }
        }
        #en-groupSubItem.submenu-item{
          height: 70px;
          line-height: 70px;
          span{
            font-size: calc(16/1920*100vw)
          }
        }
        #en-childSubItem.third-title{
          font-size: calc(14/1920*100vw) !important;
          color: #a0a4ad;
        }
        #childSubItem.third-title{
          font-size: 14px !important;
          color: #a0a4ad;
        }
        .three-child /deep/ .el-submenu__title {
          padding-left: calc(60/1920*100vw) !important;
          text-align: left;
          position: relative;
          min-width: auto !important;
          height: 60px;
          line-height: 60px;
        }
        .three-child .el-submenu__title:hover{
          background-color: rgba(243,29,101,0.1) !important;
          color:#fff !important;
        }
        .three-child /deep/ .el-menu{
          text-align: center !important;
        }
        .zh-third-title{
          font-size: 14px !important;
          color: #a0a4ad;
        }
        .zh-three-child /deep/ .el-submenu__title {
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
        .zh-three-child /deep/ .el-menu{
          text-align: center !important;
        }
        #childSubItem.submenu-item{
          position: relative;
          min-width: auto !important;
          padding-left: calc(60/1920*100vw) !important;
          border-bottom: 1px solid $border;
          &:hover{
            background-color: rgba(243,29,101,0.1) !important;
            color:#f31d65 !important;
          }
        }
        #en-childSubItem.submenu-item{
          position: relative;
          min-width: auto !important;
          padding-left: calc(60/1920*100vw) !important;
          border-bottom: 1px solid $border;
          span{
            font-size: calc(14/1920*100vw);
          }

          /*height: calc(70/1920*100vw);*/
          /*line-height: calc(70/1920*100vw);*/
          /*
          @media screen and(max-width:1366px){
            //padding-left: 2px !important;
            span{
              @include point(font-size,12);
            }
          }
          */
        }
      }
      .content-wrapper-all{
        height: auto;
        padding: calc(30/1920*100vw);
        /*border: solid #e3e9f4;*/
        /*border-width: 0;*/
        width:100%;
        //@include point(margin-right,50);
        background-color: #f4f5f9;
        min-height: calc(100vh - 80 / 1920 * 100vw - 45px);
      }
      .content-wrapper{
        height: auto;
        padding: calc(30/1920*100vw);
        /*border-width: 0;*/
        width: 100%;
        background: #f4f5f9;
        min-height: calc(100vh - 80 / 1920 * 100vw - 45px);
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
        padding-bottom: calc(10/1920*100vw);
        background-color: #f4f5f9;
        min-height: calc(100vh - 80 / 1920 * 100vw - 45px);
      }
      .footercontent{
        padding:0px 0 30px 60px;
        color:#777;
        font-size:12px;
        background-color: #f4f5f9;
      }
    }
    /*    .el-submenu:hover{
          background-color:#f31d65 !important;
          .tag-icon{
            background-color: #f31d65 !important;
          }
        }*/
    .el-menu-item:hover{
      background-color: rgba(243,29,101,0.1) !important;
      color:#f31d65 !important;
      .icon-content{
        color: #f31d65 !important;
      }
    }
    .el-menu-item.is-active{
      background-color: rgba(243,29,101,0.1) !important;
      color:#f31d65 !important;
      .icon-content{
        color: #f31d65 !important;
      }
    }
    .el-submenu.is-active .el-submenu__title{
      background-color:#f31d65 !important;
    }
    .aside-width{
      width: calc(330/1920*100vw);
      background-color: #222538;
      margin-top: -0.5px;
      /*overflow: scroll;*/
    }
    .aside-collapse-width{
      width:$collapseWidth;
      width: calc(100/1920*100vw);
      overflow: hidden !important;
      background-color: #222538;
    }
    .sec-collapsed{
      margin-left:100px;
      width:95.5%;
      height: auto;
      // width: auto;
    }
    .sec-uncoll{
      margin-left:calc(330/1920*100vw);
      height: auto;
      width:calc(100% - 330/1920*100vw);
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
    font-size: calc(24/1920*100vw) !important;
    font-family: 'Microsoft YaHei','Microsoft JhengHei',SimHei,Arial;
  }
  .options{
    padding-left: 20px;
    font-size: calc(24/1920*100vw) !important;
    font-family: 'Microsoft YaHei','Microsoft JhengHei',SimHei,Arial;
    height: 60px;
    line-height: 60px;
    color: #fff;
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background-color: rgba(243,29,101,0.1) !important;
    color: #f31d65 !important;
  }
  .el-select-dropdown__item.selected{
    background-color: rgba(243,29,101,0.1) !important;
    color: #f31d65 !important;
  }
</style>
<style>
  .brand-list .el-input__inner{
    background-color: #222538 !important;
    color: #fff;
    text-align: left;
    font-weight: bold !important;
    background-color: transparent;
    border: none !important;
    font-size: calc(24/1920*100vw);
  }
  .brand-list .is-disabled .el-input__inner{
    background-color: #222538 !important;
  }

  .brand-list .el-input__icon{
    color: #fff !important;
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
    background-color: #222538;
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
    right:calc(30/1920*100vw);
  }
  .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
    -webkit-transform: rotateZ(0deg);
    -ms-transform: rotate(0deg);
    transform: rotateZ(0deg);
    font-size: 16px;
    right:calc(30/1920*100vw);
  }
  .el-submenu__title{
    height: 70px;
    line-height: 70px;
    padding-left: calc(50/1920*100vw) !important;
    padding-right: 0 !important;
    background-color: #222538 !important;
    /*border-bottom: 1px solid  #393b4c;*/
  }
  .el-submenu__title:hover{
    background-color:  #f31d65 !important;
  }
  .el-submenu-content.el-submenu.is-active.is-opened > .el-submenu__title{
    background-color:  #f31d65 !important;
  }
  .el-submenu .el-menu-item{
    height: 60px;
    line-height: 60px;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title{
    background: #222385;
    color: #a0a4ad !important;
    border-bottom: 1px solid #393b4c;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title:hover{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title:hover .icon-content{
    color: #f31d65;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title:hover span{
    color: #f31d65;
  }
  .el-submenu.three-child.el-submenu-group .el-submenu__title.is-active{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }

  .el-menu--collapse{
    width: calc(100/1920*100vw);
  }
  .el-menu--collapse .el-submenu__title{
    padding: 0 calc(50/1920*100vw - 16px) !important ;
  }

  .container .main aside.aside-collapse-width  #en-groupSubItem.el-menu-item{
    padding-left: calc(50/1920*100vw - 16px) !important;
  }
  .container .main aside.aside-collapse-width  #groupSubItem.el-menu-item{
    padding-left: calc(50/1920*100vw - 16px) !important;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item{
    padding-left: calc(30/1920* 100vw) !important;
    padding-right: calc(50/1920* 100vw) !important;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start .icon-content{
    margin-right: calc(48/1920* 100vw);
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
  }
  .el-submenu.is-active .el-submenu__title{
    border-bottom-color: #393b4c !important;
  }
  .el-submenu__title{
    border-bottom: 1px solid #393b4c;
    background-color: #222538 !important;
  }
  .submenu-item{
    border-bottom: 1px solid #393b4c;
  }
  .el-menu .submenu-item:last-child{
    border-bottom: none;
  }
  .el-menu--popup .three-child .el-submenu__title{
    height: 60px;
    line-height: 60px;
    padding-left: calc(30/1920*100vw) !important;
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
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .three-child .el-menu--popup .el-menu-item.submenu-item.is-active{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item:hover{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item:hover .icon-content{
    color: #f31d65;
  }

  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item.is-active{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #en-childSubItem.el-menu-item.submenu-item.is-active .icon-content{
    color: #f31d65;
  }

  .container .three-child.el-submenu:hover{
    background-color: rgba(243,29,101,0.1) !important;
  }
  .container .three-child.el-submenu .el-submenu__title:hover span{
    color: #f31d65 !important;
  }
  .container .three-child.el-submenu .el-submenu__title:hover .icon-content{
    color: #f31d65;
  }
  /*.el-scrollbar__wrap{*/
  /*margin-right: 0 !important;*/
  /*}*/
  .three-child .el-submenu__title .el-submenu__icon-arrow{
    display: none;
  }
  .brandSelect.el-popper[x-placement^="bottom"] {
    margin-top: 5px;
    background-color: #2c3048;
    border: 1px solid #2c3048;
    box-shadow: 5px 5px 5px rgba(34,37,56,0.2);;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow{
    display: none;
  }
  .el-select .el-input--medium .el-input__inner{
    height: calc(30/1920*100vw);
    color: #fff;
  }

  /*中文*/
  #groupSubItem.el-menu-item:hover{
    background-color: #f31d65 !important;
    color: #fff !important;
  }
  #groupSubItem.el-menu-item.is-active{
    background-color: #f31d65 !important;
    color: #fff !important;
  }

  .el-submenu.zh-three-child .el-submenu__title{
    background: #222385;
    color: #fff;
    border-bottom: 1px solid #393b4c;
  }
  .el-submenu.zh-three-child .el-submenu__title:hover
  {
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important;
  }
  .el-submenu.zh-three-child .el-submenu__title:hover span
  {
    color:#f31d65 !important;
  }
  .el-submenu.zh-three-child .el-submenu__title.is-active{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .el-submenu.is-active.zh-three-child > .el-submenu__title .icon-content,.el-submenu.is-active.zh-three-child > .el-submenu__title span{
    color:#f31d65 !important ;
  }
  .el-submenu.is-active.three-child > .el-submenu__title .icon-content,.el-submenu.is-active.three-child > .el-submenu__title span{
    color:#f31d65 !important ;
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
  }
  .el-menu--popup .zh-three-child .el-submenu__title:hover span{
    color: #f31d65;
  }
  .el-menu--popup .zh-three-child .el-submenu__title.is-active span{
    color: #f31d65;
  }
  .el-menu--popup .zh-three-child .el-submenu__title:hover .icon-content{
    color: #f31d65;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item:hover{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item:hover .icon-content{
    color: #f31d65;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item.is-active{
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .el-menu.el-menu--popup.el-menu--popup-right-start #childSubItem.el-menu-item.submenu-item.is-active .icon-content{
    color: #f31d65;
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
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  .zh-three-child .el-menu--popup .el-menu-item.submenu-item.is-active
  {
    background-color: rgba(243,29,101,0.1) !important;
    color:#f31d65 !important ;
  }
  /*  .container .zh-three-child.el-submenu:hover{
      background-color: rgba(243,29,101,0.1) !important;
      color: #f31d65;

    }
    .container .zh-three-child.el-submenu:hover .icon-content{
      color: #f31d65;
    }*/
  .container .zh-three-child.el-submenu .el-submenu__title:hover span {
    color: #f31d65;
  }
  .container .zh-three-child.el-submenu .el-submenu__title:hover  .icon-content{
    color: #f31d65;
  }
  .zh-three-child .el-submenu__title .el-submenu__icon-arrow{
    display: none;
  }
  .el-submenu.zh-three-child .el-menu-item.submenu-item:hover .zh-third-child-span{
    color: #f31d65 !important;
  }
  .el-submenu.is-active.zh-three-child .el-menu-item.submenu-item.is-active .zh-third-child-span{
    color: #f31d65 !important;
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
    background-color: #f31d65 !important;
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
    /*height: 4px;*/
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
    margin-bottom: -17px  !important;
    margin-right: -4px !important;
  }
  .el-input__inner{
    font-family: Arial, 'Microsoft YaHei','Microsoft JhengHei',SimHei;
  }
  .el-select-dropdown__item{
    font-family: Arial, 'Microsoft YaHei','Microsoft JhengHei',SimHei;
  }
</style>
