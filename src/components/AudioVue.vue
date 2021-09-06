<template>
  <div :class="{'noPadding': !ifShowMargin}" class="cdm-voice">
    <div
      v-for="(audioItem, audioIndex) of audioList"
      :key="audioItem.audioRef"
      class="item">
      <div :class="isExportPdf ? 'pdf_speech_info' : 'speech-info'" @click="startAudio(audioItem, audioIndex)">
        <i v-show="!audioItem.isPlaying" class="iconfont icon-yuyin icon-speech"/>
        <img v-show="audioItem.isPlaying" :src="audioPlayGif" class="audio-gif icon-speech">
      </div>
      <audio :ref="`ref${audioIndex}`" @canplay="getDuration(audioItem, audioIndex)" @ended="onEndAudio(audioItem)">
        <source :src="audioItem.audioSrc" type="audio/mpeg" >
      </audio>
      <span v-show="audioItem.hasNotPlayAudio" class="not-play-audio"/>
      <span :class="audioItem.hasNotPlayAudio ? 'time-text' : 'has-play-time-text'">
        {{ audioItem.audioOftenText }}
      </span>
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
      audioPlayGif: require('../../static/img/audio-play.gif')
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
        audioItem.audioOftenText = parseInt(du) + '"';
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
  .cdm-voice{
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    align-items: center;
    font-size: 14px;
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
  }
  .noPadding .item{
    margin-bottom: 10px;
  }
</style>
