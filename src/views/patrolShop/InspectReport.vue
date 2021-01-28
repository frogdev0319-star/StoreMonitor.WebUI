<template>
  <div ref="printPDF" class="report-container">
    <img :src="report.iconSrc" :height="reportImgHeight" alt="" class="report-img">
    <div class="el-header">
      <img :src="report.inspectSrc" class="title-icon">
      <span class="report-title">{{ report.storeName+' '+report.tagName+' ('+report.inspectType+')' }}</span>
      <div :style="isexportPDF ? 'margin-right : 40px;':''" class="info-content">
        <span class="info-label">{{ $t('remotePatrol.submitter') }}</span>
        <span class="info-value">{{ report.submitterName }}</span>
        <span class="info-label">{{ $t('remotePatrol.generateTime') }}</span>
        <span class="info-value">{{ report.dateStr }}</span>
        <div style="display:inline-block;">
          <div class="no-print">
            <div class="exportbtn" @click="handleDown">
              <i class="iconfont icon-pdf export"/>
              <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="el-acticle">
      <div v-if="suggest!=null&&suggest.length!=0" class="suggest">
        <div class="suggest-content">
          <span>{{ $t('remotePatrol.advice') }}</span>
          <span v-html="turnSuggest(suggest)"/>
        </div>
      </div>
      <el-row class="report-content">
        <el-col :span="24" class="radior-content">
          <div class="header-score">
            <span class="span-1">{{ $t('remotePatrol.getscore') }}：</span>
            <span class="span-2">{{ totalScore }} <span>{{ $t('remotePatrol.scorecount') }}</span></span>
            <span class="span-4">{{ $t('remotePatrol.scoreU') }}</span>
          </div>
          <v-chart ref="chartRadar" :options="options" :auto-resize="true" class="chart-content"/>
        </el-col>
      </el-row>
      <el-row class="row-table">
        <el-col>
          <table v-for="(s_item,s_index) in tableData" :key="s_index" class="table table-bordered">
            <thead>
              <tr v-if="s_item[0].type==0">
                <th
                  v-for="(t_item ,t_index) in theaderPassFail"
                  :key="t_index"
                  :style="t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
              <tr v-if="s_item[0].type==1">
                <th
                  v-for="(t_item ,t_index) in theaderScore"
                  :key="t_index"
                  :style="t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
              <tr v-if="s_item[0].type==2">
                <th
                  v-for="(t_item ,t_index) in theaderOther"
                  :key="t_index"
                  :style="t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr style="vertical-align:middle;">
                <td :rowspan="s_item.length+1" style="vertical-align:middle;">
                  <span v-if="s_item[0].type==0">{{ $t('insSettingView.sheetpassfail') }}</span>
                  <span v-if="s_item[0].type==1">{{ $t('insSettingView.sheetscore') }}</span>
                  <span v-if="s_item[0].type==2">{{ $t('insSettingView.sheetother') }}</span>
                </td>
              </tr>
              <tr v-for="(item,index) in s_item" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{ item.groupName }}</span>
                  <span class="count-blag">{{ item.numOfTotalItems }}</span>
                </td>
                <td v-if="item.type==0||item.type==2"><span>{{ item.numOfQualifiedItems }}</span></td>
                <td v-if="item.type==0||item.type==2"><span>{{ item.numOfUnqualifiedItems }}</span></td>
                <td v-if="item.type==1"><span>{{ item.totalScore }}</span></td>
                <td><span>{{ item.numOfIgnored }}</span></td>
                <td v-if="item.type==1||item.type==2"><span>{{ item.actualScore }}</span></td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
      <el-row class="row-footer">
        <el-col
          v-for="(item,index) in tempList"
          :span="tempList.length === 4 ? 6 : 8"
          :key="index"
          class="details-content">
          <div v-if="index < 3" class="details">
            <div class="item-header">
              <i :class="item.iconSrc" class="iconfont icontemp"/>
              <span class="title-lable">{{ item.itemTitleName }}</span>
              <div class="count-content">
                <span class="count">{{ item.itemCount }}</span>
                <span class="blag">{{ $t('remotePatrol.unit') }}</span>
              </div>
            </div>
            <div class="item-content">
              <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                <div v-for="_item in item.itemList" :key="_item.id" class="item-details">
                  <div class="item-blag"/>
                  <span class="item-name">{{ index !== 2 ?_item.name : _item.subject }}</span>
                  <span class="item-des"/>
                </div>
              </el-scrollbar>
              <span v-if="item.itemCount > 6 && isexportPDF" class="moreInfotip">
                {{ $t('remotePatrol.more') }}
              </span>
            </div>
          </div>
          <div v-else class="details">
            <div class="item-header">
              <i :class="item.iconSrc" class="iconfont icontemp"/>
              <span class="title-lable">{{ item.itemTitleName }}</span>
            </div>
            <div class="item-content item-img">
              <div class="item-details" style="height:100%;">
                <img :src="item.itemList">
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-detail">
        <el-col>
          <div class="item-header" @click=" isup ? isup = false : isup = true">
            <i v-if="isup" class="iconfont icon-zhedie1 icontemp" style="color: #eb1d63;"/>
            <i v-if="!isup" class="iconfont icon-zhankai1 icontemp" style="color:#7d8cad;"/>
            <span class="title-lable">{{ $t('remotePatrol.detailInfo') }}</span>
          </div>
          <div v-show="isup" class="item-content">
            <div v-for="(item,index) in groups" :key="index" style="border-bottom:1px solid #f4f5f9;margin-bottom:20px;">
              <div class="content-title">{{ item.groupName }}</div>
              <div v-for="(_item,_index) in item.items" :key="_index" class="content-detail">
                <div class="content-detail-title">
                  <div class="detail-title">
                    <p class="title1">{{ _index+1 }}.{{ _item.subject }}</p>
                    <p class="title2">{{ _item.description }}</p>
                  </div>
                  <div v-if="_item.grade === Math.pow(-2,31)" class="ignore-btn">{{ $t('remotePatrol.ignored') }}</div>
                  <div v-if="(item.groupType === 0 || item.groupType === 2) && _item.grade === 0" class="title-btn">
                    {{ $t('remotePatrol.scoreUnit') }}{{ $t('remotePatrol.failed') }}
                  </div>
                  <div v-if="(item.groupType === 0||item.groupType === 2) && _item.grade === 1" class="title-btn">
                    {{ $t('remotePatrol.scoreUnit') }}{{ $t('remotePatrol.pass') }}
                  </div>
                  <div v-if="item.groupType==1&&_item.grade!=Math.pow(-2,31)" class="title-btn">
                    {{ $t('remotePatrol.scoreUnit') }}{{ _item.grade }}
                  </div>
                </div>
                <div
                  v-if="_item.showAttachment || _item.comment != null && _item.comment !== ''"
                  class="content-detail-main"
                  style="padding-bottom: 20px;">
                  <p class="cdm-title">{{ $t('remotePatrol.commentDetail') }}</p>
                  <div v-if="_item.showAudio" class="cdm-voice">
                    <div class="speech-info" @click="startSpeechItem(_item,_index)">
                      <i class="iconfont icon-yuyin icon-speech"/>
                    </div>
                    <audio :ref="_item.audio.audioRef" @canplay="getGroupsDuration(_item)">
                      <source :src="_item.audio.audioSrc" type="audio/mpeg" >
                    </audio>
                    <span class="often-text">{{ _item.audio.audioOftenText }}</span>
                  </div>
                  <div v-if="_item.comment != null && _item.comment !== ''" class="cdm-word">
                    <span>{{ _item.comment }}</span>
                  </div>
                  <div v-if="_item.sourceList != null && _item.sourceList.length !== 0" class="cdm-pic">
                    <div
                      v-for="(sourceitem,sourceindex) in _item.sourceList"
                      :key="sourceindex"
                      :height="imgHeight+'px'"
                      class="source-details">
                      <div v-if="sourceitem.mediaType === 2" class="img-content">
                        <img
                          :title="imgTitle"
                          :style="isexportPDF ? 'width:130px;' : 'width: calc(130/1920*100vw);'"
                          :src="sourceitem.url"
                          :height="imgHeight+'px'"
                          :onerror="deafultImg"
                          class="imgLittle imgInner"
                          @click="openOuter(sourceitem,$event)">
                      </div>
                      <div
                        v-if="sourceitem.mediaType==1"
                        class="img-content "
                        @click="playCommentVideo(sourceitem,sourceindex)">
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                        <img
                          :style="isexportPDF ? 'width:130px;':'width: calc(130/1920*100vw);'"
                          :src="videoImgSrc"
                          :height="imgHeight+'px'"
                          class="imgLittle">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="showFeedBacks" style="margin-bottom:20px;">
              <div class="content-title">{{ $t('remotePatrol.feedbacks') }}</div>
              <div v-for="(item,index) in feedbacks" :key="index" class="content-detail">
                <div class="content-detail-title" style="background-color:#fff;min-height:30px;">
                  <div class="detail-title">
                    <p class="title1">{{ index+1 }}.{{ item.subject }}</p>
                  </div>
                </div>
                <div
                  v-if="item.showAttachment || item.description != null&&item.description !== ''"
                  class="content-detail-main">
                  <p class="cdm-title">{{ $t('remotePatrol.description') }}：</p>
                  <div v-if="item.showAudio" class="cdm-voice">
                    <div class="speech-info" @click="startSpeechFeedBacks(item,index)">
                      <i class="iconfont icon-yuyin icon-speech"/>
                    </div>
                    <audio :ref="item.audio.audioRef" @canplay="getFeedBacksDuration(item)">
                      <source :src="item.audio.audioSrc" type="audio/mpeg" >
                    </audio>
                    <span class="often-text">{{ item.audio.audioOftenText }}</span>
                  </div>
                  <div v-if="item.description !=null && item.description !=''" class="cdm-word">
                    <span>{{ item.description }}</span>
                  </div>
                  <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="cdm-pic">
                    <div
                      v-for="(sourceitem,index) in item.sourceList"
                      :key="index"
                      :height="imgHeight+'px'"
                      class="source-details">
                      <div v-if="sourceitem.mediaType === 2" class="img-content">
                        <img
                          :title="imgTitle"
                          :style="isexportPDF ? 'width:130px;' : 'width: calc(130/1920*100vw);'"
                          :src="sourceitem.url"
                          :height="imgHeight+'px'"
                          :onerror="deafultImg"
                          class="imgLittle imgInner"
                          @click="openOuter(sourceitem,$event)">
                      </div>
                      <div
                        v-if="sourceitem.mediaType === 1"
                        class="img-content "
                        @click="playCommentVideo(sourceitem,index)">
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                        <img
                          :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'"
                          :src="videoImgSrc"
                          :height="imgHeight+'px'"
                          class="imgLittle">
                      </div>
                    </div>
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
            <transition name="fade">
              <el-dialog
                v-if="showOuter"
                :title="$t('eventView.view')"
                :visible.sync="showOuter"
                :close-on-click-modal="false"
                width="850px"
                top="12%">
                <div class="video-dialog-content" style="overflow:hidden;text-align:center;">
                  <hr class="dialog-hr">
                  <div class="dialog-source-content">
                    <img v-if="showImg" :src="checkImgSrc">
                  </div>
                </div>
              </el-dialog>
            </transition>
          </div>
        </el-col>
      </el-row>
      <div class="no-print">
        <el-dialog :visible.sync="downloadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
          <div class="body-content">
            <p>{{ $t('remotePatrol.downloading') }}</p>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import ECharts from 'vue-echarts';
