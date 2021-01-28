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
        :min-width="isexportPDF ? _item.pdfwidth : (lang !== 'en' ? _item.width : _item.maxWidth)"/>
      <template v-if="isEvent">
        <el-table-column
          :label="$t('overview.remotePatrol')"
          :min-width="lang !== 'en'? 120 : 160"
          :sortable="true"
          :sort-method="(a, b) => sortHandle(a, b, 'RemoteStr')"
          prop="RemoteStr">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper remote">
              <el-tag size="small" color="#fccc3f1a">{{ scope.row.RemoteStr }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('overview.onsitePatrol')"
          :min-width="lang !== 'en' ? 120 : 160"
          :sortable="true"
          :sort-method="(a, b) => sortHandle(a, b, 'OnsiteStr')"
          prop="OnsiteStr">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper onsite">
              <el-tag size="small" color="#fccc3f1a">{{ scope.row.OnsiteStr }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('overview.storeMonitor')"
          :min-width="lang !== 'en' ? 120 : 160"
          :sortable="true"
          :sort-method="(a, b) => sortHandle(a, b, 'VideoStr')"
          prop="VideoStr">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper video">
              <el-tag size="small" color="#fccc3f1a">{{ scope.row.VideoStr }}</el-tag>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="showPagination" class="toolbar pagination clearfix">
      <el-pagination
        :current-page="currentPage"
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
      required: true
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
    isexportPDF: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRow: {},
      headerClass: 'header-class',
      cellClass: 'cell-class',
      rowClass: 'row-class',
      lang: this.$i18n.locale,
      order: { direction: '', property: '' }
    };
  },

  methods: {
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
      const self = this;
      const order = col.order;
      if (!order) {
        self.getOrderBasedOnDefaultSort();
      } else {
        self.order.direction = order === 'ascending' ? 'asc' : 'desc';
        const property = col.column.property;
        if (!self.isEvent) {
          if (property.indexOf('Str') > -1) {
            self.order.property = property.substr(0, property.indexOf('Str'));
          } else {
            self.order.property = property;
          }
          this.$emit('sortChange', self.order);
        } else {
          if (property.indexOf('Str') === -1) {
            self.order.property = property;
            this.$emit('sortChange', self.order);
          }
        }
      }
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
    },

    sortHandle(obj1, obj2, column) {
      const val1 = obj1[column].substr(0, obj1[column].length - 1);
      const val2 = obj2[column].substr(0, obj2[column].length - 1);
      return val1 - val2;
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
</style>

<style>
  @import "../assets/css/pagination.css";
</style>

