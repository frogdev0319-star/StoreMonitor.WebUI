<template>
  <div :style="{'height':windowHeight - 142+'px'}" class="el-event-content">
    <el-col :span="24" class="seacrh-content">
      <span class="select-title">{{ $t('remotePatrol.storeSelect') }}</span>
      <el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" size="mini" class="el-province"
                 @change="changeCountry">
        <el-option-group v-for="group in CountryList" :key="group.label" :label="group.label">
          <el-option v-for="item in group.countryList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-option-group>
      </el-select>
      <region-multi-select
        ref="proviceSelect"
        :selected="curProvince"
        :placeholder="$t('remotePatrol.regionI')"
        :options="provinceList"
        :disabled="curCountry.length === 0 || curCountry === '-1'"
        :all="$t('overview.allZoneI')"
        style="display: inline;margin-left: calc(20/1920*100vw);"
        @changeInput="handleProChange"/>
      <region-multi-select
        ref="citySelect"
        :selected="curCity"
        :placeholder="$t('remotePatrol.regionII')"
        :options="cityList"
        :disabled="curProvince.length == 0 || curCountry === '-1'"
        :all="$t('overview.allZoneII')"
        style="display: inline;"
        @changeInput="handleCityChange"/>

      <multi-select
        ref="multiSelect"
        :selected="curStore"
        :placeholder="$t('remotePatrol.stores')"
        :options="storeDataList"
        style="display: inline;"
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
        v-model="serachVale"
        size="small"
        class="el-search-input"
        clearable
        @keyup.enter.native="searchEventList"
        @clear="searchEventList">
        <i slot="prefix" class="iconfont icon-sousuo iconsou"/>
      </el-input>
    </el-col>
    <el-col :span="24" class="el-table-content">
      <el-table
        :data="tableData"
        :highlight-current-row="true"
        :empty-text="$t('storeView.noStoreData')"
        :height="tableHieght"
        :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
        :cell-style="cellStyle"
        align="left"
        stripe
        style="width:100%;margin-left:15px; text-algin:center;height:300px;float:left;border: 0px solid #ebebeb;"
        @sort-change="sortChange"
        @row-click="toEventDetail"
      >
        <el-table-column
          min-width="140"
          header-align="center"
          align="center">
          <template v-if="scope.row.showTag" slot-scope="scope">
            <span
              v-if="scope.row.bindDevice"
              class="icon-span"
              style="background-color:#6097F4;" >
              <i class="iconfont icon-yichangshijianliebiaocopy"/>
              <span>{{ $t('storeView.binded') }}</span>
            </span>
            <span
              v-else
              class="icon-span"
              style="background-color:#FEA316;">
              <i class="iconfont icon-yichangshijianliebiaocopy"/>
              <span>{{ $t('storeView.unbinded') }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in tableInfoData"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :sortable="item.sortable"
          :min-width="item.width"/>
        <el-table-column
          :label="$t('storeView.bindInspectList')"
          prop="napeTable"
          min-width="160"
          align="left">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.napeTable.length !== 0 && (scope.row.napeTable !== '--' && scope.row.napwTable !== '现场巡检')"
              placement="top-start"
              width="200"
              trigger="hover">
              <span
                v-for="(_item,_index) in scope.row.napeTable.split('，')"
                :key="_index">
                {{ _item }}
              </span>
=              <span slot="reference" class="napeTable-prp">{{ scope.row.napeTable }}</span>
            </el-popover>
            <span v-else>
              {{ scope.row.napeTable }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('storeView.operation')"
          prop="option"
          align="left"
          min-width="100"
        >
          <template slot-scope="scope">
            <i class="iconfont icon-gengduo" style="cursor: pointer; vertical-align: middle" @click="toEventDetail(scope.row)"/>
          </template>
        </el-table-column>
        <div slot="empty">
          <div>
            <i class="iconfont icon-zhengque empty-data-icon"/>
            <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262'}">{{ noData }}</span>
          </div>
        </div>
      </el-table>
      <div class="toolbar pagination" style="width:100%; margin:10px 15px;height:12%;">
        <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          :page-size="sizeNum"
          :total="total"
          :current-page="page"
          background
          small
          layout="jumper,total, prev, pager, next,sizes"
          style="float:right;margin-top:15px;"
          @size-change="sizeChange"
          @current-change="currentChange"/>
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getInspectBindCount } from '@/api/inspect';
import { getStoreList, getBriefStoreList, GetTagList } from '@/api/store';
import { isLoginIn } from '@/api/login';
import PubSub from 'pubsub-js';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';

export default {
  name: 'StoreManage',

  components: {
    MultiSelect,
    RegionMultiSelect
  },

  data() {
    return {
      tableInfoData: [
        {
          'prop': 'name',
          'label': this.$t('storeView.storeName'),
          'sortable': 'custom',
          'width': 130
        },
        {
          'prop': 'supervisorName',
          'label': this.$t('storeView.supervisor'),
          'sortable': 'custom',
          'width': 120
        },
        {
          'prop': 'userName',
          'label': this.$t('storeView.solver'),
          'sortable': false,
          'width': 100
        },
        {
          'prop': 'phone',
          'label': this.$t('storeView.contact'),
          'sortable': false,
          'width': 120
        }

      ],
      allCityChecked: false,
      storeData: [],
      tempStoreData: [],
      tableData: [],
      provinceList: [],
      cityList: [],
      storeDataList: [],
      CountryList: [],
      StoreTagList: [],
      curCountry: '',
      curProvince: [],
      curCity: [],
      curStore: [],
      curStoreTag: [],
      showDrap: false,
      showCityContent: false,
      multeCityList: [],
      tagList: [],
      windowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      params: {},
      total: 0,
      sizeNum: 10,
      page: 1,
      serachVale: '',
      timeid: 0,
      isChecked: false,
      curCitys: '城市',
      showPopoVer: true,
      lang: this.$i18n.locale,
      noData: '',
      storeStr: ''
    };
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !==0) {
        self.getInitData();
      }
    }
  },

  computed: {
    tableHieght() {
      console.log(this.windowHeight);
      if (this.windowHeight > 800) {
        return this.windowHeight * 0.70;
      } else if (this.windowHeight > 700) {
        return this.windowHeight * 0.67;
      } else {
        return this.windowHeight * 0.55;
      }
    },

    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  async  mounted() {
    const self = this;
    const windowHeight = window.innerHeight;
    if (windowHeight > 800) {
      this.tableHeight = 770 + 'px';
      this.sizeNum = 20;
    }
    self.getCountryStore();
    self.getTagListData();
  },

  beforeDestroy() {
    window.clearInterval(this.timeid);
  },

  activated() {
    this.getStoreList(this.params);
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
      if (val == '') {
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
                if ((t_item === v_item && self.curCountry === item.country)
                  || (t_item === v_item && self.curCountry === '-1')) {
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

    choiceCity() {
      const self = this;
      if (self.curProvince.length === 0) {
        self.notify(this.$t('storeView.selectProviceInfo'), 'warning', 3000);
        self.showPopoVer = true;
        return false;
      } else {
        self.showPopoVer = false;
        self.showDrap = !self.showDrap;
      }
    },

    searchStore() {
      const self = this;
      self.serachVale = '';
      self.params.like = {};
      const temp = [];
      self.page = 1;
      const storeList = self.storeStr.split('，');
      if (storeList.length !== 0) {
        self.params.clause = {
          name: storeList
        };
      } else {
        self.params.clause = {};
      }
      self.getStoreList(self.params);
    },

    sizeChange(val) {
      const self = this;
      self.sizeNum = val;
      self.getStoreList(self.params);
    },

    currentChange(val) {
      const self = this;
      self.page = val;
      self.getStoreList(self.params);
      let dom = document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0];
      let offestTop = dom.offsetTop;
      if (dom != undefined) {
        document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0].scrollTop = 0;
      }
    },

    async getCountryStore() {
      let self = this;
      try {
        let data = await self.getBriefStoreData();
        let countryArr = [];
        if (data.errCode === 0 && data.errMsg === 'Success') {
          self.tempStoreData = data.data;
          if (self.tempStoreData.length !== 0) {
            self.tempStoreData.forEach(item => {
              let country = item.country;
              if (countryArr.map(x => x.label).indexOf(country) === -1) {
                let obj = {
                  value: country,
                  label: country
                };
                countryArr.push(obj);
              }
            });
          }
          let countryList = countryArr;
          self.CountryList[0] = {};
          self.CountryList[0].label = self.$t('remotePatrol.country');
          self.CountryList[0].countryList = countryList;
          self.CountryList[0].countryList.unshift({ value: '-1', label: self.$t('remotePatrol.all') });
          self.curCountry = countryList[0].value;
          self.selectAllProAndCity(self.curCountry);
        }
      }
      catch (err) {
        console.log("StoreManagement-getCountryStore: " + err);
      }
    },

    selectAllProAndCity(val) {
      let self = this;
      let storeList = self.tempStoreData;
      let temp = [];
      let tempStore = [];
      storeList.forEach(item => {
        if (item.country === val || val === '-1') {
          if (temp.map(x => x.value).indexOf(item.province) === -1) {
            let obj = {
              label: item.province,
              value: item.province
            };
            temp.push(obj);
          }
          let obj = {
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
      let cityTemp = [];
      self.provinceList.forEach(_item => {
        storeList.forEach(item => {
          if (item.province === _item.value) {
            if (cityTemp.map(x => x.value).indexOf(item.city) === -1) {
              let obj = {
                label: item.city,
                value: item.city
              };
              cityTemp.push(obj);
            }
          }
        });
      });
      self.cityList = cityTemp;
      let provinceArr = [];
      self.provinceList.forEach(item => {
        provinceArr.push(item.value);
      });
      self.curProvince = provinceArr;

      let cityArr = [];
      self.cityList.forEach(item => {
        cityArr.push(item.value);
      });
      self.curCity = cityArr;
      self.storeDataList = tempStore;
      let storeArr = [];
      self.storeDataList.forEach(item => {
        storeArr.push(item.storeId);
      });
      setTimeout(()=>{
        self.curStore = storeArr;
        self.changeStore(self.curStore);
      },100)
    },

    clearPage() {
      let self = this;
      self.params = {};
      self.curProvince = [];
      self.curCitys = this.$t('storeView.cityPlaceholder');
      self.serachVale = '';
      self.multeCityList = [];
      self.curStoreTag = [];
    },

    getInitData() {
      let self = this;
      self.clearPage();
      self.getCountryStore();
      self.getTagListData();
      self.params.filter = {
        'page': self.page - 1,
        'size': self.sizeNum
      };
      self.getStoreList(self.params);
    },

    async getStoreList(params) {
      let self = this;
      try {
        await self.getTableData(params);
        let paramsGetBind = {
          'storeIds': self.tableData.map(x => x.storeId)
        };
        let tempStoreId = self.tableData.map(x => x.storeId);
        if (paramsGetBind.storeIds.length !== 0) {
          getInspectBindCount(paramsGetBind).then(res => {
            let data = res.data;
            let tempRet = [];
            for (let i = 0; i < tempStoreId.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (tempStoreId[i] === data[j].storeId) {
                  tempRet.push(data[j]);
                }
              }
            }
            for (let i = 0; i < data.length; i++) {
              self.tableData[i].bindDevice = (tempRet[i].unbindCount === 0);
            }
          })
        }
      }
      catch (e) {
        console.log("StoreManagement-getStoreList: " + err);
      }
    },

    async getTableData(params){
      params.filter = { page: this.page - 1, size: this.sizeNum };
      let data = await this.getStoreData(params);
      this.storeData = data.data;
      let tempStoreArr = [];
      this.storeData.content.forEach(item => {
        let storeObj = {};
        storeObj.bindDevice = false;
        storeObj.storeId = item.storeId;
        storeObj.name = item.name;
        storeObj.userName = item.userName;
        storeObj.userId = item.userId;
        storeObj.supervisorName = item.supervisorName;
        storeObj.supervisorId = item.supervisorId;
        storeObj.phone = item.phoneNumber;
        storeObj.favorite = item.favorite;
        storeObj.appliedInspect = item.appliedInspect;
        if (item.appliedInspect.length !== 0) {
          let au_inspect = [];
          let mode = [];
          item.appliedInspect.forEach(au_item => {
            mode.push(au_item.mode);
          });
          if (mode.indexOf(0) !== -1) {
            au_inspect.push(this.$t('overview.remotePatrol'));
          }
          if (mode.indexOf(1) !== -1) {
            au_inspect.push(this.$t('overview.onsitePatrol'));
          }
          storeObj.napeTable = au_inspect.join('，');
        } else {
          storeObj.napeTable = '--';
        }
        if (storeObj.napeTable.indexOf(this.$t('overview.remotePatrol')) === -1) {
          storeObj.showTag = false;
        } else {
          storeObj.showTag = true;
        }
        storeObj.schedue = '--';
        storeObj.device = item.device;
        tempStoreArr.push(storeObj);
      });
      this.tableData = tempStoreArr;
      if (this.tableData.length === 0) {
        this.noData = this.$t('storeView.noStoreData');
      }
      this.total = this.storeData.totalElements;
    },

    searchEventList() {
      let self = this;
      self.params.clause = {};
      self.page = 1;
      if (self.serachVale.length !== 0) {
        self.params.like = {
          'name': self.serachVale,
          'supervisorName': self.serachVale
        };
      } else {
        self.params.like = {};
      }
      self.getStoreList(self.params);
    },

    sortChange(column) {
      let self = this;
      self.params.order = {
        direction: column.order === 'ascending' ? 'asc' : 'desc',
        property: column.prop
      };
      self.page = 1;
      self.getStoreList(self.params);
    },

    toEventDetail(row) {
      let self = this;
      if (row.napeTable.indexOf(self.$t('overview.remotePatrol')) !== -1) {
        sessionStorage.setItem('STORE_ROW', JSON.stringify(row));
        self.$router.push({ name: 'storeDetail', params: row });
      } else {
        self.notify(self.$t('insSettingView.storeNoInspect'), 'warning', 3000);
        return false;
      }
    },

    getStoreData(params) {
      let self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getBriefStoreData() {
      let self = this;
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getTagListData() {
      let self = this;
      return new Promise((resolve, reject) => {
        GetTagList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            res.data.forEach(item => {
              let obj = {};
              obj.value = item.tagId;
              obj.label = item.tagName;
              obj.disabled = false;
              self.StoreTagList.push(obj);
            });
            resolve(res);
          }
        }).catch(err => {
          console.log("StoreManagement-getTagListData: " + err);
          reject(err);
        });
      });
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(vm);
      PubSub.publish('change-color', { showTag: false });
    });
  }

};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/textStyle.css';
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
 $red:#f31d65;
 $border:#e3e9f4;
 $tab:#7d8cad;
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
    }
    .city-details{
        width: auto;
        min-width: 12.5%;
        display: inline-block;
        @include point(margin-top,5);
        @include point(margin-bottom,5);
        @include point(margin-right,20);
    }
}
.el-event-content{
    .elcheckBox {
        margin-right: 10px !important;
    }
    .seacrh-content{
        padding: 30px calc(40/1920*100vw);
        text-align: left;
        border-bottom: 0.5px solid #e3e9f4;
        align-items: center;
        background-color: #fff;
        .store-handle{
            margin-top:30px;
            .header-details1{
                text-align: left;
                height: 30px;
                line-height: calc(30/1920*100vw);
                span{
                    font-size: calc(14/1920*100vw);
                    margin-right: calc(20/1920*100vw);
                }
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
        .select-title{
            color: #424151;
            font-size: calc(14/1920*100vw);
        }
        .el-province{
            width: calc(160/1920*100vw);
            min-width: 85px;
            margin-left: calc(20/1920*100vw);
            margin-right: 0;
            @media screen and (max-width: 1024px){
              margin-right: 10px;
              margin-left: 10px;
            }
        }
        .el-search-btn{
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            width: calc(130/1920*100vw);
            padding: 0 0;
            margin-left: calc(20/1920*100vw);
            color: #fff;
        }
        .en-el-search-btn{
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          width: calc(130/1920*100vw);
          padding: 0 0;
          text-align: center;
          margin-left:calc(20/1920*100vw);
          color: #fff;
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
        .el-search-input{
            @include point(width,180);
            @include point(margin-right,20);
            position:absolute;
            right: 0px;
        }
        .iconsou{
            position:relative;
            left:6px;
            top:7px;
            font-size:18px;
        }
    }
    .el-table-content{
        float: left;
        background-color: #fff;
        margin: calc(30/1920*100vw);
        margin-bottom: 0;
        padding:0 30px 30px 0px;
        width:96%;
        border: 1px solid $border;
        .napeTable-prp{
            width: 70%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: pointer;
        }
        .icon-span{
            display:inline-block;
            width: 92px;
            height:22px;
            color:white;
            padding-left:5px;
            padding-right:5px;
            font-size: 12px;
            span{
              position: relative;
              @include point(bottom, 1);
            }

        }
        .icon-gengduo{
          font-size: calc(24/1920*100vw);
          color: #7d8cad;
        }
    }
}
.empty-data-icon{
    font-size: 22px;
    color: #53c247;
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
        background: #F4F5F9 !important;
        border-radius: 0px !important;
        border: 1px solid #E4E7ED !important;
    }
    .el-input--small >>>.el-input__inner{
        background: #F4F5F9 !important;
        border-radius: 15px !important;
    }
</style>
<style>
@import '../../../assets/css/pagination.css';
    .el-table::before{
        height: 0px !important;
    }
    .current-row > td {
        background: #FEE7E4 !important;
    }
    .el-table tbody tr:hover>td {
        background-color: #FDE8EF !important;
    }
    .el-table__header-wrapper th:nth-last-of-type(2){
        border-right: none !important;
    }
    .el-table--border td:nth-last-of-type(1){
        border-right: none !important;
    }
    .el-table--border::after, .el-table--group::after{
        width: 0 !important;
    }
    .title-table .el-table--border{
      border-left: none;
    }
    .el-table__row{
      height: calc(60/1920*100vw);
      font-size: calc(14/1920*100vw);
      color: #182752;
    }
    .el-table-content .el-table .cell{
      padding-left: calc(20/1920*100vw);
      padding-right: calc(20/1920*100vw);
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td{
      background-color: #f7f8fb;
    }
    .el-table__header{
      font-size: calc(12/1920*100vw);
    }
</style>

