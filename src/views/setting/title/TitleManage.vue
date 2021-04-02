<template>
  <div class="page-container">
    <div class="header-title"/>
    <div class="title-table">
      <table-pagination
        :column-data="columnData"
        :table-data="tableData"
        :table-operation ="columnOperationData"
        :show-pagination="false"
        :if-set-cell-style="true"
        :header-class="headerStyle"
        :show-border="false"
        :is-loading-data="isLoadingData"
        :show-selection-column="true"
        cell-class=""
        row-class=""
        @handleOperation="handleEmitOperation"/>
    </div>
    <dialog-pop
      :title="$t('titleView.confirmInfo')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showDeleteDialog"
      @visibleChangeHandler="updateDialogFlag"
      @cancelHandler="hideDeleteDialog"
      @confirmHandler="deleteTitle"
    >
      <div class="dialog-slot">
        <i class="el-icon-warning dialog-icon"/>
        <div class="dialog-content">{{ deleteInfo }}</div>
      </div>
    </dialog-pop>
  </div>
</template>

<script>
import { titleRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import util from '@/common/util';
import DialogPop from '@/components/DialogPop';
import TablePagination from '@/components/TablePagination';

export default {
  name: 'TitleManage',
  components: { TablePagination, DialogPop },
  data() {
    return {
      tableData: [],
      showDeleteDialog: false,
      deleteIds: [],
      deleteInfo: this.$t('titleView.confirmDeleteTitle'),
      noData: this.$t('deviceView.noData'),
      isLoadingData: true,
      columnData: [
        {
          'prop': 'title',
          'label': this.$t('titleView.titleName'),
          'width': 90,
          'maxWidth': 130
        },
        {
          'prop': 'roleId',
          'label': this.$t('titleView.createTime'),
          'width': 130,
          'maxWidth': 130,
          formatter: (cellValue) => {
            return cellValue.length > 0 ? cellValue : '--';
          }
        },
        {
          'prop': 'comment',
          'label': this.$t('titleView.description'),
          'width': 130,
          'maxWidth': 130,
          formatter: (cellValue) => {
            return cellValue.length > 0 ? cellValue : '--';
          }
        }
      ],
      columnOperationData: {
        label: this.$t('titleView.operation'),
        minWidth: '120',
        align: 'left',
        operation: [
          {
            lable: '',
            icon: 'icon-gengduo',
            methods: 'set'
          },
          {
            lable: '',
            icon: 'icon-shanchu',
            methods: 'delete'
          }
        ]
      },
      headerStyle: 'table-header'
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      val !== 0 && this.getTitleList();
    }
  },

  created() {
    this.getTitleList();
  },

  methods: {
    getTitleList() {
      this.tableData = [];
      titleRESTful.getUserTitleList().then(res => {
        this.isLoadingData = false;
        this.tableData = res.data;
      })
        .catch(err => {
          this.isLoadingData = false;
          console.log('TitleManagement-getTitleList: ' + err);
        });
    },

    updateDialogFlag(val) {
      this.showDeleteDialog = val;
    },

    hideDeleteDialog() {
      this.showDeleteDialog = false;
    },

    deleteTitle() {
      this.deleteUserTitle().then(res => {
        if (res.errCode === 0) {
          util.notify(this.$t('titleView.deleteSuss'), 'success', 3000);
        } else {
          util.notify(res.errMsg, 'warning', 3000);
        }
        this.getTitleList();
        this.showDeleteDialog = false;
      }).catch(error => {
        console.log('TitleManagement-deleteTitle: ' + error);
      });
    },

    deleteUserTitle() {
      const params = {};
      params.titleIds = this.deleteIds;
      return new Promise((resolve, reject) => {
        titleRESTful.deleteTitle(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    handleEmitOperation(methodsAndRowObj) {
      const method = methodsAndRowObj.method;
      switch (method) {
        case 'set': {
          this.updateTitle(methodsAndRowObj.row);
          break;
        }
        case 'delete': {
          this.showDeleteDialogMethod(methodsAndRowObj.row);
          break;
        }
        default: {
          break;
        }
      }
    },

    updateTitle(row) {
      this.$router.push({ name: 'titleSetting' });
      sessionStorage.setItem('titleInfo', JSON.stringify(row));
    },

    showDeleteDialogMethod(row) {
      this.deleteIds = [];
      this.deleteIds.push(row.id);
      this.deleteInfo = this.$t('titleView.confirmDeleteTitle');
      this.showDeleteDialog = true;
    }

  }
};
</script>

<style scoped lang="scss">
  .page-container{
    min-height: calc(100vh - 80px - 46px - calc(60/1920*100vw));
  }
  .title-table{
    min-height: calc(100% - 75px);
    margin: 20px calc(20/1920*100vw);
  }
</style>
<style>
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
  .el-table--border::after, .el-table--group::after{
    width: 0 !important;
  }
 .el-table th .el-checkbox__input{
    display: none;
  }

</style>
