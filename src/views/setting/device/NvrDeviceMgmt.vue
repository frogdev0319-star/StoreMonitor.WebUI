<template>
  <el-row :style="{'min-height':varyWindowHeight - 139+'px'}" class="el-device">
    <el-col :span="24" class="el-btns">
      <div v-if="activeName === 'dash'" style="display:inline-block;">
        <el-button :size="varWindowWidth > 1680 ? 'small' : 'mini'" class="btns" type="primary"
                   @click="connectServer">
          {{ $t('deviceView.submit') }}
        </el-button>
      </div>
      <div v-else style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;">
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
          :class="lang === 'en' ? 'en-el-handle-btn': 'el-handle-btn'"
          :disabled="index === 2"
          size="mini"
          @click="handleNVR(index,item)">
          <div class="btn-area">
            <i :class="item.iconClass" style="font-size: 24px;"/>
            <span>{{ item.btnTitle }}</span>
          </div>
        </el-button>
      </div>
    </el-col>
    <el-col :span="24" class="el-tabPanels">
      <el-tabs id="en-devicetabs-content" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('deviceView.mediaService')" name="dash">
          <el-col :span="varWindowWidth < 1540 ? 12 : 10"
                  :style="varWindowWidth < 1366 ? {'font-size':'12px'}:{'font-size':'14px'}" class="dash-content">
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{ $t('deviceView.serverIp') }}</span>
              <el-input v-model="dash.url" class="dash-input" size="mini"/>
            </div>
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{ $t('deviceView.port') }}</span>
              <el-input v-model="dash.httpCmdPort" class="dash-input" size="mini"/>
            </div>
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{ $t('deviceView.httpsPort') }}</span>
              <el-input v-model="dash.httpsCmdPort" class="dash-input" size="mini"/>
            </div>
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{ $t('deviceView.dataPort') }}</span>
              <el-input v-model="dash.dataPort" class="dash-input" size="mini"/>
            </div>
            <el-dialog
              v-if="showImportContent"
              id="importId"
              :title="$t('deviceView.import')"
              :visible.sync="showImportContent"
              :close-on-click-modal="false"
              :append-to-body="true"
              width="510px"
              top="35vh"
              left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;">
                <p style="margin-left:26px;margin-bottom:0px;">{{ $t('deviceView.selectFilePos') }}</p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showImportContent = false">
                  {{ $t('deviceView.cancle') }}
                </el-button>
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
              width="510px"
              top="35vh"
              left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;">
                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"/>
                  <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.clearInfo') }}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showConfirmImport = false">
                  {{ $t('deviceView.cancle') }}
                </el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary"
                           @click="showImportContent=true;showConfirmImport=false">
                  {{ $t('deviceView.confirm') }}
                </el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-tab-pane>
        <el-tab-pane :label="$t('deviceView.videoMangement')" name="video">
          <el-col :span="lang === 'en' && varWindowWidth < 1920 ? 9 : 10" class="lisde">
            <div class="nvr-info">
              <span class="info-title">{{ $t('deviceView.deviceInfo') }}</span>
              <el-button
                type="primary"
                size="mini"
                class="add-btn"
                @click="showAddDialog">
                <i style="margin-right:8px;" class="iconfont el-icon-plus"/><span>{{ $t('deviceView.addNvr') }}</span>
              </el-button>
            </div>
            <div class="nvr-title tabTitle">
              <div :class="lang === 'en' ? 'en-name-title titles': 'name-title titles'">
                <span>{{ $t('deviceView.nvr') }}</span>
                <i
                  :class="{'el-icon-arrow-up':nvrFilter,'el-icon-arrow-down':!nvrFilter}"
                  class="icon-filter"
                  @click="filterNVR"/>
              </div>
              <div :class="lang=='en' ? 'en-store-title titles': 'store-title titles'" >
                <span>{{ $t('deviceView.store') }}</span>
                <i
                  :class="{'el-icon-arrow-up':storeFilter,'el-icon-arrow-down':!storeFilter}"
                  class="icon-filter"
                  @click="filterStore"/>
              </div>
              <div :class="lang === 'en' ? 'en-count-title titles': 'count-title titles'" >
                <span>{{ $t('deviceView.channelNum') }}</span>
              </div>
            </div>
            <el-scrollbar id="el-menuscrollbar" style="height:100%;">
              <div :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                <div
                  v-for="(item,index) in nvrData"
                  :key="index"
                  :class="!item.isClick ? 'noraml-color' : 'active-color'"
                  class="nvr-data group-title"
                  @click="clickNVR(index,item)">
                  <div v-if="item.isClick" class="proper-flag"/>
                  <div class="name-data titles">
                    <span v-if="!item.isEditing">{{ item.name.length>15?item.name.substr(0,15)+'...':item.name }}</span>
                    <el-input v-if="item.isEditing" v-model="item.tempDeviceName"
                              :placeholder="$t('deviceView.inputNvrName')"size="mini" class="nvr-input"
                              @input="(val)=>nvrNameChange(val,item)"/>
                  </div>
                  <div class="store-data titles">
                    <span>{{ item.store }}</span>
                  </div>
                  <div class="count-data titles">
                    <span v-if="!item.isEditing">{{ item.tempChannelCount }}{{ $t('deviceView.unit') }}</span>
                    <el-select v-if="item.isEditing" v-model="item.tempChannelCount"
                               :placeholder="$t('deviceView.inputNvrNumber')" size="mini" class="nvr-select">
                      <el-option
                        v-for="numList in editNvrChannelNumList"
                        :key="numList.value"
                        :label="numList.label"
                        :value="numList.value"
                        :disabled="numList.disabled"
                      />
                    </el-select>
                  </div>
                  <div class="operation-data titles">
                    <div v-if="item.isEditing" class="iconcontent" style="top:15px;">
                      <div class="iconlised" @click="confirmEditNvr(index,item)">
                        <i class="el-icon-check"/>
                      </div>
                      <div class="iconrised" @click="cancelEditNvr(index,item)">
                        <i class="el-icon-close"/>
                      </div>
                    </div>
                    <div v-if="!item.isEditing" class="iconcontent" style="top:15px;">
                      <div class="iconlised" style=" border: none; background-color: rgba(255, 255, 255, 0); color:#2c3e50; font-weight: normal" @click="editSingleNvr(index,item)">
                        <i class="iconfont icon-bianji"/>
                      </div>
                      <div class="iconrised" style="border: none; color:#2c3e50;font-weight: normal" @click="showConfirmDelete=true">
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

                    <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                      <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;;display: inline-block; vertical-align: middle"/>
                      <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteNvrInfo') }}</span>
                    </p>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button class="file-cancel-btn" size="mini" style="" @click="showConfirmDelete = false">
                      {{ $t('deviceView.cancle') }}</el-button>
                    <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteSingleNVR()">
                      {{ $t('deviceView.confirm') }}</el-button>
                  </div>
                </el-dialog>
              </div>
            </el-scrollbar>
            <div class="toolbar pagination" style="width:100%; margin-top:10px;">
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
            :title="$t('deviceView.addNvr')"
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
              <el-form ref="nvrForm" :model="addNvrData" :rules="rules" class="nvrForm"
                       label-position="top" size="mini">
                <el-form-item label="IVS ID" prop="ivsId">
                  <el-input v-model="addNvrData.ivsId" @input="(val)=>ivsIdChange(val)"
                            @blur="notShowInputRuleTips('ivsId')"/>
                  <span v-if="ivsIdRuletip" class="rules">{{ $t('scheduleView.scheduleNameRuletip') }}</span>
                </el-form-item>
                <el-form-item style="height: 57px;">
                  <el-col :span="13">
                    <el-form-item :label="$t('deviceView.nvr')" prop="name" style="margin-bottom:0;">
                      <el-input v-model="addNvrData.name" style="width: 100%;" @input="(val)=>nvrNameChange(val, {})"
                                @blur="notShowInputRuleTips('Nvrname')"/>
                      <span v-if="NvrnameRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" :offset="2">
                    <el-form-item :label="$t('deviceView.channelNum')" prop="channelCount">
                      <el-select v-model="addNvrData.channelCount" size="mini">
                        <el-option
                          v-for="numList in channelNumList"
                          :key="numList.value"
                          :label="numList.label"
                          :value="numList.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item :label="$t('deviceView.store')" prop="storeId">
                  <el-select v-model="addNvrData.storeId" style="width: 100%;">
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
              <el-button class="file-cancel-btn" size="mini" style="" @click="cancelAddNvr">
                {{ $t('deviceView.cancle') }}
              </el-button>
              <el-button class="file-confirm-btn" size="mini" type="primary" @click="addSingleNvr">
                {{ $t('deviceView.confirm') }}
              </el-button>
            </div>
          </el-dialog>
          <el-col :span="lang === 'en' && varWindowWidth < 1920 ? 15 : 14" class="risde">
            <div class="nvr-info">
              <span class="info-title">{{ $t('deviceView.nvrChannelSetting') }}</span>
              <el-button
                :disabled="channelBtnDisabled"
                type="primary"
                size="mini"
                class="add-btn"
                @click="addNewChannel">
                <i style="margin-right:8px;" class="iconfont el-icon-plus"/><span>{{ $t('deviceView.addChannel') }}</span>
              </el-button>
            </div>
            <div :class="lang=='en'? 'en-nape-items-title tabTitle':'nape-items-title tabTitle'">
              <div class="nape-name-title titles">
                <span>{{ $t('deviceView.channelName') }}</span>
              </div>
              <div class="nape-dep-title titles">
                <span>{{ $t('deviceView.nvrChannelNum') }}</span>
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
                      {{ item.name.length > 15 ? item.name.substr(0,15)+'...' : item.name }}
                    </span>
                    <el-input v-if="item.isClick" v-model="item.tempName" size="mini"
                              class="nape-input input-details" @input="(val)=>channelNameChange(val,item)"/>
                  </div>
                  <div class="nape-dep-data">
                    <span v-if="item.id !== 0 " class="nape-dep">{{ item.channelId }}</span>
                    <el-select v-if="item.id === 0" v-model="item.channelId" size="mini" class="nvr-select"
                               style="margin-left: 10%">
                      <el-option
                        v-for="numList in newChannelNumList"
                        :key="numList.value"
                        :label="numList.label"
                        :value="numList.value"
                        :disabled="numList.disabled"/>
                    </el-select>
                  </div>
                  <div class="nape-picture-data">
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
                      <span style="font-size: 14px;color: #94a4b4;">{{ $t('deviceView.noImage') }}</span>
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
                        style="cursor:pointer;margin-right:10px;color:#2c3e50; "
                        @click="handleEdit(index,item)"/>
                      <i
                        class="iconfont icon-shanchu"
                        style="cursor:pointer;margin-right:10px;color:#2c3e50;"
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
                <hr style="border: 0.5px solid #dfe2e9;;">

                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"/>
                  <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteChannel') }}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteChannel = false">
                  {{ $t('deviceView.cancle') }}
                </el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteSingleChannel()">
                  {{ $t('deviceView.confirm') }}
                </el-button>
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
                <el-form ref="channelForm" :model="addChannelData" :rules="channelRules" class="nvrForm"
                         label-position="top" size="mini">
                  <el-form-item style="height: 57px;">
                    <el-col :span="12">
                      <el-form-item :label="$t('deviceView.channelName')" prop="name" style="margin-bottom:0;">
                        <el-input :placeholder="$t('deviceView.inputChannelName')" v-model="addChannelData.name"
                                  style="width: 100%;" @input="(val)=>channelNameChange(val,{})"
                                  @blur="notShowInputRuleTips('tempName')"/>
                        <span v-if="channelNameRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item :label="$t('deviceView.channelOrder')" prop="channelId">
                        <el-select v-model="addChannelData.channelId"
                                   :placeholder="$t('deviceView.selectNvrChannel')" size="mini">
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
                    <el-col :span="8">
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
                          <el-button size="mini" type="primary" style=" margin-bottom: 0px;position: relative;margin-right: 0px;">
                            <i style="margin-right:10px;font-size:16px;" class="iconfont el-icon-plus"/>
                            <span>{{ $t('deviceView.selectPicture') }}</span>
                          </el-button>
                        </el-upload>
                        <el-image :src="addChannelData.pictureUrl" class="image-class">
                          <div slot="error" class="image-slot">
                            <span class="image-span">{{ $t('deviceView.preview') }}</span>
                          </div>
                        </el-image>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16" :offset="varWindowWidth<1440? 3: 0">
                      <el-form-item label="">
                        <span class="picture-tips">*{{ $t('deviceView.thumbnailInfo') }}</span>
                      </el-form-item>
                    </el-col>
                  </el-from-item>

                </el-form>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="cancelAddSingleChannel">
                  {{ $t('deviceView.cancle') }}
                </el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary" @click="addSingleChannel">
                  {{ $t('deviceView.confirm') }}
                </el-button>
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
import { deviceRESTful } from '@/api/index';
import { isLoginIn } from '@/api/login';
import { mapMutations, mapGetters } from 'vuex';
import { getStoreList, getBriefStoreList } from '@/api/store';
import filterString from '@/common/filterString';

