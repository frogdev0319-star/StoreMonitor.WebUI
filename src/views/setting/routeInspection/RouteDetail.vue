<template>
    <div class="detail-container" style="height:auto;" :style="{'min-height':varyWindowWidth*0.70+'px'}">
        <el-row>
            <el-col :span="24" class="detail-title">
               
                <span class="title-title " v-if="routeData.length!=0">{{tabName}}共分{{typeNum}}大类，{{itemNum}}个巡检项目</span>
                <div class="route-btns">
                     <el-button
                    class="el-delete-btn" 
                    @click="deleteNapes"
                    size="mini" :disabled="routeData.length==0">
                        <i style="margin-right:8px;" class="iconfont icon-shanchu"></i>
                        <span>删除巡检项</span>
                    </el-button>
                     <el-button
                    class="el-set-btn" 
                    @click="setItem"
                    size="mini" :disabled="routeData.length==0">
                        <i style="margin-right:8px;" class="iconfont icon-button"></i>
                        <span>巡检项设置</span>
                    </el-button>
                </div>
                <el-dialog title='确认删除'
                :visible.sync="showDeleteContent" v-if="showDeleteContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #f31d65;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                            <span>确认是否删除当前勾选巡检项?</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showDeleteContent = false" size="mini">取 消</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDelete" size="mini" type="primary">确 认</el-button>
                    </div>
                </el-dialog>

                <el-dialog title='确认删除'
                :visible.sync="showSingleDeleteContent" v-if="showSingleDeleteContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #f31d65;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                            <span>确认是否删除当前巡检项?</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showSingleDeleteContent = false" size="mini" style="">取 消</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDeleteSingle" size="mini" type="primary">确 认</el-button>
                    </div>
                </el-dialog>

            </el-col>
            <el-col :span="24">
                <div v-for="(item,index) in routeData" :key="index" class="data-content" v-if="routeData.length!=0">
                    <div class="header-content tabTitle" v-if="index==0">
                        <el-checkbox class="allcheckBox" @change="changeAllData" v-model="allchecked"></el-checkbox>
                        <span class="name-title">巡检名称</span>
                        <span class="description-title">巡检项要求描述</span>
                        <span class="score-title">项目分值</span>
                        <span class="handle-title">操作</span>
                    </div>
                   
                    <div class="table-header-title">
                        <el-checkbox class="all-checkBox" @change="change(item)" v-model="item.checked"></el-checkbox>
                        <span class="table-title">{{item.groupName}}（{{item.itemCount}}）</span>
                    </div>
                     <div v-if="item.itemData.length!=0">
                        <el-table
                        :data="item.itemData"
                        size="medium"
                        :ref="item.refId"
                        :show-header="false">
                            <el-table-column prop="checked" width="70px" align="center">
                                <template slot-scope="scope">
                                    <span class="showNewContent" v-if="scope.row.isNew">new</span>
                                    <el-checkbox v-model="scope.row.checked" style="position:relative;bottom:1px;" @change="selectRow(index,item,scope.$index,scope.row)"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="巡检名称" width="300px"></el-table-column>
                            <el-table-column prop="description" label="巡检项需求描述" min-width='40%'></el-table-column>
                            <el-table-column prop="score" label="项目分值" min-width="8%"></el-table-column>
                            <el-table-column prop="handle" label="操作" min-width="10%">
                                <template slot-scope="scope">
                                        <i class="iconfont icon-shanchu" style="font-size: 20px;cursor:pointer;"  @click="handleDelete(scope.$index, scope.row)"></i>
                                    </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="data-empty" v-if="routeData.length==0">
                    <i class="iconfont icon-wenjian" style="font-size:100px;color:#E0E5F4"></i>
                    <p class="empty-title">
                        请先<a :href="downLoadSrc" :download='fileName' class="downLoad-btn">下载巡检表模板</a>进行编辑，再点击<span @click="emptyImport">导入</span>按钮~
                    </p>
                </div>
                <el-dialog title='导入'
                :visible.sync="showImportContent" v-if="showImportContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;">
                        <hr style="border: 0.5px solid #f31d65;"/>
                        <p style="margin-left:26px;margin-bottom:0px;">请选择导入文件的位置</p>
                        <div style="margin-left:20px;">
                            <el-radio-group v-model="checkValue" size="mini" style="margin-top:8px;" @change="changeValue">
                                <el-radio-button style="margin-left:10px;" class="elradio"
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
                            <!-- <div style="background-color:transparent" v-if="tabNameInput.length==0&&checkValue=='新增巡检表'"> -->
                                <input id="upload" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <!-- </div> -->
                        </a>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import api from '@/api/index'
