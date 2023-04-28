<template>
  <div :class="showTableHeader ? 'dragable-table-content' : 'dragable-noheader-table-content'">
    <div v-if="showTableHeader" class="dragable-table-header">
      <div
        v-for="(headerItem, headerIndex) in tableHeader"
        :key="headerIndex"
        :style="headerItem.headerStyle"
        class="table-header-item">
        {{ headerItem.name }}
      </div>
    </div>
    <div class="dragable-table-list">
      <draggable v-model="sortableTableData" @update="handleUpdate">
        <div v-for="(contentItem, contentIndex) in sortableTableData" :key="contentItem.sequence" class="table-content-item">
          <div class="table-checkbox-name">
            <div class="table-checkbox">
              <el-checkbox
                v-model="contentItem.checked"
                class="storevue-checkbox-outlined"
                @change="onCheckItem(sortableTableData)"/>
            </div>
            <div class="table-name" style="position: relative">
              <span v-if="contentItem.required" style="color: #c60957; position: absolute">*</span>
              <span style="margin-left: 10px">{{ contentItem.name }}</span></div>
          </div>
          <div :class="isScoreSheet? 'table-score-description': 'table-description'">
            {{ contentItem.description }}
          </div>
          <div class="table-score"></div>
          <div class="table-score">
            {{ contentItem.type === 0 ? contentItem.score : '--' }}
          </div>
          <template v-if="isScoreSheet">
            <div class="table-available-score">
              <template>
                <icon-tooltip :content="contentItem.availableScores" placement="top">
                  <div>{{ contentItem.type === 0 ? contentItem.availableScores : '--' }}</div>
                </icon-tooltip>
              </template>
            </div>
            <div class="table-available-score">
              {{ contentItem.type === 0 ? contentItem.qualifiedScore : '--' }}
            </div>
          </template>
          <div class="table-operation">
            <!-- btn icon  with svg -->
            <!-- <div class="el-icon-edit" style="font-size: 20px; color: #999"></div> -->
            <img
              v-if="showEditBtn"
              :src="`./static/img/table-edit.png`"
              @click="handleEdit(contentIndex,contentItem)"
              height="26px" />
            <img
              :src="`./static/img/table-delete.png`"
              @click="handleDelete(contentItem)"
              height="26px" />
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import IconTooltip from './IconTooltip';
import { inpectRESTful } from '@/api/index';

export default {
  name: 'DragableTable',
  components: { IconTooltip, draggable },
  props: {
    tableHeader: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isScoreSheet: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: true
    },
    showTableHeader: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      sortableTableData: this.tableData,
      oldSequenceList: [],
      newSequenceList: []
    };
  },
  watch: {
    tableData: {
      handler(newValue) {
        this.sortableTableData = newValue;
        this.getSequenceList();
      },
      deep: true
    }
  },

  mounted() {
    //console.log("this.sortableTableData:",this.sortableTableData);
    this.getSequenceList();
  },
  methods: {
    getSequenceList() {
      this.oldSequenceList = this.sortableTableData.map(value => value.sequence);
    },

    handleEdit(contentIndex, contentItem) {
      this.$emit('handleEditItem', contentIndex, contentItem);
    },
    handleDelete(contentItem) {
      this.$emit('handleDeleteItem', contentItem);
    },
    onCheckItem(tableData) {
      this.$emit('handleCheckItem', tableData);
    },

    handleUpdate(e) {
      this.newSequenceList = this.sortableTableData.map(value => {
        return {
          id: value.id,
          sequence: value.sequence
        };
      });
      this.updateItemSequence();
    },

    updateItemSequence() {
      console.log(111)
      const params = {};
      params.items = [];
      this.newSequenceList.forEach((item, index) => {
        const itemObj = {};
        itemObj.id = item.id;
        itemObj.sequence = this.oldSequenceList[index];
        params.items.push(itemObj);
      });

      if (params.items.length > 0) {
        inpectRESTful.updateInspectItem(params).then(res => {
          if (res.errCode === 0) {
            this.$emit('updateTableData', this.sortableTableData);
            // this.oldSequenceList = this.newSequenceList.map(value => value.sequence);
          }
        }).catch(err => {
          console.log('updateItemsSequence: ' + err);
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">

  .dragable-table-content{
    margin-left: 24px;
    box-sizing: border-box;
  }
  .dragable-noheader-table-content{
    box-sizing: border-box;
    .table-content-item{
      padding-left: calc(27/1920*100vw);
      border-bottom: 1px solid #acaeb1;
    }
    .table-checkbox-name{
      width: 27%;
      .table-name{
        width: 250px;
        margin-left: 0;
        margin-right: 40px;
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

    align-items: center;
  }
  .dragable-table-header{
    position: relative;
    font-size: 12px;
    color: #484848;
    text-align: center;
    font-family: 'NotoSansCJKtc';
    min-height: 33px;
    height: auto;
    border-bottom: solid 1px #acaeb1;
  }
  .table-content-item{
    font-size: 15px;
    color: #484848;
    font-family: 'Roboto';
    min-height: 60px;
    height: auto;

  }
  .table-checkbox-name{
    display: inline-flex;
    align-items: center;
    .table-name{
      margin-left: 0.9375rem;
      text-align: left;
      width: 75%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    width: 27%;

  }
  .table-description{
    width: 45%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .table-score-description{
    width: 25%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
