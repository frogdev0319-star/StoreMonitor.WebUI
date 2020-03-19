<template>
  <div class="item-container">
    <el-col :span="24" class="statistics-header">
      <el-col :span="24" class="header-details">
        <span>{{$t('reportView.selectStores')}}</span>
        <el-select v-model="curCountry"  :placeholder="$t('reportView.country')" size="mini"
                   class="el-province" @change="changeCountry">
          <el-option
            v-for="item in countryList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <region-multi-select :selected="curProvince" :placeholder="$t('reportView.regionI')" :options="provinceList" @changeInput="handleProChange"
                             style="display: inline" ref="proviceSelect" :disabled="curCountry.length==0"></region-multi-select>
        <region-multi-select :selected="curCity" :placeholder="$t('reportView.regionII')" :options="cityList" @changeInput="handleCityChange"
                             style="display: inline" ref="citySelect" :disabled="curProvince.length==0 "></region-multi-select>

        <multi-select :selected="curStore" :placeholder="$t('reportView.stores')" :options="storeDataList" @changeInput="handleStoreChange"
                      style="display: inline" ref="multiSelect"></multi-select>
        <span>{{$t('overview.patrolType')}}</span>
        <el-select v-model="curType"  placeholder="请选择巡检表类型" size="mini"
                   class="el-province" @change="changeType">
          <el-option
            v-for="item in inspectTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-col>

      <el-col :span="24" class="header-details">
        <span :class="lang== 'en'? 'en-span-class' : ''">{{$t('reportView.time')}}</span>
        <el-date-picker
          ref="datePicker"
          v-model="dateValue"
          type="daterange"
          range-separator="-"
          size="mini"
          :clearable=false
          :editable=false
          format="yyyy/MM/dd"
          class="date-range"
          :popper-class="poperClass"
          :picker-options='dateOpt'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"
          :default-time="['00:00:00', '23:59:59']"
          unlink-panels
        >
        </el-date-picker>
        <el-tooltip class="item" effect="dark"
                    placement="right">
          <div slot="content">{{$t('overview.dataRangeTips')}}</div>
          <i class="iconfont icon-bangzhu iconbangzhu" style="color: #7d8cad;vertical-align: middle;"></i>
        </el-tooltip>
        <el-button size="mini" :class="lang==='en'? 'en-search-btn':'search-btn' " @click="searchData" type="primary">{{$t('reportView.search')}}</el-button>
      </el-col>
      <el-col :span="24" class="header-details1">
                <span class="choice-store">
                  <i class="iconfont icon-tishi1" @mouseover="showStoreInfo=true" @mouseleave="showStoreInfo=false"></i>
                  {{$t('reportView.selected')}}
                  <span class="storename-str" style="margin-left:20px;">{{storeStr}}</span>
                </span>
        <div class="store-selected" v-if="showStoreInfo">
          <h1>{{$t('reportView.selected')}}</h1>
          <ul class="store-list" v-show="storeStr.length > 0">
            <li v-for="(item,index) in storeStr.split('，')" :key="index" class="store-item" style="display: block; text-align: left">
              - {{item}}
            </li>
          </ul>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24" class="items-content">
      <el-col :span="24" class="contents-container">
        <el-col :span="24" class="items-row">
          <el-col :span="24" class="items-title">
            <span class="title">{{$t('overview.itemChartReport')}}</span>
            <div class="exprotBtn">
              <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="export2Excel" >
                <div class="btn-area">
                  <img :src="exportPng" class="icon-excel">
                  <span class="spanClass">{{$t('eventView.exportReport')}}</span>
                </div>
              </el-button>
            </div>
          </el-col>
          <el-col :span="12" class="evalution-pct">
            <div class="title">{{$t('overview.proportionOfInspectionItems')}}</div>
            <div class="pct-content">
              <div>
                <div class="pct-panel">
                  <v-chart :auto-resize='true' :options="itemsOptions" class="chart-content" ref="itemsPie"></v-chart>
                </div>
                <div class="pct-nums">
                  <div class="content-labels" :class="lang=='en'? 'en-labels': ''" v-for="(item, index) in itemsPerArray"
                       :key="index">
                    <div class="excellent_nums">{{item.percent}}%</div>
                    <div class="excellent_labels">
                      <span class="labels excellent-label" :class="`label-` + index"></span>
                      <span class="label-desc">{{item.type}}</span>
                    </div>
                  </div>
                </div>
              </div>
