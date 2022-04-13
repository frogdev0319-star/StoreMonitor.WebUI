<template>
    <div class="content" :style="{'width':getLangStyleValue(contentWidth)}">
        <div class="rang-pick">
            <img :src="DatePickIconSrc"/>
            <div class="range-div" :style="{'width':getLangStyleValue(rangeWidth)}">{{$t('statistics.dateChoose')}}</div>
            <el-select class="dropdown-select" :style="{'width':getLangStyleValue(dropdownWidth)}" v-model="dateRange" value-key="value" @change="changeDateRange">
                <el-option 
                  v-for="item in dateRangeItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
            <div style="width:1px; height:20px;background-color:#556679;align-self: center;"></div>
            <el-date-picker key="date1" class="date-picker"  :type="dateRange" v-model="date" :format="dateFormat" 
                :picker-options="{firstDayOfWeek: 7}"
                @change="onDateChanged" :clearable="false"></el-date-picker>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import util from '@/common/util.js';
export default {
    name: 'AreaDateTimeSelected',
    data() {
        return {
            lang:this.$i18n.locale,
            DatePickIconSrc: require('../../static/img/statistics/ic_edit.svg'),
            CalenderIconSrc: require('../../static/img/statistics/ic_calender.svg'),
            dateRange:'week',
            dateRangeItems:[{value:'week',label:this.$t('statistics.weekCompare')},{value:'month',label:this.$t('statistics.monthCompare')}],
            date:Date.now(),
            dateFormat:this.$moment(Date.now()).startOf('week').format("YYYY/MM/DD"),
            contentWidth:[{key:'en',value:'307px'},{key:'zh',value:'307px'},{key:'zhtw',value:'307px'},
        {key:'ja-JP',value:'347px'},{key:'ko-KR',value:'347px'},{key:'vi-VN',value:'347px'},
        {key:'id-ID',value:'430px'},{key:'th-TH',value:'407px'}],
            rangeWidth:[{key:'en',value:'52px'},{key:'zh',value:'52px'},{key:'zhtw',value:'52px'},
        {key:'ja-JP',value:'80px'},{key:'ko-KR',value:'80px'},{key:'vi-VN',value:'80px'},
        {key:'id-ID',value:'82px'},{key:'th-TH',value:'80px'}],
            dropdownWidth:[{key:'en',value:'105px'},{key:'zh',value:'105px'},{key:'zhtw',value:'105px'},
        {key:'ja-JP',value:'125px'},{key:'ko-KR',value:'125px'},{key:'vi-VN',value:'145px'},
        {key:'id-ID',value:'205px'},{key:'th-TH',value:'185px'}]
        }
  },
  computed: {
  },
  methods: {
    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    changeDateRange(val) {
                this.dateRange = val;
                this.getDateRange();
                //let params = { start_date: this.paramDate.start_date, end_date: this.paramDate.end_date };
                //this.$store.dispatch("op_log/setControlOPLog", params);
    },
    onDateChanged() {
        console.log("pick date:",this.date);
        this.getDateRange();
    },
    getDateRange(){
        if (this.dateRange == "week") {
            let start = this.$moment(this.date).startOf('week').format("YYYY/MM/DD");
            let end = this.$moment(this.date).endOf('week').format("YYYYY/MM/DD");
            console.log("start-end:", start + " " + end);
            this.dateFormat = this.$moment(this.date).startOf('week').format("YYYY/MM/DD");
            const paramDate = { start_date: this.$moment(this.date).startOf('week'), end_date: this.$moment(this.date).endOf('week'),range_type:'week' }
            this.$emit('emitFilterDateRange', paramDate );
        } else if (this.dateRange == "month") {
            this.dateFormat = "yyyy/MM";
            const paramDate = { start_date: this.$moment(this.date).startOf('month'), end_date: this.$moment(this.date).endOf('month'),range_type:'month' }
            this.$emit('emitFilterDateRange', paramDate );
        }
        
    }
  }
}
</script>
<style lang="css" >
.dropdown-select.el-select.el-input--medium .el-input__inner{
    height: 25px;
    font-size: 15px;
    text-align: left;
    border: none;
    background-color: #f7f9fa;
    color:#2b2b2b;
  }
  .dropdown-select.el-select .el-input--medium .el-input__suffix{
    top:0px;
  }
</style>
<style lang="scss" scoped>
.content{
    width:307px; //347
    height:35px;
    display:flex;
    flex-direction:row;
    background-color:#f7f9fa;
    float: right;
    .rang-pick{
        display:flex;
        flex-direction:row;
        img{
            width:24;
            height:24px;
            margin-left: 10px;
            align-self: center;
        }
        .range-div{
            width: 52px;//80
            margin: 2px 0 2px 4px;
            font-family: NotoSansCJKtc;
            font-size: 13px;
            text-align: left;
            color: #006ab7;
            align-self: center;
        }
        .dropdown-select{
            width:105px;//125
            height:35px;
            border:none;
            color: #2b2b2b;
            align-self: center;
        }
    }
    .date-picker {
        ::v-deep.el-input__icon {
            width: 18px;
            height: 18px;
            content: url(../../static/img/statistics/ic_calender.svg);
            }
        }
    /deep/
    .el-input--medium .el-input__inner{
        border:none;
        background-color: #f7f9fa;
    }
    .date-picker{
        font-size:13px;
    }
}  
</style>
