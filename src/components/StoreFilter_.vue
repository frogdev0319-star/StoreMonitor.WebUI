<template>
  <div>
    <div class="content">
      <div class="search-label">{{ $t('remotePatrol.storeSelect') }}</div>
      <div class="header-details">
        <div style="width:116px;">
          <el-select
              v-model="curCountry"
              :placeholder="$t('remotePatrol.country')"
              size="medium"
              class="el-Country"
              @change="onChangeCountry">
              <el-option-group v-for="group in countryList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.countryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-option-group>
          </el-select>
          <el-input
            v-model="input"
            placeholder=""
            readonly
            class="input-class"/>
        </div>
        <div style="width:0px;height:25px;border:1px solid #556679; opacity:0.2;" />
        <region-multi-select
            ref="proviceSelect"
            :selected="curProvince"
            :placeholder="$t('remotePatrol.regionI')"
            :options="provinceList"
            :disabled="curCountry.length === 0 || curCountry === '-1'"
            :all="$t('overview.allZoneI')"
            class="region"
            @changeInput="onChangeProvince"/>
        <div style="width:0px;height:25px;border:1px solid #556679; opacity:0.2;" />
        <region-multi-select
            ref="citySelect"
            :selected="curCity"
            :placeholder="$t('remotePatrol.regionII')"
            :options="cityList"
            :disabled="curProvince.length === 0 || curCountry === '-1'"
            :all="$t('overview.allZoneII')"
            class="region"
            @changeInput="onChangeCity"/>
        <div style="width:0px;height:25px;border:1px solid #556679; opacity:0.2;" />
        <multi-select
            class="store-group-select region"
            :selected="curStoreGroup"
            :prompt-msg="$t('remotePatrol.storeGroup')"
            :all-select="0"
            :alltype="0"
            :options="storeGroupList"
            @changeInput="onChangeStoreGroup"/>
        <div style="width:0px;height:25px;border:1px solid #556679; opacity:0.2;" />
        <multi-select
            class="store-group-select region"
            :selected="curStoreType"
            :prompt-msg="$t('remotePatrol.storeType')"
            :all-select="0"
            :alltype="0"
            :options="storeTypeList"
            @changeInput="onChangeStoreType"/>
      </div>
      
    </div>
    <div class="flex-center padding-left" style="text-align: left; margin-top: 20px">
      <div class="paper" 
        @click="showFavorite = !showFavorite"
        :style="showFavorite?{color: '#2b2b2b'}:{color: '#acaeb1'}"
        style="width: 115px; height: 36px; font-size: 13px; line-height: 36px; user-select: none; cursor: pointer; margin-right: 20px; text-align: center">
          {{ $t('remotePatrol.favoriteStore') }}
      </div>
      <el-select
      class="input"
          v-model="selectedStore"
          :placeholder="$t('remotePatrol.stores')"
          size="mini">
          <el-option
            v-for="item in storeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
      </el-select>
      <slot name="others"></slot>
    </div>
  </div>
</template>

<script>
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getBriefStoreList, getStoreDefineGroup, getStoreList } from '@/api/store';
import util from '@/common/util.js';
import { getCookie } from '@/common/auth';

