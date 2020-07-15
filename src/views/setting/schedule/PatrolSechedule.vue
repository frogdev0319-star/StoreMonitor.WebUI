<template>
  <el-row class="schedule-container" :style="{'min-height':varyWindowHeight-200+'px'}">
    <div class="el-schedule-header">
      <el-col :span="24" class="el-schedule-btns">
        <div class="left-title">
          <span class="title">{{generateScheduleLang('scheduleTitle')}}</span>
          <el-select v-model="isActive" :placeholder="$t('storeView.selectPlaceholder')" @change="changePatrolType">
            <el-option v-for="item in patrolList" :key="item.flag" :label="item.tag" :value="item.flag"></el-option>
          </el-select>
          <el-select v-model="isActivePatrol" :placeholder="$t('storeView.selectPlaceholder')" @change="changePatrolList">
            <el-option v-for="item in patrolList" :key="item.flag" :label="item.tag" :value="item.flag"></el-option>
          </el-select>
        </div>
        <div class="right-title">
          <el-button type="primary" size="mini" :class="lang=='en' ? 'en-el-add-btn':'el-add-btn'" class="btn-class"
                   @click="addScheduleButton">
            <div class="btn-area">
              <i class="iconfont el-icon-plus"></i>
              <span>{{generateScheduleLang('addSchedule')}}</span>
            </div>
          </el-button>
          <el-button type="primary" size="mini" :class="lang=='en' ? 'en-el-delete-btn':'el-delete-btn'" class="btn-class"
                    @click="deleteScheduleButton"
                    :disabled="Number(activeName) == 0? true: false"
          >
            <div class="btn-area">
              <i class="iconfont icon-shanchu"></i>
              <span>{{generateScheduleLang('delete')}}</span>
            </div>
          </el-button>
        </div>
      </el-col>
      <el-col :span="24" class="el-schedule-tabs">
        <!-- <el-tabs v-model="activePatrol" @tab-click="changePatrol" id="patrol-content"> -->
          <!-- <el-tab-pane v-for="(item, index) in patrolList" :label="item.tag" :key="index" > -->
          <!-- </el-tab-pane> -->
          <remote-detail ref="remoteHandle" v-on:sendActiveName = "changeActiveName" @paneList="getpaneList" :active-patrol = 'activePatrol'></remote-detail>
          <!--<onsite-detail v-if="activePatrol == '1'" ref="onsiteHandle" v-on:sendActiveName = "changeActiveName"></onsite-detail>-->
        <!-- </el-tabs> -->
      </el-col>
    </div>
  </el-row>
</template>

