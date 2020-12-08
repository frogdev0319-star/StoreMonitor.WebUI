<template>
  <div>
    <div class="el-overview-content">
      <el-col :span="24" class="statistics-header">
        <el-col :span="24" class="header-details">
          <span>{{ $t('remotePatrol.storeSelect') }}</span>
          <el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" size="mini"
                     class="el-province" @change="changeCountry">
            <el-option-group v-for="group in countryList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.countryList" :key="item.value" :label="item.label"
                         :value="item.value"/>
            </el-option-group>
          </el-select>
          <region-multi-select
            ref="proviceSelect"
            :selected="curProvince"
            :placeholder="$t('remotePatrol.regionI')"
            :options="provinceList"
            :disabled="curCountry.length === 0 || curCountry === '-1'"
            :all="$t('overview.allZoneI')"
            style="display: inline"
            @changeInput="handleProChange"/>
          <region-multi-select
            ref="citySelect"
            :selected="curCity"
            :placeholder="$t('remotePatrol.regionII')"
            :options="cityList"
            :disabled="curProvince.length === 0 || curCountry === '-1'"
            :all="$t('overview.allZoneII')"
            style="display: inline"
            @changeInput="handleCityChange"/>

          <multi-select
            ref="multiSelect"
            :selected="curStore"
            :placeholder="$t('remotePatrol.stores')"
            :options="storeDataList"
            style="display: inline"
            @changeInput="handleStoreChange"/>
          <span class="select-title">{{ $t('remotePatrol.selectStoreTag') }}</span>
          <multi-select
            ref="TagMultiSelect"
            :selected="curStoreTag"
            :placeholder="$t('remotePatrol.selectStoreTag')"
            :all-select="0"
            :alltype="0"
            :options="storeTagList"
            style="display: inline;margin-left: calc(20/1920*100vw);"
            @changeInput="changeStoreTag"/>
        </el-col>

        <el-col :span="24" class="header-details">
          <span :class="lang === 'en' ? 'en-span-class' : ''">{{ $t('remotePatrol.time') }}</span>
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
            <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;vertical-align: middle;"/>
          </el-tooltip>
          <div class="exprotBtn" style="float:right;">
            <el-button
              :class="lang==='en'? 'en-search-btn':'search-btn' "
              :disabled="storeDataList.length === 0"
              size="mini"
              style="vertical-align: middle;"
              type="primary"
              @click="searchData">{{ $t('remotePatrol.search') }}</el-button>
            <el-button :class="lang === 'en'? 'en-search-btn':'search-btn' " type="primary" size="mini"
                       style="vertical-align: middle;" @click="handleDown()">
              <div class="btn-area">
                <i class="iconfont icon-pdf" style="font-size: calc(24/1920*100vw);vertical-align: middle;"/>
                <span style="font-size: calc(14/1920*100vw);margin:0 0 0 10px;vertical-align: middle;">
                  {{ $t('remotePatrol.InspectionDetail') }}
                </span>
              </div>
            </el-button>
          </div>
        </el-col>
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
                <v-chart ref="storeEventRef" :options="storeEventsOptions" :auto-resize="true"
                         class="result-content"/>
              </div>
            </div>
          </el-col>
          <el-col :span="7" class="source-list">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart ref="eventSourceRef" :auto-resize="true" :options="eventSourceOptions"
                         class="chart-content"/>
              </div>
              <div class="pct-nums">
                <div v-for="(item, index) in sourcePerArray" :class="lang=='en'? 'en-label': ''" :key="index"
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
              <el-button :class="lang=='en' ? 'en-export-btn':'export-btn'" type="primary" size="mini"
                         @click="export2Excel" >
                <div class="btn-area">
                  <img :src="exportPng" class="icon-excel">
                  <span class="spanClass">{{ $t('eventView.exportReport') }}</span>
                </div>
              </el-button>
            </div>
          </el-col>
          <el-col :span="24" class="event-table">
            <div class="table">
              <div class="event-content">
                <el-table
                  :data="eventTableData"
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
                    :sortable="_item.sortable"
                    :min-width="lang!=='en'? _item.width : _item.maxWidth"/>
                  <el-table-column
                    :label="$t('overview.remotePatrol')"
                    :min-width="lang!=='en'? 120 : 150"
                    prop="remotePer"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.remotePer }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    :min-width="lang!=='en'? 120 : 150"
                    prop="onsitePer"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.onsitePer }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    :min-width="lang!=='en'? 120 : 150"
                    prop="videoPer"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper video">
                        <el-tag size="small" color="#fccc3f1a">{{ scope.row.videoPer }}</el-tag>
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
          <el-row class="first-row" id="imgTest" style="width:1045px;">
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
                  <v-chart ref="storeEventRef" :options="storeEventsOptions" :auto-resize="true"
                          class="result-content"/>
                </div>
              </div>
            </el-col>
            <el-col :span="7" class="source-list" style="background-color:#ffffff;">
              <div class="pct-content">
                <div class="pct-panel">
                  <v-chart ref="eventSourceRef" :auto-resize="true" :options="eventSourceOptions"
                          class="chart-content"/>
                </div>
                <div class="pct-nums">
                  <div v-for="(item, index) in sourcePerArray" :class="lang === 'en' ? 'en-label' : ''"
                      :key="index" class="content-labels">
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
                    prop="remotePer">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.remotePer }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    :min-width="lang !== 'en' ? '8%' : '9%'"
                    prop="onsitePer">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.onsitePer }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    :min-width="lang !== 'en' ? '8%' : '9%'"
                    prop="videoPer">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper video">
                        <el-tag size="small" color="#fccc3f1a">{{ scope.row.videoPer }}</el-tag>
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
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getStoreList, getBriefStoreList, GetTagList } from '@/api/store';
import util from '../../common/util.js';
import { getEventStatsOverStoreV2, getEventStatsOverStore } from '@/api/eventOverview';
import html2canvas from 'html2canvas';

