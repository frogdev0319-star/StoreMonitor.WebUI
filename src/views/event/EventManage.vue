<template>
  <div :style="{'minHeight':windowHeight-118+'px'}" class="el-event-content">
    <div class="el-event-header">
      <div class="el-area">
        <store-filter
          :cached-params="searchParams"
          path = "eventManage"
          @storeChange = "onStoreChange"
        >
        <!-- 報表類型 -->
        <template v-slot:others>
            <div class="last-row" >
              <!-- <span style="margin-right: 16px; margin-left:24px;font-size:calc(15/1920*100vw);width:83px;">{{isLicensePro ?  $t('remotePatrol.reportType') : $t('remotePatrol.inspectName')}} </span> -->
              <span style="margin-right: 16px; margin-left:24px;font-size:calc(15/1920*100vw);width:83px;">{{ $t('remotePatrol.reportType')}} </span>
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
                <div style="width:0px;height:25px;border:1px solid #ACAEB1; opacity:0.34;" ></div>
                  <multi-select
                    class="store-group-select region"
                    :selected="inspectId"
                    :prompt-msg="$t('remotePatrol.all')"
                    :all-select="0"
                    :alltype="0"
                    :options="inspectTableList"
                    @changeInput="changeSelect(arguments)"/>
              </div>
            </div>
          </template>
        </store-filter>
      </div>

      <!-- 時間範圍   -->
      <div class="flex-center" style="justify-content: space-between; margin: 20px 0 20px 0px;font-size:calc(16/1920*100vw)">
        <div class="flex-center">
          <date-time-selector
            ref="eventTimePicker"
            :dateTimeValue = dateValue
            @change="dateChange"
          />
        </div>

        <!-- 關鍵字 -->
        <div class="flex-center">
          <span style="margin-right: 10px; white-space:nowrap;">{{ $t('remotePatrol.keywords') }}</span>
          <el-input
            v-model="inputSearchValue"
            size="small"
            class="search-input shadow-light"
            clearable/>
        </div>

        <!-- 查詢按鈕 -->
        <delay-button
          class="search-button"
          style="background-color:#556679;border:none;"
          type="primary"
          size="mini"
          @click="searchEventList"
        >
          <span>{{ $t('remotePatrol.search') }}</span>
        </delay-button>
      </div>


      <!--<selected-stores :store-str="storeFilterObj.storeStr"/>-->
    </div>
    <div class="el-table-content">
      <delay-button
        :class="getLangStyleValue(exportBtnClass)"
        class="absolute-btn"
        style="background-color:#FFF;color:#006ab7;"
        type="primary"
        size="mini"
        @click="export2Excel"
      >
        <div class="button-area">
          <img :src="exportPng" class="icon-excel">
          <span>{{ $t('eventView.exportReport') }}</span>
        </div>
      </delay-button>
      <el-tabs :id="getLangStyleValue(tabContentId)"  v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item,index) in tableDataList"
          :key="index"
          :label="`${item.label} （${item.eventCount}）`">
          <div class="el-table-panel">
            <el-table
              :data="item.tableData"
              :highlight-current-row="true"
              :height="553"
              :header-row-style="{width:'1920px'}"
              :header-cell-style="{fontSize:'calc(12/1920*100vw)',color:'#7d8cad',height: '47px'}"
              :cell-style="cellStyle"
              empty-text="没有事件數據"
              align="left"
              style="width:auto"
              class="table-content tbl-checkbox"
              @sort-change="sortChange"
              @row-click="rowClickItem"
              @selection-change="handleSelectionChange"
              @cell-click="cellClickItem"
            >
              <el-table-column
                v-if="((activeName!='2'))"
                class="tbl-checkbox"
                type="selection"
                :selectable="handleDisable"
                width="45">
              </el-table-column>
              <el-table-column
                min-width="90"
                header-align="center"
                align="center">
                <template slot-scope="scope" >
                  <span
                    v-if="scope.row.status === 0"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#fff2ef;color:#f57848;"
                    >
                    {{ $t('eventView.pending') }}
                  </span>
                  <span
                    v-else-if="scope.row.status === 1"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#edf6e8;color:#59ab22;" >
                    {{ $t('eventView.handled') }}
                  </span>
                  <span
                    v-else-if="scope.row.status === 2 || scope.row.status === 4"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#efefef;color:#6e6e6e;" >
                    {{ $t('eventView.closed') }}
                  </span>
                  <span
                    v-else-if="scope.row.status === 3"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#ffeff5;color:#e22472;" >
                    {{ $t('eventView.returnStatus') }}
                  </span>

                  <el-tooltip v-if="scope.row.status === 0  && scope.row.isSystemAdvancedEdited" effect="light" placement="right-end">
                    <div slot="content"> 變更時間：{{scope.row.systemAdvancedActionTs}} </div>
                    <div v-if="scope.row.status === 0 && scope.row.isSystemAdvancedEdited" class="expiretag">
                      <span style="color:#f57848;"> (已變更狀態) </span>
                    </div>
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.status === 1 && scope.row.isSystemAdvancedEdited" effect="light" placement="right-end">
                    <div slot="content"> 變更時間：{{scope.row.systemAdvancedActionTs}} </div>
                    <div v-if="scope.row.status === 1 && scope.row.isSystemAdvancedEdited" class="expiretag">
                      <span style="color:#59ab22;"> (已變更狀態) </span>
                    </div>
                  </el-tooltip>

                  <el-tooltip v-if="scope.row.status === 2 " effect="light" placement="right-end">
                    <div slot="content">
                      <div v-if="scope.row.isSystemAdvancedEdited">變更時間：{{scope.row.systemAdvancedActionTs }} </div>
                      <div v-else> {{ $t('eventView.expiredate')+ scope.row.updateTs }}</div>
                    </div>
                    <div v-if="scope.row.status === 2 && scope.row.isSystemAdvancedEdited" class="expiretag">
                      <span style="color:#556679;"> (已變更狀態) </span>
                    </div>
                  </el-tooltip>

                  <el-tooltip v-if="scope.row.status === 3 " effect="light" placement="right-end">
                    <div slot="content">
                      <div v-if="scope.row.isSystemAdvancedEdited">變更時間：{{scope.row.systemAdvancedActionTs }} </div>
                      <div v-else> {{ $t('eventView.expiredate')+ scope.row.updateTs }}</div>
                    </div>
                    <div v-if="scope.row.status === 3 && scope.row.isSystemAdvancedEdited" class="expiretag">
                      <span style="color:#e22472;"> (已變更狀態) </span>
                    </div>
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.status === 4 " effect="light" placement="right-end">
                    <div slot="content">{{ $t('eventView.expiredate')+ scope.row.updateTs }} </div>
                    <div v-if="scope.row.status === 4 && scope.row.isSystemAdvancedEdited" class="expiretag">
                      <span style="color:#556679;"> (已變更狀態) </span>
                    </div>
                    <div v-else="scope.row.status === 4" class="expiretag">
                      {{ '('+$t('eventView.expiretag')+')' }}
                    </div>
                  </el-tooltip>



                </template>
              </el-table-column>
              <el-table-column
                :label="$t('eventView.name')"
                :class-name = "selfClassName"
                prop="subject"
                min-width="200"
                align="left"
              >
                <template slot-scope="scope">
                  <img v-if="scope.row.sourceType === 0" :src="videoSrc" class="sourceType-icon">
                  <img v-else-if="scope.row.sourceType === 1" :src="inspectSrc" class="sourceType-icon">
                  <img v-else-if="scope.row.sourceType === 3" :src="immediateInspectSrc" class="sourceType-icon">
                  <img v-else-if="scope.row.sourceType === 4" :src="AIInspectSrc" class="sourceType-icon">
                  <img v-else :src="insiteInspectSrc" class="sourceType-icon" style="width:15px;">
                  <span class="event-subject">{{ scope.row.subject }}</span>
                </template>
              </el-table-column>

              <!-- 巡檢表 -->
              <el-table-column v-if="isShowInspectTagName" :label="$t('overview.patrolLists')" prop="inspectTagName" align="left" min-width="200" />

              <el-table-column :label="$t('eventView.enclosure')" align="left" min-width="100" :render-header="renderHeader">
                <template slot-scope="scope">
                  <div v-if="scope.row.attachment.length!==0">
                    <img v-for="(item,index) in scope.row.attachment" :key="index" :src="item.url" class="enclosure-icon" >
                  </div>
                </template>
              </el-table-column>

              <!-- 送出人 -->
              <el-table-column v-if="isShowAssignerName" :label="$t('eventView.submitter')" prop="assignerName" align="left" min-width="80" sortable="custom" :render-header="renderHeader"/>
              <el-table-column :label="$t('eventView.submitTime')" prop="ts" align="left" width="160" sortable="custom" :render-header="renderHeader"/>
              <el-table-column :label="$t('remotePatrol.regionI')" prop="province" align="left" width="80" :render-header="renderHeader"/>
              <el-table-column :label="$t('remotePatrol.regionII')" prop="city" align="left" width="80" :render-header="renderHeader"/>
              <el-table-column :label="$t('eventView.stores')" prop="storeName" align="left" min-width="100" sortable="custom" :render-header="renderHeader"/>
              <el-table-column :label="$t('remotePatrol.code')" prop="code" align="left" min-width="70" :render-header="renderHeader"/>
              <el-table-column
                :label="$t('eventView.operation')"
                prop="option"
                min-width="60"
                align="left"
                :render-header="renderHeader"
                >
                <template slot-scope="scope">
                  <img :src="penSrc" class="iconfont icon-gengduo" @click="toEventDetail(scope.row)">
                </template>
              </el-table-column>
              <div slot="empty">
                <div>
                  <i class="iconfont icon-zhengque empty-data-icon"/>
                  <span class="empty-text">{{ $t('eventView.noEvents') }}</span>
                </div>
                <!--<div v-else class="empty-content">
                  <img :src="loadingGif" class="loading_rotate">
                  <span class="empty-text">{{ $t('remotePatrol.loading') }}</span>
                </div>-->
              </div>
            </el-table>
          </div>
          <div style="width:100%; margin-top:12px;height:31px;">
            <delay-button v-if="showCloseBtn"
              class="btn-close"
              style="color:#FFF;"
              type="primary"
              size="mini"
              @click="doBachCloseEvent"
            >
              <span>{{ $t('eventView.closing') }}</span>
            </delay-button>
            <div class="pagination" v-if="totalElements !== 0">
                <tbl-pagination-only
                :total="total"
                :current-page="page"
                :page-size="sizeNum"
                layout = "prev,pager, next,sizes,slot"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
              />
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <dialog-vue
    :dialog-title="$t('eventView.confirmBachClose')"
    :show-info="$t('eventView.closeSelectedEvent')"
    :is-warning=true
    :dialog-closed="showBachCloseDialog"
    @confirmed="confirmBachClose"
    @canceled="showBachCloseDialog = false"/>

    <DownloadDialogPop
      :title="$t('downloadManagement.message')"
      :visible="showExportMassage"
      :showCancelbtn="false"
      @confirmHandler="showExportMassage = false"
      @goToPage="gotoDownloadManagement"
      >
    </DownloadDialogPop>

  </div>
