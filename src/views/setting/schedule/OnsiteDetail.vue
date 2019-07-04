<template>
  <el-row class="el-schedule-container" :style="{'min-height':varyWindowHeight-200+'px'}">
    <div class="el-schedule-header">
      <el-col :span="7" class="el-schedule-btns">
      </el-col>
      <el-dialog title='增加排程'
                 :visible.sync="showAddDialog" v-if="showAddDialog"
                 :append-to-body='true'
                 :close-on-click-modal="false"
                 width="28%"
                 top="35vh"
                 left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #f31d65;"/>
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <span>排程名称</span>
            <el-input v-model="scheduleName" clearable placeholder="请输入排程名称" size="mini"
                      class="el-schedule-name"></el-input>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" @click="showAddDialog = false" size="mini" style="">取 消</el-button>
          <el-button class="file-confirm-btn" @click="addSchedule" size="mini" type="primary">确 认</el-button>
        </div>
      </el-dialog>
      <el-dialog title='删除排程'
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
            <span>此操作将会清空删除排程信息及绑定的门店，是否继续?</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" @click="showDeleteDialog = false" size="mini" style="">取 消</el-button>
          <el-button class="file-confirm-btn" @click="deleteSchedule" size="mini"
                     type="primary">确 认
          </el-button>
        </div>
      </el-dialog>
      <el-col :span="18" class="el-schedule-tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick" :id="lang=='en'? 'en-patrltabs-content': ''">
          <el-tab-pane v-for="(item,index) in paneList" :name="index.toString()"
                       :key="index" :label="`${item.name}`">
            <div :style="{height:varyWindowHeight}">
              <el-col :span="24" class="header-details">
                <span>排程类型</span>
                <el-select v-model="curType" clearable  placeholder="选择类型" size="mini" :disabled="isDisabled"
                           class="el-type" >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                <div class="day-detail" v-if="curType =='1'">
                  <span class="day-title">按天选择</span>
                  <div class="day-content" @click="choiceWeek">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="weekValue" size="mini" id="elWeek" placeholder="每天" :readonly=true></el-input>
                    <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="week-panel" v-if="showWeekContent">
                    <div class="week-details" v-for="(item,index) in weekList" :key="index">
                      <el-checkbox v-model="item.checked" @change="changeWeekItem(item)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="24" class="header-details" v-if="curType== '2'">
                <span>选择日期</span>
                <div class="month-content" @click="choiceMonth">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="monthValue" size="mini" id="elMonth" placeholder="每月" :readonly=true></el-input>
                  <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div class="month-panel" v-if="showMonthContent">
                  <div class="month-details" v-for="(item,index) in monthList" :key="index">
                    <el-checkbox v-model="item.checked" @change="changeMonthItem(item)"></el-checkbox>
                    <span>{{item.name}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="24" class="header-details" v-if="curType== '3'">
                <span>选择月份</span>
                <el-select v-model="selfMonth" clearable  placeholder="选择月份" size="mini">
                  <el-option v-for="item in selfMonthList" :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
                <div class="day-detail">
                  <span>选择日期</span>
                  <div class="month-content" @click="choiceMonth">
                    <div class="input-arrow-panel"></div>
                    <el-input v-model="monthValue" size="mini" id="elMonth" placeholder="每月" :readonly=true></el-input>
                    <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                  </div>
                  <div class="self-month-panel" v-if="showMonthContent">
                    <div class="month-details" v-for="(item,index) in monthList" :key="index">
                      <el-checkbox v-model="item.checked" @change="changeMonthItem(item)"></el-checkbox>
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="24" class="header-details"
                      :key="index">
                <span>提醒时间</span>
                <el-time-select
                  class="time-select"
                  v-model="newTime"
                  :picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '23:59'
                }"
                  placeholder="选择时间"
                  size="mini"
                >
                </el-time-select>
              </el-col>
            </div>
            <hr class="el-header-hr"/>
            <div class="el-bind-header" style="position: relative;top: 20px;">
                <span class="el-header-title" style="left: 10px;font-size: 14px;margin-top: 10px;
    margin-bottom: 10px;">绑定门店</span>
              <span class="choice-device"><i class="iconfont icon-tishi1"
                                             style="margin-right:10px;color:#93A2B6;"></i>已绑定{{storeCount}}家门店</span>
              <el-input
                size="small"
                class="el-search-input"
                :clearable=true
                placeholder="请输入关键词搜索门店"
                v-model="serachVale" @keyup.enter.native="searchStoreInput">
                <i @click="searchStoreInput" slot="prefix" class="iconfont icon-sousuo"
                   style="position:relative;top:6px;left:6px;font-size:18px;"></i>
              </el-input>
            </div>
            <el-col style="margin-top: 65px;">
              <div class="el-bind-content" :style="{'min-height':varyWindowHeight*0.44+'px'}">
                <div  class="el-all-checkbox" v-if="storeList.length!=0">
                  <el-checkbox v-model="allData" @change="choiceAll" style="margin-right: 20px"></el-checkbox>
                  <span class="all-device-title">关联至所有门店</span>
                </div>
                <div class="device-group" v-for="(item,index) in storeList" :key="index">
                  <div class="device-all-checkbox" style="float: left;">
                    <div style="display: block">
                      <el-checkbox v-model="item.checked" @change="choiceAllGroup(item)" style="margin-right: 20px"></el-checkbox>
                      <span class="group-name">{{item.cityName}}</span>
                    </div>
                  </div>
                  <div class="device-content" style="clear: left;margin-left: 60px;text-align: left">
                    <div class="device-detail" v-for="(_item,_index) in item.itemData" :key="_index" style="margin-top: 20px;">
                      <el-checkbox v-model="_item.checked"
                                   @change="choiceAllDevice(index,item,_index,_item)" style="margin-right: 20px"></el-checkbox>
                      <span class="device-name">{{_item.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style="float: left;margin: 30px 0px 30px 20px;font-size: 14px;">
                <!--<span style="margin-right: 70px">启用</span>-->
                <!--<el-switch-->
                <!--v-model="enable"-->
                <!--active-color="#13ce66"-->
                <!--inactive-color="#ff4949">-->
                <!--</el-switch>-->
              </div>
              <div class="el-bind-footer" style="right: 30px;margin-top: 50px;">
                <div class="el-btn-content">
                  <el-button :disabled="storeList.length==0" class="btn" size="mini" @click="bindScheduleBtn"><i
                    class="iconfont icon-quxiaolianjie" style="margin-right:10px;"></i>保存并套用
                  </el-button>
                </div>
              </div>
            </el-col>

          </el-tab-pane>
        </el-tabs>
        <el-dialog title='提示'
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
              <span>套用排程会覆盖至关联门店，确认绑定？</span>
            </p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" @click="showBindDialog = false" size="mini" style="">取 消</el-button>
            <el-button class="file-confirm-btn" @click="bindSchedule" size="mini"
                       type="primary">确 认
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
    name: "OnsiteDetail",
    data(){
      return {
        varyWindowHeight:window.innerHeight,
        varyWindowWidth:window.innerWidth,
        allData:false,
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
        value: '',
        input4:'',
        checked:false,
        checkAll: false,
        isIndeterminate: true,
        checkAll1: false,
        activeName: '0',
        curType: '2',
        typeList:[
          // {
          //   value: '0',
          //   label: '日模式'
          // },
          // {
          //   value: '1',
          //   label: '周模式'
          // },
          {
            value: '2',
            label: '月模式'
          },
          {
            value: '3',
            label: '自定义模式'
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
        weekValue:'每天',
        monthValue: '每月',
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
        selfMonthList: [
          {
            'checked': false,
            'name': '1',
            'value': '1',
          },
          {
            'checked': false,
            'name': '2',
            'value': '2',
          },
          {
            'checked': false,
            'name': '3',
            'value': '3',
          },
          {
            'checked': false,
            'name': '4',
            'value': '4',
          },
          {
            'checked': false,
            'name': '5',
            'value': '5',
          },
          {
            'checked': false,
            'name': '6',
            'value': '6',
          },
          {
            'checked': false,
            'name': '7',
            'value': '7',
          },
          {
            'checked': false,
            'name': '8',
            'value': '8',
          },
          {
            'checked': false,
            'name': '9',
            'value': '9',
          },
          {
            'checked': false,
            'name': '10',
            'value': '10',
          },
          {
            'checked': false,
            'name': '11',
            'value': '11',
          },
          {
            'checked': false,
            'name': '12',
            'value': '12',
          },
        ],
        showSelfMonthContent: false,
        showSelfMonthDrap: false,
        selfMonth: '',
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
        self.curType = (self.paneList[tabIndex].mode).toString();
        self.timeArray = self.paneList[tabIndex].timeArray;
        self.dayArray =  self.paneList[tabIndex].dayArray;
        self.newTime = self.paneList[tabIndex].notifyTime;
        if(self.curType == 3){
          //自定义模式
          self.selfMonth = self.paneList[tabIndex].selfMonth;
        }
        self.echoMonthAndWeek();
        self.scheduleId = self.paneList[tabIndex].schId;
        self.enable = self.paneList[tabIndex].enable;
        console.log(self.enable)
        this.$emit('sendActiveName', self.activeName)
        self.searchStore();
      },
      echoMonthAndWeek(){
        let self = this;
        let type = self.curType;
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
              self.weekValue = '每天';
            }
          }
        }
        else if(type == 2){
          let selectedMonth = self.dayArray;
          self.selectMonth = selectedMonth;
          console.log(selectedMonth + 'selectedMonth');
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
            if (count == self.monthList.length) {
              self.monthValue = '每月';
            }
          }
        }
        else if(type == 3){
          let selectedMonth = self.dayArray;
          self.selectMonth = selectedMonth;
          console.log(selectedMonth + 'selectedMonth');
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
            if (count == self.monthList.length) {
              self.monthValue = '每月';
            }
          }
        }
      },
      choiceWeek() {
        let self = this;
        self.showWeekContent = !self.showWeekContent;
        //self.showDrap = true;
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
            self.weekValue = '每天';
          }
        }
      },
      choiceMonth(){
        let self = this;
        self.showMonthContent = !self.showMonthContent;
        //self.showMonthDrap = true;
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
        params.name = self.scheduleName;
        params.comment = '现场巡检计划';
        params.category = 1;
        params.mode = Number(self.curType);
        params.enable = 1;
        params.from =  new Date().getTime();
        params.to = new Date('9999/12/01').getTime();
        params.notifyTime = Number(self.hourToSecond(self.newTime));
        self.isDisabled = true;
        let tempSchedule = [];
        if(params.mode == 0){
          //日模式
          let tempPeriod = [];
          let timeSelect = self.timeArray;
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
          let timeSelected = self.timeArray;
          let selectedWeek = self.selectWeek;
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
          let timeSelected = self.timeArray;
          let selectedMonth = self.selectMonth;
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
        else if(params.mode = 3){
          //自定义模式
          let firstAndLastDay = self.getMonthFirstLastDay(self.selfMonth)
          params.from =  firstAndLastDay[0];
          params.to = firstAndLastDay[1];
          let selectedMonth = self.selectMonth; //选择的日期
          selectedMonth.forEach(item=>{
            console.log(item);
            let tempSche = {};
            tempSche.day = Number(item);
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
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
        self.showAddDialog = false
        self.paneList.push({name: self.scheduleName, mode: 0, schId: 0, scheduleInfo: {},dayArray:[], timeArray:['8:00']});
        let pane = self.paneList;
        self.timeArray = ['8:00'];
        self.dayArray = [];
        self.curType = '2';
        self.weekValue = '每天',
        self.monthValue = '每月',
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
          item.store.forEach(_item => {
            let _obj = {};
            if (bindStoreId.indexOf(_item.storeId) == -1) {
              _obj.checked = false;
            }
            else {
              _obj.checked = true;
              _tempCount++;
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
        if (count == self.storeList.length) {
          self.allData = true;
        }
        else {
          self.allData = false;
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
        //如果是新增排程，则先调用新增排程服务，获得返回的scheduleId
        if(self.selectTab == self.scheduleName){
          scheId = await self.addScheduleService();
          self.scheduleName = ''
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

        if(self.selectTab != self.scheduleName){
          self.updateScheduleInfo();
        }
        self.getScheduleList();
        self.timeArray = this.paneList[Number(self.activeName)].timeArray;
        console.log(timeArray)
        self.searchStore();
      },
      deleteCurTime(index) {
        console.log(index)
        let self = this;
        self.timeArray.splice(index, 1); //删除时间
      },
      changTime() {
        let self = this;
        self.showAddTime = false;
        self.timeArray.push(self.newTime)
        console.log(self.timeArray)
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
          item.checked=val;
          item.itemData.forEach(_item=>{
            _item.checked=val;
          })
        })
      },
      choiceAllGroup(item){
        let self=this;
        console.log(item);
        let obj=item;
        item.itemData.forEach(item=>{
          item.checked=obj.checked;
        })
        let arr=[];
        self.storeList.forEach(_item=>{
          if(_item.checked){
            arr.push(_item);
          }
        })
        if(self.storeList.length==arr.length){
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
        if(count==item.itemData.length){
          item.checked=true;
        }
        else{
          item.checked=false;
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
        params.category = 1; //现场巡检
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
            console.log(_item);
            let tempScheduleData = {};
            tempScheduleData.name = _item.name;
            tempScheduleData.mode = _item.mode;
            tempScheduleData.schId = _item.id; //排程id
            tempScheduleData.scheduleInfo = _item;
            tempScheduleData.enable = _item.enable;
            tempScheduleData.notifyTime = self.secondsToHour(_item.notifyTime);
            tempScheduleData.selfMonth = self.getMonthFromSecond(_item.from);
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
            self.timeArray = self.paneList[0].timeArray
            self.isFirstLoad = false;
            self.initData();
            self.searchStore();
          }
          //self.timeArray = self.paneList[0].timeArray
          console.log(self.paneList);
        }
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
        params.comment = '远程巡检计划';
        // params.category = 1;
        // params.mode = 0;
        params.enable = 1;
        params.from = new Date().getTime();
        params.to =  new Date('9999/12/01').getTime();;
        params.notifyTime = self.hourToSecond(self.newTime);
        let tempSchedule = [];
        //日模式
        if(self.curType == 0){
          //日模式
          let tempPeriod = [];
          let timeSelect = self.timeArray;
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
        else if(self.curType == 1){
          //周模式
          let timeSelected = self.timeArray;
          let selectedWeek = self.selectWeek;
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
        else if(self.curType == 2){
          //月模式
          let timeSelected = self.timeArray;
          let selectedMonth = self.selectMonth;
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
        else if(params.mode = 3){
          //自定义模式
          let firstAndLastDay = self.getMonthFirstLastDay(self.selfMonth)
          params.from =  firstAndLastDay[0];
          params.to = firstAndLastDay[1];
          let selectedMonth = self.selectMonth; //选择的日期
          selectedMonth.forEach(item=>{
            console.log(item);
            let tempSche = {};
            tempSche.day = Number(item);
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
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
            self.curType = (self.paneList[0].mode).toString();
            console.log(typeof(self.curType))
            self.timeArray = self.paneList[0].timeArray;
            self.dayArray =  self.paneList[0].dayArray;
            self.echoMonthAndWeek();
            self.scheduleId = self.paneList[0].schId;
            self.enable = self.paneList[0].enable;
            self.newTime = self.paneList[0].notifyTime;
            console.log(self.scheduleId)
            self.searchStore();
            resolve(data);
          })

        })
      },
      initData(){
        let self = this;
        self.activeName = '0';
        let tabIndex = Number(self.activeName);
        self.curType = (self.paneList[tabIndex].mode).toString();
        self.timeArray = self.paneList[tabIndex].timeArray;
        self.dayArray =  self.paneList[tabIndex].dayArray;
        self.echoMonthAndWeek();
        self.scheduleId = self.paneList[tabIndex].schId;
        self.selectTab = self.paneList[tabIndex].name;
        self.enable = self.paneList[tabIndex].enable;
        self.newTime = self.secondsToHour(self.paneList[tabIndex].notifyTime);
        console.log(self.enable)
      },
      /**
       * 获取指定月份的第一天和最后一天的秒数
       * @param month
       * @returns {number[]}
       */
      getMonthFirstLastDay(month){
        var year = new Date().getFullYear();
        var firstDay = new Date(year,month-1,1);//这个月的第一天
        var currentMonth=firstDay.getMonth(); //取得月份数
        var lastDay=new Date(firstDay.getFullYear(),currentMonth+1,0);//是0而不是-1
        var firstDay = firstDay.getTime();
        var lastDay = lastDay.getTime(); //返回第一天和最后一天的秒数
        return [firstDay,lastDay];
      },
      /**
       * 从秒数里获得月份
       * @param second
       * @returns {number}
       */
      getMonthFromSecond(second){
        let month  = new Date(second).getMonth();
        console.log(month);
        return Number(month) + 1;
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
      @include point(height, 30)
    }
  }
  .el-schedule-container{
    margin: 0px 15px 15px 15px;
    height: calc(180 / 1920 * 100vw);

    .el-schedule-header {
      //@include point(margin-top, 10);

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
            left: 122px;
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
          .self-month-panel{
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
          .self-content{
            display: inline-block;
            position: relative;
            cursor: pointer;
            #selfMonth{
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
          .self-panel{
            position: absolute;
            margin-top: 3px;
            left: 122px;
            width: 188px;
            height: 150px;
            z-index: 980;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 5px;
            overflow: auto;
            .self-details{
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
          .el-select{
            width: 200px;
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
            min-width: 100px;
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
          @include point(width, 98);
          font-size: 12px;
          &:disabled{
            opacity: 0.6;
          }
        }
        .el-delete-btn {
          background-color: $mainColor;
          color: #fff;
          border-color: $mainColor;
          position: relative;
          @include point(margin-right, 15);
          @include point(width, 98);
          font-size: 12px;

          &:disabled {
            opacity: 0.6;
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

