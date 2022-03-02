<template>
  <div>
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
        <div class="iconlside flex-center">
          <i v-if="playState" class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime"/>
          <i v-else class="iconfont icon-bofang1 iconplay" @click="realTime"/>
        </div>
        <div style="flex: 1;"></div>
        <div class="footer-right flex-center">
          <div 
            v-if="playBackState" 
            class="iconrside"
          >
            <div style="margin-right: 20px" class="speed-content flex-center">
              <span style="margin-right: 20px">{{ $t('remotePatrol.back') }}</span>
              <el-popover
                v-model="playBackVisible"
                placement="top"
                popper-class="quality-tooltip">
                <div
                  v-for="(item, index) in backList"
                  :key="item.value"
                  :class="{'checked-label': index === curPlayBackIndex}"
                  class="quaility-label"
                  @click="adjustProcess(item.value, item.label, index)">
                  {{ item.label }}
                </div>
                <el-button slot="reference" class="quality-button">
                  {{ backList[curPlayBackIndex].label }}
                </el-button>
              </el-popover>
            </div>
          </div>
          <div class="iconrside">
            <div class="speed-content flex-center">
              <div
                v-if="!playBackState"
                class="video-quality"
                style="margin-right: 20px"
              >
                <el-popover
                  v-model="qualityVisible"
                  placement="top"
                  popper-class="quality-tooltip">
                  <div
                    v-for="(item, index) in videoQualityList"
                    :key="index"
                    :class="{'checked-label': index === curQualityIndex}"
                    class="quaility-label"
                    @click="onClickQualityLabel(index)">
                    {{ item.label }}
                  </div>
                  <el-button slot="reference" class="quality-button">
                    {{ videoQualityList[curQualityIndex].label }}
                  </el-button>
                </el-popover>
              </div>
              <span style="margin-right: 20px">{{ $t('remotePatrol.ezuikitwidth') }}</span>
              <el-popover
                v-model="sizeVisible"
                placement="top"
                popper-class="quality-tooltip">
                <div
                  v-for="(item, index) in proportionList"
                  :key="index"
                  :class="{'checked-label': index === curSizeIndex}"
                  class="quaility-label"
                  @click="checkPro(item.label, index)">
                  {{ item.label }}
                </div>
                <el-button slot="reference" class="quality-button">
                  {{ proportionList[curSizeIndex].label }}
                </el-button>
              </el-popover>
            </div>
          </div>
          <div class="flex-center snapshot">
            <img :src="snapshotIcon"  @click="cutPicture" v-if="!isEvent">
          </div>
          <div class="iconlside flex-center">
            <img class="icon-auido" :src="muted? voiceOffIcon : voiceONIcon"  @click="onMuted">
          </div>
          <div class="screen-content flex-center">
            <img :src="screenExpIcon"  @click="controlScreen">
          </div>
        </div>
      </div>
      <div v-if="playBackState" class="progress-content">
        <b-progress
          id="bprogress"
          :value="currentTimeValue"
          :max="durationTimeValue"
          class="mb-3 prog"
          height="0.2rem"/>
      </div>
      <transition name="fade">
        
      </transition>
      <div v-if="showError" ref="errorModel" :class="isEvent ? 'event-error': ''" class="errorVideo-model">
        <span>{{ errorMsg }}</span>
      </div>
      <div v-else id="myPlayer" ref="myPlayer"/>
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
        <span v-if="showInfoContent" id="channelName">{{ channelInfo.name }}</span>
        <div v-if="showInfoContent" class="icon-footer">
          <div class="iconlside flex-center" style="margin-left: 60px">
            <i v-if="playState" class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime"/>
            <i v-else class="iconfont icon-bofang1 iconplay" @click="realTime"/>
          </div>
          <div style="flex: 1;"></div>
          <div class="footer-right flex-center">
            <div v-if="playBackState" class="iconrside">
              <div style="margin-right: 20px"  class="speed-content flex-center">
                <span style="margin-right: 20px">{{ $t('remotePatrol.back') }}</span>
                <el-popover
                  v-model="playBackVisible"
                  placement="top"
                   :append-to-body="false"
                  popper-class="quality-tooltip">
                  <div
                    v-for="(item, index) in backList"
                    :key="item.value"
                    :class="{'checked-label': index === curPlayBackIndex}"
                    class="quaility-label"
                     :append-to-body="false"
                    @click="adjustProcess(item.value, item.label, index)">
                    {{ item.label }}
                  </div>
                  <el-button slot="reference" class="quality-button">
                    {{ backList[curPlayBackIndex].label }}
                  </el-button>
                </el-popover>
              </div>
            </div>
            <div class="iconrside">
              <div class="speed-content flex-center">
                <div
                  v-if="!playBackState"
                  class="video-quality"
                  style="margin-right: 20px"
                >
                  <el-popover
                    v-model="qualityVisible"
                    placement="top"
                     :append-to-body="false"
                    popper-class="quality-tooltip">
                    <div
                      v-for="(item, index) in videoQualityList"
                      :key="index"
                      :class="{'checked-label': index === curQualityIndex}"
                      class="quaility-label"
                       :append-to-body="false"
                      @click="onClickQualityLabel(index)">
                      {{ item.label }}
                    </div>
                    <el-button slot="reference" class="quality-button">
                      {{ videoQualityList[curQualityIndex].label }}
                    </el-button>
                  </el-popover>
                </div>
                <span  style="margin-right: 20px">{{ $t('remotePatrol.ezuikitwidth') }}</span>
                <el-popover
                  v-model="sizeVisible"
                  placement="top"
                  :append-to-body="false"
                  popper-class="quality-tooltip">
                  <div
                    v-for="(item, index) in proportionList"
                    :key="index"
                    :class="{'checked-label': index === curSizeIndex}"
                    class="quaility-label"
                    :append-to-body="false"
                    @click="checkPro(item.label, index)">
                    {{ item.label }}
                  </div>
                  <el-button slot="reference" class="quality-button">
                    {{ proportionList[curSizeIndex].label }}
                  </el-button>
                </el-popover>
              </div>
            </div>
            <div class="flex-center snapshot">
              <img :src="snapshotIcon"  @click="cutPicture" v-if="!isEvent">
            </div>
            <div class="iconlside flex-center">
              <img class="icon-auido" :src="muted? voiceOffIcon : voiceONIcon"  @click="onMuted">
            </div>
            <div class="screen-content flex-center">
              <img :src="screenColIcon"  @click="controlScreen">
            </div>
          </div>
        </div>
        <div v-if="playBackState" class="progress-content">
          <b-progress
            id="bprogress"
            :value="currentTimeValue"
            :max="durationTimeValue"
            class="mb-3 prog"
            height="0.2rem"
            style="margin-bottom:0px !important;"/>
        </div>
      </div>

      <transition name="fade">
        <div v-if="showModelContent && !isEvent" :class="lang === 'en' ? 'en-iconright' : 'iconright'" @click="cutPicture">
          <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"/>
          <span>{{ $t('remotePatrol.snapshot') }}</span>
        </div>
      </transition>
      <div v-if="showError" ref="errorModel" :class="isEvent ? 'event-error': ''" class="errorVideo-model">
        <span>{{ errorMsg }}</span>
      </div>
      <div v-else id="fullPlayer" ref="myPlayer"/>
    </div>

    <el-dialog
      v-if="showCutDialog"
      :title="$t('remotePatrol.edit')"
      :visible.sync="showCutDialog"
      :close-on-click-modal="false"
      :width="860*percentHeight+'px'"
      height="300px"
      top="5%">
      <div class="canvas-content" style="display: inline-block" @mouseenter="showCancel" @mouseleave="hiddenCancel" @mouseup="mouseUpHandler" >
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
          class="cancel-content">
          <div id="iconR" class="icon-right">
            <img :src="penBtnSrc" class="pen-btn" @click="showPenList" style="margin-right: 40px">
            <div class="pen-content">
              <div v-for="(item,index) in penList"  style="margin-right: 15px" :style="{'background-color': item.id, 'border': item.showContent ? item.border : '3px solid transparent'}" :key="index" class="content" @click="checkPen(item,index)">
              </div>
            </div>
          </div>
          <div style="flex: 1"></div>
          <div style="display: flex">
            <img :src="clearIconSrc" class="icon-clear" height="36px" @click="cancelEditCanvas" style="margin-right: 80px">
            <img :src="removeIconSrc" class="icon-clear" height="36px" @click="confirmEditCanvas">
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" size="mini" @click="showCutDialog = false">{{ $t('remotePatrol.cancel') }}</el-button>
        <el-button id="confirmBtn" size="mini" type="primary" @click="confirmEdit">{{ $t('remotePatrol.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--feedback based on snapshot -->
    <dialog-pop
      v-if="showSnapshotFeedbackDialog"
      :title= "$t('remotePatrol.feedbacks')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :isWarning="true"
      :dialogWidth="860*percentHeight+'px'"
      :visible="showSnapshotFeedbackDialog"
      @cancelHandler="showSnapshotFeedbackDialog = false"
      @confirmHandler="confirmFeedBackOnSnapshot"
    >
      <div class="canvas-content dialog-slot">
        <div class="feed-canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
          <canvas
            id="icanvas"
            :width="520*percentHeight"
            :height="340*percentHeight"
            @mousedown="mouseDownAction($event)"
            @mouseup="mouseUpHandler"
            @mousemove="mouseMoveAction($event)"
            @mouseleave="mouseLeaveAction($event)"/>
          <img id="imgTest" :src="imgSrc" style="display: none">
          <div class="cancel-content" :style="{'width': 520*percentHeight + 'px'}">
            <div id="iconR" class="icon-right">
              <img :src="penBtnSrc" class="pen-btn" @click="showPenList" style="margin-right: 40px">
              <div class="pen-content">
                <div v-for="(item,index) in penList"  style="margin-right: 15px" :style="{'background-color': item.id, 'border': item.showContent ? item.border : '3px solid transparent'}" :key="index" class="content" @click="checkPen(item,index)">
                </div>
              </div>
            </div>
            <div style="flex: 1"></div>
            <div style="display: flex">
              <img :src="clearIconSrc" class="icon-clear" height="36px" @click="cancelEditCanvas" style="margin-right: 80px">
              <img :src="removeIconSrc" class="icon-clear" height="36px" @click="confirmEditCanvas">
            </div>
          </div>
        </div>
        <div class="event-content">
          <span class="event-title"><span class="is-required">*</span>{{ $t('remotePatrol.name') }}</span>
          <el-input
            v-model="eventName"
            size="mini"
            class="storevue-input-white"
            @input="eventNameChanged"
            @blur="notShowInputRuleTips('eventName')"/>
          <span v-if="eventNameRuletip" class="rules" style="margin-left:0;">{{ $t('remotePatrol.eventNameRuletip') }}</span>
          <span v-if="showEventNameInfo" class="error-class">{{ $t('remotePatrol.emptyTitle') }}</span>
          <span class="event-title">{{ $t('remotePatrol.description') }}</span>
          <div v-for="(_item,_index) in sourceList" :key="_index" class="source-details">
            <div class="flex-center">
              <img
                :src="deleteInspectIcon"
                alt="delete"
                @click="deleteItemResource(_index)"
              />
              <div
                class="paper flex-center margin-bottom-sm inspect-text"
              >
                <div style="flex: 1; text-align: left; margin: 5px">
                  {{ _item.src }}
                </div>
                <hr class="hr-vertical" />
                <img
                  :src="editInspectIcon"
                  alt="edit"
                  style="margin: 5px"
                  @click="editItemResource(_index)"
                />
              </div>
            </div>
          </div>
          <div style="position: relative">
          <el-input
            :autosize="{ minRows: 4, maxRows: 7 }"
            v-model="inspectInput"
            :placeholder="$t('remotePatrol.descPlaceholder')"
            size="mini"
            class="storevue-textarea-white"
            type="textarea"
            resize="none"
            @input="eventDesChanged"
            @blur="notShowInputRuleTips('eventDes')"/>
            <span v-if="eventDesRuletip" class="rules" style="margin-left:0;">{{ $t('remotePatrol.comentRuletip') }}</span>
            <button
              class="inspect-btn"
              @click="submitItemResource()"
            >
              {{$t('remotePatrol.confirm')}}
            </button>
          </div>
        </div>
      </div>
    </dialog-pop>

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
import { getCookie } from '@/common/auth';
import filterString from '@/common/filterString';
import Environment from '@/common/environment';
import html2canvas from 'html2canvas';
import util from '@/common/util';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DialogPop from '@/components/DialogPop.vue';

export default {
  name: 'EzvizVideo',
  components: {DialogPop},
  props: {
    channelInfo: {
      type: Object,
      default: {}
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
    },
    videoAuthority: {
      type: Boolean,
      default: true
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
      eventDesEdit: {index: -1, val: ''},
      clearIconSrc: require('../../static/img/clear.png'),
      removeIconSrc: require('../../static/img/cancel.png'),
      penBtnSrc: require('../../static/img/edit_btn.png'),
      voiceOffIcon: require('../../static/img/voiceoff.png'),
      voiceONIcon: require('../../static/img/voiceon.png'),
      screenColIcon: require('../../static/img/screen-collapse.png'),
      screenExpIcon: require('../../static/img/screen-expand.png'),
      snapshotIcon: require('../../static/img/snapshot.png'),
      deleteInspectIcon: require('../../static/img/cross.png'),
      editInspectIcon: require('../../static/img/pen.png'),
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
      muted: true,
      showCutDialog: false,
      imageCanvas: new Image(),
      imageCanvasList: [],
      penList: [
        {
          id: '#FFFFFF',
          showContent: true,
          border: '3px solid rgb(159,159,159)'
        },
        {
          id: '#f11e66',
          showContent: false,
          border: '3px solid rgb(181,100,128)'
        },
        {
          id: '#ffc136',
          showContent: false,
          border: '3px solid rgb(137,122,88)'
        }
      ],
      penChecked: '#FFFFFF',
      showCancelContent: false,
      showPen: false,
      showPenBtn: false,
      imgSrc: '',
      canvasEl: '',
      isMouseDown: false,
      flag: 0,
      eventName: '',
      eventDes: '',
      inspectInput: '',
      curEditIndex: -1,
      sourceList: [],
      showSnapshotFeedbackDialog: false,
      timerPlayReal: null,
      realTimeSpeed: 0,
      initPlayerWidth: 0,
      initPlayerHeight: 0,
      isLoading: false,
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
      currentChannelId: null,
      isLoaded: false,
      editCount: 0,
      showEventNameInfo: false,
      changeId: false,
      eventNameRuletip: false,
      eventDesRuletip: false,
      paused: true,
      qualityVisible: false,
      sizeVisible: false,
      playBackVisible: false,
      curSizeIndex: 0,
      curQualityIndex: 1,
      curPlayBackIndex: 0,
      videoQualityList: [
        {
          label: this.$t('remotePatrol.highDefinition'),
          value: 0
        },
        {
          label: this.$t('remotePatrol.fluency'),
          value: 1
        }
      ],
      notUpdateMsg: false
    };
  },

  watch: {
    channelInfo: {
      handler(newChannel, oldChannel) {
        if (Object.keys(oldChannel).length > 0 && newChannel.ivsId !== oldChannel.ivsId) {
          try {
            this.getEzvizAccessToken(newChannel.ivsId);
            if (this.playState) {
              this.stopRealTime();
              this.$nextTick(() => {
                this.realTime();
              });
            } else {
              this.$nextTick(() => {
                this.realTime();
              });
            };
          }catch (e) {
            console.log(e);
          }
        }
      },
      deep: true
    },

    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.channelInfo = null;
        self.showError = false;
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
      // console.log(val);
      if (val >= 300) {
        if (self.fullWindow) {
          !self.muted && self.fullDecoder.closeSound();
          self.fullDecoder.stop();
        } else {
          !self.muted && self.decoder.closeSound();
          self.decoder.stop();
        }
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal = null;
        self.playState = false;
        self.showModelContent = false;
        self.muted = true;
        self.times = 0;
        self.playBackState = false;
      }
    },

    async ivsId(newValue, oldValue) {
      if (newValue.length > 0) {
        this.getVideoQualityIndex();
        try {
          await this.getEzvizAccessToken(newValue);
        } catch (e) {
          console.log(e);
        }

      }
    }
  },

  async mounted() {
    const self = this;
    const o = self.$refs.myPlayer;
    self.initPlayerWidth = o.offsetWidth;
    self.initPlayerHeight = 420;
    window.addEventListener('resize', self.resizeFun, false);
    window.addEventListener('visibilitychange', self.visibleChange, false);
  },

  beforeDestroy() {
    window.clearInterval(this.timerPlayReal);
    this.realTimeSpeed = 0;
    if (this.playState) {
      this.decoder.closeSound();
      this.decoder.stop();
    }
    window.removeEventListener('resize', this.resizeFun);
    window.removeEventListener('visibilitychange', this.visibleChange);
    this.resizeFun = null;
    this.visibleChange = null;
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

    ivsId() {
      return this.channelInfo ? this.channelInfo.ivsId : ''
    }
  },

  methods: {
    deleteItemResource (index) {
      const self = this
      this.sourceList = this.sourceList.filter((source, idx) => idx !== index)
    },
    editItemResource (index) {
      this.curEditIndex = index
      this.inspectInput = this.sourceList[index].src
    },
    submitItemResource() {
      const self = this;
      if (this.inspectInput.trim().length === 0) return
      if (this.curEditIndex > -1) {
        this.sourceList = this.sourceList.map((source, idx) => {
          if (idx === self.curEditIndex) return {
            ...source,
            src: self.inspectInput,
          }
          else return { ...source }
        })
        this.curEditIndex = -1
      } else {
        this.sourceList.push({
          mediaType: 3,
          src: this.inspectInput,
        })
      }
      this.inspectInput = ''
    },
    onClickQualityLabel(index){
      this.curQualityIndex = index;
      this.qualityVisible = false;
      this.saveVideoQuality();
      this.stopPlayingVideoAndPlay();
    },
    saveVideoQuality() {
      const params = {
        videoQualityIndex: this.curQualityIndex
      };
      const searchConditon = {
        path: this.storeId,
        params: params
      };
      SearchConditionUtil.saveSearchCondition(searchConditon);
    },

    getVideoQualityIndex() {
      const templateJson = SearchConditionUtil.getSearchCondition(this.storeId);
      if (Object.keys(templateJson).length > 0) {
        this.curQualityIndex = templateJson.videoQualityIndex;
      }
    },

    stopPlayingVideoAndPlay(){
      if (this.fullWindow) {
        if (this.playState) {
          !this.muted && this.fullDecoder.closeSound();
          this.fullDecoder.stop();
          this.fullDecoder = null;
        }
        this.resetVideoSize();
      } else {
        if (this.playState) {
          !this.muted && this.decoder.closeSound();
          this.decoder.stop();
          this.decoder = null;
        }
        this.initVideo();
      }
    },

    checkPro(item, index) {

      const self = this;
      self.curSizeIndex = index
      self.proportion = item;
      self.sizeVisible = false;
      if (self.fullWindow) {
        if (self.playState) {
          !self.muted && self.fullDecoder.closeSound();
          self.fullDecoder.stop();
          self.fullDecoder = null;
        }
        self.resetVideoSize();
      } else {
        if (self.playState) {
          !self.muted && self.decoder.closeSound();
          self.decoder.stop();
          self.decoder = null;
        }
        self.initVideo();
      }
    },

    async changeHistoryTime(newValue) {
      const self = this;
      if (this.videoAuthority === false) {
        this.showError = true;
        this.errorMsg = this.$t('remotePatrol.videoLicense');
        return;
      }
      if (!self.channelInfo.id || !self.channelInfo.ivsId) {
        self.showError = true;
        self.errorMsg = self.$t('remotePatrol.lackParams');
        return;
      }
      self.showError = false;
      self.times = 0;
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

    getEzvizAccessToken(ivsId) {
      const self = this;
      if (this.videoAuthority === false) {
        return;
      }
      this.notUpdateMsg = false;
      const params = {};
      params.ivsId = ivsId;
      return new Promise((resolve, reject) => {
        if (self.currentIvsId === ivsId) {
          resolve(self.accessToken);
        } else {
          getEzvizAccessToken(params).then(result => {
            if (result.errCode === 0) {
              self.currentIvsId = ivsId;
              self.accessToken = result.data.accessToken;
              self.areaDomain = {
                domain: result.data.areaDomain
              };
              self.ezvizExpireTime = result.data.expireTime;
              resolve(result.data.accessToken);
            } else {
              this.showError = true;
              this.errorMsg = util.setErrorMsg(result.errMsg, false);
              this.notUpdateMsg = true;
              throw Error(result.errMsg);
            }
          })
            .catch(error => {
              reject(error);
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
      if (self.videoAuthority === false) {
        this.showError = true;
        this.errorMsg = this.$t('remotePatrol.videoLicense');
        return;
      }

      obj.deviceSerial = self.channelInfo.ivsId;
      try {
        const result = await self.getDeviceIsEncrypt(qs.stringify(obj));
        let suportUpdatePass = false;
        if (result === 1) {
          suportUpdatePass = await getDeviceCapacity(qs.stringify(obj));
        }
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
            if (self.fullWindow) {
              self.initFullWindowVideo();
            } else {
              self.initVideo();
            }
          });
        }
      } catch (err) {
        console.log('EzvizVideo-checkIfEncry' + err);
      }
    },

    async getDeviceIsEncrypt(params) {
      const ret = await getIsEncrypt(params);
      return ret;
    },

    async initVideo() {
      const self = this;
      self.showError = false;
      self.showModelContent = false;
      if (self.accessToken.length === 0) {
        self.showError = true;
        self.errorMsg = this.notUpdateMsg ? this.errorMsg : this.$t('remotePatrol.getAccessTokenError');
        return;
      }
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
        self.getVideoUrl();
        if (self.accessToken === '') {
          util.notify(self.$t('remotePatrol.getAccessTokenError'), 'warning', 3000);
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
      const self = this;
      self.isLoading = false;
      self.showError = true;
      self.errorMsg = self.getErrorMsg(e);
      if (self.playState) {
        if (!self.fullWindow) {
          !self.muted && self.decoder.closeSound();
          self.decoder.stop();
        } else {
          !self.muted && self.fullDecoder.closeSound();
          self.fullDecoder.stop();
        }
      } else {
        self.decoder.stop();
      }
      self.playState = false;
      self.muted = true;
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
      // self.editCount++;
      self.showError = false;
      self.errorMsg = '';
      self.realTimeSpeed = 0;
      window.clearInterval(self.timerPlayReal);
      self.timerPlayReal = window.setInterval(() => {
        self.realTimeSpeed = self.realTimeSpeed + 1;
        if (self.playBack) {
          self.getProcess();
        }
      }, 1000);
      setTimeout(() => {
        self.playState = true;
        self.isLoading = false;
        self.showModelContent = true;
        if (!self.muted) {
          self.fullWindow ? self.fullDecoder.openSound() : self.decoder.openSound();
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
      // self.editCount++;
      self.showError = false;
      self.errorMsg = '';
      if (self.playState) {
        self.realTimeSpeed = self.realTimeSpeed + 1;
        if (self.playBack) {
          self.getProcess();
        }
      }

      setTimeout(() => {
        self.showModelContent = true;
        self.isLoading = false;
        if (!self.muted) {
          self.fullDecoder.openSound();
        }
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
        if (self.playBack) {
          self.getProcess();
        }
      }

      setTimeout(() => {
        self.isLoading = false;
        self.showModelContent = true;
        // self.showInfoContent=false;
        if (!self.muted) {
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
      const self = this;
      self.fullWindow = true;
      var ele = document.getElementById('videoContent');
      // ele.style.width = '100%';
      // ele.style.height = '100%';
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
      if (!self.showError) {
        playerEle.style.width = self.initPlayerWidth + 'px';
        playerEle.style.height = self.initPlayerHeight + 'px';
      } else {
        const errEle = self.$refs.errorModel;
        errEle.style.width = '100%';
        errEle.style.height = '100%';
      }
      self.$nextTick(() => {
        ele.style.width = self.initPlayerWidth + 'px';
        ele.style.height = self.initPlayerHeight + 'px';
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
        if (!self.muted) {
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
      if (this.channelInfo === null || Object.keys(this.channelInfo).length === 0) {
        this.showError = true;
        this.errorMsg = this.$t('remotePatrol.lackParams');
        return;
      }
      if (this.videoAuthority === false) {
        this.showError = true;
        this.errorMsg = this.$t('remotePatrol.videoLicense');
        return;
      }
      try {
        await this.getEzvizAccessToken(this.channelInfo.ivsId);
      } catch (e) {
        console.log(e);
      }
      self.checkIfEncry();
      self.isLoaded = true;
    },

    initFullWindowVideo() {
      const self = this;
      if (self.channelInfo == null) {
        return;
      } else {
        const o = document.getElementById('videoContent');
        const height = screen.height;
        const width = self.setVideoWidth(height);
        const playerEle = self.$refs.myPlayer;
        playerEle.style.width = screen.width + 'px';
        playerEle.style.height = screen.height + 'px';
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
      self.muted = true;
      self.showModelContent = false;
      self.playState = false;
      self.curBack = '';
      self.currentTimeValue = 0;
    },

    onMuted(){
      const muted = !this.muted;
      try {
        if (muted) {
          this.fullWindow ? this.fullDecoder.closeSound() : this.decoder.closeSound();
        } else {
          this.fullWindow ? this.fullDecoder.openSound() : this.decoder.openSound();
        }
        this.muted = muted;
      } catch (e) {
        console.log('onMuted-' + e);
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
      self.sourceList = [];
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
          util.notify(msg, 'warning', 3000);
          return false;
        }
        self.showCutDialog = true;
        this.$nextTick(() => {
          self.canvasEl = document.getElementById('icanvas');
          var ctx = self.canvasEl.getContext('2d');
          const img = new Image();
          setTimeout(() => {
            self.imgSrc = sessionStorage.getItem('fileUrl');
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
      self.showCancelContent = true;
      self.showPenBtn = true;
    },

    confirmFeedBackOnSnapshot() {
      const self = this;
      const src = self.canvasEl.toDataURL('image/jpeg');
      const obj = {
        eventName: self.eventName,
        eventDes: self.eventDes,
        src: src,
        sourceList: self.sourceList
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

    stopAndRealTime() {
      const self = this;
      self.showError = false;
      if (self.playState) {
        self.decoder.stop();
      }
      self.$nextTick(() => {
        self.decoder = null;
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

    adjustProcess(val, label, index) {
      const self = this;
      self.curBack = label;
      self.curPlayBackIndex = index;
      var callback = function(iTime) {
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
      try {
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
            self.initVideo();
          });
        } else {
          self.videoPassword = '';
          self.showInputPassword = true;
        }
      } catch (err) {
        console.log('EzvizVideo-verifyEnterPassword' + err);
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
      self.eventDesEdit.val = content;
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
            self.videoUrl = 'ezopen://' + self.videoPassword + '@open.ezviz.com/' + self.channelInfo.ivsId +
              '/' + self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          } else {
            self.videoUrl = 'ezopen://' + self.videoPassword + '@open.ys7.com/' + self.channelInfo.ivsId +
              '/' + self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          }
        } else {
          if (isGlobalWebsite) {
            self.videoUrl = 'ezopen://open.ezviz.com/' + self.channelInfo.ivsId + '/' +
              self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          } else {
            self.videoUrl = 'ezopen://open.ys7.com/' + self.channelInfo.ivsId + '/' +
              self.channelInfo.channelId + '.rec?begin=' + self.startTime + '&end=' + self.endTime;
          }
        }
      } else {
        const videoStream = this.curQualityIndex === 0 ? '.hd.live' : '.live';
        if (self.videoPassword.length > 0) {
          self.videoUrl = 'ezopen://' + self.videoPassword + '@open.ys7.com/' + self.channelInfo.ivsId +
            '/' + self.channelInfo.channelId + videoStream;
        } else {
          if (isGlobalWebsite) {
            self.videoUrl = 'ezopen://open.ezviz.com/' + self.channelInfo.ivsId + '/' +
              self.channelInfo.channelId + videoStream;
          } else {
            self.videoUrl = 'ezopen://open.ys7.com/' + self.channelInfo.ivsId + '/' +
              self.channelInfo.channelId + videoStream;
          }
        }
      }
    },

    setVideoWidth(height) {
      let width = 0;
      switch (this.proportion) {
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
      return width;
    },

    async startVideo(ivsId, channelId, startTs) {
      try {
        await this.getEzvizAccessToken(ivsId);
        this.playState && this.stopRealTime();
        this.realTime();
      } catch (e) {
        console.log(e);
      }

    },

    stopVideoPlay() {
      this.stopRealTime();
    },

    playHistoryVideo() {

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
  .margin-bottom-top-sm {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .margin-bottom-sm {
    margin-bottom: 10px
  }
  .margin-bottom-md {
    margin-bottom: 20px
  }
  .font-size-sm {
    font-size: 12px;
  }
  .font-size-md {
    font-size: 15px;
  }
  .flex-center {
    display: flex;
    align-items: center;
  }
  .hr-vertical {    
    margin: 0;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    border-width: 0;
    border-style: solid;
    border-color: #e6e6e6;
    border-bottom-width: 0;
    height: auto;
    border-right-width: thin;
    -webkit-align-self: stretch;
    -ms-flex-item-align: stretch;
    align-self: stretch;
  }
  .paper {
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  }
  .errorVideo-model{
    margin-bottom: 0;
    height: 100%;
    width: 100%;
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
    .flex-center {
      display: flex;
      align-items: center;
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
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding-left: 30px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
    }
    .icon-footer{
      width: 100%;
      height: 44px;
      position: absolute;
      bottom: 0px;
      color: #fff;
      display: flex;
      /*overflow: hidden;*/
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      z-index: 10;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      .snapshot {
        margin: 0 calc(20/1920*100vw);
      }
      .iconlside{
        text-align: left;
        .iconplay{
          font-size: 18px;
          margin-left: calc(60/1920*100vw);
          cursor: pointer;
        }
        .icon-auido{
          font-size: 18px;
          margin-right: calc(20/1920*100vw);
          cursor: pointer;
        }
      }
      .footer-right{
      }
      .iconrside{
        font-size: 13px;
        .quality-content{
          width: 48px;
          margin-right: calc(30/1920*100vw);
        }
        .quality-label{
          width: 100%;
          height: 30px;
          border: 1px solid #fff;
        }
        span{
          font-size: 13px;
          // margin-left: 20px;
        }
        .speed-content{
          .el-test{
            width: 45px;
            >>> span.el-input__suffix {
              display: none;
            }
            >>> .el-select-dropdown__item {
              padding: 0px;
            }
            >>> .el-input.is-focus .el-input__inner {
              border-color: #fff;
              // background-color: rgba(0, 106, 183, 0.4);
            }
          }
          .video-quality{
          }
        }
      }
    }
    .screen-content{
      margin-right: calc(20/1920*100vw);
      .iconscreen{
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
      }
      .cancel-content{
        position: absolute;
        bottom: 5px;
        width: 100%;
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
        // width: 80%;
      }
    }
    #previewCutVideo{
      @include point(margin-bottom,20);
      @include point(margin-top,10);
    }
    .cancel-content{
      position: absolute;
      bottom: 5px;
      width: 100%;
      padding: 0 90px;
      display: flex;
      align-items: center;
      background-color: rgba(72, 72, 72, .65);
      z-index: 10;
      height: 50px;
      // overflow: hidden;
      .content{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;

      }
    }
    .icon-right{
      display: flex;

      .pen-btn{
        width: 36px;
        height: 36px;
        cursor: pointer;
      }
      .pen-content {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
<style lang="scss">
  .select-popClass .el-select-dropdown__item{
    font-size:12px;
    height: 24px;
    line-height: 24px;
    background-color: #34374A;
    color:#fff;
    text-align:center;
  }
  .select-popClass .el-select-dropdown__item.hover{
    color:#006ab7 !important;
    background-color:#34374A !important;
  }
  .select-popClass .el-select-dropdown__item:hover{
    color:#006ab7 !important;
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
    top: 25px!important;
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
    z-index: 900;
  }

  .quality-button {
    // width: calc(40/1920*100vw);
    padding: calc(3/1920*100vw);
    span {
      padding: calc(3/1920*100vw) calc(10/1920*100vw);
    }
    min-width: calc(60/1920*100vw);
    min-height: unset;
    color: #fbfafc;
    background-color: transparent;
    border: 1px solid #fff;
    font-size: 12px;
  }
  .quality-button.el-button:hover, .quality-button.el-button:focus, .quality-button.el-button:active{
    color: #fbfafc;
    background-color: transparent;
    border: 1px solid #fff;
  }
  .el-popover.quality-tooltip{
    min-width: calc(60/1920*100vw);
    text-align: center;
    background-color: transparent;
    border-radius: 0;
    border: none;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;
  }
  .quality-tooltip .popper__arrow{
    display: none;
  }
  .quaility-label{
    cursor: pointer;
    color: #fbfafc;
    background-color: rgba(52, 55, 74, .6);
    font-size: 12px;
  }
  .checked-label{
    border: 1px solid #006ab7;
    background-color: rgba(0, 106, 183, .6);
  }
</style>

<style lang="scss" scoped>
  .select-popClass .el-select-dropdown__item.hover{
    color:#006ab7 !important;
    background-color:#34374A !important;
  }
  .select-popClass .el-select-dropdown__item:hover{
    color:#006ab7 !important;
    background-color:#34374A;
  }
  .el-select-dropdown__wrap .el-select-dropdown__item:hover{
    /* color:#006ab7 !important; */
    background-color:#34374A;
  }

</style>