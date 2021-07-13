<template>
  <div class="device-container">
    <div class="account-title-btn">
      <div class="operation-title">
        <div>
          <div class="prompt-info" v-show="authorizedDevicesNum < addedDeviceNumber">
            <img :src="errorImgSource" class="error-img"/>
            <span class="error-msg">
            {{ $t('deviceView.deviceLimitation') }}
          </span>
          </div>
        </div>
        <div class="device-num-btn">
          <div>
            {{ $t('deviceView.authorizedDevicesNum') }} {{ authorizedDevicesNum }}
          </div>
          <div class="available-device">
            {{ $t('deviceView.addedDeviceNumber') }} {{ addedDeviceNumber }}
          </div>
          <delay-button @click="showAddEzvizAccountDialog"
                        class="inspction-btn">
            <div class="button-area">
              <i class="iconfont el-icon-plus"/>
              <span>{{ $t('deviceView.addEzvizAccount') }}</span>
            </div>
          </delay-button>
        </div>
      </div>
    </div>
    <div class="table-container">
      <table-pagination
        ref="ezvizAccoutTable"
        :column-data="columnData"
        :table-data="tableData"
        :table-operation ="columnOperationData"
        :show-pagination="false"
        :if-set-cell-style="true"
        :header-class="accountHead"
        :cell-class="accountCell"
        :row-class="accountRow"
        :show-border="false"
        :is-loading-data="isLoadingAccount"
        @handleOperation="handleEmitOperation"/>
    </div>
    <dialog-pop
      :title="$t('deviceView.deleteAccount')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showDeleteAccount"
      @visibleChangeHandler="updateDeleteAccountDialogFlag($event, 1)"
      @cancelHandler="hideDeleteAccountDialog(1)"
      @confirmHandler="deleteAccount"
    >
      <div class="dialog-slot">
        <i class="el-icon-warning dialog-icon"/>
        <div class="dialog-content">{{ $t('deviceView.confirmDelete') }}</div>
      </div>
    </dialog-pop>

    <dialog-pop
      :is-form="true"
      :title="accountTitle"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showAddAccount"
      :confirm-context="isAdd ? $t('deviceView.confirmAdd') : $t('deviceView.confirm')"
      dialog-width="510px"
      @visibleChangeHandler="updateAddAccountDialogFlag"
      @cancelHandler="hideAddAccountDialog"
      @confirmHandler="addAccount">
      <div class="form-slot">
        <el-form
          ref="accountForm"
          :model="ezvizAccountInfo"
          :rules="rules"
          class="nvrForm"
          label-position="top"
          size="mini">
          <el-form-item
            v-if="isAdd"
            :label="$t('deviceView.selectAccountType')"
            required
            class="radio-item">
            <el-radio-group v-model="ezvizAccountInfo.scope">
              <el-radio
                v-for="item in ezvizScopes"
                :key="item.value"
                :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ezvizAccountInfo.scope === 0 && !isAdd">
            <el-col :span="24">
              <el-form-item :label="`${this.$t('deviceView.mobilePhone')}${this.$t('deviceView.charterSize')}`"
                            :error="errorAccount" prop="ezvizAccount">
                <el-input v-model="ezvizAccountInfo.ezvizAccount" style="width: 100%;" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                :label="$t('deviceView.authorizedDevices')"
                :error="errorAuthDeviceNum"
                prop="authorizedDevices">
                <el-input
                  v-model="ezvizAccountInfo.authorizedDevices"
                  style="width: 100%;"
                  readonly />
              </el-form-item>
            </el-col>
          </div>
          <div v-else>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="`${this.$t('deviceView.mobilePhone')}${this.$t('deviceView.charterSize')}`"
                              :error="errorAccount" prop="ezvizAccount">
                  <el-input v-model="ezvizAccountInfo.ezvizAccount" @input="ezvizAccountChanged" />
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item :label="$t('deviceView.accountName')" prop="accountName">
                  <el-input v-model="ezvizAccountInfo.accountName" @input="accountNameChanged" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('deviceView.developerService')" required>
              <div class="account-list">
                <el-form
                  ref="appForm"
                  :label-width="varyWindowHeight < 1600 ? '90px' : '120px'"
                  :model="ezvizAccountInfo"
                  :rules="rules.appRules"
                  label-position="left"
                  class="ezviz-account"
                  size="mini">
                  <el-form-item label="AppKey" prop="appKey" :error="errorAppkeyMsg">
                    <el-input v-model="ezvizAccountInfo.appKey" :type="isAdd ? '': 'password'" />
                  </el-form-item>
                  <el-form-item label="AppSecret" prop="appSecret">
                    <el-input v-model="ezvizAccountInfo.appSecret" :type="isAdd ? '': 'password'"/>
                  </el-form-item>
                  <el-form-item
                    :error="errorMsg"
                    prop="accessToken"
                    label="AccessToken"
                    class="access-token" >
                    <el-input
                      ref="tokenInput"
                      v-model="ezvizAccountInfo.accessToken"
                      :type="isAdd ? '': 'password'"
                      readonly/>
                    <el-button class="get-button" @click.prevent="getAccessToken()">
                      {{ $t('deviceView.obtain') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-form-item>
          </div>
          <el-col :span="24">
            <el-form-item :label="$t('deviceView.comment')" prop="comment" class="comment-item">
              <el-input
                v-model="ezvizAccountInfo.comment"
                style="width: 100%;"
                type="textarea"
                @input="commentChange"
                @blur="notShowInputRuleTips"/>
            </el-form-item>
            <span class="text" style="float: right;color: #909399;">{{ curLength }}/100</span>
            <span v-if="commentRuletip" class="rules">{{ $t('deviceView.commentLengthPrompt') }}</span>
          </el-col>
        </el-form>
      </div>
    </dialog-pop>
  </div>
</template>

<script>
import { ezvizRESTful } from '@/api/index';
import qs from 'qs';
import filterString from '@/common/filterString.js';
import TablePagination from '@/components/TablePagination';
import vm from '@/main.js';
import util from '@/common/util.js';
import { mapGetters } from 'vuex';
import DialogPop from '@/components/DialogPop';
import DelayButton from '@/components/DelayButton';
import { getDeviceAuthNumber } from '@/api/device';

export default {
  name: 'EzvizAccount',
  components: { DelayButton, TablePagination, DialogPop },
  data() {
    const validateEzvizAccount = (rule, value, callback) => {
      const self = this;
      if (!value) {
        return callback(new Error(this.$t('deviceView.enterAccount')));
      } else {
        if (self.isAdd) {
          if (self.accountList.includes(value)) {
            return callback(new Error(this.$t('deviceView.accountExist')));
          }
        } else {
          if (self.ezvizAccountInfo.oldEzvizAccount === value) {
            callback();
          } else {
            if (self.accountList.includes(value)) {
              return callback(new Error(this.$t('deviceView.accountExist')));
            }
          }
        }
        const length = filterString.getContentLength(value);
        if (length >= 4 && length <= 40) {
          callback();
        } else {
          return callback(new Error(this.$t('deviceView.enterCorrentAccount')));
        }
      }
    };
    const validateAccountName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('deviceView.enterAccountName')));
      } else {
        const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error(this.$t('deviceView.enterAccountName')));
        }
      }
    };
    const validateAccessKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('deviceView.enterAccessKey')));
      } else {
        const reg = /^[a-zA-Z0-9]{1,40}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error(this.$t('deviceView.errorAccessKey')));
        }
      }
    };
    const validateAuthorizedDevices = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('deviceView.enterAuthorizedDevices')));
      } else {
        callback();
      }
    };
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      tableData: [],
      columnData: [
        {
          'prop': 'ezvizAccount',
          'label': this.$t('deviceView.ezvizAccount'),
          'width': 130,
          'maxWidth': 130
        },
        {
          'prop': 'appliedStores',
          'label': this.$t('deviceView.appliedStores'),
          'width': 150,
          'maxWidth': 160
        },
        {
          'prop': 'scope',
          'label': this.$t('deviceView.accountType'),
          'width': 150,
          'maxWidth': 150,
          'formatter': function(cellValue) {
            if (cellValue === 0) {
              return vm.$t('deviceView.storeViuAccount');
            } else {
              return vm.$t('deviceView.userAccount');
            }
          }
        },
        {
          'prop': 'comment',
          'label': this.$t('deviceView.description'),
          'width': 260,
          'maxWidth': 150
        }
      ],
      columnOperationData: {
        label: this.$t('deviceView.operation'),
        minWidth: '120',
        align: 'center',
        operation: [
          {
            label: '',
            icon: 'icon-button',
            methods: 'set'
          },
          {
            label: '',
            icon: 'icon-bianji',
            methods: 'edit'
          }, {
            label: '',
            icon: 'icon-shanchu disabled',
            methods: 'delete'
          }
        ]
      },
      ezvizAccountInfo: {},
      showAddAccount: false,
      ezvizScopes: [
        {
          'label': this.$t('deviceView.userAccount'),
          'value': 1
        }
      ],
      total: 0,
      page: 1,
      sizeNum: 10,
      lang: this.$i18n.locale,
      errorMsg: '',
      errorAppkeyMsg: '',
      rules: {
        ezvizAccount: [
          { required: true, validator: validateEzvizAccount, trigger: 'blur' }
        ],
        accountName: [
          { required: true, validator: validateAccountName, trigger: 'blur' }
        ],
        accessKey: [
          { required: true, validator: validateAccessKey, trigger: 'blur' }
        ],
        authorizedDevices: [
          {
            required: true, validator: validateAuthorizedDevices, trigger: 'blur'
          }
        ],
        app: [
          { required: true, message: '' }
        ],
        appRules: {
          appKey: [
            { required: true, message: this.$t('deviceView.enterAppKey'), trigger: 'blur' }
          ],
          appSecret: [
            { required: true, message: this.$t('deviceView.enterSecret'), trigger: 'blur' }
          ],
          accessToken: [
            { required: false, message: this.errorMsg, trigger: 'blur' }
          ]
        }
      },
      isAdd: true,
      accountTitle: this.$t('deviceView.addNewAccount'),
      showDeleteAccount: false,
      deleteId: '',
      curLength: 0,
      accountList: [],
      commentRuletip: false,
      errorAccessKey: '',
      errorAuthDeviceNum: '',
      errorAccount: '',
      accountHead: 'account-header',
      accountCell: '',
      accountRow: '',
      isLoadingAccount: true,
      errorImgSource: require('../../../../static/img/icon_error.png'),
      authorizedDevicesNum: 0,
      addedDeviceNumber: 0
    };
  },

  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.getAccountTableList();
      }
    }
  },

  computed: {
    ...mapGetters({
      accountChanged: 'accountChanged'
    })
  },

  mounted() {
    this.initEzvizAccountInfo();
    this.getAccountTableList();
    this.getEzvizDeviceNum();
  },

  methods: {
    initEzvizAccountInfo() {
      this.ezvizAccountInfo = {
        ezvizAccount: '',
        accountName: '',
        appKey: '',
        appSecret: '',
        accessToken: '',
        scope: 1,
        target: '',
        comment: ''
      };
      this.errorMsg = '';
      this.errorAppkeyMsg = '';
      this.errorAccessKey = '';
      this.curLength = 0;
    },

    showAddEzvizAccountDialog() {
      this.initEzvizAccountInfo();
      this.isAdd = true;
      this.accountTitle = this.$t('deviceView.addNewAccount');
      this.showAddAccount = true;
    },

    getAccountTableList() {
      this.tableData = [];
      this.isLoadingAccount = true;
      this.getEzvizAccountList().then(res => {
        this.tableData = res.data;
        const listArray = [];
        this.tableData.forEach(item => {
          listArray.push(item.ezvizAccount);
          item.tempComment = item.comment;
          item.comment = item.comment.length === 0 ? '--' : item.comment;
        });
        this.accountList = listArray;
        this.isLoadingAccount = false;
      }).catch(err => {
        this.isLoadingAccount = false;
        console.log('EzvizAccount--getAccountTableList:' + err);
      });
    },

    getEzvizAccountList() {
      return new Promise((resolve, reject) => {
        ezvizRESTful.getEzvizAccountList().then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getEzvizDeviceNum(){
      this.authorizedDevicesNum = 0;
      this.addedDeviceNumber = 0;
      const params = {vendor: 1};
      getDeviceAuthNumber(params).then(res => {
        this.authorizedDevicesNum = res.data.authDeviceNumber;
        this.addedDeviceNumber = res.data.addedDeviceNumber;
      }).catch(err => {
        console.log('getBeseyeDeviceNum' + err)
      })
    },

    async getAccessToken() {
      const self = this;
      if (self.isAdd) {
        self.$refs['appForm'].validate(async(valid) => {
          if (valid) {
            self.getAccessTokenFromEzviz();
          } else {
            return false;
          }
        });
      } else {
        self.getAccessTokenFromEzviz();
      }
    },

    async getAccessTokenFromEzviz() {
      const self = this;
      self.errorMsg = '';
      self.errorAppkeyMsg = '';
      const obj = {};
      obj.appKey = self.ezvizAccountInfo.appKey;
      obj.appSecret = self.ezvizAccountInfo.appSecret;
      const params = qs.stringify(obj);
      ezvizRESTful.getAccessToken(params).then(result => {
        const data = result.data;
        const code = data.code;
        if (code !== '200') {
          const msg = data.msg;
          switch (code) {
            case '10005': {
              self.errorAppkeyMsg = self.$t('deviceView.appKeyFrozen');
              break;
            }
            case '10017': {
              self.errorAppkeyMsg = self.$t('deviceView.appKeyNotExist');
              break;
            }
            case '10030': {
              self.errorMsg = self.$t('deviceView.mismatchInfo');
              break;
            }
            default: {
              self.errorMsg = data.msg;
              break;
            }
          }

          self.ezvizAccountInfo.accessToken = '';
        } else {
          this.$set( self.ezvizAccountInfo,'accessToken',data.data.accessToken);
        }
      }).catch(err => {
        console.log('EzvizAccount-getAccessTokenFromEzviz: ' + err);
      });
    },

    setEzvizTokenErrorMsg(code, msg) {
      const codeMsgMaps = new Map([
        [{ code: ['10005'] }, { msg: 'appKeyFrozen' }],
        [{ code: ['10017'] }, { msg: 'appKeyNotExist' }],
        [{ code: ['10030'] }, { msg: 'mismatchInfo' }]
      ]);
      const codeMsg = [...codeMsgMaps].filter(([key, value]) => (key.code.includes(code)));
      if (codeMsg.length > 0) {
        const msgValue = codeMsg.map(([key, value]) => { return value.msg; });
        this.errorMsg = this.$t(`deviceView.${msgValue}`);
      } else {
        this.errorMsg = msg;
      }
    },

    addAccount() {
      const self = this;
      let appFormValid = true;
      if (self.ezvizAccountInfo.scope === 1) {
        self.$refs['appForm'].validate(async(valid) => {
          if (valid) {
            if (self.ezvizAccountInfo.accessToken.length > 0) {
              appFormValid = true;
            } else {
              appFormValid = false;
              self.$refs.tokenInput.focus();
            }
          } else {
            appFormValid = false;
            return false;
          }
        });
      }
      self.$refs['accountForm'].validate(async(valid) => {
        if (valid && appFormValid) {
          if (self.isAdd) {
            await self.addEzvizAccount();
          } else {
            await self.updateEzvizAccount();
          }
        } else {
          if (!appFormValid && self.ezvizAccountInfo.scope === 1) {
            self.errorMsg = self.$t('deviceView.enterDeveloperKey');
          }
          return false;
        }
      });
    },

    async addEzvizAccount() {
      const self = this;
      const accountParams = this.getAddOrUpdateAccountParams();
      ezvizRESTful.addEzvizAccount(accountParams).then(res => {
        if (res.errCode === 0) {
          util.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
          self.showAddAccount = false;
          self.getAccountTableList();
        } else {
          util.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
          self.showAddAccount = false;
        }
      }).catch(err => {
        console.log('EzvizAccount-addEzvizAccount: ' + err);
      });
    },

    updateEzvizAccount() {
      const self = this;
      const accountParams = this.getAddOrUpdateAccountParams();
      accountParams.id = self.deleteId;
      ezvizRESTful.updateEzvizAccount(accountParams).then(res => {
        if (res.errCode === 0) {
          util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          self.showAddAccount = false;
          self.getAccountTableList();
        } else {
          const msg = self.ezvizAccountInfo.scope === 0 ? res.errMsg : self.$t('deviceView.editFail');
          util.notify(msg, 'warning', 3000);
          self.showAddAccount = false;
        }
      }).catch(err => {
        console.log('EzvizAccount-updateEzvizAccount: ' + err);
      });
    },

    getAddOrUpdateAccountParams() {
      const accountParams = {};
      accountParams.ezvizAccount = this.ezvizAccountInfo.ezvizAccount;
      accountParams.comment = this.ezvizAccountInfo.comment;
      accountParams.scope = Number(this.ezvizAccountInfo.scope);
      if (this.ezvizAccountInfo.scope === 1) {
        accountParams.accountName = this.ezvizAccountInfo.accountName;
        accountParams.appKey = this.ezvizAccountInfo.appKey;
        accountParams.appSecret = this.ezvizAccountInfo.appSecret;
      } else {
        accountParams.authDeviceNumber = parseInt(this.ezvizAccountInfo.authorizedDevices);
      }
      return accountParams;
    },

    updateAccount(row) {
      const self = this;
      self.isAdd = false;
      self.initEzvizAccountInfo();
      self.ezvizAccountInfo = row;
      self.ezvizAccountInfo.oldEzvizAccount = row.ezvizAccount;
      self.curLength = row.comment ? filterString.getContentLength(row.comment) : 0;
      self.deleteId = row.id;
      self.ezvizAccountInfo.comment = row.tempComment;
      self.ezvizAccountInfo.authorizedDevices = this.authorizedDevicesNum;
      self.appliedStores = row.appliedStores;
      if (row.scope === 1) {
        self.getAccessToken();
      }
      self.accountTitle = this.$t('deviceView.updateAccount');
      self.errorAccessKey = '';
      self.errorAccount = '';
      self.showAddAccount = true;
    },

    showDeleteAccountDialog(row) {
      const self = this;
      self.isAdd = false;
      self.errorAccessKey = '';
      self.errorAccount = '';
      self.ezvizAccountInfo.scope = row.scope;
      self.deleteId = row.id;
      const appliedScored = row.appliedStores;
      if (appliedScored > 0) {
        util.notify(self.$t('deviceView.canotDeleteInfo'), 'warning', 3000);
        return;
      } else {
        self.deleteId = row.id;
        self.ezvizAccountInfo.scope === 1 && (this.showDeleteAccount = true);
      }
    },

    async deleteAccount() {
      const self = this;
      if (self.ezvizAccountInfo.scope === 0) {
        self.$refs['accountForm'].validate(async(valid) => {
          if (valid) {
            self.deleteAccountService();
          } else {
            return false;
          }
        });
      } else {
        self.deleteAccountService();
      }
    },

    async deleteAccountService() {
      const self = this;
      const accountParams = {};
      accountParams.accountId = self.deleteId;
      if (self.ezvizAccountInfo.scope === 0) {
        accountParams.accessKey = self.ezvizAccountInfo.accessKey;
      }
      ezvizRESTful.deleteEzvizAccount(accountParams).then(res => {
        if (res.errCode === 0) {
          util.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
          self.showDeleteAccount = false;
          self.getAccountTableList();
        } else {
          if (self.ezvizAccountInfo.scope === 0) {
            self.errorAccessKey = res.errMsg;
          } else {
            util.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
            self.showDeleteAccount = false;
          }
        }
      })
        .catch(err => {
          console.log('EzvizAccount-deleteAccount: ' + err);
        });
    },

    updateDeleteAccountDialogFlag(val, accountType){
      this.showDeleteAccount = val;
    },

    hideDeleteAccountDialog(accountType){
      this.showDeleteAccount = false;
    },

    updateAddAccountDialogFlag(val){
      this.showAddAccount = val;
      this.clearFormValidate();
    },

    hideAddAccountDialog(){
      this.showAddAccount = false;
      this.clearFormValidate();
    },

    clearFormValidate(){
      this.$refs['accountForm'] && this.$refs['accountForm'].clearValidate();
      this.$refs['appForm'] && this.$refs['appForm'].clearValidate();
    },

    commentChange(val) {
      const self = this;
      const comment = filterString.all(val, 100);
      const commentLength = filterString.getContentLength(comment);
      self.curLength = commentLength;
      self.ezvizAccountInfo.comment = comment;
      const length = filterString.getContentLength(val);
      if (length > 100) {
        this.commentRuletip = true;
      } else {
        this.commentRuletip = false;
      }
    },

    notShowInputRuleTips() {
      this.commentRuletip = false;
    },


    ezvizAccountChanged(val) {
      const comment = filterString.all(val, 40);
      this.ezvizAccountInfo.ezvizAccount = comment;
    },

    accountNameChanged(val) {
      const comment = filterString.all(val, 20);
      this.ezvizAccountInfo.accountName = comment;
    },

    updateAuthorizedDevice(val) {
      this.ezvizAccountInfo.authorizedDevices = val.replace(/[^\d:]/g, '').replace(/^[0]+[0-9]*$/gi, '');
    },

    setEzvizAccount(row) {
      const rowData = { rowData: row };
      sessionStorage.setItem('ezvizAccount', JSON.stringify(rowData));
      this.$router.push({ name: 'deviceSetting' });
    },

    handleEmitOperation(methodsAndRowObj) {
      const method = methodsAndRowObj.method;
      switch (method) {
        case 'set': {
          this.setEzvizAccount(methodsAndRowObj.row);
          break;
        }
        case 'edit': {
          this.updateAccount(methodsAndRowObj.row);
          break;
        }
        case 'delete': {
          this.showDeleteAccountDialog(methodsAndRowObj.row);
          break;
        }
        default: {
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss">
  @import '../../../assets/css/importfile.css';
  @import '../../../assets/sass/device.scss';
</style>
