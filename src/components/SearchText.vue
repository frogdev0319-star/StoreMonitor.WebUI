<template>
  <input
    class="input"
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped>
.input {
  border-radius: 4px;
  border: 1px solid transparent;
  color: #606266;
  font-size: inherit;
  height: 30px;
  line-height: 30px;
  outline: 0;
  padding-left: 30px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  background: #edf0f2 url('../../static/img/search.png') no-repeat 8px 6px;
}
.input:focus {
  border: 1px solid #006ab7;
}
</style>