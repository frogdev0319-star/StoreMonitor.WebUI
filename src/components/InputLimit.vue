<template>
  <el-input
		ref="workflowName"
		:placeholder="workflowDetail.name"
		v-model="workflowDetail.name"
		style="width: 250px"
		maxlength="50"
	/>

</template>

<script>
export default {
  name: 'DialogPop',
  props: {

		workflowDetail:{
			type: Array,
      default: () => [],
      required: false
		},





  },
  data() {
    return {
      headerIcon: require('../../static/img/dialog-icon.png'),
    };
  },
  computed: {},
  mounted() {},
  methods: {
    // cancelHandler() {
    //   this.$emit('cancelHandler');
    // },
  }
};
</script>




<style lang="sass" scoped>
</style>
