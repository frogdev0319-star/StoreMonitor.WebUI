<template>
  <div>
    <div
      v-loading="isLoading"
      id="videoContent"
      :style="isEvent ? {}: {'margin-bottom': 0}"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="video-content">
      <span v-if="channelInfo != null" id="channelName">{{ channelInfo != null ? channelInfo.channelName : '' }}</span>
      <div v-if="channelInfo != null" class="icon-footer" >
        <div class="iconlside">
          <i :class="paused ? 'icon-bofang1' : 'icon-zantingtingzhi'" class= "iconfont iconplay" @click="onPlay"/>
        </div>
        <div class="iconlside">
          <i :class="muted ? 'icon-jingyin' : 'icon-shengyin1'" class= "iconfont icon-auido" @click="onMuted"/>
        </div>
        <div class="iconrside">
          <div v-if="!realType" class="speed-content">
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
      <div v-show="currentTime > 0" class="progress-content">
        <b-progress
          id="bprogress"
          :value="currentTime"
          :max="videoDuration"
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
      <div v-if="showError" :class="isEvent ? 'event-error': ''" class="errorVideo-model">
        <span>{{ errorText }}</span>
      </div>
      <template v-else>
        <video id="skywatchVideo"
               :controls="showControls"
               :paused="paused"
               :muted = "muted"
               ref="skywatchVideo"
               height="100%"
               width="90%"
               autoplay
               v-if="realType"
               @waiting="onPlayerWaiting($event)"
               @playing="onPlayerPlaying($event)"
               @error="onPlayerError($event)"/>

        <video id="skywatchVideo"
               :controls="showControls"
               :paused="paused"
               :muted = "muted"
               crossorigin="anonymous"
               ref="skywatchVideo"
               height="100%"
               width="90%"
               autoplay
               v-else="!realType"
               @waiting="onPlayerWaiting($event)"
               @playing="onPlayerPlaying($event)"
               @canplay="onPlayerCanPlay()"
               @timeupdate="onPlayerTimeUpdate"
               @ended="onPlayerEnd"
               @error="onPlayerError($event)"
        >
          <source :src="url" id="vsrc" type="video/mp4"/>
        </video>
      </template>
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
  import { skywatchRESTful } from '@/api/index';
  import flvjs from "flv.js";
  import util from '@/common/util';
  import { mapGetters } from 'vuex';

  export default {
    name: 'SkywatchVideo',
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
      playBack: {
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
        varyWindowHeight: window.innerHeight,
        varyWindowWidth: window.innerWidth,

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
        accountId: '',
        userId: '',
        timeId: null,
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
        muted: true,
        IVSID: null,
        channelId: null,
        onEndflag: false,
        editCount: 0,

        player: null,
        realType: true,
        apiKey: '',
        recordList: [],
        url: '',
        videoDuration: 0,
        currentTime: 0,
        lastTime: 0
      };
    },

    watch: {
      accountChanged(val) {
        if (val !== 0) {
          this.currentTime = 0;
          this.showError = false;
          this.channelInfo = null;
          this.stopVideoPlay();
        }
      },

      realTimeSpeed(val) {
        if (val >= 300) {
          this.paused = true;
          this.stopRealStream();
        }
      }

    },

    computed: {
      realType(){
        return !this.isHistory
      },
      playState(){
        return !this.paused
      }
    },

    async created() {
      window.addEventListener('resize', this.resizeFun, false);
      window.addEventListener('visibilitychange', this.visibilityChange, false);
    },

    beforeDestroy() {
      window.clearInterval(this.timeId);
      this.realTimeSpeed = 0;
      this.destoryRealStream();
      this.stopHistory();
      window.removeEventListener('resize', this.resizeFun);
      window.removeEventListener('visibilitychange', this.visibilityChange);
      this.resizeFun = null;
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
      ivsId(){
        return this.channelInfo.ivsId
      },

      ...mapGetters({
        accountChanged: 'accountChanged'
      }),
    },

    methods: {
      async getToken(startTs){
        try {
          this.isLoading = true;
          const result = await skywatchRESTful.getSkywatchApiKey({"ivsId": this.ivsId});
          this.apiKey = result.data.apiKey;
          result.errCode === 0 && this.getVideoStream(startTs);
        } catch (e) {
          this.apiKey = '';
          this.showError = true;
          this.errorText = util.setErrorMsg(e.message, false);
          console.log('skywatchPlayer- getToken:' + e.message);
        }
      },

      getVideoStream(startTs){
        this.realType ? this.getRealStream() : this.getHistoryStream(startTs);
        this.editCount ++;
      },

      getHistoryStream(startTs){
        this.getRecordList(startTs);
      },

      getRealStream(){
        const url = `https://service.skywatch24.com/api/v2/devices/${this.ivsId}/flvstream`;
        skywatchRESTful.getLiveStream({ api_key: this.apiKey }, url).then(res => {
          this.url = res;
          this.playLiveVideo();
        }).catch(e => {
          this.setErrorMsg();
        })
      },


      getRecordList(startTs){
        const startTime = startTs;
        const endTime = startTs + 1000;
        const url = `https://service.skywatch24.com/tw/api/v2/devices/${this.ivsId}/archives`;
        const params = {
          scope: 'CloudArchives',
          start_time: startTime,
          end_time: endTime,
          api_key: this.apiKey
        };
        skywatchRESTful.getRecordList(params, url).then(res => {
          this.recordList = res.archives.map(archive => archive.id);
          this.getHistoryUrl();
        }).catch(e => {
          this.setErrorMsg();
          console.log('SkywatchVideo getRecordList:' + e);
        })
      },

      getHistoryUrl(){
        if (this.recordList.length === 0 ) {
          this.isLoading = false;
          this.showError = true;
          this.paused = true;
          this.showSnapshotBtn = false;
          this.errorText = this.$t('remotePatrol.noVideoSource');
          return;
        }
        this.generateUrlOnRecordId();
      },

      generateUrlOnRecordId(){
        if (this.recordList.length === 0 ) {
          this.isLoading = false;
          this.showError = true;
          this.onEndflag = true;
          return;
        }
        const url = `https://service.skywatch24.com/tw/api/v2/devices/46521/archives/link`;
        const recordId = this.recordList.shift();
        this.lastTime = parseInt(recordId.split('-')[1]);
        const params = {
          scope: 'CloudArchives',
          archive_id: recordId,
          media_type: 'mp4',
          region: 'gcs-asia',
          smart_ff: '0',
          avi: 0,
          from: 'skywatch',
          api_key: this.apiKey
        }
        skywatchRESTful.getRecordUrl(params, url).then(res => {
          this.url = res;
          document.getElementById('skywatchVideo').load();
          document.getElementById('skywatchVideo').play();
          this.videoEl = document.getElementById('skywatchVideo');
        })
      },

      setErrorMsg(){
        this.paused = true;
        this.isLoading = false;
        this.showError = true;
        this.errorText = this.$t('remotePatrol.errorConnection');
      },
      destoryRealStream(){
        if(this.player){
          this.player.pause();
          this.player.unload();
          this.player.detachMediaElement();
          this.player.destroy();
          this.player = null;
        }
      },


      stopRealStream(){
        this.showSnapshotBtn = false;
        this.isLoading = false;
        this.player && this.player.pause();
        this.stopTimer();
      },

      playRealStream(){
        !this.player && this.getToken(null);
        if(this.player){
          this.player.play();
          this.startTimer();
        }
      },

      stopHistory(){
        this.videoEl && this.videoEl.pause();
        this.stopTimer();
      },

      playHistory(){
        this.getHistoryStream(this.lastTime);
      },

      visibilityChange() {
        if (document.hidden) {
          if (!this.paused) {
            this.realType ? this.stopRealStream() : this.stopHistory();
          }
        } else {
          this.realType && !this.paused && this.playRealStream();
          !this.realType && !this.paused && !this.onEndflag && this.playHistory();
        }
      },

      async onPlay() {
        const paused = !this.paused;
        this.showError = false;
        this.errorText = '';
        this.paused = paused;
        if (this.realType === true) {
          if (paused) {
            this.stopRealStream();
          } else {
            this.playRealStream();
          }
        } else {
          if (paused) {
            this.stopHistory();
          } else {
            if (this.onEndflag) {
              this.startVideo(this.channelInfo.ivsId, this.channelInfo.channelId, this.lastTime);
            } else {
              this.playHistory();
            }
          }
        }
      },

      onMuted(){
        this.muted = !this.muted;
      },

      async startVideo(IVSID, channelId, startTs) {
        try {
          if (this.videoAuthority === false) {
            this.showError = true;
            this.errorText = this.$t('remotePatrol.videoLicense');
            return;
          }
          if (IVSID === null || channelId === null) {
            const error = this.$t('remotePatrol.lackParams');
            this.errorText = error;
            this.showError = true;
          } else {
            this.isLoading = true;
            this.showError = false;
            this.IVSID = IVSID;
            this.channelId = channelId;
            this.stopVideo();
            this.getToken(startTs);
          }
        } catch (e) {
          if (e.message !== 'Network request failed') {
            this.showError = true;
            this.errorText = e.message;
          }
        }
      },

      stopVideo(){
        this.destoryRealStream();
        this.stopHistory();
      },

      startTimer() {
        this.realTimeSpeed = 0;
        this.isLoading = false;
        this.timeId = window.setInterval(() => {
          this.realTimeSpeed = this.realTimeSpeed + 1;
        }, 1000);
      },

      stopTimer() {
        window.clearInterval(this.timeId);
        this.realTimeSpeed = 0;
      },

      playLiveVideo() {
        if (flvjs.isSupported()) {
          let video = this.$refs.skywatchVideo;
          if (video) {
            this.player = flvjs.createPlayer({
              type: "flv",
              isLive: true,
              url: this.url
            });
            this.player.attachMediaElement(video);
            try {
              this.player.load();
              this.player.play();
              this.paused = false;
              this.startTimer();
              this.videoEl = document.getElementById('skywatchVideo');
            } catch (error) {
              this.paused = true;
            };
            this.isLoading = false;
          }
        }
      },

      onPlayerWaiting(e) {
        this.showSnapshotBtn = false;
        this.isLoading = true;
        this.paused = true;
      },

      onPlayerPlaying(e) {
        this.showSnapshotBtn = true;
        this.isLoading = false;
        this.paused = false;
      },

      onPlayerError(e){
        console.log(e);
      },

      onPlayerCanPlay(e){
        this.videoDuration = Math.ceil(this.videoEl.duration);
      },

      onPlayerTimeUpdate(){
        this.currentTime = Math.ceil(this.videoEl.currentTime);
        this.lastTime += parseInt(this.currentTime);
      },

      onPlayerEnd(){
        this.generateUrlOnRecordId();
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

      cutPicture() {
        const self = this;
        self.imageCanvasList = [];
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
            imgObj.setAttribute('crossOrigin', 'anonymous');
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
            }
            self.canvasEl = document.getElementById('icanvas');
            const ctx = self.canvasEl.getContext('2d');
            ctx.drawImage(self.videoEl, 0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
            const oGrayImg = icanvas.toDataURL('image/jpeg');
            self.imageCanvas.src = oGrayImg;
            const imgObj = new Image();
            imgObj.src = oGrayImg;
            self.imageCanvasList.push(imgObj);
          });
        }
      },

      stopVideoPlay(){
        this.paused = true;
        this.isLoading = false;
        if (this.realType){
          this.stopRealStream();
          this.destoryRealStream();
        } else {
          this.stopHistory();
        }
      },

      changeHistoryTime(startTime){
        this.realType = !startTime;
        this.playHistoryVideo(startTime);
      },

      adjustSpeed(val) {
        const video = document.getElementById('skywatchVideo');
        switch (val) {
          case 0:
            video.playbackRate = 0.25;
            break;
          case 1:
            video.playbackRate = 0.5;
            break;
          case 2:
            video.playbackRate = 1;
            break;
          case 3:
            video.playbackRate = 2;
            break;
          case 4:
            video.playbackRate = 4;
            break;
        }
      },

      async adjustProcess(val, label) {
        this.curBack = label;
        switch (val) {
          case 0: {
            this.lastTime = this.lastTime - 10;
            if (this.currentTime > 10) {
              this.videoEl.currentTime = this.currentTime - 10;
            } else {
              this.startVideo(this.channel.ivsId, this.channel.channelId, this.lastTime);
            }
            break;
          }
          case 1: {
            this.lastTime = this.lastTime - 30;
            if (this.currentTime > 30) {
              this.videoEl.currentTime = this.currentTime - 30;
            } else {
              this.startVideo(this.channel.ivsId, this.channel.channelId, this.lastTime);
            }
            break;
          }
          case 2:
          {
            this.lastTime = this.lastTime - 60;
            if (this.currentTime > 60) {
              this.videoEl.currentTime = this.currentTime - 60;
            } else {
              this.startVideo(this.channel.ivsId, this.channel.channelId, this.lastTime);
            }
            break;
          }
          default: {
            break;
          }
        }
      },

      playHistoryVideo(startTs) {
        this.startTs = startTs;
        this.startVideo(this.channelInfo.ivsId, this.channelInfo.channelId, startTs);
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
    // margin:calc(25/1920*100vw);
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


