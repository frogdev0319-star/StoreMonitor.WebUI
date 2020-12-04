<template>
  <el-row :class="isREC ? 'noeventClass' : ''" class="el-container">
    <el-col :span="16" :class="{ liseAnmiClass: showSpread }" class="lside">
      <div class="el-header-title">
        <span v-if="showStoreUp" class="lside-title">
          {{ store.storeTitle }}
        </span>
        <div
          v-if="showStoreUp"
          :class="store.storeUp ? 'coll' : 'nocoll'"
          class="storeUp-content"
          @click="addStoreUp"
        >
          <i
            :class="store.storeUp ? 'coll-icon' : 'nocoll-icon'"
            class="iconfont icon-iconfontstart"
            style="vertical-align: middle"
          />
          <span :class="store.storeUp ? 'coll-font' : 'nocoll-font'">
            {{ store.storeUpTitle }}</span>
        </div>
        <el-button
          v-loading.fullscreen.lock="fullscreenLoading"
          v-if="showStoreUp"
          :size="varyWindowWidth > 1680 ? 'small' : 'mini'"
          class="el-submit"
          type="primary"
          @click="submit"
        >{{ $t("remotePatrol.submit") }}
        </el-button>
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
            <div class="content" @click="cancleEditCanvas">
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
            $t("remotePatrol.cancel")}}</el-button>
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
        v-if="showOuter"
        :title="$t('remotePatrol.view')"
        :visible.sync="showOuter"
        :close-on-click-modal="false"
        :width="680 * percentHeight + 'px'"
        height="300px"
        top="5%"
      >
        <div class="canvas-content" style="overflow: hidden">
          <hr class="dialog-hr" >
          <div class="dialog-img-content">
            <img
              :src="checkImgSrc"
              :width="600 * percentHeight"
              :height="430 * percentHeight"
            >
          </div>
        </div>
      </el-dialog>
      <dialog-vue
        :dialog-title="changeStoreObj.title"
        :show-info="changeStoreObj.showInfo"
        :is-warning="changeStoreObj.isWarning"
        :dialog-closed="changeStoreObj.dialogCosed"
        @confirmed="changeStoreDialog"
        @canceled="canceldChangeStore"
      />
      <dialog-vue
        :dialog-title="changeChannelObj.title"
        :show-info="changeChannelObj.showInfo"
        :is-warning="changeChannelObj.isWarning"
        :dialog-closed="changeChannelObj.dialogCosed"
        @confirmed="changeChannelDialog"
        @canceled="cancelchangeChannel"
      />
      <dialog-vue
        :dialog-title="noBindDeviceObj.title"
        :show-info="noBindDeviceObj.showInfo"
        :is-warning="noBindDeviceObj.isWarning"
        :dialog-closed="noBindDeviceObj.dialogCosed"
        @confirmed="noBindDeviceDialog"
        @canceled="canceldNoBind"
      />
      <dialog-vue
        :dialog-title="noStoreUser.title"
        :show-info="noStoreUser.showInfo"
        :is-warning="noStoreUser.isWarning"
        :dialog-closed="noStoreUser.dialogCosed"
        @confirmed="noStoreUserDialog"
        @canceled="cancelNoUser"
      />
      <dialog-vue
        :dialog-title="videoLoadingObj.title"
        :show-info="videoLoadingObj.showInfo"
        :is-warning="videoLoadingObj.isWarning"
        :dialog-closed="videoLoadingObj.dialogCosed"
        @confirmed="videoLoadingDialog"
        @canceled="cancelVideoLoading"
      >>
      </dialog-vue>

      <div v-if="!isEzviz">
        <div id="videoContent" class="video-content" v-loading="isLoading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <div v-if="showModelContent" class="video-model">
            <span v-if="showControlInfo" id="channelName">
              {{channel.channelName}}</span>
            <div v-if="showControlInfo" class="icon-footer">
              <div v-if="showStoreUp" class="iconlside">
                <i class="iconfont iconplay" :class="paused ? 'icon-bofang1' : 'icon-zantingtingzhi'"
                  @click="onPlay"
                />
              </div>
              <div class="iconrside">
                <div v-if="playBackState" class="speed-content">
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
                <div v-if="showStoreUp" class="screen-content">
                  <i :class="fullScreen ? 'icon-tuichuquanping' : 'icon-quanping'" class="iconfont iconscreen"
                    @click="controlScreen"
                  />
                </div>
              </div>
            </div>
            <div v-if="playBackState" class="progress-content">
              <b-progress
                id="bprogress"
                :value="currentTimeValue"
                :max="durationTimeValue"
                class="mb-3 el-prog"
                height="0.2rem"
                style="margin-bottom: 0px !important"
              />
            </div>

            <div v-if="showCutContent" :class="lang === 'en' ? 'en-iconright' : 'iconright'">
              <div class="paizhao-content" @click="cutPicture">
                <i
                  class="iconfont icon-xiangji iconpaizhao"
                  style="font-size: 18px"
                />
                <span>{{ $t("remotePatrol.snapshot") }}</span>
              </div>
            </div>
          </div>
          <div v-else class="errorVideo-model">
            <span>{{ errorText }}</span>
          </div>
          <video
            id="previewVideo"
            :controls="showControls"
            height="83%"
            width="90%"
            prload
            autoplay
            class="video-js vjs-fill"
            @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)"
          />
        </div>
      </div>
      <ezviz-video
        v-else
        ref="ezvizVideo"
        :store-id="store.storeId"
        :channel-info="channel"
        :source-list-length="sourceList.length"
        :is-store-monitor="true"
        :play-back="playBackState"
        :cur-time="playBackTime"
        @confirmEzvizCanvas="editEzvizCanvas"
      />
      <div class="el-event">
        <div :class="corEvent ? 'event-lside' : ''">
          <span class="event-title">{{ $t("remotePatrol.createMothod") }}</span>
          <div class="el-radio-content">
            <div
              v-for="(item, index) in evBtns"
              :key="index"
              :class="item.isActive ? 'activeClass' : ''"
              class="el-radio-details"
              @click="clickEventBtn(item, index)"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
          <div class="lside-scrollbar">
            <el-scrollbar style="height: 100%" class="el-menuscrollbar">
              <span class="event-title"><span class="is-required">*</span>{{ $t("remotePatrol.title") }}</span>
              <el-input
                :disabled="corEvent"
                v-model="eventName"
                size="mini"
                class="name-input"
                @input="eventNameChanged"
                @blur="notShowInputRuleTips('eventName')"
              />
              <span v-if="eventNameRuletip" class="rules">{{ $t("remotePatrol.eventNameRuletip") }}</span>
              <span v-if="showEventNameInfo" class="error-class">{{
                $t("remotePatrol.emptyTitle")}}</span>
              <span v-if="!corEvent" class="event-title">{{ $t("remotePatrol.description") }}</span>
              <span v-else class="event-title"><span class="is-required">*</span>
                {{ $t("remotePatrol.description") }}</span>
              <el-input
                :autosize="{ minRows: 2, maxRows: 7 }"
                v-model="eventDes"
                :placeholder="$t('remotePatrol.descPlaceholder')"
                size="mini"
                class="des-input"
                type="textarea"
                resize="none"
                @input="eventDesChanged"
                @blur="notShowInputRuleTips('eventDes')"
              />
              <span v-if="showEventDescInfo" class="error-class">{{ $t("remotePatrol.enterDesc") }}</span>
              <span v-if="eventDesRuletip" class="rules">{{ $t("remotePatrol.eventDesRuletip") }}</span>

              <div class="source-content">
                <div
                  v-for="(item, index) in sourceList"
                  :key="index"
                  class="source-details"
                >
                  <div v-if="item.mediaType === 2" class="img-content">
                    <i
                      class="el-icon-close icondelete"
                      @click="deleteImg(item, index)"
                    />
                    <img
                      :src="item.src"
                      :width="item.width"
                      :height="item.height"
                      style="cursor: pointer"
                      @click="openOuter(item)"
                    >
                  </div>
                </div>
                <span>*{{ $t("remotePatrol.storeMaxAttach") }}</span>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div v-if="corEvent" id="rightLine" class="right-line" />
        <div v-if="corEvent" class="event-rside">
          <el-scrollbar style="height: 100%" class="el-menuscrollbar">
            <span class="event-title cor-des">{{
              $t("remotePatrol.relevantEvent")
            }}</span>
            <div class="event-content">
              <div
                v-for="(item, index) in eventList"
                :key="index"
                class="event-details"
              >
                <el-radio
                  v-model="curEvent"
                  :label="item.id"
                  class="radio-class"
                  @change="checkEvent"
                >
                  <span :title="item.name" class="event-name">{{
                    item.name
                  }}</span></el-radio
                  >
                <div class="event-date">
                  <span class="date-year">{{ item.dateYear }}</span>
                  <span class="date-day">{{ item.dateDay }}</span>
                </div>
                <p :title="item.descrition" class="event-des">
                  {{ item.descrition }}
                </p>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-col>
    <el-col :span="8" class="rside">
      <div class="el-header-title">
        <span>{{ $t("remotePatrol.selectStores") }}</span>
      </div>
      <el-tabs
        v-model="activeIndex"
        :id="lang === 'en' ? 'en-storetab-content' : 'storetab-content'"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
        >
          <el-scrollbar style="height: 100%" class="el-menuscrollbar">
            <div v-if="index !== 2" class="storeList-content">
              <div
                v-for="(_item, _index) in item.storeList"
                :key="_index"
                :class="_item.isActive ? 'activeClass' : ''"
                class="store-name"
                @click="clickStore(item, index, _item, _index)"
              >
                <el-tooltip
                  :content="_item.name"
                  class="item"
                  effect="dark"
                  placement="bottom"
                >
                  <span>{{ _item.name }}</span>
                </el-tooltip>
              </div>
            </div>

            <div v-else class="storeList-content">
              <el-input
                :placeholder="$t('remotePatrol.enterKeywords')"
                v-model="serachVale"
                size="small"
                class="el-search-input"
                @keyup.enter.native="searchStore"
              >
                <i
                  slot="prefix"
                  class="iconfont icon-sousuo"
                  style="
                    position: relative;
                    top: 6px;
                    left: 6px;
                    font-size: 18px;
                  "
                />
              </el-input>
              <div
                v-for="(_item, _index) in item.storeList"
                :key="_index"
                class="stores"
              >
                <span class="citys">{{ _item.cityName }}</span>
                <div
                  v-for="(itemDs, indexDs) in _item.storeList"
                  :key="indexDs"
                  :class="itemDs.isActive ? 'activeClass' : ''"
                  class="store-name"
                  @click="clickStore(item, index, itemDs, indexDs)"
                >
                  <el-tooltip
                    :content="itemDs.name"
                    class="item"
                    effect="dark"
                    placement="bottom"
                  >
                    <span>{{ itemDs.name }}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <hr class="rside-hr" >
      <div class="channel-content">
        <span>{{ $t("remotePatrol.zoneList") }}</span>
        <el-input
          :placeholder="$t('remotePatrol.channelPlaceholder')"
          v-model="serachChannelValue"
          size="small"
          class="el-search-input el-channel-search-input"
          @keyup.enter.native="searchChannel"
        >
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            style="position: relative; top: 6px; left: 6px; font-size: 18px"
          />
        </el-input>
        <div class="channels-srollbar">
          <div class="arrow-content">
            <i
              v-if="hideLast"
              class="el-icon-arrow-left icon-arrow"
              @click="lastBar"/>
          </div>
          <div class="btn-content">
            <div
              v-for="(item, index) in showChannelBtns"
              :key="index"
              class="btn-details"
            >
              <channel-icon-btn
                :channel-name="item.name"
                :is-online="item.isonline"
                :is-click="item.isClick"
                class="channelBtn"
                @click.native="clickBtn(item, index)"
              />
            </div>
          </div>
          <div class="arrow-content">
            <i
              v-if="hideNext"
              class="el-icon-arrow-right icon-arrow"
              @click="nextBar"
            />
          </div>
        </div>
      </div>
      <hr class="rside-hr" style="margin-top: 0" >
      <div class="time-content">
        <div class="time-title">
          <span class="date-title">{{ $t("remotePatrol.selectDate") }}</span>
          <el-button
            size="mini"
            class="backTime-btn"
            type="primary"
            @click="backCurDate"
          > {{ $t("remotePatrol.backToNow") }}</el-button>
        </div>
        <div class="date-picker-content">
          <el-date-picker
            v-model="dateValue"
            :picker-options="pickerOptions"
            :clearable="false"
            class="date-picker"
            type="date"
            placeholder="日期"
            size="mini"
          />
          <el-time-picker
            v-model="curTime"
            :clearable="false"
            :placeholder="$t('remotePatrol.playTime')"
            class="time-picker"
            size="mini"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  addFavoriteStore,
  deleteFavoriteStore,
  getFavoriteList,
  getStoreList
} from '@/api/store';
import {
  addComment,
  addEvent,
  getEventList,
  getStorageInfo
} from '@/api/event';
import { mapGetters } from 'vuex';
import util from '@/common/util';
import dashAPI from '@/api/dash';
import videojs from '../../../static/video.js';
import ChannelIconBtn from '@/components/ChannelIconBtn.vue';
import DialogVue from '@/components/DialogVue.vue';
import filterString from '@/common/filterString.js';
import { getCookie } from '@/common/auth';
import { setTimeout } from 'timers';
import EzvizVideo from '@/components/EzvizVideo.vue';
import DashHttp from "../../common/DashHttp";
import { getDashServerInfo } from '@/api/device.js';

