<template>
  <div class="flex-column" style="height: calc(100% - 20px)">
    <div id="el-containter" class="flex-column spacer" style="margin-left:0px">
      <div class="report-header">
        <div class="search_row" style="padding-top: 0;">
          <!-- <date-time-selector
            class="time-selector"
            @change="dateChange" 
            :dateTimeValue = dateValue />  -->
            <span style="margin-right: 16px; margin-top: 5px;font-size:calc(15/1920*100vw);width:10%;">報表類型</span>
            <div class="report_type" >
              <el-select
                v-model="reportType"
                :placeholder="$t('remotePatrol.all')"
                size="mini"
                style="width: calc(200/1440*100vw); "
                class="el-province"
                @change="searchRequestTypeItems"
              >
                <el-option
                v-for="item in reportDownloadList"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"/>
              </el-select>
              <div style="width: 2px; border: #999;"></div> 
              <el-select
                v-model="reportRequestType"
                size="mini"
                style="width: calc(350/1440*100vw); margin-right: 60px;"
                class="el-province"
                filterable
                multiple
                @change="searchRequestReport"
              >
                <el-option
                  v-for="item in reportRequestTypeList"
                  :key="item.requestType"
                  :label="item.label"
                  :value="item.requestType"/>
              </el-select>
          </div>

          <div class="flex-center fullWidth" style="margin-left: 20px">
            <div class="search-content flex-center" style="margin-right: 20px">
              <div class="search-label">{{ $t('remotePatrol.keywords') }}</div>
              <el-input v-model="searchInput" size="mini" class="search-input shadow-light" style="margin-left: 16px;" clearable/>
            </div>
            <div class="spacer"></div>
            <el-button
              class="storevue-button-search"
              type="primary"
              size="mini"
              @click="searchDownloadData"
            >
              <span style="margin-right: 0">{{ $t('remotePatrol.search') }}</span>
            </el-button>
          </div>
        </div>
      </div>


      <div class="report-content loading spacer paper">
        <div class="clear_btn">
          <delay-button @click="showDeleteAllDialog = true">
            <div class="button-area">
              <i class="iconfont el-icon-delete-solid"/>
              <span>全部清空</span>
            </div>
          </delay-button>
        </div>
        <div
          v-if="downloadTableData.length !== 0"
          v-loading="isLoading"
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading ">

          <!-- 報告列表 -->
          <div class="list-table">
            <table-only
              ref="elTP"
              class="table-white download_list_table"
              :column-data="downloadInfoTable"
              :table-data="downloadTableData"
              :highlight-current-row= "true"
              :is-loading-data="isLoading"
              :tableDownloadAction ="columnOperationData"
              :allowRowExpand = "false"
              :showBorder = "false"
              :default-sort = "{prop: 'datestr', order: 'descending'}"
              :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '6px',}" 
              :tableHeight = "760"
              :cellStyle="{backgroundColor: '#fff !important'}"
              @handleOperation="handleEmitOperation"
            />
          </div>
        </div>
        <div
          v-else
          v-loading="isLoading"
          :element-loading-text="$t('insSettingView.loadingbindstore')"
          class="card-content self-loading">
          <div class="empty-content">{{ noData }} </div>
        </div>
        
        <div class="el-pat"  v-if="downloadTableData.length > 0">
          <div class="pageSizeTitle" style="color: #666">共有 <b style="font-size: 16px"> {{totalElements}} </b> {{ $t('remotePatrol.numReports') }}</div>
    
          <tbl-pagination-only
            :btn-style="{backgroundColor:'transparent'}"
            :total="total"
            :currentPage="currentPage"
            :page-size="sizeNum"
            layout = "prev,pager, next,sizes,slot"
            @sizeChange="handlePagination"
            @currentChange="handlePagination"
          />
        </div>
      </div>
    </div>
    
    <dialog-pop
      title="確認刪除"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showDeleteDialog"
      :isWarning="true"
      @cancelHandler="cancelDelete()"
      @confirmHandler="confirmDelete(updateEventId)"
    >
      <div class="dialog-slot">
        <div class="dialog-content">請確認是否刪除此項目? </div>
      </div>
    </dialog-pop>

    <dialog-pop
      title="確認刪除"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showDeleteAllDialog"
      :isWarning="true"
      @cancelHandler="showDeleteAllDialog = false"
      @confirmHandler="clearAll()"
    >
      <div class="dialog-slot">
        <div class="dialog-content">是否確認清空下載列表? </div>
      </div>
    </dialog-pop>



  </div>
