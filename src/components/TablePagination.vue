<template>
  <div class="table">
    <el-table
      ref="tablePagination"
      :data="tableData"
      v-bind="$attrs"
      :highlight-current-row="true"
      :default-sort = "defaultSort"
      :header-cell-class-name="headerClass"
      :cell-class-name="cellClass"
      :row-class-name="rowClass"
      :cell-style="ifSetCellStyle ? setCellStyle : {}"
      :border="showBorder"
      :stripe="isStripe"
      :height="tableHeight"
      :empty-text="$t('deviceView.noData')"
      align="left"
      style="width: 100%"
      size="mini"
      v-on="$listeners"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="showSelectionColumn"
        type="selection"
        align="center"
        min-width="90"
      />
      <el-table-column
        v-for="(_item,_index) in columnData"
        :key="_index"
        :prop="_item.prop"
        :label="_item.label"
        :sortable="canSortable ? _item.sortable : false"
        :sort-orders="['ascending', 'descending']"
        :min-width="isexportPDF ? _item.pdfwidth : (lang.indexOf('zh') !== -1 ? _item.width : _item.maxWidth)"
        :formatter="_item.formatter">
        <template slot-scope="{row}">
          <template v-if="_item.canEdit && row.isEditing">
            <el-input v-model="row.tempDeviceName" class="edit-input" size="small" />
          </template>
          <span v-else-if="_item.formatter" v-html="_item.formatter(row[_item.prop])"/>
          <span v-else>{{ row[_item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableOperation.label"
        :min-width="tableOperation.minWidth"
        :label="tableOperation.label"
        align="left"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditing">
            <div class="iconlised" @click="confirmEdit(scope.row)">
              <i class="el-icon-check"/>
            </div>
            <div class="iconrised" @click="cancelEdit(scope.row)">
              <i class="el-icon-close"/>
            </div>
          </div>
          <div v-else>
            <i
              v-for="(item,index) in tableOperation.operation"
              :key="index"
              :type="item.type"
              :class="index === 2 && item.icon.indexOf('disabled') !== -1 && scope.row.scope === 0 ? `${item.icon} icon-disabled` : item.icon"
              class="iconfont"
              size="mini"
              @click="handleOperationButton(item.methods, scope.row, scope.$index)">
              {{ item.label }}
            </i>
          </div>
        </template>
      </el-table-column>
      <template v-if="isEvent">
        <el-table-column
          :label="$t('overview.remotePatrol')"
          :min-width="lang.indexOf('zh') !== -1 ? 120 : 180"
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
          :min-width="lang.indexOf('zh') !== -1 ? 120 : 180"
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
          :min-width="lang.indexOf('zh') !== -1 ? 120 : 160"
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
      <div slot="empty">
        <div v-if="!isLoadingData">
          <i class="iconfont icon-zhengque empty-data-icon"/>
          <span class="empty-text">{{ $t('deviceView.noData') }}</span>
        </div>
        <div v-else class="empty-content">
          <img :src="loadingGif">
          <span class="empty-text">{{ $t('remotePatrol.loading') }}</span>
        </div>
      </div>
    </el-table>
    <div v-if="showPagination" class="toolbar pagination clearfix">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagesize"
        :total="total"
        :layout="layout"
        background
        small
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import util from '@/common/util';

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
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    showSelectionColumn: {
      type: Boolean,
      default: false
    },
    isStripe: {
      type: Boolean,
      default: true
    },
    isDevice: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: Number
    },
    isLoadingData: {
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
      lang: this.$i18n.locale,
      order: { direction: '', property: '' },
      noData: this.$t('deviceView.noData'),
      loadingGif: require('../../static/img/loading.gif')
    };
  },
  computed: {
    tableSelection() {
      return this.$refs.tablePagination.selection;
    }
  },

  methods: {
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },

    handleRowClick(row) {
      this.currentRow = row;
      this.$emit('emitRowClick', row);
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
    },

    handleOperationButton(methods, row, index) {
      this.tableData.map(item => { item.isEditing = false; });
      row.isEditing = this.isDevice && methods === 'edit';
      this.$emit('handleOperation', { method: methods, row: row, index: index });
    },

    confirmEdit(row) {
      if (row.tempDeviceName.trim().length === 0) {
        util.notify(this.$t('deviceView.deviceNameEmpty'), 'warning', 3000);
        return;
      }
      row.isEditing = false;
      this.$emit('handleEdit', row);
    },

    cancelEdit(row) {
      row.isEditing = false;
      row.tempDeviceName = row.name;
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
    &:last-child{
      margin-right: 0px;
    }
  }
  .el-table--mini{
    font-size: calc(14/1920*100vw);
  }

  .iconfont{
    font-size: calc(24/1920*100vw);
    color: #7d8cad;
  }
  .iconlised{
    float: left;
    position: relative;
    background-color: #f31d65;
    padding: 1px 6px;
    color: #fff;
    border-width: 1px 1px 1px 1px;
    border-style: solid;
    border-color: #ddd;
    line-height: 25px;
    height: 25px;
    /deep/ el-button .add-btn{
      font-size: 12px;
    }
  }
  .iconrised{
    float: left;
    position: relative;
    padding: 1px 6px;
    border-width: 1px 1px 1px 0px;
    border-style: solid;
    border-color: #ddd;
    background-color: rgba(255, 255, 255, 0);
    line-height: 25px;
    height: 25px;
  }
  .empty-content{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .empty-text{
    margin-left: 20px;
    font-size: calc(16/1920*100vw);
    color: #7d8cad;
  }
  .icon-disabled{
    cursor: not-allowed;
  }
</style>

<style>
  @import "../assets/css/pagination.css";
</style>

