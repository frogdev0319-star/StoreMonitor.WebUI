<template>
  <div class="el-bind-device">
    <div class="el-bind-header">
      <div class="seacrh-content">
        <span>{{ $t('remotePatrol.storeSelect') }}</span>
        <el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" :disabled="loading"
                   size="mini" class="el-province" @change="changeCountry">
          <el-option-group v-for="group in CountryList" :key="group.label" :label="group.label">
            <el-option v-for="item in group.countryList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-option-group>
        </el-select>
        <region-multi-select
          ref="proviceSelect"
          :selected="curProvince"
          :placeholder="$t('remotePatrol.regionI')"
          :options="provinceList"
          :disabled="curCountry.length === 0 || curCountry === '-1' || loading"
          :all="$t('overview.allZoneI')"
          style="display: inline;margin-left: calc(20/1920*100vw);"
          @changeInput="handleProChange"/>
        <region-multi-select
          ref="citySelect"
          :selected="curCity"
          :placeholder="$t('remotePatrol.regionII')"
          :options="cityList"
          :disabled="curProvince.length === 0 || curCountry === '-1' || loading"
          :all="$t('overview.allZoneII')"
          style="display: inline"
          @changeInput="handleCityChange"/>

        <multi-select
          ref="multiSelect"
          :selected="curStore"
          :placeholder="$t('remotePatrol.stores')"
          :options="storeDataList"
          :disabled="loading"
          style="display: inline"
          @changeInput="handleStoreChange"/>
        <span class="select-title">{{ $t('remotePatrol.selectStoreTag') }}</span>
        <multi-select
          ref="TagMultiSelect"
          :selected="curStoreTag"
          :placeholder="$t('remotePatrol.selectStoreTag')"
          :all-select="0"
          :alltype="0"
          :options="StoreTagList"
          style="display: inline;margin-left: calc(20/1920*100vw);"
          @changeInput="changeStoreTag"/>
        <el-input
          :placeholder= "$t('insSettingView.searchPlaceholder')"
          v-model="serachVale"
          size="small"
          class="el-search-input"
          clearable
          @keyup.enter.native="searchStoreInput">
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            style="position:relative;top:6px;left:6px;font-size:18px;"
            @click="searchStoreInput"/>
        </el-input>
      </div>
    </div>
    <div v-loading="loading" :element-loading-text="$t('insSettingView.bindingstore')"
         class="el-bind-content-box" element-loading-background="rgba(255, 255, 255, 0.6)">
      <p v-if="lang==='en'" class="el-header-title">{{ $t('insSettingView.bindStores') }}</p>
      <p v-else class="el-header-title" >
        {{ $t('insSettingView.selectStore') }}{{ tabName }}{{ $t('insSettingView.needBind') }}
      </p>
      <p v-if="lang=='en'" class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"/>
        {{ totalCount }} {{ $t('insSettingView.total') }}
        {{ storeCount }} {{ $t('insSettingView.bind') }}
      </p>
      <p v-else class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"/>
        {{ tabName }}{{ $t('insSettingView.total') }}{{ totalCount }}
        {{ $t('insSettingView.bindStore') }},{{ $t('insSettingView.bindWith') }}{{ storeCount }}
        {{ $t('insSettingView.bindStore') }}
      </p>
      <div :style="{'height' : varyWindowHeight*0.56+'px'}" class="el-bind-content">
        <div v-if="storeList.length === 0" :style="{'line-height': varyWindowHeight*0.56+'px'}">
          <div v-if="Havestore === 0|| resultHavestore && Havestore !== 0" class="bind-empty">
            <img :src="loadingGif">
            <span class="empty-text">{{ $t('insSettingView.loadingbindstore') }}</span>
          </div>
        </div>
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <div v-if="storeList.length !== 0" class="el-all-checkbox">
            <el-checkbox v-model="allData" @change="choiceAll"/>
            <span class="all-device-title">{{ $t('insSettingView.relateAllStores') }}</span>
          </div>
          <div v-for="(item,index) in storeList" :key="index" class="device-group">
            <div class="device-all-checkbox">
              <el-checkbox v-model="item.checked" @change="choiceAllGroup(item)"/>
              <span class="group-name">{{ item.cityName }}</span>
            </div>
            <div class="device-content">
              <div v-for="(_item,_index) in item.itemData" :key="_index" class="device-detail">
                <el-checkbox v-model="_item.checked" @change="choiceAllDevice(index,item,_index,_item)"/>
                <span class="device-name">{{ _item.name }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="el-bind-footer">
        <div class="el-btn-content">
          <el-button :disabled="storeList.length === 0" :class="lang === 'en' ? 'en-btn' : 'btn'" size="mini"
                     type="primary" @click="applyNape">
            <div class="btn-area">
              <i class="iconfont icon-quxiaolianjie"/>
              <span>{{ $t('insSettingView.confirmBound') }}</span>
            </div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStoreList, getBriefStoreList, GetTagList } from '@/api/store';
