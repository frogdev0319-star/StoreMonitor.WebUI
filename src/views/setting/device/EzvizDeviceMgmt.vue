<template>
  <el-row class="el-device" :style="{'height':varyWindowHeight-170+'px'}">
    <el-col :span="24" class="el-btns">
      <div style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;" v-if="activeName=='device'">
        <el-input
          v-if="false"
          size="small"
          class="el-search-input"
          v-model="serachVale" @keyup.enter.native="searchNVRList" :placeholder="generateDeviceLang('searchInfo')">
          <i @click="searchNVRList"  slot="prefix" class="iconfont icon-sousuo" style="position:relative;top:7px;left:6px;"></i>
        </el-input>
        <el-button v-for="(item,index) in btnList"
                   :key="index" size="mini" @click="handleNVR(index,item)" :class="lang=='en'? 'en-el-handle-btn': 'el-handle-btn'" :disabled="index==2">
          <i :class="item.iconClass" style="font-size:24px;"></i>
          <span>{{item.btnTitle}}</span>
        </el-button>
      </div>
      <div style="display: inline-block;position:absolute;z-index: 979;right: 30px;top: 23px;float: right;" v-else>
        <el-button
          :class=" lang=='en' ? 'en-el-delete-btn':'el-delete-btn'"
          @click="callChildAdd"
          size="mini"
          type="primary"
          class="btn-class"
        >
          <i style="margin-right:8px;" class="iconfont el-icon-plus"></i>
          <span>{{$t('deviceView.addEzvizAccount')}}</span>
        </el-button>
      </div>
      <el-col :span="varWindowWidth<1540?12:10" class="dash-content" :style="varWindowWidth<1366?{'font-size':'12px'}:{'font-size':'14px'}">
        <el-dialog :title="generateDeviceLang('import')"
                   id="importId"
                   :visible.sync="showImportContent" v-if="showImportContent"
                   :close-on-click-modal="false"
                   :append-to-body='true'
                   width="28%"
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
                    width="28%"
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
    </el-col>
    <el-col :span="24" class="el-tabPanels">
      <el-tabs v-model="activeName" id="en-devicetabs-content" @tab-click="handleClick">
        <el-tab-pane :label="generateDeviceLang('ezvizAccountSetting')" name="ezvizAccount">
          <ezviz-account ref="ezvizAccount"></ezviz-account>
        </el-tab-pane>
        <el-tab-pane :label="generateDeviceLang('deviceManage')" name="device">
          <el-col :span="lang=='en' && varWindowWidth<1920? 11: 11" class="lisde">
            <div class="nvr-info">
              <span class="info-title">{{generateDeviceLang('deviceInfo')}}</span>
              <el-button type="primary" size="mini" class="add-btn btn-class"
                         @click="showAddDialog">
                <i style="margin-right:8px;" class="iconfont el-icon-plus"></i><span>{{generateDeviceLang('addDevice')}}</span>
              </el-button>
            </div>
            <div class="nvr-title tabTitle">
              <div :class="lang=='en' ? 'en-comment-title titles': 'comment-title titles'">
                <span></span>
              </div>
              <div :class="lang=='en' ? 'en-name-title titles': 'name-title titles'">
                <span>{{generateDeviceLang('deviceName')}}</span>
                <i class="icon-filter"
                   :class="{'el-icon-arrow-up':nvrFilter,'el-icon-arrow-down':!nvrFilter}" @click="filterNVR"></i>
              </div>
              <div :class="lang=='en' ? 'en-model-title titles': 'model-title titles'">
                <!--<span>{{generateDeviceLang('deviceModel')}}</span>-->
                <!--<i class="icon-filter"-->
                   <!--:class="{'el-icon-arrow-up':modelFilter,'el-icon-arrow-down':!modelFilter}" @click="filterModel"></i>-->
                <span>{{generateDeviceLang('EzvizAccount')}}</span>
                <i class="icon-filter"
                   :class="{'el-icon-arrow-up':modelFilter,'el-icon-arrow-down':!modelFilter}" @click="filterAccount"></i>
              </div>
              <div :class="lang=='en' ? 'en-store-title titles': 'store-title titles'" >
                <span>{{generateDeviceLang('store')}}</span>
                <i class="icon-filter"
                   :class="{'el-icon-arrow-up':storeFilter,'el-icon-arrow-down':!storeFilter}" @click="filterStore"></i>
              </div>
              <div :class="lang=='en' ? 'en-count-title titles': 'count-title titles'" >
                <span>{{generateDeviceLang('channelNum')}}</span>
                <!--<i class="icon-filter"-->
                <!--:class="{'el-icon-arrow-up':storeFilter,'el-icon-arrow-down':!storeFilter}" @click="filterChannelNum"></i>-->
              </div>
              <!--<div :class="lang=='en' ? 'en-operation-title titles': 'operation-title titles'" >-->
              <!--<span>{{generateDeviceLang('operation')}}</span>-->
              <!--</div>-->
            </div>
            <el-scrollbar style="height:100%;" id="el-menuscrollbar">
              <div  :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
                <div class="nvr-data group-title"
                     v-for="(item,index) in nvrData"
                     :key="index"  :class="`${!item.isClick?'noraml-color':'active-color'}  ${item.comment.length > 0 ? 'tooltip-color' : ''}`" @click="clickNVR(index,item)" >
                  <div class="proper-flag" v-if="item.isClick"></div>
                  <div class="comment-data titles" :style="{visibility: (item.comment!= '') ? 'visible': 'hidden' }">
                    <el-tooltip effect="dark" :content="item.comment"
                                placement="bottom" :popper-class="elTooltipClass">
                      <div slot="content">{{generateDeviceLang('failedReason')}}<br/>{{item.comment}}</div>
                      <span style="margin-left: 10%; color: #fea316;"><i class="iconfont icon-jinggao2"></i></span>
                    </el-tooltip>
                  </div>
                  <div class="name-data titles">
                    <el-tooltip class="item" effect="dark" :content="item.tempNvrName"
                                placement="bottom" :popper-class="elTooltipClass">
                      <span>{{item.tempNvrName.length>15?item.tempNvrName.substr(0,15)+'...':item.tempNvrName}}</span>
                    </el-tooltip>
                    <!--<el-input size="mini" maxlength='15' v-model="item.tempNvrName" class="nvr-input" :placeholder="generateDeviceLang('inputDeviceName')" v-if="item.isEditing"></el-input>-->
                  </div>
                  <div class="model-data titles">
                      <span>{{item.ezvizAccount}}</span>
                  </div>
                  <div class="store-data titles">
                    <el-tooltip class="item" effect="dark" :content="item.store" :popper-class="elTooltipClass"
                                placement="bottom">
                    <span>{{item.store.length>7?item.store.substr(0,7)+'...':item.store}}</span>
                    </el-tooltip>
                    <!--<span>{{item.store}}</span>-->
                  </div>
                  <div class="count-data titles">
                    <span>{{item.tempChannelCount}}{{$t('deviceView.unit')}}</span>
                    <!--<span v-if="!item.isEditing">{{item.tempChannelCount}}{{$t('deviceView.unit')}}</span>-->
                    <!--<el-select v-model="item.tempChannelCount" :placeholder="generateDeviceLang('selectChannelNum')" size="mini" class="nvr-select" v-if="item.isEditing">-->
                      <!--<el-option-->
                        <!--v-for="numList in editNvrChannelNumList"-->
                        <!--:key="numList.value"-->
                        <!--:label="numList.label"-->
                        <!--:value="numList.value"-->
                        <!--:disabled="numList.disabled"-->
                      <!--&gt;-->
                      <!--</el-option>-->
                    <!--</el-select>-->
                  </div>
                  <div class="operation-data titles">
                    <!--<div class="iconcontent" v-if="item.isEditing">-->
                      <!--<div class="iconlised"  @click.stop="confirmEditNvr(index,item)">-->
                        <!--<i class="el-icon-check"></i>-->
                      <!--</div>-->
                      <!--<div class="iconrised" @click.stop="cancelEditNvr(index,item)">-->
                        <!--<i class="el-icon-close"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="iconcontent" v-if="!item.isEditing && !item.ifCanAdd">-->
                      <!--<div class="iconlised"  @click.stop="editSingleNvr(index,item)" style=" border: none; background-color: #fff; color:#2c3e50;font-weight: normal;" :style="{visibility: (item.ifCanEdit == true) ? 'visible': 'hidden' }">-->
                        <!--<i class="iconfont icon-bianji"></i>-->
                      <!--</div>-->
                      <!--<div class="iconrised" @click.stop="showConfirmDelete=true" style="border: none; color:#2c3e50; font-weight: normal;">-->
                        <!--<i class="iconfont icon-shanchu"></i>-->
                      <!--</div>-->
                    <!--</div>-->
                    <div class="iconcontent" v-if="!item.ifCanAdd">
                      <!--<div class="" style="float:left;">-->
                        <!--<el-button @click.stop="addAgain(index, item)" class="add-btn" size="mini" style=" border: none; background-color: #f31d65; color:#fff; width: 65px; ">-->
                          <!--<span style="position: relative;left: -10px;">{{generateDeviceLang('addAgain')}}</span>-->
                        <!--</el-button>-->
                      <!--</div>-->
                      <div class="iconlised"  @click.stop="editSingleNvr(index,item)" style=" border: none; color:#2c3e50;font-weight: normal;background-color: #fff">
                           <!--:style="{visibility: (item.ifCanEdit == true) ? 'visible': 'hidden' }"-->
                        <i class="iconfont icon-bianji"></i>
                      </div>
                      <div class="iconrised" @click="showConfirmDelete=true" style="border: none; color:#2c3e50; font-weight: normal;">
                        <i class="iconfont icon-shanchu"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <el-dialog  :title="generateDeviceLang('prompt')"
                            :visible.sync="showConfirmDelete" v-if="showConfirmDelete"
                            :append-to-body='true'
                            :close-on-click-modal="false"
                            width="28%"
                            top="35vh"
                            left="40vh">
                  <div class="dialog-content" style="overflow:hidden;width:100%;">
                    <hr style="border: 0.5px solid #dfe2e9;"/>

                    <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                      <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle"></i>
                      <span style="display: inline-block; vertical-align: middle">{{generateDeviceLang('deleteInfo')}}</span>
                      <!--<el-checkbox v-model="deleteFromEzviz">是否从萤石云平台删除？</el-checkbox>-->
                    </p>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button class="file-cancel-btn" @click="showConfirmDelete = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
                    <el-button class="file-confirm-btn" @click="deleteSingleNVR()" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
                  </div>
                </el-dialog>
              </div>
            </el-scrollbar>
            <div class="toolbar pagination" style="width:100%; margin-top:10px; margin-bottom:10px;">
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
          <el-dialog :title="isAddAgain? generateDeviceLang('updateDevice') : generateDeviceLang('addDevice')"
                     :visible.sync="showAddNvrDialog" v-if="showAddNvrDialog"
                     :append-to-body='true'
                     :close-on-click-modal="false"
                     width="28%"
                     top="35vh"
                     left="40vh" customClass="addNvr"
          >
            <div class="dialog-content" style="overflow:hidden;width:100%;">
              <hr style="border: 0.5px solid #dfe2e9;"/>
              <el-form :model="addDeviceData" :rules="rules" ref="nvrForm" class="nvrForm" label-position="top" size="mini">
                <el-form-item style="height: 57px;">
                  <el-col :span="13">
                    <el-form-item prop="serialNumber" :label="generateDeviceLang('serialNum')">
                      <el-input v-model="addDeviceData.serialNumber" style="width: 100%;" :disabled="isAddAgain"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" :offset="2">
                    <el-form-item prop="validationCode" :label="generateDeviceLang('validationCode')">
                      <el-input  v-model="addDeviceData.validationCode" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="height: 57px;">
                  <el-col :span="13">
                    <el-form-item prop="name" :label="generateDeviceLang('deviceName')">
                      <el-input  v-model="addDeviceData.name" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" :offset="2">
                    <el-form-item prop="channelCount" :label="generateDeviceLang('deviceChannelNum')">
                      <el-select v-model="addDeviceData.channelCount"  size="mini" v-if="isAddAgain">
                        <el-option
                          v-for="numList in editNvrChannelNumList"
                          :key="numList.value"
                          :label="numList.label"
                          :value="numList.value"
                          :disabled="numList.disabled"
                        >
                        </el-option>channelNumList
                      </el-select>
                      <el-select v-model="addDeviceData.channelCount"  size="mini"  v-else>
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
                <el-form-item :label="generateDeviceLang('EzvizAccount')" prop="ezvizAccount">
                  <el-select v-model="addDeviceData.ezvizAccount" style="width: 100%;">
                    <el-option
                      v-for="item in ezvizAccountList"
                      :key="item.id"
                      :label="item.accountName"
                      :value="item.ezvizAccount">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="generateDeviceLang('store')" prop="storeId">
                  <el-select v-model="addDeviceData.storeId" style="width: 100%;" :disabled="isAddAgain">
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
              <el-button class="file-cancel-btn" @click="showAddNvrDialog = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
              <el-button class="file-confirm-btn" @click="addSingleNvr" size="mini" type="primary">{{generateDeviceLang('confirm')}}</el-button>
            </div>
          </el-dialog>
          <el-col :span="lang=='en' && varWindowWidth<1920? 13: 13" class="risde">
            <div class="nvr-info">
              <span class="info-title">{{generateDeviceLang('channelSetting')}}</span>
              <el-button type="primary" size="mini" class="add-btn btn-class"
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
                <span>{{generateDeviceLang('devChannelNum')}}</span>
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
                    <el-input size="mini" maxlength='15' v-model="item.tempName" class="nape-input input-details" :placeholder="generateDeviceLang('inputInspectName')" v-if="item.isClick"></el-input>
                  </div>
                  <div class="nape-dep-data">
                    <span class="nape-dep" v-if="item.id != 0 ">{{item.channelId}}</span>
                    <el-select v-model="item.channelId" :placeholder="generateDeviceLang('selectDeviceChannel')" size="mini" class="nvr-select" v-if="item.id == 0" style="margin-left: 10%">
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
                       <img v-if="isUpdate"  :src="item.tempUrl"  class="img-class">
                        <img v-else :src="`${item.tempUrl +'?'+Math.random()}`"  class="img-class">
                    </span>
                    <span v-else="!item.tempUrl" class="img-class" style="display: inline-block;background: #cccc;">
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
                      <i class="iconfont icon-bianji" style="cursor:pointer;margin-right:10px;"
                         @click="handleEdit(index,item)"></i>
                      <i class="iconfont icon-shanchu" style="cursor:pointer;margin-right:10px;"
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
                        width="28%"
                        top="35vh"
                        left="40vh">
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;"/>

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
                       width="28%"
                       top="35vh"
                       left="40vh" customClass="addNvr"
            >
              <div class="dialog-content" style="overflow:hidden;width:100%;">
                <hr style="border: 0.5px solid #dfe2e9;"/>
                <el-form :model="addChannelData" :rules="channelRules" ref="channelForm" class="nvrForm" label-position="top" size="mini">
                  <el-form-item style="height: 57px;">
                    <el-col :span="12">
                      <el-form-item prop="name" :label="generateDeviceLang('channelName')">
                        <el-input  v-model="addChannelData.name" style="width: 100%;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                      <el-form-item  prop="channelId" :label="generateDeviceLang('devChannelNum')">
                        <el-select v-model="addChannelData.channelId"  size="mini">
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
                    <el-col :span="6">
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
                          <el-button  size="mini" type="primary" style=" margin-bottom: 20px;position: relative;margin-right: 45px;">
                            <i style="margin-right:10px;font-size:16px;" class="iconfont el-icon-plus"></i><span>{{generateDeviceLang('selectPicture')}}</span>
                          </el-button>
                          <img :src="addChannelData.pictureUrl" class="avatar" style="border: 1px dashed #d9d9d9;">
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="varWindowWidth<1440? 14: 16" :offset="varWindowWidth<1440? 3: 1">
                      <span class="picture-tips">*{{generateDeviceLang('thumbnailInfo')}}</span>
                    </el-col>
                  </el-from-item>

                </el-form>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" @click="showAddChannelDialog = false" size="mini" style="">{{generateDeviceLang('cancle')}}</el-button>
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
  import {deviceRESTful,ezvizRESTful} from '@/api/index'
  import {isLoginIn} from '@/api/login'
  import { mapMutations,mapGetters} from 'vuex'
  import {generateDeviceLang} from '@/api/i18n'
  import {getStoreList} from '@/api/store'
  import EzvizAccount from "./EzvizAccount";

  export default {
    name:'NvrDeviceMgmt',
    components: {EzvizAccount},
    data(){
      return{
        dash:{},
        activeName:'ezvizAccount',
        total:0,
        page:1,
        sizeNum:10,
        nvrData:[],
        //the filter flag
        nvrFilter:true,
        modelFilter: true,
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
        addDeviceData: {name: '', validationCode: '', storeId: '',serialNumber: '', channelCount: 1, ezvizAccount: ''},
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
            label: '9'+ this.$t('deviceView.unit')
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
            label: '14'+ this.$t('deviceView.unit')
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
          serialNumber: [
            { required: true, message: this.$t('deviceView.inputSerialNum'), trigger: 'blur' },
          ],
          name: [
            { required: true, message: this.$t('deviceView.inputDeviceName'), trigger: 'blur' }
          ],
          channelCount: [
            {required: true, message: this.$t('deviceView.selectChannelNum'), trigger: 'change' }
          ],
          ezvizAccount: [
            {required: true, message: this.$t('deviceView.selectEzvizAccount'), trigger: 'change' }
          ],
          storeId: [
            {required: true, message: this.$t('deviceView.selectStore'), trigger: 'change' }
          ]
        },
        showDeleteChannel: false,
        deleteFromEzviz: false, //是否从萤石云平台删除
        isAddAgain: false,
        addChannelData: {name: '', channelId: '', pictureUrl: '', file: ''},
        channelRules: {
          name: [
            { required: true, message: this.$t('deviceView.inputChannelName'), trigger: 'blur' }
          ],
          channelId: [
            {required: true, message:this.$t('deviceView.selectDeviceChannel'), trigger: 'blur' }
          ],
          pictureUrl: [
            {required: true, message: this.$t('deviceView.uploadImage'), trigger: 'blur' }
          ]
        },
        showAddChannelDialog: false, //是否显示增加通道对话框
        file:'',
        deleteChannelId: 0,
        isUpdate: false,
        deviceNameTemp: '',
        channelCountTemp: 0,
        ezvizAccountList: [],
        elTooltipClass: 'el-tooltipClass'
      }
    },
    watch:{
      accountChanged(val,oldVal){
        console.log(val);
        let self=this;
        if(val!=0){
          self.InitData();
          self.getAllStoreList();
          self.getAccountList();
        }
      }
    },
    computed:{
      varyDivHeight:function(){
        if(this.varyWindowHeight>800){
          return this.varyWindowHeight*0.50;
        }
        else if(this.varyWindowHeight>700){
          return this.varyWindowHeight*0.60;
        }
        else{
          return this.varyWindowHeight*0.526;
        }
      },
      ...mapGetters({
        accountChanged:'accountChanged'
      })
    },
    methods:{
      generateDeviceLang,
      callChildAdd(){
        let self = this;
        self.$refs.ezvizAccount.showAddEzvizAccount();
      },
      handleClick(tabs){
        console.log(tabs);
        let self=this;
        let index=Number(tabs.index);
        switch(index){
          case 0:
            self.getAccountList();
            break;
          case 1:
            self.InitData();
            self.getAccountList();
            self.getAllStoreList()
            break;
        }
      },
      handleChange (file, fileList) {
        this.addChannelData.pictureUrl = file.url;
        this.addChannelData.file = file;
        this.file = file.raw;
        console.log(this.addChannelData.pictureUrl);
      },
      handleEditChange(file, fileList) {
        let self = this;
        self.isUpdate = true;
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
          if(self.showAddChannelDialog){
            self.addChannelData.pictureUrl = '';
            self.addChannelData.file = '';
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
        console.log('点击NVR')
        item.isClick=true;
        self.curNVRItem=item;
        self.channelCountTemp = item.channelCount;
        console.log(item.serialNumber)
        self.getChannelListByDevice(item.serialNumber);
        self.nvrData.forEach((_item,_index)=>{
          if(index!=_index){
            _item.isClick=false;
          }
        })
      },

      checkBeforeImport(){
        let self=this;
        console.log('checkbeforeImport');
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
        this.getDeviceList(params);
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
        self.getDeviceList(params);
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
        self.getDeviceList(params);
      },
      filterModel(){
        let self=this;
        self.modelFilter=!self.modelFilter;
        console.log(self.modelFilter);
        self.page=1;
        self.nvrFilterName='storeName';
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": self.modelFilter?"asc":"desc",
            "property": "deviceModel"
          }
        };
        self.getDeviceList(params);
      },
      filterAccount(){
        let self=this;
        self.modelFilter=!self.modelFilter;
        console.log(self.modelFilter);
        self.page=1;
        self.nvrFilterName='ezvizAccount';
        let params={
          "filter": {
            "page": self.page-1,
            "size": self.sizeNum
          },
          "order": {
            "direction": self.modelFilter?"asc":"desc",
            "property": "ezvizAccount"
          }
        };
        self.getDeviceList(params);
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
        self.getDeviceList(params);
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
      addEzivzDevice(params){
        return new Promise((resolve,reject)=>{
          ezvizRESTful.addEzivzDevice(params).then(resDevice=>{
            resolve(resDevice);
          }).catch((err)=>{

          })
        })
      },
      deleteEzvizDevice(params){
        return new Promise((resolve,reject)=>{
          ezvizRESTful.deleteEzivzDevice(params).then(resDevice=>{
            resolve(resDevice);
          })
        })
      },
      getAllDeviceData(){
        let self=this;
        let params={
          "filter": {
            "page": 0,
            "size": 1000
          }
        };
        return new Promise((resolve,reject)=>{
          ezvizRESTful.getEzvizList(params).then(res=>{
            let errMsg=res.errMsg;
            let data=[];
            if(errMsg!=undefined&&errMsg=='Success'){
              data=res.data.content;
            }
            resolve(data);
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
        let data=await self.getAllDeviceData();
        self.channelData=await self.getChannelData();
        console.log(data);
        let nvrList=[];
        let channelList=self.channelData.map(x=>x.id);
        data.forEach(item=>{
          let json = {};
          json.serialNumber = item.serialNumber;
          json.deleteFromEzviz = false;
          nvrList.push(json);
        })
        if(channelList.length==0&&nvrList.length==0){
          console.log('当前页面为空！');
        }
        else if(channelList.length==0&&nvrList.length!=0){
          nvrList.forEach(_item=>{
            self.deleteEzvizDevice(_item);
          })
        }
        else if(channelList.length!=0&&nvrList.length==0){
          await self.deleteChannel(channelList);
        }
        else{
          await self.deleteChannel(channelList);
          nvrList.forEach(_item=>{
            self.deleteEzvizDevice(_item);
          })
        }
        let res1= await self.addEzivzDevice(paramsNVR);
        console.log(res1);
        let res2= await self.addDevice(paramsDevice);
        if(res1.errCode === 0 &&res2.errCode === 0){
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
        self.getDeviceList(params);
      },
      downItem(){
      },
      importData(){
        let self=this;
      },
      importfxx(obj) {
        console.log(obj);
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
              if(nvrDataTemp.map(x=>x.ivsId).indexOf(item["序列号"])==-1){
                let obj={
                  serialNumber:item["序列号"],
                  name:item["设备名称"],
                  channelCount:item["通道数"],
                  storeId:item["StoreID"],
                  validationCode: item['设备验证码'],
                  ezvizAccount: item['萤石账号']
                }
                nvrDataTemp.push(obj);
              }
              let obj={
                name:item["通道名称"],
                storeId:item["StoreID"],
                ivsId:item["序列号"],
                channelId:item["通道序号"],
                vendor: 1
              }
              channelDataTemp.push(obj);
            })

            let params1={
              "device": nvrDataTemp
            };
            let params2={
              "device": channelDataTemp
            };
            console.log(params1);
            console.log(params2);
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
          const tHeader = ['StoreID','所属门店', '序列号','设备名称','设备验证码','通道数','通道名称','通道序号', '萤石账号']; // 导出的表头名
          const filterVal = ['storeId','storeName','serialNumber','name', 'validationCode' ,'channelCount','channelName','channelNum', 'ezvizAccount']; // 导出的表头字段名
          console.log(that.activeName);
          let deviceData=await that.getAllDeviceData();
          let channelData=that.channelData;
          let excelData=[];
          if(deviceData.length!=0 && channelData.length!=0){
            deviceData.forEach((item,index)=>{
              channelData.forEach((_item,_index)=>{
                if(item.serialNumber ==_item.ivsId){
                  let obj={};
                  obj.storeId=item.storeId;
                  obj.storeName=item.storeName;
                  obj.serialNumber=item.serialNumber;
                  obj.name=item.name;
                  obj.validationCode='';
                  obj.channelCount=item.channelCount;
                  obj.channelName=_item.name;
                  obj.channelNum=_item.channelId;
                  obj.ezvizAccount = item.ezvizAccount;
                  excelData.push(obj);
                }

              })
            })
          }

          const list = excelData;
          const data = that.formatJson(filterVal, list);

          //export_json_to_excel(tHeader, data, `看门店-设备管理导入示例`);// 导出的表格名称，根据需要自己命名
          export_json_to_excel(tHeader, data, '看门店-萤石云设备管理导入示例');// 导出的表格名称，根据需要自己命名
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
          deviceRESTful.updateDevice(params).then( async  res=>{
            console.log(res.data);
            let errMsg=res.errMsg;
            if(errMsg!=undefined&&errMsg=='Success'){
              if(item.tempUrl != item.pictureUrl){
                //获得增加通道的id,增加图片
                let fm = new FormData();
                fm.append('id', self.curChannelItem.id);
                fm.append('picture', self.file);
                attachRes = await self.attachImageToDevice(fm);
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
              self.getChannelListByDevice(self.curNVRItem.serialNumber);
            })
        }
        else{
          //新增通道
          console.log(item);
          let json = {};
          json.name = item.tempName;
          json.storeId = self.curNVRItem.storeId;
          json.ivsId = self.curNVRItem.serialNumber; //序列号
          json.channelId = item.channelId;
          json.vendor = 1; //Ezviz通道
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
              self.getChannelListByDevice(self.curNVRItem.serialNumber);
            })
        }
      },
      getDeviceList(params){
        let self=this;
        ezvizRESTful.getEzvizList(params).then(res=>{
          let errMsg=res.errMsg;
          let temp=[];
          if(errMsg!=undefined&&errMsg=='Success'){
            let data=res.data.content;
            data.forEach((item,index)=>{
              let obj={};
              console.log(item)
              obj.serialNumber=item.serialNumber;
              obj.name=item.name;
              obj.tempNvrName = item.name;
              obj.store=item.storeName;
              obj.storeId=item.storeId;
              obj.deviceModel=item.deviceModel;
              obj.ezvizAccount = item.ezvizAccount;
              obj.channelCount = item.channelCount;
              obj.tempChannelCount = item.channelCount;
              obj.channelNum=item.channelCount+'个';
              obj.comment = item.comment; //错误提示信息
              console.log(obj.comment);
              obj.ifCanEdit = true;
              obj.ifCanAdd = false;
              // if(obj.comment.length > 0){
              //   if(obj.comment.indexOf('20010')!= -1){
              //     obj.ifCanAdd = true;
              //   }
              //   else{
              //     obj.ifCanAdd = false;
              //   }
              // }
              // else{
              //   obj.ifCanEdit = true;
              // }
              obj.isEditing = false;
              if(index==0){
                obj.isClick=true;
              }
              else{
                obj.isClick=false;
              }
              temp.push(obj);
            })
            console.log(temp)
            self.nvrData=temp;
            console.log(self.nvrData)
            self.total=res.data.totalElements;
          }
        })
          .then(async()=>{
            if(self.nvrData.length!=0){
              console.log(self.nvrData[0].serialNumber);
              self.curNVRItem=self.nvrData[0];
              self.channelData=await self.getChannelData();
              self.getChannelListByDevice(self.nvrData[0].serialNumber);
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
      getChannelListByDevice(serialNumber){
        let self=this;
        let temp=[];
        console.log(self.channelData)
        self.channelData.forEach(item=>{
          console.log(item.ivsId)
          if(item.ivsId== serialNumber){
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
        self.getDeviceList(params);       //获取NVR 数据信息
      },
      async getAllStoreList(){
        let self=this;
        let params={
          "filter":{
            "page":0,
            "size":1000
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
      addDevice(params){
        return new Promise((resolve,reject)=>{
          deviceRESTful.addDevice(params).then(resDevice=>{
            resolve(resDevice);
          })
        })
      },
      //再次增加设备
      addAgain(index, item){
        let self = this;
        self.addDeviceData = item;
        self.isAddAgain = true;
        console.log(self.addDeviceData)
        self.showAddNvrDialog = true;
      },
      //增加设备
      addSingleNvr() {
        let self = this;
        if (self.isAddAgain) {
          //重新增加，即更新设备信息
          let obj = self.addDeviceData;
          obj.syncToEzviz = false;
          let params = {};
          params.serialNumber = obj.serialNumber;
          params.name = obj.name;
          params.syncToEzviz = false;
          params.channelCount = obj.channelCount;
          params.validationCode = obj.validationCode;
          params.ezvizAccount = obj.ezvizAccount;
          console.log(params);
          ezvizRESTful.updateEzvizDevice(params).then(res => {
            let errMsg = res.errMsg;
            if (errMsg != undefined && errMsg == 'Success') {
              self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
              self.showAddNvrDialog = false;
              self.isAddAgain = false;
            }
            else {
              self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
              self.showAddNvrDialog = false;
              self.isAddAgain = false;
            }
          })
            .then(async () => {
              self.channelData = await self.getChannelData();  //修改后更新数据源
              self.getChannelListByDevice(self.curNVRItem.serialNumber);
            })
        }
        else {
          self.$refs['nvrForm'].validate(async (valid) => {
            if (valid) {
              console.log(self.addDeviceData);
              let nvrParams = {};
              let nvrArray = [];
              nvrArray.push(self.addDeviceData);
              nvrParams.device = nvrArray;
              let res1 = await self.addEzivzDevice(nvrParams);

              if (res1.errMsg == 'Success') {
                self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
                self.showAddNvrDialog = false;
              }
              else {
                self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
                self.showAddNvrDialog = false;
              }
              self.addDeviceData = {name: '', validationCode: '', storeId: self.storeDataList[0].storeId, serialNumber: '', channelCount: 1, ezvizAccount: self.ezvizAccountList[0].ezvizAccount};
              self.page = 1;
              let params = {
                "filter": {
                  "page": self.page - 1,
                  "size": self.sizeNum
                },
                "order": {
                  "direction": "asc",
                  "property": "name"
                }
              };
              self.getDeviceList(params);
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
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
            json.ivsId = self.curNVRItem.serialNumber;
            json.channelId = self.addChannelData.channelId;
            json.vendor = 1;
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
            self.getChannelListByDevice(self.curNVRItem.serialNumber);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
            self.getChannelListByDevice(self.curNVRItem.serialNumber);
          })
      },
      editSingleNvr(index, item){
        let self=this;
        item.isEditing = true;
        item.isClick = true;
        self.nvrData.forEach((_item,_index)=>{
          if(index!=_index){
            _item.isEditing=false;
            _item.isClick = false;
          }
        })
        self.curNVRItem=item;
        self.channelCountTemp = item.channelCount;
        console.log(item.serialNumber)
        self.getChannelListByDevice(item.serialNumber);
        // show update dialog
        self.addDeviceData = item;
        self.isAddAgain = true;
        console.log(self.addDeviceData)
        self.showAddNvrDialog = true;
      },
      showAddDialog(){
        let self = this;
        self.showAddNvrDialog = true;
        self.isAddAgain = false;
        self.addDeviceData = {name: '', validationCode: '', storeId: self.storeDataList[0].storeId, serialNumber: '', channelCount: 1, ezvizAccount: self.ezvizAccountList[0].ezvizAccount};
      },
      confirmEditNvr(index,item){
        let self=this;
        console.log(item);
        console.log('确认编辑')
        let obj={};
        obj.serialNumber = item.serialNumber;
        obj.name  = item.tempNvrName;
        obj.channelCount = item.tempChannelCount;
        if(obj.name.trim().length==0){
          self.notify(self.$t('deviceView.deviceNameEmpty'),'warning',3000);
          return false;
        }
        obj.syncToEzviz = false;
        let params = obj;
        console.log(params);
        ezvizRESTful.updateEzvizDevice(params).then(res=>{
          console.log(res.data);
          let errMsg=res.errMsg;
          if(errMsg!=undefined&&errMsg=='Success'){
            self.notify(self.$t('deviceView.editSuss'),'success',3000);
            item.isEditing = false;
            item.name = item.tempNvrName;
            item.channelCount = item.tempChannelCount;
          }
          else{
            self.notify(self.$t('deviceView.editFail'),'warning',3000);
            item.isEditing = false;
          }
        })
          .then(async()=>{
            // self.channelData=await self.getChannelData();  //修改后更新数据源
            self.getChannelListByDevice(self.curNVRItem.serialNumber);
          })
      },
      cancelEditNvr(index,item){
        let self = this;
        console.log('取消编辑')
        item.isEditing = false;
        item.tempNvrName = item.name;
        item.tempChannelCount = item.channelCount;
      },
      //删除单个NVR
      async deleteSingleNVR(){
        let self = this;
        self.showConfirmDelete = false;
        let serialNumber = self.curNVRItem.serialNumber;
        let json ={};
        json.serialNumber = serialNumber;
        json.deleteFromEzviz = self.deleteFromEzviz;
        let channelList=self.channelList.map(x=>x.id);
        console.log(channelList);
        //先删除通道，后删除设备
        if(channelList.length > 0 ){
          let res1 = await self.deleteChannel(channelList);
          let res2 = await self.deleteEzvizDevice(json);
          if(res1.errMsg=='Success'&&res2.errMsg=='Success'){
            self.notify(self.$t('deviceView.deleteSuccess'),'success',3000);
          }
          else{
            self.notify(self.$t('deviceView.deleteFail'),'warning',3000);
          }
        }else{
          let res2 = await self.deleteEzvizDevice(json);
          if(res2.errMsg=='Success'){
            self.notify(self.$t('deviceView.deleteSuccess'),'success',3000);
          }
          else{
            self.notify(self.$t('deviceView.deleteFail'),'warning',3000);
          }
        }
        self.deleteFromEzviz = false;
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
        self.getDeviceList(params);
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
      async getAccountList(){
        let self = this;
        self.tableData = [];
        let retData = await self.getEzvizAccountList();
        let accountList = retData.data;
        console.log(accountList)
        self.ezvizAccountList = accountList;
      },
      getEzvizAccountList(){
        return new Promise((resolve,reject)=>{
          ezvizRESTful.getEzvizAccountList().then(result=>{
            resolve(result);
          })
        })
      },
      notify(msg,type,time) {
        this.$message({
          message: msg,
          type: type,
          duration:time
        });
      },

    },

    mounted(){
      let self=this;
      // self.InitData();
      // self.getAllStoreList();
      self.getAccountList();
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
    @include point(height,48);
    @include point(line-height,48);
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
    font-family: Arial, Microsoft YaHei;
  }
  .noraml-color{
    color: #4b5262 !important;
    background-color: #FAFAFA;
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
    position: relative;
    top: 3px;
    height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    min-width: calc(110/1920*100vw);
    @media screen and (min-width: 1366px){
      //@include point(width, 90);
      span{
        position: relative;
        @include point(bottom,3);
      }
    }
    @media screen and (max-width: 1366px){
      //@include point(width, 120);
      span{
        position: relative;
        @include point(bottom,5);
      }
    }
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
    position: relative;
    top: 3px;
    height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    @media screen and (min-width: 1366px){
      //@include point(width, 90);
      span{
        position: relative;
        @include point(bottom,3);
      }
    }
    @media screen and (max-width: 1366px){
      //@include point(width, 120);
      span{
        position: relative;
        @include point(bottom,5);
      }
    }

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
  .el-device{
    border: 1px solid $border;
    background-color: #fff;
    .el-btns{
      @include point(padding-top,10);
      @include point(padding-right,20);
      position: relative;
      @include point(height,31);
      .btns{
        position: absolute;
        @include point(right,25);
        z-index: 979;
        @include point(width,90);
      }
    }
    .addNvr .ezviz-form{
      border: 1px solid $border;
      background: $tab;
    }
    .el-tabPanels{
      @include point(padding,20);
      height: auto;
      position: relative;
      @include point(bottom,25);
      @include point(padding-bottom,0);
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
        @include point(padding-left,20);
        .info-title{
          font-size: 18px;
          font-weight: bold;
        }
        .add-btn{
          position: absolute;
          @include point(right, 20);
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          width: calc(130/1920*100vw);
          top: 0;
          bottom: 0;
          margin: auto;
          .el-icon-plus{
            font-size: calc(16/1920*100vw);
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
          font-size: 14px;
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
            span {
              left: 0;
            }
            .icon-filter {
              left: 0;
            }
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
            span{
              font-size: 14px;
            }
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
              span {
                left: 0;
              }
              .icon-filter {
                left: 0;
              }
            }
            .en-store-title {
              width: 20%;
            }
            .en-count-title {
              width: 22%;
              span {
                left: 0;
              }
            }
            .en-operation-title {
              width: 15%;
            }
          }
          @media screen and (max-width: 1440px) {
            span{
              font-size: 14px;
            }
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
              width: 23%;
              span {
                left: 0;
              }
              .icon-filter {
                left: 0;
              }
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
            span{
              font-size: 14px;
            }
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
              span {
                left: 0;
              }
              .icon-filter {
                left: 0;
              }
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
              @include point(margin-top,14);
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
                @include point(line-height,21);
                @include point(height,21);
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
                background-color: #fff;
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
          @include point(height,49);
          @include point(line-height,49);

          text-align: left;
          .nape-input{
            @include point(width,180);
            margin-left: 13%;
            position: relative;
            bottom: 2px;
            @media screen and (max-width:1600px){
              width: 100%;
            }
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
              @include point(width, 80);
              vertical-align: middle;
              text-align: center;
            }
            .upload-demo{
              position: absolute;
              bottom: 0;
              font-size: 12px;
              @include point(width, 80);
              /deep/ .el-upload{
                width: 100%;
              }
              /deep/ .el-button{
                width: 100%;
                @include point(height,20);
                opacity: 0.5;
                position: absolute;
                bottom: 0;
                left: 0;
              }
              /deep/ .el-button--mini{
                padding: 7px;
              }
              @media screen and (max-width: 1440px){
                .edit-picture{
                  position: relative;
                  bottom: 4px;
                }
              }
            }
          }
          .nape-items-handle{
            width: 12%;
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
      padding: calc(5/1920*100vw) 0;
      font-size: calc(16/1920*100vw);
    }
    span{
      position: relative;
      bottom: calc(1/1920*100vw);
      @media screen and (max-width: 1440px) {
        bottom: 0;
      };
    }
    @media screen and (max-width: 1440px) {
      width: 125px !important;
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
</style>
<style scoped>
  .el-input--small >>>.el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 15px !important;
    line-height: 50% !important;
  }
</style>
