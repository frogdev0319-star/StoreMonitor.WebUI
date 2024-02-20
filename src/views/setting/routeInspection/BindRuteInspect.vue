<template>
  <div class="el-bind-device padding">
    <div>
    <store-filter
      :cached-params="searchParams"
      :is-patrol = "false"
      :show-store-selected="false"
      :emit-changed="true"
      @emitStoreChange = onStoreChange
    >
      <template v-slot:bindReport>
        <div class="last-row" >
        <el-input
          :placeholder= "$t('insSettingView.searchPlaceholder')"
          v-model="serachVale"
          style="width: 300px"
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
      </template>
    </store-filter>
    </div>
    <div
      v-loading="loading"
      class="paper padding"
      style="margin-top: 20px"
      element-loading-background="rgba(255, 255, 255, 0.6)">
      <div class="el-header-title flex-center">
        {{ $t('insSettingView.selectStoreToBind', {tableName: tabName}) }}
        <div class="spacer"></div>
        <el-button
          :disabled="storeList.length === 0"
          class="storevue-button-filled"
          size="mini"
          type="primary"
          @click="applyNape">
          <div class="btn-area">
            <i class="iconfont icon-quxiaolianjie"/>
            <span>{{ $t('insSettingView.confirm') }}</span>
          </div>
        </el-button>
      </div>
      <div  class="el-bind-content">
        <div v-if="storeList.length === 0" :style="{'line-height': varyWindowHeight*0.63+'px'}">
          <div v-if="Havestore === 0|| resultHavestore && Havestore !== 0" class="bind-empty">
            <img :src="loadingGif" class="loading_rotate">
            <span class="empty-text">{{ $t('insSettingView.loadingbindstore') }}</span>
          </div>
        </div>
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <div v-if="storeList.length !== 0" class="el-all-checkbox">
            <el-checkbox v-model="allData" @change="choiceAll" class="storevue-checkbox-filled"/>
            <span class="all-device-title">{{ $t('insSettingView.relateAllStores') }}</span>
            <p class="choice-device"><i class="iconfont icon-tishi1" style="margin-right:10px;color:#93A2B6;"/>
              {{ $t('insSettingView.hasBoundStoreNum', {tableName: tabName, allStoreNum: totalCount, boundStoreNum: storeCount}) }}
            </p>
          </div>
          <div v-for="(item,index) in storeList" :key="index" class="device-group">
            <div class="device-all-checkbox">
              <el-checkbox v-model="item.checked" @change="choiceAllGroup(item)" class="storevue-checkbox-filled"/>
              <span class="group-name">{{ item.province }} - {{ item.cityName }}</span>
            </div>
            <div class="device-content">
              <div v-for="(_item,_index) in item.itemData" :key="_index" class="device-detail">
                <el-checkbox v-model="_item.checked" @change="choiceAllDevice(index,item,_index,_item)" class="storevue-checkbox-outlined"/>
                <span class="device-name">{{ _item.name }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import { getBriefStoreList } from '@/api/store';
import { getInspectBindList, bindInspectWithStore } from '@/api/inspect';
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
      loadingGif: require('../../../../static/img/loading.svg'),
      storeFilterObj: {},
      tempStoreData: []
    };
  },

  created() {
    this.InitData();
    this.getCountryStore();
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
        self.getStoreByCity(data.data)
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
      const provinceList = [];
      const bindArr = [];

      var needArry = []
      const bindStoreId = await self.getBindStoreList();
      const storeIds = bindStoreId.data.length > 0 ? bindStoreId.data[0].storeIds : [];

      // console.log('data =====}}}}', data)
      // console.log('storeIds =====}}}}', storeIds)

      // data.forEach( i => {
      //   if (provinceList.indexOf(i.province) === -1) {
      //     provinceList.push(i.province);
      //   }
      //   storeIds.forEach(_item => {
      //     if (i.storeId === _item) {
      //       bindArr.push(_item);
      //     }
      //   });
      // })
      // data.forEach(item => {
      //   if (cityList.indexOf(item.city) === -1) {
      //     cityList.push(item.city);
      //   }
      //   storeIds.forEach(_item => {
      //     if (item.storeId === _item) {
      //       bindArr.push(_item);
      //     }
      //   });
      // });
      

      data.forEach( i => {
        const obj = {};
        if(needArry.indexOf(i.province) === -1 && needArry.indexOf(i.city) === -1){
          obj.city = i.city
          obj.province = i.province
          
        }
        needArry.push(obj)
        storeIds.forEach(_item => {
          if (i.storeId === _item) {
            bindArr.push(_item);
          }
        });
        
      })
      
      const allItems =  [...new Set(needArry.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
      self.storeCount = bindArr.length;
      allItems.forEach( l => {
        var tempItems = []
        data.forEach( i => {
          const obj = {};
          if(i.province === l.province && i.city === l.city){
            obj.storeName = i.name
            obj.storeId = i.storeId
            tempItems.push(obj)
          }
        })
        l.store = tempItems
      })

      const temp = allItems;
      // cityList.forEach(item => {
      //   const obj = {};
      //   obj.city = item;
      //   const _temp = [];
      //   data.forEach(_item => {
      //     if (item === _item.city) {
      //       const _obj = {};
      //       obj.province = _item.province;
      //       _obj.storeName = _item.name;
      //       _obj.storeId = _item.storeId;
      //       _temp.push(_obj);
      //     }
      //   });
      //   obj.store = _temp;
      //   temp.push(obj);
      // });

      const groupTemp = [];
      temp.forEach(item => {
        const groupObj = {};
        groupObj.province = item.province;
        groupObj.cityName = item.city;
        const _temp = [];
        let _tempCount = 0;
        item.store.forEach(_item => {
          const _obj = {};
          if (storeIds.indexOf(_item.storeId) === -1) {
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
      const bindStoreData = JSON.parse(sessionStorage.getItem('bindStoreData'));
      const bindParams = {
        applyItems: [{
          inspectId: bindStoreData.inspectId,
          bindStoreIds: storeIdChecked,
          unbindStoreIds: storeIdUnchecked
        }]
      };
      try {
        await bindInspectWithStore(bindParams);
        const bindIdList = await self.getBindStoreList();
        self.storeCount = bindIdList.data.length > 0 ? bindIdList.data[0].storeIds.length : 0;
        if (bindIdList.errMsg === 'Success') {
          self.loading = false;
          util.notify(`${self.$t('insSettingView.editSuss')} ${self.storeCount}
          ${self.$t('insSettingView.storesBound')}`, 'success', 3000);
        }
      } catch (e) {
        self.loading = false;
        util.notify(self.$t('insSettingView.bindFail'), 'warning', 3000);
        return false;
      }
    },

    getBindStoreList() {
      const bindStoreData = JSON.parse(sessionStorage.getItem('bindStoreData'));
      const params = { inspectIds: [bindStoreData.inspectId] };
      return new Promise((resolve, reject) => {
        getInspectBindList(params).then(res => {
          if (res.errCode === 0) {
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

    onStoreChange(filterStoreIds) {
      //this.storeStr = storeObj.storeStr;
      //this.storeFilterObj = storeObj;
      //console.log("onStoreChange:",filterStoreIds);
      this.curStore = filterStoreIds;
      this.searchStore();
    }

  }
};
</script>
<style lang="scss" scoped>
*{
    font-family: Roboto, Arial, Microsoft YaHei;
    text-align: left;
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
        // width: 90%;
      }
    }
    .el-header-title{
        font-size: 18px;
        font-weight: bold;
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
    .last-row{
        display: flex;
        flex-direction: row;
        width:100%;
        height: 36px;
        align-items: flex-start;
        align-items:center;
        justify-content: space-between;
        padding-right: calc(180/1920*100VW);
    }
    .el-bind-content{
        margin-top: 15px;
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
                margin-left: calc(200/1920*100vw);
                overflow: hidden;
                background-color: #f7f9fa;
                display: flex;
                flex-wrap: wrap;
                padding: calc(10/1920*100vw) calc(20/1920*100vw);
                .device-detail{
                    width: auto;
                    margin-top: calc(10/1920*100vw);
                    margin-bottom: calc(10/1920*100vw);
                    margin-right: 60px;
                    // min-width: calc(315/1920*100vw);
                    .device-name{
                        margin-left: 10px;
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
