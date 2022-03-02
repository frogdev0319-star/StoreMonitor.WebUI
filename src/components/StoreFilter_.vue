<template>
  <div>
    <div class="content">
      <div class="search-label">{{ $t('remotePatrol.storeSelect') }}</div>
      <div class="filter-group flex-center paper shadow-light" style="flex: 1; padding: 5.5px 0">
        <el-select
            style="flex: 1"
            v-model="curCountry"
            :placeholder="$t('remotePatrol.country')"
            size="medium"
            @change="onChangeCountry">
            <el-option-group v-for="group in countryList" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.countryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-option-group>
        </el-select>
        <hr class="hr-vertical">
        <region-multi-select
            style="flex: 1"
            ref="proviceSelect"
            :selected="curProvince"
            :placeholder="$t('remotePatrol.regionI')"
            :options="provinceList"
            :disabled="curCountry.length === 0 || curCountry === '-1'"
            :all="$t('overview.allZoneI')"
            @changeInput="onChangeProvince"/>
        <hr class="hr-vertical">
        <region-multi-select
            style="flex: 1"
            ref="citySelect"
            :selected="curCity"
            :placeholder="$t('remotePatrol.regionII')"
            :options="cityList"
            :disabled="curProvince.length === 0 || curCountry === '-1'"
            :all="$t('overview.allZoneII')"
            @changeInput="onChangeCity"/>
        <hr class="hr-vertical">
        <multi-select
            class="store-group-select region"
            style="flex: 1"
            :selected="curStoreGroup"
            :prompt-msg="$t('remotePatrol.storeGroup')"
            :all-select="0"
            :alltype="0"
            :options="storeGroupList"
            @changeInput="onChangeStoreGroup"/>
        <hr class="hr-vertical">
        <multi-select
            class="store-group-select region"
            style="flex: 1"
            :selected="curStoreType"
            :prompt-msg="$t('remotePatrol.storeType')"
            :all-select="0"
            :alltype="0"
            :options="storeTypeList"
            @changeInput="onChangeStoreType"/>
      </div>

    </div>
    <div v-if="type === 'patrol' || type === 'report'" class="flex-center padding-left" style="text-align: left; margin-top: 20px; justify-content: space-between">
      <template v-if="type === 'patrol'" >
        <div class="paper shadow-light"
          @click="showFavorite = !showFavorite"
          :style="showFavorite?{color: '#2b2b2b'}:{color: '#acaeb1'}"
          style="width: 115px; height: 36px; font-size: 13px; line-height: 36px; user-select: none; cursor: pointer; margin-right: 20px; text-align: center">
            {{ $t('remotePatrol.favoriteStore') }}
        </div>
        <div class="single-select shadow-light">
          <el-select
            v-model="curStore"
            :placeholder="$t('remotePatrol.selectStores')"
            size="mini">
            <el-option
              v-for="item in curStoresData"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
        <div class="spacer"></div>
      </template>
      <template v-if="type === 'report'" >
        <multi-selector
          v-model="curStores"
          :options="curStoresData"
          @change="changeCurStores"
          :placeholder="$t('remotePatrol.selectStores')"
        />
      </template>
      <slot name="others"></slot>
    </div>
    <div v-if="type === 'bindroute'" class="flex-center padding-left" style="text-align: left; margin-top: 20px">
      <el-input
        :placeholder= "$t('insSettingView.searchPlaceholder')"
        v-model="searchStr"
        style="width: 200px"
        size="mini"
        clearable
        class="storevue-input paper"
        @keyup.enter.native="searchStoreInput"
        @clear="searchStoreInput">
        <i
          slot="prefix"
          class="iconfont icon-sousuo"
          style="position:relative;top:6px;left:6px;font-size:18px;"
          @click="searchStoreInput"/>
      </el-input>
    </div>
  </div>
</template>

<script>
import MultiSelect from '@/components/MultiSelect';
import MultiSelector from '@/components/MultiSelect_';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getBriefStoreList, getStoreDefineGroup, getStoreList } from '@/api/store';
import util from '@/common/util.js';

