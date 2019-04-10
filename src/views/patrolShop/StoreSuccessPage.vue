<template>
    <div class="el-sucPage-content">
        <div class="page-icon">
            <div class="icon-content">
                <img class='suc-icon' :src='isSuccess?sucSrc:errSrc'/>
                <p :class="isSuccess?'sucInfo':'errInfo'">{{retInfo}}</p>
                <p class="sucret-info" v-if="isSuccess">{{curSecond}}秒自动返回门店监控页面！</p>
            </div>
        </div>
        <el-dialog  title='查看' :visible.sync="dialogCommentVideo" :close-on-click-modal="false" 
            v-if="dialogCommentVideo" :width="720*percentHeight+'px'" height=300px top=5% @close='stopCommentVideo'>
            <div class="canvas-content">
                <hr class="dialog-hr"/>
                <video  :width="667*percentHeight" :height="431*percentHeight" id="previewCutVideo" prload controls :src="curVideoSrc">
                </video>
            </div>
        </el-dialog>
        <div class="page-content" v-if="isSuccess" :style="{'min-height':varyWindowHeight-460+'px'}">
            <div class="details">
                <span class="event-label">门店名称：</span>
                <span>{{storeName}}</span>
            </div>
            <div class="details">
                <span class="event-label">问题名称：</span>
                <span>{{eventName}}</span>
            </div>
            <div class="details">
                <span class="event-label">问题状态：</span>
                <span class="icon-span">未处理</span>
            </div>
            <div class="details">
                <span class="event-label">问题描述：</span>
                <div v-for="(item,index) in commentList" :key="index" class="comment-details">
                    <div class="circle-content" :style="item.showContent?{'background-color':'#FBC7CC'}:{'background-color':'#FAFAFA'}">
                        <div class="circle"></div>
                    </div>
                    <div class="lside">

                    </div>
                    <div class="rside">
                        <span class="event-name">
                            {{item.eventDes}}
                        </span>
                        <div class="source-content">
                            <div class="source-details" v-for="(_item,_index) in sourceList" :key="_index">
                                <div class="img-content" v-if="_item.mediaType==2">
                                    <img :src="_item.url"  height="100" width="140"/>
                                </div>
                                <div class="img-content" v-if="_item.mediaType==1">
                                    <img class="start-icon" :src="startIcon" :height="36" @click="playCutVideo(_item,_index)"/>
                                    <img :src="videoImgSrc" height="100"/>
                                </div>
                            </div>
                        </div>
                        <span class="event-ts">{{item.ts}}</span>
                    </div>
                </div>
            </div>
             <div class="details" v-if="showLeader">
                <span class="event-label" style="margin-right:30px;">抄送：</span>
                <span>{{leader}}</span>
            </div>
        </div>
        <div class="page-err-btn" v-else>
            <el-button size="mini" type="primary" @click="reTry" class="retry-btn">重新尝试</el-button>
        </div>
    </div>
