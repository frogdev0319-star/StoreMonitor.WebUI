<template>
    <div class="content">
        <div class="head">{{$t('statistics.event.eventCommand')}}</div>
        <div class="comment-list" v-for="(item,index) in CommentList" :key="index">
            <div class="comment">
                <div class="account">
                    <div>
                        <span>{{item.title+' '}}</span>
                        <span>{{item.name+' '}}</span>
                        <span>{{'('+item.date+')'}}</span>
                    </div>
                    <div class="tag">{{item.sourceType}}</div>
                </div>
                <div v-for="(att,index) in item.attachment" :key="index" style="margin-top:10px;">
                    <div class="att-content" v-if="att.mediaType==3">
                        <div style="width:45%;">{{att.url}}</div>
                    </div>
                </div>
                <div v-if="item.showAudio" class="att-content">
                        <audio-vue
                            :is-export-pdf="isexportPDF"
                            :audio-list = "item.audioList"
                        />
               </div>
            </div>
            <div class="attachment" :style="isexportPDF?{width:'200px'}:{}"> 
                <div  v-for="(att,index) in item.attachment" :key="index">
                    <img v-if="att.mediaType==2" class="att-img" :src="att.url" />
                    <div v-else-if="att.mediaType==1" class="att-content">
                        <div class="img-content " @click="playCommentVideo(att,index)">
                            <img :src="startIcon" :height="91*0.4+'px'" class="start-icon">
                            <img :src="videoImgSrc" :height="imgHeight+'px'" class="att-img">
                        </div>
                        <!--<video controls>
                            <source :src="att.url" type="video/mp4">
                        </video>-->
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            v-if="dialogCommentVideo"
            :title="$t('eventView.view')"
            :visible.sync="dialogCommentVideo"
            :close-on-click-modal="false"
            width="850px"
            height="834px"
            top="12%"
            class="rate-video-dialog"
            @close="stopCommentVideo">
        <div slot="title" class="dialog-title">{{$t('eventView.view')}}</div>
        <div class="video-dialog-content" style="overflow:hidden;">
          <hr class="dialog-hr">
          <div class="video-content" >
            <video
              id="previewVideo"
              height="83%"
              width="90%"
              prload
              controls
              class="video-js vjs-fill"/>
          </div>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import {GetEventAndCommentList} from '@/api/event';
import TablePagination from '@/components/TablePagination';
import util from '@/common/util';
import AudioVue from '@/components/AudioVue';
import videojs from '../../static/video.js';

