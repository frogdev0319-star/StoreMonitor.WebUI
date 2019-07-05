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
            <el-input v-model="scheduleName" clearable  :placeholder="generateScheduleLang('inputPlaceholder')" size="mini"
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
        <el-tabs v-model="activeName" @tab-click="handleClick" :id="lang=='en'? 'en-patrltabs-content': ''">
          <el-tab-pane v-for="(paneItem,index) in paneList" :name="index.toString()"
                       :key="index" :label="`${paneItem.name}`">
            <div :style="{height:varyWindowHeight}">
              <el-col :span="24" class="header-details">
                <span>{{generateScheduleLang('scheduleType')}}</span>
                <el-select v-model="paneItem.mode" clearable  placeholder="选择类型" size="mini" :disabled="isDisabled" @change="searchStore"
                           class="el-type" >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                <div class="day-detail" v-if="paneItem.mode == 1">
                  <span class="day-title">{{generateScheduleLang('selectOnDay')}}</span>
                  <div class="day-content" @click="choiceWeek">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="weekValue" size="mini" id="elWeek" :placeholder="generateScheduleLang('everyDay')" :readonly=true></el-input>
                    <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="week-panel" v-if="showWeekContent">
                    <div class="week-details" v-for="(item,index) in weekList" :key="index">
                      <el-checkbox v-model="item.checked" @change="changeWeekItem(item)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
                <div  class="day-detail" v-if="paneItem.mode == 2">
                  <span>{{generateScheduleLang('execDays')}}</span>
                  <div class="month-content" @click="choiceMonth">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="monthValue" size="mini" id="elMonth" :placeholder="generateScheduleLang('everyMonth')" :readonly=true></el-input>
                    <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="month-panel" v-if="showMonthContent">
                    <div class="month-details" v-for="(item,index) in monthList" :key="index">
                      <el-checkbox v-model="item.checked" @change="changeMonthItem(item)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="24" class="header-details" v-if="timeItem.length > 0" v-for="(timeItem, timeIndex) in paneItem.timeArray"
                      :key="timeIndex">
                <span :style="timeIndex==0 ? 'visibility: visable' :'visibility: hidden'">{{generateScheduleLang('exectionTime')}}</span>
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
              <el-col v-if="showAddTime" :span="24" class="header-details">
                <span style="visibility: hidden;">{{generateScheduleLang('exectionTime')}}</span>
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
                <span class="delete-time-btn" size="mini" @click="deleteCurTime" style="margin: 0 20px 0 30px"><i class="el-icon-error" ></i></span>
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
      </el-col>
    </div>
  </el-row>
</template>

