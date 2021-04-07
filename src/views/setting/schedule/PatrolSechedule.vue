<template>
  <el-row :style="{'min-height':varyWindowHeight-200+'px'}" class="schedule-container">
    <div class="el-schedule-header">
      <el-col :span="24" class="el-schedule-btns">
        <div class="left-title">
          <span v-if="lang !== 'en'" class="title">{{ $t('scheduleView.scheduleTitle') }}</span>
          <span v-if="lang === 'en' && varyWindowWidth > 1366" class="title">
            {{ $t('scheduleView.noscheduleInspect') }}</span>
          <el-tooltip
            v-if="varyWindowWidth <= 1366"
            :content="$t('scheduleView.noscheduleInspect')"
            class="item"
            effect="dark"
            placement="top">
            <span v-if="lang === 'en'" class="title">{{ $t('scheduleView.noscheduleInspect') }}</span>
          </el-tooltip>
          <el-select v-model="isActive" :placeholder="$t('storeView.selectPlaceholder')" @change="changePatrolType">
            <el-option v-for="item in patrolList" :key="item.flag" :label="item.tag" :value="item.flag"/>
          </el-select>
          <el-select
            v-model="inspectId"
            :placeholder="$t('storeView.selectPlaceholder')"
            @change="changePatrolList(inspectId,isActive)">
            <el-option v-for="item in InspectList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>
        <div class="right-title">
          <delay-button
            class="schedule-btn"
            @click="addScheduleButton">
            <div class="button-area">
              <i class="iconfont el-icon-plus"/>
              <span>{{ $t('scheduleView.addSchedule') }}</span>
            </div>
          </delay-button>
          <delay-button
            :disabled="paneLength === 0"
            class="schedule-btn"
            @click="deleteScheduleButton">
            <div class="button-area">
              <i class="iconfont icon-shanchu"/>
              <span>{{ $t('scheduleView.delete') }}</span>
            </div>
          </delay-button>
        </div>
      </el-col>
      <el-col
        v-loading="isLoadingSchedule"
        :span="24"
        :element-loading-text="$t('insSettingView.loadingbindstore')"
        class="el-schedule-tabs self-loading"
      >
        <el-row :style="{'min-height':varyWindowHeight - 200+'px'}" class="el-schedule-container">
          <div class="el-schedule-header">
            <el-col class="el-schedule-tabs">
              <el-tabs id="patrltabs-content" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item,index) in paneList"
                  :name="index.toString()"
                  :key="index"
                  :label="`${item.name}`">
                  <el-row :span="24" class="header-details">
                    <el-col :span="varyWindowWidth <= 1440 ? 24 : 7">
                      <span :id="lang === 'en'? 'en-span' : 'span'">{{ $t('scheduleView.scheduleName') }}</span>
                      <div class="NameInput" style="margin-right:calc(25/1920*100vw);">
                        <el-input
                          ref="scheduleName"
                          v-model="item.name"
                          :placeholder="$t('scheduleView.inputPlaceholder')"
                          size="mini"
                          class="el-type"
                          @input="(val) => scheduluNameChange(val,item)"
                          @blur="notShowInputRuleTips(item)"/>
                        <span v-if="item.Ruletip" class="rules">{{ $t('scheduleView.scheduleNameRuletip') }}</span>
                      </div>
                    </el-col>
                    <el-col :span="varyWindowWidth <= 1440 ? 24 : 16">
                      <div>
                        <span :id="lang === 'en'? 'en-span': 'span'">{{ $t('scheduleView.scheduleType') }}</span>
                        <el-select
                          v-if="activePatrol === '0'"
                          v-model="item.mode"
                          :disabled="item.modeDisabled"
                          size="mini"
                          class="el-type"
                          @change="searchStore">
                          <el-option
                            v-for="itemType in typeList"
                            :key="itemType.value"
                            :label="itemType.label"
                            :value="itemType.value"/>
                        </el-select>
                        <el-select
                          v-else
                          v-model="item.mode"
                          :disabled="item.modeDisabled"
                          size="mini"
                          class="el-type"
                          @change="searchStore">
                          <el-option
                            v-for="itemType in typeList.slice(1)"
                            :key="itemType.value"
                            :label="itemType.label"
                            :value="itemType.value"/>
                        </el-select>
                        <el-checkbox v-if="item.mode === 3" v-model="item.execOnce">
                          {{ $t('scheduleView.execOnce') }}
                        </el-checkbox>
                        <div v-if="item.mode === 1" class="day-detail">
                          <region-multi-select
                            :options="weekList"
                            :selected="item.schedule[0].day"
                            :placeholder="$t('scheduleView.select')"
                            :disabled="false"
                            :input-size="`mini`"
                            :all="$t('scheduleView.everyDay')"
                            @changeInput="changeSelectWeek(arguments,item)"/>
                        </div>
                        <div v-if="item.mode === 2" class="day-detail">
                          <span :id="lang=='en'? 'en-span': 'span'">{{ $t('scheduleView.execDays') }}</span>
                          <region-multi-select
                            :options="bigMonthList.slice(0, 28)"
                            :selected="item.schedule[0].day"
                            :placeholder="$t('scheduleView.select')"
                            :disabled="false"
                            :input-size="`mini`"
                            :all="$t('scheduleView.everyDay')"
                            @changeInput="changeSelectMonth(arguments,item)"/>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-col v-for="(_item, _index) in item.schedule" v-if="item.mode === 3" :span="24"
                          :key="'mode3'+_index" class="header-details">
                    <div class="self-detail">
                      <span :id="lang === 'en'? 'en-span' : 'span'">{{ $t('scheduleView.selectMonth') }}</span>
                    </div>
                    <el-select
                      v-model="_item.month"
                      size="mini"
                      class="el-type"
                      @change="changeSelectSelfMonth(item, _item)"
                    >
                      <el-option
                        v-for="(itemDay,indexs) in _item.selfMonthList"
                        :key="itemDay.value"
                        :label="itemDay.name"
                        :value="itemDay.value"
                        :disabled="itemDay.disabled"
                      />
                    </el-select>
                    <div class="day-detail">
                      <limit-select
                        :selected="_item.day"
                        :options="_item.monthList"
                        :input-size="`mini`"
                        @changeInput="changeSelfDefinedDay($event, _item)" />
                    </div>
                    <span
                      v-if="item.schedule.length > 1"
                      class="delete-time-btn"
                      size="mini"
                      style="margin: 0 20px 0 30px"
                      @click="deleteMonthAndDays(_index)"><i class="el-icon-error"/></span>
                    <el-button
                      v-if="_index === item.schedule.length-1"
                      class="time-btn"
                      size="mini"
                      type="primary"
                      @click="addMonth()"><i class="el-icon-plus"/></el-button>
                  </el-col>
                  <el-col
                    :span="24"
                    :key="index"
                    class="header-details">
                    <span :id="lang === 'en' ? 'en-span' : 'span'">{{ $t('scheduleView.notifyTime') }}</span>
                    <el-time-select
                      v-model="item.notifyTime"
                      :clearable="false"
                      :placeholder="$t('scheduleView.selectTime')"
                      :picker-options="{
                        start: '08:00',
                        step: '00:15',
                        end: '23:59'}"
                      class="time-select"
                      size="mini"
                    />
                    <el-tooltip
                      :popper-class="toolTipClass"
                      class="item"
                      effect="dark"
                      placement="bottom-end">
                      <div slot="content">{{ $t('scheduleView.notifyInfo') }}</div>
                      <i class="iconfont icon-bangzhu iconbangzhu"/>
                    </el-tooltip>
                    <el-checkbox v-model="item.ifNotifyOneDay">{{ $t('scheduleView.notifyOneDayBefore') }}</el-checkbox>
                  </el-col>
                  <el-col :span="24" class="header-details header-person">
                    <el-col :span="7">
                      <span :id="lang === 'en' ? 'en-span' : 'span'">{{ $t('scheduleView.dueDays') }}</span>
                      <el-select
                        v-model="item.dueDays"
                        size="mini"
                        class="el-type"
                        style="margin-right:calc(25/1920*100vw);">
                        <el-option
                          v-for="item in dueDaysList"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"/>
                      </el-select>
                    </el-col>
                    <div
                      :id="lang === 'en' ? 'en-span' : 'span'"
                      :style="lang === 'en' ? '' : 'padding-right:14px;'"
                      class="inspctor">
                      <div class="inspector-item">
                        <span class="required-name">*</span>
                        <span>{{ $t('scheduleView.InspectPerson') }}</span>
                      </div>
                      <div class="inspector-item">
                        {{ $t('scheduleView.onTitle') }}
                      </div>
                    </div>
                    <region-multi-select
                      :options="inspectorList"
                      :selected="item.assignedTo"
                      :placeholder="$t('scheduleView.select')"
                      :disabled="false"
                      :input-size="`mini`"
                      :all="$t('storeView.all')"
                    />
                    <!--<el-checkbox-group v-model="item.assignedTo">-->
                      <!--<el-checkbox v-for="list_item in inspectorList" :disabled="list_item.disabled"-->
                                   <!--:label="list_item.id" :key="list_item.id">{{ list_item.label }}</el-checkbox>-->
                    <!--</el-checkbox-group>-->
                  </el-col>
                  <el-col :span="24" class="el-header-hr"/>
                  <el-col :span="24" class="el-bind-header">
                    <div style="display: flex">
                      <div class="el-header-title">{{ $t('scheduleView.bindStore') }}</div>
                      <div class="el-prompt-info">
                        <div v-show="activePatrol === '1'" class="el-prompt-title">
                          {{ $t('scheduleView.promptInfo') }}
                        </div>
                      </div>
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
                      <!--<div v-if="storeList.length === 0">-->
                        <!--<div v-if="Havestore === 0|| resultHavestore && Havestore !== 0" class="bind-empty">-->
                          <!--<img :src="loadingGif">-->
                          <!--<span class="empty-text">{{ $t('insSettingView.loadingbindstore') }}</span>-->
                        <!--</div>-->
                      <!--</div>-->
                      <div v-if="storeList.length !== 0">
                        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
                          <div class="el-all-checkbox">
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
                    </div>
                    <div class="enable-content">
                      <span>{{ $t('scheduleView.enable') }}</span>
                      <el-switch
                        v-model="item.enable"/>
                    </div>
                    <div class="el-bind-footer">
                      <div class="el-btn-content">
                        <el-button :disabled="storeList.length === 0" class="btn" size="mini" type="primary"
                                   @click="validateBindScheduleParam">
                          <span>{{ $t('scheduleView.saveAndApply') }}</span>
                        </el-button>
                      </div>
                    </div>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </div>
          <dialog-pop
            :title="$t('scheduleView.delete')"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible="showDeleteDialog"
            @visibleChangeHandler="updateDialogFlag"
            @cancelHandler="hideDeleteDialog"
            @confirmHandler="deleteSchedule"
          >
            <div class="dialog-slot">
              <i class="el-icon-warning dialog-icon"/>
              <div class="dialog-content">{{ $t('scheduleView.saveInfo') }}</div>
            </div>
          </dialog-pop>
          <dialog-pop
            :title="$t('scheduleView.prompt')"
            :append-to-body="true"
            :close-on-click-modal="false"
            :visible="showBindDialog"
            @visibleChangeHandler="updateBindDialogFlag"
            @cancelHandler="hideBindDialog"
            @confirmHandler="bindSchedule"
          >
            <div class="dialog-slot">
              <i class="el-icon-warning dialog-icon"/>
              <div class="dialog-content">{{ $t('scheduleView.confirmBind') }}</div>
            </div>
          </dialog-pop>
        </el-row>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import { inpectRESTful } from '@/api/index';
