<template>
  <div class="el-device paper">
    <div class="account-title">
      <span>{{ accountSettingMsg }}—{{ ezvizAccount }}</span>
    </div>
    <div class="device-content">
      <el-col :span="lang === 'en' && varWindowWidth < 1920 ? 11 : 11" class="lisde">
        <div class="flex-center padding" style="border-top: 1px solid rgba(172, 174, 177, .34);border-bottom: 1px solid rgba(172, 174, 177, .34);">
          <span>{{ $t('deviceView.deviceInfo') }}</span>
          <div class="spacer"></div>
          <el-button
            :disabled="tableData.length === 0"
            class="storevue-button-outlined"
            size="mini"
            type="primary"
            @click="showDeleteDialogMethod(0)"
          >
            <div class="btn-area">
              <span>{{ $t('deviceView.deleteDevice') }}</span>
            </div>
          </el-button>
          <el-button
            :class=" lang === 'en' ? 'en-el-add-btn' : 'el-add-btn'"
            class="storevue-button-outlined"
            size="mini"
            type="primary"
            @click="showAddDialog"
          >
            <div class="btn-area">
              <i class="iconfont el-icon-plus"/>
              <span>{{ $t('deviceView.addDevice') }}</span>
            </div>
          </el-button>
        </div>
        <div class="spacer" style="background-color:#f7f9fa">
          <table-pagination
            ref="ezvizDeviceTable"
            :column-data="columnData"
            :table-data="tableData"
            :table-operation ="columnOperationData"
            :if-set-cell-style="false"
            :header-class="accountHead"
            :cell-class="accountCell"
            :row-class="accountRow"
            :show-border="false"
            :show-selection-column="true"
            :is-stripe = "false"
            :is-device="true"
            :total="total"
            :table-height="varyDivHeight"
            :is-loading-data="isLoadingData"
            :show-pagination="false"
            class="device-table"
            headerBorder="rgba(172, 174, 177, .34)"
            bodyBorder="rgba(172, 174, 177, .34)"
            @handleOperation="handleEmitOperation"
            @emitRowClick="handleEmitRowClick"
            @handleEdit="handleEmitEdit"
          />
          <tbl-pagination-only
            :btn-style="{backgroundColor:'transparent'}"
            :total="total"
            :current-page="page"
            :page-size="sizeNum"
            layout = "prev,pager, next,sizes,slot"
            @sizeChange="handlePageAndSizeChange"
            @currentChange="handlePageAndSizeChange"
          />
      </div>
      </el-col>
      <el-col :span="lang === 'en' && varWindowWidth < 1920? 13: 13" class="risde">
        <div class="flex-center padding" style="border-top: 1px solid rgba(172, 174, 177, .34);border-bottom: 1px solid rgba(172, 174, 177, .34);">
          <span>{{ $t('deviceView.deviceDetail') }}</span>
          <div class="spacer"></div>
          <el-button
            :disabled="channelBtnDisabled"
            type="primary"
            size="mini"
            class="storevue-button-outlined"
            @click="addNewChannel">
            <i class="iconfont el-icon-plus"/><span>{{ $t('deviceView.addChannel') }}</span>
          </el-button>
        </div>
        <div class="flex-center" style="color: #7d8cad;font-weight: 600;font-size: calc(14/1920*100vw);height:25px;border-bottom:1px solid rgba(172, 174, 177, .34)">
          <div class="spacer">
            {{ $t('deviceView.devChannelNum') }}
          </div>
          <div class="spacer">
            {{ $t('deviceView.channelName') }}
          </div>
          <div class="spacer">
            {{ $t('deviceView.enableStatus') }}
          </div>
          <div class="spacer">
          </div>
        </div>
        <div style="height: calc(100vh - 350px); overflow: auto;">
          <div
            v-for="(item,index) in channelList"
            :style="item.isClick ? {'background-color':'#FEE4E7'} : {}"
            :key="index"
            class="nape-items-data">
            <div class="nape-dep-data">
              <span v-if="item.id !== 0 " class="nape-dep">{{ item.channelId }}</span>
              <el-select
                v-if="item.id === 0"
                v-model="item.channelId"
                :placeholder="$t('deviceView.selectDeviceChannel')"
                size="mini"
                class="nvr-select"
                style="margin-left: 10%">
                <el-option
                  v-for="numList in newChannelNumList"
                  :key="numList.value"
                  :label="numList.label"
                  :value="numList.value"
                  :disabled="numList.disabled"/>
              </el-select>
            </div>
            <div class="nape-name-data">
              <span v-if="!item.isClick" class="nape-name">
                {{ item.name.length > 15 ? item.name.substr(0,15) + '...' : item.name }}
              </span>
              <el-input
                v-if="item.isClick"
                v-model="item.tempName"
                :placeholder="$t('deviceView.inputInspectName')"
                size="mini"
                class="nape-input input-details"
                @input="(val)=>channelNameChange(val,item)"/>
            </div>
            <div class="nape-enable-handle">
              <el-switch
                v-model="item.checkedStatus"
                @change="updateChannelImage(item)"
              />
            </div>
            <div class="nape-items-handle">
              <div v-if="item.isClick" class="iconcontent">
                <div class="iconlised" @click="confrimEditEzvizChannle(index,item)">
                  <i class="el-icon-check"/>
                </div>
                <div class="iconrised" @click="cancelEditEzvizChannle(index,item)">
                  <i class="el-icon-close"/>
                </div>
              </div>
              <div v-if="!item.isClick" class="icon-list">
                <img 
                  :src="`../../static/img/table-edit.png`" 
                  @click="handleEdit(index,item)"
                  height="26px" />
                <i
                  v-if="curEzvizItem.addedMethod === 2"
                  class="iconfont icon-shanchu"
                  style="cursor:pointer;margin-right:10px;"
                  @click="handleDelete(index, item)"/>
              </div>
            </div>
          </div>
        </div>
        <dialog-pop
          :is-form="true"
          :title="$t('deviceView.addDevice')"
          :append-to-body="true"
          :close-on-click-modal="false"
          :isWarning="true"
          :visible="showAddChannelDialog"
          :confirm-context="$t('deviceView.addChannel')"
          :show-close="false"
          dialog-width="510px"
          @cancelHandler="showAddChannelDialog = false"
          @confirmHandler="addSingleChannel">
          <div class="form-slot">
            <el-form
              ref="channelForm"
              :model="addChannelData"
              :rules="channelRules"
              class="deviceForm"
              label-position="top"
              size="mini">
              <el-form-item style="margin-bottom: 20px;">
                <el-col :span="24">
                  <el-form-item :label="$t('deviceView.channelName')" prop="name" style="margin-bottom:0;">
                    <el-input
                      v-model="addChannelData.name"
                      style="width: 100%;"
                      @input="(val)=>channelNameChange(val,{})"
                      @blur="notShowInputRuleTips('channelName')"/>
                    <span v-if="channelNameRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="$t('deviceView.devChannelNum')" prop="channelId">
                    <el-select v-model="addChannelData.channelId" size="mini">
                      <el-option
                        v-for="numList in newChannelNumList"
                        :key="numList.value"
                        :label="numList.label"
                        :value="numList.value"
                        :disabled="numList.disabled"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </dialog-pop>
        <el-dialog
          v-if="showDeleteChannel"
          :title="$t('deviceView.prompt')"
          :visible.sync="showDeleteChannel"
          :append-to-body="true"
          :close-on-click-modal="false"
          :show-close="false"
          width="610px"
          top="35vh"
          left="40vh">
          <div class="dialog-content" style="overflow:hidden;width:100%;">

            <p style="margin-left:25px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
              <i
                class="el-icon-warning"
                style="font-size:26px;margin-right:20px;
              color:#FF9803;display: inline-block; vertical-align: middle"/>
              <span style="display: inline-block; vertical-align: middle">{{ $t('deviceView.deleteChannel') }}</span>
            </p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteChannel = false">
              {{ $t('deviceView.cancle') }}
            </el-button>
            <el-button class="file-confirm-btn" size="mini" type="primary" @click="deleteSingleChannel()">
              {{ $t('deviceView.confirm') }}
            </el-button>
          </div>
        </el-dialog>
      </el-col>
    </div>
    <dialog-pop
      :is-form="true"
      :title="$t('deviceView.addDevice')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :isWarning="true"
      :visible="showAddDeviceDialog"
      :confirm-context="$t('deviceView.confirm')"
      :show-close="false"
      dialog-width="510px"
      @cancelHandler="showAddDeviceDialog = false"
      @confirmHandler="addEzvizDeviceBasedForm">
      <div class="form-slot">
        <el-form
          ref="deviceForm"
          :model="addDeviceData"
          :rules="rules"
          class="deviceForm"
          label-position="top"
          size="mini">
          <el-form-item v-if="accountScope === 1" label="" prop="deviceType">
            <el-select v-model="deviceType" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in deviceTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <div v-if="accountScope === 1 && deviceType === 1">
            <span class="available-span">{{ $t('deviceView.availableDevice') }}</span>
            <div v-if="deviceType === 1" class="available-device-info">
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
          <div v-else>
            <el-form-item style="margin-bottom: 20px;">
              <el-col :span="13">
                <el-form-item :label="$t('deviceView.serialNum')" prop="serialNumber" style="margin-bottom:0;">
                  <el-input
                    v-model="addDeviceData.serialNumber"
                    style="width: 100%;"
                    @input="(val)=>serialNumberChange(val)"
                    @blur="notShowInputRuleTips('serialNum')"/>
                  <span v-if="serialRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="deviceType !== 2" :span="9" :offset="2">
                <el-form-item :label="$t('deviceView.validationCode')" prop="validationCode">
                  <el-input
                    v-model="addDeviceData.validationCode"
                    style="width: 100%;"
                    @input="validateCodeChange"
                    @blur="notShowInputRuleTips('validationCode')"/>
                  <span v-if="validateRuletip" class="rules">{{ $t('deviceView.validateRuletip') }}</span>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;">
              <el-col :span="deviceType === 0 || accountScope === 0 ? 24: 13">
                <el-form-item :label="$t('deviceView.deviceName')" prop="name" style="margin-bottom:0;">
                  <el-input
                    v-model="addDeviceData.name"
                    style="width: 100%;"
                    @input="deviceNameChange"
                    @blur="notShowInputRuleTips('deviceName')"/>
                  <span v-if="deviceRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
                </el-form-item>
              </el-col>
              <el-col v-if="deviceType !== 0 && accountScope !== 0" :span="9" :offset="2">
                <el-form-item :label="$t('deviceView.deviceChannelNum')" prop="channelCount">
                  <el-select v-model="addDeviceData.channelCount" size="mini">
                    <el-option
                      v-for="numList in channelNumList"
                      :key="numList.value"
                      :label="numList.label"
                      :value="numList.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('deviceView.store')" prop="storeId">
              <el-select
                v-model="addDeviceData.storeId"
                :filter-method="filterStoreOption"
                filterable
                style="width: 100%;">
                <el-option
                  v-for="item in storeDataList"
                  :key="item.storeId"
                  :label="item.label"
                  :value="item.storeId"/>
              </el-select>
              <span class="add-label" style="color: #f7d057; display: block">
                <span style="margin-right: 10px;font-size: 12px;">*</span>
                {{ $t('deviceView.selectStoreInfo') }}
              </span>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </dialog-pop>
    
    <dialog-pop
      :is-form="true"
      :title="$t('deviceView.editDevice')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :isWarning="true"
      :visible="showEditDeviceDialog"
      :confirm-context="$t('deviceView.confirm')"
      :show-close="false"
      dialog-width="510px"
      @cancelHandler="showEditDeviceDialog = false"
      @confirmHandler="confirmEditDialog">
      <div class="form-slot">
        <el-form>
          <el-form-item :label="$t('deviceView.serialNum')" prop="serialNumber" style="margin-bottom:0;">
            <el-input
              v-model="editingDevice.serialNumber"
              disabled
              @input="(val)=>serialNumberChange(val)"
              @blur="notShowInputRuleTips('serialNum')"/>
            <span v-if="serialRuletip" class="rules">{{ $t('deviceView.NvrnameRuletip') }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceView.channelName')" prop="name" style="margin-bottom:0;">
            <el-input
              v-model="editingDevice.name"
            />
          </el-form-item>
          <el-form-item :label="$t('deviceView.store')" prop="storeId">
            <el-select
              v-model="editingDevice.storeId"
              :filter-method="filterStoreOption"
              filterable
              disabled
              style="width: 100%;">
              <el-option
                v-for="item in storeDataList"
                :key="item.storeId"
                :label="item.label"
                :value="item.storeId"/>
            </el-select>
            <span class="add-label" style="color: #f7d057; display: block">
              <span style="margin-right: 10px;font-size: 12px;">*</span>
              {{ $t('deviceView.selectStoreInfo') }}
            </span>
          </el-form-item>
        </el-form>
      </div>
    </dialog-pop>
    <dialog-pop
      :is-form="true"
      :title="$t('deviceView.editDevice')"
      :append-to-body="true"
      :close-on-click-modal="false"
      :isWarning="true"
      :visible="showEditChannelDialog"
      :confirm-context="$t('deviceView.confirm')"
      :show-close="false"
      dialog-width="510px"
      @cancelHandler="showEditChannelDialog = false"
      @confirmHandler="confirmEditDialog">
      <div class="form-slot">
        <el-form>
          <el-form-item :label="$t('deviceView.channelName')" prop="name" style="margin-bottom: 20px;">
            <el-input
              v-model="curChannelItem.tempName"
            />
          </el-form-item>
        </el-form>
      </div>
    </dialog-pop>
    
    <el-dialog
      v-if="showDeleteDialog"
      :title="$t('titleView.confirmInfo')"
      :visible.sync="showDeleteDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="28%"
      top="35vh"
      left="40vh">
      <div class="dialog-content" style="overflow:hidden;width:100%;">
        <p style="margin-left:26px;margin-bottom:20px;margin-top:20px;margin-right:20px;">
          <i
            class="el-icon-warning"
            style="font-size:26px;margin-right:20px;color:#FF9803;
          display: inline-block;  vertical-align: middle"/>
          <span style="display: inline-block;  vertical-align: middle">{{ deleteInfo }}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="file-cancel-btn" size="mini" style="" @click="showDeleteDialog = false">
          {{ $t('titleView.cancel') }}
        </el-button>
        <el-button class="file-confirm-btn" size="mini" type="primary" @click="confirmDeleteDevice()">
          {{ $t('titleView.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deviceRESTful, ezvizRESTful } from '@/api/index';
import { getBriefStoreList } from '@/api/store';
import filterString from '@/common/filterString';
import util from '@/common/util';
import lodash from 'lodash';
import TablePagination from '@/components/TablePagination';
import DialogPop from '@/components/DialogPop';
import TblPaginationOnly from '@/components/TblPaginationOnly';

export default {
  name: 'EzvizDeviceMgmt',
  components: {
    TablePagination, DialogPop,
    TblPaginationOnly
  },
  data() {
    return {
      total: 0,
      page: 1,
      sizeNum: 10,
      columnData: [
        {
          'prop': 'serialNumber',
          'label': this.$t('deviceView.serialNum'),
          'width': 115,
          'maxWidth': 115
        },
        {
          'prop': 'name',
          'label': this.$t('deviceView.deviceName'),
          'width': 155,
          'maxWidth': 120,
          'canEdit': true
        },
        {
          'prop': 'storeName',
          'label': this.$t('deviceView.store'),
          'width': 96,
          'maxWidth': 96
        },
        {
          'prop': 'channelCount',
          'label': this.$t('deviceView.channelNum'),
          'width': 65,
          'maxWidth': 120
        }
      ],
      tableData: [],
      showImportContent: false,
      showConfirmImport: false,
      channelList: [],
      curChannelItem: {},
      varWindowWidth: window.innerWidth,
      varyWindowHeight: window.innerHeight,
      curEzvizItem: null,
      lang: this.$i18n.locale,
      showAddDeviceDialog: false,
      addDeviceData: { },
      channelNumList: [
        {
          value: 1,
          label: '1 ' + this.$t('deviceView.unit')
        },
        {
          value: 4,
          label: '4 ' + this.$t('deviceView.unit')
        },
        {
          value: 8,
          label: '8 ' + this.$t('deviceView.unit')
        },
        {
          value: 16,
          label: '16 ' + this.$t('deviceView.unit')
        },
        {
          value: 32,
          label: '32 ' + this.$t('deviceView.unit')
        },
        {
          value: 64,
          label: '64 ' + this.$t('deviceView.unit')
        },
        {
          value: 128,
          label: '128 ' + this.$t('deviceView.unit')
        },
        {
          value: 256,
          label: '256 ' + this.$t('deviceView.unit')
        }
      ],
      storeDataList: [],
      allStoreDataList: [],
      newChannelNumList: [],
      channelBtnDisabled: false,
      editChannelNumList: [],
      showConfirmDelete: false,
      rules: {
        serialNumber: [
          { required: true, message: this.$t('deviceView.inputSerialNum'), trigger: 'blur' }
        ],
        validationCode: [
          { required: true, message: this.$t('deviceView.codeInfo'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('deviceView.inputDeviceName'), trigger: 'blur' }
        ],
        channelCount: [
          { required: true, message: this.$t('deviceView.selectChannelNum'), trigger: 'change' }
        ],
        ezvizAccount: [
          { required: true, message: this.$t('deviceView.selectEzvizAccount'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('deviceView.selectStore'), trigger: 'change' }
        ]
      },
      showDeleteChannel: false,
      deleteFromEzviz: false,
      addChannelData: { },
      channelRules: {
        name: [
          { required: true, message: this.$t('deviceView.inputChannelName'), trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: this.$t('deviceView.selectDeviceChannel'), trigger: 'blur' }
        ],
        pictureUrl: [
          { required: true, message: this.$t('deviceView.uploadImage'), trigger: 'blur' }
        ]
      },
      showAddChannelDialog: false,
      showEditDeviceDialog: false,
      showEditChannelDialog: false,
      file: '',
      deleteChannelId: 0,
      isUpdate: false,
      deviceNameTemp: '',
      channelCountTemp: 0,
      ezvizAccountList: [],
      elTooltipClass: 'el-tooltipClass',
      curIndex: 0,
      channelNameRuletip: false,
      serialRuletip: false,
      validateRuletip: false,
      deviceRuletip: false,
      authDeviceNumber: 0,
      accountHead: 'account-header',
      accountCell: '',
      accountRow: '',
      columnOperationData: {
        label: ' ',
        minWidth: '120',
        align: 'center',
        operation: [
          {
            lable: '',
            icon: 'icon-bianji',
            methods: 'edit'
          },
          {
            lable: '',
            icon: 'icon-shanchu',
            methods: 'delete'
          }
        ]
      },
      deleteSerialNums: [],
      deleteInfo: '',
      showDeleteDialog: false,
      allDeviceChecked: false,
      ezvizAccount: '',
      accountScope: 0,
      accountSettingMsg: '',
      deviceTypeOption: [{
        value: 0,
        label: this.$t('deviceView.addMainAccountDevice')
      },
      {
        value: 1,
        label: this.$t('deviceView.addAvailableDevice')
      },
      {
        value: 2,
        label: this.$t('deviceView.addSharedDevice')
      }],
      deviceType: 0,
      deviceSource: 0,
      avilableDeviceList: [],
      isLoadingData: true,
      editingDevice: {}
    };
  },

  computed: {
    varyDivHeight() {
      return this.varyWindowHeight - 80 - 70 - 85 - 92 - 30 - 60;
    }
  },

  mounted() {
    this.setBreadcrumbsName();
    this.setDeviceListParams();
    this.getBriefStoreData();
  },

  methods: {
    initAddDeviceFormData() {
      this.addDeviceData = {
        name: '',
        validationCode: '',
        storeId: this.storeDataList.length > 0 ? this.storeDataList[0].storeId : '',
        serialNumber: '',
        channelCount: 1,
        ezvizAccount: this.ezvizAccount
      };
    },

    initAddChannelFormData() {
      this.addChannelData = {
        name: '',
        channelId: '',
        pictureUrl: '',
        file: ''
      };
    },

    setSNCell(row) {
      if (row.columnIndex === 1) {
        return 'sn-class';
      }
    },

    showDeleteDialogMethod(val) {
      const self = this;
      self.deleteSerialNums = [];
      if (val !== 0) {
        const deviceObj = {};
        deviceObj.serialNumber = val.serialNumber;
        deviceObj.deleteFromEzviz = this.accountScope === 0;
        self.deleteSerialNums.push(deviceObj);
      } else {
        const arr = [];
        const selectRows = self.$refs.ezvizDeviceTable.tableSelection;
        selectRows.forEach(item => {
          const deviceObj = {};
          deviceObj.serialNumber = item.serialNumber;
          deviceObj.deleteFromEzviz = this.accountScope === 0;
          arr.push(deviceObj);
        });
        self.deleteSerialNums = arr;
      }
      if (self.deleteSerialNums.length === 0) {
        util.notify(self.$t('deviceView.emptyDeleteDevice'), 'warning', 3000);
        return false;
      } else {
        if (self.deleteSerialNums.length === 1) {
          self.deleteInfo = self.$t('deviceView.confirmDeleteDevice');
        } else {
          self.deleteInfo = self.$t('deviceView.confirmDeleteDevices');
        }
        self.showDeleteDialog = true;
      }
    },

    confirmUpdateDevice(deviceInfo) {
      const self = this;
      const params = {};
      params.serialNumber = deviceInfo.serialNumber;
      params.name = deviceInfo.tempDeviceName;
      params.syncToEzviz = false;
      ezvizRESTful.updateEzvizDevice(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          self.setDeviceListParams()
          self.getChannelListByDevice(self.curEzvizItem.serialNumber);
          util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
          if (this.showEditDeviceDialog) this.showEditDeviceDialog = false
        } else {
          deviceInfo.tempDeviceName = deviceInfo.name;
          util.setErrorMsg(res.errMsg, false);
          this.showAddDeviceDialog = false;
        }
      })
        .catch(err => {
          console.log('EzvizDeviceManagement-confirmUpdateDevice: ' + err);
        });
    },

    setBreadcrumbsName() {
      const rowDataJson = JSON.parse(sessionStorage.getItem('ezvizAccount'));
      const rowData = rowDataJson.rowData;
      this.ezvizAccount = rowData.ezvizAccount;
      this.accountScope = rowData.scope;
      this.accountSettingMsg = this.accountScope === 0 ? this.$t('deviceView.storeViuAccount') : this.$t('deviceView.userAccount');
      const breadcrumbsName = this.accountScope === 0 ? 'storeViuAccountDeviceSetting' : 'userAccountDeviceSetting';
      this.$route.matched[2].name = breadcrumbsName;
    },
    handleUpdateDevice (row) {
      
      this.curChannelItem = {...row};
      this.editingDevice = {...row}
      this.showEditDeviceDialog = true
    },
    handleEmitOperation(methodsAndRowObj) {
      const method = methodsAndRowObj.method;
      switch (method) {
        case 'edit': {
          this.handleUpdateDevice(methodsAndRowObj.row)
          break;
        }
        case 'delete': {
          this.showDeleteDialogMethod(methodsAndRowObj.row);
          break;
        }
        default: {
          break;
        }
      }
    },

    handleEmitRowClick(row) {
      this.deviceSource = row.deviceType;
      this.curEzvizItem = row;
      this.getChannelListByDevice(row.serialNumber);
    },

    handleEmitEdit(row) {
      this.confirmUpdateDevice(row);
    },

    getBriefStoreData() {
      const self = this;
      getBriefStoreList().then(res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
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

    handleChange(file, fileList) {
      this.addChannelData.pictureUrl = file.url;
      this.addChannelData.file = file;
      this.file = file.raw;
    },

    handleEditChange(file, fileList) {
      const self = this;
      self.isUpdate = false;
      this.channelList.forEach(item => {
        if (item.isClick) {
          item.tempUrl = file.url;
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

    deleteChannel(channelList) {
      const params = {
        deviceIds: channelList
      };
      return new Promise((resolve, reject) => {
        ezvizRESTful.deleteEzvizChannel(params).then(res => {
          resolve(res);
        });
      });
    },

    addEzivzDevice(params) {
      return new Promise((resolve, reject) => {
        ezvizRESTful.addEzivzDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    deleteEzvizDevice(params) {
      return new Promise((resolve, reject) => {
        ezvizRESTful.deleteEzivzDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch(err => {
          reject(err);
        });
      });
    },

    handleEdit(index, item) {
      const self = this;
      // item.isClick = true;
      self.curChannelItem = {...item};
      this.showEditChannelDialog = true
      // self.channelList.forEach((_item, _index) => {
      //   if (index !== _index) {
      //     _item.isClick = false;
      //   }
      // });
    },

    cancelEditEzvizChannle(index, item) {
      const self = this;
      self.isUpdate = false;
      item.isClick = false;
      item.tempUrl = item.pictureUrl;
      item.tempName = item.name;
      item.checkedStatus = item.status === 1;
      self.file = '';
      if (item.id === 0) {
        self.channelList.splice(index, 1);
      }
    },

    async updateChannelImage(item){
      try {
        let result = '';
        item.checkedStatus && item.status === 0 && ( result = await ezvizRESTful.enableEzvizDeviceChannel(
          { deviceIds: [item.id] }) );
        !item.checkedStatus && item.status === 1 && (result = await ezvizRESTful.disableEzvizDeviceChannel(
          { deviceIds: [item.id] }) );
        if (result.errCode === 0){
          util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
          item.status = item.checkedStatus ? 1 : 0;
        } else {
          throw Error(result.errMsg);
        }

      } catch (error) {
        item.checkedStatus = item.status === 1;
        item.isEditing = false;
        util.setErrorMsg(error.message, false);
      }
    },

    confrimEditEzvizChannle(index, item) {
      const self = this;
      if (item.id !== 0) {
        self.updateEzvizChannel(item);
      } else {
        // add new channel
        self.addEzvizChannel(item);
      }
    },

    async updateEzvizChannel() {
      const self = this;
      if (self.curChannelItem.tempName.trim().length === 0) {
        util.notify(self.$t('deviceView.channelNameEmpty'), 'warning', 3000);
        return false;
      }
      const obj = {};
      self.isUpdate = false;
      obj.id = self.curChannelItem.id;
      obj.name = self.curChannelItem.tempName;
      const params = obj;
      try {
        const promiseArr = [];
        self.curChannelItem.name !== self.curChannelItem.tempName && promiseArr.push(ezvizRESTful.updateEzvizChannel(params));
        // item.tempUrl !== item.pictureUrl && promiseArr.push(this.updateAttachImage());

        const results = await Promise.all(promiseArr);
        results.forEach(result => {
          if (result.errCode !== 0) {
            throw Error(result.errMsg);
          }
        });
        this.showEditChannelDialog = false
        self.getChannelListByDevice(self.curEzvizItem.serialNumber);
        util.notify(self.$t('deviceView.editSuss'), 'success', 3000);
      } catch (e) {
        // item.isClick = false;
        util.setErrorMsg(e.message, false);
        this.showAddDeviceDialog = false;
      }
    },

    updateAttachImage(){
      const fm = new FormData();
      fm.append('id', this.curChannelItem.id);
      fm.append('picture', this.file);
      return this.attachImageToDevice(fm);
    },

    addEzvizChannel(item) {
      const self = this;
      const json = {};
      json.name = item.tempName;
      json.storeId = self.curEzvizItem.storeId;
      json.ivsId = self.curEzvizItem.serialNumber;
      json.channelId = item.channelId;
      // json.vendor = 1;
      const deviceArr = [];
      deviceArr.push(json);
      const params = {};
      params.device = deviceArr;
      ezvizRESTful.addEzvizDeviceChannel(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg && errMsg === 'Success') {
          util.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
          self.curChannelItem.isClick = false;
        } else {
          util.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.getChannelListByDevice(self.curEzvizItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-addEzvizChannel: ' + err);
        });
    },

    getDeviceList(params) {
      const self = this;
      this.isLoadingData = true;
      ezvizRESTful.getEzvizList(params).then(res => {
        const resCode = res.errCode;
        const data = res.data;
        if (resCode === 0 && Object.keys(data).length > 0) {
          const tempDeviceArr = [];
          const deviceArray = res.data.content;
          deviceArray.forEach((item, index) => {
            const deviceInfo = {};
            deviceInfo.serialNumber = item.serialNumber;
            deviceInfo.name = item.name;
            deviceInfo.tempDeviceName = item.name;
            deviceInfo.store = item.storeName;
            deviceInfo.storeName = item.storeName;
            deviceInfo.storeId = item.storeId;
            deviceInfo.deviceModel = item.deviceModel;
            deviceInfo.ezvizAccount = item.ezvizAccount;
            deviceInfo.channelCount = item.channelCount;
            deviceInfo.comment = item.comment;
            deviceInfo.isEditing = false;
            deviceInfo.addedMethod = item.addedMethod;
            if (index === 0) {
              this.$nextTick(function() {
                this.$refs.ezvizDeviceTable.$refs.tablePagination.setCurrentRow(deviceInfo);
              });
            }
            tempDeviceArr.push(deviceInfo);
          });
          self.tableData = tempDeviceArr;
          self.total = Math.ceil(res.data.totalElements/self.sizeNum);
        }
      })
        .then(async() => {
          if (self.tableData.length !== 0) {
            self.curEzvizItem = self.tableData[0];
            self.getChannelListByDevice(self.tableData[0].serialNumber);
          } else {
            self.channelBtnDisabled = true;
            self.channelList = [];
          }
          this.isLoadingData = false;
        }).catch(error => {
          this.isLoadingData = false;
          console.log('EzvizDeviceMgmt-getDeviceList' + error);
        });
    },

    getChannelData(serialNumber) {
      const params = {};
      params.serialNumber = serialNumber;
      return new Promise((resolve, reject) => {
        ezvizRESTful.getEzvizChannelList(params).then(res => {
          const errMsg = res.errMsg;
          if (errMsg && errMsg === 'Success') {
            const data = res.data;
            resolve(data);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },

    getChannelListByDevice(serialNumber) {
      const self = this;
      const temp = [];
      this.getChannelData(serialNumber).then(res => {
        res.forEach(item => {
          const obj = {};
          obj.id = item.id;
          obj.name = item.name;
          obj.tempName = item.name;
          obj.channelId = item.channelId;
          obj.pictureUrl = item.thumbnailUrl;
          obj.tempUrl = item.thumbnailUrl;
          obj.isClick = false;
          obj.status = item.status;
          obj.checkedStatus = item.status === 1;
          temp.push(obj);
        })
      });
      self.channelList = temp;
      if (Object.keys(self.curEzvizItem).length === 0 ||
        self.channelList.length === self.curEzvizItem.channelCount) {
        self.channelBtnDisabled = true;
      } else {
        self.channelBtnDisabled = false;
      }
      if (self.channelList.length === 0) {
        self.editChannelNumList = self.channelNumList;
      } else {
        const sortArr = self.channelList.sort(self.getSortFun('channelId'));
        const lastChannel = sortArr[sortArr.length - 1];
        const maxChannleId = lastChannel.channelId;
        const maxChannel = Math.pow(2, Math.ceil(Math.log2(maxChannleId)));
        const spliceArray = self.channelNumList.filter(x => x.value >= maxChannel);
        self.editChannelNumList = spliceArray;
      }
    },

    async setDeviceListParams() {
      const self = this;
      const params = {
        'clause': {
          'ezvizAccount': self.ezvizAccount
        },
        'filter': {
          'page': self.page - 1,
          'size': self.sizeNum
        },
        'order': {
          'direction': 'asc',
          'property': 'name'
        }
      };
      self.getDeviceList(params);
    },

    addDevice(params) {
      return new Promise((resolve, reject) => {
        ezvizRESTful.addEzvizDeviceChannel(params).then(resDevice => {
          resolve(resDevice);
        }).catch(err => {
          reject(err);
        });
      });
    },

    addEzvizDeviceBasedForm() {
      const self = this;
      self.$refs['deviceForm'].validate(async(valid) => {
        if (valid) {
          const nvrParams = {};
          let nvrArray = [];
          if (self.deviceType !== 1) {
            self.addDeviceData.addedMethod = self.deviceType;
            self.addDeviceData.ezvizAccount = self.ezvizAccount;
            nvrArray.push(self.addDeviceData);
          } else {
            const selectDevice = self.avilableDeviceList.filter(item => item.checked === true);
            if (selectDevice.length === 0) {
              util.notify(self.$t('deviceView.selectDevice'), 'warning', 3000);
              return false;
            } else {
              const noSelectStore = selectDevice.some(item => !item.storeId || item.storeId.length === 0);
              if (noSelectStore) {
                util.notify(this.$t('deviceView.selectBoundStore'), 'warning', 3000);
                return false;
              } else {
                selectDevice.map(item => {
                  item.ezvizAccount = this.ezvizAccount;
                });
              }
            }
            selectDevice.forEach(item => {
              item.addedMethod = 1;
              item.ezvizAccount = self.ezvizAccount;
              if (item.storeId === '') {
                util.notify(self.$t('deviceView.selectBoundStore'), 'warning', 3000);
                return false;
              }
            });
            nvrArray = selectDevice;
          }
          nvrParams.device = nvrArray;
          const res1 = await self.addEzivzDevice(nvrParams);
          const errMsg = res1.errMsg;
          if (errMsg === 'Success') {
            util.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
            self.showAddDeviceDialog = false;
          } else {
            util.setErrorMsg(errMsg, true);
            self.showAddDeviceDialog = false;
          }
          self.initAddDeviceFormData();
          self.setDeviceListParams();
        } else {
          return false;
        }
      });
    },

    addSingleChannel() {
      const self = this;
      self.$refs['channelForm'].validate(async(valid) => {
        if (valid) {
          const json = {};
          json.name = self.addChannelData.name;
          json.storeId = self.curEzvizItem.storeId;
          json.ivsId = self.curEzvizItem.serialNumber;
          json.channelId = self.addChannelData.channelId;
          // json.vendor = 1;
          const deviceArr = [];
          deviceArr.push(json);
          const devParams = {};
          devParams.device = deviceArr;
          const res1 = await self.addDevice(devParams);
          if (res1.errMsg === 'Success') {
            // get channel id and attach image to channel
            const fm = new FormData();
            const channelId = res1.data[0];
            fm.append('id', channelId);
            fm.append('picture', self.file);
            const attachRes = await self.attachImageToDevice(fm);
            if (attachRes.errMsg === 'Success') {
              util.notify(self.$t('deviceView.addSuccess'), 'success', 3000);
            }
            self.showAddChannelDialog = false;
          } else {
            util.notify(self.$t('deviceView.addFailed'), 'warning', 3000);
            self.showAddChannelDialog = false;
          }
          self.initAddChannelFormData();
          self.page = 1;
          self.getChannelListByDevice(self.curEzvizItem.serialNumber);
        } else {
          return false;
        }
      });
    },

    attachImageToDevice(params) {
      return new Promise((resolve, reject) => {
        deviceRESTful.attachImageToDevice(params).then(resDevice => {
          resolve(resDevice);
        }).catch(err => {
          reject(err);
        });
      });
    },

    updateAddChannelDialogFlag(val){
      this.showAddChannelDialog = val;
    },

    hideAddChannelDialog(){
      this.showAddChannelDialog = false;
    },

    handleDelete(index, item) {
      const self = this;
      self.showDeleteChannel = true;
      self.deleteChannelId = item.id;
    },

    updateDeleteChannelDialogFlag(val){
      this.showDeleteChannel = val;
    },

    hideDeleteChannelDialog(){
      this.showDeleteChannel = false;
    },

    updateAddDeviceDialogFlag(val){
      this.showAddNvrDialog = val;
    },

    hideAddDeviceDialog(){
      this.showAddNvrDialog = false;
    },

    deleteSingleChannel() {
      const self = this;
      self.showDeleteChannel = false;
      const idsArr = [];
      idsArr.push(self.deleteChannelId);
      const obj = {};
      obj.deviceIds = idsArr;
      const params = obj;
      ezvizRESTful.deleteEzvizChannel(params).then(res => {
        const errMsg = res.errMsg;
        if (errMsg != undefined && errMsg === 'Success') {
          util.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
        } else {
          util.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
        }
      })
        .then(async() => {
          self.getChannelListByDevice(self.curEzvizItem.serialNumber);
        }).catch(err => {
          console.log('EzvizDeviceManagement-deleteSingleChannel: ' + err);
        });
    },

    showAddDialog() {
      this.showAddDeviceDialog = true;
      this.storeDataList = this.allStoreDataList;
      this.deviceType = 0;
      this.initAddDeviceFormData();
      this.accountScope === 1 && this.getAvailableEzvizDevice();
    },

    async confirmDeleteDevice() {
      const self = this;
      self.showConfirmDelete = false;
      const deleteParams = {};
      deleteParams.device = [];
      deleteParams.device = self.deleteSerialNums;
      self.deleteEzvizDevice(deleteParams).then(res => {
        if (res.errCode === 0) {
          util.notify(self.$t('deviceView.deleteSuccess'), 'success', 3000);
          self.showDeleteDialog = false;
          self.setDeviceListParams();
        } else {
          util.notify(self.$t('deviceView.deleteFail'), 'warning', 3000);
          self.showDeleteDialog = false;
        }
      }).catch(err => {
        console.log('EzvizDeviceMgmt-confirmDeleteDevice' + err);
      });
    },

    // add new channel
    addNewChannel() {
      const self = this;
      const channelNum = this.curEzvizItem.channelCount;
      const spliceArray = [];
      for (let item = 1; item <= channelNum; item++) {
        const channelJson = {};
        channelJson.value = item;
        channelJson.label = item;
        channelJson.disabled = false;
        spliceArray.push(channelJson);
      }
      spliceArray.forEach(item => {
        this.channelList.forEach(_item => {
          if (item.value === _item.channelId) {
            item.disabled = true;
          }
        });
      });
      self.newChannelNumList = spliceArray;
      self.showAddChannelDialog = true;
      self.initAddChannelFormData();
    },

    getSortFun(sortBy) {
      var ordAlpah = '>';
      var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
      return sortFun;
    },

    async getAccountList() {
      const self = this;
      self.tableData = [];
      const retData = await self.getEzvizAccountList();
      const accountList = retData.data;
      self.ezvizAccountList = accountList;
    },

    getEzvizAccountList() {
      return new Promise((resolve, reject) => {
        ezvizRESTful.getEzvizAccountList().then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    channelNameChange(val, item) {
      const self = this;
      const comment = filterString.all(val, 30);
      if (Object.keys(item).length === 0) {
        self.addChannelData.name = comment;
      } else {
        item.tempName = comment;
      }
      const length = filterString.getContentLength(val);
      if (length > 30) {
        this.channelNameRuletip = true;
      } else {
        this.channelNameRuletip = false;
      }
    },

    serialNumberChange(val) {
      const self = this;
      const comment = filterString.all(val, 50);
      self.addDeviceData.serialNumber = comment;
      const length = filterString.getContentLength(val);
      if (length > 50) {
        this.serialRuletip = true;
      } else {
        this.serialRuletip = false;
      }
    },

    validateCodeChange(val) {
      const self = this;
      const comment = filterString.all(val, 10);
      self.addDeviceData.validationCode = comment;
      const length = filterString.getContentLength(val);
      if (length > 10) {
        this.validateRuletip = true;
      } else {
        this.validateRuletip = false;
      }
    },

    deviceNameChange(val) {
      const self = this;
      const comment = filterString.all(val, 30);
      self.addDeviceData.name = comment;
      const length = filterString.getContentLength(val);
      if (length > 30) {
        this.deviceRuletip = true;
      } else {
        this.deviceRuletip = false;
      }
    },

    notShowInputRuleTips(e) {
      if (e === 'channelName') {
        this.channelNameRuletip = false;
      } else if (e === 'serialNum') {
        this.serialRuletip = false;
      } else if (e === 'validationCode') {
        this.validateRuletip = false;
      } else if (e === 'deviceName') {
        this.deviceRuletip = false;
      }
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

    getAvailableDevice(params) {
      return new Promise((resolve, reject) => {
        ezvizRESTful.getAvailableDevices(params).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getAvailableEzvizDevice() {
      const params = {};
      params.ezvizAccount = this.ezvizAccount;
      this.getAvailableDevice(params).then(res => {
        this.avilableDeviceList = res.errCode === 0 && res.data.length > 0 ? res.data : [];
      }).catch(error => {
        this.avilableDeviceList = [];
        console.log('EzvizDevice-getAvailableEzvizDevice-' + error);
      });
    },

    handlePageAndSizeChange(pageObj) {
      console.log(pageObj);
      const self = this;
      self.page = pageObj.page;
      self.sizeNum = pageObj.size;
      self.setDeviceListParams();
    },
    confirmEditDialog () {
      if (this.showEditDeviceDialog) {
        this.confirmUpdateDevice({...this.editingDevice, tempDeviceName: this.editingDevice.name })
      } else {
        this.updateEzvizChannel()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '../../../../assets/css/importfile.css';
  @import '../../../../assets/css/textstyle.css';
  $mainColor:#f31d65;
  $border:#e3e9f4;
  $background:#f5f7fa;
  $tab:#7d8cad;
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
    text-align: left;
  }
  *{
    font-family: Roboto,Arial, Microsoft YaHei;
  }
  .operation-btns{
    @include point(margin-right,15);
    .iconfont{
      font-size: calc(16/1920*100vw);
      margin-right: calc(8/1920*100vw);
    }
    span{
      font-size: calc(14/1920*100vw);
    }
    .noAllow{
      cursor:not-allowed;
      opacity: 0.6;
    }
    .el-add-btn, .el-delete-btn{
      color: #fff;
      position: relative;
      margin-right: calc(15/1920*100vw);
      height: calc(36/1920*100vw);
      width: calc(130/1920*100vw);
      padding: 0;
      &:disabled{
        opacity: 0.5;
      }
    }
    .en-el-add-btn, .en-el-delete-btn{
      background-color: $mainColor;
      border-color:  $mainColor;
      color: #fff;
      font-size: calc(14/1920*100vw);
      text-align: center;
      height: calc(36/1920*100vw);
      width: calc(130/1920*100vw);
      &:disabled{
        opacity: 0.5;
      }
    }
  }
  .tooltip-color{
    color: rgba(75,82,98, 0.5) !important;
  }

  .el-device {
    display: flex;
    flex-direction: column;
    height: 100%;
    .account-title {
      text-align: left;
      height: 70px;
      line-height: 70px;
      padding-right: calc(30 / 1920 * 100vw);
      padding-left: calc(30 / 1920 * 100vw);
      font-size: calc(20 / 1920 * 100vw);
      color: #182752;
    }
    .table-container {
      min-height: calc(100% - 75px);
      margin: 20px calc(20 / 1920 * 100vw);
    }
    .addDevice .ezviz-form {
      border: 1px solid $border;
      background: $tab;
    }
    .device-content {
      height: 100%;
      bottom: calc(30/1920*100vw);
      .dialog-content{
        width: 100%;
      }
      .titles{
        display: inline-block;
        margin-left: calc(20/1920*100vw);
      }
      .titles:first-child{
        margin-left: calc(25/1920*100vw);
      }
      .dash-content{
        text-align: left;
        position: relative;
        overflow: hidden;
        .details{
          @include point(height,50);
          @include point(line-height,50);
          @include point(padding-left,10);
          .dash-label{
            width: 30%;
            float: left;
          }
          .dash-input{
            width: 50%;
            margin-left: 5%;
          }
        }
      }
      .device-info{
        @include titleStyle;
        position: relative;
        padding-left: calc(25/1920*100vw);
        background-color: #fff;
        .info-title{
          font-size: calc(18/1920*100vw);
          font-weight: bold;
        }
        .add-btn{
          position: absolute;
          right: calc(25/1920*100vw);
          font-size: calc(14/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          width: calc(130/1920*100vw);
          top: 0;
          bottom: 0;
          margin: auto;
          .el-icon-plus{
            font-size: calc(16/1920*100vw);
            margin-right: calc(8/1920*100vw);
          }

        }
      }
      .lisde{
        background-color: #fff;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .risde{
        background-color: #ffffff;
        .nape-items-title .titles, .en-nape-items-title .titles{
          color: $tab;
          text-align: left;
        }
        .channel-content{
          overflow: auto;
        }
        .nape-items-data{
          overflow: hidden;
          font-size: 14px;
          height: 90px;
          line-height: 90px;
          display: flex;
          .nape-input{
            width: calc(160/1920*100vw);
            margin-left: calc(20/1920*100vw);
            position: relative;
            bottom: 2px;
          }
          .nape-name-data{
            flex: 1;
            /*margin-right: 6%;*/
            span{
              margin-left: 10%;
              position: relative;
              @include point(max-width,90);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
          .nape-dep-data{
            flex: 1;
            span{
              margin-left: calc(25/1920*100vw);
            }
          }
          .nape-picture-data{
            flex: 1;
            height: 100%;
            .img-class{
              height: 90%;
              width: calc(100/1920*100vw);
              min-width: 85px;
              vertical-align: middle;
              text-align: center;
              line-height: 70px;
              height: 70px;
              width: calc(100/1920*100vw);
              display: inline-block;
              span{
                font-size: calc(14/1920*100vw);
              }
            }
            .upload-demo{
              position: absolute;
              bottom: 0;
              font-size: 12px;
              width: calc(100/1920*100vw);
              min-width: 85px;
              >>> .el-upload{
                width: 100%;
              }
              >>> .el-button{
                width: 100%;
                height: 28px;
                opacity: 0.5;
                position: absolute;
                bottom: 10px;
                left: 0;
              }
              >>> .el-button--mini{
                padding: 7px;
              }
            }
          }
          .en-nape-picture-data{
            width: 20%;
          }
          .nape-enable-handle{
            flex: 1;
          }
          .nape-items-handle{
            
            flex: 1;
            .iconcontent{
            }
            .iconfont{
              font-size: calc(24/1920*100vw);
              color: #7d8cad !important;
            }
            .icon-list{
            }
          }
        }

      }
    }
  }
  .btn-class{
    height: calc(36/1920*100vw);
    padding: 0;
    font-size: calc(14/1920*100vw);
    width: calc(130/1920*100vw);
    .el-icon-plus{
      font-size: calc(16/1920*100vw);
      margin-right: calc(8/1920*100vw);
    }
    @media screen and (max-width: 1440px) {
      width: 100px !important;
    }
    .btn-area{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
<style>
  @import '../../../../assets/css/pagination.css';
  @import '../../../../assets/css/tabsItem.css';
  #el-menuscrollbar{
  }
  #el-menuscrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-dialog__body{
    padding: 0px;
  }
  .el-dialog__body .dialog-content .deviceForm{
    box-sizing: border-box;
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
  .el-dialog__body .dialog-content .deviceForm label{
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
    height: 90%;
    background: #f7f9fa;
  }
  .device-table .el-table--mini{
    height: 100%;
    background: #f7f9fa;
  }
  .device-table .el-table__row{
    height: 60px;
    font-weight: 700;
    background: #f7f9fa;
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
    background-color: #f2f9fe;
    color: #006ab7;
  }
  .device-table .el-table__body tr.current-row .el-table-column--selection .cell {
    color: #fff;
    border-left: 4px solid #006ab7;
    line-height: 20px;
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
</style>
