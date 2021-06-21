<template>
  <div>
    <el-row class="statistics-container">
      <el-col :span="24">
        <search-component
          ref="inspectEvalutionSearch"
          :is-patrol = "true"
          :default-sort="defaultSort"
          path="inspectEvalutionStatistics"
          @emitSearch = "emitSearch"
          @exportPdf = "exportPdf"
          @setDefaultSortAndPage="setDefaultSortAndPage"/>
      </el-col>
      <div class="statistics-content content">
        <el-col :span="24" class="region-chart">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.regionalAssessment') }}
              </span>
            </div>
          </el-col>
          <el-col :span="9" class="evalution-pct">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart ref="itemsPie" :auto-resize="true" :options="regionsOptions" class="chart-content"/>
              </div>
              <div class="pct-nums">
                <div
                  v-for="(item, index) in regionsPerArray"
                  :class="lang=='en'? 'en-labels': ''"
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
          <el-col :span="15" class="charts-content">
            <div class="title">
              <limit-select
                ref="multiRegionsSelect"
                :selected="curRegion"
                :options="regionsList"
                :limit="2"
                :input-size="'mini'"
                style="display: inline"
                @changeInput="handleRegionsChange"/>
            </div>
            <div class="region-result">
              <div class="region-content">
                <div class="region-result-panel">
                  <v-chart
                    ref="storeChart"
                    :options="regionsChartsOptions"
                    :auto-resize="true"
                    class="result-content" />
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <el-col :sapn="24" class="region-list">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.regionalList') }}
              </span>
              <div class="operation-btns">
                <delay-button
                  :class="lang === 'en' ? 'en-export-btn':'export-btn'"
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
          </el-col>
          <div class="el-table-panel">
            <table-pagination
              ref="elTP"
              :column-data="regionInfoData"
              :table-data="regionTableData"
              :total="totalRegion"
              :highlight-current-row= "true"
              :pagesize="sizeNumRegion"
              :current-page="pageRegion"
              :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
              @handleChange="handleRegionPageAndSizeChange"
              @sortChange="handleRegionSortChange"/>
          </div>
        </el-col>

        <el-col :sapn="24" class="store-list">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.storeList') }}
              </span>
              <div class="operation-btns">
                <delay-button
                  :class="lang === 'en' ? 'en-export-btn':'export-btn'"
                  type="primary"
                  size="mini"
                  @click="exportStore2Excel"
                >
                  <div class="button-area">
                    <img :src="exportPng" class="icon-excel">
                    <span>{{ $t('eventView.exportReport') }}</span>
                  </div>
                </delay-button>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="el-table-panel">
              <table-pagination
                ref="elTP"
                :column-data="storeInfoData"
                :table-data="storeTableData"
                :total="totalStore"
                :highlight-current-row= "true"
                :pagesize="sizeNumStore"
                :current-page="pageStore"
                :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
                @handleChange="handleStorePageAndSizeChange"
                @sortChange="handleStoreSortChange"/>
            </div>
          </el-col>
        </el-col>
      </div>
    </el-row>

    <el-row v-if="ispdf" id="pdfDom" class="statistics-container" style="padding:40px 20px;">
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
          <span>{{ $t('overview.patrolLists') }}：</span>
          <span class="content-header">{{ storePatrolLists }}</span>
        </p>
        <p>
          <span>{{ $t('remotePatrol.time') }}：</span>
          <span class="content-header">{{ storeDateValue }}</span>
        </p>
      </div>
      <div class="statistics-content content">
        <el-col :span="24" class="region-chart">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.regionalAssessment') }}
              </span>
            </div>
          </el-col>
          <el-col :span="9" class="evalution-pct">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart ref="itemsPie" :auto-resize="true" :options="regionsOptions" class="chart-content"/>
              </div>
              <div class="pct-nums">
                <div
                  v-for="(item, index) in regionsPerArray"
                  :class="lang=='en'? 'en-labels': ''"
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
          <el-col :span="15" class="charts-content">
            <div class="title">
              <limit-select
                ref="multiRegionsSelect"
                :selected="curRegion"
                :options="regionsList"
                :limit="2"
                :input-size="'mini'"
                style="display: inline"
                @changeInput="handleRegionsChange"/>
            </div>
            <div class="region-result">
              <div class="region-content">
                <div class="region-result-panel">
                  <v-chart ref="storeChart" :options="regionsChartsOptions" :auto-resize="true" class="result-content" />
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <el-col :sapn="24" class="region-list" style="padding-bottom:20px;">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.regionalList') }}
              </span>

            </div>
          </el-col>
          <div class="el-table-panel">
            <table-pagination
              ref="elTP"
              :column-data="regionInfoData"
              :table-data="regionPDFData"
              :highlight-current-row= "true"
              :show-pagination="false"
              :is-pdf-column="true"
              :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
              @handleChange="handlePageAndSizeChange"
              @sortChange="handleSortChange"/>
          </div>

        </el-col>

        <el-col :sapn="24" class="store-list" style="padding-bottom:20px;">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.storeList') }}
              </span>

            </div>
          </el-col>
          <el-col :span="24">
            <div class="el-table-panel">
              <table-pagination
                ref="elTP"
                :isexportPDF="isexportPDF"
                :column-data="storeInfoData"
                :table-data="storePDFData"
                :highlight-current-row= "true"
                :show-pagination="false"
                :is-pdf-column="true"
                :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
                @handleChange="handlePageAndSizeChange"
                @sortChange="handleSortChange"/>
            </div>
          </el-col>

        </el-col>
      </div>
    </el-row>
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
import LimitSelect from '@/components/LimitSelect';
import ECharts from 'vue-echarts';
import util from '@/common/util.js';
import {
  getInspectStatsOverRegion,
  getInspectStatsOverviewWithRegionV2
} from '@/api/inspectOverview';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';
import TablePagination from '@/components/TablePagination';
import DialogPop from '@/components/DialogPop';
import DelayButton from '@/components/DelayButton';

