<template>
  <el-row class="sum-content">
    <el-col :span="24" class="sum-submit paper">
      <div class="submit-header flex-center margin-bottom-md">
        <span>{{ $t('remotePatrol.summary') }}</span>
        <div class="spacer"></div>
        <div v-if="isEditReport"><!--isEditReport-->
          <el-button :size="varyWindowWidth > 1680 ? 'small' : 'mini'" class="confirm-btn" type="primary" @click="submit(false)">
            {{ $t('audit.inceptionRpt.saveReport') }}
          </el-button>
          <el-button :size="varyWindowWidth > 1680 ? 'small' : 'mini'" class="storevue-button-filled" type="primary" @click="showConfirmSubmitMsg=true">
            {{ $t('audit.inceptionRpt.submitReport') }}
          </el-button>
        </div>
        <div v-else>
          <el-button :size="varyWindowWidth > 1680 ? 'small' : 'mini'" class="storevue-button-filled" type="primary" @click="submit(true)">
            {{ $t('remotePatrol.submit') }}
          </el-button>
        </div>
      </div>

      <div class="submit-content">
        <div class="submit-radio margin-bottom-md">
          <span v-for="(item,index) in resultList" :key="index">
            <span
              v-if="item.isShow"
              :class="item.isActive?'activeClass':''"
              class="el-radio-details"
              @click="clickSum(item,index)">{{ item.name }}</span>
          </span>
        </div>
        <span class="sug-label">{{ $t('remotePatrol.inspectionAdvice') }}</span>
        <el-input
          :autosize="{ minRows: 2, maxRows: 7}"
          v-model="suggest"
          :placeholder="$t('remotePatrol.adviceInfo')"
          type="textarea"
          resize="none"
          class="sug-input"
          @input="adviceChanged"
          @blur="notShowInputRuleTips"/>
        <span v-if="adviceInfoRuletip" class="rules">{{ $t('remotePatrol.comentRuletip_suggest') }}</span>
      </div>
    </el-col>
    <el-col v-if="isBindWorkflow" :span="24" class="sum-submit paper">
      <div class="submit-header flex-center margin-bottom-md">
        <span>{{ $t('audit.inceptionRpt.sendAudit') }}</span>
      </div>
      <div class="audit-content">
        <span class="sug-label" >{{ $t('audit.inceptionRpt.addAttach') }}</span>
        <div v-if="pdfFileList.length>0" class="attach-area" style="margin-bottom:10px;">
          <div v-for="(pdfItem,index) in pdfFileList" :key="'pdf'+index" class="source-details" >
            <div class="img-content">
              <i class="el-icon-close icondelete" @click="deleteImg({item:pdfItem,index})" />
              <div class="pdf-content">
                <span>{{pdfItem.showName}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="attach-area" >
          <div v-for="(imgItem,index) in imgFileList" :key="'img'+index" class="source-details" >
            <div class="img-content">
              <i class="el-icon-close icondelete" @click="deleteImg({item:imgItem,index})" />
              <el-image
                :src="imgItem.src"
                style="width:140px;height:100px"
                :preview-src-list="getAuditImgList(index)"/>
            </div>
          </div>
          <div v-if="auditFileCount<10" class="attach-add" @click="$refs.auditfile.click()">
            <input type="file" style="display: none" accept="image/png,image/jpeg,application/pdf" max-size="2" @change="doAddAttachment" ref="auditfile" />
            <div style="height:16px;display: flex;flex-direction: row;align-items: center;">
              <img src="../../../static/img/icon_attachment.svg" widht="16px" height="16px" style="border-radius:10px;"/>
              <div class="att-txt">{{ $t('audit.inceptionRpt.attachment') }}</div>
            </div>
          </div>
        </div>
        <div style="margin-top:10px;">
          <span class="sug-label margin-bottom-md" >{{ $t('audit.inceptionRpt.auditNote') }}</span>
          <el-input
            :autosize="{ minRows: 2, maxRows: 7}"
            v-model="auditNote"
            type="textarea"
            resize="none"
            class="sug-input"
            @input="auditNoteChanged"
            @blur="notShowAuditNoteRuleTips"
          />
          <span v-if="auditNoteRuletip" class="rules">{{ $t('remotePatrol.comentRuletip_suggest') }}</span>
        </div>
        <div class="next-audit">
          <div style="width:47%;">
            <span class="sug-label margin-bottom-md">{{ $t('audit.inceptionRpt.nextAuditor') }}</span>
            <el-input
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="workflowInfo.nextAuditUser"
              type="textarea"
              resize="none"
              class="person-audit"
              disabled="true"
            />
          </div>
          <div style="width:47%;">
            <span class="sug-label margin-bottom-md">{{ $t('audit.inceptionRpt.ccPeople') }}</span>
            <el-input
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="workflowInfo.copyToUsers"
              type="textarea"
              resize="none"
              class="person-audit"
              disabled="true"
            />
          </div>
        </div>
      </div>
    </el-col>
    <el-col v-if="!allRemarkItemsFlag" :span="24" class="sum-data">
      <span style="font-size: 18px; font-weight: bold">{{ $t('remotePatrol.preview') }}</span>
      <div class="paper" style="margin-top: 15px; padding: 0 15px">
        <div class="table-content">
          <div class="table-header flex-center">
            <div class="header-store-name">
              <span v-if="lang=='en' " class="en-store-name">{{ $t('remotePatrol.storeName') }}：</span>
              <span v-else class="store-name">{{ $t('remotePatrol.storeName') }}：</span>
              {{ store.storeName }}
            </div>
            <div class="spacer"></div>
            <div class="header-score">
              <span class="span-1">{{ $t('remotePatrol.getscore') }}：</span>
              <span class="span-2">{{ scorecount }} <span>{{ $t('remotePatrol.scorecount') }}</span></span>
            </div>
          </div>
          <hr class="hr-horizontal"/>
          <div class="limit-group-score-tip" >
            <div class="limit-img" >
              <img :src="require('../../../static/img/group_score.svg')" width="20" height="20" />
            </div>
            <div class="limit-text">{{$t('remotePatrol.tipLimitGroupScore')}}</div>
          </div>
          <table v-for="(s_item,s_index) in summary" :key="s_index" class="table table-bordered" style="margin-top:10px;">
            <thead>
              <tr>
                <th v-for="(t_item ,t_index) in s_item.data[0].tHeader" :key="t_index" :style="t_item.width" scope="col">
                  {{ t_item.name }}
                </th>
              </tr>
            </thead>
            <template v-for="(inspectItem, inspectIndex) in s_item.data">
              <tbody :key="inspectIndex">
                <tr style="vertical-align:middle;">
                  <td :rowspan="inspectItem.inspectList.length+1" style="vertical-align:middle;">
                    <div class="flex">
                      <div class="spacer">
                        <div v-if="inspectItem.weight != -1 && inspectItem.type != 2">{{ inspectItem.weight + '%' }}</div>
                        <div class="sheet_title">{{ inspectItem.label }}</div>
                      </div>
                      <div class="flex" style="align-items: center">
                        <span>{{$t('')}}</span>
                        <span class="count-blag">{{inspectItem.count}}</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-for="(item,index) in inspectItem.inspectList" :key="index">
                  <td style="word-break: keep-all;white-space:nowrap;">
                    <span class="item-name">{{ inspectItem.isCategory ? item.groupName : '--' }}</span>
                    <span v-if="inspectItem.isCategory" class="count-blag">{{ item.items.length }}</span>
                  </td>
                  <td v-if="inspectItem.type === 0||inspectItem.type === 2"><span>{{ item.numOfQualified }}</span></td>
                  <td v-if="inspectItem.type === 0||inspectItem.type === 2"><span>{{ item.numOfUnqualified }}</span></td>
                  <td v-if="inspectItem.type === 1"><span>{{ getDoubleNum(item.itemScore) }}</span></td>
                  <td>
                    <div style="display:flex;flex-direction:row;justify-content:space-between;">
                      <div style="flex:2;">{{ item.itemgetScore == '--' ? '--' : getDoubleNum(item.itemgetScore) }}</div>
                      <div style="display:flex;flex:1;flex-direction:row;align-content:center;">
                        <img v-if="item.groupScore != '-99999'" style="margin-right:4px;" :src="require('../../../static/img/group_score.svg')" width="15" height="15" />
                        <div style="color:#9EACB6;font-size:10px;font-weight:normal;">{{ item.groupScore != '-99999'? item.groupScore:''}}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>
        <el-row v-for="(item,index) in tempList" :key="index" class="row-detail">
          <el-col v-if="item.data.length!=0">
            <div class="item-header">
              <span class="title-lable">{{ item.itemTitleName }}</span>
              <span style="float:right;" class="count-content"><span class="count">{{ item.itemCount }}</span>
              <span class="blag">{{ $t('remotePatrol.unit') }}</span></span>
            </div>
            <div class="item-content">
              <div style="margin-bottom:20px;">
                <div v-for="(_item,_index) in item.data" :key="_index" class="content-detail">
                  <template v-if="index !== 2" >
                    <template v-if="!_item.children">
                      <div class="content-title">{{ _item.groupName }}</div>
                      <hr v-if="!item.children" class="hr-horizontal" />
                      <div v-for="(categoryItem,categoryIndex) in _item.cateryItems" :key="categoryIndex" class="content-detail">
                        <div class="content-detail-title">
                          <div class="detail-title">
                            <p class="title1">{{ categoryIndex+1 }}.{{ categoryItem.subject }}</p>
                            <p class="title2">{{ categoryItem.description }}</p>
                          </div>
                          <div v-if="categoryItem.itemType === 0" class="score-title">
                            <div v-if="item.detailType === 1" class="ignore-btn">{{ $t('remotePatrol.ignored') }}</div>
                            <template v-if="item.detailType !== 1">
                              <div
                                v-if="categoryItem.type === 0"
                                class="title-btn">
                                {{ $t('remotePatrol.scoreUnit') }}<span>{{ tab1BtnArr[1] }}</span>
                              </div>
                              <div
                                v-if="categoryItem.type === 2"
                                class="title-btn">
                                {{ $t('remotePatrol.scoreUnit') }}<span>{{ tab3BtnArr[1] }}</span>
                              </div>
                              <div v-if="categoryItem.type === 1" class="title-btn">
                                {{ $t('remotePatrol.scoreUnit') }}
                                <span>
                                  <span>{{ categoryItem.itemgetScore }}</span>
                                  <span v-if="lang !== 'en'">{{ $t('remotePatrol.scorecount') }}</span>
                                </span>
                              </div>
                            </template>
                            <div v-if="categoryItem.showTotalScore" class="total-score">
                              {{ $t('remotePatrol.totalScoreUnit') }}{{ categoryItem.itemScore }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="categoryItem.sourceList!= null && categoryItem.sourceList.length !== 0
                          || categoryItem.inspectText != null&&categoryItem.inspectText !== ''"
                          class="content-detail-main"
                          style="padding-bottom: 20px;">
                          <p class="cdm-title">{{ $t('remotePatrol.commentDetail') }}</p>
                          
                          <div v-if="categoryItem.sourceList!=null&&categoryItem.sourceList.length!=0" class="cdm-pic">
                            <div
                              v-for="(sourceitem,sourceindex) in categoryItem.sourceList"
                              :key="sourceindex"
                              :height="imgHeight+'px'"
                              class="source-details">
                              <template v-if="sourceitem.mediaType==3">
                                {{`${sourceitem.src}`}}
                              </template>
                              <div v-if="sourceitem.mediaType==2" class="img-content">
                                <el-image
                                  :src="sourceitem.src"
                                  :style="imageStyle"
                                  :preview-src-list="getImgList(sourceindex, categoryItem.sourceList)"
                                  class="imgLittle imgInner"/>
                              </div>
                              <div
                                v-if="sourceitem.mediaType==1"
                                class="img-content "
                                @click="playCommentVideo(sourceitem,sourceindex)">
                                <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                                <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div v-for="(child, childIndex) in _item.children" :key="childIndex">
                        <div class="content-title flex-center"> 
                          <div>{{ `【${_item.groupName}】 — 【${child.groupName}】` }}</div>
                        </div>
                        <hr class="hr-horizontal"/>
                        <div v-for="(childItem, childIndex) in child.cateryItems" :key="childIndex" class="content-detail">
                          <div class="content-detail-title">
                            <div class="detail-title">
                              <p class="title1">{{ childIndex+1 }}.{{ childItem.subject }}</p>
                              <p class="title2">{{ childItem.description }}</p>
                            </div>
                            <div v-if="childItem.itemType === 0" class="score-title">
                              <div v-if="item.detailType === 1" class="ignore-btn">{{ $t('remotePatrol.ignored') }}</div>
                              <div
                                v-if="(childItem.type === 0 ||childItem.type === 2)&&item.detailType !== 1"
                                class="title-btn">
                                {{ $t('remotePatrol.scoreUnit') }}
                                <span>{{childItem.itemScoreTitle}}</span>
                              </div>
                              <div v-if="childItem.type==1&&item.detailType!=1" class="title-btn">
                                {{ $t('remotePatrol.scoreUnit') }}
                                <span>
                                  <span>{{ childItem.itemgetScore }}</span>
                                  <span v-if="lang !== 'en'">{{ $t('remotePatrol.scorecount') }}
                                  </span>
                                </span>
                              </div>
                              <div v-if="childItem.showTotalScore" class="total-score">
                                {{ $t('remotePatrol.totalScoreUnit') }}{{ childItem.itemScore }}
                              </div>
                            </div>
                          </div>
                          <p 
                            v-if="childItem.sourceList!= null && childItem.sourceList.length !== 0
                            || childItem.inspectText != null&&childItem.inspectText !== ''"
                          class="cdm-title">{{ $t('remotePatrol.commentDetail') }}</p>
                          <div
                            v-if="childItem.sourceList!= null && childItem.sourceList.length !== 0
                            || childItem.inspectText != null&&childItem.inspectText !== ''"
                            class="content-detail-main"
                            style="padding-bottom: 20px;">
                            <div v-if="childItem.sourceList!=null&&childItem.sourceList.length!=0" class="cdm-pic">
                              <div
                                v-for="(sourceitem,sourceindex) in childItem.sourceList"
                                :key="sourceindex"
                                :height="imgHeight+'px'"
                                :class="{'source-details': sourceitem.mediaType!=3}">
                                <template v-if="sourceitem.mediaType==3">
                                  {{`${sourceitem.src}`}}
                                </template>
                                <div v-if="sourceitem.mediaType==2" class="img-content">
                                  <el-image
                                    :src="sourceitem.src"
                                    :style="imageStyle"
                                    :preview-src-list="getImgList(sourceindex, childItem.sourceList)"
                                    class="imgLittle imgInner"/>
                                </div>
                                <div v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,sourceindex)">
                                  <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                                  <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="_item.showAttachment || _item.comment != null && _item.comment !== ''"
                            class="content-detail-main"
                            style="padding-bottom: 20px;">
                            <p class="cdm-title"><span class="pdf_font_24">{{ $t('remotePatrol.commentDetail') }}</span></p>
                            <div v-if="_item.showAudio" class="cdm-voice">
                              <div :class="isexportPDF ? 'pdf_speech_info' : 'speech-info'" @click="startSpeechItem(_item,_index)">
                                <i class="iconfont icon-yuyin icon-speech"/>
                              </div>
                              <audio :ref="_item.audio.audioRef" @canplay="getGroupsDuration(_item)">
                                <source :src="_item.audio.audioSrc" type="audio/mpeg" >
                              </audio>
                              <span class="often-text">{{ _item.audio.audioOftenText }}</span>
                            </div>
                            <div v-if="_item.comment != null && _item.comment !== ''" class="cdm-word">
                              <span class="pdf_font_24">{{ _item.comment }}</span>
                            </div>
                            <div v-if="_item.sourceList != null && _item.sourceList.length !== 0" class="cdm-pic">
                              <div
                                v-for="(sourceitem,sourceindex) in _item.sourceList"
                                :key="sourceindex"
                                :height="imgHeight+'px'"
                                :class="{'source-details': sourceitem.mediaType!=3}">
                                <template v-if="sourceitem.mediaType==3">
                                 {{`${sourceitem.src}`}}
                                </template>
                                <div v-if="sourceitem.mediaType === 2" :style="isexportPDF ? 'margin-right:20px;margin-bottom:20px' : ''" class="img-content">
                                  <el-image
                                    :src="sourceitem.src"
                                    :style="imageStyle"
                                    :preview-src-list="getImgList(sourceindex, _item.sourceList)"
                                    class="imgLittle imgInner"/>
                                </div>
                                <div
                                  v-if="sourceitem.mediaType==1"
                                  class="img-content "
                                  @click="playCommentVideo(sourceitem,sourceindex)">
                                  <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                                  <img
                                    :style="isexportPDF ? 'width:260px;height:148px;':'width: calc(130/1920*100vw);'"
                                    :src="videoImgSrc"
                                    :height="imgHeight+'px'"
                                    class="imgLittle">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="content-detail-title" style="background-color:#fff;min-height:30px;">
                      <div class="detail-title">
                        <p class="title1">{{ _index+1 }}.{{ _item.subject }}</p>
                      </div>
                    </div>
                    <div v-if="_item.sourceList!=null||item.description!=null&&item.description!=''" class="content-detail-main">
                      
                      <div v-if="_item.sourceList!=null&&_item.sourceList.length!=0" class="cdm-pic">
                        <div v-for="(sourceitem,index) in _item.sourceList" :key="index" :height="imgHeight+'px'" :class="{'source-details': sourceitem.mediaType!=3}">
                          <template v-if="sourceitem.mediaType==3">
                            {{`${sourceitem.src}`}}
                          </template>
                          <div v-if="sourceitem.mediaType==2" class="img-content">
                            <el-image
                              :src="sourceitem.src"
                              :style="imageStyle"
                              :preview-src-list="getImgList(index, _item.sourceList)"
                              class="imgLittle imgInner"/>
                          </div>
                          <div v-if="sourceitem.mediaType==1" class="img-content " @click="playCommentVideo(sourceitem,index)">
                            <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                            <img :src="videoImgSrc" :height="imgHeight+'px'" class="imgLittle">
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <el-dialog
                v-if="dialogCommentVideo"
                :title="$t('eventView.view')"
                :visible.sync="dialogCommentVideo"
                :close-on-click-modal="false"
                width="850px"
                top="12%"
                class="rate-video-dialog"
                @close="stopCommentVideo">
                <div class="video-dialog-content" style="overflow:hidden;">
                  <hr class="dialog-hr">
                  <div class="video-content" >
                    <video
                      id="previewVideo"
                      height="83%"
                      width="90%"
                      prload
                      controls
                      class="video-js vjs-fill"/>
                  </div>
                </div>
              </el-dialog>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-dialog :visible.sync="uploadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
      <div class="body-content">
        <p>{{ $t('remotePatrol.uploading') }}</p>
        <p style="margin-bottom:15px;">
          {{ $t('remotePatrol.uploadInfo', {totalNum: totalnumOfPic, uploadedNum: uploadingnumOfPic}) }}
        </p>
        <el-progress :percentage="Math.round(uploadingnumOfPic/totalnumOfPic*100)"/>
      </div>
    </el-dialog>
    <dialog-pop
      :title="$t('remotePatrol.resubmiteRpt')"
      :isWarning="true"
      :visible="showConfirmSubmitMsg"
      @cancelHandler = "showConfirmSubmitMsg=false"
      @confirmHandler="onConfirmSubmitMsgOk">
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('remotePatrol.resubmiteRpt')+'?' }} </div>
      </div>
    </dialog-pop>
    <dialog-pop
      :title="$t('remotePatrol.systemReject')"
      :isWarning="true"
      :visible="showSystemReject"
      :showCancelbtn="false"
      @confirmHandler="onshowSystemRejectConfirm">
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('remotePatrol.systemRejectMsg') }} </div>
      </div>
    </dialog-pop>
  </el-row>
