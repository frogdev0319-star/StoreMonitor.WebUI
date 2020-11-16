<template>
  <div>
    <div class="errorVideo-model" v-if="showError">
      <span>{{errorText}}</span>
    </div>
    <div v-else>
      <div class="video-content"  id="videoContent" :style="isEvent?{}: {'margin-bottom': 0}" v-loading="isLoading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="getvideo-content" v-if="showGetVideo">
          <div class="btn-graph">
            <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"></canvas>
          </div>
          <canvas id="vcanvas"  :width="varyWindowWidth*0.418+'px'" :height="varyWindowWidth*0.282+'px'"></canvas>
        </div>
        <span id="channelName" v-if="showInfoContent && channelInfo">{{channelInfo.channelName}}</span>
        <div class="icon-footer" v-if="showInfoContent">
          <div class="iconlside">
            <i class="iconfont icon-bofang1 iconplay" @click="startPlay" v-if="!playState"></i>
            <i class="iconfont icon-zantingtingzhi iconplay" @click="stopPlay" v-else></i>
          </div>
          <div class="screen-content">
            <i class="iconfont iconscreen"
               :class="fullScreen?'icon-tuichuquanping':'icon-quanping'" @click="controlScreen"></i>
          </div>
        </div>
        <transition name='fade'>
          <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showModelContent && !isEvent" @click="captureSnapshot">
            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
            <span>{{$t('remotePatrol.snapshot')}}</span>
          </div>
        </transition>
        <video  height=83% width=90% id="beseyeVideo" prload autoplay :controls="showControls" v-if="showVideo"
                @waiting='onPlayerWaiting($event)' @playing="onPlayerPlaying($event)" @loadstart="onPlayerWaiting($event)" @error="onPlayerWaiting($event)" @canplay="onPlayerCanPlay()">
        </video >
      </div>
    </div>
    <el-dialog :title="$t('remotePatrol.edit')"
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
        <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">{{$t('remotePatrol.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title= "$t('remotePatrol.feedbacks')"
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
          <el-input size="mini" class="name-input" v-model="eventName" @input="eventNameChanged" @blur="notShowInputRuleTips('eventName')"></el-input>
          <span class="rules" style="margin-left:0;" v-if="eventNameRuletip">{{$t('remotePatrol.eventNameRuletip')}}</span>
          <span class="error-class" v-if="showEventNameInfo">{{$t('storeMonitor.emptyTitle')}}</span>
          <span class="event-title">{{$t('remotePatrol.description')}}</span>
          <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 4, maxRows:7}"
                    @input="eventDesChanged" v-model="eventDes" :placeholder="$t('remotePatrol.descPlaceholder')" @blur="notShowInputRuleTips('eventDes')"></el-input>
          <span class="rules" style="margin-left:0;"  v-if="eventDesRuletip">{{$t('remotePatrol.comentRuletip')}}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showFeedDialog2 = false" size="mini">{{$t('remotePatrol.cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmAddFeedBack2" size="mini" type="primary">{{$t('remotePatrol.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import i18n from "../lang";
  import {getBeseyeAccessToken, getStreamInfo, getStreamInfoFromTW} from "../api/baseye";
  import filterString from "../common/filterString";

  export default {
    name: "BeseyeVue",
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
        varyWindowHeight:window.innerHeight,
        varyWindowWidth:window.innerWidth,
        showCutModel:false,
        errorText:'',
        showError:false,
        showVideo:true,
        showModel: true,
        playState: false,
        lang: i18n.locale,
        fullScreen: false,
        hiddenModel: false,
        showGetVideo: false,
        showInfoContent: true,
        showModelContent: false,
        showControls: false,
        channel:this.channel,
        imageCanvas: new Image(),
        imageCanvasList: null,
        showCutDialog: false,
        showFeedDialog2: false,
        showFeedDialog3: false,
        canvasEl: '',
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
        clearIconSrc:require('../../static/img/清除.png'),
        removeIconSrc:require('../../static/img/撤销.png'),
        penBtnSrc:require('../../static/img/pen_btn.png'),
        flag: 0,
        eventName: '',
        eventNameRuletip:false,
        eventDesRuletip:false,
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
        userData: {param1:"value1"},
        wsConnection:null,
        repeaterRetryCount: 0,
        RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
        RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate,
        RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
        // wsURL: '',
        streamInfo:{},
        wsURL: "",
        vcamerId: "93aed0a82f284c9884c1956121db809f",
        accessToken: "",
        dd: "{Web}_{YH-EXTERNAL}_{97557807-1149-4004-8e92-91c344539ded}",
        ws_url: ''
      }
    },
    methods:{
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
      captureSnapshot(){
        let self=this;
        console.log(self.curGroupIndex);
        self.imageCanvasList=[];
        if(self.fullScreen){
          self.exitFullscreen();
          self.fullScreen=false;
        }
        if(self.showFeedBack){
          self.showFeedDialog2=true;
          self.eventName='';
          self.eventDes='';
          self.showEventNameInfo = false;
          this.$nextTick(()=>{
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.drawImage(self.beseyeVideo,0,0,520*self.percentHeight,340*self.percentHeight);
            var oGrayImg=icanvas.toDataURL('image/jpeg');
            self.imageCanvas.src=oGrayImg;
            let imgObj=new Image();
            imgObj.src=oGrayImg;
            self.imageCanvasList.push(imgObj);
          })
        }
        else{
          self.showCancelContent=false;
          if(self.sourceListLength >= 10){
            self.notify(self.$t('remotePatrol.maximumAttach'),'warning',3000);
            return false;
          }
          self.showCutDialog=true;
          this.$nextTick(()=>{
            self.canvasEl=document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            ctx.drawImage(self.beseyeVideo,0,0,767*self.percentHeight,431*self.percentHeight);
            var oGrayImg=icanvas.toDataURL('image/jpeg');
            self.imageCanvas.src=oGrayImg;
            let imgObj=new Image();
            imgObj.src=oGrayImg;
            self.imageCanvasList.push(imgObj);
          })
        }
      },
      onPlayerWaiting(e){
        console.log('video is loading')
        this.playState = false
        this.showModelContent = false
        this.isLoading = true;
      },
      onPlayerPlaying(e){
        console.log('video is playing')
        this.playState = true
        this.editCount ++
        this.showModelContent = true
        this.isLoading = false
      },
      onPlayerCanPlay(){
        let self = this;
        window.clearInterval(self.timerPlayReal);
        self.timerPlayReal=window.setInterval(()=>{
          console.log(self.realTimeSpeed)
          self.realTimeSpeed=self.realTimeSpeed+1;
        },1000);
      },
      controlScreen(){
        let self=this;
        if(!self.fullScreen){
          self.fullWindowScreen();
          self.fullScreen=true;
          // setTimeout(() => {
          //     self.showModelContent=false;
          //     //self.showInfoContent=false;
          // }, 3000);
        }
        else{
          self.exitFullscreen();
          self.fullScreen=false;
        }
      },
      eventNameChanged(val){
        let self = this;
        let content = filterString.standard(val,50);
        console.log(content);
        self.eventName = content;
        self.showEventNameInfo = false;
        let length = filterString.getContentLength(val);
        if(length>50){
          this.eventNameRuletip=true
        }else{
          this.eventNameRuletip=false
        }
      },
      eventDesChanged(val){
        let self = this;
        let content = filterString.all(val,200);
        console.log(content);
        self.eventDes = content;
        let length = filterString.getContentLength(val);
        if(length>200){
          self.eventDesRuletip=true
        }else{
          self.eventDesRuletip=false
        }
      },
      notShowInputRuleTips(e){
        if(e=='eventName'){
          this.eventNameRuletip=false
        }else if(e=='eventDes'){
          this.eventDesRuletip=false
        }
      },
      //进入全屏
      fullWindowScreen(...val) {
        console.log(val);
        let self=this;
        //self.showControls=true;
        var ele = document.getElementById('videoContent');
        ele.style.width = "100%";
        ele.style.height = "100%";
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        }
        else if (ele .mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        }
        else if (ele .webkitRequestFullScreen) {
          ele.webkitRequestFullScreen();
        }
        else if(ele.msRequestFullscreen) {
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
      visibleChange(){
        console.log('子组件退出')
        let self = this;
        if(document.hidden){
          if(self.peerConnection){
            self.stopPlay(); //停止视频
            //window.clearInterval(self.timerPlayReal);
          }
        }
        else{
          console.log(self.playState);
          if(self.playState){
            self.startPlay()
          }
        }
      },

      start()
      {
        let self = this;
        if (self.peerConnection == null)
          self.startPlay();
        else
          self.stopPlay();
      },
      startPlay() {
        let self = this;
        self.repeaterRetryCount = 0;
        self.getBeseyeStreamInfo()
        //self.getStreamInfofromTW()
      },
      wsConnect(url) {
        let self = this;
        console.log('socket connection')
        console.log(url)
        self.isLoading = true
        self.wsConnection = new WebSocket(url);
        self.wsConnection.binaryType = 'arraybuffer';

        self.wsConnection.onopen = function() {
          console.log("wsConnection.onopen");

          self.peerConnection = new RTCPeerConnection(self.peerConnectionConfig);
          self.peerConnection.onicecandidate = function (event) {
            let candidate = event.candidate
            if(candidate != null)
            {
              console.log("Local Candidate: ", candidate);
            }
          };
          self.peerConnection.ontrack = function(event){
            console.log('gotRemoteTrack: kind:'+event.track.kind+' stream:'+event.streams[0]);
            try{
              self.beseyeVideo.srcObject = event.streams[0];
            } catch (error){
              console.log(error)
              self.beseyeVideo.src = URL.createObjectURL(event.streams[0]);
            }
          }
          self.peerConnection.oniceconnectionstatechange = function () {

            console.log('ice state change: ' + self.peerConnection.iceConnectionState);
          };

          console.log("wsURL: "+self.wsURL);
          self.sendPlayGetOffer();
        }

        self.wsConnection.onmessage = function(evt){
          console.log("wsConnection.onmessage: "+evt.data);
          var msgJSON = JSON.parse(evt.data);

          var msgStatus = Number(msgJSON['status']);
          var msgCommand = msgJSON['command'];

          if (msgStatus == 514){
            // repeater stream not ready
            self.repeaterRetryCount++;
            if (self.repeaterRetryCount < 10){
              // setTimeout(self.sendGetOffer, 500);
            }
            else{
              self.stopPlay();
            }
          }
          else if (msgStatus != 200) {
            self.stopPlay();
          }
          else{
            var streamInfoResponse = msgJSON['streamInfo'];
            if (streamInfoResponse !== undefined) {
              self.streamInfo.sessionId = streamInfoResponse.sessionId;
            }

            var sdpData = msgJSON['sdp'];
            if (sdpData !== undefined) {
              console.log('sdp: '+JSON.stringify(msgJSON['sdp']));

              // We mundge the SDP here, before creating an Answer
              // If you can get the new MediaAPI to work this might
              // not be needed.
              msgJSON.sdp.sdp = self.enhanceSDP(msgJSON.sdp.sdp);

              self.peerConnection.setRemoteDescription(new RTCSessionDescription(msgJSON.sdp), function() {
                self.peerConnection.createAnswer(self.gotDescription, function () {
                });
              }, function (error) {
                console.error(error);
              });
            }

            var iceCandidates = msgJSON['iceCandidates'];
            if (iceCandidates !== undefined) {
              for(var index in iceCandidates) {
                var iceCandidate = iceCandidates[index]
                console.log('iceCandidates: '+JSON.stringify(iceCandidate));
                var candidateInfo = iceCandidate.candidate.split(' ')
                if (candidateInfo[2] == 'TCP' || candidateInfo[2] == 'UDP' && typeof InstallTrigger != 'undefined') {
                  try {
                    self.peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
                  }catch (error) {
                    console.log(error);
                  }
                }
              }
            }
          }

          if ('sendResponse'.localeCompare(msgCommand) == 0) {
            if (self.wsConnection != null){
              self.wsConnection.close();
              self.wsConnection = null;
            }
          }
        }

        self.wsConnection.onclose = function(event) {
          console.log("wsConnection.onclose " + event.code + event.reason);
          // self.showError = true
          // self.errorText = '连接中断'
        }

        self.wsConnection.onerror = function(evt) {
          // self.showError = true
          // self.errorText = '连接出错'
          console.log("wsConnection.onerror: "+JSON.stringify(evt));
        }
      },
      gotDescription(description) {
        console.log('gotDescription' + description.sdp);
        let self = this;
        self.peerConnection.setLocalDescription(description, function ()
        {
          console.log('sendAnswer');
          self.wsConnection.send('{"direction":"play", "command":"sendResponse", "streamInfo":'+JSON.stringify(self.streamInfo)+', "sdp":'+JSON.stringify(description)+', "userData":'+JSON.stringify(self.userData)+'}');

        }, function() {console.error('set description error')});
      },
      stopPlay() {
        let self = this;
        if (self.peerConnection != null){
          self.peerConnection.close();
          self.peerConnection = null;
        }
        if (self.wsConnection != null){
          self.wsConnection.close();
          self.wsConnection = null;
        }
        self.beseyeVideo.removeAttribute('src');
        window.clearInterval(self.timerPlayReal);
        self.realTimeSpeed=0;
        self.playState = false
        self.showModelContent = false
      },
      sendPlayGetOffer() {
        let self = this;
        console.log("sendPlayGetOffer: "+JSON.stringify(self.streamInfo));
        self.wsConnection.send('{"direction":"play", "command":"getOffer", "streamInfo":'+JSON.stringify(self.streamInfo)+', "userData":'+JSON.stringify(self.userData)    +'}');
      },
      enhanceSDP(sdpStr) {
        var sdpLines = sdpStr.split(/\r\n/);
        var sdpSection = 'header';
        var hitMID = false;
        var sdpStrRet = '';

        for(var sdpIndex in sdpLines)
        {
          var sdpLine = sdpLines[sdpIndex];

          if ( sdpLine.length == 0 )
            continue;

          if ( sdpLine.includes("profile-level-id") )
          {
            console.log("found profile-id");
            // This profile seems to be correct for the stream publishing,
            // however will not allow Safari to play it back, so we swap
            // it for a baseline constrained one, which is declared when
            // Safari publishes in the SDP.
            if ( sdpLine.includes("640029") )
            {
              sdpLine = sdpLine.replace("640029","42E01F");
            }
          }

          sdpStrRet +=sdpLine;
          sdpStrRet += '\r\n';
        }

        console.log("Resulting SDP: "+sdpStrRet);
        return sdpStrRet;
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },
      getAccessToken(storeId){
        let self=this;
        let params = {};
        params.storeId = storeId;
        return new Promise((resolve,reject)=>{
          if(self.currentStoreId == storeId && (Date.parse(new Date()) < self.expireTime)){
            resolve(self.accessToken);
          }else{
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
      getStreamInfofromTW(){
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
      getBeseyeStreamInfo(){
        let self = this;
        if(!self.channelInfo){
          return false
        }
        let params = {
          "cameraId": self.channelInfo.ivsId,
          "platform": 1
        }
        getStreamInfo(params).then(response => {
          console.log(response)
          // if(response.data && response.data.errors){
          //   self.showError = true
          //   self.errorText = response.data.errors[0].message;
          // }
          if (response && response.data) {
            console.log('返回信息')
            self.wsURL = response.data.wsUrl;
            self.streamInfo = response.data.streamInfo;
            self.wsConnect(self.wsURL)
          }
        }).catch(err => {
          console.log(err)
        });
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
    },
    watch:{
      async storeId(newValue, oldValue){
        console.log(newValue);
        console.log(oldValue);
        let self = this;
        self.showError = false;
        if(newValue.length > 0){
          self.getAccessToken(newValue)
        }
      },
      'channelInfo.ivsId'(newValue, oldValue){
        console.log(newValue);
        console.log(oldValue);
        let self = this;
        console.log("通道信息改变")
        self.showError = false;
      },
      //监听播放时间
      realTimeSpeed(val,oldVal){
        let self=this;
        console.log(val);
        if(val>=300){
          //五分钟停止视频
          self.stopPlay();
          window.clearInterval(self.timerPlayReal);
          self.timerPlayReal=null;
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
      if(self.peerConnection){
        self.stopPlay();
      }
      window.removeEventListener("visibilitychange",self.visibleChange)
      self.visibleChange = null;
    },
    mounted() {
      let self = this;
      self.beseyeVideo = document.getElementById('beseyeVideo')
      self.$nextTick(()=>{
        self.showInfoContent = true; //播放当前通道对应的视频(ivsId,channelId)
      })
      window.addEventListener("visibilitychange",self.visibleChange, false)
      //self.getStreamInfofromTW()
    }
  }
</script>

<!--<style lang="scss" scoped>-->
  <!--$red:#f31d65;-->
  <!--$black:#182752;-->
  <!--$border:#e3e9f4;-->
  <!--$background:#f4f5f9;-->
  <!--$tab:#7d8cad;-->
  <!--$h1:#292e36;-->
  <!--.fade-enter-active {-->
    <!--transition: all 1s ease;-->
    <!--width: 68px;-->
    <!--overflow: hidden;-->
  <!--}-->
  <!--.fade-leave-active{-->
    <!--transition: all 1s ease;-->
    <!--width: 0;-->
    <!--overflow: hidden;-->
  <!--}-->
  <!--.fade-enter, .fade-leave {-->
    <!--width: 0;-->
    <!--opacity: 0;-->
  <!--}-->
  <!--.fadepen-enter-active,.fadepen-leave-active{-->
    <!--transition: opacity .5s-->
  <!--}-->
  <!--.fadepen-enter, .fadepen-leave-to{-->
    <!--opacity: 0;-->
  <!--}-->
  <!--@function rem($val){-->
    <!--@return $val/16+rem;-->
  <!--}-->
  <!--@function checkRem($val){-->
    <!--@if($val==0){-->
      <!--@return 0;-->
    <!--}-->
    <!--@else if($val==auto){-->
      <!--@return auto;-->
    <!--}-->
    <!--@else{-->
      <!--@return rem($val);-->
    <!--}-->
  <!--}-->
  <!--@mixin point($poi,$val){-->
    <!--#{$poi}:checkRem($val);-->
  <!--}-->
  <!--.noeventClass{-->
    <!--pointer-events: none;-->
  <!--}-->
  <!--.el-container{-->
    <!--background-color: $background;-->
    <!--.spreadLsideClass{-->
      <!--width: 98%;-->
    <!--}-->
    <!--.liseAnmiClass{-->
      <!--animation:lisdeAn 0.5s;-->
      <!-- -webkit-animation: lisdeAn 0.5s;-->
      <!--animation-fill-mode:forwards;-->
    <!--}-->
    <!--@keyframes lisdeAn{-->
      <!--from{-->
        <!--width: 66.67%;-->
      <!--}-->
      <!--to{-->
        <!--width: 100%;-->
      <!--}-->
    <!--}-->
    <!--@-webkit-keyframes lisdeAn{-->
      <!--from{-->
        <!--width: 66.67%;-->
      <!--}-->
      <!--to{-->
        <!--width: 100%;-->
      <!--}-->
    <!--}-->
    <!--#cancelBtn{-->
      <!--@include point(width,76);-->
      <!--@include point(margin-right,20);-->
      <!--background-color: #EAEDF2 !important;-->
      <!--color: #708090 !important;-->
      <!--font-size: 12px;-->
      <!--line-height: 12px;-->
    <!--}-->
    <!--#confirmBtn{-->
      <!--@include point(width,76);-->
      <!--// margin-right: 15px;-->
      <!--@include point(margin-right,20);-->
      <!--font-size: 12px;-->
      <!--line-height: 12px;-->
    <!--}-->
    <!--.canvas-content{-->
      <!--position: relative;-->
      <!--.rules{-->
        <!--margin-left: 20px;-->
        <!--font-size: 10px;-->
        <!--margin-top: 5px;-->
        <!--color: #ff2400;-->
        <!--display: block;-->
      <!--}-->
      <!--.dialog-hr{-->
        <!--border: 0.5px solid ;-->
        <!--border-color: #dfe2e9;-->
        <!--margin-bottom:0px;-->
        <!--position: relative;-->
        <!--bottom: 5px;-->
      <!--}-->
      <!--#icanvas{-->
        <!--@include point(margin-top,15);-->
      <!--}-->
      <!--.dialog-img-content{-->
        <!--@include point(padding,15);-->
      <!--}-->
      <!--.is-required{-->
        <!--color: $red;-->
      <!--}-->
      <!--.error-class{-->
        <!--@include point(margin-left,20);-->
        <!--font-size: 10px;-->
        <!--margin-top: 5px;-->
        <!--color: #ff2400;-->
        <!--display: block;-->
      <!--}-->
      <!--.dialog-event-content{-->
        <!--text-align: left;-->
        <!--@include point(margin-bottom,20);-->
        <!--.event-title{-->
          <!--color: $black;-->
          <!--display: block;-->
          <!--margin: 15px;-->
          <!--@include point(margin-left,20);-->
          <!--@include point(margin-right,20);-->
          <!--font-size: 14px;-->
        <!--}-->
        <!--.name-input{-->
          <!--@include point(width,200);-->
          <!--@include point(margin-left,20);-->
        <!--}-->
        <!--.des-input{-->
          <!--display: block;-->
          <!--width: auto;-->
          <!--@include point(margin-left,20);-->
          <!--@include point(margin-right,20);-->
        <!--}-->
      <!--}-->
      <!--.feed-canvas-content{-->
        <!--width: 65%;-->
        <!--float: left;-->
        <!--position: relative;-->
        <!--text-align: left;-->
        <!--margin-left: 1%;-->
        <!--#icanvas{-->
          <!--margin-left: 20px;-->
        <!--}-->
        <!--.cancel-content{-->
          <!--margin-left: 20px !important;-->
          <!--height:30px;-->
          <!--line-height: 30px;-->
        <!--}-->
      <!--}-->
      <!--.event-content{-->
        <!--width:33%;-->
        <!--float: left;-->
        <!--text-align: left;-->
        <!--margin-left: 1%;-->
        <!--padding-right: 20px;-->
        <!--box-sizing: border-box;-->
        <!--.event-title{-->
          <!--color: $black;-->
          <!--display: block;-->
          <!--margin: 15px;-->
          <!--margin-left: 0;-->
          <!--font-size: 14px;-->
        <!--}-->
        <!--.error-class {-->
          <!--margin-left: 0;-->
        <!--}-->
        <!--.name-input{-->
          <!--width: 100%;-->
          <!--//@include point(width,150);-->
          <!--//@include point(margin-bottom,15);-->
        <!--}-->
        <!--.des-input{-->
          <!--width: 100%;-->
        <!--}-->
      <!--}-->
      <!--#previewCutVideo{-->
        <!--@include point(margin-bottom,20);-->
        <!--@include point(margin-top,10);-->
      <!--}-->
      <!--.cancel-content{-->
        <!--position: absolute;-->
        <!--bottom: 2px;-->
        <!--@include point(height,30);-->
        <!--@include point(line-height,30);-->
        <!--background-color: rgba($color: $black, $alpha: 0.5);-->
        <!--z-index: 10;-->
        <!--overflow: hidden;-->
        <!--.content{-->
          <!--text-align: center;-->
          <!--float: left;-->
          <!--color: #fff;-->
          <!--cursor: pointer;-->
          <!--width: 49%;-->
          <!--&:first-child{-->
            <!--border-right: 1px solid #fff;-->
          <!--}-->
          <!--.icon-clear{-->
            <!--position: relative;-->
            <!--@include point(top,3);-->
            <!--margin-right: 15px;-->
          <!--}-->
          <!--@media screen and(max-width: 1366px){-->
            <!--span{-->
              <!--position: relative;-->
              <!--@include point(bottom, 4)-->
            <!--}-->
          <!--}-->

        <!--}-->
      <!--}-->
      <!--.icon-right{-->
        <!--width: 120px;-->
        <!--height: auto;-->
        <!--position: absolute;-->
        <!--right: 30px;-->
        <!--top: 5%;-->
        <!--text-align: center;-->
        <!--.pen-btn{-->
          <!--width: 40px;-->
          <!--margin-right: 20px;-->
          <!--margin-bottom: 20px;-->
          <!--cursor: pointer;-->
        <!--}-->
        <!--.content{-->
          <!--width: 100%;-->
          <!--height: 40px;-->
          <!--position: relative;-->
          <!--.color{-->
            <!--width: 16px;-->
            <!--height: 16px;-->
            <!--border-radius: 8px;-->
            <!--position: absolute;-->
            <!--margin: auto 0;-->
            <!--top: 4px;-->
            <!--left: 34%;-->
            <!--margin-left: 4px;-->
            <!--z-index: 3;-->
            <!--cursor: pointer;-->
          <!--}-->
          <!--.colorActive{-->
            <!--background-color: #ddd;-->
            <!--border-radius: 50%;-->
            <!--width: 24px;-->
            <!--height: 24px;-->
            <!--position: absolute;-->
            <!--margin: auto 0;-->
            <!--left: 34%;-->
            <!--z-index: 3;-->
          <!--}-->
          <!--#white{-->
            <!--background-color: white;-->
          <!--}-->
          <!--#yellow{-->
            <!--background-color: yellow;-->
          <!--}-->
          <!--#red{-->
            <!--background-color: red;-->
          <!--}-->
        <!--}-->
      <!--}-->
    <!--}-->
    <!--@mixin arrow-icon{-->
      <!--.guide-num{-->
        <!--display: inline-block;-->
        <!--height: calc(28/1920*100vw);-->
        <!--width: calc(28/1920*100vw);-->
        <!--line-height: calc(28/1920*100vw);-->
        <!--border-radius: 50%;-->
        <!--background-color: $red;-->
        <!--color: #fff;-->
        <!--margin-right: 15px;-->
        <!--font-size: 14px;-->
        <!--@media screen and (max-width: 1280px){-->
          <!--height: 18px;-->
          <!--width: 18px;-->
          <!--line-height: 18px;-->
        <!--}-->
      <!--}-->
      <!--.guide-title{-->
        <!--color: $red;-->
        <!--font-size: calc(14/1920*100vw);-->
        <!--font-weight: bold;-->
      <!--}-->
    <!--}-->
    <!--.lside{-->
      <!--padding-bottom: calc(25/1920*100vw);-->
      <!--margin-right: calc(25/1920*100vw);-->
      <!--border: 1px solid $border;-->
      <!--background-color: #fff;-->
      <!--.el-header-title{-->
        <!--text-align: left;-->
        <!--position: relative;-->
        <!--height: 80px;-->
        <!--line-height: 80px;-->
        <!--border-bottom: 1px solid $border;-->
        <!--padding-left: calc(25/1920*100vw);-->
        <!--padding-right: calc(25/1920*100vw);-->
        <!--.lside-title{-->
          <!--font-weight: bold;-->
          <!--color:$h1;-->
        <!--}-->
        <!--@media screen and(min-width: 1366px){-->
          <!--.lside-title{-->
            <!--font-size: 18px;-->
          <!--}-->
          <!--.storeUp-content{-->
            <!--height:22px;-->
            <!--width: 105px;-->
            <!--text-align: center;-->
          <!--}-->
        <!--}-->
        <!--@media screen and(max-width: 1366px){-->
          <!--.lside-title{-->
            <!--@include point(font-size,18);-->
          <!--}-->
          <!--.storeUp-content{-->
            <!--height:auto;-->
            <!--text-align: center;-->
            <!--width: 100px;-->
          <!--}-->
        <!--}-->
        <!--.nocoll{-->
          <!--border:1px solid #FF9803;-->
        <!--}-->
        <!--.coll{-->
          <!--border:1px solid #FF9803;-->
          <!--background-color: #FF9803;-->
        <!--}-->
        <!--.nocoll-icon{-->
          <!--color: #FF9803;-->
          <!--font-size: 14px;-->
        <!--}-->
        <!--.coll-icon{-->
          <!--color: #fff;-->
          <!--font-size: 14px;-->
        <!--}-->
        <!--.coll-font{-->
          <!--color: #fff;-->
        <!--}-->
        <!--.nocoll-font{-->
          <!--color: #FF9803;-->
        <!--}-->

        <!--.storeUp-content{-->
          <!--display: inline-block;-->
          <!--margin-left: 20px;-->
          <!--padding: 1px 6px;-->
          <!--line-height: 18px;-->
          <!--cursor: pointer;-->
          <!--position: relative;-->
          <!--bottom: 2px;-->
          <!--span{-->
            <!--font-size: 12px;-->
            <!--/*vertical-align: middle;*/-->
            <!--margin-left: 4px;-->
          <!--}-->
        <!--}-->
        <!--.el-submit{-->
          <!--position: absolute;-->
          <!--@include point(right,20);-->
          <!--//@include point(width,90);-->
          <!--color: #fff;-->
          <!--width:calc(130/1920*100vw);-->
          <!--height: calc(36/1920*100vw);-->
          <!--padding: 0 0;-->
          <!--font-size: calc(14/1920*100vw);-->
        <!--}-->
        <!--.en-el-submit{-->
          <!--position: absolute;-->
          <!--right: calc(30/1920*100vw);-->
          <!--width:calc(130/1920*100vw);-->
          <!--color: #fff;-->
          <!--height: calc(36/1920*100vw);-->
          <!--padding: 0 0;-->
          <!--font-size: calc(14/1920*100vw);-->
          <!--min-height: 28px;-->
          <!--top: 50%;-->
          <!--transform: translate(0, -50%);-->
          <!--min-width: 85px;-->
        <!--}-->
        <!--@media screen and(min-width: 1366px){-->
          <!--.el-submit{-->
            <!--top: 30%;-->
          <!--}-->
        <!--}-->
        <!--@media screen and(max-width: 1366px){-->
          <!--.el-submit{-->
            <!--top: 20%;-->
          <!--}-->
        <!--}-->
      <!--}-->
      <!--.errorVideo-model{-->
        <!--@include point(margin,20);-->
        <!--margin-bottom: 0;-->
        <!--height: auto;-->
        <!--position: relative;-->
        <!--min-height: 420px;-->
        <!--background-color: #232730;-->
        <!--color: $red;-->
        <!--z-index: 100;-->
        <!--span{-->
          <!--position: absolute;-->
          <!--top: 50%;-->
          <!--left: 50%;-->
          <!--transform: translate(-50%, -50%);-->
          <!--font-size: 12px;-->
        <!--}-->
      <!--}-->
      <!--.guide-content{-->
        <!--margin: calc(25/1920*100vw);-->
        <!--margin-bottom: 0;-->
        <!--height: auto;-->
        <!--position: relative;-->
        <!--min-height: 420px;-->
        <!--background-color: #000;-->
        <!--.guide-rside{-->
          <!--position: absolute;-->
          <!--top: 30%;-->
          <!--right: 20px;-->
          <!--width: 260px;-->
          <!--img{-->
            <!--@include point(height,42);-->
            <!--position: relative;-->
            <!--right: 5%;-->
            <!--top: 35px;-->
          <!--}-->
          <!--.num-content{-->
            <!--@include arrow-icon;-->
          <!--}-->
          <!--.iconright-content{-->
            <!--width: auto;-->
            <!--height: auto;-->
            <!--position: absolute;-->
            <!--//top: 30%;-->
            <!--top: 60%;-->
            <!--right: 0;-->
            <!--.iconright{-->
              <!--width: 80px;-->
              <!--text-align: center;-->
              <!--margin-top: 30px;-->
              <!--height: 32px;-->
              <!--line-height: 30px;-->
              <!--border-radius: 4px;-->
              <!--padding: 0 6px;-->
              <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
              <!--.iconpaizhao{-->
                <!--color: #fff;-->
                <!--vertical-align:middle;-->
              <!--}-->
              <!--span{-->
                <!--color: #fff;-->
                <!--font-size: 12px;-->
                <!--margin-left: 12px;-->
                <!--vertical-align:middle;-->
              <!--}-->
            <!--}-->
            <!--.en-iconright{-->
              <!--width: 100px;-->
              <!--text-align: center;-->
              <!--margin-top: 30px;-->
              <!--height: 32px;-->
              <!--line-height: 30px;-->
              <!--border-radius: 4px;-->
              <!--padding: 0 6px;-->
              <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
              <!--.iconpaizhao{-->
                <!--color: #fff;-->
                <!--vertical-align:middle;-->
              <!--}-->
              <!--span{-->
                <!--color: #fff;-->
                <!--font-size: 12px;-->
                <!--margin-left: 12px;-->
                <!--vertical-align:middle;-->
              <!--}-->
            <!--}-->
          <!--}-->
        <!--}-->
      <!--}-->
      <!--.video-content{-->
        <!--height: auto;-->
        <!--position: relative;-->
        <!--margin: calc(25/1920*100vw);-->
        <!--//@include point(min-width,500);-->
        <!--//@include point(min-height,408);-->
        <!--min-height: 420px;-->
        <!--background-color: #000;-->
        <!--margin-bottom: 0;-->
        <!--z-index: 100;-->
        <!--.getvideo-content{-->
          <!--position: absolute;-->
          <!--z-index: 930;-->
          <!--width: 100%;-->
          <!--height: 100%;-->
          <!--background-color: #000;-->
          <!--.btn-graph {-->
            <!--position: absolute;-->
            <!--left: 45%;-->
            <!--top: 45%;-->
            <!--display:flex;-->
            <!--display:-webkit-flex;-->
            <!--justify-content: center;-->
            <!--align-items: center;-->
          <!--}-->
          <!--#btn-graph-canvas {-->
            <!--width: 100px;-->
            <!--height: 100px;-->
          <!--}-->
        <!--}-->
        <!--@media screen and(max-width: 1366px){-->
          <!--#channelName{-->
            <!--font-size: 12px;-->
          <!--}-->
          <!--.iconright{-->
            <!--span{-->
              <!--font-size:12px;-->
            <!--}-->
          <!--}-->
          <!--.en-iconright{-->
            <!--span{-->
              <!--font-size:12px;-->
            <!--}-->
          <!--}-->
          <!--.iconright1{-->
            <!--span{-->
              <!--font-size:12px;-->
            <!--}-->
          <!--}-->
          <!--.en-iconright1{-->
            <!--span{-->
              <!--font-size:12px;-->
            <!--}-->
          <!--}-->
        <!--}-->
        <!--@media screen and(min-width: 1366px){-->
          <!--#channelName{-->
            <!--font-size: 16px;-->
          <!--}-->
          <!--.iconright{-->
            <!--span{-->
              <!--font-size:14px;-->
            <!--}-->
          <!--}-->
          <!--.en-iconright{-->
            <!--span{-->
              <!--font-size:14px;-->
            <!--}-->
          <!--}-->
          <!--.iconright1{-->
            <!--span{-->
              <!--font-size:14px;-->
            <!--}-->
          <!--}-->
          <!--.en-iconright1{-->
            <!--span{-->
              <!--font-size:14px;-->
            <!--}-->
          <!--}-->
        <!--}-->
        <!--#beseyeVideo{-->
          <!--//@include point(min-width,500);-->
          <!--//@include point(min-height,405);-->
          <!--min-height: 420px;-->
        <!--}-->
        <!--#channelName{-->
          <!--position: absolute;-->
          <!--color: #fff;-->
          <!--z-index: 10;-->
          <!--display: block;-->
          <!--width:-webkit-calc(100% - 30px);-->
          <!--width:-moz-calc(100% - 30px);-->
          <!--width:calc(100% - 30px);-->
          <!--height: 40px;-->
          <!--line-height: 40px;-->
          <!--text-align: left;-->
          <!--padding-left: 30px;-->
          <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
        <!--}-->
        <!--.icon-footer{-->
          <!--width: 100%;-->
          <!--height: 45px;-->
          <!--line-height: 45px;-->
          <!--position: absolute;-->
          <!--bottom: 0px;-->
          <!--color: #fff;-->
          <!--overflow: hidden;-->
          <!-- -webkit-user-select: none;-->
          <!-- -moz-user-select: none;-->
          <!-- -ms-user-select: none;-->
          <!--user-select: none;-->
          <!--z-index: 10;-->
          <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
          <!--.iconlside{-->
            <!--float: left;-->
            <!--text-align: left;-->
            <!--margin-left: 30px;-->
            <!--.iconplay{-->
              <!--font-size: 18px;-->
              <!--cursor: pointer;-->
              <!--float: left;-->
            <!--}-->
          <!--}-->
        <!--}-->
        <!--.screen-content{-->
          <!--display: inline;-->
          <!--margin-left: 30px;-->
          <!--position: absolute;-->
          <!--right: 20px;-->
          <!--.iconscreen{-->
            <!--margin-right: 20px;-->
            <!--font-size: 18px;-->
            <!--position: relative;-->
            <!--cursor: pointer;-->
          <!--}-->
        <!--}-->
        <!--.iconright{-->
          <!--padding: 0 6px;-->
          <!--width: 80px;-->
          <!--height: 32px;-->
          <!--line-height: 30px;-->
          <!--position: absolute;-->
          <!--z-index: 900;-->
          <!--right: 20px;-->
          <!--margin-bottom: 40px;-->
          <!--border-radius: 4px;-->
          <!--text-align: center;-->
          <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
          <!--//top: 40%;-->
          <!--top: 45%;-->
          <!--span{-->
            <!--// font-size: 12px;-->
            <!--margin-left: 12px;-->
            <!--color: #fff;-->
            <!--//margin-right: 35px;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
          <!--.iconpaizhao{-->
            <!--color: #fff;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
        <!--}-->
        <!--.en-iconright{-->
          <!--padding: 0 6px;-->
          <!--width: 108px;-->
          <!--height: 32px;-->
          <!--line-height: 30px;-->
          <!--position: absolute;-->
          <!--z-index: 900;-->
          <!--right: 20px;-->
          <!--margin-bottom: 40px;-->
          <!--border-radius: 4px;-->
          <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
          <!--//top: 40%;-->
          <!--top: 45%;-->
          <!--span{-->
            <!--// font-size: 12px;-->
            <!--margin-left: 12px;-->
            <!--color: #fff;-->
            <!--/*margin-right: 35px;*/-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
          <!--.iconpaizhao{-->
            <!--color: #fff;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
        <!--}-->
        <!--.iconright1{-->
          <!--padding: 0 6px;-->
          <!--width: 80px;-->
          <!--height: 32px;-->
          <!--line-height: 30px;-->
          <!--position: absolute;-->
          <!--z-index: 900;-->
          <!--right: 20px;-->
          <!--margin-bottom: 40px;-->
          <!--border-radius: 4px;-->
          <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
          <!--top: 56%;-->
          <!--text-align: center;-->
          <!--span{-->
            <!--margin-left: 12px;-->
            <!--color: #fff;-->
            <!--//margin-right: 32px;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
          <!--.iconpaizhao{-->
            <!--color: #fff;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
        <!--}-->
        <!--.en-iconright1{-->
          <!--padding: 0 6px;-->
          <!--width: 108px;-->
          <!--height: 32px;-->
          <!--line-height: 30px;-->
          <!--position: absolute;-->
          <!--z-index: 900;-->
          <!--right: 20px;-->
          <!--margin-bottom: 40px;-->
          <!--border-radius: 4px;-->
          <!--background-color: rgba($color: #24293d, $alpha: 0.6);-->
          <!--top: 56%;-->
          <!--span{-->
            <!--margin-left: 12px;-->
            <!--color: #fff;-->
            <!--//margin-right: 32px;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
          <!--.iconpaizhao{-->
            <!--color: #fff;-->
            <!--cursor: pointer;-->
            <!--vertical-align:middle;-->
          <!--}-->
        <!--}-->
      <!--}-->
      <!--.el-inspect{-->
        <!--border-left: 1px solid $border;-->
        <!--border-right: 1px solid $border;-->
        <!--border-bottom: 1px solid $border;-->
        <!--margin: 0;-->
        <!--margin-left: calc(25/1920*100vw);-->
        <!--margin-right: calc(25/1920*100vw);-->
        <!--position: relative;-->
        <!--.inspect-title /deep/ .el-alert__title{-->
          <!--font-weight: bold;-->
          <!--color:#f59f23;-->
          <!--font-size: 14px;-->
        <!--}-->
        <!--// .inspect-title /deep/ .el-alert&#45;&#45;warning{-->
        <!--//     height:40px;-->
        <!--//     line-height: 40px;-->
        <!--// }-->
        <!--.inspect-title /deep/ .el-alert__icon{-->
          <!--font-size: 16px;-->
          <!--margin-right: calc(10/1920*100vw);-->
        <!--}-->
        <!--.inspect-title /deep/ .el-alert__description{-->
          <!--margin:0;-->
        <!--}-->
        <!--.inspect-title /deep/ .el-alert__content{-->
          <!--padding:0;-->
        <!--}-->
        <!--.inspect-title{-->
          <!--.el-alert{-->
            <!--height:40px;-->
            <!--line-height: 40px;-->
            <!--padding-left: calc(35/1920*100vw);-->
            <!--padding-right: calc(26/1920*100vw);-->
            <!--vertical-align: middle;-->
          <!--}-->
          <!--.info-alert /deep/ .el-alert__content{-->
            <!--width:100%;-->
          <!--}-->
          <!--.info-alert{-->
            <!--.info-left{-->
              <!--float: left;-->
              <!--color:#182752;-->
              <!--font-weight: bold;-->
              <!--font-size:calc(14/1920*100vw);-->
            <!--}-->
            <!--.info-right{-->
              <!--float: right;-->
              <!--color:#6097f4;-->
              <!--cursor: pointer;-->
              <!--img{-->
                <!--vertical-align: middle;-->
              <!--}-->
              <!--span{-->
                <!--text-decoration: underline;-->
                <!--margin-left:calc(10/1920*100vw);-->
                <!--vertical-align: middle;-->
              <!--}-->
            <!--}-->
          <!--}-->
        <!--}-->
        <!--.guide-lside{-->
          <!--position: absolute;-->
          <!--width: auto;-->
          <!--z-index: 1000;-->
          <!--img{-->
            <!--@include point(height,42);-->
            <!--position: relative;-->
            <!--right: 15%;-->
          <!--}-->
        <!--}-->
        <!--.num-content{-->
          <!--@include arrow-icon;-->
        <!--}-->
        <!--.inspect-header{-->
          <!--text-align: left;-->
          <!--font-size: 12px;-->
          <!--font-weight: bold;-->
          <!--color: $tab;-->
          <!--background-color: $background;-->
          <!--border-bottom:1px solid $border;-->
          <!--position: relative;-->
          <!--// z-index: 100;-->
        <!--}-->
        <!--@media screen and (min-width: 1600px){-->
          <!--.inspect-header{-->
            <!--height: 50px;-->
            <!--line-height: 50px;-->
          <!--}-->
          <!--.inspect-details{-->
            <!--height: 50px;-->
            <!--line-height: 50px;-->
            <!--font-size: 14px;-->
          <!--}-->
          <!--.guide-lside{-->
            <!--top: 10px;-->
            <!--right: 10%;-->
          <!--}-->
        <!--}-->
        <!--@media screen and (max-width: 1600px){-->
          <!--.inspect-header{-->
            <!--height: 40px;-->
            <!--line-height: 40px;-->
            <!--span{-->
              <!--margin-left: 16px !important;-->
            <!--}-->
          <!--}-->
          <!--.inspect-details{-->
            <!--height: 40px;-->
            <!--line-height: 40px;-->
            <!--font-size: 12px;-->
            <!--span{-->
              <!--width: 100%;-->
              <!--display: block;-->
              <!--white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。-->
              <!--overflow: hidden; //隐藏超出单元格的部分。-->
              <!--text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。-->
            <!--}-->
          <!--}-->
          <!--.guide-lside{-->
            <!--top: 5px;-->
            <!--right: 5%;-->
          <!--}-->
        <!--}-->
        <!--.inspect-content{-->
          <!--padding: 15px auto;-->
          <!--.Group-content{-->
            <!--text-align: left;-->
            <!--.Group-content-title{-->
              <!--padding-left:calc(35/1920*100vw);-->
              <!--padding-right:calc(26/1920*100vw);-->
              <!--height:50px;-->
              <!--line-height: 50px;-->
              <!--border-bottom:1px solid #ddd;-->
              <!--font-size: calc(14/1920*100vw);-->
              <!--color:$tab;-->
              <!--cursor: pointer;-->
              <!--.icon{-->
                <!--float:right;-->
                <!--line-height: 50px;-->
              <!--}-->
            <!--}-->
            <!--.Group-content-details{-->

            <!--}-->
          <!--}-->
          <!--.item-content{-->
            <!--.feedbacks-content{-->

              <!--.feedbacks-details{-->

                <!--text-align: left;-->
                <!--@include point(margin-top,15);-->
                <!--@include point(margin-bottom,15);-->
                <!--@include point(padding-left,20);-->
                <!--@include point(padding-right,15);-->
                <!--position: relative;-->
                <!--.feedback-eventname{-->
                  <!--font-size: 14px;-->
                  <!--display: block;-->
                  <!--margin-bottom: 8px;-->
                  <!--color: $black;-->
                <!--}-->
                <!--.feedback-eventdes{-->
                  <!--font-size: 12px;-->
                  <!--display: block;-->
                  <!--margin-bottom: 15px;-->
                  <!--color: $tab;-->
                  <!--margin-left: 15px;-->
                  <!--white-space:pre-wrap;-->
                <!--}-->
                <!--.icon-delete-event{-->
                  <!--position: absolute;-->
                  <!--right: 0;-->
                  <!--@include point(margin-right,15);-->
                  <!--cursor: pointer;-->
                  <!--color: #fff;-->
                  <!--background-color: #D9DBE3;-->
                  <!--border-radius: 50%;-->

                <!--}-->
                <!--.img-content{-->
                  <!--position: relative;-->
                  <!--width: 140px;-->
                  <!--height: 100px;-->
                  <!--margin-left: 15px;-->
                  <!--.start-icon{-->
                    <!--position: absolute;-->
                    <!--left: 35%;-->
                    <!--top: 30%;-->
                    <!--cursor: pointer;-->
                  <!--}-->
                <!--}-->
                <!--.feedbacks-hr{-->
                  <!--border: 0.5px solid $border;-->
                <!--}-->
              <!--}-->
            <!--}-->
          <!--}-->
          <!--#feedback-content{-->
            <!--@include point(padding-top,20);-->
            <!--@include point(margin-left,30);-->
            <!--text-align: left;-->
            <!--.feedback-info{-->
              <!--display: block;-->
              <!--color: $red;-->
              <!--font-size: calc(18/1920*100vw);-->
              <!--font-weight: bold;-->
              <!--&:last-child{-->
                <!--@include point(margin-top,30);-->
              <!--}-->
            <!--}-->
          <!--}-->
          <!--.feed-arrow{-->
            <!--position: relative;-->
            <!--@include point(left,30);-->
          <!--}-->
          <!--.plus-icon{-->
            <!--position: absolute;-->
            <!--@include point(bottom,10);-->
            <!--@include point(right,30);-->
            <!--cursor: pointer;-->
          <!--}-->
          <!--.inspect-details{-->
            <!--height:40px;-->
            <!--line-height: 40px;-->
            <!--text-align: left;-->
            <!--padding-left: calc(55/1920*100vw);-->
            <!--color: $tab;-->
            <!--border-bottom:1px solid #ddd;-->
            <!--cursor: pointer;-->
            <!--background-color: #f9fafe;-->
            <!--// &:last-child{-->
            <!--//     margin-bottom: 15px;-->
            <!--// }-->
            <!--span{-->
              <!--width: 100%;-->
              <!--display: block;-->
              <!--white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。-->
              <!--overflow: hidden; //隐藏超出单元格的部分。-->
              <!--text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。-->
            <!--}-->
          <!--}-->
          <!--.noraml-title{-->
            <!--cursor: pointer;-->
            <!--opacity: 1;-->
          <!--}-->
          <!--.ignore-title{-->
            <!--cursor: not-allowed;-->
            <!--opacity: 0.5;-->
          <!--}-->
          <!--.item-details{-->
            <!--text-align: left;-->
            <!--min-height: 60px;-->
            <!--position: relative;-->
            <!--padding: 15px;-->
            <!--@include point(padding-left,20);-->
            <!--padding-bottom: 0;-->
            <!--margin-top: 5px;-->
            <!--.rules{-->
              <!--margin-left: 20px;-->
              <!--font-size: 10px;-->
              <!--margin-top: 5px;-->
              <!--color: #ff2400;-->
              <!--display: block;-->
            <!--}-->
            <!--&:last-child{-->
              <!--margin-bottom: 35px;-->
            <!--}-->
            <!--.icon-clicked{-->
              <!--width: 4px;-->
              <!--min-height: 40px;-->
              <!--height: calc(100% - 50px);-->
              <!--position: absolute;-->
              <!--top:50px;-->
              <!--background-color: $red;-->
            <!--}-->
            <!--@media screen and(max-width:1366px) {-->
              <!--.titles{-->
                <!--font-size: 12px;-->
                <!--width: 50%;-->
                <!--display: inline-block;-->
                <!--overflow: hidden;-->
                <!--white-space: nowrap;-->
                <!--text-overflow: ellipsis;-->
              <!--}-->
              <!--.details-content{-->
                <!--@include point(font-size,12);-->
              <!--}-->
            <!--}-->
            <!--@media screen and(min-width:1366px) {-->
              <!--.titles{-->
                <!--font-size: 14px;-->
                <!--width: 55%;-->
                <!--display: inline-block;-->
                <!--overflow: hidden;-->
                <!--white-space: nowrap;-->
                <!--text-overflow: ellipsis;-->
              <!--}-->
              <!--.details-content{-->
                <!--font-size: 12px;-->
              <!--}-->
            <!--}-->
            <!--.details-content{-->
              <!--// font-size: 12px;-->
              <!--color: $tab;-->
              <!--margin-top: 15px;-->
              <!--span{-->
                <!--margin-left: 15px;-->
                <!--display: block;-->
              <!--}-->
            <!--}-->
            <!--.source-content{-->
              <!--min-height: 110px;-->
              <!--width: 90%;-->
              <!--margin: auto 20px;-->
              <!--.source-details{-->
                <!--display: inline-block;-->
                <!--margin-right: 15px;-->
                <!--padding-top: 15px;-->
                <!--position: relative;-->
                <!--span{-->
                  <!--font-size: 12px;-->
                  <!--color: #FCB83B;-->
                  <!--margin-top: 0;-->
                <!--}-->
                <!--.icondelete{-->
                  <!--position: absolute;-->
                  <!--font-size: 14px;-->
                  <!--right: 5px;-->
                  <!--margin-top: 8px;-->
                  <!--z-index: 2;-->
                  <!--color: #fff;-->
                  <!--cursor: pointer;-->
                  <!--background-color: rgba($color: $black, $alpha: 0.8);-->
                  <!--border-radius: 50%;-->
                <!--}-->
                <!--.img-content{-->
                  <!--width: 100%;-->
                  <!--height: 100%;-->
                  <!--position: relative;-->
                <!--}-->
                <!--.start-icon{-->
                  <!--position: absolute;-->
                  <!--left: 35%;-->
                  <!--top: 30%;-->
                  <!--cursor: pointer;-->
                <!--}-->
              <!--}-->
            <!--}-->
            <!--.des-input{-->
              <!--margin-left: 15px;-->
              <!--width:-webkit-calc(100% - 20px);-->
              <!--width:-moz-calc(100% - 20px);-->
              <!--width:calc(100% - 20px);-->
              <!--margin-top: 15px;-->
            <!--}-->
            <!--.iconhulve{-->
              <!--position: absolute;-->
              <!--color: #ddd;-->
              <!--font-size: 20px;-->
              <!--@include point(right,20);-->
              <!--@include point(top,10);-->
              <!--cursor: pointer;-->
            <!--}-->
            <!--.ignored-icon{-->
              <!--display:inline-block;-->
              <!--position: absolute;-->
              <!--@include point(right,10);-->
              <!--// @include point(top,10);-->
              <!--font-size: 12px;-->
              <!--padding:2px 6px;-->
              <!--border-radius: 4px;-->
              <!--color: #fff;-->
              <!--background-color: $black;-->
              <!--cursor: not-allowed;-->
              <!--max-width: 58px;-->
            <!--}-->
            <!--.dropdown-model{-->
              <!--position: absolute;-->
              <!--@include point(right,50);-->
              <!--@include point(top,12);-->
              <!--margin-right: 10px;-->
              <!--width: 120px;-->
              <!--height: 22px;-->
              <!--background-color: transparent;-->
              <!--z-index: 20;-->
              <!--cursor: not-allowed;-->
            <!--}-->
            <!--.check_scoring{-->
              <!--box-sizing: border-box;-->
              <!--position: absolute;-->
              <!--@include point(right,60);-->
              <!--@include point(top,12);-->
              <!--font-size: 12px;-->
              <!--width: 120px;-->
              <!--height: 25px;-->
              <!--line-height: 24px;-->
              <!--border:1px solid #dcdcdc;-->
              <!--background-color: #f7f8fc;-->
              <!--display: inline-block;-->
              <!--border-radius: 4px;-->
              <!--margin-top: -2px;-->
              <!--p{-->
                <!--margin:0;-->
                <!--width:58.5px;-->
                <!--text-align: center;-->
                <!--display: inline-block;-->
              <!--}-->
              <!--p:nth-child(1){-->
                <!--border-radius: 4px 0 0 4px;-->
                <!--border-right: 1px solid #dcdcdc;-->
              <!--}-->
              <!--p:nth-child(2){-->
                <!--border-radius: 0 4px 4px 0;-->
              <!--}-->
              <!--.check_normal{-->
                <!--color:#7b8da0;-->
                <!--font-size: calc(12/1920*100vw);-->
              <!--}-->
              <!--.check_isClick{-->
                <!--background-color:#fcba3f;-->
                <!--font-size: calc(14/1920*100vw);-->
                <!--color:#fff;-->
              <!--}-->
            <!--}-->
            <!--.item-score{-->
              <!--box-sizing: border-box;-->
              <!--position: absolute;-->
              <!--@include point(right,70);-->
              <!--@include point(top,12);-->
              <!--font-size: 12px;-->
              <!--//width: 96px;-->
              <!--width: 110px;-->
              <!--height: 22px;-->
              <!--// @include point(width,86);-->
              <!--//@include point(padding-left,10);-->
              <!--background-color: orange;-->
              <!--line-height: 22px;-->
              <!--color: #fff;-->
              <!--border-radius: 13px;-->
              <!--cursor: pointer;-->
              <!--.iconscore{-->
                <!--//margin-left: 10px;-->
              <!--}-->
              <!--.el-dropdown-link{-->
                <!--display: inline-block;-->
                <!--font-size: 12px;-->
                <!--margin-right: 20px;-->
                <!--width: 120px;-->
                <!--height: 22px;-->
                <!--background-color: orange;-->
                <!--line-height: 22px;-->
                <!--color: #fff;-->
                <!--border-radius: 13px;-->
                <!--cursor: pointer;-->
                <!--padding-right: 10px;-->
                <!--box-sizing: border-box;-->
                <!--padding-left: 10px-->
              <!--}-->
            <!--}-->
            <!--.score-menu{-->
              <!--max-height: 160px;-->
              <!--overflow: hidden;-->

            <!--}-->
          <!--}-->
          <!--.inspect-empty{-->
            <!--height: 160px;-->
            <!--position: relative;-->
            <!--span{-->
              <!--position: absolute;-->
              <!--top: 40%;-->
              <!--font-size: 12px;-->
            <!--}-->
          <!--}-->
        <!--}-->
      <!--}-->
    <!--}-->
    <!--.rside{-->
      <!--border: 1px solid $border;-->
      <!--background-color: #fff;-->
      <!--//@include point(margin-right,20);-->
      <!--.el-header-title{-->
        <!--text-align: left;-->
        <!--position: relative;-->
        <!--color:$black;-->
        <!--font-size: calc(16/1920*100vw);-->
        <!--height: 80px;-->
        <!--line-height: 80px;-->
        <!--border-bottom: 1px solid $border;-->
        <!--padding-left: calc(10/1920*100vw);-->
        <!--span{-->
          <!--display: block;-->
          <!--margin-left: calc(30/1920*100vw);-->
        <!--}-->
      <!--}-->
      <!--#storetab-content, #en-storetab-content{-->
        <!--margin-top: 10px;-->
        <!--margin-left: calc(20/1920*100vw);-->
        <!--margin-right: calc(20/1920*100vw);-->
        <!--.storeList-content{-->
          <!--padding: 0 10px;-->
          <!--text-align: left;-->
          <!--height: 392px;-->
          <!--color: $black;-->
          <!--.icon-info{-->
            <!--color: #FF9803;-->
            <!--font-size: 12px;-->
            <!--display: block;-->
            <!--@include point(margin,5);-->
            <!--@include point(margin-left,15);-->
          <!--}-->
          <!--.activeClass{-->
            <!--background-color: #FDE8EF !important;-->
            <!--color: $red;-->
            <!--border-color: $red !important;-->
          <!--}-->
          <!--.stores{-->
            <!--&:last-child{-->
              <!--@include point(margin-bottom,20);-->
            <!--}-->
          <!--}-->
          <!--.el-search-input{-->
            <!--@include point(width,200);-->
            <!--@include point(margin-left,15);-->
            <!--@include point(margin,15);-->
            <!--@include point(margin-top,10);-->
          <!--}-->
          <!--.storename{-->
            <!--display: inline-block;-->
            <!--@include point(margin-left,15);-->
            <!--margin-top: 10px;-->
            <!--margin-bottom: 15px;-->
            <!--border: 1px solid #ddd;-->
            <!--border-radius: 4px;-->
            <!--text-align: center;-->
            <!--font-size: 12px;-->
            <!--cursor: pointer;-->
            <!--@include point(width,76);-->
            <!--@include point(padding,6);-->
            <!--white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。-->
            <!--overflow: hidden; //隐藏超出单元格的部分。-->
            <!--text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。-->
          <!--}-->
          <!--.store-name{-->
            <!--display: inline-block;-->
            <!--@include point(margin-left,15);-->
            <!--margin-top: 10px;-->
            <!--margin-bottom: 15px;-->
            <!--border: 1px solid #ddd;-->
            <!--border-radius: 4px;-->
            <!--text-align: center;-->
            <!--font-size: 12px;-->
            <!--cursor: pointer;-->
            <!--@include point(width,76);-->
            <!--@include point(padding,6);-->
            <!--span{-->
              <!--width: 100%;-->
              <!--display: block;-->
              <!--white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。-->
              <!--overflow: hidden; //隐藏超出单元格的部分。-->
              <!--text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。-->
            <!--}-->
          <!--}-->

          <!--.citys{-->
            <!--display: block;-->
            <!--font-size: 14px;-->
            <!--font-weight: bold;-->
            <!--@include point(margin-left,20);-->
          <!--}-->
        <!--}-->
      <!--}-->
      <!--.patrol-select /deep/ .el-icon&#45;&#45;right{-->
        <!--float:right;-->
      <!--}-->
      <!--.patrol-select{-->
        <!--height:160px;-->
        <!--width:92%;-->
        <!--text-align: left;-->
        <!--margin:0 auto;-->
        <!--border-top:0.5px solid #e3e9f4;-->
        <!--.patrol-dropdown{-->
          <!--padding:5px 12px;-->
          <!--border:1px solid #ddd;-->
          <!--border-radius: 4px;-->
          <!--cursor: pointer;-->
          <!--.link-span{-->
            <!--width:calc(220/1920*100vw);-->
            <!--min-width:100px;-->
            <!--margin:0;-->
            <!--display: inline-block;-->
          <!--}-->
        <!--}-->
        <!--.patrol-content{-->
          <!--padding: 0 30px;-->
          <!--.patrol-title{-->
            <!--font-size:14px;-->
            <!--color:#182752;-->
            <!--font-weight: bold;-->
            <!--margin:30px 0 20px 0;-->
          <!--}-->
        <!--}-->
      <!--}-->
      <!--.channelbar-content{-->
        <!--.rside-hr{-->
          <!--width: 100%;-->
          <!--border: 0.5px solid $border;-->
        <!--}-->
        <!--.channel-content{-->
          <!--width: 100%;-->
          <!--overflow: hidden;-->
          <!--margin-top: 10px;-->
          <!--span{-->
            <!--display: block;-->
            <!--text-align: left;-->
            <!--margin-left: 40px;-->
            <!--color: $black;-->
            <!--margin-bottom: 15px;-->
            <!--font-size: calc(16/1920*100vw);-->
          <!--}-->
          <!--.channels-srollbar{-->
            <!--text-align: left;-->
            <!--padding: 10px;-->
            <!--margin-left: 5%;-->
            <!--overflow: hidden;-->
            <!--min-height: 115px;-->
          <!--}-->
          <!--.arrow-content{-->
            <!--@include point(min-width,20);-->
            <!--min-height: 20px;-->
            <!--float: left;-->
            <!--margin-top: 20px;-->
            <!--width: 4%;-->
          <!--}-->
          <!--.icon-arrow{-->
            <!--cursor: pointer;-->
          <!--}-->
          <!--.btn-content{-->
            <!--width: 86%;-->
            <!--float: left;-->
            <!--display: flex;-->
            <!--.btn-details{-->
              <!--display: inline-block;-->
              <!--margin-bottom: 5px;-->
              <!--margin-left: calc(20/1920*100vw);-->
              <!--overflow: hidden;-->
              <!--white-space: nowrap;-->
              <!--text-overflow: ellipsis;-->
              <!--&:last-child{-->
                <!--margin-right: calc(20/1920*100vw);-->
              <!--}-->
            <!--}-->
          <!--}-->
        <!--}-->
      <!--}-->
    <!--}-->
    <!--.noraml-color{-->
      <!--background-color: #fff !important;-->
      <!--color: $black !important;-->
      <!--font-weight: bold;-->
    <!--}-->
    <!--.noraml-groupColor{-->
      <!--background-color: $background !important;-->
    <!--}-->
  <!--}-->
  <!--.patrol-content /deep/ .el-select .el-input&#45;&#45;medium .el-input__inner{-->
    <!--color:#333;-->
  <!--}-->
<!--</style>-->
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
      float: right;
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

