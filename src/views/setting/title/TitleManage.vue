<template>
  <div style="height: 100%">
      <div>
        <table-only
          ref="elTP"
          class="table-white"
          :table-themes="white"
          :column-data="columnData"
          :table-data="tableData"
          :table-operation ="columnOperationData"
          :highlight-current-row= "false"
          :is-loading-data="isLoadingData"
          :allowRowExpand = "false"
          :showBorder = "false"
          :default-sort = "{prop: 'createTime', order: 'descending'}"
          :headerStyle="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
          :tableHeight = "760"
          :cellStyle="{backgroundColor: '#fff !important'}"
          @handleOperation="handleEmitOperation"
        />
      </div>
      <div style="width:100%; margin-top:12px;height:31px;">
        <tbl-pagination-only
          :btn-style="{backgroundColor:'transparent'}"
          :total="total"
          :current-page="page"
          :page-size="sizeNum"
          layout = "prev,pager, next,sizes,slot"
          @sizeChange="handlePageAndSizeChange"
          @currentChange="handlePageAndSizeChange"
        />
      </div>
  </div>
</template>

<script>
import { titleRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import TablePagination from '@/components/TablePagination';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';

export default {
  name: 'TitleManage',
  components: { TablePagination,TableOnly,TblPaginationOnly },
  data() {
    return {
      allTableData:[],
      tableData: [],
      noData: this.$t('deviceView.noData'),
      isLoadingData: true,
      columnData: [
        {
          'prop': 'title',
          'label': this.$t('titleView.titleName'),
          'width': 90,
          'maxWidth': 130,
          'isExpand': false
        },
        {
          'prop': 'createTime',
          'label': this.$t('titleView.createTime'),
          'sortable': true,
          'width': 130,
          'maxWidth': 130,
          'isExpand': false
        },
        {
          'prop': 'comment',
          'label': this.$t('titleView.description'),
          'width': 130,
          'maxWidth': 130,
          'isExpand': false,
          formatter: (cellValue) => {
            return cellValue.comment || '--';
          }
        },
      ],
      columnOperationData: {
        label: this.$t('titleView.operation'),
        minWidth: '30',
        align: 'left',
        customIcon: true,
        src : require('@/../static/img/icon_pen.png'),
        methods: 'set'
        /*operation: [
          {
            lable: '',
            src : 'penSrc',
            methods: 'set'
          }
        ]*/
      },
      headerStyle: 'table-header',
      total:0,
      page:1,
      sizeNum:10,
      white:'',
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
      this.allTableData = [];
      titleRESTful.getUserTitleList().then(res => {
        this.isLoadingData = false;
        res.data.map(item => {
          item.createTime = util.getDateStr1(item.createTime);
        });
        this.allTableData = res.data;
        this.total = Math.ceil(this.allTableData.length/this.sizeNum);
        this.setPagingTableData();

        console.log('this.allTableData :>> ', this.allTableData);
        console.log('this.total :>> ', this.total);
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
    handlePageAndSizeChange(pageObj) {
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      //self.params.filter = { page: self.page - 1, size: self.sizeNum };
      self.setPagingTableData();
    },
    setPagingTableData(){
      this.tableData = [];
      this.tableData = [...this.allTableData.slice( (self.page - 1)* this.sizeNum, this.page* this.sizeNum)];
      console.log('this.tableData :>> ', this.tableData);
    },
    updateTitle(row) {
      this.$router.push({ name: 'titleSetting' });
      sessionStorage.setItem('titleInfo', JSON.stringify(row));
    }

  }
};
</script>

<style scoped lang="scss">
  .title-table{
    min-height: calc(100% - 75px);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    background-color: #fff;
    padding: 0 24px;
    border-radius: 5px;
  }
</style>
