<template>
  <div class="el-overview-content">
    <div class="overview-date">
      <span class="date-title">{{ $t('overview.date') }}</span>
      <date-time-selector @change="dateChange"/>
      <span class="el-store">
        {{ $t('overview.totalStore', {storeNum: totalStoreNum}) }}
      </span>
    </div>
    <div class="el-overview">
      <el-row class="zone-row">
        <el-col :span="4" class="kpi-list">
          <div class="title">{{ $t('overview.kpiIndex') }}</div>
          <div class="kpi-content">
            <div class="total-store">
              <div class="total-title">{{ $t('overview.totalPatrol') }}</div>
              <div class="total-num">{{ numOfInspects }}</div>
            </div>
            <div class="total-store" style="margin-bottom: 0">
              <div class="total-title">{{ $t('overview.advPatrolCycle') }}</div>
              <div class="total-num">
                {{ cycleOfInspect }}
                <span v-if="cycleOfInspect !=='N/A'" class="day">
                  {{ $t('overview.day') }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="14" class="store-list">
          <div class="title">{{ $t('overview.patrolStatus') }}</div>
          <div class="region-result">
            <div class="region-content">
              <div class="region-result-panel">
                <v-chart
                  ref="storeChart"
                  :options="storeOptions"
                  :auto-resize="true"
                  class="result-content"
                  @timelinechanged="timelineHandler"/>
                <i v-if="showPreviousGroup" class="el-icon-arrow-left icon-arrow" @click="previousGroup"/>
                <div v-if="regionChartEmpty" class="empty-text">{{ $t('overview.noData') }}</div>
                <i v-if="showNextGroup" class="el-icon-arrow-right icon-arrow" @click="nextGroup"/>
              </div>
            </div>
          </div>

        </el-col>
        <el-col :span="6" class="focus-list">
          <div class="title flex-center">
            <span v-if="isWorstArea" class="area-title">{{ $t('overview.worstRegion') }}</span>
            <span v-else class="area-title">{{ $t('overview.bestRegion') }}</span>
            <span class="arrows" @click="changBestAndWorst">
              <span v-if="isWorstArea" class="order-span">{{ $t('overview.descendingOrder') }}</span>
              <span v-else class="order-span">{{ $t('overview.ascendingOrder') }}</span>
              <img v-if="isWorstArea" :src="descending" class="img-class">
              <img v-else :src="ascending" class="img-class">
            </span>
          </div>
          <div v-if="regionTopFive.length > 0" class="focus-content">
            <!--<v-chart :auto-resize='true' :options="topRegionOption" class="chart-content"></v-chart>-->
            <div v-for="(item, index) in regionTopFive" :key="index" class="item-chart">
              <div :class="`item-ranking-${index}`" class="item-ranking">0{{ index+1 }}</div>
              <div class="region-name">{{ item.region }}</div>
              <div class="item-titles">
                <el-tooltip :key="index" :popper-class="elTooltipClass" placement="bottom">
                  <div slot="content">{{ item.region }}<br>
                    <span v-if="isWorstArea">
                      {{ item.firstName }}: {{ item.firstNum }}<br>
                    </span>
                    {{ item.secondName }}: {{ item.secondNum }}
                  </div>
                  <div class="process-list">
                    <el-progress
                      v-if="isWorstArea"
                      :percentage="item.firstPercent"
                      :stroke-width="10"
                      :color="item.firstColor"
                      :show-text="false"
                      :class="item.firstNum > 0 ? 'item-process': 'region-process'"/>
                    <el-progress
                      :percentage="item.secondPercent"
                      :stroke-width="10"
                      :color="item.secondColor"
                      :show-text="false"
                      :class="item.secondNum > 0 ? 'item-process': 'region-process'"/>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div v-else class="empty-content">
            {{ $t('overview.noData') }}
          </div>
        </el-col>
      </el-row>
      <el-row class="task-row">
        <div class="top">
          <div class="titles">
            <span class="title">{{ $t('overview.patrolRanking') }}</span>
            <span class="arrows" @click="changWorkerRanking">
              <span v-if="isWorstWork" class="order-span">{{ $t('overview.descendingOrder') }}</span>
              <span v-else class="order-span">{{ $t('overview.ascendingOrder') }}</span>
              <img v-if="isWorstWork" :src="descending" class="img-class">
              <img v-else :src="ascending" class="img-class">
            </span>
          </div>
        </div>
        <div class="task-dashboard">
          <div v-if="taskList.length > 0" :class="taskList.length < 5 ? 'space-task': ''" class="task-board">
            <div v-for="(item,index) in taskList" :key="index" class="task-item">
              <div class="task-panel">
                <el-progress
                  :percentage="item.percent"
                  :show-text="false"
                  class="process-panel"
                  type="dashboard"
                  color="#8fd92e"/>
                <div class="percent-num">
                  <span v-if="!item.appended" class="num">{{ item.completionRate }}</span>
                  <span v-if="!item.appended" class="percent">%</span>
                </div>
              </div>
              <div class="task-supervisor-name">{{ item.supervisorName }}</div>
            </div>
          </div>
          <div v-else class="task-empty">
            {{ $t('overview.noData') }}
          </div>
        </div>
      </el-row>
      <el-row class="items-row">
        <el-col :span="6" class="evalution-pct">
          <div class="title">{{ $t('overview.itemsAssessment') }}</div>
          <div class="pct-content">
            <div class="pct-panel">
              <v-chart ref="itemsPie" :auto-resize="true" :options="itemsOptions" class="chart-content"/>
            </div>
            <div class="pct-nums">
              <div
                v-for="(item, index) in itemsPerArray"
                :class="lang='en'? 'en-labels': ''"
                :key="index"
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
        <el-col :span="18">
          <div class="focus-items">
            <div class="title">{{ $t('overview.worstItems') }}</div>
            <el-row class="items-panel">
              <el-col :span="16" class="top-five-items">
                <div v-if="itemsTopFive.length > 0" class="items-list">
                  <div
                    v-for="(item, index) in itemsTopFive"
                    :key="index"
                    :class="item.isClick?'active-color':''"
                    class="item-chart"
                    @click="showItemRadar(item, index)">
                    <div :class="`item-ranking-${index}`" class="item-ranking">0{{ index + 1 }}</div>
                    <div class="item-titles">
                      <div class="item-title">{{ item.inspectItemName }}</div>
                    </div>
                    <div class="item-progress">
                      <el-progress
                        :percentage="item.percent"
                        :stroke-width="10"
                        :show-text="false"
                        :class="item.isClick?'item-process':'inactive-item-process'"
                        color="#f59249"/>
                    </div>
                    <div class="ranking-num">{{ item.numOfUnqualified }}</div>
                  </div>
                </div>
                <div v-else class="top-five-empty">
                  {{ $t('overview.noData') }}
                </div>
              </el-col>
              <el-col :span="8" class="item-radar">
                <div v-if="itemsTopFive.length > 0" class="rader-panel">
                  <div class="radar-title">{{ curItemName }}</div>
                  <v-chart ref="itemsRadar" :options="itemsRadarOption" :auto-resize="true" class="radar-content"/>
                </div>
                <div v-else class="radar-empty">
                  {{ $t('overview.noData') }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row class="star-row">
        <el-col :span="6" class="stores-list">
          <div v-for="(item, index) in bestAndWorstStore" :key="index" class="best-store">
            <div class="best-icon">
              <img :src="item.iconSrc" class="store-icon">
            </div>
            <div class="title">{{ item.storeSort }}</div>
            <div v-if="item.storeName">
              <div class="store-name">{{ item.storeName }}</div>
              <div class="pass-pct">{{ item.qualifiedRate }}</div>
            </div>
            <div v-else>
              <div class="empty-store">{{ $t('overview.noData') }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="inspect-cycle">
            <div class="cycle-title">{{ $t('overview.avgPatrlCycle') }}</div>
            <div class="cycle-panel">
              <div class="panel-info">*{{ $t('overview.dataZoomInfo') }}</div>
              <div class="panel-bubble">
                <v-chart ref="cycleChart" :options="cycleOption" :auto-resize="true" class="radar-content"/>
              </div>
              <div class="cycle-axis">{{ $t('overview.cycle') }}</div>
              <div class="pass-rate-axis">{{ $t('overview.passRate') }}</div>
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
import {
  getInspectStatsOverview,
  getInspectStatsOverStore,
  getInspectStatsItemOverview,
  getInspectStatsItemOverviewRegion,
  GetInspectStatsOverPerson,
  getInspectStatsOverviewWithRegion,
  getInspectStatsOverRegion
} from '@/api/inspectOverview';
import { mapGetters } from 'vuex';
import resize from '@/components/mixins/echartResize';
import SearchConditionUtil from '@/common/SearchConditionUtil.js';
import DateTimeSelector from '@/components/DateTimeSelector';

export default {
  name: 'PatrolOverview',

  components: {
    DateTimeSelector,
    'v-chart': ECharts
  },

  mixins: [resize],

  data() {
    return {
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      taskList: [],
      isWorstArea: true,
      isWorstWork: true,
      bestStoreIcon: require('../../../static/img/store_best.png'),
      worstStoreIcon: require('../../../static/img/store_worst.png'),
      loadingGif: require('../../../static/img/loading.gif'),
      params: {},
      bestAndWorstStore: [],
      itemsOptions: null,
      storeOptions: null,
      itemsPerArray: [],
      itemsTopFive: [],
      curIndex: 0,
      curItemId: '',
      curItemName: '',
      itemsRadarOption: null,
      totalStoreNum: 0,
      numOfInspects: 0,
      cycleOfInspect: 0,
      passRateList: [
        {
          'desc': '立即督导≥60%'
        },
        {
          'desc': '立即督导≤60%'
        },
        {
          'desc': '优秀≥60%'
        },
        {
          'desc': '优秀≤60%'
        }
      ],
      resultList: [this.$t('overview.danger'), this.$t('overview.improve'), this.$t('overview.echartGood')],
      itemsLegend: [
        {
          'type': this.$t('overview.excellent'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.pass'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.failed'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.ignored'),
          'percent': '0%'
        }
      ],
      cycleOption: null,
      dataMap: {},
      poperClass: 'date-picker-poper',
      elTooltipClass: 'el-tooltip-class',
      lang: this.$i18n.locale,
      timeMode: 1, // weekly mode
      daysRangeList: [],
      regionList: [],
      topRegionOption: null,
      regionResultList: [],
      regionTopFive: [],
      echartColor: '#7d8cab',
      echartBackground: 'rgba(30,34,52,0.75)',
      echartAxiasColor: '#e3e9f4',
      regionChartEmpty: true,
      showRegionNum: 10,
      totalGroupNum: 0,
      curGroupIndex: 0,
      regionGroups: [],
      regionInspectListData: [],
      varWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      isEnSpan: false,
      showNextGroup: false,
      showPreviousGroup: false,
      descending: require('../../../static/img/descending.png'),
      ascending: require('../../../static/img/ascending.png'),
      currentIndex: 0,
      fontFamily: 'Roboto, Microsoft YaHei'
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.timeMode = 1;
        self.isEnSpan = false;
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        self.currentIndex = 0;
        self.getSearchParams();
        self.getPatrolOverviewData();
      }
    }
  },

  created() {
    this.getSearchParams();
    this.getPatrolOverviewData();
  },

  beforeDestroy() {
    this.$refs.storeChart && this.$refs.storeChart.dispose();
    this.$refs.itemsPie && this.$refs.itemsPie.dispose();
    this.$refs.itemsRadar && this.$refs.itemsRadar.dispose();
    this.$refs.cycleChart && this.$refs.cycleChart.dispose();
  },

  methods: {
    changBestAndWorst() {
      const self = this;
      self.isWorstArea = !self.isWorstArea;
      self.isWorstArea ? self.showWorstArea() : self.showBestArea();
    },

    changWorkerRanking() {
      const self = this;
      self.isWorstWork = !self.isWorstWork;
      self.isWorstWork ? self.showWorstWorks() : self.showBestWorks();
    },

    showWorstArea() {
      const self = this;
      self.isWorstArea = true;
      self.getTopFiveRegionList();
    },

    showBestArea() {
      const self = this;
      self.isWorstArea = false;
      self.getTopFiveRegionList();
    },

    showWorstWorks() {
      const self = this;
      self.isWorstWork = true;
      self.getInspectTaskRanking();
    },

    showBestWorks() {
      const self = this;
      self.isWorstWork = false;
      self.getInspectTaskRanking();
    },

    timelineHandler(event) {
      const self = this;
      self.currentIndex = event.currentIndex;
    },

    previousGroup() {
      const self = this;
      self.curGroupIndex === 0 ? 0 : self.curGroupIndex--;
      if (self.curGroupIndex === 0) {
        self.showPreviousGroup = false;
        self.showNextGroup = true;
      } else {
        self.showPreviousGroup = true;
      }
      self.getRegionInspectResultData();
    },

    nextGroup() {
      const self = this;
      self.curGroupIndex < self.totalGroupNum - 1 ? self.curGroupIndex++ : self.curGroupIndex;
      if (self.curGroupIndex === self.totalGroupNum - 1) {
        self.showNextGroup = false;
        self.showPreviousGroup = true;
      } else {
        self.showNextGroup = true;
      }
      self.getRegionInspectResultData();
    },

    getRegionInspectResultData() {
      const self = this;
      const regionOption = self.getRegionInspectOption();
      const resultData = self.regionInspectListData;
      if (resultData.length > 0) {
        const regions = resultData[0].regions;
        const regionList = [];
        self.regionGroups[self.curGroupIndex].forEach((item) => {
          regionList.push(item.region);
        });
        self.regionList = regionList;
        regionOption.baseOption.xAxis[0].data = self.regionList;
        resultData.forEach((item) => {
          const dateTime = item.ts;
          const region = item.regions;
          const dangerousList = [];
          const improvedList = [];
          const passList = [];
          region.forEach(_item => {
            if (self.regionList.indexOf(_item.region) === -1) {
              return;
            }
            const itemDangerJson = {};
            itemDangerJson.name = _item.region;
            itemDangerJson.value = _item.numOfDangerous;
            dangerousList.push(itemDangerJson);
            const itemImprovedJson = {};
            itemImprovedJson.name = _item.region;
            itemImprovedJson.value = _item.numOfImproved;
            improvedList.push(itemImprovedJson);
            const itemQualifiedJson = {};
            itemQualifiedJson.name = _item.region;
            itemQualifiedJson.value = _item.numOfQualified;
            passList.push(itemQualifiedJson);
          });
          const tempOption = {};
          const seriesArray = new Array(3);
          const seriesDanJson = {};
          seriesDanJson.stack = 'test';
          seriesDanJson.data = dangerousList;
          seriesArray[0] = seriesDanJson;

          const seriesImproveJson = {};
          seriesImproveJson.stack = 'test';
          seriesImproveJson.data = improvedList;
          seriesArray[1] = seriesImproveJson;

          const seriesPassJson = {};
          seriesPassJson.stack = 'test';
          seriesPassJson.data = passList;
          seriesArray[2] = seriesPassJson;
          tempOption.series = seriesArray;
          regionOption.options.push(tempOption);
          self.regionChartEmpty = false;
        });
      } else {
        self.dataMap.dataDanger = { 0: [] };
        self.dataMap.dataImproved = { 0: [] };
        self.dataMap.dataQualified = { 0: [] };
        self.regionChartEmpty = true;
      }
      self.storeOptions = regionOption;
    },

    async showItemRadar(item, index) {
      const self = this;
      self.curItemId = item.inspectItemId;
      self.curItemName = item.inspectItemName;
      item.isClick = true;
      self.itemsTopFive.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isClick = false;
        }
      });
      let itemsParam = {};
      itemsParam = JSON.parse(JSON.stringify(self.params));
      itemsParam.itemId = self.curItemId;
      const options = self.getItemRadarOption();
      try {
        const result = await self.getInspectItemsOverRegion(itemsParam);
        const tempIndicator = [];
        const seriesValue = [];
        if (result.errCode === 0) {
          const resultData = result.data;
          let max = 0;
          resultData.map(function(item) {
            if (item.numOfUnqualified > max) {
              max = item.numOfUnqualified;
            }
          });
          resultData.forEach(item => {
            const obj = {};
            obj.name = item.regionName;
            obj.max = max;
            tempIndicator.push(obj);
            seriesValue.push(item.numOfUnqualified);
          });
        }
        const temp = [];
        const obj = { value: seriesValue };
        temp.push(obj);
        options.radar[0].indicator = tempIndicator;
        options.radar[1].indicator = tempIndicator;
        options.series[0].data = temp;
        options.series[1].data = temp;
        options.radar.splitNumber = 5;
        self.itemsRadarOption = options;
      } catch (e) {
        self.itemsRadarOption = options;
        console.log('PatrolOverview-showItemRadar:' + e);
      }
    },

    getItemRadarOption() {
      const radarOptions = {
        backgroundColor: '#fff',
        tooltip: {
          textStyle: {
            align: 'left'
          },
          backgroundColor: this.echartBackground
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        legend: {
          data: ['inspect radar']
        },
        radar: [{
          shape: 'circle',
          center: ['50%', '50%'],
          nameGap: 5,
          name: {
            textStyle: {
              color: '#7d8cad',
              backgroundColor: '#fff',
              borderRadius: 3,
              padding: [3, 5]
            },
            formatter: (params) => {
              let str = '';
              if (params.length > 6) {
                str = params.substr(0, 6) + '...';
              } else {
                str = params;
              }
              return str;
            }
          },
          indicator: [],
          axisLine: {
            lineStyle: {
              color: this.echartAxiasColor
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: this.echartAxiasColor
            }
          }
        },
        {
          shape: 'circle',
          center: ['50%', '50%'],
          nameGap: 5,
          indicator: [],
          name: {
            textStyle: {
              color: 'rgba(255,255,255,0)',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: this.echartAxiasColor
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: this.echartAxiasColor
            }
          }
        }
        ],
        series: [
          {
            type: 'radar',
            data: []
          },
          {
            type: 'radar',
            data: [],
            name: this.$t('remotePatrol.inspectionItems'),
            radarIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#f11e66',
                  width: 1
                },
                areaStyle: {
                  color: 'rgba(243, 29, 101, 0.5)'
                }
              }
            },
            tooltip: {
              trigger: 'item'
            }
          }
        ]
      };
      return radarOptions;
    },

    dateChange(val) {
      this.dateValue = val;
      this.currentIndex = 0;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const daysDiff = this.$moment(end).diff(start, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
      this.params.beginTs = start;
      this.params.endTs = end;
      this.saveSearchParams();
      this.getPatrolOverviewData();
    },

    getPatrolOverviewData() {
      this.daysRangeList = util.getDaysRangeList(this.params.beginTs,  this.params.endTs, this.timeMode);
      this.getStoreNumAndCycle();
      this.getBestAndWorstStores();
      this.getInspectItems();
      this.getInspectTaskRanking();
      this.getPassRateAndCycle();
      this.getRegionInspectResult();
    },

    compareDanger(a, b) {
      if (b.numOfDangerous > a.numOfDangerous) {
        return 1;
      } else if (b.numOfDangerous === a.numOfDangerous) {
        return b.numOfImproved - a.numOfImproved;
      } else {
        return -1;
      }
    },

    findMaxDanger(items) {
      let max = 1;
      items.map(function(item, index) {
        if (item.numOfDangerous > max) {
          max = item.numOfDangerous;
        }
        if (item.numOfImproved > max) {
          max = item.numOfImproved;
        }
      });
      return max;
    },

    compareExcellent(a, b) {
      if (b.numOfExcellent > a.numOfExcellent) {
        return 1;
      } else if (b.numOfExcellent === a.numOfExcellent) {
        return b.numOfQualified - a.numOfQualified;
      } else {
        return -1;
      }
    },

    findMaxExcellent(items) {
      let max = 1;
      items.map(function(item, index) {
        if (item.numOfExcellent > max) {
          max = item.numOfExcellent;
        }
        if (item.numOfQualified > max) {
          max = item.numOfQualified;
        }
      });
      return max;
    },

    getTopFiveRegionList() {
      const self = this;
      let result = self.regionResultList.concat([]);
      let firstColor = '';
      let secondColor = '';
      let firstName = '';
      let secondName = '';
      let maxValue = 0;
      const items = [];
      if (self.isWorstArea) {
        firstColor = '#f11e66';
        secondColor = '#f59249';
        firstName = self.$t('overview.danger');
        secondName = self.$t('overview.improve');
        try {
          result.sort(self.compareDanger);
          maxValue = self.findMaxDanger(result);
        } catch (e) {
          result = [];
        }
      } else {
        firstColor = '#57e78f';
        secondColor = '#8fd92e';
        firstName = self.$t('overview.excellent');
        secondName = self.$t('overview.echartGood');
        try {
          result.sort(self.compareExcellent);
          maxValue = self.findMaxExcellent(result);
        } catch (e) {
          result = [];
        }
      }
      const topFiveArray = result.slice(0, 5);
      const fiveArray = [];
      topFiveArray.forEach(item => {
        const json = {};
        json.region = item.region;
        if (self.isWorstArea) {
          const tempFirstDouble = (item.numOfDangerous / maxValue) * 100;
          const tempSecondDouble = (item.numOfImproved / maxValue) * 100;
          const firstPectStr = tempFirstDouble.toFixed(0);
          const firstSecondStr = tempSecondDouble.toFixed(0);
          json.firstPercent = parseInt(firstPectStr);
          json.secondPercent = parseInt(firstSecondStr);
          json.firstColor = firstColor;
          json.secondColor = secondColor;
          json.firstName = firstName;
          json.secondName = secondName;
          json.firstNum = item.numOfDangerous;
          json.secondNum = item.numOfImproved;
          fiveArray.push(json);
        } else {
          const tempFirstDouble = (item.numOfExcellent / maxValue) * 100;
          const tempSecondDouble = (item.numOfQualified / maxValue) * 100;
          const firstPectStr = tempFirstDouble.toFixed(0);
          const firstSecondStr = tempSecondDouble.toFixed(0);
          json.firstPercent = parseInt(firstPectStr);
          json.secondPercent = parseInt(firstSecondStr);
          json.firstColor = firstColor;
          json.secondColor = secondColor;
          json.firstName = firstName;
          json.secondName = secondName;
          json.firstNum = item.numOfExcellent;
          json.secondNum = item.numOfQualified;
          fiveArray.push(json);
        }
      });
      self.regionTopFive = fiveArray;
    },

    async getStoreNumAndCycle() {
      const self = this;
      try {
        const storeNumAndCycle = await self.getInspectStatsOverview(self.params);
        if (storeNumAndCycle.errCode === 0) {
          const result = storeNumAndCycle.data;
          if (result) {
            self.totalStoreNum = result.numOfStores;
            self.numOfInspects = result.numOfInspects;
            self.cycleOfInspect = result.cycleOfInspect === -1 ? 'N/A' : result.cycleOfInspect;
          }
        } else {
          self.totalStoreNum = 0;
          self.numOfInspects = 0;
          self.cycleOfInspect = 0;
        }
      } catch (e) {
        self.totalStoreNum = 0;
        self.numOfInspects = 0;
        self.cycleOfInspect = 0;
        console.log('PatrolOverview-getStoreNumAndCycle:' + e);
      }
    },

    getInspectStatsOverview(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverview(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    toPercent(point) {
      const tempPoint = Number(point * 100);
      let str = '';
      util.isDot(tempPoint) ? str = tempPoint.toFixed(2) : str = tempPoint;
      str += '%';
      return str;
    },

    async getBestAndWorstStores() {
      const self = this;
      const storesArray = [];

      const bestStoreObj = {};
      bestStoreObj.storeSort = self.$t('overview.starStore');
      bestStoreObj.storeName = '';
      bestStoreObj.iconSrc = self.bestStoreIcon;
      bestStoreObj.qualifiedRate = self.$t('overview.passRate') + ' ' + '0%';
      storesArray.push(bestStoreObj);
      const worstStoreObj = {};
      worstStoreObj.storeSort = self.$t('overview.backwordStroe');
      worstStoreObj.storeName = '';
      worstStoreObj.iconSrc = self.worstStoreIcon;
      worstStoreObj.qualifiedRate = self.$t('overview.passRate') + ' ' + '0%';
      storesArray.push(worstStoreObj);

      try {
        const bestAndWorstStoreRes = await self.getInspectStatsOverStore(self.params);
        const errCode = bestAndWorstStoreRes.errCode;
        if (errCode === 0) {
          const resData = bestAndWorstStoreRes.data;
          const bestStore = resData.bestStore;
          const worstStore = resData.worstStore;
          if (bestStore) {
            storesArray[0].storeName = bestStore.storeName;
            storesArray[0].qualifiedRate = self.$t('overview.passRate') + ' ' + bestStore.qualifiedRate + '%';
          }
          if (worstStore) {
            storesArray[1].storeName = worstStore.storeName;
            storesArray[1].qualifiedRate = self.$t('overview.passRate') + ' ' + worstStore.qualifiedRate + '%';
          }
          self.bestAndWorstStore = storesArray;
        }
        self.bestAndWorstStore = storesArray;
      } catch (e) {
        self.bestAndWorstStore = storesArray;
        console.log('PatrolOverview - getBestAndWorstStores:' + e);
      }
    },

    getInspectStatsOverStore(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverStore(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getInspectItems() {
      const self = this;
      const inspectItems = await self.getInspectStatsItemInfo(self.params);
      const ignorePer = 0;
      const errCode = inspectItems.errCode;
      const jsonArray = self.itemsLegend.slice(1);
      let seriesData = [];
      if (errCode === 0) {
        let totalIgnored = 0;
        let totalUnqualified = 0;
        let totalQualified = 0;
        const resultData = inspectItems.data;
        try {
          resultData.forEach(item => {
            totalIgnored += item.numOfIgnored;
            totalUnqualified += item.numOfUnqualified;
            totalQualified += item.numOfQualified;
          });
          resultData.sort((item1, item2) => {
            return item1.numOfUnqualified < item2.numOfUnqualified ? 1 : -1;
          });
          const topFiveArray = resultData.slice(0, 5);
          const firstItem = topFiveArray[0];
          self.curItemId = firstItem.inspectItemId;
          self.curItemName = firstItem.inspectItemName;
          topFiveArray.forEach(item => {
            const percent = item.numOfUnqualified / firstItem.numOfUnqualified;
            item.percent = parseInt((percent * 100).toFixed(0));
          });
          seriesData = [
            { value: totalQualified, name: self.$t('overview.pass') },
            { value: totalUnqualified, name: self.$t('overview.failed') },
            { value: totalIgnored, name: self.$t('overview.ignored') }
          ];
          self.itemsTopFive = topFiveArray.filter(x => x.percent > 0);
          self.showItemRadar(firstItem, 0);
        } catch (e) {
          self.itemsTopFive = [];
          seriesData = [];
        }
        const totalArray = [totalQualified, totalUnqualified, totalIgnored];
        jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
        jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
        jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        self.itemsOptions = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
            textStyle: {
              align: 'left'
            },
            backgroundColor: self.echartBackground
          },
          series: [
            {
              name: self.$t('overview.itemsAssessment'),
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
                    var colorList = ['#8fd92e', '#f59249', '#cad1db'];
                    return colorList[params.dataIndex];
                  }
                }
              }
            }
          ]
        };
      }
      self.itemsPerArray = jsonArray;
    },

    getInspectStatsItemInfo(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsItemOverview(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    getInspectItemsOverRegion(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsItemOverviewRegion(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    async getInspectTaskRanking() {
      const self = this;
      let params = {};
      params = JSON.parse(JSON.stringify(self.params));
      params.lowestFirst = self.isWorstWork;
      params.numOfPerson = 5;
      try {
        const result = await self.getInspectStatsOverPerson(params);
        const tempTaskList = [];
        if (result.errCode === 0) {
          const resultData = result.data;
          resultData.forEach(item => {
            const json = {};
            json.supervisorName = item.supervisorName;
            let completionRate = item.completionRate;
            completionRate = util.isDot(completionRate) ? completionRate.toFixed(2) : completionRate;
            json.completionRate = completionRate;
            const perStr = item.completionRate.toFixed(0);
            json.percent = parseInt(perStr);
            tempTaskList.push(json);
          });
        }
        self.taskList = tempTaskList;
      } catch (e) {
        self.taskList = [];
        console.log('PatrolOverview-getInspectTaskRanking:' + e);
      }
    },

    getInspectStatsOverPerson(params) {
      return new Promise((resolve, reject) => {
        GetInspectStatsOverPerson(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getPassRateAndCycle() {
      const self = this;
      const cycleOptions = self.getPassRateAndCycleOption();
      try {
        const result = await self.getPassRateAndInspectRate(self.params);
        self.regionResultList = result.data;
        const dangerRateMoreArray = [];
        const dangerRateLessArray = [];
        const passRateMoreArray = [];
        const passRateLessArray = [];
        if (result.errCode === 0) {
          const resultData = result.data;
          if (resultData.length > 0) {
            resultData.forEach(item => {
              const inspectNum = item.numOfReport;
              const inspectCycle = item.cycleOfInspect;
              const qualifiedRate = item.qualifiedRate;
              const excellentRate = item.excellentRate;
              const dangerRate = ((item.numOfDangerous / inspectNum) * 100).toFixed(2);
              const floatRage = parseInt(dangerRate);
              const region = item.region;
              const tempArray = [];
              if (inspectCycle > 0) {
                tempArray.push(qualifiedRate);
                tempArray.push(inspectCycle);
                tempArray.push(excellentRate);
                tempArray.push(parseFloat(dangerRate));
                tempArray.push(region);
                if (qualifiedRate > 50) {
                  qualifiedRate >= 60 ? passRateMoreArray.push(tempArray) : passRateLessArray.push(tempArray);
                } else {
                  floatRage >= 60 ? dangerRateMoreArray.push(tempArray) : dangerRateLessArray.push(tempArray);
                }
              }
            });
            cycleOptions.series[0].data = dangerRateMoreArray;
            cycleOptions.series[1].data = dangerRateLessArray;
            cycleOptions.series[2].data = passRateMoreArray;
            cycleOptions.series[3].data = passRateLessArray;
          } else {
            cycleOptions.series[4].data = [[0, 31]];
          }
        } else {
          cycleOptions.series[4].data = [[0, 31]];
        }
        self.cycleOption = cycleOptions;
        self.getTopFiveRegionList();
      } catch (e) {
        self.cycleOption = cycleOptions;
        console.log('PatrolOverview-getPassRateAndCycle:' + e);
      }
    },

    getPassRateAndCycleOption() {
      const self = this;
      const schema = [
        { name: 'inspectCycle', index: 0, text: this.$t('overview.cycle') },
        { name: 'passRate', index: 1, text: this.$t('overview.passRate') },
        { name: 'excellentRate', index: 2, text: this.$t('overview.excellentRate') },
        { name: 'dangerRate', index: 3, text: this.$t('overview.dangerRate') },
        { name: 'region', index: 5, text: this.$t('overview.region') }
      ];

      const itemPassStyle = {
        normal: {
          opacity: 0.8,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderColor: '#8fd92e'
        }
      };

      const itemDangerStyle = {
        normal: {
          opacity: 0.8,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderColor: '#f11e66'
        }
      };

      const options = {
        backgroundColor: '#fff',
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
          }
        ],
        legend: {
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          fontSize: 12,
          padding: 0,
          textStyle: {
            color: this.echartColor,
            fontSize: 12
          },
          data: [
            { name: this.$t('overview.dangerousMore'), icon: 'rect' },
            { name: this.$t('overview.DangerousLess'), icon: 'rect' },
            { name: this.$t('overview.excellentLess'), icon: 'rect' },
            { name: this.$t('overview.excellentMore'), icon: 'rect' }]
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        color: [
          'rgba(243,29,101,1)', 'rgba(243,29,101,0.5)', 'rgba(114,161,243, 1)', 'rgba(114,161,243,0.5)'
        ],
        grid: {
          containLabel: true,
          top: '10',
          left: '8',
          right: '0',
          bottom: '30'
        },
        tooltip: {
          padding: 5,
          textStyle: {
            align: 'left'
          },
          axisPointer: {
            type: 'line'
          },
          formatter: function(obj) {
            const value = obj.value;
            if (value[0] == undefined) {
              return;
            }
            let htmlRegion = `${schema[4].text}: `; // region
            let passStr = `${schema[1].text}: `; // pass rate
            let dangerousStr = `${schema[3].text}: `; // dangerous rate
            const allData = [...options.series[0].data, ...options.series[1].data, ...options.series[2].data, ...options.series[3].data];
            allData.forEach(item => {
              if (value[0] === item[0] && value[1] === item[1]) {
                htmlRegion += `${item[4]},`;
                passStr += `${item[0]}%,`;
                dangerousStr += `${item[3]}%,`;
              }
            });
            htmlRegion = htmlRegion.substr(0, htmlRegion.length - 1);
            passStr = passStr.substr(0, passStr.length - 1);
            dangerousStr = dangerousStr.substr(0, dangerousStr.length - 1);
            let htmlF = '';
            if (value[0] > 50) {
              htmlF = `${htmlRegion}<br>
                          ${passStr}<br>
                          ${schema[0].text}: ${value[1]}${self.$t('overview.day')}<br>`;
            } else {
              htmlF = `${htmlRegion}<br>
                          ${dangerousStr}<br>
                          ${schema[0].text}: ${value[1]}${self.$t('overview.day')}<br>`;
            }

            return htmlF;
          },
          backgroundColor: this.echartBackground
        },
        xAxis: {
          type: 'value',
          nameGap: 10,
          padding: [10, 0, 0, 0],
          nameTextStyle: {
            color: '#7D8CAB',
            fontSize: 12
          },
          max: 102,
          splitNumber: 10,
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
            lineStyle: {
              color: this.echartAxiasColor
            }
          },
          axisLabel: {
            fontStyle: 12,
            color: this.echartColor,
            formatter: function(value, index) {
              if (value === 0) {
                return '';
              } else {
                return value + '%';
              }
            }

          }
        },
        yAxis: {
          type: 'value',
          nameGap: 10,
          minInterval: 7,
          // interval: 7,
          nameTextStyle: {
            color: '#7D8CAB',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: this.echartAxiasColor
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
            width: 10,
            color: this.echartColor
          }
        },

        series: [
          {
            name: this.$t('overview.dangerousMore'),
            type: 'scatter',
            itemStyle: itemDangerStyle,
            symbolSize: function() {
              return 15;
            },
            markLine: {
              symbol: 'none',
              slient: true,
              data: [{
                xAxis: 50,
                valueIndex: 0,
                lineStyle: {
                  normal: {
                    color: '##7D8CAB',
                    type: 'dashed'
                  }
                },
                label: {
                  normal: {
                    show: false
                  }
                }
              }
              ]
            },
            data: []
          },
          {
            name: this.$t('overview.DangerousLess'),
            type: 'scatter',
            itemStyle: itemDangerStyle,
            symbolSize: 15,
            data: []
          },
          {
            name: this.$t('overview.excellentMore'),
            type: 'scatter',
            itemStyle: itemPassStyle,
            symbolSize: 15,
            data: []
          },
          {
            name: this.$t('overview.excellentLess'),
            type: 'scatter',
            itemStyle: itemPassStyle,
            symbolSize: 15,
            data: []
          },
          {
            name: '无数据',
            type: 'scatter',
            itemStyle: itemPassStyle,
            symbolSize: 0,
            data: []
          }
        ]
      };
      return options;
    },

    getPassRateAndInspectRate(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverviewWithRegion(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getRegionInspectResult() {
      const self = this;
      self.dataMap = {};
      self.regionInspectListData = [];
      self.showPreviousGroup = false;
      self.showNextGroup = false;
      const regionOption = self.getRegionInspectOption();
      let params = {};
      params = JSON.parse(JSON.stringify(self.params));
      params.region = 1;
      params.timeMode = self.timeMode;
      const result = await self.getInspectResultOverRegion(params);
      if (result.errCode === 0) {
        const resultData = result.data;
        self.regionInspectListData = resultData;
        if (resultData.length > 0) {
          resultData.forEach(item => {
            const regions = item.regions;
            regions.sort((item1, item2) => {
              return item1.region < item2.region ? 1 : -1;
            });
          });
          const regions = resultData[0].regions;
          const length = regions.length;
          const groupSize = Math.ceil(length / self.showRegionNum);
          self.totalGroupNum = groupSize;
          self.totalGroupNum > 1 ? self.showNextGroup = true : self.showNextGroup = false;
          const tempRegions = util.groupArrayOnSize(regions, self.showRegionNum);
          self.regionGroups = tempRegions;
          const regionList = [];
          tempRegions[0].forEach((item) => {
            regionList.push(item.region);
          });
          self.regionList = regionList;
          regionOption.baseOption.xAxis[0].data = self.regionList;
          resultData.forEach((item) => {
            const dateTime = item.ts;
            const region = item.regions;
            const dangerousList = [];
            const improvedList = [];
            const passList = [];
            region.forEach(_item => {
              const itemDangerJson = {};
              itemDangerJson.name = _item.region;
              itemDangerJson.value = _item.numOfDangerous;
              dangerousList.push(itemDangerJson);
              const itemImprovedJson = {};
              itemImprovedJson.name = _item.region;
              itemImprovedJson.value = _item.numOfImproved;
              improvedList.push(itemImprovedJson);
              const itemQualifiedJson = {};
              itemQualifiedJson.name = _item.region;
              itemQualifiedJson.value = _item.numOfQualified;
              passList.push(itemQualifiedJson);
            });
            const tempOption = {};
            const seriesArray = new Array(3);
            const seriesDanJson = {};
            seriesDanJson.stack = 'test';
            seriesDanJson.data = dangerousList;
            seriesArray[0] = seriesDanJson;

            const seriesImproveJson = {};
            seriesImproveJson.stack = 'test';
            seriesImproveJson.data = improvedList;
            seriesArray[1] = seriesImproveJson;

            const seriesPassJson = {};
            seriesPassJson.stack = 'test';
            seriesPassJson.data = passList;
            seriesArray[2] = seriesPassJson;
            tempOption.series = seriesArray;
            regionOption.options.push(tempOption);
            self.regionChartEmpty = false;
          });
        } else {
          self.dataMap.dataDanger = { 0: [] };
          self.dataMap.dataImproved = { 0: [] };
          self.dataMap.dataQualified = { 0: [] };
          self.regionChartEmpty = true;
        }
      } else {
        self.dataMap.dataDanger = { 0: [] };
        self.dataMap.dataImproved = { 0: [] };
        self.dataMap.dataQualified = { 0: [] };
        self.regionChartEmpty = true;
      }
      self.storeOptions = regionOption;
    },

    getRegionInspectOption() {
      const regionOption = {
        baseOption: {
          color: ['#f11e66', '#f59249', '#8fd92e'],
          timeline: {
            axisType: 'category',
            currentIndex: this.currentIndex,
            autoPlay: true,
            playInterval: 10 * 1000,
            data: this.daysRangeList,
            padding: [10, 0, 5, 0],
            symbolSize: 5,
            left: 30,
            right: 20,
            label: {
              position: 5,
              color: this.echartColor,
              fontSize: 12
            },
            lineStyle: {
              color: this.echartColor
            },
            controlStyle: {
              color: this.echartColor,
              borderColor: this.echartColor,
              itemSize: 12
            },
            checkpointStyle: {
              color: '#f11e66',
              symbolSize: 5
            },
            emphasis: {
              label: {
                color: '#f11e66'
              },
              itemStyle: {
                color: '#f11e66'
              },
              checkpointStyle: {
                color: '#f11e66'
              },
              controlStyle: {
                color: '#f11e66'
              }
            }
          },
          calculable: false,
          grid: {
            left: '20',
            right: '0',
            top: '10',
            bottom: '57',
            containLabel: true
          },
          textStyle: {
            fontFamily: this.fontFamily
          },
          tooltip: {
            trigger: 'axis',
            padding: 5,
            axisPointer: {
              type: 'line'
            },
            textStyle: {
              align: 'left'
            },
            backgroundColor: this.echartBackground
          },
          legend: {
            x: 'center',
            y: 'bottom',
            icon: 'rect',
            data: this.resultList,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            padding: [15, 0, 0, 0],
            textStyle: {
              color: this.echartColor
            }

          },
          xAxis: [
            {
              'type': 'category',
              'axisLabel': {
                'interval': 0
              },
              'data': [],
              padding: 0,
              axisLine: {
                show: false,
                lineStyle: {
                  color: this.echartAxiasColor
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: this.echartColor
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                show: false
              },
              nameGap: 10,
              interval: 100,
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: this.echartColor
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: this.echartAxiasColor,
                  width: 1
                }

              }
            }
          ],
          series: [
            { name: this.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10' },
            { name: this.$t('overview.improve'), type: 'bar', barWidth: 35, barGap: '10' },
            { name: this.$t('overview.echartGood'), type: 'bar', barWidth: 35, barGap: '10' }
          ]
        },

        options: []
      };
      return regionOption;
    },

    getInspectResultOverRegion(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverRegion(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    adjustChart() {
      this.$refs.storeChart && this.$refs.storeChart.resize();
      this.$refs.itemsPie && this.$refs.itemsPie.resize();
      this.$refs.itemsRadar && this.$refs.itemsRadar.resize();
      this.$refs.cycleChart && this.$refs.cycleChart.resize();
    },

    saveSearchParams() {
      const searchConditon = {
        path: 'patrolOverview',
        params: this.params
      }
      SearchConditionUtil.saveSearchCondition(searchConditon)
    },

    getSearchParams() {
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      this.params.beginTs = this.dateValue[0].valueOf();
      this.params.endTs = this.dateValue[1].valueOf();
      const daysDiff = this.$moment(this.params.endTs).diff(this.params.beginTs, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
    }

  }
};
</script>

<style lang="scss" scoped>
  @import '../../assets/sass/overview.scss';
</style>
