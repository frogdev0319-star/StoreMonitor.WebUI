<template>
  <div class="page-container report-setting paper">
    <div class="setting-titles padding flex-center">
      {{this.$t('titleView.reportTemplate')}}
      <div class="spacer"></div>
      <div class="buttons">
        <delay-button
          :disabled="templateList.length === 0"
          class="schedule-btn"
          @click="deleteReportTemplate">
          <div class="button-area">
            <span>{{ $t('titleView.delete') }}</span>
          </div>
        </delay-button>
        <delay-button
          class="schedule-btn"
          @click="addReportTemplate">
          <div class="button-area">
            <i class="iconfont el-icon-plus"/>
            <span>{{ $t('titleView.add') }}</span>
          </div>
        </delay-button>
      </div>
    </div>
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="content-titles">
        <div class="template-select-area">
          <div class="template-select-label">{{ $t('titleView.reportTemplateLabel') }}</div> 
          <el-select
            v-model="curTemplateIndex"
            class="device-select"
            size="mini"
            @change="displayTemplateInfo"
            placeholder="">
            <el-option
              v-for="(item, index) in templateList"
              :key="index"
              :label="item.name"
              :value="index"
            />
          </el-select>
        </div>
        <div>
          <span class="enable-font">{{ $t('scheduleView.enable') }}</span>
          <el-switch v-model="curTemplate.enable" @change="changTemplateEnableStatus">{{ curTemplate.enable }}</el-switch>
        </div>
        <div class="spacer"></div>
        <delay-button
          type="filled"
          @click="saveTemplateInfo">
          <div class="button-area">
            <span>{{ $t('titleView.save') }}</span>
          </div>
        </delay-button>
      </div>
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table :table-name="$t('titleView.basicInfo')">
            <template slot="tableDetail">
              <div class="setting-config basic-config">
                <div class="title-name">{{ $t('titleView.templateName') }}</div>
                <div class="title-status">
                  <div class="name-tips">
                    <el-input
                    v-model="curTemplate.name"
                    :placeholder="$t('titleView.enterTemplateName')"
                    class="input-name"
                    @input="onTemplateNameChange"
                    @blur="showTemplateTip = false"/>
                    <span v-if="showTemplateTip" class="error-text">
                      <span>
                      {{ templateNameTip }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div v-for="item in basicList" :key="item.position" class="setting-config basic-config">
                <div class="title-name">{{ $t(`titleView.${item.name}`) }}</div>
                <div class="title-status">
                  <el-radio-group class="storevue-radio" v-model="item.enable">
                    <el-radio :label="true">{{ $t('titleView.show') }}</el-radio>
                    <el-radio :label="false">{{ $t('titleView.noShow') }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="title-operation">
                  <div class="flex-center" style="background-color: #f7f9fa; padding: 12px" v-if="item.name === 'statistics'">
                    <div class="flex-center">
                      <span class="span-font" style="margin-right: 20px">{{ $t('titleView.statisIndex') }}</span>
                      <div>
                        <el-radio-group class="storevue-radio" v-model="item.qualified">
                          <el-radio :label="0">{{ $t('overview.pass') }}</el-radio>
                          <el-radio :label="1">{{ $t('overview.failed') }}</el-radio>
                        </el-radio-group>
                      </div>
                    </div>
                    <div class="flex-center">
                      <span class="span-font" style="margin-right: 20px;margin-left: 60px">{{ $t('titleView.displayofStatisticalResults') }}</span>
                      <el-radio-group class="storevue-radio" v-model="item.chart">
                        <el-radio :label="0">{{ $t('titleView.radar') }}</el-radio>
                        <el-radio :label="1">{{ $t('titleView.pie') }}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </setting-table>
        </div>
        <setting-table :table-name="$t('remotePatrol.detailInfo')">
          <template slot="tableDetail">
            <div class="detail-setting">
              <div class="padding flex-center">
                <el-radio-group v-model="ifShowAllDetails" class="storevue-radio">
                  <el-radio :label="1">{{ $t('titleView.showAllDetails') }}</el-radio>
                  <el-radio :label="0">{{ $t('titleView.showPartsDetails') }}</el-radio>
                </el-radio-group>
                <div class="spacer"></div>
                <div v-if="ifShowAllDetails === 0" style="font-size: 12px; color: #acaeb1">
                  <i class="iconfont icon-tishi1" style="font-size: 14px; margin-right:10px"/>
                  {{ $t('titleView.draggableInfo') }}
                </div>
              </div>
              <hr v-if="ifShowAllDetails === 0" class="hr-horizontal" style="margin-bottom: 15px;"/>
              <template v-if="ifShowAllDetails === 0">
                <draggable v-model="list" class="detail-table" style="margin: 20px">
                  <div v-for="item in list" :key="item.position" class="setting-config">
                    <template>
                      <div class="title-name">{{ $t(`titleView.${item.name}`) }}</div>
                      <div class="title-status">
                        <el-radio-group class="storevue-radio" v-model="item.enable">
                          <el-radio :label="true">{{ $t('titleView.show') }}</el-radio>
                          <el-radio :label="false">{{ $t('titleView.noShow') }}</el-radio>
                        </el-radio-group>
                      </div>
                    </template>
                  </div>
                </draggable>
              </template>
            </div>
          </template>
        </setting-table>
      </div>
    </div>
    <dialog-pop
      v-if="showStaticDetailSetting"
      :title="$t('titleView.inspectionStaticSetting')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showStaticDetailSetting"
      :isWarning="true"
      dialog-width="540px"
      @visibleChangeHandler="updateStaticSettingDialogFlag"
      @cancelHandler="hideStaticSettingDialog"
      @confirmHandler="confirmStaticSetting"
    >
      <div class="dialog-slot">
        <div class="statis-content">
          <div class="statis-item">
            <span class="span-font">{{ $t('titleView.statisIndex') }}</span>
            <span>
              <el-radio-group v-model="statisticSettingDetail.qualified">
                <el-radio :label="0">{{ $t('titleView.show') }}</el-radio>
                <el-radio :label="1">{{ $t('titleView.noShow') }}</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="statis-item">
            <span class="span-font">{{ $t('titleView.displayofStatisticalResults') }}</span>
            <span>
              <el-radio-group v-model="statisticSettingDetail.chart">
                <el-radio :label="0">{{ $t('titleView.radar') }}</el-radio>
                <el-radio :label="1">{{ $t('titleView.pie') }}</el-radio>
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
import ReportSetting from '@/api/reportSetting';
import draggable from 'vuedraggable';
import DialogPop from '@/components/DialogPop';
import ButtonList from '@/components/ButtonList';
import SettingTable from '@/components/SettingTable';
import { mapGetters } from 'vuex';

export default {
  name: 'ReportSetting',
  components: { SettingTable, ButtonList, DialogPop, DelayButton, draggable },
  data() {
    return {
      curTemplate: {},
      templateList: [],
      showTemplateTip: false,
      isLoadingData: true,
      list: [],
      curTemplateIndex: 0,
      curTemplateName: '',
      templateNameTip: '',
      showStaticDetailSetting: false,
      statisticSettingDetail: { chart: 0, qualified: 0 },
      settingTitleList: [{ name: this.$t('titleView.reportTemplate') }],
      curSettingIndex: 0,
      basicList: [],
      ifShowAllDetails: 1
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val) {
      if (val !== 0) {
        this.getInspectTemplateList();
      }
    }
  },

  created() {
    this.getInspectTemplateList();
  },

  methods: {
    getInspectTemplateList() {
      ReportSetting.getInspectReportTemplateList().then(res => {
        if (res.errCode === 0 && res.data.length > 0) {
          this.templateList = res.data;
          this.templateList.map(template => {
            template.originalName = template.name;
            template.originalEnable = template.enable;
          });
          this.curTemplate = JSON.parse(JSON.stringify(this.templateList[this.curTemplateIndex]));
          this.curTemplateName = this.curTemplate.name;
          this.setBasicAndDetailList();
        } else {
          this.templateList = [];
          this.curTemplate = {};
          this.list = [];
          this.basicList = [];
          this.curTemplateIndex = 0;
        }
        this.isLoadingData = false;
      }).catch(err => {
        console.log('ReportSetting:' + err);
      });
    },

    setBasicAndDetailList() {
      const switches = this.curTemplate.config.switches;
      util.sortArrayByKeyAsc(switches, 'position');
      this.basicList = switches.slice(1, 4);
      this.list = switches.slice(4);
      this.ifShowAllDetails = switches[0].enable ? 1 : 0;
    },

    onTemplateNameChange(val) {
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
      const nameList = this.templateList.filter(item => item.id !== -1 &&
          item.id !== this.templateList[this.curTemplateIndex].id)
        .map(item => item.originalName);
      if (nameList.includes(tempName)) {
        this.showTemplateTip = true;
        this.templateNameTip = this.$t('titleView.templateNameExist');
        return;
      } else {
        this.showTemplateTip = false;
      }
    },

    changTemplateEnableStatus(val) {
      const templateEnableInDB = this.templateList.filter(item => item.originalEnable === true && item.id !== -1);
      if (!val && this.curTemplate.id !== -1 &&
          templateEnableInDB.length === 1 &&
          templateEnableInDB[0].id === this.curTemplate.id) {
        this.curTemplate.enable = true;
        util.notify(this.$t('titleView.enableTemplate'), 'warning', 3000);
      }
    },

    addReportTemplate() {
      if (this.templateList.length >= 5) {
        util.notify(this.$t('titleView.templateOutOfLimit'), 'warning', 3000);
        return false;
      }
      this.templateList.forEach(item => { item.originalEnable = item.enable; });
      this.pushTemplateToList();
      this.curTemplate = this.templateList[this.templateList.length - 1];
      this.setBasicAndDetailList();
      this.curTemplateIndex = this.templateList.length - 1;
    },

    pushTemplateToList() {
      const templateObj = {
        'id': -1,
        'name': '',
        'enable': true,
        'config': {
          'switches': [
            {
              'enable': true,
              'name': 'defaultAll',
              'position': -1
            },
            {
              'enable': true,
              'name': 'comment',
              'position': 1
            },
            {
              'qualified': 1,
              'enable': true,
              'name': 'statistics',
              'position': 2,
              'chart': 1
            },
            {
              'enable': true,
              'name': 'summaryTable',
              'position': 3
            },
            {
              'enable': true,
              'name': 'focalItem',
              'position': 4
            },
            {
              'enable': true,
              'name': 'feedbackItem',
              'position': 5
            },
            {
              'enable': true,
              'name': 'qualifiedItem',
              'position': 6
            },
            {
              'enable': true,
              'name': 'ignoredItem',
              'position': 7
            },
            {
              'enable': false,
              'name': 'notJoinItem',
              'position': 8
            }
          ]
        }
      };
      this.templateList.push(templateObj);
    },

    deleteReportTemplate() {
      if (this.curTemplate.id !== -1 && this.templateList.filter(item => item.id !== -1).length === 1) {
        util.notify(this.$t('titleView.atLeastOneTemplate'), 'warning', 3000);
        return false;
      }
      const enableTemplateList = this.templateList.filter(item => item.originalEnable === true);
      if (this.curTemplate.id !== -1 && enableTemplateList.length === 1 && enableTemplateList[0].id === this.curTemplate.id) {
        util.notify(this.$t('titleView.noEnableTemplate'), 'warning', 3000);
        return false;
      }
      this.curTemplate.id === -1 ? this.templateList.splice(this.curTemplateIndex, 1) : this.deleteReportTemplateFromDB();
      this.curTemplateIndex > 0 ? this.curTemplateIndex-- : 0;
      this.curTemplate = JSON.parse(JSON.stringify(this.templateList[this.curTemplateIndex]));
      this.setBasicAndDetailList();
    },

    deleteReportTemplateFromDB() {
      const deleteParams = { ids: [] };
      deleteParams.ids.push(this.curTemplate.id);
      ReportSetting.deleteInspectReportTeplate(deleteParams).then(res => {
        this.notifyMsg(res, 'delete');
      }).catch(err => {
        util.notify(this.$t('deviceView.deleteFail'), 'warning', 3000);
      });
    },

    displayTemplateInfo(index) {
      this.curTemplate = this.templateList[index];
      this.curTemplateIndex = index;
      this.setBasicAndDetailList();
    },

    saveTemplateInfo() {
      if (this.validateName() && this.validateConfig()) {
        const updateParams = this.getUpdateParams();
        this.curTemplate.id !== -1 ? this.updateInspectTemplate(updateParams) : this.addInspectTemplate(updateParams);
      }
    },

    validateName() {
      if (this.curTemplate.name.trim().length === 0) {
        this.showTemplateTip = true;
        this.templateNameTip = this.$t('titleView.enterTemplateName');
        return false;
      }
      const nameList = this.templateList.filter(item => item.id !== -1 && item.id !== this.templateList[this.curTemplateIndex].id)
        .map(item => item.originalName);
      if (nameList.includes(this.curTemplate.name.trim())) {
        this.showTemplateTip = true;
        this.templateNameTip = this.$t('titleView.templateNameExist');
        return false;
      }
      return true;
    },

    validateConfig() {
      let configList = [];
      if (this.ifShowAllDetails === 1) {
        configList = [...this.basicList];
      } else {
        configList = [...this.basicList, ...this.list];
      }
      const allConfigEnable = configList.some(switchs => switchs.enable === true);
      if (allConfigEnable === false) {
        util.notify(this.$t('titleView.enableConfig'), 'success', 3000);
        return false;
      }
      return true;
    },

    getUpdateParams() {
      this.list.map((switchs, index) => {
        switchs.position = index + this.basicList.length + 1;
      });
      const list = [...this.basicList, ...this.list];
      list.push(
        {
          'enable': !!this.ifShowAllDetails,
          'name': 'defaultAll',
          'position': -1
        }
      );
      const updateTemplParmas = {};
      this.curTemplate.id !== -1 && (updateTemplParmas.id = this.curTemplate.id);
      updateTemplParmas.name = this.curTemplate.name;
      updateTemplParmas.enable = this.curTemplate.enable;
      updateTemplParmas.switches = list;
      return updateTemplParmas;
    },

    updateInspectTemplate(updateParams) {
      ReportSetting.updateInspectReportTeplate(updateParams).then(res => {
        this.notifyMsg(res);
      }).catch(err => {
        util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
      });
    },

    addInspectTemplate(updateParams) {
      ReportSetting.addInspectReportTeplate(updateParams).then(res => {
        this.notifyMsg(res);
      }).catch(err => {
        util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
      });
    },

    notifyMsg(res, method = 'add') {
      if (method === 'add') {
        if (res.errCode === 0) {
          util.notify(this.$t('titleView.saveSuss'), 'success', 3000);
        } else {
          util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
        }
      } else {
        if (res.errCode === 0) {
          util.notify(this.$t('titleView.deleteSuss'), 'success', 3000);
        } else {
          util.notify(this.$t('titleView.deleteFail'), 'warning', 3000);
        }
      }
      this.getInspectTemplateList();
    },

    setStatusDetail(statisItem) {
      this.showStaticDetailSetting = true;
      this.statisticSettingDetail.chart = statisItem.chart;
      this.statisticSettingDetail.qualified = statisItem.qualified;
    },

    updateStaticSettingDialogFlag(val) {
      this.showStaticDetailSetting = val;
    },

    hideStaticSettingDialog() {
      this.showStaticDetailSetting = false;
    },

    confirmStaticSetting() {
      this.basicList.forEach(item => {
        if (item.name === 'statistics') {
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
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
  }
  .setting-titles{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  }
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
    height: 30px;
  }
  .input-name.el-input--medium >>> .el-input__inner{
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
    height: 60px;
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
  }

  .setting-config:hover{
    cursor: pointer;
  }
  .basic-config, .basic-header{
    border: none;
    border-bottom: 1px solid #e3e9f4;
    padding-left: calc(30/1920*100vw);
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: 20%;
    text-align: left;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    width: 20%;
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
    width: 100px;
  }

  .setting-details{
    margin: 0 30px;
  }
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
