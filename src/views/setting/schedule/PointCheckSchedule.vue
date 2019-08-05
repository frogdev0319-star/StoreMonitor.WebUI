<template>
  <el-row class="el-schedule-container" :style="{'min-height':varyWindowHeight-200+'px'}">
    <div class="el-schedule-header">
      <el-col :span="7" class="el-schedule-btns">
        <el-button type="primary" size="mini" :class="lang=='en' ? 'en-el-add-btn':'el-add-btn'"
                   @click="addScheduleButton">
          <i style="margin-right:18px;font-size:16px;" class="iconfont el-icon-plus"></i><span>{{generateScheduleLang('addSchedule')}}</span>
        </el-button>
        <el-button type="primary" size="mini" :class="lang=='en' ? 'en-el-delete-btn':'el-delete-btn'"
                   @click="deleteScheduleButton" :disabled="Number(activeName) == 0? true: false">
          <i style="margin-right:18px;font-size:16px;" class="iconfont icon-shanchu"></i><span>{{generateScheduleLang('delete')}}</span>
        </el-button>
      </el-col>
      <el-dialog :title="generateScheduleLang('addSchedule')"
                 :visible.sync="showAddDialog" v-if="showAddDialog"
                 :append-to-body='true'
                 :close-on-click-modal="false"
                 width="28%"
                 top="35vh"
                 left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #f31d65;"/>
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <span>{{generateScheduleLang('scheduleName')}}</span>
            <el-input v-model="scheduleName" clearable  :placeholder="generateScheduleLang('inputPlaceholder')" size="mini" ref="scheduleName"
                      class="el-schedule-name"></el-input>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" @click="showAddDialog = false" size="mini" style="">{{generateScheduleLang('cancel')}}</el-button>
          <el-button class="file-confirm-btn" @click="addSchedule" size="mini" type="primary">{{generateScheduleLang('confirm')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="generateScheduleLang('delete')"
                 :visible.sync="showDeleteDialog" v-if="showDeleteDialog"
                 :append-to-body='true'
                 :close-on-click-modal="false"
                 width="28%"
                 top="35vh"
                 left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #f31d65;"/>
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
            <span>{{generateScheduleLang('saveInfo')}}</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" @click="showDeleteDialog = false" size="mini" style="">{{generateScheduleLang('cancel')}}</el-button>
          <el-button class="file-confirm-btn" @click="deleteSchedule" size="mini"
                     type="primary">{{generateScheduleLang('confirm')}}
          </el-button>
        </div>
      </el-dialog>
      <el-col :span="18" class="el-schedule-tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick" id='patrltabs-content'>
          <el-tab-pane v-for="(paneItem,index) in paneList" :name="index.toString()"
                       :key="index" :label="`${paneItem.name}`">
            <div :style="{height:varyWindowHeight}">
              <el-col :span="24" class="header-details">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('scheduleType')}}</span>
                <el-select v-model="paneItem.mode" clearable  placeholder="选择类型" size="mini" :disabled="isDisabled" @change="searchStore"
                           class="el-type" >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div  class="day-detail" v-if="paneItem.mode == 2">
                  <span>{{generateScheduleLang('execDays')}}</span>
                  <div class="month-content" @click="choiceMonth">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="monthValue" size="mini" id="elMonth" :placeholder="generateScheduleLang('everyMonth')" :readonly=true></el-input>
                    <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="month-panel" v-if="showMonthContent" @mouseleave="showMonthContent=false">
                    <div class="month-details">
                      <el-checkbox v-model="checkAllMonth" @change="allMonthChecked"></el-checkbox> <span>{{generateScheduleLang('all')}}</span>
                    </div>
                    <div class="month-details" v-for="(item,index) in monthList" :key="index">
                      <el-checkbox v-model="item.checked" @change="changeMonthItem(item)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <!-- 周模式下 天和日期都可以多选 开始-->
              <el-col :span="24" class="header-details" v-if="paneItem.mode == 1" v-for="(_item, _index) in paneItem.weeklySchedule" :key="'mode1'+_index">
                <div class="day-detail">
                  <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectOnDay')}}</span>
                  <div class="day-content" @click="choiceWeek(_index)">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="_item.dateStr" size="mini" id="elWeek" :placeholder="generateScheduleLang('everyDay')" :readonly=true></el-input>
                      <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="week-panel" v-if="_item.showWeekContent" @mouseleave="_item.showWeekContent = false">
                    <div class="week-details">
                      <el-checkbox v-model="checkAllWeek" @change="allWeekChecked(_index)"></el-checkbox> <span>{{generateScheduleLang('all')}}</span>
                    </div>
                    <div class="week-details" v-for="(item,index) in weekList" :key="index">
                      <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="changeWeekItem(_index)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
                <div class="day-detail" >
                  <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('exectionTime')}}</span>
                  <div class="day-content" @click="choiceTime(_index)">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="_item.timeArray.toString()" size="mini" id="elWeek" :placeholder="generateScheduleLang('exectionTime')" :readonly=true></el-input>
                    <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="week-panel" v-if="_item.showTimeContent" @mouseleave="_item.showTimeContent=false">
                    <div class="week-details" v-for="(timeItem,timeIndex) in weeklyTimeArray" :key="'time'+ timeIndex">
                      <el-checkbox v-model="timeItem.checked" @change="changeTimeItem(_index)"></el-checkbox>
                      <span>{{timeItem.name}}</span>
                    </div>
                  </div>
                </div>
                <span class="delete-time-btn" size="mini" v-if="paneItem.weeklySchedule.length > 1" style="margin: 0 20px 0 30px"
                      @click="deleteWeekDays(_index)"><i class="el-icon-error"></i>
                </span>
                <el-button class="time-btn" size="mini" @click="addWeekDays" :style="paneItem.weeklySchedule.length == 1 ? {margin:'0 0 0 50px'}:{margin:'0 20px 0 30px'}"
                           v-if="_index == paneItem.weeklySchedule.length-1 && !showAddWeek"><i class="el-icon-plus"></i></el-button>
              </el-col>

              <el-col :span="24" class="header-details" v-if="showAddWeek && paneItem.mode == 1">
                <div class="day-detail">
                  <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectOnDay')}}</span>
                  <div class="day-content" @click="choiceWeek(-1)">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="weekValue" size="mini" id="elWeek" :placeholder="generateScheduleLang('everyDay')" :readonly=true></el-input>
                    <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="week-panel" v-if="showWeekContent" @mouseleave="showWeekContent = false">
                    <div class="week-details">
                      <el-checkbox v-model="checkAllWeek" @change="allWeekChecked(-1)"></el-checkbox> <span>{{generateScheduleLang('all')}}</span>
                    </div>
                    <div class="week-details" v-for="(item,index) in weekList" :key="index">
                      <el-checkbox v-model="item.checked" :disabled="item.disabled"  @change="changeWeekItem(-1)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
                <div class="day-detail">
                    <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('exectionTime')}}</span>
                    <div class="day-content" @click="choiceTime(-1)">
                      <div class="input-arrow-panel"></div>
                      <el-input v-model="timeArray.toString()" size="mini" id="elWeek" :placeholder="generateScheduleLang('everyDay')" :readonly=true></el-input>
                      <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                    </div>
                    <div class="week-panel" v-if="showTimeContent" @mouseleave="hideTimePanel">
                      <div class="week-details" v-for="(timeItem,timeIndex) in weeklyTimeArray" :key="'time'+ timeIndex">
                        <el-checkbox v-model="timeItem.checked"  @change="changeTimeItem(-1)"></el-checkbox>
                        <span>{{timeItem.name}}</span>
                      </div>
                    </div>
                  </div>
                  <span class="delete-time-btn" size="mini" v-if="" style="margin: 0 20px 0 30px"
                        @click="deleteWeekDays(-1)"><i class="el-icon-error"></i></span>
                  <el-button class="time-btn" size="mini" @click="addWeekDays(-1)"><i class="el-icon-plus"></i></el-button>
              </el-col>
              <!-- 日模式和月模式 -->
              <el-col :span="24" class="header-details" v-if="timeItem.length > 0 && paneItem.mode != 1" v-for="(timeItem, timeIndex) in paneItem.timeArray"
                      :key="timeIndex">
                <span  :id="lang=='en'? 'en-span': 'span'" :style="timeIndex==0 ? 'visibility: visable' :'visibility: hidden'">{{generateScheduleLang('exectionTime')}}</span>
                <el-time-select
                  class="time-select"
                  v-model="paneItem.timeArray[timeIndex]"
                  :picker-options="{
                    start: '08:00',
                    step: '00:15',
                    end: '23:59'
                  }"
                  placeholder="选择时间"
                  size="mini"
                >
                </el-time-select>
                <span class="delete-time-btn" size="mini" v-if="paneItem.timeArray.length > 1" style="margin: 0 20px 0 30px"
                      @click="deleteCurTime(timeIndex)"><i class="el-icon-error"></i></span>
                <el-button class="time-btn" size="mini" @click="addTime" :style="paneItem.timeArray.length == 1 ? {margin:'0 0 0 50px'}:{margin:'0 20px 0 30px'}"
                           v-if="timeIndex == paneItem.timeArray.length-1 && !showAddTime"><i class="el-icon-plus"></i></el-button>
              </el-col>
              <el-col v-if="showAddTime && paneItem.mode != 1" :span="24" class="header-details">
                <span style="visibility: hidden;" :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('exectionTime')}}</span>
                <el-time-select
                  class="time-select"
                  v-model="newTime"
                  :picker-options="{
                    start: '08:00',
                    step: '00:15',
                    end: '23:59'
                  }"
                  @change="changTime"
                  :placeholder= "generateScheduleLang('selectTime')"
                  size="mini">
                </el-time-select>
                <span class="delete-time-btn" size="mini" @click="deleteCurTime(-1)" style="margin: 0 20px 0 30px"><i class="el-icon-error" ></i></span>
                <el-button class="time-btn" size="mini" @click="addTime"><i class="el-icon-plus"></i></el-button>
              </el-col>
            </div>
            <hr class="el-header-hr"/>
            <div class="el-bind-header" style="position: relative;top: 20px;">
                <span class="el-header-title" style="left: 10px;font-size: 14px;margin-top: 10px;
                margin-bottom: 10px;">{{generateScheduleLang('bindStore')}}</span>
              <span class="choice-device"><i class="iconfont icon-tishi1"
                                             style="margin-right:10px;color:#93A2B6;"></i>{{generateScheduleLang('hasBind')}}{{storeCount}}{{generateScheduleLang('stores')}}</span>
              <el-input
                size="small"
                class="el-search-input"
                :clearable=true
                :placeholder="generateScheduleLang('searchInfo')"
                v-model="serachVale" @keyup.enter.native="searchStoreInput">
                <i @click="searchStoreInput" slot="prefix" class="iconfont icon-sousuo"
                   style="position:relative;top:6px;left:6px;font-size:18px;"></i>
              </el-input>
            </div>
            <el-col style="margin-top: 65px;">
              <div class="el-bind-content" :style="{'min-height':varyWindowHeight*0.44+'px'}">
                <div  class="el-all-checkbox" v-if="storeList.length!=0">
                  <el-checkbox v-model="allData" :disabled="allDisabled"  @change="choiceAll" style="margin-right: 20px"></el-checkbox>
                  <span class="all-device-title">{{generateScheduleLang('bindAllStore')}}</span>
                </div>
                <div class="device-group" v-for="(item,index) in storeList" :key="index">
                  <div class="device-all-checkbox" style="float: left;">
                    <div style="display: block">
                      <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="choiceAllGroup(item)" style="margin-right: 20px"></el-checkbox>
                      <span class="group-name">{{item.cityName}}</span>
                    </div>
                  </div>
                  <div class="device-content" style="clear: left;margin-left: 60px;text-align: left">
                    <div class="device-detail" v-for="(_item,_index) in item.itemData" :key="_index" style="margin-top: 20px;">
                      <el-checkbox v-model="_item.checked" :disabled="_item.disabled"
                                   @change="choiceAllDevice(index,item,_index,_item)" style="margin-right: 20px"></el-checkbox>
                      <span class="device-name" :style="{'color': _item.disabled ? '#7d8cad':''}">{{_item.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style="float: left;margin: 30px 0px 30px 20px;font-size: 14px;">
                <span style="margin-right: 70px">{{generateScheduleLang('enable')}}</span>
                <el-switch
                  v-model="paneItem.enable"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </div>
              <div class="el-bind-footer" style="right: 30px;margin-top: 50px;">
                <div class="el-btn-content">
                  <el-button :disabled="storeList.length==0" class="btn" size="mini" @click="bindScheduleBtn"><i
                    class="iconfont icon-quxiaolianjie" style="margin-right:10px;"></i>{{generateScheduleLang('saveAndApply')}}
                  </el-button>
                </div>
              </div>
            </el-col>

          </el-tab-pane>
        </el-tabs>
        <el-dialog :title="generateScheduleLang('prompt')"
                   :visible.sync="showBindDialog" v-if="showBindDialog"
                   :append-to-body='true'
                   :close-on-click-modal="false"
                   width="28%"
                   top="35vh"
                   left="40vh">
          <div class="dialog-content" style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #f31d65;"/>
            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
              <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
              <span>{{generateScheduleLang('confirmBind')}}</span>
            </p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" @click="showBindDialog = false" size="mini" style="">{{generateScheduleLang('cancel')}}</el-button>
            <el-button class="file-confirm-btn" @click="bindSchedule" size="mini"
                       type="primary">{{generateScheduleLang('confirm')}}
            </el-button>
          </div>
        </el-dialog>
        <dialog-vue :dialog-title='selectWeekObj.title' :show-info='selectWeekObj.showInfo' :is-warning='selectWeekObj.isWarning' :dialog-closed='selectWeekObj.dialogClosed' @confirmed='noWeekDialog' @canceled='cancelNoWeek'></dialog-vue>
        <dialog-vue :dialog-title='selectMonthObj.title' :show-info='selectMonthObj.showInfo' :is-warning='selectMonthObj.isWarning' :dialog-closed='selectMonthObj.dialogClosed' @confirmed='noMonthDialog' @canceled='cancelNoMonth'></dialog-vue>
      </el-col>
    </div>
  </el-row>
</template>

<script>

  import {generateScheduleLang} from '@/api/i18n'
  import {getScheduleBindList, addNewSchedule, getScheduleListService, bindScheduleAndStore, unbindScheduleAndStore, updateSchedule,deleteScheduleService} from '@/api/schedule'
  import {getStoreList} from '@/api/store'
  import DialogVue from '@/components/DialogVue.vue'
  import util from '@/common/util'

  export default {
    name: "PointCheckSch",
    components:{
      DialogVue
    },
    data(){
      return {
        varyWindowHeight:window.innerHeight,
        varyWindowWidth:window.innerWidth,
        allData:false,
        allDisabled: false,
        storeList:[],
        tempStoreList :[],
        showAddTime: false,
        newTime: '',
        scheduleList: ['点检排程一'],
        paneList:[],
        timeArray: [], //选中的执行时间
        lang: this.$i18n.locale ,
        monthList:[
          {
            'checked': false,
            value: 1,
            name: '1'
          },
          {
            'checked': false,
            value: 2,
            name: '2'
          },
          {
            'checked': false,
            value: 3,
            name: '3'
          },
          {
            'checked': false,
            value: 4,
            name: '4'
          },
          {
            'checked': false,
            value: 5,
            name: '5'
          },
          {
            'checked': false,
            value: 6,
            name: '6'
          },
          {
            'checked': false,
            value: 7,
            name: '7'
          },
          {
            'checked': false,
            value: 8,
            name: '8'
          },
          {
            'checked': false,
            value: 9,
            name: '9'
          },
          {
            'checked': false,
            value: 10,
            name: '10'
          },
          {
            'checked': false,
            value: 11,
            name: '11'
          },
          {
            'checked': false,
            value: 12,
            name: '12'
          },
          {
            'checked': false,
            value: 13,
            name: '13'
          },
          {
            'checked': false,
            value: 14,
            name: '14'
          },
          {
            'checked': false,
            value: 15,
            name: '15'
          },
          {
            'checked': false,
            value: 16,
            name: '16'
          },
          {
            'checked': false,
            value: 17,
            name: '17'
          },
          {
            'checked': false,
            value: 18,
            name: '18'
          },
          {
            'checked': false,
            value: 19,
            name: '19'
          },
          {
            'checked': false,
            value: 20,
            name: '20'
          },
          {
            'checked': false,
            value: 21,
            name: '21'
          },
          {
            'checked': false,
            value: 22,
            name: '22'
          },
          {
            'checked': false,
            value: 23,
            name: '23'
          },
          {
            'checked': false,
            value: 24,
            name: '24'
          },
          {
            'checked': false,
            value: 25,
            name: '25'
          },
          {
            'checked': false,
            value: 26,
            name: '26'
          },
          {
            'checked': false,
            value: 27,
            name: '27'
          },
          {
            'checked': false,
            value: 28,
            name: '28'
          },
          {
            'checked': false,
            value: 29,
            name: '29'
          },
          {
            'checked': false,
            value: 30,
            name: '30'
          },
          {
            'checked': false,
            value: 31,
            name: '31'
          },
        ],
        value: '',
        input4:'',
        checked:false,
        checkAll: false,
        isIndeterminate: true,
        checkAll1: false,
        activeName: '0',
        curType: 0,
        typeList:[
          {
            value: 0,
            label: this.$t('scheduleView.daily')
          },
          {
            value: 1,
            label: this.$t('scheduleView.weekly')
          },
          {
            value: 2,
            label: this.$t('scheduleView.monthly')
          }
        ],
        monthDays: [],
        showDrap: false,
        showMonthDrap: false,
        showMonthContent: false,
        weekList: [
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.mon'),
            'value': '1',
          },
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.tues'),
            'value': '2',
          },
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.wed'),
            'value': '3',
          },
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.thur'),
            'value': '4',
          },
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.fri'),
            'value': '5',
          },
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.sat'),
            'value': '6',
          },
          {
            'checked': false,
            'disabled': false,
            'name': this.$t('scheduleView.sun'),
            'value': '7',
          },

        ],
        weekValue: this.$t('scheduleView.everyDay'),
        monthValue: this.$t('scheduleView.everyMonth'),
        weekDays:[],
        showWeekContent:false,
        showAddDialog:false,
        showDeleteDialog:false,
        scheduleName: '',
        storeCount: 0,
        serachVale: '',
        scheduleId: -1,
        bindStoreId:[],
        selectTab: '',
        selectWeek: [],
        selectMonth: [],
        enable: false,
        isFirstLoad: true,
        isDisabled: true,
        showBindDialog: false,
        dataModel: [],
        hasBoundStoreIds: [], //已经绑定过周、月模式的门店id
        selectWeekObj:{
          title:'提示',
          showInfo:'请选择周模式下的执行日期！',
          isWarning:false,
          dialogClosed:false
        },
        selectMonthObj:{
          title:'提示',
          showInfo:'请选择月模式下的执行日期！',
          isWarning:false,
          dialogClosed:false
        },
        checkAllWeek: false,
        checkAllMonth: false,
        weeklyTimeArray: [], //自定义时间数组
        selfWeeklyTimeArray:[],
        selectedWeeklyTimeArr: [], //周模式下选择的时间数组
        weeklySchedule: [], //周模式下的执行天数和执行时间
        showAddWeek: false,
        showTimeContent: false,
      }
    },

    methods: {
      generateScheduleLang,
      noWeekDialog(val){
        let self=this;
        self.selectWeekObj.dialogClosed=false;
      },
      cancelNoWeek(val){
        let self=this;
        self.selectWeekObj.dialogClosed=false;
      },
      noMonthDialog(){
        let self=this;
        self.selectMonthObj.dialogClosed=false;
      },
      cancelNoMonth(val){
        let self=this;
        self.selectMonthObj.dialogClosed=false;
      },
      addScheduleButton() {
        let self = this;
        self.showAddDialog = true;
        self.scheduleName = '';
      },
      deleteScheduleButton() {
        let self = this;
        self.showDeleteDialog = true;
      },
      bindScheduleBtn(){
        let self = this;
        let tabIndex = Number(self.activeName);
        let mode = self.paneList[tabIndex].mode;
        // if(mode == 1 && self.selectWeek.length == 0 ){
        //   //周模式
        //   self.selectWeekObj.dialogClosed=true;
        //   return false;
        // }
        // else
          if(mode == 2 && self.selectMonth.length == 0){
          //月模式
          self.selectMonthObj.dialogClosed=true;
          return false;
        }
        else{
          self.showBindDialog = true;
        }
      },
      allWeekChecked(index){
        let self = this;
        console.log(self.checkAllWeek);
        let selectedWeek = [];
        if(index === -1){
          if(self.checkAllWeek){
            self.weekList.forEach(item=>{
              if(!item.disabled){
                item.checked = true;
                selectedWeek.push(item.value)
              }
            })
          }
          else{
            self.weekList.forEach(item=>{
              item.checked = false
            })
          }
          self.weekValue = self.checkAllWeek ? this.$t('scheduleView.everyDay') : '';
          self.selectWeek = self.checkAllWeek ? selectedWeek: [] ;
          console.log(self.weekValue);
          console.log(self.selectWeek)
        }
        else{
          let tabIndex = Number(self.activeName);
          let actPanList = self.paneList[tabIndex];
          let schedule = actPanList.weeklySchedule[index];
          if(self.checkAllWeek){
            self.weekList.forEach(item=>{
              if(!item.disabled){
                item.checked = true;
                selectedWeek.push(item.value)
              }
            })
            schedule.dayArray = selectedWeek;
            schedule.day = schedule.dayArray.toString();
            schedule.dateStr = self.getDateStrByArr(schedule.dayArray);
          }
          else{
            self.weekList.forEach(item=>{
              item.checked = false
            })
          }
        }
      },
      allMonthChecked(val){
        /**
         * 选择所有的日期
         * @type {default.methods}
         */
        let self = this;
        console.log(val);
        let selectedDates = [];
        if(val){
          self.monthList.forEach(item=>{
            item.checked = true;
            selectedDates.push(item.value)
          })
        }
        else{
          self.monthList.forEach(item=>{
            item.checked = false
          })
        }
        self.monthValue = val ? self.$t('scheduleView.everyMonth') : '';
        self.selectMonth = val ? selectedDates: [] ;
        console.log(self.monthValue);
        console.log(self.selectMonth)
      },
      handleClick(val) {
        console.log(val)
        let self = this;
        self.activeName = val.index;
        self.selectTab = val.label;
        let tabIndex = Number(self.activeName);
        self.weekList.forEach(item=>{
          item.checked = false;
        })
        self.monthList.forEach(item=>{
          item.checked = false;
        })
        self.monthValue = '';
        self.weekValue = '';
        self.dayArray =  self.paneList[tabIndex].dayArray;
        self.echoMonthAndWeek();
        self.scheduleId = self.paneList[tabIndex].schId;
        self.showMonthContent = false;
        self.showWeekContent = false;
        self.searchStore();
      },
      echoMonthAndWeek(){
        let self = this;
        let type = self.paneList[Number(self.activeName)].mode;
        let dateStr = '';
        let count = 0;
        // if(type == 1){
        //   let selectedWeek = self.dayArray;
        //   self.selectWeek = selectedWeek;
        //   console.log(selectedWeek + 'selectedWeek');
        //   self.weekList.forEach(item => {
        //     selectedWeek.forEach(_item=>{
        //       if(item.value == _item){
        //         dateStr = dateStr + item.name + ',';
        //         item.checked = true;
        //         count++;
        //       }
        //     })
        //   })
        //   if (dateStr.length != 0) {
        //     self.weekValue = dateStr;
        //     if (count == self.weekList.length) {
        //       self.weekValue = self.$t('scheduleView.everyDay');
        //       self.checkAllWeek = true;
        //     }
        //     else{
        //       self.checkAllWeek = false;
        //     }
        //   }
        // }
        // else
          if(type == 2){
          let selectedMonth = self.dayArray;
          console.log(selectedMonth + 'selectedMonth');
          self.selectMonth = selectedMonth;
          self.monthList.forEach(item => {
            selectedMonth.forEach(_item=>{
              if(item.value == _item){
                dateStr = dateStr + item.value + ',';
                item.checked = true;
                count++;
              }
            })
          })
          if (dateStr.length != 0) {
            self.monthValue = dateStr;
            if (count == self.monthList.length) {
              self.monthValue = self.$t('scheduleView.everyMonth');
              self.checkAllMonth= true;
            }
            else{
              self.checkAllMonth= false;
            }
          }
          else{
            self.monthValue = '';
            self.checkAllMonth= false;
          }
        }
      },

      choiceWeek(index){
        let self = this;
        self.checkAllWeek = false;
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        let schedule = actPanList.weeklySchedule;
        let count = 0;
        if(index == -1){
          self.showWeekContent = true;
          self.checkAllWeek = false;
          self.weekList.forEach(item=>{
            item.checked = false;
            item.disabled = false;
            self.selectWeek.forEach(_item=>{
              if (item.value == _item) {
                item.checked = true;
                count++;
              }
            })
          })
          if (count == self.weekList.length) {
            self.checkAllWeek = true;
          }
          //不能勾选的日期
          let selectedWeek = [];
          schedule.forEach(item=>{
            let dayArr = item.dayArray;
            dayArr.forEach(_item=>{
              selectedWeek.push(_item);
            })
          })
          console.log(selectedWeek);
          selectedWeek.forEach(item=>{
            self.weekList.forEach(_item=>{
              if(item == _item.value){
                _item.disabled = true;
              }
            })
          })

        }
        else{
          schedule[index].showWeekContent = !schedule[index].showWeekContent;
          self.weekList.forEach(item => {
            item.checked = false;
            item.disabled = false;
            schedule[index].day.split(',').forEach(_item=>{
              if (item.value == _item) {
                item.checked = true;
                count++;
              }
            })
          })
          if (count == self.weekList.length) {
            self.checkAllWeek = true;
          }
          //不能勾选的日期
          let selectedWeek = [];
          schedule.forEach((sItem, sIndex)=>{
            let dayArr = sItem.dayArray;
            dayArr.forEach(_item=>{
              if(index != sIndex){
                selectedWeek.push(_item);
              }
            })
          })
          console.log(selectedWeek);
          selectedWeek.forEach(item=>{
            self.weekList.forEach(_item=>{
              if(item == _item.value){
                _item.disabled = true;
              }
            })
          })
        }
      },
      choiceTime(index){
        let self = this;
        console.log(index);
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        self.weeklyTimeArray.forEach(item=>{
          item.checked = false;
        })
        if(index == -1){
          self.showTimeContent = true;
          self.weeklyTimeArray.forEach(item=>{
            item.checked = false;
            self.selectWeek.forEach(_item=>{
              if (item.value == _item) {
                item.checked = true;
              }
            })
          })
        }
        else{
          actPanList.weeklySchedule[index].showTimeContent = !actPanList.weeklySchedule[index].showTimeContent;
          actPanList.weeklySchedule[index].timeArray.forEach(_item=>{
            self.weeklyTimeArray.forEach(item => {
              if (item.value == _item) {
                item.checked = true;
              }
            });
          });
        }
      },
      changeTimeItem(index){
        let self = this;
        let timeValue = '';
        let selectedTime = [];
        if(index == -1){
          self.weeklyTimeArray.forEach(item => {
            if (item.checked) {
              timeValue = timeValue + item.value + ',';
              selectedTime.push(item.value)
            }
          })
          self.timeArray = selectedTime;
          console.log(self.timeArray)
        }
        else{
          let tabIndex = Number(self.activeName);
          let actPanList = self.paneList[tabIndex];
          let schedule = actPanList.weeklySchedule[index];
          let tempTimeArray = [];
          self.weeklyTimeArray.forEach(item => {
            if (item.checked) {
              tempTimeArray.push(item.value)
            }
          })
          schedule.timeArray = tempTimeArray;
        }
      },
      hideTimePanel(){
        let self = this;
        self.showTimeContent = false;
        self.showAddWeek = false;
        if(self.weekValue.length > 0 && self.timeArray.length > 0){
          let json = {};
          json.dayArray = self.selectWeek;
          json.day = json.dayArray.toString();//设置选择的天数
          json.showWeekContent = false; //是否显示面板
          json.showTimeContent = false; //是否显示时间面板
          json.timeArray = self.timeArray;
          json.dateStr = self.getDateStrByArr(json.dayArray)
          console.log(json);
          self.paneList[Number(self.activeName)].weeklySchedule.push(json); //添加时间
          console.log(self.paneList[Number(self.activeName)].weeklySchedule)
          self.selectWeek = [];
          self.weekValue = ''
          self.timeArray = [];
        }
      },
      changeWeekItem(index) {
        let self = this;
        console.log(index);
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        let schedule = actPanList.weeklySchedule[index];
        let dateStr = "";
        let count = 0;
        let selectedWeek = [];
        if(index == -1){
          self.weekList.forEach(item => {
            if (item.checked) {
              dateStr = dateStr + item.name + ',';
              selectedWeek.push(item.value)
              count++;
            }
          })
          self.selectWeek = selectedWeek;
          console.log(self.selectWeek)
          //self.dayArray = self.selectWeek;
          if (dateStr.length != 0) {
            self.weekValue = self.getDateStrByArr(self.selectWeek);
            if (count == self.weekList.length) {
              self.weekValue = self.$t('scheduleView.everyDay');
              self.checkAllWeek = true;
            }
            else{
              self.checkAllWeek = false;
            }
          }
          else{
            self.weekValue = '';
            self.checkAllWeek = false;
          }
        }
        else{
          self.weekList.forEach(item => {
            if (item.checked) {
              dateStr = dateStr + item.value + ',';
              selectedWeek.push(item.value)
              count++;
            }
          })
          schedule.dayArray = selectedWeek;
          schedule.day = schedule.dayArray.toString();
          schedule.dateStr = self.getDateStrByArr(schedule.dayArray);
          if (dateStr.length != 0) {
            self.weekValue = dateStr;
            if (count == self.weekList.length) {
              self.weekValue = self.$t('scheduleView.everyDay');
              self.checkAllWeek = true;
            }
            else{
              self.checkAllWeek = false;
            }
          }
          else{
            self.weekValue = '';
            self.checkAllWeek = false;
          }
        }

      },

      choiceMonth(){
        let self = this;
        self.showMonthContent = !self.showMonthContent;
      },
      changeMonthItem(item){
        let self = this;
        console.log(item);
        let daysStr = "";
        let count = 0;
        let selectedMonths = [];
        self.monthList.forEach(item => {
          if (item.checked) {
            daysStr = daysStr  + item.value + ',';
            selectedMonths.push(item.value);
            count++;
          }
        })
        self.selectMonth = selectedMonths;
        console.log(daysStr);
        console.log(self.selectMonth)
        if (daysStr.length != 0) {
          self.monthValue = daysStr;
          if (count == self.monthList.length) {
            self.monthValue = self.$t('scheduleView.everyMonth');
            self.checkAllMonth = true;
          }
          else{
            self.checkAllMonth = false;
          }
        }
        else {
          self.monthValue = '';
          self.checkAllMonth = false;
        }
      },
      addScheduleService() {
        let params = {};
        let self = this;
        let tabIndex = Number(self.activeName);
        params.name = self.paneList[tabIndex].name;
        params.comment = '点检计划';
        params.category = 2;
        let mode = self.paneList[tabIndex].mode;
        params.mode = mode;
        params.enable = Number(self.paneList[tabIndex].enable);
        params.from = new Date().getTime();
        params.to = -1;
        params.notityTime = 0;
        self.isDisabled = true;
        let tempSchedule = [];
        if(params.mode == 0){
          //日模式
          let tempPeriod = [];
          let timeSelect = self.paneList[tabIndex].timeArray;
          timeSelect.forEach(item=>{
            console.log(item);
            let seconds = self.hourToSecond(item);
            let obj = {};
            obj.from = seconds;
            tempPeriod.push(obj);
          })
          tempSchedule.push({
            "day": 1,
            "period": tempPeriod
          });
        }
        else if(params.mode == 1){
          //周模式
          let schedule = self.paneList[tabIndex].weeklySchedule;
          console.log(schedule);
          schedule.forEach(item=>{
            let timeArray = item.timeArray;
            let selectedWeek = item.dayArray;
            selectedWeek.forEach(_item=>{
              console.log(_item);
              let timePeriod = [];
              let tempSche = {};
              timeArray.forEach(_it=>{
                console.log(_it);
                let seconds = self.hourToSecond(_it);
                let obj = {};
                obj.from = seconds;
                timePeriod.push(obj);
              })
              tempSche.day = Number(_item);
              tempSche.period = timePeriod;
              tempSchedule.push(tempSche)
            })
          })
          console.log(tempSchedule);
        }
        else if(params.mode == 2){
          //月模式
          let timeSelected = self.paneList[tabIndex].timeArray;
          let selectedMonth = self.selectMonth;
          self.paneList[tabIndex].dayArray = self.selectMonth;
          selectedMonth.forEach(item=>{
            console.log(item);
            let timePeriod = [];
            let tempSche = {};
            timeSelected.forEach(_item=>{
              console.log(_item);
              let seconds = self.hourToSecond(_item);
              let obj = {};
              obj.from = seconds;
              timePeriod.push(obj);
            })
            tempSche.day = Number(item);
            tempSche.period = timePeriod;
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
        }
        else{

        }
        params.schedule = tempSchedule;
        return new Promise((resolve, reject) => {
          addNewSchedule(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let errCode = res.errCode;
            let data = res.data.scheduleId;
            console.log(data);
            resolve(data);
          })
        })
      },

      async addSchedule() {
        let self = this;
        if(self.scheduleName == ''){
          self.notify(self.$t('scheduleView.inputName'),'warning',3000);
          self.$refs.scheduleName.focus();
          return false;
        }
        self.showAddDialog = false;
        let scheduleInfo = {
          name: self.scheduleName,
          mode: 0,
          schId: 0,
          dayArray: [],
          timeArray: ['8:00'],
          enable: false,
          to: -1,
          dueDays: 1,
          weeklySchedule: [{dayArray:[], day: '', showWeekContent: false, showTimeContent: false, dateStr: '',timeArray:[]}]
        };
        self.paneList.push(scheduleInfo);
        let pane = self.paneList;
        self.dayArray = [];
        self.curType = 0;
        self.weekValue = this.$t('scheduleView.everyDay'),
        self.monthValue = this.$t('scheduleView.everyMonth'),
        self.activeName = (pane.length -1).toString() ;
        self.selectTab = self.scheduleName;
        self.scheduleId = 0;
        self.isDisabled = false;
        self.searchStore();
        self.weekList.forEach(item=>{
          item.checked = false
        })
        self.monthList.forEach(item=>{
          item.checked = false
        })
        self.monthValue = '';
        self.weekValue = '';
        self.selectWeek = [];
        self.selectMonth = [];
        console.log(self.paneList)

      },
      async searchStoreInput() {
        let self = this;
        let params = {};
        console.log(self.tempStoreList)
        let tempStoreList=self.tempStoreList;
        let getStore2Temp=data=>{
          let cityList=[];
          data.forEach(item=>{
            if(cityList.map(x=>x.city).indexOf(item.city)==-1){
              let obj={
                city:item.city,
                province:item.province
              }
              cityList.push(obj);
            }
          })
          let storeListTemp=[];
          for(let i=0;i<cityList.length;i++){
            let temp=[];
            let obj={};
            for(let j=0;j<data.length;j++){
              if(cityList[i].city==data[j].city){
                let obj={};
                obj.storeId=data[j].storeId;
                obj.name=data[j].name;
                obj.city=data[j].city;
                obj.checked = data[j].checked;
                obj.disabled = data[j].disabled;
                console.log(obj)
                temp.push(obj);
              }
            }
            obj.cityName=cityList[i].city;
            obj.province = cityList[i].province;
            obj.itemData=temp;
            storeListTemp.push(obj);
          }
          return storeListTemp;
        }
        let temp=[];
        let tempArray=[];
        let tempStore=[];
        tempStoreList.forEach((_item,_index)=>{
          _item.itemData.forEach((itemDs,indexDs)=>{
            temp.push(util.getPinyinList(itemDs.name));
            tempStore.push(itemDs);
          })
        })
        for(var i=0;i<temp.length;i++){
          if(temp[i][0].indexOf(self.serachVale.trim())!=-1||
            temp[i][1].indexOf(self.serachVale.trim())!=-1){
            tempArray.push(tempStore[i]);
          }
        }
        self.storeList=getStore2Temp(tempArray);

        let count = 0;
        self.storeList.forEach(item => {
          if (item.checked) {
            count++;
          }
        })
        if (count == self.storeList.length) {
          self.allData = true;
        } else {
          self.allData = false;
        }
      },

      getStoreData(params) {
        let self = this;
        return new Promise((resolve, reject) => {
          getStoreList(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let data = res.data;
            console.log(data);
            resolve(data);
          })
        })
      },
      async getStoreByCity(data) {
        let self = this;
        let bindStoreId=await self.getBindStoreList();
        self.storeCount=bindStoreId.length;
        console.log(data);
        let cityList = [];
        data.forEach(item => {
          if (cityList.indexOf(item.city) == -1) {
            cityList.push(item.city);
          }
        })
        console.log(cityList);
        let temp = [];
        cityList.forEach(item => {
          let obj = {};
          obj.city = item;
          let _temp = [];
          data.forEach(_item => {
            if (item == _item.city) {
              let _obj = {};
              obj.province = _item.province;
              _obj.storeName = _item.name;
              _obj.storeId = _item.storeId;
              _temp.push(_obj);
            }
          })
          obj.store = _temp;
          temp.push(obj);
        })
        console.log(temp);
        let groupTemp = [];
        temp.forEach(item => {
          let groupObj = {};
          groupObj.province = item.province;
          groupObj.cityName = item.city;
          let _temp = [];
          let _tempCount = 0;
          let _tempDisCount = 0;
          item.store.forEach(_item => {
            let _obj = {};
            if (bindStoreId.indexOf(_item.storeId) != -1) {
              _obj.checked = true;
              _obj.disabled = false;
              _tempCount++;
            }
            else {
              // 周月模式下，剩下的商店id 要看有没有绑定周月模式，若绑定，则不可用，
              if(self.hasBoundStoreIds.indexOf(_item.storeId) == -1) {
                _obj.checked = false;
                _obj.disabled = false;
              }
              else{
                _obj.checked = false;
                _obj.disabled = true;
                _tempDisCount++;
              }
            }
            _obj.storeId = _item.storeId;
            _obj.name = _item.storeName;
            _obj.city = item.city;
            _obj.province = item.province;
            _temp.push(_obj);

          })
          if (_tempCount == item.store.length) {
            groupObj.checked = true;
          }
          else {
            groupObj.checked = false;
          }

          if (_tempDisCount + _tempCount == item.store.length) {
            groupObj.checked = true;
          }
          else{
            groupObj.checked = false;
          }
          if (_tempDisCount == item.store.length) {
            groupObj.disabled = true;
            groupObj.checked = false;
          }
          else{
            groupObj.disabled = false;
          }
          groupObj.itemData = _temp;
          groupTemp.push(groupObj);
        })
        self.storeList = groupTemp;
        self.tempStoreList = groupTemp;
        console.log(self.storeList)
        console.log(self.tempStoreList)
        let count = 0;
        self.storeList.forEach(item => {
          if (item.checked) {
            count++;
          }
        })
        let disCount = 0; //禁用数目
        self.storeList.forEach(item => {
          if (item.disabled) {
            disCount++;
          }
        })
        if (count == self.storeList.length) {
          self.allData = true;
        }
        else {
          self.allData = false;
        }
        if(count + disCount == self.storeList.length){
          self.allData = true;
        }
        if (disCount == self.storeList.length) {
          self.allDisabled = true;
        }
        else {
          self.allDisabled = false;
        }
        let totalConut = disCount + count; //禁用加勾选数目
        if(totalConut == self.storeList.length){
          if(count> 0 ){
            self.allDisabled = false;
            self.allData = true;
          }else{
            self.allDisabled = true;
            self.allData = false;
          }
        }
      },
      getBindStoreList() {
        let self = this;
        let scheduleId = self.scheduleId;
        console.log(scheduleId)
        let params = {}
        params.scheduleId = scheduleId;
        if(params.scheduleId == 0){
          return [];
        }
        else if(params.scheduleId == -1){
          console.log(self.paneList);
          params.scheduleId = self.paneList[0].schId;
        }
        return new Promise((resolve, reject) => {
          getScheduleBindList(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let data = res.data;
            console.log(data);
            resolve(data);
          })
        })
      },

      addTime() {
        let self = this;
        self.showAddTime = true;
        console.log(self.showAddTime);
      },
      addWeekDays(index){
        let self = this;
        self.showAddWeek = true;
        self.weekValue = ''
        // if(index != -1){
        //   self.showAddWeek = true;
        //   self.weekValue = '';
        // }
        // else{
        //   self.showAddWeek = true;
        // }

      },
      deleteWeekDays(index){
        console.log(index)
        let self = this;
        if(index == -1){
          self.showAddWeek = false;
        }
        else{
          self.paneList[Number(self.activeName)].weeklySchedule.splice(index, 1); //删除时间
          console.log(self.paneList[Number(self.activeName)].weeklySchedule);
        }
      },
      bindScheduleToStore(params){
        return new Promise((resolve,reject)=>{
          bindScheduleAndStore(params).then(res=>{
            resolve(res);
          })
        })
      },
      unbindScheToStore(params){
        return new Promise((resolve,reject)=>{
          unbindScheduleAndStore(params).then(res=>{
            resolve(res);
          })
        })
      },

      async bindSchedule() {
        //门店绑定排程
        let scheId;
        let self = this;
        self.showBindDialog = false;
        let isAdd = false;
        //如果是新增排程，则先调用新增排程服务，获得返回的scheduleId
        if(self.selectTab == self.scheduleName){
          isAdd = true;
          scheId = await self.addScheduleService();
          self.paneList[Number(self.activeName)].schId = scheId;
          self.scheduleId = scheId;
          self.scheduleName = '';
        }
        else{
          scheId = self.scheduleId;
        }
        let storeIdChecked=[];
        let storeIdUnchecked=[];
        let count=0;
        self.storeList.forEach(item=>{
          count+=item.itemData.length;
          item.itemData.forEach(_item=>{
            if(_item.checked){
              storeIdChecked.push(_item.storeId);
            }
            else{
              storeIdUnchecked.push(_item.storeId);
            }
          })
        })

        let tempchecked=[];
        let obj={
          scheduleId:scheId,
          storeIds: storeIdChecked,
        };
        tempchecked.push(obj);
        console.log(tempchecked)
        let paramsBind={
          items:tempchecked
        };
        console.log(paramsBind)

        let tempUnchecked=[];
        let unbindobj={
          scheduleId: scheId,
          storeIds: storeIdUnchecked,
        };
        tempUnchecked.push(unbindobj);

        let paramsUnBind={
          items:tempUnchecked
        };
        console.log(paramsUnBind)
        let flag=false;
        if(storeIdChecked.length==count){  //全部勾选，只有绑定操作
          let resBind=await self.bindScheduleToStore(paramsBind);
          console.log(resBind);
          if(resBind.errMsg=='Success'&&resBind.errCode=='0'){
            flag=true;
          }
        }
        else if(storeIdUnchecked.length==count){ //全部取消勾选，只有解绑操作
          let resUnBind=await self.unbindScheToStore(paramsUnBind);
          console.log(resUnBind);
          if(resUnBind.errMsg=='Success'&&resUnBind.errCode=='0'){
            flag=true;
          }
        }
        else{
          let resBind=await self.bindScheduleToStore(paramsBind);
          let resUnBind=await self.unbindScheToStore(paramsUnBind);
          if(resBind.errMsg=='Success'&&resUnBind.errMsg=='Success'){
            flag=true;
          }
        }
        if(flag){
          let bindIdList=await self.getBindStoreList();
          self.storeCount = bindIdList.length;
          //self.notify(`门店绑定修改成功，巡检表绑定${bindIdList.length}家门店！`,'success',3000);
          self.notify(`${this.$t('insSettingView.editSuss')} ${bindIdList.length} ${this.$t('insSettingView.storesBound')}`,'success',3000);
        }
        else{
          self.notify(this.$t('insSettingView.bindFail'),'warning',3000);
          return false;
        }

        if(!isAdd){
          self.updateScheduleInfo();
        }
        self.dayArray = this.paneList[Number(self.activeName)].dayArray;
        console.log(self.dayArray)
        self.getHasBoundStroeIds();
      },
      deleteCurTime(index) {
        console.log(index)
        let self = this;
        if(index == -1){
          self.showAddTime = false;
        }
        else{
          self.paneList[Number(self.activeName)].timeArray.splice(index, 1); //删除时间
        }
      },
      changTime() {
        let self = this;
        self.showAddTime = false;
        let timeArray = self.paneList[Number(self.activeName)].timeArray;
        if(timeArray.indexOf(self.newTime) == -1){
          timeArray.push(self.newTime);
        }
        else{
          self.notify('执行时间已存在，请重新添加','warning',3000);
        }
        console.log(self.paneList[Number(self.activeName)].timeArray)
      },

      async searchStore() {
        let self = this;
        self.showCityContent = false;
        self.serachVale = '';
        let params = {};
        params = {
          filter: {
            page: 0,
            size: 1000
          }
        }

        let resData = await self.getStoreData(params);
        let data = resData.content;
        console.log(data)
        self.getStoreByCity(data);

        let count = 0;
        self.storeList.forEach(item => {
          if (item.checked) {
            count++;
          }
        })
        if (count == self.storeList.length) {
          self.allData = true;
        }
        else {
          self.allData = false;
        }
      },
      choiceAll(val){
        let self=this;
        self.storeList.forEach(item=>{
          if(!item.disabled){
            item.checked=val;
            item.itemData.forEach(_item=>{
              if(!_item.disabled){
                _item.checked=val;
              }
            })
          }
        })
      },
      choiceAllGroup(item){
        let self=this;
        console.log(item);
        let obj=item;
        item.itemData.forEach(item=>{
          if(!item.disabled){
            item.checked=obj.checked;
          }
          //item.checked=obj.checked;
        })
        let arr=[];
        self.storeList.forEach(_item=>{
          if(_item.checked){
            arr.push(_item);
          }
        })
        let disArr=[];
        self.storeList.forEach(_item=>{
          if(_item.disabled){
            disArr.push(_item);
          }
        })
        if(self.storeList.length==arr.length + disArr.length){
          self.allData=true;
        }
        else{
          self.allData=false;
        }
      },
      choiceAllDevice(index,item){
        let self=this;
        console.log(index);
        let count=0;
        item.itemData.forEach(itemS=>{
          if(itemS.checked){
            count++;
          }
        })
        let disCount = 0;
        item.itemData.forEach(itemS=>{
          if(itemS.disabled){
            disCount++;
          }
        })
        if(count + disCount==item.itemData.length){
          item.checked=true;
        }
        else{
          item.checked=false;
        }
        if(disCount == item.itemData.length){
          item.disabled = true;
        }
        else{
          item.disabled = false;
        }
        let length=0, countItem=0;
        self.storeList.forEach(_item=>{
          length+=_item.itemData.length;
          _item.itemData.forEach(itemS=>{
            if(itemS.checked){
              countItem++;
            }
          })
        })
        if(length==countItem){
          self.allData=true;
        }
        else{
          self.allData=false;
        }
      },
      getScheduleFromDB(params){
        return new Promise((resolve, reject) => {
          getScheduleListService(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let data = res.data;
            console.log(data);
            resolve(data);
          })
        })
      },
      async getScheduleList(){
        //get point check schedule List
        let self = this;
        self.paneList = [];
        let params = {};
        params.category = 2; //point check schedule
        let data = await self.getScheduleFromDB(params)
        if(data.length!=0){
          data.forEach(item=>{
            let name = item.name; //排程名称
            if(self.scheduleList.indexOf(name)==-1){
              self.scheduleList.push(name);
            }
          })
          let tempAllData=[];
          data.forEach(_item => {
            let tempScheduleData = {};
            tempScheduleData.name = _item.name;
            tempScheduleData.mode = _item.mode;
            tempScheduleData.schId = _item.id; //排程id
            tempScheduleData.scheduleInfo = _item;
            tempScheduleData.enable = Boolean(_item.enable);
            let tempSchedules = _item.schedule;
            console.log(tempSchedules)
            let mode = _item.mode; // 0 daily, 1 weekly, 2 monthly
            let dayArray = []; //存放1，2两种类型选中的时间
            let timeArray = []; //存放3种类型的执行时间
            let weeklyScheduleArray = []; //存放周模式下的执行天数和时间
            tempSchedules.forEach(sche=>{
              console.log(sche)
              let day = sche.day;
              dayArray.push(day)
              let tempWeeklySchedule = {};
              tempWeeklySchedule.day = day;
              let tempWeeklyTimeArr = [];
              let period = sche.period.sort(self.getSortFun('from'));
              period.forEach(periods=>{
                let from = periods.from;
                let hours = self.secondsToHour(from);
                tempWeeklyTimeArr.push(hours);
                if(timeArray.indexOf(hours) == -1){
                  timeArray.push(self.secondsToHour(from));
                }
                else{

                }
              })
              tempWeeklySchedule.timeArray = tempWeeklyTimeArr;
              weeklyScheduleArray.push(tempWeeklySchedule);
              console.log(tempWeeklySchedule);
            })
            let weeklySchedule = self.transformArray(weeklyScheduleArray);
            console.log(weeklySchedule);
            console.log(timeArray);
            console.log(dayArray);
            tempScheduleData.timeArray = timeArray;
            tempScheduleData.weeklySchedule = weeklySchedule;
            tempScheduleData.dayArray = dayArray;
            self.paneList.push(tempScheduleData);
          })
          //self.paneList.push(tempScheduleData);

          if(self.isFirstLoad == true){
            self.selectTab  = self.paneList[0].name;
            self.scheduleId =  self.paneList[0].schId;
            //获取所有排程绑定的所有门店
            self.isFirstLoad = false;
            self.dayArray = this.paneList[0].dayArray;
            console.log(self.dayArray)
            self.echoMonthAndWeek() //回显初次加载时选择的月和周
            self.searchStore();
          }
          //self.timeArray = self.paneList[0].timeArray
          console.log(self.paneList);
          self.getHasBoundStroeIds();

        }
        else if(data.length == 0){
          console.log(self.paneList)
          let scheduleInfo = {
            name: "点检计划一",
            mode: 0,
            schId: 0,
            dayArray: [],
            timeArray: ['8:00'],
            enable: false,
            to: -1,
            dueDays: 1,
          };
          self.paneList.push(scheduleInfo);
          self.scheduleName = "点检计划一";
          self.selectTab = "点检计划一";
          self.scheduleId = 0;
          self.isDisabled = false;
          self.searchStore();
        }
      },
      getSortFun(sortBy) {
        let ordAlpah =  '>' ;
        let sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
        return sortFun;
      },
      transformArray(json){
        let self = this;
        const map = {};
        for(const o of json){
          if(!map.hasOwnProperty(JSON.stringify(o.timeArray))){
            map[JSON.stringify(o.timeArray)] = o;
            const val = map[JSON.stringify(o.timeArray)].day;
            map[JSON.stringify(o.timeArray)].dayArray = [val];
          }else{
            map[JSON.stringify(o.timeArray)].dayArray.push(o.day);
          }
        }
        var arr = [];
        for(var item in map){
          arr.push(map[item]);
        }
        console.log(arr);
        arr.forEach(item=>{
          item.dayArray.sort();
          item.day = item.dayArray.toString();//设置选择的天数
          item.dateStr = self.getDateStrByArr(item.dayArray); //设置选择的日期
          item.showWeekContent = false; //是否显示面板
          item.showTimeContent = false; //是否显示时间面板
        })
        return arr;
    },
  getHasBoundStroeIds(){
        let self = this;
        self.hasBoundStoreIds = [];
        self.paneList.forEach(item=>{
          let sheduleId = item.schId;
          let mode = item.mode;
          console.log(sheduleId + '....' + mode)
          //获取绑定周、月模式商店的id
          if (mode !== 3) {
            let params = {};
            params.scheduleId = sheduleId;
            return new Promise((resolve, reject) => {
              getScheduleBindList(params).then(res => {
                console.log(res);
                let errMsg = res.errMsg;
                let data = res.data;
                console.log(data);
                data.forEach(_item=>{
                  if(self.hasBoundStoreIds.indexOf(_item) == -1){
                    self.hasBoundStoreIds.push(_item);
                  }
                  else{
                    // do nothing
                  }
                })
                resolve(data);
              })
            })
          }
        })
        console.log(self.hasBoundStoreIds)
      },
      secondsToHour(second){
        //秒数转化为时分秒
        console.log(second)
        let changedData = [parseInt(second / 60 / 60), second / 60 % 60].join(":")
          .replace(/\b(\d)\b/g, "0$1");
        console.log(changedData)
        return changedData;
      },
      hourToSecond(hourStr){
        // 时间字符串转化为距离零点的秒数
        console.log(hourStr);
        let hourArray = hourStr.split(':');
        let changedSec = Number(hourArray[0]) * 3600 + Number(hourArray[1]) * 60;
        console.log(changedSec);
        return changedSec;
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },
      updateScheduleInfo(){
        let params = {};
        let self = this;
        let tabIndex = Number(self.activeName);
        params.id = self.paneList[tabIndex].schId;
        params.name = self.paneList[tabIndex].name;
        params.comment = '点检计划';
        let mode = self.paneList[tabIndex].mode
        // params.category = 1;
        // params.mode = 0;
        params.enable = Number(self.paneList[tabIndex].enable);
        params.from = new Date().getTime();
        params.to =  -1;
        params.notityTime = 0;
        let tempSchedule = [];
        //日模式
        if(mode == 0){
          //日模式
          let tempPeriod = [];
          let timeSelect = self.paneList[tabIndex].timeArray;
          timeSelect.forEach(item=>{
            console.log(item);
            let seconds = self.hourToSecond(item);
            let obj = {};
            obj.from = seconds;
            tempPeriod.push(obj);
          })
          tempSchedule.push({
            "day": 1,
            "period": tempPeriod
          });
        }
        else if(mode == 1){
          //周模式
          let schedule = self.paneList[tabIndex].weeklySchedule;
          console.log(schedule);
          schedule.forEach(item=>{
            let timeArray = item.timeArray;
            let selectedWeek = item.dayArray;
            selectedWeek.forEach(_item=>{
              console.log(_item);
              let timePeriod = [];
              let tempSche = {};
              timeArray.forEach(_it=>{
                console.log(_it);
                let seconds = self.hourToSecond(_it);
                let obj = {};
                obj.from = seconds;
                timePeriod.push(obj);
              })
              tempSche.day = Number(_item);
              tempSche.period = timePeriod;
              tempSchedule.push(tempSche)
            })
          })
          console.log(tempSchedule);
        }
        else if(mode == 2){
          //月模式
          let timeSelected = self.paneList[tabIndex].timeArray;
          let selectedMonth = self.selectMonth;
          self.paneList[tabIndex].dayArray = self.selectMonth;
          selectedMonth.forEach(item=>{
            console.log(item);
            let timePeriod = [];
            let tempSche = {};
            timeSelected.forEach(_item=>{
              console.log(_item);
              let seconds = self.hourToSecond(_item);
              let obj = {};
              obj.from = seconds;
              timePeriod.push(obj);
            })
            tempSche.day = Number(item);
            tempSche.period = timePeriod;
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
        }
        else{

        }
        params.schedule = tempSchedule;
        console.log(params.schedule);
        return new Promise((resolve, reject) => {
          updateSchedule(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let data = res.errCode;
            console.log(data);
            resolve(data);
          })
        })

      },
      deleteSchedule(){
        let self = this;
        self.showDeleteDialog = false;
        if(self.scheduleId == 0){
          //还没有新增排程
          self.initData();
        }
        else{
          let scheduleIds = [];
          scheduleIds.push(self.scheduleId);
          let params = {};
          params.scheduleIds = scheduleIds;
          console.log(params.scheduleIds);
          return new Promise((resolve, reject) => {
            deleteScheduleService(params).then(res => {
              console.log(res);
              let errMsg = res.errMsg;
              let data = res.errCode;
              console.log(data);
              if(data == 0){
                self.notify(self.$t('scheduleView.deleteSuss'),'warning',3000);
              }
              else{
                self.notify(self.$t('scheduleView.deleteFail'),'warning',3000);
              }
              //刷新页面
              self.initData();
              resolve(data);
            })
          })
        }
      },
      initData(){
        let self = this;
        self.paneList.splice(Number(self.activeName), 1);
        self.activeName = '0'
        self.scheduleId = self.paneList[0].schId;
        // self.curType = (self.paneList[0].mode).toString();
        // console.log(typeof(self.curType))
        //self.timeArray = self.paneList[0].timeArray;
        self.dayArray =  self.paneList[0].dayArray;
        self.echoMonthAndWeek();
        self.scheduleId = self.paneList[0].schId;
        //self.enable = self.paneList[0].enable;
        console.log(self.scheduleId)
        self.getHasBoundStroeIds()
      },
      hiddenMonthPanel(){
        let self = this;
        self.showMonthContent = false
      },
      getSelectTimeArray(){
        let self = this;
        let date = self.$moment().format('YYYY-MM-DD');
        console.log(date)
        let startIime = self.$moment(date + ' 08:00:00').valueOf();
        let endTime = self.$moment(date + ' 23:45:00').valueOf();
        let timeArray = [];
        timeArray.push(self.$moment(startIime).format('HH:mm'));
        while(startIime < endTime){
          startIime += 15*60*1000; //每隔15分钟，生成时间间隔
          timeArray.push(self.$moment(startIime).format('HH:mm'));
        }
        timeArray.forEach(item=>{
          let timeJson = {};
          timeJson.value = item;
          timeJson.name = item;
          timeJson.checked = false;
          self.weeklyTimeArray.push(timeJson);
        })
        console.log(self.weeklyTimeArray)
      },
      getDateStrByArr(arr){
        let self = this;
        let dateStr = '';
        self.weekList.forEach(item=>{
          arr.forEach(_item=>{
            if(item.value == _item){
              dateStr += item.name + ','
            }
          })
        })
        if(dateStr == '周六,周日,'){
          dateStr = '周末';
        }
        else if(dateStr == '周一,周二,周三,周四,周五,'){
          dateStr = '工作日';
        }
        else if(dateStr == '周一,周二,周三,周四,周五,周六,周日,'){
          dateStr = '每天';
        }
        else{

        }
        return dateStr;
      }
    },
    mounted(){
      let self = this;
      self.getSelectTimeArray();
      self.getScheduleList();
      //self.hiddenPanel();
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

  .dialog-content{
    width: 100%;
    span{
      font-size: 14px;
      margin-right: 20px;
    }
    .el-schedule-name{
      @include point(width,200);
      @include point(margin-right,20);
      right: 0px;
    }
    .el-schedule-name /deep/ .el-input__inner{
      border-radius: 30px;
    }
  }
  .el-schedule-container{
    margin: 20px 15px 15px 15px;
    height: calc(180 / 1920 * 100vw);

    .el-schedule-header {
      @include point(margin-top, 10);

      .el-schedule-tabs {
        width: 98%;
        @include point(margin-left,10);
        .header-details{
          text-align: left;
          height: calc(58 / 1920 * 100vw);
          line-height: calc(50 / 1920 * 100vw);
          position: relative;
          span {
            font-size: calc(14 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
            margin-left: calc(20 / 1920 * 100vw);
          }
          #en-span{
            font-size: calc(14 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
            margin-left: calc(20 / 1920 * 100vw);
            width: 100px;
            display: inline-block;
          }
          .search-content {
            display: inline-block;
          }
          .el-type{
            width: 200px;
            /deep/ .el-input__inner{
              height: 28px !important;
            }
          }
          .time-select{
            width: 200px;
          }
          .date-range{
            width:200px;
          }
          .day-detail{
            display: inline-block;
            height: 50px;
            font-size: 14px;
            position: relative;

            /*span {
              margin-right: 12px;
            }*/
          }
          .day-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            #elWeek{
              width: 200px;
              border-radius: 0px;
              background-color: #f0f5f8;
            }
            .el-input{
              width: 200px;
            }
            .input-arrow-panel{
              width: 200px;
              height: 28px;
              position: absolute;
              background-color: transparent;
              cursor: pointer;
              z-index: 100;
              top: 18px;
            }
            .icon-input{
              position: relative;
              right: 25px;
              top: 1px;
            }
          }
          .month-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            #elMonth{
              width: 200px;
              border-radius: 0px;
              background-color: #f0f5f8;
            }
            .el-input{
              width: 200px;
              /deep/ .el-input__inner{
                padding-right: 20px;
              }
            }
            .input-arrow-panel{
              width: 200px;
              height: 28px;
              position: absolute;
              background-color: transparent;
              cursor: pointer;
              z-index: 100;
              top: 18px;
            }
            .icon-input{
              position: relative;
              right: 25px;
              top: 1px;
            }
          }
          .month-panel{
            position: absolute;
            margin-top: 3px;
            right: 17px;
            width: 188px;
            height: 150px;
            z-index: 980;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 5px;
            overflow: auto;
            .month-details{
              padding: 2px 10px;
              @include point(height,24);
              span{
                margin-left: 10px;
                font-size: 14px;
              }
              .el-checkbox{
                margin-right: 0;
              }
            }
          }
          .week-panel{
            position: absolute;
            margin-top: 3px;
            right: 17px;
            width: 188px;
            height: 150px;
            z-index: 980;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 5px;
            overflow: auto;
            .week-details{
              padding: 2px 10px;
              @include point(height,24);
              span{
                margin-left: 10px;
                font-size: 14px;
              }
              .el-checkbox{
                margin-right: 0;
              }
            }
          }



          @media screen and(max-width: 1366px) {
            .en-span-class {
              margin-right: 60px;
            }
          }
          @media screen and(min-width: 1366px){
            .en-span-class{
              margin-right: 75px;
            }
          }
          .el-week{
            width: calc(180/1920*100vw);
            margin-right: calc(15/1920*100vw);
          }
          .select-store{
            min-width: 160px;
          }
          .search-input{
            width: calc(150/1920*100vw);
          }
          .search-btn{
            width: calc(120/1920*100vw);
            margin-left: calc(20/1920*100vw);
          }
          .en-search-btn{
            width: calc(120/1920*100vw);
            margin-left: calc(20/1920*100vw);
          }
          // .storename-str{
          //     width: 100%;
          //     white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
          //     overflow: hidden; //隐藏超出单元格的部分。
          //     text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
          // }
        }
        .el-search-input{
          @include point(width,200);
          @include point(margin-right,20);
          position:absolute;
          right: 0px;
          top: 3px;
        }
        .el-search-input /deep/ .el-input__inner{
          border-radius: 30px;
        }
      }

      .el-bind-content {
        @include point(max-height, 450);
        overflow: auto;
        background-color: #F6F7FB;
        border: 0.5px solid #e3e9f4;
        color: $black;

        .el-all-checkbox {
          margin: 20px auto 20px 15px;
          @include point(margin-left, 15);
          float: left;
          .all-device-title {
            @include point(margin-left, 0);
            font-size: 14px;
          }
        }

        .device-group {
          width: 100%;
          clear: both;
          @include point(margin-top, 40);
          @include point(margin-bottom, 20);

          .device-all-checkbox {
            @include point(margin-left, 15);

            .group-name {
              @include point(margin-left, 0);
              font-size: 14px;
              font-weight: bold;
            }
          }
          .device-content{
            @include point(margin-left,40);
            overflow: hidden;
            .device-detail{
              width: auto;
              @include point(min-width,160);
              @include point(margin-left,10);
              @include point(margin-top,10);
              float: left;
              .device-name{
                @include point(margin-left, 0);
                font-size: 14px;
              }
            }
          }
        }
      }
      .el-bind-footer{
        @include point(height,50);
        @include point(line-height,50);
        @include point(margin-bottom,25);
        position: relative;
        .el-btn-content{
          @include point(margin-left,25);
          position: absolute;
          @include point(margin-top,15);
          @include point(margin-bottom,15);
          .btn{
            @include point(width,90);
            min-width: 160px;
            background-color: #f31d65;
            color: #fff;
          }
        }
      }
      .bind-title{

      };
      .el-header-title{
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
      .choice-device{
        @include point(margin-right,30);
        font-size: 12px;
        color: $tab;
        display: inline;
        position: absolute;
        @include point(right, 220);
        @include point(margin-top, 10);
      }
      .el-schedule-btns{
        position: absolute;
        @include point(right,30);
        z-index: 10;
        width: auto;
        @include point(top,5);
        .el-add-btn{
          background-color: $mainColor;
          color: #fff;
          border-color: $mainColor;
          position: relative;
          @include point(margin-right,15);
          // @include point(width, 98);
          font-size: 12px;
          &:disabled{
            opacity: 0.6;
          }
          @media screen and (min-width: 1680px){
            @include point(width, 98);
          }
          @media screen and (max-width: 1680px){
            width: 120px;
          }
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
        .el-delete-btn {
          background-color: $mainColor;
          color: #fff;
          border-color: $mainColor;
          position: relative;
          @include point(margin-right, 15);
          // @include point(width, 98);
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
        .en-el-bind-btn{
          background-color: $mainColor;
          color: #fff;
          border-color: $mainColor;
          position: relative;
          @include point(margin-right,15);
          font-size: 12px;
          width:120px;
          &:disabled{
            opacity: 0.6;
          }
          @media screen and (min-width: 1366px){
            @include point(width, 90);
            span{
              position: relative;
              @include point(bottom,1);
            }
          }
          @media screen and (max-width: 1366px){
            span{
              position: relative;
              @include point(bottom, 2)
            }
          }

        }

        .downLoad-btn{
          margin-left: 0px !important;
          border-color: $mainColor !important;
          color: $mainColor !important;
          border-radius: 0px;
          padding: 2px 5px !important;

          position: relative;
          top: 3px;
          display: inline-block;
          text-decoration: none;
          font-size: 12px;
          border: 1px solid;
          border-left-width: 0px;
          @include point(right,5);
          cursor: pointer;
          &:hover{
            background-color: #FEE4E7;
          }
          &:focus{
            background-color: #FEE4E7;
          }
          span{
            position: relative;
            bottom: 3px;
          }
        }
        .el-handle-btn{
          margin-left: 0px !important;
          border-color: $mainColor !important;
          color: $mainColor !important;
          border-radius: 0px;
          padding: 3px 5px !important;
          position: relative;
          top: 3px;
          border-right: 0;
          span{
            position: relative;
            @include point(bottom,3);
          }
          &:last-child{
            border-right: 1px solid;
          }

          &:hover{
            background-color: #FEE4E7;
          }
          &:focus{
            background-color: #FEE4E7;
          }
        }
        .en-el-handle-btn{
          margin-left: 0px !important;
          border-color: $mainColor !important;
          color: $mainColor !important;
          border-radius: 0px;
          padding: 3px 5px !important;
          position: relative;
          top: 3px;
          border-right: 0;
          @media screen and (min-width: 1366px){
            @include point(width, 90);
            span{
              position: relative;
              @include point(bottom,3);
            }
          }
          @media screen and (max-width: 1366px){
            @include point(width, 120);
            span{
              position: relative;
              @include point(bottom,5);
            }
          }

          &:last-child{
            border-right: 1px solid;
          }

          &:hover{
            background-color: #FEE4E7;
          }
          &:focus{
            background-color: #FEE4E7;
          }
        }
      }
    }
    .time-btn{
      background-color: $red;
      color: #fff;
      font-size: 12px;
      width: 14px;
      /deep/ span{
        margin-left: -5px;
      }
      .el-icon-plus{
        font-size:12px;
      }
    }
    .delete-time-btn{
      padding: 1px 6px;
      cursor: pointer;
      border-left: 0;
      height: 22px;
      line-height: 22px;
      color: #e3e9f4;
      font-size: 12px;
      .el-icon-plus{
        font-size:12px;
      }
    }

    #patrltabs-content /deep/ .el-tabs__nav-scroll{
      height: 40px;
    }
    #patrltabs-content /deep/ .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;

    }
    #patrltabs-content /deep/ .is-active {
      border-bottom: 4px solid #f31d65;
    }

    #patrltabs-content /deep/ .el-tabs__active-bar{
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
