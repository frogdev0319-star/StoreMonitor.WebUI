<template>
  <div class="page-container report-setting paper" style="height: 100%">
    <div class="setting-titles padding flex-center">
      超時提醒  
      <div class="spacer"></div>
      <div class="buttons">
        <delay-button type="filled" >  {{$t('audit.workFlows.saveAndEnable')}}</delay-button>
      </div>
    </div>

    <!-- <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table table-name="事件超時未處理提醒">
            <template slot="tableDetail">
              <div class="setting-config">
                <div class="flex-row" style="margin-right: 30px">
                  <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.workFlowName')}}</div>
                  <div class="title-status"> 
                      


                  </div>  
                </div>
              </div>
            </template>
          </setting-table>
        </div>


      </div>
  
    </div> -->

    <!-- 節點停留時間 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table table-name="事件超時未處理提醒">
            <template slot="tableDetail">
              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-status">
                  <el-checkbox
                    class="storevue-checkbox-outlined"
                    :label="$t('audit.workFlows.alertAtOverTime')"/>
                </div>
              </div>
              
              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-status ">
                  {{$t('audit.workFlows.stayOver')}}
                  <el-input
                    ref="stayOver"
                    placeholder=""
                    type="number"
                    max="50"
                    class="input-name_short"
                    />
                  {{$t('audit.workFlows.day')}}
                </div>
                <div class="title-status flex-row">
                  提醒時間
                  <div class="remider_setting ">
                    <el-time-select
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00'
                      }"
                      placeholder="提醒時間">
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
</template>

<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';


import { titleRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
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
      isLoadingData: false
      
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      val !== 0 && this.getTitleList();
    }
  },

  created() {
  },

  methods: {
  
  }
};
</script>


<style lang="sass" scoped>
  
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
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
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
    width: 25%;
    text-align: left;
    
  }
  
  .title-operation{
    /* width: 20%; */
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