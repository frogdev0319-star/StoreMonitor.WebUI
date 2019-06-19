<template>
    <div class="report-container">
        <img :src="report.iconSrc" alt="" class="report-img" :height="reportImgHeight"/>
        <div class="el-header">
            <img class="title-icon" :src="report.inspectSrc"/>
            <span class="report-title">{{report.storeName+report.tagName}}</span>
            <div class="info-content">
                <span class="info-label">{{generateReportLang('submitter')}}</span>
                <span class="info-value">{{report.submitterName}}</span>
                <span class="info-label">{{generateReportLang('generateTime')}}</span>
                <span class="info-value">{{report.dateStr}}</span>
            </div>
        </div>
        <div class="el-acticle">
            <p class="suggest" v-if="suggest!=null&&suggest.length!=0">{{generateReportLang('advice')}}{{suggest}}</p>
            <el-row class="report-content" :gutter="40">
                <el-col :span="8" class="radior-content">
                    <v-chart :options="options" class="chart-content" :auto-resize='true'/>
                </el-col>
                <el-col :span="16" class="report-table">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col" v-for="(item ,index) in theaderList" :key="index">{{item.name}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in summary" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                                <td class="icon-td"><div class="icon-content"><div class="icon-blag"
                                   :style="item.isQua?{'background-color':'#6097F3'}:{'background-color':'#FDBA40'}">
                                  {{item.isQua? pass: failed}}</div> <span class="item-name">{{item.groupName+'（'+item.count+'）'}}</span></div></td>
                                <td><span>{{item.numOfExcellentItems}}</span></td>
                                <td><span>{{item.numOfQualifiedItems}}</span></td>
                                <td><span>{{item.numOfUnqualifiedItems}}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </el-col>
            </el-row>
            <el-row class="row-footer">
                <el-col :span="8" v-for="(item,index) in tempList" :key="index" class="details-content">
                    <div class="details">
                        <div class="item-header">
                            <i class="iconfont icontemp" :class="item.iconSrc"></i>
                            <span class="title-lable">{{item.itemTitleName}}</span>
                            <div class="count-content">
                                <span class="count">{{item.itemCount}}</span>
                                <span class="blag">{{generateReportLang('unit')}}</span>
                            </div>
                        </div>
                        <div class="item-content">
                            <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                                <div class="item-details" v-for="_item in item.itemList" :key="_item.id">
                                    <div class="item-blag"></div>
                                    <span class="item-name">{{index!=2?_item.name:_item.subject}}</span>
                                    <span class="item-des">{{_item.description}}</span>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/radar'
import {getInspectReportList,getInspectReportInfo} from '../../api/inspect'
import util from '@/common/util'
import {generateReportLang} from '@/api/i18n'

