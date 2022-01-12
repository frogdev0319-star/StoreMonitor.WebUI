<template>
  <div class="btn-col">
    <div class="flex-center margin-bottom-md">
      <div class="spacer"></div>
      <el-button
        class="storevue-button"
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
        size="mini"
        type="primary"
        class="storevue-button"
        @click="onShowDeleteDialogMethod"
      >
        <div class="btn-area">
          <i class="iconfont icon-shanchu"/>
          <span>{{ $t('deviceView.deleteDevice') }}</span>
        </div>
      </el-button>
    </div>
    <dialog-pop
      :is-form="true"
      v-if="showAddDeviceDialog"
      :title="$t('deviceView.addDevice')"
      :visible.sync="showAddDeviceDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      dialogWidth="520px"
      @cancelHandler="showAddDeviceDialog = false"
      @confirmHandler="confirmAddDevice">
      <div class="fullWidth padding">
        <div class="margin-bottom-sm">{{ $t('deviceView.availableDevice') }}</div>
        <div class="self-loading margin-bottom-sm" style="background-color: #fff;border: solid 1px #c3c4c5; padding: 16px; border-radius: 5px" v-loading="isLoadingAvailableDevice">
          <template v-if="avilableDeviceList.length > 0">
            <div class="flex-center" style="justify-content: space-between" v-for="(item, index) of avilableDeviceList" :key="index">
              <el-checkbox class="storevue-checkbox" v-model="item.checked"/>
              <span>{{ item.serialNumber }}</span>
              <span>{{ item.name }}</span>
              <el-select
                class="device-select"
                v-model="item.storeId"
                :filter-method="filterStoreOption"
                :placeholder="$t('deviceView.selectStore')"
                filterable
              >
                <el-option
                  v-for="item in storeDataList"
                  :key="item.storeId"
                  :label="item.label"
                  :value="item.storeId"/>
              </el-select>
            </div>
          </template>
          <template v-else>
            <div class="no-data-container">{{ $t('deviceView.noData') }}</div>
          </template>
        </div>
      </div>
    </dialog-pop>
    <dialog-pop
      v-if="showDeleteDialog"
      :visible.sync="showDeleteDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$t('deviceView.deleteDevice')"
      @cancelHandler="showDeleteDialog = false"
      @confirmHandler="confirmDeleteDevice">
      <div class="dialog-content">
        <hr class="dialog-hr">

        <p class="dialog-box">
          <i class="el-icon-warning"/>
          <span class="warning-content">{{ $t('deviceView.deleteDevice') }}</span>
        </p>
      </div>
    </dialog-pop>
  </div>
</template>

<script>
  import { getBriefStoreList } from '@/api/store';
  import { deviceRESTful, beseyeRESTful, skywatchRESTful} from '@/api/index';
  import util from '@/common/util';
import DialogPop from '@/components/DialogPop';

  export default {
    name: 'DeviceHeader',
    components: {
      DialogPop
    },
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
        showAddDeviceDialog: false,
        showDeleteDialog: false,
        avilableDeviceList: [],
        storeDataList: [],
        allStoreDataList: [],
        deleteSerialNums: [],
        deleteChannelIds: [],
        isLoadingAvailableDevice: false
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
        this.showAddDeviceDialog = true;
        this.isLoadingAvailableDevice = true;
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
        }).finally(() => {
          this.isLoadingAvailableDevice = false;
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
        }).finally(() => {
          this.isLoadingAvailableDevice = false;
        });
      },

      confirmAddDevice() {
        const deviceParams = {};
        const devcieArr = [];
        const channelArray = [];
        const selectDevice = this.avilableDeviceList.filter(item => item.checked === true);
        if (this.validateParams(selectDevice)) {
          selectDevice.forEach(item => {
            const accountName = this.vendor === 2 ? 'beseyeAccount' : 'skywatchAccount'

            const device = {
              name: item.name,
              storeId: item.storeId,
              serialNumber: item.serialNumber,
              mac: item.mac,
              [accountName]: this.account,
            };

            const channel = {
              name: item.name,
              storeId: item.storeId,
              ivsId: item.serialNumber,
              channelId: 1
            };
            devcieArr.push(device);
            channelArray.push(channel);
          });
          deviceParams.device = devcieArr;
          const channelParams = {};
          channelParams.device = channelArray;
          this.showAddDeviceDialog = false;
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

<style lang="scss" scoped>
</style>
