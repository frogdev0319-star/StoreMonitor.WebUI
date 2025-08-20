<template>
  <div class="schedule_setting">
    <div class="search-bar">
      <!-- <div style="font-size:calc(18/1920*100vw)">{{$t('schedule.scheduleSetting')}}</div> -->
      <div style="flex:2"></div>
      <delay-button
          class="search-button"
          type="filled"
          @click="saveScheduleData"
          >
          <div class="button-area" style="width: 80px; height: 20px;">
              <span>{{$t('schedule.save')}}</span>
          </div>
      </delay-button>
    </div>

    <!-- 排程設定 -->
    <div class="page-container report-setting paper" style="margin-bottom: 40px">
      <div class="setting-titles padding flex-center">
        重複排程設定
        <div class="spacer"></div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="inspect-basic flex-row">
          <div class="setting-config" style="margin-top: 30px;">

            <!-- 排程名稱 -->
            <div class="flex-row" style="margin-right: 30px; position: relative;">
              <div class="title-name"><span style="color: #c60957">* </span> {{$t('scheduleView.scheduleName')}}</div>
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
                v-if="showInputLimit"> {{$t('schedule.maxCharacter')}}
              </span>
            </div>


            <!-- 巡檢表 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span> 巡檢表</div>
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


        <div class="inspect-basic flex-row">
          <div class="setting-config">
            <!-- 巡檢地點 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span> 巡檢地點</div>
              <div class="title-status">
                <el-select
                  v-model="selectStore"
                  placeholder="巡檢地點"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in storeList"
                    :key="item.storeId"
                    :label="item.name"
                    :value="item.storeId"
                  />
                </el-select>
              </div>
            </div>

            <!-- 執行人員 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span> 執行人員</div>
              <div class="title-status">
                <el-select
                  v-model="selectUser"
                  placeholder="執行人員"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in userInfo"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </div>
            </div>

        </div>
        </div>


        <div class="inspect-basic flex-column">
          <!-- 巡檢時間 -->
          <div class="flex-row" style="margin-right: 30px; margin-bottom: 30px;">
            <div class="title-name"><span style="color: #c60957">* </span> 巡檢時間</div>
            <div class="title-status">
              <el-time-picker
                  v-model="taskTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="設定巡檢時間"
                />
            </div>
            <!-- <div class="notice">{{$t('schedule.pleaseFinished')}} !</div> -->
          </div>

          <!-- 提醒時間 -->
          <div class="flex-row" style="margin-right: 30px; margin-bottom: 30px;">
            <div class="title-name"><span style="color: #c60957">* </span> 提醒時間</div>
            <div class="title-status">
              <el-input
                    v-model="remindTime"
                    ref="delay_day"
                    placeholder=""
                    type="number"
                    :min="0"
                    @change="onEventChanged"
                    class="input-name_short"
                    />
                    分鐘前
            </div>
            <!-- <div class="notice">{{$t('schedule.pleaseFinished')}} !</div> -->
          </div>

          <!-- 重複週期 -->
          <div class="flex-row" style="margin-right: 30px; margin-bottom: 30px;">
            <div class="title-name"><span style="color: #c60957">* </span> 重複週期</div>
            <div class="title-status">
              <el-select
                v-model="repeatCycle"
                :placeholder="$t('schedule.remiderMethod')"
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
            <!-- <div class="notice">{{$t('schedule.pleaseFinished')}} !</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {scheduleRESTful} from '@/api/index';
import { getBriefStoreList} from '@/api/store';
import {  GetInspectTagList, GetInspectTagListAll } from '@/api/inspect';
import {
  getUserInfo,
  getAllUserInfoNoAuth
  } from '@/api/login';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import DialogPop from '@/components/DialogPop';
import TableOnly from '@/components/TableOnly';
import util from '@/common/util';
import filterString from '@/common/filterString.js';

