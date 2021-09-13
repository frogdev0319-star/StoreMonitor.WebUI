<template>
  <el-col :span="24" class="statistics-header">
    <el-col :span="24" class="header-details">
      <store-filter
        :cached-params="searchParams"
        :is-patrol="isPatrol"
        @storeChange = "onStoreChange"
      />
    </el-col>
    <el-col :span="24" class="header-details">
      <span :class="isInspectItem ? 'inspect-span' : 'normal-span'" >
        {{ $t('remotePatrol.time') }}</span>
      <date-time-selector class="time-selector" @change="dateChange"/>
      <span v-if="isInspectItem || isPatrol">
        <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('overview.patrolLists') }}</span>
        <el-select
          v-model="inspectList"
          :placeholder="$t('insSettingView.selectPost')"
          size="mini"
          class="el-province"
          @change="onInspectListChange">
          <el-option
            v-for="item in inspectTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </span>
      <div class="search-btns">
        <delay-button
          :disabled="storeListLength === 0"
          :class="lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
          type="primary"
          size="mini"
          @click="searchData"
        >
          <span>{{ $t('remotePatrol.search') }}</span>
        </delay-button>
        <delay-button
          v-if="!isInspectItem"
          :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
          type="primary"
          size="mini"
          style="vertical-align: middle;"
          @click="handleExportPdf">
          <div class="button-area">
            <i class="iconfont icon-pdf"/>
            <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
          </div>
        </delay-button>
      </div>
    </el-col>
  </el-col>
</template>

<script>
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getBriefStoreList } from '@/api/store';
import util from '@/common/util.js';
import { inpectRESTful } from '@/api/index';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DelayButton from '@/components/DelayButton';
import StoreFilter from './StoreFilter';
import DateTimeSelector from './DateTimeSelector';

