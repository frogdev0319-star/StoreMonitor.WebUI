<template>
  <div class="statistics-header">
    <div class="store-filter">
      <store-filter
        :cached-params="searchParams"
        :is-patrol="isPatrol"
        @storeChange = "onStoreChange"
      />
    </div>
    <div class="store-filter">
    <div class="last-row">
      <div v-if="isInspectItem || isPatrol" class="inspect-div">
        <div class="tag-label">{{ $t('overview.patrolLists') }}</div>
        <div class="tag-select">
          <el-select
            v-model="inspectList"
            :placeholder="$t('insSettingView.selectPost')"
            size="medium"
            class="el-province"
            @change="onInspectListChange">
            <el-option
              v-for="item in inspectTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
      </div>
      <div v-if="showDateSelector">

        <date-time-selector class="time-selector" @change="dateChange"/>
      </div>
      <div>
        <delay-button
          :disabled="storeListLength === 0 || inspectTypeList.length == 0"
          :class="lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
          type="primary"
          size="mini"
          @click="searchData"
        >
          <span>{{ $t('remotePatrol.search') }}</span>
        </delay-button>
      </div>
    </div>
    </div>
  </div>
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
import SelectedStores from './SelectedStores';


export default {
  name: 'SearchComponent',
  components: {
    SelectedStores,
    DateTimeSelector,
    StoreFilter,
    DelayButton,
    MultiSelect,
    RegionMultiSelect,

  },

  props: {
    isPatrol: {
      type: Boolean,
      default: false
    },
    isInspectItem: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    defaultSort: {
      type: Object
    },
    showDateSelector:{
      type:Boolean,
      default:true
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
      ifSaveParams: false,

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
      console.log("dateChange:",val);
    },

    onInspectListChange() {
      const filterInspect = this.inspectTypeList.filter(inspect => this.inspectList === inspect.id);
      this.storePatrolLists = filterInspect.length > 0 ? filterInspect[0].name : '';
    },

    async getInspectList() {
      console.log("*start getInspectList");
      const self = this;
      const newArr = [];
      const inspectList = [];
      const inspectArr = await self.getTagAll();
      console.log("*middle getInspectList",inspectArr);
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
      console.log("*End getInspectList",self.inspectList);
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
      console.log("Search Data",this.storeFilterObj)
     // if( this.params.storeIds && this.params.storeIds[0] &&this.params.storeIds[0]=='-1')this.params.storeIds=  this.params.storeIds.shift()
      this.params.timeMode = this.timeMode;
      this.params.curCountry= this.storeFilterObj.curCountry;
      this.params.curStore= this.storeFilterObj.curStore;
      this.params.curStoreGroup= this.storeFilterObj.curStoreGroup;
      this.params.curStoreType= this.storeFilterObj.curStoreType;
      this.params.inspectId = this.inspectList;
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
      //console.log(emitParmas)
      this.$emit('emitSearch', emitParmas);
    },

    getInspectId() {
      console.log("*then getInspectList > getInspectId",this.inspectList);
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
      console.log("*then getInspectList > getInspectId",this.params.inspectId);
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
      //console.log("saveSearchParams:",saveParamsObj);
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
      //console.log("Save Comdition="+saveParamsObj.path)
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
        this.inspectList = searchParams.inspectId?searchParams.inspectId:""
        this.ifGetParamsFromCash = true;
        this.searchParams = searchParams;
      } else {
        this.searchParams = {};
      }
    //  console.log("Get Search Component")
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
     // console.log("*onStoreChange>storeObj:",storeObj);
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
    background-color: #edf0f2;
    color: $black;
    position: relative;
    .store-filter{
      margin-left: 32px;

    }
    .header-details{
      text-align: left;
      padding-left: calc(32/1440*100vw);
      position: relative;
      display: flex;
      flex-direction: row;
      margin-top: 16px;
      .search-content{
        display: inline-block;
      }
      .date-range {
        border: 1px solid #ccc;
        width: 200px;
        height: calc(36/1920*100vw);
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


      .normal-span{
        font-size: calc(14/1440*100vw);
        margin-right: calc(20/1440*100vw);
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
      padding-right: calc(60/1920*100vw);
    }
    .time-selector{
      margin-right: calc(30/1920*100vw);
    }
    .last-row{
      display: flex;
      flex-direction: row;
      width:calc(1066/1440*100vw);
      height: 50px;
      justify-content: space-between;
      margin-top: 16px;
      padding-bottom: 24px;
      .search-button{
        margin-left:35px;
        width: 102px;
        height: calc(36/1920*100vw);
        background-color: #556679;
        border-color: #556679;
        color:#fff;
        font-size: calc(15/1920*100vw);
      }
    }
    .inspect-div{
      width:calc(298/1440*100vw);
      height: calc(36/1920*100vw);
      display: flex;
      flex-direction: row;
      .tag-label{
        width: calc(76/1440*100vw);
        text-align: left;
        align-self: center;
        font-family: NotoSansCJKTC;
        font-size: calc(15/1920*100vw);
        font-weight: normal;
      }
      .tag-select{
        width:calc(222/1440*100vw);
        height: calc(36/1920*100vw);
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      }
      .el-province{
        width: calc(222/1440*100vw);
        height: calc(36/1920*100vw);
        background-color: #fff;
        min-width: 85px;
        min-height: 28px;
      }
    }
    /deep/
    .el-select.el-select--medium .el-input .el-input__inner{
      background-color: #fff !important;
    }
  }
</style>
<style scoped>
  .el-select-dropdown__item{
    padding: 0 40px 0 20px !important;
    /*color: #7d8cad;*/
  }

  .input-class{
    width: calc(100% - 30px);
    position: absolute;
    left: 0;
  }
  /deep/ .el-select .el-input--medium .el-input__suffix{
    top:0px !important;

  }
  /deep/ .input-class.el-input--medium .el-input__inner{
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: none;
    border-right: none;
    color: #2b2b2b;
    background: transparent !important;
    padding: 0 10px;
    font-size: calc(15/1920*100vw);
    min-width: 55px;
    min-height: 28px;
  }
  /deep/ .el-select.el-select--medium .el-input .el-input__inner{
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

  /deep/ .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  /deep/ .el-input--medium .el-input__icon {
    line-height: calc(36/1920*100vw);
    height: calc(36/1920*100vw);
    min-height: 28px;
    color: #2c90d9;
  }
  .el-select.el-select--medium{
    color: #2b2b2b;
    background: #fff !important;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: none !important;
    width: 100%;
    border-radius: 3px;
    min-height: calc(28/1920*100vw);
    min-width: 85px;
  }
</style>
