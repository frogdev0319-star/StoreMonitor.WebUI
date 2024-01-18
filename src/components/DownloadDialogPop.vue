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
				<div class="flex-center" style="border-bottom: 3px solid #006ab7; margin-right: 10px">
					<div class="el-icon-bottom download_animation" ></div>
				</div>
				<div>{{title}}</div>
			</div>
		</template>

    <div v-if="showButton" slot="footer">
      <el-button class="confirm-btn" style="width: fit-content; padding: 0 12px" size="mini" type="primary" @click="goToPage">
				前往下載管理
      </el-button>
      <el-button class="confirm-btn" style="background: #999; color: #FFF;" size="mini" @click="confirmHandler">
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
    showCancelbtn:{
      type: Boolean,
      default: true
    }
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
    goToPage() {
      this.$emit('goToPage');
    },

    confirmHandler() {
      this.$emit('confirmHandler');
    },
    
  }
};
</script>

<style lang="sass">

	.download_animation
		color: #006ab7
		font-size: 32px
		// transform: translate(0px,-50px)
		animation: go 1.5s linear infinite


	@keyframes go
		0% 
			opacity: 0
			transform: translate(0px, -30px)
		20%
			opacity: 1
			transform: translate(0px, 0px)
		80%
			opacity: 1
			transform: translate(0px, 0px)
		100%
			opacity: 0
			transform: translate(0px, 0px)

</style>
<style scoped>
.title{
  font-size: 21px; 
  font-weight: 500;
	padding: 20px 0;
  display:flex;
  justify-content: center;
}
</style>
