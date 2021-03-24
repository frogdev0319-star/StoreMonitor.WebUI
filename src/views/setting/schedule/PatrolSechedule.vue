<template>
  <el-row :style="{'min-height':varyWindowHeight-200+'px'}" class="schedule-container">
    <div class="el-schedule-header">
      <el-col :span="24" class="el-schedule-btns">
        <div class="left-title">
          <span v-if="lang !== 'en'" class="title">{{ $t('scheduleView.scheduleTitle') }}</span>
          <span v-if="lang === 'en' && varyWindowWidth > 1366" class="title">
            {{ $t('scheduleView.noscheduleInspect') }}</span>
          <el-tooltip v-if="varyWindowWidth <= 1366" :content="$t('scheduleView.noscheduleInspect')"
                      class="item" effect="dark" placement="top">
            <span v-if="lang === 'en'" class="title">{{ $t('scheduleView.noscheduleInspect') }}</span>
          </el-tooltip>
          <el-select v-model="isActive" :placeholder="$t('storeView.selectPlaceholder')" @change="changePatrolType">
            <el-option v-for="item in patrolList" :key="item.flag" :label="item.tag" :value="item.flag"/>
          </el-select>
          <el-select v-model="activePatrolId" :placeholder="$t('storeView.selectPlaceholder')"
                     @change="changePatrolList(activePatrolId,isActive)">
            <el-option v-for="(item,index) in InspectList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>
        <div class="right-title">
          <el-button
            :class="lang === 'en' ? 'en-el-add-btn' : 'el-add-btn'"
            type="primary"
            size="mini"
            class="btn-class"
            @click="addScheduleButton">
            <div class="btn-area">
              <i class="iconfont el-icon-plus"/>
              <span>{{ $t('scheduleView.addSchedule') }}</span>
            </div>
          </el-button>
          <el-button
            :class="lang === 'en' ? 'en-el-delete-btn' : 'el-delete-btn'"
            :disabled="paneLength===0 ? true : false"
            type="primary"
            size="mini"
            class="btn-class"
            @click="deleteScheduleButton"
          >
            <div class="btn-area">
              <i class="iconfont icon-shanchu"/>
              <span>{{ $t('scheduleView.delete') }}</span>
            </div>
          </el-button>
        </div>
      </el-col>
      <el-col :span="24" class="el-schedule-tabs">
        <remote-detail ref="remoteHandle" :active-patrol = "activePatrol" :inspect-id="activePatrolId"
                       @sendActiveName = "changeActiveName" @paneList="getpaneList"/>
      </el-col>
    </div>
  </el-row>
</template>

<script>

import {
  getScheduleBindList,
  addNewSchedule,
  getScheduleListService,
  bindScheduleAndStore,
  unbindScheduleAndStore,
  updateSchedule,
  deleteScheduleService
} from '@/api/schedule';
import { getStoreList } from '@/api/store';
import { inpectRESTful } from '@/api/index';
import RemoteDetail from '@/views/setting/schedule/RemoteDetail';
import { mapGetters } from 'vuex';

export default {
  name: 'PatrolSchedule',

  components: {
    RemoteDetail
  },

  data() {
    return {
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      InspectList: [],
      patrolList: [
        {
          flag: 0,
          tag: this.$t('scheduleView.remotePatrol')
        },
        {
          flag: 1,
          tag: this.$t('scheduleView.onsitePatrol')
        }
      ],
      paneList: [],
      timeArray: ['08:00'],
      lang: this.$i18n.locale,
      activeName: '0',
      activePatrol: '0',
      isActive: 0,
      activePatrolId: null,
      paneLength: 0
    };
  },
  watch: {
    accountChanged(val) {
      console.log(val);
      let self = this;
      if (val !== 0) {
        self.$refs.remoteHandle.isFirstLoad = true;
        self.$refs.remoteHandle.activeName = '0';
        self.activeName = '0';
        self.isActive = 0;
        self.changePatrolType(0);
      }
    }
  },

  mounted() {
    let self = this;
    self.changePatrolType(0);
  },

  methods: {
    changePatrolType(val) {
      let self = this;
      self.activePatrolId = null;
      self.getTagList(val);
    },

    getTagList(val){
      let self = this;
      let params = {
        mode: val
      };
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList(params).then(res => {
          let data = res.data;
          let InspectList = [];
          data.forEach(item => {
            if (item.appliedTo.length !== 0) {
              let isrole = [];
              item.appliedTo.forEach(app_item => {
                if (app_item.roleId  ===  3 || app_item.roleId  ===  4) {
                  isrole.push(app_item);
                }
              });
              if (isrole.length !== 0) {
                let obj = {};
                obj.id = item.id;
                obj.name = item.name;
                obj.roleId = item.appliedTo;
                InspectList.push(obj);
              }
            }
          });
          self.InspectList = InspectList;
          if (self.InspectList.length !== 0) {
            self.activePatrolId = self.InspectList[0].id;
            self.changePatrolList(self.activePatrolId, self.isActive);
          } else {
            self.changePatrolList('noInspect', self.isActive);
          }
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      });
    },

    changePatrolList(val1, val2) {
      let self = this;
      self.$refs.remoteHandle.getScheduleList(val1, val2);
    },

    addScheduleButton() {
      let self = this;
      let pleg = self.$refs.remoteHandle.paneList;
      if (pleg.length >= 10) {
        self.notify(self.$t('insSettingView.SchdRemoteLength'), 'warning', 3000);
        return false;
      } else {
        self.$refs.remoteHandle.addSchedule(self.activePatrolId);
      }
    },
    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    changeActiveName(val) {
      this.activeName = val;
    },

    getpaneList(val) {
      this.paneLength = val;
    },

    deleteScheduleButton() {
      let self = this;
      self.$refs.remoteHandle.deleteScheduleButton();
    },

    changePatrol(val) {
      let self = this;
      self.activePatrol = val.index;
      self.activeName = '0';
      self.$refs.remoteHandle.activeName = '0';
      self.$refs.remoteHandle.isFirstLoad = true;
      self.$nextTick(() => {
        self.$refs.remoteHandle.getScheduleList();
      });
    }

  },

  computed: {
    ...mapGetters({
      accountChanged: 'accountChanged'
    })
  }
};
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
            @media screen and (max-width: 1366px){
              width: 310px !important;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              float:left;
            }
          }
          .el-select{
            margin-left:calc(30/1920*100vw);
            width:calc(200/1920*100vw);
          }
        }
      }
    }
  }
  .el-schedule-btns >>> .el-input__inner{
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
