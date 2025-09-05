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

            <!-- 總評類型 -->
            <!-- <div class="">
            <span style="margin-right: 16px; font-size:calc(15/1920*100vw);width:83px;">{{ $t('remotePatrol.resultType') }}</span>
            <el-select
              v-model="curAppraise"
              :placeholder="$t('remotePatrol.all')"
              size="mini"
              style="width: calc(260/1440*100vw); margin-right: 60px;"
              class="el-province "
            >
              <el-option
              v-for="item in appraiseList"
                :key="item.status"
                :label="item.label"
                :value="item.status"/>
            </el-select>
            </div> -->


            <!-- 巡檢表 -->
            <!-- <div class="flex-center">
              <span style="margin-right: 16px;font-size:calc(15/1920*100vw);">{{$t('reportAndEvents.inceptionTag')}}</span>
              <div class="flex-center report-type-area">
                <el-select
                  class="el-province"
                  style="width: 100% ; margin-left:0px;border:none;border-radius:0px;"
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
            </div> -->

          </div>
        </template>
      </store-filter>
    </div>


    <div class="report-header" style="margin: 20px 0;">
        <div class="flex-center" style="padding-top: 0;">
          <div class="search-label" style=" margin-right: 38px;">時間範圍</div>
          <el-date-picker
            class="time-selector"
            v-model="dateValue"
            style="width: 300px;"
            type="daterange"
            range-separator="to"
            start-placeholder="開始日期"
            end-placeholder="结束日期"
            :clearable = "true"
            :picker-options="pickerOptions"
            />

          <div class="flex-center fullWidth" style="margin-left: 20px">

            <!-- 關鍵字 -->
            <!-- <div class="search-content flex-center" style="margin-right: 20px">
              <div class="search-label">{{ $t('remotePatrol.keywords') }}</div>
              <el-input v-model="searchInput" size="mini" class="search-input shadow-light" style="margin-left: 16px;" clearable/>
            </div> -->

            <!-- 職務 -->
            <div class="search-content flex-center" style="margin-right: 20px">
              <div class="search-label">人員</div>
                <el-select
                  v-model="selectUser "
                  placeholder="執行人員"
                  clearable
                  style="width: 250px; background: #FFF;"
                  >
                  <el-option
                    v-for="(item, index) in userInfo"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>

                <!-- 新增超時/全部下拉選單 -->
                <div class="search-label" style=" margin-left: 40px;">超時/略過簽到</div>
                <el-select
                  v-model="statusFilter"
                  placeholder="全部/超時"
                  clearable
                  style="width: 150px; background: #FFF;"
                >
                  <el-option label="超時" value="0" />
                  <el-option label="略過簽到" value="1" />
                </el-select>

                <!-- <el-switch
                  v-model="jobSwitch"
                  active-text="超時"
                  inactive-text="全部"
                  style="margin-left: 20px;"
                /> -->
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

    <div id="el-containter" class="flex-column spacer" style="margin-left:0px">


      <div class="report-content loading spacer paper">
        <div
          v-loading="isLoading"
          v-if="reportTableData.length !== 0"
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading ">

          <!-- 報告列表 -->
          <div class="list-table for_pre">
            <table-only
              ref="elTP"
              class="table-white table_style_delete_report"
              :column-data="reportInfoTable"
              :table-data="reportTableData"
              :highlight-current-row= "true"
              :is-loading-data="isLoading"
              :allowRowExpand = "false"
              :showBorder = "false"
              :default-sort = "{prop: 'datestr', order: 'descending'}"
              :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '6px',}"
              :tableHeight = "760"
              :cellStyle="{backgroundColor: '#fff !important'}"
              :signRecordStatus = "signRecordStatus"
              @sortChange="sortChange"
            />
          </div>

        </div>

        <div
          v-loading="isLoading"
          v-else
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading">
          <div class="empty-content">{{ noData }}</div>
        </div>

        <div class="el-pat" v-if="reportTableData.length > 0">
          <div class="pageSizeTitle" style="color: #666"> 共有 <b style="font-size: 16px"> {{totalElements}} </b> {{ $t('remotePatrol.numReports') }}</div>
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

