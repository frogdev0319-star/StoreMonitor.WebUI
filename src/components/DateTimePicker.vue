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
      class="date-range"
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
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'DateTimePicker',
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
        shortcuts: [{
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
        }]
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
    }
  }
};
</script>

<style scoped>

</style>
