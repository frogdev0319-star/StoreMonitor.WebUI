<template>
    <div id="btn-circle"
    :class="isClick?'noramlColor':'abnoramlColor'" 
    :style="isOnline?{'cursor':'pointer'}:{'cursor':'not-allowed'}">
        <div id="btn-stroke">
            <span id="btn-title" :class="isOnline?'noramlColor':'abnoramlColor'">{{channelName}}</span>
        </div>
    </div>

</template>
<script>
import PubSub from 'pubsub-js'
export default {
    name:'ChannelBtn',
    props:{
        channelName:String,
        isOnline:Boolean,
        isClick:Boolean
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
        // clickChannel(ev){
        //     let self=this;
        //     self.isClick=true;
        //     let value={
        //         isClick:self.isClick,
        //     }
        //     console.log(ev.target);
        //     self.$emit('change',value)
        // }
    }
}
</script>
<style>
    .noramlColor{
        background-color: #68EA88;
    }
    .abnoramlColor{
        background-color: #DBDBDB;
    }
    #btn-circle{
        width: 66px;
        height: 66px;
        border-radius: 50%;
        /* background-color: #DBDBDB; */
        margin: auto;
        position: relative;
        /* cursor: pointer; */
    }
    #btn-stroke{
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background-color: white;
        position: absolute;
        top: 2px;
        left:2px;
    }
    #btn-title{
        display: block;
        position: absolute;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        /* background-color: #DBDBDB; */
        left: 3px;
        top: 3px;
        text-align: center;
        line-height: 60px;
        font-size: 12px;
        color: #fff;
    }
</style>

