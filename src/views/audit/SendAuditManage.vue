<template>
    <div class="flex-column" style="height: calc(100% - 20px)">
        <div class="el-audit-header">
            <!-- 選門店 -->
            <div class="el-area">
                <store-filter
                :cached-params="searchParams"
                path = "sendAuditManage"
                @storeChange = "onStoreChange"
                />
            </div>
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
        <div class="el-table-content">
            <el-tabs :id="getLangStyleValue(tabContentId)" v-model="activeName" @tab-click="onTabClick">
                <el-tab-pane
                    v-for="(item,index) in tableDataList"
                    :key="'sendAudit'+index"
                    :label="item.label"
                    :name="item.name">
                
                    <div class="list-table">
                        <table-only
                            ref="elTP"
                            class="table-white"
                            table-themes="white"
                            :column-data="item.tableColumns"
                            :table-data="item.tableData"
                            :highlight-current-row= "true"
                            :is-loading-data="isLoading"
                            :allowRowExpand = "false"
                            :showBorder = "false"
                            :default-sort = "defaultSort"
                            :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '6px',}" 
                            :tableHeight = "760"
                            :cellStyle="{backgroundColor: '#fff !important'}"
                            @onCellClick="clickDetail"
                            @sortChange="sortChange"
                        />
                    </div>
                    <div class="page-area">
                        <tbl-pagination-only
                        :btn-style="{backgroundColor:'transparent'}"
                        :total="curTotalPage"
                        :current-page="curPage"
                        :page-size.sync="curSizeNum"
                        layout = "prev,pager, next,sizes,slot"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange"
                        />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        
    </div>
