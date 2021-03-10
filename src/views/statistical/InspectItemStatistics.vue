<template>
  <div>
    <div class="item-container">
      <el-col :span="24">
        <search-component :is-inspect-item = "true" @emitSearch = "emitSearch"
                          ref="inspectItemSearch"
                          path="inspectItemStatistics" :defaultSort="defaultSort"
                          @setDefaultSortAndPage="setDefaultSortAndPage"/>
      </el-col>
      <el-col :span="24" class="items-content content">
        <el-col :span="24" class="contents-container">
          <el-col :span="24" class="items-row">
            <el-col :span="24" class="items-title">
              <span class="title">{{ $t('overview.itemChartReport') }}</span>
              <div class="exprotBtn">
                <el-button
                  :class="lang === 'en'? 'en-export-btn':'export-btn' "
                  type="primary"
                  size="mini"
                  style="margin-top:-15px;"
                  @click="handleDown()">
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
              <div class="title radar-title">
                {{ curType === 0? $t('overview.proportionOfRemote') : $t('overview.proportionOfOnsite') }}
              </div>
              <div class="inspect-catergy">
                <div class="rader-panel">
                  <div v-if="!hasNoData">
                    <v-chart
                      ref="itemsRadar"
                      :options="itemsRadarOption"
                      :auto-resize="true"
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
            <table-pagination
              ref="elTP"
              :column-data="itemsInfoData"
              :table-data="itemsTableData"
              :total="total"
              :highlight-current-row= "true"
              :pagesize="sizeNum"
              :current-page="page"
              :default-sort = "defaultSort"
              @handleChange="handlePageAndSizeChange"
              @sortChange="handleSortChange"/>
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
      <el-col id="pdfDom" :span="24" class="items-content content" style="padding:40px 20px;">
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
              <div class="title radar-title">
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
            <table-pagination
              ref="elTP"
              :column-data="itemsInfoData"
              :table-data="PDFData"
              :total="total"
              :highlight-current-row= "true"
              :pagesize="sizeNum"
              :current-page="page"
              :can-sortable="false"
              :show-pagination="false"
              :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
              @handleChange="handlePageAndSizeChange"
              @sortChange="handleSortChange"/>
          </el-col>
        </el-col>
      </el-col>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import { mapGetters } from 'vuex';
import util from '../../common/util.js';
import SearchComponent from '@/components/SearchComponent';
import resize from '@/components/mixins/echartResize';

import {
  getInspectStatsItemOverviewV2
} from '@/api/inspectOverview';
import TablePagination from '../../components/TablePagination';

