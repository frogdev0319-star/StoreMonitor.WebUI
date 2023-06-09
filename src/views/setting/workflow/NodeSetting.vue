<template>
  <div class="page-container report-setting paper" style="height: 100%">

    <div class="setting-titles padding flex-center">
      {{$t('route.nodeSetting')}}
      <div class="spacer"/>
      <!-- 儲存 -->
      <delay-button 
        type="filled" 
        @click="saveNode"
        v-loading.fullscreen.lock="fullscreenLoading"
        >{{$t('audit.workFlows.save')}}</delay-button>
        
    </div>

    <!-- 基本信息 -->
    <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table :table-name="$t('audit.workFlows.basicInformation')">
            <template slot="tableDetail">

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name"><span style="color: #c60957">* </span> {{$t('audit.workFlows.nodeName')}}</div>
                <div class="title-status">
                  <el-input
                    ref="nodeName"
                    v-model="nodeData.name"
                    :placeholder="$t('audit.workFlows.inputNodeName')"
                    class="input-name"
                    @input="(val) => itemInputChanged(val, 20)"
                    />
                    <span class="text_limit_notice" style="position: absolute;" v-if="showInputLimit"> 最多可輸入 20 個字元  </span>
                </div>

                <el-radio-group class="select_audit storevue-radio" v-model="nodeData.auditTargetType">
                  <!-- 簽核部門 -->
                  <div class="select_audit_dep">
                    <el-radio :label="1">{{$t('audit.workFlows.auditDepart')}}</el-radio> 
                    <el-select 
                      v-model="departmentStatus" 
                      :placeholder="$t('audit.workFlows.selectAuditDepart')" 
                      :disabled="nodeData.auditTargetType == 0 || nodeData.auditTargetType == null">
                      <el-option
                        v-for="item in department"
                        :key="item.defineId"
                        :label="item.defineName"
                        :value="item.defineId" 
                        />
                    </el-select>
                  </div>

                  <!-- 簽核人員 -->
                  <div class="select_audit_dep" style="height: auto">
                    <el-radio :label="0">{{$t('audit.workFlows.auditUser')}}</el-radio>
                    <el-select
                      v-model="auditUsers"
                      filterable
                      :placeholder="$t('audit.workFlows.selectAuditUser')"
                      :loading="loading" 
                      :disabled="nodeData.auditTargetType == 1 || nodeData.auditTargetType == null"
                      >
                      <el-option
                        v-for="user in userInfo"
                        :key="user.userId"
                        :label="user.userName"
                        :value="user.userId">
                      </el-option>
                    </el-select>
                  </div>
                </el-radio-group>
              
                <div class="search_member" @click="handelePopupUserList" :class="{clickable : nodeData.auditTargetType == 0}"><i class="iconfont el-icon-view iconbangzhu"/> {{$t('audit.workFlows.findUser')}}</div>  
                
              </div>

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">{{$t('audit.workFlows.auditMethod')}}</div>
                <div class="flex">
                  <el-radio-group class="storevue-radio" v-model="nodeData.auditMethod">
                    <el-radio :label="0" style="margin-right: 0">{{$t('audit.workFlows.countersigned')}}</el-radio>  
                    <el-tooltip
                      class="date-time-tooltip"
                      effect="light"
                      placement="bottom-start">
                      <div slot="content">{{$t('audit.workFlows.rule_countersigned')}}</div>
                      <i class="iconfont icon-bangzhu iconbangzhu"/>
                    </el-tooltip>

                    <el-radio :label="1" style="margin-right: 0">{{$t('audit.workFlows.coSign')}}</el-radio>
                    <el-tooltip
                      class="date-time-tooltip"
                      effect="light"
                      placement="bottom-start">
                      <div slot="content">{{$t('audit.workFlows.rule_coSign')}}</div>
                      <i class="iconfont icon-bangzhu iconbangzhu"/>
                    </el-tooltip>
                  </el-radio-group>
                </div>
              </div>

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name">{{$t('audit.workFlows.auditButton')}}</div>
                <div class="approve">
                    <!-- 定義同意 -->
                    <div class="approve_row">
                      <el-radio-group class="storevue-radio flex-row" v-model="btnDefaultAgree">
                        <el-radio :label="0">{{$t('audit.workFlows.agree')}}</el-radio>  
                        <el-radio :label="1">{{$t('audit.workFlows.define')}}</el-radio>
                        <el-input
                          :placeholder="$t('audit.workFlows.defineItem')"
                          :disabled="btnDefaultAgree == 0"
                          :validate-event ="false"
                          v-model="defineAgree"
                          class="input-name"
                          @input="(val) => itemDefineChanged_a(val, 8)"
                          />
                          
                      </el-radio-group>
                      <span class="text_limit_notice" style="position: initial;" v-if="showDefineLimit_a"> {{$t('insSettingView.btnAttrLength')}} </span>
                    </div>
                    <!-- 定義拒絕 -->
                    <div class="approve_row">
                      <el-radio-group class="storevue-radio flex-row" v-model="btnDefaultReject">
                        <el-radio :label="0">{{$t('audit.workFlows.reject')}}</el-radio>  
                        <el-radio :label="1">{{$t('audit.workFlows.define')}}</el-radio>
                        <el-input
                          :placeholder="$t('audit.workFlows.defineItem')"
                          :disabled="btnDefaultReject == 0"
                          :validate-event="false"
                          v-model="defineReject"
                          class="input-name"
                          @input="(val) => itemDefineChanged_b(val, 8)"
                          />
                      </el-radio-group>
                      <span class="text_limit_notice" style="position: initial;" v-if="showDefineLimit_b"> {{$t('insSettingView.btnAttrLength')}} </span>

                    </div>

                    <!-- 定義撤回 -->
                    <div class="approve_row" style="margin-top: 3px">
                      <el-radio-group class="storevue-radio flex-row"  v-model="btnDefaultDrawback">
                        <el-radio :label="0">{{$t('audit.workFlows.withdraw')}}</el-radio>  
                        <el-radio :label="1">{{$t('audit.workFlows.define')}}</el-radio>
                        <el-input
                          :placeholder="$t('audit.workFlows.defineItem')"
                          :disabled="btnDefaultDrawback == 0"
                          :validate-event="false"
                          v-model="defineDrawback"
                          class="input-name"
                          @input="(val) => itemDefineChanged_c(val, 8)"
                          />
                      </el-radio-group>
                      <span class="text_limit_notice" style="position: initial;" v-if="showDefineLimit_c"> {{$t('insSettingView.btnAttrLength')}} </span>
                    </div>
                    
                </div>
              </div>

              <!-- row -->
              <div class="setting-config basic-config">
                <div class="title-name"> {{$t('audit.workFlows.nodeSign')}} </div>
                <div class="title-status">
                  <el-checkbox
                    v-model="nodeData.signature"
                    class="storevue-checkbox-outlined"
                    :label="$t('audit.workFlows.nodeSign')"/>
                </div>
              </div>
            </template>
          </setting-table>
        </div>

      </div>
    </div>

    <!-- 節點停留時間 -->
    <!-- <div v-loading="isLoadingData" class="setting-details self-loading">
      <div class="template-info">
        <div class="inspect-basic">
          <setting-table :table-name="$t('audit.workFlows.nodeStayTime')">
            <template slot="tableDetail">
              <div class="setting-config basic-config">
                <div class="title-status">
                  <el-checkbox
                    v-model="changeNotify"
                    class="storevue-checkbox-outlined"
                    :label="$t('audit.workFlows.alertAtOverTime')"/>
                </div>
              </div>
              <div class="setting-config basic-config">
                <div class="title-status">
                  {{$t('audit.workFlows.stayOver')}}
                  <el-input
                    ref="stayOver"
                    placeholder=""
                    type="number"
                    max="50"
                    v-model="nodeData.unHandleNotifyDay"
                    :disabled="!nodeData.notify"
                    class="input-name_short"
                    @input="(val) => numberRange(val)"
                    />
                  {{$t('audit.workFlows.day')}}
                </div>
              </div>

            </template>
          </setting-table>
        </div>
      </div>
    </div> -->

    <!-- search user popup -->
    <dialog-pop
      ref="dailog"
      class="popup_width"
      :title="$t('audit.workFlows.addAuditUser')"
      :close-on-click-modal="false"
      :show-close="false"
      :dialogWidth = "w_width"
      :visible="showingSearchUser"
      @cancelHandler="hideSearchUsersDialog('showingSearchUser')"
      @confirmHandler="confirmSearchUsersDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          <div class="showing_search_user">
            <div class="filter_section">
                <!-- 關鍵字 -->
                <div class="flex-row" style="margin-right: .5%; margin-bottom: 10px;">
                  <div class="title-name" style="width: fit-content;">{{$t('audit.workFlows.keywords')}} </div>
                  <div class="title-status"> 
                    <el-input
                      v-model="inputSearchUser"
                      :placeholder="$t('audit.workFlows.searchNameMail')"
                      style="width: 200px"
                      clearable
                      />
                  </div>
                </div>
                <!-- 部門 -->
                <div class="flex-row" style="margin-right: .5%; margin-bottom: 10px;">
                  <div class="title-name" style="width: fit-content;"> {{$t('audit.workFlows.depart')}}</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTemplateDepartment"
                      :placeholder="$t('audit.workFlows.depart')"
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in departmentAry"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- 職務 -->
                <div class="flex-row" style="margin-right: .5%; margin-bottom: 10px;">
                  <div class="title-name" style="width: fit-content;"> {{$t('audit.workFlows.position')}}</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTemplateTitleList"
                      :placeholder="$t('audit.workFlows.position')"
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in titleListAry"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- <div class="summit_filter" >篩選</div> -->
            </div>
            <div class="is_select">
              <div class="title-name"> {{$t('audit.workFlows.selected')}}</div>
              <div class="user_selected">
                <el-tag
                    v-for="tag in tags"
                    :key="tag.name"
                    closable
                    :type="tag.type"
                    @close="handleClose(tag)">
                    {{tag.userName}}
                  </el-tag>
              </div>
            </div>
            <div class="users">
              <table-only
                ref="usersList"
                class="table-white"
                :column-data ="userColumnData"
                :table-data ="searchUserData"
                :showSelectionColumn = showSelectionColumn
                
                :highlight-current-row = "false"
                :is-loading-data ="isLoadingData"
                :allowRowExpand = "false"
                :showBorder = "false"
                :headerStyle ="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                :cellStyle ="{backgroundColor: '#fff !important'}"
                @handleSelectionChange = "handleSelectionChange "
              />
            </div>
          </div>
        </div>
      </div>
    </dialog-pop>

  </div>
