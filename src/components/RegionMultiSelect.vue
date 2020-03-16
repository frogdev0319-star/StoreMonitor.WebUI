<template>
  <div class="content">
    <el-select multiple collapse-tags v-model='selectedArray' @change='changeSelect' @visible-change="visibileHandler"
               :placeholder="placeHolder" class="el-province" :disabled="disabled">
      <el-option :label="$t('overview.all')" value='-1' @click.native='selectAll' v-if="options.length > 0"></el-option>
      <el-option v-for='(item, index) in options' :key='index' :label='item.label' :value='item.value' :disabled="item.disabled"></el-option>
    </el-select>
    <el-input placeholder="" readonly
              v-model="input" class="input-class">
    </el-input>
  </div>
</template>

<script>
  export default {
    name: "RegionMultiSelect",
    props: {
      options: {
        type: Array,
        default: () => []
      },
      selected: {
        type: Array
      },
      placeholder:{
        type: String
      },
      disabled:{
        type: Boolean
      }
    },

    data () {
      return {
        input: '',
        disabledLength: 0,
        placeHolder: this.placeholder,
        selectedArray: this.selected,
        changed: false
      }
    },
    watch:{
      selected(val, oldVal){
        this.selectedArray = val
        this.initData()
      }
    },
    mounted () {
      console.log(this.selected)
      this.initData();
    },
    methods: {
      initData(){
        this.disabledLength = 0
        let self = this;
        this.options.forEach(item => {
          if (item.disabled) {
            self.disabledLength++
          }
        })
        if (!this.selectedArray.includes('-1') && this.selectedArray.length === this.options.length - this.disabledLength) {
          this.input = this.$t('overview.all')
          this.selectedArray.unshift('-1')
        } else {
          this.input = ''
          this.selectedArray.forEach(item => {
            this.options.forEach(_item => {
              if (item === _item.value) {
                this.input += _item.label + ','
              }
            })
          })
          this.input = this.input.slice(0, this.input.length - 1)
        }
        if(this.options.length === 0){
          this.input = ''
          this.selectedArray = []
        }
      },
      selectAll () {
        if (this.selectedArray.length < this.options.length - this.disabledLength) {
          this.selectedArray = []
          this.options.forEach((item) => {
            // if (!item.disabled) {
            this.selectedArray.push(item.value)
            // }
          })
          this.input = this.$t('overview.all')
          this.selectedArray.unshift('-1')
        } else {
          this.selectedArray = []
          this.input = ''
        }
      },
      changeSelect (val) {
        console.log(val)
        this.changed = true;
        if (!val.includes('-1') && val.length === this.options.length - this.disabledLength) {
          this.input = this.$t('overview.all')
          this.selectedArray.unshift('-1')
        } else if (val.includes('-1') && (val.length - 1) < this.options.length) {
          this.selectedArray = this.selectedArray.filter((item) => {
            return item !== '-1'
          })
          this.input = ''
          this.selectedArray.forEach(item => {
            this.options.forEach(_item => {
              if (item === _item.value) {
                this.input += _item.label + ','
              }
            })
          })
          this.input = this.input.slice(0, this.input.length - 1)
        } else {
          this.input = ''
          this.selectedArray.forEach(item => {
            this.options.forEach(_item => {
              if (item === _item.value) {
                this.input += _item.label + ','
              }
            })
          })
          this.input = this.input.slice(0, this.input.length - 1)
        }
      },
      visibileHandler (val) {
        if(!val && this.changed){
          let selectedList = []
          // if (this.selectedArray.includes('-1')) {
          //   this.options.forEach(item =>{
          //     selectedList.push(item.value)
          //   })
          // } else {
          //   selectedList = this.selectedArray
          // }
          selectedList = this.selectedArray
          console.log(selectedList)
          this.$emit('changeInput', selectedList)
        }
      }
    }
  }
</script>

