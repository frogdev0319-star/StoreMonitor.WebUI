<template>
  <div :class="{'noPadding': !ifShowMargin}" class="cdm-voice">
    <div :class="isExportPdf ? 'pdf_speech_info' : 'speech-info'" @click="startAudio">
      <i v-show="!isPlaying" class="iconfont icon-yuyin icon-speech"/>
      <img v-show="isPlaying" :src="audioPlayGif" class="audio-gif icon-speech">
    </div>
    <audio :ref="audioRef" @canplay="getDuration" @ended="onEndAudio">
      <source :src="audioSrc" type="audio/mpeg" >
    </audio>
    <span v-if="hasNotPlayAudio" class="not-play-audio"/>
    <span :class="hasNotPlayAudio ? 'time-text' : 'has-play-time-text'">{{ audioOftenText }}</span>
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
    audioRef: {
      type: String,
      default: ''
    },
    audioSrc: {
      type: String,
      default: ''
    },
    ifShowMargin: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isPlaying: false,
      audioOftenText: '',
      audioPlayGif: require('../../static/img/audio-play.gif'),
      hasNotPlayAudio: true
    };
  },

  methods: {
    startAudio() {
      this.hasNotPlayAudio = false;
      if (!this.isPlaying) {
        this.$refs[this.audioRef].play();
        this.isPlaying = true;
      } else {
        this.$refs[this.audioRef].pause();
        this.isPlaying = false;
      }
    },

    onEndAudio() {
      this.isPlaying = false;
    },

    getDuration() {
      const self = this;
      const audio = self.$refs[this.audioRef];
      let du = audio.duration;
      if (isNaN(du)) {
        this.showAudio = false;
      } else {
        const duration = Math.floor(du);
        if (duration === 0) {
          du = 1;
        }
        this.audioOftenText = parseInt(du) + '"';
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
      margin-top: 10px;
      display: inline-flex;
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
    }
    .has-play-time-text{
      margin: 0 calc(26/1920*100vw);
    }
  .noPadding{
    margin-top: 0;
  }
</style>
