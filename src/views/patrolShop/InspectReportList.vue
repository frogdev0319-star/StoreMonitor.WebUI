<template>
    <el-row id="el-containter">
        <el-col :span="24" class="report-header">
            <el-col :span="24" class="header-details">
                <span>门店选择</span>
                <el-select v-model="curCountry" clearable  placeholder="国家/地区" size="mini" 
                class="el-province" @change="changeCountry" @clear="clearCountry">
                    <el-option
                    v-for="item in countryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="curProvince" clearable  placeholder="区域一" size="mini" :disabled='curCountry.length==0'
                class="el-province" @change="changePro" @clear="cleaPro">
                    <el-option
                    v-for="item in provinceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="curCity" clearable  placeholder="区域二" size="mini" :disabled='curProvince.length==0'
                class="el-province" @change="changeCity" @clear="clearCity">
                    <el-option
                    v-for="item in cityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select multiple collapse-tags v-model="curStore" clearable  placeholder="门店" size="mini" 
                class="el-province select-store" @change="changeStore" @clear="clearStore">
                    <el-option
                    v-for="item in storeDataList"
                    :key="item.storeId"
                    :label="item.label"
                    :value="item.storeId">
                    </el-option>
                </el-select>
                <div class="search-content" v-if="searchContent">
                    <span>关键词</span>
                    <el-input size="mini" v-model="searchInput" class="search-input" clearable="true"></el-input>
                </div>
            </el-col>
            <el-col :span="24" class="header-details">
                <span>起止时间</span>
                <el-date-picker
                    ref="datePicker"
                    v-model="dateValue"
                    type="datetimerange"
                    range-separator="~"
                    size="mini"
                    :clearable=false
                    :editable=false
                    format="yyyy/MM/dd HH:mm:ss"
                    class="date-range"
                    :picker-options='dateOpt'
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="dateChange"
                    @focus="dateFocus"
                    :popper-class="poperClass"
                    :default-time="defaultTime">
                </el-date-picker>
                <el-tooltip class="item" effect="dark"
                    placement="bottom-end">
                    <div slot="content">*最长搜索时间为一个月</div>
                    <i class="iconfont icon-bangzhu iconbangzhu"></i>
                </el-tooltip>
                <span>报表类型</span>
                <el-select v-model="curReportType" clearable  placeholder="全部" size="mini" 
                    class="el-province" @change="changeReportType" @clear="clearReportType">
                    <el-option
                    v-for="item in reportTypeList"
                    :key="item.mode"
                    :label="item.label"
                    :value="item.mode">
                    </el-option>
                </el-select>
                <span>总评类型</span>
                <el-select v-model="curAppraise" clearable  placeholder="全部" size="mini" 
                    class="el-province " @change="changeAppraise" @clear="clearAppraise">
                    <el-option
                    v-for="item in appraiseList"
                    :key="item.status"
                    :label="item.label"
                    :value="item.status">
                    </el-option>
                </el-select>
                 <div class="search-content" v-if="!searchContent">
                    <span>关键词</span>
                    <el-input size="mini" v-model="searchInput" class="search-input" clearable="true"></el-input>
                </div>
                <el-button size="mini" class="search-btn" @click="searchData" type="primary">搜索</el-button>
            </el-col>
            <el-col :span="24" class="header-details">
                <span class="choice-store"><i class="iconfont icon-tishi1"></i>已选门店：<span style="margin-left:20px;">{{storeStr}}</span></span>
            </el-col>
        </el-col>
        <el-col :span="24" class="report-content">
            <el-row class="card-content">
                <el-col :span="24" class="card-header" v-if="reportList.length!=0">
                    <el-radio v-model="curSortType" v-for="(item,index) in sortTypeList" :key="index" :label="item.id" @change="checkSortType">
                        <span class="sort-name">{{item.name}}</span>
                    </el-radio>
                </el-col>
                <el-col :span="4" class="report-card" v-for="(item,index) in reportList" :key="index">
                    <div class="cards" @click="clickReport(item,index)">
                        <img :src="item.iconSrc" alt="" :height="iconSrcHeight" class="item-img"/>
                        <div class="item-header">
                            <!-- <img :src="item.inspectSrc" alt="" :height="iconSrcHeight*3/5" class="inspect-img"/> -->
                            <div class="store-name">
                                <span class="name">{{item.storeName}}</span>
                                <span class="inspect">{{item.tagName}}</span>
                            </div>
                        </div>
                        <div class="item-icon">
                            <i class="iconfont inspectIcon" :class="item.mode==0?'icon-yuanchengxunjian':'icon-xianchangxunjian'"></i>
                        </div>
                        <div class="item-content">
                            <span class="assigner">提交人：{{item.submitterName}}</span>
                            <span class="datestr">{{item.datestr}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="24" class="el-pat">
                    <el-pagination background small 
                        @current-change="currentChange"
                    layout="jumper,total, prev, pager, next"  
                    :page-size="sizeNum" :total="total" 
                    :current-page="page"
                    class="el-pag">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>
import {getInspectReportList} from '@/api/inspect'
import {getStoreList} from '@/api/store'
import util from '@/common/util'
import {Message} from 'element-ui'
export default {
    name:'InspectReportList',
    data(){
        return{
            varyWindowWidth:window.innerWidth,
            varyWindowHeight:window.innerHeight,
            videoSrc:require('../../../static/img/监控icon.png'),
            inspectSrc:require('../../../static/img/远程icon.png'),
            insiteInspectSrc:require('../../../static/img/现场icon.png'),
            searchContent:false,
            inspectSrc1:require('../../../static/img/总评icon1.png'),
            inspectSrc2:require('../../../static/img/总评icon2.png'),
            inspectSrc3:require('../../../static/img/总评icon3.png'),
            reportList:[],
            curSortType:0,
            sortTypeList:[
                {
                    id:0,
                    name:'按时间排序'
                },
                {
                    id:1,
                    name:'按总评严重等级排序'
                },
                {
                    id:2,
                    name:'按门店名称排序'
                }
            ],

            curCountry:'',
            countryList:[],
            curProvince:'',
            provinceList:[],
            curCity:'',
            cityList:[],
            curStore:[],
            storeList:[],
            searchInput:'',
            sizeNum:12,
            defaultTime:[],
            dateValue:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24),new Date()],
            dateOpt: {
                disabledDate:(time)=>{
                    return time.getTime() > Date.now();
                }
            },
            curReportType:'',
            reportTypeList:[
                {'mode':0,'label':'远程巡检'},{'mode':1,'label':'现场巡检'}
            ],
            curAppraise:'',
            appraiseList:[
                {'status':0,'label':'立即督导'},{'status':1,'label':'待改善'},{'status':2,'label':'合格'}
            ],
            storeStr:'',
            total: 0,
            page:0,
            params:{},
            storeDataList:[],
            storeIdList:[],  //存放当前选中的门店id
            poperClass:'date-picker-poper',
        }
    },
    computed:{
        iconSrcHeight(){
            return (this.varyWindowWidth/1920)*50;
        },
        // defaultTime(){
        //     let date=new Date();
        //     let hour=date.getHours()<10?'0'+date.getHours():date.getHours();
        //     let minutes=date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        //     let second=date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
        //     let dateStr=hour+':'+minutes+':'+second;
        //     let timeTemp=[];
        //     timeTemp[0]=dateStr;
        //     timeTemp[1]=dateStr;
        //     return timeTemp;
        // }
        // sizeNum(){
        //     let size=0;
        //     if((this.varyWindowHeight/this.varyWindowWidth)>=0.625){
        //         size=18;
        //     }
        //     else{
        //         size=12;
        //     }
        //     return size;
        // }
    },
    methods:{
        changeBrand(){
            let self=this;
            self.curCountry='';
            self.countryList=[];
            self.curProvince='';
            self.provinceList=[];
            self.curCity='';
            self.cityList=[];
            self.curStore=[];
            self.storeList=[];
            self.searchInput='';

        },
        getReportList(params){
            let self=this;
            getInspectReportList(params).then(res=>{
                let errCode=res.errCode;
                let data=[];
                if(errCode==0){
                    data=res.data.content;
                }
                let temp=[];
                data.forEach(item => {
                    let obj={};
                    obj.id=item.id;
                    obj.datestr=util.getDateStr(item.ts);
                    obj.storeName=item.storeName;
                    obj.tagName=item.tagName;
                    obj.submitterName=item.submitterName;
                    obj.submitter=item.submitter;
                    obj.routeObj=item;
                    obj.mode=item.mode;

                    switch(item.status){
                        case 0: obj.iconSrc=self.inspectSrc1; break;
                        case 1: obj.iconSrc=self.inspectSrc3; break;
                        default:obj.iconSrc=self.inspectSrc2; break;
                    }
                    temp.push(obj);
                });
                self.reportList=temp;
                self.total=res.data.totalElements;
            })
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
        getInitReportList(){
            let self=this;
            let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
            let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
            self.params.beginTs=start;
            self.params.endTs=end;
            self.params.filter={page:0,size:self.sizeNum};
            self.getReportList(self.params);
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
                    userName:item.userName
                }
                tempStore.push(obj);
            })
            self.storeDataList=tempStore;
            self.countryList=countryList;
        },
        clearStoreInfo(){
            let self=this;
            self.curStore=[];
            self.storeStr='';
        },
        changeCountry(val){
            let self=this;
            console.log(val);
            self.clearStoreInfo();

            let storeList=self.storeList;
            let temp=[];
            let tempStore=[];
            storeList.forEach(item=>{
                if(item.country==val){
                    if(temp.map(x=>x.value).indexOf(item.province)==-1){
                        let obj={
                            label:item.province,
                            value:item.province
                        }
                        temp.push(obj);
                    }
                    let obj={
                        storeId:item.storeId,
                        label:item.name,
                        value:item.name,
                        userId:item.userId,
                        userName:item.userName
                    };
                    tempStore.push(obj);
                }
            })
            self.provinceList=temp;
            self.storeDataList=tempStore;

        },
        clearCountry(){
            let self=this;
            self.curProvince='';
            self.curCity='';
            self.clearStoreInfo();

            let storeList=self.storeList;
            let tempStore=[];
            storeList.forEach(item=>{
                let obj={
                    storeId:item.storeId,
                    label:item.name,
                    value:item.name,
                    userId:item.userId,
                    userName:item.userName
                }
                tempStore.push(obj);
            })
            self.storeDataList=tempStore;

        },
        changePro(val){
            let self=this;
            self.curCity='';
            self.clearStoreInfo();

            let storeList=self.storeList;
            let temp=[];
            let tempStore=[];
            storeList.forEach(item=>{
                if(item.province==val){
                    if(temp.map(x=>x.value).indexOf(item.city)==-1){
                        let obj={
                            label:item.city,
                            value:item.city
                        }
                        temp.push(obj);
                    }
                    let obj={
                        storeId:item.storeId,
                        label:item.name,
                        value:item.name,
                        userId:item.userId,
                        userName:item.userName
                    };
                    tempStore.push(obj);
                }
            })
            self.cityList=temp;
            self.storeDataList=tempStore;
        },
        cleaPro(){
            let self=this;
            self.curCity='';
            self.clearStoreInfo();

            let storeList=self.storeList;
            let temp=[];
            let tempStore=[];
            storeList.forEach(item=>{
                if(item.country==self.curCountry){
                    if(temp.map(x=>x.value).indexOf(item.province)==-1){
                        let obj={
                            label:item.province,
                            value:item.province
                        }
                        temp.push(obj);
                    }
                    let obj={
                        storeId:item.storeId,
                        label:item.name,
                        value:item.name,
                        userId:item.userId,
                        userName:item.userName
                    };
                    tempStore.push(obj);
                }
            })
            self.provinceList=temp;
            self.storeDataList=tempStore;
        },
        changeCity(val){
            let self=this;
            self.clearStoreInfo();

            let storeList=self.storeList;
            let temp=[];
            storeList.forEach(item=>{
                if(item.city==val){
                    if(temp.map(x=>x.value).indexOf(item.city)==-1){
                        let obj={
                            storeId:item.storeId,
                            label:item.name,
                            value:item.name,
                            userId:item.userId,
                            userName:item.userName
                        }
                        temp.push(obj);
                    }
                }
            })
            self.storeDataList=temp;
        },
        clearCity(){
            let self=this;
            self.clearStoreInfo();

            let storeList=self.storeList;
            let tempStore=[];
            storeList.forEach(item=>{
                if(item.province==self.curProvince){
                    let obj={
                        storeId:item.storeId,
                        label:item.name,
                        value:item.name,
                        userId:item.userId,
                        userName:item.userName
                    };
                    tempStore.push(obj);
                }
            })
            self.storeDataList=tempStore;
        },
        changeStore(val){
            let self=this;
            console.log(val);
            let str='';
            self.storeList.forEach((item,index)=>{
                val.forEach(_item=>{
                    if(item.storeId==_item){
                        str+=item.name+'，'
                    }
                })
            })
            str=str.substr(0,str.length-1)
            self.storeStr=str;
        }, 
        clearStore(){
            let self=this;

        },
        dateFocus(){
            let self=this;
            self.getDeafultTime();
        },
        getDeafultTime(){
            let self=this;
            let date=new Date();
            let hour=date.getHours()<10?'0'+date.getHours():date.getHours();
            let minutes=date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
            let second=date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
            let dateStr=hour+':'+minutes+':'+second;
            let timeTemp=[];
            timeTemp[0]=dateStr;
            timeTemp[1]=dateStr;
            self.defaultTime=timeTemp;
        },
        dateChange(val){
            let self=this;
            console.log(val);
            let start=typeof(val[0])==='object'?val[0].getTime():val[0];
            let end=typeof(val[1])==='object'?val[1].getTime():val[1];
            
            if((end-start)/(3600*24*30*1000)>1){  //当前选择的时间范围超过了30天
                Message({
                    message:'当前选择时间范围最大为一个月，已调整！',
                    type:'warning',
                    duration:3*1000
                })
                start=end-3600*24*30*1000;
                self.dateValue=[new Date().setTime(start),new Date().setTime(end)];
            }
            self.params.beginTs=start;
            self.params.endTs=end;
            // self.getReportList(self.params);
        },
        changeReportType(val){

        },
        clearReportType(){

        },
        changeAppraise(val){

        },
        clearAppraise(){

        },

        currentChange(val){
            let self=this;
            self.page=val;
            self.params.filter={page:val-1,size:self.sizeNum};
            self.getReportList(self.params);
        },
        searchData(){
            let self=this;
            console.log(self.params);
            // if(self.curCountry.length!=0){
            //     self.params.clause=
            // }
            console.log(self.storeDataList);
            self.page=1;
            let clause={};
            if(self.curCountry.length!=0){
                if(self.curStore.length!=0){
                    clause.storeId=self.curStore;
                }
                else{
                    clause.storeId=self.storeDataList.map(x=>x.storeId);
                }
            }
            else{
                if(self.curStore.length!=0){
                    clause.storeId=self.curStore;
                }
            }
            console.log(self.curReportType);
            if(self.curReportType!==''){
                clause.mode=self.curReportType;
            }
            if(self.curAppraise!==''){
                clause.status=self.curAppraise;
            }
            self.params.clause=clause;
            let search=self.searchInput.trim();
            if(search.length!=0){
                self.params.like={
                    tagName:search,
                    submitterName:search,
                    storeName:search
                }
            }
            else{
                self.params.like={};
            }
            
            self.params.filter={page:0,size:self.sizeNum};
            self.getReportList(self.params);
        },
        checkSortType(typeId){
            console.log(typeId);
            let self=this;
            switch(typeId){
                case 0: self.params.order={direction:'desc',property:'ts'}; break;
                case 1: self.params.order={direction:'asc',property:'status'}; break;
                case 2: self.params.order={direction:'asc',property:'storeName'}; break;
            }
            self.getReportList(self.params);
        },

        clickReport(item,index){
            let self=this;
            console.log(item.routeObj);
            sessionStorage.setItem('report_data',JSON.stringify(item.routeObj));
            self.$router.push({name:"报告详情",params:{data:item.routeObj}});
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
    beforeRouteEnter (to, from, next) {
        if(from.name!='报告详情'&&from.path!='/'){
            to.meta.keepAlive=false;
        }
        else{
            to.meta.keepAlive=true;
        }
        next(vm => {
           console.log(vm);
        });
    },
    mounted(){
        let self=this;
        if(self.varyWindowWidth<1600){
            self.searchContent=true;
        }
        //self.getDeafultTime();
        self.getRegionInfo();
        self.getInitReportList();
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
    // padding-top: calc(60/1920*100vw);
    // padding-right: calc(30/1920*100vw);
    .report-header{
        height: calc(180/1920*100vw);
        margin-bottom: calc(20/1920*100vw);
        border-bottom: 1px solid $border;
        background-color: #fff;
        padding-top: calc(15/1920*100vw);
        padding-bottom: calc(15/1920*100vw);
        color: $black;
        .header-details{
            text-align: left;
            padding-left: calc(30/1920*100vw);
            height: calc(50/1920*100vw);
            line-height: calc(50/1920*100vw);
            position: relative;
            .search-content{
                display: inline-block;
            }
            .date-range{
                width:320px;
            }
            span{
                font-size: calc(14/1920*100vw);
                margin-right: calc(20/1920*100vw);
                margin-left: calc(20/1920*100vw);
            }
            .el-province{
                width: calc(180/1920*100vw);
                margin-right: calc(15/1920*100vw);
            }
            .select-store{
                min-width: 160px;
            }
            .search-input{
                width: calc(150/1920*100vw);
            }
            .search-btn{
                width: calc(120/1920*100vw);
                margin-left: calc(20/1920*100vw);
            }
            .choice-store{
                color: $tab;
                i{
                    margin-right: calc(15/1920*100vw);
                }
            }
        }
    }
    .report-content{
        padding-right: calc(50/1920*100vw);
        padding-left: calc(20/1920*100vw);
        .card-content{
            border: 1px solid $border;
            background-color: #fff;
            padding-top: calc(20/1920*100vw);
            padding-right: calc(20/1920*100vw);
            height: calc(630/1920*100vw);
            //height: calc(730/1080*100vh);
        }
        .card-header{
            text-align: left;
            padding-left: calc(20/1920*100vw);
            margin-bottom: calc(15/1920*100vw);
        }
    }
    .report-card{
        margin-bottom: calc(20/1920*100vw);
        .cards{
            cursor: pointer;
            margin-left: calc(20/1920*100vw);
            border: 1px solid $border;
            // width: calc(200/1920*100vw);
            height: calc(240/1920*100vw);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            background-color: #fff;

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
            .item-icon{
                text-align: left;
                padding-left: calc(20/1920*100vw);
            }
            .inspectIcon{
                font-size: calc(60/1920*100vw);
                color: $border;
            }
            .item-content{
                text-align: left;
                padding-left: calc(20/1920*100vw);
                position: absolute;
                bottom: 0;
                span{
                    font-size: calc(14/1920*100vw);
                    color: $tab;
                    display: block;
                    margin-bottom: calc(15/1920*100vw);
                }
            }
        }
    }
    .el-pat{
        position: absolute;
        height: calc(30/1920*100vw);
        bottom: calc(10/1920*100vw);
        .el-pag{
            position: absolute;
            right: calc(20/1920*100vw);
        }
    }
}
</style>
<style scoped>
    .el-select >>> .el-input__inner{
        background: #f4f5f9 !important;
        border-radius: 0px !important;
        border: 0 !important;
        height: 28px !important;
        line-height: 28px !important;
    }
</style>
<style>
@import '../../assets/css/pagination.css';
.date-picker-poper .el-button--text{
    visibility: hidden !important;
}
</style>