export default {
  name: 'InspectItemStatistics',

  components: {
    TablePagination,
    'v-chart': ECharts,
    SearchComponent
  },
  mixins: [resize],
  data() {
    return {
      storeNameStr: '',
      storeTagStr: '',
      storePatrolLists: '',
      curType: 0,
      params: {},
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
          'sortable': false,
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
      order: {
        direction: 'asc',
        property: 'qualifiedRate'
      },
      defaultSort: {prop: 'qualifiedRateStr', order: 'ascending'},
      ifSaveParams: false
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        const start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        const end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initDaysRange();
        await self.initData();
        self.curStoreTag = [];
      }
    },

    numberOfElements(val) {
      const self = this;
      if (val === 0 && self.totalElements > 0) {
        self.params.filter.page -= 1;
        self.getEventList(self.params);
      }
    }

  },

  created() {
    this.initData();
  },

  beforeDestroy() {
    this.$refs.itemsPie && this.$refs.itemsPie.dispose();
    this.$refs.itemsRadar && this.$refs.itemsRadar.dispose();
  },

  methods: {
    handleDown() {
      const self = this;
      self.ispdf = true;
      if (self.total > 0) {
        require.ensure([], async() => {
          self.params.filter = {
            'page': 0,
            'size': self.total
          };
          const regionResult = await self.getInspectStatsItemInfo(self.params);
          if (regionResult.errCode === 0) {
            const result = regionResult.data;
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

    async searchData() {
      const self = this;
      self.storeDateValue = util.getDates(self.params.beginTs) + '-' + util.getDates(self.params.endTs);
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.params.order = self.order;
      self.params.mode = self.curType;
      await self.getInspectItemsTable();
    },

    async getInspectItemsTable() {
      const self = this;
      let seriesData = [];
      try {
        const inspectItems = await self.getInspectStatsItemInfo(self.params);
        const ignorePer = 0;
        const errCode = inspectItems.errCode;
        if (errCode === 0) {
          let totalIgnored = 0;
          let totalUnqualified = 0;
          let totalQualified = 0;
          let totalExcellent = 0;
          const resultData = inspectItems.data;
          const content = resultData.content;
          content.forEach(item => {
            item.qualifiedRateStr = item.qualifiedRate + '%';
            totalIgnored += item.numOfIgnored;
            totalUnqualified += item.numOfUnqualified;
            totalQualified += item.numOfQualified;
            totalExcellent += item.numOfExcellent;
          });
          self.itemsTableData = resultData.content;
          self.total = resultData.totalElements;
          await self.getInspectCharts();
        }
      } catch (e) {
        seriesData = [];
        self.itemsTableData = [];
        console.log('InspectItemStatistics-getInspectItemsTable:' + e);
      }
    },

    getInspectChartOption() {
      const self = this;
      const chartOption = {
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
                  const colorList = ['#72a1f3', '#ffd035', '#cad1db'];
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
      const self = this;
      const params = {};
      params.beginTs = self.params.beginTs;
      params.endTs = self.params.endTs;
      params.storeIds = self.params.storeIds;
      params.mode = self.params.mode;
      self.itemsOptions = self.getInspectChartOption();
      if (self.total > 0) {
        self.hasNoData = false;
        params.filter = {
          page: 0,
          size: self.total
        };
        params.inspectId = self.params.inspectId;
        const inspectItems = await self.getInspectStatsItemInfo(params);
        const ignorePer = 0;
        const errCode = inspectItems.errCode;
        const jsonArray = self.itemsLegend;
        let seriesData = [];
        let resultData = {};
        if (errCode === 0) {
          let totalIgnored = 0;
          let totalUnqualified = 0;
          let totalQualified = 0;
          resultData = inspectItems.data;
          try {
            const content = resultData.content;
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
          const totalArray = [totalQualified, totalUnqualified, totalIgnored];
          jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
          jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
          jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
          self.itemsOptions.series[0].data = seriesData;
        }
        self.itemsPerArray = jsonArray;
        self.getCatergyRadar(resultData.content);
      } else {
        const jsonArray = self.itemsLegend;
        jsonArray[0].percent = 0;
        jsonArray[1].percent = 0;
        jsonArray[2].percent = 0;
        self.itemsPerArray = jsonArray;
        self.hasNoData = true;
      }
    },

    getCatergyRadar(arr) {
      const self = this;
      const mergeData = self.getCatergyByMerge(arr);
      const options = self.getCatergyRadarOption();
      const tempIndicator = [];
      const seriesValue = [];
      mergeData.forEach(item => {
        const obj = {};
        obj.name = item.name;
        const datasArray = item.data;
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
      const temp = [];
      const obj = { value: seriesValue };
      temp.push(obj);
      options.radar[0].indicator = tempIndicator;
      options.radar[1].indicator = tempIndicator;
      options.series[0].data = temp;
      options.series[1].data = temp;
      options.radar.splitNumber = 5;
      self.itemsRadarOption = options;
    },

    getCatergyByMerge(arr) {
      let map = {}, dest = [];
      for (let i = 0; i < arr.length; i++) {
        const ai = arr[i];
        if (!map[ai.inspectGroupName]) {
          dest.push({
            name: ai.inspectGroupName,
            data: [ai]
          });
          map[ai.inspectGroupName] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            const dj = dest[j];
            if (dj.name === ai.inspectGroupName) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },

    getCatergyRadarOption() {
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
            name: this.$t('insSettingView.category'),
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
      return radarOptions;
    },

    getInspectStatsItemInfo(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsItemOverviewV2(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async initData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = { direction: this.direction, property: this.property };
      this.params.mode = this.curType;
    },

    export2Excel() {
      const that = this;
      if (that.itemsTableData.length === 0) {
        that.$message({
          message: that.$t('overview.emptyItemList'),
          type: 'warning'
        });
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportItmesHeader;
        const filterVal = ['inspectGroupName', 'inspectItemName', 'numOfTotal', 'numOfQualified',
          'numOfUnqualified', 'numOfIgnored', 'qualifiedRatePer'];
        that.params.filter = {
          'page': 0,
          'size': that.total
        };
        const regionResult = await that.getInspectStatsItemInfo(that.params);
        let curData = [];
        if (regionResult.errCode === 0) {
          const result = regionResult.data;
          if (result) {
            result.content.forEach(item => {
              item.qualifiedRatePer = item.qualifiedRate + '%';
            });
            curData = result.content;
          }
        }
        const data = that.formatJson(filterVal, curData);
        const patrolName = that.curType === 0 ? 'Remote Patrol' : 'Onsite Patrol';
        const fileName = patrolName + '-' + util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    adjustChart() {
      this.$refs.itemsPie && this.$refs.itemsPie.resize();
      this.$refs.itemsRadar && this.$refs.itemsRadar.resize();
    },

    emitSearch(searchParams, dateRangeList, regionI, regionII, regionMode, storePatrolLists, storeNameStr, storeTagStr) {
      this.params = searchParams;
      this.storePatrolLists = storePatrolLists;
      this.storeNameStr = storeNameStr;
      this.storeTagStr = storeTagStr;
      const searchParamsObj = {
        path: 'inspectItemStatistics',
        params: this.params
      };
      this.ifSaveParams && this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
      this.ifSaveParams = true;
      this.searchData();
    },

    handlePageAndSizeChange(pageObj) {
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      const searchParamsObj = {
        path: 'inspectItemStatistics',
        params: this.params
      };
      this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
      self.getInspectItemsTable();
    },

    handleSortChange(order) {
      this.order = this.params.order = order;
      this.params.filter = {
        page: this.page - 1,
        size: this.sizeNum
      };
      const searchParamsObj = {
        path: 'inspectItemStatistics',
        params: this.params
      };
      this.$refs.inspectItemSearch.saveSearchParams(searchParamsObj);
      this.getInspectItemsTable();
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

  .item-container{
    padding-bottom: 20px;
    .header-details span{
      margin-left: 0;
    }
    .en-search-btn, .search-btn{
      float: right;
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
