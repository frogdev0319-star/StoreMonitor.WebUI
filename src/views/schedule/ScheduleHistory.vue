<template>
    <div class="ScheduleContainer">
      <div class="search-bar">
          <date-time-selector class="time-selector" :dateRangeTitle="$t('schedule.schStartDate')" @change="dateChange"/>
          <div class='status-area'>
            <div class="search-label">{{$t('audit.workFlows.workFlowsStauts')}}</div>
            <el-select
              v-model="curSchStatus"
              class="el-province"
              :placeholder="$t('remotePatrol.all')"
              size="mini"
              style="margin-right:0px;border:none;"
              @change="getInspectList"
            >
              <el-option
                v-for="item in schStatusList"
                :key="item.mode"
                :label="item.label"
                :value="item.mode"/>
            </el-select>
          </div>
          <div class='keyword-area'>
              <div class="search-label">{{$t('remotePatrol.keywords')}}</div>
              <el-input
                  v-model="inputSearchValue"
                  size="medium"
                  class="search-input shadow-light"
                  clearable/>
          </div>
          <delay-button
            class="search-button"
            type="primary"
            size="mini"
            @click="doSearchScheduleList">
            <span>{{ $t('remotePatrol.search') }}</span>
          </delay-button>
      </div>
      <div class="scheduleLlist-area">
        <delay-button
          :class="getLangStyleValue(exportBtnClass)"
          style="margin-left:32px;background-color:#FFF;color:#006ab7;float:right;"
          type="default"
          size="mini"
          @click="export2Excel"
        >
          <div class="button-area">
            <img :src="exportPng" class="icon-excel">
            <span>{{ $t('eventView.exportReport') }}</span>
          </div>
        </delay-button>
        <table-only
            ref="elTP"
            class="table-white tbl-schedule"
            table-themes="white"
            :showSelectionColumn="true"
            :column-data="columnData"
            :table-data="tableData"
            :table-operation ="columnOperationData"
            :highlight-current-row= "false"
            :is-loading-data="isLoadingData"
            :allowRowExpand = "false"
            :showBorder = "false"
            :default-sort = "defaultSort"
            :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
            :tableHeight = "760"
            :cellStyle="{backgroundColor: '#fff !important'}"
            @onCellClick="onCellClick"  
            @sortChange="handleSortChange"    
            @selection-change="handleSelectionChange"                            
        />
        <div style="width:100%; margin-top:12px;height:31px;">
            <tbl-pagination-only
                :btn-style="{backgroundColor:'transparent'}"
                :total="total"
                :current-page="curPage"
                :page-size="curSizeNum"
                layout = "prev,pager, next,sizes,slot"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
            />
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DateTimeSelector from '@/components/DateTimeSelector';import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop'
import util from '@/common/util';