</template>
<script>
import { getStorageInfo } from '@/api/event';
import { submitInspectItem1 } from '@/api/inspect';
import {SubmitWorkflow,getWorkflowInfo,modifyReportWorkflow,taskSummit,getReportWorkflowTask,ReSubmitWorkflow} from '@/api/workflow';
import util from '@/common/util';
import { getCookie } from '@/common/auth';
import { getDepartmentListAll } from '@/api/checkin';
import { getUserInfo ,getAllUserInfoNoAuth} from '@/api/login';
import filterString from '@/common/filterString.js';
import Database from '@/common/Database.js';
import PermissionHelper from '@/api/PermissionHelper';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'ConfirmAddSum',
  components: {DialogPop},
  data() {
    return {
      dialogCommentVideo: false,
      uploadProgress: false,
      totalnumOfPic: 0,
      uploadingnumOfPic: 0,
      scorecount: 0,
      radioList: [],
      imgTitle: '',
      resultList: [
        {
          'label': 2,
          'name': this.$t('overview.echartGood'),
          'isActive': false,
          'isShow': true
        },
        {
          'label': 1,
          'name': this.$t('remotePatrol.improve'),
          'isActive': false,
          'isShow': true
        },
        {
          'label': 0,
          'name': this.$t('remotePatrol.dangerous'),
          'isActive': false,
          'isShow': true
        }
      ],
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
      deafultImg: 'this.src="' + require('../../../static/img/picture_failed.png') + '"',
      theaderPassFail: [],
      theaderScore: [],
      theaderOther: [],
      suggest: '',
      store: {},
      channel: {},
      summary: [],
      tempList: [],
      inspectList: [],
      eventList: [],
      oss: null,
      bucketVideo: '',
      bucketImage: '',
      percentage: 0,
      accountId: '',
      curSumIndex: 0,
      varyWindowWidth: window.innerWidth,
      pass: this.$t('remotePatrol.pass'),
      fail: this.$t('remotePatrol.failed'),
      lang: this.$i18n.locale,
      adviceInfoRuletip: false,
      tab1BtnArr: [],
      tab3BtnArr: [],
      allRemarkItemsFlag: true,
      isBindWorkflow:false,
      auditNote:'',
      auditNoteRuletip:false,
      pdfFileList:[],
      imgFileList:[],
      auditFileCount:0,
      workflowInfo:{copyToUsers:"",nextAuditUser:""},
      userDataList:[],
      positionsList:[],
      bucketPdf:'',
      isEditReport:false,
      reportId:-1,
      reportStatus:-1,
      auditCancelable:false,
      showConfirmSubmitMsg:false,
      showSystemReject:false
    };
  },
  computed: {
    imgHeight() {
      let height = 0;
      if (this.varyWindowWidth > 1800) {
        height = this.varyWindowWidth * 0.039;
      } else if (this.varyWindowWidth > 1400) {
        height = this.varyWindowWidth * 0.035;
      } else {
        height = 75;
      }
      return height;
    },

    imageStyle() {
      return {
        'width': 'calc(130/1920*100vw)',
        'height': `${this.imgHeight}px`
      };
    }
  },
  watch:{
    pdfFileList(){
      this.auditFileCount = this.pdfFileList.length+this.imgFileList.length;
    },
    imgFileList(){
      this.auditFileCount = this.pdfFileList.length+this.imgFileList.length;
    },
  },
  beforeRouteLeave(to, from, next) {
    const self = this;
    console.log("beforeRouteLeave:",to.name)
    if (to.name !== 'remotePatrol') {
      self.$store.dispatch('setPatrolHistory', null);
      self.$store.dispatch('setPatrolComment', null);
      self.$store.dispatch('setStoreList', []);
      self.$store.dispatch('setStoreCache', null);
      this.$store.dispatch('setEditCount', 0);
      console.log("userId:",self.userId);
      Database.addDataToDB(self.userId, { data: {}, rule: {}});
      next();
    } else {
      self.$store.dispatch('setPatrolComment', {suggest:self.suggest,status:self.curSumIndex});
      next();
    }
  },
  mounted() {
    const self = this;
    
    self.getRouteData();
    self.getUpLoadBucketInfo();
    self.getOssInfo();
  },
  methods: {
    getDoubleNum (num) {
      return Math.round(num * 100) / 100  
    },
    stopCommentVideo() {
      var video = document.getElementById('previewVideo');
      this.previewplayer = videojs(video);
      this.previewplayer.pause();
    },
    playCommentVideo(item, index) {
      const self = this;
      self.dialogCommentVideo = true;
      self.$nextTick(function() {
        var video = document.getElementById('previewVideo');
        this.previewplayer = videojs(video);
        this.previewplayer.src({ src: item.url });
        this.previewplayer.play();
      });
    },

    getImgList(index, sourceList) {
      const arr = [];
      let i = 0;
      for (i; i < sourceList.length; i++) {
        arr.push(sourceList[i + index]);
        if (i + index >= sourceList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.filter(source => source.mediaType === 2).map(source => source.src);
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
    clickSum(item, index) {
      const self = this;
      item.isActive = true;
      self.resultList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isActive = false;
        }
      });
      self.curSumIndex = item.label;
    },
    onConfirmSubmitMsgOk(){
      this.showConfirmSubmitMsg = false;
      this.submit(true);
    },

    async submit(sendEvent) {
      const self = this;
      let upload = 0;
      const inspect = self.inspectList;
      const eventList = self.eventList;
      let status = 0;
      let flag = false;
      self.uploadingnumOfPic = 0;
      self.totalnumOfPic += self.imgFileList.length + self.pdfFileList.length; 
      self.resultList.forEach(item => {
        if (item.isActive) {
          flag = true;
        }
      });
      if (!flag) {
        util.notify(self.$t('remotePatrol.summaryInfo'), 'warning', 3000);
        return false;
      }
      self.totalnumOfPic > 0 ? self.uploadProgress = true : self.uploadProgress = false;
      const storageParams = {};
      storageParams.storeId = self.store.storeId;
      await getStorageInfo(storageParams).then(res => {
        if (res.errCode === 0) {
          self.oss = res.data;
        }
      });
      const temp = [];
      for (const i in inspect) {
        for (const g in inspect[i].inspectList) {
          for (const j in inspect[i].inspectList[g].items) {
            const objItem = {};
            if(this.isEditReport && this.reportId!=-1){
              objItem.id = inspect[i].inspectList[g].items[j].id;
            }
            objItem.ts = new Date().getTime();
            // objItem.description = inspect[i].inspectList[g].items[j].inspectText.trim();
            if (inspect[i].inspectList[g].items[j].itemType === 1) {
              objItem.grade = objItem.score = Math.pow(-2, 31);
            } else {
              if (inspect[i].type === 0 || inspect[i].type === 2) {
                objItem.grade = objItem.score = inspect[i].inspectList[g].items[j].isIgnore ||
                  inspect[i].inspectList[g].items[j].manualIgnore ? Math.pow(-2, 31) : (inspect[i].inspectList[g].items[j].isQualified ? 1 : 0);
              } else {
                objItem.grade = objItem.score = inspect[i].inspectList[g].items[j].isIgnore || inspect[i].inspectList[g].items[j].manualIgnore 
                  ? Math.pow(-2, 31)
                  : inspect[i].inspectList[g].items[j].itemgetScore;
              }
            }
            objItem.storeId = self.store.storeId;
            objItem.inspectItemId = inspect[i].inspectList[g].items[j].id;
            const tempFileUrl = [];
            if (!inspect[i].inspectList[g].items[j].isIgnore) {
              for (const k in inspect[i].inspectList[g].items[j].sourceList) {
                const obj = {};
                if (inspect[i].inspectList[g].items[j].sourceList[k].mediaType === 2 || inspect[i].inspectList[g].items[j].sourceList[k].mediaType === 1) {
                  if(inspect[i].inspectList[g].items[j].sourceList[k].hasUrl){ //已經上傳過的檔案
                    self.uploadingnumOfPic++
                    obj.mediaType = inspect[i].inspectList[g].items[j].sourceList[k].mediaType;
                    obj.url = inspect[i].inspectList[g].items[j].sourceList[k].src;
                    obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                  }else{
                    await self.upLoadFile(inspect[i].inspectList[g].items[j].sourceList[k]).then((url) => {
                      self.uploadingnumOfPic++;
                      if (inspect[i].inspectList[g].items[j].sourceList[k].mediaType === 2) {
                        obj.mediaType = 2;
                        obj.url = url;
                        obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                      } else if (inspect[i].inspectList[g].items[j].sourceList[k].mediaType === 1) {
                        obj.mediaType = 1;
                        obj.url = url;
                        obj.deviceId = inspect[i].inspectList[g].items[j].sourceList[k].deviceId;
                      }
                    }).catch((err) => {
                      upload++;
                    });
                    if (upload !== 0) {
                      self.uploadProgress = false;
                      util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
                      return false;
                    }
                  }
                } else {
                  obj.mediaType = 3;
                  obj.url = inspect[i].inspectList[g].items[j].sourceList[k].src;
                }
                tempFileUrl.push(obj);
              }
            }
            objItem.attachment = tempFileUrl;
            temp.push(objItem);
          }
        }
      }
      //feedBack
      const feedEventList = [];
      for (const i in self.eventList) {
        const obj = {};
        obj.id = (self.eventList[i].id)?self.eventList[i].id:-1;
        obj.ts = new Date().getTime();
        obj.storeId = self.store.storeId;

        obj.subject = self.eventList[i].eventName;
        // obj.description = self.eventList[i].eventDes;
        const commentTemp = [];
        console.log("self.eventList:",self.eventList);
        if (self.eventList[i].sourceList.length > 0) {
          let arr = self.eventList[i].sourceList;
          arr.forEach(item => {
            if(item.mediaType==3){
              console.log("***item:",item);
              let obj = {};
              obj.mediaType = 3;
              obj.url = item.src;
              commentTemp.push(obj);
            }
          })
          
        }else{
          console.log("***self.eventList[i]:",self.eventList[i]);
          let obj = {};
            obj.mediaType = 3;
            obj.url = self.eventList[i].eventDes;
            commentTemp.push(obj);
        }
        if (self.eventList[i].sourceObj != null) { 
          if(self.eventList[i].sourceObj.hasUrl){
            self.uploadingnumOfPic++;
            const commentObj = {
                mediaType: self.eventList[i].sourceObj.mediaType,
                url: self.eventList[i].sourceObj.src,
                deviceId: self.eventList[i].sourceObj.deviceId
              };
              commentTemp.push(commentObj);
          }else{
            await self.upLoadFile(self.eventList[i].sourceObj).then((url) => {
              self.uploadingnumOfPic++;
              const commentObj = {
                mediaType: self.eventList[i].sourceObj.mediaType,
                url: url,
                deviceId: self.eventList[i].sourceObj.deviceId
              };
              commentTemp.push(commentObj);
            }).catch((err) => {
              upload++;
            });
            if (upload !== 0) {
              self.uploadProgress = false;
              util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
              return false;
            }
          }
          obj.deviceId = self.eventList[i].sourceObj.deviceId;
        } else {
          // obj.diviceId=-1;
        }
        obj.attachment = commentTemp;
        feedEventList.push(obj);
      }
      //上傳簽核附件 
      var auditAttachment = [];
      //upload audit image
      for(let idx=0; idx<self.imgFileList.length;idx++){
        if(!self.imgFileList[idx].hasUrl){
          await self.upLoadFile(self.imgFileList[idx]).then((url) => {
            self.uploadingnumOfPic++;
            const auditImgObj = {
              mediaType: 2,
              url: url,
              ts: Date.now()
            };
            auditAttachment.push(auditImgObj);
          }).catch((err) => {
            console.log("uploade file error:",err)
            upload++;
          });
        }else{
          self.uploadingnumOfPic++;
            const auditImgObj = {
              mediaType: 2,
              url: self.imgFileList[idx].src,
              ts: Date.now()
            };
            auditAttachment.push(auditImgObj);
        }
      }
      //upload audit pdf
      for(let idx=0; idx<self.pdfFileList.length; idx++){
        if(!self.pdfFileList[idx].hasUrl){
          await self.upLoadFile(self.pdfFileList[idx]).then((url) => {
            self.uploadingnumOfPic++;
            const auditImgObj = {
              fileName:self.pdfFileList[idx].showName,
              mediaType: 4,
              url: url,
              ts: Date.now()
            };
            auditAttachment.push(auditImgObj);
          }).catch((err) => {
            console.log("uploade file error:",err)
            upload++;
          });
        }else{
          self.uploadingnumOfPic++;
            const auditImgObj = {
              fileName:self.pdfFileList[idx].showName,
              mediaType: 4,
              url: self.pdfFileList[idx].src,
              ts: Date.now()
            };
            auditAttachment.push(auditImgObj);
        }
      }
      if (upload !== 0) {
          self.uploadProgress = false;
          util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
          return false;
      }
      let curSumIndex = [];
      curSumIndex = self.resultList.filter(x => x.isActive);
      status = curSumIndex[0].label;
      const uuid = sessionStorage.getItem('uuid');
      const params = {
        uuid: uuid,
        status: status,
        comment: (self.suggest)?self.suggest.trim():"",
        items: temp,
        feedback: feedEventList,
        isMysteryMode:PermissionHelper.enableMimicMode,
        isCreateEvent:sendEvent
      };
      
      let routeData = null;
      if(self.reportId!=-1 && self.isEditReport){
        params['reportId']=this.reportId;
        upload === 0 && self.doModifyReportSubmit(params,auditAttachment,sendEvent);
      } else{
        upload === 0 && submitInspectItem1(params).then(res => {
          if (res.errCode === 0) {
            const data = res.data;
            self.editFlag = true;
            if(self.isBindWorkflow){
              const inspectId = data.inspectId; //取得報告ID
              const wfParams={
                inspectReportId:inspectId,
                comment:{
                  description:self.auditNote,
                  attachment:auditAttachment
                }
              }
              SubmitWorkflow(wfParams).then(wfRes=>{
                console.log("SubmitWorkflow res:",res);
                if(wfRes.errCode == 0){
                  if(wfRes.data.isSystemReject){
                    self.showSystemReject = true;
                    return;
                  }
                  self.$store.dispatch('setEditCount', 0);
                  routeData = {
                      isSuccess: true,
                      user: data.notifiedTo,
                      isBindWorkflow:!!PermissionHelper.enableSendAudit() || !!PermissionHelper.enableMimicMode
                  };
                }else{
                  util.notify(wfRes.errMsg, 'error', 3000);
                  routeData = {
                    isSuccess: false,
                    reLoadData: self.$route.params,
                    isBindWorkflow:!!PermissionHelper.enableSendAudit() || !!PermissionHelper.enableMimicMode
                  };
                }
                
                self.$router.push({ name: 'submitEvent', params: { data: routeData }});
              }).catch(err=>{
                  console.log("err:",err);
                  util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
                  return false;
                }
              );
            }else{
              routeData = {
                isSuccess: true,
                user: data.notifiedTo,
                isBindWorkflow:false
              };
            }
            
          } else {
            util.notify(res.errMsg, 'error', 3000);
            routeData = {
              isSuccess: false,
              reLoadData: self.$route.params,
              isBindWorkflow:false
            };
          }
          if(!self.isBindWorkflow)
            self.$router.push({ name: 'submitEvent', params: { data: routeData}});
        }).catch(err => {
          util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
          return false;
        });
      }
      self.uploadProgress = false;
    },

    doModifyReportSubmit(params,auditAttachment,sendEvent){
      const self = this;
      console.log("submit report params:",params);
      var routeData = {
        isSuccess: false,
        reLoadData: self.$route.params,
        isBindWorkflow:!!PermissionHelper.enableSendAudit() 
      };
      var resReportModify = modifyReportWorkflow(params);
      var resWorkflowTask = getReportWorkflowTask({type:0,inspectReportId:self.reportId});
      Promise.all([resReportModify,resWorkflowTask]).then( async (result) =>{
        console.log("doModifyReportSubmit result:",result);
        var data =[]
        if(result[0].errCode==0){
          data = result[0].data;
          self.editFlag = true;
        }else{
          util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
          return false;
        }
        if(result[1].errCode!=0) {
          util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
          return false;
        }
        if(!sendEvent){//儲存，非送出報告，不用submit簽核
          routeData = {
            reportId: self.reportId, 
            isAuditMode: true, 
            canEdit: true,
            canCancel: this.auditCancelable,
            auditCancelable:this.auditCancelable
          };
          const workflowParams={
            _id:'rpt'+self.reportId,
            description:self.auditNote,
            attachment:auditAttachment
          };
          console.log("save db:",workflowParams);
          await Database.addDataToDB('rpt'+self.reportId, workflowParams);
          console.log("routeData:",routeData);
          self.$router.push({ name: 'auditReportdetails', params: routeData});
        }else{
          //if(self.auditState==7){ **3.0.4.2 不用判斷都使用reSubmit//系統撤回重送
            var subTaskParam = {
              inspectReportId:self.reportId,
              comment:{
                description:self.auditNote,
                attachment:auditAttachment
              }
            }
            console.log("1.subTaskParam:",subTaskParam);
            self.doReSubmitWorkflow(subTaskParam);
          /*}else{
            let task = result[1].data.find(t=>t.parentId==-1 && t.state==2);
            console.log("task:",task);
            let taskId = task.tasks[0].taskId;
            var subTaskParam = {
              taskId,
              result:0,
              comment:{
                description:self.auditNote,
                attachment:auditAttachment
              }
            };
            console.log("2.subTaskParam:",subTaskParam);
            taskSummit(subTaskParam).then(resSubTask => {
              if(resSubTask.errCode == 0){
                self.$store.dispatch('setEditCount', 0);
                routeData = {
                    isSuccess: true,
                    isBindWorkflow:!!PermissionHelper.enableSendAudit()
                };
                console.log("routeData:",routeData);
                self.$router.push({ name: 'submitEvent', params: { data: routeData}});
              }
            }).catch(errSubTask=>{
              console.log("errSubTask:",errSubTask);
              util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
              return false;
            });
          }*/
        }
      }).catch(err=>{
        console.log("err:",err);
        util.notify(self.$t('remotePatrol.sentFail')+':'+err, 'error', 3000);
        return false;
      });
    },
    doReSubmitWorkflow(wfParams){
      const self = this;
      ReSubmitWorkflow(wfParams).then(wfRes=>{
          console.log("ReSubmitWorkflow res:",wfRes);
          if(wfRes.errCode == 0){
            if(wfRes.data.isSystemReject){
              self.showSystemReject = true;
              return;
            }
            self.$store.dispatch('setEditCount', 0);
            var routeData = {
                isSuccess: true,
                isBindWorkflow:!!PermissionHelper.enableSendAudit() 
            };
            Database.removeDataFromDB('rpt'+self.reportId);
            self.$router.push({ name: 'submitEvent', params: { data: routeData}});
          }else{
            util.notify(wfRes.errMsg, 'error', 3000);
          }
        }).catch(err=>{
            console.log("ReSubmitWorkflow err:",err);
            util.notify(self.$t('remotePatrol.sentFail'), 'error', 3000);
            return false;
          }
        );
    },
    doGetReportWorkflowTask(){
      Database.getDataFromDB('rpt'+this.reportId).then(res => {
        console.log("**getDataFromDB:",res);
        this.auditNote = res.description;
        this.doGetAuditAttachList(res.attachment);
      }).catch(err=>{ //local DB 已刪除
        console.log("**getDataFromDB err:",err)
        getReportWorkflowTask({type:0,inspectReportId:this.reportId}).then(result=>{
          console.log("getReportWorkflowTask result:",result);
          if(result.errCode==0){
            const tasks = result.data.taskList[0].tasks;
            console.log("tasks:",tasks);
            if(tasks.length>0){
              this.auditNote = tasks[0].comment.description;
              this.doGetAuditAttachList(tasks[0].comment.attachment);
            }
          }else{
            console.log("getReportWorkflowTask error:",result.errMsg);
          }
        })
      }
      );
    },
    doGetAuditAttachList(attachments){
      var imgList = [];
      var pdfList = [];
      attachments.map(att=>{
        if(att.mediaType==2){//image
          imgList.push(
            {
              fileName:att.fileName,
              src:att.url,
              file:att.url,
              type:'img',
              size:0,
              hasUrl:true
            }
          );
        }else if(att.mediaType==4){//pdf
          pdfList.push({
            fileName:att.fileName,
            showName:att.fileName,
            src:att.url,
            file:att.fileName,
            type:'pdf',
            size:0,
            hasUrl:true
          });
        }
      });
        this.imgFileList = imgList;
        this.pdfFileList = pdfList;
    },
    onshowSystemRejectConfirm(){
      this.showSystemReject = false;
      this.$store.dispatch('setEditCount', 0);
      var routeData = {
          isSuccess: true,
          isBindWorkflow:!!PermissionHelper.enableSendAudit() 
      };
      this.$router.push({ name: 'submitEvent', params: { data: routeData}});
    },
    async getRouteData() {
      const self = this;
      const PatrolComment = self.$store.getters.PatrolComment;
      if (PatrolComment != null) {
        self.suggest = PatrolComment.suggest;
        self.curSumIndex = PatrolComment.status;
        self.resultList.map(x => {
            if(x.label==self.curSumIndex) x.isActive=true;
          });
      }
      console.log()
      self.userId = getCookie('UserId');
      
      Database.getDataFromDB(getCookie('UserId')).then(res => {
        const inpectResult = res;
        console.log("***inspect:",inpectResult);
        const routeData = inpectResult.data;
        const inspectSettings = inpectResult.rule;
        const inspect = routeData.inspect;
        const eventList = routeData.event;
        const store = routeData.store;
        self.store = store;
        self.inspectList = routeData.inspect;
        self.eventList = routeData.event;
        self.allRemarkItemsFlag = routeData.allRemarkItemsFlag;
        self.isBindWorkflow = routeData.isBindWorkflow;
        self.isEditReport = routeData.isEditReport;
        self.auditCancelable = routeData.auditCancelable;

        if(self.isEditReport) {
          self.reportId = routeData.reportId;
          console.log("isEditReport");
          self.doGetReportWorkflowTask();
        };
        if(self.isBindWorkflow){
          console.log('**inspectSettings.workflowInfo',inspectSettings.workflowInfo);
          self.doGetWorkflowInfo(inspectSettings.workflowInfo);
          self.auditState = routeData.auditState;
          console.log("getRouteData auditState:",routeData.auditState );
        }
        this.getTab1AndTab3BtnName(inspectSettings);
        const allTypeArr = new Set();
        let tempList = [], feedBackTemp = [], ignoreTemp = [], UnqualifiedTemp = [], dealType = [];
        let PassFileXN = 0, PassFileTotalScore = 0, PassFileTotalScoreX = 0, PassFileXS = 0, PassFileTotalScoreSystem = 0;
        let ScoreX = 0, ScoreN = 0, ScoreXN = 0, ScoreTotalScoreX = 0, allScoreB = 0, ScoreTotalScoreSystem = 0;
        let otherGetscoreTotal = 0, OtherTotalScoreSystem = 0;
        let isOnlyTab1 = true;
        inspect.forEach(p_item => {
          if (p_item.type != 0) isOnlyTab1 = false
          if (p_item.dealCount !== 0) {
            dealType.push(p_item.type);
          }
          allTypeArr.add(p_item.type);
        });
        let Tab0Status = false;
        let inspectPic = 0;
        let totalScore0 = 0, CurAddScoreB = 0, CurOtherTotalScore = 0, PassFileX = 0, PassFileTS = 0, ScoreTS = 0, OtherTS = 0, PassFileN = 0;
        let PassFile_totalScoreX = 0, Score_totalScoreX = 0;
        inspect.forEach(p_item => { //大類別
          // console.log(p_item)
          p_item.inspectList.forEach(item => {//子類別, groupScore在這層
            PassFileTS=0;PassFileN = 0;PassFileX = 0;totalScore0=0;PassFile_totalScoreX=0;
            CurAddScoreB = 0;ScoreTS = 0;Score_totalScoreX = 0;ScoreX = 0;ScoreN = 0;
            OtherTS = 0;
            let QualifiedArr = [], UnqualifiedArr = [], IgnoredArr = [];
            let totalScore = 0, totalGetscore = 0, notAddIgnoretotalScore = 0;
            let tab1GetScoreNoContainedIngored = 0;
            let tab1GetScoreContainedIgnored = 0;
            let tab2NotIgnoredItemsGetScore = 0;
            let tab2IgnoredItemsGetScore = 0;
            item.ignoreItems = [];
            item.unqualifiedItems = [];
            item.numOfCommentItem = 0;
            item.numOfTotalItems = 0;
            item.items.forEach(s_item => {//子項 
              item.numOfTotalItems++;
              if (s_item.itemType === 1) {
                item.numOfCommentItem++;
                return;
              }
              if (s_item.isIgnore) {
                IgnoredArr.push(s_item);
                s_item.groupName = item.groupName;
                ignoreTemp.push(s_item);
                item.ignoreItems.push(s_item);
              } else {
                if ((p_item.type === 0 || p_item.type === 2) && !s_item.isQualified) {
                  UnqualifiedArr.push(s_item);
                  s_item.groupName = item.groupName;
                  UnqualifiedTemp.push(s_item);
                  item.unqualifiedItems.push(s_item);
                } else if ((p_item.type === 0 || p_item.type === 2) && s_item.isQualified) {
                  QualifiedArr.push(s_item);
                } else if (p_item.type === 1 && (s_item.itemgetScore < s_item.qualifiedScore)) {
                  s_item.groupName = item.groupName;
                  UnqualifiedTemp.push(s_item);
                  item.unqualifiedItems.push(s_item);
                }
                if (s_item.itemgetScore !== '--') {
                  totalGetscore += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * (s_item.type==2 ? 1 :(p_item.weight / 100));
                }
              }
              s_item.itemgetScore === '--' ? s_item.itemgetScore = 0 : null;
              if (p_item.type === 0) {
                PassFileTS += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * p_item.weight / 100;
                totalScore0 += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                if (!s_item.isIgnore && !s_item.manualIgnore) {
                  PassFileX += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * p_item.weight / 100;
                  PassFile_totalScoreX += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                  tab1GetScoreNoContainedIngored += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * p_item.weight / 100;
                } else {
                  PassFileN += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                  tab1GetScoreContainedIgnored += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                }
                if (inspect.length > 1) {
                  if (!inspectSettings.includedInTotalScoreWithType1) {
                    s_item.showTotalScore = false;
                  } else if (s_item.isIgnore || s_item.manualIgnore) {
                    if (inspectSettings.qualifiedForIgnoredWithType1) {
                      s_item.showTotalScore = true;
                    } else {
                      s_item.showTotalScore = false;
                    }
                  } else {
                    s_item.showTotalScore = true;
                  }
                } else {
                  if (s_item.isIgnore || s_item.manualIgnore) {
                    s_item.showTotalScore = inspectSettings.qualifiedForIgnoredWithType1;
                  } else {
                    s_item.showTotalScore = true;
                  }
                }
              } else if (p_item.type === 1) {
                totalScore += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                ScoreTS += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * p_item.weight / 100;
                if (!s_item.isIgnore && !s_item.manualIgnore) {
                  ScoreX += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * p_item.weight / 100;
                  Score_totalScoreX += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                  notAddIgnoretotalScore += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                  tab2NotIgnoredItemsGetScore += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore * p_item.weight / 100;
                } else {
                  ScoreN += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                  tab2IgnoredItemsGetScore += p_item.weight == -1 ? s_item.itemScore : s_item.itemScore * p_item.weight / 100;
                }
                if (s_item.isIgnore || s_item.manualIgnore) {
                  s_item.showTotalScore = inspectSettings.qualifiedForIgnoredWithType2;
                } else {
                  s_item.showTotalScore = true;
                }
              } else if (p_item.type === 2 && !s_item.isIgnore) {
                OtherTS += p_item.weight == -1 ? s_item.itemgetScore : s_item.itemgetScore;// * p_item.weight / 100;
                s_item.showTotalScore = true;
              }
              inspectPic += s_item.sourceList.length;
            });//end for //子項加總完
            item['numOfQualified'] = QualifiedArr.length;
            item['numOfUnqualified'] = UnqualifiedArr.length;
            item['numIgnore'] = IgnoredArr.length;
            if (inspectSettings.qualifiedForIgnoredWithType2) {
              item['itemScore'] = totalScore;
              if (p_item.type === 1) {
                item['numOfQualified'] = item['numOfQualified'];
                item['numIgnore'] = 0;
              }
            } else {
              item['itemScore'] = notAddIgnoretotalScore;
            }
            if (p_item.type === 0 && !inspectSettings.includedInTotalScoreWithType1 && !isOnlyTab1) {
              item['itemgetScore'] = '--';
            } else {
              item['itemgetScore'] = util.isDouble(totalGetscore,2);
            }
            if (inspect.length === 1 && inspect[0].type === 0) {
              if (inspectSettings.qualifiedForIgnoredWithType1) {
                item['itemgetScore'] = util.isDouble(tab1GetScoreContainedIgnored + tab1GetScoreNoContainedIngored,2);
                item['numOfQualified'] = item['numOfQualified'];
                item['numIgnore'] = 0;
              } else {
                item['itemgetScore'] = util.isDouble(tab1GetScoreNoContainedIngored,2);
              }
            } else {
              if (inspectSettings.includedInTotalScoreWithType1) {
                if (inspectSettings.qualifiedForIgnoredWithType1 && (p_item.type === 0 || p_item.type === 1)) {
                  item['itemgetScore'] = util.isDouble(tab1GetScoreContainedIgnored +tab1GetScoreNoContainedIngored,2);
                } else {
                  if (p_item.type === 1) item['itemgetScore'] = util.isDouble(tab1GetScoreNoContainedIngored,2);
                }
              }
              if (inspectSettings.qualifiedForIgnoredWithType1) {
                item['numOfQualified'] = item['numOfQualified'];
                item['numIgnore'] = 0;
              }
            }
            if (p_item.type === 0) {
              
              if(item.isAdvanced){
                if(inspectSettings.hundredMarkType === '-1' || inspectSettings.hundredMarkType === '1'){
                  //console.log("PassFileTS:",PassFileTS);
                  if(item.groupScore<0){
                    PassFileTotalScoreSystem += (PassFileTS<item.groupScore?item.groupScore:PassFileTS);
                    console.log("PassFileTotalScoreSystem:",PassFileTotalScoreSystem);
                    PassFileXS += (PassFileX<item.groupScore?item.groupScore:PassFileX);
                    PassFileXN += ((PassFileN + PassFileX)<item.groupScore?item.groupScore:(PassFileN + PassFileX));
                    PassFileTotalScore += (totalScore0<item.groupScore?item.groupScore:totalScore0);
                    PassFileTotalScoreX += (PassFile_totalScoreX<item.groupScore?item.groupScore:PassFile_totalScoreX);
                  }else{
                    PassFileTotalScoreSystem += (PassFileTS>item.groupScore?item.groupScore:PassFileTS);
                    console.log("PassFileTotalScoreSystem:",PassFileTotalScoreSystem);
                    PassFileXS += (PassFileX>item.groupScore?item.groupScore:PassFileX);
                    PassFileXN += ((PassFileN + PassFileX)>item.groupScore?item.groupScore:(PassFileN + PassFileX));
                    PassFileTotalScore += (totalScore0>item.groupScore?item.groupScore:totalScore0);
                    PassFileTotalScoreX += (PassFile_totalScoreX>item.groupScore?item.groupScore:PassFile_totalScoreX);
                  }
                }
              }else{
                PassFileTotalScoreSystem += PassFileTS
                PassFileXS += PassFileX
                PassFileXN += (PassFileN + PassFileX)
                PassFileTotalScore += totalScore0
                PassFileTotalScoreX += PassFile_totalScoreX
              }
            }
            if (p_item.type === 1) {
              if(item.isAdvanced){
                if(inspectSettings.hundredMarkType === '-1' || inspectSettings.hundredMarkType === '1'){
                  //console.log("PassFileTtotalScoreS:",totalScore);
                  if(totalScore<0 && item.groupScore<0)
                    CurAddScoreB += (totalScore<item.groupScore)?item.groupScore:totalScore;
                  else
                    CurAddScoreB += (totalScore>item.groupScore)?item.groupScore:totalScore;
                  allScoreB = CurAddScoreB;
                  console.log("type 1 allScoreB:",allScoreB);

                  if(ScoreTS<0 && item.groupScore<0)
                    ScoreTotalScoreSystem += (ScoreTS<item.groupScore)?item.groupScore:ScoreTS;
                  else
                    ScoreTotalScoreSystem += (ScoreTS>item.groupScore)?item.groupScore:ScoreTS;
                  console.log("type 1 ScoreTotalScoreSystem:",ScoreTotalScoreSystem);

                  if((ScoreX + ScoreN)<0 && item.groupScore<0)
                    ScoreXN += (ScoreX + Score<item.groupScore)?item.groupScore:(ScoreX + ScoreN);
                  else
                    ScoreXN += (ScoreX + ScoreN>item.groupScore)?item.groupScore:(ScoreX + ScoreN);
                  console.log("type 1 ScoreXN:",ScoreXN);

                  if(Score_totalScoreX < 0 &&　item.groupScore<0)
                    ScoreTotalScoreX += (Score_totalScoreX<item.groupScore)?item.groupScore:Score_totalScoreX;
                  else
                    ScoreTotalScoreX += (Score_totalScoreX>item.groupScore)?item.groupScore:Score_totalScoreX;
                  console.log("type 1 ScoreTotalScoreX:",ScoreTotalScoreX);
                }
              }else{
                  CurAddScoreB += totalScore;
                  allScoreB = CurAddScoreB
                  console.log("*type 1 ScoreTS:",ScoreTS);
                  ScoreTotalScoreSystem += ScoreTS
                  console.log("*type 1 ScoreTotalScoreSystem:",ScoreTotalScoreSystem);
                  ScoreXN += (ScoreX + ScoreN)
                  ScoreTotalScoreX += Score_totalScoreX
              }
              item['itemgetScore'] =
                  util.isDouble(inspectSettings.qualifiedForIgnoredWithType2
                    ? (tab2NotIgnoredItemsGetScore + tab2IgnoredItemsGetScore) : tab2NotIgnoredItemsGetScore,2);
                item['itemgetScore'] = util.isDouble(item['itemgetScore'],2);
            }
            if (p_item.type === 2) {
              if(item.isAdvanced){
                if(inspectSettings.hundredMarkType === '-1' || inspectSettings.hundredMarkType === '1'){
                  if(totalGetscore<0 && item.groupScore<0)
                    CurOtherTotalScore += (totalGetscore<item.groupScore)?item.groupScore:totalGetscore;
                  else
                    CurOtherTotalScore += (totalGetscore>item.groupScore)?item.groupScore:totalGetscore;
                  otherGetscoreTotal = CurOtherTotalScore
                  console.log("type 2 otherGetscoreTotal:",otherGetscoreTotal);

                  if(OtherTS<0 && item.groupScore<0)
                    OtherTotalScoreSystem += (OtherTS<item.groupScore)?item.groupScore:OtherTS;
                  else
                    OtherTotalScoreSystem += (OtherTS>item.groupScore)?item.groupScore:OtherTS;
                  console.log("type 2 OtherTotalScoreSystem:",OtherTotalScoreSystem);
                }
              }else{
                CurOtherTotalScore += totalGetscore;
                otherGetscoreTotal = CurOtherTotalScore
                OtherTotalScoreSystem += OtherTS
              }
            }
          });//end for 一個類別
          if (p_item.type === 0) {
            p_item['tHeader'] = self.theaderPassFail;
            if (p_item.inspectList.some(x => x.numOfUnqualified !== 0) && dealType.some(x => x === 0) && inspectSettings.dangerousOnFailedItem) {
              self.resultList[0].isShow = false;
              self.resultList[1].isShow = false;
              self.resultList[2].isActive = true;
              Tab0Status = true;
            }
          } else if (p_item.type === 1) {
            p_item['tHeader'] = self.theaderScore;
          } else if (p_item.type === 2) {
            p_item['tHeader'] = self.theaderOther;
          }
        });
        let s_count = 0;
        if (inspect.length === 1 && inspect[0].type === 0) {
          // console.log(1)
          if (inspectSettings.hundredMarkType === '-1' || inspectSettings.hundredMarkType === '1') {//加分 or 扣分制
            if (inspectSettings.qualifiedForIgnoredWithType1) {
              s_count = PassFileXN;
            } else {
              s_count = PassFileTotalScoreSystem;
            }
          } else {//比例制
            if (inspectSettings.qualifiedForIgnoredWithType1) {
              s_count = PassFileTotalScore === 0 ? 0 : PassFileXN / PassFileTotalScore * 100;
            } else {
              s_count = PassFileTotalScoreX === 0 ? 0 : PassFileXS / PassFileTotalScoreX * 100;
            }
          }
        } else {
          if (inspectSettings.includedInTotalScoreWithType1 || isOnlyTab1) {
            if (inspectSettings.hundredMarkType === '-1' || inspectSettings.hundredMarkType === '1') {
              if (inspectSettings.qualifiedForIgnoredWithType1 && !inspectSettings.qualifiedForIgnoredWithType2) {
                s_count = PassFileXN + ScoreTotalScoreSystem + OtherTotalScoreSystem;
              } else if (!inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
                s_count = PassFileTotalScoreSystem + ScoreXN + OtherTotalScoreSystem;
              } else if (inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
                s_count = PassFileXN + ScoreXN + OtherTotalScoreSystem;
              } else {
                s_count = PassFileTotalScoreSystem + ScoreTotalScoreSystem + OtherTotalScoreSystem;
              }
            } else {
              let total_a = 0, total_b = 0, total_c = 0;
              if (inspectSettings.qualifiedForIgnoredWithType1 && !inspectSettings.qualifiedForIgnoredWithType2) {
                total_a = PassFileXN + ScoreTotalScoreSystem;
                total_b = PassFileTotalScore + ScoreTotalScoreX;
              } else if (!inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
                total_a = PassFileXS + ScoreXN;
                total_b = PassFileTotalScoreX + allScoreB;
              } else if (inspectSettings.qualifiedForIgnoredWithType1 && inspectSettings.qualifiedForIgnoredWithType2) {
                total_a = PassFileXN + ScoreXN;
                total_b = PassFileTotalScore + allScoreB;
              } else {
                total_a = PassFileXS + ScoreTotalScoreSystem;
                total_b = PassFileTotalScoreX + ScoreTotalScoreX;
              }
              total_c = total_a === 0 || total_b === 0 ? 0 : (total_a / total_b * 100);
              s_count = total_c + otherGetscoreTotal;
              // console.log(s_count)
            }
          } else {
            if (inspectSettings.hundredMarkType === '-1' || inspectSettings.hundredMarkType === '1') {
              if (inspectSettings.qualifiedForIgnoredWithType2) {
                s_count = ScoreXN + OtherTotalScoreSystem;
              } else {
                s_count = ScoreTotalScoreSystem + OtherTotalScoreSystem;
              }
            } else {
              let total_a = 0;
              if (inspectSettings.qualifiedForIgnoredWithType2) {
                total_a = allScoreB === 0 || ScoreXN === 0 ? 0 : (ScoreXN / allScoreB * 100);
              } else {
                total_a = ScoreTotalScoreX === 0 || ScoreTotalScoreSystem === 0 ? 0 : (ScoreTotalScoreSystem / ScoreTotalScoreX * 100);
              }
              s_count = total_a + otherGetscoreTotal;
            }
          }
        }
        if (!Tab0Status && dealType.length !== 1 && inspect[0].type === 0 || inspect[0].type !== 0) {
          self.resultList.forEach(item => {
            item.isShow = true;
            item.isActive = (item.label==self.curSumIndex)?true:false;
          });
        }
        if (inspectSettings.hundredMarkType === '1') {
          s_count = s_count + inspectSettings.baseScore;
        }
        self.scorecount = s_count > inspectSettings.maxScore 
          ? inspectSettings.maxScore
          : 
          (
            s_count < inspectSettings.minScore 
            ? inspectSettings.minScore 
            : parseFloat(s_count.toFixed(1))
          );
        self.summary = this.groupbyKey(inspect, 'type');
        eventList.forEach((item, index) => {
          const objFeedBack = {};
          objFeedBack.subject = item.eventName;
          objFeedBack.description = item.eventDes;
          objFeedBack.sourceList = item.sourceList;
          item.sourceObj != null ? objFeedBack.sourceList.push(item.sourceObj) : '';
          feedBackTemp.push(objFeedBack);
        });
        const eventpic = eventList.filter(x => x.sourceObj != null);
        self.totalnumOfPic = Number(inspectPic) + Number(eventpic.length);
        tempList[0] = {
          itemTitleName: self.$t('remotePatrol.notableItem'),
          iconSrc: 'icon-zhongxindingwei',
          itemCount: UnqualifiedTemp.length,
          data: this.getGroupsItems('unqualifiedItems'),
          detailType: 0
        };
        tempList[1] = {
          itemTitleName: self.$t('remotePatrol.ignoreds'),
          iconSrc: 'icon-hulve',
          itemCount: ignoreTemp.length,
          data: this.getGroupsItems('ignoreItems'),
          detailType: 1
        };
        tempList[2] = {
          itemTitleName: self.$t('remotePatrol.feedbacks'),
          iconSrc: 'icon-fankui',
          itemCount: feedBackTemp.length,
          data: feedBackTemp,
          detailType: 2
        };
        self.tempList = tempList;
      }).catch(err => {
        console.log(err);
      });
    },

    getGroupsItems(key) {
      const group = [];
      this.inspectList.forEach(catergy => {
        const tempGroupItem = {};
        tempGroupItem.groupName = catergy.label;
        tempGroupItem.type = catergy.type;
        if (!catergy.isCategory) {
          if (catergy.inspectList[0][key].length > 0) {
            tempGroupItem.cateryItems = catergy.inspectList[0][key];
            group.push(tempGroupItem);
          }
        } else {
          tempGroupItem.children = [];
          catergy.inspectList.forEach(child => {
            const tempChildItem = {};
            tempChildItem.groupId = child.groupId;
            tempChildItem.groupName = child.groupName;
            tempChildItem.type = child.type;
            tempChildItem.cateryItems = [];
            if (child[key].length > 0) {
              tempChildItem.cateryItems = child[key];
            }
            if (tempChildItem.cateryItems.length > 0) {
              tempGroupItem.children.push(tempChildItem);
            }
          });

          if (tempGroupItem.children.length > 0) {
            group.push(tempGroupItem);
          }
        }
      });
      return group;
    },

    groupbyKey(data, key) {
      const tempData = [];
      data.forEach((item) => {
        const res = item.inspectList.filter(inspect => {
          return inspect.numOfCommentItem !== inspect.numOfTotalItems;
        });
        if (res && res.length) {
          item.inspectList = res;
          tempData.push(item);
        }
      });
      let map = {}, dest = [];
      for (var i = 0; i < tempData.length; i++) {
        var ai = tempData[i];
        if (!map[ai[key]]) {
          dest.push({
            name: ai[key],
            data: [ai]
          });
          map[ai[key]] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.name == ai[key]) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },

    getAccountId() {
      const self = this;
      const userId = getCookie('UserId');
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          self.userDataList = res.data;
          res.data.forEach(item => {
            if (item.userId === userId && item.mystery==false) {
              const accountId = item.accountId.toLowerCase();
              self.accountId = accountId;
              localStorage.setItem('oss_bucket', accountId);
              resolve(accountId);
            }
          });
        });
      });
    },
    async getOssInfo() {
      const self = this;
      const accountId = await self.getAccountId();
      self.accountId = localStorage.getItem('oss_bucket');
    },
    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
      self.bucketPdf = 'pdf' + '/' + util.getCurDate2Str();
    },

    notShowInputRuleTips() {
      this.adviceInfoRuletip = false;
    },

    adviceChanged(val) {
      const self = this;
      const content = filterString.all(val, 600);
      const length = filterString.getContentLength(val);
      self.suggest = content;
      if (length > 600) {
        this.adviceInfoRuletip = true;
      } else {
        this.adviceInfoRuletip = false;
      }
    },

    getTab1AndTab3BtnName(setting) {
      this.tab1BtnArr = [setting.itemOptionsForType1[0].name, setting.itemOptionsForType1[1].name];
      this.tab3BtnArr = [setting.itemOptionsForType3[0].name, setting.itemOptionsForType3[1].name];

      this.theaderPassFail = [
        { name: this.$t('remotePatrol.category'), width: 'width:32%;' },
        { name: this.$t('insSettingView.subCategory'), width: 'width:32%;' },
        { name: this.tab1BtnArr[0], width: 'width:12%;' },
        { name: this.tab1BtnArr[1], width: 'width:12%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:12%;' }
      ];
      this.theaderOther = [
        { name: this.$t('remotePatrol.category'), width: 'width:32%;' },
        { name: this.$t('insSettingView.subCategory'), width: 'width:32%;' },
        { name: this.tab3BtnArr[0], width: 'width:12%;' },
        { name: this.tab3BtnArr[1], width: 'width:12%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:12%;' }
      ];
      this.theaderScore = [
        { name: this.$t('remotePatrol.category'), width: 'width:32%;' },
        { name: this.$t('insSettingView.subCategory'), width: 'width:32%;' },
        { name: this.$t('remotePatrol.TableTotal'), width: 'width:24%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:12%;' }
      ];
    },
    
    auditNoteChanged(val) {
      const self = this;
      const content = filterString.all(val, 600);
      const length = filterString.getContentLength(val);
      self.auditNote = content;
      if (length > 600) {
        this.auditNoteRuletip = true;
      } else {
        this.auditNoteRuletip = false;
      }
    },
    notShowAuditNoteRuleTips() {
      this.auditNoteRuletip = false;
    },
    doAddAttachment(e){
      const self = this;
      const maxSize = 4*1024*1024; //不能超過4MB
      var files = e.target.files || e.dataTransfer.files;
      console.log("choose file:",files);
      var fileName = files[0].name;
      if (!files.length)
        return;
      if(self.auditFileCount==10){
        util.notify(self.$t('remotePatrol.maximumAttach'), 'warning', 3000);
        return;
      }
      if(files[0].type.includes("pdf") && files[0].size > maxSize){
        util.notify(self.$t('audit.inceptionRpt.maxFileSizeAlert'), 'warning', 3000);
        return;
      }
      if(files[0].type.includes("image")){
        var objImg={
          fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${files[0].name}`,
          src:'',
          file:'',
          type:files[0].type,
          size:files[0].size
        };
        self.createFile(files[0],objImg);
        self.imgFileList.push(objImg);
      }else if(files[0].type.includes("pdf")){
        console.log("choose file:",fileName);
        var objpdf={
          fileName:`${self.bucketPdf}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${files[0].name}`,
          showName:files[0].name,
          src:'',
          file:fileName,
          type:'pdf',
          size:files[0].size,
        }
        self.createFile(files[0],objpdf);
        self.pdfFileList.push(objpdf);
      }
    },
    createFile(file, objFile) {
      //var image = new Image();
      var reader = new FileReader();

      reader.onload = (e) => {
        objFile.src = e.target.result;
        objFile.file = util.base64ToBlob(e.target.result);
        console.log(objFile.file);
      };
      reader.readAsDataURL(file);
    },

    deleteImg({item, index}) {
      const self = this;
      if(item.type==='pdf')
        self.pdfFileList.splice(index, 1);
      else
        self.imgFileList.splice(index, 1);
    },
    getAuditImgList(index) {
      const arr = [];
      let i = 0;
      for (i; i < this.imgFileList.length; i++) {
        arr.push(this.imgFileList[i + index]);
        if (i + index >= this.imgFileList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.map(source => source.src);
    },
    async doGetWorkflowInfo(workflow){
      var wfi = {copyToUsers:"",nextAuditUser:""}
      const workflowPromise = getWorkflowInfo({processDefinitionKey:workflow.processDefinitionKey});
      const userPosition = getDepartmentListAll({ type: 0 }); //取得職務
      const userPromise = getAllUserInfoNoAuth();
      try {
        const result = await Promise.all([userPosition, userPromise, workflowPromise]);
        this.userDataList = result[1].data;
        this.positionsList = result[0].data;
        const data = result[2].data;
        console.log("result[2].data:",result[2].data);
        wfi.copyToUsers = this.getUserName(data.copyToUsers);
        if(data.nextAuditNode && data.nextAuditNode.nextAuditNode){
          var auditType = data.nextAuditNode.nextAuditNode.auditTargetType;
          if(auditType == 0) //audit by person
            wfi.nextAuditUser = this.getUserName(data.nextAuditNode.nextAuditNode.auditByUsers);
          else if(auditType == 1) //audit by group
            wfi.nextAuditUser = this.getUserPositionList(data.nextAuditNode.nextAuditNode.auditByGroups);
        }
        
        //console.log('*wfi:',wfi);
        this.workflowInfo = wfi;
        //return wfi;
      } catch (e) {
        console.log(e);
        //return wfi;
      }
    },
    getUserName(userIds){
      const self = this;
      var users = self.userDataList.filter(item=> {return userIds.includes(item.userId);});
      var auditUsers = "";
      console.log("users:",users);
      users.forEach( u=>{
        auditUsers += u.userName+',';
      })
      //console.log('auditUsers:', auditUsers);
      return auditUsers.slice(0,auditUsers.length-1);
    },
    getUserPositionList(groupIds) {
      var groups = this.positionsList.filter(item => {return groupIds.includes(item.defineId);});
      var auditGroups="";
      groups.forEach(g=> auditGroups +=g.defineName+',');
      //console.log(' auditGroups:', auditGroups);
      return auditGroups.slice(0,auditGroups.length-1);
    },
  }
};
</script>
<style lang="scss" scoped>
  $red:#2c90d9;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  @function rem($val){
    @return $val/16+rem;
  }
  @function checkRem($val){
    @if($val==0){
      @return 0;
    }
    @else if($val==auto){
      @return auto;
    }
    @else{
      @return rem($val);
    }
  }
  @mixin point($poi,$val){
    #{$poi}:checkRem($val);
  }
  .AddSumupLoad >>> .el-dialog__body{
    padding:30px 40px !important;
    text-align: left;
    .body-content{
      p{
        margin-bottom:0;
        color:#182752;
        font-size: calc(14/1920*100vw);
      }
    }
  }
  .dialog-source-content{
    @include point(height,320);
    @include point(padding,20);

    img{
      height: 100%;
      user-select: none;
    }
  }
  .video-dialog-content{
    width:100%;
    height:100%;
    margin: auto;
    .dialog-hr{
      border: 0.5px solid ;
      border-color: #dfe2e9;
      margin-bottom:10px;
      bottom: 5px;
      margin-top: 0;
    }
    .video-content{
      @include point(margin,20);
      padding-top: 0;
      position: relative;
      #channelName{
        width: 100%;
        color: #fff;
        background-color: rgba($color: #24293d, $alpha: 0.6);
        height: 40px;
        line-height: 40px;
        position: absolute;
        z-index: 10;
        text-align: left;
        span{
          margin-left: 30px;
        }
      }
      .icon-footer{
        width: 100%;
        position: absolute;
        bottom: 0px;
        color: #fff;
        overflow: hidden;
        user-select:none;
        background-color: rgba($color: #24293d, $alpha: 0.6);
        height: 40px;
        line-height: 40px;
        z-index: 10;
        .iconlside{
          float: left;
          text-align: left;
          .iconplay{
            font-size: 18px;
            cursor: pointer;
            float: left;
            margin-left: 30px;
          }

        }
        .iconrside{
          max-width: 500px;
          float: right;
          position: relative;
          span{
            font-size: 13px;
            margin-right:6px;
            margin-left: 20px;
          }
          .speed-content{
            display: inline-block;
            span{
              position: relative;
              bottom:3px;
            }
          }
          .screen-content{
            display: inline;
            margin-left: 30px;
            position: absolute;
            right: 20px;
            .iconscreen{
              font-size: 18px;
              position: relative;
              cursor: pointer;
              margin-right: 20px;
              bottom: 3px;
            }
          }
        }
      }
    }
    .channel-content{
      margin: 20px 30px;
      padding-top: 0;
      position: relative;
      .radio-group{
        display: grid;
        grid-template-columns: 240px 240px;
        grid-template-rows: 30px;
      }
    }
  }
  #previewVideo{
    @include point(min-width,450);
    @include point(min-height,360);
  }
  .activeClass{
    background-color: #006ab7 !important;
    color: #fff;
    border-color: #fff !important;
  }
  .sum-content{
    color: $black;
    .sum-submit{
      margin-bottom: 30px;
      text-align: left;
      padding: 20px;;
      .submit-header{
        text-align: left;
        overflow: hidden;
        span{
          font-size: calc(20/1920*100vw);
          font-weight: bold;
          float: left;
        }
        .sum-btn{
          float: right;
          height: calc(36/1920*100vw);
          width: calc(130/1920*100vw);
          line-height: calc(36/1920*100vw);
          font-size: calc(14/1920*100vw);
          padding: 0 0;
          outline: none;
          border-radius: 4px;
        }
      }
      .submit-content{
        .submit-radio{
          text-align: left;
          margin-bottom: calc(20/1920*100vw);
          .el-radio-details{
            display: inline-block;
            border: 1px solid #ddd;
            padding:6px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
            @include point(width,90);
            @include point(padding,6);
            text-align: center;
            margin-right: calc(20/1920*100vw);
          }

        }
        .sug-label{
          font-size: calc(12/1920*100vw);
          display: block;
          margin-bottom: 16px;
        }
        .rules{
          font-size: 10px;
          color:#ff2400;
          font-weight: 400;
          line-height: 12px;
        }
        .sug-input{
          width: 99.5%;
          >>> textarea {
            background-color: #f4f6f7;
            border: none;
          }
        }
      }
      
      /*簽核*/
      .audit-content{
        .sug-label{
          font-size: calc(12/1920*100vw);
          display: block;
          margin-bottom: 16px;
        }
        .rules{
          font-size: 10px;
          color:#ff2400;
          font-weight: 400;
          line-height: 12px;
        }
        .sug-input{
          width: 99.5%;
          >>> textarea {
            background-color: #f4f6f7;
            border: none;
          }
        }
        .attach-area{
          display:flex;
          flex-wrap: wrap;
          align-content:flex-start;
          align-self: flex-start;
          .attach-add{
            height:100px;
            width:161px;
            border-radius: 10px;
            box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
            display:flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .att-txt{
              font-size: 14px;
              color: #006ab7;
              margin-left: 3px;
            }
          }
          .source-details{
            display: inline-block;
            margin-right: 15px;
            position: relative;
            .icondelete{
              position: absolute;
              font-size: 14px;
              right: 5px;
              margin-top: 8px;
              z-index: 2;
              color: #fff;
              cursor: pointer;
              background-color: rgba($color: $black, $alpha: 0.8);
              border-radius: 50%;
            }
            .img-content{
              width: 100%;
              height: 100%;
              position: relative;
            }
            .pdf-content{
              width: 140px;
              height: 30px;
              padding: 1px 0px 1px 12px;
              border-radius: 5px;
              box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
              background-color: #fff;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              span{
                display:block;
                width:110px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size:12px;
              }
            }
          
          }
        }
        .next-audit{
          display:flex; 
          flex-direction:row;
          justify-content:space-between;
          align-content:stretch;
          margin-top:16px;
          height:100px;
          margin-right: 8px;
          .person-audit{
            width: 100%;
            >>> textarea {
              background-color: #f4f6f7;
              border: none;
            }
          }
        }
      }
    }
    .sum-data{
      padding: 20px;
      background-color:#edf0f2;
      min-height: calc(500/1920*100vw);
      .divider-content{
        height: 40px;
        line-height: 40px;
        display: flex;
        align-items: center;
        .divider-hr{
          border: 0.5px solid $border;
        }
        span{
          font-size: calc(18/1920*100vw);
          font-weight: bold;
          color: $tab;
        }
      }
      .table-content{
        .table-header{
          font-weight: bold;
          .header-store-name{
            font-size: calc(16/1920*100vw);
            color: #484848;
            .store-name{
              // color: $black;
            }
            .en-store-name{
              margin-right: 20px;
              color: $black;
            }
          }
          .header-score{
            .span-1{
              font-size: calc(16/1920*100vw);
              color: $black;
            }
            .span-2{
              color: $red;
              font-size: calc(20/1920*100vw);
            }
            .span-3{
              color: $tab;
              font-size: calc(12/1920*100vw);
            }
          }
        }
        .limit-group-score-tip{
          display: flex;
          flex-direction: row;
          align-content: center;
          font-weight: bold;
          font-size: calc(16/1920*100vw);
          color: #484848;
          height: 30px;
          justify-content: right;
          .limit-img{
            align-self: center;
            height: 20px;
            align-items: center;
            flex-direction: column;
            display: flex;
            justify-content: center;
          }
          .limit-text{
            margin-left: 5px;
            align-self: center;
            height:20px;
          }
        }
        .table-bordered{
          font-size: calc(14/1920*100vw);
          margin-top: 20px;
          width: 100%;
          border-collapse: collapse;
          th, td{
            border: 1px solid #dee2e6;
          }
          th{
            color: $tab;
            text-align: left;
            background-color: $background;
            border-bottom-width: 1px;
            padding: 0.5rem;
            // width: 10%;
            padding-left: 1rem;
          }
          td{
            color: $black;
            padding-top:0.5rem;
            padding-bottom: 0.5rem;
            padding-left: 1.2rem;
            text-align: left;
            font-weight: bold;
          }
          .count-blag{
            padding: 2px 12px;
            border-radius: 10px;
            background-color: #edf8f9;
            color: #006ab7;
            font-size: 12px;
            margin-right: 20px;
            float:right;
          }
          .icon-blag{
            display: inline-block;
            width: 80px;;
            padding:3px 6px;
            text-align: center;
            color: #fff;
            font-size: calc(12/1920*100vw);
            font-weight: normal;
          }
        }
      }
      .row-detail{
        margin-top: 20px;
        text-align: left;
        .item-header{
          position: relative;
          background-color: $background;
          height: 40px;
          line-height: 40px;
          border: 1px solid $border;
          padding:0 calc(20 / 1920 * 100vw);
          cursor: pointer;
          .icontemp {
            font-size: calc(14 / 1920 * 100vw);
            margin-right: calc(15 / 1920 * 100vw);
          }
          .title-lable {
            font-size: calc(14 / 1920 * 100vw);
            font-weight: bold;
          }
          .count-content{
            position:absolute;
            right: calc(20/1920*100vw);
            top: 0;
            .count{
              font-size: calc(30/1920*100vw);
            }
            .blag{
              font-size: calc(12/1920*100vw);
            }
          }
        }
        .item-content{
          padding-top: calc(20 / 1920 * 100vw);
          font-size: calc(14 / 1920 * 100vw);
          padding-left: calc(30 / 1920 * 100vw);
          padding-right: calc(30 / 1920 * 100vw);
          color: #4b5262;
          border: 1px solid $border;
          border-top:0;
          .content-title{
            border-left:4px solid $red;
            font-size: 13px;
            color:#556679;
            padding-left:calc(10 / 1920 * 100vw);
            margin-bottom:calc(10 / 1920 * 100vw);
            font-weight: bold;
          }
          .content-detail{
            margin-top: 10px;
            .content-detail-title{
              margin-top: 10px;
              min-height:70px;
              background-color: #fff;
              padding-left:calc(20 / 1920 * 100vw);
              padding-right: calc(20 / 1920 * 100vw);
              padding-top:10px;
              padding-bottom: 10px;
              display: flex;
              .ignore-btn{
                width:90px;
                height:24px;
                background-color: #f7f9fa;
                font-size: 12px;
                color:#556679;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 5px;
              }
              .title-btn{
                width:100px;
                height:25px;
                background-color: #edf8f9;
                font-size:12px;
                color:#006ab7;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 20px;
              }
              .detail-title{
                flex: 1;
                .title1{
                  font-size: calc(14 / 1920 * 100vw);
                  color:#182752;
                  font-weight: bold;
                  margin:0 0 5px 0;
                }
                .title2{
                  font-size: calc(12 / 1920 * 100vw);
                  color:#7d8cad;
                  margin: 15px 0 0 10px;
                  word-break: break-all;
                }
              }
              .score-title{
                display: inline-flex;
                flex-direction: column;
                width: 100px;
                align-items: center;
              }
            }
            .content-detail-main{
              padding: 10px;
              background-color:$background;
              .cdm-title{
                font-size:calc(12 / 1920 * 100vw);
                color:#94a4b4;
                font-weight: bold;
                margin: 0;
              }
              .cdm-voice{
                margin-top: 10px;
                .speech-info{
                  @include point(width,80);
                  @include point(height,26);
                  background-color: #FFEDED;
                  color: $red;
                  border: 1px solid #FEC0C7;
                  @include point(border-radius,15);
                  display: inline-block;
                  cursor: pointer;
                  .icon-speech{
                    @include point(font-size,18);
                    @include point(line-height,26);
                    @include point(margin-left,5);
                  }
                }
                .often-text{
                  @include point(margin-left,20);
                }
              }
              .cdm-pic{
                overflow: hidden;
                word-break: break-word;
                .source-details{
                  display: inline-block;
                  .img-content{
                    margin-right: calc(10/1920*100vw);
                    position: relative;
                    cursor: pointer;
                    .start-icon{
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%,-50%);
                    }
                    .imgLittle{
                      min-width: 70px;
                      width: calc(130/1920*100vw);
                    }
                  }
                  @media screen and (min-width: 1280px) and(max-width: 1366px){
                    width: 90px;
                    .img-content .imgLittle{
                      width: 85px;
                      width: calc(130/1920*100vw);
                    }
                  }
                }
              }
              .cdm-word{
                margin-top: 10px;
                font-size: calc(14 / 1920 * 100vw);
                color:#4b5262;
                word-wrap:break-word;
              }
            }
          }
        }
      }
      .row-footer{
        padding-top: 20px;
        padding-bottom: 10px;
        margin-top: 10px;
        .details-content{
          padding-right: calc(30/1920*100vw);
          &:last-child{
            padding-right:0;
          }
        }
        .details{
          position: relative;
          height: 320px;
          border:1px solid $border;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          .item-header{
            position: relative;
            background-color: $background;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid $border;
            padding-left: calc(20/1920*100vw);
            text-align: left;
            .icontemp{
              font-size: calc(18/1920*100vw);
              margin-right: calc(15/1920*100vw);
              color: $tab;
            }
            .title-lable{
              font-size: calc(14/1920*100vw);
              font-weight: bold;
            }
            .count-content{
              position:absolute;
              right: calc(20/1920*100vw);
              top: 0;
              .count{
                font-size: calc(30/1920*100vw);
              }
              .blag{
                font-size: calc(12/1920*100vw);
              }
            }
          }
          .item-content{
            padding-top: 20px;
            height:  280px;
            .item-details{
              height: auto;
              font-size: calc(14/1920*100vw);
              padding-left: calc(30/1920*100vw);
              padding-right: calc(20/1920*100vw);
              margin-bottom: 30px;
              color: #4b5262;
              text-align: left;
              .item-blag{
                width: calc(12/1920*100vw);
                height: calc(12/1920*100vw);
                border-radius: 50%;
                background-color: $tab;
                display: inline-block;
                margin-right: calc(16/1920*100vw);
              }
              .item-des{
                display: block;
                font-size: calc(12/1920*100vw);
                margin-top: calc(10/1920*100vw);
                margin-left: calc(35/1920*100vw);
                color: $tab;
              }
            }
          }
        }
      }
    }
  }
  .total-score{
    text-align: center;
    font-size: 12px;
    color: $black;
    margin-top: 4px;
  }
  
</style>
<style>
  .AddSumupLoad .el-dialog__header{
    display: none !important;
  }
  .el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-textarea__inner{
    font-family: Roboto,Arial, 'Microsoft YaHei';
  }
</style>
