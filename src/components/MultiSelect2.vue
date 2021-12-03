<template>
  <div class="muti-select-content">
    <el-select
      v-model="selectedArray"
      :placeholder="placeholder"
      :disabled="disabled"
      multiple
      :taggable="false"
      class="dropdown-select" 
      clearOnSelect="false"
      @change="changeSelect"
      @visible-change="visibileHandler">
      <el-option v-for="(item, index) in options" :key="index" :label="item.label"
                 :value="compareType === 'stores' ? item.storeId:item.value" :disabled="item.disabled"/>
    </el-select>
    <el-input
      v-model="input"
      placeholder=""
      readonly
      class="input-class"/>
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
    compareType(val){
      this.initData();
    },
    selected(val, oldVal) {
      console.log("selected > val:",val);
      this.selectedArray = (val.length>2)?val.slice(0,1):val;
      this.initData();
    },

    options(val){
      console.log("options > val:",val);
      this.selectedArray = [...this.selected];
      this.initData();
    },
    placeholder(val){
      console.log("placehold:",val);
    },
    disabled(val){
      console.log("disabled:",val);
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
      //console.log("this.alltype:",this.alltype);
      //console.log("this.selectedArray:",this.selectedArray);
      /*if (!this.selectedArray.includes('-1') && this.selectedArray.length === this.options.length - this.disabledLength) {
        this.input = this.alltype == 0 ? this.$t('remotePatrol.all') : this.$t('overview.all');
        if (this.allSelect != 0) {
          this.selectedArray.unshift('-1');
        }
      } else if (this.selectedArray.includes('-1')) {
        this.input = this.alltype == 0 ? this.$t('remotePatrol.all') : this.$t('overview.all');
      } else {*/
        this.input = '';
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            
              if (item === _item.storeId || item==_item.value) {
                this.input += _item.label + ',';
              }
            
          });
        });
        this.input = this.input.slice(0, this.input.length - 1);
        //console.log("3.this.selectedArray:",this.selectedArray);
      
      if (this.options.length === 0) {
        this.input = '';
        this.selectedArray = [];
      }
    },

    changeSelect(val) {
      this.changed = true;
      
      if(this.selectedArray.length>2){ //只能選兩個
          val.pop();
      }
        this.input = '';
        console.log("!!changeSelect:",val);
        var emitArray=[];
        this.selectedArray.forEach(item => {
          this.options.forEach(_item => {
            if (this.compareType == 'area1' || this.compareType == 'area2') {
              if (item === _item.value) {
                this.input += _item.label + ',';
              }
              emitArray = this.selectedArray;
            } else if (this.compareType == 'storeGroup' || this.compareType == 'storeType') {
              if (item === _item.value) {
                this.input += _item.label + ',';
                /*console.log("_item.contents:",_item.storeIds);
                if(_item.storeIds.length>0)
                {emitArray = emitArray.concat(_item.storeIds);}
                console.log("emitArray:",emitArray);*/
                emitArray = this.selectedArray;
              }
            }else {
              if (item === _item.storeId) {
                this.input += _item.label + ',';
              }
              emitArray = this.selectedArray;
            }
          });
        });
      this.input = this.input.slice(0, this.input.length - 1);
      console.log("this.selectedArray:",this.selectedArray);
      const params = {selectedArray:this.selectedArray,storeIds:emitArray,selectedLabels:(this.input==""?[]:this.input.split(','))};
      this.$emit('changeInput', params);
    },

    visibileHandler(val) {
      if (!val && this.changed) {
        let selectedList = [];
        selectedList = this.selectedArray;
        //this.$emit('changeInput', selectedList);
        this.changed = false;
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
  .muti-select-content{
    text-align: left;
    display: inline-block;
    position: relative;
    width: calc(160/1920*100vw);
    height: 25px;
    margin-left:16px;
  }
  .dropdown-select{
            width:134px;
            height:25px;
            border:1px solid #f7f9fa;
            color: #2b2b2b;
            align-self: center;
            align-items: center;
            margin-left:7px;
        }
  .el-select-dropdown.is-multiple .el-select-dropdown__item span{
    
      left:20px;
    
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    font-family: "iconfont" !important;
    content: '\e6a2';
    left: 10px;
    font-size: 13px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item::after{
    font-family: "iconfont" !important;
    position: absolute;
    left: 10px;
    content: "\e64a";
    font-weight: normal;
    -webkit-font-smoothing: antialiased;
    font-size: 13px;
    font-style: normal;
    -moz-osx-font-smoothing: grayscale;
  }
  .input-class{
    width: 132px;
    position: absolute;
    left: 0;
  }
  >>> .el-select__tags{
    opacity: 0;
  }
  >>> .input-class.el-input--medium .el-input__inner{
    height: 35px;
    line-height: 35px;
    color: #2b2b2b;
    background-color: #f7f9f9 !important;
    border:none;
    padding: 0 10px;
    font-size: 13px;
    min-width: 55px;
    min-height: 28px;
    text-overflow: ellipsis;
  }
  >>> .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 13px;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    bottom: calc(2/1920*100vw);
    min-height: 28px;
    min-width: 85px;
  }
  >>> .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  >>> .el-input--medium .el-input__icon {
    height: 30px;
    min-height: 28px;
  }
  .el-select.el-select--medium{
    color: #2b2b2b;
    background: #f7f9f9 !important;
    height: 35px;
    line-height: 35px;
    border: none !important;
    width: 141px;
    min-height: 35px;
    min-width: 85px;
  }
  
</style>
<style>
  @import '../assets/css/pagination.css';
    .el-select-dropdown.is-multiple .el-select-dropdown__item span{
        padding-left:30px;
    }
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