import RemoteDetail from '@/views/setting/schedule/RemoteDetail';
import { mapGetters } from 'vuex';
import DelayButton from '@/components/DelayButton';
import util from '@/common/util';
import {
  getScheduleBindList,
  addNewSchedule,
  getScheduleListService,
  bindScheduleAndStore,
  unbindScheduleAndStore,
  updateSchedule,
  deleteScheduleService } from '@/api/schedule';
import { getStoreList } from '@/api/store';
import filterString from '@/common/filterString';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import LimitSelect from '@/components/LimitSelect';
import { getInspectBindList } from '@/api/inspect';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'PatrolSchedule',

  components: {
    DelayButton,
    RemoteDetail,
    DialogPop,
    LimitSelect,
    RegionMultiSelect
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
      inspectId: null,
      paneLength: 0,

      Havestore: 0,
      resultHavestore: false,
      loadingGif: require('../../../../static/img/loading.gif'),
      isActive: 0,
      allData: false,
      allDisabled: false,
      storeList: [],
      tempStoreList: [],
      showAddTime: false,
      scheduleList: ['点检排程一'],
      inspectorList: [],
      // Inspector:[],
      bigMonthList: [
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
        }
      ],
      monthList: [],
      value: '',
      checked: false,
      curType: 1,
      typeList: [
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
          'value': 1
        },
        {
          'checked': false,
          'name': this.$t('scheduleView.tues'),
          'label': this.$t('scheduleView.tues'),
          'value': 2
        },
        {
          'checked': false,
          'name': this.$t('scheduleView.wed'),
          'label': this.$t('scheduleView.wed'),
          'value': 3
        },
        {
          'checked': false,
          'name': this.$t('scheduleView.thur'),
          'label': this.$t('scheduleView.thur'),
          'value': 4
        },
        {
          'checked': false,
          'name': this.$t('scheduleView.fri'),
          'label': this.$t('scheduleView.fri'),
          'value': 5
        },
        {
          'checked': false,
          'name': this.$t('scheduleView.sat'),
          'label': this.$t('scheduleView.sat'),
          'value': 6
        },
        {
          'checked': false,
          'name': this.$t('scheduleView.sun'),
          'label': this.$t('scheduleView.sun'),
          'value': 7
        }

      ],
      weekDays: [],
      showAddDialog: false,
      showDeleteDialog: false,
      isActivePatrol: '',
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
          'value': '1'
        },
        {
          'checked': false,
          'disable': false,
          'name': '2',
          'value': '2'
        },
        {
          'checked': false,
          'disable': false,
          'name': '3',
          'value': '3'
        },
        {
          'checked': false,
          'disable': false,
          'name': '4',
          'value': '4'
        },
        {
          'checked': false,
          'disable': false,
          'name': '5',
          'value': '5'
        },
        {
          'checked': false,
          'disable': false,
          'name': '6',
          'value': '6'
        },
        {
          'checked': false,
          'disable': false,
          'name': '7',
          'value': '7'
        },
        {
          'checked': false,
          'disable': false,
          'name': '8',
          'value': '8'
        },
        {
          'checked': false,
          'disable': false,
          'name': '9',
          'value': '9'
        },
        {
          'checked': false,
          'disable': false,
          'name': '10',
          'value': '10'
        },
        {
          'checked': false,
          'disable': false,
          'name': '11',
          'value': '11'
        },
        {
          'checked': false,
          'disable': false,
          'name': '12',
          'value': '12'
        }
      ], // 自定义模式月份
      toolTipClass: 'page-login-toolTipClass',
      schedule: [
        {
          month: '',
          days: [],
          showMonthContent: false
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
        }
      ],
      hasBoundStoreIds: [],
      isAdd: false,
      curInspectorArr: [],
      isLoadingSchedule: true
    };
  },
  watch: {
    accountChanged(val) {
      console.log(val);
      if (val !== 0) {
        this.isFirstLoad = true;
        this.activeName = '0';
        this.activeName = '0';
        this.isActive = 0;
        this.changePatrolType(0);
      }
    }
  },

  mounted() {
    this.changePatrolType(0);
  },

  methods: {
    changePatrolType(val) {
      this.inspectId = null;
      this.getTagList(val);
    },

    getTagList(val) {
      const params = {
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
                if (app_item.roleId  === 3 || app_item.roleId  === 4) {
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
          this.InspectList = InspectList;
          if (this.InspectList.length !== 0) {
            this.inspectId = this.InspectList[0].id;
            this.changePatrolList(this.inspectId, this.isActive);
          } else {
            this.changePatrolList('noInspect', this.isActive);
          }
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      });
    },

    changePatrolList(val1, val2) {
      this.getScheduleList(val1, val2);
    },

    addScheduleButton() {
      const pleg = this.paneList;
      if (pleg.length >= 10) {
        util.notify(this.$t('insSettingView.SchdRemoteLength'), 'warning', 3000);
        return false;
      } else {
        this.addSchedule(this.inspectId);
      }
    },

    changeActiveName(val) {
      this.activeName = val;
    },

    getpaneList(val) {
      this.paneLength = val;
    },

    changePatrol(val) {
      this.activePatrol = val.index;
      this.activeName = '0';
      this.activeName = '0';
      this.isFirstLoad = true;
      this.getScheduleList();
    },

    getBindStore() {
      let self = this;
      let params = { inspectId: self.inspectId };
      return new Promise((resolve, reject) => {
        getInspectBindList(params).then(res => {
          if (res.errMsg != undefined && res.errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err)
        });
      });
    },

    deleteScheduleButton() {
      this.showDeleteDialog = true;
    },

    validateBindScheduleParam() {
      let self = this;
      let tabIndex = Number(self.activeName);
      let mode = self.paneList[tabIndex].mode;
      let notifyTime = self.paneList[tabIndex].notifyTime;
      let dayArray = [];
      let dayArrayLength = self.paneList[tabIndex].schedule[0].day.length;
      if (mode === 1 || mode === 2 && dayArrayLength > 0) {
        dayArray = self.paneList[tabIndex].schedule[0].day.filter(item => item !== '-1');
      }
      let name = self.paneList[tabIndex].name;
      let schedule = self.paneList[tabIndex].schedule;
      let assignedTo = self.paneList[tabIndex].assignedTo;
      if (name === '') {
        util.notify(self.$t('scheduleView.emptyName'), 'warning', 3000);
        self.$refs.scheduleName[tabIndex].focus();
        return false;
      }
      if (notifyTime === '') {
        util.notify(self.$t('scheduleView.emptyNotifyTime'), 'warning', 3000);
        return false;
      }
      if (assignedTo.length === 0) {
        util.notify(self.$t('scheduleView.emptyAssignedTo'), 'warning', 3000);
        return false;
      }
      if (mode === 1 || mode === 2) {
        // weekly or monthly mode
        if (dayArray.length === 0) {
          util.notify(self.$t('scheduleView.emptyDate'), 'warning', 3000);
          return false;
        }
      }
      if (mode === 3) {
        // self defined mode
        let lackMonth = false;
        let lackDay = false;
        schedule.forEach(item => {
          if (item.month === '') {
            lackMonth = true;
          } else if (item.day.length === 0) {
            lackDay = true;
          }
        });
        if (lackMonth) {
          util.notify(self.$t('scheduleView.emptyMonth'), 'warning', 3000);
          return false;
        } else if (lackDay) {
          util.notify(self.$t('scheduleView.emptyDate'), 'warning', 3000);
          return false;
        }
      }
      if (self.isActivePatrol === 'noInspect') {
        util.notify(self.$t('scheduleView.noscheduleInspect'), 'warning', 3000);
        return false;
      } else {
        self.showBindDialog = true;
      }
    },

    handleClick(val) {
      let self = this;
      self.activeName = val.index;
      self.selectTab = val.label;
      let tabIndex = Number(self.activeName);
      self.scheduleId = self.paneList[tabIndex].schId;
      self.searchStore();
      if(self.paneList[tabIndex].mode !== 1){
        self.changeSelectSelfMonth(self.paneList[tabIndex], self.paneList[tabIndex].schedule);
      }
    },

    addMonth() {
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
      let params = self.getUpdateScheduleParams();
      return new Promise((resolve, reject) => {
        addNewSchedule(params).then(res => {
          let data = res.data.scheduleId;
          resolve(data);
        }).catch(err => {
          console.log("PatrolSchedule-addScheduleService: " + err);
          reject(err);
        });;
      });
    },

    async addSchedule(val) {
      let self = this;
      self.isActivePatrol = val;
      self.scheduleName = self.$t('scheduleView.newSchedule');
      self.showAddDialog = false;
      let selfMonth = self.selfMonthList.slice(0);
      selfMonth.forEach(item => { item.disabled = false; });
      let addInfo = {
        name: self.scheduleName,
        mode: self.activePatrol === '0' ? 1 : 2,
        schId: 0,
        enable: 0,
        to: -1,
        dueDays: 1,
        assignedTo: [],
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
        Ruletip: false
      };
      self.paneList.push(addInfo);
      let pane = self.paneList;
      this.paneLength = pane.length;
      self.activeName = (pane.length - 1).toString();
      self.selectTab = self.scheduleName;
      self.scheduleId = 0;
      self.isDisabled = false;
      self.searchStore();
      self.isAdd = true;
    },

    async searchStoreInput() {
      let self = this;
      let params = {};
      let tempStoreList = self.tempStoreList;
      let getStore2Temp = data => {
        let cityList = [];
        data.forEach(item => {
          if (cityList.map(x => x.city).indexOf(item.city) === -1) {
            let obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        let storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          let temp = [];
          let obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city === data[j].city) {
              let obj = {};
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.city = data[j].city;
              obj.checked = data[j].checked;
              obj.disabled = data[j].disabled;
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
      let temp = [];
      let tempArray = [];
      let tempStore = [];
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
      this.isLoadingSchedule = true;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          const data = res.data;
          this.isLoadingSchedule = false;
          resolve(data);
        }).catch(err => {
          this.isLoadingSchedule = false;
          reject(err);
        });
      });
    },

    async getStoreByCity(data) {
      let self = this;
      let bindStore = [];
      if (self.isActivePatrol !== 'noInspect'){
        bindStore = await self.getBindStore();
      }
      let bindStoreId = await self.getBindStoreList();
      self.storeCount = bindStoreId.length;
      let cityList = [];
      data.forEach(item => {
        if (cityList.indexOf(item.city) === -1) {
          cityList.push(item.city);
        }
      });
      let temp = [];
      cityList.forEach(item => {
        let obj = {};
        obj.city = item;
        let _temp = [];
        data.forEach(_item => {
          if (item === _item.city) {
            let _obj = {};
            obj.province = _item.province;
            _obj.storeName = _item.name;
            _obj.storeId = _item.storeId;
            _temp.push(_obj);
          }
        });
        obj.store = _temp;
        temp.push(obj);
      });
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
          if (self.isActivePatrol !== 'noInspect' && bindStore.data.indexOf(_item.storeId) === -1) {
            _obj.disabled = true;
            _tempDisCount++;
          }
          if (bindStoreId.indexOf(_item.storeId) !== -1) {
            _obj.checked = true;
            _tempCount++;
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
        }
        groupObj.itemData = _temp;
        groupTemp.push(groupObj);
      });
      self.storeList = groupTemp;
      self.tempStoreList = groupTemp;
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
      self.allData = count === self.storeList.length;
      if (count + disCount === self.storeList.length) {
        self.allData = true;
      }
      self.allDisabled = disCount === self.storeList.length;
      let totalConut = disCount + count;
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
      let self = this;
      let scheduleId = self.scheduleId;
      let params = {};
      params.scheduleId = scheduleId;
      if (params.scheduleId === 0) {
        return [];
      } else if (params.scheduleId === -1) {
        params.scheduleId = self.paneList[0].schId;
      }
      return new Promise((resolve, reject) => {
        getScheduleBindList(params).then(res => {
          let data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    bindScheduleToStore(params) {
      return new Promise((resolve, reject) => {
        bindScheduleAndStore(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    unbindScheToStore(params) {
      return new Promise((resolve, reject) => {
        unbindScheduleAndStore(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    updateBindDialogFlag(val) {
      this.showBindDialog = val;
    },
    hideBindDialog() {
      this.showBindDialog = false;
    },

    async bindSchedule() {
      let self = this;
      let scheId = self.paneList[Number(self.activeName)].schId;
      self.showBindDialog = false;
      this.paneLength = self.paneList.length;
      let isAdd = false;
      if (scheId === 0) {
        isAdd = true;
        scheId = await self.addScheduleService();
        self.paneList[Number(self.activeName)].schId = scheId;
        self.scheduleName = '';
        self.scheduleId = scheId;
        self.isAdd = false;
      }
      if (!isAdd) {
        await self.updateScheduleInfo();
      }
      self.bindOrUnbindStore(scheId).then(res => {
        self.getHasBoundStroeIds();
      }).catch( err =>{
        console.log("PatrolSchedule-bindSchedule: " + err);
      });
    },

    async bindOrUnbindStore(scheId){
      let self = this;
      let storeIdChecked = [];
      let storeIdUnchecked = [];
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

      let tempchecked = [];
      let obj = {
        scheduleId: scheId,
        storeIds: storeIdChecked
      };
      tempchecked.push(obj);
      let paramsBind = {
        items: tempchecked
      };
      let tempUnchecked = [];
      let unbindobj = {
        scheduleId: scheId,
        storeIds: storeIdUnchecked
      };
      tempUnchecked.push(unbindobj);

      let paramsUnBind = {
        items: tempUnchecked
      };
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
        let resBind = await self.bindScheduleToStore(paramsBind);
        let resUnBind = await self.unbindScheToStore(paramsUnBind);
        if (resBind.errMsg === 'Success' && resUnBind.errMsg === 'Success') {
          flag = true;
        }
      }
      if (flag) {
        let bindIdList = await self.getBindStoreList();
        self.storeCount = bindIdList.length;
        util.notify(`${this.$t('insSettingView.editSuss')} ${bindIdList.length}
                    ${this.$t('insSettingView.storesBound')}`, 'success', 3000);
        return true;
      } else {
        util.notify(this.$t('insSettingView.bindFail'), 'warning', 3000);
        return false;
      }
    },

    deleteMonthAndDays(index) {
      let self = this;
      let schedule = self.paneList[Number(self.activeName)].schedule;
      if (index === -1) {
        self.showAddMonth = false;
      } else {
        schedule.splice(index, 1);
      }
      let selectMonth = [];
      schedule.forEach(item => {
        selectMonth.push(item.month);
      });
      schedule.forEach(schedule => {
        schedule.selfMonthList.forEach(month => {
          month.disabled = false;
        });
      });
      selectMonth.forEach(item => {
        schedule.forEach(schedule => {
          schedule.selfMonthList.forEach(month => {
            if (month.value === item) {
              month.disabled = true;
            }
          });
        });
      });
    },

    async searchStore() {
      let self = this;
      self.storeList = [];
      let mode = self.paneList[Number(self.activeName)].mode;
      if (mode === 2) {
        self.monthList = self.bigMonthList.slice(0, 28);
      } else {
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
      };
      let resData = await self.getStoreData(params);
      let data = resData.content;
      if (data.length > 0) {
        self.resultHavestore = true;
        self.Havestore++;
      } else {
        self.resultHavestore = false;
        self.Havestore++;
      }
      self.getStoreByCity(data);

      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      self.allData = count === self.storeList.length;
    },

    choiceAll(val) {
      let self = this;
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
      let self = this;
      let obj = item;
      item.itemData.forEach(item => {
        if (!item.disabled) {
          item.checked = obj.checked;
        }
      });
      let arr = [];
      self.storeList.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      let disArr = [];
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
      let self = this;
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
      let length = 0, countItem = 0, alldisCount = 0;
      self.storeList.forEach(_item => {
        length += _item.itemData.length;
        _item.itemData.forEach(itemS => {
          itemS.checked ? countItem++ : '';
          itemS.disabled ? alldisCount++ : '';
        });
      });
      if (length === Number(countItem + alldisCount)) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    getScheduleFromDB(params) {
      return new Promise((resolve, reject) => {
        getScheduleListService(params).then(res => {
          let data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getTagAll() {
      let self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList().then(res => {
          let data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getScheduleList(val, e) {
      let self = this;
      self.isActivePatrol = val;
      self.isActive = e;
      self.activeName = '0';
      self.paneList = [];
      self.scheduleList = [];
      this.inspectorList = [];
      let tag = await self.getTagAll();
      tag.forEach(item => {
        if (val === item.id) {
          item.appliedTo.forEach(_item => {
            const inspectorObj = {};
            inspectorObj.value = _item.roleId;
            inspectorObj.label = _item.name;
            this.inspectorList.push(inspectorObj);
          })
        }
      });
      if (val === 'noInspect') {
        self.getScheduleTemplate();
      } else {
        let params = {};
        params.category = parseInt(e);
        let data = await self.getScheduleFromDB(params);
        if (data.length !== 0) {
          let paneArr = [];
          data.forEach(item => {
            if (item.extra.inspectId === val) {
              paneArr.push(item);
            }
          });
          this.paneLength = paneArr.length;
          if (paneArr.length !== 0) {
            paneArr.forEach(_item => {
              let tempScheduleData = {};
              tempScheduleData.name = _item.name;
              tempScheduleData.mode = _item.mode;
              tempScheduleData.modeDisabled = true;
              tempScheduleData.schId = _item.id;
              tempScheduleData.enable = _item.enable;
              tempScheduleData.notifyTime = (_item.notifyTime === -1) ? '' : self.secondsToHour(_item.notifyTime);
              tempScheduleData.from = self.$moment(_item.from).format('YYYY');
              tempScheduleData.assignedTo = _item.extra.assignedTo;
              let aheadNotification = _item.aheadNotification;

              if (aheadNotification === 86400) {
                tempScheduleData.ifNotifyOneDay = true;
              } else {
                tempScheduleData.ifNotifyOneDay = false;
              }
              tempScheduleData.dueDays = _item.dueDays;
              tempScheduleData.execOnce = _item.to != -1;
              let tempSchedules = _item.schedule;
              let mode = _item.mode; // 0 daily, 1 weekly, 2 monthly, 3 self defined
              let dayArray = [];
              let timeArray = [];
              tempSchedules.forEach(sche => {
                let day = sche.day;
                dayArray.push(day);
                let period = sche.period;
                period.forEach(periods => {
                  let from = periods.from;
                  let hours = self.secondsToHour(from);
                  if (timeArray.indexOf(hours) === -1) {
                    timeArray.push(self.secondsToHour(from));
                  } else {

                  }
                });
              });
              if (mode === 3) {
                let tempArray = [];
                let scheduleSelf = [];
                dayArray.forEach(item => {
                  let monthDay = self.$moment([tempScheduleData.from]).dayOfYear(item).format('M-D');
                  tempArray.push(monthDay);
                });
                scheduleSelf = self.formatMonthDay(tempArray);
                let selectMonth = [];
                scheduleSelf.forEach(item => {
                  let month = parseInt(item.month);
                  selectMonth.push(item.month);
                  let year = self.$moment().format('YYYY');
                  let days = self.$moment([year, month - 1]).daysInMonth();
                  item.monthList = self.bigMonthList.slice(0, days);
                  item.showMonthContent = false;
                  item.showSelfDefineMonth = false;
                  let selfMonth = self.selfMonthList.slice(0);
                  selfMonth.forEach(item => { item.disabled = false; });
                  item.selfMonthList = selfMonth;
                  item.day = item.day.map(Number);
                });
                selectMonth.forEach(item => {
                  scheduleSelf.forEach(_item => {
                    if (item != _item.month) {
                      _item.selfMonthList.forEach(month => {
                        if (month.value === item) {
                          month.disabled = true;
                        }
                      });
                    }
                  });
                });
                tempScheduleData.schedule = scheduleSelf;
              } else {
                tempScheduleData.schedule = [{}];
                tempScheduleData.schedule[0].day = dayArray;
              }
              tempScheduleData.timeArray = timeArray;
              tempScheduleData.dayArray = dayArray;
              self.paneList.push(tempScheduleData);
            });
          } else {
            self.getScheduleTemplate();
          }
          if (self.isFirstLoad) {
            self.isFirstLoad = false;
            self.selectTab = this.paneList[Number(self.activeName)].name;
            self.scheduleId = self.paneList[0].schId;
          }
          self.scheduleId = self.paneList[0].schId;
          self.getHasBoundStroeIds();
        } else if (data.length === 0) {
          self.getScheduleTemplate();
        }
      }
      self.searchStore();
    },

    getScheduleTemplate() {
      let self = this;
      self.scheduleName = self.$t('scheduleView.newSchedule');
      let selfMonth = self.selfMonthList.slice(0);
      selfMonth.forEach(item => { item.disabled = false; });
      let addInfo = {
        name: self.scheduleName,
        mode: self.activePatrol === '0' ? 1 : 2,
        schId: 0,
        enable: 0,
        to: -1,
        dueDays: 1,
        assignedTo: [],
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
        Ruletip: false
      };
      self.paneList.push(addInfo);
      self.scheduleName = '远程巡检排程一';
      self.selectTab = '远程巡检排程一';
      self.scheduleId = 0;
      self.isDisabled = false;
      self.isAdd = true;
      self.hasBoundStoreIds = [];
    },

    getHasBoundStroeIds() {
      let self = this;
      self.hasBoundStoreIds = [];
      self.paneList.forEach(item => {
        let sheduleId = item.schId;
        let mode = item.mode;
        if (mode !== 3) {
          let params = {};
          params.scheduleId = sheduleId;
          return new Promise((resolve, reject) => {
            getScheduleBindList(params).then(res => {
              let errMsg = res.errMsg;
              if(res.errCode===0){
                let data = res.data;
                data.forEach(_item => {
                  if (self.hasBoundStoreIds.indexOf(_item) === -1) {
                    self.hasBoundStoreIds.push(_item);
                  }
                });
                resolve(data);
              }
            }).catch(err => {
              console.log("PatrolSchedule-getHasBoundStroeIds: " + err);
              reject(err)
            });
          });
        }
      });
    },

    secondsToHour(second) {
      let changedData = [parseInt(second / 60 / 60), second / 60 % 60].join(':')
        .replace(/\b(\d)\b/g, '0$1');
      return changedData;
    },

    hourToSecond(hourStr) {
      let hourArray = hourStr.split(':');
      let changedSec = Number(hourArray[0]) * 3600 + Number(hourArray[1]) * 60;
      return changedSec;
    },

    updateScheduleInfo() {
      let params = this.getUpdateScheduleParams();
      return new Promise((resolve, reject) => {
        updateSchedule(params).then(res => {
          let data = res.errCode;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getUpdateScheduleParams(){
      let params = {};
      let self = this;
      let tabIndex = Number(self.activeName);
      params.id = self.paneList[tabIndex].schId;
      params.name = self.paneList[tabIndex].name;
      params.comment = parseInt(self.activePatrol) === 0 ? '远程巡检计划' : '现场巡检计划';
      params.category = parseInt(self.isActive);
      params.enable = Number(self.paneList[tabIndex].enable);
      params.mode = self.paneList[tabIndex].mode;
      let execOnce = self.paneList[tabIndex].execOnce;
      let ifNotifyOneDay = self.paneList[tabIndex].ifNotifyOneDay;
      if (ifNotifyOneDay) {
        params.aheadNotification = 86400;
      } else {
        params.aheadNotification = 0;
      }
      let year = self.paneList[tabIndex].from;
      let strYear = self.$moment(year).format('YYYY');
      params.from = self.$moment(year).startOf('year').valueOf();
      params.to = -1;
      if (self.paneList[tabIndex].notifyTime != null) {
        params.notifyTime = self.hourToSecond(self.paneList[tabIndex].notifyTime);
      } else {
        params.notifyTime = -1;
      }
      params.dueDays = self.paneList[tabIndex].dueDays;
      let tempSchedule = [];
      if (params.mode === 1 || params.mode === 2) {
        let selectedWeek = self.paneList[tabIndex].schedule[0].day;
        selectedWeek.forEach(item => {
          let tempSche = {};
          if (item !== '-1') {
            tempSche.day = Number(item);
            tempSchedule.push(tempSche);
          }
        });
      } else if (params.mode === 3) {
        if (execOnce) {
          params.to = self.$moment().endOf('year').valueOf();
        } else {
          params.to = -1;
        }
        let selfSche = self.paneList[tabIndex].schedule;
        selfSche.forEach(item => {
          let month = Number(item.month);
          let days = item.day;
          days.forEach(_item => {
            let dayOfYear = self.$moment([strYear, month - 1, _item]).dayOfYear();
            let obj = {};
            obj.day = dayOfYear;
            obj.period = [];
            tempSchedule.push(obj);
          });
        });
      }
      params.schedule = tempSchedule;
      params.extra = {
        inspectId: self.inspectId,
        assignedTo: self.paneList[tabIndex].assignedTo
      };
      return params;
    },

    updateDialogFlag(val) {
      this.showDeleteDialog = val;
    },

    hideDeleteDialog() {
      this.showDeleteDialog = false;
    },

    deleteSchedule() {
      let self = this;
      self.showDeleteDialog = false;
      if (self.scheduleId === 0) {
        self.initData();
      } else {
        let scheduleIds = [];
        scheduleIds.push(self.scheduleId);
        let params = {};
        params.scheduleIds = scheduleIds;

        return new Promise((resolve, reject) => {
          deleteScheduleService(params).then(res => {
            let errMsg = res.errMsg;
            let data = res.errCode;
            if (data === 0) {
              self.notify(self.$t('scheduleView.deleteSuss'), 'success', 3000);
            } else {
              self.notify(self.$t('scheduleView.deleteFail'), 'warning', 3000);
            }
            self.initData();
            resolve(data);
          }).catch(err => {
            console.log("PatrolSchedule-getHasBoundStroeIds: " + err);
            reject(err);
          });
        });
      }
    },

    initData() {
      let self = this;
      self.paneList.splice(Number(self.activeName), 1);
      if(self.paneList.length!==0){
        self.activeName = '0';
        self.scheduleId = self.paneList[0].schId;
        self.curType = (self.paneList[0].mode).toString();
        self.enable = self.paneList[0].enable;
        self.notifyTime = self.paneList[0].notifyTime;
        self.getHasBoundStroeIds();
        self.searchStore();
      }else{
        this.paneLength = self.paneList.length;
        self.getScheduleList(self.isActivePatrol, self.isActive);
      }
    },

    formatMonthDay(array) {
      let monthDayArr = [];
      let monthDayMap = {};
      for (let i = 0; i < array.length; i++) {
        let monthArr = array[i].split('-');
        let temp = {};
        temp.month = monthArr[0];
        temp.day = monthArr[1];
        monthDayArr.push(temp);
      }
      for (let monthObj of monthDayArr) {
        if (!monthDayMap.hasOwnProperty(monthObj.month)) {
          monthDayMap[monthObj.month] = monthObj;
          let val = monthDayMap[monthObj.month].day;
          monthDayMap[monthObj.month].day = [val];
        } else {
          monthDayMap[monthObj.month].day.push(monthObj.day);
        }
      }
      let arr = [];
      for (let item in monthDayMap) {
        arr.push(monthDayMap[item]);
      }
      return arr;
    },

    scheduluNameChange(val, item) {
      let self = this;
      let comment = filterString.all(val, 30);
      item.name = comment;
      let length = filterString.getContentLength(val);
      if (length > 30) {
        item.Ruletip = true;
      } else {
        item.Ruletip = false;
      }
    },

    notShowInputRuleTips(item) {
      item.Ruletip = false;
    },

    changeSelectWeek(val, item) {
      let self = this;
      item.schedule[0].day = Array.from(val)[0];
    },

    changeSelectMonth(val, item) {
      let self = this;
      item.schedule[0].day = Array.from(val)[0];
    },

    changeSelfDefinedDay(val, item) {
      item.day = val;
    },

    changeSelectSelfMonth(_item, singItem) {
      let self = this;
      let selectMonth = [];
      _item.schedule.forEach(item => {
        selectMonth.push(item.month);
      });
      if(_item.mode !== 2){
        _item.schedule.forEach(schedule => {
          schedule.selfMonthList.forEach(month => {
            month.disabled = false;
          });
        });
        selectMonth.forEach(item => {
          _item.schedule.forEach(schedule => {
            schedule.selfMonthList.forEach(month => {
              if (month.value === item) {
                month.disabled = true;
              }
            });
          });
        });
      }
      // change dayList based on month selected
      let month = parseInt(singItem.month);
      let year = self.$moment().format('YYYY');
      let days = self.$moment([year, month - 1]).daysInMonth();
      singItem.monthList = self.bigMonthList.slice(0, days);
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
        margin-top: 10px;
      }
      .el-schedule-btns {
        /*position: absolute;*/
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
  .dialog-content{
    width: 100%;
    span{
      font-size: 14px;
      margin-right: 20px;
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
          #span.inspctor, #en-span.inspctor{
            display: inline-flex;
            flex-direction: column;
            .inspector-item{
              height: 25px;
            }
          }
          .search-content {
            display: inline-block;
          }
          .el-type{
            width: 200px;
            >>> .el-input__inner{
              height: 30px !important;
            }
          }
          >>> .el-input__inner{
            height: 30px !important;
            width: 200px;
            border-radius: 3px !important;;
          }
          >>> .el-select.el-select--mini{
            height: 30px !important;
            width: 200px;
          }
          .content{
            width: 199px;
          }
          >>> .content .input-class{
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
        height: calc(380/1920*100vw);
        overflow: auto;
        background-color: #F6F7FB;
        border: 0.5px solid #e3e9f4;
        color: $black;
        .bind-empty{
          height: calc(415/1920*100vw);
          line-height: calc(415/1920*100vw);
          text-align: center;
          .empty-text{
            font-size: calc(14/1920*100vw);
            color:#7d8cad;
          }
        }
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
      .el-search-input >>> .el-input__inner{
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
  #patrltabs-content >>> .is-active {
    color: #f31d65;
    font-weight: 600;
  }
  #patrltabs-content >>>.el-tabs__active-bar{
    height: 4px;
  }
  >>>.el-input--mini .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
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

  .el-checkbox__label{
    font-size: calc(14/1920*100vw);
  }
  .header-person .el-checkbox-group{
    display: inline-block;
  }
  .header-person .el-checkbox{
    margin-right:45px;
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
