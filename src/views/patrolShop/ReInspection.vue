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
                <el-button class="el-submit" size="mini" @click="submit">
                    提交
                </el-button> 
            </div>
            <div class="video-content" >
                <!--@mouseenter="showModelContent=true" @mouseleave="showModelContent=false"-->
                <div class="video-model" v-if="showModelContent">
                    <div class="icon-footer">
                        <div class="iconlside">
                            <i class="iconfont icon-bofang1 iconplay" @click="playVideo" v-if="playState"></i>
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
                            <div class="iconscreen-content">
                                <i class="iconfont icon-quanping iconscreen"></i>
                                <i class="iconfont icon-gongge iconscreen"></i>
                            </div>
                        </div>
                    </div>
                    <div class="iconright">
                        <div class="paizhao-content">
                            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:22px;"></i>
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
            <div class="el-inspect">
                <el-row class="inspect-header">
                    <el-col :span="8">
                        <span>巡检类别</span>
                    </el-col>
                    <el-col :span="16">
                        <span>巡检项目</span>
                    </el-col>
                </el-row>
                <el-row class="inspect-content" v-if="inspectList.length!=0">
                    <el-col :span="8">
                        <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                            <div :style="{'max-height':varyWindowHeight*0.32-80+'px'}">
                                <div v-for="(item,index) in inspectList" :key="index" class="inspect-details" 
                                @click="getItemByGroup(item,index)" :class="item.isClick?'noraml-color':'noraml-groupColor'">
                                    <span>{{`${item.groupName}（0/${item.items.length}）`}}</span>
                                </div>
                            </div>
                         </el-scrollbar>
                    </el-col>
                    
                    <el-col :span="16">
                        <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                            <div class="item-content" :style="{'max-height':varyWindowHeight*0.32+'px'}"> 
                                <div v-for="(item,index) in inspectItemList" :key="index" class="item-details">
                                    <span class="titles">{{`${index+1}. ${item.subject}`}}</span>
                                    <el-dropdown trigger="click" class="item-score">
                                        <span class="el-dropdown-link">
                                            {{`评分：${item.itemScore}分`}}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item style="width:70px;text-align:center;"
                                             v-for="(itemDS,indexDS) in scoreList" 
                                             :key="indexDS" @click.native="checkScore(item,itemDS)">{{itemDS.scoreTitle}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <div class="source-content">
                                        <div class="source-details" v-if="showEmptyImg">
                                            <div>
                                                <img :src="emptyImgSrc"/>
                                                <span class="emptyImg-info">*视频图片最多支持插入5个。</span>
                                            </div>
                                        </div>
                                        <div class="source-details" v-for="(item,index) in sourceList" :key="index">
                                            <img :src="item.src" :width="item.width" :height="item.height"/>
                                        </div>
                                    </div>
                                    <!-- <div class="item-score" @click="clickScore(item)"><span>{{`评分：${item.itemScore}分`}}</span><i class=" iconscore" :class="item.isClick?'el-icon-arrow-up':'el-icon-arrow-down'"></i></div> -->
                                    <el-input size="mini" class="des-input" type="textarea" 
                        maxlength="300" v-model="item.inspectInput" placeholder="请输入处理评论文字"></el-input>
                                </div>
                            </div>
                        </el-scrollbar>
                    </el-col>
                </el-row>
                <el-row class="inspect-content" v-else>
                    <div class="inspect-empty">
                        <span>暂无巡检项</span>
                    </div>
                </el-row>
            </div>
        </el-col>
        <el-col :span="8" class="rside" v-if="!showSpread">
            <div class="el-header-title">
                <span>选择门店</span>
            </div>
            <el-tabs v-model="activeIndex" @tab-click="handleClick" id="tabs-content">
                <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
                    <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                        <div class="storeList-content" v-if="index!=2">
                            <span v-for="(_item,_index) in item.storeList" :key="_index" class="store-name"
                            :class="_item.isActive?'activeClass':''" @click="clickStore(item,index,_item,_index)">
                                {{_item.name}}
                            </span>
                        </div>
                        <div class="storeList-content" v-else :style="{height:varyWindowHeight-130+'px'}">
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
        </el-col>
    </el-row>
</template>
<script>
import {checkOutInspectItem,submitInspectItem} from '@/api/inspect'
import util from '@/common/util'
import {getStoreList,getFavoriteList,addFavoriteStore,deleteFavoriteStore} from '@/api/store'
export default {
    
    name:'ReInspection',
    data(){
        return{
            emptyImgSrc:require('../../../static/img/pic.png'),
            showEmptyImg:true,
            sourceList:[],
            store:{
                storeName:'西安5店',
                storeTitle:'西安5店远程巡检',
                storeUp:false,
                storeUptitle:'点击关注'
            },
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
                    label:'0.5 X'
                },
                {
                    value:1,
                    label:'1 X'
                },
                {
                    value:2,
                    label:'1.5 X'
                },
                {
                    value:3,
                    label:'2 X'
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
                    label:'20s'
                },
                {
                    value:2,
                    label:'30s'
                },
                {
                    value:3,
                    label:'40s'
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
            store:{},
            scoreList:[
                {
                    val:10,
                    scoreTitle:'10分'
                },
                {
                    val:9,
                    scoreTitle:'9分'
                },
                {
                    val:8,
                    scoreTitle:'8分'
                },
                {
                    val:7,
                    scoreTitle:'7分'
                },
                {
                    val:6,
                    scoreTitle:'6分'
                },
                {
                    val:5,
                    scoreTitle:'5分'
                }
            ],
            tempStoreList:[],  
            recentStoreList:[],
            sessionId:'',
            inspectList:[],
            inspectItemList:[],
            allInspectItemList:[], //当前全部没有忽略的巡检项
        }
    },
    mounted(){
        let self=this;
        //self.getInspectList();
        self.getInitStoreData();
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
        checkScore(item,itemDS){
            console.log(item);
            item.itemScore=itemDS.val;
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
                self.getInspectByStore(self.store.storeId);
                self.recentStoreList.push(self.tabList[2].storeList[0].storeList[0]);
            }
        },
        handleClick(tab){
            console.log(tab);
            let self=this;
            self.getStoreList();
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
        getTempInsepectList(){
            let self=this;

        },
        getItemByGroup(item,index){
            let self=this;
            let temp=[];
            item.items.forEach(_item=>{
                let obj={};
                obj.id=_item.id;
                obj.subject=_item.subject;
                obj.inspectInput='';
                obj.itemScore=_item.itemScore;
                obj.deviceId=_item.deviceId;
                obj.isIgnore=false;  //是否忽略
                temp.push(obj);
            });
            self.inspectItemList=temp;
            let tempArray=[];
            // let obj={};
            // obj.id=item.id;
            // obj.items=temp;
           // tempArray.map(x=>x.id).indexOf()
            item.isClick=true;
            self.inspectList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
        },
        getInspectByStore(storeId){
            let self=this;
            self.inspectItemList=[];
            let params={
                storeId:self.store.storeId,
                mode:0
            }
            checkOutInspectItem(params).then(res=>{
                if(res.errCode==0){
                    let data=res.data;
                    self.inspectList=data;
                    if(data.length!=0){
                        self.getItemByGroup(data[0],0);
                    }
                }
            })
        },
        submit(){
            let self=this;
            let obj={};
            self.inspectList.forEach(item=>{
                item.items
            })
            obj.ts=new Date().getTime();
            obj.description
            let params={

            };
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
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            let result=await dashAPI.Enum(sessionId);
            let ivsID=result.IVSPlatform[0].ID;
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
        playVideo(){
            let self=this;
            self.playState=false;
            self.realTime();
        },
        purseVideo(){
            let self=this;
            self.playState=true;
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
            self.getInspectByStore(self.store.storeId);
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
        }
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
                    font-size: 16px;
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
                            width: 70%;
                            max-width: 500px;
                            float: right; 
                            position: relative;
                            span{
                                font-size: 12px;
                                margin-right:6px;
                                margin-left: 20px;
                            }
                            .iconscreen-content{
                                float: right;
                                margin-right: 20px;
                            }
                            .iconscreen{
                                margin: 8px;
                                font-size: 20px;
                                position: relative;
                                top: 3px;
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
            .el-inspect{
                border-left: 1px solid #ddd;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                .inspect-header{
                    text-align: left;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 20px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #909399;
                    border-bottom:1px solid #ddd;
                    span{
                        margin-left: 15px;
                    }
                }
                .inspect-content{
                    padding: 15px auto;
                    .inspect-details{
                        text-align: left;
                        height: 60px;
                        line-height: 60px;
                        padding-left: 35px;
                        font-size: 14px;
                        font-weight: bold;
                        border-bottom:1px solid #ddd;
                        cursor: pointer;
                        background-color: #FAFAFA;
                        &:last-child{
                            margin-bottom: 15px;
                        }
                    }
                    .item-details{
                        text-align: left;
                        min-height: 60px;
                        
                        position: relative;
                        padding: 15px;
                        padding-bottom: 0;
                        .titles{
                            font-size: 14px;
                            font-weight: bold;
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
                                    margin-top: 0;
                                }
                                .emptyImg-info{
                                    display: block;
                                }
                            }
                        }
                        &:last-child{
                            margin-bottom: 15px;
                        }
                        .des-input{
                            margin: 10px 10px;
                            width:-webkit-calc(100% - 20px); 
                            width:-moz-calc(100% - 20px); 
                            width:calc(100% - 20px);
                        }
                        .item-score{
                            position: absolute;
                            right: 0;
                            top: 12px;
                            font-size: 14px;
                            margin-right: 20px;
                            width: 100px;
                            height: 26px;
                            padding: 0px 6px 0px 10px;
                            background-color: orange;
                            line-height: 26px;
                            color: #fff;
                            border-radius: 13px;
                            cursor: pointer;
                            .iconscore{
                                margin-left: 10px;
                            }
                        }
                    }
                    .inspect-empty{
                        height: 160px;
                        position: relative;
                        span{
                            position: absolute;
                            top: 40%;
                            font-size: 12px;
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
                }
                .el-search-input{
                    @include point(width,200);
                    @include point(margin-right,20);
                    @include point(margin-top,20);
                }
            }
            #tabs-content{
                margin-top: 10px;
                .storeList-content{
                    padding: 0 10px;
                    text-align: left;
                    height: 450px;
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
        }
        .noraml-color{
            background-color: #fff !important;
        }
        .noraml-groupColor{
            background-color: #FAFAFA !important;
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
    .el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .des-input .el-textarea__inner{
        font-family: 'Microsoft YaHei';
    }
</style>
