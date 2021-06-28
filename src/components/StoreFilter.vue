<template>
  <el-col :span="24" class="">
    <el-col :span="24" :class="setWidthFlag ? 'width-limit' : ''" class="header-details">
      <div>
        <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('remotePatrol.storeSelect') }}</span>
        <el-select
          v-model="curCountry"
          :placeholder="$t('remotePatrol.country')"
          size="mini"
          class="el-province"
          @change="onChangeCountry">
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
          @changeInput="onChangeProvince"/>
        <region-multi-select
          ref="citySelect"
          :selected="curCity"
          :placeholder="$t('remotePatrol.regionII')"
          :options="cityList"
          :disabled="curProvince.length === 0 || curCountry === '-1'"
          :all="$t('overview.allZoneII')"
          style="display: inline"
          @changeInput="onChangeCity"/>

        <multi-select
          ref="multiSelect"
          :selected="curStore"
          :placeholder="$t('remotePatrol.stores')"
          :options="storeDataList"
          style="display: inline"
          @changeInput="onChangeStore"/>

      </div>
      <div :class="setWidthFlag ? 'store-group-type' : ''">
        <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('remotePatrol.storeGroup') }}</span>
        <multi-select
          :selected="curStoreGroup"
          :prompt-msg="$t('remotePatrol.storeGroup')"
          :all-select="0"
          :alltype="0"
          :options="storeGroupList"
          @changeInput="onChangeStoreGroup"/>
        <span :class="isInspectItem ? 'inspect-span' : 'normal-span'">{{ $t('remotePatrol.storeType') }}</span>
        <multi-select
          :selected="curStoreType"
          :prompt-msg="$t('remotePatrol.storeType')"
          :all-select="0"
          :alltype="0"
          :options="storeTypeList"
          @changeInput="onChangeStoreType"/>
      </div>

    </el-col>

  </el-col>
</template>

<script>
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { mapGetters } from 'vuex';
import { getBriefStoreList, getStoreDefineGroup } from '@/api/store';
import util from '@/common/util.js';

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
      tagNameStr: '',
      filterStoreIds: [],
      inspectTypeList: [],
      inspectList: '',
      allStoreData: [],
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
      storeNameStr: ''
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.ifGetParamsFromCash = false;
        await this.getSearchParams();
        this.getCountryStore();
        this.getStoreGroupAndType();
      }
    },
    cachedParams() {
      this.getSearchParams();
    }
  },

  async created() {
    await this.getSearchParams();
    this.getCountryStore();
    this.getStoreGroupAndType();
  },

  methods: {
    async getCountryStore() {
      const self = this;
      const data = await self.getBriefStoreData();
      const temp = [];
      if (data.errCode === 0) {
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
        self.curCountry = (!self.ifGetParamsFromCash) ? countryList[0].value : self.curCountry;
        self.selectAllProAndCity(self.curCountry, true);
      }
    },

    async getStoreGroupAndType() {
      const storeGroupPromise = this.getStoreDefineList(0);
      const storeTypePromise = this.getStoreDefineList(1);
      Promise.all([storeGroupPromise, storeTypePromise]).then(results => {
        const groupList = results[0];
        const typeList = results[1];
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
        this.storeGroupList = groupList;
        this.storeTypeList = typeList;
        const allStoreGroup = groupList.map(item => item.defineId);
        const allStoreType = typeList.map(item => item.defineId);
        allStoreGroup.unshift('-1');
        allStoreType.unshift('-1');
        this.curStoreGroup = (!this.ifGetParamsFromCash) ? allStoreGroup : this.curStoreGroup;
        this.curStoreType = (!this.ifGetParamsFromCash) ? allStoreType : this.curStoreType;
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

    onChangeStoreGroup(val) {
      this.curStoreGroup = val;
      const groupIdArray = this.storeGroupList.filter(groupItem => val.find(groupId => groupId === groupItem.value));
      groupIdArray.forEach(groupItem => {
        this.storeGroupString += groupItem.label + '，';
      });
      this.storeGroupString = this.storeGroupString.substr(0, this.storeGroupString.length - 1);
      this.filterStore();
    },

    onChangeStoreType(val) {
      this.curStoreType = val;
      const typeIdArr = this.storeTypeList.filter(typeItem => val.find(typeId => typeId === typeItem.value));
      typeIdArr.forEach(typeItem => {
        this.storeTypeString += typeItem.label + '，';
      });
      this.storeTypeString = this.storeTypeString.substr(0, this.storeTypeString.length - 1);
      this.filterStore();
    },

    filterStore() {
      const groupIdArray = this.storeGroupList.filter(groupItem => this.curStoreGroup.find(groupId => groupId === groupItem.value));
      const typeIdArr = this.storeTypeList.filter(typeItem => this.curStoreType.find(typeId => typeId === typeItem.value));

      const filterStoreArray = this.getStoreIdsOfGroupAndType(groupIdArray, typeIdArr);
      let filterStoreId = [];
      if (filterStoreArray.length === 0) {
        filterStoreId = this.curStore;
      } else {
        filterStoreId = util.getIntersectionOfArrs(this.curStore, filterStoreArray);
      }
      console.log(filterStoreId);
      let filterStoreStr = '';
      filterStoreId.forEach(storeId => {
        this.storeList.forEach(store => {
          if (storeId === store.storeId) {
            filterStoreStr += `${store.name}，`;
          }
        });
      });
      this.filterStoreIds = filterStoreId;
      this.storeStr = filterStoreStr.substr(0, filterStoreStr.length - 1);

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

      this.$emit('storeChange', tempsearchParamsObj);
    },

    getStoreIdsOfGroupAndType(groupArr, typeArr) {
      console.log(groupArr);
      console.log(typeArr);
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
      self.curProvince = (!self.ifGetParamsFromCash) ? provinceArr : self.curProvince;

      const cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      self.curCity = (!self.ifGetParamsFromCash) ? cityArr : self.curCity;
      self.storeDataList = tempStore;
      const storeArr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
      });
      setTimeout(async() => {
        self.curStore = (!self.ifGetParamsFromCash) ? storeArr : self.curStore;
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
  @import "../assets/sass/stastical.scss";

  .header-details{
    text-align: left;
    position: relative;
    display: flex;
    .search-content{
      display: inline-block;
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
  .header-details{
    padding-right: calc(60/1920*100vw);
    padding-bottom: 15px;
    @media screen and (max-width: 1360px){
      padding-right: calc(20/1920*100vw);
    }
  }
  .width-limit{
    width: calc(100% - 200px);
    flex-wrap: wrap;
  }
  .store-group-type{
    padding-top: 20px;
  }
</style>
