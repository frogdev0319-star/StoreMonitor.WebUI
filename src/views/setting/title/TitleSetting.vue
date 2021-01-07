<template>
  <div class="setting-container">
    <div class="basic-info">
      <div class="title">
        <div class="title-info">
          <span>{{ $t('titleView.titleSetting') }}</span>
        </div>

        <div class="title-save">
          <el-button class="save-button" size="mini" type="primary" @click="saveBasicInfo">
            {{ $t('titleView.save') }}
          </el-button>
        </div>
      </div>
      <div class="basic-information">
        <el-form
          ref="infoForm"
          :model="infoForm"
          :rules="rules"
          label-position="left"
          label-width="120px"
          class="infoForm">
          <el-form-item :label="$t('titleView.titleName')" prop="title">
            <el-input v-model="infoForm.title" style="width: 20%;"/>
          </el-form-item>
          <el-form-item :label="$t('titleView.titleCate')" prop="roleId">
            <el-radio-group v-model="infoForm.roleId" :disabled="isAdd?false : true">
              <el-radio v-for="(item, index) in roleList" :label="item.value" :key="index">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('titleView.comment')" prop="comment" class="comment-class">
            <label slot="label" class="comment-label">{{ $t('titleView.comment') }}</label>
            <el-input
              v-model="infoForm.comment"
              :autosize="{minRows: 2, maxRows: 4}"
              style="width: 100%;"
              type="textarea"
              class="role-comment"
              @input="commentChange"
              @blur="notShowInputRuleTips"/>
            <span class="text" style="float: right;color: #909399;">{{ curLength }}/200</span>
            <span v-if="commentRuletip" class="rules">{{ $t('titleView.commentRuletip') }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="role-setting">
      <div class="setting-title">
        <span>{{ $t('titleView.roleSetting') }}</span>
      </div>
      <div class="role-list">
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <div v-for="(item,index) in roleNameList" v-show="item.disabled === false" :key="index" class="role-group">
            <div class="role-all-checkbox">
              <el-checkbox v-model="item.checked" :disabled="item.disabled" @change="(val)=>checkAllChildrenRole(index, val)"/>
              <span class="group-name">{{ item.roleName }}</span>
            </div>
            <div class="role-content">
              <div
                v-for="(_item,_index) in item.children"
                v-show="!_item.disabled|| (_item.disabled && _item.checked)"
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
import PermissionHelper from '../../../api/PermissionHelper';

export default {
  name: 'TitleSetting',
  data() {
    const validateTitle = (rule, value, callback) => {
      const self = this;
      if (value == undefined) {
        return callback(new Error(self.$t('titleView.enterTitleName')));
      } else {
        const reg = /^[A-Za-z\u4e00-\u9fa5]{1,20}$/;
        console.log(reg.test(value));
        const commentLength = filterString.getContentLength(value);
        if (reg.test(value) && commentLength <= 20) {
          if (self.isAdd) {
            // add title
            if (self.titleList.includes(value)) {
              return callback(new Error(self.$t('titleView.titleExist')));
            } else {
              callback();
            }
          } else {
            // update title
            const oldTitleName = JSON.parse(sessionStorage.getItem('titleInfo')).title;
            if (value === oldTitleName) {
              callback();
            } else {
              if (self.titleList.includes(value)) {
                return callback(new Error(self.$t('titleView.titleExist')));
              } else {
                callback();
              }
            }
          }
        } else {
          return callback(new Error(self.$t('titleView.titleValidateInfo')));
        }
      }
    };
    return {
      varyWindowHeight: window.innerHeight,
      commentRuletip: false,
      infoForm: {
        title: '',
        roleId: 1,
        comment: '',
        authorities: []
      },
      rules: {
        title: [
          { required: true, validator: validateTitle, trigger: 'blur' }
        ],
        roleId: [
          { required: true, trigger: 'blur' }
        ]
      },
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
            },
            {
              roleName: this.$t('route.storeChecking'),
              checked: false,
              disabled: true
            },
            {
              roleName: this.$t('route.customers'),
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
              roleName: this.$t('route.inspectSetting'),
              checked: false,
              disabled: false
            },
            {
              roleName: this.$t('route.deviceManage'),
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
              roleName: this.$t('route.titleManage'),
              checked: false,
              disabled: false
            }
          ]
        }
      ],
      tempRoleNameList: [],
      authorityInfoLists: [],
      isAdd: true,
      lang: this.$i18n.locale,
      titleList: JSON.parse(sessionStorage.getItem('titleList'))
    };
  },

  watch: {
    'infoForm.roleId'(newValue, old) {
      const self = this;
      console.log(newValue);
      console.log(self.tempRoleNameList);
      if (self.isAdd) {
        self.roleNameList = self.tempRoleNameList;
        console.log(self.roleNameList);
        self.roleNameList.forEach(item => {
          item.checked = false;
          item.children.forEach(_item => {
            _item.checked = false;
            _item.disabled = false;
          });
        });
        self.getAvailableAuthority();
      }
    }
  },

  mounted() {
    const self = this;
    self.tempRoleNameList = JSON.parse(JSON.stringify(self.roleNameList));
    self.isAdd = sessionStorage.getItem('isAdd') === '1';
    self.getAuthorityInfoList();
  },
  destroyed() {
    sessionStorage.removeItem('titleInfo');
    sessionStorage.removeItem('titleList');
    sessionStorage.removeItem('isAdd');
  },
  methods: {
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

    saveBasicInfo() {
      const self = this;
      self.$refs['infoForm'].validate(async(valid) => {
        if (valid) {
          self.getSelectedAuthorities();
          if (self.isAdd) {
            self.addBasicInformation().then(res => {
              if (res.errCode === 0) {
                self.notify(self.$t('titleView.saveSuss'), 'success', 3000);
                self.titleList.push(self.infoForm.title);
              } else {
                self.notify(self.$t('titleView.saveFail'), 'warning', 3000);
              }
            }).catch(error => {
              console.log('TitleSetting-addBasicInformation: ' + error);
            });
          } else {
            self.updateBasicInformation().then(res => {
              if (res.errCode === 0) {
                self.notify(self.$t('titleView.saveSuss'), 'success', 3000);
              } else {
                self.notify(self.$t('titleView.saveFail'), 'warning', 3000);
              }
            }).catch(error => {
              console.log('TitleSetting-updateBasicInformation: ' + error);
            });
          }
        } else {
          return false;
        }
      });
    },

    getSelectedAuthorities() {
      const self = this;
      self.infoForm.authorities = [];
      const decAuthorityNum = Math.pow(2, 32);
      self.roleNameList.forEach((item, index) => {
        let tempAuthorityNum = Math.pow(2, index) * decAuthorityNum;
        item.children.forEach((_item, _index) => {
          if (_item.checked) {
            tempAuthorityNum += Math.pow(2, _index);
          }
        });
        self.infoForm.authorities.push(tempAuthorityNum);
      });
    },

    addBasicInformation() {
      const self = this;
      const params = self.infoForm;
      return new Promise((resolve, reject) => {
        titleRESTful.addUserTitle(params).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
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

    getAuthorityInfoList() {
      const self = this;
      new Promise((resolve, reject) => {
        titleRESTful.getRoleInfo().then(result => {
          resolve(result);
        });
      }).then(res => {
        self.authorityInfoLists = res.data;
        self.getAvailableAuthority();
      }).catch(err => {
        console.log('TitleSetting-getAuthorityInfoList: ' + err);
      });
    },

    getAvailableAuthority() {
      const self = this;
      if (!self.isAdd) {
        const data = sessionStorage.getItem('titleInfo');
        self.infoForm = JSON.parse(data);
        const comment = filterString.all(self.infoForm.comment, 200);
        const commentLength = filterString.getContentLength(comment);
        self.curLength = commentLength;
      }
      const roleId = self.infoForm.roleId;
      PermissionHelper.setData(self.authorityInfoLists[roleId - 1].availableAuth);

      self.roleNameList[0].children[0].disabled = !PermissionHelper.enableRemoteOverview();
      self.roleNameList[0].children[1].disabled = !PermissionHelper.enableEventOverview();

      self.roleNameList[1].children[0].disabled = !PermissionHelper.enableRemoteInspect();
      self.roleNameList[1].children[1].disabled = !PermissionHelper.enableLocalInspect();
      self.roleNameList[1].children[2].disabled = !PermissionHelper.enableInspectReport();
      self.roleNameList[1].children[3].disabled = !PermissionHelper.enablePatrolTask();
      self.roleNameList[1].children[4].disabled = !PermissionHelper.enableStoreMonitor();
      self.roleNameList[1].children[5].disabled = !PermissionHelper.enableTransactionPatrol();
      self.roleNameList[1].children[6].disabled = !PermissionHelper.enableStorePointCheck();
      self.roleNameList[1].children[7].disabled = !PermissionHelper.enableCustomers();

      self.roleNameList[2].children[0].disabled = !PermissionHelper.enableEventHandle();
      self.roleNameList[2].children[1].disabled = !PermissionHelper.enableEventClose();
      self.roleNameList[2].children[2].disabled = !PermissionHelper.enableEventAdd();
      self.roleNameList[2].children[3].disabled = !PermissionHelper.enableEventReturn();

      self.roleNameList[3].children[0].disabled = !PermissionHelper.enablePatrolEvaStatistics();
      self.roleNameList[3].children[1].disabled = !PermissionHelper.enableInspectStatistics();
      self.roleNameList[3].children[2].disabled = !PermissionHelper.enableEventStatistics();
      self.roleNameList[3].children[3].disabled = !PermissionHelper.enableSupervisionEffStatistics();

      self.roleNameList[4].children[0].disabled = !PermissionHelper.enablePatrolSetting();
      self.roleNameList[4].children[1].disabled = !PermissionHelper.enableDeviceSetting();
      self.roleNameList[4].children[2].disabled = !PermissionHelper.enableStoreSetting();
      self.roleNameList[4].children[3].disabled = !PermissionHelper.enableScheduleSetting();
      self.roleNameList[4].children[4].disabled = !PermissionHelper.enableTitleSetting();

      self.getRequiredAuthority();
    },

    getRequiredAuthority() {
      // get required Authority of every title
      const self = this;
      const roleId = self.infoForm.roleId;
      const requiredAuth = self.authorityInfoLists[roleId - 1].requiredAuth;
      const authLength = requiredAuth.length;
      if (roleId < 4) {
        switch (authLength) {
          case 1: {
            // inspect report
            self.roleNameList[1].children[2].checked = true;
            self.roleNameList[1].children[2].disabled = true;
            // store monitor
            self.roleNameList[1].children[4].checked = true;
            self.roleNameList[1].children[4].disabled = true;
            break;
          }
          case 2: {
            // inspect report
            self.roleNameList[1].children[2].checked = true;
            self.roleNameList[1].children[2].disabled = true;
            // store monitor
            self.roleNameList[1].children[4].checked = true;
            self.roleNameList[1].children[4].disabled = true;
            // close event
            self.roleNameList[2].children[1].checked = true;
            self.roleNameList[2].children[1].disabled = true;
            break;
          }
          case 3: {
            // inspect report
            self.roleNameList[1].children[2].checked = true;
            self.roleNameList[1].children[2].disabled = true;
            // store monitor
            self.roleNameList[1].children[4].checked = true;
            self.roleNameList[1].children[4].disabled = true;
            // close event
            self.roleNameList[2].children[1].checked = true;
            self.roleNameList[2].children[1].disabled = true;

            self.roleNameList[4].children[3].checked = true;
            self.roleNameList[4].children[3].disabled = false;
            break;
          }
          default: {
            break;
          }
        }
      } else if (roleId === 4) {
        self.roleNameList[1].children[0].disabled = false;
        self.roleNameList[1].children[1].disabled = false;
        // inspect report
        self.roleNameList[1].children[2].checked = true;
        self.roleNameList[1].children[2].disabled = true;
        //
        self.roleNameList[1].children[3].checked = true;
        self.roleNameList[1].children[3].disabled = false;
        // store monitor
        self.roleNameList[1].children[4].checked = true;
        self.roleNameList[1].children[4].disabled = true;

        // handle event
        self.roleNameList[2].children[0].checked = true;
        self.roleNameList[2].children[0].disabled = true;

        // adding event
        self.roleNameList[2].children[2].checked = true;
        self.roleNameList[2].children[2].disabled = false;
      }
      self.roleNameList.forEach(item => {
        let disabledNum = 0;
        item.children.forEach(_item => {
          if (_item.disabled && !_item.checked) {
            disabledNum++;
          }
        });
        if (disabledNum === item.children.length) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
      // show the maxmium roleList
      if (self.isAdd) {
        self.roleNameList.forEach(item => {
          item.checked = !item.disabled;
          item.children.forEach(_item => {
            if (!_item.checked) {
              _item.checked = !_item.disabled;
            }
          });
        });
        if(roleId === 2 || roleId === 3){
          // handle event
          self.roleNameList[2].children[0].checked = false;
          self.roleNameList[2].children[0].disabled = false;
        }
        if (roleId === 4) {
          self.roleNameList[1].children[0].checked = false;
          self.roleNameList[1].children[0].disabled = false;
          self.roleNameList[1].children[1].checked = false;
          self.roleNameList[1].children[1].disabled = false;
          self.roleNameList[1].children[7].checked = false;
          self.roleNameList[1].children[7].disabled = false;
        }
      } else {
        // check has selected roles
        PermissionHelper.setData(self.infoForm.authorities);
        console.log(self.infoForm.authorities);
        self.roleNameList[0].children[0].checked = !!PermissionHelper.enableRemoteOverview();
        self.roleNameList[0].children[1].checked = !!PermissionHelper.enableEventOverview();

        self.roleNameList[1].children[0].checked = !!PermissionHelper.enableRemoteInspect();
        self.roleNameList[1].children[1].checked = !!PermissionHelper.enableLocalInspect();
        self.roleNameList[1].children[2].checked = !!PermissionHelper.enableInspectReport();
        self.roleNameList[1].children[3].checked = !!PermissionHelper.enablePatrolTask();
        self.roleNameList[1].children[4].checked = !!PermissionHelper.enableStoreMonitor();
        self.roleNameList[1].children[5].checked = !!PermissionHelper.enableTransactionPatrol();
        self.roleNameList[1].children[6].checked = !!PermissionHelper.enableStorePointCheck();
        self.roleNameList[1].children[7].checked = !!PermissionHelper.enableCustomers();

        self.roleNameList[2].children[0].checked = !!PermissionHelper.enableEventHandle();
        self.roleNameList[2].children[1].checked = !!PermissionHelper.enableEventClose();
        self.roleNameList[2].children[2].checked = !!PermissionHelper.enableEventAdd();
        self.roleNameList[2].children[3].checked = !!PermissionHelper.enableEventReturn();

        self.roleNameList[3].children[0].checked = !!PermissionHelper.enablePatrolEvaStatistics();
        self.roleNameList[3].children[1].checked = !!PermissionHelper.enableInspectStatistics();
        self.roleNameList[3].children[2].checked = !!PermissionHelper.enableEventStatistics();
        self.roleNameList[3].children[3].checked = !!PermissionHelper.enableSupervisionEffStatistics();

        self.roleNameList[4].children[0].checked = !!PermissionHelper.enablePatrolSetting();
        self.roleNameList[4].children[1].checked = !!PermissionHelper.enableDeviceSetting();
        self.roleNameList[4].children[2].checked = !!PermissionHelper.enableStoreSetting();
        self.roleNameList[4].children[3].checked = !!PermissionHelper.enableScheduleSetting();
        self.roleNameList[4].children[4].checked = !!PermissionHelper.enableTitleSetting();
      }
      self.roleNameList.forEach(item => {
        let childrenMustNum = 0;
        let childrenCheckedNum = 0;
        let childrenUncheckedNum = 0;
        let childrenNoAuthorityNum = 0;
        item.children.forEach(_item => {
          if (_item.disabled) {
            _item.checked ? childrenMustNum++ : childrenNoAuthorityNum++;
          } else {
            _item.checked ? childrenCheckedNum++ : childrenUncheckedNum++;
          }
        });
        if (childrenMustNum + childrenNoAuthorityNum + childrenCheckedNum === item.children.length) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      // self.roleNameList.forEach((item,index)=>{
      //   let parentDisable = self.roleNameList[index].disabled;
      //   let childrenCheckedNum = 0;
      //   let childrenDisableNum = 0;
      //   item.children.forEach(_item=>{
      //     if(_item.checked){
      //       childrenCheckedNum++;
      //     }
      //     else if(_item.disabled){
      //       childrenDisableNum++;
      //     }
      //   })
      //   let sumCheckAndDis = childrenCheckedNum + childrenDisableNum;
      //   if(childrenDisableNum== item.children.length){
      //     item.disabled = true;
      //   }
      //   if(sumCheckAndDis == item.children.length){
      //     item.checked = true;
      //   }
      //   // if(sumCheckAndDis == item.children.length && !parentDisable){
      //   //   if(childrenDisableNum > 0){
      //   //     item.disabled = true;
      //   //     item.checked = false;
      //   //   }
      //   //   else{
      //   //     item.disabled = false;
      //   //     item.checked = true;
      //   //   }
      //   // }
      // })
    },

    checkAllChildrenRole(index, val) {
      const self = this;
      self.roleNameList[index].children.forEach(item => {
        if (!item.disabled) {
          item.checked = val;
        }
      });
    },

    checkParentRole(index, val) {
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
      if (self.infoForm.roleId === 3 && index === 1) {
        // patrol schedule must be checked when remote patrol or onsite patrol checked
        const ifChecked = self.roleNameList[index].children[0].checked || self.roleNameList[index].children[1].checked;
        if (ifChecked) {
          self.roleNameList[index].children[3].checked = true;
          self.roleNameList[index].children[3].disabled = true;
        } else {
          self.roleNameList[index].children[3].disabled = false;
        }
      }
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }

  }
};
</script>

<style scoped lang="scss">
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $color: #606266;
  $black:#182752;

  .setting-container{
    height: calc(100vh - 80px - 45px - calc(60/1920*100vw));
    display: flex;
    flex-direction: column;
    border: 1px solid $border;
    background-color: #fff;
    .basic-info{
      .title{
        height: 70px;
        line-height: 70px;
        padding-left: calc(40/1920*100vw);
        padding-right: calc(25/1920*100vw);
        margin-bottom: 25px;
        font-size: calc(20/1920*100vw);
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $border;
        .title-info{
          color: $color;
        }
        .title-save{
          .save-button{
            width: calc(130/1920*100vw);
            vertical-align: middle;
            font-size: calc(14/1920*100vw);
            height: calc(36/1920*100vw);
            padding: 0 0;
          }
        }
      }
      .basic-information{
        text-align: left;
        margin-left: calc(25/1920*100vw);
        margin-right: calc(25/1920*100vw);
        padding-left: calc(15/1920*100vw);
        border-bottom: 1px solid $border;
        .rules{
          font-size: 10px;
          line-height: 20px;
          color: #ff2400;
          display: block;
        }
        .comment-class .el-form-item__label:before{
          content: ' ';
          margin-right: 4px;
        }
        /deep/ .el-form-item__label{
          font-size: calc(14/1920*100vw);
        }
        /deep/ .el-radio__label{
          font-size: calc(14/1920*100vw);
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
      .role-list{
        background-color: #F6F7FB;
        border:0.5px solid #e3e9f4;
        color: $black;
        height: calc(100% - 70px);
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
  .infoForm .el-radio__input.is-checked + .el-radio__label{
    color: #606266;
  }
  .infoForm .el-form-item:nth-last-child(1){
    margin-bottom: 0;
  }
  .role-group .el-checkbox{
    margin-right: 0;
  }
  .role-group /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color:#f31d65 ;
    border-color: #f31d65;
  }
  .comment-label::before{
    content: '*';
    margin-right: 4px;
    visibility: hidden;
  }
  .role-list #el-menuscrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .role-comment .el-textarea__inner{
    font-family: Roboto, Arial, 'Microsoft YaHei','Microsoft JhengHei',SimHei
  }
</style>
