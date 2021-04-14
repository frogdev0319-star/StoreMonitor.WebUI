<template>
  <div style="display: inline-block">
    <el-date-picker
      ref="datePicker"
      v-bind="$attrs"
      v-model="dateTimeValue"
      :clearable="false"
      :editable="false"
      :popper-class="poperClass"
      :picker-options="dateOpt"
      :default-time="['00:00:00', '23:59:59']"
      type="daterange"
      range-separator="-"
      size="mini"
      format="yyyy/MM/dd"
      class="date-range"
      :start-placeholder="$t('overview.startDate')"
      :end-placeholder="$t('overview.endDate')"
      unlink-panels
      @change="dateChange"
    />
    <el-tooltip
      class="date-time-tooltip"
      effect="dark"
      placement="right">
      <div slot="content">{{ $t('overview.dataRangeTips') }}</div>
      <i class="iconfont icon-bangzhu iconbangzhu"/>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'DateTimePicker',
    props: {
      dateValue: {
        type: Array,
        default: []
      }
    },
    watch:{
      dateValue(newValue){
        this.dateTimeValue = newValue;
      },
    },
    data(){
      return {
        poperClass: 'date-picker-poper',
        elTooltipClass: 'el-tooltip-class',
        dateOpt: {
          disabledDate: (time) => {
            return time.getTime() > this.$moment(new Date()).endOf('d').toDate();
          }
        },
        dateTimeValue: this.dateValue
      }
    },
    methods: {
      dateChange(val){
        let start = typeof (val[0]) === 'object' ? val[0].getTime() : val[0];
        const end = typeof (val[1]) === 'object' ? val[1].getTime() : val[1];
        let daysDiff = this.$moment(end).diff(start, 'days');
        if (daysDiff < 6) {
          this.$message({
            message: this.$t('overview.changeTimeRange'),
            type: 'warning'
          });

          start = end - 3600 * 24 * 6 * 1000;
          start = this.$moment(start).startOf('d').toDate().valueOf();
          this.dateTimeValue = [this.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
        }
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
        this.$emit('change', this.dateTimeValue);
      }
    }
  };
</script>

<style scoped>

</style>
