<template>
  <div class="el-overview-content">
    <div class="el-date">
      <span class="date-title">{{ $t('overview.date') }}</span>
      <el-date-picker
        ref="datePicker"
        v-model="dateValue"
        :clearable="false"
        :editable="false"
        :popper-class="poperClass"
        :picker-options="dateOpt"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator="-"
        size="mini"
        format="yyyy/MM/dd"
        class="date-range"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        unlink-panels
        @change="dateChange"
      />
      <el-tooltip
        class="item"
        effect="dark"
        placement="right">
        <div slot="content">{{ $t('overview.dataRangeTips') }}</div>
        <i class="iconfont icon-bangzhu iconbangzhu"/>
      </el-tooltip>
      <span class="el-store">
        {{ $t('overview.totalStore') }}{{ numOfStores }}{{ $t('overview.totalUnit') }}
      </span>
    </div>
    <div class="el-overview">
      <el-row class="first-row">
        <el-col :span="4" class="kpi-list">
          <div class="title">{{ $t('overview.kpiIndex') }}</div>
          <div class="kpi-content">
            <div v-for="(item,index) in eventKPIs" :key="index" class="event-list">
              <div class="event-title">{{ item.eventTitle }}</div>
              <div class="event-num">{{ item.eventNum }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="isEnSpan? 13: 14" class="store-events">
          <div class="title">{{ $t('overview.eventTrends') }}</div>
          <div class="region-result">
            <div class="store-list">
              <span class="store-name">{{ $t('overview.selectStores') }}</span>
              <el-select v-model="curStore" style="width: 200px" size="mini" @change="changeStore">
                <el-option
                  v-for="item in storeDataList"
                  :key="item.storeId"
                  :label="item.label"
                  :value="item.storeId"
                />
              </el-select>
            </div>
            <div class="charts-content">
              <v-chart ref="storeEventRef" :options="storeEventsOptions" :auto-resize="true"
                       class="result-content"/>
            </div>
          </div>

        </el-col>
        <el-col :span="isEnSpan ? 7 : 6" class="source-list">
          <div class="title">
            <span class="area-title">{{ $t('overview.eventSource') }}</span>
          </div>
          <div class="pct-content">
            <div class="pct-panel">
              <v-chart ref="eventSourceRef" :auto-resize="true" :options="eventSourceOptions"
                       class="chart-content"/>
            </div>
            <div class="pct-nums">
              <div v-for="(item, index) in sourcePerArray" :class="lang === 'en'? 'en-label' : ''" :key="index"
                   class="content-labels">
                <div class="excellent_nums">{{ item.percent }}%</div>
                <div class="excellent_labels">
                  <span :class="`label-` + index" class="labels excellent-label"/>
                  <span class="label-desc">{{ item.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="second-row">
        <el-col :span="isEnSpan? 7: 6" class="status-list">
          <div class="status-title">
            {{ $t('overview.eventStatus') }}
          </div>
          <div class="pct-content">
            <div class="pct-panel">
              <v-chart ref="eventStatusRef" :auto-resize="true" :options="eventStatusOptions"
                       class="chart-content"/>
            </div>
            <div class="pct-nums">
              <div v-for="(item, index) in statusPerArray" :key="index" class="content-labels">
                <div class="excellent_nums">{{ item.percent }}%</div>
                <div class="excellent_labels">
                  <span :class="`label-` + index" class="labels excellent-label"/>
                  <span class="label-desc">{{ item.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="isEnSpan ? 17 : 18">
          <div class="store-status-panel" >
            <div class="store-statul-title">{{ $t('overview.eventHading') }}</div>
            <div class="store-panel">
              <div class="store-list">
                <span class="store-name">{{ $t('overview.rankType') }}</span>
                <el-select v-model="rankType"  style="width: 200px" size="mini" @change="changeRankType">
                  <el-option
                    v-for="item in rankTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="status-content">
                <v-chart ref="storeStatusRef" :options="storeStatusOptions" :auto-resize="true"
                         class="result-content"/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/radar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/effectScatter';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/geo';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/dataset';
import 'echarts/map/js/world';
import 'zrender/lib/svg/svg';
import util from '../../common/util.js';
import { getStoreList, getBriefStoreList } from '@/api/store';
import { getCookie } from '@/common/auth';
import { mapGetters } from 'vuex';
import { getEventStatsOverview, getEventStatsRankInfo, getEventStatsOverStore } from '@/api/eventOverview';

export default {
  name: 'ExceptEvent',

  components: {
    'v-chart': ECharts
  },

  data() {
    return {
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      toolTipClass: 'page-login-toolTipClass',
      numOfStores: 0,
      varWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      eventKPIs: [
        {
          eventTitle: this.$t('overview.todayNewEvent'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('overview.todayClosedEvent'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('overview.notClosedEvent'),
          eventNum: 0
        }
      ],
      storeDataList: [],
      checkAllStore: true,
      storeIds: [],
      curStore: this.$t('overview.all'),
      storeName: this.$t('overview.all'),
      showMonthDrap: false,
      showStoreContent: false,
      eventBySource: [
        {
          'sourceType': 0,
          'numOfEvent': 0
        },
        {
          'sourceType': 1,
          'numOfEvent': 0
        },
        {
          'sourceType': 2,
          'numOfEvent': 0
        }
      ],
      eventByStatus: [
        {
          'status': 0,
          'numOfEvent': 0
        },
        {
          'status': 1,
          'numOfEvent': 0
        },
        {
          'status': 2,
          'numOfEvent': 0
        }
      ],
      sourceLegend: [
        {
          'type': this.$t('overview.remotePatrol'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.onsitePatrol'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.storeMonitor'),
          'percent': '0%'
        }
      ],
      statusLegend: [
        {
          'type': this.$t('overview.pending'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.done'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.closed'),
          'percent': '0%'
        }
      ],
      itemsPerArray: [],
      params: {},
      poperClass: 'date-picker-poper',
      selectpoperClass: 'select-poper',
      lang: this.$i18n.locale,
      isEnSpan: false,
      timeMode: 1, // weekly mode
      daysRangeList: [],
      regionList: [],
      topRegionOption: null,
      regionResultList: [],
      regionTopFive: [],
      echartColor: '#7d8cab',
      regionChartEmpty: true,
      storeEventsOptions: null,
      eventSourceOptions: null,
      sourcePerArray: [],
      eventStatusOptions: null,
      statusPerArray: [],
      newColor: '#f31d65',
      pendingColor: '#fea316',
      doneColor: '#434c5e',
      closedColor: '#72a1f3',
      rankType: 3,
      rankTypeArr: [
        {
          'value': 3,
          'label': this.$t('overview.totaFive')
        },
        {
          'value': 0,
          'label': this.$t('overview.pendingFive')
        },
        {
          'value': 2,
          'label': this.$t('overview.closedFive')
        }
      ],
      storeStatusOptions: null,
      storeStatusLegend: [
        '门店名称',
        this.$t('overview.pendingEvent'),
        this.$t('overview.processedEvent'),
        this.$t('overview.closedEvents')
      ],
      storeEventList: [],
      storeEventLegend: [
        '日期',
        this.$t('overview.createdEvent'),
        this.$t('overview.processedEvent'),
        this.$t('overview.closedEvents')
      ],
      echartAxiasColor: '#e3e9f4',
      echartBackground: 'rgba(30,34,52,0.75)',
      sidebarElm: null,
      fontFamily: 'Roboto, Microsoft YaHei'
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      console.log(val);
      let self = this;
      if (val !== 0) {
        self.timeMode = 1;
        self.rankType = 3;
        self.checkAllStore = true;
        self.storeIds = [];
        self.storeName = this.$t('overview.all');
        self.curStore = this.$t('overview.all');
        self.getBriefStoreData();
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initData();
      }
    }
  },

  created() {
    let self = this;
    self.getBriefStoreData();
    let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
    let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
    self.params.beginTs = start;
    self.params.endTs = end;
    self.initData();
  },

  mounted() {
    let self = this;
    self.sidebarElm = document.getElementsByClassName('aside-menu')[0];
    self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false);
    window.addEventListener('resize', self.adjustChart, false);
  },

  beforeDestroy() {
    let self = this;
    window.removeEventListener('resize', self.adjustChart);
    self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar);
    self.$refs.storeEventRef && self.$refs.storeEventRef.dispose();
    self.$refs.storeStatusRef && self.$refs.storeStatusRef.dispose();
    self.$refs.eventSourceRef && self.$refs.eventSourceRef.dispose();
    self.$refs.eventStatusRef && self.$refs.eventStatusRef.dispose();
  },

  methods: {
    dateChange(val) {
      let self = this;
      console.log(val);
      let start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      let end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      let daysDiff = self.$moment(end).diff(start, 'days');
      if (daysDiff < 6) {
        self.$message({
          message: self.$t('overview.changeTimeRange'),
          type: 'warning'
        });
        start = end - 3600 * 24 * 6 * 1000;
        start = self.$moment(start).startOf('d').toDate().valueOf();
        self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      }
      if (daysDiff > 364) {
        self.$message({
          message: self.$t('overview.changeTimeRange'),
          type: 'warning'
        });
        start = end - 3600 * 24 * 364 * 1000;
        start = self.$moment(start).startOf('d').toDate().valueOf();
        self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      } else {
        self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      }
      daysDiff = self.$moment(end).diff(start, 'days');
      daysDiff <= 30 ? self.timeMode = 1 : self.timeMode = 2;
      console.log(self.timeMode);
      self.params.beginTs = start;
      self.params.endTs = end;
      self.initData();
    },

    getBriefStoreData() {
      let self = this;
      getBriefStoreList().then(res => {
        let errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          let storeList = res.data;
          let tempStore = [];
          tempStore.push(
            { storeId: '-1',
              label: self.$t('overview.all'),
              value: self.$t('overview.all') }
          );
          storeList.forEach(item => {
            let obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              checked: true
            };
            tempStore.push(obj);
          });
          self.storeDataList = tempStore;
        }
      });
    },

    changeStore(val) {
      let self = this;
      console.log(val);
      self.storeIds = [];
      if (val === -1) {
        self.storeIds = [];
      } else {
        self.storeIds.push(self.curStore);
      }
      self.getStoreEventStatics();
    },

    choiceStore() {
      let self = this;
      self.showStoreContent = !self.showStoreContent;
      self.showMonthDrap = true;
    },

    changeStoreItem(item) {
      let self = this;
      self.checkAllStore = false;
      if (item === -1) {
        self.checkAllStore = true;
        self.storeName = self.$t('overview.all');
        self.storeIds = [];
        self.storeDataList.forEach(item => {
          item.checked = true;
        });
      } else {
        console.log(item);
        let daysStr = '';
        let selectedStores = [];
        daysStr = item.label;
        selectedStores.push(item.storeId);

        self.storeName = daysStr;
        self.storeIds = selectedStores;
        console.log(self.storeIds);
        console.log(self.storeName);
        self.storeDataList.forEach(item => {
          item.checked = false;
        });
        item.checked = true;
      }
      self.showStoreContent = false;
      self.showMonthDrap = false;
      self.getStoreEventStatics();
    },

    async getAllStoreList() {
      let self = this;
      let params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      let retData = await self.getStoreData(params);
      let storeList = retData.data.content;
      let tempStore = [];
      tempStore.push(
        { storeId: '-1',
          label: self.$t('overview.all'),
          value: self.$t('overview.all') }
      );
      storeList.forEach(item => {
        let obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName,
          checked: true
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
    },

    getStoreData(params) {
      let self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            let data = res.data;
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    initData() {
      let self = this;
      let start = self.params.beginTs;
      let end = self.params.endTs;
      let startDay = self.$moment(start).format('YYYY-MM-DD');
      let endDay = self.$moment(end).format('YYYY-MM-DD');
      let startDayWithoutYear = self.$moment(start).format('MM/DD');
      let endDayWithoutYear = self.$moment(end).format('MM/DD');
      if (self.timeMode === 1) {
        let beginDay = new Date(util.judgeStart(startDay));
        let weekList = util.getWeek(beginDay, endDay);
        let arrLength = weekList.length;
        let firstEndTime = weekList[0].split('-')[1];
        let firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
        let lastStartTime = weekList[arrLength - 1].split('-')[0];
        let lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
        weekList.splice(0, 1, firstWeekStr);
        weekList.splice(arrLength - 1, 1, lastWeekStr);
        console.log(weekList);
        self.daysRangeList = weekList;
      } else if (self.timeMode === 2) {
        let monthArray = util.getMonthBetween(startDay, endDay);
        console.log(monthArray);
        self.daysRangeList = monthArray;
      }
      self.getEventStatsStatics();
      self.getEventRankingInfo();
      self.getStoreEventStatics();
    },

    async getEventStatsStatics() {
      let self = this;
      let eventResult = await self.getEventStatsOverview(self.params);
      console.log(eventResult);
      if (eventResult.errCode === 0) {
        let result = eventResult.data;
        if (result) {
          self.eventKPIs[0].eventNum = result.numOfNewEventsToday;
          self.eventKPIs[1].eventNum = result.numOfClosedEventsToday;
          self.eventKPIs[2].eventNum = result.numOfOpenEvents;
          self.numOfStores = result.numOfStores;
          self.eventBySource = result.eventBySource;
          self.eventByStatus = result.eventByStatus;
        } else {
          self.eventKPIs.forEach(item => {
            item.eventNum = 0;
          });
        }
      }
      self.getEventBySourcePie();
      self.getEventByStatusPie();
    },

    getEventStatsOverview(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverview(params).then(res => {
          resolve(res);
        })
        .catch(err => {
        reject(err);
      })
      });
    },

    getEventBySourcePie() {
      let self = this;
      let jsonArray = self.sourceLegend;
      let sourcePieList = self.eventBySource;
      console.log(sourcePieList);
      let remoteEventNum = 0;
      let onsiteEventNum = 0;
      let storeEventNum = 0;

      let sumEvent = 0;
      let seriesData = 0;
      sourcePieList.forEach((item, index) => {
        sumEvent += item.numOfEvent;
        if (index === 0) {
          storeEventNum = item.numOfEvent;
        } else if (index === 1) {
          remoteEventNum = item.numOfEvent;
        } else if (index === 2) {
          onsiteEventNum = item.numOfEvent;
        }
      });
      let totalArray = [remoteEventNum, onsiteEventNum, storeEventNum];
      console.log(totalArray);
      jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
      jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
      jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
      if (sumEvent !== 0) {
        seriesData = [
          { value: remoteEventNum, name: self.$t('overview.remotePatrol') },
          { value: onsiteEventNum, name: self.$t('overview.onsitePatrol') },
          { value: storeEventNum, name: self.$t('overview.storeMonitor') }
        ];
      } else {
        seriesData = [];
      }
      self.eventSourceOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          textStyle: {
            align: 'left'
          },
          backgroundColor: self.echartBackground
        },
        textStyle: {
          fontFamily: self.fontFamily
        },
        series: [
          {
            name: '事件来源占比',
            type: 'pie',
            radius: ['70%', '85%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  let colorList = ['#f31d65', '#fb804f', '#fccc3f'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      self.sourcePerArray = jsonArray;
      console.log(self.sourcePerArray);
    },
    getEventByStatusPie() {
      let self = this;
      let jsonArray = self.statusLegend;
      let statusPieList = self.eventByStatus;
      let pendingEventNum = 0;
      let doneEventNum = 0;
      let closedEventNum = 0;

      let sumEvent = 0;
      let seriesData = [];
      statusPieList.forEach((item, index) => {
        sumEvent += item.numOfEvent;
        if (index === 0) {
          pendingEventNum = item.numOfEvent;
        } else if (index === 1) {
          doneEventNum = item.numOfEvent;
        } else if (index === 2) {
          closedEventNum = item.numOfEvent;
        }
      });
      let totalArray = [pendingEventNum, doneEventNum, closedEventNum];
      console.log(totalArray);
      jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
      jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
      jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
      if (sumEvent !== 0) {
        seriesData = [
          { value: pendingEventNum, name: self.$t('overview.pendingEvent') },
          { value: doneEventNum, name: self.$t('overview.processedEvent') },
          { value: closedEventNum, name: self.$t('overview.closedEvents') }
        ];
      } else {
        seriesData = [];
      }
      self.eventStatusOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          textStyle: {
            align: 'left'
          },
          backgroundColor: self.echartBackground
        },
        textStyle: {
          fontFamily: self.fontFamily
        },
        series: [
          {
            name: '事件处理状态占比',
            type: 'pie',
            radius: ['70%', '85%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  var colorList = [self.pendingColor, self.doneColor, self.closedColor];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      self.statusPerArray = jsonArray;
      console.log(self.statusPerArray);
    },

    async getEventRankingInfo() {
      let self = this;
      let params = {};
      params = JSON.parse(JSON.stringify(self.params));
      params.numOfStores = 5;
      params.rankType = self.rankType;
      let axisArray = [];
      let colorArray = [];
      let seriesData = [];
      if (self.rankType === 0) {
        axisArray = ['门店名称', self.$t('overview.pendingEvent')];
        colorArray = [self.pendingColor];
        seriesData = [{ type: 'bar', stack: 'test', barWidth: 35 }];
      } else if (self.rankType === 2) {
        axisArray = ['门店名称', self.$t('overview.closedEvents')];
        colorArray = [self.closedColor];
        seriesData = [{ type: 'bar', stack: 'test', barWidth: 35 }];
      } else {
        axisArray = ['门店名称', self.$t('overview.pendingEvent'), self.$t('overview.processedEvent'), self.$t('overview.closedEvents')];
        colorArray = [self.pendingColor, self.doneColor, self.closedColor];
        seriesData = [
          { type: 'bar', stack: 'test', barWidth: 35 },
          { type: 'bar', stack: 'test', barWidth: 35 },
          { type: 'bar', stack: 'test', barWidth: 35 }
        ];
      }
      let rankingResult = await self.getEventStatsRanking(params);
      console.log(rankingResult);
      let rankingOption = self.getEventRankingOption(colorArray, seriesData)
      if (rankingResult.errCode === 0) {
        let result = rankingResult.data;
        console.log(result);
        self.statusStoreList = result;
        let soureceList = [];
        soureceList.push(axisArray);
        result.forEach(item => {
          let itemArray = [];
          itemArray.push(item.storeName);
          if (self.rankType === 3) {
            itemArray.push(item.numOfUnprocessed);
            itemArray.push(item.numOfInprocess);
            itemArray.push(item.numOfProcessed);
          } else if (self.rankType === 0) {
            itemArray.push(item.numOfUnprocessed);
          } else if (self.rankType === 2) {
            itemArray.push(item.numOfProcessed);
          } else {

          }
          soureceList.push(itemArray);
        });
        console.log(soureceList);
        rankingOption.dataset.source = soureceList;
      } else {
        rankingOption.dataset.source = [];
      }
      self.storeStatusOptions = rankingOption;
    },

    getEventRankingOption(colorArray, seriesData){
      let rankingOption = {
          color: colorArray,
          legend: {
            x: 'center',
            y: 'bottom',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            padding: 0,
            icon: 'rect',
            textStyle: {
            color: this.echartColor,
              fontSize: 12,
              padding: [0, 0, 0, 5]
          }
        },
        grid: {
          containLabel: true,
            top: '10',
            left: '8',
            right: '0',
            bottom: '32'
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        tooltip: {
          trigger: 'axis',
            axisPointer: {
            type: 'none'
          },
          padding: 5,
            textStyle: {
            align: 'left'
          },
          backgroundColor: this.echartBackground
        },
        dataset: {
          source: []
        },
        xAxis: {
          type: 'category',
            axisTick: {
            show: false,
              inside: true,
              lineStyle: {
              color: '#7D8CAB',
                fontSize: 12
            }
          },
          splitLine: {
            show: false,
              lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false,
              lineStyle: {
              color: '#7D8CAB'
            }
          },
          axisLabel: {
            fontStyle: 12,
              margin: 10
          }
        },
        yAxis: {
          // interval: 20,
          minInterval: 20,
            axisTick: {
            show: false,
              inside: true,
              lineStyle: {
              color: '#7D8CAB',
                fontSize: 12
            }
          },
          splitLine: {
            show: true,
              lineStyle: {
              color: this.echartAxiasColor,
                width: 1
            }
          },
          axisLine: {
            show: false,
              lineStyle: {
              color: '#7D8CAB'
            }
          },
          axisLabel: {
            fontStyle: 12,
              margin: 10
          }
        },
        series: seriesData
      };
      return rankingOption;
    },

    getEventStatsRanking(params) {
      return new Promise((resolve, reject) => {
        getEventStatsRankInfo(params).then(res => {
          resolve(res);
        })
        .catch(err => {
        reject(err)
      });
      });
    },

    async getStoreEventStatics() {
      let self = this;
      let params = {};
      params = JSON.parse(JSON.stringify(self.params));
      params.storeIds = self.storeIds;
      params.timeMode = self.timeMode;
      let storeEventResult = await self.getStoreEventData(params);
      let option = {
        color: [self.newColor, self.doneColor, self.closedColor],
        legend: {
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          padding: 0,
          icon: 'rect',
          textStyle: {
            color: self.echartColor,
            fontSize: 12,
            padding: [0, 0, 0, 5],
            height: 12,
            lineHeight: 12
          }
        },
        textStyle: {
          fontFamily: self.fontFamily
        },
        grid: {
          containLabel: true,
          top: '10',
          left: '8',
          right: '0',
          bottom: '32'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          padding: 5,
          textStyle: {
            align: 'left'
          },
          backgroundColor: self.echartBackground
        },
        dataset: {
          source: []
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            show: false,
            inside: true,
            lineStyle: {
              color: '#7D8CAB',
              fontSize: 12
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#7D8CAB'
            }
          },
          axisLabel: {
            fontStyle: 12,
            margin: 10
          }
        },
        yAxis: {
          type: 'value',
          // interval: 20,
          minInterval: 20,
          splitLine: {
            show: true,
            lineStyle: {
              color: self.echartAxiasColor,
              width: 1
            }
          },
          axisTick: {
            show: false,
            inside: true,
            lineStyle: {
              color: '#7D8CAB',
              fontSize: 12
            }
          },
          axisLine: {
            onZero: false,
            show: false,
            lineStyle: {
              color: '#7D8CAB'
            }
          },
          axisLabel: {
            show: true,
            fontStyle: 12,
            margin: 10
          }
        },
        series: [
          { type: 'line', areaStyle: { color: 'rgba(243,29,101, 0.1)' }, symbol: 'none' },
          { type: 'line', areaStyle: { color: 'rgba(67,76,94, 0.1)' }, symbol: 'none' },
          { type: 'line', areaStyle: { color: 'rgba(114,161,243, 0.1)' }, symbol: 'none' }
        ]
      };
      if (storeEventResult.errCode === 0) {
        let result = storeEventResult.data;
        console.log(result);
        self.storeEventList = result;
        let soureceList = [];
        soureceList.push(self.storeEventLegend);
        let sumOfNewEvents = 0;
        let sumOfProcessedEvents = 0;
        let sumOfClosedEvents = 0;
        result.forEach((item, index) => {
          let storeList = item.stores;
          storeList.forEach(_item => {
            sumOfNewEvents += _item.numOfNewEvents;
            sumOfProcessedEvents += _item.numOfProcessedEvents;
            sumOfClosedEvents += _item.numOfClosedEvents;
          });
          let itemArray = [];
          itemArray.push(self.daysRangeList[index]);
          itemArray.push(sumOfNewEvents);
          itemArray.push(sumOfProcessedEvents);
          itemArray.push(sumOfClosedEvents);
          soureceList.push(itemArray);
        });
        console.log(soureceList);
        option.dataset.source = soureceList;
      }
      console.log(option);
      self.storeEventsOptions = option;
    },
    getStoreEventData(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverStore(params).then(res => {
          resolve(res);
        });
      });
    },
    changeRankType(val) {
      let self = this;
      console.log(val);
      console.log(self.rankType);
      self.getEventRankingInfo();
    },
    toPercent(point) {
      let tempPoint = Number(point * 100);
      let str = '';
      util.isDot(tempPoint) ? str = tempPoint.toFixed(2) : str = tempPoint;
      str += '%';
      return str;
    },
    adjustChart() {
      let self = this;
      console.log('尺寸改变');
      self.$refs.storeEventRef.resize();
      self.$refs.storeStatusRef.resize();
      self.$refs.eventSourceRef.resize();
      self.$refs.eventStatusRef.resize();
    },
    handleSideBar(e) {
      if (e.target === e.currentTarget || e.target === this) {
        this.adjustChart();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/overview.scss";
</style>

<style>
  @import '../../assets/css/pagination.css';
  .date-picker-poper .el-button--text{
    visibility: hidden !important;
  }
  .item-process .el-progress-bar .el-progress-bar__outer{
    background-color: #fff;
  }
  .store-list .el-select.el-input__inner, .store-list .el-select .el-input__inner:focus{
    border: 1px solid #E4E7ED !important;
  }
  .store-list .el-select .el-input.is-focus .el-input__inner{
    border: 1px solid #E4E7ED !important;
  }
</style>