import { deleteReport} from '@/api/reportAndEvent';
import { Encrypt } from '@/common/Aes'
import util from '@/common/util';
import { mapGetters } from 'vuex';
import StoreFilter from '@/components/StoreFilter';
import DelayButton from '@/components/DelayButton';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DateTimeSelector from '@/components/DateTimeSelector';
import SelectedStores from "@/components/SelectedStores";
import TblPaginationOnly from '@/components/TblPaginationOnly';
import {getAllUserInfoNoAuth} from '@/api/login';
import { getInspectReportInfo} from '@/api/inspect';//為了取是否有設置評分
import {scheduleRESTful} from '@/api/index';

import TableOnly from '@/components/TableOnly';
import PermissionHelper from '@/api/PermissionHelper';
import DialogPop from '@/components/DialogPop';
import { getTimeOut } from '../../api/scheduleTask';
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

      // 新增超時/全部下拉選單的綁定
      statusFilter: "",

      agreeDelete: false,
      deleteReason: '',
      passWord: '',
      deleteReportId: '',
      canDeleteReport: false,

      curSortType: 0,
      ShowCard: true,
      isHoverList: false,
      isHoverCard: false,
      reportTableData: [],
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
          prop: 'region',
          label: '區域',
          sortable: false,
          width: '180',
          maxWidth: '200',
        },
        {
          prop: 'storeName',
          label: '巡檢地點',
          sortable: false,
          width: '180',
          maxWidth: '200',
        },
        {
          prop: 'tagName',
          label: '巡檢表',
          sortable: false,
          width: '180',
          maxWidth: '200',
        },
        {
          prop: 'submitterName',
          label: '送出者',
          sortable: false,
          width: '180',
          maxWidth: '200',
        },
        {
          prop: 'signstr',
          label: '打卡時間',
          sortable: false,
          width: '180',
          maxWidth: '200',
        },
        {
          prop: 'datestr',
          label: '報告送出時間',
          sortable: false,
          width: '180',
          maxWidth: '200',
        },
        // {
        //   prop: 'status',
        //   label: '狀態',
        //   sortable: false,
        //   width: '180',
        //   maxWidth: '200',
        // },
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

      total: 0,
      currentPage: 1,
      curSizeNum: 10,
      sizeNum: 50,

      signRecordStatus: {
          label: '狀態',
          minWidth: '120',
          align: 'left',
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
      curAppraise: -1,
      appraiseList: [
        { 'status': -1, 'label': this.$t('remotePatrol.all') },
        { 'status': 0, 'label': this.$t('remotePatrol.dangerous') }, //poor
        { 'status': 1, 'label': this.$t('remotePatrol.improve') }, //fair
        { 'status': 2, 'label': this.$t('overview.echartGood') } //good
      ],
      jobSwitch: false,
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
      showExportAllWarn:false,
      showExportAllNotice:false,

      inspectStatus:'',
      totalElements: 0,
      changeNum: 0,
      weekTimeRange: "",
      userInfo:[],
      selectUser : null,
      pickerOptions: {
        disabledDate(time) {
          const today = new Date()
          today.setHours(23, 59, 59, 999)  // 設置為今天的結束
          return time.getTime() > today.getTime()
        },
      },
      timeOutMin: 0
    };
  },

  created() {
    this.isFirstLoad = true
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
    },

    dateValue(val) {
      if (val && val.length === 2) {
        const start = new Date(val[0])
        const end = new Date(val[1])
        const diffTime = end.getTime() - start.getTime()
        const diffDays = diffTime / (1000 * 3600 * 24)
        if (diffDays > 7) { // 如果超過7天
          // 固定結束時間，自動調整開始時間為結束時間往前6天
          const newStart = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000) // 結束日期往前6天
          this.dateValue = [newStart, val[1]]
          this.$message.warning('時間範圍最短一天，最多7天，已重新調整。')
        }
      }
    },

    changeNum(val){
      if(this.agreeDelete == true && this.deleteReason !== '' && this.passWord !== '') this.canDeleteReport = true
      else this.canDeleteReport = false
    },


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
      const self = this;
      self.isLoading = true;
      this.searchInput = '';
      self.storeStr = '';
      // self.dateValue = [ new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 6,
      //   new Date(this.$moment(new Date()).endOf('day'))];



      self.reportList = [];
      self.curSortType = 0;
      self.storeName = '';
      self.showMonthDrap = false;
      self.showStoreContent = false;
      self.checkAllStore = false;
      self.curReportType = -1;

      await self.getTimeOut();
      await self.getSearchParams();
      await self.getInspectList();
      await self.getUserInfo();
      await self.getInspectStatus();
    },

    getTimeOut(){
        this.isLoadingData = true;
        const param = this.SelSchedulId
        scheduleRESTful.getTimeOut().then(res =>{
          if(res.errCode === 0){
            console.log('res.data', res.data)
            this.timeOutMin = res.data.timeOut
          }
        })
        // this.showConfirmDelete = false;
        // let params = {
        //     taskGroupUuidArray: this.SelSchedulId,
        //     userId: this.userId,
        // }
        // scheduleRESTful.deletePersonTaskList(params).then(res=>{
        //     if(res.errCode==0){
        //         this.doSearchScheduleList();
        //     }else{
        //         util.notify(this.$t('schedule.deletePersonSchError'), 'error', 2000);
        //     }
        // })
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

    addNum(){
      this.changeNum += 1
      console.log('this.changeNum :>> ', this.changeNum);
    },



    handleEventDoc(val){
      console.log('val :>> ', val);

      var reportObj = val.row.routeObj
      console.log('reportObj :>> ', reportObj);
      sessionStorage.setItem('needDeleteReport', true);
      sessionStorage.setItem('report_data', JSON.stringify(reportObj));
      this.$router.push({ name: 'needDeleteReport', params: { data: reportObj }});
    },


    getReportList(p) {
      console.log("1.Get Report List")
      var params = {
        beginTs:p.beginTs,endTs:p.endTs,
        clause:p.clause,
        like:p.like,
        filter:p.filter,
        order:p.order,
        inspectTagId: p.inspectTagId != '-1' ? p.inspectTagId : null,
        searchMysteryMode : PermissionHelper.enableMimicMode ? 1 : p.searchMysteryMode,
        sourceType : 1,
        overTimeOrSkip: this.statusFilter == "" ? null : Number(this.statusFilter)
      }

      const self = this;

      // params.endTs = params.endTs - params.endTs % 1000 + 999;
      const date = new Date(params.endTs);
      date.setHours(23, 59, 59, 999);
      params.endTs = date.getTime();

      params.submitter = this.selectUser == "" ?  null : this.selectUser

      if (params.clause.storeId.length === 0) {
        // console.log("No Data")
        // this.setNoData();
        // return;
        params.clause.storeId.push(-1)
      }

      // console.log("***current user:",this.$store.getters.userId);
      if(PermissionHelper.enableMimicMode){
        params['submitter'] = this.$store.getters.userId;
      }else if(params.searchMysteryMode!=-1 && p.submitters && p.submitters!='-1' && p.submitters.length>0){
        var obj = {...p.clause};
        obj['submitter'] = p.submitters;
        params['clause'] = obj;
      }

      // ==== 2024 sprint1 遠端巡檢關閉 ====
      params['clause'].mode = 1;

      return new Promise((resolve) => {
        console.log("params~~~~~>>",params);
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

            // var ignoreCheckIn = item.isCheckInIgnore ? "略過簽到" : ""
            var overTime = this.checkTimeout(item.ts, item.check_in_ts, this.timeOutMin) ? "超時" : ""
            var slash = (this.checkTimeout(item.ts, item.check_in_ts, 20) && item.isCheckInIgnore) ? "/" : ""
            // tableObj.status = ignoreCheckIn + slash + overTime

            tableObj.status = this.checkTimeout(item.ts, item.check_in_ts, this.timeOutMin)
            tableObj.isCheckInIgnore = item.isCheckInIgnore

            tableObj.province = item.province
            tableObj.city = item.city;
            tableObj.region = item.province + '/' + item.city;
            tableObj.storeName = item.storeName
            tableObj.code = item.code ? item.code : '--';

            tableObj.modeText = item.mode === 0 ? self.$t('overview.remotePatrol') : self.$t('overview.onsitePatrol')
            tableObj.tagName = item.tagName ;

            tableObj.id = item.id;
            tableObj.datestr = util.getDateStr(item.ts);
            tableObj.signstr = item.check_in_ts == 0 || !item.check_in_ts ? '--' : util.getDateStr(item.check_in_ts);

            tableObj.submitterName = item.submitterName;
            tableObj.submitter = item.submitter;
            // tableObj.routeObj = item;
            // tableObj.mode = item.mode;
            // tableObj.totalScore = item.type === 1 ? "--" : item.totalScore;
            // tableObj.standard = item.standard;
            // tableObj.standardMsg = util.setStandardMsg(tableObj.standard);

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

            tempTable.push(tableObj);
          }

          self.reportTableData = tempTable

          self.total = res.data.totalPages
          self.isLoading = false;
          if (temp.length === 0) {
            self.noData = self.$t('deviceView.noData');
          }
          resolve(temp);
        }).catch(err => {
        });
      });
    },


    checkTimeout(start_ts, end_ts, minutes = 20) {
       // 計算毫秒差異
        const diffMs = Math.abs(end_ts - start_ts);
        // 換算成分鐘
        const diffMinutes = diffMs / (60 * 1000);
        // 設定閾值
        const isTimeout = diffMinutes > minutes;

        return isTimeout;
    },


    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
        this.userInfo = res.data
        console.log('this.userInfo :>> ', this.userInfo);
      }).catch(err => {
        console.log('error' + err);
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

    // dateChange(val) {
    //   const self = this;
    //   const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
    //   const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
    //   self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
    //   self.dateValue[1] = self.dateValue[1];
    //   self.inputSearchValue = '';
    // },

    handlePagination(pageInfo){
      console.log('pageInfo ~~~~~>> ', pageInfo);
      console.log('this.params ~~~~~>> ', this.params);
      this.isLoading = true;

      this.currentPage = pageInfo.page
      this.curSizeNum = pageInfo.size;

      this.params.filter.page = pageInfo.page - 1
      this.params.filter.size = pageInfo.size
      this.getReportList(this.params);
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

    searchData() {
      console.log("Search Data >>>>" , this.dateValue)
      const self = this;
      self.isLoading = true;

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

      if(self.params.jump){ //跳轉
          console.log("1.ump to ")
          self.params.jump = false;
          self.dateValue = [new Date().setTime(this.params.beginTs), new Date().setTime(this.params.endTs)];
          self.params.searchMysteryMode = this.params.searchMysteryMode;
          self.params.submitter = this.params.submitters;
          //this.saveSearchParams();
          //this.searchData();
          console.log("searchData>>>>SearchParams:",self.params)
          this.ifSearchData = false;
        }else{
          console.log("searchData>>>>no jump:",self.params)
          self.params.searchMysteryMode = PermissionHelper.enableMimicMode ? 1 : -1;
        }

      console.log("###",self.params)
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

      console.log('inspectArr ---->> ', inspectArr);
      const newArr = [];
      const inspectList = [];
      inspectArr.forEach(_item => {
        if (self.curReportType === -1) {
          if (!newArr.includes(_item.id) && _item.mode !== 0 ) {
            newArr.push(_item.id);
            inspectList.push(_item);
          }
        }
        // ==== 2024 sprint1 遠端巡檢關閉 ====
        // else if (self.curReportType === 0) {
        //   if (!newArr.includes(_item.id) && _item.mode === 0) {
        //     newArr.push(_item.id);
        //     inspectList.push(_item);
        //   }
        // }
        else if (self.curReportType === 1) {
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
      console.log("Save Search Params")
      let tempsearchParamsObj = this.storeFilterObj;
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
        path: 'deleteReport',
        params: tempsearchParamsObj
      };
      SearchConditionUtil.saveSearchCondition(searchParamsObj);
    },

    getSearchParams() {
      // console.log("Get SEarch Parameter");
      let searchParams = JSON.parse(JSON.stringify(SearchConditionUtil.getSearchCondition('deleteReport')));
      console.log("getSearchParams>>>>searchParams:",searchParams);
      this.dateValue = [this.$moment().subtract(7, 'days').startOf('d').toDate(), this.$moment().subtract(1, 'days').endOf('d').toDate()];

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
    },


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

<style lang="sass" scoped>
  .el-range-editor.is-active
    border-color: #1375bc

</style>
<style lang="sass">
  .el-range-editor--medium .el-range-separator
    width: 50px
  .el-date-table td.end-date span, .el-date-table td.start-date span
    background-color: #1375bc
  .el-date-table td.today span
    color: #1375bc

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
    width:calc(260/1440*100vw);
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
      height: 36px;
      align-items: flex-start;
      align-items:center;
      justify-content: flex-end;
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
