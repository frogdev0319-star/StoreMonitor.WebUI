<template>
  <div class="el-addrute paper flex" id="addInspection" style="flex-direction: column">
    <div class="flex-center padding">
      <div v-if="!showEditTab" style="display:flex;flex-direction:row;margin-right: 20px">
      <div class="tab-name">{{ routeName }}</div>
        <!--<i class="iconfont icon-bianji icon-tabname" @click="editTabName"/>-->
        <img :src="require('../../../../static/img/table-edit.png')" style="width:24px;height:24px;cursor:pointer;margin-left:8px;" @click="editTabName" />
      </div>
      <el-input v-if="showEditTab" :size="varyWindowWidth>1600?'small':'mini'"
                :placeholder="$t('insSettingView.enterListName')" v-model="editRouteName" class="tabName-input"
                @input="RouteNameLength"/>
      <div v-if="showEditTab" class="flex-center">
        <div class="iconlised" @click="confirmEditTab">
          <i class="el-icon-check"/>
        </div>
        <div class="iconrised" @click="cancelEditTab">
          <i class="el-icon-close"/>
        </div>
      </div>
      <div class="spacer"></div>
      <el-button
        class="storevue-button-filled"
        @click="submitBindTitle">
        {{ $t('remotePatrol.submit') }}
      </el-button>
      <span v-if="showLengthNameWarning" class="warningtips">{{ $t('insSettingView.enterNameRuletip') }}</span>
    </div>
    <hr class="hr-horizontal">
    <div class="flex padding">
      <div class="temp-select-area">
          <div class="temp-select-label">{{ $t('insSettingView.selecttitle') }}</div> 
          <multi-select
          class="store-group-select region"
          :selected="ModelPost"
          :prompt-msg="$t('remotePatrol.all')"
          :all-select="0"
          :alltype="0"
          :options="titleList"
          @changeInput="changeSelect(arguments)"/>
          <!--<multi-select
            :options="titleList"
            :placeholder="$t('insSettingView.selectPost')"
            :selected="ModelPost"
            :prompt-msg="$t('remotePatrol.all')"
            :all-select="0"
            :alltype="0"
            @changeInput="changeSelect(arguments)"/>-->
      </div>
    </div>
    <hr class="hr-horizontal">
    <div class="prompt-content" v-if="showDragInfo && groupList.length > 0">
      <div class="prompt-info">
        <img :src="dragTopImgSrc" class="prompt-image image-top" alt="">
        <div class="prompt-msg">{{ $t('titleView.draggableInfo') }}</div>
        <img :src="dragLeftImgSrc" class="prompt-image image-left" alt="">
      </div>
    </div>
    <div class="flex spacer">
      <div class="el-rute-group">
        <div class="group-content" style="height: 100%; display: flex; flex-direction: column;">
          <div class="title-content">
            <span class="level2"><span class="level2-name">{{ groupTitle }}</span></span>
            <div class="btn-content">
              <delay-button
                class="inspction-btn"
                @click="addInspectCatergory"
              >
                <i class="el-icon-plus"/>
                <span>{{ $t('insSettingView.addCategory') }}</span>
              </delay-button>
            </div>
          </div>
          <div id="el-menuscrollbar" class="spacer">
            <div class="group-items group-title" style="height: 100%; display: flex; flex-direction: column;">
              <div class="top-group-title">
                <div class="group-name-title">
                  <el-tabs id="group-content" class="tab-routeDetail" v-model="activeSheetName" @tab-click="handleSheetClick">
                    <el-tab-pane v-for="(item,index) in sheetName" :key="index" :label="item.label" :name="item.id"/>
                  </el-tabs>
                </div>
              </div>
              <draggable class="spacer" style="background-color: #f7f9fa;" v-model="groupList" @update="handleUpdateCategorySequence">
                <template v-for="(item,index) in groupList">
                  <div :key="index" :class="item.id === activeParentId?'noraml-color':'noraml-groupColor'"
                      class="groupItem" @click="clickCategory(index,item)"
                      @mouseenter="onShowCategoryEditBtn(index,item)">
                    <div class="category-list">
                      <div class="category-name">
                        <div class="group-left">
                          <div v-if="activeParentId === item.id && !item.children" class="proper-flag"/>
                          <div>
                            <span :style="activeParentId === item.id?{'color':'#006ab7'}:{}">
                              {{ item.name }}（{{ item.groupNum }}）
                            </span>
                          </div>
                        </div>
                        <div class="group-right">
                          <div class="show-edit">
                            <div class="nape-items-handle" v-if="hoverId === item.id">
                              <img style="margin-top:15px" :src="`./static/img/table-edit.png`" height="26px" @click="editCategory(index,item)"/>
                              <img style="margin-top:15px" :src="`./static/img/table-delete.png`" height="26px" @click="deleteGroup(index, item)"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="activeParentId === item.id">
                        <draggable v-model="item.children" :group="{name: 'children'}"
                                  @start="getSubCategorySequence(item.children)"
                                  @update="handleUpdateSubCategorySequence(item.children)">
                          <div v-for="(childItem, childIndex) in item.children" :key='`child-${childIndex}`' class="groupItem">
                            <div :key="index" :class="childItem.isClick ? 'noraml-color':'noraml-groupColor'"
                                class="groupItem" @click.stop="clickSubCategory(index, item.id, childIndex,childItem)"
                                @mouseenter="onShowSubcategoryEditBtn(childIndex, childItem)">
                              <div v-if="activeChildId === childItem.id" class="proper-flag"/>
                              <div class="category-name">
                                <div class="group-left">
                                  <div class="subcatergy-item">
                                    <span :style="activeChildId === childItem.id?{'color':'#006ab7'}:{}">
                                      {{ childItem.name }}
                                    </span>
                                  </div>
                                </div>
                                <div class="group-right">
                                  <div class="show-edit">
                                    <div v-if="hoverId === childItem.id" class="nape-items-handle">
                                      <i
                                        class="iconfont icon-bianji"
                                        style="cursor:pointer;"
                                        @click="editCategory(childIndex,childItem)"/>
                                      <i
                                        class="iconfont icon-shanchu"
                                        style="cursor:pointer;"
                                        @click="deleteGroup(childIndex, childItem, item)"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </draggable>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
      <div class="el-rute-nape spacer">
        <div class="nape-content">
          <div class="title-content">
            <span :class="lang.indexOf('zh') === -1 ? 'en-item-title': 'item-title'" class="level2">
            <span class="level2-name">{{ napeTitle }}</span></span>
            <div class="btn-content">
              <delay-button
                :disabled="groupList.length === 0"
                class="inspction-btn"
                @click="deleteNape"
              >
                <span>{{ $t('insSettingView.deleteInsItem') }}</span>
              </delay-button>
              <delay-button
                :disabled="groupList.length === 0"
                class="inspction-btn"
                @click="addNape"
              >
                <i class="el-icon-plus"/>
                <span>{{ $t('insSettingView.addInsItem') }}</span>
              </delay-button>
            </div>
          </div>
          <div id="el-menuscrollbar" style="height:100%;">
            <div class="nape-items">
              <draggable-table
                :is-score-sheet= "activeSheetName === '1'"
                :table-header="activeSheetName === '1' ? scoreTableHeader:passFailTableHeader"
                :table-data="napeList"
                @handleEditItem="handleEdit"
                @handleDeleteItem="handleDelete"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog-pop
      v-if="showAddNape"
      :title="updateType.type===0?$t('insSettingView.addTitleItem'):$t('insSettingView.editTitleItem')"
      :visible.sync="showAddNape"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :is-warning="true"
      @cancelHandler="showAddNape = false"
      @confirmHandler="confirmUpdateNape">
      <div class="dialog-content padding">
        <el-form class="NapeForm" label-position="top" size="mini">
          <el-form-item style="margin-bottom: 20px">
            <div class="score_item">
              <span class="sign">*</span>
              <span class="item_label">{{$t('insSettingView.inspectName')}}</span>
            </div>
            <el-input v-model="ItemName"
                      :placeholder="$t('insSettingView.enterItemName')"
                      @input="napeNameChange"></el-input>
            <span v-if="enterListNameRuletip" class="rules">{{ $t('insSettingView.enterListNameRuletip') }}</span>
            <span v-if="enterItemNameTip" class="rules">{{ $t('insSettingView.itemTitleEmpty') }}</span>
          </el-form-item>
          <el-form-item>
            <div class="score_item">
              <span class="sign">*</span>
              <span class="item_label">必填</span>
            </div>
            <el-radio-group class="attribute-group" v-model="itemRequired">
              <el-radio label="1">必填</el-radio>
              <el-radio label="0">非必填</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="score_item">
              <span class="sign">*</span>
              <span class="item_label">{{$t('insSettingView.inspectItemType')}}</span>
            </div>
            <el-radio-group class="attribute-group" v-model="itemType">
              <div v-for="(typeItem, typeIndex) in itemsTypeList" :key="typeItem.value" style="display: inline-flex">
                <el-radio :label="typeItem.value" :key="typeIndex">{{typeItem.label}}</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <div v-if="itemType === 0" class="score-content">
            <el-form-item v-if="activeSheetName==='1'" style="margin-bottom: 20px">
              <div class="score_item">
                <span class="sign">*</span>
                <span class="item_label">{{$t('insSettingView.sheetscore3')}}</span>
                <span class="item_des">{{$t('insSettingView.sheetscore3_des')}}</span>
              </div>
              <el-input v-model="ItemScoreOption"
                        :placeholder="$t('insSettingView.enterScore')"
                        @input="napeScoreOptionsChange"></el-input>
              <span v-if="ScoreOptionsTips0" class="rules">{{ $t('insSettingView.excelScoreItemEmpty') }}</span>
              <span v-if="ScoreOptionsTips1" class="rules">{{ $t('insSettingView.setScoreItemRange') }}</span>
            </el-form-item>
            <el-form-item v-if="activeSheetName==='1'" style="margin-bottom: 20px">
              <el-col :span="10">
                <el-form-item style="margin-bottom: 20px;">
                  <div class="score_item">
                    <span class="sign">*</span>
                    <span class="item_label">{{$t('insSettingView.sheetscore0')}}</span>
                  </div>
                  <el-input v-model.number="ItemTotalScore" disabled
                            :placeholder="$t('insSettingView.enterScore')"
                            @input="napeTotalScoreChange"/>
                  <span v-if="ItemTotalScoreTip0" class="rules">{{ $t('insSettingView.setFullScoreEmpty') }}</span>
                  <span v-if="ItemTotalScoreTip1" class="rules">{{ $t('insSettingView.setFullScoreRange') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="2">
                <el-form-item :label="$t('insSettingView.sheetscore1')" style="margin-bottom: 20px;">
                  <el-input v-model.number="ItemMinScore"
                            :placeholder="$t('insSettingView.enterScore')"
                            @input="napeMinScoreChange"/>
                  <span v-if="ItemMinScoreTip" class="rules">{{ $t('insSettingView.setMinScoreRange') }}</span>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item v-if="activeSheetName!=='1'">
              <div class="score_item">
                <span v-if="activeSheetName==='2'" class="sign">*</span>
                <span class="item_label">{{$t('insSettingView.score')}}</span>
              </div>
              <el-input v-model.number="ItemSheetScore"
                        :placeholder="$t('insSettingView.enterScore')"
                        @input="napeSheetScoreChange"/>
              <span v-if="PFScoreTip" class="rules">{{ $t('insSettingView.setPassFileRange') }}</span>
              <span v-if="OtherScoreTip" class="rules">{{ $t('insSettingView.setOtherRange') }}</span>
              <span v-if="OtherScoreTipEmpty" class="rules">{{ $t('insSettingView.setOtherEmpty') }}</span>
            </el-form-item>
          </div>
          <el-form-item :label="$t('insSettingView.inspectionDescp')">
            <el-input type="textarea" v-model="ItemDescription"
                      :placeholder="$t('insSettingView.description')"
                      @input="napeDepChange"></el-input>
            <span v-if="descriptionRuletip" class="rules">{{ $t('insSettingView.descriptionRuletip') }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showAddNape = false">{{ $t('insSettingView.cancel') }}</el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="confirmUpdateNape">{{ $t('insSettingView.confirm') }}</el-button>
      </div>
    </dialog-pop>
    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :is-warning="true"
      :visible="showDeleteItem"
      @visibleChangeHandler="updateDeleteItemDialogFlag"
      @cancelHandler="hideDeleteItemDialog"
      @confirmHandler="confirmDeleteItem"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('insSettingView.confirmCurDel') }}</div>
      </div>
    </dialog-pop>
    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showDeleteGroup"
      :show-close="false"
      :is-warning="true"
      @visibleChangeHandler="updateDeleteGroupDialogFlag"
      @cancelHandler="hideDeleteGroupDialog"
      @confirmHandler="confirmDeleteGroup"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('insSettingView.deleteGroup') }}</div>
      </div>
    </dialog-pop>
    <dialog-pop
      v-if="showAddGroup"
      :title="isEditCategory ? $t('insSettingView.updateCategory') : $t('insSettingView.addCategory')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showAddGroup"
      :show-close="false"
      :is-warning="true"
      @visibleChangeHandler="hideAddGroupDialog"
      @cancelHandler="hideAddGroupDialog"
      @confirmHandler="confirmHandleCategory">
      <div class="padding">
        <validate-input
          :placeholder="$t('insSettingView.enterName')"
          :input-limit-length="30"
          :out-limit-prompt-msg="$t('insSettingView.enterNameRuletip')"
          :empty-prompt-msg="$t('insSettingView.enterName')"
          :input-name="groupNameInput"
          @getInputValue="getInputCatergyName"
        >
          <div slot class="dialog-form-item-name">
            <span class="required-name">*</span>
            <span>{{ $t('insSettingView.catergyName') }}</span>
          </div>
        </validate-input>
        <div class="dialog-form-item">
          <div class="dialog-form-item-name">
            <span>{{ $t('insSettingView.parentCatergyName') }}</span>
            <icon-tooltip :is-catergy-setting="true" placement="right">
              <i class="iconfont icon-bangzhu iconbangzhu"/>
            </icon-tooltip>
          </div>
          <el-select v-model="parentId" style="width:100%" size="mini" :disabled="notAllowedChangeParentId">
            <el-option v-for="(catergy, index) in parentCatergoryList"
                       :key="index"
                       :label="catergy.label" :value="catergy.value"></el-option>
          </el-select>
        </div>
      </div>
    </dialog-pop>
  </div>
