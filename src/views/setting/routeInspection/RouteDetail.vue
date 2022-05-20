<template>
  <div class="detail-container">
    <div>
      <div class="data-box flex-center">
        <div v-for="(item, sheetIndex) in sheetName" :key="item.id" class="sheet_title" @click="changeSheet(item.id, sheetIndex)">
          <p :style="item.isClick?'background-color: #fff;color:#006ab7;':''" class="item_title">{{ item.label }}</p>
        </div>
        <div class="spacer"></div>
        <div 
          class="flex-center"
          style="margin-right:20px">
          <div
            style="display:flex;flex-direction:row;margin-right: 16px; line-height: 24px;cursor:pointer;"
            :disabled="routeData.length === 0"
            class="storevue-button-empty"
            size="mini"
            @click="deleteNapes">
            <img :src="imgDelete" style="width:24px;height:24px;"/>
            <div style="font-size:13px;margin-left:8px;font-family:'NotoSansCJKtc';">{{ $t('insSettingView.deleteItem') }}</div>
          </div>
          <div
            style="display:flex;flex-direction:row;margin-right: 16px; line-height: 24px;cursor:pointer;"
            :disabled="routeData.length === 0"
            class="storevue-button-empty"
            size="mini"
            @click="setRule">
            <img :src="imgIncepSetting" style="width:24px;height:24px;"/>
            <div style="font-size:13px;margin-left:8px;font-family:'NotoSansCJKtc';">{{ $t('insSettingView.ruleInspect') }}</div>
          </div>
          <div
            style="display:flex;flex-direction:row;margin-right: 16px; line-height: 24px;cursor:pointer;"
            :disabled="routeData.length === 0"
            class="storevue-button-empty"
            size="mini"
            @click="setItem">
            <img :src="imgIncepItemSet" style="width:24px;height:24px;"/>
            <div style="font-size:13px;margin-left:8px;font-family:'NotoSansCJKtc';">{{ $t('insSettingView.setItem') }}</div>
          </div>
        </div>
      </div>
      <div v-if="routeData.length !== 0" :style="{'min-height':varyWindowWidth*0.52+'px'}">
        <div v-for="(item,index) in inspectCategoryList" :key="index" class="data-content">
          <div class="prompt-content" v-if="sheetIndex === 0 && index === 0 && showDragInfo">
            <div class="prompt-info">
              <img :src="dragImgSrc" class="prompt-image" alt="">
              <div class="prompt-msg">{{ $t('titleView.draggableInfo') }}</div>
            </div>
          </div>
          <div class="dragable-table-header" v-if="index === 0">
            <div class="table-header-item" v-for="(headerItem, headerIndex) in tableHeader" :key="headerIndex"
                  :style="headerItem.headerStyle">
              <el-checkbox v-model="allchecked" class="storevue-checkbox-outlined" @change="checkAllItems" v-if="headerIndex === 0"/>
              {{ headerItem.name }}
            </div>
          </div>
          <div class="catergy-title">
            <el-checkbox v-model="item.checked" class="storevue-checkbox-outlined" @change="checkItemsOfCatergy(item)"/>
            <div style="display: inline-flex;flex-direction: column;font-size: 14px;font-weight: bold;color: #424151; padding-left: calc(38/1920*100vw);">
              <div v-if="sheetIndex != 2 && item.groupWeight != -1">{{ `${item.groupWeight}%` }}</div>
              <div>{{ item.groupName }}（{{ item.itemCount }}）</div>
            </div>
          </div>
          <template v-if="!item.children">
            <div v-if="item.itemData.length !== 0" class="table-class">
              <draggable-table
                :is-score-sheet= "isScoreItemActive"
                :table-header="isScoreItemActive ? scoreTableHeader:passFailTableHeader"
                :table-data="item.itemData"
                :show-edit-btn="false"
                :show-table-header="false"
                @handleDeleteItem="contentItem => handleDelete(contentItem, index, -1)"
                @handleCheckItem="tableData => handleCheckCategoryItem(tableData, index)"
                @updateTableData="sortableTableData => changeTableData(sortableTableData, index)"
              />
            </div>
          </template>
          <template v-else>
            <template v-for="(child,childIndex) in item.children">
              <div class="catergy-title subcatergy" :key="childIndex">
                <el-checkbox v-model="child.checked" class="storevue-checkbox-outlined" @change="checkSubcatergy(child, item)"/>
                <span class="table-title">{{ child.groupName }}</span>
              </div>
              <div v-if="child.itemData.length !== 0" class="table-class" :key="`item-`+childIndex">
                <draggable-table
                  :is-score-sheet= "isScoreItemActive"
                  :table-header="isScoreItemActive ? scoreTableHeader:passFailTableHeader"
                  :table-data="child.itemData"
                  :show-edit-btn="false"
                  :show-table-header="false"
                  @handleDeleteItem="contentItem => handleDelete(contentItem, index, childIndex)"
                  @handleCheckItem="(tableData) => handleCheckSubcategoryItem(tableData, index, childIndex)"
                  @updateTableData="sortableTableData => changeTableData(sortableTableData,index, childIndex)"
                />
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="showDeleteContent"
      :show-close="false"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showDeleteContent')"
      @cancelHandler="hideDeleteContentDialog('showDeleteContent')"
      @confirmHandler="confirmDelete">
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('insSettingView.confirmSelecDel') }}</div>
      </div>
    </dialog-pop>

    <dialog-pop
      :title="$t('insSettingView.confirmDelete')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showSingleDeleteContent"
      :isWarning="true"
      @visibleChangeHandler="updateDeleteContentDialogFlag($event, 'showSingleDeleteContent')"
      @cancelHandler="hideDeleteContentDialog('showSingleDeleteContent')"
      @confirmHandler="confirmDeleteSingle"
    >
      <div class="dialog-slot">
        <div class="dialog-content">{{ $t('insSettingView.confirmCurDel') }}</div>
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
import draggable from 'vuedraggable';
import DraggableTable from "@/components/DraggableTable";

