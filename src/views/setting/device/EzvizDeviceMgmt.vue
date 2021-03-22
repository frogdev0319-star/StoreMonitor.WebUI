<template>
  <el-row :style="{'height':varyWindowHeight-170+'px'}" class="el-device">
    <el-col :span="24" class="el-btns">
      <div v-if="activeName === 'device'" class="device-btns">
        <el-input
          v-if="false"
          v-model="serachVale"
          :placeholder="$t('deviceView.searchInfo')"
          size="small"
          class="el-search-input"
          @keyup.enter.native="searchNVRList">
          <i slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:7px;left:6px;" @click="searchNVRList"/>
        </el-input>
        <el-button
          v-for="(item,index) in btnList"
          :key="index"
          :class="lang === 'en' ? 'en-el-handle-btn' : 'el-handle-btn'"
          :disabled="index === 2"
          size="mini"
          @click="handleNVR(index,item)">
          <div class="btn-area">
            <i :class="item.iconClass" style="font-size:24px;"/>
            <span>{{ item.btnTitle }}</span>
          </div>

        </el-button>
      </div>
      <div v-else style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;">
        <el-button
          :class=" lang === 'en' ? 'en-el-delete-btn' : 'el-delete-btn'"
          size="mini"
          type="primary"
          class="btn-class"
          @click="callChildAdd"
        >
          <div class="btn-area">
            <i class="iconfont el-icon-plus"/>
            <span>{{ $t('deviceView.addEzvizAccount') }}</span>
          </div>
        </el-button>
      </div>
      <el-col
        :span="varWindowWidth < 1540 ? 12:10"
        :style="varWindowWidth < 1366 ? {'font-size':'12px'}:{'font-size':'14px'}"
        class="dash-content">
        <el-dialog
          v-if="showImportContent"
          id="importId"
          :title="$t('deviceView.import')"
          :visible.sync="showImportContent"
          :close-on-click-modal="false"
          :append-to-body="true"
          width="28%"
          top="35vh"
          left="40vh">
          <div class="dialog-content" style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #dfe2e9;">
            <p style="margin-left:25px;margin-bottom:0px;">{{ $t('deviceView.selectFilePos') }}</p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" size="mini" style="" @click="showImportContent = false">{{ $t('deviceView.cancle') }}</el-button>
            <a href="javascript:;" class="a-upload" @click="checkBeforeImport">{{ $t('deviceView.selectFile') }}
              <input
                id="upload"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @change="importfxx(this)" >
            </a>
          </div>
        </el-dialog>
        <el-dialog
          v-if="showConfirmImport"
          :title="$t('deviceView.prompt')"
          :visible.sync="showConfirmImport"
          :append-to-body="true"
          :close-on-click-modal="false"
          width="28%"
          top="35vh"
          left="40vh">
          <div class="dialog-content" style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #dfe2e9;">

            <p style="margin-left:25px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
              <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"/>
              <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.clearInfo') }}</span>
            </p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" size="mini" style="" @click="showConfirmImport = false">
              {{ $t('deviceView.cancle') }}
            </el-button>
            <el-button
              class="file-confirm-btn"
              size="mini"
              type="primary"
              @click="showImportContent = true; showConfirmImport = false">
              {{ $t('deviceView.confirm') }}
            </el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-col>
    <el-col :span="24" class="el-tabPanels">
      <el-tabs id="en-devicetabs-content" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('deviceView.ezvizAccountSetting')" name="ezvizAccount">
          <ezviz-account ref="ezvizAccount"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('deviceView.deviceManage')" name="device">
          <el-col :span="lang === 'en' && varWindowWidth < 1920? 11 : 11" class="lisde">
            <div class="nvr-info">
              <span class="info-title">{{ $t('deviceView.deviceInfo') }}</span>
              <el-button
                type="primary"
                size="mini"
                class="add-btn btn-class"
                @click="showAddDialog">
                <i class="iconfont el-icon-plus"/><span>{{ $t('deviceView.addDevice') }}</span>
              </el-button>
            </div>
            <div class="nvr-title tabTitle">
              <div :class="lang === 'en' ? 'en-comment-title' : 'comment-title'" class="titles">
                <span/>
              </div>
              <div :class="lang === 'en' ? 'en-name-title' : 'name-title'" class="titles">
                <span>{{ $t('deviceView.deviceName') }}</span>
                <i
                  :class="{'el-icon-arrow-up':nvrFilter,'el-icon-arrow-down':!nvrFilter}"
                  class="icon-filter"
                  @click="filterNVR"/>
              </div>
              <div :class="lang === 'en' ? 'en-model-title': 'model-title'" class="titles">
                <span>{{ $t('deviceView.ezvizAccount') }}</span>
                <i
                  :class="{'el-icon-arrow-up':modelFilter,'el-icon-arrow-down':!modelFilter}"
                  class="icon-filter"
                  @click="filterAccount"/>
              </div>
              <div :class="lang === 'en' ? 'en-store-title': 'store-title'" class="titles" >
                <span>{{ $t('deviceView.store') }}</span>
                <i
                  :class="{'el-icon-arrow-up':storeFilter,'el-icon-arrow-down':!storeFilter}"
                  class="icon-filter"
                  @click="filterStore"/>
              </div>
              <div :class="lang === 'en' ? 'en-count-title': 'count-title'" class="titles" >
                <span>{{ $t('deviceView.channelNum') }}</span>
              </div>
            </div>
            <el-scrollbar id="el-menuscrollbar" style="height:100%;">
              <div :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                <div
                  v-for="(item,index) in nvrData"
                  :key="index"
                  :class="`${!item.isClick ? 'noraml-color' : 'active-color'}  ${item.comment.length > 0 ? 'tooltip-color' : ''}`"
                  class="nvr-data group-title"
                  @click="clickNVR(index,item)" >
                  <div v-if="item.isClick" class="proper-flag"/>
                  <div :style="{visibility: (item.comment!= '') ? 'visible': 'hidden' }" class="comment-data titles">
                    <el-tooltip
                      :content="item.comment"
                      :popper-class="elTooltipClass"
                      effect="dark"
                      placement="bottom">
                      <div slot="content">{{ $t('deviceView.failedReason') }}<br>{{ item.comment }}</div>
                      <span style="margin-left: 10%; color: #fea316;"><i class="iconfont icon-jinggao2"/></span>
                    </el-tooltip>
                  </div>
                  <div class="name-data titles">
                    <el-tooltip
                      :content="item.tempNvrName"
                      :popper-class="elTooltipClass"
                      class="item"
                      effect="dark"
                      placement="bottom">
                      <span>{{ item.tempNvrName.length > 15? item.tempNvrName.substr(0,15)+'...' : item.tempNvrName }}</span>
                    </el-tooltip>
                  </div>
                  <div class="model-data titles">
                    <span>{{ item.tempEzvizAccount }}</span>
                  </div>
                  <div class="store-data titles">
                    <el-tooltip
                      :content="item.store"
                      :popper-class="elTooltipClass"
                      class="item"
                      effect="dark"
                      placement="bottom">
                      <span>{{ item.store.length>7?item.store.substr(0,7)+'...':item.store }}</span>
                    </el-tooltip>
                    <!--<span>{{item.store}}</span>-->
                  </div>
                  <div class="count-data titles">
                    <span>{{ item.tempChannelCount }}{{ $t('deviceView.unit') }}</span>
                  </div>
                  <div class="operation-data titles">
                    <div v-if="!item.ifCanAdd" class="iconcontent">
                      <div class="iconlised" style=" border: none; color:#2c3e50;font-weight: normal;background-color: rgba(255,255,255,0)" @click.stop="editSingleNvr(index,item)">
                        <!--:style="{visibility: (item.ifCanEdit == true) ? 'visible': 'hidden' }"-->
                        <i class="iconfont icon-bianji"/>
                      </div>
                      <div class="iconrised" style="border: none; color:#2c3e50; font-weight: normal;" @click="showConfirmDelete=true">
                        <i class="iconfont icon-shanchu"/>
                      </div>
                    </div>
                  </div>
                </div>
                <el-dialog
                  v-if="showConfirmDelete"
                  :title="$t('deviceView.prompt')"
                  :visible.sync="showConfirmDelete"
                  :append-to-body="true"
                  :close-on-click-modal="false"
                  width="510px"
                  top="35vh"
                  left="40vh">
                  <div class="dialog-content" style="overflow:hidden;width:100%;">
                    <hr style="border: 0.5px solid #dfe2e9;">

                    <p style="margin-left:25px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                      <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"/>
                      <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteInfo') }}</span>
                    </p>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button class="file-cancel-btn" size="mini" style="" @click="showConfirmDelete = false">
                      {{ $t('deviceView.cancle') }}
                    </el-button>
                    <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteSingleNVR()">
                      {{ $t('deviceView.confirm') }}
                    </el-button>
                  </div>
                </el-dialog>
              </div>
            </el-scrollbar>
            <div class="toolbar pagination" style="width:100%; margin-top:10px; margin-bottom:20px;">
              <el-pagination
                :page-size="sizeNum"
                :total="total"
                :current-page="page"
                style="text-align:right;margin-right:15px;"
                background
                small
                layout="jumper,total,prev,pager,next"
                @size-change="sizeChange"
                @current-change="currentChange"/>
            </div>
          </el-col>
          <el-dialog
            v-if="showAddNvrDialog"
            :title="isAddAgain ? $t('deviceView.updateDevice') : $t('deviceView.addDevice')"
            :visible.sync="showAddNvrDialog"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="510px"
            top="35vh"
            left="40vh"
            custom-class="addNvr"
          >
            <div class="dialog-content" style="overflow:hidden;width:100%;">
              <hr style="border: 0.5px solid #dfe2e9;">
              <el-form
                ref="nvrForm"
                :model="addDeviceData"
                :rules="rules"
                class="nvrForm"
                label-position="top"
                size="mini">
                <el-form-item style="height: 57px;">
                  <el-col :span="13">
                    <el-form-item :label="$t('deviceView.serialNum')" prop="serialNumber" style="margin-bottom:0;">
                      <el-input
                        v-model="addDeviceData.serialNumber"
                        :disabled="isAddAgain"
                        style="width: 100%;"
                        @input="(val)=>serialNumberChange(val)"
                        @blur="notShowInputRuleTips('serialNum')"/>
                      <span v-if="serialRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" :offset="2">
                    <el-form-item :label="$t('deviceView.validationCode')" prop="validationCode" style="margin-bottom:0;">
                      <el-input
                        v-model="addDeviceData.validationCode"
                        style="width: 100%;"
                        @input="validateCodeChange"
                        @blur="notShowInputRuleTips('validationCode')"/>
                      <span v-if="validateRuletip" class="rules">{{ $t('deviceView.validateRuletip') }}</span>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="height: 57px;">
                  <el-col :span="13">
                    <el-form-item :label="$t('deviceView.deviceName')" prop="name" style="margin-bottom:0;">
                      <el-input v-model="addDeviceData.name" style="width: 100%;" @input="deviceNameChange" @blur="notShowInputRuleTips('deviceName')"/>
                      <span v-if="deviceRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" :offset="2">
                    <el-form-item :label="$t('deviceView.deviceChannelNum')" prop="channelCount">
                      <el-select v-if="isAddAgain" v-model="addDeviceData.channelCount" size="mini">
                        <el-option
                          v-for="numList in editNvrChannelNumList"
                          :key="numList.value"
                          :label="numList.label"
                          :value="numList.value"
                          :disabled="numList.disabled"
                        />
                      </el-select>
                      <el-select v-else v-model="addDeviceData.channelCount" size="mini">
                        <el-option
                          v-for="numList in channelNumList"
                          :key="numList.value"
                          :label="numList.label"
                          :value="numList.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item :label="$t('deviceView.EzvizAccount')" prop="ezvizAccount">
                  <el-select v-model="addDeviceData.ezvizAccount" style="width: 100%;">
                    <el-option
                      v-for="item in ezvizAccountList"
                      :key="item.id"
                      :label="item.accountName"
                      :value="item.ezvizAccount"/>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceView.store')" prop="storeId">
                  <el-select
                    v-model="addDeviceData.storeId"
                    :disabled="isAddAgain"
                    :filter-method="filterStoreOption"
                    filterable
                    style="width: 100%;">
                    <el-option
                      v-for="item in storeDataList"
                      :key="item.storeId"
                      :label="item.label"
                      :value="item.storeId"/>
                  </el-select>
                  <span class="add-label" style="color: rgb(254, 163, 22); display: block">
                    <span style="margin-right: 10px;font-size: 10px;">*</span>{{ $t('deviceView.selectStoreInfo') }}
                  </span>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button
                class="file-cancel-btn"
                size="mini"
                style=""
                @click="showAddNvrDialog = false">{{ $t('deviceView.cancle') }}</el-button>
              <el-button
                class="file-confirm-btn"
                size="mini"
                type="primary"
                @click="addSingleNvr">{{ $t('deviceView.confirm') }}</el-button>
            </div>
          </el-dialog>
          <el-col :span="lang === 'en' && varWindowWidth < 1920? 13: 13" class="risde">
            <div class="nvr-info">
              <span class="info-title">{{ $t('deviceView.channelSetting') }}</span>
              <el-button
                :disabled="channelBtnDisabled"
                type="primary"
                size="mini"
                class="add-btn btn-class"
                @click="addNewChannel">
                <i class="iconfont el-icon-plus"/><span>{{ $t('deviceView.addChannel') }}</span>
              </el-button>
            </div>
            <div :class="lang === 'en'? 'en-nape-items-title tabTitle':'nape-items-title tabTitle'">
              <div class="nape-name-title titles">
                <span>{{ $t('deviceView.channelName') }}</span>
              </div>
              <div class="nape-dep-title titles">
                <span>{{ $t('deviceView.devChannelNum') }}</span>
              </div>
              <div class="nape-picture-title titles">
                <span>{{ $t('deviceView.thumbnail') }}</span>
              </div>
              <div class="nape-handle-title titles">
                <span>{{ $t('deviceView.operation') }}</span>
              </div>
            </div>
            <el-scrollbar id="el-menuscrollbar" style="height:100%;">
              <div :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                <div
                  v-for="(item,index) in channelList"
                  :style="item.isClick?{'background-color':'#FEE4E7'}:{}"
                  :key="index"
                  class="nape-items-data">
                  <div class="nape-name-data">
                    <span v-if="!item.isClick" class="nape-name">
                      {{ item.name.length>15?item.name.substr(0,15)+'...':item.name }}
                    </span>
                    <el-input
                      v-if="item.isClick"
                      v-model="item.tempName"
                      :placeholder="$t('deviceView.inputInspectName')"
                      size="mini"
                      class="nape-input input-details"
                      @input="(val)=>channelNameChange(val,item)"/>
                  </div>
                  <div class="nape-dep-data">
                    <span v-if="item.id !== 0 " class="nape-dep">{{ item.channelId }}</span>
                  </div>
                  <div :class="lang=='en'? 'en-nape-picture-data' : ''" class="nape-picture-data">
                    <span v-if="item.tempUrl">
                      <el-image v-if="!isUpdate" :src="item.tempUrl" class="img-class">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"/>
                        </div>
                      </el-image>
                      <el-image v-else :src="`${item.tempUrl +'?'+Math.random()}`" class="img-class">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"/>
                        </div>
                      </el-image>
                    </span>
                    <span v-else class="img-class" style="display: inline-block;background: #cccc;">
                      <span style="color: #94a4b4;">{{ $t('deviceView.noImage') }}</span>
                    </span>
                    <el-upload
                      v-if="item.isClick"
                      :before-upload="beforeAvatarUpload"
                      :on-change="handleEditChange"
                      class="upload-demo"
                      action=""
                      list-type="picture">
                      <el-button size="mini" type="primary">
                        <span class="edit-picture">{{ $t('deviceView.editImage') }}</span>
                      </el-button>
                    </el-upload >
                  </div>
                  <div class="nape-items-handle">
                    <div v-if="item.isClick" class="iconcontent">
                      <div class="iconlised" @click="confrimEdit(index,item)">
                        <i class="el-icon-check"/>
                      </div>
                      <div class="iconrised" @click="cancelEdit(index,item)">
                        <i class="el-icon-close"/>
                      </div>
                    </div>
                    <div v-if="!item.isClick">
                      <i
                        class="iconfont icon-bianji"
                        style="cursor:pointer;margin-right:10px;"
                        @click="handleEdit(index,item)"/>
                      <i
                        class="iconfont icon-shanchu"
                        style="cursor:pointer;margin-right:10px;"
                        @click="handleDelete(index, item)"/>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <el-dialog
              v-if="showDeleteChannel"
              :title="$t('deviceView.prompt')"
              :visible.sync="showDeleteChannel"
              :append-to-body="true"
              :close-on-click-modal="false"
              width="510px"
              top="35vh"
              left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;">

                <p style="margin-left:25px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"/>
                  <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteChannel') }}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteChannel = false">{{ $t('deviceView.cancle') }}</el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteSingleChannel()">{{ $t('deviceView.confirm') }}</el-button>
              </div>
            </el-dialog>
            <el-dialog
              v-if="showAddChannelDialog"
              :title="$t('deviceView.addChannel')"
              :visible.sync="showAddChannelDialog"
              :append-to-body="true"
              :close-on-click-modal="false"
              width="510px"
              top="35vh"
              left="40vh"
              custom-class="addNvr"
            >
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;">
                <el-form ref="channelForm" :model="addChannelData" :rules="channelRules" class="nvrForm" label-position="top" size="mini">
                  <el-form-item style="height: 57px;">
                    <el-col :span="12">
                      <el-form-item :label="$t('deviceView.channelName')" prop="name" style="margin-bottom:0;">
                        <el-input v-model="addChannelData.name" style="width: 100%;" @input="(val)=>channelNameChange(val,{})" @blur="notShowInputRuleTips('channelName')"/>
                        <span v-if="channelNameRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item :label="$t('deviceView.devChannelNum')" prop="channelId">
                        <el-select v-model="addChannelData.channelId" size="mini" filterable>
                          <el-option
                            v-for="numList in newChannelNumList"
                            :key="numList.value"
                            :label="numList.label"
                            :value="numList.value"
                            :disabled="numList.disabled"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-from-item>
                    <el-col :span="6">
                      <el-form-item ref="uploadElement" :label="$t('deviceView.thumbnail')" prop="pictureUrl">
                        <el-input v-if="false" v-model="addChannelData.pictureUrl"/>
                        <el-upload
                          ref="upload"
                          :show-file-list="false"
                          :before-upload="beforeAvatarUpload"
                          :on-change="handleChange"
                          :data="addChannelData"
                          class="avatar-uploader"
                          action=""
                          accept="image/png,image/jpg,image/jpeg"
                          list-type="picture">
                          <el-button size="mini" type="primary" style=" margin-bottom: 20px;position: relative;margin-right: 45px;">
                            <i style="margin-right:10px;font-size:16px;" class="iconfont el-icon-plus"/><span>{{ $t('deviceView.selectPicture') }}</span>
                          </el-button>
                          <!--<img :src="addChannelData.pictureUrl" class="avatar" style="border: 1px dashed #d9d9d9;">-->
                          <el-image :src="addChannelData.pictureUrl" class="image-class">
                            <div slot="error" class="image-slot">
                              <span class="image-span">{{ $t('deviceView.preview') }}</span>
                            </div>
                          </el-image>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="varWindowWidth<1440? 14: 16" :offset="varWindowWidth<1440? 3: 1">
                      <span class="picture-tips">*{{ $t('deviceView.thumbnailInfo') }}</span>
                    </el-col>
                  </el-from-item>

                </el-form>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showAddChannelDialog = false">{{ $t('deviceView.cancle') }}</el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary" @click="addSingleChannel">{{ $t('deviceView.confirm') }}</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
