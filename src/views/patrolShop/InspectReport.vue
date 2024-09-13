<template>
<div>
  <div class="submit_btn"  v-if="needDeleteReport">
    <delay-button type="filled" @click="showUpdateEvent = true">
      <div class="button-area" style="width: 80px; height: 20px;">
        <span>刪除報告</span>
      </div>
    </delay-button>
  </div>

  <dialog-pop
    title="是否確認刪除報告"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
    :visible="showUpdateEvent"
    :isWarning="true"
    :showButton=" false"
  >
    <div class="dialog-slot">
      <div class="dialog-content">
        <div class="comfirm_delete_report" >
          <h3>同意刪除須知事項 </h3>
          <p>請注意！刪除報告後資料無法復原，請確保您要刪除的報告是正確的，請謹慎操作。 
            為確保報告的安全刪除，請提供用戶密碼並勾選 <b>「我理解並同意刪除報告」</b>。
            如果您有任何疑問或需要協助，請隨時聯絡我們的客服團隊。</p>
        </div>

        <div class="l_row" >
          <el-checkbox  class="storevue-checkbox-filled" v-model="agreeDelete" @change="addNum">
            <span style="color: red">*</span> 我理解並同意刪除報告
          </el-checkbox>
        </div>

        <div class="l_row">
          <div style="margin-bottom: 5px ;">
            <span style="color: red; ">*</span> 刪除原因 
          </div>
          <el-input
            v-model="deleteReason"
            type="textarea"
            ref="delay_day"
            placeholder=""
            class="input-name_short"
            @input="addNum"
            />
        </div>

        <div class="l_row">
          <div style="margin-bottom: 5px ;">
            <span style="color: red; ">*</span> 請再次輸入使用者密碼 
          </div>
          <el-input
            v-model="passWord"
            show-password
            ref="delay_day"
            placeholder=""
            class="input-name_short"
            @input="addNum"
            />
        </div>
        <div class="delete_btn_row">
          <el-button class="cancel-btn" size="mini" @click="cancelUpdate">
            {{ $t('remotePatrol.cancel') }}
          </el-button>
          <el-button :disabled="!canDeleteReport" class="confirm-btn" size="mini" type="primary" @click="confirmUpdate">
            {{ $t('remotePatrol.confirm') }}
          </el-button>
      </div>
      </div>
    </div>
  </dialog-pop>

  <div ref="printPDF" class="report-container" :class="{'print': isexportPDF}">
    <div style="display: none">
      <div class="no-print">
        <delay-button
          id="downloadPdf"
          @click="handleDown"
        >
        </delay-button>
        <delay-button
          id="downloadExcel"
          @click="handleDownExcel"
        >
        </delay-button>
      </div>
    </div>
    <div class="el-header">
      <div class="workflow-edit" v-if="isAuditMode">
        <p :class="{'pdf-report-title': isexportPDF, 'report-title': !isexportPDF, 'nochart-report-title': !hasChart}">
          {{ $t('audit.inceptionRpt.auditReport') }}
        </p>
        <div style="display:inline-block">
          <el-button
            v-if="showEditBtn"
            class="confirm-btn"
            size="'mini'" type="primary" @click="goBackRemoteInception">
            {{ $t('audit.inceptionRpt.edit') }}
          </el-button>
          <el-button
            v-if="showCancelBtn"
            class="storevue-button-filled"
            size="'mini'" type="primary" @click="doCancelAudit">
            {{ $t('audit.inceptionRpt.cancelAudit') }}
          </el-button>
        </div>
      </div>
      <div class="splitline" v-if="isAuditMode"></div>
      <div class="left-header">
        <img :src="report.inspectSrc" :class="isexportPDF ? 'pdf-title-icon' : 'title-icon'">
        <p :class="{'pdf-report-title': isexportPDF, 'report-title': !isexportPDF, 'nochart-report-title': !hasChart}">
          {{ accountName + ' | ' + report.storeName+' '+report.tagName }}
          <span v-if="!isexportPDF">{{ ' ('+report.inspectType+')' }}</span>
        </p>
        <div class="spacer"></div>
        <span :style="isexportPDF?{'width':'100px'}:{}" class="font-15">{{ $t('remotePatrol.getscore') }}：</span>
        <span :style="isexportPDF?{'width':'100px','fontSize':'32px'}:{}" class="font-score">
          {{ allRemarkItemsFlag ? '--' : totalScore }}
          <span class="font-score_count">{{ $t('remotePatrol.scorecount') }}</span>
        </span>
      </div>
      <div class="info-content">
        <div class="pdf_font_24">
            <span class="info-label">{{ $t('remotePatrol.submitter') }}</span>
            <span :class="isexportPDF ? 'pdf-info-value' : 'info-value'">{{ report.submitterName }}</span>
            <span class="info-label">{{ $t('remotePatrol.generateTime')+'：' }}</span>
            <span :class="isexportPDF ? 'pdf-info-value' : ''">{{ report.dateStr }}</span>
            <span class="ignoreSign" v-if="report.isCheckInIgnore"> 略過簽到 </span>

            <span v-if="!isexportPDF && hasSignRecord" class="info-label">{{ $t('remotePatrol.signInTime')+'：' }}</span>
            <span v-if="!isexportPDF && hasSignRecord" :class="isexportPDF ? 'pdf-info-value' : ''">{{ signInTime }} </span>
            <span v-if="!isexportPDF && hasSignRecord" class="info-label">{{ $t('remotePatrol.patrolTime')+'：' }}</span>
            <span v-if="!isexportPDF && hasSignRecord" :class="isexportPDF ? 'pdf-info-value' : ''">{{ inceptionExecutTime }}</span>
            <!-- 簽到距離 -->
            <span v-if="!isexportPDF && hasSignRecord" class="info-label">{{ $t('remotePatrol.signInDistance')+'：' }}</span>
            <span v-if="!isexportPDF && hasSignRecord && signInDistance !== -1">{{ $t('remotePatrol.aroundDistance')  }}</span>
            <span v-if="!isexportPDF && hasSignRecord" :class="isexportPDF ? 'pdf-info-value' : ''">
              {{ (signInDistance === -1 ? '超出簽到範圍' : signInDistance) }}
            </span>
            <span v-if="!isexportPDF && hasSignRecord && signInDistance !== -1" >{{$t('remotePatrol.mapDistance3')}}</span>

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
            // 0: $t('overview.danger'),
            // 1: $t('overview.improve'),
            // 2: $t('overview.echartGood')
            0: inspectStatus.status_0,
            1: inspectStatus.status_1,
            2: inspectStatus.status_2
          }[report.status]}}
        </div>


        <div v-if="showTag" style="margin-left: calc(20/1440*100vw)" class="status-tag"
          :style="standard == 1 ? {'color':'#59ab22','background-color':'#e8f6de'}: {'color':'#f57848','background-color':'#ffefeb'}"
        >{{standard == 1 ? $t('remotePatrol.goalAchieved') : $t('remotePatrol.farBehind')}}</div>
        <!--<div v-if="checkinInfo" style="color: #69727c; font-size: 12px; margin-left: 20px">
          {{ checkinInfo }}
        </div>-->
      </div>
    </div>
    <div v-if="isexportPDF && hasSignRecord" class="pdf_font_24 info-content" style="margin-left:46px">
      <span v-if="hasSignRecord && report.isCheckInIgnore"> (略過簽到) </span>
      <span v-if="hasSignRecord" class="info-label">{{ $t('remotePatrol.signInTime')+'：' }}</span>
      <span v-if="hasSignRecord" :class="isexportPDF ? 'pdf-info-value' : ''">{{ signInTime }}</span>
      

      <span v-if="hasSignRecord" class="info-label" style="margin-left:calc(40/1980*100vw)">{{ $t('remotePatrol.patrolTime')+'：' }}</span>
      <span v-if="hasSignRecord" :class="isexportPDF ? 'pdf-info-value' : ''">{{ inceptionExecutTime }}</span>

      <span v-if="hasSignRecord" class="info-label" style="margin-left:calc(40/1980*100vw)">{{ $t('remotePatrol.signInDistance')+'：' }}</span>
      <span v-if="hasSignRecord && signInDistance !== -1">{{ $t('remotePatrol.aroundDistance')  }}</span>
      <span v-if="hasSignRecord" :class="isexportPDF ? 'pdf-info-value' : ''">
        {{ (signInDistance === -1 ? '超出簽到範圍' : signInDistance) }}
      </span>
      <span v-if="hasSignRecord && signInDistance !== -1" >{{$t('remotePatrol.mapDistance3')}}</span>


    </div>
    <div class="template-titles" v-if="!isexportPDF">
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

    <!-- 巡檢詳情 -->
    <div class="el-acticle">
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
                  {{ $t(`titleView.${pageItem.name}`) }} </span>
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
                        <p class="title1"><span class="pdf_font_20">{{ index+1 }}.{{ item.subject }} </span></p>
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
                                v-else
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
          <div class="limit-group-score-tip" v-if="showMaxInfo">
            <div class="limit-img" >
              <img :src="require('../../../static/img/group_score.svg')" width="20" height="20" />
            </div>
            <div class="limit-text">{{$t('remotePatrol.tipLimitGroupScore')}} </div>

          </div>


          <table v-for="(tableItem, tableIndex) in pageItem.data" :key="tableIndex" class="table table-bordered">
            <thead :class="hasChart ? 'pdf_font_20': 'pdf_font_16'">
              <tr v-if="tableItem[0].type === 0">
                <th
                  v-for="(t_item ,t_index) in theaderPassFail"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}
                  <span v-if="t_index == 0 && setting_isShowDistrictSum" > ( {{$t('remotePatrol.totalScoreUnit')}} :  {{ getTotalSum( pageItem.data[tableIndex]) }} ) </span>
                </th>
              </tr>
              <tr v-if="tableItem[0].type === 1">
                <th
                  v-for="(t_item ,t_index) in theaderScore"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}
                  <span v-if="t_index == 0 && setting_isShowDistrictSum"> ( {{$t('remotePatrol.totalScoreUnit')}} : {{ getTotalSum( pageItem.data[tableIndex]) }} ) </span>
                </th>
              </tr>
              <tr v-if="tableItem[0].type === 2">
                <th
                  v-for="(t_item ,t_index) in theaderOther"
                  :key="t_index"
                  :style="isexportPDF ? t_item.pdfWidth: t_item.width"
                  scope="col">{{ t_item.name }}
                  <span v-if="t_index == 0 && setting_isShowDistrictSum"> ( {{$t('remotePatrol.totalScoreUnit')}} : {{ getTotalSum( pageItem.data[tableIndex]) }} ) </span>
                </th>
              </tr>
            </thead>


            <template >
              <!-- <pre> --0-- {{ tableItem[0] }}  </pre> -->
              <!-- <pre> --1-- {{ tableItem[1] }}</pre>
              <pre> --2-- {{ tableItem[2] }}</pre>
              <pre> --3-- {{ tableItem[3] }}</pre> -->

              <tbody v-for="(categoryItem, categoryIndex) in tableItem" :key="categoryIndex" :class="hasChart ? 'pdf_font_20': 'pdf_font_16'" class="pdf_font_20">
                <tr style="vertical-align:middle;">
                  <td :rowspan="categoryItem.children.length + 1" style="vertical-align:middle;">

                    <div>
                      <div v-if="categoryItem.weight != -1 && categoryItem.type != 2">{{ categoryItem.weight + '%' }}</div>
                      <div>
                        {{ categoryItem.groupName }}
                        <span style="color: #7d8cad; margin-left: 5px;" v-if="setting_isShowGroupSum"> 
                          ( {{$t('remotePatrol.totalScoreUnit')}} : {{ getSum(categoryItem.children)}} ) 
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="(subcategory,subcategoryIndex) in categoryItem.children"
                  :key="subcategoryIndex"
                  :style="subcategoryIndex%2!=0?{'background-color':'#F7F8FC'}:{}">
                  <td style="word-break: keep-all;white-space:nowrap;">
                    <span class="item-name">{{ subcategory.children ? "--" : subcategory.groupName }}</span>
                    <span class="count-blag"><span class="pdf_font_16">{{ subcategory.numOfTotalItems }}</span></span>
                  </td>
                  <td v-if="subcategory.type === 0||subcategory.type === 2"><span>{{ subcategory.numOfQualifiedItems }}</span></td>
                  <td v-if="subcategory.type === 0||subcategory.type === 2"><span>{{ subcategory.numOfUnqualifiedItems }}</span></td>
                  <td v-if="subcategory.type === 1"><span>{{ getDoubleNum(subcategory.weight == -1 ? subcategory.totalScore : subcategory.totalScore * subcategory.weight / 100) }}</span></td>
                  <td>
                    <div style="display:flex;flex-direction:row;justify-content:space-between;">
                      <!-- 分數 -->
                      <div style="flex:2;">{{ getDoubleNum(subcategory.actualScore) == Infinity ? '--' : getDoubleNum((subcategory.weight == -1 || subcategory.type==2 ) ? subcategory.actualScore : subcategory.actualScore * subcategory.weight / 100) }} </div>

                      <div v-if="subcategory.children" style="display:flex;flex:1;flex-direction:row;align-content:center;">
                        <img v-if="categoryItem.isAdvanced" style="margin-right:4px;" :src="require('../../../static/img/group_score.svg')" width="15" height="15" />
                        <div style="color:#9EACB6;font-size:10px;font-weight:normal;">{{ categoryItem.isAdvanced ? categoryItem.groupScore :''}}</div>
                      </div>
                      <div v-else-if="!subcategory.children" style="display:flex;flex:1;flex-direction:row;align-content:center;">
                        <img v-if="subcategory.isAdvanced" style="margin-right:4px;" :src="require('../../../static/img/group_score.svg')" width="15" height="15" />
                        <div style="color:#9EACB6;font-size:10px;font-weight:normal;">{{ subcategory.isAdvanced ? subcategory.groupScore :''}}</div>
                      </div>
                    </div>
                  </td>
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
              class="radar-div">
                <div class="pct-panel"
                :style="isexportPDF ? {'width': '145px', 'height': '175px'}: {'width': '450px', 'height': '350px','marginRight':'50px'}"
                >
                <v-chart
                  v-if="pageItem.data"
                  ref="chartRadar"
                  :options="pageItem.data"
                  autoresize
                  class="radar-chart-content"/>
                  </div>
              </div>
              <div
                class="radar-label"
                :style="isexportPDF?{'marginLeft': '175px', 'width':'350px'}:{}"
              >
                <div style="margin-left:16px;color:#484848;font-size:15px;line-height:20px">{{$t('remotePatrol.category')}}</div>
                <div
                v-for="(item,index) in chartLabelArr"
                :style="isexportPDF?{'width':'100%'}:{}"
                :key="index">
                  <div class="radar-label-area" :style="isexportPDF?{'display': 'flex', 'width':'100%'}:{}">
                      <div :style="isexportPDF?{'flex': 1}:{}" class="radar-item-name">{{item.name}}</div>
                      <div :style="isexportPDF?{'width': '50px'}:{}" class="radar-item-num">{{item.value}}</div>
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
                  v-show="signatureItem.content"
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
        <el-col style="float:none">
          <div v-if="pageItem.class === 'signature-map'" style="page-break-before: always;">
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
                  {{ $t(`remotePatrol.${pageItem.name}`) }} </span>
                </span>
              </div>
            </div>
            <div v-if="pageItem.ifExpand" class="item-content">
              <div class="pdf_font_20">

                <div class="content-title" v-if="pageItem.distance == -1 ">
                  <span class="pdf_font_20">
                    {{ $t('remotePatrol.mapDistance1')+`${report.storeName}`+ $t('remotePatrol.signInDistance')}} : 超出簽到範圍
                  </span>
                </div>

                <div class="content-title" v-else>
                  <span class="pdf_font_20">
                    {{ $t('remotePatrol.mapDistance1')+`${report.storeName}`+$t('remotePatrol.mapDistance2')+` ${pageItem.distance}`}}
                  </span>
                </div>


                <hr class="hr-horizontal" />
              </div>
              <div style="display:flex;flex-direction:row; justify-content:start;" :style="isexportPDF ? 'height:calc(984/1440*100vw)' : ''">
                <img :src= "pageItem.data" style="width:50%;height:auto; margin-top:10px;margin-bottom:10px"/>
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
      <div>
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
    <dialog-pop
      v-if="cancelAuditDialogShow"
      :title="confirmCancelAuditInfo"
      :isWarning="true"
      :visible="cancelAuditDialogShow"
      @cancelHandler="onCancelAudit"
      @confirmHandler="onConfirmCancelAudit">
    </dialog-pop>

    <dialog-pop
      v-if="workflowUnbindDialogShow"
      :title="warnWorkflowUnbindTitle"
      :isWarning="true"
      :visible="workflowUnbindDialogShow"
      :showCancelbtn="false"
      @confirmHandler="workflowUnbindDialogShow=false"
    >
      <div class="dialog-slot">
            {{warnWorkflowUnbind}}
      </div>
    </dialog-pop>

    <DownloadDialogPop
      :title="$t('downloadManagement.message')"
      :visible="showExportMassage"
      :showCancelbtn="false"
      @confirmHandler="showExportMassage = false"
      @goToPage="$router.push({name: 'downloadManagement',});"
      >
    </DownloadDialogPop>
  </div>
