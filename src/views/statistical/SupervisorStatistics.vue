<template>
  <div class="item-container">
    <el-col :span="24" class="statistics-header">
      <el-col :span="24" class="header-details">
        <span :class="lang== 'en'? 'en-span-class' : ''">{{$t('reportView.time')}}</span>
        <el-date-picker
          ref="datePicker"
          v-model="dateValue"
          type="daterange"
          range-separator="-"
          size="mini"
          :clearable=false
          :editable=false
          format="yyyy/MM/dd"
          class="date-range"
          :popper-class="poperClass"
          :picker-options='dateOpt'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"
          :default-time="['00:00:00', '23:59:59']"
          unlink-panels
        >
        </el-date-picker>
        <el-tooltip class="item" effect="dark"
                    placement="right">
          <div slot="content">{{$t('overview.dataRangeTips')}}</div>
          <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;vertical-align: middle;"></i>
        </el-tooltip>
      </el-col>
    </el-col>
    <el-col :span="24" class="items-content">
      <el-col :span="24" class="contents-container">
        <el-col :span="24" class="items-title">
          <span class="title">{{$t('overview.patrolList')}}</span>
          <div class="exprotBtn">
            <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="export2Excel" >
              <div class="btn-area">
                <img :src="exportPng" class="icon-excel">
                <span class="spanClass">{{$t('eventView.exportReport')}}</span>
              </div>
            </el-button>
          </div>
        </el-col>
        <el-col :span="24" class="items-table">
          <div class="table">
            <div class="el-table-panel">
              <el-table
                :data="supervisorTableData"
                :highlight-current-row="true"
                empty-text='无数据'
                align='left'
                stripe
                @sort-change='sortChange'
                :default-sort = "{prop: 'completionRateStr', order: 'ascending'}"
                border
                style="width: 100%"
                :header-cell-class-name="headerClass"
                size="mini"
                :cell-class-name="cellClass"
                :row-key='getRowKeys'
                :expand-row-keys="expands"
                @expand-change="expandSelect"
                :row-class-name="rowClass"
              >
                <el-table-column v-for="(_item,_index) in supervisorInfoData" :key="_index"
                                 :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="lang!=='en'? _item.width : _item.maxWidth">
                </el-table-column>
                <el-table-column type="expand" :label="$t('overview.detail')" :width="lang!=='en'? 100: 120">
                  <template slot-scope="props">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                      <!--<el-tab-pane label="巡店计划" name="patrolPlan" style="display: none">-->
                        <!--<el-table-->
                          <!--:data="planTableData"-->
                          <!--:highlight-current-row="true"-->
                          <!--align='left'-->
                          <!--stripe-->
                          <!--border-->
                          <!--style="width: 100%"-->
                          <!--size="mini"-->
                          <!--:header-cell-class-name="insideHeaderClass"-->
                          <!--:row-class-name="insideRowClass"-->
                          <!--:cell-class-name="insideCellClass"-->
                        <!--&gt;-->
                          <!--<el-table-column v-for="(_item,_index) in planTableInfo" :key="_index"-->
                                           <!--:prop="_item.prop" :label="_item.label" :class-name="_item.className" :min-width="_item.width">-->
                          <!--</el-table-column>-->
                        <!--</el-table>-->
                      <!--</el-tab-pane>-->
                      <el-tab-pane :label="$t('overview.patrolExecution')" name="planImplementation">
                        <el-table
                          :data="implementTableData"
                          :highlight-current-row="true"
                          align='left'
                          stripe
                          border
                          style="width: 100%"
                          size="mini"
                          :header-cell-class-name="insideHeaderClass"
                          :row-class-name="insideRowClass"
                          :cell-class-name="insideCellClass"
                        >
                          <el-table-column v-for="(_item,_index) in implementTableInfo" :key="_index"
                                           :prop="_item.prop" :label="_item.label" :min-width="_item.width">
                          </el-table-column>
                        </el-table>
                      </el-tab-pane>
                    </el-tabs>
                  </template>
                </el-table-column>

                <div slot="empty">
                  <div>
                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                    <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{$t('overview.noData')}}</span>
                  </div>
                </div>
              </el-table>
            </div>
            <div class="toolbar pagination clearfix">
              <el-pagination background small
                             :page-sizes="[10, 20, 50, 100]"
                             @size-change="sizeChange"
                             @current-change="currentChange"
                             :current-page="page"
                             layout="jumper,total, prev, pager, next,sizes"
                             :page-size="sizeNum" :total="total">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getStoreList} from '@/api/store'
  import util from '../../common/util.js'
  import {Message} from 'element-ui'

  import {
    getInspectStatsOverPersonV2,
    getInspectScheduleOverview
  } from '@/api/inspectOverview'
  export default {
    name: "SupervisorStatistics",
    data(){
      return {
        dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
        dateOpt: {
          disabledDate: (time) => {
            return time.getTime() > this.$moment(new Date).endOf('d').toDate();
          }
        },
        timeMode: 1,
        params: {},
        poperClass: 'date-picker-poper',
        exportPng: require('../../../static/img/icon_excel.png'),
        lang: this.$i18n.locale,
        supervisorTableData:[],
        supervisorInfoData:[
          {
            "prop": "supervisorName",
            "label": this.$t('overview.supervisorName'),
            "sortable":false,
            "width": 232,
            "maxWidth": 232,
          },
          {
            "prop":"numOfStores",
            "label": this.$t('overview.storeNum'),
            "sortable":'custom',
            "width": 227,
            "maxWidth": 227,
          },
          {
            "prop":"numOfTasked",
            "label": this.$t('overview.scheduleNum'),
            "sortable":'custom',
            "width": 227,
            "maxWidth": 210,
          },
          {
            "prop": "numOfCompleted",
            "label": this.$t('overview.inscheduleNum'),
            "sortable":'custom',
            "width": 227,
            "maxWidth": 220,
          },
          {
            "prop":"numOfUnscheduled",
            "label": this.$t('overview.unscheduleNum'),
            "sortable":'custom',
            "width": 227,
            "maxWidth": 220,
          },
          {
            "prop":"completionRateStr",
            "label": this.$t('overview.completeRate'),
            "sortable":'custom',
            "width": 227,
            "maxWidth": 220,
          }
        ],
        total: 0,
        page:1,
        sizeNum: 10,
        direction: 'asc',
        property: 'completionRate',
        hasNoData: false,
        exportItmesHeader: ['督导名称','管辖门店数量', '计划巡店次数', '按计划巡店次数', '计划外巡店次数', '巡店计划完成率'],
        headerClass: 'header-class',
        cellClass: 'cell-class',
        activeName: 'planImplementation',
        planTableData: [],
        planTableInfo: [
          {
            "prop": "supervisorName",
            "label": '巡店方式',
            "width": '13%',
            "className": 'col1'
          },
          {
            "prop":"numOfStores",
            "label": '巡检门店',
            "width": '27%',
            "className": 'col2'
          },
          {
            "prop":"计划描述",
            "label": '计划描述',
            "width": '35%',
            "className": 'col3'
          },
          {
            "prop": "numOfCompleted",
            "label": '频率',
            "width": '25%',
            "className": 'col4'
          }
          ],
        implementTableData: [],
        implementTableInfo: [
          {
            "prop": "fromDateStr",
            "label": this.$t('overview.patrolDate'),
          },
          {
            "prop":"modeStr",
            "label": this.$t('overview.patrolMethod'),
          },
          {
            "prop":"toDateStr",
            "label": this.$t('overview.missionValidity'),
          },
          {
            "prop": "completedStoresStr",
            "label": this.$t('overview.inspectedStores'),
          },
          {
            "prop": "incompletedStoresStr",
            "label": this.$t('overview.uninspectedStores'),
          },
          {
            "prop": "percentSchedule",
            "label": this.$t('overview.taskPerformance'),
          }
        ],
        expands: [],
        rowClass: 'row-class',
        insideCellClass: 'inside-cell-class',
        insideHeaderClass: 'inside-header-class',
        insideRowClass: 'inside-row-class'
      }
    },
    computed:{
      ...mapGetters({accountChanged:'accountChanged'})
    },
    watch:{
      async accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0) {
          let self = this;
          self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date).endOf('d').toDate()];
          let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
          let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
          self.params.beginTs = start;
          self.params.endTs = end;
          self.initDaysRange();
          self.initData();
        }
      },
      numberOfElements(val,oldVal){
        console.log(val);
        console.log(oldVal);
        let self = this;
        if(val == 0 && self.totalElements > 0){
          self.params.filter.page -= 1;
          self.getEventList(self.params);
        }
      }
    },
    methods:{
      getRowKeys(row){
        return row.supervisorId
      },
      expandSelect(row, expandedRows) {
        let self = this
        if (expandedRows.length) {
          self.expands = []
          if (row) {
            self.expands.push(row.supervisorId);
            //self.getPlanDetail()
            self.getScheduleTaskImplementation();
          }
        }
        else {
          self.expands = []
        }
      },
      sortChange(col){
        console.log(col);
        let self=this;
        let column = col.column;
        let order = col.order;
        self.order = order;
        let prop  = '';
        let tempOrder = '';
        if(order=="ascending"){
          self.params.order={
            "direction":"asc",
            "property": col.column.property == 'completionRateStr' ? 'completionRate' : col.column.property
          }
          prop = col.column.property;
          tempOrder =  "asc";
        }
        else if(order=="descending"){
          self.params.order={
            "direction":"desc",
            "property": col.column.property == 'completionRateStr' ? 'completionRate' : col.column.property
          }
          prop = col.column.property;
          tempOrder =  "desc";
        }
        else{
          self.params.order={"direction":"asc", "property": 'completionRate'};
        }
        self.params.filter={
          page:self.page-1,
          size:self.sizeNum
        }
        self.getInspectPersonTable();
      },
      sizeChange(val){
        let self=this;
        self.sizeNum=val;
        self.page=1;
        self.params.filter={page:self.page-1,size:val};
        self.getInspectPersonTable();
      },
      currentChange(val){
        let self=this;
        self.page = val;
        self.params.filter={page:val-1,size:self.sizeNum};
        self.getInspectPersonTable();
      },
      async getRegionInfo(){
        let self=this;
        let params={
          "filter":{
            "page":0,
            "size":1000
          }
        };
        let retData=await self.getStoreData(params);
        let storeList=retData.data.content;
        self.storeList=storeList;

        let getCountry=storeList=>{
          let temp=[];
          temp.push({label:self.$t('reportView.country'), value:''})
          storeList.forEach(item=>{
            if(temp.map(x=>x.value).indexOf(item.country)==-1){
              let obj={
                label:item.country,
                value:item.country
              }
              temp.push(obj);
            }
          })
          return temp;
        }
        let countryList=getCountry(storeList);
        let tempStore=[];
        storeList.forEach(item=>{
          let obj={
            storeId:item.storeId,
            label:item.name,
            value:item.name,
            userId:item.userId,
            userName:item.userName,
            checked: false
          }
          tempStore.push(obj);
        })
        self.storeDataList=tempStore;
        self.countryList=countryList;
        self.curCountry = '中国';
        self.selectAllProAndCity(self.curCountry);
      },
      getStoreData(params){
        let self=this;
        return new Promise((resolve,reject)=>{
          getStoreList(params).then(res=>{
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              let data=res.data;
              resolve(res);
            }
          }).catch(res => {
            resolve(res);
          })
        })
      },
      dateChange(val) {
        let self = this;
        console.log(val);
        self.currentIndex = 0;
        let start = typeof(val[0]) === 'object' ? val[0].getTime() : val[0];
        let end = typeof(val[1]) === 'object' ? val[1].getTime() : val[1];
        let daysDiff = self.$moment(end).diff(start, 'days');
        if (daysDiff < 6) {  //当前选择的时间范围不到7天
          // Message({
          //   message: self.$t('overview.changeTimeRange'),
          //   type: 'warning',
          //   duration: 3 * 1000
          // })
          self.$message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
          })
          start = end - 3600 * 24 * 6 * 1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        if (daysDiff > 364) {  //当前选择的时间范围超过365天
          // Message({
          //   message: self.$t('overview.changeTimeRange'),
          //   type: 'warning',
          //   duration: 3 * 1000
          // })
          self.$message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
          })
          start = end - 3600 * 24 * 364 * 1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        else {
          self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
        daysDiff = self.$moment(end).diff(start, 'days');
        daysDiff <= 30 ? self.timeMode = 1 : self.timeMode = 2;
        console.log(self.timeMode);
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initDaysRange();
        self.searchData()
      },
      initDaysRange() {
        let self = this;
        let start = self.params.beginTs;
        let end = self.params.endTs;
        let startDay = self.$moment(start).format('YYYY-MM-DD');
        let endDay = self.$moment(end).format('YYYY-MM-DD');
        let startDayWithoutYear = self.$moment(start).format('MM/DD');
        let endDayWithoutYear = self.$moment(end).format('MM/DD');
        if (self.timeMode == 1) {
          let beginDay = new Date(util.judgeStart(startDay));
          let weekList = util.getWeek(beginDay, endDay)
          let arrLength = weekList.length;
          let firstEndTime = weekList[0].split('-')[1];
          let firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
          let lastStartTime = weekList[arrLength - 1].split('-')[0];
          let lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
          weekList.splice(0, 1, firstWeekStr);
          weekList.splice(arrLength - 1, 1, lastWeekStr);
          console.log(weekList);
          self.daysRangeList = weekList;

        }
        else if (self.timeMode == 2) {
          let monthArray = util.getMonthBetween(startDay, endDay)
          console.log(monthArray)
          self.daysRangeList = monthArray;
        }
      },

      async searchData(){
        let self = this;
        self.params.filter={page:self.page - 1,size:self.sizeNum};
        self.params.order = {direction: self.direction, property: self.property}
        await self.getInspectPersonTable();
      },

      async getInspectPersonTable() {
        let self = this;
        let inspectItems = await self.getInspectStatsPersonInfo(self.params);
        let errCode = inspectItems.errCode;

        if (errCode == 0) {
          let resultData = inspectItems.data;
          console.log(resultData)
          try {
            let content = resultData.content;
            content.forEach(item => {
              item.completionRateStr = item.completionRate + '%';
            })
            self.supervisorTableData = resultData.content;
            self.total = resultData.totalElements;
            console.log(resultData.content);
          }
          catch (e) {
            self.supervisorTableData = [];
          }
        }
      },
      getInspectStatsPersonInfo(params) {
        return new Promise((resolve, reject) => {
          getInspectStatsOverPersonV2(params).then(res => {
            resolve(res);
          })
        })
      },
      getInspectScheduleImplemention(params){
        return new Promise((resolve, reject) => {
          getInspectScheduleOverview(params).then(res => {
            resolve(res);
          })
        })
      },
      async initData(){
        let self = this;
        self.params.filter={page:self.page - 1,size:self.sizeNum};
        self.params.order = {direction: self.direction, property: self.property}
        await self.getInspectPersonTable();
      },
      export2Excel(){
        var that = this;
        if(that.supervisorTableData.length==0){
          // Message({
          //   message: that.$t('overview.emptyPatrolList'),
          //   type:'warning',
          //   duration:3*1000
          // })
          that.$message({
            message: that.$t('overview.emptyPatrolList'),
            type:'warning',
          })
          return false;
        }
        require.ensure([], async() => {
          const { export_json_to_excel } = require('@/excel/Export2Excel');
          const tHeader = that.exportItmesHeader; // 导出的表头名
          const filterVal = ['supervisorName','numOfStores','numOfTasked','numOfCompleted','numOfUnscheduled','completionRatePer']; // 导出的表头字段名
          let self=this;
          self.params.filter={
            "page": 0,
            "size": self.total
          };
          console.log(self.params)
          let regionResult = await that.getInspectStatsPersonInfo(self.params);
          let curData = [];
          if (regionResult.errCode == 0) {
            let result = regionResult.data;
            if (result) {
              result.content.forEach(item=>{
                item.completionRatePer = item.completionRate + '%'
              })
              console.log(result.content)
              curData = result.content;
            }
          }
          const data = that.formatJson(filterVal, curData);
          let fileName = 'Supervisor' +'-'+util.getCurDateStr();
          export_json_to_excel(tHeader, data, fileName);// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      getPlanDetail(){
        let self = this;
        let params = self.expands[0];
        console.log(params)
        self.planTableData= [{

        }]
      },
      async getScheduleTaskImplementation(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.supervisorId = self.expands[0];
        params.filter =  {
           "page": 0,
           "size": 3
        }
        let result = await self.getInspectScheduleImplemention(params)
        let errCode = result.errCode;
        if (errCode == 0) {
          let resultData = result.data;
          console.log(resultData)
          try {
            let content = resultData.content;
            content.forEach(item => {
              item.fromDateStr = self.$moment(item.fromDate).format('YYYY-MM-DD HH:mm:ss');
              item.toDateStr = self.$moment(item.toDate).format('YYYY-MM-DD HH:mm:ss');
              item.modeStr = item.mode== 0 ? self.$t('overview.remotePatrol'): self.$t('overview.onsitePatrol');
              let completedStoresStr = '';
              let completeStoresNum = 0;
              completeStoresNum = item.completedStores.length;
              item.completedStores.forEach(_item=>{
                completedStoresStr += _item + ','
              })
              let incompletedStoresStr = '';
              let incompleteStoresNum = 0;
              incompleteStoresNum = item.incompleteStores.length;
              item.incompleteStores.forEach(_item=>{
                incompletedStoresStr += _item + ','
              })
              completedStoresStr = completedStoresStr.slice(0, completedStoresStr.length - 1)
              incompletedStoresStr = incompletedStoresStr.slice(0, incompletedStoresStr.length - 1)
              item.completedStoresStr = completeStoresNum==0 ? self.$t('overview.none'): completedStoresStr;
              item.incompletedStoresStr = incompleteStoresNum==0 ? self.$t('overview.none'): incompletedStoresStr;
              let sumStores = completeStoresNum + incompleteStoresNum;
              let percentSchedule = 0
              if(sumStores == 0){
                percentSchedule = 0;
              }
              else{
                let percent = completeStoresNum/sumStores * 100
                percentSchedule = percent.toFixed(0) + '%';
              }
              item.percentSchedule = percentSchedule;
            })
            self.implementTableData = content;
          }
          catch (e) {
            self.implementTableData = [];
          }
        }
      }
    },
    async created(){
      let self = this;
      let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
      let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
      self.params.beginTs = start;
      self.params.endTs = end;
      self.initDaysRange();
      await self.initData();
    },
    mounted(){
      let self = this;
    },
  }
