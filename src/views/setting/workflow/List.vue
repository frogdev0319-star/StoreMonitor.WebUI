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
            placeholder="搜尋流程名稱"
            clearable/>
        </div>

        <delay-button @click="creadNewFlow">
          <div class="button-area">
            <i class="iconfont el-icon-plus"/>
            <span>添加流程</span>
          </div>
        </delay-button>

      </div>
      <div class="tablelist">
        
        <table-only
          ref="elTP"
          class="table-white"
          :column-data="columnData"
          :table-data="serachData"
          :table-operation ="columnOperationData"
          :highlight-current-row= "false"
          :is-loading-data="isLoadingData"
          :allowRowExpand = "false"
          :showBorder = "false"
          :default-sort = "{prop: 'createTime', order: 'descending'}"
          :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
          :tableHeight = "760"
          :cellStyle="{backgroundColor: '#fff !important'}"
          @handleOperation="handleEmitOperation"
          @handleSwitchChange="handleSwitchChange"
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
      :title="$t('insSettingView.confirmDelete')"
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
        <div class="dialog-content">確認刪除當前簽核流程？ </div>
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
import { getUserInfo } from '@/api/login';
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
      serachData: [],
      authorizedDevicesNum: 0,
      isLoadingData: false,
      showSingleDeleteContent: false,
      deletedProcessDefinitionKey: '',
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '134',
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
      tableData: [],
      columnData: [
        // {
        //   'prop': 'index',
        //   'label': 'index',
        //   'width': 50,
        //   'maxWidth': 50,
        // },
        {
          'prop': 'name',
          'label': '名稱',
          'width': 180,
          'maxWidth': 150,
        },
        {
          'prop': 'type',
          'label': '流程分類',
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'createdUser',
          'label': '創建人',
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'description',
          'label': '流程描述',
          'width': 130,
          'maxWidth': 130,
        },
        {
          'prop': 'createdTs',
          'label': '創建時間',
          'width': 130,
          'maxWidth': 130
        },
        {
          'prop': 'state',
          'label': '綁定狀態',
          'width': 80,
          'maxWidth': 100,
          'forWorkflowsSwitch': true,
        },
      ],
      total: 5,
      currentPage: 1,
      sizeNum: 10,
      apiBody: {
          "page": 0,
          "size": 10,
          "direction": "DESC",
          "property": "createdTs",
          // "name": "test",
          // "type": 0,
          "state": [
              0,
              1,
          ]
      },
      newFlow:{
        "name": "",
        "description": "",
        "type": 0,
        "copyToUsers": [],
        "copyToGroups": [],
        "nextAuditNode": {
          "name": "default flow",
          "auditMethod": 1,
          "signature": true,
          "customButton": [
              {
                  "type": 1,
                  "text": "同意",
                  "enable": true
              },
              {
                  "type": 1,
                  "text": "拒絕",
                  "enable": true
              }
          ],
          "auditByUsers": [],
          "auditByGroups": [],
          "nextAuditNode": {
            "name": "default flow 1",
            "auditMethod": 1,
            "signature": true,
            "customButton": [
                {
                    "type": 1,
                    "text": "同意",
                    "enable": true
                },
                {
                    "type": 1,
                    "text": "拒絕",
                    "enable": true
                }
            ],
            "auditByUsers": [],
            "auditByGroups": [],
          }
        },
      }
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
      this.serachData = this.allTableData.filter(item => (
        item.name.indexOf(val) > -1
      ))
    }
  },
  methods: {
    async init(){      

      await this.getUserInfo()
      const data = sessionStorage.getItem('pageInfo')
      const pageInfo = JSON.parse(data)
      if(pageInfo == undefined){
        await this.getWorkflowList(this.apiBody);
      }else{
        const newApiBody = {...this.apiBody, size:pageInfo.size, page: pageInfo.page - 1}

        this.currentPage = pageInfo.page
        // console.log('newApiBody :>> ', newApiBody);
        await this.getWorkflowList(newApiBody);
      }
    },

    async getUserInfo(){
      await getUserInfo().then(res=>{
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
              d.createdTs = new Date(d.createdTs).toLocaleString()
              d.type = "巡檢表單"
              d.index = res.data.content.indexOf(d) + 1
            }
          })
        ))

        this.allTableData = res.data.content
        this.serachData = this.allTableData

        this.total = res.data.totalPages

        console.log('this.total :>> ', this.total);
        console.log('getWorkflowList 2 ======>> ', res.data.content);

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },
    creadNewFlow(){
      var time = new Date()
      var theTime = time.getTime()
      var t = {
          year: time.getFullYear(),
          month: ((time.getMonth() + 1) < 10) ? '0' + (time.getMonth() + 1).toString() : (time.getMonth() + 1).toString(),
          date: (time.getDate() < 10) ? '0' + time.getDate().toString() : time.getDate().toString(),
          hour: (time.getHours() < 10) ? '0' + time.getHours().toString() : time.getHours().toString(),
          minute: (time.getMinutes() < 10) ? '0' + time.getMinutes().toString() : time.getMinutes().toString(),
          second: (time.getSeconds() < 10) ? '0' + time.getSeconds().toString() : time.getSeconds().toString()
        }
      const createTime = t.year + "-" + t.month + "-" + t.date + " " + t.hour + ":" + t.minute + ":" + t.second
      this.newFlow.name = "新增流程 " + createTime

      creadNewFlow(this.newFlow).then(res=>{
          this.newFlow.processDefinitionKey = res.data
          sessionStorage.setItem('workflowDetail', JSON.stringify(this.newFlow)) 
          this.$router.push({name: 'workflowDetail'})
        }).catch(err => {
          console.log('error' + err);
      });
    
    },
    
    handleEmitOperation({ method, row }) {
      console.log('List row =====>> ', row);
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
            this.$message({
              type: 'error',
              message: '已綁定簽核流程無法刪除'
            }); 
          }
          
          console.log('row :>> ', row);
          break;      
        }
        default: {
          break;
        }
      }
    },

    settingWorkFlow(row){
      this.$router.push({name: 'workflowDetail'})
      sessionStorage.setItem('workflowDetail', JSON.stringify(row))
    },

    duplicateRow(processDefinitionKey){
      const postforms = new FormData()
      postforms.append('processDefinitionKey', processDefinitionKey)
      // console.log('postforms0000 :>> ', postforms);
      // console.log('processDefinitionKey :>> ', processDefinitionKey);
      duplicateRow(postforms).then(res=>{
        console.log('res :>> ', res);
        this.$message({
          type: 'success',
          message: '已成功複製流程'
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
          message: '删除成功!'
        })
      
      }).catch(err => {
        this.isLoadingData = false
        this.showSingleDeleteContent = false
        console.log('error' + err);
        this.$message({
          type: 'error',
          message: '删除失敗!'
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
    // open lightbox
    // open(processDefinitionKey) {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.deleteRow(processDefinitionKey)
    //     this.$message({
    //       type: 'success',
    //       message: '删除成功!'
    //     });
    //   }).catch(() => {
    //     // this.$message({
    //     //   type: 'info',
    //     //   message: '已取消删除'
    //     // });          
    //   });
    // },




    handlePagination(pageInfo){
      sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo))
      const newApiBody = {...this.apiBody, size:pageInfo.size, page: pageInfo.page - 1}
      this.apiBody = []
      this.apiBody = newApiBody
      this.currentPage = pageInfo.page
      this.inputSearchValue = ''
      // console.log('pageInfo :>> ', pageInfo);
      console.log('this.apiBody :>> ', this.apiBody);
      this.init()
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
      if (checked) {
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
</style>
