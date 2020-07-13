<template>
  <div class="el-overview-content">
    <div class="el-date">
      <span class="date-title">{{$t('overview.date')}}</span>
      <el-date-picker
        ref="datePicker"
        v-model="dateValue"
        type="daterange"
        range-separator="-"
        size="mini"
        :clearable=false
        :editable=false
        format="yyyy/MM/dd"
        class="date-range"
        :popper-class="poperClass"
        :picker-options='dateOpt'
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
        :default-time="['00:00:00', '23:59:59']"
        unlink-panels
      >
      </el-date-picker>
      <el-tooltip class="item"
                  placement="right" :popper-class="tooltipClass">
        <div slot="content">{{$t('overview.dataRangeTips')}}</div>
        <i class="iconfont icon-bangzhu iconbangzhu"></i>
      </el-tooltip>
      <span class="el-store">
        {{$t('overview.totalStore')}}{{totalStoreNum}}{{$t('overview.totalUnit')}}
      </span>
    </div>
    <div class="el-overview">
      <el-row class="zone-row">
        <el-col :span="4" class="kpi-list">
          <div class="title">{{$t('overview.kpiIndex')}}</div>
          <div class="kpi-content">
            <div class="total-store">
              <div class="total-title">{{$t('overview.totalPatrol')}}</div>
              <div class="total-num">{{numOfInspects}}</div>
            </div>
            <div class="total-store" style="margin-bottom: 0">
              <div class="total-title">{{$t('overview.advPatrolCycle')}}</div>
              <div class="total-num">{{cycleOfInspect}}<span class="day" v-if="cycleOfInspect !='N/A'">{{$t('overview.day')}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="14" class="store-list">
          <div class="title">{{$t('overview.patrolStatus')}}</div>
          <div class="region-result">
            <div class="region-content">
              <div class="region-result-panel">
                <v-chart :options="storeOptions" class="result-content" :auto-resize='true' ref="storeChart" @timelinechanged="timelineHandler"/>
                <i @click="previousGroup" class="el-icon-arrow-left icon-arrow" v-if="showPreviousGroup"></i>
                <div v-if="regionChartEmpty" class="empty-text">{{$t('overview.noData')}}</div>
                <i @click="nextGroup" class="el-icon-arrow-right icon-arrow" v-if="showNextGroup"></i>
              </div>
            </div>
          </div>

        </el-col>
        <el-col :span="6" class="focus-list">
          <div class="title">
            <span class="area-title" v-if="isWorstArea">{{$t('overview.worstRegion')}}</span>
            <span class="area-title" v-else>{{$t('overview.bestRegion')}}</span>
            <!--<span class="arrows">-->
            <!--<i @click="showBestArea" class="iconfont icon-arrow_xiangshang" :class="{ 'active-arrow': !isWorstArea }"></i>-->
            <!--<i @click="showWorstArea" class="iconfont icon-arrow-xiangxia-copy" :class="{ 'active-arrow': isWorstArea }"></i>-->
            <!--</span>-->
            <span class="arrows" @click="changBestAndWorst">
              <span class="order-span" v-if="isWorstArea">{{$t('overview.descendingOrder')}}</span>
              <span class="order-span" v-else>{{$t('overview.ascendingOrder')}}</span>
              <img :src="descending" v-if="isWorstArea" class="img-class">
              <img :src="ascending" v-else class="img-class">
            </span>
          </div>
          <div class="focus-content" v-if="regionTopFive.length > 0">
            <!--<v-chart :auto-resize='true' :options="topRegionOption" class="chart-content"></v-chart>-->
            <div class="item-chart" v-for="(item, index) in regionTopFive" :key="index">
              <div class="item-ranking" :class="`item-ranking-${index}`">0{{index+1}}</div>
              <div class="region-name">{{item.region}}</div>
              <div class="item-titles">
                <el-tooltip placement="bottom" :key="index" :popper-class="elTooltipClass">
                  <div slot="content">{{item.region}}<br/>{{item.firstName}}: {{item.firstNum}}<br/>{{item.secondName}}:
                    {{item.secondNum}}
                  </div>
                  <div class="process-list">
                    <el-progress :percentage="item.firstPercent" :stroke-width="10" :color="item.firstColor"
                                 :show-text="false"
                                 :class="item.firstNum > 0 ? 'item-process': 'region-process'"></el-progress>
                    <el-progress :percentage="item.secondPercent" :stroke-width="10" :color="item.secondColor"
                                 :show-text="false"
                                 :class="item.secondNum > 0 ? 'item-process': 'region-process'"></el-progress>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div v-else class="empty-content">
            {{$t('overview.noData')}}
          </div>
        </el-col>
      </el-row>
      <el-row class="task-row">
        <div class="titles">
          <span class="title">{{$t('overview.patrolRanking')}}</span>
          <span class="arrows" @click="changWorkerRanking">
            <span class="order-span" v-if="isWorstWork">{{$t('overview.descendingOrder')}}</span>
            <span class="order-span" v-else>{{$t('overview.ascendingOrder')}}</span>
            <img :src="descending" v-if="isWorstWork" class="img-class">
              <img :src="ascending" v-else class="img-class">
          </span>
          <!--<span class="arrows">-->
          <!--<i @click="showBestWorks" class="iconfont icon-arrow_xiangshang" :class="{ 'active-arrow': !isWorstWork }"></i>-->
          <!--<i @click="showWorstWorks" class="iconfont icon-arrow-xiangxia-copy" :class="{ 'active-arrow': isWorstWork }"></i>-->
          <!--</span>-->
          <!--<span class="five-title" v-if="isWorstWork">{{$t('overview.worstPatrol')}}</span>-->
          <!--<span class="five-title" v-else>{{$t('overview.bestPatrol')}}</span>-->
        </div>
        <div class="task-dashboard">
          <div class="task-board" v-if="taskList.length > 0" :class="taskList.length < 5 ? 'space-task': ''">
            <div class="task-item" v-for="(item,index) in taskList" :key="index">
              <div class="task-panel">
                <el-progress class="process-panel" type="dashboard" :percentage="item.percent" color="#72a1f3"
                             :show-text="false"></el-progress>
                <div class="percent-num">
                  <span class="num" v-if="!item.appended">{{item.completionRate}}</span>
                  <span class="percent" v-if="!item.appended">%</span>
                </div>
              </div>
              <div class="task-supervisor-name">{{item.supervisorName}}</div>
            </div>
          </div>
          <div v-else class="task-empty">
            {{$t('overview.noData')}}
          </div>
        </div>
      </el-row>
      <el-row class="items-row">
        <el-col :span="6" class="evalution-pct">
          <div class="title">{{$t('overview.itemsAssessment')}}</div>
          <div class="pct-content">
            <div class="pct-panel">
              <v-chart :auto-resize='true' :options="itemsOptions" class="chart-content" ref="itemsPie"></v-chart>
            </div>
            <div class="pct-nums">
              <div class="content-labels" :class="lang='en'? 'en-labels': ''" v-for="(item, index) in itemsPerArray"
                   :key="index">
                <div class="excellent_nums">{{item.percent}}%</div>
                <div class="excellent_labels">
                  <span class="labels excellent-label" :class="`label-` + index"></span>
                  <span class="label-desc">{{item.type}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="focus-items">
            <div class="title">{{$t('overview.worstItems')}}</div>
            <el-row class="items-panel">
              <el-col :span="16" class="top-five-items">
                <div class="items-list" v-if="itemsTopFive.length > 0">
                  <div class="item-chart" v-for="(item, index) in itemsTopFive" :key="index"
                       @click="showItemRadar(item, index)" :class="item.isClick?'active-color':''">
                    <div class="item-ranking" :class="`item-ranking-${index}`">0{{index+1}}</div>
                    <div class="item-titles">
                      <div class="item-title">{{item.inspectItemName}}</div>
                    </div>
                    <div class="item-progress">
                      <el-progress :percentage="item.percent" :stroke-width="10" color="#ff5353" :show-text="false"
                                   :class="item.isClick?'item-process':'inactive-item-process'"></el-progress>
                    </div>
                    <div class="ranking-num">{{item.numOfUnqualified}}</div>
                  </div>
                </div>
                <div v-else class="top-five-empty">
                  {{$t('overview.noData')}}
                  <!--<img :src="loadingGif" />-->
                  <!--<div class="empty-text"> 加载中</div>-->
                </div>
              </el-col>
              <el-col :span="8" class="item-radar">
                <div class="rader-panel" v-if="itemsTopFive.length > 0">
                  <div class="radar-title">{{curItemName}}</div>
                  <v-chart :options="itemsRadarOption" class="radar-content" :auto-resize='true' ref="itemsRadar"/>
                </div>
                <div v-else class="radar-empty">
                  {{$t('overview.noData')}}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row class="star-row">
        <el-col class="stores-list" :span="6">
          <div class="best-store" v-for="(item, index) in bestAndWorstStore" :key="index">
            <div class="best-icon">
              <img class="store-icon" :src="item.iconSrc"/>
            </div>
            <div class="title">{{item.storeSort}}</div>
            <div v-if="item.storeName">
              <div class="store-name">{{item.storeName}}</div>
              <div class="pass-pct">{{item.qualifiedRate}}</div>
            </div>
            <div v-else>
              <div class="empty-store">{{$t('overview.noData')}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="inspect-cycle">
            <div class="cycle-title">{{$t('overview.avgPatrlCycle')}}</div>
            <div class="cycle-panel">
              <div class="panel-info">*{{$t('overview.dataZoomInfo')}}</div>
              <div class="panel-bubble">
                <v-chart :options="cycleOption" class="radar-content" :auto-resize='true' ref="cycleChart"/>
              </div>
              <div class="cycle-axis">{{$t('overview.cycle')}}</div>
              <div class="pass-rate-axis">{{$t('overview.passRate')}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/map'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/scatter'
  import 'echarts/lib/chart/effectScatter'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/polar'
  import 'echarts/lib/component/geo'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/visualMap'
  import 'echarts/lib/component/dataset'
  import 'echarts/map/js/world'
  import 'zrender/lib/svg/svg'
  import util from '../../common/util.js'
  import {
    getInspectStatsOverview,
    getInspectStatsOverStore,
    getInspectStatsItemOverview,
    getInspectStatsItemOverviewRegion,
    GetInspectStatsOverPerson,
    getInspectStatsOverviewWithRegion,
    getInspectStatsOverRegion
  } from '@/api/inspectOverview'
  import {Message} from 'element-ui'
  import {getCookie} from '@/common/auth';
  import {isLoginIn} from '@/api/login'
  import {mapGetters} from 'vuex'

  export default {
    name: "ExceptEvent",
    components: {
      'v-chart': ECharts
    },
    data() {
      return {
        dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
        dateOpt: {
          disabledDate: (time) => {
            return time.getTime() > this.$moment(new Date).endOf('d').toDate();
          }
        },
        toolTipClass: 'page-login-toolTipClass',
        tooltipClass: 'tooltip-class',
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
          },
        ],
        resultList: [this.$t('overview.danger'), this.$t('overview.improve'), this.$t('overview.pass')],
        itemsLegend: [
          {
            'type': this.$t("overview.excellent"),
            'percent': '0%',
          },
          {
            'type': this.$t("overview.pass"),
            'percent': '0%',
          },
          {
            'type': this.$t("overview.failed"),
            'percent': '0%',
          },
          {
            'type': this.$t("overview.ignored"),
            'percent': '0%',
          }
        ],
        cycleOption: null,
        dataMap: {},
        poperClass: 'date-picker-poper',
        selectpoperClass: 'select-poper',
        elTooltipClass: 'el-tooltip-class',
        lang: this.$i18n.locale,
        timeMode: 1, //weekly mode
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
        sidebarElm: null,
        fontFamily: 'Roboto, Microsoft YaHei'
      }

    },
    computed: {
      ...mapGetters({accountChanged: 'accountChanged'})
    },
    watch: {
      accountChanged(val, oldVal) {
        console.log(val);
        let self = this;
        if (val != 0) {
          self.timeMode = 1;
          self.isEnSpan = false;
          self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date).endOf('d').toDate()];
          let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
          let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
          self.params.beginTs = start;
          self.params.endTs = end;
          self.currentIndex = 0;
          self.initData();
        }
      }
    },
    methods: {
      changBestAndWorst() {
        let self = this;
        self.isWorstArea = !self.isWorstArea;
        self.isWorstArea ? self.showWorstArea() : self.showBestArea();
      },
      changWorkerRanking() {
        let self = this;
        self.isWorstWork = !self.isWorstWork;
        self.isWorstWork ? self.showWorstWorks() : self.showBestWorks();
      },
      showWorstArea() {
        let self = this;
        self.isWorstArea = true;
        self.getTopFiveRegionList()
      },
      showBestArea() {
        let self = this;
        self.isWorstArea = false;
        self.getTopFiveRegionList()
      },
      showWorstWorks() {
        let self = this;
        self.isWorstWork = true;
        self.getInspectTaskRanking();
      },
      showBestWorks() {
        let self = this;
        self.isWorstWork = false
        self.getInspectTaskRanking();
      },
      timelineHandler(event, instance, echarts){
        console.log(event);
        let self = this;
        self.currentIndex = event.currentIndex;
        console.log(self.currentIndex)
      },
      previousGroup() {
        let self = this;
        self.curGroupIndex == 0 ? 0 : self.curGroupIndex--;
        if (self.curGroupIndex == 0) {
          self.showPreviousGroup = false;
          self.showNextGroup = true;
        }
        else {
          self.showPreviousGroup = true;
        }
        console.log(self.curGroupIndex)
        let option = {
          baseOption: {
            color: ["#f31d65", "#ffd035", "#72a1f3"],
            timeline: {
              axisType: 'category',
              currentIndex: self.currentIndex,
              autoPlay: true,
              playInterval: 10 * 1000,
              data: self.daysRangeList,
              padding: [10, 0, 5, 0],
              symbolSize: 5,
              label: {
                position: 5,
                color: self.echartColor,
                fontSize: 12,
              },
              lineStyle: {
                color: self.echartBackground,
              },
              controlStyle: {
                color: self.echartColor,
                borderColor: self.echartColor,
                itemSize: 12,
              },
              checkpointStyle: {
                color: '#f31d65',
                symbolSize: 5
              },
              emphasis: {
                label: {
                  color: '#f31d65',
                },
                itemStyle: {
                  color: '#f31d65',
                },
                checkpointStyle: {
                  color: '#f31d65',
                },
                controlStyle: {
                  color: '#f31d65',
                }
              }
            },
            calculable: false,
            grid: {
              left: '20',
              right: '0',
              top: '10',
              bottom: '57',
              containLabel: true,
            },
            textStyle:{
              fontFamily: self.fontFamily
            },
            tooltip: {
              trigger: 'axis',
              padding: 5,
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle: {
                align: 'left'
              },
              backgroundColor: self.echartBackground,//通过设置rgba调节背景颜色与透明度
            },
            legend: {
              x: 'center',
              y: 'bottom',
              icon: 'rect',
              data: self.resultList,
              itemWidth: 10,
              itemHeight: 10,
              itemGap: 10,
              padding: [15, 0, 0, 0],
              textStyle: {
                color: self.echartColor,
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
                    color: self.echartAxiasColor,
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: self.echartColor,
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
                    color: [self.echartColor],
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: self.echartAxiasColor,
                    width: 1,
                  }
                },
              }
            ],
            series: [
              {name: self.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.improve'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.pass'), type: 'bar', barWidth: 35, barGap: '10'},
              // {name: self.$t('overview.excellent'), type: 'bar', barWidth: 35, barGap: '10'},
            ]
          },

          options: []
        };

        let resultData = self.regionInspectListData;
        console.log(resultData)
        if (resultData.length > 0) {
          let regions = resultData[0].regions;
          console.log(regions);
          let regionList = [];
          self.regionGroups[self.curGroupIndex].forEach((item, index) => {
            regionList.push(item.region)
          })
          self.regionList = regionList;
          option.baseOption.xAxis[0].data = self.regionList;
          //遍历立即督导、待改善、合格、优秀
          let dangerJson = {};
          let improvedJson = {};
          let passJson = {};
          // let excellentJson = {};
          resultData.forEach((item, index) => {
            let dateTime = item.ts;
            let region = item.regions;
            let dangerousList = [];
            let improvedList = [];
            let passList = [];
            // let excellentList = [];
            region.forEach(_item => {
              if (self.regionList.indexOf(_item.region) == -1) {
                return;
              }
              let itemDangerJson = {};
              itemDangerJson.name = _item.region;
              itemDangerJson.value = _item.numOfDangerous;
              dangerousList.push(itemDangerJson);
              let itemImprovedJson = {};
              itemImprovedJson.name = _item.region;
              itemImprovedJson.value = _item.numOfImproved;
              improvedList.push(itemImprovedJson);
              let itemQualifiedJson = {};
              itemQualifiedJson.name = _item.region;
              itemQualifiedJson.value = _item.numOfQualified;
              passList.push(itemQualifiedJson);
              // let itemExcellentJson = {};
              // itemExcellentJson.name = _item.region;
              // itemExcellentJson.value = _item.numOfExcellent;
              // excellentList.push(itemExcellentJson);
            })
            let tempOption = {};
            let seriesArray = new Array(3);
            let seriesDanJson = {};
            seriesDanJson.stack = 'test';
            seriesDanJson.data = dangerousList;
            seriesArray[0] = seriesDanJson;

            let seriesImproveJson = {};
            seriesImproveJson.stack = 'test';
            seriesImproveJson.data = improvedList;
            seriesArray[1] = seriesImproveJson;

            let seriesPassJson = {};
            seriesPassJson.stack = 'test';
            seriesPassJson.data = passList;
            seriesArray[2] = seriesPassJson;

            // let seriesExcJson = {};
            // seriesExcJson.stack = 'test';
            // seriesExcJson.data = excellentList;
            // seriesArray[3] = seriesExcJson;
            tempOption.series = seriesArray;
            option.options.push(tempOption)
            self.regionChartEmpty = false;
          })
        }
        else {
          self.dataMap.dataDanger = {0: []};
          self.dataMap.dataImproved = {0: []};
          self.dataMap.dataQualified = {0: []}
          // self.dataMap.dataExcellent = {0: []};
          self.regionChartEmpty = true;
          option.baseOption.timeline.autoPlay = false;
        }
        self.storeOptions = option;
      },
      nextGroup() {
        let self = this;
        self.curGroupIndex < self.totalGroupNum - 1 ? self.curGroupIndex++ : self.curGroupIndex;
        if (self.curGroupIndex == self.totalGroupNum - 1) {
          self.showNextGroup = false;
          self.showPreviousGroup = true;
        }
        else {
          self.showNextGroup = true;
        }
        console.log(self.curGroupIndex)
        let option = {
          baseOption: {
            color: ["#f31d65", "#ffd035", "#72a1f3"],
            timeline: {
              axisType: 'category',
              currentIndex: self.currentIndex,
              autoPlay: true,
              playInterval: 10 * 1000,
              data: self.daysRangeList,
              padding: [10, 0, 5, 0],
              symbolSize: 5,
              label: {
                position: 5,
                color: self.echartColor,
                fontSize: 12,
              },
              lineStyle: {
                color: self.echartColor,
              },
              controlStyle: {
                color: self.echartColor,
                borderColor: self.echartColor,
                itemSize: 12,
              },
              checkpointStyle: {
                color: '#f31d65',
                symbolSize: 5
              },
              emphasis: {
                label: {
                  color: '#f31d65',
                },
                itemStyle: {
                  color: '#f31d65',
                },
                checkpointStyle: {
                  color: '#f31d65',
                },
                controlStyle: {
                  color: '#f31d65',
                }
              }
            },
            calculable: false,
            grid: {
              left: '20',
              right: '0',
              top: '10',
              bottom: '57',
              containLabel: true,
            },
            textStyle:{
              fontFamily: self.fontFamily
            },
            tooltip: {
              trigger: 'axis',
              padding: 5,
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle: {
                align: 'left'
              },
              backgroundColor: self.echartBackground,
            },
            legend: {
              x: 'center',
              y: 'bottom',
              icon: 'rect',
              data: self.resultList,
              itemWidth: 10,
              itemHeight: 10,
              itemGap: 20,
              padding: [15, 0, 0, 0],
              textStyle: {
                color: self.echartColor,
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
                    color: self.echartAxiasColor,
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: self.echartColor,
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
                    color: self.echartColor,
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: self.echartAxiasColor,
                    width: 1,
                  }
                },
              }
            ],
            series: [
              {name: self.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.improve'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.pass'), type: 'bar', barWidth: 35, barGap: '10'},
              // {name: self.$t('overview.excellent'), type: 'bar', barWidth: 35, barGap: '10'},
            ]
          },

          options: []
        };

        let resultData = self.regionInspectListData;
        console.log(resultData)
        if (resultData.length > 0) {
          let regions = resultData[0].regions;
          console.log(regions);
          let regionList = [];
          self.regionGroups[self.curGroupIndex].forEach((item, index) => {
            regionList.push(item.region)
          })
          self.regionList = regionList;
          option.baseOption.xAxis[0].data = self.regionList;
          //遍历立即督导、待改善、合格、优秀
          let dangerJson = {};
          let improvedJson = {};
          let passJson = {};
          // let excellentJson = {};
          resultData.forEach((item, index) => {
            let dateTime = item.ts;
            let region = item.regions;
            let dangerousList = [];
            let improvedList = [];
            let passList = [];
            // let excellentList = [];
            region.forEach(_item => {
              if (self.regionList.indexOf(_item.region) == -1) {
                return;
              }
              let itemDangerJson = {};
              itemDangerJson.name = _item.region;
              itemDangerJson.value = _item.numOfDangerous;
              dangerousList.push(itemDangerJson);
              let itemImprovedJson = {};
              itemImprovedJson.name = _item.region;
              itemImprovedJson.value = _item.numOfImproved;
              improvedList.push(itemImprovedJson);
              let itemQualifiedJson = {};
              itemQualifiedJson.name = _item.region;
              itemQualifiedJson.value = _item.numOfQualified;
              passList.push(itemQualifiedJson);
              // let itemExcellentJson = {};
              // itemExcellentJson.name = _item.region;
              // itemExcellentJson.value = _item.numOfExcellent;
              // excellentList.push(itemExcellentJson);
            })
            let tempOption = {};
            let seriesArray = new Array(3);
            let seriesDanJson = {};
            seriesDanJson.stack = 'test';
            seriesDanJson.data = dangerousList;
            seriesArray[0] = seriesDanJson;

            let seriesImproveJson = {};
            seriesImproveJson.stack = 'test';
            seriesImproveJson.data = improvedList;
            seriesArray[1] = seriesImproveJson;

            let seriesPassJson = {};
            seriesPassJson.stack = 'test';
            seriesPassJson.data = passList;
            seriesArray[2] = seriesPassJson;

            // let seriesExcJson = {};
            // seriesExcJson.stack = 'test';
            // seriesExcJson.data = excellentList;
            // seriesArray[3] = seriesExcJson;
            tempOption.series = seriesArray;
            option.options.push(tempOption)
            self.regionChartEmpty = false;
          })
        }
        else {
          self.dataMap.dataDanger = {0: []};
          self.dataMap.dataImproved = {0: []};
          self.dataMap.dataQualified = {0: []}
          // self.dataMap.dataExcellent = {0: []};
          self.regionChartEmpty = true;
        }
        self.storeOptions = option;
      },
      async showItemRadar(item, index) {
        console.log(item);
        let self = this;
        self.curItemId = item.inspectItemId;
        self.curItemName = item.inspectItemName;
        item.isClick = true;
        self.itemsTopFive.forEach((_item, _index) => {
          if (index != _index) {
            _item.isClick = false;
          }
        })
        let itemsParam = {};
        itemsParam = JSON.parse(JSON.stringify(self.params));
        itemsParam.itemId = self.curItemId;
        console.log(itemsParam)
        let result = await self.getInspectItemsOverRegion(itemsParam);
        console.log(result);

        let options = {
          backgroundColor: '#fff',
          tooltip: {
            textStyle: {
              align: 'left'
            },
            backgroundColor: self.echartBackground,
          },
          textStyle:{
            fontFamily: self.fontFamily
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
                padding: [3, 5],
              },
              formatter: (params) => {
                console.log(params);
                let str = '';
                if (params.length > 6) {
                  str = params.substr(0, 6) + '...';
                }
                else {
                  str = params;
                }
                return str;
              },
            },
            indicator: [],
            axisLine: {
              lineStyle: {
                color: self.echartAxiasColor,
              },
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: self.echartAxiasColor // 图表背景网格线的颜色
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
                },
              },
              splitArea: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: self.echartAxiasColor,
                },
              },
              splitLine: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: self.echartAxiasColor // 图表背景网格线的颜色
                }
              }
            }
          ],
          series: [
            {
              type: 'radar',
              data: [],
            },
            {
              type: 'radar',
              data: [],
              name: self.$t('remotePatrol.items'),
              radarIndex: 1,
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#f31d65',
                    width: 1
                  },
                  areaStyle: {
                    color: 'rgba(243, 29, 101, 0.5)'
                  }
                },
              },
              tooltip: {
                trigger: 'item'
              },
            }
          ]
        };
        let tempIndicator = [];
        let seriesValue = [];
        if (result.errCode == 0) {
          let resultData = result.data;
          let max = 0;
          resultData.map(function (item, index) {
            if (item.numOfUnqualified > max) {
              max = item.numOfUnqualified
            }
          })
          resultData.forEach(item => {
            let obj = {};
            obj.name = item.regionName;
            obj.max = max;
            tempIndicator.push(obj);
            seriesValue.push(item.numOfUnqualified);
          })
        }
        let temp = [];
        let obj = {value: seriesValue};
        temp.push(obj);
        options.radar[0].indicator = tempIndicator;
        options.radar[1].indicator = tempIndicator;
        options.series[0].data = temp;
        options.series[1].data = temp;
        options.radar.splitNumber = 5;
        self.itemsRadarOption = options;
        console.log(self.itemsRadarOption)
      },
      dealDateStr(val) {
        let dateRet = '';
        let startStr = val.split('~')[0];
        let endStr = val.split('~')[1];
        let start = new Date(startStr).getTime();
        let end = new Date(endStr).getTime();

        let todayFullYear = new Date().getFullYear();
        let todayMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
        let todayDate = new Date().getDate() < 10 ? '0' + (new Date().getDate()) : (new Date().getDate());
        let nowHour = new Date().getHours() < 10 ? '0' + (new Date().getHours()) : (new Date().getHours());
        let nowMin = new Date().getMinutes() < 10 ? '0' + (new Date().getMinutes()) : (new Date().getMinutes());
        let nowSec = new Date().getSeconds() < 10 ? '0' + (new Date().getSeconds()) : (new Date().getSeconds());

        let endFullYear = new Date(endStr).getFullYear();
        let endMonth = new Date(endStr).getMonth() + 1 < 10 ? ('0' + (new Date(endStr).getMonth() + 1)) : new Date(endStr).getMonth() + 1;
        let endDate = new Date(endStr).getDate() < 10 ? '0' + new Date(endStr).getDate() : new Date(endStr).getDate();
        if (todayFullYear == endFullYear && todayMonth == endMonth && todayDate == endDate) {  //截至日期选的是今天
        }
      },
      dateChange(val) {
        let self = this;
        console.log(val);
        self.currentIndex = 0;
        let start = typeof(val[0]) === 'object' ? val[0].getTime() : val[0];
        let end = typeof(val[1]) === 'object' ? val[1].getTime() : val[1];
        let daysDiff = self.$moment(end).diff(start, 'days');
        if (daysDiff < 6) {  //当前选择的时间范围不到7天
          self.$message({
              message:self.$t('overview.changeTimeRange'),
              type: 'warning'
          })

          start = end - 3600 * 24 * 6 * 1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        if (daysDiff > 364) {  //当前选择的时间范围超过365天
          self.$message({
            message:self.$t('overview.changeTimeRange'),
            type: 'warning'
          })
          start = end - 3600 * 24 * 364 * 1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        else {
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        daysDiff = self.$moment(end).diff(start, 'days');
        daysDiff <= 30 ? self.timeMode = 1 : self.timeMode = 2;
        console.log(self.timeMode);
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initData();
      },
      initData() {
        let self = this;
        let start = self.params.beginTs;
        let end = self.params.endTs;
        let startDay = self.$moment(start).format('YYYY-MM-DD');
        let endDay = self.$moment(end).format('YYYY-MM-DD');
        let startDayWithoutYear = self.$moment(start).format('MM/DD');
        let endDayWithoutYear = self.$moment(end).format('MM/DD');
        if (self.timeMode == 1) {
          let beginDay = new Date(util.judgeStart(startDay));
          let weekList = util.getWeek(beginDay, endDay)
          let arrLength = weekList.length;
          let firstEndTime = weekList[0].split('-')[1];
          let firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
          let lastStartTime = weekList[arrLength - 1].split('-')[0];
          let lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
          weekList.splice(0, 1, firstWeekStr);
          weekList.splice(arrLength - 1, 1, lastWeekStr);
          console.log(weekList);
          self.daysRangeList = weekList;

        }
        else if (self.timeMode == 2) {
          let monthArray = util.getMonthBetween(startDay, endDay)
          console.log(monthArray)
          self.daysRangeList = monthArray;
        }
        self.getStoreNumAndCycle();
        self.getBestAndWorstStores();
        self.getInspectItems();
        self.getInspectTaskRanking();
        self.getPassRateAndCycle();
        self.getRegionInspectResult();

      },
      compareDanger(a, b) {
        if (b.numOfDangerous > a.numOfDangerous) {
          return 1
        }
        else if (b.numOfDangerous === a.numOfDangerous) {
          return b.numOfImproved - a.numOfImproved
        }
        else {
          return -1;
        }
      },
      findMaxDanger(items) {
        let max = 1;
        items.map(function (item, index) {
          if (item.numOfDangerous > max) {
            max = item.numOfDangerous
          }
          if (item.numOfImproved > max) {
            max = item.numOfImproved
          }
        })
        return max;
      },
      compareExcellent(a, b) {
        if (b.numOfExcellent > a.numOfExcellent) {
          return 1
        }
        else if (b.numOfExcellent === a.numOfExcellent) {
          return b.numOfQualified - a.numOfQualified
        }
        else {
          return -1;
        }
      },
      findMaxExcellent(items) {
        let max = 1;
        items.map(function (item, index) {
          if (item.numOfExcellent > max) {
            max = item.numOfExcellent
          }
          if (item.numOfQualified > max) {
            max = item.numOfQualified
          }
        })
        return max;
      },
      getTopFiveRegionList() {
        let self = this;
        let result = self.regionResultList.concat([]);
        // if there is one region, no show best area
        if (result.length == 1 && !self.isWorstArea) {
          self.regionTopFive = [];
          return;
        }
        let firstColor = '';
        let secondColor = '';
        let firstName = '';
        let secondName = '';
        let maxValue = 0;
        let items = [];
        if (self.isWorstArea) {
          firstColor = '#f31d65';
          secondColor = '#ffd035';
          firstName = self.$t("overview.danger");
          secondName = self.$t("overview.improve");
          try {
            result.sort(self.compareDanger)
            maxValue = self.findMaxDanger(result);
          }
          catch (e) {
            result = [];
          }
        }
        else {
          firstColor = '#57e78f';
          secondColor = '#72a1f3';
          firstName = self.$t("overview.excellent");
          secondName = self.$t("overview.pass");
          try {
            result.sort(self.compareExcellent);
            maxValue = self.findMaxExcellent(result);
          }
          catch (e) {
            result = [];
          }
        }
        console.log(result);

        let topFiveArray = result.slice(0, 5);
        console.log(topFiveArray);
        let fiveArray = [];
        topFiveArray.forEach(item => {
          let json = {}
          json.region = item.region;
          if (self.isWorstArea) {
            let tempFirstDouble = (item.numOfDangerous / maxValue) * 100;
            let tempSecondDouble = (item.numOfImproved / maxValue) * 100;
            let firstPectStr = tempFirstDouble.toFixed(0);
            let firstSecondStr = tempSecondDouble.toFixed(0);
            json.firstPercent = parseInt(firstPectStr);
            json.secondPercent = parseInt(firstSecondStr);
            json.firstColor = firstColor;
            json.secondColor = secondColor;
            json.firstName = firstName;
            json.secondName = secondName;
            json.firstNum = item.numOfDangerous
            json.secondNum = item.numOfImproved;
            fiveArray.push(json)
          }
          else {
            let tempFirstDouble = (item.numOfExcellent / maxValue) * 100;
            let tempSecondDouble = (item.numOfQualified / maxValue) * 100;
            let firstPectStr = tempFirstDouble.toFixed(0);
            let firstSecondStr = tempSecondDouble.toFixed(0);
            json.firstPercent = parseInt(firstPectStr);
            json.secondPercent = parseInt(firstSecondStr);
            json.firstColor = firstColor;
            json.secondColor = secondColor;
            json.firstName = firstName;
            json.secondName = secondName;
            json.firstNum = item.numOfExcellent
            json.secondNum = item.numOfQualified;
            fiveArray.push(json)
          }
        })
        console.log(fiveArray)
        self.regionTopFive = fiveArray;
        // let option = {
        //   barGap:'10%',/*多个并排柱子设置柱子之间的间距*/
        //   barCategoryGap:'50%',/*多个并排柱子设置柱子之间的间距*/
        //   tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //       type: 'shadow'
        //     },
        //     textStyle:{
        //       align:'left'
        //     }
        //   },
        //   grid: {
        //     // left: '3%',
        //     // right: '4%',
        //     // bottom: '3%',
        //     // containLabel: true
        //     containLabel: true,
        //     top:'10',//距上边距
        //     left:'8',//距离左边距
        //     right:'0',//距离右边距
        //     bottom:'0',//距离下边距
        //   },
        //   xAxis: {
        //     type: 'value',
        //     show: false,
        //     boundaryGap: [0, 0.01],
        //     axisLine: {
        //       show: false
        //     },
        //     axisTick: {
        //       show: false
        //     },
        //     axisLabel: {
        //       textStyle: {
        //         color: self.echartColor,
        //       }
        //     },
        //   },
        //   yAxis: {
        //     type: 'category',
        //     axisLine: {
        //       show: false
        //     },
        //     axisTick: {
        //       show: false
        //     },
        //     axisLabel: {
        //       textStyle: {
        //         color: self.echartColor,
        //       }
        //     },
        //     data: []
        //   },
        //   series: [
        //     {
        //       name: firstName,
        //       type: 'bar',
        //       data: [],
        //       itemStyle: {
        //         normal: {
        //           color: firstColor,
        //           barBorderRadius: 50,
        //         }
        //
        //       },
        //     },
        //     {
        //       name: secondName,
        //       type: 'bar',
        //       data: [],
        //       itemStyle: {
        //         normal: {
        //           color: secondColor,
        //           barBorderRadius: 50,
        //         }
        //       },
        //
        //     }
        //   ]
        // };
        // let yAxisData = [];
        // let firstSeriesData = [];
        // let secondSeriesData = [];
        // self.regionResultList.forEach(item=>{
        //   console.log(item);
        //   yAxisData.push(item.region);
        //   if(self.isWorstArea){
        //     firstSeriesData.push(item.numOfDangerous);
        //     secondSeriesData.push(item.numOfImproved)
        //   }
        //   else{
        //     firstSeriesData.push(item.numberOfExcellent);
        //     secondSeriesData.push(item.numOfQualified)
        //   }
        // })
        // option.yAxis.data = yAxisData;
        // option.series[0].data = firstSeriesData;
        // option.series[1].data = secondSeriesData;
        // self.topRegionOption = option;

      },
      async getStoreNumAndCycle() {
        let self = this;
        let storeNumAndCycle = await self.getInspectStatsOverview(self.params);
        console.log(storeNumAndCycle)
        if (storeNumAndCycle.errCode == 0) {
          let result = storeNumAndCycle.data;
          if (result) {
            self.totalStoreNum = result.numOfStores;
            self.numOfInspects = result.numOfInspects;
            self.cycleOfInspect = result.cycleOfInspect == -1 ? 'N/A' : result.cycleOfInspect;
          }
        }
        else {
          self.notify(self.$t('overview.queryFail'), 'warning', 3000);
          self.totalStoreNum = 0;
          self.numOfInspects = 0;
          self.cycleOfInspect = 0;
        }
      },
      getInspectStatsOverview(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsOverview(params).then(res => {
            resolve(res);
          })
        })
      },
      toPercent(point) {
        let tempPoint = Number(point * 100);
        let str = '';
        util.isDot(tempPoint) ? str = tempPoint.toFixed(2) : str = tempPoint;
        str += "%";
        return str;
      },
      notify(msg, type, time) {
        this.$message({
          message: msg,
          type: type,
          duration: time
        });
      },
      async getBestAndWorstStores() {
        let self = this;
        let bestAndWorstStoreRes = await self.getInspectStatsOverStore(self.params)
        console.log(bestAndWorstStoreRes)
        let errCode = bestAndWorstStoreRes.errCode;
        if (errCode === 0) {
          let resData = bestAndWorstStoreRes.data;
          let bestStore = resData.bestStore;
          let worstStore = resData.worstStore;
          let storesArray = [];
          if (bestStore != null) {
            let bestJson = {};
            bestJson.storeSort = self.$t("overview.starStore");
            bestJson.storeName = bestStore.storeName;
            bestJson.iconSrc = self.bestStoreIcon;
            bestJson.qualifiedRate = self.$t("overview.passRate") + ' ' + bestStore.qualifiedRate + '%';
            storesArray.push(bestJson)
          }
          else {
            let bestJson = {};
            bestJson.storeSort = self.$t("overview.starStore");
            bestJson.storeName = '';
            bestJson.iconSrc = self.bestStoreIcon;
            storesArray.push(bestJson)
          }
          if (worstStore != null) {
            let worstJson = {};
            worstJson.storeSort = self.$t("overview.backwordStroe");
            worstJson.storeName = worstStore.storeName;
            worstJson.iconSrc = self.worstStoreIcon;
            worstJson.qualifiedRate = self.$t("overview.passRate") + ' ' + worstStore.qualifiedRate + '%';
            storesArray.push(worstJson)
          }
          else {
            let worstJson = {};
            worstJson.storeName = '';
            worstJson.storeSort = self.$t("overview.backwordStroe");
            worstJson.iconSrc = self.worstStoreIcon;
            storesArray.push(worstJson)
          }
          self.bestAndWorstStore = storesArray
        }
        else {
          self.notify(self.$t('overview.queryFail'), 'warning', 3000);
        }
      },
      getInspectStatsOverStore(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsOverStore(params).then(res => {
            resolve(res);
          })
        })
      },
      async getInspectItems() {
        let self = this;
        let inspectItems = await self.getInspectStatsItemInfo(self.params);
        console.log(inspectItems);
        // let excellentPer = 0;
        let qualifiedPer = 0;
        let unqualifiedPer = 0;
        let ignorePer = 0;
        let errCode = inspectItems.errCode;
        let jsonArray = self.itemsLegend.slice(1);
        let seriesData = [];
        if (errCode == 0) {
          let totalIgnored = 0;
          let totalUnqualified = 0;
          let totalQualified = 0;
          // let totalExcellent = 0;
          let resultData = inspectItems.data;
          // sort by num Of Unqualified

          console.log(resultData)
          try {
            resultData.forEach(item => {
              totalIgnored += item.numOfIgnored;
              totalUnqualified += item.numOfUnqualified;
              totalQualified += item.numOfQualified;
              // totalExcellent += item.numOfExcellent;
            })
            resultData.sort((item1, item2) => {
              return item1.numOfUnqualified < item2.numOfUnqualified ? 1 : -1;
            })
            console.log(resultData);
            let topFiveArray = resultData.slice(0, 5);
            console.log(topFiveArray);
            let firstItem = topFiveArray[0];
            self.curItemId = firstItem.inspectItemId;
            self.curItemName = firstItem.inspectItemName;
            topFiveArray.forEach(item => {
              let percent = item.numOfUnqualified / firstItem.numOfUnqualified;
              item.percent = parseInt((percent * 100).toFixed(0));
            })
            seriesData = [
              // {value: totalExcellent, name: self.$t('overview.excellent')},
              {value: totalQualified, name: self.$t('overview.pass')},
              {value: totalUnqualified, name: self.$t('overview.failed')},
              {value: totalIgnored, name: self.$t('overview.ignored')}
            ];
            console.log(topFiveArray);
            self.itemsTopFive = topFiveArray.filter(x=> x.percent > 0);
            self.showItemRadar(firstItem, 0);
          }
          catch (e) {
            self.itemsTopFive = [];
            seriesData = [];
          }
          let totalArray = [totalQualified, totalUnqualified, totalIgnored];
          console.log(totalArray);
          // let totalItems = totalIgnored + totalUnqualified + totalQualified + totalExcellent;
          // if(totalItems != 0){
          //   ignorePer = self.toPercent(totalIgnored/totalItems);
          //   unqualifiedPer = self.toPercent(totalUnqualified/totalItems);
          //   qualifiedPer = self.toPercent(totalQualified/totalItems);
          //   excellentPer = self.toPercent(totalExcellent/totalItems);
          // }
          // jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
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
              backgroundColor: self.echartBackground,
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
                  },
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
                    color: function (params) {
                      //自定义颜色
                      var colorList = ['#72a1f3', '#ffd035', '#cad1db'];
                      return colorList[params.dataIndex]
                    }
                  }
                }
              }
            ]
          }

        }
        self.itemsPerArray = jsonArray;
      },
      getInspectStatsItemInfo(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsItemOverview(params).then(res => {
            resolve(res);
          })
        })
      },
      getInspectItemsOverRegion(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsItemOverviewRegion(params).then(res => {
            resolve(res);
          })
        })
      },
      async getInspectTaskRanking() {
        let self = this;
        let params = {};
        params = JSON.parse(JSON.stringify(self.params));
        params.lowestFirst = self.isWorstWork;
        params.numOfPerson = 5;
        let result = await self.getInspectStatsOverPerson(params);
        console.log(result)
        let tempTaskList = [];
        if (result.errCode == 0) {
          let resultData = result.data;
          resultData.forEach(item => {
            let json = {};
            json.supervisorName = item.supervisorName;
            let completionRate = item.completionRate;
            util.isDot(completionRate) ? completionRate = completionRate.toFixed(2) : completionRate = completionRate
            json.completionRate = completionRate;
            let perStr = item.completionRate.toFixed(0);
            json.percent = parseInt(perStr);
            tempTaskList.push(json)
          })
        }
        self.taskList = tempTaskList;
      },
      getInspectStatsOverPerson(params) {
        console.log(params);
        return new Promise((resolve, reject) => {
          GetInspectStatsOverPerson(params).then(res => {
            resolve(res);
          })
        })
      },
      async getPassRateAndCycle() {
        let self = this;
        let result = await self.getPassRateAndInspectRate(self.params);
        console.log(result);
        self.regionResultList = result.data;
        let schema = [
          {name: 'inspectCycle', index: 0, text: self.$t('overview.cycle')},
          {name: 'passRate', index: 1, text: self.$t('overview.goodRate')},
          {name: 'excellentRate', index: 2, text: self.$t('overview.excellentRate')},
          {name: 'dangerRate', index: 3, text: self.$t('overview.dangerRate')},
          {name: 'region', index: 5, text: self.$t('overview.region')},
        ];
        let itemPassStyle = {
          normal: {
            opacity: 0.8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderColor: '#72a1f3',
          }
        };
        let itemDangerStyle = {
          normal: {
            opacity: 0.8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderColor: '#f31d65',
          }
        };
        // let tooltip = {
        //   padding: 10,
        //     backgroundColor: '#222',
        //     borderColor: '#777',
        //     borderWidth: 1,
        //     textStyle:{
        //     align:'left',
        //       fontSize: 12
        //   },
        //   formatter: function (obj) {
        //     var value = obj.value;
        //     console.log(value)
        //     return schema[4].text + ': ' + value[4] + '<br>'
        //       + schema[0].text + '：' + value[1] + self.$t("overview.day") + '<br>'
        //       + schema[1].text + '：' + value[0] + '%<br>'
        //       + schema[2].text + '：' + value[2] + '%<br>'
        //       + schema[3].text + '：' + value[3] + '%<br>';
        //   }
        // };
        let options = {
          backgroundColor: '#fff',
          dataZoom: [
            {
              id: 'dataZoomX',
              type: 'inside',
              xAxisIndex: [0],
              filterMode: 'filter',
            },
            // {
            //   id: 'dataZoomY',
            //   type: 'inside',
            //   yAxisIndex: [0],
            //   filterMode: 'filter',
            // },
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
              color: self.echartColor,
              fontSize: 12,
            },
            data: [
              {name: self.$t("overview.dangerousMore"), icon: 'rect'},
              {name: self.$t("overview.DangerousLess"), icon: 'rect'},
              {name: self.$t("overview.excellentLess"), icon: 'rect'},
              {name: self.$t("overview.excellentMore"), icon: 'rect'}]
          },
          textStyle:{
            fontFamily: self.fontFamily
          },
          color: [
            'rgba(243,29,101,1)', 'rgba(243,29,101,0.5)', 'rgba(114,161,243, 1)', 'rgba(114,161,243,0.5)'
          ],
          grid: {
            containLabel: true,
            top: '10',//距上边距
            left: '8',//距离左边距
            right: '0',//距离右边距
            bottom: '30',//距离下边距
          },
          tooltip: {
            padding: 5,
            textStyle: {
              align: 'left',
            },
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (obj) {
              let value = obj.value;
              if (value[0] == undefined) {
                return;
              }
              let htmlRegion = `${schema[4].text}: ` //region
              let passStr = `${schema[1].text}: ` //pass rate
              // let execellentStr = `${schema[2].text}: ` //excellent rate
              let dangerousStr = `${schema[3].text}: ` //dangerous rate
              let allData = [...options.series[0].data, ...options.series[1].data, ...options.series[2].data, ...options.series[3].data]
              allData.forEach(item => {
                if (value[0] === item[0] && value[1] === item[1]) {
                  htmlRegion += `${item[4]},`
                  passStr += `${item[2]}%,`
                  // execellentStr += `${item[2]}%,`
                  dangerousStr += `${item[3]}%,`
                }
              });
              htmlRegion = htmlRegion.substr(0, htmlRegion.length -1)
              // execellentStr = execellentStr.substr(0, execellentStr.length -1)
              passStr = passStr.substr(0, passStr.length -1)
              dangerousStr = dangerousStr.substr(0, dangerousStr.length - 1)
              let htmlF = ''
              if(value[0] > 50){
                htmlF = `${htmlRegion}<br>
                          ${passStr}<br>
                          ${schema[0].text}: ${value[1]}${self.$t("overview.day")}<br>`
              }
              else{
                htmlF = `${htmlRegion}<br>
                          ${dangerousStr}<br>
                          ${schema[0].text}: ${value[1]}${self.$t("overview.day")}<br>`
              }

              return htmlF;
              // return schema[4].text + ': ' + value[4] + '<br>'
              //   + schema[0].text + '：' + value[1] + self.$t("overview.day") + '<br>'
              //   + schema[1].text + '：' + value[0] + '%<br>'
              //   + schema[2].text + '：' + value[2] + '%<br>'
              //   + schema[3].text + '：' + value[3] + '%<br>';
            },
            backgroundColor: self.echartBackground,
          },
          xAxis: {
            type: 'value',
            nameGap: 10,
            padding: [10, 0, 0, 0],
            nameTextStyle: {
              color: '#7D8CAB',
              fontSize: 12,
            },
            max: 102,
            splitNumber: 10,
            axisTick: {
              show: false,
              inside: true,
              lineStyle: {
                color: '#7D8CAB',
                fontSize: 12,
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
                color: self.echartAxiasColor
              }
            },
            axisLabel: {
              fontStyle: 12,
              color: self.echartColor,
              formatter: function (value, index) {
                if (value == 0) {
                  return ''
                }
                else {
                  return value + "%"
                }
              },

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
                color: self.echartAxiasColor
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
              color: self.echartColor
            }
          },

          series: [
            {
              name: self.$t("overview.dangerousMore"),
              type: 'scatter',
              itemStyle: itemDangerStyle,
              symbolSize: function () {
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
                },
                ]
              },
              data: [],
            },
            {
              name: self.$t("overview.DangerousLess"),
              type: 'scatter',
              itemStyle: itemDangerStyle,
              symbolSize: 15,
              data: []
            },
            {
              name: self.$t("overview.excellentMore"),
              type: 'scatter',
              itemStyle: itemPassStyle,
              symbolSize: 15,
              data: []
            },
            {
              name: self.$t("overview.excellentLess"),
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
            },
          ]
        };
        let dangerRateMoreArray = [];
        let dangerRateLessArray = [];
        let passRateMoreArray = [];
        let passRateLessArray = [];
        if (result.errCode == 0) {
          let resultData = result.data;
          if (resultData.length > 0) {
            resultData.forEach(item => {
              let inspectNum = item.numOfReport;
              let inspectCycle = item.cycleOfInspect;
              let qualifiedRate = item.qualifiedRate;
              let excellentRate = item.excellentRate;
              let dangerRate = ((item.numOfDangerous / inspectNum) * 100).toFixed(2);
              let floatRage = parseInt(dangerRate);
              let region = item.region;
              let tempArray = [];
              if (inspectCycle > 0) {
                tempArray.push(qualifiedRate)
                tempArray.push(inspectCycle)
                tempArray.push(excellentRate)
                tempArray.push(parseFloat(dangerRate))
                tempArray.push(region)
                console.log(tempArray);
                if (qualifiedRate > 50) {
                  qualifiedRate >= 60 ? passRateMoreArray.push(tempArray) : passRateLessArray.push(tempArray)
                }
                else {
                  floatRage >= 60 ? dangerRateMoreArray.push(tempArray) : dangerRateLessArray.push(tempArray)
                }
              }
              else {

              }
            })
            options.series[0].data = dangerRateMoreArray;
            options.series[1].data = dangerRateLessArray;
            options.series[2].data = passRateMoreArray;
            options.series[3].data = passRateLessArray;
          }
          else {
            options.series[4].data = [[0, 31]];
          }
        }
        else {
          options.series[4].data = [[0, 31]];
        }
        self.cycleOption = options;
        self.getTopFiveRegionList();
      },
      getPassRateAndInspectRate(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsOverviewWithRegion(params).then(res => {
            resolve(res)
          })
        })
      },
      async getRegionInspectResult() {
        let self = this;
        self.dataMap = {};
        self.regionInspectListData = [];
        let option = {
          baseOption: {
            color: ["#f31d65", "#ffd035", "#72a1f3"],
            timeline: {
              axisType: 'category',
              currentIndex: self.currentIndex,
              autoPlay: true,
              playInterval: 10 * 1000,
              data: self.daysRangeList,
              padding: [10, 0, 5, 0],
              symbolSize: 5,
              left: 30,
              right: 20,
              label: {
                position: 5,
                color: self.echartColor,
                fontSize: 12,
              },
              lineStyle: {
                color: self.echartColor,
              },
              controlStyle: {
                color: self.echartColor,
                borderColor: self.echartColor,
                itemSize: 12,
              },
              checkpointStyle: {
                color: '#f31d65',
                symbolSize: 5
              },
              emphasis: {
                label: {
                  color: '#f31d65',
                },
                itemStyle: {
                  color: '#f31d65',
                },
                checkpointStyle: {
                  color: '#f31d65',
                },
                controlStyle: {
                  color: '#f31d65',
                }
              }
            },
            calculable: false,
            grid: {
              left: '20',
              right: '0',
              top: '10',
              bottom: '57',
              containLabel: true,
            },
            textStyle:{
              fontFamily: self.fontFamily
            },
            tooltip: {
              trigger: 'axis',
              padding: 5,
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle: {
                align: 'left'
              },
              backgroundColor: self.echartBackground,
            },
            legend: {
              x: 'center',
              y: 'bottom',
              icon: 'rect',
              data: self.resultList,
              itemWidth: 10,
              itemHeight: 10,
              itemGap: 20,
              padding: [15, 0, 0, 0],
              textStyle: {
                color: self.echartColor,
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
                    color: self.echartAxiasColor,
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: self.echartColor,
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
                    color: self.echartColor,
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: self.echartAxiasColor,
                    width: 1,
                  }

                },
              }
            ],
            series: [
              {name: self.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.improve'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.pass'), type: 'bar', barWidth: 35, barGap: '10'},
              // {name: self.$t('overview.excellent'), type: 'bar', barWidth: 35, barGap: '10'},
            ]
          },

          options: []
        };
        let params = {};
        params = JSON.parse(JSON.stringify(self.params));
        params.region = 1;
        params.timeMode = self.timeMode;
        let result = await self.getInspectResultOverRegion(params);
        if (result.errCode == 0) {
          let resultData = result.data;
          self.regionInspectListData = resultData;
          console.log(resultData);
          if (resultData.length > 0) {
            resultData.forEach(item => {
              let regions = item.regions;
              regions.sort((item1, item2) => {
                return item1.region < item2.region ? 1 : -1;
              })
            })
            console.log(resultData);
            let regions = resultData[0].regions;
            console.log(regions);
            let length = regions.length;
            let groupSize = Math.ceil(length / self.showRegionNum);
            self.totalGroupNum = groupSize;
            self.totalGroupNum > 1 ? self.showNextGroup = true : self.showNextGroup = false;
            let tempRegions = util.groupArrayOnSize(regions, self.showRegionNum);
            self.regionGroups = tempRegions;
            console.log(tempRegions);
            let regionList = [];
            tempRegions[0].forEach((item, index) => {
              regionList.push(item.region)
            })
            self.regionList = regionList;
            option.baseOption.xAxis[0].data = self.regionList;
            //遍历立即督导、待改善、合格、优秀
            let dangerJson = {};
            let improvedJson = {};
            let passJson = {};
            // let excellentJson = {};
            resultData.forEach((item, index) => {
              let dateTime = item.ts;
              let region = item.regions;
              let dangerousList = [];
              let improvedList = [];
              let passList = [];
              // let excellentList = [];
              region.forEach(_item => {
                let itemDangerJson = {};
                itemDangerJson.name = _item.region;
                itemDangerJson.value = _item.numOfDangerous;
                dangerousList.push(itemDangerJson);
                let itemImprovedJson = {};
                itemImprovedJson.name = _item.region;
                itemImprovedJson.value = _item.numOfImproved;
                improvedList.push(itemImprovedJson);
                let itemQualifiedJson = {};
                itemQualifiedJson.name = _item.region;
                itemQualifiedJson.value = _item.numOfQualified;
                passList.push(itemQualifiedJson);
                // let itemExcellentJson = {};
                // itemExcellentJson.name = _item.region;
                // itemExcellentJson.value = _item.numOfExcellent;
                // excellentList.push(itemExcellentJson);
              })
              let tempOption = {};
              let seriesArray = new Array(3);
              let seriesDanJson = {};
              seriesDanJson.stack = 'test';
              seriesDanJson.data = dangerousList;
              seriesArray[0] = seriesDanJson;

              let seriesImproveJson = {};
              seriesImproveJson.stack = 'test';
              seriesImproveJson.data = improvedList;
              seriesArray[1] = seriesImproveJson;

              let seriesPassJson = {};
              seriesPassJson.stack = 'test';
              seriesPassJson.data = passList;
              seriesArray[2] = seriesPassJson;

              // let seriesExcJson = {};
              // seriesExcJson.stack = 'test';
              // seriesExcJson.data = excellentList;
              // seriesArray[3] = seriesExcJson;
              tempOption.series = seriesArray;
              option.options.push(tempOption)
              self.regionChartEmpty = false;
            })
          }
          else {
            self.dataMap.dataDanger = {0: []};
            self.dataMap.dataImproved = {0: []};
            self.dataMap.dataQualified = {0: []}
            // self.dataMap.dataExcellent = {0: []};
            self.regionChartEmpty = true;
          }
        }
        else {
          self.dataMap.dataDanger = {0: []};
          self.dataMap.dataImproved = {0: []};
          self.dataMap.dataQualified = {0: []}
          // self.dataMap.dataExcellent = {0: []}
          self.regionChartEmpty = true;
        }
        self.storeOptions = option;
      },
      getInspectResultOverRegion(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsOverRegion(params).then(res => {
            resolve(res)
          })
        })
      },
      adjustPatrolChart() {
        let self = this;
        console.log('尺寸改变');
        if (self.$refs.storeChart) {
          self.$refs.storeChart.resize();
        }
        if (self.$refs.itemsPie) {
          self.$refs.itemsPie.resize();
        }
        if (self.$refs.itemsRadar) {
          self.$refs.itemsRadar.resize();
        }
        if (self.$refs.cycleChart) {
          self.$refs.cycleChart.resize();
        }
      },
      handleSideBar(e){
        if(e.target === e.currentTarget || e.target === this){
          this.adjustPatrolChart();
        }
      },
    },
    created() {
      let self = this;
      let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
      let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
      self.params.beginTs = start;
      self.params.endTs = end;
      // let enSpan = this.lang == 'en' && (this.varWindowWidth < 1440);
      // console.log(enSpan)
      // self.isEnSpan = enSpan;
      // self.fontFamily = self.lang == 'en' ? 'Roboto' : 'Microsoft YaHei'
      self.initData();
    },
    mounted() {
      let self = this;
      window.addEventListener("resize", self.adjustPatrolChart, false);
      self.sidebarElm = document.getElementsByClassName('aside-menu')[0]
      self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false)
    },
    beforeDestroy() {
      let self = this;
      window.removeEventListener('resize', self.adjustPatrolChart);
      self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar,false)
      self.$refs.storeChart && self.$refs.storeChart.dispose()
      self.$refs.itemsPie && self.$refs.itemsPie.dispose()
      self.$refs.itemsRadar && self.$refs.itemsRadar.dispose()
      self.$refs.cycleChart &&  self.$refs.cycleChart.dispose();
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/textstyle.css';
  @import '../../assets/css/importfile.css';

  $red: #f31d65;
  $black: #182752;
  $border: #e3e9f4;
  $background: #f4f5f9;
  $tab: #7d8cad;
  $h1: #292e36;
  $excellent: #57e78f;
  $pass: #72a1f3;
  $failed: #ffd035;
  $ignored: #cad1db;
  @function rem($val) {
    @return $val/16+rem;
  }

  @function checkRem($val) {
    @if ($val==auto) {
      @return auto;
    } @else if ($val==0) {
      @return 0;
    } @else {
      @return rem($val);
    }
  }

  @mixin point($poi,$val) {
    #{$poi}: checkRem($val);
  }

  * {
    box-sizing: border-box;
  }

  .el-overview-content {
    width: 100%;
    position: relative;
    font-size: calc(14 / 1920 * 100vw);
    height: auto;
    /*background-color: #f6f9fe;*/
    .sourceType-icon {
      margin-right: calc(15 / 1920 * 100vw);
      position: relative;
      float: left;
      @include point(bottom, 3);
    }
    .icon-span {
      display: inline-block;
      width: calc(60 / 1920 * 100vw);
      height: calc(22 / 1920 * 100vw);
      color: white;
      font-size: calc(12 / 1920 * 100vw);
    }
    .el-date {
      height: 80px;
      line-height: 80px;
      text-align: left;
      margin-bottom: 30px;
      border-bottom: 1px solid $border;
      position: relative;
      background: #fff;
      .date-title {
        @include point(margin-left, 30);
        @include point(margin-right, 20);
        margin-left: calc(60/1920*100vw);
        margin-right: calc(40/1920*100vw);
        font-size: 14px;
        color: $black;
      }
      .iconbangzhu {
        font-size: calc(20 / 1920 * 100vw);
        position: relative;
        top: 2px;
        color: $tab;
      }
      .date-range {
        border: 1px solid #ccc;
        width: 200px;
        height: calc(36 / 1920 * 100vw);
        line-height: calc(36 / 1920 * 100vw);
      }
      .item {
        color: $tab;
        margin-left: calc(20/1920*100vw);
        margin-right: calc(8/1920*100vw);
      }
      .content {
        display: inline-block;
        font-size: 12px;
      }
      .el-store {
        position: absolute;
        right: 0px;
        @include point(margin-right, 30);
      }
    }
    .el-overview {
      position: relative;
      padding: 0 calc(25/1920*100vw);
      .zone-row {
        height: 400px;
        border: 1px solid $border;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        color: $black;
        .title {
          height: 70px;
          padding-top: 30px;
          margin-left: calc(30/1920*100vw);
          font-size: calc(20/1920*100vw);
          text-align: left;
        }
        .kpi-list {
          height: 100%;
          .kpi-content {
            height: 330px;
            border-top: 1px solid $border;
            border-right: 1px solid $border;
            display: flex;
            flex-direction: column;
            .total-store {
              height: 50%;
              border-bottom: 1px solid $border;
              padding-top: 40px;
              :last-child {
                border-bottom: none;
              }
              padding-left: calc(34/1920*100vw);
              .total-title {
                font-size: calc(16/1920*100vw);
                color: $tab;
                text-align: left;
              }
              .total-num {
                font-size: calc(30/1920*100vw);
                color: $h1;
                text-align: left;
                margin-top: 20px;
                .day {
                  padding-left: calc(10/1920*100vw);
                }
              }
            }
          }
        }
        .store-list {
          height: 400px;
          .region-result {
            border-top: 1px solid $border;
            border-right: 1px solid $border;
            height: 330px;
            padding: calc(25 / 1920 * 100vw) calc(45 / 1920 * 100vw) 0 calc(30 / 1920 * 100vw);
            .region-content {
              height: 270px;
              .region-result-panel {
                height: 290px;
                position: relative;
                .result-content {
                  height: 100%;
                  width: 100%;
                }
                .empty-text {
                  position: absolute;
                  top: 90px;
                  left: 50%;
                  font-size: calc(14 / 1920 * 100vw);
                  color: $tab;
                }
                .icon-arrow {
                  cursor: pointer;
                  border: 1px solid $tab;
                  border-radius: 50%;
                }
                .el-icon-arrow-right {
                  position: absolute;
                  top: 90px;
                  right: 0;
                }
                .el-icon-arrow-left {
                  position: absolute;
                  top: 90px;
                  left: calc(20 / 1920 * 100vw);
                }
              }

            }
          }

        }
        .focus-list {
          .focus-content {
            height: 330px;
            border-top: 1px solid $border;
            padding: 25px calc(30/1920*100vw);
            position: relative;
            .chart-content {
              height: 100%;
              width: 100%;
            }
            .item-chart {
              height: 20%;
              display: flex;
              align-items: center;
              .item-ranking {
                font-size: calc(18/1920*100vw);
                text-align: left;
                font-family: Roboto, Arial MT;
              }
              .item-ranking-0 {
                color: $red;
              }
              .item-ranking-1 {
                color: #fd8a51;
              }
              .item-ranking-2 {
                color: $failed;
              }
              .item-ranking-3 {
                color: $pass;
              }
              .item-ranking-4 {
                color: $tab;
              }
              .item-titles {
                margin: 0 calc(20/1920*100vw);
                flex-grow: 1;
                text-align: left;
                font-size: calc(14/1920*100vw);
                margin-left: 0;
                overflow: hidden;
                .item-title {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .item-process {
                  margin-bottom: 1px;
                }
              }
              .region-name {
                font-size: calc(14/1920*100vw);
                margin: 0 calc(30/1920*100vw) 0 calc(20/1920*100vw);
                width: 55px;
                text-align: left;
              }
              .ranking-num {
                font-size: calc(14/1920*100vw);
                text-align: left;
                white-space: nowrap;
              }
            }

          }
          .area-title {
            font-size: calc(20/1920*100vw);
            display: inline-block;
            /*margin-right: calc(10/1920*100vw);*/
          }
          .empty-content {
            font-size: calc(14/1920*100vw);
            color: $tab;
            padding-top: 140px;
            border-top: 1px solid $border;
          }
        }
      }
      .arrows {
        // width: calc(20/1920*100vw);
        display: inline-block;
        color: $tab;
        cursor: pointer;
        margin-left: calc(10/1920*100vw);
        @media screen and (max-width: 1280px) {
          margin-left: 0;
        }
        .order-span {
          font-size: 12px;
          vertical-align: middle;
        }
        .img-class {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
        .iconfont {
          font-size: calc(20/1920*100vw) !important;
          cursor: pointer;
        }
        .active-arrow {
          color: $red;
          font-size: calc(20/1920*100vw);
        }
      }
      .task-row {
        height: 340px;
        margin-top: 30px;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background-color: #fff;
        .titles {
          height: 70px;
          text-align: left;
          border-bottom: 1px solid $border;
          .title {
            height: 100%;
            padding-top: 30px;
            margin-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            display: inline-block;
            color: $black;
          }
          .arrows {
            font-size: calc(20 / 1920 * 100vw);
          }
          .active-arrow {
            color: $red;
          }
          .five-title {
            font-size: calc(16 / 1920 * 100vw);
            /*margin-left: calc(20/1920*100vw);*/
            color: $tab;
          }
        }
        .task-board {
          padding: 45px calc(90 / 1920 * 100vw);
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          .task-item {
            height: 100%;
            .task-panel {
              width: 150px;
              height: 126px;
              position: relative;
              .process-panel {
                width: 100%;
                height: 100%;
                margin: 0 auto;
                .el-progress-circle {
                  width: 150px !important;
                  height: 150px !important;
                  margin: 0 auto;
                  /*@media screen and (max-width: 1440px) {*/
                  /*  width: 126px;*/
                  /*  height: 126px;*/
                  /*  margin: 0 auto;*/
                  /*}*/
                  /*@media screen and (max-width: 1280px) {*/
                  /*  width: 112px;*/
                  /*  height: 112px;*/
                  /*  margin: 0 auto;*/
                  /*}*/
                }
              }
              .percent-num {
                position: absolute;
                left: 50%;
                top: 75px;
                transform: translate(-50%, -50%);
                width: 100px;
                .num {
                  font-size: calc(30 / 1920 * 100vw);
                  color: #292e36;
                }
                .percent {
                  font-size: calc(16 / 1920 * 100vw);
                }
              }
            }
            .task-supervisor-name {
              font-size: calc(16 / 1920 * 100vw);
              color: $tab;
              text-align: center;
              margin-top: 30px;
            }
          }
        }
        .space-task {
          justify-content: space-around;
        }
        .task-empty {
          height: 270px;
          line-height: 270px;
          color: $tab;
        }
      }
      .items-row {
        height: 400px;
        margin-top: 30px;
        .title {
          height: 70px;
          width: 100%;
          padding-top: 30px;
          padding-left: calc(30 / 1920 * 100vw);
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
        }
        .evalution-pct {
          border: 1px solid $border;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          height: 400px;
          .pct-content {
            padding-top: 25px;
            padding-bottom: 25px;
            border-top: 1px solid $border;
            width: 100%;
            text-align: center;
            .pct-panel {
              height: 210px;
              width: 210px;
              margin: 0 auto;
              border-radius: 50%;
              background: -webkit-radial-gradient(circle closest-side, #fff 60%, $background 40%);
              .chart-content {
                width: 100%;
                height: 100%;
              }
            }
            .pct-nums {
              margin-top: 30px;
              font-size: calc(12 / 1920 * 100vw);
              display: flex;
              justify-content: center;
              @media screen and (max-width: 1680px) {
                padding: 0 0;
                justify-content: space-around;
              }
              .content-labels {
                padding: 0 calc(10 / 1920 * 100vw);
                font-size: calc(12 / 1920 * 100vw);
                text-align: left;
                .excellent_nums {
                  margin-left: calc(20 / 1920 * 100vw);
                  margin-bottom: 10px;
                  font-size: calc(14 / 1920 * 100vw);
                  line-height: calc(14 / 1920 * 100vw);
                }
                .excellent_labels {
                  line-height: 12px;
                  font-size: 0;
                  .labels {
                    height: 10px;
                    width: 10px;
                    display: inline-block;
                    margin-right: calc(10 / 1920 * 100vw);
                    @media screen and (min-width: 1280px) and (max-width: 1366px){
                      margin-right: calc(1 / 1920 * 100vw);
                    }
                  }
                  .label-desc {
                    color: $tab;
                    font-size: 12px;
                  }
                  // .label-0 {
                  //   background-color: $excellent;
                  // }
                  .label-0 {
                    background-color: $pass;
                  }
                  .label-1 {
                    background-color: $failed;
                  }
                  .label-2 {
                    background-color: $ignored;
                  }
                }
              }
              .en-labels {
                @media screen and (max-width: 1680px) {
                  padding: 0;
                }
              }
            }
          }
        }
        .focus-items {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid $border;
          margin-left: calc(20 / 1920 * 100vw);
          height: 400px;
          background-color: #fff;
          .title {
            border-bottom: 1px solid $border;
          }
          .items-panel {
            height: 298px;
            margin: 15px calc(15/1920*100vw);
            border: 1px solid $border;
            .top-five-items {
              height: 100%;
              position: relative;
              @media screen and (max-width: 1280px){
                width: 60%;
              }
              .items-list {
                height: 100%;
                background: $background;
                .item-chart {
                  height: 20%;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  border-bottom: 1px solid $border;
                  &:last-child {
                    border-bottom: none;
                  }
                  .item-ranking {
                    font-size: calc(18 / 1920 * 100vw);
                    text-align: left;
                    font-family: Roboto, Arial Rounded MT Bold;
                    padding: 0 calc(20 / 1920 * 100vw);
                  }
                  .item-ranking-0 {
                    color: $red;
                  }
                  .item-ranking-1 {
                    color: #fd8a51;
                  }
                  .item-ranking-2 {
                    color: $failed;
                  }
                  .item-ranking-3 {
                    color: $pass;
                  }
                  .item-ranking-4 {
                    color: $tab;
                  }
                  .item-titles {
                    text-align: left;
                    font-size: calc(14 / 1920 * 100vw);
                    width: calc(300 / 1920 * 100vw);
                    min-width: 160px;
                    .item-title {
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    }
                  }
                  .item-progress {
                    flex-grow: 1;
                    margin: 0 calc(20 / 1920 * 100vw);
                  }
                  .ranking-num {
                    font-size: calc(14 / 1920 * 100vw);
                    margin-right: calc(45 / 1920 * 100vw);
                    /*position: relative;*/
                    /*top: calc(8/1920*100vw);*/
                    text-align: left;
                  }
                }
                .active-color {
                  background: #fff;
                }
              }

              .top-five-empty {
                top: 50%;
                left: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                color: $tab;
                .empty-text {
                  display: inline-block;
                  vertical-align: top;
                  margin-left: calc(20 / 1920 * 100vw);
                  color: $tab;
                  font-size: calc(14 / 1920 * 100vw);
                }
              }
            }
            .item-radar {
              height: 100%;
              padding-left: calc(15 / 1920 * 100vw);
              padding-top: 15px;
              position: relative;
              @media screen and (max-width: 1280px){
                width: 40%;
                padding-left: 0;
              }
              .rader-panel {
                width: 100%;
                height: 100%;
                .radar-title {
                  text-align: left;
                  font-size: calc(14 / 1920 * 100vw);
                  color: $tab;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  @media screen and (max-width: 1280px){
                    padding-left: calc(15 / 1920 * 100vw);
                  }
                }
                .radar-content {
                  width: 100%;
                  height: calc(100% - 25px);
                }
              }
              .radar-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: calc(14 / 1920 * 100vw);
                color: $tab;
              }
            }

          }
        }
      }
      .star-row {
        height: 400px;
        margin-top: 30px;
        /*@media screen and (min-width: 1280px) and(max-width: 1440px) {*/
          /*height: 420px;*/
        /*}*/
        .stores-list {
          display: flex;
          border: 1px solid $border;
          flex-direction: column;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          height: 400px;
          .title {
            font-size: calc(20 / 1920 * 100vw);
            padding-top: 30px;
            color: $black;
          }
          .best-store {
            position: relative;
            text-align: left;
            border-bottom: 1px solid $border;
            padding-left: calc(30 / 1920 * 100vw);
            height: 50%;
            :last-child {
              border-bottom: none;
            }
            .empty-store {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              font-size: calc(14 / 1920 * 100vw);
              color: $tab;
            }
          }
          .best-icon {
            position: absolute;
            top: 0;
            right: 0;
            height: 100px;
            width: 100px;
            .store-icon {
              width: 100%;
              height: 100%;
            }
          }
          .store-name {
            font-size: calc(30 / 1920 * 100vw);
            margin-top: 20px;
            color: #292e36;
            max-width: calc(100% - 100px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .pass-pct {
            font-size: calc(16 / 1920 * 100vw);
            margin-top: 20px;
            color: $tab;
            margin-bottom: 45px;

          }
        }
        .inspect-cycle {
          background-color: #fff;
          margin-left: calc(20 / 1920 * 100vw);
          border: 1px solid $border;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          height: 400px;
          .cycle-title {
            height: 70px;
            padding-top: 30px;
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            border-bottom: 1px solid $border;
            color: $black;
          }
          .cycle-panel {
            height: 325px;
            padding: 0px calc(50 / 1920 * 100vw) 0 20px;
            position: relative;
            text-align: left;
            .panel-bubble {
              height: 270px;
              position: relative;
              .radar-content {
                height: 100%;
                width: 100%;
              }
            }
            .panel-info{
              height: 30px;
              line-height: 30px;
              font-size: 12px;
              color: #7d8cad;
            }
            .cycle-label {
              font-size: calc(12 / 1920 * 100vw);
              margin-bottom: 15px;
              display: flex;
              justify-content: center;
              position: relative;
              .cycle-labels {
                margin-right: calc(30 / 1920 * 100vw);
                line-height: calc(12 / 1920 * 100vw);
                margin-top: 20px;
                font-size: calc(12 / 1920 * 100vw);
                color: $tab;
                &:last-child {
                  margin-right: 0;
                }
                .label-rect {
                  height: calc(10 / 1920 * 100vw);
                  width: calc(10 / 1920 * 100vw);
                  margin-right: calc(10 / 1920 * 100vw);
                  display: inline-block;
                }
                .label-0 {
                  background: $red;
                }
                .label-1 {
                  background: $red;
                  opacity: 0.5;
                }
                .label-2 {
                  background: $excellent;
                }
                .label-3 {
                  background: $excellent;
                  opacity: 0.5;
                }
              }
            }
            .cycle-axis {
              position: absolute;
              top: 30px;
              left: 65px;
              font-size: calc(12 / 1920 * 100vw);
              color: $tab;
            }
            .pass-rate-axis {
              position: absolute;
              bottom: 85px;
              right: calc(50 / 1920 * 100vw);
              font-size: calc(12 / 1920 * 100vw);
              color: $tab;
            }
          }
        }
      }
    }
    .el-progress /deep/ path:first-child {
      stroke: #f4f5f9;
    }
  }
</style>
<style>
  @import '../../assets/css/pagination.css';

  .date-picker-poper .el-button--text {
    visibility: hidden !important;
  }

  .el-input__inner .el-input__inner {
    border: 1px solid #dddddd;
  }

  .process-panel .el-progress-circle {
    width: 150px !important;
    height: 150px !important;
  }

  .el-tooltip-class.el-tooltip__popper[x-placement^='bottom'] .popper__arrow {
    border-bottom-color: rgba(30, 34, 52, 0.75);
    display: none;
  }

  .el-tooltip-class.el-tooltip__popper[x-placement^='bottom'] .popper__arrow:after {
    border-bottom-color: rgba(30, 34, 52, 0.75);
  }

  .el-tooltip-class.el-tooltip__popper.is-dark {
    background: rgba(30, 34, 52, 0.75) !important;
    font-size: 14px !important;
    line-height: 21px;
    padding: 5px;
  }

  /*@media screen and ( max-width: 1680px ) and (min-width: 1440px) {*/
  /*  .process-panel .el-progress-circle {*/
  /*    width: 130px !important;*/
  /*    height: 130px !important;*/
  /*  }*/
  /*}*/

  /*@media screen and ( max-width: 1440px ) and (min-width: 1280px) {*/
  /*  .process-panel .el-progress-circle {*/
  /*    width: 112px !important;*/
  /*    height: 112px !important;*/
  /*  }*/
  /*}*/

  /*@media screen and (max-width: 1280px) {*/
  /*  .process-panel .el-progress-circle {*/
  /*    width: 100px !important;*/
  /*    height: 100px !important;*/
  /*  }*/
  /*}*/

  .item-process .el-progress-bar .el-progress-bar__outer {
    background-color: #fff;
  }

  .inactive-item-process .el-progress-bar .el-progress-bar__outer {
    background-color: #f4f5f9;
  }

  .region-process .el-progress-bar .el-progress-bar__outer {
    background-color: #f4f5f9;
  }

  .el-range-editor--mini .el-range-separator {
    height: calc(35 / 1920 * 100vw);
    line-height: calc(35 / 1920 * 100vw);
  }
</style>
