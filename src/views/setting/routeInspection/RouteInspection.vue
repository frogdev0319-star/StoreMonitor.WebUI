<template>
  <el-row id="inspectSetting" class="el-route-container">
    <el-col :span="24" class="el-route-header">
      <el-col class="flex el-route-btns" style="height: 36px">
        <input
          id="loadFileEx"
          ref="loadFileEx"
          type="file"
          style="display: none"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="importfxx(this)" >
        <div
          v-for="(item,index) in btnList"
          :key="index"
          :disabled="item.enabled"
          style="display:flex;flex-direction:row;margin-right: 16px; line-height: 24px;cursor:pointer;"
          class="storevue-button-empty"
          size="mini"
          @click="handleNape(index,item)">
          <!--<i :class="item.iconClass" :style="item.style"/>-->
          <img :src="item.img" :style="item.style"/>
          <div style="font-size:15px;margin-left:8px;">{{ item.btnTitle }}</div>
        </div>
          <el-button
            type="primary"
            size="small"
            style="font-size:15px;"
            class="storevue-button-outlined"
            :disabled="elTableData[Number(activeName)].data.length === 0"
            @click="bindStore"
          >
            {{ $t('insSettingView.bindList') }} 
          </el-button>
      </el-col>
      <el-col
        v-loading="isLoading"
        :span="18"
        :style="{'min-height':varyWindowWidth - 250 +'px'}"
        :element-loading-text="$t('insSettingView.loadingbindstore')"
        class="el-route-tabs loading_area self-loading">
        <el-tabs
          id="en-patrltabs-content"
          v-model="activeName"
          :style="{'min-height':varyWindowWidth - 250 +'px'}"
          @tab-click="handleClick">
          <el-tab-pane
            v-for="(item,index) in elTableData"
            :key="index"
            :label="index < 2 ? getLang(index) : item.label"
            :name="index.toString()"
            :closable ="index !== 0 && index !== 1 ? true : false">
            
            <el-tabs
              v-if="item.data.length !== 0 && !isLoading"
              id="patrltabs-content"
              v-model="patrolActive"
              :style="{'min-height':varyWindowWidth*0.70+'px'}"
              @tab-click="handleClickPatrol" >
              <el-tab-pane v-for="(_item,_index) in item.data" :key="_index" :name="_index.toString()">
                <div class="flex-center" style="color: #acaeb1; font-size: 15px; margin: 15px 0">
                  <div class="temp-select-area" :style="lang.indexOf('zh') === -1 ? {'width':'250px'}:{}">
                    <div class="temp-select-label" :style="lang.indexOf('zh') === -1 ? {'width':'105px'}:{}">{{ $t('overview.patrolLists') }}</div> 
                    <el-select
                      v-model="patrolActive"
                      class="device-select"
                      
                      size="mini"
                      @change="handleClickPatrol"
                      placeholder="">
                      <el-option
                        v-for="(_item, _index) in item.data"
                        style="width:fit-content;padding-right:50px;"
                        :key="_index"
                        :label="_item.name"
                        :value="String(_index)"
                      />
                    </el-select>
                  </div>
                  <span style="font-size:15px;margin-left:16px" :class="lang.indexOf('zh') === -1 ? 'en-bind-title': 'bind-title'">
                    {{ $t('insSettingView.bindWith') }}{{ storeNum }} {{ $t('insSettingView.bindStore') }}
                  </span> 
                  <div class="spacer"></div>
                  <div
                    style="display:flex;flex-direction:row;margin-right: 16px; line-height: 24px;cursor:pointer;"
                    class="storevue-button-empty"
                    size="mini"
                    @click="setWeighting">
                    <img :src="WeightingSetting" style="width:24px;height:24px;"/>
                    <div style="font-size:13px;margin-left:8px;font-family:'NotoSansCJKtc';">{{ $t('insSettingView.weightSetting') }}</div>
                  </div>
                  <div style="display:flex; flex-direction:row;font-size: 13px;align-items:center" @click="setItem(_item.routeData, _item.name, '', _item.name)">
                    <!--<i class="iconfont icon-quxiaolianjie"/>-->
                    <img :src="require('../../../../static/img/ic_relate.svg')" style="width:24px;height:24px;"/>
                    <div style="color: #006ab7;margin-left:8px; margin-right: 5px;cursor:pointer;"><u>{{ $t('insSettingView.relationDuty')}}</u></div>
                    <div>{{ '：'+_item.routeData[0].ModelPost }}</div>
                  </div>
                </div>
                <div v-if="_item.routeData && !loading">
                  <route-detail
                    :ref="curIndex"
                    :route-data="_item.routeData"
                    :route-name="_item.name"
                    :down-src="downLoadSrc"
                    :all-routedata="_item.allRoutedata"
                    :sheet-name="_item.sheetName"
                    :tab-name="_item.name"
                    :show-drag-info="showDragInfo"
                    @refreshList="getTagList"
                    @change-routeData="changerouteData"/>
                </div>
                <!-- loading -->
                <div v-if="loading" :style="{'line-height':varyWindowWidth*0.52+'px'}" class="bind-empty">
                  <img :src="loadingGif" class="loading_rotate">
                  <span class="empty-text">{{ $t('insSettingView.loadingbindstore') }}</span>
                </div>
                
              </el-tab-pane>
            </el-tabs>
            <div v-if="item.data.length === 0 && !isLoading" :style="{'min-height':varyWindowWidth*0.52+'px'}" class="data-empty">
              <i class="iconfont icon-wenjian" style="font-size:100px;color:#E0E5F4"/>
              <p class="empty-title">
                {{ $t('insSettingView.please') }}
                <a :href="downLoadSrc" :download="fileName" class="downLoad-btn">{{ $t('insSettingView.downloadInfo') }}</a>
                {{ $t('insSettingView.toEdit') }}
                <span @click="showNameImport = true">{{ $t('insSettingView.thenImport') }}</span>
                {{ $t('insSettingView.waveline') }}
              </p>
              <input
                id="uploadFile"
                ref="loadFile"
                type="file"
                style="display: none"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                     application/vnd.ms-excel"
                @change="importfxx(this)" >
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>
    <dialog-pop
      :title="$t('insSettingView.import')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showNameImport"
      :confirm-text="$t('insSettingView.select')"
      :isWarning="true"
      class="dialog-content"
      @visibleChangeHandler="cancelImportName"
      @cancelHandler="cancelImportName"
      @confirmHandler="confirmImportName"
    >
      <div class="import-file-slot">
        <el-input
          v-model="ImportName"
          :placeholder="$t('insSettingView.enterListName')"
          class="inspection-name"
          @input="watchName"/>
        <p v-if="isShowWarning" style="font-size:12px;color:red;margin:5px 0 0 0;">{{ warningContent }}</p>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('insSettingView.importFailTitle')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showFailInfo"
      :show-close="false"
      :isWarning="true"
      class="dialog-content"
      @visibleChangeHandler="updateShowInfoDialog"
      @cancelHandler="hideShowInfoDialog"
      @confirmHandler="hideShowInfoDialog"
    >
      <div class="import-slot">
        <span>{{ $t('insSettingView.FailTitle') }}</span>
      </div>
      <ul class="ul_style">
        <li v-for="(item,index) in FileInfo" :key="index" class="li_style">
          <div class="list_style"/>
          {{ item }}
        </li>
      </ul>
    </dialog-pop>

    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showSingleDeleteContent"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag"
      @cancelHandler="hideDeleteContentDialog"
      @confirmHandler="confirmDelete"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('insSettingView.confirmDelData') }} </div>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('remotePatrol.prompt')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showNoPostDialog"
      :isWarning="true"
      @visibleChangeHandler="updateTitleDialogFlag"
      @cancelHandler="hideNoTitleDialog"
      @confirmHandler="confirmToBind"
    >
      <div class="dialog-slot">
        <span>{{ $t('insSettingView.confirmToBindData') }}</span>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('remotePatrol.prompt')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showImportSucceed"
      :isWarning="true"
      @visibleChangeHandler="updateImportSuccDialogFlag"
      @cancelHandler="hideImportSuccDialog"
      @confirmHandler="toSetRules"
    >
      <div class="dialog-slot">
        <span>{{ $t('insSettingView.confirmToSetRule') }}</span>
      </div>
    </dialog-pop>
                
    <dialog-pop
      :title="$t('insSettingView.weightSetting')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showWeightSetting"
      :isWarning="true"
      :dialogWidth="'550px'"
      @visibleChangeHandler="showWeightSetting = false"
      @cancelHandler="showWeightSetting = false"
      @confirmHandler="updateGroupWeight"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          <div class="flex-center margin-bottom-sm">
            <div class="spacer">{{$t('insSettingView.inspectName')}}</div>
            <div class="spacer flex">{{$t('insSettingView.weight')}}
              <div class="spacer"></div>
              <el-switch
                style="margin-right: 10px"
                v-model="isAllWeight"
                @change="handleWeightSwitch"
              >
              </el-switch>
              {{ $t('insSettingView.weightSetting') }}
            </div>
          </div>
          <div style="height: 400px; overflow: auto">
            <div v-for="item in weightOptions" :key="item.id" class="flex-center margin-bottom-sm">
              <span class="spacer">{{item.name}}</span>
              <el-input
                v-if="item.weight != -1"
                class="spacer"
                type="number"
                min="0"
                max="100"
                @input="val => onWeightChange(item, val)"
                :value="item.weight"
              />
              <el-input
                v-else
                class="spacer"
                type="text"
                value="--"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </dialog-pop>
    
  </el-row>
</template>
<script>
import RouteDetail from '@/views/setting/routeInspection/RouteDetail';
import { inpectRESTful, titleRESTful } from '@/api/index';
import { validateInput } from '@/common/validate';
import { isLoginIn } from '@/api/login';
import { mapGetters } from 'vuex';
import filterString from '@/common/filterString';
import { getScheduleListService } from '@/api/schedule';
import Environment from '@/common/environment';
import DelayButton from '@/components/DelayButton';
import util from '@/common/util';
import DialogPop from '@/components/DialogPop';
import deepClone from 'nanoclone';
import i18n from '@/lang';
const XLSX = require('xlsx');

