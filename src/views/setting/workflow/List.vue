<template>
  <div style="height: 100%">
    <div>
      <table-only
        ref="elTP"
        class="table-white"
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
        @handleSwitchChange="handleSwitchChange"
      />
    </div>
    <!-- <div style="width:100%; margin-top:12px;height:31px;">
      <tbl-pagination-only
        :btn-style="{backgroundColor:'transparent'}"
        :total="total"
        :current-page="page"
        :page-size="sizeNum"
        layout = "prev,pager, next,sizes,slot"
        @sizeChange="handlePageAndSizeChange"
        @currentChange="handlePageAndSizeChange"
      />
    </div> -->
  </div>
</template>
<script>
import { getWorkflowList, disableWorkflow, enableWorkflow } from "@/api/workflow";
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';

export default {
  name: "WorkflowList",
  components: { TableOnly, TblPaginationOnly },
  data() {
    return {
      tableData: [],
      isLoadingData: false,
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '134',
        align: 'center',
        operation: [
          {
            lable: '',
            icon: 'icon-reauthorize',
            methods: 'copy'
          },
          {
            lable: '',
            icon: 'icon-button',
            methods: 'set'
          },
          {
            lable: '',
            icon: 'icon-shanchu',
            methods: 'delete'
          }
        ]
      },
      columnData: [
        {
          'prop': 'name',
          'label': '名稱',
          'width': 90,
          'maxWidth': 130,
        },
        {
          'prop': 'type',
          'label': '流程分類',
          'width': 130,
          'maxWidth': 130,
        },
        {
          'prop': 'createdUser',
          'label': '創建人',
          'width': 130,
          'maxWidth': 130,
        },
        {
          'prop': 'description',
          'label': '流程描述',
          'width': 130,
          'maxWidth': 130,
        },
        {
          'prop': 'createdTs',
          'label': '創建時間',
          'width': 130,
          'maxWidth': 130
        },
        {
          'prop': 'state',
          'label': '狀態',
          'width': 130,
          'maxWidth': 130,
          'isSwitch': true
        },
      ],
    };
  },
  mounted() {
    getWorkflowList({}).then((res) => {
      this.isLoadingData = false;
      this.tableData = res.data.content.map(row => ({
        ...row,
        state: row.state === 1
      }))
      console.log("getWorkflowList", this.tableData);
    });
  },
  methods: {
    getWorkflowList() {},
    handleTabClick() {},
    handleEmitOperation() {},
    handlePageAndSizeChange() {},
    handleSwitchChange({ checked, target }) {
      if (checked) {
        enableWorkflow({
          processDefinitionKeys: [target.processDefinitionKey]
        }).then((res) => {
          if (res.errCode === 0) {
            this.tableData = this.tableData.map(row => {
              return row.processDefinitionKey === target.processDefinitionKey
              ? {
                ...row,
                state: true
              }
              : { ...row }
            })
          }
        }).catch(e => {
            util.notify(this.$t('route.networkError'), 'error', 5 * 1000 );
        })
      } else {
        disableWorkflow({
          processDefinitionKeys: [target.processDefinitionKey]
        }).then((res) => {
          if (res.errCode === 0) {
            this.tableData = this.tableData.map(row => {
              return row.processDefinitionKey === target.processDefinitionKey
              ? {
                ...row,
                state: false
              }
              : { ...row }
            })
          }
        }).catch(e => {
            util.notify(this.$t('route.networkError'), 'error', 1000 );
        })
      }
    }
  },
};
</script>