</template>
<script>
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import {updateWorkflow} from "@/api/workflow";
import {getDepart, getDepartAll} from '@/api/login';
import {
  getUserInfo,
  getAllUserInfoNoAuth
  } from '@/api/login';
import TableOnly from '@/components/TableOnly';
import DialogPop from '@/components/DialogPop';
import filterString from '@/common/filterString.js';
import util from "@/common/util";
export default {
  name: 'WorkflowDetail',
  components: {
    DelayButton,
    SettingTable,
    TableOnly,
    DialogPop
  },
  data() {
    return {
      nodeData: [],
      infoForm: {},
      apiData: {}, 
      loading: false,

      dataFromRoute: {},
      workflowDetail: {},
      department: [],
      departmentStatus: "",
      userInfo:[],

      w_width: "1000",
      tags: [],
      userColumnData: [
        {
          'prop': 'userName',
          'label': this.$t('audit.workFlows.name'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'email',
          'label': this.$t('audit.workFlows.email'),
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'sector',
          'label': this.$t('audit.workFlows.depart'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'title',
          'label': this.$t('audit.workFlows.position'),
          'width': 100,
          'maxWidth': 100,
        },
      ],
      userData:[],
      inputSearchUser: '',
      showSelectionColumn: true,
  
      showingSearchUser: false,
      inputSearchUser: '',
      titleList:[],
      titleListAry:[],
      departmentAry:[],
      curTemplateDepartment: '',
      curTemplateTitleList: '',
      

      // 簽核人員
      auditUsers:[],
      fullscreenLoading: false,
      basicList: [],
      isLoadingData: false,
      workflowDescription: '',
    
      sector: 0,
      btnDefaultAgree: 0,
      btnDefaultReject: 0,
      btnDefaultDrawback: 0,
      defineAgree: '',
      defineReject: '',
      defineDrawback: '',

      auditMembers: {},
      showInputLimit: false,
      showDefineLimit_a: false,
      showDefineLimit_b: false,
      showDefineLimit_c: false,

      changeNotify: false
    };
    
  },
  watch:{ 

    changeNotify(val){
      if(val == true){
        this.nodeData.notify = true
        if(this.nodeData.unHandleNotifyDay == null) this.nodeData.unHandleNotifyDay = 1

      } else {
        this.nodeData.notify = false
        this.nodeData.unHandleNotifyDay = null
      }
    },

    
    btnDefaultAgree(){
      if(this.btnDefaultAgree == 1){
        this.nodeData.customButton[0].text = this.defineAgree
      }   
      if(this.btnDefaultReject == 1){
        this.nodeData.customButton[1].text = this.defineReject
      }
      if(this.btnDefaultDrawback == 1){
        this.nodeData.customButton[2].text = this.defineDrawback
      }
    }
  },

  mounted() {},
  async created() {
    await this.init()
    
  },
  computed: {
    searchUserData: {
      get(){
        return this.filterInputSearchUser(this.filterCurTemplateDepartment(this.filterCurTemplateTitleList(this.userData)))
      },
      set(val){
        console.log('val', val)
			}
    }
  },

  methods: {
    async init(){

      const data = sessionStorage.getItem('auditMembers')
      this.auditMembers = JSON.parse(data)
      console.log('this.auditMembers :>> ', this.auditMembers);

      await this.getNodeInfo() 
      await this.getWorkflowInfo()
      await this.getUserInfo()
      await this.getDepartmentList()
      
      await this.getTitle()
    }, 

    // get user
    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
        this.userInfo = res.data
        this.userInfo.forEach(i => {
          if(i.status == 40){
            i.userName = i.userName + " (停用中)"
          }
        })
        let newAuditByUsersArr = []
        if(this.auditMembers !== null){
          if(this.nodeData.auditByUsers.length !== 0){  
            this.auditMembers.auditByUsers = this.auditMembers.auditByUsers.filter(i => i !== this.nodeData.auditByUsers[0])
          }
          newAuditByUsersArr = this.userInfo.filter(i => !this.auditMembers.auditByUsers.includes(i.userId))
          this.userInfo = newAuditByUsersArr
        }

        this.userData = this.userInfo
        // console.log('this.nodeData :>> ', this.nodeData);
        // console.log('newAuditByUsersArr :>> ', newAuditByUsersArr);
        // console.log('this.userData :>> ', this.userData);

        // 按編輯要預設簽核人員
        if(this.nodeData.auditByUsers.length == 0) this.auditUsers = newAuditByUsersArr[0].userId

      }).catch(err => {
        console.log('error' + err);
      });
    },

  
    // get getDepart
    async getDepartmentList(){
      await getDepartAll({ type: 0 }).then(res=>{

        var AllDepartment = res.data

        let newAuditByGroupsArr = []
        if(this.auditMembers !== null){
          if(this.nodeData.auditByGroups.length !== 0){  
            this.auditMembers.auditByGroups = this.auditMembers.auditByGroups.filter(i => i !== this.nodeData.auditByGroups[0])
            this.departmentStatus = this.nodeData.auditByGroups[0]
            newAuditByGroupsArr = AllDepartment.filter(i => !this.auditMembers.auditByGroups.includes(i.defineId))
            
            this.department = newAuditByGroupsArr
            // console.log('this.department ::::::::::>> ', this.department);
            // console.log('this.departmentStatus ::::::::::>> ', this.departmentStatus);
            // console.log('this.auditMembers.auditByGroups ::::::::::>> ', this.auditMembers.auditByGroups);
          } else {
            newAuditByGroupsArr = AllDepartment.filter(i => !this.auditMembers.auditByGroups.includes(i.defineId))
            this.department = newAuditByGroupsArr
            this.departmentStatus = newAuditByGroupsArr[0].defineId
          }
        }
        
        this.departmentAry = res.data.map( i => i = i.defineName)
        this.departmentAry.unshift(this.$t('overview.allDepartment'))
      }).catch(err => {
        console.log('error' + err);
      });
    },




    // get title 職務
    async getTitle(){
      await getDepart({ type: 1 }).then(res=>{
        this.titleList =  res.data
        this.titleListAry = this.titleList.map( i => (
          i = i.defineName
        ))
        this.titleListAry.unshift(this.$t('overview.allPosition'))

        console.log('this.titleListAry  7:>> ', this.titleListAry);
        this.isLoadingData = false
      }).catch(err => {
        this.isLoadingData = false;
        console.log('error' + err);
      });
    },
    getWorkflowInfo(){
      const data = sessionStorage.getItem('workflowDetail')
      this.infoForm = JSON.parse(data)
      this.infoForm.type = this.$t('audit.workFlows.inspectionForm')
      console.log(' this.infoForm :>> ',  this.infoForm);
    },
    
    async getNodeInfo(){
      const data = sessionStorage.getItem('workflowNode')
      const apiData = sessionStorage.getItem('nodeDataToApi')

      this.nodeData = JSON.parse(data)
      this.apiData = JSON.parse(apiData)
      console.log('this.nodeData 2:>> ', this.nodeData);
      console.log('this.apiData :>> ', this.apiData);

      if(this.nodeData.customButton.length < 3){
        const drawBackBtn = {
            type: 2, 
            text: this.$t('audit.workFlows.withdraw'), 
            enable: true
        }
        this.nodeData.customButton.push(drawBackBtn)
      }
      

      if(this.nodeData.customButton[0].text !== this.$t('audit.workFlows.agree')){
        this.btnDefaultAgree = 1
        this.defineAgree = this.nodeData.customButton[0].text
      }
      if(this.nodeData.customButton[1].text !== this.$t('audit.workFlows.reject')){
        this.btnDefaultReject = 1
        this.defineReject = this.nodeData.customButton[1].text
      }
      if(this.nodeData.customButton[2].text !== this.$t('audit.workFlows.withdraw')){
        this.btnDefaultDrawback = 1
        this.defineDrawback = this.nodeData.customButton[2].text
      }


      // 簽核人員
      this.auditUsers = this.nodeData.auditByUsers.toString()
      console.log('this.auditUsers :>> ', this.auditUsers);

      // 取得部門資訊 & 簽核部門
      // await this.getDepartmentList() 
      // this.departmentStatus = this.department[0].defineId
      console.log('this.departmentStatus :>> ', this.departmentStatus);

      if(this.nodeData.notify) {
        this.changeNotify = true
      }else{
        this.changeNotify = false
      }

    },

    itemInputChanged(val, n){
      const content = filterString.all(val, n);
      this.nodeData.name = content

      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit = true
      } else {
        this.showInputLimit = false
      }
    },

    itemDefineChanged_a(val, n){
      const content = filterString.all(val, n);
      this.defineAgree = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showDefineLimit_a = true
      } else {
        this.showDefineLimit_a = false
      }
    },
    itemDefineChanged_b(val, n){
      const content = filterString.all(val, n);
      this.defineReject = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showDefineLimit_b = true
      } else {
        this.showDefineLimit_b = false
      }
    },
    itemDefineChanged_c(val, n){
      const content = filterString.all(val, n);
      this.defineDrawback = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showDefineLimit_c = true
      } else {
        this.showDefineLimit_c = false
      }
    },




    //======================================
    filterInputSearchUser(users){
        return  users.filter( item => item.userName.indexOf(this.inputSearchUser) > -1 || item.email.indexOf(this.inputSearchUser) > -1)

    },
    filterCurTemplateDepartment(users){
        if(this.curTemplateDepartment.length == 0 || this.curTemplateDepartment == this.departmentAry[0]){
          return users
        }else{
          return users.filter(item => item.sector.includes(this.curTemplateDepartment))
        }
    },
    filterCurTemplateTitleList(users){
      if(this.curTemplateTitleList.length == 0 || this.curTemplateTitleList == this.titleListAry[0]){
        return users
      }else{
        return users.filter(item => item.title == this.curTemplateTitleList )
      }
    },    

    confirmSearchUsersDialog(){
        console.log('this.multipleSelection ~~~~~~~>', this.multipleSelection)
        this.auditUsers = this.multipleSelection[0].userId
        console.log('this.auditUsers', this.auditUsers)
        this.showingSearchUser = false
    },

    // 關閉 lightbox
    hideSearchUsersDialog(key){
      this[key] = false;
      this.inputSearchUser =''
      this.curTemplateDepartment = ''
      this.curTemplateTitleList = ''
      
      // 清除所有勾選
      this.$refs.usersList.clear()
    },

    //popup 表格選取欄位(只能選一位)
    handleSelectionChange(val){

      this.multipleSelection = val.val
      console.log(' this.multipleSelection',  this.multipleSelection)
      this.tags = this.multipleSelection.map(t => (
        { 
          userName : t.userName,
          type: 'info'
        }
      ))
      if(this.multipleSelection.length > 1) {
        this.$refs.usersList.toggleChecked(this.tags[0])
      } 
    },

    // 刪除 tag
    handleClose(tag){
      console.log('tag--->', tag)
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$refs.usersList.toggleChecked(tag)
    },


    //處理 popup user selected
    handelePopupUserList(){
      this.showingSearchUser = true

      // [查詢人員]資料
      this.userData.forEach(user =>{
        this.titleList.forEach( title =>{
          if(title.contents.length !== 0 && title.contents.includes(user.userId)) user.title = title.defineName 
        })
        // user 會有多個部門
        user.sector = []
          this.department.forEach( dep =>{
            if(dep.contents.length !==  0 && dep.contents.includes(user.userId)) {
              user.sector.push(dep.defineName)
            }
          })
          user.sector = user.sector.join(", ")
      })
      
       // 等待 dialog 生成
      // if(this.ccToUSer.length > 0){
      //   var data = this.ccToUSer
      //   setTimeout(() => {
      //     this.$refs.usersList.fromInputSelect(data)
      //   }, 0);
      // }
    },

    //======================================

    numberRange(val){
      console.log('val :>> ', val);
      val = parseInt(Math.abs(val))
      if(val == 0) val = ''
      this.nodeData.unHandleNotifyDay = val
    },
    saveNode(){
      // this.fullscreenLoading = true

      //  節點名稱不可為空
      if(this.nodeData.name == ''){
        util.notify(this.$t('audit.workFlows.cantEmptyNodeName'), 'error', 2000 );
        return 
      }
      

      // handle btn naming
      if(this.btnDefaultAgree == 1){
        this.nodeData.customButton[0].text = this.defineAgree
      }else{
        this.nodeData.customButton[0].text = ''
        this.nodeData.customButton[0].text = this.$t('audit.workFlows.agree')
      }
      if(this.btnDefaultReject == 1){
        this.nodeData.customButton[1].text = this.defineReject
      }else{
        this.nodeData.customButton[1].text = ''
        this.nodeData.customButton[1].text = this.$t('audit.workFlows.reject')
      }

      if(this.btnDefaultDrawback == 1){
        this.nodeData.customButton[2].text = this.defineDrawback
      }else{
        this.nodeData.customButton[2].text = ''
        this.nodeData.customButton[2].text = this.$t('audit.workFlows.withdraw')
      }

    
      //自定簽核按鈕不可為空
      console.log('this.nodeData 3', this.nodeData)
      if(this.defineAgree == '' && this.btnDefaultAgree == 1 ){
        util.notify(this.$t('audit.workFlows.cantEmptyBtnName'), 'error', 2000 );
        return
      }
      if(this.defineReject == '' && this.btnDefaultReject == 1){
        util.notify(this.$t('audit.workFlows.cantEmptyBtnName'), 'error', 2000 );
        return
      }
      if(this.defineDrawback == '' && this.btnDefaultDrawback == 1){
        util.notify(this.$t('audit.workFlows.cantEmptyBtnName'), 'error', 2000 );
        return
      }

      // console.log('this.departmentStatus :>> ', this.departmentStatus);
      // console.log('this.auditUsers :>> ', this.auditUsers);
      // console.log('this.nodeData auditTargetType :::::::::~~~~~~>> ', this.nodeData.auditTargetType);

      // 簽核人員不可為空
      if((this.nodeData.auditTargetType == 0 && this.auditUsers == '') || (this.nodeData.auditTargetType == 1 && this.departmentStatus == '')){
        util.notify(this.$t('audit.workFlows.cantEmpty'), 'error', 1200 );
        this.fullscreenLoading = false
        return
      }
      
      //  停留時間不可為空
      if(this.nodeData.notify && this.nodeData.unHandleNotifyDay == ""){
        util.notify(this.$t('audit.workFlows.cantEmptyDays'), 'error', 2000 );
        this.$refs.stayOver.focus()
        return 
      } else if(this.nodeData.unHandleNotifyDay > 365){
        util.notify(this.$t('audit.workFlows.cantTooMuchDays'), 'error', 2000 );
        this.$refs.stayOver.focus()
        return
      }

      var status = sessionStorage.getItem('pageAction');
      const pageAction = JSON.parse(status)
      // console.log('pageAction', pageAction)

      if(this.nodeData.id == undefined){
        // add node
        //  節點名稱不可為重複
        var checkNameResult = this.apiData.orderedAuditNodeArray.some(i => i.name == this.nodeData.name )
        console.log('checkNameResult', checkNameResult)
        console.log('this.apiData.orderedAuditNodeArray :>> ', this.apiData.orderedAuditNodeArray);
        console.log('this.nodeData.name :>> ', this.nodeData.name);

        if(checkNameResult) {
          util.notify(this.$t('audit.workFlows.cantRepeatNodeName'), 'error', 2000 );
          console.log('!!!1')
          return
          }
        this.apiData.orderedAuditNodeArray = [...this.apiData.orderedAuditNodeArray, this.nodeData]
      }else {
        // !!!!!!!!!!!!!!!!!
        // edit ndoe
        // if(pageAction == "set"){
        // var checkNameResult = this.apiData.orderedAuditNodeArray.filter(i => i.name == this.nodeData.name )
        // if(checkNameResult.length > 0) {
        //   util.notify(this.$t('audit.workFlows.cantRepeatNodeName'), 'error', 2000 );
        //   console.log('!!!2')
        //   return
        //   }
        // }
        console.log("this is Editing")
        var apiDataIndex = this.apiData.orderedAuditNodeArray.findIndex(i => i.id == this.nodeData.id)
        console.log('apiDataIndex :>> ', apiDataIndex);
        this.apiData.orderedAuditNodeArray.splice(apiDataIndex, 1 , this.nodeData)
        sessionStorage.setItem('workflowNode', JSON.stringify(this.nodeData))
      }

      
      this.apiData.orderedAuditNodeArray.forEach(data =>{
        if(data.name == this.nodeData.name){
          if(data.auditTargetType == 0){
              // 切換簽核人員
              data.auditByUsers = []
              data.auditByGroups = []
              data.auditByUsers.push(this.auditUsers)
          } else if(data.auditTargetType == 1){
            // 切換簽核部門
            data.auditByUsers = []
            data.auditByGroups = []
            data.auditByGroups.push(this.departmentStatus)
          }
        }
      })
      

      
      
      console.log('to API', this.apiData)
      if(pageAction == "create" || pageAction == "edit"){
        console.log('pageAction ---->', pageAction)
      
        //  節點名稱不可為重複
        var status = sessionStorage.getItem('reNewNode');
        const reNewNode = JSON.parse(status)

        var checkNameResult = reNewNode.filter(i => i.name == this.nodeData.name )
        console.log('checkNameResult', checkNameResult)
        console.log('this.apiData :::::::>>>', this.apiData)

        // create alert
        if(checkNameResult.length > 0 && pageAction == "create") {
          util.notify(this.$t('audit.workFlows.cantRepeatNodeName'), 'error', 2000 );
          return
        }

        // edit alert
        if(checkNameResult.length > 0 && pageAction == "edit" ) {
          console.log(' this.nodeData',  this.nodeData)
          console.log('reNewNode', reNewNode)
          var tempAry = reNewNode.filter( i => i.id !== this.nodeData.id)
          console.log('tempAry', tempAry)

          var tt = tempAry.some(i =>
            i.name == this.nodeData.name
          ) 
          console.log('tt', tt)
          if(tt){
            util.notify(this.$t('audit.workFlows.cantRepeatNodeName'), 'error', 2000 );
            return
          }
        }
        sessionStorage.setItem('newWorkFlow', JSON.stringify(this.apiData))

        const getTo = sessionStorage.getItem('routeTo')
        const routeTo = JSON.parse(getTo)

        if(routeTo == "createWorkflow"){
          this.$router.push({name: 'createWorkflow'})
        }else if(routeTo == "workflowDetail"){
          this.$router.push({name: 'workflowDetail'})
        }
        
      }else if(pageAction == "set"){
         //  節點名稱不可為重複
        var status = sessionStorage.getItem('reNewNode');
        const reNewNode = JSON.parse(status)

        var checkNameResult = reNewNode.filter(i => i.name == this.nodeData.name )
        console.log('checkNameResult', checkNameResult)
        console.log('this.apiData :::::::>>>', this.apiData)

        // edit
        if(checkNameResult.length > 0 && pageAction == "set" ) {
          console.log(' this.nodeData',  this.nodeData)
          console.log('reNewNode', reNewNode)
          var tempAry = reNewNode.filter( i => i.id !== this.nodeData.id)
          console.log('tempAry', tempAry)

          var tt = tempAry.some(i =>
            i.name == this.nodeData.name
          ) 
          console.log('tt', tt)
          if(tt){
            util.notify(this.$t('audit.workFlows.cantRepeatNodeName'), 'error', 2000 );
            return
          }
        }
        
        sessionStorage.setItem('newWorkFlow', JSON.stringify(this.apiData))
        console.log('newWorkFlow 2', this.apiData)
        sessionStorage.setItem('pageAction', JSON.stringify("edit"))
        this.$router.push({name: 'workflowDetail'})

      

        // var checkRepeatArry = this.apiData.orderedAuditNodeArray.map(i => i = i.name)
        // console.log('checkRepeatArry', checkRepeatArry)
        
        // const repeat = checkRepeatArry.some( (item, index, arr) => arr.indexOf(item) !== index)
        // console.log('repeat', repeat)
        // if(repeat){
        //   util.notify(this.$t('audit.workFlows.cantRepeatNodeName'), 'error', 2000 );
        // }else{
        //   // call api
        //   updateWorkflow(this.apiData).then(res=>{
        //     console.log('res :>> ', res);
        //     this.$router.push({name: 'workflowDetail'})
        //     this.isLoadingData = false
        //   }).catch(err => {
        //     console.log('error' , err);
        //   });
        // }

      }

    },
  }
};
</script>

