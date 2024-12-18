<template>
  <div>
    <div class="flex-column" style="height: calc(100% - 20px)">
      <div class="el-audit-header">
        
        <div class="el-audit-header">
            <div class="flex-center" style="justify-content: space-between; margin: 20px 0 20px 0px;font-size:calc(16/1920*100vw)">
              <!-- 時間範圍 -->
              <div class="flex-center">
                  <date-time-selector
                      ref="eventTimePicker"
                      :date-time-value = "dateValue"
                      @change="onDateChange"
                  />
              </div>
              <!-- 關鍵字 -->
              <div class="flex-center">
                  <span style="margin-right: 10px; white-space:nowrap;">{{ $t('remotePatrol.keywords') }}</span>
                  <el-input
                      v-model="inputSearchValue"
                      size="small"
                      class="search-input shadow-light"
                      clearable/>
              </div>
              <delay-button
                  class="search-button"
                  style="background-color:#556679;border:none;"
                  type="primary"
                  size="mini"
                  @click="onSearchClick"
                  >
                  <span>{{ $t('remotePatrol.search') }}</span>
              </delay-button>
            </div>
        </div>
      </div>


      <div class="el-table-content" >
        <el-tabs  v-model="activeName" @tab-click="onTabClick">
            <el-tab-pane
              v-for="(item,index) in tableDataList"
              :key="'sendAudit'+index"
              :label="item.label"
              :name="item.name">
          
              <div class="tablelist_workflows">
                <table-only
                  ref="elTP"
                  class="log_table"
                  :column-data="item.columnData"
                  :table-data="item.tableData"
                  :highlight-current-row= "false"
                  :is-loading-data="isLoadingData"
                  :allowRowExpand = "false"
                  :showBorder = "false"
                  :default-sort = defaultSort
                  :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                  :tableHeight = "760"
                  :cellStyle="{backgroundColor: '#fff !important'}"

                />
              </div>
              <div class="page-area">

                <div class="pagination_row"  v-if="totalEvents > 0"> 
                  <div class="pageSizeTitle" style="color: #666">共有 <b style="font-size: 16px"> {{totalEvents}} </b> {{ $t('remotePatrol.numReports') }}</div>

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

              </div>
            </el-tab-pane>
        </el-tabs>
        </div>
    </div>
  </div>
