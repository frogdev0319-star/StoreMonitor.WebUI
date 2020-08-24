<template>
    <div class="detail-container">
        <el-row>
            <el-col :span="24" class="detail-title">
                <div class="table-right-post" @click="setItem">
                    <!-- <span class="title-title " v-if="routeData.length!=0">{{routeName}} {{generateInsSettingLang('contains')}}{{typeNum}} {{generateInsSettingLang('group')}},
                        {{itemNum}} {{generateInsSettingLang('item')}}</span> -->
                    <i class="iconfont icon-quxiaolianjie"></i>
                    <span class="post-label">{{$t('insSettingView.relationDuty')}}:</span>
                    <span class="post-concent">{{ModelPost}}</span>
                </div>
                <div class="route-btns">
                     <el-button
                        :class=" lang=='en' ? 'en-el-delete-btn':'el-delete-btn'" class="btn-class"
                        @click="deleteNapes"
                        size="mini" :disabled="routeData.length==0">
                       <i class="iconfont icon-shanchu"></i>
                       <span>{{generateInsSettingLang('deleteItem')}}</span>
                    </el-button>
                     <el-button
                        :class="lang=='en'? 'en-el-set-btn':'el-set-btn'" class="btn-class"
                        @click="setItem"
                        type="primary"
                        size="mini" :disabled="routeData.length==0">
                        <i class="iconfont icon-button"></i>
                        <span>{{generateInsSettingLang('setItem')}}</span>
                    </el-button>
                </div>
                <el-dialog :title="generateInsSettingLang('confirmDelete')"
                :visible.sync="showDeleteContent" v-if="showDeleteContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                            <span style="display: inline-block; vertical-align: middle;">{{generateInsSettingLang('confirmSelecDel')}}</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showDeleteContent = false" size="mini">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDelete" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                    </div>
                </el-dialog>

                <el-dialog :title="generateInsSettingLang('confirmDelete')"
                :visible.sync="showSingleDeleteContent" v-if="showSingleDeleteContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                            <span style="display: inline-block; vertical-align: middle;" >{{generateInsSettingLang('confirmCurDel')}}</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showSingleDeleteContent = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDeleteSingle" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                    </div>
                </el-dialog>

            </el-col>
            <el-col :span="24">
                <div class="data-box">
                    <div class="sheet_title" v-for="item in sheetName" :key="item.id" @click="changeSheet(item.id)">
                        <p :style="item.isClick?'background-color: #f31b65;color:#fff;':''" class="item_title">{{item.label}}</p>
                    </div>
                </div>
                <el-scrollbar id="el-menuscrollbar">
                    <div v-if="routeData.length!=0" :style="{'max-height':varyWindowWidth*0.58+'px'}">
                        <div v-for="(item,index) in routeData" :key="index" class="data-content">
                            <div class="header-content tabTitle" v-if="index==0">
                                <el-checkbox class="allcheckBox" @change="changeAllData" v-model="allchecked"></el-checkbox>
                                <span class="name-title">{{generateInsSettingLang('inspectName')}}</span>
                                <span class="description-title">{{generateInsSettingLang('inspectionDescp')}}</span>
                                <span class="score-title" :style="sheetName[1].isClick?'width: calc((100% - 405px) * 2.5/29);':''" v-if="sheetName[0].isClick||sheetName[1].isClick">{{generateInsSettingLang('sheetscore0')}}</span>
                                <span class="score-title" style="width: calc((100% - 405px) * 6/29);" v-if="sheetName[1].isClick">{{generateInsSettingLang('sheetscore1')}}</span>
                                <span class="score-title" v-if="sheetName[2].isClick">{{generateInsSettingLang('sheetscore2')}}</span>
                                <span :class="lang=='en' ? 'en-handle-title':'handle-title'">{{generateInsSettingLang('operation')}}</span>
                            </div>

                            <div class="table-header-title">
                                <el-checkbox class="all-checkBox" @change="change(item)" v-model="item.checked"></el-checkbox>
                                <span class="table-title">{{item.groupName}}（{{item.itemCount}}）</span>
                            </div>
                            <div v-if="item.itemData.length!=0" class="table-class">
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
                                    <el-table-column prop="name" :label="generateInsSettingLang('inspectName')" width="300px"></el-table-column>
                                    <el-table-column prop="description" :label="generateInsSettingLang('inspectionDescp')" min-width='24%'></el-table-column>
                                    <el-table-column prop="score" :label="generateInsSettingLang('score')" align="center" :min-width="sheetName[1].isClick?'4%':'15%'"></el-table-column>
                                    <el-table-column prop="score" :label="generateInsSettingLang('score')" align="center" min-width="11%" v-if="sheetName[1].isClick"></el-table-column>
                                    <el-table-column prop="handle" :label="generateInsSettingLang('operation')" min-width="6%">
                                        <template slot-scope="scope">
                                                <i class="iconfont icon-shanchu" style="cursor:pointer;"  @click="handleDelete(scope.$index, scope.row)"></i>
                                            </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
                <!-- <div class="data-empty" v-if="routeData.length==0">
                    <i class="iconfont icon-wenjian" style="font-size:100px;color:#E0E5F4"></i>
                    <p class="empty-title">
                      {{generateInsSettingLang('please')}}<a :href="downSrc" :download='fileName' class="downLoad-btn">{{ generateInsSettingLang('downloadInfo')}}</a>
                      {{generateInsSettingLang('toEdit')}}
                      <span @click="emptyImport">{{generateInsSettingLang('thenImport')}}</span>
                      {{ generateInsSettingLang('waveline')}}
                    </p>
                      <input id="uploadFile" type="file"  ref="loadFile" style="display: none" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </div> -->
                <el-dialog :title="generateInsSettingLang('import')"
                :visible.sync="showImportContent" v-if="showImportContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:0px;">{{generateInsSettingLang('selectImprtLoc')}}</p>
                        <div style="margin-left:20px;">
                            <el-radio-group v-model="checkValue" size="mini" style="margin-top:8px;" @change="changeValue">
                                <el-radio-button style="margin-left:10px;" class="elradio"
                                v-for="(item,key) in radioList" :key="key"
                                :label="item.label"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="tabName-input-content">
                            <input type="text" v-model="tabNameInput" class="tabName-input" :placeholder="generateInsSettingLang('enterListName')"
                                   v-if="checkValue == addPatrol">
                        </div>

                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showImportContent = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>

                        <a href="javascript:;" class="a-upload" @click="checkBeforeImport">{{generateInsSettingLang('select')}}
                            <!-- <div style="background-color:transparent" v-if="tabNameInput.length==0&&checkValue=='新增巡检表'"> -->
                                <input id="upload" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <!-- </div> -->
                        </a>
                    </div>
                </el-dialog>
                <el-dialog :title="generateInsSettingLang('importFailTitle')"
                :visible.sync="showFailInfo" v-if="showFailInfo"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                            <i class="el-icon-warning" style="font-size:40px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                            <span style="display: inline-block; vertical-align: middle;font-size:14px;color:#182752;">{{generateInsSettingLang('FailTitle')}}</span>
                            <ul class="ul_style">
                                <li v-for="(item,index) in FileInfo" :key="index" class="li_style">
                                    <div class="list_style"></div>
                                    {{item}}
                                </li>
                            </ul>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showFailInfo = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="showFailInfo = false" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
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
import {generateInsSettingLang} from '@/api/i18n'
import filterString from '@/common/filterString'

