<template>
  <div class="device-container">
    <device-header
      ref="deviceHeader"
      :vendor="3"
      :account="skywatchAccount"
      :device-list="beseyeDevicesList"
      :serial-nums="deleteSerialNums"
      :channel-ids="deleteChannelIds"
      @addDeviceHandler="confirmAddSkywatchDevice"
      @deleteDeviceHandler="confirmDeleteSkywatchDevice"/>

    <div class="table-container">
      <div class="device-title">
        <div class="header-sn">
          <el-checkbox v-model="checkAllDevice" class="header-checkbox" @change="changeIfCheckAllDevices"/>
          <div class="header-sn-name">{{ $t('deviceView.deviceSeriNum') }}</div>
        </div>
        <div class="header-name">{{ $t('deviceView.deviceName') }}</div>
        <div class="header-store">{{ $t('deviceView.store') }}</div>
        <div class="header-picture">
          <span>{{ $t('deviceView.thumbnail') }}</span>
        </div>
        <div class="header-status">{{ $t('deviceView.enableStatus') }}</div>
        <div class="header-operation">{{ $t('deviceView.operation') }}</div>
      </div>
      <div v-if="beseyeDevicesList.length > 0">
        <el-scrollbar id="el-menuscrollbar" style="height:100%;">
          <div :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
            <div
              v-for="(item,index) in beseyeDevicesList"
              :key="index"
              :class="!item.isClick ? 'noraml-color' : 'active-color'"
              class="device-data group-title"
              @click="clickSkywatchDevice(index,item)">
              <div class="data-sn titles">
                <el-checkbox v-model="item.isChecked" class="data-checkbox" @change="changeIfCheckDevice(item, index)"/>
                <div class="data-sn-name titles">
                  <span>{{ item.serialNumber }}</span>
                </div>
              </div>
              <div class="data-name titles">
                <span v-if="!item.isEditing">{{ item.name.length > 15 ? item.name.substr(0,15) + '...' : item.name }}</span>
                <el-input
                  v-if="item.isEditing"
                  v-model="item.tempDeviceName"
                  size="mini"
                  class="device-name-input"
                  @input="(val)=>deviceNameChange(val,item)"/>
              </div>
              <div class="data-store titles">
                <span>{{ item.store }}</span>
              </div>
              <div class="data-picture titles">
                <span v-if="item.tempUrl">
                  <el-image v-if="!isUpdate" :src="item.tempUrl" class="img-class">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"/>
                    </div>
                  </el-image>
                  <el-image v-else :src="`${item.tempUrl +'?'+Math.random()}`" class="img-class">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"/>
                    </div>
                  </el-image>
                </span>
                <span v-else class="img-class" style="display: inline-block;background: #cccc;">
                  <span style="color: #94a4b4;">{{ $t('deviceView.noImage') }}</span>
                </span>
                <el-upload
                  v-if="item.isEditing"
                  :before-upload="beforeAvatarUpload"
                  :on-change="handleEditChange"
                  class="upload-demo"
                  action=""
                  list-type="picture">
                  <el-button size="mini" type="primary">
                    <span class="edit-picture">{{ $t('deviceView.editImage') }}</span>
                  </el-button>
                </el-upload >
              </div>
              <div class="data-status titles">
                <el-switch
                  v-model="item.checkedStatus"
                  @change="updateChannelImage(item)"
                />
              </div>
              <div class="data-operation titles">
                <div v-if="item.isEditing" class="iconcontent">
                  <div class="iconlised" @click="confirmEditSkywatch(index,item)">
                    <i class="el-icon-check"/>
                  </div>
                  <div class="iconrised" @click="cancelEditSkywatch(index,item)">
                    <i class="el-icon-close"/>
                  </div>
                </div>
                <div v-if="!item.isEditing" class="iconcontent">
                  <div
                    class="iconlised normal-left-icon"
                    @click="editSkywatchDevice(index,item)">
                    <i class="iconfont icon-bianji"/>
                  </div>
                  <div
                    class="iconrised normal-right-icon"
                    @click="showDeleteSkywatchDeviceDialog(index,item)">
                    <i class="iconfont icon-shanchu"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="toolbar pagination" style="width:100%; margin-top:10px;">
          <el-pagination
            :page-size="sizeNum"
            :total="total"
            :current-page="page"
            style="text-align:right;margin-right:15px;"
            background
            small
            layout="jumper,total,prev,pager,next"
            @size-change="sizeChange"
            @current-change="currentChange"/>
        </div>
      </div>
      <div v-else class="no-data-container">{{ $t('deviceView.noData') }}</div>
    </div>
  </div>
