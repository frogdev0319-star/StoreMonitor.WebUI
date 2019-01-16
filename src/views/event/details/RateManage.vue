<template>
    <el-row class="el-rate-container">
        <el-col :span="24" class="title-content">
            <span class="event-title">{{event.eventTitle}}</span>
            <span class="event-score">得分：{{event.score==null?'---':event.score}}分</span>
            <el-button size="mini" class="el-submit" @click="windUp" v-if="showWinpBtn">结案</el-button>
        </el-col>
        <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" v-if="dialogFormVisible" width=550px height=380px top=15%>
                <div class="video-dialog-content" style="overflow:hidden;">
                    <video  height=83% width=90% id="previewVideo" prload autoplay controls
                        class="video-js vjs-fill" style="postion:absoulte;top:10px;">
                    </video>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button class="file-cancel-btn" @click="dialogFormVisible = false" size="mini" style="">暂 停</el-button>
                    <el-button class="file-confirm-btn" type="primary" @click="realTime" size="mini">播 放</el-button>
                </div>
            </el-dialog>
        <el-dialog title='结案'
        :visible.sync="showWindContent" v-if="showWindContent"
        :append-to-body='true'
        :close-on-click-modal="false"
        width="28%"
        top="35vh"
        left="40vh">
            <div class="dialog-content" style="overflow:hidden;">
                <hr style="border: 0.5px solid #FFC1C8;"/>
                
               <div class="tabName-input-content">
                    <el-input type="text" size="small" v-model="winpDes" class="tabName-input" style=""  
                    placeholder="请输入结案评论"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showWindContent = false" size="mini" style="">取 消</el-button>
                <el-button class="file-confirm-btn" @click="confirmWind" size="mini" style="color:#fff">确 认</el-button>
            </div>
        </el-dialog>
        <el-col :span="24" class="storeInfo-content">
            <strong>门店</strong><span>{{event.storeName}}</span>
            <strong>提报人</strong><span>{{event.createor}}</span>
            <strong>提报时间</strong><span>{{event.createDate}}</span>
        </el-col>
        <el-col :span="24" class="eventInfo-content" :style="{'min-height':divHeight+'px'}">
            <strong>事件详情</strong>
            <div class="speech-content" v-if="false">
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
                    <div v-if="item.type=='0'" class="img-content">
                        <!--图片资源-->
                        <img  :src="item.imgSrc" :alt="item.alt" height="156px"/>
                    </div>
                        <!--视频资源-->
                    <div  v-else class="video-content">
                        <video-player class="video-player vjs-custom-skin " 
                            :ref="item.ref" :options="item.playerOptions" 
                            style="width:280px;height:140px;"
                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)">
                        </video-player>
                    </div>
                </div>
            </div>
            <div class="viedo-info">
                <span>{{event.createDate}}</span>
                <i class="iconfont icon-bofang icon-video"></i>
                <span class="ahref" @click="checkVideo">{{curChannel}}</span>
            </div>
            <span class="sub-time"></span> 
            <div class="start-video-content"></div>
            <hr/>
            <span class="group-title" style="display:block;margin:15px auto;">添加处理信息</span>
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入处理评论文字"
                v-model="description">
            </el-input>
            <el-button size="mini" class="el-submit" @click="submit">提交</el-button>
            <el-col :span="24" class="deal-content">
                <span class="group-title">问题处理</span>
                <div class="deal-info">
                    <div v-for="(item,index) in commentList" :key="index" class="deal-detal-content">
                        <div class="circle-content" :style="item.showContent?{'background-color':'#FBC7CC'}:{'background-color':'#FAFAFA'}">
                            <div class="circle"></div>
                        </div>
                        <div class="lside">
                            <span v-if="item.showLabel" :style="item.spanStyle">{{item.process}}</span>
                        </div>
                        <div class="rside">
                            <span class="creator">{{item.createOr}}</span>
                            <div class="speech-content deal-speech">
                                <div class="speech-info" v-if="item.audio!=null">
                                    <i class="iconfont icon-yuyin icon-speech"></i>
                                </div>
                                <span class="often-text" v-if="item.audio!=null">{{item.audio.audioOften}}</span>
                            </div>
                            <span v-if="item.description!=null">{{item.description}}</span>
                            <div class="source-content" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                                <!-- <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                                    <div v-if="_item.type=='0'" class="img-content">
                                        <img  :src="_item.imgSrc" :alt="_item.alt" height="160px"/>
                                    </div>
                                    <div  v-else class="video-content">
                                        <video-player class="video-player vjs-custom-skin " 
                                        :ref="_item.ref" :options="_item.playerOptions" style="width:300px;height:150px;">
                                        </video-player>
                                    </div>
                                </div> -->
                            </div>
                            <div class="viedo-info">
                                <span>{{item.createDate}}</span>
                                <i class="iconfont icon-bofang icon-video"></i>
                                <span class="ahref" @click="checkVideo">水吧区域</span>
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
const isProduction = process.env.NODE_ENV === 'production'
export default {
    name:"RateManage",
    data(){
        return{
            event:{},
            showWindContent:false,
            dialogFormVisible:false,
            showWinpBtn:true,
            description:'',
            audioOften:0,
            speech:false,
            audioRef:'audioRef',
            isPlaying:false,
            audioSrc:'./static/img/aduio_test.mp3',
            videoSrc:"",
            curChannel:"水吧区域",
            sourceList:[
                // {
                //     type:1,
                //     ref:'img0',
                //     imgSrc:"./static/img/imgTest.jpg",
                //     alt:'门店截图'
                // },
                // {
                //     type:2,
                //     ref:'video0',
                //     playerOptions: {
                //         controls: true,
                //         // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                //         autoplay: false, //如果true,浏览器准备好时开始回放。
                //         // muted: false, // 默认情况下将会消除任何音频。
                //         loop: false, // 导致视频一结束就重新开始。
                //         preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                //         language: 'zh-CN',
                //         aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                //         fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                //         notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                //         sources: [{
                //         type: "video/mp4",
                //         src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                //         }]
                //     }
                //},
                
            ],
            commentList:[],
            protocal:'DASH',
            selGID:0,
            mpdurl:'',
            playerOptions: {
                overNative: true,
                autoplay: false,
                controls: true,
                techOrder: ['flash', 'html5'],
                sourceOrder: true,
                flash: {
                hls: { withCredentials: false },
                swf: isProduction ? '/vue-videojs-demo/static/media/video-js.swf' : '/static/media/video-js.swf'
                },
                html5: { hls: { withCredentials: false } },
                sources: [
                {
                    type: 'rtmp/mp4',
                    src: 'rtmp://184.72.239.149/vod/&mp4:BigBuckBunny_115k.mov'
                },
                {
                    withCredentials: false,
                    type: 'application/x-mpegURL',
                    src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8'
                }
                ],
                poster: isProduction ? '/vue-videojs-demo/static/images/logo.png' : '/static/images/logo.png'
            },
            initialized: false,
            previewplayer:'',
            winpDes:'',
            timeid:0,
            windowHeight:window.innerHeight
        }
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        },
        currentStream() {
            return this.currentTech === 'Flash' ? 'RTMP' : 'HLS'
        },
        audioOftenText(){
            return this.audioOften+'"';
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
        async realTime(){
            let self=this;
            console.log('实时播放');
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
        myfun(){  
            var div1=document.getElementsByClassName("lside");  
            var div2=document.getElementsByClassName("rside");
            debugger;
            for(var i=0;i<div1.length;i++){
                var h1=div1[i].offsetHeight;  
                var h2=div2[i].offsetHeight; 
                if(h1>h2){  
                    div1[i].style.borderRight="1px solid #FB505F";  
                }
                else{  
                    div2[i].style.borderLeft="1px solid #FB505F";  
                }   
            }  
            
                
        },
        getSessionData(){
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
            }
            self.event=obj;
            console.log(self.event);
        },
        getProcess(){
            let self=this;
            //self.audioOften=parseInt(self.$refs.audioRef.duration-self.$refs.audioRef.currentTime);
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
            }
        },
        checkVideo(){
            this.dialogFormVisible=true;
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
                            case 0: obj.showLabel=false;obj.spanStyle={'background-color':'#FCB83B'};
                                obj.process='待处理'; break;
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
                            //obj.audio.audioOften=self.audioOften;
                            //obj.sourceList=self.sourceList; 
                            let _temp=[];
                            item.attachment.forEach((item,index)=>{
                                let _obj={};
                                switch(item.mediaType){
                                    case 0:
                                        // _obj.type=0;
                                        // _obj.ref='img'+index;
                                        // _obj.imgSrc=item.url;
                                        // _obj.alt='截图'+index;
                                        break;
                                    case 1:
                                        //_obj.type=2;
                                       // _obj.ref='video'+index;
                                        // _obj.playerOptions={
                                        //     controls: true,
                                        //     autoplay: false, //如果true,浏览器准备好时开始回放。
                                        //     loop: false, // 导致视频一结束就重新开始。
                                        //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                                        //     language: 'zh-CN',
                                        //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                        //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                        //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                                        //     sources: [{
                                        //         type: "video/mp4",
                                        //         src: item.url
                                        //     }]
                                        // }
                                        break;
                                    case 2:
                                        //_obj.type=2;
                                        //_obj.ref='video'+index;
                                        // _obj.playerOptions={
                                        //     controls: true,
                                        //     autoplay: false, //如果true,浏览器准备好时开始回放。
                                        //     loop: false, // 导致视频一结束就重新开始。
                                        //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                                        //     language: 'zh-CN',
                                        //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                        //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                        //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                                        //     sources: [{
                                        //         type: "video/mp4",
                                        //         src: item.url
                                        //     }]
                                        //}
                                        break;
                                }
                                _temp.push(_obj);
                            })
                            obj.sourceList=_temp;
                        }
                        temp.push(obj);

                    })
                   self.commentList=temp;
                   //self.sourceList=self.commentList[0].sourceList;
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
        self.timeid=setInterval(function(){
            self.getProcess()
        },1000);
        //self.realTime();
    },
    update(){ 

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
.el-rate-container{
    @include point(padding,20);
    @include point(padding-right,30);
    .title-content{
        text-align: left;
        @include point(margin,10);
        position: relative;
        .event-title{
            @include point(padding-right,20);
            @include point(font-size,18);
            font-weight: bold;
            color: #424151;
        }
        .event-score{
            display: inline-block;
            background-color: #FCBA3F;
            padding:4px 12px;
            color: #fff;
            @include point(font-size,14);
            font-weight: bold;
            border-radius: 12px;
        }
        .el-submit{
            position: absolute;
            right: 0px;
            @include point(margin-right,20);
            @include point(width,90);
            background-color: #FB505F;
            color: #fff;
        }
    }
    .video-dialog-content{
        width:98%;
        height:98%;
        margin: auto;
    }
    #previewVideo{
        @include point(min-width,500);
        @include point(min-height,320);
    }
    .storeInfo-content{
        text-align: left;
        @include point(padding-left,10);
        @include point(padding-top,15);
        color: #424151;
        @include point(font-size,14);
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
        @include point(font-size,14);
        .speech-content{
            margin: 20px auto;
            .speech-info{
                @include point(width,120);
                @include point(height,30);
                background-color: #FFEDED;
                color: #FB505F;
                border: 1px solid #FEC0C7;
                @include point(border-radius,15);
                display: inline-block;
                cursor: pointer;
                .icon-speech{
                    @include point(font-size,22);
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
            @include point(margin-bottom,15);
            .source-content{
                float: left;
                @include point(margin,5);
            }
        }
        .viedo-info{
            span{
                @include point(font-size,14);
                color: #94a4b4;
            }
            .icon-video{
                @include point(margin-left,20);
                color: #FB505F;
                @include point(font-size,20);
            }
            .ahref{
                text-decoration: underline;
                color: #FB505F;
                cursor: pointer;
            }
        }
        hr{
            border: 1px solid #ddd;
        }
        .el-submit{
            @include point(width,90);
            background-color: #FB505F;
            color: #fff;
            @include point(margin-top,10);
            @include point(margin-bottom,20);
        }
        .deal-info{
            @include point(margin-top,20);
            width: 100%;
            height: auto;
            min-height: 100px;
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
                @include point(width,22);
                @include point(height,22);
                position: absolute;
                @include point(left,110);
                @include point(top,30);
            }
            .circle{
                width: 14px;
                height: 14px;
                border-radius: 50%;
                -moz-border-radius: 50%;      
                -webkit-border-radius: 50%;
                position: relative;
                @include point(top,4);
                @include point(left,4);
                background-color: #FB505F;
            }
            .lside{
                @include point(width,120);
                @include point(height,100);
                position: relative;
                float: left;
                span{
                    display: inline-block;
                    position: relative;
                    @include point(left,20);
                    @include point(top,30);
                    padding: 2px 10px;
                    color: #fff;
                }
            }
            .rside{
                width: auto;
                height: 100%;
                @include point(min-height,100);
                border-left: 1px solid #FB505F;
                float: left;
                @include point(padding-top,5);
                .creator{
                    @include point(margin-left,20);
                }
                .deal-speech{
                    display: inline-block;
                    @include point(margin-left,20);
                }
                .source-content{
                    @include point(margin-left,40);
                    overflow: hidden;
                    .source-details{
                        float: left;
                        @include point(margin,5);
                    }
                }
                .viedo-info{
                    @include point(margin-left,20);
                    color: #FB505F;
                    @include point(font-size,20);
                    margin-top: 8px;
                    @include point(margin-top,8);
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
        border-bottom: 1px  solid #FB505F;
        font-size: 14px;
    }
</style>

<style>
.el-dialog__title{
    font-size: 16px !important;
}
.el-dialog__body{
    padding: 0 0 !important;
}
</style>