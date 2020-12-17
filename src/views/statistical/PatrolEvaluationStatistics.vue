<template>
  <div>
    <el-row class="statistics-container">
      <el-col :span="24" class="statistics-header">
        <el-col :span="24" class="header-details">
          <span>{{$t('remotePatrol.storeSelect')}}</span>
          <el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" size="mini"
                     class="el-province" @change="changeCountry" @clear="clearCountry">
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
            :options="StoreTagList"
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
            <el-button :class="lang === 'en' ? 'en-search-btn' : 'search-btn' "
                       :disabled="storeDataList.length === 0"
                       style="vertical-align: middle;" size="mini" type="primary" @click="searchData">
              {{ $t('remotePatrol.search') }}
            </el-button>
            <el-button :class="lang === 'en'? 'en-search-btn':'search-btn' " style="vertical-align: middle;"
                       type="primary" size="mini" @click="handleExportReport()">
              <div class="btn-area">
                <i class="iconfont icon-pdf" style="font-size: calc(24/1920*100vw);vertical-align: middle;"/>
                <span style="font-size: calc(14/1920*100vw);margin:0 0 0 10px;vertical-align: middle;">{{ $t('remotePatrol.InspectionDetail') }}</span>
              </div>
            </el-button>
          </div>
        </el-col>
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
                  <v-chart ref="storeChart" :options="regionsChartsOptions" :auto-resize="true"
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
              <div class="exprotBtn">
                <el-button :class="lang=='en' ? 'en-export-btn':'export-btn'" type="primary" size="mini" @click="export2Excel" >
                  <div class="btn-area">
                    <img :src="exportPng" class="icon-excel">
                    <span class="spanClass">{{ $t('eventView.exportReport') }}</span>
                  </div>
                </el-button>
              </div>
            </div>
          </el-col>
          <div class="el-table-panel">
            <el-table
              ref="eltable"
              :data="regionTableData"
              :highlight-current-row="true"
              :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
              :header-cell-class-name="headerClass"
              :cell-class-name="cellClass"
              :row-class-name="rowClass"
              empty-text="无数据"
              align="left"
              stripe
              border
              style="width: 100%"
              size="mini"
              @sort-change="regionSortChange"
            >
              <el-table-column
                v-for="(_item,_index) in regionInfoData"
                :key="_index"
                :prop="_item.prop"
                :label="_item.label"
                :sortable="_item.sortable"
                :min-width="lang!=='en'? _item.width : _item.maxWidth"/>
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
              :current-page="pageRegion"
              :page-size="sizeNumRegion"
              :total="totalRegion"
              background
              small
              layout="jumper,total, prev, pager, next,sizes"
              @size-change="regionSizeChange"
              @current-change="regionCurrentChange"/>
          </div>
        </el-col>

        <el-col :sapn="24" class="store-list">
          <el-col :span="24" class="region-header header">
            <div class="region-titles">
              <span class="title">
                {{ $t('overview.storeList') }}
              </span>
              <div class="exprotBtn">
                <el-button :class="lang === 'en' ? 'en-export-btn' : 'export-btn'"
                           type="primary" size="mini" @click="exportStore2Excel" >
                  <div class="btn-area">
                    <img :src="exportPng" class="icon-excel">
                    <span class="spanClass">{{ $t('eventView.exportReport') }}</span>
                  </div>
                </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="el-table-panel">
              <el-table
                :data="storeTableData"
                :highlight-current-row="true"
                :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
                :header-cell-class-name="headerClass"
                :cell-class-name="cellClass"
                :row-class-name="rowClass"
                empty-text="无数据"
                align="left"
                stripe
                border
                style="width: 100%"
                size="mini"
                @sort-change="storeSortChange"
              >
                <el-table-column
                  v-for="(_item,_index) in storeInfoData"
                  :key="_index"
                  :prop="_item.prop"
                  :label="_item.label"
                  :sortable="_item.sortable"
                  :min-width="lang!=='en'? _item.width : _item.maxWidth"/>
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
          </el-col>
          <div class="toolbar pagination clearfix">
            <el-pagination
              :page-sizes="[10, 20, 50, 100]"
              :current-page="pageStore"
              :page-size="sizeNumStore"
              :total="totalStore"
              background
              small
              layout="jumper,total, prev, pager, next,sizes"
              @size-change="storeSizeChange"
              @current-change="storeCurrentChange"/>
          </div>
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
            <el-table
              ref="eltable"
              :data="regionPDFData"
              :highlight-current-row="true"
              :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
              :header-cell-class-name="headerClass"
              :cell-class-name="cellClass"
              :row-class-name="rowClass"
              empty-text="无数据"
              align="left"
              stripe
              border
              style="width: 100%"
              size="mini"
              @sort-change="regionSortChange"
            >
              <el-table-column
                v-for="(_item,_index) in regionInfoData"
                :key="_index"
                :prop="_item.prop"
                :label="_item.label"
                :sortable="_item.sortable"
                :min-width="lang!=='en'? _item.pdfwidth : _item.pdfmaxWidth"/>
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
              <el-table
                :data="storePDFData"
                :highlight-current-row="true"
                :default-sort = "{prop: 'qualifiedRatePer', order: 'ascending'}"
                :header-cell-class-name="headerClass"
                :cell-class-name="cellClass"
                :row-class-name="rowClass"
                empty-text="无数据"
                align="left"
                stripe
                border
                style="width: 100%"
                size="mini"
                @sort-change="storeSortChange"
              >
                <el-table-column
                  v-for="(_item,_index) in storeInfoData"
                  :key="_index"
                  :prop="_item.prop"
                  :label="_item.label"
                  :sortable="_item.sortable"
                  :min-width="lang!=='en'? _item.pdfwidth : _item.pdfmaxWidth"/>
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
          </el-col>

        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>

