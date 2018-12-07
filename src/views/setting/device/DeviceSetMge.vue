<template>
    <el-row class="el-device">
        <el-col :span="24" class="el-btns">
            <div style="display:inline-block;" v-if="activeName=='dash'">
                <el-button @click="connectServer"  size="mini" class="btns">
                    连接 Dash Server
                </el-button>
            </div>
            <div style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;" v-else>
                <el-input
                    size="small"
                    class="el-search-input"
                    v-model="serachVale" @keyup.enter.native="searchEventList" placeholder='请输入关键词搜索'>
                    <i @click="searchEventList"  slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:7px;left:6px;"></i>
                </el-input>
                 <el-button v-for="(item,index) in btnList" 
                :key="index" size="mini" @click="handleNape(index,item)" class="el-handle-btn">
                    <i :class="item.iconClass" style="font-size:20px;"></i>
                    <span>{{item.btnTitle}}</span>
                </el-button>
            </div>
        </el-col>
        <el-col :span="24" class="el-tabPanels">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="Dash Server" name="dash">
                    <el-col :span="10" class="dash-content">
                        <div class="details">
                            <span class="dash-label">Dash Server IP</span>
                            <el-input class="dash-input" v-model="dash.url" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label">CMD Port（http）</span>
                            <el-input class="dash-input" v-model="dash.httpCmdPort" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label">CMD Port（https）</span>
                            <el-input class="dash-input" v-model="dash.httpsCmdPort" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label">Data Port</span>
                            <el-input class="dash-input" v-model="dash.dataPort" size="mini"></el-input>
                        </div>
                        
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="视频管理" name="video">
                    <el-col :span="8" class="lisde">
                        <el-table
                         :data="nvrData"
                         size="mini"
                         class="lisde-table-content"
                         :highlight-current-row="true"
                         :row-style="tableRowStyle" :header-cell-style="tableHeaderColor">
                            <el-table-column prop="name" label="NVR名称" min-width="30%">

                            </el-table-column>
                            <el-table-column prop="store" label="所属门店" min-width="30%">

                            </el-table-column>
                            <el-table-column prop="channelNum" label="通道数" min-width="30%">

                            </el-table-column>
                        </el-table>
                        <div class="toolbar pagination" style="width:100%; margin-top:10px;position:absolute;bottom:10px;">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage3"
                                :page-size="100"
                                background
                                small
                                layout="prev, pager, next, jumper"
                                :total="400">
                            </el-pagination>
                        </div>
                    </el-col>
                    <el-col :span="16" class="risde">
                        <div class="nape-items-title">
                            <div class="nape-name-title">
                                <span>通道名称</span>
                            </div>
                            <div class="nape-dep-title">
                                <span>NVR通道号</span>
                            </div>
                            <div class="nape-handle-title">
                                <span>操作</span>
                            </div>
                        </div>
                        <div class="nape-items-data" :style="item.isClick?{'background-color':'#FEE4E7'}:{}"
                        v-for="(item,index) in channelList" 
                        :key="index"  :class="!item.isClick?'noraml-color':'active-color'">
                            <div class="nape-name-data">
                                    <span class="nape-name" v-if="!item.isClick">{{item.name}}</span>
                                    <el-input size="mini" v-model="item.name" class="nape-input input-details" placeholder="输入巡检项名称" v-if="item.isClick"></el-input>
                            </div>
                            <div class="nape-dep-data">
                                <span class="nape-dep">{{item.number}}</span>
                                    <div class="iconcontent" v-if="item.isClick">
                                        <div class="iconlised"  @click="confirmeditNape(index,item)">
                                            <i class="el-icon-check"></i>
                                        </div>
                                        <div class="iconrised" @click="cancelEditNape(index,item)">
                                            <i class="el-icon-close"></i>
                                        </div>
                                    </div>
                            </div>
                            <div class="nape-items-handle">
                                <i class="iconfont icon-bianji" style="font-size: 20px;cursor:pointer;margin-right:10px;"  @click="handleEdit(index,item)"></i>
                            </div>
                        </div>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
