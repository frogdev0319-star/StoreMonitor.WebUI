<template>
  <el-col :span="24" class="statistics-header">
    <el-col :span="24" class="header-details">
      <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('remotePatrol.storeSelect') }}</span>
      <el-select
        v-model="curCountry"
        :placeholder="$t('remotePatrol.country')"
        size="mini"
        class="el-province"
        @change="changeCountry">
        <el-option-group v-for="group in countryList" :key="group.label" :label="group.label">
          <el-option
            v-for="item in group.countryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
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
      <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('remotePatrol.selectStoreTag') }}</span>
      <multi-select
        ref="TagMultiSelect"
        :selected="curStoreTag"
        :placeholder="$t('remotePatrol.selectStoreTag')"
        :all-select="0"
        :alltype="0"
        :options="storeTagList"
        style="display: inline;margin-left: calc(20/1920*100vw);"
        @changeInput="handleStoreTagChange"/>
      <span v-if="isInspectItem">
        <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('overview.patrolLists') }}</span>
        <el-select
          v-model="inspectList"
          :placeholder="$t('insSettingView.selectPost')"
          size="mini"
          class="el-province">
          <el-option
            v-for="item in inspectTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </span>

    </el-col>

    <el-col :span="24" class="header-details">
      <span :class="isInspectItem ? 'inspect-span' : 'normal-span'" >
        {{ $t('remotePatrol.time') }}</span>
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
      <div class="exprotBtn" style="float:right;">
        <el-button
          :class="lang==='en'? 'en-search-btn':'search-btn' "
          :disabled="storeDataList.length === 0"
          size="mini"
          style="vertical-align: middle;"
          type="primary"
          @click="searchData">{{ $t('remotePatrol.search') }}</el-button>
        <el-button
          v-if="!isInspectItem"
          :class="lang === 'en'? 'en-search-btn':'search-btn' "
          type="primary"
          size="mini"
          style="vertical-align: middle;"
          @click="handleExportPdf"
        >
          <div class="btn-area">
            <i class="iconfont icon-pdf" style="font-size: calc(24/1920*100vw);vertical-align: middle;"/>
            <span style="font-size: calc(14/1920*100vw);margin:0 0 0 10px;vertical-align: middle;">
              {{ $t('remotePatrol.InspectionDetail') }}
            </span>
          </div>
        </el-button>
      </div>
    </el-col>
  </el-col>
</template>

<script>
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getStoreList, getBriefStoreList, GetTagList } from '@/api/store';
import util from '../common/util.js';
import { inpectRESTful } from '@/api/index';

