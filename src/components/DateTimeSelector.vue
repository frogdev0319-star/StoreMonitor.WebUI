<template>
  <div class="date-selector-container">
    <div @click="ifShowModeList = !ifShowModeList">{{ timeMode }}</div>
    <template v-if="ifShowModeList">
      <div class="time-mode-list">
        <div v-for="mode of timeModeList" :key="mode.value" class="time-mode-item">
          <template>
            <div @click="setTimeMode(mode)" @mouseover="setTimeModeValue(mode)">{{ mode.label }}</div>
          </template>
        </div>
        <div v-if="timeModeValue === 6" class="date-time-picker">
          <date-time-picker :date-value="dateValue" @change="dateChange"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DateTimePicker from './DateTimePicker';
export default {
  name: 'DateTimeSelector',
  components: { DateTimePicker },
  data() {
    return {
      timeMode: '近30天',
      timeModeValue: 1,
      ifShowModeList: false,
      dateValue: [],
      timeModeList: [
        {
          'value': 0,
          'label': '近7天',
          'dateTimeList': [this.$moment().subtract(6, 'days').valueOf(), this.$moment().valueOf()]
        },
        {
          'value': 1,
          'label': '近30天',
          'dateTimeList': [this.$moment().subtract(29, 'days').valueOf(), this.$moment().valueOf()]
        },
        {
          'value': 2,
          'label': '近90天',
          'dateTimeList': [this.$moment().subtract(89, 'days').valueOf(), this.$moment().valueOf()]
        },
        {
          'value': 3,
          'label': '本月',
          'dateTimeList': [this.$moment().startOf('month').toDate(), this.$moment(new Date()).endOf('d').toDate()]
        },
        {
          'value': 4,
          'label': '上月',
          'dateTimeList': [this.$moment().subtract(1, 'month').startOf('month'), this.$moment().subtract('month', 1).endOf('month')]
        },
        {
          'value': 5,
          'label': '本季度',
          'dateTimeList': [this.$moment().startOf('quarter').toDate(), this.$moment().endOf('quarter').toDate()]
        },
        {
          'value': 6,
          'label': '自定义',
          'dateTimeList': [this.$moment().subtract(29, 'days'), this.$moment()]
        }
      ]
    };
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
        console.log(mode.dateTimeList);
      }
      this.$emit('change', mode.dateTimeList);
    },

    setTimeModeValue(mode) {
      this.timeModeValue = mode.value;
    }
  }
};
</script>

<style scoped>
  .date-selector-container{
    display: inline-block;
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
  }
  .time-mode-list{
    position: absolute;
    top: calc(36/1920*100vw);
    left: 0;
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .time-mode-item{
    text-align: left;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    position: relative;
    padding: 0 calc(10/1920*100vw);
  }
  .time-mode-item:hover, .time-mode-item::selection{
    background-color: #f31b65;
  }
  .date-time-picker{
    position: absolute;
    bottom: 0;
    left: 200px;
    width: 260px;
  }
</style>
