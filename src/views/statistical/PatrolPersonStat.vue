<template>
  <div>
    <el-row  class="statistics-container">
      <el-col :span="24">
        <div class="statistics-header">
          <div class="search-bar">
            <date-time-selector class="time-selector" @change="dateChange"/>
            <div class="person-title">
              <span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('statistics.patrolPerson.insPerson') }}</span>
               <div class="date-range">
                <region-multi-select
                  ref="multiState"
                  :selected="positionIds"
                  :options="positionsList"
                  :all="$t('statistics.patrolPerson.dutyAll')"
                  class="position"
                  @changeInput="handlePositionsChange"/>
                <div style="width:0px;height:25px;border:1px solid #556679; opacity:0.2;" />
                <region-multi-select
                  ref="multiState"
                  :selected="userIds"
                  :all="$t('overview.allUser')"
                  :placeholder="$t('overview.user')"
                  :options="userList"
                  class="person"
                  @changeInput="handleUserChange"/>
                </div>
            </div>
            <delay-button
              class="search-button"
              type="primary"
              size="mini"
              @click="doSearchInsRecordList"
            >
              <span>{{ $t('remotePatrol.search') }}</span>
            </delay-button>
          </div>
        </div>
      </el-col>
      <el-col :span="24" class="statistics-content" style="height: 785px;">
        <div class="head">
          <div class="title">{{ $t('statistics.patrolPerson.insRecordList') }}</div>
          <div class="operation-btns">
            <delay-button
                :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                style="background-color:#FFF;color:#006ab7;"
                type="primary"
                size="mini"
                @click="export2Excel"
            >
              <div class="button-area">
                <img :src="exportPng" class="icon-excel">
                  <span>{{ $t('eventView.exportReport') }}</span>
              </div>
            </delay-button>
          </div>
        </div>
        
        <div class="event-table">
        <table-pagination
          ref="elTP"
          :column-data="insRecordColData"
          :table-data="insRecordTableData"
          :total="total"
          :highlight-current-row= "true"
          :pagesize="sizeNum"
          :current-page="page"
          :is-event = "false"
          :default-sort = "defaultSort"
          :allowRowExpand = "true"
          expand-component = "TabInceptionDetail"
          :expandCompProperties = "componentsProps"
          @handleChange="handlePageAndSizeChange"
          @sortChange="handleSortChange"
        />
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import { mapGetters } from 'vuex';
import util from '@/common/util.js';
import filterString from '@/common/filterString';
import resize from '@/components/mixins/echartResize';

