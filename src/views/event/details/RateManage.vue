<template>
    <el-row class="el-rate-container">
        <el-col :span="24" class="title-content">
            <span class="event-title">{{event.eventTitle}}</span>
            <span class="event-score">得分：{{event.score==null?'---':event.score}}分</span>
            <el-button size="mini" class="el-submit" @click="windUp" v-if="showWinpBtn">结案</el-button>
        </el-col>
        <el-dialog  title='播放' :visible.sync="dialogFormVisible" :close-on-click-modal="false" 
        v-if="dialogFormVisible" :width="550*percentHeight+'px'" height=380px top=15% @close='stopRealTime' class='rate-video-dialog'>
            <div class="video-dialog-content" style="overflow:hidden;">
                <video  height=83% width=90% id="previewVideo" prload controls
                    class="video-js vjs-fill" style="postion:absoulte;top:10px;">
                </video>
            </div>
        </el-dialog>
        <el-dialog title='结案'
        :visible.sync="showWindContent" v-if="showWindContent"
        :append-to-body='true'
        :close-on-click-modal="false"
        width="28%"
        top="35vh"
        left="40vh">
            <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #FFC1C8;margin-top: 0;"/>
               <div class="tabName-input-content">
                    <el-input type="text" size="small" v-model="winpDes" class="tabName-input" style=""  maxlength='50'
                    placeholder="请输入结案评论"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showWindContent = false" size="mini" style="">取 消</el-button>
                <el-button class="file-confirm-btn" @click="confirmWind" size="mini" style="color:#fff">确 认</el-button>
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
            :visible.sync="showOuter" :close-on-click-modal="false" v-if="showOuter" width=550px height=300px top=15%>
             <hr style="border: 0.5px solid #FFC1C8;width:100%;margin-top:10px;margin-bottom:15px;"/>
                <div class="dialog-source-content">
                    <img v-if="showImg" :src="checkImgSrc"/>
                
                </div>
            </el-dialog>
        </transition>
        <el-col :span="24" class="storeInfo-content">
            <strong>门店</strong><span>{{event.storeName}}</span>
            <strong>提报人</strong><span>{{event.createor}}</span>
            <strong>提报时间</strong><span>{{event.createDate}}</span>
        </el-col>
        <el-col :span="24" class="eventInfo-content" :style="{'min-height':divHeight+'px'}">
            <strong>事件详情</strong>
            <div class="speech-content" v-if="showAudio">
               <div class="speech-info" @click="startSpeech"> 
                   <i class="iconfont icon-speech" :class="speech?'icon-yuyin':'icon-yuyin'"></i>
               </div>
               <audio :ref="audioRef" id="audio">
                    <source :src="audioSrc" type="audio/mpeg" />
                </audio> 
               <span class="often-text">{{audioOftenText}}</span>
            </div>
            <div class="photo-content">
                <div v-for="(item,index) in sourceList" :key="index" class="source-content">
                    <div v-if="item.mediaType==2" class="img-content">
                        <!--图片资源-->
                        <img class="imgLittle" :src="item.url" :title="imgTitle" :onerror='deafultImg'
                         height="100px" @click="openOuter(item,$event)"/>
                    </div>
                        <!--视频资源-->
                    <div  v-else class="video-content">
                        <video  height=83% width=90%  prload controls 
                                class="video-js vjs-fill" style="min-width:200px;max-width:200px; min-height:120px; max-height:120px;object-fit: fill;">
                                <source :src="item.url">
                        </video>
                    </div>
                </div>
            </div>
            <div class="viedo-info">
                <span>{{event.createDate}}</span>
                <div v-if="showCheckVideo">
                    <i class="iconfont icon-bofang icon-video"></i>
                    <span class="ahref" @click="checkVideo">{{curChannel.name+'区域'}}</span>
                </div>
            </div>
            <span class="sub-time"></span> 
            <div class="start-video-content"></div>
            <hr/>
            <div v-if="showWinpBtn">
                <span class="group-title" style="display:block;margin:15px auto;">添加处理信息</span>
                <el-input
                    type="textarea"
                    maxlength='300'
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入处理评论文字"
                    v-model="description">
                </el-input>
                <el-button size="mini" class="el-submit" @click="submit">提交</el-button>
            </div>
            <el-col :span="24" class="deal-content">
                <span class="group-title">问题处理</span>
                <div class="deal-info" :style="{'min-height':windowHeight-658+'px'}">
                    <div v-for="(item,index) in commentList" :key="index" class="deal-detal-content">
                        <div class="circle-content" :style="item.showContent?{'background-color':'#FBC7CC'}:{'background-color':'#FAFAFA'}">
                            <div class="circle"></div>
                        </div>
                        <div class="lside">
                            <span v-if="item.showLabel" :style="item.spanStyle">{{item.process}}</span>
                        </div>
                        <div class="rside">
                            <div class="">
                                <span class="creator">{{item.createOr}}</span>
                                <div class="speech-content deal-speech" v-if="item.showAudio">
                                    <div class="speech-info" @click="startSpeechItem(item,index)">
                                        <i class="iconfont icon-yuyin icon-speech"></i>
                                    </div>
                                    <audio :ref="item.audio.audioRef">
                                        <source :src="item.audio.audioSrc" type="audio/mpeg" />
                                    </audio>
                                    <span class="often-text" v-if="item.audio!=null">{{item.audio.audioOftenText}}</span>
                                </div>
                            </div>
                            <pre v-if="item.description!=null" class="description">{{item.description}}</pre>
                            <div class="source-content" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                                <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                                    <div v-if="_item.mediaType==2" class="img-content">
                                        <img class="imgLittle" :title="imgTitle"
                                          :src="_item.url" height="100px" :onerror='deafultImg'
                                         @click="openOuter(_item,$event)"/>
                                    </div>
                                   <div  v-else class="video-content">
                                        <video  height=83% width=90%  prload controls
                                                class="video-js vjs-fill" style="min-width:200px;max-width:200px;min-height:120px; max-height:120px;object-fit: fill;">
                                                <source :src="_item.url">
                                        </video>
                                    </div>
                                </div>
                            </div>
                            <div class="viedo-info">
                                <span>{{item.createDate}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
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
const isProduction = process.env.NODE_ENV === 'production'
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
            showWinpBtn:true,
            description:'',
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
            showOuter:false,
            bigImgSrc:'',
            checkImgSrc:'',
            imgTitle:'',
            showCheckVideo:false,
            showPhotoContent:false,
            deafultImg:'this.src="' + require('../../../../static/img/pic2.png') + '"',
            sessionId:''
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
            return this.varyWindowHeight/758;
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
                  channel:JSON.stringify(self.curChannel.channelId)
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
                  channel:JSON.stringify(self.curChannel.channelId)
                }
            };
            let ret=await dashAPI.RealTime(0,data);
            await dashAPI.Offline(self.sessionId);
        },
        myfun(){  
            var div1=document.getElementsByClassName("lside");  
            var div2=document.getElementsByClassName("rside");
            debugger;
            for(var i=0;i<div1.length;i++){
                var h1=div1[i].offsetHeight;  
                var h2=div2[i].offsetHeight; 
                if(h1>h2){  
                    div1[i].style.borderRight="1px solid #FB4C5D";  
                }
                else{  
                    div2[i].style.borderLeft="1px solid #FB4C5D";  
                }   
            }
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
                createDate:util.getDateTime(event.ts),
                deviceId:event.deviceId,
                status:event.status
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
                self.timeid=setInterval(()=>{
                    self.getProcess();
                },1000);
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
                    self.description='';
                    self.winpDes='';
                    self.getProcess();
                    if(status==2){
                        self.showWindContent=false;
                    }
                }
                else{
                    self.notify('提交失败！','warning',3000);
                    return false;
                }
            })
        },
        submit(){
            let self=this;
            let status=1;
            let description=self.description;
            if(description.trim().length==0){
                self.notify('评论信息不能为空！','warning',3000);
                return false;
            }
            self.addComment(status,description);
        },
        windUp(){
            let self=this;
            self.showWindContent=true;
        },
        confirmWind(){
            let self=this;
            let status=2;
            let description=self.winpDes;
            if(description.trim().length==0){
                self.notify('评论信息不能为空！','warning',3000);
                return false;
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
        self.myfun();
        self.getProcess();
        // self.$nextTick(function(){
        //     self.timeid=setInterval(()=>{
        //         self.getProcess();
        //     },1000);
        // })
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
    @include point(padding,20);
    @include point(padding-right,30);
    .dialog-content{
        width: 100%;
    }
    .dialog-source-content{
        width: 480px;
        height: 270px;
        padding: 10px 15px 25px 15px;
        margin: auto;
        img{
            height: 100%;
        }
    }
    .title-content{
        text-align: left;
        @include point(margin,10);
        position: relative;
        .event-title{
            @include point(padding-right,20);
            font-size: 18px;
            font-weight: bold;
            color: #424151;
        }
        .event-score{
            display: inline-block;
            background-color: #FCBA3F;
            padding:4px 12px;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            border-radius: 12px;
        }
        .el-submit{
            position: absolute;
            right: 0px;
            width: 90px;
            height: 30px;
            @include point(margin-right,20);
            background-color: #FB4C5D;
            color: #fff;
        }
    }
    .video-dialog-content{
        width:100%;
        height:100%;
        margin: auto;
    }
    #previewVideo{
        margin: 10px;
        @include point(min-width,500);
        @include point(min-height,320);
    }
    .storeInfo-content{
        text-align: left;
        @include point(padding-left,10);
        @include point(padding-top,15);
        color: #424151;
        font-size: 14px;
        strong{
            @include point(margin-right,25);
        }
        span{
            @include point(margin-right,60);
        }
    }
    .eventInfo-content{
        text-align: left;
        @include point(margin-top,15);
        @include point(padding-left,10);
        font-size: 14px;
        .speech-content{
            margin: 20px auto 10px auto;
            .speech-info{
                @include point(width,120);
                @include point(height,30);
                background-color: #FFEDED;
                color: #FB4C5D;
                border: 1px solid #FEC0C7;
                @include point(border-radius,15);
                display: inline-block;
                cursor: pointer;
                .icon-speech{
                    font-size: 22px;
                    @include point(line-height,30);
                    @include point(margin-left,15);
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
                    img{
                        cursor: pointer;
                    }
                }
                .video-content{
                   width: 100%;
                }
            }
        }
        .viedo-info{
            span{
                font-size: 12px;
                color: #94a4b4;
            }
            div{
                @include point(margin-left,20);
                display: inline-block;
                .icon-video{
                    color: #FB4C5D;
                    font-size: 20px;
                }
                .ahref{
                    text-decoration: underline;
                    color: #FB4C5D;
                    cursor: pointer;
                }
            }
            
        }
        hr{
            border: 0.5px solid #e3e9f4;
            margin-top: 15px;
        }
        .el-submit{
            width: 90px;
            background-color: #FB4C5D;
            color: #fff;
            height: 30px;
            @include point(margin-top,10);
            @include point(margin-bottom,20);
        }
        .deal-content{
            margin-top: 15px;
        }
        .deal-info{
            @include point(margin-top,20);
            width: 100%;
            height: auto;
            //min-height: 100px;
            background-color: #FAFAFA;
            border: 1px solid #ddd;
            .deal-detal-content{
                width: 100%;
                overflow: hidden;
                position: relative;
            }
            .circle-content{
                background-color: #FBC7CC;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                position: absolute;
                left: 109px;
                @include point(top,30);
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
                background-color: #FB4C5D;
            }
            .lside{
                width: 119px;
                @include point(height,100);
                position: relative;
                float: left;
                span{
                    display: inline-block;
                    position: relative;
                    @include point(left,30);
                    @include point(top,30);
                    padding: 2px 10px;
                    color: #fff;
                    font-size: 12px;
                }
            }
            .rside{
                width:calc(100% - 120px);
                height: 100%;
                @include point(min-height,100);
                border-left: 1px solid #ddd;
                float: left;
                @include point(padding-top,5);
                .creator{
                    @include point(margin-left,20);
                    float: left;
                    @include point(margin-top,30);
                }
                .deal-speech{
                    display: inline-block;
                    @include point(margin-left,20);
                    .often-text{
                        @include point(margin-left,20);
                        display: inline-block;
                    }
                }
                .description{
                    float: left;
                    max-width: 90%;
                    min-width: 90%;
                    @include point(margin-top,30);
                    @include point(margin-left,20);
                    font-family:'Microsoft YaHei';
                    font-size: 14px;
                    white-space:pre-wrap; /* css3.0 */ 
                    white-space:-moz-pre-wrap; /* Firefox */ 
                    white-space:-pre-wrap; /* Opera 4-6 */ 
                    white-space:-o-pre-wrap; /* Opera 7 */ 
                    word-wrap:break-word; /* Internet Explorer 5.5+ */
                }
                .source-content{
                    @include point(margin-left,52);
                    overflow: hidden;
                    min-width: 90%;
                    @include point(margin-top,15);
                    .source-details{
                        float: left;
                        @include point(margin-left,15);
                        @include point(margin-right,15);
                        @include point(max-width,220);
                    }
                    img{
                        cursor: pointer;
                    }
                }
                .viedo-info{
                    @include point(margin-left,70);
                    @include point(margin-bottom,15);
                    color: #FB4C5D;
                    font-size: 20px;
                    float: left;
                    width: 90%;
                }
            }
        }
    }
}
</style>
<style>
    .tabName-input .el-input__inner{
        border-radius: 0px !important;
        border-left: 0px;
        border-top: 0px;
        border-right: 0px;
        border-bottom: 1px  solid #FB4C5D;
        font-size: 14px;
    }
</style>

<style>
@import '../../../assets/css/importfile.css'; 
.rate-video-dialog .el-dialog__header{ 
    padding-bottom: 0 !important;
    padding-top: 10px !important;
    padding-left: 15px !important; 
}
.rate-video-dialog .el-dialog__body{ 
    padding-bottom: 5px !important; 
}
</style>