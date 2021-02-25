<template>
  <div class="device-container">
    <div class="btn-col">
      <div class="operation-btns">
        <el-button
          class="el-add-btn btn-class"
          size="mini"
          type="primary"
          @click="authorizeBeseye"
        >
          <div class="btn-area">
            <i class="iconfont icon-authorize"/>
            <span>{{ $t('deviceView.beseyeAuthorize') }}</span>
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
import Environment from '@/common/environment'

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
          'prop': 'accountName',
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
      ezvizAccountInfo: {},
      total: 0,
      page: 1,
      sizeNum: 10,
      lang: this.$i18n.locale,
      errorMsg: '',
      isAdd: true,
      accountTitle: this.$t('deviceView.addNewAccount'),
      showDeleteBeseyeUser: false,
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
      accountRow: '',
      grantCode: '',
      state: '',
      accountId: '',
      isAuthorizing: false
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
    console.log(this.$route.params);
    this.getBeseyeUserList();
    this.getCodeAndState();
  },

  methods: {
    getBeseyeUserList() {
      getBeseyeUserList().then(res => {
        this.tableData = res.data;
      }).catch(err => {
        this.tableData = [];
        console.log('BeseyeAccount-getBeseyeUserList: ' + err);
      })
    },

    getCodeAndState() {
      const paramsLength = Object.keys(this.$route.params).length;
      if (paramsLength > 0) {
        this.grantCode = this.$route.params.code;
        this.state = this.$route.params.state;
        const stateStr = this.base64ToStr(this.state);
        this.accountId = stateStr.split('-')[2];
        console.log(this.accountId);
        this.grantCode !== 'error' && this.authorizeBeseyeAccount();
        this.grantCode === 'error' && this.getAuthorizeMsg('refuse');
      }
    },

    authorizeBeseyeAccount() {
      const params = {};
      params.grantCode = this.grantCode;
      params.accountId = this.accountId;
      this.isAuthorizing = true;
      beseyeAccountAuthorize(params).then(res => {
        const succMsg = this.getAuthorizeMsg('success');
        util.notify(succMsg, 'sucess', 3000);
        this.getBeseyeUserList();
        this.isAuthorizing = false;
      }).catch(error => {
        const failMsg = this.getAuthorizeMsg('warning');
        util.notify(failMsg, 'warning', 3000);
        this.isAuthorizing = false;
        console.log('BeseyeDevice-authorizeBeseyeAccount: ' + error);
      });
    },

    getAuthorizeMsg(type) {
      const succMsg = this.accountId.length > 0 ? this.$t('deviceView.reauthorizeSucc') : this.$t('deviceView.authorizeSucc');
      const failMsg = this.accountId.length > 0 ? this.$t('deviceView.reauthorizeFail') : this.$t('deviceView.authorizeFail');
      const refuseMsg = this.accountId.length > 0 ? this.$t('deviceView.reauthorizeRefused') : this.$t('deviceView.authorizeRefused');
      const returnMsg = type === 'success' ? succMsg : type === 'warning' ? failMsg : refuseMsg;
      return returnMsg;
    },

    setAuthorizeState() {
      const redirectSite = Environment.REDIRECT_SITE;
      const isGlobal = Environment.isGlobalWebsite;
      const stateStr = `${redirectSite}-${isGlobal}-${this.userId}`;
      const base64StateStr = this.strToBase64(stateStr);
      BeseyeAuthorizeConfig.state = base64StateStr;
      console.log(BeseyeAuthorizeConfig.state);
      return stateStr;
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

    authorizeBeseye() {
      this.setAuthorizeState();
      this.setAuthorizeUrl();
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

    setBeseyeDevice(row) {
      const rowData = { rowData: row };
      sessionStorage.setItem('beseyeUserInfo', JSON.stringify(rowData));
      this.$router.push({ name: 'beseyeDeviceSetting' });
    },

    beseyeReauthorization(row) {
      this.userId = row.userId;
      this.setAuthorizeState();
      this.setAuthorizeUrl();
    },

    showDeleteBeseyeUserDialog(row) {
      const self = this;
      self.deleteId = row.id;
      self.showDeleteBeseyeUser = true;
    },

    deleteBeseyeUser() {
      const self = this;
      const accountParams = {};
      accountParams.userId = self.deleteId;
      deleteBeseyeUser(accountParams).then(res => {
        if (res.errCode === 0) {
          util.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
          self.showDeleteBeseyeUser = false;
          self.getBeseyeUserList();
        } else {
          util.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
          self.showDeleteBeseyeUser = false;
        }
      })
        .catch(err => {
          console.log('EzvizAccount-deleteBeseyeUser: ' + err);
        });
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
    }
  }
};
</script>

<style lang="scss">
  @import '../../../assets/css/importfile.css';
  @import '../../../assets/sass/device.scss';
</style>
