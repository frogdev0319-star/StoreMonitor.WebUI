<template>
    <el-row class="el-route-container">
        <el-col :span="24" class="el-route-header">
            <el-col :span="7" class="el-route-btns">
                <span style="margin-right:15px;color:#A2AEBC">已绑定{{storeNum}}家门店</span>
                <el-button size="mini" @click="bindStore" class="el-bind-btn" 
                :disabled="elTableData[Number(activeName)].routeData.length==0">
                    <i style="margin-right:10px;" class="iconfont icon-quxiaolianjie"></i>
                    <span>巡检表绑定</span>
                </el-button>

                <el-button v-for="(item,index) in btnList" 
                :key="index" size="mini" @click="handleNape(index,item)" class="el-handle-btn">
                    <i :class="item.iconClass" style="font-size:24px;"></i>
                    <span>{{item.btnTitle}}</span>
                </el-button>
                
                <el-dialog title='导入'
                :visible.sync="showImportContent" v-if="showImportContent"
                :append-to-body='true'
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;">
                        <hr style="border: 0.5px solid #FB505F;"/>
                        <p style="margin-left:26px;margin-bottom:0px;">请选择导入文件的位置</p>
                        <div style="margin-left:20px;">
                            <el-radio-group v-model="checkValue" size="mini" style="margin-top:8px;" @change="changeValue">
                                <el-radio-button style="margin-left:10px;" 
                                v-for="(item,key) in radioList" :key="key" 
                                :label="item.label"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="tabName-input-content">
                            <input type="text" v-model="tabNameInput" class="tabName-input" placeholder="请输入巡检表名称" v-if="checkValue=='新增巡检表'">
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showImportContent = false" size="mini" style="">取 消</el-button>
                       
                        <a href="javascript:;" class="a-upload" @click="checkBeforeImport">选择文件
                            <!-- <div class="file-sliver"  v-if="hideUpload"> -->
                            
                                <input  id="upload" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <!-- </div> -->
                        </a>
                    </div>
                </el-dialog>

            </el-col>

            <el-col :span="18" class="el-route-tabs">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item,index) in elTableData" :key="index" :label="item.label" :closable="index!=0&&index!=1?true:false" >
                        <div v-if="item.routeData">
                            <route-detail :ref="curIndex" :route-data="item.routeData"
                             :tab-name="item.label" @refreshList="getTagList"></route-detail>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-col>
    </el-row>
