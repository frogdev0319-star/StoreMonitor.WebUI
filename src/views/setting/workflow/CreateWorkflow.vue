<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      {{$t('audit.workFlows.workFlowConfiguration')}}
      <div class="spacer"/>
      <div class="buttons">
        <delay-button type="filled" @click="addNewFlow">  {{$t('audit.workFlows.saveAndEnable')}}</delay-button>
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
                      style="width: 250px"
                      maxlength="50"
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
                      <el-radio-group class="storevue-radio" v-model="workflowDetail.cancelable" >
                        <div class="flex-row" style="margin-right: 30px">
                          <el-radio :label="false">{{$t('audit.workFlows.canNotCancel')}}</el-radio>  
                            <el-tooltip
                              class="date-time-tooltip"
                              effect="light"
                              placement="bottom-end">
                              <div slot="content">
                                不可取消簽核： <br> 
                                送出巡檢報告時同步送出不合格項產生之事件 <br> 
                                簽核流程無法選擇「取消」<br> 
                                巡檢報告重新編輯時無法修改不合格項 <br> 
                                簽核通過後才能檢視巡檢報告 <br> 
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
                              可取消簽核： <br> 
                              送出巡檢報告時不會立即產生不合格項之事件，簽核通過時才會產生 <br> 
                              簽核流程可以選擇「取消」 <br> 
                              巡檢報告重新編輯時可以編輯不合格項、合格項及忽略項 <br> 
                              簽核通過後才能檢視巡檢報告 <br> 
                            </div>
                            <i class="iconfont icon-bangzhu iconbangzhu"/>
                          </el-tooltip>
                        </div>
                      </el-radio-group>
                    
                      <!-- <p>{{$t('audit.workFlows.thisModeWithoutEvent')}}</p> -->
                </div>

              </div>

              <!-- row -->
              <!-- 流程描述 -->
              <div class="setting-config">
                <div class="title-name">{{$t('audit.workFlows.workFlowDescription')}}</div>
                <div class="title-status"> 
                  <el-input
                    v-model="workflowDetail.description"
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
            <div class="search_member"><i class="iconfont el-icon-view iconbangzhu"/> {{$t('audit.workFlows.findUser')}}</div>  

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

  </div>
