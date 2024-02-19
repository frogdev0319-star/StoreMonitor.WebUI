<template>
  <div class="report-container">
    <div style="display: none">
      <div class="no-print">
        <delay-button
          id="downloadPdf"
          :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
          class="exportbtn"
          type="primary"
          size="mini"
          @click="handleDown"
        >
          <div class="button-area">
            <i class="iconfont icon-pdf export"/>
            <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
          </div>
        </delay-button>
      </div>
    </div>
    <el-row  class="statistics-container">
      <el-col :span="24">
        <div class="statistics-header" style="margin-bottom:0px;">
          <div class="search-bar">
            <date-time-selector class="time-selector" @change="dateChange"/>
            <div class="person-title">
              <el-radio-group v-model="isMystery" style="display:flex;flex-direction:column;height:calc(40/1920*100vw);justify-content: space-between;" @change="onFilterPersonChanged">
                <div>
                  <el-radio :label="false" :class="lang === 'en'? 'en-span-class' : ''">{{ $t('statistics.patrolPerson.insPerson') }}</el-radio>  
                  <!--<span :class="lang === 'en'? 'en-span-class' : ''">{{ $t('statistics.patrolPerson.insPerson') }}<span>-->
                </div>
                <div>
                  <el-radio :label="true" :class="lang === 'en'? 'en-span-class' : ''">{{ $t('mysterio.mysterio') }}</el-radio>
                </div>
              </el-radio-group>
                <div class="date-range">
                  <region-multi-select
                    ref="multiState"
                    :selected="positionIds"
                    :options="positionsList"
                    :all="$t('statistics.patrolPerson.dutyAll')"
                    class="position"
                    :class="positionDisabled?'disable':''"
                    :disabled="positionDisabled"
                    @changeInput="handlePositionsChange"/>
                  <div style="width:0px;height:25px;border:1px solid rgba(172,174,177,0.3); " />
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
                style="background-color:#FFF;color:#006ab7;padding:0px;"
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
        <div style="margin-top:20.5px;" v-loading="isLoading">
          <table-only
            class="person_table"
            ref="elTP"
            :column-data="insRecordColData"
            :table-data="insRecordTableData"
            :highlight-current-row= "true"
            :is-event = "false"
            :default-sort = "defaultSort"
            :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}" 
            :tableHeight = "610"
            :allowRowExpand = "true"
            expand-component = "TabInceptionDetail"
            :expandCompProperties = "componentsProps"
            @sortChange="handleSortChange"
          />
        </div>
        <div style="width:100%; margin-top:12px;height:31px;">
          <tbl-pagination-only
            :total="total"
            :current-page="page"
            :page-size="sizeNum"
            layout = "prev,pager, next,sizes,slot"
            @sizeChange="handlePageAndSizeChange"
            @currentChange="handlePageAndSizeChange"
          />
        </div>
      </el-col>
    </el-row>
    <div v-if="ispdf">
      <el-row id="pdf-area" ref="printPDF" class="statistics-container">
        <el-col :span="24" class="statistics-content" style="height: auto;width:1000px;">
          <div class="head">
            <div class="title">{{ $t('statistics.patrolPerson.insRecordList') }}</div>
          </div>
          <div style="margin-top:20.5px;">
            <table-only
              ref="elTP"
              :column-data="insRecordColData"
              :table-data="allInsRecordData"
              :highlight-current-row= "true"
              :is-event = "false"
              :default-sort = "defaultSort"
              :headerStyle="{height:'47px',backgroundColor: '#f7f9fa',border:'none',fontSize:'12px'}" 
              :allowRowExpand = "true"
              :isexportPDF = "isexportPDF"
              expand-component = "TabInceptionDetail"
              :expandCompProperties = "componentsProps"
              @sortChange="handleSortChange"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <dialog-pop
      :title="$t('insSettingView.export')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="ispdf"
      :show-button="false"
      :show-close="false"
      class="LoadDialog"
    >
      <p>{{ $t('insSettingView.isExportPDF') }}......</p>
    </dialog-pop>
    <DownloadDialogPop
      :title="$t('downloadManagement.message')"
      :visible="showExportMassage"
      :showCancelbtn="false"
      @confirmHandler="showExportMassage = false"
      @goToPage="$router.push({name: 'downloadManagement',});"
      >
    </DownloadDialogPop>

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
import {
  exportStatisticsPerson, 
  exportStatisticsReportList , 
  exportStatisticsEventComment
} from '@/api/exportExcel';

