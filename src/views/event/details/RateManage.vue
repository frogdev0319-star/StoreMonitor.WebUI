<template>
    <el-row class="el-rate-container">
        <el-col :span="16" class="lside" :style="{'min-height':windowHeight*0.82+'px'}">
            <div class="title-content">
                <img :src="sourceSrc" :height="varyWindowWidth>1366?'40px':'32px'" class="title-img" />
                <span class="event-title">{{event.eventTitle}}</span>
                <span class="event-score" v-if="event.score!=-1">{{generateEventLang('scores')}} {{event.score}}</span>
                <el-button :size="varyWindowWidth>1680?'small':'mini'" class="el-submit" @click="submit" v-if="showWinpBtn" type="primary">{{generateEventLang('submit')}}</el-button>
            </div>
            <el-dialog  :title="generateEventLang('view')" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
            v-if="dialogFormVisible" width="850px" top=12% @close='closeRealTime' class='rate-video-dialog'>
                <div class="video-dialog-content" style="overflow:hidden;" @mousemove="showControlInfo=true" @mouseleave="showControlInfo=false">
                    <hr class="dialog-hr"/>
                    <div class="video-content" id="videoContent" v-if="!isEzviz">
                        <div id="channelName" v-if="showControlInfo"><span>{{curChannel.name}}</span></div>
                        <div class="icon-footer" v-if="showControlInfo">
                            <div class="iconlside">
                                <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="!playState"></i>
                                <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-else></i>
                            </div>
                            <div class="iconrside">
                                <div class="screen-content">
                                    <i class="iconfont iconscreen"
                                    :class="fullScreen?'icon-tuichuquanping':'icon-quanping'" @click="controlScreen"></i>
                                    <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
                                </div>
                            </div>
                        </div>
                        <video  height=83% width=90% id="previewVideo" prload :controls="false"
                            class="video-js vjs-fill">
                        </video>
                    </div>
                  <ezviz-video v-else :channel-info="channelInfo" :is-event='isEvent' :store-id="event.storeId" ref="ezvizVideo">
                  </ezviz-video>
                </div>
            </el-dialog>
            <el-dialog  :title="generateEventLang('view')" :visible.sync="dialogCommentVideo" :close-on-click-modal="false"
            v-if="dialogCommentVideo" width="850px" top=12% @close='stopCommentVideo' class='rate-video-dialog'>
                <div class="video-dialog-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="video-content" >
                        <video  height=83% width=90% id="previewVideo" prload  controls
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
                <el-dialog :title="generateEventLang('view')"
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
                    <dd><span :class="lang=='en'? 'en-w4': 'w4'">{{generateEventLang('storeName')}}：</span></dd>
                    <span class="details-info">{{event.storeName}}</span>
                </div>
                <div class="storeInfo-details">
                    <div :class="lang == 'en' ? 'en-w3-content' : 'w3-content'">
                      <dd><span :class="lang=='en'? 'en-w3': 'w3'">{{generateEventLang('submitter')}}：</span></dd>
                      <el-tooltip :popper-class="tooltipClass" effect="dark" :content="event.createor" placement="bottom-start">
                        <span class="details-info">{{event.createor}}</span>
                      </el-tooltip>
                    </div>
                    <div :class="lang == 'en' ? 'en-w3-content' : 'w3-content'">
                        <dd><span :class="lang=='en'? 'en-w3': 'w3'">{{generateEventLang('solver')}}：</span></dd>
                      <el-tooltip :popper-class="tooltipClass" effect="dark" :content="event.assigneeName" placement="bottom-start">
                        <span class="details-info">{{event.assigneeName}}</span>
                      </el-tooltip>
                    </div>
                </div>
                <div class="storeInfo-details">
                    <dd><span :class="lang=='en'? 'en-w4': 'w4'">{{generateEventLang('submitTime')}}：</span></dd>
                    <span class="details-info">{{event.createDate}}</span>
                </div>
            </div>
            <div class="eventInfo-content">
                <strong v-if="lang=='en'" style="margin-right: 28px">{{generateEventLang('eventDetails')}}:</strong>
                <strong v-else>{{generateEventLang('eventDetails')}}：</strong>
                <div class="content">
                    <div class="speech-content" v-if="showAudio">
                        <div class="speech-info" @click="startSpeech">
                            <i class="iconfont icon-speech" :class="speech?'icon-yuyin':'icon-yuyin'"></i>
                        </div>
                        <audio :ref="audioRef" id="audio" @canplay="getDuration">
                            <source :src="audioSrc" type="audio/mpeg" />
                        </audio>
                        <span class="often-text">{{audioOftenText}}</span>
                    </div>

                    <pre  class="description">{{event.description}}</pre>
                    <div class="photo-content">
                        <div v-for="(item,index) in sourceList" :key="index" class="source-content">
                            <div v-if="item.mediaType==2" class="img-content">
                                <!--图片资源-->
                                <!-- :width="imgHeight*1.4+'px'" -->
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
                <span class="dealInfo-label">{{generateEventLang('events')}}</span>
                <span>{{generateEventLang('methods')}}</span>
                <div class="btn-content">
                    <span v-for="(item,index) in subBtnList" :key="index" :class="item.isActive?'activeClass':''" @click="clickSubBtn(item,index)">
                        {{item.name}}
                    </span>
                </div>
                <span style="display:block;">{{generateEventLang('addDetails')}}</span>
                <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 2}"
                    maxlength="300" v-model="eventDes" :placeholder="generateEventLang('describe')"></el-input>
            </div>
        </el-col>
        <el-col :span="8" class="rside">
            <div class="title-content" id="rside-title">
                <span>{{generateEventLang('details')}}</span>
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
                                    <audio :ref="item.audio.audioRef" @canplay="getCommentDuration(item)">
                                        <source :src="item.audio.audioSrc" type="audio/mpeg" />
                                    </audio>
                                    <span class="often-text">{{item.audio.audioOftenText}}</span>
                                </div>
                            </div>
                            <pre v-if="item.description!=null" class="description">{{item.description}}</pre>
                            <div class="source-content" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                                <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details" :height="imgHeight+'px'">
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
import {generateEventLang} from  '@/api/i18n'
import EzvizVideo from '@/components/EzvizVideo.vue'
import PermissionHelper from "../../../api/PermissionHelper";

