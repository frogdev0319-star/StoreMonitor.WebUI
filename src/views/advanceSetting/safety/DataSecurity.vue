<template>
  <div>
    <div class="submit_btn" >
      <delay-button type="filled" @click="submit" >
        <div class="button-area" style="width: 80px; height: 20px;">
          <span>{{$t('generalSetting.save')}} </span>
        </div>
      </delay-button>
    </div>

    <div class="page-container report-setting paper" >
      <div class="setting-titles padding flex-center">
        限制螢幕截圖
        <div class="spacer"></div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="template-info">
          <div class="inspect-basic">
            
            <div class="Data_safety">

              <div class="setting_row" >
                <div class="setting_item">
                  <el-switch
                    style="display: block"
                    v-model="isSwitchOn"
                    active-color="#c60957"
                    inactive-color="#eee"
                    active-text="開啟"
                    inactive-text="關閉"
                  >
                  </el-switch>
                </div>
              </div>

              
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
  
</template>

<script>
import { mapGetters } from 'vuex';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import util from '@/common/util';
import filterString from '@/common/filterString.js';

import { inpectRESTful } from '@/api/index';
import {advancedUpdate, advancedFetch} from '@/api/advanceSetting';



export default {
  name: 'GeneralSetting',
  components: { 
    DelayButton,
    SettingTable

  },
  data() {
    return {
      isLoadingData: false,
			isSwitchOn: false,
    };
  },

  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    // accountChanged(val) {
    //   val !== 0 && this.init();
    // },


  
  },

  created() {
    this.init()
    
  },

  methods: {
    async init(){
      console.log('init :>> ');
    },  

    // get user
    async getUserInfo(){
      const result = await this.$store.dispatch("GetUserAuthorities");
      this.userName = result.data.userName
      // console.log('result  :>> ', result );
      // console.log('this.userName  :>> ', this.userName );
    },


    advancedFetch(){
      var param = {
        contentKey: "water_print"
      }
      return new Promise((resolve, reject) => {
        advancedFetch(param).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getInitAdvance(){
      const initData = await this.advancedFetch();
      console.log('initData.data :>> ', initData.data);
      var tempItem = this.textSizeSelect.find( i => i.mobileSize == initData.data.content.waterPrintSize)
      this.isSwitchOn = initData.data.content.isSwitchOn
      this.defineText = initData.data.content.waterPrintText
      this.showTextStatus = initData.data.content.waterPrintType == 0 ? true : false
      this.color = initData.data.content.waterPrintColor
      this.textSize = tempItem.value
      this.textPosition = initData.data.content.waterPrintPosition
    },


    advancedUpdate(){
      this.isLoadingData = true
      var tempItem = this.textSizeSelect.find( i => i.value == this.textSize)
      var param = {
        contentKey: "water_print",
        contentMap: {
          waterPrintText: this.defineText,
          waterPrintType: this.showTextStatus ? 0 : 1,
          waterPrintSize: tempItem.mobileSize,
          waterPrintPosition: this.textPosition,
          waterPrintColor: this.color,
          isSwitchOn: this.isSwitchOn
        }
      }
      console.log('param ---->> ', param);
      return new Promise((resolve, reject) => {
        advancedUpdate(param).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async submit(){
      if(this.defineText == '' && this.showTextStatus){
        this.$refs.defineName.focus()
        util.notify("請輸入自定義名稱！", 'error', 2000 );
        return false
      }

      const statusNameRes = await this.advancedUpdate();
      if (statusNameRes.errCode == 0) {
        this.isLoadingData = false
        util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
        return false;
      } else {
        this.isLoadingData = false
        util.notify(this.$t('deviceView.editFail'), 'warning', 3000);
        return false;
      }
    },


    itemInputChanged_overall(val){
      const content = filterString.all(val, 12);
      this.defineText = content
      const length = filterString.getContentLength(val);
      if(length > 12) {
        this.showInputLimit_overallItem = true
      } else {
        this.showInputLimit_overallItem = false
      }
    },

  
  }
};
</script>


<style lang="sass" scoped>
            
  .Data_safety
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start
    .setting_row
      width: 100%
      // border-bottom: 1px solid #eee
      padding-left: 20px
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      .setting_item
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        margin-right: 50px
        padding: 10px 0
        h6 
          margin-right: 12px
          line-height: 0

  .mobile_review
    width: 450px
    height: 598px
    background: url("../../../../static/img/mobile_review.jpg") center
    background-size: cover
    padding: 10px
    margin-bottom: 40px
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    .text_content
      // position: absolute
      // left: 10px
      // top: 10px
      
      color: #FFF
      font-size: 18px
      transition: all .3s

    
  .submit_btn
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
  .flex-row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    // width: fit-content

  .remider_setting 
    margin: 0 8px
  .select_audit
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    width: fit-content
    .select_audit_dep
      height: 36px
      margin-right: 30px


  .overall_options
    width: 100%
    padding: 10px 0

    .overall_row
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      margin-bottom: 20px

  .text_limit_sign
    position: relative
    text-align: left
    line-height: 20px
    font-size: 10px
    margin-top: 2px
    color: #ff2400
    display: block



  .setting-titles
    display: flex
    justify-content: space-between
    border-bottom: 1px solid #e3e9f4
  .setting-details
    margin: 30px
  .storevue-textarea
    width: 50vw
  .device-select
    .el-input__inner
        height: 30px
  .icon-gengduo
    width: 24px
    height: 24px
    vertical-align: middle
    cursor: pointer
    margin-left: 20px

  
</style>



<style scoped>
  .report-setting{
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
  /* .setting-titles{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  } */
  .setting-tabs{
    display: flex;
    justify-content: flex-start;
  }
  .setting-name{
    cursor: pointer;
    width: 120px;
    color: #7d8cad;
    padding: 15px calc(20/1920*100vw) 0 calc(20/1920*100vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .click-setting-btn{
    color: #f31d65;
    border-bottom: 4px solid #f31d65;
  }

  .save-btn{
    text-align: left;
    margin-top: 20px;
  }

  .title-info{
    text-align: left;
    padding-bottom: calc(20/1920*100vw);
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .left-item, .right-item{
    display: inline-flex;
    align-items: center;
    margin-right: 100px;
  }

  .input-name{
    width: 200px;
    /* height: 36px; */
  }
  .input-name.el-input--medium >>> .el-input__inner{
    height: 36px;
    line-height: 30px;
    font-size: 12px;
  }

  .input-name_short{
    width: 100px;
    height: 30px;
    margin: 0 8px;
  }
  .input-name_short.el-input--medium >>> .el-input__inner{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .span-font{
    font-size: 14px;
    color:#424151;
    /* width: 200px; */
    text-align: left;
  }
  .name-font{
    color:#424151;
    text-align: left;
    margin-right: calc(45/1920*100vw);
  }
  .enable-font{
    margin-right: 20px;
  }

  .name-tips{
    display:flex; 
    flex-direction:column;
    
  }
  .error-text{
    font-size: 12px;
    color: red;
    position: relative;
  }
  .error-text span{
    position: absolute;
  }
  .setting-config, .table-header{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* height: 60px; */
    padding: 15px 0;

  }
  .table-header{
    color: #424151;
    border: 1px solid #e3e9f4;
    border-bottom: none;
    font-weight: bold;
    background-color: #fff;
  }

  .detail-setting{
    /* padding: 0 calc(30/1920*100vw); */
  }
  .radio-setting{
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: center;
    margin-top: 20px;
  }
  .radio-setting .el-radio{
    height: 30px;
  }
  .setting-config{
    /* border-bottom: 1px solid #e3e9f4; */
    height: auto;
  }

  .setting-config:hover{
    cursor: pointer;
  }
  .basic-config, .basic-header{
    border: none;
    /* border-bottom: 1px solid #e3e9f4; */
    padding-left: calc(30/1920*100vw);
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: 100px;
    text-align: left;
    margin-right: 20px;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    width: 28%;
    text-align: left;
    
  }
  
 

  .sortable-ghost{
    color: #424151 !important;
    background: rgba(243, 19, 101, 0.1) !important;
    border: 1px solid #f31d65;
  }

  .statis-item{
    display: flex;
    height: 40px;
    align-items: center;
  }
  .el-radio{
    /* width: 90px !important; */
    margin-right: 20px;
  }
  .el-tooltip{
    margin-right: 30px;
    margin-left: 10px;
  }
  /* .setting-details{
    margin: 0 30px;
  } */
  .content-titles{
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 12px;
  }
  .template-select-area{
    display:flex; 
    flex-direction:row;
    height:calc(30/1920*100vw);
    width:200px;
    align-items:center;
    background-color:#f4f6f7;
    border-radius:5px;
    font-size: 13px;
    margin-right: 20px;
  }
  .template-select-label{
      color:#556679;
      font-family: NotoSansCJKtc;
      font-size: 13px;
      width:75px;
      margin-left:16px;
      line-height: 15px;
    }
  .inspect-basic{
    margin-bottom: 30px;
    position: relative;
  }

  .el-radio{
    color: #424151;
  }
  >>> .el-radio__input.is-checked + .el-radio__label{
    color: #424151;
  }
  .detail-table{
    /* border: 1px solid #e3e9f4;
    padding-bottom: 20px; */
    background-color: #f7f9fa
  }
  .promot-info{
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 12px;
    color: #7d8cad;
  }
</style>