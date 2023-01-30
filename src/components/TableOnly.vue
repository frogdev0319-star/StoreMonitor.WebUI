<template>
  <div :class="tableThemes=='grey' ? 'table':'table-white'">
    <el-table
      ref="tablePagination"
      :class="tableThemes=='grey' ? 'tbl-style':'tbl-style-white'"
      :data="tableData"
      v-bind="$attrs"
      :highlight-current-row="true"
      :default-sort = "defaultSort"
      :header-cell-style="headerStyle"
      :cell-class-name="cellClass"
      :row-class-name="rowClass"
      :cell-style="cellStyle"
      :border="showBorder"
      :stripe="isStripe"
      :max-height="tableHeight"
      :empty-text="$t('deviceView.noData')"
      align="left"
      style="width:auto"
      size="mini"
      v-on="$listeners"
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      :default-expand-all="isexportPDF"
      @expand-change="expandChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    > 
      <el-table-column
        v-if="indexType"
        :label= "$t('audit.workFlows.nodeOrder')"
        type= "index"
        align="left"
        width="100"
        :index= "indexMethod"
      />
      <el-table-column
        v-if="showSelectionColumn"
        type="selection"
        align="center"
        min-width="90"
      />
      <el-table-column
        v-for="(_item,_index) in columnData"
        :key="_item.label+_index"
        :prop="_item.prop"
        :label="_item.label"
        :sortable="canSortable&&!isexportPDF ? _item.sortable : false"
        :sort-orders="['ascending', 'descending']"
        :min-width="isexportPDF ? _item.pdfwidth : (lang.indexOf('zh') !== -1 ? _item.width : _item.maxWidth)"
        :formatter="_item.formatter"
        :render-header="renderHeader">
        <template slot-scope="{row}">
          <template v-if="_item.canEdit && row.isEditing">
            <el-input v-model="row.tempDeviceName" class="edit-input" size="small" @input="val => inputDeviceNameChange(val, row)"/>
          </template>
          <template v-else-if="_item.isExpand">
            <span style="margin-right:13.5px;color:#006ab7;">{{ row[_item.prop]}}</span>
            <i v-if="row.id != expands" class="el-icon-arrow-down" style="color:#2c90d9;cursor:pointer;" @click="expandChange(row)"></i>
            <i v-if="row.id == expands" class="el-icon-arrow-up" style="color:#2c90d9;cursor:pointer;" @click="expandChange(row)"></i>
          </template>
          <template v-else-if="_item.isCellClick">
            <div v-if="_item.customIcon" >
              <img :src="_item.src" style="width:24px;height:24px;cursor:pointer;" @click="cellClick(row,_item.prop)">
            </div>
            <div v-else>
              <span style="cursor:pointer;color:#006ab7;font-size:calc(15/1920*100vw);" @click="cellClick(row,_item.prop)">{{ row[_item.prop]}}</span>
            </div>
          </template>
          <span v-else-if="_item.formatter" v-html="_item.formatter(row)"/>
          <!-- workflow switch state -->
          <template v-else-if="_item.forDescription">
            <div class="forDescription">
              <div class="shortdescription">{{row.description}}</div> 
              <div class="showDescription" 
                :class ="{ 'width-fit': row.description.length < 50}"
                v-if="row.description.length > 13" 
                > {{row.description}}</div>
            </div>
            
          </template>

          <!-- workflow switch state -->
          <template v-else-if="_item.forWorkflowsSwitch">
            <div class="forWorkflowsSwitch" @click="needAlert(row)">
              <el-switch
                v-model = "row.state"
                active-value="1"
                inactive-value="0"
                :disabled = "row.isBind"
                @change="$emit('handleSwitchChange', { checked: $event, target: row })"
                />
              </div>
          </template>
          
          <!-- workflow auditByUsers -->
          <template v-else-if="_item.auditByUsers">
            <!-- auditTargetType == 0 顯示為使用者 -->
            <div class="audit-user-row" v-if="row.auditTargetType == 0">
              <div class="audit-user" v-for="(item, index) in row.auditByUsers" :key="index">{{item}}</div>
            </div>
            <!-- auditTargetType == 1 顯示為部門（auditByGroups） -->
            <div class="audit-user-row" v-if="row.auditTargetType == 1">
              <div class="audit-user" v-for="(item, index) in row.auditByGroups" :key="index">{{item}}</div>
            </div>
          </template>

          <!-- workflow auditMethod -->
          <template v-else-if="_item.auditMethod">
            <el-radio-group class="storevue-radio" @change="changeAuditMethod(row)" v-model="row.auditMethod" v-if="row.name !== $t('audit.workFlows.submitAudit') ">
              <el-radio :label="0">{{$t('audit.workFlows.countersigned')}}</el-radio>
              <el-radio :label="1">{{$t('audit.workFlows.coSign')}}</el-radio>
            </el-radio-group>
          </template>

          <!-- workflow signature -->
          <template v-else-if="_item.signature" >
            <el-radio-group class="storevue-radio" @change="changeSignature(row)" v-model="row.signature" v-if="row.name !==  $t('audit.workFlows.submitAudit') ">
              <el-radio :label="true">{{$t('audit.workFlows.need')}}</el-radio>
              <el-radio :label="false">{{$t('audit.workFlows.unnecessary')}}</el-radio>
            </el-radio-group>
          </template>

          
          <template v-else>
            <template v-if="isDevice && _index < 3 ">
              <el-tooltip class="item" effect="dark" :content="row[_item.prop]" placement="bottom">
                <div>{{ row[_item.prop] | addEllipsis}}</div>
              </el-tooltip>
            </template>
            <span v-else>{{ row[_item.prop]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column type="expand" v-if="allowRowExpand" :render-header="renderHeader">
        <template slot-scope="{row}">
          <component :is="expandComponent" v-bind="currentProperties"></component>
        </template>
      </el-table-column>

    
      
      <!-- 操作 -->
      <el-table-column
        v-if="tableOperation.label "
        :min-width="tableOperation.minWidth"
        :label="tableOperation.label"
        align="left"
        class-name="small-padding fixed-width"
        :render-header="renderHeader"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.isEditing">
            <div class="iconlised" @click="confirmEdit(scope.row)">
              <i class="el-icon-check"/>
            </div>
            <div class="iconrised" @click="cancelEdit(scope.row)">
              <i class="el-icon-close"/>
            </div>
          </div>
          <div v-else-if="tableOperation.customIcon" >
            <img :src="tableOperation.src" style="width:24px;height:24px;" @click="handleOperationButton(tableOperation.methods, scope.row, scope.$index)">
          </div>

          <div class="flex-center" v-else>
              <img 
                :key="index"
                class="child-space"
                :class="index === 2 && item.icon.indexOf('disabled') !== -1 && scope.row.scope === 0 ? `${item.icon} icon-disabled` : item.icon"
                v-for="(item,index) in tableOperation.operation" 
                :src="`./static/img/table-${item.methods}.png`" 
                @click="handleOperationButton(item.methods, scope.row, scope.$index)"
                height="24px"
                width="24px"
              />
          </div>
        </template>
      </el-table-column>


      <!-- workflow 操作 -->
      <el-table-column
        v-if="tableworkflowOperation.label "
        :min-width="tableworkflowOperation.minWidth"
        :label="tableworkflowOperation.label"
        align="left"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div class="flex-center" v-if="scope.$index !== 0">
              <div class="move" v-if="tableworkflowOperation.move" >
                <div class="move-action" 
                  :class="{moveup_disable:scope.$index == 1 && item.methods == 'moveUp', movedown_disable: scope.$index == maxIndex && item.methods == 'moveDown'}"
                  :key="item.text"
                  v-for="item in tableworkflowOperation.move"
                  @click="handleMoveButton(item.methods, scope.row, scope.$index)"
                  >
                  {{item.text}} </div>
              </div>
              <img 
                :key="index"
                class="child-space"
                :class="index === 2 && item.icon.indexOf('disabled') !== -1 && scope.row.scope === 0 ? `${item.icon} icon-disabled` : item.icon"
                v-for="(item,index) in tableworkflowOperation.operation" 
                :src="`./static/img/table-${item.methods}.png`" 
                @click="handleOperationButton(item.methods, scope.row, scope.$index)"
                height="24px"
                width="24px"
              />
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
        <div v-if="!isLoading">
          <i class="iconfont icon-zhengque empty-data-icon"/>
          <span class="empty-text">{{ $t('deviceView.noData') }}</span>
        </div>
        <div v-else class="empty-content">
          <img :src="loadingGif" class="loading_rotate">
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
import PermissionHelper from '@/api/PermissionHelper';
import { message } from '@/common/singleton-message';
export default {
  name:'TableOnly',
  components: {
    TabInceptionDetail,
    IncepItemTop5,
    EventCommentList
  },
  props: {
    indexType:{
      type: Boolean,
      default: false
    },
    tableThemes:{
      type:String,
      default:'grey'
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
    tableworkflowOperation: {
      type: Object,
      default: () => {
        return {};
      }
    },
    headerStyle: {
      type: Object,
      default: {height:'75px',backgroundColor: 'transparent',border:'none',fontSize:'12px'}
    },
    cellStyle:{
      type: Object,
      default:  () => {
        return {};
      }
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
      default: false
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
      default: {}
    }
  },
  data() {
    return {
      currentRow: {},
      lang: this.$i18n.locale,
      order: { direction: '', property: '' },
      noData: this.$t('deviceView.noData'),
      loadingGif: require('../../static/img/loading.svg'),
      expands: "",
      expandRowKeys: [],
      isLoading:false,
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
      console.log("this.expandComponent --->", this.expandComponent);
      if (this.expandComponent=== 'TabInceptionDetail') {
        return { submitter: this.expands,beginTs:this.expandCompProperties.beginTs,endTs:this.expandCompProperties.endTs,isexportPDF:this.isexportPDF,isMystery:this.expandCompProperties.isMystery }
      }else if(this.expandComponent=== 'IncepItemTop5'){
        console.log("this.expandCompProperties:",this.expandCompProperties);
        return { storeId: this.expands, beginTs:this.expandCompProperties.beginTs, endTs:this.expandCompProperties.endTs, isexportPDF:this.isexportPDF,inspectTagIds:this.expandCompProperties.inspectTagIds }
      }else if(this.expandComponent=== 'EventCommentList'){
        //console.log("this.expands:",this.expands);
        return { storeId: this.expands,beginTs:this.expandCompProperties.beginTs,endTs:this.expandCompProperties.endTs,itemId:this.expandCompProperties.itemId,isexportPDF:this.isexportPDF }
      }
    },
    maxIndex(){
      return this.tableData.length - 1
    },
  },
  watch:{
    isLoadingData(val){
      this.isLoading = val;
    },
    tableData(val){
      console.log("tableData changed");
      this.closeAllExpand();
    }
  },
  created() {},
  mounted() {
    //console.log(this.columnData)
    console.log("this.expandCompProperties ????--->", this.expandCompProperties)
    
  },
  methods: {
    changeAuditMethod(row){
      this.$emit('handleAuditMethod', row);
    },
  
    changeSignature(row){
      this.$emit('handleSignature', row);
    },

    renderHeader(h, { column, $index }) {
      var colElement = [column.label];
      if(column.hasIcon){
         colElement = [column.label];

      }
      if(util.getWindowWidth()>1366){
        let realWidth = 0;
        let span = document.createElement('span');
        let spancontent = document.createElement('span');

        span.style.display = 'inline-block';
        span.innerText = column.label;
        document.body.appendChild(span);
        //console.log(column.label+" label:"+span.clientWidth )
        spancontent.style.display = 'inline-block';
        spancontent.innerText = column.prop;
        document.body.appendChild(spancontent);
        //console.log(column.label+" label:"+spancontent.clientWidth )

        realWidth = (spancontent.clientWidth>span.clientWidth)?spancontent.clientWidth:span.clientWidth;
        if(column.sortable) column.minWidth = realWidth+16;
        else column.minWidth = realWidth;
        //console.log(column.label+"realWidth:"+realWidth )
        document.body.removeChild(span);
        document.body.removeChild(spancontent);
      }
      let idx = (this.showSelectionColumn)? $index-1 : $index;
      console.log(column.label+"has icon:",this.columnData[idx])
      let hasIcon = false;
      if(this.columnData[idx] && this.columnData[idx].hasOwnProperty('hasIcon'))
        hasIcon = true;
      
      if(hasIcon){
        column.minWidth+16;
        return h(
          'div',[ 
                  h('span',column.label),
                  h('el-tooltip',
                  { props:{placement:'top-start',width:'200',trigger:'hover',content:this.columnData[idx].hasIcon.tooltipContent}},
                  [
                    h('img',{
                      style:{
                        width:"14px",
                        height:"14px",
                        cursor:"pointer",
                        marginLeft:"4px",
                        verticalAlign:"middle",
                        marginTop:"-2px"
                      },
                      attrs:{
                        src:this.columnData[idx].hasIcon.icon
                      }
                    })
                    /*h('i', {
                        class: 'iconfont question-icon icon-bangzhu',
                        style: {fontSize:'14px',marginLeft:'4px'}
                      })*/
                  ])                        
                ]
          )
      }else
        return h('span', {}, [column.label]);
    },
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {};if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },
    getRowKeys(row) {
      //console.log("row",row);
      if(row.id) return row.id;
      else if(row.userId) return row.userId;
      else return row[0];
      
    },
    expandChange(row) {
       /*console.log("row click:",row);
       if (this.expandComponent=== 'TabInceptionDetail') {
        console.log("!PermissionHelper.enableInspectReport():",!PermissionHelper.enableInspectReport());
        if(!PermissionHelper.enableInspectReport()){
          message({
              message: this.$i18n.t('route.noReportAuthority'),
              type: 'error',
              duration: 5 * 1000
            });
          this.expands="";
          this.expandRowKeys=[];
          return;
        }
      }*/
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
    closeAllExpand(){
      this.expands="";
      this.expandRowKeys=[];
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
      console.log("col.order:",col.order);
      if (!order) {
        self.getOrderBasedOnDefaultSort();
      } else {
        self.order.direction = order === 'ascending' ? 'asc' : 'desc';
        const property = col.column.property;
        self.defaultSort.prop = property;
        self.defaultSort.order = order;
        if (!self.isEvent) {
          console.log("property:",property);
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
      // console.log('this.tableData ======>> ', this.tableData);
      // console.log('row ======>> ', row);
      // console.log('index ======>> ', index);
      row.isEditing = this.isDevice && methods === 'edit';
      // console.log('row.isEditing ======>> ', row.isEditing);

      this.$emit('handleOperation', { method: methods, row: row, index: index });
    },

    handleMoveButton(methods, row, index){
      this.$emit('handleMove', { method: methods, row: row, index: index });
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
    },
    indexMethod(index){
      return index 
    },


    handleSelectionChange(val){
      // console.log('val 1', val)
      this.rows = val
      this.$emit('handleSelectionChange',{val});
    },

    clear(){
      this.$refs.tablePagination.clearSelection()
    },

    toggleChecked(tag){
      console.log('unChecked')
      console.log('tag !!!', tag)
      console.log('this.tableData !!!', this.tableData)

      var row = this.tableData.filter(element => 
          element.userName == tag.userName
      );
      console.log('row', row)
      this.$refs.tablePagination.toggleRowSelection(row[0])
      
    },

    fromInputSelect(data){
      // console.log('data~~~>', data)
      var temp = []
      this.tableData.forEach(element => {
        data.forEach( i =>{
          if(element.userId == i){
            temp.push(element)
          }
        })
      });
      this.$refs.tablePagination.clearSelection()
      temp.forEach(row => {
        this.$refs.tablePagination.toggleRowSelection(row, true);
      });
    },
    
    needAlert(row){
      // console.log('needAlert :>> ');
      // console.log('row :>> ', row);
      if(row.isBind == true){
          this.$emit('cantCloseAlertPopup', row);
          // util.notify(`${this.$t('audit.workFlows.isBind')} ${row.inspectTagName} ${this.$t('audit.workFlows.cantClose')}`, 'error', 3000);
      }else{
        return
      }

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
  .tbl-style-white{
    padding: 0 24px;
    background-color: #fff;
    tbody{
      background-color: #fff;
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
    width: 0px;
  }
  
</style>

<style lang="scss">
  @import "../assets/css/pagination.css";
  .el-table__expanded-cell{
    background-color: #EFF3F5 !important;
  }
  .el-table__expanded-cell:hover {
    background-color: #EFF3F5 !important;
  }
  .table {
    width: auto;
    
    .el-table{
      box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
      border: solid 1px #f5f5f5;
      overflow-x: auto;
    }
    tr{
      background-color: #f7f9fa !important;
    }
    /**** body的scrollbar
    .el-table__body-wrapper::-webkit-scrollbar {
	      width: 4px; 
	      height: 150px; 
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb {
        box-shadow: 0px 1px 3px #acaeb1 inset; 
        border-radius: 2px; 
        background-color: #acaeb1; 
    }*/
  }
  .table-white {
    .el-table{
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
      border-radius: 5px;
      border: solid 1px #f5f5f5;
      background-color: #fff;
    }
    /**** body的scrollbar
    .el-table__body-wrapper::-webkit-scrollbar {
	      width: 4px; 
	      height: 150px; 
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb {
        box-shadow: 0px 1px 3px #acaeb1 inset; 
        border-radius: 2px; 
        background-color: #acaeb1; 
    }*/
  }
  #el-tablescrollbar {
  height: calc(100% - 225px);
}
/deep/ #el-tablescrollbar .el-scrollbar__wrap {
  overflow-x: auto;
}
/deep/
    .el-table
    .el-table__header-wrapper
    .el-table-column--selection
    .el-checkbox__inner 
    {
      border-radius: 1px;
      border: solid 1px #acaeb1;
      background-color: #edf0f2;
      &::before{
        display:none;
      }
    }
    /deep/
    .el-table
    .el-table__header-wrapper
    .el-table-column--selection
    .is-checked
    .el-checkbox__inner 
    {
      border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #2c90d9;
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
      border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #e0f2ff;
      color:#2c90d9;
      &::after{
       border-color:#2c90d9;
      }
    }
    
    
</style>

<style lang="sass" >
  .move
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: flex-start
      .move-action
        color: #006ab7
        margin-left: 10px
        cursor: pointer
        transition: all .2s
        &:hover
          transform: scale(1.1)
      
  .icon-copy, .icon-setting, .icon-delete
    cursor: pointer
    transition: all .2s
    &:hover
      transform: scale(1.1)
  .moveup_disable, .movedown_disable
    opacity: 0.3 !important
    pointer-events: none !important
  .question-icon
    font: size 14px
    margin: left 4px
  

</style>

