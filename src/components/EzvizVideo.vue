<template>
  <div>
    <div class="errorVideo-model" v-if="showError">
      <span>{{errorMsg}}</span>
    </div>
    <div class="video-content"  id="videoContent"
         @mouseleave="hiddenModel" @mouseenter="showModel" @mousemove="showModel" v-else>
      <!-- 录像时的动画 -->
      <div class="getvideo-content" v-if="showGetVideo">
        <div class="btn-graph">
          <canvas id="btn-graph-canvas" :width="graphBtnWidth" :height="graphBtnWidth"></canvas>
        </div>
        <canvas id="vcanvas"  :width="varyWindowWidth*0.418+'px'" :height="varyWindowWidth*0.282+'px'"></canvas>
      </div>
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
        <div class="screen-content">
          <i class="iconfont iconscreen"
             :class="fullWindow ? 'icon-tuichuquanping':'icon-quanping'"  @click="controlScreen"></i>
          <i class="iconfont icon-gongge iconscreen" @click="gonggeScreen" v-if="false"></i>
        </div>
      </div>
      <transition name='fade'>
        <div :class="lang== 'en'? 'en-iconright' : 'iconright'" v-if="showModelContent" @click="cutPicture">
          <i class="iconfont icon-xiangji iconpaizhao" style="font-size:18px;"></i>
          <span>抓拍</span>
        </div>
      </transition>
      <transition name="fade">
        <div :class="lang== 'en'? 'en-iconright1' : 'iconright1'" v-if="showModelContent" @click="getVideo">
          <i class="iconfont icon-luxiang iconpaizhao" v-if="lang =='en' " style="font-size:21px;"></i>
          <i class="iconfont icon-luxiang iconpaizhao" v-else style="font-size:21px"></i>
          <span>录像</span>
        </div>
      </transition>
      <div id="test">
        <div id="myPlayer" ref="myPlayer"></div>
      </div>

    </div>
    <el-dialog title="编辑截图"
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
                @mousemove="mouseMoveAction($event)"></canvas>
        <img :src="imgSrc" id="imgTest" style="display: none"/>
        <div class="cancel-content" v-if="showCancelContent" :style="{'width':767*percentHeight+'px',
                    'margin-left':47*percentHeight+'px'}">
          <div class="content" @click="cancelEditCanvas">
            <img :src="clearIconSrc" class="icon-clear" height="22px"/>
            <span>清空</span>
          </div>
          <div class="content" @click="confirmEditCanvas">
            <img :src="removeIconSrc" class="icon-clear" height="22px"/>
            <span>取消</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showCutDialog = false" size="mini">取消</el-button>
        <el-button id="confirmBtn" @click="confirmEdit" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title= "反馈"
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
                  @mousemove="mouseMoveAction($event)"></canvas>
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
          <span class="event-title">{{generatePatrolLang('name')}}</span>
          <el-input size="mini" class="name-input" maxlength="10" v-model="eventName"></el-input>
          <span class="event-title">{{generatePatrolLang('description')}}</span>
          <el-input size="mini" class="des-input" type="textarea"  resize='none' :autosize="{ minRows: 4}"
                    maxlength="300" v-model="eventDes" :placeholder="generatePatrolLang('descPlaceholder')"></el-input>
        </div>
      </div>
      <div slot="footer">
        <el-button id="cancelBtn" @click="showFeedDialog2 = false" size="mini">{{generatePatrolLang('cancel')}}</el-button>
        <el-button id="confirmBtn" @click="confirmAddFeedBack2" size="mini" type="primary">{{generatePatrolLang('confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import  EZUIKit from '../../static/ezuikit/ezuikit.js'
  import {getEzvizAccessToken} from '@/api/ezviz'
  import {generatePatrolLang} from '@/api/i18n'
  import {mapGetters} from 'vuex'

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
            showModelContent: true,
            showGetVideo: false,
            lang: this.$i18n.locale,
            decoder: null,
            videoSpeed:0,
            videoSpeedId: 0,
            showgongge: false,
            ifOpenSound: true,
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
          }
      },
      mounted(){
        this.initVideo();
      },
    beforeDestroy() {
      let self = this;
      console.log(self.playState)
      if(self.playState){
        self.decoder.closeSound();
        self.decoder.stop();
      }
    },
    watch: {
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.stopVideo();
        }
      },
      curDeviceId(oldValue, newValue){
        console.log("curDeviceId")
        let self = this;
        self.showError = false;
        console.log('new:', newValue);
        if( oldValue !== newValue){
          if(self.playState){
            self.decoder.stop();
          }
          self.$nextTick(()=> {
            self.decoder = null;
            console.log(self.$refs.myPlayer)
            self.initVideo();
          })
        }
       // return newValue;
      },
      showFeedBack(newValue, old){
        console.log(newValue + 'showFeedBack')
      },
      showFeedDialog2(newValue, old){
        console.log(newValue + 'showFeedDialog2')
      },
      //监听父组件的数值变化
      channelId(newValue, old) {
        console.log("channelId")
        let self = this;
        self.showError = false;
        if(newValue !== old){
          if(self.playState) {
            self.decoder.stop();
          }
          self.$nextTick(()=> {
            self.decoder = null;
            console.log(self.$refs.myPlayer)
            self.initVideo();
          })
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
    },
    methods: {
      generatePatrolLang,
      getEzvizAccessToken(){
        let self=this;
        return new Promise((resolve,reject)=>{
          getEzvizAccessToken().then(res=>{
            console.log(res);
            resolve(res);
          })
        })
      },
      async initVideo() {
        let self = this
        //let o = document.getElementById("myPlayer");
        if(self.channelInfo==null){
          return;
        }
        else{
          let o = self.$refs.myPlayer;
          let width = o.offsetWidth;
          let height = o.offsetHeight;
          console.log(width);
          console.log(height)
          self.videoUrl = 'ezopen://open.ys7.com/' + self.ivsId + '/' + self.channelId + '.live';
          //self.videoUrl = 'ezopen://open.ys7.com/203751922/1.live'
          let result = await getEzvizAccessToken();
          if(result.errCode=='0' && result.data != {}){
            self.accessToken = result.data.accessToken;
          }
          //self.accessToken = 'ra.abvxj86rb8cccc06b7wsepo5b3wzozfk-3usr6odcnu-0h12gcz-bnbvmyif1'
          // 初始化视频方法
          self.decoder = new EZUIKit.EZUIPlayer({
            id: 'myPlayer',
            autoplay: true,
            url: self.videoUrl,
            accessToken: self.accessToken,
            decoderPath: '../../static/ezuikit/',
            width: width,
            height: height,
            handleError: self.handleError,
            handleSuccess: self.handleSuccess,
          })
        }

      },
      handleError(e){
        console.log('捕获到错误',e)
        let self = this;
        self.errorMsg = e.msg;
        self.showError = true;
        self.playState = false;
        // log(JSON.stringify(e),'error');
        //alert(e)
      },
      handleSuccess(){
        console.log("播放成功回调函数，此处可执行播放成功后续动作");

        let self = this;
        self.playState = true;
        self.showError = false;
        self.errorMsg = '';
      },
      controlScreen(){
        let self=this;
        if(!self.fullWindow){
          self.fullWindowScreen();
          self.fullWindow=true;
          setTimeout(() => {
            self.showModelContent=false;
            self.showInfoContent=false;
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
        //将视频也全屏播放
        let o = document.getElementById("videoContent");
        let width = o.offsetWidth;
        let height = o.offsetHeight;
        // self.decoder.resize(width, height);
        self.decoder.resize(1920, 800);
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
        self.showInfoContent=true;
        if(self.playState){
          self.showModelContent=true;
        }
      },
      hiddenModel(){
        let self=this;
        self.showModelContent=false;
        self.showInfoContent=false;
      },
      //关闭实时视频
      realTime(){
        let self = this;
        self.initVideo();
        self.playState =  true;
      },
      stopRealTime(){
        let self = this;
        if(self.playState){
          self.decoder.closeSound();
          self.decoder.stop();
          self.decoder = null
        }
        self.playState = false;
      },
      openSound(){
        let self = this;
        self.ifOpenSound = true;
        self.decoder.openSound();
      },
      closeSound(){
        let self = this;
        self.ifOpenSound = false;
        self.decoder.closeSound();
      },
      stopVideo(){
        let self = this;
        if (self.playState){
          self.decoder.closeSound();
          self.decoder.stop();
          self.decoder = null;
        }
      },
      cutPicture(){
        //截图
        let self = this;
        self.decoder.capturePicture(0,'default');
        self.imageCanvasList=[];
        if(self.fullWindow){
          self.exitFullscreen();
          self.fullWindow=false;
        }
        if(self.showFeedBack){
          self.showFeedDialog2=true;
          self.eventName='';
          self.eventDes='';
          this.$nextTick(()=>{
            self.canvasEl = document.getElementById('icanvas');
            var ctx = self.canvasEl.getContext('2d');
            let img = new Image();
            setTimeout(() => {
              self.imgSrc = sessionStorage.getItem('fileUrl');
              let img = document.getElementById('imgTest');
              html2canvas(img).then(function (canvas) {
                ctx.drawImage(img, 0, 0, 767 * self.percentHeight, 431 * self.percentHeight);
                var oGrayImg = icanvas.toDataURL('image/jpeg');
                self.imageCanvas.src = oGrayImg;
                let imgObj = new Image();
                imgObj.src = oGrayImg;
                self.imageCanvasList.push(imgObj);
              })
            }, 1000)
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
              let img = document.getElementById('imgTest');
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
      //blob to dataurl
     fileOrBlobToDataURL(obj, cb){
        var a = new FileReader();
        a.readAsDataURL(obj);
        a.onload = function (e){
          console.log(e.target.result)
          cb(e.target.result);
        };
      },
      //dataurl to canvas
      dataURLToCanvas(dataurl, cb){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function(){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          cb(canvas);
        };
        img.src = dataurl;
      },

      getVideo(){
        //点击开始录像，10秒后关闭
        let self = this;
        self.showGetVideo=true;
        self.decoder.startSave(0, (new Date().getTime() + 'video'));
        let startTime = new Date().getTime();
        let interval = setInterval(function(){
          if(new Date().getTime() - startTime > 10000){
            clearInterval(interval);
            self.decoder.stopSave(0);
            return;
          }
        }, 100);
        setTimeout(()=>{
          var btn_canvas = document.getElementById("btn-graph-canvas");
          self.drawMain(btn_canvas, 100, "#f31d65", "#f31d65");
        },1000)
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
        this.$emit('confirmEzvizCanvas',src);
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
        console.log("鼠标抬起")
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
          self.notify(self.$t('remotePatrol.emptyTitle'),'warning',3000);
          return false;
        }
        self.$emit('ezvizCutPictureFeedback', obj);
        self.showFeedDialog2=false;
      },
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
    @include point(min-width,500);
    @include point(min-height,414);
    background-color: #232730;
    color: $red;
    span{
      position: absolute;
      top: 50%;
      left: 45%;
      font-size: 12px;
    }
  }
  .video-content{
    height: auto;
    position: relative;
    @include point(margin,20);
    @include point(min-width,500);
    @include point(min-height,408);
    background-color: #000;
    margin-bottom: 0;
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
      @include point(min-width,500);
      @include point(min-height,405);
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
      height: 45px;
      line-height: 45px;
      position: absolute;
      bottom: 0px;
      color: #fff;
      overflow: hidden;
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
      top: 40%;
      span{
        // font-size: 12px;
        margin-left: 15px;
        color: #fff;
        margin-right: 35px;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
        margin-left: 10px;
      }
    }
    .en-iconright{
      padding: 0 6px;
      width: 115px;
      height: 32px;
      line-height: 30px;
      position: absolute;
      z-index: 900;
      right: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      top: 40%;
      span{
        // font-size: 12px;
        margin-left: 15px;
        color: #fff;
        margin-right: 35px;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
        margin-left: 10px;
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
      span{
        margin-left: 12px;
        color: #fff;
        margin-right: 32px;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
        margin-left: 10px;
      }
    }
    .en-iconright1{
      padding: 0 6px;
      width: 115px;
      height: 32px;
      line-height: 30px;
      position: absolute;
      z-index: 900;
      right: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba($color: #24293d, $alpha: 0.6);
      top: 56%;
      span{
        margin-left: 12px;
        color: #fff;
        margin-right: 32px;
        cursor: pointer;
        vertical-align:middle;
      }
      .iconpaizhao{
        color: #fff;
        cursor: pointer;
        vertical-align:middle;
        margin-left: 10px;
      }
    }
  }
  .canvas-content{
    position: relative;

    .dialog-hr{
      border: 0.5px solid ;
      border-color: rgba(251,76,93,0.3);
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
      .name-input{
        @include point(width,150);
        @include point(margin-bottom,15);
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
