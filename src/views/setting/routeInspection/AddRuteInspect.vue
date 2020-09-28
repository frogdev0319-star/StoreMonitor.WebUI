<template>
    <el-row class="el-addrute">
        <el-col :span="24" class="el-rute-title">
            <span class="tab-name" v-if="!showEditTab">{{routeName}}<i class="iconfont icon-bianji icon-tabname" @click="editTabName"></i></span>
            <el-input :size="varyWindowWidth>1600?'small':'mini'" v-if="showEditTab" class="tabName-input" :placeholder="generateInsSettingLang('enterListName')" v-model="editRouteName" @input="RouteNameLength"></el-input>
            <div class="iconcontent" v-if="showEditTab" style="margin-top:28px;">
                <div class="iconlised" @click="confirmEditTab">
                    <i class="el-icon-check"></i>
                </div>
                <div class="iconrised" @click="cancelEditTab">
                    <i class="el-icon-close"></i>
                </div>
            </div>
            <span v-if="showLengthNameWarning" class="warningtips">{{$t('insSettingView.enterNameRuletip')}}</span>
        </el-col>
        <el-col :span="24" class="el-rute-post">
            <div class="post-left">
                <span><i class="iconfont icon-quxiaolianjie"></i>{{$t('insSettingView.selecttitle')}}</span>
                <region-multi-select :options="titleList" :placeholder="generateInsSettingLang('selectPost')" :disabled="false"
                    :inputSize="`mini`" :selected="ModelPost" :all="$t('reportView.all')" @changeInput="changeSelect(arguments)"></region-multi-select>
            </div>
            <div class="post-right">
                <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" size="mini" @click="submitBindTitle" type="primary" class="btn-class">
                    {{$t('remotePatrol.submit')}}
                </el-button>
            </div>
        </el-col>
       <el-col :span="7" class="el-rute-group">
           <div class="group-content">
               <div class="title-content">
                 <span class="level2"><i class="iconfont icon-wenjian icontitle"></i><span class="level2-name">{{groupTitle}}</span></span>
                   <div class="btn-content">
                       <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" size="mini" @click="addGroup" type="primary" class="btn-class">
                         <div class="btn-area">
                           <i class="el-icon-plus"></i>
                           <span>{{generateInsSettingLang('addCategory')}}</span>
                         </div>
                       </el-button>
                   </div>
               </div>
               <el-scrollbar style="height:100%;" id="el-menuscrollbar">
               <div class="group-items group-title" :style="{'max-height':varyDivHeight+'px'}">
                   <div class="top-group-title">
                       <div class="group-name-title">
                            <el-tabs v-model="activeSheetName" id="group-content" @tab-click="handleSheetClick">
                                <el-tab-pane v-for="(item,index) in sheetName" :key="index" :label="item.label" :name="item.id"></el-tab-pane>
                            </el-tabs>
                       </div>
                   </div>
                   <div v-for="(item,index) in groupList" :key="index" class="groupItem" @click="clickGroupItem(index,item)" @mouseenter="getEditGroup(index,item)" :class="item.isClick?'noraml-color':'noraml-groupColor'">
                        <div class="proper-flag" v-if="item.isClick"></div>
                        <div>
                            <div class="group-left">
                                 <span v-if="!item.isEdit" :style="item.isClick?{'color':'#f31d65'}:{}">{{item.groupName}}（{{item.groupNum}}）</span>
                                 <el-input  size="mini" v-model="item.groupName" class="group-input" v-if="item.isEdit" @input="(val)=>groupNameChange(val,item)"></el-input>
                            </div>
                            <div class="group-right">
                                <div v-if="item.showEdit" class="show-edit">
                                    <div class="nape-items-handle" v-if="!item.isEdit">
                                        <i class="iconfont icon-bianji"
                                        style="cursor:pointer;"
                                        @click="editGroup(index,item)"></i>
                                        <i class="iconfont icon-shanchu" style="cursor:pointer;"
                                        @click="deleteGroup(index, item)"></i>
                                    </div>
                                </div>
                                <div class="iconcontent" v-if="item.isEdit">
                                    <div class="iconlised" @click="confirmEditGroup(index,item)">
                                        <i class="el-icon-check"></i>
                                    </div>
                                    <div class="iconrised" @click="cancelEditGroup(index,item)">
                                        <i class="el-icon-close"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="group-add" v-if="showAddGroup">
                        <div class="group-name-left">
                            <el-input  size="mini" class="groupName-input" :placeholder="generateInsSettingLang('enterName')" v-model="groupNameInput" @input="(val)=>groupNameChange(val,{})" @blur="notShowInputRuleTips('enterName')"></el-input>
                            <span class="rules" v-if="enterNameRuletip">{{generateInsSettingLang('enterNameRuletip')}}</span>
                        </div>
                        <div class="group-name-right">
                            <div class="iconcontent">
                                <div class="iconlised" @click="confirmAddGroup">
                                    <i class="el-icon-check"></i>
                                </div>
                                <div class="iconrised" @click="cancelAddGroup">
                                    <i class="el-icon-close"></i>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
               </el-scrollbar>
                <el-dialog :title="$t('remotePatrol.prompt')"
                :visible.sync="showFailInfo" v-if="showFailInfo"
                :append-to-body='true'
                :close-on-click-modal="false"
                width="510px"
                top="35vh"
                left="40vh">
                    <div class="dialog-content" style="overflow:hidden;width:100%;">
                        <hr style="border: 0.5px solid #dfe2e9;"/>
                        <div style="margin:20px 20px 20px 26px;">
                            <i class="el-icon-warning" style="font-size:25px;margin-right:10px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                            <span style="display: inline-block; vertical-align: middle;font-size:14px;color:#182752;">{{generateInsSettingLang('notallowdeletetips')}}</span>
                            <p style="padding-left:40px;color:#182752;">A.{{generateInsSettingLang('notallowA')}}</p>
                            <p style="padding-left:40px;color:#182752;">B.{{generateInsSettingLang('notallowB')}}</p>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="file-cancel-btn" @click="showFailInfo = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                        <el-button class="file-confirm-btn" @click="showFailInfo = false" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                    </div>
                </el-dialog>
           </div>
       </el-col>
       <el-col :span="17" class="el-rute-nape">
           <div class="nape-content">
               <div class="title-content">
                    <span :class="lang=='en' ? 'en-item-title': 'item-title'" class="level2">
                      <i class="iconfont icon-icon-test icontitle"></i>
                      <span class="level2-name">{{napeTitle}}</span></span>
                    <div class="btn-content">
                        <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" size="mini" :disabled="groupList.length==0" @click="addNape" type="primary" class="btn-class">
                          <div class="btn-area">
                            <i class="el-icon-plus"></i>
                            <span>{{generateInsSettingLang('addInsItem')}}</span>
                          </div>
                        </el-button>
                        <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" size="mini" :disabled="groupList.length==0" @click="deleteNape" type="primary" class="btn-class">
                          <div class="btn-area">
                            <i class="iconfont icon-shanchu"></i>
                            <span>{{generateInsSettingLang('deleteInsItem')}}</span>
                          </div>
                        </el-button>
                    </div>
               </div>
               <el-scrollbar style="height:100%;" id="el-menuscrollbar">
               <div class="nape-items" :style="{'max-height':varyDivHeight+'px'}">
                   <div class="nape-items-title" v-if="napeList.length!=0">
                       <div class="nape-name-title" :style="activeSheetName=='1'?'flex:2;':(activeSheetName=='2'?'flex:3;':'flex:2;')">
                           <span>{{generateInsSettingLang('inspectName')}}</span>
                       </div>
                       <div class="nape-dep-title" :style="activeSheetName=='1'?'flex:3;':(activeSheetName=='2'?'flex:4;':'flex:3.3;')">
                           <span :style="activeSheetName=='1'?'left:5%;':(activeSheetName=='2'?'left:2%;':'')">{{generateInsSettingLang('inspectionDescp')}}</span>
                       </div>
                       <div class="nape-score0-title" v-if="activeSheetName=='1'" style="flex:1;">
                           <span style="position:relative;;left:8%;">{{generateInsSettingLang('sheetscore0')}}</span>
                       </div>
                       <div class="nape-score0-title" v-if="activeSheetName=='1'" style="flex:1;line-height:20px;padding-top:10px;padding-right:20px;">
                           <span>{{generateInsSettingLang('sheetscore1')}}</span>
                       </div>
                       <div class="nape-score1-title" v-if="activeSheetName=='2'" style="flex:2;">
                           <span>{{generateInsSettingLang('sheetscore2')}}</span>
                       </div>
                       <div :class="lang=='en'? 'en-nape-handle-title':'nape-handle-title'" style="flex:1;">
                           <span>{{generateInsSettingLang('operation')}}</span>
                       </div>
                   </div>
                   <div class="nape-items-data"
                   v-for="(item,index) in napeList"
                   :key="index" @click="clickItem(index,item)" :class="!item.isClick?'noraml-color':'active-color'">
                       <div class="nape-name-data" :style="activeSheetName=='1'?'flex:2;':(activeSheetName=='2'?'flex:3;':'flex:2;')">
                            <el-checkbox v-model="item.checked" class="item-checkbox"></el-checkbox>
                            <span class="nape-name" v-if="!item.isClick">{{item.napeNameShow}}</span>
                            <el-input size="mini" v-model="item.napeName" class="nape-input" :placeholder="generateInsSettingLang('enterItemName')" v-if="item.isClick" @input="(val)=>napeNameChange(val, item)"></el-input>
                       </div>
                       <div class="nape-dep-data" :style="activeSheetName=='1'?'flex:2.7;':(activeSheetName=='2'?'flex:4;':'flex:3;margin-right:40px;')">
                           <span class="nape-dep" v-if="!item.isClick">{{item.napeDep}}</span>
                           <el-input type="textarea"  resize='none' :autosize="{ minRows: 1}" size="mini" v-model="item.napeDep" class="nape-input" :placeholder="generateInsSettingLang('description')" v-if="item.isClick" @input="(val)=>napeDepChange(val, item)"></el-input>
                       </div>
                       <div class="nape-scores-handle" v-if="activeSheetName=='1'" style="flex:1;">
                           <span style="margin-left:40px;" v-if="!item.isClick">{{item.Score_1}}{{lang!='en'?$t('remotePatrol.scorecount'):''}}</span>
                           <el-select size="mini" class="FullScore-input" v-if="item.isClick" v-model="item.Score_1" @change="selectFullScore">
                                <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                       </div>
                       <div class="nape-scores-handle" v-if="activeSheetName=='1'" style="flex:1;">
                           <span style="margin-left:40px;" v-if="!item.isClick">{{item.Score_2}}{{lang!='en'?$t('remotePatrol.scorecount'):''}}</span>
                           <el-select size="mini" class="critical-input" v-if="item.isClick" v-model="item.Score_2">
                                <el-option v-for="item in ScoreList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                       </div>
                       <div class="nape-scores-handle" v-if="activeSheetName=='2'" style="flex:2;">
                           <span style="margin-left:73px;" v-if="!item.isClick">{{item.Score_3}}{{lang!='en'?$t('remotePatrol.scorecount'):''}}</span>
                           <el-input size="mini" class="Itemscores-input" v-if="item.isClick" v-model="item.Score_3"></el-input>
                       </div>
                       <div class="nape-items-handle" v-if="!item.isClick" style="flex:1;">
                           <i class="iconfont icon-bianji" style="cursor:pointer;margin-right:10px;"  @click="handleEdit(index,item)"></i>
                           <i class="iconfont icon-shanchu" style="cursor:pointer;"  @click="handleDelete(index, item)"></i>
                       </div>
                       <div class="iconcontent" v-if="item.isClick" style="flex:1;">
                            <div class="iconlised" style="background-color:#f31d65" @click="confirmeditNape(index,item)">
                                <i class="el-icon-check"></i>
                            </div>
                            <div class="iconrised" @click="cancelEditNape(index,item)">
                                <i class="el-icon-close"></i>
                            </div>
                        </div>
                   </div>
                    <el-dialog :title="generateInsSettingLang('confirmDelete')"
                    :visible.sync="showDeleteItem" v-if="showDeleteItem"
                    :append-to-body='true'
                    :close-on-click-modal="false"
                    width="28%"
                    top="35vh"
                    left="40vh">
                        <div  style="overflow:hidden;">
                            <hr style="border: 0.5px solid #dfe2e9;;"/>

                            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                                <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"></i>
                                <span style="display: inline-block; vertical-align: middle;">{{generateInsSettingLang('confirmCurDel')}}</span>
                            </p>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button class="file-cancel-btn" @click="showDeleteItem = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                            <el-button class="file-confirm-btn" @click="confirmDeleteItem" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                        </div>
                    </el-dialog>

                     <el-dialog :title="generateInsSettingLang('confirmDelete')"
                    :visible.sync="showDeleteGroup" v-if="showDeleteGroup"
                    :append-to-body='true'
                    :close-on-click-modal="false"
                    width="28%"
                    top="35vh"
                    left="40vh">
                        <div  style="overflow:hidden;">
                            <hr style="border: 0.5px solid #dfe2e9;"/>

                            <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                                <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803; display: inline-block; vertical-align: middle;"></i>
                                <span style="display: inline-block; vertical-align: middle;">{{generateInsSettingLang('deleteGroup')}}</span>
                            </p>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button class="file-cancel-btn" @click="showDeleteGroup = false" size="mini" style="">{{generateInsSettingLang('cancel')}}</el-button>
                            <el-button class="file-confirm-btn" @click="confirmDeleteGroup" size="mini" type="primary">{{generateInsSettingLang('confirm')}}</el-button>
                        </div>
                    </el-dialog>
                    <div class="nape-items-data" v-if="showAddNape"  :class="'active-color'">
                       <div class="nape-name-data" :style="activeSheetName=='1'?'flex:2;':(activeSheetName=='2'?'flex:3;':'flex:2;')">
                            <el-checkbox v-model="newNapeChecked" class="item-checkbox"></el-checkbox>
                            <el-input size="mini" v-model="newNapeName" class="nape-input" :placeholder="generateInsSettingLang('enterItemName')" @input="(val)=>napeNameChange(val, {})" @blur="notShowInputRuleTips('enterListName')"></el-input>
                            <span class="rules" v-if="enterListNameRuletip">{{generateInsSettingLang('enterListNameRuletip')}}</span>
                       </div>
                       <div class="nape-dep-data" :style="activeSheetName=='1'?'flex:2.7;':(activeSheetName=='2'?'flex:4;':'flex:3;margin-right:40px;')">
                           <el-input type="textarea"  resize='none' :autosize="{ minRows: 1}" size="mini" v-model="newNapeDep" class="nape-input" :placeholder="generateInsSettingLang('description')" @input="(val)=>napeDepChange(val, {})" @blur="notShowInputRuleTips('description')"></el-input>
                           <span class="rules" v-if="descriptionRuletip">{{generateInsSettingLang('descriptionRuletip')}}</span>
                       </div>
                       <div class="nape-scores-handle" v-if="activeSheetName=='1'" style="flex:1;">
                           <el-select size="mini" class="FullScore-input" v-model="newScore" @change="selectFullScore">
                                <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                       </div>
                       <div class="nape-scores-handle" v-if="activeSheetName=='1'" style="flex:1;">
                           <el-select size="mini" class="critical-input" v-model="newCritical">
                                <el-option v-for="item in ScoreList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                       </div>
                       <div class="nape-scores-handle" v-if="activeSheetName=='2'" style="flex:2;">
                           <el-input size="mini" class="Itemscores-input" v-model="newAddScore" @input="inputChange"></el-input>
                       </div>
                       <div class="iconcontent" style="flex:1;">
                            <div class="iconlised" style="background-color:#f31d65" @click="confirmaddNape">
                                <i class="el-icon-check"></i>
                            </div>
                            <div class="iconrised" @click="cancelAddNape">
                                <i class="el-icon-close"></i>
                            </div>
                        </div>
                   </div>
               </div>
               </el-scrollbar>
           </div>
       </el-col>
    </el-row>
