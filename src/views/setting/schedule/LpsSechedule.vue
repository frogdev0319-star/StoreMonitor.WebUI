<template>
  <el-row :style="{'min-height':varyWindowHeight-200+'px'}" class="el-schedule-container">
    <div class="el-schedule-header">
      <el-col :span="7" class="el-schedule-btns">
        <el-button
          :class="lang === 'en' ? 'en-el-add-btn':'el-add-btn'"
          type="primary"
          size="mini"
          class="btn-class"
          @click="addSchedule">
          <i style="margin-right:8px;" class="iconfont el-icon-plus"/><span>{{ $t('scheduleView.addSchedule') }}</span>
        </el-button>
        <el-button
          :class="lang === 'en' ? 'en-el-delete-btn':'el-delete-btn'"
          :disabled="Number(activeName) === 0? true: false"
          type="primary"
          size="mini"
          class="btn-class"
          @click="deleteScheduleBtn">
          <i style="margin-right:8px;" class="iconfont icon-shanchu"/><span>{{ $t('scheduleView.delete') }}</span>
        </el-button>
      </el-col>
      <el-dialog
        v-if="showDeleteDialog"
        :title="$t('scheduleView.delete')"
        :visible.sync="showDeleteDialog"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="28%"
        top="35vh"
        left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #dfe2e9;">
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803; display: inline-block;  vertical-align: middle"/>
            <span style="display: inline-block;  vertical-align: middle">{{ $t('scheduleView.saveInfo') }}</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteDialog = false">
            {{ $t('scheduleView.cancel') }}</el-button>
          <el-button
            class="file-confirm-btn"
            size="mini"
            type="primary"
            @click="deleteSchedule">{{ $t('scheduleView.confirm') }}
          </el-button>
        </div>
      </el-dialog>
      <el-col :span="18" class="el-schedule-tabs">
        <el-tabs id="patrltabs-content" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(paneItem,index) in paneList"
            :name="index.toString()"
            :key="index"
            :label="`${paneItem.name}`"
            :lazy="true">
            <el-col :span="24" class="header-details">
              <span :id="lang === 'en'? 'en-span' : 'span'">{{ $t('scheduleView.scheduleName') }}</span>
              <el-input
                ref="scheduleName"
                v-model="paneItem.name"
                :placeholder="$t('scheduleView.inputPlaceholder')"
                size="mini"
                class="el-type"/>
            </el-col>
            <el-col :span="24" class="header-details">
              <span :id="lang === 'en' ? 'en-span' : 'span'">{{ $t('scheduleView.scheduleType') }}</span>
              <el-select
                v-model="paneItem.mode"
                :disabled="paneItem.modeDisabled"
                size="mini"
                class="el-type"
                @change="searchStore" >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-col>
            <!-- Weekly Mode-->
            <el-col v-for="(_item, _index) in paneItem.schedule" v-if="paneItem.mode === 1" :span="24"
                    :key="'mode1'+_index" class="header-details">
              <div class="day-detail">
                <span :id="lang=='en'? 'en-span': 'span'">{{ $t('scheduleView.selectOnDay') }}</span>
                <region-multi-select
                  :options="_item.weekList"
                  :selected="_item.dayArray"
                  :placeholder="$t('scheduleView.select')"
                  :disabled="false"
                  :input-size="`mini`"
                  :all="$t('scheduleView.everyDay')"
                  :is-point-check="true"
                  class="week-days"
                  @changeInput="changeSelectWeek(arguments,_item)"/>
              </div>
              <span :id="lang === 'en' ? 'en-span' : 'span'">{{ $t('scheduleView.exectionTime') }}</span>
              <multi-range :time-array = "_item.period" class="multi-range" refs="ranges"
                           @getTimeArray="(val)=>getTimeArray(val, _index)" />
              <span
                v-if="paneItem.schedule.length > 1"
                class="delete-time-btn"
                size="mini"
                type="primary"
                @click="deleteWeekDays(_index)"><i class="el-icon-error"/></span>
              <el-button
                v-if="_index === paneItem.schedule.length-1"
                :style="paneItem.schedule.length === 1 ? {margin:'0 0 0 50px'} : {margin:'0'}"
                class="time-btn"
                size="mini"
                type="primary"
                @click="addWeekDays"><i class="el-icon-plus"/></el-button>
            </el-col>
            <!-- Daily Mode -->
            <el-col
              v-for="(timeItem, timeIndex) in paneItem.timeList"
              v-if="paneItem.timeList.length > 0 && paneItem.mode !== 1"
              :span="24"
              :key="timeIndex"
              class="header-details">
              <div class="day-detail">
                <span :id="lang=='en'? 'en-span': 'span'">{{ $t('scheduleView.exectionTime') }}</span>
                <el-select v-model="timeItem.time.from" class="time-select" @change="choiceDayTime(timeIndex)" >
                  <el-option v-for="(timeIt,timeIn) in timeItem.timeArray" :key="timeIn" :label="timeIt.value"
                             :value="timeIt.value" :disabled="timeIt.disabled"/>
                </el-select>
              </div>
              <div class="day-detail">
                <span :id="lang === 'en'? 'en-span': 'span'">结束时间</span>
                <el-select v-model="timeItem.time.to" class="time-select" @change="choiceDayTime(timeIndex)" >
                  <el-option v-for="(timeIt,timeIn) in timeItem.timeArray" :key="timeIn" :label="timeIt.value"
                             :value="timeIt.value" :disabled="timeIt.disabled"/>
                </el-select>
              </div>
              <span
                v-if="paneItem.timeList.length > 1"
                class="delete-time-btn"
                size="mini"
                type="primary"
                @click="deleteCurTime(timeIndex)"><i class="el-icon-error"/></span>
              <el-button
                v-if="timeIndex === paneItem.timeList.length-1"
                :style="paneItem.timeList.length === 1 ? {margin:'0 0 0 50px'} : {margin:'0 20px 0 30px'}"
                class="time-btn"
                size="mini"
                type="primary"
                @click="addTime"><i class="el-icon-plus"/></el-button>
            </el-col>
            <el-col :span="24" class="el-header-hr"/>
            <el-col :span="24" class="el-bind-header">
              <div style="display: flex">
                <div class="el-header-title">{{ $t('scheduleView.bindStore') }}</div>
              </div>
              <div class="select-info">
                <span class="choice-device">
                  <i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"/>
                  {{ $t('scheduleView.hasBind') }}{{ storeCount }}{{ $t('scheduleView.stores') }}
                </span>
                <el-input
                  :clearable="true"
                  :placeholder="$t('scheduleView.searchInfo')"
                  v-model="serachVale"
                  size="small"
                  class="el-search-input"
                  @keyup.enter.native="searchStoreInput">
                  <i
                    slot="prefix"
                    class="iconfont icon-sousuo"
                    style="position:relative;top:6px;left:6px;font-size:18px;"
                    @click="searchStoreInput"/>
                </el-input>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="el-bind-content">
                <el-scrollbar id="el-menuscrollbar" style="height:100%;">
                  <div v-if="storeList.length!=0" class="el-all-checkbox">
                    <el-checkbox v-model="allData" :disabled="allDisabled" @change="choiceAll"/>
                    <span class="all-device-title">{{ $t('scheduleView.bindAllStore') }}</span>
                  </div>
                  <div v-for="(item,index) in storeList" :key="index" class="device-group">
                    <div class="device-all-checkbox">
                      <div style="display: block">
                        <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="choiceAllGroup(item)"/>
                        <span class="group-name">{{ item.cityName }}</span>
                      </div>
                    </div>
                    <div class="device-content" >
                      <div v-for="(_item,_index) in item.itemData" :key="_index" class="device-detail">
                        <el-checkbox
                          v-model="_item.checked"
                          :disabled="_item.disabled"
                          style="margin-right: 20px"
                          @change="choiceAllDevice(index,item,_index,_item)"/>
                        <span :style="{'color': _item.disabled ? '#7d8cad':''}" class="device-name">{{ _item.name }}</span>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <div class="enable-content">
                <span>{{ $t('scheduleView.enable') }}</span>
                <el-switch
                  v-model="paneItem.enable"/>
              </div>
              <div class="el-bind-footer">
                <div class="el-btn-content">
                  <el-button :disabled="storeList.length === 0" class="btn" size="mini" type="primary" @click="bindScheduleBtn">
                    <span>{{ $t('scheduleView.saveAndApply') }}</span>
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-tab-pane>
        </el-tabs>
        <el-dialog
          v-if="showBindDialog"
          :title="$t('scheduleView.prompt')"
          :visible.sync="showBindDialog"
          :append-to-body="true"
          :close-on-click-modal="false"
          width="28%"
          top="35vh"
          left="40vh">
          <div class="dialog-content" style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #dfe2e9;">
            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
              <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block;  vertical-align: middle"/>
              <span style="display: inline-block;  vertical-align: middle">{{ $t('scheduleView.confirmBind') }}</span>
            </p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" size="mini" style="" @click="showBindDialog = false">
              {{ $t('scheduleView.cancel') }}</el-button>
            <el-button
              class="file-confirm-btn"
              size="mini"
              type="primary"
              @click="bindSchedule">{{ $t('scheduleView.confirm') }}
            </el-button>
          </div>
        </el-dialog>
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
}
  from '@/api/schedule';
