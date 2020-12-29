<template>
  <div :style="{'height':varyWindowHeight-350+'px'}" class="detail-container">
    <el-row>
      <el-col :span="24" class="detail-title">
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
              <div v-if="ezvizAccountInfo.scope === 0">
                <el-col :span="24">
                  <el-form-item :label="$t('deviceView.ezvizAccount')" :error="errorAccount" prop="ezvizAccount">
                    <el-input v-model="ezvizAccountInfo.ezvizAccount" style="width: 100%;" @input="ezvizAccountChanged" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="$t('deviceView.accessKey')" :error="errorAccessKey" prop="accessKey">
                    <el-input v-model="ezvizAccountInfo.accessKey" style="width: 100%;"/>
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
                    <el-form-item :label="$t('deviceView.mobilePhone')" :error="errorAccount" prop="ezvizAccount">
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
              {{ $t('deviceView.confirmAdd') }}
            </el-button>
          </div>
        </el-dialog>
      </el-col>
      <el-col :span="24" >
        <div class="el-table-content">
          <el-table
            :data="tableData"
            :highlight-current-row="true"
            :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
            :cell-style="cellStyle"
            align="left"
            stripe
            style="width:100%;text-algin:center;border: 0px solid #ebebeb;"
          >
            <el-table-column
              v-for="(item,index) in tableInfoData"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"/>
            <el-table-column
              :label="$t('deviceView.operation')"
              prop="option"
              min-width="90"
              align="left">
              <template slot-scope="scope">
                <i class="iconfont icon-bianji" style="cursor: pointer; margin-right: 20px" @click="updateAccount(scope.row)"/>
                <i class="iconfont icon-shanchu" style="cursor: pointer;" @click="showDeleteAccountDialog(scope.row)"/>
              </template>
            </el-table-column>
            <div slot="empty">
              <div>
                <i class="iconfont icon-zhengque empty-data-icon"/>
                <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262'}">{{ noData }}</span>
              </div>
            </div>
          </el-table>
        </div>
      </el-col>
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
            class="nvrForm"
            label-position="top"
            size="mini">
            <el-col :span="24">
              <el-form-item :label="$t('deviceView.accessKey')" :error="errorAccessKey" prop="accessKey">
                <el-input v-model="ezvizAccountInfo.accessKey" style="width: 100%;"/>
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
    </el-row>
  </div>
</template>

<script>
import { ezvizRESTful } from '@/api/index';
import qs from 'qs';
import filterString from '@/common/filterString.js';

