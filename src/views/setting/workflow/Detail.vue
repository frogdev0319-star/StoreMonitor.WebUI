<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      {{$t('audit.workFlows.workFlowConfiguration')}}
      <div class="spacer"></div>
      <div class="buttons">
        <delay-button type="filled" @click="submit">  {{$t('audit.workFlows.saveAndEnable')}}</delay-button>
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
                      :placeholder="nodeDataToApi.name"
                      v-model="nodeDataToApi.name"
                      style="width: 250px;"
                      :maxlength="50"
                      show-word-limit
                      />
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
                      <el-radio-group class="storevue-radio" v-model="nodeDataToApi.cancelable" >
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
              <div class="setting-config">
                <div class="title-name">{{$t('audit.workFlows.workFlowDescription')}}</div>
                <div class="title-status"> 
                  <el-input
                    v-model="nodeDataToApi.description"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    :placeholder="$t('audit.workFlows.workFlowDescription')"
                    class="storevue-textarea"
                    type="textarea"
                    resize="none"
                    maxlength="600"
                    show-word-limit
                  />
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
                    :table-data="flatNodeDataView"
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
                    @handleAuditMethod = "handleOrderedAuditNodeArray"
                    @handleSignature = "handleOrderedAuditNodeArray"
                  />
                </div>
            </template>
          </setting-table>

          <!-- row -->
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
                  <div class="title-name"> {{$t('audit.workFlows.depart')}}</div>
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
  getWorkflowList, 
  getNodeList, 
  updateWorkflow, 
  getUserStatus,
  } from "@/api/workflow";
import {getUserInfo} from '@/api/login';

import TableOnly from '@/components/TableOnly';
import DialogPop from '@/components/DialogPop';

