<template>
  <div class="schedule_setting">
    <div class="search-bar">
      <div style="font-size:calc(18/1920*100vw)">排程設定</div>
      <div style="flex:2"></div>
      <delay-button
          class="search-button"
          type="filled"
          size="mini"
          @click="saveScheduleData"
          >
          <span>儲存</span>
      </delay-button>
    </div>
    
    
    <!-- 基本訊息 -->
    <div class="page-container report-setting paper" style="margin-bottom: 40px">
      <div class="setting-titles padding flex-center">
        基本訊息
        <div class="spacer"></div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="inspect-basic flex-row">
          <div class="setting-config">
            <!-- 排程名稱 -->
            <div class="flex-row" style="margin-right: 30px; position: relative;">
              <div class="title-name"><span style="color: #c60957">* </span>排程名稱</div>
              <div class="title-status"> 
                <el-input
                  v-model="taskName"
                  ref="inputName"
                  class="ppip"
                  style="width: 250px"
                  @input="(val) => itemInputChanged(val, 20)"
                  />
                  
              </div>

              <span class="notice" 
                style="margin-right: 30px; position: absolute; bottom: -20px ; left: 92px" 
                v-if="showInputLimit"> 最多可輸入20個字元 
              </span>
              
            </div>

            <!-- 排程名稱 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span> 巡檢表</div>
              <div class="title-status" style="margin-right: 10px"> 
                <el-select
                  v-model="inspectionMode" 
                  placeholder="巡檢表"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(_item, index) in inspectionStyle"
                    :key="index"
                    :label="_item.label"
                    :value="_item.value"
                  />
                </el-select>
              </div>
              <div class="title-status"> 
                <el-select
                  v-model="inspectionName" 
                  placeholder="巡檢表名稱"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(_item, index) in inspectTypeList"
                    :key="index"
                    :label="_item.name"
                    :value="_item.id"
                  />
                </el-select>
              </div>
            </div>
        </div>

        </div>
      </div>
    </div>

    <!-- 巡檢門店 -->
    <div class="page-container report-setting paper" >

      <div class="setting-titles padding flex-center">
        巡檢門店（請設定為當地時間）
        <div class="spacer"></div>

        <div class="flex-row" style="margin-right: 30px">
          <div class="title-name">關鍵字</div>
          <div class="title-status" > 
            <el-input
              v-model="inputSearchStoreList"
              ref="inputSearchStoreList"
              class="ppip"
              style="width: 250px"
              clearable
              />
          </div>
        </div>
        <div class="buttons">
          <!-- 加入門店 -->
          <delay-button
            class="red_border"
            type="primary"
            size="mini"
            @click="showingAddStore = true"
            >
            <span> + 加入門店</span>
          </delay-button>

          <!-- 編輯 -->
          <delay-button
            class="blue_border"
            type="primary"
            size="mini"
            :class="{ btn_disable: !edit_isActive }"
            :disable="!edit_isActive"
            @click="showingEditStore = true"
            >
            <span>編輯</span>
          </delay-button>
          
          <!-- 刪除 -->
          <delay-button
            class="blue_border"
            type="primary"
            size="mini"
            :class="{ btn_disable: !del_isActive }"
            :disable="!del_isActive"
            @click="showConfirmDelete = true"
            >
            <span>刪除</span>
          </delay-button>
        </div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <!-- 暫無數據 -->
        <div class="inspect-basic empty_data" v-if="hasScheduleData == false">
          <img
            :src="emptyData"
            alt="emptyData"
          />
          <p style="color: #b7c7df">暫無數據</p>
        </div>
        

        <!-- 有數據 -->
        <div class="inspect-basic flex-column" v-else>
          <!-- 全部門店 -->
          <div class="role-all-checkbox" style="margin-bottom: 25px">
            <el-checkbox
              v-model="seleAllSchedule" 
              class="storevue-checkbox-filled" 
              style="margin-right: 8px"
              @change="selectAll"
            />
            <span class="group-name">全部門店</span>
          </div>

          <div class="task_list" style="width: 100%">
              <!-- 門店 -->
              <div class="store_list flex-column" v-for="(_item, index) in showScheduleDataList" :key="index" v-show="_item.taskList.length > 0">
                <!-- 區域 -->
                <div class="role-all-checkbox" style="margin-bottom: 10px" >
                  <el-checkbox
                    v-model="_item.checked"
                    class="storevue-checkbox-filled" 
                    style="margin-right: 8px"
                    @change="selectProvince(_item)"
                  />
                  <span class="group-name">{{_item.province}} - {{_item.city}}</span>
                </div>
                
                <div class="task_list flex-column">
                  <div class="task_list_store flex-column" v-for="item in _item.taskList" :key="item.id" >
                    <!-- 店名 -->
                    <div class="" style="margin-bottom: 5px">
                      <el-checkbox
                        class="storevue-checkbox-outlined"
                        v-model="item.checked"
                        style="margin-right: 8px"
                        :disabled="(item.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && item.remindTime !== '' )"
                        @change="handleCheckboxChange(item)"
                        
                        />
                        <span class="role-name">{{item.storeName}} <span style="color: #999; font-size: 13px" v-if="item.timeZone">({{item.timeZone}})</span></span>
                    </div>
                    <div class="memo_setting" >
                      <!-- 執行日期 -->
                      <div class="remider_setting flex-column">
                        <p>執行日期  <span style="color: brown">{{ item.remindDate }}</span> </p> 
                        <el-date-picker
                          v-model="item.remindDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerOptions"
                          :disabled="(item.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && item.remindTime !== '' )"
                          placeholder="執行日期">
                        </el-date-picker>
                        <div class="notice" v-if="item.hasRemindDate">請完成執行日期設定 !</div>
                      </div>
                      <!-- 提醒時間 -->
                      <div class="remider_setting flex-column">
                        <p>提醒時間</p>
                        <el-time-select
                          v-model="item.remindTimePoint"
                          :picker-options="{
                            start: '00:00',
                            step: '01:00',
                            end: '23:00'
                          }"
                          :disabled="(item.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && item.remindTime !== '')"
                          placeholder="提醒時間">
                        </el-time-select>
                        <div class="notice" v-if="item.hasRemindTime">請完成提醒時間設定 !</div>
                      </div>

                      <!-- 提醒方式 -->
                      <div class="remider_setting flex-column">
                        <p>提醒方式</p>
                        <el-select
                          v-model="item.remindStyle"
                          placeholder="提醒方式"
                          multiple
                          filterable
                          :disabled="(item.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && item.remindTime !== '')"
                          style="width:300px"
                          >
                          <el-option
                            v-for="(_item, index) in selectRemiderStyle"
                            :key="index"
                            :label="_item.label"
                            :value="_item.value"
                          />
                        </el-select>
                        <div class="notice" v-if="item.hasRemindStyle">請完成提醒方式設定 !</div>
                      </div>
                      <div class="remider_setting flex-column">
                        <div v-if="(item.remindTime > new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 ) || !item.remindTime || item.tempId "
                        class="clear_all"
                        @click="resetData(item)"
                        >重設 </div>
                      </div>
                    </div>

                    <!-- <div class="aaaa">aaaa</div> -->
                  </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Add Store -->
    <dialog-pop
      ref="dailog"
      class="popup_width"
      title= "加入門店"
      :close-on-click-modal="false"
      :show-close="false"
      :dialogWidth = "add_width"
      :visible="showingAddStore"
      @cancelHandler="hideAddStoreDialog('showingAddStore')"
      @confirmHandler="confirmAddStoreDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          <div class="showing_search_user">
            <div class="filter_section">
                <!-- 關鍵字 -->
                <div class="flex-row" style="margin-right: 3%; margin-bottom: 10px;">
                  <div class="title-name">{{$t('audit.workFlows.keywords')}}</div>
                  <div class="title-status"> 
                    <el-input
                      v-model="inputSearchStore"
                      placeholder="搜尋門店或時區"
                      style="width: 200px"
                      clearable
                      />
                  </div>
                </div>
                <!-- 區域一 -->
                <div class="flex-row" style="margin-right: 3%; margin-bottom: 10px;">
                  <div class="title-name"> 區域一</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTempProvinceList"
                      placeholder="區域一"
                      multiple
                      style="width: 180px"
                      @change="onselect"
                      >
                      <el-option
                        v-for="(item, index) in provinceAry"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- 區域二 -->
                <div class="flex-row" style="margin-right: 3%; margin-bottom: 10px;">
                  <div class="title-name">區域二</div>
                  <div class="title-status"> 
                    <el-select
                      v-model="curTempCityList"
                      placeholder="區域二"
                      multiple
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in cityAry"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
            </div>
            <div class="is_select">
              <div class="title-name"> 選擇門店 </div>
              <div class="user_selected">
                <el-tag
                  v-for="(tag, index) in tags"
                  :key="index"
                  closable
                  :type="tag.type"
                  @close="handleClose(tag)">
                  {{tag.name}}
                </el-tag>
              </div>
            </div>


            <div class="users" style="width: 100%">
              <el-table
                ref="storeDataList"
                :data="showSearchStoreData"
                style="width: 100%"
                class="table-white"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column v-for="(_item,_index) in storeColumnData"
                  :key="_item.label"
                  :prop="_item.prop"
                  :label="_item.label"
                />
                
              </el-table>
            </div>

            <!-- <div class="users">
              <table-only
                ref="storeDataList"
                class="table-white"
                :column-data ="storeColumnData"
                :table-data ="showSearchStoreData"
                :showSelectionColumn = showSelectionColumn
                
                :highlight-current-row = "false"
                :is-loading-data ="isLoadingData"
                :allowRowExpand = "false"
                :showBorder = "false"
                :headerStyle ="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                :cellStyle ="{backgroundColor: '#fff !important'}"
                @handleSelectionChange = "handleSelectionChange "
              />
            </div> -->
          
          </div>
        </div>
      </div>
    </dialog-pop>


    <!-- Edit Store -->
    <dialog-pop
      ref="dailog"
      title= "排程設定"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showingEditStore"
      @cancelHandler="hideEditStoreDialog('showingEditStore')"
      @confirmHandler="confirmEditStoreDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">

          <div class="memo_setting">
            <!-- 執行日期 -->
            <div class="remider_setting flex-column">
              
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span> 執行日期</p>
              <el-date-picker
                v-model="editSchedule.remindDate"
                type="date"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="執行日期">
              </el-date-picker>
            </div>
            <!-- 提醒時間 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span>提醒時間</p>
              <el-time-select
                v-model="editSchedule.remindTimePoint"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00'
                }"
                placeholder="提醒時間">
              </el-time-select>
            </div>
          </div>
          <div class="memo_setting ">
            <!-- 提醒方式 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span>提醒方式</p>
              <el-select
                v-model="editSchedule.remindStyle"
                multiple
                filterable
                :loading="loading" 
                style="width:300px">
                <el-option
                    v-for= "(selected, index) in selectRemiderStyle"
                    :label= "selected.label"
                    :value= "selected.value"
                    :key= "index"
                  />
              </el-select>
            </div>
          </div>

          <div class="memo_setting">
            <!-- 已選門店總數 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900">已選門店總數： {{ handleSchedule.length}}</p>
              <div class="selected_stores flex-column">
                <div class="store_name" v-for="(_store, index) in handleSchedule" :key="index">{{_store.storeName}}</div>

              </div>
            </div>
          </div>


        </div>
      </div>
    </dialog-pop>
    <dialog-pop
      :title="$t('schedule.deleteSchedule')"
      :isWarning="true"
      :visible="showConfirmDelete"
      @cancelHandler = "showConfirmDelete=false"
      @confirmHandler="deleteSchedule"
      >
      <div class="dialog-slot">
        是否需要刪除已選擇的門店？
      </div>
    </dialog-pop>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {scheduleRESTful} from '@/api/index';
