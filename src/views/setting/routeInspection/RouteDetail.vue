<template>
  <div class="detail-container">
    <el-row>
      <el-col :span="24" class="detail-title">
        <div class="table-right-post" @click="setItem">
          <i class="iconfont icon-quxiaolianjie"/>
          <span class="post-label">{{ $t('insSettingView.relationDuty') }}:</span>
          <span class="post-concent">{{ routeData[0].ModelPost }}</span>
        </div>
        <div class="route-btns">
          <delay-button
            :disabled="routeData.length === 0"
            class="inspction-btn"
            button-type="default"
            @click="deleteNapes"
          >
            <i class="iconfont icon-shanchu"/>
            <span>{{ $t('insSettingView.deleteItem') }}</span>
          </delay-button>
          <delay-button
            :disabled="routeData.length === 0"
            class="inspction-btn"
            @click="setRule">
            <i class="iconfont icon-guize1"/>
            <span>{{ $t('insSettingView.ruleInspect') }}</span>
          </delay-button>
          <delay-button
            :disabled="routeData.length === 0"
            class="inspction-btn"
            @click="setItem"
          >
            <i class="iconfont icon-button"/>
            <span>{{ $t('insSettingView.setItem') }}</span>
          </delay-button>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="data-box">
          <div v-for="item in sheetName" :key="item.id" class="sheet_title" @click="changeSheet(item.id)">
            <p :style="item.isClick?'background-color: #f31b65;color:#fff;':''" class="item_title">{{ item.label }}</p>
          </div>
        </div>
        <el-scrollbar id="el-menuscrollbar">
          <div v-if="routeData.length !== 0" :style="{'min-height':varyWindowWidth*0.52+'px'}">
            <div v-for="(item,index) in routeData" :key="index" class="data-content">
              <div v-if="index === 0" class="header-content tabTitle">
                <el-checkbox v-model="allchecked" class="allcheckBox" @change="changeAllData"/>
                <span class="name-title">{{ $t('insSettingView.inspectName') }}</span>
                <span v-if="isScoreItemActive">
                  <span class="score-item-description-title">{{ $t('insSettingView.inspectionDescp') }}</span>
                  <span class="total-score">{{ $t('insSettingView.sheetscore0') }}</span>
                  <span class="options-title">{{ $t('insSettingView.sheetscore3') }}</span>
                  <span class="limitation-title" >{{ $t('insSettingView.sheetscore1') }}</span>
                </span>
                <span v-else>
                  <span class="description-title">{{ $t('insSettingView.inspectionDescp') }}</span>
                  <span class="score-title">{{ $t('insSettingView.score') }}</span>
                </span>
                <span :class="lang === 'en' ? 'en-handle-title' : 'handle-title'">{{ $t('insSettingView.operation') }}</span>
              </div>
              <div class="table-header-title">
                <el-checkbox v-model="item.checked" class="all-checkBox" @change="change(item)"/>
                <span class="table-title">{{ item.groupName }}（{{ item.itemCount }}）</span>
              </div>
              <div v-if="item.itemData.length !== 0" class="table-class">
                <el-table
                  :data="item.itemData"
                  :ref="item.refId"
                  :show-header="false"
                  size="medium">
                  <el-table-column prop="checked" width="70px" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isNew" class="showNewContent">new</span>
                      <el-checkbox
                        v-model="scope.row.checked"
                        style="position:relative;bottom:1px;"
                        @change="selectRow(index,item,scope.$index,scope.row)"/>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" width="300px"/>
                  <el-table-column :min-width="isScoreItemActive?'18%':'23%'" prop="description"/>
                  <el-table-column :min-width="isScoreItemActive?'4%':'15%'" prop="score" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.score }}<span v-if="lang!='en'">{{ $t('insSettingView.scores') }}</span></span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="isScoreItemActive" :min-width="'8%'" prop="score" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.availableScores }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="isScoreItemActive" prop="qualifiedScore" align="center" min-width="11%">
                    <template slot-scope="scope">
                      <span>{{ scope.row.qualifiedScore }}<span v-if="lang !== 'en'">{{ $t('insSettingView.scores') }}</span></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="handle" min-width="6%">
                    <template slot-scope="scope">
                      <i class="iconfont icon-shanchu" style="cursor:pointer;" @click="handleDelete(scope.$index, scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showDeleteContent"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showDeleteContent')"
      @cancelHandler="hideDeleteContentDialog('showDeleteContent')"
      @confirmHandler="confirmDelete">
      <div class="dialog-slot">
        <i class="el-icon-warning dialog-icon"/>
        <div class="dialog-content">{{ $t('insSettingView.confirmSelecDel') }}</div>
      </div>
    </dialog-pop>
    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showSingleDeleteContent"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showSingleDeleteContent')"
      @cancelHandler="hideDeleteContentDialog('showSingleDeleteContent')"
      @confirmHandler="confirmDeleteSingle"
    >
      <div class="dialog-slot">
        <i class="el-icon-warning dialog-icon"/>
        <div class="dialog-content">{{ $t('insSettingView.confirmDelData') }}</div>
      </div>
    </dialog-pop>
  </div>
