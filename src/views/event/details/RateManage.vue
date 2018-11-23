<template>
    <div class="el-rate-container">
        <el-row class="el-rate-header">
            <el-col :span="24">
                <img :src="deviceIcon" alt="图标" class="event-icon">
                <div class="event-info-content">
                    <span class="event-type">{{eventInfo.eventType}}</span>
                    <div style="display:inline;">
                        <i class="iconfont icon-tishi" style="font-size:20px;color: #45ACF7;"></i>
                        <span class="view-detail" @click="checkAgent">查看设备详情</span>
                    </div>
                    <br/>
                    <div class="device-content">
                        <span class="device-name"> 设备名称：{{eventInfo.deviceName}}</span>
                        <span class="device-type">设备型号：{{eventInfo.deviceType==null?"UPOS-211":eventInfo.deviceType}}</span>
                        <span>{{eventInfo.ts}}</span>
                    </div>
                    
                    <br/>
                    <span class="event-desr" v-if="!showDes">异常描述：{{eventInfo.description}}</span>
                    <span class="event-desr" v-if="!showMoreDes&&showDes"  @click="showMoreInfo" style="display:block; cursor: pointer;">异常描述：{{showPart}}</span>
                    <div style="width:450px;height:auto;" v-if="showMoreDes">
                        <span class="event-desr"  style="display:block;height:auto;width:auto;" @click="showMoreInfo">异常描述：{{eventInfo.description}}</span>
                    </div>
                    
                </div>
                <el-button type="primary" size="medium"  class="remoteButton" style="margin-right:20px;"><i class="iconfont icon-screenshotjt" style="margin-left:0px"></i>远程截图</el-button>
                <el-button type="primary" size="medium"  class="remoteButton"><i class="iconfont icon-yuanchengzhuomian"></i>远程桌面</el-button>
                
                <div>
                    <div class="powerButton" @click="handleClick">
                        <span>电源管理</span>
                        <input type="hidden" v-model="powerSelect">

                        <i class="iconfont  icon-down-trangle"></i>
                    </div>
                    <div class="powerItemList" v-show="powerItemShow">
                        <span class="powerItemListItem" @click="selectList(item,index)" v-for="(item,index) in powerStatusList">{{ item.zh }}</span>
                    </div>
                </div>

                <hr class="header-hr"/>
            </el-col>
        </el-row>
        <el-row class="el-rate-content">
            <div class="rate-content" :style="{'min-height':varyWindowHeight*0.59+'px'}">
                <div class="el-rate-info">
                    <div class="title-content">
                        <span class="el-state-title">处理状态</span>
                        <el-select v-model="value" placeholder="请选择" class="el-select-content" size="small" @change="selectChange">
                            <el-option
                            v-for="(item) in states" 
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="title-content">
                        <span class="el-state-title">文字描述</span>
                        <el-input
                        class="el-desc"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="textareaValue">
                        </el-input>
                    </div>
                    <div class="title-content" style="height:200px;">
                        <span class="el-state-title">添加附件</span>
                        <span @mouseenter="showBtn"><i class="iconfont icon-shangchuantupian icon-file" ></i></span>
                        <div class="file-btn" v-if="showAddFile" @mouseleave="hideBtn">
                            <div class="item">
                                <span>上传图片</span>
                            </div>
                            <div class="item">
                                <span>上传视频</span>
                            </div>
                        </div>
                        <div class="file-content">
                            <!-- <div class="file-icon-content" v-for="(item,index) in fileList" :key="index"> -->
                                <!-- <img :src="item.src" class="img-icon"/>
                                <span v-if="item.showName" class="">点击输入标题</span> -->
                                <!-- <input type="text" v-else/> -->
                            <!-- </div> -->
                        </div>
                        <span class="txt-inst">* 每个事件最多支持5张图片，格式png,jpg,单张图片的大小不超过500KB，单笔事件最多支持两个视频，格式MP4.单个视频最大不超过100M.</span>
                    </div>
                    <div class="el-event-tab">
                        <el-tabs v-model="activeName" @tab-click="clickTab">
                            <el-tab-pane v-for="(item,index)
                             in elTableData" :key="index" :label="item.label" :name="item.name">
                                <div class="tab-left-content">
                                    <div class="tab-header-title" v-if="item.showPanel">
                                        <i class="iconfont icon-jinggao1 icon-tab-info"></i>
                                        <span style="font-size:13px;color:#4b5262;">* 将处理状态意见用于勾选异常事件</span>
                                        <i class="iconfont icon-guanbi icon-tab-close" @click="closePanel(item)"></i>
                                    </div>
                                    <div class="el-table-content" :style="item.showPanel?{'margin-top':'10px'}:{'margin-top':'0px'}">
                                            <el-table 
                                            :data="item.tableData" 
                                            :highlight-current-row="true"
                                            :header-cell-style="tableHeadClass"
                                            :header-row-class-name="tableHeaderRowClass"
                                            empty-text='没有异常数据'
                                            align='left'
                                            size="mini"
                                            height="280px"
                                            @selection-change="handleSelectionChange">
                                            <el-table-column type="selection" width="55"></el-table-column>
                                            <el-table-column :prop="tableInfoData[0].prop" :label="tableInfoData[0].label" 
                                            :width="tableInfoData[0].width"></el-table-column>
                                                <el-table-column :prop="tableInfoData[1].prop" :label="tableInfoData[1].label" 
                                            :width="tableInfoData[1].width"></el-table-column>
                                                <el-table-column :prop="tableInfoData[2].prop" :label="tableInfoData[2].label" 
                                            :width="tableInfoData[2].width">
                                                <template slot-scope="scope" >
                                                    <div class="icon-content" v-if="scope.row.isResolved==0">
                                                        <div class="itemIcon" :style="{'background-color':'#19d147'}"></div>
                                                        <span>是</span>
                                                    </div>
                                                    <div class="icon-content" v-else>
                                                        <div class="itemIcon" :style="{'background-color':'#ed5565'}"></div>
                                                        <span>否</span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column :prop="tableInfoData[3].prop" :label="tableInfoData[3].label" 
                                            :width="tableInfoData[3].width"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                        <el-button type="primary" size="mini" @click="submitCommit"
                        style="margin-right:20px;width:120px;margin-top:15px;margin-bottom:30px;font-size:14px;">提交</el-button>
                    </div>
                </div>
            </div>
        </el-row>
    </div>
