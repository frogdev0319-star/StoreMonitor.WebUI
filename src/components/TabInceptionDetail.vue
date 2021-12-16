<template>
    <div>
        <div class="names">
            <div v-for="item in tabs"
            class="template-name"
            :class="{'active-name-btn' : currentTab === item.value}"
            :key="item.value"
            @click="onClickBtn(item.value)">
            {{ item.name }}
            </div>
        </div>
        <div v-if="currentTab=='Detail'" class="insep-detail-tbl">
            <table-pagination
                ref="detail"
                :column-data="detailTbl.column_data"
                :table-data="detailTbl.table_data"
                :highlight-current-row= "true"
                :is-event = "false"
                :showPagination = "false"
                @emitRowClick="handleEmitDetailRowClick"
            />
        </div>
        <div v-if="currentTab=='NotInspected'" class="not-inspected">
            <el-row :gutter="20" type="flex" style=" flex-wrap: wrap" >
                <el-col :span="6" v-for="(store) in notInspectedStores" :key="store.id"> 
                    <div class="store-div">
                        <img :src="shopImg" />
                        <div class="store-name">{{store.storeName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-if="currentTab=='Event'" class="insep-detail-tbl">
            <table-pagination
                ref="detail"
                :column-data="eventTbl.column_data"
                :table-data="eventTbl.table_data"
                :highlight-current-row= "true"
                :is-event = "false"
                :showPagination = "true"
                @emitRowClick="handleEmitComplitedRowClick"
                layout = "prev,pager,next"
            />
        </div>
    </div>
</template>

<script>
import TablePagination from '@/components/TablePagination';
import { getInspectReportList,getNotInspectStoresByPerson } from '@/api/inspect';
import {GetEventAndCommentList} from '@/api/event';
import util from '@/common/util';
export default {
    name:'TabInceptionDetail',
    components: {
        'table-pagination':TablePagination,
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
                    'formatter':function(obj){
                        //console.log(obj);
                        const html = `<div style="cursor:pointer;color:#006ab7;font-size:15px" >${obj}</div>`
                        return html;//(`<a href="https://www.w3schools.com">${obj}</a>`)
                    }
                    }
                ],
                table_data:[],
                defaultSort: { prop: 'numOfTotal', order: 'ascending' },
                
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
                    'formatter':function(obj){
                        const html = `<div style="cursor:pointer;color:#006ab7;font-size:15px" >${obj}</div>`
                        return html;
                    }
                    }
                ],
                table_data:[],
                defaultSort: { prop: 'numOfTotal', order: 'ascending' },
            }
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
                        reportObj.detail = self.$t('statistics.patrolPerson.seeDetail')
                        temp.push(reportObj);
                    });
                    self.detailTbl.table_data = temp;
                    resolve(temp);
                }).catch(err => {
                console.log('InspectReportList-getReportList: ' + err);
            });
        });
      },
      handleEmitDetailRowClick(row){
          const self = this;
            sessionStorage.setItem('report_data', JSON.stringify(row));
            self.$router.push({ name: 'reportDetails', params: { data: row }});
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
                //console.log("temp:",temp);
                this.eventTbl.table_data = temp;
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
    },
    
    
}
</script>

<style lang="scss" scoped>
  .names{
    display: flex;
    flex-direction: row;
    padding: 0;
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
    background-color: #fff;
  }
  .insep-detail-tbl{
    background-color: #EFF3F5;
    padding-top: 16.5px;
    padding-bottom: 16.5px;
    .table{
      margin: 0 calc(24/1920*100vw);
      background-color: #f7f9fa;
    }
  }
  .not-inspected{
    background-color: #EFF3F5;
    padding: 16.5px 24px;
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
