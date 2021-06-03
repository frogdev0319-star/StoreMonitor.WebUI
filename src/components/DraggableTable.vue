<template>
    <div :class="showTableHeader ? 'dragable-table-content' : 'dragable-noheader-table-content'">
      <div class="dragable-table-header" v-if="showTableHeader">
        <div class="table-header-item" v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex"
             :style="headerItem.headerStyle">
          {{ headerItem.name }}
        </div>
      </div>
      <slot></slot>
      <div class="dragable-table-list">
        <draggable v-model="sortableTableData">
          <div class="table-content-item" v-for="(contentItem, contentIndex) in sortableTableData" :key="contentIndex">
            <div class="table-checkbox-name">
              <div class="table-checkbox">
                <el-checkbox v-model="contentItem.checked" class="item-checkbox" @change="onCheckItem(contentItem, contentIndex, sortableTableData)"/>
              </div>
              <div class="table-name">{{ contentItem.name }}</div>
            </div>
            <div :class="isScoreSheet? 'table-score-description': 'table-description'">
              {{ contentItem.description}}
            </div>
            <div class="table-score">
              {{ contentItem.score}}
            </div>
            <template v-if="isScoreSheet">
              <div class="table-available-score">
                <template>
                  <icon-tooltip :content="contentItem.availableScores" placement="top">
                    <div>{{ contentItem.availableScores}}</div>
                  </icon-tooltip>
                </template>
              </div>
              <div class="table-available-score">
                {{ contentItem.qualifiedScore}}
              </div>
            </template>
            <div class="table-operation">
              <i class="iconfont icon-bianji" style="cursor:pointer;margin-right:10px;"
                 @click="handleEdit(contentIndex,contentItem)" v-if="showEditBtn"/>
              <i class="iconfont icon-shanchu" style="cursor:pointer;" @click="handleDelete(contentIndex, contentItem)"/>
            </div>
          </div>
        </draggable>
      </div>
    </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import IconTooltip from "./IconTooltip";

  export default {
    name: "DragableTable",
    props: {
      tableHeader: {
        type: Array,
        default: []
      },
      tableData: {
        type: Array,
        default: []
      },
      isScoreSheet: {
        type: Boolean,
        default: false
      },
      showEditBtn:{
        type: Boolean,
        default: true
      },
      showTableHeader: {
        type: Boolean,
        default: true
      }
    },
    components: {IconTooltip, draggable },
    data(){
      return {
        sortableTableData: this.tableData
      }
    },
    watch:{
      tableData:{
        handler(newValue){
          this.sortableTableData = newValue;
        },
        deep:true
      }
    },
    methods:{
      handleEdit(contentIndex, contentItem){
        this.$emit('handleEditItem', contentIndex, contentItem);
      },
      handleDelete(contentIndex, contentItem){
        this.$emit('handleDeleteItem', contentIndex, contentItem);
      },
      onCheckItem(contentItem, contentIndex, tableData){
        this.$emit('handleCheckItem', contentItem, contentIndex, tableData);
      }
    }
  }
</script>

<style scoped lang="scss">

  .dragable-table-content{
    margin-left: 4%;
    box-sizing: border-box;
  }
  .dragable-noheader-table-content{
    box-sizing: border-box;
    .table-content-item{
      padding-left: calc(27/1920*100vw);
      border-bottom: 1px solid #e3e9f4;
    }
    .table-checkbox-name{
      width: 27%;
      .table-name{
        margin-left: 0;
        padding-left: calc(38/1920*100vw);
      }
    }
    .table-description{
      width: 45%;
    }
    .table-score{
      width: 16%;
    }
    .table-operation{
      width: 18%;
    }
    .table-available-score{
      width: 18%;
    }
  }
  .dragable-table-header, .table-content-item{
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
  }
  .dragable-table-header{
    position: relative;
    font-size: 14px;
    color: #7d8cad;
    text-align: center;
  }
  .table-content-item{
    font-size: 14px;
    color: #424151;
  }
  .table-checkbox-name{
    display: inline-flex;
    align-items: center;
    .table-name{
      margin-left: 0.9375rem;
      text-align: left;
      width: 80%;
    }
    .table-checkbox{
      height: 14px;
    }
  }
  .table-score, .table-operation, .table-available-score{
    width: 12.5%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .table-checkbox-name{
    width: 30%;
  }
  .table-description{
    width: 45%;
    text-align: left;
  }

  .table-score-description{
    width: 25%;
    text-align: left;
  }

  .table-operation{
    display: inline-block;
    .iconfont{
      font-size: calc(24/1920*100vw);
      color: #7d8cad;
    }
  }

  .sortable-ghost{
    color: #424151 !important;
    background: rgba(243, 19, 101, 0.1) !important;
    border: 1px solid #f31d65 !important;
  }

</style>
