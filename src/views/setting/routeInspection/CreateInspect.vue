<template>
  <div>
		<div class="submit_btn" >
      <delay-button type="filled"  :disabled="tableTagName == ''" @click="submit">
        <div class="button-area" style="width: 80px; height: 20px;">
          <span>儲存</span>
        </div>
      </delay-button>
    </div>
	
      <div class="el-table-content" >
        <div class="send_content" v-loading="isLoadingData" style="padding-top:20px;">

          <div class="title-name" >表單設定</div>
          <div class="send_content_row" >
            <div class="row_title" ><span style="color: #c60957">* </span>巡檢表名稱</div>
            <el-input
              v-model="tableTagName"
              style="width: 50%;"
              ref="nodeName"
              :placeholder="$t('insSettingView.enterListName')"
              @input="(val) => itemInputChanged_a1(val, 50)"
            />
            <span class="notice" v-if="showInputLimit_a1">  {{$t('immediatePush.maxInput')}} 50 {{$t('immediatePush.character')}} </span>
          </div>

          <div class="send_content_row">
            <div class="row_title"><span style="color: #c60957">* </span> 考評總分計算方式</div>
            <div class="overall_row" > 
              <el-radio-group class="storevue-radio radio_item" v-model="hundredMarkType" >
                <el-radio :label="0" style=" width: fit-content; text-align: left; margin-right: 40px;" > 總分-比例制 </el-radio>
                <el-radio :label="-1" style=" width: fit-content;  margin-right: 40px;">加分制</el-radio>
                <el-radio :label="1" style=" width: fit-content;">扣分制 </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 考評總分範圍設定 -->
          <div class="send_content_row" >
            <div class="overall_row" style="margin-right: 50px;" v-if="hundredMarkType == 1">
              <div class="title-status">
                <span style="color: #c60957">* </span> 扣分起始分數
                <el-input
                  v-model="baseScore"
                  style="margin: 0 5px 0 10px;"
                  ref="basescore"
                  :placeholder="$t('insSettingView.setMinScore')"
                  type="number"
                  class="input-name_short"
                  @blur="inputChangeBaseScore"
                  />
                  分
              </div>
            </div>

            <div class="overall_row" >
              <div class="title-status">
                <span style="color: #c60957">* </span> 考評總分範圍設定
                <el-input
                  v-model="minScore"
                  style="margin: 0 5px 0 10px;"
                  ref="minscore"
                  placeholder=""
                  type="number"
                  class="input-name_short"
                  @blur="inputChangeMin"
                  />
                  分
              </div>
            </div>
              ~
            <div class="overall_row" >
              <div class="title-status">
                <el-input
                  v-model="maxScore"
                  ref="maxscore"
                  placeholder=""
                  type="number"
                  class="input-name_short"
                  style="margin: 0 5px;"
                  @blur="inputChangeMax"
                  />
                  分
              </div>
            </div>
            <div class="overall_row" style="margin-left: 50px;">
              <div class="title-status">
                考評達標分
                <el-input
                  v-model="standardScore"
                  placeholder=""
                  type="number"
                  class="input-name_short"
                  style="margin: 0 5px;"
                  @blur="inputChangeStandardScore"
                  />
                  分
              </div>
            </div>
          </div>

  
          <!-- 表單類型 -->
          <div class="send_content_row">
            <div class="row_title"><span style="color: #c60957">* </span>表單類型 </div>
            <el-select 
              v-model="tableTypeValue"
              style="width: 25%;"
              @change="cheangeType"
              >
              <el-option
                v-for="item in tableType"
                :key="item.value"
                :label="item.label"
                :value="item.value" 
                
                />
            </el-select> 
            <el-select 
              v-model="tableLayerValue"
              style="width: 25%;"
              @change="cheangeType"
              >
              <el-option
                v-for="item in tableLayer"
                :key="item.value"
                :label="item.label"
                :value="item.value"  
                
                />
            </el-select>
          </div>

          <!-- 其他設定 -->
          <div class="send_content_row">
            <div class="row_title">其他設定</div>
            <div class="role-all-checkbox"  style="margin-right: 30px">
              <el-checkbox
                v-model="qualifiedForIgnoredWithType"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
                :disabled="tableTypeValue =='t3' "
              />
              <span class="group-name">忽略項視同得分</span>
            </div>
            <div class="role-all-checkbox"  style="margin-right: 30px">
              <el-checkbox
                v-model="onSiteSignature"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">先簽到，再巡檢</span>
            </div>
            <div class="role-all-checkbox"   style="margin-right: 30px">
              <el-checkbox
                v-model="isShowDistrictSum"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">顯示區域計分(僅支援網頁板)</span>
            </div>
            <div class="role-all-checkbox"  >
              <el-checkbox
                v-model="isShowGroupSum"
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">顯示巡檢類別計分</span>
            </div>
          </div>

          <!-- ///職務權限/// -->
          <div class="title-name" style="margin-top: 50px;">權限設定</div>
          <div class="subtitle_name" style="margin-top: 20px;">職務權限</div>
          
          <div class="send_content_row">
            <div class="row_title">職務權限 </div>
              <region-multi-select
                ref="multiState"
                style="width: 50%; "
                :selected="titleAuth"
                :options="titleList"
                :noTextInput = "true"
                :all="$t('statistics.patrolPerson.dutyAll')"
                class="position"
                @changeInput="handleTitelChange"
                />
          </div>
        
          <div class="l-1" style="height: 1px; width: 100%; background: #ebebeb; margin: 20px 0;"></div>
          <div class="subtitle_name" style="margin-top: 20px;"> {{ $t('mysterio.storeAuth') }}</div>
          <div class="send_content_row">
            <!-- 全部門店 -->
            <div  v-if="storeList.length !== 0" class="role-all-checkbox">
              <el-checkbox
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
                v-model="allData"
                @change="choiceAll" 
              />
              <span class="group-name">綁定至所有地點</span>
            </div>
          </div>

          <!-- 個別地點 -->
          <div class="store_content_row">
            <div v-for="(item,index) in storeList" :key="index" class="device-group">
            <div class="device-all-checkbox">
              <el-checkbox v-model="item.checked" @change="choiceAllGroup(item)" class="storevue-checkbox-filled"/>
              <span class="group-name">{{ item.province }} - {{ item.cityName }}</span>
            </div>
            <div class="device-content">
              <div v-for="(_item,_index) in item.itemData" :key="_index" class="device-detail">
                <el-checkbox v-model="_item.checked" @change="choiceAllDevice(index,item,_index,_item)" class="storevue-checkbox-outlined"/>
                <span class="device-name">{{ _item.name }}</span>
              </div>
            </div>
          </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { getBriefStoreList } from '@/api/store';