</template>
<script>
import RouteDetail from '@/views/setting/routeInspection/RouteDetail'
import api from '@/api/index'
export default {
    name:'RouteInspection',
    components:{
        RouteDetail
    },
    data(){
        return{
            elTableData:[{label:'远程巡检',routeData:[]},{label:'现场巡检',routeData:[]}],
            radioList:[
                {
                    'value':'1',
                    'label':'远程巡检'
                },
                {
                    'value':'2',
                    'label':'现场巡检'
                },
                // {
                //     'value':'3',
                //     'label':'新增巡检表'
                // }
            ],
            curIndex:'id0',
            showBtnContent:false,
            storeNum:0,
            activeName:'',
            showImportContent:false,
            checkValue:'',
            tabNameInput:'',
            hideUpload:false,
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

            allData:[],
            tagList:['远程巡检','现场巡检'],
            curData:[]
        }
    },
    mounted(){
        let self=this;
        self.getTagList();
        self.initData();
        let tabIndex=sessionStorage.getItem('TabIndex');
        self.activeName=tabIndex!=undefined?tabIndex:self.activeName;
    },
    methods:{
        initData(){
            let self=this;
            switch(Number(self.activeName)){
                case 0: self.checkValue='远程巡检'; break;
                case 1: self.changeValue='现场巡检';break;
                default:self.changeValue='新增巡检表';break;
            }
        },
        getNapeList(){
            let self=this;
            
            return new Promise((resolve,reject)=>{
                api.getInspectItemList().then(res=>{
                    let code=res.data.errMsg;
                    let data=res.data.data;
                    if(code!=null&&code=='Success'){
                        self.allData=data;
                        console.log(res.data);
                    }
                    resolve(data);
                }).catch(err => {
                    console.log(err.message);
                    self.notify('服务器异常!','error',3000);
                })
                        
            })
           
        },
        async getTagList(){
            let self=this;
            let data=await self.getNapeList();
            if(data.length!=0){
                data.forEach(item=>{
                    let tag=item.tag;
                    if(self.tagList.indexOf(tag)==-1){
                        self.tagList.push(tag);
                    }
                })
                let tempAllData=[];
                self.tagList.forEach(item=>{
                    let tag=item;
                    let obj={};
                    let temp=[];
                    self.allData.forEach((_item,_index)=>{
                        if(tag==_item.tag){
                            let _obj={};
                            _obj.id=_item.id;
                            _obj.groupName=_item.name;
                            _obj.itemCount=_item.items.length;
                            _obj.checked=false;
                            let tempChild=[];
                            _item.items.forEach(itemChild=>{
                                let objChild={};
                                objChild.id=itemChild.id;
                                objChild.checked=false;
                                objChild.name=itemChild.subject;
                                objChild.description=(itemChild.description==undefined||itemChild.length==0)?'---':itemChild.description;
                                objChild.score=itemChild.itemScore+'分';
                                tempChild.push(objChild);
                            })
                            _obj.itemData=tempChild;
                            temp.push(_obj);
                        }
                    })
                    if(item=='远程巡检'){
                        let obj={};
                        obj.label=item;
                        obj.routeData=temp;
                        self.elTableData[0]=obj;
                    }
                    else if(item=='现场巡检'){
                        let obj={};
                        obj.label=item;
                        obj.routeData=temp;
                        self.elTableData[1]=obj;
                    }
                    else{
                        obj.label=item;
                        obj.routeData=temp;
                        tempAllData.push(obj);
                    }
                })
                self.elTableData=self.elTableData.concat(tempAllData);
            }
            else{
                self.elTableData=[{label:'远程巡检',routeData:[]},{label:'现场巡检',routeData:[]}];
            }
            self.getBindStoreList();
        },
        deleteItems(itemIds){
            let self=this;
            if(itemIds.length==0){
                return false;
            }
            return new Promise((resolve,reject)=>{
                let params={
                    "itemIDs":itemIds
                }
                api.deleteInspectItem(params).then(res=>{
                    let code=res.data.errMsg;
                    let data=res.data.data;
                    if(code!=null&&code=='Success'){
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        deleteGroups(groupIds){
            let self=this;
            if(groupIds.length==0){
                return false;
            }
            return new Promise((resolve,reject)=>{
                let params={
                    "groupIDs":groupIds
                }
                api.deleteInspectGroup(params).then(res=>{
                    let code=res.data.errMsg;
                    let data=res.data.data;
                    if(code!=null&&code=='Success'){
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        async RemoveAllTags(){
            let self=this;
            let data=self.elTableData[Number(self.activeName)];
            console.log(data);
            console.log(data.label);
            let groupIdList=[];
            let itemIdList=[];
            data.routeData.forEach(item=>{
                groupIdList.push(item.id);
                item.itemData.forEach(_item=>{
                    itemIdList.push(_item.id);
                })
            })
            let retItem=await self.deleteItems(itemIdList);
            console.log(retItem);
            let retGroup=await self.deleteGroups(groupIdList);
        },
        addGroup(groupObj){
            let self=this;
            let params={
                "groups": groupObj
            };
            return new Promise((resolve,reject)=>{
                api.addInspectGroup(params).then(res=>{
                    let code=res.data.errMsg;
                    let data=res.data.data;
                    if(code!=null&&code=='Success'){
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        addItem(itemObj){
            let self=this;
            let params={
                "request": itemObj
            }
            return new Promise((resolve,reject)=>{
                api.addInspectItem(params).then(res=>{
                    let code=res.data.errMsg;
                    let data=res.data.data;
                    if(code!=null&&code=='Success'){
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        handleItem(){
            this.showBtnContent=!this.showBtnContent;
        },
        bindStore(){
            let self=this;
            let arr=[];
            if(self.elTableData[Number(self.activeName)].routeData.length==0){
                self.notify('当前巡检表为空，请新增巡检项后进行操作！','warning',3000);
                return false;
            }
            self.elTableData[Number(self.activeName)].routeData.forEach(item=>{
                item.itemData.forEach(_item=>{
                    arr.push(_item.id);
                });
            });
            console.log(arr);
            sessionStorage.setItem('TabName',self.activeName);
            sessionStorage.setItem('NapeId',JSON.stringify(arr));
            self.$router.push({name:'门店绑定',params:self.activeName});
        },
        
        changeValue(obj){
            let self=this;
            self.tabNameInput='';
            if(obj!='新增巡检表'){
                self.hideUpload=false;
            }
            else{
               if(self.tabNameInput.length==0){
                   self.hideUpload=true;
               }
               else{
                   self.hideUpload=false;
               }
            }
        },
        handleClick(tabObj){
            console.log(tabObj);
            let self=this;
            sessionStorage.setItem('TabIndex',tabObj.index);
            self.getBindStoreList();
            switch(tabObj.index){
                case '0':
                this.checkValue='远程巡检';break;
                case '1':
                this.checkValue='现场巡检';break;
                default:
                this.checkValue='新增巡检表';break;
            }
        },
        importItem(){
            this.showImportContent=true;
        },
        checkBeforeImport(){
            let self=this;
            if(self.checkValue=='新增巡检表'&&(self.tabNameInput==null||self.tabNameInput.trim().length==0)){
                self.hideUpload=true;
                self.notify('请输入自定义巡检表名称!','warning',3000);
                return false;
            }
           
            else{
                self.hideUpload=false;
            }
        },
        getBindStoreList(){
            let self=this;
            let tagName=self.elTableData[Number(self.activeName)].label;
            let params={tagName:tagName};
            api.getInspectBindList(params).then(res=>{
                console.log(res.data.errMsg);
                if(res.data.errMsg!=undefined&&res.data.errMsg=='Success'){
                    let data=res.data.data;
                    self.storeNum=data.length;
                }
            })
        },
        exportItem(){
            let self=this;
            self.export2Excel();
        },
        downItem(){
            this.RemoveAllTags();
        },
        async importfxx(obj) {
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
                    let indexArry=[];
                    let typeName=[];
                    arr.forEach((item,index)=>{
                        if(item['检查分类']!=undefined&&item["检查分类"].length!=0){
                            indexArry.push(index);
                            typeName.push(item['检查分类']);
                        }
                    })
                    let dataArry=[];
                    for(var i=0;i<indexArry.length;i++){
                        if(i<indexArry.length){
                            dataArry[i]=outdata.slice(indexArry[i],indexArry[i+1]);
                        }
                        else{
                            dataArry[i]=outdata.slice(indexArry[length-1],indexArry.length);
                        }
                    }
                    let tempGroups=[];
                    dataArry.forEach((item,index)=>{
                        let obj={};
                        obj.name=item[0]['检查分类'];
                        obj.mode=0;
                        obj.tag=_this.checkValue;
                        tempGroups.push(obj);
                    })
                    let params={
                        "groups": tempGroups
                    };
                    api.addInspectGroup(params).then(res=>{
                        let code=res.data.errMsg;
                        let data=res.data.data;
                        if(code!=null&&code=='Success'){
                            console.log(res.data);
                            let tempItems=[];
                            dataArry.forEach((item,index)=>{
                                let obj={};
                                let temp=[];
                                item.forEach((_item,_index)=>{
                                    let _obj={};
                                    _obj.subject=_item['检查项目名称'];
                                    _obj.description=_item["检查项目详细说明"];
                                    _obj.itemScore=10;
                                    temp.push(_obj);
                                })
                                obj.groupId=data[index];
                                obj.items=temp;
                                tempItems.push(obj);
                            })
                            let params={
                                "request": tempItems
                            };
                            api.addInspectItem(params).then(res=>{
                                let code=res.data.errMsg;
                                let data=res.data.data;
                                if(code!=null&&code=='Success'){
                                    console.log(res.data);
                                    _this.notify('模板导入成功!','success',3000);
                                    _this.showImportContent=false;
                                    _this.getTagList();
                                }
                                else{
                                    _this.notify('模板导入失败!','warning',3000);
                                    return false;
                                }
                            })
                        }
                        else{
                            _this.notify('模板导入失败!','warning',3000);
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
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.editableTabs2.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
            });
            this.editableTabsValue2 = newTabName;
        },
        handleNape(index,item){
            console.log(item);
            let self=this;
            switch(index){
                case 0: self.importItem();break;
                case 1: self.exportItem();break;
                case 2: self.downItem();break;
            }
        },
        export2Excel() {
            var that = this;
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/excel/Export2Excel'); 
                const tHeader = ['检查分类','检查项目名称', '检查项目详细说明',]; // 导出的表头名
                const filterVal = ['gourpname','napename','napedep',]; // 导出的表头字段名
                console.log(that.activeName);
                let curData=that.elTableData[Number(that.activeName)].routeData;
                let excelData=[];
                
                curData.forEach((item,index)=>{
                    item.itemData.forEach((_item,_index)=>{
                        let obj={};
                        if(_index==0){
                            obj.gourpname=item.groupName;
                        }
                        else{
                            obj.gourpname='';
                        }
                        obj.napename=_item.name;
                        obj.napedep=_item.description=='---'?'':_item.description;
                        excelData.push(obj);
                    })
                })
                const list = excelData;
                const data = that.formatJson(filterVal, list);

                export_json_to_excel(tHeader, data, `[${that.elTableData[Number(that.activeName)].label}]`);// 导出的表格名称，根据需要自己命名
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../assets/css/importfile.css'; 
    $mainColor:#FB505F;
    *{
        font-family: Microsoft YaHei;
    }
    .el-route-container{
        margin: 20px 15px 15px 15px;
        .el-route-header{
            margin-top: 10px;
            .el-route-tabs{
                width: 98%;
                margin-left: 10px;
            }
            .el-route-btns{
                position: absolute;
                right: 30px;
                z-index: 10;
                width: auto;
                .el-bind-btn{
                    background-color: $mainColor; 
                    color: #fff;
                    border-color: $mainColor;
                    position: relative;
                    width: 120px;
                    border-radius: 0px;
                    margin-right: 15px;
                    &:disabled{
                        opacity: 0.6;
                    }
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
                    &:nth-child(4){
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
            }
            .cond-list{
                width: 136px;
                height: 90px;
                position: absolute;
                border: 1px solid #ddd;
                background-color: #fff;
                right: 16.4%;
                top: 45px;
                z-index: 980;
                text-align: left;
                .item{
                    width: 100%;
                    height: 29px;
                    font-size: 14px;

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
        }
    }
    .el-dropbtn{
        position: relative;
        bottom: 2px;
        border: 1px solid $mainColor;
    }
    .file-sliver{
        width: 76px;
        height: 28px;
        background-color: transparent;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .tabName-input-content{
        background: #fff;
        height: 73px;
        width: 100%;
    }
</style>
<style>
.el-dialog__title{
    font-size: 16px !important;
}
</style>