export default {
  name: 'SearchComponent',
  components: {
    DateTimeSelector,
    StoreFilter,
    DelayButton,
    MultiSelect,
    RegionMultiSelect
  },

  props: {
    isPatrol: {
      type: Boolean,
      default: false
    },
    isInspectItem: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    },
    defaultSort: {
      type: Object
    }
  },

  data() {
    return {
      dateValue: [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      toolTipClass: 'page-login-toolTipClass',
      lang: this.$i18n.locale,
      params: {},
      poperClass: 'date-picker-poper',
      selectpoperClass: 'select-poper',
      daysRangeList: [],
      filterStoreIds: [],
      curRegionI: [],
      curRegionII: [],
      regionMode: 1,
      inspectTypeList: [],
      inspectList: '',
      allStoreData: [],
      storePatrolLists: [],
      ifGetParamsFromCash: false,
      storeListLength: -1,
      order: { direction: '', property: '' },
      filter: { page: 0, size: 10 },
      inspectCatch: '',
      storeFilterObj: {},
      searchParams: {},
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
        this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
        this.params.beginTs = this.dateValue[0].valueOf();
        this.params.endTs = this.dateValue[1].valueOf();
        self.ifGetParamsFromCash = false;
        self.ifSaveParams = false;
        await this.getSearchParams();
        self.initDaysRange();
        self.initData();
        self.curStoreTag = [];
      }
    }
  },

  async created() {
    const self = this;
    this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
    this.params.beginTs = this.dateValue[0].valueOf();
    this.params.endTs = this.dateValue[1].valueOf();
    self.params.timeMode = self.timeMode;
    await this.getSearchParams();
    self.initDaysRange();
    self.initData();
  },

  methods: {
    dateChange(val) {
      this.dateValue = val;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const daysDiff = this.$moment(end).diff(start, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
      this.params.beginTs = start;
      this.params.endTs = end;
      this.daysRangeList = util.getDaysRangeList(start, end, this.timeMode);
    },

    onInspectListChange() {
      const filterInspect = this.inspectTypeList.filter(inspect => this.inspectList === inspect.id);
      this.storePatrolLists = filterInspect.length > 0 ? filterInspect[0].name : '';
    },

    async getInspectList() {
      const self = this;
      const newArr = [];
      const inspectList = [];
      const inspectArr = await self.getTagAll();
      inspectArr.forEach(_item => {
        if (!newArr.includes(_item.id)) {
          newArr.push(_item.id);
          inspectList.push(_item);
        }
      });
      self.inspectTypeList = inspectList;
      self.isPatrol ? self.inspectTypeList.unshift({ id: '-1', name: self.$t('remotePatrol.all') }) : null;
      if (inspectList.length !== 0) {
        self.inspectList = self.ifGetParamsFromCash
          ? (self.inspectTypeList.map(x => x.id).indexOf(self.inspectCatch) !== -1
            ? self.inspectCatch : '') : self.inspectTypeList[0].id;
      } else {
        self.inspectList = '';
      }
    },

    async getCountryStore() {
      if (this.isInspectItem || this.isPatrol) {
        await this.getInspectList();
        this.getInspectId();
      }
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    async searchData() {
      this.params.storeIds = this.storeFilterObj.filterStoreIds;
      this.params.timeMode = this.timeMode;
      const emitParmas = {};
      emitParmas.searchParams = this.params;
      emitParmas.dateRangeList = this.daysRangeList;
      emitParmas.regionI = this.storeFilterObj.curRegionI;
      emitParmas.regionII = this.storeFilterObj.curRegionII;
      emitParmas.regionMode = this.storeFilterObj.regionMode;
      emitParmas.storePatrolLists = this.storePatrolLists;
      emitParmas.storeStr = this.storeFilterObj.storeStr;
      emitParmas.storeGroupStr = this.storeFilterObj.storeGroupString;
      emitParmas.storeTypeStr = this.storeFilterObj.storeTypeString;
      emitParmas.timeMode = this.timeMode;
      this.$emit('emitSearch', emitParmas);
    },

    getInspectId() {
      const length = this.inspectTypeList.length;
      for (let i = 0; i < length; i++) {
        const name = this.inspectTypeList[i].name;
        const id = this.inspectTypeList[i].id;
        if (this.inspectList === id) {
          this.params.inspectId = id;
          this.storePatrolLists = name;
        } else {
          this.params.inspectId = this.inspectList === '-1' ? '' : this.inspectList;
        }
      }
    },

    initDaysRange() {
      const self = this;
      const start = self.params.beginTs;
      const end = self.params.endTs;
      const startDay = self.$moment(start).format('YYYY-MM-DD');
      const endDay = self.$moment(end).format('YYYY-MM-DD');
      const startDayWithoutYear = self.$moment(start).format('MM/DD');
      const endDayWithoutYear = self.$moment(end).format('MM/DD');
      if (self.timeMode === 1) {
        const beginDay = new Date(util.judgeStart(startDay));
        const weekList = util.getWeek(beginDay, endDay);
        const arrLength = weekList.length;
        const firstEndTime = weekList[0].split('-')[1];
        const firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
        const lastStartTime = weekList[arrLength - 1].split('-')[0];
        const lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
        weekList.splice(0, 1, firstWeekStr);
        weekList.splice(arrLength - 1, 1, lastWeekStr);
        self.daysRangeList = weekList;
      } else if (self.timeMode === 2) {
        self.daysRangeList = util.getMonthBetween(startDay, endDay);
      }
    },

    initData() {
      this.getCountryStore();
    },

    handleExportPdf() {
      this.$emit('exportPdf', this.storeFilterObj.storeStr, this.storeFilterObj.storeGroupString, this.storeFilterObj.storeTypeString);
    },

    getTagAll() {
      const self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList().then(res => {
          const data = res.data;
          self.inspectTypeList = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    saveSearchParams(saveParamsObj) {
      const params = saveParamsObj.params;
      params.curCountry = this.storeFilterObj.curCountry;
      params.curProvince = this.storeFilterObj.curProvince;
      params.curCity = this.storeFilterObj.curCity;
      params.curStore = this.storeFilterObj.curStore;
      params.curStoreGroup = this.storeFilterObj.curStoreGroup;
      params.curStoreType = this.storeFilterObj.curStoreType;
      params.timeMode = this.timeMode;
      params.inspectId = this.inspectList === '-1' ? '' : this.inspectList;
      params.storeIds = this.storeFilterObj.filterStoreIds;
      SearchConditionUtil.saveSearchCondition(saveParamsObj);
    },

    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition(this.path);
      this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      this.params.beginTs = this.dateValue[0].valueOf();
      this.params.endTs = this.dateValue[1].valueOf();
      if (Object.keys(searchParams).length > 0) {
        this.params.timeMode = this.timeMode;
        this.params.inspectId = searchParams.inspectId;
        this.timeMode = searchParams.timeMode;
        this.order = searchParams.order;
        this.filter = searchParams.filter;
        this.inspectCatch = searchParams.inspectId;
        this.ifGetParamsFromCash = true;
        this.searchParams = searchParams;
      } else {
        this.searchParams = {};
      }
      const daysDiff = this.$moment(this.params.endTs).diff(this.params.beginTs, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
    },

    setDefaultSort() {
      const paramsObj = {};
      paramsObj.defaultSort = this.defaultSort;
      paramsObj.filter = this.filter;
      this.$emit('setDefaultSortAndPage', paramsObj);
    },

    onStoreChange(storeObj) {
      this.storeFilterObj = storeObj;
      !this.ifSaveParams && this.searchData();
      this.ifSaveParams = true;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../assets/sass/stastical.scss";

  .statistics-header{
    background-color: #fff;
    color: $black;
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
      .normal-span{
        font-size: calc(14/1920*100vw);
        margin-right: calc(20/1920*100vw);
      }
      .inspect-span{
        margin-right: calc(20/1920*100vw);
        font-size: calc(14/1920*100vw);
        margin-left: 0;
        @media screen and (max-width: 1465px){
          margin-right: 0px;
        }
      }
    }
    .header-details:nth-child(1){
      padding-right: calc(60/1920*100vw);
      @media screen and (max-width: 1360px){
        padding-right: calc(20/1920*100vw);
      }
    }
    .header-details:nth-child(2){
      padding-top:15px;
      padding-bottom: 30px;
      padding-right: calc(60/1920*100vw);
    }
    .time-selector{
      margin-right: calc(30/1920*100vw);
    }
  }
</style>
