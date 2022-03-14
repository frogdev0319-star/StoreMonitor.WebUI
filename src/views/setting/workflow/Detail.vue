<template>
  <div style="height: 100%">detail</div>
</template>
<script>
import {
  getWorkflowList,
  disableWorkflow,
  enableWorkflow,
  getWorkflowInfo,
} from "@/api/workflow";
import util from "@/common/util";

export default {
  name: "workflowDetail",
  components: {},
  data() {
    return {
      dataFromRoute: {}
    };
  },
  mounted() {
    this.dataFromRoute = { ...this.$route.params.data }
    console.log({
      processDefinitionKey: this.dataFromRoute.processDefinitionKey
    })
    getWorkflowInfo({
      processDefinitionKey: this.dataFromRoute.processDefinitionKey
    }).then(res => console.log(res))
  },
  methods: {},
};
</script>