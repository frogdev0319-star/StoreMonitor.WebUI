<template>
  <div class="date-selector-container" :style="{'width':getLangStyleValue(contentWidth)}">
      <div class="time-title">{{ dateRangeTitle }}</div>
      <div class="paper shadow-light" style="display:flex; flex-direction:row;">
        <el-select class="bDateSel" 
          :class="getLangStyleValue(selecClass)" 
          v-model="dateRange" 
          value-key="value" 
          :style="{'width':getLangStyleValue(rangeWidth)}" 
          @change="changeDateRange">
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
        :pickFuturerDate="pickFuturerDate"
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
import util from '@/common/util.js';

export default {
  name: 'DateTimeSelector',
  components: { DateTimePicker },
  props:{
    // dateTimeValue:{
    //   type: Array,
    //   default:()=>{return [];}
    // },
    // dateRangeTitle:{
    //   type:String,
    //   default:''
    // },
    showTooltips:{
      type: Boolean,
      default: false
    },
  
    pickFuturerDate:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      date: '',
      range: '',
      dateRangeTitle: '',
      dateTimeValue:[],


      dateRangeItems:[{value:3,label:this.$t('overview.last3Days')},{value:7,label:this.$t('overview.last7Days')},
                      {value:30,label:this.$t('overview.last30Days')},{value:90,label:this.$t('overview.last90Days')},
                      {value:0,label:this.$t('overview.thisMonth')},{value:1,label:this.$t('overview.lastMonth')},
                      {value:2,label:this.$t('overview.thisQuarter')},{value:4,label:this.$t('overview.customDate')}],
      dateRangevalue:-1,
      diablePick:false,
      contentWidth:[{key:'en',value:'calc(402/1440*100vw)'},{key:'zh',value:'calc(402/1440*100vw)'},{key:'zhtw',value:'calc(402/1440*100vw)'},
        {key:'ja-JP',value:util.getWindowWidth()>1366?'calc(492/1440*100vw)':'calc(500/1440*100vw)'},{key:'ko-KR',value:'calc(402/1440*100vw)'},{key:'vi-VN',value:util.getWindowWidth()>1366?'calc(442/1440*100vw)':'calc(475/1440*100vw)'},
        {key:'id-ID',value:util.getWindowWidth()>1366?'calc(412/1440*100vw)':'calc(450/1440*100vw)'},{key:'th-TH',value:util.getWindowWidth()>1366?'calc(412/1440*100vw)':'calc(450/1440*100vw)'}],
      rangeWidth:[{key:'en',value:'calc(105/1440*100vw)'},{key:'zh',value:'calc(95/1440*100vw)'},{key:'zhtw',value:'calc(95/1440*100vw)'},
        {key:'ja-JP',value:util.getWindowWidth()>1366?'calc(190/1440*100vw)':'calc(225/1440*100vw)'},{key:'ko-KR',value:'calc(125/1440*100vw)'},{key:'vi-VN',value:util.getWindowWidth()>1366?'calc(130/1440*100vw)':'calc(160/1440*100vw)'},
        {key:'id-ID',value:util.getWindowWidth()>1366?'calc(120/1440*100vw)':'calc(150/1440*100vw)'},{key:'th-TH',value:util.getWindowWidth()>1366?'calc(120/1440*100vw)':'calc(150/1440*100vw)'}],
      selecClass:[{key:'en',value:'rangeSel'},{key:'zh',value:'rangeSel'},{key:'zhtw',value:'rangeSel'},
        {key:'ja-JP',value:'rangeSel-ja'},{key:'ko-KR',value:'rangeSel-ko'},{key:'vi-VN',value:'rangeSel-vi'},
        {key:'id-ID',value:'rangeSel-id'},{key:'th-TH',value:'rangeSel-th'}]
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

    if(this.dateRangeTitle=="")this.dateRangeTitle = this.$t('overview.date');
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
    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    getDefaultTimeList() {
      //console.log("2.dateTimeValue:",this.dateTimeValue);
      if(this.dateTimeValue.length==0){
        this.dateTimeValue = [this.$moment().subtract(29, 'days'), this.$moment()];
      //this.dateTimeValue = [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()];
      }
    },
    changeDateRange(val){
      console.log('val :1---->> ', val);
      this.dateRangevalue = val;
      if(val!=4){
        this.diablePick = true;
      }else{
        this.diablePick = false;
      }
      //this.getDateRange();
    },

    dateChange(val) {
      console.log('this is dataChange ------->> ');
      this.$emit('change', val);

      
      console.log('this.dateRangevalue :2---->> ', this.dateRangevalue);
      console.log('val :2---->> ', val);



    },
    
    
  }
};
</script>

<style lang="scss" scoped>
  .date-selector-container{
    display: flex;
    align-items: center;
    height: calc(36/1920*100vw);
    width: calc(402/1440*100vw);
    // background-color: #fff;
    // border-radius: 5px;
    .time-title{
      width:calc(76/1440*100vw);
      align-self:center;
      font-size:calc(15/1920*100vw);
      color:#484848;
      text-align:left;
      line-height: 20px;
    }
    .date-range{
      width:cacl(207/1440*100vw);
    }
  }
</style>
<style lang="scss">
  .bDateSel.el-select .el-input--medium .el-input__inner {
    /*width: calc(95/1440*100vw);*/
    height: calc(36/1920*100vw);
    font-size: calc(15/1920*100vw);
    text-align: left;
    border: none;
    color:#2b2b2b;
  background-color: transparent;
  }
  .rangeSel.el-select .el-input--medium .el-input__inner {
    width: calc(95/1440*100vw);
  }
  .rangeSel-ja.el-select .el-input--medium .el-input__inner {
    width:inherit;
    @media screen and (max-width:1367px) { 
      width: calc(230/1440*100vw);
    }
    @media screen and(min-width: 1367px){
      width: calc(180/1440*100vw);
    }
  }
  .rangeSel-ko.el-select .el-input--medium .el-input__inner {
    width: calc(125/1440*100vw);
  }
  .rangeSel-vi.el-select .el-input--medium .el-input__inner {
     @media screen and (max-width:1367px) { 
      width: calc(150/1440*100vw);
    }
    @media screen and(min-width: 1367px){
      width: calc(130/1440*100vw);
    }
  }
  .rangeSel-id.el-select .el-input--medium .el-input__inner {
    @media screen and (max-width:1367px) { 
      width: calc(150/1440*100vw);
    }
    @media screen and(min-width: 1367px){
      width: calc(120/1440*100vw);
    }
  }
  .rangeSel-th.el-select .el-input--medium .el-input__inner {
    @media screen and (max-width:1367px) { 
      width: calc(110/1440*100vw) !important;
    }

    @media screen and(min-width: 1367px){
      width: calc(95/1440*100vw) !important;
    }
    
  }
  .bDateSel.el-select .el-input .el-select__caret {
    color: #2c90d9;
  }
  .bDateSel.el-select .el-input--medium .el-input__suffix{
    top:0px;
  }
</style>