export default {
  name: 'EventStatistics',

  components: {
    MultiSelect,
    'v-chart': ECharts,
    RegionMultiSelect
  },

  data() {
    return {
      ispdf: false,
      pdfSrc: '',
      paramsStoreIds: [],
      storeNameStr: '',
      storeTagStr: '',
      storeDateValue: '',
      htmlTitle: this.$t('overview.htmltopdfD'),
      curCountry: '',
      curStoreTag: [],
      storeTagList: [],
      countryList: [],
      curProvince: [],
      provinceList: [],
      curCity: [],
      cityList: [],
      curStore: [],
      storeList: [],
      storeDataList: [],
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      toolTipClass: 'page-login-toolTipClass',
      showStoreInfo: false,
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
          'prop': 'storeName',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'width': '290',
          'maxWidth': '290',
          'pdfwidth': '16%'
        },
        {
          'prop': 'regionName',
          'label': this.$t('overview.area'),
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
      direction: 'asc',
      property: 'numOfTotal',
      page: 1,
      sizeNum: 10,
      total: 0,
      allEventData: [],
      headerClass: 'header-class',
      cellClass: 'cell-class',
      rowClass: 'row-class',
      exportEventHeader: [
        this.$t('overview.storeName'),
        this.$t('overview.area'),
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
      sidebarElm: null,
      fontFamily: 'Roboto, Microsoft YaHei'
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      let self = this;
      if (val !== 0) {
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initDaysRange();
        self.initData();
        self.curStoreTag = [];
      }
    }
  },

  async created() {
    let self = this;
    let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
    let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
    self.params.beginTs = start;
    self.params.endTs = end;
    self.params.timeMode = self.timeMode;
    self.initDaysRange();
    self.initData();
  },

  mounted() {
    let self = this;
    window.addEventListener('resize', self.adjustChart, false);
    self.sidebarElm = document.getElementsByClassName('aside-menu')[0];
    self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false);
  },

  beforeDestroy() {
    let self = this;
    window.removeEventListener('resize', self.adjustChart);
    self.adjustChart = null;
    self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar, false);
    self.$refs.eventSourceRef && self.$refs.eventSourceRef.dispose();
    self.$refs.storeEventRef && self.$refs.storeEventRef.dispose();
  },

  methods: {
    handleDown() {
      let self = this;
      self.ispdf = true;
      this.$nextTick(() => {
        let img = document.getElementById('imgTest');
        setTimeout(()=>{
          html2canvas(img).then(function (canvas) {
            var oGrayImg = canvas.toDataURL('image/jpeg');
            self.pdfSrc = oGrayImg;
          })
          new Promise(function(resolve) {
            self.eventPDFData = self.allEventData;
            resolve(true);
          }).then(function() {
            setTimeout(()=>{
              self.$print(self.$refs.printPDF);
              self.ispdf = false;
            },1000)
          });
        },1000)
      });
    },

    dateChange(val) {
      let self = this;
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
      self.initDaysRange();
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
        let storeObj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName,
          checked: true
        };
        tempStore.push(storeObj);
      });
      self.storeDataList = tempStore;
    },

    getStoreData(params) {
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getStoreEventStatics() {
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.storeIds = self.paramsStoreIds;
      params.timeMode = self.timeMode;
      let storeEventResult = await self.getStoreEventData(params);
      let option = self.initStoreEventOption();
      if (storeEventResult.errCode === 0) {
        let result = storeEventResult.data;
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
        option.dataset.source = soureceList;
      }
      self.storeEventsOptions = option;
    },

    initStoreEventOption(){
      let self = this;
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
      return option
    },

    getStoreEventData(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverStore(params).then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        });
      });
    },

    adjustChart() {
      let self = this;
      if (self.$refs.eventSourceRef) {
        self.$refs.eventSourceRef.resize();
      }
      if (self.$refs.storeEventRef) {
        self.$refs.storeEventRef.resize();
      }
    },

    async getRegionInfo() {
      let self = this;
      let params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      let retData = await self.getStoreData(params);
      let storeList = retData.data.content;
      self.storeList = storeList;

      let getCountry = storeList => {
        let temp = [];
        storeList.forEach(item => {
          if (temp.map(x => x.value).indexOf(item.country) === -1) {
            let obj = {
              label: item.country,
              value: item.country
            };
            temp.push(obj);
          }
        });
        return temp;
      };
      let countryList = getCountry(storeList);
      let tempStore = [];
      storeList.forEach(item => {
        let obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName,
          checked: false
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
      self.countryList[0] = {};
      self.countryList[0].label = self.$t('remotePatrol.country');
      self.countryList[0].countryList = countryList;
      self.curCountry = countryList[0].label;
      self.selectAllProAndCity(self.curCountry);
    },

    async getCountryStore() {
      let self = this;
      let data = await self.getBriefStoreData();
      let temp = [];
      if (data.errCode === 0 && data.errMsg === 'Success') {
        self.storeList = data.data;
        if (self.storeList.length !== 0) {
          self.storeList.forEach(item => {
            let country = item.country;
            if (temp.map(x => x.label).indexOf(country) === -1) {
              let obj = {
                value: country,
                label: country
              };
              temp.push(obj);
            }
          });
        }
        let countryList = temp;
        self.countryList[0] = {};
        self.countryList[0].label = self.$t('remotePatrol.country');
        self.countryList[0].countryList = countryList;
        self.countryList[0].countryList.unshift({ value: '-1', label: self.$t('remotePatrol.all') });
        self.curCountry = countryList[0].value;
        self.selectAllProAndCity(self.curCountry);
      }
    },

    getStoreData(params) {
      let self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            let data = res.data;
            resolve(res);
          }
        }).catch(res => {
          resolve(res);
        });
      });
    },

    handleStoreChange(arr) {
      this.curStore = arr;
      this.changeStore(arr);
    },

    handleProChange(arr) {
      this.curProvince = arr;
      this.changePro(arr);
    },

    handleCityChange(arr) {
      this.curCity = arr;
      this.changeCity(arr);
    },

    changeStore(val) {
      let self = this;
      let NameStr = '', TagStr = '', storeIds = [];
      self.storeList.forEach((item, index) => {
        val.forEach((_item, _index) => {
          let isuu = _index === val.length - 1 ? '' : '，';
          if (item.storeId === _item) {
            if (self.curStoreTag.length !== 0) {
              self.curStoreTag.forEach(v_item => {
                item.tagIds.forEach(t_item => {
                  if ((t_item === v_item && self.curCountry === item.country) || (t_item === v_item && self.curCountry === '-1')) {
                    storeIds.push(_item);
                    NameStr += item.name + isuu;
                    self.storeTagList.forEach(r_item => {
                      if (r_item.value === v_item) {
                        TagStr.indexOf(r_item.label) === '-1' ? TagStr += r_item.label + '，' : null;
                      }
                    });
                  }
                });
              });
            } else {
              storeIds.push(_item);
              NameStr += item.name + isuu;
              TagStr = '--';
            }
          }
        });
      });
      self.paramsStoreIds = storeIds;
      self.storeNameStr = NameStr;
      self.storeTagStr = TagStr;
    },

    changePro(val) {
      let self = this;
      self.curCity = [];
      self.clearCityInfo();
      self.clearStoreInfo();
      let storeList = self.storeList;
      let temp = [];
      let tempStore = [];
      if (val === '') {
        storeList.forEach(item => {
          if (item.country === self.curCountry) {
            let storeObj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              tagIds: item.tagIds
            };
            tempStore.push(storeObj);
          }
        });
      } else {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.province === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                let obj = {
                  label: item.city,
                  value: item.city
                };
                temp.push(obj);
              }
              let obj = {
                storeId: item.storeId,
                label: item.name,
                value: item.name,
                userId: item.userId,
                userName: item.userName
              };
              tempStore.push(obj);
            }
          });
        });
        self.cityList = temp;
        let cityArr = [];
        if (self.cityList.length !== 0) {
          self.cityList.forEach(item => {
            cityArr.push(item.value);
          });
          self.curCity = cityArr;
        }
      }
      self.storeDataList = tempStore;
      let storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });

      self.curStore = storeArr;
      self.changeStore(self.curStore);
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getTagListData() {
      let self = this;
      return new Promise((resolve, reject) => {
        GetTagList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            res.data.forEach(item => {
              let tabObj = {};
              tabObj.value = item.tagId;
              tabObj.label = item.tagName;
              tabObj.disabled = false;
              self.storeTagList.push(tabObj);
            });
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    changeStoreTag(val) {
      let self = this;
      self.curStoreTag = val;
      self.changeStore(self.curStore);
    },

    changeCountry(val) {
      let self = this;
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      self.selectAllProAndCity(val);
    },

    changeCountrysss(val) {
      let self = this;
      self.curProvince = [];
      self.curCity = [];
      self.curStoreTag = [];
      let storeList = self.storeList;
      let tempStore = [];
      let temp = [];
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      if (val === '') {
        storeList.forEach(item => {
          let storeObj = {
            storeId: item.storeId,
            label: item.name,
            value: item.name,
            userId: item.userId,
            userName: item.userName
          };
          tempStore.push(storeObj);
        });
        // self.storeDataList=tempStore;
        self.checkAllStore = false;
      } else {
        storeList.forEach(item => {
          if (item.country === val) {
            if (temp.map(x => x.value).indexOf(item.province) === -1) {
              let obj = {
                label: item.province,
                value: item.province
              };
              temp.push(obj);
            }
            let obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              userName: item.userName
            };
            tempStore.push(obj);
          }
        });
      }
      self.provinceList = temp;
      self.storeDataList = tempStore;
      let cityTemp = [];
      self.provinceList.forEach(_item => {
        storeList.forEach(item => {
          if (item.province === _item.value) {
            if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
              let obj = {
                label: item.city,
                value: item.city
              };
              cityTemp.push(obj);
            }
          }
        });
      });
      self.cityList = cityTemp;
      let provinceArr = [];
      self.provinceList.forEach(item => {
        provinceArr.push(item.value);
      });
      self.curProvince = provinceArr;
      let cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      self.curCity = cityArr;
    },

    changeCity(val) {
      let self = this;
      self.clearStoreInfo();
      let storeList = self.storeList;
      let tempStore = [];
      if (val.length !== 0) {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.city === _item) {
              if (tempStore.map(x => x.value).indexOf(item.city) === -1) {
                let storeObj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name,
                  userId: item.userId,
                  userName: item.userName
                };
                tempStore.push(storeObj);
              }
            }
          });
        });
      }
      self.storeDataList = tempStore;
      let storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });
      self.curStore = storeArr;
      self.changeStore(self.curStore);
    },

    clearStoreInfo() {
      let self = this;
      self.curStore = [];
      self.paramsStoreIds = [];
      self.$refs.multiSelect.selectedArray = [];
      self.$refs.multiSelect.input = '';
    },

    clearProviceInfo() {
      let self = this;
      self.curProvince = [];
      self.$refs.proviceSelect.selectedArray = [];
      self.$refs.proviceSelect.input = '';
    },

    clearCityInfo() {
      let self = this;
      self.curCity = [];
      self.$refs.citySelect.selectedArray = [];
      self.$refs.citySelect.input = '';
    },

    selectAllProAndCity(val) {
      let self = this;
      let storeList = self.storeList;
      let temp = [];
      let tempStore = [];
      storeList.forEach(item => {
        if (item.country === val || val === '-1') {
          if (temp.map(x => x.value).indexOf(item.province) === -1) {
            let obj = {
              label: item.province,
              value: item.province
            };
            temp.push(obj);
          }
          let obj = {
            storeId: item.storeId,
            label: item.name,
            value: item.name,
            userId: item.userId,
            userName: item.userName
          };
          tempStore.push(obj);
        }
      });
      self.provinceList = temp;
      let cityTemp = [];
      self.provinceList.forEach(_item => {
        storeList.forEach(item => {
          if (item.province === _item.value) {
            if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
              let obj = {
                label: item.city,
                value: item.city
              };
              cityTemp.push(obj);
            }
          }
        });
      });
      self.cityList = cityTemp;
      let provinceArr = [];
      self.provinceList.forEach(item => {
        provinceArr.push(item.value);
      });
      self.curProvince = provinceArr;

      let cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      self.curCity = cityArr;
      self.storeDataList = tempStore;
      let storeArr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
      });
      self.curStore = storeArr;
      self.changeStore(self.curStore);
      self.searchData();
    },

    export2Excel() {
      let that = this;
      if (that.allEventData.length === 0) {
        that.$message({
          message: that.$t('overview.emptyEventList'),
          type: 'warning'
        });
        return false;
      }
      require.ensure([], async() => {
        let { export_json_to_excel } = require('@/excel/Export2Excel');
        let tHeader = that.exportEventHeader;
        let filterVal = ['storeName', 'regionName', 'numOfTotal', 'numOfUnprocessed', 'numOfInprocess',
          'numOfProcessed', 'numOfRejected', 'remotePer', 'onsitePer', 'videoPer'];
        let curData = [];
        curData = that.allEventData;
        let data = that.formatJson(filterVal, curData);
        let fileName = 'EventList' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    async searchData() {
      let self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      if (self.paramsStoreIds.length === 0) {
        self.eventTableData = [];
        self.total = 0;
        self.allEventData = [];
        self.getEventsNum();
        self.storeEventList = [];
        self.storeEventsOptions.dataset.source = [];
        self.getEventBySourcePie();
      } else {
        self.params.storeIds = self.paramsStoreIds;
        self.params.filter = { page: self.page - 1, size: self.sizeNum };
        self.params.order = { direction: self.direction, property: self.property };
        await self.getEventTableData();
        await self.getAllEventData();
        self.getStoreEventStatics();
      }
    },

    initDaysRange() {
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
        self.daysRangeList = weekList;
      } else if (self.timeMode === 2) {
        self.daysRangeList = util.getMonthBetween(startDay, endDay);
      }
    },

    async initData() {
      let self = this;
      let storeIds = self.curStore.filter(item => item !== -1);
      self.params.storeIds = storeIds;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.params.order = { direction: self.direction, property: self.property };
      self.getCountryStore();
      self.getTagListData();
    },

    async getEventTableData() {
      let self = this;
      let storeIds = self.paramsStoreIds;
      self.params.storeIds = storeIds;
      let eventResult = await self.getEventTableDataInfo(self.params);
      let qualifiedPer = 0;
      let ignorePer = 0;
      let errCode = eventResult.errCode;
      let seriesData = [];
      if (errCode === 0) {
        let result = eventResult.data;
        if (result) {
          let content = result.content;
          self.total = result.totalElements;
          content.forEach(item => {
            let numOfTotal = item.numOfTotal;
            if (numOfTotal === 0) {
              item.remotePer = 0 + '%';
              item.onsitePer = 0 + '%';
              item.videoPer = 0 + '%';
            } else {
              item.remotePer = (item.numOfRemote / numOfTotal * 100).toFixed(0) + '%';
              item.onsitePer = (item.numOfOnsite / numOfTotal * 100).toFixed(0) + '%';
              item.videoPer = (item.numOfVideo / numOfTotal * 100).toFixed(0) + '%';
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
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.timeMode = self.timeMode;
      if (self.curProvince.length === 0) {
        self.hasNoData = true;
        self.itemsTableData = [];
        return;
      }
      params.storeIds = self.paramsStoreIds;

      params.filter = { page: self.page - 1, size: self.total };
      params.order = { direction: self.direction, property: self.property };
      if (self.total > 0) {
        let eventResult = await self.getEventTableDataInfo(params);
        let errCode = eventResult.errCode;
        if (errCode === 0) {
          let result = eventResult.data;
          if (result) {
            let content = result.content;
            content.forEach(item => {
              let numOfTotal = item.numOfTotal;
              if (numOfTotal === 0) {
                item.remotePer = 0 + '%';
                item.onsitePer = 0 + '%';
                item.videoPer = 0 + '%';
              } else {
                item.remotePer = (item.numOfRemote / numOfTotal * 100).toFixed(0) + '%';
                item.onsitePer = (item.numOfOnsite / numOfTotal * 100).toFixed(0) + '%';
                item.videoPer = (item.numOfVideo / numOfTotal * 100).toFixed(0) + '%';
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
      self.getEventsNum();
      self.getEventBySourcePie();
    },

    getEventsNum() {
      let self = this;
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
      let self = this;
      let jsonArray = self.sourceLegend;
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
      let totalArray = [allRemoteEventNum, allOnsiteEventNum, allStoreEventNum];
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
    },

    getEventTableDataInfo(params) {
      return new Promise((resolve, reject) => {
        getEventStatsOverStoreV2(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err)
        });
      });
    },

    sortChange(col) {
      let self = this;
      let order = col.order;
      self.order = order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        let property = '';
        if (col.column.property === 'remotePer') {
          property = 'numOfRemote';
        } else if (col.column.property === 'onsitePer') {
          property = 'numOfOnsite';
        } else if (col.column.property === 'videoPer') {
          property = 'numOfVideo';
        } else {
          property = col.column.property;
        }
        self.params.order = {
          'direction': 'asc',
          'property': property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        let property = '';
        if (col.column.property === 'remotePer') {
          property = 'numOfRemote';
        } else if (col.column.property === 'onsitePer') {
          property = 'numOfOnsite';
        } else if (col.column.property === 'videoPer') {
          property = 'numOfVideo';
        } else {
          property = col.column.property;
        }
        self.params.order = {
          'direction': 'desc',
          'property': property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.params.order = { 'direction': 'asc', 'property': 'numOfTotal' };
      }
      self.params.filter = {
        page: self.page - 1,
        size: self.sizeNum
      };
      self.getEventTableData();
    },

    sizeChange(val) {
      let self = this;
      self.sizeNum = val;
      // self.page=1;
      self.page = 1;
      self.params.filter = { page: self.page - 1, size: val };
      self.getEventTableData();
    },

    currentChange(val) {
      let self = this;
      self.page = val;
      self.params.filter = { page: val - 1, size: self.sizeNum };
      self.getEventTableData();
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
  @import '../../assets/css/textstyle.css';
  @import '../../assets/css/importfile.css';
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $pending: #fea316;
  $done: #434c5e;
  $closed: #72a1f3;
  $pass: #72a1f3;
  $onsite: #fb804f;
  $store: #fccc3f;
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
  @media print {
   #imgTest{
     page-break-inside:avoid;
   }
  }
  *{
    box-sizing: border-box;
    font-family: Roboto, Arial, 'Microsoft YaHei',serif;
  }
  .el-overview-content {
    width: 100%;
    position: relative;
    height: auto;
    /*background-color: #f6f9fe;*/
    font-size: calc(14/1920*100vw);
    padding-bottom: 20px;
    .statistics-header{
      margin-bottom: 30px;
      border-bottom: 1px solid $border;
      background-color: #fff;
      padding-top: 30px;
      // padding-bottom: 30px;
      color: $black;
      .header-details1{
        text-align: left;
        padding-left: calc(30/1920*100vw);
        padding-right: calc(30/1920*100vw);
        height: 20px;
        line-height: 20px;
        span{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
        }
        .choice-store{
          color: $tab;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 90%;
          display: inline-block;
          i{
            margin-right: calc(16/1920*100vw);
            font-size: calc(16/1920*100vw);
          }
        }
        .store-selected{
          top: unset;
          background-color: rgba(30, 34, 52, 0.75);
          position: absolute;
          /* display: none; */
          z-index: 1;
          padding: 20px;
          min-width: 200px;
          border-radius: 10px;
          left: calc(80 / 1920 * 100vw);
          h1{
            white-space: nowrap;
            font-size: 18px;
            margin: 0;
            color: #fff;
            font-weight: 500;
            line-height: 1.1;
          }
          .store-list{
            margin-top: 10px;
            margin-left: 10px;
            padding: 0;
            .store-item{
              // white-space: nowrap;
              font-size: 14px;
              margin: 0;
              list-style-type: none;
              color: #fff;
            }
          }
        }
      }
      .header-details{
        text-align: left;
        padding-left: calc(30/1920*100vw);
        position: relative;
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
          font-size: calc(20 / 1920 * 100vw);
          position: relative;
          color: $tab;
        }
        span{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
        }
        @media screen and(max-width: 1366px){
          .en-span-class{
            margin-right: 60px;
          }
        }
        @media screen and(min-width: 1366px){
          .en-span-class{
            //margin-right: 75px;
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
          // float: right;
        }
        .en-search-btn{
          width: calc(130/1920*100vw);
          min-width:115px;
          margin-left: calc(20/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          // float: right;
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
<style>
  @import '../../assets/css/pagination.css';
  .LoadDialog /deep/ .el-dialog__header{
    padding-bottom:0;
  }
  .LoadDialog /deep/ .el-dialog__body{
    padding:0px 20px 30px 20px !important;
  }
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
<style>
  .header-class{
    height: 40px;
    font-size: 12px;
    font-family: Arial, 'Microsoft YaHei';
    font-weight: bold;
    color: #7d8cad;
    background-color: #f4f5f9 !important;
    border-right: none !important;
  }
  .cell-class{
    padding-left: 20px;
    font-size: calc(14/1920*100vw);
    color: #182752;
  }
  .el-table__row.row-class{
    height: 35px;
  }
  body .el-table th.gutter {
    display: table-cell !important
  }
  .el-table--border td.cell-class:nth-last-of-type(1) {
    border-right: 1px solid #EBEEF5 !important;
  }
  .el-table__header-wrapper th.header-class:nth-last-of-type(2) {
    border-right: 1px solid #EBEEF5 !important;
  }
  .header-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .header-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }

  .name-wrapper .el-tag--small{
    width: 45px;
    font-size: calc(14/1920*100vw);
    font-family: Arial;
    padding: 0 0;
    text-align: center;
  }
  .remote .el-tag{
    color: #f31d65;
    border: 1px solid #f31d65;
  }
  .onsite .el-tag{
    color: #fb804f;
    border: 1px solid #fb804f;
  }
  .video .el-tag{
    color: #fccc3f;
    border: 1px solid #fccc3f;
  }

  .header-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .header-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }
  .cell-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .cell-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }
  .el-table__empty-block{
    border-bottom: 1px solid #e3e9f4;
  }
  .el-table-panel .el-table.el-table--striped.el-table--border.el-table--enable-row-hover.el-table--mini{
    border-right: 1px solid #e3e9f4;
  }
</style>

