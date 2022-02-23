<template>
    <div>
        <div class="tab-area">
            <div class="names">
                <div v-for="item in tabs"
                    class="template-name"
                    :class="{'active-name-btn' : currentTab === item.value}"
                    :key="item.value"
                    @click="onClickBtn(item.value)">
                    {{ item.name }}
                </div>
            </div>
            <div v-show="currentTab != 'NotInspected'" class="operation-btns">
                <delay-button
                    :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
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
        <div v-if="currentTab=='Detail'" class="insep-detail-tbl">
            <el-table
              :data="detailTbl.table_data"
              :highlight-current-row="true"
              :header-cell-style="{height:'47px',backgroundColor: '#EFF3F5',border:'none',fontSize:'12px'}"
              :cell-style="{height:'62px', backgroundColor: '#EFF3F5',border:'none',fontSize:'15px',borderBottom:'1px solid rgba(172,174,177,0.3)',color:'#484848'}"
              :empty-text="$t('deviceView.noData')"
              align="left"
              style="width: 100%"
              class="tbl-TabInspecDetail"
            >
                <el-table-column
                    v-for="(_item,_index) in detailTbl.column_data"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="_item.width"
                >
                <template slot-scope="{row}">
                    <template v-if="_item.isCellClick">
                        <span style="cursor:pointer;color:#006ab7;" @click="handleEmitDetailRowClick(row)">{{ row[_item.prop]}}</span>
                    </template>
                    <template v-else>
                        <span>{{ row[_item.prop]}}</span>
                    </template>
                </template>
                </el-table-column>
            </el-table>
            <tbl-pagination-only
              :total="detailTbl.total"
              :current-page="detailTbl.page"
              :pagesize="detailTbl.sizeNum"
              :btnStyle="{'backgroundColor': '#EFF3F5'}"
              :showPageSize="false"
              @sizeChange="handlePageAndSizeChange_detail"
              @currentChange="handlePageAndSizeChange_detail"
            />
        </div>
        <div v-if="currentTab=='NotInspected'" class="not-inspected">
            <el-row :gutter="20" type="flex" style=" flex-wrap: wrap;overflow-y:auto;" >
                <el-col :span="6" v-for="(store) in notInspectedStores" :key="store.id"> 
                    <div class="store-div">
                        <img :src="shopImg" />
                        <div class="store-name">{{store.storeName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-if="currentTab=='Event'" class="insep-detail-tbl">
            <el-table
              :data="eventTbl.table_data"
              :highlight-current-row="true"
              :header-cell-style="{height:'47px',backgroundColor: '#EFF3F5',border:'none',fontSize:'12px'}"
              :cell-style="{height:'62px', backgroundColor: '#EFF3F5',border:'none',fontSize:'15px',borderBottom:'1px solid rgba(172,174,177,0.3)',color:'#484848'}"
              :empty-text="$t('deviceView.noData')"
              align="left"
              style="width: 100%"
              class="tbl-TabInspecDetail"
            >
                <el-table-column
                    v-for="(_item,_index) in eventTbl.column_data"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="_item.width"
                >
                <template slot-scope="{row}">
                    <template v-if="_item.isCellClick">
                        <span style="cursor:pointer;color:#006ab7;" @click="handleEmitPersonEventRowClick(row)">{{ row[_item.prop]}}</span>
                    </template>
                    <template v-else>
                        <span>{{ row[_item.prop]}}</span>
                    </template>
                </template>
                </el-table-column>
            </el-table>
            <tbl-pagination-only
              :total="eventTbl.total"
              :current-page="eventTbl.page"
              :pagesize="eventTbl.sizeNum"
              :btnStyle="{'backgroundColor': '#EFF3F5'}"
              :showPageSize="false"
              @sizeChange="handlePageAndSizeChange_detail"
              @currentChange="handlePageAndSizeChange_event"
            />
        </div>
    </div>
</template>

<script>
import TablePagination from '@/components/TablePagination_V2';
import { getInspectReportList,getNotInspectStoresByPerson } from '@/api/inspect';
import {GetEventAndCommentList} from '@/api/event';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import util from '@/common/util';
import TblPaginationOnly from '@/components/TblPaginationOnly';
export default {
    name:'TabInceptionDetail',
    components: {
        'table-pagination':TablePagination,TblPaginationOnly
    },
    props:{
        submitter:{
            type: String,
            required: true
        },
        beginTs:{
            type: Number,
            required:true
        },
        endTs:{
            type:Number,
            required: true
        }
    },
    data(){
        return{
            lang: this.$i18n.locale,
            exportPng: require('../../static/img/excel.png'),
            currentTab:'Detail',
            tabs:[{value:'Detail',name:this.$t('statistics.patrolPerson.Detail')},
                    {value:'NotInspected',name:this.$t('statistics.patrolPerson.NotInspected')},
                    {value:'Event',name:this.$t('statistics.patrolPerson.uploadedEvent')}
                ],
            detailTbl:{
                column_data:[
                    {
                    'prop': 'date',
                    'label': this.$t('statistics.patrolPerson.ts'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '11%',
                    'isExpand': false
                    },
                    {
                    'prop': 'storeName',
                    'label': this.$t('statistics.patrolPerson.storeName'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '11%',
                    'isExpand':false
                    },
                    {
                    'prop': 'tagName',
                    'label': this.$t('statistics.patrolPerson.tagName'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '11%',
                    'isExpand':false
                    },
                    {
                    'prop': 'totalScore',
                    'label': this.$t('statistics.patrolPerson.totalScore'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '11%',
                    'isExpand':false
                    },
                    {
                    'prop': 'detail',
                    'label': this.$t('statistics.patrolPerson.operation'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '12%',
                    'isExpand':false,
                    'isCellClick':true
                    }
                ],
                all_data:[],
                table_data:[],
                defaultSort: { prop: 'numOfTotal', order: 'ascending' },
                total:0,
                sizeNum:5,
                page:1,
            },
            notInspectedStores:[],
            shopImg: require('../../static/img/statistics/ic_shop.svg'),
            eventTbl:{
                column_data:[
                    {
                    'prop': 'storeName',
                    'label': this.$t('statistics.patrolPerson.storeName'),
                    'sortable': false,
                    'width': '140',
                    'maxWidth': '140',
                    'pdfwidth': '11%',
                    'isExpand':false
                    },
                    {
                    'prop': 'Unprocessed',
                    'label': this.$t('statistics.patrolPerson.Unprocessed'),
                    'sortable': true,
                    'width': '140',
                    'maxWidth': '140',
                    'pdfwidth': '11%',
                    'isExpand':false
                    },
                    {
                    'prop': 'Inprocess',
                    'label': this.$t('statistics.patrolPerson.Inprocess'),
                    'sortable': true,
                    'width': '140',
                    'maxWidth': '140',
                    'pdfwidth': '11%',
                    'isExpand':false
                    },
                    {
                    'prop': 'Rejected',
                    'label': this.$t('statistics.patrolPerson.Rejected'),
                    'sortable': true,
                    'width': '140',
                    'maxWidth': '140',
                    'pdfwidth': '11%',
                    'isExpand':false 
                    },
                    {
                    'prop': 'Processed',
                    'label': this.$t('statistics.patrolPerson.Processed'),
                    'sortable': true,
                    'width': '140',
                    'maxWidth': '140',
                    'pdfwidth': '11%',
                    'isExpand':false 
                    },
                    {
                    'prop': 'completedRate',
                    'label': this.$t('statistics.patrolPerson.completedRate'),
                    'sortable': true,
                    'width': '140',
                    'maxWidth': '140',
                    'pdfwidth': '11%',
                    'isExpand':false 
                    },
                    {
                    'prop': 'detail',
                    'label': this.$t('statistics.patrolPerson.operation'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '12%',
                    'isExpand':false,
                    'isCellClick':true
                    }
                ],
                all_data:[],
                table_data:[],
                defaultSort: { prop: 'numOfTotal', order: 'ascending' },
                total:0,
                sizeNum:5,
                page:1
            },
            submitterName:"",
            pageSizeOption:[
                {value:5,label:"5 "+this.$t('overview.pageSizeUnit')},
                {value:10,label:"10 "+this.$t('overview.pageSizeUnit')}]
        };
    },
    created(){
        this.getReportList()
    },
    methods:{
      onClickBtn(item){
        this.currentTab = item;
        if(item == "Detail"){

        }else if(item == "NotInspected"){
            this.getNotInspectedStores();
        }else if(item == "Event"){
            this. getEventCompletedRate();
        }
        //this.$emit('click', item)
      },
      getReportList() {
        const self = this;
        self.submitterName = "";
        let params = {beginTs:this.beginTs,endTs:this.endTs,clause:{"submitter":this.submitter}};
        //console.log("params:",params);
        return new Promise((resolve) => {
            getInspectReportList(params).then(res => {
                const errCode = res.errCode;
                let data = [];
                if (errCode === 0) {
                    data = res.data.content;
                }
                //console.log("data:",data);
                const temp = [];
                data.forEach(item => {
                        const reportObj = {};
                        reportObj.id = item.id;
                        reportObj.date = util.getDateStr(item.ts);
                        reportObj.storeName = item.storeName;
                        reportObj.tagName = item.tagName;
                        reportObj.submitterName = item.submitterName;
                        reportObj.submitter = item.submitter;
                        reportObj.totalScore = item.totalScore;
                        reportObj.mode = item.mode;
                        reportObj.status = item.status;
                        reportObj.detail = self.$t('statistics.patrolPerson.seeDetail')
                        temp.push(reportObj);
                    });
                    if(temp.length>0){
                        self.submitterName = temp[0].submitterName;
                        self.detailTbl.all_data = temp;
                        self.detailTbl.total = Math.ceil(temp.length/this.detailTbl.sizeNum);
                        this.setDetailTableData();
                    }
                    resolve(temp);
                }).catch(err => {
                console.log('InspectReportList-getReportList: ' + err);
            });
        });
      },
      setDetailTableData(){
        this.detailTbl.table_data = [];
        this.detailTbl.table_data = [...this.detailTbl.all_data.slice( (this.detailTbl.page - 1)* this.detailTbl.sizeNum, this.detailTbl.page* this.detailTbl.sizeNum)];

      },
      handlePageAndSizeChange_detail(pageObj){
        console.log("handlePageAndSizeChange_detail:",pageObj)
        const self = this;
        self.detailTbl.page = pageObj.page;
        self.detailTbl.sizeNum = pageObj.size;
        self.setDetailTableData();
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      export2Excel(){
        const self = this;
        let table = "", fileName="";
        if(this.currentTab == "Detail"){
            table = self.detailTbl;
            fileName =  table.table_data[0].submitterName+ '_Inspection detail_' + util.getCurDateStr();
        }else if(this.currentTab == "Event"){
            table = self.eventTbl;
            fileName =  self.submitterName+ '_Inspection event_' + util.getCurDateStr();
        }

        if (table.table_data.length === 0) {
            util.notify(self.$t('overview.emptyEventList'), 'warning', 3000);
            return false;
        }
        require.ensure([], async() => {
            const { export_json_to_excel } = require('@/excel/Export2Excel');
            const tHeader = [];
            const filterVal =[];
            table.column_data.forEach(item=>{
                if(item.prop != 'detail'){
                    tHeader.push(item.label);
                    filterVal.push(item.prop);
                }
            });
            //const filterVal = ['province', 'city', 'name', 'percentage', 'numOfStores'];
            const curData = table.table_data;
            const data = self.formatJson(filterVal, curData);
            //const fileName =  table_data[0].submitterName+ '_Inspection detail_' + util.getCurDateStr();
            export_json_to_excel(tHeader, data, fileName);
        });
      },
      handleEmitDetailRowClick(row){ //去巡檢報告詳情
            console.log("row:",row.id);
          const self = this;
          const parsObj = {
            id : row.id,
            storeName : row.storeName,
            status : row.status,
            ts : row.date,
            submitterName : row.submitterName,
            tagName : row.tagName,
            mode : row.mode,
          };
          sessionStorage.setItem('report_data', JSON.stringify(parsObj));
          self.$router.push({ name: 'reportDetails', params: { data: parsObj }});
           
      },
      handleEmitPersonEventRowClick(row){//进入事件列表界面，展示该门店该人员产生的事件
        const self = this;
        const params = SearchConditionUtil.getSearchCondition('eventManage');
        /*let storeIds=[];
        if (Object.keys(searchParams).length > 0) {
            //this.params = searchParams.searchParams;
            storeIds = searchParams.searchParams.storeIds;
        }*/
        console.log("1.",params)
            const rowItem = row;
            //searchParams.searchCondition = JSON.parse(JSON.stringify(this.params))
      params.searchParams.clause ={assigner:this.submitter,storeId:[rowItem.id],status:[]};
      params.filterStoreIds=[rowItem.id];
      params.curStore=[rowItem.id];
      params.storeIds=[rowItem.id];
      params.curCountry = "-1";
      params.curProvince = [];
      params.curCity = [];
      params.inputSearchValue = "";
      params.curState = [];
      params.activeName = '4';
      params.searchParams.filter ={ page: 0, size: 10 };
      params.beginTs=this.beginTs,
      params.endTs=this.endTs
      params.searchFrom='PatrolPersonStat';
      
      console.log("2.",params);
            /*const passObj = {
                inputSearchValue:"",
                curState:[],
                activeName:'4',
                sizeNum:10,
                page:1,  
                curStore:[rowItem.id],
                clause : {assigner:this.submitter,storeId:[rowItem.id]},
                assigner:this.submitter,
                searchFrom:'PatrolPersonStat',
                curStore:rowItem.id,
                beginTs:this.beginTs,
                endTs:this.endTs
            };*/
            const searchConditon = {
                path: 'eventManage',
                params: params
            };
            console.log("searchConditon:",searchConditon);
            SearchConditionUtil.saveSearchCondition(searchConditon);
                    //sessionStorage.setItem('event_manage', JSON.stringify(passObj));
            self.$router.push({ name: 'eventManage', params: params});
      },
      getNotInspectedStores(){
          const self = this;
          let params = {beginTs:this.beginTs,endTs:this.endTs,submitters:[this.submitter]};
          console.log("params:",params);
          return new Promise((resolve) => {
            getNotInspectStoresByPerson(params).then(res => {
                const errCode = res.errCode;
                let data = [];
                if (errCode === 0) {
                    data = res.data[0].storesNotInspected;
                }
                //console.log("data:",data);
                const temp = [];
                data.forEach(item => {
                        const reportObj = {};
                        reportObj.id = item.storeId;
                        reportObj.storeName = item.name;
                        temp.push(reportObj);
                    });
                    self.notInspectedStores = temp;
                    resolve(temp);
                }).catch(err => {
                console.log('InspectReportList-getReportList: ' + err);
            });
        });
      },
      getEventCompletedRate(){
        const self = this;
        let params = {beginTs:this.beginTs,endTs:this.endTs,clause: {assigner:this.submitter},
                        order: {direction: "asc",property: "storeId"}};
        return new Promise((resolve) => {
            GetEventAndCommentList(params).then(res => {
                const errCode = res.errCode;
                let data = [];
                if (errCode === 0) {
                    data = res.data.content;
                }
                //console.log("data:",data);
                const temp = [];
                let tempStorId=data.length>0 ? data[0].storeId:"";
                let tempStorName=data.length>0 ? data[0].name:"";
                // 0-Unprocessed,1-Inprocess,2-Processed,3-Rejected,4-Overdue
                let Unprocessed=0,Inprocess=0,Processed=0,Rejected=0,Overdue=0;
                data.forEach((item,idx) => {
                    if(tempStorId!=item.storeId){
                        const reportObj = {
                            id:tempStorId,
                            storeName:tempStorName,
                            assignerName:item.assignerName,
                            Unprocessed,
                            Inprocess,
                            Processed,
                            Rejected,
                            Overdue,
                            completedRate:((Processed/(Unprocessed+Inprocess+Processed+Rejected+Overdue))*100).toFixed(1)+'%',
                            detail : this.$t('statistics.patrolPerson.seeDetail')
                        };
                        //console.log("reportObj:",reportObj);
                        temp.push(reportObj);
                        Unprocessed=0;Inprocess=0;Processed=0;Rejected=0;Overdue=0;
                        tempStorId = item.storeId;
                        tempStorName = item.name;
                        //assignerName = item.assignerName;
                    }
                        
                    switch(item.status){
                        case 0:
                           Unprocessed+=1;
                           break;
                        case 1: 
                           Inprocess+=1;
                           break;
                        case 2:
                            Processed+=1; //結案
                            break;
                        case 3:   
                            Rejected+=1;
                            break;
                        case 4:
                            Overdue+=1;
                            break;
                    }

                    if(idx==data.length-1){
                        const reportObj = {
                            id:tempStorId,
                            storeId:tempStorId,
                            storeName:tempStorName,
                            Unprocessed,
                            Inprocess,
                            Processed,
                            Rejected,
                            Overdue,
                            completedRate:((Processed/(Unprocessed+Inprocess+Processed+Rejected+Overdue))*100).toFixed(1)+'%',
                            detail : this.$t('statistics.patrolPerson.seeDetail')
                        };
                        temp.push(reportObj);
                    }
                        
                });
                console.log("temp:",temp);
                this.eventTbl.all_data = temp;
                this.eventTbl.total =Math.ceil(temp.length/this.eventTbl.sizeNum);
                this.setEventTableData();
                resolve(temp);
            }).catch(err => {
            console.log('InspectReportList-getReportList: ' + err);
        });
        });
        
      },
      handleEmitComplitedRowClick(row){
          const self = this;
          //sessionStorage.setItem('report_data', JSON.stringify(row));
        //self.$router.push({ name: 'EventStatistics', params: { data: row }});
      },
      setEventTableData(){
        this.eventTbl.table_data = [];
        this.eventTbl.table_data = [...this.eventTbl.all_data.slice( (this.eventTbl.page - 1)* this.eventTbl.sizeNum, this.eventTbl.page* this.eventTbl.sizeNum)];
      },
      handlePageAndSizeChange_event(pageObj){
        const self = this;
        self.eventTbl.page = pageObj.page;
        self.eventTbl.sizeNum = pageObj.size;
        self.setEventTableData();
      }
    },
    
    
}
</script>

<style lang="scss" scoped>
  .tab-area{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-right: 32px;
    .names{
        display: flex;
        flex-direction: row;
        padding: 0;
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
        font-size: 13px;
        margin-top: -5px;
        cursor: pointer;
        border-bottom:1px solid rgba(172,174,177,0.34);
    }
    .ja-export-btn,
    .en-export-btn,
    .export-btn{
      background-color: #EFF3F5;
      color: #006ab7;
    }
  }
  .template-name{
    cursor: pointer;
    width: calc(120/1440*100vw);
    height: 34px;
    line-height: 34px;
    color: #556679;
    padding: 0 5px;
    overflow: hidden;
    text-align: center;
    font-family: NotoSansCJKTC;
    font-size: 13px;
    font-weight: 500;
    background-color: #EFF3F5;

  }
  .active-name-btn{
    color: #006ab7;
    background-color: #f7f9fa;
    border-radius: 4px;
  }
  .insep-detail-tbl{
    background-color: #EFF3F5;
    padding-top: 16.5px;
    padding-bottom: 16.5px;
    border-top:1px solid rgba(172,174,177,0.34);
    .el-table{
        border: none !important;
        box-shadow: none !important;
        &::before{
             background-color: transparent;
        }
        &::after{
             background-color: transparent;
        }
    }
    .table{
      margin: 0 calc(24/1920*100vw);
      background-color: #EFF3F5;
    }
    .tbl-TabInspecDetail{
        background-color: #EFF3F5;
            tbody{
                background-color: #EFF3F5;
            }
        /deep/
        .el-table{
            border: none !important;
            box-shadow: none !important;
            &::before{
                 background-color: transparent;
            }
            &::after{
                 background-color: transparent;
            }
        }
        /deep/
        .el-table--mini{
            background-color: #EFF3F5;
            border-radius: 5px;
        }
        /deep/
        .cell-class{
            background-color: #EFF3F5 !important;
        }
        
    }
  }
  .not-inspected{
    background-color: #EFF3F5;
    padding: 16.5px 24px;
    max-height:300px;
    overflow-y:auto;
    border-top:1px solid rgba(172,174,177,0.34);
    .store-div{
        width: calc(220/1440*100vw);
        height:40px;
        display: flex;
        flex-direction: row;
        align-items:center;
        background-color: #fff;
        border: solid 1px #e6e6e6;
        margin-top:16px;
        img{
            width:26px;
            height: 26px;
            align-self: center;
            margin-left: 16px;
        }
        .store-name{
            margin-left: 8px;
            align-self: center;
            color: #69727c;
            font-size: 15px;
            font-weight: normal;
        }
    }
  }
</style>