export default {
  name: 'RouteInspection',
  components: {
    DialogPop,
    DelayButton,
    RouteDetail
  },
  data() {
    return {
      elTableData: [{ label: '现场巡检', data: [] }, { label: '远程巡检', data: [] }],
      loadingGif: require('../../../../static/img/loading.svg'),
      WeightingSetting:require('../../../../static/img/ic_WeightingSetting_blue.svg'),
      radioList: [
        {
          'value': '1',
          'label': '远程巡检'
        },
        {
          'value': '2',
          'label': '现场巡检'
        }
      ],
      showNoPostDialog: false,
      showWeightSetting: false,
      loading: false,
      varyWindowWidth: window.innerHeight,
      addPatrol: '新增巡检表',
      patrolActive: '0',
      PatrolListOne: '0',
      PatrolListTwo: '0',
      warningContent: '',
      isShowWarning: false,
      downLoadSrc: '',
      curIndex: 'id0',
      showBtnContent: false,
      showSingleDeleteContent: false,
      reload: true,
      storeNum: 0,
      activeName: '',
      showImportContent: false,
      showConfirmImport: false,
      showNameImport: false,
      ImportName: '',
      showFailInfo: false,
      FileInfo: [],
      checkValue: '',
      tabNameInput: '',
      hideUpload: false,
      tempdata: [],
      showImportSucceed: false,
      importCount: 0,
      allScoreWeightEmpty: true,
      allPassWeightEmpty: true,
      weightSwitch: false,
      btnList: [
        {
          id: 0,
          iconClass: 'iconfont icon-daoru',
          style: 'font-size:15px;width:24px;height:24px;',
          name: 'import',
          btnTitle: this.$t('insSettingView.import'),
          enabled: false,
          img:require('../../../../static/img/ic_import_blue.svg')
        },
        {
          id: 0,
          iconClass: 'iconfont icon-daochu',
          style: 'font-size:15px;',
          name: 'export',
          btnTitle: this.$t('insSettingView.export'),
          enabled: false,
          img:require('../../../../static/img/ic_export_blue.svg')
        },
        {
          id: 0,
          iconClass: 'iconfont icon-xiazai',
          style: 'font-size:15px;',
          name: 'download',
          btnTitle: this.$t('insSettingView.download'),
          enabled: false,
          img:require('../../../../static/img/ic_download_blue.svg')
        },
        {
          id: 0,
          iconClass: 'iconfont icon-shanchu',
          style: 'font-size:15px;',
          name: 'delete',
          btnTitle: this.$t('scheduleView.delete'),
          enabled: false,
          img:require('../../../../static/img/ic_delete_blue.svg')
        }
      ],

      tagList: ['远程巡检', '现场巡检'],
      curData: [],
      fileName: this.$t('insSettingView.patrolExample'),
      lang: this.$i18n.locale,
      taglangList: [this.$t('insSettingView.remotePatrol'), this.$t('insSettingView.onsitePatrol')],
      isLoading: true,
      showDragInfo: true,
      weightOptions: []
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' }),
    isAllWeight () {
      return this.weightOptions.some(item => item.weight != -1)
    }
  },

  watch: {
    accountChanged(val, oldVal) {
      const self = this;
      if (val !== 0) {
        sessionStorage.removeItem('TabPatrolIndex0');
        sessionStorage.removeItem('TabPatrolIndex1');
        self.activeName = '0';
        self.getTagList('accountChanged');
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'itemSetting') {
        to.meta.keepAlive = false;
      } else {
        to.meta.keepAlive = false;
      }
    });
  },

  beforeRouteLeave(to, from, next) {
    const self = this;
    if (to.name === 'itemSetting' || to.name === 'bindStore' || to.name === 'setRule') {
      const historyObj = {
        activeName: self.activeName,
        patrolActive: self.patrolActive
      };
      self.$store.dispatch('setInspectHistory', historyObj);
      next();
    } else {
      self.$store.dispatch('setInspectHistory', null);
      sessionStorage.removeItem('TabPatrolIndex0');
      sessionStorage.removeItem('TabPatrolIndex1');
      sessionStorage.removeItem('TabIndex');
      next();
    }
  },

  mounted() {
    const self = this;
    const InspectHistory = self.$store.getters.InspectHistory;
    if (InspectHistory != null) {
      self.activeName = InspectHistory.activeName;
      self.patrolActive = InspectHistory.patrolActive;
    } else {
      const tabIndex = sessionStorage.getItem('TabIndex');
      if (tabIndex !== null) {
        self.activeName = tabIndex;
        if (self.activeName === '0') {
          self.patrolActive = sessionStorage.getItem('TabPatrolIndex0');
        } else if (self.activeName === '1') {
          self.patrolActive = sessionStorage.getItem('TabPatrolIndex1');
        }
      }
    }
    self.getTagList();
    self.initData();
    document.getElementById('inspectSetting').addEventListener('mousedown', this.notShowDragInfo, false);
  },

  methods: {
    onWeightChange (item, val) {
      var re = /^[0-9]+$/ ;
      if (re.test(Number(val))) {
        if (Number(val) > 100) {
          item.weight = 100
        } else {
          item.weight = val
        }
      }
    },
    handleWeightSwitch (val) {
      this.weightOptions = this.weightOptions.map(item => ({ ...item, weight: val ? 0 : -1 }))
    },
    changeItemWeight (val, item) {
      item.weight = val ? 0 : -1
    },
    updateGroupWeight () {
      let groups = this.weightOptions.map(group => ({
        id: group.id,
        weight: Number(group.weight)
      }))
      let count = 0 
      groups.forEach(group => {
        if (group.weight != -1) count += group.weight
      })
      const isAllWeightEmpty = this.weightOptions.every(group => group.weight == -1)
      const self = this;
      if (count === 100 || isAllWeightEmpty) {
        inpectRESTful.updateGroupWeight({ groups }).then(() => {
          util.notify(self.$t('titleView.saveSuss'), 'success', 3000)
          this.showWeightSetting = false;
          this.getTagList();
        })
      } else {
        util.notify(self.$t('insSettingView.weightTotalError'), 'error', 3000);
      }
    },
    setWeighting () {
      this.showWeightSetting = true;
      this.getTagList();
    },
    setItem(routeData, tabName, tabNameLang, routeName) {
      const self = this;
      sessionStorage.setItem('NapeItem', JSON.stringify(routeData));
      sessionStorage.setItem('GroupName', tabName);
      const params = {
        routeData: routeData,
        tabNameLang: tabNameLang,
        routeName: routeName
      };
      sessionStorage.setItem('itemSettingData', JSON.stringify(params));
      self.$router.push({ name: 'itemSetting', params: params });
    },
    notShowDragInfo() {
      this.showDragInfo = false;
      document.getElementById('inspectSetting')
      && document.getElementById('inspectSetting').removeEventListener('mousedown', this.notShowDragInfo, false);
    },

    getScheduleFromDB(params) {
      return new Promise((resolve, reject) => {
        getScheduleListService(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    emptyImport() {
      document.getElementById('uploadFile').click();
    },

    getLang(index) {
      if (index === 0) {
        return this.$t('insSettingView.onsitePatrol');
      } else if (index === 1) {
        return this.$t('insSettingView.remotePatrol');
      } else {
        return '';
      }
    },

    initData() {
      const self = this;
      switch (Number(self.activeName)) {
        case 0: self.checkValue = '现场巡检'; break;
        case 1: self.checkValue = '远程巡检'; break;
        default:self.checkValue = '新增巡检表'; break;
      }
    },

    downItem() {
      const self = this;
      inpectRESTful.downLoadTemplate().then(res => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const objectUrl = URL.createObjectURL(blob);
        const url = objectUrl;
        self.downLoadSrc = url;
        var link = document.createElement('a');
        link.href = url;
        link.download = self.fileName;
        link.click();
      }).catch(err => {
        console.log('RouteInspection-downItem: ' + err);
      });
    },

    getDownLoadURL() {
      const self = this;
      inpectRESTful.downLoadTemplate().then(res => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const objectUrl = URL.createObjectURL(blob);
        const url = objectUrl;
        self.downLoadSrc = url;
        // window.open(self.downLoadSrc,'_self');
      }).catch(err => {
        console.log('RouteInspection-getDownLoadURL: ' + err);
      });
    },

    getTagAll() {
      const self = this;
      const params = {
        mode: parseInt(self.activeName) === 0 ? 1 : 0
      };
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectTagList(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getNapeList(params) {
      const self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.getInspectItemList(params).then(res => {
          const code = res.errMsg;
          const data = res.data;
          resolve(data);
        }).catch(err => {
          console.log(err.message);
          reject(err);
          //util.notify(this.$t('insSettingView.importFail'), 'warning', 3000);
          //self.loading = false;
        });
      });
    },

    getInspectGroupBindAll(params) { // get related role
      const self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.GetInspectGroupBindList(params).then(res => {
          const data = res.data;
          resolve(data);
        }).catch(err => {
          console.log(err.message);
        });
      });
    },

    changerouteData(val) {
      const self = this;
      self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData = val;
    },

    async getTagList(val, sheetIndex) {
      const self = this;
      const TagData = await self.getTagAll();
       console.log(">>>self.patrolActive:",self.patrolActive);
      if (TagData.length != 0) {
        if (val == 'del' || self.$route.params.val == 'del') {
          if (Number(self.patrolActive) == TagData.length) {
            self.patrolActive = (TagData.length - 1).toString();
          }
        }
        if (val == 'accountChanged') {
          self.patrolActive = '0';
        }
        let tagIndex = 0;
        if (val == 'add') {
          tagIndex = TagData.length - 1;
        } else {
          tagIndex = Number(self.patrolActive);
        }
        if (self.activeName === '0') {
          sessionStorage.setItem('TabPatrolIndex0', tagIndex);
        } else if (self.activeName === '1') {
          sessionStorage.setItem('TabPatrolIndex1', tagIndex);
        }
        const params = {
          inspectId: TagData[tagIndex].id
        };
        const NapeData = await self.getNapeList(params);
        const tempAllData = [];
        const obj = {};
        const temp = [];
        const groupids = [];
        self.weightOptions = [];
        NapeData.forEach((_item, _index) => {
          const _obj = {};
          _obj.id = _item.id;
          _obj.groupName = _item.name;
          _obj.weight = _item.weight;
          if (_item.parentId === -1 && _item.type !== 2) self.weightOptions.push({ id: _item.id, name: _obj.groupName, weight: _item.weight, setWeight: _item.weight != -1 })
          _obj.itemCount = _item.items.length;
          _obj.type = _item.type;
          _obj.checked = false;
          _obj.parentId = _item.parentId;
          _obj.groupScore = _item.groupScore;
          const tempChild = [];
          _item.items.forEach(itemChild => {
            const objChild = {};
            objChild.id = itemChild.id;
            objChild.checked = false;
            objChild.name = itemChild.subject;
            objChild.description = (itemChild.description == undefined || itemChild.length == 0) ? '--' : itemChild.description;
            objChild.score = itemChild.itemScore;
            objChild.qualifiedScore = itemChild.qualifiedScore;
            objChild.sequence = itemChild.sequence;
            objChild.type = itemChild.type;
            objChild.required = itemChild.required;
            let availableScores = '';
            if (itemChild.availableScores.length !== 0) {
              itemChild.availableScores.forEach((x_item, x_index) => {
                const isuu = x_index === itemChild.availableScores.length - 1 ? '' : '/';
                availableScores += x_item + isuu;
              });
            } else {
              for (let i = 0; i < itemChild.itemScore + 1; i++) {
                const isuu = i === itemChild.itemScore ? '' : '/';
                availableScores += i + isuu;
              }
            }
            objChild.availableScores = availableScores;
            tempChild.push(objChild);
          });
          _obj.itemData = tempChild;
          _obj.inspectId = TagData[tagIndex].id; // 巡检表
          _obj.mode = TagData[Number(self.patrolActive)].mode; // 巡检类别
          groupids.push(_item.id);
          temp.push(_obj);
        });
        const postparams = {
          groupIds: groupids
        };
        const titletemp = await self.getInspectGroupBindAll(postparams);
        const titleList = await self.getUserTitleList();
        temp.forEach(te_item => {
          const usertext = [];
          titletemp.forEach(ti_item => {
            if (te_item.id == ti_item.groupId) {
              if (ti_item.userTitles.length != 0) {
                if (ti_item.userTitles.length == titleList.data.length) {
                  te_item['ModelPost'] = self.$t('remotePatrol.all');
                } else {
                  ti_item.userTitles.forEach(u_item => {
                    usertext.push(u_item.titleName);
                    te_item['ModelPost'] = usertext.toString();
                  });
                }
              } else {
                te_item['ModelPost'] = null;
              }
            }
          });
        });
        const te_temp = [];
        const sheetName = [];
        for (let i = 0; i < 3; i++) {
          const Typeindex = temp.filter(x => x.type == i);
          let obj = {};
          if (Typeindex.length != 0) {
            te_temp.push(Typeindex);
            if (Typeindex[0].type == 0) {
              obj = { 'id': 0, 'isClick': false, 'label': self.$t('insSettingView.sheetpassfail') };
            }
            if (Typeindex[0].type == 1) {
              obj = { 'id': 1, 'isClick': false, 'label': self.$t('insSettingView.sheetscore') };
            }
            if (Typeindex[0].type == 2) {
              obj = { 'id': 2, 'isClick': false, 'label': self.$t('insSettingView.sheetother') };
            }
            sheetName.push(obj);
          }
        }
        let i = 0;
        if (sheetIndex != undefined) {
          if (sheetName.length == 3) {
            i = sheetIndex == -1 ? 0 : sheetIndex;
          } else if (sheetName.length == 2) {
            if (sheetName.some(x => x.id == 2)) {
              i = sheetIndex == -1 || sheetIndex == 0 ? 0 : sheetIndex - 1;
            } else {
              i = sheetIndex == -1 ? 0 : (sheetIndex == 2 ? 1 : sheetIndex);
            }
          } else if (sheetName.length == 1) {
            i = 0;
          }
        }
        sheetName[i].isClick = true;
        self.tempdata = temp;
        const tagTemp = [];
        TagData.forEach((tag_item, tag_index) => {
          const tagObj = {};
          let label = '';
          if (tag_item.mode == 0) {
            label = '现场巡检';
          } else if (tag_item.mode == 1) {
            label = '远程巡检';
          }
          tagObj.label = label;
          tagObj.name = tag_item.name;
          tagObj.routeData = te_temp[i];
          tagObj.allRoutedata = te_temp;
          tagObj.sheetName = sheetName;
          tagTemp.push(tagObj);
        });
        if (self.activeName == 0) {
          if (temp.length == 0) {
            self.getDownLoadURL();
          }
          self.elTableData[0].data = tagTemp;
        } else if (self.activeName == 1) {
          if (temp.length == 0) {
            self.getDownLoadURL();
          }
          self.elTableData[1].data = tagTemp;
        } else {
          obj.label = item;
          obj.data = { name: '', routeData: te_temp[0] };
          // tempAllData.push(obj);
        }
        // })
        self.elTableData = self.elTableData.concat(tempAllData);
        if (val == 'add') {
          self.patrolActive = (TagData.length - 1).toString();
          self.showImportSucceed = true;
        }
      } else {
        self.getDownLoadURL();
        self.elTableData = [{ label: '现场巡检', data: [] }, { label: '远程巡检', data: [] }];
      }
      self.getBindStoreList();
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

    deleteItem(itemIdList) {
      const params = {
        itemIds: itemIdList
      };
      return new Promise((resolve, reject) => {
        inpectRESTful.deleteInspectItem(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    deleteGroup(groupIdList) {
      const params = {
        groupIds: groupIdList
      };
      return new Promise((resolve, reject) => {
        inpectRESTful.deleteInspectGroup(params).then(res => {
          resolve(res);
        });
      }).catch(err => {
        reject(err);
      });
    },

    addGroup(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.addInspectGroup(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addItem(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.addInspectItem(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async addAllDataCopy({
      PassFail,
      Score,
      Others
    }) {
      try {
        PassFail && await this.resolveSheetData(PassFail, 'PassFail');
        Score && await this.resolveSheetData(Score, 'Score');
        Others && await this.resolveSheetData(Others, 'Others');
        await this.getTagList('add');
      } catch (e) {
        util.notify(this.$t('insSettingView.importFail'), 'warning', 3000);
        console.log('importFile -' + e);
      }
    },

    getPrimaryColumCells({ sheet, range }) {
      const primaryColumnCells = [];
      this.traverseSheet({
        sheet,
        range: {
          s: {
            c: range.s.c,
            r: range.s.r + 1
          },
          e: {
            c: range.s.c,
            r: range.e.r
          }
        },
        fn: ({ sheet, cellRef }) => {
          primaryColumnCells.push(sheet[cellRef]);
        }
      });
      return primaryColumnCells;
    },

    traverseSheet({ sheet, range, fn }) {
      for (let r = range.s.r; r <= range.e.r; ++r) {
        for (let c = range.s.c; c <= range.e.c; ++c) {
          const cellAddress = { c, r };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          fn({ sheet, cellAddress, cellRef });
        }
      }
    },

    formatSheetCells({ sheet, range }) {
      this.traverseSheet({ sheet, range, fn: ({ sheet, cellAddress, cellRef }) => {
        const headerRef = XLSX.utils.encode_cell({ c: cellAddress.c, r: range.s.r });
        const header = sheet[headerRef];
        sheet[cellRef] = {
          ...sheet[cellRef],
          cellRef,
          cellAddress,
          parent: null,
          header,
          tag: header && header.v && this.formatTableHeader(header.v)
        };
      } });
    },

    getSheetCells({ sheet, range }) {
      const cells = [];
      this.traverseSheet({
        sheet,
        range,
        fn: ({ sheet, cellRef }) => {
          cells.push(sheet[cellRef]);
        }
      });

      return cells;
    },

    getSecondaryColumnHeadCell({ type, sheet }) {
      const range = XLSX.utils.decode_range(sheet['!ref']);
      const secondaryColumnCellAddress = { c: range.s.c + (type === 'Others' ? 1 : 2), r: range.s.r };
      const cell = sheet[XLSX.utils.encode_cell(secondaryColumnCellAddress)];
      const subCategoryArr = this.getAllTranslationBasedOnKey('insSettingView.subCategory');
      return cell && subCategoryArr.includes(cell.tag) && cell;
    },

    async resolveSheetData(sheet, type) {
      const range = XLSX.utils.decode_range(sheet['!ref']);
      sheet.$$type = type;
      
      this.formatSheetCells({ sheet, range });
      let primaryColumnCells = this.getSheetCells({
        sheet,
        range: {
          s: {
            c: range.s.c,
            r: range.s.r + 1
          },
          e: {
            c: range.s.c,
            r: range.e.r
          }
        }
      });
      const primaryGroupCelss = [];
      const secondaryGroupCells = [];
      const groupItemCells = [];

      if (!primaryColumnCells.some(cell => cell.v) && type === 'PassFail') {
        primaryColumnCells = [{ ...primaryColumnCells[0], v: this.$t('insSettingView.Ratingitems') }];
      }
      if (!primaryColumnCells.some(cell => cell.v) && type === 'Others') {
        primaryColumnCells = [{ ...primaryColumnCells[0], v: this.$t('insSettingView.Addscoreitems') }];
      }
      var names_ = {}
      primaryColumnCells.filter(cell => cell.v).forEach((cell, i) => {
        if (names_[cell.v] === undefined) {
          if (type === 'Others') {
            names_[cell.v] = cell.v
            primaryGroupCelss.push({ ...cell });
          } else {
            names_[cell.v] = cell.v
            primaryGroupCelss.push({ ...cell, weight: sheet['B' + cell.cellRef.slice(1)].v });
          }
        }
        
        let next, current = sheet[cell.cellRef];
        
        if (primaryColumnCells.filter(cell => cell.v)[i + 1]) {
          next = sheet[primaryColumnCells.filter(cell => cell.v)[i + 1].cellRef];
          sheet[cell.cellRef].next = sheet[primaryColumnCells.filter(cell => cell.v)[i + 1].cellRef];
        }
        const secondaryColumnHeadCell = this.getSecondaryColumnHeadCell({ type, sheet });
        let secondaryColumnCells = [];
        if (secondaryColumnHeadCell) {
          if (next && next.v) {
            secondaryColumnCells = this.getSheetCells({
              sheet,
              range: {
                s: {
                  c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                  r: current.cellAddress.r
                },
                e: {
                  c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                  r: next.cellAddress.r - 1
                }
              }
            });
          } else {
            secondaryColumnCells = this.getSheetCells({
              sheet,
              range: {
                s: {
                  c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                  r: current.cellAddress.r
                },
                e: {
                  c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                  r: current.parent && current.parent.next ? current.parent.next.cellAddress.r - 1 : range.e.r
                }
              }
            });
          }

          if (secondaryColumnCells.filter(cell => cell.v).length) {
            if (next && next.v) {
              this.traverseSheet({
                sheet,
                range: {
                  s: {
                    c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                    r: current.cellAddress.r
                  },
                  e: {
                    c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                    r: next.cellAddress.r - 1
                  }
                },
                fn: ({ sheet, cellRef }) => {
                  sheet[cellRef] = {
                    ...sheet[cellRef],
                    parent: sheet[cell.cellRef]
                  };
                  if (sheet[cellRef].v) {
                    secondaryGroupCells.push(sheet[cellRef]);
                  }
                }
              });
            } else {
              this.traverseSheet({
                sheet,
                range: {
                  s: {
                    c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                    r: current.cellAddress.r
                  },
                  e: {
                    c: current.cellAddress.c + (type === 'Others' ? 1 : 2),
                    r: range.e.r
                  }
                },
                fn: ({ sheet, cellRef }) => {
                  sheet[cellRef] = {
                    ...sheet[cellRef],
                    parent: sheet[cell.cellRef]
                  };
                  if (sheet[cellRef].v) {
                    secondaryGroupCells.push(sheet[cellRef]);
                  }
                }
              });
            }

            // 第二列非空遍历
            secondaryColumnCells.filter(cell => cell.v).forEach((cell, i) => {
              let next, current = sheet[cell.cellRef];
              if (secondaryColumnCells.filter(cell => cell.v)[i + 1]) {
                next = sheet[secondaryColumnCells.filter(cell => cell.v)[i + 1].cellRef];
              }

              if (next && next.v) {
                this.traverseSheet({
                  sheet,
                  range: {
                    s: {
                      c: current.cellAddress.c + 1,
                      r: current.cellAddress.r
                    },
                    e: {
                      c: range.e.c,
                      r: next.cellAddress.r - 1
                    }
                  },
                  fn: ({ sheet, cellRef }) => {
                    sheet[cellRef] = {
                      ...sheet[cellRef],
                      parent: sheet[cell.cellRef]
                    };
                    groupItemCells.push(sheet[cellRef]);
                  }
                });
              } else {
                this.traverseSheet({
                  sheet,
                  range: {
                    s: {
                      c: current.cellAddress.c + 1,
                      r: current.cellAddress.r
                    },
                    e: {
                      c: range.e.c,
                      r: current.parent && current.parent.next ? current.parent.next.cellAddress.r - 1 : range.e.r
                    }
                  },
                  fn: ({ sheet, cellRef }) => {
                    sheet[cellRef] = {
                      ...sheet[cellRef],
                      parent: sheet[cell.cellRef]
                    };
                    groupItemCells.push(sheet[cellRef]);
                  }
                });
              }
            });
          } else {
            if (next && next.v) {
              this.traverseSheet({
                sheet,
                range: {
                  s: {
                    c: current.cellAddress.c + 2,
                    r: current.cellAddress.r
                  },
                  e: {
                    c: range.e.c,
                    r: next.cellAddress.r - 1
                  }
                },
                fn: ({ sheet, cellRef }) => {
                  sheet[cellRef] = {
                    ...sheet[cellRef],
                    parent: sheet[cell.cellRef]
                  };
                  groupItemCells.push(sheet[cellRef]);
                }
              });
            } else {
              this.traverseSheet({
                sheet,
                range: {
                  s: {
                    c: current.cellAddress.c + 2,
                    r: current.cellAddress.r
                  },
                  e: range.e
                },
                fn: ({ sheet, cellRef }) => {
                  sheet[cellRef] = {
                    ...sheet[cellRef],
                    parent: sheet[cell.cellRef]
                  };
                  groupItemCells.push(sheet[cellRef]);
                }
              });
            }
          }
        } else {
          if (next && next.v) {
            this.traverseSheet({
              sheet,
              range: {
                s: {
                  c: current.cellAddress.c + 1,
                  r: current.cellAddress.r
                },
                e: {
                  c: range.e.c,
                  r: next.cellAddress.r - 1
                }
              },
              fn: ({ sheet, cellRef }) => {
                sheet[cellRef] = {
                  ...sheet[cellRef],
                  parent: sheet[cell.cellRef]
                };
                groupItemCells.push(sheet[cellRef]);
              }
            });
          } else {
            this.traverseSheet({
              sheet,
              range: {
                s: {
                  c: current.cellAddress.c + 1,
                  r: current.cellAddress.r
                },
                e: range.e
              },
              fn: ({ sheet, cellRef }) => {
                sheet[cellRef] = {
                  ...sheet[cellRef],
                  parent: sheet[cell.cellRef]
                };
                groupItemCells.push(sheet[cellRef]);
              }
            });
          }
        }
      });
       //console.log(primaryGroupCelss)
      // console.log(secondaryGroupCells)
      // console.log(groupItemCells)
      const groupType = this.getGroupType(type);
      let addGroupParams = primaryGroupCelss.filter(cell => cell.v).map(cell => {
        if(cell.weight==''){
          return {
            name: cell.v,
            mode: this.activeName === '0' ? 1 : 0,
            parentId: cell.parent && cell.parent.id ? cell.parent.id : -1,
            type: groupType,
            tag: this.ImportName
          };
        }else{
          return {
            name: cell.v,
            mode: this.activeName === '0' ? 1 : 0,
            parentId: cell.parent && cell.parent.id ? cell.parent.id : -1,
            type: groupType,
            tag: this.ImportName,
            weight: cell.weight
          };
        }
      });
      if (addGroupParams.some(p => p.weight)) {
        //console.log("p.weight:",p.weight);
        addGroupParams = addGroupParams.map(p => ({ ...p, weight: p.weight ? p.weight : 0 }))
      }
      //console.log("addGroupParams:",addGroupParams);
      const primaryResult = await this.addGroup({ groups: addGroupParams });
      if (!primaryResult.data && primaryResult.errMsg) {
        throw new Error(primaryResult.errMsg);
      }
      primaryGroupCelss.map((cell, i) => {
        sheet[cell.cellRef].id = primaryResult.data[i];
      });

      if (secondaryGroupCells.length) {
        addGroupParams = secondaryGroupCells.map(cell => {
          return {
            name: cell.v,
            mode: this.activeName === '0' ? 1 : 0,
            parentId: cell.parent && cell.parent.id ? cell.parent.id : -1,
            type: groupType,
            tag: this.ImportName
          };
        });

        const secondaryResult = await this.addGroup({ groups: addGroupParams });
        if (!secondaryResult.data && secondaryResult.errMsg) {
          throw new Error(secondaryResult.errMsg);
        }
        secondaryGroupCells.map((cell, i) => {
          sheet[cell.cellRef].id = secondaryResult.data[i];
        });
      }

      const requestGroups = {};
      var rowCellsObject = groupItemCells.reduce((current, next) => {
        const nextCell = sheet[next.cellRef];
        if (current[next.cellAddress.r]) {
          current[next.cellAddress.r].push(nextCell);
        } else {
          current[next.cellAddress.r] = [nextCell];
        }
        current[next.cellAddress.r].parent = nextCell.parent;
        return current;
      }, {});
      const subjectMapping = this.getTranslationMappingBasedOnKey('insSettingView.tHeaderB', 'subject');
      const itemScoreMapping = this.getTranslationMappingBasedOnKey('insSettingView.tHeaderE', 'itemScore');
      const descriptionMapping = this.getTranslationMappingBasedOnKey('insSettingView.tHeaderD', 'description');
      const availableScoreMapping = this.getTranslationMappingBasedOnKey('insSettingView.tHeaderG', 'availableScores');
      const qualifiedScoreMapping = this.getTranslationMappingBasedOnKey('insSettingView.tHeaderF', 'qualifiedScore');
      const requiredMapping = this.getTranslationMappingBasedOnKey('insSettingView.tHeaderH', 'required');
      const mapping = {};
      Object.assign(mapping, subjectMapping, itemScoreMapping, descriptionMapping, availableScoreMapping, qualifiedScoreMapping, requiredMapping);
      var names = {};
      Object.values(rowCellsObject).forEach(rowCells => {
        const item = {};
        rowCells.forEach(cell => {
          const key = cell.header && cell.header.tag;
          if (!mapping[key]) return;
          if (mapping[key] === 'availableScores') {
            item[mapping[key]] = cell.v ? cell.v.split('/').map(item => Number(item)) : cell.v === 0 ? [0] : [];
          } else if (mapping[key] === 'itemScore') {
            item[mapping[key]] = cell.v ? Number(cell.v) : 0;
            if (cell.v === '' || cell.v === undefined) {
              item['type'] = 1;
            }
            if (parseFloat(item[mapping[key]]) > parseInt(item[mapping[key]])) item[mapping[key]] = item[mapping[key]].toFixed(1);
          } else if (mapping[key] === 'description') {
            item[mapping[key]] = cell.v ? cell.v.toString().substring(0, 1200) : '';
          } else if (mapping[key] === 'required') {
            item[mapping[key]] = cell.v === 'Y' || cell.v === 'y'
          } else {
            item[mapping[key]] = cell.v || '';
          }
        });

        if (type === 'Score') {
          const availableScore = deepClone(item['availableScores']);
          if(availableScore.length>0){
            const maxAvailableScore = (availableScore.length==0)? 0:availableScore.sort((a, b) => { return a - b; })[availableScore.length - 1];
            item['itemScore'] = maxAvailableScore;
            item['qualifiedScore'] = item['qualifiedScore'].length === 0 ? maxAvailableScore : item['qualifiedScore'];
          }else{
            item['itemScore'] = 0;
            item['type'] = 1;
          }
        }
        if (item['subject']) {
          if (names[rowCells.parent.v] === undefined) {
            names[rowCells.parent.v] = rowCells.parent.id;
            if (requestGroups[rowCells.parent.id]) {
              requestGroups[rowCells.parent.id].items.push(item);
            } else {
              requestGroups[rowCells.parent.id] = {
                groupId: rowCells.parent.id,
                items: [item]
              };
            }
          } else {
            if (requestGroups[names[rowCells.parent.v]]) {
              requestGroups[names[rowCells.parent.v]].items.push(item);
            } else {
              requestGroups[names[rowCells.parent.v]] = {
                groupId: names[rowCells.parent.v],
                items: [item]
              };
            }
          }
        }
      });
      const addItemParams = {
        request: Object.values(requestGroups)
      };

      addItemParams.request.length > 0 && await this.addItem(addItemParams);
    },

    getTranslationMappingBasedOnKey(key, value) {
      const translationArr = this.getAllTranslationBasedOnKey(key);
      const mapping = {};
      translationArr.forEach(translation => {
        mapping[this.formatTableHeader(translation)] = value;
      });
      return mapping;
    },

    getGroupType(type) {
      const groupType = type === 'PassFail' ? 0 : type === 'Score' ? 1 : 2;
      return groupType;
    },

    handleItem() {
      this.showBtnContent = !this.showBtnContent;
    },

    bindStore() {
      const self = this;
      const routeData = self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData;
      self.showNoPostDialog = routeData[0].ModelPost === null;
      if (!self.showNoPostDialog) {
        self.confirmToBind();
      }
    },

    confirmToBind() {
      const self = this;
      if (self.elTableData[Number(self.activeName)].data.length === 0) {
        util.notify(self.$t('insSettingView.emptyInfo'), 'warning', 3000);
        return false;
      }
      const arr = [];
      self.tempdata.forEach(item => {
        item.itemData.forEach(_item => {
          arr.push(_item.id);
        });
      });
      if (arr.length === 0) {
        util.notify(self.$t('insSettingView.emptyInfo'), 'warning', 3000);
        return false;
      }
      sessionStorage.setItem('TabName', self.activeName);
      sessionStorage.setItem('NapeId', JSON.stringify(arr));
      const params = {
        inspectId: self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData[0].inspectId
      };
      sessionStorage.setItem('bindStoreData', JSON.stringify(params));
      self.$router.push({ name: 'bindStore', params: params });
    },

    updateTitleDialogFlag(val) {
      this.showNoPostDialog = val;
    },

    hideNoTitleDialog() {
      this.showNoPostDialog = false;
    },

    changeValue(obj) {
      const self = this;
      self.tabNameInput = '';
      if (obj !== '新增巡检表') {
        self.hideUpload = false;
      } else {
        if (self.tabNameInput.length === 0) {
          self.hideUpload = true;
        } else {
          self.hideUpload = false;
        }
      }
    },

    cancelImportName() {
      const self = this;
      self.isShowWarning = false;
      self.showNameImport = false;
    },
    async confirmImportName() {
      const self = this;
      if (self.ImportName !== '') {
        const TagData = await self.getTagAll();
        let namerepeat = 0;
        TagData.forEach(item => {
          if (item.name === self.ImportName) {
            namerepeat = 1;
          }
        });
        if (namerepeat === 1) {
          self.isShowWarning = true;
          self.warningContent = self.$t('remotePatrol.Patroltips2');
        } else if (validateInput(self.ImportName)) {
          self.isShowWarning = true;
          self.warningContent = self.$t('insSettingView.excelIllegalCategory');
        } else {
          self.isShowWarning = false;
          document.getElementById('loadFileEx').click();
          self.showNameImport = false;
        }
      } else {
        self.isShowWarning = true;
        self.warningContent = self.$t('insSettingView.enterListName');
      }
    },

    watchName(val) {
      const self = this;
      const content = filterString.all(val, 50);
      const length = filterString.getContentLength(val);
      self.ImportName = val.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '');
      self.ImportName = content;
      if (length > 50) {
        self.isShowWarning = true;
        self.warningContent = self.$t('insSettingView.enterNameRuletip');
      } else {
        self.isShowWarning = false;
      }
    },

    handleClick(tabObj) {
      const self = this;
      self.isLoading = true;
      sessionStorage.setItem('TabIndex', tabObj.index);
      switch (tabObj.index) {
        case '0':
          self.checkValue = '现场巡检'; break;
        case '1':
          self.checkValue = '远程巡检'; break;
        default:
          self.checkValue = '新增巡检表'; break;
      }
      if (tabObj.index === '0') {
        const idx0 = sessionStorage.getItem('TabPatrolIndex0');
        if (idx0 != null && idx0 !== '0') {
          if (Number(idx0) === self.elTableData[Number(self.activeName)].data.length) {
            self.patrolActive = (Number(idx0) - 1).toString();
          } else {
            self.patrolActive = idx0;
          }
        } else {
          self.patrolActive = '0';
        }
      } else if (tabObj.index === '1') {
        const idx1 = sessionStorage.getItem('TabPatrolIndex1');
        if (idx1 != null && idx1 !== '0') {
          if (Number(idx1) === self.elTableData[Number(self.activeName)].data.length) {
            self.patrolActive = (Number(idx1) - 1).toString();
          } else {
            self.patrolActive = idx1;
          }
        } else {
          self.patrolActive = '0';
        }
      }
      self.getTagList();
    },

    handleClickPatrol(val) {
      const self = this;
      if (self.activeName === '0') {
        sessionStorage.setItem('TabPatrolIndex0', val.index);
      } else if (self.activeName === '1') {
        sessionStorage.setItem('TabPatrolIndex1', val.index);
      }
      self.loading = true;
      self.btnList[1].enabled = true;
      self.btnList[3].enabled = true;
      self.getTagList();
    },

    updateImportSuccDialogFlag(val) {
      this.showImportSucceed = val;
    },

    hideImportSuccDialog() {
      this.showImportSucceed = false;
    },

    toSetRules() {
      const self = this;
      const activeInpect = self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)];
      const params = { inspectId: activeInpect.routeData[0].inspectId, routeName: activeInpect.name,
        mode: Number(self.activeName) === 0 ? 1 : 0 };
      sessionStorage.setItem('ruleData', JSON.stringify(params));
      self.$router.push({ name: 'setRule', params: params });
    },

    async delAllItem() {
      const self = this;
      const datalength = self.elTableData[Number(self.activeName)].data.length;
      if (datalength === 0) {
        util.notify(self.$t('insSettingView.deletePatrolList'), 'warning', 3000);
        return false;
      } else {
        const params = {};
        params.category = parseInt(self.activeName);
        const bindSchedule = await self.getScheduleFromDB(params);
        const arrtemp = [];
        bindSchedule.forEach(item => {
          if (item.extra != null) {
            arrtemp.push(item.extra.inspectId);
          }
        });
        if (arrtemp.indexOf(self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData[0].inspectId) !== -1) {
          util.notify(self.$t('insSettingView.deletebindSchedule'), 'warning', 3000);
          return false;
        }
      }
      self.showSingleDeleteContent = true;
    },

    confirmDelete() {
      const self = this;
      const arrGroup = [];
      const arrItem = [];
      self.tempdata.forEach(item => {
        arrGroup.push(item.id);
        item.itemData.forEach(_item => {
          arrItem.push(_item.id);
        });
      });
      const params = {
        'itemIds': arrItem
      };
      const paramsGroup = {
        'groupIds': arrGroup
      };
      if (arrItem.length !== 0) {
        inpectRESTful.deleteInspectItem(params).then(res => {
          const code = res.errMsg;
          if (code != undefined && code === 'Success') {
            if (arrGroup.length !== 0) {
              inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup => {
                if (resGroup.errMsg === 'Success') {
                  self.afterDeleteList();
                }
              });
            } else {
              self.afterDeleteList();
            }
          } else {
            util.notify(self.$t('insSettingView.deleteInspectFail'), 'warning', 3000);
            return false;
          }
        });
      } else {
        inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup => {
          if (resGroup.errMsg === 'Success') {
            self.afterDeleteList();
          } else {
            util.notify(self.$t('insSettingView.deleteInspectFail'), 'warning', 3000);
            return false;
          }
        });
      }
    },

    updateDeleteContentDialogFlag(val) {
      this.showSingleDeleteContent = val;
    },

    hideDeleteContentDialog() {
      this.showSingleDeleteContent = false;
    },

    updateShowInfoDialog(val) {
      this.showFailInfo = val;
    },

    hideShowInfoDialog() {
      this.showFailInfo = false;
    },

    afterDeleteList() {
      const self = this;
      util.notify(self.$t('insSettingView.deleteInspectSuss'), 'success', 3000);
      self.showSingleDeleteContent = false;
      self.getTagList('del');
    },

    importItem() {
      const self = this;
      const isGlobalWebsite = Environment.isGlobalWebsite;
      if (isGlobalWebsite) {
        const Datalength = self.elTableData[Number(self.activeName)].data.length;
        if (Number(self.activeName) === 1 && Datalength >= 40) {
          util.notify(self.$t('insSettingView.RemoteLength'), 'warning', 3000);
          return false;
        } else if (Number(self.activeName) === 0 && Datalength >= 40) {
          util.notify(self.$t('insSettingView.OnsiteLength'), 'warning', 3000);
          return false;
        } else {
          self.showNameImport = true;
          self.ImportName = '';
        }
      } else {
        self.showNameImport = true;
        self.ImportName = '';
      }
    },
    checkBeforeImport() {
      const self = this;
      if (self.checkValue === '新增巡检表' && (self.tabNameInput == null || self.tabNameInput.trim().length === 0)) {
        self.hideUpload = true;
        util.notify(self.$t('insSettingView.enterSelfListName'), 'warning', 3000);
        return false;
      } else {
        self.hideUpload = false;
      }
    },
    getBindStoreList() {
      const self = this;
      if (self.elTableData[Number(self.activeName)].data.length !== 0) {
        const inspectId = self.elTableData[Number(self.activeName)].data[Number(self.patrolActive)].routeData[0].inspectId;
        const params = { inspectIds: [inspectId] };
        inpectRESTful.getInspectBindList(params).then(res => {
          if (res.errCode === 0) {
            const data = res.data.length > 0 ? res.data[0].storeIds : [];
            self.storeNum = data.length;
            self.loading = false;
            self.btnList[1].enabled = false;
            self.btnList[3].enabled = false;
          }
          self.isLoading = false;
        });
      } else {
        self.storeNum = 0;
        self.isLoading = false;
      }
    },

    isLoginIn() {
      return new Promise((resolve, reject) => {
        isLoginIn().then(res => {
          resolve(res);
        });
      }).catch(err => {
        console.log(err);
      });
    },

    async exportItem() {
      const self = this;
      const ret = await self.isLoginIn();
      if (ret.data != undefined && ret.data.isLogin) {
        self.export2Excel();
      } else {
        const url = sessionStorage.getItem('LoginURL');
        window.location.href = url;
      }
    },

    async importfxx(obj) {
      const _this = this;
      _this.allScoreWeightEmpty= true;
      _this.allPassWeightEmpty= true;
      const inputDOM = this.$refs.inputer;
      const ITEMSLENGTH = 250;
      _this.FileInfo = [];
      this.file = event.currentTarget.files[0];
      var rABS = false;
      var f = this.file;
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = async function(f) {
        var binary = '';
        var rABS = false;
        var pt = this;
        var wb;
        var outdata = {};
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              type: 'base64'
            });
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            });
          }
          const PassFail = wb.Sheets['Pass&Fail'];
          const Score = wb.Sheets['Score'];
          const Others = wb.Sheets['Others'];

          let PassFailCopy = deepClone(PassFail);
          let ScoreCopy = deepClone(Score);
          let OthersCopy = deepClone(Others);
          const tableVersion = _this.getTableVersonBasedOnWeight(PassFail, Score, Others);

          outdata.PassFail = _this.getPassAndFailSheetJsonData(wb, PassFail, tableVersion);
          outdata.Score = _this.getScoreSheetJsonData(wb, Score, tableVersion);
          outdata.Others = _this.getOthersSheetJsonData(wb, Others, tableVersion);
          
          if (outdata.PassFail.length > 0) {
            if (!outdata.PassFail[0].catergyName) {
              PassFailCopy.A2 = {
                h: _this.$t('insSettingView.Ratingitems'),
                r: '',
                t: 's',
                v: _this.$t('insSettingView.Ratingitems'),
                w: _this.$t('insSettingView.Ratingitems')
              };
            }
          }

          if (outdata.Others.length > 0) {
            if (!outdata.Others[0].catergyName) {
              OthersCopy.A2 = {
                h: _this.$t('insSettingView.Addscoreitems'),
                r: '',
                t: 's',
                v: _this.$t('insSettingView.Addscoreitems'),
                w: _this.$t('insSettingView.Addscoreitems')
              };
            }
          }
          PassFailCopy = outdata.PassFail.length > 0 ? PassFailCopy : undefined;
          ScoreCopy = outdata.Score.length > 0 ? ScoreCopy : undefined;
          OthersCopy = outdata.Others.length > 0 ? OthersCopy : undefined;
          _this.importCount = 0;
          var passFailSheetFlagObj = _this.validatePassFailData(outdata.PassFail);
          var scoreSheetFlagObj = _this.validateScoreData(outdata.Score, tableVersion);
          var otherSheetFlagObj = _this.validateOtherData(outdata.Others);
          
          passFailSheetFlagObj.flags.flagGroupWeightTotal = false;
          scoreSheetFlagObj.flags.flagGroupWeightTotal = false;
          if (_this.importCount === 100) {
          } else {
            if (_this.allPassWeightEmpty && _this.allScoreWeightEmpty) {

            } else {
              passFailSheetFlagObj.flags.flagGroupWeightTotal = true;
              scoreSheetFlagObj.flags.flagGroupWeightTotal = true;
            }
          }
          
          const flagTempError = !!(outdata.PassFail == undefined && outdata.Score == undefined && outdata.Others == undefined);

          _this.FileInfo = _this.getWarningInfo(passFailSheetFlagObj.flags, scoreSheetFlagObj.flags,
            otherSheetFlagObj.flags, flagTempError);

          if (_this.FileInfo.length > 0) {
            _this.showFailInfo = true;
            _this.$refs.loadFile.value = '';
            _this.$refs.loadFileEx.value = '';
            return false;
          }

          const arrSheet1 = _this.getPassAndFailArrData(outdata.PassFail, passFailSheetFlagObj.indexArrPassFail);
          const arrSheet2 = _this.getScoreArrData(outdata.Score, scoreSheetFlagObj.indexArrScore);
          const arrSheet3 = _this.getOtherArrData(outdata.Others, otherSheetFlagObj.indexArrOthers);

          if (arrSheet1.length === 0 && arrSheet2.length === 0 && arrSheet3.length === 0) {
            _this.$refs.loadFile.value = '';
            _this.$refs.loadFileEx.value = '';
            util.notify(_this.$t('insSettingView.templateEmpty'), 'warning', 3000);
            return false;
          }
          _this.addAllDataCopy({
            PassFail: PassFailCopy,
            Score: ScoreCopy,
            Others: OthersCopy
          });

          _this.$refs.loadFile.value = '';
          _this.$refs.loadFileEx.value = '';
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },

    getAllTranslationBasedOnKey(key) {
      const languages = Object.keys(i18n.messages);
      const allTranslation = [];
      languages.forEach(lang => allTranslation.push(this.$t(key, lang)));
      return allTranslation;
    },

    getTableVersonBasedOnWeight(sheet1, sheet2, sheet3) {
      const subCategoryArr = this.getAllTranslationBasedOnKey('insSettingView.subCategory');
      const containSubColumn = (sheet1 && subCategoryArr.includes(this.formatTableHeader(sheet1.C1.w))) ||
          (sheet2 && subCategoryArr.includes(this.formatTableHeader(sheet2.C1.w))) ||
          (sheet3 && subCategoryArr.includes(this.formatTableHeader(sheet3.B1.w)));
      const tableVersion = containSubColumn ? 2 : 1;
      return tableVersion;
    },

    formatTableHeader(headName) {
      const name = headName.replace(/\(.*\)|\（.*\）/g, '');
      return name.trim();
    },

    getPassAndFailSheetJsonData(workbook, sheet, tableVersion) {
      if (sheet) {
        delete sheet.A1; delete sheet.B1; delete sheet.C1; delete sheet.D1; delete sheet.E1; delete sheet.G1;
        const sheetArray = XLSX.utils.sheet_to_json(sheet);
        const rowDataArray = [];
        sheetArray.forEach((_item) => {
          const rowDataObj = {};
          rowDataObj.catergyName = this.getTableCellData(_item.__EMPTY);
          rowDataObj.weight = _item.__EMPTY_1;
          rowDataObj.subCatergyName = this.getTableCellData(_item.__EMPTY_2);
          rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_3);
          rowDataObj.score = _item.__EMPTY_4;
          rowDataObj.description = this.getTableCellData(_item['巡檢項目詳細說明（選填，1200字元）']);
          rowDataObj.required = _item.__EMPTY_5;
          // if (tableVersion === 1) {
          //   rowDataObj.subCatergyName = '';
          //   rowDataObj.weight = _item.__EMPTY_1;
          //   rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_2);
          //   rowDataObj.score = _item.__EMPTY_3;
          //   rowDataObj.description = this.getTableCellData(_item['巡檢項目詳細說明（選填，1200字元）']);
          //   rowDataObj.required = _item.__EMPTY_4;
          // } else {
          //   rowDataObj.weight = _item.__EMPTY_1;
          //   rowDataObj.subCatergyName = this.getTableCellData(_item.__EMPTY_2);
          //   rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_3);
          //   rowDataObj.score = _item.__EMPTY_4;
          //   rowDataObj.description = this.getTableCellData(_item['巡檢項目詳細說明（選填，1200字元）']);
          //   rowDataObj.required = _item.__EMPTY_5;
          // }

          rowDataArray.push(rowDataObj);
        });
        return rowDataArray;
      }
      return [];
    },

    getOthersSheetJsonData(workbook, sheet, tableVersion) {
      if (sheet) {
        delete sheet.A1; delete sheet.B1; delete sheet.C1; delete sheet.D1; delete sheet.E1;
        const sheetArray = XLSX.utils.sheet_to_json(sheet);
        const rowDataArray = [];
        sheetArray.forEach((_item) => {
          const rowDataObj = {};
          rowDataObj.catergyName = this.getTableCellData(_item.__EMPTY);
          if (tableVersion === 1) {
            rowDataObj.subCatergyName = '';
            rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_1);
            rowDataObj.score = _item.__EMPTY_2;
            rowDataObj.required = _item.__EMPTY_3;
            rowDataObj.description = this.getTableCellData(_item['巡檢項目詳細說明（選填，1200字元）']);
          } else {
            rowDataObj.subCatergyName = this.getTableCellData(_item.__EMPTY_1);
            rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_2);
            rowDataObj.score = _item.__EMPTY_3;
            rowDataObj.required = _item.__EMPTY_4;
            rowDataObj.description = this.getTableCellData(_item['巡檢項目詳細說明（選填，1200字元）']);
          }

          rowDataArray.push(rowDataObj);
        });
        return rowDataArray;
      }
      return [];
    },

    getScoreSheetJsonData(workbook, sheet, tableVersion) {
      if (sheet) {
        delete sheet.A1; delete sheet.B1; delete sheet.C1; delete sheet.D1; delete sheet.E1; delete sheet.F1; delete sheet.G1;
        const sheetArray = XLSX.utils.sheet_to_json(sheet);
        const rowDataArray = [];
        sheetArray.forEach((_item) => {
          const rowDataObj = {};
          rowDataObj.catergyName = this.getTableCellData(_item.__EMPTY);
          rowDataObj.weight = _item.__EMPTY_1;
          rowDataObj.subCatergyName = this.getTableCellData(_item.__EMPTY_2);
          rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_3);
          rowDataObj.score = this.getTableCellData(_item.__EMPTY_4);
          rowDataObj.scoreThreshold = _item.__EMPTY_5;
          rowDataObj.totalScore = Infinity;
          rowDataObj.description = this.getTableCellData(_item.__EMPTY_7);
          rowDataObj.required = _item.__EMPTY_8;
          // if (tableVersion === 1) {
          //   rowDataObj.subCatergyName = '';
          //   rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_2);
          //   rowDataObj.totalScore = _item.__EMPTY_3;
          //   rowDataObj.scoreThreshold = _item.__EMPTY_4;
          //   rowDataObj.score = this.getTableCellData(_item.__EMPTY_5);
          //   rowDataObj.description = this.getTableCellData(_item.__EMPTY_6);
          //   rowDataObj.required = _item.__EMPTY_7;
          // } else {
          //   rowDataObj.subCatergyName = this.getTableCellData(_item.__EMPTY_2);
          //   rowDataObj.itemName = this.getTableCellData(_item.__EMPTY_3);
          //   rowDataObj.score = this.getTableCellData(_item.__EMPTY_4);
          //   rowDataObj.scoreThreshold = _item.__EMPTY_5;
          //   rowDataObj.totalScore = Infinity;
          //   rowDataObj.description = this.getTableCellData(_item.__EMPTY_7);
          //   rowDataObj.required = _item.__EMPTY_8;
          // }

          rowDataArray.push(rowDataObj);
        });
        return rowDataArray;
      } else {
        return [];
      }
    },

    getTableCellData(itemData) {
      const resultData = itemData !== undefined && typeof itemData !== 'number' ? itemData.trim() : itemData;
      return resultData;
    },

    validatePassFailData(passFailArr) {
      const ITEMSLENGTH = 250;
      const passFailFlagObj = {
        indexArrPassFail: [],
        flags: {
          flagGroupLengthPassFail: false,
          flagSubGroupLengthPassFail: false,
          flagItemNamePassFail: false,
          flagItemLengthPassFail: false,
          flagPassFailScoreType: false,
          flagDesLengthPassFail: false,
          flagGroupWeightTotal: false
        }
      };
      if (passFailArr.length === 0) {
        return passFailFlagObj;
      }
      let count = 0;
      let allWeightEmpty = true;
      var self = this;
      passFailArr.forEach((item, index) => {
        if (typeof item.weight === 'number') {
          self.importCount += item.weight;
        }
        if (typeof item.weight === 'number') self.allPassWeightEmpty = false;
        if (item.catergyName != undefined && item.catergyName.length > 0) {
          passFailFlagObj.indexArrPassFail.push(index);
          if (filterString.getContentLength(item.catergyName.toString().trim()) > 50) {
            passFailFlagObj.flags.flagGroupLengthPassFail = true;
          }
        }
        if (item.subCatergyName != undefined && item.subCatergyName.length > 0) {
          if (filterString.getContentLength(item.subCatergyName.toString().trim()) > 50) {
            console.log("@@"+item.subCatergyName+filterString.getContentLength(item.subCatergyName.toString().trim()));
            passFailFlagObj.flags.flagSubGroupLengthPassFail = true;
          }
        }
        if (item.itemName == undefined || item.itemName.length == 0) {
          passFailFlagObj.flags.flagItemNamePassFail = true;
        } else if (filterString.getContentLength(item.itemName.toString().trim()) > ITEMSLENGTH) {
          console.log(item.itemName.toString().trim()+filterString.getContentLength(item.itemName.toString().trim()))
          passFailFlagObj.flags.flagItemLengthPassFail = true;
        }
        if (item.score != undefined) {
          if (isNaN(item.score) || parseFloat(item.score) < 0.5 || parseFloat(item.score) > 50) {
            passFailFlagObj.flags.flagPassFailScoreType = true;
          }
        } else {
          item.score = 0;
        }
        if (item.description != undefined) {
          if (filterString.getContentLength(item.description.toString().trim()) > 1200) {
            passFailFlagObj.flags.flagDesLengthPassFail = true;
          }
        }
      });
      // if (count !== 100) passFailFlagObj.flags.flagGroupWeightTotal = true;
      return passFailFlagObj;
    },

    
    validateScoreData(scoreArr, tableVersion) {
      const ITEMSLENGTH = 250;
      const _this = this;
      const scoreFlagObj = {
        indexArrScore: [],
        indexSubCatergyScore: [],
        flags: {
          flagGroupLengthScore: false,
          flagSubGroupLengthScore: false,
          flagItemNameScore: false,
          flagItemLengthScore: false,
          flagFullScoreType: false,
          flagMinScoreType: false,
          flagDesLengthPassFail: false,
          flagScoreItemType: false,
          flagDesLengthScore: false,
          flagScoreItemEmpty: false,
          flagFullScoreLimitation: false
        }
      };
      if (scoreArr.length === 0) {
        return scoreFlagObj;
      }
      let count = 0;
      let allWeightEmpty = true;
      scoreArr.forEach((item, index) => {
        if (typeof item.weight === 'number') {
          _this.importCount += item.weight;
        }
        if (typeof item.weight === 'number') _this.allScoreWeightEmpty = false;
        if (item.catergyName != undefined && item.catergyName.length != 0) {
          scoreFlagObj.indexArrScore.push(index);
          if (filterString.getContentLength(item.catergyName.toString().trim()) > 50) {
            scoreFlagObj.flags.flagGroupLengthScore = true;
          }
        }
        if (item.subCatergyName != undefined && item.subCatergyName.length > 0) {
          scoreFlagObj.indexSubCatergyScore.push(index);
          if (filterString.getContentLength(item.subCatergyName.toString().trim()) > 50) {
            scoreFlagObj.flags.flagSubGroupLengthScore = true;
          }
        }
        if (item.itemName == undefined || item.itemName.length === 0) {
          scoreFlagObj.flags.flagItemNameScore = true;
        } else if (filterString.getContentLength(item.itemName.toString().trim()) > ITEMSLENGTH) {
          console.log(item.itemName.toString().trim()+filterString.getContentLength(item.itemName.toString().trim()))
          scoreFlagObj.flags.flagItemLengthScore = true;
        }
        let maxScore = 0;
        if (tableVersion === 1) {
          if (item.score != undefined) {
            if (typeof item.score !== 'number' && item.score.indexOf('/') !== -1) {
              const f_Score = item.score.split('/');
              const scoreArr = [];
              f_Score.forEach(f_item => {
                if (!isNaN(Number(f_item)) && parseFloat(f_item) >= -50 && parseFloat(f_item) <= 50) {
                  scoreArr.push(parseFloat(_this.getFloat(f_item)));
                }
              });
              scoreArr.length === 0 ? scoreFlagObj.flags.flagScoreItemType = true : item.score = scoreArr;
            } else {
              if (!isNaN(Number(item.score)) && parseFloat(item.score) >= -50 &&
                parseFloat(item.score) <= 50) {
                const a = [];
                a.push(parseFloat(_this.getFloat(item.score)));
                item.score = a;
              } else {
                scoreFlagObj.flags.flagScoreItemType = true;
              }
            }
            maxScore = item.score.sort((a, b) => { return a - b; })[item.score.length - 1];
          } else {
            scoreFlagObj.flags.flagScoreItemEmpty = true;
          }
          if (item.totalScore == undefined || item.totalScore.length == 0 || isNaN(item.totalScore) ||
            item.totalScore.toString() !== maxScore.toString()) {
            scoreFlagObj.flags.flagFullScoreLimitation = true;
          }
          if (item.scoreThreshold != undefined) {
            if (isNaN(item.scoreThreshold) || parseFloat(item.scoreThreshold) < -50 ||
                parseFloat(item.scoreThreshold) > maxScore) {
              scoreFlagObj.flags.flagMinScoreType = true;
            }
          } else {
            item.scoreThreshold = parseFloat(item.totalScore);
          }
        } else {
          if (item.score != undefined) {
            if (typeof item.score !== 'number' && item.score.indexOf('/') !== -1) {
              const f_Score = item.score.split('/');
              const scoreArr = [];
              f_Score.forEach(f_item => {
                if (!isNaN(Number(f_item)) && parseFloat(f_item) >= -50) {
                  scoreArr.push(parseFloat(_this.getFloat(f_item)));
                }
              });
              if (scoreArr.length === 0) {
                scoreFlagObj.flags.flagScoreItemType = true;
              } else {
                scoreArr.sort((a, b) => { return a - b; });
                item.score = scoreArr;
              }
            } else {
              if (!isNaN(Number(item.score)) && parseFloat(item.score) >= -50) {
                const a = [];
                a.push(parseFloat(_this.getFloat(item.score)));
                item.score = a;
              } else {
                scoreFlagObj.flags.flagScoreItemType = true;
              }
            }
          } else {
            scoreFlagObj.flags.flagScoreItemEmpty = true;
          }
          let maxScore = Infinity;
          if (!scoreFlagObj.flags.flagScoreItemType && !scoreFlagObj.flags.flagScoreItemEmpty) {
            maxScore = item.score[item.score.length - 1];
          }
          item.totalScore = maxScore;

          if (item.scoreThreshold !== undefined) {
            if (isNaN(item.scoreThreshold) || parseFloat(item.scoreThreshold) < -50 ||
              parseFloat(item.scoreThreshold) > parseFloat(item.totalScore)) {
              scoreFlagObj.flags.flagMinScoreType = true;
            }
          } else {
            item.scoreThreshold = parseFloat(item.totalScore);
          }
        }
        if (item.description != undefined) {
          if (filterString.getContentLength(item.description && item.description.toString().trim()) > 1200) {
            scoreFlagObj.flags.flagDesLengthScore = true;
          }
        }
      });
      return scoreFlagObj;
    },

    validateOtherData(othersArr) {
      const ITEMSLENGTH = 250;
      const otherFlagObj = {
        indexArrOthers: [],
        indexSubCatergyOthers: [],
        flags: {
          flagGroupLengthOthers: false,
          flagSubGroupLengthOthers: false,
          flagItemNameOthers: false,
          flagItemLengthOthers: false,
          flagOtherScoreType: false,
          flagDesLengthOthers: false
        }
      };
      if (othersArr.length === 0) {
        return otherFlagObj;
      }
      othersArr.forEach((item, index) => {
        if (item.catergyName != undefined && item.catergyName.length != 0) {
          otherFlagObj.indexArrOthers.push(index);
          if (filterString.getContentLength(item.catergyName.toString().trim()) > 50) {
            otherFlagObj.flags.flagGroupLengthOthers = true;
          }
        }
        if (item.subCatergyName != undefined && item.subCatergyName.length > 0) {
          otherFlagObj.indexSubCatergyOthers.push(index);
          if (filterString.getContentLength(item.subCatergyName.toString().trim()) > 50) {
            otherFlagObj.flags.flagSubGroupLengthOthers = true;
          }
        }
        if (item.itemName == undefined || item.itemName.length == 0) {
          otherFlagObj.flags.flagItemNameOthers = true;
          console.log(item)
        } else if (filterString.getContentLength(item.itemName.toString().trim()) > ITEMSLENGTH) {
          otherFlagObj.flags.flagItemLengthOthers = true;
        }
        if (item.score == undefined || item.score.length == 0 || isNaN(item.score) ||
            parseFloat(item.score) < -100 || parseFloat(item.score) > 100) {
          // 项目分值必填，字符类型为-100~+100
          otherFlagObj.flags.flagOtherScoreType = true;
        }
        if (item.description != undefined) {
          if (filterString.getContentLength(item.description.toString().trim()) > 1200) {
            otherFlagObj.flags.flagDesLengthOthers = true;
          }
        }
      });
      return otherFlagObj;
    },

    getWarningInfo(passFailFlag, scoreFlag, othersFlag, flagTempError) {
      const showWarningIfo = this.isObjContainValue(passFailFlag, true) ||
          this.isObjContainValue(scoreFlag, true) ||
          this.isObjContainValue(othersFlag, true) ||
          flagTempError;
      const warningInfo = [];
      if (showWarningIfo) {
        if (flagTempError) {
          warningInfo.push(this.$t('insSettingView.templateError'));
        }
        if (passFailFlag.flagGroupLengthPassFail || scoreFlag.flagGroupLengthScore || othersFlag.flagGroupLengthOthers) {
          const flagArr = [];
          if (passFailFlag.flagGroupLengthPassFail) {
            flagArr.push('[PassFail]');
          }
          if (scoreFlag.flagGroupLengthScore) {
            flagArr.push('[Score]');
          }
          if (othersFlag.flagGroupLengthOthers) {
            flagArr.push('[Others]');
          }
          const flag = flagArr.toString() + ' ' + this.$t('insSettingView.excelLongCategory');
          warningInfo.push(flag);
        }
        if (passFailFlag.flagSubGroupLengthPassFail || scoreFlag.flagSubGroupLengthScore || othersFlag.flagSubGroupLengthOthers) {
          const flagArr = [];
          if (passFailFlag.flagSubGroupLengthPassFail) {
            flagArr.push('[PassFail]');
          }
          if (scoreFlag.flagSubGroupLengthScore) {
            flagArr.push('[Score]');
          }
          if (othersFlag.flagSubGroupLengthOthers) {
            flagArr.push('[Others]');
          }
          const flag = flagArr.toString() + ' ' + this.$t('insSettingView.excelLongSubCategory');
          warningInfo.push(flag);
        }
        if (passFailFlag.flagItemNamePassFail || scoreFlag.flagItemNameScore || othersFlag.flagItemNameOthers) {
          const flagArr = [];
          if (scoreFlag.flagItemNameScore) {
            const flag = '[Score]' + ' ' + this.$t('insSettingView.excelEmpty');
            warningInfo.push(flag);
          }
          if (passFailFlag.flagItemNamePassFail || othersFlag.flagItemNameOthers) {
            if (passFailFlag.flagItemNamePassFail) {
              flagArr.push('[PassFail]');
            }
            if (othersFlag.flagItemNameOthers) {
              flagArr.push('[Others]');
            }
            const flag = flagArr.toString() + ' ' + this.$t('insSettingView.passfailexcelEmpty');
            warningInfo.push(flag);
          }
        }
        if (passFailFlag.flagItemLengthPassFail || scoreFlag.flagItemLengthScore || othersFlag.flagItemLengthOthers) {
          const flagArr = [];
          if (passFailFlag.flagItemLengthPassFail) { flagArr.push('PassFail'); }
          if (scoreFlag.flagItemLengthScore) { flagArr.push('Score'); }
          if (othersFlag.flagItemLengthOthers) { flagArr.push('Others'); }
          const flag = flagArr.toString() + ' ' + this.$t('insSettingView.excelLongItem');
          warningInfo.push(flag);
        }
        if (passFailFlag.flagDesLengthPassFail || scoreFlag.flagDesLengthScore || othersFlag.flagDesLengthOthers) {
          const flagArr = [];
          if (passFailFlag.flagDesLengthPassFail) { flagArr.push('PassFail'); }
          if (scoreFlag.flagDesLengthScore) { flagArr.push('Score'); }
          if (othersFlag.flagDesLengthOthers) { flagArr.push('Others'); }
          const flag = flagArr.toString() + ' ' + this.$t('insSettingView.excelIllegalDes');
          warningInfo.push(flag);
        }
        if (passFailFlag.flagGroupWeightTotal) {
          warningInfo.push('[PassFail]' + ' ' + this.$t('insSettingView.weightTotalError'));
        }
        if (scoreFlag.flagGroupWeightTotal) {
          warningInfo.push('[Score]' + ' ' + this.$t('insSettingView.weightTotalError'));
        }
        if (passFailFlag.flagPassFailScoreType) {
          warningInfo.push('[PassFail]' + ' ' + this.$t('insSettingView.excelPassFailScoreType'));
        }
        if (scoreFlag.flagFullScoreType) {
          warningInfo.push('[Score]' + ' ' + this.$t('insSettingView.excelFullScoreType'));
        }
        if (scoreFlag.flagMinScoreType) {
          warningInfo.push('[Score]' + ' ' + this.$t('insSettingView.excelMinScoreType'));
        }
        if (othersFlag.flagOtherScoreType) {
          warningInfo.push('[Others]' + ' ' + this.$t('insSettingView.excelOtherScoreType'));
        }
        /*if (scoreFlag.flagScoreItemType) {
          warningInfo.push('[Score]' + ' ' + this.$t('insSettingView.excelScoreItemType'));
        }
        if (scoreFlag.flagScoreItemEmpty) {
          warningInfo.push('[Score]' + ' ' + this.$t('insSettingView.excelScoreItemEmpty'));
        }*/
        if (scoreFlag.flagFullScoreLimitation) {
          warningInfo.push('[Score]' + ' ' + this.$t('insSettingView.totalScoreLimitation'));
        }
      }
      return warningInfo;
    },

    getPassAndFailArrData(sheetData, indexArray) {
      const passFailSheet = [];
      if (sheetData != undefined) {
        if (indexArray.length !== 0) {
          for (let i = 0; i < indexArray.length; i++) {
            passFailSheet[i] = {};
            passFailSheet[i].category = sheetData.slice(indexArray[i], indexArray[i + 1]);
          }
        } else {
          if (sheetData.length !== 0) {
            passFailSheet.push(sheetData);
            passFailSheet[0][0].catergyName = this.$t('insSettingView.Ratingitems');
          }
        }
      }
      return passFailSheet;
    },

    getScoreArrData(sheetData, indexArray) {
      const scoreSheetArr = [];
      if (sheetData != undefined) {
        if (indexArray.length !== 0) {
          for (let i = 0; i < indexArray.length; i++) {
            scoreSheetArr[i] = sheetData.slice(indexArray[i], indexArray[i + 1]);
          }
        }
      }
      return scoreSheetArr;
    },

    getOtherArrData(sheetData, indexArray) {
      const otherSheetArr = [];
      if (sheetData != undefined) {
        if (indexArray.length !== 0) {
          for (let i = 0; i < indexArray.length; i++) {
            otherSheetArr[i] = sheetData.slice(indexArray[i], indexArray[i + 1]);
          }
        } else {
          if (sheetData.length != 0) {
            otherSheetArr.push(sheetData);
            otherSheetArr[0][0].a = this.$t('insSettingView.Addscoreitems');
          }
        }
      }
      return otherSheetArr;
    },

    isObjContainValue(object, value) {
      return Object.values(object).includes(value);
    },

    getFloat(value) {
      let str = value.toString();
      const strIndex = str.indexOf('.');
      if (strIndex === -1) { return str; }
      str = str.substring(0, strIndex + 2);
      return str;
    },

    handleNape(index) {
      switch (index) {
        case 0: this.importItem(); break;
        case 1: this.exportItem(); break;
        case 2: this.downItem(); break;
        case 3: this.delAllItem(); break;
      }
    },

    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        let name = '';
        var wb = XLSX.utils.book_new();
        if (that.elTableData[Number(that.activeName)].data.length === 0) {
          util.notify(that.$t('insSettingView.haveNothingToExport'), 'warning', 3000);
          return false;
        } else {
          const curData = that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].allRoutedata;
          console.log("**curData:",curData);
          const passfail = curData.filter(x => x[0].type === 0)[0];
          const score = curData.filter(x => x[0].type === 1)[0];
          const other = curData.filter(x => x[0].type === 2)[0];
          name = that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].name;
          const sheet1Data = that.getExcelDataOfSheet(passfail, 0);
          const sheet1 = XLSX.utils.json_to_sheet(sheet1Data);
          XLSX.utils.book_append_sheet(wb, sheet1, 'Pass&Fail');

          const sheet2Data = that.getExcelDataOfSheet(score, 1);
          const sheet2 = XLSX.utils.json_to_sheet(sheet2Data);
          XLSX.utils.book_append_sheet(wb, sheet2, 'Score');

          const sheet3Data = that.getExcelDataOfSheet(other, 2);
          const sheet3 = XLSX.utils.json_to_sheet(sheet3Data);
          XLSX.utils.book_append_sheet(wb, sheet3, 'Others');
        }
        const label = this.getExcelInspectionType();
        const fileName = label + ' ' + name + '.xlsx';
        const workbookBlob = that.workbook2blob(wb);
        that.openDownloadDialog(workbookBlob, fileName);
      });
    },

    workbook2blob(workbook) {
      const self = this;
      var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([self.s2ab(wbout)], {
        type: 'application/octet-stream'
      });
      return blob;
    },

    s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    },

    openDownloadDialog(blob, fileName) {
      if (typeof blob === 'object' && blob instanceof Blob) {
        blob = URL.createObjectURL(blob);
      }
      var aLink = document.createElement('a');
      aLink.href = blob;
      aLink.download = fileName || '';
      var event;
      if (window.MouseEvent) event = new MouseEvent('click');
      else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      }
      aLink.dispatchEvent(event);
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    getExcelDataOfSheet(sheetDataArr, type) {
      const tableHeader = this.getExcelTableHeader(type);
      const sheetData = [];
      if (sheetDataArr) {
        const treeData = util.handleInspctionCatergyTree(sheetDataArr);
        treeData.forEach(item => {
          if (!item.children) {
            if (item.itemData.length !== 0) {
              item.itemData.forEach((_item, _index) => {
                const obj = {};
                if (_index === 0) {
                  obj[tableHeader[0]] = item.groupName;
                  if (type !== 2) {
                    obj[tableHeader[1]] = item.weight == -1 ? '' : item.weight;
                  }
                } else {
                  obj[tableHeader[0]] = '';
                  obj[tableHeader[1]] = '';
                }
                if (type === 0) {
                  obj[tableHeader[2]] = '';
                  obj[tableHeader[3]] = _item.name;
                  obj[tableHeader[4]] = _item.type === 0 ? _item.score : type === 0 ? '' : 0;
                  obj[tableHeader[5]] = _item.description === '---' ? '' : _item.description;
                } else if (type === 1) {
                  obj[tableHeader[2]] = '';
                  obj[tableHeader[3]] = _item.name;
                  obj[tableHeader[4]] = _item.type === 0 ? _item.availableScores : 0;
                  obj[tableHeader[5]] = _item.type === 0 ? _item.qualifiedScore : 0;
                  obj[tableHeader[6]] = _item.description === '---' ? '' : _item.description;
                } else {
                  obj[tableHeader[1]] = '';
                  obj[tableHeader[2]] = _item.name;
                  obj[tableHeader[3]] = _item.type === 0 ? _item.score : type === 0 ? '' : 0;
                  obj[tableHeader[4]] = _item.description === '---' ? '' : _item.description;
                }
                if (type === 0) {
                  obj[tableHeader[6]] = _item.required ? 'Y' : '';
                }
                if (type === 1) {
                  obj[tableHeader[7]] = _item.required ? 'Y' : '';
                }
                if (type === 2) {
                  obj[tableHeader[5]] = _item.required ? 'Y' : '';
                }
                sheetData.push(obj);
              });
            } else {
              const obj = {};
              obj[tableHeader[0]] = item.groupName;
              obj[tableHeader[1]] = '';
              obj[tableHeader[2]] = '';
              obj[tableHeader[3]] = '';
              obj[tableHeader[4]] = '';
              if (type === 1) {
                obj[tableHeader[5]] = '';
              }
              sheetData.push(obj);
            }
          } else {
            item.children.forEach((child, childIndex) => {
              if (child.itemData.length > 0) {
                child.itemData.forEach((childItem, childItemIndex) => {
                  const obj = {};
                  if (childIndex === 0 && childItemIndex === 0) {
                    obj[tableHeader[0]] = item.groupName;
                    if(type!=2){
                      obj[tableHeader[1]] = item.weight == -1 ? '' : item.weight;
                    }
                  } else {
                    obj[tableHeader[0]] = '';
                  }
                  if (childItemIndex === 0) {
                    if(type!=2){
                      obj[tableHeader[2]] = child.groupName;
                    }
                    else{
                      obj[tableHeader[1]] = child.groupName;
                    }
                  } else {
                    if(type!=2){
                      obj[tableHeader[1]] = "";
                      obj[tableHeader[2]] = "";
                    }
                    else{
                      obj[tableHeader[2]] = "";
                    }
                  }
                  if (type === 0) {
                    obj[tableHeader[3]] = childItem.name;
                    obj[tableHeader[4]] = childItem.type === 0 ? childItem.score : type === 0 ? '' : 0;
                    obj[tableHeader[5]] = childItem.description === '---' ? '' : childItem.description;
                    obj[tableHeader[6]] = childItem.required ? 'Y' : '';
                  } else if (type === 1) {
                    obj[tableHeader[3]] = childItem.name;
                    obj[tableHeader[4]] = childItem.type === 0 ? childItem.availableScores : 0;
                    obj[tableHeader[5]] = childItem.type === 0 ? childItem.qualifiedScore : 0;
                    obj[tableHeader[6]] = childItem.description === '---' ? '' : childItem.description;
                    obj[tableHeader[7]] = childItem.required ? 'Y' : '';
                  } else {
                    obj[tableHeader[2]] = childItem.name;
                    obj[tableHeader[3]] = childItem.type === 0 ? childItem.score : type === 0 ? '' : 0;
                    obj[tableHeader[4]] = childItem.description === '---' ? '' : childItem.description;
                    obj[tableHeader[5]] = childItem.required ? 'Y' : '';
                  }
                  sheetData.push(obj);
                });
              } else {
                const obj = {};
                if (childIndex === 0) {
                  if(type==2){
                    obj[tableHeader[0]] = item.groupName;
                    obj[tableHeader[1]] = child.groupName;
                  } 
                  else{
                    obj[tableHeader[0]] = item.groupName;
                    obj[tableHeader[1]] = item.weight == -1 ? '' : item.weight;
                  }
                } else {
                  if(type==2) {
                    obj[tableHeader[0]] = '';
                    obj[tableHeader[0]] = '';
                  }
                  else{
                    obj[tableHeader[0]] = '';
                    obj[tableHeader[1]] = '';
                  }
                }
                if(type!=2){
                  obj[tableHeader[2]] = child.groupName;
                  obj[tableHeader[3]] = '';
                  obj[tableHeader[4]] = '';
                  obj[tableHeader[5]] = '';
                  obj[tableHeader[6]] = '';
                }else{
                  obj[tableHeader[2]] = '';
                  obj[tableHeader[3]] = '';
                  obj[tableHeader[4]] = '';
                }
                if (type === 1) {
                  obj[tableHeader[7]] = '';
                }
                sheetData.push(obj);
              }
            });
          }
        });
      } else {
        const obj = {};
        tableHeader.map(item => obj[item] = undefined);
        sheetData.push(obj);
      }
      // console.log(sheetData)
      return sheetData;
    },

    getExcelTableHeader(type) {
      const sheet1TableHeader = [
        this.$t('insSettingView.tHeaderA'), 
        this.$t('insSettingView.tHeaderI'),
        this.$t('insSettingView.subCategoryHeader'),
        this.$t('insSettingView.tHeaderB'), 
        this.$t('insSettingView.tHeaderE'),
        this.$t('insSettingView.tHeaderD'),
        this.$t('insSettingView.tHeaderH')
      ];

      const sheet2TableHeader = [
        this.$t('insSettingView.tHeaderA2'), 
        this.$t('insSettingView.tHeaderI'),
        this.$t('insSettingView.subCategoryHeader'),
        this.$t('insSettingView.tHeaderB'), 
        this.$t('insSettingView.tHeaderG'),
        this.$t('insSettingView.tHeaderF'), 
        this.$t('insSettingView.tHeaderD'),
        this.$t('insSettingView.tHeaderH')
      ];

      const sheet3TableHeader = [
        this.$t('insSettingView.tHeaderA'), 
        this.$t('insSettingView.subCategoryHeader'),
        this.$t('insSettingView.tHeaderB'), 
        this.$t('insSettingView.sheetscore2'),
        this.$t('insSettingView.tHeaderD'),
        this.$t('insSettingView.tHeaderH')
      ];
      let tableHeader = [];
      return tableHeader = type === 0 ? sheet1TableHeader : type === 1 ? sheet2TableHeader : sheet3TableHeader;
    },

    getExcelInspectionType() {
      let label = '';
      switch (Number(this.activeName)) {
        case 0: {
          label = `[${this.$t('insSettingView.onsitePatrol')}]`;
          break;
        }
        case 1: {
          label = `[${this.$t('insSettingView.remotePatrol')}]`;
          break;
        }
        default: {
          label = `[${this.elTableData[Number(this.activeName)].label}]`;
        }
      }
      return label;
    }

  }
};
</script>
<style>
  @import '../../../assets/css/importfile.css';
  .item-tabs{
    min-width: 80px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    text-align: center;
  }
