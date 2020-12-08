<template>
  <div >
    <div v-if="showError" ref="errorModel" :class="isEvent ? 'event-error': ''" class="errorVideo-model">
      <span>{{ errorMsg }}</span>
    </div>
    <div v-else>
      <div
        v-loading="isLoading"
        v-if="!fullWindow"
        id="videoContent"
        ref="videoContent"
        :style="isEvent ? {}: {'margin-bottom': 0}"
        class="video-content"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @mouseleave="hiddenModel"
        @mouseenter="showModel"
        @mousemove="showModel">
        <span v-if="showInfoContent && channelInfo" id="channelName">{{ channelInfo.channelName }}</span>
        <div v-if="showInfoContent || playBackState" class="icon-footer">
          <div class="iconlside">
            <i v-if="playState" class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime"/>
            <i v-else class="iconfont icon-bofang1 iconplay" @click="realTime"/>
          </div>
          <div class="iconlside">
            <i v-if="ifOpenSound" class="iconfont icon-auido icon-shengyin1" @click="closeSound"/>
            <i v-else class="iconfont icon-auido icon-jingyin " @click="openSound"/>
          </div>
          <div class="footer-right">
            <div v-if="playBackState" class="iconrside">
              <div class="speed-content">
                <span>{{ $t('remotePatrol.back') }}</span>
                <el-select :value="curBack" :popper-class="popperClass" :popper-append-to-body="false"
                           class="el-test" size="mini" placeholder="">
                  <el-option
                    v-for="(item) in backList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @click.native="adjustProcess(item.value, item.label)"
                  />
                </el-select>
              </div>
            </div>
            <div class="iconrside">
              <div class="speed-content">
                <span>{{ $t('remotePatrol.ezuikitwidth') }}</span>
                <el-select :value="proportion" :popper-class="popperClass" :popper-append-to-body="false"
                           class="el-test" size="mini" placeholder="">
                  <el-option
                    v-for="(item,index) in proportionList"
                    :key="index"
                    :label="item.label"
                    :value="item.label"
                    @click.native="checkPro(item.label)"
                  />
                </el-select>
              </div>
            </div>
            <div class="screen-content">
              <i
                :class="fullWindow ? 'icon-tuichuquanping':'icon-quanping'"
                class="iconfont iconscreen"
                @click="controlScreen"/>
              <i v-if="false" class="iconfont icon-gongge iconscreen" @click="gonggeScreen"/>
            </div>
          </div>
        </div>
        <div v-if="playBackState" class="progress-content">
          <b-progress id="bprogress" :value="currentTimeValue" :max="durationTimeValue" class="mb-3 prog"
                      height="0.2rem"/>
        </div>
        <transition name="fade">
          <div v-if="showModelContent && !isEvent" :class="lang== 'en'? 'en-iconright' : 'iconright'" @click="cutPicture">
            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"/>
            <span>{{ $t('remotePatrol.snapshot') }}</span>
          </div>
        </transition>
        <div id="myPlayer" ref="myPlayer"/>
      </div>
      <!-- full screen -->
      <div
        v-loading="isLoading"
        v-else
        id="videoContent"
        ref="videoContent"
        class="video-content"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @mouseleave="hiddenModel"
        @mouseenter="showModel"
        @mousemove="showModel">
        <div class="video-model">
          <span v-if="showInfoContent" id="channelName">{{ channelInfo.channelName }}</span>
          <div v-if="showInfoContent" class="icon-footer">
            <div class="iconlside">
              <i v-if="!playState" class="iconfont icon-bofang1 iconplay" @click="realTime"/>
              <i v-else class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime"/>
            </div>
            <div class="iconlside">
              <i v-if="ifOpenSound" class="iconfont icon-auido icon-shengyin1" @click="closeSound"/>
              <i v-else class="iconfont icon-auido icon-jingyin " @click="openSound"/>
            </div>
            <div class="footer-right">
              <div v-if="playBackState" class="iconrside">
                <div class="speed-content">
                  <span>{{ $t('remotePatrol.back') }}</span>
                  <el-select :value="curBack" :popper-class="popperClass" :popper-append-to-body="false"
                             class="el-test" size="mini" placeholder="">
                    <el-option
                      v-for="(item) in backList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      @click.native="adjustProcess(item.value, item.label)"
                    />
                  </el-select>
                </div>
              </div>
              <div class="iconrside">
                <div class="speed-content">
                  <span>{{ $t('remotePatrol.ezuikitwidth') }}</span>
                  <el-select :value="proportion" :popper-class="popperClass" :popper-append-to-body="false"
                             class="el-test" size="mini" placeholder="">
                    <el-option
                      v-for="(item,index) in proportionList"
                      :key="index"
                      :label="item.label"
                      :value="item.label"
                      @click.native="checkPro(item.label)"
                    />
                  </el-select>
                </div>
              </div>
              <div class="screen-content">
                <i
                  :class="fullWindow ? 'icon-tuichuquanping':'icon-quanping'"
                  class="iconfont iconscreen"
                  @click="controlScreen"/>
              </div>
            </div>
          </div>
          <div v-if="playBackState" class="progress-content">
            <b-progress id="bprogress" :value="currentTimeValue" :max="durationTimeValue"
                        class="mb-3 prog" height="0.2rem" style="margin-bottom:0px !important;"/>
          </div>
        </div>

        <transition name="fade">
          <div v-if="showModelContent && !isEvent" :class="lang === 'en' ? 'en-iconright' : 'iconright'" @click="cutPicture">
            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"/>
            <span>{{ $t('remotePatrol.snapshot') }}</span>
          </div>
        </transition>
        <div id="fullPlayer" ref="myPlayer"/>
      </div>
    </div>

    <el-dialog
      v-if="showCutDialog"
      :title="$t('remotePatrol.edit')"
      :visible.sync="showCutDialog"
      :close-on-click-modal="false"
      :width="860*percentHeight+'px'"
      height="300px"
      top="5%">
      <div class="canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel" @mouseup="mouseUpHandler" >
        <hr class="dialog-hr">
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
          :width="767*percentHeight"
          :height="431*percentHeight"
          @mousedown="mouseDownAction($event)"
          @mousemove="mouseMoveAction($event)"
          @mouseleave="mouseLeaveAction($event)"/>
        <img id="imgTest" :src="imgSrc" style="display: none">
        <div
          v-if="showCancelContent"
          :style="{'width':767*percentHeight+'px',
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
      <div slot="footer">
        <el-button id="cancelBtn" size="mini" @click="showCutDialog = false">{{ $t('remotePatrol.cancel') }}</el-button>
        <el-button id="confirmBtn" size="mini" type="primary" @click="confirmEdit">{{ $t('remotePatrol.confirm') }}</el-button>
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
          <img id="imgTest" :src="imgSrc" style="display: none">
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
          <el-input v-model="eventName" size="mini" class="name-input" @input="eventNameChanged"
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

    <!-- enter device validate code -->
    <el-dialog
      v-if="showInputPassword"
      :title="$t('remotePatrol.enterPassword')"
      :visible.sync="showInputPassword"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="28%"
      top="35vh"
      left="40vh"
      @close="closeDialog">
      <div class="dialog-content" style="overflow:hidden;width:100%;">
        <hr style="border: 0.5px solid #dfe2e9;">
        <div style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
          <p>{{ $t("remotePatrol.contactInfo") }}</p>
          <el-input :placeholder="$t('remotePatrol.enterPassword')" v-model="videoPassword" show-password size="mini"/>
          <p>{{ $t("remotePatrol.initialCode") }}</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="cancelEnterPassword">
          {{ $t('remotePatrol.cancel') }}
        </el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="verifyEnterPassword">
          {{ $t('remotePatrol.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import EZUIKit_China from '../../static/ezuikit/ezuikit_China/ezuikit.js';
import EZUIKit_Global from '../../static/ezuikit/ezuikit_Global/ezuikit.js';
import { getEzvizAccessToken, getIsEncrypt, updateDevicePassword, getDeviceCapacity } from '@/api/ezviz';
import { mapGetters } from 'vuex';
import qs from 'qs';
import { getCookie } from '../common/auth';
import filterString from '../common/filterString';
import Environment from '../common/environment';
import html2canvas from 'html2canvas';

export default {
  name: 'EzvizVideo',
  props: {
    channelInfo: {
      type: Object
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
      type: Boolean
    },
    isEvent: {
      type: Boolean
    },
    isStoreMonitor: {
      type: Boolean
    },
    playBack: {
      type: Boolean,
      default: false
    },
    curTime: {
      type: Number
    },
    storeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      areaDomain: null,
      proportion: '4:3',
      proportionList: [
        { label: '4:3' },
        { label: '16:9' }
      ],
      clearIconSrc: require('../../static/img/clear.png'),
      removeIconSrc: require('../../static/img/cancel.png'),
      penBtnSrc: require('../../static/img/edit_btn.png'),
      videoUrl: '',
      accessToken: '',
      showError: false,
      errorMsg: '',
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      showInfoContent: true,
      playState: false,
      fullWindow: false,
      showModelContent: false,
      lang: this.$i18n.locale,
      decoder: null,
      fullDecoder: null,
      videoSpeed: 0,
      videoSpeedId: 0,
      showgongge: false,
      ifOpenSound: false,
      showCutDialog: false,
      imageCanvas: new Image(),
      imageCanvasList: [],
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
      showCancelContent: false,
      showPen: false,
      showPenBtn: false,
      imgSrc: '',
      channel: this.channel,
      canvasEl: '',
      isMouseDown: false,
      flag: 0,
      eventName: '',
      eventDes: '',
      showSnapshotFeedbackDialog: false,
      feedBackVideoFileObj: {},
      timerPlayReal: null,
      realTimeSpeed: 0,
      initPlayerWidth: 0,
      initPlayerHeight: 0,
      isLoading: false,
      lang: this.$i18n.locale,
      currentTimeValue: 0,
      durationTimeValue: 0,
      curBack: '',
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
      popperClass: 'select-popClass',
      startTime: 0,
      endTime: 0,
      times: 0,
      showBackState: false,
      playBackState: false,
      startTs: 0,
      clickSnapshot: false,
      showInputPassword: false,
      videoPassword: '',
      userId: '',
      blob: null,
      ezvizExpireTime: 0,
      currentStoreId: null,
      isLoaded: false,
      editCount: 0,
      showEventNameInfo: false,
      changeId: false,
      eventNameRuletip: false,
      eventDesRuletip: false
    };
  },

  watch: {
    accountChanged(val) {
      console.log(val);
      const self = this;
      if (val != 0) {
        self.channelInfo = null;
        self.stopVideo();
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
      const self = this;
      console.log(val);
      if (val >= 300) {
        if (self.fullWindow) {
          if (self.ifOpenSound) {
            self.fullDecoder.closeSound();
          }
          self.fullDecoder.stop();
        } else {
          if (self.ifOpenSound) {
            self.decoder.closeSound();
          }
          self.decoder.stop();
        }
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal = null;
        self.playState = false;
        self.showModelContent = false;
        self.ifOpenSound = false;
        self.times = 0;
        self.playBackState = false;
      }
    },

    async storeId(newValue, oldValue) {
      console.log(newValue);
      console.log(oldValue);
      const self = this;
      if (newValue.length > 0) {
        await self.getEzvizAccessToken(newValue);
      }
    }
  },

  async mounted() {
    const self = this;
    console.log(self.storeId);
    console.log(self.accessToken);
    if (!self.isStoreMonitor) {
      const result = await self.getEzvizAccessToken(self.storeId);
      self.checkIfEncry();
    } else {
    }
    window.addEventListener('resize', self.resizeFun, false);
    window.addEventListener('visibilitychange', self.visibleChange, false);
  },

  beforeDestroy() {
    const self = this;
    console.log(self.playState);
    window.clearInterval(self.timerPlayReal);
    self.realTimeSpeed = 0;
    if (self.playState) {
      self.decoder.closeSound();
      self.decoder.stop();
    }
    window.removeEventListener('resize', self.resizeFun);
    window.removeEventListener('visibilitychange', self.visibleChange);
    self.resizeFun = null;
    self.visibleChange = null;
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
    checkPro(item) {
      const self = this;
      self.proportion = item;
      if (self.fullWindow) {
        if (self.playState) {
          if (self.ifOpenSound) {
            self.fullDecoder.closeSound();
          }
          self.fullDecoder.stop();
          self.fullDecoder = null;
        }
        self.resetVideoSize();
      } else {
        if (self.playState) {
          if (self.ifOpenSound) {
            self.decoder.closeSound();
          }
          self.decoder.stop();
          self.decoder = null;
        }
        self.initVideo();
      }
    },

    async changeHistoryTime(newValue) {
      console.log('curTime');
      const self = this;
      if (!self.channelInfo.id || !self.channelInfo.ivsId) {
        self.showError = true;
        self.errorMsg = self.$t('remotePatrol.lackParams');
        return;
      }
      self.showError = false;
      self.times = 0;
      console.log('new:', newValue);
      console.log(self.curTime);
      self.startTs = newValue;
      if (newValue === 0) {
        self.playBack = false;
      }
      if (self.playState) {
        self.decoder.stop();
        self.playState = false;
      }
      self.$nextTick(() => {
        self.decoder = null;
        console.log(self.$refs.myPlayer);
        // self.initVideo();
        self.checkIfEncry();
      });
    },

    visibleChange() {
      const self = this;
      if (document.hidden) {
        if (self.playState) {
          self.decoder.stop();
        }
      } else {
        console.log(self.playState);
        if (self.playState) {
          self.realTime();
        }
      }
    },

    resizeFun() {
      const self = this;
      if (!self.checkFull() && self.fullWindow) {
        self.fullWindow = false;
        var playerEle = self.$refs.myPlayer;
        playerEle.style.width = self.initPlayerWidth + 'px';
        playerEle.style.height = self.initPlayerHeight + 'px';
        self.exitFullscreen();
      }
    },

    getEzvizAccessToken(storeId) {
      const self = this;
      const params = {};
      params.storeId = storeId;
      return new Promise((resolve, reject) => {
        if (self.currentStoreId === storeId && (Date.parse(new Date()) < self.ezvizExpireTime)) {
          resolve(self.accessToken);
        } else {
          getEzvizAccessToken(params)
            .then(result => {
              self.currentStoreId = storeId;
              self.accessToken = result.data.accessToken;
              self.areaDomain = {
                domain: result.data.areaDomain
              };
              self.ezvizExpireTime = result.data.expireTime;
              resolve(result.data.accessToken);
            })
            .catch(error => {
              reject();
            });
        }
      });
    },

    async checkIfEncry() {
      const self = this;
      const obj = {};
      obj.accessToken = self.accessToken;// token
      if (self.channelInfo == null) {
        return;
      }
      obj.deviceSerial = self.channelInfo.ivsId;
      const result = await self.getDeviceIsEncrypt(qs.stringify(obj));
      console.log(result);
      let suportUpdatePass = false;
      if (result === 1) {
        suportUpdatePass = await getDeviceCapacity(qs.stringify(obj));
      }
      console.log(suportUpdatePass);
      if (result === 1) {
        if (suportUpdatePass) {
          // if device encried, get validate code from cache firstly
          // if not exist, show dialog
          const deviceObj = {};
          deviceObj.deviceSerial = self.channelInfo.ivsId;
          deviceObj.channelId = self.channelInfo.channelId;
          const result = self.getDeviceValidateCode(deviceObj);
          if (result.length > 0) {
            self.videoPassword = result;
            self.verifyEnterPassword();
          } else {
            // not exist password
            self.isLoading = false;
            self.showError = true;
            self.errorMsg = self.$t('remotePatrol.videoEncrypted');
            self.showInputPassword = true;
          }
        } else {
          // not support update password
          self.isLoading = false;
          self.showError = true;
          self.errorMsg = self.$t('remotePatrol.videoCannotPlay');
        }
      } else {
        self.showError = false;
        self.videoPassword = '';
        self.times = 0;
        self.ifIsEncrypt = false;
        self.changeId && (self.startTs = self.curTime);
        if (self.playState) {
          self.decoder.stop();
          self.playState = false;
        }
        self.$nextTick(() => {
          self.decoder = null;
          console.log(self.$refs.myPlayer);
          if (self.fullWindow) {
            self.initFullWindowVideo();
          } else {
            self.initVideo();
          }
        });
      }
    },

    async getDeviceIsEncrypt(params) {
      const self = this;
      console.log(params);
      const ret = await getIsEncrypt(params);
      console.log(ret);
      return ret;
    },

    async initVideo() {
      const self = this;
      self.showError = false;
      console.log(self.playBack);
      self.showModelContent = false;
      if (self.channelInfo == null) {
        return;
      }
      if (self.channelInfo.channelId == undefined) {
        return;
      } else {
        self.isLoading = true;
        const o = self.$refs.myPlayer || self.$refs.errorModel;
        // let width = o.offsetWidth;
        const height = o.offsetHeight;
        let width = 0;
        switch (self.proportion) {
          case '4:3':
            width = 560;
            break;
          case '16:9':
            width = 746;
            break;
          default:
            width = 560;
            break;
        }
        self.initPlayerWidth = o.offsetWidth;
        self.initPlayerHeight = height;
        console.log(width);
        console.log(height);
        self.getVideoUrl();
        console.log(self.videoUrl);
        if (self.accessToken === '') {
          self.notify(self.$t('remotePatrol.getAccessTokenError'), 'warning', 3000);
          return;
        }
        const isGlobalWebsite = Environment.isGlobalWebsite;
        const decoderPath = isGlobalWebsite ? './static/ezuikit/ezuikit_Global' : './static/ezuikit/ezuikit_China';
        if (isGlobalWebsite) {
          self.decoder = new EZUIKit_Global.EZUIPlayer({
            id: 'myPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: height,
            splitBasis: 1,
            env: self.areaDomain,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess
          });
        } else {
          self.decoder = new EZUIKit_China.EZUIPlayer({
            id: 'myPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess
          });
        }
      }
    },

    handleError(e) {
      console.log(e.msg);
      const self = this;
      self.isLoading = false;
      // self.errorMsg = e.msg;
      self.showError = true;
      const retcode = e.retcode;
      self.errorMsg = self.getErrorMsg(e);
      if (self.playState) {
        if (!self.fullWindow) {
          if (self.ifOpenSound) {
            self.decoder.closeSound();
          }
          self.decoder.stop();
        } else {
          if (self.ifOpenSound) {
            self.fullDecoder.closeSound();
          }
          self.fullDecoder.stop();
        }
      } else {
        self.decoder.stop();
      }
      self.playState = false;
      self.ifOpenSound = false;
      self.realTimeSpeed = 0;
      self.times = 0;
      window.clearInterval(self.timerPlayReal);
      self.timerPlayReal = null;
      if (self.playBack) {
        self.playBackState = false;
      }
    },

    getErrorMsg(err) {
      const self = this;
      let retcode = err.code;
      if (!retcode) {
        retcode = err.retcode;
      }
      let msg = '';
      switch (retcode) {
        case '10001': {
          msg = self.$t('remotePatrol.partolError');
          break;
        }
        case '10002': {
          msg = self.$t('remotePatrol.accessTokenError');
          break;
        }
        case '10026': {
          msg = self.$t('remotePatrol.maxDeviceNum');
          break;
        }
        case '20018': {
          msg = self.$t('remotePatrol.noDevice');
          break;
        }
        case 9048: {
          msg = self.$t('remotePatrol.maxConcurrency');
          break;
        }
        case 5451: {
          msg = self.$t('remotePatrol.deviceOffline');
          break;
        }
        case 5402: {
          msg = self.$t('remotePatrol.noHistoryVideo');
          break;
        }
        case 5544: {
          msg = self.$t('remotePatrol.noVideoSource');
          break;
        }
        default: {
          msg = err.msg;
          break;
        }
      }
      return msg;
    },

    handleSuccess() {
      const self = this;
      self.editCount++;
      self.showError = false;
      self.errorMsg = '';
      self.realTimeSpeed = 0;
      window.clearInterval(self.timerPlayReal);
      self.timerPlayReal = window.setInterval(() => {
        console.log(self.realTimeSpeed);
        self.realTimeSpeed = self.realTimeSpeed + 1;
        if (self.playBack) {
          self.getProcess();
        }
      }, 1000);
      setTimeout(() => {
        self.playState = true;
        self.isLoading = false;
        self.showModelContent = true;
        // self.showInfoContent=false;
        // self.ifOpenSound = false;
        if (self.fullWindow) {
          if (self.ifOpenSound) {
            self.fullDecoder.openSound();
          }
        } else {
          if (self.ifOpenSound) {
            self.decoder.openSound();
          }
        }
        if (self.playBack) {
          self.playBackState = true;
        } else {
          self.times = 0;
          self.playBackState = false;
        }
      }, 2000);
    },

    handleFullWindowSuccess() {
      const self = this;
      self.editCount++;
      // self.playState = true;
      self.showError = false;
      self.errorMsg = '';
      if (self.playState) {
        self.realTimeSpeed = self.realTimeSpeed + 1;
        console.log(self.realTimeSpeed);
        if (self.playBack) {
          self.getProcess();
        }
      }

      setTimeout(() => {
        self.showModelContent = true;
        // self.showInfoContent=false;
        self.isLoading = false;
        if (self.ifOpenSound) {
          self.fullDecoder.openSound();
        }
        // self.ifOpenSound = false
      }, 2000);
    },

    handleExitFullScreenSuccess() {
      const self = this;
      self.showError = false;
      self.errorMsg = '';
      if (self.clickSnapshot) {
        // self.stopRealTime()
        self.isLoading = false;
        self.showModelContent = false;
      }
      if (self.playState) {
        self.realTimeSpeed = self.realTimeSpeed + 1;
        console.log(self.realTimeSpeed);
        if (self.playBack) {
          self.getProcess();
        }
      }

      setTimeout(() => {
        self.isLoading = false;
        self.showModelContent = true;
        // self.showInfoContent=false;
        if (self.ifOpenSound) {
          self.decoder.openSound();
        }
      }, 2000);
    },

    controlScreen() {
      const self = this;
      if (!self.fullWindow) {
        self.fullWindowScreen();
        setTimeout(() => {
          self.showModelContent = false;
          // self.showInfoContent=false;
        }, 3000);
      } else {
        self.exitFullscreen();
        self.fullWindow = false;
      }
    },

    fullWindowScreen(...val) {
      console.log(val);
      const self = this;
      self.fullWindow = true;
      var ele = document.getElementById('videoContent');
      ele.style.width = '100%';
      ele.style.height = '100%';
      const width = self.varyWindowWidth;
      const height = self.varyWindowHeight;

      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
      self.resetVideoSize('fullin');
    },

    exitFullscreen() {
      const self = this;
      var de = document;
      self.fullWindow = false;
      var ele = document.getElementById('videoContent');
      var playerEle = self.$refs.myPlayer;
      playerEle.style.width = self.initPlayerWidth + 'px';
      playerEle.style.height = self.initPlayerHeight + 'px';
      self.$nextTick(() => {
        ele.style.width = self.initPlayerWidth + 'px';
        ele.style.height = self.initPlayerHeight + 'px';
        // playerEle.style.width = self.initPlayerWidth + 'px';
        // playerEle.style.height = self.initPlayerHeight + 'px';
      });
      const width = ele.offsetWidth;
      const height = ele.offsetHeight;

      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
      self.exitFullScreenPlayer();
    },

    exitFullScreenPlayer() {
      const self = this;
      if (self.playState) {
        if (self.ifOpenSound) {
          self.fullDecoder.closeSound();
        }
        self.fullDecoder.stop();
        self.fullDecoder = null;
        self.isLoading = true;
        let width = 0;
        switch (self.proportion) {
          case '4:3':
            width = 560;
            break;
          case '16:9':
            width = 746;
            break;
          default:
            width = 560;
            break;
        }
        console.log(self.initPlayerWidth);
        console.log(self.initPlayerHeight);
        self.getVideoUrl();
        const isGlobalWebsite = Environment.isGlobalWebsite;
        const decoderPath = isGlobalWebsite ? './static/ezuikit/ezuikit_Global' : './static/ezuikit/ezuikit_China';
        if (isGlobalWebsite) {
          self.decoder = new EZUIKit_Global.EZUIPlayer({
            id: 'myPlayer',
            autoplay: self.playState,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: self.initPlayerHeight,
            splitBasis: 1,
            env: self.areaDomain,
            handleError: self.handleError,
            handleSuccess: self.handleExitFullScreenSuccess
          });
        } else {
          self.decoder = new EZUIKit_China.EZUIPlayer({
            id: 'myPlayer',
            autoplay: self.playState,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: self.initPlayerHeight,
            handleError: self.handleError,
            handleSuccess: self.handleExitFullScreenSuccess
          });
        }
      } else {
        // do nothing
      }
    },

    resetVideoSize(e) {
      const self = this;
      if (self.channelInfo == null) {
        return;
      } else if (self.playState) {
        if (e === 'fullin') {
          self.decoder.closeSound();
          self.decoder.stop();
          self.decorder = null;
        }
        self.isLoading = true;
        const height = screen.height;
        let width = 0;
        switch (self.proportion) {
          case '4:3':
            width = height * 4 / 3;
            break;
          case '16:9':
            width = height * 16 / 9;
            break;
          default:
            width = height * 4 / 3;
            break;
        }
        const playerEle = self.$refs.myPlayer;
        playerEle.style.width = screen.width + 'px';
        playerEle.style.height = screen.height + 'px';
        console.log(width);
        console.log(height);
        console.log(playerEle);
        console.log(self.playState);
        self.getVideoUrl();
        const isGlobalWebsite = Environment.isGlobalWebsite;
        const decoderPath = isGlobalWebsite ? './static/ezuikit/ezuikit_Global' : './static/ezuikit/ezuikit_China';
        if (isGlobalWebsite) {
          self.fullDecoder = new EZUIKit_Global.EZUIPlayer({
            id: 'fullPlayer',
            autoplay: self.playState,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: height,
            splitBasis: 1,
            env: self.areaDomain,
            handleError: self.handleError,
            handleSuccess: self.handleFullWindowSuccess
          });
        } else {
          self.fullDecoder = new EZUIKit_China.EZUIPlayer({
            id: 'fullPlayer',
            autoplay: self.playState,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleFullWindowSuccess
          });
        }
      } else {
        // do nothing
      }
    },

    showModel() {
      const self = this;
      if (self.playState) {
        self.showModelContent = true;
      }
    },

    hiddenModel() {
      const self = this;
      self.showModelContent = false;
    },

    async realTime() {
      const self = this;
      self.times = 0;
      if (self.isStoreMonitor && !self.isLoaded) {
        self.checkIfEncry();
        self.isLoaded = true;
      } else {
        if (self.fullWindow) {
          self.initFullWindowVideo();
        } else {
          self.initVideo();
        }
      }
    },

    initFullWindowVideo() {
      const self = this;
      if (self.channelInfo == null) {
        return;
      } else {
        const o = document.getElementById('videoContent');
        // o.style.width= width + 'px'
        // o.style.height= height + 'px'
        const width = screen.width;
        const height = screen.height;
        const playerEle = self.$refs.myPlayer;
        playerEle.style.width = screen.width + 'px';
        playerEle.style.height = screen.height + 'px';
        console.log(width);
        console.log(height);
        self.isLoading = true;
        self.getVideoUrl();
        const isGlobalWebsite = Environment.isGlobalWebsite;
        const decoderPath = isGlobalWebsite ? './static/ezuikit/ezuikit_Global' : './static/ezuikit/ezuikit_China';
        if (isGlobalWebsite) {
          self.fullDecoder = new EZUIKit_Global.EZUIPlayer({
            id: 'fullPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: height,
            splitBasis: 1,
            env: self.areaDomain,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess
          });
        } else {
          self.fullDecoder = new EZUIKit_China.EZUIPlayer({
            id: 'fullPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: decoderPath,
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess
          });
        }
      }
    },

    stopRealTime() {
      const self = this;
      if (self.playState) {
        if (self.fullWindow) {
          self.fullDecoder.closeSound();
          self.fullDecoder.stop();
          self.fullDecoder = null;
        } else {
          self.decoder.closeSound();
          self.decoder.stop();
          self.decoder = null;
        }

        window.clearInterval(self.timerPlayReal);
        self.realTimeSpeed = 0;
        self.stopVideoTime = false;
        self.timerPlayReal = null;
      }
      self.ifOpenSound = false;
      self.showModelContent = false;
      // self.showInfoContent=false;
      self.playState = false;
      self.curBack = '';
      self.currentTimeValue = 0;
    },

    openSound() {
      const self = this;
      self.ifOpenSound = true;
      if (self.fullWindow) {
        self.fullDecoder.openSound();
      } else {
        self.decoder.openSound();
      }
    },

    closeSound() {
      const self = this;
      self.ifOpenSound = false;
      if (self.fullWindow) {
        self.fullDecoder.closeSound();
      } else {
        self.decoder.closeSound();
      }
    },

    stopVideo() {
      const self = this;
      if (self.playState) {
        if (self.fullWindow) {
          self.fullDecoder.closeSound();
          self.fullDecoder.stop();
          self.fullDecoder = null;
        } else {
          self.decoder.closeSound();
          self.decoder.stop();
          self.decoder = null;
        }
      }
    },

    cutPicture() {
      const self = this;
      if (self.fullWindow) {
        self.fullDecoder.capturePicture(0, 'default');
      } else {
        self.decoder.capturePicture(0, 'default');
      }
      self.imageCanvasList = [];
      if (self.showFeedBack) {
        self.showSnapshotFeedbackDialog = true;
        self.eventName = '';
        self.eventDes = '';
        self.showEventNameInfo = false;
        this.$nextTick(() => {
          self.canvasEl = document.getElementById('icanvas');
          var ctx = self.canvasEl.getContext('2d');
          const img = new Image();
          setTimeout(() => {
            self.imgSrc = sessionStorage.getItem('fileUrl');
            const img = document.getElementById('imgTest');
            // self.stopRealTime();
            if (self.fullWindow) {
              self.exitFullscreen();
              self.fullWindow = false;
              self.clickSnapshot = true;
            }
            html2canvas(img).then(function(canvas) {
              ctx.drawImage(img, 0, 0, 520 * self.percentHeight, 340 * self.percentHeight);
              var oGrayImg = icanvas.toDataURL('image/jpeg');
              self.imageCanvas.src = oGrayImg;
              const imgObj = new Image();
              imgObj.src = oGrayImg;
              self.imageCanvasList.push(imgObj);
            });
          }, 100);
        });
      } else {
        self.showCancelContent = false;
        if (self.sourceListLength >= 10) {
          const msg = self.isStoreMonitor ? self.$t('remotePatrol.storeMaxAttach') : self.$t('remotePatrol.maximumAttach');
          self.notify(msg, 'warning', 3000);
          return false;
        }
        self.showCutDialog = true;
        this.$nextTick(() => {
          self.canvasEl = document.getElementById('icanvas');
          var ctx = self.canvasEl.getContext('2d');
          const img = new Image();
          setTimeout(() => {
            self.imgSrc = sessionStorage.getItem('fileUrl');
            // self.stopRealTime();
            const img = document.getElementById('imgTest');
            if (self.fullWindow) {
              self.exitFullscreen();
              self.fullWindow = false;
              self.clickSnapshot = true;
            }
            html2canvas(img).then(function(canvas) {
              ctx.drawImage(img, 0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
              var oGrayImg = icanvas.toDataURL('image/jpeg');
              self.imageCanvas.src = oGrayImg;
              const imgObj = new Image();
              imgObj.src = oGrayImg;
              self.imageCanvasList.push(imgObj);
            });
          }, 100);
        });
      }
    },

    showPenList() {
      const self = this;
      self.showPen = !self.showPen;
      self.showCancelContent = false;
    },

    checkPen(item, index) {
      const self = this;
      item.showContent = true;
      self.penList.forEach((_item, _index) => {
        if (index != _index) {
          _item.showContent = false;
        }
      });
      self.penChecked = item.id;
    },

    cancelEditCanvas() {
      const self = this;
      self.showCancelContent = false;
      self.canvasEl = document.getElementById('icanvas');
      var ctx = self.canvasEl.getContext('2d');
      let vcanvas = null;
      if (self.showFeedBack) {
        vcanvas = { width: 520 * self.percentHeight, height: 340 * self.percentHeight };
      } else {
        vcanvas = { width: 767 * self.percentHeight, height: 431 * self.percentHeight };
      }
      ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
      ctx.drawImage(self.imageCanvas, 0, 0, vcanvas.width, vcanvas.height);
      self.imageCanvasList = [];
    },
    confirmEditCanvas() {
      const self = this;
      self.showCancelContent = false;
      self.imageCanvasList.pop();
      self.canvasEl = document.getElementById('icanvas');
      var ctx = self.canvasEl.getContext('2d');
      let vcanvas = null;
      if (self.showFeedBack) {
        vcanvas = { width: 520 * self.percentHeight, height: 340 * self.percentHeight };
      } else {
        vcanvas = { width: 767 * self.percentHeight, height: 431 * self.percentHeight };
      }
      ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
      if (self.imageCanvasList.length === 0) {
        ctx.drawImage(self.imageCanvas, 0, 0, vcanvas.width, vcanvas.height);
      } else {
        ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length - 1], 0, 0, vcanvas.width, vcanvas.height);
      }
    },

    confirmEdit() {
      const self = this;
      const obj = {};
      obj.mediaType = 2;
      const src = self.canvasEl.toDataURL('image/jpeg');
      self.$emit('confirmEzvizCanvas', src);
      self.showCutDialog = false;
    },

    mouseDownAction(e) {
      const self = this;
      self.isMouseDown = true;
      self.X = e.offsetX;
      self.Y = e.offsetY;
      self.showCutModel = false;
      self.showPenBtn = false;
      self.showCancelContent = false;
    },

    mouseMoveAction(e) {
      const self = this;
      if (self.isMouseDown) {
        self.X1 = e.offsetX;
        self.Y1 = e.offsetY;
        self.drawLine(self.X, self.Y, self.X1, self.Y1);
        self.showPenBtn = false;
        self.flag++;
      }
    },

    mouseUpHandler(e) {
      const self = this;
      self.isMouseDown = false;
      self.showCutModel = true;
      self.showPenBtn = true;
      self.showCancelContent = true;
      if (self.flag != 0 && self.canvasEl != '') {
        const imgObj = new Image();
        imgObj.src = self.canvasEl.toDataURL('image/jpeg');
        self.imageCanvasList.push(imgObj);
      }
      self.flag = 0;
    },

    mouseLeaveAction(e) {
      console.log(e);
      const self = this;
      self.isMouseDown = false;
    },

    drawLine(x, y, x1, y1) {
      const self = this;
      var ctx = self.canvasEl.getContext('2d');
      if (self.flag) {
        ctx.beginPath();
      }
      ctx.moveTo(x, y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = self.penChecked;
      ctx.lineTo(x1, y1);
      ctx.stroke();
      if (self.flag != 0) {
        self.X = self.X1;
        self.Y = self.Y1;
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
    },

    checkFull() {
      var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    stopAndRealTime() {
      const self = this;
      self.showError = false;
      if (self.playState) {
        self.decoder.stop();
      }
      self.$nextTick(() => {
        self.decoder = null;
        console.log(self.$refs.myPlayer);
        self.initVideo();
      });
    },

    async getProcess() {
      const self = this;
      self.times += 1;
      const duration = 300;
      self.durationTimeValue = duration;
      self.currentTimeValue = self.times;
      var callback = function(iTime) {
        self.startTs = iTime;
        console.log('iTime', iTime);
        console.log('self.startTs', self.startTs);
      };
      if (!self.fullWindow) {
        self.decoder.getOSDTime(callback);
      } else {
        self.fullDecoder.getOSDTime(callback);
      }
      if (self.times >= duration) {
        self.decoder.stop();
        self.currentTimeValue = 0;
        self.times = 0;
        self.playState = false;
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal = null;
      }
    },

    adjustProcess(val, label) {
      console.log(val);
      const self = this;
      self.curBack = label;
      var callback = function(iTime) {
        console.log('iTime', iTime);
        switch (val) {
          case 0: self.startTs = iTime - 10 * 1000; break;
          case 1: self.startTs = iTime - 30 * 1000; break;
          case 2: self.startTs = iTime - 60 * 1000; break;
          default: break;
        }
        self.times = 0;
        if (self.fullWindow) {
          if (self.playState) {
            if (self.ifOpenSound) {
              self.fullDecoder.closeSound();
            }
            self.fullDecoder.stop();
            self.fullDecoder = null;
          }
          self.initFullWindowVideo();
          console.log('self.startTs', self.startTs);
        } else {
          if (self.playState) {
            if (self.ifOpenSound) {
              self.decoder.closeSound();
            }
            self.decoder.stop();
            self.decoder = null;
          }
          self.initVideo();
          console.log('self.startTs', self.startTs);
        }
      };
      if (self.fullWindow) {
        self.fullDecoder.getOSDTime(callback);
      } else {
        self.decoder.getOSDTime(callback);
      }
    },

    changeInfoContent(val) {
      const self = this;
      self.showInfoContent = val;
    },

    async verifyEnterPassword() {
      const self = this;
      const obj = {};
      obj.accessToken = self.accessToken;
      obj.deviceSerial = self.channelInfo.ivsId;
      obj.oldPassword = self.videoPassword;
      obj.newPassword = self.videoPassword;
      const params = qs.stringify(obj);
      const result = await updateDevicePassword(params);
      if (result) {
        self.showInputPassword = false;
        self.showError = false;
        self.times = 0;
        self.startTs = self.curTime;
        const deviceObj = {};
        deviceObj.deviceSerial = self.channelInfo.ivsId;
        deviceObj.channelId = self.channelInfo.channelId;
        deviceObj.validateCode = self.videoPassword;
        self.saveDeviceValidateCode(deviceObj);
        self.$nextTick(() => {
          self.decoder = null;
          console.log(self.$refs.myPlayer);
          self.initVideo();
        });
      } else {
        self.videoPassword = '';
        self.showInputPassword = true;
      }
    },

    closeDialog() {
      const self = this;
      self.videoPassword = '';
      self.isLoading = false;
    },

    cancelEnterPassword() {
      const self = this;
      self.videoPassword = '';
      self.showInputPassword = false;
    },

    /**
     * cache validate code
     */
    saveDeviceValidateCode(deviceObj) {
      const self = this;
      const key = 'ezviz' + '_' + self.userId;
      let temp = [];
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      /**
       * update code
       */
      temp.forEach((item, index) => {
        if (item.deviceSerial === deviceObj.deviceSerial && item.channelId === deviceObj.channelId) {
          temp.splice(index, 1);
        }
      });
      temp.push(deviceObj);
      console.log(temp);
      localStorage.setItem(key, JSON.stringify(temp));
    },

    /**
       * get validate code base on deviceSerial and channelId
       * @returns {Array}
       */
    getDeviceValidateCode(deviceObj) {
      const self = this;
      const userId = getCookie('UserId');
      self.userId = userId;
      const key = 'ezviz' + '_' + self.userId;
      let temp = [];
      let validateCode = '';
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      temp.forEach((item, index) => {
        if (item.deviceSerial === deviceObj.deviceSerial && item.channelId === deviceObj.channelId) {
          validateCode = item.validateCode;
        } else {
          // do nothing
        }
      });
      console.log(validateCode);
      return validateCode;
    },

    eventNameChanged(val) {
      const self = this;
      const content = filterString.standard(val, 50);
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

    getVideoUrl() {
      const self = this;
      const isGlobalWebsite = Environment.isGlobalWebsite;
      if (self.playBack) {
        self.startTime = Number(self.$moment(self.startTs).format('YYYYMMDDHHmmss'));
        self.endTime = Number(self.$moment(self.startTs).add(5, 'm').format('YYYYMMDDHHmmss'));
        if (self.videoPassword.length > 0) {
          if (isGlobalWebsite) {
            self.videoUrl = 'ezopen://' + self.videoPassword + '@open.ezviz.com/' + self.channelInfo.ivsId
              + '/' + self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          } else {
            self.videoUrl = 'ezopen://' + self.videoPassword + '@open.ys7.com/' + self.channelInfo.ivsId
              + '/' + self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          }
        } else {
          if (isGlobalWebsite) {
            self.videoUrl = 'ezopen://srp12345@open.ezviz.com/' + self.channelInfo.ivsId + '/'
              + self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          } else {
            self.videoUrl = 'ezopen://open.ys7.com/' + self.channelInfo.ivsId + '/'
              + self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          }
        }
      } else {
        if (self.videoPassword.length > 0) {
          self.videoUrl = 'ezopen://' + self.videoPassword + '@open.ys7.com/' + self.channelInfo.ivsId
            + '/' + self.channelInfo.channelId + '.live';
        } else {
          if (isGlobalWebsite) {
            self.videoUrl = 'ezopen://srp12345@open.ezviz.com/' + self.channelInfo.ivsId + '/'
              + self.channelInfo.channelId + '.live';
          } else {
            self.videoUrl = 'ezopen://open.ys7.com/' + self.channelInfo.ivsId + '/'
              + self.channelInfo.channelId + '.live';
          }
        }
      }
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
    @include point(margin,20);
    margin-bottom: 0;
    height: auto;
    position: relative;
    min-height: 420px;
    background-color: #232730;
    color: $red;
    z-index: 100;
    span{
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 12px;
      transform: translate(-50%, -50%);
    }
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
    height: auto;
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
        // max-width: 230px;
        display: inline-block;
        margin-right: 20px;
        span{
          font-size: 13px;
          margin-right:6px;
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
    .progress-content{
      position: absolute;
      bottom: 0px;
      width: 100%;
      z-index: 999;
      .prog{
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
