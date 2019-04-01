<template>
    <el-row class="el-rate-container">
        <el-col :span="16" class="lside" :style="{'min-height':windowHeight*0.82+'px'}">
            <div class="title-content">
                <img :src="sourceSrc" :height="varyWindowWidth>1366?'40px':'32px'" class="title-img" />
                <span class="event-title">{{event.eventTitle}}</span>
                <span class="event-score" v-if="event.score!=-1">得分：{{event.score}}分</span>
                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="el-submit" @click="submit" v-if="showWinpBtn" type="primary">提交</el-button>
            </div>
            <el-dialog  title='查看' :visible.sync="dialogFormVisible" :close-on-click-modal="false" 
            v-if="dialogFormVisible" width="850px" top=12% @close='stopRealTime' class='rate-video-dialog'>
                <div class="video-dialog-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="video-content" >
                        <video  height=83% width=90% id="previewVideo" prload controls
                            class="video-js vjs-fill">
                        </video>
                    </div>
                </div>
            </el-dialog>
            <el-dialog  title='查看' :visible.sync="dialogCommentVideo" :close-on-click-modal="false" 
            v-if="dialogCommentVideo" width="850px" top=12% @close='stopCommentVideo' class='rate-video-dialog'>
                <div class="video-dialog-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="video-content" >
                        <video  height=83% width=90% id="previewVideo" prload controls
                            class="video-js vjs-fill">
                        </video>
                    </div>
                </div>
            </el-dialog>
            <!-- <transition name="fade">
                <div id="outerdiv" style="" v-show="showOuter">
                    <div id="innerdiv" style="position:absolute;">
                        <img id="bigimg" style="border:5px solid #fff;" :src="bigImgSrc" />
                    </div>
                </div>
            </transition> -->
            <transition name="fade">
                <el-dialog title='查看'
                :visible.sync="showOuter" :close-on-click-modal="false" v-if="showOuter" width=850px top=12%>
                <div class="video-dialog-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="dialog-source-content">
                        <img v-if="showImg" :src="checkImgSrc"/>
                    </div>
                </div>
                </el-dialog>
            </transition>
            <div class="storeInfo-content">
                <div class="storeInfo-details">
                    <dd><span class="w4">门店名称：</span></dd>
                    <span class="details-info">{{event.storeName}}</span>
                </div>
                <div class="storeInfo-details">
                    <div class="w3-content">
                        <dd><span class="w3">提报人：</span></dd>
                        <span class="details-info">{{event.createor}}</span>
                    </div>
                    <div class="w3-content">
                        <dd><span class="w3">负责人：</span></dd>
                        <span class="details-info">{{event.assigneeName}}</span>
                    </div>
                </div>
                <div class="storeInfo-details">
                    <dd><span class="w4">提报时间：</span></dd>
                    <span class="details-info">{{event.createDate}}</span>
                </div>
            </div>
            <div class="eventInfo-content">
                <strong>事件详情：</strong>
                <div class="content">
                    <div class="speech-content" v-if="showAudio">
                        <div class="speech-info" @click="startSpeech"> 
                            <i class="iconfont icon-speech" :class="speech?'icon-yuyin':'icon-yuyin'"></i>
                        </div>
                        <audio :ref="audioRef" id="audio">
                            <source :src="audioSrc" type="audio/mpeg" />
                        </audio> 
                        <span class="often-text">{{audioOftenText}}</span>
                    </div>
                    
                    <pre  class="description">{{event.description}}</pre>
                    <div class="photo-content">
                        <div v-for="(item,index) in sourceList" :key="index" class="source-content">
                            <div v-if="item.mediaType==2" class="img-content">
                                <!--图片资源-->
                                <img class="imgLittle imgInner" :src="item.url" :title="imgTitle" :onerror='deafultImg'
                                :height="imgHeight+'px'" @click="openOuter(item,$event)"/>
                            </div>
                                <!--视频资源-->
                            <div  v-else class="img-content" @click="playCommentVideo(item,index)">
                                <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                <img class="imgLittle" :src="videoImgSrc" :height="imgHeight+'px'"/>
                            </div>
                        </div>
                    </div>
                    <div class="viedo-info">
                        <div v-if="showCheckVideo" @click="checkVideo">
                            <i class="iconfont icon-bofang icon-video"></i>
                            <span class="ahref">{{curChannel.name+'区域'}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="submit-content" :style="{'height':windowHeight*0.34+'px'}" v-show="showWinpBtn">
                <span class="dealInfo-label">处理事件</span>
                <span>选择处理方式</span>
                <div class="btn-content">
                    <span v-for="(item,index) in subBtnList" :key="index" :class="item.isActive?'activeClass':''" @click="clickSubBtn(item,index)">
                        {{item.name}}
                    </span>
                </div>
                <span style="display:block;">添加处理信息</span>
                <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 2}"
                    maxlength="300" v-model="eventDes" placeholder="请输入处理评论文字"></el-input>
            </div>
        </el-col>
        <el-col :span="8" class="rside">
            <div class="title-content" id="rside-title">
                <span>处理详情</span>
            </div>
            <div class="deal-content" id="dealcontent">
                <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                    <div id="rightLine" v-if="commentList.length!=0"></div>
                    <div class="deal-details" v-for="(item,index) in commentList" :key="index">
                        <div class="circle-content" :style="item.showContent?{'background-color':'#FBC7CC'}:{'background-color':'#FAFAFA'}">
                            <div class="circle"></div>
                        </div>
                        <div class="deal-lside">
                            <span v-if="item.showLabel" :style="item.spanStyle">{{item.process}}</span>
                        </div>
                        <div class="deal-rside">
                            <div class="audio">
                                <span class="creator">{{item.createOr}}</span>
                                <div class="speech-content deal-speech" v-if="item.showAudio">
                                    <div class="speech-info" @click="startSpeechItem(item,index)">
                                        <i class="iconfont icon-yuyin icon-speech"></i>
                                    </div>
                                    <audio :ref="item.audio.audioRef">
                                        <source :src="item.audio.audioSrc" type="audio/mpeg" />
                                    </audio>
                                    <!-- v-if="item.audio!=null" -->
                                    <span class="often-text">{{item.audio.audioOftenText}}</span>
                                </div>
                            </div>
                            <pre v-if="item.description!=null" class="description">{{item.description}}</pre>
                            <div class="source-content" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                                <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                                    <div v-if="_item.mediaType==2" class="img-content">
                                        <img class="imgLittle imgInner" :title="imgTitle"
                                        :src="_item.url" :height="imgHeight+'px'" :onerror='deafultImg'
                                        @click="openOuter(_item,$event)"/>
                                    </div>
                                    <div  v-else class="img-content " @click="playCommentVideo(_item,_index)">
                                        <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                        <img class="imgLittle" :src="videoImgSrc" :height="imgHeight+'px'"/>
                                    </div>
                                </div>
                            </div>
                            <div class="viedo-info">
                                <span>{{item.createDate}}</span>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import api  from '../../../api/index';