<!--<style scoped>-->
  <!--*{-->
    <!--padding: 0;-->
    <!--margin: 0;-->
    <!--box-sizing: border-box;-->
  <!--}-->
  <!--.content{-->
    <!--text-align: left;-->
    <!--display: inline-block;-->
    <!--position: relative;-->
    <!--top: calc(2/1920*100vw);-->
    <!--width: calc(160/1920*100vw);-->
    <!--margin-right: calc(15/1920*100vw);-->

  <!--}-->
  <!--.el-select-dropdown__item{-->
    <!--padding: 0 20px 0 50px !important;-->
    <!--/*color: #7d8cad;*/-->
  <!--}-->
  <!--.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{-->
    <!--font-family: "iconfont" !important;-->
    <!--content: '\e6a2';-->
    <!--left: 20px;-->
    <!--font-size: 14px;-->
    <!--font-style: normal;-->
    <!-- -webkit-font-smoothing: antialiased;-->
    <!-- -moz-osx-font-smoothing: grayscale;-->
  <!--}-->
  <!--.el-select-dropdown.is-multiple .el-select-dropdown__item::after{-->
    <!--font-family: "iconfont" !important;-->
    <!--position: absolute;-->
    <!--left: 20px;-->
    <!--content: "\e64a";-->
    <!--font-weight: 700;-->
    <!-- -webkit-font-smoothing: antialiased;-->
    <!--font-size: 14px;-->
    <!--font-style: normal;-->
    <!-- -moz-osx-font-smoothing: grayscale;-->
  <!--}-->
  <!--.input-class{-->
    <!--width: calc(160/1920*100vw - 30px);-->
    <!--position: absolute;-->
    <!--left: 0;-->
  <!--}-->
  <!--/deep/ .el-select__tags{-->
    <!--opacity: 0;-->
  <!--}-->
  <!--/deep/ .input-class.el-input&#45;&#45;medium .el-input__inner{-->
    <!--height: calc(36/1920*100vw);-->
    <!--line-height: calc(36/1920*100vw);-->
    <!--border: none;-->
    <!--color: #7d8cad;-->
    <!--background: #f4f5f9 !important;-->
    <!--padding: 0 10px;-->
    <!--font-size: 12px;-->
    <!--min-height: 28px;-->
    <!--min-width: 55px;-->
  <!--}-->
  <!--/deep/ .el-select.el-select&#45;&#45;medium .el-input .el-input__inner{-->
    <!--position: relative;-->
    <!--z-index: 1;-->
    <!--background: transparent !important;-->
    <!--border: none;-->
    <!--font-size: 12px;-->
    <!--height: calc(36/1920*100vw);-->
    <!--line-height: calc(36/1920*100vw);-->
    <!--bottom: calc(2/1920*100vw);-->
  <!--}-->
  <!--/deep/ .el-select.el-select&#45;&#45;mini .el-input .el-input__inner{-->
    <!--position: relative;-->
    <!--z-index: 1;-->
    <!--background: transparent !important;-->
    <!--border: none;-->
    <!--font-size: 12px;-->
    <!--height: calc(36/1920*100vw);-->
    <!--line-height: calc(36/1920*100vw);-->
    <!--bottom: calc(2/1920*100vw);-->
  <!--}-->
  <!--/deep/ .el-select.el-select&#45;&#45;medium .el-input .el-input__suffix-inner{-->
    <!--position: relative;-->
    <!--z-index: 1;-->
  <!--}-->
  <!--/deep/ .el-select.el-select&#45;&#45;mini .el-input .el-input__suffix-inner{-->
    <!--position: relative;-->
    <!--z-index: 1;-->
  <!--}-->
  <!--/deep/ .el-input&#45;&#45;medium .el-input__icon {-->
    <!--line-height: calc(36/1920*100vw);-->
    <!--height: calc(36/1920*100vw);-->
  <!--}-->
  <!--.el-select.el-select&#45;&#45;medium{-->
    <!--color: #7d8cad;-->
    <!--background: #f4f5f9 !important;-->
    <!--height: calc(36/1920*100vw);-->
    <!--line-height: calc(36/1920*100vw);-->
    <!--border: 1px solid #E4E7ED !important;-->
    <!--width: calc(160/1920*100vw);-->
    <!--border-radius: 3px;-->
    <!--min-width: 85px;-->
    <!--min-height: 28px;-->
  <!--}-->
  <!--.el-select.el-select&#45;&#45;mini{-->
    <!--color: #7d8cad;-->
    <!--background: #f4f5f9 !important;-->
    <!--height: calc(36/1920*100vw);-->
    <!--line-height: calc(36/1920*100vw);-->
    <!--border: 1px solid #E4E7ED !important;-->
    <!--width: calc(160/1920*100vw);-->
    <!--border-radius: 3px;-->
  <!--}-->
<!--</style>-->
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
    margin-right: calc(30/1920*100vw);
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
    min-width: 55px;
    min-height: 28px;
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
    min-height: 28px;
    min-width: 85px;
  }
  @media screen and (max-width: 1560px) and (min-width: 1280px){
    /deep/ .el-select.el-select--medium .el-input .el-input__inner{
      width: 85px;
    }
  }
  /deep/ .el-select.el-select--medium .el-input .el-input__suffix-inner{
    position: relative;
    z-index: 1;
  }
  /deep/ .el-input--medium .el-input__icon {
    line-height: calc(36/1920*100vw);
    height: calc(36/1920*100vw);
    min-height: 28px;
  }
  .el-select.el-select--medium{
    color: #7d8cad;
    background: #f4f5f9 !important;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    border: 1px solid #E4E7ED !important;
    width: calc(160/1920*100vw);
    border-radius: 3px;
    min-height: 28px;
    min-width: 85px;
  }
  @media screen and (max-width: 1560px) and (min-width: 1280px){
    .el-select.el-select--medium{
      width: 85px;
    }
  }

</style>

<style>
  @import '../assets/css/pagination.css';
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected span{
    color: #7d8cad;
  }
</style>
