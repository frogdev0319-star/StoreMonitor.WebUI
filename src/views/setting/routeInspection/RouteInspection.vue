<template>
    <el-row class="el-route-container">
        <el-col :span="24" class="el-route-header">
            <div v-if="itemhoverName!=''" class="item_name" :style="{'left':120*itemIndex+4*itemIndex+'px'}">{{itemhoverName}}<div class="triangle"></div></div>
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
                :key="index" size="mini" @click="handleNape(index,item)" :disabled="item.enabled" :class="lang=='en'? 'en-el-handle-btn': 'el-handle-btn' ">
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
                        <el-tabs v-model="patrolActive" v-if="item.data.length!=0" @tab-click="handleClickPatrol" id="patrltabs-content" :style="{'min-height':varyWindowWidth*0.70+'px'}">
                            <el-tab-pane v-for="(_item,_index) in item.data" :key="_index" :name="_index.toString()">
                                <span slot="label" @mouseover="overItem(_item,_index)" @mouseout="outItem(_item,_index)">{{_item.name}}</span>
                                <div v-if="_item.routeData&&!loading">
                                    <route-detail :ref="curIndex" :route-data="_item.routeData" :route-name="_item.name" :down-src="downLoadSrc" :all-routedata="_item.allRoutedata" :sheet-name="_item.sheetName"
                                    :tab-name="_item.name" @refreshList="getTagList" @change-routeData="changerouteData"></route-detail>
                                </div>
                                <div class="bind-empty" :style="{'line-height':varyWindowWidth*0.52+'px'}" v-if="loading">
                                    <img :src="loadingGif"/>
                                    <span class="empty-text">{{generateInsSettingLang('loadingbindstore')}}</span>
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
import {getScheduleListService} from '@/api/schedule'

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
            loadingGif: require('../../../../static/img/loading.gif'),
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
            itemhoverName:'',
            itemIndex:0,
            loading:false,
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
            reload:true,
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
            tempdata:[],
            btnList:[
                {
                    id:0,
                    iconClass:'iconfont icon-daoru',
                    style:'font-size:24px;',
                    name:'import',
                    btnTitle: this.$t('insSettingView.import'),
                    enabled:false,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-daochu',
                    style:'font-size:24px;',
                    name:'export',
                    btnTitle: this.$t('insSettingView.export'),
                    enabled:false,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-xiazai',
                    style:'font-size:24px;',
                    name:'download',
                    btnTitle: this.$t('insSettingView.download'),
                    enabled:false,
                },
                {
                    id:0,
                    iconClass:'iconfont icon-shanchu',
                    style:'font-size:17px;',
                    name:'delete',
                    btnTitle: this.$t('scheduleView.delete'),
                    enabled:false,
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
        getScheduleFromDB(params){
            return new Promise((resolve, reject) => {
                getScheduleListService(params).then(res => {
                    console.log(res);
                    let errMsg = res.errMsg;
                    let data = res.data;
                    resolve(data);
                })
            })
        },
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
        changerouteData(val){
            let self=this;
            // self.reload=false
            // self.$nextTick(() => {
            //     self.reload=true
                   self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData=val
	      	// })
        },
        async getTagList(val){
            let self=this;
            let TagData=await self.getTagAll();
            if(TagData.length!=0){
                if(val=='del'||self.$route.params.val=='del'){
                    if(Number(self.patrolActive)==TagData.length){
                        self.patrolActive=(TagData.length-1).toString()
                    }
                }
                if(val=='accountChanged'){
                    self.patrolActive = '0'
                }
                let tagIndex=0
                if(val=='add'){
                    tagIndex=TagData.length-1
                }else{
                    tagIndex=Number(self.patrolActive)
                }
                let params={
                    inspectId:TagData[tagIndex].id
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
                            _obj.type=_item.type
                            _obj.checked=false;
                            let tempChild=[];
                            _item.items.forEach(itemChild=>{
                                let objChild={};
                                objChild.id=itemChild.id;
                                objChild.checked=false;
                                objChild.name=itemChild.subject;
                                objChild.description=(itemChild.description==undefined||itemChild.length==0)?'--':itemChild.description;
                                objChild.score=itemChild.itemScore ;
                                objChild.qualifiedScore=itemChild.qualifiedScore

                                tempChild.push(objChild);
                            })
                            _obj.itemData=tempChild;
                            _obj.inspectId=TagData[tagIndex].id; //巡检表
                            _obj.mode=TagData[Number(self.patrolActive)].mode; //巡检类别
                            groupids.push(_item.id)
                            temp.push(_obj);
                    })
                    let postparams={
                        groupIds:groupids
                    }
                    let titletemp=await self.getInspectGroupBindAll(postparams)
                    let titleList=await self.getUserTitleList()
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
                    let te_temp=[]
                    let sheetName=[]
                    for(let i=0;i<3;i++){
                        let Typeindex=temp.filter(x=>x.type==i);
                        let obj={}
                        if(Typeindex.length!=0){
                            te_temp.push(Typeindex)
                            if(Typeindex[0].type==0){
                                obj={'id':0,'isClick':false,'label':self.$t('insSettingView.sheetpassfail')}
                            }
                            if(Typeindex[0].type==1){
                                obj={'id':1,'isClick':false,'label':self.$t('insSettingView.sheetscore')}
                            }
                            if(Typeindex[0].type==2){
                                obj={'id':2,'isClick':false,'label':self.$t('insSettingView.sheetother')}
                            }
                            sheetName.push(obj)
                        }
                    }
                    sheetName[0].isClick=true
                    self.tempdata=temp
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
                        tagObj.routeData=te_temp[0]
                        tagObj.allRoutedata=te_temp
                        tagObj.sheetName=sheetName
                        tagTemp.push(tagObj)
                    })
                    if(self.activeName==0){
                        if(temp.length == 0){
                          self.getDownLoadURL();
                        }
                        self.elTableData[0].data=tagTemp;
                    }
                    else if(self.activeName==1){
                        if(temp.length == 0){
                          self.getDownLoadURL();
                        }
                        self.elTableData[1].data=tagTemp;
                    }
                    else{
                        obj.label=item;
                        obj.data={name:'',routeData:te_temp[0]};
                        // tempAllData.push(obj);
                    }
                // })
                self.elTableData=self.elTableData.concat(tempAllData);
                if(val=='add'){
                    self.patrolActive=(TagData.length-1).toString()
                    self.notify(self.$t('insSettingView.importSuss'),'success',3000);
                }
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
            let mode= self.activeName=='0' ? mode=0 : mode=1  //远程巡检 mode 0,现场巡检  mode 1
            let arr = Object.entries(dataArry)
            let tempGroups=[];
            let tempItems=[];
            let type = null
            for(let i=0;i<arr.length;i++){
                if(arr[i][0]=='PassFail'){
                    type=0
                }
                else if(arr[i][0]=='Score'){
                    type=1
                }
                else if(arr[i][0]=='Others'){
                    type=2
                }
                if(arr[i][1].length!=0){
                    arr[i][1].forEach((item,index)=>{
                        let obj={};
                            obj.name=item[0].a;
                            obj.mode=mode;
                            obj.tag=self.ImportName;
                            obj.type=type
                            tempGroups.push(obj);
                    })
                }
            }
            let paramsGroup={
                "groups": tempGroups //巡检类别
            };
            let resGroup=await self.addGroup(paramsGroup);
            let codeGroup=resGroup.errMsg;
            let dataGroup=resGroup.data;
            let groupindex=0
            if(codeGroup!=null&&codeGroup=='Success'){
                for(let i=0;i<arr.length;i++){
                    if(arr[i][1].length!=0){
                        arr[i][1].forEach((item,index)=>{
                            let objItem={};
                            let temp=[];
                            item.forEach((_item,_index)=>{
                                let _obj={};
                                let itemScore=0,qualifiedScore=0,description=''
                                if(arr[i][0]=='PassFail'){
                                    itemScore = 10
                                    qualifiedScore = null
                                    description = _item.c
                                }
                                else if(arr[i][0]=='Score'){
                                    itemScore = _item.c
                                    qualifiedScore = _item.d
                                    description = _item.e
                                }
                                else if(arr[i][0]=='Others'){
                                    itemScore = _item.c
                                    qualifiedScore = null
                                    description = _item.d
                                }
                                _obj.subject=_item.b;
                                _obj.description=description;
                                _obj.itemScore=itemScore;
                                _obj.qualifiedScore=qualifiedScore
                                temp.push(_obj);
                            })
                            objItem.groupId=dataGroup[groupindex];
                            objItem.items=temp;
                            tempItems.push(objItem);
                            groupindex=groupindex+1
                        })
                    }
                }
                let paramsItem={
                    "request": tempItems //巡检项
                };
                let resItem=await self.addItem(paramsItem);
                let codeItem=resItem.errMsg;
                if(codeItem!=null&&codeItem=='Success'){
                    self.getTagList('add');
                }
                else{
                    self.notify(self.$t('insSettingView.importFail'),'warning',3000);
                }
            }
            else{
                self.notify(self.$t('insSettingView.importFail'),'warning',3000);
            }
            // self.showImportContent=false;
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
            if(self.elTableData[Number(self.activeName)].data.length==0){
                self.notify(self.$t('insSettingView.emptyInfo'),'warning',3000);
                return false;
            }
            let arr=[];
            self.tempdata.forEach(item=>{
                    item.itemData.forEach(_item=>{
                        arr.push(_item.id);
                    });
            });
            if(arr.length==0){
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
                }else if(validateInput(self.ImportName)){
                    self.isShowWarning = true
                    self.warningContent = self.$t('insSettingView.excelIllegalCategory')
                }else{
                    self.isShowWarning = false
                    document.getElementById('loadFileEx').click()
                    self.showNameImport=false
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
            sessionStorage.setItem('TabIndex',tabObj.index);
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
        overItem(item,index){
            let self=this
            self.itemhoverName=item.name
            self.itemIndex=index
        },
        outItem(item,index){
            let self=this
            self.itemhoverName=''
        },
        handleClickPatrol(val){
            let self = this;
            if(self.activeName=='0'){
                sessionStorage.setItem('TabPatrolIndex0',val.index);
            }else if(self.activeName=='1'){
                sessionStorage.setItem('TabPatrolIndex1',val.index);
            }
            self.loading=true
            self.btnList[1].enabled=true
            self.btnList[3].enabled=true
            self.getTagList();
        },
        async delAllItem(){
            let self=this
            let datalength = self.elTableData[Number(self.activeName)].data.length
            if(datalength==0){
                self.notify(self.$t('insSettingView.deletePatrolList'),'warning',3000);
                return false;
            }else{
                let bindSchedule = await self.getScheduleFromDB()
                let arrtemp=[]
                bindSchedule.forEach(item=>{
                    if(item.extra!=null){
                        arrtemp.push(item.extra.inspectId)
                    }
                })
                if(arrtemp.indexOf(self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData[0].inspectId)!=-1){
                    self.notify(self.$t('insSettingView.deletebindSchedule'),'warning',3000);
                    return false;
                }
            }
            self.showSingleDeleteContent=true
        },
        confirmDelete(){
            let self=this;
            let arrGroup=[];
            let arrItem=[];
            self.tempdata.forEach(item=>{
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
            if(Number(self.activeName)==0&&Datalength>=10){
                    self.notify(self.$t('insSettingView.RemoteLength'),'warning',3000);
                    return false;
            }else if(Number(self.activeName)==1&&Datalength>=10){
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
                        self.loading=false
                        self.btnList[1].enabled=false
                        self.btnList[3].enabled=false
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
                            // obj.d = _item.__EMPTY_3
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
                    // let flagDescNamePassFail = false,flagDescNameScore = false,flagDescNameOthers = false
                    let flagDesLengthPassFail=false,flagDesLengthScore=false,flagDesLengthOthers=false;
                    let flagFullScoreType=false,flagMinScoreType=false,flagOtherScoreType=false
                    let flagTempError=false
                    //sheet整合好的巡检表:outdata
                    if((outdata.PassFail==undefined&&outdata.Score==undefined&&outdata.Others!=undefined)||(outdata.PassFail!=undefined&&outdata.Score==undefined&&outdata.Others!=undefined)){
                        _this.$refs.loadFile.value = ''
                        _this.$refs.loadFileEx.value = '';
                        let msg=''
                        if(_this.lang=='en'){
                            msg = _this.$t('insSettingView.OnlyOthers')
                        }else{
                            msg = '【Score】' + _this.$t('insSettingView.beforeImport')
                        }
                        _this.notify(msg,'warning',3000);
                        return false;
                    }
                    outdata.PassFail==undefined&&outdata.Score==undefined&&outdata.Others==undefined ? flagTempError=true : flagTempError=false
                    let arr = Object.entries(outdata)
                    for(let i=0;i<arr.length;i++){
                        arr[i][1].forEach((item,index)=>{
                            if(arr[i][0]=='PassFail'){
                                    if(item.a!=undefined&&item.a.length!=0){
                                        indexArryPassFail.push(index);
                                        if(filterString.getContentLength(item.a.toString().trim()) > 30){flaggroupLengthPassFail=true;}
                                    }
                                    if(item.b==undefined||item.b.length==0){flagItemNamePassFail=true;}
                                    else if(filterString.getContentLength(item.b.toString().trim()) > 100){flagItemLengthPassFail=true;}
                                    if(item.c!=undefined){
                                        if(filterString.getContentLength(item.c.toString().trim()) > 1200){flagDesLengthPassFail=true;}
                                    }
                            }else if(arr[i][0]=='Score'){
                                    if(item.a!=undefined&&item.a.length!=0){
                                        indexArryScore.push(index);
                                        if(filterString.getContentLength(item.a.toString().trim()) > 30){flaggroupLengthScore=true;}
                                    }
                                    if(item.b==undefined||item.b.length==0){flagItemNameScore=true;}
                                    else if(filterString.getContentLength(item.b.toString().trim()) > 100){flagItemLengthScore=true;}
                                    if(item.c==undefined||item.c.length==0||!Number.isInteger(item.c)||parseInt(item.c)<1||parseInt(item.c)>10){//项目满分值必填，字符类型为1~10整数
                                        flagFullScoreType=true
                                    }
                                    if(item.d!=undefined){
                                        if(!Number.isInteger(item.d)||parseInt(item.d)<1||parseInt(item.d)>parseInt(item.c)){//最低分值必填，字符类型为1~item.c整数
                                            flagMinScoreType=true
                                        }
                                    }else{
                                        item.d=item.c
                                    }
                                    if(item.e!=undefined){
                                        if(filterString.getContentLength(item.e.toString().trim()) > 1200){flagDesLengthScore=true;}
                                    }
                            }else if(arr[i][0]=='Others'){
                                    if(item.a!=undefined&&item.a.length!=0){
                                        indexArryOthers.push(index);
                                        if(filterString.getContentLength(item.a.toString().trim()) > 30){flaggroupLengthOthers=true;}
                                    }
                                    if(item.b==undefined||item.b.length==0){flagItemNameOthers=true;}
                                    else if(filterString.getContentLength(item.b.toString().trim()) > 100){flagItemLengthOthers=true;}
                                    if(item.c==undefined||item.c.length==0||!Number.isInteger(Math.abs(item.c))||parseInt(item.c)<-100||parseInt(item.c)>100){//项目分值必填，字符类型为-100~+100整数
                                        flagOtherScoreType=true
                                    }
                                    if(item.d!=undefined){
                                        if(filterString.getContentLength(item.d.toString().trim()) > 1200){flagDesLengthOthers=true;}
                                    }
                            }
                        })
                    }
                    let showWarningIfo = flaggroupLengthPassFail||flaggroupRexPassFail||flagItemNamePassFail||flagItemLengthPassFail||flagItemRexPassFail||flagDesLengthPassFail||
                                         flaggroupLengthScore||flaggroupRexScore||flagItemNameScore||flagItemLengthScore||flagItemRexScore||flagDesLengthScore||
                                         flaggroupLengthOthers||flaggroupRexOthers||flagItemNameOthers||flagItemLengthOthers||flagItemRexOthers||flagDesLengthOthers||
                                         flagFullScoreType||flagMinScoreType||flagOtherScoreType||flagTempError
                    if(showWarningIfo){
                        _this.showFailInfo=true
                        _this.$refs.loadFile.value = ''
                        _this.$refs.loadFileEx.value = '';
                        if(flagTempError){
                            _this.FileInfo.push(_this.$t('insSettingView.templateError'))
                        }
                        if(flaggroupLengthPassFail||flaggroupLengthScore||flaggroupLengthOthers){
                            let flagArr = []
                            if(flaggroupLengthPassFail){flagArr.push('PassFail')}
                            if(flaggroupLengthScore){flagArr.push('Score')}
                            if(flaggroupLengthOthers){flagArr.push('Others')}
                            let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelLongCategory')
                            _this.FileInfo.push(flag)
                        }
                        // if(flaggroupRexPassFail||flagItemRexPassFail||flaggroupRexScore||flagItemRexScore||flaggroupRexOthers||flagItemRexOthers){
                        //     let flagArr = []
                        //     if(flaggroupRexPassFail||flagItemRexPassFail){flagArr.push('PassFail')}
                        //     if(flaggroupRexScore||flagItemRexScore){flagArr.push('Score')}
                        //     if(flaggroupRexOthers||flagItemRexOthers){flagArr.push('Others')}
                        //     let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.excelIllegalCategory')
                        //     _this.FileInfo.push(flag)
                        // }
                        if(flagItemNamePassFail||flagItemNameScore||flagItemNameOthers){
                            let flagArr = []
                            if(flagItemNameScore){
                                let flag = 'Score' + ' ' +  _this.$t('insSettingView.excelEmpty')
                                _this.FileInfo.push(flag)
                            }
                            if(flagItemNamePassFail||flagItemNameOthers){
                                if(flagItemNamePassFail){flagArr.push('PassFail')}
                                if(flagItemNameOthers){flagArr.push('Others')}
                                let flag = flagArr.toString() +' ' +  _this.$t('insSettingView.passfailexcelEmpty')
                                _this.FileInfo.push(flag)
                            }
                            
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
                        if(flagFullScoreType){
                            _this.FileInfo.push('Score' + ' ' +_this.$t('insSettingView.excelFullScoreType'))
                        }
                        if(flagMinScoreType){
                            _this.FileInfo.push('Score' + ' ' +_this.$t('insSettingView.excelMinScoreType'))
                        }
                        if(flagOtherScoreType){
                            _this.FileInfo.push('Others' + ' ' +_this.$t('insSettingView.excelOtherScoreType'))
                        }
                        return false
                    }
                    let arrsheet1=[];
                    if(outdata.PassFail!=undefined){
                        if(indexArryPassFail.length!=0){
                            for(var i=0;i<indexArryPassFail.length;i++){
                                arrsheet1[i]=outdata.PassFail.slice(indexArryPassFail[i],indexArryPassFail[i+1]);
                            }
                        }else{
                            if(outdata.PassFail.length!=0){
                                arrsheet1.push(outdata.PassFail)
                                arrsheet1[0][0].a = _this.$t('insSettingView.Ratingitems')
                            }
                        }
                    }
                    let arrsheet2=[];
                    if(outdata.Score!=undefined){
                        if(indexArryScore.length!=0){
                            for(var i=0;i<indexArryScore.length;i++){
                                arrsheet2[i]=outdata.Score.slice(indexArryScore[i],indexArryScore[i+1]);
                            }
                        }
                    }
                    let arrsheet3=[];
                    if(outdata.Others!=undefined){
                        if(indexArryOthers.length!=0){
                            for(var i=0;i<indexArryOthers.length;i++){
                                arrsheet3[i]=outdata.Others.slice(indexArryOthers[i],indexArryOthers[i+1]);
                            }
                        }else{
                            if(outdata.Others.length!=0){
                                arrsheet3.push(outdata.Others)
                                arrsheet3[0][0].a = _this.$t('insSettingView.Addscoreitems')
                            }
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
                const tHeader = [that.$t('insSettingView.tHeaderA'),that.$t('insSettingView.tHeaderB'),that.$t('insSettingView.tHeaderC'),that.$t('insSettingView.tHeaderD'),that.$t('insSettingView.tHeaderF'),that.$t('insSettingView.tHeaderA2')]
                let excelData=[];
                let name = '';
                var wb = XLSX.utils.book_new();
                if(that.elTableData[Number(that.activeName)].data.length==0){
                    // let obj={};
                    // obj.gourpname='';
                    // obj.napename='';
                    // obj.score='';
                    // obj.napedep='';
                    // excelData.push(obj);
                    //巡检表为空时导出处理
                    
                }else{
                    let sheet1data=[],sheet2data=[],sheet3data=[]
                    let curData=that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].allRoutedata;
                    let passfail=curData.filter(x=>x[0].type==0)[0];
                    let score=curData.filter(x=>x[0].type==1)[0];
                    let other=curData.filter(x=>x[0].type==2)[0];
                    name=that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].name
                    if(passfail!=undefined){
                        passfail.forEach(item=>{
                            if(item.itemData.length!=0){
                                item.itemData.forEach((_item,_index)=>{
                                    let obj={};
                                    if(_index==0){
                                        obj[tHeader[0]]=item.groupName;
                                    }
                                    else{
                                        obj[tHeader[0]]='';
                                    }
                                    obj[tHeader[1]]=_item.name;
                                    obj[tHeader[3]]=_item.description=='---'?'':_item.description;
                                    sheet1data.push(obj);
                                })
                            }else{
                                let obj={};
                                obj[tHeader[0]]=item.groupName;
                                obj[tHeader[1]]='';
                                obj[tHeader[3]]='';
                                sheet1data.push(obj);
                            }
                        })
                        var sheet1 = XLSX.utils.json_to_sheet(sheet1data);
                        XLSX.utils.book_append_sheet(wb, sheet1, "Pass&Fail");
                    }
                    if(score!=undefined){
                        score.forEach(item=>{
                            if(item.itemData.length!=0){
                                item.itemData.forEach((_item,_index)=>{
                                    let obj={};
                                    if(_index==0){
                                        obj[tHeader[5]]=item.groupName;
                                    }
                                    else{
                                        obj[tHeader[5]]='';
                                    }
                                    obj[tHeader[1]]=_item.name;
                                    obj[tHeader[2]]=_item.score;
                                    obj[tHeader[4]]=_item.qualifiedScore
                                    obj[tHeader[3]]=_item.description=='---'?'':_item.description;
                                    sheet2data.push(obj);
                                })
                            }else{
                                let obj={};
                                obj[tHeader[5]]=item.groupName;
                                obj[tHeader[1]]='';
                                obj[tHeader[2]]='';
                                obj[tHeader[4]]=_item.qualifiedScore
                                obj[tHeader[3]]='';
                                sheet2data.push(obj);
                            }
                        })
                        var sheet2 = XLSX.utils.json_to_sheet(sheet2data);
                        XLSX.utils.book_append_sheet(wb, sheet2, "Score");
                    }
                    if(other!=undefined){
                        other.forEach(item=>{
                            if(item.itemData.length!=0){
                                item.itemData.forEach((_item,_index)=>{
                                    let obj={};
                                    if(_index==0){
                                        obj[tHeader[0]]=item.groupName;
                                    }
                                    else{
                                        obj[tHeader[0]]='';
                                    }
                                    obj[tHeader[1]]=_item.name;
                                    obj[tHeader[2]]=_item.score;
                                    obj[tHeader[3]]=_item.description=='---'?'':_item.description;
                                    sheet3data.push(obj);
                                })
                            }else{
                                let obj={};
                                obj[tHeader[0]]=item.groupName;
                                obj[tHeader[1]]='';
                                obj[tHeader[2]]='';
                                obj[tHeader[3]]='';
                                sheet3data.push(obj);
                            }
                        })
                        var sheet3 = XLSX.utils.json_to_sheet(sheet3data);
                        XLSX.utils.book_append_sheet(wb, sheet3, "Others");
                    }
                }
                let label = ''
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
                let fileName = label+' '+name+'.xlsx';
                const workbookBlob = that.workbook2blob(wb);
                that.openDownloadDialog(workbookBlob,fileName);
            })
        },
        // 将workbook装化成blob对象
        workbook2blob(workbook) {
          let self=this
          var wopts = {bookType: "xlsx",bookSST: false,type: "binary"};
          var wbout = XLSX.write(workbook, wopts);
          var blob = new Blob([self.s2ab(wbout)], {
            type: "application/octet-stream"
          });
          return blob;
        },
        s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        },
        openDownloadDialog(blob, fileName) {
            if (typeof blob == "object" && blob instanceof Blob) {
                blob = URL.createObjectURL(blob);
            }
            var aLink = document.createElement("a");
            aLink.href = blob;
            aLink.download = fileName || "";
            var event;
            if (window.MouseEvent) event = new MouseEvent("click");
                // 移动端
            else {
                event = document.createEvent("MouseEvents");
                event.initMouseEvent( "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
            }
            aLink.dispatchEvent(event);
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
            .item_name{
                    position: absolute;
                    top:55px;
                    margin-left:47px;
                    z-index: 100;
                    height:18px;
                    line-height: 18px;
                    border-radius: 3px;
                    background-color: rgb(0, 0, 0);
                    color:#fff;
                    padding:5px 2px;
                    min-width: 100px;
                    text-align: center;
                    font-size: calc(12/1920*100vw);
                    .triangle{
                        width:10px;
                        height:10px;
                        margin:0 auto;
                        transform:rotate(45deg);
                        background-color: rgb(0, 0, 0);
                    }
                }
            .el-route-tabs{
                width: 98%;
                margin-left: calc(15/1920*100vw);
                
                .bind-empty{
                    text-align: center;
                    img{
                        width:32px;
                        height:32px;
                        vertical-align: middle;
                    }
                    .empty-text{
                        font-size: calc(14/1920*100vw);
                        color:#7d8cad;
                        vertical-align: middle;
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

