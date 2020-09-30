<template>
  <el-row class="el-schedule-container" :style="{'min-height':varyWindowHeight-200+'px'}">
    <div class="el-schedule-header">
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
              <div class="NameInput" style="margin-right:calc(25/1920*100vw);">
                <el-input v-model="item.name"  :placeholder="generateScheduleLang('inputPlaceholder')" size="mini"  ref="scheduleName"
                        class="el-type" @input="(val)=>scheduluNameChange(val,item)" @blur="notShowInputRuleTips(item)"></el-input>
                <span class="rules" v-if="item.Ruletip">{{generateScheduleLang('scheduleNameRuletip')}}</span>
              </div>
              <div v-if="varyWindowWidth>1440" style="display:inline-block;">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('scheduleType')}}</span>
                <el-select v-model="item.mode"  placeholder="选择类型" size="mini" :disabled="item.modeDisabled" @change="searchStore"
                          class="el-type" v-if="activePatrol=='0'">
                  <el-option
                    v-for="itemType in typeList"
                    :key="itemType.value"
                    :label="itemType.label"
                    :value="itemType.value">
                  </el-option>
                </el-select>
                <el-select v-model="item.mode"  placeholder="选择类型" size="mini" :disabled="item.modeDisabled" @change="searchStore"
                          class="el-type" v-else>
                  <el-option
                    v-for="itemType in typeList.slice(1)"
                    :key="itemType.value"
                    :label="itemType.label"
                    :value="itemType.value">
                  </el-option>
                </el-select>
                <el-checkbox v-if="item.mode === 3" v-model="item.execOnce">{{generateScheduleLang('execOnce')}}</el-checkbox>
                <div class="day-detail" v-if="item.mode == 1">
                  <region-multi-select :options="weekList" :selected="item.schedule[0].day" :placeholder="generateScheduleLang('select')" :disabled="false"
                                      :inputSize="`mini`"  @changeInput="changeSelectWeek(arguments,item)" :all="$t('scheduleView.everyDay')"></region-multi-select>
                </div>
                <div class="day-detail" v-if="item.mode == 2">
                  <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('execDays')}}</span>
                  <region-multi-select :options="bigMonthList.slice(0, 28)" :selected="item.schedule[0].day" :placeholder="generateScheduleLang('select')" :disabled="false"
                                      :inputSize="`mini`"  @changeInput="changeSelectMonth(arguments,item)" :all="$t('scheduleView.everyDay')"></region-multi-select>
                </div>
              </div>
            </el-col>
            <el-col :span="24" class="header-details" v-if="varyWindowWidth<=1440">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('scheduleType')}}</span>
              <el-select v-model="item.mode"  placeholder="选择类型" size="mini" :disabled="item.modeDisabled" @change="searchStore"
                         class="el-type" v-if="activePatrol=='0'">
                <el-option
                  v-for="itemType in typeList"
                  :key="itemType.value"
                  :label="itemType.label"
                  :value="itemType.value">
                </el-option>
              </el-select>
              <el-select v-model="item.mode"  placeholder="选择类型" size="mini" :disabled="item.modeDisabled" @change="searchStore"
                         class="el-type" v-else>
                <el-option
                  v-for="itemType in typeList.slice(1)"
                  :key="itemType.value"
                  :label="itemType.label"
                  :value="itemType.value">
                </el-option>
              </el-select>
              <el-checkbox v-if="item.mode === 3" v-model="item.execOnce">{{generateScheduleLang('execOnce')}}</el-checkbox>
              <div class="day-detail" v-if="item.mode == 1">
                <region-multi-select :options="weekList" :selected="item.schedule[0].day" :placeholder="generateScheduleLang('select')" :disabled="false"
                                     :inputSize="`mini`"  @changeInput="changeSelectWeek(arguments,item)" :all="$t('scheduleView.everyDay')"></region-multi-select>
              </div>
              <div class="day-detail" v-if="item.mode == 2">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('execDays')}}</span>
                <region-multi-select :options="bigMonthList.slice(0, 28)" :selected="item.schedule[0].day" :placeholder="generateScheduleLang('select')" :disabled="false"
                                     :inputSize="`mini`"  @changeInput="changeSelectMonth(arguments,item)" :all="$t('scheduleView.everyDay')"></region-multi-select>
              </div>
            </el-col>
            <el-col :span="24" class="header-details" v-if="item.mode== 3" v-for="(_item, _index) in item.schedule" :key="'mode3'+_index">
              <div class="self-detail">
                <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('selectMonth')}}</span>
              </div>
              <el-select v-model="_item.month" size="mini"
                         class="el-type" @change="changeSelectSelfMonth(item, _item)"
              >
                <el-option
                  v-for="(itemDay,indexs) in _item.selfMonthList"
                  :key="itemDay.value"
                  :label="itemDay.name"
                  :value="itemDay.value"
                  :disabled="itemDay.disabled"
                >
                </el-option>
              </el-select>
              <div class="day-detail">
                <limit-select :selected="_item.day" :options="_item.monthList" :inputSize="`mini`"
                              @changeInput="changeSelfDefinedDay($event, _item)" ></limit-select>
              </div>
              <span class="delete-time-btn" size="mini" v-if="item.schedule.length > 1" style="margin: 0 20px 0 30px"
                    @click="deleteMonthAndDays(_index)"><i class="el-icon-error"></i></span>
              <el-button class="time-btn" size="mini" @click="addMonth()" type="primary"
                         v-if="_index == item.schedule.length-1"><i class="el-icon-plus"></i></el-button>
            </el-col>
            <el-col :span="24" class="header-details"
                    :key="index">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('notifyTime')}}</span>
              <el-time-select
                class="time-select"
                v-model="item.notifyTime"
                :clearable="false"
                :placeholder="generateScheduleLang('selectTime')"
                size="mini"
                :picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '23:59'}"
              >
              </el-time-select>
              <el-tooltip :popper-class="toolTipClass" class="item" effect="dark"
                          placement="bottom-end">
                <div slot="content">{{generateScheduleLang('notifyInfo')}}</div>
                <i class="iconfont icon-bangzhu iconbangzhu"></i>
              </el-tooltip>
              <el-checkbox v-model="item.ifNotifyOneDay">{{generateScheduleLang('notifyOneDayBefore')}}</el-checkbox>
            </el-col>
            <el-col :span="24" class="header-details header-person">
              <span :id="lang=='en'? 'en-span': 'span'">{{generateScheduleLang('dueDays')}}</span>
              <el-select v-model="item.dueDays"  placeholder="选择执行时效" size="mini"
                         class="el-type" style="margin-right:calc(25/1920*100vw);">
                <el-option
                  v-for="item in dueDaysList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
              <span :id="lang=='en'? 'en-span': 'span'" :style="lang=='en'?'':'padding-right:14px;'">{{generateScheduleLang('InspectPerson')}}</span>
              <el-checkbox-group v-model="item.assignedTo">
                <el-checkbox v-for="list_item in InspectorList" :disabled="list_item.disabled" :label="list_item.id" :key="list_item.id">{{list_item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="24" class="el-header-hr"></el-col>
            <el-col :span="24" class="el-bind-header">
              <div style="display: flex">
                <div class="el-header-title">{{generateScheduleLang('bindStore')}}</div>
                <div class="el-prompt-info">
                  <div class="el-prompt-title" v-show="activePatrol=='1'">
                    {{generateScheduleLang('promptInfo')}}
                  </div>
                </div>
              </div>
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
              <div class="el-bind-content">
                <el-scrollbar style="height:100%;" id="el-menuscrollbar">
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
                </el-scrollbar>
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
  import {inpectRESTful} from '@/api/index'
  import {getScheduleBindList, addNewSchedule, getScheduleListService, bindScheduleAndStore, unbindScheduleAndStore, updateSchedule,deleteScheduleService} from '@/api/schedule'
  import {getStoreList} from '@/api/store'
  import DialogVue from '@/components/DialogVue.vue'
  import Nape from "../../../api/ApiPath";
  import util from '@/common/util'
  import filterString from '@/common/filterString'
  import RegionMultiSelect from "@/components/RegionMultiSelect";
  import LimitSelect from "../../../components/LimitSelect";
  import {getInspectBindList} from '@/api/inspect'

  export default {
    name: "RemoteDetail",
    components:{
      LimitSelect,
      RegionMultiSelect,
      DialogVue
    },
    props:{
      activePatrol:{
        type: String,
        default: '0'
      },
      inspectId:{
        type: Number
      }
    },
    data(){
      return {
        varyWindowHeight:window.innerHeight,
        varyWindowWidth:window.innerWidth,
        isActive:'',
        allData:false,
        allDisabled: false,
        storeList:[],
        tempStoreList :[],
        showAddTime: false,
        scheduleList: ['点检排程一'],
        InspectorList:[{id:3,label:this.$t('insSettingView.storesupervisor'),disabled:false},{id:4,label:this.$t('insSettingView.storesuperManage'),disabled:false}],
        // Inspector:[],
        paneList:[],
        lang: this.$i18n.locale ,
        bigMonthList:[
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
          },
          {
            'checked': false,
            value: 29,
            name: '29',
            label: '29'
          },
          {
            'checked': false,
            value: 30,
            name: '30',
            label: '30'
          },
          {
            'checked': false,
            value: 31,
            name: '31',
            label: 31
          },
        ],
        monthList: [],
        value: '',
        checked:false,
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
        weekDays:[],
        showAddDialog:false,
        showDeleteDialog:false,
        isActivePatrol:'',
        scheduleName: '',
        storeCount: 0,
        serachVale: '',
        scheduleId: -1,
        selectTab: '',
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
        isAdd: false,
      }
    },

    methods: {
      generateScheduleLang,
      getBindStore(){
            let self=this;
            let params={inspectId:self.inspectId};
            return new Promise((resolve,reject)=>{
                getInspectBindList(params).then(res=>{
                    console.log(res.errMsg);
                    if(res.errMsg!=undefined&&res.errMsg=='Success'){
                        let data=res.data;
                        resolve(res);
                    }
                })
            })
        },
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
        let dayArrayLength = self.paneList[tabIndex].schedule[0].day.length
        if(mode==1 || mode==2 && dayArrayLength > 0){
          dayArray = self.paneList[tabIndex].schedule[0].day.filter(item=> item != '-1');
        }
        let name = self.paneList[tabIndex].name;
        let schedule = self.paneList[tabIndex].schedule;
        let assignedTo = self.paneList[tabIndex].assignedTo
        console.log(schedule)
        if(name == ''){
          self.notify(self.$t('scheduleView.emptyName'), 'warning',3000);
          self.$refs.scheduleName[tabIndex].focus();
          return false;
        }
        if(notifyTime == ''){
          self.notify(self.$t('scheduleView.emptyNotifyTime'), 'warning',3000);
          return false;
        }
        console.log(dayArray)
        if(assignedTo.length == 0){
          self.notify(self.$t('scheduleView.emptyAssignedTo'), 'warning',3000);
          return false;
        }
        if(mode==1 || mode == 2){
          //weekly or monthly mode
          if(dayArray.length == 0 ){
            self.notify(self.$t('scheduleView.emptyDate'), 'warning',3000);
            return false;
          }
        }
        if(mode == 3){
          //self defined mode
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
        if(self.isActivePatrol=='noInspect'){
          self.notify(self.$t('scheduleView.noscheduleInspect'), 'warning',3000);
          return false;
        }else{
          self.showBindDialog = true;
        }
      },
      handleClick(val) {
        let self = this;
        self.activeName = val.index;
        self.selectTab = val.label;
        let tabIndex = Number(self.activeName);
        self.scheduleId = self.paneList[tabIndex].schId;
        self.$emit('sendActiveName', self.activeName)
        self.searchStore();
        self.changeSelectSelfMonth(self.paneList[tabIndex], self.paneList[tabIndex].schedule)
      },

      addMonth(){
        let self = this;
        self.showAddMonth = true;
        self.paneList[Number(self.activeName)].schedule.push({
          month: '',
          day: [],
          monthList: self.bigMonthList,
          selfMonthList: self.paneList[Number(self.activeName)].schedule[0].selfMonthList
        });
      },

      addScheduleService() {
        let self = this;
        let params = {};
        let tabIndex = Number(self.activeName);
        params.name = self.paneList[tabIndex].name;
        params.comment = parseInt(self.activePatrol) == 0 ? '远程巡检计划': '现场巡检计划';
        params.category = parseInt(self.isActive);
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
        if(params.mode == 1 || params.mode == 2){
          //周模式
          let selectedWeek = self.paneList[tabIndex].schedule[0].day;
          selectedWeek.forEach(item=>{
            let tempSche = {};
            if(item != '-1'){
              tempSche.day = Number(item);
              tempSchedule.push(tempSche)
            }
          })
          console.log(tempSchedule);
        }
        else if(params.mode == 3){
          //自定义模式
          if(execOnce){
            //勾选，执行一次,当年最后一天的时间
            params.to = self.$moment().endOf('year').valueOf()
          }
          else{
            params.to = -1; //执行多次
          }
          let selfSche = self.paneList[tabIndex].schedule;
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
        params.extra={
          inspectId:self.isActivePatrol,
          assignedTo:self.paneList[tabIndex].assignedTo
        }
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

      async addSchedule(val) {
        let self = this;
        self.isActivePatrol=val
        self.scheduleName = self.$t('scheduleView.newSchedule');
        self.showAddDialog = false;
        let selfMonth = self.selfMonthList.slice(0);
        selfMonth.forEach(item=>{item.disabled = false});
        console.log(selfMonth);
        let addInfo = {
          name: self.scheduleName,
          mode: self.activePatrol=='0' ? 1: 2,
          schId: 0,
          enable: 0,
          to: -1,
          dueDays: 1,
          assignedTo:[],
          schedule: [{
            month: '',
            day: [],
            selfMonthList: selfMonth,
            monthList: self.bigMonthList
          }],
          notifyTime: '',
          execOnce: false,
          ifNotifyOneDay: false,
          modeDisabled: false,
          Ruletip:false
        };
        self.paneList.push(addInfo);
        let pane = self.paneList;
        self.$emit('paneList', pane.length)
        self.activeName = (pane.length -1).toString() ;
        self.selectTab = self.scheduleName;
        self.scheduleId = 0;
        self.isDisabled = false;
        self.searchStore();
        self.isAdd = true
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
        let bindStore = await self.getBindStore()
        let bindStoreId=await self.getBindStoreList();
        self.storeCount=bindStoreId.length;
        console.log(data);
        let cityList = [];
        data.forEach(item => {
          if (cityList.indexOf(item.city) == -1) {
            cityList.push(item.city);
          }
        })
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
        let groupTemp = [];
        let mode = self.paneList[Number(self.activeName)].mode;
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
            // if(mode === 3){
              if (bindStore.data.indexOf(_item.storeId) == -1) {
                _obj.disabled = true;
                _tempDisCount++;
              }
              if(bindStoreId.indexOf(_item.storeId) != -1){
                _obj.checked = true;
                _tempCount++;
              }
              // if (bindStoreId.indexOf(_item.storeId) == -1) {
              //   _obj.checked = false;
              //   _obj.disabled = false;
              // }
              // else {
              //   _obj.checked = true;
              //   _obj.disabled = false;
              //   _tempCount++;
              // }
            // }
            // else{
            //   if (bindStoreId.indexOf(_item.storeId) != -1) {
            //     _obj.checked = true;
            //     _obj.disabled = false;
            //     _tempCount++;
            //   }
            //   else {
            //     // 周月模式下，剩下的商店id 要看有没有绑定周月模式，若绑定，则不可用，
            //     if(self.hasBoundStoreIds.indexOf(_item.storeId) == -1) {
            //       _obj.checked = false;
            //       _obj.disabled = false;
            //     }
            //     else{
            //       _obj.checked = false;
            //       _obj.disabled = true;
            //       _tempDisCount++;
            //     }
            //     // _obj.checked = true;
            //     // _obj.disable = false;
            //     // _tempCount++;
            //   }
            // }
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
        let self = this;
        let scheId = self.paneList[Number(self.activeName)].schId;
        self.showBindDialog = false;
        let isAdd = false;
        //如果是新增排程，则先调用新增排程服务，获得返回的scheduleId
        if(scheId == 0){
          isAdd = true;
          scheId = await self.addScheduleService();
          self.paneList[Number(self.activeName)].schId = scheId;
          self.scheduleName = ''
          self.scheduleId = scheId;
          self.isAdd = false;
        }
        else{
          //
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
        self.getHasBoundStroeIds();
      },
      deleteMonthAndDays(index) {
        console.log(index)
        let self = this;
        let schedule = self.paneList[Number(self.activeName)].schedule;
        if(index == -1){
          self.showAddMonth = false;
        }
        else{
          schedule.splice(index, 1); //删除时间
        }
        let selectMonth = [];
        schedule.forEach(item=>{
          selectMonth.push(item.month)
        })
        schedule.forEach(schedule=>{
          schedule.selfMonthList.forEach(month=>{
            month.disabled = false;
          })
        })
        selectMonth.forEach(item=>{
          console.log(item);
          schedule.forEach(schedule=>{
            schedule.selfMonthList.forEach(month=>{
              if(month.value == item){
                month.disabled = true;
              }
            })
          })
        })
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
            size: 2000
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
        let length=0, countItem=0,alldisCount=0;
        self.storeList.forEach(_item=>{
          length+=_item.itemData.length;
          _item.itemData.forEach(itemS=>{
            itemS.checked ? countItem++ : ''
            itemS.disabled ? alldisCount++ : ''
          })
        })
        if(length==Number(countItem+alldisCount)){
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
      getTagAll(){//获取巡检表
            let self=this;
            return new Promise((resolve,reject)=>{
                inpectRESTful.GetInspectTagList().then(res=>{
                    let data=res.data;
                    resolve(data);
                }).catch(err => {
                    console.log(err.message);
                })

            })
        },
      async getScheduleList(val,e){
        let self = this;
        self.isActivePatrol=val;
        self.isActive = e
        self.activeName='0';
        self.paneList = [];
        self.scheduleList = [];
        self.InspectorList[0].disabled=false
        self.InspectorList[1].disabled=false
        let tag = await self.getTagAll()
        let role = []
        tag.forEach(item=>{
            if(val==item.id){
               item.appliedTo.forEach(ass_item=>{
                 if(ass_item.roleId==3||ass_item.roleId==4){
                   role.push(ass_item.roleId)
                 }
               })
            }
        })
        if(role.indexOf(3)!=-1&&role.indexOf(4)==-1){
          self.InspectorList[1].disabled=true
        }
        else if(role.indexOf(3)==-1&&role.indexOf(4)!=-1){
          self.InspectorList[0].disabled=true
        }
        else if(role.indexOf(3)!=-1&&role.indexOf(4)!=-1){
          self.InspectorList[0].disabled=false
          self.InspectorList[1].disabled=false
        }
        if(val=='noInspect'){
            self.getTemp()
        }else{
            let params = {};
            params.category = parseInt(e);
            let data = await self.getScheduleFromDB(params)
            if(data.length!=0){
              let paneArr=[]
              data.forEach(item=>{
                // let name = item.name; //排程名称
                // if(self.scheduleList.indexOf(name)==-1){
                if(item.extra.inspectId==val){
                  paneArr.push(item);
                }
              })
              let tempAllData=[];
              if(paneArr.length!=0){
                  paneArr.forEach(_item => {
                  console.log(_item);
                  let tempScheduleData = {};
                  tempScheduleData.name = _item.name;
                  tempScheduleData.mode = _item.mode;
                  tempScheduleData.modeDisabled = true;
                  tempScheduleData.schId = _item.id; //排程id
                  tempScheduleData.enable = _item.enable;
                  tempScheduleData.notifyTime = (_item.notifyTime == -1)? '' : self.secondsToHour(_item.notifyTime);
                  tempScheduleData.from = self.$moment(_item.from).format('YYYY'); //从from获取年
                  tempScheduleData.assignedTo = _item.extra.assignedTo
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
                  tempSchedules.forEach(sche=>{
                    console.log(sche)
                    let day = sche.day;
                    dayArray.push(day)
                    console.log(dayArray);

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
                  if(mode == 3){
                    let tempArray = [];
                    let scheduleSelf = []; //存放自定义的月份和时间
                    dayArray.forEach(item=>{
                      let monthDay = self.$moment([tempScheduleData.from]).dayOfYear(item).format('M-D');
                      tempArray.push(monthDay);
                    })
                    //将数组按照月份分组，日组成数组
                    console.log(tempArray)
                    scheduleSelf = self.formatMonthDay(tempArray);
                    console.log(scheduleSelf)
                    let selectMonth = [];
                    scheduleSelf.forEach(item=>{
                      let month = parseInt(item.month);
                      selectMonth.push(item.month);
                      console.log(item.day.map(Number));;
                      let year = self.$moment().format('YYYY');
                      let days = self.$moment([year, month-1]).daysInMonth();
                      console.log(days)
                      item.monthList = self.bigMonthList.slice(0, days);
                      item.showMonthContent = false; //时间选择面板默认不显示
                      item.showSelfDefineMonth = false;
                      let selfMonth = self.selfMonthList.slice(0);
                      selfMonth.forEach(item=>{item.disabled = false});
                      item.selfMonthList = selfMonth;
                      item.day = item.day.map(Number)
                    })
                    selectMonth.forEach(item=>{
                      scheduleSelf.forEach(_item=>{
                        if(item  != _item.month){
                          _item.selfMonthList.forEach(month=>{
                            if(month.value == item){
                              month.disabled = true;
                            }
                          })
                        }
                      })
                    })
                    tempScheduleData.schedule = scheduleSelf;
                  }
                  else{
                    tempScheduleData.schedule = [{}];
                    tempScheduleData.schedule[0].day = dayArray;
                  }
                  console.log(timeArray);
                  console.log(dayArray);
                  tempScheduleData.timeArray = timeArray;
                  tempScheduleData.dayArray = dayArray;
                  self.paneList.push(tempScheduleData);
                })
                
              }else{
                self.getTemp()
              }
              if(self.isFirstLoad == true){
                self.isFirstLoad = false;
                self.selectTab = this.paneList[Number(self.activeName)].name;
                self.scheduleId = self.paneList[0].schId;
                console.log(self.dayArray)
              }
              self.scheduleId = self.paneList[0].schId;
              console.log(self.paneList);
              self.getHasBoundStroeIds();
            }
            else if(data.length == 0){
              self.getTemp()
            }
        }
        self.searchStore();
      },
      getTemp(){
        let self=this
            self.scheduleName = self.$t('scheduleView.newSchedule');
            let selfMonth = self.selfMonthList.slice(0);
            selfMonth.forEach(item=>{item.disabled = false});
            let addInfo = {
              name: self.scheduleName,
              mode: self.activePatrol=='0' ? 1: 2,
              schId: 0,
              enable: 0,
              to: -1,
              dueDays: 1,
              assignedTo:[],
              schedule: [{
                month: '',
                day: [],
                selfMonthList: selfMonth,
                monthList: self.bigMonthList
              }],
              notifyTime: '',
              execOnce: false,
              ifNotifyOneDay: false,
              modeDisabled: false,
              Ruletip:false
            };
            self.paneList.push(addInfo);
            self.scheduleName = "远程巡检排程一";
            self.selectTab = "远程巡检排程一";
            self.scheduleId = 0;
            self.isDisabled = false;
            self.isAdd = true;
            self.hasBoundStoreIds = [];
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
        params.comment = parseInt(self.activePatrol) == 0 ? '远程巡检计划': '现场巡检计划';
        params.category = parseInt(self.isActive);
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
        let strYear = self.$moment(year).format('YYYY'); //年
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
        if(params.mode == 1 || params.mode == 2){
          //周模式
          let selectedWeek = self.paneList[tabIndex].schedule[0].day;
          selectedWeek.forEach(item=>{
            let tempSche = {};
            if(item != '-1'){
              tempSche.day = Number(item);
              tempSchedule.push(tempSche)
            }
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
          selfSche.forEach(item=>{
            let month = Number(item.month); //选择的月份
            let days = item.day; //选择的日期数组
            days.forEach(_item=>{
              let dayOfYear = self.$moment([strYear, month-1, _item]).dayOfYear();
              let obj = {};
              obj.day = dayOfYear;
              obj.period = [];
              tempSchedule.push(obj);
            })
          })
        }
        params.schedule = tempSchedule;
        params.extra={
          inspectId:self.inspectId,
          assignedTo:self.paneList[tabIndex].assignedTo
        }
        console.log(params);
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
        //self.echoMonthAndWeek();
        self.scheduleId = self.paneList[0].schId;
        self.enable = self.paneList[0].enable;
        self.notifyTime = self.paneList[0].notifyTime;
        console.log(self.scheduleId)
        self.getHasBoundStroeIds()
        self.searchStore();
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
        item.name = comment;
        let length = filterString.getContentLength(val);
        if(length>30){
              item.Ruletip=true
          }else{
              item.Ruletip=false
          }
      },
      notShowInputRuleTips(item){
            item.Ruletip=false
      },
      changeSelectWeek(val, item){
        let self = this;
        item.schedule[0].day = Array.from(val)[0];
      },
      changeSelectMonth(val, item){
        let self = this;
        item.schedule[0].day = Array.from(val)[0];
      },
      changeSelfDefinedDay(val, item){
        item.day = val;
      },
      changeSelectSelfMonth(_item, singItem){
          let self = this;
          let selectMonth = [];
          _item.schedule.forEach(item=>{
            selectMonth.push(item.month)
          })
          _item.schedule.forEach(schedule=>{
            schedule.selfMonthList.forEach(month=>{
              month.disabled = false;
            })
          })
          selectMonth.forEach(item=>{
            console.log(item);
              _item.schedule.forEach(schedule=>{
                console.log(schedule);
                schedule.selfMonthList.forEach(month=>{
                  if(month.value == item){
                    month.disabled = true;
                  }
                  console.log(month);
                })
              })
          })
          //change dayList based on month selected
          let month = parseInt(singItem.month);
          let year = self.$moment().format('YYYY');
          let days = self.$moment([year, month-1]).daysInMonth();
          console.log(days)
          singItem.monthList = self.bigMonthList.slice(0, days);
        }
    },

    mounted(){
      let self = this;
      // self.getScheduleList();
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
      width: 200px;
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
          .NameInput{
            display: inline-block;
            position: relative;
            .rules{
                font-size: 10px;
                color: #ff2400;
                line-height: 10px;
                position: absolute;
                top:45px;
                left:0;
            }
          }
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
      .el-prompt-info {
        flex: 1;
        min-width: 0;
        align-self: center;
        margin-top: 12px;
      }
      .el-prompt-info .el-prompt-title {
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color:#FEA316;
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
        text-overflow: ellipsis;
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
  // #patrltabs-content /deep/ .el-tabs__nav-next, #patrltabs-content /deep/ .el-tabs__nav-prev {
  //   line-height: 30px;
  // }
  // #patrltabs-content /deep/ .el-tabs__item {
  //   padding: 0 0;
  //   margin: 0 12px;
  //   font-size: 12px;
  //   font-family: Roboto,"Microsoft YaHei";
  //   width: 100px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   height: 30px;
  //   line-height: 30px;
  // }
  // #patrltabs-content /deep/ el-tabs__nav-wrap.is-scrollable.is-top{
  //   height: 30px;
  // }
  // #patrltabs-content /deep/ .el-tabs__nav-wrap::after{
  //   position: static;
  // }
  #patrltabs-content /deep/ .is-active {
    color: #f31d65;
    font-weight: 600;
  }
  #patrltabs-content /deep/ .el-tabs__active-bar{  
      height: 4px;
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
  .header-person /deep/ .el-checkbox-group{
    display: inline-block;
  }
  .header-person /deep/ .el-checkbox{
    margin-right:45px;
  }
</style>
<style>
.el-dialog__body{
    padding: 0px !important;
}
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }

</style>

