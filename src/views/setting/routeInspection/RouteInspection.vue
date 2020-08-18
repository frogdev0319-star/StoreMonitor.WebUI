<template>
    <el-row class="el-route-container">
        <el-col :span="24" class="el-route-header">
          <el-col :span="7" class="el-route-btns">
            <span :class="lang == 'en'? 'en-bind-title': 'bind-title'">{{generateInsSettingLang('bindWith')}}{{storeNum}} {{generateInsSettingLang('bindStore')}}</span>
            <el-button size="mini" @click="bindStore" :class="lang=='en'? 'en-el-bind-btn': 'el-bind-btn' " class="btn-class" :disabled="elTableData[Number(activeName)].data.length==0" type="primary">
              <div class="btn-area">
                <i class="iconfont icon-quxiaolianjie"></i>
                <span>{{generateInsSettingLang('bindList')}}</span>
              </div>
            </el-button>
            <input id="loadFileEx" type="file" ref="loadFileEx" style="display: none" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />

            <el-button v-for="(item,index) in btnList"
                :key="index" size="mini" @click="handleNape(index,item)" :class="lang=='en'? 'en-el-handle-btn': 'el-handle-btn' ">
                  <div class="btn-area">
                    <i :class="item.iconClass" :style="item.style"></i>
                    <span>{{item.btnTitle}}</span>
                  </div>
            </el-button>

            <el-dialog :title= "generateInsSettingLang('import')"
                :visible.sync="showImportContent" v-if="showImportContent"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:0px;">{{generateInsSettingLang('selectImprtLoc')}}</p>
                        <div style="margin-left:20px;">
                            <el-radio-group v-model="checkValue" size="mini" style="margin-top:8px;" @change="changeValue">
                                <el-radio-button style="margin-left:10px;" class="radio-btn"
                                v-for="(item,key) in radioList" :key="key"
                                :label="item.label"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="tabName-input-content">
                            <input type="text" v-model="tabNameInput" class="tabName-input" :placeholder="generateInsSettingLang('enterListName')"
                                   v-if="checkValue== this.addPatrol">
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showImportContent = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>

                        <a href="javascript:;" class="a-upload" @click="checkBeforeImport">{{generateInsSettingLang('select')}}
                            <!-- <div class="file-sliver"  v-if="hideUpload"> -->
                                <input  id="upload" type="file" @change="importfxx(this)" ref="loadFile"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <!-- </div> -->
                        </a>
                    </div>
                </el-dialog>
                <el-dialog :title="generateInsSettingLang('import')"
                :visible.sync="showNameImport" v-if="showNameImport"
                :append-to-body='true'
                :close-on-click-modal="false"
                @close="cancelImportName"
                width="510px"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <div class="nameinput" style="padding:30px 40px 10px 40px;height:60px;">
                            <el-input v-model="ImportName" @input="watchName" :placeholder="$t('insSettingView.enterListName')" style="border-bottom:1px solid #ddd;"></el-input>
                            <p v-if="isShowWarning" style="font-size:12px;color:red;margin:5px 0 0 0;">{{warningContent}}</p>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="cancelImportName" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="confirmImportName" size="mini" type="primary">{{generateInsSettingLang('select')}}</el-button>
                    </div>
                </el-dialog>
                <!-- <el-dialog :title="generateInsSettingLang('prompt')"
                :visible.sync="showConfirmImport" v-if="showConfirmImport"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                            <span style="display: inline-block; vertical-align: middle;">{{generateInsSettingLang('clearInfo')}}</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showConfirmImport = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="confirmImportFile" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                    </div>
                </el-dialog> -->
                <el-dialog :title="generateInsSettingLang('importFailTitle')"
                :visible.sync="showFailInfo" v-if="showFailInfo"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="510px"
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
                            <span style="display: inline-block; vertical-align: middle;" >{{generateInsSettingLang('confirmDelData')}}</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showSingleDeleteContent = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="confirmDelete" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="$t('remotePatrol.prompt')"
                :visible.sync="showNoPostDialog" v-if="showNoPostDialog"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="28%"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                            <span style="display: inline-block; vertical-align: middle;" >{{generateInsSettingLang('confirmToBindData')}}</span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showNoPostDialog = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="confirmToBind" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                    </div>
                </el-dialog>
            </el-col>
            <el-col :span="18" class="el-route-tabs">
                <el-tabs v-model="activeName" @tab-click="handleClick" id="en-patrltabs-content">
                    <el-tab-pane v-for="(item,index) in elTableData" :key="index" :label="index < 2 ? getLang(index):item.label" :name="index.toString()" :closable="index!=0&&index!=1?true:false" >
                        <el-tabs v-model="patrolActive" v-if="item.data.length!=0" @tab-click="handleClickPatrol" id="patrltabs-content">
                            <el-tab-pane v-for="(_item,_index) in item.data" :key="_index" :label="`${_item.name}`" :name="_index.toString()">
                                <div v-if="_item.routeData">
                                    <route-detail :ref="curIndex" :route-data="_item.routeData" :route-name="_item.name" :down-src="downLoadSrc"
                                    :tab-name="_item.name" @refreshList="getTagList"></route-detail>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                        <div class="data-empty" v-else :style="{'min-height':varyWindowWidth*0.52+'px'}">
                            <i class="iconfont icon-wenjian" style="font-size:100px;color:#E0E5F4"></i>
                            <p class="empty-title">
                            {{generateInsSettingLang('please')}}<a :href="downLoadSrc" :download='fileName' class="downLoad-btn">{{ generateInsSettingLang('downloadInfo')}}</a>
                            {{generateInsSettingLang('toEdit')}}
                            <span @click="showNameImport=true">{{generateInsSettingLang('thenImport')}}</span>
                            {{ generateInsSettingLang('waveline')}}
                            </p>
                            <input id="uploadFile" type="file"  ref="loadFile" style="display: none" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
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
import {inpectRESTful,titleRESTful} from '@/api/index'
import {validateInput,validateInspectGroup} from '@/common/validate'
import {isLoginIn} from '@/api/login'
import {mapGetters} from 'vuex'
import {generateInsSettingLang} from '@/api/i18n'
import filterString from '@/common/filterString'
import DialogVue from '@/components/DialogVue.vue'

