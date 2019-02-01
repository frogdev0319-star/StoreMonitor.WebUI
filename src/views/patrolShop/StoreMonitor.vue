<template>
    <el-row class="el-container">
        <el-col :span="16" class="lside" :class="{liseAnmiClass:showSpread}">
            <div class="el-header-title">
                <span class="lside-title">
                    {{store.storeTitle}}
                </span>
                <div class="storeUp-content" :class="store.storeUp?'nocoll':'coll'">
                    <i class="iconfont icon-iconfontstart" :class="store.storeUp?'nocoll-icon':'coll-icon'"></i>
                    <span :class="store.storeUp?'nocoll-font':'coll-font'">{{store.storeUptitle}}</span>
                </div>
            </div>
            <div class="video-content" >
                <!--@mouseenter="showModelContent=true" @mouseleave="showModelContent=false"-->
                <div class="video-model" v-if="showModelContent">
                    <div class="icon-footer">
                        <div class="iconlside">
                            <i class="iconfont icon-bofang1 iconplay" @click="playVideo" v-if="playState"></i>
                            <i class="iconfont icon-zantingtingzhi iconplay" @click="purseVideo" v-else></i>
                        </div>
                        <div class="iconrside">
                            <span>倍速</span>
                            <el-select class="el-test" size="mini" v-model="testSpeed" :popper-class="popperClass">
                                <el-option
                                v-for="(item) in speedList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <span>视频回退</span>
                            <el-select class="el-test" size="mini" v-model="testBack" :popper-class="popperClass">
                                <el-option
                                v-for="(item) in backList" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="screen-content">
                                <i class="iconfont icon-quanping iconscreen"></i>
                                <i class="iconfont icon-gongge iconscreen"></i>
                            </div>
                        </div>
                    </div>
                    <div class="iconright">
                        <div class="paizhao-content">
                            <i class="iconfont icon-xiangji iconpaizhao" style="font-size:20px;"></i>
                            <span>抓拍</span>
                        </div>
                        <div class="sheying-content">
                            <i class="iconfont icon-luxiang iconpaizhao" style="font-size:24px;position:relative;top:3px;"></i>
                            <span>录像</span>
                        </div>
                        <div class="icon-drap-content">
                            <i class="iconfont icon-zhedie iconzhedie" @click="spreadContent" v-if="!showSpread"></i>
                            <i class="iconfont icon-close iconzhedie" @click="closeContent" v-else></i>
                        </div>
                    </div>
                </div>
                <video  height=83% width=90% id="previewVideo" prload autoplay
                    class="video-js vjs-fill">
                </video>
            </div>

        </el-col>
        <el-col :span="8" class="rside" v-if="!showSpread">
            <div class="el-header-title">
                <span>选择门店</span>
                <el-input
                    size="small"
                    class="el-search-input"
                    placeholder="请输入关键字搜索门店"
                    v-model="serachVale" @keyup.enter.native="searchStore">
                    <i @click="searchStore" slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:6px;left:6px;font-size:18px;"></i>
                </el-input>
            </div>
            <el-tabs v-model="activeIndex" @tab-click="handleClick" id="tabs-content">
                <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label">
                    <div class="storeList-content">
                        <span v-for="(_item,_index) in item.storeList" :key="_index" 
                        :class="_item.isActive?'activeClass':''" @click="clickStore(item,_item,_index)">
                            {{_item.storeName}}
                        </span>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="channel-content">
                <span>区域列表</span>
                <div v-for="(item,index) in channelBtns" :key="index" class="btn-content">
                    <channel-btn :channel-name="item.name" :is-online="item.isonline" 
                    class="channelBtn" @change="clickBtn"></channel-btn>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import ChannelBtn from '@/components/ChannelBtn.vue'
