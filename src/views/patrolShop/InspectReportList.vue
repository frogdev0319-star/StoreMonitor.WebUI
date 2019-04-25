<template>
    <el-row id="el-containter">
        <el-col :span="4" class="report-card" v-for="(item,index) in reportList" :key="index">
            <div class="cards">
                <img :src="item.iconSrc" alt="" :height="iconSrcHeight" class="item-img"/>
                <div class="item-header">
                    <img :src="item.inspectSrc" alt="" :height="iconSrcHeight*3/5" class="inspect-img"/>
                    <div class="store-name">
                        <span class="name">{{item.storeName}}</span>
                        <span class="inspect">{{item.inspect}}</span>
                    </div>
                </div>
                <div class="item-content">
                    <span class="assigner">提交人：{{item.assigner}}</span>
                    <span class="datestr">{{item.datestr}}</span>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import {getInspectReportList} from '../../api/inspect'
export default {
    name:'InspectReportList',
    data(){
        return{
            varyWindowWidth:window.innerWidth,
            reportList:[
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                },
                {
                    id:0,
                    storeName:'西安3店',
                    inspect:'现场巡检报告',
                    assigner:'李文武',
                    datestr:'2019/04/24 10:04',
                    iconSrc:require('../../../static/img/总评icon1.png'),
                    inspectSrc:require('../../../static/img/监控icon.png'),
                }
            ]
        }
    },
    computed:{
        iconSrcHeight(){
            return (this.varyWindowWidth/1920)*50;
        }
    },
    methods:{
        getInspectReportList(){
            let self=this;
            getInspectReportList().then(res=>{

            })
        }
    },
    mounted(){
        let self=this;
        self.getInspectReportList();
    }
}
</script>
<style lang="scss" scoped>
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
$qualified:#6097F3;
$noqualied:#FDBA40;
$suggestBack:#F1F6FE;
#el-containter{
    padding-top: calc(60/1920*100vw);
    padding-right: calc(30/1920*100vw);
    .report-card{
        margin-bottom: calc(20/1920*100vw);
        .cards{
            margin-left: calc(20/1920*100vw);
            border: 1px solid $border;
            // width: calc(200/1920*100vw);
            height: calc(240/1920*100vw);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            .item-img{
                position: absolute;
                right: 1px;
                top: 1px;
            }
            .item-header{
                width: 100%;
                margin-top: calc(40/1920*100vw);
                overflow: hidden;
                .inspect-img{
                    margin-left: calc(20/1920*100vw);
                    float: left;
                }
                .store-name{
                    float: left;
                    width: calc(120/1920*100vw);
                    margin-left: calc(20/1920*100vw);
                    text-align: left;
                    .name{
                        font-size: calc(18/1920*100vw);
                        font-weight: bold;
                        display: block;
                        color: $black;
                    }
                    .inspect{
                        
                        font-size: calc(12/1920*100vw);
                        color: $tab;
                    }
                }
            }
            .item-content{
                text-align: left;
                padding-left: calc(20/1920*100vw);
                position: absolute;
                bottom: calc(20/1920*100vw);
                span{
                    font-size: calc(14/1920*100vw);
                    color: $tab;
                    display: block;
                    margin-bottom: calc(15/1920*100vw);
                }
            }
        }
    }
}
</style>