export default {
    name:'InspectReport',
    components:{
        'v-chart': ECharts
    },
    computed:{
        reportImgHeight(){
            return (this.varyWindowWidth/1920)*100;
        }
    },
    data(){
        return{
            reportId:0,
            varyWindowWidth:window.innerWidth,

            videoSrc:require('../../../static/img/监控icon.png'),
            inspectSrc:require('../../../static/img/远程icon.png'),
            insiteInspectSrc:require('../../../static/img/现场icon.png'),

            inspectSrc1:require('../../../static/img/总评icon1.png'),
            inspectSrc2:require('../../../static/img/总评icon2.png'),
            inspectSrc3:require('../../../static/img/总评icon3.png'),
            inspectSrc4:require('../../../static/img/总评icon4.png'),
            inspectSrc5:require('../../../static/img/总评icon5.png'),
            inspectSrc6:require('../../../static/img/总评icon6.png'),
            inspectSrc7:require('../../../static/img/总评icon7.png'),
            report:null,
            suggest:'',
            summary:[],
            tempList:[],
            options:null,
            theaderList:[
               {
                    name: this.$t('reportView.items'),
               },
               {
                   name: this.$t('reportView.goodItem')
               },
               {
                   name: this.$t('reportView.passItem')
               },
               {
                   name: this.$t('reportView.failedItem')
               }
            ],
          pass: this.$t('reportView.pass'),
          failed: this.$t('reportView.failed'),
          lang: this.$i18n.locale
        }
    },
    methods:{
        generateReportLang,
        getRouterData(){
            let self=this;
            let routeData=JSON.parse(sessionStorage.getItem('report_data'));
            let obj={};
            obj.reportId=routeData.id;
            obj.storeName=routeData.storeName;
            obj.status=routeData.status;
            obj.dateStr=util.getDateStr(routeData.ts);
            obj.submitterName=routeData.submitterName;
            obj.tagName=routeData.tagName;
            switch(routeData.mode){
                case 0: obj.inspectSrc=self.inspectSrc; break;
                case 1: obj.inspectSrc=self.insiteInspectSrc; break;
                default:obj.inspectSrc=self.videoSrc; break;
            }
            switch(routeData.status){
                // case 0: {
                //   obj.iconSrc=self.inspectSrc1;
                //   break;
                // }
                // case 1: {
                //   obj.iconSrc=self.inspectSrc3;
                //   break;
                // }
                // default:{
                //   obj.iconSrc=self.inspectSrc2;
                //   break;
                // }
              /**
               * 根据语言和类型返回图片形式
               */
              case 0: {
                // 立即督导
                if(self.lang == 'zh'){
                  obj.iconSrc=self.inspectSrc1;
                }
                else if(self.lang == 'en'){
                  obj.iconSrc=self.inspectSrc4;
                }
                else if(self.lang == 'zhtw'){
                  obj.iconSrc=self.inspectSrc7;
                }
                else {
                  obj.iconSrc=self.inspectSrc1;
                }
                break;
              }
              case 1: {
                // 待改善
                if(self.lang == 'zh'){
                  obj.iconSrc=self.inspectSrc3;
                }
                else if(self.lang == 'en'){
                  obj.iconSrc=self.inspectSrc6;
                }
                else if(self.lang == 'zhtw'){
                  obj.iconSrc=self.inspectSrc3;
                }
                else {
                  obj.iconSrc=self.inspectSrc3;
                }
                break;
              }

              default:{
                //合格
                if(self.lang == 'zh'){
                  obj.iconSrc=self.inspectSrc2;
                }
                else if(self.lang == 'en'){
                  obj.iconSrc=self.inspectSrc4;
                }
                else if(self.lang == 'zhtw'){
                  obj.iconSrc=self.inspectSrc2;
                }
                else {
                  obj.iconSrc=self.inspectSrc2;
                }
                break;
              }
            }
            self.report=obj;
        },
        async getReportInfo(){
            let self=this;
            let reportId=self.report.reportId;
            let temp=[];
            temp.push(reportId);
            let params={
                reportIds:temp
            };
            getInspectReportInfo(params).then(res=>{
                console.log(res);
                let data=res.data[0].info;
                self.suggest=data.comment;
                let summary=data.summary;
                let summaryTemp=[];
                summary.forEach(item=>{
                    let obj={};
                    obj.groupId=item.groupId;
                    obj.groupName=item.groupName;
                    obj.count=item.numOfTotalItems;
                    obj.isQua=item.result==1?true:false;
                    obj.numOfExcellentItems=item.numOfExcellentItems;
                    obj.numOfQualifiedItems=item.numOfQualifiedItems;
                    obj.numOfUnqualifiedItems=item.numOfUnqualifiedItems;
                    summaryTemp.push(obj);
                })
                self.summary=summaryTemp;
                let tempArray=new Array(3);
                tempArray[0]={
                    itemTitleName: this.$t('reportView.notableItem'),
                    iconSrc:'icon-zhongxindingwei',
                    itemCount:data.focalItems.length,
                    itemList:data.focalItems
                }
                tempArray[1]={
                    itemTitleName: this.$t('reportView.ignoredItem'),
                    iconSrc:'icon-hulve',
                    itemCount:data.ignoredItems.length,
                    itemList:data.ignoredItems
                }
                tempArray[2]={
                    itemTitleName: this.$t('reportView.feedbacks'),
                    iconSrc:'icon-fankui',
                    itemCount:data.feedback.length,
                    itemList:data.feedback
                }
                self.tempList=tempArray;
                self.getRadarOption();
            })
        },
        getRadarOption(){
            let self=this;
            let options={
                backgroundColor: '#fff',
                title: {
                    text: '巡检项雷达图'
                },
                tooltip: {},
                legend: {
                    data: ['inspect radar']
                },
                radar: {
                    name: {
                        textStyle: {
                            color: '#7d8cad',
                            backgroundColor: '#fff',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [],
                    splitArea : {
                        show : false,
                        areaStyle : {
                            color: 'rgba(255,0,0,0)', // 图表背景的颜色
                        },
                    },

                },
                series: {
                    name: '巡检项',
                    type: 'radar',
                    data : [],
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: '#FDBA40',
                                width:4
                            },
                            areaStyle:{
                                color:'#D7E5FD'
                            }
                        },
                    },

                }
            };
            let tempIndicator=[];
            let seriesValue=[];
            self.summary.forEach(item => {
                let obj={};
                obj.name=item.groupName;
                obj.max=item.count*2;
                tempIndicator.push(obj);
                seriesValue.push(item.numOfExcellentItems*2+item.numOfQualifiedItems);
            });
            let temp=[];
            let obj={value:seriesValue};
            temp.push(obj);
            options.radar.indicator=tempIndicator;
            options.series.data=temp;
            if(tempIndicator.length<6){
                options.radar.splitNumber=tempIndicator.length;
            }
            else{
                options.radar.splitNumber=5;
            }
            self.options=options;
        }
    },
    mounted(){
        let self=this;
        self.getRouterData();
        self.getReportInfo();
        //self.getRadarOption();
    }
}
</script>
<style lang="scss" scoped>
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
$qualified:#6097F3;
$noqualied:#FDBA40;
$suggestBack:#F1F6FE;
.report-container{
    width: 100%;
    height: 100%;
    color: $black;
    position: relative;
    .report-img{
        position: absolute;
        right: 2px;
        top: 2px;
    }
    .el-header{
        width: 100%;
        height: calc(80/1920*100vw);
        text-align: left;
        border-bottom: 1px solid $border;
        line-height: calc(90/1920*100vw);
        padding-left: calc(30/1920*100vw);
        position: relative;
        .report-title{
            font-size: calc(20/1920*100vw);
            font-weight: bold;
            margin-left: calc(20/1920*100vw);
        }
        .info-content{
            position: absolute;
            right: calc(110/1920*100vw);
            top: 0;
            font-size: calc(12/1920*100vw);
            .info-label{
                margin-left: calc(40/1920*100vw);
                color: $tab;
            }
            .info-value{
                color: $tab;
            }
        }
    }
    .el-acticle{
        text-align: left;
        padding-left: calc(40/1920*100vw);
        padding-right: calc(40/1920*100vw);
        .suggest{
            margin-top: calc(20/1920*100vw);
            font-size: calc(14/1920*100vw);
            font-weight: bold;
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            background-color: $suggestBack;
            color: $qualified;
            padding-left: calc(30/1920*100vw);
            border: 1px solid #a0c1f8;

        }
        .report-content{
            margin-top: calc(30/1920*100vw);
            .radior-content{
                height: calc(300/1920*100vw);
                .chart-content{
                    width: 100%;
                    height: 100%;
                }
                @media screen and (min-width:1280px) and(max-width:1440px){
                    height: calc(360/1920*100vw);
                }
            }
            .report-table{
                font-size: calc(14/1920*100vw);
                th{
                    color: $tab;
                    background-color: $background;
                    text-align: center;
                    border-bottom-width: 1px;
                    padding:0.5rem;
                    &:first-child{
                        width: 40%;
                    }
                    &:not(:first-child){
                        width: 20%;
                        text-align: left;
                        padding-left: 1rem;
                    }
                }
                td{
                    color: $black;
                    padding-top:0.5rem;
                    padding-bottom: 0.5rem;
                    padding-left: 1rem;
                }
                .icon-td{
                    text-align: center;
                }
                .icon-content{
                    text-align: left;
                    margin-left: 20%;
                }
                .icon-blag{
                    display: inline-block;
                    width: calc(80/1920*100vw);
                    padding:3px 6px;
                    text-align: center;
                    color: #fff;
                    font-size: calc(12/1920*100vw);
                    margin-right: calc(40/1920*100vw);
                }
            }
        }
        .row-footer{
            padding-top: calc(30/1920*100vw);
            border-top: 1px solid $border;
            padding-bottom: calc(30/1920*100vw);
            margin-top: calc(10/1920*100vw);
            .details-content{
                padding-right: calc(20/1920*100vw);
                &:last-child{
                    padding-right:0;
                }
            }
            .details{
                position: relative;
                height: calc(320/1920*100vw);
                border:1px solid $border;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .item-header{

                    position: relative;
                    background-color: $background;
                    height: calc(40/1920*100vw);
                    line-height: calc(40/1920*100vw);
                    border-bottom: 1px solid $border;
                    padding-left: calc(20/1920*100vw);
                    .icontemp{
                        font-size: calc(18/1920*100vw);
                        margin-right: calc(15/1920*100vw);
                        color: $tab;
                    }
                    .title-lable{
                        font-size: calc(14/1920*100vw);
                        font-weight: bold;
                    }
                    .count-content{
                        position:absolute;
                        right: calc(20/1920*100vw);
                        top: 0;
                        .count{
                            font-size: calc(30/1920*100vw);
                        }
                        .blag{
                            font-size: calc(12/1920*100vw);
                        }
                    }
                }
                .item-content{
                    padding-top: calc(20/1920*100vw);
                    height:  calc(280/1920*100vw);
                    .item-details{
                        height: auto;
                        font-size: calc(14/1920*100vw);
                        padding-left: calc(30/1920*100vw);
                        padding-right: calc(20/1920*100vw);
                        margin-bottom:calc(30/1920*100vw);
                        color: #4b5262;
                        .item-blag{
                            width: calc(12/1920*100vw);
                            height: calc(12/1920*100vw);
                            border-radius: 50%;
                            background-color: $tab;
                            display: inline-block;
                            margin-right: calc(16/1920*100vw);
                        }
                        .item-des{
                            display: block;
                            font-size: calc(12/1920*100vw);
                            margin-top: calc(10/1920*100vw);
                            margin-left: calc(35/1920*100vw);
                            color: $tab;
                        }
                    }
                }
            }
        }
    }
}
</style>
<style>
    .echarts{
        width: 100%;
        height: 100%;
    }
    .el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
