<template>
  <div v-clickoutside="onClickOutside" class="date-selector-container">
    <div class="date-mode" @click="ifShowModeList = !ifShowModeList">{{ timeMode }}</div>
    <i :class="{'icon-arrow-down' : !ifShowModeList}" class="el-icon-arrow-up"/>
    <div v-if="ifShowModeList" class="time-mode-list">
      <div
        v-for="mode of timeModeList"
        :key="mode.value"
        :class="{'active-item': timeModeValue === mode.value}"
        class="time-mode-item"
      >
        <template>
          <div
            @click.stop="setTimeMode(mode)"
            @mouseover="setTimeModeValue(mode)">{{ mode.label }}</div>
        </template>
      </div>
      <div v-if="timeModeValue === 6" class="date-time-picker">
        <date-time-picker ref="timePicker" :date-value="dateValue" @change="dateChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import DateTimePicker from './DateTimePicker';
import { mapGetters } from 'vuex';
import Clickoutside from '../common/VClickOutside';
export default {
  name: 'DateTimeSelector',
  components: { DateTimePicker },
  directives: {
    Clickoutside
  },
  data() {
    return {
      timeMode: this.$t('overview.last30Days'),
      timeModeValue: 1,
      ifShowModeList: false,
      dateValue: [],
      timeModeList: [
        {
          'value': 0,
          'label': this.$t('overview.last7Days'),
          'dateTimeList': [this.$moment().subtract(6, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()]
        },
        {
          'value': 1,
          'label': this.$t('overview.last30Days'),
          'dateTimeList': [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()]
        },
        {
          'value': 2,
          'label': this.$t('overview.last90Days'),
          'dateTimeList': [this.$moment().subtract(89, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()]
        },
        {
          'value': 3,
          'label': this.$t('overview.thisMonth'),
          'dateTimeList': [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()]
        },
        {
          'value': 4,
          'label': this.$t('overview.lastMonth'),
          'dateTimeList': [this.$moment().subtract(1, 'month').startOf('month').toDate(),
            this.$moment().subtract(1, 'month').endOf('month').toDate()]
        },
        {
          'value': 5,
          'label': this.$t('overview.thisQuarter'),
          'dateTimeList': [this.$moment().startOf('quarter').toDate(), this.$moment().endOf('quarter').toDate()]
        },
        {
          'value': 6,
          'label': this.$t('overview.customize'),
          'dateTimeList': [this.$moment().subtract(29, 'days').startOf('d').toDate(), this.$moment().endOf('d').toDate()]
        }
      ]
    };
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      if (val !== 0) {
        this.timeMode = this.$t('overview.last30Days');
        this.timeModeValue = 1;
        this.getDefaultTimeList();
      }
    }
  },

  mounted() {
    this.getDefaultTimeList();
  },

  methods: {
    getDefaultTimeList() {
      this.dateValue = [this.$moment().subtract(29, 'days'), this.$moment()];
    },

    dateChange(val) {
      this.dateValue = val;
      this.timeMode = `${this.$moment(this.dateValue[0]).format('YYYY/MM/DD')} -
                        ${this.$moment(this.dateValue[1]).format('YYYY/MM/DD')}`;
      this.ifShowModeList = false;
      this.$emit('change', this.dateValue);
    },

    setTimeMode(mode) {
      this.timeModeValue = mode.value;
      if (this.timeModeValue < 6) {
        this.timeMode = mode.label;
        this.ifShowModeList = false;
      } else {
        this.timeMode = `${this.$moment(this.dateValue[0]).format('YYYY/MM/DD')} -
                        ${this.$moment(this.dateValue[1]).format('YYYY/MM/DD')}`;
      }
      this.$emit('change', mode.dateTimeList);
    },

    setTimeModeValue(mode) {
      this.timeModeValue = mode.value;
    },

    onClickOutside() {
      this.ifShowModeList = false;
    }
  }
};
</script>

<style scoped>
  .date-selector-container{
    display: inline-flex;
    position: relative;
    text-align: left;
    width: 200px;
    height: calc(36/1920*100vw);
    min-height: 28px;
    line-height: calc(36/1920*100vw);
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 calc(10/1920*100vw);
    color: #7d8cad;
    background-color: #fff;
    font-size: 12px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
  }
  .date-mode{
    width: 100%;
  }
  .time-mode-list{
    position: absolute;
    top: 45px;
    left: 0;
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    z-index: 10;
    background: #fff;
    padding: 6px 0;
  }
  .time-mode-item{
    text-align: left;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    position: relative;
    padding: 0 calc(10/1920*100vw);
    font-size: 14px;
  }
  .time-mode-item:hover, .active-item{
    background-color: rgba(251, 76, 93, 0.2);
  }
  .date-time-picker{
    position: absolute;
    bottom: 6px;
    left: 200px;
    background-color: rgba(251, 76, 93, 0.2);
    padding: 0px 12px 0 20px;
  }
  .icon-arrow-down{
    transform: rotate(180deg);
    transition: transform .3s,-webkit-transform .3s;
  }
  .icon-arrow-up{
    transition: transform .3s,-webkit-transform .3s;
  }
</style>
