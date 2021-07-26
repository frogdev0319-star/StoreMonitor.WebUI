<template>
  <div>
    <div :style="ispdf?'min-height:100vh;':''" class="item-container">
      <el-col :span="24" class="statistics-header">
        <div class="header-details">
          <span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('remotePatrol.time') }}</span>
          <date-time-picker :date-value="dateValue" @change="dateChange"></date-time-picker>
        </div>
        <div class="header-mul-select">
          <span class="mul-label">{{ $t('overview.patrolLists') }}</span>
          <el-select v-model="inspectTagId" size="mini" class="el-province" @change="searchData">
            <el-option
              v-for="(item, index) in inspectList"
              :key="index"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
      </el-col>
      <el-col :span="24" class="items-content">
        <el-col :span="24" class="contents-container">
          <el-col :span="24" class="items-title">
            <span class="title">{{ $t('overview.patrolList') }}</span>
            <div class="operation-btns">
              <delay-button
                :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                type="primary"
                size="mini"
                @click="export2Excel"
              >
                <div class="button-area">
                  <img :src="exportPng" class="icon-excel">
                  <span>{{ $t('eventView.exportReport') }}</span>
                </div>
              </delay-button>
              <delay-button
                :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                type="primary"
                size="mini"
                @click="handleDown"
              >
                <div class="button-area">
                  <i class="iconfont icon-pdf"/>
                  <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
                </div>
              </delay-button>
            </div>
          </el-col>
          <el-col :span="24" class="items-table">
            <div class="table">
              <div class="el-table-panel">
                <el-table
                  :data="supervisorTableData"
                  :highlight-current-row="true"
                  :default-sort = "defaultSort"
                  :header-cell-class-name="headerClass"
                  :cell-class-name="cellClass"
                  :row-key="getRowKeys"
                  :expand-row-keys="expands"
                  :row-class-name="rowClass"
                  empty-text="无数据"
                  align="left"
                  stripe
                  border
                  style="width: 100%"
                  size="mini"
                  @sort-change="sortChange"
                  @expand-change="expandSelect"
                >
                  <el-table-column
                    v-for="(_item,_index) in supervisorInfoData"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :sortable="_item.sortable"
                    :sort-orders="['ascending', 'descending']"
                    :min-width="lang.indexOf('zh') !== -1 ? _item.width : _item.maxWidth"/>
                  <el-table-column :label="$t('overview.detail')" :width="lang.indexOf('ja') !== -1 ? '160px': '130px'" type="expand">
                    <template slot-scope="props">
                      <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="$t('overview.patrolPlan')" name="patrolPlan">
                          <el-table
                            :data="planTableData"
                            :highlight-current-row="true"
                            :header-cell-class-name="insideHeaderClass"
                            :row-class-name="insideRowClass"
                            :cell-class-name="insideCellClass"
                            align="left"
                            stripe
                            border
                            style="width: 100%"
                            size="mini"
                          >
                            <el-table-column type="expand">
                              <template slot-scope="props">
                                <div style="display:flex;margin-left:calc(-50/1920*100vw);">
                                  <span>{{$t('overview.patrolStore')}}:</span>
                                  <span style="flex:1;">{{props.row.appliedStores}}</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              v-for="(_item,_index) in planTableInfo"
                              :key="_index"
                              :prop="_item.prop"
                              :label="_item.label"
                              :class-name="_item.className"
                              :min-width="_item.width"/>
                          </el-table>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('overview.patrolExecution')" name="planImplementation">
                          <el-table
                            :data="implementTableData"
                            :highlight-current-row="true"
                            :header-cell-class-name="insideHeaderClass"
                            :row-class-name="insideRowClass"
                            :cell-class-name="insideCellClass"
                            align="left"
                            stripe
                            border
                            style="width: 100%"
                            size="mini"
                          >
                            <el-table-column type="expand">
                              <template slot-scope="props">
                                <div style="display:flex;margin-left:calc(-50/1920*100vw);">
                                  <span>{{$t('overview.inspectedStores')}}:</span>
                                  <span style="flex:1;">{{props.row.completedStoresStr}}</span>
                                </div>
                                <div style="display:flex;margin-left:calc(-50/1920*100vw);">
                                  <span>{{$t('overview.uninspectedStores')}}:</span>
                                  <span style="flex:1;">{{props.row.incompletedStoresStr}}</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              v-for="(_item,_index) in implementTableInfo"
                              :key="_index"
                              :prop="_item.prop"
                              :label="_item.label"
                              :min-width="_item.width"/>
                          </el-table>
                        </el-tab-pane>
                      </el-tabs>
                    </template>
                  </el-table-column>

                  <div slot="empty">
                    <div>
                      <i class="iconfont icon-zhengque empty-data-icon"/>
                      <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{ $t('overview.noData') }}</span>
                    </div>
                  </div>
                </el-table>
              </div>
              <div class="toolbar pagination clearfix">
                <el-pagination
                  :page-sizes="[10, 20, 50, 100]"
                  :current-page="page"
                  :page-size="sizeNum"
                  :total="total"
                  background
                  small
                  layout="jumper,total, prev, pager, next,sizes"
                  @size-change="sizeChange"
                  @current-change="currentChange"/>
              </div>
            </div>
          </el-col>
        </el-col>
      </el-col>
    </div>
    <div v-if="ispdf" class="item-container">
      <el-col id="pdfDom" ref="printPDF" :span="24" class="items-content" style="padding:40px 0px;width:1130px;">
        <div :span="24" class="export-header">
          <p>
            <span>{{ $t('remotePatrol.time') }}：</span>
            <span class="content-header">{{ storeDateValue }}</span>
          </p>
          <p>
            <span>{{ $t('scheduleView.inspectName') }}：</span>
            <span class="content-header">{{ inspectName }}</span>
          </p>
        </div>
        <el-col :span="24" class="contents-container" style="border-top:1px solid #e3e9f4;">
          <el-col :span="24" class="items-title" style="padding:20px 0;">
            <span class="title">{{ $t('overview.patrolList') }}</span>
          </el-col>
          <el-col :span="24" class="items-table" style="padding-bottom:20px;">
            <div class="table">
              <div class="el-table-panel">
                <el-table
                  :data="elPDFtableData"
                  :highlight-current-row="true"
                  :default-sort = "{prop: 'completionRateStr', order: 'ascending'}"
                  :header-cell-class-name="headerClass"
                  :cell-class-name="cellClass"
                  :row-key="getRowKeys"
                  :row-class-name="rowClass"
                  empty-text="无数据"
                  align="left"
                  stripe
                  border
                  style="width: 100%"
                  size="mini"
                  default-expand-all
                  @sort-change="sortChange"
                  @expand-change="expandSelect"
                >
                  <el-table-column
                    v-for="(_item,_index) in supervisorInfoData"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :sortable="_item.sortable"
                    :min-width="lang.indexOf('zh') !== -1 ? _item.pdfwidth : _item.pdfmaxWidth"/>
                  <el-table-column :label="$t('overview.detail')" type="expand" width="100px">
                    <template slot-scope="scope">
                      <el-tabs v-model="activePDFFirst" @tab-click="handleClick" style="width:990px;">
                        <el-tab-pane :label="$t('overview.patrolPlan')" name="First">
                          <el-table
                            :data="scope.row.planTableData"
                            :highlight-current-row="true"
                            :header-cell-class-name="insideHeaderClass"
                            :row-class-name="insideRowClass"
                            :cell-class-name="insideCellClass"
                            align="left"
                            stripe
                            border
                            default-expand-all
                            style="width: 100%"
                            size="mini"
                          >
                            <el-table-column type="expand">
                              <template slot-scope="props">
                                <div style="display:flex;margin-left:calc(-50/1920*100vw);">
                                  <span>{{$t('overview.patrolStore')}}:</span>
                                  <span style="flex:1;">{{props.row.appliedStores}}</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              v-for="(_item,_index) in planTableInfo"
                              :key="_index"
                              :prop="_item.prop"
                              :label="_item.label"
                              :class-name="_item.className"
                              :min-width="_item.width"/>
                          </el-table>
                        </el-tab-pane>
                      </el-tabs>
                      <el-tabs v-model="activePDFSecond" @tab-click="handleClick" style="width:990px;">
                        <el-tab-pane :label="$t('overview.patrolExecution')" name="Second">
                          <el-table
                            :data="scope.row.implementTableData"
                            :highlight-current-row="true"
                            :header-cell-class-name="insideHeaderClass"
                            :row-class-name="insideRowClass"
                            :cell-class-name="insideCellClass"
                            align="left"
                            stripe
                            border
                            default-expand-all
                            style="width: 100%"
                            size="mini"
                          >
                            <el-table-column type="expand">
                              <template slot-scope="props">
                                <div style="display:flex;margin-left:calc(-50/1920*100vw);">
                                  <span>{{$t('overview.inspectedStores')}}:</span>
                                  <span style="flex:1;">{{props.row.completedStoresStr}}</span>
                                </div>
                                <div style="display:flex;margin-left:calc(-50/1920*100vw);">
                                  <span>{{$t('overview.uninspectedStores')}}:</span>
                                  <span style="flex:1;">{{props.row.incompletedStoresStr}}</span>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              v-for="(_item,_index) in implementTableInfo"
                              :key="_index"
                              :prop="_item.prop"
                              :label="_item.label"
                              :min-width="_item.width"/>
                          </el-table>
                        </el-tab-pane>
                      </el-tabs>
                    </template>
                  </el-table-column>

                  <div slot="empty">
                    <div>
                      <i class="iconfont icon-zhengque empty-data-icon"/>
                      <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">
                        {{ $t('overview.noData') }}
                      </span>
                    </div>
                  </div>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-col>
      </el-col>
    </div>
    <dialog-pop
      :title="$t('insSettingView.export')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="ispdf"
      :show-button="false"
      class="LoadDialog"
    >
      <p>{{ $t('insSettingView.isExportPDF') }}......</p>
    </dialog-pop>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getBriefStoreList } from '@/api/store';
