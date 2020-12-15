<template>
  <div :style="{'minHeight':windowHeight-118+'px'}" class="el-event-content">
    <div class="el-event-header">
      <div class="el-area">
        <span class="select-title">{{ $t('remotePatrol.storeSelect') }}</span>
        <el-select v-model="curCountry" :placeholder="$t('remotePatrol.country')" size="mini"
                   class="el-province" @change="changeCountry">
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
          :disabled="curProvince.length === 0 || curCountry === '-1'"
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
          class="el-search"
          clearable
          @clear="searchData(true)"
          @keyup.enter.native="searchData(true)">
          <i slot="prefix" class="iconfont icon-sousuo" style="margin-left:5px;font-size:18px;line-height:32px;"/>
        </el-input>
      </div>
      <div class="el-date">
        <span class="date-title">{{ $t('eventView.time') }}</span>
        <el-date-picker
          ref="datePicker"
          v-model="dateValue"
          :clearable="false"
          :editable="false"
          :popper-class="poperClass"
          :picker-options="dateOpt"
          :default-time="defaultTime"
          type="datetimerange"
          range-separator="~"
          size="mini"
          format="yyyy/MM/dd HH:mm:ss"
          class="date-range"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"/>
        <el-tooltip
          :popper-class="toolTipClass"
          class="item"
          effect="dark"
          placement="bottom-end">
          <div slot="content">*{{ $t('eventView.timePlaceholder') }}</div>
          <i class="iconfont icon-bangzhu iconbangzhu"/>
        </el-tooltip>
        <span
          class="date-title"
          style="margin-left:30px;">{{ $t('eventView.status') }}</span>
        <multi-select
          ref="multiState"
          :selected="curState"
          :alltype="0"
          :options="states"
          :disabled="activeName!=='4'"
          style="display:inline;"
          @changeInput="handleStateChange"/>
      </div>
    </div>
    <div class="el-table-content">
      <el-button :class="lang==='en' ? 'en-export-btn':'export-btn'" type="primary" size="mini" @click="export2Excel" >
        <div class="btn-area">
          <img :src="exportPng" class="icon-excel">
          <span class="spanClass">{{ $t('eventView.exportReport') }}</span>
        </div>
      </el-button>
      <el-tabs v-model="activeName" :id="lang === 'en' ? 'en-tabs-content' : 'tabs-content'" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item,index) in tableDataList"
          :key="index"
          :label="`${item.label} （${item.eventCount}）`">
          <div class="el-table-panel">
            <el-table
              :data="item.tableData"
              :highlight-current-row="true"
              :height="windowHeight-260"
              :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
              :cell-style="cellStyle"
              empty-text="没有事件数据"
              align="left"
              stripe
              style=""
              class="table-content"
              @sort-change="sortChange"
              @row-click="rowClickItem"
            >
              <el-table-column
                min-width="100"
                header-align="center"
                align="center">
                <template slot-scope="scope" >
                  <span v-if="scope.row.status === 0" class="icon-span" style="background-color:#FDBA40;" >{{ $t('eventView.pending') }}</span>
                  <span v-else-if="scope.row.status === 1" class="icon-span" style="background-color:#434C5E;" >{{ $t('eventView.handled') }}</span>
                  <span v-else-if="scope.row.status === 2" class="icon-span" style="background-color:#6097F3;" >{{ $t('eventView.closed') }}</span>
                  <span v-else-if="scope.row.status === 3" class="icon-span" style="background-color:#FDBA40;" >{{ $t('eventView.returnStatus') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('eventView.name')"
                :class-name = "selfClassName"
                prop="subject"
                min-width="220"
                sortable="custom"
                align="left"
              >
                <template slot-scope="scope">
                  <img v-if="scope.row.sourceType === 0" :src="videoSrc" class="sourceType-icon">
                  <img v-else-if="scope.row.sourceType === 1" :src="inspectSrc" class="sourceType-icon">
                  <img v-else :src="insiteInspectSrc" class="sourceType-icon">
                  <span class="event-subject">{{ scope.row.subject }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('eventView.stores')" prop="storeName" align="left" min-width="160" sortable="custom"/>
              <el-table-column :label="$t('overview.patrolLists')" prop="inspectTagName" align="left" min-width="160" sortable="custom"/>
              <el-table-column :label="$t('eventView.enclosure')" align="left" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.attachment.length!==0">
                    <img v-for="(item,index) in scope.row.attachment" :key="index" :src="item.url" class="sourceType-icon">
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('eventView.submitter')" prop="assignerName" align="left" width="120" sortable="custom"/>
              <el-table-column :label="$t('eventView.submitTime')" prop="ts" align="left" width="140" sortable="custom"/>
              <el-table-column
                :label="$t('eventView.operation')"
                prop="option"
                min-width="80"
                align="left">
                <template slot-scope="scope">
                  <i class="iconfont icon-gengduo" @click="toEventDetail(scope.row)"/>
                </template>
              </el-table-column>
              <div slot="empty">
                <div>
                  <i class="iconfont icon-zhengque empty-data-icon"/>
                  <span :style="{'margin-left':'20px','font-size':'16px','color':'#7d8cad'}">{{ $t('eventView.noEvents') }}</span>
                </div>
              </div>
            </el-table>
          </div>
          <div class="toolbar pagination clearfix" style="width:100%; margin:10px 15px 0px 0px;height:13%;">
            <el-pagination
              :page-sizes="[10, 20, 50, 100]"
              :current-page="item.page"
              :page-size="item.sizeNum"
              :total="item.total"
              background
              small
              layout="jumper,total, prev, pager, next,sizes"
              style="float:right;margin-top:10px;margin-bottom:10px;margin-right: 10px;"
              @size-change="sizeChange"
              @current-change="currentChange"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import util from '../../common/util.js';
import { eventRESTful } from '@/api/index';
import { getCookie } from '@/common/auth';
import { isLoginIn } from '@/api/login';
import { mapGetters } from 'vuex';
import { getBriefStoreList, GetTagList } from '@/api/store';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import LimitSelect from '@/components/LimitSelect';

export default {
  name: 'ExceptEvent',
  components: {
    LimitSelect,
    MultiSelect,
    RegionMultiSelect
  },

  data() {
    return {
      curCountry: '',
      CountryList: [],
      StoreTagList: [],
      curStoreTag: [],
      curProvince: [],
      curStore: [],
      curCity: [],
      provinceList: [],
      cityList: [],
      storeDataList: [],
      storeStr: '',
      dateValue: [],
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        }
      },
      toolTipClass: 'page-login-toolTipClass',
      states: [
        { value: 0, label: this.$t('eventView.pending'), disabled: false },
        { value: 1, label: this.$t('eventView.handled'), disabled: false },
        { value: 2, label: this.$t('eventView.closed'), disabled: false },
        { value: 3, label: this.$t('eventView.returnStatus'), disabled: false }
      ],
      curState: null,
      value: 0,
      serachVale: '',
      serachData: '',
      tableDataList: [
        {
          label: this.$t('eventView.pendingEve'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.ProcessedEvent'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.ClosedEvent'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.ReturnEvent'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        },
        {
          label: this.$t('eventView.allEvents'),
          eventCount: 0,
          tableData: [],
          total: 0,
          sizeNum: 10,
          page: 1
        }
      ],
      activeName: '0',
      videoSrc: require('../../../static/img/monitor.png'),
      inspectSrc: require('../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../static/img/onsite_patrol.png'),
      attachmentVideo: require('../../../static/img/video.png'),
      attachmentImg: require('../../../static/img/photo.png'),
      attachmentAudio: require('../../../static/img/audio.png'),
      event,
      total: 0,
      page: 1,
      sizeNum: 10,
      params: {},
      fileName: '数据详情' + '.xlsx',
      exportDataList: [],
      exportDataHeader: [
        this.$t('eventView.name'),
        this.$t('eventView.stores'),
        this.$t('overview.patrolLists'),
        this.$t('eventView.submitter'),
        this.$t('eventView.submitTime')],
      windowHeight: window.innerHeight,
      userId: '',
      poperClass: 'date-picker-poper',
      selectpoperClass: 'select-poper',
      defaultTime: [],
      lang: this.$i18n.locale,
      isFirstLoad: false,
      order: '',
      ifChangeAccount: false,
      numberOfElements: 0,
      totalElements: 0,
      sortColumnOfTab: [
        { tabIndex: 0, sortType: { prop: '', order: '' }},
        { tabIndex: 1, sortType: { prop: '', order: '' }},
        { tabIndex: 2, sortType: { prop: '', order: '' }},
        { tabIndex: 3, sortType: { prop: '', order: '' }},
        { tabIndex: 4, sortType: { prop: '', order: '' }}
      ],
      exportPng: require('../../../static/img/excel.png'),
      selfClassName: 'self-class-name'
    };
  },

  computed: {
    tableHieght() {
      if (this.windowHeight > 800) {
        return this.windowHeight * 0.85;
      } else if (this.windowHeight > 700) {
        return this.windowHeight * 0.58;
      } else {
        return this.windowHeight * 0.7;
      }
    },

    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      let self = this;
      if (val !== 0) {
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        },
        300);
        self.ifChangeAccount = true;
      }
    },

    numberOfElements(val) {
      let self = this;
      if (val === 0 && self.totalElements > 0) {
        self.params.filter.page -= 1;
        self.getEventList();
      }
    }
  },

  created() {
    this.isFirstLoad = true;
  },

  async mounted() {
    let self = this;
    self.userId = getCookie('UserId');
    self.getDeafultTime();
    let windowHeight = window.innerHeight;
    if (windowHeight > 800) {
      self.tableHeight = 770 + 'px';
    }
  },

  activated() {
    let self = this;
    self.windowHeight = window.innerHeight;
    if (!self.$route.meta.isBack || self.isFirstLoad) {
      self.initData();
    } else {
      self.getEventList('Back');
      self.getEventCount();
    }
    self.$route.meta.isBack = false;
    self.isFirstLoad = false;
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
            let data = res.data;
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getCountryStore() {
      let self = this;
      let data = await self.getBriefStoreData();
      let temp = [];
      if (data.errCode === 0 && data.errMsg === 'Success') {
        self.tempStoreData = data.data;
        if (self.tempStoreData.length !== 0) {
          self.tempStoreData.forEach(item => {
            let country = item.country;
            if (temp.map(x => x.label).indexOf(country) === -1) {
              let obj = {
                value: country,
                label: country
              };
              temp.push(obj);
            }
          });
        }
        let countryList = temp;
        self.CountryList[0] = {};
        self.CountryList[0].label = self.$t('remotePatrol.country');
        self.CountryList[0].countryList = countryList;
        self.CountryList[0].countryList.unshift({ value: '-1', label: self.$t('remotePatrol.all') });
        self.curCountry = countryList[0].value;
        self.selectAllProAndCity(self.curCountry);
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
      self.curStore = storeArr;
      self.curState = [0];
      self.changeStore(self.curStore);
    },

    changeStoreTag(val) {
      let self = this;
      self.curStoreTag = val;
      self.changeStore(self.curStore);
    },

    changeCountry(val) {
      let self = this;
      self.clearProviceInfo();
      self.clearCityInfo();
      self.clearStoreInfo();
      self.selectAllProAndCity(val);
    },

    changePro(val) {
      let self = this;
      self.curCity = [];
      self.clearCityInfo();
      self.clearStoreInfo();
      let storeList = self.tempStoreData;
      let temp = [];
      let tempStore = [];
      if (val === '') {
        storeList.forEach(item => {
          if (item.country === self.curCountry) {
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
      } else {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.province === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                let obj = {
                  label: item.city,
                  value: item.city
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
        });
        self.cityList = temp;
        let cityArr = [];
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
      let self = this;
      self.clearStoreInfo();
      let storeList = self.tempStoreData;
      let temp = [];
      if (val.length !== 0) {
        val.forEach(_item => {
          storeList.forEach(item => {
            if (item.city === _item) {
              if (temp.map(x => x.value).indexOf(item.city) === -1) {
                let obj = {
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

    handleStateChange(val) {
      let self = this;
      self.curState = val;
      self.searchData();
    },

    handleStoreChange(arr) {
      let self = this;
      self.curStore = arr;
      self.changeStore(arr);
    },

    handleProChange(arr) {
      let self = this;
      self.curProvince = arr;
      self.changePro(arr);
    },

    handleCityChange(arr) {
      let self = this;
      self.curCity = arr;
      self.changeCity(arr);
    },

    clearStoreInfo() {
      let self = this;
      self.curStore = [];
      self.storeStr = '';
      self.$refs.multiSelect.selectedArray = [];
      self.$refs.multiSelect.input = '';
    },

    clearProviceInfo() {
      let self = this;
      self.curProvince = [];
      self.$refs.proviceSelect.selectedArray = [];
      self.$refs.proviceSelect.input = '';
    },

    clearCityInfo() {
      let self = this;
      self.curCity = [];
      self.$refs.citySelect.selectedArray = [];
      self.$refs.citySelect.input = '';
    },

    changeStore(val) {
      let self = this;
      let str = '';
      val.forEach(selectedItem => {
        self.tempStoreData.forEach((storeItem) => {
          self.getSelectedStoreString(selectedItem, storeItem);
        });
      });
    },

    getSelectedStoreString(selectedItem, storeItem){
      let self = this;
      let str = '';
      if (storeItem.storeId === selectedItem) {
        self.curStoreTag.length !== 0 ? self.curStoreTag.forEach(v_item => {
          storeItem.tagIds.forEach(t_item => {
            if ((t_item === v_item && self.curCountry === storeItem.country) || (t_item === v_item && self.curCountry === '-1')) {
              str += selectedItem + '，';
            }
          });
        }) : (storeItem.storeId === selectedItem ? str += selectedItem + '，' : null);
      }
      str = str.substr(0, str.length - 1);
      self.storeStr = str;
      self.searchEventList();
    },

    dateChange(val){
        let self=this;
        let tabIndex=Number(self.activeName);
        let start=typeof(val[0])==='object'?val[0].getTime():val[0];
        let end=typeof(val[1])==='object'?val[1].getTime():val[1];
        let threeMonthAgo = util.getThreeMonths(end)
        if(end-start>end-threeMonthAgo){
            self.$message({
                message: this.$t('eventView.changeTimeRange'),
                type:'warning',
                duration:3*1000
            })
            self.dateValue=[new Date().setTime(threeMonthAgo),new Date().setTime(end)];
        }
        else{
          self.dateValue = [new Date().setTime(start),new Date().setTime(end)]
        }
        self.serachVale=''
        self.tableDataList[tabIndex].page=1;
        self.getEventList(0);
        self.getEventCount();
    },

    handleTabClick(val) {
      let self = this;
      if (Number(val.index) < 4) {
        self.curState = [Number(val.index)];
      } else {
        let stateArr = [];
        self.states.forEach(item => {
          stateArr.push(item.value);
        });
        self.curState = stateArr;
        self.curState.unshift('-1');
      }
      self.getEventList();
    },

    searchEventList() {
      let self = this;
      self.serachVale = '';
      self.tableDataList[Number(self.activeName)].page = 1;
      self.getEventList();
      self.getEventCount();
    },

    searchData() {
      let self = this;
      self.tableDataList[Number(self.activeName)].page = 1;
      self.getEventList();
      self.getEventCount();
    },

    rowClickItem(row) {
      let self = this;
      this.event = row;
      sessionStorage.setItem('event', JSON.stringify(this.event));
      sessionStorage.setItem('queryparams', JSON.stringify(self.params));
      this.$router.push({ name: 'eventDetails', params: { event: this.event }});
    },

    toEventDetail(row) {
      let self = this;
      this.event = row;
      sessionStorage.setItem('event', JSON.stringify(this.event));
      sessionStorage.setItem('queryparams', JSON.stringify(self.params));
      this.$router.push({ name: 'eventDetails', params: { event: this.event }});
    },

    sortChange(col) {
      let self = this;
      let tabIndex = Number(self.activeName);
      self.tableDataList[tabIndex].page = 1;
      let order = col.order;
      self.order = order;
      let prop = '';
      let tempOrder = '';
      if (order === 'ascending') {
        self.params.order = {
          'direction': 'asc',
          'property': col.column.property
        };
        prop = col.column.property;
        tempOrder = 'asc';
      } else if (order === 'descending') {
        self.params.order = {
          'direction': 'desc',
          'property': col.column.property
        };
        prop = col.column.property;
        tempOrder = 'desc';
      } else {
        self.params.order = {};
      }
      self.sortColumnOfTab[tabIndex].sortType.prop = prop;
      self.sortColumnOfTab[tabIndex].sortType.order = tempOrder;
      self.getEventList();
    },

    async getEventList(val) {
      let self = this;
      let tabIndex = Number(this.activeName);
      self.getEventListRequestParams(val);
      eventRESTful.getEventList(self.params).then((res) => {
        let data = res.data.content;
        let temp = [];
        data.forEach(item => {
          let attachment = [];
          if (item.initialComment.attachment.length !== 0) {
            item.initialComment.attachment.some(x => x.mediaType === 0) ? attachment.push({ url: self.attachmentAudio }) : '';
            item.initialComment.attachment.some(x => x.mediaType === 1) ? attachment.push({ url: self.attachmentVideo }) : '';
            item.initialComment.attachment.some(x => x.mediaType === 2) ? attachment.push({ url: self.attachmentImg }) : '';
          }
          let obj = {
            id: item.id,
            ts: util.getDateTime(item.ts),
            assignee: item.assignee,
            assignerName: item.assignerName,
            assigneeName: item.assigneeName,
            deviceId: item.deviceId,
            status: item.status,
            storeId: item.storeId,
            storeName: item.storeName,
            inspectTagName: item.inspectTagName,
            subject: item.subject,
            score: item.score,
            sourceType: item.sourceType,
            attachment: attachment,
            initialComment: item.initialComment,
            relatedDeviceIds: item.relatedDeviceIds
          };
          temp.push(obj);
        });
        self.tableDataList[tabIndex].tableData = temp;
        self.tableDataList[tabIndex].total = res.data.totalElements;
        self.tableDataList[tabIndex].eventCount = res.data.totalElements;
        self.totalElements = res.data.totalElements;
        self.numberOfElements = res.data.numberOfElements;
      }).catch(err => {
        console.log('EventManagement-getEventList:' + err);
      });
    },

    getEventListRequestParams(val){
      let tabIndex = Number(this.activeName);
      let like = {};
      if (this.serachVale.trim().length !== 0) {
        like = { subject: this.serachVale.trim(), assignerName: this.serachVale.trim(), storeName: this.serachVale.trim() };
      } else {
        like = {};
      }
      let storeId = this.storeStr.split('，');
      let status = [];
      if (this.curState.length !== 0) {
        if (this.curState.length === 1) {
          status = this.curState[0];
        } else {
          let allStatus = this.curState.some(item => item === '-1');
          if (allStatus) {
            status = [0, 1, 2, 3];
          } else {
            status = this.curState;
          }
        }
      } else {
        status = -1;
      }
      let page = 0;
      if (val === 'currentChange') {
        page = this.tableDataList[tabIndex].page - 1;
      }
      if (val === 'Back') {
        page = this.params.filter.page;
      }
      let start = '', end = '';
      if (val === 0) {
        start = typeof (this.dateValue[0]) === 'object' ? this.dateValue[0].getTime() : this.dateValue[0];
        end = typeof (this.dateValue[1]) === 'object' ? this.dateValue[1].getTime() : this.dateValue[1];
      } else {
        start = this.dateValue[0];
        let endTime = this.dateValue[1];
        end = endTime.constructor === Date ? new Date(endTime).getTime() : endTime;
      }
      this.params = {
        beginTs: start,
        endTs: end,
        clause: {
          status: status,
          storeId: storeId
        },
        filter: {
          page: page,
          size: this.tableDataList[tabIndex].sizeNum
        },
        like: like
      };
      let curTabSortColumn = this.sortColumnOfTab[tabIndex];
      let order = curTabSortColumn.sortType.order;
      let prop = curTabSortColumn.sortType.prop;
      if (order.length > 0 && prop.length > 0) {
        this.params.order = {
          direction: order,
          property: prop
        };
      } else {
        this.params.order = {
          direction: 'desc',
          property: 'ts'
        };
      }
    },

    sizeChange(val) {
      let self = this;
      self.tableDataList[Number(self.activeName)].sizeNum = val;
      self.tableDataList[Number(self.activeName)].page = 1;
      self.getEventList();
    },

    currentChange(val) {
      let self = this;
      self.tableDataList[Number(self.activeName)].page = val;
      self.getEventList('currentChange');

      let dom = document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0];
      let offestTop = dom.offsetTop;
      if (dom != undefined) {
        document.getElementsByClassName('el-table__body-wrapper is-scrolling-none')[0].scrollTop = 0;
      }
    },

    getEventCount() {
      let self = this;
      let start = self.dateValue[0];
      let endTime = self.dateValue[1];
      let end = endTime.constructor === Date ? new Date(endTime).getTime() : endTime;
      let storeId = self.storeStr.split('，');
      let like = {};
      if (self.serachVale.trim().length !== 0) {
        like = { subject: self.serachVale.trim(), assignerName: self.serachVale.trim(), storeName: self.serachVale.trim() };
      } else {
        like = {};
      }
      let params = {
        beginTs: start,
        endTs: end,
        clause: {
          storeId: storeId
        },
        like: like
      };
      eventRESTful.GetEventCountByStatus(params).then(res => {
        let data = res.data;
        let numOfEventTotal = 0;
        for (let i = 0; i < 4; i++) {
          self.tableDataList[i].eventCount = data[i].numOfEvent;
          numOfEventTotal += data[i].numOfEvent;
        }
        self.tableDataList[4].eventCount = numOfEventTotal;
      }).catch(err => {
        console.log('EventManagement-getEventCount:' + err);
      });
    },

    getExportDataSize() {
      let self = this;
      let params = self.params;
      params.filter = {};
      return new Promise((resolve, reject) => {
        eventRESTful.getEventList(params).then((res) => {
          let size = res.data.totalElements;
          resolve(size);
        }).catch((error) => {
            reject(error);
        });
      });
    },

    async getExportData() {
      let self = this;
      let size = await self.getExportDataSize();
      self.params.filter = {
        'page': 0,
        'size': size
      };
      return new Promise((resolve, reject) => {
        eventRESTful.getEventList(self.params).then((res) => {
          let data = res.data.content;
          let temp = [];
          data.forEach(item => {
            let obj = {};
            obj.subject = item.subject;
            obj.storeName = item.storeName;
            obj.inspectTagName = item.inspectTagName;
            obj.assignerName = item.assignerName;
            obj.ts = util.getDateTime(item.ts);
            temp.push(obj);
          });
          resolve(temp);
        }).catch(err => {
          console.log('EventMangement-getExportData:' + err);
        });
      });
    },

    getExportFileName() {
      let self = this;
      let tabIndex = Number(self.activeName);
      let label = '';
      switch (tabIndex) {
        case 0: label = this.$t('eventView.pendingEve'); break;
        case 1: label = this.$t('eventView.ProcessedEvent'); break;
        case 2: label = this.$t('eventView.ClosedEvent'); break;
        case 3: label = this.$t('eventView.ReturnEvent'); break;
        case 4: label = this.$t('eventView.allEvents'); break;
        default: console.error('error tab pages！'); break;
      }
      let fileName = label + '-' + util.getCurDateStr();
      return fileName;
    },

    async export2Excel() {
      let that = this;
      try {
        let ret = await that.isLoginIn();
        if (ret.data != undefined && ret.data.isLogin) {
          let tabIndex = Number(that.activeName);
          if (that.tableDataList[tabIndex].tableData.length === 0) {
            that.$message({
              message: this.$t('eventView.noEvents'),
              type: 'warning',
              duration: 3 * 1000
            });
            return false;
          }
          require.ensure([], async() => {
            let { export_json_to_excel } = require('@/excel/Export2Excel');
            let tHeader = that.exportDataHeader;
            let filterVal = ['subject', 'storeName', 'inspectTagName', 'assignerName', 'ts'];
            let curData = await that.getExportData();
            let data = that.formatJson(filterVal, curData);
            export_json_to_excel(tHeader, data, that.getExportFileName());
          });
        } else {
          window.location.href = 'https://portals.storeviu.com';
        }
      }catch (err) {
        console.log("EventManagement-export2Excel" + err);
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    getDeafultTime() {
      let self = this;
      let date = new Date();
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      let dateStr = hour + ':' + minutes + ':' + second;
      let timeTemp = [];
      timeTemp[0] = '00:00:00';
      timeTemp[1] = dateStr;
      self.defaultTime = timeTemp;
    },

    isLoginIn() {
      let self = this;
      return new Promise((resolve, reject) => {
        isLoginIn().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    initData() {
      let self = this;
      self.activeName = '0';
      self.dateValue = [new Date(new Date().toLocaleDateString()).getTime()-3600 * 1000 * 24,new Date()];
      self.serachVale = '';
      self.total = 0;
      self.page = 1;
      self.sizeNum = 10;
      self.params = {};
      self.getDeafultTime();
      let windowHeight = window.innerHeight;
      if (windowHeight > 800) {
        self.tableHeight = 770 + 'px';
      }
      try {
        self.getCountryStore();
        self.getTagListData();
      }
      catch (err) {
        console.log("EventMangement-initData: " + err)
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true;
    if (from.name === 'eventDetails' && to.name === 'eventManage') {
      to.meta.isBack = true;
      next();
    } else {
      to.meta.isBack = false;
      next();
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.name !== 'eventDetails') {
      from.meta.keepAlive = false;
      next();
    } else {
      from.meta.keepAlive = true;
      next();
    }
  }

};
</script>

<style lang="scss" scoped>
@import '../../assets/css/textstyle.css';
@import '../../assets/css/importfile.css';
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
.el-event-content{
    width: 100%;
    position: relative;
    border: 1px solid #e3e9f4;
    /*overflow: hidden;*/
    .sourceType-icon{
        margin-right: calc(20/1920*100vw);
        // position: relative;
        float: left;
        //@include point(bottom,2);
        height: 28px;
        width: 24px;
    }
    .icon-span{
        display:inline-block;
        width:60px;
        height:22px;
        color:white;
        font-size: 12px;
    }
    .icon-gengduo{
      font-size: calc(24/1920*100vw);
      vertical-align: middle;
      cursor: pointer;
      color: #7d8cad;
    }
    .el-event-header{
        text-align: left;
        position: relative;
        background-color: #fff;
        border-bottom: 1px solid #e3e9f4;
        padding: 30px 20px 30px 30px;
        font-size: 14px;
        color: $black;
        .el-area{
            // position: relative;
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
            .el-search{
                // position:absolute;
                // right: 0px;
                float:right;
                @include point(margin-right,20);
                @include point(width,160);
            }
        }
        .el-date /deep/ .el-select-dropdown__item{
            padding: 0 20px 0 50px !important;
            /*color: #7d8cad;*/
        }
        .el-date /deep/ .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
            font-family: "iconfont" !important;
            content: '\e6a2';
            left: 20px;
            font-size: 14px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .el-date /deep/ .el-select-dropdown.is-multiple .el-select-dropdown__item::after{
            font-family: "iconfont" !important;
            position: absolute;
            left: 20px;
            content: "\e64a";
            font-weight: 700;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            font-style: normal;
            -moz-osx-font-smoothing: grayscale;
        }
        .el-date{
            margin-top: 20px;
            text-align: left;
            // position: relative;
            .date-title{
                margin-right:20px;
            }
            .iconbangzhu{
                margin-left:10px;
                font-size: calc(20/1920*100vw);
                position:relative;
                top:2px;
                color:$tab;
            }
            .date-range{
                width:290px;
            }
        }
        .store-handle{
            height: 30px;
            line-height: calc(30/1920*100vw);
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
    .dialog-footer{
        @include point(margin-top,20);
        .file-content-btn{
            position: relative;
            left: 60%;
        }
    }
    .el-table-content{
        width: 100%;
        background-color: #fff;
        position: relative;
        padding-top: calc(30/1920*100vw);
        .export-btn{
            position: absolute;
            @include point(right,20);
            //background-color: $red;
            border-color: $red;
            z-index: 990;
            height: calc(36/1920*100vw);
            width: calc(130/1920*100vw);
            margin: 0;
            padding: 0;
            font-size: calc(14/1920*100vw);
            line-height: calc(36/1920*100vw);
            color: #ffffff;
            border-width: 0;
            border-radius: 4px;
            top: calc(24/1920*100vw);
            .btn-area{
              padding: 0 calc(6/1920*100vw);
              height: calc(36/1920*100vw);
              display: flex;
              align-items: center;
              justify-content: center;
              .icon-excel{
                margin-right: calc(18/1920*100vw);
                font-size: calc(24/1920*100vw);
                height: calc(24/1920*100vw);
                width: calc(24/1920*100vw);
              }
              .spanClass{
                font-size: calc(14/1920*100vw);
                display: inline-block;
              }
            }
        }
      .en-export-btn{
        position: absolute;
        @include point(right,20);
        //background-color: $red;
        border-color: $red;
        z-index: 990;
        height: calc(36/1920*100vw);
        margin: 0;
        padding: 0;
        font-size: calc(14/1920*100vw);
        line-height: calc(36/1920*100vw);
        color: #ffffff;
        border-width: 0;
        border-radius: 4px;
        width: calc(160/1920*100vw);
        min-width: 120px;
        .btn-area{
          position: relative;
          padding: 0 calc(6/1920*100vw);
          height: calc(36/1920*100vw);
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-excel{
            margin-right: calc(18/1920*100vw);
            width: calc(24/1920*100vw);
            height: calc(24/1920*100vw);
          }
          .spanClass{
            font-size: calc(14/1920*100vw);
            display: inline-block;
          }
        }
      }
      .table-content{
            width:100%;
            text-align: center;
            /*height:300px;*/
            /*float:left;*/
          &.el-table{
            font-size: calc(14/1920*100vw);
          }
        }
    }
    #tabs-content /deep/ .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: 160px;
    }
    #tabs-content /deep/  .el-tabs__nav-scroll{
      margin-left:40px;
    }
    #tabs-content  /deep/ .el-tabs__active-bar{
      height: 4px;
    }
  .el-table-panel{
    @include point(margin-left,15);
    @include point(margin-right,15);
  }
  .clearfix{
    content: "";
    display: block;
    height: 0;
    clear:both;
    overflow: auto;
  }
}
.el-select-content{
    //@include point(width,120);
}
.empty-data-icon{
    @include point(font-size,22);
    color: #53c247;
}
#dateinput{
    width: calc(300/1920*100vw);
    height: calc(24/1920*100vw);
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding-left: 30px;
    font-size: 12px;
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
        background: #F4F5F9 !important;
        /*border-radius: 0px !important;*/
        /*border: 0 !important;*/
    }
</style>
<style>
 @import '../../assets/css/pagination.css';
 @import '../../assets/css/tabsItem.css';
    .layui-laydate .layui-this{
        background-color:#f31d65 !important;
    }
    .el-table::before{
        height: 0px !important;
    }
    .el-search .el-input__inner{
        background: #f0f5f8 !important;
        border-radius: 15px !important;
    }
    .page-login-toolTipClass.el-tooltip__popper.is-light{
        background: #FEE4E7 !important;
        color: #f31d65 !important;
        border: 1px solid #f31d65 !important;
    }
    .date-picker-poper .el-button--text{
        visibility: hidden !important;
    }
     .select-poper .el-select-dropdown__item.hover{
        background-color:#FEE4E7;
    }
   .self-class-name  /deep/ .cell{
     display: flex ;
     align-items: center;
   }
</style>