</template>

<script>

import util from '@/common/util.js';
import { eventRESTful } from '@/api/index';
import {  GetInspectTagList } from '@/api/inspect';
import { getCookie } from '@/common/auth';
import { isLoginIn } from '@/api/login';
import { mapGetters } from 'vuex';
import { getBriefStoreList } from '@/api/store';
import {exportEventList} from '@/api/exportExcel';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import LimitSelect from '@/components/LimitSelect';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DelayButton from '@/components/DelayButton';
import StoreFilter from '@/components/StoreFilter';
import DateTimeSelector from '@/components/DateTimeSelector';
import SelectedStores from '@/components/SelectedStores';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DialogVue from '@/components/DialogVue';
import PermissionHelper from '@/api/PermissionHelper';
import DownloadDialogPop from '@/components/DownloadDialogPop';

export default {
  name: 'EventManage',
  components: {
    DateTimeSelector,
    SelectedStores,
    StoreFilter,
    DelayButton,
    LimitSelect,
    MultiSelect,
    RegionMultiSelect,
    TblPaginationOnly,
    DialogVue,
    DownloadDialogPop,

  },

  data() {
    return {
      loadingGif: require('../../../static/img/loading.svg'),
      first:true,
      dateValue: [],
      toolTipClass: 'page-login-toolTipClass',
      eventStatesList: [
        { value: 0, label: this.$t('eventView.pending'), disabled: false },
        { value: 1, label: this.$t('eventView.handled'), disabled: false },
        { value: 2, label: this.$t('eventView.closed'), disabled: false },
        { value: 3, label: this.$t('eventView.returnStatus'), disabled: false }
      ],
      curState: [0],
      value: 0,
      inputSearchValue: '',
      serachData: '',
      tableDataList: [
        {
          label: this.$t('eventView.pendingEve'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.ProcessedEvent'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.ClosedEvent'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.ReturnEvent'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.allEvents'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        }
      ],
      activeName: '0',
      videoSrc: require('../../../static/img/monitor.png'),
      inspectSrc: require('../../../static/img/remote_patrol.png'),
      immediateInspectSrc: require('../../../static/img/immediate_patrol.png'),

      AIInspectSrc: require('../../../static/img/ai_inspection.png'),
      insiteInspectSrc: require('../../../static/img/onsite_patrol.png'),
      attachmentVideo: require('../../../static/img/photo.png'),
      attachmentImg: require('../../../static/img/photo.png'),
      attachmentAudio: require('../../../static/img/voice.png'),

      penSrc:require('../../../static/img/icon_pen.png'),
      total: 0,
      page: 1,
      sizeNum: 10,
      params: {},
      exportDataList: [],
      exportDataHeader: [
        this.$t('eventView.name'),
        this.$t('overview.patrolLists'),
        this.$t('eventView.submitter'),
        this.$t('eventView.submitTime'),
        this.$t('remotePatrol.regionI'),
        this.$t('remotePatrol.regionII'),
        this.$t('eventView.stores'),
        this.$t('remotePatrol.code')],
      windowHeight: window.innerHeight,
      userId: '',
      lang: this.$i18n.locale,
      isFirstLoad: false,
      order: '',
      ifChangeAccount: false,
      numberOfElements: 0,
      totalElements: 0,
      sortColumnOfTab: [
        { tabIndex: 0, sortType: { prop: '', order: '' }},
        { tabIndex: 1, sortType: { prop: '', order: '' }},
        { tabIndex: 2, sortType: { prop: '', order: '' }},
        { tabIndex: 3, sortType: { prop: '', order: '' }},
        { tabIndex: 4, sortType: { prop: '', order: '' }}
      ],
      exportPng: require('../../../static/img/excel.png'),
      selfClassName: 'self-class-name',
      ifGetParamsFromCash: false,
      ifSaveParams: false,
      storeFilterObj: {},
      searchParams: {},
      ifSearchData: true,
      showCloseBtn:false,
      closingEventId:[],
      stopRowClick:false,
      showBachCloseDialog:false,
      exportBtnClass:[
                {key:'en',value:'en-export-btn'},{key:'zh',value:'zh-export-btn'},{key:'zhtw',value:'zhTW-export-btn'},
                {key:'ja-JP',value:'ja-export-btn'},{key:'ko-KR',value:'ko-export-btn'},{key:'vi-VN',value:'vi-export-btn'},
                {key:'id-ID',value:'id-export-btn'},{key:'th-TH',value:'th-export-btn'}
            ],
      tabContentId:[{key:'en',value:'#en-tabs-content'},{key:'zh',value:'#en-tabs-content'},{key:'zhtw',value:'#en-tabs-content'},
        {key:'ja-JP',value:'#en-tabs-content'},{key:'ko-KR',value:'#en-tabs-content'},{key:'vi-VN',value:'#en-tabs-content'},
        {key:'id-ID',value:'#en-tabs-content'},{key:'th-TH',value:'#th-tabs-content'}],
      curReportType: -1,
      reportTypeList: [

        // { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        // { 'mode': 0, 'label': this.$t('remotePatrol.remotePatrol') },
        // { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') },
        // { 'mode': 3, 'label': this.$t('immediatePush.immediateEvent')},
        // { 'mode': 4, 'label': this.$t('immediatePush.AIEvent')}
        // { 'mode': 2, 'label': this.$t('immediatePush.storeMonitoring') },
        // { 'mode': 3, 'label': this.$t('immediatePush.immediateEvent')  }
      ],
      inspectId: [],
      inspectTableList: [],
      inspectCatch:[],
      storeList:[],
      selectStoreList:[],
      sourceType: 0,
      hasAdvanced: false,
      isLicensePro: false,
      showExportMassage: false,

      isShowInspectTagName: true,
      isShowAssignerName: true
    };
  },
  computed: {
    tableHieght() {
      if (this.windowHeight > 800) {
        return this.windowHeight * 0.85;
      } else if (this.windowHeight > 700) {
        return this.windowHeight * 0.58;
      } else {
        return this.windowHeight * 0.7;
      }
    },

    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      const self = this;
      for(let i=0; i<5;i++){
        self.tableDataList[i].tableData =[];
        self.tableDataList[i].eventCount = 0;
      }

      if (val !== 0) {
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        },
        300);
        //self.initData();
        self.ifChangeAccount = true;
        self.ifSaveParams = false;
        self.ifSearchData = true;

        var userInfo = await this.$store.dispatch("GetUserAuthorities");
        self.hasAdvanced = userInfo.data.isSystemAdvanced
        this.isLicensePro = userInfo.data.isLicensePro


        if(this.isLicensePro) {
          this.reportTypeList = [
            { 'mode': -1, 'label': this.$t('remotePatrol.all') },
            { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') },
            { 'mode': 3, 'label': this.$t('immediatePush.immediateEvent')},
            { 'mode': 4, 'label': this.$t('immediatePush.AIEvent')}
          ]
        } else {
          this.reportTypeList =[
            { 'mode': -1, 'label': this.$t('remotePatrol.all') },
            { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') },
            { 'mode': 4, 'label': this.$t('immediatePush.AIEvent')}
          ]
        }

      }
    },

    numberOfElements(val) {
      const self = this;
      if (val === 0 && self.totalElements > 0) {
        self.params.filter.page -= 1;
        self.getEventList();
      }
    }
  },

  created() {
    this.isFirstLoad = true;
  },

  async mounted() {
    const self = this;
    self.userId = getCookie('UserId');
    const windowHeight = window.innerHeight;
    if (windowHeight > 800) {
      self.tableHeight = 770 + 'px';
    }

    var userInfo = await this.$store.dispatch("GetUserAuthorities");
    this.hasAdvanced = userInfo.data.isSystemAdvanced
    this.isLicensePro = userInfo.data.isLicensePro

    if(this.isLicensePro) {
      this.reportTypeList = [
        { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') },
        { 'mode': 3, 'label': this.$t('immediatePush.immediateEvent')},
        { 'mode': 4, 'label': this.$t('immediatePush.AIEvent')}
      ]
    } else {
      this.reportTypeList =[
        { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        { 'mode': 1, 'label': this.$t('remotePatrol.onsitePatrol') },
        { 'mode': 4, 'label': this.$t('immediatePush.AIEvent')}
      ]
    }

  },

  activated() {
    const self = this;
    self.windowHeight = window.innerHeight;
    if (!self.$route.meta.isBack || self.isFirstLoad) {
      self.getInspectList();
      self.initData();
    } else {
      self.getEventList('Back');
      self.getEventCount();
      self.$route.meta.isBack = false;
      self.isFirstLoad = false;
    }
    self.$route.meta.isBack = false;
    self.isFirstLoad = false;
  },
  beforeDestroy() {
    //console.log('searchFrom:',this.searchParams['searchFrom']);
    if(this.searchParams['searchFrom']=='PatrolPersonStat'){
        //console.log("in beforeDestroy");
        delete this.searchParams['searchParams']['clause']; //重新搜尋要把跳轉帶來的刪掉
        this.searchParams['searchFrom'] = '';
        this.ifSaveParams && this.saveSearchParams(true);
    }else if(this.searchParams['searchFrom']=='EventStatistics'){
        delete this.searchParams['searchParams']['clause']; //重新搜尋要把跳轉帶來的刪掉
        this.searchParams['searchFrom'] = '';
        this.ifSaveParams && this.saveSearchParams(true);
    }
  },
  deactivated() {
      //console.log('searchFrom:',this.searchParams['searchFrom']);

      if(this.searchParams['searchFrom']=='PatrolPersonStat'){
          delete this.searchParams['searchParams']['clause']; //重新搜尋要把跳轉帶來的刪掉
          this.searchParams['searchFrom'] = '';
          this.ifSaveParams && this.saveSearchParams(true);
      }else if(this.searchParams['searchFrom']=='EventStatistics'){
        delete this.searchParams['searchParams']['clause']; //重新搜尋要把跳轉帶來的刪掉
        this.searchParams['searchFrom'] = '';
        this.ifSaveParams && this.saveSearchParams(true);
    }
  },
  methods: {
    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    renderHeader(h, { column, $index }) {
      if(util.getWindowWidth()>1366){
        let realWidth = 0;
        let span = document.createElement('span');

        span.style.display = 'inline-block';
        span.innerText = column.label;
        document.body.appendChild(span);

        realWidth = span.clientWidth;
        if(column.sortable == 'custom') realWidth = realWidth;
        else column.minWidth = realWidth;
        if(column.minWidth<realWidth) column.minWidth = realWidth;

        document.body.removeChild(span);
      }
      return h('span', {}, [column.label]);
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {'border-bottom': '1px solid #acaeb1'};
      /*if (columnIndex === 0) {
        obj = { 'border-bottom': '1px solid #acaeb1', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }*/
      return obj;
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    handleStateChange(val) {
      const self = this;
      self.curState = val;
    },

    dateChange(val) {
      const self = this;
      const tabIndex = Number(self.activeName);
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
      // self.dateValue[1] = self.dateValue[1];
      // self.inputSearchValue = '';
      self.tableDataList[tabIndex].page = 1;
    },

    handleTabClick(val) {
      const self = this;
      if (Number(val.index) < 4) {
        self.curState = Number(val.index) === 2 ? [2, 4] : [Number(val.index)];
      } else {
        const stateArr = [];
        self.eventStatesList.forEach(item => {
          stateArr.push(item.value);
        });
        self.curState = stateArr;
        self.curState.unshift('-1');
      }
      self.getEventList();
    },

    searchEventList() {
      //this.saveSearchParams(false);
      this.tableDataList[Number(this.activeName)].page = 1;
      console.log('this.searchParams ~~~~~~~>> ', this.searchParams);

      if(this.searchParams['searchFrom']=='PatrolPersonStat'){
        delete this.searchParams['searchParams']['clause']; //重新搜尋要把跳轉帶來的刪掉
        this.searchParams['searchFrom'] = '';
        this.searchParams['searchMysteryMode'] = -1;
      }else if(this.searchParams['searchFrom']=='EventStatistics'){
        delete this.searchParams['searchParams']['clause']; //重新搜尋要把跳轉帶來的刪掉
        this.searchParams['searchFrom'] = '';
        this.searchParams['searchMysteryMode'] = -1;
      }

      if(this.curReportType == 4){
        this.isShowInspectTagName = false
        this.isShowAssignerName = false
      }
      else if(this.curReportType == 3){
        this.isShowInspectTagName = false
        this.isShowAssignerName = true
      }
      else {
        this.isShowInspectTagName = true
        this.isShowAssignerName = true
      }


      this.getEventListAndCount();
    },

    searchData() {
      this.tableDataList[Number(this.activeName)].page = 1;
      this.getEventListAndCount();
    },

    getEventListAndCount() {
      if (this.dateValue.length === 0) return;
      this.getEventList('');
      this.getEventCount();
    },

    rowClickItem(row) {
      if(!this.stopRowClick){
        this.event = row;
        sessionStorage.setItem('event', JSON.stringify(this.event));
        sessionStorage.setItem('queryparams', JSON.stringify(this.params));
        sessionStorage.removeItem('needUpdateEvent')
        this.$router.push({ name: 'eventDetails', params: { event: this.event }});
      }else{
        this.stopRowClick = false;
      }
    },
    cellClickItem(row, column, cell, event){
      if(column.type == "selection"){
        this.stopRowClick = true;
      }
    },

    toEventDetail(row) {
      this.event = row;
      sessionStorage.setItem('event', JSON.stringify(this.event));
      sessionStorage.setItem('queryparams', JSON.stringify(this.params));
      sessionStorage.removeItem('needUpdateEvent')
      this.$router.push({ name: 'eventDetails', params: { event: this.event }});
    },

    sortChange(col) {
      const self = this;
      const tabIndex = Number(self.activeName);
      //console.log("sortChange page:",self.tableDataList[tabIndex].page);
      self.tableDataList[tabIndex].page = 1;
      const order = col.order;
      self.order = order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        self.params.order = {
          'direction': 'asc',
          'property': col.column.property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        self.params.order = {
          'direction': 'desc',
          'property': col.column.property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.params.order = {};
      }
      self.sortColumnOfTab[tabIndex].sortType.prop = prop;
      self.sortColumnOfTab[tabIndex].sortType.order = tempOrder;
      self.getEventList();
    },

    async getEventList(val) {
      //"GetEventList");
      console.log('getEventList ~~~~~>> ', val);
      const self = this;
      const tabIndex = Number(this.activeName);
      for(var k in self.tableDataList){
        self.tableDataList[k].tableData =[];
        self.tableDataList[k].total =0;
        //self.tableDataList[k].eventCount = 0;
      }
      /*const routeParams = sessionStorage.getItem('event_manage');
      console.log("routeParams:",routeParams);
      if(routeParams!=''){
        const routeData = JSON.parse(routeParams);
        this.getRouterData(routeData);
      }else{*/
      await self.getEventListRequestParams(val);

      //}
      if ( self.params.clause.storeId && self.params.clause.storeId.length === 0) {
        //return ;
        // this.tableDataList[tabIndex].tableData = [];
        // this.tableDataList[tabIndex].total = 0;
        // this.tableDataList[tabIndex].eventCount = 0;
        // this.totalElements = 0;
        // this.numberOfElements = 0;

        delete self.params.clause.storeId;
        return;
      }

      // self.params.searchMysteryMode = 0

      if(this.curReportType == -1){
        self.params.sourceType = null
        if(this.inspectId[0] == -1){
          self.params.inspectTagIds = []
        }
      }
      else if(this.curReportType == 0){self.params.sourceType = 1}
      else if(this.curReportType == 1){self.params.sourceType = 2}
      else if(this.curReportType == 2){self.params.sourceType = 0}
      else if(this.curReportType == 3){self.params.sourceType = 3}
      else if(this.curReportType == 4){self.params.sourceType = 4}

      console.log("@@@self.params:",self.params);

      eventRESTful.getEventList(self.params).then((res) => {
        const data = res.data.content;
        //console.log("data:",data);
        const temp = [];
        data.forEach(item => {
          const attachment = [];
          /*if (item.initialComment.attachment.length !== 0) {
            item.initialComment.attachment.some(x => x.mediaType === 0) ? attachment.push({ url: self.attachmentAudio }) : '';
            item.initialComment.attachment.some(x => (x.mediaType === 1||x.mediaType === 2)) ? attachment.push({ url: self.attachmentVideo }) : '';
            //item.initialComment.attachment.some(x => x.mediaType === 2) ? attachment.push({ url: self.attachmentImg }) : '';
          }*/
          if(item.isAttachPics){
            attachment.push({ url: self.attachmentVideo });
          }
          if(item.isAttachRecordings){
            attachment.push({ url: self.attachmentAudio });
          }
          const obj = {
            id: item.id,
            ts: util.getDateTime(item.ts),
            updateTs: util.getDateTime(item.updateTs),
            assignee: item.assignee,
            assignerName: item.assignerName,
            assigneeName: item.assigneeName,
            deviceId: item.deviceId,
            status: item.status,
            storeId: item.storeId,
            storeName: item.storeName,
            inspectTagName: item.inspectTagName,
            subject: item.subject,
            score: item.score,
            sourceType: item.sourceType,
            attachment: attachment,
            initialComment: item.initialComment,
            relatedDeviceIds: item.relatedDeviceIds,
            province: item.province,
            city: item.city,
            code: item.code,
            isSystemAdvancedEdited: item.isSystemAdvancedEdited,
            systemAdvancedActionTs: item.isSystemAdvancedEdited ? util.getDateTime(item.systemAdvancedActionTs) : "",
          };
          temp.push(obj);
        });
        self.tableDataList[tabIndex].tableData = temp;
        self.tableDataList[tabIndex].total = res.data.totalPages;
        self.tableDataList[tabIndex].eventCount = res.data.totalElements;
        self.tableDataList[tabIndex].page = res.data.pageable.pageNumber+1;
        self.totalElements = res.data.totalElements;
        if(tabIndex == this.activeName){
          self.page = (res.data.pageable.pageNumber+1);
          self.total = res.data.totalPages;
        }
        self.numberOfElements = res.data.numberOfElements;
        //self.handleTabClick(this.activeName);
      }).catch(err => {
        console.log('EventManagement-getEventList:' + err);
      });
    },

    getEventListRequestParams(val) {
      const tabIndex = Number(this.activeName);
      let like = {};
      if (this.inputSearchValue.trim().length !== 0) {
        const inputValue = this.inputSearchValue.trim();
        like = {
          subject: inputValue,
          assignerName: inputValue,
          storeName: inputValue
        };
      } else {
        like = {};
      }
      let storeId = null;
      var p = Object.assign({}, this.params);
      //if(this.searchParams['searchFrom']=='PatrolPersonStat' || this.searchParams['searchFrom']=="EventStatistics")
      storeId = Object.keys(this.storeFilterObj).length > 0 ? this.storeFilterObj.filterStoreIds : (p.hasOwnProperty('clause')) ? p.clause.storeId : '-1';
      /*else{
        if(p.clause){
          var tempStore = (p.clause.storeId)?p.clause.storeId:[];
          console.log("tempStore:",tempStore);
        }
        storeId =  (tempStore!="-1")? tempStore :((Object.keys(this.storeFilterObj).length > 0) ? this.storeFilterObj.filterStoreIds :'-1');
      }*/
      //console.log("getEventListRequestParams > storeId:",storeId);
      let status = [];
      if (this.curState.length !== 0) {
        if (this.curState.length === 1) {
          status = this.curState[0];
        } else {
          const allStatus = this.curState.some(item => item === '-1');
          if (allStatus) {
            status = [];
          } else {
            status = this.curState;
          }
        }
      } else {
        if(typeof this.searchParams.curState!="undefined" &&  this.searchParams.curState.length>0){
          status = this.searchParams.curState;
        }else{
          status = [];
        }

      }
      let page = 0;
      if (val === 'currentChange') {
        //console.log('currentChange',this.tableDataList[tabIndex].page);
        page = this.tableDataList[tabIndex].page-1;
      }
      if (val === 'Back') {
        page = this.params.filter.page;
      }
      let start = '', end = '';
      if(this.searchParams['searchFrom']=='PatrolPersonStat' || this.searchParams['searchFrom']=="EventStatistics"){
         //storeId = this.searchParams.clause.storeId;
          start = this.searchParams.beginTs;
          end = this.searchParams.endTs;
      }else{
        if (val === 0) {
          start = this.$moment(this.dateValue[0]).valueOf();
          end = this.$moment(this.dateValue[1]).valueOf();
          //console.log("1.**end:",this.$moment(endTime,'YYYY/MM/DD'));
        } else {
          start = this.$moment(this.dateValue[0]).valueOf();
          const endTime = this.dateValue[1];
          end = this.$moment(endTime).valueOf();
          //console.log("2.**end:",end);
        }
      }
      //end = end - end % 1000 + 99999;
      var params = {
          beginTs: start,
          endTs: end,
          clause: {
            status: status
          },
          filter: {
            page: page,
            size: this.tableDataList[tabIndex].sizeNum
          },
          like: like,
          searchMysteryMode : this.searchParams.searchMysteryMode
      }

      //console.log("1.this.params:",params);
      if(storeId && storeId!='-1' && storeId!=""){
        //console.log("storeId:",storeId);
        params.clause['storeId'] = storeId;
      }
      if(this.inspectId.length>0 && this.searchParams['searchFrom']!='PatrolPersonStat'){
        let inspectTagId = this.inspectId;
        if(this.inspectId[0]==='-1'){
          params['inspectTagIds'] = inspectTagId.slice(1);
        }else{
          params['inspectTagIds'] = inspectTagId;
        }
      }
      //console.log("2.this.params:",params);
      //console.log("this.searchParams:",this.searchParams);
      if(this.searchParams.hasOwnProperty('searchParams')){
        if(this.searchParams.searchParams.hasOwnProperty('clause') && this.searchParams['searchFrom']=='PatrolPersonStat'){
          params.clause['assigner'] =  this.searchParams.searchParams.clause.assigner;
        }
        if(this.searchParams.searchParams.hasOwnProperty('clause') && this.searchParams['searchFrom']=='EventStatistics'){
          params.clause['subject'] =  this.searchParams.searchParams.clause.subject;
        }
      }
      //console.log("this.params:",this.params);
      const curTabSortColumn = this.sortColumnOfTab[tabIndex];
      const order = curTabSortColumn.sortType.order;
      const prop = curTabSortColumn.sortType.prop;
      if (order.length > 0 && prop.length > 0) {
        params.order = {
          direction: order,
          property: prop
        };
      } else {
        params.order = {
          direction: 'desc',
          property: 'ts'
        };
      }
      this.order = params.order;
      this.params = params;
      this.ifSaveParams && this.saveSearchParams(false);
      this.ifSaveParams = true;
    },

    sizeChange(val) {
      const self = this;
      self.tableDataList[Number(self.activeName)].sizeNum = val.size;
      self.tableDataList[Number(self.activeName)].page = 1;
      self.sizeNum = val.size;
      self.getEventList();
    },

    currentChange(val) {
      const self = this;
      //console.log("currentChange val:",val);
      self.tableDataList[Number(self.activeName)].page = val.page;
      self.page = val.page;
      self.getEventList('currentChange');

      const dom = document.getElementsByClassName('el-table__body-wrapper is-scrolling-left')[0];
      const offestTop = dom.offsetTop;
      if (dom != undefined) {
        document.getElementsByClassName('el-table__body-wrapper is-scrolling-left')[0].scrollTop = 0;
      }
    },

    handleSelectionChange(val){
      //console.log("handleSelectionChange:",val);
      this.closingEventId = [];
      this.selectStoreList = [];
      if(val.length>0){
        this.showCloseBtn = true;
        val.map((item)=>{
          console.log(item)
          let store = this.storeList.find(p=>p.storeId == item.storeId)
          if(store && store.status == 61){
            if(this.selectStoreList.indexOf(store.name)<0){
              this.selectStoreList.push(store.name)
            }
          }
          //this.selectStoreList.push(store.status)
          //if(store)console.log("Status == " + store.status )
          this.closingEventId.push(item.id);
        })

        console.log(this.selectStoreList)
      }else{
        this.showCloseBtn = false;
      }
    },

    handleDisable(row, index){
      if (row.status==2 || row.status==4 || !PermissionHelper.enableEventClose() ) {
        return false
      } else {
        return true
      }
    },

    getEventCount() {
      const self = this;
      let start = this.$moment(self.dateValue[0]).valueOf();
      let endTime = this.$moment(self.dateValue[1]).valueOf();
      //console.log("**endTime.constructor:",endTime.constructor);
      let end = endTime.constructor === Date ? new Date(endTime).getTime() : endTime;
      //console.log("**endTime:",endTime);
      //end = end - end % 1000 + 99999;
      if(self.searchParams['searchFrom']=='PatrolPersonStat'|| this.searchParams['searchFrom']=="EventStatistics"){
         //storeId = this.searchParams.clause.storeId;
        start = self.searchParams.beginTs;
        end = self.searchParams.endTs;
      }
      //self.getEventListRequestParams('currentChange');
      //}
      //console.log("Get Event Count")
      //console.log(self.params)
      //console.log(self.params.clause.storeId);
      const tabIndex = Number(this.activeName);
      if ( self.params.clause.storeId && self.params.clause.storeId.length === 0) {

        console.log('tabIndex' ,tabIndex)
        // console.log('this.tableDataList', this.tableDataList)

        this.tableDataList[tabIndex].tableData = [];
        this.tableDataList[tabIndex].total = 0;
        this.tableDataList.forEach(i => i.eventCount = 0)
        this.totalElements = 0;
        this.numberOfElements = 0;


        // delete self.params.clause.storeId;
        return;
      }
      //console.log("self.params:",self.params);
      //console.log("self.storeFilterObj:",self.storeFilterObj);
      //let storeId = Object.keys(self.storeFilterObj).length > 0 ? self.storeFilterObj.filterStoreIds?self.storeFilterObj.filterStoreIds:self.storeFilterObj.curStore : (this.params.hasOwnProperty('clause'))?this.params.clause.storeId:'-1';

      //const storeId = Object.keys(self.storeFilterObj).length > 0 ? self.storeFilterObj.filterStoreIds : (self.params.hasOwnProperty('clause') && self.params.clause.hasOwnProperty('storeId'))?self.params.clause.storeId:'-1';
      let storeId = null;
      //if(self.searchParams['searchFrom']=='PatrolPersonStat' || self.searchParams['searchFrom']=="EventStatistics")
        storeId = Object.keys(self.storeFilterObj).length > 0 ? self.storeFilterObj.filterStoreIds : (self.searchParams.hasOwnProperty('clause'))?self.searchParams.clause.storeId:'-1';
      /*else
        storeId =  (self.searchParams.hasOwnProperty('clause'))?self.searchParams.clause.storeId:Object.keys(self.storeFilterObj).length > 0 ? self.storeFilterObj.filterStoreIds :'-1';
      */
      //console.log("getEventCount > storeId:",storeId)
      let like = {};
      if (self.inputSearchValue.trim().length !== 0) {
        const inputValue = self.inputSearchValue.trim();
        like = {
          subject: inputValue,
          assignerName: inputValue,
          storeName: inputValue
        };
      } else {
        like = {};
      }
      const params = {
        beginTs: start,
        endTs: end,
        clause: {
          storeId: storeId
        },
        like: like,
        searchMysteryMode:self.searchParams.searchMysteryMode,
      };
      if(storeId!='-1'){
        params['clause']['storeId'] = storeId
      }
      if(this.inspectId.length>0 && this.searchParams['searchFrom']!='PatrolPersonStat'){
        let inspectTagId = this.inspectId;
        if(this.inspectId[0]==='-1'){
          params['inspectTagIds'] = inspectTagId.slice(1);
        }else{
          params['inspectTagIds'] = inspectTagId;
        }
      }
      //console.log("1008: params",params);
      if(this.searchParams.hasOwnProperty('searchParams')){
        if(this.searchParams.searchParams.hasOwnProperty('clause')  && this.searchParams['searchFrom']=='PatrolPersonStat'){
          params.clause['assigner'] =  this.searchParams.searchParams.clause.assigner;
        }
        if(this.searchParams.searchParams.hasOwnProperty('clause') && this.searchParams['searchFrom']=='EventStatistics'){
          params.clause['subject'] =  this.searchParams.searchParams.clause.subject;
        }
      }

      if(this.curReportType == -1){
        params.sourceType = null
        if(this.inspectId[0] == -1){
          params.inspectTagIds = []
        }
      }
      else if(this.curReportType == 0){params.sourceType = 1}
      else if(this.curReportType == 1){params.sourceType = 2}
      else if(this.curReportType == 2){params.sourceType = 0}
      else if(this.curReportType == 3){params.sourceType = 3}
      else if(this.curReportType == 4){params.sourceType = 4}

      //delete params.clause['status'];
      if (storeId.length === 0) {
        for (let i = 0; i < 4; i++) {
          self.tableDataList[i].eventCount = 0;
        }
        self.tableDataList[4].eventCount = 0;
      } else {
        eventRESTful.GetEventCountByStatus(params).then(res => {
          const data = res.data;
          console.log("GetEventCountByStatus > data:",data);
          let numOfEventTotal = 0;
          for (let i = 0; i < 4; i++) {
            self.tableDataList[i].eventCount = data[i].numOfEvent;
            numOfEventTotal += data[i].numOfEvent;
          }
          self.tableDataList[2].eventCount += data[4].numOfEvent;
          self.tableDataList[4].eventCount = numOfEventTotal + data[4].numOfEvent;
        }).catch(err => {
          console.log('EventManagement-getEventCount:' + err);
        });
      }
    },

    getExportDataSize() {
      const self = this;
      const params = self.params;
      params.filter = {};
      return new Promise((resolve, reject) => {
        eventRESTful.getEventList(params).then((res) => {
          const size = res.data.totalElements;
          resolve(size);
        }).catch((error) => {
          reject(error);
        });
      });
    },

    async getExportData() {
      const self = this;
      const size = await self.getExportDataSize();
      self.params.filter = {
        'page': 0,
        'size': size
      };
      return new Promise((resolve, reject) => {
        eventRESTful.getEventList(self.params).then((res) => {
          const data = res.data.content;
          const temp = [];
          data.forEach(item => {
            const obj = {};
            obj.subject = item.subject;
            obj.storeName = item.storeName;
            obj.inspectTagName = item.inspectTagName;
            obj.assignerName = item.assignerName;
            obj.ts = util.getDateTime(item.ts);
            obj.province = item.province;
            obj.city = item.city;
            obj.code = item.code;
            temp.push(obj);
          });
          resolve(temp);
        }).catch(err => {
          console.log('EventMangement-getExportData:' + err);
        });
      });
    },

    getExportFileName() {
      const self = this;
      const tabIndex = Number(self.activeName);
      let label = '';
      switch (tabIndex) {
        case 0: label = this.$t('eventView.pendingEve'); break;
        case 1: label = this.$t('eventView.ProcessedEvent'); break;
        case 2: label = this.$t('eventView.ClosedEvent'); break;
        case 3: label = this.$t('eventView.ReturnEvent'); break;
        case 4: label = this.$t('eventView.allEvents'); break;
        default: console.error('error tab pages！'); break;
      }
      const fileName = label + '-' + util.getCurDateStr();
      return fileName;
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },
    getAllDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day + hour + min + sec
    },
    getDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day
    },
    getOnlyDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return  month + day
    },

    gotoDownloadManagement(){
      this.$router.push({name: 'downloadManagement',});
      this.showExportMassage = false
    },


    async export2Excel() {
      const that = this;
      try {
        const ret = await that.isLoginIn();
        if (ret.data != undefined && ret.data.isLogin) {

          const tabIndex = Number(that.activeName);
          if (that.tableDataList[tabIndex].tableData.length === 0) {
            util.notify(this.$t('eventView.noEvents'), 'warning', 3 * 1000);
            return false;
          }

          console.log('this.params :>> ', this.params);
          this.params.filter = {page: 0, size: 99999}


          const now = new Date()
          var nowTs = this.getAllDate(now)
          var tsbegin = this.getDate(this.dateValue[0])
          var tsEnd = this.getOnlyDate(this.dateValue[1])

          if(this.params.clause.status === 0) {
            var fileName = nowTs + "-Unhandled_events-" + tsbegin + tsEnd
          }
          else if(this.params.clause.status == 1){
            var fileName = nowTs + "-Handled_events-" + tsbegin + tsEnd
          }
          else if(this.params.clause.status == 3){
            var fileName = nowTs + "-Returned_events-" + tsbegin + tsEnd
          }
          else if(this.params.clause.status.length == 0){
            var fileName = nowTs + "-All_events-" + tsbegin + tsEnd
          }
          else{
            var fileName = nowTs + "-Closed_events-" + tsbegin + tsEnd
          }
          this.params.fileName = fileName

          var tempinspectTagName = []

          // console.log('this.inspectTableList :>> ', this.inspectTableList);
          // console.log('this.storeList :>> ', this.storeList);

          this.params.inspectTagIds = this.storeFilterObj.inspectTagId
          if(this.params.inspectTagIds.length == 0 || this.params.inspectTagIds[0] == '-1'){
            tempinspectTagName = ["全部"]
            this.params.inspectTagIds = []
          }
          else{
            this.params.inspectTagIds.forEach( i => {
              this.inspectTableList.forEach( n => {
                if(i == n.value) tempinspectTagName.push(n.label)
              })
            })
          }

          this.params.conTableName = tempinspectTagName.join(', ')
          this.params.conStoreName = this.storeList.length == this.params.clause.storeId.length ? "全部" : this.storeFilterObj.storeStr
          this.params.requestTs = now.getTime()

          this.showExportMassage = true
          exportEventList(this.params).then(res=>{
            console.log('res :>> ', res);
          })

          // require.ensure([], async() => {
          //   const { export_json_to_excel } = require('@/excel/Export2Excel');
          //   const tHeader = that.exportDataHeader;
          //   const filterVal = ['subject', 'inspectTagName', 'assignerName', 'ts', 'province', 'city', 'storeName', 'code'];
          //   const curData = await that.getExportData();
          //   const data = that.formatJson(filterVal, curData);
          //   export_json_to_excel(tHeader, data, that.getExportFileName());
          // });

        } else {
          const url = sessionStorage.getItem('LoginURL');
          window.location.href = url;
        }
      } catch (err) {
        console.log('EventManagement-export2Excel' + err);
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    isLoginIn() {
      return new Promise((resolve, reject) => {
        isLoginIn().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async initData() {
      console.log('init');
      const self = this;
      self.activeName = '0';
      self.dateValue = [new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24, this.$moment(new Date()).endOf('day')];
      self.inputSearchValue = '';
      self.total = 0;
      self.getSearchParams();
      const windowHeight = window.innerHeight;
      if (windowHeight > 800) {
        self.tableHeight = 770 + 'px';
      }
      console.log("Get Store List")
      let res  = await this.getBriefStoreData();
      if(res.errCode ==0){
        this.storeList = res.data;
      }
      console.log(this.storeList)
      console.log("Get Store List Finish")

      this.tableDataList[Number(this.activeName)].page = 1;
      this.getEventListAndCount() ;
    },
    // getRouterData(routeData) {
    //   //console.log("1.eventManage routeData:", routeData);
    //   let start = '', end = '';
    //   start = this.$moment(this.dateValue[0]).valueOf();
    //   const endTime = this.dateValue[1];
    //   end = this.$moment(endTime);
    //   this.params = {
    //       beginTs: start,
    //       endTs: end,
    //       clause: {
    //         status:[0],
    //         storeId: routeData.storeId,
    //         assigner : routeData.assigner
    //       },
    //       filter: {
    //         page: 1,
    //         size: 10
    //       },
    //     };
    //     //console.log("eventManage params:", this.params);
    //     sessionStorage.setItem('event_manage', '');
    //     //console.log("2.eventManage routeData:", sessionStorage.getItem('event_manage'));
    //     this.getEventList('Back');
    // },
    saveSearchParams(isLeave=false) {

      console.log("this.storeFilterObj:",this.storeFilterObj);

      const params = this.storeFilterObj;
      const { clause, filter, like, order } = { ...this.params };
      if(isLeave){
        let tempClause = clause;
        delete clause["assigner"];
        params.searchParams = { clause:tempClause, filter, like, order };
        //console.log("leave searchParams:",params.searchParams);
      }else{
        //params.curStore = this.storeFilterObj.filterStoreIds;
        params.searchParams = { clause, filter, like, order };
        params.searchParams.clause.storeId = this.storeFilterObj.filterStoreIds;
      }

      params.filterStoreIds = this.storeFilterObj.filterStoreIds;
      params.inputSearchValue = this.inputSearchValue;
      params.dateValue = this.dateValue;
      params.curState = this.curState;
      params.activeName = this.activeName;
      params.sizeNum = this.params.filter.size;
      params.page = this.params.filter.page;
      params.order = this.order;
      params.searchMysteryMode = -1;
      params.curReportType = this.curReportType;
      params.inspectTagId = this.inspectId;

      const searchConditon = {
        path: 'eventManage',
        params: params
      };
      console.log("save params:",params);
      SearchConditionUtil.saveSearchCondition(searchConditon);

    },


    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('eventManage');
      console.log("EventMange > getSearchParams > searchParams:",searchParams);

      if (Object.keys(searchParams).length > 0) {

        if(searchParams['searchFrom']=='PatrolPersonStat'){
          //this.dateValue =[searchParams.];
          this.curReportType = -1;
          this.storeFilterObj.filterStoreIds = searchParams.curStore;
          this.storeFilterObj.curStore=searchParams.curStore;
          this.storeFilterObj.storeIds=searchParams.curStore;
          this.storeFilterObj.curCountry = "-1";
          this.storeFilterObj.curProvince = ["-1"];
          this.storeFilterObj.curCity = ["-1"];
          this.params.beginTs = searchParams.beginTs;
          this.params.endTs = searchParams.endTs;
          this.dateValue = [util.getDates(searchParams.beginTs),searchParams.endTs];
          this.params.searchMysteryMode = searchParams.searchMysteryMode;

          //console.log("1.EventMange > getSearchParams > dateValue:",this.dateValue);
          //util.getDates(this.params.beginTs) + '-' + util.getDates(this.params.endTs);
        }
        else if(searchParams['searchFrom']=="EventStatistics"){
          this.params.beginTs = searchParams.beginTs;
          this.params.endTs = searchParams.endTs;
          this.storeFilterObj.filterStoreIds = searchParams.curStore;
          this.storeFilterObj.curStore=searchParams.curStore;
          this.storeFilterObj.storeIds=searchParams.curStore;
          this.dateValue = [util.getDates(searchParams.beginTs),searchParams.endTs];
          this.params.searchMysteryMode = -1;
          //console.log("EventMange > getSearchParams > searchParams.inspectTagId:",searchParams.inspectTagId);
          this.curReportType = -1;
          this.inspectCatch = !searchParams.inspectTagId ? '-1' : searchParams.inspectTagId;
          this.inspectId = this.inspectCatch;
          //console.log("1..EventMange > getSearchParams > dateValue:",this.dateValue);
        }
        else{
          this.storeFilterObj.filterStoreIds = (searchParams.curStore)?searchParams.curStore:[];
          this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
          //console.log("2.EventMange > getSearchParams > dateValue:",this.dateValue);
          this.params.beginTs = this.dateValue[0].valueOf();
          this.params.endTs = this.dateValue[1].valueOf();
          this.params.searchMysteryMode = -1;
          this.curReportType = (typeof searchParams.curReportType =='undefined')? -1 : searchParams.curReportType;
          this.inspectCatch = !searchParams.inspectTagId ? '-1' : searchParams.inspectTagId;
          console.log("EventMange > getSearchParams > this.inspectCatch:",this.inspectCatch);
        }
        this.inputSearchValue = searchParams.inputSearchValue;
        this.curState = searchParams.curState;
        this.curStore = searchParams.curStore;
        this.activeName = searchParams.activeName;
        this.sizeNum = searchParams.sizeNum;
        this.page = searchParams.page;
        this.order = searchParams.order;
        this.tableDataList[Number(this.activeName)].page = searchParams.page;
        this.params = searchParams.searchParams;
        this.searchParams = searchParams;
        this.ifGetParamsFromCash = true;

      } else {
        this.searchParams = {};
        this.curState = [0];
        this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
        this.params.beginTs = this.dateValue[0].valueOf();
        this.params.endTs = this.dateValue[1].valueOf();
        this.params.searchMysteryMode = -1;
        this.inspectCatch = '-1';
        this.curReportType = -1;
        this.ifGetParamsFromCash = false;
      }





    },

    async onStoreChange(storeObj) {
      //console.log("onStoreChange>storeFilterObj",storeObj);
      if(this.ifChangeAccount){
        this.ifChangeAccount =false;
        await this.getInspectList()
      }
      this.storeFilterObj = storeObj;
      this.ifSearchData && this.getEventListAndCount();
      this.ifSearchData = false;
    },
    doBachCloseEvent(){
      const self = this;
      if(self.selectStoreList.length>0){
        let names  = self.selectStoreList +""
        let msg  = this.$t('route.errorStoreNameNoPerssion').replace("{storeNames}",names);
        if(self.selectStoreList.length>1){
          msg = msg.replace("has no service","have no service")
        }
        util.notify(msg , 'error', 1000 );
        return
      }
      this.showBachCloseDialog = true;
    },
    confirmBachClose(){
      const self = this;
      //const eventIds = [];
      //eventIds.push(self.event.id);
      //console.log("this.closingEventId:",this.closingEventId);
      const comments = {
        ts: new Date().getTime(),
        //description: this.$t('eventView.closing'),
        status: 2
      };
      const params = {
        eventIds: this.closingEventId,
        comment: comments
      };
      eventRESTful.addComment(params).then(res => {
        self.showBachCloseDialog = false;
        const errMsg = res.errMsg;
        if (errMsg === 'Success') {
          util.notify(this.$t('storeView.successSubmit'), 'success', 3000);
          setTimeout(() => {
            self.searchData();
            /*self.commentList.forEach((_item, _index) => {
              self.getCommentDuration(_item);
            });*/
          }, 3000);
        } else {
          util.notify(this.$t('storeView.failSubmit'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        console.log('EventDetail-addComment:' + err);
      });
    },
    async getInspectList() {
      const self = this;
      const inspectArr = await self.getTagAll();
      // console.log('inspectArr ::::::::>> ', inspectArr);
      const newArr = ['-1'];
      const inspectList = [];
      inspectArr.forEach(_item => {
        if (self.curReportType === -1) {
          if (!newArr.includes(_item.id) && _item.mode !== 0) {
            newArr.push(_item.id);
            inspectList.push(
              {
                label: _item.name,
                value: _item.id
              }
            );
          }
        }
        // else if (self.curReportType === 0) {
        //   if (!newArr.includes(_item.id) && _item.mode === 0) {
        //     newArr.push(_item.id);
        //     inspectList.push(
        //       {
        //         label: _item.name,
        //         value: _item.id
        //       }
        //     );
        //   }
        // }
        else if (self.curReportType === 1) {
          if (!newArr.includes(_item.id) && _item.mode === 1) {
            newArr.push(_item.id);
            inspectList.push(
              {
                label: _item.name,
                value: _item.id
              }
            );
          }
        }
        else if (self.curReportType === 2 || self.curReportType === 3) {
          console.log('curReportType === 2 || 3')
        }
      });

      self.inspectTableList = inspectList;

      if (inspectList.length !== 0) {
        console.log(">>>>self.ifGetParamsFromCash:", self.ifGetParamsFromCash);
        self.inspectId = (self.ifGetParamsFromCash && self.inspectCatch!='-1') ? self.inspectCatch : newArr;

        // console.log('self.inspectId 1', self.inspectId)
        self.ifGetParamsFromCash = false;
      } else {
        self.inspectId = newArr;
        // console.log('self.inspectId 2', self.inspectId)
      }

      console.log('this.curReportType ::::::::>> ', this.curReportType);
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

  changeSelect(val) {
      this.inspectId = Array.from(val)[0];
  },

  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true;
    if (from.name === 'eventDetails' && to.name === 'eventManage') {
      to.meta.isBack = true;
      next();
    } else {
      to.meta.isBack = false;
      next();
    }
  },

  beforeRouteLeave(to, from, next) {
    // from.meta.keepAlive = true;
    if (to.name !== 'eventDetails') {
      from.meta.keepAlive = true;
      next();
    } else {
      from.meta.keepAlive = true;
      next();
    }
  }

  }
}
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
.el-event-content{
    width: 100%;
    position: relative;
    // border: 1px solid #e3e9f4;
    /*overflow: hidden;*/
    .sourceType-icon{
        margin-right: calc(20/1920*100vw);
        float: left;
        // height: 20px;
        width: 20px;
    }
    .enclosure-icon{
        margin-right: calc(8/1920*100vw);
        float: left;
        height: 16px;
        width: 16px;
    }
    .icon-span{
        display:inline-block;
        min-width:68px;
        height:24px;
        font-size: calc(12/1920*100vw);
        border-radius: 5px;
        white-space: nowrap;
        padding-left: 5px;
        padding-right: 5px;
    }
    .ja-icon{
      @extend .icon-span;
      width: 90px;
    }
    .icon-gengduo{
      width: 24px;
      height: 24px;
      vertical-align: middle;
      cursor: pointer;
    }
    .search-label {
      width: calc(76/1440*100vw);
      text-align: left;
      align-self: center;
      font-family: NotoSansCJKTC;
      font-size: calc(15/1920*100vw);
      font-weight: normal;
      margin-left:-10px;
    }
    .el-event-header{
        // text-align: left;
        // position: relative;
        // background-color: #fff;
        // border-bottom: 1px solid #e3e9f4;
        // font-size: calc(14/1920*100vw);
        // color: $black;
        .el-area{
          // padding: 30px calc(20/1920*100vw) 0 calc(30/1920*100vw);
            overflow: hidden;
        }
        .el-date >>> .el-select-dropdown__item{
            padding: 0 20px 0 50px !important;
            /*color: #7d8cad;*/
        }
        .el-date >>> .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
            font-family: "iconfont" !important;
            content: '\e6a2';
            left: 20px;
            font-size: calc(14/1920*100vw);
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .el-date >>> .el-select-dropdown.is-multiple .el-select-dropdown__item::after{
            font-family: "iconfont" !important;
            position: absolute;
            left: 20px;
            content: "\e64a";
            font-weight: 700;
            -webkit-font-smoothing: antialiased;
            font-size: calc(14/1920*100vw);
            font-style: normal;
            -moz-osx-font-smoothing: grayscale;
        }
        .el-date{
            text-align: left;
            padding: 0 calc(20/1920*100vw) 15px calc(30/1920*100vw);
            .date-title{
                margin-right:20px;
            }
            .iconbangzhu{
                margin-left:10px;
                font-size: calc(20/1920*100vw);
                position:relative;
                top:2px;
                color:$tab;
            }
            .date-range{
                width:300px;
            }
        }
        .store-handle{
            height: 30px;
            line-height: calc(30/1920*100vw);
            .choice-store{
                color: $tab;
                white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    float:left;
                    width: 98%;
                i{
                    margin-right: calc(15/1920*100vw);
                }
                .icon-tishi1{
                    font-size: calc(16/1920*100vw);
                }
            }
        }
        .search-button{
          float: right;
          color:#FFF;
          &:hover{
            background-color: #3d4854;
            color:#FFF;
          }
        }
    }
    .dialog-footer{
        @include point(margin-top,20);
        .file-content-btn{
            position: relative;
            left: 60%;
        }
    }
    .el-table-content{
      width: 100%;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
      position: relative;
      padding-top: calc(30/1920*100vw);
      .table-content{
            width:1900px;
            text-align: center;
            border: none;
            overflow-x: auto;
            /*height:300px;*/
            /*float:left;*/
          &.el-table{
            font-size: calc(15/1920*100vw);
          }
        }
      .btn-close{
        background-color:#c60957;border:none;float:left;margin-left:24px;
        &:hover{
          background-color:#ae0048;
          color: #fff;
        }
      }
    }
    .expiretag{
      font-family: NotoSansCJKTC;
      font-size: calc(10/1920*100vw);
      color: #556679;
    }
    #tabs-content  .el-tabs__item {
      padding: 0 0;
      font-size: calc(14/1920*100vw);
      width: 160px;
    }
    #tabs-content  .el-tabs__nav-scroll{
      margin-left:40px;
    }
    #tabs-content .el-tabs__active-bar{
      height: 4px;
    }
  .el-table-panel{
    /*@include point(margin-left,15);
    @include point(margin-right,15);*/
    margin-left:24px;
    margin-right:24px;
  }
  .clearfix{
    content: "";
    display: block;
    height: 0;
    clear:both;
    overflow: auto;
  }
}
.empty-data-icon{
    @include point(font-size,22);
    color: #53c247;
}
#dateinput{
    width: calc(300/1920*100vw);
    height: calc(24/1920*100vw);
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding-left: 30px;
    font-size: calc(12/1920*100vw);
}

  .el-search{
    @include point(margin-right,20);
    width: calc(160/1920*100vw);
  }
  /deep/
  .el-table th .el-checkbox__input {
      display: inline-block;
  }
  /deep/
  .el-table th .cell{
      word-wrap: normal;
      white-space: nowrap !important;
      text-overflow: clip;
    }
   /deep/
    .el-table
    .el-table__header-wrapper
    .el-table-column--selection
    .el-checkbox__inner
    {
      border-radius: 1px;
      border: solid 1px #acaeb1;
      background-color: #edf0f2;
      &::before{
        display:none;
      }
    }
    /deep/
    .el-table
    .el-table__header-wrapper
    .el-table-column--selection
    .is-checked
    .el-checkbox__inner
    {
      border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #2c90d9;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .el-checkbox__inner
    {
      border-radius: 1px;
      border: solid 1px #acaeb1;
      background-color: #fff;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .is-checked
    .el-checkbox__inner
    {
      border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #e0f2ff;
      color:#2c90d9;
      &::after{
       border-color:#2c90d9;
      }
    }
    /deep/
    .el-table__fixed-body-wrapper .el-table__body {
  padding-bottom: 6px; // 6px为横向滚动条高度
}

.last-row{
      display: flex;
      flex-direction: row;
      width:100%;
      margin-left: 42px;
      height: 36px;
      align-items: flex-start;
      align-items:center;
      justify-content: flex-start;
      padding-right: (180/1920*100vw);
}
.report-type-area{
    width:calc(346/1440*100vw);
    height: calc(36/1920*100vw);
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
        background: #F4F5F9 !important;
        /*border-radius: 0px !important;*/
        /*border: 0 !important;*/
    }

</style>
<style>
  @import '../../assets/css/pagination.css';
  @import '../../assets/css/tabsItem.css';
    .el-table::before{
        height: 0px !important;
    }
    .page-login-toolTipClass.el-tooltip__popper.is-light{
        background: #FEE4E7 !important;
        color: #f31d65 !important;
        border: 1px solid #f31d65 !important;
    }
    .date-picker-poper .el-button--text{
        visibility: hidden !important;
    }
    .select-poper .el-select-dropdown__item.hover{
        background-color:#FEE4E7;
    }
    .self-class-name .cell{
      display: flex ;
      align-items: center;
    }
    .table-content.el-table__body tr:hover>td{
      background-color: #f2f9fe !important;
    }

  /*.el-table__header{
    width:auto !important;
  }*/
  /*.tbl-checkbox.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #edf0f2;
    border-color: #acaeb1;
  }
  .tbl-checkbox.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #e0f2ff;
    border-color: #2c90d9;
}*/
</style>