export default {
  name: 'StoreMoinitor',

  components: {
    ChannelIconBtn,
    DialogVue,
    EzvizVideo
  },

  data() {
    return {
      patrolstore: '',
      PatrolList: [],
      hideLast: false,
      hideNext: false,
      fullscreenLoading: false,
      channelBtns: [],
      showChannelBtns: [],
      allChannelBtns: [],
      store: {},
      showStoreUp: true,
      cityList: [],
      popperClass: 'select-popClass',
      showModelContent: true,
      showControlInfo: true,
      errorText: '',
      showCancelContent: false,
      showCutContent: false,
      playState: false,
      playBackState: false,
      activeIndex: '0',

      curTabIndex: 0,
      curTabItem: null,
      curStoreIndex: 0,
      curStoreItem: null,
      curChannelItem: null,
      curChannelIndex: 0,

      serachVale: '',
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      showDate: true,
      playDate: new Date(),

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
      fullScreen: false,
      curBack: '',
      showControls: false,
      showSpread: false,
      isREC: false,
      showSnapShotDialog: false,
      videoEl: '',
      canvasEl: '',
      timeVideo: 0,
      startTimeCutVideo: 0,
      endTImeCutVideo: 0,

      showCutModel: false,
      penBtnSrc: require('../../../static/img/edit_btn.png'),
      clearIconSrc: require('../../../static/img/clear.png'),
      removeIconSrc: require('../../../static/img/cancel.png'),
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
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
      showModel: true,
      X: 0,
      Y: 0,
      X1: 0,
      Y1: 0,
      isMouseDown: false,
      flag: 0,

      tabList: [
        {
          label: this.$t('remotePatrol.star'),
          storeList: []
        },
        {
          label: this.$t('remotePatrol.visited'),
          storeList: []
        },
        {
          label: this.$t('remotePatrol.allStores'),
          storeList: []
        }
      ],
      tempStoreList: [],
      allInitStoreList: [],
      curTime: new Date(),
      curDate: '',
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      curDay: new Date().getDate(),
      weekTitles: this.$t('remotePatrol.week'),
      weekDays: [],

      startTs: 0,
      protocal: 'DASH',
      sessionId: '',
      channel: {},
      isPlayingFlag: -1,
      evBtns: [
        {
          name: this.$t('remotePatrol.createProblem'),
          isActive: true
        },
        { name: this.$t('remotePatrol.relateProblem'), isActive: false }
      ],
      eventList: [],
      curEvent: '',
      eventName: '',
      eventDes: '',
      sourceList: [],
      oss: null,
      bucketVideo: '',
      bucketImage: '',
      imageCanvas: new Image(),
      imageCanvasList: [],
      timeDrap: false,
      curYearNum: 0,
      curMonthNum: 0,
      curDayNum: 0,
      percentage: 0,
      accountId: '',
      userId: '',
      changeStoreObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.switchInfo'),
        isWarning: true,
        dialogCosed: false
      },
      changeChannelObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.switchInfo'),
        isWarning: true,
        dialogCosed: false
      },
      noBindDeviceObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.notBindCamera'),
        isWarning: false,
        dialogCosed: false
      },
      noStoreUser: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.notSolver'),
        isWarning: true,
        dialogCosed: false
      },
      dialogCommentVideo: false,
      curVideoSrc: '',
      videoSpeed: 0,
      videoSpeedId: 0,
      timerPlayReal: null,
      realTimeSpeed: 0,
      cutDialogcurTime: 0,
      lang: this.$i18n.locale,
      playBackTime: 0,
      realTimeStartTs: 0,
      isFirstLoad: false,
      videoLoadingObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.videoLoading'),
        isWarning: false,
        dialogCosed: false
      },
      isLoading: false,
      showEventNameInfo: false,
      showEventDescInfo: false,
      serachChannelValue: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dateValue: new Date(),
      changeFlag: false,
      eventNameRuletip: false,
      eventDesRuletip: false,

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
      onEndflag: false
    };
  },

  created() {
    this.isFirstLoad = true;
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

    corEvent: function() {
      this.showEventNameInfo = false;
      this.showEventDescInfo = false;
      return this.evBtns[1].isActive;
    },

    isEzviz() {
      let self = this;
      console.log(self.$store.state.user);
      return self.$store.state.user.isEzviz;
    }

  },

  watch: {
    accountChanged(val, oldVal) {
      console.log(val);
      let self = this;
      if (val !== 0) {
        self.changeBrand();
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
          console.log(self.$route.meta.keepAlive);
        }, 300);
      }
    },

    realTimeSpeed(val) {
      let self = this;
      console.log(val);
      if (val >= 300) {
        self.stopVideoPlay();
        self.stopTimer();
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === 'storeSubEvent') {
      to.meta.isBack = true;
    } else {
      to.meta.isBack = false;
    }
    console.log(to.meta.keepAlive);
    next((vm) => {
      vm.clearEvent();
    });
  },

  beforeRouteLeave(to, from, next) {
    let self = this;
    window.clearInterval(self.timeid);
    window.clearInterval(self.timerPlayReal);
    self.isPlayingFlag = -1;
    self.timerPlayReal = null;
    self.timeid = null;
    if (!self.isEzviz) {
      self.stopVideoPlay();
    } else {
      self.$refs.ezvizVideo.stopRealTime();
    }
    if (to.name !== 'storeSubEvent') {
      from.meta.keepAlive = false;
      if (self.previewplayer) {
        self.previewplayer.dispose();
      }
    } else {
      from.meta.keepAlive = true;
    }
    console.log(from.meta.keepAlive);
    next();
  },

  async mounted() {
    let self = this;
    self.isREC = false;
    document.addEventListener('mouseup', self.mouseUpAction, false);
    self.myDivHeight();
    self.getOssInfo();
    self.getUpLoadBucketInfo();
    self.getInitStoreData();
    self.getFaStoreData();
    self.getDashUrlInfo();
    window.onresize = function() {
      if (!self.checkFull()) {
        self.fullScreen = false;
        let ele = document.getElementById('videoContent');
        ele.style.width = 'auto';
        ele.style.height = 'auto';
      }
    };
    window.addEventListener('visibilitychange', self.visibilityChange, false);
  },

  beforeDestroy() {
    let self = this;
    document.removeEventListener('mouseup', self.mouseUpAction);
    window.removeEventListener('visibilitychange', self.visibilityChange);
    window.onresize = null;
    self.mouseUpAction = null;
    self.visibilityChange = null;
  },

  methods: {
    visibilityChange() {
      let self = this;
      if (document.hidden) {
        if (self.playState && !self.playBackState) {
          self.stopVideoPlay()
          self.stopTimer();
        }
      } else {
        console.log(this.currentState);
        if(this.currentState === 'loading'){
          self.startVideo(self.channel.ivsId, self.channel.channelId, null)
        }
      }
    },

    changeBrand() {
      let self = this;
      self.clearEvent();
      if(!self.isEzviz){
        self.stopVideoPlay();
        self.previewplayer && self.previewplayer.dispose();
      }
      self.activeIndex = '0';
      self.accountId = localStorage.getItem('oss_bucket');
      self.hideLast = false;
      self.hideNext = false;
      self.evBtns[0].isActive = true;
      self.evBtns[1].isActive = false;
      self.changeFlag = true;
      self.playBackState = false;
      self.currentTimeValue = 0;
      self.getInitStoreData();
      self.getFaStoreData();
    },

    getUpLoadBucketInfo() {
      let self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
    },

    getOssInfo() {
      let self = this;
      self.accountId = localStorage.getItem('oss_bucket');
      let userId = getCookie('UserId');
      self.userId = userId;
    },

    clearEvent() {
      let self = this;
      self.eventName = '';
      self.eventDes = '';
      self.sourceList = [];
      self.curEvent = '';
      self.showEventNameInfo = false;
    },

    getFaStoreList() {
      let self = this;
      return new Promise((resolve, reject) => {
        getFavoriteList().then((res) => {
          resolve(res);
        });
      });
    },

    getAllStoreList() {
      let self = this;
      let params = {
        filter: {
          page: 0,
          size: 2000
        }
      };
      return new Promise((resolve, reject) => {
        getStoreList(params).then((res) => {
          resolve(res);
        });
      });
    },

    async getStoreList() {
      let self = this;
      let getStoreTemp = (data) => {
        let temp = [];
        data.forEach((item, index) => {
          let obj = {};
          if (self.store.storeId === item.storeId) {
            obj.isActive = true;
          } else {
            obj.isActive = false;
          }
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          temp.push(obj);
        });
        return temp;
      };
      let data;
      switch (Number(self.activeIndex)) {
        case 0:
          data = await self.getFaStoreList();
          if (data.errCode === 0) {
            let storeData = data.data;
            self.tabList[0].storeList = getStoreTemp(storeData);
          }
          break;
        case 1:
          data = self.getStoreObj();
          console.log(data);
          self.tabList[1].storeList = getStoreTemp(data);
          break;
        case 2:
          self.tabList[2].storeList.forEach((item, index) => {
            item.storeList.forEach((_item) => {
              if (_item.storeId === self.store.storeId) {
                _item.isActive = true;
              } else {
                _item.isActive = false;
              }
            });
          });
          break;
      }
    },

    /**
     * add favorite or delete favorite
     */
    async getFaStoreData(storeData) {
      let self = this;
      let getStoreTemp = (data) => {
        let temp = [];
        data.forEach((item, index) => {
          let obj = {};
          if (index === 0) {
            obj.isActive = true;
          } else {
            obj.isActive = false;
          }
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          temp.push(obj);
        });
        return temp;
      };
      let res = await self.getFaStoreList();
      if (res.errCode === 0) {
        let storeData = res.data;
        self.tabList[0].storeList = getStoreTemp(storeData);
        if (storeData.length === 0) {
          self.showStoreUp = false;
          self.store = {};
          self.channel = {};
          self.channelBtns = [];
          self.showChannelBtns = [];
          self.allChannelBtns = [];
        } else {
          let obj = {};
          obj.storeId = storeData[0].storeId;
          obj.storeName = storeData[0].name;
          obj.storeTitle = storeData[0].name;
          obj.userName = storeData[0].userName;
          obj.storeUp = true;
          obj.storeUpTitle = self.$t('remotePatrol.stared');
          self.store = obj;
          self.showStoreUp = true;
          let curStoreId = storeData[0].storeId;

          let storeObj = {
            storeId: curStoreId
          };

          self.saveStoreObj(storeObj);
          self.getChannelByStore(self.tabList[0].storeList[0]);
        }
      }
    },

    async getInitStoreData(storeData) {
      let self = this;
      let getStore2Temp = (data) => {
        let cityList = [];
        data.forEach((item) => {
          if (cityList.map((x) => x.city).indexOf(item.city) === -1) {
            let obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        let storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          let temp = [];
          let obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city === data[j].city) {
              let obj = {};
              obj.isActive = false;
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite =
                data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      let res = await self.getAllStoreList();
      if (res.errCode === 0) {
        let storeData = res.data.content;
        self.allInitStoreList = storeData;
        if (storeData.length === 0) {
          self.tabList[2].storeList = [];
          self.tempStoreList = [];
        } else {
          self.tabList[2].storeList = getStore2Temp(storeData);
          self.tempStoreList = getStore2Temp(storeData);
        }
      }
    },

    addStoreUp() {
      let self = this;
      let temp = [];
      temp.push(self.store.storeId);
      let params = {
        storeIds: temp
      };
      if (!self.store.storeUp) {
        addFavoriteStore(params).then((res) => {
          if (res.errCode === 0) {
            self.store.storeUp = true;
            self.store.storeUpTitle = self.$t('remotePatrol.stared');
            self.getStoreList();
            self.tabList[2].storeList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId === _item.storeId) {
                  _item.favorite = true;
                }
              });
            });
            self.tempStoreList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId === _item.storeId) {
                  _item.favorite = true;
                }
              });
            });
            self.allInitStoreList.forEach((item, index) => {
              if (self.store.storeId === item.storeId) {
                item.favorite = true;
              }
            });
          }
        });
      } else {
        deleteFavoriteStore(params).then((res) => {
          if (res.errCode === 0) {
            self.store.storeUp = false;
            self.store.storeUpTitle = self.$t('remotePatrol.clickToStar');
            self.getStoreList();
            self.tabList[2].storeList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId === _item.storeId) {
                  _item.favorite = false;
                }
              });
            });
            self.tempStoreList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId === _item.storeId) {
                  _item.favorite = false;
                }
              });
            });
            self.allInitStoreList.forEach((item, index) => {
              if (self.store.storeId === item.storeId) {
                item.favorite = false;
              }
            });
          }
        });
      }
    },

    getEventList() {
      let self = this;
      let date = new Date();
      let params = {
        beginTs: date.getTime() - 3600 * 24 * 30 * 1000 * 30,
        endTs: date.getTime(),
        clause: {
          storeId: self.store.storeId,
          status: 0,
          sourceType: 0
        },
        filter: {
          page: 0,
          size: 5
        },
        order: {
          direction: 'desc',
          property: 'ts'
        }
      };
      return new Promise((resolve, reject) => {
        getEventList(params).then((res) => {
          let data = res.data.content;
          resolve(data);
        });
      });
    },

    async clickEventBtn(item, index) {
      let self = this;
      self.eventName = '';
      self.eventDes = '';
      self.curEvent = '';
      if (index === 1) {
        item.isActive = true;
        self.evBtns[0].isActive = false;
        let data = await self.getEventList();
        data = data.slice(0, 5);
        let temp = [];
        data.forEach((item, index) => {
          let obj = {};
          obj.id = item.id;
          obj.name = item.subject;
          obj.descrition = item.initialComment.description;
          obj.dateYear = util.getYearStr(item.ts);
          obj.dateDay = util.getDayStr(item.ts);
          temp.push(obj);
        });
        self.eventList = temp;
      } else {
        item.isActive = true;
        self.evBtns[1].isActive = false;
      }
    },

    checkEvent(val) {
      let self = this;
      self.eventList.forEach((item) => {
        if (item.id === val) {
          self.eventName = item.name;
        }
      });
      self.showEventNameInfo = false;
    },

    getCurTime() {
      let self = this;
      let year = self.dateValue.getFullYear();
      let month = self.dateValue.getMonth() + 1;
      let day = self.dateValue.getDate();
      let hours = self.curTime.getHours();
      let min = self.curTime.getMinutes();
      let second = self.curTime.getSeconds();
      let date =
        year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + second;
      let d = new Date(date);
      return d;
    },

    changeDate(val) {
      let self = this;
      self.startTs = 0;
      self.showModelContent = true;
      let d = self.getCurTime();
      console.log(d);
      self.curTime = d;
      let dstr = Number(d.getTime().toString().substr(0, 10));
      self.startTs = dstr;
      console.log(self.startTs);
      self.playBackTime = Number(d.getTime().toString());
      self.currentTimeValue = 0;
      self.playBackState = true;
      self.realType = false;
      self.curSpeed = '1 X';
      self.curBack = '';
      if (self.timeid != null) {
        window.clearInterval(self.timeid);
        self.timeid = null;
        self.timeid = 0;
      }
      if (!self.isEzviz) {
        self.startVideo(self.channel.ivsId, self.channel.channelId, self.startTs);
        self.realTimeStartTs = self.startTs;
      } else {
        console.log('ezviz');
        self.changeFlag = false;
        self.$refs.ezvizVideo.changeHistoryTime(self.playBackTime);
      }
    },

    getFileUrl(fileName) {
      let self = this;
      let bucketName = self.oss.ossBucketName;
      let endpoint = self.oss.ossEndPoint;
      let key = fileName;
      if (self.oss.ossVendor === 2) {
        return `https://${endpoint}/${bucketName}/${fileName}`;
      } else {
        return `http://${bucketName}.${endpoint}/${fileName}`;
      }
    },

    upLoadFile(fileItem) {
      let self = this;
      self.percentage = 0;
      if (self.oss.ossVendor == null) {
        self.oss.ossVendor = 1;
      }
      if (self.oss.ossVendor === 1) {
        let OSS = require('ali-oss');
        let client = new OSS({
          region: self.oss.ossEndPoint.slice(
            0,
            self.oss.ossEndPoint.indexOf('.')
          ),
          accessKeyId: self.oss.ossAccessKeyId,
          accessKeySecret: self.oss.ossAccessKeySecret,
          bucket: self.oss.ossBucketName
        });
        let name = fileItem.fileName;
        return new Promise((resolve, reject) => {
          client.multipartUpload(name, fileItem.file, {
              progress: function * (percentage, cpt) {
                self.percentage = percentage;
              }
            })
            .then((results) => {
              let url = self.getFileUrl(results.name);
              resolve(url);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        let url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
        let containerURL = new azblob.ContainerURL(
          url,
          azblob.StorageURL.newPipeline(new azblob.AnonymousCredential())
        );
        let blockBlobURL = azblob.BlockBlobURL.fromContainerURL(
          containerURL,
          fileItem.fileName
        );
        return new Promise((resolve, reject) => {
          azblob
            .uploadBrowserDataToBlockBlob(
              azblob.Aborter.none,
              fileItem.file,
              blockBlobURL
            )
            .then((results) => {
              let url = self.getFileUrl(fileItem.fileName);
              console.log(url);
              resolve(url);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },

    openOuter(item) {
      let self = this;
      console.log(item);
      if (item != null) {
        self.showOuter = true;
        self.checkImgSrc = item.src;
      }
    },

    deleteImg(item, index) {
      let self = this;
      self.sourceList.splice(index, 1);
    },

    async submit() {
      let self = this;
      if (self.eventName.trim().length === 0) {
        self.showEventNameInfo = true;
        return false;
      }
      if (self.corEvent && self.eventDes.trim().length === 0) {
        self.showEventDescInfo = true;
        return false;
      }
      let params = {};
      params.storeId = self.store.storeId;
      await getStorageInfo(params).then((res) => {
        if (res.errCode === 0) {
          self.oss = res.data;
          console.log(self.oss);
        }
      });
      let tempFileUrl = [];
      for (let i = 0; i < self.sourceList.length; i++) {
        let obj = {};
        if (self.sourceList[i].mediaType === 2) {
          let url = await self.upLoadFile(self.sourceList[i]);
          obj.mediaType = 2;
          obj.url = url;
          obj.deviceId = self.channel.id;
        } else if (self.sourceList[i].mediaType === 1) {
          let url = await self.upLoadFile(self.sourceList[i]);
          obj.mediaType = 1;
          obj.url = url;
          obj.deviceId = self.channel.id;
        }
        tempFileUrl.push(obj);
      }
      let eventIds = [];
      eventIds.push(self.curEvent);
      self.fullscreenLoading = true;
      let isSuccess = false;
      if (self.evBtns[0].isActive) {
        let commentobj = {
          ts: new Date().getTime(),
          description: self.eventDes.trim(),
          attachment: tempFileUrl,
          status: 0
        };
        let curTs = util.getCurDate2StrBySign('/');
        let obj = {};
        obj.ts = new Date().getTime();
        obj.subject = self.eventName.trim();
        obj.storeId = self.store.storeId;
        obj.deviceId = self.channel.id;
        obj.comment = commentobj;
        let params = obj;
        addEvent(params).then((res) => {
          self.fullscreenLoading = false;
          console.log(res.data);
          let notifiedTo = res.data.notifiedTo;
          if (res.errCode === 0) {
            isSuccess = true;
          } else {
            isSuccess = false;
          }
          let routeData = {
            flag: {
              addEventType: 'add',
              isSuccess: isSuccess
            },
            store: {
              storeId: self.store.storeId,
              storeName: self.store.storeName
            },
            channel: {
              deviceId: self.channel.id
            },
            event: {
              eventIds: [],
              eventName: self.eventName,
              description: self.eventDes.trim(),
              fileList: tempFileUrl
            },
            user: notifiedTo,
            ts: curTs
          };
          sessionStorage.setItem('store_submit', JSON.stringify(routeData));
          self.$router.push({
            name: 'storeSubEvent',
            params: { data: routeData }
          });
        });
      } else {
        let obj = {
          eventIds: eventIds,
          comment: {
            ts: new Date().getTime(),
            description: self.eventDes.trim(),
            attachment: tempFileUrl,
            status: 0
          }
        };
        let curTs = util.getCurDate2StrBySign('/');
        let params = obj;
        addComment(params).then((res) => {
          self.fullscreenLoading = false;
          if (res.errCode === 0) {
            isSuccess = true;
          } else {
            isSuccess = false;
          }
          let routeData = {
            flag: {
              addEventType: 'cor',
              isSuccess: isSuccess
            },
            store: {
              storeId: self.store.storeId,
              storeName: self.store.storeName
            },
            channel: {
              deviceId: self.channel.id
            },
            event: {
              eventIds: eventIds,
              eventName: self.eventName,
              description: self.eventDes.trim(),
              fileList: tempFileUrl
            },
            ts: curTs
          };
          sessionStorage.setItem('store_submit', JSON.stringify(routeData));
          self.$router.push({
            name: 'storeSubEvent',
            params: { data: routeData }
          });
        });
      }
    },

    cutPicture(...val) {
      let self = this;
      self.showCancelContent = false;
      if (self.sourceList.length >= 10) {
        self.notify(self.$t('remotePatrol.storeMaxAttach'), 'warning', 3000);
        return false;
      }
      if (self.fullScreen) {
        self.exitFullscreen();
        self.fullScreen = false;
      }
      self.showSnapShotDialog = true;
      this.$nextTick(() => {
        self.imageCanvasList = [];
        if (self.playBackState) {
          self.stopVideoPlay();
          let video = document.getElementById('previewVideo');
          self.cutDialogcurTime = video.player.currentTime();
        }
        self.videoEl = document.getElementById('previewVideo').children[0];
        self.canvasEl = document.getElementById('icanvas');
        let ctx = self.canvasEl.getContext('2d');
        ctx.drawImage(
          self.videoEl,
          0,
          0,
          767 * self.percentHeight,
          431 * self.percentHeight
        );
        let oGrayImg = self.canvasEl.toDataURL('image/jpeg');
        self.imageCanvas.src = oGrayImg;
        let imgObj = new Image();
        imgObj.src = oGrayImg;
        self.imageCanvasList.push(imgObj);
      });
    },

    showPenList() {
      let self = this;
      self.showPen = !self.showPen;
      self.showCancelContent = false;
    },

    checkPen(item, index) {
      let self = this;
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
      let self = this;
      self.isMouseDown = true;
      self.X = e.offsetX;
      self.Y = e.offsetY;
      self.showPenBtn = false;
      self.showCancelContent = false;
    },

    mouseMoveAction(e) {
      let self = this;
      if (self.isMouseDown) {
        self.X1 = e.offsetX;
        self.Y1 = e.offsetY;
        self.showPenBtn = false;
        self.drawLine(self.X, self.Y, self.X1, self.Y1);
        self.flag++;
      }
    },

    mouseUpAction(e) {
      console.log(e);
      console.log(e.target.className);
      let self = this;
      self.isMouseDown = false;
      // self.showCutModel=true;
      self.showPenBtn = true;
      self.showCancelContent = true;

      if (self.flag !== 0 && self.canvasEl !== '') {
        let imgObj = new Image();
        imgObj.src = self.canvasEl.toDataURL('image/jpeg');
        self.imageCanvasList.push(imgObj);
      }
      self.flag = 0;
      if (e.target.className === 'el-time-panel__btn confirm') {
        self.changeDate();
      }
    },

    mouseLeaveAction(e) {
      console.log(e);
      let self = this;
      self.isMouseDown = false;
    },

    showCancel() {
      let self = this;
      self.showCancelContent = true;
      self.showPenBtn = true;
    },

    hiddenCancel() {
      let self = this;
      self.showCancelContent = false;
      self.showPenBtn = false;
    },

    cancleEditCanvas() {
      let self = this;
      self.showCancelContent = false;
      self.canvasEl = document.getElementById('icanvas');
      let ctx = self.canvasEl.getContext('2d');
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
      let self = this;
      self.showCancelContent = false;
      self.imageCanvasList.pop();
      self.canvasEl = document.getElementById('icanvas');
      let ctx = self.canvasEl.getContext('2d');
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
      let self = this;
      let ctx = self.canvasEl.getContext('2d');
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
      let self = this;
      self.showSnapShotDialog = false;
    },
    confirmEdit() {
      let self = this;
      let img = new Image();
      let obj = {};
      obj.mediaType = 2;
      obj.src = self.canvasEl.toDataURL('image/jpeg');
      obj.height = '100px';
      obj.width = '140px';
      obj.fileName =
        self.bucketImage +
        '/' +
        'event' +
        '_' +
        util.getCurTimeStr() +
        '_' +
        self.store.storeId +
        '_' +
        self.channel.channelId +
        '.jpg';
      obj.file = util.base64ToBlob(obj.src);
      self.sourceList.push(obj);
      self.showSnapShotDialog = false;
      self.myDivHeight();
    },

    async playVideo(url) {
      let self = this;
      console.log('playvideo enter!');
      self.playState = true;
      self.showCutContent = true;
      let video = document.getElementById('previewVideo');
      this.previewplayer = videojs(video, { playbackRates: [0.5, 1, 1.5, 2] });
      this.previewplayer.src({
        src: url,
        type: this.protocal === 'HLS' ? 'application/x-mpegURL' : 'application/dash+xml'
      });
      this.previewplayer.play();
    },

    noBindDeviceDialog(val) {
      let self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },

    canceldNoBind(val) {
      let self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },

    stopVideo() {
      let self = this;
      self.playState = false;
      self.showCutContent = false;
      let video = document.getElementById('previewVideo');
      self.previewplayer = videojs(video);
      self.previewplayer.pause();
      window.clearInterval(self.timeid);
      self.timeid = null;
      self.timeid = 0;
      window.clearInterval(self.timerPlayReal);
    },

    async getProcess() {
      let self = this;
      let video = document.getElementById('previewVideo');
      let curTime = video.player.currentTime();
      let duration = 300;
      self.durationTimeValue = duration;
      self.currentTimeValue = curTime;
      console.log(curTime);
      console.log(self.startTs);
      self.realTimeStartTs++;
      console.log(self.realTimeStartTs);
      let getTimeStr = function(val) {
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

    adjustSpeed(val) {
      console.log(val);
      let self = this;
      let video = document.getElementById('previewVideo');
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
      console.log(val);
      let self = this;
      self.curBack = label;
      let video = document.getElementById('previewVideo');
      let curTime = video.player.currentTime();
      console.log(curTime);
      let time = parseInt(self.currentTimeValue);
      console.log(self.realTimeStartTs);
      console.log(time);
      switch (val) {
        case 0: {
          self.realTimeStartTs = self.realTimeStartTs - 10;
          if (curTime > 10) {
            video.player.currentTime(curTime - 10);
          } else {
            self.startVideo(self.channel.ivsId, self.channel.channelId, self.realTimeStartTs)
          }
          break;
        }
        case 1: {
          self.realTimeStartTs = self.realTimeStartTs - 30;
          if (curTime > 30) {
            video.player.currentTime(curTime - 30);
          } else {
            self.startVideo(self.channel.ivsId, self.channel.channelId, self.realTimeStartTs)
          }
          break;
        }
        case 2:
          {
            self.realTimeStartTs = self.realTimeStartTs - 60;
            if (curTime > 60) {
              video.player.currentTime(curTime - 60);
            } else {
              self.startVideo(self.channel.ivsId, self.channel.channelId, self.realTimeStartTs)
            }
            break;
          }
        default:{
          break;
        }
      }
    },

    controlScreen() {
      let self = this;
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
      let self = this;
      let ele = document.getElementById('videoContent');
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
      let de = document;
      let ele = document.getElementById('videoContent');
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

    searchStore() {
      let self = this;
      let tempStoreList = self.tempStoreList;
      let getStore2Temp = (data) => {
        let cityList = [];
        data.forEach((item) => {
          if (cityList.map((x) => x.city).indexOf(item.city) === -1) {
            let obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        let storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          let temp = [];
          let obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city === data[j].city) {
              let obj = {};
              if (self.store.storeId === data[j].storeId) {
                obj.isActive = true;
              } else {
                obj.isActive = false;
              }
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite =
                data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      let temp = [];
      let tempArray = [];
      let tempStore = [];
      tempStoreList.forEach((_item, _index) => {
        _item.storeList.forEach((itemDs, indexDs) => {
          temp.push(util.getPinyinList(itemDs.name));
          tempStore.push(itemDs);
        });
      });
      for (let i = 0; i < temp.length; i++) {
        if (
          temp[i][0].indexOf(self.serachVale.trim()) !== -1 ||
          temp[i][1].indexOf(self.serachVale.trim()) !== -1
        ) {
          tempArray.push(tempStore[i]);
        }
      }
      self.tabList[2].storeList = getStore2Temp(tempArray);
    },

    handleClick() {
      let self = this;
      self.getStoreList();
    },

    clearTheEventInfo() {
      let self = this;
      self.evBtns[0].isActive = true;
      self.evBtns[1].isActive = false;
      self.eventName = '';
      self.eventDes = '';
      self.sourceList = [];
      self.curSpeed = '1 X';
      self.curBack = '';
    },

    async changeStore(item, index, _item, _index) {
      let self = this;
      _item.isActive = true;
      self.clearTheEventInfo();
      self.showModelContent = true;
      let obj = {};
      obj.storeId = _item.storeId;
      obj.storeName = _item.name;
      obj.storeTitle = _item.name;
      obj.storeUp = _item.favorite;
      obj.userName = _item.userName;
      if (_item.favorite) {
        obj.storeUpTitle = this.$t('remotePatrol.stared');
      } else {
        obj.storeUpTitle = this.$t('remotePatrol.clickToStar');
      }
      self.store = obj;
      let tabIndex = Number(self.activeIndex);
      let curStoreId = '';
      if (tabIndex !== 2) {
        item.storeList.forEach((itemS, indexS) => {
          if (_index !== indexS) {
            itemS.isActive = false;
          }
        });
        curStoreId = _item.storeId;
      } else {
        item.storeList.forEach((itemS, indexS) => {
          itemS.storeList.forEach((itemChild, indexChild) => {
            if (itemChild.storeId !== _item.storeId) {
              itemChild.isActive = false;
            } else {
              curStoreId = itemChild.storeId;
            }
          });
        });
      }
      let storeObj = {
        storeId: curStoreId
      };
      self.saveStoreObj(storeObj);
      self.getChannelByStore(_item);
    },

    saveStoreObj(storeObj) {
      let self = this;
      let key = 'recentStore_storeMonitor' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      if (
        localStorage.getItem(key) != null ||
        localStorage.getItem(key) != undefined
      ) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      temp.forEach((item, index) => {
        if (
          item.userId === storeObj.userId &&
          item.storeId === storeObj.storeId
        ) {
          temp.splice(index, 1);
        }
      });
      temp.unshift(storeObj);
      temp = temp.slice(0, 3);
      localStorage.setItem(key, JSON.stringify(temp));
    },

    getStoreObj() {
      let self = this;
      let key = 'recentStore_storeMonitor' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      let tempArray = [];
      if ( localStorage.getItem(key) != null || localStorage.getItem(key) != undefined ) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      let indexArray = [];
      temp.forEach((item, index) => {
        indexArray.push(
          self.allInitStoreList.map((x) => x.storeId).indexOf(item.storeId)
        );
      });
      console.log(indexArray);
      indexArray = indexArray.filter(function(x) {
        return x !== -1;
      });
      indexArray.forEach((item) => {
        tempArray.push(self.allInitStoreList[item]);
      });
      return tempArray;
    },

    changeStoreDialog() {
      let self = this;
      self.changeStoreObj.dialogCosed = false;
      if (self.curStoreItem.userId == null) {
        self.noStoreUser.dialogCosed = true;
      } else {
        self.changeStore(
          self.curTabItem,
          self.curTabIndex,
          self.curStoreItem,
          self.curStoreIndex
        );
      }
    },

    canceldChangeStore() {
      let self = this;
      self.changeStoreObj.dialogCosed = false;
    },

    cancelNoUser() {
      let self = this;
      self.noStoreUser.dialogCosed = false;
    },

    noStoreUserDialog() {
      let self = this;
      self.noStoreUser.dialogCosed = false;
      self.changeStore(
        self.curTabItem,
        self.curTabIndex,
        self.curStoreItem,
        self.curStoreIndex
      );
    },

    clickStore(item, index, _item, _index) {
      let self = this;
      if ( (self.isEzviz && self.$refs.ezvizVideo.isLoading) ) {
        self.videoLoadingObj.dialogCosed = true;
        return false;
      }
      self.showStoreUp = true;

      self.curTabIndex = index;
      self.curTabItem = item;
      self.curStoreIndex = _index;
      self.curStoreItem = _item;
      if (
        (!self.isEzviz && (self.playState || self.eventName.length !== 0)) ||
        (self.isEzviz &&
          (self.$refs.ezvizVideo.playState || self.eventName.length !== 0))
      ) {
        self.changeStoreObj.dialogCosed = true;
      } else {
        // self.changeStore(item,index,_item,_index);
        if (_item.userId == null) {
          self.noStoreUser.dialogCosed = true;
        } else {
          self.changeStore(item, index, _item, _index);
        }
      }
    },

    getChannelByStore(storeItem) {
      let self = this;
      let temp = [];
      self.hideLast = false;
      self.hideNext = false;
      self.showCutContent = false;
      if (!self.isEzviz) {
        self.stopVideoPlay();
      } else {
        self.$refs.ezvizVideo.showError = false;
        self.$refs.ezvizVideo.playBack &&
          (self.$refs.ezvizVideo.startTs = self.playBackTime);
        if (self.$refs.ezvizVideo.playState) {
          self.$refs.ezvizVideo.stopRealTime();
        }
      }
      storeItem.device.forEach((item, index) => {
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.ivsId = item.ivsId;
        obj.channelId = item.channelId;
        obj.isonline = true;
        if (index === 0) {
          obj.isClick = true;
          self.channel = {
            id: item.id,
            ivsId: item.ivsId,
            channelId: item.channelId,
            channelName: item.name
          };
        } else {
          obj.isClick = false;
        }
        temp.push(obj);
      });
      self.channelBtns = temp;
      self.allChannelBtns = temp;
      self.getshowBtns(temp);
    },

    getshowBtns(list) {
      let self = this;
      let width = document.getElementsByClassName('btn-content')[0]
        .offsetWidth;
      let detailsWidth = (window.innerWidth / 1440) * 15 + 60;
      let count = parseInt(width / detailsWidth); // 当前容器最大可显示数量
      if (count >= list.length) {
        self.showChannelBtns = list;
      } else {
        self.showChannelBtns = list.slice(0, count);
      }
      if (count < self.channelBtns.length) {
        self.hideNext = true;
      } else {
        self.hideNext = false;
      }
    },

    changeChannel(item, index) {
      let self = this;
      self.showModelContent = true;
      self.clearTheEventInfo();
      if (item.isonline) {
        item.isClick = true;
        let obj = {
          id: item.id,
          ivsId: item.ivsId,
          channelId: item.channelId,
          channelName: item.name
        };
        self.channel = obj;
      } else {
        return false;
      }
      self.showChannelBtns.forEach((_item, _index) => {
        if (_index !== index) {
          _item.isClick = false;
        }
      });
      if (!self.isEzviz) {
        if(self.playBackState){
          self.startVideo(self.channel.ivsId, self.channel.channelId, self.startTs)
        }
        else{
          self.startVideo(self.channel.ivsId, self.channel.channelId, null)
        }
      } else {
        self.$refs.ezvizVideo.playBack &&
          (self.$refs.ezvizVideo.startTs = self.playBackTime);
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
      }
    },

    getIndexById(id) {
      let self = this;
      let curIndex = 0;
      self.channelBtns.forEach((item, index) => {
        if (item.id === id) {
          curIndex = index;
        }
      });
      return curIndex;
    },

    lastBar() {
      let self = this;
      let width = document.getElementsByClassName('btn-content')[0]
        .offsetWidth;
      let detailsWidth = (window.innerWidth / 1440) * 15 + 60;
      let count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        let index = self.getIndexById(self.showChannelBtns[0].id);
        self.showChannelBtns.unshift(self.channelBtns[index - 1]);
        self.showChannelBtns.pop();
        self.showChannelBtns.forEach((item, index) => {
          if (item.id === self.channel.id) {
            item.isClick = true;
          } else {
            item.isClick = false;
          }
        });
        if (self.showChannelBtns[0].id === self.channelBtns[0].id) {
          self.hideLast = false;
        }
        if (
          self.showChannelBtns[count - 1].id !==
          self.channelBtns[self.channelBtns.length - 1].id
        ) {
          self.hideNext = true;
        }
      }
    },

    nextBar() {
      let self = this;
      let width = document.getElementsByClassName('btn-content')[0]
        .offsetWidth;
      let detailsWidth = (window.innerWidth / 1440) * 15 + 60;
      let count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        let index = self.getIndexById(self.showChannelBtns[count - 1].id);
        self.showChannelBtns.push(self.channelBtns[index + 1]);
        self.showChannelBtns.shift();
        self.showChannelBtns.forEach((item, index) => {
          if (item.id === self.channel.id) {
            item.isClick = true;
          } else {
            item.isClick = false;
          }
        });
        if (self.showChannelBtns[0].id !== self.channelBtns[0].id) {
          self.hideLast = true;
        }
        if (
          self.showChannelBtns[count - 1].id ===
          self.channelBtns[self.channelBtns.length - 1].id
        ) {
          self.hideNext = false;
        }
      }
    },

    changeChannelDialog() {
      let self = this;
      self.changeChannelObj.dialogCosed = false;
      self.changeChannel(self.curChannelItem, self.curChannelIndex);
    },

    cancelchangeChannel() {
      let self = this;
      self.changeChannelObj.dialogCosed = false;
    },

    clickBtn(item, index) {
      let self = this;
      if ( (self.isEzviz && self.$refs.ezvizVideo.isLoading)) {
        self.videoLoadingObj.dialogCosed = true;
        return false;
      }
      self.curChannelItem = item;
      self.curChannelIndex = index;
      if (self.eventName.trim().length !== 0) {
        self.changeChannelObj.dialogCosed = true;
      } else {
        self.changeChannel(item, index);
      }
    },

    backCurDate() {
      let self = this;
      self.dateValue = new Date();
      self.curTime = new Date();
      self.playBackState = false;
      self.showModelContent = true;
      self.curYear = new Date().getFullYear();
      self.curMonth = new Date().getMonth() + 1;
      self.realType = true;
      if (!self.isEzviz) {
        if (self.store.storeId != undefined) {
          self.startVideo(self.channel.ivsId, self.channel.channelId, null)
        }
      } else {
        self.playBackTime = 0;
        self.$nextTick(() => {
          self.$refs.ezvizVideo.changeHistoryTime(self.playBackTime);
        });
      }
    },

    myDivHeight() {
      let self = this;
      if (self.corEvent) {
        let divLeft = document.getElementsByClassName('el-event')[0]
          .offsetHeight;
        let divRight = document.getElementsByClassName('event-rside')[0]
          .offsetHeight;
        let height = divLeft > divRight ? divLeft : divRight;
        document.getElementById('rightLine').style.height = height + 'px';
      }
    },

    checkFull() {
      let isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (!isFull) {
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

    editEzvizCanvas(src) {
      console.log('picture--' + src);
      let self = this;
      let obj = {};
      obj.mediaType = 2;
      obj.src = src;
      obj.height = '100px';
      obj.width = '140px';
      obj.fileName = self.bucketImage + '/' + 'event' + '_' + util.getCurTimeStr() + '_' +
                      self.store.storeId + '_' + self.channel.channelId + '.jpg';
      obj.file = util.base64ToBlob(obj.src);
      self.sourceList.push(obj);
    },

    videoLoadingDialog() {
      let self = this;
      self.videoLoadingObj.dialogCosed = false;
    },

    cancelVideoLoading() {
      let self = this;
      self.videoLoadingObj.dialogCosed = false;
    },

    eventNameChanged(val) {
      let self = this;
      let content = filterString.standard(val, 50);
      console.log(content);
      self.eventName = content;
      self.showEventNameInfo = false;
      let length = filterString.getContentLength(val);
      if (length > 50) {
        this.eventNameRuletip = true;
      } else {
        this.eventNameRuletip = false;
      }
    },

    eventDesChanged(val) {
      let self = this;
      let content = filterString.all(val, 200);
      console.log(content);
      self.eventDes = content;
      self.showEventDescInfo = false;
      let length = filterString.getContentLength(val);
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

    onPlayerWaiting() {
      console.log('video is loading');
      this.showCutContent = false;
      this.isLoading = true;
    },

    onPlayerPlaying() {
      console.log('video is playing');
      this.showCutContent = true;
      this.isLoading = false;
    },

    searchChannel() {
      let self = this;
      let tempChannelList = self.allChannelBtns;
      let temp = [];
      let tempArray = [];
      let tempChannel = [];
      tempChannelList.forEach((_item) => {
        console.log(_item.name);
        temp.push(util.getPinyinList(_item.name));
        tempChannel.push(_item);
      });
      for (let i = 0; i < temp.length; i++) {
        if (
          temp[i][0].indexOf(self.serachChannelValue.trim()) !== -1
          || temp[i][1].indexOf(self.serachChannelValue.trim()) !== -1
        ) {
          tempArray.push(tempChannel[i]);
        }
      }
      self.channelBtns = tempArray;
      self.getshowBtns(tempArray);
    },

    async onPlay() {
      const paused = !this.paused;
      this.showError = false;
      this.showModelContent = true;
      this.errorText = '';
      if (this.realType === true) {
        if (paused) {
          await this.stopVideo();
          await this.disconnectVideo();
          await this.offline();
          this.currentState = 'inline';
          this.paused = true;
        } else {
          if (this.channel === null) {
            this.paused = true;
          }
          else{
            await this.startVideo(this.channel.ivsId, this.channel.channelId, null);
          }
        }
      } else {
        if (paused) {
          this.paused = true;
          await this.stopVideo();
          await this.disconnectVideo();
          await this.offline();
          this.currentState = 'inline';
          this.paused = true;
        } else {
          this.startVideo(this.channel.ivsId, this.channel.channelId, this.realTimeStartTs);
          // if (this.onEndflag) {
          //   this.startVideo(this.channel.ivsId, this.channel.channelId, this.realTimeStartTs);
          // } else {
          //   this.paused = false;
          //   this.startVideo(this.channel.ivsId, this.channel.channelId, this.realTimeStartTs);
          // }
        }
      }
    },

    async startVideo(IVSID, channelId, startTs) {
      try {
        if (IVSID === null || channelId === null) {
          const error = this.$t('remotePatrol.dashServerError') + '5';
          this.currentState = 'blank';
          this.errorText = error;
          this.showError = true;
        } else {
          this.isLoading = true;
          if (!await this.stopVideoPlay()) {
            return;
          }
          if (!await this.online()) {
            return;
          }
          this.IVSID = IVSID;
          this.channelId = channelId.toString();
          let self = this;
          if (startTs) {
            if(await this.history(startTs) ){
              this.timeid = window.setInterval(function() {
                self.getProcess();
              }, 1000);
            }
          } else {
            if(await this.connectVideo()){
              this.startTimer();
            }
          }
        }
      } catch (e) {
        if (e.message !== 'Network request failed') {
          this.currentState = 'blank';
          this.errorText = e.message;
        }
      }
    },

    startTimer(){
      this.realTimeSpeed = 0;
      this.isLoading = false;
      this.timerPlayReal = window.setInterval(() => {
        console.log(this.realTimeSpeed);
        this.realTimeSpeed = this.realTimeSpeed + 1;
      }, 1000);
    },

    stopTimer(){
      window.clearInterval(this.timerPlayReal);
      this.realTimeSpeed = 0;

      window.clearInterval(this.timeid);
      this.timeid = 0;
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
        this.showModelContent = false;
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
        this.playState
        return true;
      } else {
        let error = this.$t('remotePatrol.dashServerError');
        if (DashHttp.getResult() != null) {
          error += DashHttp.getResult().ErrorCode;
          this.currentState = 'blank';
          this.errorText = error;
          this.showError = true;
          this.showModelContent = false;
          this.isLoading = false;
          return false;
        }
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
        this.uri = url;
        console.log(this.uri);
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
          this.currentState = 'blank';
          this.paused = false;
          this.errorText = error;
          return false;
        }
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

    stopVideo() {
      const self = this;
      console.log('stop video')
      self.playState = false;
      var video = document.getElementById('previewVideo');
      self.previewplayer = videojs(video);
      self.previewplayer.pause();
      self.stopTimer();
    },

    getDashUrlInfo() {
      getDashServerInfo().then(result => {
        const apiport = result.data.url.indexOf('https') !== -1 ? result.data.httpsCmdPort : result.data.httpCmdPort;
        this.userName = result.data.loginId;
        this.password = result.data.password;
        const url = result.data.url + ':' + apiport + '/AdvStreamingService/';
        console.log(url);
        DashHttp.setDashHost(url);
      }).catch(error => {
        if (error.message !== 'Network request failed') {
          this.currentState = 'blank';
          this.errorText = error;
          this.showError = true;
        }
      });
    },

  },
};
</script>
<style lang="scss" scoped>
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";

* {
  font-family: Roboto, Arial, Microsoft YaHei;
}

$red: #f31d65;
$black: #182752;
$border: #e3e9f4;
$background: #f4f5f9;
$tab: #7d8cad;
$h1: #292e36;

@function rem($val) {
  @return $val/16 + rem;
}

@function checkRem($val) {
  @if ($val==0) {
    @return 0;
  } @else if ($val==auto) {
    @return auto;
  } @else {
    @return rem($val);
  }
}

@mixin point($poi, $val) {
  #{$poi}: checkRem($val);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fadepen-enter-active,
.fadepen-leave-active {
  transition: opacity 0.5s;
}

.fadepen-enter,
.fadepen-leave-to {
  opacity: 0;
}

.noeventClass {
  pointer-events: none;
}

.el-container {
  background-color: $background;
  .spreadLsideClass {
    width: 98%;
  }
  .liseAnmiClass {
    animation: lisdeAn 0.5s;
    -webkit-animation: lisdeAn 0.5s;
    animation-fill-mode: forwards;
  }
  @keyframes lisdeAn {
    from {
      width: 66.67%;
    }
    to {
      width: 100%;
    }
  }
  @-webkit-keyframes lisdeAn {
    from {
      width: 66.67%;
    }
    to {
      width: 100%;
    }
  }
  /*左侧视频区域css*/
  .lside {
    margin-right: calc(25 / 1920 * 100vw);
    border: 1px solid $border;
    background-color: #fff;
    .el-header-title {
      text-align: left;
      position: relative;
      height: 80px;
      line-height: 80px;
      border-bottom: 1px solid $border;
      padding-left: calc(25 / 1920 * 100vw);
      padding-right: calc(25 / 1920 * 100vw);
      .lside-title {
        font-weight: bold;
        color: $h1;
      }
      .nocoll {
        border: 1px solid #ff9803;
      }
      .coll {
        border: 1px solid #ff9803;
        background-color: #ff9803;
      }
      .nocoll-icon {
        color: #ff9803;
        font-size: 14px;
      }
      .coll-icon {
        color: #fff;
        font-size: 14px;
      }
      .coll-font {
        color: #fff;
      }
      .nocoll-font {
        color: #ff9803;
      }
      @media screen and(min-width: 1366px) {
        .lside-title {
          font-size: 18px;
        }
        .storeUp-content {
          height: 26px;
          width: 114px;
          text-align: center;
        }
      }
      @media screen and(max-width: 1366px) {
        .lside-title {
          @include point(font-size, 18);
        }
        .storeUp-content {
          height: auto;
          text-align: center;
          width: 114px;
        }
      }
      .storeUp-content {
        display: inline-block;
        margin-left: 20px;
        padding: 0px 6px;
        line-height: 20px;
        position: relative;
        bottom: 2px;
        cursor: pointer;
        span {
          font-size: 12px;
          vertical-align: middle;
          margin-left: 4px;
        }
      }
      .el-submit {
        position: absolute;
        right: calc(25 / 1920 * 100vw);
        width: calc(130 / 1920 * 100vw);
        color: #fff;
        height: calc(36 / 1920 * 100vw);
        line-height: calc(36 / 1920 * 100vw);
        padding: 0 0;
        border-radius: 3px;
        font-size: calc(14 / 1920 * 100vw);
        border: none;
        top: 50%;
        transform: translate(0, -50%);
        outline: none;
      }
    }
    /*截图区域css*/
    #cancelBtn {
      @include point(width, 76);
      @include point(margin-right, 20);
      background-color: #eaedf2 !important;
      color: #708090 !important;
      font-size: 12px;
      line-height: 12px;
      border-radius: 3px;
    }
    #confirmBtn {
      @include point(width, 76);
      // margin-right: 15px;
      @include point(margin-right, 20);
      font-size: 12px;
      line-height: 12px;
      border-radius: 3px;
    }
    .canvas-content {
      position: relative;
      #previewCutVideo {
        @include point(margin-bottom, 25);
        @include point(margin-top, 15);
      }
      #icanvas {
        @include point(margin-top, 15);
      }
      .dialog-img-content {
        @include point(padding, 15);
      }
      .dialog-hr {
        border: 0.5px solid;
        border-color: #dfe2e9;
        margin-bottom: 0px;
        position: relative;
        bottom: 5px;
        margin-top: 0;
      }
      .cancel-content {
        position: absolute;
        bottom: 2px;
        @include point(height, 30);
        @include point(line-height, 30);
        background-color: rgba($color: $black, $alpha: 0.5);
        z-index: 10;
        overflow: hidden;
        .content {
          width: 50%;
          text-align: center;
          float: left;
          color: #fff;
          cursor: pointer;
          &:first-child {
            border-right: 1px solid #fff;
          }
          .icon-clear {
            position: relative;
            @include point(bottom, 3);
            margin-right: 15px;
          }
        }
      }
      .icon-right {
        width: 80px;
        height: auto;
        position: absolute;
        right: 30px;
        top: 10%;
        cursor: pointer;
        .pen-btn {
          width: 40px;
          margin-right: 20px;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .content {
          width: 100%;
          height: 40px;
          position: relative;
          .color {
            width: 16px;
            height: 16px;
            border-radius: 8px;
            position: absolute;
            margin: auto 0;
            top: 4px;
            left: 20%;
            margin-left: 4px;
            z-index: 3;
            cursor: pointer;
          }
          .colorActive {
            background-color: #ddd;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            position: absolute;
            margin: auto 0;
            left: 20%;
            z-index: 3;
          }
          #white {
            background-color: white;
          }
          #yellow {
            background-color: yellow;
          }
          #red {
            background-color: red;
          }
        }
      }
    }
    /*video区域css*/
    .video-content {
      position: relative;
      margin: calc(25 / 1920 * 100vw);
      margin-bottom: 0;
      height: 420px;
      z-index: 10;
      .getvideo-content {
        position: absolute;
        z-index: 930;
        width: 100%;
        height: 100%;
        background-color: #000;
        .btn-graph {
          position: absolute;
          left: 45%;
          top: 45%;
          display: flex;
          display: -webkit-flex;
          justify-content: center;
          align-items: center;
        }
        #btn-graph-canvas {
          width: 100px;
          height: 100px;
        }
      }
      #previewVideo {
        //@include point(min-width,450);
        //@include point(min-height,414);
        min-height: 420px;
      }
      .errorVideo-model {
        height: 100%;
        width: 100%;
        background-color: #232730;
        color: $red;
        position: absolute;
        z-index: 900;
        span {
          position: relative;
          top: 50%;
          font-size: 12px;
        }
      }
      .video-model {
        height: 100%;
        width: 100%;
        background-color: transparent;
        position: absolute;
        z-index: 900;
        text-align: left;
        @media screen and(max-width: 1366px) {
          #channelName {
            font-size: 12px;
          }
        }
        @media screen and(min-width: 1366px) {
          #channelName {
            font-size: 16px;
          }
        }
        #channelName {
          display: block;
          width: 100%;
          padding-left: 30px;
          color: #fff;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          height: 40px;
          line-height: 40px;
        }
        .progress-content {
          position: absolute;
          bottom: 0px;
          width: 100%;
          .el-prog {
            float: left;
            width: 100%;
            .progress-bar {
              background-color: $red;
            }
          }
          .currentTime {
            font-size: 12px;
            color: #fff;
            float: left;
            margin-left: 30px;
            position: relative;
            bottom: 0.3rem;
            margin-right: 10px;
          }
          .duration {
            font-size: 12px;
            color: #fff;
            position: relative;
            bottom: 0.5rem;
            margin-left: 15px;
          }
        }

        .icon-footer {
          width: 100%;
          position: absolute;
          bottom: 0px;
          color: #fff;
          overflow: hidden;
          user-select: none;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          height: 46px;
          line-height: 46px;
          .iconlside {
            float: left;
            text-align: left;
            .iconplay {
              font-size: 18px;
              cursor: pointer;
              float: left;
              margin-left: 30px;
            }
          }
          @media screen and(min-width: 1366px) {
            .iconrside {
              width: 70%;
            }
          }
          @media screen and(max-width: 1366px) {
            .iconrside {
              width: 70%;
            }
          }
          .iconrside {
            max-width: 500px;
            float: right;
            position: relative;
            span {
              font-size: 13px;
              margin-right: 6px;
              margin-left: 20px;
            }
            .speed-content {
              display: inline-block;
              span {
                position: relative;
                bottom: 3px;
              }
            }
            .screen-content {
              display: inline;
              margin-left: 30px;
              position: absolute;
              right: 20px;
              .iconscreen {
                font-size: 18px;
                position: relative;
                cursor: pointer;
                margin-right: 20px;
                bottom: 3px;
              }
            }
          }
        }
        .iconright {
          position: absolute;
          right: 20px;
          height: 30%;
          //top: 30%;
          top: 40%;
          .paizhao-content {
            cursor: pointer;
            margin-top: 30px;
            width: 105px;
            text-align: center;
            border-radius: 4px;
            background-color: rgba($color: #24293d, $alpha: 0.6);
            padding: 4px;
          }
          .iconpaizhao {
            color: #fff;
            vertical-align: middle;
          }
          span {
            color: #fff;
            font-size: 12px;
            margin-left: 15px;
            vertical-align: middle;
          }
          .icon-drap-content {
            height: 40px;
            position: absolute;
            right: 0px;
            background-color: #34374a;
            line-height: 40px;
            .iconzhedie {
              color: #ddd;
              cursor: pointer;
            }
          }
        }
        .en-iconright {
          position: absolute;
          right: 20px;
          height: 30%;
          /*top: 30%;*/
          top: 40%;
          .paizhao-content {
            cursor: pointer;
            margin-top: 30px;
            width: 120px;
            text-align: center;
            border-radius: 4px;
            background-color: rgba($color: #24293d, $alpha: 0.6);
            padding: 4px;
          }
          .iconpaizhao {
            color: #fff;
            vertical-align: middle;
          }
          span {
            color: #fff;
            font-size: 12px;
            margin-left: 15px;
            vertical-align: middle;
          }
          .icon-drap-content {
            height: 40px;
            position: absolute;
            right: 0px;
            background-color: #34374a;
            line-height: 40px;
            .iconzhedie {
              color: #ddd;
              cursor: pointer;
            }
          }
        }
      }
    }
    .video-gongge-content {
      width: 100%;
      height: auto;
      position: relative;
      margin-top: 20px;
      .video-details {
        width: 49%;
        height: auto;
        position: relative;
        display: inline-block;
        margin-right: 1px;
        .video-model {
          height: 100%;
          width: 100%;
          background-color: transparent;
          position: absolute;
          z-index: 990;
          text-align: left;
          .channelName {
            display: block;
            margin: 10px;
            color: #fff;
            font-size: 12px;
          }
          .icon-footer {
            width: 96%;
            position: absolute;
            bottom: 0px;
            color: #fff;
            padding-left: 15px;
            padding-bottom: 10px;
            overflow: hidden;
            user-select: none;
            .iconlside {
              width: 30%;
              float: left;
              text-align: left;
              .iconplay {
                font-size: 18px;
                cursor: pointer;
              }
            }
            .screen-content {
              display: inline;
              margin-left: 15px;
              position: absolute;
              right: 12px;
              .iconscreen {
                margin: 8px;
                font-size: 16px;
                position: relative;
                top: 3px;
                cursor: pointer;
              }
            }
          }
          .iconright {
            position: absolute;
            right: 0px;
            height: 50%;
            top: 25%;
            .paizhao-content {
              height: 20px;
              margin-bottom: 15px;
            }
            span {
              font-size: 13px;
              margin-left: 15px;
              color: #fff;
              margin-right: 15px;
              cursor: pointer;
            }
            .iconpaizhao {
              color: #fff;
              cursor: pointer;
            }
          }
        }
        .videos {
          @include point(min-width, 240);
          @include point(min-height, 205);
        }
      }
    }
    /*新增问题区域css*/
    .el-event {
      text-align: left;
      border: 1px solid $border;
      overflow: hidden;
      margin: calc(25 / 1920 * 100vw);
      padding-left: calc(20 / 1920 * 100vw);
      margin-top: 0;
      @media screen and(max-width: 1366px) {
        .cor-des {
          font-weight: bold;
          margin-left: 10px !important;
        }
        .event-content {
          padding-left: 10px;
        }
        .event-name {
          margin-left: 10px;
          font-size: 14px;
          width: 75%;
          display: inline-block !important;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      @media screen and(min-width: 1366px) {
        .cor-des {
          font-weight: bold;
          margin-left: 0px !important;
        }
        .event-content {
          padding-left: 0px;
        }
        .event-name {
          margin-left: 0px;
          font-size: 12px;
          width: 75%;
          display: inline-block !important;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .event-title {
        color: $black;
        display: block;
        margin: 15px;
        margin-left: 20px;
        font-size: calc(14 / 1920 * 100vw);
      }
      .is-required {
        color: $red;
      }
      .cor-des {
        font-weight: bold;
      }
      .el-radio-content {
        margin-top: 10px;
        .el-radio-details {
          display: inline-block;
          margin-left: calc(15 / 1920 * 100vw);
          border: 1px solid #ddd;
          padding: 6px;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
          padding: 8px;
          text-align: center;
          width: 120px;
        }
        .activeClass {
          background-color: #fde8ef !important;
          color: $red;
          border-color: $red !important;
        }
      }
      .event-lside {
        width: 60%;
        float: left;
        height: 460px;
      }
      .right-line {
        width: 1px;
        min-height: 340px;
        position: relative;
        top: 50px;
        background-color: #e3e9f4;
        float: left;
        margin-right: 15px;
      }
      .lside-scrollbar {
        height: 360px;
        .rules {
          margin-left: 20px;
          font-size: 10px;
          margin-top: 5px;
          color: #ff2400;
          display: block;
        }
      }
      .event-rside {
        position: relative;
        top: 50px;
        width: -webkit-calc(40% - 16px);
        width: -moz-calc(40% - 16px);
        width: calc(40% - 16px);
        height: 360px;
        float: right;
        .event-content {
          padding-bottom: 20px;
          .event-details {
            position: relative;
            .radio-class {
              width: calc(100% - 70px);
            }
            .event-name {
              display: inline;
            }
            .event-date {
              color: #94a4b4;
              margin-left: 35px;
              position: absolute;
              right: 0px;
              top: 0px;
              width: 70px;
              text-align: left;
              line-height: 14px;
              span {
                margin: 0;
                font-size: 12px;
              }
            }
            .event-des {
              font-size: 12px;
              margin-left: 35px;
              color: #94a4b4;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              width: 80%;
            }
          }
        }
      }
      .name-input {
        @include point(width, 260);
        margin-left: 20px;
      }
      .error-class {
        margin-left: 20px;
        font-size: 10px;
        margin-top: 5px;
        color: #ff2400;
        display: block;
      }
      .des-input {
        width: 90%;
        margin: auto 20px;
        font-size: 12px;
      }
      .source-content {
        min-height: 120px;
        width: 90%;
        margin: auto 20px;
        span {
          font-size: 12px;
          color: #fcb83b;
          margin: 15px 0;
          display: block;
        }
        .source-details {
          display: inline-block;
          margin-right: 15px;
          padding-top: 15px;
          .img-content {
            width: 100%;
            height: 100%;
            position: relative;
          }
          .icondelete {
            position: absolute;
            font-size: 14px;
            right: 5px;
            margin-top: 8px;
            z-index: 2;
            color: #fff;
            cursor: pointer;
            background-color: rgba($color: $black, $alpha: 0.8);
            border-radius: 50%;
          }
          .start-icon {
            position: absolute;
            left: 35%;
            top: 30%;
            cursor: pointer;
          }
        }
      }
    }
  }
  /*右侧区域css*/
  .rside {
    border: 1px solid $border;
    background-color: #fff;
    //@include point(margin-right,20);
    @media screen and(max-width: 1366px) {
      .el-header-title {
        font-size: 14px;
      }
      .channel-content {
        font-size: 14px;
      }
      #date-title {
        font-size: 14px;
      }
    }
    @media screen and(min-width: 1366px) {
      .el-header-title {
        font-size: 16px;
      }
      .channel-content {
        font-size: 16px;
      }
      #date-title {
        font-size: 16px;
      }
    }
    .el-header-title {
      text-align: left;
      position: relative;
      color: $black;
      height: 80px;
      line-height: 80px;
      border-bottom: 1px solid $border;
      padding-left: calc(15 / 1920 * 100vw);
      span {
        display: block;
        margin-left: calc(30 / 1920 * 100vw);
      }
    }
    #storetab-content,
    #en-storetab-content {
      margin-top: 10px;
      padding-left: calc(20 / 1920 * 100vw);
      padding-right: calc(20 / 1920 * 100vw);
      height: 370px;
      .storeList-content {
        text-align: left;
        height: 345px;
        .activeClass {
          background-color: #fde8ef !important;
          color: $red;
          border-color: $red !important;
        }
        .stores {
          &:last-child {
            margin-bottom: 25px;
          }
        }
        .el-search-input {
          width: calc(235 / 1920 * 100vw);
          margin: calc(20 / 1920 * 100vw);
          margin-top: calc(15 / 1920 * 100vw);
        }
        .store-name {
          display: inline-block;
          @include point(margin-left, 15);
          margin-top: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          text-align: center;
          padding: 6px;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
          @include point(width, 90);
          @include point(padding, 6);

          span {
            width: 100%;
            display: block;
            white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
            overflow: hidden; //隐藏超出单元格的部分。
            text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
          }
        }
        .citys {
          display: block;
          font-size: 14px;
          font-weight: bold;
          color: $black;
          @include point(margin-left, 20);
        }
      }
    }
    .rside-hr {
      width: 100%;
      margin-top: 35px;
      border: 0.5px solid $border;
    }
    .channel-content {
      width: 100%;
      overflow: hidden;
      margin-top: 10px;
      span {
        display: block;
        text-align: left;
        margin-left: calc(40 / 1920 * 100vw);
        color: $black;
        margin-bottom: 20px;
      }
      .el-channel-search-input {
        width: 70%;
      }
      .channels-srollbar {
        text-align: left;
        padding: 10px;
        margin-left: 5%;
        overflow: hidden;
        min-height: 115px;
      }
      .arrow-content {
        @include point(min-width, 20);
        min-height: 20px;
        float: left;
        margin-top: 20px;
        width: 4%;
      }
      .icon-arrow {
        cursor: pointer;
      }

      .btn-content {
        width: 86%;
        float: left;
        display: flex;
        .btn-details {
          // width: 100px;
          display: inline-block;
          margin-bottom: 5px;
          @include point(margin-left, 15);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:last-child {
            @include point(margin-right, 15);
          }
        }
      }
    }
    .time-content {
      .time-title {
        display: flex;
        justify-content: space-between;
        margin: 20px;
        @include point(margin-left, 30);
        align-items: center;
        .date-title {
          display: block;
          text-align: left;
          color: $black;
          @media screen and(max-width: 1366px) {
            font-size: 14px;
          }
          @media screen and(min-width: 1366px) {
            font-size: 16px;
          }
        }
        .backTime-btn {
          @include point(right, 20);
          font-size: 12px;
          line-height: 12px;
          border-radius: 3px !important;
          width: 120px;
          padding: 6px 0;
          height: 28px;
          outline: none;
        }
      }
      .date-picker-content {
        margin: 0 auto;
        .date-picker.el-date-editor.el-input {
          width: calc(180 / 1920 * 100vw);
          margin-right: calc(20 / 1920 * 100vw);
          min-width: 128px;
        }
        .time-picker.el-date-editor.el-input {
          width: 120px;
        }
      }
    }
  }
}
</style>
<style scoped>
.el-test {
  width: 70px;
  position: relative;
  bottom: 5px;
}
</style>
<style>
.el-radio-button__inner {
  border-radius: 0px !important;
  width: 90px;
}

.el-prog .progress-bar {
  background-color: #fb4c5d;
}

.el-test .el-input__inner {
  height: 24px;
  line-height: 24px;
  border-radius: 0px;
  background-color: #34374a;
  color: #fff;
  padding: 0 10px;
  border: 0px;
}

.el-test .el-input__icon {
  line-height: 24px;
}

.select-popClass .el-select-dropdown__item {
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  background-color: #34374a;
  color: #fff;
  text-align: center;
}

.select-popClass .el-select-dropdown__item.hover {
  color: #f31d65 !important;
  background-color: #34374a !important;
}

.select-popClass .el-select-dropdown__item:hover {
  color: #f31d65 !important;
  background-color: #34374a !important;
}

.select-popClass .el-select-dropdown {
  border: 0px !important;
  background-color: #34374a !important;
}

.select-popClass .el-select-dropdown__item.selected {
  color: #fff;
  font-weight: 500 !important;
}

.select-popClass .el-select-dropdown__list {
  padding: 0;
}

.el-select-dropdown.el-popper.select-popClass {
  border: 0px;
}

.select-popClass.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #34374a !important;
}

.select-popClass.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #34374a !important;
}
</style>
<style scoped>
.el-search-input.el-input--small >>> .el-input__inner {
  background: #f4f5f9 !important;
  border-radius: 15px !important;
  height: 32px !important;
  line-height: 32px !important;
  padding-left: 30px;
  color: #425262;
  letter-spacing: 0px;
  width: 235px;
  font-size: calc(14 / 1920 * 100vw);
}

.el-channel-search-input.el-search-input.el-input--small >>> .el-input__inner {
  width: 100%;
}
</style>

<style>
@import "../../assets/css/importfile.css";
@import "../../assets/css/videoBar.css";
@import "../../assets/css/tabsItem.css";
@import "../../assets/css/pagination.css";

.el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}

.des-input .el-textarea__inner {
  font-family: Roboto, Arial, "Microsoft YaHei";
}

/*::-webkit-scrollbar {*/
/*width: 6px;*/
/*}*/
/*::-webkit-scrollbar-thumb {*/
/*background-color:rgba(144, 147, 153, 0.3);*/
/*border-radius: 4px;*/
/*position: absolute;*/
/*right: 2px;*/
/*bottom: 2px;*/
/*cursor:pointer;*/
/*}*/
</style>
