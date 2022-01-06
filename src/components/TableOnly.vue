<template>
  <div class="table">
    <el-table
      ref="tablePagination"
      class="tbl-style"
      :data="tableData"
      v-bind="$attrs"
      :highlight-current-row="true"
      :default-sort = "defaultSort"
      :header-cell-style="headerStyle"
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
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
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
            <el-input v-model="row.tempDeviceName" class="edit-input" size="small" @input="val => inputDeviceNameChange(val, row)"/>
          </template>
          <template v-else-if="_item.isExpand">
            <span style="margin-right:13.5px;">{{ row[_item.prop]}}</span>
            <i v-if="row.id != expands" class="el-icon-arrow-down" style="color:#2c90d9;cursor:pointer;" @click="expandChange(row)"></i>
            <i v-if="row.id == expands" class="el-icon-arrow-up" style="color:#2c90d9;cursor:pointer;" @click="expandChange(row)"></i>
          </template>
          <template v-else-if="_item.isCellClick">
            <span style="cursor:pointer;color:#006ab7;font-size:15px;" @click="cellClick(row,_item.prop)">{{ row[_item.prop]}}</span>
          </template>
          <span v-else-if="_item.formatter" v-html="_item.formatter(row)"/>
          <template v-else>
            <template v-if="isDevice && _index < 3">
              <el-tooltip class="item" effect="dark" :content="row[_item.prop]" placement="bottom">
                <div>{{ row[_item.prop] | addEllipsis}}</div>
              </el-tooltip>
            </template>
            <span v-else>{{ row[_item.prop]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <component :is="expandComponent" v-bind="currentProperties"></component>
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
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
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
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
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
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
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
  </div>
</template>

<script>
import util from '@/common/util';
import filterString from '@/common/filterString'
import TabInceptionDetail from '@/components/TabInceptionDetail'
import IncepItemTop5 from '@/components/IncepItemTop5'
import EventCommentList from '@/components/EventCommentList'
export default {
  name:'TablePagination_V2',
  components: {
    TabInceptionDetail,
    IncepItemTop5,
    EventCommentList
  },
  props: {
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
    headerStyle: {
      type: Object,
      default: {height:'75px',backgroundColor: 'transparent',border:'none',fontSize:'12px'}
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
      default: false
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
    },
    allowRowExpand:{
      type: Boolean,
      default:false
    },
    expandComponent:{
      type: String,
      require:false
    },
    expandCompProperties:{
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentRow: {},
      lang: this.$i18n.locale,
      order: { direction: '', property: '' },
      noData: this.$t('deviceView.noData'),
      loadingGif: require('../../static/img/loading.gif'),
      expands: "",
      expandRowKeys: [],
    };
  },
  filters:{
    addEllipsis(value){
      if(value.length <= 10) return value;
      return value.substr(0, 10) + '...';
    }
  },

  computed: {
    tableSelection() {
      return this.$refs.tablePagination.selection;
    },
    currentProperties: function() {
      console.log(this.expandComponent);
      if (this.expandComponent=== 'TabInceptionDetail') {
        return { submitter: this.expands,beginTs:this.expandCompProperties.beginTs,endTs:this.expandCompProperties.endTs }
      }else if(this.expandComponent=== 'IncepItemTop5'){
        //console.log("this.expands:",this.expands);
        return { storeId: this.expands,beginTs:this.expandCompProperties.beginTs,endTs:this.expandCompProperties.endTs }
      }else if(this.expandComponent=== 'EventCommentList'){
        //console.log("this.expands:",this.expands);
        return { storeId: this.expands,beginTs:this.expandCompProperties.beginTs,endTs:this.expandCompProperties.endTs,itemId:this.expandCompProperties.itemId }
      }
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
    getRowKeys(row) {
      
      return row.id;
    },
    expandChange(row) {
       console.log("row click:",row);
        this.currentRow = row;
        if(this.allowRowExpand){
          if(row.id == this.expands){
            this.expands="";
            this.expandRowKeys=[];
          }
          else {
            this.expands = row.id;
            this.expandRowKeys.splice(0,1,row.id);
          }
          //this.expandChange(row);
        }
    },

    handleRowClick(row) {
      /*console.log("row click:",row);
      if(this.allowRowExpand){
        if(row.id == this.expands){
           this.expands="";
           this.expandRowKeys=[];
        }
        else {
          this.expands = row.id;
          this.expandRowKeys.splice(0,1,row.id);
        }
        //this.expandChange(row);
      }else{*/
        this.$emit('emitRowClick', row);
      //}
    },

    handleSortChange(col) {
      const self = this;
      const order = col.order;
      if (!order) {
        self.getOrderBasedOnDefaultSort();
      } else {
        self.order.direction = order === 'ascending' ? 'asc' : 'desc';
        const property = col.column.property;
        self.defaultSort.prop = property;
        self.defaultSort.order = order;
        if (!self.isEvent) {
          if (property.indexOf('Str') > -1) {
            self.order.property = property.substr(0, property.indexOf('Str'));
          } else {
            self.order.property = property;
          }
        } else {
          self.order.property = property;
        }
        this.$emit('sortChange', self.order, self.defaultSort);
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
    },

    inputDeviceNameChange(val, row) {
      const comment = filterString.all(val, 30);
      row.tempDeviceName = comment;
    },
    cellClick(row,prop){
      this.$emit('onCellClick',{row,prop});
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../assets/sass/stastical.scss";
  .tbl-style{
    padding: 0 24px;
    background-color: #f7f9fa;
    tbody{
      background-color: #f7f9fa;
    }
  }
  .el-table--mini{
    font-size: calc(15/1920*100vw);
    background-color: #f7f9fa;
  }
  .el-table__row.row-class .current-row{
    background-color: #edf0f2;
  }
  .el-table__expanded-cell:hover{
    background-color: #edf0f2 !important;
  }
  .clearfix{
    content: "";
    display: block;
    height: 0;
    clear:both;
    overflow: auto;
  }
  .toolbar{
    float: right;
    margin: 24px calc(24/1920*100vw);
    margin-right: 0;
    height:31px;
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
  .cell-class.el-table__expand-column .cell{
    padding:0;
    width:100px;
  }
</style>

<style>
  @import "../assets/css/pagination.css";
  .el-table__expanded-cell{
    background-color: #EFF3F5 !important;
  }
  .el-table__expanded-cell:hover {
    background-color: #EFF3F5 !important;
  }
  .el-table{
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #f5f5f5;
  }
  
</style>

