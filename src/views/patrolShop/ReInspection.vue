<template>
    <el-row class="el-container">
        <el-col :span="16" class="lside" :class="{liseAnmiClass:showSpread}">
            <div class="el-header-title">
                <span class="lside-title">
                    {{store.storeTitle}}
                </span>
                <div class="storeUp-content" :class="store.storeUp?'coll':'nocoll'" @click="addStoreUp" v-if='showStoreUp'>
                    <i class="iconfont icon-iconfontstart" :class="store.storeUp?'coll-icon':'nocoll-icon'" style="vertical-align: middle;"></i>
                    <span :class="store.storeUp?'coll-font':'nocoll-font'">{{store.storeUpTitle}}</span>
                </div>
                <!-- <img :src="store.storeUp?storeUpSrc:nostoreUpSrc" alt="icon" class="icon-storeUp"/> -->
                <el-button class="el-submit" size="mini" @click="submit" v-loading.fullscreen.lock="fullscreenLoading" type="primary">
                    提交
                </el-button> 
            </div>
            <el-dialog title='编辑截图'
            :visible.sync="showCutDialog" :close-on-click-modal="false" v-if="showCutDialog" :width="650*percentHeight+'px'" height=300px top=8%>
                <div class="canvas-content">
                    <hr class="dialog-hr"/> 
                        <div class='icon-right' v-if="showPenBtn" id="iconR">
                            <img :src="penBtnSrc" class="pen-btn" @click="showPenList"/>
                            <transition name='fadepen'>
                            <div class="pen-content" v-if="showPen">
                                <div class="content" v-for="(item,index) in penList" :key="index">
                                    <div :class="{colorActive:item.showContent}"></div>
                                    <div class="color" :id="item.id" @click="checkPen(item,index)"></div>
                                </div>
                            </div>
                            </transition>
                        </div>
                     <canvas id="icanvas"  :width="567*percentHeight" :height="319*percentHeight" @mousedown="mouseDownAction($event)" 
                    @mousemove="mouseMoveAction($event)"></canvas>
                    <div class="cancel-content" v-if="showCancelContent" :style="{'width':567*percentHeight+'px',
                    'margin-left':42*percentHeight+'px'}">
                        <div class="content" @click="cancleEditCanvas"> 
                            <span>取消编辑</span>
                        </div>
                        <div class="content" @click="confirmEditCanvas">
                            <span>撤销编辑</span>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">取 消</el-button>
                    <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">确 认</el-button>
                </div>
            </el-dialog>
            <div class="guide-content" v-if="showGuide">
                <div class="guide-rside">
                    <div class="num-content">
                        <span class="guide-num">2</span>
                        <span class="guide-title">
                            点击作为取证截图！
                        </span>
                    </div>
                    <img :src="arrows2Src" alt="arrow2"/>
                    <div class="iconright-content">
                        <div class="iconright">
                            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                            <span>抓拍</span>
                        </div>
                        <div class="iconright">
                            <i class="iconfont icon-luxiang iconpaizhao" style="font-size:21px;"></i>
                            <span>录像</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="video-content" v-else-if="!showError&&!showGuide" id="videoContent"
             @mouseleave="hiddenModel" @mouseenter="showModel" @mousemove="showModel">
                <span id="channelName" v-if="showModelContent">{{channel.channelName}}</span>
                <div class="icon-footer" v-if="showModelContent">
                    <div class="iconlside">
                        <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="!playState"></i>
                        <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-else></i>
                    </div>
                    <div class="screen-content">
                        <i class="iconfont iconscreen" 
                        :class="fullScreen?'icon-tuichuquanping':'icon-quanping'" @click="controlScreen"></i>
                        <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
                    </div>
                </div>
                <transition name='fade'>
                    <div class="iconright" v-if="showModelContent" @click="cutPicture">
                        <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
                        <span>抓拍</span>
                    </div>
                </transition>
                <transition name="fade">
                    <div class="iconright1" v-if="showModelContent" @click="getVideo">
                        <i class="iconfont icon-luxiang iconpaizhao" style="font-size:21px;"></i>
                        <span>录像</span>
                    </div>
                </transition>
                <video  height=83% width=90% id="previewVideo" prload autoplay :controls="showControls"
                    class="video-js vjs-fill">
                </video>
            </div>
            <div class="errorVideo-model" v-else>
                <span>{{errorText}}</span>
            </div>
            <div class="el-inspect">
                <div class="guide-lside" v-if="showGuide">
                    <div class="num-content">
                        <span class="guide-num">1</span>
                        <span class="guide-title">
                            点击巡检标题，开始远程巡检！
                        </span>
                    </div>
                    <img :src="arrows1Src" alt="arrow1"/>
                </div>
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
                            <div :style="{'height':varyWindowHeight*0.38-40+'px'}">
                                <div v-for="(item,index) in inspectList" :key="index" class="inspect-details" 
                                @click="getItemByGroup(item,index)" :class="item.isClick?'noraml-color':'noraml-groupColor'">
                                    <span>{{`${item.groupName}（${item.dealCount}/${item.items.length}）`}}</span>
                                </div>
                            </div>
                         </el-scrollbar>
                    </el-col>
                    <el-col :span="16" id="inspectContent">
                        <el-scrollbar style="height:100%;" class="el-menuscrollbar" ref="myScrollbar">
                            <div class="item-content" :style="{'height':varyWindowHeight*0.32+'px'}">
                                <div v-for="(item,index) in inspectItemList" :key="index" class="item-details">
                                    <span class="titles" @click="clickItem(item,index)" :class="!item.isIgnore?'noraml-title':'ignore-title'">{{`${index+1}. ${item.subject}`}}</span>
                                    <el-dropdown trigger="click" class="item-score" size="small" :class="!item.isIgnore?'noraml-title':'ignore-title'">
                                        <span class="el-dropdown-link">
                                            {{`评分：${item.itemScore}分`}}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <!-- style="overflow-y:scroll;height:200px;" -->
                                        <el-dropdown-menu slot="dropdown" class="score-menu" style="overflow-y:scroll;height:200px;">
                                            <el-dropdown-item style="width:70px;text-align:center;"
                                            v-for="(itemDS,indexDS) in scoreList" 
                                            :key="indexDS" @click.native="checkScore(item,itemDS)">{{itemDS.val}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>

                                    <i class="iconfont icon-hulve iconhulve" @click="ignoreItem(item,index)" v-if="!item.isIgnore"></i>
                                    <span class="ignored-icon" v-else>已忽略</span>
                                    <div class="icon-clicked" v-if="item.checked"></div>
                                    <div class="details-content" :class="!item.isIgnore?'noraml-title':'ignore-title'">
                                        <span>{{item.description}}</span>
                                    </div>
                                    <div class="source-content" v-if="item.sourceList.length!=0" :class="!item.isIgnore?'noraml-title':'ignore-title'">
                                        <div class="source-details" v-for="(_item,_index) in item.sourceList" :key="_index">
                                            <i class="iconfont icon-shanchu icondelete" @click="deleteImg(item,_index)"></i>
                                            <img :src="_item.src" :width="_item.width" :height="_item.height"/>
                                        </div>
                                    </div>
                                    <!-- <div class="item-score" @click="clickScore(item)"><span>{{`评分：${item.itemScore}分`}}</span><i class=" iconscore" :class="item.isClick?'el-icon-arrow-up':'el-icon-arrow-down'"></i></div> -->
                                    <el-input size="mini" class="des-input" type="textarea" @change="changeInput(item)" @focus="focusInput(item)"
                        maxlength="300" v-model="item.inspectInput" placeholder="请输入处理评论文字" :disabled="item.disabled"></el-input>
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
            <el-tabs v-model="activeIndex" @tab-click="handleClick" id="storetab-content">
                <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
                    <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                        <div class="storeList-content" v-if="index!=2">
                            <span v-for="(_item,_index) in item.storeList" :key="_index" class="store-name"
                            :class="_item.isActive?'activeClass':''" @click="clickStore(item,index,_item,_index)">
                                {{_item.name}}
                            </span>
                        </div>
                        <div class="storeList-content" v-else :style="{height:varyWindowHeight-100+'px'}">
                            <el-input
                                size="small"
                                class="el-search-input"
                                placeholder="请输入关键字搜索门店"
                                v-model="serachVale" @keyup.enter.native="searchStore">
                                <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                            </el-input>
                            <div v-for="(_item,_index) in item.storeList" :key="_index" class="stores">
                                <span class="citys">{{_item.cityName}}</span>
                                <div v-for="(itemDs,indexDs) in _item.storeList" :key="indexDs" class="store-name" :style="!itemDs.hasInspect?{'background-color':'#f4f5f9'}:{}"
                                :class="itemDs.isActive?'activeClass':''" @click="clickStore(item,index,itemDs,indexDs)">
                                    <span v-if="itemDs.hasInspect">{{itemDs.name}}</span>
                                    <el-tooltip class="item" effect="dark" content="该门店暂未绑定巡检项" 
                                    placement="bottom" v-else>
                                    <span>{{itemDs.name}}</span>
                                    </el-tooltip>
                                </div>
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
import {getStorageInfo} from '@/api/event'
import {getDeviceList} from '@/api/device'
import dashAPI from '@/api/dash'
import videojs from '../../../static/video.js'
export default {
    
    name:'ReInspection',
    data(){
        return{
            showControls:false,
            showGuide:true,
            emptyImgSrc:require('../../../static/img/pic.png'),
            sourceList:[],
            penBtnSrc:require('../../../static/img/pen_btn.png'),
            showPenBtn:true,
            showPen:false,
            showStoreUp:true,
            store:{
                storeName:'西安5店',
                storeTitle:'西安5店远程巡检',
                storeUp:false,
                storeUptitle:'点击关注'
            },
            storeUpSrc:require('../../../static/img/collect2_icon.png'),
            nostoreUpSrc:require('../../../static/img/collect_icon.png'),
            arrows1Src:require('../../../static/img/arrows3_pic.png'),
            arrows2Src:require('../../../static/img/arrows2_pic.png'),
            showModelContent:false,
            activeIndex:'0',
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
                    showContent:false
                },
                {
                    id:'red',
                    showContent:true
                },
                {
                    id:'yellow',
                    showContent:false
                }
            ],
            penChecked:'red',
            showCutModel:false,
            errorText:'',
            showError:false,
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

            oss:null,
            bucketVideo:'',
            bucketImage:'',
            percentage:0,
            accountId:'aaoompqqpjy4',

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
                },
                {
                    val:4,
                    scoreTitle:'4分'
                },
                {
                    val:3,
                    scoreTitle:'3分'
                },
                {
                    val:2,
                    scoreTitle:'2分'
                },
                {
                    val:1,
                    scoreTitle:'1分'
                },
                {
                    val:0,
                    scoreTitle:'0分'
                }
            ],
            tempStoreList:[],  
            recentStoreList:[],
            sessionId:'',
            inspectList:[],
            curGroupIndex:0,  //当前选中的group index
            curItemIndex:0,   //当前点击的 item index
            curItemId:0,      //当前点击的巡检项id
            inspectItemList:[],
            allInspectItemList:[], //当前全部没有忽略的巡检项
            deviceList:[],
            protocal:'DASH',
            curDeviceId:-1,
            videoEl:'',
            canvasEl:'',
            showCutDialog:false,
            imageCanvas:new Image(),
            imageCanvasList:[],
            playState:false,
            editCount:0,
            fullscreenLoading:false,
            ignoreTemp:[],
            fullScreen:false,
            appliedInspectList:[],
        }
    },
    computed:{
        percentHeight:function(){
            return this.varyWindowHeight/758;
        },
    },
    beforeRouteLeave(to, from, next){
        let self=this;
        if(to.name!='巡检提交事件'){
            from.meta.keepAlive=false;
            if(self.playState){
                self.stopRealTime();
            }
        }
        next();
    },
    mounted(){
        let self=this;
        document.onmouseup=self.mouseUpAction;
        self.getRecentStoreList();
        self.getUpLoadBucketInfo();
        self.getOssInfo();
        self.getFaStoreData();
        self.getInitStoreData();
        self.getDeviceList();
        window.onresize=function(){
            if(!self.checkFull()){
                console.log('退出全屏');
                self.fullScreen=false;
                var ele = document.getElementById('videoContent');
                ele.style.width = "auto";
                ele.style.height = "auto";
            }
        }
    },
    methods:{
        checkFull(){
            var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if(isFull === undefined)
            {
                isFull = false;
            } 
            return isFull;
        },
        anchorLinkTo () {
            let self=this;
            self.$refs['myScrollbar'].wrap.scrollTop = document.getElementById('inspectContent').offsetTop;
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
        getUpLoadBucketInfo(){
            let self=this;
            self.bucketVideo='video'+'/'+util.getCurDate2Str();
            self.bucketImage='image'+'/'+util.getCurDate2Str();
        },
        getFileUrl(fileName){
            let self=this;
            let bucketName=self.accountId;
            let endpoint=self.oss.ossEndPoint;
            let key=fileName;
            let url=`http://${bucketName}.${endpoint}/${fileName}`;
            return url;
        },
        getIndexById(id){
            let self=this;
            let tempId=null;
            self.inspectList.forEach((item,index)=>{
                item.items.forEach((_item,_index)=>{
                    if(_item.id==id){
                        tempId={
                            groupIndex:index,
                            itemIndex:_index
                        };
                    }
                })
            })
            return tempId;
        },
        upLoadFile(fileItem){
            let self=this;
            self.percentage=0;
            let OSS = require('ali-oss');
            const client = new OSS({
                region: self.oss.ossEndPoint.slice(0,self.oss.ossEndPoint.indexOf('.')),
                accessKeyId: self.oss.ossAccessKeyId,//填入自己的id
                accessKeySecret: self.oss.ossAccessKeySecret,//填入自己的id
                bucket: self.accountId
            })
            let name=fileItem.fileName;
            return new Promise((resolve,reject)=>{
                client.put(name,fileItem.file,{
                progress: function* (percentage, cpt) {
                   self.percentage = percentage
                    }
                })
                .then((results) => {
                    // 上传完成
                    const url = self.getFileUrl(results.name);
                    console.log(url);
                    resolve(url); 
                })
                .catch((err) => {
                    console.log(err) 
                }) 
            })
        },
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
            console.log(self.curGroupIndex);
            self.showCancelContent=false;
            self.videoEl=document.getElementById('previewVideo').children[0];
            if(self.sourceList.length>=5){
                self.notify('每个巡检项最多上传5个资源文件！','warning',3000);
                return false;
            }
            self.showCutDialog=true;
            this.$nextTick(()=>{
                self.canvasEl=document.getElementById('icanvas');
                var ctx = self.canvasEl.getContext('2d');
                ctx.drawImage(self.videoEl,0,0,567*self.percentHeight,319*self.percentHeight);
                var oGrayImg=icanvas.toDataURL('image/jpeg');
                self.imageCanvas.src=oGrayImg;
                let imgObj=new Image();
                imgObj.src=oGrayImg;
                self.imageCanvasList.push(imgObj);
            })
        },
        showPenList(){
            let self=this;
            self.showPen=!self.showPen;
            self.showCancelContent=false;
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
            ctx.clearRect(0,0,567*self.percentHeight,319*self.percentHeight);
            ctx.drawImage(self.imageCanvas,0,0,567*self.percentHeight,319*self.percentHeight);
        },
        confirmEditCanvas(){
            let self=this;
            self.showCancelContent=false;
            self.imageCanvasList.pop();
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.clearRect(0,0,567*self.percentHeight,319*self.percentHeight);
            if(self.imageCanvasList.length==0){
                ctx.drawImage(self.imageCanvas,0,0,567*self.percentHeight,319*self.percentHeight);
            }
            else{
                ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length-1],0,0,567*self.percentHeight,319*self.percentHeight);
            }
        },
        confirmEdit(){
            let self=this;
            let obj={};
            obj.mediaType=2;
            obj.src=self.canvasEl.toDataURL("image/jpeg");
            obj.height='100px';
            obj.fileName=self.bucketImage+'/'+'inspect'+'_'+util.getCurTimeStr()+'_'+self.store.storeId+'_'+self.curItemId+'.jpg';
            obj.file=util.base64ToBlob(obj.src);
            self.sourceList.push(obj);
            self.showCutDialog=false;

            console.log(self.curItemId);
            let tempId=self.getIndexById(self.curItemId);
            console.log(tempId);
            if(tempId!=null){
                self.inspectList[tempId.groupIndex].items[tempId.itemIndex].sourceList=self.sourceList;
                self.inspectList[tempId.groupIndex].items[tempId.itemIndex].showEmptyImg=false;
            }
            else{
                self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList=self.sourceList;
            }
            
            if(self.inspectList[tempId.groupIndex].items[tempId.itemIndex].inputCount==0){
                self.inspectList[tempId.groupIndex].dealCount=self.inspectList[tempId.groupIndex].dealCount+1;
            }
            self.inspectList[tempId.groupIndex].items[tempId.itemIndex].inputCount++;
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
           self.showPenBtn=false;
           self.showCancelContent=false;
        },
        mouseMoveAction(e){
            let self=this;
            if(self.isMouseDown){
                self.X1=e.offsetX;
                self.Y1=e.offsetY;
                self.drawLine(self.X,self.Y,self.X1,self.Y1);
                self.showPenBtn=false;
                self.flag++;
            }
        },
        mouseUpAction(e){
            let self=this;
            self.isMouseDown=false;
            self.showCutModel=true;
            self.showPenBtn=true;
            self.showCancelContent=true;  //每次鼠标弹起后显示可以取消的框
            if(self.flag!=0&&self.canvasEl!=''){
                let imgObj=new Image();
                imgObj.src=self.canvasEl.toDataURL("image/jpeg");
                self.imageCanvasList.push(imgObj);
            }
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
            let self=this;
            console.log(item);
            if(item.id!=self.curItemId){
                self.notify('请先选中当前巡检项，然后输入分值!','warning',3000);
                return false;
            }
            item.itemScore=itemDS.val;
            if(self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount==0){
                self.inspectList[self.curGroupIndex].dealCount=self.inspectList[self.curGroupIndex].dealCount+1;
            }
            self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount++;
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
                    data.map(x=>x.storeId).forEach(item=>{
                        if(temp.indexOf(item)==-1){
                            temp.push(item);
                        }
                    })
                    temp=temp.slice(0,3); //取最近访问的三家门店

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
                    localStorage.setItem('recentStore_reinspect',JSON.stringify(self.tabList[1].storeList));
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
                    break;
            }
        },
        async getFaStoreData(){
            let self=this;
            let getStoreTemp=data=>{
                let temp=[];
                data.forEach((item,index)=>{
                    let obj={};
                    if(index==0){
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
            let data=await self.getFaStoreList();
            if(data.errCode==0){
                let storeData=data.data;
                self.tabList[0].storeList=getStoreTemp(storeData);
                if(storeData.length==0){
                    self.showStoreUp=false;
                }
                let obj={};
                obj.storeId=storeData[0].storeId;
                obj.storeName=storeData[0].name;
                obj.storeTitle=storeData[0].name;
                obj.storeUp=true;
                obj.storeUpTitle='已关注';
                self.store=obj;

                self.recentStoreList.unshift(self.tabList[0].storeList[0]);
                localStorage.setItem('recentStore_reinspect',JSON.stringify(self.recentStoreList));
                self.getInspectByStore(self.tabList[0].storeList[0].storeId);
            }
        },
         async getInitStoreData(){
            let self=this;
            let getStore2Temp=data=>{
                let cityList=[];
                data.forEach(item=>{
                    if(cityList.map(x=>x.city).indexOf(item.city)==-1){
                        let obj={
                            city:item.city,
                            province:item.province
                        }
                        cityList.push(obj);
                    }
                })
                let storeListTemp=[];
                for(let i=0;i<cityList.length;i++){
                    let temp=[];
                    let obj={};
                    for(let j=0;j<data.length;j++){
                        if(cityList[i].city==data[j].city){
                           let obj={};
                            obj.isActive=false;
                            obj.storeId=data[j].storeId;
                            obj.name=data[j].name;
                            obj.userId=data[j].userId;
                            obj.city=data[j].city;
                            obj.favorite=data[j].favorite==undefined?true:data[j].favorite;
                            obj.device=data[j].device;
                            if(data[j].appliedInspect.length!=0&&data[j].appliedInspect.indexOf('远程巡检')!=-1){
                                self.appliedInspectList.push(data[j]);
                                obj.hasInspect=true;
                            }
                            else{
                                obj.hasInspect=false;
                            }
                            temp.push(obj);
                        }
                    }
                    obj.cityName=cityList[i].province+' '+cityList[i].city;
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
                if(self.tempStoreList.length==0){
                    self.showSearchInput=false;
                }
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
        focusInput(item){
            let self=this;
            if(item.id!=self.curItemId){
                self.notify('请先选中当前巡检项，然后进行输入!','warning',3000);
                return false;
            }
        },
        changeInput(item){
            let self=this;
            console.log(item);
            item.inputCount++;
            if(item.inspectInput.trim().length!=0&&item.inputCount==1){
                self.inspectList[self.curGroupIndex].dealCount=self.inspectList[self.curGroupIndex].dealCount+1;
            }
        },  
        getItemByGroup(item,index){
            console.log(item);
            let self=this;
            
            self.curGroupIndex=index;
            self.curItemIndex=0;
            self.inspectItemList=item.items;
            self.inspectItemList.forEach((_item,_index)=>{
                let channelObj={};
                if(_item.sourceList.length==0){
                    _item.showEmptyImg=true;
                }
                else{
                    _item.showEmptyImg=false;
                }
                if(_index==0){
                    // _item.checked=false;
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
                // else{
                //     _item.checked=false;
                // }
            });
            let tempArray=[];
            item.isClick=true;
            this.$nextTick(()=>{
                self.anchorLinkTo();
            })
            
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
        deleteImg(item,index){
            let self=this;
            item.sourceList.splice(index,1);
            if(item.sourceList.length==0){
                item.showEmptyImg=true;
            }
        },
        ignoreItem(item,index){
            let self=this;
            self.editCount=self.editCount+1;
            self.curItemIndex=index;
            if(item.isIgnore){
                self.notify('该项已被忽略！','warning',3000);
                return false;
            }
            this.$confirm('确认是否忽略当前巡检项？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                item.isIgnore=true;
                item.disabled=true;
                self.ignoreTemp.push(item);
                if(self.inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount==0){
                    self.inspectList[self.curGroupIndex].dealCount=self.inspectList[self.curGroupIndex].dealCount+1;
                }
            }).catch(() => {
                console.log('cancel ignore');     
            });
            
        },
        clickItem(item,index){
            let self=this;
            self.showGuide=false;
            if(item.isIgnore){
                return false;
            }
            // if(item.clickCount!=0&&self.curItemIndex==index){
            //     self.notify('当前视频正在播放，请勿连续点击！','warning',3000);
            //     return false;
            // }
            item.clickCount++;
            // if(item.id!=self.curItemId){

            // }
            self.sourceList=[];
            item.checked=true;
            self.curItemIndex=index;
            self.curItemId=item.id;
            item.disabled=false;
            let obj={};
            //&&self.curDeviceId!=item.deviceId
            if(item.deviceId!=-1){  //当前选择的巡检项已绑定设备
                let device=self.getDeviceById(item.deviceId);
                if(device!=null){
                    obj.ivsId=device.ivsId;
                    obj.channelName=device.name;
                    obj.channelId=device.channelId;
                    
                    self.channel=obj;   //当前巡检项绑定的通道如果跟正在播放的通道不一样，更新通道信息，并播放视频
                    self.realTime();
                }
                self.curDeviceId=item.deviceId;
            }
            else if(item.deviceId==-1){
                self.notify('当前门店的巡检项未绑定设备！','warning',3000);
                return false;
            }
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
                    let temp=[];
                    data.forEach((item,index)=>{
                        let obj={};
                        obj.groupId=item.groupId;
                        obj.mode=item.mode;
                        obj.groupName=item.groupName;
                        obj.dealCount=0;
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
                            itemObj.groupId=item.groupId;
                            itemObj.subject=_item.subject;
                            itemObj.description=_item.description;
                            itemObj.itemScore=0;
                            itemObj.deviceId=_item.deviceId;
                            itemObj.inspectInput='';
                            itemObj.inputCount=0;
                            itemObj.clickCount=0;
                            itemObj.disabled=true;
                            itemObj.checked=false;   //是否选中状态
                            itemObj.isIgnore=false;  //是否被忽略
                            itemObj.sourceList=[];
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
        async submit(){
            let self=this;
            let temp=[];
            let count=0;
            let dealCount=0;
            self.inspectList.forEach(item=>{
                count=count+item.items.length;
                dealCount=dealCount+item.dealCount;
            })
            if(dealCount<count){
                self.notify('当前尚有未完成巡检项，请完成后进行提交！','warning',3000);
                return false;
            }
            self.fullscreenLoading=true;
            for(let i in self.inspectList){
                for(let  j in self.inspectList[i].items){
                    let objItem={};
                    objItem.ts=new Date().getTime();
                    objItem.description=self.inspectList[i].items[j].inspectInput.trim();
                    objItem.score=self.inspectList[i].items[j].isIgnore?-1:self.inspectList[i].items[j].itemScore;
                    objItem.storeId=self.store.storeId;
                    objItem.inspectItemId=self.inspectList[i].items[j].id;
                    let tempFileUrl=[];
                    if(!self.inspectList[i].items[j].isIgnore){
                        for(let k in self.inspectList[i].items[j].sourceList){
                            let obj={};
                            if(self.inspectList[i].items[j].sourceList[k].mediaType==2){
                                let url=await self.upLoadFile(self.inspectList[i].items[j].sourceList[k]);
                                obj.mediaType=2;
                                obj.url=url;
                            }
                            tempFileUrl.push(obj);
                        }
                    }
                    objItem.attachment=tempFileUrl;
                    temp.push(objItem);
                }
            }
            let params={
                items:temp
            };
            submitInspectItem(params).then(res=>{
                console.log(res);
                let errCode=res.errCode;
                self.fullscreenLoading=false;
                let routeData=null;
                if(errCode==0){
                    //self.notify('提交成功！','success',3000);
                    self.editFlag=true;
                    let data=res.data;
                    routeData={
                        isSuccess:true,
                        user:data.notifiedTo,
                        ignoredItems:data.ignoredItems,
                        submitResult:data.submitResult,
                        store:self.store,
                        ignoreTemp:self.ignoreTemp
                    };
                }
                else{
                    routeData={
                        isSuccess:false
                    };
                }
                sessionStorage.setItem('reinspect_submit',JSON.stringify(routeData));
                self.$router.push({name:"巡检提交事件",params:{data:routeData}});
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
            let self=this;
            console.log('playvideo enter!');
            this.showModelContent=true;
            this.playState=true;
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
            setTimeout(() => {
                self.showModelContent=false;
            }, 3000);
        },
        hiddenModel(){
            let self=this;
            self.showModelContent=false;
        },
        showModel(){
            let self=this;
            if(self.playState){
                self.showModelContent=true;
            }
        },
        async realTime(){
            let self=this;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            self.sessionId=sessionId;
            const data = {
                request: { 
                  method: 'connection',
                  sessionID:self.sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if (self.mpdurl.ErrorCode==undefined&&self.mpdurl.length!=0) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
                self.editCount=self.editCount+1;
            }
            else{
                self.showError=true;
                let errorCode=self.mpdurl.ErrorCode; //错误码
                let errorText= util.getErrorText(errorCode);
                self.errorText=errorText;
            }
        },
        stopVideo(){
            let self=this;
            self.showModelContent=false;
            self.playState=false;
            var video = document.getElementById("previewVideo");
            self.previewplayer = videojs(video);
            self.previewplayer.pause();
        },
        async stopRealTime(){
            let self=this;
            self.stopVideo();
            const data = {
                request: { 
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.channel.ivsId,
                  channel:JSON.stringify(self.channel.channelId),
                  streamType:'SubStream'
                }
            };
            let ret=await dashAPI.RealTime(0,data);
            await dashAPI.Offline(self.sessionId);
        },
        controlScreen(){
            let self=this;
            if(!self.fullScreen){
                self.fullWindowScreen();
                self.fullScreen=true;
                setTimeout(() => {
                    self.showModelContent=false;
                }, 3000);
            }
            else{
                self.exitFullscreen();
                self.fullScreen=false;
            }
        },
        //进入全屏
        fullWindowScreen(...val) {
            console.log(val);
            let self=this;
            //self.showControls=true;
            var ele = document.getElementById('videoContent');
            ele.style.width = "100%";
            ele.style.height = "100%";
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            } 
            else if (ele .mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            } 
            else if (ele .webkitRequestFullScreen) {
                ele.webkitRequestFullScreen();
            }
            else if(ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            }
        },
        //退出全屏
        exitFullscreen() {
            var de = document;
            var ele = document.getElementById('videoContent');
            ele.style.width = "auto";
            ele.style.height = "auto";
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } 
            else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } 
            else if (de.webkitCancelFullScreen) {
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
                data.forEach(item=>{
                    if(cityList.map(x=>x.city).indexOf(item.city)==-1){
                        let obj={
                            city:item.city,
                            province:item.province
                        }
                        cityList.push(obj);
                    }
                })
                let storeListTemp=[];
                for(let i=0;i<cityList.length;i++){
                    let temp=[];
                    let obj={};
                    for(let j=0;j<data.length;j++){
                        if(cityList[i].city==data[j].city){
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
                    obj.cityName=cityList[i].province+' '+cityList[i].city;
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
        //切换门店
        changeStore(item,index,_item,_index){
            let self=this;
            _item.isActive=true;
            self.editCount=0;
            if(self.playState){
                self.stopRealTime();
            }
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
                    self.recentStoreList.unshift(_item);
                }
            }
            else{
                item.storeList.forEach((itemS,indexS)=>{
                    itemS.storeList.forEach((itemChild,indexChild)=>{
                        if(itemChild.storeId!=_item.storeId){
                            itemChild.isActive=false;
                        }
                        else{
                            self.recentStoreList.unshift(itemChild);
                        }
                    })
                })
            }
            console.log(self.recentStoreList);
            localStorage.setItem('recentStore_reinspect',JSON.stringify(self.recentStoreList));
        },
        clickStore(item,index,_item,_index){
            let self=this;
            self.showStoreUp=true;
            if(self.editCount!=0){
                self.$confirm('此操作将暂停当前播放视频及清空当前门店输入的巡检项信息，是否继续！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    self.changeStore(item,index,_item,_index);

                }).catch(() => {
                    console.log('cancel ignore');     
                });
            }
            else{
                self.changeStore(item,index,_item,_index);
            }
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
    $red:#f31d65;
    $black:#182752;
    $border:#e3e9f4;
    $background:#f4f5f9;
    $tab:#7d8cad;
    $h1:#292e36;
    .fade-enter-active {
        transition: all 1s ease;
        width: 68px;
        overflow: hidden;
    }
    .fade-leave-active{
        transition: all 1s ease;
        width: 0;
        overflow: hidden;
    }
    .fade-enter, .fade-leave {
        width: 0;
        opacity: 0;
    }
    .fadepen-enter-active,.fadepen-leave-active{
        transition: opacity .5s
    }
    .fadepen-enter, .fadepen-leave-to{
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
        background-color: #f7f8fa;
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
            @include point(width,76);
            @include point(margin-right,20);
            background-color: #EAEDF2 !important;
            color: #708090 !important;
            font-size: 12px;
            line-height: 12px;
        }
        #confirmBtn{
            @include point(width,76);
            // margin-right: 15px;
            @include point(margin-right,20);
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
                margin-top: 0;
            }
            .cancel-content{
                position: absolute;
                bottom: 0px;
                height: 30px;
                background-color: #000;
                opacity: 0.8;
                z-index: 10;
                overflow: hidden;
                .content{
                    text-align: center;
                    float: left;
                    color: #fff;
                    line-height: 30px;
                    cursor: pointer;
                    width: 49%;
                    &:first-child{
                        border-right: 1px solid #fff;
                    }
                }
            }
            .icon-right{
                width: 80px;
                height: auto;
                position: absolute;
                right: 30px;
                top: 5%;
                .pen-btn{
                    width: 40px;
                    margin-right: 20px;
                    margin-bottom: 20px;
                    cursor: pointer;
                }
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
        @mixin arrow-icon{
            .guide-num{
                display: inline-block;
                height: 28px;
                width: 28px;
                line-height: 28px;
                border-radius: 50%;
                background-color: $red;
                color: #fff;
                margin-right: 15px;
                font-size: 14px;
            }
            .guide-title{
                color: $red;
                font-size: 14px;
                font-weight: bold;
            }
        }
        .lside{
            @include point(padding-bottom,20);
            @include point(margin-right,20);
            border: 1px solid $border;
            background-color: #fff;
            .el-header-title{
                text-align: left;
                position: relative;
                // height: 60px;
                // line-height: 60px;
                @include point(height,60);
                @include point(line-height,60);
                border-bottom: 1px solid $border;
                // padding:0 20px;
                @include point(padding-left,20);
                @include point(padding-right,20);
                .lside-title{
                    font-weight: bold;
                    color:$h1;
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
                    padding: 1px 6px;
                    width: 76px;
                    height: 22px;
                    line-height: 18px;
                    cursor: pointer;
                    position: relative;
                    bottom: 2px;
                    span{
                        font-size: 12px;
                        vertical-align: middle;
                        margin-left: 4px;
                    }
                }
                .el-submit{
                    position: absolute;
                    @include point(right,20);
                    width: 90px;
                    // top: 16px;
                    @include point(top,20);
                    color: #fff;
                    border-radius: 0;
                }
            }
            .errorVideo-model{
                @include point(margin,20);
                margin-bottom: 0;
                height: auto;
                position: relative;
                
                @include point(min-width,500);
                @include point(min-height,414);
                background-color: #232730;
                color: $red;
                span{
                    position: absolute;
                    top: 50%;
                    left: 45%;
                    font-size: 12px;
                }
            }
            .guide-content{
                @include point(margin,20);
                margin-bottom: 0;
                height: auto;
                position: relative;
                @include point(min-width,500);
                @include point(min-height,414);
                background-color: #000;
                .guide-rside{
                    position: absolute;
                    top: 30%;
                    right: 30px;
                    width: 260px;
                    img{
                        height: 60px;
                        position: relative;
                        right: 10%;
                        top: 20px;
                    }
                    .num-content{
                        @include arrow-icon;
                    }
                    .iconright-content{
                        width: auto;
                        height: auto;
                        position: absolute;
                        top: 30%;
                        right: 0;
                        .iconright{
                            width: 80px;
                            text-align: center;
                            margin-top: 30px;
                            height: 32px;
                            line-height: 30px;
                            border-radius: 4px;
                            padding: 0 6px;
                            background-color: rgba($color: #24293d, $alpha: 0.6);
                            .iconpaizhao{
                                color: #fff;
                                vertical-align:middle;
                            }
                            span{
                                color: #fff;
                                font-size: 14px;
                                margin-left: 12px;
                                vertical-align:middle;
                            }
                        }
                    }
                }
            }
            .video-content{
                height: auto;
                position: relative;
                @include point(margin,20);
                margin-bottom: 0;
                #previewVideo{
                    @include point(min-width,500);
                    @include point(min-height,405);
                }
                #channelName{
                    position: absolute;
                    color: #fff;
                    z-index: 10;
                    font-size: 12px;
                    display: block;
                    width:-webkit-calc(100% - 30px); 
                    width:-moz-calc(100% - 30px); 
                    width:calc(100% - 30px);
                    height: 40px;
                    line-height: 40px;
                    text-align: left;
                    padding-left: 30px;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                }
                .icon-footer{
                    width: 100%;
                    height: 45px;
                    line-height: 45px;
                    position: absolute;
                    bottom: 0px;
                    color: #fff;
                    overflow: hidden;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    z-index: 10;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    .iconlside{
                        float: left;
                        text-align: left;
                        margin-left: 30px;
                        .iconplay{
                            font-size: 18px;
                            cursor: pointer;
                            float: left;
                        }
                    }
                }
                .screen-content{
                    display: inline;
                    margin-left: 30px;
                    position: absolute;
                    right: 20px;
                    .iconscreen{
                        margin-right: 20px;
                        font-size: 18px;
                        position: relative;
                        cursor: pointer;
                    }
                }
                .iconright{
                    padding: 0 6px;
                    width: 80px;
                    height: 32px;
                    line-height: 30px;
                    position: absolute;
                    z-index: 990;
                    right: 20px;
                    margin-bottom: 40px;
                    border-radius: 4px;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    top: 40%;
                    span{
                        font-size: 12px;
                        margin-left: 15px;
                        color: #fff;
                        margin-right: 35px;
                        cursor: pointer;
                        vertical-align:middle;
                    }
                    .iconpaizhao{
                        color: #fff;
                        cursor: pointer;
                        vertical-align:middle;
                        margin-left: 10px;
                    }
                }
                .iconright1{
                    padding: 0 6px;
                    width: 80px;
                    height: 32px;
                    line-height: 30px;
                    position: absolute;
                    z-index: 990;
                    right: 20px;
                    margin-bottom: 40px;
                    border-radius: 4px;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    top: 56%;
                    span{
                        font-size: 12px;
                        margin-left: 12px;
                        color: #fff;
                        margin-right: 32px;
                        cursor: pointer;
                        vertical-align:middle;
                    }
                    .iconpaizhao{
                        color: #fff;
                        cursor: pointer;
                        vertical-align:middle;
                        margin-left: 10px;
                    }
                }
            }
            .el-inspect{
                border-left: 1px solid $border;
                border-right: 1px solid $border;
                border-bottom: 1px solid $border;
                margin: 0;
                @include point(margin-left,20);
                @include point(margin-right,20);
                position: relative;
                .guide-lside{
                    position: absolute;
                    top: 20px;
                    right:12%;
                   
                    width: auto;
                    z-index: 20;
                    img{
                        height: 56px;
                        position: relative;
                        right: 15%;
                    }
                }
                .num-content{
                    @include arrow-icon;
                }
                .inspect-header{
                    text-align: left;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 35px;
                    font-size: 12px;
                    font-weight: bold;
                    color: $tab;
                    background-color: $background;
                    border-bottom:1px solid $border;
                    
                }
                .inspect-content{
                    padding: 15px auto;
                    .inspect-details{
                        text-align: left;
                        height: 50px;
                        line-height: 50px;
                        padding-left: 35px;
                        font-size: 14px;
                        color: $tab;
                        border-bottom:1px solid #ddd;
                        cursor: pointer;
                        background-color: $background;
                        &:last-child{
                            margin-bottom: 15px;
                        }
                    }
                    .noraml-title{
                        cursor: pointer;
                        opacity: 1;
                    }
                    .ignore-title{
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                    .item-details{
                        text-align: left;
                        min-height: 60px;
                        position: relative;
                        padding: 15px;
                        @include point(padding-left,20);
                        padding-bottom: 0;
                        margin-top: 5px;
                        &:last-child{
                            margin-bottom: 35px;
                        }
                        .icon-clicked{
                            width: 4px;
                            min-height: 40px;
                            height: 60%;
                            position: absolute;
                            top:50px;
                            background-color: $red;
                        }
                        .titles{
                            font-size: 14px;
                            font-weight: bold;
                        }
                        .details-content{
                            font-size: 12px;
                            color: $tab;
                            margin-top: 15px;
                            span{
                                margin-left: 15px;
                                display: block;
                            }
                        }
                        .source-content{
                            min-height: 110px;
                            width: 90%;
                            margin: auto 20px;
                            .source-details{
                                display: inline-block;
                                margin-right: 15px;
                                padding-top: 15px;
                                position: relative;
                                span{
                                    font-size: 12px;
                                    color: #FCB83B;
                                    margin-top: 0;
                                }
                                .emptyImg-info{
                                    display: block;
                                }
                                .icondelete{
                                    position: absolute;
                                    font-size: 14px;
                                    right: 5px;
                                    margin-top: 5px;
                                    z-index: 2;
                                    color: #fff;
                                    cursor: pointer;
                                }
                            }
                        }
                        .des-input{
                            margin-left: 15px;
                            width:-webkit-calc(100% - 20px); 
                            width:-moz-calc(100% - 20px); 
                            width:calc(100% - 20px);
                            margin-top: 15px;
                        }
                        .iconhulve{
                            position: absolute;
                            color: #ddd;
                            font-size: 20px;
                            @include point(right,20);
                            @include point(top,10);
                            cursor: pointer;
                        }
                        .ignored-icon{
                            display:inline-block;
                            position: absolute;
                            @include point(right,10);
                            @include point(top,10);
                            font-size: 12px;
                            padding:2px 6px;
                            border-radius: 4px;
                            color: #fff;
                            background-color: $black;
                            cursor: not-allowed;
                        }
                        .item-score{
                            position: absolute;
                            @include point(right,46);
                            @include point(top,10);
                            font-size: 12px;
                            margin-right: 20px;
                            max-width: 80px;
                            height: 22px;
                            @include point(width,76);
                           
                            @include point(padding-left,10);
                            background-color: orange;
                            line-height: 22px;
                            color: #fff;
                            border-radius: 13px;
                            cursor: pointer;
                            .iconscore{
                                margin-left: 10px;
                            }
                        }
                        .score-menu{
                            max-height: 160px;
                            overflow: hidden;
                           
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
            border: 1px solid $border;
            background-color: #fff;
            @include point(margin-right,20);
            .el-header-title{
                text-align: left;
                position: relative;
                color:$black;
                font-size: 16px; 
                @include point(height,60);
                @include point(line-height,60);
                border-bottom: 1px solid $border;              
                @include point(padding-left,10);
                span{
                    display: block;
                    @include point(margin-left,25);
                }
            }
            #storetab-content{
                margin-top: 10px;
                @include point(padding-left,20);
                // @include point(margin-right,20);
                .storeList-content{
                    padding: 0 10px;
                    text-align: left;
                    // height: 450px;
                    @include point(height,450);
                    color: $black;
                    .activeClass{
                        background-color: $red !important;
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
                        @include point(margin-left,20);
                        margin-top: 10px;
                        margin-bottom: 15px;
                        border: 1px solid #ddd;
                        text-align: center;
                        // padding:6px;
                        font-size: 12px;
                        cursor: pointer;
                        // width: 82px;
                        @include point(width,76);
                        @include point(padding,6);
                        white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
                        overflow: hidden; //隐藏超出单元格的部分。
                        text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
                        span{
                            width: 100%;
                            display: block;
                        }
                    }
                    .citys{
                        display: block;
                        font-size: 14px;
                        font-weight: bold;
                        @include point(margin-left,20);
                    }
                }
            }
        }
        .noraml-color{
            background-color: #fff !important;
            color: $black !important;
            font-weight: bold;
        }
        .noraml-groupColor{
            background-color: $background !important;
        }
    }
</style>
<style>
#storetab-content .el-tabs__nav-scroll{
    margin-left:40px;
}
.el-tabs__active-bar{
    height: 4px !important;
    background-color: #f31d65 !important;
}
.el-tabs__item{
    color:#7d8cad !important;
}
.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #f31d65 !important;
} 
.el-tabs__item:hover{
    color: #f31d65 !important;
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
