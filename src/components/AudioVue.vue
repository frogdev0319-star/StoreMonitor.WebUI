<template>
  <div :class="{'noPadding': !ifShowMargin}" class="cdm-voice">
    <div
      v-for="(audioItem, audioIndex) of audioList"
      :key="audioItem.audioRef"
      class="item">
      <div class="container">
        <audio :ref="`ref${audioIndex}`" @canplay="getDuration(audioItem, audioIndex)" @ended="onEndAudio(audioItem)">
          <source :src="audioItem.audioSrc" type="audio/mpeg" >
        </audio>
        <div class="duration">{{ audioItem.audioOftenText }}</div>
        <div class="img-area">
          <img v-show="!audioItem.isPlaying" :src="audioPng" class="audio-img">
          <img v-show="audioItem.isPlaying" :src="audioPlayGif" class="audio-img">
        </div>
        <div class="btnPlay">
          <img v-show="!audioItem.isPlaying" :src="imgPlay" style="width:14px;height:14px;" @click="startAudio(audioItem, audioIndex)">
          <img v-show="audioItem.isPlaying" :src="imgPause" class="width:10px;height:13px;">
        </div>
      </div>
      <!--<div :class="isExportPdf ? 'pdf_speech_info' : 'speech-info'" @click="startAudio(audioItem, audioIndex)">
        <i v-show="!audioItem.isPlaying" class="iconfont icon-yuyin icon-speech"/>
        <img v-show="audioItem.isPlaying" :src="audioPlayGif" class="audio-gif icon-speech">
      </div>
      <audio :ref="`ref${audioIndex}`" @canplay="getDuration(audioItem, audioIndex)" @ended="onEndAudio(audioItem)">
        <source :src="audioItem.audioSrc" type="audio/mpeg" >
      </audio>
      <span v-show="audioItem.hasNotPlayAudio" class="not-play-audio"/>
      <span :class="audioItem.hasNotPlayAudio ? 'time-text' : 'has-play-time-text'">
        {{ audioItem.audioOftenText }}
      </span>-->
    </div>
  </div>
</template>
<script>
export default {
  name: 'AudioVue',

  props: {
    isExportPdf: {
      type: Boolean,
      default: false
    },
    ifShowMargin: {
      type: Boolean,
      default: true
    },
    audioList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      audioPlayGif: require('../../static/img/audio-play.gif'),
      audioPng: require('../../static/img/audio.png'),
      imgPlay:require('../../static/img/audio_play.svg'),
      imgPause:require('../../static/img/audio_pause.svg'),
    };
  },

  methods: {
    startAudio(audioItem, audioIndex) {
      this.audioList.forEach((audio, index) => {
        audio.isPlaying = false;
        this.$refs[`ref${index}`][0].pause();
      });
      audioItem.hasNotPlayAudio = false;
      if (!audioItem.isPlaying) {
        this.$refs[`ref${audioIndex}`][0].play();
        audioItem.isPlaying = true;
      } else {
        this.$refs[`ref${audioIndex}`][0].pause();
        audioItem.isPlaying = false;
      }
    },

    onEndAudio(audioItem) {
      audioItem.isPlaying = false;
    },

    getDuration(audioItem, audioIndex) {
      const self = this;
      const audio = self.$refs[`ref${audioIndex}`][0];
      let du = audio.duration;
      if (isNaN(du)) {
        this.showAudio = false;
      } else {
        const duration = Math.floor(du);
        if (duration === 0) {
          du = 1;
        }
        let min = (du/60).toFixed(0).padStart(2, '0');
        let sec = (du%60).toFixed(0).padStart(2, '0');
        audioItem.audioOftenText = min+":"+sec;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
  .container{
    width: 226px;
    height: 30px;
    padding: 1px 0px 1px 12px;
    border-radius: 5px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    .duration{
      width: 30px;
      height: 14px;
      margin: 7px 12.4px 7px 0;
      font-family: Roboto;
      font-size: 12px;
      text-align: left;
      color: #6e6e6e;
    }
    .img-area{
      width: 148px;
      height: 14px;
      
      .audio-img{
        width: 128px;
        height: 8.6px;
      }
    }
    .btnPlay{
      width: 33px;
      height: 28px;
      border-left:solid 1.5px #f2f2f2;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  .cdm-voice{
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    align-items: center;
    font-size: 14px;
    display: inline-block;
    .speech-info{
      @include point(width,80);
      @include point(height,26);
      background-color: #FFEDED;
      color: #f31b65;
      border: 1px solid #FEC0C7;
      @include point(border-radius,15);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
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
      color: #f31b65;
      border: 1px solid #FEC0C7;
      border-radius:30px;
      display: inline-block;
      .icon-speech{
        font-size:26px;
        line-height:52px;
        margin-left:10px;
      }
    }
  }

  .audio-gif {
    height: 1.125rem;
  }
  .not-play-audio{
    height: 6px;
    width: 6px;
    border-radius: 6px;
    background-color: #ff625f;
    margin: 0 calc(10/1920*100vw);
    display: inline-block;
  }
  .has-play-time-text{
    margin: 0 0 0 calc(26/1920*100vw);
  }
  .noPadding{
    margin-top: 0;
    flex-direction: column;
  }
  .item{
    margin-right: calc(30/1920*100vw);
    display: inline-flex;
    align-items: center;
    margin-top:10px;
  }
  .noPadding .item{
    margin-bottom: 10px;
  }
</style>
