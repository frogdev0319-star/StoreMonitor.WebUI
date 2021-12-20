<template>
  <div>
    <div class="el-overview-content">
      <el-col :span="24">
        <search-component
          ref="eventSearch"
          :default-sort="defaultSort"
          isInspectItem="true"
          path="eventStatistics"
          @emitSearch = "emitSearch"
          @exportPdf = "exportPdf"
          @changeDefaultSort="setDefaultSortAndPage"/>
      </el-col>
      <el-col :span="24" class="el-overview">
        <el-row class="amout_row">
          <el-col :span="24" class="kpi-list">
            <div class="title">{{ $t('statistics.event.eventProcessStatus') }}</div>
          </el-col>
          <el-col :span="24" class="amount_region">
            <div class="region-area"  v-for="(item,index) in eventKPIs" :key="index">
              <div class="num-area">
                <div style="display:flex;height:84.5px;">
                  <div class="number">{{ item.eventNum }}
                    <span v-if="index!=3" style="font-size:15px;margin-left:5px;">{{$t('statistics.event.unit')}}</span>
                    <span v-else style="font-size:15px;margin-left:5px;">%</span>
                  </div>
                </div>
                <div class="description">{{ item.eventTitle}}</div>
              </div>
              <div class="img-area">
                <img v-if="index==0" src="../../../static/img/statistics/ic_totalEvent.svg" style="width:84.8;height:79.8px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else-if="index==1" src="../../../static/img/statistics/ic_inprocess.svg" style="width:108.5;height:65.6px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else-if="index==2" src="../../../static/img/statistics/ic_processed.svg" style="width:111.8;height:74.5px;align-items:flex-end;padding-bottom:10.5px;" />
                <img v-else src="../../../static/img/statistics/ic_compeleted.svg" style="width:115.5;height:74px;align-items:flex-end;padding-bottom:10.5px;" />
              </div>
              <div v-if="index!=3" class="split-line"></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="24" class="kpi-list">
            <div class="head">
              <div class="title">{{ $t('statistics.event.eventRank') }}</div>
              <AreaSelected
                path="eventStatistics"
                allow-all="true"
                :cached-params="params"
                :cur-country="curCountry"
                @emitTypeChanged="emitTypeChanged"
              ></AreaSelected>
            </div>
            <div class="barchart-area">
              <v-chart ref="itemsChart1" :auto-resize="true" :options="barchartOption" class="chart-content"/>
            </div>
            <div class="table-area">
              <div class="sec-head">
                <div class="title">{{ $t('statistics.event.storeEvent') }}</div>
                <div class="operation-btns">
                  <div style="width:202px;display:flex;flex-direction:row;">
                    <el-button
                      class="mode-btn"
                      
                    >{{ $t('statistics.event.tableMode')}}</el-button>
                    <el-button
                      class="mode-btn"
                      style="background-color:#fff;margin-right:32px;"
                    >{{ $t('statistics.event.imageMode')}}</el-button>
                  </div>
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
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="second-row">
          <el-col :span="24" class="items-title">
            <span class="title">{{ $t('overview.eventList') }}</span>
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
            </div>
          </el-col>
          <el-col :span="24" class="event-table">
            <table-pagination
              ref="elTP"
              :column-data="eventInfoData"
              :table-data="eventTableData"
              :total="total"
              :highlight-current-row= "true"
              :pagesize="sizeNum"
              :current-page="page"
              :is-event = "true"
              :default-sort = "defaultSort"
              @handleChange="handlePageAndSizeChange"
              @sortChange="handleSortChange"
            />
          </el-col>
        </el-row>
      </el-col>
    </div>
    <div v-if="ispdf" class="el-overview-content">
      <el-col id="pdfDom" ref="printPDF" :span="24" class="el-overview" style="padding:40px 20px;width:1150px;">
        <div :span="24" class="export-header">
          <p>
            <span>{{ $t('remotePatrol.storeSelect') }}：</span>
            <span class="content-header">{{ storeNameStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.storeGroup') }}：</span>
            <span class="content-header">{{ storeGroupStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.storeType') }}：</span>
            <span class="content-header">{{ storeTypeStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.time') }}：</span>
            <span class="content-header">{{ storeDateValue }}</span>
          </p>
        </div>
        <el-row class="first-row">
          <el-col :span="24">
            <img :src="pdfSrc">
          </el-col>
        </el-row>
        <div class="no-print">
          <el-row id="imgTest" class="first-row" style="width:1045px;">
            <el-col :span="24" class="kpi-list" style="background-color:#ffffff;">
              <div class="title">{{ $t('overview.eventGraph') }}</div>
            </el-col>
            <el-col :span="3" class="kpi-list" style="background-color:#ffffff;">
              <div class="kpi-content">
                <div v-for="(item,index) in eventKPIs" :key="index" class="event-list">
                  <div class="event-title">{{ item.eventTitle }}</div>
                  <div class="event-num">{{ item.eventNum }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="14" class="store-events" style="background-color:#ffffff;">
              <div class="region-result">
                <div class="charts-content">
                  <v-chart
                    ref="storeEventRef"
                    :options="storeEventsOptions"
                    :auto-resize="true"
                    class="result-content"/>
                </div>
              </div>
            </el-col>
            <el-col :span="7" class="source-list" style="background-color:#ffffff;">
              <div class="pct-content">
                <div class="pct-panel">
                  <v-chart
                    ref="eventSourceRef"
                    :auto-resize="true"
                    :options="eventSourceOptions"
                    class="chart-content"/>
                </div>
                <div class="pct-nums">
                  <div
                    v-for="(item, index) in sourcePerArray"
                    :class="lang === 'en' ? 'en-label' : ''"
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
          </el-row>
        </div>
        <el-row class="second-row" style="padding-bottom:20px;">
          <el-col :span="24" class="items-title">
            <span class="title">{{ $t('overview.eventList') }}</span>
          </el-col>
          <el-col :span="24" class="event-table">
            <div class="table">
              <div class="event-content">
                <el-table
                  :data="allEventData"
                  :highlight-current-row="true"
                  :default-sort = "defaultSort"
                  :header-cell-class-name="headerClass"
                  :cell-class-name="cellClass"
                  :row-class-name="rowClass"
                  empty-text="无数据"
                  align="left"
                  stripe
                  border
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column
                    v-for="(_item,_index) in eventInfoData"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="_item.pdfwidth"
                    :sortable="_item.sortable"/>
                  <el-table-column
                    :label="$t('overview.remotePatrol')"
                    :min-width="lang.indexOf('zh') !== -1 ? '8% ': '9%'"
                    sortable="custom"
                    prop="RemoteStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.RemoteStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    :min-width="lang.indexOf('zh') !== -1 ? '8%' : '9%'"
                    sortable="custom"
                    prop="OnsiteStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.OnsiteStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    :min-width="lang.indexOf('zh') !== -1 ? '8%' : '9%'"
                    sortable="custom"
                    prop="VideoStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper video">
                        <el-tag size="small" color="#fccc3f1a">{{ scope.row.VideoStr }}</el-tag>
                      </div>
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
        </el-row>
      </el-col>
    </div>
    <dialog-pop
      :title="$t('insSettingView.export')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="ispdf"
      :show-button="false"
      :show-close="false"
      class="LoadDialog"
    >
      <p>{{ $t('insSettingView.isExportPDF') }}......</p>
    </dialog-pop>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import { mapGetters } from 'vuex';
import util from '@/common/util.js';
import { getEventStatsOverStoreV2, getEventStatsOverStore,getEventStatsOverWithGroup } from '@/api/eventOverview';
import html2canvas from 'html2canvas';
import Lodash from 'lodash';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TablePagination from '@/components/TablePagination';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import AreaSelected from '@/components/AreaSelected';

export default {
  name: 'EventStatistics',
  components: {
    DialogPop,
    DelayButton,
    'v-chart': ECharts,
    SearchComponent,
    TablePagination,
    AreaSelected
  },
  mixins: [resize],
  data() {
    return {
      ispdf: false,
      pdfSrc: '',
      curCountry:"-1",
      compareIds:[],
      comapareLabels:[],
      compareType:'stores',
      areaMode:[{key:'area1',value:1},{key:'area2',value:2},{key:'stores',value:0},{key:'storeGroup',value:4},{key:'storeType',value:3}],
      barchartOption:null,
      storeNameStr: '',
      storeGroupStr: '',
      storeTypeStr: '',
      storeDateValue: '',
      htmlTitle: this.$t('overview.htmltopdfD'),
      eventKPIs: [
        {
          eventTitle: this.$t('statistics.event.eventTotal'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('statistics.event.inprocessEvent'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('statistics.event.processedEvent'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('statistics.event.completedRate'),
          eventNum: 0
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
      timeMode: 1, // weekly mode
      daysRangeList: [],
      echartColor: '#7d8cab',
      regionChartEmpty: true,
      storeEventsOptions: null,
      eventSourceOptions: null,
      sourcePerArray: [],
      newColor: '#f31d65',
      pendingColor: '#fea316',
      doneColor: '#434c5e',
      closedColor: '#72a1f3',
      storeEventList: [],
      storeEventLegend: ['日期', this.$t('overview.createdEvent'), this.$t('overview.processedEvent'), this.$t('overview.closedEvents')],
      echartAxiasColor: '#e3e9f4',
      echartBackground: 'rgba(30,34,52,0.75)',
      exportPng: require('../../../static/img/excel.png'),
      eventTableData: [],
      eventInfoData: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '11%'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%'
        },
        {
          'prop': 'storeName',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%'
        },
        {
          'prop': 'numOfTotal',
          'label': this.$t('overview.sumEvents'),
          'sortable': 'custom',
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%'
        },
        {
          'prop': 'numOfUnprocessed',
          'label': this.$t('overview.numUnprocessEvents'),
          'sortable': 'custom',
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '12%'
        },
        {
          'prop': 'numOfInprocess',
          'label': this.$t('overview.numProcessEvents'),
          'sortable': 'custom',
          'width': '145',
          'maxWidth': '180',
          'pdfwidth': '12%'
        },
        {
          'prop': 'numOfProcessed',
          'label': this.$t('overview.numClosedEvents'),
          'sortable': 'custom',
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '12%'
        },
        {
          'prop': 'numOfRejected',
          'label': this.$t('overview.numReturndEvents'),
          'sortable': 'custom',
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '12%'
        }
      ],
      order: {
        direction: 'asc',
        property: 'numOfTotal'
      },
      page: 1,
      sizeNum: 10,
      total: 0,
      allEventData: [],
      headerClass: 'header-class',
      cellClass: 'cell-class',
      rowClass: 'row-class',
      exportEventHeader: [
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('overview.storeName'),
        this.$t('remotePatrol.code'),
        this.$t('overview.sumEvents'),
        this.$t('overview.numUnprocessEvents'),
        this.$t('overview.numProcessEvents'),
        this.$t('overview.numClosedEvents'),
        this.$t('overview.numReturndEvents'),
        this.$t('overview.remotePatrol'),
        this.$t('overview.onsitePatrol'),
        this.$t('overview.storeMonitor')
      ],
      hasNoData: false,
      fontFamily: 'NotoSansCJKTC-Medium, Roboto, Microsoft YaHei',
      ifSaveParams: false,
      defaultSort: { prop: 'numOfTotal', order: 'ascending' },
      isLoading: true
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        this.ifSaveParams = false;
        this.initData();
      }
    }
  },

  created() {
    this.initData();
  },

  beforeDestroy() {
    this.$refs.eventSourceRef && this.$refs.eventSourceRef.dispose();
    this.$refs.storeEventRef && this.$refs.storeEventRef.dispose();
  },

  methods: {
    async initData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
      //this.getSearchParams();
    },
    emitSearch({ searchParams, dateRangeList, timeMode }) {
      this.params = searchParams;
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
      this.daysRangeList = dateRangeList;
      this.curCountry = this.params.curCountry;
      this.timeMode = timeMode;
      this.searchData();
    },
    async searchData() {
      const self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      if (self.params.storeIds.length === 0) {
        self.eventTableData = [];
        self.total = 0;
        self.allEventData = [];
        self.getEventsNum();
        self.storeEventList = [];
        self.storeEventsOptions && (self.storeEventsOptions.dataset.source = []);
        //self.getEventBySourcePie();
        self.isLoading = false;
        self.params.timeMode = self.timeMode;
        self.hasNoData = true;
        const searchParamsObj = {
          path: 'eventStatistics',
          params: this.params
        };
        this.ifSaveParams && this.$refs.eventSearch.saveSearchParams(searchParamsObj);
        this.ifSaveParams = true;
      } else {
        self.params.filter = { page: self.page - 1, size: self.sizeNum };
        self.params.order = this.order;
        self.hasNoData = false;

        /**
         *firstly, call getEventTableData to get all event num and display the first page of table
         * secondly, call getAllEventData to get all event and pie chart data
         */

        await self.getEventTableData();
        await self.getAllEventData();
        self.getStoreEventStatics();
      }
    },
    emitTypeChanged({compareType,compareArr,selectedLabels}){ //劃分類型選擇
      this.compareType = compareType;
      this.compareIds = compareArr;
      this.comapareLabels = selectedLabels;
      this.getEventTableData();
      this.getAllEventData();
    },
    /**事件數量排名**/
    getEventTableDataInfo(params) { 
      return new Promise((resolve, reject) => {
        getEventStatsOverWithGroup(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    async getEventTableData() {
      const self = this;
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      self.params.groupMode = region[0].value;
      let searchCondition = {}
      if(region[0].value<3){ //store, area1, area2
        self.params.storeIds=this.compareIds
        searchCondition = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,storeIds:this.compareIds};
      }else{ //groupType, storeGroup
        self.params.groupIds=this.compareIds
        searchCondition  = {beginTs:this.params.beginTs,endTs:this.params.endTs,groupMode:region[0].value,groupIds:this.compareIds};
      }
      const searchParamsObj = {
        path: 'eventStatistics',
        params: this.params
      };
      this.ifSaveParams && this.$refs.eventSearch.saveSearchParams(searchParamsObj);
      this.ifSaveParams = true;
      const eventResult = await self.getEventTableDataInfo(searchCondition);
      const ignorePer = 0;
      const errCode = eventResult.errCode;
      if (errCode === 0) {
        const result = eventResult.data;
        if (result) {
          const content = result.content;
          self.total = result.totalElements;
        } else {
          self.eventTableData = 0;
          self.eventKPIs.forEach(item => {
            item.eventNum = 0;
          });
        }
      }
    },
    async getExportData() {
      let region = this.areaMode.filter((r)=>{ return r.key==this.compareType});
      //console.log("region:",region);
      const params = {};
      params.beginTs = this.params.beginTs;
      params.endTs = this.params.endTs;
      params.groupMode = region[0].value;
      this.params.groupMode = region[0].value;
      if(region[0].value<3){ //store, area1, area2
        this.params.storeIds=this.compareIds
        params.storeIds = this.params.storeIds;
      }else{ //groupType, storeGroup
        this.params.groupIds=this.compareIds;
        params.groupIds = this.params.storeIds;
      }
      params.filter = { page: this.page - 1, size: this.total };
      params.order = this.order;
      
      let content = [];
      try {
        console.log('params:',params);
        const eventResult = await this.getEventTableDataInfo(params);
        console.log('eventResult:',eventResult);
        const result = eventResult.data;
        if (result) {
          content = result.content;
        }else{
          self.eventTableData = 0;
          self.eventKPIs.forEach(item => {
            item.eventNum = 0;
          });
        }
      } catch (e) {
        this.ispdf = false;
      }
      return content;
    },
    async getAllEventData() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.timeMode = self.timeMode;
      params.storeIds = self.params.storeIds;
      params.filter = { page: self.page - 1, size: self.total };
      params.order = self.order;
      try {
        self.allEventData = await self.getExportData();
        self.allEventData.forEach(item => {
          const numOfTotal = item.numOfTotal;
          if (numOfTotal === 0) {
            item.RemoteStr = 0 + '%';
            item.OnsiteStr = 0 + '%';
            item.VideoStr = 0 + '%';
          } else {
            item.RemoteStr = (item.numOfRemote / numOfTotal * 100).toFixed(0) + '%';
            item.OnsiteStr = (item.numOfOnsite / numOfTotal * 100).toFixed(0) + '%';
            item.VideoStr = (item.numOfVideo / numOfTotal * 100).toFixed(0) + '%';
          }
          item.Remote = Number(item.RemoteStr.replace('%', ''));
          item.Onsite = Number(item.OnsiteStr.replace('%', ''));
          item.Video = Number(item.VideoStr.replace('%', ''));
        });
        self.setBarchartData();
        self.setEventTableData();
        self.getEventsNum();
        self.getEventBySourcePie();
      } catch (e) {
        console.log('EventStatistics-getAllEventData:' + e);
      }
    },
    /*畫barChart*/
    getBarchartOption(){
      const self = this;
      const chartOption = {
        grid:{
          left:40,
          right:40,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            align: 'left'
          },
        },
        legend: {
          x: 'right',
          y: 'bottom',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 37,
          padding: 0,
          icon: 'rect',
          textStyle: {
            color: '#556679',
            fontSize: 13,
            padding: [0, 0, 0, 8],
            height: 18,
            lineHeight: 18
          }
        },
        xAxis:{
          type: "category",
          axisTick:{
            show:false,
          },
          data:[],
        },
        yAxis:[{
          type: 'value',
          min:0,
          max:100,
          axisLine:{
            show:false,
          },
          axisTick:{
            show:false,
          },
          splitLine: {
            lineStyle: {
              type:'dashed',
              color:'#979797'
            }
          },
          axisLabel: {
            color:'#556679',
            fontSize:12,
          },
          name:'(分)',
           nameTextStyle:{
             fontSize:12,
             color:'#556679',
             align:'left',
             padding: [0, 10, 14, -30]
           }
        },{
          type: 'value',
          axisLine:{
            show:false,
          },
          axisTick:{
            show:false,
          },
          splitLine: {
            lineStyle: {
              type:'dashed',
              color:'#979797'
            }
          },
          axisLabel: {
            right:0,
            color:'red',
            fontSize:12,
            align:'right',
          },
          }],
        lineStyle:{
              type:'dashed'
            },
        series: [
          {
            name:"",
            type: 'bar',
            barWidth: "16px",
            smooth: true,
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            color:'#7bd8eb',
            barGap:0,
          }
        ],
        itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  const colorList = ['#7bd8eb', '#b9c6d2'];
                  return colorList[params.dataIndex];
                }
              }
            }
        
      };
      return chartOption;
    },
    setBarchartData(){
      this.barchartOption = this.getBarchartOption();
      let date_xAxis=[];
      let chart_dataset=[];
      this.allEventData.forEach(item => {
        date_xAxis.push(item.groupName);
        chart_dataset.push(item.numOfTotal);
      });
      this.barchartOption.xAxis.data = date_xAxis;
      //this.barchartOption.yAxis.splitLine.show = true;
      //this.barchartOption.series.name= this.Avg12Num[0].name;
      console.log("chart_dataset:",chart_dataset);
      this.barchartOption.series[0].data = chart_dataset;
    },
    
    handleDown() {
      const self = this;
      if (self.eventTableData.length === 0) {
        util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      self.ispdf = true;
      this.$nextTick(() => {
        const img = document.getElementById('imgTest');
        setTimeout(() => {
          html2canvas(img).then(function(canvas) {
            var oGrayImg = canvas.toDataURL('image/jpeg');
            self.pdfSrc = oGrayImg;
          });
          setTimeout(() => {
            self.$print(self.$refs.printPDF);
            self.ispdf = false;
          }, 1000);
        }, 5000);
      });
    },

    async getStoreEventStatics() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.storeIds = self.params.storeIds;
      params.timeMode = self.timeMode;
      const storeEventResult = await self.getStoreEventData(params);
      const option = self.initStoreEventOption();
      if (storeEventResult.errCode === 0) {
        const result = storeEventResult.data;
        self.storeEventList = result;
        const soureceList = [];
        soureceList.push(self.storeEventLegend);
        let sumOfNewEvents = 0;
        let sumOfProcessedEvents = 0;
        let sumOfClosedEvents = 0;
        result.forEach((item, index) => {
          const storeList = item.stores;
          storeList.forEach(_item => {
            sumOfNewEvents += _item.numOfNewEvents;
            sumOfProcessedEvents += _item.numOfProcessedEvents;
            sumOfClosedEvents += _item.numOfClosedEvents;
          });
          const itemArray = [];
          itemArray.push(self.daysRangeList[index]);
          itemArray.push(sumOfNewEvents);
          itemArray.push(sumOfProcessedEvents);
          itemArray.push(sumOfClosedEvents);
          soureceList.push(itemArray);
        });
        option.dataset.source = soureceList;
      }
      self.isLoading = false;
      self.storeEventsOptions = option;
    },

    initStoreEventOption() {
      const self = this;
      const option = {
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
        textStyle: {
          fontFamily: self.fontFamily
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
      return option;
    },

    getStoreEventData(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverStore(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    adjustChart() {
      this.$refs.eventSourceRef && this.$refs.eventSourceRef.resize();
      this.$refs.storeEventRef && this.$refs.storeEventRef.resize();
    },

    export2Excel() {
      const that = this;
      if (that.eventTableData.length === 0) {
        util.notify(that.$t('overview.emptyEventList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportEventHeader;
        const filterVal = ['province', 'city', 'storeName', 'code', 'numOfTotal', 'numOfUnprocessed', 'numOfInprocess',
          'numOfProcessed', 'numOfRejected', 'RemoteStr', 'OnsiteStr', 'VideoStr'];
        const curData = that.allEventData;
        const data = that.formatJson(filterVal, curData);
        const fileName = 'EventList' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    

    setEventTableData(){
      this.orderAllTableData();
      this.eventTableData = [];
      this.eventTableData = [...this.allEventData.slice( (this.page - 1)* this.sizeNum, this.page* this.sizeNum)];
    },

    orderAllTableData(){
      let key = this.defaultSort.prop;
      key = key.indexOf('Str') > -1 ? key.substr(0, key.indexOf('Str')) : key;
      this.defaultSort.order === 'descending' ? this.allEventData.sort((a,b) => { return b[key] - a[key] })
                                : this.allEventData.sort((a,b) => { return a[key] - b[key] });
    },

    getEventsNum() {
      const self = this;
      let totalEvents = 0;
      let totalUnprocessed = 0;
      let totalInprocess = 0;
      let totalProcessed = 0;
      let totalRejected = 0;
      self.allEventData.forEach(item => {
        totalEvents += item.numOfTotal;
        totalUnprocessed += item.numOfUnprocessed;
        totalInprocess += item.numOfInprocess;
        totalProcessed += item.numOfProcessed;
        totalRejected += item.numOfRejected;
      });
      self.eventKPIs[0].eventNum = totalEvents;
      self.eventKPIs[1].eventNum = totalUnprocessed+totalRejected;
      self.eventKPIs[2].eventNum = totalInprocess;
      self.eventKPIs[3].eventNum = (totalEvents==0)? 0 : ((totalProcessed/totalEvents)*100).toFixed(0);
    },

    getEventBySourcePie() {
      const self = this;
      const jsonArray = self.sourceLegend;
      let allRemoteEventNum = 0;
      let allOnsiteEventNum = 0;
      let allStoreEventNum = 0;
      let sumEvent = 0;
      self.allEventData.forEach(item => {
        sumEvent += item.numOfTotal;
        allRemoteEventNum += item.numOfRemote;
        allOnsiteEventNum += item.numOfOnsite;
        allStoreEventNum += item.numOfVideo;
      });
      const totalArray = [allRemoteEventNum, allOnsiteEventNum, allStoreEventNum];
      jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
      jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
      jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
      let seriesData = [];
      if (sumEvent !== 0) {
        seriesData = [
          { value: allRemoteEventNum, name: self.$t('overview.remotePatrol') },
          { value: allOnsiteEventNum, name: self.$t('overview.onsitePatrol') },
          { value: allStoreEventNum, name: self.$t('overview.storeMonitor') }
        ];
      } else {
        seriesData = [];
      }
      const pieOption = self.getEventBySourcePieOption();
      pieOption.series[0].data = seriesData;
      self.eventSourceOptions = pieOption;
      self.sourcePerArray = jsonArray;
    },

    getEventBySourcePieOption() {
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
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  const colorList = ['#f31d65', '#fb804f', '#fccc3f'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      return pieOption;
    },

    

    

    exportPdf(storeNameStr, groupStr, typeStr) {
      this.storeNameStr = storeNameStr;
      this.storeGroupStr = groupStr;
      this.storeTypeStr = typeStr;
      this.handleDown();
    },

    handlePageAndSizeChange(pageObj) {
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.setEventTableData();
    },

    handleSortChange(order, defaultSort) {
      this.defaultSort = { ...defaultSort };
      this.order = this.params.order = order;
      this.params.filter = {
        page: this.page - 1,
        size: this.sizeNum
      };
      this.setEventTableData();
    },

    setDefaultSortAndPage(paramsObj) {
      this.defaultSort = paramsObj.defaultSort;
      this.order = this.params.order = paramsObj.order;
    }

  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";
  .el-overview-content {
    width: 100%;
    position: relative;
    height: auto;
    font-size: calc(14/1920*100vw);
    padding-bottom: 20px;
    .el-overview {
      padding: 0 calc(24/1440*100vw);
      position: relative;
      .export-header{
        min-height: 100px;
        margin-bottom: 20px;
        border: 1px solid $border;
        background-color: #fff;
        padding: 10px 30px;
        color: $black;
        text-align: left;
        font-size: calc(14/1920*100vw);
        p{
          margin:10px 0;
          display: flex;
          .content-header{
            flex:1;
          }
        }
      }
      .amout_row{
        height: 194px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        background-color: #fff;
        border-radius: 5px;
        margin-top: -30px;
        .title{
          height: 67.5px;
          padding-top: 22px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          font-size: 18px;
          text-align: left;
          color: $black;
          border-bottom: solid 1px #acaeb1;
        }
        .amount_region{
          display:flex;
          flex-direction:row;
          height:126.5px;
          align-items:center;
          
          .region-area{
            display: flex;
            flex-direction: row;
            align-items: center;
            height:100%;
            width:calc(274/1440*100vw);
            justify-content: space-between;
            .split-line{
            border:0.5px solid #acaeb1;
            width:1px;
            height:102px;
            margin-top:15px;
            margin-bottom: 25px;
          }
            .img-area{
              height: 100%;
              width:120px;
              display: flex;
              flex-direction: column-reverse;
              align-items: flex-end;
            }
            .num-area{
              display: flex;
              flex-direction: column;
              width: calc(154/1440*100vw);
              margin-left:calc(20/1440*100vw);
              .number{
                height: 57.5px;
                align-self: center;
                font-family: Roboto;
                font-size: 48px;
                color:#484848;
              }
              .description{
                color:#484848;
                font-size: 15px;
                height: 42px;
                font-weight: normal;
                text-align: left;
              }
            }
          }
        }
      }
      .first-row{
        height: auto;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        background-color: #fff;
        border-radius: 5px;
        margin-top: 24px;
        .head{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 67.5px;
          padding-top: 22px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          .title{
            height: 67.5px;
            font-size: 18px;
            text-align: left;
            color: $black;
          }
        }
        .barchart-area{
          height:271px;
          margin-left: calc(36/1440*100vw);
          margin-right: calc(24/1440*100vw);
          border-bottom: solid 1px #acaeb1;
          .chart-content {
            width: 100%;
            height: 100%;
          }
        }
        .table-area{
          height:auto;
          margin-top: 20.5px;
          margin-left: calc(24/1440*100vw);
          margin-right: calc(24/1440*100vw);
          .sec-head{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 30px;
            .title{
              height: 30px;
              font-size: 15px;
              text-align: left;
              color: $black;
            }
            .operation-btns{
              align-self: center;
              display: flex;
              flex-direction: row;
              width:calc(335/1440*100vw);
              height: 30px;
              align-items: center;
              padding:0;
            }
          }
        }
        
        .kpi-list{
          height: 100%;
          border-bottom: 1px solid $border;
          .kpi-content{
            height: auto;
            border-right: 1px solid $border;
            display: flex;
            flex-direction: column;
            .event-list{
              // height:  106px;
              height:  85px;
              padding-top: 15px;
              padding-left: calc(34/1920*100vw);
              padding-bottom: 20px;
              border-bottom: 1px solid $border;
              &:last-child{
                border-bottom: none;
              }
              .event-title{
                font-size: calc(16/1920*100vw);
                height:calc(16/1920*100vw);
                line-height:calc(16/1920*100vw);
                color: $tab;
                text-align: left;
              }
              .event-num{
                font-size: calc(30/1920*100vw);
                line-height: calc(30/1920*100vw);
                height: calc(30/1920*100vw);
                color: $h1;
                text-align: left;
                margin-top: 15px;
                :last-child{
                  padding-bottom: 20px;
                }
              }
            }
          }
        }
        .store-events{
          height: auto;
          @media screen and (max-width: 1536px){
            width: 57%;
          }
          .region-result{
            border-right: 1px solid $border;
            height: 424px;
            padding: 20px calc(30/1920*100vw) 30px calc(30/1920*100vw);
            .charts-content{
              height:100%;
              .result-content{
                height: 100%;
                width: 100%;
              }
            }
          }

        }
        .source-list{
          @media screen and (max-width: 1536px){
            width: 30%;
          }
          .pct-content{
            height: 424px;
            padding-top: 94px;
            padding-bottom: 30px;
            width: 100%;
            text-align: center;
            .pct-panel{
              height: 200px;
              width: 200px;
              margin: 0 auto;
              border-radius: 50%;
              background: -webkit-radial-gradient( circle closest-side,#fff 60%, $background 40%);
              .chart-content{
                width: 100%;
                height: 100%;
              }
            }
            .pct-nums{
              margin-top: 28px;
              padding: 0 calc(20/1920*100vw);
              font-size: 12px;
              display: flex;
              justify-content: center;
              @media screen and (max-width: 1920px){
                padding: 0;
              }
              @media screen and (max-width: 1440px){
                justify-content: space-around;
              }
              .content-labels{
                padding: 0 calc(10/1920*100vw);
                @media screen and (max-width: 1280px){
                  padding: 0;
                }
                font-size: 12px;
                text-align: left;
                .excellent_nums{
                  margin-left: calc(20/1920*100vw);
                  margin-bottom:10px;
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
                    @media screen and (min-width: 1280px) and (max-width: 1366px) {
                      margin-right: calc(2/1920*100vw);
                    }
                  }
                  .label-desc{
                    color: $tab;
                    font-size: 12px;
                  }
                  .label-0{
                    background-color: $red;
                  }
                  .label-1{
                    background-color: $onsite;
                  }
                  .label-2{
                    background-color: $store;
                  }
                }
              }
              .en-label{
                @media screen and (max-width: 1920px){
                  padding: 0 calc(5/1920*100vw);
                }
                @media screen and (max-width: 1660px){
                  padding: 0 calc(1/1920*100vw);
                }
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
            padding-top: 140px;
            border-top: 1px solid $border;
          }
        }

        .ja-kpi-list{
          @extend .kpi-list;
          width: 16%;
        }
        .ja-store-events{
          @extend .store-events;
          width: 52%;
        }
        .ja-source-list{
          @extend .source-list;
          width: 32%;
        }
      }
      .second-row {
        height: auto;
        margin-top: 30px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        background-color: #fff;
        border-radius: 5px;
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          margin-right: calc(24/1440*100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          .title {
            height: 67.5px;
            padding-top: 22px;
            margin-left: calc(24/1440*100vw);
            font-size: 18px;
            text-align: left;
            color: $black;
            border-bottom: solid 1px #acaeb1;
          }
          .operation-btns{
            padding-top: 25px;
            padding-right: calc(30 / 1920 * 100vw);
            float: right;
          }
        }
        .event-table {
          background-color: #fff;
          padding-top: calc(30/1920*100vw);
          .table{
            padding: 0 calc(30/1920*100vw)
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
    .ja-export-btn,
    .en-export-btn,
    .export-btn{
      background-color: #fff;
      color: #006ab7;
    }
    .mode-btn{
      color:#fff;
      background-color: #006ab7;
      width:calc(101/1440*100vw);
      height:30px;
      font-size: 15px;
      border:0;
      text-align: center;
      line-height: 10px;
      margin-left:0px;
    }
  }
</style>

