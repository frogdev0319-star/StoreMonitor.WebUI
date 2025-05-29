<template>
  <div>
    <div class="submit_btn" >
      <delay-button type="filled" @click="submit" >
        <div class="button-area" style="width: 80px; height: 20px;">
          <span>{{$t('generalSetting.save')}} </span>
        </div>
      </delay-button>
    </div>

    <div class="page-container report-setting paper" style="padding-top: 30px;">

      <el-tabs  v-model="activeName" >
        <!-- 浮水印 -->
        <el-tab-pane :label="$t('advance.waterMark')" name="0">
          <div class="setting-titles padding flex-center">
            {{$t('advance.waterMarkSetting') }}
            <div class="spacer"></div>
          </div>

          <div v-loading="isLoadingData" class="setting-details self-loading">
            <div class="template-info">
              <div class="inspect-basic">

                <div class="water_setting">

                  <div class="setting_row" >
                    <div class="setting_item">
                      <el-switch
                        style="display: block"
                        v-model="isSwitchOn"
                        active-color="#c60957"
                        inactive-color="#eee"
                        :active-text="$t('advance.on')"
                        :inactive-text="$t('advance.off')"
                      >
                      </el-switch>
                    </div>
                  </div>

                  <div class="setting_row">
                    <div class="setting_item">
                      <h6> {{$t('advance.showMarkSetting') }}</h6>
                      <el-select v-model="showTextStatus" placeholder="請選擇" :disabled="!isSwitchOn">
                        <el-option
                          v-for="item in showText"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-input
                        ref="defineName"
                        v-model="defineText"
                        :disabled = "!isSwitchOn || showTextStatus == false"
                        :placeholder="$t('audit.workFlows.defineItem')"
                        style="width: 300px;  margin: 0 20px ;"
                        @input="(val) => itemInputChanged_overall(val)"
                        />
                      <span class="text_limit_sign" v-if="showInputLimit_overallItem"> {{$t('advance.maxCharacter') }} </span>
                    </div>

                  </div>
                  <div class="setting_row" style="margin-bottom: 40px;">
                    <div class="setting_item">
                      <h6>{{$t('advance.textColor') }} </h6>
                      <el-color-picker v-model="color" show-alpha :disabled="!isSwitchOn"></el-color-picker>
                    </div>

                    <div class="setting_item">
                      <h6>{{$t('advance.textSize') }} </h6>
                      <el-select v-model="textSize" :placeholder="$t('advance.opiton')" :disabled="!isSwitchOn">
                        <el-option
                          v-for="item in textSizeSelect"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="setting_item">
                      <h6>{{$t('advance.textPOsition') }}</h6>
                      <el-select v-model="textPosition" :placeholder="$t('advance.opiton')" :disabled="!isSwitchOn">
                        <el-option
                          v-for="item in textPositionSelect"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>

                  <div
                    class="mobile_review"
                    :style=" {
                      justifyContent: text_justifyContent,
                      alignItems: text_alignItems,

                      }">
                    <div
                      v-show="isSwitchOn"
                      class="text_content"
                      :style="{
                        color: color ,
                        fontSize: textSize,
                        transform: rotateDegree
                      }"
                    >
                      {{showTextStatus == false ? userName : defineText}}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('advance.DynamicWatermark')" name="1">

          <!-- ----動態浮水印設定--- -->
          <div class="setting-titles padding flex-center">
            {{$t('advance.DynamicWatermarkSetting') }}
            <div class="spacer"></div>
          </div>

          <div v-loading="isLoadingData" class="setting-details self-loading">
            <div class="template-info">
              <div class="inspect-basic">

                <div class="water_setting">

                  <div class="setting_row" >
                    <div class="setting_item">
                      <el-switch
                        style="display: block"
                        v-model="isSwitchOn_dynamic"
                        active-color="#c60957"
                        inactive-color="#eee"
                        :active-text="$t('advance.on')"
                        :inactive-text="$t('advance.off')"
                      >
                      </el-switch>
                    </div>
                  </div>

                  <!-- <div class="setting_row">
                    <div class="setting_item">
                      <h6> {{$t('advance.showMarkSetting') }}</h6>
                      <el-select v-model="showTextStatus" placeholder="請選擇" :disabled="!isSwitchOn_dynamic">
                        <el-option
                          v-for="item in showText"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-input
                        ref="defineName"
                        v-model="defineText"
                        :disabled = "!isSwitchOn_dynamic || showTextStatus == false"
                        :placeholder="$t('audit.workFlows.defineItem')"
                        style="width: 300px;  margin: 0 20px ;"
                        @input="(val) => itemInputChanged_overall(val)"
                        />
                      <span class="text_limit_sign" v-if="showInputLimit_overallItem"> {{$t('advance.maxCharacter') }} </span>
                    </div>
                  </div> -->

                  <div class="setting_row" style="margin-bottom: 40px;">
                    <div class="setting_item">
                      <h6>{{$t('advance.textColor') }} </h6>
                      <el-color-picker v-model="color_dynamic" show-alpha :disabled="!isSwitchOn_dynamic"></el-color-picker>
                    </div>

                    <div class="setting_item">
                      <h6>{{$t('advance.textSize') }} </h6>
                      <el-select v-model="textSize_dynamic" :placeholder="$t('advance.opiton')" :disabled="!isSwitchOn_dynamic">
                        <el-option
                          v-for="item in textSizeSelect_dynamic"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>

                    </div>
                    <div class="setting_item">
                      <h6>{{$t('advance.textPOsition') }}</h6>
                      <el-select v-model="textPosition_dynamic" :placeholder="$t('advance.opiton')" :disabled="!isSwitchOn_dynamic">
                        <el-option
                          v-for="item in textPositionSelect_dynamic"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div
                    class="mobile_review_dynamic"
                    style="justify-content: center; align-items: center;"
                    >
                    <div
                      v-show="isSwitchOn_dynamic"
                      class="text_content"
                      :style="{
                        color: color_dynamic ,
                        fontSize: textSize_dynamic,
                        transform: rotateDegree__dynamic
                      }"
                    >
                      {{userEmail}}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>


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
      activeName: "0",

      // dynamic
      isSwitchOn_dynamic: false,
      showTextStatus_dynamic: true,
      color_dynamic:'#FFFFFF',
      textSize_dynamic: this.$t('advance.m'),
      textPosition_dynamic: this.$t('advance.topLeftToBottomRight'),
      textPositionSelect_dynamic:[
        {
          value: "topLeftToBottomRight",
          label: this.$t('advance.topLeftToBottomRight')
        },
        {
          value: "bottomLeftToTopLeft",
          label: this.$t('advance.bottomLeftToTopLeft')
        },
      ],

      textSizeSelect_dynamic:[
        {
          value: "26.4px",
          label: this.$t('advance.l'),
          mobileSize: "66px"

        },
        {
          value: "17.6px",
          label: this.$t('advance.m'),
          mobileSize: "44px"
        },
        {
          value: "8.8px",
          label: this.$t('advance.s'),
          mobileSize: "22px"
        }
      ],

			isSwitchOn: false,
      userName: '',
      defineText: this.$t('audit.workFlows.defineItem'),
      showTextStatus: true,
      showText:[
        {
          value: true,
          label: this.$t('audit.workFlows.defineItem')
        }, {
          value: false,
          label: this.$t('advance.userName')
        }
      ],



      color:'#FFFFFF',
      textSize: this.$t('advance.m'),
      textSizeSelect:[
        {
          value: "26.4px",
          label: this.$t('advance.l'),
          mobileSize: "66px"

        },
        {
          value: "17.6px",
          label: this.$t('advance.m'),
          mobileSize: "44px"
        },
        {
          value: "8.8px",
          label: this.$t('advance.s'),
          mobileSize: "22px"
        }
      ],
      textPosition: this.$t('advance.topLeft'),
      textPositionSelect:[
        {
          value: "topLeft",
          label: this.$t('advance.topLeft')
        },
        {
          value: "topCenter",
          label: this.$t('advance.topCenter')
        },
        {
          value: "topRight",
          label: this.$t('advance.topRight')
        },
        {
          value: "centerLeft",
          label: this.$t('advance.centerLeft')
        },
        {
          value: "center",
          label: this.$t('advance.center')
        },
        {
          value: "centerRight",
          label: this.$t('advance.centerRight')
        },
        {
          value: "bottomLeft",
          label: this.$t('advance.bottomLeft')
        },
        {
          value: "bottomCenter",
          label: this.$t('advance.bottomCenter')
        },
        {
          value: "bottomRight",
          label: this.$t('advance.bottomRight')
        },
        {
          value: "topLeftToBottomRight",
          label: this.$t('advance.topLeftToBottomRight')
        },
        {
          value: "bottomLeftToTopLeft",
          label: this.$t('advance.bottomLeftToTopLeft')
        },
      ],

      text_justifyContent: "flex-start",
      text_alignItems: "flex-start",

      rotateDegree: 'rotate(0deg)',
      rotateDegree__dynamic: 'rotate(45deg)',
      showInputLimit_overallItem: false,
      userEmail: ''

    };
  },

  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    // accountChanged(val) {
    //   val !== 0 && this.init();
    // },

    textPosition(val, oldVal){

      switch (val) {
        case "topLeft":
          this.text_justifyContent = "flex-start"
          this.text_alignItems =  "flex-start"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "topCenter":
          this.text_justifyContent = "center"
          this.text_alignItems =  "flex-start"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "topRight":
          this.text_justifyContent = "flex-end"
          this.text_alignItems =  "flex-start"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "centerLeft":
          this.text_justifyContent = "flex-start"
          this.text_alignItems =  "center"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "center":
          this.text_justifyContent = "center"
          this.text_alignItems =  "center"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "centerRight":
          this.text_justifyContent = "flex-end"
          this.text_alignItems =  "center"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "bottomLeft":
          this.text_justifyContent = "flex-start"
          this.text_alignItems =  "flex-end"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "bottomCenter":
          this.text_justifyContent = "center"
          this.text_alignItems =  "flex-end"
          this.rotateDegree = 'rotate(0deg)'
          break
        case "bottomRight":
          this.text_justifyContent = "flex-end"
          this.text_alignItems =  "flex-end"
          this.rotateDegree = 'rotate(0deg)'
          break

        case "topLeftToBottomRight":
          if(val == this.textPosition_dynamic){
            util.notify("與動態浮水印位置重疊，請重新選取位置或修改一般浮水印位置設定", 'error', 3000 );
            this.textPosition = oldVal
            return
          }

          this.text_justifyContent = "center"
          this.text_alignItems =  "center"
          this.rotateDegree = 'rotate(45deg)'
          break
        case "bottomLeftToTopLeft":
        if(val == this.textPosition_dynamic){
            util.notify("與動態浮水印位置重疊，請重新選取位置或修改一般浮水印位置設定", 'error', 3000 );
            this.textPosition = oldVal
            return
          }
          this.text_justifyContent = "center"
          this.text_alignItems =  "center"
          this.rotateDegree = 'rotate(-45deg)'
          break
        default:
          break;
      }
    },

    textPosition_dynamic(val){
      switch (val) {
        case "topLeftToBottomRight":
          if(val == this.textPosition){
              util.notify("與一般浮水印位置重疊，請重新選取位置或修改一般浮水印位置設定", 'error', 3000 );
              this.textPosition_dynamic = "bottomLeftToTopLeft"
              return
            }

          this.rotateDegree__dynamic = 'rotate(45deg)'
          break
        case "bottomLeftToTopLeft":
          if(val == this.textPosition){
              util.notify("與一般浮水印位置重疊，請重新選取位置或修改一般浮水印位置設定", 'error', 3000 );
              this.textPosition_dynamic = "topLeftToBottomRight"
              return
            }
          this.rotateDegree__dynamic = 'rotate(-45deg)'
          break
        default:
          break;
      }
    },

  },

  created() {
    console.log('waterMark!!!!')
    this.init()

  },

  methods: {
    async init(){
      await this.getUserInfo()
      await this.getInitAdvance()
    },

    // get user
    async getUserInfo(){
      const result = await this.$store.dispatch("GetUserAuthorities");
      this.userName = result.data.userName
      this.userEmail = result.data.email.split("@")[0];

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
    advancedFetch_dynamic(){
      var param = {
        contentKey: "dynamic_print"
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
      const initData_dynamic = await this.advancedFetch_dynamic();
      // console.log('initData.data :>> ', initData.data);
      console.log('initData_dynamic', initData_dynamic)

      var tempItem = this.textSizeSelect.find( i => i.mobileSize == initData.data.content.waterPrintSize)
      this.isSwitchOn = initData.data.content.isSwitchOn
      this.defineText = initData.data.content.waterPrintText
      this.showTextStatus = initData.data.content.waterPrintType == 0 ? true : false
      this.color = initData.data.content.waterPrintColor
      this.textSize = tempItem.value
      this.textPosition = initData.data.content.waterPrintPosition

      // dynamic
      if( Object.keys(initData_dynamic.data.content).length === 0){
        console.log("{{{}}}")
        this.isSwitchOn_dynamic = this.isSwitchOn_dynamic
        this.color_dynamic = '#FFFFFF'
        this.textSize_dynamic = this.$t('advance.m')
        this.textPosition_dynamic = this.$t('advance.topLeftToBottomRight')

      } else {
        var tempItem_dynamic = this.textSizeSelect_dynamic.find( i => i.mobileSize == initData_dynamic.data.content.waterPrintSize)
        console.log('initData_dynamic :>> ', initData_dynamic);
        this.isSwitchOn_dynamic = initData_dynamic.data.content.isSwitchOn
        this.color_dynamic = initData_dynamic.data.content.waterPrintColor
        this.textSize_dynamic = tempItem_dynamic ? tempItem_dynamic.value : "17.6px"
        this.textPosition_dynamic = initData_dynamic.data.content.waterPrintPosition
      }

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

    advancedUpdate_dynamic(){
      this.isLoadingData = true
      var tempItem_dynamic = this.textSizeSelect_dynamic.find( i => i.value == this.textSize_dynamic)

      console.log("this.textSize_dynamic", this.textSize_dynamic)
      console.log("this.textSizeSelect_dynamic", this.textSizeSelect_dynamic)
      console.log("tempItem_dynamic", tempItem_dynamic)

      var param = {
        contentKey: "dynamic_print",
        contentMap: {
          waterPrintText: this.userEmail,
          waterPrintType: 1,
          waterPrintSize: tempItem_dynamic ? tempItem_dynamic.mobileSize : "17.6px" ,
          waterPrintPosition: this.textPosition_dynamic,
          waterPrintColor: this.color_dynamic,
          isSwitchOn: this.isSwitchOn_dynamic
        }
      }
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
        util.notify(this.$t('advance.inputName'), 'error', 2000 );
        return false
      }

      const statusNameRes = await this.advancedUpdate();
      const statusNameRes_dynamic = await this.advancedUpdate_dynamic();

      console.log('statusNameRes_dynamic', statusNameRes_dynamic)

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
      const content = filterString.all(val, 32);
      this.defineText = content
      const length = filterString.getContentLength(val);
      if(length > 32) {
        this.showInputLimit_overallItem = true
      } else {
        this.showInputLimit_overallItem = false
      }
    },


  }
};
</script>


<style lang="sass" scoped>

  .water_setting
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start
    .setting_row
      width: 100%
      border-bottom: 1px solid #eee
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

  .mobile_review_dynamic
    width: 450px
    height: 598px
    background: url("../../../../static/img/mobile_review_dynamic.jpg") center
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