</template>
<script>

import axios from 'axios';
import { GetInspectTagList } from '@/api/inspect';
import { getBriefStoreList, getStoreDefineGroup, getStoreList } from '@/api/store';
import {
  getDownloadList,
  deleteDownloadList,
  deleteAll,
  downloadFile
} from '@/api/exportExcel';
import { getWhiteList } from '@/api/scheduleTask';

import {handleEventStatus} from '@/api/reportAndEvent';
import util from '@/common/util';
import { mapGetters } from 'vuex';
import StoreFilter from '@/components/StoreFilter';
import DelayButton from '@/components/DelayButton';
import DateTimeSelector from '@/components/DateTimeSelector';
import SelectedStores from "@/components/SelectedStores";
import TblPaginationOnly from '@/components/TblPaginationOnly';
import TableOnly from '@/components/TableOnly';
import PermissionHelper from '@/api/PermissionHelper';
import DialogPop from '@/components/DialogPop';
const XLSX = require('xlsx');

export default {
  name: 'DownloadManagement',
  components: {
    DateTimeSelector,
    SelectedStores,
    DelayButton,
    StoreFilter,
    TblPaginationOnly,
    TableOnly,
    DialogPop
  },
  data() {
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      
  
			reportTableData: [],
      eventTableData: [],
			
      isLoading: false,
      downloadTableData: [],
      downloadInfoTable: [
        {
          'prop': 'inspect',
          'label': '報表類型',
          'sortable': false,
          'width': '140',
          'maxWidth': '150',
        },
        {
          'prop': 'condition',
          'label': '條件',
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'fileName',
          'label': '檔案名稱',
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'status_showing',
          'label': '狀態',
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },
        {
          'prop': 'ts',
          'label': '匯出時間',
          'sortable': false,
          'width': '140',
          'maxWidth': '140',
        },

      ],
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '100',
        align: 'center',
        operation: [
          {
            lable: '',
            methods: 'download'
          },
          {
            lable: '',
            methods: 'delete'
          }
        ]
      },
      reportDownloadList: [
        { type: -1, 
          label: '全部' ,
        },
        { 
          type: 1, 
          label: '巡檢管理-巡檢報告' ,
          content: [
            { requestType: 1001, label: '報告完整匯出'},
            { requestType: 1002, label: '報告明細匯出'},
            { requestType: 1003, label: '報告詳情 - Excel匯出'},
          ]
        },
        { 
          type: 2, 
          label: '事件管理',
          content: [
            { requestType: 2001, label: '未處理事件'},
            { requestType: 2002, label: '已處理事件'},
            { requestType: 2003, label: '已結案事件'},
            { requestType: 2004, label: '退回事件'},
            { requestType: 2005, label: '全部事件'},
          ]
        },
        { 
          type: 3, 
          label: '統計分析-巡檢考評統計',
          content: [
            { requestType: 3001, label: '考評結果分布'},
            { requestType: 3002, label: '考評得分分布'},
            { requestType: 3003, label: '考評達標率'},
          ]
        },
        { 
          type: 4, 
          label: '統計分析-巡檢項統計',
          content: [
            { requestType: 4001, label: '評估詳情'},
          ]
        },
        { 
          type: 5, 
          label: '統計分析-巡檢人員統計',
          content: [
            { requestType: 5001, label: '巡檢人員統計列表'},
            { requestType: 5002, label: '巡檢詳情'},
            { requestType: 5003, label: '已送出事件結案率'},
          ]
        },
        { 
          type: 6, 
          label: '統計分析-事件處理統計',
          content: [
            { requestType: 6001, label: '地點事件'},
            { requestType: 6002, label: '事件佔比'},
            { requestType: 6003, label: '事件涉及地點'},
          ]
        },
        { 
          type: 7, 
          label: '巡檢排程-排程紀錄',
          content: [
            { requestType: 7001, label: '排程紀錄 匯出Excel'},
          ]
        },
      ],
      allList: [],
      reportType: -1,
      reportRequestTypeList: [],
      reportRequestType: [],

      showDeleteDialog: false,
      showDeleteAllDialog: false,
      updateEventId: '',

      total: 10,
      currentPage: 1,
      curSizeNum: 10,
      sizeNum: 50,

      totalElements: 0,

      searchInput: '',
      sizeNum: 10,
      dateValue: [],
      storeDataList: [],
      noData: this.$t('deviceView.noData'),
      showStoreInfo: false,
      hasAdvanced: false,
      deleteId: 0,
      params : {
        // beginTs: 1704931200000,
        // endTs: 1705708800000,
        filter: {
            page: 0,
            size: 10
        },
        order: {
            direction: "desc",
            property: "ts"
        },
        keyword	: '',
        requestType	: []
      },
      inspectTagList: [],
      storeBriefList: [],
      isShowing: false
    };
  },

  
  computed: {
    iconSrcHeight() {
      return (this.varyWindowWidth / 1920) * 50;
    },
    ...mapGetters({ accountChanged: 'accountChanged',mimicModeChanged:'mimicMode' })
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.storeDataList = [];
        self.initData();
        window.setTimeout(function() {
          self.$route.meta.keepAlive = true;
        },
        300);
      }

      getWhiteList().then(res => {
        const data = res.data;
        if (res.data) {
          resolve(res);
          commit('SET_WHITE_LIST', res.data);
        } 
      }).catch(err => {
        reject(err);
      });
      const whiteList = this.$store.state.user.whiteList
      const accountId = this.$store.state.user.accountId
      console.log('whiteList!!!!!!!!!!!!!!!!!!!!', whiteList)
      console.log('accountId !!!!!!!!!!!!!!!!!!!!', accountId)
      this.isShowing = whiteList.some( i => i == accountId)
      console.log('this.isShowing !!!!!!!!!!!!!!!!!!!! ', this.isShowing);

      var tempList = [...this.reportDownloadList]

      if(!this.isShowing) {
        this.allList = []
        tempList = this.reportDownloadList.filter( i => i.type !== 7)
        tempList.forEach(i => {
          if(i.content){
            this.allList = [...this.allList, ...i.content]
          }
        })
        this.reportRequestTypeList = []
        this.reportRequestTypeList = this.allList
      }
      else{
        this.reportDownloadList.forEach(i => {
          if(i.content){
            this.allList = [...this.allList, ...i.content]
          }
        })
        this.reportRequestTypeList = this.allList
      }

      

    },
    mimicModeChanged(val){
      console.log("mimicMode val:",val);
      this.isLoading = true;
      this.ifSearchData = true;
    }

  },
  created() {
    getWhiteList().then(res => {
        const data = res.data;
        if (res.data) {
          resolve(res);
          commit('SET_WHITE_LIST', res.data);
        } 
      }).catch(err => {
        reject(err);
      });
    const whiteList = this.$store.state.user.whiteList
    const accountId = this.$store.state.user.accountId
    console.log('whiteList!!!!!!!!!!!!!!!!!!!!', whiteList)
    console.log('accountId !!!!!!!!!!!!!!!!!!!!', accountId)
    this.isShowing = whiteList.some( i => i == accountId)
    console.log('this.isShowing !!!!!!!!!!!!!!!!!!!! ', this.isShowing);
    if(!this.isShowing) this.reportDownloadList = this.reportDownloadList.filter( i => i.type !== 7)

    
    this.reportDownloadList.forEach(i => {
      if(i.content){
        this.allList = [...this.allList, ...i.content]
      }
    })
    // this.allList.unshift({requestType : -1 , label : "全部"})
    this.reportRequestTypeList = this.allList
    this.initData()
  },

  async mounted() {
    var userInfo = await this.$store.dispatch("GetUserAuthorities");
    this.hasAdvanced = userInfo.data.isSystemAdvanced
  },
  

  methods: {
    async initData() {
      this.searchInput = '';
      this.storeStr = '';
      this.dateValue = [new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24,
        new Date(this.$moment(new Date()).endOf('day'))];
      this.reportList = [];

      this.inspectTagList = await this.getInspectTag()
      this.storeBriefList = await this.getBriefStoreData()
      await this.searchRequestTypeItems()
      await this.getDownloadTable(this.params)
    },

    getInspectTag() {
      return new Promise((resolve, reject) => {
        GetInspectTagList().then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            resolve(res.data);
          }
        }).catch(err => {
          reject(err);
        });
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
      return year + "/"+ month +"/"+ day 
    },
    
    getAllDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + "/"+ month +"/"+ day +" "+ hour +":"+ min +":"+ sec
    },

    async getDownloadTable(params){
      this.isLoading = true;
      

      await getDownloadList(params).then(res=>{
        // console.log('res.data --->', res.data)
        
        res.data.content.forEach(i => {
          var tempReport = this.allList.find(r => r.requestType == i.requestType)
          var groupName = ""
          this.reportDownloadList.forEach( q => {
            if(q.content){
              q.content.forEach( qq => {
                if(qq.requestType == tempReport.requestType){ groupName = q.label}
              })
            }
          })

          // this.storeBriefList
          // var storName = []
          // console.log('this.storeBriefList :>> ', this.storeBriefList);
          // console.log('this.inspectTagList :>> ', this.inspectTagList);

          // if(i.requestContent.clause){
          //   i.requestContent.clause.storeId.forEach( e => {
          //     this.storeBriefList.forEach(u => {
          //       if(e == u.storeId) storName.push(u.name)
          //     })
          //   })
          // }


          // var fineInspect = null
          // if(i.requestContent.hasOwnProperty("inspectTagIds")){
          //   if( i.requestContent.inspectTagIds.length == 0){
          //     fineInspect = "全部"
          //     console.log('fineInspect0', fineInspect)
          //   } 
          //   else{
          //     var tempArray = []
          //     this.inspectTagList.forEach( x => {
          //       i.requestContent.inspectTagIds.forEach( y => {
          //         if(x.id == y) tempArray.push(x.name)
          //       })
          //     })
          //     fineInspect = tempArray.join(', ')
          //   }
            
          // } 
          // else if(i.requestContent.hasOwnProperty("inspectTagId") && i.requestContent.inspectTagId !== -1){
          //   fineInspect = this.inspectTagList.filter(g => g.id == i.requestContent.inspectTagId)[0].name
          //   console.log('fineInspect2', fineInspect)
          // }
          // const inspectName = "巡檢表: " + (i.requestContent.inspectTagId == -1 ? "全部" : fineInspect)

          // var inspectStore = ""
          // if(this.storeBriefList.length == storName.length){
          //   inspectStore = "地點: 全部"
          // } else {
          //   inspectStore = i.requestContent.clause ? "地點: " + storName.join(', ') : ""
          // }
          const inspectTimeRange = "時間範圍: " + this.getdate(i.searchStartTs) + ' - ' + this.getdate(i.searchEndTs)
          const inspectName = i.requestContent.conTableName == null ? "" : '\n' + "巡檢表: " + i.requestContent.conTableName
          const inspectStore = i.requestContent.conStoreName == null ? "" : '\n' + "地點: " + i.requestContent.conStoreName

          i.condition = inspectTimeRange + inspectName + inspectStore
          i.inspect = groupName + "\n" + tempReport.label
          i.fileName = i.requestContent.fileName
          i.ts =  this.getAllDate(i.ts)

          if(i.status == -1 ) i.status_showing = '失敗'
          else if(i.status == 0) i.status_showing = '處理中'
          else if(i.status == 1) i.status_showing = '完成'
          else if(i.status == 2) i.status_showing = '已失效'

        })


        this.downloadTableData = res.data.content
        this.totalElements = res.data.totalElements
        this.total = res.data.totalPages
  
        this.isLoading = false;
      }).catch(err => {
        this.isLoading = false;
        console.log('error' + err);
      });
    },

    searchRequestTypeItems(value){ 
      this.reportRequestType = []
      if(this.reportType == -1 ){
        this.reportRequestTypeList = this.allList
        console.log('this.allList :>> ', this.allList); 
      }else {
        this.reportRequestTypeList = [...this.reportDownloadList[value].content]
        console.log('this.reportDownloadList[value].content :>> ', this.reportDownloadList[value].content);
        this.reportRequestType = this.reportRequestTypeList.map( i => i.requestType)
      }

      // this.reportRequestType = this.reportRequestTypeList[0].requestType
    },

    searchRequestReport(){
      console.log('this.reportDownloadList XXDDD>> ', this.reportDownloadList);
      if(this.reportRequestType.length == 0) {
        this.reportType = -1
        this.reportRequestTypeList = this.allList
      }
    },

    searchDownloadData(){
      console.log('this.reportRequestType', this.reportRequestType)

      if(this.reportRequestType == -1){ 
        this.params.requestType	= -1
      }
      else {
        this.params.requestType	 = this.reportRequestType
      }
      console.log('this.searchInput', this.searchInput)
      this.params.keyword = this.searchInput
      this.params.filter.page = 0
      this.currentPage = 1

      console.log('this.params', this.params)
      this.getDownloadTable(this.params)
    },

    handleEmitOperation(val){
      switch (val.method) {
        case  'download':
          this.handleDownload(val)
          break;

        case 'delete':
          this.deleteId = val.row.id
          this.showDeleteDialog = true
          break;
      
        default:
          break;
      }
    },
    handleDownload(val) {
      console.log('val ~~~~>> ', val);
      var downloadId = val.row.id
      console.log('downloadId :>> ', downloadId);
      downloadFile(downloadId).then(res=>{
        console.log('res.data :>> ', res.data);
        if(!res.data.zip){
          const b64data = res.data.data
          const fileName = res.data.fileName
          this.downloadFile(b64data, fileName)
        }else{
          const b64data = res.data.data
          const fileName = res.data.fileName
          this.downloadZip(b64data, fileName)
        }
        resolve(res.data);
      }).catch(err => {
        this.isLoading = false;
      })
    },

    downloadFile(b64data, fileName){
      var mediaType="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
      var link = document.createElement('a');
      link.href = mediaType + b64data;
      link.download = fileName
      link.click()
      // window.location.href = link.href
    },
    downloadZip(b64data, fileName){
      var mediaType="data:application/x-zip-compressed;base64,";
      var link = document.createElement('a');
      link.href = mediaType + b64data;
      link.download = fileName
      link.click()
    },


    cancelDelete(){
      this.showDeleteDialog = false
    },
    confirmDelete(updateEventId){
      this.showDeleteDialog = false
      this.isLoading = true;   
      var del = {id : this.deleteId}
      deleteDownloadList(del).then(res=>{
        this.getDownloadTable(this.params)
      }).catch(err => {
        this.isLoading = false;
      })
    },
    clearAll(){
      deleteAll().then(res=>{
        this.showDeleteAllDialog = false
        this.isLoading = true;  
        this.getDownloadTable(this.params)
      }).catch(err => {
        this.isLoading = false;
      })
    },



    cellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },



    dateChange(val) {
      const self = this;
      const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
      const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
      self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
      self.dateValue[1] = self.dateValue[1];
      self.inputSearchValue = '';
    },

    handlePagination(pageInfo){
      console.log('pageInfo ~~~~~>> ', pageInfo);
      console.log('this.params ~~~~~>> ', this.params);
      this.isLoading = true;
      
      this.currentPage = pageInfo.page
      this.sizeNum = pageInfo.size
      this.curSizeNum = pageInfo.size;
    
      this.params.filter.page = pageInfo.page - 1
      this.params.filter.size = pageInfo.size
      this.getDownloadTable(this.params)

      // if(this.inputSearchValue.trim()=="") this.getWorkflowList(this.apiBody);
      // else this.setTableBySearch()

    },

    
  },



};
</script>