export default {
    name:"RateManage",
    components:{
        AudioVue,
        EzvizVideo
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
            eventDes:'',
            videoSrc:require('../../../../static/img/监控icon.png'),
            inspectSrc:require('../../../../static/img/远程icon.png'),
            insiteInspectSrc:require('../../../../static/img/现场icon.png'),
            startIcon:require('../../../../static/img/pic_play_icon.png'),
            videoImgSrc:require('../../../../static/img/image_videoThumbnail.png'),
            curStatus:null,
            fullScreen:false,
            showControlInfo:true,
            playState:false,
            lang: this.$i18n.locale,
            isEvent: true,
            channelInfo: {},
            subBtnList:[],
            tooltipClass:'event-tooltip-class'
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
        },
      isEzviz() {
        let self = this;
        console.log(self.$store.state.user);
        return self.$store.state.user.isEzviz
      }
    },
    methods:{
        generateEventLang,
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
            let self=this;
            self.playState=true;
            console.log('playvideo enter!');
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
            setTimeout(() => {
                self.showControlInfo=false;
            }, 3000);
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
            self.playState=false;
        },
        closeRealTime(){
            let self=this;
            if(!self.isEzviz){
              if(self.playState){
                self.stopRealTime();
              }
            }
            else{
              self.$refs.ezvizVideo.stopRealTime();
            }
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
        gonggeScreen(){

        },
        controlScreen(){
            let self=this;
            if(!self.fullScreen){
                self.fullWindowScreen();
                self.fullScreen=true;
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
                description:event.initialComment.description,
                storeId: event.storeId
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
        getDuration(){
            let self=this;
            if(self.showAudio){
                let audio=self.$refs.audioRef;
                let du=audio.duration;
                console.log(du)
                console.log(typeof(du)=='string')
                if(isNaN(du)){
                    self.showAudio=false;
                }
                else{
                    //self.audioOftenText=parseInt(du)+'"';
                    self.audioOftenText=Math.ceil(du)+'"';
                }
            }
        },
        getCommentDuration(item){
            let self=this;
            if(item.showAudio){
                let audio=self.$refs[item.audio.audioRef][0];
                let du=audio.duration;
                console.log(du)
                if(isNaN(du)){
                    item.showAudio=false;
                }
                else{
                    //item.audio.audioOftenText=parseInt(du)+'"';
                    item.audio.audioOftenText=Math.ceil(du)+'"';
                    console.log(item.audio.audioOftenText);
                }
            }
        },
        getCommentProcess(){
            let self=this;
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
        },
        startSpeech(){
            let self=this;
            if(!self.isPlaying){
                self.$refs.audioRef.play();
                self.isPlaying=true;
                self.speech=true;
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
                if(_item.audio!=undefined){
                    if(_index!=index){
                        self.$refs[_item.audio.audioRef][0].pause();
                        _item.audio.isPlaying=false;
                    }
                }
            })
        },
        checkVideo(){
            let self=this;
            self.dialogFormVisible=true;
            if(!self.isEzviz){
              self.realTime();
            }
            else{
              self.channelInfo = self.curChannel
            }
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
                               // obj.process='未处理'; break;
                                obj.process= this.$t('eventView.pending'); break;
                            case 1: obj.showLabel=true;obj.spanStyle={'background-color':'#434B5E'};
                                obj.process= this.$t('eventView.handled'); break;
                            case 2: obj.showLabel=true;obj.spanStyle={'background-color':'#6097F4'};
                                obj.process=this.$t('eventView.closed'); break;
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
                                    audioObj.audioOftenText='';
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
                    self.notify(this.$t('storeView.successSubmit'),'success',3000);
                    self.getCommentList();
                    self.eventDes='';
                    setTimeout(()=>{
                        self.commentList.forEach((_item,_index)=>{
                            self.getCommentDuration(_item);
                        });
                    },3000);
                }
                else{
                    self.notify(this.$t('storeView.failSubmit'),'warning',3000);
                    return false;
                }
            })
        },
        submit(){
            let self=this;
            let status=0;
            let description=self.eventDes;
            if(description.trim().length==0){
                self.notify(this.$t('eventView.emptyInfo'),'warning',3000);
                return false;
            }
            if(self.subBtnList[0].isActive){
              if(status = self.subBtnList[0].order==0){
                status = 1;
              }
              else if(self.subBtnList[0].order==1){
                status = 2;
              }
              else{
                //追加状态，需判断当前状态
                status=self.curStatus;
              }
            }
            else if(self.subBtnList[1].isActive){
              if(self.subBtnList[1].order == 1){
                status = 2;
              }
              else{
                //追加状态，需判断当前状态
                status=self.curStatus;
              }
            }
            else{
              //追加状态，需判断当前状态
              status=self.curStatus;
            }
            console.log(status)
            // if(self.subBtnList[0].isActive==true){
            //     status=1;
            // }
            // else if(self.subBtnList[1].isActive==true){
            //     status=2;
            // }
            // else{  //追加状态，需判断当前状态
            //     status=self.curStatus;
            // }
            self.addComment(status,description);
        },
        checkFull(){
            var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if(isFull === undefined)
            {
                isFull = false;
            }
            return isFull;
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
        getBtnList(){
            let self = this;
            let authorities = self.$store.state.user.authorities;
            console.log(authorities)
            PermissionHelper.setData(authorities);
            let tempBtnList = [];
            PermissionHelper.enableEventHandle()  && tempBtnList.push({
              name:this.$t('eventView.handling'),
              order: 0,
            });
            PermissionHelper.enableEventClose()  && tempBtnList.push({
              name:this.$t('eventView.closing'),
              order: 1,
            })
            PermissionHelper.enableEventAdd() && tempBtnList.push({
              name:this.$t('eventView.adding'),
              order: 2
            })
            tempBtnList.forEach((item, index)=>{
              item.isActive = index == 0 ? true: false;
            })
          self.subBtnList = tempBtnList;
        }
    },
    // beforeRouteLeave (to, from, next) {
    //     if(to.name=='事件管理'){
    //         to.meta.keepAlive=true;
    //     }
    //     next();
    // },
    mounted(){
        let self=this;
        self.getBtnList();
        self.getSessionData();  //获取session中存储的event信息
        self.getCommentList();  //获取comment信息
        self.$nextTick(function(){
            setTimeout(()=>{
                self.myfun();
            },500);
            setTimeout(() => {
                self.getDuration();
                self.commentList.forEach((_item,_index)=>{
                    self.getCommentDuration(_item);
                });
            }, 0);

        })

        window.onresize=function(){
            if(!self.checkFull()){
                self.fullScreen=false;
                var ele = document.getElementById('videoContent');
                ele.style.width = "auto";
                ele.style.height = "auto";
            }
        }
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
                height: calc(36/1920*100vw);
                width: calc(130/1920*100vw);
                margin: 0;
                padding: 0;
                font-size: calc(14/1920*100vw);
                line-height: calc(36/1920*100vw);
                border-width: 0;
                border-radius: 3px;
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
                user-select: none;
            }
        }
        .video-dialog-content{
            width:100%;
            height:100%;
            margin: auto;
            .dialog-hr{
                border: 0.5px solid ;
                border-color: #dfe2e9;
                margin-bottom:10px;
                bottom: 5px;
                margin-top: 0;
            }
            .video-content{
                @include point(margin,20);
                padding-top: 0;
                position: relative;
                #channelName{
                    width: 100%;
                    color: #fff;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    height: 40px;
                    line-height: 40px;
                    position: absolute;
                    z-index: 10;
                    text-align: left;
                    span{
                        margin-left: 30px;
                    }
                }
                .icon-footer{
                    width: 100%;
                    position: absolute;
                    bottom: 0px;
                    color: #fff;
                    overflow: hidden;
                    user-select:none;
                    background-color: rgba($color: #24293d, $alpha: 0.6);
                    height: 40px;
                    line-height: 40px;
                    z-index: 10;
                    .iconlside{
                        float: left;
                        text-align: left;
                        .iconplay{
                            font-size: 18px;
                            cursor: pointer;
                            float: left;
                            margin-left: 30px;
                        }

                    }
                    .iconrside{
                        max-width: 500px;
                        float: right;
                        position: relative;
                        span{
                            font-size: 13px;
                            margin-right:6px;
                            margin-left: 20px;
                        }
                        .speed-content{
                            display: inline-block;
                            span{
                                position: relative;
                                bottom:3px;
                            }
                        }
                        .screen-content{
                            display: inline;
                            margin-left: 30px;
                            position: absolute;
                            right: 20px;
                            .iconscreen{
                                font-size: 18px;
                                position: relative;
                                cursor: pointer;
                                margin-right: 20px;
                                bottom: 3px;
                            }
                        }
                    }
                }
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
            .en-w4{
              font-weight: bold;
              float: left;
              width: 105px
            }
            .w3-content{
                margin-right: 45px;
                overflow: hidden;
                display: inline-block;
                //width: 200px;
                width: calc(400/1920*100vw);
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .en-w3-content{
              margin-right: 45px;
              overflow: hidden;
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: calc(400/1920*100vw);
              //width: 200px;

            }
            .w3{
                letter-spacing:0.3334em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-3）/(3-1)=0.5em */
                margin-right:-0.3334em; /*同上*/
                font-weight: bold;
                float: left;
            }
            .en-w3{
              font-weight: bold;
              float: left;
              width: 105px
            }
            .details-info{
                margin-left: 15px;
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
                      .imgLittle{
                        width: calc(130/1920*100vw);
                      }
                    }
                    .video-content{
                        width: 100%;
                    }
                    // .imgInner{
                    //     position: absolute;
                    //     left: 0;
                    //     clip: rect(0px 130px 100px 0px);
                    // }
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
                        /*position: relative;*/
                        /*top: 2px;*/
                        margin-right: 5px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .ahref{
                      text-decoration: underline;
                      color: $red;
                      vertical-align: bottom;
                      display: inline-block;
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
                            //@include point(height,65);
                            .img-content{
                                position: relative;
                                cursor: pointer;
                                .start-icon{
                                    position: absolute;
                                    left: 35%;
                                    top: 30%;
                                }
                              .imgLittle{
                                width: calc(130/1920*100vw);
                              }
                            }
                            &:nth-child(2n+1){
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
  .event-tooltip-class{
    max-width: calc(200/1920*100vw);
  }
</style>