import { getInspectReportInfo, getInspectReportDetail } from '../../api/inspect';
import util from '@/common/util';
import videojs from '../../../static/video.js';
import 'videojs-contrib-hls';
import resize from '@/components/mixins/resize';

export default {
  name: 'InspectReport',

  components: {
    'v-chart': ECharts
  },

  mixins: [resize],

  data() {
    return {
      reportId: 0,
      downloadProgress: false,
      hasAttachment: 0,
      varyWindowWidth: window.innerWidth,

      videoSrc: require('../../../static/img/monitor.png'),
      inspectSrc: require('../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../static/img/onsite_patrol.png'),

      inspectSrc1: require('../../../static/img/dangerous_cn.png'),
      inspectSrc2: require('../../../static/img/good_cn.png'),
      inspectSrc3: require('../../../static/img/improved_cn.png'),
      inspectSrc4: require('../../../static/img/dangerous_en.png'),
      inspectSrc5: require('../../../static/img/good_en.png'),
      inspectSrc6: require('../../../static/img/improved_en.png'),
      inspectSrc7: require('../../../static/img/dangerout_tw.png'),
      inspectSrc8: require('../../../static/img/excellent_cn.png'),
      inspectSrc9: require('../../../static/img/excellent_en.png'),
      inspectSrc10: require('../../../static/img/excellent_tw.png'),
      report: null,
      suggest: '',
      summary: [],
      totalScore: '',
      tableData: [],
      tempList: [],
      options: null,
      theaderList: [
        {
          name: this.$t('remotePatrol.items')
        },
        {
          name: this.$t('remotePatrol.passItem')
        },
        {
          name: this.$t('remotePatrol.failedItem')
        }
      ],
      pass: this.$t('remotePatrol.pass'),
      failed: this.$t('remotePatrol.failed'),
      lang: this.$i18n.locale,
      isInsiteInspect: false,
      sidebarElm: null,
      isup: false,
      isexportPDF: false,
      groups: [],
      feedbacks: [],
      showFeedBacks: false,
      dialogCommentVideo: false,
      showOuter: false,
      showImg: false,
      checkImgSrc: '',
      previewplayer: '',
      imgTitle: '',
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
      deafultImg: 'this.src="' + require('../../../static/img/picture_failed.png') + '"',
      theaderPassFail: [
        { name: '', width: 'width:11%;' },
        { name: this.$t('remotePatrol.item'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.pass'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.failed'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.TableIgnore'), width: 'width:20%;' }
      ],
      theaderScore: [
        { name: '', width: 'width:11%;' },
        { name: this.$t('remotePatrol.item'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.TableTotal'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.TableIgnore'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:20%;' }
      ],
      theaderOther: [
        { name: '', width: 'width:11%;' },
        { name: this.$t('remotePatrol.item'), width: 'width:20%;' },
        { name: this.$t('remotePatrol.pass'), width: 'width:15%;' },
        { name: this.$t('remotePatrol.failed'), width: 'width:15%;' },
        { name: this.$t('remotePatrol.TableIgnore'), width: 'width:15%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:15%;' }
      ]
    };
  },

  computed: {
    reportImgHeight() {
      return (this.varyWindowWidth / 1920) * 100;
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
    }
  },

  created() {
    this.getRouterData();
  },

  mounted() {
    this.getReportInfo();
    this.getReportDetail();
  },

  beforeDestroy() {
    self.$refs.chartRadar && self.$refs.chartRadar.dispose();
  },

  methods: {
    handleDown() {
      const self = this;
      if (self.hasAttachment !== 0) {
        self.downloadProgress = true;
      }
      var timer = setInterval(function() {
        if (document.readyState === 'complete') {
          new Promise(async function(resolve) {
            self.isup = true;
            self.isexportPDF = true;
            resolve(true);
          }).then(function() {
            self.$print(self.$refs.printPDF);
            setTimeout(() => {
              if (self.hasAttachment !== 0) {
                self.downloadProgress = false;
              }
            }, timer * 10);
            console.log('timer', timer);
            self.isexportPDF = false;
          });
          window.clearInterval(timer);
        }
      }, 500);
    },

    getRouterData() {
      const self = this;
      const routeData = JSON.parse(sessionStorage.getItem('report_data'));
      const obj = {};
      obj.reportId = routeData.id;
      obj.storeName = routeData.storeName;
      obj.status = routeData.status;
      obj.dateStr = util.getDateStr(routeData.ts);
      obj.submitterName = routeData.submitterName;
      obj.tagName = routeData.tagName;
      switch (routeData.mode) {
        case 0:
          obj.inspectSrc = self.inspectSrc;
          obj.inspectType = self.$t('overview.remotePatrol');
          break;
        case 1:
          obj.inspectSrc = self.insiteInspectSrc;
          self.isInsiteInspect = true;
          obj.inspectType = self.$t('overview.onsitePatrol');
          break;
        default:
          obj.inspectSrc = self.videoSrc;
          break;
      }
      switch (routeData.status) {
        case 0: {
          // dangerous
          if (self.lang === 'zh') {
            obj.iconSrc = self.inspectSrc1;
          } else if (self.lang === 'en') {
            obj.iconSrc = self.inspectSrc4;
          } else if (self.lang === 'zhtw') {
            obj.iconSrc = self.inspectSrc7;
          } else {
            obj.iconSrc = self.inspectSrc1;
          }
          break;
        }
        case 1: {
          // improved
          if (self.lang === 'zh') {
            obj.iconSrc = self.inspectSrc3;
          } else if (self.lang === 'en') {
            obj.iconSrc = self.inspectSrc6;
          } else if (self.lang === 'zhtw') {
            obj.iconSrc = self.inspectSrc3;
          } else {
            obj.iconSrc = self.inspectSrc3;
          }
          break;
        }

        case 2: {
          // pass
          if (self.lang === 'zh') {
            obj.iconSrc = self.inspectSrc2;
          } else if (self.lang === 'en') {
            obj.iconSrc = self.inspectSrc5;
          } else if (self.lang === 'zhtw') {
            obj.iconSrc = self.inspectSrc2;
          } else {
            obj.iconSrc = self.inspectSrc2;
          }
          break;
        }
        default: {
          // good
          if (self.lang === 'zh') {
            obj.iconSrc = self.inspectSrc8;
          } else if (self.lang === 'en') {
            obj.iconSrc = self.inspectSrc9;
          } else if (self.lang === 'zhtw') {
            obj.iconSrc = self.inspectSrc10;
          } else {
            obj.iconSrc = self.inspectSrc8;
          }
          break;
        }
      }
      self.report = obj;
    },

    async getReportDetail() {
      const self = this;
      const params = {
        reportId: self.report.reportId
      };
      getInspectReportDetail(params).then(res => {
        const data = res.data;
        const temp = [];
        const feedtemp = [];
        // let gradetotal = []
        data.groups.sort((a, b) => {return a.groupType - b.groupType; });
        data.groups.forEach((groupitem, groupindex) => {
          const obj = {
            items: []
          };
          obj.groupId = groupitem.groupId;
          obj.groupName = groupitem.groupName;
          obj.groupType = groupitem.groupType;
          groupitem.items.forEach((item, index) => {
            const details = {};
            details.subject = item.subject;
            details.comment = item.comment;
            details.description = item.description;
            details.grade = item.grade;
            if (item.attachment.length !== 0) {
              const _temp = [];
              const audioObj = {};
              self.hasAttachment++;
              details.showAttachment = true;
              item.attachment.forEach((_item, _index) => {
                if (_item.mediaType === 0) {
                  audioObj.audioSrc = _item.url;
                  audioObj.audioRef = 'audioRef' + groupindex + index + _index;
                  audioObj.isPlaying = false;
                  audioObj.audioOftenText = '';
                  details.showAudio = true;
                } else {
                  _temp.push(_item);
                }
              });
              details.audio = audioObj;
              details.sourceList = _temp;
            } else {
              details.showAttachment = false;
            }
            obj.items.push(details);
          });
          temp.push(obj);
        });
        debugger
        self.groups = temp;
        if (data.feedbacks.length === 0) {
          this.showFeedBacks = false;
        } else {
          this.showFeedBacks = true;
          data.feedbacks.forEach((item, index) => {
            const obj = {};
            obj.subject = item.subject;
            obj.description = item.description;
            if (item.attachment.length !== 0) {
              const _temp = [];
              const audioObj = {};
              self.hasAttachment++;
              obj.showAttachment = true;
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
            } else {
              obj.showAttachment = false;
            }
            feedtemp.push(obj);
          });
          self.feedbacks = feedtemp;
        }
      }).catch(err => {
        console.log('InspectReportDetail-getReportDetail: ' + err);
      });
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

    getGroupsDuration(item) {
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

    getFeedBacksDuration(item) {
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

    startSpeechItem(item, index) {
      const self = this;
      if (!item.audio.isPlaying) {
        self.$refs[item.audio.audioRef][0].play();
        item.audio.isPlaying = true;
      } else {
        self.$refs[item.audio.audioRef][0].pause();
        item.audio.isPlaying = false;
      }
      self.groups.forEach((groupitem, groupindex) => {
        groupitem.items.forEach((_item, _index) => {
          if (_item.audio !== undefined) {
            if (_index !== index) {
              if (self.$refs[_item.audio.audioRef] !== undefined) {
                self.$refs[_item.audio.audioRef][0].pause();
                _item.audio.isPlaying = false;
              }
            }
          }
        });
      });
    },

    startSpeechFeedBacks(item, index) {
      const self = this;
      if (!item.audio.isPlaying) {
        self.$refs[item.audio.audioRef][0].play();
        item.audio.isPlaying = true;
      } else {
        self.$refs[item.audio.audioRef][0].pause();
        item.audio.isPlaying = false;
      }
      self.feedbacks.forEach((_item, _index) => {
        if (_item.audio !== undefined) {
          if (_index !== index) {
            if (self.$refs[_item.audio.audioRef] !== undefined) {
              self.$refs[_item.audio.audioRef][0].pause();
              _item.audio.isPlaying = false;
            }
          }
        }
      });
    },

    getSummaryInfo(summary) {
      const summaryTemp = [];
      summary.forEach(item => {
        const obj = {};
        obj.groupId = item.groupId;
        obj.groupName = item.groupName;
        obj.count = item.numOfTotalItems;
        obj.isQua = item.result === 1;
        obj.numOfExcellentItems = item.numOfExcellentItems;
        obj.numOfQualifiedItems = item.numOfQualifiedItems;
        obj.numOfUnqualifiedItems = item.numOfUnqualifiedItems;
        summaryTemp.push(obj);
      });
      this.summary = summaryTemp;
    },

    getReportItemsListInfo(data) {
      let tempArray = [];
      this.isInsiteInspect && data.signature ? tempArray = new Array(4) : tempArray = new Array(3);
      tempArray[0] = {
        itemTitleName: this.$t('remotePatrol.notableItem'),
        iconSrc: 'icon-zhongxindingwei',
        itemCount: data.focalItems.length,
        itemList: data.focalItems
      };
      tempArray[1] = {
        itemTitleName: this.$t('remotePatrol.inapplicableItem'),
        iconSrc: 'icon-hulve',
        itemCount: data.ignoredItems.length,
        itemList: data.ignoredItems
      };
      tempArray[2] = {
        itemTitleName: this.$t('remotePatrol.feedbacks'),
        iconSrc: 'icon-fankui',
        itemCount: data.feedback.length,
        itemList: data.feedback
      };
      if (this.isInsiteInspect && data.signature) {
        tempArray[3] = {
          itemTitleName: this.$t('remotePatrol.signature'),
          iconSrc: 'icon-fankui',
          itemCount: '',
          itemList: data.signature.content
        };
      }
      this.tempList = tempArray;
    },

    async getReportInfo() {
      const self = this;
      const reportId = self.report.reportId;
      const temp = [];
      temp.push(reportId);
      const params = {
        reportIds: temp
      };
      getInspectReportInfo(params).then(res => {
        if (res.errCode === 0 && res.data.length > 0) {
          const data = res.data[0].info;
          self.suggest = data.comment;
          const summary = data.summary;
          const te_temp = [];
          for (let i = 0; i < 3; i++) {
            const typeIndex = summary.filter(x => x.type === i);
            if (typeIndex.length !== 0) {
              typeIndex[0].type === 0 ? te_temp.push(typeIndex) : '';
              typeIndex[0].type === 1 ? te_temp.push(typeIndex) : '';
              typeIndex[0].type === 2 ? te_temp.push(typeIndex) : '';
            }
          }
          self.tableData = te_temp;
          self.totalScore = data.totalScore;
          self.getSummaryInfo(summary);
          self.getReportItemsListInfo(data);
          self.getRadarOption();
        }
      }).catch(err => {
        console.log('InspectReportDetail-getReportInfo: ' + err);
      });
    },

    getRadarOption() {
      const self = this;
      const options = self.getRadarChartOption();
      const tempIndicator = [];
      const seriesValue = [];
      self.summary.forEach(item => {
        const obj = {};
        obj.name = item.groupName;
        obj.max = Number(item.numOfQualifiedItems + item.numOfUnqualifiedItems) === 0
          ? 1 : Number(item.numOfQualifiedItems + item.numOfUnqualifiedItems);
        tempIndicator.push(obj);
        seriesValue.push(item.numOfQualifiedItems);
      });
      const temp = [];
      const obj = { value: seriesValue };
      temp.push(obj);
      options.radar[0].indicator = tempIndicator;
      options.radar[1].indicator = tempIndicator;
      options.series[0].data = temp;
      options.series[1].data = temp;
      if (tempIndicator.length < 6) {
        options.radar.splitNumber = tempIndicator.length;
      } else {
        options.radar.splitNumber = 5;
      }
      self.options = options;
    },

    getRadarChartOption() {
      const radarChartOption = {
        backgroundColor: '#fff',
        tooltip: {
          backgroundColor: 'rgba(30,34,52,0.75)'
        },
        textStyle: {
          fontFamily: 'Roboto, Microsoft YaHei'
        },
        legend: {
          data: ['inspect radar']
        },
        radar: [
          {
            indicator: [],
            nameGap: 5,
            center: ['50%', '50%'],
            name: {
              textStyle: {
                color: '#7d8cad',
                borderRadius: 3,
                padding: [3, 5]
              },
              formatter: (params) => {
                let str = '';
                if (params.length > 10) {
                  str = params.substr(0, 10) + '...';
                } else {
                  str = params;
                }
                return str;
              }
            },
            splitArea: {
              show: false
            }
          },
          {
            indicator: [],
            center: ['50%', '50%'],
            name: {
              textStyle: {
                color: 'rgba(255,255,255,0)',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [{
          type: 'radar',
          data: []
        },
        {
          type: 'radar',
          data: [],
          name: this.$t('remotePatrol.category'),
          radarIndex: 1,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#FDBA40',
                width: 4
              },
              areaStyle: {
                color: '#D7E5FD'
              }
            }
          },
          tooltip: {
            trigger: 'item'
          }
        }
        ]
      };
      return radarChartOption;
    },

    turnSuggest(data) {
      return data.replace(/(\r\n|\n|\r)/gm, '<br/>');
    },

    adjustChart() {
      this.$refs.chartRadar && this.$refs.chartRadar.resize();
    }
  }
};
</script>
<style lang="scss" scoped>
  @import 'node_modules/bootstrap/scss/bootstrap';
  @import 'node_modules/bootstrap-vue/src/index.scss';
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
  @media print {
  .content-detail-title{ page-break-inside:avoid;}
  .cdm-title{ page-break-inside:avoid;}
  .cdm-voice{ page-break-inside:avoid;}
  .cdm-word{ page-break-inside:avoid;}
  .cdm-pic{ page-break-inside:avoid;}
  .thPrintfont{font-size: 10px;}
  .tdPrintfont{font-size: 8px;}
  }
  $red: #f31d65;
  $black: #182752;
  $border: #e3e9f4;
  $background: #f4f5f9;
  $tab: #7d8cad;
  $h1: #292e36;
  $qualified: #6097F3;
  $noqualied: #FDBA40;
  $suggestBack: #F1F6FE;
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  .AddSumupLoad /deep/ .el-dialog__body{
    padding:30px 40px !important;
    text-align: left;
    .body-content{
        p{
            margin-bottom:0;
            color:#182752;
            font-size: calc(14/1920*100vw);
        }
    }
  }
  .report-container {
    width: 100%;
    height: 100%;
    color: $black;
    position: relative;
    // border: 1px solid $border;
    border: 1px solid #fff;
    background-color: #fff;
    .report-img {
      position: absolute;
      right: 2px;
      top: 2px;
    }
    .el-header {
      width: 100%;
      height: 80px;
      text-align: left;
      border-bottom: 1px solid $border;
      line-height: 80px;
      padding-left: calc(30 / 1920 * 100vw);
      position: relative;
      .report-title {
        font-size: calc(20 / 1920 * 100vw);
        font-weight: bold;
        margin-left: calc(20 / 1920 * 100vw);
      }
      .info-content {
        position: absolute;
        right: calc(110 / 1920 * 100vw);
        top: 0;
        font-size: calc(12 / 1920 * 100vw);
        .info-label {
          margin-left: calc(40 / 1920 * 100vw);
          color: $tab;
        }
        .info-value {
          color: $tab;
        }
        .exportbtn{
          display: inline-block;
          width:120px;
          min-width: 85px;
          height:36px;
          line-height: 36px;
          border-radius: 2px;
          text-align: center;
          margin-left:calc(20 / 1920 * 100vw);
          margin-right: calc(30 / 1920 * 100vw);
          background-color: $red;
          color:#ffffff;
          cursor: pointer;
          span{
            font-size:14px;
          }
          .export{
            font-size:20px;
          }
        }
      }
    }
    .el-acticle {
      text-align: left;
      padding-left: calc(40 / 1920 * 100vw);
      padding-right: calc(40 / 1920 * 100vw);
      .suggest {
        margin-top: 20px;
        font-size: calc(14 / 1920 * 100vw);
        font-weight: bold;
        height: calc(20 / 1920 * 100vw);
        line-height: 20px;
        background-color: $suggestBack;
        color: $qualified;
        padding-left: calc(30 / 1920 * 100vw);
        border: 1px solid #a0c1f8;
        max-height: 100px;
        height: auto;
        overflow-y: auto;
        .suggest-content {
          display: flex;
        }
        span:first-child {
          width:100px;
          padding-right: calc(20 / 1920 * 100vw);
        }
        span:last-child{
          flex:1;
          min-width:200px;
          word-wrap: break-word;
        }
      }
      .report-content {
        margin-top: 15px;
        .radior-content {
          height: 300px;
          .header-score{
            margin-bottom: 10px;
            font-weight: bold;
              .span-1{
                  font-size: calc(14/1920*100vw);
                  color: $black;
              }
              .span-2{
                  color: $red;
                  font-size: calc(20/1920*100vw);
              }
              .span-3{
                  color: $tab;
                  font-size: calc(12/1920*100vw);
              }
              .span-4{
                float: right;
                font-weight: 400;
                color: $tab;
                font-size: calc(12/1920*100vw);
              }
          }
          .chart-content {
            width: 100%;
            height: 100%;
          }
          /*@media screen and (min-width: 1280px) and(max-width: 1440px) {*/
            /*height: calc(360 / 1920 * 100vw);*/
          /*}*/
        }
        .report-table {
          font-size: calc(14 / 1920 * 100vw);
          padding-left: calc(40/1920*100vw);
          .header-score{
            margin-bottom: 10px;
            font-weight: bold;
              .span-1{
                  font-size: calc(14/1920*100vw);
                  color: $black;
              }
              .span-2{
                  color: $red;
                  font-size: calc(20/1920*100vw);
              }
              .span-3{
                  color: $tab;
                  font-size: calc(12/1920*100vw);
              }
          }
          th {
            color: $tab;
            background-color: $background;
            text-align: center;
            border-bottom-width: 1px;
            padding: 0.5rem;
            &:first-child {
              width: 55%;
            }
            &:not(:first-child) {
              width: 15%;
              text-align: left;
              padding-left: 1rem;
            }
          }
          td {
            color: $black;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            padding-left: 1rem;
          }
          .icon-td {
            text-align: center;
          }
          .icon-content {
            text-align: left;
            margin-left: 10%;
          }
          .icon-blag {
            display: inline-block;
            width: 80px;
            padding: 3px 6px;
            text-align: center;
            color: #fff;
            font-size: calc(12 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
          }
        }
      }
      .row-table{
        margin-top: calc(10 / 1920 * 100vw);
        .table-bordered{
                font-size: calc(14/1920*100vw);
                margin-top: 20px;
                th{
                    color: $tab;
                    text-align: left;
                    background-color: $background;
                    border-bottom-width: 1px;
                    padding: 0.5rem;
                    // width: 10%;
                    padding-left: 1rem;
                }
                td{
                    color: $black;
                    padding-top:0.5rem;
                    padding-bottom: 0.5rem;
                    padding-left: 1.2rem;
                    text-align: left;
                    font-weight: bold;
                }
                .count-blag{
                    padding: 2px 12px;
                    width: auto;
                    height: auto;
                    border-radius: 10px;
                    background-color: #D4DBE5;
                    color: $tab;
                    font-size: 12px;
                    margin-right: calc(20/1920*100vw);
                    float:right;
                }
                .icon-blag{
                    display: inline-block;
                    width: 80px;;
                    padding:3px 6px;
                    text-align: center;
                    color: #fff;
                    font-size: calc(12/1920*100vw);
                    font-weight: normal;
                }
            }
      }
      .row-footer {
        padding-top: calc(30 / 1920 * 100vw);
        border-top: 1px solid $border;
        padding-bottom: calc(30 / 1920 * 100vw);
        margin-top: calc(10 / 1920 * 100vw);
        .details-content {
          padding-right: calc(20 / 1920 * 100vw);
          &:last-child {
            padding-right: 0;
          }
        }
        .details {
          position: relative;
          height: 320px;
          border: 1px solid $border;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          .item-header {

            position: relative;
            background-color: $background;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid $border;
            padding-left: calc(20 / 1920 * 100vw);
            .icontemp {
              font-size: calc(18 / 1920 * 100vw);
              margin-right: calc(15 / 1920 * 100vw);
              color: $tab;
            }
            .title-lable {
              font-size: calc(14 / 1920 * 100vw);
              font-weight: bold;
            }
            .count-content {
              position: absolute;
              right: calc(20 / 1920 * 100vw);
              top: 0;
              .count {
                font-size: calc(30 / 1920 * 100vw);
              }
              .blag {
                font-size: calc(12 / 1920 * 100vw);
              }
            }
          }
          .item-content {
            padding-top: calc(20 / 1920 * 100vw);
            height: 280px;
            position: relative;
            .item-details {
              height: auto;
              font-size: calc(14 / 1920 * 100vw);
              padding-left: calc(30 / 1920 * 100vw);
              padding-right: calc(20 / 1920 * 100vw);
              margin-bottom: 30px;
              color: #4b5262;
              display: flex;
              .item-blag {
                width: calc(12 / 1920 * 100vw);
                height: calc(12 / 1920 * 100vw);
                border-radius: 50%;
                background-color: $tab;
                display: inline-block;
                margin-right: calc(16 / 1920 * 100vw);
                margin-top: 3px;
              }
              .item-name{
                flex: 1;
              }
              .item-des {
                display: block;
                font-size: calc(12 / 1920 * 100vw);
                margin-top: calc(10 / 1920 * 100vw);
                margin-left: calc(35 / 1920 * 100vw);
                color: $tab;
              }
              img {
                height: 100%;
                width: 100%;
              }
            }
            .moreInfotip{
              position: absolute;
              bottom:10px;
              right:10px;
              font-size: 12px;
              color:$tab;
            }
          }
          .item-img {
            padding-bottom: calc(20 / 1920 * 100vw);
          }
        }
      }
      .row-detail{
        margin-bottom: 50px !important;
        .item-header{
            position: relative;
            background-color: $background;
            height: 40px;
            line-height: 40px;
            border: 1px solid $border;
            padding-left: calc(20 / 1920 * 100vw);
            cursor: pointer;
          .icontemp {
              font-size: calc(14 / 1920 * 100vw);
              margin-right: calc(15 / 1920 * 100vw);
            }
          .title-lable {
            font-size: calc(14 / 1920 * 100vw);
            font-weight: bold;
          }
        }
        .item-content{
          padding-top: calc(20 / 1920 * 100vw);
          font-size: calc(14 / 1920 * 100vw);
          padding-left: calc(30 / 1920 * 100vw);
          padding-right: calc(30 / 1920 * 100vw);
          color: #4b5262;
          border: 1px solid $border;
          border-top:0;
          .content-title{
            border-left:4px solid #eb1d63;
            font-size: calc(14 / 1920 * 100vw);
            color:#7d8cad;
            padding-left:calc(20 / 1920 * 100vw);
            font-weight: bold;
          }
          .content-detail{
            margin-top: 10px;
            .content-detail-title{
              min-height:70px;
              background-color:$background;
              padding-left:calc(20 / 1920 * 100vw);
              padding-right: calc(20 / 1920 * 100vw);
              padding-top:10px;
              padding-bottom: 10px;
              display: flex;
              .ignore-btn{
                width:50px;
                height:24px;
                background-color: #434c5e;
                font-size: 12px;
                color:#ffffff;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 5px;
                margin-right: calc(25 / 1920 * 100vw);
              }
              .title-btn{
                width:100px;
                height:25px;
                background-color: #fcba3f;
                font-size:12px;
                color:#ffffff;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 20px;
              }
              .detail-title{
                flex: 1;
                .title1{
                font-size: calc(14 / 1920 * 100vw);
                color:#182752;
                font-weight: bold;
                margin:0 0 5px 0;
                }
                .title2{
                  font-size: calc(12 / 1920 * 100vw);
                  color:#7d8cad;
                  margin: 15px 0 0 10px;
                }
              }
            }
            .content-detail-main{
              padding-top: 10px;
              padding-left:calc(20 / 1920 * 100vw);
              padding-right: calc(20 / 1920 * 100vw);
              .cdm-title{
                font-size:calc(12 / 1920 * 100vw);
                color:#94a4b4;
                font-weight: bold;
                margin: 0;
              }
              .cdm-voice{
                margin-top: 10px;
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
              .cdm-pic{
                margin-top: 20px;
                overflow: hidden;
                .source-details{
                    display: inline-block;
                    .img-content{
                      margin-right: calc(10/1920*100vw);
                      margin-bottom: calc(10/1920*100vw);
                        position: relative;
                        cursor: pointer;
                        .start-icon{
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%,-50%);
                        }
                      .imgLittle{
                        min-width: 70px;
                      }
                    }
                  @media screen and (min-width: 1280px) and(max-width: 1366px){
                    width: 90px;
                    .img-content .imgLittle{
                      width: 85px;
                    }
                  }
                }
              }
              .cdm-word{
                margin-top: 10px;
                font-size: calc(14 / 1920 * 100vw);
                color:#4b5262;
              }
            }
          }
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
                /deep/ .el-radio__label{
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
                /deep/ .el-radio__label{
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
      /deep/ .el-dialog__footer{
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
    }
  }
</style>
<style>
  .echarts {
    width: 100%;
    height: 100%;
  }

  .el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
