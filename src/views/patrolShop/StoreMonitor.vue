<template>
    <el-row class="el-container">
        <el-col :span="16" class="lside" :class="{liseAnmiClass:showSpread}">
            <div class="el-header-title">
                <span class="lside-title">
                    {{store.storeTitle}}
                </span>
                <div class="storeUp-content" :class="store.storeUp?'coll':'nocoll'" @click="addStoreUp">
                    <i class="iconfont icon-iconfontstart" :class="store.storeUp?'coll-icon':'nocoll-icon'"></i>
                    <span :class="store.storeUp?'coll-font':'nocoll-font'">{{store.storeUpTitle}}</span>
                </div>
            </div>
            <div class="video-content" >
                <!--@mouseenter="showModelContent=true" @mouseleave="showModelContent=false"-->
                <div class="video-model" v-if="showModelContent">
                    <div class="icon-footer">
                        <div class="iconlside">
                            <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="playState"></i>
                            <i class="iconfont icon-zantingtingzhi iconplay" @click="purseVideo" v-else></i>
                        </div>
                        <div class="iconrside">
                            <span>倍速</span>
                            <el-select class="el-test" size="mini" v-model="testSpeed" :popper-class="popperClass">
                                <el-option
                                v-for="(item) in speedList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <span>视频回退</span>
                            <el-select class="el-test" size="mini" v-model="testBack" :popper-class="popperClass">
                                <el-option
                                v-for="(item) in backList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="screen-content">
                                <i class="iconfont icon-quanping iconscreen"></i>
                                <i class="iconfont icon-gongge iconscreen"></i>
                            </div>
                        </div>
                    </div>
                    <div class="iconright">
                        <div class="paizhao-content">
                            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:20px;"></i>
                            <span>抓拍</span>
                        </div>
                        <div class="sheying-content">
                            <i class="iconfont icon-luxiang iconpaizhao" style="font-size:24px;position:relative;top:3px;"></i>
                            <span>录像</span>
                        </div>
                        <div class="icon-drap-content">
                            <i class="iconfont icon-zhedie iconzhedie" @click="spreadContent" v-if="!showSpread"></i>
                            <i class="iconfont icon-close iconzhedie" @click="closeContent" v-else></i>
                        </div>
                    </div>
                </div>
                <video  height=83% width=90% id="previewVideo" prload autoplay
                    class="video-js vjs-fill">
                </video>
            </div>

        </el-col>
        <el-col :span="8" class="rside" v-if="!showSpread">
            <div class="el-header-title">
                <span>选择门店</span>
                <el-input
                    size="small"
                    class="el-search-input"
                    placeholder="请输入关键字搜索门店"
                    v-model="serachVale" @keyup.enter.native="searchStore">
                    <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                </el-input>
            </div>
            <el-tabs v-model="activeIndex" @tab-click="handleClick" id="tabs-content">
                <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
                    <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                        <div class="storeList-content" v-if="index!=2">
                            <span v-for="(_item,_index) in item.storeList" :key="_index" class="store-name"
                            :class="_item.isActive?'activeClass':''" @click="clickStore(item,index,_item,_index)">
                                {{_item.name}}
                            </span>
                        </div>
                        <div class="storeList-content" v-else>
                            <div v-for="(_item,_index) in item.storeList" :key="_index" >
                                <span class="citys">{{_item.cityName}}</span>
                                <span v-for="(itemDs,indexDs) in _item.storeList" :key="indexDs" class="store-name"
                                :class="itemDs.isActive?'activeClass':''" @click="clickStore(item,index,itemDs,indexDs)">
                                    {{itemDs.name}}
                                </span>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
            <div class="channel-content">
                <span>区域列表</span>
                <div v-for="(item,index) in channelBtns" :key="index" class="btn-content">
                    <channel-btn :channel-name="item.name" :is-online="item.isonline" :is-click="item.isClick"
                    class="channelBtn" @click.native="clickBtn(item,index)"></channel-btn>
                </div>
            </div>
            <div class="time-content">
                <span id="date-title">选择日期</span>
                <div class="date-picker-content">
                    <span>播放时间</span>
                    <el-time-picker
                        class="time-picker"
                        v-model="curDate"
                        size="mini"
                        placeholder="任意时间点">
                    </el-time-picker>
                </div>
                <div class="date-content">
                    <div class="date-header">
                        <i @click="forWard" class="el-icon-arrow-left icon-arrow"></i>
                        <span>{{curYear}}年{{curMonth}}月</span>
                        <i @click="backWard" class="el-icon-arrow-right icon-arrow"></i>
                        <!-- <el-button size="mini" @click="backCurTime" class="backTime-btn">回到当前时间</el-button> -->
                    </div>
                    <div class="date-data">
                        <span class="date-title" v-for="(item,index) in weekTitles" :key="index">
                            {{item}}
                        </span>
                        <div class="date-details" v-for="item in weekDays">
                            <div class="data" v-for="(_item,_index) in item" :key="_index">
                                <span :class="_item.showBack?'opColor':'noramlColor'"
                                :style="_item.showOp?{'color':'#E8E9ED'}:{'color':'black'}">{{_item.data}}</span>
                            </div>
                        </div>
                        <div class="schedule-tag">
                        </div>
                        <span style="margin-left:20px;color:#94a4b4;font-size:14px;">有事件</span>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import ChannelBtn from '@/components/ChannelBtn.vue'
