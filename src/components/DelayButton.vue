<template>
  <el-button
    v-bind="$attrs"
    :loading="loadingStatus"
    size="mini"
    :type="buttonType"
    :class="`storevue-button-${type}`"
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
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    type: {
      type: String,
      default: 'outlined'
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