export default {
  name: 'StoreFilter',
  components: {
    MultiSelect,
    MultiSelector,
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
    setWidthFlag: {
      type: Boolean,
      default: false
    },
    cachedParams: {
      type: Object,
      default: () => { return {}; }
    },
    type: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      curCountry: '',
      countryList: [],
      curProvince: [],
      provinceList: [],
      curCity: [],
      cityList: [],
      curStore: '',
      curStoreData: {},
      curStores: [],
      curStoresData: [],
      storeList: [],
      storeDataList: [],
      lang: this.$i18n.locale,
      storeStr: '',
      filterStoreIds: [],
      inspectTypeList: [],
      inspectList: '',
      allInitStoreList: [],
      storePatrolLists: [],
      ifGetParamsFromCash: false,
      storeListLength: -1,
      order: { direction: '', property: '' },
      filter: { page: 0, size: 10 },
      inspectCatch: '',
      curStoreGroup: [],
      curStoreType: [],
      storeGroupList: [],
      storeTypeList: [],
      curRegionI: [],
      curRegionII: [],
      regionMode: 1,
      storeGroupString: '',
      storeTypeString: '',
      countries: [],
      provinces: [],
      cities: [],
      showFavorite: false,
      selectedStore: '',
      storeOptions: [],
      searchStr: '',
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  mounted() {
    const self = this;
    const storeCache = self.$store.getters.storeCache;
    if (storeCache !== null) {
      this.curCountry = storeCache.curCountry;
      this.curProvince = storeCache.curProvince;
      this.curCity = storeCache.curCity;
      this.curStore = storeCache.curStore;
      this.curStoreData = storeCache.curStoreData;
      this.curStores = storeCache.curStores;
      this.curStoresData = storeCache.curStoresData;
      this.curStoreGroup = storeCache.curStoreGroup;
      this.curStoreType = storeCache.curStoreType;
      this.storeStr = storeCache.storeStr;
      this.storeGroupString = storeCache.storeGroupString;
      this.storeTypeString = storeCache.storeTypeString;
      this.filterStoreIds = storeCache.filterStoreIds;
      this.curRegionI = storeCache.curRegionI;
      this.curRegionII = storeCache.curRegionII;
      this.regionMode = storeCache.regionMode;
      this.countryList = storeCache.countryList;
      this.cityList = storeCache.cityList;
      this.provinceList = storeCache.provinceList;
    } else {
      this.getStoreListAndGroupAndType();
    }
  },

  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.ifGetParamsFromCash = false;
        this.getStoreListAndGroupAndType();
        await this.getSearchParams();
      }
    },
    cachedParams() {
      this.getSearchParams();
    },
    curStore () {
      this.emitParams()
    },
  },

  created() {
    this.getSearchParams();
  },

  methods: {
    changeCurStores (val) {
      this.curStores = [...val]
      this.filterStore()
    },
    getCountryStore() {
      let temp = [];
      if (this.storeList.length !== 0) {
        this.storeList.forEach(item => {
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
      this.countryList[0] = {};
      this.countryList[0].label = this.$t('remotePatrol.country');
      this.countryList[0].countryList = countryList;
      this.countryList[0].countryList.unshift({ value: '-1', label: this.$t('remotePatrol.all') });
      this.curCountry = (!this.ifGetParamsFromCash) ? countryList[0].value : this.curCountry;
      this.selectAllProAndCity(this.curCountry, true);
    },

    getStoreListAndGroupAndType() {
      const storeListPromise = this.getBriefStoreData();
      const storeGroupPromise = this.getStoreDefineList(1);
      const storeTypePromise = this.getStoreDefineList(0);
      Promise.all([storeListPromise, storeGroupPromise, storeTypePromise]).then(results => {
        var storeList = results[0];
        this.allInitStoreList = results[0].content;
        // console.log(storeList)
        const groupList = results[1];
        const typeList = results[2];
        groupList.map(item => {
          item.label = item.defineName;
          item.value = item.defineId;
          item.storeIds = item.contents;
        });
        typeList.map(item => {
          item.label = item.defineName;
          item.value = item.defineId;
          item.storeIds = item.contents;
        });
        this.storeList = storeList;
        this.getCountryStore();
        this.storeGroupList = groupList;
        this.storeTypeList = typeList;
      }).catch(err => {
        console.log('StoreFilter - getStoreGroupAndType: ' + err);
      });
    },

    onChangeStore(arr) {
      this.curStores = arr;
      this.changeStoreNew(arr);
    },

    getStoreDefineList(type) {
      return new Promise((resolve, reject) => {
        const params = {
          type: type
        };
        getStoreDefineGroup(params).then(res => {
          resolve(res.data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    changeStoreNew() {
      this.filterStore();
    },

    searchStoreInput () {
      this.filterStore();
    },
    onChangeProvince(arr) {
      console.log(arr)
      this.curProvince = arr;
      this.changePro(arr);
    },

    onChangeCity(arr) {
      console.log(arr)
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
      self.storeListLength = this.storeDataList.length;
      let storeArr = [], arr = [], arr_ = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
        arr_.push({ value: item.storeId, label: item.label })
      });
      self.curStoresData = [...arr_];
      self.curStores = storeArr;
      self.changeStoreNew(self.curStores);
    },

    getComplexStoreData() {
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res.data);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res.data);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    onChangeStoreGroup(val) {
      this.curStoreGroup = val;
      this.filterStore();
    },

    onChangeStoreType(val) {
      this.curStoreType = val;
      this.filterStore();
    },

    filterArr(arr1, arr2) {
      let filterArr = [];
      if (arr1.includes('-1')) {
        filterArr = arr2.map(item => item.value);
      } else {
        const tempArr = arr2.filter(item => arr1.indexOf(item.value) !== -1);
        if (tempArr.length > 0) {
          filterArr = tempArr.map(item => item.value);
        }
      }
      filterArr.length === arr2.length && arr2.length !== 0 && filterArr.unshift('-1');
      return filterArr;
    },

    formatGroupAndType() {
      this.curStoreGroup = this.filterArr(this.curStoreGroup, this.storeGroupList);
      this.curStoreType = this.filterArr(this.curStoreType, this.storeTypeList);
    },

    filterStore() {
      let filterStoreId = [];
      let self = this;
      if (this.curStoreGroup.length === 0 && this.curStoreType.length === 0) {
        filterStoreId = this.curStores;
      } else {
        this.formatGroupAndType();
        const groupIdArray = this.storeGroupList.filter(groupItem => this.curStoreGroup.find(groupId => groupId === groupItem.value));
        const typeIdArr = this.storeTypeList.filter(typeItem => this.curStoreType.find(typeId => typeId === typeItem.value));
        const filterStoreArray = this.getStoreIdsOfGroupAndType(groupIdArray, typeIdArr);
        filterStoreId = util.getIntersectionOfArrs(this.curStores, filterStoreArray);
      }

      let filterStoreStr = '';
      filterStoreId.forEach(storeId => {
        self.storeList.forEach(store => {
          if (storeId === store.storeId) {
            filterStoreStr += `${store.name}，`;
          }
        });
      });
      this.filterStoreIds = filterStoreId.filter(storeId => storeId !== '-1');
      this.storeStr = filterStoreStr.substr(0, filterStoreStr.length - 1);
      this.getStoreGroupString();
      this.getStoreTypeString();
      this.emitParams();
    },

    getStoreGroupString() {
      this.storeGroupString = '';
      const groupIdArray = this.storeGroupList.filter(groupItem => this.curStoreGroup.find(groupId => groupId === groupItem.value));
      groupIdArray.forEach(groupItem => {
        this.storeGroupString += groupItem.label + '，';
      });
      this.storeGroupString = this.storeGroupString.substr(0, this.storeGroupString.length - 1);
    },

    getStoreTypeString() {
      this.storeTypeString = '';
      const typeIdArr = this.storeTypeList.filter(typeItem => this.curStoreType.find(typeId => typeId === typeItem.value));
      typeIdArr.forEach(typeItem => {
        this.storeTypeString += typeItem.label + '，';
      });
      this.storeTypeString = this.storeTypeString.substr(0, this.storeTypeString.length - 1);
    },

    emitParams() {
      const tempsearchParamsObj = {};
      const self = this
      tempsearchParamsObj.curCountry = this.curCountry;
      tempsearchParamsObj.curProvince = this.curProvince;
      tempsearchParamsObj.curCity = this.curCity;
      tempsearchParamsObj.curStore = this.curStore;
      tempsearchParamsObj.curStoreData = this.curStoreData;
      tempsearchParamsObj.curStores = [...this.curStores];
      tempsearchParamsObj.curStoresData = this.curStoresData;
      tempsearchParamsObj.curStoreGroup = this.curStoreGroup;
      tempsearchParamsObj.curStoreType = this.curStoreType;
      tempsearchParamsObj.storeStr = this.storeStr;
      tempsearchParamsObj.storeGroupString = this.storeGroupString;
      tempsearchParamsObj.storeTypeString = this.storeTypeString;
      tempsearchParamsObj.filterStoreIds = [...this.filterStoreIds];
      this.isPatrol && this.getSelectCountryOrCity();
      tempsearchParamsObj.curRegionI = this.curRegionI;
      tempsearchParamsObj.curRegionII = this.curRegionII;
      tempsearchParamsObj.regionMode = this.regionMode;
      tempsearchParamsObj.provinceList = this.provinceList;
      tempsearchParamsObj.countryList = this.countryList;
      tempsearchParamsObj.cityList = this.cityList;
      
      this.$store.dispatch("setStoreCache", tempsearchParamsObj);
      this.$emit('storeChange', tempsearchParamsObj);
    },

    getStoreIdsOfGroupAndType(groupArr, typeArr) {
      let groupIdArr = [];
      let typeIdArr = [];
      if (groupArr.length === 0 && typeArr.length === 0) return [];
      if (groupArr.length > 0 && typeArr.length === 0) {
        groupIdArr = groupArr.map(group => group.contents);
        return groupIdArr.flat();
      }
      if (groupArr.length === 0 && typeArr.length > 0) {
        typeIdArr = typeArr.map(type => type.contents);
        return typeIdArr.flat();
      }
      groupIdArr = groupArr.map(group => group.contents);
      typeIdArr = typeArr.map(type => type.contents);
      return util.getIntersectionOfArrs(groupIdArr.flat(), typeIdArr.flat());
    },

    getSelectCountryOrCity() {
      const self = this;
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

    onChangeCountry(val) {
      const self = this;
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      self.selectAllProAndCity(val, false);
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
      self.storeListLength = this.storeDataList.length;
      let storeArr = [], arr = [], arr_ = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
        arr_.push({
          value: item.storeId,
          label: item.label
        })
      });
      self.curStoresData = arr_;
      self.curStores = storeArr;
      self.changeStoreNew(self.curStores);
    },

    clearStoreInfo() {
      const self = this;
      self.curStores = [];
      self.curStoresData = [];
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

    async selectAllProAndCity(val, isFirst) {
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
          let storeObj = {};
          if (self.ifGetParamsFromCash && self.curProvince.length > 0 && self.curProvince !== '-1') {
            if (self.curCity.length > 0 && self.curCity !== '-1') {
              if (self.curProvince.includes(item.province) && self.curCity.includes(item.city)) {
                storeObj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name,
                  userId: item.userId,
                  userName: item.userName
                };
              }
            }
          } else {
            storeObj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              userName: item.userName
            };
          }
          Object.keys(storeObj).length > 0 && tempStore.push(storeObj);
        }
      });
      self.provinceList = temp;
      const cityTemp = [];
      self.provinceList.forEach(_item => {
        storeList.forEach(item => {
          if (item.province === _item.value) {
            let citObj = {};
            if (self.ifGetParamsFromCash && self.curProvince.length > 0 && self.curProvince !== '-1') {
              if (self.curCity.length > 0 && self.curCity !== '-1') {
                if (self.curProvince.includes(item.province)) {
                  if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
                    citObj = {
                      label: item.city,
                      value: item.city
                    };
                  }
                }
              }
            } else {
              if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
                citObj = {
                  label: item.city,
                  value: item.city
                };
              }
            }
            Object.keys(citObj).length > 0 && cityTemp.push(citObj);
          }
        });
      });
      self.cityList = cityTemp;
      const provinceArr = [];
      self.provinceList.forEach(item => {
        provinceArr.push(item.value);
      });
      self.curProvince = (self.ifGetParamsFromCash && self.curProvince.indexOf('-1') === -1) ? self.curProvince : provinceArr;

      const cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      self.curCity = (self.ifGetParamsFromCash && self.curCity.indexOf('-1') === -1) ? self.curCity : cityArr;
      self.storeDataList = tempStore;
      const storeArr = [];
      let dataArr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        dataArr.push({
          value: item.storeId,
          label: item.label
        })
      });
      setTimeout(async() => {
        self.curStores = (self.ifGetParamsFromCash && self.curStores.indexOf('-1') === -1) ? self.curStores : storeArr;
        self.curStoresData = (self.ifGetParamsFromCash && self.curStoresData.indexOf('-1') === -1) ? self.curStoresData : dataArr;
        self.ifGetParamsFromCash = false;
        self.changeStoreNew(self.curStores);
      }, 100);
    },

    getSearchParams() {
      const searchParams = this.cachedParams;

      if (Object.keys(searchParams).length > 0) {
        if (searchParams.curCountry) {
          this.curCountry = searchParams.curCountry;
          this.curProvince = searchParams.curProvince;
          this.curCity = searchParams.curCity;
          this.curStores = searchParams.curStores;
          this.curStoresData = searchParams.curStoresData;
          this.curStoreGroup = searchParams.curStoreGroup;
          this.curStoreType = searchParams.curStoreType;
          this.ifGetParamsFromCash = true;
        } else {
          this.ifGetParamsFromCash = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .filter-group {
    height: calc(36/1920*100vw);
    
    /deep/ .el-input__inner {
      border: none;
      font-size: 15px;
      height: calc(36/1920*100vw);
      line-height: calc(36/1920*100vw);
    }
  }
  .filter-select {
    /deep/ .el-input__inner {
      border: none;
      height: 36px;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }
    .is-focus {
      .el-input__inner {
        border: none;
      }
    }
  }
  .content {
    display: flex;
    align-items: center;
    .search-label{
      width: calc(76/1440*100vw);
      text-align: left;
      align-self: center;
      font-family: NotoSansCJKTC;
      font-size: 15px;
      font-weight: normal;
    }
  }
  .padding-left {
    padding-left: calc(75/1440*100vw);
  }
  .header-details{
    text-align: left;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(36/1920*100vw);
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    align-items: center;
    padding: 0 !important;
    .el-Country{
      width: calc(116/1920*100vw);
      margin-right: calc(15/1920*100vw);
      min-width: 85px;
      min-height: 36px;

    }
    .region{
      display:inline;
      width: calc(217/1440*100vw);
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
  .header-details{
    padding-bottom: 15px;
    @media screen and (max-width: 1360px){
      padding-right: calc(20/1920*100vw);
    }
  }
  .store-group-type{
    position: relative;
  }
  .store-div{
    width: calc(222/1440*100vw);
    height: 36px;
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    align-items: center;
    margin-top:16px;
    margin-left:calc(76/1440*100vw);
    padding: 0 !important;
  }
  .store{
    // display:inline;
    width: calc(222/1440*100vw);
  }
</style>
<style lang="scss" scoped>
  .single-select {
    position: relative;
    background: #fff;
    border-radius: 3px;
    /deep/ .el-input__inner {
      border: none;
      font-size: 15px;
      height: calc(36/1920*100vw);
      line-height: calc(36/1920*100vw);
    }
  }
</style>