<template>
    <div id="btn-circle" @click="clickChannel" :class="isClick?'noramlColor':'abnoramlColor'">
        <div id="btn-stroke">
            <span id="btn-title" :class="isOnline?'noramlColor':'abnoramlColor'">{{channelName}}</span>
        </div>
    </div>

</template>
<script>
export default {
    name:'ChannelBtn',
    props:{
        channelName:String,
        isOnline:Boolean,
    },
    data(){
        return{
            isClick:false
        }
    },
    methods:{
        clickChannel(ev){
            let self=this;
            self.isClick=true;
            let value={
                name:self.channelName,
                isClick:self.isClick,
                isOnline:self.isOnline
            }
            console.log(ev.target);
            self.$emit('change',value,ev)
        }
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
        width: 70px;
        height: 70px;
        border-radius: 50%;
        /* background-color: #DBDBDB; */
        margin: auto;
        position: relative;
        cursor: pointer;
    }
    #btn-stroke{
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background-color: white;
        position: absolute;
        top: 2px;
        left:2px;
    }
    #btn-title{
        display: block;
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        /* background-color: #DBDBDB; */
        left: 3px;
        top: 3px;
        text-align: center;
        line-height: 60px;
        font-size: 14px;
        color: #fff;
    }
</style>

