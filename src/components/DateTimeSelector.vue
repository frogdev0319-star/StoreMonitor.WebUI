<template>
  <div class="date-selector-container">
      <div class="time-title">{{ $t('overview.date') }}</div>
      <div class="paper shadow-light" style="display:flex; flex-direction:row;margin-left:16px;">
        <el-select class="bDateSel" v-model="dateRange" value-key="value" @change="changeDateRange">
            <el-option 
              v-for="item in dateRangeItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
        </el-select>
      <date-time-picker :dateRange="dateRange" :poper-class="date-range" :diablePick="diablePick" @change="dateChange"/>
    </div>
  </div>
</template>

<script>
import DateTimePicker from './DateTimePicker';

export default {
  name: 'DateTimeSelector',
  components: { DateTimePicker },
  data() {
    return {
      dateRangeItems:[{value:3,label:this.$t('overview.last3Days')},{value:7,label:this.$t('overview.last7Days')},
                      {value:30,label:this.$t('overview.last30Days')},{value:90,label:this.$t('overview.last90Days')},
                      {value:0,label:this.$t('overview.thisMonth')},{value:1,label:this.$t('overview.lastMonth')},
                      {value:2,label:this.$t('overview.thisQuarter')},{value:4,label:this.$t('overview.customDate')}],
      dateRange:4,
      diablePick:false
    }
  },
  methods: {
    dateChange(val) {
      this.$emit('change', val);
    },
    changeDateRange(val){
      this.dateRange = val;
      if(val!=4){
        this.diablePick = true;
      }
      //this.getDateRange();
    },
    
  }
};
</script>

<style lang="scss" scoped>
  .date-selector-container{
    display: flex;
    align-items: center;
    height: 36px;
    width: calc(378/1440*100vw);
    // background-color: #fff;
    // border-radius: 5px;
    .time-title{
      width:cacl(76/1440*100vw);
      align-self:center;
      font-size:15px;
      color:#484848
    }
    .date-range{
      width:cacl(207/1440*100vw);
    }
  }
</style>
<style>
  .bDateSel.el-select .el-input--medium .el-input__inner {
    width: calc(95/1440*100vw);
    height: 36px;
    font-size: 15px;
    text-align: left;
    border: none;
    color:#2b2b2b;
  background-color: transparent;
  }
  .bDateSel.el-select .el-input .el-select__caret {
    color: #2c90d9;
  }
  .bDateSel.el-select .el-input--medium .el-input__suffix{
    top:0px;
  }
</style>