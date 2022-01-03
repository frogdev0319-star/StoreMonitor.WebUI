<template>
    <div class="content">
        <div class="head">{{$t('statistics.event.top5')}}</div>
        <div class="table-area">
        <table-pagination
                ref="detail"
                :column-data="column_data"
                :table-data="table_data"
                :highlight-current-row= "false"
                :is-event = "false"
                :showPagination = "false"
            />
        </div>
    </div>
</template>
<script>
import {getEventList} from '@/api/event';
import TablePagination from '@/components/TablePagination';
import util from '@/common/util';
export default {
    name:'IncepItemTop5',
    components: {
        'table-pagination':TablePagination,
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
        }
    },
    data(){
        return{
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
                    'isExpand': false
                },
                {
                    'prop': 'inspectTagName',
                    'label': this.$t('statistics.event.inceptionTag'),
                    'sortable': false,
                    'width': '200',
                    'maxWidth': '200',
                    'pdfwidth': '11%',
                    'isExpand':false
                },
                {
                    'prop': 'num',
                    'label': this.$t('statistics.event.happenAmount'),
                    'sortable': false,
                    'width': '50',
                    'maxWidth': '60',
                    'pdfwidth': '11%',
                    'isExpand':false
                },
                {
                    'prop': 'rate',
                    'label': this.$t('statistics.event.happenRate'),
                    'sortable': false,
                    'width': '50',
                    'maxWidth': '60',
                    'pdfwidth': '11%',
                    'isExpand':false
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
            let params={beginTs:this.beginTs,endTs:this.endTs,clause:this.clause,order:this.order};
            const result = await this.doGetEventList(params);
            //console.log("result:",result);
            this.eventData = result.data.content;
            //console.log("eventData:",this.eventData);
            let eventTotlal=this.eventData.length;
            let unitCount = 0;
            let curSubject = "",curTagName="";
            let eventItem = [];
            //let eventObj={subject:'',inspectTagName:'',num:0,rate:''};
            this.eventData.forEach(((item,idx)=>{
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
            }));
            util.sortArrayByKeyDesc(eventItem,"num");
            
            this.table_data = [...eventItem.slice( 0, (eventItem.length>5)?5:eventItem.length)];
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
        width:calc(984/1440*100vw);
    }
}
    
</style>
