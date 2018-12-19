<template>
    <el-row class="el-rate-container">
        <el-col :span="24" class="title-content">
            <span class="event-title level1">{{event.eventTitle}}</span>
            <span class="event-score">得分：{{event.score==null?6:event.score}}分</span>
            <el-button size="mini" class="el-submit" @click="windUp">结案</el-button>
        </el-col>
        <el-col :span="24" class="storeInfo-content noraml-text">
            <strong>门店</strong><span>{{event.storeName}}</span>
            <strong>提报人</strong><span>{{event.createor}}</span>
            <strong>提报时间</strong><span>{{event.createDate}}</span>
        </el-col>
        <el-col :span="24" class="eventInfo-content">
            <strong>事件详情</strong>
            <div class="speech-content">
               <div class="speech-info" @click="startSpeech"> 
                   <i class="icon-speech" :class="speech?'el-icon-phone':'el-icon-phone-outline'"></i>
               </div>
               <audio :ref="audioRef" id="audio"  loop="loop" autoplay="autoplay" >
                    <source :src="audioSrc" type="audio/mpeg" />
                </audio> 
               <span class="often-text">{{audioOften}}</span>
            </div>
            <div class="photo-content">
                <div v-for="(item,index) in sourceList" :key="index" class="source-content">
                    <div v-if="item.type=='1'" class="img-content">
                        <!--图片资源-->
                        <img  :src="item.imgSrc" :alt="item.alt" height="160px"/>
                    </div>
                        <!--视频资源-->
                    <div  v-else class="video-content">
                        <video-player class="video-player vjs-custom-skin " 
                        :ref="item.ref" :options="item.playerOptions" style="width:300px;height:150px;">
                        </video-player>
                    </div>
                </div>
            </div>
            <div class="viedo-info">
                <span>{{event.createDate}}</span>
                <img :src="startSrc" class="startIcon"/>
                <span class="ahref" @click="checkVideo">水吧区域</span>
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
                                    <i class="el-icon-phone-outline icon-speech"></i>
                                </div>
                                <span class="often-text" v-if="item.audio!=null">{{item.audio.audioOften}}</span>
                            </div>
                            <span v-if="item.description!=null">{{item.description}}</span>
                            <div class="source-content" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                                <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                                    <div v-if="_item.type=='1'" class="img-content">
                                        <!--图片资源-->
                                        <img  :src="_item.imgSrc" :alt="_item.alt" height="160px"/>
                                    </div>
                                        <!--视频资源-->
                                    <div  v-else class="video-content">
                                        <video-player class="video-player vjs-custom-skin " 
                                        :ref="_item.ref" :options="_item.playerOptions" style="width:300px;height:150px;">
                                        </video-player>
                                    </div>
                                </div>
                            </div>
                            <div class="viedo-info">
                                <span>{{item.createDate}}</span>
                                <img :src="startSrc" class="startIcon"/>
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
export default {
    name:"RateManage",
    data(){
        return{
            event:{},
            description:'',
            audioOften:6+'"',
            startSrc:"../../../static/img/videostartIcon.png",
            speech:false,
            audioRef:'audioRef',
            isPlaying:false,
            audioSrc:'../../../static/img/aduio_test.mp3',
            sourceList:[
                {
                    type:1,
                    ref:'img0',
                    imgSrc:"../../../static/img/imgTest.jpg",
                    alt:'门店截图'
                },
                {
                    type:2,
                    ref:'video0',
                    playerOptions: {
                        controls: true,
                        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                        autoplay: false, //如果true,浏览器准备好时开始回放。
                        // muted: false, // 默认情况下将会消除任何音频。
                        loop: false, // 导致视频一结束就重新开始。
                        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                        language: 'zh-CN',
                        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                        sources: [{
                        type: "video/mp4",
                        src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                        }]
                    }
                },
                
            ],
            commentList:[
                {
                    showContent:true,
                    showLabel:true,
                    spanStyle:{'background-color':'#6097F4'},
                    status:2,
                    process:'已结案',
                    createOr:'李刚',
                    createDate:'2018年11月 11:10',
                    audio:{
                        audioOften:6+'"',
                    },
                    sourceList:[
                        {
                            type:'1',
                            imgSrc:'../../../static/img/imgTest.jpg',
                            alt:'门店截图'
                        },
                        {
                            type:'2',
                            ref:'video0',
                            playerOptions: {
                                controls: true,
                                // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                                autoplay: false, //如果true,浏览器准备好时开始回放。
                                // muted: false, // 默认情况下将会消除任何音频。
                                loop: false, // 导致视频一结束就重新开始。
                                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                                language: 'zh-CN',
                                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                                sources: [{
                                type: "video/mp4",
                                src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                                }]
                            }
                        }
                    ]

                },
                {
                    showContent:false,
                    showLabel:true,
                    spanStyle:{'background-color':'#434B5E'},
                    status:1,
                    process:'已处理',
                    createOr:'李刚',
                    createDate:'2018年11月 11:10',
                    audio:{
                        audioOften:6+'"',
                    },
                    sourceList:[
                        {
                            type:'1',
                            imgSrc:'../../../static/img/imgTest.jpg',
                            alt:'门店截图'
                        },
                        {
                            type:'2',
                            ref:'video0',
                            playerOptions: {
                                controls: true,
                                // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                                autoplay: false, //如果true,浏览器准备好时开始回放。
                                // muted: false, // 默认情况下将会消除任何音频。
                                loop: false, // 导致视频一结束就重新开始。
                                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                                language: 'zh-CN',
                                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                                sources: [{
                                type: "video/mp4",
                                src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                                }]
                            }
                        }
                    ]

                },
                {
                    showContent:false,
                    status:0,
                    process:'待处理',
                    showLabel:false,
                    description:'水吧部分已经处理',
                    spanStyle:{'background-color':'#FCB83B'},
                    process:'',
                    createOr:'李刚',
                    createDate:'2018年11月 11:10',
                }
            ]
        }
    },
    methods:{
        myfun(){  
            var div1=document.getElementsByClassName("lside");  
            var div2=document.getElementsByClassName("rside");
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
                storeName: event.storeId,
                createor:event.assigner,
                createDate:util.getDateTime(event.ts),
                deviceId:event.deviceId,
                status:event.status
            }
            self.event=obj;
            console.log(self.event);
        },
        startSpeech(){
            let self=this;
            //self.audioOften=self.$refs.audioRef.duration;
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

        },
        getCommentList(){
            let self=this;
            let eventIds=[];
            eventIds.push(self.event.id);
            let params={
                "eventIds":eventIds
            };
            api.getCommentList(params).then(res=>{
                let errMsg=res.data.errMsg;
                let data=res.data.data;
                if(errMsg=='Success'){
                    let comments=data[0];
                    console.log(comments);
                    let dataComments=comments.comment;
                    let temp=[];
                    dataComments.forEach((item,index)=>{
                        let obj={};
                        obj.createOr=item.account;
                        obj.createDate=util.getDateTime(item.ts);
                        obj.status=item.status;
                        obj.description=item.description;
                        switch(item.status){
                            case 0: obj.showLabel=false;obj.spanStyle={'background-color':'#FCB83B'};
                                obj.process='待处理'; break;
                            case 1: obj.showLabel=true;obj.spanStyle={'background-color':'#434B5E'};
                                obj.process='已处理'; break;
                            case 2: obj.showLabel=true;obj.spanStyle={'background-color':'#6097F4'};
                                obj.process='已完结'; break;
                        }
                        if(index==0){
                            obj.showContent=true;
                        }
                        else{
                            obj.showContent=false;
                        }
                        if(item.attachment.length!=0){
                            item.attachment.forEach((_item,_index)=>{
                                // if(_item.mediaType)
                            })
                        }
                        temp.push(obj);

                    })
                   //self.commentList=temp;
                    
                }
            })
        },
        addComment(){
            let self=this;
            let eventIds=[];
            eventIds.push(self.event.id);
            let comments={
                ts:new Date().getTime(),
                description:self.description,
                account:self.event.createor,
                status:1
            };
            let params={
                eventIds:eventIds,
                comment:comments
            };
            api.addComment(params).then(res=>{
                console.log(res);
                let errMsg=res.data.errMsg;
                if(errMsg=='Success'){
                    self.notify('提交成功！','success',3000);
                }
                else{
                    self.notify('提交失败！','warning',3000);
                    return false;
                }
            })
        },
        submit(){
            let self=this;
            self.addComment();
        },
        windUp(){

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
       // self.createBeforeunloadHandler();
    },
    update(){ 
        this.$route.matched[1].name=this.eventInfo.eventType;
    }, 
    beforeDestroy(){
        this.$route.matched[1].name=this.eventInfo.eventType;
        //this.destroyedBeforeunloadHandler();
    } 
}
</script>
<style lang="scss" scoped>
@import '../../../assets/css/textstyle.css';
.el-rate-container{
    padding: 20px;
    padding-right: 30px;
    .title-content{
        text-align: left;
        margin: 10px;
        position: relative;
        .event-title{
            margin-right: 20px;
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
            margin-right: 20px;
            width: 90px;
            background-color: #FB505F;
            color: #fff;
        }
    }
    .storeInfo-content{
        text-align: left;
        padding-left: 10px;
        margin-top: 15px;
        strong{
            margin-right: 25px;
        }
        span{
            margin-right: 60px;
        }
    }
    .eventInfo-content{
        text-align: left;
        margin-top: 15px;
        padding-left: 10px;
        font-size: 14px;
        .speech-content{
            margin: 20px auto;
            .speech-info{
                width: 120px;
                height: 30px;
                background-color: #FFEDED;
                color: #FB505F;
                border: 1px solid #FEC0C7;
                border-radius: 15px;
                display: inline-block;
                cursor: pointer;
                .icon-speech{
                    font-size: 22px;
                    line-height: 30px;
                    margin-left: 15px;
                }
            }
            .often-text{
                margin-left: 20px;
            }
        }
        .photo-content{
            overflow: hidden;
            margin-bottom: 15px;
            .source-content{
                float: left;
                margin: 5px;
            }
        }
        .viedo-info{
            span{
                font-size: 14px;
                color: #94a4b4;
            }
            .startIcon{
                margin-left: 20px;
                position: relative;
                top: 5px;
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
            width: 90px;
            background-color: #FB505F;
            color: #fff;
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .deal-info{
            margin-top: 20px;
            width: 100%;
            height: auto;
            min-height: 300px;
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
                left: 110px;
                top: 30px;
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
                background-color: #FB505F;
            }
            .lside{
                height: 100px;
                width: 120px;
                position: relative;
                float: left;
                // border-right: 1px solid #FB505F;
                span{
                    display: inline-block;
                    position: relative;
                    left: 20px;
                    top: 30px;
                    // background-color: #FB505F;
                    padding: 2px 10px;
                    color: #fff;
                }
            }
            .rside{
                width: auto;
                height: 100%;
                float: left;
                padding-top: 5px;
                .creator{
                    margin-left: 20px;
                }
                .deal-speech{
                    display: inline-block;
                    margin-left: 20px;
                }
                .source-content{
                    margin-left: 40px;
                    overflow: hidden;
                    .source-details{
                        float: left;
                        margin: 5px;
                    }
                }
                .viedo-info{
                    margin-left: 40px;
                }
            }
        }
    }
}
</style>