</template>
<script>
  import { deviceRESTful, skywatchRESTful} from '@/api/index';
  import { getBriefStoreList } from '@/api/store';
  import filterString from '@/common/filterString';
  import util from '@/common/util';
  import lodash from 'lodash';
  import DeviceHeader from '../DeviceHeader';

  export default {
    name: 'SkywatchDeviceMgmt',
    components: { DeviceHeader },
    data() {
      return {
        total: 0,
        page: 1,
        sizeNum: 10,
        beseyeDevicesList: [],
        beseyeDevices: [],
        checkAllDevice: false,
        varWindowWidth: window.innerWidth,
        varyWindowHeight: window.innerHeight,
        curSkywatchItem: null,
        lang: this.$i18n.locale,
        storeDataList: [],
        allStoreDataList: [],
        file: '',
        isUpdate: false,
        avilableDeviceList: [],
        deleteSerialNums: [],
        deleteChannelIds: [],
        loadingData: true,
        deleteInfo: '',
        skywatchAccount: ''
      };
    },

    computed: {
      varyDivHeight: function() {
        if (this.varyWindowHeight > 800) {
          return this.varyWindowHeight * 0.58;
        } else if (this.varyWindowHeight > 700) {
          return this.varyWindowHeight * 0.45;
        } else {
          return this.varyWindowHeight * 0.526;
        }
      }
    },

    mounted() {
      this.setSkywatchAccount();
      this.getSkywatchDeviceList(this.setParams());
    },

    methods: {
      setParams() {
        const params = {
          'filter': {
            'page': this.page - 1,
            'size': this.sizeNum
          },
          'order': {
            'direction': 'asc',
            'property': 'name'
          },
          'clause': {
            'skywatchAccount': this.skywatchAccount
          }
        };
        return params;
      },

      setSkywatchAccount() {
        const rowDataJson = JSON.parse(sessionStorage.getItem('skywatchAccountInfo'));
        const rowData = rowDataJson.rowData;
        this.skywatchAccount = rowData.skywatchAccount;
      },

      changeIfCheckAllDevices(val) {
        this.beseyeDevicesList.forEach(item => {
          item.isChecked = val;
        });
      },

      changeIfCheckDevice(item, index) {
        let checkedDeviceNum = 0;
        this.beseyeDevicesList.forEach(item => {
          item.isChecked && checkedDeviceNum++;
        });
        const minSize = Math.min(this.total, this.sizeNum);
        this.checkAllDevice = checkedDeviceNum === minSize;
      },

      clickSkywatchDevice(index, item) {
        const self = this;
        item.isClick = true;
        self.curSkywatchItem = item;
        self.beseyeDevicesList.forEach((_item, _index) => {
          if (index !== _index) {
            _item.isClick = false;
          }
        });
      },

      handleEditChange(file, fileList) {
        const self = this;
        self.isUpdate = false;
        this.beseyeDevicesList.forEach(item => {
          if (item.isClick) {
            item.tempUrl = file.url;
            console.log(item.tempUrl);
          }
        });
        this.file = file.raw;
      },

      beforeAvatarUpload(file) {
        const fileName = file.name.split('.');
        const fileType = fileName[fileName.length - 1];
        const isJPEG = fileType === 'jpeg';
        const isJPG = fileType === 'jpg';
        const isPNG = fileType === 'png';
        const isLt60K = file.size / 1024 < 60;
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error(this.$t('deviceView.imgTypeInfo'));
          this.file = '';
          this.channelList.forEach(item => {
            if (item.isClick) {
              item.tempUrl = item.pictureUrl;
            }
          });
          return (isJPEG || isJPG || isPNG);
        } else if (!isLt60K) {
          this.$message.error(this.$t('deviceView.imgSizeInfo'));
          this.file = '';
          this.channelList.forEach(item => {
            if (item.isClick) {
              item.tempUrl = item.pictureUrl;
            }
          });
          return isLt60K;
        }
      },

      sizeChange(val) {
        const self = this;
        self.sizeNum = val;
        this.getSkywatchDeviceList(this.setParams());
      },

      currentChange(val) {
        const self = this;
        self.page = val;
        self.getSkywatchDeviceList(this.setParams());
      },


      async confirmUpdateChannle(index, item) {
        const self = this;
        self.isUpdate = false;
        const promiseArr = [];
        item.name !== item.tempDeviceName && promiseArr.push(skywatchRESTful.updateSkywatchDevice(
          {serialNumber: item.serialNumber, name: item.tempDeviceName}
          ));
        item.name = item.tempDeviceName;
        item.tempUrl !== item.pictureUrl && promiseArr.push(this.updateImage(item.id));
        const results = await Promise.all(promiseArr);
        results.forEach(result => {
          if (result.errCode !== 0) {
            throw Error(result.errMsg);
          }
        });
      },

      async updateChannelImage(item){
        try {
          let result = '';
          item.checkedStatus && item.status === 0 && ( result = await skywatchRESTful.enableSkywatchChannel(
            { deviceIds: [item.id] }) );
          !item.checkedStatus && item.status === 1 && (result = await skywatchRESTful.disableSkywatchChannel(
            { deviceIds: [item.id] }) );
          if (result.errCode === 0){
            util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
            this.getSkywatchDeviceList(this.setParams());
          } else {
            throw Error(result.errMsg);
          }

        } catch (error) {
          item.checkedStatus = item.status === 1;
          item.isEditing = false;
          util.setErrorMsg(error.message, false);
        }
      },

      updateImage(id){
        const fm = new FormData();
        fm.append('id', id);
        fm.append('picture', this.file);
        return deviceRESTful.attachImageToDevice(fm);
      },

      async getSkywatchDeviceList(params) {
        const self = this;
        self.beseyeDevices = [];
        self.beseyeDevicesList = [];
        const deviceResult = await skywatchRESTful.getSkywatchDeviceList(params);

        const errCode = deviceResult.errCode;
        const tempDevice = [];
        if (errCode === 0) {
          const data = deviceResult.data.content;
          data.forEach((item, index) => {
            const deviceObj = {};
            deviceObj.serialNumber = item.serialNumber;
            deviceObj.name = item.name;
            deviceObj.tempDeviceName = item.name;
            deviceObj.store = item.storeName;
            deviceObj.storeId = item.storeId;
            deviceObj.isEditing = false;
            deviceObj.isClick = false;
            deviceObj.isChecked = false;
            tempDevice.push(deviceObj);
          });
          self.loadingData = false;
          self.beseyeDevices = tempDevice;
          self.total = deviceResult.data.totalElements;
        }

        if (self.beseyeDevices.length !== 0) {
          self.channelData = await self.getSkywatchChannel();
          self.getDeviceThumbnails();
        } else {
          self.channelData = [];
          self.channelList = [];
        }
      },

      getSkywatchChannel() {
        const params = {};
        params.showDisabled = true;
        return new Promise((resolve, reject) => {
          deviceRESTful.getDeviceList(params).then(res => {
            const errCode = res.errCode;
            if (errCode === 0) {
              resolve(res.data);
            } else {
              reject(res.errorMsg);
            }
          }).catch(error => {
            reject(error);
          });
        });
      },

      getDeviceThumbnails() {
        const self = this;
        self.beseyeDevices.forEach(deviceItem => {
          self.channelData.forEach(channelItem => {
            if (channelItem.ivsId === deviceItem.serialNumber) {
              deviceItem.id = channelItem.id;
              deviceItem.channelId = channelItem.channelId;
              deviceItem.pictureUrl = channelItem.thumbnailUrl;
              deviceItem.tempUrl = channelItem.thumbnailUrl;
              deviceItem.status = channelItem.status;
              deviceItem.checkedStatus = channelItem.status === 1;
            }
          });
        });
        self.loadingData = false;
        self.beseyeDevicesList = lodash.cloneDeep(self.beseyeDevices);
      },

      editSkywatchDevice(index, item) {
        item.isEditing = true;
        this.beseyeDevicesList.forEach((_item, _index) => {
          if (index !== _index) {
            _item.isEditing = false;
          }
        });
      },

      async confirmEditSkywatch(index, item) {
        if (item.tempDeviceName.trim().length === 0) {
          util.notify(this.$t('deviceView.deviceNameEmpty'), 'warning', 3000);
          return false;
        }
        try {
          await this.confirmUpdateChannle(index, item);

          util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
          this.isEditing = false;
          this.getSkywatchDeviceList(this.setParams());
        }catch (error) {
          item.isEditing = false;
          util.setErrorMsg(error.message, false);
        }
      },

      cancelEditSkywatch(index, item) {
        item.isEditing = false;
        item.tempDeviceName = item.name;
        item.tempChannelCount = item.channelCount;
        this.isUpdate = false;
        item.isClick = false;
        item.tempUrl = item.pictureUrl;
        item.checkedStatus = item.status === 1;
        this.file = '';
      },

      showDeleteSkywatchDeviceDialog(index, item) {
        this.deleteSerialNums.push(item.serialNumber);
        this.deleteChannelIds.push(item.id);
        this.$refs.deviceHeader.deleteDeviceFromTable();
      },

      async confirmDeleteSkywatchDevice(deleteDeviceObj) {
        const { deleteParmas } = { ...deleteDeviceObj };
        try {
          const deleteResult = await skywatchRESTful.deleteSkywatchDevice(deleteParmas);
          if (deleteResult.errCode === 0) {
            util.notify(this.$t('deviceView.deleteSuccess'), 'success', 3000);
            const params = this.setParams();
            await this.getSkywatchDeviceList(params);
          } else {
            throw new Error(deleteResult.errMsg);
          }
        } catch (error) {
          util.notify(this.$t('deviceView.deleteFail'), 'warning', 3000);
          console.log('SkywatchDeviceMgmt-confirmDeleteSkywatchDevice: ' + error);
        }
    },

    setDeleteChannelParams() {
      const deleteChannelParmas = {};
      deleteChannelParmas.deviceIds = this.deleteChannelIds;
      return deleteChannelParmas;
    },

    setDeleteDeviceParmas() {
      const deleteParmas = {};
      deleteParmas.serialNumbers = this.deleteSerialNums;
      return deleteParmas;
    },

    deviceNameChange(val, item) {
      const comment = filterString.all(val, 20);
      item.tempDeviceName = comment;
    },

    async confirmAddSkywatchDevice(deviceAndChannelObj) {
      const { deviceParams } = { ...deviceAndChannelObj };
      try {
        const addDeviceResult = await skywatchRESTful.addSkywatchDevice(deviceParams);
        if (addDeviceResult.errCode === 0) {
          util.notify(this.$t('deviceView.addSuccess'), 'success', 3000);
          this.getSkywatchDeviceList(this.setParams());
        } else {
          throw new Error(addDeviceResult.errMsg);
        }
      } catch (error) {
        util.notify(this.$t('deviceView.addFailed'), 'warning', 3000);
        console.log('SkywatchDeviceMgmt-confirmAddSkywatchDevice: ' + error);
      }
    },

    validateParams(selectDevice) {
      let validate = false;
      if (selectDevice.length === 0) {
        util.notify(this.$t('deviceView.selectDevice'), 'warning', 3000);
        validate = false;
      } else {
        const noSelectStore = selectDevice.some(item => !item.storeId || item.storeId.length === 0);
        if (noSelectStore) {
          util.notify(this.$t('deviceView.selectBoundStore'), 'warning', 3000);
          validate = false;
        } else {
          selectDevice.map(item => {
            item.beseyeAccount = this.beseyeAccount;
          });
          validate = true;
        }
      }
      return validate;
    },

      filterStoreOption(value) {
        const storeList = lodash.cloneDeep(this.allStoreDataList);
        if (value) {
          const temp = [];
          const tempArray = [];
          const tempStoreList = [];
          storeList.forEach((_item) => {
            temp.push(util.getPinyinList(_item.label));
            tempStoreList.push(_item);
          });
          for (let i = 0; i < temp.length; i++) {
            if (temp[i][0].indexOf(value.trim()) !== -1 ||
              temp[i][1].indexOf(value.trim()) !== -1) {
              tempArray.push(tempStoreList[i]);
            }
          }
          this.storeDataList = tempArray;
        } else {
          this.storeDataList = storeList;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../../../assets/css/importfile.css';
  @import '../../../../assets/css/textstyle.css';
  @import '../../../../assets/sass/device';
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $tab: #7d8cad;
  $color: #4b5262;
  .noraml-color{
    color: $color;
    cursor: pointer;
  }
  .active-color{
    color: $mainColor !important;
    background-color: #fff;
  }
  .table-container{
    .device-title{
      height: 60px;
      line-height: 60px;
      display: flex;
      font-size: calc(14/1920*100vw);
      font-weight: bold;
      color: #909399;
      border-bottom: 1px solid $border;
      .header-checkbox{
        width: 10%;
      }
      .header-sn{
        width: 20%;
        display: flex;
      }
      .header-name{
        width: 20%;
      }
      .header-store{
        width: 20%;
      }
      .header-status{
        width: 10%;
      }
      .header-picture{
        width: 20%;
      }
      .header-operation{
        width: 10%;
      }
    }
    .device-data{
      overflow: hidden;
      display: flex;
      cursor: pointer;
      font-size: 14px;
      height: 90px;
      line-height: 90px;
      text-align: center;
      border-bottom: 1px solid #ddd;
      .proper-flag{
        height: 70%;
        width: 4px;
        background-color: $mainColor;
      }
      .nape-input{
        width: calc(160/1920*100vw);
        margin-left: 13%;
      }
      .data-checkbox{
        width: 10%;
      }
      .data-sn{
        width: 20%;
        display: flex;
        .data-sn-name{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .data-name{
        width: 20%;
      }
      .data-store{
        width: 20%;
      }
      .data-status{
        width: 10%;
      }
      .data-picture{
        width: 20%;
      }
      .data-operation{
        width: 10%;
      }
      .data-picture{
        height: 100%;
        display: inline-block;
        position: relative;
        .img-class{
          vertical-align: middle;
          text-align: center;
          line-height: 70px;
          height: 70px;
          width: calc(100/1920*100vw);
          display: inline-block;
          min-width: 85px;
          .no-image{
            display: inline-block;
            background: #cccc;
          }
          .no-image-span{
            font-size: calc(14/1920*100vw);
            color: #94a4b4;
          }
        }
        .upload-demo{
          position: absolute;
          bottom: 0;
          width: calc(100/1920*100vw);
          min-width: 85px;
          left: 50%;
          transform: translateX(-50%);
          /deep/ .el-upload{
            width: 100%;
          }
          /deep/ .el-button{
            width: calc(100/1920*100vw);
            height: 28px;
            opacity: 0.5;
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
          }
          /deep/ .el-button--mini{
            padding: 2px;
          }
        }
      }
    }
    .device-name-input{
      width: 80%;
      margin-left: calc(20/1920*100vw);
      position: relative;
      bottom: 2px;
    }
    .iconcontent{
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      .iconfont{
        font-size: calc(24/1920*100vw);
        color: $tab;
      }
      .iconlised{
        position: relative;
        background-color: $mainColor;
        padding: 1px 6px;
        color: #fff;
        border-width: 1px 1px 1px 1px;
        border-style: solid;
        border-color: #ddd;
        width:20px;
        height:23px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .iconrised{
        position: relative;
        padding: 1px 6px;
        border: 1px solid #ddd;
        border-left-width: 0px;
        background-color: rgba(255, 255, 255, 0);
        width:20px;
        height:23px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .normal-left-icon{
        border: none;
        background-color: #fff;
        color:#2c3e50;
        font-weight: normal
      }
      .normal-right-icon{
        border: none;
        color:#2c3e50;
        font-weight: normal
      }
    }
  }
</style>
<style>

  #importId .el-dialog__body{
    padding-top:0px !important;
  }
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-dialog__body{
    padding: 0px;
  }
  .el-dialog__body .dialog-content{
    overflow:hidden;
    width:100%;
  }
  .dialog-hr{
    border: 0.5px solid #dfe2e9;
  }
  .dialog-box{
    margin: 20px 20px 20px 26px;
  }
  .el-icon-warning{
    font-size:26px;
    margin-right:20px;
    color:#FF9803;
    display: inline-block;
    vertical-align: middle;
  }
  .warning-content{
    display: inline-block;
    vertical-align: middle;
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
<style>
  @import '../../../../assets/css/pagination.css';
  @import '../../../../assets/css/tabsItem.css';
  #el-menuscrollbar{
    height: calc(100% - 120px);
  }
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-dialog__body{
    padding: 0px;
  }
  .el-dialog__body .dialog-content .deviceForm{
    box-sizing: border-box;
    padding: 32px calc(40/1920*100vw) 0px calc(40/1920*100vw);
  }
  .el-dialog__body .dialog-content .deviceForm .picture-tips{
    display: inline;
    font-size: 12px;
    color: #fea316;
    position: relative;
    top: 30px;
    left: 30px;
  }
  .addDevice .el-dialog__footer{
    margin-top: 20px;
    line-height: 24px;
    padding-bottom: 30px;
  }
  .addDevice .rules{
    font-size: 10px;
    color:#ff2400;
    font-weight: 400;
    line-height: 10px;
    margin-top: 3px;
    display: block;
  }
  .el-dialog__body .dialog-content .deviceForm /deep/ label{
    padding: 0;
  }
  .available-span{
    font-size: calc(14/1920*100vw);
    color: #94a4b4;
  }
  .el-dialog__body .dialog-content .deviceForm .available-device-info{
    border-radius: 2px;
    background-color: #f7f8fb;
    border: 1px solid #dfe2e9;
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    max-height: 250px;
    overflow-y: scroll;
  }

  .available-devices{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 calc(20/1920*100vw) 10px;
  }
  .available-sn{
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-left: 20px;
  }
  .available-name{
    width: 160px;
    padding-left: 20px;
  }
  .available-store{
    padding-left: 20px;
    width: 160px;
  }
  .available-device-info .el-select .el-input--medium .el-input__inner{
    height: 35px;
    color: #94a4b4;
  }
  .el-dialog__body .dialog-content .deviceForm .main-device-info{
    background-color: #f6fbf9;
    border: 1px solid  #dfe3e9;
    padding: 20px calc(20/1920*100vw) 0;
  }
  .el-switch.is-checked .el-switch__core{
    border-color: #00FF00;
    background-color: #00FF00;
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

  .image-span{
    height: 70px;
    line-height: 70px;
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
  .el-icon-picture-outline{
    font-size: 16px;
  }
  .device-table{
    height: calc(100% - 60px);
    position: relative;
  }
  .device-table .el-table--mini{
    height: calc(100% - 92px);
    background: #f5f7fa;
  }
  .device-table .el-table__row{
    height: 60px;
    font-weight: 700;
    background: #f5f7fa;
  }
  .device-table .el-table__row .iconfont{
    font-weight: 400;
  }
  .device-table .el-table .cell{
    white-space: nowrap;
  }
  .device-table .el-table--enable-row-hover .el-table__body tr:hover > td{
    background-color: #fff;
  }
  .device-table .el-table__body tr.current-row > td{
    background-color: #fff;
    color: #f31d65;
  }
  .device-table .el-table__body tr.current-row .el-table-column--selection .cell {
    color: #fff;
    border-left: 4px solid #f31d65;
    line-height: 40px;
  }
  .device-table .el-table__body tr .el-table-column--selection .cell {
    color: #fff;
    border-left: 4px solid  rgba(255,255,255,0);
    line-height: 40px;
  }
  .device-table .account-header{
    height: 60px;
  }
  .device-table .el-table .cell{
    padding-left: calc(20/1920*100vw);
    padding-right: 0px;
  }
  .device-table .toolbar.pagination{
    bottom: 0;
    right: 0;
    height: auto;
    position: absolute;
    margin-right: calc(15/1920*100vw);
  }
  .el-table th.is-leaf:first-child{
    border-left: 4px solid  rgba(255,255,255,0);
  }
</style>
<style>
  .addDevice .el-dialog__footer{
    margin-top: 20px;
    line-height: 24px;
    padding-bottom: 30px;
  }
  .addDevice .rules{
    font-size: 10px;
    color:#ff2400;
    font-weight: 400;
    line-height: 10px;
    margin-top: 3px;
    display: block;
  }
  .el-dialog__body .dialog-content .deviceForm /deep/ label{
    padding: 0;
  }
  .available-span{
    font-size: calc(14/1920*100vw);
    color: #94a4b4;
  }
  .el-dialog__body .dialog-content .deviceForm .available-device-info{
    border-radius: 2px;
    background-color: #f7f8fb;
    border: 1px solid #dfe2e9;
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .available-device-info .el-select .el-input--medium .el-input__inner{
    height: 35px;
    color: #94a4b4;
  }
  .el-dialog__body .dialog-content .deviceForm .available-device-info .sn-class .cell{
    padding-left: 10px;
  }
  el-dialog__body .dialog-content .deviceForm .el-table-column--selection .cell{
    padding-left: 20px !important;
    padding-right: 5px !important;
  }
  .el-dialog__body .dialog-content .deviceForm .available-device-info .el-table .el-table__row{
    height: 35px;
  }
  .el-dialog__body .dialog-content .deviceForm .available-device-info .el-table__header-wrapper, .el-table__footer-wrapper{
    display: none;
  }
  .available-device-info .el-table-column--selection .cell{
    padding-left: 20px ;
    padding-right: 5px;
  }
  .available-device-info .el-table .cell{
    padding-left: 20px;
    color: #424151;
    font-size: calc(14/1920*100vw);
  }
  .el-dialog__body .dialog-content .deviceForm .main-device-info{
    background-color: #f6fbf9;
    border: 1px solid  #dfe3e9;
    padding: 20px calc(20/1920*100vw) 0;
  }
  .el-switch.is-checked .el-switch__core{
    border-color: #00FF00;
    background-color: #00FF00;
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

  .image-span{
    height: 70px;
    line-height: 70px;
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
  .el-icon-picture-outline{
    font-size: 16px;
  }
  .device-table{
    height: calc(100% - 60px);
    position: relative;
  }
  .device-table .el-table--mini{
    height: calc(100% - 92px);
    background: #f5f7fa;
  }
  .device-table .el-table__row{
    height: 60px;
    font-weight: 700;
    background: #f5f7fa;
  }
  .device-table .el-table__row .iconfont{
    font-weight: 400;
  }
  .device-table .el-table .cell{
    white-space: nowrap;
  }
  .device-table .el-table--enable-row-hover .el-table__body tr:hover > td{
    background-color: #fff;
  }
  .device-table .el-table__body tr.current-row > td{
    background-color: #fff;
    color: #f31d65;
  }
  .device-table .el-table__body tr.current-row .el-table-column--selection .cell {
    color: #fff;
    border-left: 4px solid #f31d65;
    line-height: 40px;
  }
  .device-table .el-table__body tr .el-table-column--selection .cell {
    color: #fff;
    border-left: 4px solid  rgba(255,255,255,0);
    line-height: 40px;
  }
  .device-table .account-header{
    height: 60px;
  }
  .device-table .el-table .cell{
    padding-left: calc(20/1920*100vw);
    padding-right: 0px;
  }
  .device-table .toolbar.pagination{
    bottom: 0;
    right: 0;
    height: auto;
    position: absolute;
    margin-right: calc(15/1920*100vw);
  }
  .el-table th.is-leaf:first-child{
    border-left: 4px solid  rgba(255,255,255,0);
  }
</style>