import { getUserTitleList } from '@/api/title';
import { getStorageInfo } from '@/api/event';
import { getUserInfo, getDepartAll, getAllUserInfoNoAuth, getDepart} from '@/api/login';
import {
  sendImmediateBroadcast,
  sendImmediateTask, 
  sendImmediateEvent,
  broadcastCheck
} from '@/api/advanceSetting';
import { GetInspectTagListAll, quickAdd } from '@/api/inspect';
import filterString from '@/common/filterString.js';
import { mapGetters } from 'vuex';
import util from '@/common/util';
import RegionMultiSelect from '@/components/RegionMultiSelect';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
  name: 'WorkflowList',
  components: {
    DateTimeSelector,
    DelayButton,
    RegionMultiSelect,
    DialogPop
  },
  data() {
    return {
      isLoadingData: false,
      tableTagName: '',
      formType: "A2",

      tableTypeValue: "t1",
      tableType:[
        {
          label: "合格率評分項",
          value: "t1"
        },
        {
          label: "巡檢評分項",
          value: "t2"
        },
        {
          label: "附加評分項",
          value: "t3"
        }
      ],
      tableLayerValue: "l2",
      tableLayer: [
        {
          label: "二階層表單",
          value: "l1"
        },
        {
          label: "三階層表單",
          value: "l2"
        }
      ],

      hundredMarkType: -1,
      minScore: 0,
      maxScore: 100,
      baseScore: 100,
      standardScore: '',
      qualifiedForIgnoredWithType: true,
      onSiteSignature:  true, 
      isShowDistrictSum: true,
      isShowGroupSum: true,
    
  
      titleAuth: [],
      bindStoreIds: [],
      unbindStoreIds: [],

      storeList: [],
      titleList: [],
      userList: [],
      departList: [],
      tempStoreData: [],
      allData: false,
      newInspectId: '',

      params: {},
      allInspectTypeList: [],

      broadcastTitle: '',
      showInputLimit_a1: '',
    }
  },
  mounted() {},
  created() {
    this.init()
    
  },
  computed: {
    // ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch:{},
  methods: {
    async init(){
      await this.getStore()
      await this.getTitle()
      await this.getCountryStore();
      await this.getTagAll()
    
      // await this.getUserInfo()
      // await this.getDepartAll()
    },

    async submit(){
      this.isLoadingData = true
      var isReapet = this.allInspectTypeList.some( i => i.name == this.tableTagName)
      if(isReapet) {
        util.notify("巡檢表名稱名稱不可重複", 'error', 2000 );
        this.isLoadingData = false
        return
      } 

      if(this.baseScore.toString()=="" && this.hundredMarkType == 1) {
        util.notify("扣分起始分數不可為空", 'error', 2000 );
        this.isLoadingData = false
        this.$refs.basescore.focus()
        return
      } 

      if(this.minScore.toString()=="" ) {
        util.notify("考評總分範圍最低分數不可為空", 'error', 2000 );
        this.isLoadingData = false
        this.$refs.minscore.focus()
        return
      } 

      if(this.maxScore.toString()=="" ) {
        util.notify("考評總分範圍最高分數不可為空", 'error', 2000 );
        this.isLoadingData = false
        this.$refs.maxscore.focus()
        return
      } 

      const storeIdChecked = [];
      const storeIdUnchecked = [];
      this.storeList.forEach(item => {
        item.itemData.forEach(_item => {
          if (_item.checked) {
            storeIdChecked.push(_item.storeId);
          } else {
            storeIdUnchecked.push(_item.storeId);
          }
        });
      });


      this.params = {
        tableTagName: this.tableTagName,
        formType: this.formType,
        settings: [
          {
            name: "includedInTotalScoreWithType1", // default!!! 
            value: false
          },
          {
            name: "qualifiedForIgnoredWithType1", //tab1 忽略項視同得分
            value: this.qualifiedForIgnoredWithType
          },
          {
            name: "qualifiedForIgnoredWithType2", //tab2 忽略項視同得分
            value: this.qualifiedForIgnoredWithType
          },
          {
            name: "hundredMarkType",
            value: this.hundredMarkType    // 0 - original mark system ， -1 - hundred mark system 加分制, 1 - penalty point system 扣分制
          },
          {
            name: "minScore", //考評總分範圍設定 min
            value: this.minScore
          },
          {
            name: "maxScore", //考評總分範圍設定 max
            value: this.maxScore
          },
          {
            name: "baseScore", //扣分起始分數起始分數 
            value: this.baseScore
          },
          {
            name: "standardScore", //考評達標分, need less than maxScore
            value: this.standardScore
          },
          {
            name: "setting_isAutoMappingActivate", // 開啟依條件自動選取巡檢總評
            category: "generalRule",
            value: false
          },
          {
            name: "setting_autoMappingByTotalScore", // 依分數條件自動選取
            category: "generalRule",
            value: true,
            extra: [
              {
                key: "mappingScore_bottom", // 下標值
                value: 55.0
              },
              {
                key: "mappingScore_top", // 上標值
                value: 90.0
              }
            ]
          },
          {
            name: "setting_isShowDistrictSum", // 顯示區域計分
            category: "generalRule",
            value: this.isShowDistrictSum
          },
          {
            name: "setting_isShowGroupSum", // 顯示巡檢類別計分
            category: "generalRule",
            value: this.isShowGroupSum
          },
          {
            name: "dangerousOnFailedItem",
            value: true
          },
          {
            name: "onSitePhotoOnly", // 現場拍照 default!!! 
            category: "generalRule",
            value: false
          },
          {
            name: "onSiteSignature",
            category: "generalRule",
            value: true, 
            extra: [
              {
                header: "簽名1",
                optional: true
              },
            ]
          },
          {
            name: "checkin", //先簽到，再巡檢
            category: "generalRule",
            value: this.onSiteSignature
          },
          {
            name: "itemOptionsForType1",
            category: "generalRule",
            value: "passFail",
            extra: [
              {
                key: "passFail",
                items: [
                  {
                    code: "pass",
                    name: this.$t('remotePatrol.pass')
                  },
                  {
                    code: "fail",
                    name: this.$t('remotePatrol.failed')
                  }
                ]
              },
              {
                key: "yesNo",
                items: [
                    {
                      code: "pass",
                      name: "是"
                    },
                    {
                      code: "fail",
                      name: "否"
                    }
                ]
              },
              {
                key: "userDefined",
                items: [
                  {
                    code: "pass",
                    name: ""
                  },
                  {
                    code: "fail",
                    name: ""
                  }
                ]
              }
            ]
          },
          {
            name: "itemOptionsForType3",
            category: "generalRule",
            value: "passFail",
            extra: [
              {
                  key: "passFail",
                  items: [
                    {
                      code: "pass",
                      name: this.$t('remotePatrol.pass')
                    },
                    {
                      cod: "fail",
                      name: this.$t('remotePatrol.failed')
                    }
                  ]
              },
              {
                  key: "yesNo",
                  items: [
                    {
                      code: "pass",
                      name: "是"
                    },
                    {
                      code: "fail",
                      name: "否"
                    }
                  ]
              },
              {
                  key: "userDefined",
                  items: [
                    {
                        code: "pass",
                        name: ""
                    },
                    {
                        code: "fail",
                        name: ""
                    }
                  ]
                }
            ]
          }
        ],
        titleIds: this.titleAuth,
        applyItems : [
          {
            bindStoreIds: storeIdChecked,
            unbindStoreIds: storeIdUnchecked
          }
        ]
      }

      quickAdd(this.params).then(res => {
        const errCode = res.errCode;
      
        console.log('errCode :>> ', errCode);
        if (errCode == 0) {
          this.isLoadingData = false
          const inspectId = res.data.inspectId

          const newIsp = {
              inspectId: inspectId,
              routeName: this.tableTagName,
              mode: this.allInspectTypeList.length
          }
          sessionStorage.setItem('newInspect', JSON.stringify(newIsp));

          this.$router.push(
            { name: 'inspectListSetting', 
            // params: { data: routeData}
          });
        }
      }).catch(err => {
        reject(err);
      });
    },

  
    // init get Inspect
    getTagAll() {
      return new Promise((resolve, reject) => {
        GetInspectTagListAll().then(res => {
          const data = res.data;
          resolve(data);
          this.allInspectTypeList = data.map(i => ({
            id: i.id,
            name: i.name,
            mode: i.mode
          }))
        }).catch(err => {
          reject(err);
        });
      });
    },


    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(res => {
          resolve(res);
        });
      });
    },

    async getCountryStore() {
      const self = this;
      const data = await self.getBriefStoreData();
      self.totalCount = data.data.length;
      if (data.errCode === 0) {
        self.tempStoreData = data.data;
        self.getStoreByCity(data.data)
      }
    },

    async getStoreByCity(data) {
      const self = this;
      const cityList = [];
      const provinceList = [];
      const bindArr = [];
      var needArry = []

      // const bindStoreId = await self.getBindStoreList();
      // const storeIds = bindStoreId.data.length > 0 ? bindStoreId.data[0].storeIds : [];
      const storeIds = [];
      
      data.forEach( i => {
        const obj = {};
        if(needArry.indexOf(i.province) === -1 && needArry.indexOf(i.city) === -1){
          obj.city = i.city
          obj.province = i.province
          
        }
        needArry.push(obj)
        storeIds.forEach(_item => {
          if (i.storeId === _item) {
            bindArr.push(_item);
          }
        });
        
      })
      
      const allItems =  [...new Set(needArry.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
      self.storeCount = bindArr.length;
      allItems.forEach( l => {
        var tempItems = []
        data.forEach( i => {
          const obj = {};
          if(i.province === l.province && i.city === l.city){
            obj.storeName = i.name
            obj.storeId = i.storeId
            tempItems.push(obj)
          }
        })
        l.store = tempItems
      })

      const temp = allItems;
      const groupTemp = [];
      temp.forEach(item => {
        const groupObj = {};
        groupObj.province = item.province;
        groupObj.cityName = item.city;
        const _temp = [];
        let _tempCount = 0;
        item.store.forEach(_item => {
          const _obj = {};
          
            _obj.checked = true;
            _tempCount++;
          
          _obj.storeId = _item.storeId;
          _obj.name = _item.storeName;
          _temp.push(_obj);
        });
        
        groupObj.checked = true;
        groupObj.itemData = _temp;
        groupTemp.push(groupObj);
      });

      self.storeList = groupTemp;
      self.tempStoreList = groupTemp;
      console.log('self.tempStoreList :>> ', self.tempStoreList);

      let count = 0;
      self.storeList.forEach(item => {
        if (item.checked) {
          count++;
        }
      });
      if (count === self.storeList.length) {
        self.allData = true;
      } else {
        self.allData = false;
      }
    },

    choiceAll(val) {
      const self = this;
      self.storeList.forEach(item => {
        item.checked = val;
        item.itemData.forEach(_item => {
          _item.checked = val;
        });
      });
    },

    choiceAllGroup(item) {
      const self = this;
      const obj = item;
      item.itemData.forEach(item => {
        item.checked = obj.checked;
      });
      const arr = [];
      self.storeList.forEach(_item => {
        if (_item.checked) {
          arr.push(_item);
        }
      });
      self.allData = self.storeList.length === arr.length;
    },

    choiceAllDevice(index, item) {
      const self = this;
      let count = 0;
      item.itemData.forEach(itemS => {
        if (itemS.checked) {
          count++;
        }
      });
      item.checked = count === item.itemData.length;
      let length = 0, countItem = 0;
      self.storeList.forEach(_item => {
        length += _item.itemData.length;
        _item.itemData.forEach(itemS => {
          if (itemS.checked) {
            countItem++;
          }
        });
      });
      self.allData = length === countItem;
    },

    handleTitelChange(titleAuth){
      this.titleAuth = titleAuth
    },

    cheangeType(){
      console.log('change')
      if(this.tableTypeValue == 't1' && this.tableLayerValue == 'l1'){
        this.formType = 'A1'
      }
      else if(this.tableTypeValue == 't1' && this.tableLayerValue == 'l2'){
        this.formType = 'A2'
      }
      else if(this.tableTypeValue == 't2' && this.tableLayerValue == 'l1'){
        this.formType = 'B1'
      }
      else if(this.tableTypeValue == 't2' && this.tableLayerValue == 'l2'){
        this.formType = 'B2'
      }
      else if(this.tableTypeValue == 't3' && this.tableLayerValue == 'l1'){
        this.formType = 'C1'
        this.qualifiedForIgnoredWithType = false
      }
      else if(this.tableTypeValue == 't3' && this.tableLayerValue == 'l2'){
        this.formType = 'C2'
        this.qualifiedForIgnoredWithType = false
      }
    },

    getBriefStoreData() {
      return new Promise((resolve, reject) => {
        getBriefStoreList().then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },
    async getStore(){
      let res  = await this.getBriefStoreData();
      if(res.errCode ==0){
        this.storeList = res.data;
      }
    },

    userTitleList(){
      return new Promise((resolve, reject) => {
        getUserTitleList({ type: 1 }).then(res => {
          const errMsg = res.errMsg;
          if (errMsg != undefined && errMsg === 'Success') {
            resolve(res);
          }
        }).catch(err => {
          reject(err);
        });
      });

    },
    async getTitle(){
      let res  = await this.userTitleList();
      if(res.errCode ==0){
        this.titleList = res.data.map( i => ({
          label: i.title,
          value: i.id,
        })
        );
      }
      this.titleAuth = res.data.map( i => i.id)
      // console.log('this.titleList ~~~~>> ',this.titleList);
      // console.log('this.titleAuth :>> ', this.titleAuth);
    },

    inputChangeBaseScore(e) {
      this.baseScore = this.getUtilScore(e.target.value);
      this.maxScore = parseFloat(this.maxScore) > parseFloat(this.baseScore)
        ? parseFloat(this.baseScore) : this.maxScore;
      this.standardScore = parseFloat(this.standardScore) > parseFloat(this.maxScore)
        ? parseFloat(this.maxScore) : this.standardScore;
    },

    inputChangeMin(e) {
      const self = this;
      let minScore = self.getUtilScore(e.target.value);
      if(minScore === self.maxScore) minScore = minScore - 1
      this.countNumMin()
      this.countNumMax()
      self.minScore = minScore
    },

    inputChangeMax(e) {
      let maxScore = this.getUtilScore(e.target.value);
      if(this.minScore === maxScore) maxScore = maxScore + 1
      this.countNumMin()
      this.countNumMax()
      if (this.hundredMarkType == 1) {
        maxScore = parseFloat(maxScore) > parseFloat(this.baseScore) ? parseFloat(this.baseScore) : maxScore;
      }
      this.maxScore = maxScore;
      this.standardScore = parseFloat(this.standardScore) > parseFloat(this.maxScore)
        ? parseFloat(this.maxScore) : this.standardScore;
    },

    inputChangeStandardScore(e) {
      let score = this.getUtilScore(e.target.value);
      if (parseFloat(score) > parseFloat(this.maxScore)) {
        score = parseFloat(this.maxScore);
      } else if (parseFloat(score) < parseFloat(this.minScore)) {
        score = parseFloat(this.minScore);
      }
      this.standardScore = score;
    },

    getUtilScore(val) {
      val = val.replace(/[^-?\d\.]/g, '');
      val = val.replace(/\.{2,}/g, '.');
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      val = val.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-');
      val = val.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
      if (val !== '-0' && !isNaN(val) && val.indexOf('.') < 0 && val != '') {
        val = parseFloat(val);
      }
      return val;
    },

    countNumMin(){
      var minScore = parseFloat(this.minScore)
      var maxScore = parseFloat(this.maxScore)
      var middleLow = (((maxScore - minScore) * .5) + minScore)
      this.scoreMiddleLow = Number.isInteger(middleLow) ? middleLow.toFixed(0) : middleLow.toFixed(1)
    },
    countNumMax(){
      var minScore = parseFloat(this.minScore)
      var maxScore = parseFloat(this.maxScore)
      var middleHeight = (((maxScore - minScore) * .8) + minScore)
      this.scoreMiddleHeight = Number.isInteger(middleHeight) ? middleHeight.toFixed(0) : middleHeight.toFixed(1)
    },


    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },


    async getUserInfo(){
      await getAllUserInfoNoAuth().then(res=>{
          this.userList= res.data
        }).catch(err => {
          console.log('error' + err);
        });
    },
    async getDepartAll(){
      await getDepartAll({ type: 0 }).then(res=>{
          this.departList= res.data
        }).catch(err => {
          console.log('error' + err);
        });
    },


    itemInputChanged_a1(val, n){
      const content = filterString.all(val, n);
      this.broadcastTitle = content
      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit_a1 = true
      } else {
        this.showInputLimit_a1 = false
      }
    },
  },
};
</script>

