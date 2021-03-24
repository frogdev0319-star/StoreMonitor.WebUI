<template>
  <el-row class="el-storeEdit-content">
    <el-col :span="24" class="storeEdit-header">
      <div class="store-title ">
        <span>{{ storeTitle }}</span>
        <el-button
          :size="varyWindowWidth > 1680 ? 'small' : 'mini'"
          :disabled="scheduleData.length === 0? true : false"
          class="sub-btn"
          type="primary"
          @click="submitData">{{ $t('storeView.mySubmit') }}
        </el-button>
      </div>
      <div class="store-info">
        <strong style="margin-right:20px;">{{ $t('storeView.solver') }}</strong>
        <span style="min-width:100px;display:inline-block;">
          <el-input v-model="userName" disabled size="mini" class="input"/>
        </span>
        <strong style="margin-right:20px;">{{ $t('storeView.contact') }}</strong>
        <span style="min-width:100px;display:inline-block;"><el-input v-model="phone" disabled size="mini" style="" class="input"/></span>
        <span style="font-size:12px;font-weight:bold;">{{ $t('storeView.bindInspectList') }}</span>
        <span style="font-size:12px; display:inline-block;"><el-input v-model="curTag" disabled size="mini" style="" class="input"/></span>
        <span style="margin-right:20px;"><strong>{{ $t('storeView.supervisor') }}</strong></span>
        <span style="min-width:100px;display:inline-block;">
        <el-input v-model="supervisorName" disabled size="mini" class="input"/></span>
      </div>
    </el-col>
    <el-col :span="24" :style="{'min-height': emptyContentHeight+'px'}" class="storeEdit-content">
      <p class="tab-title"><span class="tab-title-1">{{ $t('insSettingView.editStore') }}</span>
        <span class="tab-title-2">{{ $t('insSettingView.editStoretips') }}
        </span>
      </p>
      <div class="tab-main">
        <el-tabs id="patrltabs-content" v-model="activeName" :before-leave="beforeleave">
          <el-tab-pane v-for="(item,index) in appliedInspect" :key="index" :label="item.name" />
        </el-tabs>
        <div class="data-box">
          <div v-for="item in sheetName" :key="item.id" class="sheet_title" @click="changeSheet(item.id)">
            <p :style="item.isClick ? 'background-color: #f31b65;color:#fff;' : ''" class="item_title">{{ item.label }}</p>
          </div>
        </div>
        <div class="el-table-title tabTitle">
          <span class="name-title">{{ $t('storeView.patrolName') }}</span>
          <span class="schedule-title">{{ $t('storeView.bindChanel') }}</span>
        </div>
        <div v-for="(item,index) in scheduleData" :key="index" class="el-table-data" >
          <span class="grouptitle">
            {{ item.napeName }}（{{ item.napeNum }}）
          </span>
          <div class="schedule-data">
            <div
              v-for="(_item,_index) in item.itemData"
              :key="_index"
              :class="!_item.isClick?'noraml-color':'active-color'"
              class="schedule-detials"
              style="overflow:hidden;"
              @click="clickItem(_item,_index)">
              <span class="nape-title">
                {{ `${_index+1}. ${_item.subject}` }}
              </span>
              <limit-select
                :selected="_item.channelvalue"
                :options="alleList"
                :input-size="`mini`"
                :select-limit="5"
                class="nape-value"
                @changeInput="changeDeviceId($event, _item)"
                @changeIfSelect="changeSelect($event, _item,_index)"/>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <dialog-vue
      :dialog-title="changeStoreObj.title"
      :show-info="changeStoreObj.showInfo"
      :is-warning="changeStoreObj.isWarning"
      :dialog-closed="changeStoreObj.dialogCosed"
      @confirmed="changeStoreDialog"
      @canceled="canceldChangeStore"/>
    <dialog-vue
      :dialog-title="changeSubmitObj.title"
      :show-info="changeSubmitObj.showInfo"
      :is-warning="changeSubmitObj.isWarning"
      :dialog-closed="changeSubmitObj.dialogCosed"
      @confirmed="submitData"
      @canceled="cancelSubmitDialog"/>
  </el-row>
