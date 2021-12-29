<template>
  <el-dialog
    v-if="dialogClosed"
    :title="dialogTitle"
    :visible.sync="dialogClosed"
    :close-on-click-modal="false"
    style="text-align: left"
    width="28%"
    top="35vh"
    @close="cancle">
    <div slot="title" style="font-size: 24px; font-weight: 500" class="flex-center">{{dialogTitle}}<div class="spacer"></div><img v-if="isWarning":src="headerIcon" height="40px"></div>
    <div class="dialog-content">
      <span style="display: inline-block; vertical-align: middle; margin: 20px">{{ showInfo }}</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="isWarning" class="cancel-btn" size="mini" @click="cancle">{{ $t('remotePatrol.cancel') }}</el-button>
      <el-button class="confirm-btn" size="mini" type="primary" @click="confirm">{{ $t('remotePatrol.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogVue',

  props: {
    dialogTitle: String,
    showInfo: String,
    isWarning: Boolean,
    dialogClosed: Boolean
  },

  data() {
    return {
      headerIcon: require('../../static/img/dialog-icon.png'),
    };
  },

  methods: {
    confirm(ev) {
      const self = this;
      console.log(ev.target);
      const value = self.dialogClosed;
      self.$emit('confirmed', value);
    },

    cancle(ev) {
      const self = this;
      const value = self.dialogClosed;
      self.$emit('canceled', value);
    }
  }
};
</script>
<style lang="scss" scoped>
    @function rem($val){
        @return $val/16+rem;
    }
    @function checkRem($val){
        @if($val==0){
            @return 0;
        }
        @else if($val==auto){
            @return auto;
        }
        @else{
            @return rem($val);
        }
    }
    @mixin point($poi,$val){
        #{$poi}:checkRem($val);
    }
    .dialog-content{
        text-align: left;
        overflow:hidden;
        width:100%;
    }
    .el-dialog__body{
        padding: 0px !important;
    }
    .el-dialog__title{
        font-size: 14px !important;
        color: #303133 !important;
        float: left !important;
    }
    .cancel-btn{
        @include point(width,76);
        background-color: #EAEDF2 !important;
        color: #708090 !important;
        font-size: 12px;
    }
    .confirm-btn{
        @include point(width,76);
        font-size: 12px;
    }
</style>
