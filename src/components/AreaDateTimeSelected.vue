<template>
    <div class="content">
        <div class="rang-pick">
            <img :src="DatePickIconSrc"/>
            <div class="range-div">{{$t('statistics.dateChoose')}}</div>
            <el-select class="dropdown-select" v-model="dateRange" value-key="value" @change="changeDateRange">
                <el-option 
                  v-for="item in dateRangeItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
            <div style="width:1px; height:20px;background-color:#556679;align-self: center;"></div>
            <el-date-picker key="date1" class="date-picker"  :type="dateRange" v-model="date" :format="dateFormat"
                @change="onDateChanged" :clearable="false"></el-date-picker>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
    name: 'AreaDateTimeSelected',
    data() {
        return {
            DatePickIconSrc: require('../../static/img/statistics/ic_edit.svg'),
            CalenderIconSrc: require('../../static/img/statistics/ic_calender.svg'),
            dateRange:'week',
            dateRangeItems:[{value:'week',label:this.$t('statistics.weekCompare')},{value:'month',label:this.$t('statistics.monthCompare')}],
            date:Date.now(),
            dateFormat:'yyyy/MM/DD',
        }
  },
  computed: {
  },
  methods: {
    changeDateRange(val) {
                this.dateRange = val;
                this.getDateRange();
                //let params = { start_date: this.paramDate.start_date, end_date: this.paramDate.end_date };
                //this.$store.dispatch("op_log/setControlOPLog", params);
    },
    onDateChanged() {
        this.getDateRange();
    },
    getDateRange(){
        if (this.dateRange == "week") {
            let start = this.$moment(this.date).startOf('week').format("yyyy/MM/DD");
            let end = this.$moment(this.date).endOf('week').format("yyyy/MM/DD");
            console.log("start-end:", start + " " + end);
            this.dateFormat = 'yyyy/MM/DD';
            const paramDate = { start_date: this.$moment(this.date).startOf('week'), end_date: this.$moment(this.date).endOf('week') }
        } else if (this.dateRange == "month") {
            this.dateFormat = "yyyy/MM";
            const paramDate = { start_date: this.$moment(this.date).startOf('month'), end_date: this.$moment(this.date).endOf('month') }
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
    width:307px;
    height:35px;
    margin-top: 17px;
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
            width: 52px;
            height: 18px;
            margin: 2px 0 4px 4px;
            font-family: NotoSansCJKtc;
            font-size: 13px;
            text-align: left;
            color: #006ab7;
            align-self: center;
        }
        .dropdown-select{
            width:85px;
            height:25px;
            border:1px solid #f7f9fa;
            color: #2b2b2b;
            align-self: center;
            align-items: center;
        }
    }
    .date-picker {
        ::v-deep.el-input__icon {
            width: 18px;
            height: 18px;
            content: url(../../static/img/statistics/ic_calender.svg);
            }
        }
}  
</style>