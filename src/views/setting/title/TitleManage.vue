<template>
  <div class="title-container" :style="{'height':varyWindowWidth-155+'px'}">
      <div class="btn-col">
        <div class="title-btns">
          <el-button
            class="el-add-btn"
            size="mini"
            type="primary"
            @click="addNewTitle"
          >
            <i style="margin-right:8px;" class="iconfont el-icon-plus"></i>
            <span>{{$t('titleView.addTitle')}}</span>
          </el-button>
          <el-button
            class="el-delete-btn"
            size="mini"
            @click="showDeleteDialogMethod(0)"
          >
            <i style="margin-right:8px;" class="iconfont el-icon-delete"></i>
            <span>{{$t('titleView.deleteTitle')}}</span>
          </el-button>
        </div>
      </div>
      <div class="title-table">
          <el-table
            :data="tableData"
            :highlight-current-row="true"
            align='left'
            stripe
            border
            style="width:100%; text-algin:center;height:300px;border: 1px solid #ebebeb;"
            :height="tableHieght"
            ref="titleTable"
          >
            <el-table-column
              type="selection"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="title"
              :label="$t('titleView.titleName')"
              min-width="90"
              align="left">
            </el-table-column>
            <el-table-column
              prop="roleId"
              :label="$t('titleView.titleCate')"
              min-width="90"
              align="left"
              :formatter="formatRoleId"
            >
            </el-table-column>
            <el-table-column
              prop="comment"
              :label="$t('titleView.description')"
              min-width="90"
              align="left"
              :formatter="formatComment"
            >
            </el-table-column>
            <el-table-column
              prop="option"
              :label="$t('titleView.operation')"
              width="100"
              align="left">
              <template slot-scope="scope">
                <i class="iconfont icon-gengduo" style="font-size:20px;cursor: pointer; margin-right: 20px" @click="updateTitle(scope.row)"></i>
                <i class="iconfont icon-shanchu" style="font-size:20px;cursor: pointer;" @click="showDeleteDialogMethod(scope.row)"></i>
              </template>
            </el-table-column>
            <div slot="empty">
              <div>
                <i class="iconfont icon-zhengque empty-data-icon"></i>
                <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262','font-family':'Microsoft YaHei'}">{{$t('deviceView.noData')}}</span>
              </div>
            </div>
          </el-table>
          <el-dialog  :title="$t('titleView.confirmInfo')"
                      :visible.sync="showDeleteDialog" v-if="showDeleteDialog"
                      :append-to-body='true'
                      :close-on-click-modal="false"
                      width="28%"
                      top="35vh"
                      left="40vh">
            <div class="dialog-content" style="overflow:hidden;width:100%;">
              <hr style="border: 0.5px solid #FB4C5D;"/>
              <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803"></i>
                <span>{{deleteInfo}}</span>
              </p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class="file-cancel-btn" @click="showDeleteDialog = false" size="mini" style="">取消</el-button>
              <el-button class="file-confirm-btn" @click="deleteTitle()" size="mini" type="primary">确认</el-button>
            </div>
          </el-dialog>
          <!--<div class="toolbar pagination" style="width:100%; margin:10px 15px;height:12%;">-->
            <!--<el-pagination background small-->
                           <!--:page-sizes="[10, 20, 50, 100]"-->
                           <!--@size-change="sizeChange"-->
                           <!--@current-change="currentChange"-->
                           <!--layout="jumper,total, prev, pager, next,sizes"-->
                           <!--:page-size="sizeNum" :total="total"-->
                           <!--:current-page="page"-->
                           <!--style="float:right;margin-top:15px;">-->
            <!--</el-pagination>-->
          <!--</div>-->
        </div>
  </div>
</template>