import { getStoreList } from '@/api/store';
import util from '@/common/util';
import { mapGetters } from 'vuex';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import LimitSelect from '@/components/LimitSelect';
import MultiRange from '@/components/MultiRange';

export default {
  name: 'LpsSchedule',
  components: {
    RegionMultiSelect,
    LimitSelect,
    MultiRange
  },

  data() {
    return {
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      allData: false,
      allDisabled: false,
      storeList: [],
      tempStoreList: [],
      scheduleList: [],
      paneList: [],
      lang: this.$i18n.locale,
      monthList: [
        {
          'checked': false,
          value: 1,
          name: '1',
          label: 1
        },
        {
          'checked': false,
          value: 2,
          name: '2',
          label: 2
        },
        {
          'checked': false,
          value: 3,
          name: '3',
          label: 3
        },
        {
          'checked': false,
          value: 4,
          name: '4',
          label: '4'
        },
        {
          'checked': false,
          value: 5,
          name: '5',
          label: '5'
        },
        {
          'checked': false,
          value: 6,
          name: '6',
          label: '6'
        },
        {
          'checked': false,
          value: 7,
          name: '7',
          label: '7'
        },
        {
          'checked': false,
          value: 8,
          name: '8',
          label: '8'
        },
        {
          'checked': false,
          value: 9,
          name: '9',
          label: '9'
        },
        {
          'checked': false,
          value: 10,
          name: '10',
          label: '10'
        },
        {
          'checked': false,
          value: 11,
          name: '11',
          label: '11'
        },
        {
          'checked': false,
          value: 12,
          name: '12',
          label: '12'
        },
        {
          'checked': false,
          value: 13,
          name: '13',
          label: '13'
        },
        {
          'checked': false,
          value: 14,
          name: '14',
          label: '14'
        },
        {
          'checked': false,
          value: 15,
          name: '15',
          label: '15'
        },
        {
          'checked': false,
          value: 16,
          name: '16',
          label: '16'
        },
        {
          'checked': false,
          value: 17,
          name: '17',
          label: '17'
        },
        {
          'checked': false,
          value: 18,
          name: '18',
          label: '18'
        },
        {
          'checked': false,
          value: 19,
          name: '19',
          label: '19'
        },
        {
          'checked': false,
          value: 20,
          name: '20',
          label: '20'
        },
        {
          'checked': false,
          value: 21,
          name: '21',
          label: '21'
        },
        {
          'checked': false,
          value: 22,
          name: '22',
          label: '22'
        },
        {
          'checked': false,
          value: 23,
          name: '23',
          label: '23'
        },
        {
          'checked': false,
          value: 24,
          name: '24',
          label: '24'
        },
        {
          'checked': false,
          value: 25,
          name: '25',
          label: '25'
        },
        {
          'checked': false,
          value: 26,
          name: '26',
          label: '26'
        },
        {
          'checked': false,
          value: 27,
          name: '27',
          label: '27'
        },
        {
          'checked': false,
          value: 28,
          name: '28',
          label: '28'
        }
      ],
      checked: false,
      activeName: '0',
      curType: 0,
      typeList: [
        {
          value: 0,
          label: this.$t('scheduleView.daily')
        },
        {
          value: 1,
          label: this.$t('scheduleView.weekly')
        }
      ],
      weekList: [
        {
          'disabled': false,
          'name': this.$t('scheduleView.mon'),
          'label': this.$t('scheduleView.mon'),
          'value': 1
        },
        {
          'disabled': false,
          'name': this.$t('scheduleView.tues'),
          'label': this.$t('scheduleView.tues'),
          'value': 2
        },
        {
          'disabled': false,
          'name': this.$t('scheduleView.wed'),
          'label': this.$t('scheduleView.wed'),
          'value': 3
        },
        {
          'disabled': false,
          'name': this.$t('scheduleView.thur'),
          'label': this.$t('scheduleView.thur'),
          'value': 4
        },
        {
          'disabled': false,
          'name': this.$t('scheduleView.fri'),
          'label': this.$t('scheduleView.fri'),
          'value': 5
        },
        {
          'disabled': false,
          'name': this.$t('scheduleView.sat'),
          'label': this.$t('scheduleView.sat'),
          'value': 6
        },
        {
          'disabled': false,
          'name': this.$t('scheduleView.sun'),
          'label': this.$t('scheduleView.sun'),
          'value': 7
        }

      ],
      showDeleteDialog: false,
      scheduleName: '',
      storeCount: 0,
      serachVale: '',
      scheduleId: -1,
      bindStoreId: [],
      selectTab: '',
      selectWeek: [],
      selectMonth: [],
      isFirstLoad: true,
      isDisabled: true,
      showBindDialog: false,
      hasBoundStoreIds: [],
      weeklyTimeArray: [],
      isAdd: false,
      value: [30, 60]
    };
  },
  watch: {
    accountChanged(val, oldVal) {
      console.log(val);
      const self = this;
      if (val !== 0) {
        self.isFirstLoad = true;
        self.activeName = '0';
        self.getScheduleList();
      }
    }
  },
  computed: {
    ...mapGetters({
      accountChanged: 'accountChanged'
    }),
    marks() {
      const obj = {};
      for (let i = 0; i <= 24; i++) {
        const a = i * 3600;
        obj[a] = `${i}:00`;
      }
      return obj;
    }
  },

  created() {
    const self = this;
    self.getSelectTimeArray();
    self.getScheduleList();
  },

  methods: {
    async bindScheduleBtn() {
      const self = this;
      const tabIndex = Number(self.activeName);
      const mode = self.paneList[tabIndex].mode;
      const timeList = self.paneList[tabIndex].timeList;
      const name = self.paneList[tabIndex].name;
      const weekSchedule = self.paneList[tabIndex].schedule;
      console.log(weekSchedule);
      console.log(timeList);
      if (name === '') {
        self.notify(self.$t('scheduleView.emptyName'), 'warning', 3000);
        self.$refs.scheduleName[tabIndex].focus();
        return false;
      }
      if (mode === 0 && timeList[0].time === '') {
        self.notify(self.$t('scheduleView.emptyTime'), 'warning', 3000);
        return false;
      }
      if (mode === 1) {
        let lackDay = false;
        let lackTime = false;
        weekSchedule.forEach(item => {
          if (item.dayArray.length === 0) {
            lackDay = true;
          } else if (item.period.length === 0) {
            lackTime = true;
          }
        });
        console.log(lackDay + '..' + lackTime);
        if (lackDay) {
          self.notify(self.$t('scheduleView.emptyDate'), 'warning', 3000);
          return false;
        } else if (lackTime) {
          self.notify(self.$t('scheduleView.emptyTime'), 'warning', 3000);
          return false;
        }
      }
      if (mode === 2) {
        if (self.selectMonth.length === 0) {
          self.notify(self.$t('scheduleView.emptyTime'), 'warning', 3000);
          return false;
        } else if (timeList[0].time === '') {
          self.notify(self.$t('scheduleView.emptyTime'), 'warning', 3000);
          return false;
        }
      }
      self.showBindDialog = true;
    },

    handleClick(val) {
      console.log(val);
      const self = this;
      self.activeName = val.index;
      self.selectTab = val.label;
      const tabIndex = Number(self.activeName);
      self.echoMonthAndWeek();
      self.scheduleId = self.paneList[tabIndex].schId;
      self.searchStore();
    },

    echoMonthAndWeek() {
      const self = this;
      const type = self.paneList[Number(self.activeName)].mode;
      const dateStr = '';
      const count = 0;
      if (type === 1) {
        self.choiceWeek();
      } else {
        self.choiceDayTime();
      }
    },

    choiceWeek(index) {
      const self = this;
      const tabIndex = Number(self.activeName);
      const actPanList = self.paneList[tabIndex];
      const schedule = actPanList.schedule;
      const count = 0;
      const selectedWeek = [];
      schedule.forEach(item => {
        const dayArr = item.dayArray;
        dayArr.forEach(_item => {
          selectedWeek.push(_item);
        });
      });
      console.log(selectedWeek);
      schedule.forEach(item => {
        item.weekList.forEach(_item => {
          _item.disabled = false;
        });
      });
      selectedWeek.forEach(item => {
        console.log(item);
        schedule.forEach(sche => {
          console.log(sche);
          sche.weekList.forEach(week => {
            if (week.value === item) {
              week.disabled = true;
            }
          });
        });
      });
      schedule.forEach(item => {
        console.log(item);
        item.dayArray.forEach(day => {
          console.log(day);
          item.weekList.forEach(week => {
            if (week.value === day) {
              week.disabled = false;
            }
          });
        });
      });
    },

    choiceDayTime() {
      const self = this;
      const tabIndex = Number(self.activeName);
      const actPanList = self.paneList[tabIndex];
      const selectTime = [];
      actPanList.timeList.forEach(item => {
        selectTime.push(item.time);
        item.timeArray.forEach(_item => {
          _item.disabled = false;
        });
      });
      selectTime.forEach(item => {
        actPanList.timeList.forEach(schedule => {
          schedule.timeArray.forEach(time => {
            if (time.value === item) {
              time.disabled = true;
            }
          });
        });
      });
    },

    addScheduleService() {
      const params = {};
      const self = this;
      const tabIndex = Number(self.activeName);
      params.name = self.paneList[tabIndex].name;
      params.comment = '防损计划';
      params.category = 3;
      const mode = self.paneList[tabIndex].mode;
      params.mode = mode;
      params.enable = Number(self.paneList[tabIndex].enable);
      params.from = new Date().getTime();
      params.to = -1;
      params.notityTime = 0;
      self.isDisabled = true;
      const tempSchedule = [];
      if (params.mode === 0) {
        // Daily Mode
        const tempPeriod = [];
        const timeSelect = self.paneList[tabIndex].timeList;
        timeSelect.forEach(item => {
          console.log(item);
          const timeFrom = item.time.from;
          const timeTo = item.time.to;
          if (timeFrom.length > 0) {
            const seconds = self.hourToSecond(timeFrom);
            const toSeconds = self.hourToSecond(timeTo);
            const obj = {};
            obj.from = seconds;
            obj.to = toSeconds;
            tempPeriod.push(obj);
          }
        });
        tempSchedule.push({
          'day': 1,
          'period': tempPeriod
        });
      } else if (params.mode === 1) {
        // Weekly Mode
        const schedule = self.paneList[tabIndex].schedule;
        console.log(schedule);
        schedule.forEach(item => {
          const timeArray = item.timeArray;
          const selectedWeek = item.dayArray.filter(item => item !== '-1');
          const period = item.period;
          selectedWeek.forEach(_item => {
            console.log(_item);
            const timePeriod = [];
            const tempSche = {};
            period.forEach(_it => {
              console.log(_it);
              const obj = {};
              obj.from = _it[0];
              obj.to = _it[1];
              timePeriod.push(obj);
            });
            tempSche.day = Number(_item);
            tempSche.period = timePeriod;
            tempSchedule.push(tempSche);
          });
        });
        console.log(tempSchedule);
      } else {

      }
      params.schedule = tempSchedule;
      return new Promise((resolve, reject) => {
        addNewSchedule(params).then(res => {
          console.log(res);
          const errMsg = res.errMsg;
          const errCode = res.errCode;
          const data = res.data.scheduleId;
          console.log(data);
          resolve(data);
        });
      });
    },

    async addSchedule() {
      const self = this;
      self.scheduleName = self.$t('scheduleView.newSchedule');
      self.isAdd = true;
      const scheduleInfo = {
        name: self.scheduleName,
        mode: 0,
        modeDisabled: false,
        schId: 0,
        dayArray: [],
        enable: false,
        to: -1,
        dueDays: 1,
        schedule: [{ dayArray: [], period: [], weekList: JSON.parse(JSON.stringify(self.weekList)) }],
        timeList: [{ time: { from: '', to: '' }, timeArray: JSON.parse(JSON.stringify(self.weeklyTimeArray)) }]
      };
      self.paneList.push(scheduleInfo);
      const pane = self.paneList;
      // self.dayArray = [];
      self.curType = 0;
      self.activeName = (pane.length - 1).toString();
      self.selectTab = self.scheduleName;
      self.scheduleId = 0;
      self.isDisabled = false;
      self.searchStore();
      self.selectWeek = [];
      self.selectMonth = [];
      console.log(self.paneList);
    },

    async searchStoreInput() {
      const self = this;
      const params = {};
      console.log(self.tempStoreList);
      const tempStoreList = self.tempStoreList;
      const getStore2Temp = data => {
        const cityList = [];
        data.forEach(item => {
          if (cityList.map(x => x.city).indexOf(item.city) === -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city === data[j].city) {
              const obj = {};
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.city = data[j].city;
              obj.checked = data[j].checked;
              obj.disabled = data[j].disabled;
              console.log(obj);
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].city;
          obj.province = cityList[i].province;
          obj.itemData = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      const temp = [];
      const tempArray = [];
      const tempStore = [];
      tempStoreList.forEach((_item, _index) => {
        _item.itemData.forEach((itemDs, indexDs) => {
          temp.push(util.getPinyinList(itemDs.name));
          tempStore.push(itemDs);
        });
      });
      for (var i = 0; i < temp.length; i++) {
        if (temp[i][0].indexOf(self.serachVale.trim()) !== -1 ||
            temp[i][1].indexOf(self.serachVale.trim()) !== -1) {
          tempArray.push(tempStore[i]);
        }
      }
      self.storeList = getStore2Temp(tempArray);

      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      if (count === self.storeList.length) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    getStoreData(params) {
      const self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          console.log(res);
          const errMsg = res.errMsg;
          const data = res.data;
          console.log(data);
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      });
    },

    async getStoreByCity(data) {
      const self = this;
      const bindStoreId = await self.getBindStoreList();
      self.storeCount = bindStoreId.length;
      console.log(data);
      const cityList = [];
      data.forEach(item => {
        if (cityList.indexOf(item.city) === -1) {
          cityList.push(item.city);
        }
      });
      console.log(cityList);
      const temp = [];
      cityList.forEach(item => {
        const obj = {};
        obj.city = item;
        const _temp = [];
        data.forEach(_item => {
          if (item === _item.city) {
            const _obj = {};
            obj.province = _item.province;
            _obj.storeName = _item.name;
            _obj.storeId = _item.storeId;
            _temp.push(_obj);
          }
        });
        obj.store = _temp;
        temp.push(obj);
      });
      console.log(temp);
      const groupTemp = [];
      temp.forEach(item => {
        const groupObj = {};
        groupObj.province = item.province;
        groupObj.cityName = item.city;
        const _temp = [];
        let _tempCount = 0;
        let _tempDisCount = 0;
        item.store.forEach(_item => {
          const _obj = {};
          if (bindStoreId.indexOf(_item.storeId) !== -1) {
            _obj.checked = true;
            _obj.disabled = false;
            _tempCount++;
          } else {
            if (self.hasBoundStoreIds.indexOf(_item.storeId) === -1) {
              _obj.checked = false;
              _obj.disabled = false;
            } else {
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
        });
        if (_tempCount === item.store.length) {
          groupObj.checked = true;
        } else {
          groupObj.checked = false;
        }

        if (_tempDisCount + _tempCount === item.store.length) {
          groupObj.checked = true;
        } else {
          groupObj.checked = false;
        }
        if (_tempDisCount === item.store.length) {
          groupObj.disabled = true;
          groupObj.checked = false;
        } else {
          groupObj.disabled = false;
        }
        groupObj.itemData = _temp;
        groupTemp.push(groupObj);
      });
      self.storeList = groupTemp;
      self.tempStoreList = groupTemp;
      console.log(self.storeList);
      console.log(self.tempStoreList);
      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      let disCount = 0;
      self.storeList.forEach(item => {
        if (item.disabled) {
          disCount++;
        }
      });
      if (count === self.storeList.length) {
        self.allData = true;
      } else {
        self.allData = false;
      }
      if (count + disCount === self.storeList.length) {
        self.allData = true;
      }
      if (disCount === self.storeList.length) {
        self.allDisabled = true;
      } else {
        self.allDisabled = false;
      }
      const totalConut = disCount + count;
      if (totalConut === self.storeList.length) {
        if (count > 0) {
          self.allDisabled = false;
          self.allData = true;
        } else {
          self.allDisabled = true;
          self.allData = false;
        }
      }
    },

    getBindStoreList() {
      const self = this;
      const scheduleId = self.scheduleId;
      console.log(scheduleId);
      const params = {};
      params.scheduleId = scheduleId;
      if (params.scheduleId === 0) {
        return [];
      } else if (params.scheduleId === -1) {
        console.log(self.paneList);
        params.scheduleId = self.paneList[0].schId;
      }
      return new Promise((resolve, reject) => {
        getScheduleBindList(params).then(res => {
          console.log(res);
          const errMsg = res.errMsg;
          const data = res.data;
          console.log(data);
          resolve(data);
        });
      });
    },

    addTime() {
      const self = this;
      self.showAddTime = true;
      console.log(self.showAddTime);
      self.paneList[Number(self.activeName)].timeList.push({
        time: { from: '', to: '' },
        timeArray: JSON.parse(JSON.stringify(self.weeklyTimeArray))
      });
      self.choiceDayTime();
    },
    addWeekDays(index) {
      const self = this;
      self.showAddWeek = true;
      self.paneList[Number(self.activeName)].schedule.push({
        dayArray: [],
        period: [],
        weekList: JSON.parse(JSON.stringify(self.weekList))
      });
      self.choiceWeek(index);
    },

    deleteWeekDays(index) {
      console.log(index);
      const self = this;
      self.paneList[Number(self.activeName)].schedule.splice(index, 1);
      console.log(self.paneList[Number(self.activeName)].schedule);
      self.choiceWeek(index);
    },
    bindScheduleToStore(params) {
      return new Promise((resolve, reject) => {
        bindScheduleAndStore(params).then(res => {
          resolve(res);
        });
      });
    },

    unbindScheToStore(params) {
      return new Promise((resolve, reject) => {
        unbindScheduleAndStore(params).then(res => {
          resolve(res);
        });
      });
    },

    async bindSchedule() {
      const self = this;
      let scheId = self.paneList[Number(self.activeName)].schId;
      self.showBindDialog = false;
      let isAdd = false;
      if (scheId === 0) {
        isAdd = true;
        scheId = await self.addScheduleService();
        self.paneList[Number(self.activeName)].schId = scheId;
        self.scheduleId = scheId;
        self.scheduleName = '';
        self.isAdd = false;
      } else {
        // scheId = self.scheduleId;
      }
      if (!isAdd) {
        await self.updateScheduleInfo();
      }
      const storeIdChecked = [];
      const storeIdUnchecked = [];
      let count = 0;
      self.storeList.forEach(item => {
        count += item.itemData.length;
        item.itemData.forEach(_item => {
          if (_item.checked) {
            storeIdChecked.push(_item.storeId);
          } else {
            storeIdUnchecked.push(_item.storeId);
          }
        });
      });

      const tempchecked = [];
      const obj = {
        scheduleId: scheId,
        storeIds: storeIdChecked
      };
      tempchecked.push(obj);
      console.log(tempchecked);
      const paramsBind = {
        items: tempchecked
      };
      console.log(paramsBind);

      const tempUnchecked = [];
      const unbindobj = {
        scheduleId: scheId,
        storeIds: storeIdUnchecked
      };
      tempUnchecked.push(unbindobj);

      const paramsUnBind = {
        items: tempUnchecked
      };
      console.log(paramsUnBind);
      let flag = false;
      if (storeIdChecked.length === count) {
        const resBind = await self.bindScheduleToStore(paramsBind);
        console.log(resBind);
        if (resBind.errMsg === 'Success' && resBind.errCode === 0) {
          flag = true;
        }
      } else if (storeIdUnchecked.length === count) {
        const resUnBind = await self.unbindScheToStore(paramsUnBind);
        console.log(resUnBind);
        if (resUnBind.errMsg === 'Success' && resUnBind.errCode === 0) {
          flag = true;
        }
      } else {
        const resBind = await self.bindScheduleToStore(paramsBind);
        const resUnBind = await self.unbindScheToStore(paramsUnBind);
        if (resBind.errMsg === 'Success' && resUnBind.errMsg === 'Success') {
          flag = true;
        }
      }
      if (flag) {
        const bindIdList = await self.getBindStoreList();
        self.storeCount = bindIdList.length;
        self.notify(`${this.$t('insSettingView.editSuss')} ${bindIdList.length}
                  ${this.$t('insSettingView.storesBound')}`, 'success', 3000);
      } else {
        self.notify(this.$t('insSettingView.bindFail'), 'warning', 3000);
        return false;
      }
      console.log(self.dayArray);
      self.getHasBoundStroeIds();
    },

    deleteCurTime(index) {
      console.log(index);
      const self = this;
      self.paneList[Number(self.activeName)].timeList.splice(index, 1);
      console.log(self.paneList[Number(self.activeName)].timeList);
      self.choiceDayTime(index);
    },

    async searchStore() {
      const self = this;
      self.showCityContent = false;
      self.serachVale = '';
      let params = {};
      params = {
        filter: {
          page: 0,
          size: 2000
        }
      };
      const resData = await self.getStoreData(params);
      const data = resData.content;
      console.log(data);
      self.getStoreByCity(data);

      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      if (count === self.storeList.length) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    choiceAll(val) {
      const self = this;
      self.storeList.forEach(item => {
        if (!item.disabled) {
          item.checked = val;
          item.itemData.forEach(_item => {
            if (!_item.disabled) {
              _item.checked = val;
            }
          });
        }
      });
    },

    choiceAllGroup(item) {
      const self = this;
      console.log(item);
      const obj = item;
      item.itemData.forEach(item => {
        if (!item.disabled) {
          item.checked = obj.checked;
        }
      });
      const arr = [];
      self.storeList.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      const disArr = [];
      self.storeList.forEach(_item => {
        if (_item.disabled) {
          disArr.push(_item);
        }
      });
      if (self.storeList.length === arr.length + disArr.length) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    choiceAllDevice(index, item) {
      const self = this;
      console.log(index);
      let count = 0;
      item.itemData.forEach(itemS => {
        if (itemS.checked) {
          count++;
        }
      });
      let disCount = 0;
      item.itemData.forEach(itemS => {
        if (itemS.disabled) {
          disCount++;
        }
      });
      if (count + disCount === item.itemData.length) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      if (disCount === item.itemData.length) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      let length = 0, countItem = 0;
      self.storeList.forEach(_item => {
        length += _item.itemData.length;
        _item.itemData.forEach(itemS => {
          if (itemS.checked) {
            countItem++;
          }
        });
      });
      if (length === countItem) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    getScheduleFromDB(params) {
      return new Promise((resolve, reject) => {
        getScheduleListService(params).then(res => {
          console.log(res);
          const errMsg = res.errMsg;
          const data = res.data;
          console.log(data);
          resolve(data);
        });
      });
    },

    async getScheduleList() {
      // get lps check schedule List
      const self = this;
      self.paneList = [];
      const params = {};
      params.category = 3; // lps schedule
      const data = await self.getScheduleFromDB(params);
      if (data.length !== 0) {
        data.forEach(item => {
          const name = item.name;
          if (self.scheduleList.indexOf(name) === -1) {
            self.scheduleList.push(name);
          }
        });
        const tempAllData = [];
        data.forEach(_item => {
          const tempScheduleData = {};
          tempScheduleData.name = _item.name;
          tempScheduleData.mode = _item.mode;
          tempScheduleData.modeDisabled = true;
          tempScheduleData.schId = _item.id; // 排程id
          // tempScheduleData.scheduleInfo = _item;
          tempScheduleData.enable = Boolean(_item.enable);
          const tempSchedules = _item.schedule;
          console.log(tempSchedules);
          const mode = _item.mode; // 0 daily, 1 weekly, 2 monthly
          const dayArray = [];
          const timeArray = [];
          const weeklyScheduleArray = [];
          tempSchedules.forEach(sche => {
            console.log(sche);
            const day = sche.day;
            dayArray.push(day);
            const tempWeeklySchedule = {};
            tempWeeklySchedule.day = day;
            const tempWeeklyTimeArr = [];
            const periodTimeArray = [];
            const periodHourArray = [];
            const period = sche.period.sort(self.getSortFun('from'));
            period.forEach(periods => {
              const from = periods.from;
              const to = periods.to;
              const fromHours = self.secondsToHour(from);
              const toHours = self.secondsToHour(to);
              if (timeArray.indexOf(fromHours) === -1) {
                const obj = {};
                obj.from = fromHours;
                obj.to = toHours;
                timeArray.push(obj);
                periodTimeArray.push([from, to]);
                tempWeeklyTimeArr.push(obj);
              } else {

              }
            });
            tempWeeklySchedule.timeArray = tempWeeklyTimeArr;
            weeklyScheduleArray.push(tempWeeklySchedule);
            tempWeeklySchedule.period = periodTimeArray;
            tempWeeklySchedule.dayArray = dayArray;
            tempWeeklySchedule.weekList = JSON.parse(JSON.stringify(self.weekList));
            console.log(tempWeeklySchedule);
          });
          const weeklySchedule = self.transformArray(weeklyScheduleArray);
          console.log(weeklySchedule);
          console.log(dayArray);
          tempScheduleData.timeArray = timeArray;

          const timeList = [];
          timeArray.forEach(_item => {
            const timeJson = {};
            timeJson.time = _item;
            timeJson.timeArray = JSON.parse(JSON.stringify(self.weeklyTimeArray));
            timeList.push(timeJson);
          });
          tempScheduleData.timeList = timeList;
          console.log(timeList);
          tempScheduleData.weeklySchedule = weeklySchedule;
          tempScheduleData.dayArray = dayArray;
          tempScheduleData.schedule = weeklySchedule;
          self.paneList.push(tempScheduleData);
        });

        if (self.isFirstLoad === true) {
          self.selectTab = self.paneList[0].name;
          self.scheduleId = self.paneList[0].schId;
          self.isFirstLoad = false;
          self.echoMonthAndWeek();
          self.searchStore();
        }
        self.getHasBoundStroeIds();
      } else if (data.length === 0) {
        self.scheduleName = self.$t('scheduleView.newSchedule');
        const scheduleInfo = {
          name: self.scheduleName,
          mode: 0,
          modeDisabled: false,
          schId: 0,
          dayArray: [],
          enable: false,
          to: -1,
          dueDays: 1,
          schedule: [{ dayArray: [], period: [], weekList: JSON.parse(JSON.stringify(self.weekList)) }],
          timeList: [{ time: { from: '', to: '' }, timeArray: JSON.parse(JSON.stringify(self.weeklyTimeArray)) }]
        };
        self.paneList.push(scheduleInfo);
        self.scheduleName = '防损计划';
        self.selectTab = '防损计划';
        self.scheduleId = 0;
        self.isDisabled = false;
        self.isAdd = true;
        self.searchStore();
      }
    },

    getSortFun(sortBy) {
      const ordAlpah = '>';
      const sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
      return sortFun;
    },

    transformArray(json) {
      const self = this;
      const map = {};
      for (const o of json) {
        if (!map.hasOwnProperty(JSON.stringify(o.timeArray))) {
          map[JSON.stringify(o.timeArray)] = o;
          const val = map[JSON.stringify(o.timeArray)].day;
          map[JSON.stringify(o.timeArray)].dayArray = [val];
        } else {
          map[JSON.stringify(o.timeArray)].dayArray.push(o.day);
        }
      }
      var arr = [];
      for (var item in map) {
        arr.push(map[item]);
      }
      arr.forEach(item => {
        item.dayArray.sort();
        item.weekList = JSON.parse(JSON.stringify(self.weekList));
      });
      return arr;
    },

    getHasBoundStroeIds() {
      const self = this;
      self.hasBoundStoreIds = [];
      self.paneList.forEach(item => {
        const sheduleId = item.schId;
        const mode = item.mode;
        if (mode !== 3) {
          const params = {};
          params.scheduleId = sheduleId;
          return new Promise((resolve, reject) => {
            getScheduleBindList(params).then(res => {
              const errMsg = res.errMsg;
              const data = res.data;
              data.forEach(_item => {
                if (self.hasBoundStoreIds.indexOf(_item) === -1) {
                  self.hasBoundStoreIds.push(_item);
                } else {
                  // do nothing
                }
              });
              resolve(data);
            });
          });
        }
      });
    },

    secondsToHour(second) {
      const changedData = [parseInt(second / 60 / 60), second / 60 % 60].join(':')
        .replace(/\b(\d)\b/g, '0$1');
      return changedData;
    },

    hourToSecond(hourStr) {
      const hourArray = hourStr.split(':');
      const changedSec = Number(hourArray[0]) * 3600 + Number(hourArray[1]) * 60;
      return changedSec;
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    updateScheduleInfo() {
      const params = {};
      const self = this;
      const tabIndex = Number(self.activeName);
      params.id = self.paneList[tabIndex].schId;
      params.name = self.paneList[tabIndex].name;
      params.comment = '防损计划';
      const mode = self.paneList[tabIndex].mode;
      params.enable = Number(self.paneList[tabIndex].enable);
      params.from = new Date().getTime();
      params.to = -1;
      params.notityTime = 0;
      const tempSchedule = [];
      // Daily Mode
      if (mode === 0) {
        // Daily Mode
        const tempPeriod = [];
        const timeSelect = self.paneList[tabIndex].timeList;

        timeSelect.forEach(item => {
          const timeFrom = item.time.from;
          const timeTo = item.time.to;
          if (timeFrom.length > 0) {
            const seconds = self.hourToSecond(timeFrom);
            const toSeconds = self.hourToSecond(timeTo);
            const obj = {};
            obj.from = seconds;
            obj.to = toSeconds;
            tempPeriod.push(obj);
          }
        });
        tempSchedule.push({
          'day': 1,
          'period': tempPeriod
        });
      } else if (mode === 1) {
        // Weekly Mode
        const schedule = self.paneList[tabIndex].schedule;
        schedule.forEach(item => {
          const timeArray = item.timeArray;
          const selectedWeek = item.dayArray.filter(item => item !== '-1');
          const period = item.period;
          selectedWeek.forEach(_item => {
            const timePeriod = [];
            const tempSche = {};
            period.forEach(_it => {
              const obj = {};
              obj.from = _it[0];
              obj.to = _it[1];
              timePeriod.push(obj);
            });
            tempSche.day = Number(_item);
            tempSche.period = timePeriod;
            tempSchedule.push(tempSche);
          });
        });
      } else {

      }
      params.schedule = tempSchedule;
      return new Promise((resolve, reject) => {
        updateSchedule(params).then(res => {
          const errMsg = res.errMsg;
          const data = res.errCode;
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      });
    },

    deleteScheduleBtn() {
      this.showDeleteDialog = true;
    },

    deleteSchedule() {
      const self = this;
      self.showDeleteDialog = false;
      if (self.scheduleId === 0) {
        self.initData();
      } else {
        const scheduleIds = [];
        scheduleIds.push(self.scheduleId);
        const params = {};
        params.scheduleIds = scheduleIds;
        return new Promise((resolve, reject) => {
          deleteScheduleService(params).then(res => {
            const errMsg = res.errMsg;
            const data = res.errCode;
            if (data === 0) {
              self.notify(self.$t('scheduleView.deleteSuss'), 'success', 3000);
            } else {
              self.notify(self.$t('scheduleView.deleteFail'), 'warning', 3000);
            }
            self.initData();
            resolve(data);
          });
        });
      }
    },

    initData() {
      const self = this;
      self.paneList.splice(Number(self.activeName), 1);
      self.activeName = '0';
      self.scheduleId = self.paneList[0].schId;
      self.echoMonthAndWeek();
      self.scheduleId = self.paneList[0].schId;
      self.getHasBoundStroeIds();
    },

    getSelectTimeArray() {
      const self = this;
      const date = self.$moment().format('YYYY-MM-DD');
      let startIime = self.$moment(date + ' 08:00:00').valueOf();
      const endTime = self.$moment(date + ' 23:45:00').valueOf();
      const timeArray = [];
      timeArray.push(self.$moment(startIime).format('HH:mm'));
      while (startIime < endTime) {
        startIime += 15 * 60 * 1000; // 每隔15分钟，生成时间间隔
        timeArray.push(self.$moment(startIime).format('HH:mm'));
      }
      timeArray.forEach(item => {
        const timeJson = {};
        timeJson.value = item;
        timeJson.name = item;
        timeJson.label = item;
        timeJson.disabled = false;
        self.weeklyTimeArray.push(timeJson);
      });
    },

    changeSelectMonth(val, item) {
      const self = this;
      self.selectMonth = Array.from(val)[0];
    },

    changeSelectWeek(val, item) {
      const self = this;
      item.dayArray = Array.from(val)[0];
      self.choiceWeek();
    },

    changeSelectWeekTime(val, item) {
      const self = this;
      item.timeArray = val;
    },

    getTimeArray(val, index) {
      const self = this;
      const tabIndex = Number(self.activeName);
      const period = self.paneList[tabIndex].schedule[index].period;
      self.paneList[tabIndex].schedule[index].period = [];
      val.forEach(item => {
        self.paneList[tabIndex].schedule[index].period.push(item.val);
      });
    }

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
    margin: 0;
    font-family: Roboto, Arial, Microsoft YaHei;
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
    padding: 20px calc(15/1920*100vw) 25px 15px;
    /*height: calc(180 / 1920 * 100vw);*/
    border: 1px solid $border;
    background-color: #fff;
    .el-schedule-header {
      @include point(margin-top, 10);
      .el-schedule-tabs {
        width: 98%;
        @include point(margin-left,10);
        .header-details{
          text-align: left;
          height: 50px;
          line-height: 50px;
          position: relative;
          span {
            font-size: calc(14 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
            margin-left: calc(20 / 1920 * 100vw);
          }
          .delete-time-btn{
            margin-right: calc(20 / 1920 * 100vw);
          }
          #en-span{
            font-size: calc(14 / 1920 * 100vw);
            margin-right: 0;
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
              height: 30px !important;
            }
          }
          /deep/ .el-input__inner{
            height: 30px !important;
            width: 200px;
            border-radius: 3px !important;;
          }
          /deep/ .el-select.el-select--mini{
            height: 30px !important;
            width: 200px;
          }
          .content{
            width: 199px;
          }
          /deep/ .content .input-class{
            width: 170px;
            overflow: hidden;
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
            .week-days{
              width: 200px;
            }
            .week-time .el-select.el-select--mini{
              width: 200px;
            }
            .el-input__inner{
              border-radius: 3px !important;
            }
          }
          .multi-range{
            display: inline-block;
            width: calc(700/1920*100vw);
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
        }
        .el-search-input{
          width: calc(200/1920*100vw);
          margin-left: calc(30/1920*100vw);
        }
        .el-search-input /deep/ .el-input__inner{
          border-radius: 30px;
          text-overflow: ellipsis;
        }
      }

      .el-bind-content {
        height: calc(415/1920*100vw);
        overflow: auto;
        background-color: #F6F7FB;
        border: 0.5px solid #e3e9f4;
        color: $black;
        .el-all-checkbox {
          margin: 20px auto 20px calc(25/1920*100vw);
          float: left;
          .all-device-title {
            font-size: calc(14/1920*100vw);
            margin-left: calc(20/1920*100vw);
          }
        }

        .device-group {
          clear: both;
          width: 100%;
          margin-top: 25px;
          margin-bottom: 25px;
          .device-all-checkbox {
            float: left;
            margin-left: calc(25/1920*100vw);
            .group-name {
              margin-left:calc(20/1920*100vw);
              font-size: 14px;
              font-weight: bold;
            }
          }
          .device-content{
            clear: left;
            text-align: left;
            margin-left:calc(55/1920*100vw);
            overflow: hidden;
            .device-detail{
              width: auto;
              margin-top: 20px;
              min-width: calc(220/1920*100vw);
              margin-left: calc(15/1920*100vw);
              margin-top: calc(15/1920*100vw);
              float: left;
              .device-name{
                @include point(margin-left, 0);
                font-size: 14px;
              }
            }
          }
        }
      }
      .enable-content{
        float: left;
        margin: 30px 0px 30px calc(20/1920*100vw);
        font-size: calc(14/1920*100vw);
        span{
          margin-right: calc(70/1920*100vw);
        }
      }
      .el-bind-footer{
        float: left;
        clear: both;
        position: relative;
        .el-btn-content{
          clear: both;
          .btn{
            //background-color: #f31d65;
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            padding: 0 0;
            width: calc(130/1920*100vw);
            float: left;
            .icon-quxiaolianjie{
              font-size: calc(24/1920*100vw);
              padding: calc(5/1920*100vw) 0;
            }
            color: #fff;
          }
        }
      }
      .el-bind-header{
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .el-header-title{
        font-size: 14px;
        font-weight: bold;
        color: $black;
        margin-top: 30px;
        margin-bottom: 20px;
        display: inline-block;
        margin-left: calc(20/1920*100vw);
        margin-right: calc(30/1920*100vw);
      }
      .select-info{
        float: right;
        margin-top: 20px;
      }
      .el-header-hr {
        margin-top: 30px;
        border-bottom: 1px solid #e3e9f4;
      }
      .choice-device{
        font-size: 12px;
        color: $tab;
        .icon-tishi1{
          font-size: calc(16/1920*100vw);
        }
      }
      .el-schedule-btns{
        position: absolute;
        @include point(right,30);
        z-index: 10;
        width: auto;
        @include point(top,20);
        display: flex;
        .el-add-btn{
          color: #fff;
          position: relative;
          margin-right: calc(20/1920*100vw);
          .icon-shanchu{
            font-size: calc(24/1920*100vw);
            padding:  calc(5/1920*100vw) 0;
          }
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
      }
    }
    .time-btn{
      color: #fff;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      width: 20px;
      min-width: 20px;
      justify-content: center;
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
      margin: 0 calc(20/1920*100vw);
      .el-icon-plus{
        font-size:12px;
      }
    }
    #patrltabs-content /deep/ .el-tabs__header.is-top{
      width: 70%;
    }
    #patrltabs-content /deep/ .el-tabs__header.is-top::after{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 143%;;
      z-index: 1;
      height: 2px;
      background-color: #E4E7ED;
    }
    #patrltabs-content /deep/ .el-tabs__item {
      padding: 0 5px;
      font-size: 14px;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: content-box;
    }
    #patrltabs-content /deep/ .el-tabs__active-bar{
      height: 4px;
    }
  }
  /deep/ .el-input--mini .el-input__inner{
    height: 30px;
    line-height: 30px;
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
  /deep/ .el-checkbox__label{
    font-size: calc(14/1920*100vw);
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
  .time-select.el-select .el-input--medium .el-input__inner{
    color: #606266;
  }
</style>
