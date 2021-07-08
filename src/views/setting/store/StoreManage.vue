<template>
  <div :style="{'height':windowHeight - 142+'px'}" class="el-event-content">
    <el-col :span="24" class="seacrh-content">
      <store-filter
        :is-patrol = "true"
        :set-width-flag="true"
        :cached-params = "searchParams"
        path="storeMgmt"
        @storeChange = "onStoreChange"
      />
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

    <!--<el-col :span="24" class="seacrh-content">-->
      <!--<span class="select-title">{{ $t('remotePatrol.storeSelect') }}</span>-->
      <!--<el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" size="mini" class="el-province"-->
                 <!--@change="changeCountry">-->
        <!--<el-option-group v-for="group in CountryList" :key="group.label" :label="group.label">-->
          <!--<el-option v-for="item in group.countryList" :key="item.value" :label="item.label" :value="item.value"/>-->
        <!--</el-option-group>-->
      <!--</el-select>-->
      <!--<region-multi-select-->
        <!--ref="proviceSelect"-->
        <!--:selected="curProvince"-->
        <!--:placeholder="$t('remotePatrol.regionI')"-->
        <!--:options="provinceList"-->
        <!--:disabled="curCountry.length === 0 || curCountry === '-1'"-->
        <!--:all="$t('overview.allZoneI')"-->
        <!--style="display: inline;margin-left: calc(20/1920*100vw);"-->
        <!--@changeInput="handleProChange"/>-->
      <!--<region-multi-select-->
        <!--ref="citySelect"-->
        <!--:selected="curCity"-->
        <!--:placeholder="$t('remotePatrol.regionII')"-->
        <!--:options="cityList"-->
        <!--:disabled="curProvince.length == 0 || curCountry === '-1'"-->
        <!--:all="$t('overview.allZoneII')"-->
        <!--style="display: inline;"-->
        <!--@changeInput="handleCityChange"/>-->

      <!--<multi-select-->
        <!--ref="multiSelect"-->
        <!--:selected="curStore"-->
        <!--:placeholder="$t('remotePatrol.stores')"-->
        <!--:options="storeDataList"-->
        <!--style="display: inline;"-->
        <!--@changeInput="handleStoreChange"/>-->
      <!--<span class="select-title">{{ $t('remotePatrol.selectStoreTag') }}</span>-->
      <!--<multi-select-->
        <!--ref="TagMultiSelect"-->
        <!--:selected="curStoreTag"-->
        <!--:placeholder="$t('remotePatrol.selectStoreTag')"-->
        <!--:all-select="0"-->
        <!--:alltype="0"-->
        <!--:options="StoreTagList"-->
        <!--style="display: inline;margin-left: calc(20/1920*100vw);"-->
        <!--@changeInput="changeStoreTag"/>-->
      <!--<el-input-->
        <!--v-model="serachVale"-->
        <!--size="small"-->
        <!--class="el-search-input"-->
        <!--clearable-->
        <!--@keyup.enter.native="searchEventList"-->
        <!--@clear="searchEventList">-->
        <!--<i slot="prefix" class="iconfont icon-sousuo iconsou"/>-->
      <!--</el-input>-->
    <!--</el-col>-->
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
              <span slot="reference" class="napeTable-prp">{{ scope.row.napeTable }}</span>
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
import SearchConditionUtil from '@/common/SearchConditionUtil';
import util from '@/common/util';
import StoreFilter from '@/components/StoreFilter';

export default {
  name: 'StoreManage',

  components: {
    StoreFilter,
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
      storeStr: '',
      ifGetParamsFromCash: false,
      ifSaveParams: false,
      storeFilterObj: {},
      searchParams: {}
    };
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        this.ifSaveParams = false;
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
    self.getSearchParams();
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

    searchStore() {
      const self = this;
      self.serachVale = '';
      self.params.like = {};
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

    getInitData() {
      let self = this;
      self.getSearchParams();
      self.getTagListData();
      self.params.filter = {
        'page': self.page - 1,
        'size': self.sizeNum
      };
      self.getStoreList(self.params);
    },

    async getStoreList(params) {
      let self = this;
      this.ifSaveParams && this.saveSearchParams(params);
      try {
        await self.getTableData(params);
        this.ifSaveParams = true;
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
      catch (err) {
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
      if (row.napeTable.indexOf(this.$t('overview.remotePatrol')) !== -1) {
        sessionStorage.setItem('STORE_ROW', JSON.stringify(row));
        this.$router.push({ name: 'storeDetail', params: row });
      } else {
        util.notify(this.$t('insSettingView.storeNoInspect'), 'warning', 3000);
        return false;
      }
    },

    getStoreData(params) {
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

    saveSearchParams(params) {
      const tempsearchParamsObj = this.storeFilterObj;
      tempsearchParamsObj.searchCondition = params;
      const searchParamsObj = {
        path: 'storeMgmt',
        params: tempsearchParamsObj
      };
      SearchConditionUtil.saveSearchCondition(searchParamsObj);
    },

    getSearchParams() {
      const searchParams = SearchConditionUtil.getSearchCondition('storeMgmt');
      if (Object.keys(searchParams).length > 0) {
        this.curStore = searchParams.storeIds;
        this.curCountry = searchParams.curCountry;
        this.curProvince = searchParams.curProvince;
        this.curCity = searchParams.curCity;
        this.curStore = searchParams.curStore;
        this.curStoreTag = searchParams.curStoreTag;
        // this.setDefaultSort();
        this.ifGetParamsFromCash = true;
        this.searchParams = searchParams;
      } else {
        const storeIds = this.filterStoreIds;
        this.params.clause = { storeId: storeIds };
        this.ifGetParamsFromCash = false;
        this.searchParams = {};
      }
    },

    onStoreChange(storeObj) {
      console.log(storeObj);
      this.storeStr = storeObj.storeStr;
      this.storeFilterObj = storeObj;
      this.searchStore();
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
.el-search-input{
  @include point(width,180);
  width: calc(180/1920*100vw);
  @include point(margin-right,20);
  position:absolute;
  right: 0;
  top: 30px;
}
.iconsou{
  position:relative;
  left:6px;
  top:7px;
  font-size:18px;
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

