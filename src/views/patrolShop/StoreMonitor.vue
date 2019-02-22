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
            <el-dialog title='编辑截图'
            :visible.sync="showCutDialog" :close-on-click-modal="false" v-if="showCutDialog" width=550px height=300px top=15%>
                <div class="canvas-content">
                    <hr class="dialog-hr"/> 
                    <div class='model' v-if="showCutModel" @mousedown="modelMouseDown">
                        <div class='icon-right' @mouseleave="showCutModel=false">
                            <div class="content" v-for="(item,index) in penList" :key="index">
                                <div :class="{colorActive:item.showContent}"></div>
                                <div class="color" :id="item.id" @click="checkPen(item,index)"></div>
                            </div>
                        </div>
                    </div>
                    <canvas id="icanvas"  width="480" height="270" @mousedown="mouseDownAction($event)" 
                    @mousemove="mouseMoveAction($event)"></canvas>
                                        <!-- @click="cancleEditCanvas" @click="confirmEditCanvas" -->
                        <!-- <div class="cancel-content" v-if="showCancelContent">
                            <div class="content" > 
                                <span>取消编辑</span>
                            </div>
                            <div class="content">
                                <span>保存编辑</span>
                            </div>
                        </div> -->

                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">取 消</el-button>
                    <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">确 认</el-button>
                </div>
                
            </el-dialog>
            <div class="video-content" v-if="!showgongge" id="videoContent">
                <!--@mouseenter="showModelContent=true" @mouseleave="showModelContent=false"-->
                <div class="video-model" v-if="showModelContent">
                    <span id="channelName">{{channel.channelName}}</span>
                    <div class="icon-footer">
                        <div class="iconlside">
                            <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="!playState"></i>
                            <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-else></i>
                        </div>
                        <div class="iconrside">
                            <div class="speed-content" v-if="playBackState">
                                <span>倍速</span>
                                <el-select class="el-test" size="mini" v-model="curSpeed" :popper-class="popperClass" @change="adjustSpeed">
                                    <el-option
                                    v-for="(item) in speedList" 
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <span>视频回退</span>
                                <el-select class="el-test" size="mini" v-model="curBack" :popper-class="popperClass" @change="adjustProcess">
                                    <el-option
                                    v-for="(item) in backList" 
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="screen-content">
                                <i class="iconfont icon-quanping iconscreen" @click="fullScreen"></i>
                                <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen"></i>
                            </div>
                        </div>
                    </div>
                    <div class="progress-content" v-if="playBackState">
                        <span class="currentTime">{{currentStr}}</span>
                        <b-progress :value="currentTimeValue" :max="durationTimeValue" class="mb-3 el-prog" height="0.5rem"/>
                        <span class="duration">{{durationStr}}</span>
                    </div>
                    
                    <div class="iconright">
                        <div class="paizhao-content" @click="cutPicture">
                            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:20px;"></i>
                            <span>抓拍</span>
                        </div>
                        <div class="sheying-content" @click="getVideo">
                            <i class="iconfont icon-luxiang iconpaizhao" style="font-size:24px;position:relative;top:3px;"></i>
                            <span style="margin-left:12px;">录像</span>
                        </div>
                        <div class="icon-drap-content">
                            <i class="iconfont icon-zhedie iconzhedie" @click="spreadContent" v-if="!showSpread"></i>
                            <i class="iconfont icon-close iconzhedie" @click="closeContent" v-else></i>
                        </div>
                    </div>
                </div>
                <video  height=83% width=90% id="previewVideo" prload autoplay :controls="showControls"
                    class="video-js vjs-fill">
                </video>
            </div>
            <div class="video-gongge-content" v-else>
                <div class="video-details" v-for="(item,index) in videoSourceList" :key="index">
                    <div class="video-model" v-if="item.showModelContent">
                        <span class="channelName">{{item.channel.channelName}}</span>
                        <div class="icon-footer">
                            <div class="iconlside">
                                <i class="iconfont icon-bofang1 iconplay" @click="realTime(item)" v-if="item.playState"></i>
                                <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime(item)" v-else></i>
                            </div>
                            <div class="screen-content">
                                <i class="iconfont icon-quanping iconscreen" @click="fullScreen(item)"></i>
                                <i class="iconfont icon-gongge iconscreen" @click="recoverScreen(item)"></i>
                            </div>
                        </div>
                        <div class="iconright">
                            <div class="paizhao-content" @click="cutPicture(item)">
                                <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                                <span>抓拍</span>
                            </div>
                            <div class="sheying-content" @click="getVideo(item)">
                                <i class="iconfont icon-luxiang iconpaizhao" style="font-size:20px;position:relative;top:3px;"></i>
                                <span style="margin-left:14px;">录像</span>
                            </div>
                        </div>
                    </div>
                    <video  height=83% width=90% :id="item.id" prload autoplay
                        class="video-js vjs-fill videos">
                    </video>
                </div>
            </div>
            <div class="el-event">
                <div :class="corEvent?'event-lside':''">
                    <span class="event-title">创建问题</span>
                    <el-radio-group v-model="activeEventBtn" size="mini" @change="clickEventBtn">
                        <el-radio-button label="创建问题" class="radio-btn"></el-radio-button>
                        <el-radio-button label="关联问题" class="radio-btn"></el-radio-button>
                    </el-radio-group>
                    <div>
                        <span>问题名称</span>
                        <el-input size="mini" class="name-input" maxlength="20" :disabled="corEvent" v-model="eventName"></el-input>
                        <span v-if="!corEvent">问题描述</span>
                        <span v-else class="cor-des">追加描述</span>
                        <el-input size="mini" class="des-input" type="textarea" 
                        maxlength="300" v-model="eventDes" placeholder="请输入问题描述文字"></el-input>
                        <div class="source-content">
                            <div class="source-details" v-if="showEmptyImg">
                                <div>
                                    <img :src="emptyImgSrc"/>
                                    <span>*视频图片最多支持插入5个。</span>
                                </div>
                            </div>
                            <div class="source-details" v-for="(item,index) in sourceList" :key="index">
                                <img :src="item.src" :width="item.width" :height="item.height"/>
                            </div>
                        </div>
                        <el-button size="mini" class="submit-btn" @click="submit" type="primary">提交</el-button>
                    </div>
                </div>
                <div class="right-line" v-if="corEvent"></div>
                <div v-if="corEvent" class="event-rside">
                    <span class="cor-des" style="margin-left:10px;">事件</span>
                    <div class="event-content">
                        <div class="event-details" v-for="(item,index) in eventList" :key="index">
                            <el-radio v-model="curEvent" :label="item.id" @change="checkEvent">
                                <span class="event-name">{{item.name}}</span></el-radio>
                            <span class="event-date">{{item.date}}</span>
                            <span class="event-des">{{item.descrition}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="8" class="rside" v-if="!showSpread">
            <div class="el-header-title">
                <span>选择门店</span>
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
                            <el-input
                                size="small"
                                class="el-search-input"
                                placeholder="请输入关键字搜索门店"
                                v-model="serachVale" @keyup.enter.native="searchStore">
                                <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                            </el-input>
                            <div v-for="(_item,_index) in item.storeList" :key="_index" class="stores">
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
                    <el-scrollbar style="height:100%;">
                        <div class="channels-srollbar">
                            <div v-for="(item,index) in channelBtns" :key="index" class="btn-content">
                                <channel-btn :channel-name="item.name" :is-online="item.isonline" :is-click="item.isClick"
                                class="channelBtn" @click.native="clickBtn(item,index)"></channel-btn>
                            </div>
                        </div>
                    </el-scrollbar>
            </div>
            <div class="time-content">
                <span id="date-title">选择日期</span>
                <div class="date-picker-content">
                    <span>播放时间</span>
                    <el-time-picker
                        class="time-picker"
                        v-model="curTime"
                        size="mini"
                        :clearable="false"
                        placeholder="任意时间点"
                        @change='changeDate'>
                    </el-time-picker>
                    <el-button size="mini" class='backdate-btn' @click="backCurDate" type="primary">回到当前时间</el-button>
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
                        <div class="date-details" v-for="(item,index) in weekDays" :key="index">
                            <div class="data" v-for="(_item,_index) in item" :key="_index" @click="checkDate(item,index,_item,_index)">
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
import {getDashServerInfo} from '@/api/device'
import {addEvent,getStorageInfo,getEventList} from '@/api/event'
import PubSub from 'pubsub-js'
import util from '@/common/util'
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
import { setInterval } from 'timers';

export default {
    name:'StoreMoinitor',
    components:{
        ChannelBtn
    },
    data(){
        return{
            channelBtns:[],
            store:{},
            cityList:[],
            popperClass:'select-popClass',
            showModelContent:true,
            showCancelContent:false,
            playState:false,
            playBackState:false,
            activeIndex:'2',
            serachVale:'',
            varyWindowHeight:window.innerHeight,
            showDate:true, 
            playDate:new Date(), 
            
            currentTimeValue:0,
            durationTimeValue:0,
            currentStr:'0:00:00',
            durationStr:'0:00:00',
            timeid:0,
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
            curSpeed:'1 X',
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
            curBack:'',
            showControls:false,
            showSpread:false,
            showCutDialog:false,
            videoEl:'',
            canvasEl:'',
            showCutModel:false,
            penList:[
                {
                    id:'white',
                    showContent:true
                },
                {
                    id:'yellow',
                    showContent:false
                },
                {
                    id:'red',
                    showContent:false
                }
            ],
            penChecked:'white',
            showModel:true,
            X:0,Y:0,X1:0,Y1:0,
            isMouseDown:false,
            flag:0,

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
            tempStoreList:[],  
            recentStoreList:[],
            curTime:new Date(),
            curDate:'',
            curYear:new Date().getFullYear(),
            curMonth:new Date().getMonth()+1,
            curDay:new Date().getDate(),
            weekTitles:['日','一','二','三','四','五','六'],
            weekDays:[],

            protocal:'DASH',
            //selGID:0,
            sessionId:'',
            channel:{
                ivsId:'',
                channelId:'',
                channelName:'',
            },
            activeEventBtn:'创建问题',
            corEvent:false,
            eventList:[],
            curEvent:'',
            eventName:'',
            eventDes:'',
            showEmptyImg:true,
            emptyImgSrc:require('../../../static/img/pic.png'),
            sourceList:[],
            oss:null,
            bucket:'Bucket Name',
            showgongge:false,
            videoSourceList:[
                {
                    id:'id'+0,
                    showModelContent:true,
                    channel:{
                        channelId:1,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
                {
                    id:'id'+1,
                    showModelContent:true,
                    channel:{
                        channelId:2,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
                {
                    id:'id'+2,
                    showModelContent:true,
                    channel:{
                        channelId:3,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
                {
                    id:'id'+3,
                    showModelContent:true,
                    channel:{
                        channelId:4,
                        ivsId:'',
                        channelName:'水吧'
                    },
                    playState:true
                },
            ]
        }
    },
    async mounted(){
        let self=this;
        self.videoEl=document.getElementById('previewVideo');
        document.onmouseup=self.mouseUpAction;
        //初始化页面数据
        self.getDashServer();
        self.getOssInfo();
        self.getInitStoreData();
        self.getWeekDay();
        let video=videojs(self.videoEl);
        
    },
    methods:{
        getDashServer(){
            let self=this;
            self.$store.dispatch('SetDash').then((res)=>{
                console.log(res);
            });
        },
        getOssInfo(){
            let self=this;
            getStorageInfo().then(res=>{
                console.log(res);
                if(res.errCode==0){
                    self.oss=res.data;
                }
            })
        },
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
            console.log(self.store);
            let getStoreTemp=data=>{
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    if(self.store.storeId==item.storeId){
                        obj.isActive=true;
                    }
                    else{
                        obj.isActive=false;
                    }
                    obj.storeId=item.storeId;
                    obj.name=item.name;
                    obj.userId=item.userId;
                    obj.favorite=item.favorite==undefined?true:item.favorite;
                    obj.device=item.device;
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
                case 2:
                    console.log(self.tabList[2]);
                    self.tabList[2].storeList.forEach((item,index)=>{
                        item.storeList.forEach(_item=>{
                            if(_item.storeId==self.store.storeId){
                                _item.isActive=true;
                            }
                            else{
                                _item.isActive=false;
                            }
                        })
                    })
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
                            obj.device=data[j].device;
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
                self.tempStoreList=getStore2Temp(storeData);
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
                self.getChannelByStore(self.tabList[2].storeList[0].storeList[0]);
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
        getEventList(){
            let self=this;
            let date=new Date();
            let params={
                "beginTs": date.getTime()-3600*24*30*1000*30,
                "endTs": date.getTime(),
                "clause": {
                    "storeId": self.store.storeId,
                    "status": 0
                },
                "filter": {
                    "page": 0,
                    "size": 1000
                },
            }
            return new Promise((resolve,reject)=>{
                getEventList(params).then(res=>{
                    console.log(res);
                    let data=res.data.content;
                    resolve(data);
                })
            })
            
        },
        async clickEventBtn(val){
            let self=this;
            console.log(val);
            self.eventName='';
            if(val=='关联问题'){
                self.corEvent=true;
                let data=await self.getEventList();
                data=data.slice(0,5);
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    obj.id=item.id;
                    obj.name=item.subject;
                    obj.descrition=item.initialComment.description;
                    obj.date=util.getDateStr(item.ts);
                    if(index==0){
                        self.curEvent=item.id;
                        self.eventName=item.subject;
                    }
                    temp.push(obj);
                })
                self.eventList=temp;
            }
            else{
                self.corEvent=false;
            }
        },
        checkEvent(val){
            let self=this;
            console.log(val);
            self.eventList.forEach(item=>{
                if(item.id==val){
                    self.eventName=item.name;
                }
            })
        },
        getCurTime(){
            let self=this;
            let year=self.curYear;
            let month=self.curMonth;
            let day=self.curDate;
            let hours=self.curTime.getHours();
            let min=self.curTime.getMinutes();
            let second=self.curTime.getSeconds();
            let date=year+'-'+month+'-'+day+' '+hours+':'+min+':'+second;
            let d=new Date(date);
            return d;
        },
        changeDate(val){
            let self=this;
            console.log(val);

            let d=self.getCurTime();
            self.curTime=d;
            if(self.playState){  //切换时间的时候判断当前视频是否在播放
               self.stopRealTime();
            }
            self.playBackState=true;  //选择时间后播放历史视频
        },
        checkDate(item,index,_item,_index){
            let self=this;
            self.curDate=_item.data;
            let d=self.getCurTime();
            self.curTime=d;
            console.log(item);
            _item.showBack=true;
            self.playBackState=true;
            self.weekDays.forEach((itemDs,indexDs)=>{
                console.log(itemDs);
                console.log(indexDs);
                itemDs.forEach((itemChild,indexChild)=>{
                    if(_item.data!=itemChild.data){
                        itemChild.showBack=false;
                    }
                    else{
                        if(index!=indexDs){
                            itemChild.showBack=false;
                        }
                    }
                })
            })
        },
        submit(){
            let self=this;
            console.log(self.sourceList);
            if(self.eventName.trim().length==0){
                self.notify('问题名称不能为空！','warning',3000);
                return false;
            }
            const client = new OSS.Wrapper({
                region: self.oss.ossEndPoint,
                accessKeyId: self.oss.ossAccessKeyId,//填入自己的id
                accessKeySecret: self.oss.ossAccessKeySecret,//填入自己的id
                bucket: self.bucket
            })

            self.sourceList.forEach(item=>{

            })
            let commentobj={
                ts:new Date().getTime(),
                description:self.eventDes.trim(),
                status:0
            };

            let obj={};
            obj.ts=new Date().getTime();
            obj.subject=self.eventName.trim();
            obj.storeId=self.store.storeId;
            obj.deviceId=self.channel.id;
            obj.comment=commentobj;
            let params=obj;
            addEvent(params).then(res=>{
                console.log(res);
            })
        },
        spreadContent(){
            let self=this;
            self.showSpread=true;
        },
        closeContent(){
            let self=this;
            self.showSpread=false;
        },
        cutPicture(...val){
            console.log(val);
            let self=this;
            self.showCancelContent=false;
            if(self.sourceList.length>=5){
                self.notify('最多上传5个资源！','warning',3000);
                return false;
            }
            self.showCutDialog=true;
            this.$nextTick(()=>{
                self.canvasEl=document.getElementById('icanvas');
                var ctx = self.canvasEl.getContext('2d');
                //var width=self.videoEl.videoWidth;
                //var height=self.videoEl.videoHeight;
                //self.canvasEl.width=width/4;
                //self.canvasEl.height=height/4;
                ctx.drawImage(self.videoEl,0,0,480,270);
                var oGrayImg=icanvas.toDataURL('image/png');
            })
        },
        checkPen(item,index){
            let self=this;
            item.showContent=true;
            self.penList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.showContent=false;
                }
            })
            self.penChecked=item.id;
        },
        modelMouseDown(e){
            let self=this;
            //self.showCutModel=false;
        },
        mouseDownAction(e){
           let self=this;
           self.isMouseDown=true;
           self.X=e.offsetX;
           self.Y=e.offsetY;
           self.showCutModel=false;
           self.showCancelContent=false;
        },
        mouseMoveAction(e){
            let self=this;
            if(self.isMouseDown){
                self.X1=e.offsetX;
                self.Y1=e.offsetY;
                self.drawLine(self.X,self.Y,self.X1,self.Y1);
                self.flag++;
            }
        },
        mouseUpAction(e){
            let self=this;
            self.isMouseDown=false;
            self.showCutModel=true;
            self.showCancelContent=true;  //每次鼠标弹起后显示可以取消的框
            self.flag=0;
        },
        // cancleEditCanvas(){
        //     let self=this;
        //     self.showCancelContent=false;
        // },
        // confirmEditCanvas(){
        //     let self=this;
        //     self.showCancelContent=false;
        // },
        drawLine(x,y,x1,y1){
            let self=this;
            var ctx=self.canvasEl.getContext('2d');
            if(self.flag){
                ctx.beginPath();
            }
            ctx.moveTo(x,y);
            ctx.lineWidth=4;
            ctx.strokeStyle=self.penChecked;
            ctx.lineTo(x1,y1);
            ctx.stroke();
            if(self.flag!=0){
                self.X=self.X1;
                self.Y=self.Y1;
            }
        },
        confirmEdit(){
            let self=this;
            self.showEmptyImg=false;
            let img=new Image();
            let obj={};
            obj.src=self.canvasEl.toDataURL("image/png");
            obj.height='100px';
            self.sourceList.push(obj);
            self.showCutDialog=false;
        },
        getVideo(...val){
            console.log(val);
        },
        async playVideo(url) {
            console.log('playvideo enter!');
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video,{playbackRates: [0.5, 1, 1.5, 2]});
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },
        async realTime(...val){
            console.log(val);
            let self=this;
            if(val[0].channel==undefined){//大屏状态
                self.playState=true;
            }
            else{   //四宫格
                val[0].playState=true;
            }
            
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            self.sessionId=sessionId;
            let data=null;
            let url='';
            if(self.playBackState){ //播放历史视频
                data= {
                    request: { 
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:self.channel.ivsId,
                        channel:JSON.stringify(self.channel.channelId),
                        beginTime:(self.curTime.getTime()-3*60*1000).toString().substr(0,10),
                        endTime:self.curTime.getTime().toString().substr(0,10)
                    }
                };
                url=await dashAPI.playBack(1,data);
                self.timeid= setInterval(function(){  //播放视频的同时进度条进行
                    self.getProcess();
                },1000);
            }
            else{   //播放实时视频
                data = {
                    request: { 
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:self.channel.ivsId,
                        channel:JSON.stringify(self.channel.channelId)
                    }
                };
                url=await dashAPI.RealTime(1,data);
            }
            self.mpdurl = url;
            console.log(self.mpdurl);
            if (self.mpdurl != "" ) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }
        },
        stopVideo(){
            let self=this;
            self.playState=false;
            var video = document.getElementById("previewVideo");
            self.previewplayer = videojs(video);
            self.previewplayer.pause();
        },
        async stopRealTime(...val){
            console.log(val);
            let self=this;
            self.stopVideo();
            const data = {
                request: { 
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId)
                }
            };
            if(self.playBackState){
                let ret=await dashAPI.playBack(0,data);
                await dashAPI.Offline(self.sessionId);
                console.log(ret);
            }
            else{
                let ret=await dashAPI.RealTime(0,data);
                await dashAPI.Offline(self.sessionId);
                console.log(ret);
            }
        },
        getProcess(){
            let self=this;
            let video=document.getElementById('previewVideo');
            let curTime=video.player.currentTime();
            //let duration=video.player.duration();
            let duration=180;
            self.durationTimeValue=duration;
            self.currentTimeValue=curTime;

            let getTimeStr=function(val){
                let hour=0;
                let minute=0;
                let second=0;
                hour=parseInt(val/3600);
                minute=parseInt((val-hour*60)/60)<10?'0'+parseInt((val-hour*60)/60):parseInt((val-hour*60)/60);
                second=parseInt(val%60)<10?'0'+parseInt(val%60):parseInt(val%60);
                return hour+':'+minute+':'+second;
            }
            self.currentStr=getTimeStr(curTime);
            self.durationStr=getTimeStr(duration);
        },
        adjustSpeed(val){
            console.log(val);
            let self=this;
            let video=document.getElementById('previewVideo');
            video.playbackRate=val;
        },
        adjustProcess(val){
            console.log(val);
            let video=document.getElementById('previewVideo');
            let curTime=video.player.currentTime();
            switch(val){
                case 0:video.player.currentTime(curTime-10);break;
                case 1:video.player.currentTime(curTime-30);break;
                case 2:video.player.currentTime(curTime-60);break;
            }
        },
        //进入全屏
        fullScreen(...val) {
            console.log(val);
            let self=this;
            //self.showControls=true;
            var ele = document.getElementById('videoContent');
            if (ele .requestFullscreen) {
                ele .requestFullscreen();
            } else if (ele .mozRequestFullScreen) {
                ele .mozRequestFullScreen();
            } else if (ele .webkitRequestFullScreen) {
                ele .webkitRequestFullScreen();
            }
        },
        //退出全屏
        exitFullscreen() {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        gonggeScreen(){
            let self=this;
            self.showgongge=true;
        },
        recoverScreen(){
            let self=this;
            self.showgongge=false;
        },
        searchStore(){
            let self=this;
            console.log(self.tabList);
            console.log(self.serachVale.trim());
            
            let tempStoreList=self.tempStoreList;
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
                            if(self.store.storeId==data[j].storeId){
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
                            obj.device=data[j].device;
                            temp.push(obj);
                        }
                    }
                    obj.cityName=cityList[i];
                    obj.storeList=temp;
                    storeListTemp.push(obj);
                }
                return storeListTemp;
            }
            let temp=[];
            let tempArray=[];
            let tempStore=[];
            tempStoreList.forEach((_item,_index)=>{
                _item.storeList.forEach((itemDs,indexDs)=>{
                    temp.push(util.getPinyinList(itemDs.name));
                    tempStore.push(itemDs);
                })
            })
            console.log(temp);
            for(var i=0;i<temp.length;i++){
                if(temp[i][0].indexOf(self.serachVale.trim())!=-1||
                    temp[i][1].indexOf(self.serachVale.trim())!=-1){
                    tempArray.push(tempStore[i]);
                }
            }
            self.tabList[2].storeList=getStore2Temp(tempArray);
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

            //切换门店的时候暂停当前播放的视频


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
            self.getChannelByStore(_item);
        },
        getChannelByStore(storeItem){
            let self=this;
            let temp=[];
            //切换门店时暂停播放之前播放的视频，并自动播放当前门店下第一个通道的视频
            if(self.playState){
                self.stopRealTime();
            }
            self.playState=true;
            self.startPlayByItem(storeItem); 

            storeItem.device.forEach((item,index)=>{
                let obj={};
                obj.id=item.id;
                obj.name=item.name;
                obj.ivsId=item.ivsId;
                obj.channelId=item.channelId;
                obj.isonline=true;
                if(index==0){
                    obj.isClick=true;
                    self.channel={
                        ivsId:item.ivsId,
                        channelId:item.channelId,
                        channelName:item.name
                    }
                }
                else{
                    obj.isClick=false;
                }
                temp.push(obj);
            })
            self.channelBtns=temp;
        },
        async startPlayByItem(item){
            let self=this;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            self.sessionId=sessionId;
            let data=null;
            let url='';

            if(self.playBackState){ //播放历史视频
                data= {
                    request: { 
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:item.ivsId,
                        channel:JSON.stringify(item.channelId),
                        beginTime:(self.curTime.getTime()-3*60*1000).toString().substr(0,10),
                        endTime:self.curTime.getTime().toString().substr(0,10)
                    }
                };
                url=await dashAPI.playBack(1,data);
                self.timeid= setInterval(function(){  //播放视频的同时进度条进行
                    self.getProcess();
                },1000);
            }
            else{   //播放实时视频
                data = {
                    request: { 
                        method: 'connection',
                        sessionID: sessionId,
                        streamingProtocol:this.protocal,
                        IVSID:item.ivsId,
                        channel:JSON.stringify(item.channelId)
                    }
                };
                url=await dashAPI.RealTime(1,data);
            }
            self.mpdurl = url;
            console.log(self.mpdurl);
            if (self.mpdurl != "" ) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }

        },
        async clickBtn(item,index){
            let self=this;
            if(self.playState){ //切换前处于播放状态
                self.stopRealTime();
            }
            self.playState=true;
            self.startPlayByItem(item); //播放当前通道对应的视频(ivsId,channelId)

            if(item.isonline){
                item.isClick=true;
                let obj={
                    id:item.id,
                    ivsId:item.ivsId,
                    channelId:item.channelId,
                    channelName:item.name
                }
                self.channel=obj;
            }
            else{
                return false;
            }
            self.channelBtns.forEach((_item,_index)=>{
                if(_index!=index){
                    _item.isClick=false;
                }
            })
        },
        /**
         * 
         */
        backCurDate(){
            let self=this;
            self.curTime=new Date();  //点击回到当前时间，首先时间控件恢复，选择的日期回到当前日期，停止播放历史视频。
            self.playBackState=false;
            self.curYear=new Date().getFullYear();
            self.curMonth=new Date().getMonth()+1;
            self.getWeekDay();
        },
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
            let today=new Date().getDate();
            let curMonth=new Date().getMonth()+1;
            for(let i=0;i<datenew.length;i++){
                let obj={};
                obj.showBack=false;
                if(i<curWeek){
                    obj.showOp=true;
                    obj.data=forWardDayNum-(curWeek-1-i);
                    datenew[i]=forWardDayNum-(curWeek-1-i);
                }
                else if(i==curWeek){
                    obj.showOp=false;
                    obj.data=1;
                    datenew[i]=1;
                }
                else{
                    datenew[i]=1+(i-curWeek);
                    if(datenew[i]==dayNum){
                        indexTemp=i;
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
            self.weekDays.forEach((item,index)=>{
                item.forEach((_item,_index)=>{
                    if(_item.data==today&&curMonth==self.curMonth){
                        _item.showBack=true;
                    }
                })
            })
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    }
}
</script>
<style lang="scss" scoped>
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
    *{
        font-family: 'Microsoft YaHei';
    }
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
   .fadecancelContent-enter-active,.fadecancelContent-leave-active{
    transition: all 0.5s ease-out;
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
        /*左侧视频区域css*/
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
                    width: 85px;
                    position: relative;
                    bottom: 2px;
                    cursor: pointer;
                    span{
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
            }
            /*截图区域css*/
            #cancelBtn{
                width: 76px;
                margin-right: 15px;
                background-color: #EAEDF2 !important;
                color: #708090 !important;
                font-size: 12px;
                line-height: 12px;
            }
            #confirmBtn{
                width: 76px;
                margin-right: 15px;
                font-size: 12px;
                line-height: 12px;
            }
            .canvas-content{
                position: relative;
                .dialog-hr{
                    border: 0.5px solid ;
                    border-color: rgba(251,76,93,0.3);
                    margin-bottom:10px;
                    position: relative;
                    bottom: 5px;
                }
                .cancel-content{
                    position: absolute;
                    bottom: 0px;
                    width: 480px;
                    height: 30px;
                    background-color: #000;
                    opacity: 0.8;
                    z-index: 10;
                    overflow: hidden;
                    margin-left: 35px;
                    .content{
                        width: 50%;
                        text-align: center;
                        float: left;
                        color: #fff;
                        line-height: 30px;
                        border-right: 1px solid #fff;
                        cursor: pointer;
                    }
                }
                .model{
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    position: absolute;
                    z-index: 2;
                    // pointer-events: none;
                    .icon-right{
                        width: 80px;
                        height: 120px;
                        position: absolute;
                        right: 30px;
                        top: 25%;
                        .content{
                            width: 100%;
                            height: 40px;
                            position: relative;
                            .color{
                                width: 16px;
                                height: 16px;
                                border-radius: 8px;
                                position: absolute;
                                margin: auto 0;
                                top: 4px;
                                left: 20%;
                                margin-left: 4px;
                                z-index: 3;
                                cursor: pointer;
                            }
                            .colorActive{
                                background-color: #ddd;
                                border-radius: 50%;
                                width: 24px;
                                height: 24px;
                                position: absolute;
                                margin: auto 0;
                                left: 20%;
                                z-index: 3;
                            }
                            #white{
                                background-color: white;
                            }   
                            #yellow{
                                background-color: yellow;
                            }
                            #red{
                                background-color: red;
                            }
                        }
                    }
                }
            }
            /*video区域css*/
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
                    text-align: left;
                    #channelName{
                        display: block;
                        margin: 20px;
                        color: #fff;
                        font-size: 14px;
                    }
                    .progress-content{
                        position: absolute;
                        bottom: 0px;
                        width: 100%;
                        .el-prog{
                            float: left;
                            width: 77%;
                            .progress-bar{
                                background-color: #FB4C5D;
                            }
                        }
                        .currentTime{
                            font-size: 12px;
                            color: #fff;
                            float: left;
                            margin-left: 30px;
                            position: relative;
                            bottom: 0.3rem;
                            margin-right: 10px;
                        }
                        .duration{
                            font-size: 12px;
                            color: #fff;
                            position: relative;
                            bottom: 0.5rem;
                            margin-left: 15px;
                        }
                    }
                    
                    .icon-footer{
                        width: 96%;
                        position: absolute;
                        bottom: 0px;
                        color: #fff;
                        padding-left: 30px;
                        padding-bottom: 20px;
                        margin-bottom: 15px;
                        overflow: hidden;
                        user-select:none;
                        .iconlside{
                            float: left;
                            text-align: left;
                            .iconplay{
                                font-size: 22px;
                                cursor: pointer;
                                float: left;
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
                            .speed-content{
                                display: inline-block;
                            }
                            .screen-content{
                                display: inline;
                                margin-left: 30px;
                                position: absolute;
                                right: 0px;
                                .iconscreen{
                                    margin: 8px;
                                    font-size: 20px;
                                    position: relative;
                                    top: 3px;
                                    cursor: pointer;
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
            .video-gongge-content{
                width: 100%;
                height: auto;
                position: relative;
                margin-top: 20px;
                .video-details{
                    width: 49%;
                    height: auto;
                    position: relative;
                    display: inline-block;
                    margin-right: 1px;
                    .video-model{
                        height: 100%;
                        width: 100%;
                        background-color: transparent ;
                        position: absolute;
                        z-index: 990;
                        text-align: left;
                        .channelName{
                            display: block;
                            margin: 10px;
                            color: #fff;
                            font-size: 12px;
                        }
                        .icon-footer{
                            width: 96%;
                            position: absolute;
                            bottom: 0px;
                            color: #fff;
                            padding-left: 15px;
                            padding-bottom: 10px;
                            overflow: hidden;
                            user-select:none;
                            .iconlside{
                                width: 30%;
                                float: left;
                                text-align: left;
                                .iconplay{
                                    font-size: 18px;
                                    cursor: pointer;
                                }
                            }
                            .screen-content{
                                display: inline;
                                margin-left: 15px;
                                position: absolute;
                                right: 12px;
                                .iconscreen{
                                    margin: 8px;
                                    font-size: 16px;
                                    position: relative;
                                    top: 3px;
                                    cursor: pointer;
                                }
                            }
                        }
                        .iconright{
                            position: absolute;
                            right:0px;
                            height: 50%;
                            top: 25%;
                            .paizhao-content{
                                height: 20px;
                                margin-bottom: 15px;
                            }
                            span{
                                font-size: 13px;
                                margin-left: 15px;
                                color: #fff;
                                margin-right: 15px;
                                cursor: pointer;
                            }
                            .iconpaizhao{
                                color: #fff;
                                cursor: pointer;
                            }
                        } 
                    }
                    .videos{
                        @include point(min-width,240);
                        @include point(min-height,205);
                    }
                }
            }
            /*新增问题区域css*/
            .el-event{
                text-align: left;
                border: 1px solid #e3e9f4;
                overflow: hidden;
                .event-lside{
                    width: 60%;
                    float: left;
                }
                .right-line{
                    width:1px; 
                    height:340px;
                    position: relative;
                    top: 50px;
                    background-color:#e3e9f4;
                    float: left;
                    margin-right: 15px;
                }
                .event-rside{
                    position: relative;
                    top: 50px;
                    width:-webkit-calc(40% - 16px); 
                    width:-moz-calc(40% - 16px); 
                    width:calc(40% - 16px);
                    float: right;
                    .event-content{
                        padding-left: 10px;
                        .event-details{
                            position: relative;
                            .event-name{
                                margin-left: 10px;
                                display: inline;
                            }
                            .event-date{
                                display: inline;
                                font-size: 12px;
                                position: absolute;
                                right: 15px;
                                margin: 0;
                                color: #94a4b4;
                            }
                            .event-des{
                                font-size: 12px;
                                margin-left: 35px;
                                color: #94a4b4;
                            }
                        }
                        
                    }
                }
                span{
                    display: block;
                    margin: 15px;
                    margin-left: 20px;
                    font-size: 14px;
                }
                .radio-btn{
                    margin-left: 20px;
                    &:last-child{
                        border-left: 1px solid #dcdfe6;
                    }
                }
                .cor-des{
                    font-weight: bold;
                }
                .name-input{
                    max-width: 180px;
                    margin-left: 20px;
                }
                .des-input{
                    width: 90%;
                    margin: auto 20px;
                    font-size: 12px;
                }
                .source-content{
                    min-height: 150px;
                    width: 90%;
                    margin: auto 20px;
                    .source-details{
                        //padding: 15px 0;
                        display: inline-block;
                        margin-right: 15px;
                        padding-top: 15px;
                        span{
                            font-size: 12px;
                            color: #FCB83B;
                            margin: 0;
                        }
                    }
                }
                .submit-btn{
                    margin-left: 20px;
                    width: 80px;
                    margin-bottom: 15px;
                    line-height: 12px;
                    font-size: 12px;
                }
            }
        }
        /*右侧区域css*/
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
            }
            #tabs-content{
                margin-top: 10px;
                @include point(height,280);
                .storeList-content{
                    text-align: left;
                    @include point(height,260);
                    .activeClass{
                        background-color: $red;
                        color: #fff;
                    }
                    .stores{
                        &:last-child{
                            @include point(margin-bottom,20);
                        }
                    }
                    .el-search-input{
                        @include point(width,200);
                        @include point(margin-left,15);
                        @include point(margin,15);
                        @include point(margin-top,10);
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
                .channels-srollbar{
                    height: 142px;
                    text-align: left;
                }
                .btn-content{
                    width: 100px;
                    display: inline-block;
                    margin-bottom: 5px;
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
                    position: relative;
                    span{
                        font-size: 14px;
                        color: #424151;
                        margin-right: 15px;
                    }
                    .time-picker{
                        width: 120px;
                    }
                    .backdate-btn{
                        position: absolute;
                        right: 10px;
                        font-size: 12px;
                        line-height: 12px;
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
                                @include point(width,30);
                                @include point(height,30);
                                @include point(margin,3);
                                background-color: #fff;
                                @include point(line-height,30);
                                text-align: center;
                                @include point(font-size,12);
                                @include point(border-radius,18);
                                cursor: pointer;
                            }
                            .opColor{
                                background-color: #FB4C5D !important;
                                color: #fff !important;
                            }
                            .noramlColor{
                                background-color: #fff;
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
.el-prog .progress-bar{
    background-color: #FB4C5D;
}
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
@import '../../assets/css/importfile.css'; 
    #el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .des-input .el-textarea__inner{
        font-family: 'Microsoft YaHei';
    }
</style>
