<template>
  <div>
    <div class="el-overview-content">
      <el-col :span="24" class="statistics-header">
        <el-col :span="24" class="header-details">
          <span>{{$t('reportView.selectStores')}}</span>
          <el-select v-model="curCountry"  :placeholder="$t('reportView.country')" size="mini"
                    class="el-province" @change="changeCountry">
            <!--<el-option-->
              <!--v-for="item in countryList"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
            <el-option-group
              v-for="group in countryList"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.countryList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
          <region-multi-select :selected="curProvince" :placeholder="$t('reportView.regionI')" :options="provinceList" @changeInput="handleProChange"
                              style="display: inline" ref="proviceSelect" :disabled="curCountry.length==0" :all="$t('overview.allZoneI')"></region-multi-select>
          <region-multi-select :selected="curCity" :placeholder="$t('reportView.regionII')" :options="cityList" @changeInput="handleCityChange"
                              style="display: inline" ref="citySelect" :disabled="curProvince.length==0 " :all="$t('overview.allZoneII')"></region-multi-select>

          <multi-select :selected="curStore" :placeholder="$t('reportView.stores')" :options="storeDataList" @changeInput="handleStoreChange"
                        :disabled="curProvince.length==0 " style="display: inline" ref="multiSelect"></multi-select>
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
          <div class="exprotBtn" style="float:right;">
              <el-button size="mini" :class="lang==='en'? 'en-search-btn':'search-btn' " @click="searchData"
                    type="primary" :disabled="curProvince.length == 0 ">{{$t('reportView.search')}}</el-button>
              <el-button type="primary" size="mini" :class="lang==='en'? 'en-search-btn':'search-btn' " @click="handleDown()">
                <div class="btn-area">
                  <i class="iconfont icon-pdf" style="font-size: calc(14/1920*100vw)"></i>
                  <span style="font-size: calc(14/1920*100vw);margin:0 0 0 10px;">{{$t('reportView.InspectionDetail')}}</span>
                </div>
              </el-button>
            </div>
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
      <el-col :span="24" class="el-overview">
        <el-row class="first-row">
          <el-col :span="24"  class="kpi-list">
            <div class="title">{{$t('overview.eventGraph')}}</div>
          </el-col>
          <el-col :span="3"  class="kpi-list">
            <div class="kpi-content">
              <div class="event-list" v-for="(item,index) in eventKPIs" :key="index">
                <div class="event-title">{{item.eventTitle}}</div>
                <div class="event-num">{{item.eventNum}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="14" class="store-events">
            <div class="region-result">
              <div class="charts-content">
                <v-chart  :options="storeEventsOptions"  class="result-content" :auto-resize='true' ref="storeEventRef"/>
              </div>
            </div>
          </el-col>
          <el-col :span="7" class="source-list">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart :auto-resize='true' :options="eventSourceOptions" class="chart-content" ref="eventSourceRef"></v-chart>
              </div>
              <div class="pct-nums">
                <div class="content-labels" :class="lang=='en'? 'en-label': ''" v-for="(item, index) in sourcePerArray" :key="index">
                  <div class="excellent_nums">{{item.percent}}%</div>
                  <div class="excellent_labels">
                    <span class="labels excellent-label" :class="`label-` + index"></span>
                    <span class="label-desc">{{item.type}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="second-row">
          <el-col :span="24" class="items-title">
            <span class="title">{{$t('overview.eventList')}}</span>
            <div class="exprotBtn">
              <el-button type="primary" size="mini" :class="lang=='en' ? 'en-export-btn':'export-btn'" @click="export2Excel" >
                <div class="btn-area">
                  <img :src="exportPng" class="icon-excel">
                  <span class="spanClass">{{$t('eventView.exportReport')}}</span>
                </div>
              </el-button>
            </div>
          </el-col>
          <el-col class="event-table" :span="24">
            <div class="table">
              <div class="event-content">
                <el-table
                  :data="eventTableData"
                  :highlight-current-row="true"
                  empty-text='无数据'
                  align='left'
                  stripe
                  @sort-change='sortChange'
                  :default-sort = "{prop: 'numOfTotal', order: 'ascending'}"
                  border
                  style="width: 100%"
                  :header-cell-class-name="headerClass"
                  size="mini"
                  :cell-class-name="cellClass"
                  :row-class-name="rowClass"
                >
                  <el-table-column v-for="(_item,_index) in eventInfoData" :key="_index"
                                  :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="lang!=='en'? _item.width : _item.maxWidth">
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.remotePatrol')"
                    prop="remotePer"
                    :min-width="lang!=='en'? 120 : 150"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.remotePer}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    prop="onsitePer"
                    :min-width="lang!=='en'? 120 : 150"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.onsitePer}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    prop="videoPer"
                    :min-width="lang!=='en'? 120 : 150"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper video">
                        <el-tag size="small" color="#fccc3f1a">{{ scope.row.videoPer}}</el-tag>
                      </div>
                    </template>
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
        </el-row>
      </el-col>
      <el-dialog :title="$t('insSettingView.export')"
      :visible.sync="ispdf" v-if="ispdf"
      :append-to-body='true'
      :close-on-click-modal="false"
      class="LoadDialog"
      width="510px"
      top="35vh"
      left="40vh">
          <div style="overflow:hidden;width:100%;">
            <hr style="border: 0.5px solid #dfe2e9;"/>
              <p style="margin-top:40px;color:#000;">{{$t('insSettingView.isExportPDF')}}......</p>
          </div>
      </el-dialog>
    </div>
    <div class="el-overview-content" v-if="ispdf">
      <el-col :span="24" class="el-overview" id="pdfDom" style="padding:40px 20px;">
        <el-row class="first-row">
          <el-col :span="24"  class="kpi-list">
            <div class="title">{{$t('overview.eventGraph')}}</div>
          </el-col>
          <el-col :span="3"  class="kpi-list">
            <div class="kpi-content">
              <div class="event-list" v-for="(item,index) in eventKPIs" :key="index">
                <div class="event-title">{{item.eventTitle}}</div>
                <div class="event-num">{{item.eventNum}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="14" class="store-events">
            <div class="region-result">
              <div class="charts-content">
                <v-chart  :options="storeEventsOptions"  class="result-content" :auto-resize='true' ref="storeEventRef"/>
              </div>
            </div>
          </el-col>
          <el-col :span="7" class="source-list">
            <div class="pct-content">
              <div class="pct-panel">
                <v-chart :auto-resize='true' :options="eventSourceOptions" class="chart-content" ref="eventSourceRef"></v-chart>
              </div>
              <div class="pct-nums">
                <div class="content-labels" :class="lang=='en'? 'en-label': ''" v-for="(item, index) in sourcePerArray" :key="index">
                  <div class="excellent_nums">{{item.percent}}%</div>
                  <div class="excellent_labels">
                    <span class="labels excellent-label" :class="`label-` + index"></span>
                    <span class="label-desc">{{item.type}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="second-row" style="padding-bottom:20px;">
          <el-col :span="24" class="items-title">
            <span class="title">{{$t('overview.eventList')}}</span>
          </el-col>
          <el-col class="event-table" :span="24">
            <div class="table">
              <div class="event-content">
                <el-table
                  :data="eventPDFData"
                  :highlight-current-row="true"
                  empty-text='无数据'
                  align='left'
                  stripe
                  @sort-change='sortChange'
                  :default-sort = "{prop: 'numOfTotal', order: 'ascending'}"
                  border
                  style="width: 100%"
                  :header-cell-class-name="headerClass"
                  size="mini"
                  :cell-class-name="cellClass"
                  :row-class-name="rowClass"
                >
                  <el-table-column v-for="(_item,_index) in eventInfoData" :key="_index"
                                  :prop="_item.prop" :label="_item.label" :sortable="_item.sortable" :min-width="_item.pdfwidth">
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.remotePatrol')"
                    prop="remotePer"
                    :min-width="lang!=='en'? '8% ': '9%'"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper remote">
                        <el-tag size="small" color="#f31d651a">{{ scope.row.remotePer}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.onsitePatrol')"
                    prop="onsitePer"
                    :min-width="lang!=='en'? '8%' : '9%'"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper onsite">
                        <el-tag size="small" color="#fb804f1a">{{ scope.row.onsitePer}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('overview.storeMonitor')"
                    prop="videoPer"
                    :min-width="lang!=='en'? '8%' : '9%'"
                    sortable="custom">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper video">
                        <el-tag size="small" color="#fccc3f1a">{{ scope.row.videoPer}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <div slot="empty">
                    <div>
                      <i class="iconfont icon-zhengque empty-data-icon"></i>
                      <span :style="{'margin-left':'20px','font-size':'14px','color':'#7d8cad'}">{{$t('overview.noData')}}</span>
                    </div>
                  </div>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </div>
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
  import {getEventStatsOverStoreV2, getEventStatsOverStore} from '@/api/eventOverview'

  export default {
    name: "EventStatistics",
    components:{
      MultiSelect,
      'v-chart': ECharts,
      RegionMultiSelect,
    },
    data(){
      return{
        ispdf:false,
        htmlTitle:this.$t("overview.htmltopdfD"),
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
        dateValue:[this.$moment().startOf('month').toDate(), this.$moment(new Date).endOf('d').toDate()],
        dateOpt: {
          disabledDate:(time)=>{
            return time.getTime() > this.$moment(new Date).endOf('d').toDate();
          }
        },
        toolTipClass: 'page-login-toolTipClass',
        showStoreInfo: false,
        eventKPIs: [
          {
            eventTitle: this.$t('overview.sumEvents'),
            eventNum: 0,
          },
          {
            eventTitle: this.$t('overview.sumUnprocessEvents'),
            eventNum: 0,
          },
          {
            eventTitle: this.$t('overview.sumProcessEvents'),
            eventNum: 0,
          },
          {
            eventTitle: this.$t('overview.sumClosedEvents'),
            eventNum: 0,
          }
        ],
        storeDataList: [],
        sourceLegend: [
          {
            'type' : this.$t('overview.remotePatrol'),
            'percent' : '0%',
          },
          {
            'type' : this.$t('overview.onsitePatrol'),
            'percent' : '0%',
          },
          {
            'type' : this.$t('overview.storeMonitor'),
            'percent' : '0%',
          },
        ],
        statusLegend: [
          {
            'type' : this.$t('overview.pending'),
            'percent' : '0%',
          },
          {
            'type' : this.$t('overview.done'),
            'percent' : '0%',
          },
          {
            'type' : this.$t('overview.closed'),
            'percent' : '0%',
          },
        ],
        itemsPerArray: [],
        params:{},
        poperClass:'date-picker-poper',
        selectpoperClass:'select-poper',
        lang: this.$i18n.locale,
        timeMode: 1, //weekly mode
        daysRangeList: [],
        echartColor: '#7d8cab',
        regionChartEmpty: true,
        storeEventsOptions: null,
        eventSourceOptions: null,
        sourcePerArray: [],
        newColor: '#f31d65',
        pendingColor: '#fea316',
        doneColor: '#434c5e',
        closedColor: '#72a1f3',
        storeEventList: [],
        storeEventLegend: ['日期',this.$t('overview.createdEvent'),this.$t('overview.processedEvent'), this.$t('overview.closedEvents')],
        echartAxiasColor: '#e3e9f4',
        echartBackground: 'rgba(30,34,52,0.75)',
        exportPng: require('../../../static/img/icon_excel.png'),
        eventTableData: [],
        eventPDFData:[],
        eventInfoData: [
          {
            "prop": "storeName",
            "label": this.$t('overview.storeName'),
            "sortable": false,
            "width": '290',
            "maxWidth": '290',
            "pdfwidth":'20%'
          },
          {
            "prop":"regionName",
            "label": this.$t('overview.area'),
            "sortable": false,
            "width": '165',
            "maxWidth": '165',
            "pdfwidth":'11%'
          },
          {
            "prop":"numOfTotal",
            "label": this.$t('overview.sumEvents'),
            "sortable":'custom',
            "width": '165',
            "maxWidth": '165',
            "pdfwidth":'11%'
          },
          {
            "prop": "numOfUnprocessed",
            "label": this.$t('overview.numUnprocessEvents'),
            "sortable":'custom',
            "width": '165',
            "maxWidth": '165',
            "pdfwidth":'11%'
          },
          {
            "prop":"numOfInprocess",
            "label": this.$t('overview.numProcessEvents'),
            "sortable":'custom',
            "width": '165',
            "maxWidth": '165',
            "pdfwidth":'11%'
          },
          {
            "prop":"numOfProcessed",
            "label": this.$t('overview.numClosedEvents'),
            "sortable":'custom',
            "width": '165',
            "maxWidth": '165',
            "pdfwidth":'11%'
          },
          // {
          //   "prop":"numOfRemote",
          //   "label": '远程巡检',
          //   "sortable":'custom',
          //   "width": '8%'
          // },
          // {
          //   "prop":"numOfOnsite",
          //   "label": '现场巡检',
          //   "sortable":'custom',
          //   "width": '8%'
          // },
          // {
          //   "prop":"numOfVideo",
          //   "label": '门店监控',
          //   "sortable":'custom',
          //   "width": '8%'
          // }
        ],
        direction: 'asc',
        property: 'numOfTotal',
        page: 1,
        sizeNum: 10,
        total: 0,
        allEventData: [],
        headerClass: 'header-class',
        cellClass: 'cell-class',
        rowClass: 'row-class',
        exportEventHeader: ['门店名称','所属区域','事件总数', '待处理事件数量','已处理事件数量', '已结案事件数量', '远程巡检', '现场巡检', '门店监控'],
        hasNoData: false,
        sidebarElm: null,
        fontFamily: 'Roboto, Microsoft YaHei'
      }

    },
    computed:{
      ...mapGetters({accountChanged:'accountChanged'})
    },
    watch:{
      async accountChanged(val,oldVal){
        let self=this;
        if(val!=0){
          self.dateValue = [self.$moment().startOf('month').toDate(), self.$moment(new Date).endOf('d').toDate()];
          let start=typeof(self.dateValue[0])==='object'?self.dateValue[0].getTime():self.dateValue[0];
          let end=typeof(self.dateValue[1])==='object'?self.dateValue[1].getTime():self.dateValue[1];
          self.params.beginTs = start;
          self.params.endTs = end;
          self.initDaysRange();
          await self.getRegionInfo();
          self.initData();
        }
      }
    },
    methods:{
      handleDown(){
        let self = this
        self.ispdf=true
        if(self.total > 0){
          self.eventPDFData = self.allEventData;
        }
        setTimeout(()=>{
          self.getPdf()
          if(sessionStorage.getItem('startPDF')=='start'){
            sessionStorage.removeItem('startPDF','start');
            if(sessionStorage.getItem('endPDF')=='end'){
              sessionStorage.removeItem('endPDF','end');
              setTimeout(()=>{
                self.ispdf=false
              },1000)
            }
          }
        },1000)
      },
      dateChange(val){
        let self=this;
        let start= typeof(val[0])==='object'?val[0].getTime():val[0];
        let end= typeof(val[1])==='object'?val[1].getTime():val[1];
        let daysDiff = self.$moment(end).diff(start, 'days');
        if(daysDiff < 6){  //当前选择的时间范围不到7天
          // Message({
          //   message: self.$t('overview.changeTimeRange'),
          //   type:'warning',
          //   duration:3*1000
          // })
          self.$message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
          })
          start=end-3600*24*6*1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue=[self.$moment(start).startOf('d').toDate(),new Date().setTime(end)];
        }
        if(daysDiff > 364){  //当前选择的时间范围超过365天
          // Message({
          //   message: self.$t('overview.changeTimeRange'),
          //   type:'warning',
          //   duration:3*1000
          // })
          self.$message({
            message: self.$t('overview.changeTimeRange'),
            type:'warning',
          })
          start=end-3600*24*364*1000;
          start = self.$moment(start).startOf('d').toDate().valueOf();
          self.dateValue=[self.$moment(start).startOf('d').toDate(),new Date().setTime(end)];
        }
        else{
          self.dateValue=[self.$moment(start).startOf('d').toDate(),new Date().setTime(end)];
        }
        daysDiff = self.$moment(end).diff(start, 'days');
        daysDiff <=30 ? self.timeMode = 1 : self.timeMode = 2;
        console.log(self.timeMode);
        self.params.beginTs = start;
        self.params.endTs = end;
        self.initDaysRange();
      },

      async getAllStoreList(){
        let self=this;
        let params={
          "filter":{
            "page":0,
            "size":1000
          }
        };
        let retData=await self.getStoreData(params);
        let storeList=retData.data.content;
        let tempStore=[];
        tempStore.push(
          {storeId:'-1',
            label: self.$t('overview.all'),
            value:self.$t('overview.all')}
        )
        storeList.forEach(item=>{
          let obj={
            storeId:item.storeId,
            label:item.name,
            value:item.name,
            userId:item.userId,
            userName:item.userName,
            checked: true
          }
          tempStore.push(obj);
        })
        self.storeDataList = tempStore;
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

      async getStoreEventStatics(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.storeIds = self.params.storeIds;
        params.timeMode = self.timeMode;
        let storeEventResult = await self.getStoreEventData(params);
        let option = {
          color: [self.newColor, self.doneColor, self.closedColor],
          legend: {
            x: 'center',
            y: 'bottom',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            padding: 0,
            icon:'rect',
            textStyle:{
              color: self.echartColor,
              fontSize: 12,
              padding: [0, 0, 0, 5],
              height: 12,
              lineHeight: 12
            },
          },
          grid: {
            containLabel: true,
            top:'10',//距上边距
            left:'8',//距离左边距
            right:'0',//距离右边距
            bottom:'32',//距离下边距
          },
          tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
            },
            padding: 5,
            textStyle:{
              align:'left',
            },
            backgroundColor: self.echartBackground,
          },
          textStyle:{
            fontFamily: self.fontFamily
          },
          dataset: {
            source: [],
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            axisTick: {
              show: false,
              inside: true,
              lineStyle: {
                color: '#7D8CAB',
                fontSize: 12,
              }
            },
            splitLine: {
              show: false,
              lineStyle:{
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#7D8CAB'
              }
            },
            axisLabel:{
              fontStyle: 12,
              margin: 10
            }
          },
          yAxis: {
            type: 'value',
            // interval: 20,
            minInterval: 20,
            splitLine:{
              show:true,
              lineStyle:{
                color: self.echartAxiasColor,
                width: 1,
              }
            },
            axisTick: {
              show: false,
              inside: true,
              lineStyle: {
                color: '#7D8CAB',
                fontSize: 12,
              }
            },
            axisLine: {
              onZero: false,
              show: false,
              lineStyle: {
                color: '#7D8CAB'
              }
            },
            axisLabel:{
              show: true,
              fontStyle: 12,
              margin: 10
            }
          },
          series: [
            {type: 'line', areaStyle:{color:'rgba(243,29,101, 0.1)'}, symbol: 'none'},
            {type: 'line', areaStyle:{color:'rgba(67,76,94, 0.1)'}, symbol: 'none'},
            {type: 'line', areaStyle:{color:'rgba(114,161,243, 0.1)'}, symbol: 'none'}
          ]
        };
        if(storeEventResult.errCode == 0){
          let result = storeEventResult.data;
          self.storeEventList = result;
          let soureceList = [];
          soureceList.push(self.storeEventLegend)
          let sumOfNewEvents = 0;
          let sumOfProcessedEvents = 0;
          let sumOfClosedEvents = 0;
          result.forEach((item, index)=>{
            let storeList = item.stores;
            storeList.forEach(_item=>{
              sumOfNewEvents += _item.numOfNewEvents;
              sumOfProcessedEvents += _item.numOfProcessedEvents;
              sumOfClosedEvents += _item.numOfClosedEvents;
            })
            let itemArray = []
            itemArray.push(self.daysRangeList[index]);
            itemArray.push(sumOfNewEvents);
            itemArray.push(sumOfProcessedEvents);
            itemArray.push(sumOfClosedEvents);
            soureceList.push(itemArray);
          })
          option.dataset.source = soureceList;
        }
        self.storeEventsOptions = option;
      },
      getStoreEventData(params){
        return new Promise((resolve, reject)=>{
          getEventStatsOverStore(params).then(res=>{
            resolve(res)
          })
        })
      },
      adjustChart(){
        let self = this;
        if (self.$refs.eventSourceRef) {
          self.$refs.eventSourceRef.resize()
        }
        if (self.$refs.storeEventRef) {
          self.$refs.storeEventRef.resize()
        }
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
          // temp.push({label:self.$t('reportView.country'), value:''})
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
        self.countryList[0] = {}
        self.countryList[0].label= self.$t('reportView.country');
        self.countryList[0].countryList = countryList
        self.curCountry = countryList[0].label;
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
      handleStoreChange (arr) {
        this.curStore = arr
        this.changeStore(arr)
      },
      handleProChange(arr){
        this.curProvince = arr
        this.changePro(arr)
      },
      handleCityChange(arr){
        this.curCity = arr
        this.changeCity(arr)
      },
      changeStore(val){
        let self=this;
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
        let storeList=self.storeList;
        let temp=[];
        if(val.length == 0){
          self.curProvince.forEach(_item=>{
            storeList.forEach(item=>{
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
        self.storeDataList=temp;
      },
      clearStoreInfo(){
        let self=this;
        self.curStore=[];
        self.storeStr='';
        self.$refs.multiSelect.selectedArray = [];
        self.$refs.multiSelect.input=''
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
        self.changeStore(self.curStore)
      },

      export2Excel(){
        let that = this;
        if(that.allEventData.length==0){
          that.$message({
            message: that.$t('overview.emptyEventList'),
            type:'warning',
          })
          return false;
        }
        require.ensure([], async() => {
          const { export_json_to_excel } = require('@/excel/Export2Excel');
          const tHeader = that.exportEventHeader; // 导出的表头名
          const filterVal = ['storeName','regionName','numOfTotal','numOfUnprocessed','numOfInprocess','numOfProcessed','remotePer','onsitePer','videoPer']; // 导出的表头字段名
          let curData = [];
          curData = that.allEventData;
          const data = that.formatJson(filterVal, curData);
          let fileName = 'EventList' +'-'+util.getCurDateStr();
          export_json_to_excel(tHeader, data, fileName);// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      async searchData(){
        let self = this;
        let storeIds = [];
        // if(self.curProvince.length == 0){
        //   self.hasNoData = true;
        //   self.eventTableData = [];
        //   return;
        // }
        if(self.curStore.length == 0 ){
          self.storeDataList.forEach(item=>{
            storeIds.push(item.storeId)
          })
          self.curStore = storeIds.concat();
          self.changeStore(storeIds)
        }
        else if(self.curStore.includes("-1")){
          storeIds = self.curStore.filter(item=> item!= -1)
        }
        else{
          storeIds = self.curStore;
        }
        self.params.storeIds = storeIds;

        self.params.filter={page:self.page - 1,size:self.sizeNum};
        self.params.order = {direction: self.direction, property: self.property}
        await self.getEventTableData();
        await self.getAllEventData();
        self.getStoreEventStatics();
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
          self.daysRangeList = weekList;

        }
        else if (self.timeMode == 2) {
          let monthArray = util.getMonthBetween(startDay, endDay)
          self.daysRangeList = monthArray;
        }
      },
      async initData(){
        let self = this;
        let storeIds = self.curStore.filter(item=> item!= -1)
        self.params.storeIds = storeIds;
        self.params.filter={page:self.page - 1,size:self.sizeNum};
        self.params.order = {direction: self.direction, property: self.property}
        await self.getEventTableData();
        await self.getAllEventData();
        self.getStoreEventStatics();
      },
      async getEventTableData(){
        let self = this;
        let eventResult = await self.getEventTableDataInfo(self.params);
        let excellentPer = 0;
        let qualifiedPer = 0;
        let unqualifiedPer = 0;
        let ignorePer = 0;
        let errCode = eventResult.errCode;
        let jsonArray = self.itemsLegend;
        let seriesData = [];
        if (errCode == 0) {
            let result = eventResult.data;
            if(result){
              let content = result.content;
              self.total = result.totalElements;
              content.forEach(item=>{
                let numOfTotal = item.numOfTotal;
                if(numOfTotal == 0){
                  item.remotePer = 0 + '%';
                  item.onsitePer = 0 + '%';
                  item.videoPer = 0 + '%';
                }
                else{
                  item.remotePer = (item.numOfRemote/numOfTotal * 100).toFixed(0) + '%';
                  item.onsitePer = (item.numOfOnsite/numOfTotal * 100).toFixed(0) + '%'
                  item.videoPer = (item.numOfVideo/numOfTotal * 100).toFixed(0) + '%'
                }
              })
              self.eventTableData = content;
            }
            else{
              self.eventTableData = 0;
              self.eventKPIs.forEach(item=>{
                item.eventNum = 0;
              })
            }
        }
      },
      async getAllEventData(){
        let self = this;
        let params = {};
        params.beginTs = self.params.beginTs;
        params.endTs = self.params.endTs;
        params.timeMode = self.timeMode;
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
        params.storeIds = storeIds;

        params.filter={page:self.page - 1,size:self.total};
        params.order = {direction: self.direction, property: self.property}
        if(self.total > 0){
          let eventResult = await self.getEventTableDataInfo(params);
          let errCode = eventResult.errCode;
          if(errCode === 0){
            let result = eventResult.data;
            if(result){
              let content = result.content;
              content.forEach(item=>{
                let numOfTotal = item.numOfTotal;
                if(numOfTotal == 0){
                  item.remotePer = 0 + '%';
                  item.onsitePer = 0 + '%';
                  item.videoPer = 0 + '%';
                }
                else{
                  item.remotePer = (item.numOfRemote/numOfTotal * 100).toFixed(0) + '%';
                  item.onsitePer = (item.numOfOnsite/numOfTotal * 100).toFixed(0) + '%'
                  item.videoPer = (item.numOfVideo/numOfTotal * 100).toFixed(0) + '%'
                }
              })
              self.allEventData = content;
            }
          }
          else{
            self.allEventData = [];
          }
        }
        else{
          self.allEventData = [];
        }
        self.getEventsNum();
        self.getEventBySourcePie();
      },
      getEventsNum(){
        let self = this;
        let totalEvents = 0;
        let totalUnprocessed = 0;
        let totalInprocess = 0;
        let totalProcessed = 0;
        self.allEventData.forEach(item=>{
          totalEvents += item.numOfTotal;
          totalUnprocessed += item.numOfUnprocessed;
          totalInprocess += item.numOfInprocess;
          totalProcessed += item.numOfProcessed;
        })
        self.eventKPIs[0].eventNum = totalEvents;
        self.eventKPIs[1].eventNum = totalUnprocessed;
        self.eventKPIs[2].eventNum = totalInprocess;
        self.eventKPIs[3].eventNum = totalProcessed;
      },
      getEventBySourcePie(){
        let self = this;
        let jsonArray = self.sourceLegend;
        let allRemoteEventNum = 0;
        let allOnsiteEventNum =  0;
        let allStoreEventNum = 0;
        let sumEvent = 0;
        self.allEventData.forEach(item=>{
          sumEvent+= item.numOfTotal;
          allRemoteEventNum += item.numOfRemote;
          allOnsiteEventNum += item.numOfOnsite;
          allStoreEventNum += item.numOfVideo;
        })
        let totalArray = [allRemoteEventNum, allOnsiteEventNum, allStoreEventNum];
        jsonArray[0].percent = util.getPercentValue(totalArray,0,2);
        jsonArray[1].percent = util.getPercentValue(totalArray,1,2);
        jsonArray[2].percent = util.getPercentValue(totalArray,2,2);
        let seriesData = [];
        if(sumEvent != 0){
          seriesData = [
            { value: allRemoteEventNum, name: self.$t('overview.remotePatrol') },
            { value: allOnsiteEventNum, name: self.$t('overview.onsitePatrol') },
            { value: allStoreEventNum, name: self.$t('overview.storeMonitor')  },
          ];
        }
        else{
          seriesData = [];
        }
        self.eventSourceOptions = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
            textStyle:{
              align:'left'
            },
            backgroundColor: self.echartBackground,
          },
          textStyle:{
            fontFamily: self.fontFamily
          },
          series: [
            {
              name:'事件来源占比',
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
                normal:{
                  color:function(params) {
                    //自定义颜色
                    var colorList = ['#f31d65', '#fb804f', '#fccc3f'];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        self.sourcePerArray = jsonArray;
      },
      getEventTableDataInfo(params){
        return new Promise((resolve, reject) => {
          getEventStatsOverStoreV2(params).then(res => {
            resolve(res);
          })
        })
      },
      sortChange(col){
        let self=this;
        let column = col.column;
        let order = col.order;
        self.order = order;
        let prop  = '';
        let tempOrder = '';
        if(order=="ascending"){
          let property = '';
          if(col.column.property == 'remotePer'){
            property = "numOfRemote";
          }
          else if(col.column.property == 'onsitePer'){
            property = "numOfOnsite";
          }
          else if(col.column.property == 'videoPer'){
            property = "numOfVideo";
          }
          else{
            property = col.column.property;
          }
          self.params.order={
            "direction":"asc",
            "property": property
          }
          prop = col.column.property;
          tempOrder =  "asc";
        }
        else if(order=="descending"){
          let property = '';
          if(col.column.property == 'remotePer'){
            property = "numOfRemote";
          }
          else if(col.column.property == 'onsitePer'){
            property = "numOfOnsite";
          }
          else if(col.column.property == 'videoPer'){
            property = "numOfVideo";
          }
          else{
            property = col.column.property;
          }
          self.params.order={
            "direction":"desc",
            "property": property
          }
          prop = col.column.property;
          tempOrder =  "desc";
        }
        else{
          self.params.order={"direction":"asc", "property": 'numOfTotal'};
        }
        self.params.filter={
          page:self.page-1,
          size:self.sizeNum
        }
        self.getEventTableData();
      },
      sizeChange(val){
        let self=this;
        self.sizeNum=val;
        //self.page=1;
        self.page=1;
        self.params.filter={page:self.page-1,size:val};
        self.getEventTableData();
      },
      currentChange(val){
        let self=this;
        self.page = val;
        self.params.filter={page:val-1,size:self.sizeNum};
        self.getEventTableData();
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
      self.params.timeMode = self.timeMode;
      self.initDaysRange();
      await self.getRegionInfo();
      self.initData();

    },
    mounted(){
      let self=this;
      window.addEventListener("resize", self.adjustChart, false);
      self.sidebarElm = document.getElementsByClassName('aside-menu')[0]
      self.sidebarElm && self.sidebarElm.addEventListener('transitionend', self.handleSideBar, false)
    },
    beforeDestroy(){
      let self = this;
      window.removeEventListener('resize', self.adjustChart);
      self.adjustChart = null;
      self.sidebarElm && self.sidebarElm.removeEventListener('transitionend', self.handleSideBar,false)
      self.$refs.eventSourceRef && self.$refs.eventSourceRef.dispose()
      self.$refs.storeEventRef && self.$refs.storeEventRef.dispose()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/textstyle.css';
  @import '../../assets/css/importfile.css';
  $red:#f31d65;
  $black:#182752;
  $border:#e3e9f4;
  $background:#f4f5f9;
  $tab:#7d8cad;
  $h1:#292e36;
  $pending: #fea316;
  $done: #434c5e;
  $closed: #72a1f3;
  $pass: #72a1f3;
  $onsite: #fb804f;
  $store: #fccc3f;
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
  *{
    box-sizing: border-box;
    font-family: Roboto, Arial, 'Microsoft YaHei';
  }
  .el-overview-content {
    width: 100%;
    position: relative;
    height: auto;
    /*background-color: #f6f9fe;*/
    font-size: calc(14/1920*100vw);
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
          // float: right;
        }
        .en-search-btn{
          width: calc(130/1920*100vw);
          min-width:115px;
          margin-left: calc(20/1920*100vw);
          height: calc(36/1920*100vw);
          padding: 0 0;
          font-size: calc(14/1920*100vw);
          margin-left: calc(20/1920*100vw);
          // float: right;
        }
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
    .el-overview {
      padding: 0 calc(25/1920*100vw);
      position: relative;
      .first-row{
        height: auto;
        border: 1px solid $border;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .title{
          height: 70px;
          padding-top: 30px;
          margin-left: calc(30/1920*100vw);
          font-size: calc(20/1920*100vw);
          text-align: left;
          color: $black;
        }
        .kpi-list{
          height: 100%;
          border-bottom: 1px solid $border;
          .kpi-content{
            height: auto;
            border-right: 1px solid $border;
            display: flex;
            flex-direction: column;
            .event-list{
              height:  106px;
              padding-top: 24px;
              padding-left: calc(34/1920*100vw);
              padding-bottom: 20px;
              border-bottom: 1px solid $border;
              &:last-child{
                border-bottom: none;
              }
              .event-title{
                font-size: calc(16/1920*100vw);
                height:calc(16/1920*100vw);
                line-height:calc(16/1920*100vw);
                color: $tab;
                text-align: left;
              }
              .event-num{
                font-size: calc(30/1920*100vw);
                line-height: calc(30/1920*100vw);
                height: calc(30/1920*100vw);
                color: $h1;
                text-align: left;
                margin-top: 20px;
                :last-child{
                  padding-bottom: 20px;
                }
              }
            }
          }
        }
        .store-events{
          height: auto;
          @media screen and (max-width: 1536px){
            width: 57%;
          }
          .region-result{
            border-right: 1px solid $border;
            height: 424px;
            padding: 20px calc(30/1920*100vw) 30px calc(30/1920*100vw);
            .charts-content{
              height:100%;
              .result-content{
                height: 100%;
                width: 100%;
              }
            }
          }

        }
        .source-list{
          @media screen and (max-width: 1536px){
            width: 30%;
          }
          .pct-content{
            height: 424px;
            padding-top: 94px;
            padding-bottom: 30px;
            width: 100%;
            text-align: center;
            .pct-panel{
              height: 200px;
              width: 200px;
              margin: 0 auto;
              border-radius: 50%;
              background: -webkit-radial-gradient( circle closest-side,#fff 60%, $background 40%);
              .chart-content{
                width: 100%;
                height: 100%;
              }
            }
            .pct-nums{
              margin-top: 28px;
              padding: 0 calc(20/1920*100vw);
              font-size: 12px;
              display: flex;
              justify-content: center;
              @media screen and (max-width: 1920px){
                padding: 0;
              }
              @media screen and (max-width: 1440px){
                justify-content: space-around;
              }
              .content-labels{
                padding: 0 calc(10/1920*100vw);
                @media screen and (max-width: 1280px){
                  padding: 0;
                }
                font-size: 12px;
                text-align: left;
                .excellent_nums{
                  margin-left: calc(20/1920*100vw);
                  margin-bottom:10px;
                  font-size: calc(14/1920*100vw);
                  line-height: calc(14/1920*100vw);
                }
                .excellent_labels{
                  line-height: 12px;
                  font-size: 0;
                  .labels{
                    height: 10px;
                    width: 10px;
                    display: inline-block;
                    margin-right: calc(10/1920*100vw);
                    @media screen and (min-width: 1280px) and (max-width: 1366px) {
                      margin-right: calc(2/1920*100vw);
                    }
                  }
                  .label-desc{
                    color: $tab;
                    font-size: 12px;
                  }
                  .label-0{
                    background-color: $red;
                  }
                  .label-1{
                    background-color: $onsite;
                  }
                  .label-2{
                    background-color: $store;
                  }
                }
              }
              .en-label{
                @media screen and (max-width: 1920px){
                  padding: 0 calc(5/1920*100vw);
                }
                @media screen and (max-width: 1660px){
                  padding: 0 calc(1/1920*100vw);
                }
              }
            }
          }
          .area-title{
            font-size: calc(20/1920*100vw);
            display: inline-block;
            /*margin-right: calc(10/1920*100vw);*/
          }
          .empty-content{
            font-size: calc(14/1920*100vw);
            color: $tab;
            padding-top: 140px;
            border-top: 1px solid $border;
          }
        }
      }
      .second-row {
        height: auto;
        margin-top: 30px;
        background-color: #fff;
        border: 1px solid $border;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .items-title{
          height: 70px;
          width: 100%;
          font-size: calc(20 / 1920 * 100vw);
          text-align: left;
          color: $black;
          border-bottom: 1px solid $border;
          .title {
            padding-top: 30px;
            padding-left: calc(30 / 1920 * 100vw);
            font-size: calc(20 / 1920 * 100vw);
            text-align: left;
            color: $black;
            display: inline-block;
          }
          .exprotBtn{
            padding-top: 25px;
            padding-right: calc(30 / 1920 * 100vw);
            float: right;
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
              .btn-area{
                position: relative;
                padding: 0 calc(6/1920*100vw);
                height: calc(36/1920*100vw);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-excel{
                  margin-right:calc(18/1920*100vw);
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
          }
        }
        .event-table {
          background-color: #fff;
          padding-top: calc(30/1920*100vw);
          .table{
            padding: 0 calc(30/1920*100vw)
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
  }
</style>
<style>
  @import '../../assets/css/pagination.css';
  .LoadDialog /deep/ .el-dialog__header{
    padding-bottom:0;
  }
  .LoadDialog /deep/ .el-dialog__body{
    padding:0px 20px 30px 20px;
  }
  .date-picker-poper .el-button--text{
    visibility: hidden !important;
  }
  .item-process .el-progress-bar .el-progress-bar__outer{
    background-color: #fff;
  }
  .store-list .el-select.el-input__inner, .store-list .el-select .el-input__inner:focus{
    border: 1px solid #E4E7ED !important;
  }
  .store-list .el-select .el-input.is-focus .el-input__inner{
    border: 1px solid #E4E7ED !important;
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
    padding-left: 20px;
    font-size: calc(14/1920*100vw);
    color: #182752;
  }
  .el-table__row.row-class{
    height: 35px;
  }
  body .el-table th.gutter {
    display: table-cell !important
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

  .name-wrapper .el-tag--small{
    width: 45px;
    font-size: calc(14/1920*100vw);
    font-family: Arial;
    padding: 0 0;
    text-align: center;
  }
  .remote .el-tag{
    color: #f31d65;
    border: 1px solid #f31d65;
  }
  .onsite .el-tag{
    color: #fb804f;
    border: 1px solid #fb804f;
  }
  .video .el-tag{
    color: #fccc3f;
    border: 1px solid #fccc3f;
  }

  .header-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .header-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }
  .cell-class .cell{
    padding-left: calc(20/1920*100vw) !important;
  }
  .cell-class:first-child .cell{
    padding-left: calc(70/1920*100vw) !important;
  }
  .el-table__empty-block{
    border-bottom: 1px solid #e3e9f4;
  }
  .el-table-panel .el-table.el-table--striped.el-table--border.el-table--enable-row-hover.el-table--mini{
    border-right: 1px solid #e3e9f4;
  }
</style>


