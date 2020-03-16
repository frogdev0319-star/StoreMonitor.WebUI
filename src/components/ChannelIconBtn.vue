<template>
    <div class="channel-btn-content">
        <div class="btn-circle">
            <img :src="iconSrc" />
        </div>
        <span class="btn-title" :class="isClick?'noramlColor':'abnoramlColor'">{{channelName}}</span>
    </div>
</template>
<script>
import PubSub from 'pubsub-js'
export default {
    name:'ChannelIconBtn',
    props:{
        channelName:String,
        isOnline:Boolean,
        isClick:Boolean
    },
    computed:{
        iconSrc(){
            let src='';
            if(this.isOnline){
                if(this.isClick){
                    src=this.onlineSrc;
                }
                else{
                    src=this.onlineSrc1;
                }
            }
            else{
                src=this.disOnlineSrc;
            }
            return src;
        }
    },
    data(){
        return{
            onlineSrc:require('../../static/img/1.png'),
            onlineSrc1:require('../../static/img/2.png'),
            disOnlineSrc:require('../../static/img/3.png'),
        }
    },
    watch:{
    },
    created(){
    },
    methods:{
    }
}
</script>
<style>
    .noramlColor{
        color: #68EA88;
    }
    .abnoramlColor{
        color: #7d8cad;
    }
    .channel-btn-content{
        height: auto;
        text-align: center;
        width: calc(60/1920*100vw);
        min-width: 40px;
        min-height: 40px
    }
    .btn-circle{
        width: calc(60/1920*100vw);
        height: calc(60/1920*100vw);
        border-radius: 50%;
        margin: auto;
        position: relative;
        cursor: pointer;
        min-width: 40px;
        min-height: 40px
    }
    .btn-circle img{
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        width: calc(60/1920*100vw);
        height: calc(60/1920*100vw);
        min-width: 40px;
        min-height: 40px
    }
    .btn-title{
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        width: 100%;
    }
</style>

