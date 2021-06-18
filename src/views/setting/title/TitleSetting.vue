<template>
  <div class="page-container">
    <div class="basic-info">
      <div class="header-title">
        <div>{{ $t('titleView.titleSetting') }}</div>
        <delay-button size="mini" type="primary" @click="saveBasicInfo">{{ $t('titleView.save') }}</delay-button>
      </div>
      <div class="basic-information">
        <div class="title-content">
          <div class="title-description">{{ $t('titleView.titleName') }}</div>
          <div class="title-name">{{ infoForm.title }}</div>
        </div>
        <div class="access-content">
          <div class="access-video">
            <span class="required-name">*</span>
            <div class="title-description">{{ $t('titleView.canAccessVideo') }}</div>
            <el-radio-group v-model="ifAccessVideo">
              <el-radio v-for="(item, index) in accessVideoList" :label="item.value" :key="index">{{ item.label }}</el-radio>
            </el-radio-group>
          </div>
          <div class="access-video">
            <span class="required-name">*</span>
            <div class="title-description">{{ $t('titleView.canReceiveMessage') }}</div>
            <el-radio-group v-model="ifReceiveMes">
              <el-radio v-for="(item, index) in accessVideoList" :label="item.value" :key="index">{{ item.label }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="clear-float">
          <div class="comment-class">
            <div class="title-description">{{ $t('titleView.remarksContent') }}</div>
            <el-input
              v-model="infoForm.comment"
              :autosize="{minRows: 2, maxRows: 4}"
              style="width: 100%;"
              type="textarea"
              class="role-comment"
              @input="commentChange"
              @blur="notShowInputRuleTips"/>
          </div>
          <div class="text">{{ curLength }}/200</div>
          <span v-if="commentRuletip" class="rules">{{ $t('titleView.commentRuletip') }}</span>
        </div>
      </div>
    </div>
    <div class="role-setting">
      <div class="setting-title">
        <div
          :class="showRolesList ? 'active-pointer':''"
          class="pointer"
          @click="getTemplateAuthorities">{{ $t('titleView.useTemplate') }} | </div>
        <div
          :class="!showRolesList ? 'active-pointer':''"
          class="pointer"
          @click="getRoleAuthority">{{ $t('titleView.roleSetting') }}</div>
      </div>
      <div class="role-list">
        <div v-if="showRolesList" class="template-info">
          <el-radio-group v-model="templateRoleId">
            <el-radio v-for="(item, index) in roleList" :label="item.value" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
          <delay-button size="mini" type="primary" @click="saveTemplateTitle">{{ $t('titleView.useAndSave') }}</delay-button>
        </div>
        <el-scrollbar :class="showRolesList? 'showlist-el-menuscrollbar' : 'el-menuscrollbar'">
          <div v-for="(item,index) in roleNameList" :key="index" class="role-group">
            <div class="role-all-checkbox">
              <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="(val)=>checkAllChildrenRole(index, val)"/>
              <span class="group-name">{{ item.roleName }}</span>
            </div>
            <div class="role-content">
              <div
                v-for="(_item,_index) in item.children"
                :class="lang === 'en'? 'en-role-detail': 'role-detail'"
                :key="_index">
                <el-checkbox
                  v-model="_item.checked"
                  :disabled="_item.disabled"
                  @change="(val)=>checkParentRole(index, val)"/>
                <span class="role-name">{{ _item.roleName }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import filterString from '@/common/filterString.js';
import { titleRESTful } from '@/api/index';
import PermissionHelper from '@/api/PermissionHelper';
import util from '@/common/util';
import DelayButton from '@/components/DelayButton';

export default {
  name: 'TitleSetting',
  components: { DelayButton },
  data() {
    return {
      commentRuletip: false,
      infoForm: {},
      accessVideoList: [
        {
          label: this.$t('titleView.yes'),
          value: 1
        },
        {
          label: this.$t('titleView.no'),
          value: 0
        }
      ],
      showRolesList: false,
      roleList: [
        {
          label: this.$t('titleView.roleId1Title'),
          value: 1
        },
        {
          label: this.$t('titleView.roleId2Title'),
          value: 2
        },
        {
          label: this.$t('titleView.roleId3Title'),
          value: 3
        },
        {
          label: this.$t('titleView.roleId4Title'),
          value: 4
        }
      ],
      curLength: 0,
      roleNameList: [
        {
          roleName: this.$t('route.overview'),
          checked: false,
          disabled: false,
          children: [
            {
              roleName: this.$t('route.patrolOverview'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.eventOverview'),
              checked: false,
              disabled: false
            }
          ]
        },
        {
          roleName: this.$t('route.patrolShop'),
          checked: false,
          disabled: false,
          children: [
            {
              roleName: this.$t('route.remotePatrol'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('overview.onsitePatrol'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.reports'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.patrolPlan'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.storeMonitor'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.transactionMonitor'),
              checked: false,
              disabled: false
            }
          ]
        },
        {
          roleName: this.$t('route.eventManage'),
          checked: false,
          disabled: false,
          children: [
            {
              roleName: this.$t('eventView.handling'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('eventView.closing'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('eventView.adding'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('eventView.returnStatus'),
              checked: false,
              disabled: false
            }
          ]
        },
        {
          roleName: this.$t('route.statisticalAna'),
          checked: false,
          disabled: false,
          children: [
            {
              roleName: this.$t('route.patrolAppraisalStat'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.patrolItemsStat'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.eventStat'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.supervisorStat'),
              checked: false,
              disabled: false
            }
          ]
        },
        {
          roleName: this.$t('route.systemSetting'),
          checked: false,
          disabled: false,
          children: [
            {
              roleName: this.$t('route.deviceManage'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.inspectListSetting'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.storeManage'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.scheduleManage'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.insepctionReportSetting'),
              checked: false,
              disabled: false
            }
          ]
        }
      ],
      authorityInfoLists: [],
      lang: this.$i18n.locale,
      roleId: 0,
      templateRoleId: 0,
      ifAccessVideo: 0,
      ifReceiveMes: 0,
      hasCheckedAuthoritiesList: []
    };
  },

  watch: {
    templateRoleId(newValue) {
      if(newValue !== 0){
        this.roleNameList.forEach(item => {
          item.checked = false;
          item.disabled = true;
          item.children.forEach(_item => {
            _item.checked = false;
            _item.disabled = true;
          });
        });
        this.getAvailableAuthority(this.authorityInfoLists[newValue - 1].availableAuth, false);
      }
    }
  },

  mounted() {
    this.getTitleInfo();
    this.getAuthorityInfoList();
  },

  destroyed() {
    sessionStorage.removeItem('titleInfo');
  },

  methods: {
    getTitleInfo() {
      const data = sessionStorage.getItem('titleInfo');
      this.infoForm = JSON.parse(data);
      this.roleId = this.infoForm.roleId;
      const comment = this.infoForm.comment && filterString.all(this.infoForm.comment, 200);
      const commentLength = this.infoForm.comment && filterString.getContentLength(comment);
      this.curLength = commentLength;
    },

    getAuthorityInfoList() {
      const self = this;
      new Promise((resolve, reject) => {
        titleRESTful.getRoleInfo().then(result => {
          resolve(result);
        });
      }).then(res => {
        self.authorityInfoLists = res.data;
        this.infoForm.authorities.length > 0 ? self.getAvailableAuthority(this.infoForm.authorities) : this.getRequiredAuthority();
      }).catch(err => {
        console.log('TitleSetting-getAuthorityInfoList: ' + err);
      });
    },

    getAvailableAuthority(authorities, resetFlag = true) {
      PermissionHelper.setData(authorities);
      this.roleNameList[0].children[0].checked = !!PermissionHelper.enableRemoteOverview();
      this.roleNameList[0].children[1].checked = !!PermissionHelper.enableEventOverview();

      this.roleNameList[1].children[0].checked = !!PermissionHelper.enableRemoteInspect();
      this.roleNameList[1].children[1].checked = !!PermissionHelper.enableLocalInspect();
      this.roleNameList[1].children[2].checked = !!PermissionHelper.enableInspectReport();
      this.roleNameList[1].children[3].checked = !!PermissionHelper.enablePatrolTask();
      this.roleNameList[1].children[4].checked = !!PermissionHelper.enableStoreMonitor();
      this.roleNameList[1].children[5].checked = !!PermissionHelper.enableTransactionPatrol();

      this.roleNameList[2].children[0].checked = !!PermissionHelper.enableEventHandle();
      this.roleNameList[2].children[1].checked = !!PermissionHelper.enableEventClose();
      this.roleNameList[2].children[2].checked = !!PermissionHelper.enableEventAdd();
      this.roleNameList[2].children[3].checked = !!PermissionHelper.enableEventReturn();

      this.roleNameList[3].children[0].checked = !!PermissionHelper.enablePatrolEvaStatistics();
      this.roleNameList[3].children[1].checked = !!PermissionHelper.enableInspectStatistics();
      this.roleNameList[3].children[2].checked = !!PermissionHelper.enableEventStatistics();
      this.roleNameList[3].children[3].checked = !!PermissionHelper.enableSupervisionEffStatistics();

      this.roleNameList[4].children[0].checked = !!PermissionHelper.enableDeviceSetting();
      this.roleNameList[4].children[1].checked = !!PermissionHelper.enablePatrolSetting();
      this.roleNameList[4].children[2].checked = !!PermissionHelper.enableStoreSetting();
      this.roleNameList[4].children[3].checked = !!PermissionHelper.enableScheduleSetting();
      this.roleNameList[4].children[4].checked = !!PermissionHelper.enableReportSetting();

      if (authorities.length === 6 && resetFlag) {
        this.ifAccessVideo = PermissionHelper.enableVideo() ? 1 : 0;
        this.ifReceiveMes = PermissionHelper.enableMessage() ? 1 : 0;
      }
      this.getRequiredAuthority();
    },

    getRequiredAuthority() {
      this.roleNameList[1].children[2].checked = true;
      this.roleNameList[1].children[2].disabled = true;
      this.roleNameList[1].children[4].checked = true;
      this.roleNameList[1].children[4].disabled = true;
      this.setParentIfChecked();
    },

    setParentIfChecked() {
      this.roleNameList.forEach(item => {
        item.checked = !item.children.find(_item => _item.checked === false);
      });
    },

    commentChange(val) {
      const self = this;
      const comment = filterString.all(val, 200);
      const commentLength = filterString.getContentLength(comment);
      self.curLength = commentLength;
      self.infoForm.comment = comment;
      const length = filterString.getContentLength(val);
      if (length > 200) {
        this.commentRuletip = true;
      } else {
        this.commentRuletip = false;
      }
    },

    notShowInputRuleTips() {
      this.commentRuletip = false;
    },

    getTemplateAuthorities() {
      this.getSelectedAuthorities();
      this.hasCheckedAuthoritiesList = JSON.parse(JSON.stringify(this.infoForm.authorities));
      this.showRolesList = true;
      this.templateRoleId = 1;
      this.getAvailableAuthority(this.authorityInfoLists[this.roleId - 1].availableAuth);
    },

    getRoleAuthority() {
      this.showRolesList = false;
      this.templateRoleId = 0;
      this.setDefaultValueOfRoleNameList();
      this.getAvailableAuthority(this.hasCheckedAuthoritiesList);
    },

    saveTemplateTitle() {
      this.setDefaultValueOfRoleNameList();
      this.showRolesList = false;
      this.getAvailableAuthority(this.authorityInfoLists[this.templateRoleId - 1].availableAuth);
      this.templateRoleId = 0;
    },

    setDefaultValueOfRoleNameList(){
      this.roleNameList.forEach(item => {
        item.checked = false;
        item.disabled = false;
        item.children.forEach(_item => {
          _item.checked = false;
          _item.disabled = false;
        });
      });
    },

    saveBasicInfo() {
      this.getSelectedAuthorities();
      this.updateBasicInformation().then(res => {
        if (res.errCode === 0) {
          util.notify(this.$t('titleView.saveSuss'), 'success', 3000);
        } else {
          util.notify(this.$t('titleView.saveFail'), 'warning', 3000);
        }
      }).catch(error => {
        console.log('TitleSetting-updateBasicInformation: ' + error);
      });
    },

    getSelectedAuthorities() {
      this.infoForm.authorities = [];
      const decAuthorityNum = Math.pow(2, 32);
      this.roleNameList.forEach((item, index) => {
        let tempAuthorityNum = Math.pow(2, index) * decAuthorityNum;
        item.children.forEach((_item, _index) => {
          if(_item.checked){
            if(index === 4 && _index === 0){
              tempAuthorityNum += Math.pow(2, 1);
            }else if(index === 4 && _index === 1){
              tempAuthorityNum += Math.pow(2, 0);
            } else if(index === 4 && _index === 4){
              tempAuthorityNum += Math.pow(2, 5);
            } else {
              tempAuthorityNum += Math.pow(2, _index);
            }
          }
        });
        this.infoForm.authorities.push(tempAuthorityNum);
      });
      let videoAndMessNum = Math.pow(2, 5) * decAuthorityNum;
      this.ifAccessVideo && (videoAndMessNum += Math.pow(2, 0));
      this.ifReceiveMes && (videoAndMessNum += Math.pow(2, 1));
      this.infoForm.authorities.push(videoAndMessNum);
    },

    updateBasicInformation() {
      const self = this;
      const params = self.infoForm;
      return new Promise((resolve, reject) => {
        titleRESTful.updateUserTitle(params).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    checkAllChildrenRole(index, val) {
      const self = this;
      self.roleNameList[index].children.forEach(item => {
        if (!item.disabled) {
          item.checked = val;
        }
      });
    },

    checkParentRole(index) {
      const self = this;
      const parentDisable = self.roleNameList[index].disabled;
      let childrenCheckedNum = 0;
      let childrenDisableNum = 0;
      self.roleNameList[index].children.forEach(item => {
        if (item.checked) {
          childrenCheckedNum++;
        } else if (item.disabled) {
          childrenDisableNum++;
        }
      });
      const sumCheckAndDis = childrenCheckedNum + childrenDisableNum;
      if (sumCheckAndDis === self.roleNameList[index].children.length && !parentDisable) {
        if (childrenDisableNum > 0) {
          self.roleNameList[index].disabled = false;
          self.roleNameList[index].checked = true;
        } else {
          self.roleNameList[index].disabled = false;
          self.roleNameList[index].checked = true;
        }
      } else {
        self.roleNameList[index].disabled = false;
        self.roleNameList[index].checked = false;
      }
    }

  }
};
</script>

<style scoped lang="scss">
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $black:#182752;

  .page-container{
    height: calc(100vh - 80px - 40px - calc(60/1920*100vw));
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    .basic-info{
      .basic-information{
        text-align: left;
        margin-left: calc(25/1920*100vw);
        margin-right: calc(25/1920*100vw);
        padding-left: calc(15/1920*100vw);
        border-bottom: 1px solid $border;
        font-size: calc(14/1920*100vw);
        .title-description{
          display: inline-block;
          min-width: 160px;
        }
        .title-content{
          display: flex;
          height: 48px;
          align-items: center;
        }
        .access-content{
          @extend .title-content;
          .access-video{
            flex: 1;
          }
        }
        .comment-class{
          display: flex;
          margin-top: 10px;
        }
        .text{
          float: right;
          color: #909399;
          height: 14px;
          margin-bottom: 20px;
        }
        .rules{
          font-size: 10px;
          line-height: 20px;
          color: $mainColor;
          display: block;
          margin-left: 160px;
        }
      }
    }
    .role-setting{
      flex-grow: 1;
      margin-left: calc(25/1920*100vw);
      margin-right: calc(25/1920*100vw);
      margin-bottom: 25px;
      text-align: left;
      height: calc(100% - 303px);
      .setting-title{
        padding-left: calc(15/1920*100vw);
        font-size: calc(16/1920*100vw);
        height: 70px;
        line-height: 70px;
      }
      .pointer{
        cursor: pointer;
        display: inline-block;
      }
      .active-pointer{
        color: $mainColor;
        font-weight: bold;
      }
      .role-list{
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        color: $black;
        height: calc(100% - 70px);
        .el-menuscrollbar{
          height: 100%;
        }
        .showlist-el-menuscrollbar{
          height: calc(100% - 80px);
        }
        .template-info{
          height: 70px;
          background-color: rgba(243,29,101, 0.1);
          margin-top: 10px;
          margin-left: calc(10/1920*100vw);
          padding: 0  calc(60/1920*100vw) 0 calc(20/1920*100vw);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .role-group{
          width: 60%;
          margin-top: 25px;
          margin-bottom: 25px;
          .role-all-checkbox{
            margin-left: calc(20/1920*100vw);
            .group-name{
              margin-left: calc(15/1920*100vw);
              font-size: calc(14/1920*100vw);
              font-weight: bold;
            }
          }
          .role-content{
            margin-left: calc(50/1920*100vw);
            overflow: hidden;
            .role-detail{
              width: auto;
              margin-left:calc(15/1920*100vw);
              margin-top: 15px;
              width: calc(180/1920*100vw);
              min-width: 140px;
              float: left;
              .role-name{
                margin-left:calc(15/1920*100vw);
                font-size: calc(14/1920*100vw);
              }
            }
            .en-role-detail{
              width: auto;
              min-width:calc(320/1920*100vw);
              margin-left:calc(15/1920*100vw);
              margin-top: 15px;
              float: left;
              .role-name{
                margin-left:calc(15/1920*100vw);
                font-size: calc(14/1920*100vw);
              }
            }
          }
        }
      }
    }

  }
</style>
<style>
  .role-group .el-checkbox{
    margin-right: 0;
  }
  .role-group .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color:#f31d65 ;
    border-color: #f31d65;
  }
  .role-list #el-menuscrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
</style>
