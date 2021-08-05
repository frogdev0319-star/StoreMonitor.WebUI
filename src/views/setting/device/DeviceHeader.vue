<template>
  <div class="btn-col">
    <div class="operation-btns">
      <el-button
        class="el-add-btn btn-class"
        size="mini"
        type="primary"
        @click="onShowAddBeseyeDeviceDialog"
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
        @click="onShowDeleteDialogMethod"
      >
        <div class="btn-area">
          <i class="iconfont icon-shanchu"/>
          <span>{{ $t('deviceView.deleteDevice') }}</span>
        </div>
      </el-button>
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
      <div class="dialog-content">
        <hr class="dialog-hr">
        <div class="deviceForm">
          <span class="available-span">{{ $t('deviceView.availableDevice') }}</span>
          <div class="available-device-info">
            <template v-if="avilableDeviceList.length > 0">
              <div v-for="(item, index) of avilableDeviceList" :key="index" class="available-devices">
                <div class="available-checkbox">
                  <el-checkbox v-model="item.checked"/>
                </div>
                <div class="available-sn">
                  <span>{{ item.serialNumber }}</span>
                </div>
                <div class="available-name">
                  <span>{{ item.name }}</span>
                </div>
                <div class="available-store">
                  <el-select
                    v-model="item.storeId"
                    :filter-method="filterStoreOption"
                    :placeholder="$t('deviceView.selectStore')"
                    style="width: 100%;"
                    filterable
                  >
                    <el-option
                      v-for="item in storeDataList"
                      :key="item.storeId"
                      :label="item.label"
                      :value="item.storeId"/>
                  </el-select>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-data-container">{{ $t('deviceView.noData') }}</div>
            </template>
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
          @click="confirmAddDevice">{{ $t('deviceView.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="showDeleteDialog"
      :visible.sync="showDeleteDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$t('deviceView.deleteDevice')"
      width="510px"
      top="35vh"
      left="40vh">
      <div class="dialog-content">
        <hr class="dialog-hr">

        <p class="dialog-box">
          <i class="el-icon-warning"/>
          <span class="warning-content">{{ $t('deviceView.deleteDevice') }}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteDialog = false">
          {{ $t('deviceView.cancle') }}</el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="confirmDeleteDevice()">
          {{ $t('deviceView.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getBriefStoreList } from '@/api/store';
  import { deviceRESTful, beseyeRESTful, skywatchRESTful} from '@/api/index';
  import util from '@/common/util';

  export default {
    name: 'DeviceHeader',
    props: {
      vendor: {
        type: Number,
        default: 2
      },
      account: {
        type: String,
        default: ''
      },
      deviceList: {
        type: Array,
        default: () => []
      },
      serialNums: {
        type: Array,
        default: () => []
      },
      channelIds: {
        type: Array,
        default: () => []
      }
    },

    data(){
      return {
        showAddBeseyeDialog: false,
        showDeleteDialog: false,
        avilableDeviceList: [],
        storeDataList: [],
        allStoreDataList: [],
        deleteSerialNums: [],
        deleteChannelIds: []
      }
    },

    mounted() {
      this.getBriefStoreData();
    },

    methods:{
      getBriefStoreData() {
        const self = this;
        getBriefStoreList().then(res => {
          const errCode = res.errCode;
          if (errCode === 0) {
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
            self.allStoreDataList = tempStore;
          }
        });
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
      },

      async onShowAddBeseyeDeviceDialog() {
        this.vendor === 2 ? await this.getAvailableBeseyeDevice() : await this.getAvailableSkywatchDevice();
        this.showAddBeseyeDialog = true;
      },

      getAvailableBeseyeDevice() {
        const params = {};
        params.beseyeAccount = this.account;
        beseyeRESTful.getAvailableBeseyeDevice(params).then(res => {
          const avilableDevices = res.errCode === 0 && res.data.length > 0 ? res.data : [];
          avilableDevices.forEach(item => { item.checked = false; });
          this.avilableDeviceList = [...avilableDevices];
        }).catch(error => {
          this.avilableDeviceList = [];
          console.log('BeseyeDeviceMgmt-getAvailableEzvizDevice: ' + error);
        });
      },

      getAvailableSkywatchDevice(){
        const params = {};
        params.skywatchAccount = this.account;
        skywatchRESTful.getAvailableSkywatchDevice(params).then(res => {
          const avilableDevices = res.errCode === 0 && res.data.length > 0 ? res.data : [];
          avilableDevices.forEach(item => { item.checked = false; });
          this.avilableDeviceList = [...avilableDevices];
        }).catch(error => {
          this.avilableDeviceList = [];
          console.log('BeseyeDeviceMgmt-getAvailableEzvizDevice: ' + error);
        });
      },

      confirmAddDevice() {
        const deviceParams = {};
        const channelArray = [];
        const selectDevice = this.avilableDeviceList.filter(item => item.checked === true);
        if (this.validateParams(selectDevice)) {
          selectDevice.forEach(item => {
            const channel = {};
            channel.name = item.name;
            channel.storeId = item.storeId;
            channel.ivsId = item.serialNumber;
            channel.channelId = 1;
            channelArray.push(channel);
          });
          deviceParams.device = selectDevice;
          const channelParams = {};
          channelParams.device = channelArray;

          this.$emit('addDeviceHandler', {deviceParams, channelParams})
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

      onShowDeleteDialogMethod() {
        this.deleteSerialNums = [];
        this.deleteChannelIds = [];
        const deviceSerialsArr = [];
        const channelIdsArr = [];
        const selectRows = this.deviceList.filter(item => item.isChecked);
        selectRows.forEach(item => {
          deviceSerialsArr.push(item.serialNumber);
          channelIdsArr.push(item.id);
        });
        this.deleteSerialNums = deviceSerialsArr;
        this.deleteChannelIds = channelIdsArr;
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

      async confirmDeleteDevice() {
        const deleteChannelParmas = this.setDeleteChannelParams();
        const deleteParmas = this.setDeleteDeviceParmas();
        this.$emit('deleteDeviceHandler', {deleteChannelParmas, deleteParmas });
        this.showDeleteDialog = false;
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

      deleteDeviceFromTable(){
        this.deleteChannelIds = this.channelIds;
        this.deleteSerialNums = this.serialNums;
        this.showDeleteDialog = true;
      },
    }
  };
</script>

<style scoped>

</style>