import { getStoreList, getBriefStoreList, GetTagList } from '@/api/store';
import { mapGetters } from 'vuex';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import LimitSelect from '@/components/LimitSelect';
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
import {
  getInspectStatsOverRegion,
  getInspectStatsOverviewWithRegionV2
} from '@/api/inspectOverview';

export default {
  name: 'PatrolEvaluationSta',

  components: {
    MultiSelect,
    'v-chart': ECharts,
    RegionMultiSelect,
    LimitSelect
  },

  data() {
    return {
      htmlTitle: this.$t('overview.htmltopdfA'),
      isexportPDF: false,
      curCountry: '',
      curStoreTag: [],
      StoreTagList: [],
      countryList: [],
      curProvince: [],
      provinceList: [],
      curCity: [],
      cityList: [],
      curStore: [],
      storeList: [],
      paramsStoreIds: [],
      curRegionI: [],
      curRegionII: [],
      storeNameStr: '',
      storeTagStr: '',
      storeDateValue: '',
      curRegion: [],
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      timeMode: 1,
      regionsList: [],
      params: {},
      daysRangeList: [],
      toolTipClass: 'page-login-toolTipClass',
      tooltipClass: 'tooltip-class',
      lang: this.$i18n.locale,
      showStoreInfo: false,
      poperClass: 'date-picker-poper',
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
          'maxWidth': '180'
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
          'prop': 'qualifiedRatePer',
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
          'prop': 'region',
          'label': this.$t('overview.storeName'),
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
          'maxWidth': '180'
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
          'prop': 'qualifiedRatePer',
          'label': this.$t('overview.passRate'),
          'sortable': 'custom',
          'pdfwidth': '16%',
          'pdfmaxWidth': '14%',
          'width': '219',
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
      storeTableData: [],
      storePDFData: [],
      totalStore: 0,
      pageStore: 1,
      sizeNumStore: 10,
      curRegionArray: [],
      exportDataHeader:
      [
        this.$t('overview.storeName'),
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
      sidebarElm: null,
      fontFamily: 'Roboto, Microsoft YaHei',
      ispdf: false
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      let self = this;
      if (val !== 0) {
        let self = this;
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initDaysRange();
        await self.initData();
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
    self.initDaysRange();
    await self.initData();
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
    self.$refs.itemsPie && self.$refs.itemsPie.dispose();
    self.$refs.storeChart && self.$refs.storeChart.dispose();
  },

  methods: {
    handleExportReport() {
      let self = this;
      self.ispdf = true;
      require.ensure([], async() => {
        if (self.totalRegion > 0) {
          let size = self.totalRegion;
          let params = {};
          params.beginTs = self.params.beginTs;
          params.endTs = self.params.endTs;
          params.filter = { 'page': 0, 'size': size };
          params.order = self.regionOrder;
          let region = 1;
          if (self.curCity.length > 0) {
            region = 2;
          } else {
            region = 1;
          }
          params.regionMode = region;
          params.storeIds = self.params.storeIds;
          let regionResult = await self.getInspectStatsOverviewWithRegion(params);
          if (regionResult.errCode === 0) {
            let result = regionResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRatePer = item.qualifiedRate + '%';
              });
              self.regionPDFData = result.content;
            }
          }
        }
        if (self.totalStore > 0) {
          let storesize = self.totalStore;
          let storeparams = {};
          storeparams.beginTs = self.params.beginTs;
          storeparams.endTs = self.params.endTs;
          storeparams.regionMode = 3;
          storeparams.storeIds = self.params.storeIds;
          storeparams.filter = {
            'page': 0,
            'size': storesize
          };
          storeparams.order = self.storeOrder;

          let storeResult = await self.getInspectStatsOverviewWithRegion(storeparams);
          if (storeResult.errCode === 0) {
            let result = storeResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRatePer = item.qualifiedRate + '%';
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

    regionSortChange(col) {
      let self = this;
      let column = col.column;
      let order = col.order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        self.regionOrder = {
          'direction': 'asc',
          'property': col.column.property === 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        self.regionOrder = {
          'direction': 'desc',
          'property': col.column.property === 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.regionOrder = { 'direction': 'asc', 'property': 'qualifiedRate' };
      }
      self.regionFilter = {
        page: self.pageRegion - 1,
        size: self.sizeNumRegion
      };
      self.getInspectStatsOverviewOfRegionTable();
    },

    regionSizeChange(val) {
      let self = this;
      self.sizeNumRegion = val;
      self.pageRegion = 1;
      self.regionFilter = { page: self.pageRegion - 1, size: val };
      self.getInspectStatsOverviewOfRegionTable();
    },

    regionCurrentChange(val) {
      let self = this;
      self.pageRegion = val;
      self.regionFilter = { page: val - 1, size: self.sizeNumRegion };
      self.getInspectStatsOverviewOfRegionTable();
    },

    storeSortChange(col) {
      let self = this;
      let column = col.column;
      let order = col.order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        self.storeOrder = {
          'direction': 'asc',
          'property': col.column.property === 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        self.storeOrder = {
          'direction': 'desc',
          'property': col.column.property === 'qualifiedRatePer' ? 'qualifiedRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.storeOrder = { 'direction': 'asc', 'property': 'qualifiedRate' };
      }
      self.storeFilter = {
        page: self.pageStore - 1,
        size: self.sizeNumStore
      };
      self.getInspectStatsOverviewOfStore();
    },

    storeSizeChange(val) {
      let self = this;
      self.sizeNumStore = val;
      self.pageStore = 1;
      self.storeFilter = { page: self.pageStore - 1, size: val };
      self.getInspectStatsOverviewOfStore();
    },

    storeCurrentChange(val) {
      let self = this;
      self.pageStore = val;
      self.storeFilter = { page: val - 1, size: self.sizeNumStore };
      self.getInspectStatsOverviewOfStore();
    },

    dateChange(val) {
      let self = this;
      self.currentIndex = 0;
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
      self.params.beginTs = start;
      self.params.endTs = end;
      self.initDaysRange();
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
        let monthArray = util.getMonthBetween(startDay, endDay);
        self.daysRangeList = monthArray;
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

    getStoreData(params) {
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(res => {
          reject(res);
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
              if(item.tagIds.length!==0){
                self.curStoreTag.forEach(v_item => {
                  item.tagIds.forEach(t_item => {
                    if ( (t_item === v_item && self.curCountry === item.country) || (t_item === v_item && self.curCountry === '-1') ) {
                      storeIds.push(_item);
                      NameStr += item.name + isuu;
                    }
                    self.StoreTagList.forEach(r_item => {
                      if (r_item.value === v_item) {
                        TagStr.indexOf(r_item.label) === -1 ? TagStr += r_item.label + '，' : null;
                      }
                    });
                  });
                });
              }
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
      if (self.curProvince.length !== 0) {
        self.curRegionI = self.curProvince;
        self.curRegionII = self.curCity;
      } else {
        let rI = [], rII = [];
        self.storeList.forEach((item, index) => {
          self.paramsStoreIds.forEach(_item => {
            if (item.storeId === _item) {
              rI.some(x => x === item.province) ? null : rI.push(item.province);
              rII.some(x => x === item.city) ? null : rII.push(item.city);
            }
          });
          self.curRegionI = rI;
          self.curRegionII = rII;
        });
      }
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
              let obj = {};
              obj.value = item.tagId;
              obj.label = item.tagName;
              obj.disabled = false;
              self.StoreTagList.push(obj);
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
      let temp = [];
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

    clearCountry() {
      let self = this;
      self.curProvince = [];
      self.curCity = [];
      self.clearStoreInfo();

      let storeList = self.storeList;
      let tempStore = [];
      storeList.forEach(item => {
        let obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
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
            let obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              tagIds: item.tagIds
            };
            tempStore.push(obj);
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

    cleaPro() {
      let self = this;
      self.curCity = [];
      self.clearStoreInfo();
      let storeList = self.storeList;
      let temp = [];
      let tempStore = [];
      storeList.forEach(item => {
        if (item.country === self.curCountry) {
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
      self.storeDataList = tempStore;
    },

    changeCity(val) {
      let self = this;
      self.clearStoreInfo();
      let storeList = self.storeList;
      let temp = [];
      if (val.length !== 0) {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.city === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                let obj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name,
                  userId: item.userId,
                  userName: item.userName
                };
                temp.push(obj);
              }
            }
          });
        });
      }
      self.storeDataList = temp;
      let str = '', storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });
      self.curStore = storeArr;
      self.changeStore(self.curStore);
    },

    clearCity() {
      let self = this;
      self.clearStoreInfo();

      let storeList = self.storeList;
      let tempStore = [];
      storeList.forEach(item => {
        if (item.province === self.curProvince) {
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
      self.storeDataList = tempStore;
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

    clearStoreInfo() {
      let self = this;
      self.curStore = [];
      self.paramsStoreIds = [];
      self.$refs.multiSelect.selectedArray = [];
      self.$refs.multiSelect.input = '';
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    async searchData() {
      let self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      self.params.storeIds = self.paramsStoreIds;
      await self.getInspectStatsOverviewOfRegion();
      await self.getInspectStatsOverviewOfStore();
      await self.getInspectStatsLine();
    },

    async export2Excel() {
      let that = this;
      if (that.regionTableData.length === 0) {
        that.$message({
          message: that.$t('overview.emptyRegionList'),
          type: 'warning'
        });
        return false;
      }
      require.ensure([], async() => {
        let { export_json_to_excel } = require('@/excel/Export2Excel');
        let tHeader = that.exportRegionHeader;
        let filterVal = ['region', 'cycleOfInspect', 'numOfReport', 'numOfQualified', 'numOfImproved',
          'numOfDangerous', 'qualifiedRatePer', 'averageScore'];
        let self = this;
        let size = self.totalRegion;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.filter = { 'page': 0, 'size': size };
        params.order = self.regionOrder;
        let region = 1;
        if (self.curCity.length > 0) {
          region = 2;
        } else {
          region = 1;
        }
        params.regionMode = region;
        params.storeIds = self.params.storeIds;
        let regionResult = await that.getInspectStatsOverviewWithRegion(params);
        let curData = [];
        if (regionResult.errCode === 0) {
          let result = regionResult.data;
          if (result) {
            result.content.forEach(item => {
              item.qualifiedRatePer = item.qualifiedRate + '%';
            });
            curData = result.content;
          }
        }

        let data = that.formatJson(filterVal, curData);
        let fileName = 'Area' + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    async exportStore2Excel() {
      let that = this;
      if (that.storeTableData.length === 0) {
        that.$message({
          message: that.$t('overview.emptyStoreList'),
          type: 'warning'
        });
        return false;
      }
      require.ensure([], async() => {
        let { export_json_to_excel } = require('@/excel/Export2Excel');
        let tHeader = that.exportDataHeader;
        let filterVal = ['region', 'cycleOfInspect', 'numOfReport', 'numOfQualified', 'numOfImproved',
          'numOfDangerous', 'qualifiedRatePer', 'averageScore'];
        let self = this;
        let size = self.totalStore;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.regionMode = 3;
        params.storeIds = self.params.storeIds;
        params.filter = {
          'page': 0,
          'size': size
        };
        params.order = self.storeOrder;

        let storeResult = await that.getInspectStatsOverviewWithRegion(params);
        let curData = [];
        if (storeResult.errCode === 0) {
          let result = storeResult.data;
          if (result) {
            result.content.forEach(item => {
              item.qualifiedRatePer = item.qualifiedRate + '%';
            });
            curData = result.content;
          }
        }
        let data = that.formatJson(filterVal, curData);
        let fileName = 'Store' + '-' + util.getCurDateStr();
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
          reject(err)
        });
      });
    },

    getInspectResultOverRegion(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverRegion(params).then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        });
      });
    },

    async getInspectStatsLine() {
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      let region = 1;
      if (self.curCity.length > 0) {
        region = 2;
      } else {
        region = 1;
      }
      params.region = region;
      params.timeMode = self.timeMode;
      try {
        let regionResult = await self.getInspectResultOverRegion(params);
        let option = self.getInspectLineOption();
        if (regionResult.errCode === 0) {
          let result = regionResult.data;
          let sortedProviceOrCity = [];
          sortedProviceOrCity = region === 1 ? JSON.parse(JSON.stringify(self.curRegionI)) : JSON.parse(JSON.stringify(self.curRegionII));
          let filterResult = self.jsonArrayHasSpecifiedValue(sortedProviceOrCity, result);
          self.regionDataList = filterResult;
          let regionArray = [];
          filterResult[0].regions.forEach(item => {
            let json = {};
            json.label = item.region;
            json.value = item.region;
            json.disabled = false;
            regionArray.push(json);
          });
          self.regionsList = regionArray;
          self.curRegion = [];
          self.regionsList.length > 0 ? self.curRegion.push(self.regionsList[0].value) : self.curRegion;
          self.regionsList.length > 1 ? self.curRegion.push(self.regionsList[1].value) : self.curRegion;
          let filterTwoResult = self.jsonArrayHasSpecifiedValue(self.curRegion, filterResult);

          let regionData1 = [];
          let regionData2 = [];
          filterTwoResult.forEach((item, index) => {
            let filterRegions = item.regions;
            filterRegions.forEach((_item, _index) => {
              let sumOfReports = 0;
              let sunOfExcellent = 0;
              let sumOfQualified = 0;
              let percentRegion = 0;
              sunOfExcellent += _item.numOfExcellent;
              sumOfQualified += _item.numOfQualified;
              sumOfReports += +_item.numOfQualified + _item.numOfDangerous;
              if (sumOfReports === 0) {
                percentRegion = 0;
              } else {
                let percent = (sunOfExcellent + sumOfQualified) / sumOfReports * 100;
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
      }catch (e) {
        console.log("PatrolEvaluationStatistics-getInspectStatsLine:" + e);
      }
    },

    getInspectLineOption(){
      let option = {
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
      let tempData = [];
      jsonArray.forEach(item => {
        let tempJson = {};
        tempJson.ts = item.ts;
        let tempRegions = [];
        let regions = item.regions;
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
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      let region = 1;
      if (self.curCity.length > 0) {
        region = 2;
      } else {
        region = 1;
      }
      params.regionMode = region;
      params.storeIds = self.params.storeIds;
      let storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        let result = storeResult.data;
        if (result) {
          self.totalRegion = result.totalElements;
          result.content.forEach(item => {
            item.qualifiedRatePer = item.qualifiedRate + '%';
          });
          self.regionTableData = result.content;
        }
      } else {
        self.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalRegion = 0;
        self.regionTableData = [];
      }
      self.getRegionPie();
    },

    async getInspectStatsOverviewOfRegionTable() {
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.filter = self.regionFilter;
      params.order = self.regionOrder;
      let region = 1;
      if (self.curCity.length > 0) {
        region = 2;
      } else {
        region = 1;
      }
      params.regionMode = region;
      params.storeIds = self.params.storeIds;
      let storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        let result = storeResult.data;
        if (result) {
          result.content.forEach(item => {
            item.qualifiedRatePer = item.qualifiedRate + '%';
          });
          self.regionTableData = result.content;
        }
      } else {
        self.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalRegion = 0;
        self.regionTableData = [];
      }
    },

    async getInspectStatsOverviewOfStore() {
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.regionMode = 3;
      params.storeIds = self.params.storeIds;
      params.filter = self.storeFilter;
      params.order = self.storeOrder;
      let storeResult = await self.getInspectStatsOverviewWithRegion(params);
      if (storeResult.errCode === 0) {
        let result = storeResult.data;
        if (result) {
          self.totalStore = result.totalElements;
          result.content.forEach(item => {
            item.qualifiedRatePer = item.qualifiedRate + '%';
          });
          self.storeTableData = result.content;
        }
      } else {
        self.notify(self.$t('overview.queryFail'), 'warning', 3000);
        self.totalStore = 0;
      }
    },

    async getRegionPie() {
      let self = this;
      let totalDargerous = 0;
      let totalImproved = 0;
      let totalQualified = 0;
      let totalReport = 0;
      let jsonArray = self.resultLegend.slice(0, 3);
      let seriesData = [];
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      let region = 1;
      if (self.curCity.length > 0) {
        region = 2;
      } else {
        region = 1;
      }
      params.regionMode = region;

      params.storeIds = self.params.storeIds;
      if (self.totalRegion > 0) {
        params.filter = { page: 0, size: self.totalRegion };
        let storeResult = await self.getInspectStatsOverviewWithRegion(params);
        if (storeResult.errCode === 0) {
          let result = storeResult.data;
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
          let totalArray = [totalDargerous, totalImproved, totalQualified];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        } else {
          self.notify(self.$t('overview.queryFail'), 'warning', 3000);
          let totalArray = [0, 0, 0, 0];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
        }
      } else {
        let totalArray = [0, 0, 0, 0];
        jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
        jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
        jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
      }
      let pieOption = self.getRegionPieOption();
      pieOption.series[0].data = seriesData;
      self.regionsOptions = pieOption
      self.regionsPerArray = jsonArray;
    },

    getRegionPieOption() {
      let pieOption = {
        tooltip: {
          trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
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
      let self = this;
      self.curRegion = val;
      let option = self.getInspectLineOption();
      let filterResult = self.jsonArrayHasSpecifiedValue(self.curRegion, self.regionDataList);

      let regionData1 = [];
      let regionData2 = [];
      filterResult.forEach((item, index) => {
        let filterRegions = item.regions;
        filterRegions.forEach((_item, _index) => {
          let sumOfReports = 0;
          let sunOfExcellent = 0;
          let sumOfQualified = 0;
          let percentRegion = 0;
          sunOfExcellent += _item.numOfExcellent;
          sumOfQualified += _item.numOfQualified;
          sumOfReports += _item.numOfQualified + _item.numOfDangerous;
          if (sumOfReports === 0) {
            percentRegion = 0;
          } else {
            let percent = (sunOfExcellent + sumOfQualified) / sumOfReports * 100;
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
      let self = this;
      let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
      let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
      self.params.beginTs = start;
      self.params.endTs = end;
      let storeIds = self.curStore.filter(item => item !== -1);
      self.params.storeIds = storeIds;
      self.params.filter = { page: 0, size: self.sizeNumStore };
      self.getCountryStore();
      self.getTagListData();
    },

    adjustChart() {
      let self = this;
      if (self.$refs.itemsPie) {
        self.$refs.itemsPie.resize();
      }
      if (self.$refs.storeChart) {
        self.$refs.storeChart.resize();
      }
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
