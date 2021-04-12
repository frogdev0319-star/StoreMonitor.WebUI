<template>
  <el-row class="el-route-container">
    <el-col :span="24" class="el-route-header">
      <div v-if="itemhoverName.length > 0" :style="{'left':120*itemIndex+4*itemIndex+'px'}" class="item_name">
        {{ itemhoverName }}<div class="triangle"/>
      </div>
      <el-col :span="7" class="el-route-btns">
        <span :class="lang === 'en'? 'en-bind-title': 'bind-title'">
          {{ $t('insSettingView.bindWith') }}{{ storeNum }} {{ $t('insSettingView.bindStore') }}
        </span>
        <delay-button
          :class="lang === 'en' ? 'en-bind-btn' : 'bind-btn' "
          :disabled="elTableData[Number(activeName)].data.length === 0"
          @click="bindStore"
        >
          <i class="iconfont icon-quxiaolianjie"/>
          <span>{{ $t('insSettingView.bindList') }}</span>
        </delay-button>
        <input
          id="loadFileEx"
          ref="loadFileEx"
          type="file"
          style="display: none"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="importfxx(this)" >
        <el-button
          v-for="(item,index) in btnList"
          :key="index"
          :disabled="item.enabled"
          :class="lang === 'en' ? 'en-el-handle-btn' : 'el-handle-btn' "
          size="mini"
          @click="handleNape(index,item)">
          <div class="btn-area">
            <i :class="item.iconClass" :style="item.style"/>
            <span>{{ item.btnTitle }}</span>
          </div>
        </el-button>
      </el-col>
      <el-col :span="18" class="el-route-tabs" :style="{'min-height':varyWindowWidth - 250 +'px'}">
        <div class="loading_area self-loading"
             :element-loading-text="$t('insSettingView.loadingbindstore')"
             v-loading="isLoading">
        </div>
        <el-tabs id="en-patrltabs-content" v-model="activeName" @tab-click="handleClick"
                 :style="{'min-height':varyWindowWidth - 250 +'px'}">
          <el-tab-pane v-for="(item,index) in elTableData" :key="index" :label="index < 2 ? getLang(index) : item.label"
                       :name="index.toString()" :closable ="index !== 0 && index !== 1 ? true : false">
            <el-tabs v-if="item.data.length !== 0 && !isLoading" id="patrltabs-content" v-model="patrolActive"
                     :style="{'min-height':varyWindowWidth*0.70+'px'}" @tab-click="handleClickPatrol" >
              <el-tab-pane v-for="(_item,_index) in item.data" :key="_index" :name="_index.toString()">
                <span slot="label" @mouseover="overItem(_item,_index)" @mouseout="outItem(_item,_index)">{{ _item.name }}</span>
                <div v-if="_item.routeData && !loading">
                  <route-detail :ref="curIndex" :route-data="_item.routeData" :route-name="_item.name"
                                :down-src="downLoadSrc" :all-routedata="_item.allRoutedata"
                                :sheet-name="_item.sheetName" :tab-name="_item.name" @refreshList="getTagList"
                                @change-routeData="changerouteData"/>
                </div>
                <div v-if="loading" :style="{'line-height':varyWindowWidth*0.52+'px'}" class="bind-empty">
                  <img :src="loadingGif">
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
              <input id="uploadFile" ref="loadFile" type="file" style="display: none"
                     accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                     application/vnd.ms-excel" @change="importfxx(this)" >
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>
    <dialog-pop
      :title="$t('insSettingView.import')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showNameImport"
      :confirm-text="$t('insSettingView.select')"
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
      class="dialog-content"
      @visibleChangeHandler="updateShowInfoDialog"
      @cancelHandler="hideShowInfoDialog"
      @confirmHandler="hideShowInfoDialog"
    >
      <div class="import-slot">
        <i class="el-icon-warning dialog-icon"/>
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
      :visible="showSingleDeleteContent"
      @visibleChangeHandler="updateDeleteContentDialogFlag"
      @cancelHandler="hideDeleteContentDialog"
      @confirmHandler="confirmDelete"
    >
      <div class="dialog-slot">
        <i class="el-icon-warning dialog-icon"/>
        <div class="dialog-content">{{ $t('insSettingView.confirmDelData') }}</div>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('remotePatrol.prompt')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showNoPostDialog"
      @visibleChangeHandler="updateTitleDialogFlag"
      @cancelHandler="hideNoTitleDialog"
      @confirmHandler="confirmToBind"
    >
      <div class="dialog-slot">
        <i class="el-icon-warning dialog-icon"/>
        <span>{{ $t('insSettingView.confirmToBindData') }}</span>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('remotePatrol.prompt')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showImportSucceed"
      @visibleChangeHandler="updateImportSuccDialogFlag"
      @cancelHandler="hideImportSuccDialog"
      @confirmHandler="toSetRules"
    >
      <div class="dialog-slot">
        <span>{{ $t('insSettingView.confirmToSetRule') }}</span>
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
import util from '@/common/util'
import DialogPop from '@/components/DialogPop';

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
      loadingGif: require('../../../../static/img/loading.gif'),
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
      itemhoverName: '',
      itemIndex: 0,
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
      btnList: [
        {
          id: 0,
          iconClass: 'iconfont icon-daoru',
          style: 'font-size:24px;',
          name: 'import',
          btnTitle: this.$t('insSettingView.import'),
          enabled: false
        },
        {
          id: 0,
          iconClass: 'iconfont icon-daochu',
          style: 'font-size:24px;',
          name: 'export',
          btnTitle: this.$t('insSettingView.export'),
          enabled: false
        },
        {
          id: 0,
          iconClass: 'iconfont icon-xiazai',
          style: 'font-size:24px;',
          name: 'download',
          btnTitle: this.$t('insSettingView.download'),
          enabled: false
        },
        {
          id: 0,
          iconClass: 'iconfont icon-shanchu',
          style: 'font-size:17px;',
          name: 'delete',
          btnTitle: this.$t('scheduleView.delete'),
          enabled: false
        }
      ],

      allData: [],
      tagList: ['远程巡检', '现场巡检'],
      curData: [],
      fileName: this.$t('insSettingView.patrolExample'),
      lang: this.$i18n.locale,
      taglangList: [this.$t('insSettingView.remotePatrol'), this.$t('insSettingView.onsitePatrol')],
      isLoading: true
    };
  },

  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },

  watch: {
    accountChanged(val, oldVal) {
      console.log(val);
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
    }else{
      const tabIndex = sessionStorage.getItem('TabIndex');
      if(tabIndex !== null){
        self.activeName = tabIndex;
        if(self.activeName === '0'){
          self.patrolActive = sessionStorage.getItem('TabPatrolIndex0');
        }else if(self.activeName === '1'){
          self.patrolActive = sessionStorage.getItem('TabPatrolIndex1');
        }
      }
    }
    self.getTagList();
    self.initData();
  },

  methods: {
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
          type: 'application/vnd.ms-excel'
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
          type: 'application/vnd.ms-excel'
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
          if (code != null && code === 'Success') {
            self.allData = data;
          }
          resolve(data);
        }).catch(err => {
          console.log(err.message);
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
        NapeData.forEach((_item, _index) => {
          const _obj = {};
          _obj.id = _item.id;
          _obj.groupName = _item.name;
          _obj.itemCount = _item.items.length;
          _obj.type = _item.type;
          _obj.checked = false;
          const tempChild = [];
          _item.items.forEach(itemChild => {
            const objChild = {};
            objChild.id = itemChild.id;
            objChild.checked = false;
            objChild.name = itemChild.subject;
            objChild.description = (itemChild.description == undefined || itemChild.length == 0) ? '--' : itemChild.description;
            objChild.score = itemChild.itemScore;
            objChild.qualifiedScore = itemChild.qualifiedScore;
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
          // self.notify(self.$t('insSettingView.importSuss'), 'success', 3000);
          self.showImportSucceed = true;
        }
      }
      else {
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
          console.log(res);
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
          console.log(res);
          resolve(res);
        });
      }).catch(err => {
        reject(err);
      });
    },

    addGroup(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.addInspectGroup(params).then(res => {
          console.log(res);
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addItem(params) {
      return new Promise((resolve, reject) => {
        inpectRESTful.addInspectItem(params).then(res => {
          console.log(res);
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async addAllData(dataArry) {
      const self = this;
      let mode = self.activeName == '0' ? mode = 1 : mode = 0; // remote mode 0,onsite  mode 1
      const arr = Object.entries(dataArry);
      const tempGroups = [];
      const tempItems = [];
      let type = null;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] == 'PassFail') {
          type = 0;
        } else if (arr[i][0] == 'Score') {
          type = 1;
        } else if (arr[i][0] == 'Others') {
          type = 2;
        }
        if (arr[i][1].length != 0) {
          arr[i][1].forEach((item, index) => {
            const obj = {};
            obj.name = item[0].a;
            obj.mode = mode;
            obj.tag = self.ImportName;
            obj.type = type;
            tempGroups.push(obj);
          });
        }
      }
      const paramsGroup = {
        'groups': tempGroups
      };
      const resGroup = await self.addGroup(paramsGroup);
      const codeGroup = resGroup.errMsg;
      const dataGroup = resGroup.data;
      let groupindex = 0;
      if (codeGroup != null && codeGroup == 'Success') {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][1].length != 0) {
            arr[i][1].forEach((item, index) => {
              const objItem = {};
              const temp = [];
              item.forEach((_item, _index) => {
                const _obj = {};
                let itemScore = 0, qualifiedScore = 0, description = '', availableScores = [];
                if (arr[i][0] == 'PassFail') {
                  itemScore = _item.c;
                  qualifiedScore = null;
                  description = _item.d;
                  availableScores = null;
                } else if (arr[i][0] == 'Score') {
                  itemScore = _item.c;
                  qualifiedScore = _item.d;
                  description = _item.f;
                  availableScores = _item.e;
                } else if (arr[i][0] == 'Others') {
                  itemScore = _item.c;
                  qualifiedScore = null;
                  description = _item.d;
                  availableScores = null;
                }
                _obj.subject = _item.b;
                _obj.description = description;
                _obj.itemScore = parseFloat(self.getFloat(itemScore));
                _obj.qualifiedScore = qualifiedScore===null ? null : parseFloat(self.getFloat(qualifiedScore));
                _obj.availableScores = availableScores;
                temp.push(_obj);
              });
              objItem.groupId = dataGroup[groupindex];
              objItem.items = temp;
              tempItems.push(objItem);
              groupindex = groupindex + 1;
            });
          }
        }
        const paramsItem = {
          'request': tempItems
        };
        const resItem = await self.addItem(paramsItem);
        const codeItem = resItem.errMsg;
        if (codeItem != null && codeItem == 'Success') {
          self.getTagList('add');
        } else {
          util.notify(self.$t('insSettingView.importFail'), 'warning', 3000);
        }
      } else {
        util.notify(self.$t('insSettingView.importFail'), 'warning', 3000);
      }
      // self.showImportContent=false;
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

    hideNoTitleDialog(){
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
      const content = filterString.all(val, 30);
      const length = filterString.getContentLength(val);
      self.ImportName = val.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '');
      self.ImportName = content;
      if (length > 30) {
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

    overItem(item, index) {
      const self = this;
      self.itemhoverName = item.name;
      self.itemIndex = index;
    },

    outItem(item, index) {
      const self = this;
      self.itemhoverName = '';
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
      const ret = self.isLoginIn();
      const isGlobalWebsite = Environment.isGlobalWebsite;
      if (isGlobalWebsite) {
        const Datalength = self.elTableData[Number(self.activeName)].data.length;
        if (Number(self.activeName) === 1 && Datalength >= 10) {
          util.notify(self.$t('insSettingView.RemoteLength'), 'warning', 3000);
          return false;
        } else if (Number(self.activeName) === 0 && Datalength >= 10) {
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
        const params = { inspectId: inspectId };
        inpectRESTful.getInspectBindList(params).then(res => {
          if (res.errMsg != undefined && res.errMsg === 'Success') {
            const data = res.data;
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
      const self = this;
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
        window.location.href = 'https://portals.storeviu.com';
      }
    },

    async importfxx(obj) {
      const _this = this;
      const inputDOM = this.$refs.inputer;
      _this.FileInfo = [];
      this.file = event.currentTarget.files[0];
      var rABS = false;
      var f = this.file;
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function(f) {
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
          var sheet1, sheet2, sheet3;
          const PassFail = wb.Sheets['Pass&Fail'];
          const Score = wb.Sheets['Score'];
          const Others = wb.Sheets['Others'];
          let temp_sheet1 = [], temp_sheet2 = [], temp_sheet3 = [];
          if (PassFail != undefined) {
            delete PassFail.A1; delete PassFail.B1; delete PassFail.C1; delete PassFail.D1;
            sheet1 = XLSX.utils.sheet_to_json(wb.Sheets['Pass&Fail']);
            sheet1.forEach((_item, _index) => {
              const obj = {};
              obj.a = _item.__EMPTY!==undefined && typeof _item.__EMPTY !== 'number' ? _item.__EMPTY.trim() : _item.__EMPTY;
              obj.b = _item.__EMPTY_1!==undefined && typeof _item.__EMPTY_1 !== 'number' ? _item.__EMPTY_1.trim() : _item.__EMPTY_1;
              obj.c = _item.__EMPTY_2;
              obj.d = _item.__EMPTY_3!==undefined && typeof _item.__EMPTY_3 !== 'number' ? _item.__EMPTY_3.trim() : _item.__EMPTY_3;
              temp_sheet1.push(obj);
            });
            outdata.PassFail = temp_sheet1;
          }
          if (Score != undefined) {
            delete Score.A1; delete Score.B1; delete Score.C1; delete Score.D1; delete Score.E1; delete Score.F1;
            sheet2 = XLSX.utils.sheet_to_json(wb.Sheets['Score']);
            sheet2.forEach((_item, _index) => {
              const obj = {};
              obj.a = _item.__EMPTY!==undefined && typeof _item.__EMPTY !== 'number' ? _item.__EMPTY.trim() : _item.__EMPTY;
              obj.b = _item.__EMPTY_1!==undefined && typeof _item.__EMPTY_1 !== 'number' ? _item.__EMPTY_1.trim() : _item.__EMPTY_1;
              obj.c = _item.__EMPTY_2;
              obj.d = _item.__EMPTY_3;
              obj.e = _item.__EMPTY_4!==undefined && typeof _item.__EMPTY_4!=='number' ? _item.__EMPTY_4.trim() : _item.__EMPTY_4;
              obj.f = _item.__EMPTY_5!==undefined && typeof _item.__EMPTY_5 !== 'number' ? _item.__EMPTY_5.trim() : _item.__EMPTY_5;
              temp_sheet2.push(obj);
            });
            outdata.Score = temp_sheet2;
          }
          if (Others != undefined) {
            delete Others.A1; delete Others.B1; delete Others.C1; delete Others.D1;
            sheet3 = XLSX.utils.sheet_to_json(wb.Sheets['Others']);
            sheet3.forEach((_item, _index) => {
              const obj = {};
              obj.a = _item.__EMPTY!==undefined && typeof _item.__EMPTY !== 'number' ? _item.__EMPTY.trim() : _item.__EMPTY;
              obj.b = _item.__EMPTY_1!==undefined && typeof _item.__EMPTY_1 !== 'number' ? _item.__EMPTY_1.trim() : _item.__EMPTY_1;
              obj.c = _item.__EMPTY_2;
              obj.d = _item.__EMPTY_3!==undefined && typeof _item.__EMPTY_3 !== 'number' ? _item.__EMPTY_3.trim() : _item.__EMPTY_3;
              temp_sheet3.push(obj);
            });
            outdata.Others = temp_sheet3;
          }
          let indexArryPassFail = [], indexArryScore = [], indexArryOthers = [];
          let flaggroupLengthPassFail = false, flaggroupLengthScore = false, flaggroupLengthOthers = false;
          let flagItemNamePassFail = false, flagItemNameScore = false, flagItemNameOthers = false;
          let flagItemLengthPassFail = false, flagItemLengthScore = false, flagItemLengthOthers = false;
          let flagDesLengthPassFail = false, flagDesLengthScore = false, flagDesLengthOthers = false;
          let flagFullScoreType = false, flagMinScoreType = false, flagOtherScoreType = false, flagPassFailScoreType = false,flagScoreItemType = false;
          let flagTempError = false,flagScoreItemEmpty = false;
          // The sheet has been parsed : outdata
          outdata.PassFail == undefined && outdata.Score == undefined && outdata.Others == undefined ? flagTempError = true : flagTempError = false;
          const arr = Object.entries(outdata);
          for (let i = 0; i < arr.length; i++) {
            arr[i][1].forEach((item, index) => {
              if (arr[i][0] == 'PassFail') {
                if (item.a != undefined && item.a.length != 0) {
                  indexArryPassFail.push(index);
                  if (filterString.getContentLength(item.a.toString().trim()) > 30) { flaggroupLengthPassFail = true; }
                }
                if (item.b == undefined || item.b.length == 0) { flagItemNamePassFail = true; } else if (filterString.getContentLength(item.b.toString().trim()) > 100) { flagItemLengthPassFail = true; }
                if (item.c != undefined) {
                  if(isNaN(item.c) || parseFloat(item.c) < 0.5 || parseFloat(item.c) > 50){flagPassFailScoreType = true;};
                } else {
                  item.c = 10;
                }
                if (item.d != undefined) {
                  if (filterString.getContentLength(item.d.toString().trim()) > 1200) { flagDesLengthPassFail = true; }
                }
              } else if (arr[i][0] == 'Score') {
                if (item.a != undefined && item.a.length != 0) {
                  indexArryScore.push(index);
                  if (filterString.getContentLength(item.a.toString().trim()) > 30) { flaggroupLengthScore = true; }
                }
                if (item.b == undefined || item.b.length == 0) { flagItemNameScore = true; } else if (filterString.getContentLength(item.b.toString().trim()) > 100) { flagItemLengthScore = true; }
                if (item.c == undefined || item.c.length == 0 || isNaN(item.c) || parseFloat(item.c) < 0 || parseFloat(item.c) > 50) {
                  flagFullScoreType = true;
                }
                if (item.d != undefined) {
                  if (isNaN(item.d) || parseFloat(item.d) < -50 || parseFloat(item.d) > parseFloat(item.c)) {
                    flagMinScoreType = true;
                  }
                } else {
                  item.d = parseFloat(item.c);
                }
                if (item.e != undefined) {
                  if (typeof item.e!=='number'&&item.e.indexOf('/') !== -1) {
                    const f_Score = item.e.split('/');
                    const scoreArr = [];
                    f_Score.forEach(f_item => {
                      if (!isNaN(Number(f_item)) && parseFloat(f_item) >= -50 && parseFloat(f_item) <= parseFloat(item.c)) {
                          scoreArr.push(parseFloat(_this.getFloat(f_item)));
                      }
                    });
                    scoreArr.length===0 ? flagScoreItemType = true : item.e = scoreArr;
                  } else {
                    if (!isNaN(Number(item.e)) && parseFloat(item.e) >= -50 && parseFloat(item.e) <= parseFloat(item.c)) {
                      let a = [];
                      a.push(parseFloat(_this.getFloat(item.e)));
                      item.e = a;
                    } else {
                      flagScoreItemType = true
                    }
                  }
                } else {
                  flagScoreItemEmpty = true
                }
                if (item.f != undefined) {
                  if (filterString.getContentLength(item.f.toString().trim()) > 1200) { flagDesLengthScore = true; }
                }
              } else if (arr[i][0] == 'Others') {
                if (item.a != undefined && item.a.length != 0) {
                  indexArryOthers.push(index);
                  if (filterString.getContentLength(item.a.toString().trim()) > 30) { flaggroupLengthOthers = true; }
                }
                if (item.b == undefined || item.b.length == 0) { flagItemNameOthers = true; } else if (filterString.getContentLength(item.b.toString().trim()) > 100) { flagItemLengthOthers = true; }
                if (item.c == undefined || item.c.length == 0 || isNaN(item.c) || parseFloat(item.c) < -100 || parseFloat(item.c) > 100) { // 项目分值必填，字符类型为-100~+100
                  flagOtherScoreType = true;
                }
                if (item.d != undefined) {
                  if (filterString.getContentLength(item.d.toString().trim()) > 1200) { flagDesLengthOthers = true; }
                }
              }
            });
          }
          const showWarningIfo = flaggroupLengthPassFail || flagItemNamePassFail || flagItemLengthPassFail || flagDesLengthPassFail ||
                                         flaggroupLengthScore || flagItemNameScore || flagItemLengthScore || flagDesLengthScore ||
                                         flaggroupLengthOthers || flagItemNameOthers || flagItemLengthOthers || flagDesLengthOthers ||
                                         flagFullScoreType || flagMinScoreType || flagOtherScoreType || flagPassFailScoreType || flagTempError || flagScoreItemType || flagScoreItemEmpty;
          if (showWarningIfo) {
            _this.showFailInfo = true;
            _this.$refs.loadFile.value = '';
            _this.$refs.loadFileEx.value = '';
            if (flagTempError) {
              _this.FileInfo.push(_this.$t('insSettingView.templateError'));
            }
            if (flaggroupLengthPassFail || flaggroupLengthScore || flaggroupLengthOthers) {
              const flagArr = [];
              if (flaggroupLengthPassFail) { flagArr.push('PassFail'); }
              if (flaggroupLengthScore) { flagArr.push('Score'); }
              if (flaggroupLengthOthers) { flagArr.push('Others'); }
              const flag = flagArr.toString() + ' ' + _this.$t('insSettingView.excelLongCategory');
              _this.FileInfo.push(flag);
            }
            if (flagItemNamePassFail || flagItemNameScore || flagItemNameOthers) {
              const flagArr = [];
              if (flagItemNameScore) {
                const flag = 'Score' + ' ' + _this.$t('insSettingView.excelEmpty');
                _this.FileInfo.push(flag);
              }
              if (flagItemNamePassFail || flagItemNameOthers) {
                if (flagItemNamePassFail) { flagArr.push('PassFail'); }
                if (flagItemNameOthers) { flagArr.push('Others'); }
                const flag = flagArr.toString() + ' ' + _this.$t('insSettingView.passfailexcelEmpty');
                _this.FileInfo.push(flag);
              }
            }
            if (flagItemLengthPassFail || flagItemLengthScore || flagItemLengthOthers) {
              const flagArr = [];
              if (flagItemLengthPassFail) { flagArr.push('PassFail'); }
              if (flagItemLengthScore) { flagArr.push('Score'); }
              if (flagItemLengthOthers) { flagArr.push('Others'); }
              const flag = flagArr.toString() + ' ' + _this.$t('insSettingView.excelLongItem');
              _this.FileInfo.push(flag);
            }
            if (flagDesLengthPassFail || flagDesLengthScore || flagDesLengthOthers) {
              const flagArr = [];
              if (flagDesLengthPassFail) { flagArr.push('PassFail'); }
              if (flagDesLengthScore) { flagArr.push('Score'); }
              if (flagDesLengthOthers) { flagArr.push('Others'); }
              const flag = flagArr.toString() + ' ' + _this.$t('insSettingView.excelIllegalDes');
              _this.FileInfo.push(flag);
            }
            if (flagPassFailScoreType) {
              _this.FileInfo.push('PassFail' + ' ' + _this.$t('insSettingView.excelPassFailScoreType'));
            }
            if (flagFullScoreType) {
              _this.FileInfo.push('Score' + ' ' + _this.$t('insSettingView.excelFullScoreType'));
            }
            if (flagMinScoreType) {
              _this.FileInfo.push('Score' + ' ' + _this.$t('insSettingView.excelMinScoreType'));
            }
            if (flagOtherScoreType) {
              _this.FileInfo.push('Others' + ' ' + _this.$t('insSettingView.excelOtherScoreType'));
            }
            if(flagScoreItemType){
              _this.FileInfo.push('Score' + ' ' + _this.$t('insSettingView.excelScoreItemType'));
            }
            if(flagScoreItemEmpty){
              _this.FileInfo.push('Score' + ' ' + _this.$t('insSettingView.excelScoreItemEmpty'));
            }
            return false;
          }
          const arrsheet1 = [];
          if (outdata.PassFail != undefined) {
            if (indexArryPassFail.length != 0) {
              for (var i = 0; i < indexArryPassFail.length; i++) {
                arrsheet1[i] = outdata.PassFail.slice(indexArryPassFail[i], indexArryPassFail[i + 1]);
              }
            } else {
              if (outdata.PassFail.length != 0) {
                arrsheet1.push(outdata.PassFail);
                arrsheet1[0][0].a = _this.$t('insSettingView.Ratingitems');
              }
            }
          }
          const arrsheet2 = [];
          if (outdata.Score != undefined) {
            if (indexArryScore.length != 0) {
              for (var i = 0; i < indexArryScore.length; i++) {
                arrsheet2[i] = outdata.Score.slice(indexArryScore[i], indexArryScore[i + 1]);
              }
            }
          }
          const arrsheet3 = [];
          if (outdata.Others != undefined) {
            if (indexArryOthers.length != 0) {
              for (var i = 0; i < indexArryOthers.length; i++) {
                arrsheet3[i] = outdata.Others.slice(indexArryOthers[i], indexArryOthers[i + 1]);
              }
            } else {
              if (outdata.Others.length != 0) {
                arrsheet3.push(outdata.Others);
                arrsheet3[0][0].a = _this.$t('insSettingView.Addscoreitems');
              }
            }
          }
          if(arrsheet2.length===0&&arrsheet1.length===0&&arrsheet3.length===0){
            _this.$refs.loadFile.value = '';
            _this.$refs.loadFileEx.value = '';
            _this.notify(_this.$t('insSettingView.templateEmpty'), 'warning', 3000);
            return false;
          }
          const dataArry = {
            PassFail: arrsheet1,
            Score: arrsheet2,
            Others: arrsheet3
          };
          _this.addAllData(dataArry);
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

    getFloat (value) {
      let str = value.toString();
      let strIndex = str.indexOf('.');
      if (strIndex === -1){return str};
      str = str.substring(0, strIndex + 2);
      return str;
    },

    addTab(targetName) {
      const newTabName = ++this.tabIndex + '';
      this.editableTabs2.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      });
      this.editableTabsValue2 = newTabName;
    },

    handleNape(index, item) {
      console.log(item);
      const self = this;
      switch (index) {
        case 0: self.importItem(); break;
        case 1: self.exportItem(); break;
        case 2: self.downItem(); break;
        case 3: self.delAllItem(); break;
      }
    },

    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/excel/Export2Excel');
        const tHeader = [that.$t('insSettingView.tHeaderA'), that.$t('insSettingView.tHeaderB'),
          that.$t('insSettingView.tHeaderC'), that.$t('insSettingView.tHeaderD'),
          that.$t('insSettingView.tHeaderF'), that.$t('insSettingView.tHeaderA2'), that.$t('insSettingView.tHeaderE'), that.$t('insSettingView.tHeaderG'), that.$t('insSettingView.sheetscore2')];
        const excelData = [];
        let name = '';
        var wb = XLSX.utils.book_new();
        if (that.elTableData[Number(that.activeName)].data.length === 0) {
          that.notify(that.$t('insSettingView.haveNothingToExport'), 'warning', 3000);
          return false;
        } else {
          let sheet1data = [], sheet2data = [], sheet3data = [];
          const curData = that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].allRoutedata;
          const passfail = curData.filter(x => x[0].type === 0)[0];
          const score = curData.filter(x => x[0].type === 1)[0];
          const other = curData.filter(x => x[0].type === 2)[0];
          name = that.elTableData[Number(that.activeName)].data[Number(that.patrolActive)].name;
          if (passfail != undefined) {
            passfail.forEach(item => {
              if (item.itemData.length !== 0) {
                item.itemData.forEach((_item, _index) => {
                  const obj = {};
                  if (_index === 0) {
                    obj[tHeader[0]] = item.groupName;
                  } else {
                    obj[tHeader[0]] = '';
                  }
                  obj[tHeader[1]] = _item.name;
                  obj[tHeader[6]] = _item.score;
                  obj[tHeader[3]] = _item.description === '---' ? '' : _item.description;
                  sheet1data.push(obj);
                });
              } else {
                const obj = {};
                obj[tHeader[0]] = item.groupName;
                obj[tHeader[1]] = '';
                obj[tHeader[6]] = '';
                obj[tHeader[3]] = '';
                sheet1data.push(obj);
              }
            });
            const sheet1 = XLSX.utils.json_to_sheet(sheet1data);
            XLSX.utils.book_append_sheet(wb, sheet1, 'Pass&Fail');
          }
          if (score != undefined) {
            score.forEach(item => {
              if (item.itemData.length !== 0) {
                item.itemData.forEach((_item, _index) => {
                  const obj = {};
                  if (_index === 0) {
                    obj[tHeader[5]] = item.groupName;
                  } else {
                    obj[tHeader[5]] = '';
                  }
                  obj[tHeader[1]] = _item.name;
                  obj[tHeader[2]] = _item.score;
                  obj[tHeader[4]] = _item.qualifiedScore;
                  obj[tHeader[7]] = _item.availableScores;
                  obj[tHeader[3]] = _item.description === '---' ? '' : _item.description;
                  sheet2data.push(obj);
                });
              } else {
                const obj = {};
                obj[tHeader[5]] = item.groupName;
                obj[tHeader[1]] = '';
                obj[tHeader[2]] = '';
                obj[tHeader[4]] = '';
                obj[tHeader[7]] = '';
                obj[tHeader[3]] = '';
                sheet2data.push(obj);
              }
            });
            var sheet2 = XLSX.utils.json_to_sheet(sheet2data);
            XLSX.utils.book_append_sheet(wb, sheet2, 'Score');
          }
          if (other != undefined) {
            other.forEach(item => {
              if (item.itemData.length !== 0) {
                item.itemData.forEach((_item, _index) => {
                  const obj = {};
                  if (_index === 0) {
                    obj[tHeader[0]] = item.groupName;
                  } else {
                    obj[tHeader[0]] = '';
                  }
                  obj[tHeader[1]] = _item.name;
                  obj[tHeader[8]] = _item.score;
                  obj[tHeader[3]] = _item.description === '---' ? '' : _item.description;
                  sheet3data.push(obj);
                });
              } else {
                const obj = {};
                obj[tHeader[0]] = item.groupName;
                obj[tHeader[1]] = '';
                obj[tHeader[8]] = '';
                obj[tHeader[3]] = '';
                sheet3data.push(obj);
              }
            });
            var sheet3 = XLSX.utils.json_to_sheet(sheet3data);
            XLSX.utils.book_append_sheet(wb, sheet3, 'Others');
          }
        }
        let label = '';
        switch (Number(that.activeName)) {
          case 0: {
            label = `[${that.$t('insSettingView.onsitePatrol')}]`;
            break;
          }
          case 1: {
            label = `[${that.$t('insSettingView.remotePatrol')}]`;
            break;
          }
          default: {
            label = `[${that.elTableData[Number(that.activeName)].label}]`;
          }
        }
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

    notify(msg, type, time) {
      this.$message({
        message: msg,
        type: type,
        duration: time
      });
    }

  }
};
</script>
<style>
@import '../../../assets/css/importfile.css';
</style>
<style lang="scss" scoped>
    $mainColor:#f31d65;
    $border: #e3e9f4;
    $tab: #7d8cad;
    *{
       font-family: Roboto,Arial, Microsoft YaHei;
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
            .item_name{
                    position: absolute;
                    top:55px;
                    margin-left:47px;
                    z-index: 100;
                    height:18px;
                    line-height: 18px;
                    border-radius: 3px;
                    background-color: rgb(0, 0, 0);
                    color:#fff;
                    padding:5px 2px;
                    min-width: 100px;
                    text-align: center;
                    font-size: calc(12/1920*100vw);
                    .triangle{
                        width:10px;
                        height:10px;
                        margin:0 auto;
                        transform:rotate(45deg);
                        background-color: rgb(0, 0, 0);
                    }
                }
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
            }
            .el-route-btns{
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
    .loading_area >>> .el-loading-spinner{
      height: calc(100vh - 180px);
    }
    .loading_area >>> .el-loading-text{
      height: calc(100vh - 180px);
      line-height:calc(100vh - 180px);
    }
    #en-patrltabs-content >>> .el-tabs__nav-scroll {
      height: 40px;
    }
    #en-patrltabs-content >>> .el-tabs__item {
      padding: 0 0;
      font-size: 14px;
      width: calc(160/1920*100vw);
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

</style>