export default{
  name: 'ScheduleHistory',
  components: {DateTimeSelector,TableOnly,TblPaginationOnly,DelayButton,DialogPop},
  data(){
    return {
      inputSearchValue:'',
      dateValue:[],
      columnData:[
        {
          'prop': 'schName',
          'label': this.$t('schedule.schName'),
          'sortable': false,
          'width': 200,
          'maxWidth': 200,
          'isExpand': false
        },
        {
          'prop': 'store',
          'label': this.$t('schedule.store'),
          'sortable': false,
          'width': 50,
          'maxWidth': 50,
          'isExpand': false
        },
        {
          'prop': 'startDateStr',
          'label': this.$t('schedule.schExeDate'),
          'sortable': 'custom',
          'width': 50,
          'maxWidth': 50,
          'isExpand': false
        },
        {
          'prop': 'tagName',
          'label': this.$t('statistics.patrolPerson.tagName'),
          'sortable': false,
          'width': 300,
          'maxWidth': 300,
          'isExpand': false,
          'hasIcon':{
              icon:require('@/../static/img/table-help.png'),
              tooltipContent:this.$t('schedule.tagInfo')
          }
        },
        {
          'prop': 'reportUploadDateStr',
          'label': this.$t('schedule.reportUploadDate'),
          'sortable': 'custom',
          'width': 130,
          'maxWidth': 130,
          'isExpand': false
        },
        {
          'prop': 'incepPerson',
          'label': this.$t('schedule.incepPerson'),
          'sortable': false,
          'width': 100,
          'maxWidth': 100,
          'isExpand': false
        },
        {
          'prop': 'incepPerson',
          'label': this.$t('audit.workFlows.workFlowsStauts'),
          'sortable': false,
          'width': 100,
          'maxWidth': 100,
          'isExpand': false
        },
        {
          'prop': 'detail',
          'label': this.$t('audit.sendAudit.operation'),
          'sortable': false,
          'width': 50,
          'maxWidth': 50,
          'isExpand': false,
          'isCellClick':true,
          'align': 'left',
        }
      ],
      tableData:[{schName:'1',store:'門店名稱\n'+'+8',tagName:'遠程巡檢\ntest',incepNum:3,startDateStr:'2023/01/01',reportUploadDateStr:'2023/01/02',detail:'查看'}],
      isLoadingData:true,
      total:0,
      curPage:1,
      curSizeNum:10,
      defaultSort:{prop: 'reportUploadDateStr', order: 'descending'},
      SelSchedulId:[],
      curSchStatus:-1,
      schStatusList:[
        { 'mode': -1, 'label': this.$t('remotePatrol.all') },
        { 'mode': 0, 'label': this.$t('schedule.Completed') },
        { 'mode': 1, 'label': this.$t('schedule.inCompleted') }
      ],
      exportPng: require('../../../static/img/excel.png'),
      exportBtnClass:[
        {key:'en',value:'en-export-btn'},{key:'zh',value:'zh-export-btn'},{key:'zhtw',value:'zhTW-export-btn'},
        {key:'ja-JP',value:'ja-export-btn'},{key:'ko-KR',value:'ko-export-btn'},{key:'vi-VN',value:'vi-export-btn'},
        {key:'id-ID',value:'id-export-btn'},{key:'th-TH',value:'th-export-btn'}
      ],
    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.init();
        /*const start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        const end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.getSearchCondition();
        self.curStoreTag = [];*/
      }
    },

  },
  created() {
    this.init();
  },
  methods:{
    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    init(){
      this.curSchStatus= -1,
      this.inputSearchValue='',
      this.dateValue = [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()];
    },
    dateChange(val) {
        console.log(">>>>dateChange!!");
        const self = this;
        const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
        const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
        self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
        self.dateValue[1] = self.dateValue[1];
        self.inputSearchValue = '';
        this.doSearchScheduleHis();
    },
    doSearchScheduleHis(){
      const self = this;
      let order = self.defaultSort;
      order.direction = this.defaultSort.order=='ascending'? 'asc':'desc';
      if(self.defaultSort.prop=="reportUploadDateStr") order.prop = "reportUploadDate";
      else if(self.defaultSort.prop=="startDateStr") order.prop = "startDate";
      let beginTs = self.$moment.utc(self.$moment(self.dateValue[0])).valueOf();
      let endTs = self.$moment.utc(self.$moment(self.dateValue[1])).valueOf();
      const params={
        beginTs,
        endTs,
        filter:{
          page:this.curPage-1,
          size:this.curSizeNum
        },
        order
      }

    },
    onCellClick(row){
      console.log(">>>>row:",row);
    },
    handleSortChange(order, defaultSort) {
        this.defaultSort = { ...defaultSort };
        
        this.doSearchScheduleHis();
    },
    currentChange(val) {
        const self = this;
        self.curPage = val.page;
        self.doSearchScheduleHis();
    },
    sizeChange(val) {
        const self = this;
        self.curSizeNum = val.size;
        self.curPage = 1;
        self.doSearchScheduleHis();
    },
  }
}
</script>

