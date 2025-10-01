<template>
  <div>
    <store-filter
      :multiStore="false"
      :showFavorite="enableMimicMode?false:true"
      @storeChange="onStoreChange"
    ></store-filter>
    <div class="el-container" style="margin-top: 20px" :class="{'flex-column': isFullScreenMode}">



      <div :style="{'border-top-right-radius': isFullScreenMode ? '0px': 'unset', 'border-top-left-radius': isFullScreenMode ? '0px': 'unset'}"
        v-if="!showSpread" class="rside paper spacer" >
        <div v-if="!isFullScreenMode" class="patrol-select title" :class="{'padding': !isFullScreenMode}">
          <div class="patrol-content text-left flex-center" :class="{'margin-bottom-md': isFullScreenMode}">
            {{ $t('remotePatrol.selectInspect') }}
            <el-select
              style="margin-left: 20px;"
              class="storevue-select-grey"
              :value="patrolstore"
              :placeholder="$t('remotePatrol.selectInspect')"
              :disabled = "emptyPatrolList"
              @change="changeInspect">
              <el-option
                v-for="item in PatrolList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <div class="spacer"></div>
            <el-button :disabled="(!allRemarkItemsFlag && !isDisabled)||storeStatus==61"
              class="storevue-button-filled"
              :size="varyWindowWidth>1680?'small':'mini'" type="primary" @click="confirmSummary">
              {{ $t('remotePatrol.confirmSum') }}
            </el-button>
          </div>
        </div>
        <hr v-if="!isFullScreenMode" class="hr-horizontal" :style="isFullScreenMode?{'margin-bottom': '20px'}:{}">
        <div v-if="sheetName.length!=0" :class="{'flex': isFullScreenMode, fullWidth: isFullScreenMode}">

          <div v-if="isFullScreenMode" style="width: 200px; padding-right: 10px">
            <el-input
              :placeholder="$t('insSettingView.enterInspectFilter')"
              v-model="searchItemValue"
              size="small"
              class="storevue-input-search fullWidth"
            >
              <i
                slot="prefix"
                class="iconfont icon-sousuo"
              />
            </el-input>
            <div v-for="(_item,_index) in sheetName.filter(sheet => sheet.groupId === 'feedBack' || sheet.inspectList && sheet.inspectList.some(inspect => inspect.items && inspect.items.some(item => item.subject.indexOf(searchItemValue) > -1)))" :key="_index">
              <template v-if="_item.isCategory">
                <div :style="_item.isClick?{color: '#006ab7'}:{color: '#69727c'}"
                class="margin-bottom-top-sm"
                style="text-align: left; cursor: pointer"
                      @click="changeSheet(_item,_index)">
                  <span>{{ _item.label }}</span>
                  <i class="el-icon-arrow-right icon"/>
                </div>
              </template>
              <template v-else>
                <div :style="_item.isClick?{color: '#006ab7'}:{color: '#69727c'}"
                class="margin-bottom-top-sm"
                style="text-align: left; cursor: pointer"
                      @click="getItemOfCategory(_item, _index)" >
                  <span>{{ _item.label }}</span>
                  <i class="el-icon-arrow-right icon"/>
                </div>
              </template>
              </div>
          </div>
          <div v-else class="flex-column padding" >
            <el-input
              :placeholder="$t('insSettingView.enterInspectFilter')"
              v-model="searchItemValue"
              size="small"
              class="storevue-input-search"
              style="width:100%"
            >
              <i
                slot="prefix"
                class="iconfont icon-sousuo"
              />
            </el-input>
            <div class="flex" style="flex-wrap: wrap">
              <div v-for="(_item,_index) in sheetName.filter(sheet => sheet.groupId === 'feedBack' || sheet.inspectList && sheet.inspectList.some(inspect => inspect.items && inspect.items.some(item => item.subject.indexOf(searchItemValue) > -1)))" :key="_index">
                <template v-if="_item.isCategory">
                  <div v-if="!showIgnoreItem ||_item.ignoreCount>0"  class="group_content" :class="_item.isClick?'noraml-color':'noraml-groupColor'"
                        @click="changeSheet(_item,_index)">
                    <span>{{ _item.label }}</span>
                  </div>
                </template>
                <template v-else>
                  <div  v-if="!showIgnoreItem ||_item.ignoreCount>0" class="group_content" :class="_item.isClick?'noraml-color':'noraml-groupColor'"
                        @click="getItemOfCategory(_item, _index)" >
                    <span>{{ _item.label }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- right side -->
          <div class="fullWidth rside">

            <div v-if="!showFeedBack" class="padding" :class="{flex:isFullScreenMode && $store.getters.collapsed}" style="background-color: rgb(237, 240, 242); height: 60vh; overflow: auto;flex-wrap: wrap; justify-content: space-between">

              <div
                v-if="sourceListLength > 0"
                style="width: 100%; margin-bottom: 3px; font-size: 12px; text-align: right; color: #989797;"
                >
                目前已附加截圖 {{ totalImageNum }} 張，最多可以附加 {{isSystemAdvanced ? 500 : 120}} 張。
              </div>

              <div
                v-for="(item_) in inspectList"
                :key="item_.id"
                class="inspect-details paper margin-bottom-sm" :style="isFullScreenMode && $store.getters.collapsed?{width: 'calc(50% - 10px)'}:{}">
                <div  v-if="!showIgnoreItem ||item_.ignoreCount>0" class="flex padding-sm title">
                  <div class="spacer font-13" style="text-align: left; border-left: 4px solid #2c90d9; padding-left: 8px;">{{ item_.groupName }}</div>
                  <div v-if="!showIgnoreItem ">{{ item_.dealCount+'/'+item_.count }}</div>
                </div>

                <hr v-if="!showIgnoreItem ||item_.ignoreCount>0"  class="hr-horizontal">
                <div v-for="(item,index) in item_.items.filter(d => d.subject.indexOf(searchItemValue ) > -1 && (!showIgnoreItem || d.ignore )) "
                  :key="index"
                  class="item-details padding-sm"
                  :style="item.checked?{'background-color':'#f5f7fa'}:{}"
                  @click="clickItem({item,index:showIgnoreItem?item.originIndex:index})"
                  >

                  <div class="flex fullWidth" >
                    <div class="font-15" style="text-align: left; width: calc(20/1920*100vw)" :style="item.checked?{'color':'#006ab7'}:{}">{{(index+1) + '.'}}</div>
                    <div class="flex padding-bottom-sm spacer" >

                      <!-- subject -->
                      <div
                        :class="!item.manualIgnore?'noraml-title':'ignore-title'"
                        :style="item.checked?{'color':'#006ab7'}:{'color': '#484848'}"
                        class="spacer font-15"
                        style="text-align: left; font-weight: 500; word-break: break-all;"
                      >
                        <span style="color: #c60957" v-if="item.required">*</span>
                        <span :class= "{ is_important : item.isImportant}"> {{ item.subject }}  </span>

                      </div>

                      <!-- dropdown -->
                      <div v-if="item.itemType === 0">
                        <el-dropdown v-if="item.groupType !== 1" :class="!item.manualIgnore?'noraml-title':'ignore-title'"
                                      trigger="click" class="item-score" size="small" :disabled="(item.manualIgnore || item.notEdit)">
                          <span class="el-dropdown-link">
                            {{ `${$t('remotePatrol.scoreUnit')}${item.itemScoreTitle}` }}
                            <i class="el-icon-arrow-down el-icon--right"/>
                          </span>
                          <el-dropdown-menu slot="dropdown" class="score-menu" >
                            <el-dropdown-item
                              v-for="(itemDS,indexDs) in item.scoreList" :key="indexDs"
                              style="width:70px;text-align:center;"
                              @click.native="checkScore({item,itemDS: itemDS,index: index, e:0})">{{ itemDS.scoreTitle }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown v-else :class="!item.manualIgnore?'noraml-title':'ignore-title'"
                                      trigger="click" class="item-score" size="small" :disabled="(item.manualIgnore || item.notEdit)">
                          <span class="el-dropdown-link">
                            {{ `${$t('remotePatrol.scoreUnit')}${item.itemScoreTitle}` }}
                            <i class="el-icon-arrow-down el-icon--right"/>
                          </span>
                          <el-dropdown-menu slot="dropdown" class="score-menu">
                            <el-dropdown-item
                              v-for="itemDS in item.itemScoreLength"
                              :key="itemDS"
                              style="width:70px;text-align:center;"
                              @click.native="checkScore({item,itemDS: itemDS,index: index, e:1})">{{ itemDS }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <div v-if="!item.required" class="cancel-text"
                          :style="(item.notEdit && isEditReport)?{'pointer-events':'none'}:{'pointer-events':'auto'}"
                          @click="item.manualIgnore ? CancleIgnoreItem({item,index}) : ignoreItem({item,index,e:0})">{{item.manualIgnore ? $t('remotePatrol.cancel') : $t('remotePatrol.ignore')}}</div>
                      </div>
                    </div>
                  </div>

                  <!-- description -->
                  <div style="margin-left: calc(20/1920*100vw)" >
                    <div :class="!item.manualIgnore?'noraml-title':'ignore-title'" style=" word-break: break-all" class="details-content margin-bottom-sm">
                      {{ item.description }}
                    </div>
                    <div v-if="item.lastUnqualifiedNumber > 0" class="details-failed-record margin-bottom-sm">
                      {{ $t('remotePatrol.failedRecord') + item.lastUnqualifiedNumber }}
                    </div>
                  </div>

                  <!-- comment -->
                  <div style="padding-left: calc(20/1920*100vw)">
                    <!-- img -->
                    <div v-if="item.sourceList.length!=0" :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="source-content">
                      <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details">
                        <div v-if="_item.mediaType == 3" class="flex-center">
                          <div
                            class=" flex-center comment_list "
                            :style="curEditIndex === _index ? {'border':'1px solid #006ab7'}:{'border':'1px solid #e6e6e6'}, /\s/.test(_item.src) ? {'word-break':'normal'} : {'word-break':'break-all'}"
                          >
                            <div style="flex: 1; text-align: left; margin: 5px; font-size: 13px;">
                              {{ _item.src }}
                            </div>
                            <hr v-if="_item.showDelBtn" class="hr-vertical" />
                            <!-- 編輯 -->
                            <img
                              v-if="_item.showDelBtn"
                              :src="editInspectIcon"
                              alt="edit"
                              style="margin: 5px"
                              @click="editItemResource({ item, index: _index })"
                            />
                          </div>
                          <!-- 刪除 -->
                          <img
                            v-if="_item.showDelBtn"
                            :src="deleteInspectIcon_new"
                            alt="delete"
                            class="to_delete"
                            @click="deleteItemResource({ item, index: _index })"
                          />
                        </div>
                      </div>
                    </div>

                    <div v-if="item.sourceList.length!=0" :class="!item.manualIgnore?'noraml-title':'ignore-title'" class="img-source-content">
                      <div v-for="(_item,_index) in item.sourceList" :key="_index" class="source-details" >
                        <div v-if="_item.mediaType==2" class="img-content">
                          <i v-if="_item.showDelBtn" class="el-icon-close icondelete" @click="deleteImg({item,index: _index})" />
                          <el-image
                            :src="_item.src"
                            :style="{width: _item.width, height: _item.height}"
                            :preview-src-list="getImgList({index: _index, sourceList: item.sourceList})"/>
                        </div>
                        <div v-if="_item.mediaType==1" class="img-content">
                          <i class="el-icon-close icondelete" @click="deleteImg({item,index:_index})" />
                          <img :src="startIcon" :height="36" class="start-icon" @click="playCutVideo({item:_item,index: _index})">
                          <img :src="videoImgSrc" :height="_item.height" class="imgLittle">
                        </div>
                      </div>
                    </div>

                    <!-- text input -->
                    <div style="position: relative">
                      <el-input
                        :autosize="{ minRows: 2, maxRows: 7 }"
                        v-model="item.inspectInput"
                        :placeholder="$t('remotePatrol.coment')"
                        :disabled="item.disabled"

                        size="mini"
                        class="force_white"

                        type="textarea"
                        resize="none"
                        @input="(val) => itemDescriptionChanged({ val, item })"
                        @blur="notShowInputRuleTips({ e: 'item', item })"
                      />
                      <button
                        class="inspect-btn"
                        :disabled="item.disabled"
                        @click="submitItemResource({ item })"
                      >
                        {{$t('remotePatrol.confirm')}}
                      </button>
                    </div>

                    <!-- notification -->
                    <div class="advance_memo" v-if="(item.memo_config !== null && item.memo_config.memo_required_type == 1)">
                      {{$t('remotePatrol.pleaseAdd')}} <span v-show="(item.memo_config.memo_check_text == true)"> {{$t('remotePatrol.textItem')}}</span>
                          <span v-show="(item.memo_config.memo_check_text == true && item.memo_config.memo_check_media == true)">, </span>
                          <span v-show="(item.memo_config.memo_check_media == true)">{{$t('remotePatrol.mediaItem')}}</span> {{$t('remotePatrol.attachments')}}
                    </div>

                    <div class="advance_memo" v-else-if="( item.memo_config !== null && item.memo_config.memo_required_type == 2)">
                      <div class="" v-if="(item.qualifiedScore === 0)">
                      {{$t('remotePatrol.notQualifyAdd')}}
                          <span v-show="(item.memo_config.memo_check_text == true)"> {{$t('remotePatrol.textItem')}}</span>
                          <span v-show="(item.memo_config.memo_check_text == true && item.memo_config.memo_check_media == true)">, </span>
                          <span v-show="(item.memo_config.memo_check_media == true)">{{$t('remotePatrol.mediaItem')}}</span> {{$t('remotePatrol.attachments')}}
                      </div>
                      <div class="advance_memo" v-else-if="(item.qualifiedScore > 0)">
                        {{$t('remotePatrol.lowerThan')}}  {{item.qualifiedScore}} {{$t('remotePatrol.lowScoreAdd')}}
                          <span v-show="(item.memo_config.memo_check_text == true)"> {{$t('remotePatrol.textItem')}}</span>
                          <span v-show="(item.memo_config.memo_check_text == true && item.memo_config.memo_check_media == true)">, </span>
                          <span v-show="(item.memo_config.memo_check_media == true)">{{$t('remotePatrol.mediaItem')}}</span> {{$t('remotePatrol.attachments')}}
                      </div>
                    </div>
                    <span v-if="item.RuleCountTip" class="rules">{{
                      $t("remotePatrol.commentCountRuleTip")
                    }}</span>
                    <span v-if="item.Ruletip" class="rules">{{
                      $t("remotePatrol.comentRuletip")
                    }} </span>
                  </div>
                </div>
              </div>

            </div>

            <div v-if="showFeedBack" style="background-color: rgb(237, 240, 242); height: 60vh; overflow: auto;">
              <div v-if="showFeedBackInfo&&showFeedBack" class="item-content paper" style="margin: 20px; height: calc(100% - 40px); position: relative">
                <div id="feedback-content">
                  <div class="feedback-info">{{ $t('remotePatrol.methodI') }}</div>
                  <div class="feedback-info">{{ $t('remotePatrol.methodII') }}</div>
                </div>
                <img :src="arrows2Src" alt="arrow2" style="position: absolute; bottom: 90px; right: 100px" height="70">
                <img :src="plusSrc" alt="plusSrc" style="position: absolute; bottom: 20px; right: 20px" @click="addFeedBack">
              </div>
              <div v-if="!showFeedBackInfo&&showFeedBack" class="item-content paper padding-sm margin-md">
                <div class="feedbacks-content padding-sm ">
                  <div v-for="(item,index) in eventList" :key="index" :class="{'margin-bottom-sm': index !== eventList.length}">
                    <div class="flex-center margin-bottom-sm">
                      {{ `${index+1}. ${item.eventName}` }}
                      <div class="spacer"></div>
                      <button
                        v-if="item.showDelBtn"
                        class="feedback-delete-btn"
                        @click="deleteEvent(item,index)"
                      >
                        {{$t('titleView.delete')}}
                      </button>
                    </div>
                    <div class="flex-center"
                      v-for="(source, idx) in item.sourceList"
                      :key="idx">
                      <img
                        v-if="item.showDelBtn"
                        :src="deleteInspectIcon"
                        alt="delete"
                        @click="editFeedback(item, index)"
                      />
                      <div
                        class="paper flex-center margin-bottom-sm inspect-text"
                      >
                        <div style="flex: 1; text-align: left; margin: 5px">
                          {{source.src}}
                        </div>
                        <hr v-if = "item.showDelBtn" class="hr-vertical" />
                        <img
                          v-if = "item.showDelBtn"
                          :src="editInspectIcon"
                          alt="edit"
                          style="margin: 5px"
                        @click="editFeedback(item, index)"
                        />
                      </div>
                    </div>
                    <div v-if="item.sourceObj!=null&&item.sourceObj.mediaType==2" class="img-content margin-bottom-sm">
                      <el-image
                        :src="item.sourceObj.src"
                        :style="{width: item.sourceObj.width, height: item.sourceObj.height}"
                        :preview-src-list="getImgList({index: 0, sourceList: [item.sourceObj]})"/>
                    </div>
                    <div v-if="item.sourceObj!=null&&item.sourceObj.mediaType==1" class="img-content margin-bottom-sm">
                      <img :src="startIcon" :height="36" class="start-icon" @click="playCutVideo({item,index})">
                      <img :src="videoImgSrc" class="imgLittle" height="100">
                    </div>
                    <hr v-if="index !== eventList.length" class="hr-horizontal">
                  </div>
                </div>
                <div class="flex fullWidth" style="justify-content: right"><img :src="plusSrc" alt="plusSrc" class="plus-icon" @click="addFeedBack"></div>

              </div>
            </div>
          </div>
        </div>
        <div v-if="sheetName.length==0" class="spacer flex-center" style="align-items: center; justify-content: center">
          <div class="inspect-empty" style="padding: 60px 0;">
            <img :src="noItemIcon" class="no-item">
            <div class="font-15" style="color: #69727c; margin-top: 15px">{{ $t('remotePatrol.noItems') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { checkOutInspectItemV3 } from '@/api/inspect';
import util from '@/common/util';
import { getStoreList, addFavoriteStore, deleteFavoriteStore, getStoreInfo } from '@/api/store';
import {ListMysteryModeStoreInfo} from '@/api/mystero';
import { getUserInfo } from '@/api/login';
import { mapGetters } from 'vuex';
import InspectionItem from '@/components/InspectionItem.vue';
import DialogPop from '@/components/DialogPop.vue';
import DialogVue from '@/components/DialogVue.vue';
import ChannelIconBtn from '@/components/ChannelIconBtn.vue';
import { getCookie } from '@/common/auth';
import filterString from '@/common/filterString.js';
import Database from '@/common/Database.js';
import SkywatchVideo from '@/components/SkywatchVideo';
import DashVideo from '@/components/DashVideo';
import EzvizVideo from '@/components/EzvizVideo';
import BeseyeVideo from '@/components/BeseyeVideo';
import StoreFilter from '@/components/StoreFilter';
import PermissionHelper from '@/api/PermissionHelper';

export default {
  name: 'ReInspection',
  components: {
    InspectionItem,
    DialogPop,
    DialogVue,
    ChannelIconBtn,
    SkywatchVideo,
    DashVideo,
    EzvizVideo,
    BeseyeVideo,
    StoreFilter
  },
  props: {
    showIgnore: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      storeStatus:-1,
      serachChannelValue: '',
      isFullScreenMode: false,
      sheetName: [],
      isShowWarn: false,
      notShowAlert: false,
      patrolstore: '',
      PatrolList: [],
      showControls: false,
      showGuide: true,
      sourceList: [],
      isDisabled: false,
      penBtnSrc: require('../../../../static/img/edit_btn.png'),
      showPenBtn: true,
      showPen: false,
      showStoreUp: false,
      showAddTextFeedbackDialog: false,
      showFeedDialog2: false,
      arrows1Src: require('../../../../static/img/arrows_left.png'),
      arrows2Src: require('../../../../static/img/arrows_right.png'),
      plusSrc: require('../../../../static/img/add_icon.png'),
      backicon: require('../../../../static/img/back.png'),
      channelIcon: require('../../../../static/img/channel.png'),
      channelActiveIcon: require('../../../../static/img/channel_active.png'),
      deleteInspectIcon: require('../../../../static/img/cross.png'),

      deleteInspectIcon_new: require('../../../../static/img/table-delete.png'),
      editInspectIcon: require('../../../../static/img/pen.png'),

      starYellowIcon: require('../../../../static/img/star-yellow.png'),
      starGreyIcon: require('../../../../static/img/star-grey.png'),
      defaultModeIcon: require('../../../../static/img/default-mode.png'),
      fullScreenModeIcon: require('../../../../static/img/full-screen.png'),
      noItemIcon: require('../../../../static/img/no-item.png'),
      showModelContent: false,
      showInfoContent: true,
      activeIndex: '0',
      serachVale: '',
      searchItemValue: '',
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      showDate: true,
      tempArr: [],
      playDate: new Date(),
      channel: null,
      showCutModel: false,
      errorText: '',
      showError: false,
      showVideo: true,
      showCancelContent: false,
      showSpread: false,
      curSelStoreId: '',
      storeList: [],
      storeList_: [],
      tabList: [
        {
          label: this.$t('remotePatrol.star'),
          storeList: []
        },
        {
          label: this.$t('remotePatrol.visited'),
          storeList: []
        },
        {
          label: this.$t('remotePatrol.allStores'),
          storeList: []
        }
      ],
      store: {},

      oss: null,
      bucketVideo: '',
      bucketImage: '',
      percentage: 0,
      accountId: '',
      userId: '',
      tempStoreList: [],
      allInitStoreList: [],
      inspectList: [],
      showFeedBack: false,
      curGroup: null,
      curGroupIndex: 0,
      curItemIndex: 0,
      curSheetIndex: 0,
      curSheet: null,
      curItem: {disabled : false},
      curItemId: 0,
      curhasIgnoreItem: 0,

      curTabIndex: 0,
      curTabItem: null,
      curStoreIndex: 0,
      curStoreItem: null,
      patrolStoreName: null,

      inspectItemList: [],
      allInspectItemList: [],
      deviceList: [],
      protocal: 'DASH',
      curDeviceId: -1,
      videoEl: '',
      canvasEl: '',
      showCutDialog: false,
      imageCanvas: new Image(),
      imageCanvasList: [],
      playState: false,
      editCount: 0,
      ignoreTemp: [],

      changeBrandObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmSwitchBrand'),
        isWarning: true,
        dialogCosed: false
      },
      changeStoreObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmSwitch'),
        isWarning: true,
        dialogCosed: false
      },
      changeInspectObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmSwitchInspect'),
        isWarning: true,
        dialogCosed: false
      },
      noBindDeviceObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.notBindCamera'),
        isWarning: false,
        dialogCosed: false
      },
      noAllInspectObj: {
        title: this.$t('remotePatrol.confirmSum'),
        showInfo: this.$t('remotePatrol.incompleteInfo'),
        isWarning: true,
        dialogCosed: false
      },
      allIgnoreObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.allIgnored'),
        isWarning: false,
        dialogCosed: false
      },
      leaveObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.changPageInfo'),
        isWarning: true,
        dialogCosed: false
      },

      // requiredObj
      requiredObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.requiredValid'),
        isWarning: true,
        dialogCosed: false
      },
      EditRptchangeInspectObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.cannotSwitchInspect'),
        isWarning: false,
        dialogCosed: false
      },
      EditRptchangeBrandObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.cannotSwitchBrand'),
        isWarning: false,
        dialogCosed: false
      },

      // 備註標籤
      memoConfigTextObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.requiredValid'),
        isWarning: true,
        dialogCosed: false
      },
      memoConfigMediaObj: {
        title: this.$t('remotePatrol.prompt'),
        showInfo: this.$t('remotePatrol.requiredValid'),
        isWarning: true,
        dialogCosed: false
      },



      recorder: null,
      videoCanvasSrc: '',
      isRecordingStarted: false,
      isStoppedRecording: false,
      dialogCommentVideo: false,
      curVideoSrc: '',
      curFeedBackVideoSrc: '',

      feedBackVideoFileObj: {},
      videoSpeed: 0,
      videoSpeedId: 0,
      showGetVideo: false,
      timeVideo: 0,
      startTimeCutVideo: 0,
      endTImeCutVideo: 0,
      startIcon: require('../../../../static/img/play_icon.png'),
      videoImgSrc: require('../../../../static/img/video_thumbnail.png'),

      eventList: [],
      channelBtns: [],
      showChannelBtns: [],
      allChannelBtns: [],
      hideLast: false,
      hideNext: false,
      eventName: '',
      eventDes: '',
      showFeedBackInfo: true,
      showAddFeedBackBtn: true,
      timerPlayReal: null,
      isPlayingFlag: -1,
      lang: this.$i18n.locale,
      initEzviz: false,
      sourceListLength: 0,
      realTimeSpeed: 0,
      isLoading: false,
      showEventNameInfo: false,
      fromName: '',
      eventNameRuletip: false,
      eventDesRuletip: false,
      oldVal: '',
      historyObj: null,
      beforepatrolstore: '',
      hasIgnoretemp: [],
      vendor: 1,
      feedbackIndex: -1,
      currentVideoComponent: 'EzvizVideo',
      groupType: -1,
      isCategory: false,
      itemOptionsForType1: [],
      itemOptionsForType3: [],
      allRemarkItemsFlag: false,
      curEditIndex: -1,
      feedbackInput: '',
      curEditFeedbackIndex: -1,
      feedbackSourceList: [],
      isBindWorkflow:false,
      workflowInfo:null,
      backSheetGroup:null,
      isEditReport:false,
      curInspectId:-1,
      reportId:-1,
      auditState:-1,
      auditCancelable:false,
      reportStatus:-1,
      enableMimicMode:false,

      showIgnoreItem: false,
      emptyPatrolList: true,
      isSystemAdvanced: false,

      totalImageNum: 0

    };
  },
  computed: {
    percentHeight: function() {
      return this.varyWindowHeight / 758;
    },
    ...mapGetters({
      accountChanged: 'accountChanged',
      videoAuthority: 'videoAuthority',
      mimicMode:'mimicMode'
    }),
    storeUpClass() {
      return {
        'coll': this.store.storeUp,
        'nocoll': !this.store.storeUp,
        'storeUp-content': this.lang.indexOf('ja') === -1,
        'ja-storeUp-content': this.lang.indexOf('ja') !== -1
      }
    },
    totalSourceList(){
        const self = this;
        let total = 0;
        self.sheetName.forEach((inspectItem, index1) => {
          //  console.log(inspectItem.inspectList)
            if(inspectItem.inspectList){
            inspectItem.inspectList.forEach((group, index2) => {
                if(group.items){
                  group.items.forEach((item, index3) => {
                    item.sourceList.forEach((source, index4) => {
                      console.log("Add source type="+source.mediaType)
                      if(source.mediaType!=3){
                        total = total+1;
                      }
                    });
                  });
                }
            });

            }

        });

        this.eventList.forEach((event, index1) => {
          if(event.sourceObj){
            total = total +1;
          }
        });

        this.totalImageNum = +total

        console.log("Total Source="+total)
        return total;
    }
  },
  watch: {
    accountChanged(val, oldVal) {
      const self = this;
      if (val !== 0) {
        self.changeBrand();
      }
    },
    showIgnore(nv,old){
      const self = this;
      if(old && !nv){
        self.backToPatrol()
        this.$forceUpdate();
      }
    },
    vendor(){
      this.currentVideoComponent = ['DashVideo', 'EzvizVideo', 'BeseyeVideo', 'SkywatchVideo'][this.vendor] || 'EzvizVideo';
    },
    mimicMode(){
      const self = this;
      self.enableMimicMode = this.$store.getters.mimicMode;
      self.getAllStore();
      //console.log("enableMimicMode:",this.enableMimicMode);
    },

    PatrolList(val){
      console.log('val :>> ', val);
      if(val.length > 0) this.emptyPatrolList = false

    }
  },

  beforeRouteLeave(to, from, next) {
    const self = this;
    const canLeave = !self.showGuide && self.$refs.vendorVideo && self.$refs.vendorVideo.editCount !== 0;
    if (canLeave && to.name !== 'confirmSum') {


      self.$confirm(self.$t('remotePatrol.changPageInfo'), self.$t('remotePatrol.prompt'), {
        confirmButtonText: self.$t('remotePatrol.confirm'),
        cancelButtonText: self.$t('remotePatrol.cancel'),
        type: 'warning',
        customClass: 'confirmClass',
        cancelButtonClass: 'cancelBtn',
        confirmButtonClass: 'confirmBtn'
      }).then(() => {
        self.$store.dispatch('setBackPatrolParam', null);
        if (to.name != 'confirmSum') {
          //   from.meta.keepAlive=false;
          self.playState && self.previewplayer && self.previewplayer.dispose();
          self.$store.dispatch('setPatrolHistory', null);
          self.$store.dispatch('setPatrolComment', null);
          self.$store.dispatch('setStoreList', []);
          self.$store.dispatch('setStoreCache', null);
          self.$store.dispatch('setEditCount', 0);
          self.$store.dispatch('setEditReport', false);
          Database.addDataToDB(self.userId, {data: {}, rule: {}});
        } else {
          //   from.meta.keepAlive = true;

          self.$store.dispatch('setStoreList', self.storeList);
          self.$store.dispatch('setPatrolHistory', self.historyObj);
          self.$store.dispatch('setStoreCache', this.curSelStoreId);
          self.$store.dispatch('setEditReport', self.isEditReport);
        }
        // !self.showGuide && self.$refs.vendorVideo.stopVideoPlay();
        next();
      }).catch(() => {
        next(false);
      });
    } else {
      self.$store.dispatch('setBackPatrolParam', null);
      if (to.name != 'confirmSum') {
        // from.meta.keepAlive=false;
        this.editCount = 0;
        this.$store.dispatch('setEditCount', this.editCount);
        self.$store.dispatch('setEditReport', false);
        self.$store.dispatch('setPatrolHistory', null);
        self.$store.dispatch('setPatrolComment', null);
        self.$store.dispatch('setStoreList', []);
        self.$store.dispatch('setStoreCache', null);
        Database.addDataToDB(self.userId, {data: {}, rule: {}});
      } else {
        self.$store.dispatch('setPatrolComment',{suggest:self.suggest,status:self.reportStatus});
        self.$store.dispatch('setPatrolHistory', self.historyObj);
        self.$store.dispatch('setStoreList', self.storeList);
        self.$store.dispatch('setStoreCache', this.curSelStoreId);
        self.$store.dispatch('setEditReport', self.isEditReport);
      }
      // !self.showGuide && this.$refs.vendorVideo.stopVideoPlay();
      next();
    }
  },

  async mounted() {
    const self = this;
    await self.getUserInfo()
    this.enableMimicMode = this.$store.getters.mimicMode;
    const PatrolHistory = self.$store.getters.PatrolHistory;
    const storeListCache = self.$store.getters.storeListCache;
    const BackPatrolParam = self.$store.getters.BackPatrolParam;
    const PatrolComment = self.$store.getters.PatrolComment;
    if (PatrolComment != null) {
      self.suggest = PatrolComment.suggest;
      self.reportStatus = PatrolComment.status;
    }
    console.log("*BackPatrolParam:",BackPatrolParam);
    console.log("*PatrolHistory:",PatrolHistory);
    if (storeListCache) self.storeList = storeListCache
    if (PatrolHistory != null) {
      self.activeIndex = PatrolHistory.activeIndex;
      self.tabList[Number(self.activeIndex)].storeList = PatrolHistory.storeList;
      // self.storeList = PatrolHistory.storeList
      const indexFeed = PatrolHistory.sheetName.map(x => x.groupId).indexOf('feedBack');
      let getdealnum = 0;
      const sheetName = PatrolHistory.sheetName.slice(0, indexFeed);
      sheetName.forEach(s_item => {
        s_item.count != s_item.Effective ? getdealnum++ : '';
        s_item.inspectList.forEach(n_item => {
          n_item.items.forEach(item => {
            item.isIgnore = false;
          });
        });
      });
      self.isShowWarn = getdealnum != 0;
      self.sheetName = PatrolHistory.sheetName;
      self.PatrolList = PatrolHistory.PatrolList;
      self.patrolstore = PatrolHistory.patrolstore;
      self.inspectList = PatrolHistory.sheetName[PatrolHistory.curSheetIndex].inspectList;
      self.showChannelBtns = PatrolHistory.showChannelBtns;
      self.allChannelBtns = PatrolHistory.allChannelBtns;
      self.curSheetIndex = PatrolHistory.curSheetIndex;
      self.curSheet = PatrolHistory.curSheet;
      self.curGroupIndex = PatrolHistory.curGroupIndex;
      self.curItemIndex = PatrolHistory.curItemIndex;
      self.deviceList = PatrolHistory.deviceList;
      self.isDisabled = true;
      self.channel = PatrolHistory.channel;
      self.curItemId = PatrolHistory.curItemId;
      self.vendor = self.channel.vendor;
      self.eventList = PatrolHistory.eventList;
      const isClick = self.sheetName[self.sheetName.length - 1].isClick;
      if (isClick) {
        if (PatrolHistory.eventList.length > 0) {
          self.showFeedBackInfo = false;
          self.showFeedBack = true;
        } else {
          self.showFeedBackInfo = true;
          self.showFeedBack = true;
        }
      } else {
        self.inspectItemList = [...PatrolHistory.inspectItemList];
      }
      self.store = PatrolHistory.store;
      self.patrolStoreName = PatrolHistory.store.storeName;
      self.showGuide = false;
      self.showStoreUp = true;
      if (PatrolHistory.hasIgnoretemp.length === 0) {
        self.notShowAlert = true;
      }
      self.isBindWorkflow = PatrolHistory.isBindWorkflow;
      if(PatrolHistory.isEditReport){
        self.reportId = PatrolHistory.reportId;
        self.isEditReport = PatrolHistory.isEditReport;
        self.auditState = PatrolHistory.auditState;
        self.auditCancelable = PatrolHistory.auditCancelable;

      }
    }else if(BackPatrolParam != null){
      self.getAllStore();
      self.backSheetGroup = BackPatrolParam.backSheetGroup;
      self.reportId = BackPatrolParam.reportId;
      self.reportStatus = BackPatrolParam.reportStaus;
      self.isEditReport = BackPatrolParam.isEdit;
      self.auditState = BackPatrolParam.auditState;
      self.suggest = BackPatrolParam.reportComment;
      self.curSelStoreId = BackPatrolParam.store;
      self.patrolstore = BackPatrolParam.tagName;
      self.curInspectId = BackPatrolParam.tagId;
      self.showGuide = false;
      self.isDisabled = true;
      console.log("BackPatrolParam.auditCancelable:",BackPatrolParam.auditCancelable);
      self.auditCancelable = BackPatrolParam.auditCancelable;
    } else {
      self.getAllStore();
    }
    self.$store.dispatch('setEditReport', self.isEditReport);
    console.log("this.$store.getters.editReport:",this.$store.getters.editReport);
    document.onmouseup = self.mouseUpAction;
    self.getUpLoadBucketInfo();
    self.getOssInfo();
    window.onresize = function() {
      if (!self.checkFull()) {
        self.fullScreen = false;
        var ele = document.getElementById('videoContent');
        ele.style.width = 'auto';
        ele.style.height = 'auto';
      }
    };
  },

  methods: {

    async getUserInfo(){
      const result = await this.$store.dispatch("GetUserAuthorities");
      this.isSystemAdvanced = result.data.isSystemAdvanced
    },

    changeStore_(_item) {
      console.log("CHange STore")
      console.log(_item)
      const self = this;

      self.patrolstore = '';
      self.curSheetIndex = 0;
      self.curSheet = {};
      self.inspectItemList = [];
      self.inspectList = [];
      self.sheetName = [];
      self.tempArr = [];
      self.showChannelBtns = [];
      self.patrolStoreName = (typeof _item!='undefined')?_item.name:'';
      self.PatrolList = [];
      self.hasIgnoretemp = [];
      self.$store.dispatch('setPatrolHistory', null);
      self.isShowWarn = false;
      self.notShowAlert = false;
      this.showIgnoreItem = false;
      this.$emit("listenerChild", false);

      self.showStoreUp = true;
      self.$refs.vendorVideo && (self.$refs.vendorVideo.editCount = 0);
      self.$refs.vendorVideo && self.$refs.vendorVideo.stopVideoPlay();
      self.showError = false;
      self.curDeviceId = -1;
      self.showFeedBack = false;
      self.eventList = [];
      self.showGuide = true;
      self.channel = null;
      self.store = {};
      self.storeStatus = _item?_item.status:-1;
      if(typeof _item!='undefined'){
        _item.authorizedInspect.forEach(au_item => {
          if (au_item.mode === 1) {
            self.PatrolList.push(au_item);
          }
        });
        _item.isActive = true;
        const obj = {};
        obj.storeId = _item.storeId;
        obj.storeName = _item.name;
        obj.storeTitle = _item.name;
        obj.storeUp = _item.favorite;
        obj.device = _item.device;

        self.getChannelByStore(_item);
        if (_item.favorite) {
          obj.storeUpTitle = this.$t('remotePatrol.stared');
        } else {
          obj.storeUpTitle = this.$t('remotePatrol.clickToStar');
        }
        self.store = obj;
        let curStoreId = '';
        curStoreId = _item.storeId;
        const storeObj = {
          storeId: curStoreId
        };
        self.saveStoreObj(storeObj);
        if(self.backSheetGroup !=null){
          self.changeInspectList(self.curInspectId); //抓整個全新的巡檢項目,在做分數、附件更新
        }
      }
      else{
        const obj = {};
        obj.storeId = "";
        obj.storeName ="";
        obj.storeTitle = "";
        obj.storeUp = "";
        obj.device = [];
        self.saveStoreObj(obj);
      }

    },
    changeBrand() {
      const self = this;
      !self.showGuide && this.$refs.vendorVideo.stopVideoPlay();
      self.patrolStoreName = null;
      self.activeIndex = '0';
      self.PatrolList = [];
      self.patrolstore = '';
      self.inspectList = [];
      self.inspectItemList = [];
      self.store = '';
      self.showStoreUp = false;
      self.showGuide = true;
      self.eventList = [];
      self.sheetName = [];
      self.tempArr = [];
      self.hasIgnoretemp = null;
      this.showIgnoreItem = false;
      this.$emit("listenerChild", false);
      self.isShowWarn = false;
      self.notShowAlert = false;
      self.showFeedBackInfo = true;
      self.accountId = localStorage.getItem('oss_bucket');
      self.showChannelBtns = [];
      self.showError = false;
      self.errorText = '';
      self.getAllStore();
    },
    anchorLinkTo() {
      const self = this;
      if (document.getElementById('inspectContent') != null) {
        if (self.$refs['myScrollbar'] != undefined) {
          self.$refs['myScrollbar'].wrap.scrollTop = document.getElementById('inspectContent').offsetTop;
        }
      }
    },
    getAccountId() {
      const self = this;
      const userId = getCookie('UserId');
      self.userId = userId;
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          res.data.forEach(item => {
            if (item.userId == userId) {
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
      await self.getAccountId();
      self.accountId = localStorage.getItem('oss_bucket');
    },
    getUpLoadBucketInfo() {
      const self = this;
      self.bucketVideo = 'video' + '/' + util.getCurDate2Str();
      self.bucketImage = 'image' + '/' + util.getCurDate2Str();
    },
    getFileUrl(fileName) {
      const self = this;
      const bucketName = 'viumo-n3azju2aknpw';
      const endpoint = self.oss.ossEndPoint;
      const url = `http://${bucketName}.${endpoint}/${fileName}`;
      return url;
    },

    deleteEvent(item, index) {
      this.eventList.splice(index, 1);
      this.showFeedBackInfo = this.eventList.length == 0;
    },

    addFeedBack() {
      this.feedbackIndex = -1;
      this.showAddTextFeedbackDialog = true;
      this.eventName = '';
      this.eventDes = '';
      this.feedbackInput = '';
      this.showEventNameInfo = false;
      this.feedbackSourceList = [];
    },

    confirmAddFeedBack2() {
      if (this.eventName.trim().length === 0) {
        this.showEventNameInfo = true;
        return false;
      }
      if(this.feedbackIndex === -1){
        let srcObj = null;
        const src = this.canvasEl.toDataURL('image/jpeg');
        srcObj = {
          mediaType: 2,
          src: src,
          height: '100px',
          width: '140px',
          fileName: `${this.bucketImage}/inspect_${util.getCurTimeStr()}_${this.store.storeId}_${this.curItemId}.jpg`,
          file: util.base64ToBlob(src),
          deviceId: this.channel.id,
          hasUrl : false
        };

        const obj = {
          id:-1,
          eventName: this.eventName,
          eventDes: this.eventDes,
          sourceObj: srcObj,
          sourceList: this.feedbackSourceList,
          showDelBtn:true
        };
        this.eventList.push(obj);
      } else {
        this.eventList[this.feedbackIndex].eventName = this.eventName;
        this.eventList[this.feedbackIndex].sourceList = this.feedbackSourceList;
        this.eventList[this.feedbackIndex].showDelBtn = true;
        // this.eventList[this.feedbackIndex].eventDes = this.eventDes;
      }
      this.showFeedDialog2 = false;
      this.showFeedBackInfo = false;
    },

    confirmAddTextFeedback() {
      if(this.feedbackIndex == -1){
        const obj = {
          id:-1,
          eventName: this.eventName,
          eventDes: this.eventDes,
          sourceObj: null,
          sourceList: this.feedbackSourceList,
          showDelBtn:true
        };
        if (this.eventName.trim().length == 0) {
          this.showEventNameInfo = true;
          return false;
        }
        this.eventList.push(obj);
      } else {
        this.eventList[this.feedbackIndex].eventName = this.eventName;
        this.eventList[this.feedbackIndex].sourceList = this.feedbackSourceList;
        this.eventList[this.feedbackIndex].showDelBtn = true;
      }
      this.showAddTextFeedbackDialog = false;
      this.showFeedBackInfo = false;
    },

    getIndexById(id) {
      const self = this;
      let tempId = null;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);

        sheetName.forEach((s_item, s_index) => {
          s_item.inspectList[0].items.forEach((item, index) => {
            if (item.id === id) {
              tempId = {
                groupIndex: s_index,
                itemIndex: index
              };
            }
          });
        });

      return tempId;
    },
    getChannelIndexById(id) {
      const self = this;
      let curIndex = 0;
      self.channelBtns.forEach((item, index) => {
        if (item.id == id) {
          curIndex = index;
        }
      });
      return curIndex;
    },
    upLoadFile(fileItem) {
      const self = this;
      self.percentage = 0;
      const OSS = require('ali-oss');
      const bucketName = 'viumo-n3azju2aknpw';
      const client = new OSS({
        region: self.oss.ossEndPoint.slice(0, self.oss.ossEndPoint.indexOf('.')),
        accessKeyId: self.oss.ossAccessKeyId,
        accessKeySecret: self.oss.ossAccessKeySecret,
        // bucket: 'viumo-'+self.accountId
        bucket: bucketName
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
            console.log(err);
          });
      });
    },

    checkIgnoreScore(item, itemDS, e, index) {
      const self = this;
      item.manualIgnore = false;
      self.curhasIgnoreItem = index;
      item.scoreList.forEach(s_item => {
        s_item.val === itemDS.val ? s_item.isClick = true : s_item.isClick = false;
      });
      if (e === 0) {
        if (item.type === 2) {
          if (item.itemScore < 0) {
            item.itemgetScore = itemDS.val === -1 ? item.itemScore : 0;
          } else {
            item.itemgetScore = itemDS.val === item.itemScore ? item.itemScore : 0;
          }
        } else {
          item.itemgetScore = itemDS.val === -1 ? 0 : item.itemScore;
        }
        item.isQualified = !(itemDS.val === -1);
        item.itemScoreTitle = itemDS.scoreTitle;
      } else {
        item.itemgetScore = itemDS;
        item.itemScoreTitle = itemDS;
      }
      item.dealCount = item.Effective = item.inputCount = 1;
    },

    checkScore({item, itemDS, index, e}) {
      this.curItem = {...item};
      this.curItemIndex = index
      this.curItemId = item.id;
      item.disabled = false;
      const self = this;
      item.scoreList.forEach(s_item => {
        s_item.val === itemDS.val ? s_item.isClick = true : s_item.isClick = false;
      });
      if (self.$refs.vendorVideo) self.$refs.vendorVideo.editCount++;
      if (e === 0) {
        if (item.groupType === 2) {
          if (item.itemScore < 0) {
            item.itemgetScore = itemDS.val === -1 ? item.itemScore : 0;
          } else {
            item.itemgetScore = itemDS.val === item.itemScore ? item.itemScore : 0;
          }
        } else {
          item.itemgetScore = itemDS.val === -1 ? 0 : item.itemScore;
        }
        item.isQualified = !(itemDS.val === -1);
        item.itemScoreTitle = itemDS.scoreTitle;
      } else {
        item.itemgetScore = itemDS;
        item.itemScoreTitle = itemDS;
      }
      if (item.itemScoreTitle !== '--') {
        self.sheetName[self.curSheetIndex].inspectList.forEach((inspect, idx) => {
          inspect.items.forEach((item_,itemIdx) => {
            if (item_.id === self.curItemId) {
              self.curGroupIndex = idx;
              self.curItemIndex = itemIdx;
            }
          })
        })
        if (!item.manualIgnore && self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount === 0) {
          this.editCount++;
          this.$store.dispatch('setEditCount', this.editCount);
          self.sheetName[self.curSheetIndex].dealCount++;
          self.sheetName[self.curSheetIndex].Effective++;
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].dealCount++;
          self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].Effective++;
        }
        self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount++;
      }
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = JSON.parse(JSON.stringify(self.sheetName.slice(0, indexFeed)));
      self.isDisabled = sheetName.some(item => item.Effective !== 0);
      self.isShowWarn = self.isDisabled && sheetName.some(item => item.Effective !== item.count);
      const hasIgnoretemp = [];
      sheetName.forEach(s_item => {
        s_item.inspectList.forEach(item => {
          item.items.forEach((_item, _index) => {
            if (_item.inputCount === 0 && !_item.manualIgnore) {
              hasIgnoretemp.push(_item);
            }
          });
        });
      });
      hasIgnoretemp.length === 0 ? self.notShowAlert = true : null;
    },

    getAllStoreList() {
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      if(PermissionHelper.enableMimicMode){
        return new Promise((resolve, reject) => {
          ListMysteryModeStoreInfo().then(res => {
            resolve(res);
          });
        });

      }else{
        return new Promise((resolve, reject) => {
          getStoreList(params).then(res => {
            resolve(res);
          });
        });
      }
    },
    saveStoreObj(storeObj) {
      const self = this;
      const key = 'recentStore_reinspect' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      temp.forEach((item, index) => {
        if (item.userId == storeObj.userId && item.storeId == storeObj.storeId) {
          temp.splice(index, 1);
        }
      });
      temp.unshift(storeObj);
      temp = temp.slice(0, 3);
      localStorage.setItem(key, JSON.stringify(temp));
    },
    getStoreObj() {
      const self = this;
      const key = 'recentStore_reinspect' + '_' + self.accountId + '_' + self.userId;
      let temp = [];
      const tempArray = [];
      if (localStorage.getItem(key) != null || localStorage.getItem(key) != undefined) {
        temp = JSON.parse(localStorage.getItem(key));
      }
      let indexArray = [];
      temp.forEach((item, index) => {
        indexArray.push(self.allInitStoreList.map(x => x.storeId).indexOf(item.storeId));
      });
      indexArray = indexArray.filter(function(x) {
        return x != -1;
      });
      indexArray.forEach(item => {
        tempArray.push(self.allInitStoreList[item]);
      });
      return tempArray;
    },
    async getStoreList_() {
      const self = this;
      const getStoreTemp = data => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
          if (self.store.storeId == item.storeId) {
            obj.isActive = true;
          } else {
            obj.isActive = false;
          }
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          obj.status = item.status;
          if (item.authorizedInspect.length != 0) {
            const remoteInspectList = item.authorizedInspect.filter(inspcetItem => inspcetItem.mode === 0);
            if(remoteInspectList.length > 0){
              obj.authorizedInspect = item.authorizedInspect;
              obj.hasInspect = true;
            } else {
              obj.hasInspect = false;
            }

          } else {
            obj.hasInspect = false;
          }
          temp.push(obj);
        });
        return temp;
      };
      let data;
      data = self.getStoreObj();
      this.storeList = getStoreTemp(data);
    },
    async getStoreList() {
      const self = this;
      const getStoreTemp = data => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
          if (self.store.storeId == item.storeId) {
            obj.isActive = true;
          } else {
            obj.isActive = false;
          }
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          obj.status = item.status;
          if (item.authorizedInspect.length != 0) {
            const remoteInspectList = item.authorizedInspect.filter(inspcetItem => inspcetItem.mode === 0);
            if(remoteInspectList.length > 0){
              obj.authorizedInspect = item.authorizedInspect;
              obj.hasInspect = true;
            } else {
              obj.hasInspect = false;
            }

          } else {
            obj.hasInspect = false;
          }
          temp.push(obj);
        });
        return temp;
      };
      let data;
      switch (Number(self.activeIndex)) {
        case 0:
          const favoriteStoreList = self.allInitStoreList.filter(store => store.favorite === true);
          self.tabList[0].storeList = getStoreTemp(favoriteStoreList);
          break;
        case 1:
          data = self.getStoreObj();
          self.tabList[1].storeList = getStoreTemp(data);
          break;
        case 2:
          self.tabList[2].storeList.forEach((item, index) => {
            item.storeList.forEach(_item => {
              if (_item.storeId == self.store.storeId) {
                _item.isActive = true;
              } else {
                _item.isActive = false;
              }
            });
          });
          break;
      }
    },

    changeInspect(val) {
      const self = this;

      sessionStorage.setItem('inspectId', JSON.stringify(val))
      // console.log(self.$refs.vendorVideo && self.$refs.vendorVideo.editCount > 0, self.$store.getters.PatrolHistory != null)
      if (self.$store.getters.editCount > 0) {
        self.changeInspectObj.dialogCosed = true;
        self.beforepatrolstore = val;
      } if(self.isEditReport){
        self.EditRptchangeInspectObj.dialogCosed = true;
        self.beforepatrolstore = val;
      }else {
        self.changeInspectList(val);
      }
    },

    changeInspectList(val) {
      console.log('changeInspectList :::::::::>> ');
      console.log('val :::::::::>> ', val);

      const self = this;
      if (!self.showGuide && self.$refs.vendorVideo) {
        self.$refs.vendorVideo.editCount = 0;
        //console.log("vendorVideo:",self.$refs.vendorVideo);
        //self.$refs.vendorVideo.stopVideoPlay();
      };
      self.isDisabled = false;
      self.hasIgnoretemp = [];
      self.tempArr = [];
      this.editCount = 0;
      this.$store.dispatch('setEditCount', this.editCount);
      self.$store.dispatch('setPatrolHistory', null);
      self.$store.dispatch('setPatrolComment', null);
      Database.addDataToDB(self.userId, {data: {}, rule: {}});
      self.isShowWarn = false;
      self.notShowAlert = false;
      this.showIgnoreItem = false;
      this.$emit("listenerChild", false);
      self.eventList = [];
      // self.showChannelBtns = [];
      self.curSheetIndex = 0;
      self.curSheet = {};
      self.PatrolList.forEach(item => {
        if (item.id == val) {
          self.patrolstore = item.name;
        }
      });
      const params = {
        storeId: self.store.storeId,
        mode: 0,
        authorizedOnly: this.enableMimicMode?0:1,
        // tagName: self.patrolstore,
        inspectId: val,
        isMysteryMode:this.enableMimicMode
      };
      self.inspectItemList = [];
      checkOutInspectItemV3(params).then(res => {
        if (res.errCode == 0) {
          const data = res.data.groups;
          const inspectSettings = {};

          console.log('res.data :::::::::::::::::>> ', res.data);

          res.data.inspectSettings.forEach(item => {
            switch (item.name) {
              case 'includedInTotalScoreWithType1':
                inspectSettings.includedInTotalScoreWithType1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType1':
                inspectSettings.qualifiedForIgnoredWithType1 = item.value;
                break;
              case 'qualifiedForIgnoredWithType2':
                inspectSettings.qualifiedForIgnoredWithType2 = item.value;
                break;
              case 'hundredMarkType':
                inspectSettings.hundredMarkType = item.value.toString();
                break;
              case 'minScore':
                inspectSettings.minScore = item.value;
                break;
              case 'maxScore':
                inspectSettings.maxScore = item.value;
                break;
              case 'dangerousOnFailedItem':
                inspectSettings.dangerousOnFailedItem = item.value;
                break;
              case 'baseScore':
                inspectSettings.baseScore = item.value;
                break;
              case 'itemOptionsForType1':
                inspectSettings.itemOptionsForType1 = item.value;
                this.itemOptionsForType1 = item.value;
                break;
              case 'itemOptionsForType3':
                inspectSettings.itemOptionsForType3 = item.value;
                this.itemOptionsForType3 = item.value;
                break;
              case 'workflow':
                inspectSettings.workflowInfo = item.value;
                break;
              default:
                break;
            }
          });
          sessionStorage.setItem('inspectSettings', JSON.stringify(inspectSettings));
          sessionStorage.setItem('uuid', res.data.uuid);
          self.isBindWorkflow = res.data.isBindWorkflow;
          sessionStorage.setItem('isBindWorkflow', res.data.isBindWorkflow);
          this.checkIfAllItemsAreRemark(data);
          const temp = [];
          data.forEach((item, index) => {
            const obj = {};
            obj.groupId = item.groupId;
            obj.weight = item.weight;
            obj.mode = item.mode;
            obj.type = item.type;
            obj.groupName = item.groupName;
            obj.dealCount = 0;
            obj.count = item.items.length;
            obj.Effective = 0;
            obj.isHover = false;
            obj.parentId = item.parentId;
            obj.lastUnqualifiedNumber = item.lastUnqualifiedNumber;
            obj.groupScore = item.groupScore;
            obj.isAdvanced = item.isAdvanced;
            if (index == 0) {
              obj.isClick = true;
            } else {
              obj.isClick = false;
            }
            const btnNameArr = this.getTab1AndTab3BtnName(obj.type);
            const tempItems = [];
            item.items.forEach((_item, _index) => {
              const itemObj = {};
              itemObj.id = _item.id;
              itemObj.weight = item.weight;
              itemObj.groupId = item.groupId;
              itemObj.groupName = item.groupName;
              itemObj.groupScore = item.groupScore;
              itemObj.isAdvanced = item.isAdvanced;
              itemObj.subject = _item.subject;
              itemObj.description = _item.description;
              itemObj.itemScore = _item.itemScore;
              itemObj.required = _item.required;
              itemObj.isImportant = _item.isImportant;

              let itemScoreLength = [];
              if (_item.availableScores.length !== 0) {
                itemScoreLength = _item.availableScores;
              } else {
                for (let i = 0; i < _item.itemScore + 1; i++) {
                  itemScoreLength.push(i);
                }
              }
              itemScoreLength.sort((a, b) => {
                return a - b;
              });
              itemObj.itemScoreLength = itemScoreLength.reverse();
              itemObj.itemgetScore = '--';
              itemObj.isQualified = false;
              itemObj.qualifiedScore = _item.qualifiedScore;
              itemObj.type = item.type;
              itemObj.itemScoreTitle = '--';
              // itemObj.deviceId=_item.deviceId;
              itemObj.deviceId = _item.deviceIds;
              itemObj.inspectInput = '';
              itemObj.inputCount = 0;
              itemObj.disabled = true;
              itemObj.checked = false;
              itemObj.isIgnore = false;
              itemObj.Ruletip = false;
              itemObj.RuleCountTip = false;
              itemObj.manualIgnore = false;
              itemObj.notEdit = false;
              itemObj.sourceList = [];
              itemObj.groupType = item.type;
              itemObj.lastUnqualifiedNumber = _item.lastUnqualifiedNumber;
              itemObj.scoreList = [
                {val: _item.itemScore, scoreTitle: btnNameArr[0], isClick: false},
                {val: -1, scoreTitle: btnNameArr[1], isClick: false}
                ];
              itemObj.itemType = _item.type;

              // 處理備註標籤
              itemObj.memo_is_advanced = _item.memo_is_advanced
              itemObj.memo_options = _item.memo_options
              itemObj.memo_config = _item.memo_config

              tempItems.push(itemObj);
            });
            obj.items = tempItems;
            temp.push(obj);
          });
          const te_temp = [];

          const treeData = temp.filter(item => item.parentId === -1);
          let handleData = [];
          treeData.forEach(item => {
            let obj = {};
            obj.cateray = item;
            obj.subcatergy = [];
            temp.forEach(totalData => {
              if(item.groupId === totalData.parentId){
                obj.subcatergy.push(totalData);
              }
            })
            handleData.push(obj);
          })

          console.log('handleData :::::::::::::::::>> ', handleData);

          for (let i = 0; i < handleData.length; i++) {
            let count = 0, label = '';
            if (handleData[i].subcatergy.length === 0){
              count = handleData[i].cateray.items.length;
              te_temp.push({
                inspectList: [handleData[i].cateray],
                dealCount: 0,
                Effective: 0,
                count: count,
                isClick: false,
                label: handleData[i].cateray.groupName,
                type: handleData[i].cateray.type,
                isCategory: false,
                weight: handleData[i].cateray.weight
              });
            } else {
              handleData[i].subcatergy.forEach(item => count += item.items.length);
              te_temp.push({
                inspectList: handleData[i].subcatergy,
                dealCount: 0,
                Effective: 0,
                count: count,
                isClick: false,
                label: handleData[i].cateray.groupName,
                type: handleData[i].cateray.type,
                isCategory: true,
                weight: handleData[i].cateray.weight
              });
            }
          }
          self.sheetName = te_temp.sort((a, b) => {return a.type - b.type});
          self.sheetName[0].isClick = true;
          const isCategory = self.sheetName[0].isCategory;
          self.inspectList = isCategory ? self.sheetName[0].inspectList : self.sheetName[0].inspectList;
          //bug
          const feedobj = {
            groupId: 'feedBack',
            label: self.$t('remotePatrol.feedbacks'),
            isClick: false,
            isCategory: true};
          if (self.sheetName.length != 0) {
            self.sheetName.push(feedobj);
            self.getItemByGroup(self.sheetName[0].inspectList[0], 0);
          }
          if(self.backSheetGroup!=null && self.isEditReport){
            const BackPatrolParam = self.$store.getters.BackPatrolParam;
            self.eventList = BackPatrolParam.eventList;
            self.showFeedBackInfo = self.eventList.length == 0;
            self.showFeedBack = false;
            self.doFillHisScorData();
            if(self.eventList.length >0) self.doFillFeedBackData();
          }
        }
      })
    },
    doFillFeedBackData(){
      this.eventList.map(event=>{
        if(!this.auditCancelable){//不能取消的簽核，不能刪除反饋
          event['showDelBtn'] = false;
        }else{
          event['showDelBtn'] = true;
        }
      });
      console.log("self.eventList:",this.eventList);
    },
    doFillHisScorData(){ //報告編輯狀態，取得個項目分數和附件
      const self = this;
      var hisData = self.backSheetGroup;
      //sheet 1
      Promise.all(
      this.sheetName.map( sheet =>{
        sheet.Effective = 1;
        console.log("sheet:",sheet);
        if(sheet.groupId!="feedBack"){

          var tabIncep = hisData.find( hd => hd.groupName==sheet.label );
          console.log("tabIncep:",tabIncep);
          if(tabIncep.children){//有三層時的第二層 對應sheet.inspectList
            var secSheetCat = sheet.inspectList;
            for(var secCatIdx in tabIncep.children){
                var secCat = tabIncep.children[secCatIdx];
                var childIdx = 0;
                //console.log("secCat:",secCat);

                //console.log("secSheetCat:",secSheetCat);
                var sheetItem = secSheetCat.find((sec,idx) => {
                  if(sec.groupId==secCat.groupId){
                      childIdx = idx;
                      return sec;
                  }
                });
                //console.log("sheetItem:",sheetItem);
                var dealCount=0;
                sheet.inspectList[childIdx].items = this.doGetcateryItems(sheetItem.items,secCat.cateryItems,sheetItem.type);
                sheet.inspectList[childIdx].items.forEach(it=>{
                  dealCount += it.inputCount;
                  it.isIgnore = false;
                });
                console.log("1.dealCount:",dealCount);
                sheet.inspectList[childIdx].dealCount = dealCount;
            }
            sheet.dealCount = dealCount;
          }else{
            var secSheetCat = sheet.inspectList;
            var childIdx = 0;
            var sheetItem = secSheetCat.find((sec,idx) => {
              if(sec.groupId==tabIncep.groupId){
                  childIdx = idx;
                  return sec;
              }
            });
            var dealCount=0;
            sheet.inspectList[childIdx].items = this.doGetcateryItems(sheetItem.items,tabIncep.cateryItems,sheetItem.type);
            sheet.inspectList[childIdx].items.forEach(it=>{
                  dealCount += it.inputCount;
                  it.isIgnore = false;
            });
            console.log("2.dealCount:",dealCount);
            sheet.inspectList[childIdx].dealCount = dealCount;
          }
          sheet.dealCount = dealCount;
          this.editCount = dealCount;
          this.$store.dispatch('setEditCount', this.editCount);
        }
      })
      ).then(result =>{
        self.isDisabled = true;
        //console.log("2.this.sheetName:",this.sheetName)
      });
    },
    doGetcateryItems(sheetItem,cateryItems,type){ //type:0:合格率評分 1:巡檢評分項 2:附加評分項
      var dealCount=0;

      for(let i=0; i<cateryItems.length; i++){
        var showDelBtn = true;
        sheetItem[i].id = cateryItems[i].itemId;
        if(cateryItems[i].grade===-2147483648){ //略過項
          sheetItem[i].itemScoreTitle="--";
          sheetItem[i].isIgnore = true;
        }else if(type!=1){
          let scoreIdx = (cateryItems[i].grade==1) ? 0:1;
          sheetItem[i].itemScoreTitle=sheetItem[i].scoreList[scoreIdx].scoreTitle;
          if(type == 2){
            if(sheetItem[i].itemScore<0){
              sheetItem[i].itemgetScore=(cateryItems[i].grade==1)?0:sheetItem[i].itemScore;
            }else{
              sheetItem[i].itemgetScore=(cateryItems[i].grade==1)?sheetItem[i].itemScore:0;
            }
          }else{
            sheetItem[i].itemgetScore=(cateryItems[i].grade==1)?sheetItem[i].itemScore:0;
          }
          sheetItem[i].scoreList[scoreIdx].isClick = true;
          sheetItem[i].isQualified = (cateryItems[i].grade==1) ? true:false;
          sheetItem[i].inputCount++;
          //dealCount++;
          if(!this.auditCancelable && cateryItems[i].grade==0){//不能取消且不合格，不能編輯
            console.log("不能取消，不能編輯不合格項");
            sheetItem[i].notEdit = true;
            dealCount++;
            showDelBtn = false;
          }
          console.log("sheetItem[i]",sheetItem[i]);
        }else{
          sheetItem[i].itemScoreTitle=cateryItems[i].grade;
          sheetItem[i].itemgetScore=cateryItems[i].grade;
          sheetItem[i].inputCount++;
          if(!this.auditCancelable && cateryItems[i].grade<cateryItems[i].qualifiedScore) {
            sheetItem[i].notEdit = true;
            showDelBtn = false;
            dealCount++;
          }
        }
        if(cateryItems[i].showAttachment){
          sheetItem[i].dealCount++;
          dealCount++;
          var att=[];
          for(let x=0;x<cateryItems[i].descriptionList.length;x++){
            var desItem = cateryItems[i].descriptionList[x];
            var desObj = {
              mediaType:3,
              src:desItem.description,
              showDelBtn :showDelBtn
            }
            att.push(desObj);
          }
          for(let j=0; j<cateryItems[i].sourceList.length;j++){
            var attItem = cateryItems[i].sourceList[j];
              var fileName = attItem.url.substring(attItem.url.lastIndexOf('/')+1);
              var attFile ={
                  mediaType:attItem.mediaType,
                  src:attItem.url,
                  height:'100px',
                  width:'140px',
                  fileName:fileName,
                  deviceId:attItem.deviceId,
                  hasUrl:true,
                  showDelBtn :showDelBtn
                }
              att.push(attFile);
          }
          //console.log("sourceList:",attFile);
          sheetItem[i].sourceList = att;
        }
      }
      console.log("*after fill sheetItem:",sheetItem);
      return sheetItem;
    },
    changeStoreDialog() {
      this.changeStoreObj.dialogCosed = false;
      const storeItem = this.storeList.find(store => store.storeId === this.curSelStoreId);
      this.changeStore_(storeItem);
      this.editCount = 0;
      this.$store.dispatch('setEditCount', this.editCount);
    },
    onStoreChange (storeData) {
      this.curSelStoreId = storeData.curSelectedStore
      const storeItem = this.storeList.find(store => store.storeId === this.curSelStoreId);
      if(storeItem && storeItem.status == 61){
          util.notify(this.$t('route.errorStoreNoPermission'), 'error', 1000 );
      }
      if (!this.$store.getters.storeCache && !this.isEditReport) {
        this.changeStore_(storeItem);
      } else {
        this.$store.dispatch('setStoreCache', '');
      }

    },
    async getAllStore () {
      const self = this;
      const getStoreTemp = data => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          obj.isActive = false;
          obj.status = item.status;
          if (item.authorizedInspect.length != 0) {
            obj.authorizedInspect = item.authorizedInspect;
            obj.hasInspect = true;
            if (index == 0) {
              obj.isActive = true;
            }
          } else {
            obj.hasInspect = false;
          }
          temp.push(obj);
        });
        return temp;
      };
      const allStoreData = await self.getAllStoreList();
      console.log("allStoreData:",allStoreData);
      if (allStoreData.errCode === 0) {
        self.getInitStoreData(allStoreData);
        const storeData = (PermissionHelper.enableMimicMode)?allStoreData.data:allStoreData.data.content;
        self.storeList = getStoreTemp(storeData);
        const storeItem = self.storeList.find(store => store.storeId === self.curSelStoreId)
        self.changeStore_(storeItem);
      }
    },
    async getFaStoreData() {
      const self = this;
      const getStoreTemp = data => {
        const temp = [];
        data.forEach((item, index) => {
          const obj = {};
          obj.storeId = item.storeId;
          obj.name = item.name;
          obj.userId = item.userId;
          obj.favorite = item.favorite == undefined ? true : item.favorite;
          obj.device = item.device;
          obj.isActive = false;
          obj.status = item.status;
          if (item.authorizedInspect.length != 0) {
            obj.authorizedInspect = item.authorizedInspect;
            obj.hasInspect = true;
            if (index == 0) {
              obj.isActive = true;
            }
          } else {
            obj.hasInspect = false;
          }
          temp.push(obj);
        });
        return temp;
      };
      const allStoreData = await self.getAllStoreList();
      if (allStoreData.errCode === 0) {
        self.getInitStoreData(allStoreData);
        var allStores =  (PermissionHelper.enableMimicMode)?data.data:data.data.content;
        const storeData = allStores.filter(store => store.favorite === true);
        self.tabList[0].storeList = getStoreTemp(storeData);
        if (storeData.length === 0) {
          self.showStoreUp = false;
          self.inspectList = [];
        } else {
          if (storeData[0].authorizedInspect.length !== 0) {
            if (!util.validateLicense(storeData[0].status)) {
              return false;
            }
            const obj = {};
            obj.storeId = storeData[0].storeId;
            obj.storeName = storeData[0].name;
            obj.storeTitle = storeData[0].name;
            obj.storeUp = true;
            obj.storeUpTitle = this.$t('remotePatrol.stared');
            obj.status = storeData[0].status;
            self.store = obj;
            self.showStoreUp = true;
            if (!util.validateLicense(storeData[0].status)) {
              return false;
            }
            const curStoreId = storeData[0].storeId;
            const storeObj = {
              storeId: curStoreId
            };
            self.patrolStoreName = storeData[0].name;
            storeData[0].authorizedInspect.forEach(au_item => {
              if (au_item.mode == 0) {
                self.PatrolList.push(au_item);
              }
            });
            self.saveStoreObj(storeObj);
            self.deviceList = storeData[0].device;
            self.getChannelByStore(self.tabList[0].storeList[0]);
          } else {
            self.showStoreUp = false;
          }
        }
      }
    },
    async getInitStoreData(data) {
      const self = this;
      const getStore2Temp = data => {
        const cityList = [];
        data.forEach(item => {
          if (cityList.map(x => x.city).indexOf(item.city) == -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city == data[j].city) {
              const obj = {};
              obj.isActive = false;
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite = data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              obj.status = data[j].status;
              if (data[j].authorizedInspect.length != 0) {
                obj.authorizedInspect = data[j].authorizedInspect;
                obj.hasInspect = true;
              } else {
                obj.hasInspect = false;
              }
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      if (data.errCode == 0) {
        const storeData = (PermissionHelper.enableMimicMode)?data.data:data.data.content;
        self.allInitStoreList = storeData;
        if (storeData.length == 0) {
          self.tabList[2].storeList = [];
          self.tempStoreList = [];
        } else {
          self.tabList[2].storeList = getStore2Temp(storeData);
          self.tempStoreList = getStore2Temp(storeData);
        }
      }
    },
    async handleClick(tab) {
      const self = this;
      const allStoreData = await self.getAllStoreList();
      self.getInitStoreData(allStoreData);
      self.getStoreList();
    },
    addStoreUp() {
      const self = this;
      const temp = [];
      temp.push(self.store.storeId);
      const params = {
        storeIds: temp
      };
      if (!self.store.storeUp) {
        addFavoriteStore(params).then(res => {
          if (res.errCode == 0) {
            self.store.storeUp = true;
            self.store.storeUpTitle = this.$t('remotePatrol.stared');
            self.tabList[2].storeList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = true;
                }
              });
            });
            self.tempStoreList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = true;
                }
              });
            });
            self.allInitStoreList.forEach((item, index) => {
              if (self.store.storeId == item.storeId) {
                item.favorite = true;
              }
            });
            self.getStoreList_();
          }
        });
      } else {
        deleteFavoriteStore(params).then(res => {
          if (res.errCode == 0) {
            self.store.storeUp = false;
            self.store.storeUpTitle = this.$t('remotePatrol.clickToStar');
            self.tabList[2].storeList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = false;
                }
              });
            });
            self.tempStoreList.forEach((item, index) => {
              item.storeList.forEach((_item, _index) => {
                if (self.store.storeId == _item.storeId) {
                  _item.favorite = false;
                }
              });
            });
            self.allInitStoreList.forEach((item, index) => {
              if (self.store.storeId == item.storeId) {
                item.favorite = false;
              }
            });
            self.getStoreList_();
          }
        });
      }
    },
    mouseoverGroup(item, index) {
      item.isHover = true;
    },
    mouseoutGroup(item, index) {
      item.isHover = false;
    },
    getItemByGroup(item, index) {
      const self = this;
      self.curGroupIndex = index;
      self.curGroup = item;
      self.curItemIndex = 0;
      self.inspectItemList = item.items;
      self.showFeedBack = false;
      self.hideNext = false;
      self.hideLast = false;
      self.channelBtns = [];
      this.groupType = item.type;
      this.isCategory = true;
      item.isClick = true;
      this.$nextTick(() => {
        self.anchorLinkTo();
      });
      self.inspectList.forEach((_item, _index) => {
        if (index != _index) {
          _item.isClick = false;
        }
      });
    },

    getDeviceById(deviceId) {
      const self = this;
      const device = [];
      self.deviceList.forEach(item => {
        deviceId.forEach(_item => {
          if (_item == item.id) {
            device.push(item);
          }
        });
      });
      return device;
    },

    getImgList({index, sourceList}) {
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

    deleteImg({item, index}) {
      const self = this;
      item.sourceList.splice(index, 1);
      self.sourceListLength--;

      self.sheetName[self.curSheetIndex].inspectList.forEach((inspect, idx) => {
        inspect.items.forEach(item_ => {
          if (item_.id === item.id) self.curGroupIndex = idx
        })
      })
      if(self.sourceListLength === 0 && item.itemType === 1 && item.inspectInput.length === 0){
        self.sheetName[self.curSheetIndex].dealCount != 0 ? self.sheetName[self.curSheetIndex].dealCount-- : null;
        this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].items[this.curItemIndex].inputCount = 0;
      }
    },

    handleIgnore() {
      const self = this;
      self.curItem.manualIgnore = true;
      self.curItem.disabled = true;

        self.showGuide = false;

        self.sheetName[self.curSheetIndex].inspectList.forEach((inspect, idx) => {
          inspect.items.forEach(item_ => {
            if (item_.id === self.curItemId) self.curGroupIndex = idx
          })
        })
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount != 0
          && self.sheetName[self.curSheetIndex].Effective != 0) {
          self.sheetName[self.curSheetIndex].Effective--;
        }
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount == 0) {
          this.sheetName[this.curSheetIndex].dealCount++
          this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].dealCount++
          this.editCount++;
          this.$store.dispatch('setEditCount', this.editCount);
        }
        if (self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].manualIgnore) {
            self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inspectInput = '';
            // self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList = [];
            self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].itemScoreTitle = '--';
            self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].inputCount = 0;
            self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].scoreList.forEach(x => {
              x.isClick = false;
            });

        const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
        const sheetName = JSON.parse(JSON.stringify(self.sheetName.slice(0, indexFeed)));
        const hasIgnoretemp = [];
        let count = 0, manualCount = 0;
        sheetName.forEach(s_item => {
          count += s_item.count;
          s_item.inspectList.forEach(item => {
            item.items.forEach((_item, _index) => {
              _item.manualIgnore ? manualCount++ : null;
              if (_item.inputCount == 0 && !_item.manualIgnore) {
                _item.ignore = true;
             //   hasIgnoretemp.push(_item);
              }
            });
          });
        });
        if (count !== manualCount) {
          hasIgnoretemp.length == 0 ? self.notShowAlert = true : null;
        }else{
          self.notShowAlert = false;
        }
        self.isDisabled = sheetName.some(item => item.Effective !== 0);
        self.isDisabled ? self.isShowWarn = true : self.isShowWarn = false;
      }
    },

    cancleIgnore() {
      const self = this;
      self.curItem.manualIgnore = false;
      self.sheetName[self.curSheetIndex].dealCount--
      this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].dealCount--
      // if (self.sheetName[self.curSheetIndex].dealCount != 0) {

      // }
      self.notShowAlert ? self.notShowAlert = false : null;

    },
    cancelIgnoreInspect(val) {
      const self = this;
      self.ignoreInspectObj.dialogCosed = false;
    },
    IgnoreInspect() {
      const self = this;
      self.CancleIgnoreInspectObj.dialogCosed = false;
    },
    ignoreItem({item, index, e}) {
      //console.log("item:",item);
      //console.log(" index:", index);
      const self = this;
      self.curItemIndex = index;
      self.sheetName[self.curSheetIndex].inspectList.forEach((inspect, idx) => {
        inspect.items.forEach((item_,itemIdx) => {
          if (item_.id === item.id) {
            self.curGroupIndex = idx;
            self.curItemIndex = itemIdx;
          }
        })
      })
      console.log(self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex]);
      self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].checked = false;
      self.sheetName[self.curSheetIndex].inspectList[self.curGroupIndex].items[self.curItemIndex].disabled = false;

      if (self.$refs.vendorVideo) self.$refs.vendorVideo.editCount++;
      //self.curItemIndex = index;
      self.curItem = item;
      if (item.deviceId === -1) {
        self.noBindDeviceObj.dialogCosed = true;
        return false;
      }
      // self.$refs.vendorVideo.stopVideoPlay();
      self.handleIgnore();
    },
    CancleIgnoreItem({item, index}) {
      const self = this;
      if (self.$refs.vendorVideo) self.$refs.vendorVideo.editCount--;
      self.curItemIndex = index;
      self.curItem = item;
      self.cancleIgnore();
    },
    noBindDeviceDialog(val) {
      const self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },
    canceldNoBind(val) {
      const self = this;
      self.noBindDeviceObj.dialogCosed = false;
    },

    clickBtn(item, index) {
      const self = this;
      const obj = {
        id: item.id,
        channelId: item.channelId,
        ivsId: item.ivsId,
        channelName: item.name,
        vendor: item.vendor
      };
      self.channel = obj;
      self.vendor = item.vendor;
      item.isClick = true;
      self.showChannelBtns.forEach((_item, _index) => {
        if (_index !== index) {
          _item.isClick = false;
        }
      });
      self.curDeviceId = item.id;

      self.$nextTick(() => {
        self.$refs.vendorVideo.startVideo(self.channel.ivsId, self.channel.channelId, null);
      });
    },
    clickItem({item, index}) {

      const self = this;

      self.sourceList = [];
      self.sourceListLength = item.sourceList.length;
      console.log("ClickItem")
      console.log(this.sheetName);
      let total = 0;
      self.sheetName.forEach((inspectItem, index1) => {
        //  console.log(inspectItem.inspectList)
          if(inspectItem.inspectList){
          inspectItem.inspectList.forEach((group, index2) => {
              if(group.items){
                group.items.forEach((item, index3) => {
                  item.sourceList.forEach((source, index4) => {
                    if(source.mediaType>=2 &&  source.mediaType<=4){
                      total = total+1;
                    }
                  });
                });
              }
          });

          }

      });
      console.log(this.eventList)

      this.eventList.forEach((event, index1) => {
        if(event.sourceObj){
          total = total +1;
        }
      });
      self.sourceListLength = total;
      console.log("Source = "+self.sourceListLength)
      self.curDeviceId = item.deviceId[0];
      self.curItem = item;
      self.curItemIndex = index;
      self.curItemId = item.id;
      item.disabled = false;
      item.checked = true;
      self.inspectItemList.forEach((_item, _index) => {
        if (_item.id != item.id) {
          _item.checked = false;
          _item.disabled = true;
        }
      });

      self.sheetName.slice(0, self.sheetName.length - 1).forEach((_item, _index) => {
        _item.inspectList.forEach((p_item, p_index) => {
          p_item.items.forEach((itemDS, indexDS) => {
            if (itemDS.id != item.id) {
              itemDS.checked = false;
              itemDS.disabled = true;
            }
          });
        });
      });
    },

    leaveDialog() {
      const self = this;
      self.leaveObj.dialogCosed = false;
      if (self.$refs.vendorVideo) self.$refs.vendorVideo.editCount = 0;

    },
    cancelLeave() {
      const self = this;
      self.leaveObj.dialogCosed = false;
    },
    async noAllInspectDialog() {
      const self = this;
      self.noAllInspectObj.dialogCosed = false;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      const inspectSettings = JSON.parse(sessionStorage.getItem('inspectSettings'));
      this.resolveConfoirmSummaryData();
    },

    canceldNoAllInspect() {
      const self = this;
      self.noAllInspectObj.dialogCosed = false;
    },
    allIgnoreDialog() {
      const self = this;
      self.allIgnoreObj.dialogCosed = false;
    },
    cancelAllIgnore() {
      const self = this;
      self.allIgnoreObj.dialogCosed = false;
    },

    // sourceList
    async resolveConfoirmSummaryData() {
      const inspectList = [];
      const indexFeed = this.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = this.sheetName.slice(0, indexFeed);
      console.log("resolveConfoirmSummaryData> sheetName:",sheetName);
      const inspectSettings = JSON.parse(sessionStorage.getItem('inspectSettings'));
      if (this.hasIgnoretemp.length === 0) {
        sheetName.forEach(s_item => {
          s_item.inspectList.forEach(item => {
            inspectList.push(item);
            item.items.forEach((_item, _index) => {
              if (_item.inputCount === 0) {
                _item.isIgnore = true;
                // _item.inspectInput = '';
                // _item.sourceList = [];
                if (inspectSettings.qualifiedForIgnoredWithType1 && _item.type === 0
                  || inspectSettings.qualifiedForIgnoredWithType2 && _item.type === 1) {
                  _item.itemgetScore = _item.itemScore;
                }
                _item.itemgetScore = _item.manualIgnore ? '--' : null;
              }
            });
          });
        });
      } else {
        sheetName.forEach(s_item => {
          const dealtemp = [];
          s_item.inspectList.forEach(item => {
            item.items.forEach((_item, _index) => {
              this.hasIgnoretemp.forEach((h_item, h_index) => {
                if (this.hasIgnoretemp[h_index].inputCount == 0) {
                  this.hasIgnoretemp[h_index].isIgnore = true;
                  // this.hasIgnoretemp[h_index].inspectInput = '';
                  // this.hasIgnoretemp[h_index].sourceList = [];
                  if (inspectSettings.qualifiedForIgnoredWithType1 && h_item.type === 0
                    || inspectSettings.qualifiedForIgnoredWithType2 && h_item.type === 1) {
                    h_item.itemgetScore = h_item.itemScore;
                  }
                  h_item.itemgetScore = h_item.manualIgnore ? '--' : null;
                }
                if (this.hasIgnoretemp[h_index].id == item.items[_index].id) {
                  item.items[_index] = this.hasIgnoretemp[h_index];
                }
              });
              if (_item.inputCount != 0 || _item.manualIgnore) {
                const obj = {};
                obj.dealCount = 1;
                dealtemp.push(obj);
              }
            });
            inspectList.push(item);
          });
          s_item.dealCount = dealtemp.length;
        });
      }
      const hasIgnoretemp = [];
      inspectList.forEach(item => {
        item.items.forEach(_item => {
          if (_item.inputCount == 0 && !_item.manualIgnore) {
            _item['type'] = item.type;
            hasIgnoretemp.push(_item);
          }
        });
      });
      const obj = {
        inspect: sheetName,
        event: this.eventList,
        store: this.store,
        channel: this.channel,
        allRemarkItemsFlag: this.allRemarkItemsFlag,
        isBindWorkflow:this.isBindWorkflow||self.isEditReport,
        isEditReport:this.isEditReport,
        reportId:this.reportId,
        auditState:this.auditState,
        auditCancelable:this.auditCancelable,
      };
      this.historyObj = {
        storeList: this.tabList[Number(this.activeIndex)].storeList,
        patrolstore: this.patrolstore,
        sheetName: this.sheetName,
        PatrolList: this.PatrolList,
        activeIndex: this.activeIndex,
        store: this.store,
        hasIgnoretemp: hasIgnoretemp,
        inspectItemList: [...this.inspectItemList],
        eventList: this.eventList,
        showChannelBtns: this.showChannelBtns,
        allChannelBtns: this.allChannelBtns,
        curSheetIndex: this.curSheetIndex,
        curSheet: this.curSheet,
        curGroupIndex: this.curGroupIndex,
        curItemIndex: this.curItemIndex,
        channel: this.channel,
        curItemId: this.curItemId,
        deviceList: this.deviceList,
        isBindWorkflow:this.isBindWorkflow,
        isEditReport:this.isEditReport,
        reportId:this.reportId,
        auditState:this.auditState,
        auditCancelable:this.auditCancelable,
      };
      this.hasIgnoretemp = [];
      const params = { _id: this.userId, data: obj, rule: inspectSettings };

      console.log('params :~~~~~~>> ', params);

      this.$store.dispatch('setStoreList', this.storeList);

      console.log("submit:",this.historyObj);
      await Database.addDataToDB(this.userId, params);


      this.$router.push({ name: 'confirmSum', params: params });
    },



    async confirmSummary() {
      const self = this;
      const temp = [];
      let count = 0;
      let dealCount = 0;
      let requiredValid = false;
      let memoCheckText = false;
      let memoCheckMedia = false;

      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);

      console.log('self.sheetName ::::::::>> ', self.sheetName);
      console.log('sheetName ::::::::>> ', sheetName);

      sheetName.forEach(s_item => {
          s_item.inspectList.forEach(item => {

            item.items.forEach((_item, _index) => {
              if (!_item.manualIgnore && _item.required) {
              console.log("_item ::::::::>>", _item)
                if (
                  (_item.itemType === 0 && _item.itemgetScore === '--') ||
                  (_item.itemType === 1 && _item.sourceList.length === 0)
                ) {
                  requiredValid = true
                }
              }


              if(_item.memo_config !== null){
                switch (_item.type) {
                  case 0:
                    // console.log('this is type ===:>> 0');
                    // console.log('_item.type ::::::::>> ', _item.type);
                    const hasText_tab1 = _item.sourceList.some(i => i.mediaType === 3)
                    const hasImg_tab1 = _item.sourceList.some(i => i.mediaType === 2)
                    if(_item.memo_config.memo_required_type === 1){
                      if(_item.memo_config.memo_check_text && !hasText_tab1) {
                        memoCheckText = true
                        }
                      else if(_item.memo_config.memo_check_media && !hasImg_tab1){
                        memoCheckMedia = true
                        }
                    }
                    else if(_item.memo_config.memo_required_type === 2){
                      if(_item.itemScoreTitle == _item.scoreList[1].scoreTitle && _item.memo_config.memo_check_text && !hasText_tab1){
                        memoCheckText = true
                      }
                      else if(_item.itemScoreTitle == _item.scoreList[1].scoreTitle && _item.memo_config.memo_check_media && !hasImg_tab1){
                        memoCheckMedia = true
                      }
                    }
                    break;

                  case 1:
                    console.log('this is type ===:>> 1  ');
                    console.log('_item.type ::::::::>> ', _item.type);
                    const hasText_tab2 = _item.sourceList.some(i => i.mediaType === 3)
                    const hasImg_tab2 = _item.sourceList.some(i => i.mediaType === 2)
                    if(_item.memo_config.memo_required_type === 1){
                      if(_item.memo_config.memo_check_text && !hasText_tab2) {
                        memoCheckText = true
                        }
                      else if(_item.memo_config.memo_check_media && !hasImg_tab2){
                        memoCheckMedia = true
                        }
                    }
                    else if(_item.memo_config.memo_required_type === 2){
                      if(_item.qualifiedScore > _item.itemgetScore && _item.memo_config.memo_check_text && !hasText_tab2){
                        memoCheckText = true
                      }
                      else if(_item.qualifiedScore > _item.itemgetScore && _item.memo_config.memo_check_media && !hasImg_tab2){
                        memoCheckMedia = true
                      }
                    }
                    break;

                  case 2:
                    console.log('this is type ===:>> 2  ');
                    console.log('_item.type ::::::::>> ', _item.type);
                    const hasText_tab3 = _item.sourceList.some(i => i.mediaType === 3)
                    const hasImg_tab3 = _item.sourceList.some(i => i.mediaType === 2)
                    if(_item.memo_config.memo_required_type === 1){
                      if(_item.memo_config.memo_check_text && !hasText_tab3) {
                        memoCheckText = true
                        }
                      else if(_item.memo_config.memo_check_media && !hasImg_tab3){
                        memoCheckMedia = true
                        }
                    }
                    else if(_item.memo_config.memo_required_type === 2){
                      if(_item.itemScoreTitle == _item.scoreList[1].scoreTitle && _item.memo_config.memo_check_text && !hasText_tab3){
                        memoCheckText = true
                      }
                      else if(_item.itemScoreTitle == _item.scoreList[1].scoreTitle && _item.memo_config.memo_check_media && !hasImg_tab3){
                        memoCheckMedia = true
                      }
                    }
                    break;

                  default:
                    break
                }
              }

            });
          });
        });
      if (self.hasIgnoretemp.length === 0) {
        sheetName.forEach(s_item => {
          console.log("s_item:",s_item);
          console.log("s_item.ignoreCount:",(s_item.ignoreCount)?s_item.ignoreCount:0);
          dealCount = dealCount + s_item.dealCount;//+((s_item.ignoreCount)?s_item.ignoreCount:0);
          count = count + s_item.count;
        });
      } else {
        sheetName.forEach(s_item => {
          const dealtemp = [];
          s_item.inspectList.forEach(item => {
            item.items.forEach((_item, _index) => {
              if (_item.inputCount != 0 || _item.manualIgnore) {
                const obj = {};
                obj.dealCount = 1;
                dealtemp.push(obj);
              }
            });
            temp.push(item);
          });
          s_item.dealCount = dealtemp.length;
          dealCount = dealCount + s_item.dealCount;
          count = count + s_item.count;
        });
      }


      if (requiredValid) {
        self.requiredObj.dialogCosed = true;
        return false;
      }

      // 備註標籤文字
      if (memoCheckText) {
        self.memoConfigTextObj.dialogCosed = true;
        return false;
      }
      // 備註標籤圖片或影像
      if (memoCheckMedia) {
        self.memoConfigMediaObj.dialogCosed = true;
        return false;
      }


      // if(this.allRemarkItemsFlag && dealCount === 0){
      //   util.notify(this.$t('remotePatrol.invalidInspection'), 'warning', 3000);
      //   return false;
      // }
      // if (!this.allRemarkItemsFlag && dealCount < count) {
      //   self.noAllInspectObj.dialogCosed = true;
      //   return false;
      // }

      console.log('sheetName end:>> ', sheetName);
      this.resolveConfoirmSummaryData();
    },




    spreadContent() {
      const self = this;
      self.showSpread = true;
    },
    closeContent() {
      const self = this;
      self.showSpread = false;
    },

    searchStore() {
      const self = this;
      const tempStoreList = self.tempStoreList;
      const getStore2Temp = data => {
        const cityList = [];
        data.forEach(item => {
          if (cityList.map(x => x.city).indexOf(item.city) == -1) {
            const obj = {
              city: item.city,
              province: item.province
            };
            cityList.push(obj);
          }
        });
        const storeListTemp = [];
        for (let i = 0; i < cityList.length; i++) {
          const temp = [];
          const obj = {};
          for (let j = 0; j < data.length; j++) {
            if (cityList[i].city == data[j].city) {
              const obj = {};
              if (self.store.storeId == data[j].storeId) {
                obj.isActive = true;
              } else {
                obj.isActive = false;
              }
              obj.storeId = data[j].storeId;
              obj.name = data[j].name;
              obj.userId = data[j].userId;
              obj.city = data[j].city;
              obj.province = data[j].province;
              obj.favorite = data[j].favorite == undefined ? true : data[j].favorite;
              obj.device = data[j].device;
              obj.hasInspect = data[j].hasInspect;
              if (data[j].authorizedInspect != undefined && data[j].authorizedInspect.length != 0) {
                obj.authorizedInspect = data[j].authorizedInspect;
                obj.hasInspect = true;
              } else {
                obj.hasInspect = false;
              }
              temp.push(obj);
            }
          }
          obj.cityName = cityList[i].province + ' ' + cityList[i].city;
          obj.storeList = temp;
          storeListTemp.push(obj);
        }
        return storeListTemp;
      };
      const temp = [];
      const tempArray = [];
      const tempStore = [];
      tempStoreList.forEach((_item, _index) => {
        _item.storeList.forEach((itemDs, indexDs) => {
          temp.push(util.getPinyinList(itemDs.name));
          tempStore.push(itemDs);
        });
      });
      for (var i = 0; i < temp.length; i++) {
        if (temp[i][0].indexOf(self.serachVale.trim()) != -1 ||
          temp[i][1].indexOf(self.serachVale.trim()) != -1) {
          tempArray.push(tempStore[i]);
        }
      }
      self.tabList[2].storeList = getStore2Temp(tempArray);
    },

    changeStore(item, index, _item, _index) {
      const self = this;
      self.patrolstore = '';
      self.curSheetIndex = 0;
      self.curSheet = {};
      self.inspectItemList = [];
      self.inspectList = [];
      self.sheetName = [];
      self.tempArr = [];
      self.showChannelBtns = [];
      self.patrolStoreName = _item.name;
      self.PatrolList = [];
      self.hasIgnoretemp = [];
      self.$store.dispatch('setPatrolHistory', null);
      self.isShowWarn = false;
      self.notShowAlert = false;
      this.showIgnoreItem = false;
      this.$emit("listenerChild", false);
      _item.authorizedInspect.forEach(au_item => {
        if (au_item.mode === 0) {
          self.PatrolList.push(au_item);
        }
      });
      _item.isActive = true;
      self.showStoreUp = true;

      !self.showGuide && (self.$refs.vendorVideo.editCount = 0);
      !self.showGuide && self.$refs.vendorVideo.stopVideoPlay();
      self.showError = false;
      self.curDeviceId = -1;
      self.showFeedBack = false;
      self.eventList = [];
      self.showGuide = true;
      const obj = {};
      obj.storeId = _item.storeId;
      obj.storeName = _item.name;
      obj.storeTitle = _item.name;
      obj.storeUp = _item.favorite;
      self.channel = null;
      self.getChannelByStore(_item);
      if (_item.favorite) {
        obj.storeUpTitle = this.$t('remotePatrol.stared');
      } else {
        obj.storeUpTitle = this.$t('remotePatrol.clickToStar');
      }
      self.store = obj;
      let curStoreId = '';
      const tabIndex = Number(self.activeIndex);
      if (tabIndex != 2) {
        item.storeList.forEach((itemS, indexS) => {
          if (_index != indexS) {
            itemS.isActive = false;
          }
        });
        curStoreId = _item.storeId;
      } else {
        item.storeList.forEach((itemS, indexS) => {
          itemS.storeList.forEach((itemChild, indexChild) => {
            if (itemChild.storeId != _item.storeId) {
              itemChild.isActive = false;
            } else {
              curStoreId = itemChild.storeId;
            }
          });
        });
      }
      const storeObj = {
        storeId: curStoreId
      };
      self.saveStoreObj(storeObj);
    },
    changeBrandDialog() {
      const self = this;
    },
    changeInspectDialog() {
      const self = this;
      self.changeInspectObj.dialogCosed = false;
      self.changeInspectList(self.beforepatrolstore);
      if (self.$refs.vendorVideo) self.$refs.vendorVideo.editCount = 0;
    },
    canceldChangeInspect() {
      const self = this;
      if(self.isEditReport)  self.EditRptchangeInspectObj.dialogCosed = false;
      else self.changeInspectObj.dialogCosed = false;
    },
    canceldChangeStore() {
      const self = this;
      if(self.isEditReport){
        self.EditRptchangeStoreObj.dialogCosed = false;
      }else{
        self.changeStoreObj.dialogCosed = false;
      }

    },
    canceldChangeBrand() {
      const self = this;
      if(self.isEditReport){
        self.EditRptchangeBrandObj.dialogCosed = false;
      }else{
        self.changeBrandObj.dialogCosed = false;
      }
    },

    lastBar() {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0].offsetWidth;
      const detailsWidth = window.innerWidth / 1440 * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        const index = self.getChannelIndexById(self.showChannelBtns[0].id);
        self.showChannelBtns.unshift(self.channelBtns[index - 1]);
        self.showChannelBtns.pop();
        self.showChannelBtns.forEach((item, index) => {
          if (item.id == self.channel.id) {
            item.isClick = true;
          } else {
            item.isClick = false;
          }
        });
        if (self.showChannelBtns[0].id == self.channelBtns[0].id) {
          self.hideLast = false;
        }
        if (self.showChannelBtns[count - 1].id != self.channelBtns[self.channelBtns.length - 1].id) {
          self.hideNext = true;
        }
      }
    },
    nextBar() {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0].offsetWidth;
      const detailsWidth = window.innerWidth / 1440 * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= self.channelBtns.length) {
        return false;
      } else {
        const index = self.getChannelIndexById(self.showChannelBtns[count - 1].id);
        self.showChannelBtns.push(self.channelBtns[index + 1]);
        self.showChannelBtns.shift();
        self.showChannelBtns.forEach((item, index) => {
          if (item.id == self.channel.id) {
            item.isClick = true;
          } else {
            item.isClick = false;
          }
        });
        if (self.showChannelBtns[0].id != self.channelBtns[0].id) {
          self.hideLast = true;
        }
        if (self.showChannelBtns[count - 1].id == self.channelBtns[self.channelBtns.length - 1].id) {
          self.hideNext = false;
        }
      }
    },
    getshowBtns(list) {
      const self = this;
      const width = document.getElementsByClassName('btn-content')[0].offsetWidth;
      const detailsWidth = window.innerWidth / 1440 * 15 + 60;
      const count = parseInt(width / detailsWidth);
      if (count >= list.length) {
        self.showChannelBtns = list;
      } else {
        self.showChannelBtns = list.slice(0, count);
      }
      if (count < self.channelBtns.length) {
        self.hideNext = true;
      }
    },
    getChannelByStore(storeItem) {
      const self = this;
      const temp = [];
      self.hideLast = false;
      self.hideNext = false;
      storeItem.device.forEach((item, index) => {
        const obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.ivsId = item.ivsId;
        obj.channelId = item.channelId;
        obj.isonline = true;
        obj.isClick = false;
        obj.vendor = item.vendor;
        temp.push(obj);
      });
      self.channelBtns = temp;
      self.allChannelBtns = temp;
      self.showGuide = false;
      self.channel = {...self.allChannelBtns[0]};
      self.vendor = self.channel.vendor;
      self.channelBtns = [...self.allChannelBtns];
      self.showError = false;
      self.showGuide = false;
      self.$nextTick(() => {
        self.showGuide = false;
        self.getshowBtns(self.channelBtns);
      });
      self.channelBtns.forEach((_item, _index) => {
        if (self.channel != null) {
          if (_item.id === self.channel.id) {
            _item.isClick = true;
          } else {
            _item.isClick = false;
          }
        }
      });
      self.$nextTick(() => {
        if (self.$refs.vendorVideo) self.$refs.vendorVideo.startVideo(self.channel.ivsId, self.channel.channelId, null);
      });
    },

    getTab1AndTab3BtnName(type){
      let nameBtnArr = [this.$t('remotePatrol.pass'), this.$t('remotePatrol.failed')];
      nameBtnArr = type === 0 ?
        [this.itemOptionsForType1[0].name , this.itemOptionsForType1[1].name] :
        [this.itemOptionsForType3[0].name , this.itemOptionsForType3[1].name];
      return nameBtnArr;
    },

    checkIfAllItemsAreRemark(groupsArr){
      console.log("checkIfAllItemsAreRemark:",groupsArr)
      let tempArr = [];
      groupsArr.forEach(group => {
        tempArr.push(...group.items);
      })
      const remarkItemsArr = tempArr.filter(item => item.type === 1);
      console.log(remarkItemsArr.length === tempArr.length)
      if(remarkItemsArr.length === tempArr.length){
        this.allRemarkItemsFlag = true;
        this.notShowAlert = true;
        this.isDisabled = false;
      } else {
        this.allRemarkItemsFlag = false;
        this.notShowAlert = false;
        this.isDisabled = false;
      }
    },

    hasIgnoreItem() {
      const self = this;
      //this.showIgnoreItem = true;
      this.$emit("listenerChild", true);
      this.showIgnoreItem = true;

      self.showFeedBack = false;
      self.noAllInspectObj.dialogCosed = false;
      self.isShowWarn = false;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
     // const sheetName = self.sheetName.slice(0, indexFeed);
      const hasIgnoretemp = [];
      let first = true;
      let sheetIndex =0;
      this.sheetName.forEach(s_item => {
        let count = 0;
        if(s_item.inspectList){
          s_item.inspectList.forEach(item => {
          let ignoreCount = 0;
          item.items.forEach((_item, _index) => {
            _item.originIndex = _index;
            if (_item.inputCount == 0 && !_item.manualIgnore) {
              ignoreCount++;
              _item.ignore = true;
            //  hasIgnoretemp.push(_item);
            } else  {
              _item.ignore  = false;
           //   self.tempArr.push(_item.type);
            }
          });
          item.ignoreCount = ignoreCount;
          if(ignoreCount>0)count++;
         });


        }

        s_item.ignoreCount = count;
        if(s_item.ignoreCount>0&&first){
          this.changeSheet(s_item,sheetIndex)
          first=false;
        }
        sheetIndex++;

      });
      //self.hasIgnoretemp = hasIgnoretemp;
    },
    backToPatrol() {
      const self = this;
      //this.showIgnoreItem = false;
      this.showIgnoreItem =false;
      this.$emit("listenerChild", false);
      self.showFeedBack = self.sheetName[Number(self.sheetName.length - 1)].isClick;
      const indexFeed = self.sheetName.map(x => x.groupId).indexOf('feedBack');
      const sheetName = self.sheetName.slice(0, indexFeed);
      sheetName.forEach(s_item => {
        let dealtemp = [], notIgnoretemp = [];
        s_item.inspectList.forEach(item => {
          item.items.forEach((_item, _index) => {
            self.hasIgnoretemp.forEach((h_item, h_index) => {
              if (h_item.id == _item.id) {
                item.items[_index] = self.hasIgnoretemp[h_index];
              }
            });
            if (item.items[_index].inputCount == 1 || item.items[_index].manualIgnore) {
              const obj = {};
              obj.dealCount = 1;
              dealtemp.push(obj);
            }
            if (item.items[_index].inputCount == 1) {
              const obj = {};
              obj.manualCount = 1;
              notIgnoretemp.push(obj);
            }
          });
        });
        s_item.dealCount = dealtemp.length;
        s_item.Effective = notIgnoretemp.length;
        if (s_item.isClick && !self.showFeedBack) {
          self.inspectItemList = [...s_item.inspectList[self.curGroupIndex].items];
        }
      });
      self.isShowWarn = self.hasIgnoretemp.some(x => x.inputCount == 0);
      self.notShowAlert = self.sheetName.every(x => x.count == x.dealCount);
    },
    getItemBySheet () {

    },
    changeSheet(item, index) {
      console.log("changeSheet:",item);
      const self = this;
      if (item.groupId == 'feedBack') {
        const PatrolHistory = self.$store.getters.PatrolHistory;
        if (PatrolHistory != null) {
          self.eventList = PatrolHistory.eventList;
          self.showFeedBackInfo = self.eventList.length == 0;
          self.showFeedBack = true;
        }else if(self.isEditReport){
          const BackPatrolParam = self.$store.getters.BackPatrolParam;
          self.eventList = BackPatrolParam.eventList;
          self.showFeedBackInfo = self.eventList.length == 0;
          self.showFeedBack = true;
        } else {
          self.showFeedBack = true;
          self.showFeedBackInfo = self.eventList.length == 0;
          self.showGuide = false;
          self.channelBtns = self.allChannelBtns.concat();
          self.channelBtns.forEach((_item, _index) => {
            if (self.channel != null) {
              if (_item.id == self.channel.id) {
                _item.isClick = true;
              } else {
                _item.isClick = false;
              }
            }
          });
          self.$nextTick(() => {
            self.getshowBtns(self.channelBtns);
          });
        }
      } else {
        self.inspectList = item.inspectList;
        self.curSheetIndex = index;
        this.curSheet = { ...item };
        self.getItemByGroup(item.inspectList[0], 0, item.inspectList);
      }
      self.sheetName.forEach((_item, _index) => {
        if (index == _index) {
          _item.isClick = _item.isClick == false;
        } else {
          _item.isClick = false;
        }
      });
    },

    getItemOfCategory(item, index){
      this.curSheet = { ...item }
      this.inspectItemList = [];
      this.curGroupIndex = 0;
      this.curSheetIndex = index;
      this.curGroup = item;
      this.curItemIndex = 0;
      this.groupType = item.type;
      this.inspectItemList = [...item.inspectList[0].items];
      this.showFeedBack = false;
      this.hideNext = false;
      this.hideLast = false;
      this.channelBtns = [];
      this.isCategory = false;
      this.inspectList = item.inspectList;
      item.isClick = true;
      this.$nextTick(() => {
        this.anchorLinkTo();
      });
      this.sheetName.forEach((_item, _index) => {
        if ((!_item.isCategory && index !== _index) || _item.isCategory) {
          _item.isClick = false;
        }
      });
    },
    clickStore(item, index, _item, _index) {

      const self = this;
      if (!_item.hasInspect && _item.hasInspect != undefined) {
        return false;
      }
      if (!util.validateLicense(_item.status)) {
        return false;
      }
      self.curTabIndex = index;
      self.curTabItem = item;
      self.curStoreIndex = _index;
      self.curStoreItem = _item;
      self.deviceList = _item.device;
      if ( (!self.showGuide && self.$refs.vendorVideo && self.$refs.vendorVideo.editCount != 0)
          || (self.$store.getters.PatrolHistory != null) ) {
        self.changeStoreObj.dialogCosed = true;
      } else if(self.isEditReport){
        self.EditRptchangeStoreObj.dialogCosed = true;
      }else {
        self.changeStore(item, index, _item, _index);
      }
    },

    checkFull() {
      var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },
    /**
     * handle ezviz video snapshot
     */
    editEzvizCanvas(src) {
      const self = this;
      // self.sourceList = [];
      const obj = {};
      console.log("***editEzvizCanvas:",src)
      obj.mediaType = 2;
      obj.src = src;
      obj.height = '100px';
      obj.width = '140px';
      obj.fileName = `${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${self.curItemId}.jpg`;
      obj.file = util.base64ToBlob(obj.src);
      obj.deviceId = self.channel.id;
      obj.hasUrl = false;
      obj.showDelBtn = true;
      self.sourceList.push(obj);
      const tempId = self.getIndexById(self.curItemId);
      self.sheetName[self.curSheetIndex].inspectList.forEach((inspect, idx) => {
        inspect.items.forEach(item_ => {
          if (item_.id === self.curItemId) self.curGroupIndex = idx
        })
      })
      if (tempId != null) {
        console.log("***tempId != null");
          self.inspectList[0].items[tempId.itemIndex].sourceList.push(obj);
          if(self.inspectList[0].items[tempId.itemIndex].itemType === 1){
            if (this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].items[this.curItemIndex].inputCount === 0) {
              this.editCount++;
              this.$store.dispatch('setEditCount', this.editCount);
              this.sheetName[this.curSheetIndex].dealCount++;
              this.sheetName[this.curSheetIndex].Effective++;
              this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].dealCount++;
              this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].Effective++;
            }
            this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].items[this.curItemIndex].inputCount++;
          }
      } else {
        console.log("***tempId == null");
        self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.push(obj);// = self.sourceList;
      }
      if (!this.showIgnoreItem) {
        self.sourceListLength = self.inspectList[self.curGroupIndex].items[self.curItemIndex].sourceList.length;
      } else {
        self.sourceListLength = self.hasIgnoretemp[self.curItemIndex].sourceList.length;
      }

    },

    ezvizPictureFeedback(obj) {
      const self = this;
      let srcObj = null;
      const src = obj.src;
      srcObj = {
        mediaType: 2,
        src: src,
        height: '100px',
        width: '140px',
        fileName:`${self.bucketImage}/inspect_${util.getCurTimeStr()}_${self.store.storeId}_${self.curItemId}.jpg`,
        file: util.base64ToBlob(src),
        deviceId: self.channel.id,
        hasUrl : false,
        showDelBtn : true,
      };

      const picObj = {
        eventName: obj.eventName,
        eventDes: obj.eventDes,
        sourceObj: srcObj,
        sourceList: obj.sourceList,
        showDelBtn:true
      };
      self.eventList.push(picObj);
      self.showFeedBackInfo = false;
    },
    submitItemResource({ item}) {
      const self = this;
      //this.curItemIndex = index;
      if (item.inspectInput.trim().length === 0) return
      if (this.curEditIndex > -1) {
        item.sourceList = item.sourceList.map((source, idx) => {
          if (idx === self.curEditIndex) return {
            ...source,
            src: item.inspectInput,
          }
          else return { ...source }
        })
        this.curEditIndex = -1
      } else {
        if (item.sourceList.filter(source => source.mediaType === 3).length < 5) {
          item.sourceList.push({
            mediaType: 3,
            src: item.inspectInput,
            showDelBtn : true,
          })
        } else {
          item.RuleCountTip = true;
        }
      }
      item.inspectInput = ''
    },
    deleteItemResource({ item, index }) {
      const self = this
      this.curEditIndex = -1;
      item.inspectInput = '';
      item.sourceList = item.sourceList.filter((source, idx) => idx !== index)
    },
    editItemResource ({ item, index }) {
      this.curEditIndex = index
      item.inspectInput = item.sourceList[index].src
    },
    deleteFeedbackItemResource(index) {
      this.curEditFeedbackIndex = -1
      this.feedbackInput = ''
      this.feedbackSourceList = this.feedbackSourceList.filter((source, idx) => idx !== index)
    },
    editItemFeedbackResource(index) {
      this.curEditFeedbackIndex = index
      this.feedbackInput = this.feedbackSourceList[index].src
    },
    submitFeedbackItemResource () {
      const self = this;
      if (this.feedbackInput.trim().length === 0) return
      if (this.curEditFeedbackIndex > -1) {
        this.feedbackSourceList = this.feedbackSourceList.map((source, idx) => {
          if (idx === self.curEditFeedbackIndex) return {
            ...source,
            src: self.feedbackInput,
          }
          else return { ...source }
        })
        this.curEditFeedbackIndex = -1
      } else {
        if (this.feedbackSourceList.filter(source => source.mediaType === 3).length < 5) {
          this.feedbackSourceList.push({
            mediaType: 3,
            src: this.feedbackInput,
          })
        } else {

        }
      }
      this.feedbackInput = ''
    },
    itemDescriptionChanged({ val, item }) {
      const content = filterString.all(val, 1000);
      item.inspectInput = content;
      const length = filterString.getContentLength(val);
      if (item.RuleCountTip) item.RuleCountTip = false;
      if (length > 1000) {
        item.Ruletip = true;
      } else {
        item.Ruletip = false;
      }
      if(!this.showIgnoreItem){
        this.editCount++;
        this.$store.dispatch('setEditCount', this.editCount);
        this.sheetName[this.curSheetIndex].inspectList.forEach((inspect, idx) => {
          inspect.items.forEach(item_ => {
            if (item_.id === self.curItemId) self.curGroupIndex = idx
          })
        })
        if (item.itemType === 1 && length > 0) {
          if (this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].items[this.curItemIndex].inputCount === 0) {
            this.sheetName[this.curSheetIndex].dealCount++;
            this.sheetName[this.curSheetIndex].Effective++;
            this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].dealCount++;
            this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].Effective++;
          }
          this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].items[this.curItemIndex].inputCount++;
        } else if (item.itemType === 1 && length === 0 && this.sourceListLength === 0) {
          this.sheetName[this.curSheetIndex].dealCount != 0 ? this.sheetName[this.curSheetIndex].dealCount-- : null;
          this.sheetName[this.curSheetIndex].inspectList[this.curGroupIndex].items[this.curItemIndex].inputCount = 0;
        }
      } else {
        if(item.itemType === 1 && length > 0){
          item.inputCount = 1;
        } else if(item.itemType === 1 && length === 0 && item.sourceList.length === 0){
          item.inputCount = 0;
        }
      }
    },
    eventNameChanged(val) {
      const self = this;
      const content = filterString.all(val, 50);
      self.eventName = content;
      self.showEventNameInfo = false;
      const length = filterString.getContentLength(val);
      if (length > 50) {
        this.eventNameRuletip = true;
      } else {
        this.eventNameRuletip = false;
      }
    },
    eventDesChanged(val) {
      const self = this;
      const content = filterString.all(val, 1000);
      self.eventDes = content;
      self.feedbackInput = content;
      const length = filterString.getContentLength(val);
      if (length > 1000) {
        this.eventDesRuletip = true;
      } else {
        this.eventDesRuletip = false;
      }
    },
    notShowInputRuleTips(e, item) {
      if (e == 'item') {
        item.Ruletip = false;
        item.RuleCountTip = false;
      } else if (e == 'eventName') {
        this.eventNameRuletip = false;
      } else if (e == 'eventDes') {
        this.eventDesRuletip = false;
      }
    },

    onPlayerWaiting(e) {
      this.showModelContent = false;
    },

    onPlayerPlaying(e) {
      this.showModelContent = true;
    },

    editFeedback(feedbackObj, index){
      this.feedbackIndex = index;
      !feedbackObj.sourceObj ? this.showAddTextFeedbackDialog = true : this.showFeedDialog2 = true;
      this.eventName = feedbackObj.eventName;
      this.eventDes = feedbackObj.eventDes;
      this.feedbackSourceList = feedbackObj.sourceList;
      this.showEventNameInfo = false;
    }
  }
};
</script>

