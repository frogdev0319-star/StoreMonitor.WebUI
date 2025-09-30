<template>
  <div class="el-sucPage-content">
    <div class="page-icon">
      <div class="icon-content">
        <img :src="isSuccess?sucSrc:errSrc" class="suc-icon">
        <div>
          <p class="workflowInfo">{{isSuccess?$t('audit.inceptionRpt.submitSucess'):$t('audit.inceptionRpt.submitFail')}}</p>
          <p v-if="isSuccess && isBindWorkflow" class="workflowInfo">{{$t('audit.inceptionRpt.goWorkflow')}}</p>
          <div v-if="isSuccess" class="backBtn-area" style="justify-content: center;">
            <el-button
              class="storevue-button-search"
              size="'small'" type="primary" @click="goBackRemoteInception">
              {{ $t('audit.inceptionRpt.backReInspection') }}
            </el-button>
            <div v-if="isBindWorkflow" style="width:32px;height:36px;"></div>
            <el-button v-if="isBindWorkflow"
              class="storevue-button-filled"
              size="'small'" type="primary" @click="goAuditManagement">
              {{ $t('audit.inceptionRpt.goAuditMangement') }}
            </el-button>
          </div >
          <div v-else>

            <el-button size="samll" type="primary" class="retry-btn" @click="backToReinspection" v-if="viewReportByTagAuth">
              {{ $t('audit.inceptionRpt.backReInspection') }}
            </el-button>

            <el-button size="samll" type="primary" class="retry-btn" @click="reTry" v-else>
              {{ curSecond }}s{{ $t('remotePatrol.tryAgain') }}
            </el-button>


          </div>
        </div>
        <!--<div v-else>
          <p v-if="isSuccess" class="sucret-info">{{ $t('remotePatrol.return', {seconds: curSecond}) }}</p>
        </div>-->
      </div>
    </div>
    <!--<div v-if="!isSuccess" class="page-err-btn">
      <el-button size="mini" type="primary" class="retry-btn" @click="reTry">
        {{ curSecond }}s{{ $t('remotePatrol.tryAgain') }}
      </el-button>
    </div>-->
  </div>
</template>
<script>

export default {
  name: 'ReInspectDealPage',
  data() {
    return {
      isSuccess: false,
      sucSrc: require('../../../../static/img/submit_succeed.png'),
      errSrc: require('../../../../static/img/submit_failed.png'),
      curSecond: 10,
      timeid: 0,
      lang: this.$i18n.locale,
      isBindWorkflow:false,
      viewReportByTagAuth: false
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
    /*if (!self.isSuccess) {
      self.timeid = setInterval(function() {
        self.getBackSecond();
      }, 1000);
    }*/
  },

  methods: {
    getRouterData() {
      const self = this;
      let routeData = self.$route.params.data;
      console.log('routeData :>> ', routeData);

      this.viewReportByTagAuth = routeData.viewReportByTagAuth


      if (self.$route.params.data === undefined) {
        routeData = JSON.parse(sessionStorage.getItem('reinspect_submit'));
      }
      if (routeData != null) {
        self.isSuccess = routeData.isSuccess;
        self.isBindWorkflow = routeData.isBindWorkflow;
        console.log("isBindWorkflow:",self.isBindWorkflow);
      }
      if (self.isSuccess) {
        self.$route.matched[self.$route.matched.length - 1].name = 'successSubmit';
      } else {
        self.$route.matched[self.$route.matched.length - 1].name = 'failSubmit';
        if (!self.isSuccess) {
          self.timeid = setInterval(function() {
            self.getBackSecond();
          }, 1000);
          PubSub.publish('success-page', { changeStyle: true });
        }
      }
    },

    getBackSecond() {
      const self = this;
      self.curSecond--;
      if (self.curSecond === 0) {
        clearInterval(self.timeid);
        //self.$router.push({ name: 'remotePatrol' });
      }
    },
    goBackRemoteInception(){
      this.$router.push({ name: 'remotePatrol' });
    },
    goAuditManagement(){
      this.$router.push({ name: 'SendAuditManage' });
    },
    reTry() {
      const self = this;
      self.$router.push({ name: 'confirmSum', params: self.$route.params.data.reLoadData });
    },
    backToReinspection(){
      const self = this;
      self.$router.push({ name: 'remotePatrol'});
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/css/pagination.css';
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
            .workflowInfo{
              font-size: 18px;
              color: #b7c7df;
            }
            .backBtn-area{
              display: flex;
              flex-direction: row;
              margin-top: 40px;
              height: 36px;
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

