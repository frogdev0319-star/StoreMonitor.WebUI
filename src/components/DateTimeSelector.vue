<template>
  <div class="date-selector-container">
    <div class="time-title" style="width:76px;align-self:center;font-size:15px;color:#484848">{{$t('overview.date')}}</div>
    <div class="date-range">
        <el-select class="bDateSel" v-model="dateRange" value-key="value" @change="changeDateRange">
            <el-option 
              v-for="item in dateRangeItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
        </el-select>
      <div style="width:0px;height:25px;border:1px solid #556679; opacity:0.2;" />     
      <date-time-picker :dateRange="dateRange" @change="dateChange"/>
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
    }
  },
  methods: {
    dateChange(val) {
      this.$emit('change', val);
    },
    changeDateRange(val){
      this.dateRange = val;
      //this.getDateRange();
    },
    
  }
};
</script>

<style lang="scss" scoped>
  .date-selector-container{
    display:flex;
    flex-direction:row;
    position: relative;
    text-align: left;
    width: calc(500/1440*100vw);;
    height: 36px;
    min-height: 28px;
    line-height: 36px;
    align-items:center;
    justify-content:space-between;

    .time-title{
      width:cacl(76/1440*100vw);
      align-self:center;
      font-size:15px;
      color:#484848
    }
    .date-range{
      display:flex;
      flex-direction:row;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      background-color: #fff;
      width: calc(432/1440*100vw);
      height:36px;
      align-items:center;
    }
    .el-select{
    ::v-deep .el-input--medium{
      border:none;
    }
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
    background-color: #fff !important;
    color:#2b2b2b;
  }
  .bDateSel.el-select .el-input .el-select__caret {
    color: #2c90d9;
  }
  .bDateSel.el-select .el-input--medium .el-input__suffix{
    top:0px;
  }
</style>