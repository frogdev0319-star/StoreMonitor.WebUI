<template>
    <div>
        <el-row class="container">
            <el-col class="header">
                <el-col :span="10" class="logo-content" :class="collapsed?'logo-collapse-width':'logo-width'">
                    <!-- <img :src="imgSrc" alt="logo"> -->
                    <span class="sys-name" v-if="!collapsed">{{appName}}</span>
                </el-col>
                <el-col :span="1" class="el-traggle-content">
                    <i class="iconfont icon-shouqi icon-collapse" @click="clickCollapse" v-if="collapsed"></i>
                    <i class="iconfont icon-zhankai icon-collapse" @click="clickCollapse" v-else></i>
                    <!-- <div class="traggle-content" @click="clickCollapse">
                        <div class="traggle"></div>
                        <div class="traggle-left"></div>
                        <div class="traggle" style="width:22px;margin-left:6px;"></div>
                        <div class="traggle"></div>
                    </div> -->
                </el-col>
                <el-col :span="13">
                    <el-breadcrumb separator="|" class="breadcrumb-inner">
                        <el-breadcrumb-item 
                        v-for="(item,index) in breadList" 
                        :key="item.path" class="breadcrumb-item" :to="{ path:item.path}"
                        v-if="index!=0">
                            <span style="color:#4b5262;" >{{ item.name }}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="2" class="user-content">
                    <div class="bell-content">
                        <i class="el-icon-bell"></i>
                        <el-badge is-dot class="item"></el-badge>
                    </div>
                    <!-- <div class="badoc-content">
                        <i class="iconfont icon-ziliaoshouce" style="font-size:1.5em;cursor:pointer;" @click="CheckDOC"></i>
                    </div> -->
                </el-col>
                <el-col :span="3" class="headUrl-content">
                    <el-dropdown>
                        <span class="username" style="cursor:pointer;">{{userName}}<i class="el-icon-arrow-down el-icon--right" 
                        style="margin-left:6px;cursor:pointer;"></i></span>
                        <img :src="headUrl" alt="头像" class="headImg" style="cursor:pointer;">
                        <el-dropdown-menu slot="dropdown" class="dropdown">
                            <el-dropdown-item style="width:120px;padding-left:20px">我的消息</el-dropdown-item>
                            <el-dropdown-item style="width:120px;padding-left:20px">设置</el-dropdown-item>
                            <el-dropdown-item style="width:120px;padding-left:20px" @click.native="fedlogout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-col>
            <el-col class="main" :span="24" 
            :style="($route.path=='/device'||$route.path=='/storemanage'||$route.path=='/event'||$route.path||'/bindroute')?
            {'height':(varyWindowHeight-80)+'px'}:{'height':'auto'}">
                <aside :class="collapsed?'aside-collapse-width':'aside-width'">
                    <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                    <el-menu :default-active="$route.path"
                        class="el-menu-vertical-demo" 
                        text-color="#eee"
                        background-color="#232730"
                        @open="handleopen" @close="handleclose" @select="handleselect" 
                        router :collapse="collapsed"
                    id="nav-menu"
                    :collapse-transition="false" style="border:0px;min-height:800px;">
                        <template v-for="(item,index) in routerList">
                            <!--只有一个节点-->
                            <el-menu-item  v-if="item.leaf&&item.children.length>0" class="submenu-item"
                                :key="index"  :index="item.children[0].path" 
                                style="text-align:left;">
                                <i :class="item.iconCls" :style="item.styles" class="navIcon"></i>
                                <span>{{collapsed?'':item.children[0].name}}</span>
                            </el-menu-item>
                            <!--多级节点-->
                        <el-submenu class="el-submenu" :key="index" :index="index+''" 
                        v-if="!item.leaf" style="text-align:left;">
                            <template slot="title">
                            <i :class="item.iconCls" :style="item.styles" class="navIcon">
                            </i>{{item.name}}
                            </template>
                            <el-menu-item id="childSubItem" class="submenu-item" :style="varyWindowWidth<1366?{'padding-right':'0px'}:{}"
                             v-for="child in item.children" :index="child.path"
                            :key="child.path" v-if="!child.hidden" style="padding-left: 30px;">
                                <template>
                                    <div style="width: 10px;height: 10px;background-color:white;border-radius: 50%;-moz-border-radius: 50%;
                                    -webkit-border-radius: 50%;float:left;margin-top:18px;margin-right:40px;"></div>
                                    <span >{{child.name}}</span>
                                    <div v-if="child.name=='门店管理'" 
                                    style="display:inline-block; width:8px;height:8px;background-color:red;border-radius:50%;margin-left:10px;"></div>
                                    <!--collapsed?'':-->
                                </template>
                            </el-menu-item>
                        </el-submenu>
                        </template>
                        
                    </el-menu> 
                    </el-scrollbar>
                </aside>
            
                <section :class="collapsed?'sec-collapsed':'sec-uncoll'">
                    <el-col :class="($route.path!='/routeinspection'
                    &&$route.path!='/storedetail'&&$route.path!='/rate'&&$route.path!='/bindroute'&&$route.path!='/schedule')
                    ?'content-wrapper-all':'content-wrapper'">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                        <router-view v-if="!$route.meta.keepAlive"></router-view>
                    </el-col>
                    <el-col :sapn='24' class="footercontent">
                        <footer class="footerInfo">
                            <p style="text-align:left;">Version 1.0.1&copy; 2016-2018 Advantech Corp. All rights reserved</p>
                        </footer>
                    </el-col>
                </section>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import RateManage from '../event/details/RateManage'