</script>

<style lang="scss" scoped>
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $excellent: #57e78f;
  $pass: #72a1f3;
  $failed: #ffd035;
  $ignored: #cad1db;
  *{
    box-sizing: border-box;
    font-family: Roboto, Arial, 'Microsoft YaHei';
  }
  .item-container{
    padding-bottom: 20px;
    .statistics-header{
      margin-bottom: 30px;
      border-bottom: 1px solid $border;
      background-color: #fff;
      padding-top: 30px;
      padding-bottom: 30px;
      color: $black;
      .header-details{
        text-align: left;
        padding-left: calc(40/1920*100vw);
        position: relative;
        .search-content{
          display: inline-block;
        }
        .date-range {
          border: 1px solid #ccc;
          width: 200px;
          height: calc(35 / 1920 * 100vw);
          min-height: 28px;
        }
        .item {
          color: $tab;
          margin-left: calc(20 / 1920 * 100vw);
          margin-right: calc(8 / 1920 * 100vw);
        }
        .iconbangzhu{
          font-size: calc(20/1920*100vw);
          position: relative;
          color: $tab;
        }
        span{
          font-size: calc(16/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
          color: $black;
        }
        @media screen and(max-width: 1366px){
          .en-span-class{
            margin-right: 60px;
          }
        }
        @media screen and(min-width: 1366px){
          .en-span-class{
            //margin-right: 75px;
          }
        }
        .el-province{
          width: calc(160/1920*100vw);
          margin-right: calc(15/1920*100vw);
          min-width: 85px;
          min-height: 28px;
        }
        .search-btn{
          width: calc(130/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
        }
        .en-search-btn{
          width: calc(130/1920*100vw);
          margin-left: calc(20/1920*100vw);
          border-color: $red;
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
        }
      }
      .header-details:nth-child(1){
        padding-right: calc(60/1920*100vw);
      }
      .header-details:nth-child(2){
        padding-top:15px;
        padding-bottom: 30px;
        padding-right: calc(60/1920*100vw);
      }
    }
    .items-content{
      padding: 0 calc(30/1920*100vw) 0;
      .contents-container{
        background-color: #fff;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          margin-bottom: 30px;
          .title {
            padding-top: 30px;
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            color: $black;
            display: inline-block;
          }
          .exprotBtn{
            padding-right: calc(30 / 1920 * 100vw);
            padding-top: 25px;
            float: right;
            .export-btn{
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
                  margin: calc(6/1920*100vw) calc(18/1920*100vw) calc(6/1920*100vw) 0;
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
              border-color: $red;
              z-index: 990;
              height: calc(36/1920*100vw);
              width: calc(160/1920*100vw);
              min-width: 120px;
              margin: 0;
              padding: 0;
              font-size: calc(14/1920*100vw);
              line-height: calc(36/1920*100vw);
              color: #ffffff;
              border-width: 0;
              border-radius: 4px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin-right: calc(18/1920*100vw);
                  height: calc(24/1920*100vw);
                  width: calc(24/1920*100vw);
                  min-height: 18px;
                  min-width: 18px;
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
            }
          }
        }
      .items-table{
        .table{
          margin: 0 calc(30/1920*100vw);
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
          margin: 30px calc(30/1920*100vw);
          margin-right: 0;
          height:13%;
        }
      }
    }

  }
</style>
<style>
  .header-class, .inside-header-class{
    height: 40px;
    font-size: 12px;
    font-family: Arial, 'Microsoft YaHei';
    font-weight: bold;
    color: #7d8cad;
    background-color: #f4f5f9 !important;
    border-right: none !important;
  }
  .el-table__row > .cell-class{
    padding-left: 20px;
    font-size: calc(14/1920*100vw);
    color: #182752;
  }

  .el-table__row > .inside-cell-class{
    padding-left: 25px;
    font-size: calc(14/1920*100vw);
    color: #182752;
  }

  body .el-table th.gutter {
    display: table-cell !important
  }

  .el-table__expanded-cell[class*=cell] {
    padding: calc(25/1920*100vw) calc(40/1920*100vw) calc(30/1920*100vw) calc(60/1920*100vw) !important;
  }
  .el-table__expand-column .cell{
    paddding-left: calc(20/1920*100vw);
    text-align: left;
  }
  .el-table__expand-icon{
    font-size: calc(14/1920*100vw);
    color: #182752;
  }
  .cell-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .cell-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }
  .header-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .header-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }

  .inside-header-class .cell{
    padding-left: calc(25/1920*100vw) !important;
  }
  .inside-cell-class .cell{
    padding-left: calc(25/1920*100vw) !important;
  }
  .el-table--mini th, .el-table--mini td{
    padding: 0 !important;
  }
  .el-table__empty-block{
    border-bottom: 1px solid #e3e9f4;
    border-right: 1px solid #e3e9f4;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td{
    background-color: #f5f7fa !important;
  }
  .el-table__row.row-class, .el-table__row.inside-row-class{
    height: 35px;
  }
  .el-table--border td.cell-class:nth-last-of-type(1) {
    border-right: 1px solid #EBEEF5 !important;
  }
  .el-table--border td.inside-cell-class:nth-last-of-type(1) {
    border-right: 1px solid #EBEEF5 !important;
  }

  .el-table__header-wrapper th.header-class:nth-last-of-type(2) {
    border-right: 1px solid #EBEEF5 !important;
  }
  .el-table__header-wrapper th.inside-header-class:nth-last-of-type(2) {
    border-right: 1px solid #EBEEF5 !important;
  }
</style>
