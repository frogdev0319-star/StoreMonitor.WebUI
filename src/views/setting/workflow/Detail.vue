<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      {{$t('audit.workFlows.workFlowConfiguration')}}
      <div class="spacer"></div>
      <div class="buttons">
        <delay-button type="filled" @click="submitWorkFlow">  {{$t('audit.workFlows.saveAndEnable')}}</delay-button>
      </div>
    </div>
    <!-- 基本信息 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table :table-name="$t('audit.workFlows.basicInformation')">
            <template slot="tableDetail">
              <!-- row -->
              <div class="setting-config">
                <!-- 基本信息 -->
                <div class="flex-row" style="margin-right: 30px">
                  <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.workFlowName')}}</div>
                  <div class="title-status"> 
                    <el-input
                      ref="workflowName"
                      :placeholder="workflowDetail.name"
                      v-model="workflowDetail.name"
                      class="ppip"
                      style="width: 250px"
                      :disabled="noInput"
                      @input="(val) => itemInputChanged(val, 50)"
                      />
                      <span class="text_limit_notice" v-if="showInputLimit"> {{$t('remotePatrol.eventNameRuletip')}}  </span>
                  </div>

                </div>

                <!-- 分類流程 -->
                <div class="flex-row" style="margin-right: 30px">
                  <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.workFlowClassification')}}</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTemplateIndex"
                      :placeholder="$t('audit.workFlows.inspectionForm')"
                      :disabled="true"
                      >
                      <el-option
                        v-for="(item, index) in templateList"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>

                <!-- 簽核模式 -->
                <div class="flex-row" style="margin-right: 30px">
                  <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.signoffMode')}}</div>
                      <el-radio-group class="storevue-radio" v-model="workflowDetail.cancelable" >
                        <div class="flex-row" style="margin-right: 30px">
                          <el-radio :label="false">{{$t('audit.workFlows.canNotCancel')}}</el-radio>  
                            <el-tooltip
                              class="date-time-tooltip"
                              effect="light"
                              placement="bottom-end">
                              <div slot="content">
                                <div class="tip">
                                  {{$t('audit.workFlows.cantCancel')}}
                                  <ul>
                                    <li> {{$t('audit.workFlows.tooltipListcant1')}}</li>
                                    <li> {{$t('audit.workFlows.tooltipListcant2')}}</li>
                                    <li> {{$t('audit.workFlows.tooltipListcant3')}}</li>
                                    <li> {{$t('audit.workFlows.tooltipListcant4')}}</li>
                                  </ul>
                                </div>
                              </div>
                              <i class="iconfont icon-bangzhu iconbangzhu"/>
                            </el-tooltip>
                        </div>

                        <div class="flex-row">
                          <el-radio :label="true" @change="needNote">{{$t('audit.workFlows.canCancel')}}</el-radio>
                          <el-tooltip
                            class="date-time-tooltip"
                            effect="light"
                            placement="bottom-end">
                            <div slot="content">
                              <div class="tip">
                                {{$t('audit.workFlows.canCancel')}}
                                <ul>
                                    <li> {{$t('audit.workFlows.tooltipListcan1')}}</li>
                                    <li> {{$t('audit.workFlows.tooltipListcan2')}}</li>
                                    <li> {{$t('audit.workFlows.tooltipListcan3')}}</li>
                                    <li> {{$t('audit.workFlows.tooltipListcan4')}}</li>
                                </ul>
                              </div>
                            </div>
                            <i class="iconfont icon-bangzhu iconbangzhu"/>
                          </el-tooltip>
                        </div>
                      </el-radio-group>
                </div>
              </div>

              <!-- row -->
              <!-- 流程描述 -->
              <div class="setting-config" style="margin-bottom: 20px;">
                <div class="title-name">{{$t('audit.workFlows.workFlowDescription')}}</div>
                <div class="title-status"> 
                  <el-input
                    v-model="workflowDetail.description"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    :placeholder="$t('audit.workFlows.workFlowDescription')"
                    class="storevue-textarea"
                    type="textarea"
                    resize="none"
                    @input="(val) => itemTextAreaChanged(val, 600)"
                  />
                  <span class="text_limit_notice" v-if="showTextAreaLimit">  {{$t('remotePatrol.comentRuletip_suggest')}}  </span>
                </div>
              </div>
            </template>
          </setting-table>
        </div>

        <!-- 流程設定 -->
        <div class="inspect-basic">
          <!-- 新增審核節點 btn -->
          <div class="buttons add-node-btn">
            <el-button
              @click="addNode"
              class="storevue-button-outlined"
              size="mini" type="primary">
              <i class="iconfont el-icon-plus"/>
              {{$t('audit.workFlows.addNode')}}
            </el-button>
          </div>

          <setting-table :table-name="$t('audit.workFlows.workFlowSetting')">
            <template slot="tableDetail" style="padding: 30px">
                <div class="tablelist flow-setting" v-loading.fullscreen.lock="fullscreenLoading">
                  <table-only
                    ref="elTP"
                    class="table-white"
                    :column-data="columnData"
                    :table-data="newFlatNodeDataView"
                    :tableworkflowOperation ="columnOperationData"
                    :highlight-current-row= "false"
                    :is-loading-data="isLoadingData"
                    :allowRowExpand = "false"
                    :showBorder = "false"
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                    :tableHeight = "760"
                    :cellStyle="{backgroundColor: '#fff !important'}"
                    :indexType="indexType"
                    @handleMove="handleEmitMove"
                    @handleOperation="handleEmitOperation"
                  />
                </div>
            </template>
          </setting-table>

          <!-- row 新增副本通知人員 -->
          <div class="setting-config basic-config">
            <div class="title-name" style="width: fit-content">{{$t('audit.workFlows.addCC')}}</div>
            <div class="title-status" >
                <el-select
                  v-model="ccToUSer"
                  multiple
                  filterable
                  :placeholder="$t('audit.workFlows.findUser')"
                  :loading="loading" 
                  style="300px">
                  <el-option
                    v-for="user in userInfo"
                    :key="user.userId"
                    :label="user.userName"
                    :value="user.userId">
                  </el-option>
                </el-select>
            </div>
            <div class="search_member" @click="handelePopupUserList"><i class="iconfont el-icon-view iconbangzhu"/> {{$t('audit.workFlows.findUser')}}</div>  

          </div>
        </div>
      </div>
    </div>

    <!-- popup -->
    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showSingleDeleteContent"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showSingleDeleteContent')"
      @cancelHandler="hideDeleteContentDialog('showSingleDeleteContent')"
      @confirmHandler="confirmDeleteSingle(rowId)"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{$t('audit.workFlows.comfirmDeleteNode')}}</div>
      </div>
    </dialog-pop>


    <!-- search user popup -->
    <dialog-pop
      ref="dailog"
      class="popup_width"
      :title= "$t('audit.workFlows.addCC')"
      :close-on-click-modal="false"
      :show-close="false"
      :dialogWidth = "w_width"
      :visible="showingSearchUser"
      @cancelHandler="hideSearchUsersDialog('showingSearchUser')"
      @confirmHandler="confirmSearchUsersDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          <div class="showing_search_user">
            <div class="filter_section">
                <!-- 關鍵字 -->
                <div class="flex-row" style="margin-right: .5%; margin-bottom: 10px;">
                  <div class="title-name">{{$t('audit.workFlows.keywords')}}</div>
                  <div class="title-status"> 
                    <el-input
                      v-model="inputSearchUser"
                      :placeholder="$t('audit.workFlows.searchNameMail')"
                      style="width: 200px"
                      clearable
                      />
                  </div>
                </div>
                <!-- 部門 -->
                <div class="flex-row" style="margin-right: .5%; margin-bottom: 10px;">
                  <div class="title-name">  {{$t('audit.workFlows.depart')}}</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTemplateDepartment"
                      :placeholder="$t('audit.workFlows.depart')"
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in departmentAry"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- 職務 -->
                <div class="flex-row" style="margin-right: .5%; margin-bottom: 10px;">
                  <div class="title-name"> {{$t('audit.workFlows.position')}}</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTemplateTitleList"
                      :placeholder="$t('audit.workFlows.position')"
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in titleListAry"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- <div class="summit_filter" >篩選</div> -->
            </div>
            <div class="is_select">
              <div class="title-name"> {{$t('audit.workFlows.selected')}}</div>
              <div class="user_selected">
                <el-tag
                    v-for="tag in tags"
                    :key="tag.name"
                    closable
                    :type="tag.type"
                    @close="handleClose(tag)">
                    {{tag.userName}}
                  </el-tag>
              </div>
            </div>
            <div class="users">
              <table-only
                ref="usersList"
                class="table-white"
                :column-data ="userColumnData"
                :table-data ="searchUserData"
                :showSelectionColumn = showSelectionColumn
                
                :highlight-current-row = "false"
                :is-loading-data ="isLoadingData"
                :allowRowExpand = "false"
                :showBorder = "false"
                :headerStyle ="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                :cellStyle ="{backgroundColor: '#fff !important'}"
                @handleSelectionChange = "handleSelectionChange "
              />
            </div>
          </div>
        </div>
      </div>
    </dialog-pop>

  </div>