</template>
<script>
//import api  from '../../../api/index';
//import util from '../../../common/util.js'
export default {
    name:"RateManage",
    data(){
        return{
            varyWindowHeight:window.innerHeight,
            eventType:'',
            eventInfo:{},
            deviceIcon:'./static/img/设备状态_normal.png',
            flag:false, //refresh the  tabledata.
            powerItemShow:false,//电源列表项是否显示
            powerStatusList:[], //电源选项列表
            powerSelect:'',//电源列表选中项
            states: [
                // {
                //     value: 0,
                //     label: '未处理',
                //     disabled: true
                // }, 
                {
                    value: 1,
                    label: '处理中'
                }, 
                {
                    value: 2,
                    label: '已处理'
                }
            ],
            showDes:false,
            showPart:"",
            showMoreDes:false,
            value:1,
            textareaValue:'',
            showAddFile:false,
            fileList:[
                {
                    //"src": './static/img/photoIcon.png',
                    //"showName":false
                }
                
           
            ],
            startDate:'',
            endDate:'',
            params:{},
            //videoIcon:'./static/img/videoIcon.png',
            elTableData:[
                {
                    "name":"first",
                    "label":"设备关联事件",
                    "tableData":[],
                    "showPanel":true
                },
                {
                    "name":"second",
                    "label":"同类异常事件",
                    "tableData":[],
                    "showPanel":true
                }
            ],
            tableInfoData:[
                {
                    "prop":"eventName",
                    "label":"异常事件名称",
                    "width":160,
                    "showTe":false
                },
                {
                    "prop":"status",
                    "label":"处理状态",
                    "width":130,
                    "showTe":false
                },
                {
                    "prop":"isResolved",
                    "label":"是否解除",
                    "width":120,
                    "showTe":true
                },
                {
                    "prop":"description",
                    "label":"异常概述",
                    "width":"",
                    "showTe":false
                }
            ],
            activeName:'first',
            multipleSelection:[],   //勾选项
            
        }
    },
    methods:{
        tableHeadClass({ row, column, rowIndex, columnIndex }){
            if (rowIndex == 0) {
                return 'background-color:#F6F7FB;color:#4b5262;border:1px soild #fff;font-size:13px;font-weight:noraml;'
            } else {
                return 'height:20px;'
            }
        },
        tableHeaderRowClass(row,rowIndex){
            return 'font-weight:normal !important;';
        },
        getDeviceInfo(){

        },
        checkAgent(){
            let self=this;
            let agentId=this.eventInfo.agentId;
            this.$router.push({name:"异常进度"});
        },
        handleClick(val){
            console.log("sta");
            console.log(val);
            this.powerItemShow=!this.powerItemShow;
        },
        //选择了电源项之后
        selectList(item,index){
            this.powerItemShow=false;
            let restartto= sessionStorage.getItem('location')
            console.log(restartto);

            if(restartto!=null&&restartto!=''&&item.en=='restart'){
                this.getPower(item.en,JSON.parse(restartto));
            }
            else if(item.en=='reset'){
                this.getPower(item.en,'外设管理')
            }
            else{
                
            }
        },
        //获取电源状态范围
        getPowerscope(){
            let para={agentId:this.eventInfo.agentId};
            // api.getPowerscope(para).then(res=>{
            //     if(res.data!=null){
            //         this.powerStatusList=util.formatter(res.data);
            //     }
            //     else{
            //         console.log('error power detail');
            //     }
            // });
        },
        selectChange(val){
            console.log(val);
            let self=this;
            console.log(self.activeName);
        },
        showBtn(){
            this.showAddFile=true;
        },
        hideBtn(){
            this.showAddFile=false;
        },
        clickTab(tabIndex){
            console.log(tabIndex.index);
            let self=this;
            let index=tabIndex.index;
            self.flag=false;
            if(index=='0'){
                self.getTable1Data(self.flag);
            }
            else{
                self.getTable2Data(self.flag);
            }
        },
        closePanel(item){
            item.showPanel=!item.showPanel;
        },
        handleSelectionChange(val){
            console.log(val);
            this.multipleSelection=val;
        },
        //获取列表上的查询条件
        getQueryParams(){
            let self=this;
            self.params=JSON.parse(sessionStorage.getItem('queryparams'));
            self.params.filter={};
            console.log(self.params);
        },
        getTable1Data(flag){
            let self=this;
            let agentIdArry=[];
            let curId=self.eventInfo.id;
            
            agentIdArry.push(self.eventInfo.agentId);
            self.params.clause={
                "agentId":agentIdArry,
                "status":[0,1]
            };
            if(self.elTableData[0].tableData.length==0||flag){
                // api.getEventList(self.params).then((res)=>{
                // console.log(res);
                // let index=0;
                // let data=res.data.content;
                // for(var i=0;i<data.length;i++){
                //     if(data[i].id==curId){
                //         index=i;
                //         break;
                //     }
                //     else{
                //         index=-1;
                //     }
                // }
                // data.splice(index,1);
                // let temp=[];
                // data.forEach(item=>{
                //     let obj={};
                //     obj.id=item.id;
                //     obj.eventName=item.eventType;
                //     switch(item.status){
                //         case 0: obj.status="未处理";break;
                //         case 1: obj.status="处理中";break;
                //         case 2: obj.status="已处理";break;
                //     }
                //     obj.isResolved=item.codex;
                //     obj.description=item.description;
                //     temp.push(obj);
                // })
                //     self.elTableData[0].tableData=temp;
                // }).catch(err=>{
                //     console.log("Error:"+err);
                // })
            }
        },
        getTable2Data(flag){
            let self=this;
            let agentIdArry=[];
            let eventTypeArry=[];
            let curId=self.eventInfo.id;
            agentIdArry.push(self.eventInfo.agentId);
            eventTypeArry.push(self.eventInfo.eventTypeId);
            self.params.clause={
                "agentId":agentIdArry,
                "eventTypeId":eventTypeArry,
                "status":[0,1]
            };
            if(self.elTableData[1].tableData.length==0||flag){
                //  api.getEventList(self.params).then((res)=>{
                //     console.log(res);
                //     let data=res.data.content;
                //     let index=0;
                //     for(var i=0;i<data.length;i++){
                //         if(data[i].id==curId){
                //             index=i;
                //             break;
                //         }
                //         else{
                //             index=-1;
                //         }
                //     }
                // data.splice(index,1);
                //     let temp=[];
                //     data.forEach(item=>{
                //         let obj={};
                //         obj.id=item.id;
                //         obj.eventName=item.eventType;
                //         switch(item.status){
                //             case 0: obj.status="未处理";break;
                //             case 1: obj.status="处理中";break;
                //             case 2: obj.status="已处理";break;
                //         }
                //         obj.isResolved=item.codex;
                //         obj.description=item.description;
                //         temp.push(obj);
                //     })
                //     self.elTableData[1].tableData=temp;
                // }).catch(err=>{
                //     console.log("Error:"+err);
                // })
            }
        },
        checkBeforeSubmit(){
            let self=this;
            let idarr=[];
            let flag=false;
            idarr.push(self.eventInfo.id);
            let params={"id":idarr};
            return new Promise((resolve,reject)=>{
                // api.getState(params).then((res)=>{
                //     console.log(res);
                //     if(res.errCode=="0"){
                //         let comment=res.data[0].comment;
                //         let temp=[];
                //         comment.forEach(item=>{
                //             if(item.status==2){
                //                 flag=true;
                //             }
                //         })
                //         resolve(flag);
                //     }
                // })
                // .catch((error) => {
                //     reject(error);
                // })
            })
        },
       async submitCommit(){
            let self=this;
            let curId=self.eventInfo.id;
            let param={};
            param.id=[];
            self.flag=true;
            let flagStatus=await self.checkBeforeSubmit();
            if(!flagStatus){
                param.id.push(curId);
            }
            else{
                if(self.multipleSelection.length==0){
                    self.notify("当前事件已处理结束，请勾选并处理其他事件！","warning",3000);
                    return false;
                }
            }

            self.multipleSelection.forEach(item=>{
                param.id.push(item.id);
            })
            
            param.comment={
                "ts":new Date().getTime(),
                "account":"admin",
                "description":self.textareaValue,
                "status":self.value
            }
            // api.addComment(param).then(res=>{
            //      console.log(res);
            //      let result=res.data;
            //      if(res.errCode=="0"){
            //         console.log(res.data);
            //         self.notify("提交成功!","success",3000);
            //         if(self.activeName=="first"){
            //             self.getTable1Data(self.flag);
            //         }
            //         else{
            //             self.getTable2Data(self.flag);
            //         }
            //      }
            //      else{
            //          self.notify("提交失败","warning",3000);
            //          return false;
            //      }
            // })
            // .catch(err=>{
            //     console.log("Error:"+err);
            // });
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
        showMoreInfo(){
            this.showMoreDes=!this.showMoreDes;
        }
    },
    mounted(){
        this.eventInfo=JSON.parse(sessionStorage.getItem('event'));
        console.log(this.eventInfo.description.length);
        if(this.eventInfo.description.length>=50){
            let deStr=this.eventInfo.description;
            this.showDes=true;
            this.showPart=deStr.substring(0,deStr.indexOf(';')+1);
            this.hidePart=deStr.substring(deStr.indexOf(';')+1,deStr.length);
        }
        else{
            this.showDes=false;
        }
        // this.startDate=JSON.parse(sessionStorage.getItem('startDate'));
        // this.endDate=JSON.parse(sessionStorage.getItem('endDate'));
        this.eventType=this.eventInfo.eventTypeId;
        this.$route.matched[1].name=this.eventInfo.eventType;
        this.getQueryParams();
        this.getPowerscope();
        this.getTable1Data(this.flag);
    },
    update(){ 
        this.$route.matched[1].name=this.eventInfo.eventType;
    }, 
    beforeDestroy(){
        this.$route.matched[1].name=this.eventInfo.eventType;
    } 
}
</script>
<style lang="scss" scoped>
    $normal-color: #46E299;
    $error-color: #ff5f5f;
    $abnormal-color:orange;
    .file-btn{
        width: 120px;
        height: 60px;
        float: left;
        margin: 20px;
        border:1px solid #ddd;
        z-index: 999;
        position: relative;
        background-color: #fff;
        .item{
            width: 100%;
            height: 50%;
            &:hover{
                background-color: rgb(217, 239, 253);
                border: 1px solid #fff;
                cursor: pointer;
            }
        }
        span{
            margin-left: 15px;
            line-height: 30px;
        }
    }
    .el-rate-container{
        width: 97.46%;
        margin:15px;
        position: relative;
        background-color: #fff;
        border:1px solid #ddd;
        .el-rate-header{
            height: auto;
            margin:15px;
            
            background-color: #fff;
            color: #4b5262;
            .event-icon{
                margin-left: 15px;
                float: left;
            }
            .event-info-content{
                width: auto;
                height:auto;
                 float: left;
                margin-top: 10px;
                margin-left: 40px;
                .event-type{
                    // float: left;
                    font-size: 22px;
                    margin-right: 15px;
                    color: #4b5262;
                }
                .view-detail{
                    text-decoration: underline;
                    color: #45ACF7;
                    margin-left: 6px;
                    &:hover{
                        cursor: pointer;
                    }
                }
                .device-content{
                    margin-top: 10px;
                    color: #7b8da0;
                    font-size: 13px;
                    .device-name{
                    // float: left;
                        width: 220px;
                        
                    }
                    .device-type{
                        // float: left;
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                }
                .event-desr{
                    position: relative;
                    bottom: 10px;
                    color: #7b8da0;
                    font-size: 13px;
                }
                
            }
            .remoteButton{
                float:right;
                line-height:10px;
                width:110px;
                font-size:14px;
                color:#fff;
                font-weight:bold;
                margin:40px 10px 10px 10px;

            }
             .powerButton{
                background-color:#409EFF;
                display:inline-block;
                width:110px;
                height:33px;
                border-radius:4px;
                margin-top:40px;
                margin-right:10px;
                line-height:30px;
                float:right;
                padding-left:14px;
                font-size:14px;
                color:#fff;
                font-weight:bold;
                cursor: pointer;
                &:hover{
                background-color: #3babf9;
                }
                position: relative;
                span{
                color:#fff;
                &:after{
                    content:'';
                    position: absolute;
                    border:0.5px solid #fff;
                    width:1px;
                    height:20px;
                    right:30px;
                    top:5px;
                    opacity: 0.4;
                }
                }
                .icon-down-trangle{
                color:#fff;
                display:inline-block;
                width:20px;
                text-align:right;
                position: absolute;
                right:10px;

                }
        
            }
            .powerItemList{
                display:inline-block;
                width:110px;
                position: absolute;
                background-color:#f0f5f8;
                top:73px;
                right:280px;
                z-index:1;
            }
            .powerItemListItem{
                display: block;
                color:#4b5262;
                cursor:pointer;
                padding-left: 15px;
                line-height: 22px;
                text-align: left !important;
                margin-top: 5px;
                &:hover{
                    background-color:#eee;
                    font-weight: bold;
                    color: #409EFF;
                }
            }
            .header-hr{
                width: 96.8%;
                position: relative;
                top: 10px;
                margin-left: 17px;
                border:0.5px solid #ddd;
            }
            .add-state-btn{
                float:right;
                margin-right: 40px;
                margin-top: 40px;
            }
        }
        .el-rate-content{
            width: 97.46%;
            margin: 15px;
            height: 76%;
            background-color: #fff;
            .rate-content{
                width: 96.8%;
                margin:0 20px;
                .el-rate-info{
                    overflow: hidden;
                    width: 100%;
                    .title-content{
                        width: 100%;
                        overflow: hidden;
                    }
                    .el-state-title{
                        float: left;
                        margin:20px;
                    }
                    .el-desc{
                        width: 88%;
                        float: left;
                        margin-left: 20px;
                        margin-top: 15px;
                    }
                    .icon-file{
                        float: left;
                        font-size: 28px;
                        color:#409EFF;
                        margin-top: 8px;
                        margin-left: 30px;
                    }
                    .file-content{
                        width: 88%;
                        height: 120px;
                        border:1px solid #ddd;
                        position: relative;
                        top: 50px;
                        margin-left: 120px;
                        .file-icon-content{
                            margin-left: 15px;
                            float: left;
                            width: 183px;
                            height: 100px;
                            background-color: #F0F5F8;
                            position: relative;
                            .img-icon{
                                margin: 0 auto;
                                position: absolute;
                                top: 25%;
                                left: 34%;
                            }
                        }
                    }
                    .txt-inst{
                        font-size: 12px;
                        color: #fea315;
                        position: relative;
                        top: 56px;
                        margin-left: 120px;
                    }
                    .el-event-tab{
                        width: 97%;
                        margin-left: 24px;
                        margin-top: 20px;
                        .tab-left-content{
                            width: 100%;
                            height: 300px;
                            .tab-header-title{
                                width:99.6%;
                                height: 38px; 
                                background-color: #E2F3FD;
                                border: 1px solid #3CABFD;
                                .icon-tab-info{
                                    color: #3CABFD;
                                    margin-left: 15px;
                                    line-height: 36px;
                                    font-size: 18px;
                                }
                                .icon-tab-close{
                                    float:right;
                                    margin-right: 20px;
                                    margin-top: 7px;
                                    font-size: 18px;
                                    color: #3CABFD;
                                    cursor: pointer;
                                }
                                span{
                                    font-size: 14px;
                                    margin-left: 20px;
                                    
                                }
                            }
                            .el-table-content{
                                    width: 100%;
                                    margin-top: 10px;
                                    border: 1px solid #ddd;
                                    position: relative;
                                    .itemIcon{
                                        width: 12px;
                                        height: 12px;
                                        border-radius: 100%;
                                        float: left;
                                        margin-top: 4px;
                                        // position: absolute;
                                        // top: 30%;
                                        
                                    }
                                    span{
                                       margin-left: 20%;
                                    }
                                }
                        }
                    }
                }
            }
            .el-select-content{
                float: left;
                margin-top: 12px;
                margin-left: 20px; 
                width: 180px;
            }
        }
    }
</style>
<style scoped>
.el-select >>> .el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 0px;
    border: 0px;
}
</style>
