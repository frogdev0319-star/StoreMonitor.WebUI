<template>
  <div class="content">
    <el-select
      v-model="selectedArray"
      :placeholder="placeholder"
      :disabled="disabled"
      multiple
      collapse-tags
      class="el-province"
      @change="changeSelect"
      @visible-change="visibileHandler">
      <el-option v-if="options.length > 0 && all!=''" :label="all"
                 value="-1" @click.native="selectAll"/>
      <el-option v-for="(item) in options" :key="item.value" :label="item.label"
                 :value="compareType === 'stores' ? item.storeId:item.value" :disabled="item.disabled"/>
    </el-select>
    <el-input
      v-model="input"
      placeholder=""
      readonly
      class="input-class2"/>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    compareType:{
      type: String,
    },
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
    },
    placeholder:{
      type: String,
    },
    alltype: {
      type: Number,
      default:0
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
    },
    all: {
      type: String,
      default: ''
    },
    limitNum:{
      type:Number,
      default:-1
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
    compareType(val){
      this.initData();
    },
    selected(val, oldVal) {
      console.log("selected > val:",val);
      this.selectedArray = val;
      this.initData();
    },

    options(val){
      //console.log("options > val:",val);
      this.selectedArray = [...this.selected];
      this.initData();
    },
    placeholder(val){
      //console.log("placehold:",val);
    },
    disabled(val){
      //console.log("disabled:",val);
      return val;
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
        this.input = this.all;
        if (this.allSelect != 0) {
          this.selectedArray.unshift('-1');
        }
      } else if (this.selectedArray.includes('-1')) {
        this.input = this.all;
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
    
    changeSelect(val) {
      this.changed = true;
      var emitArray = [];
      //console.log("changeSelect > val:",val);
      if (!val.includes('-1') && val.length === this.options.length - this.disabledLength) {
        this.input = this.all;
        this.selectedArray.unshift('-1');
        //console.log("1.this.selectedArray:",this.selectedArray);
      } else if (val.includes('-1') && (val.length - 1) < this.options.length) {
        this.selectedArray = this.selectedArray.filter((item) => {
          return item !== '-1';
        });
        //console.log("2.this.selectedArray:",this.selectedArray);
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.compareType == 'storeGroup' || this.compareType == 'storeType') {
              if (item === _item.value) {
                this.input += _item.label + ',';
                //console.log("this.input:",this.input);
                if(_item.storeIds.length>0)
                {
                  emitArray = emitArray.concat(_item.storeIds);
                }
                //console.log("emitArray:",emitArray);
                //emitArray = this.selectedArray;
              }
            }else {
              if (item === _item.value) {
                this.input += _item.label + ',';
              }
              emitArray = this.selectedArray;
            }
          });
        });
       // this.input = this.input.slice(0, this.input.length - 1);
        /*const params = {selectedArray:this.selectedArray,storeIds:emitArray,selectedLabels:(this.input==""?[]:this.input.split(','))};
        this.$emit('changeInput', params);*/
      } else {
        this.input = '';
        //console.log("3.this.selectedArray:",this.selectedArray);
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.compareType == 'storeGroup' || this.compareType == 'storeType') {
              if (item === _item.value) {
                this.input += _item.label + ',';
                //console.log("_item.contents:",_item.storeIds);
                if(_item.storeIds.length>0)
                {
                  emitArray = emitArray.concat(_item.storeIds);
                }
                //console.log("emitArray:",emitArray);
                //emitArray = this.selectedArray;
              }
            }else {
              if (item === _item.value) {
                this.input += _item.label + ',';
              }
              emitArray = this.selectedArray;
            }
          });
        });
        //this.input = this.input.slice(0, this.input.length - 1);
        /*console.log("**input:",this.input);
        const params = {selectedArray:this.selectedArray,storeIds:emitArray,selectedLabels:(this.input==""?[]:this.input.split(','))};
        this.$emit('changeInput', params);*/
      }
      
    },
    visibileHandler(val) {
      if (!val && this.changed) {
        //console.log("visibileHandler");
        let selectedList = [];
        let emitStoreIds = [];
        let emitArray = [];
      //console.log("4.this.selectedArray:",this.selectedArray);
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.compareType == 'storeGroup' || this.compareType == 'storeType') {
              if (item === _item.value) {
                //console.log("_item.contents:",_item.storeIds);
                if(_item.storeIds.length>0)
                {
                  emitStoreIds = emitStoreIds.concat(_item.storeIds);
                }
                //console.log("emitStoreIds:",emitStoreIds);
              }
            }else {
              emitStoreIds = this.selectedArray;
            }
          });
        });
        selectedList = this.selectedArray;
        const params = {selectedArray:selectedList,storeIds:emitStoreIds,selectedLabels:(this.input==""?[]:this.input.split(','))};
        this.$emit('changeInput', params);
        this.changed = false;
      }
    },
    selectAll() {
      //console.log("selectAll");
      if (this.selectedArray.length < this.options.length - this.disabledLength) {
        this.selectedArray = [];
        this.options.forEach((item) => {
          if (!item.disabled) {
            this.selectedArray.push(this.compareType === 'stores' ? item.storeId:item.value);
          }
        });
        this.input = this.all;
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (item === _item.value) {
              this.input += _item.label + ',';
            }
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
        this.selectedArray.unshift('-1');
      } else {
        this.selectedArray = [];
        this.input = '';
      }
    },
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
    /*top: calc(2/1920*100vw);*/
    width: 100%;
    margin-right: calc(15/1920*100vw);
  }
  .el-select-dropdown__item{
    padding: 0 20px 0 50px !important;
    /*color: #7d8cad;*/
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    font-family: "iconfont" !important;
    content: '\e6a2';
    left: 20px;
    font-size: 14px;
    color: #2c90d9;
    font-style: normal;
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
    font-size: 14px;
    color: #2c90d9;
    font-style: normal;
    -moz-osx-font-smoothing: grayscale;
  }
  .input-class2{
    height:35px;
    background-color:#ff0;
    width: calc(100% - 30px);
    position: absolute;
    top: 0;
    left: 0;
  }
  >>> .el-select__tags{
    opacity: 0;
  }
  .el-province >>> .el-input--mini .el-input__inner{
    height: 28px;
    line-height: 27px;
    border-radius: 0 !important;
  }
  >>> .input-class2.el-input--medium .el-input__inner{
    height: 35px;
    line-height: 28px;
    border: none;
    color: #2b2b2b;
    background: #f7f9f9;
    padding: 0 10px;
    font-size: 12px;
    min-height: 28px;
    min-width: 55px;
    text-overflow: ellipsis;
  }
  >>> .input-class2.el-input--mini .el-input__inner{
    height: 35px;
    line-height: 28px;
    border: none;
    color: #2b2b2b;
    background: #f7f9f9 ;
    padding: 0 10px;
    font-size: 13px;
  }
  >>> .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 13px;
    height: 36px;
    line-height: 36px;
    bottom: calc(2/1920*100vw);
    min-height: 28px;
    min-width: 85px;
  }
  >>> .el-select.el-select--mini .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 13px;
    height: 35px;
    line-height: 36px;
  }
  >>> .el-select.el-select--mini .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
    line-height: 36px;
    height: 36px;
  }
  .el-province >>> .el-input--mini .el-input__icon {
    line-height: 36px;
    height: 36px;
  }
  .el-select.el-select--medium{
    color: #7d8cad;
    background-color: #f7f9f9 !important;
    height: 35px;
    line-height: 28px;
    border: none !important;
    width: 100%;
    border-radius: 3px;
    min-height: 28px;
    min-width: 85px;
  }
  .el-select.el-select--mini{
    color: #fff;
    background: #f7f9f9 !important;
    height: 35px;
    line-height: 28px;
    width: 100%;
    border-radius: 0;
  }
</style>
<style>
  @import '../assets/css/pagination.css';
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected span{
    color: #7d8cad;
    font-weight: normal;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
    background-color: #FEE4E7;
  }
</style>