export default {
  name: 'StoreFilter',
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
      curStore: [],
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
      storeOptions: []
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  mounted() {
    if (localStorage.getItem('activeStore')) {
      this.selectedStore = localStorage.getItem('activeStore');
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
    curStore() {
      let selected = this.curStore;
      this.storeOptions = this.allInitStoreList.filter(store => selected.includes(store.storeId)).map(store =>({
        value: store.storeId,
        label: store.name
      }))      
    },
    selectedStore () {
      var temp = this.allInitStoreList.filter(store=> store.storeId === this.selectedStore)
      this.$emit('emitSelectedStore', temp);
    },
    showFavorite () {
      this.storeOptions = this.allInitStoreList.filter(store => store.favorite).map(store =>({
        value: store.storeId,
        label: store.name
      }))      
    }
  },

  created() {
    this.getSearchParams();
    this.getStoreListAndGroupAndType();
  },

  methods: {
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
      const storeListPromise = this.getComplexStoreData();
      const storeGroupPromise = this.getStoreDefineList(1);
      const storeTypePromise = this.getStoreDefineList(0);
      Promise.all([storeListPromise, storeGroupPromise, storeTypePromise]).then(results => {
        var storeList = results[0];
        storeList = storeList.content
        this.allInitStoreList = results[0].content;
        storeList = storeList
        .map(store => ({
          city: store.city,
          country: store.country,
          name: store.name,
          province: store.province,
          storeId: store.storeId,
          tagIds: store.tagIds,
          userId: store.userId,
        }))
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
        var temp = this.allInitStoreList.filter(store=> store.storeId === this.selectedStore)
        this.$emit('emitSelectedStore', temp);
      }).catch(err => {
        console.log('StoreFilter - getStoreGroupAndType: ' + err);
      });
    },

    onChangeStore(arr) {
      this.curStore = arr;
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

    onChangeProvince(arr) {
      this.curProvince = arr;
      this.changePro(arr);
    },

    onChangeCity(arr) {
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
      let storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });

      self.curStore = storeArr;
      self.changeStoreNew(self.curStore);
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
      if (this.curStoreGroup.length === 0 && this.curStoreType.length === 0) {
        filterStoreId = this.curStore;
      } else {
        this.formatGroupAndType();
        const groupIdArray = this.storeGroupList.filter(groupItem => this.curStoreGroup.find(groupId => groupId === groupItem.value));
        const typeIdArr = this.storeTypeList.filter(typeItem => this.curStoreType.find(typeId => typeId === typeItem.value));
        const filterStoreArray = this.getStoreIdsOfGroupAndType(groupIdArray, typeIdArr);
        filterStoreId = util.getIntersectionOfArrs(this.curStore, filterStoreArray);
      }

      let filterStoreStr = '';
      filterStoreId.forEach(storeId => {
        this.storeList.forEach(store => {
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
      // this.$emit('emitStoreList', this.storeDataList);
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
      tempsearchParamsObj.curCountry = this.curCountry;
      tempsearchParamsObj.curProvince = this.curProvince;
      tempsearchParamsObj.curCity = this.curCity;
      tempsearchParamsObj.curStore = this.curStore;
      tempsearchParamsObj.curStoreGroup = this.curStoreGroup;
      tempsearchParamsObj.curStoreType = this.curStoreType;
      tempsearchParamsObj.storeStr = this.storeStr;
      tempsearchParamsObj.storeGroupString = this.storeGroupString;
      tempsearchParamsObj.storeTypeString = this.storeTypeString;
      tempsearchParamsObj.filterStoreIds = this.filterStoreIds;
      this.isPatrol && this.getSelectCountryOrCity();
      tempsearchParamsObj.curRegionI = this.curRegionI;
      tempsearchParamsObj.curRegionII = this.curRegionII;
      tempsearchParamsObj.regionMode = this.regionMode;
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
      // self.$refs.multiSelect.selectedArray = [];
      // self.$refs.multiSelect.input = '';
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
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
      });
      setTimeout(async() => {
        self.curStore = (self.ifGetParamsFromCash && self.curStore.indexOf('-1') === -1) ? self.curStore : storeArr;
        self.ifGetParamsFromCash = false;
        self.changeStoreNew(self.curStore);
      }, 100);
    },

    getSearchParams() {
      const searchParams = this.cachedParams;
      
      if (Object.keys(searchParams).length > 0) {
        if (searchParams.curCountry) {
          this.curCountry = searchParams.curCountry;
          this.curProvince = searchParams.curProvince;
          this.curCity = searchParams.curCity;
          this.curStore = searchParams.curStore;
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
  .content{
    display: flex;
    flex-direction: row;
    width: 100%;
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
    padding-left: calc(71/1440*100vw);
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
  .input {
    >>> .el-input__inner {
      height: 36px;
      line-height: 36px;
      border: none;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    }
  }
  
  .el-select-dropdown__item{
    padding: 0 20px 0 20px !important;
    /*color: #7d8cad;*/
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    font-family: "iconfont" !important;
    content: '\e6a2';
    left: 20px;
    font-size: 15px;
    font-style: normal;
    color: #2c90d9;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item::after{
    font-family: "iconfont" !important;
    position: absolute;
    left: 20px;
    content: "\e64a";
    color: #2c90d9;
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
    font-size: 15px;
    font-style: normal;
    -moz-osx-font-smoothing: grayscale;
  }
  .input-class{
    width: calc(100% - 30px);
    position: absolute;
    left: 0;
  }
  >>> .el-select .el-input--medium .el-input__suffix{
    top:0px !important;
    
  }
  >>> .el-select__tags{
    opacity: 0;
  }
  >>> .input-class.el-input--medium .el-input__inner{
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: none;
    border-right: none;
    color: #2b2b2b;
    background: transparent !important;
    padding: 0 10px;
    font-size: 15px;
    min-width: 55px;
    min-height: 28px;
  }
  >>> .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 15px;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    min-height: 28px;
    min-width: 85px;
  }

  >>> .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
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
    min-height: 28px;
    min-width: 85px;
  }
  >>> .el-select__tags{
    opacity: 0;
  }
</style>