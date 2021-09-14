<template>
  <el-row class="el-container">
    <el-col :span="16" :class="{ liseAnmiClass: showSpread }" class="lside">
      <div class="el-header-title">
        <span v-if="showStoreUp" class="lside-title">
          {{ store.storeTitle }}
        </span>
        <div
          v-if="showStoreUp"
          :class="storeUpClass"
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
          :disabled="sourceList.length === 0"
          :size="varyWindowWidth > 1680 ? 'small' : 'mini'"
          class="el-submit"
          type="primary"
          @click="submit"
        >{{ $t("remotePatrol.submit") }}
        </el-button>
      </div>
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
      <component
        :is="currentVideoComponent"
        ref="vendorVideo"
        :store-id="store.storeId"
        :channel-info="channel"
        :source-list-length= "sourceList.length"
        :is-store-monitor="true"
        :play-back="playBackState"
        :is-event="false"
        :cur-time="playBackTime"
        :video-authority="videoAuthority"
        @confirmEzvizCanvas="editEzvizCanvas"/>

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
              <span class="event-title"><span class="is-required">* </span>{{ $t("remotePatrol.title") }}</span>
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
              $t("remotePatrol.emptyEventTitle") }}</span>
              <span v-if="!corEvent" class="event-title">{{ $t("remotePatrol.description") }}</span>
              <span v-else class="event-title"><span class="is-required">* </span>
                {{ $t("remotePatrol.description") }}
              </span>
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
                    <el-image
                      :src="item.src"
                      :style="{width: item.width, height: item.height}"
                      :preview-src-list="getImgList(index, sourceList)"/>
                  </div>
                </div>
                <span>* {{ $t("remotePatrol.storeMaxAttach") }}</span>
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
                  class="store-radio-class"
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
import ChannelIconBtn from '@/components/ChannelIconBtn.vue';
import DialogVue from '@/components/DialogVue.vue';
import filterString from '@/common/filterString.js';
import { getCookie } from '@/common/auth';
import SkywatchVideo from '@/components/SkywatchVideo';
import DashVideo from '@/components/DashVideo';
import EzvizVideo from '@/components/EzvizVideo';
import BeseyeVideo from '@/components/BeseyeVideo';

