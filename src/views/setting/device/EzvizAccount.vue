<template>
  <div class="device-container">
    <div class="btn-col">
      <div class="operation-btns">
        <el-button
          class="el-add-btn btn-class"
          size="mini"
          type="primary"
          @click="showAddEzvizAccountDialog"
        >
          <div class="btn-area">
            <i class="iconfont el-icon-plus"/>
            <span>{{ $t('deviceView.addEzvizAccount') }}</span>
          </div>
        </el-button>
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
        @handleOperation="handleEmitOperation"/>
    </div>
    <el-dialog
      v-if="showDeleteAccount"
      :title="$t('deviceView.deleteAccount')"
      :visible.sync="showDeleteAccount"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="28%"
      top="35vh"
      left="40vh">
      <div class="dialog-content" style="overflow:hidden;width:100%;">
        <hr style="border: 0.5px solid #dfe2e9;">
        <p style="margin: 20px 20px 20px 26px;">
          <i
            class="el-icon-warning"
            style="font-size:26px;margin-right:20px;color:#FF9803;
            display: inline-block; vertical-align: middle"/>
          <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.confirmDelete') }}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteAccount = false">
          {{ $t('deviceView.cancle') }}
        </el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteAccount()">
          {{ $t('deviceView.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="showDeleteStoreVueAccount"
      :title="$t('deviceView.deleteAccount')"
      :visible.sync="showDeleteStoreVueAccount"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="28%"
      top="35vh"
      left="40vh">
      <div class="dialog-content" style="overflow:hidden;width:100%;">
        <hr style="border: 0.5px solid #dfe2e9;">
        <el-form
          ref="accountForm"
          :model="ezvizAccountInfo"
          :rules="rules"
          class="accountForm"
          label-position="top"
          size="mini">
          <el-col :span="24">
            <el-form-item :label="$t('deviceView.accessKey')" :error="errorAccessKey" prop="accessKey">
              <el-input v-model="ezvizAccountInfo.accessKey" style="width: 100%;" type="password"/>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteStoreVueAccount = false">
          {{ $t('deviceView.cancle') }}
        </el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteAccount()">
          {{ $t('deviceView.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="showAddAccount"
      :title="accountTitle"
      :visible.sync="showAddAccount"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="30%"
      top="25vh"
      left="40vh"
      class="add-dialog"
    >
      <div class="dialog-content" style="overflow:hidden;width:100%;">
        <hr style="border: 0.5px solid #dfe2e9;">
        <el-form
          ref="accountForm"
          :model="ezvizAccountInfo"
          :rules="rules"
          class="accountForm"
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
          <div v-if="ezvizAccountInfo.scope === 0">
            <el-col :span="24">
              <el-form-item :label="`${this.$t('deviceView.mobilePhone')}${this.$t('deviceView.charterSize')}`" :error="errorAccount" prop="ezvizAccount">
                <el-input v-model="ezvizAccountInfo.ezvizAccount" style="width: 100%;" @input="ezvizAccountChanged" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('deviceView.accessKey')" :error="errorAccessKey" prop="accessKey">
                <el-input v-model="ezvizAccountInfo.accessKey" style="width: 100%;" type="password"/>
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
                  @input="(val)=>{ezvizAccountInfo.authorizedDevices = val.replace(/[^\d:]/g, '')}" />
              </el-form-item>
            </el-col>
          </div>
          <div v-else>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="`${this.$t('deviceView.mobilePhone')}${this.$t('deviceView.charterSize')}`" :error="errorAccount" prop="ezvizAccount">
                  <el-input v-model="ezvizAccountInfo.ezvizAccount" @input="ezvizAccountChanged" />
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item :label="$t('deviceView.accountName')" prop="accountName">
                  <el-input v-model="ezvizAccountInfo.accountName" />
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
                  <el-form-item label="AppKey" prop="appKey">
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
            <span v-if="commentRuletip" class="rules">{{ $t('insSettingView.enterListNameRuletip') }}</span>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showAddAccount = false">
          {{ $t('deviceView.cancle') }}
        </el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="addAccount">
          {{ isAdd ? $t('deviceView.confirmAdd') : $t('deviceView.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ezvizRESTful } from '@/api/index';
import qs from 'qs';
import filterString from '@/common/filterString.js';
import TablePagination from '../../../components/TablePagination';
import vm from '@/main.js';
import util from '@/common/util.js';
import { mapGetters } from 'vuex';

export default {
  name: 'EzvizAccount',
  components: { TablePagination },
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
          'prop': 'addedDeviceNumber',
          'label': this.$t('deviceView.hasAddedDevice'),
          'width': 130,
          'maxWidth': 130
        },
        {
          'prop': 'authDeviceNumber',
          'label': this.$t('deviceView.authorizedDevices'),
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
            lable: '',
            icon: 'icon-button',
            methods: 'set'
          },
          {
            lable: '',
            icon: 'icon-bianji',
            methods: 'edit'
          }, {
            lable: '',
            icon: 'icon-shanchu',
            methods: 'delete'
          }
        ]
      },
      ezvizAccountInfo: {},
      showAddAccount: false,
      ezvizScopes: [
        {
          'label': this.$t('deviceView.storeViuAccount'),
          'value': 0
        },
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
      showDeleteStoreVueAccount: false,
      errorAccessKey: '',
      errorAuthDeviceNum: '',
      errorAccount: '',
      accountHead: 'account-header',
      accountCell: '',
      accountRow: ''
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
  },

  methods: {
    initEzvizAccountInfo() {
      this.ezvizAccountInfo = {
        ezvizAccount: '',
        accountName: '',
        appKey: '',
        appSecret: '',
        accessToken: '',
        scope: 0,
        target: '',
        comment: '',
        accessKey: '',
        authorizedDevices: 1
      };
      this.errorMsg = '';
      this.errorAccessKey = '';
      this.errorAuthDeviceNum = '';
      this.errorAccount = '';
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
      this.getEzvizAccountList().then(res => {
        this.tableData = res.data;
        const listArray = [];
        this.tableData.forEach(item => {
          listArray.push(item.ezvizAccount);
        });
        this.accountList = listArray;
      }).catch(err => {
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
      const obj = {};
      obj.appKey = self.ezvizAccountInfo.appKey;
      obj.appSecret = self.ezvizAccountInfo.appSecret;
      const params = qs.stringify(obj);
      ezvizRESTful.getAccessToken(params).then(result => {
        const data = result.data;
        const code = data.code;
        if (code !== '200') {
          const msg = data.msg;
          self.setEzvizTokenErrorMsg(code, msg);
          self.ezvizAccountInfo.accessToken = '';
        } else {
          self.ezvizAccountInfo.accessToken = data.data.accessToken;
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
          if (self.ezvizAccountInfo.scope === 1) {
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
          const msg = res.errMsg;
          if (self.ezvizAccountInfo.scope === 0) {
            self.setErrorMsg(msg);
          } else {
            util.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
            self.showAddAccount = false;
          }
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
          if (self.ezvizAccountInfo.scope === 0) {
            self.setErrorMsg(msg);
          } else {
            util.notify(msg, 'warning', 3000);
            self.showAddAccount = false;
          }
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
        accountParams.accessKey = this.ezvizAccountInfo.accessKey;
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
      self.ezvizAccountInfo.authorizedDevices = row.authDeviceNumber;
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
      // self.ezvizAccountInfo.accessKey = row.accessKey;
      const appliedScored = row.appliedStores;
      if (appliedScored > 0) {
        util.notify(self.$t('deviceView.canotDeleteInfo'), 'warning', 3000);
        return;
      } else {
        self.deleteId = row.id;
        self.ezvizAccountInfo.accessKey = '';
        self.ezvizAccountInfo.scope === 0 ? self.showDeleteStoreVueAccount = true : self.showDeleteAccount = true;
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

    deleteAccountService() {
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
          self.showDeleteStoreVueAccount = false;
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

    setErrorMsg(msg) {
      const self = this;
      self.errorAccessKey = '';
      self.errorAuthDeviceNum = '';
      self.errorAccount = '';
      const setAccountErrorMsg = (showMsg) => {
        this.errorAccount = String(Math.random());
        this.$nextTick(() => {
          this.errorAccount = showMsg;
        });
      };

      const setAuthDeviceNumErrorMsg = (showMsg) => {
        this.errorAuthDeviceNum = String(Math.random());
        this.$nextTick(() => {
          this.errorAuthDeviceNum = showMsg;
        });
      };

      const setAccessKeyErrorMsg = (showMsg) => {
        this.errorAccessKey = String(Math.random());
        this.$nextTick(() => {
          this.errorAccessKey = showMsg;
        });
      };

      if (msg.indexOf('access key') !== -1) {
        setAccessKeyErrorMsg(self.$t('deviceView.errorAccessKey'))
      } else if (msg.indexOf('authorized devices is invalid') !== -1) {
        setAuthDeviceNumErrorMsg(self.$t('deviceView.errorDeviceNum'));
      } else if (msg.indexOf('authorized devices is less than') !== -1) {
        setAuthDeviceNumErrorMsg(self.$t('deviceView.lessThanAuthorizedDevices'));
      } else if (msg.indexOf('Account does not exist') !== -1) {
        setAccountErrorMsg(self.$t('deviceView.accountNotExist'))
      } else if (msg.indexOf('Account not authorized') !== -1) {
        setAccountErrorMsg(self.$t('deviceView.accountNotAuthorized'))
      } else if (msg.indexOf('Account already exists') !== -1) {
        setAccountErrorMsg(self.$t('deviceView.accountExist'))
      } else {
        setAccessKeyErrorMsg(msg)
      }
    },

    ezvizAccountChanged(val) {
      const self = this;
      const comment = filterString.all(val, 40);
      self.ezvizAccountInfo.ezvizAccount = comment;
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
