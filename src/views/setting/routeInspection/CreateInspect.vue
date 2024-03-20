<template>
  <div>
		<div class="submit_btn" >
      <delay-button type="filled" @click="submit">
        <div class="button-area" style="width: 80px; height: 20px;">
          <span>儲存</span>
        </div>
      </delay-button>
    </div>
	
      <div class="el-table-content" >
        <div class="send_content" v-loading="isLoadingData" style="padding-top:20px;">

          <div class="title-name" >表單設定</div>
          <div class="send_content_row" >
            <div class="row_title" ><span style="color: #c60957">* </span>巡檢表名稱</div>
            <el-input
              v-model="broadcastTitle"
              style="width: 50%;"
              ref="nodeName"
              :placeholder="$t('immediatePush.inputMessageTitle')"
              @input="(val) => itemInputChanged_a1(val, 50)"
            />
            <span class="notice" v-if="showInputLimit_a1">  {{$t('immediatePush.maxInput')}} 50 {{$t('immediatePush.character')}} </span>
          </div>

          <div class="send_content_row">
            <div class="row_title"><span style="color: #c60957">* </span> 考評總分計算方式</div>
            <div class="overall_row" >
              <el-radio-group class="storevue-radio radio_item" v-model="calculation" >
                <el-radio :label="0" style=" width: fit-content; text-align: left; margin-right: 40px;" > 總分-比例制 </el-radio>
                <el-radio :label="1" style=" width: fit-content;  margin-right: 40px;">加分制</el-radio>
                <el-radio :label="2" style=" width: fit-content;">扣分制 </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 考評總分範圍設定 -->
          <div class="send_content_row" v-if="extraPoints">
            <div class="overall_row" >
              <div class="title-status">
                <span style="color: #c60957">* </span> 考評總分範圍設定
                <el-input
                  v-model="aaa"
                  style="margin: 0 5px 0 10px;"
                  ref="overDue_Day"
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  />
                  分
              </div>
            </div>
              ~
            <div class="overall_row" >
              <div class="title-status">
                <el-input
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  style="margin: 0 5px;"
                  />
                  分
              </div>
            </div>
            <div class="overall_row" style="margin-left: 50px;">
              <div class="title-status">
                考評達標分
                <el-input
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  style="margin: 0 5px;"
                  />
                  分
              </div>
            </div>
          </div>

          <!-- 扣分起始分數 -->
          <div class="send_content_row" v-else>
            <div class="overall_row" >
              <div class="title-status">
                <span style="color: #c60957">* </span> 扣分起始分數
                <el-input
                  v-model="aaa"
                  style="margin: 0 5px;"
                  ref="overDue_Day"
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  />
                  分
              </div>
            </div>
            <div class="overall_row" style="margin-left: 50px;">
              <div class="title-status">
                <span style="color: #c60957">* </span> 考評總分範圍設定
                <el-input
                  v-model="aaa"
                  style="margin: 0 5px;"
                  ref="overDue_Day"
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  />
                  分
              </div>
            </div>
              ~
            <div class="overall_row" >
              <div class="title-status">
                <el-input
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  style="margin: 0 5px;"
                  />
                  分
              </div>
            </div>
            <div class="overall_row" style="margin-left: 50px;">
              <div class="title-status">
                考評達標分
                <el-input
                  placeholder=""
                  type="number"
                  :min="1"
                  class="input-name_short"
                  style="margin: 0 5px;"
                  />
                  分
              </div>
            </div>
          </div>

          <!-- 表單類型 -->
          <div class="send_content_row">
            <div class="row_title"><span style="color: #c60957">* </span>表單類型</div>
            <el-select 
              v-model="selectInstantBroadcastTitle"
              style="width: 25%;"
              filterable
              multiple
              >
              <el-option
                v-for="item in titleList"
                :key="item.defineId"
                :label="item.defineName"
                :value="item.defineId" 
                />
            </el-select>
            <el-select 
              v-model="selectInstantBroadcastTitle"
              style="width: 25%;"
              filterable
              multiple
              >
              <el-option
                v-for="item in titleList"
                :key="item.defineId"
                :label="item.defineName"
                :value="item.defineId" 
                />
            </el-select>
          </div>
          <!-- 其他設定 -->
          <div class="send_content_row">
            <div class="row_title">其他設定</div>
            <div class="role-all-checkbox"  style="margin-right: 30px">
              <el-checkbox
                v-model="bbb"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">忽略項視同得分</span>
            </div>
            <div class="role-all-checkbox"   style="margin-right: 30px">
              <el-checkbox
                v-model="bbb"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">先簽到，再巡檢</span>
            </div>
            <div class="role-all-checkbox"   style="margin-right: 30px">
              <el-checkbox
                v-model="bbb"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">顯示區域計分(僅支援網頁板)</span>
            </div>
            <div class="role-all-checkbox"  >
              <el-checkbox
                v-model="bbb"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">顯示巡檢類別計分</span>
            </div>
          </div>



          <!-- ///職務權限/// -->
          <div class="title-name" style="margin-top: 50px;">權限設定</div>
          <div class="subtitle_name" style="margin-top: 20px;">職務權限</div>
          <div class="send_content_row">
            <div class="row_title">職務權限</div>
            <el-select 
              v-model="selectInstantBroadcastTitle"
              style="width: 50%;"
              filterable
              multiple
              >
              <el-option
                v-for="item in titleList"
                :key="item.defineId"
                :label="item.defineName"
                :value="item.defineId" 
                />
            </el-select>
          </div>

          <div class="subtitle_name" style="margin-top: 20px;">門店權限</div>
          <div class="send_content_row">
            <!-- 全部門店 -->
            <div class="role-all-checkbox">
              <el-checkbox
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">綁定至所有地點</span>
            </div>
          </div>

          <div class="send_content_row">
            <div class="device-group">
              <div class="device-all-checkbox">
                <el-checkbox 
                  class="storevue-checkbox-filled"
                  />
                <span class="group-name">桃園市 - 龜山區</span>
              </div>
              <div class="device-content">
                <div  class="device-detail">
                  <el-checkbox 
                    class="storevue-checkbox-outlined"/>
                  <span class="device-name">文德店文德店文德店</span>
                </div>
                <div  class="device-detail">
                  <el-checkbox 
                    class="storevue-checkbox-outlined"/>
                  <span class="device-name">研華店</span>
                </div>
                <div  class="device-detail">
                  <el-checkbox 
                    class="storevue-checkbox-outlined"/>
                  <span class="device-name">長庚店 </span>
                </div>
            
              </div>
            </div>
          </div>
        </div>

        <!-- uploadProgress -->
        <!-- <el-dialog :visible.sync="uploadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
        <div class="body-content">
          <p>{{ $t('remotePatrol.uploading') }}</p>
          <p style="margin-bottom:15px;">
            {{ $t('remotePatrol.uploadInfo', {totalNum: totalnumOfPic, uploadedNum: uploadingnumOfPic}) }}
          </p>
          <el-progress :percentage="Math.round(uploadingnumOfPic/totalnumOfPic*100)"/>
        </div>
      </el-dialog> -->

      <!-- video dialog -->
      <!-- <el-dialog
        v-if="dialogAttachVideo"
        :title="$t('eventView.view')"
        :visible.sync="dialogAttachVideo"
        :close-on-click-modal="false"
        width="850px"
        height="834px"
        top="12%"
        class="rate-video-dialog"
        @close="stopCommentVideo">
        <div slot="title" class="dialog-title">{{$t('eventView.view')}}</div>
        <div class="video-dialog-content" style="overflow:hidden;">
          <div class="video-content" >
            <video
              id="previewAttVideo"
              height="83%"
              width="90%"
              prload
              controls
              autoplay
              class="video-js vjs-fill"/>
          </div>
        </div>
      </el-dialog> -->

      
    </div>
  </div>
