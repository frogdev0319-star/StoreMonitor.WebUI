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
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span>排程名稱</div>
              <div class="title-status"> 
                <el-input
                  ref="inputName"
                  class="ppip"
                  style="width: 250px"
                  />
              </div>
            </div>

            <!-- 排程名稱 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span> 巡檢表</div>
              <div class="title-status" style="margin-right: 10px"> 
                <el-select
                  :value="ddd" 
                  placeholder="巡檢表"
                  style="width: 250px"

                  >
                  <el-option
                    v-for="(item, index) in inspectionStyle"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div class="title-status"> 
                <el-select
                  :value="ddd" 
                  placeholder="巡檢表名稱"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in templateList"
                    :key="index"
                    :label="item"
                    :value="item"
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
            @click="showingEditStore = true"
            >
            <span>編輯</span>
          </delay-button>
          
          <!-- 刪除 -->
          <delay-button
            class="blue_border"
            type="primary"
            size="mini"
            @click="deleteSchedule"
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
              v-model="tempboolean_1" 
              class="storevue-checkbox-filled" 
              style="margin-right: 8px"
            />
            <span class="group-name">全部門店</span>
          </div>

          <!-- 門店 -->
          <div class="store_list flex-column">
            <!-- 區域 -->
            <div class="role-all-checkbox" style="margin-bottom: 10px">
              <el-checkbox
                v-model="tempboolean_2" 
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">桃園市 - 龜山區</span>
              
            </div>
            
            <div class="task_list flex-column">
              <div class="task_list_store flex-column" v-for="item in searchSheduleDataList" :key="item.id">
                <!-- 店名 -->
                <div class="" style="margin-bottom: 5px">
                  <el-checkbox
                    class="storevue-checkbox-outlined"
                    v-model="item.checked"
                    style="margin-right: 8px"
                    @change="handleCheckboxChange(item)"
                    />
                    <span class="role-name">{{item.storeName}}</span>
                </div>
                <div class="memo_setting">
                  <!-- 提醒日期 -->
                  <div class="remider_setting flex-column">
                    <p>提醒日期</p>
                    <el-date-picker
                      v-model="item.remindDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="提醒日期">
                    </el-date-picker>
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
                      placeholder="提醒時間">
                    </el-time-select>
                  </div>

                  <!-- 提醒方式 -->
                  <div class="remider_setting flex-column">
                    <p>提醒方式</p>
                    <el-select
                      v-model="item.remindStyle"
                      :placeholder="$t('audit.workFlows.inspectionForm')"
                      multiple
                      filterable
                      style="width:300px"
                      >
                      <el-option
                        v-for="(_item, index) in selectRemiderStyle"
                        :key="index"
                        :label="_item.label"
                        :value="_item.value"
                      />

                    </el-select>
                  </div>
                  <div class="remider_setting flex-column">
                    <div 
                    class="clear_all"
                    @click="resetData(item)"
                    >重設</div> 
                  </div>
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
      :title= "$t('audit.workFlows.addCC')"
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
                      placeholder="搜尋門店"
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
                      style="width: 180px"
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
            <div class="users">
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
            </div>
          
          </div>
        </div>
      </div>
    </dialog-pop>

    <!-- Edit Store -->
    <dialog-pop
      ref="dailog"
      title= "編輯所選門店"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showingEditStore"
      @cancelHandler="hideEditStoreDialog('showingEditStore')"
      @confirmHandler="confirmEditStoreDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">

          <div class="memo_setting">
            <!-- 提醒日期 -->
            <div class="remider_setting flex-column">
              
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span> 提醒日期</p>
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="提醒日期">
              </el-date-picker>
            </div>
            <!-- 提醒時間 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span>提醒時間</p>
              <el-time-select
                v-model="value2"
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
                v-model="vvv"
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
              <p style="font-size: 14px; font-weight: 900">已選門店總數：10</p>
              <div class="selected_stores flex-column">
                <div class="store_name" v-for= "(_store, index) in handleSchedule" :key="index">{{_store.storeName}}</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog-pop>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {scheduleRESTful} from '@/api/index';
