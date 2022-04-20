<template>
  <div class="date-selector-container">
      <div class="time-title">{{ $t('overview.date') }}</div>
      <div class="paper shadow-light" style="display:flex; flex-direction:row;">
        <el-select class="bDateSel" v-model="dateRange" value-key="value" @change="changeDateRange">
            <el-option 
              v-for="item in dateRangeItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
        </el-select>
      <date-time-picker 
        :dateRange="dateRange" 
        :poper-class="date-range" 
        :diablePick="diablePick" 
        :dateTimeValue="dateTimeValue"
        :showTooltips="showTooltips"
        @change="dateChange"/>
    </div>
    <el-tooltip
      v-if="showTooltips"
      class="date-time-tooltip"
      effect="light"
      placement="right">
      <div slot="content">{{ $t('overview.dataRangeTips') }}</div>
      <i class="iconfont icon-bangzhu iconbangzhu"/>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DateTimePicker from './DateTimePicker';

export default {
  name: 'DateTimeSelector',
  components: { DateTimePicker },
  props:{
    dateTimeValue:{
      type: Array,
      default:()=>{return [];}
    },
    showTooltips:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      dateRangeItems:[{value:3,label:this.$t('overview.last3Days')},{value:7,label:this.$t('overview.last7Days')},
                      {value:30,label:this.$t('overview.last30Days')},{value:90,label:this.$t('overview.last90Days')},
                      {value:0,label:this.$t('overview.thisMonth')},{value:1,label:this.$t('overview.lastMonth')},
                      {value:2,label:this.$t('overview.thisQuarter')},{value:4,label:this.$t('overview.customDate')}],
      dateRangevalue:-1,
      diablePick:false,

    }
  },
  computed:{
    ...mapGetters({ accountChanged: 'accountChanged' }),
    dateRange:{
      get(){return this.dateRangevalue;},
      set(val){
        //console.log("dateRange computed val:",val);
        if(val!=-1)this.changeDateRange(val);}
    }
  },
  watch:{
    async accountChanged(val) {
      if (val !== 0) {
        this.dateRange = 4;
        this.dateTimeValue = [this.$moment().subtract(29, 'days'), this.$moment()];
      }
    },
  },
  mounted() {
    this.dateRangevalue = 4;
    this.getDefaultTimeList();
  },
  created(){
    if(this.dateTimeValue==[]){
      this.dateTimeValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
    }
  },
  activated(){
      //console.log('dateRange activated');
      this.dateRange = 4;
  },
  deactivated(){
      //console.log('dateRange deactivated');
      this.dateRange = -1;
  },
  methods: {
    getDefaultTimeList() {
      //console.log("2.dateTimeValue:",this.dateTimeValue);
      if(this.dateTimeValue.length==0){
        this.dateTimeValue = [this.$moment().subtract(29, 'days'), this.$moment()];
      //this.dateTimeValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      }
      //this.dateTimeValue = [this.$moment().subtract(29, 'days'), this.$moment()];
    },
    dateChange(val) {
      this.$emit('change', val);
    },
    changeDateRange(val){
      this.dateRangevalue = val;
      if(val!=4){
        this.diablePick = true;
      }else{
        this.diablePick = false;
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
    width: calc(402/1440*100vw);
    // background-color: #fff;
    // border-radius: 5px;
    .time-title{
      width:calc(76/1440*100vw);
      align-self:center;
      font-size:15px;
      color:#484848;
      text-align:left;
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