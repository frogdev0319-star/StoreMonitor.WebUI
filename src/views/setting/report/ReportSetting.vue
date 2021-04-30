<template>
    <div class="page-container report-setting">
      <div class="template-titles">
        <div class="names">
          <div v-for="(item,index) in templateList"
               class="template-name"
               :class="{'click-btn' : curTemplateIndex === index}"
               :key="index"
            @click="displayTemplateInfo(index)">
            {{ item.name }}
          </div>
        </div>
        <div class="buttons">
          <delay-button
            class="schedule-btn"
            @click="addReportTemplate">
            <div class="button-area">
              <i class="iconfont el-icon-plus"/>
              <span>{{ $t('titleView.add') }}</span>
            </div>
          </delay-button>
          <delay-button
            :disabled="templateList.length === 0"
            class="schedule-btn"
            @click="deleteReportTemplate">
            <div class="button-area">
              <i class="iconfont icon-shanchu"/>
              <span>{{ $t('titleView.delete') }}</span>
            </div>
          </delay-button>
        </div>

      </div>
      <div class="template-info">
        <div class="title-info" >
          <div class="left-item">
            <span class="required-name">*</span>
            <span class="name-font">{{$t('titleView.templateName')}}</span>
            <div class="name-tips">
              <el-input v-model="curTemplate.name" class="input-name" :placeholder="$t('titleView.enterTemplateName')"
                        @input="onTemplateNameChange" @blur="showTemplateTip = false"></el-input>
              <span v-if="showTemplateTip" class="error-text"><span>
                {{templateNameTip}}
              </span></span>
            </div>
          </div>
          <div class="right-item">
            <span class="enable-font">{{$t('scheduleView.enable')}}</span>
            <el-switch v-model="curTemplate.enable" @change="changTemplateEnableStatus">{{curTemplate.enable}}</el-switch>
          </div>
        </div>
        <div class="titles-header">
          <div class="title-name">{{$t('titleView.componentName')}}</div>
          <div class="title-status">{{$t('titleView.componentStatus')}}</div>
          <div class="title-operation">{{$t('titleView.operation')}}</div>
        </div>
        <draggable v-model="list">
          <div class="setting-config" v-for="item in list" :key="item.position">
            <div class="title-name">{{$t(`titleView.${item.name}`)}}</div>
            <div class="title-status"><el-switch v-model="item.enable"></el-switch></div>
            <div class="title-operation">
              <span class="iconfont icon-gengduo" v-if="item.name === 'statistics'" @click="setStatusDetail(item)"></span>
            </div>
          </div>
        </draggable>
      </div>


      <div class="save-btn">
        <delay-button
          class="schedule-btn"
          @click="saveTemplateInfo">
          <div class="button-area">
            <span>{{ $t('titleView.save') }}</span>
          </div>
        </delay-button>
      </div>
      <dialog-pop
        v-if="showStaticDetailSetting"
        :title="$t('titleView.inspectionStaticSetting')"
        :append-to-body="true"
        :close-on-click-modal="false"
        :visible="showStaticDetailSetting"
        dialog-width="540px"
        @visibleChangeHandler="updateStaticSettingDialogFlag"
        @cancelHandler="hideStaticSettingDialog"
        @confirmHandler="confirmStaticSetting"
      >
        <div class="dialog-slot">
          <div class="statis-content">
            <div class="statis-item">
              <span class="span-font">{{$t('titleView.statisIndex')}}</span>
              <span>
                <el-radio-group v-model="statisticSettingDetail.qualified">
                  <el-radio :label="0">{{$t('titleView.qualified')}}</el-radio>
                  <el-radio :label="1">{{$t('titleView.unqualified')}}</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="statis-item">
              <span class="span-font">{{$t('titleView.displayofStatisticalResults')}}</span>
              <span>
                <el-radio-group v-model="statisticSettingDetail.chart">
                  <el-radio :label="0">{{$t('titleView.radar')}}</el-radio>
                  <el-radio :label="1">{{$t('titleView.pie')}}</el-radio>
                </el-radio-group>
              </span>
            </div>
          </div>
        </div>
      </dialog-pop>
    </div>
</template>

