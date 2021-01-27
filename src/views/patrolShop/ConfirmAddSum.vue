<template>
  <el-row class="sum-content">
    <el-col :span="24" class="sum-submit">
      <div class="submit-header">
        <span>{{ $t('remotePatrol.summary') }}</span>
        <el-button :size="varyWindowWidth > 1680 ? 'small' : 'mini'" class="sum-btn" type="primary" @click="submit">
          {{ $t('remotePatrol.submit') }}
        </el-button>
      </div>
      <div class="submit-content">
        <div class="submit-radio">
          <span v-for="(item,index) in resultList" :key="index">
            <span
              v-if="item.isShow"
              :class="item.isActive?'activeClass':''"
              class="el-radio-details"
              @click="clickSum(item,index)">{{ item.name }}</span>
          </span>
        </div>
        <span class="sug-label"><span>*</span>{{ $t('remotePatrol.inspectionAdvice') }}</span>
        <el-input
          :autosize="{ minRows: 2, maxRows: 7}"
          v-model="suggest"
          :placeholder="$t('remotePatrol.adviceInfo')"
          type="textarea"
          resize="none"
          class="sug-input"
          @input="adviceChanged"
          @blur="notShowInputRuleTips"/>
        <span v-if="adviceInfoRuletip" class="rules">{{ $t('remotePatrol.comentRuletip_suggest') }}</span>
      </div>
    </el-col>
    <el-col :span="24" class="sum-data">
      <el-row class="divider-content">
        <el-col :span="11">
          <hr class="divider-hr">
        </el-col>
        <el-col :span="2">
          <span class="divider-text">{{ $t('remotePatrol.preview') }}</span>
        </el-col>
        <el-col :span="11">
          <hr class="divider-hr">
        </el-col>
      </el-row>
      <div class="table-content">
        <div class="table-header">
          <div class="header-store-name">
            <span v-if="lang=='en' " class="en-store-name">{{ $t('remotePatrol.storeName') }}: </span>
            <span v-else class="store-name">{{ $t('remotePatrol.storeName') }}：</span>
            {{ store.storeName }}
          </div>
          <div class="header-score">
            <span class="span-1">{{ $t('remotePatrol.getscore') }}：</span>
            <span class="span-2">{{ scorecount }} <span>{{ $t('remotePatrol.scorecount') }}</span></span>
          </div>
        </div>
        <table v-for="(s_item,s_index) in summary" :key="s_index" class="table table-bordered">
          <thead>
            <tr>
              <th v-for="(t_item ,t_index) in s_item.tHeader" :key="t_index" :style="t_item.width" scope="col">
                {{ t_item.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="vertical-align:middle;">
              <td :rowspan="s_item.inspectList.length+1" style="vertical-align:middle;">
                <span class="sheet_title">{{ s_item.label }}</span>
              </td>
            </tr>
            <tr v-for="(item,index) in s_item.inspectList" :key="index" :style=" index%2 != 0?{'background-color':'#F7F8FC'}:{}">
              <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{ item.groupName }}</span><span class="count-blag">
                {{ item.items.length }}</span>
              </td>
              <td v-if="s_item.type==0||s_item.type==2"><span>{{ item.numOfQualified }}</span></td>
              <td v-if="s_item.type==0||s_item.type==2"><span>{{ item.numOfUnqualified }}</span></td>
              <td v-if="s_item.type==1"><span>{{ item.itemScore }}</span></td>
              <td><span>{{ item.numIgnore }}</span></td>
              <td v-if="s_item.type==1||s_item.type==2"><span>{{ item.itemgetScore }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <el-row v-for="(item,index) in tempList" :key="index" class="row-detail">
        <el-col v-if="item.itemList.length!=0">
          <div class="item-header">
            <i :class="item.iconSrc" class="iconfont icontemp"/>
            <span class="title-lable">{{ item.itemTitleName }}</span>
            <span style="float:right;" class="count-content"><span class="count">{{ item.itemCount }}</span>
            <span class="blag">{{ $t('remotePatrol.unit') }}</span></span>
          </div>
          <div class="item-content">
            <div style="margin-bottom:20px;">
              <div v-for="(_item,_index) in item.itemList" :key="_index" class="content-detail">
                <div v-if="index !== 2" class="content-detail-title">
                  <div class="detail-title">
                    <p class="title1">{{ _index+1 }}.{{ _item.subject }}</p>
                    <p class="title2">{{ _item.description }}</p>
                  </div>
                  <div v-if="item.detailType === 1" class="ignore-btn">{{ $t('remotePatrol.ignored') }}</div>
                  <div v-if="(_item.type === 0 ||_item.type === 2)&&item.detailType !== 1" class="title-btn">
                    {{ $t('remotePatrol.scoreUnit') }}<span>{{ $t('remotePatrol.failed') }}</span>
                  </div>
                  <div v-if="_item.type==1&&item.detailType!=1" class="title-btn">{{ $t('remotePatrol.scoreUnit') }}
                    <span>
                      <span>{{ _item.itemgetScore }}</span>
                      <span v-if="lang !== 'en'">{{ $t('remotePatrol.scorecount') }}</span>
                    </span>
                  </div>
                </div>
                <div v-if="index === 2" class="content-detail-title" style="background-color:#fff;min-height:30px;">
                  <div class="detail-title">
                    <p class="title1">{{ _index+1 }}.{{ _item.subject }}</p>
                  </div>
                </div>
                <div
                  v-if="index !== 2 && _item.sourceList!= null && _item.sourceList.length !== 0
                  || _item.inspectInput != null&&_item.inspectInput !== ''"
                  class="content-detail-main"
                  style="padding-bottom: 20px;">
                  <p class="cdm-title">{{ $t('remotePatrol.commentDetail') }}</p>
                  <div v-if="_item.inspectInput!=null&&_item.inspectInput!=''" class="cdm-word">
                    <span>{{ _item.inspectInput }}</span>
                  </div>
                  <div v-if="_item.sourceList!=null&&_item.sourceList.length!=0" class="cdm-pic">
                    <div
                      v-for="(sourceitem,sourceindex) in _item.sourceList"
                      :key="sourceindex"
                      :height="imgHeight+'px'"
                      class="source-details">
                      <div v-if="sourceitem.mediaType==2" class="img-content">
                        <img
                          :title="imgTitle"
                          :src="sourceitem.src"
                          :height="imgHeight+'px'"
                          :onerror="deafultImg"
                          class="imgLittle imgInner"
                          @click="openOuter(sourceitem,$event)">
                      </div>
                      <div v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,sourceindex)">
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                        <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="index==2&&_item.sourceList!=null||item.description!=null&&item.description!=''" class="content-detail-main">
                  <p class="cdm-title">{{ $t('remotePatrol.description') }}：</p>
                  <div v-if="_item.description!=null&&_item.description!=''" class="cdm-word">
                    <span>{{ _item.description }}</span>
                  </div>
                  <div v-if="_item.sourceList!=null&&_item.sourceList.length!=0" class="cdm-pic">
                    <div v-for="(sourceitem,index) in _item.sourceList" :key="index" :height="imgHeight+'px'" class="source-details">
                      <div v-if="sourceitem.mediaType==2" class="img-content">
                        <img
                          :title="imgTitle"
                          :src="sourceitem.src"
                          :height="imgHeight+'px'"
                          :onerror="deafultImg"
                          class="imgLittle imgInner"
                          @click="openOuter(sourceitem,$event)">
                      </div>
                      <div v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,index)">
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                        <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
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
    </el-col>
    <el-dialog :visible.sync="uploadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
      <div class="body-content">
        <p>{{ $t('remotePatrol.uploading') }}</p>
        <p v-if="lang!=='en'" style="margin-bottom:15px;">{{ $t('remotePatrol.upload0') }}<span>{{ totalnumOfPic }}</span>{{ $t('remotePatrol.upload1') }}<span>{{ uploadingnumOfPic }}</span>{{ $t('remotePatrol.unit') }}</p>
        <p v-if="lang==='en'" style="margin-bottom:15px;"><span>{{ totalnumOfPic }}  attachments in total,</span><span>{{ uploadingnumOfPic }} uploaded.</span></p>
        <el-progress :percentage="Math.round(uploadingnumOfPic/totalnumOfPic*100)"/>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import { getStorageInfo } from '@/api/event';