</template>
<script>
import {addEvent,addComment} from '@/api/event'
import PubSub from 'pubsub-js';
export default {
    name:'StoreSuccessPage',
    data(){
        return{
            isSuccess:false,
            sucSrc:require('../../../static/img/succeed_icon.png'),
            errSrc:require('../../../static/img/failed_icon.png'),
            sucInfo:'问题提交成功！',
            errInfo:'提交失败！',
            curSecond:10,
            storeName:'西安6店',
            eventName:'水吧问题2',
            leader:'小明',
            showLeader:true,
            commentList:[],
            sourceList:[],
            routeData:null,
            timeid:0,
            varyWindowHeight:window.innerHeight,
            startIcon:require('../../../static/img/pic_play_icon.png'),    
            videoImgSrc:require('../../../static/img/image_videoThumbnail.png'),  
            dialogCommentVideo:false,
            curVideoSrc:''
        }
    },
    computed:{
        retInfo:function(){
            if(this.isSuccess){
                return this.sucInfo;
            }
            else{
                return this.errInfo;
            }
        },
        percentHeight:function(){
            return this.varyWindowHeight/758;
        },
    },
    methods:{
        getRouterData(){
            let self=this;
            let routeData=self.$route.params.data;
            console.log(routeData);
            if(self.$route.params.data==undefined){
                routeData=JSON.parse(sessionStorage.getItem('store_submit'));
            }
            self.routeData=routeData;
            self.isSuccess=routeData.flag.isSuccess;
            //self.isSuccess=false;
            if(self.isSuccess==false){
                PubSub.publish('success-page',{changeStyle:true});
            }
            self.storeName=routeData.store.storeName;
            self.eventName=routeData.event.eventName;
            self.sourceList=routeData.event.fileList;
            if(routeData.flag.addEventType=='add'){
                self.showLeader=true;
                self.leader=routeData.user.length!=0?routeData.user[0].userName:'';
            }
            else{
                self.showLeader=false;
            }
            if(self.isSuccess){
                self.$route.matched[2].name='提交成功';
            }
            else{
                self.$route.matched[2].name='提交失败';
            }
        },
        getBackSecond(){
            let self=this;
            self.curSecond--;
            if(self.curSecond==0){
                clearInterval(self.timeid);
                self.$router.push({name:'门店监控',params:{flag:self.isSuccess}});
            }
        },
        playCutVideo(item,index){
            let self=this;
            self.dialogCommentVideo=true;
            self.curVideoSrc=item.url;
        },
        getCommentList(){
            let self=this;
            let temp=[];
            let obj={
                showContent:true,
                eventDes:self.routeData.event.description,
                ts:self.routeData.curTs
            };
            temp.push(obj);
            self.commentList=temp;

        },
        reTry(){
            let self=this;
            self.$router.push({name:"门店监控",params:{flag:self.isSuccess}});
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
    created(){
        let self=this;
    },
    mounted(){
        let self=this;
        self.isSuccess=false;
        self.getRouterData();
        self.getCommentList();
        if(self.isSuccess){
            self.timeid=setInterval(function(){
                self.getBackSecond();
            },1000)
        }
    },
    beforeRouteLeave(to, from, next) {
        let self=this;
        clearInterval(self.timeid);
        if(to.name=='门店监控'){
            if(this.isSuccess==true){
                to.meta.keepAlive = true;
            }
            else{
                to.meta.keepAlive=true;
            }
        }
        next();
    }
}
</script>
<style lang="scss" scoped>
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
    .el-sucPage-content{
        width: 100%;
        height: 100%;
        .canvas-content{
            position: relative;
            #previewCutVideo{
                @include point(margin-bottom,20);
                @include point(margin-top,15);
            }
            .dialog-hr{
                border: 0.5px solid ;
                border-color: rgba(251,76,93,0.3);
                margin-bottom:10px;
                position: relative;
                bottom: 5px;
                margin-top: 0;
            }
        }
        .page-icon{
            margin-bottom: 40px;
            position: relative;
            .icon-content{
                margin:0 auto;
                margin-top: 50px;
                .suc-icon{
                    height: 80px;
                }
                .sucInfo{
                    font-size: 14px;
                    color: #6097F3;
                }
                .errInfo{
                    font-size: 14px;
                    color: #ddd;
                }
                .sucret-info{
                    font-size: 12px;
                    color: #FB4C5D;
                }
            }
        }
        .page-content{
            margin: 20px;
            background-color: #fafafb;
            width: auto;
            //min-height: 300px;
            height: auto;
            padding-left: 20px;
            padding-top: 20px;
            padding-bottom: 20px;
            border: 0.5px solid #e3e9f4;
            .details{
                text-align: left;
                margin-top: 20px;
                margin-left: 20px;
                color: #424151;
                font-size: 14px;
                .event-label{
                    font-weight: bold;
                    margin-right: 10px;
                }
                .icon-span{
                    display:inline-block;
                    width:68px;
                    height:22px;
                    line-height: 22px;
                    color:white;
                    font-size: 12px;
                    background-color: #FEA316;
                    text-align: center;

                }
                .comment-details{
                    width: 100%;
                    min-height: 150px;
                    position: relative;
                    overflow: hidden;
                    .circle-content{
                        background-color: #FBC7CC;
                        border-radius: 50%;
                        width: 22px;
                        height: 22px;
                        position: absolute;
                        left: 89px;
                        top: 0px;
                        z-index: 1;
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
                        width: 99px;
                        float: left;
                        min-height: 150px;
                    }
                    .rside{
                        width:calc(100% - 100px);
                        border-left: 1px solid #ddd;
                        float: left;
                        position: relative;
                        bottom: 10px;
                        .event-name{
                            margin-left: 30px;
                            margin-top: 10px;
                            display: block;
                        }
                        .source-content{
                            min-height: 150px;
                            width: auto;
                            margin: auto 20px;
                            .source-details{
                                display: inline-block;
                                margin-right: 15px;
                                padding-top: 15px;
                                .img-content{
                                    width: 100%;
                                    height: 100%;
                                    position: relative;
                                    .start-icon{
                                        position: absolute;
                                        left: 35%;
                                        top: 30%;
                                        cursor: pointer;
                                    }
                                }
                            }
                        }
                        .event-ts{
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .page-err-btn{
            .retry-btn{
                margin-top: 30px;
            }
        }
    }
</style>
<style>
@import '../../assets/css/importfile.css'; 
</style>
