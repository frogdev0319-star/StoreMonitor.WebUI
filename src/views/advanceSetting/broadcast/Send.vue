<template>
  <div>
      <div class="el-table-content" @tab-click="onTabClick">
        <el-tabs  v-model="activeName" >
          <!-- 公告訊息 -->
          <el-tab-pane
            label="公告訊息"
            name="0">
            <div class="send_content" v-loading="isLoadingData">

              <div class="submit_btn" >
                <delay-button 
                  @click="submitInstantBroadcast"
                  type="filled" 
                  >
                <div class="button-area" style="width: 80px; height: 20px;">
                    <span>發送事件</span>
                  </div>
                </delay-button>
              </div>


              <div class="title-name"> 發送至</div>
              <div class="subtitle_name" style="margin-top: 20px;">群組對象</div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span>門店</div>
                <el-select
                  v-model="selectedInstantBroadcastStore"
                  style="width: 50%;"
                  placeholder="請選擇門店" 
                  filterable
                  multiple
                  >
                  <el-option
                    v-for="item in storeList"
                    :key="item.storeId"
                    :label="item.name"
                    :value="item.storeId" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">部門</div>
                <el-select
                  v-model="selectedInstantBroadcastbranch"
                  style="width: 50%;"
                  placeholder="請選擇部門" 
                  filterable
                  multiple
                  >
                  <el-option
                    v-for="item in departList"
                    :key="item.defineId"
                    :label="item.defineName"
                    :value="item.defineId" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span>職務</div>
                <el-select 
                  v-model="selectInstantBroadcastTitle"
                  style="width: 50%;"
                  placeholder="請選擇職務" 
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

              
              <div class="subtitle_name" style="margin-top: 10px;">特定對象</div>
              <div class="send_content_row">
                <div class="row_title">人員</div>
                <el-select
                  v-model="selectedInstantBroadcastStaff"
                  style="width: 50%;"
                  placeholder="請選擇人員" 
                  filterable
                  multiple
                  >
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId" 
                    />
                </el-select>
              </div>


              <div class="title-name" style="margin-top: 30px;"> 發送訊息</div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 標題</div>
                <el-input
                  v-model="broadcastTitle"
                  style="width: 50%;"
                  ref="nodeName"
                  placeholder="請輸入標題"
                  
                />
              </div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 內容</div>
                <el-input
                  v-model="broadcastContent"
                  style="width: 50%;"
                  ref="nodeName"
                  placeholder="請輸入內容"
                  type="textarea"
                  resize="none"
                  
                />
              </div>
              <div class="send_content_row">
                <div class="row_title"> 附件</div>
                <div class="attachments"> 選擇檔案</div>
              </div>


            </div>
          </el-tab-pane>


          <!-- 即時排程 -->
          <el-tab-pane
            label="即時排程"
            name="1">
              
            <div class="send_content" v-loading="isLoadingData"  style="padding-bottom: 40px;">
              <div class="submit_btn" >
                <delay-button 
                  @click="submitInstantTask"
                  type="filled" 
                  >
                <div class="button-area" style="width: 80px; height: 20px;">
                    <span>發送事件</span>
                  </div>
                </delay-button>
              </div>

              <div class="title-name"> 發送排程</div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 排程名稱</div>
                <el-input
                  v-model="taskName"
                  placeholder="請輸入排程名稱"
                  style="width: 50%;"
                  />
              </div>

              <!-- 巡檢表 -->
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 巡檢表</div>
                <el-select
                  v-model="inspectionMode"
                  style="width: 25%;"
                  placeholder="巡檢表"
                  filterable
                  >
                  <el-option
                    v-for="(_item, index) in inspectionStyle"
                    :key="index"
                    :label="_item.label"
                    :value="_item.value"
                  />
                </el-select>

                <el-select 
                  v-model="inspectionName"
                  style="width: 25%;"
                  placeholder="巡檢表名稱"
                  filterable
                  >
                  <el-option
                    v-for="(_item, index) in inspectTypeList"
                    :key="index"
                    :label="_item.name"
                    :value="_item.id"
                  />
                </el-select>
              </div>

              <!-- 執行日期 -->
              <div class="send_content_row">
                <div class="row_title"> <span style="color: #c60957">* </span> 執行日期</div>
                <el-date-picker
                  v-model="remindDate"
                  style="width: 50%;"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  :placeholder="$t('schedule.schExeDate') ">
                </el-date-picker>
              </div>


              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> 提醒時間</div>
                <el-time-select
                  v-model="remindTimePoint"
                  style="width: 50%;"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '23:00'
                  }"
                  :placeholder="$t('schedule.remiderTime')">
                </el-time-select>
              </div>


              <div class="title-name" style="margin-top: 30px;"><span style="color: #c60957">*</span> 發送至</div>
              <div class="send_content_row">
                <!-- 門店 -->
                <div class="row_title">門店</div>
                <el-select
                  v-model="selectedInstantTaskStore"
                  style="width: 50%;"
                  placeholder="請選擇門店" 
                  filterable
                  multiple
                  >
                  <el-option
                    v-for="item in storeList"
                    :key="item.storeId"
                    :label="item.name"
                    :value="item.storeId" 
                    />
                </el-select>
              </div>
              <!-- 人員 -->
              <div class="send_content_row" >
                <div class="row_title">人員</div>
                <el-select
                  v-model="selectedInstantTaskStaff"
                  style="width: 50%;"
                  placeholder="請選擇人員" 
                  filterable
                  multiple
                  >
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId" 
                    />
                </el-select>
              </div>
            </div>
          </el-tab-pane>


          <!-- 即時事件 -->
          <el-tab-pane
            label="即時事件"
            name="2">
            <div class="send_content" v-loading="isLoadingData">
              <!-- 發送事件 -->
              <div class="submit_btn" >
                <delay-button 
                  @click="submitInstantEvent"
                  type="filled" 
                  :disabled="selectedInstantEventStore == '' || selectInstantEventTitle.length == 0 || eventName == '' " >
                <div class="button-area" style="width: 80px; height: 20px;">
                    <span>發送事件</span>
                  </div>
                </delay-button>
              </div>

              <div class="title-name"><span style="color: #c60957">* </span> 發送對象</div>
              <div class="send_content_row">
                <div class="row_title">門店</div> 
                <el-select
                  v-model="selectedInstantEventStore"
                  style="width: 50%;"
                  placeholder="請選擇門店" 
                  filterable
                  >
                  <el-option
                    v-for="item in storeList"
                    :key="item.storeId"
                    :label="item.name"
                    :value="item.storeId" 
                    />
                </el-select>
              </div>
              <div class="send_content_row">
                <div class="row_title">職務</div>
                <el-select 
                  v-model="selectInstantEventTitle"
                  style="width: 50%;"
                  placeholder="請選擇職務" 
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


              <div class="title-name" style="margin-top: 30px;"> 發送事件</div>
              <div class="send_content_row">
                <div class="row_title"> <span style="color: #c60957">* </span>事件名稱</div>
                <el-input
                  v-model="eventName"
                  style="width: 50%;"
                  />
              </div>
              <div class="send_content_row" >
                <div class="row_title"> 附件</div>
                <!-- <div class="attachments"> 選擇檔案</div> -->
                <div class="attach-area" style="width: 100%;">
                  <div v-for="(imgItem,index) in attachFileList" :key="'img'+index" class="source-details" >
                    <!--video-->
                      <div v-if="imgItem.type===1" class="img-content">
                        <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon" @click="playAttachVideo(imgItem,index)">
                        <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                      </div>
                    <div v-else-if="imgItem.type===2" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <el-image
                        :src="imgItem.src"
                        class="imgLittle"
                        :preview-src-list="getAuditImgList(index)"/>
                    </div>
                  </div>
                  <div v-if="attFileCount<10" class="attach-add" @click="$refs.auditfile.click()">
                    <input 
                      type="file" 
                      style="display: none" 
                      accept="image/png,image/jpeg,video/mp4" 
                      max-size="2" 
                      @change="doAddAttachment" 
                      ref="auditfile" />
                    <div style="height:16px; display: flex; flex-direction: row; align-items: center;">
                      <img :src="addAttIcon" widht="16px" height="16px" style="border-radius:10px;"/>
                      <div class="att-txt">選擇檔案</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- uploadProgress -->
        <el-dialog :visible.sync="uploadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
        <div class="body-content">
          <p>{{ $t('remotePatrol.uploading') }}</p>
          <p style="margin-bottom:15px;">
            {{ $t('remotePatrol.uploadInfo', {totalNum: totalnumOfPic, uploadedNum: uploadingnumOfPic}) }}
          </p>
          <el-progress :percentage="Math.round(uploadingnumOfPic/totalnumOfPic*100)"/>
        </div>
      </el-dialog>
      
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
  sendImmediateEvent
} from '@/api/advanceSetting';
import { GetInspectTagListAll } from '@/api/inspect';

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
      canSendInstantEvent: true,
      isLoadingData: false,
      activeName: "0",
      aaa: '',
      XXXD: [ 
        {
          "storeId": "4C7dPRwgEvAa",
          "name": "Macy",
          "city": "New York",
          "province": "NY 10001",
          "country": "USA",
          "userId": null,
          "tagIds": [],
          "timeZone": "-10",
          "status": 61,
          "typeList": []
        }
      ],

      
      storeList: [],
      titleList: [],
      userList: [],
      departList: [],

      taskName: '',
      inspectionMode: 0,
      inspectionName:'',
      inspectionStyle: [
        {
          value : 1,
          label: '現場巡檢'
        },
        {
          value : 0,
          label: '遠端巡檢'
        },
      ],
      allInspectTypeList: [],
      inspectTypeList: [],
      
      remindDate:'',
      remindTimePoint:'',
      remindStyle:[],
      
      pickerOptions: {
        disabledDate(time) {
            return Date.now() >= time.getTime()  ;
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
      uploadProgress: false,
      totalnumOfPic: 0,
      uploadingnumOfPic: 0,
      oss: null,


    }
  },
  mounted() {
    
  },
  created() {
    this.init()
    this.getUpLoadBucketInfo();
  },
  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })
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
  },
  methods: {
    async init(){
      await this.getStore()
      await this.getTitle()
      await this.getTagAll()
      await this.getUserInfo()
      await this.getDepartAll()
    },

    onTabClick(){
      console.log('tabClick :>> ');
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
      console.log('this.titleList :>> ',this.titleList);
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
          titleIds: [this.selectInstantEventTitle],
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
        this.remindDate = '';
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
    async sendInstantTask(){
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
          attachments: []
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
      var files = e.target.files || e.dataTransfer.files;
      console.log("choose file:",files);
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
          fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          src:'',
          url:'',
          file:'',
          type:2,
          size: files[0].size,
        };
        self.createFile(files[0],objImg);
        self.attachFileList.push(objImg);

      }else if(files[0].type.includes("video")){
        console.log("choose file:",fileName);
        var objvideo={
          fileName:`${self.bucketVideo}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          src:'',
          url:URL.createObjectURL(files[0]),
          type:1,
          size:files[0].size,
          
        }
        self.createFile(files[0],objvideo);
        self.attachFileList.push(objvideo);
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
          
          this.inspectTypeList = this.allInspectTypeList.filter(i => i.mode == 0)
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
    
  },
};
</script>

<style lang="sass" scoped>

  .submit_btn
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center

  .send_content
    width: 95%
    margin: 0 auto
    margin-bottom: 40px
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
      padding: 10px 0
      margin-left: 30px
      font-weight: bolder
    .send_content_row
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      margin-left: 30px
      font-size: calc(16/1920*100vw)
      padding: 10px 0
      .row_title
        margin-right: 10px
        width: 6%
        text-align: left
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

        







  



  .log_table
    .table .el-table
      padding: 10px 0
    .el-table--mini
      background: #FFF !important
      box-shadow: none !important
    td, th
      padding-left: 0 !important
      .cell
        padding-left: 12px !important
      
    td, th
      &:nth-child(1)
        width: 12% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important
      &:nth-child(3)
        width: 15% !important
        padding-left: 12px !important
        .cell
          padding-left: 12px !important

    .el-table .cell
      text-align: left !important
      

  .el-table-content
    width: 100%
    background-color: #fff
    border-radius: 5px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
    position: relative
    padding-top: calc(30/1920*100vw)
    .list-table
      .table-white 
        /deep/
        .el-table
          box-shadow: none !important
          border: none !important
          background-color: #fff
          padding-left: 12px
          padding-right: 12px


  .el-audit-header
    .search-button
      float: right
      color:#FFF
      &:hover
        background-color: #3d4854
        color:#FFF






    
  .alert-popup
    .el-dialog__header
      color: #c60957
  .button-area
    height: 23px
    padding: 0 5px

  .tablelist_workflows
    .el-table__header
      width: auto !important

    .el-table__body
      width: auto !important
    

  .workflow-header
    width: 100%
    // height: 150px
    // background: #dedede
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: flex-start
  .el-table
    border: none !important
    
  // .el-button--primary
  //   color: #fff
  //   background-color: #190
  //   border-color: #190



    .forDescription
      position: relative
      &:hover
        .showDescription
          display: block
      .shortdescription
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        width: 200px
      .showDescription
        position: fixed
        width: 500px
        height: fit-content
        font-size: 13px
        line-height: 1.5
        padding: 10px
        background: rgba(0,0,0,.75)
        color: #fff
        border-radius: 3px
        z-index: 1000
        display: none

  .forWorkflowsSwitch
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    
  .width-fit
    width: max-content !important
  
  .pagination_row
    //position: absolute;
    height: 30px
    margin: 30px 0
    margin-right: calc(20/1920*100vw)
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
    


</style>