</template>
<script>
import util from '@/common/util.js';
import { workflowRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import DelayButton from '@/components/DelayButton';
import StoreFilter from '@/components/StoreFilter';
import DateTimeSelector from '@/components/DateTimeSelector';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import TableOnly from '@/components/TableOnly';
import DialogVue from '@/components/DialogVue';
import PermissionHelper from '@/api/PermissionHelper';

export default{
    name: 'SendAuditManage',
    components: {
        DateTimeSelector,
        StoreFilter,
        DelayButton,
        TblPaginationOnly,
        TableOnly,
        DialogVue
    },
    data() {
        return {
            lang: this.$i18n.locale,
            isFirstLoad: false,
            isLoading:false,
            storeFilterObj:{},
            ifSearchData: true,
            ifSaveParams: false,
            ifChangeAccount: false,
            searchParams: {},
            dateValue:[],
            inputSearchValue: '',
            curTabIndx:0,
            activeName:'0',
            curStoreIds:-1,
            curTotalPage:0,
            curPage:1,
            curSizeNum:10,
            defaultSort:{order:'descending',prop:'processLastUpdateTs'},
            curOrder:{
                      direction:'desc',
                      property:'processLastUpdateTs'
            },
            tableDataList:[
                {
                  label: this.$t('audit.sendAudit.all'),
                  name: '0',
                  taskCount: 0,
                  tableData: [],
                  tableColumns:[
                    {
                      'prop': 'storeName',
                      'label': this.$t('audit.sendAudit.storeName'),
                      'sortable': false,
                      'width': 80,
                      'maxWidth': 80,
                      'isExpand': false
                    },
                    {
                      'prop': 'reportName',
                      'label': this.$t('audit.sendAudit.reportName'),
                      'sortable': false,
                      'width': 60,
                      'maxWidth': 60,
                      'isExpand': false
                    },
                    {
                      'prop': 'processStartTs',
                      'label': this.$t('audit.sendAudit.submitTime'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'auditStatusName',
                      'label': this.$t('audit.sendAudit.auditStatus'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'processLastUpdateTs',
                      'label': this.$t('audit.sendAudit.updateTime'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'taskOwner',
                      'label': this.$t('audit.sendAudit.owner'),
                      'sortable': true,
                      'width': 65,
                      'maxWidth': 65,
                      'minWidth': 65,
                      'isExpand': false
                    },
                    {
                      'prop': 'operator',
                      'label': this.$t('audit.sendAudit.operation'),
                      'sortable': false,
                      'width': 50,
                      'maxWidth': 50,
                      'isExpand': false,
                      'isCellClick':true,
                      'align': 'left',
                      'customIcon': false,
                      'methods': 'set'
                    }
                  ],
                  order:{
                      direction:'desc',
                      property:'processLastUpdateTs'
                  },
                  totalPage: 1,
                  sizeNum:10
                },
                {
                  label: this.$t('audit.sendAudit.processing'),
                  name: '1',
                  taskCount: 0,
                  tableData: [],
                  tableColumns:[
                    {
                      'prop': 'storeName',
                      'label': this.$t('audit.sendAudit.storeName'),
                      'sortable': false,
                      'width': 80,
                      'maxWidth': 80,
                      'isExpand': false
                    },
                    {
                      'prop': 'reportName',
                      'label': this.$t('audit.sendAudit.reportName'),
                      'sortable': false,
                      'width': 60,
                      'maxWidth': 60,
                      'isExpand': false
                    },
                    {
                      'prop': 'processStartTs',
                      'label': this.$t('audit.sendAudit.submitTime'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'auditStatusName',
                      'label': this.$t('audit.sendAudit.auditStatus'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'processLastUpdateTs',
                      'label': this.$t('audit.sendAudit.updateTime'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'taskOwner',
                      'label': this.$t('audit.sendAudit.owner'),
                      'sortable': true,
                      'width': 65,
                      'maxWidth': 65,
                      'minWidth': 65,
                      'isExpand': false
                    },
                    {
                      'prop': 'operator',
                      'label': this.$t('audit.sendAudit.operation'),
                      'sortable': false,
                      'width': 50,
                      'maxWidth': 50,
                      'isExpand': false,
                      'isCellClick':true,
                      'align': 'left',
                      'customIcon': false,
                      'methods': 'set'
                    }
                  ],
                  order:{
                      direction:'desc',
                      property:'processLastUpdateTs'
                  },
                  totalPage: 1,
                  sizeNum:10
                },
                {
                  label: this.$t('audit.sendAudit.completed'),
                  name: '2',
                  taskCount: 0,
                  tableData: [],
                  tableColumns:[
                    {
                      'prop': 'storeName',
                      'label': this.$t('audit.sendAudit.storeName'),
                      'sortable': false,
                      'width': 80,
                      'maxWidth': 80,
                      'isExpand': false
                    },
                    {
                      'prop': 'reportName',
                      'label': this.$t('audit.sendAudit.reportName'),
                      'sortable': false,
                      'width': 60,
                      'maxWidth': 60,
                      'isExpand': false
                    },
                    {
                      'prop': 'processStartTs',
                      'label': this.$t('audit.sendAudit.submitTime'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'auditStatusName',
                      'label': this.$t('audit.sendAudit.auditStatus'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'processLastUpdateTs',
                      'label': this.$t('audit.sendAudit.updateTime'),
                      'sortable': true,
                      'width': 100,
                      'maxWidth': 100,
                      'isExpand': false
                    },
                    {
                      'prop': 'taskOwner',
                      'label': this.$t('audit.sendAudit.owner'),
                      'sortable': true,
                      'width': 65,
                      'maxWidth': 65,
                      'minWidth': 65,
                      'isExpand': false
                    },
                    {
                      'prop': 'operator',
                      'label': this.$t('audit.sendAudit.operation'),
                      'sortable': false,
                      'width': 50,
                      'maxWidth': 50,
                      'isExpand': false,
                      'isCellClick':true,
                      'align': 'left',
                      'customIcon': false,
                      'methods': 'set'
                    }
                  ],
                  order:{
                      direction:'desc',
                      property:'processLastUpdateTs'
                  },
                  totalPage: 1,
                  sizeNum:10
                },                                                                      
            ],
            tabContentId:[{key:'en',value:'#en-tabs-content'},{key:'zh',value:'#en-tabs-content'},{key:'zhtw',value:'#en-tabs-content'},
                {key:'ja-JP',value:'#en-tabs-content'},{key:'ko-KR',value:'#en-tabs-content'},{key:'vi-VN',value:'#en-tabs-content'},
                {key:'id-ID',value:'#en-tabs-content'},{key:'th-TH',value:'#th-tabs-content'}]
            };
    },
    computed: {
        ...mapGetters({ accountChanged: 'accountChanged' })
    },
    watch: {
        accountChanged(val) {
            const self = this;
            
            if (val !== 0) {
                window.setTimeout(function() {
                self.$route.meta.keepAlive = true;
                },
                300);
                self.initData();
                self.ifChangeAccount = true;
                self.ifSaveParams = false;
                self.ifSearchData = true;
            }
        },
    },
    created(){
        this.isFirstLoad = true;
    },
    activated() {
        console.log('send actived isFirstLoad:',this.isFirstLoad);
        const self = this;
        if (!self.$route.meta.isBack || self.isFirstLoad) {
            self.initData();
        }
        self.$route.meta.isBack = false;
        self.isFirstLoad = false;
    },
    deactivated() {
        console.log('send deactivated');
        this.saveSearchParams();
    },
    methods: {
        getLangStyleValue(langArray){
            return util.getLangStyleValue(langArray);
        },
        initData() {
            const self = this;
            self.isLoading = true;
            self.curTabIndx = 0;
            self.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
            self.inputSearchValue = '';
            self.curTotalPage = 0;
            
            self.getSearchParams();
            //this.tableDataList[Number(this.activeName)].page = 1;
            self.getAllTask()
        },
        onStoreChange(storeObj) {
            console.log('onStoreChange>storeFilterObj', storeObj);
            this.storeFilterObj = storeObj;
            //this.ifSearchData && this.getEventListAndCount();
            this.ifSearchData = false;
        },
        onDateChange(val) {
            console.log('dateChange~~~>' , val);
            const self = this;
            const tabIndex = Number(self.curTabIndx);
            const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
            const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
            self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
            self.dateValue[1] = self.dateValue[1];
            self.inputSearchValue = '';
            self.dateValue[1] = self.dateValue[1];
            //self.tableDataList[tabIndex].page = 1;
        },
        onSearchClick() {
            this.searchParams = this.storeFilterObj;
            this.curStoreIds = this.storeFilterObj.filterStoreIds;
            this.tableDataList[this.curTabIndx].page = 1;
            this.curPage=1;
            this.getAllTask();
            this.saveSearchParams();
        },
        getSearchParams() {
            const searchParams = SearchConditionUtil.getSearchCondition('sendAuditManage');
            //this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
            //this.params.beginTs = this.dateValue[0].valueOf();
            //this.params.endTs = this.dateValue[1].valueOf();
            // console.log('EventMange > getSearchParams > searchParams:', searchParams);
            if (Object.keys(searchParams).length > 0) {
                this.storeFilterObj = searchParams;
                this.inputSearchValue = searchParams.inputSearchValue;
                //this.curState = searchParams.curState;
                this.curStoreIds = searchParams.filterStoreIds;
                this.curTabIndx = searchParams.curTabIndx;
                this.activeName = searchParams.curTabIndx.toString();
                this.curSizeNum = (typeof searchParams.sizeNum=='undefined')?10:searchParams.sizeNum;
                this.curOrder = (typeof searchParams.order=='undefined')?{direction:'desc',property:'processLastUpdateTs'}:searchParams.order;
                this.defaultSort = {order:(this.curOrder.direction=='desc')?'descending':'ascending',prop:this.curOrder.property};
                this.searchParams = searchParams;
                //this.saveSearchParams();
            } else {
                this.searchParams = {};
                this.curStoreIds = this.storeFilterObj.filterStoreIds;
                this.dateValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
                //this.params.beginTs = this.dateValue[0].valueOf();
                //this.params.endTs = this.dateValue[1].valueOf();
            }
        },
        saveSearchParams() {
            // console.log('saveSearchParams:', this.storeFilterObj);
            const params = {...this.searchParams};
            params['inputSearchValue'] = this.inputSearchValue;
            params['curTabIndx'] = this.curTabIndx;
            params['sizeNum'] = this.curSizeNum;
            params['order'] = this.curOrder;
            const searchConditon = {
                path: 'sendAuditManage',
                params: params
            };
            // console.log('save params:', params);
            SearchConditionUtil.saveSearchCondition(searchConditon);
        },
        onTabClick(val) {
            console.log('onTabClick',val);
            //const self = this;
            this.curTabIndx = Number(val.index);
            this.activeName = val.name;
            //console.log("cur ", this.tableDataList[this.curTabIndx]);
            this.curTotalPage = this.tableDataList[this.curTabIndx].totalPage;
            this.curSizeNum = this.tableDataList[this.curTabIndx].sizeNum;
            this.curOrder = this.tableDataList[this.curTabIndx].order;
            this.getAllTask();
        },
        currentChange(val) {
            const self = this;
            self.curPage = val.page;
            //self.params.filter = { page: val.page - 1, size: self.sizeNum };
            self.getAllTask();
        },

        sizeChange(val) {
            const self = this;
            self.curSizeNum = val.size;
            self.curPage = 1;
            
            self.tableDataList[self.curTabIndx].sizeNum = val.size;
            //self.params.filter = { page: 0, size: val.size };
            self.getAllTask();
        },
        sortChange(col){
            const self = this;
            const order = col.order;
            if (order === 'ascending') {
                self.curOrder = {
                    'direction': 'asc',
                    'property': col.column.property
                };
            } else if (order === 'descending') {
                self.curOrder = {
                    'direction': 'desc',
                    'property': col.column.property
                };
            } else {
                self.curOrder = {
                    'direction': 'desc',
                    'property': 'processLastUpdateTs'
                };
            }
            self.tableDataList[self.curTabIndx].order = self.curOrder;
            self.getAllTask();
        },
        getAllTask(){
            for (let i = 0; i < 3; i++) {
                this.tableDataList[i].tableData = [];
                this.tableDataList[i].taskCount = 0;
                this.tableDataList[i].totalPage = 0;
            }
            console.log("this.curTabIndx:",this.curTabIndx);
            var params = {
                beginTs:this.dateValue[0].valueOf(),
                endTs:this.dateValue[1].valueOf(),
                storeId:(this.curStoreIds==-1)?this.storeFilterObj.filterStoreIds:this.curStoreIds,
                type:0,//0: 登入user創建的, 我發送的
                filter:{
                    page:this.curPage-1,
                    size:this.curSizeNum
                },
            };
            
            if(this.curTabIndx==1){//進行中
                params['auditState'] = [2,3,6];
            }else if(this.curTabIndx==2){//已完成
                params['auditState'] = [4,5] 
            }
            if(this.inputSearchValue.trim()!=''){
                params['keyword'] = this.inputSearchValue;
            }
            if(Object.keys(this.curOrder).length>0){
                params['order'] = this.curOrder;
            }
            console.log("params:",params);
            const self =this;
            return new Promise((resolve) => {
                workflowRESTful.GetlistWorkflowTaskByType(params).then(res=>{
                    const errCode = res.errCode;
                    let data = [];
                    if (errCode === 0) {
                        data = res.data.content;
                    }
                    const tempAll = [];
                    //const tempProcessing = [];
                    //const tempCompleted = [];
                    //var processingCount=0, completedCount=0;
                    self.isLoading = true;
                    for(const task of data){
                        var taskObj = {...task};
                        taskObj.processStartTs =  util.getDateStr(task.processStartTs);
                        taskObj.processLastUpdateTs =  util.getDateStr(task.processLastUpdateTs);
                        taskObj['auditStatusName'] = util.getAuditStatusName(task.auditState);
                        taskObj['operator']=this.$t('statistics.check');
                        if(task.auditState==2 || task.auditState==3 || task.auditState==6){//進行中
                            //processingCount+=1;
                            //tempProcessing.push(taskObj);
                            if(task.auditState==3 || task.auditState==6){
                                taskObj.taskOwner =  task.submitterName;//若狀態為駁回 或 撤回 則當前處理人為 送出人
                            }
                        }else if(task.auditState==4 || task.auditState==5){//已完成
                            //completedCount+=1;
                            taskObj.taskOwner = "--";
                            //tempCompleted.push(taskObj);
                        }
                        tempAll.push(taskObj);
                    }
                    self.tableDataList[self.curTabIndx].tableData = tempAll;
                    self.tableDataList[self.curTabIndx].taskCount = res.data.numberOfElements;
                    self.tableDataList[self.curTabIndx].totalPage = res.data.totalPages;
                    
                    /*self.tableDataList[1].tableData = tempProcessing;
                    if(tempProcessing.length>0){
                        self.tableDataList[1].taskCount = processingCount;
                        self.tableDataList[1].totalPage = Math.ceil(processingCount/self.curSizeNum);
                    }
                    self.tableDataList[2].tableData = tempCompleted;
                    if(tempCompleted.length>0){
                        self.tableDataList[2].taskCount = completedCount;
                        self.tableDataList[2].totalPage = Math.ceil(completedCount/self.curSizeNum);
                    }*/
                    self.curTotalPage = self.tableDataList[self.curTabIndx].totalPage;
                    self.curSizeNum = self.tableDataList[self.curTabIndx].sizeNum;
                    self.curOrder = self.tableDataList[self.curTabIndx].order;
                    console.log("curTotalPage:",self.curTotalPage);
                    resolve(tempAll);
                }).then(result=>{
                    self.isLoading = false;
                }).catch(err => {
                    console.log("getMyworkflowTask error:",err);
                });
            });
        },
        clickDetail(item, index) {
            const self = this;
            console.log("clickDetail:",item);
            //sessionStorage.setItem('audit_detail', JSON.stringify(item.routeObj));
            //self.$router.push({ name: 'auditDetails', params: { data: item.routeObj }});
        },
    },
    
}
</script>
<style lang="scss" scoped>
.el-audit-header{
    .search-button{
      float: right;
      color:#FFF;
      &:hover{
        background-color: #3d4854;
        color:#FFF;
      }
    }
}
.el-table-content{
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    position: relative;
    padding-top: calc(30/1920*100vw);
    .list-table{
      
      .table-white {
        /deep/
        .el-table{
          box-shadow: none !important;
          border: none !important;
          background-color: #fff;
          padding-left: 12px;
          padding-right: 12px;
        }
      }
    }
}
.page-area{
    //position: absolute;
    height: 30px;
    margin-top: -10px;
    .el-pag{
        position: absolute;
        //float: right;
        right: calc(20/1920*100vw);
        bottom: 0px;
    }
}
</style>
<style scoped>
 @import '../../assets/css/pagination.css';
 @import '../../assets/css/tabsItem.css';
    .el-table::before{
        height: 0px !important;
    }
    .page-login-toolTipClass.el-tooltip__popper.is-light{
        background: #FEE4E7 !important;
        color: #f31d65 !important;
        border: 1px solid #f31d65 !important;
    }
    .date-picker-poper .el-button--text{
        visibility: hidden !important;
    }
     .select-poper .el-select-dropdown__item.hover{
        background-color:#FEE4E7;
    }
   .self-class-name .cell{
     display: flex ;
     align-items: center;
   }
   .table-content.el-table__body tr:hover>td{
    background-color: #f2f9fe !important;
  }

</style>