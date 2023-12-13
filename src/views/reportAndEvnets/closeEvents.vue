<template>
  <div class="flex-column" style="height: calc(100% - 20px)">
    <div>
      <store-filter
        :cached-params="searchParams"
        :is-patrol = "false"
        @storeChange = "onStoreChange"
      >
        <template v-slot:others>
          <div class="last-row"  style="justify-content: flex-start">

            <!-- 總評類型 -->
            <!-- <span style="margin-right: 16px; font-size:calc(15/1920*100vw);width:83px;">{{ $t('remotePatrol.resultType') }}</span>
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
            </el-select> -->

            <!-- 報表類型 -->
            <span style="margin-right: 16px; margin-left:24px;font-size:calc(15/1920*100vw);width:83px;">{{ $t('remotePatrol.reportType') }}</span>
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
          v-if="eventTableData.length !== 0"
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading ">

          <!-- 報告列表 -->
          <div class="list-table for_pre">
            <table-only
              ref="elTP"
              class="table-white table_style"
              :column-data="reportInfoTable"
              :table-data="eventTableData"
              :highlight-current-row= "true"
              :is-loading-data="isLoading"
              :tableAction ="columnOperationData"
              :allowRowExpand = "false"
              :showBorder = "false"
              :default-sort = "{prop: 'datestr', order: 'descending'}"
              :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '6px',}" 
              :tableHeight = "760"
              :cellStyle="{backgroundColor: '#fff !important'}"
              @sortChange="sortChange"
              @handleOperation="handleEmitOperation"
            />
          </div>
        </div>
        <div
          v-loading="isLoading"
          v-else
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading">
          <div class="empty-content">{{ noData }} </div>
        </div>
        
        <div class="el-pat"  v-if="eventTableData.length > 0">
          <div class="pageSizeTitle" style="color: #666">共有 <b style="font-size: 16px"> {{totalEvents}} </b> {{ $t('remotePatrol.numReports') }}</div>
    
          <tbl-pagination-only
            :btn-style="{backgroundColor:'transparent'}"
            :total="total"
            :current-page="currentPage"
            :page-size="sizeNum"
            layout = "prev,pager, next,sizes,slot"
            @sizeChange="handlePagination"
            @currentChange="handlePagination"
          />
        </div>
      </div>
    </div>
    <dialog-pop
      title="修改已結案事件"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showUpdateEvent"
      :isWarning="true"
      @cancelHandler="cancelUpdate()"
      @confirmHandler="confirmUpdate(updateEventId)"
    >
      <div class="dialog-slot">
        <div class="dialog-content">請確認是否變更狀態為 <span style="color: red;"> <b>未處理</b></span>   ? </div>
      </div>
    </dialog-pop>


  </div>
</template>
<script>
import { 
  getInspectReportList, 
  GetInspectTagList,
  downLoadInspectReportEntireDetail,
  getAllReportIds,
  GetMysteryInspectTagList ,
  getInspectStatus
} from '@/api/inspect';

import {getEventList,} from '@/api/event';
import {handleEventStatus} from '@/api/reportAndEvent';