</style>
<style lang="scss" scoped>
  $mainColor:#f31d65;
  $border: #e3e9f4;
  $tab: #7d8cad;
  *{
    font-family: 'NotoSansCJKtc','Roboto','Arial', 'Microsoft YaHei';
    box-sizing: content-box;
  }
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
  .dialog-content{
    width: 100%;
    span{
      font-size: 14px;
    }
    .radio-btn{
      margin-left: 20px;
      &:last-child{
        border-left: 1px solid #dcdfe6;
      }
    }
    .ul_style{
      background-color:#f7f8fb;
      border:1px solid #dfe2e9;
      border-radius:2px;
      min-height:150px;
      padding:20px 0 0 20px;
      margin: 20px calc(20/1920*100vw);
      .li_style{
        color:#7d8cad;
        margin-bottom:10px;
        list-style:none;
        .list_style{
          width:10px;
          height:10px;
          border-radius:50%;
          background-color:#dfe2e9;
          display:inline-block;
          margin-right:10px;
        }
      }
    }
  }

    .el-route-container{
        padding: 20px calc(20/1920*100vw) 15px calc(20/1920*100vw);
        border: 1px solid $border;
        background-color: #fff;
        .el-route-header{
            margin-top: calc(15/1920*100vw);
            .el-route-tabs{
                width: 98%;
                margin-left: calc(15/1920*100vw);
                .bind-empty{
                    text-align: center;
                    img{
                        width:32px;
                        height:32px;
                        vertical-align: middle;
                    }
                    .empty-text{
                        font-size: calc(14/1920*100vw);
                        color:#7d8cad;
                        vertical-align: middle;
                    }
                }
                .data-empty{
                    margin: 0 auto;
                    margin-top: 14%;
                    position: relative;
                    .empty-title{
                        font-weight: bold;
                        span{
                            color: $mainColor;
                            cursor: pointer;
                        }
                        .downLoad-btn{
                            color:  $mainColor;
                            text-decoration: none;
                            cursor: pointer;
                        }
                    }
                }
                .temp-select-area{
                  display:flex; 
                  flex-direction:row;
                  height:30px;
                  min-width:220px;
                  max-width: 250px;
                  align-items:center;
                  background-color:#f4f6f7;
                  border-radius:5px;
                  font-size: 13px;
                  .temp-select-label{
                    color:#556679;
                    font-family: NotoSansCJKtc;
                    font-size: 13px;
                    min-width:75px;
                    max-width:105px;
                    margin-left:16px;
                    width:auto;
                    text-align: left;
                  }
                }
            }
            .el-route-btns{
              height: 36px;
                position: absolute;
                right: calc(40/1920*100vw);
                z-index: 10;
                width: auto;
                top: 25px;
                display: flex;
                align-items: center;
                .bind-title{
                    margin-right:calc(20/1920*100vw);
                    color:$tab;
                    font-size: 12px;
                }
                .en-bind-title{
                  margin-right:calc(20/1920*100vw);
                  color:$tab;
                  font-size: 12px;
                }
                .downLoad-btn{
                    margin-left: 0px !important;
                    border-color: $mainColor !important;
                    color: $mainColor !important;
                    border-radius: 0px;
                    padding: 2px 5px !important;
                    position: relative;
                    display: inline-block;
                    text-decoration: none;
                    font-size: 12px;
                    border: 1px solid;
                    border-left-width: 0px;
                    @include point(right,5);
                    cursor: pointer;
                    &:hover{
                        background-color: #FEE4E7;
                    }
                    &:focus{
                        background-color: #FEE4E7;
                    }
                    span{
                        position: relative;
                        bottom: 3px;
                    }
                }
                .el-handle-btn{
                    margin-left: 0px !important;
                    border-color: $mainColor !important;
                    color: $mainColor !important;
                    border-radius: 0px;
                    border-right: 0;
                    height: calc(36/1920*100vw);
                    padding: 0 0;
                    font-size: calc(14/1920*100vw);
                    min-width: 85px;
                    min-height: 28px;

          &:last-child{
            border-right: 1px solid $mainColor !important;
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
          @extend .el-handle-btn;
          width: calc(130/1920*100vw);
        }
      }
      
    }
  }

    .nameinput >>> .el-input__inner{
        border:0;
    }
    #en-patrltabs-content >>> .el-tabs__nav-scroll {
      height: 40px;
    }
    #en-patrltabs-content >>> .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: 160px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    #en-patrltabs-content >>> .el-tabs__active-bar{
      height: 4px;
    }
    .el-dropbtn{
        position: relative;
        bottom: 2px;
        border: 1px solid $mainColor;
    }
    .file-sliver{
        @include point(width,76);
        @include point(height,28);
        background-color: transparent;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .tabName-input-content{
        background: #fff;
        @include point(height,73);
        width: 100%;
    }
    .el-search-input{
      @include point(width,200);
      @include point(margin-right,20);
      position:absolute;
      right: 0px;
      top: 3px;
    }
    #patrltabs-content >>> .el-tabs__nav-next, #patrltabs-content >>> .el-tabs__nav-prev {
      line-height: 30px;
    }
  #patrltabs-content >>> .el-tabs__item {
    padding: 0 0;
    margin: 0 12px;
    font-size: 12px;
    font-family: Roboto,"Microsoft YaHei";
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 30px;
    line-height: 30px;
  }
  #patrltabs-content >>> el-tabs__nav-wrap.is-scrollable.is-top{
    height: 30px;
  }
  #patrltabs-content >>> .el-tabs__nav-wrap::after{
    position: static;
  }
  #patrltabs-content >>> .is-active {
    margin-bottom: 2px;
    background: #f31d65 ;
    color: #fff;
    border-radius: 3px;
  }

  #patrltabs-content >>> .el-tabs__active-bar{
    height: 0 !important;
  }

    .self-loading.loading_area >>> .el-loading-mask{
      background-color: transparent;
    }

</style>