</template>
<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import {getNodeList, updateWorkflow, creadNewFlow,getUserStatus} from "@/api/workflow";
import {getUserTitleList } from "@/api/title";
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
      ccToUSer: [],
    
      showSingleDeleteContent:false,
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
      newFlow:{
        // "name": this.$t('audit.workFlows.addWorkFlow'),
        // "description": "",
        // "type": 0,
        // "cancelable": false,
        // "copyToUsers": [],
        // "copyToGroups": [],
        // "nextAuditNode": {
        //   "name": "default flow",
        //   "auditMethod": 0,
        //   "signature": false,
        //   "auditTargetType": 0, // 0 - 個人, 1 - 群組
        //   "customButton": [
        //       {
        //           "type": 0,
        //           "text": this.$t('audit.workFlows.agree'),
        //           "enable": true
        //       },
        //       {
        //           "type": 1,
        //           "text": this.$t('audit.workFlows.reject'),
        //           "enable": true
        //       }
        //   ],
        //   "auditByUsers": [],
        //   "auditByGroups": [],
        //   "nextAuditNode": {
        //     "name": "default flow 1",
        //     "auditMethod": 0,
        //     "signature": false,
        //     "customButton": [
        //         {
        //             "type": 0,
        //             "text": this.$t('audit.workFlows.agree'),
        //             "enable": true
        //         },
        //         {
        //             "type": 1,
        //             "text": this.$t('audit.workFlows.reject'),
        //             "enable": true
        //         }
        //     ],
        //     "auditByUsers": [],
        //     "auditByGroups": [],
        //     "auditTargetType": 0
        //   }
        // },
      },
      pageAction: "init",
      currentUser:''
    };
  },
  watch:{
  },
  async created() {
    
    await this.init()

  },
  mounted() {
    // this.dataFromRoute = { ...this.$route.params.data }
    // getWorkflowInfo({
    //   processDefinitionKey: this.dataFromRoute.processDefinitionKey
    // }).then(res => {
    //   function getNodes (nodes, data) {
    //     if (data.nextAuditNode) {
    //       nodes.push(data.nextAuditNode)
    //       getNodes(nodes, data.nextAuditNode)
    //     } else return
    //   }
    //   let nextNodes = [];
    //   this.workflowDetail = { ...res.data }
    //   getNodes(nextNodes, this.workflowDetail)
    //   this.workflowDetail['nextNodes'] = nextNodes;
    // })
  },
  methods: {
    async init(){
      // await this.getNodeList(this.infoForm.processDefinitionKey) 

      await this.getTitle() 
      await this.getUserInfo() 
      await this.getDepartmentList() 
      await this.initBasicData()
      

      const result = await this.$store.dispatch("GetUserAuthorities");
      this.currentUser = result.data.userId
      console.log('result @@', result)
      console.log('this.currentUser 1 @@', this.currentUser)


      var status = sessionStorage.getItem('pageAction');
      const pageAction = JSON.parse(status)

      switch(pageAction){
        case 'init':{
          console.log('go init !!');
          this.initFirstNode() 
          break;      
        }
        case 'create':{
          console.log('go create !!');
          this.getNodeData()
          break;      
        }
        case 'edit':{
          console.log('go edit !!');
          this.handleEdit()
          break;      
        }
        default: {
          break;
        }
      }
      
      await this.handleData() 

    },

    needNote(){
      util.notify('※ 此模式不會立即產生事件 ', 'warning', 3000);
    },

    initBasicData(){
      // 初始基本訊息
      var initBasicData = {
        "name": this.$t('audit.workFlows.addWorkFlow'),
        "description": "",
        "type": 0,
        "cancelable": false,
        "copyToUsers": [],
      }
      var data = sessionStorage.getItem('workflowDetail')
      var workflowDetail = JSON.parse(data)
      
      if(workflowDetail == null){
        this.workflowDetail = initBasicData
      } else {
        this.workflowDetail = workflowDetail
      }
    },
    initFirstNode(){
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
      var initData = [
          {
          "id": createTime,
          "name": "送出簽核",
          "auditMethod": 0,
          "signature": false,
          "customButton": [
              {
                  "type": 0,
                  "text": "同意",
                  "enable": true
              },
              {
                  "type": 1,
                  "text": "駁回",
                  "enable": true
              }
          ],
          "auditByUsers": [],
          "auditByGroups": [],
          "auditTargetType": 0,
          "notify": false,
          "unHandleNotifyDay": null
        },
      ]
      
      console.log('this.currentUser 2', this.currentUser)
      initData[0].auditByUsers.push(this.currentUser)
      this.newFlatNodeDataView = initData
      console.log('this.newFlatNodeDataView 1 :>> ', this.newFlatNodeDataView);
    },

    getNodeData(){
      const data = sessionStorage.getItem('newWorkFlow')
      const newNode = JSON.parse(data)
      console.log('newNode :>> ', newNode);

      const reNewNode = sessionStorage.getItem('reNewNode')
      const orinode = JSON.parse(reNewNode)
      console.log('orinode 1 >> ', orinode);

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
              "auditTargetType": 1
            }
      sessionStorage.setItem('workflowNode', JSON.stringify(newNode))
      sessionStorage.setItem('pageAction', JSON.stringify("create"))
      sessionStorage.removeItem('newWorkFlow')
      this.$router.push({ name: 'nodeSetting' })
    },

    handleEdit(){
      const data = sessionStorage.getItem('newWorkFlow')
      const newNode = JSON.parse(data)
      console.log('newNode  ~~~~~>> ', newNode.orderedAuditNodeArray);

      const reNewNode = sessionStorage.getItem('reNewNode')
      const orinode = JSON.parse(reNewNode)
      console.log('orinode ~~~~~>> ', orinode);

      if( newNode.orderedAuditNodeArray !== null){
        var num = orinode.findIndex(n => newNode.orderedAuditNodeArray[0].id == n.id)
        console.log('num :>> ', num);
        orinode.splice(num , 1 , newNode.orderedAuditNodeArray[0])

        sessionStorage.setItem('reNewNode', JSON.stringify(orinode))
        this.newFlatNodeDataView = orinode
      }

      sessionStorage.removeItem('newWorkFlow')
    },


    // get user
    async getUserInfo(){
      await getUserInfo().then(res=>{
        this.userInfo = res.data
        // console.log('this.userInfo ------>> ', this.userInfo);
      }).catch(err => {
        console.log('error' + err);
      });
    },
    // get title
    getTitle(){
      getUserTitleList().then(res=>{
        this.titleList =  res.data
        // console.log('this.titleList 3 ------>> ', this.titleList);
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },
    // get getDepart
    async getDepartmentList(){
      await getUserStatus({ type: 0 }).then(res=>{
        this.department = res.data
        // console.log('this.department 4 ------>> ', this.department);
      }).catch(err => {
        console.log('error' + err);
      });
    },


    // async getNodeList(id){
    //   this.isLoadingData = true
    //   await getNodeList(id).then(res=>{

    //     this.nodeList =  res.data
    //     this.ccToUSer = this.nodeList.copyToUsers
    //     console.log('this.nodeList 4 ------>> ', this.nodeList);

    //     // flat data
    //     this.flattenData(this.nodeList)
    //     this.flatNodeData.forEach(d=>{
    //       delete d.nextAuditNode
    //     })
    //     console.log('this.flatNodeData 4 ------>> ', this.flatNodeData);
    //     // this.flatNodeData[0].name = this.infoForm.createdUser
    //     this.flatNodeData[0].name = this.$t('audit.workFlows.submitAudit')

    //     if(this.flatNodeData[0].auditByUsers.length > 0){
    //       this.flatNodeData[0].auditByUsers = []
    //       this.flatNodeData[0].auditByUsers.push(this.nodeList.createdUser)
    //     }
    //     this.isLoadingData = false
    //   }).catch(err => {
    //     this.isLoadingData = false;
    //     console.log('error' + err);
    //   });
    // },

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
      // switch user id to name 
      console.log('this.newFlatNodeDataView  handele ------>> ', this.newFlatNodeDataView);
      this.newFlatNodeDataView.forEach(item =>{
        var newArr = []
        this.userInfo.forEach( u =>{
          if(item.auditByUsers[0] == u.userId || item.auditByUsers[0] == u.userName){
            newArr.push(u.userName)
          }
        })
        item.auditByUsers = newArr
      })

      this.newFlatNodeDataView.forEach(item =>{
        var newArr2 = []
        item.auditByGroups.forEach(id =>{
          this.department.forEach(d =>{
            if(id == d.defineId){
              newArr2.push(d.defineName)  
            } 
          })
        })
        item.auditByGroups = newArr2
      })
    },





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

      if(row.auditByUsers.length !== 0){
        var currentUser = this.userInfo.filter(u => u.userName == row.auditByUsers[0])
        row.auditByUsers = []
        row.auditByUsers.push(currentUser[0].userId)
      } else {
        var currentGroup = this.department.filter(u => u.defineName == row.auditByGroups[0])
        row.auditByGroups = []
        row.auditByGroups.push(currentGroup[0].defineId)
      }
      


      sessionStorage.setItem('workflowNode', JSON.stringify(row))
      sessionStorage.setItem('pageAction', JSON.stringify("edit"))
      this.$router.push({name: 'nodeSetting'})
    },


    // 刪除 node
    deleteRow(id){
      this.fullscreenLoading = true
      var rowPosition = this.newFlatNodeDataView.findIndex( e =>(
        e.id == id
      ))
      this.newFlatNodeDataView.splice(rowPosition , 1)
      sessionStorage.removeItem('newWorkFlow')
      sessionStorage.setItem('reNewNode', JSON.stringify(this.newFlatNodeDataView))

      this.fullscreenLoading = false
    },


    //addWorkFlow
    addNewFlow() {

      this.newFlatNodeDataView.forEach(d =>{
        delete d.id 
      })
      
      console.log('this.newFlatNodeDataView !!!!!!', this.newFlatNodeDataView)

      this.newFlatNodeDataView.push('null')
      let result = {};
      let nestedObj = result;

      this.newFlatNodeDataView.forEach((element) => {
        if(element !== "null"){
          nestedObj['nextAuditNode'] = element;
          nestedObj = nestedObj['nextAuditNode']
        } else {
          nestedObj['nextAuditNode'] = null;
          nestedObj = nestedObj['nextAuditNode']
        }
      });

      // console.log('result ', result)
      var toApiData = {...this.workflowDetail, ...result}
      creadNewFlow(toApiData).then(res=>{
          this.$router.push({name: 'workflowManage'})
          console.log('res', res)
        }).catch(err => {
          console.log('error' + err);

          if(this.workflowDetail.name == ''){
            util.notify(this.$t('audit.workFlows.cantEmptyWorkflowName'), 'error', 2000 );
            this.$refs.workflowName.focus()
          } else {
            util.notify(this.$t('audit.workFlows.cantRepeatWorkflowName'), 'error', 2000 );
            this.$refs.workflowName.focus()
          }
          
          this.newFlatNodeDataView.pop()
          
      });

    }
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
  
  .el-table__row
    &:first-child
      .el-table_1_column_6
        .cell
          display: none !important
  .title-status
    .el-input__count-inner
      margin-top: 55px
</style>