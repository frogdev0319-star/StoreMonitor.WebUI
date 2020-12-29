/* eslint-disable arrow-spacing */
<template>
  <el-row class="el-addrute">
    <el-col :span="24" class="el-rute-title">
      <span v-if="!showEditTab" class="tab-name">{{ routeName }}<i class="iconfont icon-bianji icon-tabname" @click="editTabName"/></span>
      <el-input v-if="showEditTab" :size="varyWindowWidth>1600?'small':'mini'" :placeholder="$t('insSettingView.enterListName')" v-model="editRouteName" class="tabName-input" @input="RouteNameLength"/>
      <div v-if="showEditTab" class="iconcontent" style="margin-top:28px;">
        <div class="iconlised" @click="confirmEditTab">
          <i class="el-icon-check"/>
        </div>
        <div class="iconrised" @click="cancelEditTab">
          <i class="el-icon-close"/>
        </div>
      </div>
      <span v-if="showLengthNameWarning" class="warningtips">{{ $t('insSettingView.enterNameRuletip') }}</span>
    </el-col>
    <el-col :span="24" class="el-rute-post">
      <div class="post-left">
        <span><i class="iconfont icon-quxiaolianjie"/>{{ $t('insSettingView.selecttitle') }}</span>
        <region-multi-select
          :options="titleList"
          :placeholder="$t('insSettingView.selectPost')"
          :disabled="false"
          :input-size="`mini`"
          :selected="ModelPost"
          :all="$t('remotePatrol.all')"
          @changeInput="changeSelect(arguments)"/>
      </div>
      <div class="post-right">
        <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" size="mini" type="primary" class="btn-class" @click="submitBindTitle">
          {{ $t('remotePatrol.submit') }}
        </el-button>
      </div>
    </el-col>
    <el-col :span="7" class="el-rute-group">
      <div class="group-content">
        <div class="title-content">
          <span class="level2"><i class="iconfont icon-wenjian icontitle"/><span class="level2-name">{{ groupTitle }}</span></span>
          <div class="btn-content">
            <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" size="mini" type="primary" class="btn-class" @click="addGroup">
              <div class="btn-area">
                <i class="el-icon-plus"/>
                <span>{{ $t('insSettingView.addCategory') }}</span>
              </div>
            </el-button>
          </div>
        </div>
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <div :style="{'max-height':varyDivHeight+'px'}" class="group-items group-title">
            <div class="top-group-title">
              <div class="group-name-title">
                <el-tabs id="group-content" v-model="activeSheetName" @tab-click="handleSheetClick">
                  <el-tab-pane v-for="(item,index) in sheetName" :key="index" :label="item.label" :name="item.id"/>
                </el-tabs>
              </div>
            </div>
            <div v-for="(item,index) in groupList" :key="index" :class="item.isClick?'noraml-color':'noraml-groupColor'" class="groupItem" @click="clickGroupItem(index,item)" @mouseenter="getEditGroup(index,item)">
              <div v-if="item.isClick" class="proper-flag"/>
              <div>
                <div class="group-left">
                  <span v-if="!item.isEdit" :style="item.isClick?{'color':'#f31d65'}:{}">{{ item.groupName }}（{{ item.groupNum }}）</span>
                  <el-input v-if="item.isEdit" v-model="item.groupName" size="mini" class="group-input" @input="(val)=>groupNameChange(val,item)"/>
                </div>
                <div class="group-right">
                  <div v-if="item.showEdit" class="show-edit">
                    <div v-if="!item.isEdit" class="nape-items-handle">
                      <i
                        class="iconfont icon-bianji"
                        style="cursor:pointer;"
                        @click="editGroup(index,item)"/>
                      <i
                        class="iconfont icon-shanchu"
                        style="cursor:pointer;"
                        @click="deleteGroup(index, item)"/>
                    </div>
                  </div>
                  <div v-if="item.isEdit" class="iconcontent">
                    <div class="iconlised" @click="confirmEditGroup(index,item)">
                      <i class="el-icon-check"/>
                    </div>
                    <div class="iconrised" @click="cancelEditGroup(index,item)">
                      <i class="el-icon-close"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="showAddGroup" class="group-add">
              <div class="group-name-left">
                <el-input :placeholder="$t('insSettingView.enterName')" v-model="groupNameInput" size="mini" class="groupName-input" @input="(val)=>groupNameChange(val,{})" @blur="notShowInputRuleTips('enterName')"/>
                <span v-if="enterNameRuletip" class="rules">{{ $t('insSettingView.enterNameRuletip') }}</span>
              </div>
              <div class="group-name-right">
                <div class="iconcontent">
                  <div class="iconlised" @click="confirmAddGroup">
                    <i class="el-icon-check"/>
                  </div>
                  <div class="iconrised" @click="cancelAddGroup">
                    <i class="el-icon-close"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <!--<el-dialog-->
          <!--v-if="showFailInfo"-->
          <!--:title="$t('remotePatrol.prompt')"-->
          <!--:visible.sync="showFailInfo"-->
          <!--:append-to-body="true"-->
          <!--:close-on-click-modal="false"-->
          <!--width="510px"-->
          <!--top="35vh"-->
          <!--left="40vh">-->
          <!--<div class="dialog-content" style="overflow:hidden;width:100%;">-->
            <!--<hr style="border: 0.5px solid #dfe2e9;">-->
            <!--<div style="margin:20px 20px 20px 26px;">-->
              <!--<i class="el-icon-warning" style="font-size:25px;margin-right:10px;color:#FF9803;display: inline-block; vertical-align: middle;"/>-->
              <!--<span style="display: inline-block; vertical-align: middle;font-size:14px;color:#182752;">{{ $t('insSettingView.notallowdeletetips') }}</span>-->
              <!--<p style="padding-left:40px;color:#182752;">A.{{ $t('insSettingView.notallowA') }}</p>-->
              <!--<p style="padding-left:40px;color:#182752;">B.{{ $t('insSettingView.notallowB') }}</p>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button class="file-cancel-btn" size="mini" style="" @click="showFailInfo = false">{{ $t('insSettingView.cancel') }}</el-button>-->
            <!--<el-button class="file-confirm-btn" size="mini" type="primary" @click="showFailInfo = false">{{ $t('insSettingView.confirm') }}</el-button>-->
          <!--</div>-->
        <!--</el-dialog>-->
      </div>
    </el-col>
    <el-col :span="17" class="el-rute-nape">
      <div class="nape-content">
        <div class="title-content">
          <span :class="lang=='en' ? 'en-item-title': 'item-title'" class="level2">
            <i class="iconfont icon-icon-test icontitle"/>
          <span class="level2-name">{{ napeTitle }}</span></span>
          <div class="btn-content">
            <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" :disabled="groupList.length==0" size="mini" type="primary" class="btn-class" @click="addNape">
              <div class="btn-area">
                <i class="el-icon-plus"/>
                <span>{{ $t('insSettingView.addInsItem') }}</span>
              </div>
            </el-button>
            <el-button :class="lang=='en' ? 'en-rute-btn': 'rute-btn'" :disabled="groupList.length==0" size="mini" type="primary" class="btn-class" @click="deleteNape">
              <div class="btn-area">
                <i class="iconfont icon-shanchu"/>
                <span>{{ $t('insSettingView.deleteInsItem') }}</span>
              </div>
            </el-button>
          </div>
        </div>
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <div :style="{'max-height':varyDivHeight+'px'}" class="nape-items">
            <div v-if="napeList.length!=0" class="nape-items-title">
              <div :style="activeSheetName=='1'?'flex:2.05;':'flex:3'" class="nape-name-title">
                <span>{{ $t('insSettingView.inspectName') }}</span>
              </div>
              <div :style="activeSheetName=='1'?'flex:2.2;':'flex:4;'" class="nape-dep-title">
                <span :style="activeSheetName=='1'?'left:5%;':'left:-4%;'">{{ $t('insSettingView.inspectionDescp') }}</span>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-score0-title" style="flex:1;">
                <span style="position:relative;left:8%;">{{ $t('insSettingView.sheetscore0') }}</span>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-score0-title" style="flex:1;">
                <span>{{ $t('insSettingView.sheetscore3') }}</span>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-score0-title" style="flex:1;line-height:20px;padding-top:10px;padding-right:20px;">
                <span>{{ $t('insSettingView.sheetscore1') }}</span>
              </div>
              <div v-if="activeSheetName!='1'" class="nape-score1-title" style="flex:1;">
                <span>{{ $t('insSettingView.score') }}</span>
              </div>
              <div :class="lang=='en'? 'en-nape-handle-title':'nape-handle-title'" style="flex:1;">
                <span>{{ $t('insSettingView.operation') }}</span>
              </div>
            </div>
            <div
              v-for="(item,index) in napeList"
              :key="index"
              :class="!item.isClick?'noraml-color':'active-color'"
              class="nape-items-data"
              @click="clickItem(index,item)">
              <div :style="activeSheetName=='1'?'flex:2;':'flex:2.8;'" class="nape-name-data">
                <el-checkbox v-model="item.checked" class="item-checkbox"/>
                <span v-if="!item.isClick">{{ item.napeNameShow }}</span>
                <el-input v-if="item.isClick" v-model="item.napeName" :placeholder="$t('insSettingView.enterItemName')" size="mini" class="nape-input" @input="(val)=>napeNameChange(val, item)"/>
              </div>
              <div :style="activeSheetName=='1'?'flex:2;':'flex:4.2;'" class="nape-dep-data">
                <span v-if="!item.isClick">{{ item.napeDep }}</span>
                <el-input v-if="item.isClick" :autosize="{ minRows: 1}" v-model="item.napeDep" :placeholder="$t('insSettingView.description')" type="textarea" resize="none" size="mini" class="nape-input" @input="(val)=>napeDepChange(val, item)"/>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-scores-handle" style="flex:1;">
                <span v-if="!item.isClick" style="position:relative;left:15%;">{{ item.Score_1 }}{{ lang!='en'?$t('remotePatrol.scorecount'):'' }}</span>
                <el-select v-if="item.isClick" v-model="item.Score_1" size="mini" class="FullScore-input" @change="selectFullScore($event,item)">
                  <el-option v-for="item in fullScoreTemp" :key="item" :label="item" :value="item"/>
                </el-select>
              </div>
              <div v-if="activeSheetName=='1'" :style="item.isClick?'':'flex:1;'" class="nape-scores-handle">
                <el-tooltip v-if="!item.isClick" class="item" effect="dark" placement="top">
                  <div slot="content" style="max-width:120px;">{{ item.availableScoreStr }}</div>
                  <span v-if="!item.isClick" style="width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ item.availableScoreStr }}{{ lang!='en'?$t('remotePatrol.scorecount'):'' }}</span>
                </el-tooltip>
                <region-multi-select
                  v-if="item.isClick"
                  :options="availableScores"
                  :placeholder="$t('insSettingView.selectPost')"
                  :disabled="false"
                  :input-size="`mini`"
                  :selected="item.Score_4"
                  :all="$t('remotePatrol.all')"
                  @changeInput="changeScore4($event,item)"/>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-scores-handle" style="flex:1;">
                <span v-if="!item.isClick">{{ item.Score_2 }}{{ lang!='en'?$t('remotePatrol.scorecount'):'' }}</span>
                <el-select v-if="item.isClick" v-model="item.Score_2" size="mini" class="critical-input">
                  <el-option v-for="item in ScoreList" :key="item" :label="item" :value="item"/>
                </el-select>
              </div>
              <div v-if="activeSheetName!='1'" class="nape-scores-handle" style="flex:1;">
                <span v-if="!item.isClick">{{ item.Score_3 }}{{ lang!='en'?$t('remotePatrol.scorecount'):'' }}</span>
                <el-input v-if="item.isClick" v-model="item.Score_3" size="mini" class="Itemscores-input" @input="editinputChange(item,index,activeSheetName)"/>
              </div>
              <div v-if="!item.isClick" class="nape-items-handle" style="flex:1;">
                <i class="iconfont icon-bianji" style="cursor:pointer;margin-right:10px;" @click="handleEdit(index,item)"/>
                <i class="iconfont icon-shanchu" style="cursor:pointer;" @click="handleDelete(index, item)"/>
              </div>
              <div v-if="item.isClick" class="iconcontent" style="flex:1;">
                <div class="iconlised" style="background-color:#f31d65" @click="confirmeditNape(index,item)">
                  <i class="el-icon-check"/>
                </div>
                <div class="iconrised" @click="cancelEditNape(index,item)">
                  <i class="el-icon-close"/>
                </div>
              </div>
            </div>
            <el-dialog
              v-if="showDeleteItem"
              :title="$t('insSettingView.confirmDelete')"
              :visible.sync="showDeleteItem"
              :append-to-body="true"
              :close-on-click-modal="false"
              width="28%"
              top="35vh"
              left="40vh">
              <div style="overflow:hidden;">
                <hr style="border: 0.5px solid #dfe2e9;;">

                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803;display: inline-block; vertical-align: middle;"/>
                  <span style="display: inline-block; vertical-align: middle;">{{ $t('insSettingView.confirmCurDel') }}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteItem = false">{{ $t('insSettingView.cancel') }}</el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary" @click="confirmDeleteItem">{{ $t('insSettingView.confirm') }}</el-button>
              </div>
            </el-dialog>

            <el-dialog
              v-if="showDeleteGroup"
              :title="$t('insSettingView.confirmDelete')"
              :visible.sync="showDeleteGroup"
              :append-to-body="true"
              :close-on-click-modal="false"
              width="28%"
              top="35vh"
              left="40vh">
              <div style="overflow:hidden;">
                <hr style="border: 0.5px solid #dfe2e9;">

                <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;">
                  <i class="el-icon-warning" style="font-size:26px;margin-right:20px;color:#FF9803; display: inline-block; vertical-align: middle;"/>
                  <span style="display: inline-block; vertical-align: middle;">{{ $t('insSettingView.deleteGroup') }}</span>
                </p>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteGroup = false">{{ $t('insSettingView.cancel') }}</el-button>
                <el-button class="file-confirm-btn" size="mini" type="primary" @click="confirmDeleteGroup">{{ $t('insSettingView.confirm') }}</el-button>
              </div>
            </el-dialog>
            <div v-if="showAddNape" :class="'active-color'" class="nape-items-data">
              <div :style="activeSheetName=='1'?'flex:2;':'flex:3;'" class="nape-name-data">
                <el-checkbox v-model="newNapeChecked" class="item-checkbox"/>
                <el-input v-model="newNapeName" :placeholder="$t('insSettingView.enterItemName')" size="mini" class="nape-input" @input="(val)=>napeNameChange(val, {})" @blur="notShowInputRuleTips('enterListName')"/>
                <span v-if="enterListNameRuletip" class="rules">{{ $t('insSettingView.enterListNameRuletip') }}</span>
              </div>
              <div :style="activeSheetName=='1'?'flex:2;':'flex:4;'" class="nape-dep-data">
                <el-input :autosize="{ minRows: 1}" v-model="newNapeDep" :placeholder="$t('insSettingView.description')" type="textarea" resize="none" size="mini" class="nape-input" @input="(val)=>napeDepChange(val, {})" @blur="notShowInputRuleTips('description')"/>
                <span v-if="descriptionRuletip" class="rules">{{ $t('insSettingView.descriptionRuletip') }}</span>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-scores-handle" style="flex:1.3;">
                <el-select v-model="newScore" size="mini" class="FullScore-input" @change="selectFullScore($event)">
                  <el-option v-for="item in 50" :key="item" :label="item" :value="item"/>
                </el-select>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-scores-handle" style="flex:1;max-width:110px;">
                <region-multi-select
                  :options="availableScores"
                  :placeholder="$t('insSettingView.selectPost')"
                  :disabled="false"
                  :input-size="`mini`"
                  :selected="selectAvailable"
                  :all="$t('remotePatrol.all')"
                  @changeInput="changeAvailable(arguments)"/>
              </div>
              <div v-if="activeSheetName=='1'" class="nape-scores-handle" style="flex:1;">
                <el-select v-model="newCritical" size="mini" class="critical-input">
                  <el-option v-for="item in ScoreList" :key="item" :label="item" :value="item"/>
                </el-select>
              </div>
              <div v-if="activeSheetName!='1'" class="nape-scores-handle" style="flex:1;">
                <el-input v-model="newAddScore" size="mini" class="Itemscores-input" @input="inputChange($event,activeSheetName)"/>
              </div>
              <div class="iconcontent" style="flex:1;">
                <div class="iconlised" style="background-color:#f31d65" @click="confirmaddNape">
                  <i class="el-icon-check"/>
                </div>
                <div class="iconrised" @click="cancelAddNape">
                  <i class="el-icon-close"/>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import util from '@/common/util';