import { getBriefStoreList} from '@/api/store';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import DialogPop from '@/components/DialogPop';
import TableOnly from '@/components/TableOnly';
import util from '@/common/util';

export default{
  name: 'PersonalSchedule',
  components: {
    DateTimeSelector,
    DelayButton,
    SettingTable,
    TableOnly,
    DialogPop
  },
  data(){
    return {
      ddd: '',
      tempboolean_1: false,
      tempboolean_2: false,
      value1: '',
      value2: '',
      value3: [],
      vvv: ["remindMode_OneDay"],

      templateList:['aaa','bbb','ccc'],
      
      
      // ====== !! ======

      scheduleStatus:'',
      hasScheduleData: true,
      scheduleDataList:[],
      
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
      tableData:[{schName:'1',tagName:'test',incepNum:3,startDate:'2023/01/01',endDate:'2023/01/02'}],
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
      isLoadingData: false,
      total:0,
      curPage:1,
      curSizeNum:10,
      defaultSort:{prop: 'startDate', order: 'descending'},
      inspectionStyle: ['現場巡檢','遠端巡檢'],
      
    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  watch:{

  },
  mounted() {
    this.showSearchStoreData = this.searchStoreData
    this.searchSheduleDataList = this.scheduleDataList 
  },

  computed: {
    searchSheduleDataList :{
      get(){
        return this.filterInputSearchScheduleDataList(this.scheduleDataList)
      },
      set(val){
        console.log('val', val)
			}
    },

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
    filterInputSearchScheduleDataList(data){
      return data.filter( item => item.storeName.indexOf(this.inputSearchStoreList) > -1)
    },

    // dialoge
    filterInputSearchStore(stores){
        return stores.filter( item => item.name.indexOf(this.inputSearchStore) > -1)
    },
    filterCurTemplateProvince(stores){
        if(this.curTempProvinceList.length == 0 ){
          return stores
        }else{
          return stores.filter(item => item.province.includes(this.curTempProvinceList))
        }
    },
    filterCurTemplateCity(stores){
      if(this.curTempCityList.length == 0){
        return stores
      }else{
        return stores.filter(item => item.city == this.curTempCityList )
      }
    }, 




    async init(){
      
      await this.getBriefStoreList();

      var status = sessionStorage.getItem('scheduleParams');
      this.scheduleStatus = JSON.parse(status)
      console.log('this.scheduleStatus  =========>>', this.scheduleStatus)

      if(this.scheduleStatus){
          this.hasScheduleData = true
          
          await this.getPersonScheduleData();
          
      }else {
        this.hasScheduleData = false
      }
        
  
      
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
                  // i.remindTime = this.getdate(i.remindTime)
                  i.remindDate = this.getdate(i.remindTime)
                  i.remindTimePoint = this.getTimePoint(i.remindTime)
                  i.checked = false
                  i.remindStyle = []
                  if(i.remindMode_Currently == true) i.remindStyle.push("remindMode_Currently")
                  if(i.remindMode_OneDay == true) i.remindStyle.push("remindMode_OneDay")
                  if(i.remindMode_OneHour == true) i.remindStyle.push("remindMode_OneHour")
                }
              })
              
            });
            this.scheduleDataList = res.data
            console.log('this.scheduleDataList =========>> ', res.data);

          }
        }
      )
    },

    // SAVE
    saveScheduleData(){
      console.log('this.scheduleDataList =======>> 1', this.scheduleDataList);

      var param = {}
      param.taskList = [...this.scheduleDataList]
      param.taskGroupUuid = this.scheduleStatus.taskGroupUuid
      param.userId = this.scheduleStatus.userId
  
      param.inspectTagId= 643
      param.taskName= "排排程排一排",
      
      param.taskList.forEach(i => {
        i.taskId = i.hasOwnProperty("id") ? i.id : -999
        i.isRemindModeCurrently = i.remindStyle.includes('remindMode_Currently') ? true : false
        i.isRemindModeOneHour = i.remindStyle.includes('remindMode_OneHour') ? true : false
        i.isRemindModeOneDay = i.remindStyle.includes('remindMode_OneDay') ? true : false
        // i.taskId = i.hasOwnProperty(taskId) ? i.id : -999

        var t = i.remindDate + " " + i.remindTimePoint
        var d =  new Date(t)
        i.remindTime = d.getTime()

      })

      console.log('param for save =======>> ', param)
      scheduleRESTful.saveScheduleData(param).then(res =>{
        if(res.errCode === 0){
            console.log("this.scheduleDataList====> 2", this.scheduleDataList)
        }
      })

    },

    pad2(n){
      return (n < 10 ? '0' : '') + n;
    },
    getdate(t){
      var date = new Date(t);
      var month = this.pad2(date.getMonth()+1);
      var day = this.pad2(date.getDate());
      var year= date.getFullYear();
      return year + "-"+ month +"-"+ day 
    },
    getTimePoint(t){
      var date = new Date(t);
      var hour = this.pad2(date.getHours())
      var min = this.pad2(date.getMinutes())
      var sec = this.pad2(date.getSeconds())
      return hour +":"+ min +":"+ sec
    },

    
    
    hideAddStoreDialog(key){
      this[key] = false;

      this.inputSearchStore = ''
      this.curTempProvinceList = ''
      this.curTempCityList = ''
      // 清除所有勾選
      this.$refs.storeDataList.clear()
    },

    hideEditStoreDialog(key){
      this[key] = false;
    },
    
    handleSelectionChange(val){
      console.log('handleSelectionChange val :>> ', val.val);
      // tag 用
      this.selectStoreTags = val.val

      this.tags = this.selectStoreTags.map(_item => ({
          name : _item.name,
          type: 'info'
        }))
      // console.log('this.tags', this.tags)

      // 顯示頁面用
      this.addStoreTemp = val.val.map((_item, index, array) => (
        {
          taskId: -999,
          storeId: _item.storeId,
          storeName: _item.name,
          isRemindModeOneDay: false,
          isRemindModeOneHour: false,
          isRemindModeCurrently: false,
          remindTime: ''
        }
      ))
    },

    // 刪除 tag
    handleClose(tag){
      console.log('tag--->', tag)
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$refs.storeDataList.toggleChecked_store(tag)


    },

    confirmAddStoreDialog(){
      console.log('confirmAddStoreDialog --->')
      this.showingAddStore = false
      this.scheduleDataList = [...this.addStoreTemp, ...this.scheduleDataList]

      console.log('this.scheduleDataList', this.scheduleDataList)
      this.$refs.storeDataList.clear()

    },

    confirmEditStoreDialog(){
      console.log('confirmEditStoreDialog --->')
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
      // console.log('this.scheduleDataList', this.scheduleDataList)
      let deltedId = this.handleSchedule.map(a => a.id)
      let deletedSchedule = this.scheduleDataList.filter(b => !deltedId.includes(b.id))
      this.scheduleDataList = deletedSchedule
            
    },
    resetData(val){
      console.log('val', val)
      this.scheduleDataList.forEach( i => {
        if(i.id == val.id){
          i.remindTime = ''
          i.remindDate = ''
          i.remindTimePoint = ''
          i.remindStyle = []

        }
      })

    }
  }
}
</script>