import { submitInspectItem1 } from '@/api/inspect';
import util from '@/common/util';
import { getCookie } from '@/common/auth';
import { getUserInfo } from '@/api/login';
import filterString from '@/common/filterString.js';

export default {
  name: 'ConfirmAddSum',
  data() {
    return {
      dialogCommentVideo: false,
      uploadProgress: false,
      totalnumOfPic: 0,
      uploadingnumOfPic: 0,
      showOuter: false,
      showImg: false,
      checkImgSrc: '',
      scorecount: 0,
      radioList: [],
      imgTitle: '',
      resultList: [
        {
          'label': 2,
          'name': this.$t('overview.echartGood'),
          'isActive': false,
          'isShow': true
        },
        {
          'label': 1,
          'name': this.$t('remotePatrol.improve'),
          'isActive': false,
          'isShow': true
        },
        {
          'label': 0,
          'name': this.$t('remotePatrol.dangerous'),
          'isActive': false,
          'isShow': true
        }
      ],
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
      ],
      suggest: '',
      store: {},
      channel: {},
      summary: [],
      tempList: [],
      inspectList: [],
      eventList: [],
      oss: null,
      bucketVideo: '',
      bucketImage: '',
      percentage: 0,
      accountId: '',
      curSumIndex: 0,
      varyWindowWidth: window.innerWidth,
      pass: this.$t('remotePatrol.pass'),
      fail: this.$t('remotePatrol.failed'),
      lang: this.$i18n.locale,
      adviceInfoRuletip: false
    };
  },
  computed: {
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
  beforeRouteLeave(to, from, next) {
    const self = this;
    if (to.name !== 'remotePatrol') {
      self.$store.dispatch('setPatrolHistory', null);
      self.$store.dispatch('setPatrolComment', null);
      next();
    } else {
      self.$store.dispatch('setPatrolComment', self.suggest);
      next();
    }
  },
  mounted() {
    const self = this;
    self.getRouteData();
    self.getUpLoadBucketInfo();
    self.getOssInfo();
  },
  methods: {
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
      console.log(item);
      console.log($ev.target.onerror);
      if (item != null) {
        self.showOuter = true;
        self.checkImgSrc = item.src;
        self.showImg = true;
      }
    },
    getFileUrl(fileName) {
      const self = this;
      const bucketName = self.oss.ossBucketName;
      const endpoint = self.oss.ossEndPoint;
      const key = fileName;
      if (self.oss.ossVendor === 2) {
        return `https://${endpoint}/${bucketName}/${fileName}`;
      } else {
        return `http://${bucketName}.${endpoint}/${fileName}`;
      }
    },
    upLoadFile(fileItem) {
      const self = this;
      self.percentage = 0;
      if (self.oss.ossVendor === null) {
        self.oss.ossVendor = 1; // 1 -aliyun  2-azure
      }
      if (self.oss.ossVendor === 1) {
        const OSS = require('ali-oss');
        const client = new OSS({
          region: self.oss.ossEndPoint.slice(0, self.oss.ossEndPoint.indexOf('.')),
          accessKeyId: self.oss.ossAccessKeyId, // 填入自己的id
          accessKeySecret: self.oss.ossAccessKeySecret, // 填入自己的id
          // bucket: 'viumo-'+self.accountId,
          bucket: self.oss.ossBucketName
        });
        const name = fileItem.fileName;
        return new Promise((resolve, reject) => {
          client.put(name, fileItem.file, {
            progress: function * (percentage, cpt) {
              self.percentage = percentage;
            }
          })
            .then((results) => {
              // 上传完成
              const url = self.getFileUrl(results.name);
              console.log(url);
              resolve(url);
            })
            .catch((err) => {
              reject(err);
              console.log(err);
            });
        });
      } else {
        const url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
        const containerURL = new azblob.ContainerURL(url, azblob.StorageURL.newPipeline(new azblob.AnonymousCredential()));
        const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, fileItem.fileName);
        return new Promise((resolve, reject) => {
          azblob.uploadBrowserDataToBlockBlob(azblob.Aborter.none, fileItem.file, blockBlobURL)
            .then((results) => {
              // 上传完成
              const url = self.getFileUrl(fileItem.fileName);
              console.log(url);
              resolve(url);
            })
            .catch((error) => {
              reject(error);
              console.log(error);
            });
        });
      }
    },
    clickSum(item, index) {
      const self = this;
      item.isActive = true;
      self.resultList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isActive = false;
        }
      });
      self.curSumIndex = item.label;
    },
    async submit() {
      const self = this;
      let upload = 0;
      const inspect = self.inspectList;
      const eventList = self.eventList;
      let status = 0;
      let flag = false;
      self.uploadingnumOfPic = 0;
      self.resultList.forEach(item => {
        if (item.isActive) {
          flag = true;
        }
      });
      if (!flag) {
        self.notify(self.$t('remotePatrol.summaryInfo'), 'warning', 3000);
        return false;
      }
      if (self.suggest.length == 0) {
        self.notify(self.$t('remotePatrol.suggestEmpty'), 'warning', 3000);
        return false;
      }
      self.totalnumOfPic > 0 ? self.uploadProgress = true : self.uploadProgress = false;
      const storageParams = {};
      storageParams.storeId = self.store.storeId;
      await getStorageInfo(storageParams).then(res => {
        if (res.errCode === 0) {
          self.oss = res.data;
          console.log(self.oss);
        }
      });
      const temp = [];
      for (const i in inspect) {
        for (const g in inspect[i].inspectList) {
          for (const j in inspect[i].inspectList[g].items) {
            const objItem = {};
            objItem.ts = new Date().getTime();
            objItem.description = inspect[i].inspectList[g].items[j].inspectInput.trim();
            if (inspect[i].type === 0 || inspect[i].type === 2) {
              objItem.grade = inspect[i].inspectList[g].items[j].isIgnore || inspect[i].inspectList[g].items[j].manualIgnore ? Math.pow(-2,31) : (inspect[i].inspectList[g].items[j].isQualified ? 1 : 0);
            } else {
              objItem.grade = inspect[i].inspectList[g].items[j].isIgnore || inspect[i].inspectList[g].items[j].manualIgnore ? Math.pow(-2,31) : inspect[i].inspectList[g].items[j].itemgetScore;
            }

            objItem.storeId = self.store.storeId;
            objItem.inspectItemId = inspect[i].inspectList[g].items[j].id;
            const tempFileUrl = [];
            if (!inspect[i].inspectList[g].items[j].isIgnore) {
              for (const k in inspect[i].inspectList[g].items[j].sourceList) {
                const obj = {};
                await self.upLoadFile(inspect[i].inspectList[g].items[j].sourceList[k]).then((url) => {
                  self.uploadingnumOfPic++;
                  if (inspect[i].inspectList[g].items[j].sourceList[k].mediaType === 2) {
                    obj.mediaType = 2;
                    obj.url = url;
                    obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                  } else if (inspect[i].inspectList[g].items[j].sourceList[k].mediaType === 1) {
                    obj.mediaType = 1;
                    obj.url = url;
                    obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                  }
                }).catch((err) => {
                  upload++;
                });
                if (upload !== 0) {
                  self.uploadProgress = false;
                  self.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
                  return false;
                }

                tempFileUrl.push(obj);
              }
            }
            objItem.attachment = tempFileUrl;
            temp.push(objItem);
          }
        }
      }
      const feedEventList = [];
      console.log(self.eventList);

      for (const i in self.eventList) {
        const obj = {};
        obj.ts = new Date().getTime();
        obj.storeId = self.store.storeId;

        obj.subject = self.eventList[i].eventName;
        obj.description = self.eventList[i].eventDes;

        const commentTemp = [];
        if (self.eventList[i].sourceObj != null) { // 通过通道创建的反馈问题
          await self.upLoadFile(self.eventList[i].sourceObj).then((url) => {
            self.uploadingnumOfPic++;
            const commentObj = {
              mediaType: self.eventList[i].sourceObj.mediaType,
              url: url,
              deviceId: self.eventList[i].sourceObj.deviceId
            };
            commentTemp.push(commentObj);
          }).catch((err) => {
            upload++;
          });
          if (upload !== 0) {
            self.uploadProgress = false;
            self.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
            return false;
          }

          obj.deviceId = self.eventList[i].sourceObj.deviceId;
        } else { // 通过加号创建的问题反馈
          // obj.diviceId=-1;
        }
        obj.attachment = commentTemp;
        feedEventList.push(obj);
      }
      let curSumIndex = [];
      curSumIndex = self.resultList.filter(x => x.isActive);
      status = curSumIndex[0].label;
      const params = {
        status: status,
        comment: self.suggest.trim(),
        items: temp,
        feedback: feedEventList
      };
      let routeData = null;
      upload === 0 && submitInspectItem1(params).then(res => {
        if (res.errCode === 0) {
          const data = res.data;
          self.editFlag = true;
          routeData = {
            isSuccess: true,
            user: data.notifiedTo
          };
        } else {
          routeData = {
            isSuccess: false,
            reLoadData: self.$route.params
          };
        }
        self.$router.push({ name: 'submitEvent', params: { data: routeData }});
      }).catch(err => {
        self.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
        return false;
      });
      self.uploadProgress = false;
    },
    
    getRouteData() {
      const self = this;
      const PatrolComment = self.$store.getters.PatrolComment;
      if (PatrolComment != null) {
        self.suggest = PatrolComment;
      }
      const routeData = self.$route.params.data;
      const inspectSettings = self.$route.params.rule;
      const inspect = routeData.inspect;
      const eventList = routeData.event;
      const store = routeData.store;
      self.store = store;
      self.inspectList = routeData.inspect;
      self.eventList = routeData.event;
      let tempList = [], feedBackTemp = [], ignoreTemp = [], UnqualifiedTemp = [], dealType = [];
      let PassFileXN = 0, PassFileTotalScore = 0, PassFileTotalScoreX = 0, PassFileXS = 0, PassFileTotalScoreSystem = 0;
      let ScoreX = 0,ScoreN = 0,ScoreXN = 0,ScoreTotalScoreX = 0, allScoreB = 0,ScoreTotalScoreSystem = 0;
      let otherGetscoreTotal = 0, OtherTotalScoreSystem = 0;
      inspect.forEach(p_item => {
        if (p_item.dealCount !== 0) {
          dealType.push(p_item.type);
        }
      });
      let Tab0Status = false;
      let inspectPic = 0;
      inspect.forEach(p_item => {
        let totalScore0 = 0, CurAddScoreB = 0, CurOtherTotalScore = 0, PassFileX = 0, PassFileTS = 0, ScoreTS = 0, OtherTS = 0, PassFileN = 0;
        let PassFile_totalScoreX = 0,Score_totalScoreX = 0;
        p_item.inspectList.forEach(item => {
          let QualifiedArr = [], UnqualifiedArr = [], IgnoredArr = [];
          let totalScore = 0, totalGetscore = 0, notAddIgnoretotalScore = 0;
          item.items.forEach(s_item => {
            if (s_item.isIgnore) {
              IgnoredArr.push(s_item);
              ignoreTemp.push(s_item);
            } else {
              if ((p_item.type === 0 || p_item.type === 2) && !s_item.isQualified) {
                UnqualifiedArr.push(s_item);
                UnqualifiedTemp.push(s_item);
              } else if ((p_item.type === 0 || p_item.type === 2) && s_item.isQualified) {
                QualifiedArr.push(s_item);
              } else if (p_item.type === 1 && (s_item.itemgetScore < s_item.qualifiedScore)) {
                UnqualifiedTemp.push(s_item);
              }
              if ((p_item.type === 1 || p_item.type === 2) && s_item.itemgetScore !== '--') {
                totalGetscore += s_item.itemgetScore;
              }
            }
            s_item.itemgetScore === '--' ? s_item.itemgetScore = 0 : null;
            if (p_item.type === 0) {
              PassFileTS += s_item.itemgetScore;
              totalScore0 += s_item.itemScore;
              if (!s_item.isIgnore&&!s_item.manualIgnore) {
                PassFileX += s_item.itemgetScore;
                PassFile_totalScoreX += s_item.itemScore;
              }else{
                PassFileN += s_item.itemScore;
              }
            } else if (p_item.type === 1) {
              totalScore += s_item.itemScore;
              ScoreTS += s_item.itemgetScore;
              if (!s_item.isIgnore&&!s_item.manualIgnore) {
                ScoreX += s_item.itemgetScore;
                Score_totalScoreX += s_item.itemScore;
                notAddIgnoretotalScore += s_item.itemScore;
              }else{
                ScoreN += s_item.itemScore;
              }
            } else if (p_item.type === 2 && !s_item.isIgnore) {
              OtherTS += s_item.itemgetScore;
            }
            inspectPic += s_item.sourceList.length;
          });
          item['numOfQualified'] = QualifiedArr.length;
          item['numOfUnqualified'] = UnqualifiedArr.length;
          item['numIgnore'] = IgnoredArr.length;
          if(inspectSettings.qualifiedForIgnoredWithType2){
            item['itemScore'] = totalScore;
          }else{
            item['itemScore'] = notAddIgnoretotalScore;
          }
          item['itemgetScore'] = parseFloat(totalGetscore.toFixed(1));
          if (p_item.type === 0) {
            PassFileTotalScoreSystem = PassFileTS;
            PassFileXS = PassFileX;
            PassFileXN = PassFileN + PassFileX;
            PassFileTotalScore = totalScore0;
            PassFileTotalScoreX = PassFile_totalScoreX;
          }
          if (p_item.type === 1) {
            CurAddScoreB += totalScore;
            allScoreB = CurAddScoreB;
            ScoreTotalScoreSystem = ScoreTS;
            ScoreXN = ScoreX + ScoreN;
            ScoreTotalScoreX = Score_totalScoreX;
          }
          if (p_item.type === 2) {
            CurOtherTotalScore += totalGetscore;
            otherGetscoreTotal = CurOtherTotalScore;
            OtherTotalScoreSystem = OtherTS;
          }
        });
        if (p_item.type === 0) {
          p_item['tHeader'] = self.theaderPassFail;
          if (p_item.inspectList.some(x => x.numOfUnqualified !== 0) && dealType.some(x => x === 0) && inspectSettings.dangerousOnFailedItem) {
            self.resultList[0].isShow = false;
            self.resultList[1].isShow = false;
            self.resultList[2].isActive = true;
            Tab0Status = true;
          }
        } else if (p_item.type === 1) {
          p_item['tHeader'] = self.theaderScore;
        } else if (p_item.type === 2) {
          p_item['tHeader'] = self.theaderOther;
        }
      });
      let s_count = 0;
      if (inspect.length === 1 && inspect[0].type === 0) {
        if (inspectSettings.hundredMarkType === '-1') {
          if(inspectSettings.qualifiedForIgnoredWithType1){
            s_count = PassFileXN;
          }else{
            s_count = PassFileTotalScoreSystem;
          }
        } else {
          if (inspectSettings.qualifiedForIgnoredWithType1) {
            s_count = PassFileTotalScore===0 ? 0 : PassFileXN / PassFileTotalScore * 100;
          } else {
            s_count = PassFileTotalScoreX===0 ? 0 : PassFileXS / PassFileTotalScoreX * 100;
          }
        }
      } else {
        if (inspectSettings.includedInTotalScoreWithType1) {
          if (inspectSettings.hundredMarkType === '-1') {
            if (inspectSettings.qualifiedForIgnoredWithType1 && !inspectSettings.qualifiedForIgnoredWithType2) {
              s_count = PassFileXN + ScoreTotalScoreSystem + OtherTotalScoreSystem;
            } else if (!inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
              s_count = PassFileTotalScoreSystem + ScoreXN + OtherTotalScoreSystem;
            } else if (inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
              s_count = PassFileXN + ScoreXN + OtherTotalScoreSystem;
            } else {
              s_count = PassFileTotalScoreSystem + ScoreTotalScoreSystem + OtherTotalScoreSystem;
            }
          } else {
            let total_a = 0,total_b = 0,total_c = 0;
            if (inspectSettings.qualifiedForIgnoredWithType1 && !inspectSettings.qualifiedForIgnoredWithType2) {
              total_a = PassFileXN + ScoreTotalScoreSystem;
              total_b = PassFileTotalScore + ScoreTotalScoreX;
            } else if (!inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
              total_a = PassFileXS + ScoreXN;
              total_b = PassFileTotalScoreX + allScoreB;
            } else if (inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
              total_a = PassFileXN + ScoreXN;
              total_b = PassFileTotalScore + allScoreB;
            } else {
              total_a = PassFileXS + ScoreTotalScoreSystem;
              total_b = PassFileTotalScoreX + ScoreTotalScoreX;
            }
            total_c = total_a===0 || total_b===0 ? 0 : (total_a / total_b * 100);
            s_count = total_c + otherGetscoreTotal;
          }
        } else {
          if (inspectSettings.hundredMarkType === '-1') {
            if (inspectSettings.qualifiedForIgnoredWithType2) {
              s_count = ScoreXN + OtherTotalScoreSystem;
            } else {
              s_count = ScoreTotalScoreSystem + OtherTotalScoreSystem;
            }
          } else {
            let total_a = 0;
            if (inspectSettings.qualifiedForIgnoredWithType2) {
              total_a = allScoreB===0 || ScoreXN===0 ? 0 : (ScoreXN / allScoreB * 100);
            } else {
              total_a = ScoreTotalScoreX===0 || ScoreTotalScoreSystem===0 ? 0 : (ScoreTotalScoreSystem / ScoreTotalScoreX * 100);
            }
            s_count = total_a + otherGetscoreTotal;
          }
        }
      }
      if (!Tab0Status && dealType.length !== 1 && inspect[0].type === 0 || inspect[0].type !== 0) {
        self.resultList.forEach(item => {
          item.isShow = true;
          item.isActive = false;
        });
      }
      self.scorecount = s_count > inspectSettings.maxScore ? inspectSettings.maxScore : (s_count < inspectSettings.minScore ? inspectSettings.minScore : parseFloat(s_count.toFixed(1)));
      self.summary = inspect;
      eventList.forEach((item, index) => {
        const objFeedBack = {};
        objFeedBack.subject = item.eventName;
        objFeedBack.description = item.eventDes;
        objFeedBack.sourceList = [];
        item.sourceObj != null ? objFeedBack.sourceList.push(item.sourceObj) : '';
        feedBackTemp.push(objFeedBack);
      });
      const eventpic = eventList.filter(x => x.sourceObj != null);
      self.totalnumOfPic = Number(inspectPic) + Number(eventpic.length);
      tempList[0] = {
        itemTitleName: self.$t('remotePatrol.notableItem'),
        iconSrc: 'icon-zhongxindingwei',
        itemCount: UnqualifiedTemp.length,
        itemList: UnqualifiedTemp,
        detailType: 0
      };
      tempList[1] = {
        itemTitleName: self.$t('remotePatrol.ignoreds'),
        iconSrc: 'icon-hulve',
        itemCount: ignoreTemp.length,
        itemList: ignoreTemp,
        detailType: 1
      };
      tempList[2] = {
        itemTitleName: self.$t('remotePatrol.feedbacks'),
        iconSrc: 'icon-fankui',
        itemCount: feedBackTemp.length,
        itemList: feedBackTemp,
        detailType: 2
      };
      self.tempList = tempList;
    },
    getAccountId() {
      const self = this;
      const userId = getCookie('UserId');
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          console.log(res);
          res.data.forEach(item => {
            if (item.userId === userId) {
              const accountId = item.accountId.toLowerCase();
              self.accountId = accountId;
              localStorage.setItem('oss_bucket', accountId);
              resolve(accountId);
            }
          });
        });
      });
    },
    async getOssInfo() {
      const self = this;
      const accountId = await self.getAccountId();
      console.log(accountId);
      self.accountId = localStorage.getItem('oss_bucket');
      // getStorageInfo().then(res=>{
      //     console.log(res);
      //     if(res.errCode==0){
      //         self.oss=res.data;
      //     }
      // })
    },
    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
    },
    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },
    notShowInputRuleTips() {
      this.adviceInfoRuletip = false;
    },
    adviceChanged(val) {
      const self = this;
      const content = filterString.all(val, 600);
      const length = filterString.getContentLength(val);
      console.log(content);
      self.suggest = content;
      if (length > 600) {
        this.adviceInfoRuletip = true;
      } else {
        this.adviceInfoRuletip = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
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
.activeClass{
    background-color: #FDE8EF !important;
    color: $red;
    border-color: $red !important;
}
.sum-content{
    color: $black;
    .sum-submit{
        margin-bottom: 30px;
        text-align: left;
        padding-left: calc(30/1920*100vw);
        padding-right: calc(40/1920*100vw);
        border: 1px solid $border;
        padding-bottom: 30px;
        background-color: #fff;
        .submit-header{
            text-align: left;
            height: 60px;
            line-height: 60px;
            overflow: hidden;
            span{
                font-size: calc(20/1920*100vw);
                font-weight: bold;
                float: left;
            }
            .sum-btn{
                float: right;
                margin-top: 18px;
                height: calc(36/1920*100vw);
                width: calc(130/1920*100vw);
                line-height: calc(36/1920*100vw);
                font-size: calc(14/1920*100vw);
                padding: 0 0;
                outline: none;
                border-radius: 4px;
            }
        }
        .submit-content{
            padding-left: calc(10/1920*100vw);
            .submit-radio{
                text-align: left;
                margin-bottom: calc(20/1920*100vw);
                .el-radio-details{
                    display: inline-block;
                    border: 1px solid #ddd;
                    padding:6px;
                    font-size: 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    @include point(width,90);
                    @include point(padding,6);
                    text-align: center;
                    margin-right: calc(20/1920*100vw);
                }

            }
            .sug-label{
                font-size: calc(12/1920*100vw);
                display: block;
                margin-bottom: 10px;
                span{
                    color: $red;
                }
            }
            .rules{
                font-size: 10px;
                color:#ff2400;
                font-weight: 400;
                line-height: 12px;
            }
            .sug-input{
              width: 99.5%;
            }
        }

    }
    .sum-data{
        padding: calc(40/1920*100vw);
        border: 1px solid $border;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        min-height: calc(500/1920*100vw);
        .divider-content{
            height: 40px;
            line-height: 40px;
            display: flex;
            align-items: center;
            .divider-hr{
                border: 0.5px solid $border;
            }
            span{
                font-size: calc(18/1920*100vw);
                font-weight: bold;
                color: $tab;
            }
        }
        .table-content{
            .table-header{
                padding-bottom: 20px;
                font-weight: bold;
                .header-store-name{
                    float: left;
                    font-size: calc(16/1920*100vw);
                    color: $tab;
                    .store-name{
                        color: $black;
                    }
                    .en-store-name{
                        margin-right: 20px;
                        color: $black;
                    }
                }
                .header-score{
                    float: right;
                    .span-1{
                        font-size: calc(16/1920*100vw);
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
            }
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
        .row-detail{
            margin-top: 20px;
            text-align: left;
            .item-header{
                position: relative;
                background-color: $background;
                height: 40px;
                line-height: 40px;
                border: 1px solid $border;
                padding:0 calc(20 / 1920 * 100vw);
                cursor: pointer;
                    .icontemp {
                        font-size: calc(14 / 1920 * 100vw);
                        margin-right: calc(15 / 1920 * 100vw);
                        }
                    .title-lable {
                        font-size: calc(14 / 1920 * 100vw);
                        font-weight: bold;
                    }
                    .count-content{
                        position:absolute;
                        right: calc(20/1920*100vw);
                        top: 0;
                        .count{
                            font-size: calc(30/1920*100vw);
                        }
                        .blag{
                            font-size: calc(12/1920*100vw);
                        }
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
                            width: calc(130/1920*100vw);
                        }
                        }
                    @media screen and (min-width: 1280px) and(max-width: 1366px){
                        width: 90px;
                        .img-content .imgLittle{
                            width: 85px;
                            width: calc(130/1920*100vw);
                        }
                    }
                    }
                }
                .cdm-word{
                    margin-top: 10px;
                    font-size: calc(14 / 1920 * 100vw);
                    color:#4b5262;
                    word-wrap:break-word;
                }
                }
            }
            }
        }
        .row-footer{
            padding-top: 20px;
            padding-bottom: 10px;
            margin-top: 10px;
            .details-content{
                padding-right: calc(30/1920*100vw);
                &:last-child{
                    padding-right:0;
                }
            }
            .details{
                position: relative;
                height: 320px;
                border:1px solid $border;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .item-header{
                    position: relative;
                    background-color: $background;
                    height: 40px;
                    line-height: 40px;
                    border-bottom: 1px solid $border;
                    padding-left: calc(20/1920*100vw);
                    text-align: left;
                    .icontemp{
                        font-size: calc(18/1920*100vw);
                        margin-right: calc(15/1920*100vw);
                        color: $tab;
                    }
                    .title-lable{
                        font-size: calc(14/1920*100vw);
                        font-weight: bold;
                    }
                    .count-content{
                        position:absolute;
                        right: calc(20/1920*100vw);
                        top: 0;
                        .count{
                            font-size: calc(30/1920*100vw);
                        }
                        .blag{
                            font-size: calc(12/1920*100vw);
                        }
                    }
                }
                .item-content{
                    padding-top: 20px;
                    height:  280px;
                    .item-details{
                        height: auto;
                        font-size: calc(14/1920*100vw);
                        padding-left: calc(30/1920*100vw);
                        padding-right: calc(20/1920*100vw);
                        margin-bottom: 30px;
                        color: #4b5262;
                        text-align: left;
                        .item-blag{
                            width: calc(12/1920*100vw);
                            height: calc(12/1920*100vw);
                            border-radius: 50%;
                            background-color: $tab;
                            display: inline-block;
                            margin-right: calc(16/1920*100vw);
                        }
                        .item-des{
                            display: block;
                            font-size: calc(12/1920*100vw);
                            margin-top: calc(10/1920*100vw);
                            margin-left: calc(35/1920*100vw);
                            color: $tab;
                        }
                    }
                }
            }
        }
    }
}

</style>
<style>
.AddSumupLoad .el-dialog__header{
        display: none !important;
    }
  .el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-textarea__inner{
        font-family: Roboto,Arial, 'Microsoft YaHei';
    }
</style>