export default {
  name: 'SearchComponent',
  components: {
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
    }
  },

  data() {
    return {
      curCountry: '',
      curStoreTag: [],
      storeTagList: [],
      countryList: [],
      curProvince: [],
      provinceList: [],
      curCity: [],
      cityList: [],
      curStore: [],
      storeList: [],
      storeDataList: [],
      dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()],
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
      timeMode: 1, // weekly mode
      daysRangeList: [],
      storeStr: '',
      tagNameStr: '',
      filterStoreIds: [],
      curRegionI: [],
      curRegionII: [],
      regionMode: 1,
      inspectTypeList: [],
      inspectList: '',
      allStoreData: [],
      storePatrolLists: []
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
        self.initData();
        self.curStoreTag = [];
      }
    }
  },

  async created() {
    const self = this;
    const start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
    const end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
    self.params.beginTs = start;
    self.params.endTs = end;
    self.params.timeMode = self.timeMode;
    self.tagNameStr = '--';
    self.initDaysRange();
    self.initData();
  },

  mounted() {
    const self = this;
    window.addEventListener('resize', self.adjustChart, false);
    self.sidebarElm = document.getElementsByClassName('aside-menu')[0];
    self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false);
  },

  beforeDestroy() {
    const self = this;
    window.removeEventListener('resize', self.adjustChart);
    self.adjustChart = null;
    self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar, false);
    self.$refs.eventSourceRef && self.$refs.eventSourceRef.dispose();
    self.$refs.storeEventRef && self.$refs.storeEventRef.dispose();
  },

  methods: {
    dateChange(val) {
      const self = this;
      let start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
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
      self.params.beginTs = start;
      self.params.endTs = end;
      self.initDaysRange();
    },

    async getAllStoreList() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      const retData = await self.getStoreData(params);
      self.allStoreData = Object.keys(retData.data).length > 0 ? retData.data.content : [];
      self.getInspectList();
    },

    getInspectList(storeArray) {
      const self = this;
      const inspectArr = [];
      console.log(self.filterStoreIds);
      self.allStoreData.forEach(item => {
        if (self.filterStoreIds.indexOf(item.storeId) !== -1 && item.appliedInspect.length !== 0) {
          inspectArr.push(item.appliedInspect);
        }
      });
      const newArr = [];
      const inspectList = [];
      inspectArr.forEach(item => {
        item.forEach(_item => {
          if (!newArr.includes(_item.id)) {
            newArr.push(_item.id);
            inspectList.push(_item);
          }
        });
      });
      self.inspectTypeList = inspectList;
      if (inspectList.length !== 0) {
        self.inspectList = inspectList[0].id;
      } else {
        self.inspectList = '';
      }
    },

    getStoreData(params) {
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getRegionInfo() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      const retData = await self.getStoreData(params);
      const storeList = retData.data.content;
      self.storeList = storeList;

      const getCountry = storeList => {
        const temp = [];
        storeList.forEach(item => {
          if (temp.map(x => x.value).indexOf(item.country) === -1) {
            const obj = {
              label: item.country,
              value: item.country
            };
            temp.push(obj);
          }
        });
        return temp;
      };
      const countryList = getCountry(storeList);
      const tempStore = [];
      storeList.forEach(item => {
        const obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          checked: false
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
      self.countryList[0] = {};
      self.countryList[0].label = self.$t('remotePatrol.country');
      self.countryList[0].countryList = countryList;
      self.curCountry = countryList[0].label;
      self.selectAllProAndCity(self.curCountry);
    },

    async getCountryStore() {
      const self = this;
      const data = await self.getBriefStoreData();
      const temp = [];
      if (data.errCode === 0 && data.errMsg === 'Success') {
        self.storeList = data.data;
        if (self.storeList.length !== 0) {
          self.storeList.forEach(item => {
            const country = item.country;
            if (temp.map(x => x.label).indexOf(country) === -1) {
              const obj = {
                value: country,
                label: country
              };
              temp.push(obj);
            }
          });
        }
        const countryList = temp;
        self.countryList[0] = {};
        self.countryList[0].label = self.$t('remotePatrol.country');
        self.countryList[0].countryList = countryList;
        self.countryList[0].countryList.unshift({ value: '-1', label: self.$t('remotePatrol.all') });
        self.curCountry = countryList[0].value;
        self.selectAllProAndCity(self.curCountry);
      }
    },

    handleStoreChange(arr) {
      this.curStore = arr;
      this.changeStoreNew(arr);
    },

    changeStoreNew(val) {
      const self = this;
      let str = '';
      self.storeList.forEach((item, index) => {
        val.forEach(_item => {
          if (item.storeId === _item) {
            str += item.name + '，';
          }
        });
      });
      str = str.substr(0, str.length - 1);
      self.storeStr = str;
      self.filterStore();
      self.isInspectItem ? self.getInspectList() : '';
    },

    handleProChange(arr) {
      this.curProvince = arr;
      this.changePro(arr);
    },

    handleCityChange(arr) {
      this.curCity = arr;
      this.changeCity(arr);
    },

    changePro(val) {
      const self = this;
      self.curCity = [];
      self.clearCityInfo();
      self.clearStoreInfo();
      const storeList = self.storeList;
      const temp = [];
      const tempStore = [];
      if (val === '') {
        storeList.forEach(item => {
          if (item.country === self.curCountry) {
            const storeObj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              tagIds: item.tagIds
            };
            tempStore.push(storeObj);
          }
        });
      } else {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.province === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                const obj = {
                  label: item.city,
                  value: item.city
                };
                temp.push(obj);
              }
              const obj = {
                storeId: item.storeId,
                label: item.name,
                value: item.name
              };
              tempStore.push(obj);
            }
          });
        });
        self.cityList = temp;
        const cityArr = [];
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
      self.changeStoreNew(self.curStore);
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

    getTagListData() {
      const self = this;
      return new Promise((resolve, reject) => {
        GetTagList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            res.data.forEach(item => {
              const tabObj = {};
              tabObj.value = item.tagId;
              tabObj.label = item.tagName;
              tabObj.disabled = false;
              self.storeTagList.push(tabObj);
            });
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    handleStoreTagChange(val) {
      this.curStoreTag = val;
      this.tagNameStr = '';
      const tagArray = this.storeTagList.filter(tagItem => val.find(tagId => tagId === tagItem.value));
      tagArray.forEach(tagItem => {
        this.tagNameStr += tagItem.label + '，';
      });
      this.tagNameStr = this.tagNameStr.substr(0, this.tagNameStr.length - 1);
      this.filterStore();
      this.isInspectItem ? this.getInspectList() : '';
    },

    filterStore() {
      const self = this;
      let filterStoreArray = [];
      if (self.curStoreTag.length > 0) {
        filterStoreArray = self.storeList.filter(storeItem => self.curStoreTag.find(tagItem => storeItem.tagIds.find(tagId => tagItem === tagId)));
        console.log(filterStoreArray);
      } else {
        filterStoreArray = self.storeList;
      }
      console.log(filterStoreArray);
      const filterSameStore = [];
      filterStoreArray.forEach(store => {
        self.curStore.forEach(selectStore => {
          if (selectStore === store.storeId) {
            filterSameStore.push(store);
          }
        });
      });
      console.log(filterSameStore);
      const filterStoreIds = [];
      let filterStoreStr = '';
      filterSameStore.map(store => {
        filterStoreIds.push(store.storeId);
        filterStoreStr += `${store.name}，`;
      });
      self.filterStoreIds = filterStoreIds;
      self.storeStr = filterStoreStr.substr(0, filterStoreStr.length - 1);
    },

    changeCountry(val) {
      const self = this;
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      self.selectAllProAndCity(val);
    },

    changeCity(val) {
      const self = this;
      self.clearStoreInfo();
      const storeList = self.storeList;
      const tempStore = [];
      if (val.length !== 0) {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.city === _item) {
              if (tempStore.map(x => x.value).indexOf(item.city) === -1) {
                const storeObj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name
                };
                tempStore.push(storeObj);
              }
            }
          });
        });
      }
      self.storeDataList = tempStore;
      let storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });
      self.curStore = storeArr;
      self.changeStoreNew(self.curStore);
    },

    clearStoreInfo() {
      const self = this;
      self.curStore = [];
      self.paramsStoreIds = [];
      self.$refs.multiSelect.selectedArray = [];
      self.$refs.multiSelect.input = '';
    },

    clearProviceInfo() {
      const self = this;
      self.curProvince = [];
      self.$refs.proviceSelect.selectedArray = [];
      self.$refs.proviceSelect.input = '';
    },

    clearCityInfo() {
      const self = this;
      self.curCity = [];
      self.$refs.citySelect.selectedArray = [];
      self.$refs.citySelect.input = '';
    },

    async selectAllProAndCity(val) {
      const self = this;
      const storeList = self.storeList;
      const temp = [];
      const tempStore = [];
      storeList.forEach(item => {
        if (item.country === val || val === '-1') {
          if (temp.map(x => x.value).indexOf(item.province) === -1) {
            const obj = {
              label: item.province,
              value: item.province
            };
            temp.push(obj);
          }
          const obj = {
            storeId: item.storeId,
            label: item.name,
            value: item.name
          };
          tempStore.push(obj);
        }
      });
      self.provinceList = temp;
      const cityTemp = [];
      self.provinceList.forEach(_item => {
        storeList.forEach(item => {
          if (item.province === _item.value) {
            if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
              const obj = {
                label: item.city,
                value: item.city
              };
              cityTemp.push(obj);
            }
          }
        });
      });
      self.cityList = cityTemp;
      const provinceArr = [];
      self.provinceList.forEach(item => {
        provinceArr.push(item.value);
      });
      self.curProvince = provinceArr;

      const cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      self.curCity = cityArr;
      self.storeDataList = tempStore;
      const storeArr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
      });
      self.curStore = storeArr;
      self.isInspectItem ? await self.getAllStoreList() : '';
      self.changeStoreNew(self.curStore);
      await self.searchData();
    },

    async searchData() {
      this.getSelectedStoreIds();
      this.isPatrol ? this.getSelectCountryOrCity() : '';
      this.isInspectItem ? this.getInspectId() : '';
      this.$emit('emitSearch', this.params, this.daysRangeList, this.curRegionI, this.curRegionII,
        this.regionMode, this.storePatrolLists, this.storeStr, this.tagNameStr);
    },

    getSelectedStoreIds() {
      const storeIds = this.filterStoreIds.filter(item => item !== '-1');
      this.params.storeIds = storeIds;
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
          this.params.inspectId = this.inspectList;
        }
      }
    },

    getSelectCountryOrCity() {
      const self = this;
      console.log(self.curCity.length);
      self.regionMode = self.curCity.length > 0 ? 2 : 1;
      if (self.curProvince.length !== 0) {
        self.curRegionI = self.curProvince;
        self.curRegionII = self.curCity;
      } else {
        let rI = [], rII = [];
        self.storeList.forEach((item, index) => {
          self.params.storeIds.forEach(_item => {
            if (item.storeId === _item) {
              rI.some(x => x === item.province) ? null : rI.push(item.province);
              rII.some(x => x === item.city) ? null : rII.push(item.city);
            }
          });
          self.curRegionI = rI;
          self.curRegionII = rII;
        });
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

    async initData() {
      const self = this;
      self.getCountryStore();
      self.getTagListData();
    },

    handleExportPdf() {
      this.$emit('exportPdf', this.storeStr, this.tagNameStr);
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
      .search-btn{
        width: calc(130/1920*100vw);
        height: calc(36/1920*100vw);
        padding: 0 0;
        font-size: calc(14/1920*100vw);
        margin-left: calc(20/1920*100vw);
        // float: right;
      }
      .en-search-btn{
        width: calc(130/1920*100vw);
        min-width:115px;
        margin-left: calc(20/1920*100vw);
        height: calc(36/1920*100vw);
        padding: 0 0;
        font-size: calc(14/1920*100vw);
        margin-left: calc(20/1920*100vw);
      }
      .normal-span{
        font-size: calc(14/1920*100vw);
        margin-right: calc(20/1920*100vw);
        margin-left: calc(20/1920*100vw);
      }
      .inspect-span{
        margin-right: calc(20/1920*100vw);
        font-size: calc(14/1920*100vw);
        margin-left: 0;
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
</style>