<script>
  import {titleRESTful} from '@/api/index'
  import {mapGetters} from 'vuex'

  export default {
        name: "titleManage",
      data(){
          return{
            varyWindowWidth: window.innerHeight,
            tableData: [],
            total:0,
            sizeNum:10,
            page:1,
            showDeleteDialog: false,
            deleteIds : [],
            deleteInfo: this.$t('titleView.confirmDeleteTitle')
          }
      },
      computed:{
        tableHieght(){
          if(this.varyWindowWidth>800){
            return this.varyWindowWidth*0.72;
          }
          else if(this.varyWindowWidth>700){
            return this.varyWindowWidth*0.67;
          }
          else{
            return this.varyWindowWidth*0.63;
          }
        },
        ...mapGetters({accountChanged:'accountChanged'})
      },
      watch:{
        accountChanged(val,oldVal){
          console.log(val);
          let self=this;
          if(val!=0){
            self.getTitleList();
          }
        },
      },
      methods:{
        addNewTitle(){
          let self = this;
          self.$router.push({name:'titleSetting', params: { isAdd: true }});
        },
        updateTitle(row){
          let self = this;
          console.log(row);
          self.$router.push({name:'titleSetting', params: { isAdd: false }});
          sessionStorage.setItem('titleInfo', JSON.stringify(row))
        },
        showDeleteDialogMethod(val){
          let self = this;
          console.log(val)
          self.deleteIds = [];
          if(val != 0){
            self.deleteIds.push(val.id);
          }
          else{
            let arr = [];
            let selectRows = self.$refs.titleTable.selection;
            console.log(selectRows);
            selectRows.forEach(item=>{
              arr.push(item.id);
            })
            console.log(arr);
            self.deleteIds = arr;
          }
          if(self.deleteIds.length == 0){
            self.notify(self.$t('titleView.emptyDeleteInfo'),'warning',3000)
            return false;
          }
          else{
            if(self.deleteIds.length == 1){
              self.deleteInfo = self.$t('titleView.confirmDeleteTitle')
            }
            else{
              self.deleteInfo = self.$t('titleView.confirmDeleteTitles')
            }
            self.showDeleteDialog = true;
          }
        },
        deleteTitle(){
          let self = this;
          self.deleteUserTitle().then(res=>{
            console.log(res);
            if(res.errCode == 0){
              self.notify(self.$t('titleView.deleteSuss'),'success',3000);
            }
            else{
              self.notify(res.errorMsg,'warning',3000);
            }
            self.getTitleList();
            self.showDeleteDialog = false;
          })
            .catch(error=>{

            })
        },
        deleteUserTitle(){
          let self = this;
          let params = {};
          params.titleIds = self.deleteIds;
          console.log(params);
          return new Promise((resolve,reject)=>{
            titleRESTful.deleteTitle(params).then(res=>{
              resolve(res)
            })
          })
        },
        getTitleList(){
          let self = this;
          self.tableData = [];
          self.getUserTitleList().then((res)=>{
            console.log(res);
            res.data.forEach(item=>{
              let roleId = item.roleId;

            })
            self.tableData = res.data
          })
            .catch(err=>{
              console.log(err)
            })
        },
        getUserTitleList(){
          return new Promise((resolve, reject) => {
            titleRESTful.getUserTitleList().then(res=>{
              resolve(res)
            })
          })
        },
        formatRoleId(row, column, cellValue) {
          let self = this;
          let roleId = row.roleId;
          switch (roleId) {
            case 1: {
              return  self.$t('titleView.roleId1Title');
              break
            }
            case 2: {
              return  self.$t('titleView.roleId2Title');
              break
            }
            case 3: {
              return self.$t('titleView.roleId3Title');
              break
            }
            case 4: {
              return self.$t('titleView.roleId4Title');
              break
            }
            default: {
              return ''
              break;
            }
          }
        },
        formatComment(row, column, cellValue){
          return row.comment.length>0 ? row.comment: '--'
        },
        notify(msg,type,time) {
          this.$message({
            message: msg,
            type: type,
            duration:time
          });
        },
      },
      mounted(){
          let self = this;
          self.getTitleList()
      }
    }
</script>

<style scoped lang="scss">
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;

  @function rem($val){
    @return $val/16+rem;
  }
  @function checkRem($val){
    @if($val==auto){@return auto;}
    @else if($val==0){@return 0;}
    @else{@return rem($val);}
  }
  @mixin point($poi,$val){
    #{$poi}:checkRem($val);
  }

  .btn-col{
    border-bottom:  1px solid $border;
    overflow: hidden;
    @include point(height,50);
    @include point(line-height,50);
  }
  .title-btns{
    float: right;
    @include point(margin-right,10);
    width: auto;
    .el-add-btn{
      background-color: $mainColor;
      color: #fff;
      border-color: $mainColor;
      position: relative;
      @include point(margin-right,10);
      font-size: 12px;
      vertical-align: middle;
      &:disabled{
        opacity: 0.6;
      }
      @media screen and (min-width: 1680px){
        @include point(width, 98);
      }
      @media screen and (max-width: 1680px){
        width: 120px;
      }
    }
    .el-delete-btn {
      background-color: $mainColor;
      color: #fff;
      border-color: $mainColor;
      position: relative;
      @include point(margin-right, 15);
      font-size: 12px;
      vertical-align: middle;
      &:disabled {
        opacity: 0.6;
      }
      @media screen and (min-width: 1680px){
        @include point(width, 98);
      }
      @media screen and (max-width: 1680px){
        width: 120px;
      }
    }
  }
  .title-table{
    @include point(margin, 15);
  }
</style>
<style>
  @import '../../../assets/css/pagination.css';
  .el-table::before{
    height: 0px !important;
  }
  .current-row > td {
    background: #FEE7E4 !important;
  }
  .el-table tbody tr:hover>td {
    background-color: #FDE8EF !important;
  }
  .el-table--border th{
    border-right: 0 !important;
  }
  .el-table--border, .el-table--group{
    border: none !important;
  }
  /*.el-table__header-wrapper th:nth-last-of-type(2){*/
    /*border-right: none !important;*/
  /*}*/
  .el-table--border::after, .el-table--group::after{
    width: 0 !important;
  }
  .el-table th .el-checkbox__input{
    display: none;
  }
  .title-table .el-table__body{
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5 !important;
  }
  .el-table__row .el-table-column--selection{
    border-right: none !important;
  }
  .el-dialog__body {
    padding: 0
  }
</style>
