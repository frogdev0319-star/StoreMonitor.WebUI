<template>
  <el-button
    v-bind="$attrs"
    :loading="loadingStatus"
    class="storevue-button"
    @click="handleClick"
  >
    <slot/>
  </el-button>
</template>

<script>
export default {
  name: 'DelayButton',
  props: {
    autoLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingStatus: false,
      lang: this.$i18n.locale
    };
  },
  methods: {
    handleClick() {
      if (this.autoLoading) {
        this.loadingStatus = true;
      }
      this.$emit('click', () => {
        this.loadingStatus = false;
      });
    }
  }
};
</script>

