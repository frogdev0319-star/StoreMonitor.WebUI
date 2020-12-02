<template>
  <div class="title-container">
    <div class="btn-col">
      <div class="title-btns">
        <el-button
          class="el-add-btn"
          size="mini"
          type="primary"
          @click="addNewTitle"
        >
          <div class="btn-area">
            <i style="margin-right:8px;" class="iconfont el-icon-plus"/>
            <span>{{ $t('titleView.addTitle') }}</span>
          </div>
        </el-button>
        <el-button
          class="el-delete-btn"
          size="mini"
          type="primary"
          @click="showDeleteDialogMethod(0)"
        >
          <div class="btn-area">
            <i style="margin-right:8px;" class="iconfont icon-shanchu"/>
            <span>{{ $t('titleView.deleteTitle') }}</span>
          </div>
        </el-button>
      </div>
    </div>
    <div class="title-table">
      <el-table
        ref="titleTable"
        :data="tableData"
        :highlight-current-row="true"
        :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
        :cell-style="cellStyle"
        align="left"
        stripe
        style="width:100%;"
      >
        <el-table-column
          type="selection"
          align="center"
          min-width="80"
        />
        <el-table-column
          :label="$t('titleView.titleName')"
          prop="title"
          min-width="90"
          align="left"/>
        <el-table-column
          :label="$t('titleView.titleCate')"
          :formatter="formatRoleId"
          prop="roleId"
          min-width="90"
          align="left"
        />
        <el-table-column
          :label="$t('titleView.description')"
          :formatter="formatComment"
          prop="comment"
          min-width="90"
          align="left"
        />
        <el-table-column
          :label="$t('titleView.operation')"
          prop="option"
          align="left">
          <template slot-scope="scope">
            <i class="iconfont icon-gengduo" style="cursor: pointer; margin-right: 20px;vertical-align: middle" @click="updateTitle(scope.row)"/>
            <i class="iconfont icon-shanchu" style="cursor: pointer;vertical-align: middle" @click="showDeleteDialogMethod(scope.row)"/>
          </template>
        </el-table-column>
        <div slot="empty">
          <div>
            <i class="iconfont icon-zhengque empty-data-icon"/>
            <span :style="{'margin-left':'20px','font-size':'16px','color':'#=7d8cad'}">{{ noData }}</span>
          </div>
        </div>
      </el-table>
      <el-dialog
        v-if="showDeleteDialog"
        :title="$t('titleView.confirmInfo')"
        :visible.sync="showDeleteDialog"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="28%"
        top="35vh"
        left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #dfe2e9;">
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block;  vertical-align: middle"/>
            <span style="display: inline-block;  vertical-align: middle">{{ deleteInfo }}</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteDialog = false">
            {{ $t('titleView.cancel') }}
          </el-button>
          <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteTitle()">
            {{ $t('titleView.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { titleRESTful } from '@/api/index';
import { mapGetters } from 'vuex';

export default {
  name: 'TitleManage',
  data() {
    return {
      varyWindowWidth: window.innerHeight,
      tableData: [],
      total: 0,
      sizeNum: 10,
      page: 1,
      showDeleteDialog: false,
      deleteIds: [],
      deleteInfo: this.$t('titleView.confirmDeleteTitle'),
      titleList: [],
      noData: ''
    };
  },

  computed: {
    tableHieght() {
      if (this.varyWindowWidth > 800) {
        return this.varyWindowWidth * 0.72;
      } else if (this.varyWindowWidth > 700) {
        return this.varyWindowWidth * 0.67;
      } else {
        return this.varyWindowWidth * 0.63;
      }
    },
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      console.log(val);
      const self = this;
      if (val !== 0) {
        self.getTitleList();
      }
    }
  },

  mounted() {
    const self = this;
    self.getTitleList();
  },

  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      console.log(row);
      console.log(columnIndex);
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },

    addNewTitle() {
      const self = this;
      self.$router.push({ name: 'titleSetting', params: { isAdd: true }});
      sessionStorage.setItem('titleList', JSON.stringify(self.titleList));
    },

    updateTitle(row) {
      const self = this;
      self.$router.push({ name: 'titleSetting', params: { isAdd: false }});
      sessionStorage.setItem('titleInfo', JSON.stringify(row));
      sessionStorage.setItem('titleList', JSON.stringify(self.titleList));
    },

    showDeleteDialogMethod(val) {
      const self = this;
      self.deleteIds = [];
      if (val !== 0) {
        self.deleteIds.push(val.id);
      } else {
        const arr = [];
        const selectRows = self.$refs.titleTable.selection;
        selectRows.forEach(item => {
          arr.push(item.id);
        });
        self.deleteIds = arr;
      }
      if (self.deleteIds.length === 0) {
        self.notify(self.$t('titleView.emptyDeleteInfo'), 'warning', 3000);
        return false;
      } else {
        if (self.deleteIds.length === 1) {
          self.deleteInfo = self.$t('titleView.confirmDeleteTitle');
        } else {
          self.deleteInfo = self.$t('titleView.confirmDeleteTitles');
        }
        self.showDeleteDialog = true;
      }
    },

    deleteTitle() {
      const self = this;
      self.deleteUserTitle().then(res => {
        console.log(res);
        if (res.errCode === 0) {
          self.notify(self.$t('titleView.deleteSuss'), 'success', 3000);
        } else {
          self.notify(res.errMsg, 'warning', 3000);
        }
        self.getTitleList();
        self.showDeleteDialog = false;
      })
      .catch(error => {
        console.log(error)
      });
    },

    deleteUserTitle() {
      const self = this;
      const params = {};
      params.titleIds = self.deleteIds;
      console.log(params);
      return new Promise((resolve, reject) => {
        titleRESTful.deleteTitle(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err)
        });
      });
    },

    getTitleList() {
      const self = this;
      self.tableData = [];
      self.getUserTitleList().then((res) => {
        console.log(res);
        res.data.forEach(item => {
          const roleId = item.roleId;
        });
        self.tableData = res.data;
        if (self.tableData.length === 0) {
          self.noData = self.$t('deviceView.noData');
        }
        const listArray = [];
        self.tableData.forEach(item => {
          listArray.push(item.title);
        });
        self.titleList = listArray;
        console.log(self.titleList);
      })
        .catch(err => {
          console.log(err);
        });
    },

    getUserTitleList() {
      return new Promise((resolve, reject) => {
        titleRESTful.getUserTitleList().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err)
        });
      });
    },

    formatRoleId(row, column, cellValue) {
      const self = this;
      const roleId = row.roleId;
      switch (roleId) {
        case 1: {
          return self.$t('titleView.roleId1Title');
          break;
        }
        case 2: {
          return self.$t('titleView.roleId2Title');
          break;
        }
        case 3: {
          return self.$t('titleView.roleId3Title');
          break;
        }
        case 4: {
          return self.$t('titleView.roleId4Title');
          break;
        }
        default: {
          return '';
          break;
        }
      }
    },

    formatComment(row, column, cellValue) {
      return row.comment.length > 0 ? row.comment : '--';
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }

  }
};
</script>