<style lang="sass">
  .search_row
    display: flex
    flex-direction: row
    align-items: flex-start
    justify-content: flex-start
  .report_type
    display: flex
    flex-direction: row
    align-items: flex-start
    justify-content: flex-start

  .download_list_table
    .el-table
      .el-table__header-wrapper
        th
          &:nth-child(1)
            padding-left: 0 !important
          // &:nth-child(4)
          //   width: 20% !important

      .el-table__body-wrapper
        td
          vertical-align: center
          &:nth-child(1)
            .cell
              padding-left: 10% !important
              padding: 10px !important
              white-space: pre
              // text-overflow: ellipsis !important
              // white-space: nowrap !important
              // overflow: hidden !important
              span
                // background: #9872 !important
                // white-space: pre !important
          &:nth-child(2)
            .cell
              white-space: pre-line
          // &:nth-child(4)
          //     width: 20% !important
          //     background: #789 !important

          

            
    .el-table th div
      padding-left: 10px !important
      padding-right: 0 !important
      text-align: left  !important

    .cell-class .cell
      padding: 5px 
      text-align: left  !important
      

  .clear_btn
    width: 100%
    display: flex
    flex-direction: row
    align-items: center
    justify-content: flex-end
    border-bottom: 1px solid #ececec
    padding: 15px 15px

  .button-area
    height: 23px
    padding: 0 5px