import util from '@/common/util';
import { mapGetters } from 'vuex';
import StoreFilter from '@/components/StoreFilter';
import DelayButton from '@/components/DelayButton';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DateTimeSelector from '@/components/DateTimeSelector';
import SelectedStores from "@/components/SelectedStores";
import TblPaginationOnly from '@/components/TblPaginationOnly';
import { getInspectReportInfo} from '@/api/inspect';//為了取是否有設置評分
import TableOnly from '@/components/TableOnly';
import PermissionHelper from '@/api/PermissionHelper';
import DialogPop from '@/components/DialogPop';
export default {
  name: 'InspectReportList',
  components: {
    DateTimeSelector,
    SelectedStores,
    DelayButton,
    StoreFilter,
    TblPaginationOnly,
    TableOnly,
    DialogPop
  },
  data() {
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      searchContent: false,
      
      curSortType: 0,
      ShowCard: true,
      isHoverList: false,
      isHoverCard: false,
      eventTableData: [],


      reportTableData: [],
      reportInfoTable: [
        {
          'prop': 'subject',
          'label': this.$t('eventView.name'),
          'sortable': false,
          'width': '140',
          'maxWidth': '150',
        },
        {
          'prop': 'inspectTagName',
          'label': this.$t('overview.patrolLists'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'assigneeName',
          'label': this.$t('eventView.submitter'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'ts',
          'label': this.$t('eventView.createTs'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'province',
          'label': this.$t('remotePatrol.regionI'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'city',
          'label': this.$t('remotePatrol.regionII'),
          'sortable':false,
          'width': '140',
          'maxWidth': '150',
        },
        {
          'prop': 'storeName',
          'label': this.$t('eventView.stores'),
          'sortable': false,
          'width': '145',
          'maxWidth': '180',
        },
        {
          'prop': 'code',
          'label': this.$t('remotePatrol.code'),
          'sortable': false,
          'width': '145',
          'maxWidth': '180',
        },
      ],
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '100',
        align: 'center',
        operation: [
          {
            lable: '',
            icon: 'icon-doc',
            methods: 'doc'
          },
          {
            lable: '',
            icon: 'icon-edit',
            methods: 'edit'
          }
        ]
      },
      showUpdateEvent: false,
      updateEventId: '',
      total: 10,
      currentPage: 1,
      curSizeNum: 10,
      sizeNum: 50,
      storeList: [],
      searchInput: '',
      sizeNum: 10,
      dateValue: [],
      curReportType: -1,
      reportTypeList: [
        { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        { 'mode': 0, 'label': this.$t('remotePatrol.remotePatrol') },
        { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') },
        // 門店監控
        { 'mode': 2, 'label': this.$t('immediatePush.storeMonitoring') },
        // 即時事件
        { 'mode': 3, 'label': this.$t('immediatePush.immediateEvent')  }
      ],
      curAppraise: -1,
      appraiseList: [
        { 'status': -1, 'label': this.$t('remotePatrol.all') },
        { 'status': 0, 'label': this.$t('remotePatrol.dangerous') }, //poor
        { 'status': 1, 'label': this.$t('remotePatrol.improve') }, //fair
        { 'status': 2, 'label': this.$t('overview.echartGood') } //good
      ],
      storeStr: '',
      
      params: {},
      storeDataList: [],
      storeIdList: [],
      lang: this.$i18n.locale,
      isFirstLoad: false,
      storeName: '',
      showMonthDrap: false,
      showStoreContent: false,
      checkAllStore: false,
      noData: this.$t('deviceView.noData'),
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
        this.$t('remotePatrol.patrolDate'),
        this.$t('remotePatrol.signInTime')
      ],
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

   

      inspectStatus:'',
      totalEvents: 0
    };
  },

  created() {
    this.isFirstLoad = true;
  },
  computed: {
    iconSrcHeight() {
      return (this.varyWindowWidth / 1920) * 50;
    },
    ...mapGetters({ accountChanged: 'accountChanged',mimicModeChanged:'mimicMode' })
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
    },
    mimicModeChanged(val){
        console.log("mimicMode val:",val);
        this.isLoading = true;
        this.ifSearchData = true;
        this.getInspectList();
        //this.initData();
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
    async initData() {
      
      this.searchInput = '';
      this.storeStr = '';
      this.dateValue = [new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24,
        new Date(this.$moment(new Date()).endOf('day'))];
      this.reportList = [];
      this.curSortType = 0;
      this.storeName = '';
      this.showMonthDrap = false;
      this.showStoreContent = false;
      this.checkAllStore = false;
      this.curReportType = -1;
    
      await this.getSearchParams();
      await this.getInspectList();
      await this.searchData();
      
    },
    async getEvents(params){
      this.isLoading = true;
      await getEventList(params).then(res=>{
        console.log('res.data --->', res.data)
  
        this.totalEvents = res.data.totalElements
        this.total = res.data.totalPages
        
        this.eventTableData = res.data.content
        this.eventTableData.forEach(i => {
          i.ts = util.getDateStr(i.ts)
        })
  
        this.isLoading = false;
      }).catch(err => {
        this.isLoading = false;
        console.log('error' + err);
      });
    },

    searchData() {
      console.log("Search Data" + this.dateValue)
      const self = this;
      const val = self.dateValue;
      if (val.length === 0) return;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.params["beginTs"] = start;
      self.params["endTs"] = end;
      self.page = 1;
      const clause = {
        status: [2,4],
        storeId: [...this.storeFilterObj.filterStoreIds]
      };


      // if (self.curReportType != null && self.curReportType !== -1) {
      //   clause.mode = self.curReportType;
      // }
      // if (self.curAppraise != null && self.curAppraise !== -1) {
      //   clause.status = self.curAppraise;
      // }
      self.params.clause = clause;
      self.params.inspectTagIds  = []

      var curInspectId = self.inspectId === '-1' ? '' : self.inspectId;
      if(curInspectId !== '') self.params.inspectTagIds .push(curInspectId)

      
      const search = self.searchInput.trim();
      if (search.length !== 0) {
        self.params.like = {
          subject: search,
          assignerName: search,
          storeName: search
        };
      } else {
        self.params.like = {};
      }
      
      if(self.params.jump){ //跳轉
          console.log("1.ump to ")
          self.params.jump = false;
          self.dateValue = [new Date().setTime(this.params.beginTs), new Date().setTime(this.params.endTs)];
          self.params.searchMysteryMode = this.params.searchMysteryMode;
          self.params.submitter = this.params.submitters;
          //this.saveSearchParams();
          //this.searchData();
          // console.log("searchData>>>>SearchParams:",self.params)
          this.ifSearchData = false;
        }else{
          // console.log("searchData>>>>no jump:",self.params)
          self.params.searchMysteryMode = PermissionHelper.enableMimicMode ? 1 : -1;
        }
      
      

      self.params.filter = { page: 0, size: self.sizeNum };
      self.params.order = { 
        direction: "desc",
        property: "ts"
      };
  
      delete self.params.curStore
      delete self.params.filterStoreIds
      delete self.params.storeStr
      delete self.params.storeGroupString
      delete self.params.storeTypeString
      delete self.params.curSelectedStore


      if(this.curReportType == -1){ self.params.sourceType = null}
      else if(this.curReportType == 0){self.params.sourceType = 2}
      else if(this.curReportType == 1){self.params.sourceType = 1}
      else if(this.curReportType == 2){self.params.sourceType = 0}
      else if(this.curReportType == 3){self.params.sourceType = 3}
      
      if (self.params.clause.storeId.length === 0) {
        console.log("No Data")
        this.setNoData();
        return;
      }
      console.log("###",self.params)
      self.saveSearchParams();
      self.getEvents(self.params);
    },


    handleEmitOperation(val){
      console.log('val' , val)
      switch (val.method) {
        case  'doc':
          this.handleEventDoc(val)
          break;

        case'edit':
          this.showUpdateEvent = true
          this.updateEventId = val.row.id
          break;
      
        default:
          break;
      }
    },

    handleEventDoc(val){
      console.log('val :>> ', val);
      this.event = val.row;
      sessionStorage.setItem('needUpdateEvent', true);
      sessionStorage.setItem('event', JSON.stringify(this.event));
      sessionStorage.setItem('queryparams', JSON.stringify(this.params));
      this.$router.push({ name: 'needUpdateEvent', params: { event: this.event }});
    },
  
    cancelUpdate(){
      this.showUpdateEvent = false
    },

    confirmUpdate(updateEventId){
      var rowID = {eventId: updateEventId}
      this.showUpdateEvent = false
      this.isLoading = true;   
      handleEventStatus(rowID).then(res=>{
        console.log('res :>> ', res);
        this.getEvents(this.params);
      }).catch(err => {
        this.isLoading = false;
      })
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
      console.log("1.Get Report List" , p)
      var params = {
        beginTs:p.beginTs,
        endTs:p.endTs,
        clause:p.clause,
        like:p.like,
        filter:p.filter,
        order:p.order,
        inspectTagId: p.inspectTagId != '-1' ? p.inspectTagId : null, 
        searchMysteryMode : PermissionHelper.enableMimicMode ? 1 : p.searchMysteryMode
      }
      console.log('params ~~~~~>> ', params);
      const self = this;
      params.endTs = params.endTs - params.endTs % 1000 + 999;
      if (params.clause.storeId.length === 0) {
        console.log("No Data")
        this.setNoData();
        return;
      }
      console.log("***current user:",this.$store.getters.userId);
      if(PermissionHelper.enableMimicMode){
        
        params['submitter'] = this.$store.getters.userId; 
      }else if(params.searchMysteryMode!=-1 && p.submitters && p.submitters!='-1' && p.submitters.length>0){
        var obj = {...p.clause};
        obj['submitter'] = p.submitters;
        params['clause'] = obj;
      }
      
      return new Promise((resolve) => {
        //console.log("params:",params);
        getInspectReportList(params).then(async(res) => {
          const errCode = res.errCode;
          let data = [];
          if (errCode === 0) {
            data = res.data.content;
            this.totalElements = res.data.totalElements
          } 
          const temp = [];
          const tempTable = [];
          self.isLoading = true;

          
          for(const item of data){
            const tableObj = {};
            tableObj.province = item.province 
            tableObj.city = item.city;

            tableObj.storeName = item.storeName 
            tableObj.code = item.code ? item.code : '--';

            tableObj.modeText = item.mode === 0 ? self.$t('overview.remotePatrol') : self.$t('overview.onsitePatrol')
            tableObj.tagName = item.tagName ;

            tableObj.id = item.id;
            tableObj.datestr = util.getDateStr(item.ts);
            tableObj.signstr = item.check_in_ts == 0 || !item.check_in_ts ? '--' : util.getDateStr(item.check_in_ts);
            tableObj.submitterName = item.submitterName;
            tableObj.submitter = item.submitter;
            tableObj.routeObj = item;
            tableObj.mode = item.mode;
            tableObj.totalScore = item.type === 1 ? "--" : item.totalScore;
            
            tableObj.standard = item.standard;
            tableObj.standardMsg = util.setStandardMsg(tableObj.standard);
            tableObj.statusCode = item.status; 
            
            let storeType = '';
            item.tags.length !== 0 ? item.tags.forEach((_item, _index) => {
              const isuu = _index === item.tags.length - 1 ? '' : ', \n';
              storeType += _item + isuu;
            }) : storeType = '--';

            tableObj.storeType = storeType;
            self.storeList.forEach(_item => {
              if (item.storeId === _item.storeId) {
                tableObj.province = _item.province;
                tableObj.city = _item.city;
              }
            });
            const statusAndIconObj = self.getIconSrc(item.status);
            tableObj.status = statusAndIconObj.status;
            tableObj.iconSrc = statusAndIconObj.iconSrc;
            tempTable.push(tableObj);
          }

          self.reportTableData = tempTable;
          // self.total = res.data.totalPages
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
          statusStr: this.inspectStatus.status_0, // Poor
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
          statusStr: this.inspectStatus.status_1, // Fair
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
          statusStr: this.inspectStatus.status_2, // Good
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
      if ( (typeof this.params.clause.status !='undefined') && this.params.clause.status == -1) {
        delete this.params.clause.status
      }
      this.params.filter = { page: 0, size: this.sizeNum };
      console.log("*getInitReportList:",this.params);
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

    handlePagination(pageInfo){
      console.log('pageInfo ~~~~~>> ', pageInfo);
      console.log('this.params ~~~~~>> ', this.params);
      this.currentPage = pageInfo.page
      this.curSizeNum = pageInfo.size;
      
      this.params.filter.page = pageInfo.page - 1
      this.params.filter.size = pageInfo.size
      this.getEvents(this.params)

      // if(this.inputSearchValue.trim()=="") this.getWorkflowList(this.apiBody);
      // else this.setTableBySearch()

    },

    // currentChange(val) {
    //   const self = this;
    //   self.page = val.page;
    //   self.params.filter = { page: val.page - 1, size: self.sizeNum };
    //   self.getReportList(self.params);
    // },

    // sizeChange(val) {
    //   const self = this;
    //   self.sizeNum = val.size;
    //   self.params.filter = { page: 0, size: val.size };
    //   self.getReportList(self.params);
    // },

    




    setNoData() {
      this.eventTableData = [];
      this.total = 0;
      this.isLoading = false;
      this.noData = this.$t('deviceView.noData');
    },

    checkSortType(typeId,notupdate) {
      const self = this;
      switch (typeId) {
        case 0: self.params.order = { direction: 'desc', property: 'ts' }; break;
        case 1: self.params.order = { direction: 'asc', property: 'status' }; break;
        case 2: self.params.order = { direction: 'asc', property: 'storeName' }; break;
      }
      if(!notupdate)
        self.getReportList(self.params);
    },

    clickReport(item, index) {
      const self = this;
      sessionStorage.setItem('report_data', JSON.stringify(item.routeObj));
      self.$router.push({ name: 'reportDetails', params: { data: item.routeObj }});
    },

    sortChange(sortOrder) {
      const self = this;
      const order = sortOrder.direction;
      console.log("report sort:",sortOrder);
      console.log("report order:",order);
      if (order === 'asc') {
        self.params.order = {
          'direction': 'asc',
          'property': sortOrder.property === 'datestr' ? 'ts' : sortOrder.property
        };
      } else if (order === 'desc') {
        self.params.order = {
          'direction': 'desc',
          'property': sortOrder.property === 'datestr' ? 'ts' : sortOrder.property
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

    getTagMytery() {
      return new Promise((resolve, reject) => {
        GetMysteryInspectTagList().then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    
    getInspectStatus() {
      return new Promise((resolve, reject) => {
        getInspectStatus().then(res => {
          resolve(res);
          this.inspectStatus = res.data.settingContent.general_setting_inspect_status_name
          delete this.inspectStatus.update_time
          delete this.inspectStatus.update_user_id
          console.log('this.inspectStatus~~~~~ :>> ', this.inspectStatus);

            if(this.inspectStatus.is_customize_2 == false){
            this.inspectStatus.status_2 = this.$t('overview.echartGood')
          }
          if(this.inspectStatus.is_customize_1 == false){
            this.inspectStatus.status_1 = this.$t('overview.improve')
          }
          if(this.inspectStatus.is_customize_0 == false){
            this.inspectStatus.status_0 = this.$t('overview.danger')
          }

          
          this.appraiseList.forEach(item =>{
            if(item.status === 0) {item.label = this.inspectStatus.status_0}
            else if(item.status === 1) {item.label = this.inspectStatus.status_1}
            else if(item.status === 2) {item.label = this.inspectStatus.status_2}
          })

        }).catch(err => {
          reject(err);
        });
      });
    },


    async getInspectList() {
      const self = this;
      const inspectArr = PermissionHelper.enableMimicMode ? await self.getTagMytery() : await self.getTagAll();
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
        else if (self.curReportType === 2 || self.curReportType === 3) {
          console.log('curReportType === 2 || 3')
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
      console.log("Save Search Params")
      let tempsearchParamsObj = this.storeFilterObj;
      console.log('tempsearchParamsObj :>> ', tempsearchParamsObj);
      tempsearchParamsObj.curReportType = this.curReportType;

      if(!tempsearchParamsObj.clause){
        tempsearchParamsObj.clause={
          storeId: this.storeFilterObj.filterStoreIds,
          status:this.curAppraise
        }
      }
      else{
        tempsearchParamsObj.clause = this.params.clause
      }
      tempsearchParamsObj.inspectTagId = this.inspectId;
      //
      const searchParamsObj = {
        path: 'closeEvents',
        params: tempsearchParamsObj
      };
      SearchConditionUtil.saveSearchCondition(searchParamsObj);
    },

    getSearchParams() {
      // clause
      // console.log("Get SEarch Parameter");
      let searchParams = JSON.parse(JSON.stringify(SearchConditionUtil.getSearchCondition('closeEvents')));
      console.log("getSearchParams>>>>searchParams:",searchParams);
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];

      if (Object.keys(searchParams).length > 0) {
        
        this.storeFilterObj = searchParams;
        this.params = searchParams;
        console.log("Get Old Params")
        console.log(searchParams)
        this.order = searchParams.order;
        this.filter = searchParams.filter;
      
        this.checkSortType(this.curSortType,true);
        console.log("searchParams.clause.status:",searchParams.clause.status);
        this.curAppraise = (typeof searchParams.clause.status=='undefined') ? -1:searchParams.clause.status;
        this.curReportType = searchParams.curReportType;
        this.inspectCatch = !searchParams.inspectTagId ? '-1' : searchParams.inspectTagId;
        this.searchParams = searchParams;
        this.ifGetParamsFromCash = true;
        this.inspectId = !searchParams.inspectTagId ? '-1' : searchParams.inspectTagId;
        if(!searchParams.curProvince){
          searchParams.curProvince =[];
        }
        if(!searchParams.curCity){
          searchParams.curCity =[];
        }
        
        if(searchParams.jump){ //跳轉
          console.log("Jump to ")
          //this.params.jump = false;
          this.dateValue = [new Date().setTime(this.params.beginTs), new Date().setTime(this.params.endTs)];
          console.log("searchParams.searchMysteryMode:",searchParams.searchMysteryMode);
          this.params.searchMysteryMode = searchParams.searchMysteryMode;
          this.params.submitter = this.params.submitters;
          //this.saveSearchParams();
          console.log("getSearchParams>>>this.params:",this.params);
          this.searchData();
        }else{
          this.params.searchMysteryMode = PermissionHelper.enableMimicMode ? 1 : -1;
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
      console.log("On Store Changed")
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


<style lang="sass">
  .ignoreSign
    width: fit-content
    border-radius: 4px
    font-size: 12px
    color: #989ca0
    background: #EFEFEF
    padding: 5px
  .table_style
    background: #FFF
    .row-class
      th
        &:nth-child(1)
          padding-left: 0 !important
      td
        &:nth-child(1)
          .cell
            padding-left: 10% !important
            padding: 10px !important
            // text-overflow: ellipsis !important
            // white-space: nowrap !important
            // overflow: hidden !important
            span
              // background: #9872 !important
              // white-space: pre !important
            
    .el-table th div
      padding-left: 10px !important
      padding-right: 0 !important
      text-align: left  !important

    .cell-class .cell
      text-align: left  !important
  .el-table__body-wrapper
    max-height: fit-content !important

</style>

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
  font-size: calc(15/1920*100vw);
  font-weight: normal;
  word-break: keep-all;
  padding-right: 16px;
  
  
}
.report-type-area{
    width:calc(346/1440*100vw);
    height: calc(36/1920*100vw);
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
#el-containter{
    
    .report-header{
        margin-top: 20px;
        margin-bottom: 20px;
        /deep/
        .el-select.el-select--medium .el-input .el-input__inner {
            position: relative;
            z-index: 1;
            background: transparent !important;
            border: none;
            font-size: calc(15/1920*100vw);
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            min-height: 28px;
            min-width: 85px;
        }
        /deep/
        .el-input--medium .el-input__icon {
            line-height: calc(36/1920*100vw);
        }
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
          font-size: calc(16/1920*100vw);
          color: $tab;
          height: 300px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          // position: absolute;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%, -50%);
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
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      // height: calc(450/1440*100vw);
      // overflow: auto;
        
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
          padding-right: 12px;
          max-height: fit-content !important
        }
      }
    }
    
    .report-card{
        width: 19%;
        margin-bottom: calc(20/1440*100vw);
        margin-right: 1%;
        transition: all .3s;
        cursor: pointer;
        &:hover{
          box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .2);
          
        }
        .cards{
          width: 100%;
          height: calc(220/1440*100vw);
          padding: calc(15/1440*100vw);
          
          // margin-right: calc(20/1440*100vw);
          border: 1px solid #e3e9f4;
          font-size: calc(12/1440*100vw);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
          position: relative;
          color: #69727c;
          min-height: calc(160/1440*100vw);

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          .card_main{
            width: 100%;
            .card-title {
                width: calc(150/1440*100vw);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: calc(15/1440*100vw);
                margin-right: calc(10/1440*100vw);
              }
              div {
                text-align: left;
              }
                
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
              // margin-bottom: calc(30/1440*100vw);
            }
            .status-tag_row{
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              align-items: stretch;
              justify-content: flex-start;
              margin-bottom: 1%;
              .status-tag {
                border-radius: 4px; 
                padding: calc(5/1440*100vw) calc(7/1440*100vw);
                font-size: calc(10/1440*100vw);
                margin-bottom: 2%;
              }
              .status-tag-en{
                font-size: calc(14/1920*100vw);
                border-radius: calc(5/1440*100vw); 
                padding: calc(2/1440*100vw) calc(15/1440*100vw);
                margin-bottom: 2%;
              }
            }
          }
          
          
        .card_bottom{
          text-align: left;
          .submitter{
            margin-bottom: calc(5/1440*100vw);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            justify-content: space-between;
          }
        }

        .margin-bottom-5 {
          margin-bottom: calc(5/1440*100vw);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          justify-content: space-between;
          
        }
        .item-score{
          color: $tab;
        }
        .score-num{
          font-size: calc(40/1440*100vw);
        }
        .score-unit{
          font-size: calc(12/1920*100vw);
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
    margin-top: 0px;
    margin-right: calc(20/1920*100vw);;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    
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
.noticeDialog{
  text-align: left;
  margin-left: calc(20/1920*100vw);
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
