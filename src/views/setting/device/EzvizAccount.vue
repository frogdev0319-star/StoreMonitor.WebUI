<template>
  <div class="detail-container" :style="{'height':varyWindowHeight-350+'px'}">
    <el-row>
      <el-col :span="24" class="detail-title">
        <!--<span class="title-title ">{{totalMsg}}</span>-->
        <!--<div class="route-btns">-->
          <!--<el-button-->
            <!--:class=" lang=='en' ? 'en-el-delete-btn':'el-delete-btn'"-->
            <!--@click="showAddEzvizAccount"-->
            <!--size="mini">-->
            <!--<i style="margin-right:8px;" class="iconfont el-icon-plus"></i>-->
            <!--<span>{{$t('deviceView.addEzvizAccount')}}</span>-->
          <!--</el-button>-->
        <!--</div>-->
        <el-dialog :title="accountTitle"
                   :visible.sync="showAddAccount" v-if="showAddAccount"
                   :append-to-body='true'
                   :close-on-click-modal="false"
                   width="30%"
                   top="25vh"
                   left="40vh"
                   class="add-dialog"
        >
          <div class="dialog-content" style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #dfe2e9;"/>
            <el-form class="nvrForm" label-position="top"  :model="ezvizAccountInfo" :rules="rules" ref="accountForm" size="mini">
                <el-form-item :label="$t('deviceView.selectAccountType')" v-if="isAdd" required class="radio-item">
                  <el-radio-group v-model="ezvizAccountInfo.scope">
                    <el-radio v-for="item in ezvizScopes" :key="item.value"
                              :label="item.value">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              <div v-if="ezvizAccountInfo.scope == '0'">
                <el-col :span="24">
                  <el-form-item :label="$t('deviceView.mobilePhone')" prop="ezvizAccount">
                    <el-input v-model="ezvizAccountInfo.ezvizAccount" style="width: 100%;" ></el-input>
                  </el-form-item>
                </el-col>
              </div>
              <div v-else>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="ezvizAccount" :label="$t('deviceView.mobilePhone')" class="">
                      <el-input  v-model="ezvizAccountInfo.ezvizAccount" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item prop="accountName" :label="$t('deviceView.accountName')" class="">
                      <el-input v-model="ezvizAccountInfo.accountName" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item  :label="$t('deviceView.developerService')" required>
                  <div class="account-list">
                    <el-form  label-position="left" :label-width="varyWindowHeight< 1600? '90px' : '120px'" :model="ezvizAccountInfo" :rules="rules.appRules" class="ezviz-account" ref="appForm" size="mini">
                      <el-form-item label="AppKey" prop="appKey">
                        <el-input v-model="ezvizAccountInfo.appKey"  :type="isAdd? '': 'password'" ></el-input>
                      </el-form-item>
                      <el-form-item label="AppSecret" prop="appSecret">
                        <el-input v-model="ezvizAccountInfo.appSecret"  :type="isAdd? '': 'password'"></el-input>
                      </el-form-item>
                      <el-form-item prop="accessToken" label="AccessToken" class="access-token" :error="errorMsg" >
                        <el-input  ref='tokenInput' v-model="ezvizAccountInfo.accessToken" :type="isAdd? '': 'password'" readonly></el-input>
                        <el-button @click.prevent="getAccessToken()" class="get-button">{{$t('deviceView.obtain')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-form-item>
              </div>
              <el-col :span="24">
                <el-form-item :label="$t('deviceView.comment')" prop="comment" class="comment-item">
                  <el-input v-model="ezvizAccountInfo.comment" style="width: 100%;" type="textarea"  @input="commentChange" ></el-input>
                </el-form-item>
                <span class="text" style="float: right;color: #909399;">{{curLength}}/100</span>
              </el-col>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" @click="showAddAccount = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
            <el-button class="file-confirm-btn" @click="addAccount" size="mini" type="primary">{{$t('deviceView.confirmAdd')}}</el-button>
          </div>
        </el-dialog>
      </el-col>
      <el-col :span="24" >
        <div class="el-table-content">
          <el-table
            :data="tableData"
            :highlight-current-row="true"
            align='left'
            stripe
            style="width:100%;text-algin:center;border: 0px solid #ebebeb;"
            :header-cell-style="{fontSize:'#12px',color:'#7d8cad',height: '47px'}"
            :cell-style="cellStyle"
          >
            <el-table-column v-for="(item,index) in tableInfoData" :key="index"
                             :prop="item.prop" :label="item.label"  :min-width="item.width">
            </el-table-column>
            <el-table-column
              prop="option"
              :label="$t('deviceView.operation')"
              min-width="90"
              align="left">
              <template slot-scope="scope">
                <i class="iconfont icon-bianji" style="cursor: pointer; margin-right: 20px" @click="updateAccount(scope.row)"></i>
                <i class="iconfont icon-shanchu" style="cursor: pointer;" @click="showDeleteAccountDialog(scope.row)"></i>
              </template>
            </el-table-column>
            <div slot="empty">
              <div>
                <i class="iconfont icon-zhengque empty-data-icon"></i>
                <span :style="{'margin-left':'20px','font-size':'16px','color':'#4b5262'}">{{noData}}</span>
              </div>
            </div>
          </el-table>
          <!--<div class="toolbar pagination" style="width:100%; margin:10px 15px;height:12%;">-->
            <!--<el-pagination background small-->
                           <!--:page-sizes="[10, 20, 50, 100]"-->
                           <!--@size-change="sizeChange"-->
                           <!--@current-change="currentChange"-->
                           <!--layout="jumper,total, prev, pager, next,sizes"-->
                           <!--:page-size="sizeNum" :total="total"-->
                           <!--:current-page="page"-->
                           <!--style="float:right;margin-top:15px;">-->
            <!--</el-pagination>-->
          <!--</div>-->
        </div>
      </el-col>
      <el-dialog  :title="$t('deviceView.deleteAccount')"
                  :visible.sync="showDeleteAccount" v-if="showDeleteAccount"
                  :append-to-body='true'
                  :close-on-click-modal="false"
                  width="28%"
                  top="35vh"
                  left="40vh">
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #dfe2e9;"/>
          <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
            <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"></i>
            <span style="display: inline-block; vertical-align: middle">{{$t('deviceView.confirmDelete')}}</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="file-cancel-btn" @click="showDeleteAccount = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
          <el-button class="file-confirm-btn" @click="deleteAccount()" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import {deviceRESTful,ezvizRESTful} from '@/api/index'
  import {generateDeviceLang} from '@/api/i18n'
  import qs from 'qs'
  import filterString from '@/common/filterString.js'

  export default {
        name: "EzvizAccount",
        data(){
          const validateEzvizAccount =(rule,value,callback)=>{
            let self = this;
            const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
            console.log(reg.test(value))
            if(value == undefined){
              return callback(new Error(this.$t('deviceView.enterAccount')))
            }
            else{
              if(self.isAdd){
                if(self.accountList.includes(value)) {
                  return callback(new Error(this.$t('deviceView.accountExist')))
                }
              }
              else{
                if(self.ezvizAccountInfo.oldEzvizAccount == value){
                  callback()
                }
                else{
                  if(self.accountList.includes(value)) {
                    return callback(new Error(this.$t('deviceView.accountExist')))
                  }
                }
              }
              if (reg.test(value)) {
                callback()
              } else{
                return callback(new Error(this.$t('deviceView.enterCorrentAccount')))
              }
            }
          }
          const validateAccountName =(rule,value,callback)=>{
            if(value == undefined){
              return callback(new Error(this.$t('deviceView.enterAccountName')))
            }
            else{
              const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/
              console.log(reg.test(value))
              if (reg.test(value)) {
                callback()
              } else {
                return callback(new Error(this.$t('deviceView.enterAccountName')))
              }
            }
          }
          return{
            varyWindowWidth: window.innerWidth,
            varyWindowHeight: window.innerHeight,
            tableData:[],
            tableInfoData:[
              {
                "prop":"ezvizAccount",
                "label": this.$t('deviceView.ezvizAccount'),
                "width":130,
              },
              {
                "prop":"accountName",
                "label": this.$t('deviceView.accountName'),
                "width":130
              },
              {
                "prop":"appliedStores",
                "label": this.$t('deviceView.appliedStores'),
                "width":150
              },
              {
                "prop":"comment",
                "label": this.$t('deviceView.description'),
                "width":260
              },
            ],
            ezvizAccountInfo: {
              ezvizAccount : '',
              accountName: '',
              appKey: '',
              appSecret: '',
              accessToken: '',
              scope: '0',
              target: '',
              comment: ''
            },
            showAddAccount: false,
            ezvizScopes: [
              {
                'label': this.$t('deviceView.storeViuAccount'),
                'value': '0',
              },
              {
                'label': this.$t('deviceView.userAccount'),
                'value': '1'
              }
            ],
            total:0,
            page:1,
            sizeNum:10,
            lang: this.$i18n.locale,
            errorMsg: '',
            rules: {
              ezvizAccount: [
                { required: true, validator:validateEzvizAccount, trigger: 'blur' },
              ],
              accountName: [
                { required: true, validator:validateAccountName, trigger: 'blur' },
              ],
              app:[
                { required: true, message: ''},
              ],
              appRules:{
                appKey: [
                  { required: true, message: this.$t('deviceView.enterAppKey'), trigger: 'blur' }
                ],
                appSecret: [
                  {required: true, message: this.$t('deviceView.enterSecret'), trigger: 'blur' }
                ],
                accessToken: [
                  {required: false, message: this.errorMsg, trigger: 'blur' }
                ]
              }
            },
            isAdd:true,
            accountTitle: this.$t('deviceView.addNewAccount'),
            showDeleteAccount: false,
            deleteId: '',
            allAccountNum: 0,
            userAccountNum : 0,
            storeviuNum: 0,
            curLength: 0,
            totalMsg: '',
            noData: '',
            accountList: []
          }
        },
        methods:{
          cellStyle({ row, column, rowIndex, columnIndex}){
            console.log(row);
            console.log(columnIndex);
            let obj = {};
            if(columnIndex == 0){
              obj = {'border-left': '1px solid #e3e9f4','border-right':'1px solid #e3e9f4'};
            }
            else{
              obj = {'border-right':'1px solid #e3e9f4'}
            }
            return obj;
          },
          generateDeviceLang,
          showAddEzvizAccount(){
            let self = this;
            self.ezvizAccountInfo = {
              ezvizAccount : '',
              userName: '',
              appKey: '',
              appSecret: '',
              accessToken: '',
              scope: '0',
              target: '',
              comment: ''
            };
            self.isAdd = true;
            self.accountTitle = this.$t('deviceView.addNewAccount');
            self.errorMsg = '';
            self.showAddAccount = true;
          },
          async getAccountList(){
            let self = this;
            self.tableData = [];
            let retData = await self.getEzvizAccountList();
            let accountList = retData.data;
            self.allAccountNum = accountList.length;
            self.storeviuNum = 0;
            self.userAccountNum  = 0;
            accountList.forEach(item=>{
              item.scope == 0 ? self.storeviuNum ++ : self.userAccountNum++
            })
            let totalMsg = `${this.$t('deviceView.total')}${self.allAccountNum}${this.$t('deviceView.ezvizAccountNum')}`;
            if(self.storeviuNum > 0 ) {
              if (self.userAccountNum > 0) {
                totalMsg += `${self.allAccountNum}${this.$t('deviceView.storeViuNum')}${self.userAccountNum}${this.$t('deviceView.userAccountNum')}`;
              }
              else {
                totalMsg += `${self.allAccountNum}${this.$t('deviceView.storeViuNum')}`;
              }
            }
            else if(self.userAccountNum > 0){
              totalMsg += `${self.userAccountNum}${this.$t('deviceView.userAccountNum')}`;
            }
            self.totalMsg = totalMsg;
            console.log(accountList)
            self.tableData = accountList;
            if(self.tableData.length == 0){
              self.noData = self.$t('deviceView.noData');
            }
            let listArray = [];
            self.tableData.forEach(item=>{
              listArray.push(item.ezvizAccount)
            })
            self.accountList = listArray;
            console.log(self.accountList);
          },
          getEzvizAccountList(){
            return new Promise((resolve,reject)=>{
              ezvizRESTful.getEzvizAccountList().then(result=>{
                resolve(result);
              })
            })
          },
          async getAccessToken(){
            let self = this;
            if(self.isAdd){
              self.$refs['appForm'].validate(async (valid) => {
                if (valid) {
                  self.getAccessTokenMethod();
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
            }
            else{
              self.getAccessTokenMethod();
            }

          },
          async getAccessTokenMethod(){
            let self = this;
            self.errorMsg = '';
            let obj = {};
            obj.appKey = self.ezvizAccountInfo.appKey;
            obj.appSecret = self.ezvizAccountInfo.appSecret;
            let params = qs.stringify(obj)
            let result = await ezvizRESTful.getAccessToken(params);
            console.log(result)
            try{
              let data = result.data;
              let code = data.code;
              console.log(code);
              if(code !== '200'){
                switch (code) {
                   case '10005': {
                     self.errorMsg = self.$t('deviceView.appKeyFrozen');
                     break;
                   }
                  case '10017':{
                    self.errorMsg = self.$t('deviceView.appKeyNotExist');
                    break;
                   }
                  case '10030': {
                    self.errorMsg = self.$t('deviceView.mismatchInfo');
                    break;
                  }
                  default:{
                    self.errorMsg = data.msg;
                    break;
                  }
                }

                self.ezvizAccountInfo.accessToken = '';
              }
              else{
                self.ezvizAccountInfo.accessToken = data.data.accessToken;
              }
            }
            catch (e) {

            }
          },
          addAccount(){
            let self = this;
            let appFormValid = true;
            if(self.ezvizAccountInfo.scope == 1){
              self.$refs['appForm'].validate(async (valid) => {
                if (valid) {
                  if(self.ezvizAccountInfo.accessToken.length > 0){
                    appFormValid = true;
                  }
                  else{
                    appFormValid = false;
                    self.$refs.tokenInput.focus();
                  }
                } else {
                  console.log('error submit!!');
                  appFormValid = false;
                  return false;
                }
              });
            }
            self.$refs['accountForm'].validate(async (valid) => {
              if (valid && appFormValid) {
                console.log(self.ezvizAccountInfo);
                let accountParams = {};
                if(self.isAdd){
                  accountParams.ezvizAccount = self.ezvizAccountInfo.ezvizAccount;
                  accountParams.comment = self.ezvizAccountInfo.comment;
                  accountParams.scope = Number(self.ezvizAccountInfo.scope);
                  if(self.ezvizAccountInfo.scope == 1){
                    accountParams.accountName = self.ezvizAccountInfo.accountName;
                    accountParams.appKey = self.ezvizAccountInfo.appKey;
                    accountParams.appSecret = self.ezvizAccountInfo.appSecret;
                  }
                  else{

                  }
                  let res = await ezvizRESTful.addEzvizAccount(accountParams);
                  if (res.errCode == 0) {
                    self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
                    self.showAddAccount = false;
                  }
                  else {
                    self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
                    self.showAddAccount = false;
                  }
                }
                else{
                  // update
                  accountParams.id = self.deleteId;
                  accountParams.ezvizAccount = self.ezvizAccountInfo.ezvizAccount;
                  accountParams.comment = self.ezvizAccountInfo.comment;
                  // accountParams.scope = Number(self.ezvizAccountInfo.scope);
                  if(self.ezvizAccountInfo.scope == 1){
                    accountParams.accountName = self.ezvizAccountInfo.accountName;
                    accountParams.appKey = self.ezvizAccountInfo.appKey;
                    accountParams.appSecret = self.ezvizAccountInfo.appSecret;
                  }
                  else{

                  }
                  let res = await ezvizRESTful.updateEzvizAccount(accountParams);
                  if (res.errCode == 0) {
                    self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
                    self.showAddAccount = false;
                  }
                  else {
                    self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
                    self.showAddAccount = false;
                  }
                }
                self.getAccountList();
              } else {
                console.log('error submit!!');
                if(self.ezvizAccountInfo.scope == 1){
                  self.errorMsg = self.$t('deviceView.enterDeveloperKey')
                }

                return false;
              }
            });
          },
          updateAccount(row){
            console.log(row);
            let self = this;
            self.isAdd = false;
            self.ezvizAccountInfo.ezvizAccount = row.ezvizAccount;
            self.ezvizAccountInfo.accountName = row.accountName;
            self.ezvizAccountInfo.appKey = row.appKey;
            self.ezvizAccountInfo.appSecret = row.appSecret;
            self.ezvizAccountInfo.scope = row.scope;
            self.ezvizAccountInfo.comment = row.comment;
            self.ezvizAccountInfo.oldEzvizAccount = row.ezvizAccount;
            let commentLength = filterString.getContentLength(row.comment)
            self.curLength = commentLength;
            self.deleteId = row.id;
            if(row.scope == 1){
              self.getAccessToken();
            }
            self.accountTitle = this.$t('deviceView.updateAccount');
            self.showAddAccount = true;
          },
          showDeleteAccountDialog(row){
            let self = this;
            let appliedScored = row.appliedStores;
            if(appliedScored > 0){
              self.notify(self.$t('deviceView.canotDeleteInfo'), 'warning', 3000);
              return;
            }
            else{
              self.deleteId = row.id;
              self.showDeleteAccount = true;
            }

          },
          async deleteAccount(){
            let self = this;
            let accountParams = {};
            accountParams.accountId = self.deleteId;
            console.log(accountParams.accountId)
            let res = await ezvizRESTful.deleteEzvizAccount(accountParams);
            if (res.errCode == 0) {
              self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
              self.showDeleteAccount = false;
            }
            else {
              self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
              self.showDeleteAccount = false;
            }
            self.getAccountList();
          },
          commentChange(val){
            let self = this;
            let comment = filterString.all(val,100);
            console.log(comment);
            let commentLength = filterString.getContentLength(comment)
            self.curLength = commentLength;
            self.ezvizAccountInfo.comment = comment;
          },
          notify(msg,type,time) {
            this.$message({
              message: msg,
              type: type,
              duration:time
            });
          },
        },
        computed:{
          tableHieght(){
            if(this.windowHeight>800){
              return this.windowHeight*0.72;
            }
            else if(this.windowHeight>700){
              return this.windowHeight*0.67;
            }
            else{
              return this.windowHeight*0.55;
            }
          },
        },
        mounted(){
          let self=this;
          self.getAccountList();
        },
    }
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
  .detail-container{
    //height: calc(100vh - 125px - calc(60/1920*100vw));
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
        /**
        @media screen and (min-width: 1366px){
          @include point(width, 105);
        }
        @media screen and (max-width: 1366px){
          @include point(width, 150);
        }
        */
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
    margin-bottom: 0px;
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
