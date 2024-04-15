<template>
  <div class="page-container">
    <img :src="errorImgSource" class="error-img">
    <div class="error-text">
      {{ $t('route.noInspectionAccessRights') }}
    </div>


    <dialog-pop
      title="您的服務已轉移至 iService Inspection"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showDialog"
      :isWarning="true"
      :showButton=" false"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          <!-- <p> 您的服務已轉移至iService Inpsection</p> -->

          
          <div class="btn_row">
            
            <el-button class="go" type="primary" @click="confirmDelete">
              <div class="el-icon-link icon"></div> 前往 iService
            </el-button>
          </div>
        </div>
      </div>
    </dialog-pop>



  </div>
</template>

<script>
import { accountInfo } from '@/api/login';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'Error',
  components: {
    DialogPop,
  },
  data() {
    return {
      errorImgSource: require('../../../static/img/icon_error.png'),
      showDialog: false
    }
  },
  mounted() {
    this.getAccountInfo()
  },
  methods: {
  
    async getAccountInfo(){

      const result = await this.$store.dispatch("GetUserAuthorities");
      const accountId = {
        accountId : result.data.accountId
      }

      var brandList = JSON.parse(sessionStorage.getItem("brandList"));
      console.log('@@@@ brandList :>> ', brandList);
      var srcType = brandList[0].srp[0].type
      console.log('@@@@ srcType :>> ', srcType);

      await accountInfo(accountId).then(res => {
        console.log('res.data', res.data)
        console.log('res.data.isTransform !!', res.data.isTransform)
        console.log('res.data.isiService !!', res.data.isiService)
        if(res.data.isTransform && srcType !== "custom_iqm_inspection"){
          this.showDialog =  true
        }
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },

    confirmDelete(){
      window.location.href = "https://apps.wise-iservice.com/";
    }
  }
};
</script>

<style scoped>
  .page-container{
    height: calc(100vh - 80px - 105px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .error-img{
    height: 36px;
    width: 36px;
  }
  .error-text{
    padding-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #424151;
  }
</style>
<style lang="sass" scoped>
  .dialog-content
    width: 100%
  .btn_row
    width: 100%
    margin-top: 50px
    margin-bottom: 20px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center


    .go
      width: fit-content
      height: 40px !important
      font-size: 14px
      padding: 10px 20px
</style>