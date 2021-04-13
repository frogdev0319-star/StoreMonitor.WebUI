<template>
  <el-dialog
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :height="dialogHeight"
    :class="isForm ? 'storevue-form-dialog' : 'storevue-dialog'"
  >
    <div class="dialog-body">
      <slot/>
    </div>
    <div v-if="showButton" slot="footer">
      <el-button class="cancel-btn" size="mini" @click="cancelHandler">
        {{ $t('remotePatrol.cancel') }}
      </el-button>
      <el-button class="confirm-btn" size="mini" type="primary" @click="confirmHandler">
        {{ confirmText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogPop',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '500px'
    },
    dialogHeight: {
      type: String,
      default: '240px'
    },
    showButton: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default() {
        return this.$t('insSettingView.confirm')
      }
    },
    isForm: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('visibleChangeHandler', val);
      }
    }
  },

  methods: {
    cancelHandler() {
      this.$emit('cancelHandler');
    },

    confirmHandler() {
      this.$emit('confirmHandler');
    }
  }
};
</script>

<style scoped>

</style>