</template>
<script>
import { getBriefStoreList } from '@/api/store';
import { getStorageInfo } from '@/api/event';
import { getUserInfo, getDepartAll, getAllUserInfoNoAuth, getDepart} from '@/api/login';
import {
  sendImmediateBroadcast,
  sendImmediateTask, 
  sendImmediateEvent,
  broadcastCheck
} from '@/api/advanceSetting';
import { GetInspectTagListAll } from '@/api/inspect';
import filterString from '@/common/filterString.js';
import { mapGetters } from 'vuex';
import util from '@/common/util';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowList',
  components: {
    DateTimeSelector,
    DelayButton,
    DialogPop
  },
  data() {
    return {
      aaa: 0,
      bbb:'',
			calculation: 0,
      extraPoints: true,

      initInspec : [
        {
            "name": "eventUnHandleNotify",
            "category": "generalRule",
            "value": true,
            "extra": 12
        },
        {
            "name": "includedInTotalScoreWithType1",
            "category": "scoreRule",
            "value": false
        },
        {
            "name": "qualifiedForIgnoredWithType1",
            "category": "scoreRule",
            "value": false
        },
        {
            "name": "qualifiedForIgnoredWithType2",
            "category": "scoreRule",
            "value": false
        },
        {
            "name": "hundredMarkType",
            "category": "scoreRule",
            "value": 0
        },
        {
            "name": "minScore",
            "category": "scoreRule",
            "value": 0
        },
        {
            "name": "maxScore",
            "category": "scoreRule",
            "value": 100
        },
        {
            "name": "baseScore",
            "category": "scoreRule",
            "value": 100
        },
        {
            "name": "standardScore",
            "category": "scoreRule",
            "value": null
        },
        {
            "name": "dangerousOnFailedItem",
            "category": "generalRule",
            "value": true
        },
        {
            "name": "setting_isAutoMappingActivate",
            "category": "generalRule",
            "value": true
        },
        {
            "name": "setting_autoMappingByTotalScore",
            "category": "generalRule",
            "value": false,
            "extra": [
                {
                    "key": "mappingScore_bottom",
                    "value": 50.5
                },
                {
                    "key": "mappingScore_top",
                    "value": 80.7
                }
            ]
        },
        {
            "name": "setting_isShowDistrictSum",
            "category": "generalRule",
            "value": false
        },
        {
            "name": "setting_isShowGroupSum",
            "category": "generalRule",
            "value": false
        },
        {
            "name": "onSitePhotoOnly",
            "category": "generalRule",
            "value": true
        },
        {
            "name": "onSiteSignature",
            "category": "generalRule",
            "value": true,
            "extra": [
                {
                    "header": "",
                    "optional": true
                },
                {
                    "header": "",
                    "optional": true
                }
            ]
        },
        {
            "name": "checkin",
            "category": "generalRule",
            "value": false
        },
        {
            "name": "itemOptionsForType1",
            "category": "generalRule",
            "value": "passFail",
            "extra": [
                {
                  "key": "passFail",
                  "items": [
                    {
                        "code": "pass",
                        "name": "合格"
                    },
                    {
                        "code": "fail",
                        "name": "不合格"
                    }
                  ]
                },
                {
                    "key": "yesNo",
                    "items": [
                        {
                            "code": "pass",
                            "name": "是"
                        },
                        {
                            "code": "fail",
                            "name": "否"
                        }
                    ]
                },
                {
                    "key": "userDefined",
                    "items": [
                        {
                            "code": "pass",
                            "name": ""
                        },
                        {
                            "code": "fail",
                            "name": ""
                        }
                    ]
                }
            ]
        },
        {
            "name": "itemOptionsForType3",
            "category": "generalRule",
            "value": "passFail",
            "extra": [
                {
                    "key": "passFail",
                    "items": [
                        {
                            "code": "pass",
                            "name": "合格"
                        },
                        {
                            "code": "fail",
                            "name": "不合格"
                        }
                    ]
                },
                {
                    "key": "yesNo",
                    "items": [
                        {
                            "code": "pass",
                            "name": "是"
                        },
                        {
                            "code": "fail",
                            "name": "否"
                        }
                    ]
                },
                {
                    "key": "userDefined",
                    "items": [
                        {
                            "code": "pass",
                            "name": ""
                        },
                        {
                            "code": "fail",
                            "name": ""
                        }
                    ]
                }
            ]
        },
        {
            "name": "workflow",
            "category": "generalRule",
            "value": {
                "name": "GOGOGO",
                "processDefinitionKey": "process_13dd953d-7311-4acd-80f0-481a05290fc2"
            },
            "extra": null
        }
    
      ],







      canSendInstantEvent: true,
      isLoadingData: false,
      activeName: "1",

      storeList: [],
      titleList: [],
      userList: [],
      departList: [],

      taskName: '',
      inspectionMode: 1,
      inspectionName:'',
      inspectionStyle: [
        {
          value : 1,
          label: this.$t('scheduleView.onsitePatrol')
        },
        {
          value : 0,
          label: this.$t('scheduleView.remotePatrol')
        },
      ],
      allInspectTypeList: [],
      inspectTypeList: [],
      today: '',
      remindDate:'',
      remindTimePoint:'',
      remindStyle:[],
      pickerOptions: {
        disabledDate(time) {
          var day1 = new Date();
          var yesterday = day1.setTime(day1.getTime()-24*60*60*1000);
            return yesterday > time.getTime()  ;
          }
      },
      
      selectedInstantBroadcastStore: [],
      selectedInstantBroadcastbranch: [],
      selectInstantBroadcastTitle: [],
      selectedInstantBroadcastStaff: [],
      broadcastTitle: '',
      broadcastContent: '',

      selectedInstantTaskStore: [],
      selectedInstantTaskStaff: [],
      selectedInstantEventStore: "",
      selectInstantEventTitle : [],
      eventName:'',
      attFileCount: 0,
      attachFileList:[],
      bucketVideo: '',
      bucketImage: '',
      addAttIcon: require('../../../../static/img/icon_attachment.svg'),
      videoSrc: require('../../../../static/img/monitor.png'),
      inspectSrc: require('../../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../../static/img/onsite_patrol.png'),
      startIcon: require('../../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../../static/img/video_thumbnail.png'),
      uploadProgress: false,
      totalnumOfPic: 0,
      uploadingnumOfPic: 0,
      oss: null,

      showInputLimit_a1: false,
      showInputLimit_a2: false,
      showInputLimit_b1: false,
      showInputLimit_c1: false,

      dialogAttachVideo: false,
      totalSendingArray: [
        {
          tag: "dep",
          content: []
        },
        {
          tag: "title",
          content: []
        },
        {
          tag: "staff",
          content: []
        },
      ],
      totalSendingNum: 0,
      
      handleSelectedArray: [],
    }
  },
  mounted() {
    
  },
  created() {
    // this.remindDate = new Date()
    this.init()
    this.getUpLoadBucketInfo();

    var date = new Date();
    var month = this.pad2(date.getMonth()+1);
    var day = this.pad2(date.getDate());
    var year= date.getFullYear();
    this.remindDate = year + "-"+ month +"-"+ day
    this.today = year + "-"+ month +"-"+ day

  },
  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })

    showHandleSelectedArray(){
      // var tempAry = []
      // this.totalSendingArray.forEach(i => {
      //   tempAry = [...tempAry, ...i.content]
      // })
      // var resultAry = [...new Set(tempAry)]
      // console.log('this.userList :>> ', this.userList);
      var showNameAry = []
      this.handleSelectedArray.forEach(i => {
        this.userList.forEach( u => {
          if(i == u.userId) showNameAry.push(u.userName)
        })
      })
      return showNameAry
    }
  },
  watch:{
    // accountChanged(val) {
    //   val !== 0 && this.init();
    // },
    inspectionMode(val){
      console.log('inspectionMode val', val)
      this.inspectTypeList = [...this.allInspectTypeList]
      this.inspectTypeList = this.inspectTypeList.filter( i => i.mode === val)
      this.inspectionName = this.inspectTypeList[0].id
    },


    async selectedInstantBroadcastStore(val){
      if(val.length > 0 ) {
        let res  = await this.broadcastStaffCheck();
        console.log('res a>> ', res);
        this.handleSelectedArray = [...res.data]
      }
    },

    async selectedInstantBroadcastbranch(val){
      if( this.selectedInstantBroadcastStore.length > 0) {
        let res  = await this.broadcastStaffCheck();
        console.log('res b>> ', res);
        this.handleSelectedArray = [...res.data]
      }
    },
    
    async selectInstantBroadcastTitle(val){
      if( this.selectedInstantBroadcastStore.length > 0) {
        let res  = await this.broadcastStaffCheck();
        console.log('res c>> ', res);
        this.handleSelectedArray = [...res.data]
      }
    },
    async selectedInstantBroadcastStaff(val){
      if(this.selectedInstantBroadcastStore.length > 0) {
        let res  = await this.broadcastStaffCheck();
        console.log('res d>> ', res);
        this.handleSelectedArray = [...res.data]
      }
    }





    // selectedInstantBroadcastbranch(val){
    //   console.log('val :>> ', val);
    //   console.log('this.departList :>> ', this.departList);
    //   var selectedBranch =[]
    //   val.forEach(i => {
    //     var tempBranch = this.departList.filter( d => d.defineId == i)
    //     selectedBranch = [...selectedBranch, ...tempBranch[0].contents]
    //   })
    //   this.totalSendingArray[0].content = [...selectedBranch]
    // },
    // selectInstantBroadcastTitle(val){
    //   console.log('val :>> ', val);
    //   var selectedTitles = []
    //   val.forEach(i => {
    //     var tempTitles = this.titleList.filter( d => d.defineId == i)
    //     selectedTitles = [...selectedTitles, ...tempTitles[0].contents]
    //   })
    //   this.totalSendingArray[1].content = [...selectedTitles]
    // },
    // selectedInstantBroadcastStaff(val){
    //   console.log('val :>> ', val);
    //   this.totalSendingArray[2].content = [...val]
    // },
    


  },
  methods: {
    async init(){
      await this.getStore()
      await this.getTitle()
      await this.getTagAll()
      await this.getUserInfo()
      await this.getDepartAll()
    },

    submit(){
      console.log('submit :>> ');
    },





    broadcastStaffCheck(){
      var params = {
          titleIds: [...this.selectInstantBroadcastTitle],
          storeIds: [...this.selectedInstantBroadcastStore],
          depIds: [...this.selectedInstantBroadcastbranch],
          userIds: [...this.selectedInstantBroadcastStaff]
      }
      return new Promise((resolve, reject) => {
        broadcastCheck(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },


    onTabClick(){
      this.attachFileList = []
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },
    async getStore(){
      let res  = await this.getBriefStoreData();
      if(res.errCode ==0){
        this.storeList = res.data;
      }
    },

    getDepart(){
      return new Promise((resolve, reject) => {
        getDepart({ type: 1 }).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });

    },

    async getTitle(){
      let res  = await this.getDepart();
      if(res.errCode ==0){
        this.titleList = res.data;
      }
      // console.log('this.titleList :>> ',this.titleList);
    },

    async submitInstantEvent(){
      const statusNameRes = await this.sendInstantEvent();
      if (statusNameRes.errCode == 0) {
        this.selectedInstantEventStore = '' 
        this.selectInstantEventTitle =[]
        this.eventName= ''
        this.attachFileList = []
        this.isLoadingData = false
        this.uploadProgress = false
        util.notify('發送成功', 'success', 3000);
        return false;
      } else {
        this.isLoadingData = false
        util.notify('發送失敗，目前無門店權限！', 'warning', 3000);
        return false;
      }
    },
    async sendInstantEvent(){
      this.isLoadingData = true
      const self = this;
      const attachment_des = [];
      //上傳附件
      self.uploadingnumOfPic = 0;
      self.totalnumOfPic = self.attachFileList.length;
      self.totalnumOfPic > 0 ? self.uploadProgress = true : self.uploadProgress = false;
      const storageParams = {};
      storageParams.storeId = this.selectedInstantEventStore;
      await getStorageInfo(storageParams).then(res => {
        if (res.errCode === 0) {
          self.oss = res.data;
        }
      });
      for(let idx=0; idx<self.attachFileList.length;idx++){
        await self.upLoadFile(self.attachFileList[idx]).then((url) => {
          self.uploadingnumOfPic++;
          const auditImgObj = {
            fileName: self.attachFileList[idx].fileName,
            fileSize: self.attachFileList[idx].size,
            mediaType: self.attachFileList[idx].type,
            url: url,
            ts: Date.now(),
          };
          attachment_des.push(auditImgObj);
        }).catch((err) => {
          console.log("uploade file error:",err)
          upload++;
        });
      }
      console.log('attachment_des ----->> ', attachment_des)

      var param = {
        requestContent: {
          titleIds: [...this.selectInstantEventTitle],
          storeIds: [this.selectedInstantEventStore]
        },
        msgContent: {
            eventTitle: this.eventName,
            attachments: [...attachment_des]
        }
      }
      console.log('param :>> ', param);
      return new Promise((resolve, reject) => {
        sendImmediateEvent(param).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },


    async submitInstantTask(){
      const statusNameRes = await this.sendInstantTask();
      if (statusNameRes.errCode == 0) {
        this.selectedInstantTaskStore = [];
        this.selectedInstantTaskStaff = [];
        this.taskName = '';
        this.remindDate = this.today;
        this.remindTimePoint = '';
        this.inspectionName = this.inspectTypeList[0].id

        this.isLoadingData = false
        util.notify('發送成功', 'success', 3000);
        return ;
      } else {
        this.isLoadingData = false
        util.notify('發送失敗！', 'warning', 3000);
        return false;
      }
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },

    async sendInstantTask(){
      var t = new Date()
      var date = new Date(t);
      var hour = this.pad2(date.getHours())
      var min = ":00"
      var sec = ":00"

      this.remindTimePoint = hour + min +sec

      var t = this.remindDate + " " + this.remindTimePoint + " " + "GMT+00:00"
      var gmt = new Date(t).getTime()
      var param = {
        requestContent: {
          storeIds: [...this.selectedInstantTaskStore],
          userIds: [...this.selectedInstantTaskStaff]
      },
      msgContent: {
          taskName: this.taskName,
          remindTime: gmt,
          inspectTagId: this.inspectionName,
      }
    }
    console.log('param ~~~~~~~~>>>>>>', param)
    return new Promise((resolve, reject) => {
      sendImmediateTask(param).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });

    },


    async submitInstantBroadcast(){
      const statusNameRes = await this.sendInstantBroadcast();
      if (statusNameRes.errCode == 0) {
        this.selectedInstantBroadcastStore= []
        this.selectedInstantBroadcastbranch= []
        this.selectInstantBroadcastTitle= []
        this.selectedInstantBroadcastStaff= []
        this.broadcastTitle= ''
        this.broadcastContent= ''
        this.attachFileList = []
        this.uploadProgress = false
        this.isLoadingData = false
        util.notify('發送成功', 'success', 3000);
        return ;
      } else {
        this.isLoadingData = false
        util.notify('發送失敗！', 'warning', 3000);
        return false;
      }

    },

    async sendInstantBroadcast(){
      this.isLoadingData = true
      const self = this;
      const attachment_des = [];
      //上傳附件
      self.uploadingnumOfPic = 0;
      self.totalnumOfPic = self.attachFileList.length;
      self.totalnumOfPic > 0 ? self.uploadProgress = true : self.uploadProgress = false;
      const storageParams = {};
      storageParams.storeId = this.selectedInstantEventStore;
      await getStorageInfo(storageParams).then(res => {
        if (res.errCode === 0) {
          self.oss = res.data;
        }
      });
      for(let idx=0; idx<self.attachFileList.length;idx++){
        await self.upLoadFile(self.attachFileList[idx]).then((url) => {
          self.uploadingnumOfPic++;
          const auditImgObj = {
            fileName: self.attachFileList[idx].fileName,
            fileSize: self.attachFileList[idx].size,
            mediaType: self.attachFileList[idx].type,
            url: url,
            ts: Date.now(),
          };
          attachment_des.push(auditImgObj);
        }).catch((err) => {
          console.log("uploade file error:",err)
          upload++;
        });
      }
      console.log('attachment_des ----->> ', attachment_des)

      var param = {
        requestContent: {
          titleIds: [...this.selectInstantBroadcastTitle],
          storeIds: [...this.selectedInstantBroadcastStore],
          depIds: [...this.selectedInstantBroadcastbranch],
          userIds: [...this.selectedInstantBroadcastStaff]
        },
        msgContent: {
          broadcastTitle: this.broadcastTitle,
          broadcastContent: this.broadcastContent,
          attachments: [...attachment_des]
        }
    }
    console.log('param ~~~~~~~~>>>>>>', param)
    return new Promise((resolve, reject) => {
      sendImmediateBroadcast(param).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    

    doAddAttachment(e){
      const self = this;
      const maxSize = 4*1024*1024; //不能超過4MB
      const maxVideoSize = 10*1024*1024; 
      var files = e.target.files || e.dataTransfer.files;
      console.log("choose file::::::::",files);
      var fileName = files[0].name;
      if (!files.length)
        return;
      /*
      if(self.attFileCount==10){
        util.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
        return;
      }
      */
      if(files[0].type.includes("video") && self.videoAttFileCount==2){
        util.notify(self.$t('eventView.maximumAttVedio'), 'warning', 3000);
        return;
      }
      if(files[0].type.includes("image")){
        var objImg={
          fileName: files[0].name.replace("#", "_").replace("?", "-"),
          src:'',
          url:'',
          file:'',
          type: 2,
          size: files[0].size,
        };
        self.createFile(files[0],objImg);
        self.attachFileList.push(objImg);
      }
      else if(files[0].type.includes("video")){
        console.log("choose file:",fileName);
        var objvideo={
          fileName: files[0].name.replace("#", "_").replace("?", "-"),
          src:'',
          url: URL.createObjectURL(files[0]),
          type: 1,
          size:files[0].size,
          oriName: files[0].name.replace("#", "_").replace("?", "-")
        }
        if(files[0].size > maxVideoSize){
          util.notify('檔案大於 10MB，請重新上傳', 'warning', 3000);
          return
        }
        self.createFile(files[0],objvideo);
        self.attachFileList.push(objvideo);
      }
      else if(files[0].type.includes("pdf")){
      
        var objpdf= {
          fileName: files[0].name.replace("#", "_").replace("?", "-"),
          url: URL.createObjectURL(files[0]),
          type: 4,
          size:files[0].size,
          oriName: files[0].name.replace("#", "_").replace("?", "-"),
        }
        if(files[0].size > maxSize){
          util.notify('檔案大於 4MB，請重新上傳', 'warning', 3000);
          return
        }
        self.createFile(files[0],objpdf);
        self.attachFileList.push(objpdf);
      }
      else if(files[0].type.includes("sheet")){
        var objxlsx= {
          fileName: files[0].name.replace("#", "_").replace("?", "-"),
          url: URL.createObjectURL(files[0]),
          type: 5,
          size: files[0].size,
          oriName:  files[0].name.replace("#", "_").replace("?", "-")
        }
        if(files[0].size > maxSize){
          util.notify('檔案大於 4MB，請重新上傳', 'warning', 3000);
          return
        }
        self.createFile(files[0],objxlsx);
        self.attachFileList.push(objxlsx);
      }
      else if(files[0].type.includes("document")){
        var objdocument= {
          // fileName:`${self.bucketDocx}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          fileName: files[0].name.replace("#", "_").replace("?", "-"),
          url: URL.createObjectURL(files[0]),
          type: 6,
          size: files[0].size,
          oriName:  files[0].name.replace("#", "_").replace("?", "-")
        }
        if(files[0].size > maxSize){
          util.notify('檔案大於 4MB，請重新上傳', 'warning', 3000);
          return
        }
        self.createFile(files[0],objdocument);
        self.attachFileList.push(objdocument);
      }

      console.log('self.attachFileList :>> ', self.attachFileList);
      self.$refs.auditfile.value = '';
    },
    createFile(file, objFile) {
      //var image = new Image();
      console.log(objFile);
      var reader = new FileReader();
      reader.onload = (e) => {
        console.log("e:",e);
        objFile.src = e.target.result;
        objFile.file = util.base64ToBlob(e.target.result);
        console.log(objFile.file);
      };
      reader.readAsDataURL(file);
    },
    getAuditImgList(index) {
      const arr = [];
      let i = 0;
      for (i; i < this.attachFileList.length; i++) {
        arr.push(this.attachFileList[i + index]);
        if (i + index >= this.attachFileList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.map(source => source.src);
    },
    deleteImg({item, index}) {
      const self = this;
      self.attachFileList.splice(index, 1);
    },

    playAttachVideo(item, index) {
      console.log('play :>> ');
      console.log('item :>> ', item);
      const self = this;
      self.dialogAttachVideo = true;
      self.$nextTick(function() {
        var video = document.getElementById('previewAttVideo');
        video.setAttribute("src",item.url);
      });
    },
    getFileUrl(fileName) {
      const self = this;
      const bucketName = self.oss.ossBucketName;
      const endpoint = self.oss.ossEndPoint;
      const key = fileName;
      if (self.oss.ossVendor === 2) {
        return `https://${endpoint}/${bucketName}/${fileName}`;
      } else {
        return `http://${bucketName}.${endpoint}/${fileName}`;
      }
    },
    upLoadFile(fileItem) {
      const self = this;
      self.percentage = 0;
      if (self.oss.ossVendor === null) {
        self.oss.ossVendor = 1; // 1 -aliyun  2-azure
      }
      if (self.oss.ossVendor === 1) {
        const OSS = require('ali-oss');
        const client = new OSS({
          region: self.oss.ossEndPoint.slice(0, self.oss.ossEndPoint.indexOf('.')),
          accessKeyId: self.oss.ossAccessKeyId,
          accessKeySecret: self.oss.ossAccessKeySecret,
          // bucket: 'viumo-'+self.accountId,
          bucket: self.oss.ossBucketName
        });
        const name = fileItem.fileName;
        return new Promise((resolve, reject) => {
          client.put(name, fileItem.file, {
            progress: function * (percentage, cpt) {
              self.percentage = percentage;
            }
          })
            .then((results) => {
              const url = self.getFileUrl(results.name);
              resolve(url);
            })
            .catch((err) => {
              reject(err);
            });
        });
      } else {
        const url = `https://${self.oss.ossEndPoint}/${self.oss.ossBucketName}${self.oss.ossAccessKeySecret}`;
        const containerURL = new azblob.ContainerURL(url, azblob.StorageURL.newPipeline(new azblob.AnonymousCredential()));
        const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, fileItem.fileName);
        return new Promise((resolve, reject) => {
          azblob.uploadBrowserDataToBlockBlob(azblob.Aborter.none, fileItem.file, blockBlobURL)
            .then((results) => {
              const url = self.getFileUrl(fileItem.fileName);
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    },
    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
      self.bucketPdf = 'pdf' + '/' + util.getCurDate2Str();
      self.bucketXslx = 'xslx' + '/' + util.getCurDate2Str();
      self.bucketDocx = 'docx' + '/' + util.getCurDate2Str();
    },

    // 取得巡檢表
    getTagAll() {
      return new Promise((resolve, reject) => {
        GetInspectTagListAll().then(res => {
          const data = res.data;
          resolve(data);

          this.allInspectTypeList = data.map(i => ({
            id: i.id,
            name: i.name,
            mode: i.mode
          }))
          console.log(' this.allInspectTypeList =========>>>> ',  this.allInspectTypeList)
          
          this.inspectTypeList = this.allInspectTypeList.filter(i => i.mode == 1)
          this.inspectionName = this.inspectTypeList[0].id
          
        }).catch(err => {
          reject(err);
        });
      });
    },

    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
          this.userList= res.data
        }).catch(err => {
          console.log('error' + err);
        });
    },
    async getDepartAll(){
      await getDepartAll({ type: 0 }).then(res=>{
          this.departList= res.data
        }).catch(err => {
          console.log('error' + err);
        });
    },

    itemInputChanged_a1(val, n){
      const content = filterString.all(val, n);
      this.broadcastTitle = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit_a1 = true
      } else {
        this.showInputLimit_a1 = false
      }
    },
    
    itemInputChanged_a2(val, n){
      const content = filterString.all(val, n);
      this.broadcastContent = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit_a2 = true
      } else {
        this.showInputLimit_a2 = false
      }
    },
    itemInputChanged_b1(val, n){
      const content = filterString.all(val, n);
      this.taskName = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit_b1 = true
      } else {
        this.showInputLimit_b1 = false
      }
    },
    itemInputChanged_c1(val, n){
      const content = filterString.all(val, n);
      this.eventName = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit_a1 = true
      } else {
        this.showInputLimit_a1 = false
      }
    },
  },
};
</script>

<style lang="sass">
  .title-status
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button 
      -webkit-appearance: none
      margin: 0
</style>

<style lang="sass" scoped>
  .input-name_short
    width: 60px
    // height: 30px
    // margin: 0 8px
  
  .input-name_short.el-input--medium >>> .el-input__inner
    height: 30px
    line-height: 30px
    font-size: 12px
    padding: 0 10px !important
    

  .submit_btn
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center

  .send_content
    width: 95%
    margin: 0 auto
    margin-bottom: 60px
    margin-top: 20px
    padding-bottom: 40px
    .title-name
      width: 100%
      font-size: calc(18/1920*100vw)
      text-align: left
      padding: 10px 0
      margin-bottom: 10px
      border-bottom: 1px solid #dedede
      font-weight: bolder
    .subtitle_name
      width: 100px
      color: #006ab7
      font-size: calc(16/1920*100vw)
      text-align: left
      // padding: 10px 0
      margin-left: 30px
      margin-bottom: 10px
      font-weight: bolder
    .send_content_row
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      margin-left: 30px
      font-size: calc(16/1920*100vw)
      padding: 15px 0
      .overall_row
        .title-status
          display: flex
          flex-direction: row
          justify-content: flex-start
          align-items: center
      .row_title
        margin-right: 15px
        width: fit-content
        text-align: left
      .role-all-checkbox
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
        .group-name
          line-height: 1
      .attachments
        width: 100px
        height: 30px
        background: #006ab7
        color: #FFF
        border-radius: 3px
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
        cursor: pointer
      
      .device-group
        width: 100%
        display: flex
        flex-direction: column
        justify-content: flex-start
        align-items: flex-start
        .group-name
          font-weight: bolder
          margin-left: 8px
        .device-all-checkbox
          margin-bottom: 15px
        
        .device-content
          width: calc( 100% - 30px )
          margin-left: 30px
          padding: 0px 20px
          padding-top: 20px
          background: #f7f9fa
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          align-items: center
          .device-detail
            margin-right: 40px
            margin-bottom: 20px
            .device-name
              margin-left: 8px
          

  














  .attach-area
    display: flex
    flex-wrap: wrap
    align-content: flex-start
    align-self: flex-start
    width: calc(478/1440*100vw)
    margin-top: 15px
    margin-left: 16px
    margin-right: 19px
    margin-bottom: 10px
    .attach-add
      height: 120px
      width: 120px
      border-radius: 5px
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1)
      display: flex
      flex-direction: row
      justify-content: center
      align-items: center
      cursor: pointer
      .att-txt
        font-size: 12px
        color: #006ab7
        margin-left: 3px
    .source-details
      margin-right: 12px
      margin-bottom: 12px
      .img-content
        position: relative
        transition: all .3s
        &:hover
          transform: scale(1.1)
        .el-icon-close
          width: 21px
          height: 21px
          border-radius: 50%
          background: rgba(0,0,0,.5)
          color: #FFF
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          transition: all .3s
          position: absolute
          z-index: 100
          right: 2px
          top: 2px
          cursor: pointer
            

        .el-image
          width: auto
          height: 120px

        .attach_video
          width: 110px
          height: 120px
          border-radius: 5px
          cursor: pointer
          display: flex
          flex-direction: column
          justify-content: center
          align-items: center
          background: url(('../../../../static/img/video_thumbnail.png'))
          background-position:  center center
          font-size: 12px
          color: #FFF
          span
            word-break: break-all
            line-height: 1.2
          .start-icon
            width: 40px
            margin-bottom: 5px

          .imgLittle
            width: auto
            height: 120px
            border-radius: 5px

  .dialog-title
    text-align: left
    font-size: 20px
    padding-left: 20px
    color: #484848
  


      
  .el-table-content
    width: 100%
    background-color: #fff
    border-radius: 5px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
    position: relative
    // padding-top: calc(30/1920*100vw)
    .list-table
      .table-white 
        /deep/
        .el-table
          box-shadow: none !important
          border: none !important
          background-color: #fff
          padding-left: 12px
          padding-right: 12px



 
  .button-area
    height: 23px
    padding: 0 5px




  .attach_file
    width: 110px
    height: 120px
    background: #f4f4f4
    border-radius: 5px
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    color: #999
    font-size: 11px
    padding: 0 5px
    span
      line-height: 1.2
      word-break: break-all
    
    img
      width: 40%
      margin-bottom: 5px
  .notice
    color: red
    font-size: 12px
    margin: 5px 0 0 5px
    margin-left: 10px
</style>