<script>
  import DelayButton from '@/components/DelayButton';
  import util from '@/common/util';
  import filterString from '@/common/filterString';
  import ReportSetting from  '@/api/reportSetting'
  import TablePagination from '../../../components/TablePagination';
  import draggable from 'vuedraggable';
  import DialogPop from '../../../components/DialogPop';

  export default {
    name: 'reportSetting',
    components: { DialogPop, TablePagination, DelayButton, draggable },
    data(){
      return {
        curTemplate: 0,
        templateList: [],
        showTemplateTip: false,
        isLoadingData: false,
        list: [],
        curTemplateIndex: 0,
        templateNameTip: '',
        showStaticDetailSetting: false,
        statisticSettingDetail: {chart: 0, qualified: 0},
      }
    },

    created(){
      this.getInspectTemplateList();
    },

    methods:{
      getInspectTemplateList(){
        ReportSetting.getInspectReportTemplateList().then(res => {
          if(res.errCode === 0 && res.data.length > 0){
            this.templateList = res.data;
            this.templateList.map(template => {
              template.originalName = template.name;
              template.originalEnable = template.enable;
            });
            this.curTemplate = JSON.parse(JSON.stringify(this.templateList[0]));
            this.list = this.curTemplate.config.switches;
            this.curTemplateIndex = 0;
          }
          else{
            this.templateList = [];
            this.curTemplate = [];
            this.list = [];
            this.curTemplateIndex = 0;
          }
        }).catch(err => {
          console.log('ReportSetting:' + err);
        })
      },

      onTemplateNameChange(val){
        const tempName = filterString.all(val, 30);
        this.curTemplate.name = tempName;
        this.templateList[this.curTemplateIndex].name = tempName;
        const length = filterString.getContentLength(val);
        if (length > 30) {
          this.showTemplateTip = true;
          this.templateNameTip = this.$t('scheduleView.scheduleNameRuletip');
          return;
        } else {
          this.showTemplateTip = false;
        }
        let nameList = this.templateList.filter(item => item.id !== -1
          && item.id !== this.templateList[this.curTemplateIndex].id)
          .map(item => item.originalName);
        if(nameList.includes(tempName)){
          this.showTemplateTip = true;
          this.templateNameTip = this.$t('titleView.templateNameExist');
          return;
        } else {
          this.showTemplateTip = false;
        }
      },


      changTemplateEnableStatus(val){
        const templateEnableInDB = this.templateList.filter(item => item.originalEnable === true && item.id !== -1);
        if(!val && this.curTemplate.id !== -1
          && templateEnableInDB.length === 1
          && templateEnableInDB[0].id === this.curTemplate.id){
          this.curTemplate.enable = true;
          util.notify(this.$t('titleView.enableTemplate'), 'warning', 3000);
        }
      },

      addReportTemplate(){
        if(this.templateList.length >= 5){
          util.notify(this.$t('titleView.templateOutOfLimit'), 'warning', 3000);
          return false;
        }
        this.templateList.forEach(item => {item.originalEnable = item.enable});
        this.pushTemplateToList();
        this.curTemplate = this.templateList[this.templateList.length - 1];
        this.list = this.curTemplate.config.switches;
        this.curTemplateIndex = this.templateList.length - 1;
      },

      pushTemplateToList(){
        const templateObj = {
          "id": -1,
          "name": "",
          "enable": true,
          "config": {
            "switches": [
              {
                "enable": true,
                "name": "comment",
                "position": 1
              },
              {
                "qualified": 0,
                "enable": true,
                "name": "statistics",
                "position": 2,
                "chart": 0
              },
              {
                "enable": true,
                "name": "summaryTable",
                "position": 3
              },
              {
                "enable": true,
                "name": "focalItem",
                "position": 4
              },
              {
                "enable": true,
                "name": "feedbackItem",
                "position": 5
              },
              {
                "enable": true,
                "name": "qualifiedItem",
                "position": 6
              },
              {
                "enable": false,
                "name": "ignoredItem",
                "position": 7
              }
            ]
          }
        }
        this.templateList.push(templateObj);
      },

      deleteReportTemplate(){
        if(this.curTemplate.id !== -1 && this.templateList.filter(item => item.id !== -1).length === 1){
          util.notify(this.$t('titleView.atLeastOneTemplate'), 'warning', 3000);
          return false;
        }
        const enableTemplateList = this.templateList.filter(item => item.originalEnable === true);
        if(this.curTemplate.id !== -1 && enableTemplateList[0].id === this.curTemplate.id){
          util.notify(this.$t('titleView.noEnableTemplate'), 'warning', 3000);
          return false;
        }
        this.curTemplate.id === -1 ? this.templateList.splice(this.curTemplateIndex, 1) : this.deleteReportTemplateFromDB();
        this.curTemplate = JSON.parse(JSON.stringify(this.templateList[0]));
        this.list = this.curTemplate.config.switches;
        this.curTemplateIndex = 0;
      },

      deleteReportTemplateFromDB(){
        const deleteParams = {ids: []};
        deleteParams.ids.push(this.curTemplate.id);
        ReportSetting.deleteInspectReportTeplate(deleteParams).then(res => {
          this.notifyMsg(res, 'delete')
        }).catch(err => {
          util.notify(this.$t('deviceView.deleteFail'), 'warning', 3000);
        });
      },

      displayTemplateInfo(index){
        console.log(index);
        this.curTemplate = this.templateList[index];
        this.curTemplateIndex = index;
        this.list = this.curTemplate.config.switches;
      },

      saveTemplateInfo(){
        if(this.validateName() && this.validateConfig()){
          const updateParams = this.getUpdateParams();
          this.curTemplate.id !== -1 ? this.updateInspectTemplate(updateParams) : this.addInspectTemplate(updateParams);
        }
      },

      validateName(){
        if(this.curTemplate.name.trim().length === 0) {
          this.showTemplateTip = true;
          this.templateNameTip = this.$t('scheduleView.enterTemplateName');
          return false;
        }
        let nameList = this.templateList.filter
        (item => item.id !== -1 && item.id !== this.templateList[this.curTemplateIndex].id)
          .map(item => item.originalName);
        if(nameList.includes(this.curTemplate.name.trim())) {
          this.showTemplateTip = true;
          this.templateNameTip = this.$t('titleView.templateNameExist');
          return false;
        }
        return true;
      },

      validateConfig(){
        const allConfigEnable = this.list.some(switchs => switchs.enable === true);
        if(allConfigEnable === false){
          util.notify(this.$t('titleView.enableConfig'), 'success', 3000);
          return false;
        }
        return true;
      },

      getUpdateParams(){
        this.list.map((switchs, index) => {
          switchs.position = index + 1;
        });
        const updateTemplParmas = {};
        this.curTemplate.id !== -1 && (updateTemplParmas.id = this.curTemplate.id);
        updateTemplParmas.name = this.curTemplate.name;
        updateTemplParmas.enable = this.curTemplate.enable;
        updateTemplParmas.switches = this.list;
        return updateTemplParmas;
      },

      updateInspectTemplate(updateParams){
        ReportSetting.updateInspectReportTeplate(updateParams).then(res => {
          this.notifyMsg(res);
        }).catch(err => {
          util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
        })
      },

      addInspectTemplate(updateParams){
        ReportSetting.addInspectReportTeplate(updateParams).then(res => {
          this.notifyMsg(res);
        }).catch(err => {
          util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
        });
      },

      notifyMsg(res, method = 'add'){
        if(method === 'add'){
          if(res.errCode === 0){
            util.notify(this.$t('titleView.saveSuss'), 'success', 3000);
          } else {
            util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
          }
        }
        else{
          if(res.errCode === 0){
            util.notify(this.$t('titleView.deleteSuccess'), 'success', 3000);
          } else {
            util.notify(this.$t('titleView.deleteFail'), 'warning', 3000);
          }
        }
        this.getInspectTemplateList();
      },

      setStatusDetail(statisItem){
        this.showStaticDetailSetting = true;
        this.statisticSettingDetail.chart = statisItem.chart;
        this.statisticSettingDetail.qualified = statisItem.qualified;
      },

      updateStaticSettingDialogFlag(val){
        this.showStaticDetailSetting = val;
      },

      hideStaticSettingDialog(){
        this.showStaticDetailSetting = false;
      },

      confirmStaticSetting(){
        this.list.forEach(item => {
          if(item.name === 'statistics'){
            item.chart = this.statisticSettingDetail.chart;
            item.qualified = this.statisticSettingDetail.qualified;
          }
        });
        this.showStaticDetailSetting = false;
      }

    }
  };
