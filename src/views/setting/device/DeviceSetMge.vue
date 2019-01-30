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
                :key="index" size="mini" @click="handleNVR(index,item)" class="el-handle-btn" :disabled="index==2">
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
                            <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>服务器IP</span>
                            <el-input class="dash-input" v-model="dash.url" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>命令端口（http）</span>
                            <el-input class="dash-input" v-model="dash.httpCmdPort" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>命令端口（https）</span>
                            <el-input class="dash-input" v-model="dash.httpsCmdPort" size="mini"></el-input>
                        </div>
                        <div class="details">
                            <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>数据端口</span>
                            <el-input class="dash-input" v-model="dash.dataPort" size="mini"></el-input>
                        </div>
                        <el-dialog title='导入'
                        id="importId"
                        :visible.sync="showImportContent" v-if="showImportContent"
                        :close-on-click-modal="false"
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
                        <el-dialog title='提示'
                        :visible.sync="showConfirmImport" v-if="showConfirmImport"
                        :append-to-body='true'
                        :close-on-click-modal="false"
                        width="28%"
                        top="35vh"
                        left="40vh">
                            <div class="dialog-content" style="overflow:hidden;">
                                <hr style="border: 0.5px solid #FB505F;"/>
                                
                                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                                    <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                                    <span>此操作将会清空当前页面已有NVR及设备，是否继续?</span>
                                </p>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button class="file-cancel-btn" @click="showConfirmImport = false" size="mini" style="">取 消</el-button>
                                <el-button class="file-confirm-btn" @click="showImportContent=true;showConfirmImport=false" size="mini" style="color:#fff">确 认</el-button>
                            </div>
                        </el-dialog>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="视频管理" name="video">
                    <el-col :span="8" class="lisde">
                        <div class="nvr-title tabTitle">
                            <div class="name-title titles">
                                <span>NVR名称</span>
                                <i class="icon-filter" 
                                :class="{'el-icon-arrow-up':nvrFilter,'el-icon-arrow-down':!nvrFilter}" @click="filterNVR"></i>
                            </div>
                            <div class="store-title titles" >
                                <span>所属门店</span>
                                <i class="icon-filter"
                                :class="{'el-icon-arrow-up':storeFilter,'el-icon-arrow-down':!storeFilter}" @click="filterStore"></i>
                            </div>
                            <div class="count-title titles">
                                <span>通道数</span>
                            </div>
                        </div>
                        <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                            <div  :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                                <div class="nvr-data group-title"
                                v-for="(item,index) in nvrData" 
                                :key="index"  :class="!item.isClick?'noraml-color':'active-color'" @click="clickNVR(index,item)">
                                    <div class="proper-flag" v-if="item.isClick"></div>
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
                            </div>
                        </el-scrollbar>
                        
                        <div class="toolbar pagination" style="width:100%; margin-top:10px;">
                            <el-pagination
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                :pager-count="paperCount"
                                :page-size="sizeNum" 
                                :total="total"
                                :current-page="page"
                                background
                                small
                                layout="jumper,prev,pager,next">
                            </el-pagination>
                        </div>
                    </el-col>
                    
                    <el-col :span="16" class="risde">
                        <div class="nape-items-title tabTitle">
                            <div class="nape-name-title titles">
                                <span>通道名称</span>
                                <!-- <i class="icon-filter" 
                                :class="{'el-icon-arrow-down':channelFilter,'el-icon-arrow-up':!channelFilter}" @click="filterChannel"></i> -->
                            </div>
                            <div class="nape-dep-title titles">
                                <span>NVR通道号</span>
                                <!-- <i class="icon-filter" 
                                :class="{'el-icon-arrow-down':channelNumFilter,'el-icon-arrow-up':!channelNumFilter}" @click="filterChannelNum"></i> -->
                            </div>
                            <div class="nape-handle-title titles">
                                <span>操作</span>
                            </div>
                        </div>
                        <el-scrollbar style="height:100%;" id="el-menuscrollbar">
                            <div  :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
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
                            </div>
                        </el-scrollbar>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