import util from '@/common/util.js';
import { GetScheduleTaskList } from '@/api/schedule';
import {
  getInspectStatsOverPersonV2,
  getInspectScheduleOverview
} from '@/api/inspectOverview';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import { inpectRESTful } from '@/api/index';
import DateTimePicker from '@/components/DateTimePicker';

export default {
  name: 'SupervisorStatistics',

  components: {
    DateTimePicker,
    DialogPop,
    DelayButton
  },

  data() {
    return {
      activePDFFirst: 'First',
      activePDFSecond: 'Second',
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      timeMode: 1,
      ispdf: false,
      storeDateValue: '',
      inspectName: '',
      params: {},
      poperClass: 'date-picker-poper',
      exportPng: require('../../../static/img/excel.png'),
      lang: this.$i18n.locale,
      supervisorTableData: [],
      supervisorInfoData: [
        {
          'prop': 'supervisorName',
          'label': this.$t('scheduleView.InspectPerson'),
          'sortable': false,
          'pdfwidth': '15%',
          'pdfmaxWidth': '17%',
          'width': 232,
          'maxWidth': 232
        },
        {
          'prop': 'numOfStores',
          'label': this.$t('overview.storeNum'),
          'sortable': 'custom',
          'pdfwidth': '15%',
          'pdfmaxWidth': '17%',
          'width': 227,
          'maxWidth': 227
        },
        {
          'prop': 'numOfTasked',
          'label': this.$t('overview.scheduleNum'),
          'sortable': 'custom',
          'pdfwidth': '15%',
          'pdfmaxWidth': '16%',
          'width': 227,
          'maxWidth': 227
        },
        {
          'prop': 'numOfCompleted',
          'label': this.$t('overview.inscheduleNum'),
          'sortable': 'custom',
          'pdfwidth': '15%',
          'pdfmaxWidth': '16%',
          'width': 227,
          'maxWidth': 220
        },
        {
          'prop': 'numOfUnscheduled',
          'label': this.$t('overview.unscheduleNum'),
          'sortable': 'custom',
          'pdfwidth': '15%',
          'pdfmaxWidth': '16%',
          'width': 227,
          'maxWidth': 240
        },
        {
          'prop': 'completionRateStr',
          'label': this.$t('overview.completeRate'),
          'sortable': 'custom',
          'pdfwidth': '15%',
          'pdfmaxWidth': '16%',
          'width': 227,
          'maxWidth': 220
        }
      ],
      total: 0,
      page: 1,
      sizeNum: 10,
      direction: 'asc',
      property: 'completionRate',
      hasNoData: false,
      exportItmesHeader: [
        this.$t('scheduleView.InspectPerson'), this.$t('overview.storeNum'),
        this.$t('overview.scheduleNum'), this.$t('overview.inscheduleNum'),
        this.$t('overview.unscheduleNum'), this.$t('overview.completeRate')
      ],
      headerClass: 'header-class',
      cellClass: 'cell-class',
      activeName: 'patrolPlan',
      planTableData: [],
      planPDFData: [],
      week: ['Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.', 'Sun.'],
      monthly: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
      month: ['st', 'nd', 'rd', 'th'],
      planTableInfo: [
        {
          'prop': 'scheduleName',
          'label': this.$t('scheduleView.scheduleName'),
          'width': '13%',
          'className': 'col1'
        },
        {
          'prop': 'category',
          'label': this.$t('overview.patrolMethod'),
          'width': '13%',
          'className': 'col1'
        },
        {
          'prop': 'inspectTagName',
          'label': this.$t('overview.patrolLists'),
          'width': '13%',
          'className': 'col1'
        },
        {
          'prop': 'schedule',
          'label': this.$t('overview.planDes'),
          'width': '35%',
          'className': 'col3'
        },
        {
          'prop': 'mode',
          'label': this.$t('overview.planFre'),
          'width': '25%',
          'className': 'col4'
        }
      ],
      implementTableData: [],
      implementPDFData: [],
      implementTableInfo: [
        {
          'prop': 'fromDateStr',
          'label': this.$t('overview.patrolDate')
        },
        {
          'prop': 'modeStr',
          'label': this.$t('overview.patrolMethod')
        },
        {
          'prop': 'toDateStr',
          'label': this.$t('overview.missionValidity')
        },
        {
          'prop': 'inspectTagName',
          'label': this.$t('overview.patrolLists')
        },
        {
          'prop': 'percentSchedule',
          'label': this.$t('overview.taskPerformance')
        }
      ],
      expands: [],
      rowClass: 'row-class',
      insideCellClass: 'inside-cell-class',
      insideHeaderClass: 'inside-header-class',
      insideRowClass: 'inside-row-class',
      elPDFtableData: [],
      htmlTitle: this.$t('overview.htmltopdfC'),
      defaultSort: { prop: 'completionRateStr', order: 'ascending' },
      inspectTagId: -1,
      inspectList: []
    };
  },

  computed: {
    ...mapGetters({
      accountChanged: 'accountChanged'
    })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        this.dateValue = [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()];
        this.defaultSort = { prop: 'completionRateStr', order: 'ascending' };
        this.params = {};
        this.getSearchParams();
        this.getInspctList();
      }
    }
  },

  async created() {
    this.getSearchParams();
    this.getInspctList();
  },

  methods: {
    getInspectorPlan(params) {
      return new Promise((resolve, reject) => {
        GetScheduleTaskList(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async handleDown() {
      let self = this;
      self.ispdf = true;
      self.inspectList.forEach(item => {
        if (item.id === self.inspectTagId) {
          self.inspectName = item.name;
        }
      });
      self.storeDateValue = self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      require.ensure([], async() => {
        if (self.total > 0) {
          require.ensure([], async() => {
            self.params.filter = {
              'page': 0,
              'size': self.total
            };
            let regionResult = await self.getInspectStatsPersonInfo(self.params);
            if (regionResult.errCode === 0) {
              let result = regionResult.data;
              if (result) {
                let dataLabel = new Array(result.content.length).fill(false);
                result.content.forEach(async(item, index) => {
                  item.completionRateStr = item.completionRate + '%';
                  await self.getPlanDetail(item.supervisorId);
                  item.planTableData = self.planTableData;
                  await self.getScheduleTaskImplementation(item.supervisorId);
                  item.implementTableData = self.implementTableData;
                  dataLabel[index] = true;

                  if (dataLabel.findIndex(p => p === false) === -1) {
                    new Promise(function(resolve) {
                      self.elPDFtableData = result.content;
                      resolve(true);
                    }).then(function() {
                      self.$print(self.$refs.printPDF);
                      self.ispdf = false;
                    }).catch(err =>{
                      console.log("SupervisorStatistics-handleDown:" + err);
                    });
                  }
                });
              }
            } else {
              self.ispdf = false;
              util.notify(self.$t('insSettingView.exportFailTitle'), 'warning', 3000);
              return false;
            }
          });
        } else {
          self.$print(self.$refs.printPDF);
          setTimeout(() => {
            self.ispdf = false;
          }, 1000);
        }
      });
    },

    getRowKeys(row) {
      return row.supervisorId;
    },

    expandSelect(row, expandedRows) {
      let self = this;
      if (expandedRows.length) {
        self.expands = [];
        if (row) {
          self.expands.push(row.supervisorId);
          self.getPlanDetail();
          self.getScheduleTaskImplementation();
        }
      } else {
        self.expands = [];
      }
    },

    sortChange(col) {
      let self = this;
      let order = col.order;
      self.order = order;
      self.direction = col.column.property;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        self.params.order = {
          'direction': 'asc',
          'property': col.column.property === 'completionRateStr' ? 'completionRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        self.params.order = {
          'direction': 'desc',
          'property': col.column.property === 'completionRateStr' ? 'completionRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.params.order = { 'direction': 'asc', 'property': 'completionRate' };
      }
      self.params.filter = {
        page: self.page - 1,
        size: self.sizeNum
      };
      self.getInspectPersonTable();
    },

    sizeChange(val) {
      let self = this;
      self.sizeNum = val;
      self.page = 1;
      self.params.filter = { page: self.page - 1, size: val };
      self.getInspectPersonTable();
    },

    currentChange(val) {
      let self = this;
      self.page = val;
      self.params.filter = { page: val - 1, size: self.sizeNum };
      self.getInspectPersonTable();
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(res => {
          reject(res);
        });
      });
    },

    dateChange(val) {
      this.currentIndex = 0;
      this.dateValue = val;
      let start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      let end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const daysDiff = this.$moment(end).diff(start, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
      this.params.beginTs = start;
      this.params.endTs = end;
      this.searchData();
    },

    async searchData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = { direction: this.direction, property: this.property };
      this.params.inspectTagId = parseInt(this.inspectTagId);
      this.saveSearchParams();
      await this.getInspectPersonTable();
    },

    getInspectScheduleImplemention(params) {
      return new Promise((resolve, reject) => {
        getInspectScheduleOverview(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err)
        });
      })
    },

    export2Excel() {
      let that = this;
      if (that.supervisorTableData.length === 0) {
        util.notify(that.$t('overview.emptyPatrolList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        let { export_json_to_excel } = require('@/excel/Export2Excel');
        let tHeader = that.exportItmesHeader;
        let filterVal = ['supervisorName', 'numOfStores', 'numOfTasked', 'numOfCompleted',
                          'numOfUnscheduled', 'completionRatePer'];
        let self = this;
        self.params.filter = {
          'page': 0,
          'size': self.total
        };
        let regionResult = await that.getInspectStatsPersonInfo(self.params);
        let curData = [];
        if (regionResult.errCode === 0) {
          let result = regionResult.data;
          if (result) {
            result.content.forEach(item => {
              item.completionRatePer = item.completionRate + '%';
            });
            curData = result.content;
          }
        }
        let data = that.formatJson(filterVal, curData);
        let fileName = 'Supervisor' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },

    async getPlanDetail(e) {
      let self = this;
      let params = {};
      let supervisorId = '';
      if (e != undefined) {
        supervisorId = e;
      } else {
        supervisorId = self.expands[0];
      }
      params.supervisorId = supervisorId;
      params.category = [0, 1];
      let result = await self.getInspectorPlan(params);
      let retData = await self.getBriefStoreData();
      let storeList = retData.data;
      let errCode = result.errCode;
      if (errCode === 0) {
        let resultData = result.data;
        resultData.forEach(item => {
          item.category = item.category === 0 ? self.$t('overview.remotePatrol') : self.$t('overview.onsitePatrol');
          let scheduleStr = '';
          let store = '';
          storeList.forEach(store_item => {
            item.appliedStores.forEach((app_item) => {
              if (store_item.storeId === app_item) {
                store += store_item.name + ',';
              }
            });
          });
          item.appliedStores = store.substring(0, store.length - 1);
          switch (item.mode) {
            case 1:
              item.mode = self.$t('overview.superTaskmode1');
              item.schedule.forEach((_item, _index) => {
                let isuu = _index === item.schedule.length - 1 ? '' : ',';
                if (self.lang !== 'en') {
                  if (_item.day === 7) {
                    _item.day = self.$t('overview.superTaskmode0');
                  }
                  scheduleStr += self.$t('overview.weeks') + _item.day + isuu;
                } else {
                  scheduleStr += self.week[_item.day - 1] + isuu;
                }
              });
              if (self.lang !== 'en') {
                item.schedule = self.$t('overview.everydays') + scheduleStr + self.$t('overview.act');
              } else {
                item.schedule = self.$t('overview.act') + scheduleStr + self.$t('overview.everydays');
              }
              break;
            case 2:
              item.mode = self.$t('overview.superTaskmode2');
              item.schedule.forEach((_item, _index) => {
                let isuu = _index === item.schedule.length - 1 ? '' : ',';
                if (self.lang !== 'en') {
                  scheduleStr += _item.day + self.$t('overview.daysww') + isuu;
                } else {
                  let idx = _item.day > 3 ? 3 : _item.day - 1;
                  scheduleStr += _item.day + self.month[idx] + isuu;
                }
              });
              if (self.lang !== 'en') {
                item.schedule = self.$t('overview.eachmonth') + scheduleStr + self.$t('overview.act');
              } else {
                item.schedule = self.$t('overview.act') + scheduleStr + self.$t('overview.eachmonth');
              }
              break;
            default:
              item.mode = self.$t('overview.superTaskmode3');
              item.schedule.forEach((_item, _index) => {
                let days = self.$moment('20200101').add(_item.day, 'days');
                let isuu = _index === item.schedule.length - 1 ? '' : ',';
                if (self.lang !== 'en') {
                  scheduleStr += days.format('M') + self.$t('overview.superTaskmode2') + days.format('D')
                    + self.$t('overview.superTaskmode0') + isuu;
                } else {
                  scheduleStr += days.format('LL') + ' ';
                }
              });
              if (self.lang !== 'en') {
                item.schedule = scheduleStr + self.$t('overview.act');
              } else {
                item.schedule = self.$t('overview.act') + scheduleStr;
              }
              break;
          }
        });
        self.planTableData = resultData;
      } else {
        self.planTableData = [];
      }
    },

    async getScheduleTaskImplementation(e) {
      let self = this;
      let params = {};
      let supervisorId = '';
      if (e != undefined) {
        supervisorId = e;
      } else {
        supervisorId = self.expands[0];
      }
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.supervisorId = supervisorId;
      params.filter = {
        'page': 0,
        'size': 3
      };
      let result = await self.getInspectScheduleImplemention(params);
      let errCode = result.errCode;
      if (errCode === 0) {
        let resultData = result.data;
        try {
          let content = resultData.content;
          content.forEach(item => {
            item.fromDateStr = self.$moment(item.fromDate).format('YYYY-MM-DD HH:mm:ss');
            item.toDateStr = self.$moment(item.toDate).format('YYYY-MM-DD HH:mm:ss');
            item.modeStr = item.mode === 0 ? self.$t('overview.remotePatrol') : self.$t('overview.onsitePatrol');
            let completedStoresStr = '';
            let completeStoresNum = 0;
            completeStoresNum = item.completedStores.length;
            item.completedStores.forEach(_item => {
              completedStoresStr += _item + ',';
            });
            let incompletedStoresStr = '';
            let incompleteStoresNum = 0;
            incompleteStoresNum = item.incompleteStores.length;
            item.incompleteStores.forEach(_item => {
              incompletedStoresStr += _item + ',';
            });
            completedStoresStr = completedStoresStr.slice(0, completedStoresStr.length - 1);
            incompletedStoresStr = incompletedStoresStr.slice(0, incompletedStoresStr.length - 1);
            item.completedStoresStr = completeStoresNum === 0 ? self.$t('overview.none') : completedStoresStr;
            item.incompletedStoresStr = incompleteStoresNum === 0 ? self.$t('overview.none') : incompletedStoresStr;
            let sumStores = completeStoresNum + incompleteStoresNum;
            let percentSchedule = 0;
            if (sumStores === 0) {
              percentSchedule = 0;
            } else {
              let percent = completeStoresNum / sumStores * 100;
              percentSchedule = percent.toFixed(0) + '%';
            }
            item.percentSchedule = percentSchedule;
          });
          self.implementTableData = content;
        } catch (e) {
          self.implementTableData = [];
        }
      }
    },

    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('supervisorStatistics');
      if (Object.keys(searchParams).length > 0) {
        this.dateValue[0] = new Date(searchParams.beginTs);
        this.dateValue[1] = new Date(searchParams.endTs);
        this.params.beginTs = searchParams.beginTs;
        this.params.endTs = searchParams.endTs;
        this.page = searchParams.filter.page + 1;
        this.sizeNum = searchParams.filter.size;
        this.direction = searchParams.order.direction;
        this.property = searchParams.order.property;
        this.params.filter = searchParams.filter;
        this.params.order = searchParams.order;
        if (!searchParams.inspectTagId) {
          this.params.inspectTagId = this.inspectTagId;
        } else {
          this.params.inspectTagId = searchParams.inspectTagId;
          this.inspectTagId = searchParams.inspectTagId;
        }
        this.setDefaultSort();
      } else {
        const start = typeof (this.dateValue[0]) === 'object' ? this.dateValue[0].getTime() : this.dateValue[0];
        const end = typeof (this.dateValue[1]) === 'object' ? this.dateValue[1].getTime() : this.dateValue[1];
        this.params.beginTs = start;
        this.params.endTs = end;
        this.params.filter = { page: this.page - 1, size: this.sizeNum };
        this.params.order = { direction: this.direction, property: this.property };
        this.params.inspectTagId = this.inspectTagId;
        this.defaultSort = { prop: 'completionRateStr', order: 'ascending' };
      }
    },

    setDefaultSort() {
      this.defaultSort.order = this.direction === 'asc' ? 'ascending' : 'descending';
      this.defaultSort.prop = this.property === 'completionRate' ? 'completionRateStr' : this.property;
    },

    getInspctList() {
      const params = {};
      params.appliedOnly = 1;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList(params).then(res => {
          if (res.errCode === 0) {
            this.inspectList = res.data;
            if(this.inspectTagId === -1){
              this.inspectTagId = this.inspectList.length > 0 ? this.inspectList[0].id : -1;
            }
            this.getInspectPersonTable();
            resolve(res);
          } else {
            this.inspectList = [];
            this.inspectTagId = -1;
            resolve(res);
          }
        }).catch(err => {
          console.log('SupervisorStatistics-getInspctList:' + err);
        })
      })
    },

    async getInspectPersonTable() {
      this.params.inspectTagId = this.inspectTagId;
      this.getInspectStatsPersonInfo(this.params).then(res => {
        const errCode = res.errCode;
        if (errCode === 0) {
          const resultData = res.data;
          const content = resultData.content;
          content.forEach(item => {
            item.completionRateStr = item.completionRate + '%';
          });
          this.supervisorTableData = resultData.content;
          this.total = resultData.totalElements;
        }
      }).catch(e => {
        console.log('SupervisorStatistics-getInspectPersonTable:' + e);
        self.supervisorTableData = [];
      })
    },

    saveSearchParams() {
      const searchConditon = {
        path: 'supervisorStatistics',
        params: this.params
      }
      SearchConditionUtil.saveSearchCondition(searchConditon)
    },

    getInspectStatsPersonInfo(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverPersonV2(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err)
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $excellent: #57e78f;
  $pass: #72a1f3;
  $failed: #ffd035;
  $ignored: #cad1db;

  .item-container{
    padding-bottom: 20px;
    .statistics-header{
      margin-bottom: 30px;
      border-bottom: 1px solid $border;
      background-color: #fff;
      padding-top: 30px;
      padding-bottom: 30px;
      color: $black;
      text-align: left;
      .header-mul-select{
        display: inline-block;
        .mul-label{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
          color: $black;
        }
      }
      .header-details{
        text-align: left;
        padding-left: calc(40/1920*100vw);
        position: relative;
        display: inline-block;
        .search-content{
          display: inline-block;
        }
        .date-range {
          border: 1px solid #ccc;
          width: 200px;
          height: calc(35 / 1920 * 100vw);
          min-height: 28px;
        }
        .item {
          color: $tab;
          margin-left: calc(20 / 1920 * 100vw);
          margin-right: calc(8 / 1920 * 100vw);
        }
        .iconbangzhu{
          font-size: calc(20/1920*100vw);
          position: relative;
          color: $tab;
        }
        span{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
          color: $black;
        }
        @media screen and(max-width: 1366px){
          .en-span-class{
            margin-right: 60px;
          }
        }
        .el-province{
          width: calc(160/1920*100vw);
          margin-right: calc(15/1920*100vw);
          min-width: 85px;
          min-height: 28px;
        }
        .search-btn{
          width: calc(130/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
        }
        .en-search-btn{
          width: calc(130/1920*100vw);
          margin-left: calc(20/1920*100vw);
          border-color: $red;
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
        }
      }
      .header-details:nth-child(1){
        padding-right: calc(60/1920*100vw);
      }
      .header-details:nth-child(2){
        padding-top:15px;
        padding-bottom: 30px;
        padding-right: calc(60/1920*100vw);
      }
    }
    .items-content{
      padding: 0 calc(30/1920*100vw) 0;
      .export-header{
        min-height: 50px;
        margin-bottom: 20px;
        border: 1px solid $border;
        background-color: #fff;
        padding: 10px 30px;
        color: $black;
        text-align: left;
        font-size: calc(14/1920*100vw);
        p{
          margin:10px 0;
          display: inline-block;
          margin-right: 40px;
        }
      }
      .contents-container{
        background-color: #fff;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          margin-bottom: 30px;
          .title {
            padding-top: 30px;
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            color: $black;
            display: inline-block;
          }
        }
      .items-table{
        .table{
          margin: 0 calc(30/1920*100vw);
        }
        .clearfix{
          content: "";
          display: block;
          height: 0;
          clear:both;
          overflow: auto;
        }
        .toolbar{
          float: right;
          margin: 30px calc(30/1920*100vw);
          margin-right: 0;
          height:13%;
        }
      }
    }

  }
</style>
