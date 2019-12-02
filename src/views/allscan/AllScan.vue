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
        format="yyyy/MM/dd HH:mm:ss"
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
        <el-col :span="4"  class="kpi-list">
          <div class="title">{{$t('overview.kpiIndex')}}</div>
          <div class="kpi-content">
            <div class="total-store">
              <div class="total-title">{{$t('overview.totalPatrol')}}</div>
              <div class="total-num">{{numOfInspects}}</div>
            </div>
            <div class="total-store" style="margin-bottom: 0">
              <div class="total-title">{{$t('overview.advPatrolCycle')}}</div>
              <div class="total-num">{{cycleOfInspect}}<span class="day"  v-if="cycleOfInspect !='N/A'">{{$t('overview.day')}}</span></div>
            </div>
          </div>
        </el-col>
        <el-col :span="14" class="store-list">
          <div class="title">{{$t('overview.patrolStatus')}}</div>
          <div class="region-result">
            <div class="region-content">
              <div class="region-result-panel">
                <v-chart  :options="storeOptions"  class="result-content" :auto-resize='true' ref="storeChart"/>
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
            <span class="arrows">
              <i @click="showBestArea" class="iconfont icon-arrow_xiangshang" :class="{ 'active-arrow': !isWorstArea }"></i>
              <i @click="showWorstArea" class="iconfont icon-arrow-xiangxia-copy" :class="{ 'active-arrow': isWorstArea }"></i>
            </span>
          </div>
          <div class="focus-content" v-if="regionTopFive.length > 0">
            <!--<v-chart :auto-resize='true' :options="topRegionOption" class="chart-content"></v-chart>-->
            <div class="item-chart" v-for="(item, index) in regionTopFive"  :key="index" >
              <div class="item-ranking" :class="`item-ranking-${index}`">0{{index+1}}</div>
              <div class="region-name" >{{item.region}}</div>
              <div class="item-titles">
                <el-tooltip placement="bottom" :key="index" :popper-class="elTooltipClass">
                  <div slot="content">{{item.region}}<br/>{{item.firstName}}: {{item.firstNum}}<br/>{{item.secondName}}: {{item.secondNum}}</div>
                  <div class="process-list">
                    <el-progress :percentage="item.firstPercent" :stroke-width="10" :color="item.firstColor"  :show-text="false" :class="item.firstNum > 0 ? 'item-process': 'region-process'"></el-progress>
                    <el-progress :percentage="item.secondPercent" :stroke-width="10" :color="item.secondColor"   :show-text="false" :class="item.secondNum > 0 ? 'item-process': 'region-process'"></el-progress>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div  v-else class="empty-content">
            {{$t('overview.noData')}}
          </div>
        </el-col>
      </el-row>
      <el-row class="task-row">
        <div class="titles">
          <span class="title">{{$t('overview.patrolRanking')}}</span>
          <span class="arrows">
            <i @click="showBestWorks" class="iconfont icon-arrow_xiangshang" :class="{ 'active-arrow': !isWorstWork }"></i>
            <i @click="showWorstWorks" class="iconfont icon-arrow-xiangxia-copy" :class="{ 'active-arrow': isWorstWork }"></i>
          </span>
          <!--<span class="five-title" v-if="isWorstWork">{{$t('overview.worstPatrol')}}</span>-->
          <!--<span class="five-title" v-else>{{$t('overview.bestPatrol')}}</span>-->
        </div>
        <div class = "task-dashboard" >
          <div class="task-board" v-if="taskList.length > 0" :class="taskList.length < 5 ? 'space-task': ''">
            <div class="task-item" v-for="(item,index) in taskList" :key="index">
              <div class="task-panel">
                <el-progress  class="process-panel" type="dashboard" :percentage="item.percent" color="#72a1f3" :show-text="false"></el-progress>
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
              <div class="content-labels" :class="lang='en'? 'en-labels': ''"  v-for="(item, index) in itemsPerArray" :key="index">
                <div class="excellent_nums">{{item.percent}}%</div>
                <div class="excellent_labels">
                  <span class="labels excellent-label" :class="`label-` + index"></span>
                  <span class="label-desc">{{item.type}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18" >
          <div class="focus-items">
            <div class="title" >{{$t('overview.worstItems')}}</div>
            <el-row class="items-panel">
              <el-col :span="16" class="top-five-items">
                <div class="items-list" v-if="itemsTopFive.length > 0">
                  <div class="item-chart" v-for="(item, index) in itemsTopFive"  :key="index" @click="showItemRadar(item, index)" :class="item.isClick?'active-color':''">
                    <div class="item-ranking" :class="`item-ranking-${index}`">0{{index+1}}</div>
                    <div class="item-titles">
                      <div class="item-title">{{item.inspectItemName}}</div>
                    </div>
                    <div class="item-progress">
                      <el-progress :percentage="item.percent" :stroke-width="10" color="#ff5353"  :show-text="false" :class="item.isClick?'item-process':'inactive-item-process'"></el-progress>
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
      <el-row class="star-row" >
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
          <div class="inspect-cycle" >
            <div class="cycle-title">{{$t('overview.avgPatrlCycle')}}</div>
            <div class="cycle-panel">
              <div class="panel-bubble">
                <v-chart :options="cycleOption" class="radar-content" :auto-resize='true'  ref="cycleChart"/>
              </div>
              <!--<div class="cycle-label">-->
              <!--<div class="cycle-labels" v-for="(item, index) in passRateList" :key="index">-->
              <!--<span class="label-rect" :class="`label-${index}`"></span>-->
              <!--{{item.desc}}</div>-->
              <!--</div>-->
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
  import {getInspectStatsOverview, getInspectStatsOverStore, getInspectStatsItemOverview,
    getInspectStatsItemOverviewRegion, GetInspectStatsOverPerson, getInspectStatsOverviewWithRegion, getInspectStatsOverRegion} from '@/api/inspectOverview'
  import {Message} from 'element-ui'
  import {getCookie} from '@/common/auth';
  import {isLoginIn} from '@/api/login'
  import {mapGetters} from 'vuex'
  export default {
    name: "ExceptEvent",
    components:{
      'v-chart': ECharts
    },
    data(){
      return{
        dateValue:[this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
        dateOpt: {
          disabledDate:(time)=>{
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
        params:{},
        bestAndWorstStore: [],
        itemsOptions: null,
        storeOptions: null,
        itemsPerArray: [],
        itemsTopFive:[],
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
        resultList:[this.$t('overview.danger'),this.$t('overview.improve'),this.$t('overview.pass'),this.$t('overview.excellent')],
        itemsLegend: [
          {
            'type' : this.$t("overview.excellent"),
            'percent' : '0%',
          },
          {
            'type' : this.$t("overview.pass"),
            'percent' : '0%',
          },
          {
            'type' : this.$t("overview.failed"),
            'percent' : '0%',
          },
          {
            'type' : this.$t("overview.ignored"),
            'percent' : '0%',
          }
        ],
        cycleOption:null,
        dataMap: {},
        poperClass:'date-picker-poper',
        selectpoperClass:'select-poper',
        elTooltipClass: 'el-tooltip-class',
        lang: this.$i18n.locale,
        timeMode: 1, //weekly mode
        daysRangeList: [],
        regionList: [],
        topRegionOption: null,
        regionResultList: [],
        regionTopFive: [],
        echartColor: '#7d8cab',
        regionChartEmpty: true,
        showRegionNum: 10,
        totalGroupNum: 0,
        curGroupIndex: 0,
        regionGroups: [],
        regionInspectListData:[],
        varWindowWidth:window.innerWidth,
        varyWindowHeight:window.innerHeight,
        isEnSpan: false,
        showNextGroup: false,
        showPreviousGroup: false
      }

    },
    computed:{
      ...mapGetters({accountChanged:'accountChanged'})
    },
    watch:{
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.timeMode = 1;
          self.isEnSpan= false;
          self.dateValue = [self.$moment().startOf('month').toDate(),self.$moment(new Date).endOf('d').toDate()];
          let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
          let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
          self.params.beginTs = start;
          self.params.endTs = end;
          self.initData();
        }
      }
    },
    methods:{
      showWorstArea(){
        let self = this;
        self.isWorstArea = true;
        self.getTopFiveRegionList()
      },
      showBestArea(){
        let self = this;
        self.isWorstArea = false;
        self.getTopFiveRegionList()
      },
      showWorstWorks(){
        let self = this;
        self.isWorstWork = true;
        self.getInspectTaskRanking();
      },
      showBestWorks(){
        let self = this;
        self.isWorstWork = false
        self.getInspectTaskRanking();
      },
      previousGroup(){
        let self = this;
        self.curGroupIndex == 0 ? 0 : self.curGroupIndex--;
        if(self.curGroupIndex == 0){
          self.showPreviousGroup = false;
          self.showNextGroup = true;
        }
        else{
          self.showPreviousGroup = true;
        }
        console.log(self.curGroupIndex)
        let option = {
          baseOption: {
            color: ["#f31d65", "#ffd035", "#72a1f3", "#57e78f"],
            timeline: {
              axisType: 'category',
              autoPlay: true,
              playInterval: 10*1000,
              data: self.daysRangeList,
              padding: [10,0,5,0],
              symbolSize: 5,
              label:{
                position: 5,
                color: self.echartColor,
                fontSize: 12,
              },
              lineStyle:{
                color: self.echartColor,
              },
              controlStyle:{
                color: self.echartColor,
                borderColor: self.echartColor,
                itemSize: 12,
              },
              checkpointStyle:{
                color: '#f31d65',
                symbolSize: 5
              },
              emphasis:{
                label:{
                  color: '#f31d65',
                },
                itemStyle:{
                  color: '#f31d65',
                },
                checkpointStyle: {
                  color: '#f31d65',
                },
                controlStyle:{
                  color: '#f31d65',
                }
              }
            },
            calculable : false,
            grid: {
              left: '20',
              right: '0',
              top: '10',
              bottom: '57',
              containLabel: true,
            },
            tooltip : {
              trigger: 'axis',
              padding: 5,
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle:{
                align:'left'
              }
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
              textStyle:{
                color: self.echartColor,
              }

            },
            xAxis: [
              {
                'type':'category',
                'axisLabel':{
                  'interval':0
                },
                'data': [],
                padding: 0,
                axisLine: {
                  show: false,
                  lineStyle:{
                    color: '#e3e9f4',
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: '#7D8CAB',
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
                    color: '#7D8CAB',
                  }
                },
                splitLine:{
                  show:true,
                },
              }
            ],
            series: [
              {name: self.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.improve'), type: 'bar',barWidth: 35, barGap: '10'},
              {name: self.$t('overview.pass'), type: 'bar' ,barWidth: 35, barGap: '10'},
              {name: self.$t('overview.excellent'), type: 'bar',barWidth: 35, barGap: '10'},
            ]
          },

          options: []
        };

        let resultData = self.regionInspectListData;
        console.log(resultData)
        if(resultData.length > 0){
          let regions = resultData[0].regions;
          console.log(regions);
          let regionList = [];
          self.regionGroups[self.curGroupIndex].forEach((item, index)=>{
            regionList.push(item.region)
          })
          self.regionList = regionList;
          option.baseOption.xAxis[0].data = self.regionList;
          //遍历立即督导、待改善、合格、优秀
          let dangerJson = {};
          let improvedJson = {};
          let passJson = {};
          let excellentJson = {};
          resultData.forEach((item, index)=>{
            let dateTime = item.ts;
            let region = item.regions;
            let dangerousList = [];
            let improvedList = [];
            let passList = [];
            let excellentList = [];
            region.forEach(_item=>{
              if(self.regionList.indexOf(_item.region) == -1){
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
              let itemExcellentJson = {};
              itemExcellentJson.name = _item.region;
              itemExcellentJson.value = _item.numOfExcellent;
              excellentList.push(itemExcellentJson);
            })
            let tempOption = {};
            let seriesArray = new Array(4);
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

            let seriesExcJson = {};
            seriesExcJson.stack = 'test';
            seriesExcJson.data = excellentList;
            seriesArray[3] = seriesExcJson;
            tempOption.series = seriesArray;
            option.options.push(tempOption)
            self.regionChartEmpty = false;
          })
        }
        else{
          self.dataMap.dataDanger = {0:[]};
          self.dataMap.dataImproved = {0:[]};
          self.dataMap.dataQualified = {0:[]}
          self.dataMap.dataExcellent = {0:[]};
          self.regionChartEmpty = true;
        }
        self.storeOptions = option;
      },
      nextGroup(){
        let self = this;
        self.curGroupIndex < self.totalGroupNum-1 ? self.curGroupIndex++ : self.curGroupIndex;
        if(self.curGroupIndex == self.totalGroupNum-1){
          self.showNextGroup = false;
          self.showPreviousGroup = true;
        }
        else{
          self.showNextGroup = true;
        }
        console.log(self.curGroupIndex)
        let option = {
          baseOption: {
            color: ["#f31d65", "#ffd035", "#72a1f3", "#57e78f"],
            timeline: {
              axisType: 'category',
              autoPlay: true,
              playInterval: 10*1000,
              data: self.daysRangeList,
              padding: [10,0,5,0],
              symbolSize: 5,
              label:{
                position: 5,
                color: self.echartColor,
                fontSize: 12,
              },
              lineStyle:{
                color: self.echartColor,
              },
              controlStyle:{
                color: self.echartColor,
                borderColor: self.echartColor,
                itemSize: 12,
              },
              checkpointStyle:{
                color: '#f31d65',
                symbolSize: 5
              },
              emphasis:{
                label:{
                  color: '#f31d65',
                },
                itemStyle:{
                  color: '#f31d65',
                },
                checkpointStyle: {
                  color: '#f31d65',
                },
                controlStyle:{
                  color: '#f31d65',
                }
              }
            },
            calculable : false,
            grid: {
              left: '20',
              right: '0',
              top: '10',
              bottom: '57',
              containLabel: true,
            },
            tooltip : {
              trigger: 'axis',
              padding: 5,
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle:{
                align:'left'
              }
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
              textStyle:{
                color: self.echartColor,
              }

            },
            xAxis: [
              {
                'type':'category',
                'axisLabel':{
                  'interval':0
                },
                'data': [],
                padding: 0,
                axisLine: {
                  show: false,
                  lineStyle:{
                    color: '#e3e9f4',
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: '#7D8CAB',
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
                    color: '#7D8CAB',
                  }
                },
                splitLine:{
                  show:true,
                },
              }
            ],
            series: [
              {name: self.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.improve'), type: 'bar',barWidth: 35, barGap: '10'},
              {name: self.$t('overview.pass'), type: 'bar' ,barWidth: 35, barGap: '10'},
              {name: self.$t('overview.excellent'), type: 'bar',barWidth: 35, barGap: '10'},
            ]
          },

          options: []
        };

        let resultData = self.regionInspectListData;
        console.log(resultData)
        if(resultData.length > 0){
          let regions = resultData[0].regions;
          console.log(regions);
          let regionList = [];
          self.regionGroups[self.curGroupIndex].forEach((item, index)=>{
            regionList.push(item.region)
          })
          self.regionList = regionList;
          option.baseOption.xAxis[0].data = self.regionList;
          //遍历立即督导、待改善、合格、优秀
          let dangerJson = {};
          let improvedJson = {};
          let passJson = {};
          let excellentJson = {};
          resultData.forEach((item, index)=>{
            let dateTime = item.ts;
            let region = item.regions;
            let dangerousList = [];
            let improvedList = [];
            let passList = [];
            let excellentList = [];
            region.forEach(_item=>{
              if(self.regionList.indexOf(_item.region) == -1){
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
              let itemExcellentJson = {};
              itemExcellentJson.name = _item.region;
              itemExcellentJson.value = _item.numOfExcellent;
              excellentList.push(itemExcellentJson);
            })
            let tempOption = {};
            let seriesArray = new Array(4);
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

            let seriesExcJson = {};
            seriesExcJson.stack = 'test';
            seriesExcJson.data = excellentList;
            seriesArray[3] = seriesExcJson;
            tempOption.series = seriesArray;
            option.options.push(tempOption)
            self.regionChartEmpty = false;
          })
        }
        else{
          self.dataMap.dataDanger = {0:[]};
          self.dataMap.dataImproved = {0:[]};
          self.dataMap.dataQualified = {0:[]}
          self.dataMap.dataExcellent = {0:[]};
          self.regionChartEmpty = true;
        }
        self.storeOptions = option;
      },
      async showItemRadar(item, index){
        console.log(item);
        let self = this;
        self.curItemId = item.inspectItemId;
        self.curItemName = item.inspectItemName;
        item.isClick = true;
        self.itemsTopFive.forEach((_item,_index)=>{
          if(index!=_index){
            _item.isClick=false;
          }
        })
        let itemsParam = {};
        itemsParam = JSON.parse(JSON.stringify(self.params));
        itemsParam.itemId = self.curItemId;
        console.log(itemsParam)
        let result = await self.getInspectItemsOverRegion(itemsParam);
        console.log(result);

        let options={
          backgroundColor: '#fff',
          tooltip: {
            textStyle:{
              align:'left'
            }
          },
          legend: {
            data: ['inspect radar']
          },
          radar: {
            shape: 'circle',
            center: ['50%', '50%'],
            nameGap: 5,
            name: {
              textStyle: {
                color: '#7d8cad',
                backgroundColor: '#fff',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [],
            splitArea : {
              show : true,
              areaStyle : {
                color: 'rgba(255,0,0,0)', // 图表背景的颜色
              },
            },

          },
          series: {
            name: '巡检项',
            type: 'radar',
            data : [],
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#f31d65',
                  width: 1
                },
                areaStyle:{
                  color:'rgba(243, 29, 101, 0.5)'
                }
              },
            },
          }
        };
        let tempIndicator = [];
        let seriesValue =[];
        if(result.errCode == 0){
          let resultData = result.data;
          resultData.forEach(item=>{
            let obj={};
            obj.name=item.regionName;
            obj.max=item.numOfUnqualified * 2;
            tempIndicator.push(obj);
            seriesValue.push(item.numOfUnqualified);
          })
        }
        let temp=[];
        let obj={value:seriesValue};
        temp.push(obj);
        options.radar.indicator = tempIndicator;
        options.series.data=temp;
        options.radar.splitNumber = 5;
        self.itemsRadarOption = options;
        console.log(self.itemsRadarOption)
      },
      dealDateStr(val){
        let dateRet='';
        let startStr=val.split('~')[0];
        let endStr=val.split('~')[1];
        let start=new Date(startStr).getTime();
        let end=new Date(endStr).getTime();

        let todayFullYear=new Date().getFullYear();
        let todayMonth=(new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1);
        let todayDate=new Date().getDate()<10?'0'+(new Date().getDate()):(new Date().getDate());
        let nowHour=new Date().getHours()<10?'0'+(new Date().getHours()):(new Date().getHours());
        let nowMin=new Date().getMinutes()<10?'0'+(new Date().getMinutes()):(new Date().getMinutes());
        let nowSec=new Date().getSeconds()<10?'0'+(new Date().getSeconds()):(new Date().getSeconds());

        let endFullYear=new Date(endStr).getFullYear();
        let endMonth=new Date(endStr).getMonth()+1<10?('0'+(new Date(endStr).getMonth()+1)):new Date(endStr).getMonth()+1;
        let endDate=new Date(endStr).getDate()<10?'0'+new Date(endStr).getDate():new Date(endStr).getDate();
        if(todayFullYear==endFullYear&&todayMonth==endMonth&&todayDate==endDate){  //截至日期选的是今天
        }
      },
      dateChange(val){
        let self=this;
        console.log(val);
        let start = typeof(val[0])==='object'?val[0].getTime():val[0];
        let end = typeof(val[1])==='object'?val[1].getTime():val[1];
        let daysDiff = self.$moment(end).diff(start, 'days');
        if(daysDiff < 6){  //当前选择的时间范围不到7天
          Message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
            duration:3*1000
          })
          start=end-3600*24*6*1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue=[self.$moment(start).startOf('d').toDate(),new Date().setTime(end)];
        }
        if(daysDiff > 364){  //当前选择的时间范围超过365天
          Message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
            duration:3*1000
          })
          start=end-3600*24*364*1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue=[self.$moment(start).startOf('d').toDate(),new Date().setTime(end)];
        }
        else{
          self.dateValue=[self.$moment(start).startOf('d').toDate(),new Date().setTime(end)];
        }
        daysDiff = self.$moment(end).diff(start, 'days');
        daysDiff <= 30 ? self.timeMode = 1 : self.timeMode = 2;
        console.log(self.timeMode);
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initData();
      },
      initData(){
        let self = this;
        let start = self.params.beginTs;
        let end = self.params.endTs;
        let startDay = self.$moment(start).format('YYYY-MM-DD');
        let endDay = self.$moment(end).format('YYYY-MM-DD');
        let startDayWithoutYear = self.$moment(start).format('MM/DD');
        let endDayWithoutYear = self.$moment(end).format('MM/DD');
        if(self.timeMode == 1 ){
          let beginDay = new Date(util.judgeStart(startDay));
          let weekList =  util.getWeek(beginDay,endDay)
          let arrLength = weekList.length;
          let firstEndTime = weekList[0].split('-')[1];
          let firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
          let lastStartTime = weekList[arrLength -1].split('-')[0];
          let lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
          weekList.splice(0,1,firstWeekStr);
          weekList.splice(arrLength-1,1,lastWeekStr);
          console.log(weekList);
          self.daysRangeList = weekList;

        }
        else if(self.timeMode == 2 ){
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
      compareDanger(a,b){
        if (b.numOfDangerous > a.numOfDangerous){
          return 1
        }
        else if (b.numOfDangerous === a.numOfDangerous){
          return b.numOfImproved - a.numOfImproved
        }
        else {
          return -1;
        }
      },
      findMaxDanger(items){
        let max = 1 ;
        items.map(function(item,index) {
          if (item.numOfDangerous > max){
            max = item.numOfDangerous
          }
          if (item.numOfImproved > max){
            max = item.numOfImproved
          }
        })
        return max ;
      },
      compareExcellent(a,b){
        if (b.numOfExcellent > a.numOfExcellent){
          return 1
        }
        else if (b.numOfExcellent === a.numOfExcellent){
          return b.numOfQualified - a.numOfQualified
        }
        else {
          return -1;
        }
      },
      findMaxExcellent(items){
        let max = 1 ;
        items.map(function(item,index) {
          if (item.numOfExcellent > max){
            max = item.numOfExcellent
          }
          if (item.numOfQualified > max){
            max = item.numOfQualified
          }
        })
        return max ;
      },
      getTopFiveRegionList(){
        let self = this;
        let result = self.regionResultList.concat([]);
        let firstColor = '';
        let secondColor = '';
        let firstName = '';
        let secondName = '';
        let maxValue = 0;
        let items = [];
        if(self.isWorstArea){
          firstColor = '#f31d65';
          secondColor = '#ffd035';
          firstName = self.$t("overview.danger");
          secondName = self.$t("overview.improve");
          try{
            result.sort(self.compareDanger)
            maxValue = self.findMaxDanger(result);
          }
          catch (e) {
            result = [];
          }
        }
        else{
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

        let topFiveArray = result.slice(0,5);
        console.log(topFiveArray);
        let fiveArray = [];
        topFiveArray.forEach(item=>{
          let json = {}
          json.region = item.region;
          if(self.isWorstArea){
            let tempFirstDouble = (item.numOfDangerous/maxValue)*100;
            let tempSecondDouble = (item.numOfImproved/maxValue) * 100;
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
          else{
            let tempFirstDouble = (item.numOfExcellent/maxValue)*100;
            let tempSecondDouble = (item.numOfQualified/maxValue) * 100;
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
      async getStoreNumAndCycle(){
        let self = this;
        let storeNumAndCycle = await self.getInspectStatsOverview(self.params);
        console.log(storeNumAndCycle)
        if(storeNumAndCycle.errCode == 0){
          let result = storeNumAndCycle.data;
          if(result){
            self.totalStoreNum = result.numOfStores;
            self.numOfInspects = result.numOfInspects;
            self.cycleOfInspect = result.cycleOfInspect== -1 ? 'N/A': result.cycleOfInspect;
          }
        }
        else{
          self.notify(self.$t('overview.queryFail'),'warning',3000);
          self.totalStoreNum = 0;
          self.numOfInspects = 0;
          self.cycleOfInspect = 0;
        }
      },
      getInspectStatsOverview(params){
        return new Promise((resolve,reject)=>{
          getInspectStatsOverview(params).then(res=>{
            resolve(res);
          })
        })
      },
      toPercent(point){
        let tempPoint = Number(point*100);
        let str = '';
        util.isDot(tempPoint) ? str = tempPoint.toFixed(2) : str = tempPoint;
        str += "%";
        return str;
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },
      async getBestAndWorstStores(){
        let self = this;
        let bestAndWorstStoreRes = await self.getInspectStatsOverStore(self.params)
        console.log(bestAndWorstStoreRes)
        let errCode = bestAndWorstStoreRes.errCode;
        if(errCode === 0){
          let resData = bestAndWorstStoreRes.data;
          let bestStore = resData.bestStore;
          let worstStore = resData.worstStore;
          let storesArray = [];
          if(bestStore != null){
            let bestJson = {};
            bestJson.storeSort = self.$t("overview.starStore");
            bestJson.storeName = bestStore.storeName;
            bestJson.iconSrc = self.bestStoreIcon;
            bestJson.qualifiedRate = self.$t("overview.passRate")+ bestStore.qualifiedRate + '%';
            storesArray.push(bestJson)
          }
          else{
            let bestJson = {};
            bestJson.storeSort = self.$t("overview.starStore");
            bestJson.storeName = '';
            bestJson.iconSrc = self.bestStoreIcon;
            storesArray.push(bestJson)
          }
          if(worstStore != null){
            let worstJson = {};
            worstJson.storeSort=self.$t("overview.backwordStroe");
            worstJson.storeName = worstStore.storeName;
            worstJson.iconSrc = self.worstStoreIcon;
            worstJson.qualifiedRate = self.$t("overview.passRate") +  worstStore.qualifiedRate + '%';
            storesArray.push(worstJson)
          }
          else{
            let worstJson = {};
            worstJson.storeName = '';
            worstJson.storeSort=self.$t("overview.backwordStroe");
            worstJson.iconSrc = self.worstStoreIcon;
            storesArray.push(worstJson)
          }
          self.bestAndWorstStore = storesArray
        }
        else{
          self.notify(self.$t('overview.queryFail'),'warning',3000);
        }
      },
      getInspectStatsOverStore(params){
        return new Promise((resolve,reject)=>{
          getInspectStatsOverStore(params).then(res=>{
            resolve(res);
          })
        })
      },
      async getInspectItems(){
        let self = this;
        let inspectItems = await self.getInspectStatsItemInfo(self.params);
        console.log(inspectItems);
        let excellentPer = 0;
        let qualifiedPer = 0;
        let unqualifiedPer = 0;
        let ignorePer = 0;
        let errCode = inspectItems.errCode;
        let jsonArray = self.itemsLegend;
        let seriesData = [];
        if(errCode == 0){
          let totalIgnored =0;
          let totalUnqualified = 0;
          let totalQualified = 0;
          let totalExcellent = 0;
          let resultData = inspectItems.data;
          // sort by num Of Unqualified

            console.log(resultData)
          try{
            resultData.forEach(item=>{
              totalIgnored += item.numOfIgnored;
              totalUnqualified += item.numOfUnqualified;
              totalQualified += item.numOfQualified;
              totalExcellent += item.numOfExcellent;
            })
            resultData.sort((item1, item2)=>{
              return item1.numOfUnqualified < item2.numOfUnqualified ? 1: -1;
            })
            console.log(resultData);
            let topFiveArray = resultData.slice(0,5);
            console.log(topFiveArray);
            let firstItem = topFiveArray[0];
            self.curItemId = firstItem.inspectItemId;
            self.curItemName = firstItem.inspectItemName;
            topFiveArray.forEach(item=>{
              let percent = item.numOfUnqualified/firstItem.numOfUnqualified;
              item.percent = parseInt((percent*100).toFixed(0));
            })
            seriesData = [
              { value: totalExcellent, name: self.$t('overview.excellent') },
              { value: totalQualified, name: self.$t('overview.pass') },
              { value: totalUnqualified, name: self.$t('overview.failed') },
              { value: totalIgnored, name: self.$t('overview.ignored') }
            ];
            console.log(topFiveArray);
            self.itemsTopFive = topFiveArray;
            self.showItemRadar(firstItem, 0);
          }
          catch (e) {
            self.itemsTopFive = [];
            seriesData = [];
          }
          let totalArray = [totalExcellent, totalQualified, totalUnqualified, totalIgnored];
          console.log(totalArray);
          // let totalItems = totalIgnored + totalUnqualified + totalQualified + totalExcellent;
          // if(totalItems != 0){
          //   ignorePer = self.toPercent(totalIgnored/totalItems);
          //   unqualifiedPer = self.toPercent(totalUnqualified/totalItems);
          //   qualifiedPer = self.toPercent(totalQualified/totalItems);
          //   excellentPer = self.toPercent(totalExcellent/totalItems);
          // }
          jsonArray[0].percent = util.getPercentValue(totalArray,0,2);
          jsonArray[1].percent = util.getPercentValue(totalArray,1,2);
          jsonArray[2].percent = util.getPercentValue(totalArray,2,2);
          jsonArray[3].percent = util.getPercentValue(totalArray,3,2);
          self.itemsOptions = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
              textStyle:{
                align:'left'
              }
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
                  normal:{
                    color:function(params) {
                      //自定义颜色
                      var colorList = ['#57e78f', '#72a1f3', '#ffd035', '#cad1db'];
                      return colorList[params.dataIndex]
                    }
                  }
                }
              }
            ]
          }

        }
        self.itemsPerArray = jsonArray;
        console.log(self.itemsPerArray)
      },
      getInspectStatsItemInfo(params){
        return new Promise((resolve,reject)=>{
          getInspectStatsItemOverview(params).then(res=>{
            resolve(res);
          })
        })
      },
      getInspectItemsOverRegion(params){
        return new Promise((resolve,reject)=>{
          getInspectStatsItemOverviewRegion(params).then(res=>{
            resolve(res);
          })
        })
      },
      async getInspectTaskRanking(){
        let self = this;
        let params = {};
        params = JSON.parse(JSON.stringify(self.params));
        params.lowestFirst = self.isWorstWork;
        params.numOfPerson = 5;
        let result = await self.getInspectStatsOverPerson(params);
        console.log(result)
        let tempTaskList = [];
        if(result.errCode == 0){
          let resultData = result.data;
          resultData.forEach(item=>{
            let json = {};
            json.supervisorName = item.supervisorName;
            let  completionRate = item.completionRate;
            util.isDot(completionRate) ? completionRate= completionRate.toFixed(2): completionRate = completionRate
            json.completionRate = completionRate;
            let perStr = item.completionRate.toFixed(0);
            json.percent = parseInt(perStr);
            tempTaskList.push(json)
          })
        }
        self.taskList = tempTaskList;
      },
      getInspectStatsOverPerson(params){
        console.log(params);
        return new Promise((resolve,reject)=>{
          GetInspectStatsOverPerson(params).then(res=>{
            resolve(res);
          })
        })
      },
      async getPassRateAndCycle(){
        let self = this;
        let result = await self.getPassRateAndInspectRate(self.params);
        console.log(result);
        self.regionResultList = result.data;
        let schema = [
          {name: 'inspectCycle', index: 0, text: self.$t('overview.cycle')},
          {name: 'passRate', index: 1, text: self.$t('overview.passRate')},
          {name: 'excellentRate', index: 2, text: self.$t('overview.excellentRate')},
          {name: 'dangerRate', index: 3, text: self.$t('overview.dangerRate')},
          {name: 'region', index: 5, text: self.$t('overview.region')},
        ];
        let itemPassStyle = {
          normal: {
            opacity: 0.8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderColor:'#57e78f' ,
          }
        };
        let itemDangerStyle = {
          normal: {
            opacity: 0.8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderColor:'#f31d65' ,
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
        let options ={
          backgroundColor: '#fff',
          legend:{
            x: 'center',
            y: 'bottom',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            fontSize: 12,
            padding: 0,
            textStyle:{
              color: self.echartColor,
              fontSize: 12,
            },
            data:[
              {name:self.$t("overview.dangerousMore"), icon:'rect'},
              {name:self.$t("overview.DangerousLess"), icon:'rect'},
              {name:self.$t("overview.excellentLess"), icon:'rect'},
              {name:self.$t("overview.excellentMore"), icon:'rect'}]
          },
          color: [
            'rgba(243,29,101,1)', 'rgba(243,29,101,0.5)', 'rgba(87,231,143, 1)', 'rgba(87,231,143,0.5)'
          ],
          grid: {
            containLabel: true,
            top:'10',//距上边距
            left:'8',//距离左边距
            right:'0',//距离右边距
            bottom:'30',//距离下边距
          },
          tooltip: {
            padding: 10,
            textStyle:{
              align:'left',
              fontSize: 12
            },
            formatter: function (obj) {
              var value = obj.value;
              console.log(value);
              if(value[0] == undefined){
                return ;
              }
              return schema[4].text + ': ' + value[4] + '<br>'
                + schema[0].text + '：' + value[1] + self.$t("overview.day") + '<br>'
                + schema[1].text + '：' + value[0] + '%<br>'
                + schema[2].text + '：' + value[2] + '%<br>'
                + schema[3].text + '：' + value[3] + '%<br>';
            }
          },
          xAxis: {
            type: 'value',
            nameGap: 10,
            padding: [10,0,0,0],
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
              lineStyle:{
                type: 'dashed'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#7D8CAB'
              }
            },
            axisLabel:{
              fontStyle: 12,
              formatter: function(value, index){
                if(value==0){
                  return ''
                }
                else{
                  return value+"%"
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
                color: '#7D8CAB'
              }
            },
            splitLine: {
              show: false,
              lineStyle:{
                type: 'dashed'
              }
            },
            axisTick:{
              show: false
            },
            axisLabel:{
              fontSize: 12,
              width: 10
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
        let passRateMoreArray=[];
        let passRateLessArray = [];
        if(result.errCode == 0){
          let resultData = result.data;
          console.log(resultData)
          if(resultData.length >0){
            resultData.forEach(item=>{
              let inspectNum = item.numOfReport;
              let inspectCycle = item.cycleOfInspect;
              let qualifiedRate = item.qualifiedRate;
              let excellentRate = item.excellentRate;
              let dangerRate = ((item.numOfDangerous/inspectNum) * 100).toFixed(2);
              let floatRage = parseInt(dangerRate);
              let region = item.region;
              let tempArray = [];
              if(inspectCycle > 0){
                tempArray.push(qualifiedRate)
                tempArray.push(inspectCycle)
                tempArray.push(excellentRate)
                tempArray.push(parseFloat(dangerRate))
                tempArray.push(region)
                console.log(tempArray);
                if(qualifiedRate> 50){
                  excellentRate >= 60 ? passRateMoreArray.push(tempArray): passRateLessArray.push(tempArray)
                }
                else{
                  floatRage >= 60 ? dangerRateMoreArray.push(tempArray): dangerRateLessArray.push(tempArray)
                }
              }
              else{

              }
            })
            options.series[0].data = dangerRateMoreArray;
            options.series[1].data = dangerRateLessArray;
            options.series[2].data = passRateMoreArray;
            options.series[3].data = passRateLessArray;
          }
          else{
            options.series[4].data = [[0,31]];
          }
        }
        else{
          options.series[4].data = [[0,31]];
        }
        self.cycleOption = options;
        self.getTopFiveRegionList();
      },
      getPassRateAndInspectRate(params){
        return new Promise((resolve, reject)=>{
          getInspectStatsOverviewWithRegion(params).then(res=>{
            resolve(res)
          })
        })
      },
      async getRegionInspectResult(){
        let self = this;
        self.dataMap = {};
        self.regionInspectListData = [];
        let option = {
          baseOption: {
            color: ["#f31d65", "#ffd035", "#72a1f3", "#57e78f"],
            timeline: {
              axisType: 'category',
              autoPlay: true,
              playInterval: 10*1000,
              data: self.daysRangeList,
              padding: [10,0,5,0],
              symbolSize: 5,
              left: 30,
              right: 20,
              label:{
                position: 5,
                color: self.echartColor,
                fontSize: 12,
              },
              lineStyle:{
                color: self.echartColor,
              },
              controlStyle:{
                color: self.echartColor,
                borderColor: self.echartColor,
                itemSize: 12,
              },
              checkpointStyle:{
                color: '#f31d65',
                symbolSize: 5
              },
              emphasis:{
                label:{
                  color: '#f31d65',
                },
                itemStyle:{
                  color: '#f31d65',
                },
                checkpointStyle: {
                  color: '#f31d65',
                },
                controlStyle:{
                  color: '#f31d65',
                }
              }
            },
            calculable : false,
            grid: {
              left: '20',
              right: '0',
              top: '10',
              bottom: '57',
              containLabel: true,
            },
            tooltip : {
              trigger: 'axis',
              padding: 5,
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
              },
              textStyle:{
                align:'left'
              }
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
              textStyle:{
                color: self.echartColor,
              }

            },
            xAxis: [
              {
                'type':'category',
                'axisLabel':{
                  'interval':0
                },
                'data': [],
                padding: 0,
                axisLine: {
                  show: false,
                  lineStyle:{
                    color: '#e3e9f4',
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    color: '#7D8CAB',
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
                    color: '#7D8CAB',
                  }
                },
                splitLine:{
                  show:true,
                },
              }
            ],
            series: [
              {name: self.$t('overview.danger'), type: 'bar', barWidth: 35, barGap: '10'},
              {name: self.$t('overview.improve'), type: 'bar',barWidth: 35, barGap: '10'},
              {name: self.$t('overview.pass'), type: 'bar' ,barWidth: 35, barGap: '10'},
              {name: self.$t('overview.excellent'), type: 'bar',barWidth: 35, barGap: '10'},
            ]
          },

          options: []
        };
        let params = {};
        params = JSON.parse(JSON.stringify(self.params));
        params.region = 1;
        params.timeMode = self.timeMode;
        let result = await self.getInspectResultOverRegion(params);
        if(result.errCode == 0){
          let resultData = result.data;
          self.regionInspectListData = resultData;
          console.log(resultData);
          if(resultData.length > 0){
            resultData.forEach(item=>{
              let regions = item.regions;
              regions.sort((item1, item2)=>{
                return item1.region < item2.region ? 1 : -1;
              })
            })
            console.log(resultData);
            let regions = resultData[0].regions;
            console.log(regions);
            let length = regions.length;
            let groupSize = Math.ceil(length/self.showRegionNum);
            self.totalGroupNum = groupSize;
            self.totalGroupNum > 1 ? self.showNextGroup= true : self.showNextGroup = false;
            let tempRegions =  util.groupArrayOnSize(regions, self.showRegionNum);
            self.regionGroups = tempRegions;
            console.log(tempRegions);
            let regionList = [];
            tempRegions[0].forEach((item, index)=>{
              regionList.push(item.region)
            })
            self.regionList = regionList;
            option.baseOption.xAxis[0].data = self.regionList;
            //遍历立即督导、待改善、合格、优秀
            let dangerJson = {};
            let improvedJson = {};
            let passJson = {};
            let excellentJson = {};
            resultData.forEach((item, index)=>{
              let dateTime = item.ts;
              let region = item.regions;
              let dangerousList = [];
              let improvedList = [];
              let passList = [];
              let excellentList = [];
              region.forEach(_item=>{
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
                let itemExcellentJson = {};
                itemExcellentJson.name = _item.region;
                itemExcellentJson.value = _item.numOfExcellent;
                excellentList.push(itemExcellentJson);
              })
              let tempOption = {};
              let seriesArray = new Array(4);
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

              let seriesExcJson = {};
              seriesExcJson.stack = 'test';
              seriesExcJson.data = excellentList;
              seriesArray[3] = seriesExcJson;
              tempOption.series = seriesArray;
              option.options.push(tempOption)
              self.regionChartEmpty = false;
            })
          }
          else{
            self.dataMap.dataDanger = {0:[]};
            self.dataMap.dataImproved = {0:[]};
            self.dataMap.dataQualified = {0:[]}
            self.dataMap.dataExcellent = {0:[]};
            self.regionChartEmpty = true;
          }
        }
        else{
          self.dataMap.dataDanger = {0:[]};
          self.dataMap.dataImproved = {0:[]};
          self.dataMap.dataQualified = {0:[]}
          self.dataMap.dataExcellent = {0:[]}
          self.regionChartEmpty = true;
        }
        self.storeOptions = option;
      },
      getInspectResultOverRegion(params){
        return new Promise((resolve, reject)=>{
          getInspectStatsOverRegion(params).then(res=>{
            resolve(res)
          })
        })
      },
      adjustChart(){
        let self = this;
        console.log('尺寸改变');
        setTimeout(() => {
          self.$refs.storeChart.resize()
          self.$refs.itemsPie.resize()
          self.$refs.itemsRadar.resize()
          self.$refs.cycleChart.resize();
        }, 20)
      }
    },
    created(){
      let self = this;
      let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
      let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
      self.params.beginTs = start;
      self.params.endTs = end;
      let enSpan = this.lang=='en' && (this.varWindowWidth< 1440 );
      console.log(enSpan)
      self.isEnSpan = enSpan;
      self.initData();
    },
    mounted(){
      let self=this;
      window.addEventListener("resize", self.adjustChart, false);
    },
    beforeDestroy(){
      let self = this;
      window.removeEventListener('resize', self.adjustChart);
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/textstyle.css';
  @import '../../assets/css/importfile.css';
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
  *{
    font-family: Arial,  "Microsoft YaHei";
    box-sizing: border-box;
  }
  .el-overview-content {
    width: 100%;
    position: relative;
    font-size: calc(14/1920*100vw);
    height: auto;
    /*background-color: #f6f9fe;*/
    padding-bottom: calc(20/1920*100vw);
    .sourceType-icon {
      margin-right: calc(15/1920*100vw);
      position: relative;
      float: left;
      @include point(bottom, 3);
    }
    .icon-span {
      display: inline-block;
      width: calc(60/1920*100vw);
      height: calc(22/1920*100vw);
      color: white;
      font-size: calc(12/1920*100vw);
    }
    .el-date {
      height: 80px;
      line-height: 80px;
      text-align: left;
      margin-bottom: calc(30/1920*100vw);
      border-bottom: 1px solid $border;
      position: relative;
      background: #fff;
      .date-title {
        @include point(margin-left, 30);
        @include point(margin-right, 20);
        margin-left: calc(60 / 1920 * 100vw);
        margin-right: calc(40 / 1920 * 100vw);
        font-size: 14px;
        color: $black;
      }
      .iconbangzhu {
        font-size: 20px;
        position: relative;
        top: 2px;
        color: $tab;
      }
      .date-range {
        border: 1px solid #ccc;
        width: 200px;
        height: calc(35 / 1920 * 100vw);
        /*.el-range-separator{*/
          /*height: calc(35 / 1920 * 100vw);*/
          /*line-height: calc(35 / 1920 * 100vw);*/
        /*}*/
      }
      .item {
        color: $tab;
        margin-left: calc(20 / 1920 * 100vw);
        margin-right: calc(8 / 1920 * 100vw);
      }
      .content {
        display: inline-block;
        font-size: calc(12 / 1920 * 100vw);
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
      .zone-row{
        height: calc(400/1920*100vw);
        border: 1px solid $border;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .title{
          height: calc(70/1920*100vw);
          padding-top: calc(30/1920*100vw);
          margin-left: calc(30/1920*100vw);
          font-size: calc(20/1920*100vw);
          text-align: left;
        }
        .kpi-list{
          height: 100%;
          .kpi-content{
            height: calc(330/1920*100vw);
            border-top: 1px solid $border;
            border-right: 1px solid $border;
            display: flex;
            flex-direction: column;
            .total-store{
              height: 50%;
              border-bottom: 1px solid $border;
              padding-top: calc(40/1920*100vw);
              :last-child{
                border-bottom: none;
              }
              padding-left: calc(34/1920*100vw);
              .total-title{
                font-size: calc(16/1920*100vw);
                color: $tab;
                text-align: left;
              }
              .total-num{
                font-size: calc(30/1920*100vw);;
                color: $h1;
                text-align: left;
                margin-top: calc(20/1920*100vw);
                .day{
                  padding-left: calc(10/1920*100vw);
                }
              }
            }
          }
        }
        .store-list{
          height: calc(400/1920*100vw);
          .region-result{
            border-top: 1px solid $border;
            border-right: 1px solid $border;
            height:calc(330/1920*100vw);
            padding: calc(25/1920*100vw) calc(45/1920*100vw) 0 calc(30/1920*100vw);
            .region-content{
              height:calc(270/1920*100vw);
              .region-result-panel{
                height:calc(290/1920*100vw);
                position: relative;
                .result-content{
                  height: 100%;
                  width: 100%;
                }
                .empty-text{
                  position: absolute;
                  top: calc(90/1920*100vw);
                  left: 50%;
                  font-size: calc(14/1920*100vw);
                  color: $tab;
                }
                .icon-arrow{
                  cursor: pointer;
                  border: 1px solid $tab;
                  border-radius: 50%;
                }
                .el-icon-arrow-right{
                  position: absolute;
                  top: calc(90/1920*100vw);
                  right: 0;
                }
                .el-icon-arrow-left{
                  position: absolute;
                  top: calc(90/1920*100vw);
                  left: calc(20/1920*100vw);
                }
              }

            }
          }

        }
        .focus-list{
          .focus-content {
            height: calc(330 / 1920 * 100vw);
            border-top: 1px solid $border;
            padding:calc(25 / 1920 * 100vw) calc(30 / 1920 * 100vw);
            position: relative;

            .chart-content{
              height: 100%;
              width: 100%;
            }
            .item-chart{
              height: 20%;
              display: flex;
              align-items:center;
              .item-ranking{
                font-size: calc(18/1920*100vw);
                text-align: left;
                font-family: Arial MT;
              }
              .item-ranking-0{
                color: $red;
              }
              .item-ranking-1{
                color: #fd8a51;
              }
              .item-ranking-2{
                color: $failed;
              }
              .item-ranking-3{
                color: $pass;
              }
              .item-ranking-4{
                color: $tab;
              }
              .item-titles{
                margin: 0 calc(20/1920*100vw);
                flex-grow:1;
                text-align: left;
                font-size: calc(14/1920*100vw);
                margin-left: 0;
                overflow: hidden;
                .item-title{
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .item-process{
                  margin-bottom: calc(1/1920*100vw);
                }
              }
              .region-name{
                font-size: calc(14/1920*100vw);
                margin: 0 calc(30/1920*100vw) 0 calc(20/1920*100vw);
                width: calc(55/1920*100vw);
                text-align: left;
              }
              .ranking-num{
                font-size: calc(14/1920*100vw);
                text-align: left;
                white-space: nowrap;
              }
            }

          }
          .area-title{
            font-size: calc(20/1920*100vw);
            display: inline-block;
            /*margin-right: calc(10/1920*100vw);*/
          }
          .empty-content{
            font-size: calc(14/1920*100vw);
            color: $tab;
            padding-top: calc(140/1920*100vw);
            border-top: 1px solid $border;
          }
        }
      }
      .arrows{
        // width: calc(20/1920*100vw);
        display: inline-block;
        color: $tab;
        .iconfont{
          font-size: calc(20/1920*100vw) !important;
          cursor: pointer;
        }
        .active-arrow{
          color: $red;
          font-size: calc(20/1920*100vw);
        }
      }
      .task-row{
        height: calc(340/1920*100vw);
        margin-top: calc(30/1920*100vw);
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background-color: #fff;
        .titles{
          height: calc(70/1920*100vw);
          text-align: left;
          border-bottom: 1px solid $border;
          .title{
            height: 100%;
            padding-top: calc(30/1920*100vw);
            margin-left: calc(30/1920*100vw);
            font-size: calc(20/1920*100vw);
            display: inline-block;
          }
          .arrows{
            font-size: calc(20/1920*100vw);
          }
          .active-arrow{
            color: $red;
          }
          .five-title{
            font-size: calc(16/1920*100vw);
            /*margin-left: calc(20/1920*100vw);*/
            color: $tab;
          }
        }
        .task-board{
          padding: calc(45 / 1920 * 100vw) calc(90 / 1920 * 100vw);
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          .task-item{
            height: 100%;
            .task-panel{
              width: calc(150/1920*100vw);
              height: calc(126/1920*100vw);
              position: relative;
              .process-panel{
                width: 100%;
                height: 100%;
                margin: 0 auto;
                .el-progress-circle{
                  width: calc(150/1920*100vw) !important;
                  height: calc(150/1920*100vw) !important;
                  margin: 0 auto;
                  @media screen and (max-width:1280px){
                    width: 126px ;
                    height: 126px;
                    margin: 0 auto;
                  }
                }
              }
              .percent-num{
                position: absolute;
                left: 50%;
                top: calc(75/1920*100vw);
                transform: translate(-50%, -50%);
                width:calc(100/1920*100vw);
                .num{
                  font-size: calc(30/1920*100vw);
                  color: #292e36;
                }
                .percent{
                  font-size: calc(16/1920*100vw);
                }
              }
            }
            .task-supervisor-name{
              font-size: 16px;
              color: $tab;
              text-align: center;
              margin-top: calc(30/1920*100vw);
            }
          }
        }
        .space-task{
          justify-content: space-around;
        }
        .task-empty{
          height: calc(270/1920* 100vw);
          line-height: calc(270/1920* 100vw);
        }
      }
      .items-row{
        height: calc(400/1920*100vw);
        margin-top: calc(30/1920*100vw);
        .title{
          height: calc(70/1920*100vw);
          width: 100%;
          padding-top: calc(30/1920*100vw);
          padding-left: calc(30/1920*100vw);
          font-size: calc(20/1920*100vw);
          text-align: left;

        }
        .evalution-pct{
          border: 1px solid $border;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          height: calc(400/1920*100vw);
          .pct-content{
            padding-top: calc(25/1920*100vw);
            padding-bottom: calc(25/1920*100vw);
            border-top: 1px solid $border;
            width: 100%;
            text-align: center;
            .pct-panel{
              height: calc(210/1920*100vw);
              width: calc(210/1920*100vw);
              margin: 0 auto;
              border-radius: 50%;
              background: -webkit-radial-gradient( circle closest-side,#fff 60%, $background 40%);
              .chart-content{
                width: 100%;
                height: 100%;
              }
            }
            .pct-nums{
              margin-top: calc(30/1920*100vw);
              /*padding: 0 calc(20/1920*100vw);*/
              font-size: calc(12/1920*100vw);
              display: flex;
              justify-content: center;
              @media screen and (max-width: 1280px){
                padding: 0 0;
              }
              .content-labels{
                padding: 0 calc(10/1920*100vw);
                font-size: calc(12/1920*100vw);
                text-align: left;
                .excellent_nums{
                  margin-left: calc(20/1920*100vw);
                  margin-bottom:calc(10/1920*100vw);
                  font-size: calc(14/1920*100vw);
                  line-height: calc(14/1920*100vw);
                }
                .excellent_labels{
                  line-height: 12px;
                  font-size: 0;
                  .labels{
                    height: 10px;
                    width: 10px;
                    display: inline-block;
                    margin-right: calc(10/1920*100vw);
                  }
                  .label-desc{
                    color: $tab;
                    font-size: 12px;
                  }
                  .label-0{
                    background-color: $excellent;
                  }
                  .label-1{
                    background-color: $pass;
                  }
                  .label-2{
                    background-color: $failed;
                  }
                  .label-3{
                    background-color: $ignored;
                  }
                }
              }
              .en-labels{
                @media screen and (max-width: 1280px){
                  padding: 0 calc(5/1920*100vw);
                }
              }
            }
          }
        }
        .focus-items{
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid $border;
          margin-left: calc(20/1920*100vw);
          height: calc(400/1920*100vw);
          background-color: #fff;
          .title{
            border-bottom: 1px solid $border;
          }
          .items-panel{
            height: calc(298/1920*100vw);
            margin: calc(15/1920*100vw);
            border: 1px solid $border;
            .top-five-items{
              height: 100%;
              position: relative;
              .items-list{
                height: 100%;
                background: $background;
                .item-chart{
                  height: 20%;
                  display: flex;
                  align-items:center;
                  cursor: pointer;
                  border-bottom: 1px solid $border;
                  &:last-child{
                    border-bottom: none;
                  }
                  .item-ranking{
                    font-size: calc(18/1920*100vw);
                    text-align: left;
                    font-family: Arial Rounded MT Bold;
                    padding: 0 calc(20/1920*100vw);
                  }
                  .item-ranking-0{
                    color: $red;
                  }
                  .item-ranking-1{
                    color: #fd8a51;
                  }
                  .item-ranking-2{
                    color: $failed;
                  }
                  .item-ranking-3{
                    color: $pass;
                  }
                  .item-ranking-4{
                    color: $tab;
                  }
                  .item-titles{
                    text-align: left;
                    font-size: calc(14/1920*100vw);
                    width: calc(300/1920*100vw);
                    .item-title{
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    }
                  }
                  .item-progress{
                    flex-grow: 1;
                    margin: 0 calc(20/1920*100vw);
                  }
                  .ranking-num{
                    font-size: calc(14/1920*100vw);
                    margin-right: calc(45/1920*100vw);
                    /*position: relative;*/
                    /*top: calc(8/1920*100vw);*/
                    text-align: left;
                  }
                }
                .active-color{
                  background: #fff;
                }
              }

              .top-five-empty{
                top: 50%;
                left: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                color: $tab;
                .empty-text{
                  display: inline-block;
                  vertical-align: top;
                  margin-left:calc(20/1920*100vw);
                  color: $tab;
                  font-size: calc(14/1920*100vw);
                }
              }
            }
            .item-radar{
              height: 100%;
              padding-left: calc(15/1920*100vw);
              padding-top: calc(15/1920*100vw);
              position: relative;

              .rader-panel{
                width: 100%;
                height: 100%;
                .radar-title{
                  text-align: left;
                  font-size: calc(14/1920*100vw);
                  color: $tab;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .radar-content{
                  width: 100%;
                  height: calc(100% - 25/1920*100vw);
                }
              }
              .radar-empty{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: calc(14/1920*100vw);
                color: $tab;
              }
            }

          }
        }
      }
      .star-row{
        height: calc(400/1920*100vw);;
        margin-top: calc(30/1920*100vw);
        @media screen and (min-width:1280px) and(max-width:1440px){
          height: calc(420/1920*100vw);
        }
        .stores-list{
          display: flex;
          border: 1px solid $border;
          flex-direction: column;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          height: calc(400/1920*100vw);
          .title{
            font-size: calc(20/1920*100vw);
            padding-top: calc(30/1920*100vw);
            color: $black;
          }
          .best-store{
            position: relative;
            text-align: left;
            border-bottom: 1px solid $border;
            padding-left: calc(30/1920*100vw);
            height: 50%;
            :last-child{
              border-bottom: none;
            }
            .empty-store{
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              font-size: calc(14/1920*100vw);
              color: $tab;
            }
          }
          .best-icon{
            position: absolute;
            top: 0;
            right: 0;
            height: calc(100/1920*100vw);
            width: calc(100/1920*100vw);
            .store-icon{
              width: 100%;
              height: 100%;
            }
          }
          .store-name{
            font-size: calc(30/1920*100vw);
            margin-top: calc(20/1920*100vw);
            color: #292e36;
          }
          .pass-pct{
            font-size: calc(16/1920*100vw);
            margin-top: calc(20/1920*100vw);
            color: $tab;
            margin-bottom: calc(45/1920*100vw);

          }
        }
        .inspect-cycle{
          background-color: #fff;
          margin-left: calc(20/1920*100vw);
          border: 1px solid $border;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          .cycle-title{
            height: calc(70/1920*100vw);
            padding-top: calc(30/1920*100vw);
            padding-left: calc(30/1920*100vw);
            font-size: calc(20/1920*100vw);
            text-align: left;
            border-bottom: 1px solid $border;
          }
          .cycle-panel{
            height: calc(325/1920*100vw);
            padding: calc(30/1920*100vw) calc(50/1920*100vw) 0 calc(20/1920*100vw);
            position: relative;
            .panel-bubble{
              height: calc(270/1920*100vw);
              position: relative;
              .radar-content{
                height: 100%;
                width: 100%;
              }
            }
            .cycle-label{
              font-size: calc(12/1920*100vw);
              margin-bottom: calc(15/1920*100vw);
              display: flex;
              justify-content: center;
              position: relative;
              .cycle-labels{
                margin-right: calc(30/1920*100vw);
                line-height: calc(12/1920*100vw);
                margin-top: calc(20/1920*100vw);
                font-size: calc(12/1920*100vw);
                color: $tab;
                &:last-child{
                  margin-right: 0;
                }
                .label-rect{
                  height: calc(10/1920*100vw);
                  width: calc(10/1920*100vw);
                  margin-right: calc(10/1920*100vw);
                  display: inline-block;
                }
                .label-0{
                  background: $red;
                }
                .label-1{
                  background: $red;
                  opacity: 0.5 ;
                }
                .label-2{
                  background: $excellent;
                }
                .label-3{
                  background: $excellent;
                  opacity: 0.5 ;
                }
              }
            }
            .cycle-axis{
              position: absolute;
              top: calc(30/1920*100vw);
              left: calc(65/1920*100vw);
              font-size: calc(12/1920*100vw);
              color: $tab;
              @media screen and (max-width:1280px){
                left: calc(75/1920*100vw);
              }
            }
            .pass-rate-axis{
              position: absolute;
              bottom: calc(85/1920*100vw);
              right: calc(50/1920*100vw);
              font-size: calc(12/1920*100vw);
              color: $tab;
              @media screen and (max-width:1280px){
                bottom: calc(105/1920*100vw);
              }
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

  .date-picker-poper .el-button--text{
    visibility: hidden !important;
  }
  .el-input__inner .el-input__inner{
    border: 1px solid #dddddd;
  }
  .process-panel .el-progress-circle{
    width: 150px !important;
    height: 150px  !important;
  }

  .el-tooltip-class.el-tooltip__popper[x-placement^='bottom'] .popper__arrow {
    border-bottom-color: rgba(50,50,50,0.7);
  }
  .el-tooltip-class.el-tooltip__popper[x-placement^='bottom'] .popper__arrow:after {
    border-bottom-color: rgba(50,50,50,0.7);
  }

  .el-tooltip-class{
    background: rgba(50,50,50,0.7) !important;
  }
  @media screen and (max-width:1680px){
    .process-panel .el-progress-circle{
      width: 130px !important;
      height: 130px !important;
    }
  }
  @media screen and (max-width:1280px){
    .process-panel .el-progress-circle{
      width: 100px !important;
      height: 100px !important;
    }
  }
  .item-process .el-progress-bar .el-progress-bar__outer{
    background-color: #fff;
  }
  .inactive-item-process .el-progress-bar .el-progress-bar__outer{
    background-color: #f4f5f9;
  }
  .region-process .el-progress-bar .el-progress-bar__outer{
    background-color: #f4f5f9;
  }
  .el-tooltip__popper.is-dark{
    background-color: rgb(78, 81, 95);
  }
  .el-range-editor--mini .el-range-separator{
    height: calc(35/1920*100vw);
    line-height: calc(35/1920*100vw);
  }
  .tooltip-class{
    font-size: calc(12/1920*100vw);
  }
</style>