</style>


<style lang="scss" scoped>
$red:#f31d65;
$black:#182752;
$border:#e3e9f4;
$background:#f4f5f9;
$tab:#7d8cad;
$h1:#292e36;
$qualified:#6097F3;
$noqualied:#FDBA40;
$suggestBack:#F1F6FE;
$filterWidth: (100%-706);
.el-radio {
  >>> .el-radio__inner {
    border-color: #d9dde1;
    background: #fff;
    width: calc(16/1920*100vw);
    height: calc(16/1920*100vw);
  }
  &.is-checked {
    >>> .el-radio__inner {
      border-color: #2c90d9;
      background: #e0f2ff;
      width: calc(16/1920*100vw);
      height: calc(16/1920*100vw);
    }
    >>> .el-radio__inner::after {
      width: 8px;
      height: 8px;
      background: #2c90d9;
    }
  }
  >>> span {
    font-size: calc(15/1920*100vw);
  }
}
.search-label{
  min-width: 45px;
  text-align: left;
  align-self: center;
  font-family: NotoSansCJKTC;
  font-size: calc(15/1920*100vw);
  font-weight: normal;
  word-break: keep-all;
  padding-right: 16px;
  
  
}
.report-type-area{
    width:calc(346/1440*100vw);
    height: calc(36/1920*100vw);
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
#el-containter{
    
    .report-header{
        margin-top: 20px;
        margin-bottom: 20px;
        /deep/
        .el-select.el-select--medium .el-input .el-input__inner {
            position: relative;
            z-index: 1;
            background: transparent !important;
            border: none;
            font-size: calc(15/1920*100vw);
            height: calc(36/1920*100vw);
            line-height: calc(36/1920*100vw);
            min-height: 28px;
            min-width: 85px;
        }
        /deep/
        .el-input--medium .el-input__icon {
            line-height: calc(36/1920*100vw);
        }
        .header-details{
            text-align: left;
            padding-left: calc(30/1920*100vw);
            position: relative;
            .search-content{
                display: inline-block;
            }
            .date-range{
                width:300px;
            }
            .iconbangzhu{
              font-size: calc(20/1920*100vw);
              margin-right: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1560px){
                margin-right: 10px;
              };
              @media screen and (min-width: 1024px) and (max-width: 1280px){
                margin-right: 5px;
              };
            }
            span{
                font-size: calc(14/1920*100vw);
                margin-right: calc(20/1920*100vw);
              @media screen and (min-width: 1280px) and (max-width: 1560px){
                margin-right: 10px;
              };
            }
            
            .el-province{
                width: calc(160/1920*100vw);
                min-width: 85px;
                margin-right: calc(15/1920*100vw);
                @media screen and (min-width: 1280px) and (max-width: 1360px){
                  width: 85px;
                };
                @media screen and (max-width: 1022px){
                  margin-right: 10px;
                };
            }
          >>> .content .el-select.el-select--medium{
            @media screen and (min-width: 1280px) and (max-width: 1360px){
              width: 85px;
            };
            @media screen and (max-width: 1022px){
              margin-right: 10px;
            };
          }
            .search-input{
                width: calc(160/1920*100vw);
                @media screen and (min-width: 1280px) and (max-width: 1360px){
                  width: 85px;
                };
            }
        }
      .header-details{
        padding-bottom: 15px;
        padding-right: calc(20/1920*100vw);
      }
      .header-details:nth-child(1){
        padding-bottom: 0px;
      }
    }
    .report-content{
        // padding-right: calc(20/1920*100vw);
        // padding-left: calc(20/1920*100vw);
        .card-content{
          padding: calc(32/1920*100vw) calc(24/1920*100vw);
        }
        .empty-content{
          font-size: calc(16/1920*100vw);
          color: $tab;
          height: 300px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          // position: absolute;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%, -50%);
        }
        .card-header{
            text-align: left;
            padding: 0 calc(8/1920*100vw);
            padding-right: 0;
            margin-bottom: 15px;
            .list_card{
              float: right;
              display: flex;
              align-items: center;
              .pattern_btn{
                display: inline-block;
                height: calc(36/1920*100vw);
                line-height: calc(36/1920*100vw);
                color:#7d8cad;
                cursor: pointer;
                vertical-align: middle;
                .iconCard{
                  font-size: calc(18/1920*100vw);
                  margin-right:calc(10/1920*100vw);
                  vertical-align: middle;
                }
                .text-pattern{
                  font-size: calc(15/1920*100vw);
                  vertical-align: middle;
                }
              }
              .export-report-btn{
                background-color: #fff;
                color: #006ab7;
                font-size: calc(15/1920*100vw);
                margin-left: calc(30/1920*100vw);
              }
            }
        }
    }
    
    .showCardHeight{
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      // height: calc(450/1440*100vw);
      // overflow: auto;
        
    }
    .list-table{
      margin-bottom: 20px;
    }
    .list-table >>> .report-cell-class .cell{
      padding-left: calc(20/1920*100vw) !important;
    }
    .list-table >>> .report-header-class .cell{
      padding-left: calc(20/1920*100vw) !important;
    }
    .list-table{
      
      .table-white {
        /deep/
        .el-table{
          box-shadow: none !important;
          border: none !important;
          background-color: #fff;
          padding-left: 12px;
          padding-right: 12px;
          // max-height: fit-content !important
        }
      }
    }
    
    .report-card{
        width: 19%;
        margin-bottom: calc(20/1440*100vw);
        margin-right: 1%;
        transition: all .3s;
        cursor: pointer;
        &:hover{
          box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .2);
          
        }
        .cards{
          width: 100%;
          height: calc(220/1440*100vw);
          padding: calc(15/1440*100vw);
          
          // margin-right: calc(20/1440*100vw);
          border: 1px solid #e3e9f4;
          font-size: calc(12/1440*100vw);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
          position: relative;
          color: #69727c;
          min-height: calc(160/1440*100vw);

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          .card_main{
            width: 100%;
            .card-title {
                width: calc(150/1440*100vw);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: calc(15/1440*100vw);
                margin-right: calc(10/1440*100vw);
              }
              div {
                text-align: left;
              }
                
              .item-img{
                position: absolute;
                right: 1px;
                top: 1px;
              }
              .item-flex{
                display: flex;
                flex-direction: column;
                padding-top: calc(40/1440*100vw);
                justify-content: space-around;
              }
              .item-header{
                width: 100%;
                //margin-top: calc(40/1920*100vw);
                overflow: hidden;
                .inspect-img{
                    margin-left: calc(20/1920*100vw);
                    float: left;
                }
                .store-name{
                    float: left;
                    width: calc(120/1920*100vw);
                    margin-left: calc(20/1920*100vw);
                    text-align: left;
                    width: calc(100% - 40/1920*100vw);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    .name{
                        font-size: calc(18/1920*100vw);
                        font-weight: bold;
                        display: block;
                        color: $black;
                        overflow: hidden;
                        text-overflow: ellipsis
                  }
                .inspect{
                  font-size: calc(12/1920*100vw);
                  color: $tab;
                }
              }
            }
            .item-icon{
              text-align: left;
              padding-left: calc(20/1920*100vw);
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-right: calc(20/1920*100vw);
            }
            .inspectIcon{
              font-size: calc(60/1920*100vw);
              color: $border;
            }
            .score {
              font-size: calc(32/1440*100vw); 
              margin-right: calc(5/1440*100vw);
              // margin-bottom: calc(30/1440*100vw);
            }
            .status-tag_row{
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              align-items: stretch;
              justify-content: flex-start;
              margin-bottom: 1%;
              .status-tag {
                border-radius: 4px; 
                padding: calc(5/1440*100vw) calc(7/1440*100vw);
                font-size: calc(10/1440*100vw);
                margin-bottom: 2%;
              }
              .status-tag-en{
                font-size: calc(14/1920*100vw);
                border-radius: calc(5/1440*100vw); 
                padding: calc(2/1440*100vw) calc(15/1440*100vw);
                margin-bottom: 2%;
              }
            }
          }
          
          
        .card_bottom{
          text-align: left;
          .submitter{
            margin-bottom: calc(5/1440*100vw);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            justify-content: space-between;
          }
        }

        .margin-bottom-5 {
          margin-bottom: calc(5/1440*100vw);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          justify-content: space-between;
          
        }
        .item-score{
          color: $tab;
        }
        .score-num{
          font-size: calc(40/1440*100vw);
        }
        .score-unit{
          font-size: calc(12/1920*100vw);
        }
        .item-content{
          text-align: left;
          padding-left: calc(20/1920*100vw);
          span{
            font-size: calc(14/1920*100vw);
            color: $tab;
            display: block;
            margin-bottom: calc(15/1920*100vw);
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
    }
}
.el-pat{
    //position: absolute;
    height: 30px;
    margin-top: 0px;
    margin-right: calc(20/1920*100vw);;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    
    .el-pag{
        position: absolute;
        //float: right;
        right: calc(20/1920*100vw);
        bottom: 0px;
    }
}
}
.standard-btn{
  position: absolute;
  top: 0;
}
.last-row{
      display: flex;
      flex-direction: row;
      width:100%;
      margin-left: 42px;
      height: 36px;
      align-items: flex-start;
      align-items:center;
      justify-content: space-between;
      padding-right: (180/1920*100vw);
}
    .time-selector{
      margin-right: calc(30/1920*100vw);
    }
.noticeDialog{
  text-align: left;
  margin-left: calc(20/1920*100vw);
}
</style>
<style scoped>
    #el-menuscrollbar .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /* width */
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: rgb(255, 255, 255);
      border-radius: 8px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgb(201, 201, 202);
      border-radius: 8px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: rgb(162, 162, 163);
    }

</style>
<style>
@import '../../assets/css/pagination.css';
</style>