</template>
<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import {
  getNodeList, 
  updateWorkflow,   
  getWorkflowList, 
  creadNewFlow,
  getUserStatus,
  enableWorkflow,
  
  } from "@/api/workflow";
import {getUserTitleList } from "@/api/title";
import {getUserInfo} from '@/api/login';
import {getAllUserInfoNoAuth, getDepartAll} from '@/api/login';

import TableOnly from '@/components/TableOnly';
import DialogPop from '@/components/DialogPop';
import InputLimit from '@/components/InputLimit';
import util from "@/common/util";
import filterString from '@/common/filterString.js';

import { Breadcrumb } from 'element-ui';
export default {
  name: 'WorkflowDetail',
  components: {
    TableOnly,
    DelayButton,
    SettingTable,
    DialogPop,
    InputLimit
  },
  data() {
    return {
      ccToUSer: [],
    
      showSingleDeleteContent: false,
      dataFromRoute: {},
      workflowDetail: {},
      templateList: ['巡檢表單'],
      curTemplateIndex:'',
      basicList: [],
      loading: false,
      isLoadingData: true,
      workflowDescription: '',
      infoForm: {},
      nodeList:{},

      fromApiflatNodeData:[],

      nodeDataToApi:[],
      userInfo:[],

      // ======
      w_width: "1000",
      tags: [],
      userColumnData: [
        {
          'prop': 'userName',
          'label': this.$t('audit.workFlows.name'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'email',
          'label': this.$t('audit.workFlows.email'),
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'sector',
          'label': this.$t('audit.workFlows.depart'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'title',
          'label': this.$t('audit.workFlows.position'),
          'width': 100,
          'maxWidth': 100,
        },
      ],
      userData:[],
      inputSearchUser: '',
      showSelectionColumn: true,
  
      showingSearchUser: false,
      inputSearchUser: '',
      titleList:[],
      titleListAry:[],
      departmentAry:[],
      curTemplateDepartment: '',
      curTemplateTitleList: '',
    // ======

      titleList:[],
      fullscreenLoading: false,
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        move: true,
        minWidth: '134',
        align: 'center',
        move: [
          {
            text: this.$t('audit.workFlows.moveUp'),
            methods: "moveUp"
          },
          {
            text: this.$t('audit.workFlows.moveDown'),
            methods: 'moveDown'
          },

        ],
        operation: [
          {
            lable: '',
            icon: 'icon-setting',
            methods: 'set'
          },
          {
            lable: '',
            icon: 'icon-delete',
            methods: 'delete'
          }
        ]
      },
      columnData: [
        {
          'prop': 'name',
          'label': this.$t('audit.workFlows.nodeName'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'auditByUsers',
          'label': this.$t('audit.workFlows.nodeAuditName'),
          'width': 110,
          'maxWidth': 110,
          'auditByUsers': true,
        },
        {
          'prop': 'auditMethod',
          'label': this.$t('audit.workFlows.nodeAuditmethod'),
          'width': 100,
          'maxWidth': 100,
          'auditMethod': true,
        },
        {
          'prop': 'signature',
          'label': this.$t('audit.workFlows.nodeSign'),
          'width': 100,
          'maxWidth': 100,
          'signature': true,
        },
        
      ],
      indexType: true,
      penSrc: require('../../../../static/img/table-edit.png'),
      deleteSrc: require('../../../../static/img/table-delete.png'),
      rowId:'',
      signMode: 1,
      department : '',

      newFlatNodeDataView:[],
      pageAction: "init",
      currentUser:'',
      allTableData: [],
      apiBody: {
          "page": 0,
          "size": 5000,
          "direction": "DESC",
          "property": "updateTs",
          "state": [
              0,
              1,
          ]
      },
      showInputLimit: false,
      showTextAreaLimit: false,
      noInput: false
    };
  },

  watch:{},
  async created() {
    await this.init()
  },
  mounted() {
    this.searchUserData = this.userData
  },

  computed: {
  
    searchUserData: {
      get(){
        return this.filterInputSearchUser(this.filterCurTemplateDepartment(this.filterCurTemplateTitleList(this.userData)))
      },
      set(val){
        console.log('val', val)
			}
    }
  },

  methods: {
    async init(){
      await this.getTitle() 
      await this.getUserInfo() 
      await this.getDepartmentList() 
    
      const result = await this.$store.dispatch("GetUserAuthorities");
      this.currentUser = result.data.userId

      var status = sessionStorage.getItem('pageAction');
      const pageAction = JSON.parse(status)

      console.log('pageAction', pageAction)
      switch(pageAction){
        case 'firstEdit':{
          console.log('go firstEdit !!');
          this.firstEdit()
          break;      
        }
        case 'create':{
          console.log('go create !!');
          this.getNodeData()
          break;      
        }
        case 'edit':{
          console.log('go edit !!');
          await this.handleEdit()
          break;      
        }
        case 'set':{
          // for Breadcrumb link
          console.log('go set !!');
          await this.handleEdit()
          break;      
        }
        default: {
          break;
        }
      }
      await this.getPickedMember()
      await this.handleData() 

      
      this.isLoadingData = false
    },


    async firstEdit(){
      // get id 
      await this.getWorkflowInfo()
      await this.getNodeList(this.infoForm.processDefinitionKey) 
      await this.handleData() 
      await this.getWorkflowList(this.apiBody)
      
      
      this.isLoadingData = false
    },

    needNote(){
      util.notify(this.$t('audit.workFlows.thisModeWithoutEvent'), 'warning', 2000 );
    },

    // create
    getNodeData(){
      const tempData = sessionStorage.getItem('workflowDetail')
      this.workflowDetail = JSON.parse(tempData)
      this.ccToUSer = this.workflowDetail.copyToUsers

      const data = sessionStorage.getItem('newWorkFlow')
      const newNode = JSON.parse(data)
      // console.log('newNode :>> ', newNode);

      const reNewNode = sessionStorage.getItem('reNewNode')
      const orinode = JSON.parse(reNewNode)
      // console.log('orinode 1 >> ', orinode);

      if( newNode !== null ){
        orinode.push(newNode.orderedAuditNodeArray[0])
        sessionStorage.setItem('reNewNode', JSON.stringify(orinode))

        this.newFlatNodeDataView = orinode
        console.log('orinode 2 >> ', orinode);
        
      }else{
        sessionStorage.setItem('reNewNode', JSON.stringify(orinode))
        this.newFlatNodeDataView = orinode
      }
      sessionStorage.removeItem('newWorkFlow')
    },


    getWorkflowInfo(){
      const data = sessionStorage.getItem('workflowDetail')
      this.infoForm = JSON.parse(data)

      // this.workflowDetail = this.infoForm 

      console.log('this.infoForm 1 ------>> ', this.infoForm);
      console.log('this.workflowDetail 1 ------>> ', this.workflowDetail);
    },


    async getNodeList(id){
      this.isLoadingData = true
      await getNodeList(id).then(res=>{

        // clone
        this.nodeList = JSON.parse(JSON.stringify(res.data))

        this.workflowDetail = res.data
        delete this.workflowDetail.nextAuditNode
        sessionStorage.setItem('workflowDetail', JSON.stringify(this.workflowDetail))


        this.ccToUSer = this.nodeList.copyToUsers
        console.log('this.nodeList 4 ------>> ', this.nodeList);
        console.log('res.data 4 ------>> ', res.data);
        console.log('this.workflowDetail 4 ------>> ', this.workflowDetail);
        
        // flat data  
        this.flattenData(this.nodeList)
        this.fromApiflatNodeData.forEach(d=>{
          delete d.nextAuditNode
        })

        console.log('this.fromApiflatNodeData 4 ------>> ', this.fromApiflatNodeData);
        this.fromApiflatNodeData[0].name = this.$t('audit.workFlows.submitAudit')
        this.fromApiflatNodeData[0].auditByUsers = []
        this.fromApiflatNodeData[0].auditByUsers.push(this.$t('audit.sendAudit.submitterName'))
        
        this.newFlatNodeDataView = this.fromApiflatNodeData

        // 傳node資料到 workflownode
        sessionStorage.setItem('reNewNode', JSON.stringify(this.newFlatNodeDataView))
        


        // this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    // flatten Data by Recursive
    flattenData(data, key = 'nextAuditNode') {
      if(data[key] !== null) {
          const d = data[key];
          this.fromApiflatNodeData.push(d);
          this.flattenData(data[key]);
      } else {
        return this.fromApiflatNodeData;
      }
    },
    
    handleEdit(){
      console.log('this is Edit')
    
      const tempData = sessionStorage.getItem('workflowDetail')
      this.workflowDetail = JSON.parse(tempData)
      console.log('object  :::::::::>> ',  this.workflowDetail);
      
      // 取得副本通知人員
      this.ccToUSer = this.workflowDetail.copyToUsers
      
      const data = sessionStorage.getItem('newWorkFlow')
      const newNode = JSON.parse(data)
      console.log('newNode :::::::::>> ', newNode);
      
      const reNewNode = sessionStorage.getItem('reNewNode')
      const orinode = JSON.parse(reNewNode)
      console.log('orinode :::::::::>> ', orinode);


      if( newNode !== null){
        var num = orinode.findIndex(n => newNode.orderedAuditNodeArray[0].id == n.id)
        console.log('num :>> ', num);
        orinode.splice(num , 1 , newNode.orderedAuditNodeArray[0])

        sessionStorage.setItem('reNewNode', JSON.stringify(orinode))
        this.newFlatNodeDataView = orinode
      } else {
        this.newFlatNodeDataView = orinode
      }

      console.log(' this.newFlatNodeDataView  handleEdit /////',  this.newFlatNodeDataView);
      sessionStorage.removeItem('newWorkFlow')
    },


    // get user
    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
        this.userInfo = res.data
        this.userData = this.userInfo
        // console.log('this.userInfo ------>> ', this.userInfo);
      }).catch(err => {
        console.log('error' + err);
      });
    },
    
    // get getDepart
    async getDepartmentList(){
      await getDepartAll({ type: 0 }).then(res=>{
        this.department = res.data
        // console.log('this.department 4 ------>> ', this.department);
        this.departmentAry = this.department.map( i => (
          i = i.defineName
        ))
        this.departmentAry.unshift(this.$t('overview.allDepartment'))

      }).catch(err => {
        console.log('error' + err);
      });
    },

    // get title
    async getTitle(){
      await getUserStatus({ type: 1 }).then(res=>{
        this.titleList =  res.data
        this.titleListAry = this.titleList.map( i => (
          i = i.defineName
        ))
        this.titleListAry.unshift(this.$t('overview.allPosition'))
      }).catch(err => {
        console.log('error' + err);
      });
    },
    
    addNode() {
      // name or group convert id
      this.newFlatNodeDataView.forEach(d =>{
        if(d.auditTargetType == 0){
            this.userInfo.forEach(n =>{
              if(d.auditByUsers.length !== 0 && d.auditByUsers[0] == n.userName){
                d.auditByUsers = []
                d.auditByUsers.push(n.userId)
              }
            })
        }else if(d.auditTargetType == 1){
          this.department.forEach(g =>{
            if(d.auditByGroups.length !== 0 && d.auditByGroups[0] == g.defineName){
              d.auditByGroups = []
              d.auditByGroups.push(g.defineId)
            }
          })
          }
      })
      this.workflowDetail.copyToUsers = this.ccToUSer
      sessionStorage.setItem('workflowDetail', JSON.stringify(this.workflowDetail))
      sessionStorage.setItem('reNewNode', JSON.stringify(this.newFlatNodeDataView))
      var time = new Date()
      var t = {
          year: time.getFullYear(),
          month: ((time.getMonth() + 1) < 10) ? '0' + (time.getMonth() + 1).toString() : (time.getMonth() + 1).toString(),
          date: (time.getDate() < 10) ? '0' + time.getDate().toString() : time.getDate().toString(),
          hour: (time.getHours() < 10) ? '0' + time.getHours().toString() : time.getHours().toString(),
          minute: (time.getMinutes() < 10) ? '0' + time.getMinutes().toString() : time.getMinutes().toString(),
          second: (time.getSeconds() < 10) ? '0' + time.getSeconds().toString() : time.getSeconds().toString()
        }
      const createTime = t.year + t.month + t.date + "-" + t.hour  + t.minute + t.second
      const newNode = {
              "id": createTime,
              "name": this.$t('audit.workFlows.addNode'),
              "auditMethod": 0,
              "signature": false,
              "customButton": [
                  {
                      "type": 0,
                      "text":  this.$t('audit.workFlows.agree'),
                      "enable": true
                  },
                  {
                      "type": 1,
                      "text": this.$t('audit.workFlows.reject'),
                      "enable": true
                  }
              ],
              "auditByUsers": [],
              "auditByGroups": [],
              "isEditing": false,
              "auditTargetType": 1,
              "notify": false,
              "unHandleNotifyDay": null,

            }
      sessionStorage.setItem('workflowNode', JSON.stringify(newNode))
      sessionStorage.setItem('pageAction', JSON.stringify("create"))
      sessionStorage.setItem('routeTo', JSON.stringify("workflowDetail"))
      
      sessionStorage.removeItem('newWorkFlow')
      this.$router.push({ name: 'nodeSetting' })
    },

    getPickedMember(){
      const reNewNode = sessionStorage.getItem('reNewNode')
      const orinode = JSON.parse(reNewNode)
      // console.log('orinode 1 >> ', orinode);

      if(reNewNode == null) return

      var handleFlatNodeDataView = [...orinode]
      handleFlatNodeDataView.shift()

      var auditMembers = {        
        "auditByUsers": [],
        "auditByGroups": []
      }
      
      console.log('handleFlatNodeDataView ===--->> ', handleFlatNodeDataView);

      handleFlatNodeDataView.forEach(i=>{
        if(i.auditByUsers.length !== 0){
          auditMembers.auditByUsers.push(i.auditByUsers[0])
        }
        if(i.auditByGroups.length !== 0){
          auditMembers.auditByGroups.push(i.auditByGroups[0])
        }
      })

      // 刪除重複
      auditMembers.auditByUsers = [... new Set(auditMembers.auditByUsers)]
      auditMembers.auditByGroups = [... new Set(auditMembers.auditByGroups)]
      
      console.log('auditMembers :>> ', auditMembers);
      sessionStorage.setItem('auditMembers', JSON.stringify(auditMembers))
    },

    // maping data for page view
    handleData(){
      // switch user id to name 
      var tempNewFlatNodeDataView = [...this.newFlatNodeDataView]
      console.log('this.newFlatNodeDataView  handele ------>> ', this.newFlatNodeDataView);

      this.newFlatNodeDataView.forEach(item =>{
        var newArr = []
        if(item.auditByUsers[0] == this.$t('audit.sendAudit.submitterName')) newArr.push( this.$t('audit.sendAudit.submitterName'))
        
        this.userInfo.forEach( u =>{
          if( item.auditByUsers[0] == u.userId || item.auditByUsers[0] == u.userName){
            newArr.push(u.userName)
          } 
        })
        item.auditByUsers = newArr
      })

      this.newFlatNodeDataView.forEach(item =>{
        var newArr2 = []
        this.department.forEach( u =>{
          if( item.auditByGroups[0] == u.defineId || item.auditByGroups[0] == u.defineName){
            newArr2.push(u.defineName)
          } 
        })
        item.auditByGroups = newArr2
      })
    },

    
    async getWorkflowList(param){
      await getWorkflowList(param).then(res=>{
        this.allTableData = res.data.content
        var needToDelIndex = this.allTableData.findIndex(i => i.name == this.workflowDetail.name)
        this.allTableData.splice(needToDelIndex , 1)

        console.log('this.allTableData ======>> ',  this.allTableData );
        console.log('this.workflowDetail.name ======>> ',  this.workflowDetail.name );
        console.log('needToDelIndex :>> ', needToDelIndex);

      }).catch(err => {
        console.log('error' + err);
      });
    },

    itemInputChanged(val, n){
      const content = filterString.all(val, n);
      this.workflowDetail.name = content

      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit = true
      } else {
        this.showInputLimit = false
      }
    },

    itemTextAreaChanged(val, n){
      const content = filterString.all(val, n);
      this.workflowDetail.description = content

      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showTextAreaLimit = true
      } else {
        this.showTextAreaLimit = false
      }
    },


    //======================================
    filterInputSearchUser(users){
        return users.filter( item => item.userName.indexOf(this.inputSearchUser) > -1 || item.email.indexOf(this.inputSearchUser) > -1)
    },
    filterCurTemplateDepartment(users){
        if(this.curTemplateDepartment.length == 0 || this.curTemplateDepartment == this.departmentAry[0]){
          return users
        }else{
          return users.filter(item => item.sector.includes(this.curTemplateDepartment))
        }
    },
    filterCurTemplateTitleList(users){
      if(this.curTemplateTitleList.length == 0 || this.curTemplateTitleList == this.titleListAry[0]){
        return users
      }else{
        return users.filter(item => item.title == this.curTemplateTitleList )
      }
    },  

    confirmSearchUsersDialog(){
        console.log('this.ccToUSer ~~~~~~~>', this.ccToUSer)
        console.log('this.multipleSelection ~~~~~~~>', this.multipleSelection)
        this.ccToUSer = this.multipleSelection.map( i => i = i.userId)
        this.showingSearchUser = false
    },

    // 關閉 lightbox
    hideSearchUsersDialog(key){
      this[key] = false;
      this.inputSearchUser =''
      this.curTemplateDepartment = ''
      this.curTemplateTitleList = ''
      
      // 清除所有勾選
      this.$refs.usersList.clear()
    },

     //popup 表格選取欄位
    handleSelectionChange(val){
      this.multipleSelection = val.val
      console.log(' this.multipleSelection',  this.multipleSelection)
      this.tags = this.multipleSelection.map(t => (
        { 
          userName : t.userName,
          type: 'info'
        }
      ))
      // console.log('this.tags', this.tags)
    },

    // 刪除 tag
    handleClose(tag){
      console.log('tag--->', tag)
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$refs.usersList.toggleChecked(tag)
    },


    //處理 popup user selected
    handelePopupUserList(){
      this.showingSearchUser = true

      // [查詢人員]資料
      this.userData.forEach(user =>{
        this.titleList.forEach( title =>{
          if(title.contents.length !== 0 && title.contents.includes(user.userId)) user.title = title.defineName 
        })
        // user 會有多個部門
        user.sector = []
        this.department.forEach( dep =>{
          if(dep.contents.length !==  0 && dep.contents.includes(user.userId)) {
            user.sector.push(dep.defineName)
          }
        })
        user.sector = user.sector.join(", ")
      })
      
       // 等待 dialog 生成
      if(this.ccToUSer.length > 0){
        var data = this.ccToUSer
        setTimeout(() => {
          this.$refs.usersList.fromInputSelect(data)
        }, 0);
      }
    },

    //======================================
   
    

    handleEmitMove(method){
      // console.log('List method ', method);
      Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
      };
      switch(method.method){
        case 'moveUp':{
          this.newFlatNodeDataView.move(method.index, method.index - 1)
          sessionStorage.setItem('reNewNode', JSON.stringify(this.newFlatNodeDataView))
          break;
        }
        case 'moveDown':{
          this.newFlatNodeDataView.move(method.index, method.index + 1)
          sessionStorage.setItem('reNewNode', JSON.stringify(this.newFlatNodeDataView))

          break;      
        }
        default: {
          break;
        }
      }
    },

    // 判定動作
    handleEmitOperation({ method, row }) {
      console.log('List row =====>> ', row);
      switch(method){
        case 'set':{
          this.settingWorkFlow(row)
          break;      
        }
        case 'delete':{
          this.rowId = row.id
          console.log('this.rowId :>> ', this.rowId);
          this.showSingleDeleteContent = true
          break;      
        }
        default: {
          break;
        }
      }
    },

    hideDeleteContentDialog(key) {
      this[key] = false;
    },
    confirmDeleteSingle(id){
      console.log('Let me delete value', id);
      this.deleteRow(id)
      this.showSingleDeleteContent = false
    },

    // edit node
    settingWorkFlow(row){
      console.log('go edit  :>> ', row);
      console.log('this.userInfo ------>> ', this.userInfo);

      this.workflowDetail.copyToUsers = this.ccToUSer
      sessionStorage.setItem('workflowDetail', JSON.stringify(this.workflowDetail))


      if(row.auditByUsers.length !== 0){
        var currentUser = this.userInfo.filter(u => u.userName == row.auditByUsers[0])
        row.auditByUsers = []
        row.auditByUsers.push(currentUser[0].userId)
      } else if(row.auditByGroups.length !== 0){
        var currentGroup = this.department.filter(u => u.defineName == row.auditByGroups[0])
        row.auditByGroups = []
        row.auditByGroups.push(currentGroup[0].defineId)
      }
      console.log('row :>> ', row);
      sessionStorage.setItem('workflowNode', JSON.stringify(row))
      sessionStorage.setItem('pageAction', JSON.stringify("set"))
      this.$router.push({name: 'nodeSetting'})
    },


    // 刪除 node
    deleteRow(id){
      this.fullscreenLoading = true
      var rowPosition = this.newFlatNodeDataView.findIndex( e =>(
        e.id == id
      ))

      this.newFlatNodeDataView.splice(rowPosition , 1)

      // var aaa = [...this.newFlatNodeDataView]
      // aaa.forEach( item =>{
      //   if(item.auditByUsers.length !== 0){
      //     this.userInfo.forEach( u => {
      //       if(item.auditByUsers[0] == u.userName) {
      //         item.auditByUsers = []
      //         item.auditByUsers.push(u.userId)
      //       }
      //     })
      //   }
      //   if(item.auditByGroups.length !== 0){
      //     this.department.forEach( g => {
      //     if(item.auditByGroups[0] == g.defineName) {
      //       item.auditByGroups = []
      //       item.auditByGroups.push(g.defineId)
      //     }
      //   })
      //   }
      // })

      console.log('this.newFlatNodeDataView :~~~~~:::::::>> ', this.newFlatNodeDataView);
      
      sessionStorage.removeItem('newWorkFlow')
      sessionStorage.setItem('reNewNode', JSON.stringify(this.newFlatNodeDataView))


      // 處理簽核人員下拉選單顯示(清除已選狀況)
      var tempDeleteNode = [...this.newFlatNodeDataView]
      tempDeleteNode.shift()

      var auditMembers  = {}
      auditMembers.auditByUsers = []
      auditMembers.auditByGroups = []

      console.log('tempDeleteNode :>> ', tempDeleteNode);

      var handleUsers = tempDeleteNode.map(u => u = u.auditByUsers[0])
      handleUsers.forEach( i =>{
        this.userInfo.forEach(u=>{
          if( i == u.userName) auditMembers.auditByUsers.push(u.userId)
        })
      })
      var handleGroup = tempDeleteNode.map(g => g = g.auditByGroups[0])
      handleGroup.forEach( i =>{
        this.department.forEach(u=>{
          if( i == u.defineName) auditMembers.auditByGroups.push(u.defineId)
        })
      })
      
      sessionStorage.setItem('auditMembers', JSON.stringify(auditMembers))
      this.fullscreenLoading = false
    },

    //保存並發布
    submitWorkFlow() {
      console.log('this.newFlatNodeDataView :>> ', this.newFlatNodeDataView);
      console.log('this.workflowDetail :>> ', this.workflowDetail);

      this.fullscreenLoading = true
      this.isLoadingData = true

      if(this.workflowDetail.name == "") {
        this.fullscreenLoading = false
        util.notify(this.$t('audit.workFlows.cantEmptyWorkflowName'), 'error', 2000 );
        this.$refs.workflowName.focus()
        return
      }
  

      var repeatResult = this.allTableData.some(i => i.name == this.workflowDetail.name)
      console.log('repeatResult~~~~ :>> ', repeatResult);

      if(repeatResult == true){
        this.fullscreenLoading = false
        this.isLoadingData = false
        util.notify(this.$t('audit.workFlows.cantRepeatWorkflowName'), 'error', 2000 );
        this.$refs.workflowName.focus()
        return
      }
      

      // 刪除非 api 產生的 id
      this.newFlatNodeDataView.forEach(i =>{
        if(typeof(i.id) === 'string' ) delete i.id
      })
      console.log('this.newFlatNodeDataView !!!!!!', this.newFlatNodeDataView)

      this.newFlatNodeDataView.forEach(d =>{
        if(d.auditByUsers.length !== 0 ){

          var currentUser = this.userInfo.filter(u => u.userName == d.auditByUsers[0])
          d.auditByUsers = []
          if(currentUser.length > 0) d.auditByUsers.push(currentUser[0].userId)

        } else {
          var currentGroup = this.department.filter(u => u.defineName == d.auditByGroups[0])
          console.log('currentGroup :>> ', currentGroup);

          d.auditByGroups = []
          if(currentGroup.length > 0) d.auditByGroups.push(currentGroup[0].defineId)
        }
      })
      
      const orderedAuditNodeArray = [...this.newFlatNodeDataView]
      console.log('orderedAuditNodeArray :>> ', orderedAuditNodeArray);

      var toApiData = {...this.workflowDetail, orderedAuditNodeArray}
      toApiData.copyToUsers = this.ccToUSer

      console.log('toApiData :>> ', toApiData);
      if(toApiData.orderedAuditNodeArray.length == 1) {
        this.newFlatNodeDataView[0].auditByUsers.push(this.$t('audit.sendAudit.submitterName'))
        this.fullscreenLoading = false
        this.isLoadingData = false
        util.notify(this.$t('audit.workFlows.mustCreateOneNode'), 'error', 2000 );
        return
      }else{
        var id = {
          "processDefinitionKeys": []
        }
        id.processDefinitionKeys.push(toApiData.processDefinitionKey)

        updateWorkflow(toApiData).then(res=>{
          console.log('res 111111', res)
          if(toApiData.state == 0){
            this.switchEnableWorkflow(id)
          }else{
            console.log('res okokokokok', res)
            this.$router.push({name: 'workflowManage'})
          }
          }).catch(err => {
            console.log('error' + err);
          });

      }
      this.fullscreenLoading = false
      this.isLoadingData = false
    },

    // 流程啟用
    switchEnableWorkflow(id){
      enableWorkflow(id).then( res =>{
        console.log('res 22222222', res)
        this.$router.push({name: 'workflowManage'})
      }).catch(err => {
          console.log('error' + err);
       })
    },
    
  }

};
</script>

