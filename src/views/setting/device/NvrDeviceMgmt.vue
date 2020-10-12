<template>
  <el-row class="el-device" :style="{'min-height':varyWindowHeight-139+'px'}">
    <el-col :span="24" class="el-btns">
      <div style="display:inline-block;" v-if="activeName=='dash'">
        <el-button @click="connectServer"  :size="varWindowWidth>1680?'small':'mini'" class="btns" type="primary">
          {{generateDeviceLang('submit')}}
        </el-button>
      </div>
      <div style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;" v-else>
        <el-input
          v-if="false"
          size="small"
          class="el-search-input"
          v-model="serachVale" @keyup.enter.native="searchNVRList" :placeholder="generateDeviceLang('searchInfo')">
          <i @click="searchNVRList"  slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:7px;left:6px;"></i>
        </el-input>
        <el-button v-for="(item,index) in btnList"
                   :key="index" size="mini" @click="handleNVR(index,item)" :class="lang=='en'? 'en-el-handle-btn': 'el-handle-btn'" :disabled="index==2">
          <div class="btn-area">
            <i :class="item.iconClass" style="font-size: 24px;"></i>
            <span>{{item.btnTitle}}</span>
          </div>
        </el-button>
      </div>
    </el-col>
    <el-col :span="24" class="el-tabPanels">
      <el-tabs v-model="activeName" @tab-click="handleClick" id="en-devicetabs-content">
        <el-tab-pane :label="generateDeviceLang('mediaService')" name="dash">
          <el-col :span="varWindowWidth<1540?12:10" class="dash-content" :style="varWindowWidth<1366?{'font-size':'12px'}:{'font-size':'14px'}">
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{generateDeviceLang('serverIp')}}</span>
              <el-input class="dash-input" v-model="dash.url" size="mini"></el-input>
            </div>
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{generateDeviceLang('port')}}</span>
              <el-input class="dash-input" v-model="dash.httpCmdPort" size="mini"></el-input>
            </div>
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{generateDeviceLang('httpsPort')}}</span>
              <el-input class="dash-input" v-model="dash.httpsCmdPort" size="mini"></el-input>
            </div>
            <div class="details">
              <span class="dash-label"><span style="color:red;margin-right:10px;">*</span>{{generateDeviceLang('dataPort')}}</span>
              <el-input class="dash-input" v-model="dash.dataPort" size="mini"></el-input>
            </div>
            <el-dialog :title="generateDeviceLang('import')"
                       id="importId"
                       :visible.sync="showImportContent" v-if="showImportContent"
                       :close-on-click-modal="false"
                       :append-to-body='true'
                       width="510px"
                       top="35vh"
                       left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;"/>
                <p style="margin-left:26px;margin-bottom:0px;">{{generateDeviceLang('selectFilePos')}}</p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showImportContent = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
                <a href="javascript:;" class="a-upload" @click="checkBeforeImport">{{generateDeviceLang('selectFile')}}
                  <input  id="upload" type="file" @change="importfxx(this)"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </a>
              </div>
            </el-dialog>
            <el-dialog  :title="generateDeviceLang('prompt')"
                        :visible.sync="showConfirmImport" v-if="showConfirmImport"
                        :append-to-body='true'
                        :close-on-click-modal="false"
                        width="510px"
                        top="35vh"
                        left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;"/>
                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"></i>
                  <span style="display: inline-block; vertical-align: middle">{{generateDeviceLang('clearInfo')}}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showConfirmImport = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
                <el-button class="file-confirm-btn" @click="showImportContent=true;showConfirmImport=false" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-tab-pane>
        <el-tab-pane :label="generateDeviceLang('videoMangement')" name="video">
          <el-col :span="lang=='en' && varWindowWidth<1920? 9: 10" class="lisde">
            <div class="nvr-info">
              <span class="info-title">{{generateDeviceLang('deviceInfo')}}</span>
              <el-button type="primary" size="mini" class="add-btn"
                         @click="showAddDialog">
                <i style="margin-right:8px;" class="iconfont el-icon-plus"></i><span>{{generateDeviceLang('addNvr')}}</span>
              </el-button>
            </div>
            <div class="nvr-title tabTitle">
              <div :class="lang=='en' ? 'en-name-title titles': 'name-title titles'">
                <span>{{generateDeviceLang('nvr')}}</span>
                <i class="icon-filter"
                   :class="{'el-icon-arrow-up':nvrFilter,'el-icon-arrow-down':!nvrFilter}" @click="filterNVR"></i>
              </div>
              <div :class="lang=='en' ? 'en-store-title titles': 'store-title titles'" >
                <span>{{generateDeviceLang('store')}}</span>
                <i class="icon-filter"
                   :class="{'el-icon-arrow-up':storeFilter,'el-icon-arrow-down':!storeFilter}" @click="filterStore"></i>
              </div>
              <div :class="lang=='en' ? 'en-count-title titles': 'count-title titles'" >
                <span>{{generateDeviceLang('channelNum')}}</span>
                <!--<i class="icon-filter"-->
                <!--:class="{'el-icon-arrow-up':channelNumFilter,'el-icon-arrow-down':!channelNumFilter}" @click="filterChannelNum"></i>-->
              </div>
              <!--<div :class="lang=='en' ? 'en-operation-title titles': 'operation-title titles'" >-->
              <!--<span>{{generateDeviceLang('operation')}}</span>-->
              <!--</div>-->
            </div>
            <el-scrollbar style="height:100%;" id="el-menuscrollbar">
              <div  :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                <div class="nvr-data group-title"
                     v-for="(item,index) in nvrData"
                     :key="index"  :class="!item.isClick?'noraml-color':'active-color'" @click="clickNVR(index,item)">
                  <div class="proper-flag" v-if="item.isClick"></div>
                  <div class="name-data titles">
                    <span v-if="!item.isEditing">{{item.name.length>15?item.name.substr(0,15)+'...':item.name}}</span>
                    <el-input size="mini"  v-model="item.tempDeviceName"  @input="(val)=>nvrNameChange(val,item)"class="nvr-input" :placeholder="generateDeviceLang('inputNvrName')" v-if="item.isEditing"></el-input>
                  </div>
                  <div class="store-data titles">
                    <span>{{item.store}}</span>
                  </div>
                  <div class="count-data titles">
                    <span v-if="!item.isEditing">{{item.tempChannelCount}}{{$t('deviceView.unit')}}</span>
                    <el-select v-model="item.tempChannelCount" :placeholder="generateDeviceLang('inputNvrNumber')" size="mini" class="nvr-select" v-if="item.isEditing">
                      <el-option
                        v-for="numList in editNvrChannelNumList"
                        :key="numList.value"
                        :label="numList.label"
                        :value="numList.value"
                        :disabled="numList.disabled"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="operation-data titles">
                    <div class="iconcontent" v-if="item.isEditing" style="top:15px;">
                      <div class="iconlised"  @click="confirmEditNvr(index,item)">
                        <i class="el-icon-check" style="position:absolute;top:6px;margin-left:2px;"></i>
                      </div>
                      <div class="iconrised" @click="cancelEditNvr(index,item)">
                        <i class="el-icon-close" style="position:absolute;top:6px;margin-left:2px;"></i>
                      </div>
                    </div>
                    <div class="iconcontent" v-if="!item.isEditing">
                      <div class="iconlised"  @click="editSingleNvr(index,item)"  style=" border: none; background-color: rgba(255, 255, 255, 0); color:#2c3e50; font-weight: normal">
                        <i class="iconfont icon-bianji"></i>
                      </div>
                      <div class="iconrised" @click="showConfirmDelete=true" style="border: none; color:#2c3e50;font-weight: normal">
                        <i class="iconfont icon-shanchu"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <el-dialog  :title="generateDeviceLang('prompt')"
                            :visible.sync="showConfirmDelete" v-if="showConfirmDelete"
                            :append-to-body='true'
                            :close-on-click-modal="false"
                            width="510px"
                            top="35vh"
                            left="40vh">
                  <div class="dialog-content" style="overflow:hidden;width:100%;">
                    <hr style="border: 0.5px solid #dfe2e9;"/>

                    <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                      <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;;display: inline-block; vertical-align: middle"></i>
                      <span style="display: inline-block; vertical-align: middle">{{generateDeviceLang('deleteNvrInfo')}}</span>
                    </p>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button class="file-cancel-btn" @click="showConfirmDelete = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
                    <el-button class="file-confirm-btn" @click="deleteSingleNVR()" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
                  </div>
                </el-dialog>
              </div>
            </el-scrollbar>
            <div class="toolbar pagination" style="width:100%; margin-top:10px;">
              <el-pagination
                style="text-align:right;margin-right:15px;"
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-size="sizeNum"
                :total="total"
                :current-page="page"
                background
                small
                layout="jumper,total,prev,pager,next">
              </el-pagination>
            </div>
          </el-col>
          <el-dialog :title="generateDeviceLang('addNvr')"
                     :visible.sync="showAddNvrDialog" v-if="showAddNvrDialog"
                     :append-to-body='true'
                     :close-on-click-modal="false"
                     width="510px"
                     top="35vh"
                     left="40vh" customClass="addNvr"
          >
            <div class="dialog-content" style="overflow:hidden;width:100%;">
              <hr style="border: 0.5px solid #dfe2e9;"/>
              <el-form :model="addNvrData" :rules="rules" ref="nvrForm" class="nvrForm" label-position="top" size="mini">
                <el-form-item label="IVS ID" prop="ivsId">
                  <el-input v-model="addNvrData.ivsId" @input="(val)=>ivsIdChange(val)" @blur="notShowInputRuleTips('ivsId')"></el-input>
                  <span class="rules" v-if="ivsIdRuletip">{{$t('scheduleView.scheduleNameRuletip')}}</span>
                </el-form-item>
                <el-form-item style="height: 57px;">
                  <el-col :span="13">
                    <el-form-item prop="name" :label="generateDeviceLang('nvr')" style="margin-bottom:0;">
                      <el-input v-model="addNvrData.name" style="width: 100%;" @input="(val)=>nvrNameChange(val, {})" @blur="notShowInputRuleTips('Nvrname')"></el-input>
                      <span class="rules" v-if="NvrnameRuletip">{{generateDeviceLang('NvrnameRuletip')}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" :offset="2">
                    <el-form-item prop="channelCount" :label="generateDeviceLang('channelNum')">
                      <el-select v-model="addNvrData.channelCount" size="mini">
                        <el-option
                          v-for="numList in channelNumList"
                          :key="numList.value"
                          :label="numList.label"
                          :value="numList.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item :label="generateDeviceLang('store')" prop="storeId">
                  <el-select v-model="addNvrData.storeId" style="width: 100%;">
                    <el-option
                      v-for="item in storeDataList"
                      :key="item.storeId"
                      :label="item.label"
                      :value="item.storeId">
                    </el-option>
                  </el-select>
                  <span class="add-label" style="color: rgb(254, 163, 22); display: block">
                      <span style="margin-right: 10px;font-size: 10px;">*</span>{{generateDeviceLang('selectStoreInfo')}}
                    </span>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class="file-cancel-btn" @click="cancelAddNvr" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
              <el-button class="file-confirm-btn" @click="addSingleNvr" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
            </div>
          </el-dialog>
          <el-col :span="lang=='en' && varWindowWidth<1920? 15: 14" class="risde">
            <div class="nvr-info">
              <span class="info-title">{{generateDeviceLang('nvrChannelSetting')}}</span>
              <el-button type="primary" size="mini" class="add-btn"
                         @click="addNewChannel" :disabled="channelBtnDisabled">
                <i style="margin-right:8px;" class="iconfont el-icon-plus"></i><span>{{generateDeviceLang('addChannel')}}</span>
              </el-button>
            </div>
            <div :class="lang=='en'? 'en-nape-items-title tabTitle':'nape-items-title tabTitle'">
              <div class="nape-name-title titles">
                <span>{{generateDeviceLang('channelName')}}</span>
                <!-- <i class="icon-filter"
                :class="{'el-icon-arrow-down':channelFilter,'el-icon-arrow-up':!channelFilter}" @click="filterChannel"></i> -->
              </div>
              <div class="nape-dep-title titles">
                <span>{{generateDeviceLang('nvrChannelNum')}}</span>
                <!-- <i class="icon-filter"
                :class="{'el-icon-arrow-down':channelNumFilter,'el-icon-arrow-up':!channelNumFilter}" @click="filterChannelNum"></i> -->
              </div>
              <div class="nape-picture-title titles">
                <span>{{generateDeviceLang('thumbnail')}}</span>
                <!-- <i class="icon-filter"
                :class="{'el-icon-arrow-down':channelNumFilter,'el-icon-arrow-up':!channelNumFilter}" @click="filterChannelNum"></i> -->
              </div>
              <div class="nape-handle-title titles">
                <span>{{generateDeviceLang('operation')}}</span>
              </div>
            </div>
            <el-scrollbar style="height:100%;" id="el-menuscrollbar">
              <div  :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                <div class="nape-items-data" :style="item.isClick?{'background-color':'#FEE4E7'}:{}"
                     v-for="(item,index) in channelList"
                     :key="index">
                  <div class="nape-name-data">
                    <span class="nape-name" v-if="!item.isClick">{{item.name.length>15?item.name.substr(0,15)+'...':item.name}}</span>
                    <el-input size="mini" @input="(val)=>channelNameChange(val,item)" v-model="item.tempName" class="nape-input input-details" v-if="item.isClick"></el-input>
                  </div>
                  <div class="nape-dep-data">
                    <span class="nape-dep" v-if="item.id != 0 ">{{item.channelId}}</span>
                    <el-select v-model="item.channelId"  size="mini" class="nvr-select" v-if="item.id == 0" style="margin-left: 10%">
                      <el-option
                        v-for="numList in newChannelNumList"
                        :key="numList.value"
                        :label="numList.label"
                        :value="numList.value"
                        :disabled="numList.disabled">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="nape-picture-data">
                    <span v-if="item.tempUrl">
                      <el-image :src="item.tempUrl" class="img-class" v-if="!isUpdate">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                      <el-image :src="`${item.tempUrl +'?'+Math.random()}`" class="img-class" v-else>
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </span>
                    <!--<span v-if="item.tempUrl">-->
                    <!--<img v-if="isUpdate"  :src="item.tempUrl"  class="img-class">-->
                    <!--<img v-else :src="`${item.tempUrl +'?'+Math.random()}`"  class="img-class">-->
                    <!--</span>-->
                    <span v-else class="img-class" style="display: inline-block;background: #cccc;">
                      <span style="font-size: 14px;color: #94a4b4;">{{generateDeviceLang('noImage')}}</span>
                    </span>
                    <el-upload v-if="item.isClick"
                               class="upload-demo"
                               action=""
                               :on-preview="handlePreview"
                               :on-remove="handleRemove"
                               :before-upload="beforeAvatarUpload"
                               :on-change="handleEditChange"
                               list-type="picture">
                      <el-button size="mini" type="primary">
                        <span class="edit-picture">{{generateDeviceLang('editImage')}}</span>
                      </el-button>
                    </el-upload >
                  </div>
                  <div class="nape-items-handle">
                    <div class="iconcontent" v-if="item.isClick">
                      <div class="iconlised"  @click="confrimEdit(index,item)">
                        <i class="el-icon-check"></i>
                      </div>
                      <div class="iconrised" @click="cancelEdit(index,item)">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                    <div v-if="!item.isClick">
                      <i class="iconfont icon-bianji" style="cursor:pointer;margin-right:10px;color:#2c3e50; "
                         @click="handleEdit(index,item)"></i>
                      <i class="iconfont icon-shanchu" style="cursor:pointer;margin-right:10px;color:#2c3e50;"
                         @click="handleDelete(index, item)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <el-dialog  :title="generateDeviceLang('prompt')"
                        :visible.sync="showDeleteChannel" v-if="showDeleteChannel"
                        :append-to-body='true'
                        :close-on-click-modal="false"
                        width="510px"
                        top="35vh"
                        left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;;"/>

                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"></i>
                  <span style="margin: 20px;display: inline-block; vertical-align: middle">{{generateDeviceLang('deleteChannel')}}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showDeleteChannel = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
                <el-button class="file-confirm-btn" @click="deleteSingleChannel()" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
              </div>
            </el-dialog>
            <el-dialog :title="generateDeviceLang('addChannel')"
                       :visible.sync="showAddChannelDialog" v-if="showAddChannelDialog"
                       :append-to-body='true'
                       :close-on-click-modal="false"
                       width="510px"
                       top="35vh"
                       left="40vh" customClass="addNvr"
            >
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;"/>
                <el-form :model="addChannelData" :rules="channelRules" ref="channelForm" class="nvrForm" label-position="top" size="mini">
                  <el-form-item style="height: 57px;">
                    <el-col :span="12">
                      <el-form-item prop="name" :label="generateDeviceLang('channelName')" style="margin-bottom:0;">
                        <el-input :placeholder="generateDeviceLang('inputChannelName')" v-model="addChannelData.name" style="width: 100%;" @input="(val)=>channelNameChange(val,{})" @blur="notShowInputRuleTips('tempName')"></el-input>
                        <span class="rules" v-if="channelNameRuletip">{{generateDeviceLang('NvrnameRuletip')}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item prop="channelId" :label="generateDeviceLang('channelOrder')">
                        <el-select v-model="addChannelData.channelId" :placeholder="generateDeviceLang('selectNvrChannel')" size="mini">
                          <el-option
                            v-for="numList in newChannelNumList"
                            :key="numList.value"
                            :label="numList.label"
                            :value="numList.value"
                            :disabled="numList.disabled"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-from-item>
                    <el-col :span="8">
                      <el-form-item :label="generateDeviceLang('thumbnail')" ref="uploadElement" prop="pictureUrl">
                        <el-input v-model="addChannelData.pictureUrl" v-if="false"></el-input>
                        <el-upload
                          class="avatar-uploader"
                          ref="upload"
                          :show-file-list="false"
                          action=""
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :before-upload="beforeAvatarUpload"
                          :on-change="handleChange"
                          accept="image/png,image/jpg,image/jpeg"
                          list-type="picture"
                          :data="addChannelData">
                          <el-button  size="mini" type="primary" style=" margin-bottom: 0px;position: relative;margin-right: 0px;">
                            <i style="margin-right:10px;font-size:16px;" class="iconfont el-icon-plus"></i><span>{{generateDeviceLang('selectPicture')}}</span>
                          </el-button>
                          <!--<img :src="addChannelData.pictureUrl" class="avatar" style="border: 1px dashed #d9d9d9;">-->
                        </el-upload>
                        <el-image :src="addChannelData.pictureUrl" class="image-class">
                          <div slot="error" class="image-slot">
                            <span class="image-span">{{$t('deviceView.preview')}}</span>
                          </div>
                        </el-image>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16" :offset="varWindowWidth<1440? 3: 0">
                      <el-form-item label="">
                        <span class="picture-tips">*{{generateDeviceLang('thumbnailInfo')}}</span>
                      </el-form-item>
                    </el-col>
                  </el-from-item>

                </el-form>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="cancelAddSingleChannel" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
                <el-button class="file-confirm-btn" @click="addSingleChannel" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
  import {validateInput,validateURL,validatePort} from '@/common/validate'
  import {deviceRESTful} from '@/api/index'
  import {isLoginIn} from '@/api/login'
  import { mapMutations,mapGetters} from 'vuex'
  import {generateDeviceLang} from '@/api/i18n'
  import {getStoreList,getBriefStoreList} from '@/api/store'
  import filterString from '@/common/filterString'


  export default {
    name:'NvrDeviceMgmt',
    data(){
      return{
        dash:{},
        activeName:'dash',
        total:0,
        page:1,
        sizeNum:10,
        nvrData:[],
        //the filter flag
        nvrFilter:true,
        nvrFilterName:'',
        storeFilter:true,
        channelFilter:true,
        channelNumFilter:true,
        // paperCount:3,
        showImportContent:false,
        showConfirmImport:false,
        channelList:[],
        channelData:[],
        serachVale:'',
        curChannelItem:{},
        btnList:[
          {
            id:0,
            iconClass:'iconfont icon-daoru',
            name:'import',
            btnTitle: this.$t('insSettingView.import'),
            enabled:true,
          },
          {
            id:0,
            iconClass:'iconfont icon-daochu',
            name:'export',
            btnTitle: this.$t('insSettingView.export'),
            enabled:true,
          },
          {
            id:0,
            iconClass:'iconfont icon-xiazai',
            name:'download',
            btnTitle: this.$t('insSettingView.download'),
            enabled:true,
          }
        ],
        varWindowWidth:window.innerWidth,
        varyWindowHeight:window.innerHeight,
        curNVRItem:null,
        lang: this.$i18n.locale,
        showAddNvrDialog: false,
        addNvrData: {ivsId:'',  name:'', channelCount: 1, storeId: ''},
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
            label: '3 '+ this.$t('deviceView.unit')
          },
          {
            value: 4,
            label: '4 ' + this.$t('deviceView.unit')
          },
          {
            value: 5,
            label: '5 '+ this.$t('deviceView.unit')
          },
          {
            value: 6,
            label: '6 '+ this.$t('deviceView.unit')
          },
          {
            value: 7,
            label: '7 '+ this.$t('deviceView.unit')
          },
          {
            value: 8,
            label: '8 '+ this.$t('deviceView.unit')
          },
          {
            value: 9,
            label: '9 '+ this.$t('deviceView.unit')
          },
          {
            value: 10,
            label: '10 '+ this.$t('deviceView.unit')
          },
          {
            value: 11,
            label: '11 '+ this.$t('deviceView.unit')
          },
          {
            value: 12,
            label: '12 '+ this.$t('deviceView.unit')
          },
          {
            value: 13,
            label: '13 '+ this.$t('deviceView.unit')
          },
          {
            value: 14,
            label: '14 '+ this.$t('deviceView.unit')
          },
          {
            value: 15,
            label: '15 '+ this.$t('deviceView.unit')
          },
          {
            value: 16,
            label: '16 '+ this.$t('deviceView.unit')
          }
        ],
        storeDataList:[],
        newChannelNumList:[], //新增通道时可选的通道号
        channelBtnDisabled: false, //新增通道按钮是否禁用
        editNvrChannelNumList: [], //编辑NVR时的通道列表
        showConfirmDelete: false, //删除NVR时的提示信息
        rules: {
          ivsId: [
            { required: true, message: this.$t('deviceView.inputIvsId'), trigger: 'blur' }
          ],
          name: [
            { required: true, message: this.$t('deviceView.inputNvrName'), trigger: 'blur' }
          ],
          channelCount: [
            {required: true, message: '请选择通道数目', trigger: 'change' }
          ],
          storeId: [
            {required: true, message: this.$t('deviceView.selectStore'), trigger: 'change' }
          ]
        },
        showDeleteChannel: false,
        addChannelData: {name: '', channelId: '', pictureUrl: '', file: ''},
        channelRules: {
          name: [
            { required: true, message: this.$t('deviceView.inputChannelName'), trigger: 'blur' }
          ],
          channelId: [
            {required: true, message: this.$t('deviceView.selectNvrChannel'), trigger: 'change' }
          ],
          pictureUrl: [
            {required: true, message: this.$t('deviceView.uploadImage'), trigger: 'blur' }
          ]
        },
        showAddChannelDialog: false, //是否显示增加通道对话框
        file:'',
        deleteChannelId: 0,
        isUpdate: false,
        nvrNameTemp: '',
        nvrChannelCountTemp: 0,
        channelNameRuletip:false,
        NvrnameRuletip:false,
        ivsIdRuletip:false
      }
    },
    watch:{
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.InitData();
          self.getBriefStoreData();
        }
      }
    },
    computed:{
      varyDivHeight:function(){
        if(this.varyWindowHeight>800){
          return this.varyWindowHeight*0.58;
        }
        else if(this.varyWindowHeight>700){
          return this.varyWindowHeight*0.45;
        }
        else{
          return this.varyWindowHeight*0.526;
        }
      },
      ...mapGetters({
        accountChanged:'accountChanged'
      }),
    },
    methods:{
      generateDeviceLang,
      handleChange (file, fileList) {
        this.addChannelData.pictureUrl = file.url;
        this.addChannelData.file = file;
        this.file = file.raw;
        console.log(this.addChannelData.pictureUrl);
      },
      handleEditChange(file, fileList) {
        let self = this;
        self.isUpdate = false;
        this.channelList.forEach(item=>{
          if(item.isClick){
            item.tempUrl = file.url;
            console.log(item.tempUrl)
          }
        })
        this.file = file.raw;
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeAvatarUpload (file) {
        let fileName = file.name.split('.');
        let fileType = fileName[fileName.length-1];
        console.log(fileType)
        const isJPEG = fileType === 'jpeg';
        const isJPG = fileType === 'jpg';
        const isPNG = fileType === 'png';
        const isLt60K = file.size / 1024 < 60;
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error(this.$t('deviceView.imgTypeInfo'));
          this.file = '';
          this.channelList.forEach(item=>{
            if(item.isClick){
              item.tempUrl = item.pictureUrl;
            }
          })
          if(this.showAddChannelDialog){
            this.addChannelData.pictureUrl = '';
            this.addChannelData.file = '';
          }
          return (isJPEG || isJPG || isPNG)
        }
        else if (!isLt60K) {
          this.$message.error(this.$t('deviceView.imgSizeInfo'));
          this.file = '';
          this.channelList.forEach(item=>{
            if(item.isClick){
              item.tempUrl = item.pictureUrl;
            }
          })
          if(this.showAddChannelDialog){
            this.addChannelData.pictureUrl = '';
            this.addChannelData.file = '';
          }
          return isLt60K;
        }
        //return (isJPEG || isJPG || isPNG) && isLt60K;
      },

      /**
       * 移除图片
       */
      handleRemove (file, fileList) {
        console.log(`移除图片回调`, fileList);
      },

      // 修改table tr行的背景色
      tableRowStyle({ row, rowIndex }) {
        return 'background-color: #FAFAFA;height:50px;font-size:14px; border-bottom: 1px solid #ddd;font-weight: bold;'
      },
      // 修改table header的背景色
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #FAFAFA;color: #909399;font-weight: bold;height:48px;'
        }
      },
      clickNVR(index,item){
        let self=this;
        item.isClick=true;
        self.curNVRItem=item;
        self.nvrChannelCountTemp = item.channelCount;
        self.getChannelListByNVR(item.ivsId);
        self.nvrData.forEach((_item,_index)=>{
          if(index!=_index){
            _item.isClick=false;
          }
        })
      },
      getDashServerInfo(){
        let self=this;
        return new Promise((resolve,reject)=>{
          deviceRESTful.getDashServerInfo().then(res=>{
            console.log(res.errMsg);
            resolve(res);
          })
        })
      },
      checkBeforeImport(){
        let self=this;
        console.log('checkbeforeImport');
      },
      checkDashInfo(){
        let self=this;
        let msg='';
        if(self.dash.url.toString().trim().length==0||self.dash.httpCmdPort.toString().trim().length==0
          ||self.dash.httpsCmdPort.toString().trim().length==0||self.dash.dataPort.toString().trim().length==0){
          //msg='当前配置项均为必填项！';
          msg=this.$t('deviceView.emptyInfo');
        }
        if(!validateURL(self.dash.url)){
          //msg='当前配置项中IP格式错误！';
          msg=this.$t('deviceView.ipErrorInfo');
        }
        if(validatePort(self.dash.httpCmdPort)
          ||validatePort(self.dash.httpsCmdPort)||validatePort(self.dash.dataPort)){
          //msg='当前配置项端口格式错误！';
          msg=this.$t('deviceView.portErrorInfo');
        }
        return msg;
      },
      getDashURL(){
        let self=this;
        let url='';
        let dataPort='';
        if(self.dash.url.indexOf('https')!=-1){
          dataPort=self.dash.httpsCmdPort;
        }
        else{
          dataPort=self.dash.httpCmdPort;
        }
        url=self.dash.url+':'+dataPort;
        return url;
      },
      async connectServer(){
        let self=this;
        let data=await self.getDashServerInfo();
        let msg=self.checkDashInfo();
        if(msg.length!=0){
          self.notify(msg,'warning',3000);
          setTimeout(function(){
            if(data.errCode!=null&&data.errMsg=='Success'){
              self.dash=data.data;
            }
          },1000)
          return false;
        }
        let params={
          "url": self.dash.url,
          "httpCmdPort": self.dash.httpCmdPort,
          "httpsCmdPort": self.dash.httpsCmdPort,
          "dataPort": self.dash.dataPort
        };
        if(data.errCode!=null&&data.errCode==500){ //Dash Server does not exsit!
          deviceRESTful.addDashServer(params).then(res=>{
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              self.notify(this.$t('deviceView.connectSuss'),'success',3000);
              let url=self.getDashURL();
              sessionStorage.setItem('DASH_URL',url);
              self.$store.commit('SET_DASHURL', url);
            }
            else{
              self.notify(this.$t('deviceView.connectFail'),'warning',3000);
              return false;
            }
          })
        }
        else{
          deviceRESTful.upateDashServer(params).then(res=>{
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              self.notify(this.$t('deviceView.connectSuss'),'success',3000);
              let url=self.getDashURL();
              sessionStorage.setItem('DASH_URL',url);
              self.$store.commit('SET_DASHURL', url); //修改后更新vuex中的url值
            }
            else{
              self.notify(this.$t('deviceView.connectFail'),'warning',3000);
              setTimeout(function(){
                self.dash=data.data;
              },1000)
              return false;
            }
          })
        }
      },
      async getChannelListInit(){
        let self=this;
        //self.channelData=await self.getChannelData();   //获取channel信息
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": "asc",
            "property": "name"
          }
        };
        self.getNVRList(params);       //获取NVR 数据信息
      },
      handleClick(tabs){
        console.log(tabs);
        let self=this;
        let index=Number(tabs.index);
        switch(index){
          case 0:
            self.$store.dispatch('GetDash').then((res)=>{
              let data=res.data;
              if(res.errMsg=='Success'&&res.errCode==0){
                self.dash=data;
              }
              else{
                self.dash={'url':'','httpCmdPort':'','httpsCmdPort':'','dataPort':''}
              }
            });
            break;
          case 1:
            self.getChannelListInit();
            break;
        }
      },
      importItem(){
        this.showConfirmImport=true;
      },
      exportItem(){
        let self=this;
        self.export2Excel();
      },
      sizeChange(val){
        let self=this;
        self.sizeNum=val;
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": "asc",
            "property": "name"
          }
        };
        this.getNVRList(params);
      },
      currentChange(val){
        let self=this;
        self.page=val;
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": "asc",
            "property": "name"
          }
        };
        self.getNVRList(params);
      },
      //nvr list filter
      filterNVR(){
        let self=this;
        self.nvrFilter=!self.nvrFilter;
        console.log(self.nvrFilter);
        self.page=1;
        self.nvrFilterName='name';
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": self.nvrFilter?"asc":"desc",
            "property": "name"
          }
        };
        self.getNVRList(params);
      },
      filterStore(){
        let self=this;
        self.storeFilter=!self.storeFilter;
        console.log(self.storeFilter);
        self.page=1;
        self.nvrFilterName='storeName';
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": self.storeFilter?"asc":"desc",
            "property": "storeName"
          }
        };
        self.getNVRList(params);
      },
      filterChannel(){
        let self=this;
      },
      filterChannelNum(){
        let self=this;
        self.channelNumFilter=!self.channelNumFilter;
        console.log(self.channelNumFilter);
        self.page=1;
        self.nvrFilterName='channelCount';
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": self.channelNumFilter?"asc":"desc",
            "property": "channelCount"
          }
        };
        self.getNVRList(params);
      },
      deleteChannel(channelList){
        let params={
          deviceIds:channelList
        };
        return new Promise((resolve,reject)=>{
          deviceRESTful.deleteDevice(params).then(res=>{
            resolve(res);
          })
        })
      },
      deleteNVR(nvrList){
        let params={
          ivsIds:nvrList
        }
        return new Promise((resolve,reject)=>{
          deviceRESTful.deleteNVR(params).then(res=>{
            resolve(res);
          })
        })
      },
      addNVR(params){
        return new Promise((resolve,reject)=>{
          deviceRESTful.addNVR(params).then(res=>{
            resolve(res);
          })
        })
      },
      addDevice(params){
        return new Promise((resolve,reject)=>{
          deviceRESTful.addDevice(params).then(resDevice=>{
            resolve(resDevice);
          })
        })
      },
      getAllNVRData(){
        let self=this;
        let params={
          "filter": {
            "page": 0,
            "size": 1000
          }
        };
        return new Promise((resolve,reject)=>{
          deviceRESTful.getNVRList(params).then(res=>{
            let errMsg=res.errMsg;
            let data=[];
            if(errMsg!=undefined&&errMsg=='Success'){
              data=res.data.content;
            }
            resolve(data);
          })
        })
      },
      async addAllData(paramsNVR,paramsDevice){
        let self=this;
        let data=await self.getAllNVRData();
        self.channelData=await self.getChannelData();
        console.log(data);
        let nvrList=[];
        let channelList=self.channelData.map(x=>x.id);
        data.forEach(item=>{
          nvrList.push(item.ivsId);
        })
        if(channelList.length==0&&nvrList.length==0){
          console.log('当前页面为空！');
        }
        else if(channelList.length==0&&nvrList.length!=0){
          await self.deleteNVR(nvrList);
        }
        else if(channelList.length!=0&&nvrList.length==0){
          await self.deleteChannel(channelList);
        }
        else{
          await self.deleteChannel(channelList);
          await self.deleteNVR(nvrList);
        }
        let res1= await self.addNVR(paramsNVR);
        let res2= await self.addDevice(paramsDevice);
        if(res1.errMsg=='Success'&&res2.errMsg=='Success'){
          self.notify(self.$t('deviceView.importSuss'),'success',3000);
          self.showImportContent=false;
        }
        else{
          self.notify(self.$t('deviceView.importFail'),'warning',3000);
          self.showImportContent=false;
        }
        self.page=1;
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": "asc",
            "property": "name"
          }
        };
        self.getNVRList(params);
      },
      downItem(){
      },
      importData(){
        let self=this;
      },
      importfxx(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = async function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for(var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require('xlsx');
            if(rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                type: 'base64'
              });
            } else {
              wb = XLSX.read(binary, {
                type: 'binary'
              });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
            if(!outdata[0].hasOwnProperty('StoreID')){
              _this.notify(this.$t('deviceView.templateError'),'warning',3000);
              return false;
            }
            let arr=outdata;
            let nvrDataTemp=[];
            let channelDataTemp=[];
            arr.forEach((item,index)=>{
              if(nvrDataTemp.map(x=>x.ivsId).indexOf(item["IVS ID"])==-1){
                let obj={
                  ivsId:item["IVS ID"],
                  name:item["NVR名称"],
                  channelCount:item["通道数"],
                  storeId:item["StoreID"]
                }
                nvrDataTemp.push(obj);
              }
              let obj={
                name:item["通道名称"],
                storeId:item["StoreID"],
                ivsId:item["IVS ID"],
                channelId:item["通道序号"]
              }
              channelDataTemp.push(obj);
            })

            let params1={
              "nvr": nvrDataTemp
            };
            let params2={
              "device": channelDataTemp
            };
            _this.addAllData(params1,params2);
          }
          reader.readAsArrayBuffer(f);
        }
        if(rABS){
          reader.readAsArrayBuffer(f);
        }
        else{
          reader.readAsBinaryString(f);
        }
      },
      export2Excel() {
        var that = this;
        require.ensure([], async() => {
          const { export_json_to_excel } = require('@/excel/Export2Excel');
          const tHeader = ['StoreID','所属门店', 'IVS ID','NVR名称','通道数','通道名称','通道序号']; // 导出的表头名
          const filterVal = ['storeId','storeName','ivsId','nvrName','channelCount','channelName','channelNum']; // 导出的表头字段名
          console.log(that.activeName);
          let nvrData=await that.getAllNVRData();
          let channelData=that.channelData;
          let excelData=[];
          if(nvrData.length!=0&&channelData.length!=0){
            nvrData.forEach((item,index)=>{
              channelData.forEach((_item,_index)=>{
                if(item.ivsId==_item.ivsId){
                  let obj={};
                  obj.storeId=item.storeId;
                  obj.storeName=item.storeName;
                  obj.ivsId=item.ivsId;
                  obj.nvrName=item.name;
                  obj.channelCount=item.channelCount;
                  obj.channelName=_item.name;
                  obj.channelNum=_item.channelId;
                  excelData.push(obj);
                }

              })
            })
          }

          const list = excelData;
          const data = that.formatJson(filterVal, list);

          //export_json_to_excel(tHeader, data, `看门店-设备管理导入示例`);// 导出的表格名称，根据需要自己命名
          export_json_to_excel(tHeader, data, this.$t('deviceView.importExample'));// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      handleNVR(index,item){
        let self=this;
        console.log(item);
        switch(index){
          case 0: self.importItem();break;
          case 1: self.exportItem();break;
          case 2: self.downItem();break;
        }
      },
      handleEdit(index,item){
        let self=this;
        item.isClick=true;
        self.curChannelItem=item;
        self.channelList.forEach((_item,_index)=>{
          if(index!=_index){
            _item.isClick=false;
          }
        })
      },
      cancelEdit(index,item){
        let self = this;
        self.isUpdate = false;
        item.isClick=false;
        item.tempUrl = item.pictureUrl;
        item.tempName = item.name;
        self.file = '';
        if(item.id == 0){
          //删除最后一个通道
          console.log(self.channelList)
          self.channelList.splice(index, 1);
        }
      },
      confrimEdit(index,item){
        let self=this;
        let obj={};
        if(item.id != 0){
          self.isUpdate = false;
          obj.id=self.curChannelItem.id;
          obj.name=self.curChannelItem.tempName;
          if(obj.name.trim().length == 0){
            self.notify(self.$t('deviceView.channelNameEmpty'),'warning',3000);
            return false;
          }
          let params=obj;
          let attachRes = {};
          deviceRESTful.updateDevice(params).then( async res=>{
            console.log(res.data);
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              if(item.tempUrl != item.pictureUrl){
                //获得增加通道的id,增加图片
                let fm = new FormData();
                fm.append('id', self.curChannelItem.id);
                fm.append('picture', self.file);
                attachRes = await self.attachImageToDevice(fm);
                console.log('调用完编辑图片')
                console.log(attachRes)
              }
              else{
                // do nothing
              }
              if(attachRes.errMsg == 'Success'){
                self.notify(self.$t('deviceView.editSuss'),'success',3000);
              }
              self.curChannelItem.isClick=false;
              self.file = '';
            }
            else{
              self.notify(self.$t('deviceView.editFail'),'warning',3000);
            }
          })
            .then(async()=>{
              self.channelData=await self.getChannelData();  //修改后更新数据源
              self.getChannelListByNVR(self.curNVRItem.ivsId);
            })
        }
        else{
          //新增通道
          console.log(item);
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
          deviceRESTful.addDevice(params).then(res=>{
            console.log(res.data);
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              self.notify(self.$t('deviceView.addSuccess'),'success',3000);
              self.curChannelItem.isClick=false;
            }
            else{
              self.notify(self.$t('deviceView.addFailed'),'warning',3000);
            }
          })
            .then(async()=>{
              self.channelData=await self.getChannelData();  //修改后更新数据源
              self.getChannelListByNVR(self.curNVRItem.ivsId);
            })
        }
      },
      getNVRList(params){
        let self=this;
        deviceRESTful.getNVRList(params).then(res=>{
          let errMsg=res.errMsg;
          let temp=[];
          if(errMsg!=undefined&&errMsg=='Success'){
            let data=res.data.content;
            data.forEach((item,index)=>{
              let obj={};
              obj.ivsId=item.ivsId;
              obj.name=item.name;
              obj.tempDeviceName = item.name;
              obj.store=item.storeName;
              obj.storeId=item.storeId;
              obj.channelCount = item.channelCount;
              obj.tempChannelCount = item.channelCount;
              obj.channelNum=item.channelCount + self.$t('deviceView.unit');
              obj.isEditing = false;
              if(index==0){
                obj.isClick=true;
              }
              else{
                obj.isClick=false;
              }
              temp.push(obj);
            })
            self.nvrData=temp;
            self.total=res.data.totalElements;
          }
        })
          .then(async()=>{
            if(self.nvrData.length!=0){
              console.log(self.nvrData[0].ivsId);
              self.curNVRItem=self.nvrData[0];
              self.channelData=await self.getChannelData();
              console.log(self.channelData)
              self.getChannelListByNVR(self.nvrData[0].ivsId);
            }
            else{
              self.channelData=[];
              self.channelList=[];
            }
          })
      },
      searchNVRList(){

      },
      getChannelData(){
        let self=this;
        return new Promise((resolve,reject)=>{
          deviceRESTful.getDeviceList().then(res=>{
            let errMsg=res.errMsg;
            console.log(res);
            if(errMsg!=undefined&&errMsg=='Success'){
              let data=res.data;
              resolve(res.data);
            }
          })
        })
      },
      getChannelListByNVR(ivsId){
        let self=this;
        let temp=[];
        self.channelData.forEach(item=>{
          if(item.ivsId==ivsId){
            let obj={};
            obj.id=item.id;
            obj.name=item.name;
            obj.tempName=item.name;
            obj.channelId=item.channelId;
            obj.pictureUrl = item.thumbnailUrl; //文件路径
            obj.tempUrl = item.thumbnailUrl; //是否编辑的url，编辑后修改此URL
            obj.isClick=false;
            temp.push(obj);
          }
        })
        self.channelList=temp;
        console.log(self.channelList);
        if(self.channelList.length == self.curNVRItem.channelCount){
          self.channelBtnDisabled = true;
        }
        else {
          self.channelBtnDisabled = false;
        }
        //对channelList按照通道号排序，取出最大通道
        if(self.channelList == 0){
          self.editNvrChannelNumList = self.channelNumList;
        }
        else{
          console.log(self.channelList);
          let  sortArr = self.channelList.sort(self.getSortFun('channelId'));
          let lastChannel = sortArr[sortArr.length -1];
          let maxChannleId = lastChannel.channelId;
          console.log(maxChannleId);
          let spliceArray =  self.channelNumList.filter(x=> x.value >= maxChannleId);
          self.editNvrChannelNumList = spliceArray;
        }

      },
      async InitData(){
        let self=this;
        if(self.varyWindowHeight>=760){
          self.sizeNum=20;
        }
        else {
          self.sizeChange=10;
        }
        self.$store.dispatch('GetDash').then((res)=>{
          let data=res.data;
          if(res.errMsg=='Success'&&res.errCode==0){
            self.dash=data;
          }
        })
        //self.channelData=await self.getChannelData();   //获取channel信息
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": "asc",
            "property": "name"
          }
        };
        self.getNVRList(params);       //获取NVR 数据信息
      },
      async getAllStoreList(){
        let self=this;
        let params={
          "filter":{
            "page":0,
            "size":2000
          }
        };
        let retData=await self.getStoreData(params);
        let storeList=retData.data.content;
        self.storeList=storeList;
        let tempStore=[];
        storeList.forEach(item=>{
          let obj={
            storeId:item.storeId,
            label:item.name,
            value:item.name,
            userId:item.userId,
            userName:item.userName
          }
          tempStore.push(obj);
        })
        self.storeDataList = tempStore;
      },
      getBriefStoreData(){
          let self=this;
          getBriefStoreList().then(res=>{
              let errMsg=res.errMsg;
              if(errMsg!=undefined&&errMsg=='Success'){
                  let storeList=res.data;
                  self.storeList=storeList;
                  let tempStore=[];
                  storeList.forEach(item=>{
                    let obj={
                      storeId:item.storeId,
                      label:item.name,
                      value:item.name,
                      userId:item.userId
                    }
                    tempStore.push(obj);
                  })
                  self.storeDataList = tempStore;
              }
          })
      },
      getStoreData(params){
        let self=this;
        return new Promise((resolve,reject)=>{
          getStoreList(params).then(res=>{
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              let data=res.data;
              resolve(res);
            }
          }).catch(res => {
            resolve(res);
          })
        })
      },
      //增加单个NVR
      addSingleNvr(){
        let self = this;
        self.$refs['nvrForm'].validate(async (valid) => {
          if (valid) {
            console.log(self.addNvrData);
            let nvrParams = {};
            let nvrArray = [];
            nvrArray.push(self.addNvrData);
            nvrParams.nvr = nvrArray;
            let res1= await self.addNVR(nvrParams);

            if(res1.errMsg=='Success'){
              self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
              self.showAddNvrDialog=false;
            }
            else{
              self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
              self.showAddNvrDialog=false;
            }
            self.addNvrData = {ivsId:'',  name:'', channelCount: 1, storeId: self.storeDataList[0].storeId};
            self.page=1;
            let params={
              "filter": {
                "page": self.page-1,
                "size": self.sizeNum
              },
              "order": {
                "direction": "asc",
                "property": "name"
              }
            };
            self.getNVRList(params);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消增加单个NVR
      cancelAddNvr(){
        let self = this;
        self.showAddNvrDialog=false;
      },
      //增加单个通道
      addSingleChannel(){
        let self = this;
        self.$refs['channelForm'].validate(async (valid) => {
          if (valid) {
            console.log(self.addChannelData);
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
            if(res1.errMsg=='Success'){
              //获得增加通道的id,增加图片
              let fm = new FormData();
              let channelId = res1.data[0];
              console.log(channelId);
              fm.append('id', channelId);
              fm.append('picture', self.file);
              let attachRes = await self.attachImageToDevice(fm);
              console.log(attachRes)
              if(attachRes.errMsg == 'Success'){
                self.notify(self.$t('deviceView.addSuccess'),'success',3000);
              }
              self.showAddChannelDialog =false;
            }
            else{
              self.notify(self.$t('deviceView.addFailed'),'warning',3000);
              self.showAddChannelDialog=false;
            }
            self.addChannelData = {name: '', channelId: '', pictureUrl: '', file: ''};
            self.page=1;
            let params={
              "filter": {
                "page": self.page-1,
                "size": self.sizeNum
              },
              "order": {
                "direction": "asc",
                "property": "name"
              }
            };
            self.channelData=await self.getChannelData();  //修改后更新数据源
            self.getChannelListByNVR(self.curNVRItem.ivsId);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消增加单个NVR
      cancelAddSingleChannel(){
        let self = this;
        self.showAddChannelDialog = false;
        self.addChannelData = {name: '', channelId: '', pictureUrl: '', file: ''};
      },
      //为通道绑定图片
      attachImageToDevice(params){
        return new Promise((resolve,reject)=>{
          deviceRESTful.attachImageToDevice(params).then(resDevice=>{
            resolve(resDevice);
          })
        })
      },
      handleDelete(index, item){
        let self = this;
        console.log(index);
        self.showDeleteChannel=true;
        self.deleteChannelId = item.id;
      },
      //删除单个设备
      deleteSingleChannel(){
        let self=this;
        self.showDeleteChannel = false;
        let idsArr = [];
        idsArr.push(self.deleteChannelId);
        let obj={};
        obj.deviceIds = idsArr;
        let params = obj;
        deviceRESTful.deleteDevice(params).then(res=>{
          console.log(res.data);
          let errMsg=res.errMsg;
          if(errMsg!=undefined&&errMsg=='Success'){
            self.notify(self.$t('deviceView.deleteSuccess'),'success',3000);
          }
          else{
            self.notify(self.$t('deviceView.deleteFail'),'warning',3000);
          }
        })
          .then(async()=>{
            self.channelData=await self.getChannelData();  //修改后更新数据源
            self.getChannelListByNVR(self.curNVRItem.ivsId);
          })
      },
      editSingleNvr(index, item){
        let self=this;
        item.isEditing = true;
        self.nvrData.forEach((_item,_index)=>{
          if(index!=_index){
            _item.isEditing=false;
          }
        })
      },
      showAddDialog(){
        let self = this;
        self.showAddNvrDialog = true;
        self.addNvrData = {ivsId:'',  name:'', channelCount: 1, storeId: self.storeDataList[0].storeId};
      },
      confirmEditNvr(index,item){
        let self=this;
        console.log(item);
        item.name = item.tempDeviceName;
        let obj={};
        obj.ivsId = item.ivsId;
        obj.name  = item.tempDeviceName;
        obj.storeId = item.storeId;
        obj.channelCount = item.tempChannelCount;
        if(obj.name.trim().length==0){
          self.notify(self.$t('deviceView.nvrNameEmpty'),'warning',3000);
          return false;
        }
        let arr = [];
        arr.push(obj);
        let params = {};
        params.nvr = arr;
        console.log(params);
        deviceRESTful.updateNVR(params).then(res=>{
          console.log(res.data);
          let errMsg=res.errMsg;
          if(errMsg!=undefined&&errMsg=='Success'){
            self.notify(self.$t('deviceView.editSuss'),'success',3000);
            item.isEditing = false;
          }
          else{
            self.notify(self.$t('deviceView.editFail'),'warning',3000);
            item.isEditing = false;
          }
        })
          .then(async()=>{
            self.channelData=await self.getChannelData();  //修改后更新数据源
            self.getChannelListByNVR(self.curNVRItem.ivsId);
          })
      },
      cancelEditNvr(index,item){
        let self = this;
        item.isEditing = false;
        item.tempDeviceName = item.name;
        item.tempChannelCount = item.channelCount;
      },
      //删除单个NVR
      async deleteSingleNVR(){
        let self = this;
        self.showConfirmDelete = false;
        let ivsId = self.curNVRItem.ivsId;
        let nvrList=[];
        nvrList.push(ivsId);
        console.log(nvrList);
        let channelList=self.channelList.map(x=>x.id);
        console.log(channelList);
        //先删除通道，后删除NVR
        if(channelList.length > 0 ){
          let res1 = await self.deleteChannel(channelList);
          let res2 = await self.deleteNVR(nvrList);
          if(res1.errMsg=='Success'&&res2.errMsg=='Success'){
            self.notify(self.$t('deviceView.deleteSuccess'),'success',3000);
          }
          else{
            self.notify(self.$t('deviceView.deleteFail'),'warning',3000);
          }
        }else{
          let res2 = await self.deleteNVR(nvrList);
          if(res2.errMsg=='Success'){
            self.notify(self.$t('deviceView.deleteSuccess'),'success',3000);
          }
          else{
            self.notify(self.$t('deviceView.deleteFail'),'warning',3000);
          }
        }
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": "asc",
            "property": "name"
          }
        };
        self.getNVRList(params);
      },
      //新增通道
      addNewChannel(){
        let self = this;
        let channelNum = self.curNVRItem.channelCount;
        console.log(channelNum);
        self.channelNumList.forEach(item=>{
          item.disabled = false;
        })
        let spliceArray =  self.channelNumList.filter(x=> x.value<=channelNum);
        console.log(self.channelList);
        spliceArray.forEach(item=>{
          self.channelList.forEach(_item=>{
            if(item.value == _item.channelId){
              item.disabled = true;
            }
          })
        })
        let deepArray = JSON.parse(JSON.stringify(spliceArray))
        deepArray.forEach(item=>{
          item.label = item.label.split(' ')[0]
        })
        console.log(deepArray);
        self.newChannelNumList = deepArray;

        self.showAddChannelDialog = true; //显示增加通道对话框
        self.addChannelData = {name: '', channelId: '', pictureUrl: '', file: ''};
      },
      // json数组，按照指定的key排序
      getSortFun(sortBy) {
        var ordAlpah =  '>' ;
        var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
        return sortFun;
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },
      ...mapMutations( [ 'SET_DASHURL'] ),
      nvrNameChange(val, item){
        let self = this;
        let comment = filterString.all(val,20);
        console.log(comment);
        if(0 == Object.keys(item).length){
          self.addNvrData.name = comment;
        }
        else{
          item.tempDeviceName = comment;
        }
        let length = filterString.getContentLength(val);
        if(length>20){
              this.NvrnameRuletip=true
          }else{
              this.NvrnameRuletip=false
          }
      },
      channelNameChange(val,item){
        let self = this;
        let comment = filterString.all(val,20);
        console.log(comment);
        if(0 == Object.keys(item).length){
          self.addChannelData.name = comment;
        }
        else{
          item.tempName = comment;
        }
        let length = filterString.getContentLength(val);
        if(length>20){
              this.channelNameRuletip=true
          }else{
              this.channelNameRuletip=false
          }
      },
      ivsIdChange(val){
        let self = this;
        let comment = filterString.all(val,30);
        console.log(comment);
        self.addNvrData.ivsId = comment;
        let length = filterString.getContentLength(val);
        if(length>30){
              this.ivsIdRuletip=true
          }else{
              this.ivsIdRuletip=false
          }
      },
      notShowInputRuleTips(e){
        if(e=='ivsId'){
          this.ivsIdRuletip=false
        }else if(e=='tempName'){
          this.channelNameRuletip=false
        }else if(e=='Nvrname'){
          this.NvrnameRuletip=false
        }
      }
    },
    created(){
      // this.varWindowWidth=window.innerWidth;
      // console.log(this.varWindowWidth);
    },
    mounted(){
      let self=this;
      self.InitData();
      self.getBriefStoreData();
    },
  }
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
                // float: left;
                // position: relative;
                background-color: $mainColor;
                padding: 1px 6px;
                color: #fff;
                border-width: 1px 1px 1px 1px;
                border-style: solid;
                border-color: #ddd;
                width:20px;
                height:23px;
              }
              .iconrised{
                // float: left;
                // position: relative;
                padding: 1px 6px;
                border-width: 1px 1px 1px 0px;
                border-style: solid;
                border-color: #ddd;
                background-color: rgba(255, 255, 255, 0);
                width:20px;
                height:23px;
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
