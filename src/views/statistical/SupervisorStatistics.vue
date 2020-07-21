<template>
  <div>
    <div class="item-container"  :style="ispdf?'min-height:100vh;':''">
      <el-col :span="24" class="statistics-header">
        <div class="header-details">
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
        </div>
        <div class="header-mul-select">
          <span class="mul-label">{{$t('scheduleView.InspectPerson')}}</span>
          <el-select v-model="ModelPost"  placeholder="请选择" size="mini" class="el-province" @change="searchData">
            <el-option
              v-for="item in titleList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- <region-multi-select :options="titleList" :placeholder="$t('insSettingView.Inspector')" :disabled="false"
            :inputSize="`mini`" :selected="ModelPost" @changeInput="changeSelect(arguments)" :all="$t('reportView.all')"></region-multi-select> -->
        </div>
      </el-col>
      <el-col :span="24" class="items-content">
        <el-col :span="24" class="contents-container">
          <el-col :span="24" class="items-title">
            <span class="title">{{$t('overview.patrolList')}}</span>
            <div class="exprotBtn">
              <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="export2Excel" >
                <div class="btn-area">
                  <i class="iconfont icon-excel"></i>
                  <!-- <img :src="exportPng" class="icon-excel"> -->
                  <span class="spanClass">{{$t('eventView.exportReport')}}</span>
                </div>
              </el-button>
              <el-button type="primary" size="mini" :class="lang==='en'? 'en-export-btn':'export-btn' " @click="handleDown()" style="margin-top:-15px;">
                <div class="btn-area">
                  <i class="iconfont icon-pdf"></i>
                  <span class="spanClass">{{$t('reportView.InspectionDetail')}}</span>
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
                        <el-tab-pane :label="$t('overview.patrolPlan')" name="patrolPlan">
                          <el-table
                            :data="planTableData"
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
                            <el-table-column v-for="(_item,_index) in planTableInfo" :key="_index"
                                            :prop="_item.prop" :label="_item.label" :class-name="_item.className" :min-width="_item.width">
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
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
      <el-dialog :title="$t('insSettingView.export')"
      :visible.sync="ispdf" v-if="ispdf"
      :append-to-body='true'
      :close-on-click-modal="false"
      class="LoadDialog"
      width="510px"
      top="35vh"
      left="40vh">
          <div style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #dfe2e9;"/>
              <p style="margin-top:40px;color:#000;">{{$t('insSettingView.isExportPDF')}}......</p>
          </div>
      </el-dialog>
    </div>
    <div class="item-container" v-if="ispdf">
      <el-col :span="24" class="items-content"  id="pdfDom"  style="padding:40px 20px;">
        <el-col :span="24" class="contents-container">
          <el-col :span="24" class="items-title">
            <span class="title">{{$t('overview.patrolList')}}</span>
          </el-col>
          <el-col :span="24" class="items-table" style="padding-bottom:20px;">
            <div class="table">
              <div class="el-table-panel">
                <el-table
                  :data="elPDFtableData"
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
                  default-expand-all
                  :row-key='getRowKeys'
                  @expand-change="expandSelect"
                  :row-class-name="rowClass"
                >
                  <el-table-column v-for="(_item,_index) in supervisorInfoData" :key="_index"
                                  :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="lang!=='en'? _item.pdfwidth : _item.pdfmaxWidth">
                  </el-table-column>
                  <el-table-column type="expand" :label="$t('overview.detail')" width="100px">
                    <template slot-scope="props">
                      <el-tabs v-model="activePDFFirst" @tab-click="handleClick">
                        <el-tab-pane :label="$t('overview.patrolPlan')" name="First">
                          <el-table
                            :data="planTableData"
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
                            <el-table-column v-for="(_item,_index) in planTableInfo" :key="_index"
                                            :prop="_item.prop" :label="_item.label" :class-name="_item.className" :min-width="_item.width">
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="activePDFSecond" @tab-click="handleClick">
                        <el-tab-pane :label="$t('overview.patrolExecution')" name="Second">
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
            </div>
          </el-col>
        </el-col>
      </el-col>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getStoreList} from '@/api/store'
  import util from '../../common/util.js'
  import {Message} from 'element-ui'
  import RegionMultiSelect from "@/components/RegionMultiSelect";
  import {GetScheduleTaskList} from "@/api/schedule"
  import moment from "moment"

  import {
    getInspectStatsOverPersonV2,
    getInspectScheduleOverview
  } from '@/api/inspectOverview'
  export default {
    name: "SupervisorStatistics",
    components:{
        RegionMultiSelect
    },
    data(){
      return {
        activePDFFirst:'First',
        activePDFSecond:'Second',
        dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
        dateOpt: {
          disabledDate: (time) => {
            return time.getTime() > this.$moment(new Date).endOf('d').toDate();
          }
        },
        timeMode: 1,
        ispdf:false,
        params: {},
        poperClass: 'date-picker-poper',
        exportPng: require('../../../static/img/icon_excel.png'),
        lang: this.$i18n.locale,
        supervisorTableData:[],
        titleList:[
          {
           label:this.$t('insSettingView.storesupervisor'),
           value:3
           },
           {
           label:this.$t('insSettingView.storesuperManage'),
           value:4
           }
        ],
        ModelPost:3,
        supervisorInfoData:[
          {
            "prop": "supervisorName",
            "label": this.$t('scheduleView.InspectPerson'),
            "sortable":false,
            "pdfwidth": '15%',
            "pdfmaxWidth": '17%',
            "width": 232,
            "maxWidth": 232,
          },
          {
            "prop":"numOfStores",
            "label": this.$t('overview.storeNum'),
            "sortable":'custom',
            "pdfwidth": '15%',
            "pdfmaxWidth": '17%',
            "width": 227,
            "maxWidth": 227,
          },
          {
            "prop":"numOfTasked",
            "label": this.$t('overview.scheduleNum'),
            "sortable":'custom',
            "pdfwidth": '15%',
            "pdfmaxWidth": '16%',
            "width": 227,
            "maxWidth": 210,
          },
          {
            "prop": "numOfCompleted",
            "label": this.$t('overview.inscheduleNum'),
            "sortable":'custom',
            "pdfwidth": '15%',
            "pdfmaxWidth": '16%',
            "width": 227,
            "maxWidth": 220,
          },
          {
            "prop":"numOfUnscheduled",
            "label": this.$t('overview.unscheduleNum'),
            "sortable":'custom',
            "pdfwidth": '15%',
            "pdfmaxWidth": '16%',
            "width": 227,
            "maxWidth": 220,
          },
          {
            "prop":"completionRateStr",
            "label": this.$t('overview.completeRate'),
            "sortable":'custom',
            "pdfwidth": '15%',
            "pdfmaxWidth": '16%',
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
        activeName: 'patrolPlan',
        planTableData: [],
        week:['Mon.','Tues.', 'Wed.','Thur.','Fri.','Sat.','Sun.'],
        monthly:['Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.','Aug.','Sept.','Oct.','Nov.','Dec.'],
        month:['st','nd','rd','th'],
        planTableInfo: [
          {
            "prop": "scheduleName",
            "label": this.$t('scheduleView.scheduleName'),
            "width": '13%',
            "className": 'col1'
          },
          {
            "prop": "category",
            "label": this.$t('overview.patrolMethod'),
            "width": '13%',
            "className": 'col1'
          },
          {
            "prop": "inspectTagName",
            "label": this.$t('overview.patrolLists'),
            "width": '13%',
            "className": 'col1'
          },
          {
            "prop":"appliedStores",
            "label": this.$t('overview.patrolStore'),
            "width": '27%',
            "className": 'col2'
          },
          {
            "prop":"schedule",
            "label": this.$t('overview.planDes'),
            "width": '35%',
            "className": 'col3'
          },
          {
            "prop": "mode",
            "label": this.$t('overview.planFre'),
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
        insideRowClass: 'inside-row-class',
        elPDFtableData:[],
        htmlTitle:this.$t("overview.htmltopdfC")
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
      getInspectorPlan(params){
        return new Promise((resolve, reject) => {
          GetScheduleTaskList(params).then(res => {
            let data = res;
            resolve(data);
          })
        })
      },
      async handleDown(){
        let self = this;
        self.ispdf=true
        if(self.total>0){
          require.ensure([], async() => {
              self.params.filter={
              "page": 0,
              "size": self.total
            };
            let regionResult = await self.getInspectStatsPersonInfo(self.params);
            if (regionResult.errCode == 0) {
              let result = regionResult.data;
              if (result) {
                // let planTableData=[]
                // let implementTableData = []
                result.content.forEach(item=>{
                  item.completionRateStr = item.completionRate + '%'
                  // self.getPlanDetail(item.supervisorId)
                  // self.getScheduleTaskImplementation(item.supervisorId);
                  // planTableData.push(self.planTableData);
                  // implementTableData.push(self.implementTableData)
                })
                self.elPDFtableData = result.content;
              }
            }
          })
        }
        setTimeout(()=>{
          self.getPdf()
          if(sessionStorage.getItem('startPDF')=='start'){
            sessionStorage.removeItem('startPDF','start');
            if(sessionStorage.getItem('endPDF')=='end'){
              sessionStorage.removeItem('endPDF','end');
              setTimeout(()=>{
                self.ispdf=false
              },1000)
            }
          }
        },1000)
      },
      getRowKeys(row){
        return row.supervisorId
      },
      expandSelect(row, expandedRows) {
        let self = this
        if (expandedRows.length) {
          self.expands = []
          if (row) {
            self.expands.push(row.supervisorId);
            self.getPlanDetail()
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
        self.params.roleId = parseInt(self.ModelPost)
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
        self.params.order = {direction: self.direction, property: self.property};
        self.params.roleId = parseInt(self.ModelPost)
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
      async getPlanDetail(e){
        let self = this;
        let params = {}
        let supervisorId=''
        if(e!=undefined){
          supervisorId=e
        }else{
          supervisorId=self.expands[0]
        }
        params.supervisorId = supervisorId;
        params.category = [0,1]
        console.log(params)
        let result = await self.getInspectorPlan(params)
        let storeparams={
          "filter":{
            "page":0,
            "size":1000
          }
        };
        let retData=await self.getStoreData(storeparams);
        let storeList=retData.data.content;
        let errCode = result.errCode;
        if (errCode == 0) {
          let resultData = result.data;
          console.log(resultData)
          resultData.forEach(item=>{
            item.category = item.category== 0 ? self.$t('overview.remotePatrol'): self.$t('overview.onsitePatrol');
            let scheduleStr = '';
            let store=''
            storeList.forEach(store_item=>{
              item.appliedStores.forEach(app_item=>{
                 if(store_item.storeId==app_item){
                    store += store_item.name+ ','
                  }
              })
            })
            item.appliedStores = store
            switch(item.mode){
              // case 0:
              //   item.mode=self.$t('overview.superTaskmode0');
              //   item.schedule.forEach((_item,_index)=>{
              //     scheduleStr += _item.day + ','
              //   })
              //   item.schedule='每天执行'
              //   break;
              case 1:
                item.mode=self.$t('overview.superTaskmode1');
                item.schedule.forEach((_item,_index)=>{
                  let isuu= _index==item.schedule.length-1?'':',';
                  if(self.lang!='en'){
                    if(_item.day==7){
                      _item.day=self.$t('overview.superTaskmode0')
                    }
                    scheduleStr += self.$t('overview.weeks')+_item.day + isuu
                  }else{
                    scheduleStr += self.week[_item.day-1] + isuu
                  }

                })
                if(self.lang!='en'){
                  item.schedule=self.$t('overview.everydays') + scheduleStr + self.$t('overview.act')
                }else{
                  item.schedule=self.$t('overview.act') + scheduleStr + self.$t('overview.everydays')
                }
                break;
              case 2:
                item.mode=self.$t('overview.superTaskmode2');
                item.schedule.forEach((_item,_index)=>{
                  let isuu= _index==item.schedule.length-1?'':',';
                  if(self.lang!='en'){
                    scheduleStr += _item.day + self.$t('overview.daysww')+isuu
                  }else{
                    let idx = _item.day>3?3:_item.day-1;
                      scheduleStr += _item.day+self.month[idx] + isuu
                  }
                })
                if(self.lang!='en'){
                  item.schedule=self.$t('overview.eachmonth') + scheduleStr + self.$t('overview.act')
                }else{
                  item.schedule=self.$t('overview.act') + scheduleStr + self.$t('overview.eachmonth')
                }
                break;
              default:
                item.mode=self.$t('overview.superTaskmode3');
                item.schedule.forEach((_item,_index)=>{
                  let days = moment('20200101').add(_item.day,'days')
                  let isuu= _index==item.schedule.length-1?'':',';
                  if(self.lang!='en'){
                    scheduleStr += days.format('M') +self.$t('overview.superTaskmode2')+days.format('D')+self.$t('overview.superTaskmode0')+ isuu
                  }else{
                    // scheduleStr += self.monthly[_item.day-1]+_item.day+ isuu
                    scheduleStr += days.format('LL')+' '
                  }
                })
                if(self.lang!='en'){
                  item.schedule = scheduleStr + self.$t('overview.act')
                }else{
                  item.schedule = self.$t('overview.act')+scheduleStr
                }
                break;
            }
          })
          self.planTableData=resultData
        }else{
          self.planTableData=[]
        }
      },
      async getScheduleTaskImplementation(e){
        let self = this;
        let params = {};
        let supervisorId=''
        if(e!=undefined){
          supervisorId=e
        }else{
          supervisorId=self.expands[0]
        }
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.supervisorId = supervisorId;
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
      text-align: left;
      .header-mul-select /deep/ .el-input__inner{
        height: calc(35 / 1920 * 100vw);
        min-height: 28px;
      }
      .header-mul-select{
        display: inline-block;
        .mul-label{
          font-size: calc(16/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
          color: $black;
        }
      }
      .header-details{
        text-align: left;
        padding-left: calc(40/1920*100vw);
        position: relative;
        display: inline-block;
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
              min-height: 28px;
              min-width: 120px;
              .btn-area{
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin-right: calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
                }
                .icon-pdf{
                  margin-right: calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
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
                  font-size: calc(24/1920*100vw);
                }
                .icon-pdf{
                  margin-right: calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
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
  .LoadDialog /deep/ .el-dialog__header{
    padding-bottom:0;
  }
  .LoadDialog /deep/ .el-dialog__body{
    padding:0px 20px 30px 20px !important;
  }
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
  }
  .el-table-panel .el-table.el-table--striped.el-table--border.el-table--enable-row-hover.el-table--mini{
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