<style lang="sass" scoped>
  
  .is-multiple 
    .el-select-dropdown__item 
        padding-left: 10px !important
        border-left: solid 1px #FFF
    .el-select-dropdown__item.selected 
        padding-left: 10px !important
        border-left: solid 1px rgba(44, 144, 217, 0.34)

  .flex-row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    width: fit-content
  .date-time-tooltip
    margin-left: 8px
  .tip
    ul
      padding-left: 0

      li 
        margin-left: 18px
        line-height: 1.5

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start

  .setting-titles
    display: flex
    justify-content: space-between
    border-bottom: 1px solid #e3e9f4
  .setting-details
    margin: 30px
  .storevue-textarea
    width: 50vw
    
  .device-select
    .el-input
      .el-input__inner
          height: 36px
          padding-right: 50px
          
  .icon-gengduo
    width: 24px
    height: 24px
    vertical-align: middle
    cursor: pointer
    margin-left: 20px
  .for_row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .go_up
      margin-right: 20px
      color: #006ab7
    .go_down
      color: #006ab7
  .add-node-btn
    position: absolute
    right: 1%
    top: 5px
  
  .search_member
    height: 36px
    font-size: 14px
    color: #006ab7
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    width: fit-content
    cursor: pointer
    margin-left: 20px
    i 
      margin-right: 5px
      color: #006ab7
  
  .dialog-content
    width: 100%
    .showing_search_user
      width: 100%
      height: 500px
      
      .filter_section
        background: #FFF
        display: flex
        flex-wrap: wrap
        flex-direction: row
        justify-content: flex-start
        align-items: center
        padding: 10px 0 0 0
        margin-bottom: 10px
        .summit_filter
          width: 90px
          height: 37px
          border-radius: 3px
          background: rgb(85, 102, 121)
          color: #FFF
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          margin-bottom: 10px
          margin-left: 20px
          cursor: pointer
          transition: all .3s
          &:hover
            background: rgb(60, 92, 121)
      .is_select
        width: 100% !important
        padding: 10px 0 5px 0
        background: #FFF
        margin-bottom: 10px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        width: fit-content
        .title-name
          width: 90px
        .user_selected
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          .el-tag
            margin-right: 5px 
            margin-bottom: 5px

      .users
        height: 335px
        overflow: auto
        border-radius: 5px



