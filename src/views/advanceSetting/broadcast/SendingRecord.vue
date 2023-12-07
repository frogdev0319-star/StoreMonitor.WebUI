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
                  :class="{ broadcast_table : actionType == 0}"
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
                  @showAttachDialog="handdleAttachInfo"
                  @onCellClick="showReadStatus"
                  @sortChange="sortChange"
                />
              </div>
              
              <!-- pagination -->
              <div class="page-area">
                <div class="pagination_row"  v-if="totalEvents > 0" > 
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

    <dialog-pop
      :title= "$t('immediatePush.attachment')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showBroadcastAttach"
      :isWarning="true"
      :showButton=" false"
    >
      <div class="dialog-slot">
        <div class="dialog-content" style="width: 100%; ">
          <div class="" style="width: 100%; margin-bottom: 30px;">
            <table-only
              ref="elTP"
              class="attach_list_table"
              :column-data="attachDataList"
              :table-data="attachTableData"
              :highlight-current-row= "false"
              :is-loading-data="isLoadingData"
              :allowRowExpand = "false"
              :showBorder = "false"
              :default-sort = defaultSort
              :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
              :tableHeight = "760"
              :cellStyle="{backgroundColor: '#fff !important'}"
              @onCellClick="downloadAttachFile"
            />

          </div>
          <div class="attach_btn_row">
            <el-button class="confirm-btn" size="mini" type="primary" @click="showBroadcastAttach = false">
              {{ $t('remotePatrol.confirm') }}
            </el-button>
          </div>
        </div>
      </div>
    </dialog-pop>
    
    <dialog-pop
      :title= "$t('immediatePush.readStatus')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showBroadcastReadStatus"
      :isWarning="true"
      :showButton=" false"
    >
      <div class="dialog-slot">
        <div class="dialog-content" style="width: 100%">
          <el-select 
            v-model="withReadStatus"
            style="width: 100%; margin-bottom: 10px;"
            :placeholder= "$t('immediatePush.readStatus')"
            filterable
            @change="filterRadStatus"
            >
            <el-option
              v-for="(item, index) in isReadStatus"
              :key = index
              :label="item.label"
              :value="item.value" 
              />
          </el-select>
          <div class="" style="width: 100%; margin-bottom: 30px;">
            <table-only
              ref="elTP"
              class="read_status_table"
              :column-data="readStatusList"
              :table-data="readStatusTableData"
              :highlight-current-row= "false"
              :is-loading-data="isLoadingData"
              :allowRowExpand = "false"
              :showBorder = "false"
              :default-sort = defaultSort
              :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
              :tableHeight = "350"
              :cellStyle="{backgroundColor: '#fff !important'}"
            />

          </div>
          <div class="attach_btn_row">
            <el-button class="confirm-btn" size="mini" type="primary" @click="showBroadcastReadStatus = false">
              {{ $t('remotePatrol.confirm') }}
            </el-button>
          </div>
        </div>
      </div>
    </dialog-pop>
  </div>
</template>
<script>
import { getUserInfo, getAllUserInfoNoAuth} from '@/api/login';

