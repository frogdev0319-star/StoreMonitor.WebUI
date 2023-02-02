<template>
    <div class="ScheduleContainer">
        <div class="search-bar">
            <div class='position-area'>
                <div>{{ $t('overview.position')}}</div>
                <region-multi-select
                    ref="multiState"
                    :selected="positionIds"
                    :options="positionsList"
                    :all="$t('statistics.patrolPerson.dutyAll')"
                    class="position"
                    @changeInput="handlePositionsChange"/>
            </div>
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
        <table-only
            ref="elTP"
            class="table-white"
            table-themes="white"
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
</template>

<script>
import { mapGetters } from 'vuex';
import { getDepartmentList } from '@/api/checkin';
import {scheduleRESTful} from '@/api/index';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import DelayButton from '@/components/DelayButton';
import util from '@/common/util';

export default{
  name: 'ScheduleSetting',
  components: {RegionMultiSelect,TableOnly,TblPaginationOnly,DelayButton},
  data(){
    return {
      positionIds: [],
      positionsList: [],
      inputSearchValue:'',
      columnData:[
        {
            'prop': 'userName',
            'label': this.$t('mysterio.userName'),
            'sortable': false,
            'width': 200,
            'maxWidth': 200,
            'isExpand': false
          },
          {
            'prop': 'email',
            'label': this.$t('mysterio.email'),
            'sortable': true,
            'width': 300,
            'maxWidth': 300,
            'isExpand': false
          },
          {
            'prop': 'position',
            'label': this.$t('mysterio.position'),
            'sortable': false,
            'width': 100,
            'maxWidth': 100,
            'isExpand': false
          },
          {
            'prop': 'updateUserName',
            'label': this.$t('schedule.lastUpdatePerson'),
            'sortable': false,
            'width': 50,
            'maxWidth': 50,
            'isExpand': false
          },
          {
            'prop': 'updateTsStr',
            'label': this.$t('mysterio.lastUpdateTime'),
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
                icon: 'icon-setting',
                methods: 'set'
            }
        ]
      },
      isLoadingData:true,
      total:0,
      curPage:1,
      curSizeNum:10,
      defaultSort:{prop: 'updateTsStr', order: 'descending'},
    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.positionIds= [],
        self.positionsList= [],
        self.inputSearchValue='',
        self.init();
      }
    },

  },
  created() {
    this.init();
  },
  methods: {
    init(){
      this.getPosition();
      this.getScheduleList();
    },
    getPosition() {
        getDepartmentList({ type: 1 }).then(res =>{
            console.log("getDepartmentList res:",res)
            if(res.errCode == 0){
                this.getUserPositionList(res.data);
            }else{
                console.log('get position error:',res.errMsg)
            }
        }); //取得職務
    },
    getUserPositionList(data) {
      this.positionsList = [];
      const userIdList = [];
      data.map(department => {
        const departmentJson = {};
        departmentJson.label = department.defineName;
        departmentJson.value = department.defineId;
        departmentJson.contents = department.contents;
        userIdList.push(department.contents);
        this.positionsList.push(departmentJson);
      });
      this.positionIds = this.positionsList.map(depart => depart.value);
      //this.getScheduleList();
    },
    handlePositionsChange(positionIds) {
      this.positionIds = positionIds;
    },
    doSearchScheduleList(){
        this.getScheduleList()
    },
    getScheduleList(){
        const self = this;
        self.isLoadingData = true;
        const params={
          positionId:this.positionIds,
          filter:{
            page:this.curPage-1,
            size:this.curSizeNum
          },
          order:{
            direction:this.defaultSort.order=='ascending'? 'asc':'desc',
            property:this.defaultSort.prop=="updateTsStr"?"updateTime":this.defaultSort.prop,
          }
        }
        if(self.inputSearchValue.trim()!=""){
          params["keyword"] = self.inputSearchValue;
        }
        scheduleRESTful.getSchedulePersonList(params).then(res=>{
          var userData = [];
          
          if(res.errCode == 0){
            res.data.content.map(item =>{
              //const mapUser = self.doMapUser(item.userId);
              //console.log("mapUser:",mapUser);
              let obj = {...item};
              var position = this.positionsList.find(pos=>{return pos.value == item.title})
              obj['id']=item.userId;
              obj['position'] = (position)? position.label:"";
              //obj['updateTs']=item.updateTime,
              obj['updateTsStr']=(item.updateTime==0)?'-':util.getDateStr(item.updateTime),
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
    handleOperation({ method, row }) {
        console.log('List row =====>> ', row);
        switch(method){
            case 'copy':{
            break;
            }
            case 'set':{
              this.goSettingPage(row);
            break;      
            }
            case 'delete':{
            break;      
            }
            default: {
            break;
            }
        }
    },
    goSettingPage(row){
      sessionStorage.setItem('PersonalSchedule', JSON.stringify(row));//存在sessionStorage，下一頁refresh時才會留著
      this.$router.push({name: 'PersonalSchedule',params: {userId:row.userId, nickName:row.userName}});
    },
    handleSortChange(order, defaultSort) {
      this.defaultSort = { ...defaultSort };
      this.getScheduleList();
    },
    currentChange(val) {
        const self = this;
        self.curPage = val.page;
        self.getScheduleList();
    },
    sizeChange(val) {
        const self = this;
        self.curSizeNum = val.size;
        self.curPage = 1;
        self.getScheduleList();
    },
  }
}
</script>

<style lang="scss" scoped>
.ScheduleContainer{
    width:100%;

    .search-bar{
        display:flex;
        flex-direction:row;
        margin: 0px 0 20px 0px;
        height:calc(36/1920*100vw);
        align-items: center;
        font-size:calc(16/1920*100vw);
        .position-area{
            display: flex;
            flex-direction: row;
            align-items: center;
            .position{
                display:inline;
                width: calc(217/1440*100vw);
                margin-left: 16px;
                /deep/
                .el-input--medium .el-input__inner{
                    border:none;
                    line-height: calc(36/1920*100vw);
                    height: calc(36/1920*100vw);
                    background: transparent;
                }
            }
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
            .el-select.el-select--medium .el-input.is-disabled .el-input__inner{
                background:#f5f7fa  !important;
            }
            /deep/
            .el-input--medium .el-input__icon {
                line-height: calc(36/1920*100vw);
            }
        }
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
}
</style>