<script>

  import {generateScheduleLang} from '@/api/i18n'
  import {getScheduleBindList, addNewSchedule, getScheduleListService, bindScheduleAndStore, unbindScheduleAndStore, updateSchedule,deleteScheduleService} from '@/api/schedule'
  import {getStoreList} from '@/api/store'
  import RemoteDetail from '@/views/setting/schedule/RemoteDetail'
  import OnsiteDetail from '@/views/setting/schedule/OnsiteDetail'
  import {mapGetters} from 'vuex'

  export default {
    name: "PatrolSchedule",
    components: {
      OnsiteDetail,
      RemoteDetail
    },
    data() {
      return {
        varyWindowHeight: window.innerHeight,
        varyWindowWidth: window.innerWidth,
        patrolList: [{flag: 0, tag: this.$t('scheduleView.remotePatrol')}, {flag: 1, tag: this.$t('scheduleView.onsitePatrol')}],
        paneList: [],
        timeArray: ['08:00'], //选中的执行时间
        lang: this.$i18n.locale,
        activeName: '0',
        activePatrol: '0',
        isActive:'',
        isActivePatrol:'',
        paneLength:0
      }
    },
    methods: {
      generateScheduleLang,
      addScheduleButton() {
        let self = this;
        if(self.paneLength==10||self.paneLength>10){
            self.notify(self.$t('insSettingView.SchdRemoteLength'),'warning',3000);
            return false;         
        }else{
          self.$refs.remoteHandle.addSchedule();
        }
      },
      changePatrolType(val){

      },
      changePatrolList(val){
        
      },
      notify(msg,type,time) {
          this.$message({
              message: msg,
              type: type,
              duration:time
          });
      },
      changeActiveName(val) {
        console.log(val + 'from sun')
        this.activeName = val;
      },
      getpaneList(val){
        console.log('排程个数',val)
        this.paneLength = val
      },
      deleteScheduleButton() {
        let self = this;
        self.$refs.remoteHandle.deleteScheduleButton();
      },
      changePatrol(val){
        let self = this;
        self.activePatrol = val.index;
        self.activeName = '0';
        self.$refs.remoteHandle.activeName = '0'
        self.$refs.remoteHandle.isFirstLoad = true
        self.$nextTick(()=>{
          self.$refs.remoteHandle.getScheduleList();
        })
      }
    },
    watch:{
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          // self.activePatrol = '0';
          self.$refs.remoteHandle.isFirstLoad = true;
          self.$refs.remoteHandle.activeName = "0";
          self.activeName = '0';
          self.$refs.remoteHandle.getScheduleList();
        }
      }
    },
    computed:{
      ...mapGetters({
        accountChanged:'accountChanged'
      }),
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/css/textstyle.css';
  @import '../../../assets/css/importfile.css';
  @import '../../../assets/css/tabsItem.css';
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $mainColor:#f31d65;
  *{
    font-family: Roboto,Arial, Microsoft YaHei;
  }
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
  
  .el-add-btn{
    color: #fff;
    position: relative;
    margin-right:calc(20/1920*100vw);
    font-size: calc(14/1920*100vw);
    height: calc(36/1920*100vw);
    padding: 0 0;
    width: calc(130/1920*100vw);
    &:disabled{
      opacity: 0.5;
    }
    @media screen and (max-width: 1680px){
      width: 120px;
    }
  }
  .en-el-add-btn{
    color: #fff;
    position: relative;
    margin-right:calc(20/1920*100vw);
    font-size: calc(14/1920*100vw);
    height: calc(36/1920*100vw);
    padding: 0 0;
    width: calc(160/1920*100vw);
    &:disabled{
      opacity: 0.5;
    }
    @media screen and (max-width: 1680px){
      width: 110px !important;
    }

  }
  .el-delete-btn {
    color: #fff;
    position: relative;
    margin-right:calc(20/1920*100vw);
    font-size: calc(14/1920*100vw);
    height: calc(36/1920*100vw);
    padding: 0 0;
    width: calc(130/1920*100vw);
    @media screen and (max-width: 1680px){
      width: 120px;
    }
    &:disabled {
      opacity: 0.5;
    }
  }
  .en-el-delete-btn{
    color: #fff;
    position: relative;
    margin-right:calc(20/1920*100vw);
    font-size: calc(14/1920*100vw);
    height: calc(36/1920*100vw);
    padding: 0 0;
    width: calc(160/1920*100vw);
    @media screen and (max-width: 1680px){
      width: 110px !important;
    }
    &:disabled {
      opacity: 0.5;
    }
  }
  .btn-class{
    height: calc(36/1920*100vw);
    padding: 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    .el-icon-plus, .icon-shanchu{
      font-size: calc(16/1920*100vw);
      margin-right: calc(8/1920*100vw);
    }
  }
  .btn-area{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /*.en-el-delete-btn.btn-class, en-el-add-btn.btn-class{*/
    /*width: 100px;*/
  /*}*/
  .schedule-container{
    padding: 20px calc(15/1920*100vw) 25px 15px;
    /*height: calc(180 / 1920 * 100vw);*/
    border: 1px solid $border;
    background-color: #fff;
    .el-schedule-header {
      @include point(margin-top, 10);

      .el-schedule-tabs {
        width: 98%;
        @include point(margin-left, 10);
        margin-top: 30px;
      }
      .el-schedule-btns {
        position: absolute;
        @include point(right, 30);
        width: 98%;
        padding-left: 22px;
        @include point(top, 20);
        display: flex;
        .left-title{
          flex:1;
          text-align: left;
          .title{
            font-size: 16px;
            color:#182752;
            font-weight: 600;
          }
          .el-select{
            margin-left:calc(30/1920*100vw);
            width:200px;
          }
        }
      }
    }
    #patrol-content /deep/ .el-tabs__nav-scroll{
      height: 40px;
    }
    #patrol-content /deep/ .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: 120px;
      text-overflow: ellipsis;
    }

    #patrol-content /deep/ .el-tabs__active-bar{
      height: 4px;
    }
  }
  /* 浏览器滚动条样式 */
  /* width */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(255, 255, 255);
    border-radius: 8px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(201, 201, 202);
    border-radius: 8px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(162, 162, 163);
  }
  .el-schedule-btns /deep/ .el-input__inner{
    color:#7d8cad;
    background-color: #f4f5f9;
    font-size: 14px;
    text-align: left;
    height:35px;
  }
</style>
<style>
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-switch.is-checked .el-switch__core{
    border-color: #00FF00;
    background-color: #00FF00;
  }
</style>
