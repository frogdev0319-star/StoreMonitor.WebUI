<template>
  <div>
    <div class="errorVideo-model" v-if="showError">
      <span>{{errorText}}</span>
    </div>
    <div v-else>
      <div class="video-content" id="videoContent" :style="isEvent?{}: {'margin-bottom': 0}" v-loading="isLoading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="getvideo-content" v-if="showGetVideo">
          <div class="btn-graph">
            <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"></canvas>
          </div>
          <canvas id="vcanvas" :width="varyWindowWidth*0.418+'px'" :height="varyWindowWidth*0.282+'px'"></canvas>
        </div>
        <span id="channelName" v-if="showInfoContent && channelInfo">{{channelInfo.channelName}}</span>
        <div class="icon-footer" v-if="showInfoContent">
          <div class="iconlside">
            <i class="iconfont icon-bofang1 iconplay" @click="startPlay" v-if="!playState"></i>
            <i class="iconfont icon-zantingtingzhi iconplay" @click="stopPlay" v-else></i>
          </div>
          <div class="iconrside">
            <!--<div class="speed-content" v-if="playBackState">-->
              <!--&lt;!&ndash;<span>{{$t('storeMonitor.speed')}}</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-select class="el-test" size="mini" v-model="curSpeed" :popper-class="popperClass" v-show="!fullScreen" @change="adjustSpeed">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option&ndash;&gt;-->
                  <!--&lt;!&ndash;v-for="(item) in speedList"&ndash;&gt;-->
                  <!--&lt;!&ndash;:key="item.value"&ndash;&gt;-->
                  <!--&lt;!&ndash;:label="item.label"&ndash;&gt;-->
                  <!--&lt;!&ndash;:value="item.value"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-select class="el-test" size="mini" v-model="curSpeed" :popper-class="popperClass" :popper-append-to-body='false' v-show="fullScreen" @change="adjustSpeed">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option&ndash;&gt;-->
                  <!--&lt;!&ndash;v-for="(item) in speedList"&ndash;&gt;-->
                  <!--&lt;!&ndash;:key="item.value"&ndash;&gt;-->
                  <!--&lt;!&ndash;:label="item.label"&ndash;&gt;-->
                  <!--&lt;!&ndash;:value="item.value"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
              <!--<span>{{$t('storeMonitor.back')}}</span>-->
              <!--<el-select class="el-test" size="mini" :value="curBack" :popper-class="popperClass" placeholder=' '>-->
                <!--<el-option-->
                  <!--v-for="(item) in backList"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value"-->
                  <!--@click.native="adjustProcess(item.value, item.label)"-->
                <!--&gt;-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</div>-->
            <div class="screen-content">
              <i class="iconfont iconscreen"
                 :class="fullScreen?'icon-tuichuquanping':'icon-quanping'" @click="controlScreen"></i>
            </div>
          </div>
        </div>
        <div class="progress-content">
          <b-progress :value="currentTimeValue" id="bprogress"
                      :max="durationTimeValue" class="mb-3 prog" height="0.2rem" style="margin-bottom:0px !important;"/>
        </div>
        <transition name='fade'>
          <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showModelContent && !isEvent"
               @click="captureSnapshot">
            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
            <span>{{$t('remotePatrol.snapshot')}}</span>
          </div>
        </transition>
        <video height=83% width=90% id="beseyeVideo" prload autoplay :controls="showControls" style="margin: auto" v-show="showVideo && !playBack"
               @waiting='onPlayerWaiting($event)' @playing="onPlayerPlaying($event)"
               @loadstart="onPlayerWaiting($event)" @error="onPlayerWaiting($event)" @canplay="onPlayerCanPlay()">
        </video>
        <video height=83% width=90% id="video1" prload autoplay :controls="showControls" style="margin: auto" v-show="playBack"
               @waiting='onPlayerWaiting($event)' @playing="onPlayerPlaying($event)"
               @loadstart="onPlayerWaiting($event)" @error="onPlayerWaiting($event)" @canplay="onPlayerCanPlay()">
        </video>
        <video height=83% width=90% id="video2" prload autoplay :controls="showControls" style="margin: auto" v-show="playBack"
               @waiting='onPlayerWaiting($event)' @playing="onPlayerPlaying($event)"
               @loadstart="onPlayerWaiting($event)" @error="onPlayerWaiting($event)" @canplay="onPlayerCanPlay()"></video>
      </div>
    </div>
    <el-dialog :title="$t('remotePatrol.edit')"
               :visible.sync="showCutDialog" :close-on-click-modal="false" v-if="showCutDialog"
               :width="860*percentHeight+'px'" height=300px top=5%>
      <div class="canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel" @mouseup="mouseUpHandler">
        <hr class="dialog-hr"/>
        <div class='icon-right' v-if="showPenBtn" id="iconR">
          <img :src="penBtnSrc" class="pen-btn" @click="showPenList"/>
          <transition name='fadepen'>
            <div class="pen-content" v-if="showPen">
              <div class="content" v-for="(item,index) in penList" :key="index">
                <div :class="{colorActive:item.showContent}"></div>
                <div class="color" :id="item.id" @click="checkPen(item,index)"></div>
              </div>
            </div>
          </transition>
        </div>
        <canvas id="icanvas" :width="767*percentHeight" :height="431*percentHeight" @mousedown="mouseDownAction($event)"
                @mousemove="mouseMoveAction($event)" @mouseleave="mouseLeaveAction($event)"></canvas>
        <img :src="imgSrc" id="imgTest" style="display: none"/>
        <div class="cancel-content" v-if="showCancelContent" :style="{'width':767*percentHeight+'px',
                    'margin-left':47*percentHeight+'px'}">
          <div class="content" @click="cancelEditCanvas">
            <img :src="clearIconSrc" class="icon-clear" height="22px"/>
            <span>{{$t('remotePatrol.clear')}}</span>
          </div>
          <div class="content" @click="confirmEditCanvas">
            <img :src="removeIconSrc" class="icon-clear" height="22px"/>
            <span>{{$t('remotePatrol.cancel')}}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">{{$t('remotePatrol.cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">{{$t('remotePatrol.confirm')}}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('remotePatrol.feedbacks')"
               :visible.sync="showFeedDialog2" :close-on-click-modal="false" v-if="showFeedDialog2"
               :width="860*percentHeight+'px'" height=300px top=5%>
      <div class="canvas-content" style="overflow:hidden;">
        <hr class="dialog-hr"/>
        <div class="feed-canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel">
          <div class='icon-right' v-if="showPenBtn" id="iconR">
            <img :src="penBtnSrc" class="pen-btn" @click="showPenList"/>
            <transition name='fadepen'>
              <div class="pen-content" v-if="showPen">
                <div class="content" v-for="(item,index) in penList" :key="index">
                  <div :class="{colorActive:item.showContent}"></div>
                  <div class="color" :id="item.id" @click="checkPen(item,index)"></div>
                </div>
              </div>
            </transition>
          </div>
          <canvas id="icanvas" :width="520*percentHeight" :height="340*percentHeight"
                  @mousedown="mouseDownAction($event)" @mouseup="mouseUpHandler"
                  @mousemove="mouseMoveAction($event)" @mouseleave="mouseLeaveAction($event)"></canvas>
          <img :src="imgSrc" id="imgTest" style="display: none"/>
          <div class="cancel-content" v-if="showCancelContent" :style="{'width':520*percentHeight+'px',
                        'margin-left':47*percentHeight+'px'}">
            <div class="content" @click="cancelEditCanvas">
              <img :src="clearIconSrc" class="icon-clear" height="22px"/>
              <span>{{$t('remotePatrol.clear')}}</span>
            </div>
            <div class="content" @click="confirmEditCanvas">
              <img :src="removeIconSrc" class="icon-clear" height="22px"/>
              <span>{{$t('remotePatrol.cancel')}}</span>
            </div>
          </div>
        </div>
        <div class="event-content">
          <span class="event-title"><span class="is-required">*</span>{{$t('remotePatrol.name')}}</span>
          <el-input size="mini" class="name-input" v-model="eventName" @input="eventNameChanged"
                    @blur="notShowInputRuleTips('eventName')"></el-input>
          <span class="rules" style="margin-left:0;"
                v-if="eventNameRuletip">{{$t('remotePatrol.eventNameRuletip')}}</span>
          <span class="error-class" v-if="showEventNameInfo">{{$t('storeMonitor.emptyTitle')}}</span>
          <span class="event-title">{{$t('remotePatrol.description')}}</span>
          <el-input size="mini" class="des-input" type="textarea" resize='none' :autosize="{ minRows: 4, maxRows:7}"
                    @input="eventDesChanged" v-model="eventDes" :placeholder="$t('remotePatrol.descPlaceholder')"
                    @blur="notShowInputRuleTips('eventDes')"></el-input>
          <span class="rules" style="margin-left:0;" v-if="eventDesRuletip">{{$t('remotePatrol.comentRuletip')}}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showFeedDialog2 = false" size="mini">{{$t('remotePatrol.cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmAddFeedBack2" size="mini" type="primary">
          {{$t('remotePatrol.confirm')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import i18n from "../lang";
  import {getBeseyeAccessToken, getPlaylistInfo, getStreamInfo, getStreamInfoFromTW} from "../api/baseye";
  import filterString from "../common/filterString";
  import {mapGetters} from "vuex";

  export default {
    name: "BeseyeVue",
    props: {
      channelInfo: {
        type: Object,
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
        varyWindowHeight: window.innerHeight,
        varyWindowWidth: window.innerWidth,
        showCutModel: false,
        errorText: '',
        showError: false,
        showVideo: true,
        showModel: true,
        playState: false,
        playBackState:false,
        playBackTime: 0,
        realTimeStartTs: 0,
        currentTimeValue: 0,
        durationTimeValue: 300,
        times: 0,
        lang: i18n.locale,
        fullScreen: false,
        hiddenModel: false,
        showGetVideo: false,
        showInfoContent: true,
        showModelContent: false,
        showControls: false,
        channel: this.channel,
        imageCanvas: new Image(),
        imageCanvasList: null,
        showCutDialog: false,
        showFeedDialog2: false,
        showFeedDialog3: false,
        canvasEl: '',
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
        clearIconSrc: require('../../static/img/清除.png'),
        removeIconSrc: require('../../static/img/撤销.png'),
        penBtnSrc: require('../../static/img/pen_btn.png'),
        flag: 0,
        eventName: '',
        eventNameRuletip: false,
        eventDesRuletip: false,
        eventDes: '',
        editCount: 0,
        currentStoreId: '',
        accessToken: '',
        expireTime: 0,
        realTimeSpeed: 0,
        timerPlayReal: null,
        isLoading: false,

        beseyeVideo: null,
        peerConnection: null,
        peerConnectionConfig: {'iceServers': []},
        userData: {param1: "value1"},
        wsConnection: null,
        repeaterRetryCount: 0,
        RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
        RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate,
        RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
        // wsURL: '',
        streamInfo: {},
        wsURL: "",
        vcamerId: "93aed0a82f284c9884c1956121db809f",
        accessToken: "",
        dd: "{Web}_{YH-EXTERNAL}_{97557807-1149-4004-8e92-91c344539ded}",

        playingPlayer: null,
        video1: null,
        video2: null,
        player1: null,
        player2: null,
        players: null,
        playlist: [],
        isPlaying: false,
        speedList:[
          {
            value:0,
            label:'1/4 X'
          },
          {
            value:1,
            label:'1/2 X'
          },
          {
            value:2,
            label:'1 X'
          },
          {
            value:3,
            label:'2 X'
          },
          {
            value:4,
            label:'4 X'
          }
        ],
        curSpeed:'1 X',
        backList:[
          {
            value:0,
            label:'10s'
          },
          {
            value:1,
            label:'30s'
          },
          {
            value:2,
            label:'60s'
          }
        ],
        curBack:'',
        popperClass:'select-popClass',
        timeid: null,
        startTs: 0
      }
    },
    methods: {
      showPenList() {
        let self = this;
        self.showPen = !self.showPen;
        self.showCancelContent = false;
      },
      checkPen(item, index) {
        let self = this;
        item.showContent = true;
        self.penList.forEach((_item, _index) => {
          if (index != _index) {
            _item.showContent = false;
          }
        })
        self.penChecked = item.id;
      },
      cancelEditCanvas() {
        let self = this;
        self.showCancelContent = false;
        self.canvasEl = document.getElementById('icanvas');
        var ctx = self.canvasEl.getContext('2d');
        let vcanvas = null;
        if (self.showFeedBack) {
          vcanvas = {width: 520 * self.percentHeight, height: 340 * self.percentHeight};
        }
        else {
          vcanvas = {width: 767 * self.percentHeight, height: 431 * self.percentHeight};
        }
        ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
        ctx.drawImage(self.imageCanvas, 0, 0, vcanvas.width, vcanvas.height);
        self.imageCanvasList = [];
      },
      confirmEditCanvas() {
        let self = this;
        self.showCancelContent = false;
        self.imageCanvasList.pop();
        self.canvasEl = document.getElementById('icanvas');
        var ctx = self.canvasEl.getContext('2d');
        let vcanvas = null;
        if (self.showFeedBack) {
          vcanvas = {width: 520 * self.percentHeight, height: 340 * self.percentHeight};
        }
        else {
          vcanvas = {width: 767 * self.percentHeight, height: 431 * self.percentHeight};
        }
        ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
        if (self.imageCanvasList.length == 0) {
          ctx.drawImage(self.imageCanvas, 0, 0, vcanvas.width, vcanvas.height);
        }
        else {
          ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length - 1], 0, 0, vcanvas.width, vcanvas.height);
        }
      },
      confirmEdit() {
        let self = this;
        let obj = {};
        obj.mediaType = 2;
        let src = self.canvasEl.toDataURL("image/jpeg");
        self.$emit('confirmEzvizCanvas', src);
        self.showCutDialog = false;
      },
      mouseDownAction(e) {
        let self = this;
        self.isMouseDown = true;
        self.X = e.offsetX;
        self.Y = e.offsetY;
        self.showCutModel = false;
        self.showPenBtn = false;
        self.showCancelContent = false;
      },
      mouseMoveAction(e) {
        let self = this;
        if (self.isMouseDown) {
          self.X1 = e.offsetX;
          self.Y1 = e.offsetY;
          self.drawLine(self.X, self.Y, self.X1, self.Y1);
          self.showPenBtn = false;
          self.flag++;
        }
      },
      mouseUpHandler(e) {
        let self = this;
        self.isMouseDown = false;
        self.showCutModel = true;
        self.showPenBtn = true;
        self.showCancelContent = true;  //每次鼠标弹起后显示可以取消的框
        if (self.flag != 0 && self.canvasEl != '') {
          let imgObj = new Image();
          imgObj.src = self.canvasEl.toDataURL("image/jpeg");
          self.imageCanvasList.push(imgObj);
        }
        self.flag = 0;
      },
      mouseLeaveAction(e) {
        console.log(e)
        let self = this;
        self.isMouseDown = false;
      },
      drawLine(x, y, x1, y1) {
        let self = this;
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
        let self = this;
        self.showCancelContent = true;
        self.showPenBtn = true;
      },
      hiddenCancel() {
        let self = this;
        self.showCancelContent = false;
        self.showPenBtn = false;
      },
      //抓图问题反馈
      confirmAddFeedBack2() {
        let self = this;
        let src = self.canvasEl.toDataURL("image/jpeg");

        let obj = {
          eventName: self.eventName,
          eventDes: self.eventDes,
          src: src
        }
        if (self.eventName.trim().length == 0) {
          //self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
          self.showEventNameInfo = true;
          return false;
        }
        self.$emit('ezvizCutPictureFeedback', obj);
        self.showFeedDialog2 = false;
      },
      captureSnapshot() {
        let self = this;
        console.log(self.curGroupIndex);
        self.imageCanvasList = [];
        if (self.fullScreen) {
          self.exitFullscreen();
          self.fullScreen = false;
        }
        if (self.showFeedBack) {
          self.showFeedDialog2 = true;
          self.eventName = '';
          self.eventDes = '';
          self.showEventNameInfo = false;
          this.$nextTick(() => {
            self.canvasEl = document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.drawImage(self.beseyeVideo, 0, 0, 520 * self.percentHeight, 340 * self.percentHeight);
            var oGrayImg = icanvas.toDataURL('image/jpeg');
            self.imageCanvas.src = oGrayImg;
            let imgObj = new Image();
            imgObj.src = oGrayImg;
            self.imageCanvasList.push(imgObj);
          })
        }
        else {
          self.showCancelContent = false;
          if (self.sourceListLength >= 10) {
            self.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
            return false;
          }
          self.showCutDialog = true;
          this.$nextTick(() => {
            self.canvasEl = document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.drawImage(self.beseyeVideo, 0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
            var oGrayImg = icanvas.toDataURL('image/jpeg');
            self.imageCanvas.src = oGrayImg;
            let imgObj = new Image();
            imgObj.src = oGrayImg;
            self.imageCanvasList.push(imgObj);
          })
        }
      },
      onPlayerWaiting(e) {
        console.log('video is loading')
        this.playState = false
        this.showModelContent = false
        this.isLoading = true;
        if(this.playBack){
          window.clearInterval(this.timeId);
          this.currentTimeValue = 0
        }
      },
      onPlayerPlaying(e) {
        let self = this
        console.log('vi' + 'deo is playing')
        this.playState = true
        this.editCount++
        this.showModelContent = true
        this.isLoading = false
        if(this.playBack){
          window.clearInterval(self.timeId);
          self.timeId = window.setInterval(() => {
            self.getProcess();
          }, 1000);
        }
      },
      onPlayerCanPlay() {
        let self = this;
        if (!this.playBack){
          window.clearInterval(self.timerPlayReal);
          self.timerPlayReal = window.setInterval(() => {
            console.log(self.realTimeSpeed)
            self.realTimeSpeed = self.realTimeSpeed + 1;
          }, 1000);
        }
        else{
          // window.clearInterval(self.timeId);
          // self.timeId = window.setInterval(() => {
          //   self.getProcess();
          // }, 1000);
        }
      },
      async getProcess(){
        let self=this;
        let curTime = self.players.mainPlayer.video.currentTime * 1000
        let duration = 0;
        if (!self.checkUndefined(self.players.mainPlayer.media)) {
          duration = self.players.mainPlayer.media.duration
        }
        self.durationTimeValue=duration;
        self.currentTimeValue=curTime;
        console.log(duration)
        console.log(curTime);
        console.log(self.startTs);
        self.realTimeStartTs ++;
        console.log(self.realTimeStartTs)
        if(curTime>=duration){
          window.clearInterval(self.timeid);
          self.timeid=null;
          self.timeid=0;
        }
      },
      controlScreen() {
        let self = this;
        if (!self.fullScreen) {
          self.fullWindowScreen();
          self.fullScreen = true;
        }
        else {
          self.exitFullscreen();
          self.fullScreen = false;
        }
      },
      eventNameChanged(val) {
        let self = this;
        let content = filterString.standard(val, 50);
        console.log(content);
        self.eventName = content;
        self.showEventNameInfo = false;
        let length = filterString.getContentLength(val);
        if (length > 50) {
          this.eventNameRuletip = true
        } else {
          this.eventNameRuletip = false
        }
      },
      eventDesChanged(val) {
        let self = this;
        let content = filterString.all(val, 200);
        console.log(content);
        self.eventDes = content;
        let length = filterString.getContentLength(val);
        if (length > 200) {
          self.eventDesRuletip = true
        } else {
          self.eventDesRuletip = false
        }
      },
      notShowInputRuleTips(e) {
        if (e == 'eventName') {
          this.eventNameRuletip = false
        } else if (e == 'eventDes') {
          this.eventDesRuletip = false
        }
      },
      //进入全屏
      fullWindowScreen(...val) {
        console.log(val);
        let self = this;
        //self.showControls=true;
        var ele = document.getElementById('videoContent');
        ele.style.width = "100%";
        ele.style.height = "100%";
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        }
        else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        }
        else if (ele.webkitRequestFullScreen) {
          ele.webkitRequestFullScreen();
        }
        else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
      },
      //退出全屏
      exitFullscreen() {
        var de = document;
        var ele = document.getElementById('videoContent');
        ele.style.width = "auto";
        ele.style.height = "auto";
        if (de.exitFullscreen) {
          de.exitFullscreen();
        }
        else if (de.mozCancelFullScreen) {
          de.mozCancelFullScreen();
        }
        else if (de.webkitCancelFullScreen) {
          de.webkitCancelFullScreen();
        }
      },
      visibleChange() {
        let self = this;
        if (document.hidden) {
          if (self.playState) {
            self.stopPlay(); //停止视频
          }
        }
        else {
          console.log(self.playState);
          if (self.playState) {
            self.startPlay()
          }
        }
      },
      startPlay() {
        let self = this;
        self.repeaterRetryCount = 0;
        self.showError = false
        self.errorText = ''
        if(!self.playBack){
          //self.getBeseyeStreamInfo()
          self.getStreamInfofromTW()
        }
        else{
          if(self.playBackState){
            //paused
            self.players.mainPlayer.video.play()
          }
          else{
            self.initApp()
          }
        }
      },
      wsConnect(url) {
        let self = this;
        console.log('socket connection')
        console.log(url)
        self.isLoading = true
        self.wsConnection = new WebSocket(url);
        self.wsConnection.binaryType = 'arraybuffer';

        self.wsConnection.onopen = function () {
          console.log("wsConnection.onopen");

          self.peerConnection = new RTCPeerConnection(self.peerConnectionConfig);
          self.peerConnection.onicecandidate = function (event) {
            let candidate = event.candidate
            if (candidate != null) {
              console.log("Local Candidate: ", candidate);
            }
          };
          self.peerConnection.ontrack = function (event) {
            console.log('gotRemoteTrack: kind:' + event.track.kind + ' stream:' + event.streams[0]);
            try {
              self.beseyeVideo.srcObject = event.streams[0];
            } catch (error) {
              console.log(error)
              self.beseyeVideo.src = URL.createObjectURL(event.streams[0]);
            }
          }
          self.peerConnection.oniceconnectionstatechange = function () {

            console.log('ice state change: ' + self.peerConnection.iceConnectionState);
          };

          console.log("wsURL: " + self.wsURL);
          self.sendPlayGetOffer();
        }

        self.wsConnection.onmessage = function (evt) {
          console.log("wsConnection.onmessage: " + evt.data);
          var msgJSON = JSON.parse(evt.data);

          var msgStatus = Number(msgJSON['status']);
          var msgCommand = msgJSON['command'];

          if (msgStatus == 514) {
            // repeater stream not ready
            self.repeaterRetryCount++;
            if (self.repeaterRetryCount < 10) {
              // setTimeout(self.sendGetOffer, 500);
            }
            else {
              self.stopPlay();
            }
          }
          else if (msgStatus != 200) {
            self.stopPlay();
          }
          else {
            var streamInfoResponse = msgJSON['streamInfo'];
            if (streamInfoResponse !== undefined) {
              self.streamInfo.sessionId = streamInfoResponse.sessionId;
            }

            var sdpData = msgJSON['sdp'];
            if (sdpData !== undefined) {
              console.log('sdp: ' + JSON.stringify(msgJSON['sdp']));

              // We mundge the SDP here, before creating an Answer
              // If you can get the new MediaAPI to work this might
              // not be needed.
              msgJSON.sdp.sdp = self.enhanceSDP(msgJSON.sdp.sdp);

              self.peerConnection.setRemoteDescription(new RTCSessionDescription(msgJSON.sdp), function () {
                self.peerConnection.createAnswer(self.gotDescription, function () {
                });
              }, function (error) {
                console.error(error);
              });
            }

            var iceCandidates = msgJSON['iceCandidates'];
            if (iceCandidates !== undefined) {
              for (var index in iceCandidates) {
                var iceCandidate = iceCandidates[index]
                console.log('iceCandidates: ' + JSON.stringify(iceCandidate));
                var candidateInfo = iceCandidate.candidate.split(' ')
                if (candidateInfo[2] == 'TCP' || candidateInfo[2] == 'UDP' && typeof InstallTrigger != 'undefined') {
                  try {
                    self.peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            }
          }

          if ('sendResponse'.localeCompare(msgCommand) == 0) {
            if (self.wsConnection != null) {
              self.wsConnection.close();
              self.wsConnection = null;
            }
          }
        }

        self.wsConnection.onclose = function (event) {
          console.log("wsConnection.onclose " + event.code + event.reason);
          // self.showError = true
          // self.errorText = '连接中断'
        }

        self.wsConnection.onerror = function (evt) {
          // self.showError = true
          // self.errorText = '连接出错'
          console.log("wsConnection.onerror: " + JSON.stringify(evt));
        }
      },
      gotDescription(description) {
        console.log('gotDescription' + description.sdp);
        let self = this;
        self.peerConnection.setLocalDescription(description, function () {
          console.log('sendAnswer');
          self.wsConnection.send('{"direction":"play", "command":"sendResponse", "streamInfo":' + JSON.stringify(self.streamInfo) + ', "sdp":' + JSON.stringify(description) + ', "userData":' + JSON.stringify(self.userData) + '}');

        }, function () {
          console.error('set description error')
        });
      },
      stopPlay() {
        let self = this;
        if(!self.playBack){
          if (self.peerConnection != null) {
            self.peerConnection.close();
            self.peerConnection = null;
          }
          if (self.wsConnection != null) {
            self.wsConnection.close();
            self.wsConnection = null;
          }
          self.beseyeVideo.removeAttribute('src');
          window.clearInterval(self.timerPlayReal);
          self.realTimeSpeed = 0;
          self.playState = false
          self.showModelContent = false
        }
        else{
          if(self.playState){
            self.players.mainPlayer.video.pause();
            //self.players = null;
            self.playBackState = true
            self.playState = false
            window.clearInterval(self.timeId);
            self.timeId = null
          }
        }
      },
      sendPlayGetOffer() {
        let self = this;
        console.log("sendPlayGetOffer: " + JSON.stringify(self.streamInfo));
        self.wsConnection.send('{"direction":"play", "command":"getOffer", "streamInfo":' + JSON.stringify(self.streamInfo) + ', "userData":' + JSON.stringify(self.userData) + '}');
      },
      enhanceSDP(sdpStr) {
        var sdpLines = sdpStr.split(/\r\n/);
        var sdpSection = 'header';
        var hitMID = false;
        var sdpStrRet = '';

        for (var sdpIndex in sdpLines) {
          var sdpLine = sdpLines[sdpIndex];

          if (sdpLine.length == 0)
            continue;

          if (sdpLine.includes("profile-level-id")) {
            console.log("found profile-id");
            // This profile seems to be correct for the stream publishing,
            // however will not allow Safari to play it back, so we swap
            // it for a baseline constrained one, which is declared when
            // Safari publishes in the SDP.
            if (sdpLine.includes("640029")) {
              sdpLine = sdpLine.replace("640029", "42E01F");
            }
          }

          sdpStrRet += sdpLine;
          sdpStrRet += '\r\n';
        }

        console.log("Resulting SDP: " + sdpStrRet);
        return sdpStrRet;
      },
      notify(msg, type, time) {
        this.$message({
          message: msg,
          type: type,
          duration: time
        });
      },
      getAccessToken(storeId) {
        let self = this;
        let params = {};
        params.storeId = storeId;
        return new Promise((resolve, reject) => {
          if (self.currentStoreId == storeId && (Date.parse(new Date()) < self.expireTime)) {
            resolve(self.accessToken);
          } else {
            getBeseyeAccessToken(params)
              .then(result => {
                console.log(result)
                self.currentStoreId = storeId;
                self.accessToken = result.data.accessToken;
                self.expireTime = result.data.expireTime;
                resolve(result.data.accessToken);
              })
              .catch(error => {
                reject();
              })
          }
        })
      },
      getStreamInfofromTW() {
        let self = this;
        let params = {
          "vci": self.channelInfo.ivsId,
          "dd": self.dd
        }
        getStreamInfoFromTW(params).then(response => {
          console.log(response)
          if (response) {
            // let result = response.data
            self.streamInfo = response.data.streamInfo;
            self.wsURL = response.data.wsUrl;
            console.log(self.wsURL)
            self.wsConnect(self.wsURL)
          }
        }).catch(err => {
          console.log(err)
        });
      },
      getBeseyeStreamInfo() {
        let self = this;
        if (!self.channelInfo) {
          return false
        }
        let params = {
          "cameraId": self.channelInfo.ivsId,
          "platform": 1
        }
        getStreamInfo(params).then(response => {
          console.log(response)
          if(Object.keys(response.data).length === 0){
            self.showError = true
            self.errorText = "Invalid Token";
          }
          else{
            self.wsURL = response.data.wsUrl;
            self.streamInfo = response.data.streamInfo;
            self.wsConnect(self.wsURL)
          }
        }).catch(err => {
          console.log(err)
        });
      },
      async initApp() {
        let self = this;
        // Install built-in polyfills to patch browser incompatibilities.
        shaka.polyfill.installAll()
        // Check to see if the browser supports the basic APIs Shaka needs.
        if (shaka.Player.isBrowserSupported()) {
          // Everything looks good!
          self.initPlayer()
        } else {
          // This browser does not have the minimum set of APIs we need.
          console.error('Browser not supported!')
        }
        //self.video2 && (self.video2.style.display = 'none')
        self.currentTimeValue = 0
        self.times = 0
        self.showError = false
        self.errorText = ''
        let duration = 5 * 60 * 1000;
        let d = new Date();
        let start_time = self.startTs;

        var url = `http://104.199.172.143/api/beseye/playlist?vci=${self.vcamerId}&dd=${self.dd}&start_time=${start_time}&duration=${duration}`
        var result = await self.doAjax(url)
        let params = {
          "cameraId": self.channelInfo.ivsId,
          "platform": 1, // 0 App, 1 Web
          "startTime": start_time,
          "duration": duration
        }

        // let result = await self.getBeseyePlaylistInfo(params);
        console.log(result)
        if (result.playList) {
          self.updatePlaylist(result.playList)
        }
        else{
          //self.updatePlaylist([media1, media2, media3, media4])
        }
      },
      async doAjax(url) {
        var result = await $.ajax({
          url: url,
          type: 'GET',
          headers: {Accept: "application/json",  },
        });
        console.log(result)
        //	return result;
        return JSON.parse(`${result}`);
      },
      async getBeseyePlaylistInfo(params){
        return new Promise((resolve,reject)=>{
          getPlaylistInfo(params).then(response => {
            console.log(response)
            if (response) {
              resolve(response);
            }
          }).catch(err => {
            console.log(err)
            reject()
          });
        })
      },
      initPlayer() {
        let self = this;
        // Create a Player instance.
        self.video1.style.display = 'block';
        self.video2.style.display = 'none';
        self.player1 = new shaka.Player(self.video1);
        self.player2 = new shaka.Player(self.video2);
        self.player1.video = self.video1
        self.player2.video = self.video2
        self.player1.shouldPlay = false
        self.player2.shouldPlay = false
        self.player1.firstPlay = false
        self.player2.firstPlay = false
        self.players = {mainPlayer: self.player1, preloadPlayer: self.player2}
        self.setupPlayerEventListeners()
        self.setupVideoEventListeners()
      },

      setupPlayerEventListeners() {
        let self = this
        // shaka player events: [error]
        self.player1.addEventListener('error', self.onPlayerError)
        self.player2.addEventListener('error', self.onPlayerError)
      },

      setupVideoEventListeners() {
        let self = this;
        // video events: [play,canplay,emptied,ended,error...]
        console.log(self.player1)
        self.player1.video.addEventListener('play', self.onVideoPlay.bind(self.player1, self.player1))
        self.player1.video.addEventListener('ended', self.onVideoEnded.bind(self.player1, self.player1))
        self.player1.video.addEventListener('timeupdate', self.onVideoTimeUpdate.bind(self.player1, self.player1))
        self.player2.video.addEventListener('play', self.onVideoPlay.bind(self.player2, self.player2))
        self.player2.video.addEventListener('ended', self.onVideoEnded.bind(self.player2, self.player2))
        self.player2.video.addEventListener('timeupdate', self.onVideoTimeUpdate.bind(self.player2, self.player2))
      },
      //  --------------------------------------------
      //  Shaka player event
      //  --------------------------------------------
      onPlayerError(event) {
        // Extract the shaka.util.Error object from the event.
        this.onError(event.detail)
      },

      onError(error) {
        this.isLoading = false
        console.error('Error code', error.code, 'object', error,)
      },

      onPlayerLoaded(player ) {
        console.log('onPlayerLoaded', player.video)
        player.loaded = true
        player.video.play()
      },

      //  --------------------------------------------
      //  Video event
      //  --------------------------------------------
      onVideoPlay(player) {
        console.log('onVideoPlay', player.video)
        player.firstPlay = true
      },

      onVideoEnded(player) {
        let self = this;
        console.log('onVideoEnded', player.video)
        // switch player
        var mainPlayer = self.players.preloadPlayer
        var preloadPlayer = self.players.mainPlayer
        preloadPlayer.media = undefined
        preloadPlayer.ready = false
        self.players.preloadPlayer = preloadPlayer
        self.players.mainPlayer = mainPlayer
        if (mainPlayer.ready) {
          mainPlayer.video.play()
        } else {
          preloadPlayer.video.style.display = 'none'
        }
        // preload player load new streaming
        setTimeout(self.preparePreloadStreaming, 1000)
      },
      onVideoTimeUpdate(player) {
        let self = this
        if (!player.loaded) {
          return
        }
        if (player == self.players.preloadPlayer) {
          console.log('onVideoTimeUpdate')
          player.video.pause()
          player.ready = true
        } else {
          if (player.firstPlay) {
            player.firstPlay = false
            console.log('onVideoTimeUpdate main player firstPlay', player.video)
            self.showHideVideo()
            // [custom] onPlay callback should be called to change UI
          }
          if (self.isPlaying) {
            // [custom] timer callback should be called to update time
          }
        }
      },
      //  --------------------------------------------
      //   main action
      //  --------------------------------------------
      updatePlaylist(newPlaylist) {
        let self = this;
        var mainPlayer = self.players.mainPlayer
        var preloadPlayer = self.players.preloadPlayer
        if (newPlaylist.length == 0) {
          console.error('Got empty playlist')
          self.showError = true
          self.errorText = self.$t('storeMonitor.noVideoSource')
          self.video2.style.display = 'none';
          self.isLoading = false
          return
        }
        if (self.isPlaying) {
          if (self.playlist == 0 && self.checkUndefined(preloadPlayer.media)) {
            preloadPlayer.media = newPlaylist[0]
            self.preloadStreaming(preloadPlayer, newPlaylist[0].manifestUri)
            newPlaylist.shift()
          }
          self.playlist = self.playlist.concat(newPlaylist)
        } else {
          // before play
          self.isPlaying = true
          mainPlayer.ready = false
          preloadPlayer.ready = false
          for (let index = 0; index < newPlaylist.length; index++) {
            const media = newPlaylist[index];
            switch (index) {
              case 0:
                mainPlayer.media = media
                self.loadStreaming(mainPlayer, media.manifestUri)
                break;
              case 1:
                preloadPlayer.media = media
                setTimeout(() => {
                  self.preloadStreaming(preloadPlayer, media.manifestUri)
                }, 1000);
                break;
              default:
                self.playlist.push(media)
                break;
            }

          }
          // [custom] count player end time
        }
      },

      preparePreloadStreaming() {
        let self = this;
        if (self.playlist.length == 0) {
          // to-da request new playlist
          console.warn('Out of playlist')
          window.clearInterval(self.timeId)
          self.playState = false
          // self.playBackState = false
          self.isLoading = false
          self.showModelContent = false
        } else {
          var preloadPlayer = self.players.preloadPlayer
          preloadPlayer.media = self.playlist[0]
          self.preloadStreaming(preloadPlayer, self.playlist[0].manifestUri)
          self.playlist.shift()
        }
      },

      preloadStreaming(player, assetUri, startTime = null, mimeType = 'application/dash+xml') {
        let self = this
        player.shouldPlay = false
        self.loadStreaming(player, assetUri, startTime, mimeType)
      },

      loadStreaming(player, assetUri, startTime = null, mimeType = 'application/dash+xml') {
        let self = this
        console.log('loadStreaming', '\nplayer', player.video, '\nmedia:', player.media, '\nUri:', assetUri, '\nplaylist:', self.playlist)
        if (assetUri !== '') {
          player.loaded = false
          player.load(assetUri, startTime, mimeType).then(self.onPlayerLoaded.bind(player, player)).catch(self.onError)
        } else {
          // no clip
          var lastDuration = self.getPlaylistDuration()
          console.log('no clips happened', self.players, self.playlist)
          // [custom] callback to play live after lastDuration
        }

      },

      //  --------------------------------------------
      //   UI control
      //  --------------------------------------------

      showHideVideo() {
        let self = this;
        console.log('change--------------')
        self.players.mainPlayer.video.style.display = 'block'
        self.players.preloadPlayer.video.style.display = 'none'
      },


      //  --------------------------------------------
      //   helper function
      //  --------------------------------------------
      getPlaylistDuration() {
        let lastDuration = 0
        let self = this;
        for (let index = 0; index < self.playlist.length; index++) {
          const media = self.playlist[index];
          lastDuration += media.duration
        }
        if (!self.checkUndefined(self.players.preloadPlayer.media)) {
          lastDuration += self.players.preloadPlayer.media.duration
        }
        if (!self.checkUndefined(self.players.mainPlayer.media)) {
          lastDuration += self.players.mainPlayer.media.duration - self.players.mainPlayer.video.currentTime * 1000
        }
        console.log(lastDuration +  ' ----- lastDuration')
        return lastDuration
      },
      checkUndefined(x) {
        return typeof x == "undefined"
      },
      async adjustProcess(val, label){
        console.log(val);
        let self = this;
        self.curBack = label;
        let video=document.getElementById('previewVideo');
        let curTime=video.player.currentTime();
        console.log(curTime);
        let time = parseInt(self.currentTimeValue);
        console.log(self.realTimeStartTs);
        console.log(time);
        // self.startTs=self.startTs+ time;
        switch(val){
          case 0: {
            self.realTimeStartTs = self.realTimeStartTs - 10;
            if(curTime > 10){
              video.player.currentTime(curTime-10);
            }
            else{
              console.log(self.realTimeStartTs);
              self.stopAndAdjustProcessHistoryVideo();
            }
            break;
          }
          case 1: {
            self.realTimeStartTs = self.realTimeStartTs - 30;
            if(curTime > 30){
              video.player.currentTime(curTime-30);
            }
            else{
              console.log(self.realTimeStartTs);
              self.stopAndAdjustProcessHistoryVideo();
            }
            break;
          }
          case 2: {
            self.realTimeStartTs = self.realTimeStartTs - 60;
            if(curTime > 60){
              video.player.currentTime(curTime-60);
            }
            else{
              console.log(self.realTimeStartTs);
              self.stopAndAdjustProcessHistoryVideo();
            }
          }
            break;
        }
        //self.stopAndAdjustProcessHistoryVideo();
      },
      changeHistoryTime(newValue){
        console.log("curTime")
        let self = this;
        self.showError = false;
        self.currentTimeValue = 0
        if(!self.channelInfo.id || !self.channelInfo.ivsId){
          self.showError = true;
          self.errorText = self.$t('storeMonitor.lackParams')
          return;
        }
        self.times = 0;
        console.log('new:', newValue);
        console.log(self.curTime)
        self.startTs = newValue;
        if(newValue == 0){
          if(self.playState){
            self.stopPlay()
          }
          self.startPlay()
        }
        else{
          if(self.playState){
            self.stopPlay()
            self.playState = false
          }
          self.$nextTick(()=> {
            self.video2 = document.getElementById('video2')
            self.initApp()
          })
        }

      },
    },
    computed: {
      graphBtnWidth: function () {
        return this.varyWindowHeight * 0.185;
      },
      btnFontSize: function () {
        return this.varyWindowHeight * 0.022;
      },
      percentHeight: function () {
        return this.varyWindowHeight / 758;
      },
      ...mapGetters({
        accountChanged:'accountChanged'
      }),
    },
    watch: {
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.channelInfo = null
          self.showError = false
          self.errorText = ''
          if (self.playState) {
            self.stopPlay()
          }
          if(self.playBackState){
          }
        }
      },
      async storeId(newValue, oldValue) {
        console.log(newValue);
        console.log(oldValue);
        let self = this;
        self.showError = false;
        if (newValue.length > 0) {
          self.getAccessToken(newValue)
        }
      },
      'channelInfo.ivsId'(newValue, oldValue) {
        console.log(newValue);
        console.log(oldValue);
        let self = this;
        self.showError = false;
        if(!self.isStoreMonitor){
          if(self.playState){ //切换前处于播放状态
            self.stopPlay();
            self.startPlay();
          }
          else{
            self.$nextTick(()=>{
              self.startPlay(); //播放当前通道对应的视频(ivsId,channelId)
            })
          }
        }
      },
      //监听播放时间
      realTimeSpeed(val, oldVal) {
        let self = this;
        console.log(val);
        if (val >= 300) {
          //五分钟停止视频
          self.stopPlay();
          window.clearInterval(self.timerPlayReal);
          self.timerPlayReal = null;
          self.playState = false;
          self.showModelContent = false;
          self.realTimeSpeed = 0;
        }
      },
    },
    beforeDestroy() {
      let self = this;
      console.log(self.playState)
      window.clearInterval(self.timerPlayReal);
      self.realTimeSpeed = 0;
      if (self.playState) {
        self.stopPlay();
      }
      window.removeEventListener("visibilitychange", self.visibleChange)
      self.visibleChange = null;
    },
    mounted() {
      let self = this;
      self.beseyeVideo = document.getElementById('beseyeVideo')
      self.video1 = document.getElementById('video1')
      self.video2 = document.getElementById('video2')
      window.addEventListener("visibilitychange", self.visibleChange, false)
    }
  }
