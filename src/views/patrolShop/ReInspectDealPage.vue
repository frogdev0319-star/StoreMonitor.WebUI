<template>
  <div class="el-sucPage-content">
    <div class="page-icon">
      <div class="icon-content">
        <img :src="isSuccess?sucSrc:errSrc" class="suc-icon">
        <p v-if="isSuccess" class="sucret-info">{{ $t('remotePatrol.return', {seconds: curSecond}) }}</p>
      </div>
    </div>
    <div v-if="!isSuccess" class="page-err-btn">
      <el-button size="mini" type="primary" class="retry-btn" @click="reTry">
        {{ curSecond }}s{{ $t('remotePatrol.tryAgain') }}
      </el-button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ReInspectDealPage',
  data() {
    return {
      isSuccess: false,
      sucSrc: require('../../../static/img/submit_succeed.png'),
      errSrc: require('../../../static/img/submit_failed.png'),
      curSecond: 10,
      timeid: 0,
      lang: this.$i18n.locale
    };
  },

  beforeRouteLeave(to, from, next) {
    const self = this;
    clearInterval(self.timeid);
    next();
  },

  mounted() {
    const self = this;
    self.getRouterData();
    if (self.isSuccess) {
      self.timeid = setInterval(function() {
        self.getBackSecond();
      }, 1000);
    }
  },

  methods: {
    getRouterData() {
      const self = this;
      let routeData = self.$route.params.data;
      if (self.$route.params.data === undefined) {
        routeData = JSON.parse(sessionStorage.getItem('reinspect_submit'));
      }
      if (routeData != null) {
        self.isSuccess = routeData.isSuccess;
      }
      if (self.isSuccess) {
        self.$route.matched[self.$route.matched.length - 1].name = 'successSubmit';
      } else {
        self.$route.matched[self.$route.matched.length - 1].name = 'failSubmit';
        if (!self.isSuccess) {
          PubSub.publish('success-page', { changeStyle: true });
        }
      }
    },

    getBackSecond() {
      const self = this;
      self.curSecond--;
      if (self.curSecond === 0) {
        clearInterval(self.timeid);
        self.$router.push({ name: 'remotePatrol' });
      }
    },

    reTry() {
      const self = this;
      self.$router.push({ name: 'confirmSum', params: self.$route.params.data.reLoadData });
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../assets/css/pagination.css';
  $border:#e3e9f4;
  .el-sucPage-content{
    width: 100%;
    height: 100%;
    padding-top: 50px;
    border: 1px solid $border;
    background-color: #fff;
    .page-icon{
        margin-bottom: 40px;
        position: relative;
        .icon-content{
            margin:0 auto;
            .suc-icon{
                height: 80px;
            }
            .sucInfo{
                font-size: 14px;
                color: #6097F3;
            }
            .errInfo{
                font-size: 14px;
                color: #ddd;
            }
            .sucret-info{
                font-size: 12px;
                color: #FB4C5D;
            }
        }
    }
    .page-err-btn{
      margin-bottom: 50px;
      .retry-btn{
        margin-top: 30px;
      }
    }
}
</style>