import {
  getInspectStatsOverPersonV3
} from '@/api/inspectOverview';
import TablePagination from '@/components/TablePagination_V2';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import DateTimeSelector from '@/components/DateTimeSelector';
import { getBrifCheckinList, getCheckinReport, getDepartmentList } from '@/api/checkin';
import { titleRESTful } from '@/api/index';
import { getUserInfo } from '@/api/login';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import MultiSelect from '@/components/MultiSelect2';
import TabInceptionDetail from '@/components/TabInceptionDetail'
export default {
  name: 'PatrolPersonStat',

  components: {
    DialogPop,
    DelayButton,
    TablePagination,
    'v-chart': ECharts,
    DateTimeSelector,
    RegionMultiSelect,
    TabInceptionDetail
  },
  mixins: [resize],
  data() {
    return {
      lang: this.$i18n.locale,
      dateValue: [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()],
      params: {},
      page: 1,
      sizeNum: 10,
      total: 0,
      order: {
        direction: 'asc',
        property: 'numOfTotal'
      },
      userPosition:[],
      origianlUserList:[],
      userIds: [],
      userList: [],
      origianlUserList: [],
      positionIds: [],
      positionsList: [],
      exportPng: require('../../../static/img/excel.png'),
      defaultSort: { prop: 'numOfTotal', order: 'ascending' },
      allInsRecordData:[],
      insRecordTableData:[],
      insRecordColData:[
        {
          'prop': 'supervisorName',
          'label': this.$t('statistics.patrolPerson.supervisorName'),
          'sortable': false,
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '11%',
          'isExpand': false
        },
        {
          'prop': 'departs',
          'label': this.$t('statistics.patrolPerson.department'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%',
          'isExpand':false
        },
        {
          'prop': 'numOfStores',
          'label': this.$t('statistics.patrolPerson.numOfStores'),
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%',
          'isExpand':false
        },
        {
          'prop': 'numOfTotal',
          'label': this.$t('statistics.patrolPerson.numOfTotal'),
          'sortable': 'custom',
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%',
          'isExpand':false
        },
        {
          'prop': 'numOfStoresNotPatrolled',
          'label': this.$t('statistics.patrolPerson.numOfStoresNotPatrolled'),
          'sortable': 'custom',
          'width': '140',
          'maxWidth': '140',
          'pdfwidth': '11%',
          'isExpand':false
        },
        /*{
          'prop': 'numOfTasked',
          'label': this.$t('statistics.patrolPerson.numOfTasked'),
          'sortable': false,
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '12%',
          'isExpand':false
        },
        {
          'prop': 'completionRate',
          'label': this.$t('statistics.patrolPerson.completionRate'),
          'sortable': false,
          'width': '140',
          'maxWidth': '150',
          'pdfwidth': '12%',
          'isExpand':false
        },*/
        {
          'prop': 'processedRate',
          'label': this.$t('statistics.patrolPerson.processedRate'),
          'sortable': 'custom',
          'width': '145',
          'maxWidth': '180',
          'pdfwidth': '12%',
          'isExpand':false
        },
        {
          'prop': 'detail',
          'label': this.$t('statistics.patrolPerson.detail'),
          'sortable': false,
          'width': '100',
          'maxWidth': '180',
          'pdfwidth': '12%',
          'isExpand':true
        }
      ],
      componentsProps:{beginTs:this.$moment().subtract(29, 'days').startOf('d').toDate(),endTs: this.$moment().endOf('d').toDate()}
    }
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
        await self.initData();
        self.curStoreTag = [];
      }
    },

  },

  created() {
    this.initData();
    this.getSearchCondition();
  },

  methods: {
    async initData() {
      this.params.filter = { page: this.page - 1, size: this.sizeNum };
      this.params.order = this.order;
      this.doSearchInsRecordList();
    },
    dateChange(val) {
      this.dateValue = val;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      const daysDiff = this.$moment(end).diff(start, 'days');
      this.timeMode = daysDiff <= 30 ? 1 : 2;
      this.params.beginTs = start;
      this.params.endTs = end;
      //this.daysRangeList = util.getDaysRangeList(start, end, this.timeMode);
    },
    async getSearchCondition() {
      const userPosition = getDepartmentList({ type: 1 }); //取得職務
      const userPromise = getUserInfo();
      //const titlePromise = titleRESTful.getUserTitleList();
      try {
        const result = await Promise.all([userPosition, userPromise]);
        this.getUserList(result[1].data);
        //this.getTitleList(result[2].data);
        this.getUserPositionList(result[0].data);
        //this.searchCheckInList();
      } catch (e) {
        console.log(e);
      }
    },

    getUserPositionList(data) {
      this.positionsList = [];
      const userIdList = [];
      data.map(department => {
        const departmentJson = {};
        departmentJson.label = department.defineName;
        departmentJson.value = department.defineId;
        departmentJson.contents = department.contents;
        userIdList.push(department.contents);
        this.positionsList.push(departmentJson);
      });
      const userList = this.origianlUserList.map(user => user.value);
      const filterUser = util.getDiffBetweenArrays(userIdList, userList);
      this.roleId === 1 && this.userPosition.push({
        label: this.$t('titleView.others'),
        value: '00',
        content: filterUser
      });
      this.positionIds = this.ifCachedParams ? this.departmentIds : this.positionsList.map(depart => depart.value);
    },

    getUserList(data) {
      this.userList = [];
      this.origianlUserList = [];
      data.map(user => {
        const userJson = {};
        userJson.label = user.userName;
        userJson.value = user.userId;
        userJson.title = user.title;
        this.origianlUserList.push(userJson);
        this.userList.push(userJson);
      });
      this.userIds = this.ifCachedParams ? this.userIds : this.userList.map(user => user.value);
    },

    getTitleList(data) {
      data.map(title => {
        const titleJson = {};
        titleJson.label = title.title;
        titleJson.value = title.titleId;
        this.positionsList.push(titleJson);
      });
      this.positionIds = this.ifCachedParams ? this.positionIds : this.positionsList.map(position => position.value);
    },
    handlePositionsChange(positionIds) {
      this.positionIds = positionIds;
      this.filterUserIds();
    },

    filterUserIds() {
      const filterDepart = this.positionsList.filter(position => this.positionIds.includes(position.value));
      console.log("filterDepart:",filterDepart);
      const departUserId = filterDepart.map(user => user.contents).flat();
      console.log("departUserId:",departUserId);
      this.userList = this.origianlUserList.filter(item => {
        return departUserId.includes(item.value);
      });
      this.userIds = this.userList.map(user => user.value);
    },

    handleUserChange(userIds) {
      this.userIds = userIds;
      this.params.submitters = userIds;
    },

    /*** 取得巡檢人員紀錄***/
    export2Excel() {
      const that = this;
      if (that.insRecordTableData.length === 0) {
        util.notify(that.$t('statistics.emptyInsRecordList'), 'warning', 3000);
        return false;
      }
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader=[];
        const filterVal = [];
        this.insRecordColData.map(item=>{
          if(item.prop!='detail'){
            tHeader.push(item.label);
            filterVal.push(item.prop);
          }
        })
        const curData = that.insRecordTableData;
        const data = that.formatJson(filterVal, curData);
        const fileName = 'Inspection record_' +  util.getCurDateStr();
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    async doSearchInsRecordList(){
      const start = typeof (this.dateValue[0]) === 'object' ? this.dateValue[0].getTime() : this.dateValue[0];
      const end = typeof (this.dateValue[1]) === 'object' ? this.dateValue[1].getTime() : this.dateValue[1];
      this.componentsProps =  {beginTs:start,endTs:end};
      //const daysDiff = this.$moment(end).diff(start, 'days');
      //this.timeMode = daysDiff <= 30 ? 1 : 2;
      /*this.params.beginTs = start;
      this.params.endTs = end;
      this.params.submitters = this.userIds;*/
      this.allInsRecordData = [];
      let param = {beginTs:start,endTs:end,submitters:this.userIds};
      
      //console.log("doSearchInsRecordList > params:",this.params);
      let record = await this.getInspectStatsPersonInfo(param);
      this.allInsRecordData = record.data.content;
      this.total = this.allInsRecordData.length;
      this.doCoverDepartmentToString();
      //console.log("this.total:",this.total);
      //console.log("this.allInsRecordData:",this.allInsRecordData);

      this.setRecordTableData();
    },
    doCoverDepartmentToString(){
      this.allInsRecordData.map(record =>{
        record.id=record.supervisorId;
        record.departs = record.departments.toString();
        record.processedRate = record.processedRate+'%';
      })
    },
    getInspectStatsPersonInfo(params) {
      return new Promise((resolve, reject) => {
        getInspectStatsOverPersonV3(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    handlePageAndSizeChange(pageObj) {
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.setRecordTableData();
    },

    handleSortChange(order, defaultSort) {
      this.defaultSort = { ...defaultSort };
      this.order = this.params.order = order;
      this.params.filter = {
        page: this.page - 1,
        size: this.sizeNum
      };
      this.setRecordTableData();
    },

    setRecordTableData(){
      
      this.orderAllTableData();
      this.insRecordTableData = [];
      this.insRecordTableData = [...this.allInsRecordData.slice( (this.page - 1)* this.sizeNum, this.page* this.sizeNum)];
    },

    orderAllTableData(){
      let key = this.defaultSort.prop;
      key = key.indexOf('Str') > -1 ? key.substr(0, key.indexOf('Str')) : key;
      this.defaultSort.order === 'descending' ? this.allInsRecordData.sort((a,b) => { return b[key] - a[key] })
                                : this.allInsRecordData.sort((a,b) => { return a[key] - b[key] });
    },

  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";

  .statistics-container{
    .statistics-content{
      width:calc(1096/1440*100vw);
      margin-left: calc(36/1440*100vw);
    }
    .search-bar{
      display:flex;
      flex-direction:row;
      margin-left: calc(36/1440*100vw);
      margin-right:32px;
      margin-bottom:24px;
      height:36px;
      justify-content: space-between;
    }
    .head{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 67.5px;
      .title{
        height: 30px;
        font-size: 18px;
        text-align: left;
        color: $black;
      }
      .operation-btns{
        align-self: center;
        display: flex;
        flex-direction: row;
        width:101px;
        height: 30px;
        align-items: center;
        padding:0;
        justify-content: space-between;
      }
    }
      
    .person-title{
      display:flex;
        flex-direction:row;
        width: calc(510/1440*100vw);
        height:36px;
        margin-left:72px;
        font-size: 15px;
        color: #484848;
        justify-content: space-between;
        align-items: center;
        .date-range{
          display:flex;
          flex-direction:row;
          border-radius: 5px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          background-color: #fff;
          width: calc(440/1440*100vw);
          height:36px;
          align-items: center;
        }
        .position{
          display:inline;
          width: calc(217/1440*100vw);
        }
        .person{
          display:inline;
          width: calc(223/1440*100vw);
        }
    }
    
    .search-button{
      margin-left:35px;
      width: 102px;
      height: 36px;
      background-color: #556679;
      border-color: #556679;
      color:#fff;
      font-size: 15px;
    }

    .operation-btns{
      padding-top: 20px;
      padding-right: 0px;
      float: right;
    }

    .event-table {
          overflow-y: auto;
          height: 717.5px;
          background-color: fff;
          padding-top: 16.5px;
          padding: 16.5 24px ;
          .table{
            margin: 0 calc(24/1920*100vw);
            background-color: #f7f9fa;
            box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
            border: solid 1px #f5f5f5;
          }
          .clearfix{
            content: "";
            display: block;
            height: 0;
            clear:both;
            overflow: auto;
          }
          .toolbar{
            float: right;
            margin: 24px calc(24/1920*100vw);
            margin-right: 0;
            height:31px;
          }
        }
    .ja-export-btn,
    .en-export-btn,
    .export-btn{
      background-color: #fff;
      color: #006ab7;
    }
  }
</style>
