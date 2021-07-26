<template>
  <div ref="printPDF" class="report-container">
    <img :src="report.iconSrc" :height="reportImgHeight" alt="" class="report-img">
    <div class="el-header">
      <img :src="report.inspectSrc" :class="isexportPDF ? 'pdf-title-icon' : 'title-icon'">
      <p :class="{'pdf-report-title': isexportPDF, 'report-title': !isexportPDF, 'nochart-report-title': !hasChart}">
        {{ accountName + ' | ' + report.storeName+' '+report.tagName }}
        <span v-if="!isexportPDF">{{ ' ('+report.inspectType+')' }}</span>
      </p>
      <div class="info-content">
        <div class="pdf_font_24">
          <span v-if="!isexportPDF" class="info-label">{{ $t('remotePatrol.submitter') }}</span>
          <span :class="isexportPDF ? 'pdf-info-value' : ''">{{ report.submitterName }}</span>
          <span v-if="!isexportPDF" class="info-label">{{ $t('remotePatrol.generateTime') }}</span>
          <span :class="isexportPDF ? 'pdf-info-value' : ''">{{ report.dateStr }}</span>
          <div style="display:inline-block;">
            <div class="no-print">
              <delay-button
                :class="lang.indexOf('ja') !== -1 ? 'ja-export-btn' : lang.indexOf('zh') === -1 ? 'en-export-btn':'export-btn'"
                class="exportbtn"
                type="primary"
                size="mini"
                @click="handleDown"
              >
                <div class="button-area">
                  <i class="iconfont icon-pdf export"/>
                  <span>{{ $t('remotePatrol.InspectionDetail') }}</span>
                </div>
              </delay-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="template-titles">
      <div v-if="templateList.length > 1" class="names">
        <div
          v-for="(item,index) in templateList"
          :class="{'click-btn' : curTemplateIndex === index}"
          :key="index"
          class="template-name no-print"
          @click="getTemplateConfig(index)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="el-acticle">
      <el-row class="report-content">
        <el-col :span="24" class="">
          <div class="header-score">
            <span class="span-1"><span class="pdf_font_20">{{ $t('remotePatrol.getscore') }}：</span></span>
            <span class="span-2"><span class="pdf_font_26">
              {{ totalScore }}
              <span>{{ $t('remotePatrol.scorecount') }}</span>
            </span>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row v-for="(pageItem, pageIndex) in pageData" :class="pageItem.class" :key="pageIndex">
        <el-col>
          <div v-if="pageItem.class === 'row-detail'">
            <div
              :style="isexportPDF ? 'height:60px;line-height:60px' : ''"
              class="item-header"
              @click="hideOrShowDetail(pageItem, pageIndex)">
              <div class="icon-header">
                <i
                  :style="isexportPDF ? 'font-size:22px;' : ''"
                  :class="pageItem.ifExpand ? 'icon-zhedie1': 'icon-zhankai1'"
                  class="iconfont icontemp"/>
                <span class="title-lable"><span class="pdf_font_20">{{ $t(`titleView.${pageItem.name}`) }}</span></span>
              </div>
              <div v-if="pageItem.itemCount > -1" class="count-header">
                <span class="count"><span class="pdf_font_36">{{ pageItem.itemCount }}</span></span>
                <span class="blag"><span class="pdf_font_18">{{ $t('remotePatrol.unit') }}</span></span>
              </div>
            </div>
            <div v-if="pageItem.ifExpand" class="item-content">
              <div class="pdf_font_20">
                <div v-for="(item,index) in pageItem.data" :key="index" style="border-bottom:1px solid #f4f5f9;margin-bottom:20px;">
                  <div class="content-title"><span class="pdf_font_20">{{ item.groupName }}</span></div>
                  <div v-for="(_item,_index) in item.cateryItems" :key="_index" class="content-detail">
                    <div class="content-detail-title">
                      <div class="detail-title">
                        <p class="title1"><span class="pdf_font_20">{{ _index+1 }}.{{ _item.subject }}</span></p>
                        <p class="title2"><span class="pdf_font_18 title2_pdf">{{ _item.description }}</span></p>
                      </div>
                      <div class="score-title" :style="isexportPDF ? 'width:160px' : 'width:100px;'">
                        <div
                          v-if="_item.grade === Math.pow(-2,31)"
                          :style="isexportPDF ? 'width:100px;height:40px;line-height:40px;' : 'width:50px;'"
                          class="ignore-btn">
                        <span class="pdf_font_18">{{ $t('remotePatrol.ignored') }}</span></div>
                        <div
                          v-if="(item.groupType === 0 || item.groupType === 2) && _item.grade === 0"
                          :style="isexportPDF ? 'width:160px;height:40px;line-height:40px;' : 'width:100px;'"
                          class="title-btn-failed">
                          <span class="pdf_font_18">{{ $t('remotePatrol.scoreUnit') }}{{ $t('remotePatrol.failed') }} </span>
                        </div>
                        <div
                          v-if="(item.groupType === 0||item.groupType === 2) && _item.grade === 1"
                          :style="isexportPDF ? 'width:160px;height:40px;line-height:40px;' : 'width:100px;'"
                          class="title-btn-pass">
                          <span class="pdf_font_18">{{ $t('remotePatrol.scoreUnit') }}{{ $t('remotePatrol.pass') }} </span>
                        </div>
                        <div
                          v-if="item.groupType==1 &&_item.grade!=Math.pow(-2,31)"
                          :class="_item.grade < _item.qualifiedScore ? 'title-btn-failed' : 'title-btn-pass'"
                          :style="isexportPDF ? 'width:160px;height:40px;line-height:40px;' : 'width:100px;'">
                          <span class="pdf_font_18">{{ $t('remotePatrol.scoreUnit') }}{{ _item.grade }}</span>
                        </div>
                        <div
                          v-if="_item.itemScore !== Number.MAX_VALUE"
                          class="total-score">
                          <span class="pdf_font_18">
                            {{ $t('remotePatrol.totalScoreUnit') }}{{ _item.itemScore }}</span>
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
                          class="source-details">
                          <div v-if="sourceitem.mediaType === 2" :style="isexportPDF ? 'margin-right:20px;margin-bottom:20px' : ''" class="img-content">
                            <img
                              :title="imgTitle"
                              :style="isexportPDF ? 'width:260px;height:148px;' : 'width: calc(130/1920*100vw);'"
                              :src="sourceitem.url"
                              :height="imgHeight+'px'"
                              :onerror="deafultImg"
                              class="imgLittle imgInner"
                              @click="openOuter(sourceitem,$event)">
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
                <div v-if="showFeedBacks && showAllDetailsEnable" style="margin-bottom:20px;">
                  <div class="content-title"><span class="pdf_font_20">{{ $t('remotePatrol.feedbacks') }}</span></div>
                  <div v-for="(item,index) in feedbacks" :key="index" class="content-detail">
                    <div class="content-detail-title" style="background-color:#fff;min-height:30px;">
                      <div class="detail-title">
                        <p class="title1"><span class="pdf_font_20">{{ index+1 }}.{{ item.subject }}</span></p>
                      </div>
                    </div>
                    <div
                      v-if="item.showAttachment || item.description != null&&item.description !== ''"
                      class="content-detail-main">
                      <p class="cdm-title"><span class="pdf_font_24">{{ $t('remotePatrol.description') }}：</span></p>
                      <div v-if="item.showAudio" class="cdm-voice">
                        <div :class="isexportPDF ? 'pdf_speech_info' : 'speech-info'" @click="startSpeechFeedBacks(item,index)">
                          <i class="iconfont icon-yuyin icon-speech"/>
                        </div>
                        <audio :ref="item.audio.audioRef" @canplay="getFeedBacksDuration(item)">
                          <source :src="item.audio.audioSrc" type="audio/mpeg" >
                        </audio>
                        <span class="often-text">{{ item.audio.audioOftenText }}</span>
                      </div>
                      <div v-if="item.description !=null && item.description !=''" class="cdm-word">
                        <span class="pdf_font_24">{{ item.description }}</span>
                      </div>
                      <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="cdm-pic">
                        <div
                          v-for="(sourceitem,index) in item.sourceList"
                          :key="index"
                          :height="imgHeight+'px'"
                          class="source-details">
                          <div v-if="sourceitem.mediaType === 2" class="img-content">
                            <img
                              :title="imgTitle"
                              :style="isexportPDF ? 'width:260px;height:148px;' : 'width: calc(130/1920*100vw);'"
                              :src="sourceitem.url"
                              :height="imgHeight+'px'"
                              :onerror="deafultImg"
                              class="imgLittle imgInner"
                              @click="openOuter(sourceitem,$event)">
                          </div>
                          <div
                            v-if="sourceitem.mediaType === 1"
                            class="img-content "
                            @click="playCommentVideo(sourceitem,index)">
                            <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                            <img
                              :style="isexportPDF?'width:260px;height:148px;':'width: calc(130/1920*100vw);'"
                              :src="videoImgSrc"
                              :height="imgHeight+'px'"
                              class="imgLittle">
                          </div>
                        </div>
                      </div>
                    </div>
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
                <transition name="fade">
                  <el-dialog
                    v-if="showOuter"
                    :title="$t('eventView.view')"
                    :visible.sync="showOuter"
                    :close-on-click-modal="false"
                    width="850px"
                    top="12%">
                    <div class="video-dialog-content" style="overflow:hidden;text-align:center;">
                      <hr class="dialog-hr">
                      <div class="dialog-source-content">
                        <img v-if="showImg" :src="checkImgSrc">
                      </div>
                    </div>
                  </el-dialog>
                </transition>
              </div>
            </div>
          </div>
        </el-col>
        <el-col>
          <div v-if="pageItem.class === 'feedback-detail'" class="row-detail">
            <div
              :style="isexportPDF ? 'height:60px;line-height:60px' : ''"
              class="item-header"
              @click="hideOrShowDetail(pageItem, pageIndex)">
              <div class="icon-header">
                <i
                  :style="isexportPDF ? 'font-size:22px;' : ''"
                  :class="pageItem.ifExpand ? 'icon-zhedie1': 'icon-zhankai1'"
                  class="iconfont icontemp"/>
                <span class="title-lable"><span class="pdf_font_20">{{ $t(`titleView.${pageItem.name}`) }}</span></span>
              </div>
              <div v-if="pageItem.itemCount > -1" class="count-header">
                <span class="count"><span class="pdf_font_36">{{ pageItem.itemCount }}</span></span>
                <span class="blag"><span class="pdf_font_18">{{ $t('remotePatrol.unit') }}</span></span>
              </div>
            </div>
            <div v-if="pageItem.ifExpand" class="item-content">
              <div v-for="(item,index) in feedbacks" :key="index" class="content-detail" style="margin-bottom: 20px">
                <div class="content-detail-title" style="background-color:#fff;min-height:30px;">
                  <div class="detail-title">
                    <p class="title1"><span class="pdf_font_20">{{ index+1 }}.{{ item.subject }}</span></p>
                  </div>
                </div>
                <div
                  v-if="item.showAttachment || item.description != null&&item.description !== ''"
                  class="content-detail-main">
                  <p class="cdm-title"><span class="pdf_font_24">{{ $t('remotePatrol.description') }}：</span></p>
                  <div v-if="item.showAudio" class="cdm-voice">
                    <div :class="isexportPDF ? 'pdf_speech_info' : 'speech-info'" @click="startSpeechFeedBacks(item,index)">
                      <i class="iconfont icon-yuyin icon-speech"/>
                    </div>
                    <audio :ref="item.audio.audioRef" @canplay="getFeedBacksDuration(item)">
                      <source :src="item.audio.audioSrc" type="audio/mpeg" >
                    </audio>
                    <span class="often-text">{{ item.audio.audioOftenText }}</span>
                  </div>
                  <div v-if="item.description !=null && item.description !=''" class="cdm-word">
                    <span class="pdf_font_24">{{ item.description }}</span>
                  </div>
                  <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="cdm-pic">
                    <div
                      v-for="(sourceitem,index) in item.sourceList"
                      :key="index"
                      :height="imgHeight+'px'"
                      class="source-details">
                      <div v-if="sourceitem.mediaType === 2" class="img-content">
                        <img
                          :title="imgTitle"
                          :style="isexportPDF ? 'width:260px;height:148px;' : 'width: calc(130/1920*100vw);'"
                          :src="sourceitem.url"
                          :height="imgHeight+'px'"
                          :onerror="deafultImg"
                          class="imgLittle imgInner"
                          @click="openOuter(sourceitem,$event)">
                      </div>
                      <div
                        v-if="sourceitem.mediaType === 1"
                        class="img-content "
                        @click="playCommentVideo(sourceitem,index)">
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                        <img
                          :style="isexportPDF?'width:260px;height:148px;':'width: calc(130/1920*100vw);'"
                          :src="videoImgSrc"
                          :height="imgHeight+'px'"
                          class="imgLittle">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col v-if="pageItem.class === 'row-table'">
          <table v-for="(s_item,s_index) in pageItem.data" :key="s_index" class="table table-bordered">
            <thead :class="hasChart ? 'pdf_font_20': 'pdf_font_16'">
              <tr v-if="s_item[0].type === 0">
                <th
                  v-for="(t_item ,t_index) in theaderPassFail"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
              <tr v-if="s_item[0].type === 1">
                <th
                  v-for="(t_item ,t_index) in theaderScore"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
              <tr v-if="s_item[0].type === 2">
                <th
                  v-for="(t_item ,t_index) in theaderOther"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
            </thead>
            <tbody :class="hasChart ? 'pdf_font_20': 'pdf_font_16'">
              <tr style="vertical-align:middle;">
                <td :rowspan="s_item.length+1" style="vertical-align:middle;">
                  <span v-if="s_item[0].type === 0">{{ $t('insSettingView.sheetpassfail') }}</span>
                  <span v-if="s_item[0].type === 1">{{ $t('insSettingView.sheetscore') }}</span>
                  <span v-if="s_item[0].type === 2">{{ $t('insSettingView.sheetother') }}</span>
                </td>
              </tr>
              <tr v-for="(item,index) in s_item" :key="index" :style="index%2!=0?{'background-color':'#F7F8FC'}:{}">
                <td style="word-break: keep-all;white-space:nowrap;"><span class="item-name">{{ item.groupName }}</span>
                  <span class="count-blag"><span class="pdf_font_16">{{ item.numOfTotalItems }}</span></span>
                </td>
                <td v-if="item.type === 0||item.type === 2"><span>{{ item.numOfQualifiedItems }}</span></td>
                <td v-if="item.type === 0||item.type === 2"><span>{{ item.numOfUnqualifiedItems }}</span></td>
                <td v-if="item.type === 1"><span>{{ item.totalScore }}</span></td>
                <td><span>{{ item.actualScore | filterScore }}</span></td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col
          v-if="pageItem.class === 'radior-content' && staticalConfig.chart"
          :style="isexportPDF ? 'height:450px;' : ''"
          class="pie-content">
          <span class="span-4"><span class="pdf_font_18">{{ $t('remotePatrol.scoreU') }}</span></span>
          <v-chart
            ref="chartRadar"
            :options="pageItem.data"
            :auto-resize="true"
            class="pie-chart-content"/>
        </el-col>
        <el-col
          v-if="pageItem.class === 'radior-content' && !staticalConfig.chart"
          :style="isexportPDF ? 'height:450px;' : ''"
          class="radar-content" >
          <span class="span-4"><span class="pdf_font_18">{{ $t('remotePatrol.scoreU') }}</span></span>
          <v-chart
            ref="chartRadar"
            :options="pageItem.data"
            :auto-resize="true"
            class="radar-chart-content"/>
        </el-col>
        <el-col v-if="pageItem.class === 'suggest' && pageItem.data !== null && pageItem.data.length !== 0">
          <div class="suggest-content">
            <span class="pdf_font_20">{{ $t('remotePatrol.advice') }}</span>
            <span class="pdf_font_20" v-html="turnSuggest(pageItem.data)"/>
          </div>
        </el-col>
        <el-col>
          <div v-if="pageItem.class === 'signature-detail'">
            <div
              :style="isexportPDF ? 'height:60px;line-height:60px' : ''"
              class="item-header"
              @click="hideOrShowDetail(pageItem, pageIndex)">
              <div class="icon-header">
                <i
                  :style="isexportPDF ? 'font-size:22px;' : ''"
                  :class="pageItem.ifExpand ? 'icon-zhedie1': 'icon-zhankai1'"
                  class="iconfont icontemp"/>
                <span class="title-lable"><span class="pdf_font_20">{{ $t(`remotePatrol.${pageItem.name}`) }}</span></span>
              </div>
            </div>
            <div v-if="pageItem.ifExpand" class="item-content">
              <div class="signature-details">
                <div
                  v-for="(signatureItem, signatureIndex) in pageItem.data"
                  :key="signatureIndex"
                  class="signature-item"
                  @click="displayEnlargeSignature(signatureItem.content)">
                  <img :src="signatureItem.content" class="signature-content">
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="!hasChart" :style="isexportPDF ? 'height:450px;' : 'height:0px;'" class="pie-content">
          <v-chart ref="chartRadar" :auto-resize="true" class="pie-chart-content"/>
        </el-col>
      </el-row>
      <div class="no-print">
        <el-dialog :visible.sync="downloadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
          <div class="body-content">
            <p>{{ $t('remotePatrol.downloading') }}</p>
          </div>
        </el-dialog>
      </div>
    </div>
    <el-dialog
      v-if="showSignatureFlag"
      :title="$t('eventView.view')"
      :visible.sync="showSignatureFlag"
      :close-on-click-modal="false"
      width="850px"
      top="12%">
      <div class="video-dialog-content" style="overflow:hidden;">
        <hr class="dialog-hr">
        <div class="dialog-source-content">
          <img :src="signatureSrc">
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ECharts from 'vue-echarts';
import { getInspectReportInfo, getInspectReportDetail } from '@/api/inspect';
import util from '@/common/util';
import videojs from '../../../static/video.js';
import 'videojs-contrib-hls';
import resize from '@/components/mixins/echartResize.js'
import DelayButton from '@/components/DelayButton';
import ReportSetting from '@/api/reportSetting';
import SearchConditionUtil from '@/common/SearchConditionUtil';