import api from '@/api/index'
export default {
    name:'DeviceSetMge',
    data(){
        return{
            dash:{},
            activeName:'dash',
            total:100,
            nvrData:[
                {
                    name:'海康NVR1',
                    store:'西安1店',
                    channelNum:'2个'
                },
                 {
                    name:'海康NVR1',
                    store:'西安1店',
                    channelNum:'2个'
                },
                 {
                    name:'海康NVR1',
                    store:'西安1店',
                    channelNum:'2个'
                },
                 {
                    name:'海康NVR1',
                    store:'西安1店',
                    channelNum:'2个'
                }
            ],
            channelList:[
                {
                    name:'水吧',
                    number:'2',
                    isClick:false
                },
                 {
                    name:'水吧',
                    number:'2',
                    isClick:false
                },
                 {
                    name:'水吧',
                    number:'2',
                    isClick:false
                }, 
                {
                    name:'水吧',
                    number:'2',
                    isClick:false
                }
            ],
            serachVale:'',
            btnList:[
                {
                    id:0,
                    iconClass:'iconfont icon-daoru',
                    name:'import',
                    btnTitle:'导入',
                    enabled:true,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-daochu',
                    name:'export',
                    btnTitle:'导出',
                    enabled:true,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-xiazai',
                    name:'download',
                    btnTitle:'下载',
                    enabled:true,
                }
            ],

        }
    },
    
    methods:{
        // 修改table tr行的背景色
        tableRowStyle({ row, rowIndex }) {
            return 'background-color: #FAFAFA;height:50px;font-size:14px; border-bottom: 1px solid #ddd;'
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #FAFAFA;color: #909399;font-weight: bold;height:48px;'
            }
        },
        getDashServerInfo(){
            let self=this;
            return new Promise((resolve,reject)=>{
                api.getDashServerInfo().then(res=>{
                    console.log(res.data.errMsg);
                    if(res.data.errMsg!=undefined&&res.data.errMsg=='Success'){
                        let data=res.data.data;
                        resolve(data);
                    }
                })
            })
        },
        async connectServer(){
            let self=this;
            let data=await self.getDashServerInfo();
            let params={
                "url": self.dash.url,
                "httpCmdPort": self.dash.httpCmdPort,
                "httpsCmdPort": self.dash.httpsCmdPort,
                "dataPort": self.dash.dataPort,
                "loginId": "admin",
                "password": "admin"
            };
            if(data!=null&&data!=undefined){ //新增dash
                api.upateDashServer(params).then(res=>{
                    let errMsg=res.data.errMsg;
                    if(errMsg!=undefined&&errMsg=='Success'){
                        self.notify('连接成功!','success',3000);
                    }
                    else{
                        self.notify('连接失败!','warning',3000);
                        return false;
                    }
                })
            }
            else{                           //update dash
                api.addDashServer(params).then(res=>{
                    let errMsg=res.data.errMsg;
                    if(errMsg!=undefined&&errMsg=='Success'){
                        self.notify('连接成功!','success',3000);
                    }
                    else{
                        self.notify('连接失败!','warning',3000);
                        return false;
                    }
                })
            }
        },
        handleClick(tabs){

        },
        handleEdit(index,item){
            item.isClick=true;
        },
        cancelEditNape(index,item){
            item.isClick=false;
        },
        searchEventList(){

        },
        async InitData(){
            let self=this;
            let data=await self.getDashServerInfo();
            self.dash=data;
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
    mounted(){
        let self=this;
        self.InitData();
    },
}
</script>
<style>
.rowStyle{
    height: 50px;
    background-color: #FAFAFA !important;
}
.headerStyle{
    height: 40px;
    background-color: #FAFAFA !important;
}

</style>
<style lang="scss" scoped>
$mainColor:#FB505F;
*{
    font-family: Microsoft YaHei;
}
.el-search-input{
    width:180px;
    margin-right:20px;
}
.el-handle-btn{
    margin-left: 0px;
    border-color: $mainColor;
    color: $mainColor;
    border-radius: 0px;
    padding: 3px 10px;
    position: relative;
    top: 3px;
    span{
        position: relative;
        bottom: 3px;
    }
    &:nth-child(3){
        border-left-width: 0px;
    }
    &:last-child{
        border-left-width: 0px;
    }
    &:hover{
        background-color: #FEE4E7;
    }
    &:focus{
        background-color: #FEE4E7;
    }
}     
.el-device{
    .el-btns{
        padding-top: 10px;
        padding-right: 20px;
        position: relative;
        height: 31px;
        .btns{
            position: absolute;
            right: 25px;
            z-index: 979;
            width: 120px;
            background-color: #FB505F;
            color: #fff;
            border-color: #FB505F;
        }
    }
    .el-tabPanels{
        padding: 20px;
        height: auto;
        position: relative;
        bottom: 20px;
        .dash-content{
            text-align: left;
            position: relative;
            overflow: hidden;
            .details{
                height: 50px;
                line-height: 50px;
                font-size: 14px;
                padding-left: 10px;
                .dash-label{
                    width: 30%;
                    float: left;
                }
                .dash-input{
                    width: 50%;
                    margin-left: 5%;
                }
            }
        }
        .lisde{
            background-color: #FAFAFA;
            height: auto;
            min-height: 580px;
            position: relative;
            .lisde-table-content{
                background-color: #FAFAFA;
            }
        }
        .risde{
            .iconcontent{
                position: absolute;
                right: 10px;
                margin-top: 13px;
                margin-right: 15px;
                cursor: pointer;
                .iconlised{
                    float: left;
                    position: relative;
                    background-color: #FB505F;
                    padding: 1px 6px;
                    color: #fff;
                    border-width: 1px 1px 1px 1px;
                    border-style: solid;
                    border-color: #ddd;
                    line-height: 21px;
                    height: 21px;
                    
                }
                .iconrised{
                    float: left;
                    position: relative;
                    padding: 1px 6px;
                    border-width: 1px 1px 1px 0px;
                    border-style: solid;
                    border-color: #ddd;
                    background-color: #fff;
                    line-height: 21px;
                    height: 21px;
                }
            }
             padding:0 15px;
             .nape-items-title{
                height: 46px;
                line-height: 40px;
                color: #909399;
                font-weight:bold;
                font-size: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
                .nape-name-title{
                    width: 36%;
                    display: inline-block;
                    span{
                        position: relative;
                        left: 20%;
                    }
                    
                }
                .nape-dep-title{
                    width: 52%;
                    display: inline-block;
                    span{
                        position: relative;
                        left: 10%;
                    }
                }
                .nape-handle-title{
                    width: 8%;
                    display: inline-block;
                    span{
                        position: relative;
                        left: 20%;
                    }
                }
            }
            .nape-items-data{
                overflow: hidden;
                position: relative;
                padding-left: 1%;
                cursor: pointer;
                font-size: 14px;
                height: 50px;
                line-height: 50px;
                .nape-input{
                    width: 220px;
                    float: left;
                    margin-left: 16%;
                }
                .nape-name-data{
                    width: 36%;
                    display: inline-block;
                    position: relative;
                    float: left;
                    span{
                        float: left;
                        margin-left: 16%;
                        text-align: left;
                        width: 80%;
                        position: relative;
                    }
                }
                .nape-dep-data{
                    width: 50%;
                    display: inline-block;
                    position: relative;
                    float: left;
                    overflow: hidden;
                    span{
                        float: left;
                        margin-left: 10%;
                        text-align: left;
                    }
                }
                .nape-items-handle{
                    width: 8%;
                    display: inline-block;
                    line-height: 50px;
                }
            }
            
        }
    }
}
</style>
<style>
.el-input__inner{
    border-radius: 0px;
}
.el-input__inner:focus{
    border:1px solid #FB505F;
}
.el-tabs__active-bar{
        height: 4px !important;
        background-color: #FB505F;
    }
.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #FB505F;
}
.el-tabs__item:hover{
    color: #FB505F;
}
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td, 
.el-table__body tr.current-row>td {
	background-color: #fff;
    color:#FB505F;
    cursor: pointer;
}

.el-table--enable-row-hover .el-table__body tr:hover>td{
	background-color: #fff;
    cursor: pointer;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color:#FB505F;
    color:#fff;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 15px ;
    line-height: 50%;
}
</style>
