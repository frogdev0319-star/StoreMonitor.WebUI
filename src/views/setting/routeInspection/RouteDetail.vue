<template>
    <div class="detail-container" style="height:auto;" :style="{'min-height':varyWindowWidth*0.70+'px'}">
        <el-row>
            <el-col :span="24" class="detail-title">
               
                <span class="title-title" v-if="routeData.length!=0">{{tabName}}一共{{typeNum}}大类，{{itemNum}}个巡检项目</span>
                <div class="route-btns">
                     <el-button
                    class="el-delete-btn" 
                    @click="deleteNapes"
                    size="mini">
                        <i style="margin-right:8px;" class="iconfont icon-shanchu"></i>
                        <span>删除巡检项</span>
                    </el-button>
                     <el-button
                    class="el-set-btn" 
                    @click="setItem"
                    size="mini">
                        <i style="margin-right:8px;" class="iconfont icon-button"></i>
                        <span>巡检项设置</span>
                    </el-button>
                </div>
                <el-dialog title='确认删除'
                :visible.sync="showDeleteContent" v-if="showDeleteContent"
                :append-to-body='true'
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;">
                        <hr style="border: 0.5px solid #FB505F;"/>
                        
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                            <span>确认是否删除当前勾选巡检项?</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showDeleteContent = false" size="mini" style="">取 消</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDelete" size="mini" style="color:#fff">确 认</el-button>
                    </div>
                </el-dialog>

                <el-dialog title='确认删除'
                :visible.sync="showSingleDeleteContent" v-if="showSingleDeleteContent"
                :append-to-body='true'
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;">
                        <hr style="border: 0.5px solid #FB505F;"/>
                        
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                            <span>确认是否删除当前巡检项?</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showSingleDeleteContent = false" size="mini" style="">取 消</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDeleteSingle" size="mini" style="color:#fff">确 认</el-button>
                    </div>
                </el-dialog>

            </el-col>
            <el-col :span="24">
                <div v-for="(item,index) in routeData" :key="index" class="data-content" v-if="routeData.length!=0">
                    <div class="header-content" v-if="index==0">
                        <el-checkbox class="allcheckBox" @change="changeAllData" v-model="allchecked"></el-checkbox>
                        <span class="name-title">巡检名称</span>
                        <span class="description-title">巡检项要求描述</span>
                        <span class="score-title">项目分值</span>
                        <span class="handle-title">操作</span>
                    </div>
                   
                    <div style="float:left;margin-bottom:10px;margin-left:27px;">
                        <el-checkbox class="all-checkBox" @change="change(item)" v-model="item.checked"></el-checkbox>
                        <span class="table-title">{{item.groupName}}（{{item.itemCount}}）</span>
                    </div>
                     <div v-if="item.itemData.length!=0">
                        <el-table
                        :data="item.itemData"
                        size="medium"
                        :ref="item.refId"
                        :show-header="false">
                            <el-table-column prop="checked" min-width="6%" align="center">
                                <template slot-scope="scope">
                                    <span class="showNewContent" v-if="scope.row.isNew">new</span>
                                    <el-checkbox v-model="scope.row.checked" style="position:relative;bottom:1px;" @change="selectRow(index,item,scope.$index,scope.row)"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="巡检名称" min-width="30%"></el-table-column>
                            <el-table-column prop="description" label="巡检项需求描述" min-width='40%'></el-table-column>
                            <el-table-column prop="score" label="项目分值" min-width="10%"></el-table-column>
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
                        请先<span class="title-btn" @click="downLoadModel">下载巡检表模板</span>进行编辑，再点击<span @click="emptyImport">导入</span>按钮~
                    </p>
                </div>
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
// import Blob from 'blob.js'
import api from '@/api/index'
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
                // {
                //     'value':'3',
                //     'label':'新增巡检表'
                // }
            ],
            checkValue:'',
            tabNameInput:'',
            varyWindowWidth:window.innerHeight,
            allchecked:false,
            curDeleteId:''
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
    },
    methods:{
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
            console.log(item);
            item.itemData.forEach(_item=>{
                _item.checked=item.checked;
            })
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
            self.routeData.forEach(item=>{
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        arr.push(_item.id);
                    }
                });
            });
            console.log(arr);
            if(arr.length==0){
                self.notify('请勾选要删除的巡检项!','warning',3000);
                return false;
            }
            self.showDeleteContent=true;
        },
        confirmDelete(){
            let self=this;
            let arr=[];
            self.routeData.forEach(item=>{
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        arr.push(_item.id);
                    }
                });
            });
            let params={
                "itemIDs":arr
            };
            api.deleteInspectItem(params).then(res=>{
                console.log(res.data)
                let code=res.data.errMsg;
                if(code!=undefined&&code=='Success'){
                    self.notify('当前巡检项已删除成功!','success',3000);
                    self.showDeleteContent=false;
                    //self.refreshData();
                    self.$emit('refreshList');
                }
                else{
                    self.notify('当前巡检项删除失败!','warning',3000);
                    return false;
                }
            })
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
                "itemIDs":self.curDeleteId
            };
            api.deleteInspectItem(params).then(res=>{
                console.log(res.data)
                let code=res.data.errMsg;
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
                    let arr=outdata;
                    let indexArry=[];
                    let typeName=[];
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
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
    $mainColor:#FB505F;
    .detail-title{
        overflow: hidden;
        .title-title{
            display: block;
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
            margin-left: 0px;
            margin-bottom: 15px;
            float: left;
        }
        .route-btns{
            float: right;
            margin-right: 15px;
            .el-delete-btn{
                background-color: #fff; 
                border-color:  $mainColor;
                color: $mainColor;
                width: 120px;
                border-radius: 0px;
                margin-right:8px;
            }
            .el-set-btn{
                background-color: $mainColor; 
                border-color:  $mainColor;
                color: #fff;
                width: 120px;
                border-radius: 0px;
            }
        }
        .cond-list{
            width: 116px;
            height: 90px;
            position: absolute;
            border: 1px solid #ddd;
            background-color: #fff;
            right: 14px;
            top: 34px;
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
    .data-content{
        margin: 15px;
        margin-left: 0px;
        overflow: hidden;
        .header-content{
            width: 100%;
            margin-top:0px;
            margin-bottom: 10px;
            float: left;
            overflow: hidden;
            font-size: 14px;
            text-align: left;
            padding-left: 27px;
            padding-bottom: 10px;
            border-bottom:1px solid #e3e9f4;
            .allcheckBox{
                float: left;
            }
            .name-title{
                float: left;
                width: 16%;
                margin-left: 4%;
            }
            .description-title{
                float: left;
                width: 38%;
                margin-left: 15%;
            }
            .score-title{
                float: left;
                width: 8%;
                margin-left: 3%;
            }
            .handle-title{
                float: left;
                width: 6%;
                margin-left: 2%;
            }
        }
        .table-title{
            margin-left: 15px;
            font-weight: bold;
            font-size: 15px;
        }
    }
    .el-dropbtn1{
        position: relative;
        bottom: 2px;
        margin-left: 10px;
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
        }
        .export-btn{
            background-color: $mainColor;
            padding: 8px 25px;
            font-size: 14px;
            color: #fff;
        }
    }
    .tabName-input-content{
        background: #fff;
        height: 73px;
        width: 100%;
    }
</style>
<style>
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

.el-checkbox__inner:hover{
    border-color: #FB505F;
}
.el-checkbox.is-bordered.is-checked{border-color:#FB505F}
.el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #FB505F;
    border-color:#FB505F
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #FEE7E4;
    color: #000;
}
.current-row > td {
  background: #FEE7E4 !important;
}
.el-dialog{
    margin-left:85vh;
}
.el-dialog__body{
    padding: 0px;
}
.el-radio-button__inner{
    background-color: #E9ECF1;
    width: 86px;
    border-radius: 5px !important;
    border: 0px;
}
.el-radio-button__inner:hover{
    color: #FB505F;
}
.el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #FB505F;
    border: 0px;
    box-shadow:-1px 0 0 0 #FB505F;
    -webkit-box-shadow:-1px 0 0 0 #FB505F;
}
</style>

