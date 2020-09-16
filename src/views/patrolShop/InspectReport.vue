<template>
  <div class="report-container" ref="printPDF">
    <img :src="report.iconSrc" alt="" class="report-img" :height="reportImgHeight"/>
    <div class="el-header">
      <img class="title-icon" :src="report.inspectSrc"/>
      <span class="report-title">{{report.storeName+' '+report.tagName+' ('+report.inspectType+')'}}</span>
      <div class="info-content" :style="isexportPDF?'margin-right:40px;':''">
        <span class="info-label">{{generateReportLang('submitter')}}</span>
        <span class="info-value">{{report.submitterName}}</span>
        <span class="info-label">{{generateReportLang('generateTime')}}</span>
        <span class="info-value">{{report.dateStr}}</span>
        <div style="display:inline-block;">
          <div class="no-print">
            <div class="exportbtn" @click="handleDown">
              <i class="iconfont icon-pdf export"></i>
              <span>{{generateReportLang('InspectionDetail')}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="el-acticle">
      <div class="suggest" v-if="suggest!=null&&suggest.length!=0">
        <div class="suggest-content">
          <span>{{generateReportLang('advice')}}</span>
          <span v-html="turnSuggest(suggest)"></span>
        </div>
      </div>
      <el-row class="report-content">
        <el-col :span="24" class="radior-content">
          <div class="header-score">
              <span class="span-1">{{$t('remotePatrol.getscore')}}：</span>
              <span class="span-2">{{totalScore}} <span>{{$t('remotePatrol.scorecount')}}</span></span>
              <span class="span-3">({{$t('remotePatrol.scorerule')}})</span>
              <span class="span-4">{{$t('remotePatrol.scoreU')}}</span>
          </div>
          <v-chart :options="options" class="chart-content" :auto-resize='true' ref="chartRadar"/>
        </el-col>
      </el-row>
      <el-row class="row-table">
        <el-col>
          <table class="table table-bordered" v-for="(s_item,s_index) in tableData" :key="s_index">
                    <thead>
                        <tr v-if="s_item[0].type==0">
                            <th scope="col" v-for="(t_item ,t_index) in theaderPassFail" :key="t_index" :style="t_item.width">{{t_item.name}}</th>
                        </tr>
                        <tr v-if="s_item[0].type==1">
                            <th scope="col" v-for="(t_item ,t_index) in theaderScore" :key="t_index" :style="t_item.width">{{t_item.name}}</th>
                        </tr>
                        <tr v-if="s_item[0].type==2">
                            <th scope="col" v-for="(t_item ,t_index) in theaderOther" :key="t_index" :style="t_item.width">{{t_item.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td :rowspan="s_item.length+1">
                                <span v-if="s_item[0].type==0" :style="'line-height:'+18*s_item.length+'px;'">{{$t('insSettingView.sheetpassfail')}}</span>
                                <span v-if="s_item[0].type==1" :style="'line-height:'+18*s_item.length+'px;'">{{$t('insSettingView.sheetscore')}}</span>
                                <span v-if="s_item[0].type==2" :style="'line-height:'+18*s_item.length+'px;'">{{$t('insSettingView.sheetother')}}</span>
                            </td>
                        </tr>
                        <tr v-for="(item,index) in s_item" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                            <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{item.groupName}}</span><span class="count-blag">{{item.numOfTotalItems}}</span></td>
                            <td v-if="item.type==0||item.type==2"><span>{{item.numOfQualifiedItems}}</span></td>
                            <td v-if="item.type==0||item.type==2"><span>{{item.numOfUnqualifiedItems}}</span></td>
                            <td v-if="item.type==1"><span>{{item.totalScore}}</span></td>
                            <td v-if="item.type==1||item.type==2"><span>{{item.numOfIgnored}}</span></td>
                            <td v-if="item.type==1||item.type==2"><span>{{item.actualScore}}</span></td>
                        </tr>
                    </tbody>
                </table>
        </el-col>
      </el-row>
      <el-row class="row-footer">
        <el-col :span="tempList.length == 4 ? 6 : 8" v-for="(item,index) in tempList" :key="index" class="details-content">
          <div class="details" v-if="index < 3">
            <div class="item-header">
              <i class="iconfont icontemp" :class="item.iconSrc"></i>
              <span class="title-lable">{{item.itemTitleName}}</span>
              <div class="count-content">
                <span class="count">{{item.itemCount}}</span>
                <span class="blag">{{generateReportLang('unit')}}</span>
              </div>
            </div>
            <div class="item-content">
              <el-scrollbar style="height:100%;" class="el-menuscrollbar">
                <div class="item-details" v-for="_item in item.itemList" :key="_item.id">
                  <div class="item-blag"></div>
                  <span class="item-name">{{index!=2?_item.name:_item.subject}}</span>
                  <span class="item-des"></span>
                </div>
              </el-scrollbar>
              <span class="moreInfotip" v-if="item.itemCount>6&&isexportPDF">{{generateReportLang('more')}}</span>
            </div>
          </div>
          <div class="details" v-else>
            <div class="item-header">
              <i class="iconfont icontemp" :class="item.iconSrc"></i>
              <span class="title-lable">{{item.itemTitleName}}</span>
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
          <div class="item-header" @click="isup?isup=false:isup=true">
            <i class="iconfont icon-zhedie1 icontemp" v-if="isup" style="color: #eb1d63;"></i>
            <i class="iconfont icon-zhankai1 icontemp" v-if="!isup" style="color:#7d8cad;"></i>
            <span class="title-lable">{{$t('remotePatrol.detailInfo')}}</span>
          </div>
          <div class="item-content" v-show="isup">
              <div style="border-bottom:1px solid #f4f5f9;margin-bottom:20px;" v-for="(item,index) in groups" :key="index">
                <div class="content-title">{{item.groupName}}</div>
                <div class="content-detail" v-for="(_item,_index) in item.items" :key="_index">
                  <div class="content-detail-title">
                    <div class="detail-title">
                      <p class="title1">{{_index+1}}.{{_item.subject}}</p>
                      <p class="title2">{{_item.description}}</p>
                    </div>
                    <div class="ignore-btn" v-if="_item.grade==-1">{{$t('remotePatrol.ignored')}}</div>
                    <div class="title-btn" v-if="(item.groupType==0||item.groupType==2)&&_item.grade==0">{{$t('remotePatrol.scoreUnit')}}{{$t('remotePatrol.failed')}}</div>
                    <div class="title-btn" v-if="(item.groupType==0||item.groupType==2)&&_item.grade==1">{{$t('remotePatrol.scoreUnit')}}{{$t('remotePatrol.pass')}}</div>
                    <div class="title-btn" v-if="item.groupType==1&&_item.grade!=-1">{{$t('remotePatrol.scoreUnit')}}{{_item.grade}}</div>
                  </div>
                  <div class="content-detail-main" style="padding-bottom: 20px;" v-if="_item.showAttachment||_item.comment!=null&&_item.comment!=''">
                    <p class="cdm-title">{{$t('remotePatrol.commentDetail')}}</p>
                      <div class="cdm-voice" v-if="_item.showAudio">
                        <div class="speech-info" @click="startSpeechItem(_item,_index)">
                            <i class="iconfont icon-yuyin icon-speech"></i>
                        </div>
                        <audio :ref="_item.audio.audioRef" @canplay="getGroupsDuration(_item)">
                            <source :src="_item.audio.audioSrc" type="audio/mpeg" />
                        </audio>
                        <span class="often-text">{{_item.audio.audioOftenText}}</span>
                      </div>
                      <div class="cdm-word" v-if="_item.comment!=null&&_item.comment!=''">
                        <span>{{_item.comment}}</span>
                      </div>
                      <div class="cdm-pic" v-if="_item.sourceList!=null&&_item.sourceList.length!=0">
                          <div v-for="(sourceitem,sourceindex) in _item.sourceList" :key="sourceindex" class="source-details" :height="imgHeight+'px'">
                            <div v-if="sourceitem.mediaType==2" class="img-content">
                                <img class="imgLittle imgInner" :title="imgTitle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'"
                                :src="sourceitem.url" :height="imgHeight+'px'" :onerror='deafultImg'
                                @click="openOuter(sourceitem,$event)"/>
                            </div>
                            <div  v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,sourceindex)">
                                <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                <img class="imgLittle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'" :src="videoImgSrc" :height="imgHeight+'px'"/>
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <div style="margin-bottom:20px;" v-if="showFeedBacks">
                <div class="content-title">{{$t('remotePatrol.feedbacks')}}</div>
                <div class="content-detail" v-for="(item,index) in feedbacks" :key="index">
                  <div class="content-detail-title" style="background-color:#fff;height:30px;">
                    <div class="detail-title">
                      <p class="title1">{{index+1}}.{{item.subject}}</p>
                    </div>
                  </div>
                  <div class="content-detail-main" v-if="item.showAttachment||item.description!=null&&item.description!=''">
                    <p class="cdm-title">{{$t('remotePatrol.description')}}：</p>
                      <div class="cdm-voice" v-if="item.showAudio">
                        <div class="speech-info" @click="startSpeechFeedBacks(item,index)">
                            <i class="iconfont icon-yuyin icon-speech"></i>
                        </div>
                        <audio :ref="item.audio.audioRef" @canplay="getFeedBacksDuration(item)">
                            <source :src="item.audio.audioSrc" type="audio/mpeg" />
                        </audio>
                        <span class="often-text">{{item.audio.audioOftenText}}</span>
                      </div>
                      <div class="cdm-word" v-if="item.description!=null&&item.description!=''">
                        <span>{{item.description}}</span>
                      </div>
                      <div class="cdm-pic" v-if="item.sourceList!=null&&item.sourceList.length!=0">
                          <div v-for="(sourceitem,index) in item.sourceList" :key="index" class="source-details" :height="imgHeight+'px'">
                            <div v-if="sourceitem.mediaType==2" class="img-content">
                                <img class="imgLittle imgInner" :title="imgTitle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'"
                                :src="sourceitem.url" :height="imgHeight+'px'" :onerror='deafultImg'
                                @click="openOuter(sourceitem,$event)"/>
                            </div>
                            <div v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,index)">
                                <img class="start-icon" :src="startIcon" :height="imgHeight*0.4+'px'"/>
                                <img class="imgLittle" :style="isexportPDF?'width:130px;':'width: calc(130/1920*100vw);'" :src="videoImgSrc" :height="imgHeight+'px'"/>
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <el-dialog  :title="$t('eventView.view')" :visible.sync="dialogCommentVideo" :close-on-click-modal="false"
            v-if="dialogCommentVideo" width="850px" top="12%" @close="stopCommentVideo" class='rate-video-dialog'>
                <div class="video-dialog-content" style="overflow:hidden;">
                    <hr class="dialog-hr"/>
                    <div class="video-content" >
                        <video  height=83% width=90% id="previewVideo" prload  controls
                            class="video-js vjs-fill">
                        </video>
                    </div>
                </div>
            </el-dialog>
            <transition name="fade">
                <el-dialog :title="$t('eventView.view')"
                :visible.sync="showOuter" :close-on-click-modal="false" v-if="showOuter" width="850px" top="12%">
                <div class="video-dialog-content" style="overflow:hidden;text-align:center;">
                    <hr class="dialog-hr"/>
                    <div class="dialog-source-content">
                        <img v-if="showImg" :src="checkImgSrc"/>
                    </div>
                </div>
                </el-dialog>
            </transition>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/radar'
  import {getInspectReportList, getInspectReportInfo,getInspectReportDetail} from '../../api/inspect'
  import util from '@/common/util'
  import {generateReportLang} from '@/api/i18n'
  import filterString from "../../common/filterString";
  import videojs from '../../../static/video.js'
  import 'videojs-contrib-hls';

  export default {
    name: 'InspectReport',
    components: {
      'v-chart': ECharts
    },
    computed: {
      reportImgHeight() {
        return (this.varyWindowWidth / 1920) * 100;
      },
      imgHeight(){
            let height=0;
            if(this.varyWindowWidth>1800){
                height= this.varyWindowWidth*0.039;
            }
            else if(this.varyWindowWidth>1400){
                height= this.varyWindowWidth*0.035;
            }
            else{
                height=75;
            }
            return height;
        }
    },
    data() {
      return {
        reportId: 0,
        varyWindowWidth: window.innerWidth,

        videoSrc: require('../../../static/img/监控icon.png'),
        inspectSrc: require('../../../static/img/远程icon.png'),
        insiteInspectSrc: require('../../../static/img/现场icon.png'),

        inspectSrc1: require('../../../static/img/总评icon1.png'),
        inspectSrc2: require('../../../static/img/总评icon2.png'),
        inspectSrc3: require('../../../static/img/总评icon3.png'),
        inspectSrc4: require('../../../static/img/总评icon4.png'),
        inspectSrc5: require('../../../static/img/总评icon5.png'),
        inspectSrc6: require('../../../static/img/总评icon6.png'),
        inspectSrc7: require('../../../static/img/总评icon7.png'),
        inspectSrc8: require('../../../static/img/总评icon8.png'),
        inspectSrc9: require('../../../static/img/总评icon9.png'),
        inspectSrc10: require('../../../static/img/总评icon10.png'),
        report: null,
        suggest: '',
        summary: [],
        totalScore:'',
        tableData:[],
        tempList: [],
        options: null,
        theaderList: [
          {
            name: this.$t('reportView.items'),
          },
          // {
          //   name: this.$t('reportView.goodItem')
          // },
          {
            name: this.$t('reportView.passItem')
          },
          {
            name: this.$t('reportView.failedItem')
          }
        ],
        pass: this.$t('reportView.pass'),
        failed: this.$t('reportView.failed'),
        lang: this.$i18n.locale,
        isInsiteInspect: false,
        sidebarElm: null,
        isup:false,
        isexportPDF:false,
        groups:[],
        feedbacks:[],
        showFeedBacks:false,
        dialogCommentVideo:false,
        showOuter:false,
        showImg:false,
        checkImgSrc:'',
        previewplayer:'',
        imgTitle:'',
        startIcon:require('../../../static/img/pic_play_icon.png'),
        videoImgSrc:require('../../../static/img/image_videoThumbnail.png'),
        deafultImg:'this.src="' + require('../../../static/img/pic2.png') + '"',
        theaderPassFail:[
            {name: '',width:'width:11%;'},
            {name: this.$t('remotePatrol.item'),width:'width:22.2%;'},
            {name: this.$t('remotePatrol.pass'),width:'width:35%;'},
            {name: this.$t('remotePatrol.failed'),width:'width:35%;'}
        ],
        theaderScore:[
            {name: '',width:'width:10%;'},
            {name: this.$t('remotePatrol.item'),width:'width:20%;'},
            {name: this.$t('remotePatrol.TableTotal'),width:'width:20%;'},
            {name: this.$t('remotePatrol.TableIgnore'),width:'width:20%;'},
            {name: this.$t('remotePatrol.TableGet'),width:'width:20%;'}
        ],
        theaderOther:[
            {name: '',width:'width:10%;'},
            {name: this.$t('remotePatrol.item'),width:'width:20%;'},
            {name: this.$t('remotePatrol.pass'),width:'width:15%;'},
            {name: this.$t('remotePatrol.failed'),width:'width:15%;'},
            {name: this.$t('remotePatrol.TableIgnore'),width:'width:15%;'},
            {name: this.$t('remotePatrol.TableGet'),width:'width:15%;'}
        ],
      }
    },
    methods: {
      generateReportLang,
      handleDown(){
        let self = this
        new Promise(function(resolve) {
            self.isup=true
            self.isexportPDF=true
            resolve(true)
        }).then(function() {
            self.$print(self.$refs.printPDF);
            self.isexportPDF=false
        })
      },
      getRouterData() {
        let self = this;
        let routeData = JSON.parse(sessionStorage.getItem('report_data'));
        let obj = {};
        obj.reportId = routeData.id;
        obj.storeName = routeData.storeName;
        obj.status = routeData.status;
        obj.dateStr = util.getDateStr(routeData.ts);
        obj.submitterName = routeData.submitterName;
        obj.tagName = routeData.tagName;
        switch (routeData.mode) {
          case 0:
            obj.inspectSrc = self.inspectSrc;
            obj.inspectType = self.$t('overview.remotePatrol')
            break;
          case 1:
            obj.inspectSrc = self.insiteInspectSrc;
            self.isInsiteInspect = true;
            obj.inspectType = self.$t('overview.onsitePatrol')
            break;
          default:
            obj.inspectSrc = self.videoSrc;
            break;
        }
        switch (routeData.status) {
          // case 0: {
          //   obj.iconSrc=self.inspectSrc1;
          //   break;
          // }
          // case 1: {
          //   obj.iconSrc=self.inspectSrc3;
          //   break;
          // }
          // default:{
          //   obj.iconSrc=self.inspectSrc2;
          //   break;
          // }
          /**
           * 根据语言和类型返回图片形式
           */
          case 0: {
            // 立即督导
            if (self.lang == 'zh') {
              obj.iconSrc = self.inspectSrc1;
            }
            else if (self.lang == 'en') {
              obj.iconSrc = self.inspectSrc4;
            }
            else if (self.lang == 'zhtw') {
              obj.iconSrc = self.inspectSrc7;
            }
            else {
              obj.iconSrc = self.inspectSrc1;
            }
            break;
          }
          case 1: {
            // 待改善
            if (self.lang == 'zh') {
              obj.iconSrc = self.inspectSrc3;
            }
            else if (self.lang == 'en') {
              obj.iconSrc = self.inspectSrc6;
            }
            else if (self.lang == 'zhtw') {
              obj.iconSrc = self.inspectSrc3;
            }
            else {
              obj.iconSrc = self.inspectSrc3;
            }
            break;
          }

          case 2: {
            //合格
            if (self.lang == 'zh') {
              obj.iconSrc = self.inspectSrc2;
            }
            else if (self.lang == 'en') {
              obj.iconSrc = self.inspectSrc5;
            }
            else if (self.lang == 'zhtw') {
              obj.iconSrc = self.inspectSrc2;
            }
            else {
              obj.iconSrc = self.inspectSrc2;
            }
            break;
          }
          default: {
            //good
            if (self.lang == 'zh') {
              obj.iconSrc = self.inspectSrc8;
            }
            else if (self.lang == 'en') {
              obj.iconSrc = self.inspectSrc9;
            }
            else if (self.lang == 'zhtw') {
              obj.iconSrc = self.inspectSrc10;
            }
            else {
              obj.iconSrc = self.inspectSrc8;
            }
            break;
          }
        }
        self.report = obj;
      },
      async getReportDetail(){
        let self = this
        let params = {
          reportId: self.report.reportId
        };
        getInspectReportDetail(params).then(res => {
          console.log(res)
          let data = res.data
          let temp=[];
          let feedtemp=[]
          // let gradetotal = []
          data.groups.forEach((groupitem,groupindex)=>{
            let obj={
              items:[]
            };
            obj.groupId = groupitem.groupId
            obj.groupName = groupitem.groupName
            obj.groupType=groupitem.groupType
            groupitem.items.forEach((item,index)=>{
              let details = {}
              details.subject = item.subject
              details.comment = item.comment
              details.description = item.description
              details.grade = item.grade
              // gradetotal.push(item.grade)
              if(item.attachment.length!=0){
              let _temp=[];
              let audioObj={};
              details.showAttachment = true
              item.attachment.forEach((_item,_index)=>{

                  if(_item.mediaType==0){
                      audioObj.audioSrc=_item.url;
                      audioObj.audioRef='audioRef'+groupindex+index+_index;
                      audioObj.isPlaying=false;
                      audioObj.audioOftenText='';
                      details.showAudio=true;
                  }
                  else{
                      _temp.push(_item);
                  }
              })
              details.audio=audioObj;
              details.sourceList=_temp;
              }else{
                details.showAttachment = false
              }
              obj.items.push(details)
            })
            temp.push(obj);
          })
          self.groups=temp
          if(data.feedbacks.length==0){
            this.showFeedBacks = false
          }else{
            this.showFeedBacks = true
            data.feedbacks.forEach((item,index)=>{
            let obj={};
              obj.subject = item.subject
              obj.description = item.description
              if(item.attachment.length!=0){
              let _temp=[];
              let audioObj={};
              obj.showAttachment = true
              item.attachment.forEach((_item,_index)=>{

                  if(_item.mediaType==0){
                      audioObj.audioSrc=_item.url;
                      audioObj.audioRef='audioRef'+index;
                      audioObj.isPlaying=false;
                      audioObj.audioOftenText='';
                      obj.showAudio=true;
                  }
                  else{
                      _temp.push(_item);
                  }
              })
              obj.audio=audioObj;
              obj.sourceList=_temp;
              }else{
                obj.showAttachment = false
              }
            feedtemp.push(obj);
          })
          self.feedbacks = feedtemp
          }
        })
      },
      stopCommentVideo(){
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.pause();
        },
      playCommentVideo(item,index){
            let self=this;
            self.dialogCommentVideo=true;
            self.$nextTick(function(){
                var video = document.getElementById("previewVideo");
                this.previewplayer = videojs(video);
                this.previewplayer.src({src:item.url});
                this.previewplayer.play();
            })

        },
      openOuter(item,$ev){
            let self=this;
            console.log(item);
            console.log($ev.target.onerror);
            if(item!=null){
                self.showOuter=true;
                self.checkImgSrc=item.url;
                self.showImg=true;
            }
        },
      getGroupsDuration(item){
            let self=this;
            console.log(item)
            if(item.showAudio){
                let audio=self.$refs[item.audio.audioRef][0];
                let du=audio.duration;
                console.log(du)
                if(isNaN(du)){
                    item.showAudio=false;
                }
                else{
                    let duration = Math.floor(du);
                    if(duration === 0){
                      du = 1;
                    }
                    item.audio.audioOftenText=parseInt(du)+'"';
                    console.log(item.audio.audioOftenText);
                }
            }
        },
        getFeedBacksDuration(item){
            let self=this;
            console.log(item)
            if(item.showAudio){
                let audio=self.$refs[item.audio.audioRef][0];
                let du=audio.duration;
                console.log(du)
                if(isNaN(du)){
                    item.showAudio=false;
                }
                else{
                    let duration = Math.floor(du);
                    if(duration === 0){
                      du = 1;
                    }
                    item.audio.audioOftenText=parseInt(du)+'"';
                    console.log(item.audio.audioOftenText);
                }
            }
        },
      startSpeechItem(item,index){
            let self=this;
            if(!item.audio.isPlaying){
                self.$refs[item.audio.audioRef][0].play();
                item.audio.isPlaying=true;
            }
            else{
                self.$refs[item.audio.audioRef][0].pause();
                item.audio.isPlaying=false;
            }
            self.groups.forEach((groupitem,groupindex)=>{
              groupitem.items.forEach((_item,_index)=>{
                if(_item.audio!=undefined){
                    if(_index!=index){
                      if(self.$refs[_item.audio.audioRef]!=undefined){
                        self.$refs[_item.audio.audioRef][0].pause();
                        _item.audio.isPlaying=false;
                      }
                    }
                }
              })
            })
        },
        startSpeechFeedBacks(item,index){
            let self=this;
            if(!item.audio.isPlaying){
                self.$refs[item.audio.audioRef][0].play();
                item.audio.isPlaying=true;
            }
            else{
                self.$refs[item.audio.audioRef][0].pause();
                item.audio.isPlaying=false;
            }
              self.feedbacks.forEach((_item,_index)=>{
                if(_item.audio!=undefined){
                    if(_index!=index){
                      if(self.$refs[_item.audio.audioRef]!=undefined){
                        self.$refs[_item.audio.audioRef][0].pause();
                        _item.audio.isPlaying=false;
                      }
                    }
                }
              })
        },
      async getReportInfo() {
        let self = this;
        let reportId = self.report.reportId;
        let temp = [];
        temp.push(reportId);
        let params = {
          reportIds: temp
        };
        getInspectReportInfo(params).then(res => {
          console.log(res);
          let data = res.data[0].info;
          self.suggest = data.comment;
          let summary = data.summary;
          let te_temp=[]
          for(let i=0;i<3;i++){
              let Typeindex=summary.filter(x=>x.type==i);
              if(Typeindex.length!=0){
                Typeindex[0].type==0 ? te_temp.push(Typeindex) : ''
                Typeindex[0].type==1 ? te_temp.push(Typeindex) : ''
                Typeindex[0].type==2 ? te_temp.push(Typeindex) : ''
              }
          }
          self.tableData=te_temp
          self.totalScore=data.totalScore
          let summaryTemp = [];
          summary.forEach(item => {
            let obj = {};
            obj.groupId = item.groupId;
            obj.groupName = item.groupName;
            obj.count = item.numOfTotalItems;
            obj.isQua = item.result == 1 ? true : false;
            obj.numOfExcellentItems = item.numOfExcellentItems;
            obj.numOfQualifiedItems = item.numOfQualifiedItems;
            obj.numOfUnqualifiedItems = item.numOfUnqualifiedItems;
            summaryTemp.push(obj);
          })
          self.summary = summaryTemp;
          let tempArray = [];
          self.isInsiteInspect && data.signature ? tempArray = new Array(4) : tempArray = new Array(3);
          tempArray[0] = {
            itemTitleName: self.$t('reportView.notableItem'),
            iconSrc: 'icon-zhongxindingwei',
            itemCount: data.focalItems.length,
            itemList: data.focalItems
          }
          tempArray[1] = {
            itemTitleName: self.$t('reportView.ignoredItem'),
            iconSrc: 'icon-hulve',
            itemCount: data.ignoredItems.length,
            itemList: data.ignoredItems
          }
          tempArray[2] = {
            itemTitleName: self.$t('reportView.feedbacks'),
            iconSrc: 'icon-fankui',
            itemCount: data.feedback.length,
            itemList: data.feedback
          }
          if (self.isInsiteInspect && data.signature) {
            tempArray[3] = {
              itemTitleName: self.$t('reportView.signature'),
              iconSrc: 'icon-fankui',
              itemCount: '',
              itemList: data.signature.content
            }
          }
          self.tempList = tempArray;
          self.getRadarOption();
        })
      },
      getRadarOption() {
        let self = this;
        let options = {
          backgroundColor: '#fff',
          tooltip: {
            backgroundColor: 'rgba(30,34,52,0.75)'
          },
          textStyle:{
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
                  console.log(params);
                  let str = '';
                  if (params.length > 10) {
                    str = params.substr(0, 10) + '...';
                  }
                  else {
                    str = params;
                  }
                  return str;
                },
              },
              splitArea:{
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
                },
              },
              splitArea:{
                show: false
              }
            }
          ],
          series: [{
            type: 'radar',
            data: [],
          },
            {
              type: 'radar',
              data: [],
              name: self.$t('remotePatrol.category'),
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
                },
              },
              tooltip: {
                trigger: 'item'
              },
            }
          ]
        };
        let tempIndicator = [];
        let seriesValue = [];
        self.summary.forEach(item => {
          let obj = {};
          obj.name = item.groupName;
          obj.max = Number(item.numOfQualifiedItems+item.numOfUnqualifiedItems)==0 ? 1 : Number(item.numOfQualifiedItems+item.numOfUnqualifiedItems);
          tempIndicator.push(obj);
          seriesValue.push(item.numOfQualifiedItems);
        });
        let temp = [];
        let obj = {value: seriesValue};
        temp.push(obj);
        options.radar[0].indicator = tempIndicator;
        options.radar[1].indicator = tempIndicator;
        options.series[0].data = temp;
        options.series[1].data = temp;
        if (tempIndicator.length < 6) {
          options.radar.splitNumber = tempIndicator.length;
        }
        else {
          options.radar.splitNumber = 5;
        }
        self.options = options;
      },
      turnSuggest(data) {
        return data.replace(/(\r\n|\n|\r)/gm, "<br/>");
      },
      handleSideBar(e){
        if(e.target === e.currentTarget || e.target === this){
          this.adjustChart();
        }
      },
      adjustChart(){
        let self = this;
        console.log('尺寸改变');
        if (self.$refs.chartRadar) {
          self.$refs.chartRadar.resize()
        }
      },
    },
    created(){
      this.getRouterData();
    },
    mounted() {
      let self = this;
      window.addEventListener("resize", self.adjustChart, false);
      self.sidebarElm = document.getElementsByClassName('aside-menu')[0]
      self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false)
      self.getReportInfo();
      self.getReportDetail()
      //self.getRadarOption();
    },
    beforeDestroy(){
      let self = this;
      window.removeEventListener('resize', self.adjustChart);
      self.adjustChart = null;
      self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar,false)
      if (self.$refs.chartRadar) {
        self.$refs.chartRadar.dispose()
      }
    }
  }
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
          padding-right: calc(20 / 1920 * 100vw);
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
                    margin-left: calc(20/1920*100vw);
                    display: inline-block;
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
              .item-blag {
                width: calc(12 / 1920 * 100vw);
                height: calc(12 / 1920 * 100vw);
                border-radius: 50%;
                background-color: $tab;
                display: inline-block;
                margin-right: calc(16 / 1920 * 100vw);
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
                        position: relative;
                        cursor: pointer;
                        .start-icon{
                            position: absolute;
                            left: 35%;
                            top: 30%;
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