import {getStoreList,getFavoriteList,addFavoriteStore,deleteFavoriteStore} from '@/api/store'
import PubSub from 'pubsub-js'
import util from '@/common/util'
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
export default {
    name:'StoreMoinitor',
    components:{
        ChannelBtn
    },
    data(){
        return{
            channelBtns:[
                {
                    name:'水吧',
                    isonline:true,
                    isClick:true
                },
                {
                    name:'收银台',
                    isonline:true,
                    isClick:false
                },
                {
                    name:'物料成列',
                    isonline:false,
                    isClick:false
                }
            ],
            store:{},
            cityList:[],
            popperClass:'select-popClass',
            showModelContent:true,
            playState:true,
            activeIndex:'2',
            serachVale:'',
            varyWindowHeight:window.innerHeight,
            showDate:true, 
            playDate:new Date(), 
            speedList:[
                {
                    value:0,
                    label:'1/4 X'
                },
                {
                    value:1,
                    label:'1/2 X'
                },
                {
                    value:2,
                    label:'1 X'
                },
                {
                    value:3,
                    label:'2 X'
                },
                {
                    value:4,
                    label:'4 X'
                }
            ],
            testSpeed:'1 X',
            backList:[
                {
                    value:0,
                    label:'10s'
                },
                {
                    value:1,
                    label:'30s'
                },
                {
                    value:2,
                    label:'60s'
                }
            ],
            testBack:'10s',
            showSpread:false,
            tabList:[
                {
                    label:'关注',
                    storeList:[]
                },
                {
                    label:'最近访问',
                    storeList:[]
                },
                {
                    label:'全部门店',
                    storeList:[]
                }
            ],
            recentStoreList:[],
            curDate:new Date(),

            curYear:new Date().getFullYear(),
            curMonth:new Date().getMonth()+1,
            curDay:new Date().getDate(),
            weekTitles:['日','一','二','三','四','五','六'],
            weekDays:[],

            protocal:'DASH',
            selGID:0,
            sessionId:'',
            ivsID:'',
        }
    },
    mounted(){
        let self=this;
        //初始化页面数据
        self.getInitStoreData();
        self.getWeekDay();
    },
    methods:{
        getFaStoreList(){
            let self=this;
            return new Promise((resolve,reject)=>{
                getFavoriteList().then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        getAllStoreList(){
            let self=this;
            let params={
                "filter": {
                    "page": 0,
                    "size": 1000
                }
            };
            return new Promise((resolve,reject)=>{
                getStoreList(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        async getStoreList(){
            let self=this;
            console.log(self.activeIndex);
            let getStoreTemp=data=>{
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    obj.isActive=false;
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userId=item.userId;
                    obj.favorite=item.favorite==undefined?true:item.favorite;
                    temp.push(obj);
                })
                return temp;
            }
            let data;
            switch(Number(self.activeIndex)){
                case 0: data=await self.getFaStoreList(); 
                    console.log(data);
                    if(data.errCode==0){
                        let storeData=data.data;
                        self.tabList[0].storeList=getStoreTemp(storeData);
                    }
                    break;
                case 1:
                    let temp=[];
                    let data=self.recentStoreList;
                    console.log(data);
                    data.map(x=>x.storeId).reverse().forEach(item=>{
                        if(temp.indexOf(item)==-1){
                            temp.push(item);
                        }
                    })
                    temp=temp.slice(0,3); //取最近访问的三家门店
                    console.log(temp);
                    let dataTemp=await self.getAllStoreList();
                    let allStoreData=dataTemp.data.content;
                    let tempStore=[];
                    for(let i=0;i<temp.length;i++){
                        for(let j=0;j<allStoreData.length;j++){
                            if(temp[i]==allStoreData[j].storeId){
                                tempStore.push(allStoreData[j]);
                            }
                        }
                    }
                    self.tabList[1].storeList=getStoreTemp(tempStore);
                    break;
            }
        },
        /**
         * add favorite or delete favorite
         */
        async getInitStoreData(){
            let self=this;
            let getStore2Temp=data=>{
                let cityList=[];
                data.map(x=>x.city).forEach(item=>{
                    if(cityList.indexOf(item)==-1){
                        cityList.push(item);
                    }
                })
                let storeListTemp=[];
                for(let i=0;i<cityList.length;i++){
                    let temp=[];
                    let obj={};
                    for(let j=0;j<data.length;j++){
                        if(cityList[i]==data[j].city){
                           let obj={};
                           if(i==0&&j==0){
                               obj.isActive=true;
                           }
                           else{
                               obj.isActive=false;
                           }
                            obj.storeId=data[j].storeId;
                            obj.name=data[j].name;
                            obj.userId=data[j].userId;
                            obj.city=data[j].city;
                            obj.favorite=data[j].favorite==undefined?true:data[j].favorite;
                            temp.push(obj);
                        }
                    }
                    obj.cityName=cityList[i];
                    obj.storeList=temp;
                    storeListTemp.push(obj);
                }
                return storeListTemp;
            }
            let data=await self.getAllStoreList();
             if(data.errCode==0){
                let storeData=data.data.content;
                self.tabList[2].storeList=getStore2Temp(storeData);

                let obj={};
                obj.storeId=storeData[0].storeId;
                obj.storeName=storeData[0].name;
                obj.storeTitle=storeData[0].name;
                obj.storeUp=storeData[0].favorite;
                if(storeData[0].favorite){
                    obj.storeUpTitle='已关注';
                }
                else{
                    obj.storeUpTitle='点击关注';
                }
                self.store=obj;
                self.recentStoreList.push(self.tabList[2].storeList[0].storeList[0]);
            }
        },
        addStoreUp(){
            let self=this;
            let temp=[];
            temp.push(self.store.storeId);
            let params={
                storeIds:temp
            }
            if(!self.store.storeUp){
                addFavoriteStore(params).then(res=>{
                    console.log(res);
                    if(res.errCode==0){
                        self.store.storeUp=true;
                        self.store.storeUpTitle='已关注';
                        self.getStoreList();
                    }
                })
            }
            else{
                deleteFavoriteStore(params).then(res=>{
                    if(res.errCode==0){
                        self.store.storeUp=false;
                        self.store.storeUpTitle='点击关注';
                        self.getStoreList();
                    }
                })
            }
        },
        submit(){

        },
        spreadContent(){
            let self=this;
            self.showSpread=true;
        },
        closeContent(){
            let self=this;
            self.showSpread=false;
        },
        async playVideo(url) {
            console.log('playvideo enter!');
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },
        async realTime(){
            let self=this;
            self.playState=false;
            let sessionId= await dashAPI.Online();
            
            console.log(sessionId);
            let result=await dashAPI.Enum(sessionId);
            let ivsID=result.IVSPlatform[0].ID;
            self.sessionId=sessionId;
            self.ivsID=ivsID;
            const data = {
                request: { 
                  method: 'connection',
                  sessionID: sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:ivsID,
                  channel:JSON.stringify(this.selGID+1)
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if (self.mpdurl != "" ) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }
        },
        async stopRealTime(){
            let self=this;
            self.playState=true;
             const data = {
                request: { 
                  method: 'disconnection',
                  sessionID: sessionId,
                  IVSID:ivsID,
                  channel:JSON.stringify(this.selGID+1)
                }
            };
        },
        purseVideo(){
            let self=this;
            self.playState=true;
        },
        searchStore(){
            let self=this;
            console.log(self.tabList);
            console.log(self.serachVale.trim());
            let tempArray=[];
            let tempTabList=self.tabList;
            let getStore2Temp=data=>{
                let cityList=[];
                data.map(x=>x.city).forEach(item=>{
                    if(cityList.indexOf(item)==-1){
                        cityList.push(item);
                    }
                })
                let storeListTemp=[];
                for(let i=0;i<cityList.length;i++){
                    let temp=[];
                    let obj={};
                    for(let j=0;j<data.length;j++){
                        if(cityList[i]==data[j].city){
                            let obj={};
                            obj.isActive=false;
                            obj.storeId=data[j].storeId;
                            obj.name=data[j].name;
                            obj.userId=data[j].userId;
                            obj.city=data[j].city;
                            obj.favorite=data[j].favorite==undefined?true:data[j].favorite;
                            temp.push(obj);
                        }
                    }
                    obj.cityName=cityList[i];
                    obj.storeList=temp;
                    storeListTemp.push(obj);
                }
                return storeListTemp;
            }
            tempTabList.forEach((item,index)=>{
                let temp=[];
                if(index!=2){
                    item.storeList.forEach(_item=>{
                        if(_item.name.indexOf(self.serachVale.trim())!=-1){
                            temp.push(_item);
                        }
                    })
                    tempArray.push(temp);
                }
                else{
                    item.storeList.forEach((_item,_index)=>{
                        _item.storeList.forEach((itemDs,indexDs)=>{
                            if(itemDs.name.indexOf(self.serachVale.trim())!=-1){
                                temp.push(itemDs);
                            }
                        })
                    })
                    tempArray.push(getStore2Temp(temp));
                }
            })
            console.log(tempArray);
            self.tabList=[
                {label:'关注',storeList:tempArray[0]},
                {label:'最近访问',storeList:tempArray[1]},
                {label:'全部门店',storeList:tempArray[2]}
            ]
        },
        handleClick(tab){
            console.log(tab);
            let self=this;
            self.getStoreList();
        },
        clickStore(item,index,_item,_index){
            let self=this;
            _item.isActive=true;
            let obj={};
            obj.storeId=_item.storeId;
            obj.storeName=_item.name;
            obj.storeTitle=_item.name;
            obj.storeUp=_item.favorite;
            if(_item.favorite){
                obj.storeUpTitle='已关注';
            }
            else{
                obj.storeUpTitle='点击关注';
            }
            self.store=obj;
            let tabIndex=Number(self.activeIndex);
            if(tabIndex!=2){
                item.storeList.forEach((itemS,indexS)=>{
                    if(_index!=indexS){
                        itemS.isActive=false;
                    }
                })
                if(index!=1){
                    self.recentStoreList.push(_item);
                }
            }
            else{
                item.storeList.forEach((itemS,indexS)=>{
                    itemS.storeList.forEach((itemChild,indexChild)=>{
                        if(itemChild.storeId!=_item.storeId){
                            itemChild.isActive=false;
                        }
                        else{
                            self.recentStoreList.push(itemChild);
                        }
                    })
                })
            }
            console.log(self.recentStoreList);
        },
        clickBtn(item,index){
            let self=this;
            if(item.isonline){
                item.isClick=true;
            }
            else{
                return false;
            }
            self.channelBtns.forEach((_item,_index)=>{
                if(_index!=index){
                    //PubSub.publish('is-click',{isClick:false});
                    _item.isClick=false;
                }
            })
        },
        /**
         * 
         */
        forWard(){
            let self=this;
            if(self.curMonth==1){
                self.curMonth=12;
                self.curYear--;
            }
            else{
                self.curMonth--;
            }
            self.getWeekDay();
        },
        backWard(){
            let self=this;
            if(self.curMonth==12){
                self.curMonth=1;
                self.curYear++;
            }
            else{
                self.curMonth++;
            }
            self.getWeekDay();
        },
        getWeekDay(){
            let self=this;
            let curWeek=util.getDateCurMonth(self.curYear,self.curMonth);
            console.log(curWeek);
            let dayNum=util.getDayNum(self.curYear,self.curMonth);
            console.log(dayNum);
            let forWardMonth=(self.curMonth==1?12:self.curMonth-1);
            let forWardYear=(self.curMonth==1?self.curYear-1:self.curYear);
            let forWardDayNum=util.getDayNum(forWardYear,forWardMonth);
            console.log(forWardDayNum);
            let datenew=new Array(42);
            let indexTemp=0;
            let temp=[];
            for(let i=0;i<datenew.length;i++){
                let obj={};
                if(i<curWeek){
                    obj.showBack=false;
                    if(i==2){
                        obj.showBack=true;
                    }
                    obj.showOp=true;
                    obj.data=forWardDayNum-(curWeek-1-i);
                    datenew[i]=forWardDayNum-(curWeek-1-i);
                }
                else if(i==curWeek){
                    obj.showBack=false;
                    obj.showOp=false;
                    obj.data=1;
                    datenew[i]=1;
                }
                else{
                    datenew[i]=1+(i-curWeek);
                    if(datenew[i]==dayNum){
                        indexTemp=i;
                    }
                    if(i%6==0){
                        obj.showBack=true;
                    }
                    else{
                        obj.showBack=false;
                    }
                    obj.showOp=false;
                   
                    obj.data=datenew[i]=1+(i-curWeek);
                }
                temp.push(obj);
            }
           // for(let i=0;i<datenew.length;i++){
                // if(i>indexTemp){
                    // console.log(indexTemp);
                    // datenew[i]=i-indexTemp;
            temp=temp.slice(1,indexTemp+1);
            //}
            // }
            var dateList=[];
            for(let i=0;i<temp.length;i+=7){
                dateList.push(temp.slice(i,i+7));
            }
            console.log(temp);
            self.weekDays=dateList;
            console.log(self.weekDays);
        },
    }
}
</script>
<style lang="scss" scoped>
    $red:#FB4C5D;
    $lightRed:#FEE4E7;
    @function rem($val){
        @return $val/16+rem;
    }
    @function checkRem($val){
        @if($val==0){
            @return 0;
        }
        @else if($val==auto){
            @return auto;
        }
        @else{
            @return rem($val);
        }
    }
    @mixin point($poi,$val){
        #{$poi}:checkRem($val);
    }
   
    .el-container{
        .spreadLsideClass{
            width: 98%;
        }
        .liseAnmiClass{
            animation:lisdeAn 0.5s;
            -webkit-animation: lisdeAn 0.5s;
            animation-fill-mode:forwards;
        }
        @keyframes lisdeAn{
            from{
                width: 66.67%;
            }
            to{
                width: 100%;
            }
        }
        @-webkit-keyframes lisdeAn{
            from{
                width: 66.67%;
            }
            to{
                width: 100%;
            }
        }
        .lside{
            padding:15px 10px 15px 20px;
            .el-header-title{
                text-align: left;
                position: relative;
                padding-left: 10px;
                height: 30px;
                line-height: 30px;
                .lside-title{
                    font-weight: bold;
                    color: #424151;
                    font-size: 18px;
                }
                .nocoll{
                    border:1px solid #FF9803;
                }
                .coll{
                    border:1px solid #FF9803;
                    background-color: #FF9803;
                }
                .nocoll-icon{
                    color: #FF9803;
                    font-size: 14px;
                }
                .coll-icon{
                    color: #fff;
                    font-size: 14px;
                }
                .coll-font{
                    color: #fff;
                }
                .nocoll-font{
                    color: #FF9803;
                }
                .storeUp-content{
                    display: inline-block;
                    margin-left: 20px;
                    padding: 0px 6px;
                    height: 22px;
                    line-height: 20px;
                    width: 70px;
                    position: relative;
                    bottom: 2px;
                    cursor: pointer;
                    span{
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
                .el-submit{
                    position: absolute;
                    right: 0px;
                    width: 90px;
                    top: 4px;
                    background-color: $red;
                    color: #fff;
                }
            }
            .video-content{
                width: 100%;
                height: auto;
                position: relative;
                margin-top: 20px;
                #previewVideo{
                    @include point(min-width,500);
                    @include point(min-height,414);
                }
                .video-model{
                    height: 100%;
                    width: 100%;
                    background-color: transparent ;
                    position: absolute;
                    z-index: 990;
                    .icon-footer{
                        width: 96%;
                        position: absolute;
                        bottom: 0px;
                        color: #fff;
                        padding-left: 30px;
                        padding-bottom: 20px;
                        overflow: hidden;
                        user-select:none;
                        .iconlside{
                            width: 30%;
                            float: left;
                            text-align: left;
                            .iconplay{
                                font-size: 22px;
                                cursor: pointer;
                            }
                        }
                        .iconrside{
                            width: 60%;
                            max-width: 500px;
                            float: right; 
                            position: relative;
                            span{
                                font-size: 12px;
                                margin-right:6px;
                                margin-left: 20px;
                            }
                            .screen-content{
                               display: inline;
                               margin-left: 30px;
                                .iconscreen{
                                    margin: 8px;
                                    font-size: 20px;
                                    position: relative;
                                    top: 3px;
                                }
                            }
                            
                        }
                    }
                    .iconright{
                        position: absolute;
                        right:0px;
                        height: 50%;
                        top: 25%;
                        .paizhao-content{
                            height: 50px;
                        }
                        span{
                            font-size: 13px;
                            margin-left: 15px;
                            color: #fff;
                            margin-right: 35px;
                            cursor: pointer;
                        }
                        .iconpaizhao{
                            color: #fff;
                            cursor: pointer;
                        }
                        .icon-drap-content{
                            height: 40px;
                            position: absolute;
                            right: 0px;
                            background-color: #34374A;
                            line-height: 40px;
                            .iconzhedie{
                                color: #ddd;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
        .rside{
            padding: 15px 10px 15px 10px;
            .el-header-title{
                text-align: left;
                position: relative;
                @include point(padding-left,10);
                span{
                    display: block;
                    @include point(margin-top,10);
                    font-size: 14px;
                    font-weight: bold;
                }
                .el-search-input{
                    @include point(width,200);
                    @include point(margin-right,20);
                    @include point(margin-top,20);
                }
            }
            #tabs-content{
                margin-top: 10px;
                @include point(height,260);
                .storeList-content{
                    text-align: left;
                    @include point(height,220);
                    .activeClass{
                        background-color: $red;
                        color: #fff;
                    }
                    .store-name{
                        display: inline-block;
                        margin-left: 15px;
                        margin-top: 10px;
                        margin-bottom: 10px;
                        border: 1px solid #ddd;
                        text-align: center;
                        padding:4px;
                        font-size: 14px;
                        cursor: pointer;
                        border-radius: 4px;
                        width: 80px;
                        white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
                        overflow: hidden; //隐藏超出单元格的部分。
                        text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
                    }
                    .citys{
                        display: block;
                        font-size: 14px;
                        font-weight: bold;
                        color: #424151;
                        margin-left: 12px;
                    }
                }
            }
            .channel-content{
                width: 100%;
                height: auto;
                overflow: hidden;
                span{
                    display: block;
                    text-align: left;
                    margin: 15px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #424151;
                }
                .btn-content{
                    //display: inline-block;
                    width: 100px;
                    float: left;
                }
            }
            .time-content{
               
                #date-title{
                    display: block;
                    text-align: left;
                    margin: 15px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #424151;
                }
                .date-picker-content{
                    text-align: left;
                    padding-left: 25px;
                    span{
                        font-size: 14px;
                        color: #424151;
                        margin-right: 15px;
                    }
                    .time-picker{
                        width: 120px;
                    }
                }   
                .date-content{
                    text-align: center;
                    margin-top: 10px;
                    .date-header{
                        margin-bottom: 10px;
                        position: relative;
                        user-select: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        .icon-arrow{
                            @include point(font-size,25);
                            opacity: 0.2;
                            position: relative;
                            top: 4px;
                            cursor: pointer;
                        }
                        span{
                            @include point(font-size,14);
                            font-weight: bold;
                            @include point(margin,25);
                        }
                    }
                    .date-data{
                        text-align: left;
                        padding-left: 10px;
                        .date-title{
                            display: inline-block;
                            width: 14%;
                            position: relative;
                            @include point(left,10);
                            @include point(font-size,12);
                        }
                        .date-details{
                            .data{
                                width: 14%;
                                display: inline-block;
                            }
                            span{
                                display: block;
                                @include point(width,36);
                                @include point(height,36);
                                background-color: #fff;
                                @include point(line-height,36);
                                text-align: center;
                                @include point(font-size,12);
                                @include point(border-radius,18);
                            }
                        }
                        .schedule-tag{
                            width: 16px;
                            height: 16px;
                            background-color: #FB4C5D;
                            border-radius: 8px;
                            margin-top: 20px;
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
</style>
<style scoped>
.el-test{
    width: 70px;
}
</style>
<style>
#tabs-content .el-tabs__nav-scroll{
    margin-left:40px;
}
.el-tabs__active-bar{
    height: 4px !important;
    background-color: #FB4C5D !important;
}
.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #FB4C5D !important;
}
.el-tabs__item:hover{
    color: #FB4C5D !important;
}

.el-test .el-input__inner{
    height: 24px;
    line-height: 24px;
    border-radius: 0px;
    background-color: #34374A;
    color: #fff;
    padding:0 10px;
    border: 0px;
}
.el-test .el-input__icon{
    line-height: 24px;
}
.select-popClass .el-select-dropdown__item{
    font-size:12px;
    height: 24px;
    line-height: 24px;
    background-color: #34374A;
    color:#fff;
    text-align:center;
}
.select-popClass .el-select-dropdown__item.hover{
    color:#EA6F5A !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item:hover{
    color:#EA6F5A !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown{
    border:0px !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item.selected{
    color:#fff;
    font-weight:500 !important;
}
.select-popClass .el-select-dropdown__list{
    padding:0;
}
.el-select-dropdown.el-popper.select-popClass{
    border:0px;
}
.select-popClass.el-popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color:#34374A !important;
}
.select-popClass.el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:#34374A !important;
}

</style>
<style scoped>
.el-search-input.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
    height: 32px !important;
    line-height:32px !important;
    padding-left:30px;
    color:#425262;
    letter-spacing: 0px;
}
</style>

<style>
    #el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