<style lang="sass">
  .force_white .el-textarea__inner
    background-color: #FFF !important
    border-color: none !important
    padding: 7px 70px 7px 7px

  .force_white .el-textarea__inner:focus
    border-color: #c0c0c0 !important

</style>

<style lang="sass" scoped>

  .advance_memo
    font-size: 12px
    color: #f31d65
    text-align: left
    margin-top: 5px

  .comment_list
    width: 100%
    padding: 4px
    margin-bottom: 5px

    // background: rgb(242, 249, 254)
  .to_delete
    margin-bottom: 5px
    transition: all .3s
    cursor: pointer
    margin-left: 5px
    &:hover
      transform: scale(1.1)
  .input_bg
    background: #FFF !important

  .is_important
    color: #f31d65




</style>

<style lang="scss" scoped>
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  .fade-enter-active {
    transition: all 1s ease;
    width: 68px;
    overflow: hidden;
  }
  .fade-leave-active{
    transition: all 1s ease;
    width: 0;
    overflow: hidden;
  }
  .fade-enter, .fade-leave {
    width: 0;
    opacity: 0;
  }
  .fadepen-enter-active,.fadepen-leave-active{
    transition: opacity .5s
  }
  #feedback-content{
    padding-top: calc(80/1920*100vw);
    text-align: left;
    .feedback-info {
      display: block;
      padding-left: calc(40/1920*100vw);
      color: #006ab7;
      font-size: calc(24/1920*100vw);
      font-weight: bold;
      &:last-child {
        margin-top: calc(30/1920*100vw);
      }
    }
  }
  .fadepen-enter, .fadepen-leave-to{
    opacity: 0;
  }
  .img-source-content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: calc(10/1920*100vw);
  }
  .item-details {
    border-bottom: 1px solid #f5f7fa
  }
  .img-content{
    position: relative;
    // width: calc(140/1920*100vw);
    // height: calc(100/1920*100vw);
    margin-right: calc(15/1920*100vw);
    .el-image {
      border-radius: 5px;
    }
    .start-icon{
      position: absolute;
      left: 35%;
      top: 30%;
      cursor: pointer;
    }
  }
