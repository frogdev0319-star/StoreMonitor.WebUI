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
  </div>
</template>

<script>
import { titleRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import TablePagination from '@/components/TablePagination';
import util from '@/common/util';

export default {
  name: 'TitleManage',
  components: { TablePagination },
  data() {
    return {
      tableData: [],
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
          'prop': 'createTime',
          'label': this.$t('titleView.createTime'),
          'width': 130,
          'maxWidth': 130
        },
        {
          'prop': 'comment',
          'label': this.$t('titleView.description'),
          'width': 130,
          'maxWidth': 130,
          formatter: (cellValue) => {
            return cellValue || '--';
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
        res.data.map(item => {
          item.createTime = util.getDateStr1(item.createTime);
        });
        this.tableData = res.data;
      })
        .catch(err => {
          this.isLoadingData = false;
          console.log('TitleManagement-getTitleList: ' + err);
        });
    },

    handleEmitOperation(methodsAndRowObj) {
      const method = methodsAndRowObj.method;
      switch (method) {
        case 'set': {
          this.updateTitle(methodsAndRowObj.row);
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
