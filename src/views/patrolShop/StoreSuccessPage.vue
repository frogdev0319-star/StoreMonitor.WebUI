<template>
  <div class="el-sucPage-content">
    <div class="page-icon">
      <div class="icon-content">
        <img :src="isSuccess ? sucSrc:errSrc" class="suc-icon">
        <p :class="isSuccess ? 'sucInfo':'errInfo'">{{ retInfo }}</p>
        <p v-if="isSuccess && lang !== 'en'" class="sucret-info">{{ curSecond }}{{ $t('remotePatrol.return') }}</p>
        <p v-if="isSuccess && lang === 'en'" class="sucret-info">{{ $t('remotePatrol.return') }} {{ curSecond }}s!</p>
      </div>
    </div>
    <el-dialog
      v-if="dialogCommentVideo"
      :title="$t('remotePatrol.view')"
      :visible.sync="dialogCommentVideo"
      :close-on-click-modal="false"
      :width="720*percentHeight+'px'"
      height="300px"
      top="5%">
      <div class="canvas-content">
        <hr class="dialog-hr">
        <video id="previewCutVideo" :width="667*percentHeight" :height="431*percentHeight" :src="curVideoSrc" prload controls/>
      </div>
    </el-dialog>
    <div v-if="isSuccess" :style="{'min-height':varyWindowHeight-460+'px'}" class="page-content">
      <div class="details">
        <span v-if="lang ==='en'" class="en-event-label" style="margin-right: 25px;">{{ $t('remotePatrol.storeName') }}:</span>
        <span v-else class="event-label" >{{ $t('remotePatrol.storeName') }}</span>
        <span>{{ storeName }}</span>
      </div>
      <div class="details">
        <span v-if="lang ==='en'" class="en-event-label" style="margin-right: 75px;">{{ $t('remotePatrol.eventTitle') }}:</span>
        <span v-else class="event-label" >{{ $t('remotePatrol.eventTitle') }}：</span>
        <span>{{ eventName }}</span>
      </div>
      <div class="details">
        <span v-if="lang ==='en'" class="en-event-label" style="margin-right: 60px;">{{ $t('remotePatrol.eventStatus') }}:</span>
        <span v-else class="event-label" >{{ $t('remotePatrol.eventStatus') }}：</span>
        <span class="icon-span">{{ $t('remotePatrol.untreated') }}</span>
      </div>
      <div class="details">
        <span :class="lang === 'en' ? 'en-event-label' : 'event-label'">{{ $t('remotePatrol.description') }}:</span>
        <div v-for="(item,index) in commentList" v-show="item.eventDes.length > 0" :key="index"
             class="comment-details">
          <div :style="item.showContent ? {'background-color':'#FBC7CC'} : {'background-color':'#FAFAFA'}"
               class="circle-content">
            <div class="circle"/>
          </div>
          <div class="lside"/>
          <div class="rside">
            <div class="event-name">
              <span>{{ item.eventDes }}</span>
            </div>
            <div class="source-content">
              <div v-for="(_item,_index) in sourceList" :key="_index" class="source-details">
                <div v-if="_item.mediaType === 2" class="img-content">
                  <img :src="_item.url" height="100" width="140">
                </div>
                <div v-if="_item.mediaType === 1" class="img-content">
                  <img :src="startIcon" :height="36" class="start-icon" @click="playCutVideo(_item,_index)">
                  <img :src="videoImgSrc" height="100">
                </div>
              </div>
            </div>
            <span class="event-ts">{{ item.ts }}</span>
          </div>
        </div>
      </div>
      <div v-if="showLeader" class="details">
        <span v-if="lang ==='en'" class="en-event-label" style="margin-right: 70px;">{{ $t('remotePatrol.copy') }}:</span>
        <span v-else class="event-label" style="margin-right:38px;">{{ $t('remotePatrol.copy') }}：</span>
        <span>{{ leader }}</span>
      </div>
    </div>
    <div v-else class="page-err-btn">
      <el-button size="mini" type="primary" class="retry-btn" @click="reTry">
        {{ $t('remotePatrol.tryAgain') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { addEvent, addComment } from '@/api/event';
import PubSub from 'pubsub-js';

export default {
  name: 'StoreSuccessPage',
  data() {
    return {
      isSuccess: false,
      sucSrc: require('../../../static/img/submit_succeed.png'),
      errSrc: require('../../../static/img/submit_failed.png'),
      sucInfo: this.$t('remotePatrol.submitSucc'),
      errInfo: this.$t('remotePatrol.submitFail'),
      curSecond: 10,
      storeName: '西安6店',
      eventName: '水吧问题2',
      leader: '小明',
      showLeader: true,
      commentList: [],
      sourceList: [],
      routeData: null,
      timeid: 0,
      varyWindowHeight: window.innerHeight,
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
      dialogCommentVideo: false,
      curVideoSrc: '',
      lang: this.$i18n.locale
    };
  },

  computed: {
    retInfo: function() {
      if (this.isSuccess) {
        return this.sucInfo;
      } else {
        return this.errInfo;
      }
    },
    percentHeight: function() {
      return this.varyWindowHeight / 758;
    }
  },

  mounted() {
    const self = this;
    self.isSuccess = false;
    self.getRouterData();
    self.getCommentList();
    if (self.isSuccess) {
      self.timeid = setInterval(function() {
        self.getBackSecond();
      }, 1000);
    }
  },

  methods: {
    getRouterData() {
      const self = this;
      let routeData = self.$route.params.data;
      console.log(routeData);
      if (self.$route.params.data == undefined) {
        routeData = JSON.parse(sessionStorage.getItem('store_submit'));
      }
      self.routeData = routeData;
      self.isSuccess = routeData.flag.isSuccess;
      // self.isSuccess=false;
      if (self.isSuccess === false) {
        PubSub.publish('success-page', { changeStyle: true });
      }
      self.storeName = routeData.store.storeName;
      self.eventName = routeData.event.eventName;
      self.sourceList = routeData.event.fileList;
      if (routeData.flag.addEventType === 'add') {
        self.showLeader = true;
        self.leader = routeData.user.length != 0 ? routeData.user[0].userName : '';
      } else {
        self.showLeader = false;
      }
      if (self.isSuccess) {
        self.$route.matched[2].name = 'successSubmit';
      } else {
        self.$route.matched[2].name = 'failSubmit';
      }
    },

    getBackSecond() {
      const self = this;
      self.curSecond--;
      if (self.curSecond === 0) {
        clearInterval(self.timeid);
        self.$router.push({ name: 'storeMonitor', params: { flag: self.isSuccess }});
      }
    },

    playCutVideo(item) {
      const self = this;
      self.dialogCommentVideo = true;
      self.curVideoSrc = item.url;
    },

    getCommentList() {
      const self = this;
      const temp = [];
      const obj = {
        showContent: true,
        eventDes: self.routeData.event.description,
        ts: self.routeData.curTs
      };
      temp.push(obj);
      self.commentList = temp;
    },

    reTry() {
      const self = this;
      self.$router.push({ name: 'storeMonitor', params: { flag: self.isSuccess }});
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }
  },

  beforeRouteLeave(to, from, next) {
    const self = this;
    clearInterval(self.timeid);
    next();
  }
};
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
        overflow: hidden;
        background-color: #fff;
        .canvas-content{
            position: relative;
            #previewCutVideo{
                @include point(margin-bottom,20);
                @include point(margin-top,15);
            }
            .dialog-hr{
                border: 0.5px solid ;
                border-color: #dfe2e9;
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
                padding-top: 50px;
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
                .en-event-label{
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
                        left: 130px;
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
                        width: 140px;
                        float: left;
                        min-height: 150px;
                    }
                    .rside{
                        width:calc(100% - 150px);
                        border-left: 1px solid #ddd;
                        float: left;
                        position: relative;
                        bottom: 10px;
                        .event-name{
                            margin-left: 20px;
                            margin-top: 10px;
                            display: block;
                            margin-right: 20px;
                            white-space:pre-wrap;
                            word-wrap:break-word;
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
                margin-bottom: 50px;
            }
        }
    }
</style>
<style>
@import '../../assets/css/importfile.css';
</style>
