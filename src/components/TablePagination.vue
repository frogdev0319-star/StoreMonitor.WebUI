<template>
  <div class="table">
    <el-table
      :data="tableData"
      v-bind="$attrs"
      :highlight-current-row="true"
      :default-sort = "defaultSort"
      :header-cell-class-name="headerClass"
      :cell-class-name="cellClass"
      :row-class-name="rowClass"
      :cell-style="ifSetCellStyle && setCellStyle"
      empty-text="无数据"
      align="left"
      stripe
      border
      style="width: 100%"
      size="mini"
      v-on="$listeners"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-for="(_item,_index) in columnData"
        :key="_index"
        :prop="_item.prop"
        :label="_item.label"
        :sortable="canSortable ? _item.sortable : false"
        :min-width="lang !== 'en' ? _item.width : _item.maxWidth"/>
      <el-table-column
        v-if="tableOperation.label"
        :min-width="tableOperation.minWidth"
        :label="tableOperation.label"
        align="left"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i
            v-for="(item,index) in tableOperation.operation"
            :key="index"
            :type="item.type"
            :class="item.icon"
            class="iconfont"
            size="mini"
            @click="handleOperationButton(item.methods, scope.row, scope.$index)">
            {{ item.label }}
          </i>
        </template>
      </el-table-column>
      <template v-if="isEvent">
        <el-table-column
          :label="$t('overview.remotePatrol')"
          :min-width="lang!=='en'? 120 : 150"
          prop="remotePer"
          sortable="custom">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper remote">
              <el-tag size="small" color="#f31d651a">{{ scope.row.remotePer }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('overview.onsitePatrol')"
          :min-width="lang!=='en'? 120 : 150"
          prop="onsitePer"
          sortable="custom">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper onsite">
              <el-tag size="small" color="#fb804f1a">{{ scope.row.onsitePer }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('overview.storeMonitor')"
          :min-width="lang !== 'en' ? 120 : 150"
          prop="videoPer"
          sortable="custom">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper video">
              <el-tag size="small" color="#fccc3f1a">{{ scope.row.videoPer }}</el-tag>
            </div>
          </template>
        </el-table-column>
      </template>
      <div slot="empty">
        <div>
          <i class="iconfont icon-zhengque empty-data-icon"/>
          <span :style="{'margin-left':'20px','font-size':'16px','color':'#=7d8cad'}">{{ noData }}</span>
        </div>
      </div>
    </el-table>
    <div v-if="showPagination" class="toolbar pagination clearfix">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagesize"
        :total="total"
        background
        small
        layout="jumper,total, prev,pager, next,sizes"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
      required: false
    },
    pagesize: {
      type: Number,
      default: 10,
      required: false
    },
    currentPage: {
      type: Number,
      default: 1,
      required: false
    },
    tableData: {
      type: Array,
      default: () => [],
      required: false
    },
    columnData: {
      type: Array,
      required: true
    },
    defaultSort: {
      type: Object,
      required: false,
      default: () => {}
    },
    layout: {
      type: String,
      default: 'jumper,total, prev,pager, next,sizes'
    },
    canSortable: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    isPdfColumn: {
      type: Boolean,
      default: false
    },
    isEvent: {
      type: Boolean,
      default: false
    },
    tableOperation: {
      type: Object,
      default: () => {
        return {};
      }
    },
    headerClass: {
      type: String,
      default: 'header-class'
    },
    cellClass: {
      type: String,
      default: 'cell-class'
    },
    rowClass: {
      type: String,
      default: 'row-class'
    },
    ifSetCellStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRow: {},
      lang: this.$i18n.locale,
      order: {},
      noData: this.$t('deviceView.noData')
    };
  },

  methods: {
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      console.log(row);
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },

    rowClick(row) {
      this.currentRow = row;
    },

    handleCurrentChange(currentPage) {
      const pageObj = {
        page: currentPage,
        size: this.pagesize
      };
      this.$emit('handleChange', pageObj);
    },

    handleSizeChange(pageSize) {
      const pageObj = {
        page: this.currentPage,
        size: pageSize
      };
      this.$emit('handleChange', pageObj);
    },

    handleSortChange(col) {
      console.log(col);
      const self = this;
      const order = col.order;
      if (!order) {
        self.order = self.getOrderBasedOnDefaultSort();
      } else {
        self.order.direction = order === 'ascending' ? 'asc' : 'desc';
        const property = col.column.property;
        if (property.indexOf('Str') > -1) {
          self.order.property = property.substr(0, property.indexOf('Str'));
        } else {
          self.order.property = property;
        }
      }
      console.log(self.order);
      this.$emit('sortChange', self.order);
    },

    getOrderBasedOnDefaultSort() {
      const defaultSort = this.defaultSort;
      const property = defaultSort.prop;
      if (property.indexOf('Str') > -1) {
        this.order.property = property.substr(0, property.indexOf('Str'));
      } else {
        this.order.property = property;
      }
      this.order.direction = defaultSort.order === 'ascending' ? 'asc' : 'desc';
      console.log(this.order);
    },

    handleOperationButton(methods, row, index) {
      this.$emit('handleOperation', { method: methods, row: row, index: index });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../assets/sass/stastical.scss";
  .clearfix{
    content: "";
    display: block;
    height: 0;
    clear:both;
    overflow: auto;
  }
  .toolbar{
    float: right;
    margin: 30px calc(30/1920*100vw);
    margin-right: 0;
    height:13%;
  }
  .iconfont{
    cursor: pointer;
    margin-right: 20px;
    font-size: calc(24/1920*100vw);
    color: #7d8cad;
  }
  .el-table--mini{
    font-size: 14px;
  }
</style>

<style>
  @import "../assets/css/pagination.css";
  .account-header{
    font-size: 14px;
    color: #7d8cad;
    height: 47px;
    border: none;
  }
</style>

