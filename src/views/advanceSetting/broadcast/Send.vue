<template>
  <div>
      <div class="el-table-content" >
        <el-tabs  v-model="activeName" @tab-click="onTabClick">
          <!-- 公告訊息 -->
          <el-tab-pane :label="$t('immediatePush.broadcast')" name="0">
            <div class="send_content" v-loading="isLoadingData">

              <div class="submit_btn" >
                <delay-button 
                  @click="submitInstantBroadcast"
                  type="filled" 
                  :disabled="
                    broadcastTitle == '' 
                    || broadcastContent == '' 
                    || selectedInstantBroadcastStaff.length == 0 
                    && (selectedInstantBroadcastStore.length == 0 || selectInstantBroadcastTitle.length == 0 ) " 
                  >
                <div class="button-area" style="width: 80px; height: 20px;">
                    <span>{{$t('immediatePush.sendBroadcast')}} </span>
                  </div>
                </delay-button>
              </div>

              <div class="title-name"> {{$t('immediatePush.sendBTo')}}</div>
              <div class="subtitle_name" style="margin-top: 20px;"> {{$t('immediatePush.groupObject')}}</div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span>{{$t('immediatePush.store')}}</div>
                <el-select
                  v-model="selectedInstantBroadcastStore"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectStore')" 
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
              <!-- 部門 -->
              <div class="send_content_row">
                <div class="row_title">{{$t('immediatePush.department')}}</div>
                <el-select
                  v-model="selectedInstantBroadcastbranch"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectDepartment')" 
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
              <!-- 職務 -->
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span>{{$t('immediatePush.position')}}</div>
                <el-select 
                  v-model="selectInstantBroadcastTitle"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectPosition')" 
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

              <div class="subtitle_name" style="margin-top: 10px;">{{$t('immediatePush.specificObject')}}</div>
              <div class="send_content_row">
                <div class="row_title">{{$t('immediatePush.staff')}}</div>
                <el-select
                  v-model="selectedInstantBroadcastStaff"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectStaff')" 
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

              <div class="send_content_row">
                <div class="row_title" style="width: 6%;"></div>
                <div style="
                    width: 50%; color: #999; 
                    font-size: 12px; 
                    text-align: right;
                    font-weight: bold;
                    "> {{$t('immediatePush.numberOfSenders')}} <b> {{ showHandleSelectedArray.length }}</b></div>
                    <el-tooltip
                      v-if="showHandleSelectedArray.length > 0"
                      class="date-time-tooltip"
                      effect="light"
                      placement="bottom-end">
                      <div slot="content">
                        <div class="staffName" v-for="n in showHandleSelectedArray">
                          <p style="line-height: 1.05; color: #555;">{{ n }}</p>
                        </div>
                      </div>
                      <i class="iconfont icon-bangzhu iconbangzhu"/>
                    </el-tooltip>
              </div>


              <div class="title-name" style="margin-top: 30px;"> {{$t('immediatePush.message')}} </div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> {{$t('immediatePush.messageTitle')}}</div>
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
                <div class="row_title"><span style="color: #c60957">* </span>  {{$t('immediatePush.messageContent')}} </div>
                <el-input
                  v-model="broadcastContent"
                  style="width: 50%; "
                  ref="nodeName"
                  placeholder="請輸入內容"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  @input="(val) => itemInputChanged_a2(val, 500)"
                />
                <span class="notice" v-if="showInputLimit_a2"> {{$t('immediatePush.maxInput')}} 500 {{$t('immediatePush.character')}} </span>
              </div>
              
              <div class="send_content_row" >
                <div class="row_title"> {{$t('immediatePush.attachment')}}</div>
                <!-- <div class="attachments"> 選擇檔案</div> -->
                <div class="attach-area" style="width: 100%;">
                  <div v-for="(imgItem,index) in attachFileList" :key="'img'+index" class="source-details" >
                    <!--video-->
                    <div v-if="imgItem.type===1" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <div class="attach_video">
                        <img :src="startIcon"  class="start-icon" @click="playAttachVideo(imgItem,index)">
                        <!-- <span>{{imgItem.oriName}}</span> -->
                        <!-- <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle"> -->
                      </div>
                    </div>
                    <div v-else-if="imgItem.type===2" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <el-image
                        :src="imgItem.src"
                        class="imgLittle"
                        :preview-src-list="getAuditImgList(index)"/>
                    </div>
                    <!-- .pdf -->
                    <div v-else-if="imgItem.type===4" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <div class="attach_file">
                        <img src="../../../../static/img/MdiFilePdfOutline.svg" alt="">
                        <span 
                          style="
                                margin: 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                              "
                          >
                          {{imgItem.oriName.split(".pdf").shift()}}
                        </span>
                        
                          
                      </div>
                    </div>
                    <!-- .xlsx -->
                    <div v-else-if="imgItem.type===5" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <div class="attach_file">
                        <img src="../../../../static/img/IconParkSolidExcel.svg" alt="">
                        <span 
                          style="
                                margin: 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                              "
                          >
                          {{imgItem.oriName.split(".xlsx").shift()}}
                        </span>
                      </div>
                    </div>
                    <!-- .docx -->
                    <div v-else-if="imgItem.type===6" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <div class="attach_file">
                        <img src="../../../../static/img/MaterialSymbolsDocsOutline.svg" alt="">
                        <span 
                          style="
                                margin: 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                              "
                          >
                          {{imgItem.oriName.split(".docx").shift()}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-if="attachFileList.length < 3" class="attach-add" @click="$refs.attachFiles.click()">
                    <input 
                      type="file" 
                      style="display: none" 
                      accept="image/png,image/jpeg,video/mp4, .pdf, .xlsx, .docx" 
                      max-size="2" 
                      @change="doAddAttachment" 
                      ref="attachFiles" />
                    <div style="height:16px; display: flex; flex-direction: row; align-items: center;">
                      <img :src="addAttIcon" widht="16px" height="16px" style="border-radius:10px;"/>
                      <div class="att-txt">{{$t('immediatePush.selectFile')}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 即時排程 -->
          <el-tab-pane :label="$t('immediatePush.immediateTask')" name="1">
            <div class="send_content" v-loading="isLoadingData"  style="padding-bottom: 40px;">
              <div class="submit_btn" >
                <delay-button 
                  @click="submitInstantTask"
                  type="filled" 
                  :disabled="
                    taskName == '' 
                    || inspectionName == ''
                    || remindDate == ''
                    || selectedInstantTaskStore.length == 0 
                    || selectedInstantTaskStaff.length == 0 " 
                  >
                <div class="button-area" style="width: 80px; height: 20px;">
                    <span>{{$t('immediatePush.sendTask')}}</span>
                  </div>
                </delay-button>
              </div>

              <div class="title-name">{{$t('immediatePush.sendTask')}}</div>
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> {{$t('immediatePush.taskName')}}</div>
                <el-input
                  v-model="taskName"
                  :placeholder="$t('immediatePush.inputTaskName')"
                  style="width: 50%;"
                  @input="(val) => itemInputChanged_b1(val, 20)"
                  />
                  <span class="notice" v-if="showInputLimit_b1"> {{$t('immediatePush.maxInput')}} 20 {{$t('immediatePush.character')}} </span>
              </div>

              <!-- 巡檢表 -->
              <div class="send_content_row">
                <div class="row_title"><span style="color: #c60957">* </span> {{$t('immediatePush.inspectionName')}} </div>
                <el-select
                  v-model="inspectionMode"
                  style="width: 25%;"
                  :placeholder="$t('immediatePush.inspectionName')"
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
                  :placeholder="$t('immediatePush.inspectionName')"
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
                <div class="row_title"> <span style="color: #c60957">* </span> {{$t('immediatePush.excetionDate')}}</div>
                <el-date-picker
                  v-model="remindDate"
                  style="width: 50%;"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  :placeholder="$t('schedule.schExeDate') ">
                </el-date-picker>
              </div>

              <!-- <div class="send_content_row">
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
              </div> -->

              <div class="title-name" style="margin-top: 30px;"><span style="color: #c60957">*</span>  {{$t('immediatePush.sendBTo')}}</div>
              <div class="send_content_row">
                <!-- 門店 -->
                <div class="row_title"> {{$t('immediatePush.store')}}</div>
                <el-select
                  v-model="selectedInstantTaskStore"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectStore')" 
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
                <div class="row_title">{{$t('immediatePush.staff')}}</div>
                <el-select
                  v-model="selectedInstantTaskStaff"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectStaff')" 
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
          <el-tab-pane :label="$t('immediatePush.immediateEvent')" name="2">
            <div class="send_content" v-loading="isLoadingData">
              <!-- 發送事件 -->
              <div class="submit_btn" >
                <delay-button 
                  @click="submitInstantEvent"
                  type="filled" 
                  :disabled="
                    selectedInstantEventStore == '' 
                    || selectInstantEventTitle.length == 0 
                    || eventName == '' " 
                >
                <div class="button-area" style="width: 80px; height: 20px;">
                    <span>{{$t('immediatePush.sendEvent')}}</span>
                  </div>
                </delay-button>
              </div>

              <div class="title-name"><span style="color: #c60957">* </span> {{$t('immediatePush.sendObject')}}</div>
              <div class="send_content_row">
                <div class="row_title">{{$t('immediatePush.store')}}</div> 
                <el-select
                  v-model="selectedInstantEventStore"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectStore')" 
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
                <div class="row_title">{{$t('immediatePush.position')}}</div>
                <el-select 
                  v-model="selectInstantEventTitle"
                  style="width: 50%;"
                  :placeholder="$t('immediatePush.selectPosition')" 
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


              <div class="title-name" style="margin-top: 30px;"> {{$t('immediatePush.sendEvent')}}</div>
              <div class="send_content_row">
                <div class="row_title"> <span style="color: #c60957">* </span>{{$t('immediatePush.eventName')}}</div>
                <el-input
                  v-model="eventName"
                  style="width: 50%;"
                  @input="(val) => itemInputChanged_c1(val, 50)"
                  />
                  <span class="notice" v-if="showInputLimit_a1">  {{$t('immediatePush.maxInput')}} 50 {{$t('immediatePush.character')}} </span>

              </div>
              <div class="send_content_row" >
                <div class="row_title"> {{$t('immediatePush.attachment')}}</div>
                <!-- <div class="attachments"> 選擇檔案</div> -->
                <div class="attach-area" style="width: 100%;">
                  <div v-for="(imgItem,index) in attachFileList" :key="'img'+index" class="source-details" >
                    <!--video-->
                    <div v-if="imgItem.type===1" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <div class="attach_video">
                        <img :src="startIcon"  class="start-icon" @click="playAttachVideo(imgItem,index)">
                        <!-- <span>{{imgItem.oriName}}</span> -->
                        <!-- <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle"> -->
                      </div>
                    </div>
                    <div v-else-if="imgItem.type===2" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <el-image
                        :src="imgItem.src"
                        class="imgLittle"
                        :preview-src-list="getAuditImgList(index)"/>
                    </div>
                    
                    <div v-else-if="imgItem.type===2" class="img-content">
                      <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
                      <el-image
                        :src="imgItem.src"
                        class="imgLittle"
                        :preview-src-list="getAuditImgList(index)"/>
                    </div>
                  </div>
                  <div v-if="attachFileList.length < 10" class="attach-add" @click="$refs.auditfile.click()">
                    <input 
                      type="file" 
                      style="display: none" 
                      accept="image/png,image/jpeg,video/mp4" 
                      max-size="2" 
                      @change="doAddAttachment" 
                      ref="auditfile" />
                    <div style="height:16px; display: flex; flex-direction: row; align-items: center;">
                      <img :src="addAttIcon" widht="16px" height="16px" style="border-radius:10px;"/>
                      <div class="att-txt"> {{$t('immediatePush.selectFile')}}</div>
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

      <!-- video dialog -->
      <el-dialog
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
      canSendInstantEvent: true,
      isLoadingData: false,
      activeName: "0",

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
          fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
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
          fileName:`${self.bucketVideo}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          src:'',
          url: URL.createObjectURL(files[0]),
          type: 1,
          size:files[0].size,
          oriName: `${files[0].name}`
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
          fileName:`${self.bucketPdf}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          url: URL.createObjectURL(files[0]),
          type: 4,
          size:files[0].size,
          oriName: `${files[0].name}`
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
          fileName:`${self.bucketXslx}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          url: URL.createObjectURL(files[0]),
          type: 5,
          size: files[0].size,
          oriName: `${files[0].name}`
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
          fileName:`${self.bucketDocx}/inspect_${util.getCurTimeStr()}_${files[0].name}`,
          url: URL.createObjectURL(files[0]),
          type: 6,
          size: files[0].size,
          oriName: `${files[0].name}`
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
          // console.log(' this.allInspectTypeList =========>>>> ',  this.allInspectTypeList)
          
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

<style lang="sass" scoped>

  .submit_btn
    margin-bottom: 0px
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
