<template>
    <div>
        <el-row class="container">
            <el-col class="header">
                <el-col :span="10" class="logo-content" :class="collapsed?'logo-collapse-width':'logo-width'">
                    <!-- <img :src="imgSrc" alt="logo"> -->
                    <span class="sys-name" v-if="!collapsed">{{sysName}}</span>
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
                            <el-dropdown-item style="width:120px;padding-left:20px" @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-col>
            <el-col class="main" :span="24">
                <aside :class="collapsed?'aside-collapse-width':'aside-width'">
                    <el-menu :default-active="$route.path"
                        class="el-menu-vertical-demo" 
                        text-color="#eee"
                        background-color="#232730"
                        @open="handleopen" @close="handleclose" @select="handleselect" 
                        router :collapse="collapsed"
                    id="nav-menu"
                    :collapse-transition="false" style="border:0px">
                        <template v-for="(item,index) in $router.options.routes">
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
                            <el-menu-item class="submenu-item" v-for="child in item.children" :index="child.path"
                            :key="child.path" v-if="!child.hidden" style="padding-left: 30px;">
                                <template>
                                    <div style="width: 10px;height: 10px;background-color:white;border-radius: 50%;-moz-border-radius: 50%;
                                    -webkit-border-radius: 50%;float:left;margin-top:18px;"></div>
                                    <span style="margin-left:25%;">{{collapsed?'':child.name}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                        </template>
                    </el-menu> 
                </aside>
                <section :class="collapsed?'sec-collapsed':'sec-uncoll'">
                    <el-col :class="($route.path!='/routeinspection')?'content-wrapper-all':'content-wrapper'">
                        <router-view></router-view>
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
            sysName:'看门店管理系统',
            userName:'Admin',
            headUrl:'',
            breadList:[],
            collapsed:false
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
        getBread(){
            this.breadList=[];
            //this.breadList=this.$route.matched;
            let matched=this.$route.matched.filter(x=>x.name);
            const first=matched[1];
            this.breadList=matched;
        },
        ...mapMutations({
            setAge:'SET_AGE',
            setName:'SET_NAME'
        }),
        // ...mapActions([
        //     nameAsyn
        // ])
    },
    computed:{
        ...mapGetters([
            'age',
            'name'
        ])
    },
    created(){
        this.headUrl='./static/img/admin.png';
        console.log(this.$route.matched);
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
        width:60px;
        font-size:25px;
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
            height: 60px;
            z-index:999;
            position:fixed;
            // background:url('../../../static/img/menu_choose.jpg')no-repeat;
            background-color:#fff;
            line-height: 60px;
            // color: #fff;
            border-bottom: 0.5px solid #ebebeb;
            .logo-width{
                width:16.9%;
            }
            .logo-collapse-width{
                width:$collapseWidth;
                max-width: 65px;
            }
            .logo-content{
                height: 100%;
                font-size: 20px;
                background-color:#232730;
                padding-top: 10px;
                position: relative;
                @include borderColor;
                .img-logo{
                    display:inline-block;
                    margin-top: 8px;
                }
                .sys-name{
                    position: relative;
                    bottom: 10px;
                    margin-left: 10px;
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
                    font-size: 32px;
                    cursor: pointer;
                    color: #99A7B2;
                }
                // cursor: pointer;
                // .traggle-content{
                //     width: 28px;
                //     height: 28px;
                //     position: absolute;
                //     top: 14px;
                //     left: 14px;
                //     .traggle{
                //         width: 28px;
                //         height: 4px;
                //         background-color: #9FACB6;
                //         margin-top: 4.5px;
                //     }
                //     .traggle-left{
                //         display:block;
                //         width:0;
                //         height:0;
                //         border-width:5px 5px 5px 0;
                //         border-style:solid;
                //         border-color:transparent #9FACB6 transparent transparent;
                //         position:absolute;
                //         margin-top: 1px;
                //     }
                //}
            }
            .breadcrumb-inner{
                float:left;
                .breadcrumb-item{
                    padding:20px 0px 20px 10px;
                    font-size:16px;
                    line-height:20px;
                    color:#4b5262 !important;
                    span{
                        color:#4b5262 !important;
                    }
                }
            }
            .user-content{
                float:right;
                .bell-content{
                    width:60px;
                    height:60px;
                    float:left;
                    text-align:center;
                    border-left:1px solid rgba(255,255,255,0.2);
                    border-right:1px solid rgba(255,255,255,0.2);
                    position: absolute;
                    top:0;
                    right:160px;
                    .el-icon-bell{
                        font-size:1.6em;
                        vertical-align:middle;
                        color:#4b5262;
                    }
                    .item{
                        position:absolute;
                        top:-5px;
                        left:35px;
                    }
                }
                .badoc-content{
                    width: 60px;
                    height: 60px;
                    text-align:center;
                    border-right:1px solid rgba(255,255,255,0.2);
                    position: absolute;
                    top:0;
                    right:182px;
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
                    top: 10px;
                    margin-left: 10px;
                }
            }
        }

        .main{
            display: flex;
            position: absolute;
            top:60px;
            bottom:0px;
            background-color: #f6f9fe;
            height:100%;
            aside{
                height:100%;
                float:left;
                position: fixed;
                .el-submenu{
                    position: relative;
                    @include borderColor;
                    &:hover{
                        background-color:#FB505F !important;
                    }
                }
                .submenu-item{
                    position: relative;
                   
                    @include borderColor;
                }
            }
            .content-wrapper-all{
                height: 93%;
                margin: 15px;
                border:0.5px solid #e3e9f4;
                width: 97.5%;
                background: #fff;
            }
            .content-wrapper{
                height: auto;
                margin: 15px;
                border:0.5px solid #e3e9f4;
                width: 97.5%;
                background: #fff;
            }
            .footercontent{
                // height:13%;
                padding:0px 0 10px 60px;
                color:#777;
                font-size:14px;
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
            max-width: 65px;
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