export default {
    name:'IncepItemTop5',
    components: {
        'table-pagination':TablePagination,
        AudioVue
    },
    props:{
        storeId:{
            type: String,
            required: true
        },
        beginTs:{
            type: Number,
            required:true
        },
        endTs:{
            type:Number,
            required: true
        },
        itemId:{
            type:Number,
            require:true
        },
        isexportPDF: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return{
            clause:{storeId:this.storeId,itemId:this.itemId},
            CommentList:[],
            startIcon: require('../../static/img/play_icon.png'),
            videoImgSrc: require('../../static/img/video_thumbnail.png'),
            dialogCommentVideo:false
        };
    },
    created(){
        this.getCommentList();
    },
    methods:{
        doGetEventAndCommentList(params) { 
            return new Promise((resolve, reject) => {
                GetEventAndCommentList(params).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        async getCommentList(){
            let params={beginTs:this.beginTs,endTs:this.endTs,clause:this.clause};
            const result = await this.doGetEventAndCommentList(params);
            //console.log("result:",result);
            const commentData = result.data.content;
            //console.log("eventData:",this.eventData);
            this.CommentList = [];
            commentData.forEach((detail)=>{
                var source = this.doMapSourceType(detail.sourceType);
                detail.comment.forEach(item=>{
                    let obj = {};
                    obj.title = item.accountTitle;
                    obj.name = item.accountName;
                    obj.date = this.$moment(item.ts).format("YYYY/MM/DD");
                    obj.sourceType = source 
                    let attachment = [];
                    let audioList = [];
                    item.attachment.forEach(att=>{
                        let attObj = {...att}
                        if(att.mediaType==0){
                            let audio = {}
                            audio .audioSrc = att.url;
                            audio .audioRef = 'audioRef' + detail.id + att.ts;
                            audio .isPlaying = false;
                            audio .audioOftenText = '';
                            audio .hasNotPlayAudio = true;
                            audioList.push(audio);
                            obj.showAudio = true;
                            
                        }else{
                            attObj.showAudio = false;
                        }
                        attachment.push(attObj);
                    });
                    console.log("attachment:",attachment);
                    obj.attachment=attachment;
                    obj.audioList = audioList;
                    this.CommentList.push(obj);
                });
            });
            util.sortArrayByKeyDesc(eventItem,"num");
        },
        doMapSourceType(type){
            if(type==0){
                return this.$t('overview.storeMonitor');
            }else if(type==1){
                return this.$t('overview.remotePatrol');
            }else if(type==2){
                return this.$t('overview.onsitePatrol');
            }
        },
        playCommentVideo(item, index) {
            const self = this;
            console.log("item:",item);
            self.dialogCommentVideo = true;
            self.$nextTick(function() {
                var video = document.getElementById('previewVideo');
                this.previewplayer = videojs(video);
                this.previewplayer.src({ src: item.url });
                this.previewplayer.play();
            });
        },
    },
}
</script>
<style lang="scss" scoped>
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
.content{
    background-color: #EFF3F5;
    margin-right: 16px;
    .head{
        width: calc(125/1440*100vw);
        height: 28px;
        font-family: NotoSansCJKTC;
        font-size: 13px;
        font-weight: bold;
        text-align: left;
        color: #556679;
    }
    .comment-list{
        border-top: solid 1px #dadada;
        height: auto;
        width: calc(968/1440*100vw);
        display: flex;
        flex-direction: row;
        .comment{
            width: 41%;//calc(400/1440*100vw);
            margin-top: 16px;
            margin-bottom: 16px;
            .account{
                width: 100%;//calc(400/1440*100vw);
                height: 30px;
                display: flex;
                flex-direction: row;
                font-family: Roboto;
                font-size: 13px;
                font-weight: bold;
                color: #556679;
                align-items: center;
                .tag{
                    height: 30px;
                    border-radius: 5px;
                    background-color:#f7f9fa;
                    padding: 5px 11px 7px;
                    margin-left: 8px;
                }
            }
            .att-content{
                width: 100%;//calc(400/1440*100vw);
                font-family: NotoSansCJKtc;
                font-size: 15px;
                color:#484848;
                word-break:break-all;
            }
        }
        .img-content{
                position: relative;
                cursor: pointer;
                .start-icon{
                    position: absolute;
                    left: 35%;
                    top: 30%;
                }
              .imgLittle{
                width: 104px;
                border-radius: 5px;
              }
            }
        .attachment{
            margin-top: 16px;
            width: 59%;//calc(568/1440*100vw);
            display: flex;
            flex-direction: row;
            margin-top: 21px;
            align-items: flex-start;
            flex-wrap: wrap;
            align-content: flex-start;
            .att-img{
                width: 132px;
                height: 91px;
                border-radius: 5px;
                margin-right: 7px;
            }
            
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
    .dialog-title{
      text-align:left;
      font-size:24px;
      padding-left:20px;
      color:#484848;
      font-family: NotoSansCJKtc;
    }
    .video-dialog-content{
        width:100%;
        height:100%;
        margin: auto;
        padding: 0 34px 42px 34px;
        .rate-video-dialog{
          border-radius: 5px;
        }
        
        .dialog-hr{
            border: none;
            margin-bottom:10px;
            bottom: 5px;
            margin-top: 0;
        }
        .video-content{
                @include point(margin,20);
                padding-top: 0;
                position: relative;
                height: 400px;
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
}
    
</style>
<style>
@import '../assets/css/videoBar.css';
</style>