import { getBriefStoreList} from '@/api/store';
import {  GetInspectTagList } from '@/api/inspect';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import DialogPop from '@/components/DialogPop';
import TableOnly from '@/components/TableOnly';
import util from '@/common/util';
import filterString from '@/common/filterString.js';

export default{
  name: 'PersonalSchedule',
  components: {
    TableOnly,
    DialogPop,
    DateTimeSelector,
    DelayButton,
    SettingTable,
    
    
  },
  data(){
    return {

      multipleSelection: [],
      
      showConfirmDelete:  false,
      showInputLimit: false,
    
      edit_isActive: false,
      del_isActive: false,

      taskName:'',
      scheduleStatus: {},
      
      hasScheduleData: true,
      scheduleDataList:[],

      showScheduleDataList:[],
      ori_showScheduleDataList: [],
      selectRemiderStyle:[
        {
          value: 'remindMode_Currently',
          label: '當下'
        },
        {
          value: 'remindMode_OneDay',
          label: '前一日'
        },
        {
          value: 'remindMode_OneHour',
          label: '前1小時'
        },
      ],
      storeList: [],
      emptyData: require('../../../../static/img/icon_data.svg'),
      handleSchedule: [],
      seleAllSchedule: false,
      
      editSchedule:{
        remindDate:'',
        remindTimePoint:'',
        remindStyle:[]
      },
      
        
  
      // ======
      add_width: "1000",
      edit_width: "500",
      showingAddStore: false,
      showingEditStore: false,
      storeColumnData: [
        {
          'prop': 'province',
          'label': "區域一",
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'city',
          'label': "區域二",
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'name',
          'label': "門店",
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'timeZone',
          'label': "門店時區",
          'width': 100,
          'maxWidth': 100,
        },
      ],

      searchStoreData:[],
      selectStoreTags: [],
      tags: [],
      addStoreTemp: [],


      inputSearchStore:'',
      curTempProvinceList:'',
      provinceAry:[],
      curTempCityList:'',
      cityAry:[],

      inputSearchStoreList:'',
      showSelectionColumn: true,
    // ======
      
      inputSearchValue:'',
      dateValue:[],
      scheduleList:[],
      columnOperationData:{
        label: this.$t('titleView.operation'),
        minWidth: '50',
        align: 'left',
        operation: [
            {
              lable: '',
              icon: 'icon-copy',
              methods: 'copy'
            },
            {
              lable: '',
              icon: 'icon-setting',
              methods: 'set'
            }
        ]
      },
      loading: false,
      isLoadingData: true,
      total:0,
      curPage:1,
      curSizeNum:10,
      defaultSort:{prop: 'startDate', order: 'descending'},

      inspectionMode:'',
      inspectionName:'',
      inspectionStyle: [
        {
          value : 1,
          label: '現場巡檢'
        },
        {
          value : 0,
          label: '遠端巡檢'
        },
      ],
      allInspectTypeList: [],
      inspectTypeList: [],

      pickerOptions: {
        disabledDate(time) {
            return Date.now() > time.getTime()  ;
          }
      }
      
    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch:{
    handleSchedule(val){

      console.log('val', val)
      this.edit_isActive = val.length == 0 ? false : true
      this.del_isActive = val.length == 0 ? false : true
      if(val.length == 0) this.seleAllSchedule = false

      // var isBeforeToday = this.handleSchedule.some(t => (t.remindTime  < Date.now()))
      // if(isBeforeToday ) this.edit_isActive = false
    },

    inspectionMode(val){
      console.log('inspectionMode val', val)
      this.inspectTypeList = [...this.allInspectTypeList]
      this.inspectTypeList = this.inspectTypeList.filter( i => i.mode === val)
      this.inspectionName = this.inspectTypeList[0].id
    },

    showScheduleDataList :{
      handler(newValue){
        // console.log('newValue :>> ', newValue);
        newValue.forEach( i => {
          var cancelChecked = i.taskList.every(t => t.checked == false)
          if(cancelChecked) i.checked = false
        }) 
        
      },
      deep:true
    },

    inputSearchStoreList(val){
      
      if(val.trim()!=""){
        var stores = []
        stores = this.showScheduleDataList.filter(item => (
          item.city.indexOf(val.toLowerCase()) > -1  || item.province.indexOf(val.toLowerCase()) > -1
        ))

        console.log('stores', stores)

        if(stores.length > 0){
          this.showScheduleDataList = stores
          return
        } else {
          
          // this.showScheduleDataList = this.ori_showScheduleDataList
          const results = [];

          this.showScheduleDataList.forEach((c) => {
            console.log('c :>> ', c);
            const match_stores = c.taskList.filter((s) => s.storeName.toLowerCase().indexOf(val.toLowerCase()) !== -1);
            console.log('match_stores.length', match_stores.length)
            if (!match_stores.length) return;
            
            results.push({
              ...c,
              taskList: match_stores,
            });
          });
          this.showScheduleDataList = results
        }
      } 
        else {
        this.showScheduleDataList = this.ori_showScheduleDataList
      }
    }
  
  },
  mounted() {
    this.showSearchStoreData = this.searchStoreData
    this.searchSheduleDataList = this.scheduleDataList 
  },

  computed: {
    // searchSheduleDataList :{
    //   get(){
    //     return this.filterInputSearchScheduleDataList(this.scheduleDataList)
    //   },
    //   set(val){
    //     console.log('val', val)
		// 	}
    // },

    showSearchStoreData :{
      get(){
        return this.filterInputSearchStore(this.filterCurTemplateProvince(this.filterCurTemplateCity(this.searchStoreData)))
      },
      set(val){
        console.log('val', val)
			}
    }
  },

  async created() {
    await this.init()
  },

  methods: {
    // filterInputSearchScheduleDataList(data){
    //   return data.filter( item => (item.storeName.indexOf(this.inputSearchStoreList) > -1))
    // },




    // dialoge
    filterInputSearchStore(stores){
        return stores.filter( item => (item.name.indexOf(this.inputSearchStore) > -1) ||  (item.timeZone.indexOf(this.inputSearchStore) > -1))
    },
    filterCurTemplateProvince(stores){
        
        console.log('this.curTempProvinceList', this.curTempProvinceList)
        if(this.curTempProvinceList.length == 0 ){
          return stores
        }else{
          
          // return stores.filter(item => item.province.includes(this.curTempProvinceList))
          return stores.filter(item => this.curTempProvinceList.includes(item.province))
        }
    },
    filterCurTemplateCity(stores){
      if(this.curTempCityList.length == 0){
        return stores
      }else{
        // return stores.filter(item => item.city == this.curTempCityList )
        return stores.filter(item => this.curTempCityList.includes(item.city))
      }
    }, 

    
    onselect(val){
      var c = this.showSearchStoreData.map(c => c.city)
      const cccSet = new Set(c)
      this.cityAry = [...cccSet]
    },


    async init(){
      await this.getBriefStoreList();
      await this.getTagAll()


      var status = sessionStorage.getItem('scheduleParams');
      this.scheduleStatus = JSON.parse(status)
      console.log('this.scheduleStatus  !!=========>>', this.scheduleStatus)
      console.log('this.inspectionName', this.inspectionName)
      
      if(this.scheduleStatus.action == "editSchedule"){
        this.hasScheduleData = true
        this.taskName = this.scheduleStatus.taskName
        
        var status =  this.allInspectTypeList.find( d => d.name == this.scheduleStatus.tagName)
        this.inspectionMode = status.mode
        
        await this.getPersonScheduleData();
      }
      else if(this.scheduleStatus.action == "addSchedule"){
        this.hasScheduleData = false
        this.inspectionMode = 1
        var tempN = this.allInspectTypeList.filter( i => i.mode === 1)
        this.inspectionName = tempN[0].id
        
      }
      this.isLoadingData = false
      
    },

    // 取得巡檢表
    getTagAll() {
      return new Promise((resolve, reject) => {
        GetInspectTagList().then(res => {
          const data = res.data;
          resolve(data);

          this.allInspectTypeList = data.map(i => ({
            id: i.id,
            name: i.name,
            mode: i.mode
          }))
          console.log(' this.allInspectTypeList =========>>>> ',  this.allInspectTypeList)
          
        }).catch(err => {
          reject(err);
        });
      });
  },
  

    async getBriefStoreList() {
      await getBriefStoreList().then(res => {
        this.storeList = res.data
        console.log('this.storeList =========>>>> ', this.storeList);
        this.searchStoreData = [...this.storeList]
        
        console.log('this.searchStoreData =========>>>> ', this.searchStoreData);

        var p = this.searchStoreData.map(p => p.province)
        const pppSet = new Set(p)
        this.provinceAry = [...pppSet]


        var c = this.searchStoreData.map(c => c.city)
        const cccSet = new Set(c)
        this.cityAry = [...cccSet]
      
      })
    },
    async getPersonScheduleData(){
      var param = {
        taskGroupUuid: this.scheduleStatus.taskGroupUuid
        }
      await scheduleRESTful.getPersonScheduleData(param).then(res =>{
          if(res.errCode == 0){
            res.data.forEach(i => {
              this.storeList.forEach(store => {
                if(i.storeId == store.storeId){
                  i.storeName = store.name
                  i.city = store.city
                  i.province = store.province
                  i.remindDate = this.getdate(i.remindTime )
                  i.remindTimePoint = this.getTimePoint(i.remindTime)
                  i.checked = false
                  i.timeZone = store.timeZone
                  i.remindStyle = []
                  if(i.remindMode_Currently == true) i.remindStyle.push("remindMode_Currently")
                  if(i.remindMode_OneDay == true) i.remindStyle.push("remindMode_OneDay")
                  if(i.remindMode_OneHour == true) i.remindStyle.push("remindMode_OneHour")
                }
              })
              
            });
            this.scheduleDataList = res.data
            this.inspectionName = res.data[0].inspectTagId
            console.log('this.scheduleStatus =========>> 0000', this.scheduleStatus);
            console.log('this.scheduleDataList =========>> 0000', res.data);


            var noRepeat =  this.searchStoreData.filter((item, index, array) => array.findIndex(s => item.city === s.city) === index)
            var newArr = noRepeat.map( s => ({
              city: s.city,
              province: s.province,
              checked: false,
              taskList: []
            }))

            console.log('newArr', newArr)
            newArr.forEach(d => {
              this.scheduleDataList.forEach( g => {
                g.hasRemindDate = false
                g.hasRemindTime = false
                g.hasRemindStyle = false
                if(d.province == g.province && d.city == g.city){
                  d.taskList.push(g)
                }
              })
              
            })

            this.showScheduleDataList = newArr
            this.ori_showScheduleDataList = newArr
            console.log('this.showScheduleDataList', this.showScheduleDataList)
          }
        }
      )
    },

    itemInputChanged(val, n){
      const content = filterString.all(val, n);
      this.taskName = content

      const length = filterString.getContentLength(val);
      if(length > n) {
        this.showInputLimit = true
      } else {
        this.showInputLimit = false
      }
    },

    // SAVE
    saveScheduleData(){
      this.isLoadingData = true
      console.log('this.showScheduleDataList =======>> 1', this.showScheduleDataList);
      console.log('this.scheduleStatus', this.scheduleStatus)
      
      if(this.showScheduleDataList.length < 1){
        util.notify("請至少設定一筆排程！", 'error', 2000 );
        this.isLoadingData = false
        return
      }

      if(this.taskName == ''){
        util.notify("排程名稱不可為空", 'error', 2000 );
        this.isLoadingData = false
        return
      }

      if(this.inspectionName == ''){
        util.notify("請選擇巡檢表", 'error', 2000 );
        this.isLoadingData = false
        return
      }
      // if(this.scheduleDataList.length < 1){
      //   util.notify("請至少設定一筆排程！", 'error', 2000 );
      //   this.isLoadingData = false
      //   return
      // }

  
      var param = {
        taskList: []
      }
      // param.taskList = [...this.scheduleDataList]

      var isEmpty = false
      console.log('this.showScheduleDataList =======>> 2', this.showScheduleDataList);
      this.showScheduleDataList.forEach( i => {
        i.taskList.forEach(ii => {
          
          if(!ii.remindDate) {
            ii.hasRemindDate = true
            isEmpty = true
          } else {
            ii.hasRemindDate = false
          }

          if(!ii.remindTimePoint) {
            ii.hasRemindTime = true
            isEmpty = true
          } else {
            ii.hasRemindTime = false
          }

          if(ii.remindStyle.length ==0) {
            ii.hasRemindStyle = true
            isEmpty = true
          }else {
            ii.hasRemindStyle = false
          }

          param.taskList.push(ii)
        })
      })

      // var isEmpty = param.taskList.findIndex(i => (!i.remindTime ||  i.remindDate == '' || i.remindTimePoint == ''))
      // console.log('isEmpty :>> ', isEmpty); 
      if(isEmpty){  
        util.notify("尚有設定未完成！", 'error', 2000 );
        this.isLoadingData = false
        return false
      }

      var status =  this.allInspectTypeList.find( d => d.id == this.inspectionName)
      if(this.scheduleStatus.action == "addSchedule"){
        console.log('addSchedule')
        param.userId = this.scheduleStatus.userId
        param.inspectTagId = status.id
        param.taskName = this.taskName
      } 
      else if(this.scheduleStatus.action == "editSchedule"){
        console.log('editSchedule')
        param.userId = this.scheduleStatus.userId
        param.inspectTagId = status.id
        param.taskName = this.taskName
        param.taskGroupUuid = this.scheduleStatus.taskGroupUuid
      }
      
      param.taskList.forEach(i => {
        i.taskId = i.hasOwnProperty("id") ? i.id : -999
        i.isRemindModeCurrently = i.remindStyle.includes('remindMode_Currently') ? true : false
        i.isRemindModeOneHour = i.remindStyle.includes('remindMode_OneHour') ? true : false
        i.isRemindModeOneDay = i.remindStyle.includes('remindMode_OneDay') ? true : false
        var t = i.remindDate + " " + i.remindTimePoint + " " + "GMT+00:00"
        var gmt = new Date(t).getTime()
        i.remindTime = gmt
      })

      console.log('param for save =======>> ', param)
      // if(param.taskList.some(i => i.remindStyle.length ==0)){
      //   util.notify("提醒方式欄位為必填不可留空！", 'error', 2000 );
      //   this.isLoadingData = false
      //   return false
      // }
      
      

      // this.isLoadingData = false
      // return false



      if(param.taskList.length < 1){
        util.notify("請至少設定一筆排程！", 'error', 2000 );
        this.isLoadingData = false
        return
      }

      scheduleRESTful.saveScheduleData(param).then(res =>{
        if(res.errCode === 0){
          console.log("this.scheduleDataList====> 3", this.scheduleDataList)

          this.showScheduleDataList.forEach( i => {
            i.taskList.forEach(ii => {
              ii.hasRemindDate = false
              ii.hasRemindTime = false
              ii.hasRemindStyle = false
            })
      })
            this.isLoadingData = false
            util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
        }
      })
    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },
    getdate(t){
      var date = new Date(t);
      var month = this.pad2(date.getUTCMonth()+1);
      var day = this.pad2(date.getUTCDate());
      var year= date.getUTCFullYear();
      return year + "-"+ month +"-"+ day 
    },
    getTimePoint(t){
      var date = new Date(t);
      var hour = this.pad2(date.getUTCHours())
      var min = this.pad2(date.getUTCMinutes())
      var sec = this.pad2(date.getUTCSeconds())
      return hour +":"+ min
    },

    
    
    hideAddStoreDialog(key){
      this[key] = false;

      this.inputSearchStore = ''
      this.curTempProvinceList = ''
      this.curTempCityList = ''
      
      // 清除所有勾選
      console.log('this.$refs.storeDataList. :>> ', this.$refs.storeDataList);
      this.$refs.storeDataList.clearSelection()
    },

    // 刪除 tag
    handleClose(tag){
      console.log('tag--->', tag)
      this.tags.splice(this.tags.indexOf(tag), 1);

      var row = this.showSearchStoreData.filter(element => 
          element.name == tag.name
      );

      this.$refs.storeDataList.toggleRowSelection(row[0])
    },
    

    handleSelectionChange(val){
      console.log('handleSelectionChange val :>> ', val);
      
      // tag 用
      this.selectStoreTags = val

      this.tags = this.selectStoreTags.map(_item => (
        {
          name : _item.name,
          type: 'info'
        }
      ))
      // console.log('this.tags', this.tags)

      // 顯示頁面用
      this.addStoreTemp = val.map((_item, index, array) => (
        {
          taskId: -999,
          storeId: _item.storeId,
          storeName: _item.name,
          city: _item.city,
          province: _item.province,
          isRemindModeOneDay: false,
          isRemindModeOneHour: false,
          isRemindModeCurrently: false,
          remindTime: '',
          timeZone: _item.timeZone,
          tempId: Math.random().toString(36).slice(2)
        }
      ))
      console.log('this.addStoreTemp', this.addStoreTemp)
    },

    confirmAddStoreDialog(){
      console.log('confirmAddStoreDialog --->')
      console.log('this.showScheduleDataList ::::>>>>', this.showScheduleDataList)
      
      this.showingAddStore = false
      // this.scheduleDataList = [...this.addStoreTemp, ...this.scheduleDataList]

      if(this.scheduleStatus.action == "addSchedule") {
        if(this.showScheduleDataList.length == 0){
          var noRepeat =  this.searchStoreData.filter((item, index, array) => array.findIndex(s => item.city === s.city) === index)
            var newArr = noRepeat.map( s => ({
              city: s.city,
              province: s.province,
              checked: false,
              taskList: [],
              
            }))

            console.log('newArr', newArr)
            newArr.forEach(d => {
              this.addStoreTemp.forEach( g => {
                if(d.province == g.province && d.city == g.city){
                  d.taskList.unshift(g)
                  
                }
              })
            })
            this.showScheduleDataList = newArr
        }else{
          this.showScheduleDataList.forEach( i =>{
            this.addStoreTemp.forEach(t => {
              if(i.city == t.city && i.province == t.province){
                i.taskList.unshift(t)
              }
            })
          })
        }
      } 
      else if(this.scheduleStatus.action == "editSchedule"){
        this.showScheduleDataList.forEach( i =>{
          this.addStoreTemp.forEach(t => {
            if(i.city == t.city && i.province == t.province){
              i.taskList.unshift(t)
            }
          })
        })
      }
      console.log('this.showScheduleDataList end', this.showScheduleDataList)
      this.$refs.storeDataList.clearSelection()
      this.hasScheduleData = true
    },



    confirmEditStoreDialog(){
      console.log('this.editSchedule :>> ', this.editSchedule);
      console.log('this.handleSchedule :>> ', this.handleSchedule);

      let needEditId = this.handleSchedule.map(_item => _item.storeId)
      console.log('needEditId :>> ', needEditId);

      this.showScheduleDataList.forEach(_item => {
        _item.taskList.forEach(l => {
          needEditId.forEach(id => {
          if(l.storeId == id){
            l.checked = false
            l.remindDate = this.editSchedule.remindDate
            l.remindTimePoint = this.editSchedule.remindTimePoint
            l.remindStyle = this.editSchedule.remindStyle
          }
        })
        })
      })
      this.handleSchedule = []
      this.showingEditStore = false

      this.seleAllSchedule = false
      
      this.showScheduleDataList.forEach(_item => {
        _item.checked = false
        _item.taskList.forEach(l => {
          l.checked = false
        })
      })
      this.editSchedule.remindDate = ''
      this.editSchedule.remindTimePoint = ''
      this.editSchedule.remindStyle = []

    },

    hideEditStoreDialog(key){
      this[key] = false;
      this.handleSchedule = []
      this.seleAllSchedule = false
      
      this.showScheduleDataList.forEach(_item => {
        _item.checked = false
        _item.taskList.forEach(l => {
          l.checked = false
        })
      })
      this.editSchedule.remindDate = ''
      this.editSchedule.remindTimePoint = ''
      this.editSchedule.remindStyle = []
      
      
      console.log('this.editSchedule :>> ', this.editSchedule);
    },

    selectAll(val){
      this.handleSchedule = []
      if(val){
        this.showScheduleDataList.forEach(i =>{
          i.checked = true
          i.taskList.forEach(t =>{
            t.checked = true
            this.handleSchedule.push(t)
          })
        })
      } else {
        this.showScheduleDataList.forEach(i =>{
          i.checked = false
          i.taskList.forEach(t =>{
            t.checked = false
            this.handleSchedule = []
          })
        })
      }
      console.log('this.handleSchedule :>> ', this.handleSchedule);
    },

    selectProvince(val){
      console.log('val selectProvince:>> ', val);
      if(val.checked){
        this.showScheduleDataList.forEach( i => {
          i.taskList.forEach(t => {
            if(t.city === val.city) {
              t.checked = true
              this.handleSchedule.push(t)
            }
          })
        })
      } else {
        this.showScheduleDataList.forEach( i => {
          i.taskList.forEach(t => {
            if(t.city === val.city) t.checked = false
            this.handleSchedule = this.handleSchedule.filter(t => t.checked)
          })
        })
      }

      console.log('this.handleSchedule :>> ', this.handleSchedule);
      console.log('this.showScheduleDataList :>> ', this.showScheduleDataList);
    },

    handleCheckboxChange(val){
      if(val.checked == true) {
        this.handleSchedule.push(val)
      } else if (val.checked == false){

        var n = this.handleSchedule.findIndex(i => i.checked == false)
        this.handleSchedule.splice(n, 1)
      }
      console.log('this.handleSchedule', this.handleSchedule)
    },

    deleteSchedule(){
      console.log('delete!!!!! :>>');
      console.log('this.showScheduleDataList', this.showScheduleDataList)

      var num = 0
      this.showScheduleDataList.forEach(i => (
        num = num + i.taskList.length
      ))
      console.log('num :>> ', num);

      if(this.handleSchedule.length === num){
        util.notify("請至少設定一筆排程！", 'error', 2000 );
        return
      }

      if(this.scheduleStatus.action == "addSchedule"){
        let deltedId = this.handleSchedule.map(a => a.tempId)
        console.log('deltedId :>> ', deltedId);

        this.showScheduleDataList.forEach( i =>{
          i.taskList = i.taskList.filter(b => !deltedId.includes(b.tempId))
        })
      }
      else if(this.scheduleStatus.action == "editSchedule"){
        let deltedId = this.handleSchedule.map(a => a.id)
        console.log('deltedId :>> ', deltedId);

        this.showScheduleDataList.forEach( i =>{
          i.taskList = i.taskList.filter(b => !deltedId.includes(b.id))
        })
      }
      
      this.handleSchedule = []
      this.showConfirmDelete = false
      
    },
    resetData(val){
      console.log('val', val)
      console.log('this.showScheduleDataList', this.showScheduleDataList)
      val.remindTime = ''
      val.remindDate = ''
      val.remindTimePoint = ''
      // val.remindStyle = []
      // this.scheduleDataList.forEach( i => {
      //   if(i.id == val.id ){
      //     console.log('1')
      //     i.remindTime = ''
      //     i.remindDate = ''
      //     i.remindTimePoint = ''
      //     i.remindStyle = []
      //   }
        
      // })
    }
  }
}
</script>

<style scoped lang="sass">
  .btn_disable
    border: 1px solid #C0C4CA !important
    color: #C0C4CA !important
    pointer-events: none !important
    &:hover
      background: #C0C4CA !important
      color: #C0C4CA !important
  .flex-row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
  .flex-column
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start

  .mb-10
    margin-bottom: 10px


  .title-name
      margin-right: 16px
  .red_border
    background-color: #fff
    border-color: #c60957
    color: #c60957
    font-size: 15px
    font-weight: 500
    padding: 8px 16px 7px
    transiiton: all .3s
    &:hover
      background: #c60957
      color: #FFF

  .blue_border
    background-color: #fff
    border-color: #006ab7
    color: #006ab7
    font-size: 15px
    font-weight: 500
    padding: 8px 16px 7px
    transiiton: all .3s
    &:hover
      background: #006ab7
      color: #FFF

  .schedule_setting
    width: 100%
    .search-bar
      display: flex
      flex-direction: row
      margin: 0px 0 20px 0px
      height: calc(36/1920*100vw)
      align-items: center
      font-size: calc(16/1920*100vw)
      .keyword-area
        display: flex
        flex-direction: row
        margin-left: calc(32/1980*100vw)
        align-items: center
        .search-label
          min-width: 45px
          text-align: left
          align-self: center
          font-family: NotoSansCJKTC
          font-size: calc(15/1920*100vw)
          font-weight: normal
          word-break: keep-all
          padding-right: 16px
      .scheduleLlist-area
        background-color: #FFF
        border-radius: 5px
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
        padding: 20px 26px 48px 24px
  .setting-titles
    border-bottom: 1px solid #e3e9f4 

  .empty_data
    height: 50vh
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

  .inspect-basic
    padding: 20px 25px

    .setting-config
      padding-left: 0
    .store_list
      width: 100%
      margin-bottom: 30px
      .task_list
        width: calc(100% - 28px)
        padding: 20px 20px 0 20px
        border-radius: 5px
        border: solid 1px #f5f5f5
        background: #f7f9fa
        margin-left: 28px
        .task_list_store
          margin-bottom: 15px
  .memo_setting
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    margin-bottom: 20px
    p 
      font-size: 12px
      margin: 5px
    .remider_setting
      width: 100%
      margin-right: 20px
      .clear_all
        margin-top: 33px
        color: #006ab7
        cursor: pointer
  .selected_stores
    background: #FFF
    width: 100%
    height: 200px
    padding: 0 20px
    border-radius: 4px
    border: solid 1px #c3c4c5
    overflow: auto
    .store_name
      text-align: left
      width: 100%
      line-height: 35px
      // border-bottom: 1px solid #928

    
            
  // dialog
  .dialog-content
    width: 100%
    .showing_search_user
      width: 100%
      height: 500px
      
      .filter_section
        background: #FFF
        display: flex
        flex-wrap: wrap
        flex-direction: row
        justify-content: flex-start
        align-items: center
        padding: 10px 0 0 20px
        margin-bottom: 10px
        .summit_filter
          width: 90px
          height: 37px
          border-radius: 3px
          background: rgb(85, 102, 121)
          color: #FFF
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          margin-bottom: 10px
          margin-left: 20px
          cursor: pointer
          transition: all .3s
          &:hover
            background: rgb(60, 92, 121)
      .is_select
        width: 100% !important
        padding: 10px 0 5px 0
        background: #FFF
        margin-bottom: 10px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        // width: fit-content
        .title-name
          width: 90px
          // flex: 1 0 auto
        .user_selected
          max-height: 100px
          width: calc(100% - 90px)
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          
          overflow: auto
          .el-tag
            margin-right: 5px 
            margin-bottom: 5px

      .users
        height: 335px
        overflow: auto
        border-radius: 5px
  .notice
    color: red
    font-size: 12px
    margin: 5px 0 0 5px

</style>
<style lang="sass">
  .popup_width
    .el-dialog
      width: 60% !important
      background: #f7f9fa
      .el-table th
        &:first-child
          .cell
            width: 50px
            margin-left: -3px !important
            
  .users
    .el-checkbox__input.is-indeterminate .el-checkbox__inner
      background-color: #2c90d9 !important
      border-color: #2c90d9 !important
    .el-checkbox__input.is-checked .el-checkbox__inner
      background: #2c90d9 !important
      border-color: #2c90d9 !important
      &:hover
        border-color: #dcdfe6 !important
    .is-focus .el-checkbox__inner      
      border-color: #dcdfe6 !important
    
    .el-checkbox__inner:hover
      border-color: #190 !important
      
  .title-status
    .el-input__count-inner
      margin-top: 55px
  
  .text_limit_notice
    position: absolute
    text-align: right
    margin-left: 5px
    font-size: 10px
    margin-top: 2px
    color: #ff2400
    display: block
          
</style>