<style scoped lang="scss">
.ScheduleContainer{
    width:100%;

    .search-bar{
        display:flex;
        flex-direction:row;
        margin: 0px 0 20px 0px;
        height:calc(36/1920*100vw);
        align-items: center;
        font-size:calc(16/1920*100vw);
        justify-content: space-between;
        .status-area{
            display: flex;
            flex-direction: row;
            align-items: center;
            .search-label{
                min-width: 76px;
                text-align: left;
                align-self: center;
                font-family: NotoSansCJKTC;
                font-size: calc(15/1920*100vw);
                font-weight: normal;
                word-break: keep-all;
                padding-right: 16px;
            }
        }
        .keyword-area{
            display: flex;
            flex-direction: row;
            margin-left: calc(32/1980*100vw);
            align-items: center;
            .search-label{
                min-width: 76px;
                text-align: left;
                align-self: center;
                font-family: NotoSansCJKTC;
                font-size: calc(15/1920*100vw);
                font-weight: normal;
                word-break: keep-all;
                padding-right: 16px;
            }
        }
        .search-button{
            margin-left:35px;
            width: 102px;
            height: calc(36/1920*100vw);
            background-color: #556679;
            border-color: #556679;
            color:#fff;
            font-size: calc(15/1920*100vw);
        }
    }
    .scheduleLlist-area{
        background-color: #FFF;
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        padding: 20px 26px 48px 24px;
        .buttons{
            height: 40px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: end;
            align-items: center;
        }
        .tbl-schedule{
            border: none;
            margin-top: 40px;
            /deep/ .el-table__header-wrapper .el-table-column--selection{
                padding-left: 0px !important;
                font-size: 14px !important;
            }
            /deep/.el-table__header-wrapper
            .el-table-column--selection
            .el-checkbox__inner 
            {
                border-radius: 1px;
                border: none;
                background-color: #fff;
                &:hover{
                    border-color: #dcdfe6 !important;
                }
            }
            /deep/ .el-table__header-wrapper .el-checkbox{
                display:block;
                .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                    background-color: #2c90d9;
                    border-color: #2c90d9;
                    color:#FFF;
                }
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    color: #1375bc;
                    font-weight: 400;
                    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 0px;
                    border: none;
                }
                .el-checkbox__input.is-focus .el-checkbox__inner {
                border-color: #2c90d9;
                }
                .el-checkbox__inner:hover {
                border-color: #2c90d9;
                }
            }
            /deep/.el-table__body-wrapper .el-checkbox{
                border: none;
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    color: #1375bc;
                    font-weight: 400;
                    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 20px;
                    border: none;
                }
            }
            /deep/ .el-table__body-wrapper::-webkit-scrollbar {
                width: 4px; /*滚动条宽度*/
                height: 150px; /*滚动条高度*/
            }
            /*定义滚动条轨道 内阴影+圆角*/
            /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
                /*box-shadow: 0px 1px 3px #071e4a inset; 滚动条的背景区域的内阴影*/
                border-radius: 10px; /*滚动条的背景区域的圆角*/
                background-color: #FFF; /*滚动条的背景颜色*/
            }
            /*定义滑块 内阴影+圆角*/
            /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
                box-shadow: 0px 1px 3px #acaeb1 inset; /*滚动条的内阴影*/
                border-radius: 2px; /*滚动条的圆角*/
                background-color: #acaeb1; /*滚动条的背景颜色*/
            }
        }
    }
    /deep/
    .el-table{
        border:none;
        box-shadow: none;
    }
    /deep/
      .el-table th .cell{
      padding-left: 0px !important;
    }
    /deep/
    .el-table .cell span{
      white-space: pre-line;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .el-checkbox__inner 
    {
      border-radius: 1px;
      border: solid 1px #acaeb1;
      background-color: #fff;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .is-checked
    .el-checkbox__inner 
    {
      /*border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #e0f2ff;
      color:#2c90d9;
      &::after{
       border-color:#2c90d9;
      }*/
        color: #1375bc;
        font-weight: 400;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
        background-position: center right 0px;
        border: none;
    }
}
</style>
