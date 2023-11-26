<template>
  <div>
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
                  class="sendingrecord_table"
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
              <!-- <div class="page-area">
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
              </div> -->

            </el-tab-pane>
        </el-tabs>
        </div>


  </div>
</template>
<script>
import { getUserInfo, getAllUserInfoNoAuth} from '@/api/login';

import {getImmediateEventTable} from '@/api/advanceSetting';
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
      isLoadingData: false,
      activeName: "2",
      tableDataList:[
        {
          label: '公告訊息',
          name: '0',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'bulletinSubject',
              'label': '標題',
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'bulletinContent',
              'label': '內容',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'attachments',
              'label': '附件',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sender',
              'label': '發送人',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sendTs',
              'label': '發送時間',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'readStatus',
              'label': '讀取狀態',
              'width': 200,
              'maxWidth': 200,
            },
            
          ],
        },
        {
          label: '即時排程',
          name: '1',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'scheduleName',
              'label': '排程名稱',
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'inspectReport',
              'label': '巡檢表',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'executeTs',
              'label': '執行日期 | 提醒時間',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sender',
              'label': '發送人',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sendTs',
              'label': '發送時間',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'readStatus',
              'label': '讀取狀態',
              'width': 200,
              'maxWidth': 200,
            },
          ],
        },
        {
          label: '即時事件',
          name: '2',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'eventName',
              'label': '事件名稱',
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'attachments',
              'label': '附件',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sender',
              'label': '發送人',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sendTs',
              'label': '發送時間',
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'readStatus',
              'label': '讀取狀態',
              'width': 200,
              'maxWidth': 200,
            },
          ],
        },
        

      ],
      

    }
  },
  mounted() {
    
  },
  created() {
    this.init()
  },
  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch:{
    // accountChanged(val) {
    //   val !== 0 && this.init();
    // },

 
  
  },
  methods: {
    init(){
      this.getInsantEventTable()
    },

    async onTabClick(val){
      var n =  Number(val.index)
      this.currentPage = 1
      this.actionType = n
      
      await this.getTable(n)
      
      
    },

    getTable(typeN){
      this.isLoadingData = true
      var param = {
        beginTs: 1700784000000,
        endTs: 1700866800000,
        keyword: "2023",
        filter: {
            page: 0,
            size: 10
        },
        order: {
            direction: "desc",
            property: "ts"
        }
      }

      if(typeN == "0"){

      }
      else if (typeN == "1"){

      }
      else if(typeN == "2"){
        this.getInsantEventTable()
      }


    },


    async getInsantEventTable(){
      this.isLoadingData = true
      var param = {
        beginTs: 1700409600000,
        endTs: 1700668799999,
        keyword: "2023",
        filter: {
            page: 0,
            size: 10
        },
        order: {
            direction: "desc",
            property: "ts"
        }
      }
      await getImmediateEventTable(param).then(res=>{
        console.log('res.data :>> ', res.data);
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    }

    
  },
};
</script>

<style lang="sass" >
  .sendingrecord_table
    .table .el-table
      padding: 10px 0
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
    td, th
      padding-left: 0 !important
      .cell
        padding-left: 12px !important
      
    // td, th
    //   &:nth-child(1)
    //     width: 12% !important
    //     padding-left: 12px !important
    //     .cell
    //       padding-left: 12px !important
    //   &:nth-child(3)
    //     width: 15% !important
    //     padding-left: 12px !important
    //     .cell
    //       padding-left: 12px !important

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
