<template>
  <div class="content">
    <el-select
      v-model="selectedArray"
      :placeholder="placeHolder"
      :disabled="disabled"
      :size="inputSize"
      multiple
      collapse-tags
      :taggable="false"
      :style="{width:'Wdith'}"
      @change="changeSelect"
      @visible-change="visibileHandler">
      <el-option v-if="options.length > 0" :label="$t('scheduleView.all')" :disabled="allDisabled"
        value="-1" @click.native="selectAll"/>
      <el-option v-for="(item, index) in options" :key="index" :label="item.label"
        :value="item.value" :disabled="item.disabled"/>
    </el-select>
    <el-input
      v-model="input"
      :class="{ hide: noTextInput }"
      readonly
      class="input-class"/>
  </div>
</template>

<script>
export default {
  name: 'RegionMultiSelect',

  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array
    },
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    inputSize: {
      type: String,
      default: 'medium'
    },
    all: {
      type: String,
      default: ''
    },
    isPointCheck: {
      type: Boolean,
      default: false
    },
    noTextInput: {
      type: Boolean,
      default: true
    },
    Width:{
      type:Number,
      default:160
    }
  },

  data() {
    return {
      input: '',
      disabledLength: 0,
      placeHolder: this.placeholder,
      selectedArray: this.selected,
      changed: false,
      allDisabled: false
    };
  },

  watch: {
    selected(val, oldVal) {
      this.selectedArray = val;
      this.initData();
    },

    options(val){
      this.selectedArray = [...this.selected];
      this.initData();
    }
  },
  mounted() {
    this.initData();
  },

  methods: {
    initData() {
      this.disabledLength = 0;
      const self = this;
      this.allDisabled = false;
      this.options.forEach(item => {
        if (item.disabled) {
          self.disabledLength++;
        }
      });
      if (!this.selectedArray.includes('-1') && this.selectedArray.length === this.options.length - this.disabledLength) {
        if (this.options.length === this.disabledLength) {
          this.input = '';
          this.allDisabled = true;
        } else {
          this.input = this.all;
          this.selectedArray.unshift('-1');
        }
      } else if (this.selectedArray.includes('-1')) {
        this.input = this.all;
        const tempArray = [...this.selectedArray.filter(item => item != '-1')];

        if (this.isPointCheck) {
          if (tempArray.sort().toString() == [6, 7].toString()) {
            this.input = this.$t('scheduleView.weekends');
          } else if (tempArray.sort().toString() == [1, 2, 3, 4, 5].toString()) {
            this.input = this.$t('scheduleView.workdays');
          } else {
            this.input = '';
            this.selectedArray.forEach(item => {
              this.options.forEach(_item => {
                if (item === _item.value) {
                  this.input += _item.label + ',';
                }
              });
            });
            this.input = this.input.slice(0, this.input.length - 1);
          }
        }
      } else {
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (item === _item.value) {
              this.input += _item.label + ',';
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
        const tempArray = [...this.selectedArray];

        if (this.isPointCheck && tempArray.sort().toString() == [6, 7].toString()) {
          this.input = this.$t('scheduleView.weekends');
        } else {
          if (this.isPointCheck && tempArray.sort().toString() == [1, 2, 3, 4, 5].toString()) {
            this.input = this.$t('scheduleView.workdays');
          }
        }
      }
      if (this.options.length === 0) {
        this.input = '';
        this.selectedArray = [];
      }
    },

    selectAll() {
      if (this.selectedArray.length < this.options.length - this.disabledLength) {
        this.selectedArray = [];
        this.options.forEach((item) => {
          if (!item.disabled) {
            this.selectedArray.push(item.value);
          }
        });
        this.input = this.all;
        const tempArray = [...this.selectedArray];
        if (this.isPointCheck) {
          if (tempArray.sort().toString() == [6, 7].toString()) {
            this.input = this.$t('scheduleView.weekends');
          } else if (tempArray.sort().toString() == [1, 2, 3, 4, 5].toString()) {
            this.input = this.$t('scheduleView.workdays');
          } else {
            this.selectedArray.forEach(item => {
              this.options.forEach(_item => {
                if (item === _item.value) {
                  this.input += _item.label + ',';
                }
              });
            });
            this.input = this.input.slice(0, this.input.length - 1);
          }
        }
        this.selectedArray.unshift('-1');
      } else {
        this.selectedArray = [];
        this.input = '';
      }
    },

    changeSelect(val) {
      this.changed = true;
      if (!val.includes('-1') && val.length === this.options.length - this.disabledLength) {
        this.input = this.all;
        const tempArray = [...this.selectedArray];
        if (this.isPointCheck && tempArray.sort().toString() == [6, 7].toString()) {
          this.input = this.$t('scheduleView.weekends');
        } else {
          if (this.isPointCheck && tempArray.sort().toString() == [1, 2, 3, 4, 5].toString()) {
            this.input = this.$t('scheduleView.workdays');
          }
        }
        this.selectedArray.unshift('-1');
      } else if (val.includes('-1') && (val.length - 1) < this.options.length) {
        this.selectedArray = this.selectedArray.filter((item) => {
          return item !== '-1';
        });
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (item === _item.value) {
              this.input += _item.label + ',';
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
      } else {
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (item === _item.value) {
              this.input += _item.label + ',';
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
        const tempArray = [...this.selectedArray];

        if (this.isPointCheck && tempArray.sort().toString() == [6, 7].toString()) {
          this.input = this.$t('scheduleView.weekends');
        } else {
          if (this.isPointCheck && tempArray.sort().toString() == [1, 2, 3, 4, 5].toString()) {
            this.input = this.$t('scheduleView.workdays');
          }
        }
      }
    },

    visibileHandler(val) {
      if (!val && this.changed) {
        let selectedList = [];
        selectedList = this.selectedArray;
        console.log(selectedList);
        this.$emit('changeInput', selectedList);
      }
    }
  }
};
</script>
<style scoped>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .content{
    text-align: left;
    display: inline-block;
    position: relative;
    width: 100%;
  }
  .el-select-dropdown__item{
    /*color: #7d8cad;*/
    padding-right: 10px;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    font-family: "iconfont" !important;
    content: '\e6a2';
    left: 20px;
    font-size: 14px;
    font-style: normal;
    color: #2c90d9;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item::after{
    font-family: "iconfont" !important;
    position: absolute;
    left: 20px;
    content: "\e64a";
    color: #2c90d9;
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    font-style: normal;
    -moz-osx-font-smoothing: grayscale;
  }
  .input-class{
    width: calc(100% - 30px);
    position: absolute;
    left: 0;
    top:0;
    z-index: 100;
    text-overflow: ellipsis;
  }
  >>> .el-select .el-input--medium .el-input__suffix{
    top:0px !important;
    
  }
  >>> .el-select__tags{
    opacity: 0;
  }
  >>> .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    /* border: none; */
    font-size: 15px;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    min-height: 28px;
    min-width: 85px;
  }

  >>> .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
    line-height: calc(36/1920*100vw);
    height: calc(36/1920*100vw);
    min-height: 28px;
    color: #2c90d9;
  }
  .el-select.el-select--medium{
    color: #2b2b2b;
    background: #fff !important;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: none !important;
    width: 100%;
    border-radius: 3px;
    min-height: 28px;
    min-width: 85px;
  }
  >>> .el-select__tags{
    opacity: 0;
  }
  >>> .el-select.el-select--mini .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 15px;
  }
  >>> .el-select.el-select--mini .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  .el-select.el-select--mini{
    color: #2b2b2b;
    background: #fff !important;
    width: 200px;
  }
  >>> .el-province .el-input--mini .el-input__inner{
    height: 28px;
    line-height: 28px;
  }
</style>

<style>
  @import '../assets/css/pagination.css';
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected span{
    color: #7d8cad;
    font-weight: normal;
    padding-right: 25px;
  }
  
</style>

<style lang="sass">
  .hide
    pointer-events: none
    .el-input__inner
      border: 0px solid #FFF0 !important
      background: #FFF0 !important
    
</style>