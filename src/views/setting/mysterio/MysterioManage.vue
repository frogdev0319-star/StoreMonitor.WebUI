<template>
    <div style="height: 100%">
        <div>
            <div class="mysterio-header">
                <div class="flex-center">
                    <el-input
                        v-model="inputSearchValue"
                        size="small"
                        prefix-icon="el-icon-search"
                        class="search-input shadow-light"
                        :placeholder="$t('mysterio.searchPlaceholder')"
                        clearable/>
                </div>
                <!-- 新增神秘客 -->
                <delay-button @click="addNewMysterioPerson">
                    <div class="button-area">
                        <i class="iconfont el-icon-plus"/>
                        <span>{{$t('mysterio.addMysterio')}}</span>
                    </div>
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
        </div>
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
        <dialog-pop
            :is-form="true"
            :title="$t('mysterio.addPersonTitle')"
            :append-to-body="true"
            :close-on-click-modal="false"
            :isWarning="false"
            :visible="showAddPersionDialog"
            :confirm-context="$t('deviceView.confirm')"
            :show-close="false"
            dialog-width="900px"
            @cancelHandler="showAddPersionDialog = false"
            @confirmHandler="confirmAddPersonDialog">
            <div style="width:860px;height:516px;margin-left:20px;">
              <table-only
                ref="myteryUserList"
                class="table-white table-person"
                table-themes="white"
                :column-data="userColumnData"
                :table-data="userTableData"
                :highlight-current-row= "false"
                :is-loading-data="isLoadingData"
                :allowRowExpand = "false"
                :showBorder = "false"
                :show-selection-column="true"
                :default-sort = "defaultSort_popup"
                :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                :tableHeight = "516"
                :cellStyle="{backgroundColor: '#fff !important'}"
                @sortChange="handleSortChange_dialogUser"    
                @selection-change="selectionChanged">
              </table-only>
            </div>
        </dialog-pop>
        <dialog-pop
            :title="$t('mysterio.comfirmDelMysterio')"
            :isWarning="true"
            :visible="showShowConfirmDialog"
            @cancelHandler = "onCancelDelete"
            @confirmHandler="onConfirmDelete">
        </dialog-pop>
    </div>