</template>

<script>
import { getUserInfo } from '@/api/login';
import { getDeviceList } from '@/api/device';
import {
  checkOutInspectItem,
  bindInspectItem,
  checkOutInspectItemV3,
  bindInspectItemV2,
  unbindInspectItemV2,
  GetInspectTagList } from '@/api/inspect';
import { updateStoreInfo, getStoreList } from '@/api/store';
import DialogVue from '@/components/DialogVue.vue';
import LimitSelect from '../../../components/LimitSelect';

export default {
  name: 'EditStoreVue',
  components: {
    LimitSelect,
    DialogVue
  },
  data() {
    return {
      changeStoreObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('remotePatrol.confirmChangeBind'),
        isWarning: true,
        dialogCosed: false
      },
      changeSubmitObj: {
        title: this.$t('remotePatrol.confirm'),
        showInfo: this.$t('insSettingView.confirmSubmitThis'),
        isWarning: true,
        dialogCosed: false
      },
      allRoutedata: [],
      sheetName: [],
      activeName: '0',
      curTag: '远程巡检',
      storeTitle: '',
      store: {},
      phone: ' ',
      schedule: '',
      personList: [],
      curPerson: '',
      scheduleData: [],
      alleList: [],
      userId: '',
      supervisorId: '',
      supervisorName: '',
      varyWindowHeight: window.innerHeight,
      varyWindowWidth: window.innerWidth,
      userName: '',
      appliedInspect: []
    };
  },
  computed: {
    emptyContentHeight() {
      if (this.varyWindowHeight > 800) {
        return this.varyWindowHeight * 0.7;
      } else if (this.varyWindowHeight > 700) {
        return this.varyWindowHeight * 0.6;
      } else {
        return this.varyWindowHeight * 0.5;
      }
    }
  },

  async mounted() {
    const self = this;
    self.store = JSON.parse(sessionStorage.getItem('STORE_ROW'));
    const storeId = self.store.storeId;
    self.storeTitle = self.store.name;
    self.userId = self.store.userId;
    self.userName = self.store.userName;
    self.supervisorId = self.store.supervisorId;
    console.log(self.supervisorId);
    self.supervisorName = self.store.supervisorName;
    console.log(self.store.napeTable);
    self.curTag = self.store.napeTable;
    self.phone = self.store.phone;
    self.store.appliedInspect.forEach(item => {
      if (item.mode === 0) {
        self.appliedInspect.push(item);
      }
    });
    await self.getChannelByStore(storeId);
    await self.getNapeByStore(storeId);
  },

  methods: {
    changeStoreDialog() {
      const self = this;
      self.changeStoreObj.dialogCosed = false;
      self.getNapeByStore(self.store.storeId);
    },

    canceldChangeStore() {
      const self = this;
      self.changeStoreObj.dialogCosed = false;
    },

    beforeleave(e, w) {
      const self = this;
      let isshowdialog = false;
      self.allRoutedata.forEach(item => {
        item.forEach(a_item => {
          a_item.itemData.forEach(_item => {
            if (_item.oldChannelvalue.toString() !== _item.channelvalue.toString()) {
              isshowdialog = true;
            }
          });
        });
      });
      !isshowdialog ? self.getNapeByStore(self.store.storeId, Number(e)) : null;
      return isshowdialog ? new Promise((resolve, reject) => {
        self.$confirm(self.$t('remotePatrol.confirmChangeBind'), self.$t('remotePatrol.confirm'), {
          confirmButtonText: self.$t('remotePatrol.confirm'),
          cancelButtonText: self.$t('remotePatrol.cancel'),
          type: 'warning'
        }).then(() => {
          self.getNapeByStore(self.store.storeId, Number(e));
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }) : true;
    },

    changeSheet(e) {
      const self = this;
      self.sheetName.forEach(item => {
        if (item.id === e) {
          item.isClick = true;
        } else {
          item.isClick = false;
        }
      });
      self.allRoutedata.forEach(item => {
        if (e === item[0].type) {
          self.scheduleData = item;
        }
      });
    },

    getChannelByStore(storeId) {
      const self = this;
      const params = { storeId: storeId };
      getDeviceList(params).then(res => {
        const data = res.data;
        const temp = [];
        if (data.length !== 0) {
          data.forEach(item => {
            const obj = {};
            obj.id = item.id;
            obj.name = item.name;
            obj.ivsId = item.ivsId;
            obj.value = item.id;
            obj.label = item.name;
            obj.disabled = false;
            temp.push(obj);
          });
          self.alleList = temp;
        }
      }).catch(err => {
        console.log('StoreDetail-getChannelByStore: ' + err);
      });
    },

    clickItem(item, index) {
      const self = this;
      item.isClick = true;
      self.scheduleData.forEach((_item, index) => {
        _item.itemData.forEach((itemS, indexS) => {
          if (item.id !== itemS.id) {
            itemS.isClick = false;
          }
        });
      });
    },

    changeDeviceId(val, item) {
      const self = this;
      item.channelvalue = val;
    },

    changeSelect(val, item, index) {
      this.clickItem(item, index);
    },

    getNapeByStore(storeId, idx) {
      const self = this;
      let index = 0;
      self.sheetName = [];
      if (idx != undefined) {
        index = idx;
      } else {
        index = self.activeName;
      }
      const params = {
        storeId: storeId,
        mode: 0,
        authorizedOnly: 0,
        tagName: self.appliedInspect[index].name,
        inspectId: self.appliedInspect[index].id
      };
      self.checkoutInspectItems(params);
    },

    checkoutInspectItems(params) {
      const self = this;
      checkOutInspectItemV3(params).then(res => {
        const data = res.data.groups;
        let tempInfo = [];
        if (data.length > 0) {
          tempInfo = self.getItemsGroupAndInfo(data);
        }
        const scheduleArray = [];
        for (let i = 0; i < 3; i++) {
          const typeIndex = tempInfo.filter(x => x.type === i);
          let sheetObj = {};
          if (typeIndex.length > 0) {
            scheduleArray.push(typeIndex);
            if (typeIndex[0].type === 0) {
              sheetObj = { 'id': 0, 'isClick': false, 'label': self.$t('insSettingView.sheetpassfail') };
            }
            if (typeIndex[0].type === 1) {
              sheetObj = { 'id': 1, 'isClick': false, 'label': self.$t('insSettingView.sheetscore') };
            }
            if (typeIndex[0].type === 2) {
              sheetObj = { 'id': 2, 'isClick': false, 'label': self.$t('insSettingView.sheetother') };
            }
            self.sheetName.push(sheetObj);
          }
        }
        self.allRoutedata = scheduleArray;
        self.sheetName[0].isClick = true;
        self.scheduleData = scheduleArray[0];
      }).catch(err => {
        console.log('StoreDetail-checkoutInspectItems: ' + err);
      });
    },

    getItemsGroupAndInfo(data) {
      const infoArr = [];
      data.forEach(item => {
        const groupObj = {};
        groupObj.id = item.groupId;
        groupObj.napeName = item.groupName;
        groupObj.type = item.type;
        groupObj.napeNum = item.items.length;
        const tempItemArr = [];
        for (const _item of item.items) {
          const itemObj = {};
          itemObj.id = _item.id;
          itemObj.subject = _item.subject;
          itemObj.channelvalue = [];
          itemObj.oldChannelvalue = [];
          _item.deviceIds.forEach(id => {
            if (id !== -1) {
              itemObj.channelvalue.push(id);
            }
            itemObj.oldChannelvalue.push(id);
          });
          itemObj.isClick = false;
          tempItemArr.push(itemObj);
        }
        groupObj.itemData = tempItemArr;
        infoArr.push(groupObj);
      });
      return infoArr;
    },

    changePerson(val) {
      const self = this;
      self.personList.forEach(item => {
        if (item.userId === val) {
          self.phone = item.phoneNumber;
        }
      });
    },

    getUserList() {
      const self = this;
      const params = {
        storeId: self.store.storeId
      };
      getUserInfo(params).then(res => {
        const temp = res.data;
        if (self.supervisorId != null && self.supervisorId.length !== 0) {
          if (temp.map(x => x.userId).indexOf(self.supervisorId) === -1) {
            const obj = {
              userId: self.store.supervisorId,
              userName: self.store.supervisorId,
              phoneNumber: self.store.phone
            };
            temp.push(obj);
          }
        }
        self.personList = temp;
        self.curPerson = self.supervisorId;
      }).catch(err => {
        console.log('StoreDetail-getUserList: ' + err);
      });
    },

    cancelSubmitDialog() {
      const self = this;
      self.changeSubmitObj.dialogCosed = false;
    },

    async submitData() {
      const self = this;
      let count = 0;
      let countChannel = 0;
      const temp = [];
      const unbindTemp = [];
      self.allRoutedata.forEach(all_item => {
        all_item.forEach(item => {
          count += item.itemData.length;
          item.itemData.forEach(_item => {
            const obj = {};
            const unbindObj = {};
            if (_item.channelvalue.length !== 0) {
              countChannel++;
              obj.inspectItemId = _item.id;
              obj.storeId = self.store.storeId;
              obj.deviceIds = _item.channelvalue;
              if (_item.oldChannelvalue.length > 0 && JSON.stringify(_item.oldChannelvalue.sort()) !== JSON.stringify(_item.channelvalue.sort())) {
                unbindObj.inspectItemId = _item.id;
                unbindObj.storeId = self.store.storeId;
                unbindObj.deviceIds = _item.oldChannelvalue;
                unbindTemp.push(unbindObj);
              }
              temp.push(obj);
            }
          });
        });
      });
      if (self.scheduleData.length > 0) {
        if ((count !== 0 && (count !== countChannel)) || countChannel === 0) {
          self.notify(this.$t('storeView.selectAllChanels'), 'warning', 3000);
          return false;
        }
        const paramsInspec = {
          items: temp
        };
        let resUpdateStore = null, resBindInspect = null, resUnbindInspect = null;
        try {
          if (unbindTemp.length > 0) {
            const unbindParams = {
              items: unbindTemp
            };
            resUnbindInspect = await self.unbindInspectItem(unbindParams);
          }
          if (resUnbindInspect == null || resUnbindInspect.errMsg === 'Success') {
            resBindInspect = await self.bindInspectItem(paramsInspec);
          }
          if ((resUpdateStore == null && (resBindInspect != null && resBindInspect.errMsg === 'Success'))) {
            self.notify(this.$t('storeView.successSubmit'), 'success', 3000);
            self.changeSubmitObj.dialogCosed = false;
            self.getNapeByStore(self.store.storeId);
          } else {
            self.notify(this.$t('storeView.failSubmit'), 'warning', 3000);
            return false;
          }
        } catch (err) {
          console.log('StoreDetail-submitData: ' + err);
        }
      }
    },

    bindInspectItem(params) {
      return new Promise((resolve, reject) => {
        bindInspectItemV2(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    unbindInspectItem(params) {
      return new Promise((resolve, reject) => {
        unbindInspectItemV2(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    updateStoreInfo(params) {
      return new Promise((resolve, reject) => {
        updateStoreInfo(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
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

<style lang="scss" scoped>
@import '../../../assets/css/textstyle.css';
    $red:#FB4C5D;
    $fff:#fff;
    $tab:#7d8cad;
  $border:#e3e9f4;
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
    .noraml-color{
        background-color: #F6F7FB;
        cursor: pointer;
    }
    .active-color{
        background-color: #FEE4E7;
        cursor: pointer;
    }
    .el-storeEdit-content{
        .storeEdit-header{
            background-color: #fff;
            padding:30px calc(50/1920*100vw) 30px calc(80/1920*100vw);
            .store-title{
                overflow: hidden;
                text-align: left;
                font-size: calc(18/1920*100vw);
                font-weight: bold;
                color: #424151;
                .sub-btn{
                    float: right;
                    margin-right: calc(25/1920*100vw);
                    font-size: calc(14/1920*100vw);
                    height: calc(36/1920*100vw);
                    padding: 0 0;
                    width: calc(130/1920*100vw);
                }
            }
            .store-info{
                text-align: left;
                margin-top: 20px;
                font-size: calc(14/1920*100vw);
                span{
                    width:auto;
                    margin-right:20px;
                }
              @media screen and (max-width: 1680px){
                span{
                  width:auto;
                  margin-right:10px;
                }
              }
                .el-schedule{
                    @include point(width,140);
                    @include point(margin-right,25);
                }
                .input{
                  @include point(width,140);
                 // @include point(margin-right,25);
                  border: none;
                   >>> .el-input.is-disabled .el-input__inner{
                    border: none;
                    background-color: #f0f5f8 !important;
                  }
                }
            }
            .store-handle{
              .header-details1{
                text-align: left;
                padding-right: calc(30/1920*100vw);
                height: auto;
                line-height: calc(40/1920*100vw);
                span{
                  //font-size: calc(14/1920*100vw);
                  font-size: 14px;
                  margin-right: calc(20/1920*100vw);
                }
                .choice-store{
                  color: $tab;
                  i{
                    margin-right: calc(15/1920*100vw);
                  }
                  .icon-tishi1{
                    font-size: calc(16/1920*100vw);
                  }
                }
              }
            }
        }
        .storeEdit-content{
            margin: 30px;
            background-color: #fff;
            padding:0 30px 30px 30px;
            width:96%;
            .tab-main{
                min-height:80vh;
                background-color: #f6f7fb;
                border: 1px solid $border;
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
            .tab-title{
                text-align: left;
                margin:30px 0 10px 0;
                .tab-title-1{
                    font-size: calc(14/1920*100vw);
                    color:#182752;
                    font-weight: bold;
                }
                .tab-title-2{
                    font-size: calc(12/1920*100vw);
                    color:#ffb540;
                    margin-left: calc(15/1920*100vw);
                }
            }
            #patrltabs-content{
                line-height: 60px;
                height: 60px;
            }
            #patrltabs-content >>> .el-tabs__nav-wrap{
                padding-left: 35px;
            }
            #patrltabs-content >>> .el-tabs__active-bar{
                height: 5px;
            }
            #patrltabs-content >>> .el-tabs__item {
                font-weight: bold;
                color: #94A4B4;
                font-size: calc(14/1920*100vw);
                min-width: 150px;
                // overflow: hidden;
                // text-overflow: ellipsis;
            }
            #patrltabs-content >>> .el-tabs__item.is-active{
                color: #f31d65;
                font-size: calc(16/1920*100vw);
            }
            .el-table-title{
                line-height: 40px;
                height: 40px;
                text-align: left;
                border-bottom: 1px solid #ddd;
                margin:auto 10px;
                color: #94A4B4;
                font-size: calc(12/1920*100vw);
                font-weight: bold;
                .name-title{
                    width: 40%;
                    display: inline-block;
                    margin-right: 2%;
                    margin-left: 2%;
                }
            }
            .el-table-data{
                padding-left: calc(15/1920*100vw);
                padding-right: calc(15/1920*100vw);
                text-align: left;
                .grouptitle{
                    margin-left: 2%;
                    display: inline-block;
                    margin-top: 15px;
                    font-size: 15px;
                    font-weight: bold;
                    color: #424151;
                }
                .schedule-data{
                    margin-top: 5px;
                    .schedule-detials{
                        text-align: left;
                        line-height: 70px;
                        height: 70px;
                        border-bottom: 1px solid #ddd;
                        font-size: 14px;
                    }
                    .nape-title{
                        margin-left: 2%;
                        float: left;
                        width: 40%;
                    }
                    .nape-value{
                        margin-left: 2%;
                        width: calc(400/1920*100vw);
                        >>>  .el-province{
                          width: calc(400/1920*100vw);
                        }
                      >>> .input-class{
                        width: calc(370/1920*100vw);
                      }
                    }
                  .nape-value.content{
                    top: 0;
                  }
                }
            }
        }
    }
</style>
<style>
.el-dialog__body{
    padding: 0px !important;
}
.el-schedule .el-input__inner{
    background: #f0f5f8 !important;
    border-radius: 0px !important;
    border: 0px !important;
}

</style>