export default {
    name:'RouteDetail',
    props:{
        routeData:Array,
        tabName:String,
        downSrc:String,
        routeName:String
    },
    data(){
        return{
            typeNum:0,
            itemNum:0,
            showBtnContent:false,
            showDeleteContent:false,
            showSingleDeleteContent:false,
            multeSection:[],
            showImportContent:false,
            showFailInfo:false,
            FileInfo:[],
            radioList:[
                {
                    'value':'1',
                    'label': '远程巡检'
                },
                {
                    'value':'2',
                    'label': '现场巡检'
                },
            ],
            checkValue:'',
            addPatrol: '自定义巡检表',
            tabNameLang: '',
            tabNameInput:'',
            varyWindowWidth:window.innerHeight,
            sheetName:[
                {id:0,isClick:true,label:this.$t('insSettingView.sheetpassfail')},
                {id:1,isClick:false,label:this.$t('insSettingView.sheetscore')},
                {id:2,isClick:false,label:this.$t('insSettingView.sheetother')}
            ],
            allchecked:false,
            curDeleteId:'',
            fileName: this.$t('insSettingView.patrolExample'),
            lang: this.$i18n.locale,
            delItems:[],
            delGroup:[],
            ModelPost:null
        }
    },
    computed:{
    },
    watch:{
        routeData:{
            handler:function(val,oldval){
                console.log('bval',val,oldval)
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
        // self.initLang();

    },
    methods:{
        generateInsSettingLang,
        // initLang(){
        //   let self = this;
        //   if(self.tabName=='远程巡检'){
        //      self.tabNameLang = self.$t('insSettingView.remotePatrol')
        //   }
        //   else if(self.tabName=='现场巡检'){
        //      self.tabNameLang = self.$t('insSettingView.onsitePatrol')
        //   }
        // },
        getNum(){
            let self=this;
            // if(self.tabName=='远程巡检'||self.tabName=='现场巡检'){
            //     self.checkValue=self.tabName;
            // }
            // else{
            //     self.checkValue='新增巡检表';
            // }
            self.typeNum=self.routeData.length;
            //获取当前巡检项总数
            let allcount=0;
            self.routeData.forEach(item=>{
                allcount+=item.itemData.length;
            })
            self.itemNum=allcount;
            self.ModelPost = self.routeData[0].ModelPost
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
        changeSheet(e){
            let self = this
            self.sheetName.forEach(item=>{
                if(item.id==e){
                    item.isClick = true
                }else{
                    item.isClick = false
                }
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
                            objChild.description=(itemChild.description==undefined||itemChild.length==0)?'--':itemChild.description;
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
            let countGroup=[];
            self.routeData.forEach(item=>{
                if(item.checked){
                    countGroup.push(item.id);
                }
                item.itemData.forEach(_item=>{
                    if(_item.checked){
                        arr.push(_item.id);
                    }
                });
            });
            // self.delGroup=countGroup
            // self.delItems=arr
            if(arr.length==0&&countGroup.length==0){
                self.notify(self.$t('insSettingView.selectItems'),'warning',3000);
                return false;
            }
            self.showDeleteContent=true;
        },
        afterDeleteNape(){
            let self=this;
            self.notify(self.$t('insSettingView.deleteSuss'),'success',3000);
            self.showDeleteContent=false;
            let val = 'del'
            self.$emit('refreshList',val)
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
                        self.notify(self.$t('insSettingView.deleteFail') ,'warning',3000);
                        return false;
                    }
                  self.allchecked = false;
                })
            }
            else{
                inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup=>{
                    if(resGroup.errMsg=='Success'){
                        self.afterDeleteNape();
                    }
                    else{
                        self.notify(self.$t('insSettingView.deleteFail') ,'warning',3000);
                        return false;
                    }
                  self.allchecked = false;
                })
            }
        },
        getDownLoadURL(){
            let self=this;
            inpectRESTful.downLoadTemplate().then(res=>{
                console.log(res);
                let blob = new Blob([res],{
               type:'application/vnd.ms-excel'      //将会被放入到blob中的数组内容的MIME类型
            });
                let objectUrl = URL.createObjectURL(blob);
                self.downLoadSrc=objectUrl;
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
                "itemIds":self.curDeleteId
            };
            inpectRESTful.deleteInspectItem(params).then(res=>{
                console.log(res.data)
                let code=res.errMsg;
                if(code!=undefined&&code=='Success'){
                    self.notify(self.$t('insSettingView.deleteSuss'),'success',3000);
                    self.showSingleDeleteContent=false;
                    // self.$emit('refreshList');
                    self.routeData.forEach((r_item,r_index)=>{
                        r_item.itemData.forEach((d_item,d_index)=>{
                            if(self.curDeleteId==d_item.id){
                                self.routeData[r_index].itemData.splice(d_index,1)
                                if(self.routeData[r_index].itemData.length==0){
                                    self.routeData.splice(r_index,1)
                                }
                            }
                        })
                    })
                    if(self.routeData.length==0){
                        // self.$emit('delItem')
                    }
                    self.getNum();
                }
                else{
                    self.notify(self.$t('insSettingView.deleteFail'),'warning',3000);
                    return false;
                }
                self.allchecked = false;
            })
        },
        changeValue(value){

        },
        //巡检项设置
        setItem(){
            let self=this;
            sessionStorage.setItem('NapeItem',JSON.stringify(self.routeData));
            sessionStorage.setItem('GroupName',self.tabName);
            self.$router.push({name:"itemSetting",params:{routeData:self.routeData, tabNameLang: self.tabNameLang,routeName:self.routeName}});
            console.log(self.routeData);
        },
        // bindPatrol(index,item){
        //     let self=this;
        //     self.$router.push({name:'itemSetting',params:{routeData:self.routeData, tabNameLang: self.tabNameLang,routeName:self.routeName}}); 
        // },
        downLoadModel(){
            let self=this;
            let url='http://'+window.location.host+'/storemonitor/api/v1.0/inspect/template';
            console.log(url);
            window.open(url);
        },

        emptyImport(){
            //this.showImportContent=true;
            let self = this;
            document.getElementById("uploadFile").click();
        },
        checkBeforeImport(){
            let self=this;
            if(self.checkValue==self.addPatrol &&(self.tabNameInput==null||self.tabNameInput.trim().length==0)){
                self.notify('请输入自定义巡检表名称!','warning',3000);
                return false;
            }
        },
      importfxx(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        _this.FileInfo=[]
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
              delete wb.Sheets[wb.SheetNames[0]].A1
              delete wb.Sheets[wb.SheetNames[0]].B1
              delete wb.Sheets[wb.SheetNames[0]].C1
              delete wb.Sheets[wb.SheetNames[0]].D1
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
            let arr=outdata;
            let indexArry=[];
            let typeName=[];
            let flaggroupLength=false,flaggroupRex=false;
            let flagItemName=false,flagItemRex=false,flagItemLength=false;
            let flagDescName = false, flagDesLength=false;
            arr.forEach((item,index)=>{
                let obj={}
                obj.a = item.__EMPTY
                obj.b = item.__EMPTY_1
                obj.c = item.__EMPTY_2
                obj.d = item.__EMPTY_3
                tempData.push(obj)
            })
            console.log(tempData)

            tempData.forEach((item,index)=>{
                if(item.a!=undefined&&item.a.length!=0){
                    indexArry.push(index);
                    typeName.push(item.a);
                    if(filterString.getContentLength(item.a.toString().trim()) > 30){
                        flaggroupLength=true;
                    }
                    if(validateInput(item.a)){
                        flaggroupRex=true;
                    }
                }
                if(item.b==undefined||item.b.length==0){
                    flagItemName=true;
                }
                else{
                    if(filterString.getContentLength(item.b.toString().trim()) > 100){
                        flagItemLength=true;
                    }
                    if(validateInput(item.b)){
                        flagItemRex=true;
                    }
                }
                if(item.d==undefined){
                flagDescName=true;
                }
                else{
                if(filterString.getContentLength(item.d.toString().trim()) > 300){
                    flagDesLength=true;
                }
                }
            })

            if(flaggroupLength||flaggroupRex||flagItemName||flagItemLength||flagItemRex||flagDesLength){
                _this.showFailInfo=true
                if(flaggroupLength){
                    _this.$refs.loadFile.value = ''
                    _this.$refs.loadFileEx.value = '';
                    _this.FileInfo.push(_this.$t('insSettingView.excelLongCategory'))
                }
                if(flaggroupRex||flagItemRex){
                    _this.$refs.loadFile.value = ''
                    _this.$refs.loadFileEx.value = '';
                    _this.FileInfo.push(_this.$t('insSettingView.excelIllegalCategory'))
                }
                if(flagItemName){
                    _this.$refs.loadFile.value = ''
                    _this.$refs.loadFileEx.value = '';
                    _this.FileInfo.push(_this.$t('insSettingView.excelEmpty'))
                }
                if(flagItemLength){
                    _this.$refs.loadFile.value = ''
                    _this.$refs.loadFileEx.value = '';
                    _this.FileInfo.push(_this.$t('insSettingView.excelLongItem'))
                }
                if(flagDesLength){
                    _this.$refs.loadFile.value = ''
                    _this.$refs.loadFileEx.value = '';
                    _this.FileInfo.push(_this.$t('insSettingView.excelIllegalDes'))
                }
                return false
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
            let tempGroups=[];
            dataArry.forEach((item,index)=>{
              let obj={};
              obj.name=item[0].a;
              //obj.mode=0;
              if(_this.tabName=='远程巡检'){
                obj.mode=0;
              }
              if(_this.tabName=='现场巡检'){
                obj.mode=1;
              }
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
                    _obj.subject=_item.b;
                    _obj.description=_item.d;
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
                    _this.$refs.loadFile.value = '';
                    _this.notify(_this.$t('insSettingView.importSuss'),'success',3000);
                    _this.showImportContent=false;
                    //_this.refreshData();
                    _this.$emit('refreshList');
                  }
                  else{
                    _this.$refs.loadFile.value = '';
                    _this.notify(_this.$t('insSettingView.importFail') ,'warning',3000);
                    return false;
                  }
                })
              }
              else{
                _this.$refs.loadFile.value = '';
                _this.notify(_this.$t('insSettingView.importFail'),'warning',3000);
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
    *{
      font-family:Roboto, Arial,  'Microsoft YaHei';
    }
    .iconfont{
      font-size: calc(24/1920*100vw);
    }
    .ul_style{
        background-color:#f7f8fb;
        border:1px solid #dfe2e9;
        border-radius:2px;
        min-height:150px;
        padding:20px 0 0 20px;
        .li_style{
            color:#7d8cad;
            margin-bottom:10px;
            list-style:none;
            .list_style{
                width:10px;
                height:10px;
                border-radius:50%;
                background-color:#dfe2e9;
                display:inline-block;
                margin-right:10px;
            }
        }
    }
    #el-menuscrollbar /deep/ .el-scrollbar__view{
        margin-top:65px;
    }
    .detail-title{
        overflow: hidden;
        .table-right-post{
            font-size: 14px;
            color:#94a4b4;
            text-align: left;
            float: left;
            line-height: 36px;
            font-weight: bold;
            cursor: pointer;
            .title-title{
                margin-left: 0px;
                margin-top: 15px;
                margin-bottom: 20px;
                font-size: calc(18/1920*100vw);
                font-weight: bold;
                color: #424151;
            }
            .iconfont{
                font-size: 14px;
                margin-right: 38px;
                margin-left: calc(27/1920*100vw);
            }
            .post-label{
                color:#f31b65;
                text-decoration: underline;
            }
            .post-concent{
                color:#404153;
            }
        }
        .route-btns{
            float: right;
            margin-right:calc(20/1920*100vw);
            display: flex;
            align-items: center;
            .noAllow{
                cursor:not-allowed;
                opacity: 0.6;
            }
            .el-delete-btn{
                //background-color: #fff;
                border-color:  $mainColor;
                color: $mainColor;
                border-radius: 0px;
                margin-right:calc(10/1920*100vw);
                font-size: 12px;
                &:disabled{
                    opacity: 0.5;
                }
            }
            .en-el-delete-btn{
              //background-color: #fff;
              border-color:  $mainColor;
              color: $mainColor;
              border-radius: 0px;
              margin-right:calc(10/1920*100vw);
              font-size: calc(14/1920*100vw);
              padding: 0 0;
              width: calc(130/1920*100vw);
              .icon-shanchu{
                font-size: calc(24/1920*100vw);
              }
              &:disabled{
                opacity: 0.5;
              }
            }
            .el-set-btn{
                //background-color: $mainColor;
                border-color:  $mainColor;
                color: #fff;
                border-radius: 0px;
                font-size: 12px;
                &:disabled{
                    opacity: .5;
                }
            }
            .en-el-set-btn{
              //background-color: $mainColor;
              border-color:  $mainColor;
              color: #fff;
              border-radius: 0px;
              font-size: calc(14/1920*100vw);
              height: calc(36/1920*100vw);
              padding: 0;
              width: calc(130/1920*100vw);
              &:disabled{
                opacity: .5;
              }
              span{
              }
              .iconfont{
              }
              @media screen and (min-width: 1440px) {
                  width: calc(130/1920*100vw);
              }
              @media screen and (max-width: 1440px) {
                  width: 125px;
              }
            }
            .btn-class{
              height: calc(36/1920*100vw);
              padding: 0;
              font-size: calc(14/1920*100vw);
              width: calc(130/1920*100vw);
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 28px;
              .iconfont{
                font-size: calc(16/1920*100vw);
                margin-right: cal(8/1920*100vw);
              }
              @media screen and (max-width: 1440px) {
                width: 100px;
              }
          }
        }
    }
    #el-menuscrollbar{
        height:100%;
        border:1px solid #e3e9f4;
        border-top: 0px;
        margin-bottom:10px;
        position: relative;
    }
    .data-box{
        background-color: #e9eff8;
        height:36px;
        border:1px solid #e3e9f4;
        border-bottom: 0px;
        margin-top:10px;
        padding-left:60px;
        .item_title{
            color:#404153;
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            width:120px;
            height:34px;
            line-height: 34px;
            border-radius:4px 4px 0 0;
            margin-right: 20px;
            cursor: pointer;
        }
        .sheet_title{
            float: left;
            margin-top: 2px;
        }
    }
    .data-content{
        margin: 20px calc(20/1920*100vw);
        margin-left: 0px;
        overflow: hidden;
        .header-content{
            width: 100%;
            margin:0px;
            float: left;
            overflow: hidden;
            text-align: left;
            padding: 15px 0 15px 27px;
            border-bottom:1px solid #e3e9f4;
            font-size: calc(14/1920*100vw);
            position: absolute;
            top:0;
            background-color: #fff;
            z-index: 100;
            .allcheckBox{
                float: left;
                margin-right: 0;
            }
            .name-title{
                float: left;
                width: 300px;
                margin-left: 40px;
            }

            .description-title{
                float: left;
                width: 50%;
                width: calc((100% - 405px) * 15.3/29);
            }
            .score-title{
                float: left;
                width: calc((100% - 405px) * 9/29);
                padding: 0 10px;
                text-align: center;
            }
            .handle-title{
                float: left;
                width: calc((100% - 405px) * 3/29);
                padding-left:calc(20/1920*100vw);
            }
            .en-handle-title{
              float: left;
              width: calc((100% - 405px) * 5/29);
            }
        }
        .table-header-title{
            float:left;
            width:80%;
            text-align: left;
            margin-bottom:calc(15/1920*100vw);
            margin-left: 27px;
            margin-right: 0;
            .all-checkBox{
                margin-right: 0;
            }
        }
      .table-class{
        .iconfont{
          font-size: calc(24/1920*100vw);
          color: #7d8cad;
        }
        .el-table{
          font-size: calc(14/1920*100vw);
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
                cursor: pointer;
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
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
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

