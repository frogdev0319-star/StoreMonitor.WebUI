<template>
  <div class="page-container">
    <div class="basic-info">
      <div class="header-title flex-center">
        <div class="title-content flex-center">
          <div class="title-description" style="margin-right: 10px">{{ `${$t('titleView.titleName')}:` }}</div>
          <div class="title-name">{{ infoForm.title }}</div>
        </div>
        <div class="spacer"></div>
        <!-- 保存 -->
        <delay-button type="filled" @click="saveBasicInfo">{{ $t('titleView.save') }}</delay-button>
      </div>
      <div class="basic-information flex" style="padding: 20px 0 20px 20px">
        <div style="width: 250px; display: flex; flex-direction: column">
          <div class="flex-center spacer">
            <div class="title-description spacer">{{ $t('titleView.canAccessVideo') }}</div>
            <el-switch v-model="ifAccessVideo"></el-switch>
          </div>
          <div class="flex-center spacer">
            <div class="title-description spacer">{{ $t('titleView.canReceiveMessage') }}</div>
            <el-switch v-model="ifReceiveMes"></el-switch>
          </div>
        </div>
        <hr class="hr-vertical" style="margin: 0 30px">
        <div class="flex spacer">
          <div class="title-description" style="margin-right: 20px">{{ $t('titleView.remarksContent') }}</div>
          <div class="spacer">
            <el-input
              v-model="infoForm.comment"
              :autosize="{minRows: 2, maxRows: 4}"
              style="width: 100%;"
              type="textarea"
              class="role-comment"
              @input="commentChange"
              @blur="notShowInputRuleTips"/>
            <div class="text">{{ curLength ? curLength : 0 }}/200</div>
            <span v-if="commentRuletip" class="rules">{{ $t('titleView.commentRuletip') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="role-setting">
      <div class="role-list paper padding">
        <div class="flex-center" style="padding-bottom: 20px">
          <div>{{ $t('titleView.roleSetting') }}</div>
          <div class="spacer"></div>
          
          <div class="temp-select-area" :style="{'width':getLangStyleValue(tempSelectAreaWidth)}">
            <div class="temp-select-label" :style="{'width':getLangStyleValue(tempSelectLabelWidth)}">{{ $t('titleView.templateSelection') }}</div> 
            <el-select
              v-model="templateRoleId"
              class="device-select"
              style="font-size:13px"
              :style="(lang.indexOf('ja')== -1 && lang.indexOf('vi')==-1)?{}:{'width':'300px'}"
              @change="changeCurTemplate">
              <el-option v-for="(item, index) in roleList" :label="item.label" :key="index" :value="item.value">
                {{ item.label }}
              </el-option>
            </el-select>
          </div>
        </div>

        <hr class="hr-horizontal">
        <el-scrollbar :class="showRolesList? 'showlist-el-menuscrollbar' : 'el-menuscrollbar'">

          <div 
            v-for="(item,index) in roleNameList" 
            :key="index" class="role-group" 
            v-show="item.show"
          >
            <div class="role-all-checkbox" style="text-align: left">
              <el-checkbox  class="storevue-checkbox-filled" v-model="item.checked" :disabled="item.disabled" @change="(val)=>checkAllChildrenRole(index, val)"/>
              <span class="group-name">{{ item.roleName }}</span>
            </div>
            <div class="role-content">
              <div
                v-for="(_item,_index) in item.children"
                v-show="_item.visabled"
                :class="lang.indexOf('zh') === -1 ? 'en-role-detail': 'role-detail'"
                :key="_index">
                <el-checkbox
                  class="storevue-checkbox-outlined"
                  v-show="_item.visabled"
                  v-model="_item.checked"
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
      curTemplate: 1,
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
          label: this.$t('titleView.roleId0Title'),
          value: 0
        },
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
          show: true,
          children: [
            {
              roleName: this.$t('route.patrolOverview'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.eventOverview'),
              checked: false,
              disabled: false,
              visabled:true
            }
          ]
        },
        {
          roleName: this.$t('route.patrolShop'),
          checked: false,
          disabled: false,
          show: true,
          children: [
            {
              roleName: this.$t('route.remotePatrol'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('overview.onsitePatrol'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.reports'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.patrolPlan'),
              checked: false,
              disabled: false,
              visabled:false
            },
            {
              roleName: this.$t('route.storeMonitor'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.transactionMonitor'),
              checked: false,
              disabled: false,
              visabled:false
            }
          ]
        },
        {
          roleName: this.$t('route.eventManage'),
          checked: false,
          disabled: false,
          show: true,
          children: [
            {
              roleName: this.$t('eventView.handling'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('eventView.closing'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('eventView.adding'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('eventView.returnStatus'),
              checked: false,
              disabled: false,
              visabled:true
            }
          ]
        },
        {
          roleName: this.$t('route.statisticalAna'),
          checked: false,
          disabled: false,
          show: true,
          children: [
            {
              roleName: this.$t('route.patrolAppraisalStat'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.patrolItemsStat'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.eventStat'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.patrolPersonStat'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.singleStoreStat'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.patrolCompareStat'),
              checked: false,
              disabled: false,
              visabled:true
            }
            // {
            //   roleName: this.$t('route.checkInStatistics'),
            //   checked: false,
            //   disabled: false
            // }
          ]
        },
        {
          roleName: this.$t('route.AuditManage'),
          checked: false,
          disabled: false,
          show: true,
          children: [
            {
              roleName: this.$t('route.SendAuditManage'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.WaitAuditManage'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('route.TranscriptNotify'),
              checked: false,
              disabled: false,
              visabled:true
            }
          ]
        },

        {
          roleName: this.$t('schedule.inceptionSchedule'),
          checked: false,
          disabled: false,
          show: false,
          children: [
            {
              roleName: this.$t('schedule.scheduleSetting'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('schedule.scheduleHistory'),
              checked: false,
              disabled: false,
              visabled:true
            },
            {
              roleName: this.$t('schedule.scheduleExecuted'),
              checked: false,
              disabled: false,
              visabled:true
            }
          ]
        },

        // 系統設定
        {
          roleName: this.$t('route.systemSetting'),
          checked: false,
          disabled: false,
          show: true,
          children: [
            {
              roleName: this.$t('route.deviceManage'),
              checked: false,
              disabled: false,
              visabled: true
            },
            {
              roleName: '通用設定',
              checked: false,
              disabled: false,
              visabled : true
            },
            {
              roleName: this.$t('route.inspectListSetting'),
              checked: false,
              disabled: false,
              visabled: true
            },
            {
              roleName: this.$t('route.storeManage'),
              checked: false,
              disabled: false,
              visabled: false
            },
            {
              roleName: this.$t('route.scheduleManage'),
              checked: false,
              disabled: false,
              visabled: false
            },
            {
              roleName: this.$t('route.insepctionReportSetting'),
              checked: false,
              disabled: false,
              visabled: true
            },
            {
              roleName: this.$t('route.workflowManage'),
              checked: false,
              disabled: false,
              visabled: true
            }
          ]
        }
      ],
      authorityInfoLists: [],
      lang: this.$i18n.locale,
      roleId: 0,
      templateRoleId: 0,
      ifAccessVideo: 0,
      ifReceiveMes: false,
      hasCheckedAuthoritiesList: [],
      isCheckChanged:false,
      tempSelectAreaWidth:[{key:'en',value:'220px'},{key:'zh',value:'220px'},{key:'zhtw',value:'220px'},
        {key:'ja-JP',value:'340px'},{key:'ko-KR',value:'250px'},{key:'vi-VN',value:'310px'},
        {key:'id-ID',value:'300px'},{key:'th-TH',value:'220px'}],
      tempSelectLabelWidth:[{key:'en',value:'75px'},{key:'zh',value:'75px'},{key:'zhtw',value:'75px'},
        {key:'ja-JP',value:'105px'},{key:'ko-KR',value:'85px'},{key:'vi-VN',value:'85px'},
        {key:'id-ID',value:'95px'},{key:'th-TH',value:'75px'}],

        isShowing:  false
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
            _item.disabled = false;
          });
        });
        this.getAvailableAuthority(this.authorityInfoLists[newValue - 1].availableAuth, false);
      }
    }
  },

  mounted() {
    this.getTitleInfo();
    this.getAuthorityInfoList();

    this.getWhiteLsit()


  },

  destroyed() {
    sessionStorage.removeItem('titleInfo');
  },

  created() {
    
  },
  methods: {
    getWhiteLsit(){
      const whiteList = this.$store.getters.whiteList
      const accountId = this.$store.getters.accountId

      console.log('whiteList!!!!!!!!!!!!!!!!!!!!', whiteList)
      console.log('accountId !!!!!!!!!!!!!!!!!!!!', accountId)

      this.isShowing = whiteList.some( i => i == accountId)
      console.log('this.isShowing', this.isShowing)

      if(this.isShowing){
        this.roleNameList[5].show = true
      } else {
        this.roleNameList[5].show = false
      }




    },

    getLangStyleValue(langArray){
      return util.getLangStyleValue(langArray);
    },
    changeCurTemplate (val) {
      this.templateRoleId =  val;
      if(!this.isCheckChanged){
        this.setDefaultValueOfRoleNameList();
        this.isCheckChanged = false;
      }
      this.showRolesList = false;
      this.getAvailableAuthority(this.authorityInfoLists[this.templateRoleId - 1].availableAuth);
    },

    getTitleInfo() {
      const data = sessionStorage.getItem('titleInfo');
      this.infoForm = JSON.parse(data);

      console.log('this.infoForm', this.infoForm)
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

      console.log('authorities :>> ', authorities);
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
      // this.roleNameList[3].children[4].checked = !!PermissionHelper.enableCheckinStatistics();
      this.roleNameList[3].children[4].checked = !!PermissionHelper.enableSingleStoreStatStatistics();
      this.roleNameList[3].children[5].checked = !!PermissionHelper.enableAppraisalCompareStatistics();


      this.roleNameList[6].children[0].checked = !!PermissionHelper.enableDeviceSetting();
      this.roleNameList[6].children[1].checked = !!PermissionHelper.enableGeneralSetting();
      this.roleNameList[6].children[2].checked = !!PermissionHelper.enablePatrolSetting();
      this.roleNameList[6].children[3].checked = !!PermissionHelper.enableStoreSetting(); //no
      this.roleNameList[6].children[4].checked = !!PermissionHelper.enableScheduleSetting(); //no
      this.roleNameList[6].children[5].checked = !!PermissionHelper.enableReportSetting();
      this.roleNameList[6].children[6].checked = !!PermissionHelper.enableWorkflowSetting();

      

      //auditSetting
      this.roleNameList[4].children[0].checked = !!PermissionHelper.enableSendAudit();
      this.roleNameList[4].children[1].checked = !!PermissionHelper.enableWaitAudit();
      this.roleNameList[4].children[2].checked = !!PermissionHelper.enableTranscriptNotify();

      //Schedule
      this.roleNameList[5].children[0].checked = !!PermissionHelper.enableScheduleSetting2();
      this.roleNameList[5].children[1].checked = !!PermissionHelper.enableScheduleHistroy();
      this.roleNameList[5].children[2].checked = !!PermissionHelper.enableScheduleExecuted();


      if (authorities.length >= 7 && resetFlag) {
        this.ifAccessVideo = PermissionHelper.enableVideo() === 1;
        this.ifReceiveMes = PermissionHelper.enableMessage() === 2;
      }
      this.getRequiredAuthority();
    },

    getRequiredAuthority() {
      /*this.roleNameList[1].children[2].checked = true;
      this.roleNameList[1].children[2].disabled = true;
      this.roleNameList[1].children[4].checked = true;
      this.roleNameList[1].children[4].disabled = true;*/
      this.setParentIfChecked();
    },

    setParentIfChecked() {
      this.roleNameList.forEach(item => {
        item.disabled = false;
        item.checked = !item.children.find(_item => (_item.checked === false && _item.visabled===true));
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
      //*
      //this.templateRoleId = 0;
      this.setDefaultValueOfRoleNameList();
      this.getAvailableAuthority(this.hasCheckedAuthoritiesList);
    },

    saveTemplateTitle() {
      this.setDefaultValueOfRoleNameList();
      this.showRolesList = false;
      this.getAvailableAuthority(this.authorityInfoLists[this.templateRoleId - 1].availableAuth);
      //*
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
          this.isCheckChanged = true;
          this.templateRoleId = 0;
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
      const newAuth = this.roleNameList.slice(0);
      console.log('newAuth', newAuth)

      const auditElement = newAuth.splice(4,2);//將簽核權限,排程管理提出來，往後放 備註:4原本是系統設定
      console.log('auditElement', auditElement)

      newAuth.push.apply(newAuth,auditElement);
      newAuth.forEach((item, index) => {
        /**因為新加的權限只能往後加，所以5以後順序需要特別處理 */
        let powerIdx = index;
        if(index>=5) powerIdx=index+1;
        /********************/
        let tempAuthorityNum = Math.pow(2, powerIdx) * decAuthorityNum;

        item.children.forEach((_item, _index) => {
          if(_item.checked){
            if(index === 4 && _index === 0){
              tempAuthorityNum += Math.pow(2, 0);
              console.log('xdxdxd 0' , tempAuthorityNum)
            }
            else if(index === 4 && _index === 1){
              tempAuthorityNum += Math.pow(2, 1);
              console.log('xdxdxd 1' , tempAuthorityNum)
            } 
            else if(index === 4 && _index === 2){
              tempAuthorityNum += Math.pow(2, 2);
              console.log('xdxdxd 2' , tempAuthorityNum)
            } 
            else if(index === 4 && _index === 4){
              tempAuthorityNum += Math.pow(2, 4);
              console.log('xdxdxd 4' , tempAuthorityNum)
            } 
            else if(index === 4 && _index === 5){
              tempAuthorityNum += Math.pow(2, 5);
              console.log('xdxdxd 5' , tempAuthorityNum)
            }
            else if(index === 4 && _index === 6){
              tempAuthorityNum += Math.pow(2, 6);
              console.log('xdxdxd 6' , tempAuthorityNum)
            }
            else {
              console.log('!!!')
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

      console.log('this.infoForm.authorities', this.infoForm.authorities)

    },

    updateBasicInformation() {
      const self = this;
      const params = self.infoForm;
      console.log('params', params)
      return new Promise((resolve, reject) => {
        titleRESTful.updateUserTitle(params).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    checkAllChildrenRole(index, val) {
      console.log('index , val :>> ', index , val);
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
      self.isCheckChanged = true;
      self.roleNameList[index].children.forEach(item => {
        if (item.checked) {
          childrenCheckedNum++;
        } else if (item.disabled || !item.visabled) {
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
      self.templateRoleId = 0;
    }

  }
};
</script>

<style scoped lang="scss">
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $black:#182752;

*{
    font-family: Roboto, Arial, Microsoft YaHei;
    text-align: left;
}
  .page-container{
    display: flex;
    flex-direction: column;
    .basic-info{
      .header-title {
        color: #2b2b2b;
        font-size: 18px;
        font-weight: 600;
      }
      .basic-information{
        text-align: left;
        // margin-left: calc(25/1920*100vw);
        // margin-right: calc(25/1920*100vw);
        // padding-left: calc(15/1920*100vw);
        // border-bottom: 1px solid $border;
        // font-size: calc(14/1920*100vw);
        .title-description{
        }
        .title-content{
        }
        .access-content{
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
          color: #acaeb1;
          font-size: 12px;
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
            margin-left: calc(200/1920*100vw);
            overflow: hidden;
            background-color: #f7f9fa;
            display: flex;
            flex-wrap: wrap;
            padding: calc(10/1920*100vw) calc(20/1920*100vw);
            .role-detail{
                    width: auto;
                    margin-top: calc(10/1920*100vw);
                    margin-bottom: calc(10/1920*100vw);
                    min-width: calc(215/1920*100vw);
              .role-name{
                        margin-left: calc(20/1920*100vw);
                        font-size: 14px;
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
  .temp-select-area{
    display:flex; 
    flex-direction:row;
    height:30px;
    width:220px;
    align-items:center;
    background-color:#f4f6f7;
    border-radius:5px;
    font-size: 13px;
    .temp-select-label{
      color:#556679;
      font-family: NotoSansCJKtc;
      font-size: 13px;
      width:75px;
      margin-left:16px;
      line-height: 15px;
    }
  }
</style>
<style>
  .role-group .el-checkbox{
    margin-right: 0;
  }
  .role-list #el-menuscrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
</style>