</div>
</template>

<script>
import ECharts from 'vue-echarts';
import {
  getInspectReportInfo,
  downLoadInspectReportEntireDetail,
  getInspectStatus,
  checkOutInspectItemV3
} from '@/api/inspect';
import {exportEntireJsonUnit} from '@/api/exportExcel';
import { CancelWorkflow,taskDrawback,GetTaskInfo } from '@/api/workflow';
import {getDetailedStoreInfo} from '@/api/store';
import { deleteReport} from '@/api/reportAndEvent';
import { Encrypt } from '@/common/Aes'
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
import DialogPop from '@/components/DialogPop.vue';
import DownloadDialogPop from '@/components/DownloadDialogPop';

export default {
  name: 'InspectReport',
  components: {
    DescriptionText,
    ReportDetail,
    AudioVue,
    DelayButton,
    DialogPop,
    DownloadDialogPop,
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
      showUpdateEvent: false,
      templateList: [],
      templateConfig: [],
      curTemplateIndex: 0,
      accountName: '',
      reportId: 0,
      downloadProgress: false,
      hasAttachment: 0,
      varyWindowWidth: window.innerWidth,

      setting_isShowGroupSum: false,
      setting_isShowDistrictSum: false,
      showMaxInfo: false,

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
      allRemarkItemsFlag: false,
      workflowTaskName:'督导稽核记录表',
      cancelAuditDialogShow:false,
      confirmCancelAuditInfo:this.$t('audit.inceptionRpt.confirmCancelAudit'),
      backSheetGroup:[],
      isAuditMode:true,
      showEditBtn:true,
      showCancelBtn:false,
      auditState:1,
      inspectStatus: '',
      showTag: false,
      hasSignRecord:false,
      inspectStatus: '',
      inceptionExecutTime:'',
      storeLatitude:0.0,
      storeLongitude:0.0,
      signInDistance:'',
      signInTime:'',
      signMapUrl:'',
      workflowUnbindDialogShow:false,
      warnWorkflowUnbind:this.$t('audit.inceptionRpt.warnWorkflowUnbind'),
      warnWorkflowUnbindTitle:this.$t('audit.inceptionRpt.errorEditReport'),

      totalSumScore: 0,
      hundredMarkType: 0,

      includedInTotalScoreWithType1: false,
      qualifiedForIgnoredWithType1: false,
      qualifiedForIgnoredWithType2: false,

      changeNum: 0,
      agreeDelete: false,
      deleteReason: '',
      passWord: '',
      deleteReportId: '',
      canDeleteReport: false,
      needDeleteReport: false,
      showExportMassage: false
      
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

  watch:{
    standard(val){
      if(val !== -1) {
        this.showTag = true
      }
    },

    changeNum(val){
      if(this.agreeDelete == true && this.deleteReason !== '' && this.passWord !== '') this.canDeleteReport = true
      else this.canDeleteReport = false
    },

  },
  created() {
    this.getStoredTemplateId();
    this.getRouterData();
    this.getReportTemplateAndInfo();
    this.getInspectStatus()

    
  },

  mounted() {
    this.accountName = sessionStorage.getItem('accountName');
    this.needDeleteReport = sessionStorage.getItem('needDeleteReport');
  },

  methods: {
    
    addNum(){
      this.changeNum += 1
      console.log('this.changeNum :>> ', this.changeNum);
    },
    cancelUpdate(){
      this.showUpdateEvent = false
      this.agreeDelete = false
      this.deleteReason = ''
      this.passWord = ''
    },

    confirmUpdate(){
      console.log('this.deleteReportId :>> ', this.deleteReportId);
      var EncryptPassword = Encrypt(this.passWord)

      var delParams = {
        reportId: this.deleteReportId,
        reason: this.deleteReason,
        password: EncryptPassword
      }
      console.log('delParams ~~~~~~~>> ', delParams);
      // this.isLoading = true;   
      deleteReport(delParams).then(res=>{
        console.log('res :>> ', res);
        if(res.errCode){
          util.notify('密碼輸入錯誤', 'error', 3000);
        } else {
          this.$router.push({ name: 'deleteReport' });
        }
        
      }).catch(err => {
        console.log('err :>> ', err.errCode);
      })
    },

    // 計算分母
    getTotalScore(data, hundredMarkType){
      console.log('getTotalScore data :>> ', data);
      console.log('hundredMarkType', hundredMarkType)
      // 剩下子類別（groupScore !== -99999）
      var items = data.filter(i =>  i.type !== 2 )
      console.log('items :>> ', items);
      console.log('this.includedInTotalScoreWithType1 :>> ', this.includedInTotalScoreWithType1);
      console.log('this.qualifiedForIgnoredWithType1 :>> ', this.qualifiedForIgnoredWithType1);
      console.log('this.qualifiedForIgnoredWithType2 :>> ', this.qualifiedForIgnoredWithType2);

      // -1 - original mark system， 
      // 0 - hundred mark system, 
      // 1 - penalty point system
      if(hundredMarkType == 0){
        var n = 0
        items.forEach(i => {
          // 權重
          if(i.weight !== -1){
            console.log('權重 :>> ', );
            // 分數無上限
            if(i.groupScore !== -99999){
              // tab1 為Number.MAX_VALUE ,不計分
              if(i.actualScore === Number.MAX_VALUE)  var tempScore = 0
              
              if(this.includedInTotalScoreWithType1){
                // tab1
                if(this.qualifiedForIgnoredWithType1 && i.type == 0){
                  var tempScore = ((i.groupScore * i.weight) / 100)
                  console.log('tempScore2 tab1 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType1 && i.type == 0 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : ((i.groupScore * i.weight) / 100)
                  console.log('tempScore2 tab1 b:>> ',i.groupName , tempScore);
                }
                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = ((i.groupScore * i.weight) / 100)
                  console.log('tempScore2 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : ((i.groupScore * i.weight) / 100)
                  console.log('tempScore2 tab1 b:>> ',i.groupName , tempScore);
                }
              }
              else {
                // tab1
                if(this.qualifiedForIgnoredWithType1 && i.type == 0){
                  var tempScore = 0
                }
                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = ((i.groupScore * i.weight) / 100)
                  console.log('tempScore2 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : ((i.groupScore * i.weight) / 100)
                  console.log('tempScore2 tab1 b:>> ',i.groupName , tempScore);
                }
              }
            }

            // 無分數無上限
            else {
              if(i.actualScore === Number.MAX_VALUE)  var tempScore = 0
              
              if(this.includedInTotalScoreWithType1){
                // tab1
                if(this.qualifiedForIgnoredWithType1 && i.type == 0){
                  var tempScore = (i.totalScore * i.weight) / 100
                  console.log('tempScore2 tab1 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType1 && i.type == 0 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : (i.totalScore * i.weight) / 100
                  console.log('tempScore2 tab1 b:>> ',i.groupName , tempScore);
                }

                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = (i.totalScore * i.weight) / 100
                  console.log('tempScore2 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : (i.totalScore * i.weight) / 100
                  console.log('tempScore2 tab1 b:>> ',i.groupName , tempScore);
                }
              }
              else {
                // tab1
                if(i.type == 0){
                  var tempScore = 0
                }
                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = (i.totalScore * i.weight) / 100
                  console.log('tempScore2 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : (i.totalScore * i.weight) / 100
                  console.log('tempScore2 tab1 b:>> ',i.groupName , tempScore);
                }
              }

              
            }
          } 

          // 無權重
          else {
            console.log('無權重 :>> ', );
            console.log('i.type :>> ', i.type);
            // 分數無上限
            if(i.groupScore !== -99999 ){
              console.log('分數無上限 :>> ');
              if(i.actualScore === Number.MAX_VALUE)  var tempScore = 0
          
              if(this.includedInTotalScoreWithType1){
                 // tab1
                if(this.qualifiedForIgnoredWithType1 && i.type == 0){
                  var tempScore = i.groupScore / 100
                  console.log('tempScore3 tab1 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType1 && i.type == 0 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : i.groupScore / 100
                  console.log('tempScore3 tab1 b:>> ',i.groupName , tempScore);
                }

                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = i.groupScore / 100
                  console.log('tempScore3 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : i.groupScore / 100
                  console.log('tempScore3 tab2 b:>> ',i.groupName , tempScore);
                }
              }
              else {
                // tab1
                if(i.type == 0){
                  var tempScore =  0 
                }
                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = i.groupScore / 100
                  console.log('tempScore3 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : i.groupScore / 100
                  console.log('tempScore3 tab2 b:>> ',i.groupName , tempScore);
                }

              }
            }

            // 無分數無上限
            else if(i.groupScore == -99999){
              console.log('無分數無上限 :>> ');
              if(i.actualScore === Number.MAX_VALUE) var tempScore = 0

              if(this.includedInTotalScoreWithType1){
                // tab1
                if(this.qualifiedForIgnoredWithType1 && i.type == 0){
                  var tempScore = i.totalScore / 100
                  console.log('tempScore4 tab1 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType1 && i.type == 0 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : i.totalScore / 100
                  console.log('tempScore4 tab1 b:>> ',i.groupName , tempScore);
                }
                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = i.totalScore / 100
                  console.log('tempScore4 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : i.totalScore / 100
                  console.log('tempScore4 tab1 b:>> ',i.groupName , tempScore);
                }
              }
              else {
                // tab1
                if( i.type == 0){
                  var tempScore =  i.totalScore / 100
                }
                // tab2
                if(this.qualifiedForIgnoredWithType2 && i.type == 1){
                  var tempScore = i.totalScore / 100
                  console.log('tempScore4 tab2 a:>> ',i.groupName , tempScore);
                }
                else if(!this.qualifiedForIgnoredWithType2 && i.type == 1 ){
                  var tempScore = (i.numOfIgnored == i.numOfTotalItems) ? 0 : i.totalScore / 100
                  console.log('tempScore4 tab1 b:>> ',i.groupName , tempScore);
                }
              }
            }
          }
          
          console.log('tempScore >>>>>>>>', tempScore )
          n = n + tempScore
        })
        this.totalSumScore = Number(n.toFixed(3))

      }
      else if(hundredMarkType == -1){
        console.log('加分制')
        this.totalSumScore = 1
      }
      else if(hundredMarkType == 1){
        console.log('扣分制')
        this.totalSumScore = 100
      }
      console.log('this.totalSumScore =======>> ', this.totalSumScore)
    },



    // 加總
    getTotalSum(Array){
      var tableTotalScore = 0
      Array.forEach(i => {
        i.children.forEach( ii => {
          var isInfinity = this.getDoubleNum(ii.actualScore)
          if( isInfinity === Infinity) {
            tableTotalScore = tableTotalScore + 0
            } else {
              // 比例制
              console.log('來到比例制！ :~~~~~~~~~~~~~~~~~~~~~~~~~~~>> ');
              console.log('ii.actualScore :>> ', ii.actualScore);
              console.log('isInfinity :>> ', isInfinity);
              console.log('this.totalSumScore :>> ', this.totalSumScore);


              if(this.hundredMarkType.value == 0){
                if(ii.weight == -1 && i.type == 0){
                  tableTotalScore = tableTotalScore +  (ii.actualScore / this.totalSumScore) 
                  console.log('gogo 沒有權重啊 1！！ :>> ', ii.groupName, tableTotalScore);
                }
                else if(ii.weight !== -1 && i.type == 0){
                  // tableTotalScore = tableTotalScore + ii.actualScore * ii.weight / 100
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) 
                  console.log('gogo 有權重啊 :>> ' , ii.groupName, tableTotalScore);
                }
                else if(ii.weight == -1 && i.type == 1){
                  tableTotalScore = tableTotalScore +  (ii.actualScore / this.totalSumScore) 
                  // tableTotalScore.toFixed(1)
                  console.log('gogo 沒有權重啊 2！！ :>> ', ii.groupName, tableTotalScore);
                }
                else if(ii.weight !== -1 && i.type == 1){
                  // tableTotalScore = tableTotalScore + ii.actualScore * ii.weight / 100
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) 
                  console.log('gogo 有權重啊 :>> ' , ii.groupName, tableTotalScore);
                }
                else if(ii.weight == -1 && ii.type== 2){
                  tableTotalScore = tableTotalScore + ii.actualScore
                } 
                else if(ii.weight !== -1 && ii.type== 2){
                  tableTotalScore = tableTotalScore + ii.actualScore * ii.weight
                } 
              }

              // 加分制
              else if(this.hundredMarkType.value == -1){
                if(ii.weight == -1 && i.type == 0){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore) 
                }
                else if(ii.weight !== -1 && i.type == 0){
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) / 100
                }
                else if(ii.weight == -1 && i.type == 1){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore) 
                }
                else if(ii.weight !== -1 && i.type == 1){
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) / 100
                }
                else if(ii.weight == -1 && ii.type== 2){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore) 
                } 
                else if(ii.weight !== -1 && ii.type== 2){
                  tableTotalScore = tableTotalScore + ii.actualScore 
                } 
              }

              // 扣分制
              else if(this.hundredMarkType.value == 1){
                if(ii.weight == -1 && i.type == 0){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore)  *100
                }
                else if(ii.weight !== -1 && i.type == 0){
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) 
                }
                else if(ii.weight == -1 && i.type == 1){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore) *100
                }
                else if(ii.weight !== -1 && i.type == 1){
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) 
                }
                else if( ii.weight == 0  && ii.type == 2){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore)  *100
                }
                else if(ii.weight == -1 && ii.type== 2){
                  tableTotalScore = tableTotalScore + (ii.actualScore / this.totalSumScore)  *100
                } 
                else if(ii.weight !== -1 && ii.type== 2){
                  tableTotalScore = tableTotalScore + ((ii.actualScore * ii.weight) / this.totalSumScore) 
                } 
              }
            }
        })
      })
      if(!isNaN(parseFloat(tableTotalScore))){
        tableTotalScore = tableTotalScore.toFixed(1)
      }
      return tableTotalScore
    },

    
    getSum(Array){
      var totalScore = 0
      Array.forEach(i => {
        // 比例制
        if(this.hundredMarkType.value == 0){
          var isInfinity = this.getDoubleNum(i.actualScore)
          if( isInfinity === Infinity) {
            totalScore = totalScore + 0
          } else {
            if(i.weight == -1 && i.type == 0){
              totalScore = totalScore + i.actualScore / this.totalSumScore
              totalScore.toFixed(3)
              console.log('i.groupName totalScore tab1 (沒有權重)>> ', i.groupName, totalScore);
            } 
            else if(i.weight !== -1 && i.type == 0){
              totalScore = totalScore + ((i.actualScore * i.weight) / this.totalSumScore) 
              console.log('i.groupName totalScore tab1(有權重)>> ', i.groupName, totalScore);
            }
            else if(i.weight == -1 && i.type == 1){
              totalScore = totalScore + i.actualScore / this.totalSumScore
              totalScore.toFixed(3)
              console.log('i.groupName totalScore tab2(沒有權重)>> ', i.groupName, totalScore);
            } 
            else if(i.weight !== -1 && i.type == 1){
              totalScore = totalScore + ((i.actualScore * i.weight) / this.totalSumScore) 
              console.log('i.groupName totalScore tab2(有權重)>> ', i.groupName, totalScore);
            }
            
            else if( i.weight == -1 && i.type == 2 ){
              totalScore = totalScore + i.actualScore 
              console.log('i.groupName totalScore tab3(附加類別項)>> ', i.groupName, totalScore);
            }
            else if( i.weight !== -1 && i.type == 2 ){
              totalScore = totalScore + i.actualScore * i.weight
            }
          }
        }
        // 加分制
        else if(this.hundredMarkType.value == -1){
          console.log('加分制走這邊！')
          if(i.weight == -1 && i.type == 0){
            console.log('a ~~~~----->> ');
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore ) 
          }
          else if(i.weight !== -1 && i.type == 0){
            console.log('b ~~~~----->> ');
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore * i.weight ) / 100
          }
          if(i.weight == -1 && i.type == 1){
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore )
          }
          else if(i.weight !== -1 && i.type == 1){
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore * i.weight ) / 100
          }
          else if( i.weight == -1 && i.type == 2 ){
            totalScore = totalScore + i.actualScore 
          }
          else if( i.weight !== -1 && i.type == 2 ){
            totalScore = totalScore + i.actualScore  
          }
        }

        // 扣分制
        else if(this.hundredMarkType.value == 1){
          console.log('扣分制走這邊！')
          if(i.weight == -1 && i.type == 0){
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore )
          }
          else if(i.weight !== -1 && i.type == 0){
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore * i.weight / 100)
          }
          if(i.weight == -1 && i.type == 1){
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore =  totalScore + (i.actualScore )
          }
          else if(i.weight !== -1 && i.type == 1){
            if(i.actualScore === Number.MAX_VALUE) totalScore = 0
            else totalScore = totalScore + (i.actualScore * i.weight / 100)
          }
          else if( i.weight == 0  && i.type == 2 ){
            totalScore = totalScore + i.actualScore
          }
          else if( i.weight == -1  && i.type == 2 ){
            totalScore =totalScore + i.actualScore 
          }
          else if( i.weight !== -1  && i.type == 2 ){
            totalScore = totalScore + (i.actualScore * i.weight / 100)
          }
          
        }
      })

      if(!isNaN(parseFloat(totalScore))){
        totalScore = totalScore.toFixed(1)
      }
      return totalScore
    },




    // 四捨五入
    getDoubleNum (num) {
      num = util.isDouble(num,2);
      return Math.round(num * 100) / 100
    },

    getReportTemplateAndInfo() {
      const templatePromise = ReportSetting.getInspectReportTemplateList({ enable: true });
      console.log("this.report.reportId:",this.report.reportId);
      const reportInfoPromise = getInspectReportInfo({ reportIds: [this.report.reportId] });
      Promise.all([templatePromise, reportInfoPromise]).then(results => {

        console.log('results[0] :>> ', results[0]);
        this.getInspectTemplateList(results[0]);

        console.log('results[1] :>> ', results[1]);
        this.getReportInfo(results[1]);

        var hundredMarkType = results[1].data[0].inspectSettings.find( i => i.name == 'hundredMarkType')
        this.hundredMarkType = hundredMarkType
        // -1 - original mark system， 
        // 0 - hundred mark system, 
        // 1 - penalty point system
        
        this.setting_isShowGroupSum = (results[1].data[0].inspectSettings.find( i => i.name == "setting_isShowGroupSum")).value
        this.setting_isShowDistrictSum = (results[1].data[0].inspectSettings.find( i => i.name == "setting_isShowDistrictSum")).value

        console.log('this.setting_isShowGroupSum  :>> ', this.setting_isShowGroupSum );
        console.log('this.setting_isShowDistrictSum :>> ', this.setting_isShowDistrictSum);

        this.showMaxInfo = results[1].data[0].info.summary.some(i => i.isAdvanced == true)
        
        var includedInTotalScoreWithType1 = results[1].data[0].inspectSettings.find( i => i.name == "includedInTotalScoreWithType1")
        var qualifiedForIgnoredWithType1 = results[1].data[0].inspectSettings.find( i => i.name == "qualifiedForIgnoredWithType1")
        var qualifiedForIgnoredWithType2 = results[1].data[0].inspectSettings.find( i => i.name == "qualifiedForIgnoredWithType2")

        this.includedInTotalScoreWithType1 = includedInTotalScoreWithType1.value
        this.qualifiedForIgnoredWithType1 = qualifiedForIgnoredWithType1.value
        this.qualifiedForIgnoredWithType2 = qualifiedForIgnoredWithType2.value

        this.getTotalScore(results[1].data[0].info.summary , hundredMarkType.value)

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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },
    getAllDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return year + month + day + hour + min + sec
    },
    getDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      return year + month + day 
    },
    getOnlyDate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      return  month + day 
    },

    handleDownExcel(){
      console.log("download excel!!!");
      console.log("reportIds:",this.report.reportId);
      // const params = {
      //   beginTs:this.reportData.ts,
      //   endTs:this.reportData.ts,
      //   inspectTagId:this.reportData.tagId,
      //   reportIds:[this.report.reportId]
      // };

      const now = new Date()
      var nowTs = this.getAllDate(now)

      console.log('this.report', this.report)

      const conTableName = this.report.tagName
      const conStoreName = this.report.storeName


      this.showExportMassage = true
      const params = {
        beginTs: this.reportData.ts,
        endTs: this.reportData.ts,
        inspectTagId: this.reportData.tagId,
        reportIds: [this.report.reportId],
        fileName : nowTs + "-" + this.report.storeName + "_" + this.report.tagName + "Full_report_details" ,
        conTableName,
        conStoreName,
        requestTs : now.getTime()
        
      }

      exportEntireJsonUnit(params).then(res=>{
        console.log('res [1003]:>> ', res);
      })

      // const tHeader = [
      //   this.$t('remotePatrol.regionI'),
      //   this.$t('remotePatrol.regionII'),
      //   this.$t('remotePatrol.storeName'),
      //   this.$t('remotePatrol.storeCode'),
      //   this.$t('remotePatrol.inspectName'),//巡檢表名稱
      //   this.$t('remotePatrol.category'),
      //   this.$t('insSettingView.subCategory'),
      //   this.$t('overview.items'),
      //   this.$t('remotePatrol.inspectItemScore'),
      //   this.$t('remotePatrol.patrolResult'),
      //   this.$t('remotePatrol.inspectTotalScore'),//報告總分inspectSummary
      //   this.$t('remotePatrol.inspectSummary'), //巡檢總評
      //   this.$t('eventView.submitter'), //送出人
      //   this.$t('remotePatrol.exportAllDetail'),// 詳情
      //   this.$t('audit.inceptionRpt.attachment'),
      //   this.$t('titleView.description'),
      //   this.$t('remotePatrol.signatureInfo'), //簽到資訊-地圖link
      //   this.$t('remotePatrol.signInTime'),
      //   this.$t('remotePatrol.createRptDT'),
      //   this.$t('remotePatrol.patrolTime'),
      //   ];

      // downLoadInspectReportEntireDetail(params).then(res => {
      //   console.log("res:",res);
      //   const that = this;
      //   require.ensure([], async() => {
      //     const { export_json_to_excel } = require('@/excel/Export2Excel');
      //     const filterVal = ['province','city','storename','code', 'tagname', 'group', 'item', 'inspectitem','itemscore','result',
      //     'totlascore','status','submitter', 'detail', 'attachment','comment','singinmap','signints','reportts', 'timediff'];
      //     const curData = res.data;
      //     const tagName = this.report.tagName;
      //     const data = that.formatJson(filterVal, curData);
      //     const fileName = this.report.storeName+'_'+tagName+'_'+that.$t('remotePatrol.details') + '_' + util.getCurDateStr();
      //     export_json_to_excel(tHeader, data, fileName);
      //   });
      // }).catch(err => {
      //   console.log('RouteInspection-downItem: ' + err);
      // });
    },


    handleDown() {
      const self = this;
      if (self.hasAttachment !== 0) {
        // self.downloadProgress = true;
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
            self.$print(self.$refs.printPDF, null, self.$t('route.meta'));
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
      self.isAuditMode =self.$route.params.isAuditMode
      self.showEditBtn = self.$route.params.canEdit;
      self.showCancelBtn = self.$route.params.canCancel;
      const routeData = JSON.parse(sessionStorage.getItem('report_data'));
      self.deleteReportId = routeData.id
      console.log("report routeData:",routeData);
      if(routeData && !self.isAuditMode){
        const obj = {};
        console.log("self.$route.params.reportId:",self.$route.params.reportId);
        obj.reportId = routeData.id;
        obj.storeName = routeData.storeName;
        obj.status = routeData.status;
        obj.dateStr = util.getDateStr2(routeData.ts);
        obj.submitterName = routeData.submitterName;
        obj.tagName = routeData.tagName;
        obj.iconSrc = this.getIconSrc(routeData.status);
        obj.isCheckInIgnore = routeData.isCheckInIgnore
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
      }else{
        const obj = {};
        obj.reportId = self.$route.params.reportId;
        obj.storeName = '';
        obj.status = '';
        obj.dateStr = '';
        obj.submitterName = '';
        obj.tagName = '';
        obj.iconSrc = '';
        obj.inspectType = self.$t('overview.remotePatrol');
        obj.inspectSrc = self.inspectSrc;
        self.report = obj;
      }
    },

    getInspectStatus() {
      return new Promise((resolve, reject) => {
        getInspectStatus().then(res => {
          resolve(res);
          this.inspectStatus = res.data.settingContent.general_setting_inspect_status_name
          delete this.inspectStatus.update_time
          delete this.inspectStatus.update_user_id

            if(this.inspectStatus.is_customize_2 == false){
            this.inspectStatus.status_2 = this.$t('overview.echartGood')
          }
          if(this.inspectStatus.is_customize_1 == false){
            this.inspectStatus.status_1 = this.$t('overview.improve')
          }
          if(this.inspectStatus.is_customize_0 == false){
            this.inspectStatus.status_0 = this.$t('overview.danger')
          }
          console.log('this.inspectStatus~~~~~ :>> ', this.inspectStatus);

        }).catch(err => {
          reject(err);
        });
      });
    },

    getIconSrc(status) {
      const statusAndLangAndIconMap = [
        {
          status: 0,
          statusStr: this.inspectStatus.status_0, // Poor
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
          statusStr: this.inspectStatus.status_1, // Fair
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
          statusStr: this.inspectStatus.status_2, // Good
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
      if(item.isH265){
          util.notify(this.$t('eventView.videoFormatNotSupoort'), 'warning', 3 * 1000);
          return;
      }
      self.dialogCommentVideo = true;
      self.$nextTick(function() {
        var video = document.getElementById('previewVideo');
        this.previewplayer = videojs(video);
        this.previewplayer.src({ src: item.isH265 ? '' : item.url });
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
      const self = this;
      if (res.errCode === 0 && res.data.length > 0) {
        const data = res.data[0].info;

        switch (data.mode) {
          case 0:
            self.report.inspectSrc = self.inspectSrc;
            self.report.inspectType = self.$t('overview.remotePatrol');
            break;
          case 1:
            console.log("data.mode:",data.mode);
            self.report.inspectSrc = self.insiteInspectSrc;
            self.isInsiteInspect = true;
            self.report.inspectType = self.$t('overview.onsitePatrol');
            self.showEditBtn = false;
            break;
        }
        console.log('this.report :>> ', this.report);


        this.report.storeName = data.storeName;
        this.report.status = data.status;
        this.report.dateStr = util.getDateStr2(data.ts);
        this.report.submitterName = data.submitterName;
        this.report.tagName = data.tagName;
        this.report.iconSrc = this.getIconSrc(data.status);
        //this.getStoreLongitudeLatitude(data.storeId);
        this.totalScore = data.totalScore;
        this.standard = data.standard;
        this.allRemarkItemsFlag = res.data[0].info.type === 1
        this.standardMsg = util.setStandardMsg(this.standard);
        this.checkinInfo = data.checkinRecord ? `${i18n.t('remotePatrol.checkinSuccess')}  ( ${util.getDateStr2(data.checkinRecord.ts)} )`: '';
        this.weatherImg = data.weatherInfo ? data.weatherInfo.icon : '';
        this.signaturesList = this.isInsiteInspect && data.signatures ? data.signatures : [];
        this.reportData = data;

        this.auditState = data.auditState;
        this.hasSignRecord = res.data[0].inspectSettings.filter(settingItem => settingItem.name === 'checkin')[0].value;
        if(data.checkinRecord && this.hasSignRecord){
          this.signInTime = util.getDateStr2(data.checkinRecord.ts);
          this.inceptionExecutTime = util.getDiffTimeStr(data.ts,data.checkinRecord.ts);
          this.signMapUrl = data.checkinRecord.report_sign_map_url;
          this.signInDistance = data.checkinRecord.execute_sign_distance ;
        }

        this.getGroupsData(data.groups);
        this.getTab1AndTab3BtnName(res.data[0].inspectSettings);

        console.log("this.reportData 1-->>>",this.reportData);
        await this.getPageDataBasedOnTemplate(this.reportData);

        this.backSheetGroup = this.getGroupsItems(-1);
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
          // console.log("**item:",item);
          const details = {};
          details.itemId = item.id;
          details.subject = item.subject;
          details.comment = item.comment;
          details.description = item.description;
          details.grade = item.score;
          details.qualifiedScore = item.qualifiedScore;
          details.itemScore = item.itemScore;
          details.type = item.type;
          details.isImportant = item.isImportant;
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

      console.log('data 2:>> ', data);

      const map = this.getDetailNameAndHandlerMap(data);

      this.sortArrayByKey(this.templateConfig, 'position');
      const pageData = [];

      this.templateConfig.forEach(config => {
        if (map.has(config.name)) {
          const fnName = map.get(config.name);
          const returnDataJson = this[fnName](data);
          returnDataJson.name = config.name;
          pageData.push(returnDataJson);

          console.log('returnDataJson :>> ', returnDataJson);
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
      if (this.isInsiteInspect && this.hasSignRecord) {
        const mapObj = { name: 'signatureInfo', class: 'signature-map', ifExpand: false, distance: this.signInDistance, data:this.signMapUrl };
        pageData.push(mapObj);
      }
      this.pageData = pageData;
      console.log('this.pageData ~~~~>> ', this.pageData);

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
      console.log("summary:",summary);
      const summaryTree = util.handleInspctionCatergyTree(summary, 'groupId');
      summaryTree.forEach(item => {
        if (!item.children) {
          item.children = [];
          if(item.isAdvanced){
            if(item.groupScore<=0){
              item.actualScore = (this.getDoubleNum(item.actualScore) != Infinity && item.actualScore<item.groupScore)?item.groupScore:item.actualScore;
            }else{
              item.actualScore = (this.getDoubleNum(item.actualScore) != Infinity && item.actualScore>item.groupScore)?item.groupScore:item.actualScore;
            }
          }
          item.children.push(item);
        } else {
          let weight = item.weight;
          item.children.forEach(child => {
            weight = child.weight;
            if(child.isAdvanced){
              //console.log("sub item:",child.groupName);
              if(child.groupScore<=0){
                //console.log("1.groupScore:",child.groupScore);
                child.actualScore = (this.getDoubleNum(child.actualScore) != Infinity && child.actualScore<child.groupScore)?child.groupScore:child.actualScore;
                //console.log("1.actualScore:",child.actualScore);
              }else{
                child.actualScore = (this.getDoubleNum(child.actualScore) != Infinity && child.actualScore>child.groupScore)?child.groupScore:child.actualScore;
                //console.log("2.actualScore:",child.actualScore);
              }
            }
            item.weight = weight;
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
      console.log("this.backSheetGroup:",this.backSheetGroup);
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
      console.log("1.summaryTree:",summaryTree);
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

          if(summaryItem.children[0].weight != summaryItem.weight){
            summaryItem.weight = summaryItem.children[0].weight;
          }
        }
      });
      //console.log("2.summaryTree:",summaryTree);
      const filterTree = summaryTree.filter(item => item.numOfTotalItems !== item.numOfCommentItems);
      return filterTree;
    },

    addChildrenDataToParent(jsonArr, key) {
      const arr = Array.isArray(jsonArr) ? jsonArr : [jsonArr];
      let sum = 0;
      if (arr.length > 1) {
        sum = arr.reduce((accumulator, cur) => {
          return accumulator + cur[key];
        },0);
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
          obj.feedbackId = item.id,
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

                // audioObj.audioSrc = _item.url;
                // audioObj.audioRef = 'audioRef' + _index;
                // audioObj.isPlaying = false;
                // audioObj.audioOftenText = '';
                // audioObj.hasNotPlayAudio = true;
                obj.audioList.push({
                  audioSrc: _item.url,
                  audioRef: 'audioRef' + _index,
                  isPlaying : false,
                  audioOftenText: "",
                  hasNotPlayAudio: true
                });
                obj.showAudio = true;
                

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
      let mapArr = []
      this.chartLabelArr = [];
      var templabe = [];

      summary.forEach((item, index) => {
        const obj = {};
        obj.name = item.groupName;
        obj.max = Number(item.numOfQualifiedItems + item.numOfUnqualifiedItems) === 0
          ? 1
          : Number(item.numOfQualifiedItems + item.numOfUnqualifiedItems);
        //tempIndicator.push(obj);
        //this.staticalConfig.qualified
        //  ? seriesValue.push(item.numOfUnqualifiedItems)
        //  : seriesValue.push(item.numOfQualifiedItems);
        if (index < 2) {
          tempIndicator.push(obj);
          this.staticalConfig.qualified
            ? seriesValue.push(item.numOfUnqualifiedItems)
            : seriesValue.push(item.numOfQualifiedItems);
        } else {
          tempIndicator.splice(1, 0, obj);
          this.staticalConfig.qualified
            ? seriesValue.splice(1, 0, item.numOfUnqualifiedItems)
            : seriesValue.splice(1, 0, item.numOfQualifiedItems);
        }
        let arrObj = {
          name:item.groupName,
          value:this.staticalConfig.qualified ? item.numOfUnqualifiedItems:item.numOfQualifiedItems
        }
        templabe.push(arrObj);
      });

      /*for(var i=0; i<tempIndicator.length;i++){
        let arrObj = {
          name:tempIndicator[i].name,
          value:seriesValue[i]
        }
        templabe.push(arrObj);
      }*/
      console.log(tempIndicator, seriesValue)
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
          show:false,
          backgroundColor:'#FFF',
          extraCssText: "box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);",
          textStyle:{
            color:'#484848',
            fontStyle:' NotoSansCJKtc',
            fontSize: '15px',
            fontEeight: 'normal',
          }
        },
        grid: {
          width:'auto',
          containLabel:true,
          tooltip: {
            trigger: "none"
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
        if (summaryIndex < 9) {
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
      seriesData.forEach(item => {
        const objl = {};
        objl.name = item.name;
        objl.value = ((item.value/totalItem)*100).toFixed(1);
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

    adjustChart(){},
    doGetFeebackItem(){
      console.log('this.reportData:',this.reportData);
      return Promise.all(
        this.reportData.feedback.map(item=>{
          var obj={
            id:item.id,
            eventName:item.subject,
            eventDes:(item.attachment.length>0)?item.attachment[0].url:'',
            sourceObj:null,
            sourceList:[]
          }
          for(var att in item.attachment){
            if(item.attachment[att].mediaType == 2){
              var objsource = {
                mediaType:2,
                height: '100px',
                width: '140px',
                fileName:item.attachment[att].url.substring(item.attachment[att].url.lastIndexOf('/')+1),
                src:item.attachment[att].url,
                deviceId:item.attachment[att].deviceId,
                hasUrl:true
              }
             obj['sourceObj']  = objsource;
            }else{
              var objAtt = {
                mediaType:item.attachment[att].mediaType,
                src:item.attachment[att].url,
                deviceId:item.attachment[att].deviceId,
              }
              obj.sourceList.push(objAtt);
            }

          }
          return obj;
        })
      ).then(result=>{
        console.log("doGetFeebackItem:",result);
        if(result.length ==  this.reportData.feedback.length)
          return result;
      })
    },
    doGetSheetName(){
      console.log("backSheetGroup:",this.backSheetGroup);
      return Promise.all(
        this.backSheetGroup.map(item=>{
          var obj={
            cateryId:item.groupId, //最上面藍色頁籤
            cateryLabel:item.groupName,
            inspectList: (item.children)?item.children:item.cateryItems
          }
          /*for(var incep in item.cateryItems){
            var objincep = {
               groupId:incep.groupId,
               groupName:incep.groupName,
               items:incep.cateryItems
            }
            obj.inspectList.push(objincep);
          }*/
          return obj;
        })
      ).then(result=>{
        console.log("doGetSheetName:",result);
        if(result.length ==  this.reportData.feedback.length)
          return result;
      })
    },
    async getWorkFloBind(){
      const self = this;
      var isBindWorkflow = true;
      const params = {
        storeId: self.reportData.storeId,
        mode: 0,
        authorizedOnly: this.enableMimicMode?0:1,
        tagName: self.patrolstore,
        inspectId: self.reportData.tagId,
        isMysteryMode:this.enableMimicMode
      };
      const result = await checkOutInspectItemV3(params);
      console.log(">>>>>getWorkFloBind result:",result);
      if(result.errCode == 0) isBindWorkflow = result.data.isBindWorkflow;
      return isBindWorkflow;
    },
    async goBackRemoteInception(){
      const self = this;
      let isStillBind = await self.getWorkFloBind();

      if(!isStillBind){
        console.log(">>>>isStillBind:",isStillBind)
        self.workflowUnbindDialogShow = true;
        return;
      }else{
        console.log("goBackRemoteInception");
        self.$store.dispatch('setPatrolComment', {suggest:self.reportData.comment, status:self.reportData.status});
        var BackPatrolParam = {
          isEdit:true,
          reportId:self.report.reportId,
          reportStaus:self.reportData.status,
          reportComment:self.reportData.comment,
          tagId:self.reportData.tagId,
          tagName : self.reportData.tagName,
          backSheetGroup:self.backSheetGroup,
          activeIndex : 0,
          store:self.reportData.storeId,
          auditCancelable:self.showCancelBtn,
          //hasIgnoretemp:[],//略過的巡檢項內容
          //inspectItemList:[], //當下巡檢項內容
          eventList:await self.doGetFeebackItem(), ////問題回饋內容 info.feedback"
          curSheetIndex:0,
          curGroupIndex:0,
          curItemIndex:0,
          curItemId:0
        };

        var params = {
          isEdit:true,
          reportComment:this.reportData.comment
        };
        if(self.auditState!=3 && self.auditState!=6  && self.auditState!=7){//撤回跟駁回不需要再drawback
        console.log("doDrawbak!!!!");
          var drawbackParam = {inspectReportId:self.report.reportId};
          taskDrawback(drawbackParam).then(res=>{
              self.$store.dispatch('setBackPatrolParam', BackPatrolParam);
            /*self.$store.dispatch('setStoreList', self.storeList);*/
            self.$store.dispatch('setStoreCache', self.reportData.storeId);
            this.$router.push({ name: 'remotePatrol', params: params });
          }).catch(err=>{
            util.notify(self.$t('audit.inceptionRpt.editAuditFail')+':'+err, 'warning', 3000);
            self.$store.dispatch('setBackPatrolParam', BackPatrolParam);
            self.$store.dispatch('setStoreCache', self.reportData.storeId);
            this.$router.push({ name: 'remotePatrol', params: params });
          });
        }else{//除非送簽者自己回去編輯
          self.$store.dispatch('setBackPatrolParam', BackPatrolParam);
          self.$store.dispatch('setStoreCache', self.reportData.storeId);
          this.$router.push({ name: 'remotePatrol', params: params });
        }
      }
    },
    doCancelAudit(){
      console.log("doCancelAudit");
      this.cancelAuditDialogShow=true;
    },
    onCancelAudit(){
      this.cancelAuditDialogShow=false;
    },
    onConfirmCancelAudit(){
      const self = this;
      CancelWorkflow({inspectReportId:self.report.reportId}).then(res=>{
        if(res.errCode==0){
          self.$router.push({ name: 'SendAuditManage',params:{curTabIndx:2} });
          this.cancelAuditDialogShow=false;
        }else{
          this.cancelAuditDialogShow=false;
          util.notify(self.$t('audit.inceptionRpt.cancelAuditFail'), 'warning', 3000);
        }
      }).catch(err =>{
        console.log("CancelWorkflow fail:",err);
        this.cancelAuditDialogShow=false;
        util.notify(self.$t('audit.inceptionRpt.cancelAuditFail'), 'warning', 3000);
      });

    },
    doGetTaskInfo(){
      var resWorkflowTask = GetTaskInfo(self.report.reportId);
    },
    getStoreLongitudeLatitude(storeId){
      getDetailedStoreInfo({storeId}).then(res => {
        this.storeLatitude = res.data.latitude;
        this.storeLongitude = res.data.longitude;
      }).catch(err => {
        console.log('getStoreLongitudeLatitude: ' + err);
      });
    },
    getSingnInDistance(lat1, lon1, lat2, lon2) {
    	if ((lat1 == lat2) && (lon1 == lon2)) {
    		return 0;
    	}
    	else {
    		var radlat1 = Math.PI * lat1/180;
    		var radlat2 = Math.PI * lat2/180;
    		var theta = lon1-lon2;
    		var radtheta = Math.PI * theta/180;
    		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    		if (dist > 1) {
    			dist = 1;
    		}
    		dist = Math.acos(dist);
    		dist = dist * 180/Math.PI;
    		dist = dist * 60 * 1.1515;
        //距離幾公尺
         dist = dist * 1609.344; //公尺
    		//if (unit=="K") { dist = dist * 1.609344 }//公里
    		//if (unit=="N") { dist = dist * 0.8684 }//海里
    		return dist;
    	}
    }
  }
};
</script>

<style lang="sass" scoped>
  .submit_btn
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
  .comfirm_delete_report
    h3
      color: red
  .l_row
    margin-bottom: 20px
  .delete_btn_row
    display: flex
    flex-direction: row
    align-items: flex-end
    justify-content: flex-end
    .cancel-btn
    .confirm-btn
      color: #FFF
    .is-disabled
      background-color: #dcdfe9
      border-color: #dcdfe9
      &:hover
        background-color: #dcdfe9
        border-color: #dcdfe9
</style>

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
  .print {
    // transform: scale(.8);
    zoom: .5;
  }
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
      height: auto;
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
        // height: calc(20/1440*100vw);
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
      .workflow-edit{
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
      }
      .splitline{
          width:100%;
          border-bottom: 1px solid rgba(172,174,177,.3);
          margin: 20px 0;
      }
      .left-header{
        width: 100%;
        align-items: center;
        display: flex;
        height: 25px;
        .font-15 {
          font-size: 15px;
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
            // height: 40px;
            display:flex;
            flex-direction: row;
            align-items: flex-start;
            text-align: left;
            margin-bottom: 12px;

            .pie-color{
              width:18px;
              height: 18px;
              margin-left: 12px;
            }
            .pei-item-name{
              margin-left:calc(12/1440*100vw);
              color: #484848;
              width:calc(180/1440*100vw);
              // height: 18px;
              font-size: 15px;
              margin-top: -2px;

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
      .signature-map{
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

<style lang="sass" scoped>
  .spacer
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
  .ignoreSign
    width: fit-content
    border-radius: 4px
    font-size: 12px
    color: #989ca0
    background: #EFEFEF
    padding: 5px
    margin-left: 10px
</style>