export default {
  name: 'EzvizAccount',

  data() {
    const validateEzvizAccount = (rule, value, callback) => {
      const self = this;
      const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{4,40}$/;
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
        if (reg.test(value)) {
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
        this.errorAccessKey = this.$t('deviceView.errorAccessKey');
        return callback(new Error(this.$t('deviceView.errorAccessKey')));
      } else {
        const reg = /^[a-zA-Z0-9]{1,40}$/;
        if (reg.test(value)) {
          callback();
        } else {
          this.errorAccessKey = this.$t('deviceView.errorAccessKey');
          return callback(new Error(this.$t('deviceView.errorAccessKey')));
        }
      }
    };
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      tableData: [],
      tableInfoData: [
        {
          'prop': 'ezvizAccount',
          'label': this.$t('deviceView.ezvizAccount'),
          'width': 130
        },
        {
          'prop': 'accountName',
          'label': this.$t('deviceView.accountName'),
          'width': 130
        },
        {
          'prop': 'appliedStores',
          'label': this.$t('deviceView.appliedStores'),
          'width': 150
        },
        {
          'prop': 'comment',
          'label': this.$t('deviceView.description'),
          'width': 260
        }
      ],
      ezvizAccountInfo: {
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
      },
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
            required: true, trigger: 'blur'
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
      allAccountNum: 0,
      userAccountNum: 0,
      storeviuNum: 0,
      curLength: 0,
      totalMsg: '',
      noData: '',
      accountList: [],
      commentRuletip: false,
      showDeleteStoreVueAccount: false,
      errorAccessKey: '',
      errorAuthDeviceNum: '',
      errorAccount: ''
    };
  },

  computed: {
    tableHieght() {
      if (this.windowHeight > 800) {
        return this.windowHeight * 0.72;
      } else if (this.windowHeight > 700) {
        return this.windowHeight * 0.67;
      } else {
        return this.windowHeight * 0.55;
      }
    }
  },

  mounted() {
    const self = this;
    self.getAccountList();
  },

  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let obj = {};
      if (columnIndex === 0) {
        obj = { 'border-left': '1px solid #e3e9f4', 'border-right': '1px solid #e3e9f4' };
      } else {
        obj = { 'border-right': '1px solid #e3e9f4' };
      }
      return obj;
    },

    showAddEzvizAccount() {
      const self = this;
      self.ezvizAccountInfo = {
        ezvizAccount: '',
        userName: '',
        appKey: '',
        appSecret: '',
        accessToken: '',
        scope: 0,
        target: '',
        comment: '',
        accessKey: '',
        authorizedDevices: 1,
        appliedStores: 0
      };
      self.isAdd = true;
      self.accountTitle = this.$t('deviceView.addNewAccount');
      self.errorMsg = '';
      self.errorAccessKey = '';
      self.errorAuthDeviceNum = '';
      self.curLength = 0;
      self.showAddAccount = true;
    },

    async getAccountList() {
      const self = this;
      self.tableData = [];
      try {
        const retData = await self.getEzvizAccountList();
        const accountList = retData.data;
        self.allAccountNum = accountList.length;
        self.storeviuNum = 0;
        self.userAccountNum = 0;
        accountList.forEach(item => {
          item.scope === 0 ? self.storeviuNum++ : self.userAccountNum++;
        });
        let totalMsg = `${this.$t('deviceView.total')}${self.allAccountNum}
                    ${this.$t('deviceView.ezvizAccountNum')}`;
        if (self.storeviuNum > 0) {
          if (self.userAccountNum > 0) {
            totalMsg += `${self.allAccountNum}${this.$t('deviceView.storeViuNum')}
          ${self.userAccountNum}${this.$t('deviceView.userAccountNum')}`;
          } else {
            totalMsg += `${self.allAccountNum}${this.$t('deviceView.storeViuNum')}`;
          }
        } else if (self.userAccountNum > 0) {
          totalMsg += `${self.userAccountNum}${this.$t('deviceView.userAccountNum')}`;
        }
        self.totalMsg = totalMsg;
        self.tableData = accountList;
        if (self.tableData.length === 0) {
          self.noData = self.$t('deviceView.noData');
        }
        const listArray = [];
        self.tableData.forEach(item => {
          listArray.push(item.ezvizAccount);
        });
        self.accountList = listArray;
      } catch (err) {
        console.log('EzvizAccount--getAccountList:' + err);
      }
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
            self.getAccessTokenMethod();
          } else {
            return false;
          }
        });
      } else {
        self.getAccessTokenMethod();
      }
    },

    async getAccessTokenMethod() {
      const self = this;
      self.errorMsg = '';
      const obj = {};
      obj.appKey = self.ezvizAccountInfo.appKey;
      obj.appSecret = self.ezvizAccountInfo.appSecret;
      const params = qs.stringify(obj);
      const result = await ezvizRESTful.getAccessToken(params);
      try {
        const data = result.data;
        const code = data.code;
        if (code !== '200') {
          switch (code) {
            case '10005': {
              self.errorMsg = self.$t('deviceView.appKeyFrozen');
              break;
            }
            case '10017': {
              self.errorMsg = self.$t('deviceView.appKeyNotExist');
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
          self.ezvizAccountInfo.accessToken = data.data.accessToken;
        }
      } catch (err) {
        console.log('EzvizAccount-getAccessTokenMethod: ' + err);
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
            // update
            await self.updateEzvizAccount();
          }
          await self.getAccountList();
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
      const accountParams = {};
      accountParams.ezvizAccount = self.ezvizAccountInfo.ezvizAccount;
      accountParams.comment = self.ezvizAccountInfo.comment;
      accountParams.scope = Number(self.ezvizAccountInfo.scope);
      if (self.ezvizAccountInfo.scope === 1) {
        accountParams.accountName = self.ezvizAccountInfo.accountName;
        accountParams.appKey = self.ezvizAccountInfo.appKey;
        accountParams.appSecret = self.ezvizAccountInfo.appSecret;
      } else {
        accountParams.accessKey = self.ezvizAccountInfo.accessKey;
        accountParams.authDeviceNumber = parseInt(self.ezvizAccountInfo.authorizedDevices);
      }
      try {
        const res = await ezvizRESTful.addEzvizAccount(accountParams);
        if (res.errCode === 0) {
          self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
          self.showAddAccount = false;
        } else {
          const msg = res.errMsg;
          if (self.ezvizAccountInfo.scope === 0) {
            self.setErrorMsg(msg);
          } else {
            self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
            self.showAddAccount = false;
          }
        }
      } catch (err) {
        console.log('EzvizAccount-addEzvizAccount: ' + err);
      }
    },

    async updateEzvizAccount() {
      const self = this;
      const accountParams = {};
      accountParams.id = self.deleteId;
      accountParams.ezvizAccount = self.ezvizAccountInfo.ezvizAccount;
      accountParams.comment = self.ezvizAccountInfo.comment;
      if (self.ezvizAccountInfo.scope === 1) {
        accountParams.accountName = self.ezvizAccountInfo.accountName;
        accountParams.appKey = self.ezvizAccountInfo.appKey;
        accountParams.appSecret = self.ezvizAccountInfo.appSecret;
      } else {
        accountParams.accessKey = self.ezvizAccountInfo.accessKey;
        accountParams.authDeviceNumber = parseInt(self.ezvizAccountInfo.authorizedDevices);
      }
      try {
        const res = await ezvizRESTful.updateEzvizAccount(accountParams);
        if (res.errCode === 0) {
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          self.showAddAccount = false;
        } else {
          const msg = self.ezvizAccountInfo.scope === 0 ? res.errMsg : self.$t('deviceView.editFail');
          if (self.ezvizAccountInfo.scope === 0) {
            self.setErrorMsg(msg);
          } else {
            self.notify(msg, 'warning', 3000);
            self.showAddAccount = false;
          }
        }
      } catch (err) {
        console.log('EzvizAccount-addEzvizAccount: ' + err);
      }
    },

    updateAccount(row) {
      const self = this;
      self.isAdd = false;
      self.ezvizAccountInfo.ezvizAccount = row.ezvizAccount;
      self.ezvizAccountInfo.accountName = row.accountName;
      self.ezvizAccountInfo.appKey = row.appKey;
      self.ezvizAccountInfo.appSecret = row.appSecret;
      self.ezvizAccountInfo.scope = row.scope;
      self.ezvizAccountInfo.comment = row.comment;
      self.ezvizAccountInfo.oldEzvizAccount = row.ezvizAccount;
      self.curLength = row.comment ? filterString.getContentLength(row.comment) : 0;
      self.deleteId = row.id;
      self.ezvizAccountInfo.authorizedDevices = row.authDeviceNumber;
      self.ezvizAccountInfo.accessKey = '';
      self.appliedStores = row.appliedStores;
      if (row.scope === 1) {
        self.getAccessToken();
      }
      self.accountTitle = this.$t('deviceView.updateAccount');
      self.errorAccessKey = '';
      self.showAddAccount = true;
    },

    showDeleteAccountDialog(row) {
      const self = this;
      self.isAdd = false;
      self.ezvizAccountInfo.ezvizAccount = row.ezvizAccount;
      self.ezvizAccountInfo.accountName = row.accountName;
      self.ezvizAccountInfo.appKey = row.appKey;
      self.ezvizAccountInfo.appSecret = row.appSecret;
      self.ezvizAccountInfo.scope = row.scope;
      self.ezvizAccountInfo.comment = row.comment;
      self.ezvizAccountInfo.oldEzvizAccount = row.ezvizAccount;
      self.curLength = row.comment ? filterString.getContentLength(row.comment) : 0;
      self.deleteId = row.id;
      self.ezvizAccountInfo.accessKey = row.accessKey;
      self.ezvizAccountInfo.authorizedDevices = row.authorizedDevices;
      self.errorAuthDeviceNum = '';
      self.errorAccessKey = '';
      const appliedScored = row.appliedStores;
      if (appliedScored > 0) {
        self.notify(self.$t('deviceView.canotDeleteInfo'), 'warning', 3000);
        return;
      } else {
        self.deleteId = row.id;
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
    async deleteAccountService() {
      const self = this;
      const accountParams = {};
      accountParams.accountId = self.deleteId;
      if (self.ezvizAccountInfo.scope === 0) {
        accountParams.accessKey = self.ezvizAccountInfo.accessKey;
      }
      try {
        const res = await ezvizRESTful.deleteEzvizAccount(accountParams);
        if (res.errCode === 0) {
          self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
          self.showDeleteAccount = false;
          self.showDeleteStoreVueAccount = false;
          self.getAccountList();
        } else {
          if (self.ezvizAccountInfo.scope === 0) {
            self.errorAccessKey = res.errMsg;
          } else {
            self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
            self.showDeleteAccount = false;
          }
        }
      } catch (err) {
        console.log('EzvizAccount-deleteAccount: ' + err);
      }
    },

    commentChange(val) {
      const self = this;
      const comment = filterString.all(val, 100);
      console.log(comment);
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

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    setErrorMsg(msg) {
      const self = this;
      self.errorAccessKey = '';
      self.errorAuthDeviceNum = '';
      if (msg.indexOf('access key') !== -1) {
        self.errorAccessKey = String(Math.random());
        self.$nextTick(() => {
          self.errorAccessKey = msg;
        });
      } else if (msg.indexOf('authorized devices is invalid') !== -1) {
        self.errorAuthDeviceNum = String(Math.random());
        self.$nextTick(() => {
          self.errorAuthDeviceNum = self.$t('deviceView.errorDeviceNum');
        });
      } else if (msg.indexOf('authorized devices is less than') !== -1) {
        self.errorAuthDeviceNum = String(Math.random());
        self.$nextTick(() => {
          self.errorAuthDeviceNum = self.$t('deviceView.lessThanAuthorizedDevices');
        });
      } else if (msg.indexOf('Account does not exist') !== -1) {
        self.errorAccount = String(Math.random());
        self.$nextTick(() => {
          self.errorAccount = self.$t('deviceView.accountNotExist');
        });
      } else if (msg.indexOf('Account not authorized') !== -1) {
        self.errorAccount = String(Math.random());
        self.$nextTick(() => {
          self.errorAccount = self.$t('deviceView.accountNotAuthorized');
        });
      }
      else {
        self.errorAccessKey = String(Math.random());
        self.$nextTick(() => {
          self.errorAccessKey = msg;
        });
      }
    },

    ezvizAccountChanged(val) {
      const self = this;
      self.errorAccount = '';
      const comment = filterString.all(val, 40);
      const length = filterString.getContentLength(val);
      if (length === 0) {
        self.$nextTick(() => {
          self.errorAccount = self.$t('deviceView.enterAccount');
        });
      } else if (length >= 4 && length <= 40) {
        if (self.isAdd) {
          if (self.accountList.includes(comment)) {
            self.$nextTick(() => {
              self.errorAccount = self.$t('deviceView.accountExist');
            });
          }
        } else {
          if (self.ezvizAccountInfo.oldEzvizAccount === comment) {
            self.errorAccount = '';
          } else {
            if (self.accountList.includes(comment)) {
              self.errorAccount = self.$t('deviceView.accountExist');
            }
          }
        }
      } else {
        self.$nextTick(() => {
          self.errorAccount = self.$t('deviceView.enterAccount');
        });
      }
    }
  }
};
</script>

<style>
  @import '../../../assets/css/importfile.css';
</style>
<style lang="scss" scoped>
  @import '../../../assets/css/textstyle.css';
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  @function rem($val){
    @return $val/16+rem;
  }
  @function checkRem($val){
    @if($val==auto){@return auto;}
    @else if($val==0){@return 0;}
    @else{@return rem($val);}
  }
  @mixin point($poi,$val){
    #{$poi}:checkRem($val);
  }
  *{
    font-family: Roboto, Arial, "Microsoft YaHei";
  }
  .detail-title{
    overflow: hidden;
    .title-title{
      display: block;
      @include point(margin-top,10);
      margin-left: 0px;
      @include point(margin-bottom,15);
      float: left;
      font-size: 18px;
      font-weight: bold;
      color: #424151;
    }
    .route-btns{
      float: right;
      @include point(margin-right,15);
      .noAllow{
        cursor:not-allowed;
        opacity: 0.6;
      }
      .el-delete-btn{
        background-color: $mainColor;
        border-color:  $mainColor;
        color: #fff;
        @include point(margin-right,8);
        font-size: 12px;
        &:disabled{
          opacity: 0.6;
        }
      }
      .en-el-delete-btn{
        background-color: $mainColor;
        border-color:  $mainColor;
        color: #fff;
        font-size: 12px;
        text-align: center;
        &:disabled{
          opacity: 0.6;
        }
        span{
          position: relative;
        }
      }
    }
  }
  .el-table-content{
    border-bottom: none;
    .iconfont{
      font-size: calc(24/1920*100vw);
      color: #7d8cad;
    }
  }
  .access-button{
    position: relative;
    width: 100%;
  }
  .get-button{
    background-color: $mainColor;
    border-color:  $mainColor;
    color: #fff;
    position: absolute;
    right: calc(10/1920*100vw);
    height: 24px;
    font-size: 12px;
  }
  .account-list{
    padding: 20px calc(20/1920*100vw);
    border: 1px solid $border ;
    height: auto;
    position: relative;
    .buttom-div{
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .rules{
        font-size: 10px;
        line-height: 20px;
        color: #ff2400;
        display: block;
    }
  .elradio{
    &:last-child{
      border-left: 1px solid #dcdfe6;
    }
  }
</style>
<style>
  .current-row > td {
    background: #FEE7E4 !important;
  }
  .el-dialog__body{
    padding: 0px;
  }

  @media screen  and (max-width: 1280px){
    .add-dialog .el-dialog{
      width: 40% !important;
    }
  }

  .elradio .el-radio-button__inner{
    width: 86px;
    border-radius: 5px !important;
  }
  .ezviz-account .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before{
    color: #ccc;
  }
  .ezviz-account .el-form-item__content{
    display: inline-block;
    margin-left: 0 !important;
    width: 70%;
  }
  .access-token .el-form-item__content{
    width: 70%;
    display: inline-flex;
    align-items: center;
  }
  .access-button .el-form-item__content{
    width: 100%;
  }
  .nvrForm .el-form-item__error{
      color:#F56C6C !important;
  }
  .ezviz-account .el-form-item__error{
    color:#F56C6C !important;
  }
  .ezviz-account .el-form-item , .nvrForm .el-form-item {
    margin-bottom: 15px;
  }
  .nvrForm .el-radio__label , .nvrForm .el-form-item__label , .nvrForm .el-form-item__content{
    font-size: calc(14/1920*100vw);
  }
  .nvrForm .radio-item {
    margin-bottom: 15px;
  }
  .nvrForm .el-input__count{
    float: right;
  }
  .nvrForm .el-radio__input.is-checked + .el-radio__label{
    color: #606266;
  }
  .nvrForm .comment-item{
    margin-bottom: 0px;
  }
  .nvrForm .el-form-item__error{
    left: 0;
  }
  .el-table-content .el-table::before{
    height: 0px !important;
  }
  .el-table-content .el-table .cell {
    padding-left: calc(20/1920*100vw);
    padding-right: calc(20/1920*100vw);
  }
</style>