import { validateInput } from '@/common/validate';
import { inpectRESTful, titleRESTful } from '@/api/index';
import PubSub from 'pubsub-js';
import filterString from '@/common/filterString';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import { getScheduleListService } from '@/api/schedule';
export default {
  name: 'AddRuteInspect',
  components: {
    RegionMultiSelect
  },
  data() {
    return {
      newScore: 10,
      newCritical: 1,
      newAddScore: 0,
      fullScoreTemp: [],
      availableScores: [],
      selectAvailable: [],
      firstLoad: true,
      groupTitle: this.$t('insSettingView.category'),
      showFailInfo: false,
      tabName: '',
      ModelPost: [],
      ModelAddPost: [],
      groupList: [],
      activeSheetName: '',
      groupNameTemp: '',
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
      newNapeDep: '',
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
      routeName: this.$route.params.routeName,
      routeData: this.$route.params.routeData,
      showLengthNameWarning: false,
      editRouteName: '',
      titleList: [],
      tableData: [],
      noData: '',
      groupIds: [],
      ScoreList: [],
      Score_1: '',
      Score_2: '',
      Score_3: '',
      sheetName: [
        { id: '0', label: this.$t('insSettingView.sheetpassfail') },
        { id: '1', label: this.$t('insSettingView.sheetscore') },
        { id: '2', label: this.$t('insSettingView.sheetother') }
      ],
      allRoutedata: [],
      typeTemp: []
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
    const self = this;
    self.initData();
    self.getTitleList();
  },

  destroyed() {
    sessionStorage.removeItem('itemSettingData');
  },

  methods: {
    getTitleList() {
      const self = this;
      self.tableData = [];
      self.getUserTitleList().then((res) => {
        res.data.forEach(item => {
          const roleId = item.roleId;
        });
        self.tableData = res.data;
        if (self.tableData.length === 0) {
          self.noData = self.$t('deviceView.noData');
        }
        const listArray = [];
        self.tableData.forEach(item => {
          listArray.push({
            label: item.title,
            value: item.id,
            disabled: false
          });
        });
        self.titleList = listArray;
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
        self.notify(self.$t('insSettingView.enterListName'), 'warning', 3000);
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
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          return false;
        } else {
          self.notify(self.$t('remotePatrol.Patroltips2'), 'warning', 3000);
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

    handleSheetClick(val) {
      const self = this;
      self.showAddGroup = false;
      self.showAddNape = false;
      self.refreshData(0);
    },

    clickGroupItem(index, item) {
      const self = this;
      item.isClick = true;
      self.groupIndex = index;
      self.curGroup = item;
      if (self.lang == 'en') {
        self.napeTitle = `${self.$t('insSettingView.itemsOfCate')} ${item.groupName}`;
      } else {
        self.napeTitle = `${item.groupName} ${self.$t('insSettingView.itemsOfCate')}`;
      }
      self.showAddNape = false;
      self.groupList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isClick = false;
        }
      });
      self.getNapeList(index, item);
    },

    clickItem(index, item) {
      const self = this;
    },

    getTagAll(params) {
      const self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getInspectGroupBindAll(params) {
      const self = this;
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
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          self.refreshData(self.groupIndex);
          return false;
        }
      } else {
        if (bindtitleIds.length !== 0) {
          resBindGroup = await self.bindGroup(paramsBind);
        } else if (bindtitleIds.length === 0) {
          self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          return false;
        }
      }
      if (resBindGroup.errMsg === 'Success') {
        self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
        self.refreshData(self.groupIndex);
      } else {
        self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
        return false;
      }
    },

    async confirmEditGroup(index, item) {
      const self = this;
      const temp = [];
      if (item.groupName == null || item.groupName.length === 0) {
        self.notify(self.$t('insSettingView.titleEmpty'), 'warning', 3000);
        return false;
      }
      // if(validateInput(item.groupName)){
      //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
      //     return false;
      // }
      const obj = {
        id: item.id,
        name: item.groupName,
        tag: self.tabName
      };
      temp.push(obj);
      const params = {
        'groups': temp
      };
      let resUpdateGroup = null;
      resUpdateGroup = await self.updateGroup(params);
      if (resUpdateGroup.errMsg === 'Success') {
        self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
        item.isEdit = false;
        self.refreshData(self.groupIndex);
      } else {
        self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
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

    cancelEditGroup(index, item) {
      const self = this;
      item.isEdit = false;
      item.groupName = self.groupNameTemp;
    },
    /**
     * Add group functions
     */
    addGroup() {
      const self = this;
      if (self.typeTemp.length === 1 && self.typeTemp[0] === 0 && self.activeSheetName === '2') {
        self.notify(self.$t('insSettingView.notAllowAdd'), 'warning', 3000);
        return false;
      }
      self.showAddGroup = true;
      self.groupNameInput = '';
      self.groupList.forEach(item => {
        item.isEdit = false;
      });
    },

    changeSelect(val) {
      const self = this;
      self.ModelPost = Array.from(val)[0];
    },
    changeScore4(val, item) {
      if (val[0] === '-1') {
        item.Score_4 = val.slice(1);
      } else {
        item.Score_4 = val;
      }
    },
    changeAvailable(val) {
      const self = this;
      // if (val[0] === '-1') {
      //   self.selectAvailable = Array.from(val).slice(1);
      // } else {
      self.selectAvailable = Array.from(val)[0];
      // }
    },
    changeAddSelect(val) {
      const self = this;
      self.ModelAddPost = Array.from(val)[0];
    },

    async confirmAddGroup() {
      const self = this;
      const temp = [];
      if (self.groupNameInput.trim().length == 0) {
        self.notify(self.$t('insSettingView.titleEmpty'), 'warning', 3000);
        return false;
      }
      let mode = 0;
      const tabIndex = sessionStorage.getItem('TabIndex');
      mode = tabIndex === '0' ? 0 : (tabIndex === '1' ? 1 : 0);
      const obj = {
        name: self.groupNameInput,
        mode: mode,
        tag: self.tabName,
        type: Number(self.activeSheetName)
      };
      temp.push(obj);
      const params = {
        'groups': temp
      };
      inpectRESTful.addInspectGroup(params).then(res => {
        const codeMsg = res.errMsg;
        if (codeMsg != undefined && codeMsg === 'Success') {
          const obj = {
            id: res.data[0],
            groupName: self.groupNameInput,
            groupNum: 0,
            isClick: false,
            showEdit: false,
            isEdit: false,
            itemData: []
          };
          self.groupList.push(obj);
          let titleIds = [];
          if (self.ModelPost[0] === '-1') {
            titleIds = self.ModelPost.slice(1);
          } else {
            titleIds = self.ModelPost;
          }
          if (titleIds.length !== 0) {
            const paramsBind = {
              groupItems: [{
                groupId: res.data[0],
                titleIds: titleIds
              }]
            };
            self.bindGroup(paramsBind);
          }
          self.groupNameInput = '';
          self.showAddGroup = false;
          self.refreshData(self.groupList.length - 1);
          self.notify(self.$t('insSettingView.addSuss'), 'success', 3000);
        } else {
          self.notify(self.$t('insSettingView.addFail'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        reject(err);
      });
    },

    cancelAddGroup() {
      const self = this;
      self.showAddGroup = false;
    },

    getEditGroup(index, item) {
      const self = this;
      item.showEdit = true;

      self.groupList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.showEdit = false;
        }
      });
    },

    editGroup(index, item) {
      const self = this;
      item.isEdit = true;
      item.showEdit = false;
      self.groupNameTemp = item.groupName;
      self.groupList.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isEdit = false;
        }
      });
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
        });
      });
    },

    async deleteGroup(index, item) {
      const self = this;
      if (self.groupList.length === 1) {
        // if ((self.typeTemp.length === 2 && !self.typeTemp.some(x => x === 0) || self.typeTemp.length === 3) && item.type === 1) {
        //   self.showFailInfo = true;
        //   return false;
        // } else
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
            self.notify(self.$t('insSettingView.deletebindSchedule'), 'warning', 3000);
            return false;
          }
        }
      }
      self.showDeleteGroup = true;
      self.curGroup = item;
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
      const idItemArr = [];
      idGroupArr.push(self.curGroup.id);
      self.curGroup.itemData.forEach(item => {
        idItemArr.push(item.id);
      });
      self.showDeleteGroup = false;
      if (idItemArr.length === 0) {
        const errMsg = await self.deleteGroupData(idGroupArr);
        if (errMsg != undefined && errMsg === 'Success') {
          self.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
          if (self.groupList.length === 1) {
            self.groupList = [];
            self.napeList = [];
            self.napeTitle = '';
          } else {
            self.refreshData(self.groupIndex === 0 ? self.groupIndex : self.groupIndex - 1);
          }
        }
      } else {
        const errMsgItem = await self.deleteItemData(idItemArr);
        if (errMsgItem != undefined && errMsgItem === 'Success') {
          const errMsgGroup = await self.deleteGroupData(idGroupArr);
          if (errMsgGroup != undefined && errMsgGroup === 'Success') {
            self.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
            if (self.groupList.length === 1) {
              self.groupList = [];
              self.napeList = [];
              self.napeTitle = '';
            } else {
              self.refreshData(self.groupIndex === 0 ? self.groupIndex : self.groupIndex - 1);
            }
          } else {
            self.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
            return false;
          }
        } else {
          self.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
          return false;
        }
      }
      if (self.typeTemp.length === 1 && self.groupList.length === 0) {
        self.$router.push({ name: 'inspectSetting', params: { val: 'del' }});
      }
    },

    addNape() {
      const self = this;
      self.showAddNape = !self.showAddNape;
      self.newAddScore = 0;
      self.napeList.forEach((_item, _index) => {
        _item.isClick = false;
      });
      self.newScore = 50;
      self.newCritical = 1;
      const arr = [];
      for (var i = 0; i <= 50; i++) {
        arr.push(i);
      }
      self.ScoreList = arr.slice(0, i + 1);
      self.selectAvailable = arr.slice(0, i + 1);
      const available = arr.slice(0, i + 1);
      const availableScores = [];
      available.forEach(item => {
        const obj = {
          label: item,
          value: item,
          disabled: false
        };
        availableScores.push(obj);
      });
      self.availableScores = availableScores;
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
        self.notify(self.$t('insSettingView.selectItems'), 'warning', 3000);
        return false;
      }
      // if (count === self.napeList.length && self.groupList.length === 1) {
      //   if ((self.typeTemp.length === 2 && !self.typeTemp.some(x => x === 0) || self.typeTemp.length === 3) && self.groupList[0].type === 1) {
      //     self.showFailInfo = true;
      //     return false;
      //   }
      // }
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
        self.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
        self.showDeleteItem = false;
        self.refreshData(self.groupIndex);
        self.groupList[self.groupIndex].groupNum -= idArr.length;
      } else {
        self.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
        return false;
      }
    },

    confirmeditNape(index, item) {
      const self = this;
      const temp = [];
      if (item.napeName.trim().length == 0) {
        self.notify(self.$t('insSettingView.titleEmpty'), 'warning', 3000);
        return false;
      }
      // if(validateInput(item.napeName)||validateInput(item.napeDep)){
      //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
      //     return false;
      // }
      let itemScore = 0, qualifiedScore = 0, selectAvailable = [];
      if (self.activeSheetName == '0') {
        if (typeof (item.Score_3) !== 'number' && item.Score_3.trim().length == 0) {
          itemScore = 10;
          qualifiedScore = null;
        } else {
          if (item.Score_3 > 50 || item.Score_3 < 1) {
            self.notify(self.$t('insSettingView.sheetscoreA'), 'warning', 3000);
            return false;
          } else {
            itemScore = item.Score_3;
            qualifiedScore = null;
          }
        }
      } else if (self.activeSheetName == '1') {
        itemScore = item.Score_1;
        qualifiedScore = item.Score_2;
        selectAvailable = item.Score_4[0] === '-1' ? item.Score_4.slice(1) : item.Score_4;
        const availableScores = [];
        for (let i = 0; i < item.Score_1 + 1; i++) {
          availableScores.push(i);
        }
        selectAvailable.length === 0 ? selectAvailable = availableScores : null;
        selectAvailable.sort(function(a, b) {
          return a - b;
        });
        if (qualifiedScore > itemScore) {
          self.notify(self.$t('insSettingView.excelMinScoreType'), 'warning', 3000);
          return false;
        } else if (selectAvailable[selectAvailable.length - 1] > itemScore) {
          self.notify(self.$t('insSettingView.excelScoreItemType'), 'warning', 3000);
          return false;
        }
      } else if (self.activeSheetName == '2') {
        if (typeof (item.Score_3) !== 'number' && item.Score_3.trim().length == 0) {
          self.notify(self.$t('insSettingView.ScoreEmpty'), 'warning', 3000);
          return false;
        }
        if (item.Score_3 > 100 || item.Score_3 < -100) {
          self.notify(self.$t('insSettingView.sheetscore2'), 'warning', 3000);
          return false;
        } else {
          itemScore = item.Score_3;
          qualifiedScore = null;
        }
      }
      const obj = {
        id: item.id,
        subject: item.napeName,
        description: item.napeDep,
        itemScore: itemScore,
        qualifiedScore: qualifiedScore,
        availableScores: selectAvailable
      };
      temp.push(obj);
      const params = {
        'items': temp
      };
      inpectRESTful.updateInspectItem(params).then(res => {
        const codeMsg = res.errMsg;
        if (codeMsg != undefined && codeMsg == 'Success') {
          self.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          item.isClick = false;
          self.refreshData(self.groupIndex);
        } else {
          self.notify(self.$t('deviceView.editFail'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        console.log('AddRuteInspect-confirmeditNape: ' + err);
      });
    },

    cancelEditNape(index, item) {
      const curEditItem = JSON.parse(sessionStorage.getItem('curEditItem'));
      item.isClick = curEditItem.isClick;
      item.napeDep = curEditItem.napeDep;
      item.Score_1 = curEditItem.Score_1;
      item.Score_2 = curEditItem.Score_2;
      item.Score_3 = curEditItem.Score_3;
      item.Score_4 = curEditItem.Score_4;
      item.availableScoreStr = curEditItem.availableScoreStr;
      item.napeName = curEditItem.napeNameShow;
    },

    confirmaddNape() {
      const self = this;
      const temp = [];
      if (self.newNapeName.trim().length == 0) {
        self.notify(self.$t('insSettingView.titleEmpty'), 'warning', 3000);
        return false;
      }
      // if(validateInput(self.newNapeName)||validateInput(self.newNapeDep)){
      //     self.notify(self.$t('insSettingView.illegalStr'),'warning',3000);
      //     return false;
      // }
      let itemScore = 0, qualifiedScore = 0, selectAvailable = [];
      if (self.activeSheetName == '0') {
        if (typeof (self.newAddScore) !== 'number' && self.newAddScore.trim().length == 0) {
          itemScore = 10;
          qualifiedScore = null;
        } else {
          if (self.newAddScore > 50 || self.newAddScore < 1) {
            self.notify(self.$t('insSettingView.sheetscoreA'), 'warning', 3000);
            return false;
          } else {
            itemScore = self.newAddScore;
            qualifiedScore = null;
          }
        }
      } else if (self.activeSheetName == '1') {
        if (self.newCritical > self.newScore) {
          self.notify(self.$t('insSettingView.excelMinScoreType'), 'warning', 3000);
          return false;
        } else {
          itemScore = self.newScore;
          qualifiedScore = self.newCritical;
          selectAvailable = self.selectAvailable[0] === '-1' ? self.selectAvailable.slice(1) : self.selectAvailable;
          const availableScores = [];
          for (let i = 0; i < self.newScore + 1; i++) {
            availableScores.push(i);
          }
          selectAvailable.length === 0 ? selectAvailable = availableScores : null;
          selectAvailable.sort(function(a, b) {
            return a - b;
          });
          if (qualifiedScore > itemScore) {
            self.notify(self.$t('insSettingView.excelMinScoreType'), 'warning', 3000);
            return false;
          } else if (selectAvailable[selectAvailable.length - 1] > itemScore) {
            self.notify(self.$t('insSettingView.excelScoreItemType'), 'warning', 3000);
            return false;
          }
        }
      } else if (self.activeSheetName == '2') {
        if (typeof (self.newAddScore) !== 'number' && self.newAddScore.trim().length == 0) {
          self.notify(self.$t('insSettingView.ScoreEmpty'), 'warning', 3000);
          return false;
        }
        if (self.newAddScore > 100 || self.newAddScore < -100) {
          self.notify(self.$t('insSettingView.sheetscore2'), 'warning', 3000);
          return false;
        } else {
          itemScore = self.newAddScore;
          qualifiedScore = null;
        }
      }
      const objItem = {
        subject: self.newNapeName.trim(),
        description: self.newNapeDep.trim(),
        itemScore: itemScore,
        qualifiedScore: qualifiedScore,
        availableScores: selectAvailable
      };
      temp.push(objItem);
      const obj = {
        groupId: self.curGroup.id,
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
          const obj = {
            napeName: self.newNapeName,
            napeNameShow: `${self.napeList.length + 1}，${self.newNapeName}`,
            napeDep: self.newNapeDep,
            Score_1: self.newScore,
            Score_2: self.newCritical,
            Score_3: self.newAddScore,
            isClick: false,
            checked: false
          };
          self.napeList.push(obj);
          self.newNapeName = '';
          self.newNapeDep = '';
          self.newAddScore = 0;
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
          self.notify(self.$t('insSettingView.addSuss'), 'success', 3000);
          setTimeout(function() {
            if (self.tabName == '远程巡检') {
              PubSub.publish('change-color', { showTag: true });
            }
          }, 1000);
        } else {
          self.notify(self.$t('insSettingView.addFail'), 'warning', 3000);
          return false;
        }
      }).catch(err => {
        console.log('AddRuteInspect-confirmaddNape: ' + err);
      });
    },

    cancelAddNape() {
      this.showAddNape = false;
    },

    handleEdit(index, item) {
      const self = this;
      self.napeDepTemp = item.napeDep;
      sessionStorage.setItem('curEditItem', JSON.stringify(item));
      item.isClick = true;
      self.showAddNape = false;
      const arr = [];
      for (var i = 0; i <= 50; i++) {
        arr.push(i);
      }
      self.fullScoreTemp = arr.slice(1, i + 1);
      self.ScoreList = arr.slice(0, item.Score_1 + 1);
      const available = arr.slice(0, item.Score_1 + 1);
      const availableScores = [];
      available.forEach(item => {
        const obj = {
          label: item,
          value: item,
          disabled: false
        };
        availableScores.push(obj);
      });
      self.availableScores = availableScores;
      self.napeList.forEach((_item, _index) => {
        if (index != _index) {
          _item.isClick = false;
        }
      });
    },

    handleDelete(index, item) {
      const self = this;
      // if (self.napeList.length === 1 && self.groupList.length === 1) {
      //   if ((self.typeTemp.length === 2 && !self.typeTemp.some(x => x === 0) || self.typeTemp.length === 3) && self.groupList[0].type === 1) {
      //     self.showFailInfo = true;
      //     return false;
      //   }
      // }
      self.showDeleteItem = true;
      self.deleteItemFlag = 'S';
      self.curItemId = item.id;
    },

    getAllData() {
      const self = this;
      return new Promise((resolve, reject) => {
        const params = {
          inspectId: self.routeData[0].inspectId
        };
        inpectRESTful.getInspectItemList(params).then(res => {
          const code = res.errMsg;
          const data = res.data;
          if (code != null && code === 'Success') {
            console.log(res.data);
          }
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
      const params = { inspectId: inspectId };
      inpectRESTful.getInspectBindList(params).then(res => {
        if (res.errMsg != undefined && res.errMsg === 'Success') {
          const data = res.data;
          self.bindStoreList = data;
        }
      }).catch(err => {
        reject(err);
      });
    },

    async refreshData(index) {
      const self = this;
      const asds = self.routeData;
      const curTag = self.tabName;
      const allData = await self.getAllData();
      const data = util.getRouteByTag(curTag, allData);
      const temp = [];
      const groupIds = [];
      data.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.groupName = item.name;
        obj.groupNum = item.items.length;
        obj.isClick = false;
        obj.showEdit = false;
        obj.isEdit = false;
        obj.itemData = item.items;
        obj.type = item.type;
        temp.push(obj);
        groupIds.push(item.id);
      });
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
      let sheetTemp = [];
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
      sheetTemp = obj;
      self.activeSheetName = self.firstLoad ? te_temp[0][0].type.toString() : self.activeSheetName;
      self.firstLoad = false;
      self.allRoutedata = te_temp;
      self.typeTemp = type_temp;
      self.groupList = self.activeSheetName === '0' ? sheetTemp.passfail : (self.activeSheetName === '1' ? sheetTemp.score : sheetTemp.other);
      if (self.groupList.length !== 0) {
        self.groupList[index].isClick = true;
        self.curGroup = self.groupList[index];
        self.groupIndex = index;
        if (self.lang === 'en') {
          self.napeTitle = `${self.$t('insSettingView.itemsOfCate')} ${self.groupList[index].groupName}`;
        } else {
          self.napeTitle = `${self.groupList[index].groupName} ${self.$t('insSettingView.itemsOfCate')}`;
        }
        self.getNapeList(index, self.groupList[index]);
      } else {
        self.napeList = [];
        if (self.lang === 'en') {
          self.napeTitle = `${self.$t('insSettingView.itemsOfCate')}`;
        } else {
          self.napeTitle = `${self.$t('insSettingView.itemsOfCate')}`;
        }
      }
    },

    getNapeList(index, item) {
      const self = this;
      const temp = [];
      item.itemData.forEach((_item, index) => {
        const availableScores = [];
        for (let i = 0; i <= _item.itemScore; i++) {
          const scoreObj = {
            label: i,
            value: i,
            disabled: false
          };
          availableScores.push(scoreObj);
        }
        self.availableScores = availableScores;
        let availableScoreStr = '';
        if (_item.availableScores.length !== 0) {
          availableScoreStr = _item.availableScores.toString();
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
          isClick: false,
          checked: false
        };
        temp.push(obj);
      });
      self.napeList = temp;
    },

    initData() {
      const self = this;
      const arr = [];
      for (var i = 0; i <= 50; i++) {
        arr.push(i);
      }
      self.ScoreList = arr.slice(0, i + 1);
      const available = arr.slice(0, i + 1);
      const availableScores = [];
      available.forEach(item => {
        const obj = {
          label: item,
          value: item,
          disabled: false
        };
        availableScores.push(obj);
      });
      self.availableScores = availableScores;
      self.tabName = sessionStorage.getItem('GroupName');
      const itemSettingData = JSON.parse(sessionStorage.getItem('itemSettingData'));
      self.routeName = itemSettingData.routeName;
      self.routeData = itemSettingData.routeData;
      self.refreshData(0);
      self.getBindStoreList();
    },

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    },

    groupNameChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 30);
      const length = filterString.getContentLength(val);
      if (Object.keys(item).length === 0) {
        self.groupNameInput = comment;
      } else {
        item.groupName = comment;
      }
      if (length > 30) {
        this.enterNameRuletip = true;
      } else {
        this.enterNameRuletip = false;
      }
    },

    inputChange(val) {
      const self = this;
      if (val.indexOf('-') !== -1) {
        self.newAddScore = '-' + val.replace(/[^\d]/g, '');
      } else {
        self.newAddScore = val.replace(/[^\d]/g, '');
      }
    },

    editinputChange(item, index) {
      if (item.Score_3.indexOf('-') !== -1) {
        item.Score_3 = '-' + item.Score_3.replace(/[^\d]/g, '');
      } else {
        item.Score_3 = item.Score_3.replace(/[^\d]/g, '');
      }
    },

    selectFullScore(val, item) {
      const self = this;
      const arr = [];
      for (var i = 0; i <= 50; i++) {
        arr.push(i);
      }
      self.ScoreList = arr.slice(0, val + 1);
      const available = arr.slice(0, val + 1);
      const availableScores = [];
      available.forEach(item => {
        const obj = {
          label: item,
          value: item,
          disabled: false
        };
        availableScores.push(obj);
      });
      self.availableScores = availableScores;
      if (item !== undefined) {
        item.Score_4 = arr.slice(0, val + 1);
        item.Score_2 = val;
      } else {
        self.selectAvailable = arr.slice(0, val + 1);
        newCritical = val;
      }
    },

    napeNameChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 100);
      const length = filterString.getContentLength(val);
      if (Object.keys(item).length === 0) {
        self.newNapeName = comment;
      } else {
        item.napeName = comment;
      }
      if (length > 100) {
        this.enterListNameRuletip = true;
      } else {
        this.enterListNameRuletip = false;
      }
    },

    napeDepChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 1200);
      const length = filterString.getContentLength(val);
      if (Object.keys(item).length === 0) {
        self.newNapeDep = comment;
      } else {
        item.napeDep = comment;
      }
      if (length > 1200) {
        this.descriptionRuletip = true;
      } else {
        this.descriptionRuletip = false;
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
    $border:#e3e9f4;
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
    #el-menuscrollbar /deep/ .el-scrollbar__thumb{
        width:0 !important;
    }
    .el-addrute{
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 125px - 60/1920*100vw);
        color: $black;
        border: 1px solid $border;
        background-color: #fff;
        font-size: calc(18/1920*100vw);
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
                text-align: left ;
                margin-left:calc(15/1920*100vw);
                font-weight: bold;
            }
            .icon-tabname{
                margin-left:calc(25/1920*100vw);
                color: #ddd;
                cursor: pointer;
            }
            .tabName-input{
                @include point(width,180);
                float: left;
                @include point(margin-left,5);
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
        .rute-btn{
            //background-color: $red;
            border-color: $red;
            color: #fff;
            font-size: 12px;
        }
        .en-rute-btn{
          //background-color: $red;
          border-color: $red;
          color: #fff;
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          line-height: calc(36/1920*100vw);
          padding: 0 0;
          width: calc(130/1920*100vw);
          .el-icon-plus{
            font-size:calc(24/1920*100vw);
          }
          .icon-shanchu{
            font-size:calc(24/1920*100vw);
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
                font-size: 16px;
              }
              .level2-name{
                font-size: 16px;
                margin-left: 0;
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
                margin-right: calc(20/1920*100vw);
            }
        }
        .el-rute-group{
            height: auto;
            min-height:calc(100% - 60px);
            min-height: -webkit-calc(100% - 60px);
            min-height: -moz-calc(100% - 60px);
            background-color: #FAFAFA;
            .group-items{
                font-size: 14px;
                .top-group-title{
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    font-size: 14px;
                    color: $tab;
                    .group-name-title{
                        #group-content /deep/ .el-tabs__nav-wrap{
                            margin-left: 6px;
                        }
                        #group-content /deep/ .el-tabs__active-bar{
                            height: 4px;
                        }
                        #group-content /deep/ .el-tabs__item {
                            font-weight: bold;
                            color: #94A4B4;
                            font-size: calc(14/1920*100vw);
                            width: calc(131/1920*100vw);
                            min-width:92px;
                            padding:0;
                        }
                        #group-content /deep/ .el-tabs__item.is-active{
                            color: #f31d65;
                        }
                    }
                }
                .groupItem{
                    height: 60px;
                    line-height: 60px;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid $border;
                    cursor: pointer;
                    text-align: left;
                    .proper-flag{
                        height: 70%;
                        width: 4px;
                        position:absolute;
                        top: 15%;
                        background-color: $red;
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
                            .nape-items-handle{
                                .iconfont{
                                font-size: calc(24/1920*100vw);
                                color: #7d8cad;
                                font-weight: 400;
                                }
                            }
                        }
                    }
                    &:last-child{
                        @include point(margin-bottom,20);
                    }
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
                    .FullScore-input /deep/ .el-input{
                        width:65px;
                        margin: 0 auto;
                    }
                    .critical-input /deep/ .el-input{
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
                .nape-scores-handle /deep/ .el-select.el-select--mini{
                    width:110px !important;
                    height:45px !important;
                    background-color: #fee4e7 !important;
                    color:#424151 !important;
                }
                .nape-scores-handle /deep/ .el-province .el-input--mini .el-input__icon{
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
            background-color: #fff;
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
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.nape-input .el-textarea__inner{
    font-family: Roboto, Arial, 'Microsoft YaHei';
}
</style>
