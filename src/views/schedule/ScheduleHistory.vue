<template>
    <div className="ScheduleContainer">
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default{
    name: 'ScheduleHistory',

  components: {
  },
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch: {
    async accountChanged(val) {
      const self = this;
      if (val !== 0) {
        /*this.ifCachedParams = false;
        self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date()).endOf('d').toDate()];
        const start = typeof (self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        const end = typeof (self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.getSearchCondition();
        self.curStoreTag = [];*/
      }
    },

  },
  created() {

  },
  methods:{

  }
}
</script>

<style scoped lang="scss">

</style>
