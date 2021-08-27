<template>
  <div class="device-container">
    <account-header
      :added-device-number="addedDeviceNumber"
      :authorized-devices-num="authorizedDevicesNum"
      @click="getSkywatchGrantCode"
    >
      <div class="button-area">
        <i class="iconfont icon-authorize"/>
        <span>{{ $t('deviceView.beseyeAuthorize') }}</span>
      </div>
    </account-header>
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
import SkywatchAuthorizeConfig from '@/common/SkywatchAuthorizeConfig';
import { getSkywatchAccountList, deleteSkywatchAccount, skywatchAccountAuthorize } from '@/api/skywatch';
import { getDeviceAuthNumber } from '@/api/device';
import AccountHeader from '../AccountHeader';

export default {
  name: 'SkywatchAccount',
  components: { AccountHeader, TablePagination },
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
      code: '',
      state: '',
      skywatchAccount: '',
      isAuthorizing: false,
      isLoadingData: true,
      errorImgSource: require('../../../../../static/img/icon_error.png'),
      authorizedDevicesNum: 0,
      addedDeviceNumber: 0,
      accountId: ''
    };
  },

  watch: {
    accountChanged(val) {
      if (val !== 0) {
        this.getAccountId();
        this.getSkywatchAccountList();
        this.getSkywatchDeviceNum();
        this.getAuthorzationResult();
      }
    }
  },

  computed: {
    ...mapGetters({
      accountChanged: 'accountChanged'
    })
  },

  mounted() {
    this.getAccountId();
    this.getSkywatchAccountList();
    this.getSkywatchDeviceNum();
    this.getAuthorzationResult();
  },

  methods: {
    getAccountId() {
      this.accountId = sessionStorage.getItem('accountId');
    },

    getSkywatchAccountList() {
      this.isLoadingData = true;
      getSkywatchAccountList().then(res => {
        this.tableData = res.data;
        this.isLoadingData = false;
      }).catch(err => {
        this.tableData = [];
        this.isLoadingData = false;
        console.log('BeseyeAccount-getSkywatchAccountList: ' + err);
      });
    },

    getSkywatchDeviceNum() {
      this.authorizedDevicesNum = 0;
      this.addedDeviceNumber = 0;
      const params = { vendor: 3 };
      getDeviceAuthNumber(params).then(res => {
        this.authorizedDevicesNum = res.data.authDeviceNumber;
        this.addedDeviceNumber = res.data.addedDeviceNumber;
      }).catch(err => {
        console.log('getSkywatchDeviceNum' + err);
      });
    },

    getAuthorzationResult() {
      const paramsLength = Object.keys(this.$route.query).length;
      if (paramsLength > 0) {
        if (this.$route.query.success === "true") {
          this.skywatchAccount = this.$route.query.msg;
          const succMsg = this.getAuthorizeMsg('success');
          util.notify(succMsg, 'sucess', 3000);
          this.getSkywatchAccountList();
          this.getSkywatchDeviceNum();
        } else {
          this.skywatchAccount = '';
          const refusedMsg = this.getAuthorizeMsg('refuse');
          util.notify(refusedMsg, 'warning', 3000);
        }
      }
    },

    getAuthorizeMsg(type) {
      const succMsg = this.skywatchAccount.length > 0 ? this.$t('deviceView.reauthorizeSucc') : this.$t('deviceView.authorizeSucc');
      const failMsg = this.skywatchAccount.length > 0 ? this.$t('deviceView.reauthorizeFail') : this.$t('deviceView.authorizeFail');
      const refuseMsg = this.skywatchAccount.length > 0 ? this.$t('deviceView.reauthorizeRefused') : this.$t('deviceView.authorizeRefused');
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

    getSkywatchGrantCode() {
      this.setAuthorizeUrl();
    },

    setAuthorizeUrl() {
      const redirectServerUrl = SkywatchAuthorizeConfig.redirect_server_uri;
      const redirectClientUrl = SkywatchAuthorizeConfig.redirect_client_uri;
      let authorUrl = SkywatchAuthorizeConfig.userAuthorizationUri;
      authorUrl = `${authorUrl}?redirect_uri=${redirectServerUrl}&state=${this.accountId},${redirectClientUrl},${this.skywatchAccount}`;
      window.location.href = authorUrl;
    },

    handleEmitOperation(methodsAndRowObj) {
      const method = methodsAndRowObj.method;
      switch (method) {
        case 'set': {
          this.setSkywatchDevice(methodsAndRowObj.row);
          break;
        }
        case 'reauthorize': {
          this.skywatchReauthorization(methodsAndRowObj.row);
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

    setSkywatchDevice(row) {
      const rowData = { rowData: row };
      sessionStorage.setItem('skywatchAccountInfo', JSON.stringify(rowData));
      this.$router.push({ name: 'skywatchDeviceSetting' });
    },

    skywatchReauthorization(row) {
      this.skywatchAccount = row.skywatchAccount;
      this.setAuthorizeUrl();
    },

    showDeleteBeseyeUserDialog(row) {
      const self = this;
      self.deleteId = row.skywatchAccount;
      self.showDeleteBeseyeUser = true;
    },

    deleteSkywatchAccount() {
      const deleteAccountParams = this.setDeleteUserParams();
      deleteSkywatchAccount(deleteAccountParams).then(res => {
        if (res.errCode === 0) {
          util.notify(this.$t('deviceView.deleteSuccess'), 'success', 3000);
          this.showDeleteBeseyeUser = false;
          this.getSkywatchAccountList();
          this.getSkywatchDeviceNum();
        } else {
          util.notify(this.$t('deviceView.deleteFail'), 'warning', 3000);
          this.showDeleteBeseyeUser = false;
        }
      })
        .catch(err => {
          console.log('BeseyeAccount-deleteSkywatchAccount: ' + err);
        });
    },

    setDeleteUserParams() {
      const idArray = [];
      idArray.push(this.deleteId);
      const accountParams = {};
      accountParams.skywatchAccounts = idArray;
      return accountParams;
    }
  }
};
</script>

<style lang="scss">
  @import '../../../../assets/css/importfile.css';
  @import '../../../../assets/sass/device.scss';
</style>
