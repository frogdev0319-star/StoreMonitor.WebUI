<template>
  <div class="el-overview-content">
    <div class="overview-date" style="margin-left:24px;">
      <date-time-selector :showTooltips="true" @change="dateChange"/>
      <span class="el-store">
        <!-- {{ $t('overview.totalStore', {storeNum: storeDataList.length-1}) }} -->
        {{ $t('overview.totalStore', {storeNum: storeList.length}) }}
      </span>

      <!-- 巡檢地點 -->
      <div class="store_title" style="margin-left: 30px; margin-right: 20px;" v-if="isiService || isTransform">{{ $t('overview.patrolStore')}}</div>
      <region-multi-select
        v-if="isiService || isTransform"
        ref="multiState"
        style="width: 30%; "
        :selected="selectedInstantStore"
        :options="storeList"
        :noTextInput = "true"
        :all="$t('remotePatrol.allStores')"
        class="position"
        @changeInput="storeChange"
        />
      <!-- <el-select
        v-model="selectedInstantStore"
        style="width: 30%;"
        :placeholder="$t('immediatePush.selectStore')" 
        filterable
        multiple
        @change="storeChange"
        >
        <el-option
          v-for="item in storeList"
          :key="item.storeId"
          :label="item.name"
          :value="item.storeId" 
          />
      </el-select> -->

    </div>
    <div class="el-overview">
      <el-row class="first-row paper">
        <!-- KPI指標 -->
        <el-col :span="4" class="kpi-list">
          <div class="title">{{ $t('overview.kpiIndex') }}</div>
          <div class="kpi-content">
            <div v-for="(item,index) in eventKPIs" :key="index" class="event-list">
              <div class="event-title">{{ item.eventTitle }}</div>
              <div class="event-num">{{ item.eventNum }}</div>
            </div>
          </div>
        </el-col>

        <div class="for_flex">
          <!-- 各門店事件趨勢分析 -->
          <el-col :span="isEnSpan ? 13 :20" class="store-events" style="width: 68%;" :class="{widewidth : !isLicensePro}">
            <div class="title">{{ $t('overview.eventTrends') }} </div>
            <div class="region-result">
              <div class="store-list">
                <span class="store-name">{{ $t('overview.selectStores') }}</span> 
                <el-select 
                  class="storevue-select" 
                  v-model="curStore" 
                  style="width: 200px" 
                  size="mini" 
                  @change="changeStore">
                  <el-option
                    v-for="item in storeDataList"
                    :key="item.storeId"
                    :label="item.name"
                    :value="item.storeId"
                  />
                </el-select>
              </div>
              <div class="charts-content">
                <v-chart
                  ref="storeEventRef"
                  :options="storeEventsOptions"
                  autoresize
                  class="result-content"/>
              </div>
            </div>
          </el-col>
          
          <!-- 事件來源 -->
          <el-col :span="isEnSpan ? 7 : 6" class="source-list" v-if="isLicensePro">
            <div class="title">
              <span class="area-title">{{ $t('overview.eventSource') }} </span>
            </div>
            <div class="pct-content">
              <div class="pie-area">
              <div class="pie-div">
                <div class="pct-panel">
                    <v-chart
                      ref="eventSourceRef"
                      autoresize
                      :options="eventSourceOptions"
                      class="chart-content"
                    />
                </div>
                </div>
              </div>
              <div class="pct-nums">
                <div
                  v-for="(item, index) in sourcePerArray"
                  :class="lang === 'en'? 'en-label' : ''"
                  :key="index"
                  class="content-labels">
                  <div class="excellent_nums">{{ item.percent }}%</div>
                  <div class="excellent_labels">
                    <span :class="`label-` + index" class="labels excellent-label"></span>
                    <span class="label-desc">{{ item.type }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </div>
      </el-row>

      <!-- 事件處理狀態 -->
      <el-row class="second-row ">
        <el-col :span="isEnSpan? 7: 6" class="status-list paper">
          <div class="status-title">
            {{ $t('overview.eventStatus') }}
          </div>
          <div class="pct-content">
            <!-- pie -->
            <div class="pie-area">
              <div class="pie-div">
                <div class="pct-panel">
                    <v-chart
                        ref="eventSourceRef"
                        autoresize
                        :options="eventStatusOptions"
                        class="chart-content"
                    />
                </div>
              </div>
            </div>
            <!-- nums -->
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

        <!-- 門店事件處理情況 -->
        <el-col :span="isEnSpan ? 17 : 18">
          <div class="store-status-panel paper" >
            <div class="store-statul-title">{{ $t('overview.eventHading') }}</div>
            <div class="store-panel">
              <div class="store-list">
                <span class="store-name">{{ $t('overview.rankType') }}</span>
                <el-select class="storevue-select" v-model="rankType" style="width: 320px" size="mini" @change="changeRankType">
                  <el-option
                    v-for="item in rankTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="status-content">
                <v-chart
                  ref="storeStatusRef"
                  :options="storeStatusOptions"
                  autoresize
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
import util from '@/common/util.js';
import { getBriefStoreList } from '@/api/store';
import { mapGetters } from 'vuex';
import { accountInfo } from '@/api/login';
import { getEventStatsOverview, getEventStatsRankInfo, getEventStatsOverStore } from '@/api/eventOverview';
import resize from '@/components/mixins/echartResize';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DateTimeSelector from '@/components/DateTimeSelector';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import jsCookie from 'js-cookie';

export default {
  name: 'EventOverview',

  components: {
    DateTimeSelector,
    RegionMultiSelect,
    'v-chart': ECharts
  },

  mixins: [resize],

  data() {
    return {
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
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
      curStore: '-1',
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
        // {
        //   'type': this.$t('overview.remotePatrol'),
        //   'percent': '0%'
        // },
        {
          id: 0,
          type: this.$t('overview.onsitePatrol'),
          percent: '0'
        },
        // {
        //   'type': this.$t('overview.storeMonitor'),
        //   'percent': '0%'
        // },
        // {
        //   'type': this.$t('immediatePush.immediateEvent'),
        //   'percent': '0%'
        // }
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
      newColor: '#f57848',
      pendingColor: '#f57848',
      doneColor: '#8fd92e',
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
      fontFamily: 'Roboto, Microsoft YaHei',
      hasAdvanced: false,
      isLicensePro: false,
      selectedInstantStore: [],
      storeList: [],
      isiService: false,
      isTransform: false
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.timeMode = 1;
        self.rankType = 3;
        self.checkAllStore = true;
        self.storeIds = [];
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        // await self.getSearchParams();
        var userInfo = await self.$store.dispatch("GetUserAuthorities");
        self.hasAdvanced = userInfo.data.isSystemAdvanced
        self.isLicensePro = userInfo.data.isLicensePro
        console.log('self.hasAdvanced :>> ', self.hasAdvanced);
        console.log('self.isLicensePro :>> ', self.isLicensePro);
        console.log('this.sourceLegend :>> ', this.sourceLegend);

        var isAddItem = this.sourceLegend.some(i => i.id == 1)
        console.log('isAddItem :>> ', isAddItem);
        if(!isAddItem && this.isLicensePro ){
          this.sourceLegend.push(
            {
              id: 1,
              type: this.$t('immediatePush.immediateEvent'), 
              percent: '0'
            }
          ) 
        }
        await self.getBriefStoreData();
        await self.saveSearchParams();
        await self.getEventOverviewData();
        await self.getAccountInfo();
      }
    }
  },

  async created() {
    // await this.getBriefStoreData();
    // await this.getEventOverviewData();

    await this.getSearchParams();
    var userInfo = await this.$store.dispatch("GetUserAuthorities");
    this.hasAdvanced = userInfo.data.isSystemAdvanced
    this.isLicensePro = userInfo.data.isLicensePro

    console.log('this.hasAdvanced cc:>> ', this.hasAdvanced);
    console.log('this.isLicensePro cc:>> ', this.isLicensePro);

    this.isLicensePro ? this.sourceLegend.push(
      {
        id: 1,
        type: this.$t('immediatePush.immediateEvent'), 
        percent: '0'
      }
    ) : null

    this.getAccountInfo()
  
  },

  async mounted() {},

  beforeDestroy() {
    this.$refs.storeEventRef && this.$refs.storeEventRef.dispose();
    this.$refs.storeStatusRef && this.$refs.storeStatusRef.dispose();
    this.$refs.eventSourceRef && this.$refs.eventSourceRef.dispose();
    this.$refs.eventStatusRef && this.$refs.eventStatusRef.dispose();
  },

  methods: {

    async getAccountInfo(){
      const result = await this.$store.dispatch("GetUserAuthorities");
      const accountId = {
        accountId : result.data.accountId
      }
      await accountInfo(accountId).then(res => {
        // console.log('res.data', res.data)
        console.log('res.data.isTransform', res.data.isTransform)
        console.log('res.data.isiService', res.data.isiService)

        this.isiService = res.data.isiService
        this.isTransform = res.data.isTransform
        
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },


    async getEventOverviewData() {
      this.daysRangeList = util.getDaysRangeList(this.params.beginTs,  this.params.endTs, this.timeMode);
      await this.getStoreEventStatics();
      await this.getEventStatsStatics();
      await this.getEventRankingInfo();
      await this.handleSelector()
    },

    storeChange(selectedInstantStore){
      console.log('selectedInstantStore :>> ', selectedInstantStore);
      this.selectedInstantStore = selectedInstantStore
      this.storeIds = selectedInstantStore.filter(i => i !== "-1")
      this.curStore = "-1"
      this.getEventOverviewData();
    },

    async dateChange(val) {
      console.log('dateChange !!!!!!! :>>');
      this.dateValue = val;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const daysDiff = this.$moment(end).diff(start, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
      this.params.beginTs = start;
      this.params.endTs = end;
      await this.getBriefStoreData();
      await this.saveSearchParams();
      await this.getEventOverviewData();
    },

    async getBriefStoreData() {
      const self = this;
      await getBriefStoreList().then(res => {
        const errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          const storeList = res.data;
          storeList.forEach( i => {
            i.value = i.storeId;
            i.label = i.name
          })
          this.storeList = storeList
          this.selectedInstantStore = storeList.map( i => i.storeId)
          this.storeIds = this.selectedInstantStore.filter(i => i !== "-1");
          this.curStore = '-1'

          // console.log('storeList ~~~~~>', storeList)
          // console.log('this.selectedInstantStore~~~~~>',  this.selectedInstantStore)
          // console.log('this.storeIds~~~~~>',  this.storeIds)
        }
      });
    },

    handleSelector(){
      let tempStore = [];
      if(this.selectedInstantStore.length == 0){
        this.tempStore = []
        // this.storeList.forEach(item => {
        //   const obj = {
        //     storeId: item.storeId,
        //     label: item.name,
        //     value: item.storeId,
        //     userId: item.userId,
        //     name: item.name,
        //     checked: true
        //   };
        //   tempStore.push(obj);
        // });
      } else {
        var afterFilterData = []
        this.storeList.forEach(item => {
          this.selectedInstantStore.forEach( i => {
            if( i == item.storeId) afterFilterData.push(item)
          })
        })
        console.log('afterFilterData ===>', afterFilterData)
        tempStore = []
        tempStore = afterFilterData 
      }

      if (tempStore.length > 0) {
        tempStore.unshift(
          {
            storeId: '-1',
            label: this.$t('overview.all'),
            value: '-1',
            name:  this.$t('overview.all'),
          }
        );
      }
      // console.log('tempStore ~~~~~> ', tempStore);
      this.storeDataList = tempStore;
    },


    changeStore(val) {
      const self = this;
      console.log('self.curStore', self.curStore)
      self.storeIds = [];
      
      if (val === '-1') {
        self.storeIds = this.selectedInstantStore.filter(i => i !== "-1");
        
      } else {
        self.storeIds.push(self.curStore);
      }

      // console.log('this.selectedInstantStore :>> ', this.selectedInstantStore);
      // console.log('self.storeIds :>> ', self.storeIds);

      self.saveSearchParams();
      self.getStoreEventStatics();
    },

    
    async getEventStatsStatics() {
      const self = this;
      var overviewParam = {
        beginTs: this.params.beginTs,
        endTs: this.params.endTs,
        storeIds: this.selectedInstantStore
      }
      // console.log('overviewParam ~~~~~~>> ', overviewParam);
      try {
        const eventResult = await self.getEventStatsOverview(overviewParam);
        if (eventResult.errCode === 0) {
          const result = eventResult.data;
          if (Object.keys(result).length > 0) {
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
      } catch (e) {
        console.log('EventOverview-getEventStatsStatics:' + e);
      }
    },

    getEventStatsOverview(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverview(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    getEventBySourcePie() {
      const self = this;
      const jsonArray = self.sourceLegend;
      const sourcePieList = self.eventBySource;
      let remoteEventNum = 0;
      let onsiteEventNum = 0;
      let storeEventNum = 0;
      let immediateEventNum = 0;

      let sumEvent = 0;
      let seriesData = 0;

      // console.log('sourcePieList !!!:>> ', sourcePieList);
      // console.log('jsonArray 1 !!!:>> ', jsonArray);
      sourcePieList.forEach((item, index) => {
        sumEvent += item.numOfEvent;
        if (index === 2) {
          onsiteEventNum = item.numOfEvent;
        }
        else if (index === 3 && this.isLicensePro) {
          immediateEventNum = item.numOfEvent;
        } 

      });
      const totalArray = [onsiteEventNum, immediateEventNum];
      jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
      if(jsonArray[1] && this.isLicensePro) jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2)
      
      // console.log('jsonArray 2 !!!:>> ', jsonArray);
      if (sumEvent !== 0) {
        seriesData = [
          // { value: remoteEventNum, name: self.$t('overview.remotePatrol') },
          { value: onsiteEventNum, name: self.$t('overview.onsitePatrol') },
          // { value: storeEventNum, name: self.$t('overview.storeMonitor') },
          { value: immediateEventNum, name: self.$t('immediatePush.immediateEvent') }
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
            type: 'pie',
            radius: ['43%', '80%'],
            itemStyle: {
              normal: {
                borderWidth:2,
                borderType:'dashed',
                borderColor:'#dae4eb',
                color: function(params) {
                  const colorList = ['#FFF'];
                  return colorList[params.dataIndex];
                }
              }
            },
            silent: true,
            z: 0,
            data: [{ value: 1, name: '' }]
          },
          {
            name: '事件来源占比',
            type: 'pie',
            radius: ['50%', '70%'],
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
            borderWidth:5,
            borderColor:'#FFF',
            itemStyle: {
              emphasis: {
                borderWidth:10,
                borderColor:'#EDF0F2'
              },
              normal: {
                borderWidth:5,
                borderColor:'#FFF',
                color: function(params) {
                  const colorList = [ '#7b9feb' ,'#7bd8eb' ]
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      self.sourcePerArray = jsonArray;
    },

    getEventByStatusPie() {
      const self = this;
      const jsonArray = self.statusLegend;
      const statusPieList = self.eventByStatus;

      // console.log('statusPieList ~~~>>>', statusPieList)

      let pendingEventNum = 0;
      let doneEventNum = 0;
      let closedEventNum = 0;
      let rejectEventNum = 0;

      let sumEvent = 0;
      let seriesData = [];
      
      var tempCloseNum_A = 0
      var tempCloseNum_B = 0

      var UnprocessedEventNum = 0

      statusPieList.forEach((item, index) => {
        sumEvent += item.numOfEvent;
        if (index === 0) {
          pendingEventNum = item.numOfEvent;
        } 
        else if (index === 1) {
          doneEventNum = item.numOfEvent;
        } 
        else if (index === 2) {
          tempCloseNum_A = item.numOfEvent;
        }
        else if (index === 3) {
          rejectEventNum = item.numOfEvent;
        }
        else if (index === 4) {
          tempCloseNum_B = item.numOfEvent;
        }
      });
      
      closedEventNum = tempCloseNum_A + tempCloseNum_B
      UnprocessedEventNum = pendingEventNum + rejectEventNum

      const totalArray = [UnprocessedEventNum, doneEventNum, closedEventNum];
      jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
      jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
      jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
      if (sumEvent !== 0) {
        seriesData = [
          { value: UnprocessedEventNum, name: self.$t('overview.pendingEvent') },
          { value: doneEventNum, name: self.$t('overview.processedEvent') },
          { value: closedEventNum, name: self.$t('overview.closedEvents') }
        ];
      } else {
        seriesData = [];
      }
      self.eventStatusOptions = self.getEventByStatusPieOption();
      self.eventStatusOptions.series[1].data = seriesData;
      self.statusPerArray = jsonArray;
    },

    getEventByStatusPieOption() {
      const self = this;
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          textStyle: {
            align: 'left'
          },
          backgroundColor: this.echartBackground
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        series: [
          {
            type: 'pie',
            radius: ['43%', '80%'],
            itemStyle: {
              normal: {
                borderWidth:2,
                borderType:'dashed',
                borderColor:'#dae4eb',
                color: function(params) {
                  const colorList = ['#FFF'];
                  return colorList[params.dataIndex];
                }
              }
            },
            silent: true,
            z: 0,
            data: [{ value: 1, name: '' }]
          },
          {
            name: '事件处理状态占比',
            type: 'pie',
            radius: ['50%', '70%'],
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
            data: [],
            borderWidth:5,
            borderColor:'#FFF',
            itemStyle: {
              emphasis: {
                borderWidth:10,
                borderColor:'#EDF0F2'
              },
              normal: {
                borderWidth:5,
                borderColor:'#FFF',
                color: function(params) {
                  const colorList = [self.pendingColor, self.doneColor, self.closedColor];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      return pieOption;
    },

    getEventRankingInfoSetting() {
      const settingObj = {};

      if (this.rankType === 0) {
        settingObj.axisArray = ['门店名称', this.$t('overview.pendingEvent')];
        settingObj.colorArray = [this.pendingColor];
        settingObj.seriesData = [{ type: 'bar', stack: 'test', barWidth: 35 }];
      } 
      else if (this.rankType === 2) {
        settingObj.axisArray = ['门店名称', this.$t('overview.closedEvents')];
        settingObj.colorArray = [this.closedColor];
        settingObj.seriesData = [{ type: 'bar', stack: 'test', barWidth: 35 }];
      } 
      else {
        settingObj.axisArray = ['门店名称', this.$t('overview.pendingEvent'),
          this.$t('overview.processedEvent'), this.$t('overview.closedEvents')];
        settingObj.colorArray = [this.pendingColor, this.doneColor, this.closedColor];
        settingObj.seriesData = [
          { type: 'bar', stack: 'test', barWidth: 35 },
          { type: 'bar', stack: 'test', barWidth: 35 },
          { type: 'bar', stack: 'test', barWidth: 35 }
        ];
      }
      return settingObj;
    },

    async getEventRankingInfo() { 
      
      const self = this;
      let params = {};
      params = JSON.parse(JSON.stringify(self.params));
      params.numOfStores = 5;
      params.rankType = self.rankType;
      params.storeIds = this.selectedInstantStore.filter(i => i !== "-1")
      const { axisArray, colorArray, seriesData } = self.getEventRankingInfoSetting();
      const rankingOption = self.getEventRankingOption(colorArray, seriesData);

      // console.log('params.storeIds DDDDDDDDD:>> ', params.storeIds);
      // console.log('rankingOption 1 ~~~~~>', rankingOption)
      // console.log('seriesData ~~~~~>', seriesData)
      // console.log('self.rankType; ~~~~~>', self.rankType)
      
      try {
        const rankingResult = await self.getEventStatsRanking(params);

        if (rankingResult.errCode === 0) {
          const result = rankingResult.data;
          self.statusStoreList = result;
          const soureceList = [];
          soureceList.push(axisArray);
          result.forEach(item => {
            const itemArray = [];
            itemArray.push(item.storeName);
            if (self.rankType === 3) {
              itemArray.push(item.numOfUnprocessed + item.numOfRejected);
              itemArray.push(item.numOfInprocess);
              itemArray.push(item.numOfProcessed);
            } 
            else if (self.rankType === 0) {
              itemArray.push(item.numOfUnprocessed);
            } 
            else if (self.rankType === 2) {
              itemArray.push(item.numOfProcessed);
            }
            
            soureceList.push(itemArray);
          });
          rankingOption.dataset.source = soureceList;
        } else {
          rankingOption.dataset.source = [];
        }

        
        self.storeStatusOptions = rankingOption;
      } catch (e) {
        self.storeStatusOptions = rankingOption;
        // console.log('EventOverview-getEventRankingInfo:' + e);
      }
    },

    getEventRankingOption(colorArray, seriesData) {
      const rankingOption = {
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
            reject(err);
          });
      });
    },
    
    async getStoreEventStatics() {
      const self = this;
      
      let params = {};
      params = JSON.parse(JSON.stringify(self.params));
      params.storeIds = self.storeIds;
      params.timeMode = self.timeMode;
      
      // console.log('this.storeIds DDDDDDD:>> ', this.storeIds);

      const option = self.getStoreEventStaticsOption();
      try {
        const storeEventResult = await self.getStoreEventData(params);
        if (storeEventResult.errCode === 0) {
          const result = storeEventResult.data;
          
          // console.log('result :>> ', result.data);

          self.storeEventList = result;
          const soureceList = [];
          soureceList.push(self.storeEventLegend);
          let sumOfNewEvents = 0;
          let sumOfProcessedEvents = 0;
          let sumOfClosedEvents = 0;
          result.forEach((item, index) => {
            const storeList = item.stores;

            // console.log('storeList :>> ', storeList, index);

            storeList.forEach(_item => {
              sumOfNewEvents += _item.numOfNewEvents;
              sumOfProcessedEvents += _item.numOfProcessedEvents;
              sumOfClosedEvents += _item.numOfClosedEvents;
            });

            // console.log('sumOfNewEvents :>> ', sumOfNewEvents);
            // console.log('sumOfProcessedEvents :>> ', sumOfProcessedEvents);
            // console.log('sumOfClosedEvents :>> ', sumOfClosedEvents);

            const itemArray = [];
            itemArray.push(self.daysRangeList[index]);
            itemArray.push(sumOfNewEvents);
            itemArray.push(sumOfProcessedEvents);
            itemArray.push(sumOfClosedEvents);  
            soureceList.push(itemArray);

            // console.log('itemArray :>> ', itemArray);
            
          });
          option.dataset.source = soureceList;
        }
        self.storeEventsOptions = option;
      } catch (e) {
        self.storeEventsOptions = option;
        console.log('EventOverview-getStoreEventStatics:' + e);
      }
    },

    getStoreEventStaticsOption() {
      const storeOption = {
        color: [this.newColor, this.doneColor, this.closedColor],
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
            padding: [0, 0, 0, 5],
            height: 12,
            lineHeight: 12
          }
        },
        textStyle: {
          fontFamily: this.fontFamily
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
          backgroundColor: this.echartBackground
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
              color: this.echartAxiasColor,
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
      return storeOption;
    },

    getStoreEventData(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverStore(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    changeRankType(val) {
      this.saveSearchParams();
      this.getEventRankingInfo();
    },

    toPercent(point) {
      const tempPoint = Number(point * 100);
      let str = '';
      util.isDot(tempPoint) ? str = tempPoint.toFixed(2) : str = tempPoint;
      str += '%';
      return str;
    },

    adjustChart() {
      this.$refs.storeEventRef && this.$refs.storeEventRef.resize();
      this.$refs.storeStatusRef && this.$refs.storeStatusRef.resize();
      this.$refs.eventSourceRef && this.$refs.eventSourceRef.resize();
      this.$refs.eventStatusRef && this.$refs.eventStatusRef.resize();
    },

    saveSearchParams() {
      const params = {
        beginTs: this.params.beginTs,
        endTs: this.params.endTs,
        storeId: this.curStore,
        rankType: this.rankType
      };
      const searchConditon = {
        path: 'eventOverview',
        params: params
      };
      SearchConditionUtil.saveSearchCondition(searchConditon);
    },

    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('eventOverview');
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      this.params.beginTs = this.dateValue[0].valueOf();
      this.params.endTs = this.dateValue[1].valueOf();
      if (Object.keys(searchParams).length > 0) {
        this.dateValue[0] = new Date(searchParams.beginTs);
        this.dateValue[1] = new Date(searchParams.endTs);
        this.rankType = searchParams.rankType;
        this.curStore = searchParams.storeId;
        if (this.curStore === '-1' || this.curStore.length === 0) {
          this.storeIds = [];
        } else {
          this.storeIds.push(this.curStore);
        }
      }
      const daysDiff = this.$moment(this.params.endTs).diff(this.params.beginTs, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
    }
  }
};

</script>

<style lang="sass">
  .for_flex
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
  .widewidth
    width: 100% !important
  // .el-input--medium .el-input__inner
    // height: 30px !important
    // height: calc(36 / 1920* 100vw) !important
</style>

<style lang="scss" scoped>
  @import "../../assets/sass/overview.scss";
</style>

<style lang="sass" scoped>
  .overview-date
    height: auto !important
    line-height: initial !important
    padding: 20px 0
</style>