<script>

  import {generateScheduleLang} from '@/api/i18n'
  import {getScheduleBindList, addNewSchedule, getScheduleListService, bindScheduleAndStore, unbindScheduleAndStore, updateSchedule,deleteScheduleService} from '@/api/schedule'
  import {getStoreList} from '@/api/store'

  export default {
    name: "PointCheckSch",
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
        timeArray: ['08:00'], //选中的执行时间
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
            'name': this.$t('scheduleView.mon'),
            'value': '1',
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.tues'),
            'value': '2',
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.wed'),
            'value': '3',
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.thur'),
            'value': '4',
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.fri'),
            'value': '5',
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.sat'),
            'value': '6',
          },
          {
            'checked': false,
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
        hasBoundStoreIds: [] //已经绑定过周、月模式的门店id
      }
    },

    methods: {
      generateScheduleLang,
      addScheduleButton() {
        self = this;
        self.showAddDialog = true;
      },
      deleteScheduleButton() {
        self = this;
        self.showDeleteDialog = true;
      },
      bindScheduleBtn(){
        self = this;
        self.showBindDialog = true;
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
        // self.curType = (self.paneList[tabIndex].mode).toString();
        // self.timeArray = self.paneList[tabIndex].timeArray;
        self.dayArray =  self.paneList[tabIndex].dayArray;
        self.echoMonthAndWeek();
        self.scheduleId = self.paneList[tabIndex].schId;

        self.searchStore();
      },
      echoMonthAndWeek(){
        let self = this;
        let type = self.paneList[Number(self.activeName)].mode;
        let dateStr = '';
        let count = 0;
        if(type == 1){
          let selectedWeek = self.dayArray;
          self.selectWeek = selectedWeek;
          console.log(selectedWeek + 'selectedWeek');
          self.weekList.forEach(item => {
            selectedWeek.forEach(_item=>{
              if(item.value == _item){
                dateStr = dateStr + item.name + ',';
                item.checked = true;
                count++;
              }
            })
          })
          if (dateStr.length != 0) {
            self.weekValue = dateStr;
            if (count == self.weekList.length) {
              self.weekValue = this.$t('scheduleView.everyDay');
            }
          }
        }
        else if(type == 2){
          let selectedMonth = self.dayArray;
          console.log(selectedMonth + 'selectedMonth');
          self.selectMonth = selectedMonth;
          self.monthList.forEach(item => {
            selectedMonth.forEach(_item=>{
              if(item.value == _item){
                dateStr = dateStr + item.name + ',';
                item.checked = true;
                count++;
              }
            })
          })
          if (dateStr.length != 0) {
            self.monthValue = dateStr;
            if (count == self.weekList.length) {
              self.monthValue = this.$t('scheduleView.everyMonth');
            }
          }
        }
      },
      choiceWeek() {
        let self = this;
        self.showWeekContent = !self.showWeekContent;
      },
      changeWeekItem(item) {
        let self = this;
        console.log(item);
        let dateStr = "";
        let count = 0;
        let selectedWeek = [];
        self.weekList.forEach(item => {
          if (item.checked) {
            dateStr = dateStr + item.name + ',';
            selectedWeek.push(item.value)
            count++;
          }
        })
        self.selectWeek = selectedWeek;
        console.log(dateStr);
        console.log(self.selectWeek)
        if (dateStr.length != 0) {
          self.weekValue = dateStr;
          if (count == self.weekList.length) {
            self.weekValue = this.$t('scheduleView.everyDay');
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
            daysStr = daysStr  + item.name + ',';
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
            self.monthValue = '全月';
          }
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
          let timeSelected = self.paneList[tabIndex].timeArray;
          let selectedWeek = self.selectWeek;
          self.paneList[tabIndex].dayArray = self.selectWeek;
          selectedWeek.forEach(item=>{
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
        console.log(self.paneList)

      },
      async searchStoreInput() {
        let self = this;
        let params = {};
        if (self.serachVale.length != 0) {
          params = {
            like: {
              "name": self.serachVale,
              "userName": self.serachVale
            },
            filter: {
              page: 0,
              size: 1000
            }
          };
        }
        else {
          params = {
            filter: {
              page: 0,
              size: 1000
            }
          }
        }
        let resData = await self.getStoreData(params);
        let data = resData.content;
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
              // _obj.checked = true;
              // _obj.disable = false;
              // _tempCount++;
            }
            _obj.storeId = _item.storeId;
            _obj.name = _item.storeName;
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
        self.paneList[Number(self.activeName)].timeArray.splice(index, 1); //删除时间
      },
      changTime() {
        let self = this;
        self.showAddTime = false;
        self.paneList[Number(self.activeName)].timeArray.push(self.newTime)
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
            tempSchedules.forEach(sche=>{
              console.log(sche)
              let day = sche.day;
              dayArray.push(day)
              let period = sche.period;
              period.forEach(periods=>{
                let from = periods.from;
                let hours = self.secondsToHour(from);
                if(timeArray.indexOf(hours) == -1){
                  timeArray.push(self.secondsToHour(from));
                }
                else{

                }
              })
            })
            console.log(timeArray);
            console.log(dayArray);
            tempScheduleData.timeArray = timeArray;
            tempScheduleData.dayArray = dayArray;
            self.paneList.push(tempScheduleData);
          })
          //self.paneList.push(tempScheduleData);
          if(self.isFirstLoad == true){
            //self.timeArray = self.paneList[0].timeArray
            //self.enable = self.paneList[0].enable;
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
          let timeSelected = self.paneList[tabIndex].timeArray;
          let selectedWeek = self.selectWeek;
          self.paneList[tabIndex].dayArray = self.selectWeek;
          selectedWeek.forEach(item=>{
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
        let scheduleIds = [];
        scheduleIds.push(self.scheduleId);
        let params = {};
        params.scheduleIds = scheduleIds;

        return new Promise((resolve, reject) => {
          deleteScheduleService(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let data = res.errCode;
            console.log(data);
            if(data == 0){
              self.notify('删除成功','warning',3000);
            }
            else{
              self.notify('删除失败','warning',3000);
            }
            //刷新页面
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
            resolve(data);
          })

        })
      },
      getMaxLength(){
        let self = this;
        console.log(self.paneList)
      }
    },
    mounted(){
      let self = this;
      self.getScheduleList();
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
    text-align: center;
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
            padding-left: 50px;
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
              width: 220px;
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
              position: absolute;
              right: 10px;
              top: 18px;
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
              position: absolute;
              right: 10px;
              top: 18px;
            }
          }
          .month-panel{
            position: absolute;
            margin-top: 3px;
            left: 170px;
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
            }
          }
          .week-panel{
            position: absolute;
            margin-top: 3px;
            left: 172px;
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
        // @include point(height, 450);
        overflow: auto;
        background-color: #F6F7FB;
        border: 0.5px solid #e3e9f4;
        color: $black;

        .el-all-checkbox {
          margin: 20px auto 20px 15px;
          @include point(margin-left, 15);
          position: absolute;
          .all-device-title {
            @include point(margin-left, 0);
            font-size: 14px;
          }
        }

        .device-group {
          width: 100%;
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
