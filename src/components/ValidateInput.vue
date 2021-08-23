<template>
  <div class="dialog-form-item">
    <slot/>
    <el-input v-model="inputValue" :placeholder="placeholder" size="mini" @input= "onInput" @blur="onBlur"/>
    <div v-if="showPromotMsgFlag" class="error-text">
      <span>
        {{ promptMsg }}
      </span>
    </div>
  </div>
</template>

<script>
import filterString from '../common/filterString';

export default {
  name: 'ValidateInput',
  props: {
    outLimitPromptMsg: {
      type: String,
      default: ''
    },
    emptyPromptMsg: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    inputLimitLength: {
      type: Number,
      default: 30
    },
    inputName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: this.inputName,
      showPromotMsgFlag: false,
      promptMsg: ''
    };
  },
  watch: {
    inputName(newValue) {
      this.inputValue = newValue;
    }
  },
  methods: {
    onInput(val) {
      const comment = filterString.all(val, this.inputLimitLength);
      const length = filterString.getContentLength(val);
      this.inputValue = comment;
      if (length > this.inputLimitLength) {
        this.showPromotMsgFlag = true;
        this.promptMsg = this.outLimitPromptMsg;
      } else {
        this.showPromotMsgFlag = false;
      }
    },

    onBlur() {
      if (this.inputValue.length === 0) {
        this.showPromotMsgFlag = true;
        this.promptMsg = this.emptyPromptMsg;
      } else {
        this.showPromotMsgFlag = false;
        this.$emit('getInputValue', this.inputValue);
      }
    }
  }
};
</script>

<style scoped>

</style>
