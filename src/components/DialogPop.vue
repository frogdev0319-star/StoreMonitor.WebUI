<template>
  <el-dialog
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :height="dialogHeight"
    :show-close="false"
    :class="isForm ? 'storevue-form-dialog' : 'storevue-dialog'"
    
  >
  <template slot="title">

    <div slot="title" class="flex-center title" :style="isForm ?{'width':'100%'}:{'width':dialogWidth}">
      <div>{{title}}</div>
      <div  class="flex-center">
        <img v-if="isWarning" :src="headerIcon" height="40px">
      </div>
    </div>
  </template>
    <div class="main-dialog-body">
      <slot/>
    </div>
    <div v-if="showButton" slot="footer">
      <div style="display: inline; float: left; color: #f57949;width:45%;word-break:break-word;text-align:left;" v-if="hasIgnore" @click="hasIgnoreHandler">{{$t('remotePatrol.clickToContent')}}</div>
      <el-button class="cancel-btn" size="mini" @click="cancelHandler">
        {{ $t('remotePatrol.cancel') }}
      </el-button>
      <el-button :disabled="confirmBtnDisabled" class="confirm-btn" size="mini" type="primary" @click="confirmHandler">
        {{ confirmText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogPop',
  props: {
    title: {
      type: String,
      default: ''
    },
    isWarning: {
      type: Boolean,
      default: false
    },
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
    },
    confirmBtnDisabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    hasIgnore: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      headerIcon: require('../../static/img/dialog-icon.png'),
    };
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
  mounted() {
    ; //方法
    },
  methods: {
    cancelHandler() {
      this.$emit('cancelHandler');
    },

    confirmHandler() {
      this.$emit('confirmHandler');
    },
    
    hasIgnoreHandler() {
      this.$emit('hasIgnoreHandler');
    },

  

  }
};
</script>

<style scoped>
.title{
  font-size: 24px; 
  font-weight: 500;
  display:flex;
  justify-content: space-between;
}
</style>