</script>

<style lang="scss" scoped>
  $red: #f31d65;
  $black: #182752;
  $border: #e3e9f4;
  $background: #f4f5f9;
  $tab: #7d8cad;
  $h1: #292e36;
  @function rem($val) {
    @return $val/16+rem;
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

  @mixin point($poi,$val) {
    #{$poi}: checkRem($val);
  }

  .errorVideo-model {
    @include point(margin, 20);
    margin-bottom: 0;
    height: auto;
    position: relative;
    min-height: 420px;
    background-color: #232730;
    color: $red;
    z-index: 100;
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 12px;
      transform: translate(-50%, -50%);
    }
  }

  .event-error {
    @include point(margin-bottom, 20);
  }

  #cancelBtn {
    @include point(width, 76);
    @include point(margin-right, 20);
    background-color: #EAEDF2 !important;
    color: #708090 !important;
    font-size: 12px;
    line-height: 12px;
  }

  #confirmBtn {
    @include point(width, 76);
    // margin-right: 15px;
    @include point(margin-right, 20);
    font-size: 12px;
    line-height: 12px;
  }

  .video-model {
    height: 100%;
    width: 100%;
    background-color: transparent;
    position: absolute;
    z-index: 900;
    text-align: left;
  }

  .video-content {
    height: auto;
    position: relative;
    margin: calc(25 / 1920 * 100vw);
    min-height: 420px;
    background-color: #000;
    z-index: 100;
    .getvideo-content {
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
    @media screen and(max-width: 1366px) {
      #channelName {
        font-size: 12px;
      }
      .iconright {
        span {
          font-size: 12px;
        }
      }
      .en-iconright {
        span {
          font-size: 12px;
        }
      }
      .iconright1 {
        span {
          font-size: 12px;
        }
      }
      .en-iconright1 {
        span {
          font-size: 12px;
        }
      }
    }
    @media screen and(min-width: 1366px) {
      #channelName {
        font-size: 16px;
      }
      .iconright {
        span {
          font-size: 14px;
        }
      }
      .en-iconright {
        span {
          font-size: 14px;
        }
      }
      .iconright1 {
        span {
          font-size: 14px;
        }
      }
      .en-iconright1 {
        span {
          font-size: 14px;
        }
      }
    }
    #myPlayer {
      min-height: 420px;
    }
    #channelName {
      position: absolute;
      color: #fff;
      z-index: 10;
      display: block;
      width: -webkit-calc(100% - 30px);
      width: -moz-calc(100% - 30px);
      width: calc(100% - 30px);
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding-left: 30px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
    }
    .icon-footer {
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
      .iconlside {
        float: left;
        text-align: left;
        margin-left: 30px;
        .iconplay {
          font-size: 18px;
          cursor: pointer;
          float: left;
        }
        .icon-auido {
          font-size: 18px;
          cursor: pointer;
          float: left;
        }
      }
      // @media screen and(min-width:1366px){
      //   .iconrside{
      //     width: 40%;
      //   }
      // }
      // @media screen and(min-width:1366px){
      //   .iconrside{
      //     width: 40%;
      //   }
      // }
      .footer-right {
        float: right;
      }
      .iconrside {
        // max-width: 230px;
        display: inline-block;
        margin-right: 20px;
        float: right;
        span {
          font-size: 13px;
          margin-right: 6px;
          // margin-left: 20px;
        }
        .speed-content {
          height: 46px;
          bottom: 3px;
          position: relative;
          display: inline-block;
          .el-test {
            width: 85px;
          }
        }
      }
    }
    .screen-content {
      display: inline-block;
      float: right;
      .iconscreen {
        margin-right: 20px;
        font-size: 18px;
        // position: relative;
        cursor: pointer;
      }
    }
    .iconright {
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
      span {
        // font-size: 12px;
        margin-left: 12px;
        color: #fff;
        /*margin-right: 35px;*/
        cursor: pointer;
        vertical-align: middle;
      }
      .iconpaizhao {
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .en-iconright {
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
      span {
        // font-size: 12px;
        margin-left: 12px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
      .iconpaizhao {
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .iconright1 {
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
      span {
        margin-left: 12px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
      .iconpaizhao {
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .en-iconright1 {
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
      span {
        margin-left: 12px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
      .iconpaizhao {
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .progress-content {
      position: absolute;
      bottom: 0px;
      width: 100%;
      z-index: 999;
      .prog {
        float: left;
        width: 100%;
        .progress-bar {
          background-color: $red;
          height: 100% !important;
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
  }

  .canvas-content {
    position: relative;
    .rules {
      margin-left: 20px;
      font-size: 10px;
      margin-top: 5px;
      color: #ff2400;
      display: block;
    }
    .dialog-hr {
      border: 0.5px solid;
      border-color: #dfe2e9;
      margin-bottom: 0px;
      position: relative;
      bottom: 5px;
    }
    #icanvas {
      @include point(margin-top, 15);
    }
    .dialog-img-content {
      @include point(padding, 15);
    }
    .dialog-event-content {
      text-align: left;
      @include point(margin-bottom, 20);
      .event-title {
        color: $black;
        display: block;
        margin: 15px;
        @include point(margin-left, 20);
        font-size: 14px;
      }
      .name-input {
        @include point(width, 150);
        @include point(margin-left, 20);
      }
      .des-input {
        width: 90%;
        @include point(margin-left, 20);
      }
    }
    .feed-canvas-content {
      width: 65%;
      float: left;
      position: relative;
      text-align: left;
      margin-left: 1%;
      #icanvas {
        margin-left: 20px;
      }
      .cancel-content {
        margin-left: 20px !important;
        height: 30px;
        line-height: 30px;
      }
    }
    .event-content {
      width: 33%;
      float: left;
      text-align: left;
      margin-left: 1%;
      .event-title {
        color: $black;
        display: block;
        margin: 15px;
        margin-left: 0;
        font-size: 14px;
      }
      .is-required {
        color: $red;
      }
      .error-class {
        font-size: 10px;
        margin-top: 5px;
        color: #ff2400;
        display: block;
      }
      .name-input {
        width: 80%;
        //@include point(width,150);
        //@include point(margin-bottom,15);
      }
      .des-input {
        width: 80%;
      }
    }
    #previewCutVideo {
      @include point(margin-bottom, 20);
      @include point(margin-top, 10);
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
        text-align: center;
        float: left;
        color: #fff;
        cursor: pointer;
        width: 49%;
        &:first-child {
          border-right: 1px solid #fff;
        }
        .icon-clear {
          position: relative;
          @include point(top, 3);
          margin-right: 15px;
        }
        @media screen and(max-width: 1366px) {
          span {
            position: relative;
            @include point(bottom, 4)
          }
        }

      }
    }
    .icon-right {
      width: 120px;
      height: auto;
      position: absolute;
      right: 30px;
      top: 5%;
      text-align: center;
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
          left: 34%;
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
          left: 34%;
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
</style>
<style>
  .select-popClass .el-select-dropdown__item {
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    background-color: #34374A;
    color: #fff;
    text-align: center;
  }

  .select-popClass .el-select-dropdown__item.hover {
    color: #f31d65 !important;
    background-color: #34374A !important;
  }

  .select-popClass .el-select-dropdown__item:hover {
    color: #f31d65 !important;
    background-color: #34374A !important;
  }

  .select-popClass .el-select-dropdown {
    border: 0px !important;
    background-color: #34374A !important;
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
    margin-top: -5px;
  }

  .select-popClass.el-popper[x-placement^=bottom] .popper__arrow {
    border-bottom-color: #34374A !important;
  }

  .select-popClass.el-popper[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #34374A !important;
  }

  .prog .progress-bar {
    background-color: #FB4C5D;
    height: 100%;
  }

  #videoContent .el-loading-mask {
    z-index: 900
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
  }
  .select-popClass.el-popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color:#34374A !important;
  }
  .select-popClass.el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:#34374A !important;
  }
</style>
