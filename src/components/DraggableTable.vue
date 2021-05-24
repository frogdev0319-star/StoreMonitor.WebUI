<template>
    <div class="dragable-table-content">
      <div class="dragable-table-header">
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
                <el-checkbox v-model="contentItem.checked" class="item-checkbox"/>
              </div>
              <div class="table-name">{{ contentItem.name }}</div>
            </div>
            <div :class="isScoreSheet? 'table-score-description': 'table-description'">
              {{ contentItem.description}}
            </div>
            <div class="table-score">
              {{ contentItem.score}}
            </div>
            <template v-if="tableHeader.length > 4">
              <div class="table-available-score">
                {{ contentItem.availableScores}}
              </div>
              <div class="table-available-score">
                {{ contentItem.qualifiedScore}}
              </div>
            </template>
            <div class="nape-items-handle">
              <i class="iconfont icon-bianji" style="cursor:pointer;margin-right:10px;" @click="handleEdit(contentIndex,contentItem)"/>
              <i class="iconfont icon-shanchu" style="cursor:pointer;" @click="handleDelete(contentIndex, contentItem)"/>
            </div>
          </div>
        </draggable>
      </div>
    </div>
</template>

<script>
  import draggable from 'vuedraggable';

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
      }
    },
    components: { draggable },
    data(){
      return {
        sortableTableData: this.tableData
      }
    },
    watch:{
      tableData:{
        handler(newValue,oldValue){
          this.sortableTableData = newValue;
        },
        deep:true
      },
    },
    methods:{
      handleEdit(contentIndex, contentItem){
        this.$emit('handleEditItem', contentIndex, contentItem);
      },
      handleDelete(contentIndex, contentItem){
        this.$emit('handleDeleteItem', contentIndex, contentItem);
      },
    }
  }
</script>

<style scoped lang="scss">

  .dragable-table-content{
    margin-left: 4%;
    box-sizing: border-box;
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
  .table-score, .nape-items-handle, .table-available-score{
    width: 12.5%;
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

  .nape-items-handle{
    display: inline-block;
    .iconfont{
      font-size: calc(24/1920*100vw);
      color: #7d8cad;
    }
  }

  .sortable-ghost{
    color: #424151 !important;
    background: rgba(243, 19, 101, 0.1) !important;
    border: 1px solid #f31d65;
  }

</style>
