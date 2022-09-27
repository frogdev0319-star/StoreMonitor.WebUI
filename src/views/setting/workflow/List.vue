<template>
  <div>
    <div>
      <div class="workflow-header">
        <div class="flex-center">
          <el-input
            v-model="inputSearchValue"
            size="small"
            prefix-icon="el-icon-search"
            class="search-input shadow-light"
            :placeholder="$t('audit.workFlows.searchPlaceholder')"
            clearable/>
        </div>
        <!-- 新增流程 -->
        <delay-button @click="creadNewFlow">
          <div class="button-area">
            <i class="iconfont el-icon-plus"/>
            <span>{{$t('audit.workFlows.addWorkFlow')}}</span>
          </div>
        </delay-button>
      </div>
      <div class="tablelist_workflows">
        <table-only
          ref="elTP"
          class="table-white"
          :column-data="columnData"
          :table-data="searchData"
          :table-operation ="columnOperationData"
          :highlight-current-row= "false"
          :is-loading-data="isLoadingData"
          :allowRowExpand = "false"
          :showBorder = "false"
          :default-sort = defaultSort
          :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
          :tableHeight = "760"
          :cellStyle="{backgroundColor: '#fff !important'}"
          @handleOperation="handleEmitOperation"
          @handleSwitchChange="handleSwitchChange"
          @cantCloseAlertPopup = "cantCloseAlertPopup"
          @sortChange="sortChange"

        />
      </div>
    </div>
    <div style="width:100%; margin-top:12px;height:31px;">
      <tbl-pagination-only
        :btn-style="{backgroundColor:'transparent'}"
        :total="total"
        :current-page="currentPage"
        :page-size="sizeNum"
        layout = "total, prev, pager, next, sizes, slot"
        @sizeChange="handlePagination"
        @currentChange="handlePagination"
      />
    </div>

    <!-- popup -->
    <dialog-pop
      :title="$t('audit.workFlows.comfirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showSingleDeleteContent"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showSingleDeleteContent')"
      @cancelHandler="hideDeleteContentDialog('showSingleDeleteContent')"
      @confirmHandler="confirmDeleteSingle(deletedProcessDefinitionKey)"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{$t('audit.workFlows.comfirmDelete')}} </div>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('audit.workFlows.canNotDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="cantDeleteAlert"
      :isWarning="true"
      :showCancelbtn = "false"
      class="alert-popup"
      @confirmHandler="cantDeleteAlert = false"
    >
      <div class="dialog-slot">
        <div class="dialog-content"> 
          {{$t('audit.workFlows.makeSureUsign')}}<br>
          <b> 「 {{cantDeleteList}} 」</b>
          
        </div>
      </div>
    </dialog-pop>

  <dialog-pop
      :title="$t('audit.workFlows.canNotClose')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="cantCloseAlert"
      :isWarning="true"
      :showCancelbtn = "false"
      class="alert-popup"
      @confirmHandler="cantCloseAlert = false"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          {{$t('audit.workFlows.makeSureUsign')}} <br>
          <b> 「 {{cantCloseList}} 」</b>
        </div>
      </div>
    </dialog-pop>


  </div>
</template>
<script>
import {
    creadNewFlow,
    getWorkflowList, 
    duplicateRow, 
    deleteRow, 
    disableWorkflow, 
    enableWorkflow
  } from '@/api/workflow';
import { getUserInfo, getAllUserInfoNoAuth} from '@/api/login';
import { mapGetters } from 'vuex';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';

import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowList',
  components: {
    TableOnly,
    TblPaginationOnly,
    DelayButton,
    DialogPop
  },
  data() {
    return {
      inputSearchValue: '',
      searchData: [],
      authorizedDevicesNum: 0,
      isLoadingData: false,
      showSingleDeleteContent: false,
      cantDeleteAlert: false,
      cantCloseAlert: false,
      cantDeleteList: '',
      cantCloseList:'',

      deletedProcessDefinitionKey: '',
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '100',
        align: 'center',
        operation: [
          {
            lable: '',
            icon: 'icon-copy',
            methods: 'copy'
          },
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
      userInfo: [],
      allTableData:[],
      allWorkflowList:[],
      tableData: [],
      defaultSort:{order:'descending', prop:'updateTs'},
      columnData: [
        // {
        //   'prop': 'index',
        //   'label': 'index',
        //   'width': 50,
        //   'maxWidth': 50,
        // },
        {
          'prop': 'name',
          'label': this.$t('audit.workFlows.workFlowsName'),
          'width': 200,
          'maxWidth': 200,
        },
        {
          'prop': 'type',
          'label': this.$t('audit.workFlows.workFlowClassification'),
          'width': 50,
          'maxWidth': 50,
        },
        {
          'prop': 'createdUser',
          'label': this.$t('audit.workFlows.workFlowsCreatedUser'),
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'description',
          'label': this.$t('audit.workFlows.workFlowsDescription'),
          'width': 230,
          'maxWidth': 230,
          'forDescription': true
        },
        {
          'prop': 'createdTs',
          'label': this.$t('audit.workFlows.workFlowsCreatedTs'),
          'width': 130,
          'maxWidth': 130,
          'sortable': true
        },
        {
          'prop': 'updateTs',
          'label': this.$t('audit.workFlows.workFlowsUpdateTs'),
          'width': 100,
          'maxWidth': 100,
          'sortable': true
        },
        {
          'prop': 'updatedUser',
          'label': this.$t('audit.workFlows.workFlowsUpdateUser'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'state',
          'label': this.$t('audit.workFlows.workFlowsStauts'),
          'width': 100,
          'maxWidth': 100,
          'forWorkflowsSwitch': true,
        },
      ],
      total: 5,
      currentPage: 1,
      sizeNum: 50,
      apiBody: {
          "page": 0,
          "size": 10,
          "direction": "DESC",
          "property": "updateTs",
          "state": [
              0,
              1,
          ]
      },

    }
  },
  mounted() {
    
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch:{
    accountChanged(val) {
      val !== 0 && this.init();
    },

    // for search
    inputSearchValue(val){
      if(val){
        this.searchData =this.allWorkflowList.filter(item => (
          item.name.indexOf(val) > -1 
        ))
      } else {
        this.searchData = this.allTableData
      }
    }
  },
  methods: {
    async init(){      
      await this.getUserInfo()
      this.inputSearchValue="";
      const data = sessionStorage.getItem('pageInfo')
      const pageInfo = JSON.parse(data)
      if(pageInfo == undefined){
        await this.getWorkflowList(this.apiBody);
      }else{
        const newApiBody = {...this.apiBody, page: pageInfo.page - 1}
        this.currentPage = pageInfo.page
        // console.log('newApiBody :>> ', newApiBody);
        await this.getWorkflowList(newApiBody);
      }
      sessionStorage.removeItem('pageAction')

      await this.getAllWorkflowList()
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },

    getdate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + "-"+ month +"-"+ day +" "+ hour +":"+ min +":"+ sec
    },

    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
          this.userInfo = res.data
          console.log('this.userInfo 1 ======>> ', this.userInfo);
        }).catch(err => {
          console.log('error' + err);
        });
    },

    async getWorkflowList(param){
      this.isLoadingData = true
      await getWorkflowList(param).then(res=>{
        res.data.content.map(d => (
          this.userInfo.forEach(user => {
            if(d.createdUser === user.userId){
              d.createdUser = user.userName
              d.createdTs = this.getdate(d.createdTs)
              d.updateTs = this.getdate(d.updateTs)
              d.type =  this.$t('audit.workFlows.inspectionForm')
              d.index = res.data.content.indexOf(d) + 1
              d.state = d.state.toString()
            }
            if(d.updatedUser === user.userId){
              d.updatedUser = user.userName
            }
          })
        ))

        console.log('res.data 2 ======>> ', res.data);
        this.allTableData = res.data.content
        this.searchData = this.allTableData

        this.total = res.data.totalPages

        // console.log('this.total :>> ', this.total);
        console.log('getWorkflowList 2 ======>> ', this.searchData );

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    async getAllWorkflowList(){
      const allList = {
        "page": 0,
        "size": 10000,
        "direction": "DESC",
        "property": "createdTs",
        "state": [
            0,
            1
        ]
      }
      await getWorkflowList(allList).then(res=>{
        res.data.content.map(d => (
          this.userInfo.forEach(user => {
            if(d.createdUser === user.userId){
              d.createdUser = user.userName
              d.createdTs = this.getdate(d.createdTs)
              d.updateTs = this.getdate(d.updateTs)
              d.type = this.$t('audit.workFlows.inspectionForm')
              d.index = res.data.content.indexOf(d) + 1
              d.state = d.state.toString()
            }
            if(d.updatedUser === user.userId){
              d.updatedUser = user.userName
            }
          })
        ))
        this.allWorkflowList = res.data.content
        console.log('this.allWorkflowList :>> ', this.allWorkflowList);
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },

    creadNewFlow(){
      sessionStorage.removeItem('workflowDetail')
      sessionStorage.removeItem('newWorkFlow')
      sessionStorage.removeItem('reNewNode')

      // CreateWorkflow 判斷是否選過的簽核人員或部門，預設狀態
      var default_auditMembers = {"auditByUsers":[],"auditByGroups":[]}
      sessionStorage.setItem('auditMembers', JSON.stringify(default_auditMembers))

      // CreateWorkflow 新增節點需要狀態
      var createNewNodeNeed = {"orderedAuditNodeArray":[]}
      sessionStorage.setItem('nodeDataToApi', JSON.stringify(createNewNodeNeed))

      sessionStorage.setItem('pageAction', JSON.stringify("init"))
      this.$router.push({name: 'createWorkflow'})
    },



    sortChange(order, defaultSort){

        // console.log('order ~~~~~>> ', order);
        // console.log('defaultSort ~~~~~>> ', defaultSort);
        this.isLoadingData = true
        this.apiBody.direction = order.direction.toUpperCase()
        this.apiBody.property = order.property

        console.log('this.apiBody sss ~~~~~>> ', this.apiBody);

        this.getWorkflowList(this.apiBody);
    },


      handlePagination(pageInfo){
      // sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo))

      // const newApiBody = {...this.apiBody, size:pageInfo.size, page: pageInfo.page - 1}
      // this.apiBody = []
      // this.apiBody = newApiBody

      console.log('pageInfo ppp ~~~~~>> ', pageInfo);

      this.currentPage = pageInfo.page
      this.inputSearchValue = ''
      this.apiBody.page =  pageInfo.page - 1
      this.apiBody.size =  pageInfo.size

      console.log('this.apiBody ~~~~~>> ', this.apiBody);

      // this.init()
      this.getWorkflowList(this.apiBody);
    },




    
    handleEmitOperation({ method, row }) {
      switch(method){
        case 'copy':{
          this.duplicateRow(row.processDefinitionKey)
          break;
        }
        case 'set':{
          this.settingWorkFlow(row)
          break;      
        }
        case 'delete':{
          if(!row.isBind){
            this.showSingleDeleteContent = true
            this.deletedProcessDefinitionKey = row.processDefinitionKey
          }else{
            this.cantDeleteAlert = true
            this.cantDeleteList = row.inspectTagName.replaceAll(',', '、')
            
          }
          break;      
        }
        default: {
          break;
        }
      }
    },

    cantCloseAlertPopup(row){
      this.cantCloseAlert = true
      this.cantCloseList = row.inspectTagName.replaceAll(',', '、')
    },

    settingWorkFlow(row){
      // if(row.state == 0){
      //   util.notify(this.$t('audit.workFlows.cantDisabledEdit'), 'error', 2000 );
      //   return
      // } else {
        var createNewNodeNeed = {"orderedAuditNodeArray":[]}
        sessionStorage.setItem('nodeDataToApi', JSON.stringify(createNewNodeNeed))

        sessionStorage.setItem('workflowDetail', JSON.stringify(row))
        sessionStorage.setItem('pageAction', JSON.stringify("firstEdit"))
        this.$router.push({name: 'workflowDetail'})

      // }
    },

    duplicateRow(processDefinitionKey){
      const postforms = new FormData()
      postforms.append('processDefinitionKey', processDefinitionKey)
      console.log('postforms0000 :>> ', postforms);
      console.log('processDefinitionKey :>> ', processDefinitionKey);
      duplicateRow(postforms).then(res=>{
        console.log('res :>> ', res);
        this.$message({
          type: 'success',
          message: this.$t('audit.workFlows.dulplicateScuccess')
        });  
        this.init()
      }).catch(err => {
        console.log('error' + err);
      });
    },
    
    deleteRow(processDefinitionKey){
      this.isLoadingData = true
      const rowID = {
        "processDefinitionKeys": [processDefinitionKey]
      }
      deleteRow(rowID).then(res=>{
        this.init()
        this.isLoadingData = false
        this.showSingleDeleteContent = false
        this.$message({
          type: 'success',
          message: this.$t('audit.workFlows.deleteScuccess')
        })
      
      }).catch(err => {
        this.isLoadingData = false
        this.showSingleDeleteContent = false
        console.log('error' + err);
        this.$message({
          type: 'error',
          message: this.$t('audit.workFlows.deleteFail')
        })
      })
    },

    hideDeleteContentDialog(key) {
      this[key] = false;
    },

    confirmDeleteSingle(value){
      console.log('Let me delete value', value);
      this.deleteRow(value)
    },

  

    // handlePageAndSizeChange(pageObj) {
    //   const self = this;
    //   self.page = pageObj.page;
    //   self.sizeNum = pageObj.size;
    //   self.params.filter = { page: self.page - 1, size: self.sizeNum };
    //   self.setPagingTableData();
    // },

    // setPagingTableData(){
    //   this.tableData = [];
    //   this.tableData = [...this.allTableData.slice( (self.page - 1)* this.sizeNum, this.page* this.sizeNum)];
    //   console.log('this.tableData :>> ', this.tableData);
    // },

    

    handleSwitchChange({ checked, target }) {
      console.log('checked :>> ', checked);
      console.log('target :>> ', target);
      if (checked == 1 ) {
        enableWorkflow({
          processDefinitionKeys: [target.processDefinitionKey]
        }).then((res) => {
          if (res.errCode === 0) {
            this.tableData = this.tableData.map(row => {
              return row.processDefinitionKey === target.processDefinitionKey
                ? {
                  ...row,
                  state: true
                }
                : { ...row }
            })
            util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
          }
        }).catch(e => {
          util.notify(this.$t('route.networkError'), 'error', 1000 );
        })
      } else {
        disableWorkflow({
          processDefinitionKeys: [target.processDefinitionKey]
        }).then((res) => {
          if (res.errCode === 0) {
            this.tableData = this.tableData.map(row => {
              return row.processDefinitionKey === target.processDefinitionKey
                ? {
                  ...row,
                  state: false
                }
                : { ...row }
            })
            util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
          }
        }).catch(e => {
          util.notify(this.$t('route.networkError'), 'error', 1000 );
        })
      }
    },
    
  },
};
</script>

<style lang="sass" >
  
  .alert-popup
    .el-dialog__header
      color: #c60957
  .button-area
    height: 23px
    padding: 0 5px

  .tablelist_workflows
    .el-table__header
      width: auto !important

    .el-table__body
      width: auto !important
    

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start
  .el-table
    border: none !important
    
  // .el-button--primary
  //   color: #fff
  //   background-color: #190
  //   border-color: #190

  .el-table__header
    .el-table__cell
      &:nth-child(4)
        width: 250px
      &:nth-child(5), &:nth-child(6)
        width: 250px

  .el-table__row
    .el-table__cell
      &:nth-child(4)
        // width: 220px
        .cell
            overflow: visible
            cursor: default
      &:nth-child(5), &:nth-child(6)
        width: 250px

    .forDescription
      position: relative
      &:hover
        .showDescription
          display: block
      .shortdescription
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        width: 200px
      .showDescription
        position: absolute
        width: 500px
        height: fit-content
        font-size: 13px
        line-height: 1.5
        padding: 10px
        background: rgba(0,0,0,.75)
        color: #fff
        border-radius: 3px
        bottom: -10px
        left: 95%
        z-index: 1000
        display: none
    &:nth-child(-n+5)
      .showDescription
        top: -10px

    



  .forWorkflowsSwitch
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    
  .width-fit
    width: max-content !important
</style>
