<template>
  <el-row class="el-schedule-container" :style="{'min-height':varyWindowHeight-200+'px'}">
    <div class="el-schedule-header">
      <el-col :span="7" class="el-schedule-btns">
        <el-button type="primary" size="mini" :class="lang=='en' ? 'en-el-add-btn':'el-add-btn'"
                   @click="addScheduleButton">
          <i style="margin-right:18px;font-size:16px;" class="iconfont el-icon-plus"></i><span>{{generateScheduleLang('addSchedule')}}</span>
        </el-button>
        <el-button type="primary" size="mini" :class="lang=='en' ? 'en-el-delete-btn':'el-delete-btn'"
                   @click="deleteScheduleButton"
                   :disabled="Number(activeName) == 0? true: false"
        >
          <i style="margin-right:18px;font-size:16px;" class="iconfont icon-shanchu"></i><span>{{generateScheduleLang('delete')}}</span>
        </el-button>
      </el-col>
      <el-col :span="18" class="el-schedule-tabs">
        <el-tabs v-model="activePatrol" @tab-click="changePatrol" id="patrol-content">
          <el-tab-pane v-for="(item, index) in patrolList" :label="item.tag" :key="index" >
          </el-tab-pane>
          <remote-detail v-if="activePatrol == '0'" ref="remoteHandle" v-on:sendActiveName = "changeActiveName"></remote-detail>
          <onsite-detail v-if="activePatrol == '1'" ref="onsiteHandle" v-on:sendActiveName = "changeActiveName"></onsite-detail>
        </el-tabs>
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
        allData: false,
        storeList: [],
        tempStoreList: [],
        showSelfMonth: false,
        newTime: '',
        scheduleList: ['点检排程一'],
        patrolList: [{flag: 0, tag: this.$t('scheduleView.remotePatrol')}, {flag: 1, tag: this.$t('scheduleView.onsitePatrol')}],
        paneList: [],
        timeArray: ['08:00'], //选中的执行时间
        lang: this.$i18n.locale,
        monthList: [
          {
            'checked': false,
            value: 1,
            name: '1号'
          },
          {
            'checked': false,
            value: 2,
            name: '2号'
          },
          {
            'checked': false,
            value: 3,
            name: '3号'
          },
          {
            'checked': false,
            value: 4,
            name: '4号'
          },
          {
            'checked': false,
            value: 5,
            name: '5号'
          },
          {
            'checked': false,
            value: 6,
            name: '6号'
          },
          {
            'checked': false,
            value: 7,
            name: '7号'
          },
          {
            'checked': false,
            value: 8,
            name: '8号'
          },
          {
            'checked': false,
            value: 9,
            name: '9号'
          },
          {
            'checked': false,
            value: 10,
            name: '10号'
          },
          {
            'checked': false,
            value: 11,
            name: '11号'
          },
          {
            'checked': false,
            value: 12,
            name: '12号'
          },
          {
            'checked': false,
            value: 13,
            name: '13号'
          },
          {
            'checked': false,
            value: 14,
            name: '14号'
          },
          {
            'checked': false,
            value: 15,
            name: '15号'
          },
          {
            'checked': false,
            value: 16,
            name: '16号'
          },
          {
            'checked': false,
            value: 17,
            name: '17号'
          },
          {
            'checked': false,
            value: 18,
            name: '18号'
          },
          {
            'checked': false,
            value: 19,
            name: '19号'
          },
          {
            'checked': false,
            value: 20,
            name: '20号'
          },
          {
            'checked': false,
            value: 21,
            name: '21号'
          },
          {
            'checked': false,
            value: 22,
            name: '22号'
          },
          {
            'checked': false,
            value: 23,
            name: '23号'
          },
          {
            'checked': false,
            value: 24,
            name: '24号'
          },
          {
            'checked': false,
            value: 25,
            name: '25号'
          },
          {
            'checked': false,
            value: 26,
            name: '26号'
          },
          {
            'checked': false,
            value: 27,
            name: '27号'
          },
          {
            'checked': false,
            value: 28,
            name: '28号'
          },
          {
            'checked': false,
            value: 29,
            name: '29号'
          },
          {
            'checked': false,
            value: 30,
            name: '30号'
          },
          {
            'checked': false,
            value: 31,
            name: '31号'
          },
        ],
        selfMonthList: [
          {
            value: '1',
            label: '1月'
          },
          {
            value: '2',
            label: '2月'
          },
          {
            value: '3',
            label: '3月'
          },
          {
            value: '4',
            label: '4月'
          },
          {
            value: '5',
            label: '5月'
          },
          {
            value: '6',
            label: '6月'
          },
          {
            value: '7',
            label: '7月'
          },
          {
            value: '8',
            label: '8月'
          },
          {
            value: '9',
            label: '9月'
          },
          {
            value: '10',
            label: '10月'
          },
          {
            value: '11',
            label: '11月'
          },
          {
            value: '12',
            label: '12月'
          }
        ],
        value: '',
        input4: '',
        checked: false,
        checkAll: false,
        isIndeterminate: true,
        checkAll1: false,
        activeName: '0',
        curType: '0',
        typeList: [{
          value: '0',
          label: '日模式'
        },
          {
            value: '1',
            label: '周模式'
          },
          {
            value: '2',
            label: '月模式'
          },
          {
            value: '3',
            label: '自定义'
          }
        ],
        monthDays: [],
        showDrap: false,
        showMonthDrap: false,
        showMonthContent: false,
        weekList: [
          {
            'checked': false,
            'name': '周一',
            'value': '1',
          },
          {
            'checked': false,
            'name': '周二',
            'value': '2',
          },
          {
            'checked': false,
            'name': '周三',
            'value': '3',
          },
          {
            'checked': false,
            'name': '周四',
            'value': '4',
          },
          {
            'checked': false,
            'name': '周五',
            'value': '5',
          },
          {
            'checked': false,
            'name': '周六',
            'value': '6',
          },
          {
            'checked': false,
            'name': '周日',
            'value': '7',
          },

        ],
        weekValue: '每天',
        monthValue: '每月',
        weekDays: [],
        showWeekContent: false,
        showAddDialog: false,
        showDeleteDialog: false,
        scheduleName: '',
        storeCount: 0,
        serachVale: '',
        scheduleId: -1,
        bindStoreId: [],
        selectTab: '',
        selectWeek: [],
        selectMonth: [],
        enable: false,
        isFirstLoad: true,
        isDisabled: true,
        showBindDialog: false,
        selfMonth: '',
        activePatrol: '0',
        monthAndDay: [{month: 1, days: []}]
      }
    },

    methods: {
      generateScheduleLang,
      addScheduleButton() {
        let self = this;
        if (self.activePatrol == '0') {
          self.$refs.remoteHandle.addScheduleButton();
        }
        else {
          self.$refs.onsiteHandle.addScheduleButton();
        }

      },
      changeActiveName(val) {
        console.log(val + 'from sun')
        this.activeName = val;
      },
      deleteScheduleButton() {
        let self = this;
        if (self.activePatrol == '0') {
          self.$refs.remoteHandle.deleteScheduleButton();
        }
        else {
          self.$refs.onsiteHandle.deleteScheduleButton();
        }
      },
      changePatrol(val){
        let self = this;
        self.activePatrol = val.index;
        self.activeName = '0';
      }
    }
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
    font-family: Arial, Microsoft YaHei;
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

  .en-el-add-btn{
    background-color: $mainColor;
    color: #fff;
    border-color: $mainColor;
    position: relative;
    @include point(margin-right,15);
    //@include point(width, 120);
    font-size: 12px;
    &:disabled{
      opacity: 0.6;
    }
    @media screen and (min-width: 1680px){
      @include point(width, 120);
    }
    @media screen and (max-width: 1680px){
      width: 160px;
    }
  }

  .en-el-delete-btn{
    background-color: $mainColor;
    color: #fff;
    border-color: $mainColor;
    position: relative;
    @include point(margin-right, 15);
    // @include point(width, 120);
    font-size: 12px;
    &:disabled {
      opacity: 0.6;
    }
    @media screen and (min-width: 1680px){
      @include point(width, 120);
    }
    @media screen and (max-width: 1680px){
      width: 160px;
    }
  }

  .el-schedule-container{
    margin: 20px 15px 15px 15px;
    height: calc(180 / 1920 * 100vw);

    .el-schedule-header {
      @include point(margin-top, 10);

      .el-schedule-tabs {
        width: 98%;
        @include point(margin-left, 10);
      }

      .el-header-title {
        font-size: 14px;
        font-weight: bold;
        // @include point(margin-left, 30);
        position: absolute;
        top: 5px;
        display: inline;
        color: $black;
      }
      .el-header-hr {
        @include point(margin-bottom, 16);
        border: 0.5px solid #e3e9f4;
        position: relative;
        top: 25px;
      }
      .choice-device {
        @include point(margin-right, 30);
        font-size: 12px;
        color: $tab;
        display: inline;
        position: absolute;
        @include point(right, 220);
        @include point(margin-top, 10);
      }
      .el-schedule-btns {
        position: absolute;
        @include point(right, 30);
        z-index: 10;
        width: auto;
        @include point(top, 5);
        .el-add-btn {
          background-color: $mainColor;
          color: #fff;
          border-color: $mainColor;
          position: relative;
          @include point(margin-right, 15);
          font-size: 12px;
          &:disabled {
            opacity: 0.6;
          }
          @media screen and (min-width: 1680px){
            @include point(width, 98);
          }
          @media screen and (max-width: 1680px){
            width: 120px;
          }
        }
        .el-delete-btn {
          background-color: $mainColor;
          color: #fff;
          border-color: $mainColor;
          position: relative;
          @include point(margin-right, 15);
          font-size: 12px;
          &:disabled {
            opacity: 0.6;
          }
          @media screen and (min-width: 1680px){
            @include point(width, 98);
          }
          @media screen and (max-width: 1680px){
            width: 120px;
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
      overflow: hidden;
      text-overflow: ellipsis;

    }
    #patrol-content /deep/ .is-active {
      border-bottom: 4px solid #f31d65;
    }

    #patrol-content /deep/ .el-tabs__active-bar{
      height: 0 !important;
    }
  }

</style>
<style>
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
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
</style>