.icondelete{
  position: absolute;
  font-size: 12px;
  width:18px;
  height:18px;
  right: 10px;
  margin-top: 8px;
  z-index: 2;
  padding:3px;
  color: #fff;
  cursor: pointer;
  background-color: #868686;
  border-radius: 50%;
}
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
  .noeventClass{
    pointer-events: none;
  }
  .el-container{
    // background-color: $background;
    .spreadLsideClass{
      width: 98%;
    }
    .liseAnmiClass{
      animation:lisdeAn 0.5s;
      -webkit-animation: lisdeAn 0.5s;
      animation-fill-mode:forwards;
    }
    @keyframes lisdeAn{
      from{
        width: 66.67%;
      }
      to{
        width: 100%;
      }
    }
    @-webkit-keyframes lisdeAn{
      from{
        width: 66.67%;
      }
      to{
        width: 100%;
      }
    }
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
      // margin-right: 15px;
      @include point(margin-right,20);
      font-size: 12px;
      line-height: 12px;
    }
    .canvas-content{
      position: relative;
      .rules{
        margin-left: 20px;
        font-size: 10px;
        margin-top: 5px;
        color: #ff2400;
        display: block;
      }
      .dialog-hr{
        border: 0.5px solid ;
        border-color: #dfe2e9;
        margin-bottom:0px;
        position: relative;
        bottom: 5px;
      }
      #icanvas{
        @include point(margin-top,15);
        margin-left: 20px;
      }
      .dialog-img-content{
        @include point(padding,15);
      }
      .is-required{
        color: $red;
      }
      .error-class{
        @include point(margin-left,20);
        font-size: 10px;
        margin-top: 5px;
        color: #ff2400;
        display: block;
      }
      .dialog-event-content{
        text-align: left;
        @include point(margin-bottom,20);
        .event-title{
          color: $black;
          display: block;
          margin: 15px;
          @include point(margin-left,20);
          @include point(margin-right,20);
          font-size: 14px;
        }
        .name-input{
          @include point(width,200);
          @include point(margin-left,20);
        }
        .des-input{
          display: block;
          width: auto;
          @include point(margin-left,20);
          @include point(margin-right,20);
        }
      }
      .feed-canvas-content{
        width: 65%;
        float: left;
        position: relative;
        text-align: left;
        margin-left: 1%;
        .canvas-img{
          margin-left: 20px;
          margin-top: 15px;
        }
        .cancel-content{
          margin-left: 20px !important;
          height:30px;
          line-height: 30px;
        }
      }
      .event-content{
        width:33%;
        float: left;
        text-align: left;
        margin-left: 1%;
        padding-right: 20px;
        box-sizing: border-box;
        .event-title{
          color: $black;
          display: block;
          margin: 15px;
          margin-left: 0;
          font-size: 14px;
        }
        .error-class {
          margin-left: 0;
        }
        .name-input{
          width: 100%;
          //@include point(width,150);
          //@include point(margin-bottom,15);
        }
        .des-input{
          width: 100%;
        }
      }
      #previewCutVideo{
        @include point(margin-bottom,20);
        @include point(margin-top,10);
      }
      .cancel-content{
        position: absolute;
        bottom: 2px;
        @include point(height,30);
        @include point(line-height,30);
        background-color: rgba($color: $black, $alpha: 0.5);
        z-index: 10;
        overflow: hidden;
        .content{
          text-align: center;
          float: left;
          color: #fff;
          cursor: pointer;
          width: 49%;
          &:first-child{
            border-right: 1px solid #fff;
          }
          .icon-clear{
            position: relative;
            @include point(top,3);
            margin-right: 15px;
          }
          @media screen and(max-width: 1366px){
            span{
              position: relative;
              @include point(bottom, 4)
            }
          }

        }
      }
      .icon-right{
        width: 120px;
        height: auto;
        position: absolute;
        right: 30px;
        top: 5%;
        text-align: center;
        .pen-btn{
          width: 40px;
          margin-right: 20px;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .content{
          width: 100%;
          height: 40px;
          position: relative;
          .color{
            width: 16px;
            height: 16px;
            border-radius: 8px;
            position: absolute;
            margin: auto 0;
            top: 4px;
            left: 34%;
            margin-left: 4px;
            z-index: 3;
            cursor: pointer;
          }
          .colorActive{
            background-color: #ddd;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            position: absolute;
            margin: auto 0;
            left: 34%;
            z-index: 3;
          }
          #white{
            background-color: white;
          }
          #yellow{
            background-color: yellow;
          }
          #red{
            background-color: red;
          }
        }
      }
    }
    @mixin arrow-icon{
      .guide-num{
        display: inline-block;
        height: calc(28/1920*100vw);
        width: calc(28/1920*100vw);
        line-height: calc(28/1920*100vw);
        border-radius: 50%;
        background-color: $red;
        color: #fff;
        margin-right: 15px;
        font-size: 14px;
        @media screen and (max-width: 1280px){
          height: 18px;
          width: 18px;
          line-height: 18px;
        }
      }
      .guide-title{
        color: $red;
        font-size: calc(14/1920*100vw);
        font-weight: bold;
      }
    }
    .lside{
      .el-header-title{
        text-align: left;
        position: relative;
        height: calc(80/1920*100vw);
        line-height: calc(80/1920*100vw);
        border-bottom: 1px solid $border;
        padding-left: calc(25/1920*100vw);
        padding-right: calc(25/1920*100vw);
        img {
          height: calc(23 / 1920 * 100vw);
          margin-right: calc(10 / 1920 * 100vw);
        }
        .lside-title{
          width: 80%;
          font-weight: bold;
          color:$h1;
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

        }
        @media screen and(min-width: 1366px){
          .lside-title{
            font-size: 18px;
          }
          .storeUp-content{
            height:22px;
            width: 105px;
            text-align: center;
          }
        }
        @media screen and(max-width: 1366px){
          .lside-title{
            @include point(font-size,18);
          }
          .storeUp-content{
            height:auto;
            text-align: center;
            width: 100px;
          }
        }
        .nocoll{
          border:1px solid #FF9803;
        }
        .coll{
          border:1px solid #FF9803;
          background-color: #FF9803;
        }
        .nocoll-icon{
          color: #FF9803;
          font-size: 14px;
        }
        .coll-icon{
          color: #fff;
          font-size: 14px;
        }
        .coll-font{
          color: #fff;
        }
        .nocoll-font{
          color: #FF9803;
        }

        .storeUp-content{
          display: inline-block;
          margin-left: 20px;
          padding: 1px 6px;
          line-height: 18px;
          cursor: pointer;
          position: relative;
          bottom: 2px;
          span{
            font-size: 12px;
            /*vertical-align: middle;*/
            margin-left: 4px;
          }
        }

        .ja-storeUp-content{
          @extend .storeUp-content;
          width: 120px;
        }

        .el-submit{
          position: absolute;
          @include point(right,20);
          //@include point(width,90);
          color: #fff;
          width:calc(130/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
        }
        .en-el-submit{
          position: absolute;
          right: calc(30/1920*100vw);
          width:calc(130/1920*100vw);
          color: #fff;
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          min-height: 28px;
          top: 50%;
          transform: translate(0, -50%);
          min-width: 85px;
        }
        @media screen and(min-width: 1366px){
          .el-submit{
            top: 30%;
          }
        }
        @media screen and(max-width: 1366px){
          .el-submit{
            top: 20%;
          }
        }
      }
      .errorVideo-model{
        @include point(margin,20);
        margin-bottom: 0;
        height: auto;
        position: relative;
        min-height: 420px;
        background-color: #232730;
        color: $red;
        z-index: 100;
        span{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
        }
      }
      .guide-content{
        margin: calc(25/1920*100vw);
        margin-bottom: 0;
        height: auto;
        position: relative;
        min-height: 420px;
        background-color: #000;
        .guide-rside{
          position: absolute;
          top: 30%;
          right: 20px;
          width: auto;
          img{
            @include point(height,42);
            position: relative;
            right: 5%;
            top: 35px;
          }
          .num-content{
            @include arrow-icon;
          }
          .iconright-content{
            width: auto;
            height: auto;
            position: absolute;
            //top: 30%;
            top: 60%;
            right: 0;
            .iconright{
              width: 80px;
              text-align: center;
              margin-top: 30px;
              height: 32px;
              line-height: 30px;
              border-radius: 4px;
              padding: 0 6px;
              background-color: rgba($color: #24293d, $alpha: 0.6);
              .iconpaizhao{
                color: #fff;
                vertical-align:middle;
              }
              span{
                color: #fff;
                font-size: 12px;
                margin-left: 12px;
                vertical-align:middle;
              }
            }
            .en-iconright{
              width: 100px;
              text-align: center;
              margin-top: 30px;
              height: 32px;
              line-height: 30px;
              border-radius: 4px;
              padding: 0 6px;
              background-color: rgba($color: #24293d, $alpha: 0.6);
              .iconpaizhao{
                color: #fff;
                vertical-align:middle;
              }
              span{
                color: #fff;
                font-size: 12px;
                margin-left: 12px;
                vertical-align:middle;
              }
            }
          }
        }
      }
      .video-content{
        height: 420px;
        position: relative;
        margin: calc(25/1920*100vw);
        //@include point(min-width,500);
        //@include point(min-height,408);
        min-height: 420px;
        background-color: #000;
        margin-bottom: 0;
        z-index: 100;
        .getvideo-content{
          position: absolute;
          z-index: 930;
          width: 100%;
          height: 100%;
          background-color: #000;
          .btn-graph {
            position: absolute;
            left: 45%;
            top: 45%;
            display:flex;
            display:-webkit-flex;
            justify-content: center;
            align-items: center;
          }
          #btn-graph-canvas {
            width: 100px;
            height: 100px;
          }
        }
        @media screen and(max-width: 1366px){
          #channelName{
            font-size: 12px;
          }
          .iconright{
            span{
              font-size:12px;
            }
          }
          .en-iconright{
            span{
              font-size:12px;
            }
          }
          .iconright1{
            span{
              font-size:12px;
            }
          }
          .en-iconright1{
            span{
              font-size:12px;
            }
          }
        }
        @media screen and(min-width: 1366px){
          #channelName{
            font-size: 16px;
          }
          .iconright{
            span{
              font-size:14px;
            }
          }
          .en-iconright{
            span{
              font-size:14px;
            }
          }
          .iconright1{
            span{
              font-size:14px;
            }
          }
          .en-iconright1{
            span{
              font-size:14px;
            }
          }
        }
        #previewVideo{
          //@include point(min-width,500);
          //@include point(min-height,405);
          min-height: 420px;
        }
        #channelName{
          position: absolute;
          color: #fff;
          z-index: 10;
          display: block;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: left;
          padding-left: 30px;
          background-color: rgba($color: #24293d, $alpha: 0.6);
        }
        .icon-footer{
          width: 100%;
          height: 45px;
          line-height: 45px;
          position: absolute;
          bottom: 0px;
          color: #fff;
          overflow: hidden;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          z-index: 10;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          .iconlside{
            float: left;
            text-align: left;
            margin-left: 30px;
            .iconplay{
              font-size: 18px;
              cursor: pointer;
              float: left;
            }
          }
        }
        .screen-content{
          display: inline;
          margin-left: 30px;
          position: absolute;
          right: 20px;
          .iconscreen{
            margin-right: 20px;
            font-size: 18px;
            position: relative;
            cursor: pointer;
          }
        }
        .iconright{
          padding: 0 6px;
          width: 80px;
          height: 32px;
          line-height: 30px;
          position: absolute;
          z-index: 900;
          right: 20px;
          margin-bottom: 40px;
          border-radius: 4px;
          text-align: center;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          //top: 40%;
          top: 45%;
          span{
            // font-size: 12px;
            margin-left: 12px;
            color: #fff;
            //margin-right: 35px;
            cursor: pointer;
            vertical-align:middle;
          }
          .iconpaizhao{
            color: #fff;
            cursor: pointer;
            vertical-align:middle;
          }
        }
        .en-iconright{
          padding: 0 6px;
          width: 108px;
          height: 32px;
          line-height: 30px;
          position: absolute;
          z-index: 900;
          right: 20px;
          margin-bottom: 40px;
          border-radius: 4px;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          //top: 40%;
          top: 45%;
          span{
            // font-size: 12px;
            margin-left: 12px;
            color: #fff;
            /*margin-right: 35px;*/
            cursor: pointer;
            vertical-align:middle;
          }
          .iconpaizhao{
            color: #fff;
            cursor: pointer;
            vertical-align:middle;
          }
        }
        .iconright1{
          padding: 0 6px;
          width: 80px;
          height: 32px;
          line-height: 30px;
          position: absolute;
          z-index: 900;
          right: 20px;
          margin-bottom: 40px;
          border-radius: 4px;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          top: 56%;
          text-align: center;
          span{
            margin-left: 12px;
            color: #fff;
            //margin-right: 32px;
            cursor: pointer;
            vertical-align:middle;
          }
          .iconpaizhao{
            color: #fff;
            cursor: pointer;
            vertical-align:middle;
          }
        }
        .en-iconright1{
          padding: 0 6px;
          width: 108px;
          height: 32px;
          line-height: 30px;
          position: absolute;
          z-index: 900;
          right: 20px;
          margin-bottom: 40px;
          border-radius: 4px;
          background-color: rgba($color: #24293d, $alpha: 0.6);
          top: 56%;
          span{
            margin-left: 12px;
            color: #fff;
            //margin-right: 32px;
            cursor: pointer;
            vertical-align:middle;
          }
          .iconpaizhao{
            color: #fff;
            cursor: pointer;
            vertical-align:middle;
          }
        }
      }
      .el-inspect{
        border-left: 1px solid $border;
        border-right: 1px solid $border;
        border-bottom: 1px solid $border;
        margin: 0;
        margin-left: calc(25/1920*100vw);
        margin-right: calc(25/1920*100vw);
        position: relative;
        .inspect-title >>> .el-alert__title{
          font-weight: bold;
          color:#f59f23;
          font-size: 14px;
        }

        .inspect-title >>> .el-alert__icon{
          font-size: 16px;
          margin-right: calc(10/1920*100vw);
        }
        .inspect-title >>> .el-alert__description{
          font-size: 14px;
          margin:0;
        }
        .inspect-title >>> .el-alert__content{
          padding:0;
        }
        .inspect-title{
          .el-alert{
            height:40px;
            line-height: 40px;
            padding-left: calc(35/1920*100vw);
            padding-right: calc(26/1920*100vw);
            vertical-align: middle;
          }
          .info-alert >>> .el-alert__content{
            width:100%;
          }
          .info-alert{
            .info-left{
              float: left;
              color:#182752;
              font-weight: bold;
              font-size:calc(14/1920*100vw);
            }
            .info-right{
              float: right;
              color:#6097f4;
              cursor: pointer;
              img{
                vertical-align: middle;
              }
              span{
                text-decoration: underline;
                margin-left:calc(10/1920*100vw);
                vertical-align: middle;
              }
            }
          }
        }
        .guide-lside{
          position: absolute;
          width: auto;
          z-index: 1000;
          max-width: 330px;
          img{
            @include point(height,42);
            position: relative;
            right: 15%;
          }
        }
        .num-content{
          @include arrow-icon;
        }
        .inspect-header{
          text-align: left;
          font-size: 12px;
          font-weight: bold;
          color: $tab;
          background-color: $background;
          border-bottom:1px solid $border;
          position: relative;
          // z-index: 100;
        }
        @media screen and (min-width: 1600px){
          .inspect-header{
            height: 50px;
            line-height: 50px;
          }
          .inspect-details{
            height: 50px;
            line-height: 50px;
            font-size: 14px;
          }
          .guide-lside{
            top: 10px;
            right: 10%;
          }
        }
        @media screen and (max-width: 1600px){
          .inspect-header{
            height: 40px;
            line-height: 40px;
            span{
              margin-left: 16px !important;
            }
          }
          .inspect-details{
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            span{
              width: 100%;
              display: block;
              white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
              overflow: hidden; //隐藏超出单元格的部分。
              text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
            }
          }
          .guide-lside{
            top: 5px;
            right: 8%;
          }
        }
        .inspect-content{
          padding: 15px auto;
          .Group-content{
            text-align: left;
            .Group-content-title{
              padding-left:calc(35/1920*100vw);
              padding-right:calc(26/1920*100vw);
              height:50px;
              line-height: 50px;
              border-bottom:1px solid #ddd;
              font-size: calc(14/1920*100vw);
              color:$tab;
              cursor: pointer;
              .icon{
                float:right;
                line-height: 50px;
              }
            }
            .Group-content-details{

            }
          }
          .item-content{
            .feedbacks-content{

              .feedbacks-details{

                text-align: left;
                @include point(margin-top,15);
                @include point(margin-bottom,15);
                @include point(padding-left,20);
                @include point(padding-right,15);
                position: relative;
                .feedback-eventname{
                  font-size: 14px;
                  display: block;
                  margin-bottom: 8px;
                  color: $black;
                }
                .feedback-eventdes{
                  font-size: 12px;
                  display: block;
                  margin-bottom: 15px;
                  color: $tab;
                  margin-left: 15px;
                  white-space:pre-wrap;
                }
                .icon-delete-event{
                  position: absolute;
                  right: 0;
                  @include point(margin-right,15);
                  cursor: pointer;
                  color: #fff;
                  background-color: #D9DBE3;
                  border-radius: 50%;

                }
                .img-content{
                  position: relative;
                  width: 140px;
                  height: 100px;
                  margin-left: 15px;
                  .start-icon{
                    position: absolute;
                    left: 35%;
                    top: 30%;
                    cursor: pointer;
                  }
                }
                .feedbacks-hr{
                  border: 0.5px solid $border;
                }
              }
              .title-description{
                cursor: pointer;
              }
            }
          }
          #feedback-content{
            @include point(padding-top,20);
            @include point(margin-left,30);
            text-align: left;
            .feedback-info{
              display: block;
              color: #006ab7;
              font-size: calc(18/1920*100vw);
              font-weight: bold;
              &:last-child{
                @include point(margin-top,30);
              }
            }
          }
          .feed-arrow{
            position: relative;
            @include point(left,30);
          }
          .plus-icon{
            position: absolute;
            @include point(bottom,10);
            @include point(right,30);
            cursor: pointer;
          }
          .inspect-details{
            height:40px;
            line-height: 40px;
            text-align: left;
            padding-left: calc(55/1920*100vw);
            color: $tab;
            border-bottom:1px solid #ddd;
            cursor: pointer;
            background-color: #f9fafe;
            // &:last-child{
            //     margin-bottom: 15px;
            // }
            span{
              width: 100%;
              display: block;
              white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
              overflow: hidden; //隐藏超出单元格的部分。
              text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
            }
          }
          .noraml-title{
            cursor: pointer;
            opacity: 1;
          }
          .ignore-title{
            cursor: not-allowed;
            opacity: 0.5;
          }
          .item-details{
            text-align: left;
            min-height: 60px;
            position: relative;
            padding: 15px;
            @include point(padding-left,20);
            padding-bottom: 0;
            margin-top: 5px;

            .rules{
              margin-left: 20px;
              font-size: 10px;
              margin-top: 5px;
              color: #ff2400;
              display: block;
            }
            &:last-child{
              margin-bottom: 35px;
            }
            .icon-clicked{
              width: 4px;
              min-height: 40px;
              height: calc(100% - 50px);
              position: absolute;
              top:50px;
              background-color: $red;
            }
            @media screen and(max-width:1366px) {
              .titles{
                font-size: 12px;
                width: 50%;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .details-content{
                @include point(font-size,12);
              }
            }
            @media screen and(min-width:1366px) {
              .titles{
                font-size: 14px;
                width: 55%;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .details-content{
                font-size: 12px;
              }
            }
            .details-content{
              // font-size: 12px;
              color: $tab;
              margin-top: 15px;
              span{
                margin-left: 15px;
                display: block;
              }
            }
            .source-content{
              min-height: 110px;
              width: 90%;
              margin: auto 20px;
              .source-details{
                display: inline-block;
                margin-right: 15px;
                padding-top: 15px;
                position: relative;
                span{
                  font-size: 12px;
                  color: #FCB83B;
                  margin-top: 0;
                }
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
                .start-icon{
                  position: absolute;
                  left: 35%;
                  top: 30%;
                  cursor: pointer;
                }
              }
            }
            .des-input{
              margin-left: 15px;
              width:-webkit-calc(100% - 20px);
              width:-moz-calc(100% - 20px);
              width:calc(100% - 20px);
              margin-top: 15px;
            }
            .iconhulve{
              position: absolute;
              color: #ddd;
              font-size: 20px;
              @include point(right,20);
              @include point(top,10);
              cursor: pointer;
            }
            .ignored-icon{
              display:inline-block;
              position: absolute;
              @include point(right,10);
              // @include point(top,10);
              font-size: 12px;
              padding:2px 6px;
              border-radius: 4px;
              color: #fff;
              background-color: $black;
              cursor: not-allowed;
              max-width: 58px;
            }
            .dropdown-model{
              position: absolute;
              @include point(right,50);
              @include point(top,12);
              margin-right: 10px;
              width: 120px;
              height: 22px;
              background-color: transparent;
              z-index: 20;
              cursor: not-allowed;
            }
            .check_scoring{
              box-sizing: border-box;
              position: absolute;
              @include point(right,60);
              @include point(top,12);
              font-size: 12px;
              width: 120px;
              height: 25px;
              line-height: 23px;
              border:1px solid #dcdcdc;
              background-color: #f7f8fc;
              display: inline-block;
              border-radius: 4px;
              margin-top: -2px;
              p{
                margin:0;
                width:58.5px;
                text-align: center;
                display: inline-block;
              }
              p:nth-child(1){
                border-radius: 4px 0 0 4px;
                border-right: 1px solid #dcdcdc;
              }
              p:nth-child(2){
                border-radius: 0 4px 4px 0;
              }
              .check_normal{
                color:#7b8da0;
                font-size: calc(12/1920*100vw);
              }
              .check_isClick{
                background-color:#fcba3f;
                font-size: calc(14/1920*100vw);
                color:#fff;
              }
            }
            .score-menu{
              max-height: 160px;
              overflow: hidden;

            }
          }
          .inspect-empty{
            height: 160px;
            position: relative;
            span{
              position: absolute;
              top: 40%;
              font-size: 12px;
            }
          }
        }
      }
    }
    .rside{
      flex: 1;
      display: flex;
      flex-direction: column;
      .el-header-title{
        text-align: left;
        position: relative;
        color:$black;
        font-size: calc(16/1920*100vw);
        height: 80px;
        line-height: 80px;
        border-bottom: 1px solid $border;
        padding-left: calc(10/1920*100vw);
        span{
          display: block;
          margin-left: calc(30/1920*100vw);
        }
      }
      #storetab-content, #en-storetab-content{
        margin-top: 10px;
        margin-left: calc(20/1920*100vw);
        margin-right: calc(20/1920*100vw);
        .storeList-content{
          padding: 0 10px;
          text-align: left;
          height: 392px;
          color: $black;
          .icon-info{
            color: #FF9803;
            font-size: 12px;
            display: block;
            @include point(margin,5);
            @include point(margin-left,15);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .activeClass{
            background-color: #FDE8EF !important;
            color: $red;
            border-color: $red !important;
          }
          .stores{
            &:last-child{
              @include point(margin-bottom,20);
            }
          }
          .el-search-input{
            @include point(width,200);
            @include point(margin-left,15);
            @include point(margin,15);
            @include point(margin-top,10);
          }
          .storename{
            display: inline-block;
            @include point(margin-left,15);
            margin-top: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
            @include point(width,76);
            @include point(padding,6);
            white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
            overflow: hidden; //隐藏超出单元格的部分。
            text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
          }
          .store-name{
            display: inline-block;
            @include point(margin-left,15);
            margin-top: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
            @include point(width,76);
            @include point(padding,6);
            span{
              width: 100%;
              display: block;
              white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
              overflow: hidden; //隐藏超出单元格的部分。
              text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
            }
          }

          .citys{
            display: block;
            font-size: 14px;
            font-weight: bold;
            @include point(margin-left,20);
          }
        }
      }
      .patrol-select >>> .el-icon--right{
        float:right;
      }
      .patrol-select{
        .patrol-dropdown{
          padding:5px 12px;
          border:1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          .link-span{
            width:calc(220/1920*100vw);
            min-width:100px;
            margin:0;
            display: inline-block;
          }
        }
        .patrol-content{
          .patrol-title{
            font-size:14px;
            color:#182752;
            font-weight: bold;
            margin:30px 0 20px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .channelbar-content{
        .rside-hr{
          width: 100%;
          border: 0.5px solid $border;
        }
        .channel-content{
          width: 100%;
          overflow: hidden;
          margin-top: 10px;
          span{
            display: block;
            text-align: left;
            margin-left: 40px;
            color: $black;
            margin-bottom: 15px;
            font-size: calc(16/1920*100vw);
          }
          .channels-srollbar{
            text-align: left;
            padding: 10px;
            margin-left: 5%;
            overflow: hidden;
            min-height: 115px;
          }
          .arrow-content{
            @include point(min-width,20);
            min-height: 20px;
            float: left;
            margin-top: 20px;
            width: 4%;
          }
          .icon-arrow{
            cursor: pointer;
          }
          .btn-content{
            width: 86%;
            float: left;
            display: flex;
            .btn-details{
              display: inline-block;
              margin-bottom: 5px;
              margin-left: calc(20/1920*100vw);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &:last-child{
                margin-right: calc(20/1920*100vw);
              }
            }
          }
        }
      }
    }
    .group_content {
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      padding: 6px calc(20/1920*100vw);
      margin-right: calc(10/1920*100vw);
      margin-top: calc(10/1920*100vw);
      cursor: pointer;
      font-size: calc(15/1920*100vw);
      line-height: 1.8
    }
    .noraml-color{
      background-color: #006ab7;
      color: #fff;
    }
    .noraml-groupColor{
      background-color: #fff;
      color: #006ab7;
    }
  }
  .patrol-content >>> .el-select .el-input--medium .el-input__inner{
    color:#2b2b2b;
  }
  .no-item {
    height: 40px;
  }
  .title {
    font-size: calc(14 / 1920 * 100vw);
  }
  .store-title {
    font-size: calc(23 / 1920 * 100vw) !important;
  }
  .item-score{
    font-size: calc(12/1920*100vw);
    // width: calc(12/1920*100vw);
    padding: 0 calc(10/1920*100vw);
    height: calc(26/1920*100vw);
    background-color: #edf8f9;
    line-height: calc(26/1920*100vw);
    color: #006ab7;
    border-radius: 4px;
    cursor: pointer;
  }
  .el-dropdown-menu--small .el-dropdown-menu__item {
    width: unset !important;
  }
  .details-failed-record {
    text-align: left;
    font-size: calc(12/1920*100vw);
    color: #006ab7;
  }
  .details-content {
    text-align: left;
    font-size: calc(12/1920*100vw);
    color: #7d8cad;
  }
  .feedback-delete-btn {
    color: #c60957;
    background-color: #fff;
    border: 1px solid #c60957;
    padding: calc(2/1920*100vw) calc(6/1920*100vw);
    border-radius: 3px;
  }
  .cancel-text {
    display: inline;
    font-size: calc(12/1920*100vw);
    color: #556679;
    cursor: pointer;
  }
  .img-content {
    text-align: left;
  }
</style>
<style>
  #storetab-content .el-tabs__nav-scroll{
    width: 100%;
  }

  #storetab-content.el-tabs__item{
    color:#7d8cad !important;
  }
  #storetab-content.el-tabs__item.is-active{
    font-weight: bold !important;
    color: #f31d65 !important;
  }
  #storetab-content.el-tabs__item:hover{
    color: #f31d65 !important;
  }

  @media screen and (min-width: 1366px){
    #storetab-content .el-tabs__nav.is-top{
      margin-left: 10%;
      width: 80%;
    }

  }
  @media screen and (max-width: 1366px){
    #storetab-content .el-tabs__nav.is-top{
      width: 100%;
    }
    span.el-tabs__nav-prev{
      visibility: hidden;
    }
    .el-tabs__nav-next{
        visibility: hidden;
    }
  }
  #storetab-content div#tab-0{
    width:33.33%;
  }
  #storetab-content div#tab-1{
    width:33.33%;
  }
  #storetab-content div#tab-2{
    width:33.33%;
  }
  #storetab-content .el-tabs__active-bar .is-top{
    width: 115px !important;
  }