<style scoped lang="sass">
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
        padding: 20px
        border-radius: 5px
        border: solid 1px #f5f5f5
        background: #f7f9fa
        margin-left: 28px
        .task_list_store
          margin-bottom: 20px
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
        width: fit-content
        .title-name
          width: 90px
        .user_selected
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          .el-tag
            margin-right: 5px 
            margin-bottom: 5px

      .users
        height: 335px
        overflow: auto
        border-radius: 5px
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
            margin-left: -28px
            
</style>



<!-- <style scoped lang="scss">
.ScheduleContainer{
    width:100%;
    .search-bar{
        display:flex;
        flex-direction:row;
        margin: 0px 0 20px 0px;
        height:calc(36/1920*100vw);
        align-items: center;
        font-size:calc(16/1920*100vw);
        .keyword-area{
            display: flex;
            flex-direction: row;
            margin-left: calc(32/1980*100vw);
            align-items: center;
            .search-label{
                min-width: 45px;
                text-align: left;
                align-self: center;
                font-family: NotoSansCJKTC;
                font-size: calc(15/1920*100vw);
                font-weight: normal;
                word-break: keep-all;
                padding-right: 16px;


            }
        }
        .search-button{
            margin-left:35px;
            width: 102px;
            height: calc(36/1920*100vw);
            // background-color: #556679;
            // border-color: #556679;
            color:#fff;
            font-size: calc(15/1920*100vw);
        }
    }
    .scheduleLlist-area{
        background-color: #FFF;
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        padding: 20px 26px 48px 24px;
        .buttons{
            height: 40px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: end;
            align-items: center;
        }
        .tbl-schedule{
            border: none;
            margin-top: 20px;
            /deep/ .el-table__header-wrapper .el-table-column--selection{
                padding-left: 0px !important;
                font-size: 14px !important;
            }
            /deep/.el-table__header-wrapper
            .el-table-column--selection
            .el-checkbox__inner
            {
                border-radius: 1px;
                border: none;
                background-color: #fff;
                &:hover{
                    border-color: #dcdfe6 !important;
                }
            }
            /deep/ .el-table__header-wrapper .el-checkbox{
                display:block;
                .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                    background-color: #2c90d9;
                    border-color: #2c90d9;
                    color:#FFF;
                }
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    color: #1375bc;
                    font-weight: 400;
                    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 0px;
                    border: none;
                }
                .el-checkbox__input.is-focus .el-checkbox__inner {
                border-color: #2c90d9;
                }
                .el-checkbox__inner:hover {
                border-color: #2c90d9;
                }
            }
            /deep/.el-table__body-wrapper .el-checkbox{
                border: none;
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    color: #1375bc;
                    font-weight: 400;
                    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 20px;
                    border: none;
                }
            }
            /deep/ .el-table__body-wrapper::-webkit-scrollbar {
                width: 4px; /*滚动条宽度*/
                height: 150px; /*滚动条高度*/
            }
            /*定义滚动条轨道 内阴影+圆角*/
            /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
                /*box-shadow: 0px 1px 3px #071e4a inset; 滚动条的背景区域的内阴影*/
                border-radius: 10px; /*滚动条的背景区域的圆角*/
                background-color: #FFF; /*滚动条的背景颜色*/
            }
            /*定义滑块 内阴影+圆角*/
            /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
                box-shadow: 0px 1px 3px #acaeb1 inset; /*滚动条的内阴影*/
                border-radius: 2px; /*滚动条的圆角*/
                background-color: #acaeb1; /*滚动条的背景颜色*/
            }
        }
    }
    /deep/
    .el-table{
        border:none;
        box-shadow: none;
    }
    /deep/
      .el-table th .cell{
      padding-left: 0px !important;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .el-checkbox__inner
    {
      border-radius: 1px;
      border: solid 1px #acaeb1;
      background-color: #fff;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .is-checked
    .el-checkbox__inner
    {
      /*border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #e0f2ff;
      color:#2c90d9;
      &::after{
       border-color:#2c90d9;
      }*/
        color: #1375bc;
        font-weight: 400;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
        background-position: center right 0px;
        border: none;
    }
}
</style> -->
