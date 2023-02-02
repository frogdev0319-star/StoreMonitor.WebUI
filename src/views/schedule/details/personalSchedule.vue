<template>
    <div class="ScheduleContainer">
        <div class="search-bar">
            <date-time-selector class="time-selector" :dateRangeTitle="$t('schedule.schStartDate')" :pickFuturerDate="true" @change="dateChange"/>
            <div class='keyword-area'>
                <div class="search-label">{{$t('remotePatrol.keywords')}}</div>
                <el-input
                    v-model="inputSearchValue"
                    size="medium"
                    class="search-input shadow-light"
                    clearable/>
            </div>
            <div style="flex:2"></div>
            <delay-button
              class="search-button"
              type="primary"
              size="mini"
              @click="doSearchScheduleList">
              <span>{{ $t('remotePatrol.search') }}</span>
            </delay-button>
        </div>
        <div class="scheduleLlist-area">
            <div class="buttons">
                <delay-button @click="addNewSchedule">
                    <div class="button-area">
                        <i class="iconfont el-icon-plus"/>
                        <span>{{$t('schedule.addSchedule')}}</span>
                    </div>
                </delay-button>
                <el-button class="storevue-button-empty" :disabled="!enableDeleteBtn" @click="deleteSchedule" style="min-height:32px">
                    <div class="button-area">
                        <span>{{$t('scheduleView.delete')}}</span>
                    </div>
                </el-button>
            </div>
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
                @handleOperation="handleOperation"  
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
        <dialog-pop
          :title="$t('schedule.deleteSchedule')"
          :isWarning="true"
          :visible="showConfirmDelete"
          @cancelHandler = "showConfirmDelete=false"
          @confirmHandler="onConfirmDeleteSch"
          >
          <div class="dialog-slot">
            {{$t('schedule.confirmDeleteSchedule')}}
          </div>
        </dialog-pop>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {scheduleRESTful} from '@/api/index';
import DateTimeSelector from '@/components/DateTimeSelector';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop'
import util from '@/common/util';

