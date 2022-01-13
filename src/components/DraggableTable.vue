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
    <slot/>
    <div class="dragable-table-list">
      <draggable v-model="sortableTableData" @update="handleUpdate">
        <div v-for="(contentItem, contentIndex) in sortableTableData" :key="contentItem.sequence" class="table-content-item">
          <div class="table-checkbox-name">
            <div class="table-checkbox">
              <el-checkbox
                v-model="contentItem.checked"
                class="storevue-checkbox"
                @change="onCheckItem(sortableTableData)"/>
            </div>
            <div class="table-name">{{ contentItem.name }}</div>
          </div>
          <div :class="isScoreSheet? 'table-score-description': 'table-description'">
            {{ contentItem.description }}
          </div>
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
            <i
              v-if="showEditBtn"
              class="iconfont icon-bianji"
              style="cursor:pointer;margin-right:10px;"
              @click="handleEdit(contentIndex,contentItem)"/>
            <i class="iconfont icon-shanchu" style="cursor:pointer;" @click="handleDelete(contentItem)"/>
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
            // this.$emit('updateTableData', this.sortableTableData);
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
    min-height: 60px;
    height: auto;
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
