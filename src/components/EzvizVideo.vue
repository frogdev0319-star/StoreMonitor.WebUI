<template>
  <div >
    <div class="errorVideo-model" v-if="showError" :class="isEvent? 'event-error': ''">
      <span>{{errorMsg}}</span>
    </div>
    <div v-else>
      <div class="video-content"  id="videoContent" ref="videoContent" :style="isEvent?{}: {'margin-bottom': 0}"
           @mouseleave="hiddenModel" @mouseenter="showModel" @mousemove="showModel" v-if="!fullWindow"
           v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <!-- 录像时的动画 -->
        <div class="getvideo-content" v-if="showGetVideo">
          <div class="btn-graph">
            <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"></canvas>
          </div>
          <canvas id="vcanvas"  :width="varyWindowWidth*0.48+'px'" :height="varyWindowWidth*0.28+'px'"></canvas>
          <img :src="imgSrc" id="imgTest" :width="varyWindowWidth*0.48+'px'" :height="varyWindowWidth*0.28+'px'" style="display: none"/>
        </div>
        <span id="channelName" v-if="showInfoContent">{{channelName}}</span>
        <div class="icon-footer" v-if="showInfoContent|| playBackState">
          <div class="iconlside">
            <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-if="playState"></i>
            <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-else></i>
          </div>
          <div class="iconlside">
            <i class="iconfont icon-auido icon-shengyin1" @click="closeSound" v-if="ifOpenSound"></i>
            <i class="iconfont icon-auido icon-jingyin " @click="openSound" v-else></i>
          </div>
          <div class="iconrside">
            <div class="speed-content" v-if="playBackState">
              <span>{{$t('storeMonitor.back')}}</span>
              <el-select class="el-test" size="mini" :value="curBack" :popper-class="popperClass"  placeholder='' :popper-append-to-body="false">
                <el-option
                  v-for="(item) in backList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click.native="adjustProcess(item.value, item.label)"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="screen-content">
            <i class="iconfont iconscreen"
               :class="fullWindow ? 'icon-tuichuquanping':'icon-quanping'"  @click="controlScreen"></i>
            <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
          </div>
        </div>
        <div class="progress-content" v-if="playBackState">
          <b-progress id="bprogress" :value="currentTimeValue" :max="durationTimeValue" class="mb-3 prog" height="0.2rem"></b-progress>
        </div>
        <transition name='fade'>
          <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showModelContent && !isEvent" @click="cutPicture">
            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
            <span>{{generatePatrolLang('snapshot')}}</span>
          </div>
        </transition>
        <transition name="fade">
          <div :class="lang== 'en'? 'en-iconright1' : 'iconright1'" v-if="showModelContent && !isEvent" @click="getVideo" style="display: none">
            <i class="iconfont icon-luxiang iconpaizhao" v-if="lang =='en' " style="font-size:21px;"></i>
            <i class="iconfont icon-luxiang iconpaizhao" v-else style="font-size:21px"></i>
            <span>{{generatePatrolLang('record')}}</span>
          </div>
        </transition>
        <div id="myPlayer" ref="myPlayer"></div>
      </div>
      <!-- 全屏时 -->
      <div class="video-content"  id="videoContent" ref="videoContent"
           @mouseleave="hiddenModel" @mouseenter="showModel" @mousemove="showModel"  v-else
           v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="video-model">
          <span id="channelName" v-if="showInfoContent">{{channelName}}</span>
          <div class="icon-footer" v-if="showInfoContent">
            <div class="iconlside">
              <i class="iconfont icon-bofang1 iconplay" @click="realTime" v-if="!playState"></i>
              <i class="iconfont icon-zantingtingzhi iconplay" @click="stopRealTime" v-else></i>
            </div>
            <div class="iconlside">
              <i class="iconfont icon-auido icon-shengyin1" @click="closeSound" v-if="ifOpenSound"></i>
              <i class="iconfont icon-auido icon-jingyin " @click="openSound" v-else></i>
            </div>
            <div class="iconrside">
              <div class="speed-content" v-if="playBackState">
                <span>{{$t('storeMonitor.back')}}</span>
                <el-select class="el-test" size="mini" :value="curBack" :popper-class="popperClass" placeholder='' :popper-append-to-body="false">
                  <el-option
                    v-for="(item) in backList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    @click.native="adjustProcess(item.value, item.label)"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="screen-content">
              <i class="iconfont iconscreen"
                 :class="fullWindow ? 'icon-tuichuquanping':'icon-quanping'"  @click="controlScreen"></i>
              <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
            </div>
          </div>
          <div class="progress-content" v-if="playBackState">
            <b-progress id="bprogress" :value="currentTimeValue" :max="durationTimeValue" class="mb-3 prog" height="0.2rem" style="margin-bottom:0px !important;"/>
          </div>
        </div>

        <transition name='fade'>
          <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showModelContent && !isEvent" @click="cutPicture">
            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
            <span>{{generatePatrolLang('snapshot')}}</span>
          </div>
        </transition>
        <transition name="fade">
          <div :class="lang== 'en'? 'en-iconright1' : 'iconright1'" v-if="showModelContent && !isEvent" @click="getVideo" style="display:none;">
            <i class="iconfont icon-luxiang iconpaizhao" v-if="lang =='en' " style="font-size:21px;"></i>
            <i class="iconfont icon-luxiang iconpaizhao" v-else style="font-size:21px"></i>
            <span>{{generatePatrolLang('record')}}</span>
          </div>
        </transition>
        <div id="fullPlayer" ref="myPlayer"></div>
      </div>
    </div>

    <el-dialog :title="generatePatrolLang('edit')"
               :visible.sync="showCutDialog" :close-on-click-modal="false" v-if="showCutDialog" :width="860*percentHeight+'px'" height=300px top=5%>
      <div class="canvas-content" @mouseenter="showCancel" @mouseleave="hiddenCancel" @mouseup="mouseUpHandler" >
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
        <canvas id="icanvas"  :width="767*percentHeight" :height="431*percentHeight" @mousedown="mouseDownAction($event)"
                @mousemove="mouseMoveAction($event)" @mouseleave="mouseLeaveAction($event)"></canvas>
        <img :src="imgSrc" id="imgTest" style="display: none"/>
        <div class="cancel-content" v-if="showCancelContent" :style="{'width':767*percentHeight+'px',
                    'margin-left':47*percentHeight+'px'}">
          <div class="content" @click="cancelEditCanvas">
            <img :src="clearIconSrc" class="icon-clear" height="22px"/>
            <span>{{generatePatrolLang('clear')}}</span>
          </div>
          <div class="content" @click="confirmEditCanvas">
            <img :src="removeIconSrc" class="icon-clear" height="22px"/>
            <span>{{generatePatrolLang('cancel')}}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title= "generatePatrolLang('feedbacks')"
               :visible.sync="showFeedDialog2" :close-on-click-modal="false" v-if="showFeedDialog2" :width="860*percentHeight+'px'" height=300px top=5%>
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
          <canvas id="icanvas"  :width="520*percentHeight" :height="340*percentHeight" @mousedown="mouseDownAction($event)" @mouseup="mouseUpHandler"
                  @mousemove="mouseMoveAction($event)" @mouseleave="mouseLeaveAction($event)"></canvas>
          <img :src="imgSrc" id="imgTest" style="display: none"/>
          <div class="cancel-content" v-if="showCancelContent" :style="{'width':520*percentHeight+'px',
                        'margin-left':47*percentHeight+'px'}">
            <div class="content" @click="cancelEditCanvas">
              <img :src="clearIconSrc" class="icon-clear" height="22px"/>
              <span>{{generatePatrolLang('clear')}}</span>
            </div>
            <div class="content" @click="confirmEditCanvas">
              <img :src="removeIconSrc" class="icon-clear" height="22px"/>
              <span>{{generatePatrolLang('cancel')}}</span>
            </div>
          </div>
        </div>
        <div class="event-content">
          <span class="event-title"><span class="is-required">*</span>{{generatePatrolLang('name')}}</span>
          <el-input size="mini" class="name-input" v-model="eventName" @input="eventNameChanged"></el-input>
          <span class="error-class" v-if="showEventNameInfo">{{$t('storeMonitor.emptyTitle')}}</span>
          <span class="event-title">{{generatePatrolLang('description')}}</span>
          <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 4, maxRows:7}"
                    @input="eventDesChanged" v-model="eventDes" :placeholder="generatePatrolLang('descPlaceholder')"></el-input>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showFeedDialog2 = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmAddFeedBack2" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog  :title="$t('storeMonitor.enterPassword')"
                :visible.sync="showInputPassword" v-if="showInputPassword"
                :append-to-body='true'
                :close-on-click-modal="false"
                @close='closeDialog'
                width="28%"
                top="35vh"
                left="40vh">
      <div class="dialog-content" style="overflow:hidden;width:100%;">
        <hr style="border: 0.5px solid #dfe2e9;"/>
        <div style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
          <p>{{$t("storeMonitor.contactInfo") }}</p>
          <el-input :placeholder="$t('storeMonitor.enterPassword')" v-model="videoPassword" show-password size="mini"></el-input>
          <p>{{$t("storeMonitor.initialCode") }}</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" @click="cancelEnterPassword" size="mini" style="">{{$t('storeMonitor.cancel')}}</el-button>
        <el-button class="file-confirm-btn" @click="verifyEnterPassword" size="mini" type="primary">{{$t('storeMonitor.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="generatePatrolLang('feedbacks')"
               :visible.sync="showFeedDialog3" :close-on-click-modal="false" v-if="showFeedDialog3" :width="860*percentHeight+'px'" height=300px top=5%>
      <div class="canvas-content" style="overflow:hidden;">
        <hr class="dialog-hr"/>
        <div class="feed-canvas-content" style="text-align:center">
          <video  :width="520*percentHeight" :height="340*percentHeight" id="previewCutVideo" prload controls autoplay :src="feedBackVideoFileObj.src"></video>
        </div>
        <div class="event-content">
          <span class="event-title">{{generatePatrolLang('name')}}</span>
          <el-input size="mini" class="name-input" maxlength="10" v-model="eventName"></el-input>
          <span class="event-title">{{generatePatrolLang('description')}}</span>
          <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 4}"
                    maxlength="300" v-model="eventDes" :placeholder="generatePatrolLang('descPlaceholder')"></el-input>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showFeedDialog3 = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmAddFeedBack3" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import  EZUIKit from '../../static/ezuikit/ezuikit.js'
  import {getEzvizAccessToken, getIsEncrypt, updateDevicePassword,getDeviceCapacity} from '@/api/ezviz'
  import {generatePatrolLang} from '@/api/i18n'
  import {mapGetters} from 'vuex'
  import qs from 'qs'
  import {getCookie} from "../common/auth";
  import RecordRTC from '../../static/RecordRTC.js'
  import filterString from "../common/filterString";

  export default {
    name: "EzvizVideo",
    props:{
      channelInfo:{
        type: Object,
      },
      curDeviceId: {
        type: Number,
        default: -1
      },
      sourceListLength:{
        type: Number,
        default: 0
      },
      showFeedBack: {
        type: Boolean
      },
      isEvent:{
        type:Boolean
      },
      isStoreMonitor:{
        type:Boolean
      },
      playBack:{
        type:Boolean,
        default: false
      },
      curTime:{
        type: Number
      },
      storeId:{
        type: String,
        default: ''
      }
    },
    data(){
      return{
        clearIconSrc:require('../../static/img/清除.png'),
        removeIconSrc:require('../../static/img/撤销.png'),
        penBtnSrc:require('../../static/img/pen_btn.png'),
        videoUrl: '',
        accessToken : '',
        showError: false,
        errorMsg: '',
        varyWindowHeight:window.innerHeight,
        varyWindowWidth:window.innerWidth,
        showInfoContent: true,
        playState: false,
        fullWindow: false,
        showModelContent: false,
        showGetVideo: false,
        lang: this.$i18n.locale,
        decoder: null,
        fullDecoder: null,
        videoSpeed:0,
        videoSpeedId: 0,
        showgongge: false,
        ifOpenSound: false,
        showCutDialog:false,
        imageCanvas:new Image(),
        imageCanvasList:[],
        penList:[
          {
            id:'white',
            showContent:false
          },
          {
            id:'red',
            showContent:true
          },
          {
            id:'yellow',
            showContent:false
          }
        ],
        penChecked:'red',
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
        showFeedDialog2:false,
        showFeedDialog3: false,
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
        popperClass:'select-popClass',
        startTime: 0,
        endTime : 0,
        times: 0,
        showBackState: false,
        playBackState: false,
        startTs: 0, //保存视频播放过程中的变化毫秒数
        clickSnapshot: false,
        showInputPassword: false,
        videoPassword: '', //加密视频的密码
        userId: '',
        startTimeCutVideo:0,
        endTImeCutVideo:0,
        isREC:false,
        recorder: null,
        isRecordingStarted: false,
        isStoppedRecording: true,
        blob: null,
        ezvizExpireTime: 0,
        currentStoreId: null,
        isLoaded: false,
        editCount: 0,
        showEventNameInfo: false,
        changeId: false
      }
    },
    async mounted(){
      let self=this;
      console.log(self.storeId)
      console.log(self.accessToken)
      if(!self.isStoreMonitor){
        let result = await self.getEzvizAccessToken(self.storeId);
        self.checkIfEncry();
      }
      else{

      }
      window.addEventListener("resize", self.resizeFun, false);
      /**
       * 远程巡检，门店监控页面在页面离开的时候需暂停实时视频的播放，进入的时候重新调用api.
       */
      window.addEventListener("visibilitychange",self.visibleChange, false)
    },

    beforeDestroy() {
      let self = this;
      console.log(self.playState)
      window.clearInterval(self.timerPlayReal);
      self.realTimeSpeed = 0;
      if(self.playState){
        self.decoder.closeSound();
        self.decoder.stop();
      }
      // 清除增加屏幕大小变化时的监听器
      window.removeEventListener('resize', self.resizeFun);
      window.removeEventListener("visibilitychange",self.visibleChange)
      self.resizeFun = null;
      self.visibleChange = null;
    },
    watch: {
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.channelInfo = null
          self.stopVideo();
        }
      },
      showFeedBack(newValue, old){
        console.log(newValue + 'showFeedBack')
      },
      showFeedDialog2(newValue, old){
        console.log(newValue + 'showFeedDialog2')
      },
      stopVideoTime(val, oldVal){
        console.log('触发定时器停止')
        let self = this;
        window.clearInterval(self.timerPlayReal)
        self.realTimeSpeed = 0;
        self.stopVideoTime = false;
        self.timerPlayReal = null;
        if (self.playState) {
          self.timerPlayReal = window.setInterval(() => {
            console.log(self.realTimeSpeed)
            self.realTimeSpeed = self.realTimeSpeed + 1;
            console.log(self.realTimeSpeed)
          }, 1000);
        }

      },
      //监听父组件的数值变化
      realTimeSpeed(val,oldVal){
        let self=this;
        console.log(val);
        if(val>=300){
          //五分钟停止视频
          if(self.fullWindow){
            if(self.ifOpenSound){
              self.fullDecoder.closeSound();
            }
            self.fullDecoder.stop();
          }
          else{
            if(self.ifOpenSound){
              self.decoder.closeSound();
            }
            self.decoder.stop();
          }
          window.clearInterval(self.timerPlayReal);
          self.timerPlayReal=null;
          self.playState = false;
          self.showModelContent = false;
          self.ifOpenSound = false;
          self.times = 0;
          self.playBackState = false;
        }
      },
      // curTime(newValue, oldValue){
      //   console.log("curTime")
      //   let self = this;
      //   if(!self.id || !self.ivsId){
      //     self.showError = true;
      //     self.errorMsg = self.$t('storeMonitor.lackParams')
      //     return;
      //   }
      //   self.showError = false;
      //   self.times = 0;
      //   console.log('new:', newValue);
      //   console.log(self.curTime)
      //   self.startTs = newValue;
      //   if(self.playState){
      //     self.decoder.stop();
      //     self.playState = false
      //   }
      //   self.$nextTick(()=> {
      //     self.decoder = null;
      //     console.log(self.$refs.myPlayer)
      //     //self.initVideo();
      //     self.checkIfEncry();
      //   })
      // },
      async storeId(newValue, oldValue){
        console.log(newValue);
        console.log(oldValue);
        let self = this;
        if(newValue.length > 0){
          await self.getEzvizAccessToken(newValue)
        }
      },
      async id(newValue, old) {
        let self = this;
        console.log("id")
        console.log(newValue)
        console.log(old)
        self.videoPassword = '';
        if(newValue == undefined){
          return false;
        }
        //stop video
        self.stopRealTime();
        //首先查看视频是否加密
        await self.getEzvizAccessToken(self.storeId);
        if(newValue!== null && old != undefined ){
          self.changeId = true;
          await self.checkIfEncry();
        }
      },
    },
    computed:{
      graphBtnWidth:function(){
        return this.varyWindowHeight*0.185;
      },
      btnFontSize:function(){
        return this.varyWindowHeight*0.022;
      },
      percentHeight:function(){
        return this.varyWindowHeight/758;
      },
      id(){
        if(this.channelInfo != null){
          return this.channelInfo.id;
        }
        else{
          return 0;
        }
      },
      //监听父组件的数值变化
      channelId() {
        if(this.channelInfo != null){
          return this.channelInfo.channelId;
        }
        else{
          return 0;
        }
      },
      channelName(){
        if(this.channelInfo != null){
          return this.channelInfo.channelName;
        }
        else{
          return '';
        }
      },
      ivsId(){
        if(this.channelInfo != null){
          return this.channelInfo.ivsId;
        }
        else{
          return 0;
        }
      },
      ...mapGetters({
        accountChanged:'accountChanged'
      }),
      isEzviz() {
        let self = this;
        console.log(self.$store.state.user);
        return self.$store.state.user.isEzviz
      }
    },
    methods: {
      generatePatrolLang,
      changeHistoryTime(newValue,flag){
        console.log("curTime")
        let self = this;
        if(!self.id || !self.ivsId){
          self.showError = true;
          self.errorMsg = self.$t('storeMonitor.lackParams')
          return;
        }
        self.showError = false;
        self.times = 0;
        console.log('new:', newValue);
        console.log(self.curTime)
        self.startTs = newValue;
        if(newValue == 0){
          self.playBack =  false;
        }
        if(self.playState){
          self.decoder.stop();
          self.playState = false
        }
        if(flag == false){
          self.$nextTick(()=> {
            self.decoder = null;
            console.log(self.$refs.myPlayer)
            //self.initVideo();
            self.checkIfEncry();
          })
        }
      },
      visibleChange(){
        console.log('子组件退出')
        let self = this;
        if(document.hidden){
          if(self.playState){
            self.decoder.stop(); //停止视频
            //window.clearInterval(self.timerPlayReal);
          }
        }
        else{
          console.log(self.playState);
          if(self.playState){
            self.realTime()
          }
        }
      },
      resizeFun(){
        let self = this;
        console.log('屏幕大小变化');
        if(!self.checkFull() && self.fullWindow){
          console.log('退出全屏1111');
          self.fullWindow=false;
          var playerEle =  self.$refs.myPlayer;
          playerEle.style.width = self.initPlayerWidth + 'px'; //动态设置HTML元素高度
          playerEle.style.height = self.initPlayerHeight + 'px';
          self.exitFullscreen()
        }
      },
      getEzvizAccessToken(storeId){
        let self=this;
        let params = {};
        params.storeId = storeId;
        return new Promise((resolve,reject)=>{
          if(self.currentStoreId == storeId && (Date.parse(new Date()) < self.ezvizExpireTime)){
            resolve(self.accessToken);
          }else{
            getEzvizAccessToken(params)
              .then(result => {
                self.currentStoreId = storeId;
                self.accessToken = result.data.accessToken;
                //self.accessToken = 'at.1zxfxzy03nm6ld1t1s5s3es203455czn-45ft0jzwlk-06lc2eq-7rzulbgak';
                self.ezvizExpireTime = result.data.expireTime;
                resolve(result.data.accessToken);
              })
              .catch(error => {
                reject();
              })
          }
        })
      },
      async checkIfEncry(){
        let self = this;
        let obj={};
        console.log(self.accessToken)
        obj.accessToken= self.accessToken;// token
        if(self.ivsId == 0){
          return;
        }
        obj.deviceSerial = self.ivsId; //设备序列号
        let result = await self.getDeviceIsEncrypt(qs.stringify(obj));
        console.log(result);
        let suportUpdatePass = false;
        if(result == 1){
          suportUpdatePass = await getDeviceCapacity(qs.stringify(obj));
        }
        console.log(suportUpdatePass)
        if(result == 1){
          if( suportUpdatePass ){
            //已加密设备先从缓存中查看是否已经有验证码，有验证码直接取出，没有验证码要弹出对话框
            let deviceObj = {};
            deviceObj.deviceSerial = self.ivsId;
            deviceObj.channelId = self.channelId;
            let result = self.getDeviceValidateCode(deviceObj);
            console.log('从缓存中取得的验证码' + result)
            if(result.length > 0){
              self.videoPassword = result;
              self.verifyEnterPassword(); //验证密码是否正确
            }
            else{
              //不存在密码
              self.isLoading = false;
              self.showError = true;
              self.errorMsg = self.$t('storeMonitor.videoEncrypted');
              self.showInputPassword = true;
            }
          }
          else{
            //不支持修改密码
            self.isLoading = false;
            self.showError = true;
            self.errorMsg = self.$t('storeMonitor.videoCannotPlay');
          }
        }
        else{
          self.showError = false;
          self.videoPassword = '';
          self.times = 0;
          self.ifIsEncrypt = false
          self.changeId && (self.startTs = self.curTime); //切换通道，仍然从最初的时间播放视频
          if(self.playState) {
            self.decoder.stop();
            self.playState = false
          }
          self.$nextTick(()=> {
            self.decoder = null;
            console.log(self.$refs.myPlayer)
            if(self.fullWindow){
              self.initFullWindowVideo()
            }
            else{
              self.initVideo();
            }
          })
        }
      },
      /**
       * 获取当前设备是否加密
       * @returns {Promise<any>}
       */
      async getDeviceIsEncrypt(params){
        let self = this;
        console.log(params);
        const ret = await getIsEncrypt(params);
        console.log(ret)
        return ret;
      },
      async initVideo() {
        let self = this
        console.log("调用初始化方法")
        //调用密码设置方法
        console.log(self.playBack)
        self.showModelContent=false;
        if(self.channelInfo==null){
          return;
        }
        if(self.channelInfo.channelId == undefined){
          return;
        }
        else{
          self.isLoading = true;
          let o = self.$refs.myPlayer;
          let width = o.offsetWidth;
          let height = o.offsetHeight;
          self.initPlayerWidth = width;
          self.initPlayerHeight = height;
          console.log(width);
          console.log(height)
          if(self.playBack){
            self.startTime = Number(self.$moment(self.startTs).format('YYYYMMDDHHmmss'));
            self.endTime = Number(self.$moment(self.startTs).add(5,'m').format('YYYYMMDDHHmmss')); //五分钟视频
            console.log('历史视频')
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('加入验证码历史视频' + self.videoUrl)
            }
            else {
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('历史视频' + self.videoUrl)
            }
          }
          else{
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
              console.log('加入验证码实时视频' + self.videoUrl)
            }
            else{
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
            }
          }
          console.log(self.videoUrl);
          if(self.accessToken == ''){
            self.notify(self.$t('storeMonitor.getAccessTokenError'), 'warning',3000)
            return;
          }

          // 初始化视频方法
          self.decoder = new EZUIKit.EZUIPlayer({
            id: 'myPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            //decoderPath: '../../static/ezuikit/',
            decoderPath: './static/ezuikit/',
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess,
          })
        }

      },
      handleError(e){
        console.log('捕获到错误',e)
        console.log(e.msg)
        let self = this;
        self.isLoading = false;
        // self.errorMsg = e.msg;
        self.showError = true;
        let retcode = e.retcode;
        self.errorMsg = self.getErrorMsg(e);
        if(self.playState){
          if(!self.fullWindow){
            if(self.ifOpenSound){
              self.decoder.closeSound()
            }
            self.decoder.stop();
          }
          else{
            if(self.ifOpenSound){
              self.fullDecoder.closeSound()
            }
            self.fullDecoder.stop();
          }
        }
        else{
          self.decoder.stop();
        }
        self.playState = false;
        self.ifOpenSound = false;
        self.realTimeSpeed=0;
        self.times = 0;
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal = null
        if(self.playBack){
          self.playBackState = false;
        }
      },
      getErrorMsg(err){
        let self = this;
        let retcode = err.code ;
        if(!retcode){
          retcode = err.retcode;
        }
        let msg = '';
        switch (retcode) {
          case '10001':{
            msg = self.$t('storeMonitor.partolError');
            break;
          }
          case '10002':{
            msg = self.$t('storeMonitor.accessTokenError');
            break;
          }
          case '10026':{
            msg = self.$t('storeMonitor.maxDeviceNum');
            break;
          }
          case '20018':{
            msg = self.$t('storeMonitor.noDevice');
            break;
          }
          case 9048:{
            msg = self.$t('storeMonitor.maxConcurrency');
            break;
          }
          case 5451:{
            msg = self.$t('storeMonitor.deviceOffline');
            break;
          }
          case 5402:{
            msg = self.$t('storeMonitor.noHistoryVideo');
            break;
          }
          case 5544:{
            msg = self.$t('storeMonitor.noVideoSource');
            break;
          }
          default:{
            msg = err.msg;
            break;
          }
        }
        return msg;
      },
      handleSuccess(){
        console.log("播放成功回调函数，此处可执行播放成功后续动作");
        let self = this;
        self.editCount ++;
        self.showError = false;
        self.errorMsg = '';
        self.realTimeSpeed=0;
        //关闭声音
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal=window.setInterval(()=>{
          console.log(self.realTimeSpeed)
          self.realTimeSpeed=self.realTimeSpeed+1;
          if(self.playBack){
            self.getProcess();
          }
        },1000);
        setTimeout(() => {
          self.playState = true;
          self.isLoading = false;
          self.showModelContent=true;
          //self.showInfoContent=false;
          // self.ifOpenSound = false;
          if(self.fullWindow){
            if(self.ifOpenSound){
              self.fullDecoder.openSound()
            }
          }
          else{
            if(self.ifOpenSound){
              self.decoder.openSound()
            }
          }
          if(self.playBack){
            self.playBackState = true;
          }
          else{
            self.times = 0;
            self.playBackState = false;
          }
        }, 2000);
      },

      handleFullWindowSuccess(){
        console.log("全屏播放成功回调函数，此处可执行播放成功后续动作");
        let self = this;
        self.editCount ++;
        // self.playState = true;
        self.showError = false;
        self.errorMsg = '';
        //非全屏时播放，全屏时也播放，同时定时器继续定时
        if(self.playState){
          self.realTimeSpeed=self.realTimeSpeed+1;
          console.log(self.realTimeSpeed)
          if(self.playBack){
            self.getProcess();
          }
        }

        setTimeout(() => {
          self.showModelContent=true;
          //self.showInfoContent=false;
          self.isLoading = false;
          if(self.ifOpenSound){
            self.fullDecoder.openSound()
          }
          //self.ifOpenSound = false
        }, 2000);
      },
      handleExitFullScreenSuccess(){
        console.log("退出全屏播放成功回调函数，此处可执行播放成功后续动作");

        let self = this;
        self.showError = false;
        self.errorMsg = '';
        if(self.clickSnapshot){
          //self.stopRealTime()
          self.isLoading = false;
          self.showModelContent=false;
        }
        //全屏时播放，非全屏时也播放，同时定时器继续定时
        if(self.playState){
          self.realTimeSpeed=self.realTimeSpeed+1;
          console.log(self.realTimeSpeed)
          if(self.playBack){
            self.getProcess()
          }
        }

        setTimeout(() => {
          self.isLoading = false;
          self.showModelContent=true;
          //self.showInfoContent=false;
          if(self.ifOpenSound){
            self.decoder.openSound()
          }
        }, 2000);
      },
      controlScreen(){
        let self=this;
        if(!self.fullWindow){
          self.fullWindowScreen();
          setTimeout(() => {
            self.showModelContent=false;
            //self.showInfoContent=false;
          }, 3000);
        }
        else{
          self.exitFullscreen();
          self.fullWindow=false;
        }
      },
      //进入全屏
      fullWindowScreen(...val) {
        console.log(val);
        let self=this;
        self.fullWindow = true;
        var ele = document.getElementById('videoContent');
        ele.style.width = "100%";
        ele.style.height = "100%";
        let width = self.varyWindowWidth;
        let height = self.varyWindowHeight;

        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        }
        else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        }
        else if (ele.webkitRequestFullScreen) {
          ele.webkitRequestFullScreen();
        }
        else if(ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
        self.resetVideoSize();
      },
      //退出全屏
      exitFullscreen() {
        let self = this;
        var de = document;
        self.fullWindow = false;
        var ele = document.getElementById('videoContent');
        var playerEle =  self.$refs.myPlayer;
        playerEle.style.width = self.initPlayerWidth + 'px'; //动态设置HTML元素高度
        playerEle.style.height = self.initPlayerHeight + 'px';
        self.$nextTick(()=>{
          ele.style.width = self.initPlayerWidth + 'px';
          ele.style.height = self.initPlayerHeight + 'px';
          // playerEle.style.width = self.initPlayerWidth + 'px';
          // playerEle.style.height = self.initPlayerHeight + 'px';
        })
        let width = ele.offsetWidth;
        let height = ele.offsetHeight;

        if (de.exitFullscreen) {
          de.exitFullscreen();
        }
        else if (de.mozCancelFullScreen) {
          de.mozCancelFullScreen();
        }
        else if (de.webkitCancelFullScreen) {
          de.webkitCancelFullScreen();
        }
        self.exitFullScreenPlayer();
      },
      exitFullScreenPlayer(){
        let self = this
        if(self.playState){
          if(self.ifOpenSound){
            self.fullDecoder.closeSound();
          }
          self.fullDecoder.stop();
          self.fullDecoder = null;
          self.isLoading = true;
          console.log(self.initPlayerWidth);
          console.log(self.initPlayerHeight)
          if(self.playBack){
            self.startTime = Number(self.$moment(self.startTs).format('YYYYMMDDHHmmss'));
            self.endTime = Number(self.$moment(self.startTs).add(5,'m').format('YYYYMMDDHHmmss')); //五分钟视频
            console.log('历史视频')
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('加入验证码历史视频' + self.videoUrl)
            }
            else {
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('历史视频' + self.videoUrl)
            }
          }
          else{
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
              console.log('加入验证码实时视频' + self.videoUrl)
            }
            else{
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
            }
            //self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
          }
          // 初始化视频方法
          self.decoder = new EZUIKit.EZUIPlayer({
            id: 'myPlayer',
            autoplay: self.playState,
            url: self.videoUrl,
            accessToken: self.accessToken,
            //decoderPath: '../../static/ezuikit/',
            decoderPath: './static/ezuikit/',
            width: self.initPlayerWidth,
            height: self.initPlayerHeight,
            handleError: self.handleError,
            handleSuccess: self.handleExitFullScreenSuccess,
          })
        }
        else{
          // do nothing
        }
      },
      resetVideoSize(){
        let self = this;
        if(self.channelInfo==null){
          return;
        }
        else if(self.playState){
          self.decoder.closeSound();
          self.decoder.stop();
          self.decorder = null;
          self.isLoading = true;
          let  width = screen.width;
          let height = screen.height;
          let playerEle = self.$refs.myPlayer;
          playerEle.style.width = screen.width + 'px'; //动态设置HTML元素高度
          playerEle.style.height = screen.height + 'px';
          console.log(width);
          console.log(height)
          console.log(playerEle);
          console.log(self.playState)
          if(self.playBack){
            self.startTime = Number(self.$moment(self.startTs).format('YYYYMMDDHHmmss'));
            self.endTime = Number(self.$moment(self.startTs).add(5,'m').format('YYYYMMDDHHmmss')); //五分钟视频
            console.log('历史视频')
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('加入验证码历史视频' + self.videoUrl)
            }
            else {
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('历史视频' + self.videoUrl)
            }
          }
          else{
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
              console.log('加入验证码实时视频' + self.videoUrl)
            }
            else{
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
            }
          }
          // 初始化视频方法
          self.fullDecoder = new EZUIKit.EZUIPlayer({
            id: 'fullPlayer',
            autoplay: self.playState,
            url: self.videoUrl,
            accessToken: self.accessToken,
            //decoderPath: '../../static/ezuikit/',
            decoderPath: './static/ezuikit/',
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleFullWindowSuccess,
          })
        }
        else{
          // do nothing
        }
      },
      gonggeScreen(){
        let self=this;
        self.showgongge=true;
      },
      recoverScreen(){
        let self=this;
        self.showgongge=false;
      },
      showModel(){
        let self=this;
        //self.showInfoContent=true;
        if(self.playState){
          self.showModelContent=true;
        }
      },
      hiddenModel(){
        let self=this;
        self.showModelContent=false;
        //self.showInfoContent=false;
      },
      //关闭实时视频
      async realTime(){
        let self = this;
        self.times = 0;
        if(self.isStoreMonitor && !self.isLoaded){
          self.checkIfEncry();
          self.isLoaded = true;
        }
        else{
          if(self.fullWindow){
            self.initFullWindowVideo();
          }
          else{
            self.initVideo();
          }
        }
      },
      initFullWindowVideo(){
        let self = this;
        if(self.channelInfo==null){
          return;
        }
        else{
          let o = document.getElementById('videoContent');
          // o.style.width= width + 'px'
          // o.style.height= height + 'px'
          let width = screen.width;
          let height = screen.height;
          let playerEle = self.$refs.myPlayer;
          playerEle.style.width = screen.width + 'px'; //动态设置HTML元素高度
          playerEle.style.height = screen.height + 'px';
          console.log(width);
          console.log(height)
          self.isLoading = true;
          if(self.playBack){
            self.startTime = Number(self.$moment(self.startTs).format('YYYYMMDDHHmmss'));
            self.endTime = Number(self.$moment(self.startTs).add(5,'m').format('YYYYMMDDHHmmss')); //五分钟视频
            console.log('历史视频')
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('加入验证码历史视频' + self.videoUrl)
            }
            else {
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.rec?begin=' + self.startTime + '&end='+ self.endTime;
              console.log('历史视频' + self.videoUrl)
            }
          }
          else{
            if(self.videoPassword.length > 0){
              self.videoUrl = 'ezopen://'+ self.videoPassword + '@open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
              console.log('加入验证码实时视频' + self.videoUrl)
            }
            else{
              self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
            }
            //self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
          }
          // 初始化视频方法
          self.fullDecoder = new EZUIKit.EZUIPlayer({
            id: 'fullPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            //decoderPath: '../../static/ezuikit/',
            decoderPath: './static/ezuikit/',
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess,
          })
        }
      },
      stopRealTime(){
        let self = this;
        if(self.playState){
          if(self.fullWindow){
            self.fullDecoder.closeSound();
            self.fullDecoder.stop();
            self.fullDecoder = null;
          }
          else{
            console.log('关闭声音')
            self.decoder.closeSound();
            self.decoder.stop();
            self.decoder = null;
          }

          window.clearInterval(self.timerPlayReal)
          self.realTimeSpeed = 0;
          self.stopVideoTime = false;
          self.timerPlayReal = null;
        }
        self.ifOpenSound = false;
        self.showModelContent=false;
        //self.showInfoContent=false;
        self.playState = false;
        self.curBack = '';
        self.currentTimeValue = 0;
      },
      openSound(){
        let self = this;
        self.ifOpenSound = true;
        if(self.fullWindow){
          self.fullDecoder.openSound();
        }
        else{
          self.decoder.openSound();
        }
      },
      closeSound(){
        let self = this;
        self.ifOpenSound = false;
        if(self.fullWindow){
          self.fullDecoder.closeSound();
        }
        else{
          self.decoder.closeSound();
        }
      },
      stopVideo(){
        let self = this;
        if (self.playState){
          if(self.fullWindow){
            self.fullDecoder.closeSound();
            self.fullDecoder.stop();
            self.fullDecoder = null;
          }
          else{
            self.decoder.closeSound();
            self.decoder.stop();
            self.decoder = null;
          }
        }
      },
      cutPicture(){
        //截图
        let self = this;
        if(self.fullWindow){
          self.fullDecoder.capturePicture(0,'default');
        }
        else{
          self.decoder.capturePicture(0,'default');
        }
        // if(self.playBack && !self.fullWindow){
        //   //非全屏下直接停止视频
        //   self.stopRealTime();
        // }
        self.imageCanvasList=[];
        if(self.showFeedBack){
          self.showFeedDialog2=true;
          self.eventName='';
          self.eventDes='';
          self.showEventNameInfo = false;
          this.$nextTick(()=>{
            self.canvasEl = document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            let img = new Image();
            setTimeout(() => {
              self.imgSrc = sessionStorage.getItem('fileUrl');
              let img = document.getElementById('imgTest');
              //self.stopRealTime();
              if(self.fullWindow){
                self.exitFullscreen();
                self.fullWindow=false;
                self.clickSnapshot = true;
              }
              html2canvas(img).then(function (canvas) {
                ctx.drawImage(img, 0, 0, 520*self.percentHeight,340*self.percentHeight);
                var oGrayImg = icanvas.toDataURL('image/jpeg');
                self.imageCanvas.src = oGrayImg;
                let imgObj = new Image();
                imgObj.src = oGrayImg;
                self.imageCanvasList.push(imgObj);
              })
            }, 100)
          })
        }
        else {
          self.showCancelContent = false;
          if (self.sourceListLength >= 5) {
            self.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
            return false;
          }
          self.showCutDialog = true;
          this.$nextTick(() => {
            self.canvasEl = document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            let img = new Image();
            setTimeout(() => {
              self.imgSrc = sessionStorage.getItem('fileUrl');
              //self.stopRealTime();
              let img = document.getElementById('imgTest');
              if(self.fullWindow){
                self.exitFullscreen();
                self.fullWindow=false;
                self.clickSnapshot = true;
              }
              html2canvas(img).then(function (canvas) {
                ctx.drawImage(img, 0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
                var oGrayImg = icanvas.toDataURL('image/jpeg');
                self.imageCanvas.src = oGrayImg;
                let imgObj = new Image();
                imgObj.src = oGrayImg;
                self.imageCanvasList.push(imgObj);
              })
            }, 100)
          })
        }
      },
      getVideo(){
        //点击开始录像，10秒后关闭
        let self = this;
        if (self.sourceListLength >= 5) {
          self.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
          return false;
        }
        if(self.fullWindow){
          self.exitFullscreen();
          self.fullWindow=false;
          //等3秒钟后开始截取视频
          setTimeout(()=>{
            self.showGetVideo = true;
            self.videoSpeed = 0;
            //开始录制
            self.$nextTick(()=>{
              self.startTimeCutVideo=new Date().getTime();
              self.computeFrame();
              self.looper();
              setTimeout(()=>{
                var btn_canvas = document.getElementById("btn-graph-canvas");
                self.drawMain(btn_canvas, 100, "#f31d65", "#f31d65");
              },1000)
            })
          }, 3000)

        }
        else{
          self.showGetVideo = true;
          self.videoSpeed = 0;
          //开始录制
          self.$nextTick(()=>{
            self.startTimeCutVideo=new Date().getTime();
            self.computeFrame();
            self.looper();
            setTimeout(()=>{
              var btn_canvas = document.getElementById("btn-graph-canvas");
              self.drawMain(btn_canvas, 100, "#f31d65", "#f31d65");
            },1000)
          })
        }
        // let startTime = new Date().getTime();
        // let interval = setInterval(function(){
        //   if(new Date().getTime() - startTime > 10000){
        //     self.decoder.stopSave(0);
        //     self.showGetVideo = false;
        //     clearInterval(interval);
        //     setTimeout(()=>{
        //      // self.$emit('emitEzvizVideo')
        //     },1000)
        //
        //   }
        // }, 100);
      },
      confirmAddFeedBack3(){
        let self=this;
        let srcObj=null;
        srcObj = self.feedBackVideoFileObj;
        let obj={
          eventName:self.eventName,
          eventDes:self.eventDes,
          sourceObj:srcObj
        }
        if(self.eventName.trim().length==0){
          self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
          return false;
        }
        self.$emit('confirmEzvizVideoFeedback', obj)
        self.showFeedDialog3=false;
      },
      /**
       * 将获取的视频二进制对象返回给父组件
       */
      addVideoToList(){
        let self=this;
        self.showGetVideo = false;
        self.recorder.stopRecording(async function(){
          self.isRecordingStarted=false;
          self.isStoppedRecording=true;
          var blob =self.recorder.getBlob();
          self.$emit('emitEzvizVideo', blob)
        })
      },
      looper(){
        let self=this;
        if(!self.isRecordingStarted){
          self.timeVideo=setTimeout(self.looper, 0);
        }
        else{
          self.endTImeCutVideo=new Date().getTime();
          if((self.endTImeCutVideo-self.startTimeCutVideo)/1000>11){
            clearTimeout(self.timeVideo);
            self.showGetVideo=false;
            self.isRecordingStarted=false;
            self.isREC=false;
            setTimeout(()=>{
              if(self.showFeedBack){
                self.showFeedDialog3=true;
                self.eventName='';
                self.eventDes='';
                this.$nextTick(()=>{
                  self.recorder.stopRecording(function(){
                    self.isRecordingStarted=false;
                    self.isStoppedRecording=true;
                    var blob =self.recorder.getBlob();
                    let url=URL.createObjectURL(blob);
                    let obj={};
                    obj.blob = blob;
                    obj.src=url;
                    self.feedBackVideoFileObj=obj;
                  })
                })
              }else{
                self.blob = null;
                self.addVideoToList()
              }
            },100)
          }
          else{
            self.isREC=true;
            self.decoder.capturePicture(0,'default');
            setTimeout(() => {
              self.imgSrc = sessionStorage.getItem('fileUrl');
              let img = document.getElementById('imgTest');
              html2canvas(img).then(function (canvas) {
                var ctx = self.canvasEl.getContext('2d');
                let width=self.varyWindowWidth*0.48;
                let height=self.varyWindowWidth*0.28;
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img,0,0,width,height);
                if(self.isStoppedRecording) {
                  return;
                }
                requestAnimationFrame(self.looper);
              })
            }, 10)
          }
        }
      },
      computeFrame(){
        let self=this;
        self.canvasEl=document.getElementById('vcanvas');
        var ctx = self.canvasEl.getContext('2d');
        self.recorder = RecordRTC(self.canvasEl, {
          type: 'canvas'
        });
        self.isStoppedRecording =false;
        self.isRecordingStarted = true;
        self.recorder.startRecording();
      },

      drawMain(drawing_elem, percent, forecolor, bgcolor) {
        /*
            @drawing_elem: 绘制对象
            @percent：绘制圆环百分比, 范围[0, 100]
            @forecolor: 绘制圆环的前景色，颜色代码
            @bgcolor: 绘制圆环的背景色，颜色代码
        */
        let self=this;
        var context = drawing_elem.getContext("2d");
        var center_x = drawing_elem.width / 2;
        var center_y = drawing_elem.height / 2;
        var rad = Math.PI*2/100;


        // 绘制背景圆圈
        function backgroundCircle(){
          context.beginPath();
          context.lineWidth = 14; //设置线宽
          var radius = center_x - context.lineWidth;
          context.arc(center_x, center_y, radius, 0, Math.PI*2, false);
          context.fillStyle=bgcolor;
          context.globalAlpha = 0.5;
          context.fill();
        }

        //绘制运动圆环
        function foregroundCircle(n){
          context.save();
          context.strokeStyle = forecolor;
          context.globalAlpha = 1;
          context.lineWidth = 6;
          context.lineCap = "round";
          var radius = center_x - context.lineWidth;
          context.beginPath();
          context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
          context.stroke();
          context.closePath();
          context.restore();
        }

        //绘制文字
        function text(n){
          context.save();
          context.fillStyle='white';
          context.globalAlpha = 1;
          var font_size=self.btnFontSize;
          context.font='bold '+font_size+'px Helvetica';
          var textStr='';
          if(n==100){
            if(self.lang == 'en'){
              textStr= '录制成功' ;
            }
            else{
              textStr= '录制成功';
            }
          }
          else{
            textStr= '正在录制';
          }
          var text_width = context.measureText(textStr).width;
          context.fillText(textStr,center_x-text_width/2,center_y+font_size/2);
          context.restore();
        }
        //执行动画
        function drawFrame(speed){
          context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
          backgroundCircle();
          text(speed);
          foregroundCircle(speed);
          if(speed>=percent){
            clearInterval(self.videoSpeedId);
          }
        }
        self.videoSpeedId=setInterval(() => {
          if(self.videoSpeed >= percent){
            return;
          }
          else{
            self.videoSpeed += 2;
            drawFrame(self.videoSpeed);
          }
        }, 100);
      },
      showPenList(){
        let self=this;
        self.showPen=!self.showPen;
        self.showCancelContent=false;
      },
      checkPen(item,index){
        let self=this;
        item.showContent=true;
        self.penList.forEach((_item,_index)=>{
          if(index!=_index){
            _item.showContent=false;
          }
        })
        self.penChecked=item.id;
      },
      cancelEditCanvas(){
        let self=this;
        self.showCancelContent=false;
        self.canvasEl=document.getElementById('icanvas');
        var ctx = self.canvasEl.getContext('2d');
        let vcanvas = null;
        if(self.showFeedBack){
          vcanvas={width:520*self.percentHeight,height:340*self.percentHeight};
        }
        else{
          vcanvas={width:767*self.percentHeight,height:431*self.percentHeight};
        }
        ctx.clearRect(0,0,vcanvas.width,vcanvas.height);
        ctx.drawImage(self.imageCanvas,0,0,vcanvas.width,vcanvas.height);
        self.imageCanvasList=[];
      },
      confirmEditCanvas(){
        let self=this;
        self.showCancelContent=false;
        self.imageCanvasList.pop();
        self.canvasEl=document.getElementById('icanvas');
        var ctx = self.canvasEl.getContext('2d');
        let vcanvas=null;
        if(self.showFeedBack){
          vcanvas={width:520*self.percentHeight,height:340*self.percentHeight};
        }
        else{
          vcanvas={width:767*self.percentHeight,height:431*self.percentHeight};
        }
        ctx.clearRect(0,0,vcanvas.width,vcanvas.height);
        if(self.imageCanvasList.length==0){
          ctx.drawImage(self.imageCanvas,0,0,vcanvas.width,vcanvas.height);
        }
        else{
          ctx.drawImage(self.imageCanvasList[self.imageCanvasList.length-1],0,0,vcanvas.width,vcanvas.height);
        }
      },
      confirmEdit(){
        let self=this;
        let obj={};
        obj.mediaType=2;
        let src = self.canvasEl.toDataURL("image/jpeg");
        self.$emit('confirmEzvizCanvas',src);
        self.showCutDialog=false;
      },
      mouseDownAction(e){
        let self=this;
        self.isMouseDown=true;
        self.X=e.offsetX;
        self.Y=e.offsetY;
        self.showCutModel=false;
        self.showPenBtn=false;
        self.showCancelContent=false;
      },
      mouseMoveAction(e){
        let self=this;
        if(self.isMouseDown){
          self.X1=e.offsetX;
          self.Y1=e.offsetY;
          self.drawLine(self.X,self.Y,self.X1,self.Y1);
          self.showPenBtn=false;
          self.flag++;
        }
      },
      mouseUpHandler(e){
        let self=this;
        self.isMouseDown=false;
        self.showCutModel=true;
        self.showPenBtn=true;
        self.showCancelContent=true;  //每次鼠标弹起后显示可以取消的框
        if(self.flag!=0&&self.canvasEl!=''){
          let imgObj=new Image();
          imgObj.src=self.canvasEl.toDataURL("image/jpeg");
          self.imageCanvasList.push(imgObj);
        }
        self.flag=0;
      },
      mouseLeaveAction(e){
        console.log(e)
        let self=this;
        self.isMouseDown=false;
      },
      drawLine(x,y,x1,y1){
        let self=this;
        var ctx=self.canvasEl.getContext('2d');
        if(self.flag){
          ctx.beginPath();
        }
        ctx.moveTo(x,y);
        ctx.lineWidth=4;
        ctx.strokeStyle=self.penChecked;
        ctx.lineTo(x1,y1);
        ctx.stroke();
        if(self.flag!=0){
          self.X=self.X1;
          self.Y=self.Y1;
        }
      },
      showCancel(){
        let self=this;
        self.showCancelContent=true;
        self.showPenBtn=true;
      },
      hiddenCancel(){
        let self=this;
        self.showCancelContent=false;
        self.showPenBtn=false;
      },
      //抓图问题反馈
      confirmAddFeedBack2(){
        let self=this;
        let src=self.canvasEl.toDataURL("image/jpeg");

        let obj={
          eventName:self.eventName,
          eventDes:self.eventDes,
          src: src
        }
        if(self.eventName.trim().length==0){
          //self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
          self.showEventNameInfo = true;
          return false;
        }
        self.$emit('ezvizCutPictureFeedback', obj);
        self.showFeedDialog2=false;
      },
      checkFull(){
        var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        if(isFull === undefined)
        {
          isFull = false;
        }
        return isFull;
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },
      stopAndRealTime() {
        let self = this;
        self.showError = false;
        if (self.playState) {
          self.decoder.stop();
        }
        self.$nextTick(() => {
          self.decoder = null;
          console.log(self.$refs.myPlayer)
          self.initVideo();
        });
      },
      async getProcess(){
        let self=this;
        self.times +=1;
        let duration=300;
        self.durationTimeValue=duration;
        self.currentTimeValue= self.times;
        var callback = function(iTime){
          self.startTs = iTime
          console.log("iTime", iTime);
          console.log("self.startTs", self.startTs);
        }
        if(!self.fullWindow){
          self.decoder.getOSDTime(callback);
        }
        else{
          self.fullDecoder.getOSDTime(callback);
        }
        if(self.times >= duration){
          self.decoder.stop();
          self.currentTimeValue = 0;
          self.times = 0;
          self.playState = false;
          window.clearInterval(self.timerPlayReal);
          self.timerPlayReal=null;
        }
      },
      /**
       * 快进快退实现
       * @param val
       */
      adjustProcess(val, label){
        console.log(val);
        let self = this;
        self.curBack = label;
        var callback = function(iTime){
          console.log("iTime",iTime);
          switch(val){
            case 0: self.startTs = iTime - 10*1000;break;
            case 1: self.startTs = iTime - 30*1000;break;
            case 2: self.startTs = iTime - 60*1000;break;
            default: break;
          }
          self.times = 0;
          //全屏
          if(self.fullWindow){
            if(self.playState){
              if(self.ifOpenSound){
                self.fullDecoder.closeSound();
              }
              self.fullDecoder.stop();
              self.fullDecoder = null;
            }
            self.initFullWindowVideo();
            console.log("self.startTs", self.startTs);
          }
          else{
            if(self.playState){
              if(self.ifOpenSound){
                self.decoder.closeSound();
              }
              self.decoder.stop();
              self.decoder = null;
            }
            self.initVideo();
            console.log("self.startTs", self.startTs);
          }
        }
        if(self.fullWindow){
          self.fullDecoder.getOSDTime(callback);
        }
        else{
          self.decoder.getOSDTime(callback);
        }
      },
      //快进快退出现时，显示按钮，否则下拉框不能点击
      changeInfoContent(val){
        let self = this;
        self.showInfoContent = val;
      },
      /**
       * 输入密码后，验证输入的密码是否正确，不正确继续提示输入视频验证码
       */
      async verifyEnterPassword(){
        let self = this;
        let obj = {};
        obj.accessToken = self.accessToken;
        //obj.accessToken = 'at.1zxfxzy03nm6ld1t1s5s3es203455czn-45ft0jzwlk-06lc2eq-7rzulbgak';
        obj.deviceSerial = self.ivsId;
        obj.oldPassword = self.videoPassword;
        obj.newPassword = self.videoPassword;
        let params = qs.stringify(obj)
        let result = await updateDevicePassword(params);
        if(result){
          //验证码输入成功
          self.showInputPassword = false;
          self.showError = false;
          self.times = 0;
          self.startTs = self.curTime; //切换通道，仍然从最初的时间播放视频
          // if(self.playState) {
          //   self.decoder.stop();
          //   self.playState = false
          // }
          //保存验证码到本地
          let deviceObj = {};
          deviceObj.deviceSerial = self.ivsId;
          deviceObj.channelId = self.channelId;
          deviceObj.validateCode = self.videoPassword;
          self.saveDeviceValidateCode(deviceObj);
          self.$nextTick(()=> {
            self.decoder = null;
            console.log(self.$refs.myPlayer)
            self.initVideo();
          })
        }
        else{
          self.videoPassword = '';
          self.showInputPassword = true;
        }
      },
      //关闭输入验证码框的回调
      closeDialog(){
        let self = this;
        self.videoPassword = ''; //清空数据
        self.isLoading = false;
      },
      cancelEnterPassword(){
        let self = this;
        self.videoPassword = '';
        self.showInputPassword = false;
      },
      /**
       * 缓存加密设备的验证码，防止输入验证码一直弹出
       */
      saveDeviceValidateCode(deviceObj){
        let self=this;
        let key= 'ezviz'+'_'+ self.userId;
        let temp= [];
        if(localStorage.getItem(key)!=null||localStorage.getItem(key) != undefined){
          temp=JSON.parse(localStorage.getItem(key));
        }
        /**
         * 重新更新验证码
         */
        temp.forEach((item,index)=>{
          if(item.deviceSerial == deviceObj.deviceSerial && item.channelId == deviceObj.channelId){
            temp.splice(index,1);
          }
        })
        temp.push(deviceObj);
        console.log(temp)
        localStorage.setItem(key,JSON.stringify(temp));
      },
      /**
       * 根据deviceSerial和channelId 获取对应的验证码
       * @returns {Array}
       */
      getDeviceValidateCode(deviceObj){
        let self=this;
        let userId = getCookie('UserId');
        self.userId=userId;
        let key= 'ezviz'+'_'+ self.userId;
        let temp=[];
        let validateCode = '';
        if(localStorage.getItem(key) != null||localStorage.getItem(key) != undefined){
          temp = JSON.parse(localStorage.getItem(key));
        }
        temp.forEach((item, index)=>{
          if(item.deviceSerial == deviceObj.deviceSerial && item.channelId == deviceObj.channelId){
            validateCode = item.validateCode;
          }
          else{
            // do nothing
          }
        })
        console.log(validateCode)
        return validateCode;
      },
      eventNameChanged(val){
        let self = this;
        let content = filterString.standard(val,50);
        console.log(content);
        self.eventName = content;
        self.showEventNameInfo = false;
      },
      eventDesChanged(val){
        let self = this;
        let content = filterString.all(val,200);
        console.log(content);
        self.eventDes = content;
      }
    }
  }
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
      @media screen and(min-width:1366px){
        .iconrside{
          width: 40%;
        }
      }
      @media screen and(min-width:1366px){
        .iconrside{
          width: 40%;
        }
      }
      .iconrside{
        max-width: 500px;
        float: right;
        position: relative;
        right: 75px;
        span{
          font-size: 13px;
          margin-right:6px;
          margin-left: 20px;
        }
        .speed-content{
          height: 46px;
          bottom: 3px;
          position: relative;
          display: inline-block;
          .el-test{
            width: 40%;
          }
        }
      }
    }
    .screen-content{
      display: inline;
      margin-left: 30px;
      position: absolute;
      right: 20px;
      .iconscreen{
        margin-right: 20px;
        font-size: 18px;
        position: relative;
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