import api from '@/api/index'
import axios from 'axios'
import {validateInput,validateURL,validatePort} from '@/common/validate'
import {deviceRESTful} from '@/api/index'
import {isLoginIn} from '@/api/login'
export default {
    name:'DeviceSetMge',
    data(){
        return{
            dash:{},
            activeName:'dash',
            total:0,
            page:1,
            sizeNum:10,
            nvrData:[],
            //the filter flag
            nvrFilter:true,
            storeFilter:true,
            channelFilter:true,
            channelNumFilter:true,
            paperCount:3,
            showImportContent:false,
            showConfirmImport:false,
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
        }
    },
    computed:{
        varyDivHeight:function(){
            if(this.varyWindowHeight>800){
                return this.varyWindowHeight*0.65;
            }
            else if(this.varyWindowHeight>700){
                return this.varyWindowHeight*0.60;
            }
            else{
                return this.varyWindowHeight*0.526;
            }
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
                deviceRESTful.getDashServerInfo().then(res=>{
                    console.log(res.errMsg);
                    resolve(res);
                })
            })
        },
        checkBeforeImport(){
            let self=this;
            console.log('checkbeforeImport');
        },
        checkDashInfo(){
            let self=this;
            let msg='';
            if(self.dash.url.toString().trim().length==0||self.dash.httpCmdPort.toString().trim().length==0
            ||self.dash.httpsCmdPort.toString().trim().length==0||self.dash.dataPort.toString().trim().length==0){
                msg='当前配置项均为必填项！';
            }
            if(!validateURL(self.dash.url)){
                msg='当前配置项中IP格式错误！';
            }
            if(validatePort(self.dash.httpCmdPort)
            ||validatePort(self.dash.httpsCmdPort)||validatePort(self.dash.dataPort)){
                msg='当前配置项端口格式错误！';
            }
            return msg;
        },
        async connectServer(){
            let self=this;
            let data=await self.getDashServerInfo();
            let msg=self.checkDashInfo();
            if(msg.length!=0){
                self.notify(msg,'warning',3000);
                setTimeout(function(){
                    if(data.errCode!=null&&data.errMsg=='Success'){
                        self.dash=data.data;
                    }
                },1000)
                return false;
            }
            let params={
                "url": self.dash.url,
                "httpCmdPort": self.dash.httpCmdPort,
                "httpsCmdPort": self.dash.httpsCmdPort,
                "dataPort": self.dash.dataPort,
                "loginId": "",
                "password": ""
            };
            if(data.errCode!=null&&data.errCode==500){ //Dash Server does not exsit!
                deviceRESTful.addDashServer(params).then(res=>{
                    let errMsg=res.errMsg;
                    if(errMsg!=undefined&&errMsg=='Success'){
                        self.notify('连接成功!','success',3000);
                    }
                    else{
                        self.notify('连接失败!','warning',3000);
                        return false;
                    }
                })
            }
            else{                          
                deviceRESTful.upateDashServer(params).then(res=>{
                    let errMsg=res.errMsg;
                    if(errMsg!=undefined&&errMsg=='Success'){
                        self.notify('连接成功!','success',3000);
                    }
                    else{
                        self.notify('连接失败!','warning',3000);
                        setTimeout(function(){
                            self.dash=data.data;
                        },1000)
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
            this.showConfirmImport=true;
        },
        exportItem(){
            let self=this;
            self.export2Excel();
        },
        sizeChange(val){
            let self=this;
            self.sizeNum=val;
            let params={
                "filter": {
                    "page": self.page-1,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": "asc",
                    "property": "name"
                }
            };
            this.getNVRList(params);
        },
        currentChange(val){
            let self=this;
            self.page=val;
            let params={
                "filter": {
                    "page": self.page-1,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": "asc",
                    "property": "name"
                }
            };
            self.getNVRList(params);
        },
        //nvr list filter
        filterNVR(){
            let self=this;
            self.nvrFilter=!self.nvrFilter;
            console.log(self.nvrFilter);
            self.page=1;
            let params={
                "filter": {
                    "page": self.page-1,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": self.nvrFilter?"asc":"desc",
                    "property": "name"
                }
            };
            self.getNVRList(params);
        },
        filterStore(){
            let self=this;
            self.storeFilter=!self.storeFilter;
            console.log(self.storeFilter);
            self.page=1;
            let params={
                "filter": {
                    "page": self.page-1,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": self.storeFilter?"asc":"desc",
                    "property": "storeName"
                }
            };
            self.getNVRList(params);
        },
        filterChannel(){
            let self=this;
        },
        filterChannelNum(){
            let self=this;
        },
        deleteChannel(channelList){
            let params={
                deviceIds:channelList
            };
            return new Promise((resolve,reject)=>{
                deviceRESTful.deleteDevice(params).then(res=>{
                    resolve(res);
                })
            })
        },
        deleteNVR(nvrList){
            let params={
                ivsIds:nvrList
            }
            return new Promise((resolve,reject)=>{
                deviceRESTful.deleteNVR(params).then(res=>{
                    resolve(res);
                })
            })
        },
        addNVR(params){
            return new Promise((resolve,reject)=>{
                deviceRESTful.addNVR(params).then(res=>{
                    resolve(res);
                })
            })
        },
        addDevice(params){
            return new Promise((resolve,reject)=>{
                deviceRESTful.addDevice(params).then(resDevice=>{
                    resolve(resDevice);
                })
            })
        },
        getAllNVRData(){
            let self=this;
            let params={
                "filter": {
                    "page": 0,
                    "size": self.total
                }
            };
            return new Promise((resolve,reject)=>{
                deviceRESTful.getNVRList(params).then(res=>{
                    let errMsg=res.errMsg;
                    let data=[];
                    if(errMsg!=undefined&&errMsg=='Success'){
                        data=res.data.content;
                    }
                    resolve(data);
                })
            })
        },
        async addAllData(paramsNVR,paramsDevice){
            let self=this;
            let data=await self.getAllNVRData();
            console.log(data);
            let nvrList=[];
            let channelList=self.channelData.map(x=>x.id);
            data.forEach(item=>{
               nvrList.push(item.ivsId);
            })
            if(channelList.length==0&&nvrList.length==0){
                console.log('当前页面为空！');
            }
            else if(channelList.length==0&&nvrList.length!=0){
                await self.deleteNVR(nvrList);
            }
            else if(channelList.length!=0&&nvrList.length==0){
                await self.deleteChannel(channelList);
            }
            else{
                await self.deleteChannel(channelList);
                await self.deleteNVR(nvrList);
            }
            let res1= await self.addNVR(paramsNVR);
            let res2= await self.addDevice(paramsDevice);
            if(res1.errMsg=='Success'&&res2.errMsg=='Success'){
                self.notify('模板导入成功!','success',3000);
                self.showImportContent=false;
            }
            else{
                self.notify('模板导入失败!','warning',3000);
                self.showImportContent=false;
            }
            self.page=1;
            let params={
                "filter": {
                    "page": self.page-1,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": "asc",
                    "property": "name"
                }
            };
            self.getNVRList(params);
        },
        downItem(){
            this.RemoveAllTags();
        },
        importData(){
            let self=this;
        },
        importfxx(obj) {
            let _this = this;
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
                reader.onload = async function(e) {
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
                    if(!outdata[0].hasOwnProperty('StoreID')){
                        _this.notify('当前模板错误，请更换模板重新导入！','warning',3000);
                        return false;
                    }
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
                    _this.addAllData(params1,params2);
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
            require.ensure([], async() => {
                const { export_json_to_excel } = require('@/excel/Export2Excel'); 
                const tHeader = ['StoreID','所属门店', 'IVS ID','NVR名称','通道数','通道名称','通道序号']; // 导出的表头名
                const filterVal = ['storeId','storeName','ivsId','nvrName','channelCount','channelName','channelNum']; // 导出的表头字段名
                console.log(that.activeName);
                let nvrData=await that.getAllNVRData();
                let channelData=that.channelData;
                let excelData=[];
                if(nvrData.length!=0&&channelData.length!=0){
                    nvrData.forEach((item,index)=>{
                        channelData.forEach((_item,_index)=>{
                            if(item.ivsId==_item.ivsId){
                                let obj={};
                                obj.storeId=item.storeId;
                                obj.storeName=item.storeName;
                                obj.ivsId=item.ivsId;
                                obj.nvrName=item.name;
                                obj.channelCount=item.channelCount;
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
            deviceRESTful.updateDevice(params).then(res=>{
                console.log(res.data);
                let errMsg=res.errMsg;
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
        getNVRList(params){
            let self=this;
            deviceRESTful.getNVRList(params).then(res=>{
                let errMsg=res.errMsg;
                let temp=[];
                if(errMsg!=undefined&&errMsg=='Success'){
                    let data=res.data.content;
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
                    self.total=res.data.totalElements;
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
                deviceRESTful.getDeviceList().then(res=>{
                    let errMsg=res.errMsg;
                    console.log(res);
                    if(errMsg!=undefined&&errMsg=='Success'){
                        let data=res.data;
                        resolve(res.data);
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
            if(self.varyWindowHeight>=760){
                self.sizeNum=20;
            }
            else {
                self.sizeChange=10;
            }
            self.activeName=sessionStorage.getItem('DevicePage_TabName')==undefined||
                    sessionStorage.getItem('DevicePage_TabName').length==0?'dash':sessionStorage.getItem('DevicePage_TabName');
            let data=await self.getDashServerInfo();
            if(!data){
                return false;
            }
            if(data.errMsg=='Success'&&data.data!=null){
                self.dash=data.data;
            }
            self.channelData=await self.getChannelData();   //获取channel信息

            let params={
                "filter": {
                    "page": self.page-1,
                    "size": self.sizeNum
                },
                "order": {
                    "direction": "asc",
                    "property": "name"
                }
            };
            self.getNVRList(params);       //获取NVR 数据信息
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
@mixin titleStyle{
    @include point(height,48);
    @include point(line-height,48);
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
    color: $mainColor !important;
    background-color: #fff;
}
.el-search-input{
    @include point(width,180);
    @include point(margin-right,20);
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
        @include point(padding-top,10);
        @include point(padding-right,20);
        position: relative;
        @include point(height,31);
        .btns{
            position: absolute;
            @include point(right,25);
            z-index: 979;
            @include point(width,90);
            background-color: $mainColor;
            color: #fff;
            border-color: $mainColor;
        }
    }
    .el-tabPanels{
        @include point(padding,20);
        height: auto;
        position: relative;
        @include point(bottom,25);
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
                @include point(height,50);
                @include point(line-height,50);
                @include point(padding-left,10);
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
            .icon-filter{
                position: relative;
                left: 20%;
                cursor: pointer;
            }
            .nvr-title{
                @include titleStyle;
                font-size: 14px;
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
                position: relative;
                font-size: 14px;
                .proper-flag{
                    height: 70%;
                    width: 4px;
                    position:absolute;
                    top: 15%;
                    background-color: $mainColor;
                }
                .name-data{
                    width: 30%;
                }
                .store-data{
                    width: 45%;
                }
                .count-data{
                    width: 15%;
                }
                &:last-child{
                    margin-bottom: 20px;
                }
            }
        }
        .risde{
            .iconcontent{
                position: absolute;
                @include point(margin-top,10);
                cursor: pointer;
                display: inline-block;
                @include point(right,15);
                .iconlised{
                    float: left;
                    position: relative;
                    background-color: $mainColor;
                    padding: 1px 6px;
                    color: #fff;
                    border-width: 1px 1px 1px 1px;
                    border-style: solid;
                    border-color: #ddd;
                    @include point(line-height,21);
                    @include point(height,21);          
                }
                .iconrised{
                    float: left;
                    position: relative;
                    padding: 1px 6px;
                    border-width: 1px 1px 1px 0px;
                    border-style: solid;
                    border-color: #ddd;
                    background-color: #fff;
                    @include point(line-height,21);
                    @include point(height,21); 
                }
            }
             padding:0 15px;
             .nape-items-title{
                @include titleStyle;
                font-size: 14px;
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
                @include point(height,49); 
                @include point(line-height,49);

                text-align: left;
                .nape-input{
                    @include point(width,220);
                    margin-left: 13%;
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
@import '../../../assets/css/pagination.css';
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
#importId .el-dialog__body{
    padding-top:0px !important;
}
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-dialog__body{
    padding: 0px;
}
</style>
<style scoped>
.el-input--small >>>.el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 15px !important;
    line-height: 50% !important;
}
</style>