export default {
  name: 'InspectReport',
  components: {
    DelayButton,
    'v-chart': ECharts
  },

  filters: {
    filterScore(value) {
      return value === Number.MAX_VALUE ? '--' : value;
    }
  },

  data() {
    return {
      templateList: [],
      templateConfig: [],
      curTemplateIndex: 0,
      accountName: '',
      reportId: 0,
      downloadProgress: false,
      hasAttachment: 0,
      varyWindowWidth: window.innerWidth,

      videoSrc: require('../../../static/img/monitor.png'),
      inspectSrc: require('../../../static/img/remote_patrol.png'),
      insiteInspectSrc: require('../../../static/img/onsite_patrol.png'),
      report: null,
      suggest: '',
      totalScore: '',
      theaderList: [
        {
          name: this.$t('remotePatrol.items')
        },
        {
          name: this.$t('remotePatrol.passItem')
        },
        {
          name: this.$t('remotePatrol.failedItem')
        }
      ],
      pass: this.$t('remotePatrol.pass'),
      failed: this.$t('remotePatrol.failed'),
      lang: this.$i18n.locale,
      isInsiteInspect: false,
      sidebarElm: null,
      isup: false,
      isexportPDF: false,
      groups: [],
      feedbacks: [],
      showFeedBacks: false,
      dialogCommentVideo: false,
      showOuter: false,
      showImg: false,
      checkImgSrc: '',
      previewplayer: '',
      imgTitle: '',
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
      deafultImg: 'this.src="' + require('../../../static/img/picture_failed.png') + '"',
      theaderPassFail: [
        { name: '', width: 'width:11%;', pdfWidth: 'width:12%;' },
        { name: this.$t('remotePatrol.item'), width: 'width:30%;', pdfWidth: 'width:35%;' },
        { name: this.$t('remotePatrol.pass'), width: 'width:16%;', pdfWidth: 'width:13%;' },
        { name: this.$t('remotePatrol.failed'), width: 'width:17%;', pdfWidth: 'width:13%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:17%;', pdfWidth: 'width:14%;' }
      ],
      theaderScore: [
        { name: '', width: 'width:11%;', pdfWidth: 'width:12%;' },
        { name: this.$t('remotePatrol.item'), width: 'width:30%;', pdfWidth: 'width:35%;' },
        { name: this.$t('remotePatrol.TableTotal'), width: 'width:25%;', pdfWidth: 'width:20%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:25%;', pdfWidth: 'width:20%;' }
      ],
      theaderOther: [
        { name: '', width: 'width:11%;', pdfWidth: 'width:12%;' },
        { name: this.$t('remotePatrol.item'), width: 'width:30%;', pdfWidth: 'width:35%;' },
        { name: this.$t('remotePatrol.pass'), width: 'width:16%;', pdfWidth: 'width:13%;' },
        { name: this.$t('remotePatrol.failed'), width: 'width:17%;', pdfWidth: 'width:13%;' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:17%;', pdfWidth: 'width:14%;' }
      ],
      showSignatureFlag: false,
      signatureSrc: '',
      staticalConfig: null,
      pageData: null,
      signaturesList: null,
      reportData: null,
      cachedTemplateId: -1,
      showAllDetailsEnable: true,
      hasChart: false
    };
  },

  computed: {
    reportImgHeight() {
      return (this.varyWindowWidth / 1920) * 100;
    },
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
    }
  },

  created() {
    this.getStoredTemplateId();
    this.getRouterData();
    this.getReportTemplateAndInfo();
  },

  mounted() {
    this.accountName = sessionStorage.getItem('accountName');
  },

  methods: {
    getReportTemplateAndInfo() {
      const templatePromise = ReportSetting.getInspectReportTemplateList({ enable: true });
      const reportInfoPromise = getInspectReportInfo({ reportIds: [this.report.reportId] });
      Promise.all([templatePromise, reportInfoPromise]).then(results => {
        this.getInspectTemplateList(results[0]);
        this.getReportInfo(results[1]);
      }).catch(err => {
        console.log('ReportDetail-getReportTemplateAndInfo:' + err);
      })
    },

    getInspectTemplateList(res) {
      if (res.errCode === 0 && res.data.length > 0) {
        this.templateList = res.data;
        const savedTemplateIndex = this.templateList.findIndex(item => { return item.id === this.cachedTemplateId; });
        this.curTemplateIndex = savedTemplateIndex !== -1 ? savedTemplateIndex : 0;
        this.setTemplateAndStaticalConfig();
      } else {
        this.templateList = [];
        this.templateConfig = [];
      }
    },

    setTemplateAndStaticalConfig() {
      this.templateConfig = this.templateList[this.curTemplateIndex].config.switches.filter(item => item.enable === true);
      util.sortArrayByKeyAsc(this.templateConfig, 'position');
      const chartOption = this.templateConfig.filter(item => item.name === 'statistics');
      this.staticalConfig = chartOption && chartOption.length > 0 ? chartOption[0] : {};
      this.showAllDetailsEnable = this.templateConfig.some(item => item.name === 'defaultAll');
    },

    getTemplateConfig(index) {
      this.curTemplateIndex = index;
      this.hasChart = false;
      this.setTemplateAndStaticalConfig();
      this.getPageDataBasedOnTemplate(this.reportData);
      this.saveTemplateId();
    },

    handleDown() {
      const self = this;
      if (self.hasAttachment !== 0) {
        self.downloadProgress = true;
      }
      var timer = setInterval(function() {
        if (document.readyState === 'complete') {
          new Promise(async function(resolve) {
            self.isup = true;
            self.pageData.forEach(item => {
              item.ifExpand = true;
            });
            self.isexportPDF = true;
            resolve(true);
          }).then(function() {
            self.$print(self.$refs.printPDF);
            setTimeout(() => {
              if (self.hasAttachment !== 0) {
                self.downloadProgress = false;
              }
            }, timer * 10);
            document.getElementById('isNeedRemove') && document.getElementById('isNeedRemove').remove();
            self.isexportPDF = false;
          });
          window.clearInterval(timer);
        }
      }, 500);
    },

    getRouterData() {
      const self = this;
      const routeData = JSON.parse(sessionStorage.getItem('report_data'));
      const obj = {};
      obj.reportId = routeData.id;
      obj.storeName = routeData.storeName;
      obj.status = routeData.status;
      obj.dateStr = util.getDateStr(routeData.ts);
      obj.submitterName = routeData.submitterName;
      obj.tagName = routeData.tagName;
      obj.iconSrc = this.getIconSrc(routeData.status);
      switch (routeData.mode) {
        case 0:
          obj.inspectSrc = self.inspectSrc;
          obj.inspectType = self.$t('overview.remotePatrol');
          break;
        case 1:
          obj.inspectSrc = self.insiteInspectSrc;
          self.isInsiteInspect = true;
          obj.inspectType = self.$t('overview.onsitePatrol');
          break;
        default:
          obj.inspectSrc = self.videoSrc;
          break;
      }
      self.report = obj;
    },

    getIconSrc(status) {
      const statusAndLangAndIconMap = [
        {
          status: 0,
          statusStr: this.$t('overview.danger'),
          children: [{
            'zh': require('../../../static/img/dangerous_cn.png'),
            'zhtw': require('../../../static/img/dangerous_tw.png'),
            'en': require('../../../static/img/dangerous_en.png'),
            'ja-JP': require('../../../static/img/dangerous_ja.png'),
            'ko-KR': require('../../../static/img/dangerous_ko.png')
          }]
        },
        {
          status: 1,
          statusStr: this.$t('overview.improve'),
          children: [{
            'zh': require('../../../static/img/improved_cn.png'),
            'zhtw': require('../../../static/img/improved_cn.png'),
            'en': require('../../../static/img/improved_en.png'),
            'ja-JP': require('../../../static/img/improved_ja.png'),
            'ko-KR': require('../../../static/img/improved_ko.png')
          }]
        },
        {
          status: 2,
          statusStr: this.$t('overview.pass'),
          children: [{
            'zh': require('../../../static/img/good_cn.png'),
            'zhtw': require('../../../static/img/good_cn.png'),
            'en': require('../../../static/img/good_en.png'),
            'ja-JP': require('../../../static/img/good_ja.png'),
            'ko-KR': require('../../../static/img/good_ko.png')
          }]
        }
      ];

      let iconSrc = '';
      const filterMap = statusAndLangAndIconMap.filter(map => map.status === status);
      if (filterMap.length > 0) {
        for (let lang in filterMap[0].children[0]) {
          if (lang === this.lang) {
            iconSrc = filterMap[0].children[0][lang];
          }
        }
      }
      console.log(iconSrc);
      return iconSrc;
    },

    getItemsPassOrFailed(groupType, grade, qualifiedScore) {
      if (grade === -1 << 31) {
        return 0; // ignored
      } else if (groupType === 0 || groupType === 2) {
        if (grade === 0) {
          return 1; // unqualified
        } else {
          return 2; // qualified
        }
      } else if (groupType === 1 && grade !== -1 << 31) {
        if (grade < qualifiedScore) {
          return 1; // unqualified
        } else {
          return 2; // qualified
        }
      }
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

    openOuter(item, $ev) {
      const self = this;
      if (item != null) {
        self.showOuter = true;
        self.checkImgSrc = item.url;
        self.showImg = true;
      }
    },

    getGroupsDuration(item) {
      const self = this;
      if (item.showAudio) {
        const audio = self.$refs[item.audio.audioRef][0];
        let du = audio.duration;
        if (isNaN(du)) {
          item.showAudio = false;
        } else {
          const duration = Math.floor(du);
          if (duration === 0) {
            du = 1;
          }
          item.audio.audioOftenText = parseInt(du) + '"';
        }
      }
    },

    getFeedBacksDuration(item) {
      const self = this;
      if (item.showAudio) {
        const audio = self.$refs[item.audio.audioRef][0];
        let du = audio.duration;
        if (isNaN(du)) {
          item.showAudio = false;
        } else {
          const duration = Math.floor(du);
          if (duration === 0) {
            du = 1;
          }
          item.audio.audioOftenText = parseInt(du) + '"';
        }
      }
    },

    startSpeechItem(item, index) {
      const self = this;
      if (!item.audio.isPlaying) {
        self.$refs[item.audio.audioRef][0].play();
        item.audio.isPlaying = true;
      } else {
        self.$refs[item.audio.audioRef][0].pause();
        item.audio.isPlaying = false;
      }
      self.groups.forEach((groupitem) => {
        groupitem.items.forEach((_item, _index) => {
          if (_item.audio !== undefined) {
            if (_index !== index) {
              if (self.$refs[_item.audio.audioRef] !== undefined) {
                self.$refs[_item.audio.audioRef][0].pause();
                _item.audio.isPlaying = false;
              }
            }
          }
        });
      });
    },

    startSpeechFeedBacks(item, index) {
      const self = this;
      if (!item.audio.isPlaying) {
        self.$refs[item.audio.audioRef][0].play();
        item.audio.isPlaying = true;
      } else {
        self.$refs[item.audio.audioRef][0].pause();
        item.audio.isPlaying = false;
      }
      self.feedbacks.forEach((_item, _index) => {
        if (_item.audio !== undefined) {
          if (_index !== index) {
            if (self.$refs[_item.audio.audioRef] !== undefined) {
              self.$refs[_item.audio.audioRef][0].pause();
              _item.audio.isPlaying = false;
            }
          }
        }
      });
    },

    async getReportInfo(res) {
      if (res.errCode === 0 && res.data.length > 0) {
        const data = res.data[0].info;
        this.totalScore = data.totalScore;
        this.signaturesList = this.isInsiteInspect && data.signatures ? data.signatures : [];
        this.getGroupsData(data.groups);
        this.reportData = data;
        this.getPageDataBasedOnTemplate(this.reportData);
      }
    },

    getGroupsData(groups) {
      const temp = [];
      groups.sort((a, b) => { return a.groupType - b.groupType; });
      groups.forEach((groupitem, groupindex) => {
        const obj = {
          items: []
        };
        obj.groupId = groupitem.groupId;
        obj.groupName = groupitem.groupName;
        obj.groupType = groupitem.groupType;
        groupitem.items.forEach((item, index) => {
          const details = {};
          details.subject = item.subject;
          details.comment = item.comment;
          details.description = item.description;
          details.grade = item.grade;
          details.qualifiedScore = item.qualifiedScore;
          details.itemScore = item.itemScore;
          details.passOfFailFlag = this.getItemsPassOrFailed(groupitem.groupType, item.grade, item.qualifiedScore);
          if (item.attachment.length !== 0) {
            const _temp = [];
            const audioObj = {};
            this.hasAttachment++;
            details.showAttachment = true;
            item.attachment.forEach((_item, _index) => {
              if (_item.mediaType === 0) {
                audioObj.audioSrc = _item.url;
                audioObj.audioRef = 'audioRef' + groupindex + index + _index;
                audioObj.isPlaying = false;
                audioObj.audioOftenText = '';
                details.showAudio = true;
              } else {
                _temp.push(_item);
              }
            });
            details.audio = audioObj;
            details.sourceList = _temp;
          } else {
            details.showAttachment = false;
          }
          obj.items.push(details);
        });
        temp.push(obj);
      });
      this.groups = temp;
    },

    getPageDataBasedOnTemplate(data) {
      const map = this.getDetailNameAndHandlerMap();
      this.sortArrayByKey(this.templateConfig, 'position');
      const pageData = [];
      console.log(this.templateConfig);
      this.templateConfig.forEach(config => {
        if (map.has(config.name)) {
          const fnName = map.get(config.name);
          const returnDataJson = this[fnName](data);
          returnDataJson.name = config.name;
          pageData.push(returnDataJson);
        }
      });
      if (this.showAllDetailsEnable) {
        pageData.push(pageData.shift(pageData.length - 1));
        this.getFeedbacks(data);
      }
      if (this.isInsiteInspect && this.signaturesList.length > 0) {
        const signatureObj = { name: 'signature', class: 'signature-detail', ifExpand: false, data: this.signaturesList };
        pageData.push(signatureObj);
      }
      this.pageData = pageData;
    },

    getDetailNameAndHandlerMap() {
      let map = null;
      if (this.showAllDetailsEnable) {
        map = new Map([
          ['comment', 'getComment'],
          ['statistics', 'getOptions'],
          ['summaryTable', 'getTableData'],
          ['defaultAll', 'getReportDetail']
        ]);
      } else {
        map = new Map([
          ['comment', 'getComment'],
          ['statistics', 'getOptions'],
          ['summaryTable', 'getTableData'],
          ['feedbackItem', 'getFeedbacks'],
          ['focalItem', 'getFocalItems'],
          ['qualifiedItem', 'getQualifiedItems'],
          ['ignoredItem', 'getIgnoreItems']
        ]);
      }
      return map;
    },

    sortArrayByKey(sortedArray, key) {
      sortedArray.sort((a, b) => { return a[key] - b[key]; });
    },

    sortArrayByKeyDesc(key) {
      return function(a, b) {
        if (a[key] > b[key]) {
          return -1;
        } else if (a[key] < b[key]) {
          return 1;
        }
        return 0;
      };
    },
    getComment(data) {
      const suggest = data.comment;
      return { class: 'suggest', data: suggest };
    },

    getTableData(data) {
      const summary = data.summary;
      const te_temp = [];
      for (let i = 0; i < 3; i++) {
        const typeIndex = summary.filter(x => x.type === i);
        if (typeIndex.length !== 0) {
          typeIndex[0].type === 0 ? te_temp.push(typeIndex) : '';
          typeIndex[0].type === 1 ? te_temp.push(typeIndex) : '';
          typeIndex[0].type === 2 ? te_temp.push(typeIndex) : '';
        }
      }
      return { class: 'row-table', data: te_temp };
    },

    getReportDetail() {
      const allReportDetails = this.getGroupsItems(-1);
      return { class: 'row-detail', ifExpand: false, itemCount: -1, data: allReportDetails };
    },

    getOptions(data) {
      this.hasChart = true;
      const options = this.getStaticOptions(data.summary);
      return { class: 'radior-content', data: options };
    },

    getStaticOptions(summary) {
      return this.staticalConfig.chart === 0 ? this.getRadarChart(summary) : this.getPieChart(summary);
    },

    getFeedbacks(data) {
      const feedbackTemp = [];
      if (data.feedback.length === 0) {
        this.showFeedBacks = false;
      } else {
        this.showFeedBacks = true;
        data.feedback.forEach((item, index) => {
          const obj = {};
          obj.subject = item.subject;
          obj.description = item.description;
          if (item.attachment.length !== 0) {
            const _temp = [];
            const audioObj = {};
            this.hasAttachment++;
            obj.showAttachment = true;
            item.attachment.forEach((_item, _index) => {
              if (_item.mediaType === 0) {
                audioObj.audioSrc = _item.url;
                audioObj.audioRef = 'audioRef' + index;
                audioObj.isPlaying = false;
                audioObj.audioOftenText = '';
                obj.showAudio = true;
              } else {
                _temp.push(_item);
              }
            });
            obj.audio = audioObj;
            obj.sourceList = _temp;
          } else {
            obj.showAttachment = false;
          }
          feedbackTemp.push(obj);
        });
        this.feedbacks = feedbackTemp;
      }
      return { class: 'feedback-detail', ifExpand: false, itemCount: this.feedbacks.length, data: this.feedbacks };
    },

    getFocalItems() {
      const focalItems = this.getGroupsItems(1);
      let focalCount = 0;
      focalItems.forEach(item => { focalCount += item.cateryItems.length; });
      return { class: 'row-detail', ifExpand: false, itemCount: focalCount, data: focalItems };
    },

    getQualifiedItems() {
      const qualifiedItems = this.getGroupsItems(2);
      let qualifiedCount = 0;
      qualifiedItems.forEach(item => { qualifiedCount += item.cateryItems.length; });
      return { class: 'row-detail', ifExpand: false, itemCount: qualifiedCount, data: qualifiedItems };
    },

    getIgnoreItems() {
      const ignoreItems = this.getGroupsItems(0);
      let ignoreCount = 0;
      ignoreItems.forEach(item => { ignoreCount += item.cateryItems.length; });
      return { class: 'row-detail', ifExpand: false, itemCount: ignoreCount, data: ignoreItems };
    },

    getRadarChart(summary) {
      const self = this;
      const options = self.getRadarChartOption();
      const tempIndicator = [];
      const seriesValue = [];
      summary.forEach((item, index) => {
        const obj = {};
        obj.name = item.groupName;
        obj.max = Number(item.numOfQualifiedItems + item.numOfUnqualifiedItems) === 0
          ? 1 : Number(item.numOfQualifiedItems + item.numOfUnqualifiedItems);
        if (index < 2) {
          tempIndicator.push(obj);
          this.staticalConfig.qualified ? seriesValue.push(item.numOfUnqualifiedItems)
            : seriesValue.push(item.numOfQualifiedItems);
        } else {
          tempIndicator.splice(1, 0, obj);
          this.staticalConfig.qualified ? seriesValue.splice(1, 0, item.numOfUnqualifiedItems)
            : seriesValue.splice(1, 0, item.numOfQualifiedItems);
        }
      });
      const temp = [];
      const obj = { value: seriesValue };
      temp.push(obj);
      options.radar[0].indicator = tempIndicator;
      options.radar[1].indicator = tempIndicator;
      options.series[0].data = temp;
      options.series[1].data = temp;
      if (tempIndicator.length < 6) {
        options.radar.splitNumber = tempIndicator.length;
      } else {
        options.radar.splitNumber = 5;
      }
      return options;
    },

    getRadarChartOption() {
      const radarChartOption = {
        backgroundColor: '#fff',
        tooltip: {
          backgroundColor: 'rgba(30,34,52,0.75)',
          position: function(point) {
            return [point[0], '10%'];
          }
        },
        textStyle: {
          fontFamily: 'Roboto, Microsoft YaHei'
        },
        legend: {
          data: ['inspect radar']
        },
        radar: [
          {
            indicator: [],
            nameGap: 5,
            center: ['50%', '50%'],
            name: {
              textStyle: {
                color: '#7d8cad',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            splitArea: {
              show: false
            }
          },
          {
            indicator: [],
            center: ['50%', '50%'],
            name: {
              textStyle: {
                color: 'rgba(255,255,255,0)',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [{
          type: 'radar',
          data: []
        },
        {
          type: 'radar',
          data: [],
          name: this.$t('remotePatrol.category'),
          radarIndex: 1,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#FDBA40',
                width: 4
              },
              areaStyle: {
                color: '#D7E5FD'
              }
            }
          },
          tooltip: {
            trigger: 'item'
          }
        }
        ]
      };
      return radarChartOption;
    },

    getPieChart(summary) {
      const pieOptions = this.getPieChartsOption();
      let otherUnqualified = 0;
      let otherQualified = 0;
      this.staticalConfig.qualified ? summary.sort(this.sortArrayByKeyDesc('numOfUnqualifiedItems'))
        : summary.sort(this.sortArrayByKeyDesc('numOfQualifiedItems'));
      const summaryTempArr = [];
      for (let summaryIndex = 0; summaryIndex < summary.length; summaryIndex++) {
        if (summaryIndex < 10) {
          summaryTempArr.push(summary[summaryIndex]);
        } else {
          otherUnqualified += summary[summaryIndex].numOfUnqualifiedItems;
          otherQualified += summary[summaryIndex].numOfQualifiedItems;
        }
      }
      if (otherUnqualified !== 0 || otherQualified !== 0) {
        const otherItems = { numOfUnqualifiedItems: otherUnqualified,
          numOfQualifiedItems: otherQualified, groupName: this.$t('titleView.others') };
        summaryTempArr.push(otherItems);
      }
      const seriesData = [];
      summaryTempArr.forEach(item => {
        const obj = {};
        obj.name = item.groupName;
        obj.value = this.staticalConfig.qualified ? item.numOfUnqualifiedItems : item.numOfQualifiedItems;
        obj.value > 0 && seriesData.push(obj);
      });
      pieOptions.series[1].data = seriesData;
      return pieOptions;
    },

    getPieChartsOption() {
      const pieOption = {
        series: [
          {
            type: 'pie',
            radius: ['43%', '70%'],
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorList = ['#f4f5f9'];
                  return colorList[params.dataIndex];
                }
              }
            },
            silent: true,
            z: 0,
            data: [{ value: 1, name: '' }]
          },
          {
            type: 'pie',
            radius: ['50%', '60%'],
            emphasis: {
              label: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  const colorList = ['#6184CE', '#7B9FEB', '#7BD8EB', '#4DE197', '#ACF757',
                    '#F7D057', '#FF986E', '#EC5F55', '#A156C5', '#ACABAB'];
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              fontSize: 14,
              color: '#9A9A9C',
              formatter: '{b}-{d}%'
            },
            labelLine: {
              length: 10,
              length2: 50,
              lineStyle: {
                color: '#9A9A9C'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}-{d}%'
            },
            z: 1,
            data: []
          }
        ]
      };
      return pieOption;
    },

    getGroupsItems(status) {
      const group = [];
      this.groups.forEach(groupItem => {
        const tempGroupItem = {};
        tempGroupItem.groupId = groupItem.groupId;
        tempGroupItem.groupName = groupItem.groupName;
        tempGroupItem.groupType = groupItem.groupType;
        tempGroupItem.cateryItems = [];
        groupItem.items.forEach(inspectItem => {
          if (status >= 0) {
            if (inspectItem.passOfFailFlag === status) {
              tempGroupItem.cateryItems.push(inspectItem);
            }
          } else {
            tempGroupItem.cateryItems.push(inspectItem);
          }
        });
        if (tempGroupItem.cateryItems.length > 0) {
          group.push(tempGroupItem);
        }
      });
      return group;
    },

    turnSuggest(data) {
      return data.replace(/(\r\n|\n|\r)/gm, '<br/>');
    },

    displayEnlargeSignature(src) {
      this.showSignatureFlag = true;
      this.signatureSrc = src;
    },

    hideOrShowDetail(pageItem, pageIndex) {
      this.pageData.forEach((item, index) => {
        pageIndex === index && (item.ifExpand = !item.ifExpand);
      });
    },

    saveTemplateId() {
      const params = {
        templateId: this.templateList[this.curTemplateIndex].id
      };
      const searchConditon = {
        path: 'reportDetail',
        params: params
      };
      SearchConditionUtil.saveSearchCondition(searchConditon);
    },

    getStoredTemplateId() {
      const templateJson = SearchConditionUtil.getSearchCondition('reportDetail');
      if (Object.keys(templateJson).length > 0) {
        this.cachedTemplateId = templateJson.templateId;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
  @media print {
    .details{page-break-inside:avoid;}
    .content-detail-title{ page-break-inside:avoid;}
    .cdm-title{ page-break-inside:avoid;}
    .cdm-voice{ page-break-inside:avoid;}
    .cdm-word{ page-break-inside:avoid;}
    .cdm-pic{ page-break-inside:avoid;}
    .pdf_font_16{font-size: 16px;}
    .pdf_font_18{font-size: 20px;}
    .pdf_font_20{font-size: 20px;}
    .pdf_font_24{font-size: 20px;}
    .pdf_font_26{font-size: 26px;}
    .pdf_font_36{font-size: 36px;}
    .title2_pdf{color:#182752;line-height:45px;}
  }
  $red: #f31d65;
  $black: #182752;
  $border: #e3e9f4;
  $background: #f4f5f9;
  $tab: #7d8cad;
  $h1: #292e36;
  $qualified: #6097F3;
  $noqualied: #FDBA40;
  $suggestBack: #F1F6FE;
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
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
  .report-container {
    width: 100%;
    height: 100%;
    color: $black;
    position: relative;
    // border: 1px solid $border;
    border: 1px solid #fff;
    background-color: #fff;
    .report-img {
      position: absolute;
      right: 2px;
      top: 2px;
    }
    .el-header {
      width: 100%;
      height: 80px;
      text-align: left;
      line-height: 80px;
      padding-left: calc(30 / 1920 * 100vw);
      position: relative;
      display: flex;
      align-items: center;
      .pdf-title-icon{
        width:46px;
        height:54px;
        vertical-align: middle;
      }
      .title-icon{
        width:26px;
        height:34px;
      }
      .pdf-report-title{
        font-size: 30px;
        font-weight: bold;
        margin:0;
        vertical-align: middle;
        display: inline-block;
        margin-left: 20px;
        width:900px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .report-title {
        font-size: calc(20 / 1920 * 100vw);
        font-weight: bold;
        margin:0;
        display: inline-block;
        margin-left: calc(20 / 1920 * 100vw);
      }
      .nochart-report-title{
        font-size: 20px;
      }
      .info-content {
        position: absolute;
        right: calc(110 / 1920 * 100vw);
        top: 0;
        font-size: calc(12 / 1920 * 100vw);
        color: $tab;
        .info-label {
          margin-left: calc(40 / 1920 * 100vw);
        }
        .pdf-info-value{
          margin-right: 40px;
        }
        .exportbtn{
          display: inline-block;
          min-width:120px;
        }
      }
    }
    .el-acticle {
      text-align: left;
      padding-left: calc(40 / 1920 * 100vw);
      padding-right: calc(40 / 1920 * 100vw);
      .template-list{
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .suggest {
        margin-top: 20px;
        font-size: calc(14 / 1920 * 100vw);
        font-weight: bold;
        background-color: $suggestBack;
        color: $qualified;
        max-height: 100px;
        height: auto;
        overflow-y: auto;
        .suggest-content {
          display: flex;
          padding-left: calc(30 / 1920 * 100vw);
          border: 1px solid #a0c1f8;
        }
        span:first-child {
          padding-right: 20px;
        }
        span:last-child{
          flex:1;
          min-width:200px;
          word-wrap: break-word;
        }
      }
      .header-score{
        margin-bottom: 10px;
        font-weight: bold;
        .span-1{
          font-size: calc(14/1920*100vw);
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
      .pie-content {
        height: 300px;
        position: relative;
        .span-4{
          position: absolute;
          font-weight: 400;
          color: $tab;
          font-size: calc(12/1920*100vw);
          top: 0;
          right: 0;
          z-index: 2;
        }
        .pie-chart-content {
          width: 1000px;
          margin:0 auto;
          height: 100%;
        }
      }
      .radar-content {
        height: 300px;
        position: relative;
        margin-top: 20px;
        .span-4{
          position: absolute;
          font-weight: 400;
          color: $tab;
          font-size: calc(12/1920*100vw);
          top: 0;
          right: 0;
          z-index: 2;
        }
        .radar-chart-content {
          width: 1000px;
          margin:0 auto;
          height: 100%;
        }
      }
      .report-content {
        margin-top: 15px;

        .report-table {
          font-size: calc(14 / 1920 * 100vw);
          padding-left: calc(40/1920*100vw);
          .header-score{
            margin-bottom: 10px;
            font-weight: bold;
              .span-1{
                  font-size: calc(14/1920*100vw);
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
          th {
            color: $tab;
            background-color: $background;
            text-align: center;
            border-bottom-width: 1px;
            padding: 0.5rem;
            &:first-child {
              width: 55%;
            }
            &:not(:first-child) {
              width: 15%;
              text-align: left;
              padding-left: 1rem;
            }
          }
          td {
            color: $black;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            padding-left: 1rem;
          }
          .icon-td {
            text-align: center;
          }
          .icon-content {
            text-align: left;
            margin-left: 10%;
          }
          .icon-blag {
            display: inline-block;
            width: 80px;
            padding: 3px 6px;
            text-align: center;
            color: #fff;
            font-size: calc(12 / 1920 * 100vw);
            margin-right: calc(40 / 1920 * 100vw);
          }
        }
      }
      .row-table{
        margin-top: 10px;
        font-size: calc(14/1920*100vw);
        .table-bordered{
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
          th{
              color: $tab;
              text-align: left;
              background-color: $background;
              border-bottom-width: 1px;
              padding: 0.5rem;
              // width: 10%;
              padding-left: 1rem;
            border: 1px solid #dee2e6;
          }
          td{
              color: $black;
              padding-top:0.5rem;
              padding-bottom: 0.5rem;
              padding-left: 1.2rem;
              text-align: left;
              font-weight: bold;
            border: 1px solid #dee2e6;
          }
          .count-blag{
              padding: 2px 12px;
              width: auto;
              height: auto;
              border-radius: 10px;
              background-color: #D4DBE5;
              color: $tab;
              font-size: 12px;
              margin-right: calc(20/1920*100vw);
              float:right;
          }
          .icon-blag{
              display: inline-block;
              width: 80px;;
              padding:3px 6px;
              text-align: center;
              color: #fff;
              font-size: 12px;
              font-weight: normal;
          }
      }
      }
      .row-footer {
        padding-top: calc(30 / 1920 * 100vw);
        padding-bottom: calc(30 / 1920 * 100vw);
        margin-top: calc(10 / 1920 * 100vw);
        .details-content {
          padding-right: calc(20 / 1920 * 100vw);
          &:first-child{
            border-top: 1px solid $border;
          }
          &:last-child {
            padding-right: 0;
          }
        }

      }
      .row-detail{
        margin-bottom: 20px !important;
        margin-top: 20px;
        .item-header{
            position: relative;
            background-color: $background;
            height: 40px;
            line-height: 40px;
            border: 1px solid $border;
            padding-left: calc(20 / 1920 * 100vw);
            cursor: pointer;
          display: flex;
          padding-right: calc(20 / 1920 * 100vw);
          justify-content: space-between;
          .icontemp {
              font-size: calc(14 / 1920 * 100vw);
              margin-right: calc(15 / 1920 * 100vw);
            }
          .title-lable {
            font-size: calc(14 / 1920 * 100vw);
            font-weight: bold;
          }
          .count {
            font-size: calc(30 / 1920 * 100vw);
          }
          .blag {
            font-size: calc(12 / 1920 * 100vw);
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
            border-left:4px solid #eb1d63;
            font-size: calc(14 / 1920 * 100vw);
            color:#7d8cad;
            padding-left:calc(20 / 1920 * 100vw);
            font-weight: bold;
          }
          .content-detail{
            margin-top: 10px;
            .content-detail-title{
              min-height:70px;
              background-color:$background;
              padding-left:calc(20 / 1920 * 100vw);
              padding-right: calc(20 / 1920 * 100vw);
              padding-top:10px;
              padding-bottom: 10px;
              display: flex;
              justify-content: space-between;
              .ignore-btn{
                width:50px;
                height:24px;
                background-color: #434c5e;
                font-size: 12px;
                color:#ffffff;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 5px;
              }
              .title-btn-failed{
                height:25px;
                background-color: #fcba3f;
                font-size:12px;
                color:#ffffff;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 20px;
              }
              .title-btn-pass{
                height:25px;
                background-color: #2AC25D;
                font-size:12px;
                color:#ffffff;
                font-weight: bold;
                line-height: 25px;
                text-align: center;
                border-radius: 20px;
              }
              .detail-title{
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
                }
              }
              .score-title{
                display: inline-flex;
                flex-direction: column;
                width: 100px;
                align-items: center;
              }
              .total-score{
                text-align: center;
                font-size: 12px;
                color: $black;
                margin-top: 4px;
              }
            }
            .content-detail-main{
              padding-top: 10px;
              padding-left:calc(20 / 1920 * 100vw);
              padding-right: calc(20 / 1920 * 100vw);
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
                .pdf_speech_info{
                  width:160px;
                  height:52px;
                  background-color: #FFEDED;
                  color: $red;
                  border: 1px solid #FEC0C7;
                  border-radius:30px;
                  display: inline-block;
                  .icon-speech{
                      font-size:26px;
                      line-height:52px;
                      margin-left:10px;
                  }
                }
                .often-text{
                    @include point(margin-left,20);
                }
              }
              .cdm-pic{
                margin-top: 20px;
                overflow: hidden;
                .source-details{
                    display: inline-block;
                    .img-content{
                      margin-right: calc(10/1920*100vw);
                      margin-bottom: calc(10/1920*100vw);
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
                      }
                    }
                  @media screen and (min-width: 1280px) and(max-width: 1366px){
                    width: 90px;
                    .img-content .imgLittle{
                      width: 85px;
                    }
                  }
                }
              }
              .cdm-word{
                margin-top: 10px;
                font-size: calc(14 / 1920 * 100vw);
                color:#4b5262;
              }
            }
          }
        }
        &:first-child{
          margin-top: 20px;
        }
      }
      .signature-detail{
        @extend .row-detail;
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
    }
    .dialog-source-content{
      @include point(height,320);
      @include point(padding,20);

      img{
        height: 100%;
        width: 100%;
        object-fit: contain;
        user-select: none;
      }
    }
    >>> .el-dialog__footer{
      line-height: 24px;
      padding: 30px;
      padding-top: 20px;
      #cancelBtn{
        @include point(width,76);
        @include point(margin-right,20);
        background-color: #EAEDF2 !important;
        color: #708090 !important;
        font-size: 12px;
        line-height: 12px;
      }
      #confirmBtn{
        @include point(width,76);
        font-size: 12px;
        line-height: 12px;
      }
    }
    #previewVideo{
      @include point(min-width,450);
      @include point(min-height,360);
    }
  }
  .template-titles{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $border;
    padding-left: calc(40 / 1920 * 100vw);
    padding-right: calc(40 / 1920 * 100vw);
  }
  .names{
    display: flex;
    justify-content: flex-start;
  }
  .template-name{
    font-size: 14px;
    cursor: pointer;
    width: 120px;
    color: #7d8cad;
    padding: 15px calc(20/1920*100vw) 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .click-btn{
    color: $red;
    border-bottom: 4px solid $red;
  }
  .icon-zhedie1{
    color: $red;
  }
  .icon-zhankai1{
    color: $tab;
  }
  .details {
    position: relative;
    height: 320px;
    border: 1px solid $border;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .item-header {
      position: relative;
      background-color: $background;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid $border;
      padding-left: calc(20 / 1920 * 100vw);
      display: flex;
      align-items: center;
      .icontemp {
        font-size: calc(18 / 1920 * 100vw);
        margin-right: calc(15 / 1920 * 100vw);
        color: $tab;
      }
      .title-lable {
        font-size: calc(14 / 1920 * 100vw);
        font-weight: bold;
      }
      .count-content {
        position: absolute;
        right: calc(20 / 1920 * 100vw);
        top: 0;
        .count {
          font-size: calc(30 / 1920 * 100vw);
        }
        .blag {
          font-size: calc(12 / 1920 * 100vw);
        }
      }
    }

  }
  .signature-detail .item-content{
    padding-bottom: calc(20/1920*100vw);
  }
  .signature-details{
    display: flex;
    flex-wrap: nowrap;
    height: 150px;
    justify-content: flex-start;
    .signature-item{
      width: 200px;
      height: 100%;
      position: relative;
      cursor: pointer;
      border: 1px solid $border;
      margin-right: calc(30/1920*100vw);
      .signature-content{
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
  }
  .radior-content{
    padding-top: 30px;
  }
</style>
<style>
  .echarts {
    width: 100%;
    height: 100%;
  }

  .el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