<style scoped lang="scss">
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;

  .title-container{
    border: 1px solid $border;
    background-color: #fff;
    min-height: calc(100vh - 80px - 46px - calc(60/1920*100vw));
  }
  .btn-col{
    border-bottom:  1px solid $border;
    overflow: hidden;
    height: 70px;
    line-height: 70px;
  }
  .title-btns{
    float: right;
    margin-right: calc(15/1920*100vw);
    width: auto;
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-add-btn{
      color: #fff;
      position: relative;
      margin-right: calc(15/1920*100vw);
      height: calc(36/1920*100vw);
      width: calc(130/1920*100vw);
      padding: 0;
      .iconfont{
        font-size: calc(16/1920*100vw);
      }
      span{
        font-size: calc(14/1920*100vw);
      }
      &:disabled{
        opacity: 0.5;
      }
    }
    .el-delete-btn {
      color: #fff;
      position: relative;
      margin-right: calc(20/1920*100vw);
      font-size: calc(14/1920*100vw);
      height: calc(36/1920*100vw);
      width: calc(130/1920*100vw);
      padding: 0;
      .iconfont{
        font-size: calc(16/1920*100vw);
      }
      span{
        font-size: calc(14/1920*100vw);
      }
      &:disabled {
        opacity: 0.5;
      }
    }
  }
  .title-table{
    min-height: calc(100% - 75px);
    margin: 20px calc(20/1920*100vw);
    .iconfont{
      font-size: calc(24/1920*100vw);
      color: $tab;
    }
  }
</style>
<style>
  @import '../../../assets/css/pagination.css';
/*  .el-table::before{
    height: 0px !important;
  }*/
  .current-row > td {
    background: #FEE7E4 !important;
  }
  .title-table .el-table .cell{
    padding-left: calc(20/1920*100vw);
    padding-right: calc(20/1920*100vw);
    font-size: calc(14/1920*100vw);
  }
  .title-table .el-table .cell:first-child{
    padding-right: calc(10/1920*100vw);
  }
/*
  .title-table .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
    padding-left: calc(10/1920*100vw);
  }
  .el-table--border, .el-table--group{
    border: none !important;
  }*/
  /*.el-table__header-wrapper th:nth-last-of-type(2){*/
    /*border-right: none !important;*/
  /*}*/
  .el-table--border::after, .el-table--group::after{
    width: 0 !important;
  }
 .el-table th .el-checkbox__input{
    display: none;
  }

</style>
