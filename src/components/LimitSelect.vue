<template>
  <div class="content">
    <el-select multiple collapse-tags v-model='selectedArray' @change='changeSelect' placeholder='请选择' @visible-change="visibileHandler" class="el-province">
      <el-option v-for='(item, index) in options' :key='index' :label='item.label' :value='item.value' :disabled="item.disabled"></el-option>
    </el-select>
    <el-input placeholder="" readonly
              v-model="input" class="input-class">
    </el-input>
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
      }
    },
    watch: {
      selected(val, oldVal){
        this.selectedArray = val
        this.initData()
      }
    },
    data () {
      return {
        selectedArray: this.selected,
        input: '',
        disabledLength: 0,
        changed: false
      }
    },
    mounted () {
      this.disabledLength = 0
      let self = this
      this.options.forEach(item => {
        if (item.disabled !== undefined && item.disabled) {
          self.disabledLength++
        }
      })
      this.input = ''
      this.options.forEach(_item => {
        this.selectedArray.forEach(item => {
          if (item === _item.value) {
            this.input += _item.label + ','
          }
        })
      })
      this.input = this.input.slice(0, this.input.length - 1)
      if (this.selectedArray.length === 1) {
        self.options.forEach(item => {
          if (item.value === this.selectedArray[0]) {
            item.disabled = true
          }
        })
      }
    },
    methods: {
      initData () {
        this.disabledLength = 0
        let self = this
        this.options.forEach(item => {
          if (item.disabled !== undefined && item.disabled) {
            self.disabledLength++
          }
        })
        this.input = ''
        this.options.forEach(_item => {
          this.selectedArray.forEach(item => {
            if (item === _item.value) {
              this.input += _item.label + ','
            }
          })
        })
        this.input = this.input.slice(0, this.input.length - 1)
        if (this.selectedArray.length === 1) {
          self.options.forEach(item => {
            if (item.value === this.selectedArray[0]) {
              item.disabled = true
            }
          })
        }
      },
      changeSelect (val) {
        console.log(val)
        let self = this
        self.changed = true;
        while (val.length > this.limit) {
          val.shift()
        }
        self.input = ''
        self.options.forEach(_item => {
          self.selectedArray.forEach(item => {
            if (item === _item.value) {
              this.input += _item.label + ','
            }
          })
        })
        self.input = this.input.slice(0, this.input.length - 1)
        if (self.selectedArray.length === 1) {
          self.options.forEach(item => {
            if (item.value === this.selectedArray[0]) {
              item.disabled = true
            }
          })
        }
        else{
          self.options.forEach(item => {
              item.disabled = false
          })
        }
      },
      visibileHandler (val) {
        if (!val && this.changed) {
          let selectedList = []
          selectedList = this.selectedArray
          this.$emit('changeInput', selectedList)
        }
      }
    }
  }
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
    top: calc(2/1920*100vw);
    width: calc(160/1920*100vw);
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
    font-style: normal;
    -moz-osx-font-smoothing: grayscale;
  }
  .input-class{
    width: calc(160/1920*100vw - 30px);
    position: absolute;
    left: 0;
  }
  /deep/ .el-select__tags{
    opacity: 0;
  }
  /deep/ .input-class.el-input--medium .el-input__inner{
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: 1px solid #E4E7ED;
    border-right: none;
    color: #7d8cad;
    background: #f4f5f9 !important;
    padding: 0 10px;
    font-size: 12px;
  }
  /deep/ .el-select.el-select--medium .el-input .el-input__inner{
    position: relative;
    z-index: 1;
    background: transparent !important;
    border: none;
    font-size: 12px;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    bottom: calc(2/1920*100vw);
  }
  /deep/ .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  /deep/ .el-input--medium .el-input__icon {
    line-height: calc(36/1920*100vw);
    height: calc(36/1920*100vw);
  }
  .el-select.el-select--medium{
    color: #7d8cad;
    background: #f4f5f9 !important;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: 1px solid #E4E7ED !important;
    width: calc(160/1920*100vw);
    border-radius: 3px;
  }

</style>
<style>
  @import '../assets/css/pagination.css';
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected span{
    color: #7d8cad;
  }
</style>
