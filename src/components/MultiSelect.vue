<template>
  <div class="content">
    <el-select
      v-model="selectedArray"
      :placeholder="alltype === 0 ? (allSelect === 0 ? promptMsg : $t('remotePatrol.all')):$t('remotePatrol.stores')"
      :disabled="disabled"
      multiple
      collapse-tags
      class="el-province device-select"
      @change="changeSelect"
      @visible-change="visibileHandler">
      <el-option v-if="options.length > 0" :label="alltype ===0 ? $t('remotePatrol.all'):$t('overview.all')"
                 value="-1" @click.native="selectAll"/>
      <el-option v-for="(item, index) in options" :key="index" :label="item.label"
                 :value="alltype === 0 ? item.value:item.storeId" :disabled="item.disabled"/>
    </el-select>
    <el-input
      v-model="input"
      readonly
      class="input-class"/>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array
    },
    alltype: {
      type: Number
    },
    allSelect: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    promptMsg: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      input: '',
      disabledLength: 0,
      selectedArray: this.selected,
      changed: false
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
    },
    dropdaownType(val){
      console.log("dropdaownType:",val);
    }
  },

  mounted() {
    this.initData();
  },

  methods: {
    initData() {
      this.disabledLength = 0;
      const self = this;
      this.options.forEach(item => {
        if (item.disabled) {
          self.disabledLength++;
        }
      });
      if (!this.selectedArray.includes('-1') && this.selectedArray.length === this.options.length - this.disabledLength) {
        this.input = this.alltype == 0 ? this.$t('remotePatrol.all') : this.$t('overview.all');
        if (this.allSelect != 0) {
          this.selectedArray.unshift('-1');
        }
      } else if (this.selectedArray.includes('-1')) {
        this.input = this.alltype == 0 ? this.$t('remotePatrol.all') : this.$t('overview.all');
      } else {
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.alltype == 0) {
              if (item === _item.value) {
                this.input += _item.label + ',';
              }
            } else {
              if (item === _item.storeId) {
                this.input += _item.label + ',';
              }
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
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
          // if (!item.disabled) {
          this.alltype == 0 ? this.selectedArray.push(item.value) : this.selectedArray.push(item.storeId);

          // }
        });
        this.input = this.alltype == 0 ? this.$t('remotePatrol.all') : this.$t('overview.all');
        this.selectedArray.unshift('-1');
      } else {
        this.selectedArray = [];
        this.input = '';
      }
    },

    changeSelect(val) {
      this.changed = true;
      if (!val.includes('-1') && val.length === this.options.length - this.disabledLength) {
        this.input = this.alltype == 0 ? this.$t('remotePatrol.all') : this.$t('overview.all');
        this.selectedArray.unshift('-1');
      } else if (val.includes('-1') && (val.length - 1) < this.options.length) {
        this.selectedArray = this.selectedArray.filter((item) => {
          return item !== '-1';
        });
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.alltype == 0) {
              if (item === _item.value) {
                this.input += _item.label + ',';
              }
            } else {
              if (item === _item.storeId) {
                this.input += _item.label + ',';
              }
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
      } else {
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.alltype == 0) {
              if (item === _item.value) {
                this.input += _item.label + ',';
              }
            } else {
              if (item === _item.storeId) {
                this.input += _item.label + ',';
              }
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
      }
    },

    visibileHandler(val) {
      if (!val && this.changed) {
        let selectedList = [];
        selectedList = this.selectedArray;
        this.$emit('changeInput', selectedList);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .input-class{
    width: calc(100% - 30px); 
    position: absolute;
    left: 0;
    top:0;
    z-index: 100;
     text-overflow: ellipsis;
     white-space:nowrap;
     overflow:hidden;
  }
  .content{
    text-align: left;
    display: inline-block;
    position: relative;
    cursor: pointer;
    /deep/ * {
      background-color: transparent !important;
      border: none !important;
    }
  }
  .el-select-dropdown__item{
    /* padding: 0 20px 0 50px !important; */
    /*color: #7d8cad;*/
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    font-family: "iconfont" !important;
    content: '\e6a2';
    left: 20px;
    font-size: 15px;
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
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
    font-size: 15px;
    font-style: normal;
    color: #2c90d9;
    -moz-osx-font-smoothing: grayscale;
  }
  >>> .el-select__tags{
    opacity: 0;
  }
  /* >>> .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 15px;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    min-height: 28px;
    min-width: 85px;
  } */
  >>> .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
    line-height: calc(36/1920*100vw);
    height: calc(36/1920*100vw);
    min-height: 28px;
  }
  .el-select.el-select--medium{
    color: #2b2b2b;
    background-color: #f7f9fa;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    width: 100%;
    border-radius: 3px;
    min-height: 28px;
    min-width: 85px;
  }
</style>
<style>
  @import '../assets/css/pagination.css';
   .el-select-dropdown.is-multiple .el-select-dropdown__item.selected span{
      color: #7d8cad;
      font-weight: normal;
   }
  el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #FEE4E7;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
    background-color: #FEE4E7;
  }
</style>
