<template>
  <div>
    <div v-if="showError" :class="isEvent ? 'event-error': ''" class="errorVideo-model">
      <span>{{ errorText }}</span>
    </div>
    <div
      v-loading="isLoading"
      v-else
      id="videoContent"
      :style="isEvent ? {}: {'margin-bottom': 0}"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="video-content">
      <span v-if="channelInfo != null" id="channelName">{{ channelInfo != null ? channelInfo.channelName : '' }}</span>
      <div v-if="channelInfo != null" class="icon-footer" >
        <div class="iconlside">
          <i :class="paused ? 'icon-bofang1' : 'icon-zantingtingzhi'" class= "iconfont iconplay" @click="onPlay"/>
        </div>
        <div class="iconrside">
          <div v-if="isHistory" class="speed-content">
            <span>{{ $t("remotePatrol.speed") }}</span>
            <el-select
              v-show="!fullScreen"
              v-model="curSpeed"
              :popper-class="popperClass"
              class="el-test"
              size="mini"
              @change="adjustSpeed"
            >
              <el-option
                v-for="item in speedList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-show="fullScreen"
              v-model="curSpeed"
              :popper-class="popperClass"
              :popper-append-to-body="false"
              class="el-test"
              size="mini"
              @change="adjustSpeed"
            >
              <el-option
                v-for="item in speedList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>{{ $t("remotePatrol.back") }}</span>
            <el-select
              v-show="!fullScreen"
              :value="curBack"
              :popper-class="popperClass"
              class="el-test"
              size="mini"
              placeholder=" "
            >
              <el-option
                v-for="item in backList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click.native="adjustProcess(item.value, item.label)"
              />
            </el-select>
            <el-select
              v-show="fullScreen"
              :value="curBack"
              :popper-class="popperClass"
              :popper-append-to-body="false"
              class="el-test"
              size="mini"
              placeholder=" "
            >
              <el-option
                v-for="item in backList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click.native="adjustProcess(item.value, item.label)"
              />
            </el-select>
          </div>
          <div class="screen-content">
            <i
              :class="fullScreen?'icon-tuichuquanping':'icon-quanping'"
              class="iconfont iconscreen"
              @click="controlScreen"/>
          </div>
        </div>
      </div>
      <div v-show="currentTimeValue > 0" class="progress-content">
        <b-progress
          id="bprogress"
          :value="currentTimeValue"
          :max="durationTimeValue"
          class="mb-3 el-prog"
          height="0.2rem"
          style="margin-bottom: 0px !important"
        />
      </div>
      <transition name="fade">
        <div v-if="showSnapshotBtn && !isEvent" :class="lang === 'en'? 'en-iconright' : 'iconright'" @click="cutPicture">
          <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"/>
          <span>{{ $t('remotePatrol.snapshot') }}</span>
        </div>
      </transition>
      <video
        id="dashVideo"
        :controls="showControls"
        :paused="paused"
        :muted = "muted"
        height="83%"
        width="90%"
        prload
        autoplay
        class="video-js vjs-fill"
        @waiting="onPlayerWaiting($event)"
        @playing="onPlayerPlaying($event)"/>
    </div>
    <el-dialog
      v-if="showSnapShotDialog"
      :title="$t('remotePatrol.edit')"
      :visible.sync="showSnapShotDialog"
      :close-on-click-modal="false"
      :width="860 * percentHeight + 'px'"
      height="300px"
      top="5%"
    >
      <div
        class="canvas-content"
        @mouseenter="showCancel"
        @mouseleave="hiddenCancel"
      >
        <hr class="dialog-hr" >
        <transition name="fade">
          <div v-if="showPenBtn" id="iconR" class="icon-right">
            <img :src="penBtnSrc" class="pen-btn" @click="showPenList" >
            <transition name="fadepen">
              <div v-if="showPen" class="pen-content">
                <div
                  v-for="(item, index) in penList"
                  :key="index"
                  class="content"
                >
                  <div :class="{ colorActive: item.showContent }" />
                  <div
                    :id="item.id"
                    class="color"
                    @click="checkPen(item, index)"
                  />
                </div>
              </div>
            </transition>
          </div>
        </transition>
        <canvas
          id="icanvas"
          :width="767 * percentHeight"
          :height="431 * percentHeight"
          @mousedown="mouseDownAction($event)"
          @mousemove="mouseMoveAction($event)"
          @mouseleave="mouseLeaveAction($event)"
          @mouseup="mouseUpAction($event)"
        />
        <div
          v-if="showCancelContent"
          :style="{
            width: 767 * percentHeight + 'px',
            'margin-left': 47 * percentHeight + 'px',
          }"
          class="cancel-content"
        >
          <div class="content" @click="cancelEditCanvas">
            <img :src="clearIconSrc" class="icon-clear" height="22px" >
            <span>{{ $t("remotePatrol.clear") }}</span>
          </div>
          <div class="content" @click="confirmEditCanvas">
            <img :src="removeIconSrc" class="icon-clear" height="22px" >
            <span>{{ $t("remotePatrol.cancel") }}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" size="mini" @click="cancelEdit">{{
        $t("remotePatrol.cancel") }}</el-button>
        <el-button
          id="confirmBtn"
          size="mini"
          type="primary"
          @click="confirmEdit"
        >
          {{ $t("remotePatrol.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!--feedback based on snapshot -->
    <el-dialog
      v-if="showSnapshotFeedbackDialog"
      :title= "$t('remotePatrol.feedbacks')"
      :visible.sync="showSnapshotFeedbackDialog"
      :close-on-click-modal="false"
      :width="860*percentHeight+'px'"
      height="300px"
      top="5%">
      <div class="canvas-content" style="overflow:hidden;">
        <hr class="dialog-hr">
        <div class="feed-canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
          <div v-if="showPenBtn" id="iconR" class="icon-right">
            <img :src="penBtnSrc" class="pen-btn" @click="showPenList">
            <transition name="fadepen">
              <div v-if="showPen" class="pen-content">
                <div v-for="(item,index) in penList" :key="index" class="content">
                  <div :class="{colorActive:item.showContent}"/>
                  <div :id="item.id" class="color" @click="checkPen(item,index)"/>
                </div>
              </div>
            </transition>
          </div>
          <canvas
            id="icanvas"
            :width="520*percentHeight"
            :height="340*percentHeight"
            @mousedown="mouseDownAction($event)"
            @mouseup="mouseUpHandler"
            @mousemove="mouseMoveAction($event)"
            @mouseleave="mouseLeaveAction($event)"/>
          <div
            v-if="showCancelContent"
            :style="{'width':520*percentHeight+'px',
                     'margin-left':47*percentHeight+'px'}"
            class="cancel-content">
            <div class="content" @click="cancelEditCanvas">
              <img :src="clearIconSrc" class="icon-clear" height="22px">
              <span>{{ $t('remotePatrol.clear') }}</span>
            </div>
            <div class="content" @click="confirmEditCanvas">
              <img :src="removeIconSrc" class="icon-clear" height="22px">
              <span>{{ $t('remotePatrol.cancel') }}</span>
            </div>
          </div>
        </div>
        <div class="event-content">
          <span class="event-title"><span class="is-required">*</span>{{ $t('remotePatrol.name') }}</span>
          <el-input
            v-model="eventName"
            size="mini"
            class="name-input"
            @input="eventNameChanged"
            @blur="notShowInputRuleTips('eventName')"/>
          <span v-if="eventNameRuletip" class="rules" style="margin-left:0;">{{ $t('remotePatrol.eventNameRuletip') }}</span>
          <span v-if="showEventNameInfo" class="error-class">{{ $t('remotePatrol.emptyTitle') }}</span>
          <span class="event-title">{{ $t('remotePatrol.description') }}</span>
          <el-input
            :autosize="{ minRows: 4, maxRows:7}"
            v-model="eventDes"
            :placeholder="$t('remotePatrol.descPlaceholder')"
            size="mini"
            class="des-input"
            type="textarea"
            resize="none"
            @input="eventDesChanged"
            @blur="notShowInputRuleTips('eventDes')"/>
          <span v-if="eventDesRuletip" class="rules" style="margin-left:0;">{{ $t('remotePatrol.comentRuletip') }}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" size="mini" @click="showSnapshotFeedbackDialog = false">
          {{ $t('remotePatrol.cancel') }}
        </el-button>
        <el-button id="confirmBtn" size="mini" type="primary" @click="confirmFeedBackOnSnapshot">
          {{ $t('remotePatrol.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import videojs from '../../static/video.js';
import DashHttp from '@/common/DashHttp.js';
import { getDashServerInfo } from '@/api/device.js';
import util from '@/common/util';
import filterString from '../common/filterString';

export default {
  name: 'DashVideo',
  props: {
    channelInfo: {
      type: Object,
      default: () => {}
    },
    curDeviceId: {
      type: Number,
      default: -1
    },
    sourceListLength: {
      type: Number,
      default: 0
    },
    showFeedBack: {
      type: Boolean,
      default: false
    },
    isEvent: {
      type: Boolean,
      default: false
    },
    isStoreMonitor: {
      type: Boolean,
      default: false
    },
    isHistory: {
      type: Boolean,
      default: false
    },
    curTime: {
      type: Number,
      default: 0
    },
    storeId: {
      type: String,
      default: ''
    },
    videoAuthority: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      popperClass: 'select-popClass',
      errorText: '',
      showCancelContent: false,
      playState: false,
      playBackState: false,
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,

      currentTimeValue: 0,
      durationTimeValue: 0,
      currentStr: '0:00:00',
      durationStr: '0:00:00',
      timeid: null,
      speedList: [
        {
          value: 0,
          label: '1/4 X'
        },
        {
          value: 1,
          label: '1/2 X'
        },
        {
          value: 2,
          label: '1 X'
        },
        {
          value: 3,
          label: '2 X'
        },
        {
          value: 4,
          label: '4 X'
        }
      ],
      curSpeed: '1 X',
      backList: [
        {
          value: 0,
          label: '10s'
        },
        {
          value: 1,
          label: '30s'
        },
        {
          value: 2,
          label: '60s'
        }
      ],
      curBack: '',
      showControls: false,
      showSpread: false,
      isREC: false,
      showSnapShotDialog: false,
      videoEl: '',
      canvasEl: '',
      showSnapshotBtn: false,

      showCutModel: false,
      penBtnSrc: require('../../static/img/edit_btn.png'),
      clearIconSrc: require('../../static/img/clear.png'),
      removeIconSrc: require('../../static/img/cancel.png'),
      startIcon: require('../../static/img/play_icon.png'),
      videoImgSrc: require('../../static/img/video_thumbnail.png'),
      checkImgSrc: '',
      showOuter: false,
      showPenBtn: false,
      penList: [
        {
          id: 'white',
          showContent: false
        },
        {
          id: 'red',
          showContent: true
        },
        {
          id: 'yellow',
          showContent: false
        }
      ],
      penChecked: 'red',
      showPen: false,
      X: 0,
      Y: 0,
      X1: 0,
      Y1: 0,
      isMouseDown: false,
      flag: 0,

      startTs: 0,
      protocal: 'DASH',
      channel: {},
      isPlayingFlag: -1,
      eventName: '',
      eventDes: '',
      imageCanvas: new Image(),
      imageCanvasList: [],
      timeDrap: false,
      curYearNum: 0,
      curMonthNum: 0,
      curDayNum: 0,
      percentage: 0,
      accountId: '',
      userId: '',
      timerPlayReal: null,
      realTimeSpeed: 0,
      cutDialogcurTime: 0,
      lang: this.$i18n.locale,
      realTimeStartTs: 0,
      isLoading: false,
      showEventNameInfo: false,
      eventNameRuletip: false,
      eventDesRuletip: false,

      showError: false,
      previewplayer: null,
      showSnapshotFeedbackDialog: false,

      uri: null,
      play: true,
      fullScreen: false,
      paused: true,
      muted: false,
      currentState: 'blank', // 'blank','loading','play','inline'
      error: '',
      streamProtocol: 'DASH',
      sessionId: null,
      userName: null,
      password: null,
      IVSID: null,
      channelId: null,
      realType: true,
      lastTime: null,
      currentTime: null,
      onEndflag: false,
      editCount: 0
    };
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.playBackState = false;
        self.currentTimeValue = 0;
        self.showError = false;
        self.channelInfo = null;
        self.stopVideoPlay();
        self.previewplayer && self.previewplayer.dispose();
      }
    },

    stopVideoTime(val) {
      const self = this;
      window.clearInterval(self.timerPlayReal);
      self.realTimeSpeed = 0;
      self.stopVideoTime = false;
      self.timerPlayReal = null;
      if (self.playState) {
        self.timerPlayReal = window.setInterval(() => {
          console.log(self.realTimeSpeed);
          self.realTimeSpeed = self.realTimeSpeed + 1;
          console.log(self.realTimeSpeed);
        }, 1000);
      }
    },

    realTimeSpeed(val) {
      console.log(val);
      if (val >= 300) {
        this.stopVideoPlay();
        this.stopTimer();
      }
    },

    async storeId(newValue, oldValue) {
      console.log(newValue);
      console.log(oldValue);
      if (newValue.length > 0) {
        // await self.getEzvizAccessToken(newValue);
      }
    }
  },

  async created() {
    window.addEventListener('resize', this.resizeFun, false);
    window.addEventListener('visibilitychange', this.visibilityChange, false);
    this.videoAuthority && this.getDashUrlInfo();
  },

  beforeDestroy() {
    window.clearInterval(this.timerPlayReal);
    this.realTimeSpeed = 0;
    this.stopVideoPlay();
    window.removeEventListener('resize', this.resizeFun);
    window.removeEventListener('visibilitychange', this.visibilityChange);
    this.resizeFun = null;
    this.visibilityChange = null;
  },

  computed: {
    graphBtnWidth: function() {
      return this.varyWindowHeight * 0.185;
    },

    btnFontSize: function() {
      return this.varyWindowHeight * 0.022;
    },

    percentHeight: function() {
      return this.varyWindowHeight / 758;
    },

    ...mapGetters({
      accountChanged: 'accountChanged'
    }),

    isEzviz() {
      const self = this;
      return self.$store.state.user.isEzviz;
    }
  },

  methods: {
    visibilityChange() {
      const self = this;
      if (document.hidden) {
        if (self.playState && !self.playBackState) {
          self.stopVideoPlay();
          self.stopTimer();
        }
      } else {
        if (!self.playBackState && this.currentState === 'loading') {
          self.startVideo(self.channelInfo.ivsId, self.channelInfo.channelId, null);
        }
      }
    },

    getDashUrlInfo() {
      return new Promise((resolve, reject) => {
        getDashServerInfo().then(result => {
          const apiport = result.data.url.indexOf('https') !== -1 ? result.data.httpsCmdPort : result.data.httpCmdPort;
          this.userName = result.data.loginId;
          this.password = result.data.password;
          const url = result.data.url + ':' + apiport + '/AdvStreamingService/';
          DashHttp.setDashHost(url);
          resolve();
        }).catch(error => {
          if (error.message !== 'Network request failed') {
            this.currentState = 'blank';
            this.errorText = error;
            this.showError = true;
          }
          reject(error);
        });
      });
    },

    async onPlay() {
      const paused = !this.paused;
      this.showError = false;
      this.errorText = '';
      if (this.realType === true) {
        if (paused) {
          await this.stopVideo();
          await this.disconnectVideo();
          await this.offline();
          this.paused = true;
        } else {
          if (this.channelInfo === null) {
            this.paused = true;
          } else {
            await this.startVideo(this.channelInfo.ivsId, this.channelInfo.channelId, null);
          }
        }
      } else {
        if (paused) {
          this.paused = true;
        } else {
          if (this.onEndflag) {
            this.startVideo(this.channelInfo.ivsId, this.channelInfo.channelId, this.lastTime);
          } else {
            this.paused = false;
          }
        }
      }
    },

    async startVideo(IVSID, channelId, startTs) {
      try {
        if (this.videoAuthority === false) {
          this.showError = true;
          this.errorText = this.$t('remotePatrol.videoLicense');
          return;
        }
        if (IVSID === null || channelId === null) {
          const error = this.$t('remotePatrol.dashServerError') + '5';
          this.currentState = 'blank';
          this.errorText = error;
          this.showError = true;
        } else {
          this.isLoading = true;
          this.showError = false;
          if (!this.userName) {
            await this.getDashUrlInfo();
          }
          if (!await this.stopVideoPlay()) {
            return;
          }
          if (!await this.online()) {
            return;
          }
          this.IVSID = IVSID;
          this.channelId = channelId.toString();
          const self = this;
          if (startTs) {
            if (await this.history(startTs)) {
              self.timeid = window.setInterval(function() {
                self.getProcess();
              }, 1000);
            }
          } else {
            if (await this.connectVideo()) {
              this.startTimer();
            }
          }
        }
      } catch (e) {
        if (e.message !== 'Network request failed') {
          this.currentState = 'blank';
          this.showError = true;
          this.errorText = e.message;
        }
      }
    },

    startTimer() {
      this.realTimeSpeed = 0;
      this.isLoading = false;
      this.timerPlayReal = window.setInterval(() => {
        console.log(this.realTimeSpeed);
        this.realTimeSpeed = this.realTimeSpeed + 1;
      }, 1000);
    },

    stopTimer() {
      window.clearInterval(this.timerPlayReal);
      this.realTimeSpeed = 0;
    },

    async stopVideoPlay() {
      if (this.sessionId) {
        const state = this.currentState;
        this.currentState = 'loading';
        if (state === 'play') {
          this.stopVideo();
          await this.disconnectVideo();
        }
        this.paused = true;
        return await this.offline();
      } else {
        this.paused = true;
        return true;
      }
    },

    async online() {
      const data = {};
      const request = {};
      request.username = this.userName;
      request.password = this.password;
      data.request = request;
      this.currentState = 'loading';
      if (await DashHttp.putDash('Authority/Online', data)) {
        this.sessionId = DashHttp.getResult().SessionID;
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
        }
        this.currentState = 'blank';
        this.errorText = error;
        this.showError = true;
        return false;
      }
    },

    async offline() {
      if (this.sessionId != null) {
        const data = {};
        const request = {};
        request.sessionID = this.sessionId;
        data.request = request;
        if (await DashHttp.putDash('Authority/Offline', data)) {
          this.sessionId = null;
          return true;
        } else {
          if (DashHttp.getResult() != null) {
            const errorCode = DashHttp.getResult().ErrorCode;
            if (errorCode === 3) {
              this.sessionId = null;
              return true;
            } else {
              const error = this.$t('remotePatrol.dashServerError') + errorCode;
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    },

    async connectVideo() {
      console.log('Connect Video--');
      const data = {};
      const request = {};
      request.method = 'connection';
      request.sessionID = this.sessionId;
      request.streamingProtocol = this.streamProtocol;
      request.withAudio = true;
      request.streamType = 'SubStream';
      request.IVSID = this.IVSID;
      request.channel = this.channelId;
      data.request = request;
      this.realType = true;
      if (await DashHttp.putDash('LiveStream', data)) {
        const url = DashHttp.getResult().mpd;
        this.uri = url;
        console.log(this.uri);
        this.playVideo(url);
        this.currentState = 'play';
        this.paused = false;
        this.errorText = '';
        this.isLoading = false;
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
        }
        this.currentState = 'blank';
        this.errorText = error;
        this.showError = true;
        this.isLoading = false;
        this.destroyVideo();
        return false;
      }
    },

    async history(startTs) {
      const data = {};
      const request = {};
      request.method = 'connection';
      request.sessionID = this.sessionId;
      request.streamingProtocol = this.streamProtocol;
      request.withAudio = true;
      request.transcodeResolution = 'D1';
      request.IVSID = this.IVSID;
      request.channel = this.channelId;
      request.beginTime = startTs.toString();
      request.endTime = (startTs + 300).toString();

      data.request = request;
      this.realType = false;
      if (await DashHttp.putDash('PlaybackStream', data)) {
        const url = DashHttp.getResult().mpd;
        this.playVideo(url);
        this.currentState = 'play';
        this.paused = false;
        this.errorText = '';
        this.onEndflag = false;
        this.lastTime = startTs + 300;
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
        }
        this.isLoading = false;
        this.showError = true;
        this.currentState = 'blank';
        this.paused = true;
        this.errorText = error;
        this.destroyVideo();
        return false;
      }
    },

    async disconnectVideo() {
      if (this.sessionId != null) {
        const data = {};
        const request = {};
        request.method = 'disconnection';
        request.sessionID = this.sessionId;
        request.IVSID = this.IVSID;
        request.channel = this.channelId;
        request.streamType = 'SubStream';
        data.request = request;
        const url = this.realType ? 'LiveStream' : 'PlaybackStream';
        if (await DashHttp.putDash(url, data)) {
          return true;
        } else {
          if (DashHttp.getResult() != null) {
            const errorCode = DashHttp.getResult().ErrorCode;
            if (errorCode === 3) {
              return true;
            } else {
              if (errorCode !== 24) {
                const error = this.$t('remotePatrol.dashServerError') + errorCode;
              }
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    },

    async playVideo(url) {
      const self = this;
      self.playState = true;
      const video = document.getElementById('dashVideo');
      this.previewplayer = videojs(video, { playbackRates: [0.5, 1, 1.5, 2] });
      this.previewplayer.src({
        src: url,
        type: this.protocal === 'HLS' ? 'application/x-mpegURL' : 'application/dash+xml'
      });
      this.previewplayer.play();
    },

    stopVideo() {
      const self = this;
      console.log('stop video');
      self.showSnapshotBtn = false;
      self.playState = false;
      self.showError = false;
      var video = document.getElementById('dashVideo');
      if (video !== null) {
        self.previewplayer = videojs(video);
        self.previewplayer.pause();
      }
      self.stopTimer();
    },

    destroyVideo() {
      const self = this;
      var video = document.getElementById('dashVideo');
      this.previewplayer = videojs(video);
      self.previewplayer.dispose();
    },

    onPlayerWaiting(e) {
      this.showSnapshotBtn = false;
      this.isLoading = false;
    },

    onPlayerPlaying(e) {
      this.showSnapshotBtn = true;
      this.isLoading = false;
    },

    controlScreen() {
      const self = this;
      if (!self.fullScreen) {
        self.fullWindowScreen();
        self.fullScreen = true;
      } else {
        self.exitFullscreen();
        self.fullScreen = false;
      }
    },

    fullWindowScreen(...val) {
      console.log(val);
      var ele = document.getElementById('videoContent');
      ele.style.width = '100%';
      ele.style.height = '100%';
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    },

    exitFullscreen() {
      var de = document;
      var ele = document.getElementById('videoContent');
      ele.style.width = 'auto';
      ele.style.height = 'auto';
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
    },

    gonggeScreen() {
      const self = this;
      self.showgongge = true;
    },

    cutPicture(...val) {
      const self = this;
      self.imageCanvasList = [];
      self.videoEl = document.getElementById('dashVideo').children[0];
      if (self.showFeedBack) {
        self.showSnapshotFeedbackDialog = true;
        self.eventName = '';
        self.eventDes = '';
        self.showEventNameInfo = false;
        this.$nextTick(() => {
          self.canvasEl = document.getElementById('icanvas');
          var ctx = self.canvasEl.getContext('2d');
          ctx.drawImage(self.videoEl, 0, 0, 520 * self.percentHeight, 340 * self.percentHeight);
          var oGrayImg = icanvas.toDataURL('image/jpeg');
          self.imageCanvas.src = oGrayImg;
          const imgObj = new Image();
          imgObj.src = oGrayImg;
          self.imageCanvasList.push(imgObj);
        });
      } else {
        self.showCancelContent = false;
        if (self.sourceListLength >= 10) {
          util.notify(self.$t('remotePatrol.storeMaxAttach'), 'warning', 3000);
          return false;
        }
        if (self.fullScreen) {
          self.exitFullscreen();
          self.fullScreen = false;
        }
        self.showSnapShotDialog = true;
        this.$nextTick(() => {
          if (self.isHistory) {
            self.stopVideoPlay();
            const video = document.getElementById('dashVideo');
            self.cutDialogcurTime = video.player.currentTime();
          }
          self.canvasEl = document.getElementById('icanvas');
          const ctx = self.canvasEl.getContext('2d');
          ctx.drawImage(
            self.videoEl,
            0,
            0,
            767 * self.percentHeight,
            431 * self.percentHeight
          );
          const oGrayImg = self.canvasEl.toDataURL('image/jpeg');
          self.imageCanvas.src = oGrayImg;
          const imgObj = new Image();
          imgObj.src = oGrayImg;
          self.imageCanvasList.push(imgObj);
        });
      }
    },

    adjustSpeed(val) {
      const video = document.getElementById('dashVideo');
      switch (val) {
        case 0:
          video.player.playbackRate(0.25);
          break;
        case 1:
          video.player.playbackRate(0.5);
          break;
        case 2:
          video.player.playbackRate(1);
          break;
        case 3:
          video.player.playbackRate(2);
          break;
        case 4:
          video.player.playbackRate(4);
          break;
      }
      video.playbackRate = val;
    },

    async adjustProcess(val, label) {
      const self = this;
      self.curBack = label;
      const video = document.getElementById('dashVideo');
      const curTime = video.player.currentTime();
      switch (val) {
        case 0: {
          self.realTimeStartTs = self.realTimeStartTs - 10;
          if (curTime > 10) {
            video.player.currentTime(curTime - 10);
          } else {
            self.startVideo(self.channel.ivsId, self.channel.channelId, self.realTimeStartTs);
          }
          break;
        }
        case 1: {
          self.realTimeStartTs = self.realTimeStartTs - 30;
          if (curTime > 30) {
            video.player.currentTime(curTime - 30);
          } else {
            self.startVideo(self.channel.ivsId, self.channel.channelId, self.realTimeStartTs);
          }
          break;
        }
        case 2:
        {
          self.realTimeStartTs = self.realTimeStartTs - 60;
          if (curTime > 60) {
            video.player.currentTime(curTime - 60);
          } else {
            self.startVideo(self.channel.ivsId, self.channel.channelId, self.realTimeStartTs);
          }
          break;
        }
        default: {
          break;
        }
      }
    },

    async getProcess() {
      const self = this;
      const video = document.getElementById('dashVideo');
      const curTime = video.player.currentTime();
      const duration = 300;
      self.durationTimeValue = duration;
      self.currentTimeValue = curTime;
      self.realTimeStartTs++;
      const getTimeStr = function(val) {
        let hour = 0;
        let minute = 0;
        let second = 0;
        hour = parseInt(val / 3600);
        minute =
          parseInt((val - hour * 60) / 60) < 10
            ? '0' + parseInt((val - hour * 60) / 60)
            : parseInt((val - hour * 60) / 60);
        second =
          parseInt(val % 60) < 10
            ? '0' + parseInt(val % 60)
            : parseInt(val % 60);
        return hour + ':' + minute + ':' + second;
      };
      self.currentStr = getTimeStr(curTime);
      self.durationStr = getTimeStr(duration);
      if (curTime >= duration) {
        self.stopVideoPlay();
        window.clearInterval(self.timeid);
        self.timeid = null;
        self.timeid = 0;
      }
    },

    playHistoryVideo(startTs) {
      console.log(startTs);
      this.startTs = startTs;
      this.startVideo(this.channelInfo.ivsId, this.channelInfo.channelId, this.startTs);
      this.realTimeStartTs = this.startTs;
    },

    showPenList() {
      const self = this;
      self.showPen = !self.showPen;
      self.showCancelContent = false;
    },

    checkPen(item, index) {
      const self = this;
      item.showContent = true;
      self.showCancelContent = false;
      self.penList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.showContent = false;
        }
      });
      self.penChecked = item.id;
    },

    mouseDownAction(e) {
      const self = this;
      self.isMouseDown = true;
      self.X = e.offsetX;
      self.Y = e.offsetY;
      self.showPenBtn = false;
      self.showCancelContent = false;
    },

    mouseMoveAction(e) {
      const self = this;
      if (self.isMouseDown) {
        self.X1 = e.offsetX;
        self.Y1 = e.offsetY;
        self.showPenBtn = false;
        self.drawLine(self.X, self.Y, self.X1, self.Y1);
        self.flag++;
      }
    },

    mouseUpAction(e) {
      const self = this;
      self.isMouseDown = false;
      // self.showCutModel=true;
      self.showPenBtn = true;
      self.showCancelContent = true;

      if (self.flag !== 0 && self.canvasEl !== '') {
        const imgObj = new Image();
        imgObj.src = self.canvasEl.toDataURL('image/jpeg');
        self.imageCanvasList.push(imgObj);
      }
      self.flag = 0;
      if (e.target.className === 'el-time-panel__btn confirm') {
        self.changeDate();
      }
    },

    mouseLeaveAction(e) {
      const self = this;
      self.isMouseDown = false;
    },

    mouseUpHandler(e) {
      const self = this;
      self.isMouseDown = false;
      self.showCutModel = true;
      self.showPenBtn = true;
      self.showCancelContent = true;
      if (self.flag !== 0 && self.canvasEl !== '') {
        const imgObj = new Image();
        imgObj.src = self.canvasEl.toDataURL('image/jpeg');
        self.imageCanvasList.push(imgObj);
      }
      self.flag = 0;
    },

    eventNameChanged(val) {
      const self = this;
      const content = filterString.all(val, 50);
      console.log(content);
      self.eventName = content;
      self.showEventNameInfo = false;
      const length = filterString.getContentLength(val);
      if (length > 50) {
        this.eventNameRuletip = true;
      } else {
        this.eventNameRuletip = false;
      }
    },

    eventDesChanged(val) {
      const self = this;
      const content = filterString.all(val, 200);
      console.log(content);
      self.eventDes = content;
      const length = filterString.getContentLength(val);
      if (length > 200) {
        this.eventDesRuletip = true;
      } else {
        this.eventDesRuletip = false;
      }
    },

    notShowInputRuleTips(e) {
      if (e === 'eventName') {
        this.eventNameRuletip = false;
      } else if (e === 'eventDes') {
        this.eventDesRuletip = false;
      }
    },

    showCancel() {
      const self = this;
      self.showCancelContent = true;
      self.showPenBtn = true;
    },

    hiddenCancel() {
      const self = this;
      self.showCancelContent = false;
      self.showPenBtn = false;
    },

    cancelEditCanvas() {
      const self = this;
      self.showCancelContent = false;
      self.canvasEl = document.getElementById('icanvas');
      const ctx = self.canvasEl.getContext('2d');
      ctx.clearRect(0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
      ctx.drawImage(
        self.imageCanvas,
        0,
        0,
        767 * self.percentHeight,
        431 * self.percentHeight
      );
      self.imageCanvasList = [];
    },

    confirmEditCanvas() {
      const self = this;
      self.showCancelContent = false;
      self.imageCanvasList.pop();
      self.canvasEl = document.getElementById('icanvas');
      const ctx = self.canvasEl.getContext('2d');
      ctx.clearRect(0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
      if (self.imageCanvasList.length === 0) {
        ctx.drawImage(
          self.imageCanvas,
          0,
          0,
          767 * self.percentHeight,
          431 * self.percentHeight
        );
      } else {
        ctx.drawImage(
          self.imageCanvasList[self.imageCanvasList.length - 1],
          0,
          0,
          767 * self.percentHeight,
          431 * self.percentHeight
        );
      }
    },

    drawLine(x, y, x1, y1) {
      const self = this;
      const ctx = self.canvasEl.getContext('2d');
      if (self.flag) {
        ctx.beginPath();
      }
      ctx.moveTo(x, y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = self.penChecked;
      ctx.lineTo(x1, y1);
      ctx.stroke();
      if (self.flag !== 0) {
        self.X = self.X1;
        self.Y = self.Y1;
      }
    },

    cancelEdit() {
      const self = this;
      self.showSnapShotDialog = false;
    },

    confirmEdit() {
      const self = this;
      self.showSnapShotDialog = false;
      const src = self.canvasEl.toDataURL('image/jpeg');
      self.$emit('confirmEzvizCanvas', src);
    },

    handleEmitCanvas(src) {
      this.$emit('confirmEzvizCanvas', src);
    },

    confirmFeedBackOnSnapshot() {
      const self = this;
      const src = self.canvasEl.toDataURL('image/jpeg');
      const obj = {
        eventName: self.eventName,
        eventDes: self.eventDes,
        src: src
      };
      if (self.eventName.trim().length === 0) {
        self.showEventNameInfo = true;
        return false;
      }
      self.$emit('ezvizCutPictureFeedback', obj);
      self.showSnapshotFeedbackDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
  .errorVideo-model{
    margin: calc(25/1920*100vw);
    margin-bottom: 0;
    height: 100%;
    position: relative;
    min-height: 420px;
    background-color: #232730;
    color: $red;
    z-index: 9;
    span{
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 12px;
      transform: translate(-50%, -50%);
    }
  }
  .dash-video{
    height: 100%;
    width: 100%;
  }
  .event-error{
    @include point(margin-bottom,20);
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
  .video-model{
    height: 100%;
    width: 100%;
    background-color: transparent ;
    position: absolute;
    z-index: 900;
    text-align: left;
  }
  .video-content{
    height: 420px !important;
    position: relative;
    margin:calc(25/1920*100vw);
    min-height: 420px;
    background-color: #000;
    z-index: 100;
    .getvideo-content{
      position: absolute;
      z-index: 930;
      width: 100%;
      height: 100%;
      background-color: #000;
      background-color: transparent;
      .btn-graph {
        position: absolute;
        left: 45%;
        top: 45%;
        display:flex;
        display:-webkit-flex;
        justify-content: center;
        align-items: center;
      }
      #btn-graph-canvas {
        width: 100px;
        height: 100px;
      }
    }
    @media screen and(max-width: 1366px){
      #channelName{
        font-size: 12px;
      }
      .iconright{
        span{
          font-size:12px;
        }
      }
      .en-iconright{
        span{
          font-size:12px;
        }
      }
      .iconright1{
        span{
          font-size:12px;
        }
      }
      .en-iconright1{
        span{
          font-size:12px;
        }
      }
    }
    @media screen and(min-width: 1366px){
      #channelName{
        font-size: 16px;
      }
      .iconright{
        span{
          font-size:14px;
        }
      }
      .en-iconright{
        span{
          font-size:14px;
        }
      }
      .iconright1{
        span{
          font-size:14px;
        }
      }
      .en-iconright1{
        span{
          font-size:14px;
        }
      }
    }
    #myPlayer{
      min-height: 420px;
      margin: auto;
    }
    #channelName{
      position: absolute;
      color: #fff;
      z-index: 10;
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
      height: 46px;
      line-height: 46px;
      position: absolute;
      bottom: 0px;
      color: #fff;
      /*overflow: hidden;*/
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
        .icon-auido{
          font-size: 18px;
          cursor: pointer;
          float: left;
        }
      }
      .footer-right{
        float:right;
      }
      .iconrside{
        float: right;
        display: inline-block;
        margin-right: 20px;
        span{
          font-size: 13px;
          margin-right:6px;
          margin-left: 20px;
          // margin-left: 20px;
        }
        .speed-content{
          height: 46px;
          bottom: 3px;
          position: relative;
          display: inline-block;
          .el-test{
            width: 85px;
          }
        }
      }
    }
    .screen-content{
      display: inline-block;
      margin-left: 30px;
      .iconscreen{
        margin-right: 20px;
        font-size: 18px;
        // position: relative;
        cursor: pointer;
      }
    }
    .iconright{
      padding: 0 6px;
      width: 80px;
      height: 32px;
      line-height: 30px;
      position: absolute;
      z-index: 900;
      right: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      //top: 40%;
      top: 45%;
      text-align: center;
      span{
        // font-size: 12px;
        margin-left: 12px;
        color: #fff;
        /*margin-right: 35px;*/
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
    }
    .en-iconright{
      padding: 0 6px;
      width: 108px;
      height: 32px;
      line-height: 30px;
      position: absolute;
      z-index: 900;
      right: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      //top: 40%;
      top: 45%;
      text-align: center;
      span{
        // font-size: 12px;
        margin-left: 12px;
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
    }
    .iconright1{
      padding: 0 6px;
      width: 80px;
      height: 32px;
      line-height: 30px;
      position: absolute;
      z-index: 900;
      right: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      top: 56%;
      text-align: center;
      span{
        margin-left: 12px;
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
    }
    .en-iconright1{
      padding: 0 6px;
      width: 108px;
      height: 32px;
      line-height: 30px;
      position: absolute;
      z-index: 900;
      right: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      top: 56%;
      text-align: center;
      span{
        margin-left: 12px;
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
      }
    }
  }
  .progress-content{
    position: absolute;
    bottom: 0px;
    width: 100%;
    z-index: 999;
    .el-prog{
      float: left;
      width: 100%;
      .progress-bar{
        background-color: $red;
        height: 100% !important;
      }
    }
    .currentTime{
      font-size: 12px;
      color: #fff;
      float: left;
      margin-left: 30px;
      position: relative;
      bottom: 0.3rem;
      margin-right: 10px;
    }
    .duration{
      font-size: 12px;
      color: #fff;
      position: relative;
      bottom: 0.5rem;
      margin-left: 15px;
    }
  }
  .canvas-content{
    position: relative;
    .rules{
      margin-left: 20px;
      font-size: 10px;
      margin-top: 5px;
      color: #ff2400;
      display: block;
    }
    .dialog-hr{
      border: 0.5px solid ;
      border-color: #dfe2e9;
      margin-bottom:0px;
      position: relative;
      bottom: 5px;
    }
    #icanvas{
      @include point(margin-top,15);
    }
    .dialog-img-content{
      @include point(padding,15);
    }
    .dialog-event-content{
      text-align: left;
      @include point(margin-bottom,20);
      .event-title{
        color: $black;
        display: block;
        margin: 15px;
        @include point(margin-left,20);
        font-size: 14px;
      }
      .name-input{
        @include point(width,150);
        @include point(margin-left,20);
      }
      .des-input{
        width: 90%;
        @include point(margin-left,20);
      }
    }
    .feed-canvas-content{
      width: 65%;
      float: left;
      position: relative;
      text-align: left;
      margin-left: 1%;
      #icanvas{
        margin-left: 20px;
      }
      .cancel-content{
        margin-left: 20px !important;
        height:30px;
        line-height: 30px;
      }
    }
    .event-content{
      width:33%;
      float: left;
      text-align: left;
      margin-left: 1%;
      .event-title{
        color: $black;
        display: block;
        margin: 15px;
        margin-left: 0;
        font-size: 14px;
      }
      .is-required{
        color: $red;
      }
      .error-class{
        font-size: 10px;
        margin-top: 5px;
        color: #ff2400;
        display: block;
      }
      .name-input{
        width: 80%;
        //@include point(width,150);
        //@include point(margin-bottom,15);
      }
      .des-input{
        width: 80%;
      }
    }
    #previewCutVideo{
      @include point(margin-bottom,20);
      @include point(margin-top,10);
    }
    .cancel-content{
      position: absolute;
      bottom: 2px;
      @include point(height,30);
      @include point(line-height,30);
      background-color: rgba($color: $black, $alpha: 0.5);
      z-index: 10;
      overflow: hidden;
      .content{
        text-align: center;
        float: left;
        color: #fff;
        cursor: pointer;
        width: 49%;
        &:first-child{
          border-right: 1px solid #fff;
        }
        .icon-clear{
          position: relative;
          @include point(top,3);
          margin-right: 15px;
        }
        @media screen and(max-width: 1366px){
          span{
            position: relative;
            @include point(bottom, 4)
          }
        }

      }
    }
    .icon-right{
      width: 120px;
      height: auto;
      position: absolute;
      right: 30px;
      top: 5%;
      text-align: center;
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
          left: 34%;
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
          left: 34%;
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
</style>
<style>
  .select-popClass .el-select-dropdown__item{
    font-size:12px;
    height: 24px;
    line-height: 24px;
    background-color: #34374A;
    color:#fff;
    text-align:center;
  }
  .select-popClass .el-select-dropdown__item.hover{
    color:#f31d65 !important;
    background-color:#34374A !important;
  }
  .select-popClass .el-select-dropdown__item:hover{
    color:#f31d65 !important;
    background-color:#34374A !important;
  }
  .select-popClass .el-select-dropdown{
    border:0px !important;
    background-color:#34374A !important;
  }
  .select-popClass .el-select-dropdown__item.selected{
    color:#fff;
    font-weight:500 !important;
  }
  .select-popClass .el-select-dropdown__list{
    padding:0;
  }
  .el-select-dropdown.el-popper.select-popClass{
    border:0px;
    margin-top:-5px;
  }
  .select-popClass.el-popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color:#34374A !important;
  }
  .select-popClass.el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:#34374A !important;
  }
  .prog .progress-bar{
    background-color: #FB4C5D;
    height: 100%;
  }
  #videoContent .el-loading-mask{
    z-index: 900
  }
</style>

