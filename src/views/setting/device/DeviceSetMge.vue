<template>
    <el-row class="el-device">
        <el-col :span="24" class="el-btns">
            <div style="display:inline-block;" v-if="activeName=='dash'">
                <el-button @click="connectServer"  size="mini" class="btns">
                    提交
                </el-button>
            </div>
            <div style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;" v-else>
                <el-input
                    size="small"
                    class="el-search-input"
                    v-model="serachVale" @keyup.enter.native="searchNVRList" placeholder='请输入关键词搜索'>
                    <i @click="searchNVRList"  slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:7px;left:6px;"></i>
                </el-input>
                 <el-button v-for="(item,index) in btnList" 
                :key="index" size="mini" @click="handleNVR(index,item)" class="el-handle-btn">
                    <i :class="item.iconClass" style="font-size:20px;"></i>
                    <span>{{item.btnTitle}}</span>
                </el-button>
            </div>
        </el-col>
        <el-col :span="24" class="el-tabPanels">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="流媒体服务" name="dash">
                    <el-col :span="varWindowWidth<1366?12:10" class="dash-content" :style="varWindowWidth<1366?{'font-size':'12px'}:{'font-size':'14px'}">
                        <div class="details">
                            <span class="dash-label">服务器IP</span>
                            <el-input class="dash-input" v-model="dash.url" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label">命令端口（http）</span>
                            <el-input class="dash-input" v-model="dash.httpCmdPort" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label">命令端口（https）</span>
                            <el-input class="dash-input" v-model="dash.httpsCmdPort" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label">数据端口</span>
                            <el-input class="dash-input" v-model="dash.dataPort" size="mini"></el-input>
                        </div>
                        <el-dialog title='导入'
                        id="importId"
                        :visible.sync="showImportContent" v-if="showImportContent"
                        :append-to-body='true'
                        width="28%"
                        top="35vh"
                        left="40vh">
                            <div class="dialog-content" style="overflow:hidden;">
                                <hr style="border: 0.5px solid #FB505F;"/>
                                <p style="margin-left:26px;margin-bottom:0px;">请选择导入文件的位置</p>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button class="file-cancel-btn" @click="showImportContent = false" size="mini" style="">取 消</el-button>
                                <a href="javascript:;" class="a-upload" @click="checkBeforeImport">选择文件
                                    <input  id="upload" type="file" @change="importfxx(this)"  
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                </a>
                            </div>
                        </el-dialog>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="视频管理" name="video">
                    <el-col :span="8" class="lisde" :style="{'min-height':varyWindowHeight*(varyWindowHeight>1000?0.78:0.70)+'px'}">
                        <div class="nvr-title tabTitle">
                            <div class="name-title titles">
                                <span>NVR名称</span>
                            </div>
                            <div class="store-title titles">
                                <span>所属门店</span>
                            </div>
                            <div class="count-title titles">
                                <span>通道数</span>
                            </div>
                        </div>
                        <div class="nvr-data group-title"
                        v-for="(item,index) in nvrData" 
                        :key="index"  :class="!item.isClick?'noraml-color':'active-color'" @click="clickNVR(index,item)">
                            <div class="name-data titles">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="store-data titles">
                                <span>{{item.store}}</span>
                            </div>
                           <div class="count-data titles">
                                <span>{{item.channelNum}}</span>
                            </div>
                        </div>
                        <div class="toolbar pagination" style="width:100%; margin-top:10px;position:absolute;bottom:10px;">
                            <el-pagination
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                :page-size="sizeNum" :total="total"
                                background
                                small
                                layout="total,jumper,prev, pager, next">
                            </el-pagination>
                        </div>
                    </el-col>
                    <el-col :span="16" class="risde">
                        <div class="nape-items-title tabTitle">
                            <div class="nape-name-title titles">
                                <span>通道名称</span>
                            </div>
                            <div class="nape-dep-title titles">
                                <span>NVR通道号</span>
                            </div>
                            <div class="nape-handle-title titles">
                                <span>操作</span>
                            </div>
                        </div>
                        <div class="nape-items-data" :style="item.isClick?{'background-color':'#FEE4E7'}:{}"
                        v-for="(item,index) in channelList" 
                        :key="index">
                            <div class="nape-name-data">
                                    <span class="nape-name" v-if="!item.isClick">{{item.name}}</span>
                                    <el-input size="mini" v-model="item.name" class="nape-input input-details" placeholder="输入巡检项名称" v-if="item.isClick"></el-input>
                            </div>
                            <div class="nape-dep-data">
                                <span class="nape-dep">{{item.channelId}}</span>
                                    <div class="iconcontent" v-if="item.isClick">
                                        <div class="iconlised"  @click="confrimEdit(index,item)">
                                            <i class="el-icon-check"></i>
                                        </div>
                                        <div class="iconrised" @click="cancelEdit(index,item)">
                                            <i class="el-icon-close"></i>
                                        </div>
                                    </div>
                            </div>
                            <div class="nape-items-handle">
                                <i class="iconfont icon-bianji" style="font-size: 20px;cursor:pointer;margin-right:10px;" 
                                 @click="handleEdit(index,item)"></i>
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
import axios from 'axios'
export default {
    name:'DeviceSetMge',
    data(){
        return{
            dash:{},
            activeName:'dash',
            total:0,
            page:0,
            sizeNum:10,
            nvrData:[],
            showImportContent:false,
            channelList:[],
            channelData:[],
            serachVale:'',
            curChannelItem:{},
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
            varWindowWidth:1440, 
            varyWindowHeight:window.innerHeight,
            contentHeight:window.screen.height,
        }
    },
    methods:{
        // 修改table tr行的背景色
        tableRowStyle({ row, rowIndex }) {
            return 'background-color: #FAFAFA;height:50px;font-size:14px; border-bottom: 1px solid #ddd;font-weight: bold;'
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #FAFAFA;color: #909399;font-weight: bold;height:48px;'
            }
        },
        clickNVR(index,item){
            let self=this;
            item.isClick=true;
            self.getChannelListByNVR(item.ivsId);
            self.nvrData.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
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
        checkBeforeImport(){
            let self=this;
            console.log('checkbeforeImport');
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
            console.log(tabs);
            sessionStorage.setItem('DevicePage_TabName',tabs.name);
        },
        importItem(){
            this.showImportContent=true;
        },
        exportItem(){
            let self=this;
            self.export2Excel();
        },
        sizeChange(val){
                this.sizeNum=val;
                this.getNVRList();
        },
        currentChange(val){
            this.page=val-1;
            this.getNVRList();
        },
        deleteChannel(channelList){
            let params={
                deviceIds:channelList
            };
            return new Promise((resolve,reject)=>{
                api.deleteDevice(params).then(res=>{
                    resolve(res.data);
                })
            })
        },
        deleteNVR(nvrList){
            let params={
                ivsIds:nvrList
            }
            return new Promise((resolve,reject)=>{
                api.deleteNVR(params).then(res=>{
                    resolve(res.data);
                })
            })
        },
        deleteAllData(channelList,nvrList){
            let params1={
                deviceIds:channelList
            };
            let params2={
                ivsIds:nvrList
            };
            return new Promise((resolve,reject)=>{
                api.deleteNVRandChannel(params1,params2).then((res)=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        async RemoveAllTags(){
            let self=this;
            let data=self.nvrData;
            console.log(data);
            let nvrList=[];
            let channelList=self.channelData.map(x=>x.id);
            data.forEach(item=>{
               nvrList.push(item.ivsId);
            })
            if(channelList.length==0&&nvrList.length==0){
                return false;
            }
            else if(channelList.length==0&&nvrList.length!=0){
                await self.deleteNVR(nvrList);
            }
            else if(channelList.length!=0&&nvrList.length==0){
                await self.deleteChannel(channelList);
            }
            else{
                await self.deleteAllData(channelList,nvrList);
            }
        },
        downItem(){
            this.RemoveAllTags();
        },
        importData(){
            let self=this;
        },
        importfxx(obj) {
            let _this = this;
            _this.RemoveAllTags();
            let inputDOM = this.$refs.inputer;
            // 通过DOM取文件数据
            this.file = event.currentTarget.files[0];
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            var reader = new FileReader();
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for(var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require('xlsx');
                    if(rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary'
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                    let arr=outdata;
                    let nvrDataTemp=[];
                    let channelDataTemp=[];
                    arr.forEach((item,index)=>{
                        if(nvrDataTemp.map(x=>x.ivsId).indexOf(item["IVS ID"])==-1){
                            let obj={
                                ivsId:item["IVS ID"],
                                name:item["NVR名称"],
                                channelCount:item["通道数"],
                                storeId:item["StoreID"]
                            }
                            nvrDataTemp.push(obj);
                        }
                        let obj={
                            name:item["通道名称"],
                            storeId:item["StoreID"],
                            ivsId:item["IVS ID"],
                            channelId:item["通道序号"]
                        }
                        channelDataTemp.push(obj);
                    })

                    let params1={
                        "nvr": nvrDataTemp
                    };
                    let params2={
                        "device": channelDataTemp
                    };
                    api.addNVRandChannel(params1,params2).then(res=>{
                        console.log(res);
                        let errMsgNVR=res[0].data.errMsg;
                        let errMsgChannel=res[1].data.errMsg;
                        if(errMsgNVR=='Success'&&errMsgChannel=='Success'){
                            _this.notify('模板导入成功!','success',3000);
                            _this.showImportContent=false;
                            _this.getNVRList();
                        }
                        else{
                            _this.notify('模板导入失败!','warning',3000);
                            _this.showImportContent=false;
                            return false;
                        }
                    })
                }
                reader.readAsArrayBuffer(f);
            }
            if(rABS){
                reader.readAsArrayBuffer(f);
            }
            else{
                reader.readAsBinaryString(f);
            }
        },
        export2Excel() {
            var that = this;
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/excel/Export2Excel'); 
                const tHeader = ['StoreID','所属门店', 'IVS ID','NVR名称','通道数','通道名称','通道序号']; // 导出的表头名
                const filterVal = ['storeId','storeName','ivsId','nvrName','channelCount','channelName','channelNum']; // 导出的表头字段名
                console.log(that.activeName);
                let nvrData=that.nvrData;
                let channelData=that.channelData;
                let excelData=[];
                if(nvrData.length!=0&&channelData.length!=0){
                    nvrData.forEach((item,index)=>{
                        channelData.forEach((_item,_index)=>{
                            if(item.ivsId==_item.ivsId){
                                let obj={};
                                obj.storeId=item.storeId;
                                obj.storeName=item.store;
                                obj.ivsId=item.ivsId;
                                obj.nvrName=item.name;
                                obj.channelCount=item.channelNum.substr(0,item.channelNum.length-1);
                                obj.channelName=_item.name;
                                obj.channelNum=_item.channelId;
                                excelData.push(obj);
                            }
                            
                        })
                    })
                }
                
                const list = excelData;
                const data = that.formatJson(filterVal, list);

                export_json_to_excel(tHeader, data, `看门店-设备管理导入示例`);// 导出的表格名称，根据需要自己命名
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        handleNVR(index,item){
            let self=this;
            console.log(item);
            switch(index){
                case 0: self.importItem();break;
                case 1: self.exportItem();break;
                case 2: self.downItem();break;
            }
        },
        handleEdit(index,item){
            let self=this;
            item.isClick=true;
            self.curChannelItem=item;
            self.channelList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
        },
        cancelEdit(index,item){
            item.isClick=false;
        },
        confrimEdit(){
            let self=this;
            let obj={};
            obj.id=self.curChannelItem.id;
            obj.name=self.curChannelItem.name;
            let params=obj;
            api.updateDevice(params).then(res=>{
                console.log(res.data);
                let errMsg=res.data.errMsg;
                if(errMsg!=undefined&&errMsg=='Success'){
                    self.notify('修改成功！','success',3000);
                    self.curChannelItem.isClick=false;
                }
                else{
                    self.notify('修改失败！','warning',3000);
                }
            })
            .then(async()=>{
                self.channelData=await self.getChannelData();  //修改后更新数据源
            })
        },
        getNVRList(){
            let self=this;
            let params={
                "filter": {
                    "page": self.page,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": "asc",
                    "property": "name"
                }
            };
            api.getNVRList(params).then(res=>{
                let errMsg=res.data.errMsg;
                let temp=[];
                if(errMsg!=undefined&&errMsg=='Success'){
                    let data=res.data.data.content;
                    data.forEach((item,index)=>{
                        let obj={};
                        obj.ivsId=item.ivsId;
                        obj.name=item.name;
                        obj.store=item.storeName;
                        obj.storeId=item.storeId;
                        obj.channelNum=item.channelCount+'个';
                        if(index==0){
                            obj.isClick=true;
                        }
                        else{
                            obj.isClick=false;
                        }
                        temp.push(obj);
                    })
                    self.nvrData=temp;
                    self.total=res.data.data.totalElements;
                    
                }
            })
            .then(async()=>{
                if(self.nvrData.length!=0){
                    console.log(self.nvrData[0].ivsId);
                    self.channelData=await self.getChannelData();
                    self.getChannelListByNVR(self.nvrData[0].ivsId);
                }   
            })
        },
        searchNVRList(){

        },
        getChannelData(){
            let self=this;
            return new Promise((resolve,reject)=>{
                api.getDeviceList().then(res=>{
                    let errMsg=res.data.errMsg;
                    console.log(res);
                    if(errMsg!=undefined&&errMsg=='Success'){
                        let data=res.data.data;
                        resolve(res.data.data);
                    }
                })
            })
            
        },
        getChannelListByNVR(ivsId){
            let self=this;
            let temp=[];
            self.channelData.forEach(item=>{
                if(item.ivsId==ivsId){
                    let obj={};
                    obj.id=item.id;
                    obj.name=item.name;
                    obj.channelId=item.channelId;
                    obj.isClick=false;
                    temp.push(obj);
                }
            })
            self.channelList=temp;
        },
        async InitData(){
            let self=this;
            if(self.varyWindowHeight>=1080){
                self.sizeNum=25;
                self.contentHeight=self.varyWindowHeight*0.78;
            }
            else {
                self.sizeChange=10;
                self.contentHeight=self.varyWindowHeight*0.65;
            }
            self.activeName=sessionStorage.getItem('DevicePage_TabName')==undefined||
                    sessionStorage.getItem('DevicePage_TabName').length==0?'dash':sessionStorage.getItem('DevicePage_TabName');
            let data=await self.getDashServerInfo();
            self.dash=data;
            self.channelData=await self.getChannelData();   //获取channel信息
            self.getNVRList();       //获取NVR 数据信息
            
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
    created(){
        this.varWindowWidth=window.innerWidth;
        console.log(this.varWindowWidth);
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
@import '../../../assets/css/importfile.css'; 
@import '../../../assets/css/textstyle.css';
$mainColor:#FB505F;
@mixin titleStyle{
    height: 48px;
    line-height: 48px;
    // color: #909399;
    // font-weight:bold;
    // font-size: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}
//@mixin 超出显示省略号
@mixin txtEllipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
*{
    font-family: Microsoft YaHei;
}
.noraml-color{
    color: #4b5262 !important;
    background-color: #FAFAFA;
    cursor: pointer;
}
.active-color{
    color: #FB505F !important;
    background-color: #fff;
}
.el-search-input{
    width:180px;
    margin-right:20px;
}
.el-handle-btn{
    margin-left: 0px !important;
    border-color: $mainColor !important;
    color: $mainColor !important;
    border-radius: 0px;
    padding: 3px 10px !important;
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
            width: 90px;
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
        .titles{
            display: inline-block;
            span{
                position: relative;
                left: 20%;
            }
        }
        .dash-content{
            text-align: left;
            position: relative;
            overflow: hidden;
            .details{
                height: 50px;
                line-height: 50px;
                // font-size: 14px;
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
            position: relative;
            .nvr-title{
                @include titleStyle;
                .name-title{
                   width: 30%;
                }
                .store-title{
                    width: 45%;
                }
                .count-title{
                    width: 15%;
                }
            }
            .nvr-data{
                @include titleStyle;

                .name-data{
                    width: 30%;
                }
                .store-data{
                    width: 45%;
                }
                .count-data{
                    width: 15%;
                }
            }
        }
        .risde{
            .iconcontent{
                position: absolute;
                margin-top: 10px;
                cursor: pointer;
                display: inline-block;
                right: 15px;
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
                @include titleStyle;
                .nape-name-title{
                    width: 36%;
                }
                .nape-dep-title{
                    width: 52%;
                }
                .nape-handle-title{
                    width: 8%;
                }
            }
            .nape-items-data{
                overflow: hidden;
                position: relative;
                padding-left: 1%;
                cursor: pointer;
                font-size: 14px;
                height: 49px;
                line-height: 49px;
                text-align: left;
                .nape-input{
                    width: 220px;
                    margin-left: 13%;
                    font-size: 14px;
                    position: relative;
                    bottom: 2px;
                }
                .nape-name-data{
                    width: 36%;
                    display: inline-block;
                    position: relative;
                    span{
                        margin-left: 20%;
                        position: relative;
                    }
                }
                .nape-dep-data{
                    width: 52%;
                    display: inline-block;
                    position: relative;
                    span{
                        margin-left: 20%;
                    }
                }
                .nape-items-handle{
                    width: 8%;
                    margin-left: 2%;
                    display: inline-block;
                }
            }
            
        }
    }
}
</style>
<style>
.el-input__inner{
    border-radius: 0px !important;
}
.el-input__inner:focus{
    border:1px solid #FB505F !important;
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
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td, 
.el-table__body tr.current-row>td {
	background-color: #fff !important;
    color:#FB505F !important;
    cursor: pointer !important;
}

.el-table--enable-row-hover .el-table__body tr:hover>td{
	background-color: #fff !important;
    cursor: pointer !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color:#FB505F !important;
    color:#fff !important;
}
#importId .el-dialog__body{
    padding-top:0px !important;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 15px !important;
    line-height: 50% !important;
}
</style>
