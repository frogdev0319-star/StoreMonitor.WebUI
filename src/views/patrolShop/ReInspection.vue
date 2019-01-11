<template>
    <el-row class="el-container">
        <el-col :span="16" class="lside" :class="{liseAnmiClass:showSpread}">
            <div class="el-header-title">
                <span class="lside-title">
                    {{store.storeTitle}}
                </span>
                <div class="storeUp-content" :class="store.storeUp?'nocoll':'coll'">
                    <i class="iconfont icon-shoucang11" :class="store.storeUp?'nocoll-icon':'coll-icon'"></i>
                    <span :class="store.storeUp?'nocoll-font':'coll-font'">{{store.storeUptitle}}</span>
                </div>
                <el-button class="el-submit" size="mini" @click="submit">
                    提交
                </el-button> 
            </div>
            <div class="video-content" >
                <!--@mouseenter="showModelContent=true" @mouseleave="showModelContent=false"-->
                <div class="video-model" v-if="showModelContent">
                    <div class="icon-footer">
                        <div class="iconlside">
                            <i class="iconfont icon-play1 iconplay" @click="playVideo" v-if="playState"></i>
                            <i class="iconfont icon-pause1 iconplay" @click="purseVideo" v-else></i>
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
                            <i class="iconfont icon-full-screen iconscreen"></i>
                        </div>
                    </div>
                    <div class="iconright">
                        <div class="paizhao-content">
                            <i class="iconfont icon-paizhao iconpaizhao" style="font-size:22px;"></i>
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
            <div class="el-inspect">
                <el-row class="inspect-header">
                    <el-col :span="8">
                        <span>巡检类别</span>
                    </el-col>
                    <el-col :span="16">
                        <span>巡检项目</span>
                    </el-col>
                </el-row>
                <el-row class="inspect-content">
                    <el-col :span="8">
                        <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                            <div :style="{'max-height':varyWindowHeight*0.62+'px'}">
                                <div v-for="(item,index) in inspectList" :key="index" class="inspect-details">
                                    <span>{{`${item.name}（0/${item.num}）`}}</span>
                                </div>
                            </div>
                         </el-scrollbar>
                    </el-col>
                    
                    <el-col :span="16">
                        <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                            <div :style="{'max-height':varyWindowHeight*0.62+'px'}">
                                <div v-for="(item,index) in inspectItemList" :key="index" class="item-details">
                                    <span>{{`${index+1}. ${item.name}`}}</span>
                                    <div class="item-score"><span>{{`评分：${item.score}分`}}</span><i class=" iconscore el-icon-arrow-down"></i></div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </el-col>
                </el-row>
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
        </el-col>
    </el-row>
</template>
<script>
export default {
    name:'ReInspection',
    data(){
        return{
            store:{
                storeName:'西安5店',
                storeTitle:'西安5店远程巡检',
                storeUp:false,
                storeUptitle:'点击收藏'
            },
            popperClass:'select-popClass',
            showModelContent:true,
            playState:true,
            activeIndex:'',
            serachVale:'',
            varyWindowHeight:window.innerHeight,
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
        playVideo(){
            let self=this;
            self.playState=false;
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
        }
    }
}
</script>
<style lang="scss" scoped>
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
    $red:#FB505F;
    $lightRed:#FEE4E7;
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
                    @include point(font-size,16);
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
                    height: 24px;
                    line-height: 24px;
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
                            width: 50%;
                            float: left;
                            text-align: left;
                            .iconplay{
                                font-size: 22px;
                                cursor: pointer;
                            }
                        }
                        .iconrside{
                            width: 50%;
                            float: right; 
                            span{
                                font-size: 13px;
                                margin-right:10px;
                                margin-left: 20px;
                            }
                            .iconscreen{
                                margin: 20px;
                                font-size: 20px;
                                position: relative;
                                top: 3px;
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
                }
                .el-search-input{
                    @include point(width,200);
                    @include point(margin-right,20);
                    @include point(margin-top,20);
                }
            }
            #tabs-content{
                margin-top: 10px;
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
                        // &:hover{
                        //     background-color: $lightRed;
                        //     color: $red;
                        //     font-weight: bold;
                        // }
                    }
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
    background-color: #FB505F !important;
}
.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #FB505F !important;
}
.el-tabs__item:hover{
    color: #FB505F !important;
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
    background-color:#34374A;
}
.select-popClass .el-select-dropdown__item:hover{
    color:#EA6F5A !important;
    background-color:#34374A;
}
.select-popClass .el-select-dropdown{
    border:0px;
    background-color:#34374A !important;
}
.select-popClass .el-select-dropdown__item.selected{
    color:#fff;
    font-weight:500 !important;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #F4F5F9 !important;
    border-radius: 15px !important;
}
</style>

<style>
    #el-menuscrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