export default {
  name: 'NvrDeviceMgmt',
  data() {
    return {
      dash: {},
      activeName: 'dash',
      total: 0,
      page: 1,
      sizeNum: 10,
      nvrData: [],
      // the filter flag
      nvrFilter: true,
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
      addNvrData: { ivsId: '', name: '', channelCount: 1, storeId: '' },
      channelNumList: [
        {
          value: 1,
          label: '1 ' + this.$t('deviceView.unit')
        },
        {
          value: 2,
          label: '2 ' + this.$t('deviceView.unit')
        },
        {
          value: 3,
          label: '3 ' + this.$t('deviceView.unit')
        },
        {
          value: 4,
          label: '4 ' + this.$t('deviceView.unit')
        },
        {
          value: 5,
          label: '5 ' + this.$t('deviceView.unit')
        },
        {
          value: 6,
          label: '6 ' + this.$t('deviceView.unit')
        },
        {
          value: 7,
          label: '7 ' + this.$t('deviceView.unit')
        },
        {
          value: 8,
          label: '8 ' + this.$t('deviceView.unit')
        },
        {
          value: 9,
          label: '9 ' + this.$t('deviceView.unit')
        },
        {
          value: 10,
          label: '10 ' + this.$t('deviceView.unit')
        },
        {
          value: 11,
          label: '11 ' + this.$t('deviceView.unit')
        },
        {
          value: 12,
          label: '12 ' + this.$t('deviceView.unit')
        },
        {
          value: 13,
          label: '13 ' + this.$t('deviceView.unit')
        },
        {
          value: 14,
          label: '14 ' + this.$t('deviceView.unit')
        },
        {
          value: 15,
          label: '15 ' + this.$t('deviceView.unit')
        },
        {
          value: 16,
          label: '16 ' + this.$t('deviceView.unit')
        }
      ],
      storeDataList: [],
      newChannelNumList: [],
      channelBtnDisabled: false,
      editNvrChannelNumList: [],
      showConfirmDelete: false,
      rules: {
        ivsId: [
          { required: true, message: this.$t('deviceView.inputIvsId'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('deviceView.inputNvrName'), trigger: 'blur' }
        ],
        channelCount: [
          { required: true, message: '请选择通道数目', trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('deviceView.selectStore'), trigger: 'change' }
        ]
      },
      showDeleteChannel: false,
      addChannelData: { name: '', channelId: '', pictureUrl: '', file: '' },
      channelRules: {
        name: [
          { required: true, message: this.$t('deviceView.inputChannelName'), trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: this.$t('deviceView.selectNvrChannel'), trigger: 'change' }
        ],
        pictureUrl: [
          { required: true, message: this.$t('deviceView.uploadImage'), trigger: 'blur' }
        ]
      },
      showAddChannelDialog: false,
      file: '',
      deleteChannelId: 0,
      isUpdate: false,
      nvrNameTemp: '',
      nvrChannelCountTemp: 0,
      channelNameRuletip: false,
      NvrnameRuletip: false,
      ivsIdRuletip: false
    };
  },
  watch: {
    accountChanged(val) {
      const self = this;
      if (val !== 0) {
        self.InitData();
        self.getBriefStoreData();
      }
    }
  },
  computed: {
    varyDivHeight: function() {
      if (this.varyWindowHeight > 800) {
        return this.varyWindowHeight * 0.58;
      } else if (this.varyWindowHeight > 700) {
        return this.varyWindowHeight * 0.45;
      } else {
        return this.varyWindowHeight * 0.526;
      }
    },
    ...mapGetters({
      accountChanged: 'accountChanged'
    })
  },

  methods: {
    handleChange(file) {
      this.addChannelData.pictureUrl = file.url;
      this.addChannelData.file = file;
      this.file = file.raw;
    },

    handleEditChange(file) {
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
        if (this.showAddChannelDialog) {
          this.addChannelData.pictureUrl = '';
          this.addChannelData.file = '';
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
      self.nvrChannelCountTemp = item.channelCount;
      self.getChannelListByNVR(item.ivsId);
      self.nvrData.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isClick = false;
        }
      });
    },

    getDashServerInfo() {
      const self = this;
      return new Promise((resolve, reject) => {
        deviceRESTful.getDashServerInfo().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    checkBeforeImport() {
      const self = this;
    },

    checkDashInfo() {
      const self = this;
      let msg = '';
      if (self.dash.url.toString().trim().length === 0
        || self.dash.httpCmdPort.toString().trim().length === 0
        || self.dash.httpsCmdPort.toString().trim().length === 0
        || self.dash.dataPort.toString().trim().length === 0)
      {
        msg = this.$t('deviceView.emptyInfo');
      }
      if (!validateURL(self.dash.url)) {
        msg = this.$t('deviceView.ipErrorInfo');
      }
      if (validatePort(self.dash.httpCmdPort) ||
          validatePort(self.dash.httpsCmdPort) || validatePort(self.dash.dataPort)) {
        msg = this.$t('deviceView.portErrorInfo');
      }
      return msg;
    },

    getDashURL() {
      const self = this;
      let url = '';
      let dataPort = '';
      if (self.dash.url.indexOf('https') !== -1) {
        dataPort = self.dash.httpsCmdPort;
      } else {
        dataPort = self.dash.httpCmdPort;
      }
      url = self.dash.url + ':' + dataPort;
      return url;
    },

    async connectServer() {
      const self = this;
      const data = await self.getDashServerInfo();
      const msg = self.checkDashInfo();
      if (msg.length !== 0) {
        self.notify(msg, 'warning', 3000);
        setTimeout(function() {
          if (data.errCode != null && data.errMsg === 'Success') {
            self.dash = data.data;
          }
        }, 1000);
        return false;
      }
      const params = {
        'url': self.dash.url,
        'httpCmdPort': self.dash.httpCmdPort,
        'httpsCmdPort': self.dash.httpsCmdPort,
        'dataPort': self.dash.dataPort
      };
      if (data.errCode != null && data.errCode === 500) { // Dash Server does not exsit!
        deviceRESTful.addDashServer(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            self.notify(this.$t('deviceView.connectSuss'), 'success', 3000);
            const url = self.getDashURL();
            sessionStorage.setItem('DASH_URL', url);
            self.$store.commit('SET_DASHURL', url);
          } else {
            self.notify(this.$t('deviceView.connectFail'), 'warning', 3000);
            return false;
          }
        });
      } else {
        deviceRESTful.upateDashServer(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            self.notify(this.$t('deviceView.connectSuss'), 'success', 3000);
            const url = self.getDashURL();
            sessionStorage.setItem('DASH_URL', url);
            self.$store.commit('SET_DASHURL', url);
          } else {
            self.notify(this.$t('deviceView.connectFail'), 'warning', 3000);
            setTimeout(function() {
              self.dash = data.data;
            }, 1000);
            return false;
          }
        });
      }
    },

    async getChannelListInit() {
      const self = this;
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
      self.getNVRList(params);
    },

    handleClick(tabs) {
      const self = this;
      const index = Number(tabs.index);
      switch (index) {
        case 0:
          self.$store.dispatch('GetDash').then((res) => {
            const data = res.data;
            if (res.errMsg === 'Success' && res.errCode === 0) {
              self.dash = data;
            } else {
              self.dash = { 'url': '', 'httpCmdPort': '', 'httpsCmdPort': '', 'dataPort': '' };
            }
          });
          break;
        case 1:
          self.getChannelListInit();
          break;
      }
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
      this.getNVRList(params);
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
      self.getNVRList(params);
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
      self.getNVRList(params);
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
      self.getNVRList(params);
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

    addDevice(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.addDevice(params).then(resDevice => {
          resolve(resDevice);
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
      const data = await self.getAllNVRData();
      self.channelData = await self.getChannelData();
      const nvrList = [];
      const channelList = self.channelData.map(x => x.id);
      data.forEach(item => {
        nvrList.push(item.ivsId);
      });
      if (channelList.length === 0 && nvrList.length === 0) {
      } else if (channelList.length === 0 && nvrList.length !== 0) {
        await self.deleteNVR(nvrList);
      } else if (channelList.length !== 0 && nvrList.length === 0) {
        await self.deleteChannel(channelList);
      } else {
        await self.deleteChannel(channelList);
        await self.deleteNVR(nvrList);
      }
      const res1 = await self.addNVR(paramsNVR);
      const res2 = await self.addDevice(paramsDevice);
      if (res1.errMsg === 'Success' && res2.errMsg === 'Success') {
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
      self.getNVRList(params);
    },

    downItem() {
      // to do nothing
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
            if (nvrDataTemp.map(x => x.ivsId).indexOf(item['IVS ID']) === -1) {
              const obj = {
                ivsId: item['IVS ID'],
                name: item['NVR名称'],
                channelCount: item['通道数'],
                storeId: item['StoreID']
              };
              nvrDataTemp.push(obj);
            }
            const obj = {
              name: item['通道名称'],
              storeId: item['StoreID'],
              ivsId: item['IVS ID'],
              channelId: item['通道序号']
            };
            channelDataTemp.push(obj);
          });

          const params1 = {
            'nvr': nvrDataTemp
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
        const tHeader = ['StoreID', '所属门店', 'IVS ID', 'NVR名称', '通道数', '通道名称', '通道序号'];
        const filterVal = ['storeId', 'storeName', 'ivsId', 'nvrName', 'channelCount', 'channelName', 'channelNum'];
        const nvrData = await that.getAllNVRData();
        const channelData = that.channelData;
        const excelData = [];
        if (nvrData.length !== 0 && channelData.length !== 0) {
          nvrData.forEach((item, index) => {
            channelData.forEach((_item, _index) => {
              if (item.ivsId === _item.ivsId) {
                const obj = {};
                obj.storeId = item.storeId;
                obj.storeName = item.storeName;
                obj.ivsId = item.ivsId;
                obj.nvrName = item.name;
                obj.channelCount = item.channelCount;
                obj.channelName = _item.name;
                obj.channelNum = _item.channelId;
                excelData.push(obj);
              }
            });
          });
        }

        const list = excelData;
        const data = that.formatJson(filterVal, list);

        export_json_to_excel(tHeader, data, this.$t('deviceView.importExample'));
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
        case 2: self.downItem(); break;
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
      if (item.id !== 0) {
        this.updateNvrChannel(item)
      } else {

      }
    },

    updateNvrChannel(item) {
      let self = this;
      self.isUpdate = false;
      let channelObj = {};
      channelObj.id = self.curChannelItem.id;
      channelObj.name = self.curChannelItem.tempName;
      if (channelObj.name.trim().length === 0) {
        self.notify(self.$t('deviceView.channelNameEmpty'), 'warning', 3000);
        return false;
      }
      const params = channelObj;
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
        self.getChannelListByNVR(self.curNVRItem.ivsId);
      }).catch(err => {
        console.log("NVRDeviceManagement-updateNvrChannel: " + err);
      });
    },

    addNvrChannel(item){
      let self = this;
      let json = {};
      json.name = item.tempName;
      json.storeId = self.curNVRItem.storeId;
      json.ivsId = self.curNVRItem.ivsId;
      json.channelId = item.channelId;
      json.vendor = 0;
      let deviceArr = [];
      deviceArr.push(json);
      let params = {};
      params.device = deviceArr;
      deviceRESTful.addDevice(params).then(res => {
        let errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
          self.curChannelItem.isClick = false;
        } else {
          self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData();
          self.getChannelListByNVR(self.curNVRItem.ivsId);
        }).catch(err => {
        console.log("NVRDeviceManagement-addNvrChannel: " + err);
      });
    },

    getNVRList(params) {
      let self = this;
      deviceRESTful.getNVRList(params).then(res => {
        let errMsg = res.errMsg;
        let temp = [];
        if (errMsg != undefined && errMsg === 'Success') {
          let data = res.data.content;
          data.forEach((item, index) => {
            let obj = {};
            obj.ivsId = item.ivsId;
            obj.name = item.name;
            obj.tempDeviceName = item.name;
            obj.store = item.storeName;
            obj.storeId = item.storeId;
            obj.channelCount = item.channelCount;
            obj.tempChannelCount = item.channelCount;
            obj.channelNum = item.channelCount + self.$t('deviceView.unit');
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
            self.getChannelListByNVR(self.nvrData[0].ivsId);
          } else {
            self.channelData = [];
            self.channelList = [];
          }
        });
    },

    searchNVRList() {
      // do nothing
    },

    getChannelData() {
      let self = this;
      return new Promise((resolve, reject) => {
        deviceRESTful.getDeviceList().then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res.data);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getChannelListByNVR(ivsId) {
      let self = this;
      let temp = [];
      self.channelData.forEach(item => {
        if (item.ivsId === ivsId) {
          let obj = {};
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
      // order by channeId of channelList to get max channel num
      if (self.channelList.length === 0) {
        self.editNvrChannelNumList = self.channelNumList;
      } else {
        let sortArr = self.channelList.sort(self.getSortFun('channelId'));
        let lastChannel = sortArr[sortArr.length - 1];
        let maxChannleId = lastChannel.channelId;
        let spliceArray = self.channelNumList.filter(x => x.value >= maxChannleId);
        self.editNvrChannelNumList = spliceArray;
      }
    },

    async InitData() {
      let self = this;
      if (self.varyWindowHeight >= 760) {
        self.sizeNum = 20;
      } else {
        self.sizeChange = 10;
      }
      self.$store.dispatch('GetDash').then((res) => {
        let data = res.data;
        if (res.errMsg == 'Success' && res.errCode == 0) {
          self.dash = data;
        }
      });
      let params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getNVRList(params); // get NVR list
    },

    async getAllStoreList() {
      let self = this;
      let params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      let retData = await self.getStoreData(params);
      let storeList = retData.data.content;
      self.storeList = storeList;
      let tempStore = [];
      storeList.forEach(item => {
        let obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
    },

    getBriefStoreData() {
      let self = this;
      getBriefStoreList().then(res => {
        let errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          let storeList = res.data;
          self.storeList = storeList;
          let tempStore = [];
          storeList.forEach(item => {
            let obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId
            };
            tempStore.push(obj);
          });
          self.storeDataList = tempStore;
        }
      });
    },

    getStoreData(params) {
      let self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          let errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            let data = res.data;
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    // add NVR
    addSingleNvr() {
      let self = this;
      self.$refs['nvrForm'].validate(async(valid) => {
        if (valid) {
          let nvrParams = {};
          let nvrArray = [];
          nvrArray.push(self.addNvrData);
          nvrParams.nvr = nvrArray;
          let res1 = await self.addNVR(nvrParams);

          if (res1.errMsg === 'Success') {
            self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
            self.showAddNvrDialog = false;
          } else {
            self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
            self.showAddNvrDialog = false;
          }
          self.addNvrData = { ivsId: '', name: '', channelCount: 1, storeId: self.storeDataList[0].storeId };
          self.page = 1;
          let params = {
            'filter': {
              'page': self.page - 1,
              'size': self.sizeNum
            },
            'order': {
              'direction': 'asc',
              'property': 'name'
            }
          };
          self.getNVRList(params);
        } else {
          return false;
        }
      });
    },

    // cancel to add nvr
    cancelAddNvr() {
      let self = this;
      self.showAddNvrDialog = false;
    },

    // add channel
    addSingleChannel() {
      let self = this;
      self.$refs['channelForm'].validate(async(valid) => {
        if (valid) {
          let json = {};
          json.name = self.addChannelData.name;
          json.storeId = self.curNVRItem.storeId;
          json.ivsId = self.curNVRItem.ivsId;
          json.channelId = self.addChannelData.channelId;
          json.vendor = 0;
          let deviceArr = [];
          deviceArr.push(json);
          let devParams = {};
          devParams.device = deviceArr;
          let res1 = await self.addDevice(devParams);
          if (res1.errMsg === 'Success') {
            let fm = new FormData();
            let channelId = res1.data[0];
            fm.append('id', channelId);
            fm.append('picture', self.file);
            let attachRes = await self.attachImageToDevice(fm);
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
          let params = {
            'filter': {
              'page': self.page - 1,
              'size': self.sizeNum
            },
            'order': {
              'direction': 'asc',
              'property': 'name'
            }
          };
          self.channelData = await self.getChannelData();
          self.getChannelListByNVR(self.curNVRItem.ivsId);
        } else {
          return false;
        }
      });
    },

    // cancel to add channel
    cancelAddSingleChannel() {
      let self = this;
      self.showAddChannelDialog = false;
      self.addChannelData = { name: '', channelId: '', pictureUrl: '', file: '' };
    },
    // attach image to channel
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
      let self = this;
      self.showDeleteChannel = true;
      self.deleteChannelId = item.id;
    },

    deleteSingleChannel() {
      let self = this;
      self.showDeleteChannel = false;
      let idsArr = [];
      idsArr.push(self.deleteChannelId);
      let obj = {};
      obj.deviceIds = idsArr;
      let params = obj;
      deviceRESTful.deleteDevice(params).then(res => {
        let errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
        } else {
          self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData();
          self.getChannelListByNVR(self.curNVRItem.ivsId);
        }).catch(err => {
        console.log("NVRDeviceManagement-deleteSingleChannel: " + err);
      });
    },

    editSingleNvr(index, item) {
      let self = this;
      item.isEditing = true;
      self.nvrData.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isEditing = false;
        }
      });
    },

    showAddDialog() {
      let self = this;
      self.showAddNvrDialog = true;
      self.addNvrData = { ivsId: '', name: '', channelCount: 1, storeId: self.storeDataList[0].storeId };
    },

    confirmEditNvr(index, item) {
      let self = this;
      item.name = item.tempDeviceName;
      let obj = {};
      obj.ivsId = item.ivsId;
      obj.name = item.tempDeviceName;
      obj.storeId = item.storeId;
      obj.channelCount = item.tempChannelCount;
      if (obj.name.trim().length === 0) {
        self.notify(self.$t('deviceView.nvrNameEmpty'), 'warning', 3000);
        return false;
      }
      let arr = [];
      arr.push(obj);
      let params = {};
      params.nvr = arr;
      deviceRESTful.updateNVR(params).then(res => {
        let errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          item.isEditing = false;
        } else {
          self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          item.isEditing = false;
        }
      })
        .then(async() => {
          self.channelData = await self.getChannelData();
          self.getChannelListByNVR(self.curNVRItem.ivsId);
        }).catch(err => {
        console.log("NVRDeviceManagement-confirmEditNvr: " + err);
      });
    },

    cancelEditNvr(index, item) {
      let self = this;
      item.isEditing = false;
      item.tempDeviceName = item.name;
      item.tempChannelCount = item.channelCount;
    },

    async deleteSingleNVR() {
      let self = this;
      self.showConfirmDelete = false;
      let ivsId = self.curNVRItem.ivsId;
      let nvrList = [];
      nvrList.push(ivsId);
      let channelList = self.channelList.map(x => x.id);
      try {
        if (channelList.length > 0) {
          let res1 = await self.deleteChannel(channelList);
          let res2 = await self.deleteNVR(nvrList);
          if (res1.errMsg === 'Success' && res2.errMsg === 'Success') {
            self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
          } else {
            self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
          }
        } else {
          let res2 = await self.deleteNVR(nvrList);
          if (res2.errMsg === 'Success') {
            self.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
          } else {
            self.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
          }
        }
        let params = {
          'filter': {
            'page': self.page - 1,
            'size': self.sizeNum
          },
          'order': {
            'direction': 'asc',
            'property': 'name'
          }
        };
        self.getNVRList(params);
      }
      catch (err) {
        console.log("NVRDeviceManagement-deleteSingleNVR: " + err);
      }
    },

    addNewChannel() {
      let self = this;
      let channelNum = self.curNVRItem.channelCount;
      self.channelNumList.forEach(item => {
        item.disabled = false;
      });
      let spliceArray = self.channelNumList.filter(x => x.value <= channelNum);
      spliceArray.forEach(item => {
        self.channelList.forEach(_item => {
          if (item.value === _item.channelId) {
            item.disabled = true;
          }
        });
      });
      let deepArray = JSON.parse(JSON.stringify(spliceArray));
      deepArray.forEach(item => {
        item.label = item.label.split(' ')[0];
      });
      self.newChannelNumList = deepArray;
      self.showAddChannelDialog = true;
      self.addChannelData = { name: '', channelId: '', pictureUrl: '', file: '' };
    },

    getSortFun(sortBy) {
      var ordAlpah = '>';
      var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
      return sortFun;
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },
    ...mapMutations(['SET_DASHURL']),

    nvrNameChange(val, item) {
      let self = this;
      let comment = filterString.all(val, 20);
      if (Object.keys(item).length === 0) {
        self.addNvrData.name = comment;
      } else {
        item.tempDeviceName = comment;
      }
      let length = filterString.getContentLength(val);
      if (length > 20) {
        this.NvrnameRuletip = true;
      } else {
        this.NvrnameRuletip = false;
      }
    },

    channelNameChange(val, item) {
      let self = this;
      let comment = filterString.all(val, 20);
      if (Object.keys(item).length === 0) {
        self.addChannelData.name = comment;
      } else {
        item.tempName = comment;
      }
      let length = filterString.getContentLength(val);
      if (length > 20) {
        this.channelNameRuletip = true;
      } else {
        this.channelNameRuletip = false;
      }
    },

    ivsIdChange(val) {
      let self = this;
      let comment = filterString.all(val, 30);
      self.addNvrData.ivsId = comment;
      let length = filterString.getContentLength(val);
      if (length > 30) {
        this.ivsIdRuletip = true;
      } else {
        this.ivsIdRuletip = false;
      }
    },

    notShowInputRuleTips(e) {
      if (e === 'ivsId') {
        this.ivsIdRuletip = false;
      } else if (e === 'tempName') {
        this.channelNameRuletip = false;
      } else if (e === 'Nvrname') {
        this.NvrnameRuletip = false;
      }
    }
  },

  mounted() {
    this.InitData();
    this.getBriefStoreData();
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
  $tab: #7d8cad;
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
    font-family: Roboto, Arial, Microsoft YaHei;
  }
  .noraml-color{
    color: #4b5262 !important;
    background-color: #FAFAFA;
    cursor: pointer;
    background-color: #f4f5f9;
  }
  .active-color{
    color: $mainColor !important;
    background-color: #fff;
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
    line-height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    min-width: calc(110/1920*100vw);
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
  }
  .en-el-handle-btn{
    margin-left: 0px !important;
    border-color: $mainColor !important;
    color: $mainColor !important;
    border-radius: 0px;
    border-right: 0;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    min-width: 85px;
    min-height: 28px;
    &:last-child{
      border-right: 1px solid;
    }

    &:hover{
      background-color: #FEE4E7;
    }
    &:focus{
      background-color: #FEE4E7;
    }
  }
  .el-device{
    border: 1px solid $border;
    background-color: #FFF;
    .el-btns{
      height: calc(40/1920*100vw);
      position: relative;
      .btns{
        position: absolute;
        @include point(right,25);
        z-index: 979;
        width: calc(130/1920*100vw);
        height: calc(36/1920*100vw);
        font-size: calc(14/1920*100vw);
        padding: 0;
        top: 23px;
      }
    }
    .el-tabPanels{
      padding: 25px calc(25/1920*100vw) 0 calc(25/1920*100vw);
      height: auto;
      position: relative;
      bottom: calc(30/1920*100vw);
      .dialog-content{
        width: 100%;
      }
      .nvr-title .titles{
        color: $tab;
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
            min-width: 140px;
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
        @include point(padding-left,20);
        .info-title{
          font-size: 18px;
          font-weight: bold;
        }
        .add-btn{
          position: absolute;
          @include point(right, 20);
          height: calc(36/1920*100vw);
          width: calc(130/1920*100vw);
          padding: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          .el-icon-plus{
            font-size: calc(16/1920*100vw);
            padding: calc(5/1920*100vw) 0;
          }
          span{
            font-size: calc(14/1920*100vw);
            position: relative;
            bottom: calc(1/1920*100vw);
            @media screen and (max-width: 1280px) {
              bottom: 0;
            };
          }
          @media screen and (max-width: 1680px){
            width: 110px;
          }
        }
      }
      .lisde{
        background: #FAFAFA;
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
          .name-title{
            width: 25%;
          }
          .store-title{
            width: 35%;
          }
          .count-title{
            width: 20%;
          }
          .operation-title{
            width: 15%;
          }
          .en-name-title{
            width: 27%;
          }
          .en-store-title{
            width: 28%;
          }
          .en-count-title{
            width: 30%;
          }
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
            @include point(width,100);
            margin-left: 13%;
            position: relative;
            bottom: 2px;
          }
          .nvr-select{
            @include point(width,60);
            position: relative;
            bottom: 2px;
            left:20px;
            /deep/ .el-input--suffix .el-input__inner{
              padding: 10px;
            }
          }
          .name-data{
            width: 25%;
            height: 100%;
            span{
              display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .store-data{
            width: 35%;
            height: 100%;
            position: absolute;
            /*left: 27%;*/
            span{
              display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .count-data{
            width: 20%;
            height: 100%;
            position: absolute;
            left: 60%;
            span{
              display: inline-block;
              width: 70%;
              margin-left:15px;
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
            width: 17%;
            height: 100%;
            position: absolute;
            left: 83%;
            .iconcontent{
              position: absolute;
              cursor: pointer;
              display: inline-block;
              display: inline-flex;
              align-items: center;
              .iconfont{
                font-size: calc(24/1920*100vw);
                color: $tab;
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
                background-color: rgba(255, 255, 255, 0);
                @include point(line-height,21);
                @include point(height,21);
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
            width: 26%;
          }
          .nape-picture-title{
            width: 25%;
          }
          .nape-handle-title{
            width: 15%;
          }
        }
        .nape-items-title .titles, en-nape-items-title .titles{
          color: $tab;
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
        .nape-items-data{
          overflow: hidden;
          position: relative;
          padding-left: 1%;
          cursor: pointer;
          font-size: 14px;
          height: 90px;
          line-height: 90px;
          //border-bottom: 1px solid red;
          text-align: left;
          .nape-input{
            width: calc(160/1920*100vw);
            margin-left: 13%;
          }
          .nape-name-data{
            width: 30%;
            display: inline-block;
            position: relative;
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
            width: 28%;
            display: inline-block;
            position: relative;
            span{
              margin-left: 20%;
            }
          }
          .nape-picture-data{
            width:26%;
            height: 100%;
            display: inline-block;
            position: relative;
            left: 1%;
            .img-class{
              //height: 90%;
              vertical-align: middle;
              text-align: center;
              line-height: 70px;
              height: 70px;
              width: calc(100/1920*100vw);
              display: inline-block;
              min-width: 85px;
            }
            .upload-demo{
              position: absolute;
              bottom: 0;
              width: calc(100/1920*100vw);
              min-width: 85px;
              /deep/ .el-upload{
                width: 100%;
              }
              /deep/ .el-button{
                width: calc(100/1920*100vw);
                height: 28px;
                opacity: 0.5;
                position: absolute;
                bottom: 10px;
                left: 0;
              }
              /deep/ .el-button--mini{
                padding: 2px;
              }
              /*@media screen and (max-width: 1280px){*/
              /*.edit-picture{*/
              /*position: relative;*/
              /*bottom: 4px;*/
              /*}*/
              /*}*/
            }
          }
          .nape-items-handle{
            width: 12%;
            display: inline-block;
            .iconfont{
              font-size: calc(24/1920*100vw);
              color: $tab !important;
            }
          }
        }

      }
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
    height: calc(70/1920*100vw);
    width: calc(100/1920*100vw);
    color: #7d8cad;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
  }
  .image-span{
    height: calc(70/1920*100vw);
    line-height: calc(70/1920*100vw);
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