import {mapGetters,mapMutations,mapActions} from 'vuex';
export default {
   
    name:"Home",
    data(){
        return{
            imgSrc:'./static/img/logo.png',
            userName:'Admin',
            headUrl:'',
            breadList:[],
            collapsed:false,
            varyWindowWidth:window.innerWidth,
            varyWindowHeight:window.innerHeight,
            routerList:this.$router.options.routes.slice(1,this.$router.options.routes.length)
        }
    },
    methods:{
        clickCollapse(){
            this.collapsed=!this.collapsed;
        },
        handleopen(index) {
          console.log('handleopen');
          switch(Number(index)){
               case 1: 
               document.getElementsByClassName('el-submenu__title')[0].style.backgroundColor='#FB505F';
               document.getElementsByClassName('el-submenu__title')[1].style.backgroundColor='#232730';break;
               case 5:
               document.getElementsByClassName('el-submenu__title')[1].style.backgroundColor='#FB505F';
               document.getElementsByClassName('el-submenu__title')[0].style.backgroundColor='#232730';break;
               default: console.log('this is not a group');break;
          }
        },
        handleclose(index) {
          console.log('handleclose');
        },
        handleselect(key, keyPath){
            console.log(key);

        },
        selectItem(item,index){
            console.log(item);
            console.log(index);
        },
        CheckDOC(){
           let url="../../../static/webapp/index.html";
           window.open(url, '_blank');
        },
        getRequireAuthRoute(routeList){

        },
        getBread(){
            this.breadList=[];
            //this.breadList=this.$route.matched;
            let matched=this.$route.matched.filter(x=>x.name);
            const first=matched[1];
            this.breadList=matched;
        },
        getWindowSize(){
            let docEl=document.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function() {
                    //设置根字体大小
                    docEl.style.fontSize = (docEl.clientWidth/320)*20+'px';
                };
            //绑定浏览器缩放与加载时间
            window.addEventListener(resizeEvt, recalc, false);
            document.addEventListener('DOMContentLoaded', recalc, false);
        },
        fedlogout(){
            let self=this;
            self.$store.dispatch('FedLogOut').then(()=>{
                self.$router.push('/login');
            })
        },
        logOut(){
            let self=this;
            self.$store.dispatch('logout').then(()=>{

            })
        }

    },
    computed:{
        ...mapGetters([
            'token',
            'name'
        ])
    },
    created(){
        this.headUrl='./static/img/admin.png';
        console.log(this.$route.matched);
        //this.getWindowSize();
        this.getBread();
    },
    mounted(){

    },
    watch:{
        $route(){
            this.getBread();
        }
    }
}
</script>
<style lang="scss" scoped>
    $collapseWidth:5.5%;
    //rem(val)
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
    @mixin borderColor{
        &{
            :after{
                position:absolute;
                bottom:0;
                left:0;
                width:100%;
                height:0.55px;
                background-color:#A9A9A9;
                content:' ';
                display:block;
                transform:scaley(0.1);
            }
        }
    }
    *{
        margin: 0px;
        padding:0px;
        border: 0;
        font-family:Microsoft YaHei;
    }
    .navIcon{
        display:inline-block;
        @include point(width,60);
        @include point(font-size,25);
        color:#fff;
    }
    .container{
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        height:100%;
        padding:0;
        .header{
            width: 100%;
            @include point(height,60);
            z-index:999;
            position:fixed;
            background-color:#fff;
            line-height: 60px;
            border-bottom: 0.5px solid #ebebeb;
            .logo-width{
                width:16.9%;
            }
            .logo-collapse-width{
                width:$collapseWidth;
                width: 4.5%;
                @include point(max-width,65);
            }
            .logo-content{
                height: 100%;
                @include point(font-size,20);
                background-color:#232730;
                @include point(padding-top,10);
                position: relative;
                @include borderColor;
                .img-logo{
                    display:inline-block;
                   @include point(margin-top,8);
                }
                .sys-name{
                    position: relative;
                    @include point(bottom,10);
                    @include point(margin-left,10);
                    font-weight: bold;
                    color: #f6f9fe;
                }
            }
            .el-traggle-content{
                height: 100%;
                border-right: 1px solid;
                border-color: rgba(238,241,146,0.3);
                position: relative;
                .icon-collapse{
                    @include point(font-size,32);
                    cursor: pointer;
                    color: #99A7B2;
                }
            }
            .breadcrumb-inner{
                float:left;
                .breadcrumb-item{
                    padding:20px 0px 20px 10px;
                    @include point(font-size,16);
                    @include point(line-height,20);
                    color:#4b5262 !important;
                    span{
                        color:#4b5262 !important;
                    }
                }
            }
            .user-content{
                float:right;
                .bell-content{
                    @include point(width,60);
                    @include point(height,60);
                    float:left;
                    text-align:center;
                    border-left:1px solid rgba(255,255,255,0.2);
                    border-right:1px solid rgba(255,255,255,0.2);
                    position: absolute;
                    top:0;
                    right:160px;
                    .el-icon-bell{
                        @include point(font-size,25);
                        vertical-align:middle;
                        color:#4b5262;
                    }
                    .item{
                        position:absolute;
                        @include point(top,-5);
                        @include point(left,35);

                    }
                }
                .badoc-content{
                    @include point(width,60);
                    @include point(height,60);
                    text-align:center;
                    border-right:1px solid rgba(255,255,255,0.2);
                    position: absolute;
                    top:0;
                    @include point(right,182);
                    color:#4b5262;
                }
            }
            .headUrl-content{
                float: right;
                color: #fff;
                .username{
                    color:#4b5262;
                    i{
                        color:#FB505F;
                        font-weight: bold;
                    }
                }
                .headImg{
                    position: relative;
                    @include point(top,10);
                    @include point(margin-left,10);
                }
            }
        }

        .main{
            display: flex;
            position: absolute;
            @include point(top,60);
            bottom:0px;
            background-color: #f6f9fe;
            
            aside{
                height:100%;
                float:left;
                position: fixed;
                .el-submenu{
                    position: relative;
                    &:hover{
                        background-color:#FB505F !important;
                    }
                }
                #childSubItem.submenu-item{
                    position: relative;
                    min-width: auto !important;
                }
            }
            .content-wrapper-all{
                height: 93%;
                @include point(margin,15);
                border:0.5px solid #e3e9f4;
                width: 97.5%;
                background: #fff;
            }
            .content-wrapper{
                height: auto;
                @include point(margin,15);
                border:0.5px solid #e3e9f4;
                width: 97.5%;
                background: #fff;
            }
            .footercontent{
                padding:0px 0 10px 60px;
                color:#777;
                @include point(font-size,14);
            }
        }
        .el-submenu:hover{
            background-color:#FB505F !important;
        }
        .el-menu-item:hover{
            background-color:#FB505F !important;
        }
        .el-menu-item.is-active{
            background-color:#2F2933 !important;
            color:#FB505F;
            div{
                background-color: #FB505F !important;
            }
        }
        .el-submenu.is-active .el-submenu__title{
            background-color:#FB505F !important;
        }
        .aside-width{
            width: 16.9%;
            background-color: #232730;
        }
        .aside-collapse-width{
            width:$collapseWidth;
           @include point(max-width,65);
            width: 4.5%;
            overflow: hidden !important;
            background-color: #232730;
        }
        .sec-collapsed{
            margin-left:4.5%;
            width:95.5%;
        }
        .sec-uncoll{
            margin-left:16.9%;
            width:83.1%;
        }
    }
</style>
<style>

#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
