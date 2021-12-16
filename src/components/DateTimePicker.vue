<template>
  <div style="display: inline-flex">
    <el-date-picker
      ref="datePicker"
      v-bind="$attrs"
      v-model="dateTimeValue"
      :clearable="false"
      :editable="false"
      :popper-class="poperClass"
      :start-placeholder="$t('overview.startDate')"
      :end-placeholder="$t('overview.endDate')"
      :picker-options="pickerOptions"
      type="daterange"
      range-separator="-"
      size="mini"
      format="yyyy/MM/dd"
      class="date-picker global-date-pick"
      unlink-panels
      @change="dateChange"
    />
    <div v-if="showTooltips">
      <el-tooltip
        class="date-time-tooltip"
        effect="dark"
        placement="right">
        <div slot="content">{{ $t('overview.dataRangeTips') }}</div>
        <i class="iconfont icon-bangzhu iconbangzhu"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'DateTimePicker',
  props:{
    showTooltips:{
      type: Boolean,
      default: false
    },
    dateRange:{
      type:Number,
      required:true
    }
  },
  data() {
    return {
      poperClass: 'date-picker-poper',
      elTooltipClass: 'el-tooltip-class',
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        }
      },
      dateTimeValue: [this.$moment().subtract(29, 'days'), this.$moment()],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
        },
        onPick:({ maxDate, minDate })=>{
            console.log("maxDate:"+maxDate+", minDate:"+minDate);
            this.dateTimeValue = [minDate, maxDate];
        }
        /*shortcuts: [{
          text: this.$t('overview.last3Days'),
          onClick(picker) {
            const end = moment();
            const start = moment().subtract(2, 'days').startOf('d').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('overview.last7Days'),
          onClick(picker) {
            const end = moment();
            const start = moment().subtract(6, 'days').startOf('d').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('overview.last30Days'),
          onClick(picker) {
            const end = moment();
            const start = moment().subtract(29, 'days').startOf('d').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('overview.last90Days'),
          onClick(picker) {
            const end = moment();
            const start = moment().subtract(89, 'days').startOf('d').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('overview.thisMonth'),
          onClick(picker) {
            const end = moment(new Date());
            const start = moment(new Date()).startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('overview.lastMonth'),
          onClick(picker) {
            const end = moment().subtract(1, 'month').endOf('month').startOf('d').toDate();
            const start = moment().subtract(1, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('overview.thisQuarter'),
          onClick(picker) {
            const end = moment();
            const start = moment().startOf('quarter').toDate();
            picker.$emit('pick', [start, end]);
          }
        }]*/
      }
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      if (val !== 0) {
        this.getDefaultTimeList();
      }
    },
    dateRange(val){
      console.log("dateRange changed:",val);
      this.getDateRange(val);
    }
  },

  mounted() {
    this.getDefaultTimeList();
  },

  methods: {
    getDefaultTimeList() {
      this.dateTimeValue = [this.$moment().subtract(29, 'days'), this.$moment()];
    },

    dateChange(val) {
      let start = this.$moment(val[0]).valueOf();
      const end = this.$moment(val[1]).valueOf();
      const daysDiff = this.$moment(end).diff(start, 'days');
      if (daysDiff > 364) {
        this.$message({
          message: this.$t('overview.changeTimeRange'),
          type: 'warning'
        });
        start = end - 3600 * 24 * 364 * 1000;
        start = this.$moment(start).startOf('d').toDate().valueOf();
        this.dateTimeValue = [this.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      } else {
        this.dateTimeValue = [this.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
      }
      const endTimeStamp = this.$moment(end).endOf('d').valueOf();
      this.$emit('change', [this.dateTimeValue[0], endTimeStamp]);
    },
    getDateRange(val){
        if (this.dateRange == 3) {
            this.dateTimeValue = [this.$moment().subtract(2, 'days'), this.$moment()];
            console.log("this.dateTimeValue:",this.dateTimeValue);
            //this.dateFormat = this.$moment(this.date).startOf('week').format("YYYY/MM/DD");
            //const paramDate = { start_date: this.$moment(this.date).startOf('week'), end_date: this.$moment(this.date).endOf('week'),range_type:'week' }
            //this.$emit('emitFilterDateRange', paramDate );
        } else if (this.dateRange == 7) {
            this.dateTimeValue = [this.$moment().subtract(6, 'days'), this.$moment()];
            console.log("this.dateTimeValue:",this.dateTimeValue);
        }else if (this.dateRange == 30) {
            this.dateTimeValue = [this.$moment().subtract(29, 'days'), this.$moment()];
            console.log("this.dateTimeValue:",this.dateTimeValue);
        }else if (this.dateRange == 90) {
            this.dateTimeValue = [this.$moment().subtract(89, 'days'), this.$moment()];
            console.log("this.dateTimeValue:",this.dateTimeValue);
        }else if (this.dateRange == 0) {
            this.dateTimeValue = [this.$moment(new Date()).startOf('month').toDate(), this.$moment()];
            console.log("this.dateTimeValue:",this.dateTimeValue);
        }else if (this.dateRange == 1) {
            const end = moment().subtract(1, 'month').endOf('month').startOf('d').toDate();
            const start = moment().subtract(1, 'month').startOf('month').toDate();
            this.dateTimeValue = [start, end];
            console.log("this.dateTimeValue:",this.dateTimeValue);
        }else if (this.dateRange == 2) {
            const end = moment();
            const start = moment().startOf('quarter').toDate();
            this.dateTimeValue = [start, end];
            console.log("this.dateTimeValue:",this.dateTimeValue);
        }
        
    }
  }
};
</script>

<style>
@import "../assets/sass/stastical.scss";
.global-date-pick.el-date-editor .el-range-input {
  font-size:15px;
}
.date-picker{
  width:calc(207/1440*100vw);
  font-size: 15px;
  line-height: 36px;
}
.global-date-pick.el-range-editor--mini.el-input__inner {
  border:none;
}
.global-date-pick.el-range-editor--mini .el-range__icon, .el-range-editor--mini .el-range__close-icon {
    line-height: 224px;
    height: 24px;
}
.global-date-pick.el-date-editor .el-range__icon {
    font-size: 24px;
    margin-left: -5px;
    color: #c0c4cc;
    float: left;
    line-height: 24px;
}
</style>
