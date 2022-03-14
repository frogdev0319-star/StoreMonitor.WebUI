<template>
  <div ref="printPDF" class="report-container">
    <div style="display: none">
      <div class="no-print">
        <delay-button
          id="downloadPdf"
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
    <div class="el-header">
      <div class="left-header">
        <img :src="report.inspectSrc" :class="isexportPDF ? 'pdf-title-icon' : 'title-icon'">
        <p :class="{'pdf-report-title': isexportPDF, 'report-title': !isexportPDF, 'nochart-report-title': !hasChart}">
          {{ accountName + ' | ' + report.storeName+' '+report.tagName }}
          <span v-if="!isexportPDF">{{ ' ('+report.inspectType+')' }}</span>
        </p>
        <div class="spacer"></div>
        <span class="font-15">{{ $t('remotePatrol.getscore') }}：</span>
        <span class="font-score">
          {{ allRemarkItemsFlag ? '--' : totalScore }}
          <span class="font-score_count">{{ $t('remotePatrol.scorecount') }}</span>
        </span>
      </div>
      <div class="info-content">
        <div class="pdf_font_24">
            <span v-if="!isexportPDF" class="info-label">{{ $t('remotePatrol.submitter') }}</span>
            <span :class="isexportPDF ? 'pdf-info-value' : 'info-value'">{{ report.submitterName }}</span>
            <span v-if="!isexportPDF" class="info-label">{{ $t('remotePatrol.generateTime') }}</span>
            <span :class="isexportPDF ? 'pdf-info-value' : ''">{{ report.dateStr }}</span>
        </div>
        <div class="weather-content">
          <img v-if="weatherImg" class="weather-info-content" :src="weatherImg">
        </div>
        <div 
          style="margin-left: calc(20/1440*100vw)"
          class="status-tag"
          :style="{
            0: {'color':'#e22472','background-color':'#ffecf4'},
            1: {'color':'#f57848','background-color':'#ffefeb'},
            2: {'color':'#59ab22','background-color':'#e8f6de'}
          }[report.status]"
        >
          {{{
            0: $t('overview.danger'),
            1: $t('overview.improve'),
            2: $t('overview.echartGood')
          }[report.status]}}
        </div>
        <div v-if="standard!=-1" style="margin-left: calc(20/1440*100vw)" class="status-tag"
          :style="standard == 1 ? {'color':'#59ab22','background-color':'#e8f6de'}: {'color':'#f57848','background-color':'#ffefeb'}"
        >{{standard == 1 ? $t('remotePatrol.goalAchieved') : $t('remotePatrol.farBehind')}}</div>
      </div>
    </div>
    <div class="template-titles">
      <el-select 
        class="storevue-select"
        :value="curTemplateIndex" 
        @change="getTemplateConfig">
        <el-option
          v-for="(item,index) in templateList"
          :value="index"
          :key="index"
          :label="item.name"
        />
      </el-select>
    </div>
    <div class="el-acticle">
      <!-- <el-row class="report-content" v-if="standardMsg || checkinInfo">
        <el-col :span="24" class="">
          <div class="header-score">
            <div class="standard-btn">
              <div
                :class="{'up-to-standard': standard === 1, 'not-up-to-standard': standard === 0}"
                class="standard-name"> {{ standardMsg }}</div>
            </div>
            <div class="checkin-content">
              <div class="checkin-info-content"> {{ checkinInfo }}</div>
            </div>
            
          </div>
        </el-col>
      </el-row> -->
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
                <span class="title-lable"><span class="pdf_font_20">
                  {{ $t(`titleView.${pageItem.name}`) }}</span>
                </span>
              </div>
              <div v-if="pageItem.itemCount > -1" class="count-header">
                <span class="count"><span class="pdf_font_36">{{ pageItem.itemCount }}</span></span>
                <span class="blag"><span class="pdf_font_18">{{ $t('remotePatrol.unit') }}</span></span>
              </div>
            </div>
            <div v-if="pageItem.ifExpand" class="item-content">
              <div class="pdf_font_20">
                <div v-for="(item,index) in pageItem.data" :key="index" style="border-bottom:1px solid #f4f5f9;margin-bottom:20px;">
                  <div v-if="!item.children" class="content-title"><span class="pdf_font_20">{{ item.groupName }}</span></div>
                  <hr v-if="!item.children" class="hr-horizontal" />
                  <template v-if="!item.children">
                    <report-detail
                      :report-detail-data="item.cateryItems"
                      :is-export-pdf="isexportPDF"
                      :groups="groups"
                      :group-type="item.groupType"
                      :tab1-btn-arr="tab1BtnArr"
                      :tab3-btn-arr="tab3BtnArr"/>
                  </template>
                  <template v-else>
                    <div v-for="(child, childIndex) in item.children" :key="childIndex">
                      <div class="content-title"><span class="pdf_font_20">{{ `【${item.groupName}】 —【${child.groupName}】` }}</span></div>
                      <hr class="hr-horizontal" />
                      <report-detail
                        :report-detail-data="child.cateryItems"
                        :is-export-pdf="isexportPDF"
                        :groups="groups"
                        :group-type="item.groupType"
                        :tab1-btn-arr="tab1BtnArr"
                        :tab3-btn-arr="tab3BtnArr"/>
                    </div>
                  </template>
                </div>
                <div v-if="showFeedBacks && showAllDetailsEnable" style="margin-bottom:20px;">
                  <div class="content-title"><span class="pdf_font_20">
                    {{ $t('remotePatrol.feedbacks') }}</span></div>
                  <div v-for="(item,index) in feedbacks" :key="index" class="content-detail">
                    <div class="content-detail-title" style="background-color:#fff;min-height:30px;">
                      <div class="detail-title">
                        <p class="title1"><span class="pdf_font_20">{{ index+1 }}.{{ item.subject }}</span></p>
                      </div>
                    </div>
                    <div
                      v-if="item.showAttachment || item.description != null&&item.description !== ''"
                      class="content-detail-main">
                      <p class="cdm-title">
                        <span class="pdf_font_24">{{ $t('remotePatrol.description') }}：</span>
                      </p>
                      <div class="description-area">
                        <div style="min-width:50%;">
                          <audio-vue
                            v-if="item.showAudio"
                            :is-export-pdf="isexportPDF"
                            :audio-list = "item.audioList"
                          />
                          <description-text
                            v-if="item.descriptionList.length > 0"
                            :discription-list = "item.descriptionList"
                            class="description"/>
                        </div>
                        <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="cdm-pic" style="min-width:50%;">
                          <div
                            v-for="(sourceitem,index) in item.sourceList"
                            :key="index"
                            :height="elImgHeight"
                            class="source-details">
                            <div v-if="sourceitem.mediaType === 2" class="img-content">
                              <img
                                v-if="isexportPDF"
                                :style="exportImageStyle"
                                :src="sourceitem.url"
                                class="imgLittle imgInner">
                              <el-image
                                :style="isexportPDF ? exportImageStyle :imageStyle"
                                :src="sourceitem.url"
                                :preview-src-list="getImgList(index, item.sourceList)"
                                class="imgLittle imgInner"/>
                            </div>
                            <div
                              v-if="sourceitem.mediaType === 1"
                              class="img-content "
                              @click="playCommentVideo(sourceitem, index)">
                              <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                              <img
                                :style="isexportPDF ? exportImageStyle : imageStyle"
                                :src="videoImgSrc"
                                :height="elImgHeight"
                                class="imgLittle">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  v-if="item.showAttachment"
                  class="content-detail-main">
                  <p class="cdm-title"><span class="pdf_font_24">{{ $t('remotePatrol.description') }}：</span></p>
                  <div class="description-area">
                  <div style="min-width:50%;">
                    <audio-vue
                      v-if="item.showAudio"
                      :is-export-pdf="isexportPDF"
                      :audio-list="item.audioList"
                    />
                    <description-text
                      v-if="item.descriptionList.length > 0"
                      :discription-list = "item.descriptionList"/>
                  </div>
                  <div v-if="item.sourceList != null && item.sourceList.length !== 0" class="cdm-pic" style="min-width:50%;">
                    <div
                      v-for="(sourceitem,index) in item.sourceList"
                      :key="index"
                      :height="elImgHeight"
                      class="source-details">
                      <div v-if="sourceitem.mediaType === 2" class="img-content">
                        <img
                          v-if="isexportPDF"
                          :style="exportImageStyle"
                          :src="sourceitem.url"
                          class="imgLittle imgInner">
                        <el-image
                          v-else
                          :style="isexportPDF ? exportImageStyle :imageStyle"
                          :src="sourceitem.url"
                          :preview-src-list="getImgList(index, item.sourceList)"
                          class="imgLittle imgInner"/>
                      </div>
                      <div
                        v-if="sourceitem.mediaType === 1"
                        class="img-content "
                        @click="playCommentVideo(sourceitem,index)">
                        <img :src="startIcon" :height="imgHeight*0.4+'px'" class="start-icon">
                        <img
                          :style="isexportPDF?'width:260px;height:148px;':'width: calc(130/1920*100vw);'"
                          :src="videoImgSrc"
                          :height="elImgHeight"
                          class="imgLittle">
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col v-if="pageItem.class === 'row-table'">
          <table v-for="(tableItem, tableIndex) in pageItem.data" :key="tableIndex" class="table table-bordered">
            <thead :class="hasChart ? 'pdf_font_20': 'pdf_font_16'">
              <tr v-if="tableItem[0].type === 0">
                <th
                  v-for="(t_item ,t_index) in theaderPassFail"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
              <tr v-if="tableItem[0].type === 1">
                <th
                  v-for="(t_item ,t_index) in theaderScore"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }} </th>
              </tr>
              <tr v-if="tableItem[0].type === 2">
                <th
                  v-for="(t_item ,t_index) in theaderOther"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}</th>
              </tr>
            </thead>
            <template v-for="(categoryItem, categoryIndex) in tableItem">
              <tbody v-if="categoryItem.children.length>1" :key="categoryIndex" :class="hasChart ? 'pdf_font_20': 'pdf_font_16'" class="pdf_font_20">
                <tr style="vertical-align:middle;">
                  <td :rowspan="categoryItem.children.length + 1" style="vertical-align:middle;">
                    <span>{{ categoryItem.groupName }}</span>
                  </td>
                </tr>
                <tr
                  v-for="(subcategory,subcategoryIndex) in categoryItem.children"
                  :key="subcategoryIndex"
                  :style="subcategoryIndex%2!=0?{'background-color':'#F7F8FC'}:{}">
                  <td style="word-break: keep-all;white-space:nowrap;">
                    <span class="item-name">{{ subcategory.groupName }}</span>
                    <span class="count-blag"><span class="pdf_font_16">{{ subcategory.numOfTotalItems }}</span></span>
                  </td>
                  <td v-if="subcategory.type === 0||subcategory.type === 2"><span>{{ subcategory.numOfQualifiedItems }}</span></td>
                  <td v-if="subcategory.type === 0||subcategory.type === 2"><span>{{ subcategory.numOfUnqualifiedItems }}</span></td>
                  <td v-if="subcategory.type === 1"><span>{{ subcategory.totalScore }}</span></td>
                  <td><span>{{ subcategory.actualScore | filterScore }}</span></td>
                </tr>
              </tbody>
              <tbody v-else :key="categoryIndex" :class="hasChart ? 'pdf_font_20': 'pdf_font_16'" class="pdf_font_20">
                <tr
                  v-for="(subcategory,subcategoryIndex) in categoryItem.children"
                  :key="subcategoryIndex"
                  :style="subcategoryIndex%2!=0?{'background-color':'#F7F8FC'}:{}">
                  <td style="word-break: keep-all;white-space:nowrap;">
                    <span class="item-name">{{ subcategory.groupName }}</span>
                    <span class="count-blag"><span class="pdf_font_16">{{ subcategory.numOfTotalItems }}</span></span>
                  </td>
                  <td style="vertical-align:middle;"><span class="item-name">-</span></td>
                  <td v-if="subcategory.type === 0||subcategory.type === 2"><span>{{ subcategory.numOfQualifiedItems }}</span></td>
                  <td v-if="subcategory.type === 0||subcategory.type === 2"><span>{{ subcategory.numOfUnqualifiedItems }}</span></td>
                  <td v-if="subcategory.type === 1"><span>{{ subcategory.totalScore }}</span></td>
                  <td><span>{{ subcategory.actualScore | filterScore }}</span></td>
                </tr>
              </tbody>
            </template>
          </table>
        </el-col>
        <template v-if="pageItem.class === 'radior-content' && pageItem.data">
          <el-col
            v-if="staticalConfig.chart"
            :style="isexportPDF ? 'height:450px;' : ''"
            class="pie-content">
            <span class="span-4"><span class="pdf_font_18">{{ $t('remotePatrol.scoreU') }}</span></span>
            <div class="pie-area">
              <div 
              :style="isexportPDF ? 'margin-left:250px;' : ''"
              class="pie-div">
                <div class="pct-panel"
                :style="isexportPDF ? {'width': '145px', 'height': '175px'}: {'width': '290px', 'height': '350px'}"
                 >
                    <v-chart
                        ref="pieChartRef"
                        :auto-resize="true"
                        :options="pageItem.data"
                        class="pie-chart-content"
                    />
                </div>
              </div>
              <div class="spacer">
                <div v-for="(item,index) in chartLabelArr" :key="index">
                  <div class="pie-label-area">
                      <div class="pie-color" :style="{backgroundColor:pieColorList[index]}"></div>
                      <div class="pei-item-name">{{item.name}}</div>
                      <div class="pei-item-num">{{item.value}}%</div>
                  </div>
                </div> 
              </div>
            </div>
          </el-col>
          <el-col
            v-if="!staticalConfig.chart"
            :style="isexportPDF ? 'height:450px;' : ''"
            class="radar-content">
            <span class="span-4"><span class="pdf_font_18">{{ $t('remotePatrol.scoreU') }}</span></span>
            <div class="radar-area">
              <div 
              :style="isexportPDF ? 'margin-left:250px;' : ''"
              class="radar-div">
                <div class="pct-panel"
                :style="isexportPDF ? {'width': '145px', 'height': '175px'}: {'width': '290px', 'height': '350px'}"
                >
                <v-chart
                  v-if="pageItem.data"
                  ref="chartRadar"
                  :options="pageItem.data"
                  :auto-resize="true"
                  class="radar-chart-content"/>
                  </div>
              </div>
              <div class="radar-label" >
                <div style="margin-left:16px;color:#484848;font-size:15px;line-height:20px">{{$t('remotePatrol.category')}}</div>
                <div v-for="(item,index) in chartLabelArr" :key="index">
                  <div class="radar-label-area">
                      <div class="radar-item-name">{{item.name}}</div>
                      <div class="radar-item-num">{{item.value}}</div>
                  </div>
                </div> 
              </div>
            </div> 
          </el-col>
        </template>

        <el-col v-if="pageItem.class === 'suggest'">
          <div v-if="pageItem.data !== null && pageItem.data.length !== 0" class="suggest-content">
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
                <span class="title-lable"><span class="pdf_font_20">
                  {{ $t(`remotePatrol.${pageItem.name}`) }}</span>
                </span>
              </div>
            </div>
            <div v-if="pageItem.ifExpand" class="item-content">
              <div class="signature-details">
                <div
                  v-for="(signatureItem, signatureIndex) in pageItem.data"
                  :key="signatureIndex"
                  class="signature-item">
                  <img
                    v-if="isexportPDF"
                    :style="exportImageStyle"
                    :src="signatureItem.content"
                    class="signature-content">
                  <el-image
                    v-else
                    :src="signatureItem.content"
                    :preview-src-list="getSignatureList(signatureIndex, pageItem.data)"
                    class="signature-content"/>
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
        <el-dialog :visible.sync="downloadProgress" :close-on-click-modal="false" width="510px" top="35vh" left="40vh" class="AddSumupLoad">
          <div class="body-content">
            <p>{{ $t('remotePatrol.downloading') }}</p>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import ECharts from 'vue-echarts';
