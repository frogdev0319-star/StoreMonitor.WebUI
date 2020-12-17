<template>
  <div>
    <div class="item-container">
      <el-col :span="24" class="statistics-header">
        <el-col :span="24" class="header-details">
          <span>{{ $t('remotePatrol.storeSelect') }}</span>
          <el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" size="mini"
                     class="el-province" @change="changeCountry">
            <el-option-group v-for="group in countryList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.countryList" :key="item.value" :label="item.label" :value="item.value"/>
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
            style="display: inline;"
            @changeInput="changeStoreTag"/>
          <span>{{ $t('overview.patrolLists') }}</span>
          <el-select v-model="inspectList" :placeholder="$t('insSettingView.selectPost')" size="mini"
                     class="el-province">
            <el-option
              v-for="item in inspectTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-col>
        <el-col :span="24" class="header-details">
          <span :class="lang== 'en'? 'en-span-class' : ''">{{ $t('remotePatrol.time') }}</span>
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
          <el-button :class="lang === 'en' ? 'en-search-btn' : 'search-btn' " :disabled="storeDataList.length === 0"
                     size="mini" type="primary" @click="searchData">{{ $t('remotePatrol.search') }}
          </el-button>
        </el-col>
      </el-col>
      <el-col :span="24" class="items-content">
        <el-col :span="24" class="contents-container">
          <el-col :span="24" class="items-row">
            <el-col :span="24" class="items-title">
              <span class="title">{{ $t('overview.itemChartReport') }}</span>
              <div class="exprotBtn">
                <el-button :class="lang==='en'? 'en-export-btn':'export-btn' " type="primary" size="mini"
                           style="margin-top:-15px;" @click="handleDown()">
                  <div class="btn-area">
                    <i class="iconfont icon-pdf"/>
                    <span class="spanClass">{{ $t('remotePatrol.InspectionDetail') }}</span>
                  </div>
                </el-button>
              </div>
            </el-col>
            <el-col :span="12" class="evalution-pct">
              <div class="title">{{ $t('overview.proportionOfInspectionItems') }}</div>
              <div class="pct-content">
                <div>
                  <div class="pct-panel">
                    <v-chart ref="itemsPie" :auto-resize="true" :options="itemsOptions" class="chart-content"/>
                  </div>
                  <div class="pct-nums">
                    <div
                      v-for="(item, index) in itemsPerArray"
                      :class="lang === 'en' ? 'en-labels' : ''"
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
              </div>

            </el-col>
            <el-col :span="12" class="evalution-pct">
              <div class="radar-title">
                {{ curType === 0? $t('overview.proportionOfRemote') : $t('overview.proportionOfOnsite') }}
              </div>
              <div class="inspect-catergy">
                <div class="rader-panel">
                  <div v-if="!hasNoData">
                    <v-chart ref="itemsRadar" :options="itemsRadarOption" :auto-resize="true"
                             class="radar-content"/>
                  </div>
                  <div v-else class="data-empty">
                    {{ $t('overview.noData') }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="items-table">
            <div class="exprotBtn">
              <el-button :class="lang=='en' ? 'en-export-btn':'export-btn'" type="primary" size="mini"
                         @click="export2Excel" >
                <div class="btn-area">
                  <img :src="exportPng" class="icon-excel">
                  <span class="spanClass">{{ $t('eventView.exportReport') }}</span>
                </div>
              </el-button>
            </div>
            <div class="table">
              <div class="el-table-panel">
                <el-table
                  :data="itemsTableData"
                  :highlight-current-row="true"
                  :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
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
                    v-for="(_item,_index) in itemsInfoData"
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
        </el-col>
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
    <div v-if="ispdf" class="item-container">
      <el-col id="pdfDom" :span="24" class="items-content" style="padding:40px 20px;">
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
        <el-col :span="24" class="contents-container" style="padding-bottom:20px;">
          <el-col :span="24" class="items-row">
            <el-col :span="24" class="items-title">
              <span class="title">{{ $t('overview.itemChartReport') }}</span>
            </el-col>
            <el-col :span="12" class="evalution-pct">
              <div class="title">{{ $t('overview.proportionOfInspectionItems') }}</div>
              <div class="pct-content">
                <div>
                  <div class="pct-panel">
                    <v-chart ref="itemsPie" :auto-resize="true" :options="itemsOptions" class="chart-content"/>
                  </div>
                  <div class="pct-nums">
                    <div
                      v-for="(item, index) in itemsPerArray"
                      :class="lang === 'en'? 'en-labels': ''"
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
              </div>
            </el-col>
            <el-col :span="12" class="evalution-pct">
              <div class="radar-title">
                {{ curType === 0 ? $t('overview.proportionOfRemote') : $t('overview.proportionOfOnsite') }}
              </div>
              <div class="inspect-catergy">
                <div class="rader-panel">
                  <div v-if="!hasNoData">
                    <v-chart ref="itemsRadar" :options="itemsRadarOption" :auto-resize="true" class="radar-content"/>
                  </div>
                  <div v-else class="data-empty">
                    {{ $t('overview.noData') }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="items-table">
            <div class="table">
              <div class="el-table-panel">
                <el-table
                  :data="PDFData"
                  :highlight-current-row="true"
                  :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
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
                    v-for="(_item,_index) in itemsInfoData"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="_item.pdfmaxWidth"/>
                  <div slot="empty">
                    <div>
                      <i class="iconfont icon-zhengque empty-data-icon"/>
                      <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{ $t('overview.noData') }}</span>
                    </div>
                  </div>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-col>
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
import { inpectRESTful } from '@/api/index';

import {
  getInspectStatsItemOverviewV2
} from '@/api/inspectOverview';

export default {
  name: 'InspectItemStatistics',

  components: {
    MultiSelect,
    'v-chart': ECharts,
    RegionMultiSelect
  },

  data() {
    return {
      storeNameStr: '',
      storeTagStr: '',
      storePatrolLists: '',
      storeDateValue: '',
      curCountry: '',
      paramsStoreIds: [],
      curStoreTag: [],
      StoreTagList: [],
      countryList: [],
      curProvince: [],
      provinceList: [],
      curCity: [],
      cityList: [],
      curStore: [],
      storeList: [],
      storeDataList: [],
      curRegion: [],
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      timeMode: 1,
      curType: 0,
      inspectTypeList: [],
      inspectList: '',
      showStoreInfo: false,
      params: {},
      poperClass: 'date-picker-poper',
      exportPng: require('../../../static/img/excel.png'),
      lang: this.$i18n.locale,
      itemsPerArray: [],
      itemsOptions: null,
      itemsLegend: [
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
      itemsRadarOption: null,
      echartBackground: 'rgba(30,34,52,0.75)',
      itemsTableData: [],
      PDFData: [],
      htmlTitle: this.$t('overview.htmltopdfB'),
      ispdf: false,
      itemsInfoData: [
        {
          'prop': 'inspectGroupName',
          'label': this.$t('overview.patrolCate'),
          'sortable': false,
          'pdfmaxWidth': '19%',
          'width': '280',
          'maxWidth': '280'
        },
        {
          'prop': 'inspectItemName',
          'label': this.$t('overview.items'),
          'sortable': 'custom',
          'pdfmaxWidth': '24%',
          'width': '380',
          'maxWidth': '380'
        },
        {
          'prop': 'numOfTotal',
          'label': this.$t('overview.numOfEvaluations'),
          'sortable': 'custom',
          'pdfmaxWidth': '14%',
          'width': '130',
          'maxWidth': '200'
        },
        {
          'prop': 'numOfQualified',
          'label': `${this.$t('overview.pass')}${this.$t('overview.timesUnit')}`,
          'sortable': 'custom',
          'pdfmaxWidth': '10%',
          'width': '130',
          'maxWidth': '150'
        },
        {
          'prop': 'numOfUnqualified',
          'label': `${this.$t('overview.failed')}${this.$t('overview.timesUnit')}`,
          'sortable': 'custom',
          'pdfmaxWidth': '10%',
          'width': '130',
          'maxWidth': '150'
        },
        {
          'prop': 'numOfIgnored',
          'label': `${this.$t('overview.ignored')}${this.$t('overview.timesUnit')}`,
          'sortable': 'custom',
          'pdfmaxWidth': '10%',
          'width': '130',
          'maxWidth': '150'
        },
        {
          'prop': 'qualifiedRateStr',
          'label': this.$t('overview.passRate'),
          'sortable': 'custom',
          'pdfmaxWidth': '12%',
          'width': '130',
          'maxWidth': '150'
        }
      ],
      total: 0,
      page: 1,
      sizeNum: 10,
      direction: 'asc',
      property: 'qualifiedRate',
      hasNoData: false,
      exportItmesHeader:
      [
        this.$t('overview.patrolCate'),
        this.$t('overview.items'),
        this.$t('overview.numOfEvaluations'),
        `${this.$t('overview.pass')}${this.$t('overview.timesUnit')}`,
        `${this.$t('overview.failed')}${this.$t('overview.timesUnit')}`,
        `${this.$t('overview.ignored')}${this.$t('overview.timesUnit')}`,
        this.$t('overview.passRate')
      ],
      headerClass: 'header-class',
      cellClass: 'cell-class',
      echartAxiasColor: '#e3e9f4',
      rowClass: 'row-class',
      fontFamily: 'Roboto, Microsoft YaHei',
      sidebarElm: null,
      AllStore: []
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      let self = this;
      if (val !==0) {
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        let start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        let end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        console.log(self.lang);
        self.initDaysRange();
        await self.initData();
        self.curStoreTag = [];
      }
    },

    numberOfElements(val, oldVal) {
      console.log(val);
      console.log(oldVal);
      let self = this;
      if (val === 0 && self.totalElements > 0) {
        self.params.filter.page -= 1;
        self.getEventList(self.params);
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
    self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar, false);
    self.$refs.itemsPie && self.$refs.itemsPie.dispose();
    self.$refs.itemsRadar && self.$refs.itemsRadar.dispose();
    self.adjustChart = null;
  },

  methods: {
    getTagAll() {
      let self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList().then(res => {
          let data = res.data;
          self.inspectTypeList = res.data;
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      });
    },

    handleDown() {
      let self = this;
      self.ispdf = true;
      if (self.total > 0) {
        require.ensure([], async() => {
          self.params.filter = {
            'page': 0,
            'size': self.total
          };
          let regionResult = await self.getInspectStatsItemInfo(self.params);
          if (regionResult.errCode === 0) {
            let result = regionResult.data;
            if (result) {
              result.content.forEach(item => {
                item.qualifiedRateStr = item.qualifiedRate + '%';
              });
              self.PDFData = result.content;
            }
          }
        });
      }
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

    sortChange(col) {
      console.log(col);
      let self = this;
      let order = col.order;
      self.order = order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        self.params.order = {
          'direction': 'asc',
          'property': col.column.property === 'qualifiedRateStr' ? 'qualifiedRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        self.params.order = {
          'direction': 'desc',
          'property': col.column.property === 'qualifiedRateStr' ? 'qualifiedRate' : col.column.property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.params.order = { 'direction': 'asc', 'property': 'qualifiedRate' };
      }
      self.params.filter = {
        page: self.page - 1,
        size: self.sizeNum
      };
      self.getInspectItemsTable();
    },

    sizeChange(val) {
      let self = this;
      self.sizeNum = val;
      self.page = 1;
      self.params.filter = { page: self.page - 1, size: val };
      self.getInspectItemsTable();
    },

    currentChange(val) {
      let self = this;
      self.page = val;
      self.params.filter = { page: val - 1, size: self.sizeNum };
      self.getInspectItemsTable();
    },

    async getCountryStore() {
      let self = this;
      let data = await self.getBriefStoreData();
      let temp = [];
      if (data.errCode === 0 && data.errMsg === 'Success') {
        self.storeList = data.data;
        if (self.storeList.length !==0) {
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
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    dateChange(val) {
      let self = this;
      console.log(val);
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
      console.log(self.timeMode);
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

    handleStoreChange(arr) {
      console.log(arr);
      this.curStore = arr;
      this.changeStore(arr);
    },

    handleProChange(arr) {
      console.log(arr);
      this.curProvince = arr;
      this.changePro(arr);
    },

    handleCityChange(arr) {
      console.log(arr);
      this.curCity = arr;
      this.changeCity(arr);
    },

    changeStore(val) {
      let self = this;
      self.inspectList = '';
      let nameStr = '', tagStr = '', storeIds = [];
      self.storeList.forEach((item) => {
        val.forEach((_item, _index) => {
          let isuu = _index === val.length - 1 ? '' : '，';
          if (item.storeId === _item) {
            if (self.curStoreTag.length !==0) {
              if(item.tagIds.length!==0){
                self.curStoreTag.forEach(v_item => {
                  item.tagIds.forEach(t_item => {
                    if ( (t_item === v_item && self.curCountry === item.country) || (t_item === v_item && self.curCountry === '-1') ) {
                      storeIds.push(_item);
                      nameStr += item.name + isuu;
                    }
                    self.StoreTagList.forEach(r_item => {
                      if (r_item.value === v_item) {
                        tagStr.indexOf(r_item.label) === -1 ? tagStr += r_item.label + '，' : null;
                      }
                    });
                  });
                });
              }
            } else {
              storeIds.push(_item);
              nameStr += item.name + isuu;
              tagStr = '--';
            }
          }
        });
      });
      self.paramsStoreIds = storeIds;
      self.storeNameStr = nameStr;
      self.storeTagStr = tagStr;
      let InspectArr = [];
      self.AllStore.data.content.forEach(item => {
        if (self.paramsStoreIds.indexOf(item.storeId) !==-1 && item.appliedInspect.length !==0) {
          InspectArr.push(item.appliedInspect);
        }
      });
      let newArr = [], InspectList = [];
      InspectArr.forEach(item => {
        item.forEach(_item => {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            InspectList.push(_item);
          }
        });
      });
      self.inspectTypeList = InspectList;
      if (InspectList.length !==0) {
        self.inspectList = InspectList[0].name;
      }
    },

    changePro(val) {
      console.log(val);
      let self = this;
      self.inspectList = '';
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
                tagIds: item.tagIds
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
      let InspectArr = [];
      self.AllStore.data.content.forEach(item => {
        if (storeArr.indexOf(item.storeId) !== -1 && item.appliedInspect.length !== 0) {
          InspectArr.push(item.appliedInspect);
        }
      });
      let newArr = [], InspectList = [];
      InspectArr.forEach(item => {
        item.forEach(_item => {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            InspectList.push(_item);
          }
        });
      });
      self.inspectTypeList = InspectList;
      if (InspectList.length !== 0) {
        self.inspectList = InspectList[0].name;
      }
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg&& errMsg === 'Success') {
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
      self.inspectList = '';
      self.curStoreTag = val;
      self.changeStore(self.curStore);
      let InspectArr = [];
      self.AllStore.data.content.forEach(item => {
        if (self.paramsStoreIds.indexOf(item.storeId) !== -1 && item.appliedInspect.length !== 0) {
          InspectArr.push(item.appliedInspect);
        }
      });
      let newArr = [], InspectList = [];
      InspectArr.forEach(item => {
        item.forEach(_item => {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            InspectList.push(_item);
          }
        });
      });
      self.inspectTypeList = InspectList;
      if (InspectList.length !== 0) {
        self.inspectList = InspectList[0].name;
      }
    },

    changeCountry(val) {
      let self = this;
      console.log(val);
      self.inspectList = '';
      self.curProvince = [];
      self.curCity = [];
      self.curStoreTag = [];
      let storeList = self.storeList;
      let tempStore = [];
      let temp = [];
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      self.selectAllProAndCity(val);
    },

    changeCity(val) {
      let self = this;
      self.clearStoreInfo();
      console.log(val);
      self.inspectList = '';
      let storeList = self.storeList;
      let temp = [];
      if (val.length === 0) {
        console.log(self.curProvince);
        self.curProvince.forEach(_item => {
          console.log(_item);

          storeList.forEach(item => {
            console.log(item);
            if (item.province === _item) {
              let obj = {};
              obj.storeId = item.storeId;
              obj.label = item.name;
              obj.value = item.name;
              obj.userId = item.userId;
              obj.tagIds = item.tagIds;
              temp.push(obj);
            }
          });
        });
      } else {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.city === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                let obj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name,
                  userId: item.userId,
                  tagIds: item.tagIds
                };
                temp.push(obj);
              }
            }
          });
        });
      }
      console.log(temp);
      self.storeDataList = temp;
      let storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });
      self.curStore = storeArr;
      self.changeStore(self.curStore);
      let InspectArr = [];
      self.AllStore.data.content.forEach(item => {
        if (storeArr.indexOf(item.storeId) !== -1 && item.appliedInspect.length !== 0) {
          InspectArr.push(item.appliedInspect);
        }
      });
      let newArr = [], InspectList = [];
      InspectArr.forEach(item => {
        item.forEach(_item => {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            InspectList.push(_item);
          }
        });
      });
      self.inspectTypeList = InspectList;
      if (InspectList.length !== 0) {
        self.inspectList = InspectList[0].name;
      }
    },

    clearStoreInfo() {
      let self = this;
      self.curStore = [];
      self.paramsStoreIds = [];
      self.$refs.multiSelect.selectedArray = [];
      self.$refs.multiSelect.input = '';
    },

    async searchData() {
      let self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      self.params.storeIds = self.paramsStoreIds;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.params.order = { direction: self.direction, property: self.property };
      self.params.mode = self.curType;
      self.inspectTypeList.forEach(item => {
        if (self.inspectList === item.name) {
          self.params.inspectId = self.inspectList = item.id;
          self.storePatrolLists = item.name;
        } else {
          self.params.inspectId = self.inspectList;
        }
      });
      await self.getInspectItemsTable();
    },

    async selectAllProAndCity(val) {
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
            tagIds: item.tagIds
          };
          tempStore.push(obj);
        }
      });
      self.provinceList = temp;
      console.log(self.provinceList);
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
      let params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      self.AllStore = await self.getStoreData(params);
      let InspectArr = [];
      self.AllStore.data.content.forEach(item => {
        if (self.curStore.indexOf(item.storeId) !== -1 && item.appliedInspect.length !== 0) {
          InspectArr.push(item.appliedInspect);
        }
      });
      let newArr = [], InspectList = [];
      InspectArr.forEach(item => {
        item.forEach(_item => {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            InspectList.push(_item);
          }
        });
      });
      self.inspectTypeList = InspectList;
      if (InspectList.length !== 0) {
        self.inspectList = InspectList[0].name;
      }
      self.changeStore(self.curStore);
      self.searchData();
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

    async getInspectItemsTable() {
      let self = this;
      let inspectItems = await self.getInspectStatsItemInfo(self.params);
      let ignorePer = 0;
      let errCode = inspectItems.errCode;
      let seriesData = [];
      if (errCode === 0) {
        let totalIgnored = 0;
        let totalUnqualified = 0;
        let totalQualified = 0;
        let totalExcellent = 0;
        let resultData = inspectItems.data;
        console.log(resultData);
        try {
          let content = resultData.content;
          content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
            totalIgnored += item.numOfIgnored;
            totalUnqualified += item.numOfUnqualified;
            totalQualified += item.numOfQualified;
            totalExcellent += item.numOfExcellent;
          });
          self.itemsTableData = resultData.content;
          self.total = resultData.totalElements;
          console.log(resultData.content);
          await self.getInspectCharts();
        } catch (e) {
          seriesData = [];
          self.itemsTableData = [];
        }
      }
    },

    getInspectChartOption(){
      let self = this;
      let chartOption = {
        tooltip: {
          trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
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
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  let colorList = ['#72a1f3', '#ffd035', '#cad1db'];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      return chartOption;
    },

    async getInspectCharts() {
      let self = this;
      let params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.storeIds = self.params.storeIds;
      params.mode = self.params.mode;
      console.log(self.total);
      self.itemsOptions = self.getInspectChartOption()
      if (self.total > 0) {
        self.hasNoData = false;
        params.filter = {
          page: 0,
          size: self.total
        };
        params.inspectId = self.params.inspectId;
        let inspectItems = await self.getInspectStatsItemInfo(params);
        let ignorePer = 0;
        let errCode = inspectItems.errCode;
        let jsonArray = self.itemsLegend;
        let seriesData = [];
        let resultData = {};
        if (errCode === 0) {
          let totalIgnored = 0;
          let totalUnqualified = 0;
          let totalQualified = 0;
          resultData = inspectItems.data;
          try {
            let content = resultData.content;
            content.forEach(item => {
              totalIgnored += item.numOfIgnored;
              totalUnqualified += item.numOfUnqualified;
              totalQualified += item.numOfQualified;
            });
            seriesData = [
              { value: totalQualified, name: self.$t('overview.pass') },
              { value: totalUnqualified, name: self.$t('overview.failed') },
              { value: totalIgnored, name: self.$t('overview.ignored') }
            ];
          } catch (e) {
            seriesData = [];
          }
          let totalArray = [totalQualified, totalUnqualified, totalIgnored];
          console.log(totalArray);
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
          self.itemsOptions.series[0].data = seriesData;
        }
        self.itemsPerArray = jsonArray;
        self.getCatergyRadar(resultData.content);
      } else {
        let jsonArray = self.itemsLegend;
        jsonArray[0].percent = 0;
        jsonArray[1].percent = 0;
        jsonArray[2].percent = 0;
        self.itemsPerArray = jsonArray;
        self.hasNoData = true;
      }
    },

    getCatergyRadar(arr) {
      let self = this;
      let mergeData = self.getCatergyByMerge(arr);
      console.log(mergeData);
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          textStyle: {
            align: 'left'
          },
          backgroundColor: self.echartBackground
        },
        textStyle: {
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
              padding: [3, 5]
            },
            formatter: (params) => {
              console.log(params);
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
              color: self.echartAxiasColor
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: self.echartAxiasColor
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
              color: self.echartAxiasColor
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: self.echartAxiasColor
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
            name: self.$t('insSettingView.category'),
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
              }
            },
            tooltip: {
              trigger: 'item'
            }
          }
        ]
      };
      let tempIndicator = [];
      let seriesValue = [];
      mergeData.forEach(item => {
        let obj = {};
        obj.name = item.name;
        let datasArray = item.data;
        let sumNum = 0;
        let score = 0;
        datasArray.forEach(_item => {
          sumNum += _item.numOfTotal;
          score += _item.numOfExcellent * 2 + _item.numOfQualified;
        });
        obj.max = sumNum * 2;
        tempIndicator.push(obj);
        seriesValue.push(score);
      });
      let temp = [];
      let obj = { value: seriesValue };
      temp.push(obj);
      options.radar[0].indicator = tempIndicator;
      options.radar[1].indicator = tempIndicator;
      options.series[0].data = temp;
      options.series[1].data = temp;
      options.radar.splitNumber = 5;
      self.itemsRadarOption = options;
      console.log(self.itemsRadarOption);
    },

    getCatergyByMerge(arr) {
      let map = {}, dest = [];
      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];
        if (!map[ai.inspectGroupName]) {
          dest.push({
            name: ai.inspectGroupName,
            data: [ai]
          });
          map[ai.inspectGroupName] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j];
            if (dj.name === ai.inspectGroupName) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },

    getInspectStatsItemInfo(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsItemOverviewV2(params).then(res => {
          resolve(res);
        });
      });
    },

    async initData() {
      let self = this;
      console.log(self.curStore);
      let storeIds = self.curStore.filter(item => item !== -1);
      console.log(storeIds);
      self.params.storeIds = storeIds;

      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.params.order = { direction: self.direction, property: self.property };
      self.params.mode = self.curType;
      self.getCountryStore();
      self.getTagListData();
    },

    export2Excel() {
      let that = this;
      if (that.itemsTableData.length === 0) {
        that.$message({
          message: that.$t('overview.emptyItemList'),
          type: 'warning'
        });
        return false;
      }
      require.ensure([], async() => {
        let { export_json_to_excel } = require('@/excel/Export2Excel');
        let tHeader = that.exportItmesHeader;
        let filterVal = ['inspectGroupName', 'inspectItemName', 'numOfTotal', 'numOfQualified',
          'numOfUnqualified', 'numOfIgnored', 'qualifiedRatePer'];
        that.params.filter = {
          'page': 0,
          'size': that.total
        };
        let regionResult = await that.getInspectStatsItemInfo(that.params);
        let curData = [];
        if (regionResult.errCode === 0) {
          let result = regionResult.data;
          if (result) {
            result.content.forEach(item => {
              item.qualifiedRatePer = item.qualifiedRate + '%';
            });
            console.log(result.content);
            curData = result.content;
          }
        }
        let data = that.formatJson(filterVal, curData);
        let patrolName = that.curType === 0 ? 'Remote Patrol' : 'Onsite Patrol';
        let fileName = patrolName + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    adjustChart() {
      let self = this;
      self.$refs.itemsPie && self.$refs.itemsPie.resize();
      self.$refs.itemsRadar && self.$refs.itemsRadar.resize();
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
  *{
    box-sizing: border-box;
    font-family: Roboto, Arial, 'Microsoft YaHei',serif;
  }
  .item-container{
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
        position: relative;
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
        }
        @media screen and(max-width: 1366px){
          .en-span-class{
            margin-right: 60px;
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
          float: right;
        }
        .en-search-btn{
          width: calc(130/1920*100vw);
          margin-left: calc(20/1920*100vw);
          border-color: $red;
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
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
    .items-content{
      padding: 0 calc(30/1920*100vw) 0;
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
      .contents-container{
        background-color: #fff;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .items-row {
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          .title {
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            color: $black;
            display: inline-block;
            padding-top: 30px;
          }
          .exprotBtn{
            padding-right: calc(30 / 1920 * 100vw);
            float: right;
            padding-top: 25px;
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
              top: calc(24/1920*100vw);
              min-height: 28px;
              min-width: 120px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-pdf{
                  margin-right: calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
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
              min-height: 28px;
              min-width: 120px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-pdf{
                  margin: calc(6/1920*100vw) calc(18/1920*100vw) calc(6/1920*100vw) 0;
                  font-size: 24px;
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
            }
          }
        }
        .evalution-pct {
          background-color: #fff;
          .title{
            /*float: left;*/
            padding-left: calc(30/1920*100vw);
            text-align: left;
            padding-top: 20px;
            font-size:calc(14/1920*100vw) ;
            color: #7d8cad;
          }
          .pct-content {
            /*padding-top: calc(30 / 1920 * 100vw);*/
            padding-bottom: 20px;
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
              /*padding: 0 calc(20/1920*100vw);*/
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
                  display: flex;
                  .labels {
                    height: 12px;
                    width: 12px;
                    display: inline-block;
                    margin-right: calc(10 / 1920 * 100vw);
                    align-self: center;
                  }
                  .label-desc {
                    color: $tab;
                    font-size: 12px;
                  }
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
                @media screen and (max-width: 1280px) {
                  padding: 0 calc(5 / 1920 * 100vw);
                }
              }
            }
          }
          .data-empty{
            font-size: calc(14/1920*100vw);
            color: $tab;
            height: 222px;
            line-height: 222px;
          }
          .radar-title {
            text-align: left;
            font-size: calc(14 / 1920 * 100vw);
            color: $tab;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 20px;
            margin-left: calc(30/1920*100vw);
          }
          .inspect-catergy {
            border-left: 1px solid $border;
            .rader-panel {
              width: 100%;
              height: 100%;

              .radar-content {
                width: 100%;
                height: 220px;
                width: 100%;
                margin: 0 auto;
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
        .focus-items {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid $border;
          margin-left: calc(20 / 1920 * 100vw);
          height: calc(400 / 1920 * 100vw);
          background-color: #fff;
          .title {
            border-bottom: 1px solid $border;
          }
          .items-panel {
            height: calc(298 / 1920 * 100vw);
            margin: calc(15 / 1920 * 100vw);
            border: 1px solid $border;
            .top-five-items {
              height: 100%;
              position: relative;
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
                    font-family: Arial Rounded MT Bold;
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
              padding-top: calc(15 / 1920 * 100vw);
              position: relative;

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
                }
                .radar-content {
                  width: 100%;
                  height: calc(100% - 25 / 1920 * 100vw);
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
      .items-table{
        .table{
          margin: 0 calc(30/1920*100vw);
        }
        .exprotBtn{
            margin-bottom: 10px;
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
              top: calc(24/1920*100vw);
              min-height: 28px;
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
              min-height: 28px;
              min-width: 120px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin: calc(6/1920*100vw) calc(18/1920*100vw) calc(6/1920*100vw) 0;
                  font-size: 24px;
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
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
          margin-right: 0;
          height:13%;
        }
      }
    }

  }
</style>
<style>
/* .el-cascader-menu {width: 200px; }
.el-cascader-menu__wrap ul li{list-style: none;}
.el-scrollbar__view{ padding: 0 15px;}
.el-icon-arrow-right{float: right;}
.in-active-path{color:#f31d65;font-weight: 600;}
.el-cascader-node{font-size: 14px;margin: 10px 0;}
.el-cascader-node:hover{color:#f31d65;font-weight: 600;cursor: pointer;}
.el-cascader-menu__list .is-active{color:#f31d65;font-weight: 600;} */
  .LoadDialog /deep/ .el-dialog__header{
    padding-bottom:0;
  }
  .LoadDialog /deep/ .el-dialog__body{
    padding:0px 20px 30px 20px !important;
  }
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
    height: 35px;
    padding-left: 20px;
    font-size: calc(14/1920*100vw);
    color: #182752;
  }

  body .el-table th.gutter {
    display: table-cell !important
  }

  .el-table__row.row-class{
    height: 35px;
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
  .el-table__empty-block{
    border-bottom: 1px solid #e3e9f4;
  }
  .el-table-panel .el-table.el-table--striped.el-table--border.el-table--enable-row-hover.el-table--mini{
    border-right: 1px solid #e3e9f4;
  }
</style>