<style lang="sass">
  .title-status
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button 
      -webkit-appearance: none
      margin: 0
</style>

<style lang="sass" scoped>
  .input-name_short
    width: 60px
    // height: 30px
    // margin: 0 8px
  
  .input-name_short.el-input--medium >>> .el-input__inner
    height: 30px
    line-height: 30px
    font-size: 12px
    padding: 0 10px !important
    

  .submit_btn
    margin-bottom: 20px
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center

  .send_content
    width: 95%
    margin: 0 auto
    margin-bottom: 60px
    margin-top: 20px
    padding-bottom: 40px
    .title-name
      width: 100%
      font-size: calc(18/1920*100vw)
      text-align: left
      padding: 10px 0
      margin-bottom: 10px
      border-bottom: 1px solid #dedede
      font-weight: bolder
    .subtitle_name
      width: 100px
      color: #006ab7
      font-size: calc(16/1920*100vw)
      text-align: left
      // padding: 10px 0
      margin-left: 30px
      margin-bottom: 10px
      font-weight: bolder

    .send_content_row
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      margin-left: 30px
      font-size: calc(16/1920*100vw)
      padding: 15px 0
      .overall_row
        .title-status
          display: flex
          flex-direction: row
          justify-content: flex-start
          align-items: center
      .row_title
        margin-right: 15px
        width: fit-content
        text-align: left
      .role-all-checkbox
        display: flex
        flex-direction: row
        justify-content: center
        align-items: center
        .group-name
          line-height: 1
    
    .store_content_row
      display: flex
      flex-direction: column
      justify-content: flex-start
      align-items: center
      margin-left: 30px
      font-size: calc(16/1920*100vw)
      padding: 15px 0
      .device-group
        width: 100%
        margin-bottom: 30px
        display: flex
        flex-direction: column
        justify-content: flex-start
        align-items: flex-start
        .group-name
          font-weight: bolder
          margin-left: 8px
        .device-all-checkbox
          margin-bottom: 15px
        .device-content
          width: calc( 100% - 30px )
          margin-left: 30px
          padding: 0px 20px
          padding-top: 20px
          background: #f7f9fa
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          align-items: center
          .device-detail
            margin-right: 40px
            margin-bottom: 20px
            .device-name
              margin-left: 8px
          


  .el-table-content
    width: 100%
    background-color: #fff
    border-radius: 5px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
    position: relative
    // padding-top: calc(30/1920*100vw)
    .list-table
      .table-white 
        /deep/
        .el-table
          box-shadow: none !important
          border: none !important
          background-color: #fff
          padding-left: 12px
          padding-right: 12px

  .button-area
    height: 23px
    padding: 0 5px




  
</style>

