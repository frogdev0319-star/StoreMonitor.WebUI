<template>
    <el-row class="el-route-container">
        <el-col :span="24" class="el-route-header">
            <el-col :span="7" class="el-route-btns">
                <span class="bind-title">已绑定{{storeNum}}家门店</span>
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
                <!-- <a :href="downLoadSrc" :download='fileName' class="downLoad-btn"><i class='iconfont icon-xiazai' style="font-size:24px;"></i><span>下载</span></a> -->
                <el-dialog title='导入'
                :visible.sync="showImportContent" v-if="showImportContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #f31d65;"/>
                        <p style="margin-left:26px;margin-bottom:0px;">请选择导入文件的位置</p>
                        <div style="margin-left:20px;">
                            <el-radio-group v-model="checkValue" size="mini" style="margin-top:8px;" @change="changeValue">
                                <el-radio-button style="margin-left:10px;" class="radio-btn"
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
                <el-dialog title='提示'
                :visible.sync="showConfirmImport" v-if="showConfirmImport"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #f31d65;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                            <span>此操作将会清空当前页面已有巡检项，是否继续?</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showConfirmImport = false" size="mini" style="">取 消</el-button>
                        <el-button class="file-confirm-btn" @click="showImportContent=true;showConfirmImport=false" size="mini" type="primary">确 认</el-button>
                    </div>
                </el-dialog>
            </el-col>
            <el-col :span="18" class="el-route-tabs">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item,index) in elTableData" :key="index" :label="item.label" :closable="index!=0&&index!=1?true:false" >
                        <div v-if="item.routeData">
                            <route-detail :ref="curIndex" :route-data="item.routeData" :down-src="downLoadSrc"
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
import {inpectRESTful} from '@/api/index'
import {validateInput,validateInspectGroup} from '@/common/validate'
import {isLoginIn} from '@/api/login'
import {mapGetters} from 'vuex'
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
            downLoadSrc:'',
            curIndex:'id0',
            showBtnContent:false,
            storeNum:0,
            activeName:'',
            showImportContent:false,
            showConfirmImport:false,
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
            curData:[],
            loading:null,
            fileName:'店铺标准-巡检表示例',
        }
    },
    computed:{
        ...mapGetters({accountChanged:'accountChanged'})
    },
    watch:{
        accountChanged(val,oldVal){
            console.log(val);
            let self=this;
            if(val!=0){
                self.getTagList();
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if(from.name=='巡检项设置'){
                to.meta.keepAlive=false;
            }
            else{
                to.meta.keepAlive=false;
            }
        });
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
        downItem(){
            let self=this;
            inpectRESTful.downLoadTemplate().then(res=>{
                console.log(res);
                let blob = new Blob([res],{
                    type:'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型 
                });
                let objectUrl = URL.createObjectURL(blob);
                let url=objectUrl;
                self.downLoadSrc=url;
                var link = document.createElement('a');
                link.href=url;
                link.download=self.fileName;
                link.click();
            })
        },
        getDownLoadURL(){
            let self=this;
            inpectRESTful.downLoadTemplate().then(res=>{
                console.log(res);
                let blob = new Blob([res],{
                    type:'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型 
                });
                let objectUrl = URL.createObjectURL(blob);
                let url=objectUrl;
                self.downLoadSrc=url;

                window.open(self.downLoadSrc,'_self');
            })
        },
        getNapeList(){
            let self=this;
            return new Promise((resolve,reject)=>{
                inpectRESTful.getInspectItemList().then(res=>{
                    let code=res.errMsg;
                    let data=res.data;
                    if(code!=null&&code=='Success'){
                        self.allData=data;
                        //self.loading.close();
                        console.log(res.data);
                    }
                    resolve(data);
                }).catch(err => {
                    console.log(err.message);
                    //self.loading.close();
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
                                //objChild.score=itemChild.itemScore+'分';
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
        deleteItem(itemIdList){
            let params={
                itemIds:itemIdList
            };
            return new Promise((resolve,reject)=>{
                inpectRESTful.deleteInspectItem(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        deleteGroup(groupIdList){
            let params={
                groupIds:groupIdList
            };
            return new Promise((resolve,reject)=>{
                inpectRESTful.deleteInspectGroup(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        addGroup(params){
            return new Promise((resolve,reject)=>{
                inpectRESTful.addInspectGroup(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        addItem(params){
            return new Promise((resolve,reject)=>{
                inpectRESTful.addInspectItem(params).then(res=>{
                    console.log(res);
                    resolve(res);
                })
            })
        },
        async addAllData(dataArry){
            let self=this;
            let index=0;
            let mode=0;
            if(self.checkValue=='远程巡检'){
                index=0;
                mode=0;  //远程巡检 mode 0
            }
            else if(self.checkValue=='现场巡检'){ 
                index=1;
                mode=1;  //现场巡检  mode 1
            }
            else{
                index=2;
            }
            let data=self.elTableData[index];
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
            if(itemIdList.length!=0){
                let res1= await self.deleteItem(itemIdList);
            }
            if(groupIdList.length!=0){
                let res2= await self.deleteGroup(groupIdList);
            }
            let tempGroups=[];
            dataArry.forEach((item,index)=>{
                let obj={};
                obj.name=item[0]['检查分类'];
                obj.mode=mode;
                obj.tag=self.checkValue;
                tempGroups.push(obj);
            })
            let paramsGroup={
                "groups": tempGroups
            };
            let resGroup=await self.addGroup(paramsGroup);
            let codeGroup=resGroup.errMsg;
            let dataGroup=resGroup.data;
            if(codeGroup!=null&&codeGroup=='Success'){
                let tempItems=[];
                dataArry.forEach((item,index)=>{
                    let obj={};
                    let temp=[];
                    item.forEach((_item,_index)=>{
                        let _obj={};
                        _obj.subject=_item['检查项目名称'];
                        _obj.description=_item["检查项目详细说明（选填，不填为空）"];
                        _obj.itemScore=10;
                        temp.push(_obj);
                    })
                    obj.groupId=dataGroup[index];
                    obj.items=temp;
                    tempItems.push(obj);
                })
                let paramsItem={
                    "request": tempItems
                };
                let resItem=await self.addItem(paramsItem);
                let codeItem=resItem.errMsg;
                if(codeItem!=null&&codeItem=='Success'){
                    self.notify('模板导入成功!','success',3000);
                }
                else{
                    self.notify('模板导入失败!','warning',3000);
                }
            }
            else{
                self.notify('模板导入失败!','warning',3000);
            }
            self.showImportContent=false;
            self.getTagList();
        },
        handleItem(){
            this.showBtnContent=!this.showBtnContent;
        },

        async bindStore(){
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
            if(arr.length==0){
                self.notify('请新增巡检项后进行操作！','warning',3000);
                return false;
            }
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
        async importItem(){
            let self=this;
            let ret=await self.isLoginIn();
            console.log(ret);
            if(ret.data!=undefined&&ret.data.isLogin){
                if(self.elTableData[Number(self.activeName)].routeData.length!=0){
                    self.showConfirmImport=true;
                }
                else{
                    self.showImportContent=true;
                }
            }
            else{
                // self.$store.dispatch('LogOut').then(()=>{
                //     self.$router.push('/login');
                // })
                window.location.href='https://portals.storeviu.com';
            }
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
            inpectRESTful.getInspectBindList(params).then(res=>{
                console.log(res.data.errMsg);
                if(res.errMsg!=undefined&&res.errMsg=='Success'){
                    let data=res.data;
                    self.storeNum=data.length;
                }
            })
        },
        isLoginIn(){
            let self=this;
            return new Promise((resolve,reject)=>{
                isLoginIn().then(res=>{
                    console.log(res);
                    resolve(res);
                })
            }).catch(err=>{
                console.log(err);
            })
        },
        async exportItem(){
            let self=this;
            let ret=await self.isLoginIn();
            if(ret.data!=undefined&&ret.data.isLogin){
                self.export2Excel();
            }
            else{
                // self.$store.dispatch('LogOut').then(()=>{
                //     self.$router.push('/login');
                // })
                window.location.href='https://portals.storeviu.com';
            }
        },
        async importfxx(obj) {
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
                    if(!outdata[0].hasOwnProperty('检查分类')){
                        _this.notify('当前模板错误，请更换模板重新导入！','warning',3000);
                        return false;
                    }
                    let arr=outdata;
                    console.log(arr);
                    let indexArry=[];
                    let typeName=[];
                    let flaggroupLength=false,flaggroupRex=false;
                    let flagItemName=false,flagItemRex=false,flagItemLength=false;
                    arr.forEach((item,index)=>{
                        if(item['检查分类']!=undefined&&item["检查分类"].length!=0){
                            indexArry.push(index);
                            typeName.push(item['检查分类']);
                            if(item['检查分类'].toString().trim().length>10){
                                flaggroupLength=true;
                            }
                            if(validateInput(item['检查分类'])){
                                flaggroupRex=true;
                            }
                        }
                        if(item['检查项目名称']==undefined||item['检查项目名称'].length==0){
                            flagItemName=true;
                        }
                        else{
                            if(item['检查项目名称'].toString().trim().length>25){
                                flagItemLength=true;
                            }
                            if(validateInput(item['检查项目名称'])){
                                flagItemRex=true;
                            }
                        }
                    })

                    if(flaggroupLength){
                        _this.notify('excel中检查类别列中文本长度不能超过10个字，请检查！','warning',3000);
                        return false;
                    }
                    if(flaggroupRex){
                        _this.notify('excel中检查类别列中不能含有非法字符，请检查！','warning',3000);
                        return false;
                    }
                    if(flagItemName){
                        _this.notify('excel中检查项目名称列不能为空，请检查！','warning',3000);
                        return false;
                    }
                    if(flagItemLength){
                        _this.notify('excel中检查项目名称不能超过25个字，请检查！','warning',3000);
                        return false;
                    }
                    if(flagItemRex){
                        _this.notify('excel中检查项目名称中不能含有非法字符，请检查！','warning',3000);
                        return false;
                    }

                    let dataArry=[];
                    for(var i=0;i<indexArry.length;i++){
                        if(i<indexArry.length){
                            dataArry[i]=outdata.slice(indexArry[i],indexArry[i+1]);
                        }
                        else{
                            dataArry[i]=outdata.slice(indexArry[length-1],indexArry.length);
                        }
                    }
                    _this.addAllData(dataArry);
                    
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
                const tHeader = ['检查分类','检查项目名称','项目分值', "检查项目详细说明（选填，不填为空）",]; // 导出的表头名
                const filterVal = ['gourpname','napename','score','napedep',]; // 导出的表头字段名
                console.log(that.activeName);
                let curData=that.elTableData[Number(that.activeName)].routeData;
                let excelData=[];
                curData.forEach((item,index)=>{
                    if(item.itemData.length==0){
                        let obj={};
                        obj.gourpname=item.groupName;
                        obj.napename='';
                        obj.score='';
                        obj.napedep='';
                        excelData.push(obj);
                    }
                    else{
                        item.itemData.forEach((_item,_index)=>{
                            let obj={};
                            if(_index==0){
                                obj.gourpname=item.groupName;
                            }
                            else{
                                obj.gourpname='';
                            }
                            obj.napename=_item.name;
                            obj.score=_item.score;
                            obj.napedep=_item.description=='---'?'':_item.description;
                            excelData.push(obj);
                        })
                    }
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
<style>
@import '../../../assets/css/importfile.css'; 
</style>
<style lang="scss" scoped>
    $mainColor:#f31d65;
    *{
        font-family: Microsoft YaHei;
    }
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
    .dialog-content{
        width: 100%;
        span{
            font-size: 14px;
        }
        .radio-btn{
            margin-left: 20px;
            &:last-child{
                border-left: 1px solid #dcdfe6;
            }
        }
    }
    .el-route-container{
        margin: 20px 15px 15px 15px;
        .el-route-header{
            @include point(margin-top,10);
            .el-route-tabs{
                width: 98%;
                @include point(margin-left,10);
            }
            .el-route-btns{
                position: absolute;
                @include point(right,30);
                z-index: 10;
                width: auto;
                @include point(top,5);
                .bind-title{
                    @include point(margin-right,15);
                    color:#A2AEBC;
                    font-size: 12px;
                }
                .el-bind-btn{
                    background-color: $mainColor; 
                    color: #fff;
                    border-color: $mainColor;
                    position: relative;
                    border-radius: 0px;
                    @include point(margin-right,15);
                    font-size: 12px;
                    &:disabled{
                        opacity: 0.6;
                    }
                }
                .downLoad-btn{
                    margin-left: 0px !important;
                    border-color: $mainColor !important;
                    color: $mainColor !important;
                    border-radius: 0px;
                    padding: 2px 5px !important;
                    
                    position: relative;
                    top: 3px;
                    display: inline-block;
                    text-decoration: none;
                    font-size: 12px;
                    border: 1px solid;
                    border-left-width: 0px;
                    @include point(right,5);
                    cursor: pointer;
                    &:hover{
                        background-color: #FEE4E7;
                    }
                    &:focus{
                        background-color: #FEE4E7;
                    }
                    span{
                        position: relative;
                        bottom: 3px;
                    }
                }
                .el-handle-btn{
                    margin-left: 0px !important;
                    border-color: $mainColor !important;
                    color: $mainColor !important;
                    border-radius: 0px;
                    padding: 3px 5px !important;
                    position: relative;
                    top: 3px;
                    border-right: 0;
                    span{
                        position: relative;
                        @include point(bottom,3);
                    }
                    &:last-child{
                        border-right: 1px solid;
                    }

                    &:hover{
                        background-color: #FEE4E7;
                    }
                    &:focus{
                        background-color: #FEE4E7;
                    }
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
        @include point(width,76);
        @include point(height,28);
        background-color: transparent;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .tabName-input-content{
        background: #fff;
        @include point(height,73);
        width: 100%;
    }
</style>