</style>

<style scoped>
  .report-setting{
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
  }
  /* .setting-titles{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  } */
  .setting-tabs{
    display: flex;
    justify-content: flex-start;
  }
  .setting-name{
    cursor: pointer;
    width: 120px;
    color: #7d8cad;
    padding: 15px calc(20/1920*100vw) 0 calc(20/1920*100vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .click-setting-btn{
    color: #f31d65;
    border-bottom: 4px solid #f31d65;
  }

  .save-btn{
    text-align: left;
    margin-top: 20px;
  }

  .title-info{
    text-align: left;
    padding-bottom: calc(20/1920*100vw);
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .left-item, .right-item{
    display: inline-flex;
    align-items: center;
    margin-right: 100px;
  }

  .input-name{
    width: 200px;
    height: 30px;
  }
  .input-name .el-input--medium >>> .el-input__inner{
    height: 36px;
    line-height: 36px;
    font-size: 12px;
  }

  .span-font{
    font-size: 14px;
    color:#424151;
    /* width: 200px; */
    text-align: left;
  }
  .name-font{
    color:#424151;
    text-align: left;
    margin-right: calc(45/1920*100vw);
  }
  .enable-font{
    margin-right: 20px;
  }

  .name-tips{
    display:flex; 
    flex-direction:column;
    
  }
  .error-text{
    font-size: 12px;
    color: red;
    position: relative;
  }
  .error-text span{
    position: absolute;
  }
  .setting-config, .table-header{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* height: 60px; */
    padding: 15px 0;

  }
  .table-header{
    color: #424151;
    border: 1px solid #e3e9f4;
    border-bottom: none;
    font-weight: bold;
    background-color: #fff;
  }

  .detail-setting{
    /* padding: 0 calc(30/1920*100vw); */
  }
  .radio-setting{
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: center;
    margin-top: 20px;
  }
  .radio-setting .el-radio{
    height: 30px;
  }
  .setting-config{
    /* border-bottom: 1px solid #e3e9f4; */
    height: auto;
  }

  .setting-config:hover{
    cursor: pointer;
  }
  .basic-config, .basic-header{
    border: none;
    border-bottom: 1px solid #e3e9f4;
    /* padding-left: calc(30/1920*100vw); */
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: fit-content;
    text-align: left;
    margin-right: 20px;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    /* width: 60%; */
    text-align: left;
  }

  .title-operation{
    /* width: 20%; */
  }

  .sortable-ghost{
    color: #424151 !important;
    background: rgba(243, 19, 101, 0.1) !important;
    border: 1px solid #f31d65;
  }

  .statis-item{
    display: flex;
    height: 40px;
    align-items: center;
  }
  .el-radio{
    width: 100px;
    margin-right: 0px
  }

  /* .setting-details{
    margin: 0 30px;
  } */
  .content-titles{
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 12px;
  }
  .template-select-area{
    display:flex; 
    flex-direction:row;
    height:calc(30/1920*100vw);
    width:200px;
    align-items:center;
    background-color:#f4f6f7;
    border-radius:5px;
    font-size: 13px;
    margin-right: 20px;
  }
  .template-select-label{
      color:#556679;
      font-family: NotoSansCJKtc;
      font-size: 13px;
      width:75px;
      margin-left:16px;
      line-height: 15px;
    }
  .inspect-basic{
    margin-bottom: 30px;
    position: relative;
  }

  .el-radio{
    color: #424151;
  }
  >>> .el-radio__input.is-checked + .el-radio__label{
    color: #514d41;
  }
  .detail-table{
    /* border: 1px solid #e3e9f4;
    padding-bottom: 20px; */
    background-color: #f7f9fa
  }
  .promot-info{
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 12px;
    color: #7d8cad;
  }
</style>

<style lang="sass">


  .audit-user-row
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    .audit-user
      margin-right: 10px
  
  .tablelist
    .el-table__row
      &:first-child
        .el-table_1_column_6
          .cell
            display: none !important
            
  .title-status
    .el-input__count-inner
      margin-top: 55px
  .popup_width
    .el-dialog
      width: 70% !important
      background: #f7f9fa
      .el-table th
        &:first-child
          .cell
            width: 50px
            margin-left: -28px
            


  .users
    .el-checkbox__input.is-indeterminate .el-checkbox__inner
      background-color: #2c90d9 !important
      border-color: #2c90d9 !important
    .el-checkbox__input.is-checked .el-checkbox__inner
      background: #2c90d9 !important
      border-color: #2c90d9 !important
      &:hover
        border-color: #dcdfe6 !important
    .is-focus .el-checkbox__inner      
      border-color: #dcdfe6 !important
    
    .el-checkbox__inner:hover
      border-color: #190 !important
      
  .title-status
    .el-input__count-inner
      margin-top: 55px
  
  .text_limit_notice
    position: absolute
    text-align: right
    margin-left: 5px
    font-size: 10px
    margin-top: 2px
    color: #ff2400
    display: block
</style>