import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import DateTimeSelector from '@/components/DateTimeSelector';
import { getBrifCheckinList, getCheckinReport, getDepartmentList } from '@/api/checkin';
import { titleRESTful } from '@/api/index';
import { getUserInfo } from '@/api/login';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import MultiSelect from '@/components/MultiSelect2';
import TabInceptionDetail from '@/components/TabInceptionDetail'
import html2canvas from 'html2canvas';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DownloadDialogPop from '@/components/DownloadDialogPop';

export default {
  name: 'PatrolPersonStat',

  components: {
    DialogPop,
    DelayButton,
    TableOnly,
    'v-chart': ECharts,
    DateTimeSelector,
    RegionMultiSelect,
    TabInceptionDetail,
    TblPaginationOnly,
    DownloadDialogPop
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
          'prop': 'processedRateStr',
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
      componentsProps:{
        beginTs: this.$moment().subtract(29, 'days').startOf('d').toDate(),
        endTs: this.$moment().endOf('d').toDate(),
        isMystery: false
      },
      isexportPDF: false,
      ispdf: false,
      ifCachedParams: false,
      isMystery: false,
      positionDisabled: false,
      isLoading:  false,
      showExportMassage: false,
    }
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        this.ifCachedParams = false;
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        const start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        const end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.getSearchCondition();
        self.curStoreTag = [];
      }
    },

  },

  created() {
    // const params = SearchConditionUtil.getSearchCondition('PatrolPersonStat');
    // if(Object.keys(params).length>0){
    //   console.log("cache params:",params);
    //   this.ifCachedParams = true;
    //   if(params.submitters.length>0)this.userIds = params.submitters;;
    //   if(params.positionIds.length>0)this.positionIds = params.positionIds;
      
    // }
    
    

    this.getSearchCondition();
  },

  methods: {
    async initData() {

      // const searchConditon = {
      //   path: 'eventManage',
      // };
      // SearchConditionUtil.deleteSearchCondition(searchConditon);

      this.isLoading = true
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
      /*if(this.mystery){
        const result = await getUserInfo({isMysteryMode:true});
        this.getUserList(result.data);
        this.initData();
      }else{*/
        const userPosition = getDepartmentList({ type: 1 }); //取得職務
        const userPromise = getUserInfo({isMysteryMode:true});
        //const titlePromise = titleRESTful.getUserTitleList();
        try {
          const result = await Promise.all([userPosition, userPromise]);
          this.getUserList(result[1].data);
          //this.getTitleList(result[2].data);
          this.getUserPositionList(result[0].data);
          this.filterUserIds();
          this.initData();
          //this.searchCheckInList();
        } catch (e) {
          console.log(e);
        }
      //}
    },

    onFilterPersonChanged(val){
      console.log("****onFilterPersonChanged:",val);
      
      if(val){
        this.positionDisabled = true;
      }else {
        this.positionDisabled = false;
      }
      this.filterUserIds();
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
      this.positionIds = this.ifCachedParams ? this.positionIds : this.positionsList.map(depart => depart.value);
    },

    getUserList(data) {
      this.userList = [];
      this.origianlUserList = [];
      data.map(user => {
          const userJson = {};
          userJson.label = user.userName;
          userJson.value = user.userId;
          userJson.title = user.title;
          userJson.mystery = user.mystery;
          this.origianlUserList.push(userJson);
          this.userList.push(userJson);
        
      });
        this.userIds = (this.ifCachedParams && this.userIds.length>0) ? this.userIds : this.userList.map(user => user.value);
    },

    getTitleList(data) {
      data.map(title => {
        const titleJson = {};
        titleJson.label = title.title;
        titleJson.value = title.titleId;
        this.positionsList.push(titleJson);
      });
      this.positionIds = (this.ifCachedParams && this.positionIds.length>0) ? this.positionIds : this.positionsList.map(position => position.value);
    },
    handlePositionsChange(positionIds) {
      this.positionIds = positionIds;
      this.filterUserIds();
    },

    filterUserIds() {
      if(this.isMystery){
        this.userList = this.origianlUserList.filter(item => {
          return item.mystery;
        });
        this.userIds = this.userList.map(user => user.value);
      }else{
        const filterDepart = this.positionsList.filter(position => this.positionIds.includes(position.value));
        //console.log("filterDepart:",filterDepart);
        const departUserId = filterDepart.map(user => user.contents).flat();
        console.log("this.origianlUserList:",this.origianlUserList);
        this.userList = this.origianlUserList.filter(item => {
            return (!item.mystery) && departUserId.includes(item.value);
        });
        this.userIds = this.userList.map(user => user.value);
      }
      
    },

    handleUserChange(userIds) {
      this.userIds = userIds;
      this.params.submitters = userIds;
    },

    /*** 取得巡檢人員紀錄***/
    export2Excel() {
      const that = this;
      if (that.insRecordTableData.length === 0) {
        util.notify("表格資料為空！請重新搜尋條件", 'warning', 3 * 1000);
        return false;
      }


      const now = new Date()
      var nowTs = this.getAllDate(now)
      var tsbegin = this.getDate(this.params.beginTs)
      var tsEnd = this.getOnlyDate(this.params.endTs)

      this.params.isMysteryMode = this.isMystery
      this.params.fileName = nowTs + "-Inspection_record-" + tsbegin + tsEnd
      this.params.filter = {page: 0, size: 99999}
      this.params.submitters = this.userIds;
      this.params.requestTs = now.getTime()

      this.showExportMassage = true

      console.log('this.params ~~~~~>> ', this.params)
      exportStatisticsPerson(this.params).then(res=>{
        console.log('res :>> ', res);
      })

      

      // require.ensure([], async() => {
      //   const { export_json_to_excel } = require('@/excel/Export2Excel');
      //   const tHeader=[];
      //   const filterVal = [];
      //   this.insRecordColData.map(item=>{
      //     if(item.prop!='detail'){
      //       tHeader.push(item.label);
      //       filterVal.push(item.prop);
      //     }
      //   })
      //   const curData = that.allInsRecordData//insRecordTableData;
      //   const data = that.formatJson(filterVal, curData);
      //   const fileName = 'Inspection record_' +  util.getCurDateStr();
      //   export_json_to_excel(tHeader, data, fileName);
      // });
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },
    getAllDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day + hour + min + sec
    },
    getDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day 
    },
    getOnlyDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return  month + day 
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    async doSearchInsRecordList(){
      const start = typeof (this.dateValue[0]) === 'object' ? this.dateValue[0].getTime() : this.dateValue[0];
      const end = typeof (this.dateValue[1]) === 'object' ? this.dateValue[1].getTime() : this.dateValue[1];
      this.componentsProps =  {
        beginTs: start,
        endTs: end,
        isMystery: this.isMystery
      };
      //const daysDiff = this.$moment(end).diff(start, 'days');
      //this.timeMode = daysDiff <= 30 ? 1 : 2;
      /*this.params.beginTs = start;
      this.params.endTs = end;
      this.params.submitters = this.userIds;*/
      this.allInsRecordData = [];
      let param = {beginTs:start,endTs:end,submitters:(this.userIds.length==0)?[' ']:this.userIds,isMysteryMode:this.isMystery};
      let searchParams = {...param};
      searchParams['positionIds'] = this.positionIds; 
      const searchConditon = {
        path: 'PatrolPersonStat',
        params: searchParams
      };
      console.log("save searchParams:",searchParams);
      SearchConditionUtil.saveSearchCondition(searchConditon);
      /*if(this.userIds.includes("-1")){
        param = {beginTs:start,endTs:end};
      }*/
      
      //console.log("doSearchInsRecordList > params:",this.params);
      let record = await this.getInspectStatsPersonInfo(param);
      this.allInsRecordData = record.data.content;
      this.total = Math.ceil(this.allInsRecordData.length/this.sizeNum);
      this.page =1;
      this.doCoverDepartmentToString();

      this.isLoading = false
      //console.log("this.total:",this.total);
      //console.log("this.allInsRecordData:",this.allInsRecordData);

      this.setRecordTableData();
    },
    doCoverDepartmentToString(){
      this.allInsRecordData.map(record =>{
        record.id=record.supervisorId;
        record.departs = record.departments.toString();
        record.processedRateStr = record.processedRate+'%';
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
      self.total = Math.ceil(this.allInsRecordData.length/self.sizeNum);
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
    handleDown() {
      const self = this;
      if (self.allInsRecordData.length === 0) {
        util.notify(self.$t('statistics.emptyInsRecordList'), 'warning', 3000);
        return false;
      }
      self.ispdf = true;
      this.$nextTick(() => {
        const img = document.getElementById('pdf-area');
        setTimeout(() => {
          html2canvas(img).then(function(canvas) {
            var oGrayImg = canvas.toDataURL('image/jpeg');
            self.pdfSrc = oGrayImg;
          });
          setTimeout(() => {
            self.$print(self.$refs.printPDF,null,self.$t('route.patrolPersonStat')+ util.getCurrentTime());
            self.ispdf = false;
          }, 1000);
        }, 5000);
      });
    },
  }
};
</script>

<style lang="sass">
  .person_table
    .el-table
      max-height: fit-content !important
</style>

<style lang="scss" scoped>
  @import "../../assets/sass/stastical.scss";

  .statistics-container{
    .statistics-content{
      width:97%;
      margin-left: calc(30/1920*100vw);
      margin-right: calc(30/1920*100vw);
      height: fit-content !important
    }
    .search-bar{
      display:flex;
      flex-direction:row;
      margin-left: calc(36/1440*100vw);
      margin-right:32px;
      margin-bottom:24px;
      height:calc(36/1920*100vw);
      justify-content: space-between;
      /deep/
      .el-select.el-select--medium .el-input .el-input__inner {
          position: relative;
          z-index: 1;
          background: transparent !important;
          border: none;
          font-size: calc(15/1920*100vw);
          height: calc(36/1920*100vw);
          line-height: calc(36/1920*100vw);
          min-height: 28px;
          min-width: 85px;
      }
      /deep/
      .el-select.el-select--medium .el-input.is-disabled .el-input__inner{
        background:#f5f7fa  !important;
      }
      /deep/
      .el-input--medium .el-input__icon {
          line-height: calc(36/1920*100vw);
      }
    }
    .head{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 67.5px;
      .title{
        height: calc(30/1920*100vw);
        font-size: calc(18/1920*100vw);
        text-align: left;
        color: $black;
      }
      .operation-btns{
        align-self: center;
        display: flex;
        flex-direction: row;
        min-width:101px;
        max-width:171px;
        height: 30px;
        align-items: center;
        padding:0;
        justify-content: flex-end;
      }
    }
      
    .person-title{
      display:flex;
        flex-direction:row;
        width: calc(510/1440*100vw);
        height:calc(36/1920*100vw);
        margin-left:72px;
        font-size: calc(15/1920*100vw);
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
          height:calc(36/1920*100vw);
          align-items: center;
          /deep/
          .el-input--medium .el-input__inner{
            border:none;
            line-height: calc(36/1920*100vw);
            height: calc(36/1920*100vw);
          }
        }
        .position{
          display:inline;
          width: calc(217/1440*100vw);
          /deep/
          .el-input--medium .el-input__inner{
            border:none;
            line-height: calc(36/1920*100vw);
            height: calc(36/1920*100vw);
            background: transparent;
          }
        }
        .disable{
            /deep/
            .el-input--medium .el-input__inner{
              color:#f5f7fa;
            }
          }
        .person{
          display:inline;
          width: calc(223/1440*100vw);
          
          /deep/
          .el-input--medium .el-input__inner{
            border:none;
            line-height: calc(36/1920*100vw);
            height: calc(36/1920*100vw);
            
          }
          
        }
    }
    
    .search-button{
      margin-left:35px;
      width: 102px;
      height: calc(36/1920*100vw);
      background-color: #556679;
      border-color: #556679;
      color:#fff;
      font-size: calc(15/1920*100vw);
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