</style>

<style lang="scss" scoped>
  .channel {
    width: 100%;
    height: calc(40 / 1920 * 100vw);
    padding: calc(8 / 1920 * 100vw) calc(10 / 1920 * 100vw) calc(8 / 1920 * 100vw) calc(16 / 1920 * 100vw);
    border-radius: 5px;
    font-size: calc(15 / 1920 * 100vw);
    border: solid 1px #e6e6e6;
    background-color: #fff;
    color: #69727c;
    display: flex;
    align-items: center;
    img {
      height: calc(24 / 1920 * 100vw);
    }
  }
  .channel-isActive {
    color: #006ab7;
    border: solid 1px #006ab7;
    background-color: #e4f3fd;
  }
  .btn-content{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .btn-details{
      cursor: pointer;
      margin-bottom: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>

<style>
  @import '../../../assets/css/importfile.css';
  @import '../../../assets/css/videoBar.css';
  @import '../../../assets/css/tabsItem.css';
  @import '../../../assets/css/pagination.css';

  .el-test .el-input__inner{
    height: 24px;
    line-height: 24px;
    border-radius: 0px;
    background-color: #34374A;
    color: #fff;
    padding:0 10px;
    border: 0px;
  }
  .el-test .el-input__icon{
    line-height: 24px;
  }
  .el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .des-input .el-textarea__inner{
    font-family:Roboto, Arial, 'Microsoft YaHei';
  }
  /* .score-menu.el-dropdown-menu{
    z-index: 0 !important;
  } */
  .confirmClass{
    width: 28%;
    font-family: Roboto, Arial, 'Microsoft YaHei';
  }
  .confirmClass .el-message-box__header{
    border-bottom: 0.5px solid #dfe2e9;
    padding: 20px;
    padding-bottom: 17px;
    font-size: 14px;
  }
  .confirmClass .el-message-box__content{
    padding: 20px;
  }
  .confirmClass .el-message-box__header .el-message-box__title{
    font-size: 14px;
    line-height: 24px;
  }
  .confirmClass .cancelBtn{
    width: 4.75rem;
    margin-right: calc(20/1920*100vw);
    background-color: #EAEDF2 !important;
    color: #708090 !important;
    font-size: 12px;
    line-height: 12px;
  }
  .confirmClass .confirmBtn{
    width: 4.75rem;
    border: none;
    background-color: #006ab7;
    color: #fff !important;
    font-size: 12px;
    line-height: 12px;
  }
  .confirmClass .el-message-box__btns{
    padding: 20px;
    padding-top: 10px;
  }
  .confirmClass .el-message-box__headerbtn{
    font-size: calc(20/1920*100vw);
    top: 20px;
  }
</style>
