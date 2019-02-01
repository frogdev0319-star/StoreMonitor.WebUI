<template>
    <div class="speech-content">
        <div class="speech-info" @click.native="startSpeech"> 
            <i class="iconfont icon-speech" :class="speech?'icon-yuyin':'icon-yuyin'"></i>
            </div>
            <audio :ref="audioRef">
                <source :src="audioSrc" type="audio/mpeg" />
            </audio> 
            <span class="often-text">{{audioOftenText}}</span>
    </div>
</template>
<script>
export default {
    name:'AudioVue',
    props:{
        audioRef:String,
        audioSrc:String,
    },
    data(){
        return{
            speech:false,
            isPlaying:false,
            audioOftenText:'',
            timeid:0,
        }
    },
    methods:{
        startSpeech(){
            let self=this;
            if(!self.isPlaying){
                self.$refs[self.audioRef].play();
                self.isPlaying=true;
                self.speech=true;
                self.timeid= setInterval(function(){
                    self.getProcess();
                },1000)
            }
            else{
                self.$refs[self.audioRef].pause();
                self.isPlaying=false;
                self.speech=false;
                clearInterval(self.timeid);
            }
            self.$emit('clickFunc');
        },
        getProcess(){
            let self=this;
            let audioOften=parseInt(self.$refs[self.audioRef].duration-self.$refs[self.audioRef].currentTime);
            self.audioOftenText=parseInt(self.$refs[self.audioRef].duration-self.$refs[self.audioRef].currentTime)+'"';
            if(audioOften==0){
                self.isPlaying=false;
                self.speech=false;
            }
        },
    },
    mounted(){
        let self=this;
        self.$nextTick(()=>{
            setTimeout(()=>{
                self.getProcess();
            },1000);
        })
        
    }
}
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
    .speech-content{
        margin: 20px auto;
        .speech-info{
            @include point(width,120);
            @include point(height,30);
            background-color: #FFEDED;
            color: #FB4C5D;
            border: 1px solid #FEC0C7;
            @include point(border-radius,15);
            display: inline-block;
            cursor: pointer;
            .icon-speech{
                @include point(font-size,22);
                @include point(line-height,30);
                @include point(margin-left,15);
            }
        }
        .often-text{
            @include point(margin-left,20);
        }
    }
</style>
