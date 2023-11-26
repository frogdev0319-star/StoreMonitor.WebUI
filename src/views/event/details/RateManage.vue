<template>
  <el-row class="el-rate-container">
    <el-col :span="12" :style="{'height':windowHeight*0.82+'px','overflow-y': 'auto'}" class="lside">
      <div class="title-content">
        <img  :src="sourceSrc"  :class="(event.sourceType!=2)?'title-img':'title-img-inside'" >
        <el-tooltip effect="light" placement="bottom">
          <div slot="content">{{ event.eventTitle }}</div>
          <div class="event-title">{{ event.eventTitle }}</div>
        </el-tooltip>
        <span
            v-if="event.status === 0"
            class="event-status"
            style="background-color:#fff2ef;color:#f57848;"
            >
            {{ $t('eventView.pending') }}
          </span>
          <span
            v-else-if="event.status === 1"
            class="event-status"
            style="background-color:#edf6e8;color:#59ab22;" >
            {{ $t('eventView.handled') }}
          </span>
          <div
            v-else-if="event.status === 2 || event.status === 4"
            class="event-status"
            style="background-color:#efefef;color:#6e6e6e;" >
            {{ $t('eventView.closed') }}
          </div>
          <span
            v-else-if="event.status === 3"
            class="event-status"
            style="background-color:#ffeff5;color:#e22472;" >
            {{ $t('eventView.returnStatus') }}
          </span>
      </div>
      <el-dialog
        v-if="dialogFormVisible"
        :title="$t('eventView.view')"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="true"
        width="850px"
        height="834px"
        top="12%"
        class="rate-video-dialog"
        @close="closeRealTime">
        <div slot="title" class="dialog-title">{{$t('eventView.view')}}</div>
        <div
          class="video-dialog-content"
          style="overflow:hidden;"
          @mousemove="showControlInfo=true"
          @mouseleave="showControlInfo = false">
          <hr class="dialog-hr">
          <component
            :is="currentVideoComponent"
            ref="vendorVideo"
            :channel-info="channelInfo"
            :is-event="isEvent"
            :store-id="event.storeId"
            :video-authority="videoAuthority">
          </component>
        </div>
      </el-dialog>
      <el-dialog
        v-if="dialogCommentVideo"
        :title="$t('eventView.view')"
        :visible.sync="dialogCommentVideo"
        :close-on-click-modal="false"
        width="850px"
        height="834px"
        top="12%"
        class="rate-video-dialog"
        @close="stopCommentVideo">
        <div slot="title" class="dialog-title">{{$t('eventView.view')}}</div>
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
        v-if="dialogAttachVideo"
        :title="$t('eventView.view')"
        :visible.sync="dialogAttachVideo"
        :close-on-click-modal="false"
        width="850px"
        height="834px"
        top="12%"
        class="rate-video-dialog"
        @close="stopCommentVideo">
        <div slot="title" class="dialog-title">{{$t('eventView.view')}}</div>
        <div class="video-dialog-content" style="overflow:hidden;">
          <hr class="dialog-hr">
          <div class="video-content" >
            <video
              id="previewAttVideo"
              height="83%"
              width="90%"
              prload
              controls
              autoplay
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
        height="834px"
        top="18%"
        class="rate-video-dialog"
        @close="showRelatedChannelFlag = false">
        <div class="video-dialog-content" style="overflow:hidden;">
          <div slot="title" class="dialog-title">{{$t('eventView.view')}}</div>
          <hr class="dialog-hr">
          <div class="channel-content" >
            <el-radio-group v-model="channelRadio" class="radio-group">
              <el-radio v-for="(item, index) in relatedChannels" :label="item.id" :key="index" class="radio-class" @click="showRelatedChannel">
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
      <div class="storeInfo-content">
        <div class="storeInfo-details">
          <dd><span :class="lang.indexOf('zh') === -1 ? 'en-w4': 'w4'">{{ $t('eventView.storeName') }}：</span></dd>
          <span class="details-info">{{ event.storeName }}</span>
        </div>
        <div class="storeInfo-details">
          <div :class="lang.indexOf('zh') === -1 ? 'en-w3-content' : 'w3-content'">
            <dd><span :class="lang.indexOf('zh') === -1 ? 'en-w3': 'w3'">{{ $t('eventView.submitter') }}：</span></dd>
            <span class="details-info">{{ event.createor }}</span>
            <!--<el-tooltip
              :popper-class="tooltipClass"
              :content="event.createor"
              effect="dark"
              placement="bottom-start">
              <span class="details-info">{{ event.createor }}</span>
            </el-tooltip>-->
          </div>
        </div>
        <div class="storeInfo-details">
          <div :class="lang.indexOf('zh') === -1 ? 'en-w3-content' : 'w3-content'">
            <dd><span :class="lang.indexOf('zh') === -1 ? 'en-w4' : 'w4'">{{ $t('eventView.submitTime') }}：</span></dd>
            <span class="details-info">{{ event.createDate }}</span>
          </div>
          <!--<div
            v-if="event.sourceType === 1 && relatedChannels.length > 0"
            :class="lang.indexOf('zh') === -1 ? 'en-w3-content' : 'w3-content'">
            <dd :class="lang.indexOf('zh') === -1 ? 'en-w3' : 'w3'" >
              <div
                :class="lang.indexOf('zh') === -1 ? 'en-related-channel' : 'related-channel'"
                @click="showRelatedChannel">
                <img :src="cameraImg" class="img-class">
                <span class="related-span">{{ $t('eventView.associatedChannel') }}</span>
              </div>
            </dd>
          </div>-->
        </div>
      </div>
      <div class="eventInfo-content">
        <strong v-if="lang.indexOf('zh') === -1" style="margin-right: 28px">{{ $t('eventView.eventDetails') }}:</strong>
        <strong v-else>{{ $t('eventView.eventDetails') }}：</strong>
        <div class="content">
            <audio-vue
              v-if="showAudio"
              :audio-list="audioList"/>
          <description-text
            v-if="descriptionList.length > 0"
            :discription-list = "descriptionList"
            class="description"/>
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
              <div v-if="item.deviceId!=-1" class="imgLittle"  @click="showRelatedChannel">
                <img :src="cameraImg" style="width:14px;height:14px;" />
                <span style="color:#2c90d9;font-family: Roboto;font-size: 12px;margin-left:4px;">{{item.name}}</span>
              </div>
            </div>
            <div v-for="(item,index) in imgsourceList" :key="'img-' + index" class="source-content">
              <div v-if="item.mediaType===2" class="img-content">
                <!--image-->
                <el-image
                  :src="item.url"
                  :style="{height: imgHeight+'px', width: 'auto'}"
                  :preview-src-list="getImgList(index, imgsourceList)"
                  class="imgLittle imgInner"/>
              </div>
              <div v-if="item.deviceId!=-1" class="imgLittle" @click="showRelatedChannel">
                <img :src="cameraImg" style="width:14px;height:14px;" />
                <span style="color:#2c90d9;font-family: Roboto;font-size: 12px;margin-left:4px;">{{item.name}}</span>
              </div>
            </div>
          </div>
          <div class="process-detail">
            <div style="font-family: NotoSansCJKTC;font-size: 13px;font-weight: 500;color: #556679;">{{$t('eventView.details')}}</div>
            <div v-for="(item,index) in commentList" :key="index" class="deal-details">
              <div class="creator-area">
                <div style="display:flex;flex-direction:row;align-item:center;">
                  <div class="account-area" >{{item.accountTitle}}</div>
                  <div class="account-area" style="margin-left:3px">{{item.createOr}}</div>
                  <div class="account-area" style="margin-left:3px">{{'('+item.createDate+')'}}</div>
                </div>
                <div class="process-area" :style="item.spanStyle">{{item.process}}</div>
              </div>
              <div class="comment-area" >
                <audio-vue
                  v-if="item.showAudio"
                  :audio-list="item.audioList"
                  :if-show-margin="false"
                  class="deal-speech"/>
                <description-text
                  v-if="item.descriptionList.length > 0"
                  :discription-list = "item.descriptionList"
                  class="description"/>
                <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="source-content">
                <div
                  v-for="(_item,_index) in item.sourceList"
                  :key="_index"
                  :height="imgHeight+'px'"
                  class="source-details">
                  <div v-if="_item.mediaType === 2" class="img-content">
                    <el-image
                      :src="_item.url"
                      :style="{height: imgHeight+'px',width: 'calc(100/1920*100vw)'}"
                      :preview-src-list="getImgList(_index, item.sourceList)"
                      class="imgLittle imgInner"/>
                  </div>
                  <div v-else class="img-content " @click="playCommentVideo(_item,_index)">
                    <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                    <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                  </div>
                </div>
              </div>
              </div>
            </div>

          </div>
          <!--<div v-if="event.sourceType !== 1" class="viedo-info">
            <div v-if="showCheckVideo" @click="checkVideo">
              <i class="iconfont icon-bofang icon-video"/>
              <span class="ahref">{{ curChannel.name+'区域' }}</span>
            </div>
          </div>-->
        </div>
      </div>

    </el-col>
    <el-col :span="12" class="rside" :style="{'height':windowHeight*0.82+'px','background-color':'#edf0f2'}">
      <div class="title">
        <div id="rside-title" class="title-content">
          <span>{{ $t('eventView.events') }}</span>
          <delay-button
            v-if="showWinpBtn"
            type="primary"
            size="mini"
            class="btn-submit"
            @click="submit"
          >
            {{ $t('eventView.submit') }}
        </delay-button>
        </div>
        <div class="line"></div>
        <div class="btn-content"> 
          <div v-for="(item,index) in subBtnList" :key="index" class="btn_List">
            <div
              v-if="item.isShow"
              :class="{'activeClass': item.isActive, 'ja-span': lang.indexOf('ja') !== -1}"
              @click="clickSubBtn(item,index)">
              {{ item.name }}
            </div>
          </div>
          <div class="btn_List" v-if="needUpdateEvent">
            <div class="reopen" @click="showUpdateEvent = true" >
              返回處理 
            </div>
          </div>
        

        </div>
      </div>

      <div class="submit-content" :class="{ 'hidden_div' : (event.status === 2 || event.status === 4)}">
        <el-scrollbar class="submit-content-scroll">
        <div>
          <span style="display:block;"><span style="color:red;">* </span>{{ $t('eventView.addDetails') }}</span>
          <div class="description" v-for="(des, idx) in addDescriptionList" :key="idx">
              <!-- <img :src="delDesImg" style="widht:16px;height:16px;align-self:start;margin-top:10px;" :key="'img_'+idx" @click="onDeleteDescription(idx)" /> -->
              <div class="edit-description">
                <div class="edit-input">

                  <el-input
                    class="edit-event-input"
                    v-model="addDescriptionList[idx]"
                    type="textarea"
                    resize="none"
                    :readonly="!isEdit"
                    @input="(val)=>editDesChang(val,idx)"
                  />

                  <span v-if="editDesRuletip[idx]" class="rules">{{ $t('eventView.RateRuletip') }}</span>
                </div>
                <div class="edit-icon-div" >
                  <img :src="editDesImg" style="width:20px;height:20px;align-self:center;cursor:pointer;" @click="onEditDescription"/>
                </div>
              </div>
              <!-- 刪除 -->
                <img
                  :key="'img_'+idx"
                  :src="deleteInspectIcon_new"
                  alt="delete"
                  class="to_delete"
                  @click="onDeleteDescription(idx)"
                />
          </div>
          <div v-if="curDeslistNum<5" class="des-input">
            <div style="min-height:36px;height:auto;">
            <el-input
              :autosize="{ minRows: 2}"
              v-model="eventDes"
              :placeholder="$t('eventView.describe')"
              size="mini"
              type="textarea"
              resize="none"
              class="input-area"
              :disabled="curStatus==2 || curStatus==4 || curDeslistNum>=5"
              @input="(val)=>ivsIdChange(val)"
              @blur="notShowInputRuleTips"/>
              <span v-if="ivsIdRuletip" class="rules">{{ $t('eventView.RateRuletip') }}</span>
            </div>
            <div  class="btn-content">
              <div class="btn-des-confirm" @click="comfirmAddDes">{{ $t('remotePatrol.confirm') }}</div>
            </div>
          </div>
          <div style="margin-top:24px;margin-left:16px;margin-bottom:15px">{{ $t('eventView.addAttchement') }}</div>
          <div class="attach-area">
            <div v-for="(imgItem,index) in attachFileList" :key="'img'+index" class="source-details" >
              <!--video-->
                <div v-if="imgItem.type===1" class="img-content">
                  <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                  <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon" @click="playAttachVideo(imgItem,index)">
                  <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                </div>
              <div v-else-if="imgItem.type===2" class="img-content">
                <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                <el-image
                  :src="imgItem.src"
                  class="imgLittle"
                  :preview-src-list="getAuditImgList(index)"/>
              </div>
            </div>
            <div v-if="attFileCount<10" class="attach-add" @click="$refs.auditfile.click()">
              <input type="file" style="display: none" accept="image/png,image/jpeg,video/mp4" max-size="2" @change="doAddAttachment" ref="auditfile" />
              <div style="height:16px;display: flex;flex-direction: row;align-items: center;">
                <img :src="addAttIcon" widht="16px" height="16px" style="border-radius:10px;"/>
                <div class="att-txt">{{ $t('audit.inceptionRpt.attachment') }}</div>
              </div>
            </div>
          </div>
        </div>
        </el-scrollbar>
      </div>

      <dialog-pop
        title="修改已結案事件"
        :append-to-body="true"
        :close-on-click-modal="false"
        :show-close="false"
        :visible="showUpdateEvent"
        :isWarning="true"
        @cancelHandler="cancelUpdate()"
        @confirmHandler="confirmUpdate()"
      >
        <div class="dialog-slot">
          <div class="dialog-content">請確認是否變更狀態為 <span style="color: red;"> <b>未處理</b></span>   ? </div>
        </div>
      </dialog-pop>


      <el-dialog :visible.sync="uploadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
        <div class="body-content">
          <p>{{ $t('remotePatrol.uploading') }}</p>
          <p style="margin-bottom:15px;">
            {{ $t('remotePatrol.uploadInfo', {totalNum: totalnumOfPic, uploadedNum: uploadingnumOfPic}) }}
          </p>
          <el-progress :percentage="Math.round(uploadingnumOfPic/totalnumOfPic*100)"/>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import util from '@/common/util';