import util from '../../../common/util';
import dashAPI from '@/api/dash'
import videojs from '../../../../static/video.js'
import 'videojs-contrib-hls';
import {eventRESTful} from '@/api/index'
import AudioVue from '@/components/AudioVue.vue'
import $ from 'jquery';
import {getDeviceList} from '@/api/device'
export default {
    name:"RateManage",
    components:{
        AudioVue
    },
    data(){
        return{
            event:{},
            showWindContent:false,
            dialogFormVisible:false,
            dialogCommentVideo:false,
            showWinpBtn:true,
            audioOftenText:'',
            speech:false,
            audioRef:'audioRef',
            audio:{},
            timeId:0,
            isPlaying:false,
            audioSrc:'',
            showAudio:false,
            videoSrc:"",
            curChannel:null,
            sourceList:[],
            commentList:[],
            protocal:'DASH',
            selGID:0,
            mpdurl:'',
            initialized: false,
            previewplayer:'',
            winpDes:'',
            timeid:0,
            windowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth,
            showOuter:false,
            bigImgSrc:'',
            checkImgSrc:'',
            imgTitle:'',
            showCheckVideo:false,
            showPhotoContent:false,
            deafultImg:'this.src="' + require('../../../../static/img/pic2.png') + '"',
            sessionId:'',
            subBtnList:[{name:'处理',isActive:true},{name:'结案',isActive:false},{name:'追加',isActive:false}],
            eventDes:'',
            videoSrc:require('../../../../static/img/监控icon.png'),
            inspectSrc:require('../../../../static/img/远程icon.png'),
            insiteInspectSrc:require('../../../../static/img/现场icon.png'),
            startIcon:require('../../../../static/img/pic_play_icon.png'),    
            videoImgSrc:require('../../../../static/img/image_videoThumbnail.png'),         
            curStatus:null,
        }
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        },
        currentStream() {
            return this.currentTech === 'Flash' ? 'RTMP' : 'HLS'
        },
        percentHeight:function(){
            return this.varyWindowWidth/758;
        },
        imgWidth(){
            let width=0;

        },
        imgHeight(){
            let height=0;
            if(this.varyWindowWidth>1800){
                height= this.varyWindowWidth*0.039;
            }
            else if(this.varyWindowWidth>1400){
                height= this.varyWindowWidth*0.035;
            }
            else{
                height=75; 
            }
            return height;
        },
        sourceSrc:function(){
            let src='';
            switch(this.event.sourceType){
                case 0: src=this.videoSrc; break;
                case 1: src=this.inspectSrc;break;
                case 2: src=this.insiteInspectSrc;break;
            }
            return src;
        },
        divHeight(){
            if(this.windowHeight>800){
                return this.windowHeight*0.749;
            }
            else if(this.windowHeight>700){
                return this.windowHeight*0.659;
            }
            else{
                return this.windowHeight*0.609;
            }
        }
    },
    methods:{
        onPlayerPlay(player){
            console.log(player);
        },
        onPlayerPause(player){
            console.log(player);
        },
        onPlayerReadied() {
            if (!this.initialized) {
                this.initialized = true
                this.currentTech = this.player.techName_;
                
            }
        },
        // record current time
        onTimeupdate(e) {
            console.log('currentTime', e.cache_.currentTime)
        },
        async playVideo(url) {
            console.log('playvideo enter!');
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },

        stopCommentVideo(){
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.pause();
        },
        playCommentVideo(item,index){
            let self=this;
            self.dialogCommentVideo=true;
            self.$nextTick(function(){
                var video = document.getElementById("previewVideo");
                this.previewplayer = videojs(video);
                this.previewplayer.src({src:item.url});
                this.previewplayer.play();
            })
            
        },
        openOuter(item,$ev){
            let self=this;
            console.log(item);
            console.log($ev.target.onerror);
            if(item!=null){
                self.showOuter=true;
                self.checkImgSrc=item.url;
                self.showImg=true;
            }
        },
        showOuterPhoto(target){
            let self=this;
            var winWidth=$(window).width();
            var winHeight=$(window).height();
            var src=target.src;
            self.bigImgSrc=src;
        },
        async realTime(){
            let self=this;
            console.log('实时播放');
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            self.sessionId=sessionId;
            const data = {
                request: { 
                  method: 'connection',
                  sessionID: sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:self.curChannel.ivsId,
                  channel:JSON.stringify(self.curChannel.channelId),
                  streamType:'SubStream'
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if (self.mpdurl.ErrorCode==undefined&&self.mpdurl.length!=0) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }
        },
        stopVideo(){
            let self=this;
            //var video = document.getElementById("previewVideo");
            //self.previewplayer = videojs(video);
            self.previewplayer.pause();
        },
        async stopRealTime(){
            let self=this;
            self.stopVideo();
            const data = {
                request: { 
                  method: 'disconnection',
                  sessionID: self.sessionId,
                  IVSID:self.curChannel.ivsId,
                  channel:JSON.stringify(self.curChannel.channelId),
                  streamType:'SubStream'
                }
            };
            let ret=await dashAPI.RealTime(0,data);
            await dashAPI.Offline(self.sessionId);
        },
        myfun(){  
            var div1=document.getElementsByClassName("lside");  
            var div2=document.getElementsByClassName("rside");
            let height=div1[0].offsetHeight;
            div2[0].style.height=height+'px';
            var divtitle=document.getElementById('rside-title');
            var divContent=document.getElementById('dealcontent');
            divContent.style.height=(height-divtitle.offsetHeight)+'px';
        },
        getDeviceList(){
            let self=this;
            return new Promise((resolve,reject)=>{
                getDeviceList().then(res=>{
                    let errMsg=res.errMsg;
                    if(errMsg!=undefined&&errMsg=='Success'){
                        let data=res.data;
                        resolve(res.data);
                    }
                })
            })
        },
        async getSessionData(){
            let self=this;
            let event=JSON.parse(sessionStorage.getItem('event'));
            let obj={
                id:event.id,
                eventTitle:event.subject,
                storeName: event.storeName,
                createor:event.assignerName,
                assigneeName:event.assigneeName,
                createDate:util.getDateTime(event.ts),
                deviceId:event.deviceId,
                status:event.status,
                score:event.score,
                sourceType:event.sourceType,
                description:event.initialComment.description
            };
            self.event=obj;
            let deviceId=self.event.deviceId;
            let deviceList=await self.getDeviceList();
            let flag=false;
            if(deviceList!=undefined){
                deviceList.forEach(item=>{
                    if(item.id==deviceId){
                        flag=true;
                        self.curChannel=item;
                    }
                })
            }
            if(flag){
                self.showCheckVideo=true;
            }
            let attachment=event.initialComment.attachment;
            let temp=[];
            attachment.forEach(item=>{
                if(item.mediaType==0){
                    self.audioSrc=item.url;
                    self.showAudio=true;
                    // self.audio.audioSrc=item.url;
                    // self.audio.audioRef='audioRef';
                }
                else{
                    temp.push(item);
                }
            })
            self.sourceList=temp;
            console.log(self.event);
        },
        getProcess(){
            let self=this;
            if(self.showAudio){
                if(isNaN(self.$refs.audioRef.duration)){
                    self.showAudio=false;
                }
                else{
                    self.audioOftenText=parseInt(self.$refs.audioRef.duration)+'"';
                }
            }
            self.commentList.forEach((_item,_index)=>{
                if(_item.showAudio){
                    if(isNaN(self.$refs[_item.audio.audioRef][0].duration)){
                        _item.showAudio=false;
                    }
                    else{
                        _item.audio.audioOftenText=parseInt(self.$refs[_item.audio.audioRef][0].duration)+'"';
                    }
                }
            })
            console.log(self.commentList);
        },
        startSpeech(){
            let self=this;
            if(!self.isPlaying){
                self.$refs.audioRef.play();
                self.isPlaying=true;
                self.speech=true;
                // self.timeid=setInterval(()=>{
                //     self.getProcess();
                // },3000);
            }
            else{
                self.$refs.audioRef.pause();
                self.isPlaying=false;
                self.speech=false;
                clearInterval(self.timeid);
            }
        },
        startSpeechItem(item,index){
            let self=this;
            console.log(item);
            if(!item.audio.isPlaying){
                self.$refs[item.audio.audioRef][0].play();
                item.audio.isPlaying=true;
            }
            else{
                self.$refs[item.audio.audioRef][0].pause();
                item.audio.isPlaying=false;
            }
            self.commentList.forEach((_item,_index)=>{
                if(_index!=index){
                    self.$refs[_item.audio.audioRef][0].pause();
                    _item.audio.isPlaying=false;
                }
            })
        },
        checkVideo(){
            let self=this;
            self.dialogFormVisible=true;
            self.realTime();
        },
        getCommentList(){
            let self=this;
            let eventIds=[];
            eventIds.push(self.event.id);
            let params={
                "eventIds":eventIds
            };
            eventRESTful.getCommentList(params).then(res=>{
                let errMsg=res.errMsg;
                let data=res.data;
                if(errMsg=='Success'){
                    let comments=data[0];
                    console.log(comments);
                    let dataComments=comments.comment;
                    let temp=[];
                    self.curStatus=dataComments[0].status;
                    dataComments.forEach((item,index)=>{
                        let obj={};
                        obj.createOr=item.accountName;
                        obj.createDate=util.getDateTime(item.ts);
                        obj.status=item.status;
                        obj.description=item.description;
                        switch(item.status){
                            case 0: obj.showLabel=true;obj.spanStyle={'background-color':'#FCB83B'};
                                obj.process='未处理'; break;
                            case 1: obj.showLabel=true;obj.spanStyle={'background-color':'#434B5E'};
                                obj.process='已处理'; break;
                            case 2: obj.showLabel=true;obj.spanStyle={'background-color':'#6097F4'};
                                obj.process='已结案'; break;
                        }
                        if(item.status==2){
                            self.showWinpBtn=false;
                        }
                        if(index==0){
                            obj.showContent=true;
                        }
                        else{
                            obj.showContent=false;
                        }
                        if(item.attachment.length!=0){
                            let _temp=[];
                            let audioObj={};
                            item.attachment.forEach((_item,_index)=>{
                                
                                if(_item.mediaType==0){
                                    audioObj.audioSrc=_item.url;
                                    audioObj.audioRef='audioRef'+index;
                                    audioObj.isPlaying=false;
                                    obj.showAudio=true;
                                }
                                else{
                                    _temp.push(_item);
                                }
                            })
                            obj.audio=audioObj;
                            obj.sourceList=_temp;
                        }
                        temp.push(obj);

                    })
                   self.commentList=temp.slice(0,temp.length-1);
                   //self.commentList=temp;
                }
            })
        },
        clickSubBtn(item,index){
            let self=this;
            item.isActive=true;
            self.subBtnList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isActive=false;
                }
            })
        },
        addComment(status,description){
            let self=this;
            let eventIds=[];
            eventIds.push(self.event.id);
            let comments={
                ts:new Date().getTime(),
                description:description,
                account:self.event.createor,
                status:status
            };
            let params={
                eventIds:eventIds,
                comment:comments
            };
            eventRESTful.addComment(params).then(res=>{
                console.log(res);
                let errMsg=res.errMsg;
                if(errMsg=='Success'){
                    self.notify('提交成功！','success',3000);
                    self.getCommentList();
                    self.eventDes='';
                    self.getProcess();
                }
                else{
                    self.notify('提交失败！','warning',3000);
                    return false;
                }
            })
        },
        submit(){
            let self=this;
            let status=0;
            let description=self.eventDes;
            if(description.trim().length==0){
                self.notify('评论信息不能为空！','warning',3000);
                return false;
            }
            if(self.subBtnList[0].isActive==true){
                status=1;
            }
            else if(self.subBtnList[1].isActive==true){
                status=2;
            }
            else{  //追加状态，需判断当前状态
                status=self.curStatus;
            }
            self.addComment(status,description);
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },

        //添加beforeunload监听事件
        createBeforeunloadHandler() {
            //window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
            window.addEventListener('beforeunload', this.beforeunloadHandler, false);
        },
        //移除beforeunload事件
        destroyedBeforeunloadHandler() {
            //window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));//错误方法，无法移除
            window.removeEventListener('beforeunload', this.beforeunloadHandler, false);
            //this.rowEditEnable = 0;
        },

        beforeunloadHandler(e) {
            e.returnValue = "确定要关闭窗口吗？";
            console.log("释放权限操作");
            alert();
            setTimeout(function () {
                setTimeout(function () {
　　　　　　　　　　　　console.log("恢复用户权限操作"); 
　　　　　　　　　　}, 50)
            }, 50);
        },
    },
    mounted(){
        let self=this;
        self.getSessionData();  //获取session中存储的event信息
        self.getCommentList();  //获取comment信息
        this.$nextTick(function(){
            setTimeout(()=>{
                self.myfun();
                
            },500);
            setTimeout(()=>{
                self.getProcess();
            },3000);
        })
        
    },
    created(){
        let self=this;
    },
    updated(){ 
        let self=this;
        self.commentList.forEach((item,index)=>{
            console.log(self.$refs);
        })
    }, 
    beforeDestroy(){
        window.clearInterval(this.timeid);
    } 
}
</script>
<style lang="scss" scoped>
@import '../../../assets/css/textstyle.css';
@import '../../../assets/css/importfile.css'; 
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
@function rem($val){
    @return $val/16+rem;
}
@function checkRem($val){
    @if($val==auto){@return auto;}
    @else if($val==0){@return 0;}
    @else{@return rem($val);}
}
@mixin point($poi,$val){
    #{$poi}:checkRem($val);
}
@mixin title-content{
    text-align: left;
    position: relative;
    @include point(height,60);
    @include point(line-height,60);
    border-bottom: 1px solid $border;
    @include point(padding-left,20);
    @include point(padding-right,20);
}
#outerdiv{
    position:fixed;
    top:20%;
    left:50%;
    background:rgba(0,0,0,0.7);
    z-index:2;
    height:100%;
    #bigimg{
        @include point(height,500);
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
}
.fade-enter, .fade-leave-active {
    opacity: 0
}
.el-rate-container{
    background-color: #f7f8fa;
    @media screen and(min-width: 1366px){
        .el-submit{
            top: 30%;
        }
        .storeInfo-details{
            height: 50px;
            line-height: 50px;
        }
        .description{
            max-width: 75%;
            min-width: 75%;
        }
        .event-title{
            font-size: 18px;
        }
        .deal-lside span{
            top:24px;
        }
    }
    @media screen and(max-width: 1366px){
        .el-submit{
            top: 20%;
        }
        .storeInfo-details{
            height: 40px;
            line-height: 40px;
        }
        .description{
            max-width: 70%;
            min-width: 70%;
        }
        .event-title{
            @include point(font-size,18);
        }
        .deal-lside span{
            top:30px;
        }
    }
    .lside{
        @include point(padding-bottom,20);
        @include point(margin-right,20);
        border: 1px solid $border;
        background-color: #fff;
        width: 63.5%;
        .title-content{
            @include title-content;
            .title-img{
                position: relative;
                @include point(top,8);
                @include point(margin-left,20);
            }
            .event-title{
                @include point(padding-right,20);
                font-weight: bold;
                color: $black;
                margin-left: 20px;
            }
            .event-score{
                background-color: #FCBA3F;
                padding:4px 12px;
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                border-radius: 12px;
            }
            .el-submit{
                position: absolute;
                @include point(right,20);
                @include point(width,90);
                color: #fff;
            }
        }
        .dialog-content{
            width: 100%;
        }
        .dialog-source-content{
            @include point(height,320);
            @include point(padding,20);

            img{
                height: 100%;
            }
        }
        .video-dialog-content{
            width:100%;
            height:100%;
            margin: auto;
            .dialog-hr{
                border: 0.5px solid ;
                border-color: rgba(251,76,93,0.3);
                margin-bottom:10px;
                bottom: 5px;
                margin-top: 0;
            }
            .video-content{
                @include point(padding,20);
                padding-top: 0;
            }
        }
        #previewVideo{
            @include point(min-width,450);
            @include point(min-height,360);
        }
        .storeInfo-content{
            text-align: left;
            @include point(padding-top,15);
            padding-left: 10px;
            color: #424151;
            font-size: 14px;
            .storeInfo-details{
                font-size: 14px;
                color: $black;
            }
            dd{
                width: 5em;
            }
            .w4{
                font-weight: bold;
                float: left;
            }
            .w3-content{
                margin-right: 45px;
                overflow: hidden;
                display: inline-block;
                width: 200px;
            }
            .w3{
                letter-spacing:0.3334em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-3）/(3-1)=0.5em */
                margin-right:-0.3334em; /*同上*/
                font-weight: bold;
                float: left;
            }
            .details-info{
                margin-left: 15px;
                float: left;
                color: $tab;
            }
        }
        .submit-content{
            background-color: $background;
            margin-left: 25px;
            text-align: left;
            font-size: 14px;
            margin-top: 15px;
            padding-left: 25px;
            color: $black;
            width: 92%;
            @include point(padding-top,20);
            .dealInfo-label{
                font-weight: bold;
                @include point(margin-bottom,20);
                display: block;
            }
            .btn-content{
                @include point(margin-top,10);
                @include point(margin-bottom,20);
                span{
                    display: inline-block;
                    @include point(margin-left,20);
                    border: 1px solid #ddd;
                    padding:6px;
                    font-size: 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    @include point(width,80);
                    @include point(padding,6);
                    text-align: center;
                    background-color: #fff;
                    &:first-child{
                        margin-left: 0;
                    }
                }
                .activeClass{
                    background-color: #FDE8EF !important;
                    color: $red;
                    border-color: $red !important;
                }
            }
            .des-input{
                @include point(margin-right,20);
                @include point(margin-top,12);
                width: 80%;
            }
        }
        .eventInfo-content{
            text-align: left;
            @include point(margin-top,15);
            padding-left: 50px;
            font-size: 14px;
            overflow: hidden;
            strong{
                color: $black;
                float: left;
                margin-right: 10px;
                margin-top: 10px;
            }
            .content{
                float: left;
                position: relative;
                @include point(min-height,50);
                @include point(min-width,260);
            }
            .description{
                text-align: left;
                font-family:'Microsoft YaHei';
                font-size: 12px;
                white-space:pre-wrap; /* css3.0 */ 
                white-space:-moz-pre-wrap; /* Firefox */ 
                white-space:-pre-wrap; /* Opera 4-6 */ 
                white-space:-o-pre-wrap; /* Opera 7 */ 
                word-wrap:break-word; /* Internet Explorer 5.5+ */
            }
            .speech-content{
                .speech-info{
                    @include point(width,80);
                    @include point(height,26);
                    background-color: #FFEDED;
                    color: $red;
                    border: 1px solid #FEC0C7;
                    @include point(border-radius,15);
                    display: inline-block;
                    cursor: pointer;
                    .icon-speech{
                        @include point(font-size,18);
                        @include point(line-height,26);
                        @include point(margin-left,5);
                    }
                }
                .often-text{
                    @include point(margin-left,20);
                }
            }
            .photo-content{
                overflow: hidden;
                @include point(margin-top,15);
                
                .source-content{
                    float: left;
                    @include point(margin,5);
                    @include point(max-width,220);
                
                    .img-content{
                        position: relative;
                        cursor: pointer;
                        .start-icon{
                            position: absolute;
                            left: 35%;
                            top: 30%;
                        }
                    }
                    .video-content{
                    width: 100%;
                    }
                }
            }
            .viedo-info{
                bottom: 15px;
                span{
                    font-size: 12px;
                    color: #94a4b4;
                }
                div{
                    @include point(margin-left,5);
                    display: inline-block;
                    cursor: pointer;
                    .icon-video{
                        font-size: 18px;
                        color: $red;
                        position: relative;
                        top: 2px;
                        margin-right: 5px;
                    }
                    .ahref{
                        text-decoration: underline;
                        color: $red;
                    }
                }
            }
        }
    }
    .rside{
        border: 1px solid $border;
        background-color: #fff;
        // @include point(margin-right,20);
        color: $black;
        height: 100%;
        .title-content{
            @include title-content;
            font-size: 14px;
            border-bottom: 1px solid $border;
        }
        .deal-content{
            position: relative;
            .circle-content{
                background-color: #FBC7CC;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                position: absolute;
                left: 109px;
                top:30px;
            }
            .circle{
                width: 14px;
                height: 14px;
                border-radius: 50%;
                -moz-border-radius: 50%;      
                -webkit-border-radius: 50%;
                position: relative;
                top: 4px;
                left: 4px;
                background-color: $red;
            }
            #rightLine{
                height: 100%;
                width: 1px;
                position: absolute;
                left: 119px;
                background-color: $border;
            }
            .deal-details{
                overflow: hidden;
                position: relative;
                .deal-lside{
                    width: 119px;
                    @include point(height,100);
                    position: relative;
                    float: left;
                    span{
                        display: inline-block;
                        position: relative;
                        // top:24px;
                        padding: 2px 10px;
                        color: #fff;
                        font-size: 12px;
                    }
                }
                .deal-rside{
                    width:calc(100% - 120px);
                    height: 100%;
                    @include point(min-height,100);
                    border-left: 1px solid #ddd;
                    float: left;
                    @include point(padding-top,5);
                    .audio{
                        padding-top: 26px;
                        overflow: hidden;
                        text-align: left;
                        .creator{
                            @include point(margin-left,20);
                            float: left;
                            font-size: 14px;
                        }
                        .deal-speech{
                            display: inline-block;
                            @include point(margin-left,10);
                            position: relative;
                            @include point(bottom,10);
                            .often-text{
                                @include point(margin-left,20);
                                display: inline-block;
                                font-size: 12px;
                            }
                        }
                        .speech-content{
                            .speech-info{
                                @include point(width,80);
                                @include point(height,26);
                                background-color: #FFEDED;
                                color: $red;
                                border: 1px solid #FEC0C7;
                                @include point(border-radius,15);
                                display: inline-block;
                                cursor: pointer;
                                .icon-speech{
                                    @include point(font-size,18);
                                    @include point(line-height,26);
                                    @include point(margin-left,5);
                                }
                            }
                            .often-text{
                                @include point(margin-left,20);
                            }
                        }
                    }
                    
                    .description{
                        float: left;
                        text-align: left;
                        @include point(margin-top,15);
                        @include point(margin-left,20);
                        font-family:'Microsoft YaHei';
                        font-size: 12px;
                        white-space:pre-wrap; /* css3.0 */ 
                        white-space:-moz-pre-wrap; /* Firefox */ 
                        white-space:-pre-wrap; /* Opera 4-6 */ 
                        white-space:-o-pre-wrap; /* Opera 7 */ 
                        word-wrap:break-word; /* Internet Explorer 5.5+ */
                    }
                    .source-content{
                        @include point(margin-left,8);
                        overflow: hidden;
                        min-width: 90%;
                        @include point(margin-top,15);
                        .source-details{
                            float: left;
                            @include point(max-width,220);
                            @include point(width,100);
                            @include point(height,65);
                            .img-content{
                                position: relative;
                                cursor: pointer;
                                .start-icon{
                                    position: absolute;
                                    left: 35%;
                                    top: 30%;
                                }
                            }
                            .imgInner{
                                position: absolute;
                                left: 0;
                                clip: rect(0px 80px 60px 0px);
                            }
                            &:first-child{
                                @include point(margin-left,15);
                            }
                        }
                    }
                    .viedo-info{
                        color: $tab;
                        font-size: 12px;
                        float: left;
                        @include point(margin-left,22);
                        padding-bottom: 15px;
                    }
                }
            }
        }
    }
}
</style>
<style>
@import '../../../assets/css/importfile.css';
.el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>