export default{
    name: 'PersonalSchedule',
    components: {DateTimeSelector,TableOnly,TblPaginationOnly,DelayButton,DialogPop},
    data(){
      return {
        userId:'',
        person:'',
        inputSearchValue:'',
        dateValue:[],
        columnData:[
        {
            'prop': 'taskName',
            'label': this.$t('schedule.schName'),
            'sortable': false,
            'width': 200,
            'maxWidth': 200,
            'isExpand': false
          },
          {
            'prop': 'tagNameMode',
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
            'prop': 'taskCounts',
            'label': this.$t('schedule.incepNum'),
            'sortable': false,
            'width': 100,
            'maxWidth': 100,
            'isExpand': false
          },
          {
            'prop': 'taskStartStr',
            'label': this.$t('schedule.schStartDate'),
            'sortable': 'custom',
            'width': 50,
            'maxWidth': 50,
            'isExpand': false
          },
          {
            'prop': 'taskFinalStr',
            'label': this.$t('schedule.schEndDate'),
            'sortable': 'custom',
            'width': 130,
            'maxWidth': 130,
            'isExpand': false
          }
        ],
        tableData:[],
        columnOperationData:{
          label: this.$t('titleView.operation'),
          minWidth: '50',
          align: 'left',
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
              }
          ]
        },
        isLoadingData:true,
        total:0,
        curPage:1,
        curSizeNum:10,
        defaultSort:{prop: 'taskStartStr', order: 'descending'},
        enableDeleteBtn:false,
        SelSchedulId:[],
        showConfirmDelete:false,
      }
    },
    computed: {
      ...mapGetters({ accountChanged: 'accountChanged' })
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            //存在sessionStorage，refresh時才會留著
            const data = sessionStorage.getItem('PersonalSchedule')
            this.personSchedule = JSON.parse(data)
            
            this.userId = (Object.getOwnPropertyNames(this.$route.params).length>0)?this.$route.params.userId:this.personSchedule.userId;
            
            this.person = (Object.getOwnPropertyNames(this.$route.params).length>0)?this.$route.params.nickName:this.personSchedule.userName;
        },
        dateChange(val) {
            const self = this;
            const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
            const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
            self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
            self.dateValue[1] = self.dateValue[1];
            self.inputSearchValue = '';
            this.doSearchScheduleList();
        },
        doSearchScheduleList(){
            const self = this;
            self.isLoadingData = true;
            let beginTs = self.$moment.utc(self.$moment(self.dateValue[0])).valueOf();
            let endTs = self.$moment.utc(self.$moment(self.dateValue[1])).valueOf();
            const params={
              userId:self.userId,
              beginTs,
              endTs,
              filter:{
                page:this.curPage-1,
                size:this.curSizeNum
              },
              order:{
                direction:this.defaultSort.order=='ascending'? 'asc':'desc',
                property:this.defaultSort.prop=="taskStartStr"?"taskStart":(this.defaultSort.prop=="taskFinalStr"?"taskFinal":this.defaultSort.prop),
              }
            }
            if(self.inputSearchValue.trim()!=""){
              params["keyword"] = self.inputSearchValue;
            }
            scheduleRESTful.getPersonTaskList(params).then(res=>{
              var userData = [];

              if(res.errCode == 0){
                res.data.content.map(item =>{
                  //const mapUser = self.doMapUser(item.userId);
                  //console.log("mapUser:",mapUser);
                  let obj = {...item};
                  let mode = item.tagMode==0?self.$t('remotePatrol.remotePatrol'):self.$t('remotePatrol.onsitePatrol');
                  obj['tagNameMode'] = mode+'\n'+item.tagName;
                  //obj['updateTs']=item.updateTime,
                  obj['taskStartStr']=(item.taskStart==0)?'-':self.$moment.utc(self.$moment(item.taskStart)).format("YYYY/MM/DD hh:mm:ss");//util.getDateStr(item.taskStart),
                  //console.log(">>>taskStartStr:",self.$moment.utc(self.$moment(item.taskStart)).format("YYYY/MM/DD hh:mm:ss"));
                  obj['taskFinalStr']=(item.taskFinal==0)?'-':self.$moment.utc(self.$moment(item.taskFinalS)).format("YYYY/MM/DD hh:mm:ss");//util.getDateStr(item.taskFinal),
                  obj['updateUserName']=(item.updateUserName == "NONE")?'-':item.updateUserName,
                  userData.push(obj);
                });
                self.tableData = [];
                self.tableData = userData;
                self.total = res.data.totalPages;
                self.isLoadingData = false;
              }else{
                util.notify(self.$t('schedule.getScheduleSettingFail'), 'error', 3000);
              }

            }).catch(err=>{
              console.log("getScheduleListFail error",err);
              util.notify(self.$t('schedule.getScheduleSettingFail')+',error:'+err, 'error', 3000);
              this.isLoadingData = false;
            });
        },
        addNewSchedule(){
            this.$router.push({ name: 'CreateSchedule', params: { userId: this.userId,userName:this.person}});
        },
        deleteSchedule(){
            this.showConfirmDelete = true;
        },
        handleSelectionChange(val){
            console.log("handleSelectionChange:",val);
            this.SelSchedulId = [];
            if(val.length>0){
                this.enableDeleteBtn = true;
                val.map((item)=>{
                    this.SelSchedulId.push(item.id);
                })
            }else{
                this.enableDeleteBtn = false;
            }
        },
        onConfirmDeleteSch(){
            this.showConfirmDelete = false;
        },
        handleOperation({ method, row }) {
            let params= { userId: this.userId,taskGroupUuid: row.taskGroupUuid };
            console.log("handleOperation params:",params);
            switch(method){
                case 'copy':{
                    this.doCopyScheduleTask(row.taskGroupUuid);
                    break;
                }
                case 'set':{
                    this.$router.push({ name: 'ModifySchedule', params: { userId: this.userId,userName:this.person,taskGroupUuid: row.taskGroupUuid }});
                    break;      
                }
                default: {
                    break;
                }
            }
        },
        handleSortChange(order, defaultSort) {
            this.defaultSort = { ...defaultSort };
            this.doSearchScheduleList();
        },
        currentChange(val) {
            const self = this;
            self.curPage = val.page;
            self.doSearchScheduleList();
        },
        sizeChange(val) {
            const self = this;
            self.curSizeNum = val.size;
            self.curPage = 1;
            self.doSearchScheduleList();
        },
        doCopyScheduleTask(taskGroupUuid){
            scheduleRESTful.CopySchedulePersonSchedule({taskGroupUuid}).then(res => {
                if(res.errCode==0){
                    this.doSearchScheduleList();
                }
            })
        }
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
        .keyword-area{
            display: flex;
            flex-direction: row;
            margin-left: calc(32/1980*100vw);
            align-items: center;
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
            margin-top: 20px;
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
      span{
        white-space: pre-line;
      }
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
