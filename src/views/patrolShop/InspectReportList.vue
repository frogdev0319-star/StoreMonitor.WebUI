<template>
  <div class="flex-column" style="height: calc(100% - 20px)">
    <div>
      <store-filter
        :cached-params="searchParams"
        :is-patrol = "false"
        @storeChange = "onStoreChange"
      >
        <template v-slot:others>
          <div class="last-row" >
            <span style="margin-right: 16px; font-size:15px;width:83px;">{{ $t('remotePatrol.resultType') }}</span>
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
            <span style="margin-right: 16px; margin-left:24px;font-size:15px;width:83px;">{{ $t('remotePatrol.reportType') }}</span>
            <div class="flex-center report-type-area">
            <el-select
              v-model="curReportType"
              class="el-province"
              :placeholder="$t('remotePatrol.all')"
              size="mini"
              style="margin-right:0px;border:none;"
              @change="getInspectList"
            >
              <el-option
                v-for="item in reportTypeList"
                :key="item.mode"
                :label="item.label"
                :value="item.mode"/>
            </el-select>
            <div style="width:0px;height:25px;border:1px solid #ACAEB1; opacity:0.34;" />
              <el-select
                class="el-province"
               style="margin-left:0px;border:none;border-radius:0px;"
              v-model="inspectId"
              :placeholder="$t('insSettingView.selectPost')"
              size="mini">
              <el-option
                v-for="item in inspectTableList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            </div>
          </div>
        </template>
      </store-filter>
    </div>
    <div id="el-containter" class="flex-column spacer" style="margin-left:0px">
      <div class="report-header">
        <div class="flex-center" style="padding-top: 0;">
          <date-time-selector
           class="time-selector"
           @change="dateChange" 
          :dateTimeValue = dateValue /> 
          <div class="flex-center fullWidth" style="margin-left: 20px">
            <div class="search-content flex-center" style="margin-right: 20px">
              <div class="search-label">{{ $t('remotePatrol.keywords') }}</div>
              <el-input v-model="searchInput" size="mini" class="search-input shadow-light" style="margin-left: 16px;" clearable/>
            </div>
            <div class="spacer"></div>
            <el-button
              class="storevue-button-search"
              type="primary"
              size="mini"
              @click="searchData"
            >
              <span style="margin-right: 0">{{ $t('remotePatrol.search') }}</span>
            </el-button>
          </div>
        </div>
        <!-- <selected-stores :store-str="storeStr"/> -->
      </div>
      <div class="report-content loading spacer paper">
        <div
          v-loading="isLoading"
          v-if="reportList.length !== 0"
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading ">
          <div v-if="reportList.length !== 0" class="card-header">
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
                @click="getReportListOfCard"
                @mouseover="isHoverCard=true"
                @mouseout="isHoverCard=false">
                <i class="iconfont icon-suolvetu iconCard"/>
                <span class="text-pattern">{{ $t('remotePatrol.cardStyle') }}</span>
              </div>
              <div style="width:1px;height:calc(20/1920*100vw);background-color:#e3e9f4;display:inline-block;margin:0 15px;"/>
              <div
                :style="isHoverList || !ShowCard ? 'color:#f31d65':''"
                class="pattern_btn"
                @click="()=>{ShowCard=false; page=1;}"
                @mouseover="isHoverList=true"
                @mouseout="isHoverList=false">
                <i class="iconfont icon-liebiao iconCard"/>
                <span class="text-pattern">{{ $t('remotePatrol.listStyle') }}</span>
              </div>
              <delay-button
                :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                class="export-report-btn"
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
          <div v-if="ShowCard" class="showCardHeight flex">
              <div v-for="(item,index) in reportList"  :key="index" class="report-card">
                <div class="cards shadow-light" @click="clickReport(item,index)">
                  <div class="flex-center margin-bottom-5">
                    <div class="card-title">{{ item.storeName }}</div>
                    <img :src="item.mode===1?onsiteIcon:remoteIcon" :height="20" alt="" >
                  </div>
                  <div class="margin-bottom-5">{{ item.tagName }}</div>
                  <div style="margin-bottom: 12px" class="flex">
                    <div :class="lang.indexOf('zh') == -1?'status-tag-en':'status-tag' "
                      :style="{
                        0: {'color':'#e22472','background-color':'#ffecf4'},
                        1: {'color':'#f57848','background-color':'#ffefeb'},
                        2: {'color':'#59ab22','background-color':'#e8f6de'}
                      }[item.statusCode]"
                    >{{item.status}}</div>
                    <div v-if="item.standard!=-1" style="margin-left: calc(10/1920*100vw)" :class="(lang.indexOf('zh') == -1)?'status-tag-en':'status-tag' "
                      :style="item.standard==1 ? {'color':'#59ab22','background-color':'#e8f6de'}: {'color':'#f57848','background-color':'#ffefeb'}"
                    >{{item.standard==1 ? $t('remotePatrol.goalAchieved') : $t('remotePatrol.farBehind')}}</div>
                  </div>
                  <!-- //0: danger,1: improve,2: pass -->
                  <div class="flex-center">
                    <div class="score">{{ item.totalScore }}</div>
                    <div v-if="lang.indexOf('zh') !== -1" class="score-unit">
                      {{ $t('insSettingView.scores') }}
                    </div>
                  </div>
                  <div class="margin-bottom-5">{{ $t('remotePatrol.submitter') }} {{ item.submitterName }}</div>
                  <div>{{ item.datestr }}</div>
                </div>
              </div>
          </div>
          <div v-else class="list-table">
            <table-only
              ref="elTP"
              class="table-white"
              :table-themes="white"
              :column-data="reportInfoTable"
              :table-data="reportList"
              :highlight-current-row= "true"
              :is-loading-data="isLoading"
              :allowRowExpand = "false"
              :showBorder = "false"
              :default-sort = "{prop: 'datestr', order: 'descending'}"
              :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '6px',}" 
              :tableHeight = "760"
              :cellStyle="{backgroundColor: '#fff !important'}"
              @handleOperation="clickReport"
              @sortChange="sortChange"
              @row-click = "clickReport"
            />
            <!--<el-table
              :data="reportList"
              :highlight-current-row="true"
              :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
              :cell-style="cellStyle"
              :cell-class-name="cellClass"
              :header-cell-class-name="headerClass"
              align="left"
              stripe
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
            </el-table>-->
          </div>
          
        </div>
        
        <div
          v-loading="isLoading"
          v-else
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading">
          <div class="empty-content">{{ noData }}</div>
        </div>
        <div class="el-pat">
            <!--<el-pagination
              :page-size="sizeNum"
              :total="total"
              :current-page="page"
              :page-sizes="[12,24,50,100]"
              background
              small
              layout="jumper,total, prev, pager, next,sizes"
              class="el-pag"
              @current-change="currentChange"
              @size-change="sizeChange"/>-->
              <tbl-pagination-only
              :btn-style="{backgroundColor:'transparent'}"
              :total="total"
              :current-page="page"
              :page-size="sizeNum"
              layout = "prev,pager, next,sizes,slot"
              @sizeChange="sizeChange"
              @currentChange="currentChange"
            />
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getInspectReportList, GetInspectTagList } from '@/api/inspect';
import util from '@/common/util';
import { mapGetters } from 'vuex';
import StoreFilter from '@/components/StoreFilter';
import DelayButton from '@/components/DelayButton';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DateTimeSelector from '@/components/DateTimeSelector';
import SelectedStores from "@/components/SelectedStores";
import TblPaginationOnly from '@/components/TblPaginationOnly';
import { getInspectReportInfo } from '@/api/inspect';//為了取是否有設置評分
import TableOnly from '@/components/TableOnly';
export default {
  name: 'InspectReportList',
  components: {
    DateTimeSelector,
    SelectedStores,
    DelayButton,
    StoreFilter,
    TblPaginationOnly,
    TableOnly
  },
  data() {
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      videoSrc: require('../../../static/img/monitor.png'),
      remoteIcon: require('../../../static/img/remote.png'),
      onsiteIcon: require('../../../static/img/onsite.png'),
      searchContent: false,
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
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '60',
          'maxWidth': '60',
          'isExpand': false
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable': false,
          'width': 60,
          'maxWidth': 60,
          'isExpand': false

        },
        {
          'prop': 'storeName',
          'label': this.$t('remotePatrol.patrolStore'),
          'sortable': false,
          'width': 80,
          'maxWidth': 80,
          'isExpand': false
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'width': 60,
          'maxWidth': 60,
          'isExpand': false
        },
        {
          'prop': 'storeType',
          'label': this.$t('remotePatrol.storeType'),
          'sortable': false,
          'width': 60,
          'maxWidth': 60,
          'isExpand': false
        },
        {
          'prop': 'submitterName',
          'label': this.$t('scheduleView.InspectPerson'),
          'sortable': false,
          'width': 100,
          'maxWidth': 100,
          'isExpand': false
        },
        {
          'prop': 'tagName',
          'label': this.$t('overview.patrolLists'),
          'sortable': false,
          'width': 100,
          'maxWidth': 100,
          'isExpand': false
        },
        {
          'prop': 'modeText',
          'label': this.$t('remotePatrol.patrolWay'),
          'sortable': false,
          'width': 65,
          'maxWidth': 65,
          'isExpand': false,
        },
        {
          'prop': 'status',
          'label': this.$t('remotePatrol.patrolResult'),
          'sortable': false,
          'width': 60,
          'maxWidth': 60,
          'isExpand': false
        },
        {
          'prop': 'totalScore',
          'label': this.$t('remotePatrol.patrolScore'),
          'sortable': true,
          'width': 65,
          'maxWidth': 65,
          'isExpand': false
        },
        {
          'prop': 'datestr',
          'label': this.$t('remotePatrol.patrolDate'),
          'sortable': 'custom',
          'width': 100,
          'maxWidth': 100,
          'isExpand': false
        },
        {
          'prop': 'operator',
          'label': this.$t('titleView.operation'),
          'sortable': false,
          'width': 50,
          'maxWidth': 50,
          'isExpand': false,
          'isCellClick':true,
          'align': 'left',
          'customIcon': true,
          'src' : require('@/../static/img/icon_pen.png'),
          'methods': 'set'
        }
      ],
      columnOperationData: {
        label: this.$t('titleView.operation'),
        minWidth: '60',
        align: 'left',
        customIcon: true,
        src : require('@/../static/img/icon_pen.png'),
        methods: 'set'
        /*operation: [
          {
            lable: '',
            src : 'penSrc',
            methods: 'set'
          }
        ]*/
      },
      storeList: [],
      searchInput: '',
      sizeNum: 10,
      dateValue: [],
      curReportType: -1,
      reportTypeList: [
        { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        { 'mode': 0, 'label': this.$t('remotePatrol.remotePatrol') },
        { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') }
      ],
      curAppraise: -2,
      appraiseList: [
        { 'status': -1, 'label': this.$t('remotePatrol.all') },
        { 'status': 0, 'label': this.$t('remotePatrol.dangerous') }, //poor
        { 'status': 1, 'label': this.$t('remotePatrol.improve') }, //fair
        { 'status': 2, 'label': this.$t('overview.echartGood') } //good
      ],
      storeStr: '',
      total: 0,
      page: 1,
      params: {},
      storeDataList: [],
      storeIdList: [],
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
        this.$t('remotePatrol.patrolStore'),
        this.$t('remotePatrol.code'),
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
      searchParams: {},
      ifSearchData: true,
      isScore:true,
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
        self.initData();
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        },
        300);
        self.ifSaveParams = true;
        self.ifSearchData = true;
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
      self.storeStr = '';
      self.dateValue = [new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24,
        new Date(this.$moment(new Date()).endOf('day'))];
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
      // const start = typeof (that.dateValue[0]) === 'object' ? that.dateValue[0].getTime() : that.dateValue[0];
      // const end = typeof (that.dateValue[1]) === 'object' ? that.dateValue[1].getTime() : that.dateValue[1];
      // that.params.beginTs = start;
      // that.params.endTs = end;
      // that.params.filter = { page: 0, size: that.total };
      // const storeIds = this.storeFilterObj.filterStoreIds;
      // that.params.clause = { storeId: storeIds };
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = that.exportReportHeader;
        const filterVal = ['province', 'city', 'storeName', 'code', 'storeType', 'submitterName', 'tagName',
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

   getReportList(p) {
      //console.log("p:",p);
      var params = {beginTs:p.beginTs,endTs:p.endTs,clause:p.clause,like:p.like,filter:p.filter,order:p.order,inspectTagId:p.inspectTagId}
      const self = this;
      params.endTs = params.endTs - params.endTs % 1000 + 999;
      if (params.clause.storeId.length === 0) {
        this.setNoData();
        return;
      }
      return new Promise((resolve) => {
        //console.log("params:",params);
        getInspectReportList(params).then(async(res) => {
          const errCode = res.errCode;
          let data = [];
          if (errCode === 0) {
            data = res.data.content;
          }
          const temp = [];
          self.isLoading = true;
          for(const item of data){
          //data.forEach(async (item,index) => {
            const reportObj = {};
            reportObj.province = item.province;
            reportObj.city = item.city;
            reportObj.id = item.id;
            reportObj.datestr = util.getDateStr(item.ts);
            reportObj.storeName = item.storeName;
            reportObj.tagName = item.tagName;
            reportObj.submitterName = item.submitterName;
            reportObj.submitter = item.submitter;
            reportObj.routeObj = item;
            reportObj.mode = item.mode;
            reportObj.totalScore = item.type === 0 ? "--" : item.totalScore;
            reportObj.code = item.code !== null ? item.code : '--';
            reportObj.standard = item.standard;
            reportObj.standardMsg = util.setStandardMsg(reportObj.standard);
            reportObj.statusCode = item.status; 
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
          }
          //);
          self.reportList = temp;
          self.total = Math.ceil(res.data.totalElements/self.sizeNum);
          self.isLoading = false;
          if (temp.length === 0) {
            self.noData = self.$t('deviceView.noData');
          }
          resolve(temp);
        }).catch(err => {
        });
      });
    },

    getReportInfo(reportId){
      return new Promise((resolve) => {
        getInspectReportInfo({ reportIds: [reportId] }).then(res=>{
          var allRemarkItemsFlag = true;
          if (res.errCode === 0 && res.data.length > 0) {
            allRemarkItemsFlag = (res.data[0].info.type != 1);
          }
          resolve(allRemarkItemsFlag);
        }).catch(err => {
          console.log('InspectReportList-getReportInfo: ' + err);
        });
      });
    },

    getIconSrc(status) {
      const statusAndLangAndIconMap = [
        {
          status: 0,
          statusStr: this.$t('overview.danger'), // Poor
          children: [{
            'zh': require('../../../static/img/dangerous_cn.png'),
            'zhtw': require('../../../static/img/dangerous_tw.png'),
            'en': require('../../../static/img/dangerous_en.png'),
            'ja-JP': require('../../../static/img/dangerous_ja.png'),
            'ko-KR': require('../../../static/img/dangerous_ko.png')
          }]
        },
        {
          status: 1,
          statusStr: this.$t('overview.improve'), // Fair
          children: [{
            'zh': require('../../../static/img/improved_cn.png'),
            'zhtw': require('../../../static/img/improved_cn.png'),
            'en': require('../../../static/img/improved_en.png'),
            'ja-JP': require('../../../static/img/improved_ja.png'),
            'ko-KR': require('../../../static/img/improved_ko.png')
          }]
        },
        {
          status: 2,
          statusStr: this.$t('overview.echartGood'), // Good
          children: [{
            'zh': require('../../../static/img/good_cn.png'),
            'zhtw': require('../../../static/img/good_cn.png'),
            'en': require('../../../static/img/good_en.png'),
            'ja-JP': require('../../../static/img/good_ja.png'),
            'ko-KR': require('../../../static/img/good_ko.png')
          }]
        }
      ];

      const statusAndIconObj = {};
      const filterMap = statusAndLangAndIconMap.filter(map => map.status === status);
      if (filterMap.length > 0) {
        statusAndIconObj.status = filterMap[0].statusStr;
        for (const lang in filterMap[0].children[0]) {
          if (lang === this.lang) {
            statusAndIconObj.iconSrc = filterMap[0].children[0][lang];
          }
        }
      }
      return statusAndIconObj;
    },

    getInitReportList() {
      this.getReportList(this.params);
    },

    dateChange(val) {
      const self = this;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
      self.dateValue[1] = self.dateValue[1];
      self.inputSearchValue = '';
    },

    currentChange(val) {
      const self = this;
      self.page = val.page;
      self.params.filter = { page: val.page - 1, size: self.sizeNum };
      self.getReportList(self.params);
    },

    sizeChange(val) {
      const self = this;
      self.sizeNum = val.size;
      self.params.filter = { page: 0, size: val.size };
      self.getReportList(self.params);
    },

    searchData() {
      const self = this;
      const val = self.dateValue;
      if (val.length === 0) return;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.params["beginTs"] = start;
      self.params["endTs"] = end;
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
      typeof (self.params.inspectTagId) === 'string' && delete self.params.inspectTagId;
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
      self.saveSearchParams();
      self.getReportList(self.params);
    },

    setNoData() {
      this.reportList = [];
      this.total = 0;
      this.isLoading = false;
      this.noData = this.$t('deviceView.noData');
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
      const self = this;
      const order = col.order;
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
      let tempsearchParamsObj = this.storeFilterObj;
      tempsearchParamsObj.curReportType = this.curReportType;
      tempsearchParamsObj.clause={
        storeId: this.storeFilterObj.filterStoreIds
      }
      tempsearchParamsObj.inspectTagId = this.inspectId;
      tempsearchParamsObj.clause = this.params.clause
      console.log("Save ")
      console.log(tempsearchParamsObj)
      const searchParamsObj = {
        path: 'inspectReport',
        params: tempsearchParamsObj
      };
      SearchConditionUtil.saveSearchCondition(searchParamsObj);
    },

    getSearchParams() {
      // console.log("Get SEarch Parameter");
      const searchParams = SearchConditionUtil.getSearchCondition('inspectReport');
      // console.log(searchParams)
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
   
   
      if (Object.keys(searchParams).length > 0) {
        // console.log("Get Old Params")
        this.order = searchParams.order;
        this.filter = searchParams.filter;
        this.params = searchParams;
        this.checkSortType(this.curSortType);
        this.curAppraise = searchParams.clause.status;
        this.curReportType = searchParams.curReportType;
        this.inspectCatch = !searchParams.inspectTagId ? '-1' : searchParams.inspectTagId;
        this.searchParams = searchParams;
        this.ifGetParamsFromCash = true;
        if(!searchParams.curProvince){
          searchParams.curProvince =[];
        }
        if(!searchParams.curCity){
          searchParams.curCity =[];
        }
        if(searchParams.jump){
          console.log("Jump to ")
          this.params.jump = false;
          this.dateValue = [new Date().setTime(this.params.beginTs), new Date().setTime(this.params.endTs)];
          this.saveSearchParams();
          this.searchData();
        }
        
      } else {
        this.params.filter = { page: 0, size: this.sizeNum };
        this.params.clause = { storeId: [] };
        this.ifGetParamsFromCash = false;
        this.curAppraise =-1;
        this.searchParams = {};
      }
      if(!this.params.beginTs)this.params.beginTs = this.dateValue[0].valueOf();
      if(!this.params.endTs)this.params.endTs = this.dateValue[1].valueOf();
  
  
    },
    

    onStoreChange(storeObj) {
      // console.log(storeObj)
      this.storeStr = storeObj.storeStr;
      this.storeFilterObj = storeObj;
      this.ifSearchData && this.searchData();
      this.ifSearchData = false;
    },

    getReportListOfCard() {
      this.ShowCard = true;
      this.checkSortType(this.curSortType);
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
$filterWidth: (100%-706);
.el-radio {
  >>> .el-radio__inner {
    border-color: #d9dde1;
    background: #fff;
    width: calc(16/1920*100vw);
    height: calc(16/1920*100vw);
  }
  &.is-checked {
    >>> .el-radio__inner {
      border-color: #2c90d9;
      background: #e0f2ff;
      width: calc(16/1920*100vw);
      height: calc(16/1920*100vw);
    }
    >>> .el-radio__inner::after {
      width: 8px;
      height: 8px;
      background: #2c90d9;
    }
  }
  >>> span {
    font-size: calc(15/1920*100vw);
  }
}
.search-label{
  min-width: 45px;
  text-align: left;
  align-self: center;
  font-family: NotoSansCJKTC;
  font-size: 15px;
  font-weight: normal;
  word-break: keep-all;
  padding-right: 16px;
  
}
.report-type-area{
    width:calc(346/1440*100vw);
    height: 36px;
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
#el-containter{
    
    .report-header{
        margin-top: 20px;
        margin-bottom: 20px;
        .header-details{
            text-align: left;
            padding-left: calc(30/1920*100vw);
            position: relative;
            .search-content{
                display: inline-block;
            }
            .date-range{
                width:300px;
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
        padding-bottom: 15px;
        padding-right: calc(20/1920*100vw);
      }
      .header-details:nth-child(1){
        padding-bottom: 0px;
      }
    }
    .report-content{
        // padding-right: calc(20/1920*100vw);
        // padding-left: calc(20/1920*100vw);
        .card-content{
          padding: calc(32/1920*100vw) calc(24/1920*100vw);
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
            padding: 0 calc(8/1920*100vw);
            padding-right: 0;
            margin-bottom: 15px;
            .list_card{
              float: right;
              display: flex;
              align-items: center;
              .pattern_btn{
                display: inline-block;
                height: calc(36/1920*100vw);
                line-height: calc(36/1920*100vw);
                color:#7d8cad;
                cursor: pointer;
                vertical-align: middle;
                .iconCard{
                  font-size: calc(18/1920*100vw);
                  margin-right:calc(10/1920*100vw);
                  vertical-align: middle;
                }
                .text-pattern{
                  font-size: calc(15/1920*100vw);
                  vertical-align: middle;
                }
              }
              .export-report-btn{
                background-color: #fff;
                color: #006ab7;
                font-size: calc(15/1920*100vw);
                margin-left: calc(30/1920*100vw);
              }
            }
        }
    }
    
    .showCardHeight{
      flex-wrap: wrap;
      height: calc(450/1440*100vw);
      overflow: auto;
    }
    .list-table{
      margin-bottom: 20px;
    }
    .list-table >>> .report-cell-class .cell{
      padding-left: calc(20/1920*100vw) !important;
    }
    .list-table >>> .report-header-class .cell{
      padding-left: calc(20/1920*100vw) !important;
    }
    .list-table{
      
      .table-white {
        /deep/
        .el-table{
          box-shadow: none !important;
          border: none !important;
          background-color: #fff;
          padding-left: 12px;
        }
      }
    }
    
    .report-card{
        margin-bottom: calc(20/1440*100vw);
        .cards{
          .card-title {
            width: calc(150/1440*100vw);
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
             font-size: calc(15/1440*100vw);
             margin-right: calc(10/1440*100vw);
          }
          div {
            text-align: left;
          }
            padding: calc(15/1440*100vw);
            cursor: pointer;
            margin-right: calc(20/1440*100vw);
            border: 1px solid #e3e9f4;
            font-size: calc(12/1440*100vw);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
            width: calc(200/1440*100vw);
            height: calc(210/1440*100vw);
            position: relative;
            color: #69727c;
            min-height: calc(160/1440*100vw);
            .item-img{
              position: absolute;
              right: 1px;
              top: 1px;
            }
          .item-flex{
            display: flex;
            flex-direction: column;
            padding-top: calc(40/1440*100vw);
            justify-content: space-around;
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
        .score {
          font-size: calc(32/1440*100vw); 
          margin-right: calc(5/1440*100vw);
          margin-bottom: calc(30/1440*100vw);
        }
        .status-tag {
          border-radius: calc(5/1440*100vw); 
          padding: calc(2/1440*100vw) calc(15/1440*100vw);
        }
        .status-tag-en{
          font-size: 14px;
          border-radius: calc(5/1440*100vw); 
          padding: calc(2/1440*100vw) calc(15/1440*100vw);
        }
        .margin-bottom-5 {
          margin-bottom: calc(5/1440*100vw);
        }
        .item-score{
          color: $tab;
        }
        .score-num{
          font-size: calc(40/1440*100vw);
        }
        .score-unit{
          font-size: 12px;
        }
        .item-content{
            text-align: left;
            padding-left: calc(20/1920*100vw);
            span{
              font-size: calc(14/1920*100vw);
              color: $tab;
              display: block;
              margin-bottom: calc(15/1920*100vw);
              overflow: hidden;
              text-overflow: ellipsis;
            }
        }
    }
}
.el-pat{
    //position: absolute;
    height: 30px;
    margin-top: -10px;
    .el-pag{
        position: absolute;
        //float: right;
        right: calc(20/1920*100vw);
        bottom: 0px;
    }
}
}
.standard-btn{
  position: absolute;
  top: 0;
}
.last-row{
      display: flex;
      flex-direction: row;
      width:100%;
      margin-left: 42px;
      height: 36px;
      align-items: flex-start;
      align-items:center;
      justify-content: space-between;
      padding-right: (180/1920*100vw);
}
    .time-selector{
      margin-right: calc(30/1920*100vw);
    }
</style>
<style scoped>

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
</style>