import { 
  getImmediateBroadcastTable, 
  getImmediateTaskTable, 
  getImmediateEventTable,
  getImmediateBroadcastReadStatus,
  getImmediateTaskReadStatus,
  getImmediateEventReadStatus
} from '@/api/advanceSetting';
import { GetInspectTagListAll } from '@/api/inspect';
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
      userInfo: [],
      allInspectTypeList: [],
      activeName: "0",
      actionType: 0,
      dateValue:[],
      curOrder: {
        direction: "desc",
        property: "sendTs"
      } ,
      showBroadcastAttach: false,
      showBroadcastReadStatus: false,
      attachTableData: [],
      attachDataList:[
        {
          'prop': 'fileName',
          'label': this.$t('immediatePush.fileName'),
          'width': 50,
          'maxWidth': 50,
          'isCellClick': true
        },
        {
          'prop': 'fileSize',
          'label': this.$t('immediatePush.fileSize'),
          'width': 200,
          'maxWidth': 200,
        },
      ],
      oriReadStatusTableData: [],
      readStatusTableData: [],
      readStatusList:[
        {
          'prop': 'userName',
          'label': this.$t('immediatePush.staff'),
          'width': 50,
          'maxWidth': 50,
        },
        {
          'prop': 'titleName',
          'label': this.$t('immediatePush.position'),
          'width': 200,
          'maxWidth': 200,
        },
        {
          'prop': 'isRead',
          'label': this.$t('immediatePush.status'),
          'width': 200,
          'maxWidth': 200,
          'readStatus': true
        },
      ],
        
      total: 50,
      currentPage: 1,
      curSizeNum: 10,
      sizeNum: 10,
      totalEvents: 0,

      inputSearchValue: '',
      defaultSort:{order:'descending', prop:'updateTs'},
      tableDataList:[
        {
          label: this.$t('immediatePush.broadcast'),
          name: '0',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'bulletinSubject',
              'label': this.$t('immediatePush.messageTitle'),
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'bulletinContent',
              'label': this.$t('immediatePush.messageContent'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'attachments',
              'label': this.$t('immediatePush.attachment'),
              'width': 200,
              'maxWidth': 200,
              'forAttachement': true
            },
            {
              'prop': 'sender',
              'label': this.$t('immediatePush.sender'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sendTs',
              'label': this.$t('immediatePush.sendingTime'),
              'width': 200,
              'maxWidth': 200,
              'sortable': 'custom',
            },
            {
              'prop': 'readStatus',
              'label': this.$t('immediatePush.readStatus'),
              'width': 200,
              'maxWidth': 200,
              'isCellClick': true
            },
            
          ],
        },
        {
          label:  this.$t('immediatePush.immediateTask'),
          name: '1',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'scheduleName',
              'label':  this.$t('immediatePush.scheduleName'),
              'width': 50,
              'maxWidth': 50,
              'sortable': 'custom',
            },
            {
              'prop': 'inspectReport',
              'label':  this.$t('immediatePush.inspectionName'),
              'width': 200,
              'maxWidth': 200,
              'sortable': 'custom',
            },
            {
              'prop': 'executeTs',
              'label':  this.$t('immediatePush.excetionDate'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sender',
              'label':  this.$t('immediatePush.sender'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sendTs',
              'label':  this.$t('immediatePush.sendingTime'),
              'width': 200,
              'maxWidth': 200,
              'sortable': 'custom',
            },
            {
              'prop': 'readStatus',
              'label':  this.$t('immediatePush.readStatus'),
              'width': 200,
              'maxWidth': 200,
              'isCellClick': true
            },
          ],
        },
        {
          label:  this.$t('immediatePush.immediateEvent'),
          name: '2',
          taskCount: 0,
          tableData: [],
          columnData: [
            {
              'prop': 'eventName',
              'label':  this.$t('immediatePush.eventName'),
              'width': 50,
              'maxWidth': 50,
            },
            {
              'prop': 'attachments',
              'label':  this.$t('immediatePush.attachment'),
              'width': 200,
              'maxWidth': 200,
              'forAttachement': true
            },
            {
              'prop': 'sender',
              'label':  this.$t('immediatePush.sender'),
              'width': 200,
              'maxWidth': 200,
            },
            {
              'prop': 'sendTs',
              'label':  this.$t('immediatePush.sendingTime'),
              'width': 200,
              'maxWidth': 200,
              'sortable': 'custom',
            },
            {
              'prop': 'readStatus',
              'label':  this.$t('immediatePush.readStatus'),
              'width': 200,
              'maxWidth': 200,
              'isCellClick': true
            },
          ],
        },
      ],
      
      withReadStatus: false,
      isReadStatus: [
        {
          value : -1,
          label: this.$t('immediatePush.all'),
        },
        {
          value : true,
          label:this.$t('immediatePush.read'),
        },
        {
          value : false,
          label: this.$t('immediatePush.notRead'),
        },
      ]
    }
  },
  mounted() {},
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
    async init(){
      
      var initDate = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      const start = typeof (initDate[0]) === 'object' ? initDate[0].getTime() : initDate[0];
      const end = typeof (initDate[1]) === 'object' ? initDate[1].getTime() : initDate[1];
      this.dateValue = [new Date().setTime(start), new Date().setTime(end)];

      await this.getUserInfo()
      await this.getTable("0")
    },

    async onTabClick(val){
      var n =  Number(val.index)
      this.currentPage = 1
      this.curSizeNum = 10
      this.sizeNum = 10
      this.curOrder.direction = "desc"
      
      this.actionType = n
      await this.getTable(n)
    },

    sortChange(sortOrder) {
      const self = this;
      const order = sortOrder.direction;
      console.log("report sort:",sortOrder);
      console.log("report order:",order);

      this.curOrder = sortOrder
      console.log('this.actionType :>> ', this.actionType);
      this.getTable(this.actionType)
    },


    getTable(typeN){
      this.isLoadingData = true
      if(typeN == "0"){
        this.getInsantBroadcastTable()
      }
      else if (typeN == "1"){
        this.getInsantTaskTable()
      }
      else if(typeN == "2"){
        this.getInsantEventTable()
      }
    },

    async getInsantBroadcastTable(){
      this.isLoadingData = true
      console.log('this.dateValue 0', this.dateValue)
      var param = {
        beginTs: this.dateValue[0],
        endTs: this.dateValue[1],
        keyword: this.inputSearchValue,
        filter: {
            page: this.currentPage - 1,
            size: this.curSizeNum
        },
        order: {
            direction: this.curOrder.direction,
            property: this.curOrder.property
        }
      }
      await getImmediateBroadcastTable(param).then(res=>{
        console.log('res.data.content getInsantBroadcastTable :>> ', res.data.content);
        res.data.content.forEach( i => {
          this.userInfo.forEach(n => {
            if(i.instantRequest.userId == n.userId){
              i.instantRequest.userName = n.userName
            }
          })
        })
      
        this.tableDataList[0].tableData = res.data.content.map(i => ({
          instantId: i.instantRequest.id,
          bulletinSubject: i.instantRequest.msgContent.broadcastTitle,
          bulletinContent: i.instantRequest.msgContent.broadcastContent,
          attachments: i.instantRequest.msgContent.attachments,
          sender: i.instantRequest.userName,
          sendTs: this.getdate(i.instantRequest.ts),
          readStatus: `${i.readMsg}/${i.totalMsg}`
          
        }))
        console.log('this.tableDataList[0].tableData =====>>>>>', this.tableDataList[0].tableData)
        this.total = res.data.totalPages
        this.totalEvents = res.data.totalElements

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },



    async getInsantTaskTable(){
      this.isLoadingData = true
      var allInspect = await this.getTagAll()
      this.allInspectTypeList = allInspect.map(i => ({
        id: i.id,
        name: i.name,
        mode: i.mode
      }))
      console.log('this.dateValue 1', this.dateValue)
      var param = {
        beginTs: this.dateValue[0],
        endTs: this.dateValue[1],
        keyword: this.inputSearchValue,
        filter: {
            page: this.currentPage - 1,
            size: this.curSizeNum
        },
        order: {
          direction: this.curOrder.direction,
          property: this.curOrder.property
        }
      }
      await getImmediateTaskTable(param).then(res=>{
        console.log('res.data.content getImmediateTaskTable :>> ', res.data.content);
        res.data.content.forEach( i => {
          this.userInfo.forEach(n => {
            if(i.instantRequest.userId == n.userId){
              i.instantRequest.msgContent.userName = n.userName
            }
          })
        })
        res.data.content.forEach( i => {
          this.allInspectTypeList.forEach(n => {
            if(i.instantRequest.msgContent.inspectTagId == n.id){
              i.instantRequest.msgContent.inspectName = n.name
            }
          })
        })
        this.tableDataList[1].tableData = res.data.content.map(i => ({
          instantId: i.instantRequest.id,
          scheduleName : i.instantRequest.msgContent.taskName,
          inspectReport: i.instantRequest.msgContent.inspectName,
          executeTs: this.getUTCdate(i.instantRequest.msgContent.remindTime),
          sender: i.instantRequest.msgContent.userName,
          sendTs: this.getdate(i.instantRequest.ts),
          readStatus: `${i.readMsg}/${i.totalMsg}`
        }))
        console.log('this.tableDataList[1].tableData =====>>>>>', this.tableDataList[1].tableData)
        this.total = res.data.totalPages
        this.totalEvents = res.data.totalElements

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },


    async getInsantEventTable(){
      this.isLoadingData = true
      console.log('this.dateValue 2', this.dateValue)
      var param = {
        beginTs: this.dateValue[0],
        endTs: this.dateValue[1],
        keyword: this.inputSearchValue,
        filter: {
            page: this.currentPage - 1,
            size: this.curSizeNum
        },
        order: {
          direction: this.curOrder.direction,
          property: this.curOrder.property
        }
      }
      await getImmediateEventTable(param).then(res=>{
        console.log('res.data.content :>> ', res.data.content);
        res.data.content.forEach( i => {
          this.userInfo.forEach(n => {
            if(i.instantRequest.userId == n.userId){
              i.instantRequest.userName = n.userName
            }
          })
        })
        this.tableDataList[2].tableData = res.data.content.map(i => ({
          instantId: i.instantRequest.id,
          eventName : i.instantRequest.msgContent.eventTitle,
          attachments: i.instantRequest.msgContent.attachments,
          sender: i.instantRequest.userName,
          sendTs: this.getdate(i.instantRequest.ts),
          readStatus: `${i.readMsg}/${i.totalMsg}`
        }))
        console.log('this.tableDataList[2].tableData =====>>>>>', this.tableDataList[2].tableData)
        this.total = res.data.totalPages
        this.totalEvents = res.data.totalElements

        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
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
      this.getTable(this.actionType)
      // this.getLog(this.actionType)
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

    getUTCdate(t){
      var date = new Date(t);
      var month = this.pad2(date.getUTCMonth()+1);
      var day = this.pad2(date.getUTCDate());
      var year= date.getUTCFullYear();
      var hour = this.pad2(date.getUTCHours())
      var min = this.pad2(date.getUTCMinutes())
      var sec = this.pad2(date.getUTCSeconds())
      return year + "-"+ month +"-"+ day 
    },
    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
          this.userInfo = res.data
        }).catch(err => {
          console.log('error' + err);
        });
    },

    // 取得巡檢表
    getTagAll() {
      return new Promise((resolve, reject) => {
        GetInspectTagListAll().then(res => {
          const data = res.data;
          resolve(data);

          
        }).catch(err => {
          reject(err);
        });
      });
    },
    handdleAttachInfo(val){
      console.log('val handdleAttachInfo >> ', val);
      this.showBroadcastAttach = true
      val.attachments.forEach( i => {
        if(typeof(i.fileSize) == "number"){
          i.fileSize = i.fileSize > 1048579 ? `${(i.fileSize/1048579).toFixed(1)} mb` : `${(i.fileSize/1024).toFixed(0)} kb`
        }
        i.fileName = i.fileName.split("_" ).pop()
        
      })
      this.attachTableData = [...val.attachments]
    },

    downloadAttachFile(val){
      window.location.href = val.row.url
    },

    async showReadStatus(val){
      console.log('val :>> ', val);
      console.log('this.actionType :>> ', this.actionType);
      this.isLoadingData = true

      // tab 1
      if(this.actionType == 0){
        console.log('0 :>> ');
        var needId = {
          instantId: val.row.instantId
        }
        await getImmediateBroadcastReadStatus(needId).then(res=>{
          this.oriReadStatusTableData = res.data
          this.readStatusTableData = res.data
          this.isLoadingData = false
        }).catch(err => {
          this.isLoadingData = false;
          console.log('error' + err);
        });
      }
      else if(this.actionType == 1){
        console.log('1 :>> ');
        var needId = {
          instantId: val.row.instantId
        }
        await getImmediateTaskReadStatus(needId).then(res=>{
          this.oriReadStatusTableData = res.data
          this.readStatusTableData = res.data
          this.isLoadingData = false
        }).catch(err => {
          this.isLoadingData = false;
          console.log('error' + err);
        });

      }
      else if(this.actionType == 2){
        console.log('2 :>> ');
        var needId = {
          instantId: val.row.instantId
        }
        await getImmediateEventReadStatus(needId).then(res=>{
          this.oriReadStatusTableData = res.data
          this.readStatusTableData = res.data
          this.isLoadingData = false
        }).catch(err => {
          this.isLoadingData = false;
          console.log('error' + err);
        });
        
      }

      this.withReadStatus = false
      this.readStatusTableData = this.oriReadStatusTableData.filter(i => i.isRead == this.withReadStatus)
      this.showBroadcastReadStatus = true
    },

    handlePagination(pageInfo){
      console.log('pageInfo', pageInfo)
      this.currentPage = pageInfo.page
      this.curSizeNum = pageInfo.size;
      this.sizeNum = pageInfo.size
      this.getTable(this.actionType)
    },

    filterRadStatus(val){
      console.log('val :>> ', val);
      console.log('this.withReadStatus :>> ', this.withReadStatus);
      console.log('this.readStatusTableData :>> ', this.readStatusTableData);

      if(val == -1){
        this.readStatusTableData = this.oriReadStatusTableData
      }
      else{
        this.readStatusTableData = this.oriReadStatusTableData.filter(i => i.isRead == val)
      }
    
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
      max-height: none !important
    td, th
      padding-left: 0 !important
      .cell
        padding: 5px 0px !important
        padding-left: 12px !important
        word-break: break-word !important
        text-align: left !important
        span
          line-height: 20px !important
          text-align: left !important
      &:nth-child(1)
        width: 20% !important
        .cell
          padding-left: 12px !important


  .broadcast_table
    .table .el-table
      padding: 10px 0
      max-height: none !important
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
      max-height: none !important
    td, th
      &:nth-child(2)
        width: 30% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important
      &:nth-child(3)
        width: 10% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important
    .el-table .cell
      text-align: left !important
      word-break: break-word !important
      


  .read_status_table, 
    .table .el-table
      padding: 10px 0
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
      overflow: auto !important
    td, th
      padding-left: 0 !important
      .cell
        padding: 5px 0px !important
        padding-left: 12px !important
        text-align: left !important
        span
          line-height: 20px !important
      &:nth-child(1)
        width: 20% !important
        .cell
          padding-left: 12px !important
    
  .attach_list_table
    .table .el-table
      padding: 10px 0
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
      overflow: auto !important
    td, th
      padding-left: 0 !important
      .cell
        padding: 5px 0px !important
        padding-left: 12px !important
        text-align: left !important
        word-break: break-word !important
        span
          line-height: 20px !important
      &:first-child
        width: 75% !important
        .cell
          padding-left: 12px !important
  



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

  .attach_btn_row
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center

  .tablelist_workflows
    .el-table__header
      width: auto !important
    .el-table__body
      width: auto !important
    .table .el-table 
      border: none !important
  
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
