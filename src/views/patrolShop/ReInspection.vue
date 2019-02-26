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
                    <div class="cancel-content" v-if="showCancelContent">
                        <div class="content" @click="cancleEditCanvas"> 
                            <span>取消编辑</span>
                        </div>
                        <div class="content" @click="confirmEditCanvas">
                            <span>保存编辑</span>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">取 消</el-button>
                    <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">确 认</el-button>
                </div>
            </el-dialog>
            <div class="video-content">
                <span id="channelName">{{channel.channelName}}</span>
                <transition name='fade'>
                    <div class="iconright" v-if="showModelContent" @click="cutPicture">
                        <i class="iconfont icon-xiangji iconpaizhao" style="font-size:20px;"></i>
                        <span>抓拍</span>
                    </div>
                </transition>
                <transition name="fade">
                    <div class="iconright1" v-if="showModelContent" @click="getVideo">
                        <i class="iconfont icon-luxiang iconpaizhao" style="font-size:24px;position:relative;top:3px;left:3px;"></i>
                        <span>录像</span>
                    </div>
                </transition>
                <video  height=83% width=90% id="previewVideo" prload autoplay controls
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
                            <div :style="{'max-height':varyWindowHeight*0.32-40+'px'}">
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
                                <div v-for="(item,index) in inspectItemList" :key="index" class="item-details" >
                                    <span class="titles" :class="!item.isIgnore?'noraml-title':'ignore-title'" @click="clickItem(item,index)">{{`${index+1}. ${item.subject}`}}</span>
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
                                    <i class="iconfont icon-hulve iconhulve" @click="ignoreItem(item,index)"></i>
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
import {getDeviceList} from '@/api/device'
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
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
            showModelContent:false,
            playState:true,
            activeIndex:'2',
            serachVale:'',
            varyWindowHeight:window.innerHeight,
            showDate:true, 
            playDate:new Date(), 
            channel:{
                ivsId:'',
                channelId:'',
                channelName:'',
            },
            penList:[
                {
                    id:'white',
                    showContent:true
                },
                {
                    id:'red',
                    showContent:false
                },
                {
                    id:'yellow',
                    showContent:false
                }
            ],
            penChecked:'red',
            showCutModel:false,
            errorText:'',
            showCancelContent:false,
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
            deviceList:[],
            protocal:'DASH',
            curDeviceId:-1,
            videoEl:'',
            canvasEl:'',
            showCutDialog:false,
            imageCanvas:new Image()
        }
    },
    mounted(){
        let self=this;
        //self.getInspectList();
        document.onmouseup=self.mouseUpAction;
        self.getRecentStoreList();
        self.videoEl=document.getElementById('previewVideo');
        self.getInitStoreData();
        self.getDeviceList();
    },
    methods:{
        getDeviceList(){
            let self=this;
            getDeviceList().then(res=>{
                if(res.errCode==0){
                    let data=res.data;
                    self.deviceList=data;
                }
            })
        },
        getVideo(){

        },
        cutPicture(){
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
                ctx.drawImage(self.videoEl,0,0,480,270);
                var oGrayImg=icanvas.toDataURL('image/png');
                self.imageCanvas.src=oGrayImg;
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
        cancleEditCanvas(){
            let self=this;
            self.showCancelContent=false;
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.clearRect(0,0,480,270);
            ctx.drawImage(self.imageCanvas,0,0,480,270);
        },
        confirmEditCanvas(){
            let self=this;
            self.showCancelContent=false;
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
        getRecentStoreList(){
            let self=this;
            if(localStorage.getItem('recentStore_reinspect')!=null){
                self.recentStoreList=JSON.parse(localStorage.getItem('recentStore_reinspect'));
            }
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
                localStorage.setItem('recentStore_reinspect',JSON.stringify(self.recentStoreList));
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
        getItemByGroup(item,index){
            console.log(item);
            let self=this;
            self.inspectItemList=item.items;
            self.inspectItemList.forEach((_item,_index)=>{
                let channelObj={};
                if(_index==0){
                    _item.checked=true;
                    if(_item.deviceId!=-1){
                        let device=self.getDeviceById(_item.deviceId);
                        if(device!=null){
                            channelObj.ivsId=device.ivsId;
                            channelObj.channelName=device.name;
                            channelObj.channelId=device.channelId;
                        }
                        self.channel=channelObj;
                    }
                }
                else{
                    _item.checked=false;
                }
            });
            let tempArray=[];
            item.isClick=true;
            self.inspectList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
        },
        getDeviceById(deviceId){
            let self=this;
            let device=null;
            self.deviceList.forEach(item=>{
                if(deviceId==item.id){
                    device=item;
                }
            })
            return device;
        },
        ignoreItem(item,index){
            let self=this;
            if(item.isIgnore){
                self.notify('当前项已忽略！','warning',3000);
                return false;
            }
            this.$confirm('确认是否忽略当前巡检项？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                item.isIgnore=true;
            }).catch(() => {
                console.log('cancel ignore');     
            });
            
        },
        clickItem(item,index){
            let self=this;
            if(item.isIgnore){
                return false;
            }
            item.checked=true;
            let obj={};

            if(item.deviceId!=-1&&self.curDeviceId!=item.deviceId){  //当前选择的巡检项已绑定设备
                let device=self.getDeviceById(item.deviceId);
                if(device!=null){
                    obj.ivsId=device.ivsId;
                    obj.channelName=device.name;
                    obj.channelId=device.channelId;
                }
                self.channel=obj;
                self.curDeviceId=item.deviceId;
            }
            else{
                return false;
            }
            self.realTime();
            self.inspectItemList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.checked=false;
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
                    // self.inspectList=data;
                    // if(data.length!=0){
                    //     self.getItemByGroup(data[0],0);
                    // }
                    let temp=[];
                    data.forEach((item,index)=>{
                        let obj={};
                        obj.groupId=item.groupId;
                        obj.mode=item.mode;
                        obj.groupName=item.groupName;
                        if(index==0){
                            obj.isClick=true;
                        }
                        else{
                            obj.isClick=false;
                        }
                        let tempItems=[];
                        item.items.forEach((_item,_index)=>{
                            let itemObj={};
                            itemObj.id=_item.id;
                            itemObj.subject=_item.subject;
                            itemObj.description=_item.description;
                            itemObj.itemScore=_item.itemScore;
                            itemObj.deviceId=_item.deviceId;
                            itemObj.inspectInput='';
                            itemObj.checked=false;   //是否选中状态
                            itemObj.isIgnore=false;  //是否被忽略
                            tempItems.push(itemObj);
                        })
                        obj.items=tempItems;
                        temp.push(obj);
                    })
                    self.inspectList=temp;
                    if(self.inspectList.length!=0){
                        self.getItemByGroup(self.inspectList[0],0);
                    }
                }
            })
        },
        submit(){
            let self=this;
            let temp=[];
            self.inspectList.forEach((item,index)=>{
                item.items.forEach((_item,_index)=>{
                    let objItem={};
                    if(!_item.isIgnore){
                        objItem.ts=new Date().getTime();
                        objItem.description=_item.inspectInput.trim();
                        objItem.score=_item.itemScore;
                        objItem.storeId=self.store.storeId;
                        objItem.inspectItemId=_item.id;
                        temp.push(objItem);
                    }
                })
            })

            let params={
                items:temp
            };
            submitInspectItem(params).then(res=>{
                console.log(res);
                let errCode=res.errCode;
                if(errCode==0){
                    self.notify('提交成功！','success',3000);
                }
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
        async playVideo(url) {
            console.log('playvideo enter!');
            this.showModelContent=true;
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },
        async realTime(){
            let self=this;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            const data = {
                request: { 
                  method: 'connection',
                  sessionID: sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if (self.mpdurl != "" ) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }
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
            localStorage.setItem('recentStore_reinspect',JSON.stringify(self.recentStoreList));
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
    $red:#FB4C5D;
    $lightRed:#FEE4E7;
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
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
                #previewVideo{
                    @include point(min-width,500);
                    @include point(min-height,414);
                }
                #channelName{
                    position: absolute;
                    color: #fff;
                    z-index: 10;
                    left: 30px;
                    top: 20px;
                    font-size: 14px;
                }
                .iconright{
                    position: absolute;
                    z-index: 990;
                    right:0px;
                    margin-bottom: 40px;
                    background-color: transparent ;
                    top: 100px;
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
                }
                .iconright1{
                    position: absolute;
                    z-index: 990;
                    right:0px;
                    background-color: transparent ;
                    top: 140px;
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
                        .noraml-title{
                            cursor: pointer;
                        }
                        .ignore-title{
                            cursor: not-allowed;
                            background-color: #ddd;
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
                        .iconhulve{
                            position: absolute;
                            right: 0;
                            color: #ddd;
                            font-size: 20px;
                            margin-right: 15px;
                            cursor: pointer;
                        }
                        .item-score{
                            position: absolute;
                            right: 25px;
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
@import '../../assets/css/importfile.css'; 
    .el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .des-input .el-textarea__inner{
        font-family: 'Microsoft YaHei';
    }
</style>
