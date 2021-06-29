<template>
  <el-row id="el-containter">
    <el-col :span="24" class="report-header">
      <el-col :span="24" class="header-details">
        <store-filter
          :cached-params="searchParams"
          @storeChange = "onStoreChange"
        />
      </el-col>
      <el-col :span="24" class="header-details">
        <span :class="lang === 'en' ? 'en-span-class' : ''">{{ $t('remotePatrol.time') }}</span>
        <el-date-picker
          ref="datePicker"
          v-model="dateValue"
          :clearable="false"
          :editable="false"
          :picker-options="dateOpt"
          :popper-class="poperClass"
          :default-time="defaultTime"
          type="datetimerange"
          range-separator="~"
          size="mini"
          format="yyyy/MM/dd HH:mm:ss"
          class="date-range"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"
          @focus="dateFocus"/>
        <el-tooltip
          class="item"
          effect="dark"
          placement="bottom-end">
          <div slot="content">*{{ $t('remotePatrol.timePlaceholder') }}</div>
          <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;vertical-align: middle;"/>
        </el-tooltip>
        <span>{{ $t('remotePatrol.resultType') }}</span>
        <el-select
          v-model="curAppraise"
          :placeholder="$t('remotePatrol.all')"
          size="mini"
          class="el-province "
        >
          <el-option
            v-for="item in appraiseList"
            :key="item.status"
            :label="item.label"
            :value="item.status"/>
        </el-select>
        <span>{{ $t('remotePatrol.reportType') }}</span>
        <el-select
          v-model="curReportType"
          :placeholder="$t('remotePatrol.all')"
          size="mini"
          class="el-province"
          @change="getInspectList"
        >
          <el-option
            v-for="item in reportTypeList"
            :key="item.mode"
            :label="item.label"
            :value="item.mode"/>
        </el-select>
        <span>{{ $t('overview.patrolLists') }}</span>
        <el-select
          v-model="inspectId"
          :placeholder="$t('insSettingView.selectPost')"
          size="mini"
          class="el-province">
          <el-option
            v-for="item in inspectTableList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="24" class="header-details">
        <div class="search-content">
          <span>{{ $t('remotePatrol.keywords') }}</span>
          <el-input v-model="searchInput" size="mini" class="search-input" clearable/>
        </div>
        <delay-button
          class="search-button"
          type="primary"
          size="mini"
          @click="searchData"
        >
          <span>{{ $t('remotePatrol.search') }}</span>
        </delay-button>
      </el-col>
    </el-col>
    <el-col :span="24" class="report-content loading">
      <el-row
        v-loading="isLoading"
        v-if="reportList.length !== 0"
        :element-loading-text="$t('insSettingView.loadingbindstore')"
        class="card-content self-loading">
        <el-col v-if="reportList.length !== 0" :span="24" class="card-header">
          <el-radio
            v-for="(item,index) in sortTypeList"
            v-model="curSortType"
            :key="index"
            :label="item.id"
            style="height:calc(36/1920*100vw);line-height:calc(36/1920*100vw);vertical-align: middle;"
            @change="checkSortType">
            <span>{{ item.name }}</span>
          </el-radio>
          <div class="list_card">
            <div
              :style="isHoverCard || ShowCard ? 'color:#f31d65':''"
              class="pattern_btn"
              @click="ShowCard=true"
              @mouseover="isHoverCard=true"
              @mouseout="isHoverCard=false">
              <i class="iconfont icon-suolvetu iconCard"/>
              <span class="text-pattern">{{ $t('remotePatrol.cardStyle') }}</span>
            </div>
            <div style="width:1px;height:calc(20/1920*100vw);background-color:#e3e9f4;display:inline-block;margin:0 15px;"/>
            <div
              :style="isHoverList || !ShowCard ? 'color:#f31d65':''"
              class="pattern_btn"
              @click="ShowCard=false"
              @mouseover="isHoverList=true"
              @mouseout="isHoverList=false">
              <i class="iconfont icon-liebiao iconCard"/>
              <span class="text-pattern">{{ $t('remotePatrol.listStyle') }}</span>
            </div>
            <el-button
              :class="lang === 'en' ? 'en-export-btn':'export-btn'"
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
        <div v-if="ShowCard" :style="{'height':varyWindowHeight*0.54+'px'}" class="showCardHeight">
          <el-scrollbar id="el-menuscrollbar" style="height:100%;width:100%">
            <el-col v-for="(item,index) in reportList" :span="4" :key="index" class="report-card">
              <div class="cards" @click="clickReport(item,index)">
                <img :src="item.iconSrc" :height="iconSrcHeight" alt="" class="item-img">
                <div class="item-flex">
                  <div class="item-header">
                    <div class="store-name">
                      <span class="name">{{ item.storeName }}</span>
                      <span class="inspect">{{ item.tagName }}</span>
                    </div>
                  </div>
                  <div class="item-icon">
                    <i
                      :class="item.mode === 0 ? 'icon-yuanchengxunjian' : 'icon-xianchangxunjian'"
                      class="iconfont inspectIcon"/>
                    <div class="item-score">
                      <span class="score-num">{{ item.totalScore }}</span>
                      <span class="score-unit" v-if="lang !== 'en'">{{ $t('insSettingView.scores')}}</span>
                    </div>
                  </div>
                  <div class="item-content">
                    <span class="assigner">{{ $t('remotePatrol.submitter') }} {{ item.submitterName }}</span>
                    <span class="datestr">{{ item.datestr }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-scrollbar>
        </div>
        <div v-else class="list-table">
          <el-table
            :data="reportList"
            :highlight-current-row="true"
            :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
            :cell-style="cellStyle"
            :cell-class-name="cellClass"
            :header-cell-class-name="headerClass"
            align="left"
            stripe
            height="calc(500/1920*100vw)"
            style=""
            class="table-content"
            @row-click="clickReport"
            @sort-change="sortChange"
          >
            <el-table-column
              v-for="(_item,_index) in reportInfoTable"
              :key="_index"
              :prop="_item.prop"
              :label="_item.label"
              :sortable="_item.sortable"
              :min-width="_item.width"
              align="left"/>
            <el-table-column
              :label="$t('eventView.operation')"
              prop="option"
              min-width="110"
              align="left">
              <template slot-scope="scope">
                <i class="iconfont icon-gengduo"/>
              </template>
            </el-table-column>
            <div slot="empty">
              <div>
                <i class="iconfont icon-zhengque empty-data-icon"/>
                <span :style="{'margin-left':'20px','font-size':'16px','color':'#7d8cad'}">{{ $t('eventView.noEvents') }}</span>
              </div>
            </div>
          </el-table>
        </div>
        <el-col :span="24" class="el-pat">
          <el-pagination
            :page-size="sizeNum"
            :total="total"
            :current-page="page"
            :page-sizes="[12,24,50,100]"
            background
            small
            layout="jumper,total, prev, pager, next,sizes"
            class="el-pag"
            @current-change="currentChange"
            @size-change="sizeChange"/>
        </el-col>
      </el-row>
      <el-row
        v-loading="isLoading"
        v-else
        :element-loading-text="$t('insSettingView.loadingbindstore')"
        class="card-content self-loading">
        <div class="empty-content">{{ noData }}</div>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { getInspectReportList, GetInspectTagList } from '@/api/inspect';
import util from '@/common/util';
import { mapGetters } from 'vuex';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import StoreFilter from '@/components/StoreFilter';
import DelayButton from '@/components/DelayButton';

export default {
  name: 'InspectReportList',
  components: {
    DelayButton,
    StoreFilter
  },
  data() {
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      videoSrc: require('../../../static/img/monitor.png'),
      inspectSrc: require('../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../static/img/onsite_patrol.png'),
      searchContent: false,
      inspectSrc1: require('../../../static/img/dangerous_cn.png'),
      inspectSrc2: require('../../../static/img/good_cn.png'),
      inspectSrc3: require('../../../static/img/improved_cn.png'),
      inspectSrc4: require('../../../static/img/dangerous_en.png'),
      inspectSrc5: require('../../../static/img/good_en.png'),
      inspectSrc6: require('../../../static/img/improved_en.png'),
      inspectSrc7: require('../../../static/img/dangerout_tw.png'),
      inspectSrc8: require('../../../static/img/excellent_cn.png'),
      inspectSrc9: require('../../../static/img/excellent_en.png'),
      inspectSrc10: require('../../../static/img/excellent_tw.png'),
      exportPng: require('../../../static/img/excel.png'),
      reportList: [],
      curSortType: 0,
      ShowCard: true,
      isHoverList: false,
      isHoverCard: false,
      sortTypeList: [
        {
          id: 0,
          name: this.$t('remotePatrol.rankTime')
        },
        {
          id: 1,
          name: this.$t('remotePatrol.rankScore')
        },
        {
          id: 2,
          name: this.$t('remotePatrol.rankStore')
        }
      ],
      reportInfoTable: [
        {
          prop: 'province',
          label: this.$t('remotePatrol.regionI'),
          sortable: false,
          width: '120'
        },
        {
          prop: 'city',
          label: this.$t('remotePatrol.regionII'),
          sortable: false,
          width: '140'
        },
        {
          prop: 'storeName',
          label: this.$t('remotePatrol.patrolStore'),
          sortable: false,
          width: '140'
        },
        {
          prop: 'code',
          label: this.$t('remotePatrol.code'),
          sortable: false,
          width: '120'
        },
        {
          prop: 'storeType',
          label: this.$t('remotePatrol.storeType'),
          sortable: false,
          width: '115'
        },
        {
          prop: 'submitterName',
          label: this.$t('scheduleView.InspectPerson'),
          sortable: false,
          width: '130'
        },
        {
          prop: 'tagName',
          label: this.$t('overview.patrolLists'),
          sortable: false,
          width: '150'
        },
        {
          prop: 'modeText',
          label: this.$t('remotePatrol.patrolWay'),
          sortable: false,
          width: '150'
        },
        {
          prop: 'status',
          label: this.$t('remotePatrol.patrolResult'),
          sortable: false,
          width: '100'
        },
        {
          prop: 'totalScore',
          label: this.$t('remotePatrol.patrolScore'),
          sortable: 'custom',
          width: '110'
        },
        {
          prop: 'datestr',
          label: this.$t('remotePatrol.patrolDate'),
          sortable: 'custom',
          width: '164'
        }
      ],
      storeList: [],
      searchInput: '',
      sizeNum: 12,
      defaultTime: [],
      dateValue: [],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        }
      },
      curReportType: -1,
      reportTypeList: [
        { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        { 'mode': 0, 'label': this.$t('remotePatrol.remotePatrol') },
        { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') }
      ],
      curAppraise: -1,
      appraiseList: [
        { 'status': -1, 'label': this.$t('remotePatrol.all') },
        { 'status': 0, 'label': this.$t('remotePatrol.dangerous') },
        { 'status': 1, 'label': this.$t('remotePatrol.improve') },
        { 'status': 2, 'label': this.$t('overview.echartGood') }
      ],
      storeStr: '',
      total: 0,
      page: 0,
      params: {},
      storeDataList: [],
      storeIdList: [],
      poperClass: 'date-picker-poper',
      lang: this.$i18n.locale,
      isFirstLoad: false,
      storeName: '',
      showMonthDrap: false,
      showStoreContent: false,
      checkAllStore: false,
      noData: '',
      showStoreInfo: false,
      cellClass: 'report-cell-class',
      headerClass: 'report-header-class',
      exportReportHeader: [this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('remotePatrol.code'),
        this.$t('remotePatrol.patrolStore'),
        this.$t('remotePatrol.storeType'),
        this.$t('scheduleView.InspectPerson'),
        this.$t('overview.patrolLists'),
        this.$t('remotePatrol.patrolWay'),
        this.$t('remotePatrol.patrolResult'),
        this.$t('remotePatrol.patrolScore'),
        this.$t('remotePatrol.patrolDate')],
      inspectId: '',
      inspectTableList: [],
      isLoading: false,
      ifSaveParams: false,
      ifGetParamsFromCash: false,
      inspectCatch: '',
      storeFilterObj: {},
      searchParams: {}
    };
  },

  created() {
    this.isFirstLoad = true;
  },

  computed: {
    iconSrcHeight() {
      return (this.varyWindowWidth / 1920) * 50;
    },
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.storeDataList = [];
        self.$refs.multiSelect.selectedArray = [];
        self.$refs.multiSelect.input = '';
        self.initData();
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        },
        300);
        self.ifSaveParams = true;
      }
    }
  },

  activated() {
    const self = this;
    if (!self.$route.meta.isBack || self.isFirstLoad) {
      self.initData();
    }
    self.$route.meta.isBack = false;
    self.isFirstLoad = false;
  },

  methods: {
    initData() {
      const self = this;
      self.isLoading = true;
      this.searchInput = '';
      self.defaultTime = [];
      self.storeStr = '';
      self.dateValue = [new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24, new Date()];
      self.reportList = [];
      self.curSortType = 0;
      self.storeName = '';
      self.showMonthDrap = false;
      self.showStoreContent = false;
      self.checkAllStore = false;
      self.curReportType = -1;
      self.getSearchParams();
      self.getInspectList();
    },

    async export2Excel() {
      const that = this;
      if (that.reportList.length === 0) {
        util.notify(that.$t('remotePatrol.emptyReportList'), 'warning', 3000);
        return false;
      }
      const start = typeof (that.dateValue[0]) === 'object' ? that.dateValue[0].getTime() : that.dateValue[0];
      const end = typeof (that.dateValue[1]) === 'object' ? that.dateValue[1].getTime() : that.dateValue[1];
      that.params.beginTs = start;
      that.params.endTs = end;
      that.params.filter = { page: 0, size: that.total };
      const storeIds = this.storeFilterObj.filterStoreIds;
      that.params.clause = { storeId: storeIds };
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportReportHeader;
        const filterVal = ['province', 'city', 'code', 'storeName', 'storeType', 'submitterName', 'tagName',
          'modeText', 'status', 'totalScore', 'datestr'];
        let curData = [];
        curData = await that.getReportList(that.params);
        const data = that.formatJson(filterVal, curData);
        const fileName = that.$t('remotePatrol.reportExcelList') + '-' + util.getCurDateStr();
        sessionStorage.setItem('!merge', true);
        export_json_to_excel(tHeader, data, fileName);
        sessionStorage.removeItem('!merge');
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    cellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },

    getReportList(params) {
      const self = this;
      return new Promise((resolve) => {
        getInspectReportList(params).then(res => {
          const errCode = res.errCode;
          let data = [];
          if (errCode === 0) {
            data = res.data.content;
          }
          const temp = [];
          data.forEach(item => {
            const reportObj = {};
            reportObj.id = item.id;
            reportObj.datestr = util.getDateStr(item.ts);
            reportObj.storeName = item.storeName;
            reportObj.tagName = item.tagName;
            reportObj.submitterName = item.submitterName;
            reportObj.submitter = item.submitter;
            reportObj.routeObj = item;
            reportObj.mode = item.mode;
            reportObj.totalScore = item.totalScore;
            reportObj.code = item.code !== null ? item.code : '--';
            if (item.mode === 0) {
              reportObj.modeText = self.$t('overview.remotePatrol');
            } else if (item.mode === 1) {
              reportObj.modeText = self.$t('overview.onsitePatrol');
            }
            let storeType = '';
            item.tags.length !== 0 ? item.tags.forEach((_item, _index) => {
              const isuu = _index === item.tags.length - 1 ? '' : ',';
              storeType += _item + isuu;
            }) : storeType = '--';
            reportObj.storeType = storeType;
            self.storeList.forEach(_item => {
              if (item.storeId === _item.storeId) {
                reportObj.province = _item.province;
                reportObj.city = _item.city;
              }
            });
            const statusAndIconObj = self.getIconSrc(item.status);
            reportObj.status = statusAndIconObj.status;
            reportObj.iconSrc = statusAndIconObj.iconSrc;
            temp.push(reportObj);
          });
          self.reportList = temp;
          self.total = res.data.totalElements;
          self.isLoading = false;
          if (self.reportList.length === 0) {
            self.noData = self.$t('deviceView.noData');
          }
          resolve(temp);
        }).catch(err => {
          console.log('InspectReportList-getReportList: ' + err);
        });
      });
    },

    getIconSrc(status) {
      const statusAndIconObj = {};
      switch (status) {
        case 0: {
          // dangerous
          statusAndIconObj.status = this.$t('overview.danger');
          if (this.lang === 'zh') {
            statusAndIconObj.iconSrc = this.inspectSrc1;
          } else if (this.lang === 'en') {
            statusAndIconObj.iconSrc = this.inspectSrc4;
          } else if (this.lang === 'zhtw') {
            statusAndIconObj.iconSrc = this.inspectSrc7;
          } else {
            statusAndIconObj.iconSrc = this.inspectSrc1;
          }
          return statusAndIconObj;
        }
        case 1: {
          // improved
          statusAndIconObj.status = this.$t('overview.improve');
          if (this.lang === 'zh') {
            statusAndIconObj.iconSrc = this.inspectSrc3;
          } else if (this.lang === 'en') {
            statusAndIconObj.iconSrc = this.inspectSrc6;
          } else if (this.lang === 'zhtw') {
            statusAndIconObj.iconSrc = this.inspectSrc3;
          } else {
            statusAndIconObj.iconSrc = this.inspectSrc3;
          }
          return statusAndIconObj;
        }

        case 2: {
          // pass
          statusAndIconObj.status = this.$t('overview.pass');
          if (this.lang === 'zh') {
            statusAndIconObj.iconSrc = this.inspectSrc2;
          } else if (this.lang === 'en') {
            statusAndIconObj.iconSrc = this.inspectSrc5;
          } else if (this.lang === 'zhtw') {
            statusAndIconObj.iconSrc = this.inspectSrc2;
          } else {
            statusAndIconObj.iconSrc = this.inspectSrc2;
          }
          return statusAndIconObj;
        }
        default : {
          // good
          if (this.lang === 'zh') {
            statusAndIconObj.iconSrc = this.inspectSrc8;
          } else if (this.lang === 'en') {
            statusAndIconObj.iconSrc = this.inspectSrc9;
          } else if (this.lang === 'zhtw') {
            statusAndIconObj.iconSrc = this.inspectSrc10;
          } else {
            statusAndIconObj.iconSrc = this.inspectSrc8;
          }
          return statusAndIconObj;
        }
      }
    },

    getInitReportList() {
      this.getReportList(this.params);
    },

    dateFocus() {
      const self = this;
      self.getDeafultTime();
    },

    getDeafultTime() {
      const self = this;
      const date = new Date();
      const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      const dateStr = hour + ':' + minutes + ':' + second;
      const timeTemp = [];
      timeTemp[0] = '00:00:00';
      timeTemp[1] = dateStr;
      self.defaultTime = timeTemp;
    },

    dateChange(val) {
      const self = this;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const threeMonthAgo = util.getThreeMonths(end);
      if (end - start > end - threeMonthAgo) {
        util.notify(self.$t('eventView.changeTimeRange'), 'warning', 3000);
        self.dateValue = [new Date().setTime(threeMonthAgo), new Date().setTime(end)];
      }
    },

    currentChange(val) {
      const self = this;
      self.page = val;
      self.params.filter = { page: val - 1, size: self.sizeNum };
      self.getReportList(self.params);
    },

    sizeChange(val) {
      const self = this;
      self.sizeNum = val;
      self.params.filter = { page: 0, size: val };
      self.getReportList(self.params);
    },

    searchData() {
      const self = this;
      const val = self.dateValue;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.params.beginTs = start;
      self.params.endTs = end;
      self.page = 1;
      const clause = {};
      clause.storeId = this.storeFilterObj.filterStoreIds;
      if (self.curReportType != null && self.curReportType !== -1) {
        clause.mode = self.curReportType;
      }
      if (self.curAppraise != null && self.curAppraise !== -1) {
        clause.status = self.curAppraise;
      }
      self.params.clause = clause;
      self.params.inspectTagId = self.inspectId === '-1' ? '' : self.inspectId;
      const search = self.searchInput.trim();
      if (search.length !== 0) {
        self.params.like = {
          tagName: search,
          submitterName: search,
          storeName: search
        };
      } else {
        self.params.like = {};
      }

      self.params.filter = { page: 0, size: self.sizeNum };
      self.ifSaveParams && self.saveSearchParams();
      self.ifSaveParams = true;
      self.getReportList(self.params);
    },

    checkSortType(typeId) {
      const self = this;
      switch (typeId) {
        case 0: self.params.order = { direction: 'desc', property: 'ts' }; break;
        case 1: self.params.order = { direction: 'asc', property: 'status' }; break;
        case 2: self.params.order = { direction: 'asc', property: 'storeName' }; break;
      }
      self.getReportList(self.params);
    },

    clickReport(item, index) {
      const self = this;
      sessionStorage.setItem('report_data', JSON.stringify(item.routeObj));
      self.$router.push({ name: 'reportDetails', params: { data: item.routeObj }});
    },

    sortChange(col) {
      let self = this;
      let order = col.order;
      if (order === 'ascending') {
        self.params.order = {
          'direction': 'asc',
          'property': col.column.property === 'datestr' ? 'ts' : col.column.property
        };
      } else if (order === 'descending') {
        self.params.order = {
          'direction': 'desc',
          'property': col.column.property === 'datestr' ? 'ts' : col.column.property
        };
      } else {
        self.params.order = {};
      }
      self.searchData();
    },

    getTagAll() {
      return new Promise((resolve, reject) => {
        GetInspectTagList().then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getInspectList() {
      const self = this;
      const inspectArr = await self.getTagAll();
      const newArr = [];
      const inspectList = [];
      inspectArr.forEach(_item => {
        if (self.curReportType === -1) {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            inspectList.push(_item);
          }
        } else if (self.curReportType === 0) {
          if (!newArr.includes(_item.id) && _item.mode === 0) {
            newArr.push(_item.id);
            inspectList.push(_item);
          }
        } else if (self.curReportType === 1) {
          if (!newArr.includes(_item.id) && _item.mode === 1) {
            newArr.push(_item.id);
            inspectList.push(_item);
          }
        }
      });
      self.inspectTableList = inspectList;
      self.inspectTableList.length > 0 && self.inspectTableList.unshift({ id: '-1', name: self.$t('remotePatrol.all') });
      if (inspectList.length !== 0) {
        self.inspectId = self.ifGetParamsFromCash ? self.inspectCatch : self.inspectTableList[0].id;
      } else {
        self.inspectId = '';
      }
      self.getInitReportList();
    },

    saveSearchParams() {
      const tempsearchParamsObj = this.storeFilterObj;
      tempsearchParamsObj.searchCondition = this.params;
      tempsearchParamsObj.curReportType = this.curReportType;
      const searchParamsObj = {
        path: 'inspectReport',
        params: tempsearchParamsObj
      };
      SearchConditionUtil.saveSearchCondition(searchParamsObj);
    },

    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('inspectReport');
      if (Object.keys(searchParams).length > 0) {
        this.dateValue[0] = new Date(searchParams.searchCondition.beginTs);
        this.dateValue[1] = new Date(searchParams.searchCondition.endTs);
        this.params.beginTs = searchParams.beginTs;
        this.params.endTs = searchParams.endTs;
        this.order = searchParams.order;
        this.filter = searchParams.filter;
        this.params = searchParams.searchCondition;
        this.curAppraise = searchParams.searchCondition.clause.status;
        this.curReportType = searchParams.curReportType;
        this.inspectCatch = searchParams.searchCondition.inspectTagId.length === 0 ? '-1' : searchParams.searchCondition.inspectTagId;
        this.searchParams = searchParams;
        this.ifGetParamsFromCash = true;
      } else {
        const start = typeof (this.dateValue[0]) === 'object' ? this.dateValue[0].getTime() : this.dateValue[0];
        const end = typeof (this.dateValue[1]) === 'object' ? this.dateValue[1].getTime() : this.dateValue[1];
        this.params.beginTs = start;
        this.params.endTs = end;
        this.params.filter = { page: 0, size: this.sizeNum };
        this.params.clause = { storeId: [] };
        this.ifGetParamsFromCash = false;
        this.searchParams = {};
      }
    },

    onStoreChange(storeObj) {
      console.log(storeObj);
      this.storeStr = storeObj.storeStr;
      this.storeFilterObj = storeObj;
    }
  },

  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true;
    if (from.name === 'reportDetails' && to.name === 'reports') {
      to.meta.isBack = true;
      next();
    } else {
      to.meta.isBack = false;
      next();
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.name !== 'reportDetails') {
      from.meta.keepAlive = false;
      next();
    } else {
      from.meta.keepAlive = true;
      next();
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
$qualified:#6097F3;
$noqualied:#FDBA40;
$suggestBack:#F1F6FE;
#el-containter{
    // padding-top: calc(60/1920*100vw);
    // padding-right: calc(30/1920*100vw);
    .report-header{
        margin-bottom: 20px;
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
                /* text-overflow: ellipsis; */
                width: 90%;
                display: inline-block;
                i{
                    margin-right: calc(15/1920*100vw);
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
                font-family: Roboto, "Microsoft YaHei", "Microsoft JhengHei", SimHei, Arial;
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
                  font-family: Roboto, "Microsoft YaHei", "Microsoft JhengHei", SimHei, Arial;
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
            .date-range{
                width:290px;
            }
            .iconbangzhu{
              font-size: calc(20/1920*100vw);
              margin-right: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1560px){
                margin-right: 10px;
              };
              @media screen and (min-width: 1024px) and (max-width: 1280px){
                margin-right: 5px;
              };
            }
            span{
                font-size: calc(14/1920*100vw);
                margin-right: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1560px){
                margin-right: 10px;
              };
            }
            @media screen and(max-width: 1280px){
              .en-span-class{
                //margin-right: 56px;
              }
            }
            .el-province{
                width: calc(160/1920*100vw);
                min-width: 85px;
                margin-right: calc(15/1920*100vw);
                @media screen and (min-width: 1280px) and (max-width: 1360px){
                  width: 85px;
                };
                @media screen and (max-width: 1022px){
                  margin-right: 10px;
                };
            }
          >>> .content .el-select.el-select--medium{
            @media screen and (min-width: 1280px) and (max-width: 1360px){
              width: 85px;
            };
            @media screen and (max-width: 1022px){
              margin-right: 10px;
            };
          }
            .search-input{
                width: calc(160/1920*100vw);
                @media screen and (min-width: 1280px) and (max-width: 1360px){
                  width: 85px;
                };
            }
        }
      .header-details{
        padding-bottom: 30px;
        padding-right: calc(20/1920*100vw);
      }
      .header-details:nth-child(1){
        padding-bottom: 0px;
      }
      .header-details:nth-child(2){
        padding-bottom: 15px;
      }
    }
    .report-content{
        padding-right: calc(20/1920*100vw);
        padding-left: calc(20/1920*100vw);
        .card-content{
            box-sizing: content-box;
            border: 1px solid $border;
            background-color: #fff;
            padding-top: 20px;
            padding-right: calc(20/1920*100vw);
            min-height: calc(100vh - 125px - 230px);
            /*margin-bottom: calc(20/1920*100vw);*/
            padding-bottom: 20px;
            //height: calc(730/1080*100vh);
        }
        .empty-content{
          font-size: 16px;
          color: $tab;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .card-header{
            text-align: left;
            padding: 0 calc(20/1920*100vw);
            padding-right: 0;
            margin-bottom: 15px;
            .list_card{
              float: right;
              .pattern_btn{
                display: inline-block;
                height: calc(36/1920*100vw);
                line-height: calc(36/1920*100vw);
                color:'#7d8cad';
                cursor: pointer;
                vertical-align: middle;
                .iconCard{
                  font-size: calc(18/1920*100vw);
                  margin-right:calc(10/1920*100vw);
                  vertical-align: middle;
                }
                .text-pattern{
                  font-size: calc(12/1920*100vw);
                  vertical-align: middle;
                }
              }
              .export-btn{
                border-color: $red;
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
                margin-left: calc(40/1920*100vw);
                vertical-align: middle;
                .btn-area{
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
              .en-export-btn{
                border-color: $red;
                height: calc(36/1920*100vw);
                margin: 0;
                padding: 0;
                font-size: calc(14/1920*100vw);
                line-height: calc(36/1920*100vw);
                color: #ffffff;
                border-width: 0;
                border-radius: 4px;
                width: calc(130/1920*100vw);
                min-width: 120px;
                margin-left: calc(40/1920*100vw);
                vertical-align: middle;
                .btn-area{
                  position: relative;
                  padding: 0 calc(6/1920*100vw);
                  height: calc(36/1920*100vw);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  .icon-excel{
                    margin-right: calc(10/1920*100vw);
                    width: calc(24/1920*100vw);
                    height: calc(24/1920*100vw);
                  }
                  .spanClass{
                    font-size: calc(14/1920*100vw);
                    display: inline-block;
                  }
                }
              }
            }
        }
    }
    .showCardHeight{
       margin-bottom: 60px;
    }
    .list-table{
      padding-left: calc(20/1920*100vw);
      margin-bottom: 20px;
    }
    .list-table >>> .report-cell-class .cell{
      padding-left: calc(20/1920*100vw) !important;
    }
    .list-table >>> .report-header-class .cell{
      padding-left: calc(20/1920*100vw) !important;
    }
    .report-card{
        margin-bottom: 20px;
        .cards{
            cursor: pointer;
            margin-left: calc(20/1920*100vw);
            border: 1px solid $border;
            // width: calc(200/1920*100vw);
            height: calc(240/1920*100vw);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            background-color: #fff;
            min-height: 160px;
            .item-img{
                position: absolute;
                right: 1px;
                top: 1px;
            }
          .item-flex{
            display: flex;
            flex-direction: column;
            padding-top: calc(40/1920*100vw);
            justify-content: space-around;
            height: calc(100% - 40/1920*100vw);
          }
            .item-header{
                width: 100%;
                //margin-top: calc(40/1920*100vw);
                overflow: hidden;
                .inspect-img{
                    margin-left: calc(20/1920*100vw);
                    float: left;
                }
                .store-name{
                    float: left;
                    width: calc(120/1920*100vw);
                    margin-left: calc(20/1920*100vw);
                    text-align: left;
                    width: calc(100% - 40/1920*100vw);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .name{
                        font-size: calc(18/1920*100vw);
                        font-weight: bold;
                        display: block;
                        color: $black;
                        overflow: hidden;
                        text-overflow: ellipsis
                }
                .inspect{
                    font-size: calc(12/1920*100vw);
                    color: $tab;
                }
            }
        }
        .item-icon{
          text-align: left;
          padding-left: calc(20/1920*100vw);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: calc(20/1920*100vw);
        }
        .inspectIcon{
          font-size: calc(60/1920*100vw);
          color: $border;
        }
        .item-score{
          color: $tab;
        }
        .score-num{
          font-size: calc(40/1920*100vw);
        }
        .score-unit{
          font-size: 12px;
        }
        .item-content{
            text-align: left;
            padding-left: calc(20/1920*100vw);
            /*position: absolute;*/
            /*bottom: 0;*/
            span{
                font-size: calc(14/1920*100vw);
                color: $tab;
                display: block;
                margin-bottom: calc(15/1920*100vw);
            }
        }
    }
}
.el-pat{
    //position: absolute;
    height: 30px;
    .el-pag{
        position: absolute;
        //float: right;
        right: calc(20/1920*100vw);
        bottom: 20px;
    }
}
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
      background: #f4f5f9 !important;
      border: 1px solid #E4E7ED  !important;
    }
    #el-menuscrollbar .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /* width */
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: rgb(255, 255, 255);
      border-radius: 8px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgb(201, 201, 202);
      border-radius: 8px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: rgb(162, 162, 163);
    }
</style>
<style>
@import '../../assets/css/pagination.css';
.date-picker-poper .el-button--text{
    visibility: hidden !important;
}
</style>
