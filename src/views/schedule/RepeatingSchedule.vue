<template>
    <div class="ScheduleContainer">

        <div class="search-bar">
            <div class='keyword-area'>
                <div class="search-label" >時間 </div>
                <el-time-picker
                  v-model="taskTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="設定巡檢時間"
                />
            </div>

            <div class='keyword-area'>
                <div class="search-label" >地點</div>
                <el-select
                  v-model="selectStore"
                  placeholder="巡檢地點"
                  clearable = "true"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in storeList"
                    :key="item.storeId"
                    :label="item.name"
                    :value="item.storeId"
                  />
                </el-select>
            </div>

            <div class='keyword-area'>
                <div class="search-label" >執行人</div>
                <el-select
                  v-model="selectUser"
                  placeholder="執行人員"
                  clearable = "true"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in userInfo"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
            </div>

            <div class='keyword-area'>
                <div class="search-label" >重複排程 </div>
                <el-select
                  v-model="repeatCycle"
                  :placeholder="$t('schedule.remiderMethod')"
                  multiple
                  filterable
                  clearable = "true"
                  style="width:300px"
                  >
                  <el-option
                    v-for="(_item, index) in selectRemiderStyle"
                    :key="index"
                    :label="_item.label"
                    :value="_item.value"
                  />
                </el-select>
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
                <delay-button
                    class="storevue-button-empty add_button"
                    @click="addNewSchedule">
                    <div class="button-area">
                        <i class="iconfont el-icon-plus" />
                        <span>{{$t('schedule.addSchedule')}}</span>
                    </div>
                </delay-button>
                <delay-button
                    class="storevue-button-empty del_button"
                    :disabled="!enableDeleteBtn"
                    @click="deleteSchedule" >
                    <div class="button-area ">
                        <span>{{$t('scheduleView.delete')}}</span>
                    </div>
                </delay-button>
            </div>

            <table-only
                ref="elTP"
                class="table-white tbl-schedule-repeat"
                table-themes="white"
                :showSelectionColumn="true"
                :column-data="columnData"
                :table-data="tableData"
                :tableRepeatWeekDays = "repeatWeekDaysItems"
                :table-operation ="columnOperationData"

                :highlight-current-row= "false"
                v-loading="isLoadingData"

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
import { getBriefStoreList} from '@/api/store';
import {getAllUserInfoNoAuth} from '@/api/login';
import {  GetInspectTagList, GetInspectTagListAll } from '@/api/inspect';
import DateTimeSelectorSchedule from '@/components/DateTimeSelectorSchedule';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop'
import util from '@/common/util';

