<template>
  <div class="paper" style="height: 100%">
    <el-button
      class="storevue-button-filled"
      size="mini" type="primary" @click="submit">
      保存並發布
    </el-button>
    <el-table
      :data="workflowDetail.nextNodes"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="節點名稱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="auditByUsers"
        label="審批人"
        width="180">
      </el-table-column>
      <el-table-column
        label="審批方式">
        <template slot-scope="{row}">
          <span>{{row.rowdata}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否需要簽名">
        <template slot-scope="{row}">
          <span>{{row.rowdata}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{row}">
          <span>{{row.rowdata}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  getWorkflowInfo,
  updateWorkflow,
} from "@/api/workflow";
import util from "@/common/util";

export default {
  name: "workflowDetail",
  components: {
  },
  data() {
    return {
      dataFromRoute: {},
      workflowDetail: {}
    };
  },
  mounted() {
    this.dataFromRoute = { ...this.$route.params.data }
    getWorkflowInfo({
      processDefinitionKey: this.dataFromRoute.processDefinitionKey
    }).then(res => {
      function getNodes (nodes, data) {
        if (data.nextAuditNode) {
          nodes.push(data.nextAuditNode)
          getNodes(nodes, data.nextAuditNode)
        } else return
      }
      let nextNodes = [];
      this.workflowDetail = { ...res.data }
      getNodes(nextNodes, this.workflowDetail)
      this.workflowDetail['nextNodes'] = nextNodes;
    })
  },
  methods: {
    submit() {
      let array = this.workflowDetail.nextNodes;
      var object = {};
      // updateWorkflow({
      //   ...this.workflowDetail
      // })
      // .then(res => {
      //   console.log(res)
      // })
    },
    
    
  },
};
</script>
<style lang="scss" scoped>
</style>