</template>
<script>
import { fetchLog } from '@/api/reportAndEvent';
import { getUserInfo, getAllUserInfoNoAuth} from '@/api/login';
import { mapGetters } from 'vuex';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowList',
  components: {
    TableOnly,
    DateTimeSelector,
    TblPaginationOnly,
    DelayButton,
    DialogPop
  },
  data() {
    return {
      inputSearchValue: '',
      searchData: [],
      isLoadingData: false,

      dateValue:[],
      allTableData:[],
      allWorkflowList:[],
      tableData: [],
      defaultSort:{order:'descending', prop:'updateTs'},

      actionType: 0,
      userInfo: [],
      activeName:'0',
      tableDataList:[
        {
          label: this.$t('route.deleteReport'),
          name: '0',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'userName',
              'label': this.$t('addition.operator'),
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'logContent',
              'label': this.$t('immediatePush.messageContent'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'actionTs',
              'label': this.$t('addition.OperatingTime'),
              'width': 200,
              'maxWidth': 200,
            },
            
          ],
        },
        {
          label: this.$t('addition.insertPassword'),
          name: '1',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'userName',
              'label': this.$t('addition.operator'),
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'logContent',
              'label': this.$t('immediatePush.messageContent'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'actionTs',
              'label': this.$t('addition.OperatingTime'),
              'width': 200,
              'maxWidth': 200,
            },
          ],
        },
        

      ],

      total: 50,
      currentPage: 1,
      curSizeNum: 10,
      sizeNum: 2,
      totalEvents: 0,


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
      this.currentPage = 1;
      if(val.trim()!=""){
        this.allTableData =this.allWorkflowList.filter(item => (
          item.name.indexOf(val) > -1 
        ))
        this.setTableBySearch();
      } else {
        // this.getWorkflowList(this.apiBody);
      }
    }
  },
  methods: {

    async init(){      
    
      await this.getUserInfo()
      await this.getLog(0)

      var initDate = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      const start = typeof (initDate[0]) === 'object' ? initDate[0].getTime() : initDate[0];
      const end = typeof (initDate[1]) === 'object' ? initDate[1].getTime() : initDate[1];
      this.dateValue = [new Date().setTime(start), new Date().setTime(end)];


    },

    async onTabClick(val){
      var n =  Number(val.index)
      this.currentPage = 1
      this.actionType = n

      await this.getLog(n)
    },


    async getLog(typeN){
      this.isLoadingData = true
      console.log('this.dateValue getLog :>> ', this.dateValue);

      var param = {
        beginTs: this.dateValue[0],
        endTs: this.dateValue[1],
        actionType: typeN + 1,
        filter: {
          page: this.currentPage - 1,
          size: this.curSizeNum
        },
        order: {
            direction: "desc",
            property: "ts",
        },
        keyword: this.inputSearchValue ? this.inputSearchValue : ''
      }
      
      console.log('param :>> ', param); 

      await fetchLog(param).then(res=>{
        console.log('res.data.content  ======>> ', res.data.content);
        console.log('this.userInfo   ======>> ', this.userInfo);

        res.data.content.forEach( d => {
          this.userInfo.forEach( n => {
            if(d.userId == n.userId){
              d.userName = n.userName
            }
            if(d.systemContent.reportSubmitter == n.userId){
              d.systemContent.reportSubmitterName = n.userName
            }

            if(d.systemContent.reportTs) d.systemContent.reportTs = this.getdate(d.systemContent.reportTs)
            if(d.systemContent.eventTs) d.systemContent.eventTs = this.getdate(d.systemContent.eventTs)

            d.actionTs = this.getdate(d.actionTs)
          })
        })

        if(typeN == 0){
          var temp = res.data.content.map( i => ({
            userName : i.userName,
            logContent: `${i.systemContent.storeName } / ${i.systemContent.inspectTable} / ${i.systemContent.reportSubmitterName} / ${this.$t('addition.OperatingTime')} ${i.systemContent.reportTs} / ${this.$t('addition.deleted')}`,
            actionTs: this.getdate(i.actionTs)
          }))
          this.total = res.data.totalPages
          this.totalEvents = res.data.totalElements
        }
        else if(typeN == 1){
          var temp = res.data.content.map( i => ({
            userName : i.userName,
            logContent: `${i.systemContent.storeName } / ${i.systemContent.inspectTable} / ${this.$t('addition.event')}  ${i.systemContent.eventSubject} / ${this.$t('addition.eventTime')} ${i.systemContent.eventTs} / ${this.$t('addition.ChangeToUnprocessed')}`,
            actionTs: this.getdate(i.actionTs)
          }))
          this.total = res.data.totalPages
          this.totalEvents = res.data.totalElements
        }
        
        this.tableDataList[typeN].tableData = temp
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });

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
        }).catch(err => {
          console.log('error' + err);
        });
    },

    onDateChange(val) {
      const self = this;
      const tabIndex = Number(self.curTabIndx);
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
      self.inputSearchValue = '';
      console.log('this.dateValue :>> ', this.dateValue);

    },

    onSearchClick() {
      console.log('this.dateValue onSearchClick :>> ', this.dateValue);
      console.log('this.actionType :>> ', this.actionType);
      this.getLog(this.actionType)
    },


    handlePagination(pageInfo){

      console.log('pageInfo ~~~~~>> ', pageInfo);

      this.currentPage = pageInfo.page
      this.curSizeNum = pageInfo.size;
      
      this.getLog(this.actionType)
      // this.init()
      // if(this.inputSearchValue.trim()=="") this.getWorkflowList(this.apiBody);
      // else this.setTableBySearch()
      
    },

    setTableBySearch() {
      this.total = Math.ceil(this.allTableData.length/this.apiBody.size);
      if( this.apiBody.property=='createdTs'|| this.apiBody.property=="updateTs"){
        if( this.apiBody.direction=='ASC'){
          util.sortArrayByKeyAsc(this.allTableData,this.apiBody.property)
        }else{
          util.sortArrayByKeyDesc(this.allTableData,this.apiBody.property)
        }
      }
      this.searchData = [];
      this.searchData = [...this.allTableData.slice( (this.currentPage - 1)* this.curSizeNum, this.currentPage* this.curSizeNum)];
    },

    
  },
};
</script>

<style lang="sass" >
  .log_table
    .table .el-table
      padding: 10px 0
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
    td, th
      padding-left: 0 !important
      .cell
        padding-left: 12px !important
      
    td, th
      &:nth-child(1)
        width: 12% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important
      &:nth-child(3)
        width: 15% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important

    .el-table .cell
      text-align: left !important
      

  .el-table-content
    width: 100%
    background-color: #fff
    border-radius: 5px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
    position: relative
    padding-top: calc(30/1920*100vw)
    .list-table
      .table-white 
        /deep/
        .el-table
          box-shadow: none !important
          border: none !important
          background-color: #fff
          padding-left: 12px
          padding-right: 12px


  .el-audit-header
    .search-button
      float: right
      color:#FFF
      &:hover
        background-color: #3d4854
        color:#FFF






    
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
        position: fixed
        width: 500px
        height: fit-content
        font-size: 13px
        line-height: 1.5
        padding: 10px
        background: rgba(0,0,0,.75)
        color: #fff
        border-radius: 3px
        z-index: 1000
        display: none

  .forWorkflowsSwitch
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    
  .width-fit
    width: max-content !important
  
  .pagination_row
    //position: absolute;
    height: 30px
    margin: 30px 0
    margin-right: calc(20/1920*100vw)
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
    


</style>
