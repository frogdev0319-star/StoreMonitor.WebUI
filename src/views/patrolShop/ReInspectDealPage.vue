<template>
  <div class="el-sucPage-content">
    <div class="page-icon">
      <div class="icon-content">
        <img :src="isSuccess?sucSrc:errSrc" class="suc-icon">
        <p v-if="isSuccess && lang !== 'en'" class="sucret-info">{{ curSecond }}s{{ $t('remotePatrol.return') }}</p>
        <p v-if="isSuccess && lang === 'en'" class="sucret-info">{{ $t('remotePatrol.return') }} {{ curSecond }}s !</p>
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
        self.$route.matched[2].name = 'successSubmit';
      } else {
        self.$route.matched[2].name = 'failSubmit';
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
    .page-content{
        margin: 20px;
        background-color: #fafafb;
        width: auto;
        //min-height: 300px;
        height: auto;
        padding: 20px;
        border: 0.5px solid #e3e9f4;
        .details{
            text-align: left;
            margin-top: 10px;
            margin-left: 20px;
            color: #424151;
            font-size: 14px;
            .event-label{
                font-weight: bold;
            }
            .ignore-content{
                margin-top: 15px;
            }
            .ignore-details{
                width: 100%;
                height: 32px;
                line-height: 32px;
                .icon-point{
                    width: 14px;
                    height: 14px;
                    border-radius: 7px;
                    background-color: #DBDBE5;
                    display: inline-block;
                    margin-right: 15px;
                }
                .ignore-info{
                    color: #94a4b4;
                }
            }
        }
        .table-content{
            margin: 20px;
            height: auto;
            border: 1px solid #e3e9f4;
            background-color: #fff;
            .table-header{
                width: 100%;
                height: 39px;
                background-color: #F4F5F9;
                line-height: 32px;
                .table-details{
                    text-align: left;
                    display: inline-block;
                    span{
                        font-size: 12px;
                        margin-left: 30px;
                        color: #94a4b4;
                    }

                }
            }
            .data-rows{
                width: 100%;
                height: 39px;
                line-height: 36px;
                text-align: left;
                .item-cols{
                    height: 39px;
                    float: left;
                    display: block;
                    line-height: 39px;
                    font-size: 12px;
                    font-weight: bold;
                    border-right: 1px solid #e3e9f4;
                    span{
                        margin-left: 20px;
                    }
                    &:last-child{
                        border-width: 0;
                    }
                    &:first-child{
                        span{
                            margin-left: 30px;
                        }
                    }
                    .icon-span{
                        display:inline-block;
                        width: 50px;
                        height:20px;
                        line-height: 20px;
                        color:white;
                        padding-left:5px;
                        padding-right:5px;
                        font-size: 12px;
                        text-align: center;
                        font-weight: normal;
                    }
                }
                &:last-child{
                    border-bottom: 1px solid #e3e9f4;
                    margin-bottom: 20px;
                }
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