<style lang="sass" scoped>
  
  .flex-row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    // width: fit-content

  
  .select_audit
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    width: fit-content
    .select_audit_dep
      height: 36px
      margin-right: 30px
  .search_member
    height: 36px
    font-size: 14px
    color: #d5d5d5
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    width: fit-content
    pointer-events: none

    i 
      margin-right: 5px
      color: #d5d5d5
  .clickable
    color: #006ab7
    cursor: pointer
    pointer-events: auto !important
    i 
      color: #006ab7

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start

  .setting-titles
    display: flex
    justify-content: space-between
    border-bottom: 1px solid #e3e9f4
  .setting-details
    margin: 30px
  .storevue-textarea
    width: 50vw
  .device-select
    .el-input__inner
        height: 30px
  .icon-gengduo
    width: 24px
    height: 24px
    vertical-align: middle
    cursor: pointer
    margin-left: 20px
  .for_row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .go_up
      margin-right: 20px
      color: #006ab7
    .go_down
      color: #006ab7
  .add-node-btn
    position: absolute
    right: 1%
    top: 3px
  .approve
    width: 60vw
  .approve_row
    background-color: #f7f9fa
    padding: calc(15/1920*100vw) calc(20/1920*100vw)
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: flex-start
    align-items: center
    .el-input
      margin-left: 10px
  
  .dialog-content
    width: 100%
    .showing_search_user
      width: 100%
      height: 500px
      
      .filter_section
        background: #FFF
        display: flex
        flex-wrap: wrap
        flex-direction: row
        justify-content: flex-start
        align-items: center
        padding: 10px 0 0 0
        margin-bottom: 10px
        .summit_filter
          width: 90px
          height: 37px
          border-radius: 3px
          background: rgb(85, 102, 121)
          color: #FFF
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          margin-bottom: 10px
          margin-left: 20px
          cursor: pointer
          transition: all .3s
          &:hover
            background: rgb(60, 92, 121)
      .is_select
        width: 100% !important
        padding: 10px 0 5px 0
        background: #FFF
        margin-bottom: 10px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        width: fit-content
        .title-name
          width: 90px
        .user_selected
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          .el-tag
            margin-right: 5px 
            margin-bottom: 5px

      .users
        height: 335px
        overflow: auto
        border-radius: 5px