<!--              <div v-else class="data-empty">-->
<!--                {{$t('overview.noData')}}-->
<!--              </div>-->
            </div>

          </el-col>
          <el-col :span="12" class="evalution-pct">
            <div class="radar-title">{{curType== 0? $t('overview.proportionOfRemote') : $t('overview.proportionOfOnsite')}}</div>
            <div class="inspect-catergy">
              <div class="rader-panel">
                <div v-if="!hasNoData">
                  <v-chart :options="itemsRadarOption" class="radar-content" :auto-resize='true' ref="itemsRadar"/>
                </div>
                <div v-else class="data-empty">
                  {{$t('overview.noData')}}
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <el-col :span="24" class="items-table">
          <div class="table">
            <div class="el-table-panel">
              <el-table
                :data="itemsTableData"
                :highlight-current-row="true"
                empty-text='无数据'
                align='left'
                stripe
                @sort-change='sortChange'
                :default-sort = "{prop: 'qualifiedRateStr', order: 'ascending'}"
                border
                style="width: 100%"
                :header-cell-class-name="headerClass"
                size="mini"
                :cell-class-name="cellClass"
                :row-class-name="rowClass"
              >
                <el-table-column v-for="(_item,_index) in itemsInfoData" :key="_index"
                                 :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="lang!=='en'? _item.width : _item.maxWidth">
                </el-table-column>
                <div slot="empty">
                  <div>
                    <i class="iconfont icon-zhengque empty-data-icon"></i>
                    <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{$t('overview.noData')}}</span>
                  </div>
                </div>
              </el-table>
            </div>
            <div class="toolbar pagination clearfix">
              <el-pagination background small
                             :page-sizes="[10, 20, 50, 100]"
                             @size-change="sizeChange"
                             @current-change="currentChange"
                             :current-page="page"
                             layout="jumper,total, prev, pager, next,sizes"
                             :page-size="sizeNum" :total="total">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/map'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/scatter'
  import 'echarts/lib/chart/effectScatter'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/polar'
  import 'echarts/lib/component/geo'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/visualMap'
  import 'echarts/lib/component/dataset'
  import 'echarts/map/js/world'
  import 'zrender/lib/svg/svg'
  import MultiSelect from '@/components/MultiSelect'
  import RegionMultiSelect from '@/components/RegionMultiSelect'
  import {mapGetters} from 'vuex'
  import {getStoreList} from '@/api/store'
  import util from '../../common/util.js'
  import {Message} from 'element-ui'

  import {
    getInspectStatsItemOverviewV2
  } from '@/api/inspectOverview'
  export default {
        name: "InspectItemStatistics",
        components:{
          MultiSelect,
          'v-chart': ECharts,
          RegionMultiSelect,
        },
      data(){
          return {
            curCountry:'',
            countryList:[],
            curProvince:[],
            provinceList:[],
            curCity:[],
            cityList:[],
            curStore:[],
            storeList:[],
            storeDataList: [],
            storeStr: '',
            curRegion: [],
            dateValue: [this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
            dateOpt: {
              disabledDate: (time) => {
                return time.getTime() > this.$moment(new Date).endOf('d').toDate();
              }
            },
            timeMode: 1,
            curType: 0,
            inspectTypeList: [
              {
                value: 0,
                label: this.$t('overview.remotePatrolTable'),
              },
              {
                value: 1,
                label: this.$t('overview.onsitePatrolTable'),
              }
            ],
            showStoreInfo: false,
            params: {},
            poperClass: 'date-picker-poper',
            exportPng: require('../../../static/img/icon_excel.png'),
            lang: this.$i18n.locale,
            itemsPerArray: [],
            itemsOptions:null,
            itemsLegend: [
              {
                'type': this.$t("overview.excellent"),
                'percent': '0%',
              },
              {
                'type': this.$t("overview.pass"),
                'percent': '0%',
              },
              {
                'type': this.$t("overview.failed"),
                'percent': '0%',
              },
              {
                'type': this.$t("overview.ignored"),
                'percent': '0%',
              }
            ],
            itemsRadarOption: null,
            echartBackground: 'rgba(30,34,52,0.75)',
            itemsTableData:[],
            itemsInfoData:[
              {
                "prop": "inspectGroupName",
                "label": this.$t("overview.patrolType"),
                "sortable": false,
                "width": '280',
                "maxWidth": '280'
              },
              {
                "prop":"inspectItemName",
                "label": this.$t("overview.items"),
                "sortable":'custom',
                "width": '380',
                "maxWidth": '380'
              },
              {
                "prop":"numOfTotal",
                "label": this.$t("overview.numOfEvaluations"),
                "sortable":'custom',
                "width": '130',
                "maxWidth": '200'
              },
              {
                "prop": "numOfExcellent",
                "label": `${this.$t("overview.excellent")}${this.$t("overview.timesUnit")}`,
                "sortable":'custom',
                "width": '130',
                "maxWidth": '150'
              },
              {
                "prop":"numOfQualified",
                "label": `${this.$t("overview.pass")}${this.$t("overview.timesUnit")}`,
                "sortable":'custom',
                "width": '130',
                "maxWidth": '150'
              },
              {
                "prop":"numOfUnqualified",
                "label": `${this.$t("overview.failed")}${this.$t("overview.timesUnit")}`,
                "sortable":'custom',
                "width": '130',
                "maxWidth": '150'
              },
              {
                "prop":"numOfIgnored",
                "label": `${this.$t("overview.ignored")}${this.$t("overview.timesUnit")}`,
                "sortable":'custom',
                "width": '130',
                "maxWidth": '150'
              },
              {
                "prop":"qualifiedRateStr",
                "label": this.$t("overview.passRate"),
                "sortable":'custom',
                "width": '130',
                "maxWidth": '150'
              }
            ],
            total: 0,
            page:1,
            sizeNum: 10,
            direction: 'asc',
            property: 'qualifiedRate',
            hasNoData: false,
            exportItmesHeader: ['巡检表类别','巡检项', '评估次数', '优良（次）', '合格（次）', '不合格（次）', '忽略（次）', '合格率'],
            headerClass: 'header-class',
            cellClass: 'cell-class',
            echartAxiasColor: '#e3e9f4',
            rowClass: 'row-class',
            fontFamily: '',
            sidebarElm: null
          }
      },
      computed:{
        ...mapGetters({accountChanged:'accountChanged'})
      },
      watch:{
        async accountChanged(val,oldVal){
          console.log(val);
          let self=this;
          if(val!=0) {
            let self = this;
            self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date).endOf('d').toDate()];
            let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
            let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
            self.params.beginTs = start;
            self.params.endTs = end;
            console.log(self.lang)
            self.initDaysRange();
            await self.getRegionInfo();
            await self.initData();
          }
        },
        numberOfElements(val,oldVal){
          console.log(val);
          console.log(oldVal);
          let self = this;
          if(val == 0 && self.totalElements > 0){
            self.params.filter.page -= 1;
            self.getEventList(self.params);
          }
        }
      },
      methods:{
        sortChange(col){
          console.log(col);
          let self=this;
          let column = col.column;
          let order = col.order;
          self.order = order;
          let prop  = '';
          let tempOrder = '';
          if(order=="ascending"){
            self.params.order={
              "direction":"asc",
              "property": col.column.property == 'qualifiedRateStr' ? 'qualifiedRate' : col.column.property
            }
            prop = col.column.property;
            tempOrder =  "asc";
          }
          else if(order=="descending"){
            self.params.order={
              "direction":"desc",
              "property": col.column.property == 'qualifiedRateStr' ? 'qualifiedRate' : col.column.property
            }
            prop = col.column.property;
            tempOrder =  "desc";
          }
          else{
            self.params.order={"direction":"asc", "property": 'qualifiedRate'};
          }
          self.params.filter={
            page:self.page-1,
            size:self.sizeNum
          }
          self.getInspectItemsTable();
        },
        sizeChange(val){
          let self=this;
          self.sizeNum=val;
          //self.page=1;
          self.page=1;
          self.params.filter={page:self.page-1,size:val};
          self.getInspectItemsTable();
        },
        currentChange(val){
          let self=this;
          self.page = val;
          self.params.filter={page:val-1,size:self.sizeNum};
          self.getInspectItemsTable();
        },
        async getRegionInfo(){
          let self=this;
          let params={
            "filter":{
              "page":0,
              "size":1000
            }
          };
          let retData=await self.getStoreData(params);
          let storeList=retData.data.content;
          self.storeList=storeList;

          let getCountry=storeList=>{
            let temp=[];
            temp.push({label:self.$t('reportView.country'), value:''})
            storeList.forEach(item=>{
              if(temp.map(x=>x.value).indexOf(item.country)==-1){
                let obj={
                  label:item.country,
                  value:item.country
                }
                temp.push(obj);
              }
            })
            return temp;
          }
          let countryList=getCountry(storeList);
          let tempStore=[];
          storeList.forEach(item=>{
            let obj={
              storeId:item.storeId,
              label:item.name,
              value:item.name,
              userId:item.userId,
              userName:item.userName,
              checked: false
            }
            tempStore.push(obj);
          })
          self.storeDataList=tempStore;
          self.countryList=countryList;
          self.curCountry = '中国';
          self.selectAllProAndCity(self.curCountry);
        },
        getStoreData(params){
          let self=this;
          return new Promise((resolve,reject)=>{
            getStoreList(params).then(res=>{
              let errMsg=res.errMsg;
              if(errMsg!=undefined&&errMsg=='Success'){
                let data=res.data;
                resolve(res);
              }
            }).catch(res => {
              resolve(res);
            })
          })
        },
        dateChange(val) {
          let self = this;
          console.log(val);
          self.currentIndex = 0;
          let start = typeof(val[0]) === 'object' ? val[0].getTime() : val[0];
          let end = typeof(val[1]) === 'object' ? val[1].getTime() : val[1];
          let daysDiff = self.$moment(end).diff(start, 'days');
          if (daysDiff < 6) {  //当前选择的时间范围不到7天
            Message({
              message: self.$t('overview.changeTimeRange'),
              type: 'warning',
              duration: 3 * 1000
            })
            start = end - 3600 * 24 * 6 * 1000;
            start = self.$moment(start).startOf('d').toDate().valueOf();
            self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
          }
          if (daysDiff > 364) {  //当前选择的时间范围超过365天
            Message({
              message: self.$t('overview.changeTimeRange'),
              type: 'warning',
              duration: 3 * 1000
            })
            start = end - 3600 * 24 * 364 * 1000;
            start = self.$moment(start).startOf('d').toDate().valueOf();
            self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
          }
          else {
            self.dateValue = [self.$moment(start).startOf('d').toDate(), new Date().setTime(end)];
          }
          daysDiff = self.$moment(end).diff(start, 'days');
          daysDiff <= 30 ? self.timeMode = 1 : self.timeMode = 2;
          console.log(self.timeMode);
          self.params.beginTs = start;
          self.params.endTs = end;
          self.initDaysRange();
        },
        initDaysRange() {
          let self = this;
          let start = self.params.beginTs;
          let end = self.params.endTs;
          let startDay = self.$moment(start).format('YYYY-MM-DD');
          let endDay = self.$moment(end).format('YYYY-MM-DD');
          let startDayWithoutYear = self.$moment(start).format('MM/DD');
          let endDayWithoutYear = self.$moment(end).format('MM/DD');
          if (self.timeMode == 1) {
            let beginDay = new Date(util.judgeStart(startDay));
            let weekList = util.getWeek(beginDay, endDay)
            let arrLength = weekList.length;
            let firstEndTime = weekList[0].split('-')[1];
            let firstWeekStr = startDayWithoutYear + '-' + firstEndTime;
            let lastStartTime = weekList[arrLength - 1].split('-')[0];
            let lastWeekStr = lastStartTime + '-' + endDayWithoutYear;
            weekList.splice(0, 1, firstWeekStr);
            weekList.splice(arrLength - 1, 1, lastWeekStr);
            console.log(weekList);
            self.daysRangeList = weekList;

          }
          else if (self.timeMode == 2) {
            let monthArray = util.getMonthBetween(startDay, endDay)
            console.log(monthArray)
            self.daysRangeList = monthArray;
          }
        },
        handleStoreChange (arr) {
          console.log(arr)
          this.curStore = arr
          this.changeStore(arr)
        },
        handleProChange(arr){
          console.log(arr)
          this.curProvince = arr
          this.changePro(arr)
        },
        handleCityChange(arr){
          console.log(arr)
          this.curCity = arr
          this.changeCity(arr)
        },
        changeStore(val){
          let self=this;
          console.log(val);
          let str='';
          self.storeList.forEach((item,index)=>{
            val.forEach(_item=>{
              if(item.storeId==_item){
                str+=item.name+'，'
              }
            })
          })
          str=str.substr(0,str.length-1)
          self.storeStr=str;
        },
        changePro(val){
          console.log(val)
          let self=this;
          self.curCity= [];
          self.clearCityInfo();
          self.clearStoreInfo();

          let storeList=self.storeList;
          let temp=[];
          let tempStore=[];
          if(val == ''){
            storeList.forEach(item=>{
              if(item.country==self.curCountry){
                if(temp.map(x=>x.value).indexOf(item.province)==-1){
                  let obj={
                    label:item.province,
                    value:item.province
                  }
                  temp.push(obj);
                }
                let obj={
                  storeId:item.storeId,
                  label:item.name,
                  value:item.name,
                  userId:item.userId,
                  userName:item.userName
                };
                tempStore.push(obj);
              }
            })
            self.provinceList=temp;
            self.checkAllStore = false;
          }
          else{
            val.forEach(_item=>{
              storeList.forEach(item=>{
                if(item.province==_item){
                  if(temp.map(x=>x.value).indexOf(item.city)==-1){
                    let obj={
                      label:item.city,
                      value:item.city
                    }
                    temp.push(obj);
                  }
                  let obj={
                    storeId:item.storeId,
                    label:item.name,
                    value:item.name,
                    userId:item.userId,
                    userName:item.userName
                  };
                  tempStore.push(obj);
                }
              })
            })
            self.cityList=temp;
          }
          self.storeDataList=tempStore;
        },
        changeCountry(val){
          let self=this;
          console.log(val);
          self.curProvince= [];
          self.curCity=[];
          let storeList=self.storeList;
          let tempStore=[];
          let temp=[];
          self.clearProviceInfo();
          self.clearCityInfo();
          self.clearStoreInfo();
          if(val== ''){
            storeList.forEach(item=>{
              let obj={
                storeId:item.storeId,
                label:item.name,
                value:item.name,
                userId:item.userId,
                userName:item.userName
              }
              tempStore.push(obj);
            })
            //self.storeDataList=tempStore;
            self.checkAllStore = false;
          }
          else{
            storeList.forEach(item=>{
              if(item.country==val){
                if(temp.map(x=>x.value).indexOf(item.province)==-1){
                  let obj={
                    label:item.province,
                    value:item.province
                  }
                  temp.push(obj);
                }
                let obj={
                  storeId:item.storeId,
                  label:item.name,
                  value:item.name,
                  userId:item.userId,
                  userName:item.userName
                };
                tempStore.push(obj);
              }
            })
          }
          self.provinceList=temp;
          self.storeDataList=tempStore;

        },
        changeCity(val){
          let self=this;
          self.clearStoreInfo();
          console.log(val)
          let storeList=self.storeList;
          let temp=[];
          if(val.length == 0){
            console.log(self.curProvince)
            self.curProvince.forEach(_item=>{
              console.log(_item)

              storeList.forEach(item=>{
                console.log(item)
                if(item.province==_item){
                  let obj = {};
                  obj.storeId = item.storeId;
                  obj.label = item.name;
                  obj.value = item.name;
                  obj.userId = item.userId;
                  obj.userName = item.userName;
                  temp.push(obj);
                }
              })
            })
          }
          else{
            val.forEach(_item=>{
              storeList.forEach(item=>{
                if(item.city==_item){
                  if(temp.map(x=>x.value).indexOf(item.city)==-1){
                    let obj={
                      storeId:item.storeId,
                      label:item.name,
                      value:item.name,
                      userId:item.userId,
                      userName:item.userName
                    }
                    temp.push(obj);
                  }
                }
              })
            })
          }
          console.log(temp)
          self.storeDataList=temp;
        },
        clearStoreInfo(){
          let self=this;
          self.curStore=[];
          self.storeStr='';
          self.$refs.multiSelect.selectedArray = [];
          self.$refs.multiSelect.input=''
        },
        async searchData(){
          let self = this;
          console.log(self.curStore)
          let storeIds = [];
          if(self.curProvince.length == 0){
            self.hasNoData = true;
            self.itemsTableData = [];
            return;
          }
          if(self.curStore.length == 0 ){
            self.storeDataList.forEach(item=>{
              storeIds.push(item.storeId)
            })
          }
          else if(self.curStore.includes("-1")){
            storeIds = self.curStore.filter(item=> item!= -1)
          }
          else{
            storeIds = self.curStore;
          }
          console.log(storeIds)
          self.params.storeIds = storeIds;

          self.params.filter={page:self.page - 1,size:self.sizeNum};
          self.params.order = {direction: self.direction, property: self.property}
          self.params.mode = self.curType;
          await self.getInspectItemsTable();
          await self.getInspectCharts();
        },
        changeType(){

        },
        selectAllProAndCity(val){
          let self = this;
          let storeList = self.storeList;
          let temp = [];
          let tempStore = [];
          storeList.forEach(item=>{
            if(item.country==val){
              if(temp.map(x=>x.value).indexOf(item.province)==-1){
                let obj={
                  label:item.province,
                  value:item.province
                }
                temp.push(obj);
              }
              let obj={
                storeId:item.storeId,
                label:item.name,
                value:item.name,
                userId:item.userId,
                userName:item.userName
              };
              tempStore.push(obj);
            }
          })
          self.provinceList = temp;
          console.log(self.provinceList)
          let cityTemp = [];
          self.provinceList.forEach(_item=>{
            storeList.forEach(item=>{
              if(item.province==_item.value){
                if(cityTemp.map(x=>x.value).indexOf(item.city)==-1){
                  let obj={
                    label:item.city,
                    value:item.city
                  }
                  cityTemp.push(obj);
                }
              }
            })
          })
          self.cityList = cityTemp;
          let provinceArr = [];
          self.provinceList.forEach(item=>{
            provinceArr.push(item.value)
          })
          self.curProvince = provinceArr;

          let cityArr = [];
          self.cityList.forEach(item=>{
            cityArr.push(item.value)
          })
          self.curCity = cityArr;
          self.storeDataList = tempStore;
          let storeArr = [];
          self.storeDataList.forEach(item=>{
            storeArr.push(item.storeId)
          })
          self.curStore = storeArr;
          console.log('create 调用完毕')
          self.changeStore(self.curStore)
        },
        clearProviceInfo(){
          let self=this;
          self.curProvince=[];
          self.$refs.proviceSelect.selectedArray = [];
          self.$refs.proviceSelect.input=''
        },
        clearCityInfo(){
          let self=this;
          self.curCity=[];
          self.$refs.citySelect.selectedArray = [];
          self.$refs.citySelect.input=''
        },
        async getInspectItemsTable() {
          let self = this;
          let inspectItems = await self.getInspectStatsItemInfo(self.params);
          console.log(inspectItems);
          let excellentPer = 0;
          let qualifiedPer = 0;
          let unqualifiedPer = 0;
          let ignorePer = 0;
          let errCode = inspectItems.errCode;
          let seriesData = [];
          if (errCode == 0) {
            let totalIgnored = 0;
            let totalUnqualified = 0;
            let totalQualified = 0;
            let totalExcellent = 0;
            let resultData = inspectItems.data;
            console.log(resultData)
            try {
              let content = resultData.content;
              content.forEach(item => {
                item.qualifiedRateStr = item.qualifiedRate + '%';
                totalIgnored += item.numOfIgnored;
                totalUnqualified += item.numOfUnqualified;
                totalQualified += item.numOfQualified;
                totalExcellent += item.numOfExcellent;
              })
              self.itemsTableData = resultData.content;
              self.total = resultData.totalElements;
              console.log(resultData.content);
            }
            catch (e) {
              seriesData = [];
              self.itemsTableData = [];
            }
          }
        },
        async getInspectCharts(){
          let self = this;
          let params = {};
          params.beginTs = self.params.beginTs;
          params.endTs = self.params.endTs;
          params.storeIds = self.params.storeIds;
          params.mode = self.params.mode;
          console.log(self.total)
          if(self.total > 0){
            self.hasNoData = false;
            params.filter = {
              page: 0,
              size: self.total
            }
            let inspectItems = await self.getInspectStatsItemInfo(params);
            let excellentPer = 0;
            let qualifiedPer = 0;
            let unqualifiedPer = 0;
            let ignorePer = 0;
            let errCode = inspectItems.errCode;
            let jsonArray = self.itemsLegend;
            let seriesData = [];
            let resultData = {};
            if (errCode == 0) {
              let totalIgnored = 0;
              let totalUnqualified = 0;
              let totalQualified = 0;
              let totalExcellent = 0;
              resultData = inspectItems.data;
              console.log(resultData)
              try {
                let content = resultData.content;
                content.forEach(item => {
                  totalIgnored += item.numOfIgnored;
                  totalUnqualified += item.numOfUnqualified;
                  totalQualified += item.numOfQualified;
                  totalExcellent += item.numOfExcellent;
                })
                console.log(resultData.content);

                seriesData = [
                  {value: totalExcellent, name: self.$t('overview.excellent')},
                  {value: totalQualified, name: self.$t('overview.pass')},
                  {value: totalUnqualified, name: self.$t('overview.failed')},
                  {value: totalIgnored, name: self.$t('overview.ignored')}
                ];
              }
              catch (e) {
                seriesData = [];
              }
              let totalArray = [totalExcellent, totalQualified, totalUnqualified, totalIgnored];
              console.log(totalArray);
              jsonArray[0].percent = util.getPercentValue(totalArray, 0, 2);
              jsonArray[1].percent = util.getPercentValue(totalArray, 1, 2);
              jsonArray[2].percent = util.getPercentValue(totalArray, 2, 2);
              jsonArray[3].percent = util.getPercentValue(totalArray, 3, 2);
              self.itemsOptions = {
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)',
                  textStyle: {
                    align: 'left'
                  },
                  backgroundColor: self.echartBackground,
                },
                textStyle:{
                  fontFamily: self.fontFamily
                },
                series: [
                  {
                    name: self.$t('overview.itemsAssessment'),
                    type: 'pie',
                    radius: ['70%', '85%'],
                    center: ['50%', '50%'],
                    hoverOffset: 5,
                    label: {
                      normal: {
                        show: false,
                        position: 'center'
                      },
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data: seriesData,
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      },
                      normal: {
                        color: function (params) {
                          //自定义颜色
                          var colorList = ['#57e78f', '#72a1f3', '#ffd035', '#cad1db'];
                          return colorList[params.dataIndex]
                        }
                      }
                    }
                  }
                ]
              }

            }
            console.log(inspectItems);

            self.itemsPerArray = jsonArray;
            console.log(self.itemsPerArray)
            self.getCatergyRadar(resultData.content);
          }
          else{
            self.itemsPerArray = self.itemsLegend;
            self.hasNoData = true;
          }

        },
        getCatergyRadar(arr){
          let self = this;
          let mergeData = self.getCatergyByMerge(arr);
          console.log(mergeData);
          let options = {
            backgroundColor: '#fff',
            tooltip: {
              textStyle: {
                align: 'left'
              },
              backgroundColor: self.echartBackground,
            },
            textStyle:{
              fontFamily: self.fontFamily
            },
            legend: {
              data: ['inspect radar']
            },
            radar: [{
              shape: 'circle',
              center: ['50%', '50%'],
              nameGap: 5,
              name: {
                textStyle: {
                  color: '#7d8cad',
                  backgroundColor: '#fff',
                  borderRadius: 3,
                  padding: [3, 5],
                },
                formatter: (params) => {
                  console.log(params);
                  let str = '';
                  if (params.length > 6) {
                    str = params.substr(0, 6) + '...';
                  }
                  else {
                    str = params;
                  }
                  return str;
                },
              },
              indicator: [],
              axisLine: {
                lineStyle: {
                  color: self.echartAxiasColor,
                },
              },
              splitArea: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: self.echartAxiasColor // 图表背景网格线的颜色
                }
              }
            },
              {
                shape: 'circle',
                center: ['50%', '50%'],
                nameGap: 5,
                indicator: [],
                name: {
                  textStyle: {
                    color: 'rgba(255,255,255,0)',
                    borderRadius: 3,
                    padding: [3, 5]
                  },
                },
                splitArea: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: self.echartAxiasColor,
                  },
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    width: 1,
                    color: self.echartAxiasColor // 图表背景网格线的颜色
                  }
                }
              }
            ],
            series: [
              {
                type: 'radar',
                data: [],
              },
              {
                type: 'radar',
                data: [],
                name: self.$t('insSettingView.category'),
                radarIndex: 1,
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: '#f31d65',
                      width: 1
                    },
                    areaStyle: {
                      color: 'rgba(243, 29, 101, 0.5)'
                    }
                  },
                },
                tooltip: {
                  trigger: 'item'
                },
              }
            ]
          };
          let tempIndicator = [];
          let seriesValue = [];
          mergeData.forEach(item => {
            let obj = {};
            obj.name = item.name;
            let datasArray = item.data;
            let sumNum = 0;
            let score = 0;
            datasArray.forEach(_item=>{
              sumNum += _item.numOfTotal;
              score += _item.numOfExcellent * 2 + _item.numOfQualified
            })
            obj.max = sumNum * 2;
            tempIndicator.push(obj);
            seriesValue.push(score);
          })
          let temp = [];
          let obj = {value: seriesValue};
          temp.push(obj);
          options.radar[0].indicator = tempIndicator;
          options.radar[1].indicator = tempIndicator;
          options.series[0].data = temp;
          options.series[1].data = temp;
          options.radar.splitNumber = 5;
          self.itemsRadarOption = options;
          console.log(self.itemsRadarOption)
        },
        getCatergyByMerge(arr){
          var map = {},
              dest = [];
          for(var i = 0; i < arr.length; i++){
            var ai = arr[i];
            if(!map[ai.inspectGroupName]){
              dest.push({
                name: ai.inspectGroupName,
                data: [ai]
              });
              map[ai.inspectGroupName] = ai;
            }else{
              for(var j = 0; j < dest.length; j++){
                var dj = dest[j];
                if(dj.name == ai.inspectGroupName){
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          return dest;
        },
        getInspectStatsItemInfo(params) {
          return new Promise((resolve, reject) => {
            getInspectStatsItemOverviewV2(params).then(res => {
              resolve(res);
            })
          })
        },
        async initData(){
          let self = this;
          console.log(self.curStore)
          let storeIds = self.curStore.filter(item=> item!= -1)
          console.log(storeIds)
          self.params.storeIds = storeIds;

          self.params.filter={page:self.page - 1,size:self.sizeNum};
          self.params.order = {direction: self.direction, property: self.property}
          self.params.mode = self.curType;
          await self.getInspectItemsTable();
          await self.getInspectCharts();
        },
        export2Excel(){
          var that = this;
          if(that.itemsTableData.length==0){
            Message({
              message: that.$t('overview.emptyItemList'),
              type:'warning',
              duration:3*1000
            })
            return false;
          }
          require.ensure([], async() => {
            const { export_json_to_excel } = require('@/excel/Export2Excel');
            const tHeader = that.exportItmesHeader; // 导出的表头名
            const filterVal = ['inspectGroupName','inspectItemName','numOfTotal','numOfExcellent','numOfQualified','numOfUnqualified','numOfIgnored','qualifiedRatePer']; // 导出的表头字段名
            let self=this;
            self.params.filter={
              "page": 0,
              "size": self.total
            };
            console.log(self.params)
            let regionResult = await that.getInspectStatsItemInfo(self.params);
            let curData = [];
            if (regionResult.errCode == 0) {
              let result = regionResult.data;
              if (result) {
                result.content.forEach(item=>{
                  item.qualifiedRatePer = item.qualifiedRate + '%'
                })
                console.log(result.content)
                curData = result.content;
              }
            }
            const data = that.formatJson(filterVal, curData);
            let patrolName = self.curType== 0 ? 'Remote Patrol': 'Onsite Patrol';
            let fileName = patrolName +'-'+util.getCurDateStr();
            export_json_to_excel(tHeader, data, fileName);// 导出的表格名称，根据需要自己命名
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
        adjustChart(){
          let self = this;
          self.$refs.itemsPie && self.$refs.itemsPie.resize()
          self.$refs.itemsRadar && self.$refs.itemsRadar.resize()
        },
        handleSideBar(e){
          if(e.target === e.currentTarget || e.target === this){
            this.adjustChart();
          }
        }
      },
      async created(){
        let self = this;
        let start = typeof(self.dateValue[0]) === 'object' ? self.dateValue[0].getTime() : self.dateValue[0];
        let end = typeof(self.dateValue[1]) === 'object' ? self.dateValue[1].getTime() : self.dateValue[1];
        self.params.beginTs = start;
        self.params.endTs = end;
        self.fontFamily = self.lang== 'en' ? 'Roboto' : 'Microsoft YaHei'
        self.initDaysRange();
        await self.getRegionInfo();
        await self.initData();
      },
      mounted(){
        let self = this;
        window.addEventListener("resize", self.adjustChart, false);
        self.sidebarElm = document.getElementsByClassName('aside-menu')[0]
        self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false)
      },
      beforeDestroy(){
        let self = this;
        window.removeEventListener('resize', self.adjustChart);
        self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar,false)
        self.$refs.itemsPie && self.$refs.itemsPie.dispose()
        self.$refs.itemsRadar && self.$refs.itemsRadar.dispose()
        self.adjustChart = null;
      }
    }
</script>

<style lang="scss" scoped>
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $excellent: #57e78f;
  $pass: #72a1f3;
  $failed: #ffd035;
  $ignored: #cad1db;
  *{
    box-sizing: border-box;
    font-family: Roboto, Arial, 'Microsoft YaHei';
  }
  .item-container{
    padding-bottom: 20px;
    .statistics-header{
      margin-bottom: 30px;
      border-bottom: 1px solid $border;
      background-color: #fff;
      padding-top: 30px;
      padding-bottom: 30px;
      color: $black;
      .header-details1{
        text-align: left;
        padding-left: calc(30/1920*100vw);
        padding-right: calc(30/1920*100vw);
        height: 20px;
        line-height: 20px;
        position: relative;
        span{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
        }
        .choice-store{
          color: $tab;
          white-space: nowrap;
          overflow: hidden;
          /* text-overflow: ellipsis; */
          width: 90%;
          display: inline-block;
          i{
            margin-right: calc(16/1920*100vw);
            font-size: calc(16/1920*100vw);
          }
        }
        .store-selected{
          top: unset;
          background-color: rgba(30, 34, 52, 0.75);
          position: absolute;
          /* display: none; */
          z-index: 1;
          padding: 20px;
          min-width: 200px;
          border-radius: 10px;
          left: calc(80 / 1920 * 100vw);
          h1{
            white-space: nowrap;
            font-size: 18px;
            margin: 0;
            color: #fff;
            font-weight: 500;
            line-height: 1.1;
          }
          .store-list{
            margin-top: 10px;
            margin-left: 10px;
            padding: 0;
            .store-item{
              white-space: nowrap;
              font-size: 14px;
              margin: 0;
              list-style-type: none;
              color: #fff;
            }
          }
        }
      }
      .header-details{
        text-align: left;
        padding-left: calc(30/1920*100vw);
        position: relative;
        .search-content{
          display: inline-block;
        }
        .date-range {
          border: 1px solid #ccc;
          width: 200px;
          height: calc(35 / 1920 * 100vw);
          min-height: 28px;
          /*.el-range-separator{*/
          /*height: calc(35 / 1920 * 100vw);*/
          /*line-height: calc(35 / 1920 * 100vw);*/
          /*}*/
        }
        .item {
          color: $tab;
          margin-left: calc(20 / 1920 * 100vw);
          margin-right: calc(8 / 1920 * 100vw);
        }
        .iconbangzhu{
          font-size: calc(20 / 1920 * 100vw);
          position: relative;
          color: $tab;
        }
        span{
          font-size: calc(14/1920*100vw);
          margin-right: calc(20/1920*100vw);
          margin-left: calc(20/1920*100vw);
        }
        @media screen and(max-width: 1366px){
          .en-span-class{
            margin-right: 60px;
          }
        }
        @media screen and(min-width: 1366px){
          .en-span-class{
            //margin-right: 75px;
          }
        }
        .el-province{
          width: calc(160/1920*100vw);
          margin-right: calc(15/1920*100vw);
          min-width: 85px;
          min-height: 28px;
        }
        .search-btn{
          width: calc(130/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
        }
        .en-search-btn{
          width: calc(130/1920*100vw);
          margin-left: calc(20/1920*100vw);
          border-color: $red;
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          float: right;
        }
        // .storename-str{
        //     width: 100%;
        //     white-space: nowrap; //保证文本内容不会自动换行，如果多余的内容会在水平方向撑破单元格。
        //     overflow: hidden; //隐藏超出单元格的部分。
        //     text-overflow: ellipsis; //将被隐藏的那部分用省略号代替。
        // }
      }
      .header-details:nth-child(1){
        padding-right: calc(60/1920*100vw);
      }
      .header-details:nth-child(2){
        padding-top:15px;
        padding-bottom: 30px;
        padding-right: calc(60/1920*100vw);
      }
    }
    .items-content{
      padding: calc(30/1920*100vw);
      padding-top: 0;
      .contents-container{
        background-color: #fff;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .items-row {
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          .title {
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            color: $black;
            display: inline-block;
            padding-top: 30px;
          }
          .exprotBtn{
            padding-right: calc(30 / 1920 * 100vw);
            float: right;
            padding-top: 25px;
            .export-btn{
              border-color: $red;
              z-index: 990;
              height: calc(36/1920*100vw);
              width: calc(130/1920*100vw);
              margin: 0;
              padding: 0;
              font-size: calc(14/1920*100vw);
              line-height: calc(36/1920*100vw);
              color: #ffffff;
              border-width: 0;
              border-radius: 4px;
              top: calc(24/1920*100vw);
              min-height: 28px;
              min-width: 120px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin-right: calc(18/1920*100vw);
                  font-size: calc(24/1920*100vw);
                  height: calc(24/1920*100vw);
                  width: calc(24/1920*100vw);
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
            }
            .en-export-btn{
              border-color: $red;
              z-index: 990;
              height: calc(36/1920*100vw);
              width: calc(160/1920*100vw);
              margin: 0;
              padding: 0;
              font-size: calc(14/1920*100vw);
              line-height: calc(36/1920*100vw);
              color: #ffffff;
              border-width: 0;
              border-radius: 4px;
              min-height: 28px;
              min-width: 120px;
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin: calc(6/1920*100vw) calc(18/1920*100vw) calc(6/1920*100vw) 0;
                  height: calc(24/1920*100vw);
                  width: calc(24/1920*100vw);
                }
                .spanClass{
                  font-size: calc(14/1920*100vw);
                  display: inline-block;
                }
              }
            }
          }
        }
        .evalution-pct {
          background-color: #fff;
          .title{
            /*float: left;*/
            padding-left: calc(30/1920*100vw);
            text-align: left;
            padding-top: 20px;
            font-size:calc(14/1920*100vw) ;
            color: #7d8cad;
          }
          .pct-content {
            /*padding-top: calc(30 / 1920 * 100vw);*/
            padding-bottom: 20px;
            width: 100%;
            text-align: center;
            .pct-panel {
              height: 210px;
              width: 210px;
              margin: 0 auto;
              border-radius: 50%;
              background: -webkit-radial-gradient(circle closest-side, #fff 60%, $background 40%);
              .chart-content {
                width: 100%;
                height: 100%;
              }
            }
            .pct-nums {
              margin-top: 30px;
              /*padding: 0 calc(20/1920*100vw);*/
              font-size: calc(12 / 1920 * 100vw);
              display: flex;
              justify-content: center;
              @media screen and (max-width: 1280px) {
                padding: 0 0;
              }
              .content-labels {
                padding: 0 calc(10 / 1920 * 100vw);
                font-size: calc(12 / 1920 * 100vw);
                text-align: left;
                .excellent_nums {
                  margin-left: calc(20 / 1920 * 100vw);
                  margin-bottom: 10px;
                  font-size: calc(14 / 1920 * 100vw);
                  line-height: calc(14 / 1920 * 100vw);
                }
                .excellent_labels {
                  display: flex;
                  .labels {
                    height: 12px;
                    width: 12px;
                    display: inline-block;
                    margin-right: calc(10 / 1920 * 100vw);
                    align-self: center;
                  }
                  .label-desc {
                    color: $tab;
                    font-size: 12px;
                  }
                  .label-0 {
                    background-color: $excellent;
                  }
                  .label-1 {
                    background-color: $pass;
                  }
                  .label-2 {
                    background-color: $failed;
                  }
                  .label-3 {
                    background-color: $ignored;
                  }
                }
              }
              .en-labels {
                @media screen and (max-width: 1280px) {
                  padding: 0 calc(5 / 1920 * 100vw);
                }
              }
            }
          }
          .data-empty{
            font-size: calc(14/1920*100vw);
            color: $tab;
            height: 222px;
            line-height: 222px;
          }
          .radar-title {
            text-align: left;
            font-size: calc(14 / 1920 * 100vw);
            color: $tab;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 20px;
            margin-left: calc(30/1920*100vw);
          }
          .inspect-catergy {
            border-left: 1px solid $border;
            .rader-panel {
              width: 100%;
              height: 100%;

              .radar-content {
                width: 100%;
                height: 220px;
                width: 100%;
                margin: 0 auto;
              }
            }
            .radar-empty {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: calc(14 / 1920 * 100vw);
              color: $tab;
            }
          }
        }
        .focus-items {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid $border;
          margin-left: calc(20 / 1920 * 100vw);
          height: calc(400 / 1920 * 100vw);
          background-color: #fff;
          .title {
            border-bottom: 1px solid $border;
          }
          .items-panel {
            height: calc(298 / 1920 * 100vw);
            margin: calc(15 / 1920 * 100vw);
            border: 1px solid $border;
            .top-five-items {
              height: 100%;
              position: relative;
              .items-list {
                height: 100%;
                background: $background;
                .item-chart {
                  height: 20%;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  border-bottom: 1px solid $border;
                  &:last-child {
                    border-bottom: none;
                  }
                  .item-ranking {
                    font-size: calc(18 / 1920 * 100vw);
                    text-align: left;
                    font-family: Arial Rounded MT Bold;
                    padding: 0 calc(20 / 1920 * 100vw);
                  }
                  .item-ranking-0 {
                    color: $red;
                  }
                  .item-ranking-1 {
                    color: #fd8a51;
                  }
                  .item-ranking-2 {
                    color: $failed;
                  }
                  .item-ranking-3 {
                    color: $pass;
                  }
                  .item-ranking-4 {
                    color: $tab;
                  }
                  .item-titles {
                    text-align: left;
                    font-size: calc(14 / 1920 * 100vw);
                    width: calc(300 / 1920 * 100vw);
                    .item-title {
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    }
                  }
                  .item-progress {
                    flex-grow: 1;
                    margin: 0 calc(20 / 1920 * 100vw);
                  }
                  .ranking-num {
                    font-size: calc(14 / 1920 * 100vw);
                    margin-right: calc(45 / 1920 * 100vw);
                    /*position: relative;*/
                    /*top: calc(8/1920*100vw);*/
                    text-align: left;
                  }
                }
                .active-color {
                  background: #fff;
                }
              }

              .top-five-empty {
                top: 50%;
                left: 50%;
                position: absolute;
                transform: translate(-50%, -50%);
                color: $tab;
                .empty-text {
                  display: inline-block;
                  vertical-align: top;
                  margin-left: calc(20 / 1920 * 100vw);
                  color: $tab;
                  font-size: calc(14 / 1920 * 100vw);
                }
              }
            }
            .item-radar {
              height: 100%;
              padding-left: calc(15 / 1920 * 100vw);
              padding-top: calc(15 / 1920 * 100vw);
              position: relative;

              .rader-panel {
                width: 100%;
                height: 100%;
                .radar-title {
                  text-align: left;
                  font-size: calc(14 / 1920 * 100vw);
                  color: $tab;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .radar-content {
                  width: 100%;
                  height: calc(100% - 25 / 1920 * 100vw);
                }
              }
              .radar-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: calc(14 / 1920 * 100vw);
                color: $tab;
              }
            }

          }
        }
      }
      .items-table{
        .table{
          margin: 0 calc(30/1920*100vw);
        }
        .clearfix{
          content: "";
          display: block;
          height: 0;
          clear:both;
          overflow: auto;
        }
        .toolbar{
          float: right;
          margin: 30px calc(30/1920*100vw);
          margin-right: 0;
          height:13%;
        }
      }
    }

  }
</style>
<style>
  .header-class{
    height: 40px;
    font-size: 12px;
    font-family: Arial, 'Microsoft YaHei';
    font-weight: bold;
    color: #7d8cad;
    background-color: #f4f5f9 !important;
    border-right: none !important;
  }
  .cell-class{
    height: 35px;
    padding-left: 20px;
    font-size: calc(14/1920*100vw);
    color: #182752;
  }

  body .el-table th.gutter {
    display: table-cell !important
  }

  .el-table__row.row-class{
    height: 35px;
  }
  .el-table--border td.cell-class:nth-last-of-type(1) {
    border-right: 1px solid #EBEEF5 !important;
  }
  .el-table__header-wrapper th.header-class:nth-last-of-type(2) {
    border-right: 1px solid #EBEEF5 !important;
  }

  .header-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .header-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }
</style>