</template>
<script>
import { inpectRESTful } from '@/api/index';
import { getScheduleListService } from '@/api/schedule';
import DelayButton from '@/components/DelayButton';
import util from '@/common/util';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'RouteDetail',
  components: { DialogPop, DelayButton },
  props: {
    routeData: Array,
    tabName: String,
    downSrc: String,
    routeName: String,
    allRoutedata: Array,
    sheetName: Array
  },

  data() {
    return {
      typeNum: 0,
      itemNum: 0,
      showFaildig: false,
      showBtnContent: false,
      showDeleteContent: false,
      showSingleDeleteContent: false,
      multeSection: [],
      FileInfo: [],
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
      addPatrol: '自定义巡检表',
      tabNameLang: '',
      tabNameInput: '',
      varyWindowWidth: window.innerHeight,
      allchecked: false,
      curDeleteId: '',
      curDelGroupId: [],
      fileName: this.$t('insSettingView.patrolExample'),
      lang: this.$i18n.locale,
      delItems: [],
      delGroup: [],
      ModelPost: null,
      showSheet0: true,
      showSheet1: false,
      showSheet2: false,
      curSheet: -1
    };
  },

  computed: {
    isScoreItemActive() {
      return this.sheetName.some(item => item.id === 1 && item.isClick);
    }
  },
  mounted() {
    this.getNum();
  },

  methods: {
    getNum() {
      const self = this;
      self.typeNum = self.routeData.length;
      let allcount = 0;
      self.routeData.forEach(item => {
        allcount += item.itemData.length;
      });
      self.itemNum = allcount;
    },

    changeAllData(val) {
      console.log(val);
      const self = this;
      self.routeData.forEach(item => {
        item.checked = val;
        item.itemData.forEach(_item => {
          _item.checked = val;
        });
      });
    },

    changeSheet: function(e) {
      const self = this;
      self.curSheet = e;
      self.allchecked = false;
      self.routeData.forEach(item => {
        item.checked = false;
        item.itemData.forEach(_item => {
          _item.checked = false;
        });
      });
      self.sheetName.forEach(item => {
        item.isClick = item.id === e;
      });
      self.allRoutedata.forEach(item => {
        if (e === item[0].type) {
          self.$emit('change-routeData', item);
        }
      });
    },

    change(item) {
      const self = this;
      const arr = [];
      console.log(item);
      item.itemData.forEach(_item => {
        _item.checked = item.checked;
      });
      self.routeData.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      self.allchecked = self.routeData.length === arr.length;
    },

    selectRow(tableIndex, item) {
      const arr = [];
      const self = this;
      item.itemData.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      console.log(arr.length);
      item.checked = item.itemData.length === arr.length;
      const arrCheckedItem = [];
      let count = 0;
      self.routeData.forEach(_item => {
        count += _item.itemData.length;
        _item.itemData.forEach(itemS => {
          if (itemS.checked) {
            arrCheckedItem.push(itemS);
          }
        });
      });
      self.allchecked = count === arrCheckedItem.length;
    },

    getNapeList() {
      const self = this;
      return new Promise((resolve, reject) => {
        inpectRESTful.getInspectItemList().then(res => {
          const code = res.errMsg;
          const data = res.data;
          if (code != null && code === 'Success') {
            self.allData = data;
          }
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },

    async refreshData() {
      const self = this;
      const data = await self.getNapeList();
      if (data.length !== 0) {
        const temp = [];
        data.forEach(item => {
          if (item.tag === self.tabName) {
            const _obj = {};
            _obj.id = item.id;
            _obj.groupName = item.name;
            _obj.itemCount = item.items.length;
            _obj.checked = false;
            const tempChild = [];
            item.items.forEach(itemChild => {
              const objChild = {};
              objChild.id = itemChild.id;
              objChild.checked = false;
              objChild.name = itemChild.subject;
              objChild.description = (itemChild.description === undefined || itemChild.length === 0) ? '--' : itemChild.description;
              objChild.score = itemChild.itemScore + '分';
              tempChild.push(objChild);
            });
            _obj.itemData = tempChild;
            temp.push(_obj);
          }
        });
        self.routeData = temp;
        self.getNum();
      }
    },

    async deleteNapes() {
      const self = this;
      const arr = [];
      const countGroup = [];
      self.routeData.forEach(item => {
        if (item.checked) {
          countGroup.push(item.id);
        }
        item.itemData.forEach(_item => {
          if (_item.checked) {
            arr.push(_item.id);
          }
        });
      });
      if (arr.length === 0 && countGroup.length === 0) {
        util.notify(self.$t('insSettingView.selectItems'), 'warning', 3000);
        return false;
      }
      const typeTemp = [];
      self.allRoutedata.forEach(item => {
        item.forEach(_item => {
          typeTemp.push(_item.type);
        });
      });
      const delData = self.routeData.filter(x => x.itemData.length !== 0);
      if (delData.length === 1 && delData[0].itemData.length === 1 || self.allchecked) {
        // if ((self.allRoutedata.length === 2 && !typeTemp.some(x => x === 0) || self.allRoutedata.length === 3) && delData[0].type === 1) {
        //   self.showFaildig = true;
        //   return false;
        // } else
        if (self.allRoutedata.length === 1) {
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
      self.showDeleteContent = true;
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

    afterDeleteNape() {
      const self = this;
      util.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
      self.showDeleteContent = false;
      const val = 'del';
      self.$emit('refreshList', val, self.curSheet);
    },

    confirmDelete() {
      const self = this;
      const arrGroup = [];
      const arrItem = [];
      self.routeData.forEach(item => {
        if (item.checked) {
          arrGroup.push(item.id);
        }
        item.itemData.forEach(_item => {
          if (_item.checked) {
            arrItem.push(_item.id);
          }
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
                  self.afterDeleteNape();
                }
              });
            } else {
              self.afterDeleteNape();
            }
          } else {
            util.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
            return false;
          }
          self.allchecked = false;
        });
      } else {
        inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup => {
          if (resGroup.errMsg === 'Success') {
            self.afterDeleteNape();
          } else {
            util.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
            return false;
          }
          self.allchecked = false;
        });
      }
    },

    getDownLoadURL() {
      const self = this;
      inpectRESTful.downLoadTemplate().then(res => {
        const blob = new Blob([res], {
          type: 'application/vnd.ms-excel'
        });
        const objectUrl = URL.createObjectURL(blob);
        self.downLoadSrc = objectUrl;
      }).catch(err => {
        console.log('RouteDetail-getDownLoadURL: ' + err);
      });
    },

    async handleDelete(index, row) {
      const self = this;
      const typeTemp = [];
      self.allRoutedata.forEach(item => {
        item.forEach(_item => {
          typeTemp.push(_item.type);
        });
      });
      const delData = self.routeData.filter(x => x.itemData.length !== 0);
      if (delData.length === 1 && delData[0].itemData.length === 1) {
        // if ((self.allRoutedata.length === 2 && !typeTemp.some(x => x === 0) ||
        //   self.allRoutedata.length === 3) && delData[0].type === 1) {
        //   self.showFaildig = true;
        //   return false;
        // } else
        if (self.allRoutedata.length === 1) {
          const params = {};
          params.category = parseInt(self.routeData[0].mode);
          const bindSchedule = await self.getScheduleFromDB();
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
      self.showSingleDeleteContent = true;
      const id = row.id;
      const arr = [];
      arr.push(id);
      self.curDeleteId = arr;
    },

    async confirmDeleteSingle() {
      const self = this;
      const params = {
        'itemIds': self.curDeleteId
      };
      inpectRESTful.deleteInspectItem(params).then(res => {
        const code = res.errMsg;
        if (code != undefined && code === 'Success') {
          self.routeData.forEach((r_item, r_index) => {
            if (self.routeData[r_index].itemData.length === 1) {
              r_item.itemData.forEach((d_item, d_index) => {
                if (self.curDeleteId[0] === d_item.id) {
                  self.curDelGroupId = r_item.id;
                  const paramsGroup = {
                    'groupIds': [self.curDelGroupId]
                  };
                  inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup => {
                    util.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
                    self.showSingleDeleteContent = false;
                    const val = 'del';
                    self.$emit('refreshList', val, self.curSheet);
                  });
                }
              });
            } else {
              util.notify(self.$t('insSettingView.deleteSuss'), 'success', 3000);
              self.showSingleDeleteContent = false;
              const val = 'del';
              self.$emit('refreshList', val, self.curSheet);
            }
          });
        } else {
          util.notify(self.$t('insSettingView.deleteFail'), 'warning', 3000);
          return false;
        }
        self.allchecked = false;
      }).catch(err => {
        console.log('RouteDetail-confirmDeleteSingle: ' + err);
      });
    },

    updateDeleteContentDialogFlag(val, key) {
      this[key] = val;
    },

    hideDeleteContentDialog(key) {
      this[key] = false;
    },

    setItem() {
      const self = this;
      sessionStorage.setItem('NapeItem', JSON.stringify(self.routeData));
      sessionStorage.setItem('GroupName', self.tabName);
      const params = {
        routeData: self.routeData,
        tabNameLang: self.tabNameLang,
        routeName: self.routeName
      };
      sessionStorage.setItem('itemSettingData', JSON.stringify(params));
      self.$router.push({ name: 'itemSetting', params: params });
    },

    setRule() {
      const self = this;
      const params = { inspectId: self.routeData[0].inspectId, routeName: self.routeName, mode: self.routeData[0].mode};
      sessionStorage.setItem('ruleData', JSON.stringify(params));
      self.$router.push({ name: 'setRule', params: params });
    },

    downLoadModel() {
      const url = 'http://' + window.location.host + '/storemonitor/api/v1.0/inspect/template';
      window.open(url);
    },

    emptyImport() {
      document.getElementById('uploadFile').click();
    },

    checkBeforeImport() {
      const self = this;
      if (self.checkValue === self.addPatrol && (self.tabNameInput == null || self.tabNameInput.trim().length === 0)) {
        util.notify(self.$t('insSettingView.enterSelfListName'), 'warning', 3000);
        return false;
      }
    }

  }
};
</script>
<style>
@import '../../../assets/css/importfile.css';
</style>
<style lang="scss" scoped>
@import '../../../assets/css/importfile.css';
@import '../../../assets/css/textstyle.css';
    $mainColor:#f31d65;
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

    .ul_style{
        background-color:#f7f8fb;
        border:1px solid #dfe2e9;
        border-radius:2px;
        min-height:150px;
        padding:20px 0 0 20px;
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
    #el-menuscrollbar >>> .el-scrollbar__view{
        margin-top:65px;
    }
    .detail-title{
        overflow: hidden;
        .table-right-post{
            font-size: 14px;
            color:#94a4b4;
            text-align: left;
            float: left;
            line-height: 36px;
            font-weight: bold;
            cursor: pointer;
            .title-title{
                margin-left: 0px;
                margin-top: 15px;
                margin-bottom: 20px;
                font-size: calc(18/1920*100vw);
                font-weight: bold;
                color: #424151;
            }
            .iconfont{
                font-size: 14px;
                margin-right: 38px;
                margin-left: calc(27/1920*100vw);
            }
            .post-label{
                color:#f31b65;
                text-decoration: underline;
            }
            .post-concent{
                color:#404153;
            }
        }
        .route-btns{
          float: right;
          margin-right:calc(20/1920*100vw);
          display: flex;
          align-items: center;
        }
    }
    #el-menuscrollbar{
        height:100%;
        border:1px solid #e3e9f4;
        border-top: 0px;
        margin-bottom:10px;
        position: relative;
    }
    .data-box{
        background-color: #e9eff8;
        height:36px;
        border:1px solid #e3e9f4;
        border-bottom: 0px;
        margin-top:10px;
        padding-left:60px;
        .item_title{
            color:#404153;
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            width:120px;
            height:34px;
            line-height: 34px;
            border-radius:4px 4px 0 0;
            margin-right: 20px;
            cursor: pointer;
        }
        .sheet_title{
            float: left;
            margin-top: 2px;
        }
    }
    .data-content{
        margin: 20px calc(20/1920*100vw);
        margin-left: 0px;
        overflow: hidden;
        .header-content{
            width: 100%;
            margin:0px;
            float: left;
            overflow: hidden;
            text-align: left;
            padding: 15px 0 15px 27px;
            border-bottom:1px solid #e3e9f4;
            font-size: calc(14/1920*100vw);
            position: absolute;
            top:0;
            background-color: #fff;
            z-index: 100;
            .allcheckBox{
                float: left;
                margin-right: 0;
            }
            .name-title{
                float: left;
                width: 300px;
                margin-left: 40px;
            }

            .description-title{
                float: left;
                width: calc((100% - 405px) * 15.3/29);
            }
            .score-item-description-title{
              float: left;
              width: calc((100% - 405px) * 11/29);
            }
            .score-title{
                float: left;
                width: calc((100% - 405px) * 9/29);
                padding: 0 10px;
                text-align: center;
            }
            .total-score{
               @extend .score-title;
               width: calc((100% - 405px) * 2.5/29);
             }
            .options-title{
              @extend .score-title;
              width: calc((100% - 405px) * 4/29);
            }
            .limitation-title{
              @extend .score-title;
              width: calc((100% - 405px) * 6/29);
            }
            .handle-title{
                float: left;
                width: calc((100% - 405px) * 3/29);
                padding-left:calc(20/1920*100vw);
            }
            .en-handle-title{
              float: left;
              width: calc((100% - 405px) * 5/29);
            }
        }
        .table-header-title{
            float:left;
            width:80%;
            text-align: left;
            margin-bottom:calc(15/1920*100vw);
            margin-left: 27px;
            margin-right: 0;
            .all-checkBox{
                margin-right: 0;
            }
        }
      .table-class{
        .iconfont{
          font-size: calc(24/1920*100vw);
          color: #7d8cad;
        }
        .el-table{
          font-size: calc(14/1920*100vw);
        }
      }
        .table-title{
            @include point(margin-left,38);
            margin-left: 38px;
            font-size: 14px;
            font-weight: bold;
            color: #424151;
        }
    }
    .el-dropbtn1{
        position: relative;
        bottom: 2px;
        @include point(margin-left,10);
    }
    .showNewContent{
        position: absolute;
        display: inline-block;
        background-color: orange;
        top: 0px;
        left: 5px;
        color: #fff;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 12px;
        height: 12px;
        padding-top: 0px;
        line-height: 10px;
    }
    .elradio{
        &:last-child{
            border-left: 1px solid #dcdfe6;
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
    .tabName-input-content{
        background: #fff;
        @include point(height,73);
        width: 100%;
    }
</style>
<style>
#el-menuscrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.current-row > td {
  background: #FEE7E4 !important;
}
.el-dialog__body{
    padding: 0px;
}
.elradio .el-radio-button__inner{
    width: 86px;
    border-radius: 5px !important;
}
</style>

