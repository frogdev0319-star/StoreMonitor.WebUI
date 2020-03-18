<template>
  <el-row class="el-schedule-container" :style="{'min-height':varyWindowHeight-200+'px'}">
    <div class="el-schedule-header">
      <el-col :span="7" class="el-schedule-btns">
      </el-col>
      <el-dialog :title="generateScheduleLang('addSchedule')"
                 :visible.sync="showAddDialog" v-if="showAddDialog"
                 :append-to-body='true'
                 :close-on-click-modal="false"
                 width="28%"
                 top="35vh"
                 left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #dfe2e9;"/>
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;display: inline-block;  vertical-align: middle">
            <span style="display: inline-block;  vertical-align: middle">{{generateScheduleLang('scheduleName')}}</span>
            <el-input v-model="scheduleName" :placeholder="generateScheduleLang('inputPlaceholder')" size="mini" ref="scheduleName"
                      class="el-schedule-name"></el-input>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" @click="showAddDialog = false" size="mini">{{generateScheduleLang('cancel')}}</el-button>
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
          <hr style="border: 0.5px solid #dfe2e9;"/>
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block;  vertical-align: middle"></i>
            <span style="display: inline-block;  vertical-align: middle">{{generateScheduleLang('saveInfo')}}</span>
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
        <el-tabs v-model="activeName" @tab-click="handleClick" id="patrltabs-content">
          <el-tab-pane v-for="(item,index) in paneList" :name="index.toString()"
                       :key="index" :label="`${item.name}`">
            <el-col :span="24" class="header-details">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('scheduleName')}}</span>
              <el-input v-model="item.name"  :placeholder="generateScheduleLang('inputPlaceholder')" size="mini"  ref="scheduleName"
                        class="el-type" @input="(val)=>scheduluNameChange(val,item)"></el-input>
            </el-col>
            <el-col :span="24" class="header-details">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('scheduleType')}}</span>
              <el-select v-model="item.mode"  placeholder="选择类型" size="mini" :disabled="item.modeDisabled" @change="searchStore"
                         class="el-type" >
                <el-option
                  v-for="itemType in typeList"
                  :key="itemType.value"
                  :label="itemType.label"
                  :value="itemType.value">
                </el-option>
              </el-select>
              <el-checkbox v-if="item.mode === 3" v-model="item.execOnce">{{generateScheduleLang('execOnce')}}</el-checkbox>
              <div class="day-detail" v-if="item.mode == 1">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectOnDay')}}</span>
                <div class="day-content" @click="choiceWeek">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="weekValue" size="mini" id="elWeek" :placeholder="generateScheduleLang('select')" :readonly=true></el-input>
                  <i :class="showDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div :class="lang=='en'? 'en-week-panel': 'week-panel'" v-if="showWeekContent" @mouseleave="showWeekContent = false">
                  <div class="week-details">
                    <el-checkbox v-model="checkAllWeek" @change="allWeekChecked"></el-checkbox> <span>{{generateScheduleLang('all')}}</span>
                  </div>
                  <div class="week-details" v-for="(item,index) in weekList" :key="index">
                    <el-checkbox v-model="item.checked" @change="changeWeekItem(item)"></el-checkbox>
                    <span>{{item.name}}</span>
                  </div>
                </div>
                <!--<region-multi-select :options="weekList" :selected="selectWeek" :placeholder="generateScheduleLang('select')" :disabled="false" @changeInput="changeSelectWeek"></region-multi-select>-->
              </div>
              <div class="day-detail" v-if="item.mode == 2">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('execDays')}}</span>
                <div class="month-content" @click="choiceMonthly">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="monthValue" size="mini" id="elMonth" :placeholder="generateScheduleLang('select')" :readonly=true></el-input>
                  <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div :class="lang=='en'? 'en-month-panel':'month-panel'" v-if="showMonthContent" @mouseleave="showMonthContent = false">
                  <div class="month-details">
                    <el-checkbox v-model="checkAllMonth" @change="allMonthChecked"></el-checkbox> <span>{{generateScheduleLang('all')}}</span>
                  </div>
                  <div class="month-details" v-for="(itemMonth) in monthList" :key=" 'details-'+ itemMonth.value">
                    <el-checkbox v-model="itemMonth.checked" @change="changeMonthlyItem(itemMonth)"></el-checkbox>
                    <span>{{itemMonth.name}}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="24" class="header-details" v-if="item.mode== 3" v-for="(_item, _index) in item.schedule" :key="'mode3'+_index">
              <div class="self-detail">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectMonth')}}</span>
                <div class="month-content" @click="choiceSelfDefineMonth(_index)">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="_item.month" size="mini" id="elMonth" :placeholder="generateScheduleLang('select')" :readonly=true></el-input>
                  <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div :class="lang=='en'? 'en-self-def-panel':'self-def-panel'" v-if="_item.showSelfDefineMonth" @mouseleave="_item.showSelfDefineMonth = false">
                  <div class="month-details" v-for="(itemDay,indexs) in selfMonthList" :key="indexs">
                    <el-checkbox v-model="itemDay.checked" @change="changeSelfDefineMonthItem(_index, indexs)" :disabled="itemDay.disabled"></el-checkbox>
                    <span>{{itemDay.name}}</span>
                  </div>
                </div>
              </div>
              <div class="day-detail">
                <!--<span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectDate')}}</span>-->
                <div class="month-content" @click="choiceSelfMonth(_index)">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="_item.monthValue" size="mini" id="elMonth" :placeholder="generateScheduleLang('select')" :readonly=true></el-input>
                  <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div :class="lang=='en'? 'en-self-month-panel':'self-month-panel'" v-if="_item.showMonthContent" @mouseleave="_item.showMonthContent = false">
                  <div class="month-details" v-for="(itemDay,indexs) in monthList" :key="indexs">
                    <el-checkbox v-model="itemDay.checked" @change="changeSelfMonthItem(_index)"></el-checkbox>
                    <span>{{itemDay.name}}</span>
                  </div>
                </div>
                <span class="delete-time-btn" size="mini" v-if="item.schedule.length > 1" style="margin: 0 20px 0 30px"
                      @click="deleteMonthAndDays(_index)"><i class="el-icon-error"></i></span>
                <el-button class="time-btn" size="mini" @click="addMonth" type="primary"
                           v-if="!showAddMonth && (_index == item.schedule.length-1)"><i class="el-icon-plus"></i></el-button>
              </div>
            </el-col>
            <el-col :span="24" class="header-details" v-if="showAddMonth && item.mode == 3">
              <div class="self-detail">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectMonth')}}</span>
                <div class="month-content" @click="choiceSelfDefineMonth(-1)">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="selfMonth" size="mini" id="elMonth" :placeholder="generateScheduleLang('select')" :readonly=true></el-input>
                  <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div :class="lang=='en'? 'en-self-def-panel':'self-def-panel'" v-if="showSelfDefineMonth" @mouseleave="showSelfDefineMonth = false">
                  <div class="month-details" v-for="(itemDay,indexs) in selfMonthList" :key="indexs">
                    <el-checkbox v-model="itemDay.checked" @change="changeSelfDefineMonthItem(-1, indexs)" :disabled="itemDay.disabled"></el-checkbox>
                    <span>{{itemDay.name}}</span>
                  </div>
                </div>
              </div>
              <div class="day-detail">
                <!--<span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectDate')}}</span>-->
                <div class="month-content" @click="choiceMonth">
                  <div class="input-arrow-panel"></div>
                  <el-input v-model="monthValue" size="mini" id="elMonth" :placeholder="generateScheduleLang('select')" :readonly=true></el-input>
                  <i :class="showMonthDrap?'el-icon-arrow-up':'el-icon-arrow-down'" class='icon-input'></i>
                </div>
                <div :class="lang=='en'? 'en-self-month-panel':'self-month-panel'" v-if="showMonthContent" @mouseleave="hiddenSelfMonthPanel">
                  <div class="month-details" v-for="(it,ind) in monthList" :key="ind">
                    <el-checkbox v-model="it.checked" @change="changeMonthItem(it)"></el-checkbox>
                    <span>{{it.name}}</span>
                  </div>
                </div>
                <span class="delete-time-btn" size="mini"
                      @click="deleteMonthAndDays(-1)"><i class="el-icon-error"></i></span>
                <el-button class="time-btn" size="mini" @click="addMonth" type="primary">
                  <i class="el-icon-plus"></i>
                </el-button>
              </div>
            </el-col>
            <el-col :span="24" class="header-details"
                    :key="index">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('notifyTime')}}</span>
              <el-time-picker
                class="time-select"
                v-model="item.notifyTime"
                :clearable="false"
                :placeholder="generateScheduleLang('selectTime')"
                size="mini"
                format="HH:mm"
              >
              </el-time-picker>
              <el-tooltip :popper-class="toolTipClass" class="item" effect="dark"
                          placement="bottom-end">
                <div slot="content">{{generateScheduleLang('notifyInfo')}}</div>
                <i class="iconfont icon-bangzhu iconbangzhu"></i>
              </el-tooltip>
              <el-checkbox v-model="item.ifNotifyOneDay">{{generateScheduleLang('notifyOneDayBefore')}}</el-checkbox>
            </el-col>
            <el-col :span="24" class="header-details">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('dueDays')}}</span>
              <el-select v-model="item.dueDays"  placeholder="选择执行时效" size="mini"
                         class="el-type" >
                <el-option
                  v-for="item in dueDaysList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="24" class="el-header-hr"></el-col>
            <el-col :span="24" class="el-bind-header">
              <span class="el-header-title">{{generateScheduleLang('bindStore')}}</span>
              <div class="select-info">
                <span class="choice-device">
                <i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"></i>
                {{generateScheduleLang('hasBind')}}{{storeCount}}{{generateScheduleLang('stores')}}
              </span>
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
            </el-col>
            <el-col :span="24">
              <div class="el-bind-content" :style="{'min-height':varyWindowHeight*0.44+'px'}">
                <div  class="el-all-checkbox" v-if="storeList.length!=0">
                  <el-checkbox v-model="allData" :disabled="allDisabled"  @change="choiceAll"></el-checkbox>
                  <span class="all-device-title">{{generateScheduleLang('bindAllStore')}}</span>
                </div>
                <div class="device-group" v-for="(item,index) in storeList" :key="index">
                  <div class="device-all-checkbox">
                    <div style="display: block">
                      <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="choiceAllGroup(item)"></el-checkbox>
                      <span class="group-name">{{item.cityName}}</span>
                    </div>
                  </div>
                  <div class="device-content" >
                    <div class="device-detail" v-for="(_item,_index) in item.itemData" :key="_index">
                      <el-checkbox v-model="_item.checked" :disabled="_item.disabled"
                                   @change="choiceAllDevice(index,item,_index,_item)" style="margin-right: 20px"></el-checkbox>
                      <span class="device-name" :style="{'color': _item.disabled ? '#7d8cad':''}">{{_item.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="enable-content">
                <span>{{generateScheduleLang('enable')}}</span>
                <el-switch
                v-model="item.enable">
                </el-switch>
              </div>
              <div class="el-bind-footer">
                <div class="el-btn-content">
                  <el-button :disabled="storeList.length==0" class="btn" size="mini" type="primary" @click="bindScheduleBtn">
                    <span>{{generateScheduleLang('saveAndApply')}}</span>
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
            <hr style="border: 0.5px solid #dfe2e9;"/>
            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
              <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block;  vertical-align: middle"></i>
              <span style="display: inline-block;  vertical-align: middle">{{generateScheduleLang('confirmBind')}}</span>
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
      <dialog-vue :dialog-title='selectWeekObj.title' :show-info='selectWeekObj.showInfo' :is-warning='selectWeekObj.isWarning' :dialog-closed='selectWeekObj.dialogCosed' @confirmed='noWeekDialog' @canceled='cancelNoWeek'></dialog-vue>
      <dialog-vue :dialog-title='selectTimeObj.title' :show-info='selectTimeObj.showInfo' :is-warning='selectTimeObj.isWarning' :dialog-closed='selectTimeObj.dialogCosed' @confirmed='noTimeDialog' @canceled='cancelNoTime'></dialog-vue>
      <dialog-vue :dialog-title='selectSelfMonthObj.title' :show-info='selectSelfMonthObj.showInfo' :is-warning='selectSelfMonthObj.isWarning' :dialog-closed='selectSelfMonthObj.dialogCosed' @confirmed='noSelfMonthDialog' @canceled='cancelNoSelfMonth'></dialog-vue>
    </div>
  </el-row>
</template>

<script>
  import {generateScheduleLang} from '@/api/i18n'
  import {getScheduleBindList, addNewSchedule, getScheduleListService, bindScheduleAndStore, unbindScheduleAndStore, updateSchedule,deleteScheduleService} from '@/api/schedule'
  import {getStoreList} from '@/api/store'
  import DialogVue from '@/components/DialogVue.vue'
  import Nape from "../../../api/ApiPath";
  import util from '@/common/util'
  import filterString from '@/common/filterString'
  import RegionMultiSelect from "@/components/RegionMultiSelect";

  export default {
    name: "RemoteDetail",
    components:{
      RegionMultiSelect,
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
        scheduleList: ['点检排程一'],
        paneList:[],
        timeArray: ['08:00'], //选中的执行时间
        lang: this.$i18n.locale ,
        hasSelectMonth: false,
        bigMonthList:[
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
        monthList: [],
        value: '',
        input4:'',
        checked:false,
        checkAll: false,
        isIndeterminate: true,
        checkAll1: false,
        activeName: '0',
        curType: 1,
        typeList:[
          {
            value: 1,
            label: this.$t('scheduleView.weekly')
          },
          {
            value: 2,
            label: this.$t('scheduleView.monthly')
          },
          {
            value: 3,
            label: this.$t('scheduleView.userDefined')
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
            'label': this.$t('scheduleView.mon'),
            'value': 1,
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.tues'),
            'label': this.$t('scheduleView.tues'),
            'value': 2,
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.wed'),
            'label': this.$t('scheduleView.wed'),
            'value': 3,
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.thur'),
            'label': this.$t('scheduleView.thur'),
            'value': 4,
          },
          {
            'checked': false,
            'name':this.$t('scheduleView.fri'),
            'label':this.$t('scheduleView.fri'),
            'value': 5,
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.sat'),
            'label': this.$t('scheduleView.sat'),
            'value': 6,
          },
          {
            'checked': false,
            'name': this.$t('scheduleView.sun'),
            'label': this.$t('scheduleView.sun'),
            'value': 7,
          },

        ],
        weekValue:  this.$t('scheduleView.everyDay'),
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
        selfMonthList: [
          {
            'checked': false,
            'disable': false,
            'name': '1',
            'value': '1',
          },
          {
            'checked': false,
            'disable': false,
            'name': '2',
            'value': '2',
          },
          {
            'checked': false,
            'disable': false,
            'name': '3',
            'value': '3',
          },
          {
            'checked': false,
            'disable': false,
            'name': '4',
            'value': '4',
          },
          {
            'checked': false,
            'disable': false,
            'name': '5',
            'value': '5',
          },
          {
            'checked': false,
            'disable': false,
            'name': '6',
            'value': '6',
          },
          {
            'checked': false,
            'disable': false,
            'name': '7',
            'value': '7',
          },
          {
            'checked': false,
            'disable': false,
            'name': '8',
            'value': '8',
          },
          {
            'checked': false,
            'disable': false,
            'name': '9',
            'value': '9',
          },
          {
            'checked': false,
            'disable': false,
            'name': '10',
            'value': '10',
          },
          {
            'checked': false,
            'disable': false,
            'name': '11',
            'value': '11',
          },
          {
            'checked': false,
            'disable': false,
            'name': '12',
            'value': '12',
          },
        ], //自定义模式月份
        showSelfMonthContent: false,
        showSelfMonthDrap: false,
        selfMonth: '',
        toolTipClass: 'page-login-toolTipClass',
        schedule: [
          {
            month: '',
            days: [],
            showMonthContent: false,
          }
        ],
        showAddMonth: false,
        dueDaysList: [
          {
            value: 1,
            name: this.$t('scheduleView.today')
          },
          {
            value: 2,
            name: `2${this.$t('scheduleView.days')}`
          },
          {
            value: 3,
            name: `3${this.$t('scheduleView.days')}`
          },
          {
            value: 7,
            name: `7${this.$t('scheduleView.days')}`
          },
        ],
        execOnce: false, //是否执行一次
        scheduleSelf: [], //自定义排程格式（月份和日期数组）
        notifyTime: '', //执行时间
        dueDays: -1, //执行时效
        hasBoundStoreIds: [], //已经绑定过周、月模式的门店id
        selectWeekObj:{
          title:'提示',
          showInfo:'请选择执行日期！',
          isWarning:false,
          dialogCosed:false
        },
        selectTimeObj:{
          title:'提示',
          showInfo:'请选择提醒时间！',
          isWarning:false,
          dialogCosed:false
        },
        selectSelfMonthObj:{
          title:'提示',
          showInfo:'请选择自定义模式下的月份和日期！',
          isWarning:false,
          dialogCosed:false
        },
        checkAllWeek: false,
        checkAllMonth: false,
        isAdd: false,
        showSelfDefineMonth: false, //是否显示自定义月份框
      }
    },

    methods: {
      generateScheduleLang,
      noWeekDialog(val){
        let self=this;
        self.selectWeekObj.dialogCosed=false;
      },
      cancelNoWeek(val){
        let self=this;
        self.selectWeekObj.dialogCosed=false;
      },
      noTimeDialog(){
        let self=this;
        self.selectTimeObj.dialogCosed=false;
      },
      cancelNoTime(val){
        let self=this;
        self.selectTimeObj.dialogCosed=false;
      },
      noSelfMonthDialog(){
        let self=this;
        self.selectSelfMonthObj.dialogCosed=false;
      },
      cancelNoSelfMonth(val){
        let self=this;
        self.selectSelfMonthObj.dialogCosed=false;
      },
      hiddenSelfMonthPanel(){
        let self = this;
        self.showMonthContent = false;
        if(self.hasSelectMonth && !self.showMonthContent){
          console.log('选择完毕')
          self.hasSelectMonth = false;
          let month = self.selfMonth;
          let days = self.monthValue;
          let obj = {};
          obj.month = month;
          obj.showMonthContent = false;
          obj.monthValue = days;
          obj.showSelfDefineMonth = false;
          let daysArray = days.split(',');
          obj.day = daysArray.slice(0,daysArray.length-1); //去除最后一个逗号
          let tabIndex = Number(self.activeName);
          let actPanList = self.paneList[tabIndex];
          actPanList.schedule.push(obj);
          console.log(actPanList.schedule);
          self.showAddMonth = false;
          self.selfMonth = '';
          self.monthValue = '';
        }
      },
      monthChange(index){
        let monthList = [
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
        ];
        console.log(index)
        let self = this;
        let month = 0;
        if(index == -1){
          month = self.selfMonth;
        }
        else{
          month = self.paneList[Number(self.activeName)].schedule[index].month;
        }
        console.log(month)
        let year = self.$moment().format('YYYY');
        let days = self.$moment([year, month-1]).daysInMonth();
        console.log(days)
        self.monthList = self.bigMonthList.slice(0, days);
        console.log(self.monthList )
      },
      addScheduleButton() {
        let self = this;
        self.scheduleName = '';
        self.showAddDialog = true;
      },
      deleteScheduleButton() {
        let self = this;
        self.showDeleteDialog = true;
      },
      bindScheduleBtn(){
        let self = this;
        let tabIndex = Number(self.activeName);
        let mode = self.paneList[tabIndex].mode;
        let notifyTime = self.paneList[tabIndex].notifyTime;
        let dayArray = [];
        if(mode==1){
          dayArray = self.selectWeek;
        }
        else if(mode==2){
          dayArray = self.selectMonth;
        }
        let name = self.paneList[tabIndex].name;
        let schedule = self.paneList[tabIndex].schedule;
        console.log(schedule)
        if(name == ''){
          self.notify(self.$t('scheduleView.emptyName'), 'warning',3000);
          self.$refs.scheduleName[tabIndex].focus();
          return false;
        }
        // if(notifyTime == ''){
        //   self.notify(self.$t('scheduleView.emptyNotifyTime'), 'warning',3000);
        //   return false;
        // }
        console.log(dayArray)
        console.log(self.selectWeek);

        if(mode==1 || mode == 2){
          //周模式
          if(dayArray.length == 0 ){
            self.notify(self.$t('scheduleView.emptyDate'), 'warning',3000);
            return false;
          }
        }
        if(mode == 3){
          //自定义模式
          let lackMonth = false;
          let lackDay = false;
          schedule.forEach( item =>{
            if(item.month == ''){
              lackMonth = true;
            }
            else if(item.day.length == 0){
              lackDay = true;
            }
          })
          console.log(lackMonth + '..' + lackDay);
          if(lackMonth){
            self.notify(self.$t('scheduleView.emptyMonth'), 'warning',3000);
            return false;
          }
          else if(lackDay){
            self.notify(self.$t('scheduleView.emptyDate'), 'warning',3000);
            return false;
          }
        }
        self.showBindDialog = true;
      },
      allWeekChecked(val){
        let self = this;
        console.log(val);
        let selectedWeek = [];
        if(val){
          self.weekList.forEach(item=>{
            item.checked = true;
            selectedWeek.push(item.value)
          })
        }
        else{
          self.weekList.forEach(item=>{
            item.checked = false
          })
        }
        self.weekValue = val ? this.$t('scheduleView.everyDay') : '';
        self.selectWeek = val ? selectedWeek: [] ;
        console.log(self.weekValue);
        console.log(self.selectWeek)
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
        let self = this;
        self.activeName = val.index;
        console.log(self.activeName)
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
        self.selectWeek = [];
        self.selectMonth = [];
        self.dayArray =  self.paneList[tabIndex].dayArray;
        self.echoMonthAndWeek();
        self.showMonthContent = false;
        self.showWeekContent = false;
        self.scheduleId = self.paneList[tabIndex].schId;
        //self.enable = self.paneList[tabIndex].enable;
        self.$emit('sendActiveName', self.activeName)
        self.searchStore();
      },

      addMonth(){
        let self = this;
        self.showAddMonth = true;
        self.monthValue = '';
        self.monthList.forEach(item=>{
          item.checked = false;
        })
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
              self.weekValue = self.$t('scheduleView.everyDay');
              self.checkAllWeek = true;
            }
            else {
              self.checkAllWeek = false;
            }
          }
          else{
            self.checkAllWeek = false;
          }
        }
        else if(type == 2){
          self.monthList = self.bigMonthList.slice(0, 28); // 月模式1-28号
          let selectedMonth = self.dayArray;
          self.selectMonth = selectedMonth;
          console.log(selectedMonth + 'selectedMonth');
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
              self.checkAllMonth = true;
            }
            else {
              self.checkAllMonth = false;
            }
          }
          else {
            self.checkAllMonth = false;
          }
        }
        else if(type == 3){
          self.monthList = self.bigMonthList;
          let selectedMonth = self.dayArray;
          self.selectMonth = selectedMonth;
          console.log(selectedMonth + 'selectedMonth');
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
        console.log(self.selectWeek)
        self.dayArray = self.selectWeek;
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
      },
      choiceMonthly(){
        let self = this;
        self.showMonthContent = !self.showMonthContent;
      },
      changeMonthlyItem(item){
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
        self.dayArray = self.selectMonth;
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
        else{
          self.monthValue = '';
          self.checkAllMonth = false;
        }
      },
      //自定义模式下月份
      choiceSelfDefineMonth(index){
        let self = this;
        console.log(index);
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        self.selfMonthList.forEach(item=>{
          item.checked = false;
          item.disabled = false;
        })
        if(index == -1){
          self.showSelfDefineMonth = true;
          actPanList.schedule.forEach(item=>{
            self.selfMonthList.forEach(_item=>{
              if(item.month == _item.value){
                _item.disabled = true;
              }
              if(self.selfMonth == _item.value){
                _item.checked = true;
              }
            });
          });
        }
        else{
          let timeJsonList = actPanList.schedule[index];
          console.log(actPanList.schedule);
          timeJsonList.showSelfDefineMonth = !timeJsonList.showSelfDefineMonth;
          actPanList.schedule.forEach(_item=>{
            self.selfMonthList.forEach(item => {
              if(_item.month == item.value){
                item.disabled = true;
              }
              if (item.value == timeJsonList.month) {
                item.checked = true;
                item.disabled = false;
              }
            });
          });
        }
      },
      //更新时间选择
      changeSelfDefineMonthItem(index, monthIndex){
        let self = this;
        console.log(monthIndex)
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        let timeJsonList = actPanList.schedule[index];
        console.log(actPanList.schedule);
        if(index != -1){
          self.selfMonthList.forEach(item=>{
            item.checked = false;
          })
          timeJsonList.month = self.selfMonthList[monthIndex].value;
          self.selfMonthList[monthIndex].checked = true;
          console.log(actPanList.schedule);
        }
        else{
          //新增时间
          self.selfMonthList.forEach(item=>{
            item.checked = false;
          })
          self.selfMonth = self.selfMonthList[monthIndex].value;
          self.selfMonthList[monthIndex].checked = true;
        }
        //调用获取日期的函数
        self.monthChange(index);
      },
      //增加时间
      addDayTimeToList(){
        let self = this;
        self.showDayTimeContent = false;
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        let timeJsonList = actPanList.timeList;
        let timeJson = {};
        timeJson.time = self.dayTime;
        timeJson.showTimeContent = false;
        timeJsonList.push(timeJson);
        self.dayTime = '';
        self.showAddTime = false;
        console.log(timeJsonList)
      },
      choiceSelfMonth(index){
        let self = this;
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        actPanList.schedule[index].showMonthContent = !actPanList.schedule[index].showMonthContent;
        self.monthList.forEach(item => {
          item.checked = false;
          if(actPanList.schedule[index].monthValue ==  self.$t('scheduleView.everyDay')){
            item.checked = true;
          }
          else{
            actPanList.schedule[index].monthValue.split(',').forEach(_item=>{
              if (item.value == _item) {
                item.checked = true;
              }
            })
          }
        })
      },
      changeSelfMonthItem(index){
        let self = this;
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
        let tabIndex = Number(self.activeName);
        let actPanList = self.paneList[tabIndex];
        if (daysStr.length != 0) {
          actPanList.schedule[index].monthValue = daysStr;
          let daysArray = daysStr.split(',');
          actPanList.schedule[index].day = daysArray.slice(0,daysArray.length-1); //去除最后一个逗号
          console.log(actPanList.schedule[index].monthValue)
          if (count == self.monthList.length) {
            actPanList.schedule[index].monthValue = self.$t('scheduleView.everyDay');
          }
        }
        else{
          actPanList.schedule[index].monthValue = '';
          actPanList.schedule[index].day = [];
        }
      },
      choiceMonth(){
        let self = this;
        self.showMonthContent = !self.showMonthContent;
        // self.monthList.forEach(item => {
        //   item.checked = false;
        // })

        //self.showMonthDrap = true;
      },
      changeMonthItem(){
        let self = this;
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
        if (daysStr.length != 0) {
          self.monthValue = daysStr;
          if (count == self.monthList.length) {
            self.monthValue = self.$t('scheduleView.everyMonth');
          }
        }
        self.hasSelectMonth = true;
      },

      addScheduleService() {
        let params = {};
        let self = this;
        let tabIndex = Number(self.activeName);
        params.name = self.paneList[tabIndex].name;
        params.comment = '远程巡检计划';
        params.category = 0;
        params.mode = self.paneList[tabIndex].mode;
        params.enable = Number(self.paneList[tabIndex].enable);
        let execOnce = self.paneList[tabIndex].execOnce;
        let year = self.$moment().format('YYYY'); //年
        params.from = self.$moment(year).startOf('year').valueOf();
        params.to =  -1;
        self.paneList[tabIndex].from = params.from;
        self.paneList[tabIndex].to =  params.to;
        self.paneList[tabIndex].modeDisabled = true;
        if(self.paneList[tabIndex].notifyTime.length > 0){
          params.notifyTime =  self.hourToSecond(self.paneList[tabIndex].notifyTime);
        }
        params.dueDays = self.paneList[tabIndex].dueDays; //执行时效
        let ifNotifyOneDay = self.paneList[tabIndex].ifNotifyOneDay;
        if(ifNotifyOneDay){
          params.aheadNotification = 86400; //提前一天的秒数
        }
        else{
          params.aheadNotification = 0; //不提前通知
        }
        let tempSchedule = [];
        if(params.mode == 1){
          //周模式
          let selectedWeek = self.selectWeek;
          self.paneList[tabIndex].dayArray = selectedWeek;
          selectedWeek.forEach(item=>{
            console.log(item);
            let timePeriod = [];
            let tempSche = {};
            tempSche.day = Number(item);
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
        }
        else if(params.mode == 2){
          //月模式
          let selectedMonth = self.selectMonth;
          self.paneList[tabIndex].dayArray = selectedMonth;
          selectedMonth.forEach(item=>{
            console.log(item);
            let tempSche = {};
            tempSche.day = Number(item);
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
        }
        else if(params.mode = 3){
          //自定义模式
          if(execOnce){
            //勾选，执行一次,当年最后一天的时间
            params.to = self.$moment().endOf('year').valueOf()
          }
          else{
            params.to = -1; //执行多次
          }
          let selfSche = self.paneList[tabIndex].schedule;
          console.log(selfSche);
          let selectedMonth = self.selectMonth; //选择的日期
          selfSche.forEach(item=>{
            let month = item.month; //选择的月份
            let days = item.day; //选择的日期数组
            days.forEach(_item=>{
              let dayOfYear = self.$moment([year, month-1, _item]).dayOfYear();
              let obj = {};
              obj.day = dayOfYear;
              tempSchedule.push(obj);
            })
          })
          console.log(tempSchedule);
        }
        params.schedule = tempSchedule;
        console.log(params.schedule);

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
        self.scheduleName = self.$t('scheduleView.newSchedule');
        self.showAddDialog = false;
        self.checkAllWeek = false;
        self.checkAllMonth = false;
        let addInfo = {
          name: self.scheduleName,
          mode: 1,
          schId: 0,
          enable: 0,
          to: -1,
          dayArray: [],
          timeArray: ['8:00'],
          dueDays: 1,
          schedule: [{month: '', day: [], monthValue: '', showMonthContent: false,showSelfDefineMonth: false}],
          notifyTime: '',
          execOnce: false,
          ifNotifyOneDay: false,
          modeDisabled: false
        };
        self.paneList.push(addInfo);
        let pane = self.paneList;
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
        self.dayArray = [];
        self.isAdd = true,
        console.log(self.paneList)
        self.$emit('sendActiveName', self.activeName)
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
        let mode = self.paneList[Number(self.activeName)].mode;
        console.log(mode + "..." + mode);
        temp.forEach(item => {
          let groupObj = {};
          groupObj.province = item.province;
          groupObj.cityName = item.city;
          let _temp = [];
          let _tempCount = 0;
          let _tempDisCount = 0;
          item.store.forEach(_item => {
            let _obj = {};
            // if (bindStoreId.indexOf(_item.storeId) == -1) {
            //   _obj.checked = false;
            //   _obj.disabled = false;
            // }
            // else {
            //   _obj.checked = true;
            //   _obj.disabled = false;
            //   _tempCount++;
            // }
            if(mode === 3){
              if (bindStoreId.indexOf(_item.storeId) == -1) {
                _obj.checked = false;
                _obj.disabled = false;
              }
              else {
                _obj.checked = true;
                _obj.disabled = false;
                _tempCount++;
              }
            }
            else{
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
        // if(totalConut == self.storeList.length){
        //   self.allDisabled = false;
        // }
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
        if(self.isAdd){
          isAdd = true;
          scheId = await self.addScheduleService();
          self.paneList[Number(self.activeName)].schId = scheId;
          self.scheduleName = ''
          self.scheduleId = scheId;
          self.isAdd = false;
        }
        else{
          scheId = self.paneList[Number(self.activeName)].schId;
        }
        if(!isAdd){
          await self.updateScheduleInfo();
        }
        let storeIdChecked=[];
        let storeIdUnchecked=[];
        let count=0;
        let mode = self.paneList[Number(self.activeName)].mode;
        self.storeList.forEach(item=>{
          count+=item.itemData.length;
          item.itemData.forEach(_item=>{
            if(_item.checked){
              storeIdChecked.push(_item.storeId);
            }
            else{
              storeIdUnchecked.push(_item.storeId);
              console.log(self.hasBoundStoreIds);
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

        self.dayArray = this.paneList[Number(self.activeName)].dayArray;
        console.log(self.dayArray)
        //self.searchStore();
        self.getHasBoundStroeIds();
      },
      deleteMonthAndDays(index) {
        console.log(index)
        let self = this;
        if(index == -1){
          self.showAddMonth = false;
        }
        else{
          self.paneList[Number(self.activeName)].schedule.splice(index, 1); //删除时间
        }
      },

      async searchStore() {
        let self = this;
        let mode = self.paneList[Number(self.activeName)].mode;
        if(mode == 2){
          //月模式
          self.monthList = self.bigMonthList.slice(0, 28); // 月模式1-28号
        }
        else{
          self.monthList = self.bigMonthList;
        }
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
        console.log(val)
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
        params.category = 0; //point check schedule
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
            tempScheduleData.modeDisabled = true;
            tempScheduleData.schId = _item.id; //排程id
            tempScheduleData.enable = _item.enable;
            tempScheduleData.notifyTime = (_item.notifyTime == -1)? '' : self.secondsToHour(_item.notifyTime);
            tempScheduleData.from = self.$moment(_item.from).format('YYYY'); //从from获取年
            let aheadNotification = _item.aheadNotification; //是否提前一天通知

            if(aheadNotification == 86400){
              tempScheduleData.ifNotifyOneDay = true;
            }
            else{
              tempScheduleData.ifNotifyOneDay = false;
            }
            tempScheduleData.dueDays = _item.dueDays;
            tempScheduleData.execOnce = (_item.to == -1) ? false: true;
            let tempSchedules = _item.schedule;
            console.log(tempSchedules)
            let mode = _item.mode; // 0 daily, 1 weekly, 2 monthly, 3 自定义
            let dayArray = []; //存放1，2两种类型选中的时间
            let timeArray = []; //存放3种类型的执行时间
            let scheduleSelf = []; //存放自定义的月份和时间
            tempSchedules.forEach(sche=>{
              console.log(sche)
              let day = sche.day;
              dayArray.push(day)
              if(mode == 3){
                let tempArray = [];
                dayArray.forEach(item=>{
                  let monthDay = self.$moment([tempScheduleData.from]).dayOfYear(item).format('M-D');
                  tempArray.push(monthDay);
                })
                //将数组按照月份分组，日组成数组
                console.log(tempArray)
                scheduleSelf = self.formatMonthDay(tempArray);
                scheduleSelf.forEach(_item=>{
                  _item.showMonthContent = false; //时间选择面板默认不显示
                  _item.showSelfDefineMonth = false;
                  _item.monthValue = _item.day.join(',');
                })
                // self.scheduleSelf = scheduleSelf;
                // console.log(self.scheduleSelf);
                tempScheduleData.schedule = scheduleSelf;
              }
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
            self.isFirstLoad = false;
            self.dayArray = this.paneList[Number(self.activeName)].dayArray;
            self.selectTab = this.paneList[Number(self.activeName)].name;
            console.log(self.dayArray)
            self.echoMonthAndWeek() //回显初次加载时选择的月和周
            self.searchStore();
          }
          console.log(self.paneList);
          self.getHasBoundStroeIds();
        }
        else if(data.length == 0){
          console.log(self.paneList)
          let addInfo = {
            name: '远程巡检排程一',
            mode: 1,
            schId: 0,
            enable: 0,
            to: -1,
            dayArray: [],
            timeArray: ['8:00'],
            dueDays: 1,
            schedule: [{month: '', day: [], monthValue: '', showMonthContent: false,showSelfDefineMonth: false}],
            notifyTime: '',
            execOnce: false,
            ifNotifyOneDay: false,
            modeDisabled: false
          };
          self.paneList.push(addInfo);
          self.scheduleName = "远程巡检排程一";
          self.selectTab = "远程巡检排程一";
          self.scheduleId = 0;
          self.isDisabled = false;
          self.isAdd = true;
          self.searchStore();
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
        let changedData = [parseInt(second / 60 / 60), second / 60 % 60].join(":")
          .replace(/\b(\d)\b/g, "0$1");
        return changedData;
      },
      hourToSecond(hourStr){
        // 时间字符串转化为距离零点的秒数
        let hourArray = hourStr.split(':');
        let changedSec = Number(hourArray[0]) * 3600 + Number(hourArray[1]) * 60;
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
        params.enable = Number(self.paneList[tabIndex].enable);
        params.mode = self.paneList[tabIndex].mode;
        let execOnce = self.paneList[tabIndex].execOnce;
        let ifNotifyOneDay = self.paneList[tabIndex].ifNotifyOneDay;
        if(ifNotifyOneDay){
          params.aheadNotification = 86400; //提前一天的秒数
        }
        else{
          params.aheadNotification = 0; //不提前通知
        }
        let year = self.paneList[tabIndex].from; //年self.paneList[tabIndex].from; //年
        params.from = self.$moment(year).startOf('year').valueOf();
        params.to =  -1;
        if(self.paneList[tabIndex].notifyTime !== null){
          params.notifyTime = self.hourToSecond(self.paneList[tabIndex].notifyTime);
        }
        else{
          params.notifyTime = -1;
        }
        params.dueDays = self.paneList[tabIndex].dueDays; //执行时效
        let tempSchedule = [];
        if(params.mode == 1){
          //周模式
          let selectedWeek = self.selectWeek;
          self.paneList[tabIndex].dayArray = self.selectWeek;
          selectedWeek.forEach(item=>{
            let tempSche = {};
            tempSche.day = Number(item);
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
        }
        else if(params.mode == 2){
          //月模式
          let selectedMonth = self.selectMonth;
          self.paneList[tabIndex].dayArray = self.selectMonth;
          selectedMonth.forEach(item=>{
            console.log(item);
            let timePeriod = [];
            let tempSche = {};
            tempSche.day = Number(item);
            tempSchedule.push(tempSche)
          })
          console.log(tempSchedule);
        }
        else if(params.mode = 3){
          //自定义模式
          if(execOnce){
            //勾选，执行一次,当年最后一天的时间
            params.to = self.$moment().endOf('year').valueOf()
          }
          else{
            params.to = -1; //执行多次
          }
          let selfSche = self.paneList[tabIndex].schedule;
          let selectedMonth = self.selectMonth; //选择的日期
          selfSche.forEach(item=>{
            let month = Number(item.month); //选择的月份
            let days = item.day; //选择的日期数组
            days.forEach(_item=>{
              let dayOfYear = self.$moment([year, month-1, _item]).dayOfYear();
              let obj = {};
              obj.day = dayOfYear;
              obj.period = [];
              tempSchedule.push(obj);
            })
          })
        }
        params.schedule = tempSchedule;
        console.log(params.schedule);
        return new Promise((resolve, reject) => {
          updateSchedule(params).then(res => {
            console.log(res);
            let errMsg = res.errMsg;
            let data = res.errCode;
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
        else {
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
                self.notify(self.$t('scheduleView.deleteSuss'),'success',3000);
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
        self.notifyTime = self.paneList[0].notifyTime;
        console.log(self.scheduleId)
        self.getHasBoundStroeIds()
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
      },
      /**
       * 将‘月-日’数组，合并成月，多个日的json数组
       * @param array
       * @returns {Array}
       */
      formatMonthDay(array){
        let b = [];
        const map = {};
        for(let i=0; i< array.length; i++){
          console.log(array[i])
          var a = array[i].split('-');
          let temp =  {}
          temp.month = a[0];
          temp.day = a[1];
          b.push(temp)
        }
        console.log(b)
        for(const o of b){
          if(!map.hasOwnProperty(o.month)){
            map[o.month] = o;
            const val = map[o.month].day;
            map[o.month].day = [val];
          }else{
            map[o.month].day.push(o.day);
          }
        }
        let arr = [];
        for(let item in map){
          arr.push(map[item]);
          console.log(arr)
        }
        return arr;
      },
      scheduluNameChange(val, item){
        let self = this;
        let comment = filterString.all(val,30);
        console.log(comment);
        item.name = comment;
      }
    },

    mounted(){
      let self = this;
      self.getScheduleList();

    }

  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/css/tabsItem.css';
  @import '../../../assets/css/textstyle.css';
  @import '../../../assets/css/importfile.css';
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $mainColor:#f31d65;
  *{
    margin: 0;
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
      /deep/ .el-input__inner{
        border-radius: 30px;
      }
    }
  }
  .el-schedule-container{
    height: calc(180 / 1920 * 100vw);
    .el-schedule-header {
      .el-schedule-tabs {
        width: 100%;
        .schdule-info{
          height: auto;
        }
        .header-details{
          text-align: left;
          height: 50px;
          line-height: 50px;
          position: relative;
          #span {
            font-size: calc(14 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
            margin-left: calc(20 / 1920 * 100vw);
          }
          #en-span {
            font-size: calc(14 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
            margin-left: calc(20 / 1920 * 100vw);
            display: inline-block;
            width: 110px;
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
          }
          .self-detail{
            display: inline-block;
            height: 50px;
            font-size: 14px;
            position: relative;
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
            }
          }
          .self-content{
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
            }
          }
          .month-panel{
            position: absolute;
            margin-top: 3px;
            /*left: 170px;*/
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
          .en-month-panel{
            position: absolute;
            margin-top: 3px;
            /*left: 210px;*/
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
          .self-month-panel{
            position: absolute;
            margin-top: 3px;
            /*left: 170px;*/
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
          .self-def-panel{
            position: absolute;
            margin-top: 3px;
            right: 16px;
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
          .en-self-def-panel{
            position: absolute;
            margin-top: 3px;
            right: 16px;
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
          .en-self-month-panel{
            position: absolute;
            margin-top: 3px;
            /*left: 210px;*/
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
            /*left: 122px;*/
            right: 17px;
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
            /*left: 172px;*/
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
          .en-week-panel{
            position: absolute;
            margin-top: 3px;
            /*left: 210px;*/
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
      }

      .el-bind-content {
        max-height: calc(415/1920*100vw);
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
      }
      .el-header-title{
        font-size: 14px;
        font-weight: bold;
        color: $black;
        margin-top: 30px;
        margin-bottom: 20px;
        display: inline-block;
        margin-left: calc(20/1920*100vw);
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
      .el-search-input{
        width: calc(200/1920*100vw);
        margin-left: calc(30/1920*100vw);
      }
      .el-search-input /deep/ .el-input__inner{
        border-radius: 30px;
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
      margin: 0 calc(20/1920*100vw) 0 calc(30/1920*100vw);
      .el-icon-plus{
        font-size:12px;
      }
    }

  }
  #patrltabs-content /deep/ .el-tabs__nav-next, #patrltabs-content /deep/ .el-tabs__nav-prev {
    line-height: 30px;
  }
  #patrltabs-content /deep/ .el-tabs__item {
    padding: 0 0;
    margin: 0 12px;
    font-size: 12px;
    font-family: Roboto,"Microsoft YaHei";
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 30px;
    line-height: 30px;
  }
  #patrltabs-content /deep/ el-tabs__nav-wrap.is-scrollable.is-top{
    height: 30px;
  }
  #patrltabs-content /deep/ .el-tabs__nav-wrap::after{
    position: static;
  }
  #patrltabs-content /deep/ .is-active {
    margin-bottom: 2px;
    background: #f31d65 ;
    color: #fff;
    border-radius: 3px;
  }

  #patrltabs-content /deep/ .el-tabs__active-bar{
    height: 0 !important;
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

</style>

