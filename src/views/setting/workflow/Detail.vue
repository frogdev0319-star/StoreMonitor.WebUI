<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      流程配置
      <div class="spacer"/>
      <div class="buttons">
        <delay-button type="filled" @click="submit">保存並發布</delay-button>
        <!-- <delay-button
          type="filled"
          class="schedule-btn">
          <div class="button-area">
            <span>保存並發布</span>
          </div>
        </delay-button> -->
      </div>
    </div>
    <!-- 基本信息 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table table-name="基本信息">
            <template slot="tableDetail">

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">* 流程名稱</div>
                <div class="title-status"> 
                  <el-input
                    :placeholder="nodeDataToApi.name"
                    v-model="nodeDataToApi.name"
                    />
                </div>

                <div class="title-name">* 流程分類</div>
                <div class="title-status"> 
                  <el-select
                    v-model="curTemplateIndex"
                    class="device-select"
                    placeholder="巡檢表單"
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
              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">流程描述</div>
                <div class="title-status"> 
                  <el-input
                    v-model="nodeDataToApi.description"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="流程描述"
                    class="storevue-textarea"
                    type="textarea"
                    resize="none"
                  />
                </div>
              </div>
            </template>
          </setting-table>
        </div>

        <!-- 流程配置 -->
        <div class="inspect-basic">
          <!-- btn -->
          <div class="buttons add-node-btn">
            <el-button
              @click="addNode"
              class="storevue-button-outlined"
              size="mini" type="primary">
              <i class="iconfont el-icon-plus"/>
              添加審核節點
            </el-button>
          </div>

          <setting-table table-name="流程配置">
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
            <div class="title-name">添加流程抄送人</div>
            <div class="title-status">
              <el-select v-model="ccTo" multiple placeholder="请选择">
                <el-option
                  v-for="item in ccToSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
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
        <div class="dialog-content">確認刪除當前簽核流程節點？ </div>
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
      ccToSelect: [{
        value: '總經理',
        label: '總經理'
      }, {
        value: '加盟主 A',
        label: '加盟主 A'
      }, {
        value: '加盟主 B',
        label: '加盟主 B'
      }, {
        value: '加盟主 C',
        label: '加盟主 C'
      }, {
        value: '店長',
        label: '店長'
      }],
      ccTo: [],

      showSingleDeleteContent:false,
      dataFromRoute: {},
      workflowDetail: {},
      templateList: ['巡檢表單'],
      curTemplateIndex:'',
      basicList: [],
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
            text: '上移',
            methods: 'moveUp'
          },
          {
            text: '下移',
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
          'label': '節點名稱',
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'auditByUsers',
          'label': '審批人',
          'width': 110,
          'maxWidth': 110,
          'auditByUsers': true,
        },
        {
          'prop': 'auditMethod',
          'label': '審批方式',
          'width': 100,
          'maxWidth': 100,
          'auditMethod': true,
        },
        {
          'prop': 'signature',
          'label': '是否需要簽名',
          'width': 100,
          'maxWidth': 100,
          'signature': true,
        },
        
      ],
      indexType: true,
      penSrc: require('../../../../static/img/table-edit.png'),
      deleteSrc: require('../../../../static/img/table-delete.png'),
      rowId:''

    };
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
  
      await this.handleData() //5
      await this.dataToApi() //6

      this.getDepartmentList()

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
        console.log('getgetDepart  ------>> ', res);

      }).catch(err => {
        console.log('error' + err);
      });
    },





    async getNodeList(id){
      this.isLoadingData = true
      await getNodeList(id).then(res=>{
        this.nodeList =  res.data
        console.log('this.nodeList 4 ------>> ', this.nodeList);
        // flat data
        this.flattenData(this.nodeList)
        this.flatNodeData.forEach(d=>{
          delete d.nextAuditNode
        })
        console.log('this.flatNodeData 4 ------>> ', this.flatNodeData);
        // this.flatNodeData[0].name = this.infoForm.createdUser
        this.flatNodeData[0].name = "提交人"
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
      // const firtData ={
      //   "name": "提交人",
      //   "auditByUsers": ['提交人']
      // }
      // this.flatNodeDataView = [firtData, ...this.flatNodeDataView]
      this.flatNodeDataView.forEach(d=>{
        var newArr = []
        d.auditByUsers.forEach(id=>{
          this.userInfo.forEach(uu=>{
            if(id == uu.userId){
              newArr.push(uu.userName + ",")       
            } 
          })
        })
        // if(d.auditByUsers[0] !== "提交人") d.auditByUsers = newArr
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
            "name": "",
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
                    "text": "拒絕",
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
       // call api for update
      updateWorkflow(this.nodeDataToApi).then(res=>{
        console.log('res :>> ', res);
        this.$router.push({name: 'workflowManage'})
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });

    }
  }

};
</script>

<style lang="sass">

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
    .el-input__inner
        height: 30px
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
  .input-name.el-input--medium >>> .el-input__inner{
    height: 30px;
    line-height: 30px;
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
    padding-left: calc(30/1920*100vw);
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: 15%;
    text-align: left;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    width: 20%;
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
    color: #424151;
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