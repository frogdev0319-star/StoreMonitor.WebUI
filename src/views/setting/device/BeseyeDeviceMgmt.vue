<template>
  <div class="device-container">
    <div class="btn-col">
      <div class="operation-btns">
        <el-button
          class="el-add-btn btn-class"
          size="mini"
          type="primary"
          @click="showAddDialog"
        >
          <div class="btn-area">
            <i class="iconfont el-icon-plus"/>
            <span>{{ $t('deviceView.addDevice') }}</span>
          </div>
        </el-button>
        <el-button
          class="el-add-btn btn-class"
          size="mini"
          type="primary"
          @click="showDeleteDialogMethod"
        >
          <div class="btn-area">
            <i class="iconfont icon-shanchu"/>
            <span>{{ $t('deviceView.deleteDevice') }}</span>
          </div>
        </el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="device-title">
        <el-checkbox v-model="checkAllDevice" class="header-checkbox" @change="changeIfCheckAllDevices"/>
        <div class="header-sn">{{ $t('deviceView.deviceSeriNum') }}</div>
        <div class="header-name">{{ $t('deviceView.deviceName') }}</div>
        <div class="header-store">{{ $t('deviceView.store') }}</div>
        <div class="header-picture">
          <span>{{ $t('deviceView.thumbnail') }}</span>
        </div>
        <div class="header-operation">{{ $t('deviceView.operation') }}</div>
      </div>
      <el-scrollbar id="el-menuscrollbar" style="height:100%;">
        <div :style="{'max-height':varyDivHeight+'px','min-height':varyDivHeight+'px'}">
          <div
            v-for="(item,index) in beseyeData"
            :key="index"
            :class="!item.isClick ? 'noraml-color' : 'active-color'"
            class="device-data group-title"
            @click="clickBeseye(index,item)">
            <el-checkbox v-model="item.isChecked" class="data-checkbox" @change="changeIfCheckDevice(item, index)"/>
            <div class="data-sn titles">
              <span>{{ item.deviceSN }}</span>
            </div>
            <div class="data-name titles">
              <span v-if="!item.isEditing">{{ item.name.length>15?item.name.substr(0,15)+'...':item.name }}</span>
              <el-input
                v-if="item.isEditing"
                v-model="item.tempDeviceName"
                size="mini"
                class="nvr-input"
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
                <span style="font-size: 14px;color: #94a4b4;">{{ $t('deviceView.editImage') }}</span>
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
            <div class="data-operation titles">
              <div v-if="item.isEditing" class="iconcontent" style="top:15px;">
                <div class="iconlised" @click="confirmEditBeseye(index,item)">
                  <i class="el-icon-check"/>
                </div>
                <div class="iconrised" @click="cancelEditBeseye(index,item)">
                  <i class="el-icon-close"/>
                </div>
              </div>
              <div v-if="!item.isEditing" class="iconcontent">
                <div
                  class="iconlised"
                  style=" border: none; background-color: rgba(255, 255, 255, 0);
                color:#2c3e50; font-weight: normal"
                  @click="editBeseyeDevice(index,item)">
                  <i class="iconfont icon-bianji"/>
                </div>
                <div
                  class="iconrised"
                  style="border: none; color:#2c3e50;font-weight: normal"
                  @click="showDeleteDialog = true">
                  <i class="iconfont icon-shanchu"/>
                </div>
              </div>
            </div>
          </div>
          <el-dialog
            v-if="showDeleteDialog"
            :visible.sync="showDeleteDialog"
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$t('deviceView.deleteDevice')"
            width="510px"
            top="35vh"
            left="40vh">
            <div class="dialog-content" style="overflow:hidden;width:100%;">
              <hr style="border: 0.5px solid #dfe2e9;">

              <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
                <i
                  class="el-icon-warning"
                  style="font-size:26px;margin-right:20px;color:#FF9803;
                display: inline-block; vertical-align: middle"/>
                <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteDevice') }}</span>
              </p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteDialog = false">
                {{ $t('deviceView.cancle') }}</el-button>
              <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteBeseyeDevice()">
                {{ $t('deviceView.confirm') }}</el-button>
            </div>
          </el-dialog>
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

      <el-dialog
        v-if="showAddBeseyeDialog"
        :title="$t('deviceView.addDevice')"
        :visible.sync="showAddBeseyeDialog"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="610px"
        top="35vh"
        left="40vh"
        custom-class="addDevice"
      >
        <div class="dialog-content" style="overflow:hidden;width:100%;">
          <hr style="border: 0.5px solid #dfe2e9;">
          <div class="deviceForm">
            <span class="available-span">{{ $t('deviceView.availableDevice') }}</span>
            <div class="available-device-info">
              <el-table
                ref="availableDeviceTable"
                :data="avilableDeviceList"
                :cell-class-name="setSNCell"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column
                  type="selection"
                  width="45"/>
                <el-table-column
                  label="SN"
                  prop="serialNumber"
                  width="120"
                />
                <el-table-column
                  prop="name"
                  label="名称"
                  width="190"/>
                <el-table-column
                  prop="address"
                  label="门店"
                  width="170"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.storeId"
                      style="width: 100%;"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in storeDataList"
                        :key="item.storeId"
                        :label="item.label"
                        :value="item.storeId"/>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            class="file-cancel-btn"
            size="mini"
            style=""
            @click="showAddBeseyeDialog = false">{{ $t('deviceView.cancle') }}</el-button>
          <el-button
            class="file-confirm-btn"
            size="mini"
            type="primary"
            @click="confirmAddBeseyeDevice">{{ $t('deviceView.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { deviceRESTful } from '@/api/index';
import { mapMutations } from 'vuex';
import { getStoreList, getBriefStoreList } from '@/api/store';
import filterString from '@/common/filterString';
import { addBeseyeDevice, deleteBeseyeDevice, getBeseyeDeviceList, updateBeseyeDevice, getAvailableBeseyeDevice } from '@/api/beseye';
import util from '@/common/util';

export default {
  name: 'BeseyeDeviceMgmt',
  data() {
    return {
      beseye: {},
      activeName: 'beseyeVideo',
      total: 0,
      page: 1,
      sizeNum: 10,
      beseyeData: [{
        isChecked: false,
        isClick: false,
        isEditing: false,
        deviceSN: '123',
        name: 'test',
        tempDeviceName: 'test',
        store: '高新一店',
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F18%2F01%2F21%2F64cf5c9082beff8b349eca63c2456821.jpg%21%2Ffwfh%2F804x804%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1616637209&t=6e69f14f15a8f8380b6063909314a67f',
        tempUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F18%2F01%2F21%2F64cf5c9082beff8b349eca63c2456821.jpg%21%2Ffwfh%2F804x804%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1616637209&t=6e69f14f15a8f8380b6063909314a67f'
      }],
      checkAllDevice: false,
      accountId: '',
      varWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      curBeseyeItem: null,
      lang: this.$i18n.locale,
      showAddBeseyeDialog: false,
      addBeseyeData: { serialNumber: '', name: '', channelCount: 1, storeId: '' },
      storeDataList: [],
      editNvrChannelNumList: [], // 编辑NVR时的通道列表
      showDeleteDialog: false, // 删除NVR时的提示信息
      showDeleteChannel: false,
      showAddChannelDialog: false, // 是否显示增加通道对话框
      file: '',
      deleteChannelId: 0,
      isUpdate: false,
      avilableDeviceList: []
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
    const self = this;
    self.InitData();
    self.getBriefStoreData();
    this.setAccountId();
    const requestParam = this.setParams();
    this.getBeseyeDeviceList(requestParam);
    this.getAvailableBeseyeDevice();
  },
  methods: {
    setSNCell(row) {
      if (row.columnIndex === 1) {
        return 'sn-class';
      }
    },

    changeIfCheckAllDevices(val) {
      this.beseyeData.forEach(item => {
        item.isChecked = val;
      });
    },

    changeIfCheckDevice(item, index) {
      let checkedDeviceNum = 0;
      this.beseyeData.forEach(item => {
        item.isChecked && checkedDeviceNum++;
      });
      this.checkAllDevice = checkedDeviceNum === this.total;
    },

    handleChange(file, fileList) {
      this.addChannelData.pictureUrl = file.url;
      this.addChannelData.file = file;
      this.file = file.raw;
      console.log(this.addChannelData.pictureUrl);
    },

    handleEditChange(file, fileList) {
      const self = this;
      self.isUpdate = false;
      this.beseyeData.forEach(item => {
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
      console.log(fileType);
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
        if (this.showAddChannelDialog) {
          this.addChannelData.pictureUrl = '';
          this.addChannelData.file = '';
        }
        return (isJPEG || isJPG || isPNG);
      } else if (!isLt60K) {
        this.$message.error(this.$t('deviceView.imgSizeInfo'));
        this.file = '';
        this.channelList.forEach(item => {
          if (item.isClick) {
            item.tempUrl = item.pictureUrl;
          }
        });
        if (this.showAddChannelDialog) {
          this.addChannelData.pictureUrl = '';
          this.addChannelData.file = '';
        }
        return isLt60K;
      }
    },

    tableRowStyle({ row, rowIndex }) {
      return 'background-color: #FAFAFA;height:50px;font-size:14px; border-bottom: 1px solid #ddd;font-weight: bold;';
    },

    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #909399;font-weight: bold;height:48px;';
      }
    },

    clickBeseye(index, item) {
      const self = this;
      item.isClick = true;
      self.curBeseyeItem = item;
      self.beseyeData.forEach((_item, _index) => {
        if (index != _index) {
          _item.isClick = false;
        }
      });
    },

    sizeChange(val) {
      const self = this;
      self.sizeNum = val;
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      this.getBeseyeDeviceList(params);
    },

    currentChange(val) {
      const self = this;
      self.page = val;
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getBeseyeDeviceList(params);
    },

    deleteChannel(channelList) {
      const params = {
        deviceIds: channelList
      };
      return new Promise((resolve, reject) => {
        deviceRESTful.deleteDevice(params).then(res => {
          resolve(res);
        });
      });
    },
    deleteBeseye(params) {
      console.log(params);
      return new Promise((resolve, reject) => {
        deleteBeseyeDevice(params).then(res => {
          resolve(res);
        });
      });
    },
    addBeseye(params) {
      return new Promise((resolve, reject) => {
        addBeseyeDevice(params).then(res => {
          resolve(res);
        });
      });
    },
    addDevice(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.addDevice(params).then(resDevice => {
          resolve(resDevice);
        });
      });
    },

    confirmUpdateChannle(index, item) {
      const self = this;
      self.isUpdate = false;
      const params = {};
      params.id = item.id;
      params.name = item.name;
      let attachRes = {};

      deviceRESTful.updateDevice(params).then(async res => {
        console.log(res.data);
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg == 'Success') {
          if (item.tempUrl != item.pictureUrl) {
            // 获得增加通道的id,增加图片
            const fm = new FormData();
            fm.append('id', item.id);
            fm.append('picture', self.file);
            attachRes = await self.attachImageToDevice(fm);
            console.log(attachRes);
          }
          if (attachRes.errMsg === 'Success') {
            util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          }
          item.isClick = false;
          self.file = '';
        } else {
          util.notify(self.$t('deviceView.editFail'), 'warning', 3000);
        }
      }).catch(error => {
        console.log('BeseyeDeviceMgmt-confirmUpdateChannle: ' + error);
      });
    },

    getBeseyeDeviceList(params) {
      const self = this;
      getBeseyeDeviceList(params).then(res => {
        const errCode = res.errCode;
        const tempDevice = [];
        if (errCode === 0) {
          const data = res.data.content;
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
          });
          self.beseyeData = tempDevice;
          self.total = res.data.totalElements;
        }
      })
        .then(async() => {
          if (self.beseyeData.length !== 0) {
            self.channelData = await self.getBeseyeChannel();
            console.log(self.channelData);
            self.getDeviceThumbnails();
          } else {
            self.channelData = [];
            self.channelList = [];
          }
        }).catch(error => {
          console.log('BeseyeDeviceMgmt-getBeseyeDeviceList: ' + error);
        });
    },

    getBeseyeChannel() {
      return new Promise((resolve, reject) => {
        deviceRESTful.getDeviceList().then(res => {
          const errCode = res.errCode;
          console.log(res);
          if (errCode === 0) {
            resolve(res.data);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },

    getDeviceThumbnails() {
      const self = this;
      self.beseyeData.forEach(deviceItem => {
        self.channelData.forEach(channelItem => {
          if (channelItem.ivsId === deviceItem.serialNumber) {
            deviceItem.id = channelItem.id;
            deviceItem.channelId = channelItem.channelId;
            deviceItem.pictureUrl = channelItem.thumbnailUrl;
            deviceItem.tempUrl = channelItem.thumbnailUrl;
          }
        });
      });
    },

    async InitData() {
      const self = this;
      if (self.varyWindowHeight >= 760) {
        self.sizeNum = 20;
      } else {
        self.sizeChange = 10;
      }
      self.$store.dispatch('GetDash').then((res) => {
        const data = res.data;
        if (res.errMsg == 'Success' && res.errCode == 0) {
          self.beseye = data;
        }
      });
      const params = {
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getBeseyeDeviceList(params); // 获取Beseye数据信息
    },

    async getAllStoreList() {
      const self = this;
      const params = {
        'filter': {
          'page': 0,
          'size': 2000
        }
      };
      const retData = await self.getStoreData(params);
      const storeList = retData.data.content;
      self.storeList = storeList;
      const tempStore = [];
      storeList.forEach(item => {
        const obj = {
          storeId: item.storeId,
          label: item.name,
          value: item.name,
          userId: item.userId,
          userName: item.userName
        };
        tempStore.push(obj);
      });
      self.storeDataList = tempStore;
    },
    getBriefStoreData() {
      const self = this;
      getBriefStoreList().then(res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg == 'Success') {
          const storeList = res.data;
          self.storeList = storeList;
          const tempStore = [];
          storeList.forEach(item => {
            const obj = {
              storeId: item.storeId,
              label: item.name,
              value: item.name,
              userId: item.userId
            };
            tempStore.push(obj);
          });
          self.storeDataList = tempStore;
        }
      });
    },
    getStoreData(params) {
      const self = this;
      return new Promise((resolve, reject) => {
        getStoreList(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg == 'Success') {
            const data = res.data;
            resolve(res);
          }
        }).catch(res => {
          resolve(res);
        });
      });
    },

    // 增加单个Beseye
    addSingleBeseye() {
      const self = this;
      self.$refs['beseyeForm'].validate(async(valid) => {
        if (valid) {
          console.log(self.addBeseyeData);
          const beseyeParams = {};
          const beseyeArray = [];
          beseyeArray.push(self.addBeseyeData);
          beseyeParams.device = beseyeArray;
          const res1 = await self.addBeseye(beseyeParams);

          if (res1.errCode === 0) {
            self.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
            self.showAddBeseyeDialog = false;
          } else {
            self.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
            self.showAddBeseyeDialog = false;
          }
          self.addBeseyeData = { serialNumber: '', name: '', channelCount: 1, storeId: self.storeDataList[0].storeId };
          self.page = 1;
          const params = {
            'filter': {
              'page': self.page - 1,
              'size': self.sizeNum
            },
            'order': {
              'direction': 'asc',
              'property': 'name'
            }
          };
          self.getBeseyeDeviceList(params);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    attachImageToDevice(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.attachImageToDevice(params).then(resDevice => {
          resolve(resDevice);
        });
      });
    },

    editBeseyeDevice(index, item) {
      item.isEditing = true;
      this.beseyeData.forEach((_item, _index) => {
        if (index !== _index) {
          _item.isEditing = false;
        }
      });
    },

    showAddDialog() {
      this.showAddBeseyeDialog = true;
    },

    confirmEditBeseye(index, item) {
      const self = this;
      console.log(item);
      item.name = item.tempDeviceName;
      const params = {};
      params.serialNumber = item.serialNumber;
      params.name = item.tempDeviceName;
      if (params.name.trim().length === 0) {
        self.notify(self.$t('deviceView.deviceNameEmpty'), 'warning', 3000);
        return false;
      }
      updateBeseyeDevice(params).then(res => {
        console.log(res.data);
        item.isEditing = false;
      }).then(() => {
        self.confirmUpdateChannle(index, item);
      })
        .then(async() => {
          self.getBeseyeDeviceList(self.setParams());
        }).catch(error => {
          item.isEditing = false;
          console.log('BeseyeDeviceMgmt-confirmEditBeseye: ' + error);
        });
    },

    cancelEditBeseye(index, item) {
      item.isEditing = false;
      item.tempDeviceName = item.name;
      item.tempChannelCount = item.channelCount;
      this.isUpdate = false;
      item.isClick = false;
      item.tempUrl = item.pictureUrl;
      this.file = '';
    },

    showDeleteDialogMethod() {
      this.deleteSerialNums = [];
      const arr = [];
      const selectRows = this.beseyeData.filter(item => item.isChecked);
      selectRows.forEach(item => {
        arr.push(item.serialNumber);
      });
      this.deleteSerialNums = arr;
      if (this.deleteSerialNums.length === 0) {
        util.notify(this.$t('deviceView.emptyDeleteDevice'), 'warning', 3000);
        return false;
      } else {
        if (this.deleteSerialNums.length === 1) {
          this.deleteInfo = this.$t('deviceView.confirmDeleteDevice');
        } else {
          this.deleteInfo = this.$t('deviceView.confirmDeleteDevices');
        }
        this.showDeleteDialog = true;
      }
    },

    async deleteBeseyeDevice() {
      const self = this;
      self.showDeleteDialog = false;
      const channelList = self.beseyeData.filter(item => item.isChecked).map(x => x.id);
      console.log(channelList);
      const res1 = await self.deleteChannel(channelList);
      const deleteParmas = {};
      deleteParmas.serialNumbers = self.deleteSerialNums;
      const res2 = await self.deleteBeseye(deleteParmas);
      if (res1.errMsg === 'Success' && res2.errMsg === 'Success') {
        util.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
      } else {
        util.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
      }
      const params = self.setParams();
      self.getBeseyeDeviceList(params);
    },

    addBeseyeChannle(channelParams) {
      return new Promise((resolve, reject) => {
        deviceRESTful.addDevice(channelParams).then(resDevice => {
          resolve(resDevice);
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
    },

    deviceNameChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 20);
      console.log(comment);
      if (Object.keys(item).length == 0) {
        self.addBeseyeData.name = comment;
      } else {
        item.tempDeviceName = comment;
      }
      const length = filterString.getContentLength(val);
      if (length > 20) {
        this.deviceNameTip = true;
      } else {
        this.deviceNameTip = false;
      }
    },
    channelNameChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 20);
      console.log(comment);
      if (Object.keys(item).length == 0) {
        self.addChannelData.name = comment;
      } else {
        item.tempName = comment;
      }
      const length = filterString.getContentLength(val);
      if (length > 20) {
        this.channelNameRuletip = true;
      } else {
        this.channelNameRuletip = false;
      }
    },

    setParams() {
      const params = {
        'filter': {
          'page': this.page - 1,
          'size': this.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      return params;
    },

    getAvailableBeseyeDevice() {
      const params = {};
      params.accountId = this.accountId;
      getAvailableBeseyeDevice(params).then(res => {
        this.avilableDeviceList = res.errCode === 0 && res.data.length > 0 ? res.data : [];
      }).catch(error => {
        this.avilableDeviceList = [];
        console.log('EzvizDevice-getAvailableEzvizDevice-' + error);
      });
    },

    setAccountId() {
      const rowDataJson = JSON.parse(sessionStorage.getItem('beseyeUserInfo'));
      const rowData = rowDataJson.rowData;
      this.accountId = rowData.accountId;
    },

    async confirmAddBeseyeDevice() {
      const self = this;
      const deviceParams = {};
      const channelArray = [];
      const selectDevice = self.$refs.availableDeviceTable.selection;
      if (selectDevice.length === 0) {
        util.notify(self.$t('deviceView.selectDevice'), 'warning', 3000);
        return false;
      }
      selectDevice.forEach(item => {
        item.beseyeAccount = this.userId;
        if (item.storeId === '') {
          util.notify(self.$t('deviceView.selectBoundStore'), 'warning', 3000);
          return false;
        }
      });
      selectDevice.forEach(item => {
        const channel = {};
        channel.name = item.name;
        channel.storeId = item.storeId;
        channel.ivsId = item.serialNumber;
        channel.channelId = 1;
        channel.vendor = 2;
        channelArray.push(channel);
      });
      deviceParams.device = selectDevice;
      const res1 = await self.addBeseyeDevice(deviceParams);
      const channelParams = {};
      channelParams.device = channelArray;
      const res2 = await self.addBeseyeChannle(channelParams);
      if (res1.errCode === 0 && res2.errCode === 0) {
        util.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
        self.showAddDeviceDialog = false;
      } else {
        util.notify(self.$t('deviceView.addFailed'), 'success', 3000);
        self.showAddDeviceDialog = false;
      }
      self.getBeseyeDeviceList(self.setParams());
    },

    addBeseyeDevice(params) {
      return new Promise((resolve, reject) => {
        addBeseyeDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch((err) => {
          reject(err);
        });
      });
    }
  }
};
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
  $tab: #7d8cad;
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
    height: 60px;
    line-height: 60px;
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
    font-family: Roboto, Arial, Microsoft YaHei;
  }
  .noraml-color{
    color: #4b5262 !important;
    background-color: #FAFAFA;
    cursor: pointer;
    background-color: #f4f5f9;
  }
  .active-color{
    color: $mainColor !important;
    background-color: #fff;
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
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    min-width: calc(110/1920*100vw);
    min-width: 85px;
    min-height: 28px;
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
    border-right: 0;
    height: calc(36/1920*100vw);
    line-height: calc(36/1920*100vw);
    padding: 0 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    min-width: 85px;
    min-height: 28px;
    &:last-child{
      border-right: 1px solid;
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
    background-color: #FFF;
    .el-btns{
      height: calc(40/1920*100vw);
      position: relative;
      .btns{
        position: absolute;
        @include point(right,25);
        z-index: 979;
        width: calc(130/1920*100vw);
        height: calc(36/1920*100vw);
        font-size: calc(14/1920*100vw);
        padding: 0;
        top: 23px;
      }
    }
    .el-tabPanels{
      padding: 25px calc(25/1920*100vw) 0 calc(25/1920*100vw);
      height: auto;
      position: relative;
      bottom: calc(30/1920*100vw);
      .dialog-content{
        width: 100%;
      }
      .nvr-title .titles{
        color: $tab;
      }
      .titles{
        display: inline-block;
        span{
          position: relative;
          left: 20%;
        }
      }
      .beseye-content{
        text-align: left;
        position: relative;
        overflow: hidden;
        .details{
          @include point(height,50);
          @include point(line-height,50);
          @include point(padding-left,10);
          .beseye-label{
            width: 30%;
            float: left;
            min-width: 140px;
          }
          .beseye-input{
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
          height: calc(36/1920*100vw);
          width: calc(130/1920*100vw);
          padding: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          .el-icon-plus{
            font-size: calc(16/1920*100vw);
            padding: calc(5/1920*100vw) 0;
          }
          span{
            font-size: calc(14/1920*100vw);
            position: relative;
            bottom: calc(1/1920*100vw);
            @media screen and (max-width: 1280px) {
              bottom: 0;
            };
          }
          @media screen and (max-width: 1680px){
            width: 110px;
          }
        }
      }
      .lisde{
        background: #FAFAFA;
        height: auto;
        position: relative;
        .icon-filter{
          position: relative;
          left: 20%;
          cursor: pointer;
        }
        .nvr-title{
          @include titleStyle;
          @media screen and (min-width: 1366px) {
            font-size: 14px;
          }
          @media screen and (max-width: 1366px) {
            font-size: 12px;
          }
          .name-title{
            width: 25%;
          }
          .store-title{
            width: 35%;
          }
          .count-title{
            width: 20%;
          }
          .operation-title{
            width: 15%;
          }
          .en-name-title{
            width: 27%;
          }
          .en-store-title{
            width: 28%;
          }
          .en-count-title{
            width: 30%;
          }
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
            @include point(width,100);
            margin-left: 13%;
            position: relative;
            bottom: 2px;
          }
          .nvr-select{
            @include point(width,60);
            position: relative;
            bottom: 2px;
            left:20px;
            /deep/ .el-input--suffix .el-input__inner{
              padding: 10px;
            }
          }
          .name-data{
            width: 25%;
            height: 100%;
            span{
              display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .store-data{
            width: 35%;
            height: 100%;
            position: absolute;
            /*left: 27%;*/
            span{
              display: inline-block;
              width: 70%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .count-data{
            width: 20%;
            height: 100%;
            position: absolute;
            left: 60%;
            span{
              display: inline-block;
              width: 70%;
              margin-left:15px;
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
            width: 17%;
            height: 100%;
            position: absolute;
            left: 83%;
            .iconcontent{
              position: absolute;
              cursor: pointer;
              display: inline-block;
              display: inline-flex;
              align-items: center;
              .iconfont{
                font-size: calc(24/1920*100vw);
                color: $tab;
              }
              .iconlised{
                // float: left;
                // position: relative;
                background-color: $mainColor;
                padding: 1px 6px;
                color: #fff;
                border-width: 1px 1px 1px 1px;
                border-style: solid;
                border-color: #ddd;
                width:20px;
                height:23px;
              }
              .iconrised{
                // float: left;
                // position: relative;
                padding: 1px 6px;
                border-width: 1px 1px 1px 0px;
                border-style: solid;
                border-color: #ddd;
                background-color: rgba(255, 255, 255, 0);
                width:20px;
                height:23px;
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
            width: 26%;
          }
          .nape-picture-title{
            width: 25%;
          }
          .nape-handle-title{
            width: 15%;
          }
        }
        .nape-items-title .titles, en-nape-items-title .titles{
          color: $tab;
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
        .nape-items-data{
          overflow: hidden;
          position: relative;
          padding-left: 1%;
          cursor: pointer;
          font-size: 14px;
          height: 90px;
          line-height: 90px;
          //border-bottom: 1px solid red;
          text-align: left;
          .nape-input{
            width: calc(160/1920*100vw);
            margin-left: 13%;
          }
          .nape-name-data{
            width: 30%;
            display: inline-block;
            position: relative;
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
            width: 28%;
            display: inline-block;
            position: relative;
            span{
              margin-left: 20%;
            }
          }
          .nape-picture-data{
            width:26%;
            height: 100%;
            display: inline-block;
            position: relative;
            left: 1%;
            .img-class{
              //height: 90%;
              vertical-align: middle;
              text-align: center;
              line-height: 70px;
              height: 70px;
              width: calc(100/1920*100vw);
              display: inline-block;
              min-width: 85px;
            }
            .upload-demo{
              position: absolute;
              bottom: 0;
              width: calc(100/1920*100vw);
              min-width: 85px;
              transform: translateX(-100px);
              left: 50%;
              /deep/ .el-upload{
                width: 100%;
              }
              /deep/ .el-button{
                width: calc(100/1920*100vw);
                height: 28px;
                opacity: 0.5;
                position: absolute;
                bottom: 10px;
                left: 0;
              }
              /deep/ .el-button--mini{
                padding: 2px;
              }
            }
          }
          .nape-items-handle{
            width: 12%;
            display: inline-block;
            .iconfont{
              font-size: calc(24/1920*100vw);
              color: $tab !important;
            }
          }
        }

      }
    }
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
      }
      .header-name{
        width: 20%;
      }
      .header-store{
        width: 20%;
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
      }
      .data-name{
        width: 20%;
      }
      .data-store{
        width: 20%;
      }
      .data-picture{
        width: 20%;
      }
      .data-operation{
        width: 10%;
      }
      .nape-name-data{
        width: 30%;
        display: inline-block;
        position: relative;
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
        width: 28%;
        display: inline-block;
        position: relative;
        span{
          margin-left: 20%;
        }
      }
      .data-picture{
        width: 20%;
        height: 100%;
        display: inline-block;
        position: relative;
        .img-class{
          //height: 90%;
          vertical-align: middle;
          text-align: center;
          line-height: 70px;
          height: 70px;
          width: calc(100/1920*100vw);
          display: inline-block;
          min-width: 85px;
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
        // float: left;
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
        // float: left;
        position: relative;
        padding: 1px 6px;
        border-width: 1px 1px 1px 0px;
        border-style: solid;
        border-color: #ddd;
        background-color: rgba(255, 255, 255, 0);
        width:20px;
        height:23px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
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
  .el-dialog__body .dialog-content .beseyeForm{
    width: 90%;
    margin: 0 auto;
  }
  .el-dialog__body .dialog-content .beseyeForm .picture-tips{
    display: inline;
    font-size: 12px;
    color: #fea316;
    position: relative;
    top: 30px;
    left: 30px;
  }
  .addBeseye .el-dialog__footer{
    margin-top: 20px;
    line-height: 24px;
  }
  .addBeseye .rules{
    font-size: 10px;
    color:#ff2400;
    font-weight: 400;
    line-height: 10px;
    margin-top: 3px;
    display: block;
  }
  .el-dialog__body .dialog-content .beseyeForm /deep/ label{
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
  .image-class{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
    border: 1px dashed #7d8cad;
  }
  .el-image__inner{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
  }
  .image-slot{
    height: calc(70/1920*100vw);
    width: calc(100/1920*100vw);
    color: #7d8cad;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
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
<style lang="scss">
  @import '../../../assets/css/importfile.css';
  @import '../../../assets/sass/device.scss';
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
  .el-dialog__body .dialog-content .deviceForm .available-device-info  .el-checkbox__inner{
    transform: scale(1.5, 1.5);
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

  .image-class{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
    border: 1px dashed #7d8cad;
  }
  .el-image__inner{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
  }
  .image-slot{
    height: 70px;
    width: calc(100/1920*100vw);
    min-width: 85px;
    color: #7d8cad;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
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
  .device-table .el-checkbox__inner{
    transform: scale(1.5, 1.5);
  }
  .device-table .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #fff;
    border-color: #DCDFE6;
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
