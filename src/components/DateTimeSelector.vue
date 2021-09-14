<template>
  <div class="date-selector-container">
    <date-time-picker @change="dateChange"/>
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

<style scoped>
  .date-selector-container{
    display: inline;
    position: relative;
    text-align: left;
    width: 200px;
    height: calc(36/1920*100vw);
    min-height: 28px;
    line-height: calc(36/1920*100vw);
  }
</style>
