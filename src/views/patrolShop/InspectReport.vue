<template>
    <div class="report-container">
        <img :src="reportImgSrc" alt="" class="report-img" :height="reportImgHeight"/>
        <div class="el-header">
            <img class="title-icon" :src="store.iconSrc"/>
            <span class="report-title">{{store.name}}</span>
            <div class="info-content">
                <span class="info-label">提交人：</span>
                <span class="info-value">{{store.assinger}}</span>
                <span class="info-label">报告产生时间：</span>
                <span class="info-value">{{store.date}}</span>
            </div>
        </div>
        <div class="el-acticle">
            <p class="suggest">巡检建议：{{store.suggest}}</p>
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
                            <tr v-for="(item,index) in data" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                                <td class="icon-td"><div class="icon-content"><div class="icon-blag" :style="item.isQua?{'background-color':'#6097F3'}:{'background-color':'#FDBA40'}">{{item.isQua?'合格':'不合格'}}</div> <span class="item-name">{{item.name+'（'+item.count+'）'}}</span></div></td>
                                <td><span>{{item.fine}}</span></td>
                                <td><span>{{item.qualified}}</span></td>
                                <td><span>{{item.unqualified}}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </el-col>
            </el-row>
            <el-row class="row-footer">
                <el-col :span="8" v-for="(item,index) in tempList" :key="index" class="details-content">
                    <div class="details">
                        <div class="item-header">
                            <i class="iconfont" :class="item.iconSrc"></i>
                            <span class="title-lable">{{item.itemTitleName}}</span>
                            <div class="count-content">
                                <span class="count">{{item.itemCount}}</span>
                                <span class="blag">个</span>
                            </div>
                        </div>
                        <div class="item-content">
                            <div class="item-details" v-for="_item in item.itemList" :key="_item.id">
                                <div class="item-blag"></div>
                                <span class="item-name">{{_item.name}}</span>
                                <span class="item-des">{{_item.description}}</span>
                            </div>
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
import {getInspectReportList} from '../../api/inspect'
export default {
    name:'InspectReport',
    components:{
        'v-chart': ECharts
    },
    computed:{
        reportImgSrc(){
            let src='';
            switch(this.store.state){
                case 0: src=require('../../../static/img/总评icon1.png');
                case 1: src=require('../../../static/img/总评icon2.png');
                case 2: src=require('../../../static/img/总评icon3.png');
            }
            return src;
        },
        reportImgHeight(){
            return (this.varyWindowWidth/1920)*100;
        }
    },
    data(){
        return{
            varyWindowWidth:window.innerWidth,
            store:{
                name:'西安5店远程巡检报告',
                assinger:'小明',
                date:'2018/10/17 10:20',
                state:0,
                suggest:'建议对门店整洁度，进行重点关注',
                iconSrc:require('../../../static/img/监控icon.png'),
            },
            data:[
                {
                    name:'门店形象',
                    count:12,
                    fine:8,
                    qualified:4,
                    unqualified:0,
                    isQua:true,

                },
                {
                    name:'员工形象',
                    count:4,
                    fine:2,
                    qualified:2,
                    unqualified:0,
                    isQua:true,
                },
                {
                    name:'门店形象',
                    count:3,
                    fine:2,
                    qualified:0,
                    unqualified:1,
                    isQua:false,
                },
                {
                    name:'门店形象',
                    count:4,
                    fine:2,
                    qualified:0,
                    unqualified:2,
                    isQua:false,
                },
                {
                    name:'门店形象',
                    count:4,
                    fine:2,
                    qualified:0,
                    unqualified:2,
                    isQua:false,
                },
               {
                    name:'门店形象',
                    count:3,
                    fine:2,
                    qualified:0,
                    unqualified:1,
                    isQua:false,
                },
            ],
            tempList:[
                {
                    id:'0',
                    itemTitleName:'重点关注项目',
                    iconSrc:'',
                    itemCount:12,
                    itemList:[
                        {
                            id:'0',
                            name:'24小时不断电'
                        },
                        {
                            id:'1',
                            name:'按要求张贴海报'
                        },
                        {
                            id:'2',
                            name:'24小时不断电'
                        },
                        {
                            id:'3',
                            name:'按要求张贴海报'
                        },
                        {
                            id:'4',
                            name:'24小时不断电'
                        },
                    ]
                },
                {
                    id:'1',
                    itemTitleName:'忽略问题',
                    iconSrc:'',
                    itemCount:1,
                    itemList:[
                        {
                            id:'0',
                            name:'24小时不断电'
                        },
                        {
                            id:'1',
                            name:'按要求张贴海报'
                        },
                        {
                            id:'2',
                            name:'24小时不断电'
                        },
                    ]
                },
                {
                    id:'2',
                    itemTitleName:'反馈问题',
                    iconSrc:'',
                    itemCount:1,
                    itemList:[
                        {
                            id:'0',
                            name:'24小时不断电',
                            description:'24小时不断电24小时不断电按要求张贴海报'
                        },
                        {
                            id:'1',
                            name:'24小时不断电'
                        },
                    ]
                }
            ],
            options:null,
            theaderList:[
               {
                    name:'项目',
               },
               {
                   name:'优良项'
               },
               {
                   name:'合格项'
               },
               {
                   name:'不合格项'
               }
            ]
        }
    },
    methods:{
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
            self.data.forEach(item => {
                let obj={};
                obj.name=item.name;
                obj.max=item.count*2;
                tempIndicator.push(obj);
                seriesValue.push(item.fine*2+item.qualified);
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
        self.getRadarOption();
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
                min-height: calc(320/1920*100vw);
                border:1px solid $border;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .item-header{
                    position: relative;
                    background-color: $background;
                    height: calc(40/1920*100vw);
                    border-bottom: 1px solid $border;
                    padding-left: calc(20/1920*100vw);
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

                    .item-details{
                        height: auto;
                        font-size: calc(14/1920*100vw);
                        padding-left: calc(30/1920*100vw);
                        margin-top: calc(20/1920*100vw);
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
                        }
                    }
                }
                .border-content{
                    position: absolute;
                    height: 60%;
                    width: 1px;
                    background-color: $border;
                    right: calc(10/1920*100vw);
                    top: calc(60/1920*100vw);
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
</style>
