<template>
  <div class="date-selector-container">
    <div style="width:76px;align-self:center;font-size:15px;color:#484848">時間範圍</div>
    <div class="date-range">
      <date-time-picker @change="dateChange"/>
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
    };
  },
  methods: {
    dateChange(val) {
      this.$emit('change', val);
    }
  }
};
</script>

<style lang="scss" scoped>
  .date-selector-container{
    display:flex;
    flex-direction:row;
    position: relative;
    text-align: left;
    width: calc(378/1440*100vw);;
    height: 36px;
    min-height: 28px;
    line-height: 36px;
    align-items:center;
    justify-content:space-between;

    .date-range{
      display:flex;
      flex-direction:row;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      background-color: #fff;
      width: calc(302/1440*100vw);
      height:36px;
    }
  }
</style>
