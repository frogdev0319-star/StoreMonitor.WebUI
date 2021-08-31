<template>
  <div :style="{'minHeight':windowHeight-118+'px'}" class="el-event-content">
    <div class="el-event-header">
      <div class="el-area">
        <store-filter
          :cached-params="searchParams"
          @storeChange = "onStoreChange"
        />
      </div>
      <div class="el-date">
        <span class="date-title">{{ $t('eventView.time') }}</span>
        <el-date-picker
          ref="datePicker"
          v-model="dateValue"
          :clearable="false"
          :editable="false"
          :popper-class="poperClass"
          :picker-options="dateOpt"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="$t('overview.startDate')"
          :end-placeholder="$t('overview.endDate')"
          type="datetimerange"
          range-separator="~"
          size="mini"
          format="yyyy/MM/dd HH:mm:ss"
          class="date-range"
          @change="dateChange"/>
        <el-tooltip
          :popper-class="toolTipClass"
          class="item"
          effect="dark"
          placement="bottom-end">
          <div slot="content">*{{ $t('remotePatrol.timePlaceholder') }}</div>
          <i class="iconfont icon-bangzhu iconbangzhu"/>
        </el-tooltip>
        <span
          class="date-title"
          style="margin-left:30px;">{{ $t('eventView.status') }}</span>
        <multi-select
          ref="multiState"
          :selected="curState"
          :alltype="0"
          :options="eventStatesList"
          :disabled="activeName!=='4'"
          style="display:inline;"
          @changeInput="handleStateChange"/>
        <span
          class="date-title"
          style="margin-left:30px;">{{ $t('remotePatrol.keywords') }}</span>
        <el-input
          v-model="inputSearchValue"
          size="small"
          class="el-search"
          clearable/>
        <delay-button
          class="search-button"
          type="primary"
          size="mini"
          @click="searchEventList"
        >
          <span>{{ $t('remotePatrol.search') }}</span>
        </delay-button>
      </div>
    </div>
    <div class="el-table-content">
      <delay-button
        :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
        class="absolute-btn"
        type="primary"
        size="mini"
        @click="export2Excel"
      >
        <div class="button-area">
          <img :src="exportPng" class="icon-excel">
          <span>{{ $t('eventView.exportReport') }}</span>
        </div>
      </delay-button>
      <el-tabs id="en-tabs-content" v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item,index) in tableDataList"
          :key="index"
          :label="`${item.label} （${item.eventCount}）`">
          <div class="el-table-panel">
            <el-table
              :data="item.tableData"
              :highlight-current-row="true"
              :height="windowHeight-260"
              :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
              :cell-style="cellStyle"
              empty-text="没有事件数据"
              align="left"
              stripe
              style=""
              class="table-content"
              @sort-change="sortChange"
              @row-click="rowClickItem"
            >
              <el-table-column
                min-width="100"
                header-align="center"
                align="center">
                <template slot-scope="scope" >
                  <span
                    v-if="scope.row.status === 0"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#FDBA40;" >
                    {{ $t('eventView.pending') }}
                  </span>
                  <span
                    v-else-if="scope.row.status === 1"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#434C5E;" >
                    {{ $t('eventView.handled') }}
                  </span>
                  <span
                    v-else-if="scope.row.status === 2"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#6097F3;" >
                    {{ $t('eventView.closed') }}
                  </span>
                  <span
                    v-else-if="scope.row.status === 3"
                    :class="lang.indexOf('ja') !== -1 ? 'ja-icon': 'icon-span'"
                    style="background-color:#FDBA40;" >
                    {{ $t('eventView.returnStatus') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('eventView.name')"
                :class-name = "selfClassName"
                prop="subject"
                min-width="220"
                align="left"
              >
                <template slot-scope="scope">
                  <img v-if="scope.row.sourceType === 0" :src="videoSrc" class="sourceType-icon">
                  <img v-else-if="scope.row.sourceType === 1" :src="inspectSrc" class="sourceType-icon">
                  <img v-else :src="insiteInspectSrc" class="sourceType-icon">
                  <span class="event-subject">{{ scope.row.subject }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('overview.patrolLists')" prop="inspectTagName" align="left" min-width="180"/>
              <el-table-column :label="$t('eventView.enclosure')" align="left" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.attachment.length!==0">
                    <img v-for="(item,index) in scope.row.attachment" :key="index" :src="item.url" class="enclosure-icon">
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('eventView.submitter')" prop="assignerName" align="left" width="120" sortable="custom"/>
              <el-table-column :label="$t('eventView.submitTime')" prop="ts" align="left" width="140" sortable="custom"/>
              <el-table-column :label="$t('remotePatrol.regionI')" prop="province" align="left" min-width="120"/>
              <el-table-column :label="$t('remotePatrol.regionII')" prop="city" align="left" min-width="120"/>
              <el-table-column :label="$t('eventView.stores')" prop="storeName" align="left" min-width="140" sortable="custom"/>
              <el-table-column :label="$t('remotePatrol.code')" prop="code" align="left" min-width="120"/>
              <el-table-column
                :label="$t('eventView.operation')"
                prop="option"
                min-width="80"
                align="left">
                <template slot-scope="scope">
                  <i class="iconfont icon-gengduo" @click="toEventDetail(scope.row)"/>
                </template>
              </el-table-column>
              <div slot="empty">
                <div>
                  <i class="iconfont icon-zhengque empty-data-icon"/>
                  <span class="empty-text">{{ $t('eventView.noEvents') }}</span>
                </div>
              </div>
            </el-table>
          </div>
          <div class="toolbar pagination clearfix" style="width:100%; margin:10px 15px 0px 0px;height:13%;">
            <el-pagination
              :page-sizes="[10, 20, 50, 100]"
              :current-page="item.page"
              :page-size="item.sizeNum"
              :total="item.total"
              background
              small
              layout="jumper,total, prev, pager, next,sizes"
              style="float:right;margin-top:10px;margin-bottom:10px;margin-right: 10px;"
              @size-change="sizeChange"
              @current-change="currentChange"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import util from '@/common/util.js';
import { eventRESTful } from '@/api/index';
import { getCookie } from '@/common/auth';
import { isLoginIn } from '@/api/login';
import { mapGetters } from 'vuex';
import { getBriefStoreList } from '@/api/store';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import LimitSelect from '@/components/LimitSelect';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DelayButton from '@/components/DelayButton';
import StoreFilter from '../../components/StoreFilter';

export default {
  name: 'EventManage',
  components: {
    StoreFilter,
    DelayButton,
    LimitSelect,
    MultiSelect,
    RegionMultiSelect
  },

  data() {
    return {
      dateValue: [],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('day');
        }
      },
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
      insiteInspectSrc: require('../../../static/img/onsite_patrol.png'),
      attachmentVideo: require('../../../static/img/video.png'),
      attachmentImg: require('../../../static/img/photo.png'),
      attachmentAudio: require('../../../static/img/audio.png'),
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
      poperClass: 'date-picker-poper',
      selectpoperClass: 'select-poper',
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
      ifSearchData: true
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
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        },
        300);
        self.initData();
        self.ifChangeAccount = true;
        self.ifSaveParams = false;
        this.ifSearchData = true;
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
  },

  activated() {
    const self = this;
    self.windowHeight = window.innerHeight;
    if (!self.$route.meta.isBack || self.isFirstLoad) {
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

  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
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
      const threeMonthAgo = util.getThreeMonths(end);
      if (end - start > end - threeMonthAgo) {
        util.notify(this.$t('eventView.changeTimeRange'), 'warning', 3 * 1000);
        self.dateValue = [new Date().setTime(threeMonthAgo), new Date().setTime(end)];
      } else {
        self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
      }
      self.dateValue[1] = self.dateValue[1];
      self.inputSearchValue = '';
      self.tableDataList[tabIndex].page = 1;
    },

    handleTabClick(val) {
      const self = this;
      if (Number(val.index) < 4) {
        self.curState = [Number(val.index)];
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
      this.tableDataList[Number(this.activeName)].page = 1;
      this.getEventListAndCount();
    },

    searchData() {
      this.tableDataList[Number(this.activeName)].page = this.page;
      this.getEventListAndCount();
    },

    getEventListAndCount() {
      if (this.dateValue.length === 0) return;
      this.getEventList();
      this.getEventCount();
    },

    rowClickItem(row) {
      this.event = row;
      sessionStorage.setItem('event', JSON.stringify(this.event));
      sessionStorage.setItem('queryparams', JSON.stringify(this.params));
      this.$router.push({ name: 'eventDetails', params: { event: this.event }});
    },

    toEventDetail(row) {
      this.event = row;
      sessionStorage.setItem('event', JSON.stringify(this.event));
      sessionStorage.setItem('queryparams', JSON.stringify(this.params));
      this.$router.push({ name: 'eventDetails', params: { event: this.event }});
    },

    sortChange(col) {
      const self = this;
      const tabIndex = Number(self.activeName);
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
      const self = this;
      const tabIndex = Number(this.activeName);

      self.getEventListRequestParams(val);
      this.ifSaveParams && self.saveSearchParams();
      this.ifSaveParams = true;
      if (self.params.clause.storeId.length === 0) {
        this.tableDataList[tabIndex].tableData = [];
        this.tableDataList[tabIndex].total = 0;
        this.tableDataList[tabIndex].eventCount = 0;
        this.totalElements = 0;
        this.numberOfElements = 0;
        return;
      }
      eventRESTful.getEventList(self.params).then((res) => {
        const data = res.data.content;
        const temp = [];
        data.forEach(item => {
          const attachment = [];
          if (item.initialComment.attachment.length !== 0) {
            item.initialComment.attachment.some(x => x.mediaType === 0) ? attachment.push({ url: self.attachmentAudio }) : '';
            item.initialComment.attachment.some(x => x.mediaType === 1) ? attachment.push({ url: self.attachmentVideo }) : '';
            item.initialComment.attachment.some(x => x.mediaType === 2) ? attachment.push({ url: self.attachmentImg }) : '';
          }
          const obj = {
            id: item.id,
            ts: util.getDateTime(item.ts),
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
            code: item.code
          };
          temp.push(obj);
        });
        self.tableDataList[tabIndex].tableData = temp;
        self.tableDataList[tabIndex].total = res.data.totalElements;
        self.tableDataList[tabIndex].eventCount = res.data.totalElements;
        self.totalElements = res.data.totalElements;
        self.numberOfElements = res.data.numberOfElements;
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
      const storeId = Object.keys(this.storeFilterObj).length > 0 ? this.storeFilterObj.filterStoreIds : this.params.clause.storeId;

      let status = [];
      if (this.curState.length !== 0) {
        if (this.curState.length === 1) {
          status = this.curState[0];
        } else {
          const allStatus = this.curState.some(item => item === '-1');
          if (allStatus) {
            status = [0, 1, 2, 3];
          } else {
            status = this.curState;
          }
        }
      } else {
        status = [0, 1, 2, 3];
      }
      let page = 0;
      if (val === 'currentChange') {
        page = this.tableDataList[tabIndex].page - 1;
      }
      if (val === 'Back') {
        page = this.params.filter.page;
      }
      let start = '', end = '';
      if (val === 0) {
        start = this.$moment(this.dateValue[0]);
        end = this.$moment(this.dateValue[1]);
      } else {
        start = this.dateValue[0];
        const endTime = this.dateValue[1];
        end = this.$moment(endTime);
      }
      end = end - end % 1000 + 999;
      this.params = {
        beginTs: start,
        endTs: end,
        clause: {
          status: status,
          storeId: storeId
        },
        filter: {
          page: page,
          size: this.tableDataList[tabIndex].sizeNum
        },
        like: like
      };
      const curTabSortColumn = this.sortColumnOfTab[tabIndex];
      const order = curTabSortColumn.sortType.order;
      const prop = curTabSortColumn.sortType.prop;
      if (order.length > 0 && prop.length > 0) {
        this.params.order = {
          direction: order,
          property: prop
        };
      } else {
        this.params.order = {
          direction: 'desc',
          property: 'ts'
        };
      }
      this.order = this.params.order;
    },

    sizeChange(val) {
      const self = this;
      self.tableDataList[Number(self.activeName)].sizeNum = val;
      self.tableDataList[Number(self.activeName)].page = 1;
      self.getEventList();
    },

    currentChange(val) {
      const self = this;
      self.tableDataList[Number(self.activeName)].page = val;
      self.getEventList('currentChange');

      const dom = document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0];
      const offestTop = dom.offsetTop;
      if (dom != undefined) {
        document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0].scrollTop = 0;
      }
    },

    getEventCount() {
      const self = this;
      const start = self.dateValue[0];
      const endTime = self.dateValue[1];
      let end = endTime.constructor === Date ? new Date(endTime).getTime() : endTime;
      end = end - end % 1000 + 999;
      const storeId = Object.keys(this.storeFilterObj).length > 0 ? this.storeFilterObj.filterStoreIds : this.params.clause.storeId;
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
        like: like
      };
      if (storeId.length === 0) {
        for (let i = 0; i < 4; i++) {
          self.tableDataList[i].eventCount = 0;
        }
        self.tableDataList[4].eventCount = 0;
      } else {
        eventRESTful.GetEventCountByStatus(params).then(res => {
          const data = res.data;
          let numOfEventTotal = 0;
          for (let i = 0; i < 4; i++) {
            self.tableDataList[i].eventCount = data[i].numOfEvent;
            numOfEventTotal += data[i].numOfEvent;
          }
          self.tableDataList[4].eventCount = numOfEventTotal;
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
          require.ensure([], async() => {
            const { export_json_to_excel } = require('@/excel/Export2Excel');
            const tHeader = that.exportDataHeader;
            const filterVal = ['subject', 'inspectTagName', 'assignerName', 'ts', 'province', 'city', 'storeName', 'code'];
            const curData = await that.getExportData();
            const data = that.formatJson(filterVal, curData);
            export_json_to_excel(tHeader, data, that.getExportFileName());
          });
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

    initData() {
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
    },

    saveSearchParams() {
      const params = this.storeFilterObj;
      params.searchParams = this.params;
      params.inputSearchValue = this.inputSearchValue;
      params.dateValue = this.dateValue;
      params.curState = this.curState;
      params.activeName = this.activeName;
      params.sizeNum = this.params.filter.size;
      params.page = this.params.filter.page;
      params.order = this.order;
      const searchConditon = {
        path: 'eventManage',
        params: params
      };
      SearchConditionUtil.saveSearchCondition(searchConditon);
    },

    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('eventManage');
      if (Object.keys(searchParams).length > 0) {
        this.dateValue[0] = searchParams.dateValue[0];
        this.dateValue[1] = this.$moment(this.dateValue[1]);
        this.inputSearchValue = searchParams.inputSearchValue;
        this.dateValue = searchParams.dateValue;
        this.curState = searchParams.curState;
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
      }
    },

    onStoreChange(storeObj) {
      this.storeFilterObj = storeObj;
      this.ifSearchData && this.searchData();
      this.ifSearchData = false;
    }
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
    if (to.name !== 'eventDetails') {
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
    border: 1px solid #e3e9f4;
    /*overflow: hidden;*/
    .sourceType-icon{
        margin-right: calc(20/1920*100vw);
        float: left;
        height: 28px;
        width: 24px;
    }
    .enclosure-icon{
        margin-right: calc(8/1920*100vw);
        float: left;
        height: 28px;
        width: 24px;
    }
    .icon-span{
        display:inline-block;
        width:60px;
        height:22px;
        color:white;
        font-size: 12px;
    }
    .ja-icon{
      @extend .icon-span;
      width: 80px;
    }
    .icon-gengduo{
      font-size: calc(24/1920*100vw);
      vertical-align: middle;
      cursor: pointer;
      color: #7d8cad;
    }
    .el-event-header{
        text-align: left;
        position: relative;
        background-color: #fff;
        border-bottom: 1px solid #e3e9f4;
        padding: 30px 20px 30px 30px;
        font-size: calc(14/1920*100vw);
        color: $black;
        .el-area{
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
            font-size: 14px;
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
            font-size: 14px;
            font-style: normal;
            -moz-osx-font-smoothing: grayscale;
        }
        .el-date{
            text-align: left;
            // position: relative;
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
      position: relative;
      padding-top: calc(30/1920*100vw);
      .table-content{
            width:100%;
            text-align: center;
            /*height:300px;*/
            /*float:left;*/
          &.el-table{
            font-size: calc(14/1920*100vw);
          }
        }
    }
    #tabs-content  .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: 160px;
    }
    #tabs-content  .el-tabs__nav-scroll{
      margin-left:40px;
    }
    #tabs-content .el-tabs__active-bar{
      height: 4px;
    }
  .el-table-panel{
    @include point(margin-left,15);
    @include point(margin-right,15);
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
    font-size: 12px;
}

  .el-search{
    @include point(margin-right,20);
    width: calc(160/1920*100vw);
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
</style>