import { validateInput, validateURL, validatePort } from '@/common/validate';
import { deviceRESTful, ezvizRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import { getStoreList, getBriefStoreList } from '@/api/store';
import EzvizAccount from './EzvizAccount';
import filterString from '@/common/filterString';
import util from '../../../common/util';
import lodash from 'lodash';

export default {
  name: 'NvrDeviceMgmt',
  components: { EzvizAccount },
  data() {
    return {
      dash: {},
      activeName: 'ezvizAccount',
      total: 0,
      page: 1,
      sizeNum: 10,
      nvrData: [],
      // the filter flag
      nvrFilter: true,
      modelFilter: true,
      nvrFilterName: '',
      storeFilter: true,
      channelFilter: true,
      channelNumFilter: true,
      // paperCount:3,
      showImportContent: false,
      showConfirmImport: false,
      channelList: [],
      channelData: [],
      serachVale: '',
      curChannelItem: {},
      btnList: [
        {
          id: 0,
          iconClass: 'iconfont icon-daoru',
          name: 'import',
          btnTitle: this.$t('insSettingView.import'),
          enabled: true
        },
        {
          id: 0,
          iconClass: 'iconfont icon-daochu',
          name: 'export',
          btnTitle: this.$t('insSettingView.export'),
          enabled: true
        },
        {
          id: 0,
          iconClass: 'iconfont icon-xiazai',
          name: 'download',
          btnTitle: this.$t('insSettingView.download'),
          enabled: true
        }
      ],
      varWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      curNVRItem: null,
      lang: this.$i18n.locale,
      showAddNvrDialog: false,
      addDeviceData: { name: '', validationCode: '', storeId: '', serialNumber: '', channelCount: 1, ezvizAccount: '' },
      channelNumList: [
        {
          value: 1,
          label: '1 ' + this.$t('deviceView.unit')
        },
        {
          value: 4,
          label: '4 ' + this.$t('deviceView.unit')
        },
        {
          value: 8,
          label: '8 ' + this.$t('deviceView.unit')
        },
        {
          value: 16,
          label: '16 ' + this.$t('deviceView.unit')
        },
        {
          value: 32,
          label: '32 ' + this.$t('deviceView.unit')
        },
        {
          value: 64,
          label: '64 ' + this.$t('deviceView.unit')
        },
        {
          value: 128,
          label: '128 ' + this.$t('deviceView.unit')
        },
        {
          value: 256,
          label: '256 ' + this.$t('deviceView.unit')
        }
      ],
      storeDataList: [],
      allStoreDataList: [],
      newChannelNumList: [],
      channelBtnDisabled: false,
      editNvrChannelNumList: [],
      showConfirmDelete: false,
      rules: {
        serialNumber: [
          { required: true, message: this.$t('deviceView.inputSerialNum'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('deviceView.inputDeviceName'), trigger: 'blur' }
        ],
        channelCount: [
          { required: true, message: this.$t('deviceView.selectChannelNum'), trigger: 'change' }
        ],
        ezvizAccount: [
          { required: true, message: this.$t('deviceView.selectEzvizAccount'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('deviceView.selectStore'), trigger: 'change' }
        ]
      },
      showDeleteChannel: false,
      deleteFromEzviz: false,
      isAddAgain: false,
      addChannelData: { name: '', channelId: '', pictureUrl: '', file: '' },
      channelRules: {
        name: [
          { required: true, message: this.$t('deviceView.inputChannelName'), trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: this.$t('deviceView.selectDeviceChannel'), trigger: 'blur' }
        ],
        pictureUrl: [
          { required: true, message: this.$t('deviceView.uploadImage'), trigger: 'blur' }
        ]
      },
      showAddChannelDialog: false, // 是否显示增加通道对话框
      file: '',
      deleteChannelId: 0,
      isUpdate: false,
      deviceNameTemp: '',
      channelCountTemp: 0,
      ezvizAccountList: [],
      elTooltipClass: 'el-tooltipClass',
      curIndex: 0,
      channelNameRuletip: false,
      serialRuletip: false,
      validateRuletip: false,
      deviceRuletip: false
    };
  },
  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.InitData();
        self.getBriefStoreData();
        self.getAccountList();
      }
    }
  },
  computed: {
    varyDivHeight: function() {
      if (this.varyWindowHeight > 800) {
        return this.varyWindowHeight * 0.50;
      } else if (this.varyWindowHeight > 700) {
        return this.varyWindowHeight * 0.60;
      } else {
        return this.varyWindowHeight * 0.526;
      }
    },
    ...mapGetters({
      accountChanged: 'accountChanged'
    })
  },

  mounted() {
    const self = this;
    self.getAccountList();
  },

  methods: {
    callChildAdd() {
      const self = this;
      self.$refs.ezvizAccount.showAddEzvizAccount();
    },

    handleClick(tabs) {
      const self = this;
      const index = Number(tabs.index);
      switch (index) {
        case 0:
          self.getAccountList();
          break;
        case 1:
          self.InitData();
          self.getAccountList();
          self.getBriefStoreData();
          break;
      }
    },

    getBriefStoreData() {
      const self = this;
      getBriefStoreList().then(res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          const storeList = res.data;
          self.storeList = storeList;
          const tempStore = [];
          storeList.forEach(item => {
            const obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId
            };
            tempStore.push(obj);
          });
          self.storeDataList = tempStore;
          self.allStoreDataList = tempStore;
        }
      });
    },

    handleChange(file, fileList) {
      this.addChannelData.pictureUrl = file.url;
      this.addChannelData.file = file;
      this.file = file.raw;
    },

    handleEditChange(file, fileList) {
      const self = this;
      self.isUpdate = false;
      this.channelList.forEach(item => {
        if (item.isClick) {
          item.tempUrl = file.url;
        }
      });
      this.file = file.raw;
    },

    beforeAvatarUpload(file) {
      const fileName = file.name.split('.');
      const fileType = fileName[fileName.length - 1];
      const isJPEG = fileType === 'jpeg';
      const isJPG = fileType === 'jpg';
      const isPNG = fileType === 'png';
      const isLt60K = file.size / 1024 < 60;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error(this.$t('deviceView.imgTypeInfo'));
        this.file = '';
        this.channelList.forEach(item => {
          if (item.isClick) {
            item.tempUrl = item.pictureUrl;
          }
        });
        if (self.showAddChannelDialog) {
          self.addChannelData.pictureUrl = '';
          self.addChannelData.file = '';
        }
        return (isJPEG || isJPG || isPNG);
      } else if (!isLt60K) {
        this.$message.error(this.$t('deviceView.imgSizeInfo'));
        this.file = '';
        this.channelList.forEach(item => {
          if (item.isClick) {
            item.tempUrl = item.pictureUrl;
          }
        });
        if (this.showAddChannelDialog) {
          this.addChannelData.pictureUrl = '';
          this.addChannelData.file = '';
        }
        return isLt60K;
      }
    },

    tableRowStyle({ row, rowIndex }) {
      return 'background-color: #FAFAFA;height:50px;font-size:14px; border-bottom: 1px solid #ddd;font-weight: bold;';
    },

    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #909399;font-weight: bold;height:48px;';
      }
    },

    clickNVR(index, item) {
      const self = this;
      item.isClick = true;
      self.curNVRItem = item;
      self.curIndex = index;
      self.channelCountTemp = item.channelCount;
      self.getChannelListByDevice(item.serialNumber);
      self.nvrData.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isClick = false;
        }
      });
    },

    checkBeforeImport() {
      const self = this;
    },

    importItem() {
      this.showConfirmImport = true;
    },

    exportItem() {
      const self = this;
      self.export2Excel();
    },

    sizeChange(val) {
      const self = this;
      self.sizeNum = val;
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      this.getDeviceList(params);
    },

    currentChange(val) {
      const self = this;
      self.page = val;
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getDeviceList(params);
    },

    // nvr list filter
    filterNVR() {
      const self = this;
      self.nvrFilter = !self.nvrFilter;
      self.page = 1;
      self.nvrFilterName = 'name';
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': self.nvrFilter ? 'asc' : 'desc',
          'property': 'name'
        }
      };
      self.getDeviceList(params);
    },

    filterModel() {
      const self = this;
      self.modelFilter = !self.modelFilter;
      self.page = 1;
      self.nvrFilterName = 'storeName';
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': self.modelFilter ? 'asc' : 'desc',
          'property': 'deviceModel'
        }
      };
      self.getDeviceList(params);
    },

    filterAccount() {
      const self = this;
      self.modelFilter = !self.modelFilter;
      self.page = 1;
      self.nvrFilterName = 'ezvizAccount';
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': self.modelFilter ? 'asc' : 'desc',
          'property': 'ezvizAccount'
        }
      };
      self.getDeviceList(params);
    },

    filterStore() {
      const self = this;
      self.storeFilter = !self.storeFilter;
      self.page = 1;
      self.nvrFilterName = 'storeName';
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': self.storeFilter ? 'asc' : 'desc',
          'property': 'storeName'
        }
      };
      self.getDeviceList(params);
    },

    filterChannelNum() {
      const self = this;
      self.channelNumFilter = !self.channelNumFilter;
      self.page = 1;
      self.nvrFilterName = 'channelCount';
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': self.channelNumFilter ? 'asc' : 'desc',
          'property': 'channelCount'
        }
      };
      self.getNVRList(params);
    },

    deleteChannel(channelList) {
      const params = {
        deviceIds: channelList
      };
      return new Promise((resolve, reject) => {
        deviceRESTful.deleteDevice(params).then(res => {
          resolve(res);
        });
      });
    },

    deleteNVR(nvrList) {
      const params = {
        ivsIds: nvrList
      };
      return new Promise((resolve, reject) => {
        deviceRESTful.deleteNVR(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addNVR(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.addNVR(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addEzivzDevice(params) {
      return new Promise((resolve, reject) => {
        ezvizRESTful.addEzivzDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    deleteEzvizDevice(params) {
      return new Promise((resolve, reject) => {
        ezvizRESTful.deleteEzivzDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getAllDeviceData() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 1000
        }
      };
      return new Promise((resolve, reject) => {
        ezvizRESTful.getEzvizList(params).then(res => {
          const errMsg = res.errMsg;
          let data = [];
          if (errMsg != undefined && errMsg === 'Success') {
            data = res.data.content;
          }
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getAllNVRData() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 1000
        }
      };
      return new Promise((resolve, reject) => {
        deviceRESTful.getNVRList(params).then(res => {
          const errMsg = res.errMsg;
          let data = [];
          if (errMsg != undefined && errMsg === 'Success') {
            data = res.data.content;
          }
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async addAllData(paramsNVR, paramsDevice) {
      const self = this;
      const data = await self.getAllDeviceData();
      self.channelData = await self.getChannelData();
      const nvrList = [];
      const channelList = self.channelData.map(x => x.id);
      data.forEach(item => {
        const json = {};
        json.serialNumber = item.serialNumber;
        json.deleteFromEzviz = false;
        nvrList.push(json);
      });
      if (channelList.length === 0 && nvrList.length === 0) {
      } else if (channelList.length === 0 && nvrList.length !== 0) {
        nvrList.forEach(_item => {
          self.deleteEzvizDevice(_item);
        });
      } else if (channelList.length !== 0 && nvrList.length === 0) {
        await self.deleteChannel(channelList);
      } else {
        await self.deleteChannel(channelList);
        nvrList.forEach(_item => {
          self.deleteEzvizDevice(_item);
        });
      }
      const res1 = await self.addEzivzDevice(paramsNVR);
      const res2 = await self.addDevice(paramsDevice);
      if (res1.errCode === 0 && res2.errCode === 0) {
        self.notify(self.$t('deviceView.importSuss'), 'success', 3000);
        self.showImportContent = false;
      } else {
        self.notify(self.$t('deviceView.importFail'), 'warning', 3000);
        self.showImportContent = false;
      }
      self.page = 1;
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getDeviceList(params);
    },

    importfxx(obj) {
      const _this = this;
      const inputDOM = this.$refs.inputer;
      this.file = event.currentTarget.files[0];
      var rABS = false;
      var f = this.file;
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = '';
        var rABS = false;
        var pt = this;
        var wb;
        var outdata;
        var reader = new FileReader();
        reader.onload = async function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require('xlsx');
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              type: 'base64'
            });
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          if (!outdata[0].hasOwnProperty('StoreID')) {
            _this.notify(this.$t('deviceView.templateError'), 'warning', 3000);
            return false;
          }
          const arr = outdata;
          const nvrDataTemp = [];
          const channelDataTemp = [];
          arr.forEach((item, index) => {
            if (nvrDataTemp.map(x => x.ivsId).indexOf(item['序列号']) === -1) {
              const obj = {
                serialNumber: item['序列号'],
                name: item['设备名称'],
                channelCount: item['通道数'],
                storeId: item['StoreID'],
                validationCode: item['设备验证码'],
                ezvizAccount: item['萤石账号']
              };
              nvrDataTemp.push(obj);
            }
            const obj = {
              name: item['通道名称'],
              storeId: item['StoreID'],
              ivsId: item['序列号'],
              channelId: item['通道序号'],
              vendor: 1
            };
            channelDataTemp.push(obj);
          });

          const params1 = {
            'device': nvrDataTemp
          };
          const params2 = {
            'device': channelDataTemp
          };
          _this.addAllData(params1, params2);
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    export2Excel() {
      var that = this;
      require.ensure([], async() => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = ['StoreID', '所属门店', '序列号', '设备名称', '设备验证码', '通道数', '通道名称',
          '通道序号', '萤石账号'];
        const filterVal = ['storeId', 'storeName', 'serialNumber', 'name', 'validationCode',
          'channelCount', 'channelName', 'channelNum', 'ezvizAccount'];
        const deviceData = await that.getAllDeviceData();
        const channelData = that.channelData;
        const excelData = [];
        if (deviceData.length !== 0 && channelData.length !== 0) {
          deviceData.forEach((item, index) => {
            channelData.forEach((_item, _index) => {
              if (item.serialNumber === _item.ivsId) {
                const obj = {};
                obj.storeId = item.storeId;
                obj.storeName = item.storeName;
                obj.serialNumber = item.serialNumber;
                obj.name = item.name;
                obj.validationCode = '';
                obj.channelCount = item.channelCount;
                obj.channelName = _item.name;
                obj.channelNum = _item.channelId;
                obj.ezvizAccount = item.ezvizAccount;
                excelData.push(obj);
              }
            });
          });
        }
        const list = excelData;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '看门店-萤石云设备管理导入示例');
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    handleNVR(index, item) {
      const self = this;
      switch (index) {
        case 0: self.importItem(); break;
        case 1: self.exportItem(); break;
        // case 2: self.downItem(); break;
        default: break;
      }
    },

    handleEdit(index, item) {
      const self = this;
      item.isClick = true;
      self.curChannelItem = item;
      self.channelList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isClick = false;
        }
      });
    },

    cancelEdit(index, item) {
      const self = this;
      self.isUpdate = false;
      item.isClick = false;
      item.tempUrl = item.pictureUrl;
      item.tempName = item.name;
      self.file = '';
      if (item.id === 0) {
        self.channelList.splice(index, 1);
      }
    },

    confrimEdit(index, item) {
      const self = this;
      if (item.id !== 0) {
        self.updateEzvizChannel(item);
      } else {
        // add new channel
        self.addEzvizChannel(item);
      }
    },

    updateEzvizChannel(item) {
      const self = this;
      const obj = {};
      self.isUpdate = false;
      obj.id = self.curChannelItem.id;
      obj.name = self.curChannelItem.tempName;
      if (obj.name.trim().length === 0) {
        self.notify(self.$t('deviceView.channelNameEmpty'), 'warning', 3000);
        return false;
      }
      const params = obj;
      let attachRes = {};
      deviceRESTful.updateDevice(params).then(async res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          if (item.tempUrl !== item.pictureUrl) {
            const fm = new FormData();
            fm.append('id', self.curChannelItem.id);
            fm.append('picture', self.file);
            attachRes = await self.attachImageToDevice(fm);
          }
          if (attachRes.errMsg === 'Success') {
            self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          }
          self.curChannelItem.isClick = false;
          self.file = '';
        } else {
          self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData();
          self.getChannelListByDevice(self.curNVRItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-updateEzvizChannel: ' + err);
        });
    },

    addEzvizChannel(item) {
      const self = this;
      const json = {};
      json.name = item.tempName;
      json.storeId = self.curNVRItem.storeId;
      json.ivsId = self.curNVRItem.serialNumber;
      json.channelId = item.channelId;
      json.vendor = 1;
      const deviceArr = [];
      deviceArr.push(json);
      const params = {};
      params.device = deviceArr;
      deviceRESTful.addDevice(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
          self.curChannelItem.isClick = false;
        } else {
          self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData();
          self.getChannelListByDevice(self.curNVRItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-addEzvizChannel: ' + err);
        });
    },

    getDeviceList(params) {
      const self = this;
      ezvizRESTful.getEzvizList(params).then(res => {
        const errMsg = res.errMsg;
        const temp = [];
        if (errMsg != undefined && errMsg === 'Success') {
          const data = res.data.content;
          data.forEach((item, index) => {
            const obj = {};
            obj.serialNumber = item.serialNumber;
            obj.name = item.name;
            obj.tempNvrName = item.name;
            obj.store = item.storeName;
            obj.storeId = item.storeId;
            obj.deviceModel = item.deviceModel;
            obj.ezvizAccount = item.ezvizAccount;
            obj.tempEzvizAccount = item.ezvizAccount;
            obj.channelCount = item.channelCount;
            obj.tempChannelCount = item.channelCount;
            obj.channelNum = item.channelCount + '个';
            obj.comment = item.comment;
            obj.ifCanEdit = true;
            obj.ifCanAdd = false;
            obj.isEditing = false;
            if (index === 0) {
              obj.isClick = true;
            } else {
              obj.isClick = false;
            }
            temp.push(obj);
          });
          self.nvrData = temp;
          self.total = res.data.totalElements;
        }
      })
        .then(async() => {
          if (self.nvrData.length !== 0) {
            self.curNVRItem = self.nvrData[0];
            self.channelData = await self.getChannelData();
            self.getChannelListByDevice(self.nvrData[0].serialNumber);
          } else {
            self.channelData = [];
            self.channelList = [];
          }
        });
    },

    searchNVRList() {
      // to do nothing
    },

    getChannelData() {
      const self = this;
      return new Promise((resolve, reject) => {
        deviceRESTful.getDeviceList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            const data = res.data;
            resolve(data);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getChannelListByDevice(serialNumber) {
      const self = this;
      const temp = [];
      self.channelData.forEach(item => {
        if (item.ivsId === serialNumber) {
          const obj = {};
          obj.id = item.id;
          obj.name = item.name;
          obj.tempName = item.name;
          obj.channelId = item.channelId;
          obj.pictureUrl = item.thumbnailUrl;
          obj.tempUrl = item.thumbnailUrl;
          obj.isClick = false;
          temp.push(obj);
        }
      });
      self.channelList = temp;
      if (self.channelList.length === self.curNVRItem.channelCount) {
        self.channelBtnDisabled = true;
      } else {
        self.channelBtnDisabled = false;
      }
      if (self.channelList.length === 0) {
        self.editNvrChannelNumList = self.channelNumList;
      } else {
        const sortArr = self.channelList.sort(self.getSortFun('channelId'));
        const lastChannel = sortArr[sortArr.length - 1];
        const maxChannleId = lastChannel.channelId;
        const maxChannel = Math.pow(2, Math.ceil(Math.log2(maxChannleId)));
        const spliceArray = self.channelNumList.filter(x => x.value >= maxChannel);
        self.editNvrChannelNumList = spliceArray;
      }
    },

    async InitData() {
      const self = this;
      if (self.varyWindowHeight >= 760) {
        self.sizeNum = 20;
      } else {
        self.sizeChange = 10;
      }
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getDeviceList(params);
    },

    async getAllStoreList() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      const retData = await self.getStoreData(params);
      const storeList = retData.data.content;
      self.storeList = storeList;
      const tempStore = [];
      storeList.forEach(item => {
        const obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
      self.allStoreDataList = tempStore;
    },

    getStoreData(params) {
      const self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            const data = res.data;
            resolve(res);
          }
        }).catch(res => {
          resolve(res);
        });
      });
    },

    addDevice(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.addDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addAgain(index, item) {
      const self = this;
      self.addDeviceData = item;
      self.isAddAgain = true;
      self.showAddNvrDialog = true;
      self.storeDataList = self.allStoreDataList;
    },

    addSingleNvr() {
      if (this.isAddAgain) {
        this.updateEzvizDeviceInfo();
      } else {
        this.addEzvizDeviceBasedForm();
      }
    },

    updateEzvizDeviceInfo() {
      const self = this;
      const obj = self.addDeviceData;
      obj.syncToEzviz = false;
      const params = {};
      params.serialNumber = obj.serialNumber;
      params.name = obj.name;
      params.syncToEzviz = false;
      params.channelCount = obj.channelCount;
      params.validationCode = obj.validationCode;
      params.ezvizAccount = obj.ezvizAccount;
      ezvizRESTful.updateEzvizDevice(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          self.showAddNvrDialog = false;
          self.isAddAgain = false;
          self.nvrData[self.curIndex].tempNvrName = obj.name;
          self.nvrData[self.curIndex].tempEzvizAccount = obj.ezvizAccount;
          self.nvrData[self.curIndex].tempChannelCount = obj.channelCount;
        } else {
          self.setErrorMsg(errMsg);
          // self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          self.showAddNvrDialog = false;
          self.isAddAgain = false;
          self.nvrData[self.curIndex].name = obj.tempNvrName;
          self.nvrData[self.curIndex].ezvizAccount = obj.tempEzvizAccount;
          self.nvrData[self.curIndex].channelCount = obj.tempChannelCount;
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData();
          self.getChannelListByDevice(self.curNVRItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-updateEzvizDeviceInfo: ' + err);
        });
    },

    addEzvizDeviceBasedForm() {
      const self = this;
      self.$refs['nvrForm'].validate(async(valid) => {
        if (valid) {
          const nvrParams = {};
          const nvrArray = [];
          nvrArray.push(self.addDeviceData);
          nvrParams.device = nvrArray;
          const res1 = await self.addEzivzDevice(nvrParams);
          const errMsg = res1.errMsg;
          if (errMsg === 'Success') {
            self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
            self.showAddNvrDialog = false;
          } else {
            self.setErrorMsg(errMsg);
          }
          self.addDeviceData = {
            name: '',
            validationCode: '',
            storeId: self.storeDataList.length > 0 ? self.storeDataList[0].storeId : '',
            serialNumber: '',
            channelCount: 1,
            ezvizAccount: self.ezvizAccountList.length > 0 ? self.ezvizAccountList[0].ezvizAccount : ''
          };
          self.page = 1;
          const params = {
            'filter': {
              'page': self.page - 1,
              'size': self.sizeNum
            },
            'order': {
              'direction': 'asc',
              'property': 'name'
            }
          };
          self.getDeviceList(params);
        } else {
          return false;
        }
      });
    },

    addSingleChannel() {
      const self = this;
      self.$refs['channelForm'].validate(async(valid) => {
        if (valid) {
          const json = {};
          json.name = self.addChannelData.name;
          json.storeId = self.curNVRItem.storeId;
          json.ivsId = self.curNVRItem.serialNumber;
          json.channelId = self.addChannelData.channelId;
          json.vendor = 1;
          const deviceArr = [];
          deviceArr.push(json);
          const devParams = {};
          devParams.device = deviceArr;
          const res1 = await self.addDevice(devParams);
          if (res1.errMsg === 'Success') {
            // get channel id and attach image to channel
            const fm = new FormData();
            const channelId = res1.data[0];
            fm.append('id', channelId);
            fm.append('picture', self.file);
            const attachRes = await self.attachImageToDevice(fm);
            if (attachRes.errMsg === 'Success') {
              self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
            }
            self.showAddChannelDialog = false;
          } else {
            self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
            self.showAddChannelDialog = false;
          }
          self.addChannelData = { name: '', channelId: '', pictureUrl: '', file: '' };
          self.page = 1;
          self.channelData = await self.getChannelData();
          self.getChannelListByDevice(self.curNVRItem.serialNumber);
        } else {
          return false;
        }
      });
    },

    attachImageToDevice(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.attachImageToDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch(err => {
          reject(err);
        });
      });
    },

    handleDelete(index, item) {
      const self = this;
      self.showDeleteChannel = true;
      self.deleteChannelId = item.id;
    },

    deleteSingleChannel() {
      const self = this;
      self.showDeleteChannel = false;
      const idsArr = [];
      idsArr.push(self.deleteChannelId);
      const obj = {};
      obj.deviceIds = idsArr;
      const params = obj;
      deviceRESTful.deleteDevice(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
        } else {
          self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData(); // modify data
          self.getChannelListByDevice(self.curNVRItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-deleteSingleChannel: ' + err);
        });
    },

    editSingleNvr(index, item) {
      const self = this;
      item.isEditing = true;
      item.isClick = true;
      self.nvrData.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isEditing = false;
          _item.isClick = false;
        }
      });
      item.name = item.tempNvrName;
      item.ezvizAccount = item.tempEzvizAccount;
      item.channelCount = item.tempChannelCount;
      self.curNVRItem = item;
      self.channelCountTemp = item.channelCount;
      self.curIndex = index;
      self.getChannelListByDevice(item.serialNumber);
      // show update dialog
      self.addDeviceData = item;
      self.isAddAgain = true;
      self.showAddNvrDialog = true;
      self.storeDataList = self.allStoreDataList;
    },

    showAddDialog() {
      const self = this;
      self.showAddNvrDialog = true;
      self.storeDataList = self.allStoreDataList;
      self.isAddAgain = false;
      self.addDeviceData = {
        name: '',
        validationCode: '',
        storeId: self.storeDataList.length > 0 ? self.storeDataList[0].storeId : '',
        serialNumber: '',
        channelCount: 1,
        ezvizAccount: self.ezvizAccountList.length > 0 ? self.ezvizAccountList[0].ezvizAccount : ''
      };
    },

    confirmEditNvr(index, item) {
      const self = this;
      const obj = {};
      obj.serialNumber = item.serialNumber;
      obj.name = item.tempNvrName;
      obj.channelCount = item.tempChannelCount;
      if (obj.name.trim().length === 0) {
        self.notify(self.$t('deviceView.deviceNameEmpty'), 'warning', 3000);
        return false;
      }
      obj.syncToEzviz = false;
      const params = obj;
      ezvizRESTful.updateEzvizDevice(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          item.isEditing = false;
          item.name = item.tempNvrName;
          item.channelCount = item.tempChannelCount;
        } else {
          self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          item.isEditing = false;
        }
      })
        .then(async() => {
          self.getChannelListByDevice(self.curNVRItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-confirmEditNvr: ' + err);
        });
    },

    cancelEditNvr(index, item) {
      const self = this;
      item.isEditing = false;
      item.tempNvrName = item.name;
      item.tempChannelCount = item.channelCount;
    },

    async deleteSingleNVR() {
      const self = this;
      self.showConfirmDelete = false;
      const serialNumber = self.curNVRItem.serialNumber;
      const json = {};
      json.serialNumber = serialNumber;
      json.deleteFromEzviz = self.deleteFromEzviz;
      const channelList = self.channelList.map(x => x.id);
      if (channelList.length > 0) {
        const res1 = await self.deleteChannel(channelList);
        const res2 = await self.deleteEzvizDevice(json);
        if (res1.errMsg === 'Success' && res2.errMsg === 'Success') {
          self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
        } else {
          self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
        }
      } else {
        const res2 = await self.deleteEzvizDevice(json);
        if (res2.errMsg === 'Success') {
          self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
        } else {
          self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
        }
      }
      self.deleteFromEzviz = false;
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getDeviceList(params);
    },

    // add new channel
    addNewChannel() {
      const self = this;
      const channelNum = this.curNVRItem.channelCount;
      const spliceArray = [];
      for (let item = 1; item <= channelNum; item++) {
        const channelJson = {};
        channelJson.value = item;
        channelJson.label = item;
        channelJson.disabled = false;
        spliceArray.push(channelJson);
      }
      spliceArray.forEach(item => {
        this.channelList.forEach(_item => {
          if (item.value === _item.channelId) {
            item.disabled = true;
          }
        });
      });
      self.newChannelNumList = spliceArray;
      self.showAddChannelDialog = true;
      self.addChannelData = { name: '', channelId: '', pictureUrl: '', file: '' };
    },

    getSortFun(sortBy) {
      var ordAlpah = '>';
      var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
      return sortFun;
    },

    async getAccountList() {
      const self = this;
      self.tableData = [];
      const retData = await self.getEzvizAccountList();
      const accountList = retData.data;
      self.ezvizAccountList = accountList;
      self.$refs.ezvizAccount.tableData = accountList;
    },

    getEzvizAccountList() {
      return new Promise((resolve, reject) => {
        ezvizRESTful.getEzvizAccountList().then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    channelNameChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 20);
      if (Object.keys(item).length === 0) {
        self.addChannelData.name = comment;
      } else {
        item.tempName = comment;
      }
      const length = filterString.getContentLength(val);
      if (length > 20) {
        this.channelNameRuletip = true;
      } else {
        this.channelNameRuletip = false;
      }
    },

    serialNumberChange(val) {
      const self = this;
      const comment = filterString.all(val, 20);
      self.addDeviceData.serialNumber = comment;
      const length = filterString.getContentLength(val);
      if (length > 20) {
        this.serialRuletip = true;
      } else {
        this.serialRuletip = false;
      }
    },

    validateCodeChange(val) {
      const self = this;
      const comment = filterString.all(val, 10);
      self.addDeviceData.validationCode = comment;
      const length = filterString.getContentLength(val);
      if (length > 10) {
        this.validateRuletip = true;
      } else {
        this.validateRuletip = false;
      }
    },

    deviceNameChange(val) {
      const self = this;
      const comment = filterString.all(val, 20);
      self.addDeviceData.name = comment;
      const length = filterString.getContentLength(val);
      if (length > 20) {
        this.deviceRuletip = true;
      } else {
        this.deviceRuletip = false;
      }
    },

    notShowInputRuleTips(e) {
      if (e === 'channelName') {
        this.channelNameRuletip = false;
      } else if (e === 'serialNum') {
        this.serialRuletip = false;
      } else if (e === 'validationCode') {
        this.validateRuletip = false;
      } else if (e === 'deviceName') {
        this.deviceRuletip = false;
      }
    },

    filterStoreOption(value) {
      const storeList = lodash.cloneDeep(this.allStoreDataList);
      if (value) {
        const temp = [];
        const tempArray = [];
        const tempStoreList = [];
        storeList.forEach((_item) => {
          temp.push(util.getPinyinList(_item.label));
          tempStoreList.push(_item);
        });
        for (let i = 0; i < temp.length; i++) {
          if (temp[i][0].indexOf(value.trim()) !== -1 ||
            temp[i][1].indexOf(value.trim()) !== -1) {
            tempArray.push(tempStoreList[i]);
          }
        }
        this.storeDataList = tempArray;
      } else {
        this.storeDataList = storeList;
      }
    },

    setErrorMsg(msg) {
      let displayedMsg = '';
      const msgMap = [
        { return: 'moreThanAuthorizedDevices', match: ['exceeds the limit'] },
        { ret: 'deviceExist', match: ['Device already existed'] },
        { ret: 'multipleAccOnSameStore', match: ['Multiple accounts'] },
        { ret: 'getAccessTokenError', match: ['Ezviz access token'] },
        { ret: 'duplicateSeriNum', match: ['Duplicate device serial'] },
        { ret: 'storeNotExist', match: ['Store does not exist'] },
        { ret: 'noAuthorityForStore', match: ['No authority'] }
      ];
      const result = msgMap.find(item => item.match.some(matchItem => msg.indexOf(matchItem) > -1));
      if (!result) {
        displayedMsg = this.isAddAgain ? this.$t('deviceView.editFail') : this.$t('deviceView.addFailed');
      } else {
        displayedMsg = this.$t(`deviceView.${result.ret}`);
      }
      this.notify(displayedMsg, 'warning', 3000);
      this.showAddNvrDialog = false;
    }
  }
};
</script>
<style>
  .rowStyle{
    height: 50px;
    background-color: #FAFAFA !important;
  }
  .headerStyle{
    height: 40px;
    background-color: #FAFAFA !important;
  }

</style>
<style lang="scss" scoped>
  @import '../../../assets/css/importfile.css';
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
  @mixin titleStyle{
    height: 60px;
    line-height: 60px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  //@mixin 超出显示省略号
  @mixin txtEllipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  *{
    font-family: Roboto,Arial, Microsoft YaHei;
  }
  .noraml-color{
    color: #4b5262 !important;
    background-color: #f4f5f9;
    cursor: pointer;
  }
  .el-delete-btn{
    //background-color: $mainColor;
    //border-color:  $mainColor;
    color: #fff;
    @include point(margin-right,8);
    font-size: 12px;
    &:disabled{
      opacity: 0.6;
    }
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .en-el-delete-btn{
    //background-color: $mainColor;
    //border-color:  $mainColor;
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
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .active-color{
    color: $mainColor !important;
    background-color: #fff;
  }
  .tooltip-color{
    color: rgba(75,82,98, 0.5) !important;
  }
  .el-search-input{
    @include point(width,180);
    @include point(margin-right,20);
  }
  .el-handle-btn{
    margin-left: 0px !important;
    border-color: $mainColor !important;
    color: $mainColor !important;
    border-radius: 0px;
    height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    min-width: 85px;
    min-height: 28px;
    &:first-child{
      border-right-width: 0px;
    }
    &:last-child{
      border-left-width: 0px;
    }
    &:hover{
      background-color: #FEE4E7;
    }
    &:focus{
      background-color: #FEE4E7;
    }
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .en-el-handle-btn{
    margin-left: 0px !important;
    border-color: $mainColor !important;
    color: $mainColor !important;
    border-radius: 0px;
    height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    min-height: 28px;
    min-width: 85px;
    &:first-child{
      border-right-width: 0px;
    }
    &:last-child{
      border-left-width: 0px;
    }
    &:hover{
      background-color: #FEE4E7;
    }
    &:focus{
      background-color: #FEE4E7;
    }
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .el-device{
    height: calc(100vh - 126px - calc(60/1920*100vw));
    border: 1px solid $border;
    background-color: #fff;
    .el-btns{
      position: relative;
      height: calc(40/1920*100vw);
      .btns{
        position: absolute;
        @include point(right,25);
        z-index: 979;
        @include point(width,90);
      }
      .device-btns{
        display: none;
        position:absolute;
        z-index: 979;
        right: 30px;
        top: 23px;
        float: right;
      }
    }
    .addNvr .ezviz-form{
      border: 1px solid $border;
      background: $tab;
    }
    .el-tabPanels{
      padding: 25px calc(25/1920*100vw) 0 calc(25/1920*100vw);
      height: auto;
      position: relative;
      bottom: calc(30/1920*100vw);
      .dialog-content{
        width: 100%;
      }
      .titles{
        display: inline-block;
        span{
          position: relative;
          left: 20%;
        }
      }
      .dash-content{
        text-align: left;
        position: relative;
        overflow: hidden;
        .details{
          @include point(height,50);
          @include point(line-height,50);
          @include point(padding-left,10);
          .dash-label{
            width: 30%;
            float: left;
          }
          .dash-input{
            width: 50%;
            margin-left: 5%;
          }
        }
      }
      .nvr-info{
        @include titleStyle;
        position: relative;
        padding-left: calc(25/1920*100vw);
        background-color: #fff;
        .info-title{
          font-size: calc(18/1920*100vw);
          font-weight: bold;
        }
        .add-btn{
          position: absolute;
          right: calc(25/1920*100vw);
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          width: calc(130/1920*100vw);
          top: 0;
          bottom: 0;
          margin: auto;
          .el-icon-plus{
            font-size: calc(16/1920*100vw);
            margin-right: calc(8/1920*100vw);
          }

        }
      }
      .lisde{
        background-color: #FAFAFA;
        height: auto;
        position: relative;
        .icon-filter{
          position: relative;
          left: 20%;
          cursor: pointer;
        }
        .nvr-title{
          @include titleStyle;
          @media screen and (min-width: 1366px) {
            font-size: 14px;
          }
          @media screen and (max-width: 1366px) {
            font-size: 12px;
          }
          background-color: #fff;
          .comment-title{
            width: 2%;
          }
          .name-title{
            width: 20%;
          }
          .model-title{
            width: 20%;
          }
          .store-title{
            width: 20%;
          }
          .count-title{
            width: 15%;
          }
          .operation-title{
            width: 15%;
            span{
              left: 30%;
            }
          }
          .en-comment-title {
            width: 2%;
          }
          .en-name-title {
            width: 18%;
          }
          .en-model-title {
            width: 22%;
          }
          .en-store-title {
            width: 20%;
          }
          .en-count-title {
            width: 20%;
            span {
              left: 0;
            }
          }
          .en-operation-title {
            width: 15%;
          }
          @media screen and (max-width: 1680px) {
            .model-title{
              width: 18%;
            }
            .store-title{
              width: 20%;
            }
            .count-title{
              width: 20%;
            }
            .operation-title{
              width: 15%;
              span{
                left: 30%;
              }
            }
            .en-comment-title {
              width: 2%;
            }
            .en-name-title {
              width: 18%;
            }
            .en-model-title {
              width: 23%;
            }
            .en-store-title {
              width: 20%;
            }
            .en-count-title {
              width: 23%;
              span {
                left: 0;
              }
            }
            .en-operation-title {
              width: 15%;
            }
          }
          @media screen and (max-width: 1440px) {
            .model-title{
              width: 20%;
            }
            .store-title{
              width: 20%;
            }
            .count-title{
              width: 20%;
            }
            .operation-title{
              width: 15%;
              span{
                left: 30%;
              }
            }
            .en-comment-title {
              width: 2%;
            }
            .en-name-title {
              width: 18%;
            }
            .en-model-title {
              width: 25%;
            }
            .en-store-title {
              width: 20%;
            }
            .en-count-title {
              width: 26%;
              span {
                left: 0;
              }
            }
            .en-operation-title {
              width: 15%;

            }
          }
          @media screen and (max-width: 1280px) {
            .model-title{
              width: 20%;
            }
            .store-title{
              width: 20%;
            }
            .count-title{
              width: 20%;
            }
            .operation-title{
              width: 15%;
              span{
                left: 30%;
              }
            }
            .en-comment-title {
              width: 2%;
            }
            .en-name-title {
              width: 18%;
            }
            .en-model-title {
              width: 26%;
            }
            .en-store-title {
              width: 20%;
            }
            .en-count-title {
              width: 26%;
              span {
                left: 0;
              }
            }
            .en-operation-title {
              width: 15%;

            }
          }
        }
        .nvr-title .titles{
          color: $tab;
        }
        .nvr-data{
          @include titleStyle;
          position: relative;
          font-size: 14px;
          .proper-flag{
            height: 70%;
            width: 4px;
            position:absolute;
            top: 15%;
            background-color: $mainColor;
          }
          .nvr-input{
            @include point(width,80);
            /*margin-left: 13%;*/
            position: relative;
            bottom: 2px;
          }
          .nvr-select{
            @include point(width,60);
            position: relative;
            bottom: 2px;
            /deep/ .el-input--suffix .el-input__inner{
              padding: 10px;
            }
          }
          .comment-data{
            width: 4%;
            height: 100%;
            span{
              //display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .name-data{
            width: 20%;
            height: 100%;
            position: absolute;
            span{
              //display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              left: 10%;
            }
          }
          .model-data{
            width: 20%;
            height: 100%;
            left: 20%;
            position: absolute;
            span{
              display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .store-data{
            width: 20%;
            height: 100%;
            position: absolute;
            left: 43%;
            span{
              //display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .count-data{
            width: 15%;
            height: 100%;
            position: absolute;
            left: 65%;
            span{
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .operation-data:after{
            content: '';
            display: block;
            clear: both;
          }
          .operation-data{
            width: 20%;
            height: 100%;
            position: absolute;
            left: 83%;
            .iconcontent{
              position: absolute;
              cursor: pointer;
              display: inline-block;
              .iconfont{
                font-size: calc(24/1920*100vw);
                color: #7d8cad;
              }
              .iconlised{
                float: left;
                position: relative;
                background-color: $mainColor;
                padding: 1px 6px;
                color: #fff;
                border-width: 1px 1px 1px 1px;
                border-style: solid;
                border-color: #ddd;
                line-height: 60px;
                height: 60px;
                /deep/ el-button .add-btn{
                  font-size: 12px;
                }
              }
              .iconrised{
                float: left;
                position: relative;
                padding: 1px 6px;
                border-width: 1px 1px 1px 0px;
                border-style: solid;
                border-color: #ddd;
                background-color: rgba(255, 255, 255, 0);
                line-height: 60px;
                height: 60px;
              }
            }

          }
          &:last-child{
            margin-bottom: 20px;
          }
        }
      }
      .risde{
        .iconcontent{
          position: absolute;
          @include point(margin-top,-15);
          cursor: pointer;
          display: inline-block;
          .iconlised{
            float: left;
            position: relative;
            background-color: $mainColor;
            padding: 1px 6px;
            color: #fff;
            border-width: 1px 1px 1px 1px;
            border-style: solid;
            border-color: #ddd;
            @include point(line-height,21);
            @include point(height,21);
          }
          .iconrised{
            float: left;
            position: relative;
            padding: 1px 6px;
            border-width: 1px 1px 1px 0px;
            border-style: solid;
            border-color: #ddd;
            background-color: #fff;
            @include point(line-height,21);
            @include point(height,21);
          }
        }
        padding:0 15px;
        .nape-items-title{
          @include titleStyle;
          font-size: 14px;
          .nape-name-title{
            width: 30%;
          }
          .nape-dep-title{
            width: 30%;
          }
          .nape-picture-title{
            width: 20%;
          }
          .nape-handle-title{
            width: 10%;
          }
        }
        .en-nape-items-title{
          @include titleStyle;
          @media screen and (min-width: 1366px) {
            font-size: 14px;
          }
          @media screen and (max-width: 1366px) {
            font-size: 12px;
          }
          .nape-name-title{
            width: 30%;
          }
          .nape-dep-title{
            width: 26%;
          }
          .nape-picture-title{
            width: 25%;
          }
          .nape-handle-title{
            width: 15%;
          }
        }
        .nape-items-title .titles, .en-nape-items-title .titles{
          color: $tab;
        }
        .nape-items-data{
          overflow: hidden;
          position: relative;
          padding-left: 1%;
          cursor: pointer;
          font-size: 14px;
          height: 90px;
          line-height: 90px;

          text-align: left;
          .nape-input{
            width: calc(160/1920*100vw);
            margin-left: 13%;
            position: relative;
            bottom: 2px;
          }
          .nape-name-data{
            width: 30%;
            display: inline-block;
            position: relative;
            /*margin-right: 6%;*/
            span{
              margin-left: 20%;
              position: relative;
              @include point(max-width,90);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
          .nape-dep-data{
            width: 30%;
            display: inline-block;
            position: relative;
            span{
              margin-left: 20%;
            }
          }
          .nape-picture-data{
            width: 20%;
            height: 100%;
            display: inline-block;
            position: relative;
            .img-class{
              height: 90%;
              width: calc(100/1920*100vw);
              min-width: 85px;
              vertical-align: middle;
              text-align: center;
              line-height: 70px;
              height: 70px;
              width: calc(100/1920*100vw);
              display: inline-block;
              span{
                font-size: calc(14/1920*100vw);
              }
            }
            .upload-demo{
              position: absolute;
              bottom: 0;
              font-size: 12px;
              width: calc(100/1920*100vw);
              min-width: 85px;
              /deep/ .el-upload{
                width: 100%;
              }
              /deep/ .el-button{
                width: 100%;
                height: 28px;
                opacity: 0.5;
                position: absolute;
                bottom: 10px;
                left: 0;
              }
              /deep/ .el-button--mini{
                padding: 7px;
              }
            }
          }
          .en-nape-picture-data{
            width: 24%;
          }
          .nape-items-handle{
            width: 13%;
            display: inline-block;
            .iconfont{
              font-size: calc(24/1920*100vw);
              color: #7d8cad !important;
            }
          }
        }

      }
    }
  }
  .btn-class{
    height: calc(36/1920*100vw);
    padding: 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    .el-icon-plus{
      font-size: calc(16/1920*100vw);
      margin-right: calc(8/1920*100vw);
    }
    @media screen and (max-width: 1440px) {
      width: 100px !important;
    }
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
<style>
  @import '../../../assets/css/pagination.css';
  @import '../../../assets/css/tabsItem.css';

  #importId .el-dialog__body{
    padding-top:0px !important;
  }
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-dialog__body{
    padding: 0px;
  }
  .el-dialog__body .dialog-content .nvrForm{
    width: 90%;
    margin: 0 auto;
  }
  .el-dialog__body .dialog-content .nvrForm .picture-tips{
    display: inline;
    font-size: 12px;
    color: #fea316;
    position: relative;
    top: 30px;
    left: 30px;
  }
  .addNvr .el-dialog__footer{
    margin-top: 20px;
    line-height: 24px;
  }
  .addNvr .rules{
    font-size: 10px;
    color:#ff2400;
    font-weight: 400;
    line-height: 10px;
    margin-top: 3px;
    display: block;
}
  .el-dialog__body .dialog-content .nvrForm /deep/ label{
    padding: 0;
  }
  .avatar-uploader .picture-tips{
    display: inline;
    font-size: 12px;
    color: #fea316;
  }
  .avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .image-class{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
    border: 1px dashed #7d8cad;
  }
  .el-image__inner{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
  }
  .image-slot{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
    color: #7d8cad;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
  }
  .image-span{
    height: 70px;
    line-height: 70px;
  }
  .el-tooltipClass.el-tooltip__popper[x-placement^='bottom'] .popper__arrow {
    border-bottom-color: rgba(30, 34, 52, 0.75) !important;
  }

  .el-tooltipClass.el-tooltip__popper[x-placement^='bottom'] .popper__arrow:after {
    border-bottom-color: rgba(30, 34, 52, 0.75) !important;
  }

  .el-tooltipClass.el-tooltip__popper.is-dark {
    background: rgba(30, 34, 52, 0.75) !important;
    font-size: 14px !important;
    /*line-height: 21px;*/
    padding: 5px;
  }
  .el-icon-picture-outline{
    font-size: 16px;
  }
</style>
<style scoped>
  .el-input--small >>>.el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 15px !important;
    line-height: 50% !important;
  }
</style>