import { getInspectReportInfo } from '@/api/inspect';
import util from '@/common/util';
import videojs from '../../../static/video.js';
import 'videojs-contrib-hls';
import DelayButton from '@/components/DelayButton';
import ReportSetting from '@/api/reportSetting';
import SearchConditionUtil from '@/common/SearchConditionUtil';
import AudioVue from '@/components/AudioVue';
import ReportDetail from '@/components/ReportDetail';
import DescriptionText from '@/components/DescriptionText';
import echartResize from '@/components/mixins/echartResize';
import i18n from '@/lang/index';

export default {
  name: 'InspectReport',
  components: {
    DescriptionText,
    ReportDetail,
    AudioVue,
    DelayButton,
    'v-chart': ECharts
  },

  filters: {
    filterScore(value) {
      return value === Number.MAX_VALUE ? '--' : value;
    }
  },

  mixins: [echartResize],

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
      previewplayer: '',
      startIcon: require('../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../static/img/video_thumbnail.png'),
      deafultImg: 'this.src="' + require('../../../static/img/picture_failed.png') + '"',
      theaderPassFail: [],
      theaderScore: [],
      theaderOther: [],
      showSignatureFlag: false,
      signatureSrc: '',
      staticalConfig: null,
      pageData: null,
      signaturesList: null,
      reportData: null,
      cachedTemplateId: -1,
      showAllDetailsEnable: true,
      tab1BtnArr: [],
      tab3BtnArr: [],
      hasChart: false,
      exportImageStyle: {
        width: '260px',
        height: '148px'
      },
      standard: 2,
      standardMsg: '',
      checkinInfo: '',
      weatherImg: '',
      chartLabelArr:[],
      pieColorList:['#6184CE', '#7B9FEB', '#7BD8EB', '#4DE197', '#ACF757','#F7D057', '#FF986E', '#EC5F55', '#A156C5', '#ACABAB'],
      allRemarkItemsFlag: false
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
    },

    imageStyle() {
      return {
        'width': 'calc(130/1920*100vw)',
        'height': `${this.imgHeight}px`
      }
    },

    elImgHeight() {
      return `${this.imgHeight}px`
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
          statusStr: this.$t('overview.echartGood'),
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

    getImgList(index, sourceList) {
      const arr = [];
      let i = 0;
      for (i; i < sourceList.length; i++) {
        arr.push(sourceList[i + index]);
        if (i + index >= sourceList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.filter(source => source.mediaType === 2).map(source => source.url);
    },

    getSignatureList(index, sourceList) {
      const arr = [];
      let i = 0;
      for (i; i < sourceList.length; i++) {
        arr.push(sourceList[i + index]);
        if (i + index >= sourceList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr.map(source => source.content);
    },

    async getReportInfo(res) {
      if (res.errCode === 0 && res.data.length > 0) {
        const data = res.data[0].info;  
        this.totalScore = data.totalScore;
        this.standard = data.standard;
        this.allRemarkItemsFlag = res.data[0].info.type === 1
        this.standardMsg = util.setStandardMsg(this.standard);
        this.checkinInfo = data.checkinRecord ? util.getDateStr(data.checkinRecord.ts) + ' ' + i18n.t('remotePatrol.checkinSuccess') : '';
        this.weatherImg = data.weatherInfo ? data.weatherInfo.icon : '';
        this.signaturesList = this.isInsiteInspect && data.signatures ? data.signatures : [];
        this.getGroupsData(data.groups);
        this.reportData = data;
        this.getTab1AndTab3BtnName(res.data[0].inspectSettings);
        this.getPageDataBasedOnTemplate(this.reportData);
      }
    },

    getGroupsData(groups) {
      const temp = [];
      groups.sort((a, b) => { return a.type - b.type; });
      groups.forEach((groupitem, groupindex) => {
        const obj = {
          items: []
        };
        obj.groupId = groupitem.groupId;
        obj.groupName = groupitem.groupName;
        obj.groupType = groupitem.type;
        obj.parentId = groupitem.parentId;
        obj.parentName = '';
        groupitem.items.forEach((item, index) => {
          const details = {};
          details.subject = item.subject;
          details.comment = item.comment;
          details.description = item.description;
          details.grade = item.score;
          details.qualifiedScore = item.qualifiedScore;
          details.itemScore = item.itemScore;
          details.type = item.type;
          details.passOfFailFlag = this.getItemsPassOrFailed(groupitem.type, item.score, item.qualifiedScore);
          if (item.attachment.length !== 0) {
            this.hasAttachment++;
            details.showAttachment = true;
            details.audioList = [];
            details.sourceList = [];
            details.descriptionList = [];
            item.attachment.forEach((_item, _index) => {
              if (_item.mediaType === 0) {
                const audioObj = {};
                audioObj.audioSrc = _item.url;
                audioObj.audioRef = 'audioRef' + groupindex + index + _index;
                audioObj.isPlaying = false;
                audioObj.audioOftenText = '';
                audioObj.hasNotPlayAudio = true;
                details.showAudio = true;
                details.audioList.push(audioObj);
              } else if (_item.mediaType === 3) {
                details.descriptionList.push({ description: _item.url });
              } else {
                details.sourceList.push(_item);
              }
            });
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
      const map = this.getDetailNameAndHandlerMap(data);
      this.sortArrayByKey(this.templateConfig, 'position');
      const pageData = [];
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

    getDetailNameAndHandlerMap(data) {
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
          ['ignoredItem', 'getIgnoreItems'],
          ['notJoinItem', 'getCommentItems']
        ]);
      }
      if (!data.comment) {
        map.delete('comment');
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
      this.getTableHeader();
      const summary = data.summary;
      util.sortArrayByKeyAsc(summary, 'type');
      const summaryTree = util.handleInspctionCatergyTree(summary, 'groupId');
      summaryTree.forEach(item => {
        if (!item.children) {
          item.children = [];
          item.children.push(item);
        } else {
          item.children.forEach(child => {
            item.numOfCommentItems += child.numOfCommentItems;
            item.numOfTotalItems += child.numOfTotalItems;
          });
        }
      });
      const filterTree = summaryTree.filter(item => item.numOfTotalItems !== item.numOfCommentItems);
      const te_temp = [];
      for (let i = 0; i < 3; i++) {
        const typeIndex = filterTree.filter(x => x.type === i);
        if (typeIndex.length !== 0) {
          typeIndex[0].type === 0 ? te_temp.push(typeIndex) : '';
          typeIndex[0].type === 1 ? te_temp.push(typeIndex) : '';
          typeIndex[0].type === 2 ? te_temp.push(typeIndex) : '';
        }
      }
      return { class: 'row-table', data: te_temp };
    },

    getTableHeader() {
      this.theaderPassFail = [
        { name: this.$t('remotePatrol.category'), width: 'width:32%;', pdfWidth: 'width: 35%' },
        { name: this.$t('insSettingView.subCategory'), width: 'width:32%;', pdfWidth: 'width: 35%' },
        { name: this.tab1BtnArr[0], width: 'width:12%;', pdfWidth: 'width: 10%' },
        { name: this.tab1BtnArr[1], width: 'width:12%;', pdfWidth: 'width: 10%' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:12%;', pdfWidth: 'width: 10%' }
      ];
      this.theaderOther = [
        { name: this.$t('remotePatrol.category'), width: 'width:32%;', pdfWidth: 'width: 35%' },
        { name: this.$t('insSettingView.subCategory'), width: 'width:32%;', pdfWidth: 'width: 35%' },
        { name: this.tab3BtnArr[0], width: 'width:12%;', pdfWidth: 'width: 10%' },
        { name: this.tab3BtnArr[1], width: 'width:12%;', pdfWidth: 'width: 10%' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:12%;', pdfWidth: 'width: 10%' }
      ];
      this.theaderScore = [
        { name: this.$t('remotePatrol.category'), width: 'width:32%;', pdfWidth: 'width: 35%' },
        { name: this.$t('insSettingView.subCategory'), width: 'width:32%;', pdfWidth: 'width: 35%' },
        { name: this.$t('remotePatrol.TableTotal'), width: 'width:24%;', pdfWidth: 'width: 20%' },
        { name: this.$t('remotePatrol.TableGet'), width: 'width:12%;', pdfWidth: 'width: 10%' }
      ];
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
      if (summary.length === 0) {
        this.hasChart = false;
        return null;
      }
      const summaryTree = this.getCategorySummary(summary);
      if (summaryTree.length === 0) {
        this.hasChart = false;
        return null;
      }
      return this.staticalConfig.chart === 0 ? this.getRadarChart(summaryTree) : this.getPieChart(summaryTree);
    },

    getCategorySummary(summary) {
      util.sortArrayByKeyAsc(summary, 'type');
      const summaryTree = util.handleInspctionCatergyTree(summary, 'groupId');
      summaryTree.forEach(summaryItem => {
        if (summaryItem.children) {
          summaryItem.numOfIgnored = this.addChildrenDataToParent(summaryItem.children, 'numOfIgnored');
          summaryItem.numOfQualifiedItems = this.addChildrenDataToParent(summaryItem.children, 'numOfQualifiedItems');
          summaryItem.numOfUnqualifiedItems = this.addChildrenDataToParent(summaryItem.children, 'numOfUnqualifiedItems');
          summaryItem.numOfTotalItems = this.addChildrenDataToParent(summaryItem.children, 'numOfTotalItems');
          summaryItem.totalScore = this.addChildrenDataToParent(summaryItem.children, 'totalScore');
          summaryItem.actualScore = this.addChildrenDataToParent(summaryItem.children, 'actualScore');
          summaryItem.numOfTotalItems = this.addChildrenDataToParent(summaryItem.children, 'numOfTotalItems');
          summaryItem.numOfCommentItems = this.addChildrenDataToParent(summaryItem.children, 'numOfCommentItems');
        }
      });
      const filterTree = summaryTree.filter(item => item.numOfTotalItems !== item.numOfCommentItems);
      return filterTree;
    },

    addChildrenDataToParent(jsonArr, key) {
      const arr = Array.isArray(jsonArr) ? jsonArr : [jsonArr];
      let sum = 0;
      if (arr.length > 1) {
        sum = arr.reduce((prev, cur) => {
          return prev[key] + cur[key];
        });
      } else {
        sum = arr[0][key];
      }
      return sum;
    },

    getTab1AndTab3BtnName(inspectSettings) {
      const itemOptionsForType1 = inspectSettings.filter(settingItem => settingItem.name === 'itemOptionsForType1');
      const itemOptionsForType3 = inspectSettings.filter(settingItem => settingItem.name === 'itemOptionsForType3');
      const tab1BtnArr = [itemOptionsForType1[0].value[0].name, itemOptionsForType1[0].value[1].name];
      const tab3BtnArr = [itemOptionsForType3[0].value[0].name, itemOptionsForType3[0].value[1].name];
      this.tab1BtnArr = tab1BtnArr;
      this.tab3BtnArr = tab3BtnArr;
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
            const audioObj = {};
            this.hasAttachment++;
            obj.showAttachment = true;
            obj.sourceList = [];
            obj.audioList = [];
            obj.descriptionList = [];
            item.attachment.forEach((_item, _index) => {
              if (_item.mediaType === 0) {
                audioObj.audioSrc = _item.url;
                audioObj.audioRef = 'audioRef' + _index;
                audioObj.isPlaying = false;
                audioObj.audioOftenText = '';
                audioObj.hasNotPlayAudio = true;
                obj.showAudio = true;
                obj.audioList.push(audioObj);
              } else if (_item.mediaType === 3) {
                obj.descriptionList.push({ description: _item.url });
              } else {
                obj.sourceList.push(_item);
              }
            });
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
      const focalCount = this.getItemsLength(focalItems);
      return { class: 'row-detail', ifExpand: false, itemCount: focalCount, data: focalItems };
    },

    getQualifiedItems() {
      const qualifiedItems = this.getGroupsItems(2);
      const qualifiedCount = this.getItemsLength(qualifiedItems);
      return { class: 'row-detail', ifExpand: false, itemCount: qualifiedCount, data: qualifiedItems };
    },

    getIgnoreItems() {
      const ignoreItems = this.getGroupsItems(0);
      const ignoreCount = this.getItemsLength(ignoreItems);
      return { class: 'row-detail', ifExpand: false, itemCount: ignoreCount, data: ignoreItems };
    },

    getCommentItems() {
      const commentItems = this.getGroupsItems(3);
      const commentCount = this.getItemsLength(commentItems);
      return { class: 'row-detail', ifExpand: false, itemCount: commentCount, data: commentItems };
    },

    getItemsLength(itemsArr) {
      let sum = 0;
      itemsArr.forEach(item => {
        if (!item.children) {
          sum += item.cateryItems.length;
        } else {
          item.children.forEach(child => {
            sum += child.cateryItems.length;
          });
        }
      });
      return sum;
    },

    getRadarChart(summary) {
      const self = this;
      const options = self.getRadarChartOption();
      const tempIndicator = [];
      const seriesValue = [];
      this.chartLabelArr = []; 
      var templabe = [];
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

      for(var i=0; i<tempIndicator.length;i++){
        let arrObj = {
          name:tempIndicator[i].name,
          value:seriesValue[i]
        }
        templabe.push(arrObj);
      }
      this.chartLabelArr = templabe;
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
          backgroundColor:'#FFF',
          extraCssText: "box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);",
          textStyle:{
            color:'#484848',
            fontStyle:' NotoSansCJKtc',
            fontSize: '15px',
            fontEeight: 'normal',
          }
        },
        textStyle: {
          fontFamily: 'NotoSansCJKtc, Roboto, Microsoft YaHei'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          fontSize: 12,
          padding: 0,
          textStyle: {
            color: '#7d8cab',
            fontSize: 12
          },
          data: ['inspect radar']
        },
        radar: [
          {
            shape: "circle",
            indicator: [],
            nameGap: 5,
            center: ['50%', '50%'],
            name: {
              textStyle: {
                color: '#69727c',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            splitArea: {
              show: false
            }
          },
          {
            shape: "circle",
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
          data: [],
          symbol:'none',
        },
        {
          type: 'radar',
          data: [],
          name: this.$t('remotePatrol.category'),
          symbol:'none',
          radarIndex: 1,
          itemStyle: {
            decal:{
                symbol:'rect',
                 symbolSize:1,
                color:'red',
              },
            normal: {
              color:'#006ab7',
              backgroundColor:'#006ab7',
              lineStyle: {
                color: '#006ab7',
                width: 2
              },
              areaStyle: {
                color: new ECharts.graphic.RadialGradient( //圓圈中心建變色填滿 
                  0.5, 0.5, 0.5,
                  [
                    { offset: 1, color: 'rgba(0,106,183, 0.4)' },
                    { offset: 0, color: 'rgba(235,243, 249, 0.4)' }
                  ]  
                ),
              }
            }
          },
          
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
     
      let totalItem = 0;
      summaryTempArr.forEach(item => {
        const obj = {};
        obj.name = item.groupName;
        obj.value = this.staticalConfig.qualified ? item.numOfUnqualifiedItems : item.numOfQualifiedItems;
        totalItem += obj.value;
        obj.value > 0 && seriesData.push(obj);
      });
      const lableData = [];
      console.log("totalItem:",totalItem);
      seriesData.forEach(item => {
        const objl = {};
        objl.name = item.name;
        objl.value = ((item.value/totalItem)*100).toFixed(1);
        console.log("totalItem:",objl.value);
        objl.value > 0 && lableData.push(objl);
      });
      this.chartLabelArr = lableData;
      pieOptions.series[1].data = seriesData;
      return pieOptions;
    },

    getPieChartsOption() {
      const pieOption = {
        tooltip: {
          trigger: 'item',
          color:'#9A9A9C',
          formatter: '{b}-{d}%',
          textStyle: {
            align: 'left'
          },
          backgroundColor: 'rgba(30,34,52,0.75)',
        },
        series: [
          {
            type: 'pie',
            radius: ['43%', '70%'],
            itemStyle: {
              normal: {
                borderWidth:2,
                borderType:'dashed',
                borderColor:'#dae4eb',
                color: function(params) {
                  const colorList = ['#FFF'];
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
            itemStyle: {
              emphasis: {
                borderWidth:10,
                borderColor:'#EDF0F2',
                
              },
              normal: {
                borderWidth:5,
                borderColor:'#FFF',
                color: function(params) {
                  const colorList = ['#6184CE', '#7B9FEB', '#7BD8EB', '#4DE197', '#ACF757',
                    '#F7D057', '#FF986E', '#EC5F55', '#A156C5', '#ACABAB'];
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              show: false,
              fontSize: 12,
              color: '#9A9A9C',
              formatter: '{b}-{d}%',
              width:'50',
              overflow:'break'
            },
            labelLine: {
              show: false,
              length: 10,
              length2: 50,
              lineStyle: {
                color: '#9A9A9C'
              }
            },
            z: 1,
            data: []
          }
        ]
      };
      return pieOption;
    },

    getGroupsItems(status) {
      const treeData = util.handleInspctionCatergyTree(this.groups, 'groupId');
      console.log('treeData:',treeData);
      const group = [];
      treeData.forEach(catergy => {
        const tempGroupItem = {};
        tempGroupItem.groupId = catergy.groupId;
        tempGroupItem.groupName = catergy.groupName;
        tempGroupItem.groupType = catergy.groupType;
        if (!catergy.children) {
          tempGroupItem.cateryItems = [];
          catergy.items.forEach(inspectItem => {
            if (status >= 0) {
              if (status === 3 && inspectItem.type === 1) {
                tempGroupItem.cateryItems.push(inspectItem);
              } else if (inspectItem.passOfFailFlag === status && inspectItem.type === 0) {
                tempGroupItem.cateryItems.push(inspectItem);
              }
            } else {
              tempGroupItem.cateryItems.push(inspectItem);
            }
          });
          if (tempGroupItem.cateryItems.length > 0) {
            group.push(tempGroupItem);
          }
        } else {
          tempGroupItem.children = [];
          catergy.children.forEach(child => {
            const tempChildItem = {};
            tempChildItem.groupId = child.groupId;
            tempChildItem.groupName = child.groupName;
            tempChildItem.groupType = child.groupType;
            tempChildItem.cateryItems = [];
            child.items.forEach(inspectItem => {
              if (status >= 0) {
                // if(inspectItem.passOfFailFlag === status){
                //   tempChildItem.cateryItems.push(inspectItem);
                // }
                if (status === 3 && inspectItem.type === 1) {
                  tempChildItem.cateryItems.push(inspectItem);
                } else if (inspectItem.passOfFailFlag === status && inspectItem.type === 0) {
                  tempChildItem.cateryItems.push(inspectItem);
                }
              } else {
                tempChildItem.cateryItems.push(inspectItem);
              }
            });
            if (tempChildItem.cateryItems.length > 0) {
              tempGroupItem.children.push(tempChildItem);
            }
          });
          if (tempGroupItem.children.length > 0) {
            group.push(tempGroupItem);
          }
        }
      });
      console.log('group:',group);
      return group;
    },

    turnSuggest(data) {
      return data.replace(/(\r\n|\n|\r)/gm, '<br/>');
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
    },

    adjustChart(){}
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
  $red: #2c90d9;
  $black: #182752;
  $border: #e3e9f4;
  $background: #f7f9fa;
  $tab: #7d8cad;
  $h1: #292e36;
  $qualified: #69727c;
  $noqualied: #FDBA40;
  $suggestBack: #f7f9fa;
  
  tr {
    background-color: #fff !important;
  }
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
      height: 76px;
      margin-top:29px;
      text-align: left;
      padding-left: calc(30 / 1920 * 100vw);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .pdf-title-icon{
        width:46px;
        height:54px;
        vertical-align: middle;
      }
      .title-icon{
        width: calc(20/1440*100vw);
        height: calc(20/1440*100vw);
      }
      .pdf-report-title{
        font-size: 18px;
        height: 25px;
        font-weight: bold;
        margin:0;
        vertical-align: middle;
        display: inline-block;
        margin-left: 20px;
        width:100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .report-title {
        color: #2b2b2b;
        font-size: calc(18/1440*100vw);
        font-weight: bold;
        margin:0;
        margin-left: calc(20 / 1920 * 100vw);
      }
      .nochart-report-title{
        font-size: 20px;
      }
      .left-header{
        width: 100%;
        align-items: center;
        display: flex;
        height: 25px;
        .font-15 {
           font-size: calc(15/1440*100vw); 
           height: calc(32/1440*100vw); 
          line-height: calc(40/1440*100vw); 
        }
        .font-score {
           font-size: calc(32/1440*100vw); 
           color: #c60957;
        }
        .font-score_count {
           font-size: calc(12/1440*100vw); 
           color: #69727c;
        }
      }
      
      .status-tag {
        border-radius: calc(5/1440*100vw); 
        padding: calc(2/1440*100vw) calc(15/1440*100vw);
      }
      .info-content {
        margin-top:20px;
        font-size: 12px;
        margin-left:26px;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: $tab;
        .info-label {
          margin-left: calc(20 / 1920 * 100vw);
        }
        .info-value{
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pdf-info-value{
          @extend .info-value;
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
        border-radius: 5px;
        background-color: $suggestBack;
        color: $qualified;
        height: auto;
        overflow-y: auto;
        border: 1px solid #f5f5f5;
        padding: 16px;
        .suggest-content {
          max-height: 180px;
          display: flex;
        }
        span:first-child {
          padding-right: 10px;
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
        display: flex;
        align-items: center;
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
        .pie-area{
          display:flex;
          justify-content: center;
          width: calc(700/1920*100vw);
          margin: auto;
          .pie-div{
            flex: 1;
            display: flex;
            justify-content: center;
            .inner{
              position:absolute;
              height: 150px;
              width: 150px;
              margin-right: 62px;
              top:143px;
              border-radius: 50%;
              border-color:#dae4eb;
              border-style:dashed dashed dashed dashed; 
            }
            .pct-panel{
              // width: 290px;
              // height: 350px;
              /*border-radius: 50%;
              border-color:#dae4eb;
              border-style:dashed dashed dashed dashed; */
              
              .pie-chart-content {
                width:100%;
                height:100%;
              }
            }
          }
          .pie-label-area{
            cursor: pointer;
            width: calc(300/1440*100vw);
            height: 40px;
            display:flex;
            flex-direction: row;
            align-items: center;
            text-align: left;
            .pie-color{
              width:18px;
              height: 18px;
              margin-left: 12px;
            }
            .pei-item-name{
              margin-left:calc(12/1440*100vw);
              color: #484848;
              width:calc(167/1440*100vw);
              height: 18px;
              font-size: 15px;

            }
            .pei-item-num{
              color: #484848;
              width:calc(40/1440*100vw);
              height: 18px;
              font-size: 15px;
              font-family: Roboto;
              font-weight: bold;
              line-height:18px;
            }
          } 
        }
      }
      .radar-content {
        width:100%;
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
        .radar-area{
          width:100%;
          display:flex;
          justify-content: center;
          // width: calc(700/1920*100vw);
          margin: auto;
          .radar-div{
            // flex: 1;
            display: flex;
            justify-content: center;
            .pct-panel{
              // width: 290px;
              // height: 350px;
              
              .radar-chart-content {
                width: 100%;
                margin:0 auto;
                height: 100%;
              }
            }
          }
          .radar-label{
            width: calc(216/1440*100vw);
            height: 290px;
            margin-left: 12px;
            padding: 16px;
            box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
            background-color: #fff;
            border-radius: 4px;
            overflow-y: auto;
            .radar-label-area{
              height: 30px;
              display:flex;
              flex-direction: row;
              align-items: center;
              text-align: left;
              .radar-item-name{
                margin-left:16px;
                color: #484848;
                width:calc(167/1440*100vw);
                height: 16px;
                font-size: 15px;

              }
              .radar-item-num{
                color: #484848;
                width:20px;
                height: 18px;
                font-size: 15px;
                font-family: Roboto;
                font-weight: bold;
                line-height:16px;
              }
            }
          }

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
            color: #556679;
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
              background-color: #edf8f9;
              color: #006ab7;
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
                width: auto;
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
          .description-area{
            background-color:#f7f9fa;
            border-radius:5px;
            margin-top:5px;
            padding: 10px calc(10 / 1920 * 100vw) 18px calc(10 / 1920 * 100vw);
            display: flex;
            flex-direction: row;
            .description{
                          float: left;
                          text-align: left;
                          @include point(margin-top,6);
                          font-family: Roboto,Arial, 'Microsoft YaHei';
                          font-size: 14px;
                          white-space:pre-wrap; /* css3.0 */
                          white-space:-moz-pre-wrap; /* Firefox */
                          white-space:-pre-wrap; /* Opera 4-6 */
                          white-space:-o-pre-wrap; /* Opera 7 */
                          word-wrap:break-word; /* Internet Explorer 5.5+ */
                          .description-content{
                            font-size: 14px;
                            word-break:break-all;
                          }
                      }
                      /deep/
                      .description-content{
                            font-size: 14px;
                            word-break:break-all;
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
    position: fixed;
    top: calc(10/1440*100vw);
    right: calc(150/1440*100vw);
    z-index: 999;
    /deep/ .el-input__inner {
      border: none;
      background-color: rgba(255, 255, 255, .2);
      color: #fff;
      width: calc(160/1440*100vw);
    }
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
  .imgLittle .el-image__inner{
    height: 100%;
    width: 100%;
  }
  .standard-btn{
    display: inline-block;
    margin-left: calc(20/1920*100vw);
  }
  .checkin-content{
    display: inline-block;
    position: absolute;
    right: 50px;
    text-align: center;
    top: 3px;
    .checkin-info-content{
      font-weight: normal;
      font-size: calc(12 / 1920 * 100vw);
      color: #7d8cad;
    }
  }
  .weather-content{
    text-align: center;
    margin-left:10px;
    display: flex;
    .weather-info-content{
      width: 24px;
      height:24px;
    }
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