export default {
  name: 'PatrolEvaluationSta',

  components: {
    DelayButton,
    DialogPop,
    'v-chart': ECharts,
    LimitSelect,
    SearchComponent,
    TablePagination
  },
  mixins: [resize],
  data() {
    return {
      htmlTitle: this.$t('overview.htmltopdfA'),
      isexportPDF: false,
      storeNameStr: '',
      storeTagStr: '',
      storePatrolLists: '',
      curRegion: [],
      timeMode: 1,
      regionsList: [],
      params: {},
      daysRangeList: [],
      toolTipClass: 'page-login-toolTipClass',
      tooltipClass: 'tooltip-class',
      lang: this.$i18n.locale,
      storeDataList: [],
      exportPng: require('../../../static/img/excel.png'),
      regionsOptions: null,
      regionsPerArray: [],
      resultLegend: [
        {
          'type': this.$t('overview.danger'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.improve'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.echartGood'),
          'percent': '0%'
        },
        {
          'type': this.$t('overview.excellent'),
          'percent': '0%'
        }
      ],
      regionsChartsOptions: null,
      regionInfoData: [
        {
          'prop': 'region',
          'label': this.$t('overview.regionName'),
          'sortable': false,
          'pdfwidth': '22%',
          'pdfmaxWidth': '22%',
          'width': '284',
          'maxWidth': '284'
        },
        {
          'prop': 'cycleOfInspect',
          'label': this.$t('overview.advPatrolCycle'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '14%',
          'width': '160',
          'maxWidth': '190'
        },
        {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'numOfQualified',
          'label': this.$t('overview.echartGood'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'numOfImproved',
          'label': this.$t('overview.improve'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'numOfDangerous',
          'label': this.$t('overview.danger'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'pdfmaxWidth': '12%',
          'width': '160',
          'maxWidth': '160'
        },
        {
          'prop': 'qualifiedRateStr',
          'label': this.$t('overview.passRate'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'pdfmaxWidth': '14%',
          'width': '217',
          'maxWidth': '180'
        },
        {
          'prop': 'averageScore',
          'label': this.$t('overview.averageScore'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'pdfmaxWidth': '14%',
          'width': '217',
          'maxWidth': '180'
        }
      ],
      regionTableData: [],
      regionPDFData: [],
      totalRegion: 0,
      pageRegion: 1,
      sizeNumRegion: 10,
      storeInfoData: [
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'region',
          'label': this.$t('overview.storeName'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'pdfwidth': '15%',
          'width': '120',
          'maxWidth': '120'
        },
        {
          'prop': 'cycleOfInspect',
          'label': this.$t('overview.advPatrolCycle'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'width': '160',
          'maxWidth': '190'
        },
        {
          'prop': 'numOfReport',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfwidth': '14%',
          'width': '150',
          'maxWidth': '150'
        },
        {
          'prop': 'numOfQualified',
          'label': this.$t('overview.echartGood'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '100',
          'maxWidth': '100'
        },
        {
          'prop': 'numOfImproved',
          'label': this.$t('overview.improve'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '110',
          'maxWidth': '110'
        },
        {
          'prop': 'numOfDangerous',
          'label': this.$t('overview.danger'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '130',
          'maxWidth': '130'
        },
        {
          'prop': 'qualifiedRateStr',
          'label': this.$t('overview.passRate'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '140',
          'maxWidth': '140'
        },
        {
          'prop': 'averageScore',
          'label': this.$t('overview.averageScore'),
          'sortable': 'custom',
          'pdfwidth': '12%',
          'width': '110',
          'maxWidth': '110'
        }
      ],
      storeTableData: [],
      storePDFData: [],
      totalStore: 0,
      pageStore: 1,
      sizeNumStore: 10,
      curRegionArray: [],
      exportDataHeader:
      [
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('overview.storeName'),
        this.$t('remotePatrol.code'),
        this.$t('overview.advPatrolCycle'),
        this.$t('overview.numOfEvaluations'),
        this.$t('overview.echartGood'),
        this.$t('overview.improve'),
        this.$t('overview.danger'),
        this.$t('overview.passRate'),
        this.$t('overview.averageScore')
      ],
      exportRegionHeader:
      [
        this.$t('overview.regionName'),
        this.$t('overview.advPatrolCycle'),
        this.$t('overview.numOfEvaluations'),
        this.$t('overview.echartGood'),
        this.$t('overview.improve'),
        this.$t('overview.danger'),
        this.$t('overview.passRate'),
        this.$t('overview.averageScore')
      ],
      regionParams: {},
      chartParams: {},
      chartArrayData: [],
      echartBackground: 'rgba(30,34,52,0.75)',
      echartColor: '#7d8cab',
      regionDataList: [],
      echartAxiasColor: '#e3e9f4',
      headerClass: 'header-class',
      cellClass: 'cell-class',
      rowClass: 'row-class',
      regionFilter: { 'page': 0, 'size': 10 },
      regionOrder: { 'direction': 'asc', 'property': 'qualifiedRate' },
      storeFilter: { 'page': 0, 'size': 10 },
      storeOrder: { 'direction': 'asc', 'property': 'qualifiedRate' },
      fontFamily: 'Roboto, Microsoft YaHei',
      ispdf: false,
      regionMode: 2,
      ifSaveParams: false,
      defaultSort: {prop: 'qualifiedRateStr', order: 'ascending'}
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      if (val !== 0) {
        await this.initData();
      }
    }
  },

  async created() {
    await this.initData();
  },

  beforeDestroy() {
    this.$refs.itemsPie && this.$refs.itemsPie.dispose();
    this.$refs.storeChart && this.$refs.storeChart.dispose();
  },

  methods: {
    handleExportReport() {
      const self = this;
      self.ispdf = true;
      require.ensure([], async() => {
        if (self.totalRegion > 0) {
          const size = self.totalRegion;
          const params = {};
          params.beginTs = self.params.beginTs;
          params.endTs = self.params.endTs;
          params.filter = { 'page': 0, 'size': size };
          params.order = self.regionOrder;
          params.regionMode = self.regionMode;
          params.storeIds = self.params.storeIds;
          params.inspectTagId = self.params.inspectId;
          const regionResult = await self.getInspectStatsOverviewWithRegion(params);
          if (regionResult.errCode === 0) {
            const result = regionResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRateStr = item.qualifiedRate + '%';
              });
              self.regionPDFData = result.content;
            }
          }
        }
        if (self.totalStore > 0) {
          const storesize = self.totalStore;
          const storeparams = {};
          storeparams.beginTs = self.params.beginTs;
          storeparams.endTs = self.params.endTs;
          storeparams.regionMode = 3;
          storeparams.storeIds = self.params.storeIds;
          storeparams.inspectTagId = self.params.inspectId;
          storeparams.filter = {
            'page': 0,
            'size': storesize
          };
          storeparams.order = self.storeOrder;

          const storeResult = await self.getInspectStatsOverviewWithRegion(storeparams);
          if (storeResult.errCode === 0) {
            const result = storeResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRateStr = item.qualifiedRate + '%';
              });
              self.storePDFData = result.content;
            }
          }
        }
      });
      setTimeout(() => {
        self.getPdf();
        if (sessionStorage.getItem('startPDF') === 'start') {
          sessionStorage.removeItem('startPDF', 'start');
          if (sessionStorage.getItem('endPDF') === 'end') {
            sessionStorage.removeItem('endPDF', 'end');
            setTimeout(() => {
              self.ispdf = false;
            }, 1000);
          }
        }
      }, 1000);
    },

    async searchData() {
      const self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      await self.getInspectStatsOverviewOfRegion();
      await self.getInspectStatsOverviewOfStore();
      await self.getInspectStatsLine();
    },

    async export2Excel() {
      const that = this;
      if (that.regionTableData.length === 0) {
        util.notify(that.$t('overview.emptyRegionList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportRegionHeader;
        const filterVal = ['region', 'cycleOfInspect', 'numOfReport', 'numOfQualified', 'numOfImproved',
          'numOfDangerous', 'qualifiedRateStr', 'averageScore'];
        const self = this;
        const size = self.totalRegion;
        const params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.filter = { 'page': 0, 'size': size };
        params.order = self.regionOrder;
        params.storeIds = self.params.storeIds;
        params.regionMode = self.regionMode;
        params.inspectTagId = self.params.inspectId;
        const regionResult = await that.getInspectStatsOverviewWithRegion(params);
        let curData = [];
        if (regionResult.errCode === 0) {
          const result = regionResult.data;
          if (result) {
            result.content.forEach(item => {
              item.qualifiedRateStr = item.qualifiedRate + '%';
            });
            curData = result.content;
          }
        }

        const data = that.formatJson(filterVal, curData);
        const fileName = 'Area' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    async exportStore2Excel() {
      const that = this;
      if (that.storeTableData.length === 0) {
        util.notify(that.$t('overview.emptyStoreList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportDataHeader;
        const filterVal = ['province', 'city', 'region', 'code', 'cycleOfInspect', 'numOfReport', 'numOfQualified', 'numOfImproved',
          'numOfDangerous', 'qualifiedRateStr', 'averageScore'];
        const self = this;
        const size = self.totalStore;
        const params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.regionMode = 3;
        params.storeIds = self.params.storeIds;
        params.inspectTagId = self.params.inspectId;
        params.filter = {
          'page': 0,
          'size': size
        };
        params.order = self.storeOrder;

        const storeResult = await that.getInspectStatsOverviewWithRegion(params);
        let curData = [];
        if (storeResult.errCode === 0) {
          const result = storeResult.data;
          if (result) {
            result.content.forEach(item => {
              item.qualifiedRateStr = item.qualifiedRate + '%';
            });
            curData = result.content;
          }
        }
        const data = that.formatJson(filterVal, curData);
        const name = self.params.inspectId==='' ? 'Store' : self.storePatrolLists;
        const fileName = name + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    getInspectStatsOverviewWithRegion(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverviewWithRegionV2(params).then(res => {
          resolve(res);
        })
          .catch(err => {
            reject(err);
          });
      });
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

    async getInspectStatsLine() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.region = this.regionMode;
      params.timeMode = self.timeMode;
      params.inspectId = self.params.inspectId;
      try {
        const regionResult = await self.getInspectResultOverRegion(params);
        const option = self.getInspectLineOption();
        if (regionResult.errCode === 0) {
          const result = regionResult.data;
          let sortedProviceOrCity = [];
          sortedProviceOrCity = this.regionMode === 1 ? JSON.parse(JSON.stringify(self.curRegionI))
            : JSON.parse(JSON.stringify(self.curRegionII));
          const filterResult = self.jsonArrayHasSpecifiedValue(sortedProviceOrCity, result);
          self.regionDataList = filterResult;
          const regionArray = [];
          filterResult[0].regions.forEach(item => {
            const json = {};
            json.label = item.region;
            json.value = item.region;
            json.disabled = false;
            regionArray.push(json);
          });
          self.regionsList = regionArray;
          self.curRegion = [];
          self.regionsList.length > 0 ? self.curRegion.push(self.regionsList[0].value) : self.curRegion;
          self.regionsList.length > 1 ? self.curRegion.push(self.regionsList[1].value) : self.curRegion;
          const filterTwoResult = self.jsonArrayHasSpecifiedValue(self.curRegion, filterResult);

          const regionData1 = [];
          const regionData2 = [];
          filterTwoResult.forEach((item) => {
            const filterRegions = item.regions;
            filterRegions.forEach((_item, _index) => {
              let sumOfReports = 0;
              let sunOfExcellent = 0;
              let sumOfQualified = 0;
              let percentRegion = 0;
              sunOfExcellent += _item.numOfExcellent;
              sumOfQualified += _item.numOfQualified;
              sumOfReports += _item.numOfExcellent + _item.numOfQualified + _item.numOfImproved + _item.numOfDangerous;
              if (sumOfReports === 0) {
                percentRegion = 0;
              } else {
                const percent = (sunOfExcellent + sumOfQualified) / sumOfReports * 100;
                percentRegion = percent.toFixed(2);
              }
              if (_index === 0) {
                regionData1.push(percentRegion);
                option.series[0].name = _item.region;
              } else {
                regionData2.push(percentRegion);
                option.series[1].name = _item.region;
              }
            });
          });
          option.series[0].data = regionData1;
          option.series[1].data = regionData2;
        }
        self.regionsChartsOptions = option;
      } catch (e) {
        console.log('PatrolEvaluationStatistics-getInspectStatsLine:' + e);
      }
    },

    getInspectLineOption() {
      const option = {
        color: ['#f31d65', '#6097f4'],
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
        grid: {
          containLabel: true,
          top: '40',
          left: '25',
          right: '5',
          bottom: '32'
        },
        textStyle: {
          fontFamily: this.fontFamily
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: false
            }
          },
          padding: 5,
          textStyle: {
            align: 'left'
          },
          backgroundColor: this.echartBackground
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
          },
          data: this.daysRangeList
        },
        yAxis: [
          {
            type: 'value',
            name: this.$t('overview.passRate') + '(%)',
            minInterval: 10,
            max: 100,
            nameLocation: 'end',
            nameTextStyle: {
              align: 'left',
              padding: [0, 10]
            },

            splitLine: {
              show: true,
              lineStyle: {
                color: this.echartAxiasColor,
                width: 1
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              onZero: false,
              show: true,
              lineStyle: {
                color: 'this.echartAxiasColor'
              }
            },
            axisLabel: {
              show: true,
              fontStyle: 12,
              margin: 10,
              color: '#7d8cab'
            }
          },
          {
            type: 'value',
            max: 100,
            position: 'right',
            axisLabel: {
              show: false,
              interval: 'auto'
            },
            splitNumber: 20,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              onZero: false,
              show: true,
              lineStyle: {
                color: 'this.echartAxiasColor'
              }
            }
          }
        ],
        series: [
          {
            type: 'line',
            symbol: 'none',
            yAxisIndex: 0,
            smooth: true,
            name: '',
            data: []
          },
          {
            type: 'line',
            symbol: 'none',
            yAxisIndex: 1,
            smooth: true,
            name: '',
            data: []
          }
        ]
      };
      return option;
    },

    jsonArrayHasSpecifiedValue(specifiedValue, jsonArray) {
      const tempData = [];
      jsonArray.forEach(item => {
        const tempJson = {};
        tempJson.ts = item.ts;
        const tempRegions = [];
        const regions = item.regions;
        regions.sort((item1, item2) => {
          return item1.region < item2.region ? 1 : -1;
        });
        specifiedValue.forEach(_item => {
          regions.forEach(regionItem => {
            if (regionItem.region === _item) {
              tempRegions.push(regionItem);
            }
          });
        });
        tempJson.regions = tempRegions;
        tempData.push(tempJson);
      });
      return tempData;
    },

    async getInspectStatsOverviewOfRegion() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = self.regionMode;
      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      const storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        const result = storeResult.data;
        if (result) {
          self.totalRegion = result.totalElements;
          result.content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
          });
          self.regionTableData = result.content;
        }
      } else {
        util.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalRegion = 0;
        self.regionTableData = [];
      }
      self.getRegionPie();
    },

    async getInspectStatsOverviewOfRegionTable() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.filter = self.regionFilter;
      params.order = self.regionOrder;
      params.regionMode = self.regionMode;
      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      const storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        const result = storeResult.data;
        if (result) {
          result.content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
          });
          self.regionTableData = result.content;
        }
      } else {
        util.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalRegion = 0;
        self.regionTableData = [];
      }
    },

    async getInspectStatsOverviewOfStore() {
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.storeIds = self.params.storeIds;
      params.filter = self.storeFilter;
      params.order = self.storeOrder;
      params.inspectTagId = self.params.inspectId;
      const storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        const result = storeResult.data;
        if (result) {
          self.totalStore = result.totalElements;
          result.content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
          });
          self.storeTableData = result.content;
        }
      } else {
        util.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalStore = 0;
      }
    },

    async getRegionPie() {
      const self = this;
      let totalDargerous = 0;
      let totalImproved = 0;
      let totalQualified = 0;
      let totalReport = 0;
      const jsonArray = self.resultLegend.slice(0, 3);
      let seriesData = [];
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = self.regionMode;

      params.storeIds = self.params.storeIds;
      params.inspectTagId = self.params.inspectId;
      if (self.totalRegion > 0) {
        params.filter = { page: 0, size: self.totalRegion };
        const storeResult = await self.getInspectStatsOverviewWithRegion(params);
        if (storeResult.errCode === 0) {
          const result = storeResult.data;
          if (result) {
            result.content.forEach(item => {
              totalDargerous += item.numOfDangerous;
              totalImproved += item.numOfImproved;
              totalQualified += item.numOfQualified;
              totalReport += item.numOfReport;
            });
          }
          seriesData = [
            { value: totalDargerous, name: self.$t('overview.danger') },
            { value: totalImproved, name: self.$t('overview.improve') },
            { value: totalQualified, name: self.$t('overview.echartGood') }
          ];
          const totalArray = [totalDargerous, totalImproved, totalQualified];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        } else {
          util.notify(self.$t('overview.queryFail'), 'warning', 3000);
          const totalArray = [0, 0, 0, 0];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        }
      } else {
        const totalArray = [0, 0, 0, 0];
        jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
        jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
        jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
      }
      const pieOption = self.getRegionPieOption();
      pieOption.series[0].data = seriesData;
      self.regionsOptions = pieOption;
      self.regionsPerArray = jsonArray;
    },

    getRegionPieOption() {
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
            name: this.$t('overview.itemsAssessment'),
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
                  var colorList = ['#f31d65', '#ffd035', '#72a1f3'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      return pieOption;
    },

    handleRegionsChange(val) {
      const self = this;
      self.curRegion = val;
      const option = self.getInspectLineOption();
      const filterResult = self.jsonArrayHasSpecifiedValue(self.curRegion, self.regionDataList);

      const regionData1 = [];
      const regionData2 = [];
      filterResult.forEach((item, index) => {
        const filterRegions = item.regions;
        filterRegions.forEach((_item, _index) => {
          let sumOfReports = 0;
          let sunOfExcellent = 0;
          let sumOfQualified = 0;
          let percentRegion = 0;
          sunOfExcellent += _item.numOfExcellent;
          sumOfQualified += _item.numOfQualified;
          sumOfReports += _item.numOfExcellent + _item.numOfQualified + _item.numOfImproved + _item.numOfDangerous;
          if (sumOfReports === 0) {
            percentRegion = 0;
          } else {
            const percent = (sunOfExcellent + sumOfQualified) / sumOfReports * 100;
            percentRegion = percent.toFixed(2);
          }
          if (_index === 0) {
            regionData1.push(percentRegion);
            option.series[0].name = _item.region;
          } else {
            regionData2.push(percentRegion);
            option.series[1].name = _item.region;
          }
        });
      });
      option.series[0].data = regionData1;
      option.series[1].data = regionData2;
      self.regionsChartsOptions = option;
    },

    initData() {
      this.params.filter = { page: 0, size: this.sizeNumStore };
    },

    adjustChart() {
      this.$refs.itemsPie && this.$refs.itemsPie.resize();
      this.$refs.storeChart && this.$refs.storeChart.resize();
    },

    emitSearch(searchParams, dateRangeList, regionI, regionII, regionMode, storePatrolLists, storeStr, tagNameStr, timeMode) {
      this.params = searchParams;
      this.daysRangeList = dateRangeList;
      this.curRegionI = regionI;
      this.curRegionII = regionII;
      this.regionMode = regionMode;
      this.timeMode = timeMode;
      this.storePatrolLists = storePatrolLists;
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.ifSaveParams && this.$refs.inspectEvalutionSearch.saveSearchParams(searchParamsObj);
      this.ifSaveParams = true;
      this.searchData();
    },

    exportPdf(storeNameStr, storeTagStr) {
      this.isexportPDF = true;
      this.storeNameStr = storeNameStr;
      this.storeTagStr = storeTagStr;
      this.handleExportReport();
    },

    handleRegionPageAndSizeChange(pageObj) {
      const self = this;
      self.pageRegion = pageObj.page;
      self.sizeNumRegion = pageObj.size;
      self.regionFilter = { page: self.pageRegion - 1, size: self.sizeNumRegion };
      self.getInspectStatsOverviewOfRegionTable();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
    },

    handleRegionSortChange(order) {
      this.regionOrder = order;
      this.regionFilter = {
        page: this.pageRegion - 1,
        size: this.sizeNumRegion
      };
      this.getInspectStatsOverviewOfRegionTable();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
    },

    handleStorePageAndSizeChange(pageObj) {
      this.sizeNumStore = pageObj.size;
      this.pageStore = pageObj.page;
      this.storeFilter = { page: this.pageStore - 1, size: this.sizeNumStore };
      this.getInspectStatsOverviewOfStore();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
    },

    handleStoreSortChange(order) {
      this.storeOrder = order;
      this.storeFilter = {
        page: this.pageStore - 1,
        size: this.sizeNumStore
      };
      this.getInspectStatsOverviewOfStore();
      const searchParamsObj = {
        path: 'inspectEvalutionStatistics',
        params: this.params
      };
      this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
    },

    setDefaultSortAndPage(paramsObj){
      console.log(paramsObj)
      this.defaultSort = paramsObj.defaultSort;
      this.order = this.params.order = paramsObj.order;
      this.sizeNum = paramsObj.filter.size;
      this.page = paramsObj.filter.page + 1;
    },
  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";

  .statistics-container{
    .export-header{
      min-height: 100px;
      margin: 0 20px 20px 20px;
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

    .statistics-content{
      margin-left: calc(30/1920*100vw);
      margin-right: calc(30/1920*100vw);
    }

    .region-chart{
      background-color: #fff;
      margin-right: calc(30/1920*100vw);
      border: 1px solid $border;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .evalution-pct {
        .pct-content {
          padding-top: 90px;
          padding-bottom: 25px;
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
            /*margin-left: calc(75 / 1920 * 100vw);*/
            font-size: calc(12 / 1920 * 100vw);
            display: flex;
            justify-content: center;
            @media screen and (max-width: 1280px) {
              padding: 0 0;
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
                }
                .label-desc {
                  color: $tab;
                  font-size: 12px;
                }
                .label-0 {
                  background-color: $dangerous;
                }
                .label-1 {
                  background-color: $improved;
                }
                .label-2 {
                  background-color: $pass;
                }
              }
            }
            .en-labels {
              @media screen and (max-width: 1280px) {
                padding: 0 calc(5 / 1920 * 100vw);
              }
            }
          }
        }
      }
      .charts-content{
        padding:0 calc(30/1920*100vw);
        .region-result-panel{
          height:260px;
        }
        .result-content{
          height: 100%;
          width: 100%;
        }
      }
    }
    .region-list{
      background-color: #fff;
      margin-top: 30px;
      border: 1px solid $border;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .region-header{
        border-bottom: 1px solid $border;
        margin-bottom: 30px;
      }
      .el-table-panel{
        margin-left: calc(30/1920*100vw);
        margin-right: calc(30/1920*100vw);
      }
    }
    .store-list{
      margin-top: 30px;
      border: 1px solid $border;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .region-header{
        border-bottom: 1px solid $border;
        margin-bottom: 30px;
      }
      .el-table-panel{
        margin-left: calc(30/1920*100vw);
        margin-right: calc(30/1920*100vw);
      }

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
      height:13%;
    }
  }
</style>