import videojs from '../../../../static/video.js';
import 'videojs-contrib-hls';
import { eventRESTful } from '@/api/index';
import { getDetailedStoreInfo } from '@/api/store';
import { getStorageInfo } from '@/api/event';
import PermissionHelper from '@/api/PermissionHelper';
import {handleEventStatus} from '@/api/reportAndEvent';
import filterString from '@/common/filterString';
import { mapGetters } from 'vuex';
import DelayButton from '@/components/DelayButton';
import DescriptionText from "../../../components/DescriptionText";
import DialogPop from '@/components/DialogPop';

export default {
  name: 'EventDetail',
  components: {
    DescriptionText,
    DelayButton,
    DialogPop,
    AudioVue: () => import('@/components/AudioVue.vue'),
    SkywatchVideo: () => import('@/components/SkywatchVideo.vue'),
    DashVideo: () => import('@/components/DashVideo.vue'),
    EzvizVideo: () => import('@/components/EzvizVideo.vue'),
    BeseyeVideo: () => import('@/components/BeseyeVideo.vue')
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
      showCheckVideo: false,
      showPhotoContent: false,
      deafultImg: 'this.src="' + require('../../../../static/img/picture_failed.png') + '"',
      eventDes: '',
      videoSrc: require('../../../../static/img/monitor.png'),
      inspectSrc: require('../../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../../static/img/onsite_patrol.png'),
      startIcon: require('../../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../../static/img/video_thumbnail.png'),
      cameraImg: require('../../../../static/img/icon_camera.svg'),
      curStatus: null,
      showControlInfo: true,
      lang: this.$i18n.locale,
      isEvent: true,
      channelInfo: {},
      subBtnList: [],
      tooltipClass: 'event-tooltip-class',
      showRelatedChannelFlag: false,
      relatedChannels: [],
      channelRadio: '',
      ivsIdRuletip: false,
      videosourceList: [],
      imgsourceList: [],
      Changestatus: '',
      vendor: 1,
      currentVideoComponent: 'EzvizVideo',
      audioList: [],
      descriptionList: [],
      addDescriptionList:[],
      curDeslistNum:0,
      delDesImg: require('../../../../static/img/del_description.svg'),
      editDesImg: require('../../../../static/img/event-pen.svg'),
      isEdit:false,
      editDesRuletip:[false,false,false,false,false],
      attFileCount:0,
      videoAttFileCount:0,
      addAttIcon: require('../../../../static/img/icon_attachment.svg'),
      deleteInspectIcon_new: require('../../../../static/img/table-delete.png'),
      attachFileList:[],
      bucketVideo: '',
      bucketImage: '',
      uploadProgress:false,
      totalnumOfPic:0,
      uploadingnumOfPic:0,
      dialogAttachVideo:false,
      oss: null,
      showUpdateEvent: false,
      curId: '',
      needUpdateEvent: false,
    };
  },
  watch:{
    vendor(){
      this.currentVideoComponent = ['DashVideo', 'EzvizVideo', 'BeseyeVideo', 'SkywatchVideo'][this.vendor];
    },
    attachFileList(){
      this.attFileCount = this.attachFileList.length;
      this.videoAttFileCount = this.attachFileList.filter(item=>item.type==1).length;
    }
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
    ...mapGetters({
      videoAuthority: 'videoAuthority'
    })
  },

  mounted() {
    const self = this;
    self.getUpLoadBucketInfo();
    self.getBtnList();
    self.getSessionData();
    self.getCommentList(0);

    this.needUpdateEvent =  sessionStorage.getItem('needUpdateEvent')
  },

  methods: {
    cancelUpdate(){
      this.showUpdateEvent = false
    },
    confirmUpdate(){
      console.log('this.curId', this.curId)
      var rowID = {eventId: this.curId}
      this.showUpdateEvent = false
      handleEventStatus(rowID).then(res=>{
        this.$router.push({ name: 'closeEvents'});
      }).catch(err => {
        this.isLoading = false;
      })
    },



    ivsIdChange(val) {
      const self = this;
      const comment = filterString.all(val, 1000);
      self.eventDes = comment;
      const length = filterString.getContentLength(val);
      if (length > 1000) {
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

    playAttachVideo(item, index) {
      const self = this;
      self.dialogAttachVideo = true;
      self.$nextTick(function() {
        var video = document.getElementById('previewAttVideo');
        video.setAttribute("src",item.url);
      });
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
      return arr.filter(source => source.mediaType === 2).map(source => source.url);
    },

    closeRealTime() {
      this.$refs.vendorVideo.stopVideoPlay();
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
      const params = {};
      params.storeId = this.event.storeId;
      params.deviceOnlyoptional = 1;
      return new Promise((resolve, reject) => {
        getDetailedStoreInfo(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            this.licenseStatus = res.data.status;
            resolve(res.data.device);
          }
        });
      });
    },

    async getSessionData() {
      const self = this;
      const event = JSON.parse(sessionStorage.getItem('event'));
      self.curStatus = event.status;
      self.curId = event.id;

      const obj = {
        id: event.id,
        eventTitle: event.subject,
        storeName: event.storeName,
        createor: event.assignerName,
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
      self.audioList = [];
      self.descriptionList = [];
      attachment.forEach(item => {
        if (item.mediaType === 0) {
          const audioObj = {};
          self.audioSrc = item.url;
          self.showAudio = true;
          audioObj.audioSrc = item.url;
          audioObj.isPlaying = false;
          audioObj.audioOftenText = '';
          audioObj.hasNotPlayAudio = true;
          self.audioList.push(audioObj);
        } else if (item.mediaType === 3 && item.url!='N/A') {
          self.descriptionList.push({ description: item.url });
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
      //console.log("sourceList:",self.sourceList);
      //console.log("event:",event);
      //console.log("deviceList:",deviceList);
      self.videosourceList = temp.filter(x => x.mediaType === 1);
      self.imgsourceList = temp.filter(x => x.mediaType === 2);
      if(event.relatedDeviceIds.length > 0){
        const relatedDeviceIds = event.relatedDeviceIds.sort();
        self.relatedChannels = [];

        relatedDeviceIds.forEach(item => {
          deviceList.forEach(_item => {
            if (_item.id === item) {
              self.relatedChannels.push(_item);
            }
          });
        });
      }else{
        self.sourceList.forEach(item => {
          deviceList.forEach(_item => {
            if (_item.id === item.deviceId) {
              self.relatedChannels.push(_item);
            }
          });
        });
      }
    },

    checkVideo(item, index) {
      const self = this;
      if (!util.validateLicense(this.licenseStatus)) {
        return;
      }
      self.dialogFormVisible = true;
      this.$nextTick(() => {
        self.channelInfo = self.curChannel;
        self.vendor = self.channelInfo.vendor;
        if (index != undefined) {
          self.curChannel = item;
        }
        self.playVendorVideo();
      })
    },

    getCommentList(e) {
      console.log("getCommentList");
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
          self.curStatus = self.event.status;
          if(comments.hasOwnProperty('status')){
            self.event.status = comments.status;
            self.curStatus = comments.status;
          }
          //console.log("dataComments[0].status:",dataComments[0].status);
          // 0 pending：handle、add、closed
          // 1 handled：add、closed、reject
          // 2 closed：
          // 3 reject：handle、add、closed
          // 4
          self.subBtnList.forEach(item => {
            console.log("item:",item);
            if (self.curStatus === 0 || self.curStatus === 3) {
              //if (item.order === 0 && !!PermissionHelper.enableEventHandle()) item.isShow = true;
              //else if(item.order === 1 && !!PermissionHelper.enableEventAdd())  item.isShow = true;
              //else if(item.order === 2 && !!PermissionHelper.enableEventClose()) item.isShow = true;
              //else item.isShow = false;
              item.order === 0 || item.order === 1 || item.order === 2 ? item.isShow = true : item.isShow = false;
              item.order === 0 ? item.isActive = true : item.isActive = false;
            }
            if (self.curStatus === 1) {

              //if(item.order === 1 && !!PermissionHelper.enableEventAdd())  item.isShow = true;
              //else if(item.order === 2 && !!PermissionHelper.enableEventClose()) item.isShow = true;
              //else if (item.order === 3 && !!PermissionHelper.enableEventReturn()) item.isShow = true;
              //else item.isShow = false;
              item.order === 1 || item.order === 2 || item.order === 3 ? item.isShow = true : item.isShow = false;
              item.order === 1 ? item.isActive = true : item.isActive = false;
            }
            if (self.curStatus === 2 || self.curStatus === 4) {
              item.isShow = false;
            }
          });
          dataComments.forEach((item, index) => {
            const obj = {};
            obj.accountTitle = (typeof item.accountTitle=='undefined'||item.accountTitle==null)?'':item.accountTitle;
            obj.createOr = item.accountName;
            obj.createDate = util.getDateTime(item.ts);
            obj.status = item.status;
            obj.description = item.description;
            switch (item.status) {
              case 0: obj.showLabel = true; obj.spanStyle = { 'color': '#f57848' };
                obj.process = this.$t('eventView.pending'); break;
              case 1: obj.showLabel = true; obj.spanStyle = { 'color': '#59ab22' };
                obj.process = this.$t('eventView.handled'); break;
              case 2: obj.showLabel = true; obj.spanStyle = { 'color': '#6e6e6e' };
                obj.process = this.$t('eventView.closed'); break;
              case 3: obj.showLabel = true; obj.spanStyle = { 'color': '#e22472' };
                obj.process = this.$t('eventView.returnStatus'); break;
              case 4: obj.showLabel = true; obj.spanStyle = { 'color': '#6e6e6e' };
                obj.process = this.$t('eventView.closed'); break;
            }
            if (self.curStatus === 2 || self.curStatus === 4) {
              self.showWinpBtn = false;
            }

            obj.showContent = index === 0;
            obj.audioList = [];
            obj.sourceList = [];
            obj.descriptionList = [];
            obj.attachment = [];
            if (item.attachment.length !== 0) {
              obj.attachment = item.attachment;
              item.attachment.forEach((_item, _index) => {
                if (_item.mediaType === 0) {
                  const audioObj = {};
                  audioObj.audioSrc = _item.url;
                  audioObj.isPlaying = false;
                  audioObj.audioOftenText = '';
                  audioObj.hasNotPlayAudio = true;
                  obj.showAudio = true;
                  obj.audioList.push(audioObj);
                } else if (_item.mediaType === 3) {
                  obj.descriptionList.push({ description: _item.url });
                } else {
                  obj.sourceList.push(_item);
                }
              });
            }
            temp.push(obj);
          });
          self.commentList = temp.slice(0, temp.length - 1);
          console.log("commentList:",self.commentList);
        }
      });
    },

    clickSubBtn(item, index) {
      if (!util.validateLicense(this.licenseStatus)) {
        return;
      }
      item.isActive = true;
      this.subBtnList.forEach((_item, _index) => {
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
        //description: description,
        account: self.event.createor,
        status: status,
        attachment:description
      };
      const params = {
        eventIds: eventIds,
        comment: comments
      };
      eventRESTful.addComment(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg === 'Success') {
          self.addDescriptionList = [];
          self.curDeslistNum = 0;
          util.notify(this.$t('storeView.successSubmit'), 'success', 3000);
          self.getCommentList(1);
          self.event.status = status;

          self.uploadProgress = false;
          self.eventDes = '';
          self.attFileCount=0;
          self.attachFileList=[];
          setTimeout(() => {
            self.commentList.forEach((_item, _index) => {
              self.getCommentDuration(_item);
            });
          }, 3000);
        } else {
          util.notify(this.$t('storeView.failSubmit'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        console.log('EventDetail-addComment:' + err);
      });
    },

    async submit() {
      if(this.licenseStatus == 61 ){
        util.notify(this.$t('route.errorStoreNoPermission'), 'error', 1000 );
        return;
      }
      if (!util.validateLicense(this.licenseStatus)) {
        return;
      }
      const self = this;
      let status = 0;
      const attachment_des = [];
      if (this.addDescriptionList.length === 0) {
        util.notify(this.$t('eventView.emptyInfo'), 'warning', 3000);
        return false;
      }
      this.addDescriptionList.forEach(att=>{
        attachment_des.push({mediaType:3,url:att});
      })

      //上傳附件
      self.uploadingnumOfPic = 0;
      self.totalnumOfPic = self.attachFileList.length;
      self.totalnumOfPic > 0 ? self.uploadProgress = true : self.uploadProgress = false;
      const storageParams = {};
      storageParams.storeId = this.event.storeId;

      console.log('storageParams :>> ', storageParams);
      await getStorageInfo(storageParams).then(res => {
        if (res.errCode === 0) {
          self.oss = res.data;
        }
      }); 
      for(let idx=0; idx<self.attachFileList.length;idx++){
        await self.upLoadFile(self.attachFileList[idx]).then((url) => {
          self.uploadingnumOfPic++;
          const auditImgObj = {
            mediaType: self.attachFileList[idx].type,
            url: url,
            ts: Date.now()
          };
          attachment_des.push(auditImgObj);
        }).catch((err) => {
          console.log("uploade file error:",err)
          upload++;
        });
      }
      var activeBtn = self.subBtnList.filter(btn=> btn.isActive);
      //console.log("activBtn:",activeBtn);
      if (activeBtn[0].order === 0) {
          status = 1;
        } else if (activeBtn[0].order === 1) {
          status = 2;
          this.isEdit = false;
          self.subBtnList.map(btn=>{btn.isShow=false;});
        } else if (activeBtn[0].order === 3) {
          status = 3;
        }else {
          status = self.curStatus;
        }
        //console.log("status:",status);
        self.addComment(status, attachment_des);
    },

    checkFull() {
      var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (isFull == undefined) {
        isFull = false;
      }
      return isFull;
    },

    getBtnList() {
      const self = this;
      const authorities = self.$store.state.user.authorities;
      PermissionHelper.setData(authorities);
      const tempBtnList = [];
      !!PermissionHelper.enableEventHandle() && tempBtnList.push({
        name: this.$t('eventView.handling'),
        order: 0,
        isShow: false,
        isActive: false
      });
      !!PermissionHelper.enableEventClose() && tempBtnList.push({
        name: this.$t('eventView.closing'),
        order: 1,
        isShow: false,
        isActive: false
      });
      !!PermissionHelper.enableEventAdd() && tempBtnList.push({
        name: this.$t('eventView.adding'),
        order: 2,
        isShow: false,
        isActive: false
      });
      !!PermissionHelper.enableEventReturn() && tempBtnList.push({
        name: this.$t('eventView.returnStatus'),
        order: 3,
        isShow: false,
        isActive: false
      });
      console.log("tempBtnList:",tempBtnList);
      self.subBtnList = tempBtnList;
      self.showWinpBtn = tempBtnList.length !== 0;
    },

    showRelatedChannel() {
      const self = this;
      //self.showRelatedChannelFlag = true;
      console.log("*relatedChannels:",self.relatedChannels)
      self.channelRadio = self.relatedChannels[0].id;
      this.confirmSelect();
    },

    cancelSelect() {
      const self = this;
      self.showRelatedChannelFlag = false;
      self.channelRadio = '';
    },

    confirmSelect() {
      const self = this;
      if (!util.validateLicense(this.licenseStatus)) {
        return;
      }
      self.showRelatedChannelFlag = false;
      const channel = self.relatedChannels.filter(item => item.id === self.channelRadio);
      self.curChannel = channel[0];
      this.$nextTick(()=> {
        self.dialogFormVisible = true;
        self.channelRadio = '';
        self.channelInfo = {};
        self.channelInfo = self.curChannel;
        self.vendor = self.curChannel.vendor;
        self.playVendorVideo();
      })
    },

    playVendorVideo() {
      this.$refs.vendorVideo.startVideo(this.channelInfo.ivsId, this.channelInfo.channelId, null);
    },
    comfirmAddDes(){
      if(this.curDeslistNum<5 && this.eventDes.trim()!=''){
        const description = this.eventDes;
        this.addDescriptionList.push(description);
        this.eventDes="";
        this.curDeslistNum+=1;
      }
    },
    onDeleteDescription(index){
      if (index > -1) {
        this.addDescriptionList.splice(index, 1); // 2nd parameter means remove one item only
        this.curDeslistNum-=1;
      }
    },
    onEditDescription(){
      this.isEdit =!this.isEdit;
    },
    editDesChang(val,idx){
      const self = this;
      const comment = filterString.all(val, 200);
      self.addDescriptionList[idx] = comment;
      const length = filterString.getContentLength(val);
      if (length > 200) {
        self.editDesRuletip[idx] = true;
      } else {
        self.editDesRuletip[idx] = false;
      }
    },
    deleteImg({item, index}) {
      const self = this;
      self.attachFileList.splice(index, 1);
    },
    getAuditImgList(index) {
      const arr = [];
      let i = 0;
      for (i; i < this.attachFileList.length; i++) {
        arr.push(this.attachFileList[i + index]);
        if (i + index >= this.attachFileList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.map(source => source.src);
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
          accessKeyId: self.oss.ossAccessKeyId,
          accessKeySecret: self.oss.ossAccessKeySecret,
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
              const url = self.getFileUrl(results.name);
              resolve(url);
            })
            .catch((err) => {
              reject(err);
            });
        });
      } else {
        const url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
        const containerURL = new azblob.ContainerURL(url, azblob.StorageURL.newPipeline(new azblob.AnonymousCredential()));
        const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, fileItem.fileName);
        return new Promise((resolve, reject) => {
          azblob.uploadBrowserDataToBlockBlob(azblob.Aborter.none, fileItem.file, blockBlobURL)
            .then((results) => {
              const url = self.getFileUrl(fileItem.fileName);
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    },
    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
    },
    doAddAttachment(e){
      const self = this;
      const maxSize = 4*1024*1024; //不能超過4MB
      var files = e.target.files || e.dataTransfer.files;
      console.log("choose file:",files);
      var fileName = files[0].name;
      if (!files.length)
        return;
      /*
      if(self.attFileCount==10){
        util.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
        return;
      }
      */
      if(files[0].type.includes("video") && self.videoAttFileCount==2){
        util.notify(self.$t('eventView.maximumAttVedio'), 'warning', 3000);
        return;
      }
      if(files[0].type.includes("image")){
        var objImg={
          fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_${this.event.storeId}_${files[0].name}`,
          src:'',
          url:'',
          file:'',
          type:2,
          size:files[0].size
        };
        self.createFile(files[0],objImg);
        self.attachFileList.push(objImg);
      }else if(files[0].type.includes("video")){
        console.log("choose file:",fileName);
        var objvideo={
          fileName:`${self.bucketVideo}/inspect_${util.getCurTimeStr()}_${this.event.storeId}_${files[0].name}`,
          src:'',
          url:URL.createObjectURL(files[0]),
          type:1,
          size:files[0].size,
        }
        self.createFile(files[0],objvideo);
        self.attachFileList.push(objvideo);
      }
      self.$refs.auditfile.value = '';
    },
    createFile(file, objFile) {
      //var image = new Image();
      console.log(objFile);
      var reader = new FileReader();
      console.log()
      reader.onload = (e) => {
        console.log("e:",e);
        objFile.src = e.target.result;

        objFile.file = util.base64ToBlob(e.target.result);
        console.log(objFile.file);
      };
      reader.readAsDataURL(file);
    },
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/css/textstyle.css';
@import '../../../assets/css/importfile.css';
$red:#f31d65;
$black:#484848;
$border:rgba(172, 174, 177,0.3);
$background:#f7f9fa;
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

.hidden_div{
  visibility: hidden;
}
.to_delete{
    margin-bottom: 5px;
    transition: all .3s;
    cursor: pointer;
    margin-left: 5px;
  }

.AddSumupLoad >>> .el-dialog__body{
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
    @media screen and(min-width: 1366px){
        .storeInfo-details{
            height: 50px;
            line-height: 50px;
        }
        .description{
            max-width: 75%;
            min-width: 75%;
            /deep/
            span{
              word-break: break-all;
            }
        }
        .event-title{
            font-size: 18px;
        }
        .deal-lside span{
            top:24px;
        }
    }
    @media screen and(max-width: 1366px){
        .storeInfo-details{
            height: 40px;
            line-height: 40px;
        }
        .description{
            max-width: 70%;
            min-width: 70%;
            /deep/
            span{
              word-break: break-all;
            }
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
        border-radius: 5px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.06);
        background-color: #fff;
        width: calc(540/1440*100vw);
        margin-left: calc(24/1440*100vw);
        .title-content{
            @include title-content;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .title-img{
                position: relative;
                //@include point(top,8);
                @include point(margin-left,20);
                width:20px;
                height:20px;
            }
            .title-img-inside{
                position: relative;
                //@include point(top,8);
                @include point(margin-left,20);
                width:20px;
                // height:20px;
            }
            .event-title{
                @include point(padding-right,20);
                font-weight: bold;
                color: $black;
                margin-left: 20px;
                width: calc(442/1440*100vw);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .event-status{
                display:inline-block;
                font-size: 12px;
                border-radius: 5px;
                height: 24px;
                line-height: 24px;
                //width:68px;
                text-align: center;
                padding-left: 5px;
                padding-right: 5px;
                white-space: nowrap;
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
        .dialog-title{
          text-align:left;
          font-size:24px;
          padding-left:20px;
          color:#484848;
          font-family: NotoSansCJKtc;
        }
        .video-dialog-content{
            width:100%;
            height:100%;
            margin: auto;
            padding: 0 34px 42px 34px;
            .rate-video-dialog{
              border-radius: 5px;
            }

            .dialog-hr{
                border: none;
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
              padding: 0 34px 42px 34px;
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
      .errorVideo-model{
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
          transform: translate(-50%, -50%);
          font-size: 12px;
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
            color: #556679;
            font-size: 13px;
            .storeInfo-details{
                font-size: 13px;
                color: $black;
            }
            dd{
                width: 5em;
            }
            .w4{
                font-weight: normal;
                float: left;
            }
            .en-w4{
              font-weight: normal;
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
                font-weight: normal;
                float: left;
            }
            .en-w3{
              font-weight: normal;
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
                /*@include point(min-width,260);*/
                width:calc(492/1440*100vw);

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
            .photo-content{
                overflow: hidden;
                @include point(margin-top,15);

                .source-content{
                    float: left;
                    @include point(margin,5);
                    @include point(max-width,220);
                    .img-content{
                        position: relative;
                        border-radius: 5px;
                        cursor: pointer;
                        .start-icon{
                            position: absolute;
                            left: 35%;
                            top: 30%;
                        }
                      .imgLittle{
                        width: calc(130/1920*100vw);
                        border-radius: 5px;
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
            .process-detail{
              width: calc(468/1440*100vw);
              padding: 16px 16px 30px;
              border: solid 1px #f5f5f5;
              background-color:#f7f9fa;
              border-radius: 5px;
              .deal-details{
                width:calc(436/1440*100vw);
                border-bottom: solid 2px #006ab7;
                .creator-area{
                  width:100%;
                  height:20px;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  font-family: Roboto;
                  font-size: 12px;
                  color: #69727c;
                  margin-top:16px;
                  align-items: center;
                  .account-area{
                    height:17px;
                    align-items: center;
                  }
                  .process-area{
                    font-family: PingFangTC;
                    font-size: 12px;
                    font-weight: 500;
                  }
                }
                .comment-area{
                  display: inline-block;
                  font-family: NotoSansCJKtc;
                  font-size: 14px;
                  color:#484848;
                  width:100%;
                  .att-content{
                      width: calc(460/1440*100vw);
                      font-family: NotoSansCJKtc;
                      font-size: 14px;
                      color:#484848;
                      word-break:keep-all;

                  }
                  .description{
                      float: left;
                      text-align: left;
                      @include point(margin-top,6);
                      font-family: Roboto,Arial, 'Microsoft YaHei';
                      font-size: 14px;
                      white-space:pre-wrap; /* css3.0 */
                      white-space:-moz-pre-wrap; /* Firefox */
                      white-space:-pre-wrap; /* Opera 4-6 */
                      white-space:-o-pre-wrap; /* Opera 7 */
                      word-wrap:break-word; /* Internet Explorer 5.5+ */
                      .description-content{
                        font-size: 14px;
                        word-break:break-all;
                      }
                  }
                  /deep/
                  .description-content{
                        font-size: 14px;
                  }
                  .source-content{
                    overflow: hidden;
                    min-width: 90%;
                    display: flex;
                    justify-content: flex-start;
                    overflow: hidden;
                    flex-wrap: wrap;
                      @include point(margin-top,6);
                      .source-details{
                          @include point(max-width,104);
                          margin-right: calc(10/1920*100vw);
                          width: 104px;
                          .img-content{
                              position: relative;
                              cursor: pointer;
                              .start-icon{
                                  position: absolute;
                                  left: 35%;
                                  top: 30%;
                              }
                            .imgLittle{
                              width: 104px;
                              border-radius: 5px;
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
    .rside{
        border-radius: 5px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.06);
        background-color: #fff;
        width: calc(540/1440*100vw);
        // @include point(margin-right,20);
        color: $black;
        height: 100%;
        .title{
          width: calc(540/1440*100vw);
          height:170px;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.06);
          background-color: #fff;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          .title-content{
            @include title-content;
            font-size: 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .line{
              margin-left: 16px;
              width:calc(508/1440*100vw);
              height:0;
              opacity: 0.34;
              border: solid 1px $border;
            }
            .btn-submit{
              background-color:#c60957;border:none;float:left;margin-left:24px;
              color: #fff;
              &:hover{
                background-color:#ae0048;
                color: #fff;
              }
            }
          }

          .btn-content{
            background-color: #FFF;
            display: flex;
            flex-direction: row;
            align-content:flex-start;
            margin-left: 16px;
            .btn_List{
              .reopen{
                background-color: #c60957;
                color: #fff;
                &:hover{
                  background-color:#ae0048;
                  color: #fff;
                  transition: all .3s;
                }
              }
              margin-top:16px;
                  div{
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      align-self: center;
                      @include point(margin-right,20);
                      font-size: 15px;
                      border-radius: 5px;
                      cursor: pointer;
                      @include point(width,120);
                      @include point(height,40);
                      text-align: center;
                      background-color: #FFF;
                      color:#556679;
                      border: solid 1px #e6e6e6;
                      justify-content: center;
                  }
                  .ja-span{
                    width: 120px;
                  }
                  .activeClass{
                      background-color: #006ab7 !important;
                      color: #FFF;
                  }
              }
            }
        }
        .submit-content-scroll{
          @include point(height,545);
          /deep/
          .el-scrollbar__wrap{
              overflow: auto;
            }
        }
        .submit-content{
            background-color: #FFF;
            border: solid 1px #f0f0f0;
            background-color: #fff;
            border-radius: 5px;
            margin-left: 10px;
            text-align: left;
            font-size: 15px;
            margin-top: 23px;
            /*padding-bottom:15px;*/
            padding-left: 16px;
            color: $black;
            overflow: hidden;
            width: calc(520/1440*100vw);
            @include point(padding-top,20);
            @include point(height,570);
            .dealInfo-label{
                font-weight: bold;
                margin-bottom: 25px;
                display: block;
            }

            .description{
              margin:16px 19px 0px 16px;
              display:flex;
              flex-direction:row;
              align-items: center;
              .edit-description{
                // margin-left:14px;
                padding: 6px 9px 6px 6px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                border: solid 1px #e6e6e6;
                border-radius: 5px;
                width: calc(455/1440*100vw);
                display: flex;
                flex: row;
                min-height: 62px;
                .edit-input{
                  width:calc(455/1440*100vw);
                  border-right: solid 1px #e6e6e6;
                  min-height: 50px;
                  .edit-event-input{
                    border:none;
                    /deep/
                    .el-textarea__inner,
                    .el-textarea__inner:focus {
                      border:none;
                    }
                  }
                }
                .edit-icon-div{
                  width: 38px;
                  display: flex;
                  flex-direction: row;
                  align-content: center;
                  align-items: center;
                  min-height: 50px;
                  justify-content:center;
                  cursor:pointer;
                }
              }
            }
            .des-input{
              margin-top: 16px;
              margin-left: 16px;
              margin-right: 19px;
              width: calc(478/1440*100vw);
              min-height:86px;
              background-color: #f4f6f7;
              border-radius: 5px;
              display: flex;
              flex-direction: column;
              .input-area{
                min-height:56px;
              }
              .btn-content{
                margin-right: 6px;
                align-items: flex-end;
                margin-bottom: 6px;
                .btn-des-confirm{
                  height: 20px;
                  padding: 1px 8px 2px;
                  border: solid 1px #e6e6e6;
                  border-radius: 5px;
                  background-color: #fff;
                  font-family: NotoSansCJKtc;
                  font-size: 12px;
                  font-weight: 500;
                  color: #556679;
                  float: right;
                  cursor:pointer;
                }
              }
            }

            .rules{
                font-size: 10px;
                color:#ff2400;
                margin-top: 3px;
                display: block;
            }
            .attach-area{
              display:flex;
              flex-wrap:wrap;
              align-content:flex-start;
              align-self: flex-start;
              width: calc(478/1440*100vw);
              margin-top: 15px;
              margin-left: 16px;
              margin-right: 19px;
              margin-bottom:10px;
              .attach-add{
                height:calc(64/900*100vh);
                width:calc(86/1440*100vw);
                border-radius: 5px;
                box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
                display:flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .att-txt{
                  font-size: 12px;
                  color: #006ab7;
                  margin-left: 3px;
                }
              }
              .source-details{
                display: inline-block;
                margin-right: 12px;
                position: relative;
                .icondelete{
                  position: absolute;
                  font-size: 14px;
                  right: 4px;
                  margin-top: 4px;
                  z-index: 2;
                  color: #fff;
                  cursor: pointer;
                  background-color: rgba($color: $black, $alpha: 0.8);
                  border-radius: 50%;
                }
                .img-content{
                  width: 100%;
                  height: 100%;
                  position: relative;
                  cursor: pointer;
                  .start-icon{
                    position: absolute;
                    left: 35%;
                    top: 30%;
                  }
                }
                .imgLittle{
                  height: calc(64/900*100vh);
                  width: auto;
                  border-radius: 5px;
                }
                .icon-video{
                  font-size: 18px;
                  color: $red;
                  /*position: relative;*/
                  /*top: 2px;*/
                  margin-right: 5px;
                  display: inline-block;
                  vertical-align: middle;
                }
              }
            }
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
                    @include point(padding-top,5);
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                    .audio{
                        padding-top: 26px;
                        overflow: hidden;
                        text-align: left;
                        display: inline-flex;
                        justify-content: flex-start;
                        .creator{
                            @include point(margin-left,20);
                            float: left;
                            font-size: 14px;
                        }
                        .deal-speech{
                            @include point(margin-left,10);
                            position: relative;
                            @include point(bottom,10);
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
                      margin-left: calc(20/1920*100vw);
                        overflow: hidden;
                        min-width: 90%;
                      display: flex;
                      justify-content: flex-start;
                      overflow: hidden;
                      flex-wrap: wrap;
                        @include point(margin-top,15);
                        .source-details{
                            @include point(max-width,220);
                          margin-right: calc(10/1920*100vw);
                            width: calc(100/1920*100vw);
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
    /deep/
    .el-input--mini
    .el-textarea__inner {
          background-color: #f4f6f7;
          border:none;
          color:#acaeb1;
          font-size: 15px;
          font-family: NotoSansCJKtc;
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
  .el-image-viewer__close {
    color: white;
    background-color: black;
}
</style>
