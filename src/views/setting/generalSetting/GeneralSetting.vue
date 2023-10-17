<template>
  <div>
    <div class="submit_btn" >
      <delay-button type="filled" @click="submit">
        <div class="button-area" style="width: 80px; height: 20px;">
          <span>{{$t('generalSetting.save')}}</span>
        </div>
      </delay-button>
    </div>
  
    <div class="page-container report-setting paper" >
      <div class="setting-titles padding flex-center">
        {{$t('generalSetting.timeoutReminder')}}  
        <div class="spacer"></div>
      </div>
      <!-- 超時提醒 -->
      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="template-info">
          <div class="inspect-basic">

            <!-- 事件超時未處理提醒 -->
            <setting-table :table-name="$t('generalSetting.eventTimeoutReminder')">
              <template slot="tableDetail">
                <!-- row -->
                <div class="setting-config basic-config">
                  <div class="title-status">
                    <el-checkbox
                      v-model="enableDelay"
                      class="storevue-checkbox-outlined"
                      :label="$t('generalSetting.eventTimeoutReminder')"/>
                  </div>
                </div>
                
                <!-- row -->
                <div class="setting-config basic-config">
                  <div class="title-status ">
                    {{$t('generalSetting.moreThanDays')}}
                    <el-input
                      v-model="delayDay"
                      ref="delay_day"
                      placeholder=""
                      type="number"
                      :disabled="!enableDelay"
                      :min="1"
                      @change="onEventChanged"
                      class="input-name_short"
                      />
                    {{$t('audit.workFlows.day')}}
                  </div>
                  <div class="title-status flex-row">
                    {{$t('generalSetting.reminderTime')}}
                    <div class="remider_setting ">
                      <el-time-select
                        v-model="alertTime"
                        :disabled="!enableDelay"
                        :picker-options="{
                          start: '00:00',
                          step: '0:30',
                          end: '23:00'
                        }"
                        :placeholder="$t('generalSetting.reminderTime')">
                      </el-time-select>
                    </div>
                  </div>
                </div>
              </template>
            </setting-table>

        
            <!-- 節點停留時間 -->
            <setting-table :table-name="$t('generalSetting.signatureTimeoutReminder')" style="margin-top: 20px;">
              <template slot="tableDetail">
                <!-- row -->
                <div class="setting-config basic-config">
                  <div class="title-status">
                    <el-checkbox
                      v-model="wokflowDelay"
                      class="storevue-checkbox-outlined"
                      :label="$t('generalSetting.signatureTimeoutReminder')"/>
                  </div>
                </div>
                
                <!-- row -->
                <div class="setting-config basic-config">
                  <div class="title-status ">
                    {{$t('generalSetting.daysOfStay')}}
                    <el-input
                      v-model="workflowDay"
                      :disabled="!wokflowDelay"
                      ref="workflow_day"
                      placeholder=""
                      type="number"
                      @change="onWokflowChanged"
                      class="input-name_short"
                      />
                    {{$t('audit.workFlows.day')}}
                  </div>
                  <div class="title-status flex-row">
                    {{$t('generalSetting.reminderTime')}}
                    <div class="remider_setting ">
                      <el-time-select
                        v-model="wokflowTime"
                        :disabled="!wokflowDelay"
                        :picker-options="{
                          start: '00:00',
                          step: '0:30',
                          end: '23:00'
                        }"
                        placeholder="$t('generalSetting.reminderTime')">
                      </el-time-select>
                    </div>
                  </div>
                </div>
              </template>
            </setting-table>
          </div>
        </div>
      </div>
    </div>

    <div class="page-container report-setting paper" >
      <div class="setting-titles padding flex-center">
        {{$t('generalSetting.reports')}}  
        <div class="spacer"></div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="template-info">
          <div class="inspect-basic">
            <!-- 巡檢總評選項顯示 -->
            <setting-table :table-name="$t('insSettingView.commentStatus')">
              <div slot="tableDetail" class="setting-config rule-item" style="flex-direction: column; align-items: flex-start">
                <div class="overall_options">

                  <div class="overall_row" v-for="(item, index) in defaultDefineName" :key="index">
                    <el-radio-group class="storevue-radio radio_item" v-model="item.defineStatus" style="margin-left: 20px;">
                      <el-radio :label="0" style="  min-width: 100px; text-align: left;" >{{item.name}}</el-radio>
                      <el-radio :label="1" style=" width: fit-content;">{{ $t('insSettingView.userDefined')}} </el-radio>
                    </el-radio-group>
                    <el-input
                      :ref=item.refName
                      :placeholder="$t('audit.workFlows.defineItem')"
                      v-model="item.newName"
                      :disabled="item.defineStatus == 0"
                      style="width: 200px;  margin: 0 20px ;"
                      @input="(val) => itemInputChanged_overall({ val, item })"
                      />
                  </div>

                  <span class="text_limit_sign" v-if="showInputLimit_overallItem"> {{$t('insSettingView.inputRuletip')}} </span>
                </div>
              </div>
            </setting-table>

            <!-- 報表檢視權限 -->
            <setting-table :table-name="$t('generalSetting.reportViewPermissions')" style="margin-top: 20px;">
              <div slot="tableDetail" class="setting-config rule-item" style="flex-direction: column; align-items: flex-start">
                <div class="overall_options">

                  <div class="overall_row" >
                    <el-radio-group class="storevue-radio radio_item" v-model="viewReportByTagAuth" style="margin-left: 20px;">
                      <el-radio :label="1" style="  min-width: 100px; text-align: left; margin-right: 50px;" >{{$t('generalSetting.viewReportbyFormExecutionPermissions')}}</el-radio>
                      <el-radio :label="0" style=" width: fit-content;">{{$t('generalSetting.viewReportsByStorePermissions')}} </el-radio>
                    </el-radio-group>
                  </div>

                  <span class="text_limit_sign" v-if="showInputLimit_overallItem"> {{$t('insSettingView.inputRuletip')}} </span>
                </div>
              </div>
            </setting-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 巡檢事件 -->
    <div class="page-container report-setting paper" >
      <div class="setting-titles padding flex-center">
        巡檢事件
        <div class="spacer"></div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="template-info">
          <div class="inspect-basic">
            <setting-table table-name="逾期結案" style="margin-top: 20px;">
              <div slot="tableDetail" class="setting-config rule-item" style="flex-direction: column; align-items: flex-start">
                <div class="overall_options">

                  <div class="overall_row" >
                    <el-radio-group class="storevue-radio radio_item" v-model="dueDayIsFeatureOn" style="margin-left: 20px;">
                      <el-radio :label="1" style="  min-width: 60px; text-align: left; margin-right: 50px;" >開啟</el-radio>
                      <el-radio :label="0" style=" width: fit-content;">關閉 </el-radio>
                    </el-radio-group>
                  </div>
                  
                  <div class="title-status" style="margin-left: calc(26/1920*100vw);">
                    逾期天數
                    <el-input
                      v-model="overDueDay"
                      ref="overDue_Day"
                      placeholder=""
                      type="number"
                      :disabled="dueDayIsFeatureOn == 0"
                      :min="1"
                      @change="onOverDueDay"
                      class="input-name_short"
                      />
                    {{$t('audit.workFlows.day')}}
                  </div>
                  
                  <span class="text_limit_sign" v-if="showInputLimit_overallItem"> {{$t('insSettingView.inputRuletip')}} </span>
                </div>
              </div>
            </setting-table>
          </div>
        </div>
      </div>

    </div>
  </div>
  
