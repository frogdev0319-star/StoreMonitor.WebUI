<template>
  <el-row class="el-rate-container">
    <el-col :span="16" :style="{'min-height':windowHeight*0.82+'px'}" class="lside">
      <div class="title-content">
        <img :src="sourceSrc" :height="varyWindowWidth>1366?'40px':'32px'" class="title-img" >
        <span class="event-title">{{ event.eventTitle }}</span>
        <span v-if="event.score!==Math.pow(-2,31)" class="event-score">{{ $t('eventView.scores') }} {{ event.score }}</span>
        <el-button
          v-if="showWinpBtn"
          :size="varyWindowWidth > 1680 ? 'small' : 'mini'"
          class="el-submit"
          type="primary"
          @click="submit">{{ $t('eventView.submit') }}</el-button>
      </div>
      <el-dialog
        v-if="dialogFormVisible"
        :title="$t('eventView.view')"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        width="850px"
        top="12%"
        class="rate-video-dialog"
        @close="closeRealTime">
        <div
          class="video-dialog-content"
          style="overflow:hidden;"
          @mousemove="showControlInfo=true"
          @mouseleave="showControlInfo = false">
          <hr class="dialog-hr">
          <dash-video v-if="vendor === 0" ref="dashVideo" :channel-info="channelInfo" :is-event="isEvent" :store-id="event.storeId"/>
          <ezviz-video v-else-if="vendor === 1" ref="ezvizVideo" :channel-info="channelInfo" :is-event="isEvent" :store-id="event.storeId"/>
          <beseye-video v-else ref="beseyeVideo" :channel-info="channelInfo" :is-event="isEvent" :store-id="event.storeId"/>
        </div>
      </el-dialog>
      <el-dialog
        v-if="dialogCommentVideo"
        :title="$t('eventView.view')"
        :visible.sync="dialogCommentVideo"
        :close-on-click-modal="false"
        width="850px"
        top="12%"
        class="rate-video-dialog"
        @close="stopCommentVideo">
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
      <el-dialog
        v-if="showRelatedChannelFlag"
        :title="$t('eventView.associatedChannel')"
        :visible.sync="showRelatedChannelFlag"
        :close-on-click-modal="false"
        width="540px"
        top="18%"
        class="rate-video-dialog"
        @close="showRelatedChannelFlag = false">
        <div class="video-dialog-content" style="overflow:hidden;">
          <hr class="dialog-hr">
          <div class="channel-content" >
            <el-radio-group v-model="channelRadio" class="radio-group">
              <el-radio v-for="(item, index) in relatedChannels" :label="item.id" :key="index" class="radio-class">
                <img :src="cameraImg" class="radio-img">
                <span class="radio-span">{{ item.name }}</span>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button id="cancelBtn" size="mini" @click="cancelSelect">{{ $t('remotePatrol.cancel') }}</el-button>
          <el-button id="confirmBtn" size="mini" type="primary" @click="confirmSelect">
            {{ $t('remotePatrol.confirm') }}
          </el-button>
        </span>
      </el-dialog>
      <transition name="fade">
        <el-dialog
          v-if="showOuter"
          :title="$t('eventView.view')"
          :visible.sync="showOuter"
          :close-on-click-modal="false"
          width="850px"
          top="12%">
          <div class="video-dialog-content" style="overflow:hidden;">
            <hr class="dialog-hr">
            <div class="dialog-source-content">
              <img v-if="showImg" :src="checkImgSrc">
            </div>
          </div>
        </el-dialog>
      </transition>
      <div class="storeInfo-content">
        <div class="storeInfo-details">
          <dd><span :class="lang==='en'? 'en-w4': 'w4'">{{ $t('eventView.storeName') }}：</span></dd>
          <span class="details-info">{{ event.storeName }}</span>
        </div>
        <div class="storeInfo-details">
          <div :class="lang === 'en' ? 'en-w3-content' : 'w3-content'">
            <dd><span :class="lang==='en'? 'en-w3': 'w3'">{{ $t('eventView.submitter') }}：</span></dd>
            <el-tooltip
              :popper-class="tooltipClass"
              :content="event.createor"
              effect="dark"
              placement="bottom-start">
              <span class="details-info">{{ event.createor }}</span>
            </el-tooltip>
          </div>
          <div :class="lang === 'en' ? 'en-w3-content' : 'w3-content'">
            <dd><span :class="lang==='en'? 'en-w3': 'w3'">{{ $t('eventView.solver') }}：</span></dd>
            <el-tooltip
              :popper-class="tooltipClass"
              :content="event.assigneeName"
              effect="dark"
              placement="bottom-start">
              <span class="details-info">{{ event.assigneeName }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="storeInfo-details">
          <div :class="lang === 'en' ? 'en-w3-content' : 'w3-content'">
            <dd><span :class="lang === 'en' ? 'en-w4' : 'w4'">{{ $t('eventView.submitTime') }}：</span></dd>
            <span class="details-info">{{ event.createDate }}</span>
          </div>
          <div v-if="event.sourceType === 1 && relatedChannels.length > 0" :class="lang === 'en' ? 'en-w3-content' : 'w3-content'">
            <dd :class="lang === 'en' ? 'en-w3' : 'w3'" >
              <div :class="lang === 'en' ? 'en-related-channel' : 'related-channel'" @click="showRelatedChannel">
                <img :src="cameraImg" class="img-class">
                <span class="related-span">{{ $t('eventView.associatedChannel') }}</span>
              </div>
            </dd>
          </div>
        </div>
      </div>
      <div class="eventInfo-content">
        <strong v-if="lang === 'en'" style="margin-right: 28px">{{ $t('eventView.eventDetails') }}:</strong>
        <strong v-else>{{ $t('eventView.eventDetails') }}：</strong>
        <div class="content">
          <div v-if="showAudio" class="speech-content">
            <div class="speech-info" @click="startSpeech">
              <i :class="speech?'icon-yuyin':'icon-yuyin'" class="iconfont icon-speech"/>
            </div>
            <audio id="audio" :ref="audioRef" @canplay="getDuration">
              <source :src="audioSrc" type="audio/mpeg" >
            </audio>
            <span class="often-text">{{ audioOftenText }}</span>
          </div>

          <pre class="description">{{ event.description }}</pre>
          <div class="photo-content">
            <div v-for="(item,index) in videosourceList" :key="index" class="source-content">
              <!--video-->
              <div v-if="item.mediaType===1" class="img-content" @click="playCommentVideo(item,index)">
                <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
              </div>
              <div v-if="event.sourceType === 1" class="viedo-info">
                <div @click="checkVideo(item, index)">
                  <i class="iconfont icon-bofang icon-video"/>
                  <span class="ahref">{{ item.name+'区域' }}</span>
                </div>
              </div>
            </div>
            <div v-for="(item,index) in imgsourceList" :key="index" class="source-content">
              <div v-if="item.mediaType===2" class="img-content">
                <!--image-->
                <img
                  :src="item.url"
                  :title="imgTitle"
                  :onerror="deafultImg"
                  :height="imgHeight+'px'"
                  class="imgLittle imgInner"
                  @click="openOuter(item,$event)">
              </div>
            </div>
          </div>
          <div v-if="event.sourceType !== 1" class="viedo-info">
            <div v-if="showCheckVideo" @click="checkVideo">
              <i class="iconfont icon-bofang icon-video"/>
              <span class="ahref">{{ curChannel.name+'区域' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="showWinpBtn" :style="{'height':windowHeight*0.34+'px'}" class="submit-content">
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <span class="dealInfo-label">{{ $t('eventView.events') }}</span>
          <span>{{ $t('eventView.methods') }}</span><br>
          <div class="btn-content">
            <div v-for="(item,index) in subBtnList" :key="index" class="btn_List">
              <span v-if="item.isShow" :class="item.isActive?'activeClass':''" @click="clickSubBtn(item,index)">
                {{ item.name }}
              </span>
            </div>
          </div>
          <span style="display:block;"><span style="color:red;">* </span>{{ $t('eventView.addDetails') }}</span>
          <el-input
            :autosize="{ minRows: 2}"
            v-model="eventDes"
            :placeholder="$t('eventView.describe')"
            size="mini"
            class="des-input"
            type="textarea"
            resize="none"
            @input="(val)=>ivsIdChange(val)"
            @blur="notShowInputRuleTips"/>
          <span v-if="ivsIdRuletip" class="rules">{{ $t('eventView.RateRuletip') }}</span>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="8" class="rside">
      <div id="rside-title" class="title-content">
        <span>{{ $t('eventView.details') }}</span>
      </div>
      <div id="dealcontent" class="deal-content">
        <el-scrollbar style="height:100%;" class="el-menuscrollbar">
          <div v-if="commentList.length !== 0" id="rightLine"/>
          <div v-for="(item,index) in commentList" :key="index" class="deal-details">
            <div
              :style="item.showContent?{'background-color':'#FBC7CC'}:{'background-color':'#FAFAFA'}"
              class="circle-content">
              <div class="circle"/>
            </div>
            <div class="deal-lside">
              <span v-if="item.showLabel" :style="item.spanStyle">{{ item.process }}</span>
            </div>
            <div class="deal-rside">
              <div class="audio">
                <span class="creator">{{ item.createOr }}</span>
                <div v-if="item.showAudio" class="speech-content deal-speech">
                  <div class="speech-info" @click="startSpeechItem(item,index)">
                    <i class="iconfont icon-yuyin icon-speech"/>
                  </div>
                  <audio :ref="item.audio.audioRef" @canplay="getCommentDuration(item)">
                    <source :src="item.audio.audioSrc" type="audio/mpeg" >
                  </audio>
                  <span class="often-text">{{ item.audio.audioOftenText }}</span>
                </div>
              </div>
              <pre v-if="item.description != null" class="description">{{ item.description }}</pre>
              <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="source-content">
                <div
                  v-for="(_item,_index) in item.sourceList"
                  :key="_index"
                  :height="imgHeight+'px'"
                  class="source-details">
                  <div v-if="_item.mediaType === 2" class="img-content">
                    <img
                      :title="imgTitle"
                      :src="_item.url"
                      :height="imgHeight+'px'"
                      :onerror="deafultImg"
                      class="imgLittle imgInner"
                      @click="openOuter(_item,$event)">
                  </div>
                  <div v-else class="img-content " @click="playCommentVideo(_item,_index)">
                    <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                    <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                  </div>
                </div>
              </div>
              <div class="viedo-info">
                <span>{{ item.createDate }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import util from '../../../common/util';
import videojs from '../../../../static/video.js';
import 'videojs-contrib-hls';
import { eventRESTful } from '@/api/index';
import AudioVue from '@/components/AudioVue.vue';
import $ from 'jquery';
import { getDeviceList } from '@/api/device';
import EzvizVideo from '@/components/EzvizVideo.vue';
import PermissionHelper from '../../../api/PermissionHelper';
import filterString from '@/common/filterString';
import DashVideo from '../../../components/DashVideo';
import BeseyeVideo from '@/components/BeseyeVideo.vue';

export default {
  name: 'RateManage',
  components: {
    DashVideo,
    AudioVue,
    EzvizVideo,
    BeseyeVideo
  },
  data() {
    return {
      event: {},
      showWindContent: false,
      dialogFormVisible: false,
      dialogCommentVideo: false,
      showWinpBtn: true,
      audioOftenText: '',
      speech: false,
      audioRef: 'audioRef',
      audio: {},
      timeId: 0,
      isPlaying: false,
      audioSrc: '',
      showAudio: false,
      curChannel: null,
      sourceList: [],
      commentList: [],
      selGID: 0,
      initialized: false,
      previewplayer: '',
      winpDes: '',
      timeid: 0,
      windowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      showOuter: false,
      bigImgSrc: '',
      checkImgSrc: '',
      imgTitle: '',
      showCheckVideo: false,
      showPhotoContent: false,
      deafultImg: 'this.src="' + require('../../../../static/img/picture_failed.png') + '"',
      eventDes: '',
      videoSrc: require('../../../../static/img/monitor.png'),
      inspectSrc: require('../../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../../static/img/onsite_patrol.png'),
      startIcon: require('../../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../../static/img/video_thumbnail.png'),
      curStatus: null,
      showControlInfo: true,
      lang: this.$i18n.locale,
      isEvent: true,
      channelInfo: {},
      subBtnList: [],
      tooltipClass: 'event-tooltip-class',
      cameraImg: require('../../../../static/img/camera.png'),
      showRelatedChannelFlag: false,
      relatedChannels: [],
      channelRadio: '',
      ivsIdRuletip: false,
      videosourceList: [],
      imgsourceList: [],
      Changestatus: '',
      vendor: 0
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    currentStream() {
      return this.currentTech === 'Flash' ? 'RTMP' : 'HLS';
    },
    percentHeight: function() {
      return this.varyWindowWidth / 758;
    },
    imgWidth() {
      const width = 0;
    },
    imgHeight() {
      let height = 0;
      if (this.varyWindowWidth > 1800) {
        height = this.varyWindowWidth * 0.039;
      } else if (this.varyWindowWidth > 1400) {
        height = this.varyWindowWidth * 0.035;
      } else {
        height = 75;
      }
      return height;
    },
    sourceSrc: function() {
      let src = '';
      switch (this.event.sourceType) {
        case 0: src = this.videoSrc; break;
        case 1: src = this.inspectSrc; break;
        case 2: src = this.insiteInspectSrc; break;
      }
      return src;
    },
    divHeight() {
      if (this.windowHeight > 800) {
        return this.windowHeight * 0.749;
      } else if (this.windowHeight > 700) {
        return this.windowHeight * 0.659;
      } else {
        return this.windowHeight * 0.609;
      }
    },
    isEzviz() {
      const self = this;
      return self.$store.state.user.isEzviz;
    }
  },

  mounted() {
    const self = this;
    self.getBtnList();
    self.getSessionData();
    self.getCommentList(0);
    self.$nextTick(function() {
      setTimeout(() => {
        self.myfun();
      }, 500);
      setTimeout(() => {
        self.getDuration();
        self.commentList.forEach((_item, _index) => {
          self.getCommentDuration(_item);
        });
      }, 0);
    });
  },

  methods: {
    ivsIdChange(val) {
      const self = this;
      const comment = filterString.all(val, 200);
      self.eventDes = comment;
      const length = filterString.getContentLength(val);
      if (length > 200) {
        self.ivsIdRuletip = true;
      } else {
        self.ivsIdRuletip = false;
      }
    },

    notShowInputRuleTips() {
      this.ivsIdRuletip = false;
    },

    stopCommentVideo() {
      var video = document.getElementById('previewVideo');
      this.previewplayer = videojs(video);
      this.previewplayer.pause();
    },

    playCommentVideo(item, index) {
      const self = this;
      self.dialogCommentVideo = true;
      self.$nextTick(function() {
        var video = document.getElementById('previewVideo');
        this.previewplayer = videojs(video);
        this.previewplayer.src({ src: item.url });
        this.previewplayer.play();
      });
    },

    openOuter(item, $ev) {
      const self = this;
      if (item != null) {
        self.showOuter = true;
        self.checkImgSrc = item.url;
        self.showImg = true;
      }
    },

    showOuterPhoto(target) {
      const self = this;
      var winWidth = $(window).width();
      var winHeight = $(window).height();
      var src = target.src;
      self.bigImgSrc = src;
    },

    closeRealTime() {
      const self = this;
      if (self.vendor === 0) {
        self.$refs.dashVideo.stopVideoPlay();
      } else if (self.vendor === 1) {
        self.$refs.ezvizVideo.stopRealTime();
      }else{
        self.$refs.beseyeVideo.stopPlay();
      }
    },

    myfun() {
      var div1 = document.getElementsByClassName('lside');
      var div2 = document.getElementsByClassName('rside');
      const height = div1[0].offsetHeight;
      div2[0].style.height = height + 'px';
      var divtitle = document.getElementById('rside-title');
      var divContent = document.getElementById('dealcontent');
      divContent.style.height = (height - divtitle.offsetHeight) + 'px';
    },

    getDeviceList() {
      return new Promise((resolve, reject) => {
        getDeviceList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            const data = res.data;
            resolve(res.data);
          }
        });
      });
    },

    async getSessionData() {
      const self = this;
      const event = JSON.parse(sessionStorage.getItem('event'));
      const obj = {
        id: event.id,
        eventTitle: event.subject,
        storeName: event.storeName,
        createor: event.assignerName,
        assigneeName: event.assigneeName,
        createDate: util.getDateTime(event.ts),
        deviceId: event.deviceId,
        status: event.status,
        score: event.score,
        sourceType: event.sourceType,
        description: event.initialComment.description,
        storeId: event.storeId
      };
      self.event = obj;
      const deviceId = self.event.deviceId;
      const deviceList = await self.getDeviceList();
      let flag = false;
      if (deviceList != undefined) {
        deviceList.forEach(item => {
          if (item.id === deviceId) {
            flag = true;
            self.curChannel = item;
          }
        });
      }
      if (flag) {
        self.showCheckVideo = true;
      }
      const attachment = event.initialComment.attachment;
      const temp = [];
      attachment.forEach(item => {
        if (item.mediaType === 0) {
          self.audioSrc = item.url;
          self.showAudio = true;
          // self.audio.audioSrc=item.url;
          // self.audio.audioRef='audioRef';
        } else {
          deviceList.forEach(_item => {
            if (_item.id === item.deviceId) {
              item.channelId = _item.channelId;
              item.name = _item.name;
              item.ivsId = _item.ivsId;
              item.vendor = _item.vendor;
            }
          });
          temp.push(item);
        }
      });
      self.sourceList = temp;
      self.videosourceList = temp.filter(x => x.mediaType === 1);
      self.imgsourceList = temp.filter(x => x.mediaType === 2);
      const relatedDeviceIds = event.relatedDeviceIds.sort();
      self.relatedChannels = [];
      relatedDeviceIds.forEach(item => {
        deviceList.forEach(_item => {
          if (_item.id === item) {
            self.relatedChannels.push(_item);
          }
        });
      });
    },

    getDuration() {
      const self = this;
      if (self.showAudio) {
        const audio = self.$refs.audioRef;
        let du = audio.duration;
        if (isNaN(du)) {
          self.showAudio = false;
        } else {
          const duration = Math.floor(du);
          if (duration === 0) {
            du = 1;
          }
          self.audioOftenText = parseInt(du) + '"';
        }
      }
    },

    getCommentDuration(item) {
      const self = this;
      if (item.showAudio) {
        const audio = self.$refs[item.audio.audioRef][0];
        let du = audio.duration;
        if (isNaN(du)) {
          item.showAudio = false;
        } else {
          const duration = Math.floor(du);
          if (duration === 0) {
            du = 1;
          }
          item.audio.audioOftenText = parseInt(du) + '"';
        }
      }
    },

    getCommentProcess() {
      const self = this;
      self.commentList.forEach((_item, _index) => {
        if (_item.showAudio) {
          if (isNaN(self.$refs[_item.audio.audioRef][0].duration)) {
            _item.showAudio = false;
          } else {
            _item.audio.audioOftenText = parseInt(self.$refs[_item.audio.audioRef][0].duration) + '"';
          }
        }
      });
    },

    startSpeech() {
      const self = this;
      self.$refs.audioRef.ended ? self.isPlaying = false : null;
      if (!self.isPlaying) {
        self.$refs.audioRef.play();
        self.isPlaying = true;
        self.speech = true;
      } else {
        self.$refs.audioRef.pause();
        self.isPlaying = false;
        self.speech = false;
        clearInterval(self.timeid);
      }
    },

    startSpeechItem(item, index) {
      const self = this;
      self.$refs[item.audio.audioRef][0].ended ? item.audio.isPlaying = false : null;
      if (!item.audio.isPlaying) {
        self.$refs[item.audio.audioRef][0].play();
        item.audio.isPlaying = true;
      } else {
        self.$refs[item.audio.audioRef][0].pause();
        item.audio.isPlaying = false;
      }
      self.commentList.forEach((_item, _index) => {
        if (_item.audio != undefined) {
          if (_index !== index) {
            self.$refs[_item.audio.audioRef][0].pause();
            _item.audio.isPlaying = false;
          }
        }
      });
    },

    checkVideo(item, index) {
      const self = this;
      self.dialogFormVisible = true;
      self.channelInfo = self.curChannel;
      self.vendor = self.channelInfo.vendor;
      if (index != undefined) {
        self.curChannel = item;
      }
      self.playVendorVideo();
    },

    getCommentList(e) {
      const self = this;
      const eventIds = [];
      self.commentList = [];
      eventIds.push(self.event.id);
      const params = {
        'eventIds': eventIds
      };
      eventRESTful.getCommentList(params).then(res => {
        const errMsg = res.errMsg;
        const data = res.data;
        if (errMsg === 'Success') {
          const comments = data[0];
          const dataComments = comments.comment;
          const temp = [];
          self.curStatus = dataComments[0].status;
          // 0 pending：handle、add、closed
          // 1 handled：add、closed、reject
          // 2 closed：
          // 3 reject：handle、add、closed
          self.subBtnList.forEach(item => {
            if (self.curStatus === 0 || self.curStatus === 3) {
              item.order === 0 || item.order === 1 || item.order === 2 ? item.isShow = true : item.isShow = false;
              item.order === 0 ? item.isActive = true : item.isActive = false;
            }
            if (self.curStatus === 1) {
              item.order === 1 || item.order === 2 || item.order === 3 ? item.isShow = true : item.isShow = false;
              item.order === 1 ? item.isActive = true : item.isActive = false;
            }
          });
          dataComments.forEach((item, index) => {
            const obj = {};
            obj.createOr = item.accountName;
            obj.createDate = util.getDateTime(item.ts);
            obj.status = item.status;
            obj.description = item.description;
            switch (item.status) {
              case 0: obj.showLabel = true; obj.spanStyle = { 'background-color': '#FCB83B' };
                obj.process = this.$t('eventView.pending'); break;
              case 1: obj.showLabel = true; obj.spanStyle = { 'background-color': '#434B5E' };
                obj.process = this.$t('eventView.handled'); break;
              case 2: obj.showLabel = true; obj.spanStyle = { 'background-color': '#6097F4' };
                obj.process = this.$t('eventView.closed'); break;
              case 3: obj.showLabel = true; obj.spanStyle = { 'background-color': '#FCB83B' };
                obj.process = this.$t('eventView.returnStatus'); break;
            }
            if (item.status === 2) {
              self.showWinpBtn = false;
            }
            obj.showContent = index === 0;
            if (item.attachment.length !== 0) {
              const _temp = [];
              const audioObj = {};
              item.attachment.forEach((_item, _index) => {
                if (_item.mediaType === 0) {
                  audioObj.audioSrc = _item.url;
                  audioObj.audioRef = 'audioRef' + index;
                  audioObj.isPlaying = false;
                  audioObj.audioOftenText = '';
                  obj.showAudio = true;
                } else {
                  _temp.push(_item);
                }
              });
              obj.audio = audioObj;
              obj.sourceList = _temp;
            }
            temp.push(obj);
          });
          self.commentList = temp.slice(0, temp.length - 1);
        }
      });
    },

    clickSubBtn(item, index) {
      const self = this;
      item.isActive = true;
      self.subBtnList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isActive = false;
        }
      });
    },

    addComment(status, description) {
      const self = this;
      const eventIds = [];
      eventIds.push(self.event.id);
      const comments = {
        ts: new Date().getTime(),
        description: description,
        account: self.event.createor,
        status: status
      };
      const params = {
        eventIds: eventIds,
        comment: comments
      };
      eventRESTful.addComment(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg === 'Success') {
          self.notify(this.$t('storeView.successSubmit'), 'success', 3000);
          self.getCommentList(1);
          self.eventDes = '';
          setTimeout(() => {
            self.commentList.forEach((_item, _index) => {
              self.getCommentDuration(_item);
            });
          }, 3000);
        } else {
          self.notify(this.$t('storeView.failSubmit'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        console.log('EventDetail-addComment:' + err);
      });
    },

    submit() {
      const self = this;
      let status = 0;
      const description = self.eventDes;
      if (description.trim().length === 0) {
        self.notify(this.$t('eventView.emptyInfo'), 'warning', 3000);
        return false;
      }
      if (self.subBtnList[0].isActive) {
        if (status = self.subBtnList[0].order === 0) {
          status = 1;
        } else if (self.subBtnList[0].order === 1) {
          status = 2;
        } else {
          status = self.curStatus;
        }
      } else if (self.subBtnList[1].isActive) {
        if (self.subBtnList[1].order === 1) {
          status = 2;
        } else {
          status = self.curStatus;
        }
      } else if (self.subBtnList[2].isActive) {
        if (self.subBtnList[2].order === 3) {
          status = 3;
        } else {
          status = self.curStatus;
        }
      } else if (self.subBtnList[3].isActive) {
        if (self.subBtnList[3].order === 3) {
          status = 3;
        } else {
          status = self.curStatus;
        }
      } else {
        status = self.curStatus;
      }
      self.addComment(status, description);
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    getBtnList() {
      const self = this;
      const authorities = self.$store.state.user.authorities;
      PermissionHelper.setData(authorities);
      const tempBtnList = [];
      PermissionHelper.enableEventHandle() && tempBtnList.push({
        name: this.$t('eventView.handling'),
        order: 0,
        isShow: false,
        isActive: false
      });
      PermissionHelper.enableEventClose() && tempBtnList.push({
        name: this.$t('eventView.closing'),
        order: 1,
        isShow: false,
        isActive: false
      });
      PermissionHelper.enableEventAdd() && tempBtnList.push({
        name: this.$t('eventView.adding'),
        order: 2,
        isShow: false,
        isActive: false
      });
      PermissionHelper.enableEventReturn() && tempBtnList.push({
        name: this.$t('eventView.returnStatus'),
        order: 3,
        isShow: false,
        isActive: false
      });
      self.subBtnList = tempBtnList;
    },

    showRelatedChannel() {
      const self = this;
      self.showRelatedChannelFlag = true;
      self.channelRadio = self.relatedChannels[0].id;
    },

    cancelSelect() {
      const self = this;
      self.showRelatedChannelFlag = false;
      self.channelRadio = '';
    },

    confirmSelect() {
      const self = this;
      self.showRelatedChannelFlag = false;
      const channel = self.relatedChannels.filter(item => item.id === self.channelRadio);
      self.curChannel = channel[0];
      self.dialogFormVisible = true;
      self.channelRadio = '';
      self.channelInfo = {};
      self.channelInfo = self.curChannel;
      self.vendor = self.curChannel.vendor;
      self.playVendorVideo();
    },

    playVendorVideo() {
      const self = this;
      if (self.vendor === 0) {
        self.$nextTick(() => {
          self.$refs.dashVideo.startVideo(self.channelInfo.ivsId, self.channelInfo.channelId, null);
        })
      } else if (self.vendor === 1) {
        self.$nextTick(async() => {
          await self.$refs.ezvizVideo.getEzvizAccessToken(self.channelInfo.ivsId);
          if (self.$refs.ezvizVideo.playState) {
            self.$refs.ezvizVideo.stopRealTime();
            self.$nextTick(() => {
              self.$refs.ezvizVideo.realTime();
            });
          } else {
            self.$nextTick(() => {
              self.$refs.ezvizVideo.realTime();
            });
          }
        })
      } else {
        self.$nextTick(() => {
          self.$refs.beseyeVideo.startPlay();
        })
      }
    }

  }
};
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
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid $border;
    @include point(padding-left,20);
    @include point(padding-right,20);
    display: flex;
    align-items: center;
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
        /*.el-submit{*/
            /*top: 30%;*/
        /*}*/
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
        /*.el-submit{*/
            /*top: 20%;*/
        /*}*/
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
                //@include point(top,8);
                @include point(margin-left,20);
            }
            .event-title{
                @include point(padding-right,20);
                font-weight: bold;
                color: $black;
                margin-left: 20px;
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .event-score{
                background-color: #FCBA3F;
                padding:4px 12px;
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                border-radius: 12px;
                height: 12px;
                line-height: 12px;
            }
            .el-submit{
                position: absolute;
                @include point(right,20);
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
            .channel-content{
              margin: 20px 30px;
              padding-top: 0;
              position: relative;
              .radio-group{
                display: grid;
                grid-template-columns: 240px 240px;
                grid-template-rows: 30px;
              }
              .radio-class{
                display: flex;
                align-items: center;
                >>> .el-radio__label{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .radio-img{
                  height: 26px;
                  width: 26px;
                  margin-right: 10px;
                }
                .radio-span{
                  display: inline-block;
                  max-width: 150px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 14px;
                  color: #94a4b4;
                }
              }
            }
        }
      >>> .el-dialog__footer{
        line-height: 24px;
        padding: 30px;
        padding-top: 20px;
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
          font-size: 12px;
          line-height: 12px;
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
              margin-right: calc(45/1920*100vw);
              overflow: hidden;
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: calc(400/1920*100vw);
              //width: 200px;
              @media screen and (min-width: 1280px) and(max-width: 1366px){
                width: 270px;
              }
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
            .related-channel{
              width: 110px;
              height: 30px;
              line-height: 30px;
              margin: 10px;
              margin-left: 0;
              font-size: 12px;
              color: #6097F4;
              border-radius: 15px;
              background-color: $background;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing:0;
              cursor: pointer;
              .img-class{
                height: 26px;
                width: 26px;
                margin-right: 10px;
              }
              .related-span{
                font-weight: bolder;
              }
            }
            .en-related-channel{
              width: 180px;
              height: 30px;
              line-height: 30px;
              margin: 10px;
              margin-left: 0;
              font-size: 12px;
              color: #6097F4;
              border-radius: 15px;
              background-color: $background;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing:0;
              cursor: pointer;
              .img-class{
                height: 26px;
                width: 26px;
                margin-right: 10px;
              }
              .related-span{
                font-weight: bolder;
              }
            }
        }
        .submit-content{
            background-color: $background;
            margin-left: 25px;
            text-align: left;
            font-size: 14px;
            margin-top: 15px;
            padding-bottom:15px;
            padding-left: 25px;
            color: $black;
            width: 92%;
            @include point(padding-top,20);
            .dealInfo-label{
                font-weight: bold;
                margin-bottom: 25px;
                display: block;
            }
            .btn-content{
                margin-top: 10px;
                margin-bottom: 25px;
                .btn_List{
                    display: inline-block;
                    span{
                        display: inline-block;
                        @include point(margin-right,20);
                        border: 1px solid #ddd;
                        padding:6px;
                        font-size: 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        @include point(width,80);
                        @include point(padding,6);
                        text-align: center;
                        background-color: #fff;
                    }
                    //  &:first-child{
                    //         margin-left: 0;
                    //     }
                    .activeClass{
                        background-color: #FDE8EF !important;
                        color: $red;
                        border-color: $red !important;
                    }
                }
            }
            .des-input{
                @include point(margin-right,20);
                margin-top: 15px;
                width: 80%;
            }
            .rules{
                font-size: 10px;
                color:#ff2400;
                margin-top: 3px;
                display: block;
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
                font-family: Roboto, Arial, 'Microsoft YaHei';
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
                        font-family: Roboto,Arial, 'Microsoft YaHei';
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
                          @media screen and (min-width: 1280px) and(max-width: 1366px){
                            width: 90px;
                            .img-content .imgLittle{
                              width: 85px;
                            }
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
@import '../../../assets/css/videoBar.css';
.el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
}
  .event-tooltip-class{
    max-width: calc(200/1920*100vw);
  }
</style>
