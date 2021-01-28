<template>
  <div>
    <div class="el-overview-content">
      <el-col :span="24">
        <search-component @emitSearch = "emitSearch" @exportPdf = "exportPdf"/>
      </el-col>
      <el-col :span="24" class="el-overview">
        <el-row class="first-row">
          <el-col :span="24" class="kpi-list">
            <div class="title">{{ $t('overview.eventGraph') }}</div>
          </el-col>
          <el-col :span="3" class="kpi-list">
            <div class="kpi-content">
              <div v-for="(item,index) in eventKPIs" :key="index" class="event-list">
                <div class="event-title">{{ item.eventTitle }}</div>
                <div class="event-num">{{ item.eventNum }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="14" class="store-events">
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
          <el-col :span="7" class="source-list">
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
                  :class="lang=='en'? 'en-label': ''"
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
        <el-row class="second-row">
          <el-col :span="24" class="items-title">
            <span class="title">{{ $t('overview.eventList') }}</span>
            <div class="exprotBtn">
              <el-button
                :class="lang=='en' ? 'en-export-btn':'export-btn'"
                type="primary"
                size="mini"
                @click="export2Excel" >
                <div class="btn-area">
                  <img :src="exportPng" class="icon-excel">
                  <span class="spanClass">{{ $t('eventView.exportReport') }}</span>
                </div>
              </el-button>
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
              :default-sort = "{prop: 'numOfTotal', order: 'ascending'}"
              @handleChange="handlePageAndSizeChange"
              @sortChange="handleSortChange"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-dialog
        v-if="ispdf"
        :title="$t('insSettingView.export')"
        :visible.sync="ispdf"
        :append-to-body="true"
        :close-on-click-modal="false"
        class="LoadDialog"
        width="510px"
        top="35vh"
        left="40vh">
        <div style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #dfe2e9;">
          <p style="margin-top:40px;color:#000;">{{ $t('insSettingView.isExportPDF') }}......</p>
        </div>
      </el-dialog>
    </div>
    <div v-if="ispdf" class="el-overview-content">
      <el-col id="pdfDom" ref="printPDF" :span="24" class="el-overview" style="padding:40px 20px;width:1150px;">
        <div :span="24" class="export-header">
          <p>
            <span>{{ $t('remotePatrol.storeSelect') }}：</span>
            <span class="content-header">{{ storeNameStr }}</span>
          </p>
          <p>
            <span>{{ $t('remotePatrol.selectStoreTag') }}：</span>
            <span class="content-header">{{ storeTagStr }}</span>
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
                  :data="eventPDFData"
                  :highlight-current-row="true"
                  :default-sort = "{prop: 'numOfTotal', order: 'ascending'}"
                  :header-cell-class-name="headerClass"
                  :cell-class-name="cellClass"
                  :row-class-name="rowClass"
                  empty-text="无数据"
                  align="left"
                  stripe
                  border
                  style="width: 100%"
                  size="mini"
                  @sort-change="sortChange"
                >
                  <el-table-column
                    v-for="(_item,_index) in eventInfoData"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="_item.pdfwidth"/>
                  <el-table-column
                    :label="$t('overview.remotePatrol')"
                    :min-width="lang !== 'en' ? '8% ': '9%'"
                    prop="RemoteStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.RemoteStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    :min-width="lang !== 'en' ? '8%' : '9%'"
                    prop="OnsiteStr">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.OnsiteStr }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    :min-width="lang !== 'en' ? '8%' : '9%'"
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
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import { mapGetters } from 'vuex';
import util from '../../common/util.js';
import { getEventStatsOverStoreV2, getEventStatsOverStore } from '@/api/eventOverview';
import html2canvas from 'html2canvas';
import Lodash from 'lodash';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/resize';
import TablePagination from '@/components/TablePagination';