import {inpectRESTful} from '@/api/index'
import {validateInput,validateInspectGroup} from '@/common/validate'
export default {
    name:'RouteDetail',
    props:{
        routeData:Array,
        tabName:String,
    },
    data(){
        return{
            typeNum:0,
            itemNum:0,
            napeData:[],
            showBtnContent:false,
            showDeleteContent:false,
            showSingleDeleteContent:false,
            multeSection:[],
            showImportContent:false,
            radioList:[
                {
                    'value':'1',
                    'label':'远程巡检'
                },
                {
                    'value':'2',
                    'label':'现场巡检'
                },
            ],
            checkValue:'',
            tabNameInput:'',
            varyWindowWidth:window.innerHeight,
            allchecked:false,
            curDeleteId:'',
            fileName:'',
        }
    },
    computed:{
    },
    watch:{
        routeData:{
            handler:function(val,oldval){
                if(val!=oldval){
                    this.getNum();
                }
            },
            deep:true//对象内部的属性监听，也叫深度监听
      },
    },
    mounted(){
        let self=this;
        self.getNum();
        self.getDownLoadURL();
    },
    methods:{
        getDownLoadURL(){
            let self=this;
            inpectRESTful.downLoadTemplate().then(res=>{
                console.log(res);
                let blob = new Blob([res],{
               type:'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型 
            });
                let objectUrl = URL.createObjectURL(blob);
                self.downLoadSrc=objectUrl;
                self.fileName='巡检表模板';
            })
        },
        getNum(){
            let self=this;
            if(self.tabName=='远程巡检'||self.tabName=='现场巡检'){
                self.checkValue=self.tabName;
            }
            else{
                self.checkValue='新增巡检表';
            }
            self.typeNum=self.routeData.length;
            //获取当前巡检项总数
            let allcount=0;
            self.routeData.forEach(item=>{
                allcount+=item.itemData.length;
            })
            self.itemNum=allcount;
        },
        changeAllData(val){
            console.log(val);
            let self=this;
            self.routeData.forEach(item=>{
                item.checked=val;
                item.itemData.forEach(_item=>{
                    _item.checked=val;
                })
            })
        },
        change(item){
            let self=this;
            let arr=[];
            console.log(item);
            item.itemData.forEach(_item=>{
                _item.checked=item.checked;
            })
            self.routeData.forEach(_item=>{
                if(_item.checked){
                    arr.push(_item);
                }
            })
            if(self.routeData.length==arr.length){
                self.allchecked=true;
            }
            else{
                self.allchecked=false;
            }
        },
        selectRow(tableIndex,item,index,row){
            let arr=[];
            let self=this;
            item.itemData.forEach(_item=>{
                if(_item.checked){
                    arr.push(_item);
                }
            });
            console.log(arr.length);
            if(item.itemData.length==arr.length){  //列表中的值全部勾选
                item.checked=true;    //最上方的全选为勾选状态
            }
            else{
                item.checked=false; 
            }
            let arrCheckedItem=[];
            let count=0;
            self.routeData.forEach(_item=>{
                count+=_item.itemData.length;
                _item.itemData.forEach(itemS=>{
                    if(itemS.checked){
                        
                        arrCheckedItem.push(itemS);
                    }
                })
            })
            if(count==arrCheckedItem.length){
                self.allchecked=true;
            }
            else{
                self.allchecked=false;
            }
        },
        getNapeList(){
            let self=this;
            return new Promise((resolve,reject)=>{
                inpectRESTful.getInspectItemList().then(res=>{
                    let code=res.errMsg;
                    let data=res.data;
                    if(code!=null&&code=='Success'){
                        self.allData=data;
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        async refreshData(){
            let self=this;
            console.log(self.tabName);
            let data=await self.getNapeList();
            if(data.length!=0){
                let temp=[];
                data.forEach(item=>{
                    if(item.tag==self.tabName){
                        let _obj={};
                        _obj.id=item.id;
                        _obj.groupName=item.name;
                        _obj.itemCount=item.items.length;
                        _obj.checked=false;
                        let tempChild=[];
                        item.items.forEach(itemChild=>{
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
                self.routeData=temp;
                self.getNum();
            }
        },
        
        deleteNapes(){
            let self=this;
            let arr=[];
            let countGroup=0;
            self.routeData.forEach(item=>{
                if(item.checked){
                    countGroup++;
                }
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        arr.push(_item.id);
                    }
                });
            });
            console.log(arr);
            if(arr.length==0&&countGroup==0){
                self.notify('请勾选要删除的巡检项类别或巡检项!','warning',3000);
                return false;
            }
            self.showDeleteContent=true;
        },
        afterDeleteNape(){
            let self=this;
            self.notify('当前巡检项已删除成功!','success',3000);
            self.showDeleteContent=false;
            self.$emit('refreshList');
        },
        confirmDelete(){
            let self=this;
            let arrGroup=[];
            let arrItem=[];
            self.routeData.forEach(item=>{
                if(item.checked){
                    arrGroup.push(item.id);
                }
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        arrItem.push(_item.id);
                    }
                });
            });
            let params={
                "itemIds":arrItem
            };
            let paramsGroup={
                "groupIds":arrGroup
            }
            if(arrItem.length!=0){
                inpectRESTful.deleteInspectItem(params).then(res=>{
                    console.log(res.data)
                    let code=res.errMsg;
                    if(code!=undefined&&code=='Success'){
                        if(arrGroup.length!=0){
                            inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup=>{
                                if(resGroup.errMsg=='Success'){
                                    self.afterDeleteNape();
                                }
                            })
                        }
                        else{
                            self.afterDeleteNape();
                        }
                    }
                    else{
                        self.notify('当前巡检项删除失败!','warning',3000);
                        return false;
                    }
                })
            }
            else{
                inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup=>{
                    if(resGroup.errMsg=='Success'){
                        self.afterDeleteNape();
                    }
                    else{
                        self.notify('当前巡检项删除失败!','warning',3000);
                        return false;
                    }
                })
            }
        },
        handleDelete(index,row){
            console.log(index);
            let self=this;
            self.showSingleDeleteContent=true;
            let id=row.id;
            let arr=[];
            arr.push(id);
            self.curDeleteId=arr;
        },
        confirmDeleteSingle(){
            let self=this;
            let params={
                "itemIds":self.curDeleteId
            };
            inpectRESTful.deleteInspectItem(params).then(res=>{
                console.log(res.data)
                let code=res.errMsg;
                if(code!=undefined&&code=='Success'){
                    self.notify('当前巡检项已删除成功!','success',3000);
                    self.showSingleDeleteContent=false;
                    self.$emit('refreshList');
                }
                else{
                    self.notify('当前巡检项删除失败!','warning',3000);
                    return false;
                }
            })
        },
        changeValue(value){

        },
        //巡检项设置
        setItem(){
            let self=this;
            sessionStorage.setItem('NapeItem',JSON.stringify(self.routeData));
            sessionStorage.setItem('GroupName',self.tabName);
            self.$router.push({name:"巡检项设置",params:{routeData:self.routeData}});
            console.log(self.routeData);
        },

        downLoadModel(){
            let self=this;
            let url='http://'+window.location.host+'/storemonitor/api/v1.0/inspect/template';
            console.log(url);
            window.open(url);
        },

        emptyImport(){
            this.showImportContent=true;
            
        },
        checkBeforeImport(){
            let self=this;
            if(self.checkValue=='新增巡检表'&&(self.tabNameInput==null||self.tabNameInput.trim().length==0)){
                self.notify('请输入自定义巡检表名称!','warning',3000);
                return false;
            }
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
                    let indexArry=[];
                    let typeName=[];
                    let flagItemName=false,flagItemRex=false,flagItemLength=false;
                    arr.forEach((item,index)=>{
                        if(item['检查分类']!=undefined&&item['检查分类'].length!=0){
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
                    inpectRESTful.addInspectGroup(params).then(res=>{
                        let code=res.errMsg;
                        let data=res.data;
                        if(code!=null&&code=='Success'){
                            console.log(res.data);
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
                                obj.groupId=data[index];
                                obj.items=temp;
                                tempItems.push(obj);
                            })
                            let params={
                                "request": tempItems
                            };
                            inpectRESTful.addInspectItem(params).then(res=>{
                                let code=res.errMsg;
                                let data=res.data;
                                if(code!=null&&code=='Success'){
                                    console.log(res.data);
                                    _this.notify('模板导入成功!','success',3000);
                                    _this.showImportContent=false;
                                    //_this.refreshData();
                                    _this.$emit('refreshList');
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
            if(rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
    },
}
</script>
<style>
@import '../../../assets/css/importfile.css'; 
</style>
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
@import '../../../assets/css/textstyle.css';
    $mainColor:#f31d65;
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
    .detail-title{
        overflow: hidden;
        .title-title{
            display: block;
            @include point(margin-top,10);
            margin-left: 0px;
            @include point(margin-bottom,15);
            float: left;
            font-size: 18px;
            font-weight: bold;
            color: #424151;
        }
        .route-btns{
            float: right;
            @include point(margin-right,15);
            .noAllow{
                cursor:not-allowed;
                opacity: 0.6;
            }
            .el-delete-btn{
                background-color: #fff; 
                border-color:  $mainColor;
                color: $mainColor;
                border-radius: 0px;
                @include point(margin-right,8);
                font-size: 12px;
                &:disabled{
                    opacity: 0.6;
                }
            }
            .el-set-btn{
                background-color: $mainColor; 
                border-color:  $mainColor;
                color: #fff;
                border-radius: 0px;
                font-size: 12px;
                &:disabled{
                    opacity: .6;
                }
            }
        }
    }
    .data-content{
        @include point(margin,15);
        margin-left: 0px;
        overflow: hidden;
        .header-content{
            width: 100%;
            margin-top:0px;
            @include point(margin-bottom,10);
            float: left;
            overflow: hidden;
            text-align: left;
            //@include point(padding-left,27);
            padding-left: 27px;
            @include point(padding-bottom,10);
            border-bottom:1px solid #e3e9f4;
            font-size: 14px;
            .allcheckBox{
                float: left;
                margin-right: 0;
            }
            .name-title{
                float: left;
                //width: 16%;
                width: 300px;
                // @include point(margin-left,40);
                margin-left: 40px;
            }
            .description-title{
                float: left;
                width: 38%;
                //margin-left: 12%;
            }
            .score-title{
                float: left;
                width: 8%;
                margin-left: 7%;
            }
            .handle-title{
                float: left;
                width: 4%;
                margin-left: 1%;
            }
        }
        .table-header-title{
            float:left;
            @include point(margin-bottom,10);
            // @include point(margin-left,27);
            margin-left: 27px;
            margin-right: 0;
            .all-checkBox{
                margin-right: 0;
            }
        }
        .table-title{
            @include point(margin-left,38);
            margin-left: 38px;
            font-size: 14px;
            font-weight: bold;
            color: #424151;
        }
    }
    .el-dropbtn1{
        position: relative;
        bottom: 2px;
        @include point(margin-left,10);
    }
    .showNewContent{
        position: absolute;
        display: inline-block;
        background-color: orange;
        top: 0px;
        left: 5px;
        color: #fff;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 12px;
        height: 12px;
        padding-top: 0px;
        line-height: 10px;
    }
    .elradio{
        &:last-child{
            border-left: 1px solid #dcdfe6;
        }
    }
    .data-empty{
        margin: 0 auto;
        margin-top: 14%;
        position: relative;
        .empty-title{
            font-weight: bold;
            span{
                color: $mainColor;
                cursor: pointer;
            }
            .downLoad-btn{
                color:  $mainColor;
                text-decoration: none;
            }
        }
    }
    .tabName-input-content{
        background: #fff;
        @include point(height,73);
        width: 100%;
    }
</style>
<style>
.el-tabs__active-bar{
        height: 4px !important;
        background-color: #f31d65 !important;
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #FEE7E4;
    color: #000;
}
.current-row > td {
  background: #FEE7E4 !important;
}
.el-dialog__body{
    padding: 0px;
}
.elradio .el-radio-button__inner{
    width: 86px;
    border-radius: 5px !important;
}
</style>