</template>

<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import { inpectRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import filterString from '@/common/filterString.js';

import TablePagination from '@/components/TablePagination';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';

export default {
  name: 'GeneralSetting',
  components: { 
    DelayButton,
    SettingTable

  },
  data() {
    return {
      isLoadingData: false,

      changeNotify: false,
      enableDelay: false,
      delayDay: 1,
      alertTime: '09:00',

      wokflowDelay: false,
      workflowDay: 1,
      wokflowTime: '09:00',

      showInputLimit_overallItem: false,
      defaultDefineName:[
        {
          name: this.$t('overview.danger') ,
          newName:  this.$t('overview.danger'),
          defineStatus: 0,
          refName: 'bad',
          is_customize: false
        },
        {
          name: this.$t('overview.improve'),
          newName: this.$t('overview.improve'),
          defineStatus: 0,
          refName: 'fair',
          is_customize: false
        },
        {
          name: this.$t('overview.echartGood'),
          newName: this.$t('overview.echartGood'),
          defineStatus: 0,
          refName: 'good',
          is_customize: false
        },
      ],

      viewReportByTagAuth: 0,

      dueDayIsFeatureOn: 1,
      overDueDay: 90
      
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      val !== 0 && this.init();
    },

    defaultDefineName:{
      immediate: false,
      deep: true,
      handler (val, old ) {
        // if(val[0].defineStatus == 0) val[0].newName = val[0].name
        for(let i of val ){
          if(i.defineStatus == 0) {
            i.newName = i.name
            i.is_customize = false
          } else if(i.defineStatus == 1){
            i.is_customize = true
          }
        }
        console.log('val :>> ', val);
      }
    },
    
    enableDelay(val){
      if(val == true && this.delayDay == undefined)  this.delayDay = 1
    },
    
    wokflowDelay(val){
      if(val == true && this.workflowDay == undefined)  this.workflowDay = 1
    },

    dueDayIsFeatureOn(val){
      console.log('val :>> ', val);
      if(val == 0 )  this.overDueDay = 90
    }


  },

  async created() {
    this.init()

    
  },

  methods: {
    async init(){
      await this.getInspectStatus()
      for (let i = 0; i < 3; i++) {
        if(this.inspectStatus["is_customize_" + i] == false){
          this.defaultDefineName[i].defineStatus = 0
          this.defaultDefineName[i].newName = this.defaultDefineName[i].name
        } else {
            this.defaultDefineName[i].defineStatus = 1
            this.defaultDefineName[i].newName = this.inspectStatus["status_"+ i]
        }
      }

      
    },


    getInspectStatus(){
      return new Promise((resolve, reject) => {
        inpectRESTful.getInspectStatus().then(res => {
          resolve(res);
          console.log('res.data', res.data)

          if(res.data.settingContent.general_setting_event_push_config.checkTime !== -1){
            // event
            this.enableDelay = res.data.settingContent.general_setting_event_push_config.isNotify
            this.delayDay = res.data.settingContent.general_setting_event_push_config.eventUnHandleNotifyDay
            var eventCT =  res.data.settingContent.general_setting_event_push_config.checkTime
            console.log('eventCT :~~~~~>> ', eventCT);
            if( eventCT == null) {
              this.alertTime = "09:00"
            } else {
              var geteventT  = new Date(eventCT)
              console.log('geteventT', geteventT)
              this.alertTime = geteventT.toString().slice(16, 21)
              console.log('this.alertTime', this.alertTime)
            }
          } else {
            this.enableDelay = false
            this.alertTime = "09:00"
          }

          if(res.data.settingContent.general_setting_workflow_config.checkTime !== -1){
            // workflow
            this.wokflowDelay = res.data.settingContent.general_setting_workflow_config.isNotify
            this.workflowDay = res.data.settingContent.general_setting_workflow_config.unHandleNotifyDay
            var workflowCT =  res.data.settingContent.general_setting_workflow_config.checkTime
            if( workflowCT == null) {
              this.wokflowTime = "09:00"
            } else {
            var getworkflowT  = new Date(workflowCT)
            this.wokflowTime = getworkflowT.toString().slice(16, 21)
            console.log('this.wokflowTime', this.wokflowTime)
            }
          } else {
            this.wokflowDelay = false
            this.wokflowTime = "09:00"
          }
          
          this.inspectStatus = res.data.settingContent.general_setting_inspect_status_name
          delete this.inspectStatus.update_time
          delete this.inspectStatus.update_user_id

          this.viewReportByTagAuth = res.data.settingContent.general_setting.view_report_by_tag_auth == true ? 1 : 0
          console.log('this.inspectStatus :>> ', this.inspectStatus);

          this.dueDayIsFeatureOn = res.data.settingContent.general_setting_event_event_over_due_day_config.isFeatureOn == true ? 1 : 0
          this.overDueDay = res.data.settingContent.general_setting_event_event_over_due_day_config.overDueDay 


        }).catch(err => {
          reject(err);
        });
      });
    },


    getSettingTimestamp(day, t){
      var tempTiming = new Date()
      tempTiming = tempTiming.setDate(tempTiming.getDate() + day)
      tempTiming = new Date(tempTiming)
      console.log('tempTiming -->', tempTiming)
      var onlyDate = tempTiming.toString().slice(0, 16)

      var eventT = onlyDate + t
      return Date.parse(eventT)
    },

    updateInspectStatus(){
      const delayDay =  Number(this.delayDay)
      const workflowDay =  Number(this.workflowDay)
      var t = new Date();
      var tString = t.toTimeString()
      var timeZone = tString.slice(12,15)

      // for event
      var eventCheckTime = this.getSettingTimestamp(delayDay, this.alertTime)
      console.log('eventCheckTime', eventCheckTime)

      // for workflow
      var workflowTime = this.getSettingTimestamp(workflowDay, this.wokflowTime)
      console.log('workflowTime', workflowTime)

      var status = {
          status_0: this.defaultDefineName[0].newName,
          is_customize_0: this.defaultDefineName[0].is_customize,
          status_1: this.defaultDefineName[1].newName,
          is_customize_1: this.defaultDefineName[1].is_customize,
          status_2: this.defaultDefineName[2].newName,
          is_customize_2: this.defaultDefineName[2].is_customize,

          workflowSettingConfig: {
            isNotify: this.wokflowDelay,
            unHandleNotifyDay: workflowDay,
            checkTime: workflowTime
          },
          eventNotifyConfig: {
              isNotify: this.enableDelay,
              unHandleNotifyDay: delayDay,
              checkTime: eventCheckTime
          },
          time_zone: timeZone,
          view_report_by_tag_auth: this.viewReportByTagAuth == 1 ? true : false,

          eventOverDueDayConfig:{
            isFeatureOn: this.dueDayIsFeatureOn == 1 ? true : false,
            overDueDay: this.overDueDay
          }

          
      }

      console.log('status ~~~~~~~~>> ', status);
      return new Promise((resolve, reject) => {
        inpectRESTful.updateInspectStatus(status).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });

    },

    async submit(){
      for (let i = 0; i < 3; i++) {
        if(this.defaultDefineName[i].defineStatus == 1 && this.defaultDefineName[i].newName == "") {
          // this.$refs.stayOver.focus()
          util.notify(this.defaultDefineName[i].name + ", "+ this.$t('audit.workFlows.cantEmptyInspectStatus'), 'error', 2000)
          return
          }
      }

      if(this.enableDelay && this.delayDay == undefined){
        util.notify(this.$t('audit.workFlows.cantEmptyDays'), 'error', 2000 );
        this.$refs.delay_day.focus()
        return
      }
      else if(this.delayDay > 90){
        util.notify('天數不可大於 90 天', 'error', 2000 );
        this.$refs.delay_day.focus()
        return
      }
      else if(this.workflowDay > 90){
        util.notify('天數不可大於 90 天', 'error', 2000 );
        this.$refs.workflow_day.focus()
        return
      }
      else if(this.overDueDay > 365){
        util.notify('逾期結案天數不可大於 365 天', 'error', 2000 );
        this.$refs.overDue_Day.focus()
        return
      }


      const statusNameRes = await this.updateInspectStatus();
      if (statusNameRes.errCode == 0) {
        this.getInspectStatus()
        util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
        return false;
      } else {
        util.notify(this.$t('deviceView.editFail'), 'warning', 3000);
        return false;
      }
    },


    itemInputChanged_overall({ val, item }){
      const content = filterString.all(val, 20);
      item.newName = content
      const length = filterString.getContentLength(val);
      if(length > 20) {
        this.showInputLimit_overallItem = true
      } else {
        this.showInputLimit_overallItem = false
      }
    },

    onEventChanged(e){
      if(e<=0){
        this.delayDay=1;
      }else{
        this.delayDay = e;
      }
    },

    onWokflowChanged(e){
      if(e<=0){
        this.workflowDay=1;
      }else{
        this.workflowDay = e;
      }
    },
    onOverDueDay(e){
      if(e<=0){
        this.overDueDay=1;
      }else{
        this.overDueDay = e;
      }
    },




  }
};
</script>


<style lang="sass" scoped>
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
    margin-left: 25px
    font-size: 10px
    margin-top: 2px
    color: #ff2400
    display: block






  .search_member
    height: 36px
    font-size: 14px
    color: #d5d5d5
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    width: fit-content
    pointer-events: none

    i 
      margin-right: 5px
      color: #d5d5d5
  .clickable
    color: #006ab7
    cursor: pointer
    pointer-events: auto !important
    i 
      color: #006ab7

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start

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
  .for_row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .go_up
      margin-right: 20px
      color: #006ab7
    .go_down
      color: #006ab7
  .add-node-btn
    position: absolute
    right: 1%
    top: 3px
  .approve
    width: 60vw
  .approve_row
    background-color: #f7f9fa
    padding: calc(15/1920*100vw) calc(20/1920*100vw)
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .el-input
      margin-left: 10px
  
  .dialog-content
    width: 100%
    .showing_search_user
      width: 100%
      height: 500px
      
      .filter_section
        background: #FFF
        display: flex
        flex-wrap: wrap
        flex-direction: row
        justify-content: flex-start
        align-items: center
        padding: 10px 0 0 0
        margin-bottom: 10px
        .summit_filter
          width: 90px
          height: 37px
          border-radius: 3px
          background: rgb(85, 102, 121)
          color: #FFF
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          margin-bottom: 10px
          margin-left: 20px
          cursor: pointer
          transition: all .3s
          &:hover
            background: rgb(60, 92, 121)
      .is_select
        width: 100% !important
        padding: 10px 0 5px 0
        background: #FFF
        margin-bottom: 10px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        width: fit-content
        .title-name
          width: 90px
        .user_selected
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          .el-tag
            margin-right: 5px 
            margin-bottom: 5px

      .users
        height: 335px
        overflow: auto
        border-radius: 5px
</style>

<style lang="sass">
  .title-status
    .el-input__count-inner
      margin-top: 55px
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button 
      -webkit-appearance: none
      margin: 0



  .popup_width
    .el-dialog
      width: 70% !important
      background: #f7f9fa
      .el-table th
        &:first-child
          .cell
            width: 50px
            margin-left: -28px

  .users
    .el-checkbox__input.is-checked .el-checkbox__inner
      background: #2c90d9 !important
      border-color: #2c90d9 !important
      &:hover
        border-color: #dcdfe6 !important
    .is-focus .el-checkbox__inner      
      border-color: #dcdfe6 !important
    
    .el-checkbox__inner:hover
      border-color: #190 !important
      
  .title-status
    .el-input__count-inner
      margin-top: 55px
      
  .text_limit_notice
    position: absolute
    text-align: right
    margin-left: 5px
    font-size: 10px
    margin-top: 2px
    color: #ff2400
    display: block
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