export default {
  name: 'EventStatistics',
  components: {
    'v-chart': ECharts,
    SearchComponent,
    TablePagination
  },
  mixins: [resize],
  data() {
    return {
      ispdf: false,
      pdfSrc: '',
      storeNameStr: '',
      storeTagStr: '',
      storeDateValue: '',
      htmlTitle: this.$t('overview.htmltopdfD'),
      eventKPIs: [
        {
          eventTitle: this.$t('overview.sumEvents'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('overview.sumUnprocessEvents'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('overview.sumProcessEvents'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('overview.sumClosedEvents'),
          eventNum: 0
        },
        {
          eventTitle: this.$t('overview.sumReturnedEvents'),
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
      eventPDFData: [],
      eventInfoData: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
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
          'maxWidth': '160',
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
      fontFamily: 'Roboto, Microsoft YaHei'
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        this.initData();
      }
    }
  },

  async created() {
    this.initData();
  },

  beforeDestroy() {
    this.$refs.eventSourceRef && this.$refs.eventSourceRef.dispose();
    this.$refs.storeEventRef && this.$refs.storeEventRef.dispose();
  },

  methods: {
    handleDown() {
      const self = this;
      self.ispdf = true;
      this.$nextTick(() => {
        const img = document.getElementById('imgTest');
        setTimeout(() => {
          html2canvas(img).then(function(canvas) {
            var oGrayImg = canvas.toDataURL('image/jpeg');
            self.pdfSrc = oGrayImg;
          });
          new Promise(function(resolve) {
            self.eventPDFData = self.allEventData;
            resolve(true);
          }).then(function() {
            setTimeout(() => {
              self.$print(self.$refs.printPDF);
              self.ispdf = false;
            }, 1000);
          });
        }, 1000);
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
      if (that.allEventData.length === 0) {
        that.$message({
          message: that.$t('overview.emptyEventList'),
          type: 'warning'
        });
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportEventHeader;
        const filterVal = ['province', 'city','storeName', 'code', 'numOfTotal', 'numOfUnprocessed', 'numOfInprocess',
          'numOfProcessed', 'numOfRejected', 'RemoteStr', 'OnsiteStr', 'VideoStr'];
        let curData = [];
        curData = that.allEventData;
        const data = that.formatJson(filterVal, curData);
        const fileName = 'EventList' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
        self.storeEventsOptions.dataset.source = [];
        self.getEventBySourcePie();
      } else {
        self.params.filter = { page: self.page - 1, size: self.sizeNum };
        self.params.order = this.order;

        /**
         *firstly, call getEventTableData to get all event num and display the first page of table
         * secondly, call getAllEventData to get all event and pie chart data
         */

        await self.getEventTableData();
        await self.getAllEventData();
        self.getStoreEventStatics();
      }
    },

    initDaysRange() {
      const self = this;
      const start = self.params.beginTs;
      const end = self.params.endTs;
      const startDay = self.$moment(start).format('YYYY-MM-DD');
      const endDay = self.$moment(end).format('YYYY-MM-DD');
      const startDayWithoutYear = self.$moment(start).format('MM/DD');
      const endDayWithoutYear = self.$moment(end).format('MM/DD');
      if (self.timeMode === 1) {
        const beginDay = new Date(util.judgeStart(startDay));
        const weekList = util.getWeek(beginDay, endDay);
        const arrLength = weekList.length;
        const firstEndTime = weekList[0].split('-')[1];
        const firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
        const lastStartTime = weekList[arrLength - 1].split('-')[0];
        const lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
        weekList.splice(0, 1, firstWeekStr);
        weekList.splice(arrLength - 1, 1, lastWeekStr);
        self.daysRangeList = weekList;
      } else if (self.timeMode === 2) {
        self.daysRangeList = util.getMonthBetween(startDay, endDay);
      }
    },

    async initData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
    },

    async getEventTableData() {
      const self = this;
      self.params.timeMode = self.timeMode;
      const eventResult = await self.getEventTableDataInfo(self.params);
      const ignorePer = 0;
      const errCode = eventResult.errCode;
      if (errCode === 0) {
        const result = eventResult.data;
        if (result) {
          const content = result.content;
          self.total = result.totalElements;
          content.forEach(item => {
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
          });
          self.eventTableData = content;
        } else {
          self.eventTableData = 0;
          self.eventKPIs.forEach(item => {
            item.eventNum = 0;
          });
        }
      }
    },

    async getAllEventData() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.timeMode = self.timeMode;
      // if (self.curProvince.length === 0) {
      //   self.hasNoData = true;
      //   self.itemsTableData = [];
      //   return;
      // }
      params.storeIds = self.params.storeIds;
      params.filter = { page: self.page - 1, size: self.total };
      params.order = self.order;
      try {
        if (self.total > 0) {
          const eventResult = await self.getEventTableDataInfo(params);
          const errCode = eventResult.errCode;
          if (errCode === 0) {
            const result = eventResult.data;
            if (result) {
              const content = result.content;
              content.forEach(item => {
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
              });
              self.allEventData = content;
            }
          } else {
            self.allEventData = [];
          }
        } else {
          self.allEventData = [];
        }
        self.getEventTableDataFromEventData();
        self.getEventsNum();
        self.getEventBySourcePie();
      } catch (e) {
        console.log('EventStatistics-getAllEventData:' + e);
      }
    },

    getEventTableDataFromEventData() {
      const allTableData = this.allEventData;
      if (this.totalElements < this.params.filter.size) {
        this.tableData = Lodash.cloneDeep(allTableData);
      } else {
        const startIndex = this.params.filter.page;
        const endIndex = this.params.filter.size;
        this.tableData = allTableData.slice(startIndex, endIndex);
      }
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
      self.eventKPIs[1].eventNum = totalUnprocessed;
      self.eventKPIs[2].eventNum = totalInprocess;
      self.eventKPIs[3].eventNum = totalProcessed;
      self.eventKPIs[4].eventNum = totalRejected;
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

    getEventTableDataInfo(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverStoreV2(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    sortChange(col) {
      const self = this;
      const order = col.order;
      self.order = order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        let property = '';
        if (col.column.property === 'RemoteStr') {
          property = 'numOfRemote';
        } else if (col.column.property === 'OnsiteStr') {
          property = 'numOfOnsite';
        } else if (col.column.property === 'VideoStr') {
          property = 'numOfVideo';
        } else {
          property = col.column.property;
        }
        self.order = self.params.order = {
          'direction': 'asc',
          'property': property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        let property = '';
        if (col.column.property === 'RemoteStr') {
          property = 'numOfRemote';
        } else if (col.column.property === 'OnsiteStr') {
          property = 'numOfOnsite';
        } else if (col.column.property === 'VideoStr') {
          property = 'numOfVideo';
        } else {
          property = col.column.property;
        }
        self.order = self.params.order = {
          'direction': 'desc',
          'property': property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.order = self.params.order = { 'direction': 'asc', 'property': 'numOfTotal' };
      }
      self.params.filter = {
        page: self.page - 1,
        size: self.sizeNum
      };
      self.getEventTableData();
    },

    emitSearch(searchParams, dateRangeList, curRegionI, curRegionII,
      regionMode, storePatrolLists, storeStr, tagNameStr, timeMode) {
      this.params = searchParams;
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
      this.daysRangeList = dateRangeList;
      this.timeMode = timeMode;
      this.searchData();
    },

    exportPdf(storeNameStr, storeTagStr) {
      this.storeNameStr = storeNameStr;
      this.storeTagStr = storeTagStr;
      this.handleDown();
    },

    handlePageAndSizeChange(pageObj) {
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.getEventTableData();
    },

    handleSortChange(order) {
      this.order = this.params.order = order;
      this.params.filter = {
        page: this.page - 1,
        size: this.sizeNum
      };
      this.getEventTableData();
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
      padding: 0 calc(25/1920*100vw);
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
      .first-row{
        height: auto;
        border: 1px solid $border;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .title{
          height: 70px;
          padding-top: 30px;
          margin-left: calc(30/1920*100vw);
          font-size: calc(20/1920*100vw);
          text-align: left;
          color: $black;
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
      }
      .second-row {
        height: auto;
        margin-top: 30px;
        background-color: #fff;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          .title {
            padding-top: 30px;
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            color: $black;
            display: inline-block;
          }
          .exprotBtn{
            padding-top: 25px;
            padding-right: calc(30 / 1920 * 100vw);
            float: right;
            .export-btn{
              border-color: $red;
              z-index: 990;
              height: calc(36/1920*100vw);
              width: calc(130/1920*100vw);
              margin: 0;
              padding: 0;
              font-size: calc(14/1920*100vw);
              line-height: calc(36/1920*100vw);
              color: #ffffff;
              border-width: 0;
              border-radius: 4px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin-right:calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
                  height: calc(24/1920*100vw);
                  width: calc(24/1920*100vw);
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
            }
            .en-export-btn{
              border-color: $red;
              z-index: 990;
              height: calc(36/1920*100vw);
              width: calc(160/1920*100vw);
              margin: 0;
              padding: 0;
              font-size: calc(14/1920*100vw);
              line-height: calc(36/1920*100vw);
              color: #ffffff;
              border-width: 0;
              border-radius: 4px;
              min-width: 120px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin-right: calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
                  height: calc(24/1920*100vw);
                  width: calc(24/1920*100vw);
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
            }
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
  }
</style>