</template>

<script>
import api from '@/api/index'
import util from '@/common/util'
import {validateInput} from '@/common/validate'
import {inpectRESTful,titleRESTful} from '@/api/index'
import PubSub from 'pubsub-js'
import {generateInsSettingLang} from '@/api/i18n'
import filterString from '@/common/filterString'
import RegionMultiSelect from "@/components/RegionMultiSelect";
export default {
    name:'AddRuteInspect',
    components:{
        RegionMultiSelect
    },
    data(){
        return{
            newScore:10,
            newCritical:1,
            newAddScore:0,
            firstLoad:true,
            groupTitle: this.$t('insSettingView.category'),
            showFailInfo:false,
            tabName:'',
            ModelPost:[],
            ModelAddPost:[],
            groupList:[],
            activeSheetName:'',
            groupNameTemp:'',  //临时存放
            groupNameInput:'',
            napeTitle:'',
            showEditTab:false,
            napeList:[],
            napeDepTemp:'', //临时存放
            showAddGroup:false,
            enterNameRuletip:false,
            enterListNameRuletip:false,
            descriptionRuletip:false,
            showAddNape:false,
            newNapeChecked:false,
            newNapeName:'',
            newNapeDep:'',
            groupIndex:0,   //当前选择的类别索引.
            curGroup:'',     //当前点击的类别实体
            showDeleteItem:false,
            showDeleteGroup:false,
            deleteItemFlag:'',
            curItemId:'',
            varyWindowHeight:window.innerHeight,
            varyWindowWidth:window.innerWidth,
            bindStoreList:[],
            lang: this.$i18n.locale,
            // tabNameLang: this.$route.params.tabNameLang,
            routeName:this.$route.params.routeName,
            routeData:this.$route.params.routeData,
            showLengthNameWarning:false,
            editRouteName:'',
            titleList: [],
            tableData:[],
            noData:'',
            groupIds:[],
            ScoreList:[1,2,3,4,5,6,7,8,9,10],
            Score_1:'',
            Score_2:'',
            Score_3:'',
            sheetName:[
                {id:'0',label:this.$t('insSettingView.sheetpassfail')},
                {id:'1',label:this.$t('insSettingView.sheetscore')},
                {id:'2',label:this.$t('insSettingView.sheetother')}
            ],
            allRoutedata:[],
            typeTemp:[]
        }
    },
    computed:{
        varyDivHeight:function(){
            if(this.varyWindowHeight>800){
                return this.varyWindowHeight*0.72;
            }
            else if(this.varyWindowHeight>700){
                return this.varyWindowHeight*0.67;
            }
            else{
                return this.varyWindowHeight*0.65;
            }
        }
    },
    methods:{
        generateInsSettingLang,
        getTitleList(){
          let self = this;
          self.tableData = [];
          self.getUserTitleList().then((res)=>{
            console.log(res);
            res.data.forEach(item=>{
              let roleId = item.roleId;

            })
            self.tableData = res.data;
            if(self.tableData.length == 0){
              self.noData = self.$t('deviceView.noData')
            }
            let listArray = [];
            self.tableData.forEach(item=>{
              listArray.push({
                  label:item.title,
                  value:item.id,
                  disabled:false
              })
            })
            self.titleList = listArray;
            console.log(self.titleList);
          })
            .catch(err=>{
              console.log(err)
            })
        },
        getUserTitleList(){
          return new Promise((resolve, reject) => {
            titleRESTful.getUserTitleList().then(res=>{
              resolve(res)
            })
          })
        },
        editTabName(){
            let self=this;
            self.showEditTab=true;
            self.editRouteName = self.routeName
        },
        RouteNameLength(val){
            let self = this;
            let content = filterString.all(val,30);
            let length = filterString.getContentLength(val);
            console.log(content);
            self.editRouteName = content;
            if(length>30){
                self.showLengthNameWarning=true
            }else{
                self.showLengthNameWarning=false
            }
        },
        confirmEditTab(){
            let self=this;
            if(self.editRouteName==''){
                self.notify(self.$t('insSettingView.enterListName'),'warning',3000);
                return false;
            }
            let params={
                inspectId:self.routeData[0].inspectId,
                name:self.editRouteName
            }
            inpectRESTful.UpdateInspectGroupTag(params).then(res=>{
                if(res.errCode==0){
                    self.showEditTab=false
                    self.routeName=self.editRouteName
                    self.showLengthNameWarning =false
                    self.notify(self.$t('deviceView.editSuss'),'success',3000);
                    return false;
                }else{
                    self.notify(self.$t('remotePatrol.Patroltips2'),'warning',3000);
                    return false;
                }
            })
        },
        cancelEditTab(){
            let self=this;
            self.showEditTab=false;
        },
        handleSheetClick(val){
            let self = this
            self.showAddNape=false
            self.refreshData(0)
        },
        clickGroupItem(index,item){
            let self=this;
            item.isClick=true;
            self.groupIndex=index;
            self.curGroup=item;
            if(self.lang == 'en'){
              self.napeTitle= `${self.$t('insSettingView.itemsOfCate')} ${item.groupName}`;
            }
            else{
              self.napeTitle=`${item.groupName} ${self.$t('insSettingView.itemsOfCate')}`;
            }
            //self.napeTitle=`${item.groupName}类别巡检项`;
            self.showAddNape=false;
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
            self.getNapeList(index,item);
        },
        clickItem(index,item){
            let self=this;
        },
        getTagAll(params){//获取巡检表
            let self=this;
            return new Promise((resolve,reject)=>{
                inpectRESTful.GetInspectTagList(params).then(res=>{
                    let data=res.data;
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
        async submitBindTitle(){
            let self = this
            let resBindGroup=null,resUnbindGroup=null;
            let paramsBind={}
            let paramsUnbind={}
            let titleIds=[]
            if(self.ModelPost[0]=='-1'){
                titleIds=self.ModelPost.slice(1)
            }else{
                titleIds=self.ModelPost
            }      
            let postparams={
                groupIds:self.groupIds
            }
            let postBind = await self.getInspectGroupBindAll(postparams)
            console.log(postBind)
            let groupItems = []
            postBind.forEach(b_item=>{
                let obj = {
                    groupId:'',
                    titleIds:[]
                }
                obj.groupId=b_item.groupId
                b_item.userTitles.forEach(user_item=>{
                    obj.titleIds.push(user_item.titleId)
                })
                groupItems.push(obj)
            })
            let groupBindItems = []
            let bindtitleIds = []
            if(self.ModelPost[0]=='-1'){
                bindtitleIds=self.ModelPost.slice(1)
            }else{
                bindtitleIds=self.ModelPost
            }
            self.allRoutedata.forEach(a_item=>{
                a_item.forEach(g_item=>{
                    let obj = {
                        groupId:'',
                        titleIds:[]
                    }
                    obj.groupId=g_item.id
                    obj.titleIds=bindtitleIds
                    groupBindItems.push(obj)
                })
            })
            // 解绑职务参数
            paramsUnbind={
                groupItems:groupItems
            }
            // 绑定职务参数
            paramsBind={
                groupItems:groupBindItems
            }
            if(postBind[0].userTitles.length!=0){
                resUnbindGroup = await self.unbindGroup(paramsUnbind)
                if(resUnbindGroup.errMsg=='Success'&&bindtitleIds.length!=0){
                    resBindGroup=await self.bindGroup(paramsBind);
                }else if(resUnbindGroup.errMsg=='Success'&&titleIds.length==0){
                    self.notify(self.$t('deviceView.editSuss'),'success',3000);
                    self.refreshData(self.groupIndex);
                    return false;
                }
            }else{
                if(bindtitleIds.length!=0){
                    resBindGroup=await self.bindGroup(paramsBind);
                }else if(bindtitleIds.length==0){
                    self.notify(self.$t('deviceView.editFail'),'warning',3000);
                    return false;
                }
            }
            if(resBindGroup.errMsg=='Success'){
                self.notify(self.$t('deviceView.editSuss'),'success',3000);
                self.refreshData(self.groupIndex);
            }else{
                self.notify(self.$t('deviceView.editFail'),'warning',3000);
                return false;
            }
        },
        async confirmEditGroup(index,item){
            let self=this;
            let temp=[];
            if(item.groupName==null||item.groupName.length==0){
                self.notify(self.$t('insSettingView.titleEmpty'),'warning',3000);
                return false;
            }
            // if(validateInput(item.groupName)){
            //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
            //     return false;
            // }
            let obj={
                id:item.id,
                name:item.groupName,
                tag:self.tabName
            }
            temp.push(obj);
            let params={
                "groups":temp
            };
            let resUpdateGroup=null
            resUpdateGroup = await self.updateGroup(params)
            if(resUpdateGroup.errMsg=='Success'){
                self.notify(self.$t('deviceView.editSuss'),'success',3000);
                item.isEdit=false;
                self.refreshData(self.groupIndex);
            }else{
                self.notify(self.$t('deviceView.editFail'),'warning',3000);
                return false;
            }
        },
        updateGroup(params){
          return new Promise((resolve,reject)=>{
            inpectRESTful.updateInspectGroup(params).then(res=>{
              console.log(res);
              resolve(res);
            })
          })
        },
        unbindGroup(params){
          return new Promise((resolve,reject)=>{
            inpectRESTful.UnbindInspectGroupAndTitle(params).then(res=>{
              console.log(res);
              resolve(res);
            })
          })
        },
        bindGroup(params){
          return new Promise((resolve,reject)=>{
            inpectRESTful.BindInspectGroup(params).then(res=>{
              console.log(res);
              resolve(res);
            })
          })
        },
        cancelEditGroup(index,item){
            let self=this;
            item.isEdit=false;
            item.groupName=self.groupNameTemp;
        },
        /**
         * Add group functions
         */
        addGroup(){
            let self=this;
            if(self.typeTemp.length==1&&self.typeTemp[0]==0&&self.activeSheetName=='2'){
                self.notify(self.$t('insSettingView.notAllowAdd'),'warning',3000);
                return false;
            }
            self.showAddGroup=true;
            self.groupNameInput='';
            self.groupList.forEach(item=>{
                item.isEdit=false;
            })
        },
        changeSelect(val){
            let self = this;
            self.ModelPost = Array.from(val)[0]; // 选中的职务
        },
        changeAddSelect(val){
            let self = this;
            self.ModelAddPost = Array.from(val)[0]; // 选中的职务
        },
        async confirmAddGroup(){
            let self=this;
            let temp=[];
            if(self.groupNameInput.trim().length==0){
                self.notify(self.$t('insSettingView.titleEmpty'),'warning',3000);
                return false;
            }
            // if(validateInput(self.groupNameInput)){
            //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
            //     return false;
            // }
            let mode=0;
            let tabIndex=sessionStorage.getItem('TabIndex');
            mode= tabIndex=='0' ? 0 : (tabIndex=='1' ? 1 : 0)
            let obj={
                name:self.groupNameInput,
                mode:mode,
                tag:self.tabName,
                type:Number(self.activeSheetName)
            }
            temp.push(obj);
            let params={
                "groups":temp
            };
            inpectRESTful.addInspectGroup(params).then(res=>{
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    let obj={
                        id:res.data[0],
                        groupName:self.groupNameInput,
                        groupNum:0,
                        isClick:false,
                        showEdit:false,
                        isEdit:false,
                        itemData:[]
                    };
                    self.groupList.push(obj);
                    // 绑定职务参数
                    let titleIds = []
                    if(self.ModelPost[0]=='-1'){
                        titleIds=self.ModelPost.slice(1)
                    }else{
                        titleIds=self.ModelPost
                    }
                    if(titleIds.length!=0){
                        let paramsBind={
                            groupItems:[{
                                groupId:res.data[0],
                                titleIds:titleIds
                            }]
                        }
                        self.bindGroup(paramsBind);
                    }
                    self.groupNameInput='';
                    self.showAddGroup=false;
                    self.refreshData(self.groupList.length-1);
                    self.notify(self.$t('insSettingView.addSuss'),'success',3000);
                    // setTimeout(function(){
                    //     PubSub.publish('change-color',{showTag:true});
                    // },1000)

                }
                else{
                    self.notify(self.$t('insSettingView.addFail'),'warning',3000);
                    return false;
                }
            })
        },
        cancelAddGroup(){
            let self=this;
            self.showAddGroup=false;
        },

        getEditGroup(index,item){
            let self=this;
            item.showEdit=true;

            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.showEdit=false;
                }
            })
        },
        editGroup(index,item){
            let self=this;
            item.isEdit=true;
            item.showEdit=false;
            self.groupNameTemp=item.groupName;
            self.groupList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isEdit=false;
                }
            })
        },
        deleteItemData(idArr){
            let self=this;
            let params={"itemIds":idArr};
            return new Promise((resolve,reject)=>{
                inpectRESTful.deleteInspectItem(params).then(res=>{
                    let errMsg=res.errMsg;
                    console.log(errMsg);
                    resolve(errMsg);
                })
            })
        },
        deleteGroupData(idArr){
            let self=this;
            let params={"groupIds":idArr};
            return new Promise((resolve,reject)=>{
                inpectRESTful.deleteInspectGroup(params).then(res=>{
                    let errMsg=res.errMsg;
                    console.log(errMsg);
                    resolve(errMsg);
                })
            })
        },
        deleteGroup(index,item){
            let self=this
            if(self.groupList.length==1){
                if((self.typeTemp.length==2&&!self.typeTemp.some(x=>x==0)||self.typeTemp.length==3)&&item.type==1){
                    self.showFailInfo=true
                    return false;
                }
            }
            self.showDeleteGroup=true;
            self.curGroup=item;
            
        },
        async confirmDeleteGroup(){
            let self=this;
            let idGroupArr=[];
            let idItemArr=[];
            idGroupArr.push(self.curGroup.id);
            self.curGroup.itemData.forEach(item=>{
                idItemArr.push(item.id);
            })
            self.showDeleteGroup=false;
            if(idItemArr.length==0){   //当前分组下无巡检项
                let errMsg= await self.deleteGroupData(idGroupArr);
                if(errMsg!=undefined&&errMsg=='Success'){
                    self.notify(self.$t('insSettingView.deleteSuss'),'success',3000);
                    if(self.groupList.length==1){
                        self.groupList=[];
                        self.napeList=[];
                        self.napeTitle='';
                    }
                    else{
                        console.log(self.groupIndex);
                        self.refreshData(self.groupIndex==0?self.groupIndex:self.groupIndex-1);
                    }

                }
            }
            else{
                let errMsgItem=await self.deleteItemData(idItemArr);
                if(errMsgItem!=undefined&&errMsgItem=='Success'){
                    let errMsgGroup=await self.deleteGroupData(idGroupArr);
                    if(errMsgGroup!=undefined&&errMsgGroup=='Success'){
                        self.notify(self.$t('insSettingView.deleteSuss'),'success',3000);
                        //刷新页面
                        if(self.groupList.length==1){
                            self.groupList=[];
                            self.napeList=[];
                            self.napeTitle='';
                        }
                        else{
                            console.log(self.groupIndex);
                            self.refreshData(self.groupIndex==0?self.groupIndex:self.groupIndex-1);
                        }
                    }
                    else{
                        self.notify(self.$t('insSettingView.deleteFail'),'warning',3000);
                        return false;
                    }
                }
                else{
                    self.notify(self.$t('insSettingView.deleteFail'),'warning',3000);
                    return false;
                }
            }
            if(self.typeTemp.length==1&&self.groupList.length==0){
                self.$router.push({name:"inspectSetting",params:{val:'del'}});
            }
        },
        addNape(){
            let self=this;
            self.showAddNape=!self.showAddNape;
            self.napeList.forEach((_item,_index)=>{
                _item.isClick=false;
            })
            self.newScore=10
            self.newCritical=1
            self.ScoreList=[1,2,3,4,5,6,7,8,9,10]
        },
        deleteNape(item){
            let self=this;
            let count=0;
            self.napeList.forEach(item=>{
                if(item.checked){
                    count++;
                }
            })
            if(count==0){
                self.notify(self.$t('insSettingView.selectItems'),'warning',3000);
                return false;
            }
            if(count==self.napeList.length&&self.groupList.length==1){
                if((self.typeTemp.length==2&&!self.typeTemp.some(x=>x==0)||self.typeTemp.length==3)&&self.groupList[0].type==1){
                    self.showFailInfo=true
                    return false;
                }
            }
            self.showDeleteItem=true;
            self.deleteItemFlag='G';
        },
        async confirmDeleteItem(){
            let self=this;
            let idArr=[];
            switch(self.deleteItemFlag){
                case 'S': idArr.push(self.curItemId);break;
                case 'G':
                self.napeList.forEach(item=>{
                    if(item.checked){
                        idArr.push(item.id);
                    }
                });break;
                deafult:
                console.log("error Flag!");break;
            }
            let errMsg=await self.deleteItemData(idArr);
            if(errMsg!=undefined&&errMsg=='Success'){
                self.notify(self.$t('insSettingView.deleteSuss'),'success',3000);
                self.showDeleteItem=false;
                //刷新页面,删除页面上在后台已经删除的数据
                self.refreshData(self.groupIndex);
                self.groupList[self.groupIndex].groupNum-=idArr.length;
            }
            else{
                self.notify(self.$t('insSettingView.deleteFail'),'warning',3000);
                return false;
            }
        },
        confirmeditNape(index,item){
            let self=this;
            let temp=[];
            if(item.napeName.trim().length==0){
                self.notify(self.$t('insSettingView.titleEmpty'),'warning',3000);
                return false;
            }
            // if(validateInput(item.napeName)||validateInput(item.napeDep)){
            //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
            //     return false;
            // }
            let itemScore=0,qualifiedScore=0
            if(self.activeSheetName=='0'){
                itemScore=10
                qualifiedScore=null
            }else if(self.activeSheetName=='1'){
                itemScore=item.Score_1
                qualifiedScore=item.Score_2
            }else if(self.activeSheetName=='2'){
                itemScore=item.Score_3
                qualifiedScore=null
            }
            let obj={
                id:item.id,
                subject:item.napeName,
                description:item.napeDep,
                itemScore:itemScore,
                qualifiedScore:qualifiedScore
            }
            temp.push(obj);
            let params={
                "items":temp
            };
            inpectRESTful.updateInspectItem(params).then(res=>{
                console.log(res);
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    self.notify(self.$t('deviceView.editSuss'),'success',3000);
                    item.isClick=false;
                    self.refreshData(self.groupIndex);
                }
                else{
                    self.notify(self.$t('deviceView.editFail'),'warning',3000);
                    return false;
                }
            })
        },
        cancelEditNape(index,item){
            let self=this;
            item.isClick=false;
            item.napeDep=self.napeDepTemp;
            item.napeName=item.napeNameShow.slice(item.napeNameShow.indexOf('，')+1);
        },
        confirmaddNape(){
            let self=this;
            let temp=[];
            if(self.newNapeName.trim().length==0){
                self.notify(self.$t('insSettingView.titleEmpty'),'warning',3000);
                return false;
            }
            if(self.newAddScore!=0){
                if(self.newAddScore.trim().length==0){
                    self.notify(self.$t('insSettingView.ScoreEmpty'),'warning',3000);
                    return false;
                }
            }
            // if(validateInput(self.newNapeName)||validateInput(self.newNapeDep)){
            //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
            //     return false;
            // }
            let itemScore=0,qualifiedScore=0
            if(self.activeSheetName=='0'){
                itemScore=10
                qualifiedScore=null
            }else if(self.activeSheetName=='1'){
                if(self.newCritical>self.newScore){
                    self.notify(self.$t('insSettingView.excelMinScoreType'),'warning',3000);
                    return false;
                }else{
                    itemScore=self.newScore
                    qualifiedScore=self.newCritical
                }
            }else if(self.activeSheetName=='2'){
                if(self.newAddScore>100||self.newAddScore<-100){
                    self.notify(self.$t('insSettingView.sheetscore2'),'warning',3000);
                    return false;
                }else{
                    itemScore=self.newAddScore
                    qualifiedScore=null
                }
            }
            let objItem={
                subject:self.newNapeName.trim(),
                description:self.newNapeDep.trim(),
                itemScore:itemScore,
                qualifiedScore:qualifiedScore
            };
            temp.push(objItem);
            let obj={
                groupId:self.curGroup.id,
                items:temp
            };
            let tempParam=[];
            tempParam.push(obj);
            let params={
                "request":tempParam
            };
            inpectRESTful.addInspectItem(params).then((res)=>{
                let codeMsg=res.errMsg;
                if(codeMsg!=undefined&&codeMsg=='Success'){
                    let obj={
                        napeName:self.newNapeName,
                        napeNameShow:`${self.napeList.length+1}，${self.newNapeName}`,
                        napeDep:self.newNapeDep,
                        Score_1:self.newScore,
                        Score_2:self.newCritical,
                        Score_3:self.newAddScore,
                        // Score_1:self.newScore + (self.lang!='en'?self.$t('remotePatrol.scorecount'):''),
                        // Score_2:self.newCritical + (self.lang!='en'?self.$t('remotePatrol.scorecount'):''),
                        // Score_3:self.newAddScore + (self.lang!='en'?self.$t('remotePatrol.scorecount'):''),
                        isClick:false,
                        checked:false
                    };
                    self.napeList.push(obj);
                    self.newNapeName='';
                    self.newNapeDep='';
                    self.newAddScore='';
                    self.showAddNape=false;
                    self.refreshData(self.groupIndex);
                    self.groupList[self.groupIndex].groupNum++;
                    let data=res.data;
                    let storeList=self.bindStoreList;
                    let tempParams=[];
                    storeList.forEach(item=>{
                        let obj={
                            storeId:item,
                            itemIds:data,
                        }
                        tempParams.push(obj);
                    })
                    let paramsApply={
                        storeList:tempParams
                    };
                    inpectRESTful.applyItemInspectItem(paramsApply).then(resApply=>{
                        let res=resApply;
                        console.log(res);
                    })
                    self.notify(self.$t('insSettingView.addSuss'),'success',3000);
                    setTimeout(function(){
                        console.log(self.tabName);
                        if(self.tabName=='远程巡检'){
                            PubSub.publish('change-color',{showTag:true});
                        }
                    },1000)
                }
                else{
                    self.notify(self.$t('insSettingView.addFail'),'warning',3000);
                    return false;
                }
            })
        },
        cancelAddNape(){
            this.showAddNape=false;
        },
        handleEdit(index,item){
            let self=this;
            self.napeDepTemp=item.napeDep;
            item.isClick=true;
            self.showAddNape=false;
            let arr=[1,2,3,4,5,6,7,8,9,10]
            self.ScoreList=arr.slice(0,item.Score_2)
            //item.napeName=item.napeNameShow.slice(indexOf(',')+1);
            self.napeList.forEach((_item,_index)=>{
                if(index!=_index){
                    _item.isClick=false;
                }
            })
        },
        handleDelete(index,item){
            console.log(index);
            let self=this;
            if(self.napeList.length==1&&self.groupList.length==1){
                if((self.typeTemp.length==2&&!self.typeTemp.some(x=>x==0)||self.typeTemp.length==3)&&self.groupList[0].type==1){
                    self.showFailInfo=true
                    return false;
                }
            }
            self.showDeleteItem=true;
            self.deleteItemFlag='S';
            self.curItemId=item.id;
        },

        getAllData(){
            let self=this;
            return new Promise((resolve,reject)=>{
                let params={
                    inspectId:self.routeData[0].inspectId
                }
                inpectRESTful.getInspectItemList(params).then(res=>{
                    console.log(res);
                    let code=res.errMsg;
                    let data=res.data;
                    if(code!=null&&code=='Success'){
                        console.log(res.data);
                    }
                    resolve(data);
                })
            })
        },
        getPersonData(){
            return new Promise((resolve,reject)=>{
                inpectRESTful.GetInspectTagList().then(res=>{
                    resolve(data);
                })
            })
        },
        getBindStoreList(){
            let self=this;
            let inspectId=self.routeData[0].inspectId;
            let params={inspectId :inspectId };
            inpectRESTful.getInspectBindList(params).then(res=>{
                console.log(res.errMsg);
                if(res.errMsg!=undefined&&res.errMsg=='Success'){
                    let data=res.data;
                    self.bindStoreList=data;
                }
            })
        },
        async refreshData(index){
            let self=this;
            let asds=self.routeData
            let curTag=self.tabName;
            let allData=await self.getAllData();
            // let personData=await self.getPersonData()
            let data=util.getRouteByTag(curTag,allData);
            console.log(data);
            let temp=[];
            let groupIds=[];
            data.forEach(item=>{
                let obj={};
                obj.id=item.id;
                obj.groupName=item.name;
                obj.groupNum=item.items.length;
                obj.isClick=false;
                obj.showEdit=false;
                obj.isEdit=false;
                obj.itemData=item.items;
                obj.type=item.type
                temp.push(obj);
                groupIds.push(item.id)
            })
            self.groupIds = groupIds
            let postparams={
                groupIds:self.groupIds
            }
            let postBind = await self.getInspectGroupBindAll(postparams)
            let titleList=await self.getUserTitleList()
            temp.forEach((t_item,t_index)=>{
                let usertemp=[]
                let usertext=[]
                postBind.forEach(p_item=>{
                    if(t_item.id==p_item.groupId){
                       if(p_item.userTitles.length!=0){
                           p_item.userTitles.forEach(u_item=>{
                               if(titleList.data.length==p_item.userTitles.length){
                                    t_item['textModel']=self.$t('reportView.all')
                               }else{
                                    usertext.push(u_item.titleName)
                                    t_item['textModel']=usertext.toString()
                               }
                               usertemp.push(u_item.titleId)
                               t_item['ModelPost']=usertemp
                           })
                       }else{
                          t_item['ModelPost']=[]
                          t_item['textModel']=''
                       }
                    }
                })
            })
            if(self.ModelPost.length==0){
                self.ModelPost = temp[0].ModelPost
            }
            let te_temp=[]
            let type_temp=[]
            let sheetTemp=[]
            let obj={ passfail:[], score:[],other:[]}
            for(let i=0;i<3;i++){
                let Typeindex=temp.filter(x=>x.type==i);
                if(Typeindex.length!=0){
                    te_temp.push(Typeindex)
                    type_temp.push(Typeindex[0].type)
                        if(Typeindex[0].type==0){
                            obj.passfail=Typeindex
                        }
                        if(Typeindex[0].type==1){
                            obj.score=Typeindex
                        }
                        if(Typeindex[0].type==2){
                            obj.other=Typeindex
                        }
                }
            }
            sheetTemp=obj
            self.activeSheetName = self.firstLoad ? te_temp[0][0].type.toString() : self.activeSheetName
            self.firstLoad=false
            self.allRoutedata=te_temp
            self.typeTemp=type_temp
            self.groupList = self.activeSheetName=='0' ? sheetTemp.passfail : (self.activeSheetName=='1' ? sheetTemp.score : sheetTemp.other)
            if(self.groupList.length!=0){
                self.groupList[index].isClick=true;
                self.curGroup=self.groupList[index];
                self.groupIndex=index;
                if(self.lang == 'en'){
                    self.napeTitle= `${self.$t('insSettingView.itemsOfCate')} ${self.groupList[index].groupName}`;
                }
                else{
                    self.napeTitle=`${self.groupList[index].groupName} ${self.$t('insSettingView.itemsOfCate')}`;
                }
                self.getNapeList(index,self.groupList[index]);
            }else{
                self.napeList=[]
                if(self.lang == 'en'){
                    self.napeTitle= `${self.$t('insSettingView.itemsOfCate')}`;
                }
                else{
                    self.napeTitle=`${self.$t('insSettingView.itemsOfCate')}`;
                }
            }
        },
        getNapeList(index,item){
            console.log(index);
            let self=this;
            let temp=[];
            item.itemData.forEach((_item,index)=>{
                let obj={
                    id:_item.id,
                    napeName:_item.subject,
                    napeNameShow:`${index+1}，${_item.subject}`,
                    napeDep:_item.description,
                    Score_1:_item.itemScore,
                    Score_2:_item.qualifiedScore,
                    Score_3:_item.itemScore,
                    isClick:false,
                    checked: false
                }
                temp.push(obj);
            })
            self.napeList=temp;
        },

        initData(){
            let self=this;
            self.tabName=sessionStorage.getItem('GroupName');
            self.refreshData(0);
            self.getBindStoreList();
        },
        notify(msg,type,time) {
            this.$message({
                message: msg,
                type: type,
                duration:time
            });
        },
        groupNameChange(val, item){
          let self = this;
          let comment = filterString.all(val,30);
          let length = filterString.getContentLength(val);
          console.log(comment,length);
          if(0 == Object.keys(item).length){
            self.groupNameInput = comment;
          }
          else{
            item.groupName = comment;
          }
          if(length>30){
              this.enterNameRuletip=true
          }else{
              this.enterNameRuletip=false
          }
        },
        inputChange(val){
            let self=this
            if(val.indexOf('-')!=-1){
                self.newAddScore = '-'+val.replace(/[^\d]/g, '')
            }else{
                self.newAddScore = val.replace(/[^\d]/g, '')
            }
        },
        selectFullScore(val){
            let self = this
            let arr=[1,2,3,4,5,6,7,8,9,10]
            self.ScoreList = arr.slice(0,val)
        },
        napeNameChange(val, item){
          let self = this;
          let comment = filterString.all(val,100);
          let length = filterString.getContentLength(val);
          console.log(comment,length);
          if(0 == Object.keys(item).length){
            self.newNapeName = comment;
          }
          else{
            item.napeName = comment;
          }
          if(length>100){
              this.enterListNameRuletip=true
          }else{
              this.enterListNameRuletip=false
          }
        },
        napeDepChange(val, item){
          let self = this;
          let comment = filterString.all(val,1200);
          let length = filterString.getContentLength(val);
          console.log(comment,length);
          if(0 == Object.keys(item).length){
            self.newNapeDep = comment;
          }
          else{
            item.napeDep = comment;
          }
          if(length>1200){
              this.descriptionRuletip=true
          }else{
              this.descriptionRuletip=false
          }
        },
        notShowInputRuleTips(e){
            if(e=='enterName'){
                this.enterNameRuletip=false
            }else if(e=='enterListName'){
                this.enterListNameRuletip=false
            }else if(e=='description'){
                this.descriptionRuletip=false
            }
        },
    },
    mounted(){
        let self=this;
        self.initData();
        self.getTitleList()
    },
    beforeRouteLeave (to, from, next) {
        console.log(to.path);
        next();
        if(to.path=='/storemanage'){
            PubSub.publish('change-color',{showTag:false});
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
@import '../../../assets/css/textstyle.css';
    $red:#f31d65;
    $black:#182752;
    $border:#e3e9f4;
    $background:#f4f5f9;
    $tab:#7d8cad;
    $h1:#292e36;
    $itemHeight:50px;
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
    .nape-input{
        // @include point(width,180);
        float: left;
        @include point(margin-left,10);
    }
    #el-menuscrollbar /deep/ .el-scrollbar__thumb{
        width:0 !important;
    }
    .el-addrute{
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 125px - 60/1920*100vw);
        color: $black;
        border: 1px solid $border;
        background-color: #fff;
        font-size: calc(18/1920*100vw);
        @media screen and (min-width:1366px){
            .tab-name{
                font-size: 18px;
            }
            .icon-tabname{
                font-size:18px;
            }
            .iconlised{
                @include point(height,20);
                @include point(line-height,20);
            }
            .iconrised{
                @include point(height,20);
                @include point(line-height,20);
            }
        }
        @media screen and (max-width:1366px){
            .tab-name{
              font-size: calc(18/1920*100vw);
            }
            .icon-tabname{
              font-size: calc(18/1920*100vw);
            }
            .iconlised{
                height: 20px;
                line-height: 20px;
            }
            .iconrised{
                height: 20px;
                line-height: 20px;
            }
        }
        @mixin iconContent{
            float: left;
            position: relative;
            padding: 1px 6px;
            border: 1px solid $border;
            cursor: pointer;

        }
        .el-rute-post{
            height:68px;
            line-height: 68px;
            padding:0 calc(20/1920*100vw);
            border-bottom: 1px solid $border;
            .post-left{
                float:left;
                .iconfont{
                    font-size: calc(16/1920*100vw);
                    margin-right: 10px;
                }
                span{
                    font-size: calc(16/1920*100vw);
                    color:#424151;
                    font-weight: bold;
                    margin-right: calc(20/1920*100vw);
                }
            }
            .post-right{
                float:right;
            }
        }
        .el-rute-title{
            width: 100%;
            @include point(height,60);
            @include point(line-height,60);
            height: 80px;
            line-height: 80px;
            padding-left: calc(20/1920*100vw);
            border-bottom: 1px solid $border;
            text-align: left;
            position: relative;
            .tab-name{
                text-align: left ;
                margin-left:calc(15/1920*100vw);
                font-weight: bold;
            }
            .icon-tabname{
                margin-left:calc(25/1920*100vw);
                color: #ddd;
                cursor: pointer;
            }
            .tabName-input{
                @include point(width,180);
                float: left;
                @include point(margin-left,5);
            }
            .warningtips{
                font-size:12px;
                color:red;
                margin:5px 0 0 0;
                position: absolute;
                top:22px;
                left:calc(30/1920*100vw);
            }
        }
        .rute-btn{
            //background-color: $red;
            border-color: $red;
            color: #fff;
            font-size: 12px;
        }
        .en-rute-btn{
          //background-color: $red;
          border-color: $red;
          color: #fff;
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          line-height: calc(36/1920*100vw);
          padding: 0 0;
          width: calc(130/1920*100vw);
          .el-icon-plus{
            font-size:calc(24/1920*100vw);
          }
          .icon-shanchu{
            font-size:calc(24/1920*100vw);
          }
        }
        .iconcontent{
            @include point(margin-left,20);
            @include point(margin-top,18);
            display: inline-block;
            .iconlised{
                @include iconContent;
                background-color: $red;
                color: #fff;
            }
            .iconrised{
                background-color: #fff;
                @include iconContent;
                border-left:0;
            }
        }
        .title-content{
            height: 60px;
            line-height: 60px;
            text-align: left;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid $border;
            .level2{
            //   margin-left: calc(15/1920*100vw);
              .iconfont{
                font-size: 16px;
              }
              .level2-name{
                font-size: 16px;
                margin-left: 0;
                @media screen and (max-width:1440px){
                    font-size: calc(16/1920*100vw);
                }
              }
            }
            .item-title{
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
                word-wrap: break-word;
                width: 60%;
                cursor: pointer;
            }
            .en-item-title {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              display: inline-block;
              word-wrap: break-word;
              cursor: pointer;
              @media screen and (max-width: 1366px) {
                width: 50%;
              }
              @media screen and (min-width: 1366px) {
                width: 60%;
              }
            }
            .icontitle{
                margin-right: calc(15/1920*100vw);
                font-weight: normal;
                font-size: calc(20/1920*100vw);
                margin-left: calc(20/1920*100vw);
            }
            .btn-content{
                width: auto;
                height: auto;
                float: right;
                margin-right: calc(20/1920*100vw);
            }
        }
        .el-rute-group{
            height: auto;
            min-height:calc(100% - 60px);
            min-height: -webkit-calc(100% - 60px);
            min-height: -moz-calc(100% - 60px);
            background-color: #FAFAFA;
            .group-items{
                font-size: 14px;
                .top-group-title{
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    font-size: 14px;
                    color: $tab;
                    .group-name-title{
                        #group-content /deep/ .el-tabs__nav-wrap{
                            margin-left: 6px;
                        }
                        #group-content /deep/ .el-tabs__active-bar{
                            height: 4px;
                        }
                        #group-content /deep/ .el-tabs__item {
                            font-weight: bold;
                            color: #94A4B4;
                            font-size: calc(14/1920*100vw);
                            width: calc(131/1920*100vw);
                            min-width:92px;
                            padding:0;
                        }
                        #group-content /deep/ .el-tabs__item.is-active{
                            color: #f31d65;
                        }
                    }
                }
                .groupItem{
                    height: 60px;
                    line-height: 60px;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid $border;
                    cursor: pointer;
                    text-align: left;
                    .proper-flag{
                        height: 70%;
                        width: 4px;
                        position:absolute;
                        top: 15%;
                        background-color: $red;
                    }
                    .group-left{
                        .group-input{
                            float: left;
                            max-width: 64%;
                            margin-left: calc(45/1920*100vw);
                        }
                        span{
                            float: left;
                            width: 70%;
                            margin-left: calc(50/1920*100vw);
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                    .group-right{
                        display: inline-block;
                        .iconcontent{
                            margin-left: calc(30/1920*100vw);
                            display: inline-block;
                            margin-top: 15px;
                            .iconlised{
                                @include iconContent;
                                background-color: $red;
                                color: #fff;
                                height: 22px;
                                line-height: 22px;
                            }
                            .iconrised{
                                background-color: #fff;
                                @include iconContent;
                                border-left:0;
                                height: 22px;
                                line-height: 22px;
                            }
                        }
                        .show-edit{
                            .nape-items-handle{
                                .iconfont{
                                font-size: calc(24/1920*100vw);
                                color: #7d8cad;
                                font-weight: 400;
                                }
                            }
                        }
                    }
                    &:last-child{
                        @include point(margin-bottom,20);
                    }
                }
            }
            .group-add{
                margin-top: 5px;
                overflow: hidden;
                text-align: left;
                height: 60px;
                line-height: 60px;
                margin-bottom: 25px;
                position: relative;
                .group-name-left{
                    .groupName-input{
                         max-width: 64%;
                        float: left;
                        margin-left: calc(45/1920*100vw);
                    }
                    .rules{
                        font-size: 10px;
                        color:#ff2400;
                        font-weight: 400;
                        line-height: 10px;
                        position: absolute;
                        top: 50px;
                        left:calc(25/1920*100vw);
                    }
                }
                .group-name-right{
                    .iconcontent{
                        margin-left:calc(30/1920*100vw);
                        float: left;
                        margin-top: 15px;
                        .iconlised{
                            @include iconContent;
                            background-color: $red;
                            color: #fff;
                            height: 22px;
                            line-height: 22px;
                        }
                        .iconrised{
                            background-color: #fff;
                            @include iconContent;
                            border-left:0;
                            height: 22px;
                            line-height: 22px;
                        }
                    }
                }
            }
        }
        .el-rute-nape{
            height: auto;
            min-height: 90%;
            .nape-name-title{
                display: inline-block;
                span{
                    position: relative;
                    left: 10%;
                }

            }
            .nape-dep-title{
                display: inline-block;
                span{
                    position: relative;
                    left: 0%;
                }
            }
            .nape-score0-title{
                display: inline-block;
            }
            .nape-score1-title{
                display: inline-block;
                min-width: 117px;
                @media screen and (max-width: 1450px){
                    line-height:20px;
                    padding-top:10px;
                }
            }
            .nape-handle-title{
                display: inline-block;
                span{
                    position: relative;
                    left: 5%;
                }
            }
            .en-nape-handle-title{
                display: inline-block;
                span{
                  position: relative;
                  left: 0%;
                }
            }
            .nape-items-title{
                height: 60px;
                line-height: 60px;
                text-align: left;
                font-size: 14px;
                color: $tab;
                display: flex;
                width: 96%;
                float: right;
            }
            .nape-items-data{
                overflow: hidden;
                position: relative;
                width: 96%;
                margin: 0 0 0 3%;
                padding-left: 1%;
                cursor: pointer;
                font-size: 14px;
                color: #424151;
                height:auto;
                display: flex;
                //@include point(min-height,50);
                min-height: 60px;
                &:last-child{
                    @include point(margin-bottom,15);
                }
                .nape-name-data{
                    position: relative;
                    float: left;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    .item-checkbox{
                        float: left;
                        margin-right: 0px;
                    }
                    .nape-input{
                        width:calc(220/1920*100vw);
                        min-width:136px;
                        float: left;
                        @include point(margin-left,10);
                        @include point(margin-bottom,3);
                    }
                    span{
                        float: left;
                        @include point(margin-left,15);
                        text-align: left;
                        width: 80%;
                    }
                    // .inputcontent{
                    //     width:90%;
                        .rules{
                            font-size: 10px;
                            color:#ff2400;
                            font-weight: 400;
                            line-height: 12px;
                            margin-left:25px;
                        }
                    // }
                }
                .nape-dep-data{
                    height: 100%;
                    position: relative;
                    float: left;
                    overflow: hidden;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    span{
                        float: left;
                        text-align: left;
                    }
                    .nape-input{
                        width:calc(250/1920*100vw);
                        min-width:215px;
                        float: left;
                        @include point(margin-left,10);
                        @include point(margin-bottom,3);
                    }
                    // .inputcontent{
                    //     float: left;
                        .rules{
                            font-size: 10px;
                            color:#ff2400;
                            font-weight: 400;
                            line-height: 10px;
                            margin-left:10px;
                        }
                    // }
                }
                .nape-scores-handle{
                    height: 100%;
                    position: relative;
                    float: left;
                    overflow: hidden;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    span{
                        float: left;
                        text-align: left;
                    }
                    .FullScore-input /deep/ .el-input{
                        width:68px;
                        margin: 0 auto;
                    }
                    .critical-input /deep/ .el-input{
                        width:68px;
                        margin: 0 auto;
                    }
                    .Itemscores-input{
                        width:68px;
                        margin: 0 auto;
                    }
                }
                .nape-items-handle{
                    display: inline-block;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    text-align: left;
                    .iconfont{
                      font-size: calc(24/1920*100vw);
                      color: #7d8cad;
                    }
                }
                .iconcontent{
                    @include point(margin-left,25);
                    display: inline-block;
                    @include point(margin-top,15);
                    .iconlised{
                        @include iconContent;
                        background-color: $red;
                        color: #fff;
                        height: 22px;
                        line-height: 22px;
                    }
                    .iconrised{
                        background-color: #fff;
                        @include iconContent;
                        border-left:0;
                        height: 22px;
                        line-height: 22px;
                    }
                }
            }
        }
        .noraml-color{
            background-color: #fff;
        }
        .active-color{
            background-color: #FEE4E7;
        }
        .noraml-groupColor{
            background-color: #FAFAFA;
        }
      .btn-class{
        height: calc(36/1920*100vw);
        padding: 0;
        font-size: calc(14/1920*100vw);
        width: calc(130/1920*100vw);
        .el-icon-plus, .icon-shanchu{
          font-size: calc(16/1920*100vw);
          margin-right: calc(8/1920*100vw);
        }
        @media screen and (max-width: 1440px) {
          width: 100px;
        }
        .btn-area{
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
</style>
<style>
.el-rute-post .el-select.el-select--mini{
    width:190px !important;
    height:45px !important;
    color:#424151 !important;
}
.el-dialog__body{
    padding: 0px !important;
}
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.nape-input .el-textarea__inner{
    font-family: Roboto, Arial, 'Microsoft YaHei';
}
</style>
