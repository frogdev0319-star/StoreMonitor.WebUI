<template>
    <div class="content">
        <div class="head">{{$t('statistics.event.top5')}}</div>
        <div class="table-area">
            <el-table
              :data="table_data"
              :highlight-current-row="false"
              :header-cell-style="{height:'47px',backgroundColor: '#EFF3F5',border:'none',fontSize:'12px'}"
              :cell-style="{height:'62px', backgroundColor: '#EFF3F5',border:'none',fontSize:'15px',borderBottom:'1px solid rgba(172,174,177,0.3)',color:'#484848'}"
              :empty-text="$t('deviceView.noData')"
              align="left"
              :style="isexportPDF ? {'width':'800px'}:{'width': '100%'}"
              class="tbl-IncepItemTop5"
            >
                <el-table-column
                    v-for="(_item,_index) in column_data"
                    :key="_index"
                    :prop="_item.prop"
                    :label="_item.label"
                    :min-width="isexportPDF ? _item.pdfwidth : _item.width "
                >
                <template slot-scope="{row}">
                    <template v-if="_item.isCellClick">
                        <span style="cursor:pointer;color:#006ab7;" @click="cellClick(row,_item.prop)">{{ row[_item.prop]}}</span>
                    </template>
                    <template v-else>
                        <span>{{ row[_item.prop]}}</span>
                    </template>
                </template>
                </el-table-column>
            </el-table>
        <!--<table-pagination
                ref="detail"
                class="tbl-IncepItemTop5"
                :column-data="column_data"
                :table-data="table_data"
                :headerStyle="{height:'47px',backgroundColor: '#EFF3F5',border:'none',fontSize:'12px'}"
                :highlight-current-row= "false"
                :is-event = "false"
                :showPagination = "false"
            />-->
        </div>
    </div>
</template>
<script>
import {getEventList} from '@/api/event';
import TablePagination_V2 from '@/components/TablePagination_V2';
import util from '@/common/util';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import PermissionHelper from '@/api/PermissionHelper';
import { message } from '@/common/singleton-message';
export default {
    name:'IncepItemTop5',
    components: {
        'table-pagination':TablePagination_V2,
    },
    props:{
        storeId:{
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
        },
        isexportPDF: {
            type: Boolean,
            default: false
        },
        inspectTagIds:{
            type:Array,
            required: true
        }
    },
    data(){
        return{
            rowClass:()=>{return {'backgroundColor': '#EFF3F5'}},
            order:{direction:"desc",property:"subject"},
            clause:{storeId:this.storeId},
            column_data:[
                {
                    'prop': 'subject',
                    'label': this.$t('statistics.event.topEventItem'),
                    'sortable': false,
                    'width': '400',
                    'maxWidth': '400',
                    'pdfwidth': '11%',
                    'isExpand': false,
                    'isCellClick':false
                },
                {
                    'prop': 'inspectTagName',
                    'label': this.$t('statistics.event.inceptionTag'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '11%',
                    'isExpand':false,
                    'isCellClick':false
                },
                {
                    'prop': 'num',
                    'label': this.$t('statistics.event.happenAmount'),
                    'sortable': false,
                    'width': '50',
                    'maxWidth': '60',
                    'pdfwidth': '11%',
                    'isExpand':false,
                    'isCellClick':true
                },
                {
                    'prop': 'rate',
                    'label': this.$t('statistics.event.happenRate'),
                    'sortable': false,
                    'width': '50',
                    'maxWidth': '60',
                    'pdfwidth': '11%',
                    'isExpand':false,
                    'isCellClick':false
                }
            ],
            eventData:[],
            table_data:[]
        };
    },
    created(){
        this.getEventDataList();
    },
    methods:{
        doGetEventList(params) { 
            return new Promise((resolve, reject) => {
                getEventList(params).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        async getEventDataList(){
            let params={beginTs:this.beginTs,endTs:this.endTs,clause:this.clause,order:this.order,inspectTagIds:this.inspectTagIds};
            const result = await this.doGetEventList(params);
            //console.log("result:",result);
            this.eventData = result.data.content;
            //console.log("eventData:",this.eventData);
            let eventTotlal=this.eventData.length;
            let unitCount = 0;
            let curSubject = "",curTagName="";
            let eventItem = [];
            this.table_data=[{subject:'',inspectTagName:'',num:0,rate:''}];
            //let eventObj={subject:'',inspectTagName:'',num:0,rate:''};
            //this.eventData.forEach(((item,idx)=>{
            for(var idx=0; idx<this.eventData.length;idx++){
                var item = this.eventData[idx];
                if(idx==0){
                    curSubject = item.subject;
                    curTagName = item.inspectTagName; 
                }
                if(item.subject!=curSubject){
                    let eventObj ={
                        subject : curSubject,
                        inspectTagName : curTagName,
                        num : unitCount,
                        rate : ((unitCount/eventTotlal)*100).toFixed(0)+' %'
                    };
                    eventItem.push(eventObj);
                    unitCount=0;
                    curSubject = item.subject;
                    curTagName = item.inspectTagName; 
                }
                unitCount +=1;
                if(idx==this.eventData.length-1){
                    let eventObj ={
                        subject : curSubject,
                        inspectTagName : curTagName,
                        num : unitCount,
                        rate : ((unitCount/eventTotlal)*100).toFixed(0)+' %'
                    };
                    eventItem.push(eventObj);
                }
            }//));
            util.sortArrayByKeyDesc(eventItem,"num");
            
            this.table_data = [...eventItem.slice( 0, (eventItem.length>5)?5:eventItem.length)];
            
        },
        cellClick(row,prop){
            //console.log("row:",row);
            if(!PermissionHelper.enableEventHandle() && 
                !PermissionHelper.enableEventClose() && 
                !PermissionHelper.enableEventAdd() && 
                !PermissionHelper.enableEventReturn()){
                message({
                    message: this.$i18n.t('route.noEventAuthority'),
                    type: 'error',
                    duration: 5 * 1000
                    });
                return;
            }
            const self = this;
            var params = SearchConditionUtil.getSearchCondition('eventManage');
            const statics_params = SearchConditionUtil.getSearchCondition('eventStatistics');
            const rowItem = row.row;
            
            params.searchParams = {clause : {storeId:[this.storeId],status:[],subject:row.subject},filter:{ page: 0, size: 10 }};
            params.filterStoreIds=[this.storeId];
            params.curStore=[this.storeId];
            params.storeIds=[this.storeId];
            params.curCountry = statics_params.curCountry;
            params.curProvince = statics_params.curProvince;
            params.curCity = statics_params.curCity;
            params.inputSearchValue = "";
            params.curState = [];
            params.activeName = '4';
            params.beginTs=this.beginTs;
            params.endTs=this.endTs;
            params.searchFrom='EventStatistics';
            const searchConditon = {
                path: 'eventManage',
                params: params
            };
            console.log("searchConditon:",searchConditon);
            SearchConditionUtil.saveSearchCondition(searchConditon);
                    //sessionStorage.setItem('event_manage', JSON.stringify(passObj));
            self.$router.push({ name: 'eventManage', params: params});
        }
        
    },
}
</script>
<style lang="scss" scoped>
.content{
    background-color: #EFF3F5;
    .head{
        width: calc(125/1440*100vw);
        height: 18px;
        font-family: NotoSansCJKTC;
        font-size: 13px;
        font-weight: 500;
        text-align: left;
        color: #556679;
    }
    .table-area{
        margin-top:10px;
        width:calc(984/1440*100vw);
        border-top:1px solid rgba(172,174,177,0.3);
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
    }
    .tbl-IncepItemTop5{
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
    
</style>