</template>
<script>
import { mysteroRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import { getDepartmentList } from '@/api/checkin';
import { getUserInfo } from '@/api/login';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
    name: 'MysterioManage',
    components: {TableOnly,TblPaginationOnly,DelayButton,DialogPop },
    data() {
      return {
        inputSearchValue: '',
        allTableData:[],
        tableData: [],
        noData: this.$t('deviceView.noData'),
        isLoadingData: true,
        columnData: [
          {
            'prop': 'userName',
            'label': this.$t('mysterio.userName'),
            'sortable': true,
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
            'prop': 'storeAuth',
            'label': this.$t('mysterio.storeAuth'),
            'sortable': true,
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
        columnOperationData: {
          label: this.$t('titleView.operation'),
          minWidth: '50',
          align: 'left',
          operation: [
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
        userColumnData:[{
            'prop': 'userName',
            'label': this.$t('mysterio.userName'),
            'sortable': true,
            'width': 200,
            'maxWidth': 200,
            'isExpand': false
          },
          {
            'prop': 'email',
            'label': this.$t('mysterio.email'),
            'sortable': true,
            'width': 360,
            'maxWidth': 360,
            'isExpand': false
          },
          {
            'prop': 'position',
            'label': this.$t('mysterio.position'),
            'sortable': false,
            'width': 100,
            'maxWidth': 100,
            'isExpand': false
          }],
        userTableData:[],
        headerStyle: 'table-header',
        total:0,
        curPage:1,
        curSizeNum:10,
        defaultSort:{prop: 'userName', order: 'ascending'},
        showAddPersionDialog:false,
        positionsList:[],
        userList:[],
        selectedUserList:[],
        selUserIds:[],
        allUserList:[],
        showShowConfirmDialog:false,
        delUserId:null,
        defaultSort_popup:{prop: 'userName', order: 'ascending'}
      };
    },

    computed: {
      ...mapGetters({ accountChanged: 'accountChanged' })
    },

    watch: {
      accountChanged(val) {
        val !== 0 && this.init();
      },
      // for search
      inputSearchValue(val){
        self.curPage = 1;
        if(val.trim()==""){
          this.getMysterioList();
        }else{
          this.searchData = this.allTableData.filter(item => (
              item.userName.indexOf(val) > -1 || item.email.indexOf(val) > -1
          ));
          //this.tableData = this.searchData;
          this.setTableBySearch();
        }
        
      }
    },

    created() {
      //this.init();
    },
    mounted(){
      //this.getMysterioList();
      this.init();
    },
    methods: {
        async init(){
          this.inputSearchValue="";
          await this.getUserInfolist();
          this.getMysterioList(true);
          this.getMysterioList();
        },
        async getUserInfolist() {
            const userPosition = getDepartmentList({ type: 1 }); //取得職務
            const userPromise = getUserInfo();//userList
            try {
                const result = await Promise.all([userPosition, userPromise]);
                this.getUserPositionList(result[0].data);
                this.getUserList(result[1].data);
            } catch (e) {
                console.log("getUserInfolist error:",e);
            }
        },
        getUserPositionList(data) {
            this.positionsList = [];
            //const userIdList = [];
            data.map(department => {
              const departmentJson = {};
              departmentJson.label = department.defineName;
              departmentJson.value = department.defineId;
              departmentJson.contents = department.contents;
              //userIdList.push(department.contents);
              this.positionsList.push(departmentJson);
            });
        },
        getUserList(data) {
            this.allUserList = [];
            var tempUserList = [];
            data.map(user => {
              const userJson = {};
              userJson.id = user.userId;
              userJson.userName = user.userName;
              userJson.userId = user.userId;
              userJson.email = user.email;
              var position =  this.positionsList.find(pos=>{return pos.contents.includes(user.userId)});
              //console.log("position:",position);
              userJson.position = (position)?position.label:'';
              tempUserList.push(userJson);
            });
            this.allUserList = tempUserList;
        },
        doMapUser(userId){
          console.log("allUserList:",this.allUserList);
          return this.allUserList.find(user => user.userId == userId);
        },
        getMysterioList(getAll=false){
            const self = this;
            self.inputSearchValue="";
            self.isLoadingData = true;
            const params={
              filter:{
                page:this.curPage-1,
                size:(getAll)?500:this.curSizeNum
              },
              order:{
                direction:this.defaultSort.order=='ascending'? 'asc':'desc',
                property:this.defaultSort.prop,
              }
            }
            mysteroRESTful.getMysterioMemberList(params).then(res=>{
              var mysterioData = [];
              
              if(res.errCode == 0){
                res.data.content.map(item =>{
                  //const mapUser = self.doMapUser(item.userId);
                  //console.log("mapUser:",mapUser);
                  let obj = {...item};
                  var position = this.positionsList.find(pos=>{return pos.contents.includes(item.userId)})
                  obj['id']=item.userId;
                  obj['position'] = (position)? position.label:"";
                  obj['updateTs']=item.updateTime,
                  obj['updateTsStr']=util.getDateStr(item.updateTime),
                  obj['storeAuth']=item.permissionStores,
                  mysterioData.push(obj);
                });
                if(getAll) {
                  this.selectedUserList =[];
                  this.allTableData = [];
                  this.allTableData = mysterioData.slice();
                  this.selectedUserList = mysterioData.slice();
                }
                else{
                  this.tableData = [];
                  this.tableData = mysterioData;
                  self.total = res.data.totalPages;
                  self.isLoadingData = false;
                } 
                
              }else{
                util.notify(self.$t('mysterio.getMysterioMemberFail'), 'error', 3000);
              }
              
            }).catch(err=>{
              console.log("getMysterioList error",err);
              util.notify(self.$t('mysterio.getMysterioMemberFail')+',error:'+err, 'error', 3000);
              this.isLoadingData = false;
            });
            //util.getDateStr(task.processLastUpdateTs)
            //this.tableData.push({userId:"qqMQyf9LPE0k",userName:'Rainney',email:"rainney.chen@advantech.com.tw",position:"系統管理員",storeAuth:"1",updateTs:"2022/07/19 16:48"});
            //this.isLoadingData = false;
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
                  this.deleteMysterioMember(row);
                break;      
                }
                default: {
                break;
                }
            }
        },
        goSettingPage(row){
          this.$router.push({name: 'MysterioSetting',params: {userId:row.userId}});
        },
        deleteMysterioMember(row){
          this.delUserId = row.userId;
          this.showShowConfirmDialog = true;
        },
        onCancelDelete(){
          this.showShowConfirmDialog = false;
        },
        onConfirmDelete(){
          const self= this;
          mysteroRESTful.removeMysterioPerson({userId:this.delUserId}).then(res=>{
            if(res.errCode==0){
              var tempAll = self.allTableData.slice();
              let delIdx = tempAll.findIndex(user=>user.userId==this.delUserId);
              console.log("delIdx:",delIdx);
              console.log("1.self.allTableData:",self.allTableData);
              tempAll.splice(delIdx,1);
              console.log("2.tempAll:",tempAll);
              self.allTableData = tempAll.slice();
              self.selectedUserList = tempAll.slice();
              console.log("selectedUserList:",self.selectedUserList);
              //self.getMysterioList(true);
              this.getMysterioList();
            }else{
              util.notify(self.$t('mysterio.delMysterioMemberFail'), 'error', 3000);
            }
            self.showShowConfirmDialog = false;
          });
        },
        handleSortChange(order, defaultSort) {
          this.defaultSort = { ...defaultSort };
          //this.order = this.params.order = order;
          if(this.inputSearchValue.trim()=="") this.getMysterioList();
          else {
            this.setTableBySearch();
          }
        },
        currentChange(val) {
            const self = this;
            self.curPage = val.page;
            //self.params.filter = { page: val.page - 1, size: self.sizeNum };
            if(self.inputSearchValue.trim()=="") self.getMysterioList();
            else self.setTableBySearch()
        },

        sizeChange(val) {
            const self = this;
            self.curSizeNum = val.size;
            self.curPage = 1;
            if(self.inputSearchValue.trim()=="") self.getMysterioList();
            else self.setTableBySearch()
        },
        setTableBySearch() {
          this.total = Math.ceil(this.searchData.length/this.curSizeNum);
          if(this.defaultSort.prop=="updateTsStr"){
            if(this.defaultSort.order=='ascending'){
              util.sortArrayByKeyAsc(this.searchData,"updateTs")
            }else{
              util.sortArrayByKeyDesc(this.searchData,"updateTs")
            }
          }
          this.tableData = [];
          this.tableData = [...this.searchData.slice( (this.curPage - 1)* this.curSizeNum, this.curPage* this.curSizeNum)];
        },
        //Dialog content
        addNewMysterioPerson(){
            this.inputSearchValue="";
            this.getAddUserList();
            this.showAddPersionDialog=true;
        },
        getAddUserList(){
          this.userList = [];
          var tempUserList = [];
          this.userTableData = [];
          this.allUserList.map(user=>{
            var tempU = this.selectedUserList.find(temp=>temp.userId == user.userId);
            if(typeof tempU=='undefined'){
              tempUserList.push(user);
            }
          });
          tempUserList = util.sort_by_key(tempUserList,this.defaultSort_popup.prop,this.defaultSort_popup.order );
          this.userList = tempUserList;
          
          this.userTableData = tempUserList;
          console.log("userTableData:",this.userTableData);
        },
        selectionChanged(val){
            var selUserId = [];
            if(val.length>0){
                val.map((item)=>{
                    selUserId.push(item.userId);
                })
            }
            this.selUserIds = selUserId;
        },
        confirmAddPersonDialog(){
          const self = this;
            var userIdList=self.selUserIds;
            self.selUserIds.map(userId =>{
              var user = this.userList.find(u=>u.userId==userId);
              if(user){
                  var obj={
                      userId:user.userId,
                      userName:user.userName,
                      email:user.email,
                      position:user.position,
                      storeAuth:0,
                      updateTs:util.getDateStr(Date.now()*1000)
                  };
                  this.allTableData.push(obj);
                  this.selectedUserList.push(obj);
              }
                
            });
            console.log("userIdList:",userIdList);
            mysteroRESTful.addMysterioPerson({userIdList}).then(res=>{
              if(res.errCode==0){
                self.curPage = 1;
                //self.getMysterioList(true);
                self.getMysterioList();
              }else{
                util.notify(self.$t('mysterio.addMysterioMemberFail'), 'error', 3000);
              }
              this.showAddPersionDialog = false;
            });
        },
        handleSortChange_dialogUser(order,defaultSort){
          this.defaultSort_popup={...defaultSort};
          let key = this.defaultSort_popup.prop;
          var tempUserList = util.sort_by_key(this.userTableData,key,this.defaultSort_popup.order );
          console.log("tempUserList:",tempUserList);
          this.userTableData = tempUserList;
          
        }
    }
}
</script>

<style scoped lang="scss">
.title-table{
    min-height: calc(100% - 75px);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    background-color: #fff;
    padding: 0 24px;
    border-radius: 5px;
}
.mysterio-header{
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}
.table-person{
  
  /deep/ .el-table__header-wrapper .el-table-column--selection{
    padding-left: 0px !important;
    font-size: 14px !important;
  }
  /deep/.el-table__header-wrapper
  .el-table-column--selection
  .el-checkbox__inner 
  {
    border-radius: 1px;
    border: solid 1px #acaeb1;
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
/deep/
  .el-table th .cell{
  padding-left: 0px !important;
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
      
</style>