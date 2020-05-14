<template>
  <div>
    <div class="block">
      <el-slider
        v-model="value"
        range
        :marks="marks"
        :max="86400"
      >
      </el-slider>
    </div>
    <div ref="ranger"></div>
  </div>
</template>

<script>
  export default {
    name: 'MultiRange',
    props: {
      timeArray:{
        type: Array,
        default: []
      }
    },
    data () {
      return {
        slider: null,
        value: [],
        computeTimeArray: []
      }
    },
    computed: {
      marks () {
        let obj = {}
        for (let i = 0; i <= 24; i++) {
          let a = i * 3600
          obj[a] = `${i}:00`
        }
        return obj
      },
    },
    watch:{
      timeArray:{
        immediate: true,
        handler(val){
          console.log('变化')
          this.computeTimeArray = val
        }
      }
    },
    methods: {
      addSlider () {
        let Multirangeslider = require('multirangeslider')
        this.slider = new Multirangeslider({
          min: 0,
          max: 86400, // every option is written here in hours
          step: 1800, // but slider stores minutes inside
          minWidth: 1800
        })
        let yourElement = this.$refs.ranger
        yourElement.appendChild(this.slider.el)
        this.computeTimeArray.forEach(item=>{
          this.slider.add(item)
        })
        this.slider.on('change', this.changeSlider)
      },
      changeSlider(){
        let timeArray = this.slider.data();
        this.$emit('getTimeArray', timeArray)
      },
    },
    mounted () {
      this.addSlider()
    }
  }
</script>

<style scoped>

</style>

<style>
  @import "../../node_modules/multirangeslider/dist/multirangeslider.css";
  .multirangeslider-bar {
    height: 15px;
    width: 100%;
    display: block;
    background: #f4f5f9;
    position: relative;
    box-sizing: border-box;
    border: 1px solid #e3e9f4 !important;
  }
  .multirangeslider-label{
    display: none;
    line-height: 15px;
  }
  .el-slider__runway{
    height: 0;
  }
  .el-slider__marks-text{
    margin-top: -40px;
    position: absolute;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    font-size: 14px;
    color: #909399;
  }
  .el-slider__marks-text:nth-child(2n){
    display: none;
  }
  .el-slider__button-wrapper{
    display: none;
  }
  .el-slider__stop{
    border-radius: 0;
    transform: translate(-50%, -50%);
    height: 6px;
    width: 1px;
    background-color: #909399 ;
  }
  .multirangeslider-bar .multirangeslider-label{
    height: 15px;
  }
  .multirangeslider-bar .multirangeslider-range{
    background-color: #f31d65;
    opacity: 0.9;
  }
  .multirangeslider-bar .multirangeslider-range .multirangeslider-left-handler, .multirangeslider-bar .multirangeslider-range .multirangeslider-right-handler{
    background-color: #f31d65;
  }
</style>