export default {
    name:'StoreMoinitor',
    components:{
        ChannelBtn
    },
    data(){
        return{
            channelBtns:[
                {
                    name:'水吧',
                    isonline:true,
                },
                {
                    name:'收银台',
                    isonline:true
                },
                {
                    name:'物料成列',
                    isonline:false
                }
            ],
            store:{
                storeName:'西安5店',
                storeTitle:'西安5店',
                storeUp:false,
                storeUptitle:'点击关注'
            },
            popperClass:'select-popClass',
            showModelContent:true,
            playState:true,
            activeIndex:'',
            serachVale:'',
            varyWindowHeight:window.innerHeight,
            showDate:true, 
            playDate:new Date(), 
            speedList:[
                {
                    value:0,
                    label:'0.5 X'
                },
                {
                    value:1,
                    label:'1 X'
                },
                {
                    value:2,
                    label:'1.5 X'
                },
                {
                    value:3,
                    label:'2 X'
                }
            ],
            testSpeed:'1 X',
            backList:[
                {
                    value:0,
                    label:'10s'
                },
                {
                    value:1,
                    label:'20s'
                },
                {
                    value:2,
                    label:'30s'
                },
                {
                    value:3,
                    label:'40s'
                }
            ],
            testBack:'10s',
            showSpread:false,
            tabList:[
                {
                    label:'关注',
                    storeList:[
                        {
                            isActive:true,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        }
                    ]
                },
                {
                    label:'最近访问',
                    storeList:[
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        }
                    ]
                },
                {
                    label:'全部门店',
                    storeList:[
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        },
                        {
                            isActive:false,
                            storeName:'西安6店'
                        }
                    ]
                }
            ],
            inspectList:[
                {
                    name:'门店形象',
                    num:12
                },
                {
                    name:'员工形象',
                    num:4
                },
                {
                    name:'服务',
                    num:3
                },
                {
                    name:'商品',
                    num:4
                }
            ],
            inspectItemList:[
                {
                    name:'店外整洁，无乱堆乱放现象',
                    score:2,
                    ignore:false
                },
                {
                    name:'店外整洁，无乱堆乱放现象',
                    score:2,
                    ignore:false
                },
                {
                    name:'店外整洁，无乱堆乱放现象',
                    score:2,
                    ignore:false
                },{
                    name:'店外整洁，无乱堆乱放现象',
                    score:2,
                    ignore:false
                }
            ]
        }
    },
    methods:{
        submit(){

        },
        spreadContent(){
            let self=this;
            self.showSpread=true;
        },
        closeContent(){
            let self=this;
            self.showSpread=false;
        },
        async playVideo(url) {
            console.log('playvideo enter!');
            var video = document.getElementById("previewVideo");
            this.previewplayer = videojs(video);
            this.previewplayer.src({src:url,type:this.protocal == "HLS"? "application/x-mpegURL" : "application/dash+xml"});
            this.previewplayer.play();
        },
        async realTime(){
            let self=this;
            let sessionId= await dashAPI.Online();
            console.log(sessionId);
            let result=await dashAPI.Enum(sessionId);
            let ivsID=result.IVSPlatform[0].ID;
            const data = {
                request: { 
                  method: 'connection',
                  sessionID: sessionId,
                  streamingProtocol:this.protocal,
                  IVSID:ivsID,
                  channel:JSON.stringify(this.selGID+1)
                }
            };
            self.mpdurl = await dashAPI.RealTime(1,data); // 1 is start, 0 is stop
            console.log(self.mpdurl);
            if (self.mpdurl != "" ) {
                console.log(self.mpdurl);
                self.playVideo(self.mpdurl);
            }
        },
        playVideo(){
            let self=this;
            self.playState=false;
            self.realTime();
        },
        purseVideo(){
            let self=this;
            self.playState=true;
        },
        searchStore(){
            
        },
        handleClick(tab){
            console.log(tab);
        },
        clickStore(item,_item,_index){
            let self=this;
            _item.isActive=true;
            item.storeList.forEach((itemS,indexS)=>{
                if(_index!=indexS){
                    itemS.isActive=false;
                }
            })
        },
        clickBtn(val){
            console.log(val);
            let self=this;
            let name=val.name;
            let isClick=val.isClick;
            let isOnline=val.isOnline;
            self.channelBtns.forEach(item=>{
                if(item.name!=name){
                    item.isClick=false;
                }
                else{
                    if(isOnline==false){
                        item.isClick=false;
                    }
                }
                
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    $red:#FB4C5D;
    $lightRed:#FEE4E7;
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
   
    .el-container{
        .spreadLsideClass{
            width: 98%;
        }
        .liseAnmiClass{
            animation:lisdeAn 0.5s;
            -webkit-animation: lisdeAn 0.5s;
            animation-fill-mode:forwards;
        }
        @keyframes lisdeAn{
            from{
                width: 66.67%;
            }
            to{
                width: 100%;
            }
        }
        @-webkit-keyframes lisdeAn{
            from{
                width: 66.67%;
            }
            to{
                width: 100%;
            }
        }
        .lside{
            padding:15px 10px 15px 20px;
            .el-header-title{
                text-align: left;
                position: relative;
                padding-left: 10px;
                height: 30px;
                line-height: 30px;
                .lside-title{
                    font-weight: bold;
                    color: #424151;
                    font-size: 18px;
                }
                .coll{
                    border:1px solid orange;
                }
                .nocoll{
                    border:1px solid #DBDBDB;
                }
                .coll-icon{
                    color: orange;
                }
                .nocoll-icon{
                    color: #DBDBDB;
                }
                .coll-font{
                    color: orange;
                }
                .nocoll-font{
                    color: #DBDBDB;
                }
                .storeUp-content{
                    display: inline-block;
                    margin-left: 20px;
                    padding: 0px 10px;
                    height: 22px;
                    line-height: 22px;
                    min-width: 60px;
                    span{
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
                .el-submit{
                    position: absolute;
                    right: 0px;
                    width: 90px;
                    top: 4px;
                    background-color: $red;
                    color: #fff;
                }
            }
            .video-content{
                width: 100%;
                height: auto;
                position: relative;
                margin-top: 20px;
                .video-model{
                    height: 100%;
                    width: 100%;
                    background-color: transparent ;
                    position: absolute;
                    z-index: 990;
                    .icon-footer{
                        width: 96%;
                        position: absolute;
                        bottom: 0px;
                        color: #fff;
                        padding-left: 30px;
                        padding-bottom: 20px;
                        overflow: hidden;
                        user-select:none;
                        .iconlside{
                            width: 30%;
                            float: left;
                            text-align: left;
                            .iconplay{
                                font-size: 22px;
                                cursor: pointer;
                            }
                        }
                        .iconrside{
                            width: 60%;
                            max-width: 500px;
                            float: right; 
                            position: relative;
                            span{
                                font-size: 12px;
                                margin-right:6px;
                                margin-left: 20px;
                            }
                            .screen-content{
                               display: inline;
                               margin-left: 30px;
                                .iconscreen{
                                    margin: 8px;
                                    font-size: 20px;
                                    position: relative;
                                    top: 3px;
                                }
                            }
                            
                        }
                    }
                    .iconright{
                        position: absolute;
                        right:0px;
                        height: 50%;
                        top: 25%;
                        .paizhao-content{
                            height: 50px;
                        }
                        span{
                            font-size: 13px;
                            margin-left: 15px;
                            color: #fff;
                            margin-right: 35px;
                            cursor: pointer;
                        }
                        .iconpaizhao{
                            color: #fff;
                            cursor: pointer;
                        }
                        .icon-drap-content{
                            height: 40px;
                            position: absolute;
                            right: 0px;
                            background-color: #34374A;
                            line-height: 40px;
                            .iconzhedie{
                                color: #ddd;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .el-inspect{
                border-left: 1px solid #ddd;
                border-right: 1px solid #ddd;
                .inspect-header{
                    text-align: left;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 20px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #909399;
                    border-bottom:1px solid #ddd;
                    span{
                        margin-left: 15px;
                    }
                }
                .inspect-content{
                    .inspect-details{
                        text-align: left;
                        height: 60px;
                        line-height: 60px;
                        padding-left: 35px;
                        font-size: 14px;
                        font-weight: bold;
                        border-bottom:1px solid #ddd;
                    }
                    .item-details{
                        text-align: left;
                        height: 60px;
                        line-height: 60px;
                        padding-left: 15px;
                        font-size: 14px;
                        font-weight: bold;
                        position: relative;
                        .item-score{
                            position: absolute;
                            right: 0;
                            top: 12px;
                            margin-right: 20px;
                            width: 100px;
                            height: 26px;
                            padding-left: 10px;
                            background-color: orange;
                            line-height: 26px;
                            color: #fff;
                            border-radius: 13px;
                            .iconscore{
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }
        .rside{
            padding: 15px 10px 15px 10px;
            .el-header-title{
                text-align: left;
                position: relative;
                @include point(padding-left,10);
                span{
                    display: block;
                    @include point(margin-top,10);
                    font-size: 14px;
                    font-weight: bold;
                }
                .el-search-input{
                    @include point(width,200);
                    @include point(margin-right,20);
                    @include point(margin-top,20);
                }
            }
            #tabs-content{
                margin-top: 10px;
                @include point(height,260);
                .storeList-content{
                    padding: 0 10px;
                    text-align: left;
                    .activeClass{
                        background-color: $red;
                        color: #fff;
                    }
                    span{
                        display: inline-block;
                        min-width: 80px;
                        margin-left: 15px;
                        margin-top: 10px;
                        border: 1px solid #ddd;
                        text-align: center;
                        padding:4px;
                        font-size: 14px;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                }
            }
            .channel-content{
                width: 100%;
                height: auto;
                overflow: hidden;
                span{
                    display: block;
                    text-align: left;
                    margin: 15px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #424151;
                }
                .btn-content{
                    //display: inline-block;
                    width: 100px;
                    float: left;
                }
            }
        }
    }
</style>
<style scoped>
    .el-test{
        width: 70px;
    }
    
</style>
<style>
#tabs-content .el-tabs__nav-scroll{
    margin-left:40px;
}
.el-tabs__active-bar{
    height: 4px !important;
    background-color: #FB4C5D !important;
}
.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #FB4C5D !important;
}
.el-tabs__item:hover{
    color: #FB4C5D !important;
}

.el-test .el-input__inner{
    height: 24px;
    line-height: 24px;
    border-radius: 0px;
    background-color: #34374A;
    color: #fff;
    padding:0 10px;
    border: 0px;
}
.el-test .el-input__icon{
    line-height: 24px;
}
.select-popClass .el-select-dropdown__item{
    font-size:12px;
    height: 24px;
    line-height: 24px;
    background-color: #34374A;
    color:#fff;
}
.select-popClass .el-select-dropdown__item.hover{
    color:#EA6F5A !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item:hover{
    color:#EA6F5A !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown{
    border:0px !important;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item.selected{
    color:#fff;
    font-weight:500 !important;
}
.select-popClass .el-select-dropdown__list{
    padding:0;
}
.el-select-dropdown.el-popper.select-popClass{
    border:0px;
}
.select-popClass.el-popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color:#34374A !important;
}
.select-popClass.el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color:#34374A !important;
}

</style>
<style scoped>
.el-search-input.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
    height: 32px !important;
    line-height:32px !important;
    padding-left:30px;
    color:#425262;
    letter-spacing: 0px;
}
</style>

<style>
    #el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
