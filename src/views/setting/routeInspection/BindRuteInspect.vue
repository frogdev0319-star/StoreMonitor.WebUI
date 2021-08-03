<template>
  <div class="el-bind-device">
    <div class="el-bind-header">
      <div class="seacrh-content">
        <store-filter
          class="store-filter"
          :is-patrol = "true"
          :set-width-flag="true"
          @storeChange = "onStoreChange"
        />
        <el-input
          :placeholder= "$t('insSettingView.searchPlaceholder')"
          v-model="serachVale"
          size="small"
          class="el-search-input"
          clearable
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
    <div
      v-loading="loading"
      class="el-bind-content-box"
      element-loading-background="rgba(255, 255, 255, 0.6)">
      <p class="el-header-title">{{ $t('insSettingView.selectStoreToBind', {tableName: tabName}) }}</p>
      <p class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"/>
        {{ $t('insSettingView.hasBoundStoreNum', {tableName: tabName, allStoreNum: totalCount, boundStoreNum: storeCount}) }}
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
          <el-button
            :disabled="storeList.length === 0"
            :class="lang === 'en' ? 'en-btn' : 'btn'"
            size="mini"
            type="primary"
            @click="applyNape">
            <div class="btn-area">
              <i class="iconfont icon-quxiaolianjie"/>
              <span>{{ $t('insSettingView.confirm') }}</span>
            </div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBriefStoreList } from '@/api/store';
import { applyItemInspectItem, UnapplyInspectItem, getInspectBindList } from '@/api/inspect';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import util from '@/common/util';
import StoreFilter from '@/components/StoreFilter';

export default {
  name: 'BindRuteInspect',

  components: {
    StoreFilter,
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
      storeDataList: [],
      curStore: [],
      curStoreTag: [],
      storeStr: '',
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
      loadingGif: require('../../../../static/img/loading.gif'),
      storeFilterObj: {}
    };
  },

  mounted() {
    const self = this;
    self.InitData();
    self.getCountryStore();
  },
  destroyed() {
    sessionStorage.removeItem('bindStoreData');
  },

  methods: {
    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(res => {
          resolve(res);
        });
      });
    },

    async getCountryStore() {
      const self = this;
      const data = await self.getBriefStoreData();
      self.totalCount = data.data.length;
      if (data.errCode === 0) {
        self.tempStoreData = data.data;
      }
    },

    async searchStoreInput() {
      const self = this;
      const temp = [];
      let tempArray = [];
      const tempStore = [];
      if (self.serachVale.length !== 0) {
        self.tempStoreData.forEach( item => {
          temp.push(util.getPinyinList(item.name));
          tempStore.push(item);
        })
        for (var i = 0; i < temp.length; i++) {
          if (temp[i][0].indexOf(self.serachVale.trim()) !== -1 ||
                      temp[i][1].indexOf(self.serachVale.trim()) !== -1) {
            tempArray.push(tempStore[i]);
          }
        }
      } else {
        self.tempStoreData.forEach(item => {
          if (self.curStore.map(x => x).indexOf(item.storeId) !== -1) {
            tempArray.push(item);
          }
        });
      }

      if (tempArray.length > 0) {
        self.resultHavestore = true;
        self.Havestore++;
      } else {
        self.resultHavestore = false;
        self.Havestore++;
      }
      self.getStoreByCity(tempArray);
    },

    async searchStore() {
      const self = this;
      let curStoreTemp = [];
      self.tempStoreData.forEach(item => {
        if (self.curStore.map(x => x).indexOf(item.storeId) !== -1) {
          curStoreTemp.push(item);
        }
      });
      self.showCityContent = false;
      self.serachVale = '';
      self.storeList = [];
      if (curStoreTemp.length > 0) {
        self.resultHavestore = true;
        self.Havestore++;
      } else {
        self.resultHavestore = false;
        self.Havestore++;
      }
      self.getStoreByCity(curStoreTemp);
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

    async getStoreByCity(data) {
      const self = this;
      const cityList = [];
      const bindArr = [];
      const bindStoreId = await self.getBindStoreList();
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
          util.notify(`${self.$t('insSettingView.editSuss')} ${bindIdList.data.length}
          ${self.$t('insSettingView.storesBound')}`, 'success', 3000);
        }
      } else {
        self.loading = false;
        util.notify(self.$t('insSettingView.bindFail'), 'warning', 3000);
        return false;
      }
    },

    getBindStoreList() {
      const bindStoreData = JSON.parse(sessionStorage.getItem('bindStoreData'));
      const params = { inspectId: bindStoreData.inspectId };
      return new Promise((resolve, reject) => {
        getInspectBindList(params).then(res => {
          if (res.errMsg != undefined && res.errMsg === 'Success') {
            resolve(res);
          }
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    InitData() {
      const self = this;
      let nameLang = '';
      switch (Number(sessionStorage.getItem('TabName'))) {
        case 0: {
          nameLang = self.$t('insSettingView.onsitePatrol');
          break;
        }
        case 1: {
          nameLang = self.$t('insSettingView.remotePatrol');
          break;
        }
        default: {
          nameLang = 'test';
          break;
        }
      }
      self.tabName = nameLang;
    },

    onStoreChange(storeObj) {
      this.storeStr = storeObj.storeStr;
      this.storeFilterObj = storeObj;
      this.curStore = storeObj.filterStoreIds;
      this.searchStore();
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
  top: 30px;
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
  .el-bind-header{
    background-color: #fff;
    padding:30px;
    border-bottom: 1px solid $border;
  }
    .seacrh-content{
      overflow: hidden;
        span{
            font-size: calc(14/1920*100vw);;
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
    @media screen and (min-width: 1920px){
      .store-filter{
        width: 90%;
      }
    }
    .el-header-title{
        font-size: 18px;
        font-weight: bold;
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
        float:right;
        margin-top: 10px;
      .icon-tishi1{
        font-size: calc(16/1920*100vw);
      }
    }
    .el-bind-content-box{
        float: left;
        background-color: #fff;
        margin: 30px calc(30/1920*100vw);
        padding: 30px 30px 0 30px;
        width:92.5%;
        border: 1px solid $border;
    }
    .el-bind-content{
        margin-top: 15px;
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