export default{
    name: 'RepeatingSchedule',
    components: {
        DateTimeSelectorSchedule,
        TableOnly,
        TblPaginationOnly,
        DelayButton,
        DialogPop
    },
    data(){
        return {
          firstLoad:true,
          userId:'',
          person:'',
          inputSearchValue:'',
          dateValue:[],
          columnData:[
          {
              'prop': 'name',
              'label': '排程名稱',
              'sortable': false,
              'width': 300,
              'maxWidth': 300,
          },
          {
              'prop': 'excuteTime',
              'label': '執行時間',
              'sortable': false,
              'width': 50,
              'maxWidth': 50,
          },
          {
              'prop': 'remindBeforeMinutes',
              'label': '提前提醒時間',
              'sortable': false,
              'width': 50,
              'maxWidth': 50,
          },
          {
              'prop': 'store',
              'label': '地點/時區',
              'sortable': false,
              'width': 100,
              'maxWidth': 100,
          },

          {
              'prop': 'executor',
              'label': '執行人',
              'sortable': false,
              'width': 130,
              'maxWidth': 130,
          },
          {
              'prop': 'inspection',
              'label': '巡檢表',
              'sortable': false,
              'width': 130,
              'maxWidth': 130,
          },
          // {
          //     'prop': 'repeatWeekDays',
          //     'label': '重複週期',
          //     'sortable': false,
          //     'width': 50,
          //     'maxWidth': 50,
          // },
        ],

        repeatWeekDaysItems: {
            label: '重複週期',
            minWidth: '120',
            align: 'left',

        },
        columnOperationData:{
            label: this.$t('titleView.operation'),
            minWidth: '50',
            align: 'left',
            operation: [
                {
                    lable: '',
                    icon: 'icon-setting',
                    methods: 'set'
                }
            ]
        },

        tableData:[],
        isLoadingData : true,
        total:0,
        curPage:1,
        curSizeNum:10,
        defaultSort:{prop: 'taskStartStr', order: 'descending'},
        enableDeleteBtn:false,
        SelSchedulId:[],
        showConfirmDelete:false,

        storeList:[],
        userInfo:[],
        selectStore: null,
        selectUser: null,
        allInspectTypeList: [],
        selectRemiderStyle:[
          {
            value: 1,
            label: '星期一'
          },
          {
            value: 2,
            label: '星期二'
          },
          {
            value: 3,
            label: '星期三'
          },
          {
            value: 4,
            label: '星期四'
          },
          {
            value: 5,
            label: '星期五'
          },
          {
            value: 6,
            label: '星期六'
          },
          {
            value: 7,
            label: '星期日'
          },
        ],
        taskTime: null,
        repeatCycle: [],
      }
    },
    computed: {
        ...mapGetters({ accountChanged: 'accountChanged' })
    },
    created(){
        this.init();
    },
    methods:{
      async init(){
        //存在sessionStorage，refresh時才會留著
        // const data = sessionStorage.getItem('PersonalSchedule')
        // this.personSchedule = JSON.parse(data)

        // this.userId = (Object.getOwnPropertyNames(this.$route.params).length>0)?this.$route.params.userId:this.personSchedule.userId;
        // this.person = (Object.getOwnPropertyNames(this.$route.params).length>0)?this.$route.params.nickName:this.personSchedule.userName;

        await this.getBriefStoreList();
        await this.getUserInfo();
        await this.getTagAll();
        await this.doSearchScheduleList();
      },


      async getBriefStoreList() {
        await getBriefStoreList().then(res => {
          this.storeList = res.data
          console.log('this.storeList ::::>> ', this.storeList);
        })
      },

      async getUserInfo(){
        await getAllUserInfoNoAuth().then(res=>{
          this.userInfo = res.data
          console.log('this.userInfo :>> ', this.userInfo);
        }).catch(err => {
          console.log('error' + err);
        });
      },

       // 取得巡檢表
      async getTagAll() {
        return new Promise((resolve, reject) => {
          GetInspectTagListAll().then(res => {
            const data = res.data;
            resolve(data);

            this.allInspectTypeList = data.map(i => ({
              id: i.id,
              name: i.name,
              mode: i.mode
            }))
            console.log(' this.allInspectTypeList =========>>>> ',  this.allInspectTypeList)

          }).catch(err => {
            reject(err);
          });
        });
      },

        // async dateChange(val) {
        //     console.log('dateChange :>> ');
        //     // const self = this;
        //     // const start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
        //     // const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
        //     // self.dateValue = [new Date().setTime(start), new Date().setTime(end)];
        //     // self.dateValue[1] = self.dateValue[1];
        //     // self.inputSearchValue = '';
        // },

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

        getdateOnlyDate(t){
            var date = new Date(t);
            var month = this.pad2(date.getMonth()+1);
            var day = this.pad2(date.getDate());
            var year= date.getFullYear();
            return year + "-"+ month +"-"+ day
            },


        doSearchScheduleList(){
            const self = this;
            self.isLoadingData = true;
            const params = {
                storeId: this.selectStore,
                userId: this.selectUser,
                weekDays: this.repeatCycle,
                // "inspectTagId": 0,
                // "name": "RD",

              }

            scheduleRESTful.getWeeklyTask(params).then(res=>{
                var userData = [];
                if(res.errCode == 0){

                    console.log('res.data !!!!>> ', res.data);
                    res.data.map(item => {
                      let obj = {...item};

                      obj.excuteTime = item.startTimeHH + ":" + (item.startTimeMM == 0 ? "00" : item.startTimeMM)
                      obj.remindBeforeMinutes = item.remindBeforeMinutes + " min"

                      var repeatWeekDays = []
                      item.weekDays.forEach(i => {
                        if(i == 1){ repeatWeekDays.push("星期一") }
                        else if(i == 2) { repeatWeekDays.push("星期二") }
                        else if(i == 3) { repeatWeekDays.push("星期三") }
                        else if(i == 4) { repeatWeekDays.push("星期四") }
                        else if(i == 5) { repeatWeekDays.push("星期五") }
                        else if(i == 6) { repeatWeekDays.push("星期六") }
                        else if(i == 7) { repeatWeekDays.push("星期日") }
                      })
                      obj.repeatWeekDays = repeatWeekDays

                      var _store = this.storeList.filter( i => item.storeId == i.storeId)
                      obj.store = _store.length == 0 ? '' : _store[0].name

                      var _user = this.userInfo.filter( i => i.userId == item.userId)
                      obj.executor = _user[0].userName

                      var _inspect = this.allInspectTypeList.filter( i => i.id == item.inspectTagId)
                      obj.inspection = _inspect.length == 0 ? '--' : _inspect[0].name

                      userData.push(obj);
                    })


                    self.tableData = [];
                    self.tableData = userData;

                    console.log('self.tableData :>> ', self.tableData);
                    self.total = res.data.totalPages;
                    self.isLoadingData = false;

                }else{
                    util.notify("?????", 'error', 3000);
                }

            }).catch(err=>{
                console.log("getScheduleListFail error",err);
                util.notify(self.$t('schedule.getScheduleSettingFail')+',error:'+err, 'error', 3000);
                this.isLoadingData = false;
            });
        },


        addNewSchedule(){
            sessionStorage.removeItem('repeatScheduleParams')

            let params= {
                action: 'addSchedule',
                userId: this.userId,
            };
            sessionStorage.setItem('repeatScheduleParams', JSON.stringify(params))
            this.$router.push({ name: 'RepeatingScheduleSetting', params: { userId: this.userId,userName:this.person}});
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

        // 確認刪除
        onConfirmDeleteSch(){

            this.isLoadingData = true;
            const param = this.SelSchedulId
            scheduleRESTful.deleteWeeklyTask(param).then(res =>{
              if(res.errCode === 0){
                util.notify("重複排程刪除成功", 'success', 3000);
                this.showConfirmDelete = false
                this.isLoadingData = false;
                this.doSearchScheduleList()

              }
            })
            // this.showConfirmDelete = false;
            // let params = {
            //     taskGroupUuidArray: this.SelSchedulId,
            //     userId: this.userId,
            // }
            // scheduleRESTful.deletePersonTaskList(params).then(res=>{
            //     if(res.errCode==0){
            //         this.doSearchScheduleList();
            //     }else{
            //         util.notify(this.$t('schedule.deletePersonSchError'), 'error', 2000);
            //     }
            // })
        },

        handleOperation({row }) {
            console.log('row :>> ', row);
            sessionStorage.removeItem('repeatScheduleParams')

            row.action = "editSchedule"
            console.log("handleOperation params:",row);
            sessionStorage.setItem('repeatScheduleParams', JSON.stringify(row))

            this.$router.push({ name: 'RepeatingScheduleSetting', params: { userId: this.userId}});

            // let copyParams = {
            //     taskGroupUuid: row.taskGroupUuid,
            //     userId: this.userId,
            // }
            // switch(method){
            //     case 'set':{
            //         this.$router.push({ name: 'RepeatingScheduleSetting', params: { userId: this.userId,userName:this.person,taskGroupUuid: row.taskGroupUuid }});
            //         break;
            //     }
            //     default: {
            //         break;
            //     }
            // }
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

    }
}
</script>
<style lang="sass" scoped>
    .button-area
        overflow: visible
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
    .add_button
        height: 35px
        padding: 5px 20px !important
        background: #fff
        border-color: #c60957
        color: #c60957
        &:hover
            background: #fdf1f6
            opacity: 1

    .del_button
        height: 35px
        padding: 5px 20px !important
        background: #fff !important
        border-color: #999 !important
        color: #999 !important
        &:hover
            border-color: #999 !important
            color: #999 !important
            background: #f1f1f1 !important
</style>

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
        .tbl-schedule-repeat{
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
                    color: #2c90d9;
                    background-color:#2c90d9;
                    border-color: #2c90d9;
                    font-weight: 400;
                    // background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 0px;
                    // border: none;
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
                    background-color:#2c90d9;
                    border-color: #2c90d9;
                    font-weight: 400;
                    // background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 20px;
                    // border: none;
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
        // padding-left: 0px !important;
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
        color: #2c90d9;
        background: #2c90d9;
        font-weight: 400;
        // background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
        // background-position: center center;
        border: 1px solid #2c90d9;
    }
}
</style>
