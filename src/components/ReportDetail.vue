<template>
  <div>
    <div v-for="(_item,_index) in reportDetailData" :key="_index" class="content-detail">
      <div class="content-detail-title">
        <div class="detail-title">
          <p class="title1" ><span class="pdf_font_20" :class= "{ is_important : _item.isImportant}" >{{ _index+1 }}.{{ _item.subject }}  </span>
          <span
            style="color: #85898e; font-size: 12px"
            v-if="_item.itemScore !== Number.MAX_VALUE"
            class="pdf_font_18"
            :class= "{ is_important_s  : _item.isImportant}"
            >
            {{ `( ${$t('remotePatrol.totalScoreUnit')}${_item.itemScore} )` }}</span></p>
          <p class="title2"><span class="pdf_font_18 title2_pdf">{{ _item.description }}</span></p>
        </div>
        <div v-if="_item.type === 0" class="score-title">
          <div
            v-if="_item.grade === Math.pow(-2,31)"
            :style="isExportPdf?{'width':'150px'}:{}"
            class="ignore-btn">
          <span class="pdf_font_18">{{ $t('remotePatrol.ignored') }}</span></div>
          <div
            v-if="groupType === 0 && _item.grade === 0"
            :style="isExportPdf?{'width':'150px'}:{}"
            class="title-btn-failed">
            <span class="pdf_font_18">{{ tab1BtnArr[1] }} </span>
          </div>
          <div
            v-if="groupType === 2 && _item.grade === 0"
            :style="isExportPdf?{'width':'150px'}:{}"
            class="title-btn-failed">
            <span class="pdf_font_18">{{ tab3BtnArr[1] }} </span>
          </div>
          <div
            v-if="groupType === 0 && _item.grade === 1"
            :style="isExportPdf?{'width':'150px'}:{}"
            class="title-btn-pass">
            <span class="pdf_font_18">{{ tab1BtnArr[0] }} </span>
          </div>
          <div
            v-if="groupType === 2 && _item.grade === 1"
            :style="isExportPdf?{'width':'150px'}:{}"
            class="title-btn-pass">
            <span class="pdf_font_18">{{ tab3BtnArr[0] }} </span>
          </div>
          <div
            v-if="groupType === 1 &&_item.grade!=Math.pow(-2,31)"
            :class="_item.grade < _item.qualifiedScore ? 'title-btn-failed' : 'title-btn-pass'"
            >
            <span class="pdf_font_18">{{ _item.grade }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="_item.showAttachment || _item.comment != null && _item.comment !== ''"
        class="content-detail-main"
        style="padding-bottom: 20px;">
        <p class="cdm-title"><span class="pdf_font_24">{{ $t('remotePatrol.commentDetail') }}</span></p>
        <div class="description-area">
          <div style="min-width:50%;">
            <audio-vue
              v-if="_item.showAudio"
              :is-export-pdf="isExportPdf"
              :audio-list="_item.audioList"
            />
          <!--<div v-if="_item.comment != null && _item.comment !== ''" class="cdm-word">-->
            <!--<span class="pdf_font_24">{{ _item.comment }}</span>-->
          <!--</div>-->

            <description-text
              v-if="_item.descriptionList.length > 0"
              :discription-list = "_item.descriptionList"
              class="description"
            />
          </div>
          <div v-if="_item.sourceList != null && _item.sourceList.length !== 0" class="cdm-pic source-content">
            <div
              v-for="(sourceitem,sourceindex) in _item.sourceList"
              :key="sourceindex"
              :height="imgHeight+'px'"
              class="source-details">
              <div
                v-if="sourceitem.mediaType === 2"
                :style="isExportPdf ? 'margin-right:20px;margin-bottom:20px' : ''"
                class="img-content">
                <el-image
                  :style="isExportPdf ? exportImageStyle :imageStyle"
                  :src="sourceitem.url"
                  :preview-src-list="getImgList(sourceindex, _item.sourceList)"
                  class="imgLittle imgInner"/>
              </div>
              <div
                v-if="sourceitem.mediaType==1"
                class="img-content "
                @click="playCommentVideo(sourceitem,sourceindex)">
                <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                <img
                  :style="isExportPdf ? 'width:260px;height:148px;':'width: calc(130/1920*100vw);'"
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
  </div>
</template>

<script>
import videojs from '../../static/video.js';
import 'videojs-contrib-hls';
import AudioVue from './AudioVue';
import DescriptionText from "./DescriptionText";
import util from '@/common/util.js';
export default {
  name: 'ReportDetail',
  components: {DescriptionText, AudioVue },
  props: {
    reportDetailData: {
      type: Array,
      default: () => []
    },
    groupType: {
      type: Number,
      default: 0
    },
    isExportPdf: {
      type: Boolean,
      default: false
    },
    tab1BtnArr: {
      type: Array,
      default: () => { [this.$t('remotePatrol.pass'), this.$t('remotePatrol.failed')]; }
    },
    tab3BtnArr: {
      type: Array,
      default: () => { [this.$t('remotePatrol.pass'), this.$t('remotePatrol.failed')]; }
    },
    groups: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogCommentVideo: false,
      startIcon: require('../../static/img/play_icon.png'),
      videoImgSrc: require('../../static/img/video_thumbnail.png'),
      deafultImg: 'this.src="' + require('../../static/img/picture_failed.png') + '"',
      exportImageStyle: {
        width: '260px',
        height: '148px'
      }
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
    },

    imageStyle() {
      return {
        'width': 'calc(130/1920*100vw)',
        'height': `${this.imgHeight}px`
      }
    }
  },

  methods: {
    playCommentVideo(item, index) {
      const self = this;
      console.log("Is H265="+item.isH265)
      if(item.isH265){
          util.notify(this.$t('eventView.videoFormatNotSupoort'), 'warning', 3 * 1000);
          return;
      }
      self.dialogCommentVideo = true;
      self.$nextTick(function() {
        var video = document.getElementById('previewVideo');
        this.previewplayer = videojs(video);
        this.previewplayer.src({ src: item.isH265 ? '' : item.url });
        this.previewplayer.play();
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

    stopCommentVideo() {
      var video = document.getElementById('previewVideo');
      this.previewplayer = videojs(video);
      this.previewplayer.pause();
    }
  }
};
</script>

<style scoped lang="scss">
  $red: #f31d65;
  $black: #182752;
  $border: #e3e9f4;
  $background: #f4f5f9;
  $tab: #7d8cad;
  $h1: #292e36;
  $qualified: #6097F3;
  $noqualied: #FDBA40;
  $suggestBack: #F1F6FE;
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
  .is_important {
    color: #f31d65 !important
  }
  .is_important_s {
    color: #fb6093 !important
  }
  .content-detail{
    margin-top: 10px;
    .content-detail-title{
      min-height:36px;
      // background-color:$background;
      padding-left:calc(20 / 1920 * 100vw);
      padding-right: calc(20 / 1920 * 100vw);
      padding-top:10px;
      padding-bottom: 10px;
      display: flex;
      .ignore-btn{
        width: calc(110/1920*100vw);
        padding: calc(5/1920*100vw) calc(20/1920*100vw);
        background-color: #f7f9fa;
        font-size: 13px;
        color:#556679;
        font-weight: bold;
        border-radius: 5px;
        text-align: center;
      }
      .title-btn-failed{
        width: calc(110/1920*100vw);
        padding: calc(5/1920*100vw) calc(20/1920*100vw);
        background-color: #ffefeb;
        font-size: 13px;
        color:#f57949;
        font-weight: bold;
        border-radius: 5px;
        text-align: center;
      }
      .title-btn-pass{
        width: calc(110/1920*100vw);
        padding: calc(5/1920*100vw) calc(20/1920*100vw);
        background-color: #e8f6de;
        font-size: 13px;
        color:#59ab22;
        font-weight: bold;
        border-radius: 5px;
        text-align: center;
      }
      .detail-title{
        flex: 1;
        .title1{
          font-size: 15px;
          color:#484848;
          font-weight: bold;
          margin:0 0 5px 0;
          text-align: left;
        }
        .title2{
          font-size: 15px;
          color:#7d8cad;
          margin: 15px 0 0 10px;
          text-align: left;
          word-break: break-all
        }
      }
      .score-title{
        display: inline-flex;
        flex-direction: column;
        width: auto;
        align-items: center;
      }
      .total-score{
        text-align: center;
        font-size: 12px;
        color: $black;
        margin-top: 4px;
      }
    }
    .content-detail-main{
      padding-top: 10px;
      padding-left:calc(20 / 1920 * 100vw);
      padding-right: calc(20 / 1920 * 100vw);
      .cdm-title{
        font-size:14px;
        color:#006ab7;
        font-weight: 500;
        padding-left:calc(10 / 1920 * 100vw);
      }
      .description-area{
        background-color:#f7f9fa;
        border-radius:5px;
        padding: 10px calc(10 / 1920 * 100vw) 18px calc(10 / 1920 * 100vw);
        display: flex;
        flex-direction: row;
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
                        word-break:break-all;
                  }
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
        .pdf_speech_info{
          width:160px;
          height:52px;
          background-color: #FFEDED;
          color: $red;
          border: 1px solid #FEC0C7;
          border-radius:30px;
          display: inline-block;
          .icon-speech{
            font-size:26px;
            line-height:52px;
            margin-left:10px;
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
  }

  .dialog-source-content{
    @include point(height,320);
    @include point(padding,20);

    img{
      height: 100%;
      width: 100%;
      object-fit: contain;
      user-select: none;
    }
  }
  .video-content{
    @include point(margin,20);
    padding-top: 0;
    position: relative;
    height: 100%;
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
  #previewVideo{
    @include point(min-width,450);
    @include point(min-height,360);
  }
</style>