export default {
  name: 'RouteDetail',
  components: {DraggableTable, DialogPop, DelayButton , draggable},
  props: {
    routeData: Array,
    tabName: String,
    downSrc: String,
    routeName: String,
    allRoutedata: Array,
    sheetName: Array,
    showDragInfo: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      imgDelete:require('../../../../static/img/ic_delete_blue.svg'),
      imgIncepSetting:require('../../../../static/img/ic_IncepSetting_blue.svg'),
      imgIncepItemSet:require('../../../../static/img/ic_IncepItemSet_blue.svg'),
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
      curSheet: -1,
      passFailTableHeader: [
        {
          name: this.$t('insSettingView.inspectName'),
          headerStyle:{
            width: '27%',
            textAlign: 'left',
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
            width: '16%'
          },
        },
        {
          name: this.$t('insSettingView.operation'),
          headerStyle:{
            width: '18%'
          },
        },
      ],
      scoreTableHeader: [
        {
          name: this.$t('insSettingView.inspectName'),
          headerStyle:{
            width: '27%',
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
            width: '16%'
          },
        },
        {
          name: this.$t('insSettingView.sheetscore3'),
          headerStyle:{
            width: '18%'
          },
        },
        {
          name: this.$t('insSettingView.sheetscore1'),
          headerStyle:{
            width: '18%'
          },
        },
        {
          name: this.$t('insSettingView.operation'),
          headerStyle:{
            width: '18%'
          },
        },
      ],
      inspectCategoryList: util.handleInspctionCatergyTree(this.routeData),
      categoryIndex: -1,
      subcategoryIndex: -1,
      dragImgSrc: require('../../../../static/img/arrows_down.png'),
      sheetIndex: 0
    };
  },

  computed: {
    isScoreItemActive() {
      return this.sheetName.some(item => item.id === 1 && item.isClick);
    },
    tableHeader(){
      return this.isScoreItemActive ? this.scoreTableHeader : this.passFailTableHeader;
    }
  },
  watch:{
    routeData:{
      handler(newValue){
        this.inspectCategoryList = util.handleInspctionCatergyTree(newValue);
      },
      deep:true
    },
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

    checkAllItems(val) {
      this.routeData.forEach(item => {
        item.checked = val;
        item.itemData.forEach(_item => {
          _item.checked = val;
        });
      });
    },

    changeSheet(e, index) {
      const self = this;
      self.curSheet = e;
      self.allchecked = false;
      self.sheetIndex = index;
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

    checkItemsOfCatergy(item) {
      const self = this;
      const arr = [];
      if(!item.children){
        item.itemData.forEach(_item => {
          _item.checked = item.checked;
        });
      } else {
        item.children.forEach(child => {
          child.checked = item.checked;
          child.itemData.forEach(_item => {
            _item.checked = item.checked;
          })
        })
      }
      self.inspectCategoryList.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      self.allchecked = self.inspectCategoryList.length === arr.length;
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

    getSelectedCategoryIdList(){
      const categoryIds = [];
      const subcategoryIds = [];
      const inspectionItemIds = [];
      this.inspectCategoryList.forEach(category => {
        if(category.checked){
          categoryIds.push(category.id);
        }
        if (category.children){
          category.children.forEach(child => {
            if (child.checked){
              subcategoryIds.push(child.id);
            }
            child.itemData.map(v => {
              if (v.checked){
                inspectionItemIds.push(v.id);
              }
            });
          })
        } else {
          category.itemData.map(v => {
            if (v.checked){
              inspectionItemIds.push(v.id);
            }
          });
        }
      });
      return {
        categoryIds,
        subcategoryIds,
        inspectionItemIds
      }
    },

    async deleteNapes() {
      const self = this;
      const selectedIdsJson = this.getSelectedCategoryIdList();
      const selectIds = [...Object.values(selectedIdsJson).flat()];
      if (selectIds.length === 0) {
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

    async confirmDelete() {
      const selectedIdsJson = this.getSelectedCategoryIdList();
      const params = {
        'itemIds': selectedIdsJson.inspectionItemIds
      };
      const subCategoryGroup = {
        'groupIds': selectedIdsJson.subcategoryIds
      };
      const paramsGroup = {
        'groupIds': selectedIdsJson.categoryIds
      };

      try {
        if (selectedIdsJson.inspectionItemIds.length > 0) {
          await inpectRESTful.deleteInspectItem(params);
        }
        if (selectedIdsJson.subcategoryIds.length > 0) {
          await inpectRESTful.deleteInspectGroup(subCategoryGroup);
        }
        if (selectedIdsJson.categoryIds.length > 0){
          await inpectRESTful.deleteInspectGroup(paramsGroup);
        }
        this.afterDeleteNape();
      } catch (e) {
        util.notify(this.$t('insSettingView.deleteFail'), 'warning', 3000);
        return false;
      } finally{
        this.allchecked = false;
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

    async handleDelete(contentItem, contentIndex, subcategoryIndex) {
      const self = this;
      const typeTemp = [];
      self.allRoutedata.forEach(item => {
        item.forEach(_item => {
          typeTemp.push(_item.type);
        });
      });
      const delData = self.routeData.filter(x => x.itemData.length !== 0);
      if (delData.length === 1 && delData[0].itemData.length === 1) {
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
      const id = contentItem.id;
      const arr = [];
      arr.push(id);
      self.curDeleteId = arr;
      this.categoryIndex = contentIndex;
      this.subcategoryIndex = subcategoryIndex;
    },

    async confirmDeleteSingle() {
      const params = {
        'itemIds': this.curDeleteId
      };
      try {
        await inpectRESTful.deleteInspectItem(params);
        const category = this.inspectCategoryList[this.categoryIndex];
        if (this.subcategoryIndex === -1) {
          if(category.itemData.length === 1){
            await this.deleteInspectGroup([category.id])
          }
        } else {
          const subCategory = category.children[this.subcategoryIndex];
          if (subCategory.itemData.length === 1 ) {
            await this.deleteInspectGroup([subCategory.id]);
            if (category.itemCount === 1){
              await this.deleteInspectGroup([category.id])
            }
          }
        }
        util.notify(this.$t('insSettingView.deleteSuss'), 'success', 3000);
        const val = 'del';
        this.$emit('refreshList', val, this.curSheet);
      } catch (e){
        util.notify(this.$t('insSettingView.deleteFail'), 'warning', 3000);
        return false;
      } finally {
        this.showSingleDeleteContent = false;
        this.allchecked = false;
      }
    },

    deleteInspectGroup(groupIds){
      const paramsGroup = {
        'groupIds': groupIds
      };
      return new Promise((resolve => {
        inpectRESTful.deleteInspectGroup(paramsGroup).then(resGroup => {
          resolve(resGroup);
        });
      }))
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
    },

    checkSubcatergy(child, item){
      let checkedSubCategyNum = [];
      if (child.itemData.length > 0){
        child.itemData.forEach(_item => {
          _item.checked = child.checked;
          child.checked && checkedSubCategyNum ++;
        });
        child.checked = child.itemData.length === checkedSubCategyNum;
      }
      item.checked = item.children.length === item.children.filter(childItem => childItem.checked).length;
      this.changeTableHeaderCheckedFlag();
    },

    handleCheckCategoryItem(tableData, index){
      this.inspectCategoryList[index].itemData = tableData;
      const checkedItems = this.inspectCategoryList[index].itemData.filter(item => item.checked);
      this.inspectCategoryList[index].checked = checkedItems.length === this.inspectCategoryList[index].itemData.length;
      this.changeTableHeaderCheckedFlag();
    },

    handleCheckSubcategoryItem(tableData, index, childIndex){
      const category = this.inspectCategoryList[index];
      const childItem = category.children[childIndex];
      childItem.itemData = tableData;

      const checkedItems = childItem.itemData.filter(item => item.checked);
      childItem.checked = checkedItems.length === childItem.itemData.length;

      const checkSubcategoryItems = category.children.filter(child => child.checked);
      category.checked = category.children.length === checkSubcategoryItems.length;
      this.changeTableHeaderCheckedFlag();
    },

    changeTableHeaderCheckedFlag(){
      const checkedCategory = this.inspectCategoryList.filter(category => category.checked);
      this.allchecked = this.inspectCategoryList.length === checkedCategory.length;
    },

    changeTableData(sortableTableData, index, childIndex){
      const category = this.inspectCategoryList[index];
      if(childIndex){
        const childItem = category.children[childIndex];
        childItem.itemData = sortableTableData;
        const itemId = childItem.id;
        this.routeData.forEach(item => {
          if (itemId === item.id){
            item.itemData = sortableTableData;
          }
        })
      } else {
        category.itemData = sortableTableData;
        const itemId = category.id;
        this.routeData.forEach(item => {
          if (itemId === item.id){
            item.itemData = sortableTableData;
          }
        })
      }
    }
  }
};
</script>
<style>
</style>
<style lang="scss" scoped>
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
        background-color: #f7f9f9;
        height: 40px;
        border-bottom:1px solid rgba(172, 174, 177, 0.34);
        margin-top:10px;
        padding-left:60px;
        .item_title{
            color:#404153;
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            width:auto;
            min-width:120px;
            height:34px;
            line-height: 34px;
            border-radius:4px 4px 0 0;
            margin-right: 20px;
            cursor: pointer;
        }
        .sheet_title{
        }
    }
    .data-content{
      overflow: hidden;
      width: calc(100% - 4px);
      position: relative;
      .catergy-title{
        font-size: 0;
        width:80%;
        text-align: left;
        margin: 15px 0 15px calc(27/1920*100vw);
        .all-checkBox{
          margin-right: 0;
        }
      }
      .subcatergy-title{
        .table-title{
          font-size: 13px;
        }
      }
      .table-class{
        position: relative;
        .iconfont{
          font-size: calc(24/1920*100vw);
          color: #7d8cad;
        }
        .el-table{
          font-size: calc(14/1920*100vw);
        }
      }
      .table-title{
        padding-left: calc(38/1920*100vw);
        font-size: 14px;
        font-weight: bold;
        color: #424151;
      }
    }
    .dragable-table-header{
      display: flex;
      justify-content: space-between;
      height: 50px;
      align-items: center;
      padding-left: calc(27/1920*100vw);
      border-bottom: 1px solid #e3e9f4;
      position: relative;
      font-size: 14px;
      color: #909399;
      font-weight: bold;
      text-align: center;
      .allcheckBox{
        margin-right: calc(38/1920*100vw);
      }
    }
.prompt-content{
  position: absolute;
  left: calc(258/1920*100vw);
  top: 60px;
  .prompt-info{
    display: inline-flex;
  }
  .prompt-image{
    height: 84px;
    width: 84px;
  }
  .prompt-msg{
    margin-left: calc(30/1920*100vw);
    font-size: 24px;
    color: #006ab7;
    font-weight:600;
    font-family: 'NotoSansCJKtc';
    margin-top:19px;

  }
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
</style>