import { applyItemInspectItem, UnapplyInspectItem, getInspectBindList } from '@/api/inspect';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';

export default {
  name: 'BindRuteInspect',

  components: {
    MultiSelect,
    RegionMultiSelect
  },

  data() {
    return {
      loading: false,
      allData: false,
      tabName: '',
      tabNameLang: '',
      storeCount: 0,
      totalCount: 0,
      storeList: [],
      tempStoreList: [],
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      curCountry: '',
      curProvince: [],
      provinceList: [],
      cityList: [],
      storeDataList: [],
      CountryList: [],
      StoreTagList: [],
      curCity: [],
      curStore: [],
      curStoreTag: [],
      storeStr: '',
      multeCityList: [],
      citys: '',
      isChecked: false,
      allCityChecked: false,
      showCityContent: false,
      showDrap: true,
      Havestore: 0,
      resultHavestore: false,
      storeData: [],
      napeIdList: [],
      serachVale: '',
      curCitys: this.$t('storeView.cityPlaceholder'),
      showPopoVer: true,
      lang: this.$i18n.locale,
      loadingGif: require('../../../../static/img/loading.gif')
    };
  },

  mounted() {
    const self = this;
    self.getCountryStore();
    self.getTagListData();
  },

  methods: {
    getBriefStoreData() {
      const self = this;
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            const data = res.data;
            resolve(res);
          }
        }).catch(res => {
          resolve(res);
        });
      });
    },

    getTagListData() {
      const self = this;
      return new Promise((resolve, reject) => {
        GetTagList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            res.data.forEach(item => {
              const obj = {};
              obj.value = item.tagId;
              obj.label = item.tagName;
              obj.disabled = false;
              self.StoreTagList.push(obj);
            });
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getCountryStore() {
      const self = this;
      const data = await self.getBriefStoreData();
      const temp = [];
      if (data.errCode === 0 && data.errMsg === 'Success') {
        self.tempStoreData = data.data;
        if (self.tempStoreData.length !== 0) {
          self.tempStoreData.forEach(item => {
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
        self.CountryList[0] = {};
        self.CountryList[0].label = self.$t('remotePatrol.country');
        self.CountryList[0].countryList = countryList;
        self.CountryList[0].countryList.unshift({ value: '-1', label: self.$t('remotePatrol.all') });
        self.curCountry = countryList[0].value;
        self.selectAllProAndCity(self.curCountry);
      }
    },

    selectAllProAndCity(val) {
      const self = this;
      const storeList = self.tempStoreData;
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
            value: item.name,
            userId: item.userId,
            tagIds: item.tagIds
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
      self.changeStore(self.curStore);
    },

    changeStoreTag(val) {
      const self = this;
      const temp = [];
      self.curStoreTag = val;
      self.changeStore(self.curStore);
    },

    changeCountry(val) {
      const self = this;
      const temp = [];
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      self.selectAllProAndCity(val);
    },

    changePro(val) {
      const self = this;
      self.curCity = [];
      self.clearCityInfo();
      self.clearStoreInfo();
      const storeList = self.tempStoreData;
      const temp = [];
      const tempStore = [];
      if (val === '') {
        storeList.forEach(item => {
          if (item.country === self.curCountry) {
            const obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId,
              tagIds: item.tagIds
            };
            tempStore.push(obj);
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
                value: item.name,
                userId: item.userId,
                tagIds: item.tagIds
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
      self.changeStore(self.curStore);
    },

    changeCity(val) {
      const self = this;
      self.clearStoreInfo();
      const storeList = self.tempStoreData;
      const temp = [];
      if (val.length !== 0) {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.city === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                const obj = {
                  storeId: item.storeId,
                  label: item.name,
                  value: item.name,
                  userId: item.userId,
                  tagIds: item.tagIds
                };
                temp.push(obj);
              }
            }
          });
        });
      }
      self.storeDataList = temp;
      let storeArr = [], arr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
        arr.push(item.value);
      });
      self.curStore = storeArr;
      self.changeStore(self.curStore);
    },

    handleStoreChange(arr) {
      const self = this;
      self.curStore = arr;
      self.changeStore(arr);
    },

    handleProChange(arr) {
      const self = this;
      self.curProvince = arr;
      self.changePro(arr);
    },

    handleCityChange(arr) {
      const self = this;
      self.curCity = arr;
      self.changeCity(arr);
    },

    clearStoreInfo() {
      const self = this;
      self.curStore = [];
      self.storeStr = '';
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

    changeStore(val) {
      const self = this;
      let str = '';
      self.tempStoreData.forEach((item) => {
        val.forEach(_item => {
          if (item.storeId === _item) {
            self.curStoreTag.length !== 0 ? self.curStoreTag.forEach(v_item => {
              item.tagIds.forEach(t_item => {
                if ((t_item === v_item && self.curCountry === item.country) || (t_item === v_item && self.curCountry === '-1')) {
                  str += item.name + '，';
                }
              });
            }) : (item.storeId === _item ? str += item.name + '，' : null);
          }
        });
      });
      str = str.substr(0, str.length - 1);
      self.storeStr = str;
      self.searchStore();
    },

    clearCitys() {
      const self = this;
      self.cityList = [];
      self.showCityContent = false;
      self.curCitys = self.$t('storeView.cityPlaceholder');
      self.multeCityList.length = 0;
    },

    choiceCity() {
      const self = this;
      if (self.curProvince.length === 0) {
        self.notify(self.$t('storeView.selectProviceInfo'), 'warning', 3000);
        self.showPopoVer = true;
        return false;
      } else {
        self.showPopoVer = false;
        self.showDrap = !self.showDrap;
      }
    },

    choiceAllCity(val) {
      const self = this;
      let str = '';
      const temp = [];
      if (!val) {
        self.curCitys = self.$t('storeView.cityPlaceholder');
        self.multeCityList = [];
        self.cityList.forEach(item => {
          item.checked = val;
          if (val) {
            str = str + item.cityName + ';';
            temp.push(item.cityName);
          }
        });
      } else {
        self.cityList.forEach(item => {
          item.checked = val;
          if (val) {
            str = str + item.cityName + ';';
            temp.push(item.cityName);
          }
        });
        self.isChecked = val;
        self.curCitys = '';
        self.curCitys = str.substring(0, str.length - 1);
        self.multeCityList = temp;
      }
    },

    changeCityItem(item) {
      const self = this;
      let str = '';
      const temp = [];
      self.cityList.forEach(_item => {
        if (_item.checked) {
          str = str + _item.cityName + ';';
          temp.push(_item.cityName);
        }
      });
      self.isChecked = temp.length !== 0;
      self.curCitys = '';
      self.curCitys = str.substring(0, str.length - 1);
      self.allCityChecked = temp.length === self.cityList.length;
      if (temp.length === 0) {
        self.curCitys = self.$t('storeView.cityPlaceholder');
      }
      self.multeCityList = temp;
    },

    async searchStoreInput() {
      const self = this;
      let params = {};
      if (self.serachVale.length !== 0) {
        params = {
          like: {
            'name': self.serachVale,
            'userName': self.serachVale
          },
          filter: {
            page: 0,
            size: 2000
          }
        };
      } else {
        params = {
          filter: {
            page: 0,
            size: 2000
          }
        };
      }
      const resData = await self.getStoreData(params);
      const data = resData.content;
      if (resData.content.length > 0) {
        self.resultHavestore = true;
        self.Havestore++;
      } else {
        self.resultHavestore = false;
        self.Havestore++;
      }
      self.getStoreByCity(data);

      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      self.allData = self.storeList.length === count;
    },

    async searchStore () {
      const self = this;
      self.showCityContent = false;
      self.serachVale = '';
      self.storeList = [];
      const params = {};
      const storeList = self.storeStr.split('，');
      if (storeList.length !== 0) {
        params.clause = {
          name: storeList
        };
      } else {
        params.clause = {};
      }
      params.filter = {
        page: 0,
        size: 2000
      };
      const resData = await self.getStoreData(params);
      self.storeData = resData.content;
      if (resData.content.length > 0) {
        self.resultHavestore = true;
        self.Havestore++;
      } else {
        self.resultHavestore = false;
        self.Havestore++;
      }
      self.getStoreByCity(self.storeData);

      self.totalCount = resData.totalElements;
      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      self.allData = count === self.storeList.length;
    },

    choiceAll(val) {
      const self = this;
      self.storeList.forEach(item => {
        item.checked = val;
        item.itemData.forEach(_item => {
          _item.checked = val;
        });
      });
    },

    choiceAllGroup(item) {
      const self = this;
      const obj = item;
      item.itemData.forEach(item => {
        item.checked = obj.checked;
      });
      const arr = [];
      self.storeList.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      self.allData = self.storeList.length === arr.length;
    },

    choiceAllDevice(index, item) {
      const self = this;
      let count = 0;
      item.itemData.forEach(itemS => {
        if (itemS.checked) {
          count++;
        }
      });
      item.checked = count === item.itemData.length;
      let length = 0, countItem = 0;
      self.storeList.forEach(_item => {
        length += _item.itemData.length;
        _item.itemData.forEach(itemS => {
          if (itemS.checked) {
            countItem++;
          }
        });
      });
      self.allData = length === countItem;
    },

    getStoreData(params) {
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err)
        });
      });
    },

    async getProvinceList() {
      const self = this;
      const params = {
        filter: {
          page: 0,
          size: 2000
        }
      };
      const resStore = await self.getStoreData(params);
      self.storeData = resStore.content;
      self.totalCount = resStore.totalElements;
      const temp = [];
      if (self.storeData != undefined && self.storeData.length !== 0) {
        self.storeData.forEach(item => {
          const province = item.province;
          if (temp.map(x => x.label).indexOf(province) === -1) {
            const obj = {
              value: province,
              label: province,
              citys: []
            };
            temp.push(obj);
          }
        });
      }
      temp.length > 0 ? temp.unshift({ value: '', label: self.$t('storeView.provincePlaceholder') }) : temp;
      self.provinceList = temp;
    },

    async getCityByProvince(province) {
      const self = this;
      const temp = [];

      self.storeData.forEach(item => {
        if (item.province === province) {
          const obj = {};
          obj.cityName = item.city;
          obj.checked = false;
          if (temp.map(x => x.cityName).indexOf(obj.cityName) === -1) {
            temp.push(obj);
          }
        }
      });
      self.cityList = temp;
    },

    async getStoreByCity(data) {
      const self = this;
      const bindStoreId = await self.getBindStoreList();
      const cityList = [];
      const bindArr = [];
      data.forEach(item => {
        if (cityList.indexOf(item.city) === -1) {
          cityList.push(item.city);
        }
        bindStoreId.data.forEach(_item => {
          if (item.storeId === _item) {
            bindArr.push(_item);
          }
        });
      });
      self.storeCount = bindArr.length;
      const temp = [];
      cityList.forEach(item => {
        const obj = {};
        obj.city = item;
        const _temp = [];
        data.forEach(_item => {
          if (item === _item.city) {
            const _obj = {};
            obj.province = _item.province;
            _obj.storeName = _item.name;
            _obj.storeId = _item.storeId;
            _temp.push(_obj);
          }
        });
        obj.store = _temp;
        temp.push(obj);
      });
      const groupTemp = [];
      temp.forEach(item => {
        const groupObj = {};
        groupObj.province = item.province;
        groupObj.cityName = item.city;
        const _temp = [];
        let _tempCount = 0;
        item.store.forEach(_item => {
          const _obj = {};
          if (bindStoreId.data.indexOf(_item.storeId) === -1) {
            _obj.checked = false;
          } else {
            _obj.checked = true;
            _tempCount++;
          }
          _obj.storeId = _item.storeId;
          _obj.name = _item.storeName;
          _temp.push(_obj);
        });
        if (_tempCount === item.store.length) {
          groupObj.checked = true;
        } else {
          groupObj.checked = false;
        }
        groupObj.itemData = _temp;
        groupTemp.push(groupObj);
      });
      self.storeList = groupTemp;
      self.tempStoreList = groupTemp;
      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      if (count === self.storeList.length) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    bindNapeToStore(params) {
      return new Promise((resolve, reject) => {
        applyItemInspectItem(params).then(res => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    UnbindNapeToStore(params) {
      return new Promise((resolve, reject) => {
        UnapplyInspectItem(params).then(res => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    async applyNape() {
      const self = this;
      self.loading = true;
      const storeIdChecked = [];
      const storeIdUnchecked = [];
      let count = 0;
      const napeId = JSON.parse(sessionStorage.getItem('NapeId'));
      self.storeList.forEach(item => {
        count += item.itemData.length;
        item.itemData.forEach(_item => {
          if (_item.checked) {
            storeIdChecked.push(_item.storeId);
          } else {
            storeIdUnchecked.push(_item.storeId);
          }
        });
      });
      const tempchecked = [];
      storeIdChecked.forEach(item => {
        const obj = {
          storeId: item,
          itemIds: napeId
        };
        tempchecked.push(obj);
      });
      const paramsBind = {
        storeList: tempchecked
      };
      const tempUnchecked = [];
      storeIdUnchecked.forEach(item => {
        const obj = {
          storeId: item,
          itemIds: napeId
        };
        tempUnchecked.push(obj);
      });
      const paramsUnBind = {
        storeList: tempUnchecked
      };
      let flag = false;
      if (storeIdChecked.length === count) { // all checked to bind
        const resBind = await self.bindNapeToStore(paramsBind).catch((err) => self.loading = false);
        if (resBind.errMsg === 'Success' && resBind.errCode === 0) {
          flag = true;
        }
      } else if (storeIdUnchecked.length === count) { // all unchecked to unbind
        const resUnBind = await self.UnbindNapeToStore(paramsUnBind).catch((err) => self.loading = false);
        if (resUnBind.errMsg === 'Success' && resUnBind.errCode === 0) {
          flag = true;
        }
      } else {
        const resBind = await self.bindNapeToStore(paramsBind).catch((err) => self.loading = false);
        const resUnBind = await self.UnbindNapeToStore(paramsUnBind).catch((err) => self.loading = false);
        if (resBind.errMsg === 'Success' && resUnBind.errMsg === 'Success') {
          flag = true;
        }
      }
      if (flag) {
        const bindIdList = await self.getBindStoreList();
        self.storeCount = bindIdList.data.length;
        if (bindIdList.errMsg === 'Success') {
          self.loading = false;
          self.notify(`${self.$t('insSettingView.editSuss')} ${bindIdList.data.length} ${self.$t('insSettingView.storesBound')}`, 'success', 3000);
        }
      } else {
        self.loading = false;
        self.notify(self.$t('insSettingView.bindFail'), 'warning', 3000);
        return false;
      }
    },

    getBindStoreList() {
      const self = this;
      const params = { inspectId: self.$route.params.inspectId };
      return new Promise((resolve, reject) => {
        getInspectBindList(params).then(res => {
          if (res.errMsg != undefined && res.errMsg === 'Success') {
            resolve(res);
          }
        })
        .catch(err =>{
          reject(err)
        });
      });
    },

    InitData() {
      const self = this;
      let name = '';
      let nameLang = '';
      switch (Number(sessionStorage.getItem('TabName'))) {
        case 0: {
          name = '远程巡检';
          nameLang = self.$t('insSettingView.remotePatrol');
          break;
        }
        case 1: {
          name = '现场巡检';
          nameLang = self.$t('insSettingView.onsitePatrol');
          break;
        }
        default: {
          name = 'test';
          nameLang = 'test';
          break;
        }
      }
      self.tabName = name;
      self.tabNameLang = nameLang;
      self.searchStore();
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }

  }
};
</script>
<style lang="scss" scoped>
*{
    padding: 0;
    margin:0;
    text-align: left;
    font-family: Roboto, Arial, Microsoft YaHei;
}
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
.el-search-input{
    width: calc(260/1920*100vw);
    margin-right: calc(25/1920*100vw);
    position:absolute;
    right: 0px;
}
.city-panel{
    @include point(height,auto);
    padding: 0px 15px 30px 15px;
    z-index: 980;
    .elcheckBox{
        margin-right:10px;
    }
    font-size: 14px;
    p{
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .city-details{
        width: auto;
        min-width: 12.5%;
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: calc(25/1920*100vw);
    }
}
.el-bind-device{
//   border: 1px solid $border;
//   background-color: #fff;
  .el-bind-header{
    // position: relative;
    background-color: #fff;
    padding:30px;
  }
    .seacrh-content{
        // margin-top: 40px;
        // margin-left: calc(40/1920*100vw);
        // position: relative;
        // display: flex;
        // align-items: center;
        span{
            font-size: calc(14/1920*100vw);;
        }
        .el-province{
            width: calc(160/1920*100vw);
            min-width: 85px;
            margin-left:calc(20/1920*100vw);
            margin-right: 0;
        }
        .city-input{
            width: calc(160/1920*100vw);
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            background: #F4F5F9 !important;
            cursor: pointer;
            border: 1px solid #E4E7ED;
            box-sizing: border-box;
            border-radius: 3px;
            overflow: hidden;
            min-height: 28px;
            min-width: 85px;
            position: relative;
            display: flex;
            align-items: center;
            span{
                display: inline-block;
                font-size: 12px;
                color: #7d8cad;
                margin-left: 15px;
                width: calc(160/1920*100vw - 40px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .icon-input{
                position: absolute;
                right: calc(15/1920*100vw);
                font-size: calc(14/1920*100vw);
                color: #C0C4CC;
            }
        }
        .el-search-btn{
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            padding: 0;
            width: calc(130/1920*100vw);
            text-align: center;
            margin-left: calc(20/1920*100vw);
            color: #fff;
            /*padding: 9px 15px;*/
        }
    }
    .el-header-title{
        font-size: 18px;
        font-weight: bold;
        // margin-left: calc(40/1920*100vw);
        position: relative;
        top: 5px;
        display: inline;
        color: $black;
    }
    .el-header-hr{
        margin-left: calc(40/1920*100vw);
        margin-top: calc(20/1920*100vw);
        margin-bottom: calc(25/1920*100vw);
        margin-right: calc(25/1920*100vw);
        border:0.5px solid #e3e9f4;
    }
    .choice-device{
        font-size: 12px;
        color: $tab;
        // display: inline;
        float:right;
        // position: absolute;
        // right: calc(25/1920*100vw);
        margin-top: 10px;
      .icon-tishi1{
        font-size: calc(16/1920*100vw);
      }
    }
    .el-bind-content-box{
        float: left;
        background-color: #fff;
        margin: calc(30/1920*100vw);
        padding:30px 30px 0 30px;
        width:92.5%;
        border: 1px solid $border;
    }
    .el-bind-content{
        // margin-left: calc(40/1920*100vw);
        margin-top: 15px;
        // margin-right: calc(25/1920*100vw);
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        color: $black;
        .bind-empty{
            text-align: center;
            .empty-text{
                font-size: calc(14/1920*100vw);
                color:#7d8cad;
            }
        }
        .el-all-checkbox{
            margin: 20px auto 20px 15px;
            margin-left: calc(25/1920*100vw);
            .all-device-title{
                margin-left: calc(20/1920*100vw);
                font-size: 14px;
            }
        }
        .device-group{
            width: 100%;
            margin-top: 25px;
            margin-bottom: 25px;
            .device-all-checkbox{
              margin-left: calc(25/1920*100vw);
                .group-name{
                    margin-left: calc(20/1920*100vw);
                    font-size: 14px;
                    font-weight: bold;
                }
            }
            .device-content{
                margin-left: calc(55/1920*100vw);
                overflow: hidden;
                .device-detail{
                    width: auto;
                    min-width: calc(215/1920*100vw);
                    margin-top: 10px;
                    margin-left: calc(15/1920*100vw);
                    float: left;
                    .device-name{
                        margin-left: calc(20/1920*100vw);
                        font-size: 14px;
                    }
                }
            }
        }
    }
    .el-bind-footer{
        height: calc(65/1920*100vw);
        line-height: calc(65/1920*100vw);
        margin-bottom: 35px;
        position: relative;
        .el-btn-content{
            margin-top: 20px;
            position: absolute;
            margin-bottom: 20px;
            .btn-area{
              display: flex;
              align-items: center;
              justify-content: center;
              .iconfont {
                margin-right: calc(8 / 1920 * 100vw);
              }
            }
            .btn{
              width: calc(130/1920*100vw);
              height: calc(36/1920*100vw);
             // background-color: #f31d65;
              color: #fff;
              text-align: center;
              .iconfont {
                font-size: calc(16 / 1920 * 100vw);
              }
              span{
                font-size: calc(14 / 1920 * 100vw);
              }
            }
            .en-btn{
              width: calc(130/1920*100vw);
              height: calc(36/1920*100vw);
              /*min-width: 160px;*/
              color: #fff;
              text-align: center;
              .iconfont {
                font-size: calc(16 / 1920 * 100vw);
              }
              span{
                font-size: calc(14 / 1920 * 100vw);
              }
              @media screen and (max-width: 1680px){
                width: 110px;
              }
            }
        }
    }
}
</style>
<style>
  @import '../../../assets/css/pagination.css';
  .el-button--mini, .el-button--mini.is-round{
    /*padding:7px 15px !important;*/
}
.el-province .el-input__inner{
    border-radius: 3px !important;
    background-color: #F4F5F9 !important;
    border :0 !important;
}
.el-select-dropdown__item{
    padding: 0 20px !important;
}
.el-select-dropdown__item.hover{
    background-color:#FEE4E7 !important;
}

.el-select-dropdown__item.selected{
    color:#f31d65 !important;
}
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
}
</style>