export default {
  name: 'StoreMoinitor',

  components: {
    ChannelIconBtn,
    DialogVue,
    SkywatchVideo,
    DashVideo,
    EzvizVideo,
    BeseyeVideo
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
      showStoreUp: false,
      cityList: [],
      popperClass: 'select-popClass',
      showModelContent: true,
      showControlInfo: true,
      errorText: '',
      showCancelContent: false,
      showCutContent: false,
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
      showControls: false,
      showSpread: false,
      videoEl: '',
      canvasEl: '',
      timeVideo: 0,
      checkImgSrc: '',
      showOuter: false,
      startTimeCutVideo: 0,
      endTImeCutVideo: 0,

      showCutModel: false,
      penBtnSrc: require('../../../static/img/edit_btn.png'),
      clearIconSrc: require('../../../static/img/clear.png'),
      removeIconSrc: require('../../../static/img/cancel.png'),
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
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
      vendor: 1,
      currentVideoComponent: 'EzvizVideo'
    };
  },

  created() {
    this.isFirstLoad = true;
  },

  computed: {
    percentHeight() {
      return this.varyWindowHeight / 758;
    },

    ...mapGetters({
      accountChanged: 'accountChanged',
      videoAuthority: 'videoAuthority'
    }),

    corEvent() {
      this.showEventNameInfo = false;
      this.showEventDescInfo = false;
      return this.evBtns[1].isActive;
    },

    storeUpClass() {
      return {
        'coll': this.store.storeUp,
        'nocoll': !this.store.storeUp,
        'storeUp-content': this.lang.indexOf('ja') === -1,
        'ja-storeUp-content': this.lang.indexOf('ja') !== -1
      }
    }

  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.changeBrand();
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        }, 300);
      }
    },

    realTimeSpeed(val) {
      const self = this;
      if (val >= 300) {
        self.stopVideoPlay();
        self.stopTimer();
      }
    },

    vendor(){
      this.currentVideoComponent = ['DashVideo', 'EzvizVideo', 'BeseyeVideo', 'SkywatchVideo'][this.vendor];
    }
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === 'storeSubEvent') {
      to.meta.isBack = true;
    } else {
      to.meta.isBack = false;
    }
    next((vm) => {
      vm.clearEvent();
    });
  },

  beforeRouteLeave(to, from, next) {
    const self = this;
    window.clearInterval(self.timeid);
    window.clearInterval(self.timerPlayReal);
    self.isPlayingFlag = -1;
    self.timerPlayReal = null;
    self.timeid = null;
    self.$refs.vendorVideo.stopVideoPlay();
    if (to.name !== 'storeSubEvent') {
      from.meta.keepAlive = false;
      if (self.previewplayer) {
        self.previewplayer.dispose();
      }
    } else {
      from.meta.keepAlive = true;
    }
    next();
  },

  async mounted() {
    const self = this;
    document.addEventListener('mouseup', self.mouseUpAction, false);
    self.myDivHeight();
    self.getOssInfo();
    self.getUpLoadBucketInfo();
    self.getInitStoreData();
  },

  beforeDestroy() {
    const self = this;
    document.removeEventListener('mouseup', self.mouseUpAction);
    window.onresize = null;
    self.mouseUpAction = null;
  },

  methods: {
    changeBrand() {
      const self = this;
      self.clearEvent();
      self.activeIndex = '0';
      self.accountId = localStorage.getItem('oss_bucket');
      self.hideLast = false;
      self.hideNext = false;
      self.evBtns[0].isActive = true;
      self.evBtns[1].isActive = false;
      self.changeFlag = true;
      self.playBackState = false;
      self.currentTimeValue = 0;
      self.showModelContent = true;
      self.getInitStoreData();
    },

    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
    },

    getOssInfo() {
      const self = this;
      self.accountId = localStorage.getItem('oss_bucket');
      const userId = getCookie('UserId');
      self.userId = userId;
    },

    clearEvent() {
      const self = this;
      self.eventName = '';
      self.eventDes = '';
      self.sourceList = [];
      self.curEvent = '';
      self.showEventNameInfo = false;
    },

    getAllStoreList() {
      const params = {
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
      const self = this;
      const getStoreTemp = (data) => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
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
          obj.vendor = item.vendor;
          obj.status = item.status;
          temp.push(obj);
        });
        return temp;
      };
      let data;
      switch (Number(self.activeIndex)) {
        case 0:
          const favoriteStoreList = self.allInitStoreList.filter(store => store.favorite === true);
          self.tabList[0].storeList = getStoreTemp(favoriteStoreList);
          break;
        case 1:
          data = self.getStoreObj();
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
      const self = this;
      const getStoreTemp = (data) => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
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
          obj.status = item.status;
          temp.push(obj);
        });
        return temp;
      };
      self.tabList[0].storeList = getStoreTemp(storeData);
      if (storeData.length === 0) {
        self.showStoreUp = false;
        self.store = {};
        self.channel = {};
        self.channelBtns = [];
        self.showChannelBtns = [];
        self.allChannelBtns = [];
      } else {
        if (!util.validateLicense(storeData[0].status)) {
          return false;
        }
        const obj = {};
        obj.storeId = storeData[0].storeId;
        obj.storeName = storeData[0].name;
        obj.storeTitle = storeData[0].name;
        obj.userName = storeData[0].userName;
        obj.storeUp = true;
        obj.storeUpTitle = self.$t('remotePatrol.stared');
        obj.status = storeData[0].status;
        self.store = obj;
        self.showStoreUp = true;
        const curStoreId = storeData[0].storeId;

        const storeObj = {
          storeId: curStoreId
        };
        self.saveStoreObj(storeObj);
        self.getChannelByStore(self.tabList[0].storeList[0]);
      }
    },

    async getInitStoreData(storeData) {
      const self = this;
      const getStore2Temp = (data) => {
        const cityList = [];
        data.forEach((item) => {
          if (cityList.map((x) => x.city).indexOf(item.city) === -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city === data[j].city) {
              const obj = {};
              obj.isActive = false;
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite = data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              obj.status = data[j].status;
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      try {
        const res = await self.getAllStoreList();
        if (res.errCode === 0) {
          const favoriteStoreList = res.data.content.filter(item => item.favorite === true);
          self.getFaStoreData(favoriteStoreList);
          const storeData = res.data.content;
          self.allInitStoreList = storeData;
          if (storeData.length === 0) {
            self.tabList[2].storeList = [];
            self.tempStoreList = [];
          } else {
            self.tabList[2].storeList = getStore2Temp(storeData);
            self.tempStoreList = getStore2Temp(storeData);
          }
        }
      } catch (err) {
        console.log('StoreMonitor-getInitStoreData: ' + err);
      }
    },

    addFavoriteStore(params) {
      const self = this;
      addFavoriteStore(params).then((res) => {
        if (res.errCode === 0) {
          self.store.storeUp = true;
          self.store.storeUpTitle = self.$t('remotePatrol.stared');
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
          this.getStoreList();
        }
      }).catch(err => {
        console.log('StoreMonitor-addFavoriteStore: ' + err);
      });
    },

    deleteFavoriteStore(params) {
      const self = this;
      deleteFavoriteStore(params).then((res) => {
        if (res.errCode === 0) {
          self.store.storeUp = false;
          self.store.storeUpTitle = self.$t('remotePatrol.clickToStar');
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
          self.getStoreList();
        }
      }).catch(err => {
        console.log('StoreMonitor-deleteFavoriteStore: ' + err);
      });
    },

    addStoreUp() {
      const self = this;
      const temp = [];
      temp.push(self.store.storeId);
      const params = {
        storeIds: temp
      };
      if (!self.store.storeUp) {
        self.addFavoriteStore(params);
      } else {
        self.deleteFavoriteStore(params);
      }
    },

    getEventList() {
      const self = this;
      const date = new Date();
      const params = {
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
      return new Promise((resolve) => {
        getEventList(params).then((res) => {
          const data = res.data.content;
          resolve(data);
        });
      }).catch(err => {
        console.log('StoreMonitor-getEventList: ' + err);
      });
    },

    async clickEventBtn(item, index) {
      const self = this;
      self.eventName = '';
      self.eventDes = '';
      self.curEvent = '';
      if (index === 1) {
        item.isActive = true;
        self.evBtns[0].isActive = false;
        let data = await self.getEventList();
        data = data.slice(0, 5);
        const temp = [];
        data.forEach((item) => {
          const obj = {};
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
      const self = this;
      self.eventList.forEach((item) => {
        if (item.id === val) {
          self.eventName = item.name;
        }
      });
      self.showEventNameInfo = false;
    },

    getCurTime() {
      const self = this;
      const year = self.dateValue.getFullYear();
      const month = self.dateValue.getMonth() + 1;
      const day = self.dateValue.getDate();
      const hours = self.curTime.getHours();
      const min = self.curTime.getMinutes();
      const second = self.curTime.getSeconds();
      const date =
        year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + second;
      const d = new Date(date);
      return d;
    },

    changeDate(val) {
      const self = this;
      self.startTs = 0;
      self.showModelContent = true;
      const d = self.getCurTime();
      self.curTime = d;
      const dstr = Number(d.getTime().toString().substr(0, 10));
      self.startTs = dstr;
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
      self.changeFlag = false;
      const startTime = [0, 3].includes(self.vendor) ? self.startTs : self.playBackTime;
      self.$refs.vendorVideo.changeHistoryTime(startTime);
    },

    getFileUrl(fileName) {
      const self = this;
      const bucketName = self.oss.ossBucketName;
      const endpoint = self.oss.ossEndPoint;
      if (self.oss.ossVendor === 2) {
        return `https://${endpoint}/${bucketName}/${fileName}`;
      } else {
        return `http://${bucketName}.${endpoint}/${fileName}`;
      }
    },

    uploadFileToAliyun(fileItem) {
      const self = this;
      const OSS = require('ali-oss');
      const client = new OSS({
        region: self.oss.ossEndPoint.slice(0, self.oss.ossEndPoint.indexOf('.')),
        accessKeyId: self.oss.ossAccessKeyId,
        accessKeySecret: self.oss.ossAccessKeySecret,
        bucket: self.oss.ossBucketName
      });
      const name = fileItem.fileName;
      return new Promise((resolve, reject) => {
        client.multipartUpload(name, fileItem.file, {
          progress: function * (percentage, cpt) {
            self.percentage = percentage;
          }
        })
          .then((results) => {
            const url = self.getFileUrl(results.name);
            resolve(url);
          })
          .catch((err) => {
            console.log('StoreMonitor-uploadFileToAliyun: ' + err);
          });
      });
    },

    uploadFileToAzure(fileItem) {
      const self = this;
      const url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
      const containerURL = new azblob.ContainerURL(
        url,
        azblob.StorageURL.newPipeline(new azblob.AnonymousCredential())
      );
      const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(
        containerURL,
        fileItem.fileName
      );
      return new Promise((resolve, reject) => {
        azblob.uploadBrowserDataToBlockBlob(
          azblob.Aborter.none,
          fileItem.file,
          blockBlobURL
        )
          .then((results) => {
            const url = self.getFileUrl(fileItem.fileName);
            resolve(url);
          })
          .catch((err) => {
            console.log('StoreMonitor-uploadFileToAzure: ' + err);
          });
      });
    },

    async upLoadFile(fileItem) {
      const self = this;
      self.percentage = 0;
      let url = '';
      if (self.oss.ossVendor == null) {
        self.oss.ossVendor = 1;
      }
      if (self.oss.ossVendor === 1) {
        url = await self.uploadFileToAliyun(fileItem);
      } else {
        url = await self.uploadFileToAzure(fileItem);
      }
      return url;
    },

    getImgList(index, sourceList) {
      const arr = [];
      let i = 0;
      for (i; i < sourceList.length; i++) {
        arr.push(sourceList[i + index]);
        if (i + index >= sourceList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.filter(source => source.mediaType === 2).map(source => source.src);
    },

    deleteImg(item, index) {
      this.sourceList.splice(index, 1);
    },

    getStorageInfo() {
      const self = this;
      const params = {};
      params.storeId = self.store.storeId;
      return new Promise((resolve, reject) => {
        getStorageInfo(params).then((res) => {
          if (res.errCode === 0) {
            self.oss = res.data;
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getAttachmentFileUrl() {
      const tempFileUrl = [];
      for (let i = 0; i < this.sourceList.length; i++) {
        const obj = {};
        if (this.sourceList[i].mediaType === 2) {
          const url = await this.upLoadFile(this.sourceList[i]);
          obj.mediaType = 2;
          obj.url = url;
          obj.deviceId = this.channel.id;
        } else if (this.sourceList[i].mediaType === 1) {
          const url = await this.upLoadFile(this.sourceList[i]);
          obj.mediaType = 1;
          obj.url = url;
          obj.deviceId = this.channel.id;
        }
        tempFileUrl.push(obj);
      }
      return tempFileUrl;
    },

    addEvent(tempFileUrl) {
      const self = this;
      const commentobj = {
        ts: new Date().getTime(),
        description: self.eventDes.trim(),
        attachment: tempFileUrl,
        status: 0
      };
      const curTs = util.getCurDate2StrBySign('/');
      const obj = {};
      obj.ts = new Date().getTime();
      obj.subject = self.eventName.trim();
      obj.storeId = self.store.storeId;
      obj.deviceId = self.channel.id;
      obj.comment = commentobj;
      const params = obj;
      let isSuccess = false;
      addEvent(params).then((res) => {
        self.fullscreenLoading = false;
        if (res.errCode === 0) {
          isSuccess = true;
        } else {
          isSuccess = false;
        }
        if (!isSuccess) {
          util.notify(self.$t('remotePatrol.submitFail'), 'warning', 3000);
          return;
        }
        const routeData = {
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
          ts: curTs
        };
        sessionStorage.setItem('store_submit', JSON.stringify(routeData));
        self.$router.push({
          name: 'storeSubEvent',
          params: { data: routeData }
        });
      }).catch(err => {
        console.log('StoreMonitor-addEvent' + err);
      });
    },

    async addComment(tempFileUrl) {
      const self = this;
      let isSuccess = false;
      const eventIds = [];
      eventIds.push(self.curEvent);
      const obj = {
        eventIds: eventIds,
        comment: {
          ts: new Date().getTime(),
          description: self.eventDes.trim(),
          attachment: tempFileUrl,
          status: 0
        }
      };
      const curTs = util.getCurDate2StrBySign('/');
      const params = obj;
      addComment(params).then((res) => {
        self.fullscreenLoading = false;
        if (res.errCode === 0) {
          isSuccess = true;
        } else {
          isSuccess = false;
        }
        if (!isSuccess) {
          util.notify(self.$t('remotePatrol.submitFail'), 'warning', 3000);
          return;
        }
        const routeData = {
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
      }).catch(err => {
        console.log('StoreMonitor-addComment' + err);
      });
    },

    async submit() {
      const self = this;
      if (self.eventName.trim().length === 0) {
        self.showEventNameInfo = true;
        return false;
      }
      if (self.corEvent && self.eventDes.trim().length === 0) {
        self.showEventDescInfo = true;
        return false;
      }
      await self.getStorageInfo();
      const tempFileUrl = await self.getAttachmentFileUrl();
      self.fullscreenLoading = true;
      if (self.evBtns[0].isActive) {
        self.addEvent(tempFileUrl);
      } else {
        self.addComment(tempFileUrl);
      }
    },

    mouseUpAction(e) {
      const self = this;
      self.isMouseDown = false;
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

    noBindDeviceDialog(val) {
      const self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },

    canceldNoBind(val) {
      const self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },

    searchStore() {
      const self = this;
      const tempStoreList = self.tempStoreList;
      const getStore2Temp = (data) => {
        const cityList = [];
        data.forEach((item) => {
          if (cityList.map((x) => x.city).indexOf(item.city) === -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city === data[j].city) {
              const obj = {};
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
      const temp = [];
      const tempArray = [];
      const tempStore = [];
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
      const self = this;
      self.getStoreList();
    },

    clearTheEventInfo() {
      const self = this;
      self.evBtns[0].isActive = true;
      self.evBtns[1].isActive = false;
      self.eventName = '';
      self.eventDes = '';
      self.sourceList = [];
      self.curSpeed = '1 X';
      self.curBack = '';
    },

    async changeStore(item, index, _item, _index) {
      const self = this;
      _item.isActive = true;
      self.clearTheEventInfo();
      self.showModelContent = true;
      const obj = {};
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
      const tabIndex = Number(self.activeIndex);
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
      const storeObj = {
        storeId: curStoreId
      };
      self.saveStoreObj(storeObj);
      self.getChannelByStore(_item);
    },

    saveStoreObj(storeObj) {
      const self = this;
      const key = 'recentStore_storeMonitor' + '_' + self.accountId + '_' + self.userId;
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
      const self = this;
      const key = 'recentStore_storeMonitor' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      const tempArray = [];
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      let indexArray = [];
      temp.forEach((item, index) => {
        indexArray.push(
          self.allInitStoreList.map((x) => x.storeId).indexOf(item.storeId)
        );
      });
      indexArray = indexArray.filter(function(x) {
        return x !== -1;
      });
      indexArray.forEach((item) => {
        tempArray.push(self.allInitStoreList[item]);
      });
      return tempArray;
    },

    changeStoreDialog() {
      const self = this;
      self.changeStoreObj.dialogCosed = false;
      self.changeStore(
        self.curTabItem,
        self.curTabIndex,
        self.curStoreItem,
        self.curStoreIndex
      );
    },

    canceldChangeStore() {
      this.changeStoreObj.dialogCosed = false;
    },

    clickStore(item, index, _item, _index) {
      let self = this;
      self.showStoreUp = true;
      if (!util.validateLicense(_item.status)) {
        return false;
      }
      self.curTabIndex = index;
      self.curTabItem = item;
      self.curStoreIndex = _index;
      self.curStoreItem = _item;
      if (self.$refs.vendorVideo.playState || self.eventName.length !== 0){
        self.changeStoreObj.dialogCosed = true;
      } else {
        self.changeStore(item, index, _item, _index);
      }
    },

    getChannelByStore(storeItem) {
      const self = this;
      const temp = [];
      self.hideLast = false;
      self.hideNext = false;
      self.showCutContent = false;
      self.$refs.vendorVideo.playState && self.$refs.vendorVideo.stopVideoPlay();
      storeItem.device.forEach((item, index) => {
        const obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.ivsId = item.ivsId;
        obj.channelId = item.channelId;
        obj.isonline = true;
        obj.vendor = item.vendor;
        if (index === 0) {
          obj.isClick = true;
          self.channel = {
            id: item.id,
            ivsId: item.ivsId,
            channelId: item.channelId,
            channelName: item.name,
            vendor: item.vendor
          };
          self.vendor = item.vendor;
        } else {
          obj.isClick = false;
        }
        item.status === 1 && temp.push(obj);
      });

      self.channelBtns = temp;
      self.allChannelBtns = temp;
      self.getshowBtns(temp);
    },

    getshowBtns(list) {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0]
        .offsetWidth;
      const detailsWidth = (window.innerWidth / 1440) * 15 + 60;
      const count = parseInt(width / detailsWidth); // the maxium channel to show
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
      const self = this;
      self.showModelContent = true;
      self.clearTheEventInfo();
      if (item.isonline) {
        item.isClick = true;
        const obj = {
          id: item.id,
          ivsId: item.ivsId,
          channelId: item.channelId,
          channelName: item.name,
          vendor: item.vendor
        };
        self.channel = obj;
        self.vendor = item.vendor;
      } else {
        return false;
      }
      self.showChannelBtns.forEach((_item, _index) => {
        if (_index !== index) {
          _item.isClick = false;
        }
      });

      if (this.vendor === 3) {
        self.$refs.vendorVideo.playBack &&
        (self.$refs.vendorVideo.startTs = self.playBackTime) && (self.$refs.vendorVideo.clipStartTime = self.playBackTime);
      }
      if (self.playBackState) {
        self.$refs.vendorVideo.changeHistoryTime(self.startTs);
      } else {
        self.$refs.vendorVideo.startVideo(self.channel.ivsId, self.channel.channelId, null);
      }
    },

    getIndexById(id) {
      const self = this;
      let curIndex = 0;
      self.channelBtns.forEach((item, index) => {
        if (item.id === id) {
          curIndex = index;
        }
      });
      return curIndex;
    },

    lastBar() {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0]
        .offsetWidth;
      const detailsWidth = (window.innerWidth / 1440) * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        const index = self.getIndexById(self.showChannelBtns[0].id);
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
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0]
        .offsetWidth;
      const detailsWidth = (window.innerWidth / 1440) * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        const index = self.getIndexById(self.showChannelBtns[count - 1].id);
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
      const self = this;
      self.changeChannelObj.dialogCosed = false;
      self.changeChannel(self.curChannelItem, self.curChannelIndex);
    },

    cancelchangeChannel() {
      const self = this;
      self.changeChannelObj.dialogCosed = false;
    },

    clickBtn(item, index) {
      const self = this;
      self.curChannelItem = item;
      self.curChannelIndex = index;
      if (self.eventName.trim().length !== 0) {
        self.changeChannelObj.dialogCosed = true;
      } else {
        self.changeChannel(item, index);
      }
    },

    backCurDate() {
      const self = this;
      self.dateValue = new Date();
      self.curTime = new Date();
      self.playBackState = false;
      self.showModelContent = true;
      self.curYear = new Date().getFullYear();
      self.curMonth = new Date().getMonth() + 1;
      self.realType = true;
      this.playBackTime = 0;
      this.$refs.vendorVideo.changeHistoryTime(null);
    },

    myDivHeight() {
      const self = this;
      if (self.corEvent) {
        const divLeft = document.getElementsByClassName('el-event')[0]
          .offsetHeight;
        const divRight = document.getElementsByClassName('event-rside')[0]
          .offsetHeight;
        const height = divLeft > divRight ? divLeft : divRight;
        document.getElementById('rightLine').style.height = height + 'px';
      }
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    editEzvizCanvas(src) {
      const self = this;
      const obj = {};
      obj.mediaType = 2;
      obj.src = src;
      obj.height = '100px';
      obj.width = '140px';
      obj.fileName = self.bucketImage + '/' + 'event' + '_' + util.getCurTimeStr() + '_' +
                      self.store.storeId + '_' + self.channel.channelId + '.jpg';
      obj.file = util.base64ToBlob(obj.src);
      self.sourceList.push(obj);
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
      self.showEventDescInfo = false;
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

    searchChannel() {
      const self = this;
      const tempChannelList = self.allChannelBtns;
      const temp = [];
      const tempArray = [];
      const tempChannel = [];
      tempChannelList.forEach((_item) => {
        temp.push(util.getPinyinList(_item.name));
        tempChannel.push(_item);
      });
      for (let i = 0; i < temp.length; i++) {
        if (temp[i][0].indexOf(self.serachChannelValue.trim()) !== -1 ||
            temp[i][1].indexOf(self.serachChannelValue.trim()) !== -1) {
          tempArray.push(tempChannel[i]);
        }
      }
      self.channelBtns = tempArray;
      self.getshowBtns(tempArray);
    }

  }
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
      .ja-storeUp-content{
        @extend .storeUp-content;
        width: 120px;
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
            .store-radio-class {
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
  height: 100%;
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