export default {
    name:'RouteInspection',
    components:{
        RouteDetail,
        DialogVue
    },
    data(){
        return{
            //elTableData:[{label:'远程巡检',routeData:[]},{label:'现场巡检',routeData:[]}],
            elTableData:[{label:'远程巡检',data:[]},{label:'现场巡检',data:[]}],
            radioList:[
                {
                    'value':'1',
                    'label': '远程巡检'
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
            showNoPostDialog:false,
            varyWindowWidth:window.innerHeight,
            addPatrol: '新增巡检表',
            patrolActive:'0',
            PatrolListOne:'0',
            PatrolListTwo:'0',
            warningContent:'',
            isShowWarning:false,
            downLoadSrc:'',
            curIndex:'id0',
            showBtnContent:false,
            showSingleDeleteContent:false,
            storeNum:0,
            // BindStoreList:[],
            activeName:'',
            showImportContent:false,
            showConfirmImport:false,
            showNameImport:false,
            ImportName:'',
            showFailInfo:false,
            FileInfo:[],
            checkValue:'',
            tabNameInput:'',
            hideUpload:false,
            btnList:[
                {
                    id:0,
                    iconClass:'iconfont icon-daoru',
                    style:'font-size:24px;',
                    name:'import',
                    btnTitle: this.$t('insSettingView.import'),
                    enabled:true,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-daochu',
                    style:'font-size:24px;',
                    name:'export',
                    btnTitle: this.$t('insSettingView.export'),
                    enabled:true,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-xiazai',
                    style:'font-size:24px;',
                    name:'download',
                    btnTitle: this.$t('insSettingView.download'),
                    enabled:true,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-shanchu',
                    style:'font-size:17px;',
                    name:'delete',
                    btnTitle: this.$t('scheduleView.delete'),
                    enabled:true,
                }
            ],

            allData:[],
            tagList:['远程巡检', '现场巡检'],
            curData:[],
            loading:null,
            fileName:this.$t('insSettingView.patrolExample'),
            lang: this.$i18n.locale,
            taglangList: [this.$t('insSettingView.remotePatrol'), this.$t('insSettingView.onsitePatrol')]
        }
    },

    computed:{
        ...mapGetters({accountChanged:'accountChanged'}),
    },
    watch:{
        accountChanged(val,oldVal){
            console.log(val);
            let self=this;
            if(val!=0){
                sessionStorage.removeItem('TabPatrolIndex0')
                sessionStorage.removeItem('TabPatrolIndex1')
                self.getTagList('accountChanged');
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if(from.name=='itemSetting'){
                to.meta.keepAlive=false;
            }
            else{
                to.meta.keepAlive=false;
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        let self=this;
        if(to.name=='itemSetting'||to.name=='bindStore'){
            let historyObj = {
                activeName:self.activeName,
                patrolActive:self.patrolActive
            }
            self.$store.dispatch('setInspectHistory',historyObj);
            next();
        }
        else{
            self.$store.dispatch('setInspectHistory',null);
            sessionStorage.removeItem('TabPatrolIndex0')
            sessionStorage.removeItem('TabPatrolIndex1')
            next();
        }
    },
    mounted(){
        let self=this;
        let InspectHistory = self.$store.getters.InspectHistory;
        if(InspectHistory!=null){
            self.activeName = InspectHistory.activeName
            self.patrolActive = InspectHistory.patrolActive
        }
        self.getTagList();
        self.initData();
    },
    methods:{
        generateInsSettingLang,
        emptyImport(){
            let self = this;
            document.getElementById("uploadFile").click();
        },
        getLang(index){
          console.log(index)
          if(index === 0){
            return this.$t('insSettingView.remotePatrol')
          }
          else if(index === 1){
            return this.$t('insSettingView.onsitePatrol')
          }
          else{
            return ''
          }
        },
        initData(){
            let self=this;
            console.log(self.activeName + "activeName")
            switch(Number(self.activeName)){
                case 0: self.checkValue='远程巡检'; break;
                case 1: self.checkValue='现场巡检';break;
                default:self.checkValue='新增巡检表';break;
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
                //window.open(self.downLoadSrc,'_self');
            })
        },
        getTagAll(){//获取巡检表
            let self=this;
            let params={
                mode:parseInt(self.activeName)
            }
            return new Promise((resolve,reject)=>{
                inpectRESTful.GetInspectTagList(params).then(res=>{
                    let data=res.data;
                    resolve(data);
                }).catch(err => {
                    console.log(err.message);
                })

            })
        },
        getNapeList(params){//获取巡检表内容
            let self=this;
            return new Promise((resolve,reject)=>{
                inpectRESTful.getInspectItemList(params).then(res=>{
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
                })

            })
        },
        getInspectGroupBindAll(params){//获取巡检类别关联职务
            let self=this;
            return new Promise((resolve,reject)=>{
                inpectRESTful.GetInspectGroupBindList(params).then(res=>{
                    let data=res.data;
                    resolve(data);
                }).catch(err => {
                    console.log(err.message);
                })

            })
        },
        async getTagList(val){
            let self=this;
            let TagData=await self.getTagAll();
            if(TagData.length!=0){
                if(val=='del'){
                    if(Number(self.patrolActive)==TagData.length){
                        self.patrolActive=(TagData.length-1).toString()
                    }
                }
                if(val=='add'){
                    self.patrolActive=(TagData.length-1).toString()
                }
                if(val=='accountChanged'){
                    self.patrolActive = '0'
                }
                let params={
                    inspectId:TagData[Number(self.patrolActive)].id
                }
                let NapeData=await self.getNapeList(params)
                let tempAllData=[];
                    let obj={};
                    let temp=[];
                    let groupids=[]
                    NapeData.forEach((_item,_index)=>{
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
                                objChild.description=(itemChild.description==undefined||itemChild.length==0)?'--':itemChild.description;
                                if(self.lang == 'en'){
                                objChild.score=itemChild.itemScore ;
                                }
                                else{
                                objChild.score=itemChild.itemScore + " " + self.$t('insSettingView.scores');
                                }

                                tempChild.push(objChild);
                            })
                            _obj.itemData=tempChild;
                            _obj.inspectId=TagData[Number(self.patrolActive)].id; //巡检表
                            _obj.mode=TagData[Number(self.patrolActive)].mode; //巡检类别
                            groupids.push(_item.id)
                            temp.push(_obj);
                    })
                    let postparams={
                        groupIds:groupids
                    }
                    let titletemp=await self.getInspectGroupBindAll(postparams)
                    let titleList=await self.getUserTitleList()
                    // let usertext=[]
                    // titletemp[0].userTitles.forEach(u_item=>{
                    //     usertext.push(u_item.titleName)
                    // })
                    // temp.push({ModelPost:usertext.toString()})//关联职务
                    temp.forEach(te_item=>{
                        let usertext=[]
                        titletemp.forEach(ti_item=>{
                            if(te_item.id==ti_item.groupId){
                                if(ti_item.userTitles.length!=0){
                                    if(ti_item.userTitles.length==titleList.data.length){
                                        te_item['ModelPost']=self.$t('reportView.all')
                                    }else{
                                        ti_item.userTitles.forEach(u_item=>{
                                            usertext.push(u_item.titleName)
                                            te_item['ModelPost']=usertext.toString()//关联职务
                                        })
                                    }
                                }else{
                                    te_item['ModelPost']=null
                                }
                            }
                        })
                    })
                    let tagTemp=[]
                    TagData.forEach((tag_item,tag_index)=>{
                        let tagObj={};
                        let label=''
                        if(tag_item.mode==0){
                            label='远程巡检'
                        }else if(tag_item.mode==1){
                            label='现场巡检'
                        }
                        tagObj.label=label
                        tagObj.name=tag_item.name
                        tagObj.routeData=temp
                        tagTemp.push(tagObj)
                    })
                    if(self.activeName==0){
                        // let tagTemp={label:item,name:self.ImportName,routeData:temp};
                        if(temp.length == 0){
                          self.getDownLoadURL();
                        }
                        self.elTableData[0].data=tagTemp;
                    }
                    else if(self.activeName==1){
                        // let obj={label:item,name:self.ImportName,routeData:temp};
                        if(temp.length == 0){
                          self.getDownLoadURL();
                        }
                        self.elTableData[1].data=tagTemp;
                    }
                    else{
                        obj.label=item;
                        obj.data={name:'',routeData:temp};
                        // tempAllData.push(obj);
                    }
                // })
                self.elTableData=self.elTableData.concat(tempAllData);
            }
            else{
              self.getDownLoadURL();
              self.elTableData=[{label:'远程巡检',data:[]},{label:'现场巡检',data:[]}];
            }
            self.getBindStoreList();
        },
        getUserTitleList(){
          return new Promise((resolve, reject) => {
            titleRESTful.getUserTitleList().then(res=>{
              resolve(res)
            })
          })
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
            debugger
            let index=0;
            let mode=0;
            if(self.activeName=='0'){
                index=0;
                mode=0;  //远程巡检 mode 0
            }
            else if(self.activeName=='1'){
                index=1;
                mode=1;  //现场巡检  mode 1
            }
            else{
                index=2;
            }
            // let tempGroups=[];
            // dataArry.forEach((item,index)=>{
            //     let obj={};
            //     obj.name=item[0].a;
            //     obj.mode=mode;
            //     obj.tag=self.ImportName;
            //     tempGroups.push(obj);
            // })
            // let paramsGroup={
            //     "groups": tempGroups
            // };
            // let resGroup=await self.addGroup(paramsGroup);
            // let codeGroup=resGroup.errMsg;
            // let dataGroup=resGroup.data;
            // if(codeGroup!=null&&codeGroup=='Success'){
            //     let tempItems=[];
            //     dataArry.forEach((item,index)=>{
            //         let obj={};
            //         let temp=[];
            //         item.forEach((_item,_index)=>{
            //             let _obj={};
            //             _obj.subject=_item.b;
            //             _obj.description=_item.d;
            //             _obj.itemScore=10;
            //             temp.push(_obj);
            //         })
            //         obj.groupId=dataGroup[index];
            //         obj.items=temp;
            //         tempItems.push(obj);
            //     })
            //     let paramsItem={
            //         "request": tempItems
            //     };
            //     let resItem=await self.addItem(paramsItem);
            //     let codeItem=resItem.errMsg;
            //     if(codeItem!=null&&codeItem=='Success'){
            //         self.notify(self.$t('insSettingView.importSuss'),'success',3000);
            //         self.showNameImport=false
            //     }
            //     else{
            //         self.notify(self.$t('insSettingView.importFail'),'warning',3000);
            //     }
            // }
            // else{
            //     self.notify(self.$t('insSettingView.importFail'),'warning',3000);
            // }
            // self.showImportContent=false;
            // self.getTagList('add');
        },
        handleItem(){
            this.showBtnContent=!this.showBtnContent;
        },

        bindStore(){
            let self=this;
            let routeData=self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData
            self.showNoPostDialog = routeData[0].ModelPost==null ? true : false
            if(!self.showNoPostDialog){
                self.confirmToBind()
            }
        },
        confirmToBind(){
            let self=this;
            let arr=[];
            if(self.elTableData[Number(self.activeName)].data.length==0){
                self.notify(self.$t('insSettingView.emptyInfo'),'warning',3000);
                return false;
            }
            self.elTableData[Number(self.activeName)].data.forEach(item=>{
                item.routeData.forEach(r_item=>{
                    r_item.itemData.forEach(_item=>{
                        arr.push(_item.id);
                    });
                })
            });
            console.log(arr);
            if(arr.length==0){
                //self.notify('请新增巡检项后进行操作！','warning',3000);
                self.notify(self.$t('insSettingView.emptyInfo'),'warning',3000);
                return false;
            }
            sessionStorage.setItem('TabName',self.activeName);
            sessionStorage.setItem('NapeId',JSON.stringify(arr));
            self.$router.push({name:'bindStore',params:{inspectId:self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData[0].inspectId}});

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
    //   confirmImportFile(){
    //       let self = this;
    //       self.showConfirmImport=false;
    //       document.getElementById('loadFile').click()
    //   },
    cancelImportName(){
        let self = this;
        self.isShowWarning = false
        self.showNameImport = false
    },
      async confirmImportName(){
          let self = this;
          if(self.ImportName!=''){
              //限制巡检表名称不可重复、不可为空、不可超过30字符
              let TagData=await self.getTagAll();
              let namerepeat=0
              TagData.forEach(item=>{
                  if(item.name==self.ImportName){
                      namerepeat=1
                  }
              })
              if(namerepeat==1){
                    self.isShowWarning = true
                    self.warningContent = self.$t('remotePatrol.Patroltips2')
                }else{
                    self.isShowWarning = false
                    document.getElementById('loadFileEx').click()
                }
          }else{
              self.isShowWarning = true
              self.warningContent = self.$t('insSettingView.enterListName')
          }
      },
      watchName(val){
            let self = this;
            let content = filterString.all(val,30);
            let length = filterString.getContentLength(val);
            self.ImportName =val.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "")
            self.ImportName = content;
            if(length>30){
                self.isShowWarning = true
                self.warningContent = self.$t('insSettingView.enterNameRuletip')
            }else{
                self.isShowWarning = false
            }
      },
        handleClick(tabObj){
            // console.log(tabObj);
            let self=this;
            // sessionStorage.setItem('TabIndex',tabObj.index);
            // sessionStorage.setItem('TabName',self.activeName);
            // self.getBindStoreList();
            switch(tabObj.index){
                case '0':
                self.checkValue='远程巡检';break;
                case '1':
                self.checkValue='现场巡检';break;
                default:
                self.checkValue='新增巡检表';break;
            }
            if(tabObj.index=='0'){
                let idx0 = sessionStorage.getItem('TabPatrolIndex0')
                if(idx0!=null&&idx0!='0'){
                    if(Number(idx0)==self.elTableData[Number(self.activeName)].data.length){
                        self.patrolActive = (Number(idx0)-1).toString()
                    }else{
                        self.patrolActive = idx0
                    }
                }else{
                    self.patrolActive = '0'
                }
            }else if(tabObj.index=='1'){
                let idx1 = sessionStorage.getItem('TabPatrolIndex1')
                if(idx1!=null&&idx1!='0'){
                    if(Number(idx1)==self.elTableData[Number(self.activeName)].data.length){
                        self.patrolActive = (Number(idx1)-1).toString()
                    }else{
                        self.patrolActive = idx1
                    }
                }else{
                    self.patrolActive = '0'
                }
            }
            self.getTagList();

        },
        handleClickPatrol(val){
            let self = this;
            if(self.activeName=='0'){
                sessionStorage.setItem('TabPatrolIndex0',val.index);
            }else if(self.activeName=='1'){
                sessionStorage.setItem('TabPatrolIndex1',val.index);
            }
            self.getTagList();
        },
        delAllItem(){
            let datalength = this.elTableData[Number(this.activeName)].data.length
            if(datalength==0){
                this.notify(this.$t('insSettingView.deletePatrolList'),'warning',3000);
                return false;
            }else{
                this.showSingleDeleteContent=true
            }
        },
        confirmDelete(){
            let self=this;
            let arrGroup=[];
            let arrItem=[];
            self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData.forEach(item=>{
                arrGroup.push(item.id);
                item.itemData.forEach(_item=>{
                    arrItem.push(_item.id);
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
                    let code=res.errMsg;
                    if(code!=undefined&&code=='Success'){
                        if(arrGroup.length!=0){
                            inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup=>{
                                if(resGroup.errMsg=='Success'){
                                    self.afterDeleteList();
                                }
                            })
                        }
                        else{
                            self.afterDeleteList();
                        }
                    }
                    else{
                        self.notify(self.$t('insSettingView.deleteInspectFail') ,'warning',3000);
                        return false;
                    }
                })
            }
            else{
                inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup=>{
                    if(resGroup.errMsg=='Success'){
                        self.afterDeleteList();
                    }
                    else{
                        self.notify(self.$t('insSettingView.deleteInspectFail') ,'warning',3000);
                        return false;
                    }
                })
            }
        },
        afterDeleteList(){
            let self=this;
            self.notify(self.$t('insSettingView.deleteInspectSuss'),'success',3000);
            self.showSingleDeleteContent=false;
            self.getTagList('del')
        },
         importItem(){
            let self=this;
            let ret= self.isLoginIn();
            console.log(ret);
            let Datalength = self.elTableData[Number(self.activeName)].data.length
            if(Number(self.activeName)==0&&Datalength==10){
                    self.notify(self.$t('insSettingView.RemoteLength'),'warning',3000);
                    return false;
            }else if(Number(self.activeName)==1&&Datalength==10){
                    self.notify(self.$t('insSettingView.OnsiteLength'),'warning',3000);
                    return false;
            }else{
                    self.showNameImport=true
                    self.ImportName=''
            }
            // if(ret.data!=undefined&&ret.data.isLogin){
            //     if(self.elTableData[Number(self.activeName)].routeData.length!=0){
            //         self.showConfirmImport=true;
            //     }
            //     else{
            //         //self.showImportContent=true;
            //       document.getElementById('loadFile').click();
            //     }
            // }
            // else{
            //     // self.$store.dispatch('LogOut').then(()=>{
            //     //     self.$router.push('/login');
            //     // })
            //     window.location.href='https://portals.storeviu.com';
            // }
        },
        checkBeforeImport(){
            let self=this;
            if(self.checkValue=='新增巡检表'&&(self.tabNameInput==null||self.tabNameInput.trim().length==0)){
                self.hideUpload=true;
                self.notify(self.$t('insSettingView.enterSelfListName'),'warning',3000);
                return false;
            }

            else{
                self.hideUpload=false;
            }
        },
        getBindStoreList(){
            let self=this;
            if(self.elTableData[Number(self.activeName)].data.length!=0){
                let inspectId =self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData[0].inspectId;
                let params={inspectId :inspectId };
                inpectRESTful.getInspectBindList(params).then(res=>{
                    if(res.errMsg!=undefined&&res.errMsg=='Success'){
                        let data=res.data;
                        self.storeNum=data.length;
                    }
                })
            }else{
                self.storeNum=0
            }
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
                var outdata = {};
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
                    // 动态解析表头
                    var sheet1,sheet2,sheet3
                    let PassFail = wb.Sheets['Pass&Fail']
                    let Score = wb.Sheets['Score']
                    let Others = wb.Sheets['Others']
                    let temp_sheet1 = [],temp_sheet2 = [],temp_sheet3 = []
                    if(PassFail!=undefined){
                        delete PassFail.A1;delete PassFail.B1;delete PassFail.C1;delete PassFail.D1
                        sheet1 = XLSX.utils.sheet_to_json(wb.Sheets['Pass&Fail']);
                        sheet1.forEach((_item,_index)=>{
                            let obj={}
                            obj.a = _item.__EMPTY
                            obj.b = _item.__EMPTY_1
                            obj.c = _item.__EMPTY_2
                            obj.d = _item.__EMPTY_3
                            temp_sheet1.push(obj)
                        })
                        outdata.PassFail=temp_sheet1
                    }
                    if(Score!=undefined){
                        delete Score.A1;delete Score.B1;delete Score.C1;delete Score.D1;delete Score.E1
                        sheet2 = XLSX.utils.sheet_to_json(wb.Sheets['Score']);
                        sheet2.forEach((_item,_index)=>{
                            let obj={}
                            obj.a = _item.__EMPTY
                            obj.b = _item.__EMPTY_1
                            obj.c = _item.__EMPTY_2
                            obj.d = _item.__EMPTY_3
                            obj.e = _item.__EMPTY_4
                            temp_sheet2.push(obj)
                        })
                        outdata.Score=temp_sheet2
                    }
                    if(Others!=undefined){
                        delete Others.A1;delete Others.B1;delete Others.C1;delete Others.D1
                        sheet3 = XLSX.utils.sheet_to_json(wb.Sheets['Others']);
                        sheet3.forEach((_item,_index)=>{
                            let obj={}
                            obj.a = _item.__EMPTY
                            obj.b = _item.__EMPTY_1
                            obj.c = _item.__EMPTY_2
                            obj.d = _item.__EMPTY_3
                            temp_sheet3.push(obj)
                        })
                        outdata.Others=temp_sheet3
                    }

                    let indexArryPassFail=[],indexArryScore=[],indexArryOthers=[]
                    let flaggroupLengthPassFail=false,flaggroupLengthScore=false,flaggroupLengthOthers=false
                    let flaggroupRexPassFail=false,flaggroupRexScore=false,flaggroupRexOthers=false
                    let flagItemNamePassFail=false,flagItemNameScore=false,flagItemNameOthers=false
                    let flagItemRexPassFail=false,flagItemRexScore=false,flagItemRexOthers=false
                    let flagItemLengthPassFail=false,flagItemLengthScore=false,flagItemLengthOthers=false
                    let flagDescNamePassFail = false,flagDescNameScore = false,flagDescNameOthers = false
                    let flagDesLengthPassFail=false,flagDesLengthScore=false,flagDesLengthOthers=false;
                    //sheet整合好的巡检表:outdata
                    if(outdata.PassFail==undefined&&outdata.Score==undefined&&outdata.Others!=undefined){
                        _this.notify(_this.$t('insSettingView.OnlyOthers'),'warning',3000);
                        return false;
                    }
                    let arr = Object.entries(outdata)
                    for(let i=0;i<arr.length;i++){
                        arr[i][1].forEach((item,index)=>{
                            if(arr[i][0]=='PassFail'){
                                    if(item.a!=undefined&&item.a.length!=0){
                                        indexArryPassFail.push(index);
                                        if(filterString.getContentLength(item.a.toString().trim()) > 30){flaggroupLengthPassFail=true;}
                                        if(validateInput(item.a)){flaggroupRexPassFail=true;}
                                    }
                                    if(item.b==undefined||item.b.length==0){flagItemNamePassFail=true;}
                                    else{if(filterString.getContentLength(item.b.toString().trim()) > 100){flagItemLengthPassFail=true;}
                                        if(validateInput(item.b)){flagItemRexPassFail=true;}
                                    }
                                    if(item.d==undefined){ flagDescNamePassFail=true;}
                                    else{if(filterString.getContentLength(item.d.toString().trim()) > 300){flagDesLengthPassFail=true;}}
                            }else if(arr[i][0]=='Score'){
                                    if(item.a!=undefined&&item.a.length!=0){
                                        indexArryScore.push(index);
                                        if(filterString.getContentLength(item.a.toString().trim()) > 30){flaggroupLengthScore=true;}
                                        if(validateInput(item.a)){flaggroupRexScore=true;}
                                    }
                                    if(item.b==undefined||item.b.length==0){flagItemNameScore=true;}
                                    else{if(filterString.getContentLength(item.b.toString().trim()) > 100){flagItemLengthScore=true;}
                                        if(validateInput(item.b)){flagItemRexScore=true;}
                                    }
                                    if(item.e==undefined){ flagDescNameScore=true;}
                                    else{if(filterString.getContentLength(item.e.toString().trim()) > 300){flagDesLengthScore=true;}}
                            }else if(arr[i][0]=='Others'){
                                    if(item.a!=undefined&&item.a.length!=0){
                                        indexArryOthers.push(index);
                                        if(filterString.getContentLength(item.a.toString().trim()) > 30){flaggroupLengthOthers=true;}
                                        if(validateInput(item.a)){flaggroupRexOthers=true;}
                                    }
                                    if(item.b==undefined||item.b.length==0){flagItemNameOthers=true;}
                                    else{if(filterString.getContentLength(item.b.toString().trim()) > 100){flagItemLengthOthers=true;}
                                        if(validateInput(item.b)){flagItemRexOthers=true;}
                                    }
                                    if(item.d==undefined){ flagDescNameOthers=true;}
                                    else{if(filterString.getContentLength(item.d.toString().trim()) > 300){flagDesLengthOthers=true;}}
                            }
                        })
                    }
                    let showWarningIfo = flaggroupLengthPassFail||flaggroupRexPassFail||flagItemNamePassFail||flagItemLengthPassFail||flagItemRexPassFail||flagDesLengthPassFail||
                                         flaggroupLengthScore||flaggroupRexScore||flagItemNameScore||flagItemLengthScore||flagItemRexScore||flagDesLengthScore||
                                         flaggroupLengthOthers||flaggroupRexOthers||flagItemNameOthers||flagItemLengthOthers||flagItemRexOthers||flagDesLengthOthers
                    if(showWarningIfo){
                        _this.showFailInfo=true
                        _this.$refs.loadFile.value = ''
                        _this.$refs.loadFileEx.value = '';
                        if(flaggroupLengthPassFail||flaggroupLengthScore||flaggroupLengthOthers){
                            let flagArr = []
                            if(flaggroupLengthPassFail){flagArr.push('PassFail')}
                            if(flaggroupLengthScore){flagArr.push('Score')}
                            if(flaggroupLengthOthers){flagArr.push('Others')}
                            let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelLongCategory')
                            _this.FileInfo.push(flag)
                        }
                        if(flaggroupRexPassFail||flagItemRexPassFail||flaggroupRexScore||flagItemRexScore||flaggroupRexOthers||flagItemRexOthers){
                            let flagArr = []
                            if(flaggroupRexPassFail||flagItemRexPassFail){flagArr.push('PassFail')}
                            if(flaggroupRexScore||flagItemRexScore){flagArr.push('Score')}
                            if(flaggroupRexOthers||flagItemRexOthers){flagArr.push('Others')}
                            let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelIllegalCategory')
                            _this.FileInfo.push(flag)
                        }
                        if(flagItemNamePassFail||flagItemNameScore||flagItemNameOthers){
                            let flagArr = []
                            if(flagItemNamePassFail){flagArr.push('PassFail')}
                            if(flagItemNameScore){flagArr.push('Score')}
                            if(flagItemNameOthers){flagArr.push('Others')}
                            let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelEmpty')
                            _this.FileInfo.push(flag)
                        }
                        if(flagItemLengthPassFail||flagItemLengthScore||flagItemLengthOthers){
                            let flagArr = []
                            if(flagItemLengthPassFail){flagArr.push('PassFail')}
                            if(flagItemLengthScore){flagArr.push('Score')}
                            if(flagItemLengthOthers){flagArr.push('Others')}
                            let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelLongItem')
                            _this.FileInfo.push(flag)
                        }
                        if(flagDesLengthPassFail||flagDesLengthScore||flagDesLengthOthers){
                            let flagArr = []
                            if(flagDesLengthPassFail){flagArr.push('PassFail')}
                            if(flagDesLengthScore){flagArr.push('Score')}
                            if(flagDesLengthOthers){flagArr.push('Others')}
                            let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelIllegalDes')
                            _this.FileInfo.push(flag)
                        }
                        return false
                    }
                    let arrsheet1=[];
                    if(indexArryPassFail.length!=0){
                        for(var i=0;i<indexArryPassFail.length;i++){
                            arrsheet1[i]=outdata.PassFail.slice(indexArryPassFail[i],indexArryPassFail[i+1]);
                        }
                    }
                    let arrsheet2=[];
                    if(indexArryScore.length!=0){
                        for(var i=0;i<indexArryScore.length;i++){
                            arrsheet2[i]=outdata.Score.slice(indexArryScore[i],indexArryScore[i+1]);
                        }
                    }
                    let arrsheet3=[];
                    if(indexArryOthers.length!=0){
                        for(var i=0;i<indexArryOthers.length;i++){
                            arrsheet3[i]=outdata.Others.slice(indexArryOthers[i],indexArryOthers[i+1]);
                        }
                    }
                    let dataArry = {
                        PassFail:arrsheet1,
                        Score:arrsheet2,
                        Others:arrsheet3
                    }
                    _this.addAllData(dataArry);
                    _this.$refs.loadFile.value = '';
                    _this.$refs.loadFileEx.value = '';
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
                case 3: self.delAllItem();break;
            }
        },
        export2Excel() {
            var that = this;
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/excel/Export2Excel');
                const tHeader = [that.$t('insSettingView.tHeaderA'),that.$t('insSettingView.tHeaderB'),that.$t('insSettingView.tHeaderC'),that.$t('insSettingView.tHeaderD')]
                // const tHeaderzhcn = ['检查分类','检查项目名称','项目分值', "检查项目详细说明（选填，不填为空）",]; // 导出的表头名
                const filterVal = ['gourpname','napename','score','napedep',]; // 导出的表头字段名
                console.log(that.activeName);
                let excelData=[];
                let name = '';
                if(that.elTableData[Number(that.activeName)].data.length==0){
                    let obj={};
                    obj.gourpname='';
                    obj.napename='';
                    obj.score='';
                    obj.napedep='';
                    excelData.push(obj);
                    
                }else{
                    let curData=that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)];
                    name = that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].name;
                    curData.routeData.forEach((item,index)=>{
                        if(item.itemData.length!=0){
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
                        }else{
                            let obj={};
                            obj.gourpname=item.groupName;
                            obj.napename='';
                            obj.score='';
                            obj.napedep='';
                            excelData.push(obj);
                        }
                    })
                }
                const list = excelData;
                const data = that.formatJson(filterVal, list);
                let fileName = '';
                let label = '';
                switch (Number(that.activeName)) {
                  case 0: {
                    label = `[${that.$t('insSettingView.remotePatrol')}]`;
                    break;
                  }
                  case 1:{
                    label = `[${that.$t('insSettingView.onsitePatrol')}]`;
                    break;
                  }
                  default:{
                    label = `[${that.elTableData[Number(that.activeName)].label}]`
                  }
                }
                fileName = label+' '+name;
                export_json_to_excel(tHeader, data, fileName);// 导出的表格名称，根据需要自己命名
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
    $border: #e3e9f4;
    $tab: #7d8cad;
    *{
        font-family: Roboto,Arial, Microsoft YaHei;
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
    }

    .el-route-container{
        padding: 20px calc(20/1920*100vw) 15px calc(20/1920*100vw);
        border: 1px solid $border;
        background-color: #fff;
        .el-route-header{
            margin-top: calc(15/1920*100vw);
            .el-route-tabs{
                width: 98%;
                margin-left: calc(15/1920*100vw);
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
            }
            .el-route-btns{
                position: absolute;
                right: calc(40/1920*100vw);
                z-index: 10;
                width: auto;
                top: 25px;
                display: flex;
                align-items: center;
                .bind-title{
                    margin-right:calc(20/1920*100vw);
                    color:$tab;
                    font-size: 12px;
                }
                .en-bind-title{
                  margin-right:calc(20/1920*100vw);
                  color:$tab;
                  font-size: 12px;
                }
                .el-bind-btn{
                    color: #fff;
                    border-color: $mainColor;
                    border-radius: 3px;
                    margin-right:calc(20/1920*100vw);
                    font-size: 12px;
                    &:disabled{
                        opacity: 0.5;
                    }
                  @media screen and (max-width: 1440px) {
                    width: 100px !important;
                  }
                }
                .en-el-bind-btn{
                  color: #fff;
                  border-color: $mainColor;
                  border-radius: 3px;
                  margin-right: calc(20/1920*100vw);
                  .icon-quxiaolianjie{
                    font-size: calc(16/1920*100vw);
                  }
                  &:disabled{
                    opacity: 0.5;
                  }

                }
                .btn-class{
                  height: calc(36/1920*100vw);
                  padding: 0;
                  font-size: calc(14/1920*100vw);
                  width: calc(130/1920*100vw);
                  .iconfont{
                    font-size: calc(16/1920*100vw);
                    margin-right: calc(10/1920*100vw)
                  }
                  .btn-area{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }
                .downLoad-btn{
                    margin-left: 0px !important;
                    border-color: $mainColor !important;
                    color: $mainColor !important;
                    border-radius: 0px;
                    padding: 2px 5px !important;
                    position: relative;
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
                    border-right: 0;
                    height: calc(36/1920*100vw);
                    padding: 0 0;
                    font-size: calc(14/1920*100vw);
                    min-width: 85px;
                    min-height: 28px;
                    &:last-child{
                        border-right: 1px solid;
                    }

                    &:hover{
                        background-color: #FEE4E7;
                    }
                    &:focus{
                        background-color: #FEE4E7;
                    }
                  .btn-area{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }
              .en-el-handle-btn{
                margin-left: 0px !important;
                border-color: $mainColor !important;
                color: $mainColor !important;
                border-radius: 0px;
                border-right: 0;
                height: calc(36/1920*100vw);
                /*line-height: calc(36/1920*100vw);*/
                padding: 0 0;
                font-size: calc(14/1920*100vw);
                width: calc(130/1920*100vw);
                min-width: 85px;
                min-height: 28px;
                .btn-area{
                  display: flex;
                  align-items: center;
                  justify-content: center;
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

    .nameinput /deep/ .el-input__inner{
        border:0;
    }
    #en-patrltabs-content /deep/ .el-tabs__nav-scroll {
      height: 40px;
    }
    #en-patrltabs-content /deep/ .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: calc(160/1920*100vw);
      display: inline-block;
      /*overflow: hidden;*/
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    #en-patrltabs-content /deep/ .el-tabs__active-bar{
      height: 4px;
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
    .el-search-input{
      @include point(width,200);
      @include point(margin-right,20);
      position:absolute;
      right: 0px;
      top: 3px;
    }
    #patrltabs-content /deep/ .el-tabs__nav-next, #patrltabs-content /deep/ .el-tabs__nav-prev {
    line-height: 30px;
  }
  #patrltabs-content /deep/ .el-tabs__item {
    padding: 0 0;
    margin: 0 12px;
    font-size: 12px;
    font-family: Roboto,"Microsoft YaHei";
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 30px;
    line-height: 30px;
  }
  #patrltabs-content /deep/ el-tabs__nav-wrap.is-scrollable.is-top{
    height: 30px;
  }
  #patrltabs-content /deep/ .el-tabs__nav-wrap::after{
    position: static;
  }
  #patrltabs-content /deep/ .is-active {
    margin-bottom: 2px;
    background: #f31d65 ;
    color: #fff;
    border-radius: 3px;
  }

  #patrltabs-content /deep/ .el-tabs__active-bar{
    height: 0 !important;
  }

</style>