</style>

<style lang="sass">
  .title-status
    .el-input__count-inner
      margin-top: 55px
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button 
      -webkit-appearance: none
      margin: 0



  .popup_width
    .el-dialog
      width: 70% !important
      background: #f7f9fa
      .el-table th
        &:first-child
          .cell
            width: 50px
            margin-left: -28px

  .users
    .el-checkbox__input.is-checked .el-checkbox__inner
      background: #2c90d9 !important
      border-color: #2c90d9 !important
      &:hover
        border-color: #dcdfe6 !important
    .is-focus .el-checkbox__inner      
      border-color: #dcdfe6 !important
    
    .el-checkbox__inner:hover
      border-color: #190 !important
      
  .title-status
    .el-input__count-inner
      margin-top: 55px
      
  .text_limit_notice
    position: absolute
    text-align: right
    margin-left: 5px
    font-size: 10px
    margin-top: 2px
    color: #ff2400
    display: block
</style>


<style scoped>
  .report-setting{
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
  }
  /* .setting-titles{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  } */
  .setting-tabs{
    display: flex;
    justify-content: flex-start;
  }
  .setting-name{
    cursor: pointer;
    width: 120px;
    color: #7d8cad;
    padding: 15px calc(20/1920*100vw) 0 calc(20/1920*100vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .click-setting-btn{
    color: #f31d65;
    border-bottom: 4px solid #f31d65;
  }

  .save-btn{
    text-align: left;
    margin-top: 20px;
  }

  .title-info{
    text-align: left;
    padding-bottom: calc(20/1920*100vw);
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .left-item, .right-item{
    display: inline-flex;
    align-items: center;
    margin-right: 100px;
  }

  .input-name{
    width: 200px;
    /* height: 36px; */
  }
  .input-name.el-input--medium >>> .el-input__inner{
    height: 36px;
    line-height: 30px;
    font-size: 12px;
  }

  .input-name_short{
    width: 100px;
    height: 30px;
  }
  .input-name_short.el-input--medium >>> .el-input__inner{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .span-font{
    font-size: 14px;
    color:#424151;
    /* width: 200px; */
    text-align: left;
  }
  .name-font{
    color:#424151;
    text-align: left;
    margin-right: calc(45/1920*100vw);
  }
  .enable-font{
    margin-right: 20px;
  }

  .name-tips{
    display:flex; 
    flex-direction:column;
    
  }
  .error-text{
    font-size: 12px;
    color: red;
    position: relative;
  }
  .error-text span{
    position: absolute;
  }
  .setting-config, .table-header{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* height: 60px; */
    padding: 15px 0;

  }
  .table-header{
    color: #424151;
    border: 1px solid #e3e9f4;
    border-bottom: none;
    font-weight: bold;
    background-color: #fff;
  }

  .detail-setting{
    /* padding: 0 calc(30/1920*100vw); */
  }
  .radio-setting{
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: center;
    margin-top: 20px;
  }
  .radio-setting .el-radio{
    height: 30px;
  }
  .setting-config{
    /* border-bottom: 1px solid #e3e9f4; */
    height: auto;
  }

  .setting-config:hover{
    cursor: pointer;
  }
  .basic-config, .basic-header{
    border: none;
    /* border-bottom: 1px solid #e3e9f4; */
    padding-left: calc(30/1920*100vw);
  }
  .basic-config:hover{
    cursor: default;
  }
  .title-name{
    width: 100px;
    text-align: left;
    margin-right: 20px;
    margin-left: calc(20/1920*100vw);
  }
  .title-status{
    width: 20%;
    text-align: left;
  }
  
  .title-operation{
    /* width: 20%; */
  }

  .sortable-ghost{
    color: #424151 !important;
    background: rgba(243, 19, 101, 0.1) !important;
    border: 1px solid #f31d65;
  }

  .statis-item{
    display: flex;
    height: 40px;
    align-items: center;
  }
  .el-radio{
    /* width: 90px !important; */
    margin-right: 20px;
  }
  .el-tooltip{
    margin-right: 30px;
    margin-left: 10px;
  }
  /* .setting-details{
    margin: 0 30px;
  } */
  .content-titles{
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 12px;
  }
  .template-select-area{
    display:flex; 
    flex-direction:row;
    height:calc(30/1920*100vw);
    width:200px;
    align-items:center;
    background-color:#f4f6f7;
    border-radius:5px;
    font-size: 13px;
    margin-right: 20px;
  }
  .template-select-label{
      color:#556679;
      font-family: NotoSansCJKtc;
      font-size: 13px;
      width:75px;
      margin-left:16px;
      line-height: 15px;
    }
  .inspect-basic{
    margin-bottom: 30px;
    position: relative;
  }

  .el-radio{
    color: #424151;
  }
  >>> .el-radio__input.is-checked + .el-radio__label{
    color: #424151;
  }
  .detail-table{
    /* border: 1px solid #e3e9f4;
    padding-bottom: 20px; */
    background-color: #f7f9fa
  }
  .promot-info{
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 12px;
    color: #7d8cad;
  }
</style>