</script>

<style scoped>
  .report-setting{
    padding: 20px calc(25/ 1920*100vw);
    height: 100%;
    position: relative;
    font-size: calc(14/1920*100vw);
  }
  .template-titles{
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
    border-bottom: 1px solid #e3e9f4;
    height: 47px;
  }
  .names{
    display: flex;
    justify-content: flex-start;
  }
  .template-name{
    cursor: pointer;
    width: 120px;
    color: #7d8cad;
    padding: 15px calc(20/1920*100vw) 0 calc(20/1920*100vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .click-btn{
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
    align-items: flex-start;
    margin-left: calc(20/1920*100vw);
    margin-top: 30px;
  }
  .left-item, .right-item{
    display: inline-flex;
    align-items: center;
    margin-right: 100px;
  }

  .input-name{
    width: 200px;
    height: 30px;
  }
  .input-name.el-input--medium >>> .el-input__inner{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
  .span-font{
    color:#424151;
    width: 200px;
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
    display: inline-flex;
    flex-direction: column;
  }
  .error-text{
    font-size: 12px;
    color: red;
    position: relative;
  }
  .error-text span{
    position: absolute;
  }
  .titles-header, .setting-config{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    border: 1px solid #e3e9f4;
    border-bottom: none;
  }
  .titles-header{
    color: #2C3E50;
    background-color: #e3e9f4;
  }
  .setting-config{
    height: 60px;
  }
  .setting-config:nth-child(2n){
    background-color: #f4f5f9;
  }
  .setting-config:last-child{
    border-bottom: 1px solid #e3e9f4;
  }
  .setting-config:hover{
    cursor: pointer;
  }
  .title-name{
    width: 20%;
    text-align: left;
    margin-left: 20px;
  }
  .title-status{
    width: 20%;
  }

  .title-operation{
    width: 20%;
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
    width: 100px;
  }
</style>