</template>

<script>
import util from '@/common/util';
import { inpectRESTful, titleRESTful } from '@/api/index';
import PubSub from 'pubsub-js';
import filterString from '@/common/filterString';
import MultiSelect from '@/components/MultiSelect';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { getScheduleListService } from '@/api/schedule';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';
import ValidateInput from "@/components/ValidateInput";
import IconTooltip from "@/components/IconTooltip";
import DraggableTable from "@/components/DraggableTable";
import draggable from 'vuedraggable';


export default {
  name: 'AddRuteInspect',
  components: {
    DraggableTable,
    IconTooltip,
    ValidateInput,
    DialogPop,
    DelayButton,
    MultiSelect,
    RegionMultiSelect,
    draggable
  },
  data() {
    return {
      sheetTemp:[],
      dialogTitle:'',
      updateType:null,
      ItemName:'',
      ItemTotalScore:50,
      ItemMinScore:50,
      ItemSheetScore:0,
      ItemScoreOptions:[],
      ItemScoreOption:'',
      ItemDescription:'',
      PFScoreTip:false,
      enterItemNameTip:false,
      enterScoreTip:false,
      ItemMinScoreTip:false,
      OtherScoreTipEmpty:false,
      ItemTotalScoreTip0:false,
      ItemTotalScoreTip1:false,
      ScoreOptionsTips0:false,
      ScoreOptionsTips1:false,
      firstLoad: true,
      groupTitle: this.$t('insSettingView.category'),
      tabName: '',
      ModelPost: [],
      ModelAddPost: [],
      groupList: [],
      activeSheetName: '',
      groupNameInput: '',
      napeTitle: '',
      showEditTab: false,
      napeList: [],
      napeDepTemp: '',
      showAddGroup: false,
      enterNameRuletip: false,
      enterListNameRuletip: false,
      descriptionRuletip: false,
      showAddNape: false,
      newNapeChecked: false,
      newNapeName: '',
      groupIndex: 0,
      curGroup: '',
      showDeleteItem: false,
      showDeleteGroup: false,
      deleteItemFlag: '',
      curItemId: '',
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      bindStoreList: [],
      lang: this.$i18n.locale,
      routeName: '',
      routeData: '',
      showLengthNameWarning: false,
      editRouteName: '',
      titleList: [],
      groupIds: [],
      sheetName: [
        { id: '0', label: this.$t('insSettingView.sheetpassfail') },
        { id: '1', label: this.$t('insSettingView.sheetscore') },
        { id: '2', label: this.$t('insSettingView.sheetother') }
      ],
      allRoutedata: [],
      typeTemp: [],
      passFailTableHeader: [
        {
          name: this.$t('insSettingView.inspectName'),
          headerStyle:{
            width: '30%',
            textAlign: 'left',
            marginLeft: 'calc(30/1920*100vw)'
          },
        },
        {
          name: this.$t('insSettingView.inspectionDescp'),
          headerStyle:{
            width: '45%',
            textAlign: 'left'
          },
        },
        {
          name: this.$t('insSettingView.score'),
          headerStyle:{
            width: '12.5%'
          },
        },
        {
          name: this.$t('insSettingView.operation'),
          headerStyle:{
            width: '12.5%'
          },
        },
      ],
      scoreTableHeader: [
        {
          name: this.$t('insSettingView.inspectName'),
          headerStyle:{
            width: '25%',
            marginLeft: 'calc(30/1920*100vw)',
            textAlign: 'left'
          },
        },
        {
          name: this.$t('insSettingView.inspectionDescp'),
          headerStyle:{
            width: '25%',
            textAlign: 'left'
          },
        },
        {
          name: this.$t('insSettingView.sheetscore0'),
          headerStyle:{
            width: '12.5%'
          },
        },
        {
          name: this.$t('insSettingView.sheetscore3'),
          headerStyle:{
            width: '12.5%'
          },
        },
        {
          name: this.$t('insSettingView.sheetscore1'),
          headerStyle:{
            width: '12.5%'
          },
        },
        {
          name: this.$t('insSettingView.operation'),
          headerStyle:{
            width: '12.5%'
          },
        },
      ],
      showSubCatergy: false,
      parentId: -1,
      parentCatergoryList: [],
      itemsTypeList: [
        {
          label: this.$t('insSettingView.evaluationType'),
          value: 0
        },
        {
          label: this.$t('insSettingView.remarksType'),
          value: 1
        }
      ],
      activeParentId: -1,
      activeChildId: -1,
      isEditCategory: false,
      hoverId: '',
      notAllowedChangeParentId: false,
      ifClickSubCategory: false,
      itemRequired: '0',
      itemType: 0,
      childIndex: -1,
      oldGroupSequence: [],
      newGroupSequence: [],
      oldSubcategorySequence: [],
      newSubcategorySequence: [],
      activeId: -1,
      dragLeftImgSrc: require('../../../../static/img/arrows_left.png'),
      dragTopImgSrc: require('../../../../static/img/arrows_top.png'),
      showDragInfo: true
    };
  },
  computed: {
    varyDivHeight: function() {
      if (this.varyWindowHeight > 800) {
        return this.varyWindowHeight * 0.72;
      } else if (this.varyWindowHeight > 700) {
        return this.varyWindowHeight * 0.67;
      } else {
        return this.varyWindowHeight * 0.65;
      }
    }
  },

  mounted() {
    this.initData();
    this.getTitleList();
    document.getElementById('addInspection').addEventListener('mousedown', this.notShowDragInfo, false);
  },

  destroyed() {
    sessionStorage.removeItem('itemSettingData');
  },

  methods: {
    notShowDragInfo() {
      this.showDragInfo = false;
      document.getElementById('addInspection').removeEventListener('mousedown', this.notShowDragInfo);
    },

    getTitleList() {
      this.getUserTitleList().then(res => {
        let listArray = [];
        res.data.forEach(item => {
          listArray.push({
            label: item.title,
            value: item.id,
            disabled: false
          });
        });
        this.titleList = listArray;
      })
        .catch(err => {
          console.log('AddRuteInspect-getTitleList: ' + err);
        });
    },

    getUserTitleList() {
      return new Promise((resolve, reject) => {
        titleRESTful.getUserTitleList().then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    editTabName() {
      const self = this;
      self.showEditTab = true;
      self.editRouteName = self.routeName;
    },

    RouteNameLength(val) {
      const self = this;
      const content = filterString.all(val, 30);
      const length = filterString.getContentLength(val);
      self.editRouteName = content;
      if (length > 30) {
        self.showLengthNameWarning = true;
      } else {
        self.showLengthNameWarning = false;
      }
    },

    confirmEditTab() {
      const self = this;
      if (self.editRouteName === '') {
        util.notify(self.$t('insSettingView.enterListName'), 'warning', 3000);
        return false;
      }
      const params = {
        inspectId: self.routeData[0].inspectId,
        name: self.editRouteName
      };
      inpectRESTful.UpdateInspectGroupTag(params).then(res => {
        if (res.errCode === 0) {
          self.showEditTab = false;
          self.routeName = self.editRouteName;
          self.showLengthNameWarning = false;
          util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          return false;
        } else {
          util.notify(self.$t('remotePatrol.Patroltips2'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        console.log('AddRuteInspect-confirmEditTab: ' + err);
      });
    },

    cancelEditTab() {
      const self = this;
      self.showEditTab = false;
    },

    handleSheetClick() {
      this.showAddGroup = false;
      this.showAddNape = false;
      this.activeChildId = -1;
      this.activeParentId = -1;
      this.getGroupList(0);
    },

    clickCategory(index, item) {
      this.groupIndex = index;
      this.activeParentId = item.id;
      if(!item.children){
        this.activeChildId = -1;
        this.setItemTitle(item.name);
        this.curGroup = item;
        this.showAddNape = false;
        this.getItemsList(index, item);
      } else {
        item.isClick = !item.isClick;
        this.activeChildId = item.children[0].id;
        this.setItemTitle(item.children[0].name);
        this.getItemsList(index, item.children[0]);
      }
    },

    setItemTitle(name){
      if (this.lang.indexOf('zh') === -1) {
        this.napeTitle = `${this.$t('insSettingView.itemsOfCate')} ${name}`;
      } else {
        this.napeTitle = `${name} ${this.$t('insSettingView.itemsOfCate')}`;
      }
    },

    clickSubCategory(index, itemId, subCategoryIndex, subCategoryItem){
      this.ifClickSubCategory = true;
      this.activeChildId = subCategoryItem.id;
      this.childIndex = subCategoryIndex;
      this.curGroup = subCategoryItem;
      this.setItemTitle(subCategoryItem.name);
      this.getItemsList(subCategoryIndex, subCategoryItem);
    },

    getInspectGroupBindAll(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectGroupBindList(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async submitBindTitle() {
      const self = this;
      let resBindGroup = null, resUnbindGroup = null;
      let paramsBind = {};
      let paramsUnbind = {};
      let titleIds = [];
      if (self.ModelPost[0] === '-1') {
        titleIds = self.ModelPost.slice(1);
      } else {
        titleIds = self.ModelPost;
      }
      const postparams = {
        groupIds: self.groupIds
      };
      const postBind = await self.getInspectGroupBindAll(postparams);
      const groupItems = [];
      postBind.forEach(b_item => {
        const obj = {
          groupId: '',
          titleIds: []
        };
        obj.groupId = b_item.groupId;
        b_item.userTitles.forEach(user_item => {
          obj.titleIds.push(user_item.titleId);
        });
        groupItems.push(obj);
      });
      const groupBindItems = [];
      let bindtitleIds = [];
      if (self.ModelPost[0] === '-1') {
        bindtitleIds = self.ModelPost.slice(1);
      } else {
        bindtitleIds = self.ModelPost;
      }
      self.allRoutedata.forEach(a_item => {
        a_item.forEach(g_item => {
          const obj = {
            groupId: '',
            titleIds: []
          };
          obj.groupId = g_item.id;
          obj.titleIds = bindtitleIds;
          groupBindItems.push(obj);
        });
      });
      paramsUnbind = {
        groupItems: groupItems
      };
      paramsBind = {
        groupItems: groupBindItems
      };
      if (postBind[0].userTitles.length !== 0) {
        resUnbindGroup = await self.unbindGroup(paramsUnbind);
        if (resUnbindGroup.errMsg === 'Success' && bindtitleIds.length !== 0) {
          resBindGroup = await self.bindGroup(paramsBind);
        } else if (resUnbindGroup.errMsg === 'Success' && titleIds.length === 0) {
          util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          self.refreshData(self.groupIndex);
          return false;
        }
      } else {
        if (bindtitleIds.length !== 0) {
          resBindGroup = await self.bindGroup(paramsBind);
        } else if (bindtitleIds.length === 0) {
          util.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          return false;
        }
      }
      if (resBindGroup.errMsg === 'Success') {
        util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
        self.refreshData(self.groupIndex);
      } else {
        util.notify(self.$t('deviceView.editFail'), 'warning', 3000);
        return false;
      }
    },

    async confirmEditGroup(index, item) {
      const self = this;
      const temp = [];
      if (item.name == null || item.name.length === 0) {
        util.notify(self.$t('insSettingView.titleEmpty'), 'warning', 3000);
        return false;
      }
      const obj = {
        id: item.id,
        name: item.name,
        tag: self.tabName
      };
      temp.push(obj);
      const params = {
        'groups': temp
      };
      let resUpdateGroup = null;
      resUpdateGroup = await self.updateGroup(params);
      if (resUpdateGroup.errMsg === 'Success') {
        util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
        item.isEdit = false;
        self.refreshData(self.groupIndex);
      } else {
        util.notify(self.$t('deviceView.editFail'), 'warning', 3000);
        return false;
      }
    },

    updateGroup(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.updateInspectGroup(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    unbindGroup(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.UnbindInspectGroupAndTitle(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    bindGroup(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.BindInspectGroup(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addInspectCatergory() {
      this.showAddGroup = true;
      this.groupNameInput = '';
      this.parentId = -1;
      this.isEditCategory = false;
      this.notAllowedChangeParentId = false;
      this.getParentCatergoryList();
    },

    getParentCatergoryList() {
      this.parentCatergoryList = [];
      let parentCatergoryList = this.groupList.filter(item => item.children || (!item.children && item.items.length === 0));
      parentCatergoryList = this.isEditCategory ? parentCatergoryList.filter(item => this.activeId !== item.id) : parentCatergoryList;
      parentCatergoryList.forEach(item => {
        const catergoryObj = {};
        catergoryObj.label = item.name;
        catergoryObj.value = item.id;
        this.parentCatergoryList.push(catergoryObj);
      })
      this.parentCatergoryList.unshift({
        label: this.$t('insSettingView.no'),
        value: -1
      });
    },

    changeSelect(val) {
      this.ModelPost = Array.from(val)[0];
    },

    async confirmHandleCategory() {
      const self = this;
      if (self.groupNameInput.trim().length === 0) {
        util.notify(self.$t('insSettingView.titleEmpty'), 'warning', 3000);
        return false;
      }
      let mode = 0;
      const tabIndex = sessionStorage.getItem('TabIndex');
      mode = tabIndex === '0' ? 1 : (tabIndex === '1' ? 0 : 1);
      this.isEditCategory ? this.updateInspectGroup() : this.addInspectGroup(mode);
    },

    cancelAddGroup() {
      const self = this;
      self.showAddGroup = false;
    },

    async updateInspectGroup() {
      const params = {
        'groups': [{
          id: this.activeId,
          name: this.groupNameInput,
          tag: this.tabName,
          parentId: this.parentId
        }]
      };
      let resUpdateGroup = await this.updateGroup(params);
      this.showAddGroup = false;
      if (resUpdateGroup.errCode === 0) {
        util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
        this.refreshData(this.groupIndex);
      } else {
        util.notify(this.$t('deviceView.editFail'), 'warning', 3000);
        return false;
      }
    },

    addInspectGroup(mode){
      const temp = [];
      const obj = {
        name: this.groupNameInput,
        mode: mode,
        tag: this.tabName,
        type: Number(this.activeSheetName),
        parentId: this.parentId
      };
      temp.push(obj);
      const params = {
        'groups': temp
      };
      inpectRESTful.addInspectGroup(params).then(res => {
        if (res.errCode === 0) {
          let titleIds = [];
          if (this.ModelPost[0] === '-1') {
            titleIds = this.ModelPost.slice(1);
          } else {
            titleIds = this.ModelPost;
          }
          if (titleIds.length !== 0) {
            const paramsBind = {
              groupItems: [{
                groupId: res.data[0],
                titleIds: titleIds
              }]
            };
            this.bindGroup(paramsBind);
          }
          if(this.parentId !== -1) {
            this.activeParentId = this.parentId;
            this.activeChildId = res.data[0];
            this.refreshData(this.groupIndex);
          } else {
            this.activeParentId = res.data[0];
            this.refreshData(this.groupList.length);
          }
          this.groupNameInput = '';
          this.showAddGroup = false;
          util.notify(this.$t('insSettingView.addSuss'), 'success', 3000);
        } else {
          util.notify(this.$t('insSettingView.addFail'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        util.notify(this.$t('insSettingView.addFail'), 'warning', 3000);
        console.log(err);
      });
    },

    onShowCategoryEditBtn(index, item) {
      this.hoverId = item.id;
    },

    onShowSubcategoryEditBtn(index, item) {
      this.hoverId = item.id;
    },

    editCategory(index, item) {
      item.isEdit = true;
      item.showEdit = false;
      this.notAllowedChangeParentId = !((item.parentId === -1 && !item.children) || item.parentId !== -1);
      this.groupNameInput = item.name;
      this.isEditCategory = true;
      this.parentId = item.parentId;
      this.showAddGroup = true;
      this.activeId = item.id;
      this.getParentCatergoryList();
    },

    deleteItemData(idArr) {
      const self = this;
      const params = { 'itemIds': idArr };
      return new Promise((resolve, reject) => {
        inpectRESTful.deleteInspectItem(params).then(res => {
          const errMsg = res.errMsg;
          resolve(errMsg);
        });
      });
    },

    deleteGroupData(idArr) {
      const self = this;
      const params = { 'groupIds': idArr };
      return new Promise((resolve, reject) => {
        inpectRESTful.deleteInspectGroup(params).then(res => {
          const errMsg = res.errMsg;
          resolve(errMsg);
        }).catch(e => {
          reject(e);
        });
      });
    },

    async deleteGroup(index, item, parentItem) {
      const self = this;
      if (self.groupList.length === 1) {
        if (self.typeTemp.length === 1) {
          const params = {};
          params.category = parseInt(self.routeData[0].mode);
          const bindSchedule = await self.getScheduleFromDB(params);
          const arrtemp = [];
          bindSchedule.forEach(item => {
            if (item.extra != null) {
              arrtemp.push(item.extra.inspectId);
            }
          });
          if (arrtemp.indexOf(self.routeData[0].inspectId) !== -1) {
            util.notify(self.$t('insSettingView.deletebindSchedule'), 'warning', 3000);
            return false;
          }
        }
      }
      self.showDeleteGroup = true;
      !parentItem && (self.curGroup = item);
    },

    getScheduleFromDB(params) {
      return new Promise((resolve, reject) => {
        getScheduleListService(params).then(res => {
          const data = res.data;
          resolve(data);
        });
      });
    },

    async confirmDeleteGroup() {
      const self = this;
      const idGroupArr = [];
      const subCategoryArr = [];
      const idItemArr = [];
      if (self.curGroup.parentId === -1){
        if(self.curGroup.children){
          idGroupArr.push(self.curGroup.id);
          self.curGroup.children.forEach(subCatergyItem => {
            subCategoryArr.push(subCatergyItem.id);
            subCatergyItem.items.forEach(inspectItem => {
              idItemArr.push(inspectItem.id);
            })
          })
        } else {
          idGroupArr.push(self.curGroup.id);
          self.curGroup.items.forEach(item => {
            idItemArr.push(item.id);
          });
        }
      } else {
        idGroupArr.push(self.curGroup.id);
        self.curGroup.items.forEach(item => {
          idItemArr.push(item.id);
        });
      }
      self.showDeleteGroup = false;
      try {
        idItemArr.length > 0 && await self.deleteItemData(idItemArr);
        subCategoryArr.length > 0 && await self.deleteGroupData(subCategoryArr);
        idGroupArr.length > 0 && await self.deleteGroupData(idGroupArr);

        if (self.groupList.length === 1) {
          self.groupList = [];
          self.napeList = [];
          self.napeTitle = '';
        } else {
          let index = 0;
          index = self.groupIndex === 0 ? self.groupIndex : self.groupIndex - 1;
          if(self.curGroup.parentId === -1){
            this.activeParentId = -1;
            this.activeChildId = -1;
            index = self.groupIndex === 0 ? self.groupIndex : self.groupIndex - 1;
          } else {
            const category = self.groupList.filter(category => category.id === this.activeParentId);
            if (category && category[0].children.length  === 1){
              this.activeParentId = -1;
              this.activeChildId = -1;
              index = self.groupIndex === 0 ? self.groupIndex : self.groupIndex - 1;
            } else {
              this.activeParentId = self.curGroup.parentId;
              const childIndex = self.childIndex === 0 ? self.childIndex+1 : self.childIndex - 1;
              this.activeChildId = category[0].children[childIndex].id;
              index = self.groupIndex;
            }
          }
          self.refreshData(index);
        }
        util.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
      } catch (e) {
        util.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
        return false;
      }
      if (self.typeTemp.length === 1 && self.groupList.length === 0) {
        self.$router.push({ name: 'inspectSetting', params: { val: 'del' }});
      }
    },

    updateDeleteGroupDialogFlag(val) {
      this.showDeleteGroup = val;
    },

    hideDeleteGroupDialog() {
      this.showDeleteGroup = false;
    },

    addNape() {
      const self = this;
      self.showAddNape = true;
      self.updateType = {type:0};
      self.setDialogContent();
      self.ItemSheetScore = self.activeSheetName === '0' ? '' : 0;
    },

    deleteNape(item) {
      const self = this;
      let count = 0;
      self.napeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      if (count === 0) {
        util.notify(self.$t('insSettingView.selectItems'), 'warning', 3000);
        return false;
      }
      self.showDeleteItem = true;
      self.deleteItemFlag = 'G';
    },

    async confirmDeleteItem() {
      const self = this;
      const idArr = [];
      switch (self.deleteItemFlag) {
        case 'S': idArr.push(self.curItemId); break;
        case 'G':
          self.napeList.forEach(item => {
            if (item.checked) {
              idArr.push(item.id);
            }
          });
          break;
      }
      const errMsg = await self.deleteItemData(idArr);
      if (errMsg != undefined && errMsg === 'Success') {
        util.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
        self.showDeleteItem = false;
        self.refreshData(self.groupIndex);
        self.groupList[self.groupIndex].groupNum -= idArr.length;
      } else {
        util.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
        return false;
      }
    },

    updateDeleteItemDialogFlag(val) {
      this.showDeleteItem = val;
    },

    hideDeleteItemDialog() {
      this.showDeleteItem = false;
    },

    setDialogContent() {
      const self = this;
      self.ItemName = '';
      self.ItemTotalScore = 50;
      self.ItemMinScore = 50;
      self.ItemSheetScore = 0;
      self.ItemScoreOptions = [];
      self.ItemScoreOption = '';
      self.ItemDescription = '';
      self.PFScoreTip = false;
      self.enterItemNameTip = false;
      self.ItemMinScoreTip = false;
      self.OtherScoreTip = false;
      self.OtherScoreTipEmpty = false;
      self.ItemTotalScoreTip0 = false;
      self.ItemTotalScoreTip1 = false;
      self.ScoreOptionsTips0 = false;
      self.ScoreOptionsTips1 = false;
      this.itemType = 0;
    },

    getFloat (value) {
      let str = value.toString();
      let strIndex = str.indexOf('.');
      if (strIndex === -1){return str};
      str = str.substring(0, strIndex + 2);
      return str;
    },

    getUtilScore(val,type){
      // type 0 : Nonnegative number , type 1 : negative
        val = type===0 ? val.replace(/[^\d\.]/g,"") : val.replace(/[^-?\d\.]/g,"");
        val = val.replace(/\.{2,}/g,".");
        val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        val = val.replace("-","$#$").replace(/\-/g,"").replace("$#$","-");
        val = val.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');
        if(val!=="-0" && !isNaN(val)&&val.indexOf(".")< 0 && val !=""){
            val= parseFloat(val);
        }
        return val;
    },

    confirmUpdateNape() {
      const self = this;
      if (self.ItemName.trim().length === 0) {
        self.enterItemNameTip = true;
      }
      let itemScore = 0, qualifiedScore = 0, selectAvailable = [];
      if (self.activeSheetName == '0') {
        if (self.ItemSheetScore === '') {
          //self.ItemSheetScore = itemScore = 10;
          self.OtherScoreTipEmpty = true;
          qualifiedScore = null;
        } else {
          if (parseFloat(self.ItemSheetScore) > 50 || parseFloat(self.ItemSheetScore) < 0.5) {
            self.PFScoreTip = true;
          } else {
            itemScore = parseFloat(self.getFloat(self.ItemSheetScore));
            qualifiedScore = null;
          }
        }
      } else if (self.activeSheetName === '1') {
        if(self.itemType === 0 ){
          if (self.ItemScoreOption === '') {
            self.ScoreOptionsTips0 = true;
          }
        } else {
          self.ItemScoreOption = '0';
          self.ItemMinScore = 0;
          self.ItemTotalScore = 0;
        }
        if(self.ItemTotalScore === ''){
          self.ItemTotalScoreTip0 = true;
        }else if(parseFloat(self.ItemTotalScore)>50 || parseFloat(self.ItemTotalScore)<-50){
          self.ItemTotalScoreTip1 = true;
        }else{
          if(self.ItemMinScore === ''){
            itemScore = parseFloat(self.getFloat(self.ItemTotalScore));
            qualifiedScore = parseFloat(self.getFloat(self.ItemTotalScore));
          }else if(parseFloat(self.ItemMinScore)>parseFloat(self.ItemTotalScore) || parseFloat(self.ItemMinScore) < -50){
            self.ItemMinScoreTip = true;
          }else{
            itemScore = parseFloat(self.getFloat(self.ItemTotalScore));
            qualifiedScore = parseFloat(self.getFloat(self.ItemMinScore));
          }
          if(self.ItemScoreOption !== ''){
            let unavailable = 0;
            const ItemScoreOptions = self.ItemScoreOption.split('/');
            ItemScoreOptions.forEach(item=>{
              if(!isNaN(parseFloat(item)) && parseFloat(item)>=-50 && parseFloat(item)<=parseFloat(self.ItemTotalScore)){
                selectAvailable.push(parseFloat(self.getFloat(item)));
              }else{
                unavailable++;
              }
            })
            self.ScoreOptionsTips1 = unavailable!==0 ? true : false;
          }
        }
      } else if (self.activeSheetName == '2') {
        if (self.ItemSheetScore === '') {
          self.OtherScoreTipEmpty = true;
        }else if(parseFloat(self.ItemSheetScore) > 100 || parseFloat(self.ItemSheetScore) < -100){
          self.OtherScoreTip = true;
        }else {
          itemScore = parseFloat(self.getFloat(self.ItemSheetScore));
          qualifiedScore = null;
        }
      }
      if(self.enterItemNameTip || self.PFScoreTip || self.ItemTotalScoreTip0 || self.ItemTotalScoreTip1 ||
          self.ItemMinScoreTip || self.OtherScoreTip || self.enterListNameRuletip || self.OtherScoreTipEmpty ||
          self.descriptionRuletip || self.ScoreOptionsTips0 || self.ScoreOptionsTips1){
        return false;
      }
      if(self.updateType.type===0){
        self.addItem(itemScore,qualifiedScore,selectAvailable);

      }else if(self.updateType.type===1){
        self.editItem(itemScore,qualifiedScore,selectAvailable);
      }
    },

    addItem(itemScore,qualifiedScore,selectAvailable){
      const self = this;
      const temp = [];
      const objItem = {
        subject: self.ItemName.trim(),
        description: self.ItemDescription===null ? '' : self.ItemDescription.trim(),
        itemScore: itemScore,
        qualifiedScore: qualifiedScore,
        availableScores: selectAvailable,
        type: this.itemType
      };
        temp.push(objItem);
        const obj = {
          groupId: self.activeChildId === -1 ? self.activeParentId : self.activeChildId,
          items: temp
        };
        const tempParam = [];
        tempParam.push(obj);
        const params = {
          'request': tempParam
        };
        inpectRESTful.addInspectItem(params).then((res) => {
          const codeMsg = res.errMsg;
          if (codeMsg != undefined && codeMsg == 'Success') {
            self.showAddNape = false;
            self.refreshData(self.groupIndex);
            self.groupList[self.groupIndex].groupNum++;
            const data = res.data;
            const storeList = self.bindStoreList;
            const tempParams = [];
            storeList.forEach(item => {
              const obj = {
                storeId: item,
                itemIds: data
              };
              tempParams.push(obj);
            });
            if (tempParams.length !== 0) {
              const paramsApply = {
                storeList: tempParams
              };
              inpectRESTful.applyItemInspectItem(paramsApply).then(resApply => {
                const res = resApply;
              });
            }
            util.notify(self.$t('insSettingView.addSuss'), 'success', 3000);
            setTimeout(function() {
              if (self.tabName == '远程巡检') {
                PubSub.publish('change-color', { showTag: true });
              }
            }, 1000);
          } else {
            util.notify(self.$t('insSettingView.addFail'), 'warning', 3000);
            return false;
          }
        }).catch(err => {
          console.log('AddRuteInspect-confirmaddNape: ' + err);
        });
    },

    editItem(itemScore,qualifiedScore,selectAvailable){
      const self = this;
      const temp = [];
      const obj = {
          id: self.updateType.id,
          subject: self.ItemName.trim(),
          description: self.ItemDescription===null ? '' : self.ItemDescription.trim(),
          itemScore: itemScore,
          qualifiedScore: qualifiedScore,
          availableScores: selectAvailable,
          type: this.itemType,
          required: this.itemRequired === '1'
        };
        temp.push(obj);
        const params = {
          'items': temp
        };
        inpectRESTful.updateInspectItem(params).then(res => {
          const codeMsg = res.errMsg;
          if (codeMsg != undefined && codeMsg == 'Success') {
            util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
            self.showAddNape = false;
            self.refreshData(self.groupIndex);
          } else {
            util.notify(self.$t('deviceView.editFail'), 'warning', 3000);
            return false;
          }
        }).catch(err => {
          console.log('AddRuteInspect-confirmeditNape: ' + err);
        });
    },

    handleEdit(index, item) {
      this.showAddNape = true;
      this.updateType = {type:1,id:item.id};
      this.setDialogContent();
      this.ItemName = item.napeName;
      this.ItemTotalScore = item.score;
      this.ItemMinScore = item.qualifiedScore;
      this.ItemSheetScore = item.Score_3;
      this.ItemScoreOption = item.availableScoreStr;
      this.ItemDescription = item.napeDep;
      this.itemType = item.type;
      this.itemRequired = item.required ? '1' : '0'
    },

    handleDelete(item) {
      this.showDeleteItem = true;
      this.deleteItemFlag = 'S';
      this.curItemId = item.id;
    },

    getInspectItemList() {
      const self = this;
      return new Promise((resolve, reject) => {
        const params = {
          inspectId: self.routeData[0].inspectId
        };
        inpectRESTful.getInspectItemList(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getPersonData() {
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList().then(res => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getBindStoreList() {
      const self = this;
      const inspectId = self.routeData[0].inspectId;
      const params = { inspectIds: [inspectId] };
      inpectRESTful.getInspectBindList(params).then(res => {
        if (res.errCode === 0) {
          const data = res.data.length > 0 ? res.data[0].storeIds : [];
          self.bindStoreList = data;
        }
      }).catch(err => {
        reject(err);
      });
    },

    async refreshData(index) {
      const self = this;
      const curTag = self.tabName;
      const itemsList = await self.getInspectItemList();
      const data = util.getRouteByTag(curTag, itemsList);
      const filterData = util.handleInspctionCatergyTree(data);
      const temp = [];
      const groupIds = [];
      filterData.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.groupNum = item.children ? this.getSubCategoryItemsLength(item.children) : item.items.length;
        obj.isClick = false;
        obj.showEdit = false;
        obj.isEdit = false;
        obj.items = item.items;
        obj.type = item.type;
        obj.parentId = item.parentId;
        obj.children = item.children;
        obj.sequence = item.sequence;
        temp.push(obj);
        groupIds.push(item.id);
      });

      this.activeParentId = this.activeParentId === -1 ? filterData[0].id : this.activeParentId;
      if (filterData[index].children) {
        this.activeChildId = this.activeChildId === -1 ? filterData[0].children[0].id : this.activeChildId;
      } else {
        this.activeChildId = -1;
      }
      self.groupIds = groupIds;
      const postparams = {
        groupIds: self.groupIds
      };
      const postBind = await self.getInspectGroupBindAll(postparams);
      const titleList = await self.getUserTitleList();
      temp.forEach((t_item, t_index) => {
        const usertemp = [];
        const usertext = [];
        postBind.forEach(p_item => {
          if (t_item.id == p_item.groupId) {
            if (p_item.userTitles.length !== 0) {
              p_item.userTitles.forEach(u_item => {
                if (titleList.data.length == p_item.userTitles.length) {
                  t_item['textModel'] = self.$t('remotePatrol.all');
                } else {
                  usertext.push(u_item.titleName);
                  t_item['textModel'] = usertext.toString();
                }
                usertemp.push(u_item.titleId);
                t_item['ModelPost'] = usertemp;
              });
            } else {
              t_item['ModelPost'] = [];
              t_item['textModel'] = '';
            }
          }
        });
      });
      if (self.ModelPost.length === 0) {
        self.ModelPost = temp[0].ModelPost;
      }
      const te_temp = [];
      const type_temp = [];
      const obj = { passfail: [], score: [], other: [] };
      for (let i = 0; i < 3; i++) {
        const Typeindex = temp.filter(x => x.type === i);
        if (Typeindex.length !== 0) {
          te_temp.push(Typeindex);
          type_temp.push(Typeindex[0].type);
          if (Typeindex[0].type === 0) {
            obj.passfail = Typeindex;
          }
          if (Typeindex[0].type === 1) {
            obj.score = Typeindex;
          }
          if (Typeindex[0].type === 2) {
            obj.other = Typeindex;
          }
        }
      }
      self.sheetTemp = obj;
      self.allRoutedata = te_temp;
      self.typeTemp = type_temp;
      self.getGroupList(index);
    },

    getSubCategoryItemsLength(childrenItemList){
      let itemsLength = 0;
      childrenItemList.forEach(item => {
        itemsLength += item.items.length;
      })
      return itemsLength;
    },

    getGroupList(index){
      const self = this;
      self.activeSheetName = self.firstLoad ? self.allRoutedata[0][0].type.toString() : self.activeSheetName;
      self.firstLoad = false;
      self.groupList = self.activeSheetName === '0' ? self.sheetTemp.passfail :
                      (self.activeSheetName === '1' ? self.sheetTemp.score : self.sheetTemp.other);
      self.oldGroupSequence = self.groupList.map(item => item.sequence);
      if (self.groupList.length !== 0) {
        self.groupIndex = index;
        this.activeParentId = this.activeParentId === -1 ? self.groupList[index].id : this.activeParentId;
        if (self.groupList[index].children){
          this.activeChildId = this.activeChildId === -1 ? self.groupList[index].children[0].id : this.activeChildId;
          const child = self.groupList[index].children.filter(child => child.id === this.activeChildId);
          self.setItemTitle(child[0].name);
          self.getItemsList(index, child[0]);
        } else {
          self.curGroup = self.groupList[index];
          this.activeChildId = -1;
          self.setItemTitle(self.groupList[index].name);
          self.getItemsList(index, self.groupList[index]);
        }
      } else {
        self.napeList = [];
        self.setItemTitle('');
      }
    },

    getItemsList(index, item) {
      const self = this;
      const temp = [];
      item.items.forEach((_item, index) => {
        let availableScoreStr = '';
        if (_item.availableScores.length !== 0) {
          _item.availableScores.forEach((x_item, x_index) => {
            const isuu = x_index === _item.availableScores.length - 1 ? '' : '/';
            availableScoreStr += x_item + isuu;
          });
        } else {
          for (let i = 0; i < _item.itemScore + 1; i++) {
            const isuu = i === _item.itemScore ? '' : '/';
            availableScoreStr += i + isuu;
          }
        }
        const obj = {
          id: _item.id,
          napeName: _item.subject,
          napeNameShow: `${index + 1}，${_item.subject}`,
          napeDep: _item.description,
          Score_1: _item.itemScore,
          Score_2: _item.qualifiedScore,
          Score_3: _item.itemScore,
          Score_4: _item.availableScores,
          availableScoreStr: availableScoreStr,
          name: `${index + 1}，${_item.subject}`,
          description: _item.description,
          score: _item.itemScore,
          qualifiedScore: _item.qualifiedScore,
          availableScores: availableScoreStr,
          isClick: false,
          checked: false,
          type: _item.type,
          sequence: _item.sequence,
          required: _item.required
        };
        temp.push(obj);
      });
      self.napeList = temp;
    },

    initData() {
      this.tabName = sessionStorage.getItem('GroupName');
      const itemSettingData = JSON.parse(sessionStorage.getItem('itemSettingData'));
      this.routeName = itemSettingData.routeName;
      this.routeData = itemSettingData.routeData;
      this.refreshData(0);
      this.getBindStoreList();
    },

    napeTotalScoreChange(val){
      const self = this;
      self.ItemTotalScore = self.getUtilScore(val,0);
      self.ItemTotalScoreTip0 = false;
      if(parseFloat(self.ItemTotalScore)<-50 || parseFloat(self.ItemTotalScore) >50){
        self.ItemTotalScoreTip1 = true;
      }else{
        self.ItemTotalScoreTip1 = false;
        if(self.ItemMinScoreTip && parseFloat(self.ItemTotalScore)>=parseFloat(self.ItemMinScore)){
          self.ItemMinScoreTip = false;
        }
      }
    },

    napeMinScoreChange(val){
      const self = this;
      self.ItemMinScore = self.getUtilScore(val,1);
      if(parseFloat(self.ItemMinScore)<-50 || parseFloat(self.ItemMinScore) > parseFloat(self.ItemTotalScore)){
        self.ItemMinScoreTip = true;
      }else{
        self.ItemMinScoreTip = false;
      }
    },

    napeSheetScoreChange(val){
      const self = this;
      if(self.activeSheetName==='0'){
        self.ItemSheetScore = self.getUtilScore(val,0);
        if(self.ItemSheetScore!=='' && (parseFloat(self.ItemSheetScore)<0.5 || parseFloat(self.ItemSheetScore)>50)){
          self.PFScoreTip=true;
        }else{
          self.PFScoreTip=false;
        }
      }else if(self.activeSheetName==='2'){
        self.OtherScoreTipEmpty = false;
        self.ItemSheetScore = self.getUtilScore(val,1);
        if(parseFloat(self.ItemSheetScore)<-100 || parseFloat(self.ItemSheetScore)>100){
          self.OtherScoreTip=true;
        }else{
          self.OtherScoreTip=false;
        }
      }
    },

    napeScoreOptionsChange(val){
      const self = this;
      self.ItemScoreOption = val.replace(/[^-?\d\.\/]/g,"");
      self.ItemScoreOptions = self.ItemScoreOption.split('/');
      self.ItemScoreOptions.sort((a,b) => {return a-b});
      console.log(self.ItemScoreOptions);
      self.ScoreOptionsTips0 = false;
      if(val===''){
        self.ScoreOptionsTips1 = false;
      }else{
        self.ItemScoreOptions.forEach(item=>{
          if(!isNaN(parseFloat(item)) && parseFloat(item) >= -50 && parseFloat(item) <= 50){
            self.ItemTotalScore = self.ItemScoreOptions[self.ItemScoreOptions.length - 1];
            self.ItemMinScore = self.ItemTotalScore;
            self.ScoreOptionsTips1 = false;
          }else{
            self.ScoreOptionsTips1 = true;
          }
        })
      }
    },

    napeNameChange(val) {
      const self = this;
      const ITEMSLENGTH = 250;
      const comment = filterString.all(val, ITEMSLENGTH);
      const length = filterString.getContentLength(val);
      self.ItemName = comment;
      if (length > ITEMSLENGTH) {
        self.enterListNameRuletip = true;
      } else {
        if(length === 0){
          self.enterItemNameTip = true;
        }else{
          self.enterListNameRuletip = false;
          self.enterItemNameTip = false;
        }
      }
    },

    napeDepChange(val) {
      const self = this;
      const comment = filterString.all(val, 1200);
      const length = filterString.getContentLength(val);
      self.ItemDescription = comment;
      if (length > 1200) {
        self.descriptionRuletip = true;
      } else {
        self.descriptionRuletip = false;
      }
    },

    notShowInputRuleTips(e) {
      if (e === 'enterName') {
        this.enterNameRuletip = false;
      } else if (e === 'enterListName') {
        this.enterListNameRuletip = false;
      } else if (e === 'description') {
        this.descriptionRuletip = false;
      }
    },

    hideAddGroupDialog() {
      this.showAddGroup = false;
    },

    confirmAddSubGroup() {
      this.showAddGroup = false;
    },

    getInputCatergyName(val) {
      this.groupNameInput = val;
    },

    getSubCategorySequence(children) {
      this.oldSubcategorySequence = children.map(value => value.sequence);
    },

    handleUpdateSubCategorySequence(children) {
      this.newSubcategorySequence = children.map(value => {
        return {
          id: value.id,
          name: value.name,
          parentId: value.parentId,
          sequence: value.sequence
        }
      });
      this.updateCategorySequence(this.oldSubcategorySequence, this.newSubcategorySequence);
    },

    handleUpdateCategorySequence() {
      this.newGroupSequence = this.groupList.map(value => {
        return {
          id: value.id,
          name: value.name,
          parentId: value.parentId,
          sequence: value.sequence
        }
      });
      this.updateCategorySequence(this.oldGroupSequence, this.newGroupSequence);
    },

    updateCategorySequence(oldSequenceList, newSequenceList){
      const params = {};
      params.groups = [];
      newSequenceList.forEach((item, index) => {
        let itemObj = {};
        itemObj.id = item.id;
        itemObj.name = item.name;
        itemObj.parentId = item.parentId;
        itemObj.sequence = oldSequenceList[index];
        params.groups.push(itemObj);
      })

      if(params.groups.length > 0){
        inpectRESTful.updateInspectGroup(params).then(res => {
          console.log(res);
        }).catch(err => {
          console.log('updateItemsSequence: ' + err);
        })
      }
    }

  },

  beforeRouteLeave(to, from, next) {
    next();
    if (to.path === '/storemanage') {
      PubSub.publish('change-color', { showTag: false });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
@import '../../../assets/css/textstyle.css';
    $red:#f31d65;
    $black:#182752;
    $border:#acaeb1;
    $background:#f4f5f9;
    $tab:#7d8cad;
    $h1:#292e36;
    $itemHeight:50px;
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
    .nape-input{
        // @include point(width,180);
        float: left;
        @include point(margin-left,10);
    }
    #el-menuscrollbar >>> .el-scrollbar__thumb{
        width:0 !important;
    }
    .addNape{
      .el-form-item >>> .el-dialog__footer{
        margin-top: 20px;
        line-height: 24px;
      }
      .el-form-item >>> .el-form-item__label{
        padding:0;
        font-size: 14px;
        color:#424151;
      }
      .score_item{
        display: inline;
        margin:0;
        .item_label{
          font-size: 14px;
          color:#424151;
          margin-right:10px;
        }
        .item_des{
          font-size: 12px;
          color:#94a4b4;
        }
        .sign{
          color:red;
        }
      }
      .rules{
          color: #F56C6C;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
      }
    }
    .el-addrute{
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 125px - 60/1920*100vw);
        color: $black;
        font-size: calc(18/1920*100vw);
        position: relative;
        
        .tabName-input{
            width: 210px;
        }
        @media screen and (min-width:1366px){
            .tab-name{
                font-size: 18px;
            }
            .icon-tabname{
                font-size:18px;
            }
            .iconlised{
                @include point(height,20);
                @include point(line-height,20);
            }
            .iconrised{
                @include point(height,20);
                @include point(line-height,20);
            }
        }
        @media screen and (max-width:1366px){
            .tab-name{
              font-size: calc(18/1920*100vw);
            }
            .icon-tabname{
              font-size: calc(18/1920*100vw);
            }
            .iconlised{
                height: 20px;
                line-height: 20px;
            }
            .iconrised{
                height: 20px;
                line-height: 20px;
            }
        }
        @mixin iconContent{
            float: left;
            position: relative;
            padding: 1px 6px;
            border: 1px solid $border;
            cursor: pointer;

        }
        .el-rute-post{
            height:68px;
            line-height: 68px;
            padding:0 calc(20/1920*100vw);
            border-bottom: 1px solid $border;
            .post-left{
                float:left;
                .iconfont{
                    font-size: calc(16/1920*100vw);
                    margin-right: 10px;
                }
                span{
                    font-size: calc(16/1920*100vw);
                    color:#424151;
                    font-weight: bold;
                    margin-right: calc(20/1920*100vw);
                }
            }
            .post-right{
                float:right;
            }
        }
        .el-rute-title{
            width: 100%;
            @include point(height,60);
            @include point(line-height,60);
            height: 80px;
            line-height: 80px;
            padding-left: calc(20/1920*100vw);
            border-bottom: 1px solid $border;
            text-align: left;
            position: relative;
            .tab-name{
                font-weight: bold;
            }
            .icon-tabname{
                margin-left:calc(25/1920*100vw);
                color: #ddd;
                cursor: pointer;
            }
            .warningtips{
                font-size:12px;
                color:red;
                margin:5px 0 0 0;
                position: absolute;
                top:22px;
                left:calc(30/1920*100vw);
            }
        }
        .iconcontent{
            @include point(margin-left,20);
            @include point(margin-top,18);
            display: inline-block;
            .iconlised{
                @include iconContent;
                background-color: $red;
                color: #fff;
            }
            .iconrised{
                background-color: #fff;
                @include iconContent;
                border-left:0;
            }
        }
        .title-content{
            height: 60px;
            line-height: 60px;
            text-align: left;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid $border;
            .level2{
            //   margin-left: calc(15/1920*100vw);
              .iconfont{
                font-size: 15px;
              }
              .level2-name{
                font-size: 15px;
                margin-left: 24px;
                @media screen and (max-width:1440px){
                    font-size: calc(16/1920*100vw);
                }
              }
            }
            .item-title{
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
                word-wrap: break-word;
                width: 60%;
                cursor: pointer;
            }
            .en-item-title {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              display: inline-block;
              word-wrap: break-word;
              cursor: pointer;
              @media screen and (max-width: 1366px) {
                width: 50%;
              }
              @media screen and (min-width: 1366px) {
                width: 60%;
              }
            }
            .icontitle{
                margin-right: calc(15/1920*100vw);
                font-weight: normal;
                font-size: calc(20/1920*100vw);
                margin-left: calc(20/1920*100vw);
            }
            .btn-content{
                width: auto;
                height: auto;
                float: right;
                margin-right: calc(10/1920*100vw);
                margin-left: calc(10/1920*100vw);
            }
        }
        .temp-select-area{
                  display:flex; 
                  flex-direction:row;
                  height:calc(30/1920*100vw);
                  width:300px;
                  align-items:center;
                  background-color:#f7f9fa;
                  border-radius:5px;
                  font-size: 13px;
                  .temp-select-label{
                    color:#556679;
                    font-family: NotoSansCJKtc;
                    font-size: 13px;
                    width:123px;
                    margin-left:16px
                  }
                }
        .el-rute-group{
            // background-color: #FAFAFA;
            .group-items{
                font-size: 14px;
                .top-group-title{
                  position: relative;
                  height: 33px;
                    line-height: 33px;
                    text-align: center;
                    font-size: 14px;
                    color: $tab;
                    .group-name-title{
                      position: relative;
                        #group-content >>> .el-tabs__nav-wrap{
                            margin-left: 6px;
                        }
                        #group-content >>> .el-tabs__active-bar{
                            height: 4px;
                        }
                        #group-content >>> .el-tabs__item {
                            font-weight: bold;
                            color: #94A4B4;
                            font-size: calc(14/1920*100vw);
                            width: calc(131/1920*100vw);
                            min-width:92px;
                            padding:0;
                        }
                        #group-content >>> .el-tabs__item.is-active{
                            color: rgb(0, 106, 183);
                        }
                        .tab-routeDetail{
                          /deep/
                          .el-tabs__nav-wrap,
                          .el-tabs__item{
                            height:33px;
                          }
                        }
                    }
                }
                .groupItem{
                    line-height: 60px;
                    position: relative;
                    cursor: pointer;
                    text-align: left;
                    .proper-flag{
                        height: 70%;
                        width: 4px;
                        position:absolute;
                        top: 15%;
                        background-color: #006ab7;
                    }
                    .group-left{
                        .group-input{
                            float: left;
                            max-width: 64%;
                            margin-left: calc(45/1920*100vw);
                        }
                        span{
                            float: left;
                            width: 70%;
                            margin-left: calc(50/1920*100vw);
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                      .subcatergy-item{
                        margin-left: calc(20/1920*100vw);
                        font-size: calc(13/1920*100vw);
                      }
                    }
                    .group-right{
                        display: inline-block;
                        .iconcontent{
                            margin-left: calc(30/1920*100vw);
                            display: inline-block;
                            margin-top: 15px;
                            .iconlised{
                                @include iconContent;
                                background-color: $red;
                                color: #fff;
                                height: 22px;
                                line-height: 22px;
                            }
                            .iconrised{
                                background-color: #fff;
                                @include iconContent;
                                border-left:0;
                                height: 22px;
                                line-height: 22px;
                            }
                        }
                        .show-edit{
                        }
                    }
                }
              .category-list{
                display: flex;
                flex-direction: column;
              }
              .category-name{
                height: 60px;
                line-height: 60px;
                position: relative;
                overflow: hidden;
                border-bottom: 1px solid $border;
                cursor: pointer;
              }
            }
            .group-add{
                margin-top: 5px;
                overflow: hidden;
                text-align: left;
                height: 60px;
                line-height: 60px;
                margin-bottom: 25px;
                position: relative;
                .group-name-left{
                    .groupName-input{
                         max-width: 64%;
                        float: left;
                        margin-left: calc(45/1920*100vw);
                    }
                    .rules{
                        font-size: 10px;
                        color:#ff2400;
                        font-weight: 400;
                        line-height: 10px;
                        position: absolute;
                        top: 50px;
                        left:calc(25/1920*100vw);
                    }
                }
                .group-name-right{
                    .iconcontent{
                        margin-left:calc(30/1920*100vw);
                        float: left;
                        margin-top: 15px;
                        .iconlised{
                            @include iconContent;
                            background-color: $red;
                            color: #fff;
                            height: 22px;
                            line-height: 22px;
                        }
                        .iconrised{
                            background-color: #fff;
                            @include iconContent;
                            border-left:0;
                            height: 22px;
                            line-height: 22px;
                        }
                    }
                }
            }
        }
        .el-rute-nape{
            height: auto;
            min-height: 90%;
            width:70%;
            .nape-name-title{
                display: inline-block;
                span{
                    position: relative;
                    left: 10%;
                }

            }
            .nape-dep-title{
                display: inline-block;
                span{
                    position: relative;
                    left: 0%;
                }
            }
            .nape-score0-title{
                display: inline-block;
            }
            .nape-score1-title{
                display: inline-block;
                min-width: 117px;
                @media screen and (max-width: 1450px){
                    line-height:20px;
                    padding-top:10px;
                }
            }
            .nape-handle-title{
                display: inline-block;
                span{
                    position: relative;
                    left: 5%;
                }
            }
            .en-nape-handle-title{
                display: inline-block;
                span{
                  position: relative;
                  left: 0%;
                }
            }
          .nape-items{
            width: 99%;
          }
            .nape-items-title{
                height: 60px;
                line-height: 60px;
                text-align: left;
                font-size: 14px;
                color: $tab;
                display: flex;
                width: 96%;
                float: right;
            }
            .nape-items-data{
                overflow: hidden;
                position: relative;
                width: 96%;
                margin: 0 0 0 3%;
                padding-left: 1%;
                cursor: pointer;
                font-size: 14px;
                color: #424151;
                height:auto;
                display: flex;
                //@include point(min-height,50);
                min-height: 60px;
                &:last-child{
                    @include point(margin-bottom,15);
                }
                .nape-name-data{
                    position: relative;
                    float: left;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    .item-checkbox{
                        float: left;
                        margin-right: 0px;
                    }
                    .nape-input{
                        width:calc(200/1920*100vw);
                        min-width:136px;
                        float: left;
                        @include point(margin-left,10);
                        @include point(margin-bottom,3);
                    }
                    span{
                        float: left;
                        @include point(margin-left,15);
                        text-align: left;
                        width: 80%;
                    }
                    // .inputcontent{
                    //     width:90%;
                        .rules{
                            font-size: 10px;
                            color:#ff2400;
                            font-weight: 400;
                            line-height: 12px;
                            margin-left:25px;
                        }
                    // }
                }
                .nape-dep-data{
                    height: 100%;
                    position: relative;
                    float: left;
                    overflow: hidden;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    span{
                        float: left;
                        text-align: left;
                        margin-right: 20px;
                    }
                    .nape-input{
                        width:calc(200/1920*100vw);
                        min-width:215px;
                        float: left;
                        @include point(margin-left,10);
                        @include point(margin-bottom,3);
                    }
                    // .inputcontent{
                    //     float: left;
                        .rules{
                            font-size: 10px;
                            color:#ff2400;
                            font-weight: 400;
                            line-height: 10px;
                            margin-left:10px;
                        }
                    // }
                }
                .nape-scores-handle{
                    height: 100%;
                    position: relative;
                    float: left;
                    overflow: hidden;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    span{
                        float: left;
                        text-align: left;
                    }
                    .FullScore-input >>> .el-input{
                        width:65px;
                        margin: 0 auto;
                    }
                    .critical-input >>> .el-input{
                        width:65px;
                        margin: 0 auto;
                    }
                    .Itemscores-input{
                        width:65px;
                        margin: 0 auto;
                    }
                }
                .nape-items-handle{
                    display: inline-block;
                    @include point(line-height,20);
                    @include point(margin-top,15);
                    text-align: left;
                    .iconfont{
                      font-size: calc(24/1920*100vw);
                      color: #7d8cad;
                    }
                }
                .nape-scores-handle >>> .el-select.el-select--mini{
                    width:110px !important;
                    height:45px !important;
                    background-color: #fee4e7 !important;
                    color:#424151 !important;
                }
                .nape-scores-handle >>> .el-province .el-input--mini .el-input__icon{
                    line-height: 0;
                }
                .iconcontent{
                    @include point(margin-left,25);
                    display: inline-block;
                    @include point(margin-top,15);
                    .iconlised{
                        @include iconContent;
                        background-color: $red;
                        color: #fff;
                        height: 22px;
                        line-height: 22px;
                    }
                    .iconrised{
                        background-color: #fff;
                        @include iconContent;
                        border-left:0;
                        height: 22px;
                        line-height: 22px;
                    }
                }
            }
        }
        .noraml-color{
            background-color: #f2f9fe;
        }
        .active-color{
            background-color: #FEE4E7;
        }
        .noraml-groupColor{
            background-color: #FAFAFA;
        }
      .btn-class{
        height: calc(36/1920*100vw);
        padding: 0;
        font-size: calc(14/1920*100vw);
        width: calc(130/1920*100vw);
        .el-icon-plus, .icon-shanchu{
          font-size: calc(16/1920*100vw);
          margin-right: calc(8/1920*100vw);
        }
        @media screen and (max-width: 1440px) {
          width: 100px;
        }
        .btn-area{
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

  .score-content{
    background-color: #edf0f2;
    padding: 20px calc(20/1920*100vw);
    /*border: 1px solid #acaeb1;*/
    height: auto;
    position: relative;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .el-radio{
    margin-right: calc(20/1920*100vw);
  }

  .prompt-content{
    position: absolute;
    left: calc(230/1920*100vw);
    top: 335px;
    z-index: 1;
  }
  .prompt-info{
    display: inline-flex;
    flex-direction: column;
  }
  .prompt-image{
    height: 60px;
    width: 80px;
  }

  .prompt-msg{
    line-height: 25px;
    font-size: calc(20/1920*100vw);
    color: #006ab7;
    font-weight: bold;
    text-align: left;
  }
  .image-top{
    align-self: flex-end;
    position: relative;
    left: 90px;
  }

  .image-left{
    margin-left: calc(24/1920*100vw);
  }
</style>
<style>
.el-rute-post .el-select.el-select--mini{
    width:190px !important;
    height:45px !important;
    color:#424151 !important;
}
.nape-scores-handle .content{
    width:110px !important;
    margin-right: 0 !important;
}
.el-dialog__body{
    padding: 0px !important;
}
.addNape .el-dialog__body .dialog-content .NapeForm{
}
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.nape-input .el-textarea__inner{
    font-family: Roboto, Arial, 'Microsoft YaHei';
}
</style>