export default{
  name: 'RepeatingScheduleSetting',
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
          value: 1,
          label: '星期一'
        },
        {
          value: 2,
          label: '星期二'
        },
        {
          value: 3,
          label: '星期三'
        },
        {
          value: 4,
          label: '星期四'
        },
        {
          value: 5,
          label: '星期五'
        },
        {
          value: 6,
          label: '星期六'
        },
        {
          value: 7,
          label: '星期日'
        },
      ],
      storeList: [],
      selectStore: null,
      emptyData: require('../../../static/img/icon_data.svg'),
      handleSchedule: [],
      seleAllSchedule: false,

      editSchedule:{
        remindDate:'',
        remindTimePoint:'',
        remindStyle:[]
      },

      taskTime: new Date().toTimeString().slice(0, 5),
      remindTime: 5 ,
      repeatCycle: [1],
      userInfo: [],
      selectUser: null,



      // ======
      add_width: "1000",
      edit_width: "500",
      showingAddStore: false,
      showingEditStore: false,
      storeColumnData: [
        {
          'prop': 'province',
          'label': this.$t('schedule.region1'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'city',
          'label': this.$t('schedule.region2'),
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'name',
          'label': this.$t('schedule.storeName'),
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'timeZone',
          'label': this.$t('schedule.storeTimeZone'),
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
      isLoadingData: false,
      total:0,
      curPage:1,
      curSizeNum:10,
      defaultSort:{prop: 'startDate', order: 'descending'},

      inspectionMode:'',
      inspectionName:'',
      inspectionStyle: [
        // {
        //   value : 1,
        //   label: '現場巡檢'
        // },
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
    ...mapGetters({ accountChanged: 'accountChanged' }),

    showSearchStoreData :{
      get(){
        return this.filterInputSearchStore(this.filterCurTemplateProvince(this.filterCurTemplateCity(this.searchStoreData)))
      },
      set(val){
        console.log('val', val)
			}
    }
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

    // inspectionMode(val){
    //   console.log('inspectionMode val', val)
    //   this.inspectTypeList = [...this.allInspectTypeList]
    //   this.inspectTypeList = this.inspectTypeList.filter( i => i.mode === val)
    //   this.inspectionName = this.inspectTypeList[0].id
    // },

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



  },
  mounted() {
    this.showSearchStoreData = this.searchStoreData
    this.searchSheduleDataList = this.scheduleDataList
  },


  async created() {
    await this.init()
  },

  methods: {

    onEventChanged(e){
      let value = parseInt(e, 10);
      if(isNaN(value) || value <= 0){
        this.remindTime = 1;
      }
      else if(value >= 60){
        this.remindTime = 60
      }
      else{
        this.remindTime = value;
      }
    },

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
      console.log('this.curTempCityList', this.curTempCityList)
      if(this.curTempCityList.length == 0){
        return stores
      }else{
        // return stores.filter(item => item.city == this.curTempCityList )
        return stores.filter(item => this.curTempCityList.includes(item.city))
      }
    },

    onselectSec1(val){
      console.log('val 1', val)
      var c = this.showSearchStoreData.map(c => c.city)
      const cccSet = new Set(c)
      this.cityAry = [...cccSet]

    },

    onselectSec2(val){
      console.log('val 2', val)
      if(val.length == 0){

        // console.log('this.showSearchStoreData XDXD', this.showSearchStoreData)
        // console.log('this.searchStoreData XDXD', this.searchStoreData)
        var p = this.searchStoreData.map(p => p.province)
        const pppSet = new Set(p)
        this.provinceAry = [...pppSet]

      } else {
        var p = this.showSearchStoreData.map(p => p.province)
        const pppSet = new Set(p)
        this.provinceAry = [...pppSet]
      }

    },

    async init(){

      this.isLoadingData = true

      await this.getBriefStoreList();
      // await this.getUserInfo();
      await this.getTagAll()
      await this.getAllUserInfo()


      var status = sessionStorage.getItem('repeatScheduleParams');
      this.scheduleStatus = JSON.parse(status)
      console.log('this.scheduleStatus  !!=========>>', this.scheduleStatus)
      console.log('this.inspectionName', this.inspectionName)

      if(this.scheduleStatus.action == "editSchedule"){

        this.isLoadingData = true
        this.hasScheduleData = true
        this.taskName = this.scheduleStatus.name
        this.inspectionName = this.scheduleStatus.inspectTagId
        this.selectStore = this.scheduleStatus.storeId
        this.selectUser = this.scheduleStatus.userId
        this.remindTime = parseInt(this.scheduleStatus.remindBeforeMinutes)
        this.taskTime = `${String(this.scheduleStatus.startTimeHH).padStart(2, '0')}:${String(this.scheduleStatus.startTimeMM).padStart(2, '0')}`
        console.log('this.taskTime :>> ', this.taskTime);

        var repeatWeekDays = []
        this.scheduleStatus.repeatWeekDays.forEach(i => {
          if(i == "星期一"){ repeatWeekDays.push(1) }
          else if(i == "星期二") { repeatWeekDays.push(2) }
          else if(i == "星期三") { repeatWeekDays.push(3) }
          else if(i == "星期四") { repeatWeekDays.push(4) }
          else if(i == "星期五") { repeatWeekDays.push(5) }
          else if(i == "星期六") { repeatWeekDays.push(6) }
          else if(i == "星期日") { repeatWeekDays.push(7) }
        })

        this.repeatCycle =repeatWeekDays
        var status =  this.allInspectTypeList.find( d => d.name == this.scheduleStatus.tagName)

      }
      else if(this.scheduleStatus.action == "addSchedule"){
        this.hasScheduleData = false
        // this.inspectionMode = 1
        var tempN = this.allInspectTypeList.filter( i => i.mode === 1)
        this.inspectionName = tempN[0].id
        this.selectUser = this.userInfo[0].userId
        this.selectStore = this.storeList[0].storeId

      }
      this.isLoadingData = false
    },


    // 取得 all user
    async getAllUserInfo(){
        await getAllUserInfoNoAuth().then(res=>{
          this.userInfo = res.data.map( i=>
            ({
              userId: i.userId,
              userName: i.userName,
              title: i.title
            })
          )
        console.log('this.userInfo :>> ', this.userInfo);

        }).catch(err => {
          console.log('error' + err);
        });
      },


    // 取得巡檢表
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
          console.log(' this.allInspectTypeList =========>>>> ',  this.allInspectTypeList)
          this.inspectTypeList = [...this.allInspectTypeList]
          // this.selectUser = this.allInspectTypeList[0].userName

        }).catch(err => {
          reject(err);
        });
      });
  },



    async getBriefStoreList() {
      await getBriefStoreList().then(res => {
        this.storeList = res.data
        console.log('this.storeList :>> ', this.storeList);

        // this.searchStoreData = [...this.storeList]
        // console.log('this.searchStoreData =========>>>> ', this.searchStoreData);
        // var p = this.searchStoreData.map(p => p.province)
        // const pppSet = new Set(p)
        // this.provinceAry = [...pppSet]
        // console.log('this.provinceAry  =========>>>>', this.provinceAry)

        // var c = this.searchStoreData.map(c => c.city)
        // const cccSet = new Set(c)
        // this.cityAry = [...cccSet]
        // console.log('this.cityAry  =========>>>>', this.cityAry)

      })
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

      if(this.taskName == ''){
        util.notify("排程名稱不可為空", 'error', 2000 );
        this.isLoadingData = false
        return
      }

      // if(this.inspectionName == ''){
      //   util.notify("請選擇巡檢表", 'error', 2000 );
      //   this.isLoadingData = false
      //   return
      // }
      // if(this.scheduleDataList.length < 1){
      //   util.notify("請至少設定一筆排程！", 'error', 2000 );
      //   this.isLoadingData = false
      //   return
      // }

      const [HH, MM] = this.taskTime.split(':').map(Number);
      //建今天的日期物件
      const date = new Date();
      date.setHours(HH, MM, 0, 0);
      date.setMinutes(date.getMinutes() + 20);
      const newTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      const [endTimeHH, endTimeMM] = newTime.split(':').map(Number);

      if(this.hasScheduleData == true){
        // 編輯重複排程
        var param =  {
          id: this.scheduleStatus.id,
          storeId: this.selectStore,
          userId: this.selectUser,
          inspectTagId: this.inspectionName,
          name: this.taskName,
          remindBeforeMinutes: this.remindTime,
          weekDays: this.repeatCycle,
          startTimeHH: HH,
          startTimeMM: MM,
          endTimeHH: endTimeHH,
          endTimeMM: endTimeMM
        }
        scheduleRESTful.editWeeklyTask(param).then(res =>{
          if(res.errCode === 0){
            util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
            this.$router.push({name: 'RepeatingSchedule' , query: { refresh: Date.now()}});
          }
        })
      }
      else {
        // 新建重複排程
        var param =  {
          storeId: this.selectStore,
          userId: this.selectUser,
          inspectTagId: this.inspectionName,
          name: this.taskName,
          remindBeforeMinutes: this.remindTime,
          weekDays: this.repeatCycle,
          startTimeHH: HH,
          startTimeMM: MM,
          endTimeHH: endTimeHH,
          endTimeMM: endTimeMM
        }
        scheduleRESTful.addWeeklyTask(param).then(res =>{
          if(res.errCode === 0){
            util.notify(this.$t('deviceView.editSuss'), 'success', 3000);
            this.$router.push({name: 'RepeatingSchedule'});
          }
        })
      }
      this.isLoadingData = false

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

      this.getBriefStoreList()
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
          tempId: Math.random().toString(36).slice(2),

          remindStyle:[],
          remindDate: null,
          remindTimePoint: null


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
          var noRepeat =  this.searchStoreData.filter((item, index, array) => array.findIndex(s => (item.province === s.province && item.city === s.city)) === index)
            var newArr = noRepeat.map( s => ({
              city: s.city,
              province: s.province,
              checked: false,
              taskList: [],
              tempId: Math.random().toString(36).slice(2)
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
        console.log('editSchedule :>> ');
        this.showScheduleDataList.forEach( i =>{
          this.addStoreTemp.forEach(t => {
            if(i.city == t.city && i.province == t.province){
              i.taskList.unshift(t)

              // console.log('i :>> ', i);
              // i.taskList[0].remindDate = ''
              // i.taskList[0].remindTimePoint = ''

            }
          })
        })
      }
      console.log('this.showScheduleDataList end', this.showScheduleDataList)
      this.$refs.storeDataList.clearSelection()
      this.curTempProvinceList = []
      this.curTempCityList = []
      this.hasScheduleData = true
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
            var isExpired = t.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && t.remindTime !== ''
            if(!isExpired) {
              t.checked = true
              this.handleSchedule.push(t)
            }


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

      // var isExpired = item.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && item.remindTime !== ''
      if(val.checked){
        this.showScheduleDataList.forEach( i => {

          i.taskList.forEach(t => {
            var isExpired = t.remindTime < new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1 && t.remindTime !== ''
            if(t.city === val.city && !isExpired) {
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


    resetData(val){
      if(val.remindTime) val.remindTime = ''
      if(val.remindDate) val.remindDate = ''
      if(val.remindTimePoint) val.remindTimePoint = ''
      if(val.remindStyle) val.remindStyle = []

      console.log('val', val)
      console.log('this.showScheduleDataList', this.showScheduleDataList)
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
    padding: 0px 30px 40px 30px

    .setting-config
      padding-left: 0
      height: fit-content
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

  .input-name_short
    width: 100px
    height: 30px
    margin: 0 8px
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button
      -webkit-appearance: none
      margin: 0

  .input-name_short.el-input--medium >>> .el-input__inner
    height: 30px
    line-height: 30px
    font-size: 12px

</style>
