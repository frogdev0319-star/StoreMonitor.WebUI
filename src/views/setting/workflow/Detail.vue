<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      {{$t('audit.workFlows.workFlowConfiguration')}}
      <div class="spacer"/>
      <div class="buttons">
        <delay-button type="filled" @click="submit">  {{$t('audit.workFlows.saveAndPublic')}}</delay-button>
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
                  <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.basicInformation')}}</div>
                  <div class="title-status"> 
                    <el-input
                      :placeholder="nodeDataToApi.name"
                      v-model="nodeDataToApi.name"
                      style="width: 250px"
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

        <!-- 流程配置 -->
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

          <setting-table :table-name="$t('audit.workFlows.workFlowConfiguration')">
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
import {getNodeList, updateWorkflow} from "@/api/workflow";
import {getUserTitleList } from "@/api/title";
import {getUserInfo} from '@/api/login';
import {getDepartmentList } from '@/api/checkin';


import TableOnly from '@/components/TableOnly';
import DialogPop from '@/components/DialogPop';

import MultiSelect from '@/components/MultiSelect';
import util from "@/common/util";
import t from '../../../../static/ezuikit/ezuikit_China/ezuikit';
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
      department : ''
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
      await this.getWorkflowInfo() //1 

      await this.getNodeList(this.infoForm.processDefinitionKey) //4

      await this.getTitle() //3
      await this.getUserInfo() //2
      await this.getDepartmentList() //7

  
      await this.handleData() //5
      await this.dataToApi() //6

    },

    needNote(){
      util.notify('※ 此模式不會立即產生事件 ', 'warning', 3000);
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
        console.log('getWorkflowInfo 2 ------>> ', this.userInfo);

      }).catch(err => {
        console.log('error' + err);
      });
    },
    // get title
    getTitle(){
      getUserTitleList().then(res=>{
        this.titleList =  res.data
        console.log('this.titleList 3 ------>> ', this.titleList);

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    // get getDepart
    async getDepartmentList(){
      await getDepartmentList({ type: 0 }).then(res=>{
        this.department = res.data
        console.log('this.department 7 ------>> ', this.department);
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
                    "enable": false
                }
            ],
            "auditByUsers": [],
            "auditByGroups": []
        }
      sessionStorage.setItem('workflowNode', JSON.stringify(newNode))
      this.$router.push({ name: 'nodeSetting' })
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
          message: '流程順序已修改。'
        })
      }).catch(err => {
        this.fullscreenLoading = false
        console.log('error' + err);
      });
    },

    hideDeleteContentDialog(key) {
      this[key] = false;
    },
    confirmDeleteSingle(id){
      console.log('Let me delete value', id);
      this.deleteRow(id)
      
      this.showSingleDeleteContent = false
    },



    settingWorkFlow(row){
      this.$router.push({name: 'nodeSetting'})
      // 刪除  "isEditing": false
      var oriData = this.flatNodeData.filter(f => row.id === f.id)
      delete row.isEditing
      sessionStorage.setItem('workflowNode', JSON.stringify(oriData[0]))
    },
          // sessionStorage.setItem('nodeDataToApi', JSON.stringify(this.nodeDataToApi))

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
          message: '删除成功!'
        })

      }).catch(err => {
        this.fullscreenLoading = false;
        console.log('error' + err);
      });
    },

    //保存並發布
    submit() {
      
      // setting CC users
      this.nodeDataToApi.copyToUsers = this.ccToUSer

       // call api for update
      updateWorkflow(this.nodeDataToApi).then(res=>{
        console.log('res :>> ', res);
        this.$router.push({name: 'workflowManage'})
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
        util.notify('此簽核流程名稱已存在', 'error', 3000);

      });

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
</style>