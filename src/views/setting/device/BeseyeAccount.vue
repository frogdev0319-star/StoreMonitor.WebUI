<template>
  <div class="device-container">
    <div class="btn-col">
      <div class="operation-btns">
        <el-button
          class="el-add-btn btn-class"
          size="mini"
          type="primary"
          @click="getBeseyeGrantCode"
        >
          <div class="btn-area">
            <i class="iconfont icon-authorize"/>
            <span>{{ $t('deviceView.beseyeAuthorize') }}</span>
          </div>
        </el-button>
      </div>
    </div>
    <div v-loading="isAuthorizing" :text="$t('deviceView.isAuthorizing')" class="table-container">
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
        :is-loading-data="isLoadingData"
        @handleOperation="handleEmitOperation"/>
    </div>
    <el-dialog
      v-if="showDeleteBeseyeUser"
      :title="$t('deviceView.deleteBeseyeUser')"
      :visible.sync="showDeleteBeseyeUser"
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
          <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteBeseyeUserInfo') }}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteBeseyeUser = false">
          {{ $t('deviceView.cancle') }}
        </el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteBeseyeUser()">
          {{ $t('deviceView.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import TablePagination from '@/components/TablePagination';
import util from '@/common/util.js';
import { mapGetters } from 'vuex';
import BeseyeAuthorizeConfig from '@/common/BeseyeAuthorizeConfig';
import { getBeseyeUserList, deleteBeseyeUser, beseyeAccountAuthorize } from '@/api/beseye';

export default {
  name: 'BeseyeUser',
  components: { TablePagination },
  data() {
    return {
      varyWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      tableData: [],
      columnData: [
        {
          'prop': 'name',
          'label': this.$t('deviceView.accountName'),
          'width': 130,
          'maxWidth': 130
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
            icon: 'icon-shanchu',
            methods: 'delete'
          },
          {
            lable: '',
            icon: 'icon-reauthorize',
            methods: 'reauthorize'
          }
        ]
      },
      total: 0,
      page: 1,
      sizeNum: 10,
      lang: this.$i18n.locale,
      showDeleteBeseyeUser: false,
      deleteId: '',
      accountList: [],
      commentRuletip: false,
      showDeleteStoreVueAccount: false,
      accountHead: 'account-header',
      accountCell: '',
      accountRow: '',
      grantCode: '',
      state: '',
      beseyeAccount: '',
      isAuthorizing: false,
      isLoadingData: true
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
    this.getBeseyeUserList();
    this.getCodeAndState();
  },

  methods: {
    getBeseyeUserList() {
      this.isLoadingData = true;
      getBeseyeUserList().then(res => {
        this.tableData = res.data;
        this.isLoadingData = false;
      }).catch(err => {
        this.tableData = [];
        this.isLoadingData = false;
        console.log('BeseyeAccount-getBeseyeUserList: ' + err);
      })
    },

    getCodeAndState() {
      const paramsLength = Object.keys(this.$route.params).length;
      if (paramsLength > 0) {
        this.grantCode = this.$route.params.code;
        this.state = this.$route.params.state;
        const stateStr = this.base64ToStr(this.state);
        this.beseyeAccount = stateStr.split('-')[2];
        this.grantCode !== 'error' && this.authorizeBeseyeAccount();
        this.grantCode === 'error' && this.getAuthorizeMsg('refuse');
      }
    },

    authorizeBeseyeAccount() {
      this.isAuthorizing = true;
      const params = this.setBeseyeAccountParams();
      beseyeAccountAuthorize(params).then(res => {
        const succMsg = this.getAuthorizeMsg('success');
        util.notify(succMsg, 'sucess', 3000);
        this.getBeseyeUserList();
        this.isAuthorizing = false;
      }).catch(error => {
        const failMsg = this.getAuthorizeMsg('warning');
        util.notify(failMsg, 'warning', 3000);
        this.isAuthorizing = false;
        console.log('BeseyeAccount-authorizeBeseyeAccount: ' + error);
      });
    },

    setBeseyeAccountParams() {
      const params = {};
      params.grantCode = this.grantCode;
      if (this.beseyeAccount && this.beseyeAccount.length > 0) {
        params.beseyeAccount = this.beseyeAccount;
      };
      return params;
    },

    getAuthorizeMsg(type) {
      const succMsg = this.beseyeAccount.length > 0 ? this.$t('deviceView.reauthorizeSucc') : this.$t('deviceView.authorizeSucc');
      const failMsg = this.beseyeAccount.length > 0 ? this.$t('deviceView.reauthorizeFail') : this.$t('deviceView.authorizeFail');
      const refuseMsg = this.beseyeAccount.length > 0 ? this.$t('deviceView.reauthorizeRefused') : this.$t('deviceView.authorizeRefused');
      const returnMsg = type === 'success' ? succMsg : type === 'warning' ? failMsg : refuseMsg;
      return returnMsg;
    },

    strToBase64(str) {
      const encodeStr = encodeURI(str);
      const base64Str = btoa(encodeStr);
      return base64Str;
    },

    base64ToStr(base64Str) {
      const decodeStr = atob(base64Str);
      const str = decodeURI(decodeStr);
      return str;
    },

    getBeseyeGrantCode() {
      this.setAuthorizeState();
      this.setAuthorizeUrl();
    },

    setAuthorizeState() {
      const stateStr = `Beseye-${this.beseyeAccount}`;
      const base64StateStr = this.strToBase64(stateStr);
      BeseyeAuthorizeConfig.state = base64StateStr;
      console.log(BeseyeAuthorizeConfig.state);
      return stateStr;
    },

    setAuthorizeUrl() {
      let authorUrl = BeseyeAuthorizeConfig.userAuthorizationUri;
      authorUrl = authorUrl + ('?' + qs.stringify({
        client_id: BeseyeAuthorizeConfig.client_id,
        response_type: BeseyeAuthorizeConfig.response_type,
        redirect_uri: BeseyeAuthorizeConfig.redirect_uri,
        scope: BeseyeAuthorizeConfig.scope,
        state: BeseyeAuthorizeConfig.state
      }));
      window.location.href = authorUrl;
    },

    handleEmitOperation(methodsAndRowObj) {
      const method = methodsAndRowObj.method;
      switch (method) {
        case 'set': {
          this.setBeseyeDevice(methodsAndRowObj.row);
          break;
        }
        case 'reauthorize': {
          this.beseyeReauthorization(methodsAndRowObj.row);
          break;
        }
        case 'delete': {
          this.showDeleteBeseyeUserDialog(methodsAndRowObj.row);
          break;
        }
        default: {
          break;
        }
      }
    },

    setBeseyeDevice(row) {
      const rowData = { rowData: row };
      sessionStorage.setItem('beseyeAccountInfo', JSON.stringify(rowData));
      this.$router.push({ name: 'beseyeDeviceSetting' });
    },

    beseyeReauthorization(row) {
      this.beseyeAccount = row.beseyeAccount;
      this.setAuthorizeState();
      this.setAuthorizeUrl();
    },

    showDeleteBeseyeUserDialog(row) {
      const self = this;
      self.deleteId = row.beseyeAccount;
      self.showDeleteBeseyeUser = true;
    },

    deleteBeseyeUser() {
      const deleteAccountParams = this.setDeleteUserParams();
      deleteBeseyeUser(deleteAccountParams).then(res => {
        if (res.errCode === 0) {
          util.notify(this.$t('deviceView.deleteSuccess'), 'success', 3000);
          this.showDeleteBeseyeUser = false;
          this.getBeseyeUserList();
        } else {
          util.notify(this.$t('deviceView.deleteFail'), 'warning', 3000);
          this.showDeleteBeseyeUser = false;
        }
      })
        .catch(err => {
          console.log('BeseyeAccount-deleteBeseyeUser: ' + err);
        });
    },

    setDeleteUserParams() {
      const idArray = [];
      idArray.push(this.deleteId);
      const accountParams = {};
      accountParams.beseyeAccounts = idArray;
      return accountParams;
    }
  }
};
</script>

<style lang="scss">
  @import '../../../assets/css/importfile.css';
  @import '../../../assets/sass/device.scss';
</style>
