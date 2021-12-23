<template>
  <div class="content">
    <el-select
      v-model="selectedArray"
      :size="inputSize"
      :placeholder="placeholder"
      :multiple-limit="selectLimit"
      multiple
      collapse-tags
      clearOnSelect="false"
      @change="changeSelect"
      @visible-change="visibileHandler">
      <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"/>
    </el-select>
    <el-input
      :size="inputSize"
      v-model="input"
      placeholder=""
      readonly
      class="input-class"/>
  </div>
</template>

<script>
export default {
  name: 'LimitSelect',

  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array
    },
    limit: {
      type: Number,
      default: 0
    },
    inputSize: {
      type: String,
      default: 'medium'
    },
    placeholder: {
      type: String
    },
    selectLimit: {
      type: Number,
      default: 0
    },
    compareType:{
      type: String,
    },
  },

  data() {
    return {
      selectedArray: this.selected,
      input: '',
      disabledLength: 0,
      changed: false
    };
  },

  watch: {
    selected(val, oldVal) {
      console.log("selected > val:",val);
      this.selectedArray = val;
      this.initData();
    },
  },

  mounted() {
    this.disabledLength = 0;
    const self = this;
    this.options.forEach(item => {
      if (item.disabled !== undefined && item.disabled) {
        self.disabledLength++;
      }
    });
    this.input = '';
      console.log("this.limit:",this.limit)
      for(var i=0; i<this.limit;i++){
        this.selectedArray.push(this.options[i].value);
        this.input += this.options[i].label + ',';
      }
    /*this.options.forEach(_item => {
      this.selectedArray.forEach(item => {
        if (item === _item.value) {
          this.input += _item.label + ',';
        }
      });
    });*/
    this.input = this.input.slice(0, this.input.length - 1);
    if (this.limit > 0) {
      if (this.selectedArray.length === 1) {
        self.options.forEach(item => {
          if (item.value === this.selectedArray[0]) {
            item.disabled = true;
          }
        });
      }
    }
  },

  methods: {
    initData() {
      this.disabledLength = 0;
      const self = this;
      this.options.forEach(item => {
        if (item.disabled !== undefined && item.disabled) {
          self.disabledLength++;
        }
      });
      this.input = '';
      console.log("this.limit:",this.limit)
      /*for(var i=0; i<this.limit;i++){
        this.selectedArray.push(this.options[i]);
        this.input += this.options[i].label + ',';
      }*/
      this.options.forEach(_item => {
        this.selectedArray.forEach(item => {
          if (item === _item.value) {
            this.input += _item.label + ',';
          }
        });
      });
      this.input = this.input.slice(0, this.input.length - 1);
      if (this.limit > 0) {
        if (this.selectedArray.length === 1) {
          self.options.forEach(item => {
            if (item.value === this.selectedArray[0]) {
              item.disabled = true;
            }
          });
        } else {
          self.options.forEach(item => {
            item.disabled = false;
          });
        }
      }
    },

    changeSelect(val) {
      console.log("changeSelect:",val);
      const self = this;
      self.changed = true;
      if (this.limit > 0) {
        while (val.length > this.limit) {
          val.shift();
        }
      }
      self.input = '';
      self.options.forEach(_item => {
        self.selectedArray.forEach(item => {
          if (item === _item.value) {
            self.input += _item.label + ',';
          }
        });
      });
      console.log("input:",self.input);
      self.input = self.input.slice(0, this.input.length - 1);
      if (this.limit > 0) {
        if (this.selectedArray.length === 1) {
          self.options.forEach(item => {
            if (item.value === this.selectedArray[0]) {
              item.disabled = true;
            }
          });
        } else {
          self.options.forEach(item => {
            item.disabled = false;
          });
        }
      } else {
        self.options.forEach(item => {
          item.disabled = false;
        });
      }
      //console.log("this.selectedArray:",this.selectedArray);
      
    },

    visibileHandler(val) {
      console.log("visibileHandler",val);
      console.log("visibileHandler",this.changed);
      const self = this;
      if (!val && this.changed) {
        let selectedList = [];
        selectedList = this.selectedArray;
        var emitArray = [];
        self.options.forEach(_item => {
          self.selectedArray.forEach(item => {
            if (item === _item.value) {
              console.log("*item:",item);
              if (self.compareType == 'storeGroup' || self.compareType == 'storeType') {
                  console.log("_item.contents:",_item.storeIds);
                  if(_item.storeIds.length>0)
                  {emitArray = emitArray.concat(_item.storeIds);}
                  console.log("emitArray:",emitArray);
                  //emitArray = this.selectedArray;
              }else {
                emitArray.push(item);
              }
            }
          });
        });
        const params = {selectedArray:selectedList,storeIds:emitArray,selectedLabels:(self.input==""?[]:self.input.split(','))};
        console.log("params",params);
        this.$emit('changeInput', params);
        this.changed = false;
      }
    },

    clickSelect() {
      console.log("clickSelect");
      this.$emit('changeIfSelect');
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
  .input-class{
    height:35px;
    width: calc(160/1920*100vw - 30px);
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
  >>> .input-class.el-input--medium .el-input__inner{
    height: calc(38/1920*100vw);
    line-height: calc(28/1920*100vw);
    border: none;
    color: #2b2b2b;
    background: #f7f9f9;
    padding: 0 10px;
    font-size: 12px;
    min-height: 28px;
    min-width: 55px;
  }
  >>> .input-class.el-input--mini .el-input__inner{
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
    height: calc(35/1920*100vw);
    line-height: calc(35/1920*100vw);
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
    line-height: 28px;
  }
  >>> .el-select.el-select--mini .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
    line-height: calc(35/1920*100vw);
    height: calc(35/1920*100vw);
  }
  .el-province >>> .el-input--mini .el-input__icon {
    line-height: 28px;
    height: 28px;
  }
  .el-select.el-select--medium{
    color: #7d8cad;
    background: #f4f5f9 !important;
    height: calc(35/1920*100vw);
    line-height: calc(35/1920*100vw);
    border: 1px solid #E4E7ED !important;
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