import util from "@/common/util";
export default {
  name: 'WorkflowDetail',
  components: {
    TableOnly,
    DelayButton,
    SettingTable,
    DialogPop
  },
  data() {
    return {
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
      // searchUserData:[],
      inputSearchUser: '',
    
      ccToUSer: [],
      showSingleDeleteContent: false,
      showingSearchUser: false,

      dataFromRoute: {},
      workflowDetail: {},
      templateList: ['巡檢表單'],
      curTemplateIndex:'',
      basicList: [],
      loading: false,
      isLoadingData: false,
      workflowDescription: '',
      infoForm: {},
      nodeList:{},
      flatNodeData:[],
      flatNodeDataView:[],
      nodeDataToApi:[],
      userInfo:[],
      titleList:[],
      department : [],

      titleListAry:[],
      departmentAry:[],
      curTemplateDepartment: '',
      curTemplateTitleList: '',

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

      temp:[],
      showSelectionColumn: true,
      multipleSelection: [],
      auditMember: {},
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
    };
  }, 


  watch:{
    'nodeDataToApi.name'(value){
      var nnn = value.replace(/[^\x00-\xff]/g,"xx").length
      console.log('nnn :>> ', nnn);
    },
    
    ccToUSer(){
      this.nodeDataToApi.copyToUsers = this.ccToUSer
    },
  },
  computed: {
    searchUserData: {
      get(){
        return this.filterInputSearchUser(this.filterCurTemplateDepartment(this.filterCurTemplateTitleList(this.userData)))
      },
      set(){
        // console.log('val!?!?!~~~~~>>>', val)
        // console.log('searchUserData!?!?!~~~~~>>>', this.searchUserData)
			}
    }
  },
  mounted() {
    this.searchUserData = this.userData

  },

  async created() {
    await this.init()
  },
  methods: {
    filterInputSearchUser(users){
        return  users.filter( item => item.userName.indexOf(this.inputSearchUser) > -1 || item.email.indexOf(this.inputSearchUser) > -1)
    },
    filterCurTemplateDepartment(users){
        if(this.curTemplateDepartment.length == 0){
          return users
        }else{
          return users.filter(item => item.sector == this.curTemplateDepartment )
        }
    },
    filterCurTemplateTitleList(users){
      if(this.curTemplateTitleList.length == 0){
        return users
      }else{
        return users.filter(item => item.title == this.curTemplateTitleList )
      }
    },    


    handleOrderedAuditNodeArray(obj){
      console.log('object :>> ', obj);
      this.nodeDataToApi.orderedAuditNodeArray.forEach(row =>{
        if(row.id == obj.id){
          row.auditMethod = obj.auditMethod;
          row.signature = obj.signature;
        }
      })
      console.log('this.nodeDataToApi new :>> ', this.nodeDataToApi);
    },

    async init(){
      
      await this.getWorkflowInfo() 
      await this.getNodeList(this.infoForm.processDefinitionKey) 

      await this.getTitle() 
      await this.getUserInfo() 
      await this.getDepartmentList() 

      await this.handleData() 
      await this.dataToApi() 

      await this.getWorkflowList(this.apiBody)
      await this.getPickedMember() 

    },

    needNote(){
      util.notify(this.$t('audit.workFlows.thisModeWithoutEvent'), 'warning', 2000 );
    },
    async getWorkflowList(param){
      this.isLoadingData = true
      await getWorkflowList(param).then(res=>{
        this.allTableData = res.data.content

        const n = this.allTableData.findIndex( i => i.name == this.nodeDataToApi.name)
        this.allTableData.splice(n, 1)
        // console.log('n === ', n);
        // console.log('this.allTableData ======>> ',  this.allTableData );
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },


    getWorkflowInfo(){
      const data = sessionStorage.getItem('workflowDetail')
      this.infoForm = JSON.parse(data)
      // this.infoForm.type = "巡檢表單"
      console.log('getWorkflowInfo 1 ------>> ', this.infoForm);
    },
    
    // get user
    async getUserInfo(){
      await getUserInfo().then(res=>{
        this.userInfo = res.data
        this.userData = this.userInfo
        console.log('getWorkflowInfo 2 ------>> ', this.userInfo);
      }).catch(err => {
        console.log('error' + err);
      });
    },

    // get title 職務
    async getTitle(){
      await getUserStatus({ type: 1 }).then(res=>{
        this.titleList =  res.data
        console.log('this.titleList 3 ------>> ', this.titleList);
        this.titleListAry = this.titleList.map( i => (
          i = i.defineName
        ))
        console.log('this.titleListAry  7:>> ', this.titleListAry);
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    // get getDepart 部門
    async getDepartmentList(){
      await getUserStatus({ type: 0 }).then(res=>{
        this.department = res.data
        console.log('this.department 7 ------>> ', this.department);
      
        this.departmentAry = this.department.map( i => (
          i = i.defineName
        ))
        console.log('this.departmentAry  7:>> ', this.departmentAry);

      }).catch(err => {
        console.log('error' + err);
      });
    },


    async getNodeList(id){
      this.isLoadingData = true
      await getNodeList(id).then(res=>{

        this.nodeList =  res.data
        this.ccToUSer = this.nodeList.copyToUsers
        console.log('this.nodeList 4 ------>> ', this.nodeList);

        // flat data
        this.flattenData(this.nodeList)
        this.flatNodeData.forEach(d=>{
          delete d.nextAuditNode
        })
        console.log('this.flatNodeData 4 ------>> ', this.flatNodeData);
        // this.flatNodeData[0].name = this.infoForm.createdUser
        this.flatNodeData[0].name = this.$t('audit.workFlows.submitAudit')

        if(this.flatNodeData[0].auditByUsers.length > 0){
          this.flatNodeData[0].auditByUsers = []
          this.flatNodeData[0].auditByUsers.push(this.nodeList.createdUser)
        }
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },
    // flatten Data by Recursive
    flattenData(data, key = 'nextAuditNode') {
      if(data[key] !== null) {
          const d = data[key];
          this.flatNodeData.push(d);
          this.flattenData(data[key]);
      } else {
        return this.flatNodeData;
      }
    },

    // maping data for page view
    handleData(){
      // deep copy
      this.flatNodeDataView = JSON.parse(JSON.stringify(this.flatNodeData))
      
      // switch user id to name 
      this.flatNodeDataView.forEach(item =>{
        var newArr = []
        item.auditByUsers.forEach(id =>{
          this.userInfo.forEach(uu =>{
            if(id == uu.userId){
              newArr.push(uu.userName)  
            } 
          })
        })
        item.auditByUsers = [...newArr ]
      })

      // this.department
      this.flatNodeDataView.forEach(item =>{
        var newArr2 = []
        item.auditByGroups.forEach(id =>{
          this.department.forEach(d =>{
            if(id == d.defineId){
              newArr2.push(d.defineName)  
            } 
          })
        })
        item.auditByGroups = [...newArr2 ]
      })
      console.log('this.flatNodeDataView 5 ------>> ', this.flatNodeDataView);
    },
    
    // data for api submit
    dataToApi(){
      // deep copy
      var orderedAuditNodeArray = JSON.parse(JSON.stringify(this.flatNodeData))

      this.nodeDataToApi = this.nodeList
      delete this.nodeDataToApi.nextAuditNode
      this.nodeDataToApi.orderedAuditNodeArray = orderedAuditNodeArray
      
      sessionStorage.setItem('nodeDataToApi', JSON.stringify(this.nodeDataToApi))
    },


    getPickedMember(){
      console.log('this.flatNodeDataView 8>> ', this.flatNodeDataView);

      var handleFlatNodeDataView = [...this.flatNodeData]
      handleFlatNodeDataView.shift()

      var auditMembers = {        
        "auditByUsers": [],
        "auditByGroups": []
      }
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


    addNode() {

      const newNode = {
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
            "auditTargetType": 1
        }
      sessionStorage.setItem('workflowNode', JSON.stringify(newNode))
      sessionStorage.setItem('pageAction', JSON.stringify("set"))
      sessionStorage.setItem('nodeDataToApi', JSON.stringify(this.nodeDataToApi))
  
      this.$router.push({ name: 'nodeSetting' })
      // call api for update
      updateWorkflow(this.nodeDataToApi).then(res=>{
        console.log('res :>> ', res);
      }).catch(err => {
        console.log('error' + err);
      });
    },

    handleEmitMove(method){
      // console.log('List method ', method);
      Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
      };
      switch(method.method){
        case 'moveUp':{
          this.flatNodeDataView.move(method.index, method.index - 1)
          this.moveAction(method.index, method.index - 1)

          break;
        }
        case 'moveDown':{
          this.flatNodeDataView.move(method.index, method.index + 1)
          this.moveAction(method.index, method.index + 1)
          break;      
        }
        default: {
          break;
        }
      }
    },

    handleEmitOperation({ method, row }) {
      console.log('List row =====>> ', row);
      switch(method){
        case 'set':{
          this.settingWorkFlow(row)
          break;      
        }
        case 'delete':{
          // this.deleteRow(row.id)
          this.rowId = row.id
          this.showSingleDeleteContent = true
          break;      
        }
        default: {
          break;
        }
      }
    },
  
    moveAction(from , to){
      console.log(from , to);
      this.fullscreenLoading = true
      var moving = this.nodeDataToApi.orderedAuditNodeArray.splice(from, 1)[0]
      this.nodeDataToApi.orderedAuditNodeArray.splice(to, 0 , moving)
      
      // sync sessionStorage
      sessionStorage.setItem('nodeDataToApi', JSON.stringify(this.nodeDataToApi))

      // call api for update
      updateWorkflow(this.nodeDataToApi).then(res=>{
        console.log('res :>> ', res);
        this.fullscreenLoading = false
        this.$message({
          type: 'success',
          message: this.$t('audit.workFlows.orderModified')
        })
      }).catch(err => {
        this.fullscreenLoading = false
        console.log('error' + err);
      });
    },

    hideDeleteContentDialog(key) {
      this[key] = false;
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
      this.ccToUSer = []
    },

    confirmDeleteSingle(id){
      console.log('Let me delete value', id);
      this.deleteRow(id)
      this.showSingleDeleteContent = false
    },

    settingWorkFlow(row){
      // 刪除  "isEditing": false
      var oriData = this.flatNodeData.filter(f => row.id === f.id)
      delete row.isEditing
      sessionStorage.setItem('workflowNode', JSON.stringify(oriData[0]))
      sessionStorage.setItem('pageAction', JSON.stringify("set"))
      sessionStorage.setItem('nodeDataToApi', JSON.stringify(this.nodeDataToApi))

      this.$router.push({name: 'nodeSetting'})
      // call api for update
      updateWorkflow(this.nodeDataToApi).then(res=>{
        console.log('res :>> ', res);
      }).catch(err => {
        console.log('error' + err);
      });

    },

    deleteRow(deleteId){
      this.fullscreenLoading = true
      
      var deleteData = this.flatNodeDataView.filter( e =>(
        e.id !== deleteId
      ))
      this.flatNodeDataView = deleteData

      var deleteNode = this.nodeDataToApi.orderedAuditNodeArray.filter( e =>(
        e.id !== deleteId
      ))
      this.nodeDataToApi.orderedAuditNodeArray = deleteNode
      
      sessionStorage.setItem('nodeDataToApi', JSON.stringify(this.nodeDataToApi))
      // call api for update
      updateWorkflow(this.nodeDataToApi).then(res=>{
        console.log('res :>> ', res);
        this.fullscreenLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('audit.workFlows.deleteScuccess')
        })

      }).catch(err => {
        this.fullscreenLoading = false;
        console.log('error' + err);
      });
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
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$refs.usersList.toggleChecked(tag)
    },

    //處理 popup user selected
    handelePopupUserList(){
      this.showingSearchUser = true
      console.log('this.searchUserData !!!', this.searchUserData)


      // [查詢人員]資料
      this.userData.forEach(user =>{
          this.titleList.forEach( title =>{
            if(title.contents.length !== 0 && title.contents.includes(user.userId)) user.title = title.defineName 
          })
          this.department.forEach( dep =>{
            if(dep.contents.length !==  0 && dep.contents.includes(user.userId)) user.sector = dep.defineName 
          })
        })
      
      // 等待 dialog 生成
      if(this.ccToUSer.length > 0){
        var data = this.ccToUSer
        setTimeout(() => {
          this.$refs.usersList.fromInputSelect(data)
        }, 0);
      }
    },

    //保存並發布
    submit() {
      var repeatResult = this.allTableData.some(i=>
        i.name == this.nodeDataToApi.name
      )
      if(this.nodeDataToApi.name == ''){
        util.notify(this.$t('audit.workFlows.cantEmptyWorkflowName'), 'error', 2000 );
        this.$refs.workflowName.focus()
        return
      } else if(this.nodeDataToApi.orderedAuditNodeArray.length == 1){
        util.notify(this.$t('audit.workFlows.mustCreateOneNode'), 'error', 2000 );
        return
      } else if(repeatResult == true){
        util.notify(this.$t('audit.workFlows.cantRepeatWorkflowName'), 'error', 2000 );
        this.$refs.workflowName.focus()
        return
      } else {
        console.log('gogogo :>> ');
        // call api for update
        updateWorkflow(this.nodeDataToApi).then(res=>{
          console.log('res :>> ', res);
          this.$router.push({name: 'workflowManage'})
          this.isLoadingData = false
        }).catch(err => {
          this.isLoadingData = false;
          console.log('error' , err);
        });
      }
    }
  }

};
</script>

<style lang="sass" scoped>
  .is-multiple 
    .el-select-dropdown__item 
        padding-left: 10px !important;
        border-left: solid 1px #FFF;
    .el-select-dropdown__item.selected 
        padding-left: 10px !important;
        border-left: solid 1px rgba(44, 144, 217, 0.34);

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
    top: 3px
  
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

</style>